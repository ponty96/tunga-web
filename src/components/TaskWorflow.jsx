import React from "react";
import { renderToString } from "react-dom/server";
import { Link } from "react-router";
import moment from "moment";
import TimeAgo from "react-timeago";
import { OverlayTrigger, Popover } from "react-bootstrap";
import Linkify from "./Linkify";
import Joyride from "react-joyride";

import CommentSection from "../containers/CommentSection";
import Avatar from "./Avatar";
import CommentForm from "./CommentForm";
import ActivityList from "./ActivityList";
import LargeModal from "./LargeModal";
import ComponentWithModal from "./ComponentWithModal";
import Timeline from "./Timeline";
import MilestoneContainer from "../containers/MilestoneContainer";
import Milestone from "./Milestone";
import TagList from "./TagList";

import {
  parse_task_status,
  canAddEstimate,
  canEditEstimate,
  canViewEstimate,
  canAddQuote,
  canEditQuote,
  canViewQuote,
  getAcquisitionUrl,
  hasStarted
} from "../utils/tasks";
import { render_summary, nl_to_br } from "../utils/html";
import { getTaskKey } from "../utils/reducers";
import confirm from "../utils/confirm";

import { SOCIAL_PROVIDERS } from "../constants/Api";
import { isAdmin, getUser } from "../utils/auth";
import { sendGAPageView } from "../utils/tracking";

import {
  STATUS_REJECTED,
  STATUS_ACCEPTED,
  STATUS_INITIAL
} from "../constants/Api";

export function resizeOverviewBox() {
  var w_h = $(window).height();
  var nav_h = $("nav.navbar").height();
  var wf_h = $(".workflow-head").height();
  var t_h = nav_h + wf_h + 80;
  if (w_h > t_h) {
    $(".workflow-overview").css("height", w_h - t_h + "px");
  }
}

export default class TaskWorflow extends ComponentWithModal {
  constructor(props) {
    super(props);
    this.state = {
      ratings_map: null,
      modalEvent: {},
      messages: true,
      notifications: true,
      files: true,
      showFilter: false
    };
  }

  componentWillMount() {
    this.intervals = [];
    this.redirectToNextStep(this.props);

    if (this.props.params && this.props.params.eventId) {
      this.openMilestone(this.props.params.eventId);
    }
  }

  componentDidMount() {
    const { TaskActions, Task } = this.props;
    const { task } = Task.detail;

    TaskActions.listTaskActivity(task.id);

    resizeOverviewBox();
    $(window).resize(resizeOverviewBox);

    if (this.props.params.taskId) {
      this.setInterval(this.getNewActivity.bind(this), 5000);
    }

    $(window).click({ ref: this }, function(e) {
      //e.data.ref.setState({showFilter: false});
    });
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.params &&
      nextProps.params.eventId != this.props.params.eventId
    ) {
      this.openMilestone(nextProps.params.eventId);
    }

    if (
      nextProps.Task.detail.task.closed != this.props.Task.detail.task.closed
    ) {
      this.redirectToNextStep(nextProps);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.task && this.props.task) {
      const had_started = hasStarted(prevProps.task);
      const has_started = hasStarted(this.props.task);

      if (!had_started && has_started) {
        sendGAPageView(getAcquisitionUrl(this.props.task, true));
      }
    }
  }

  componentWillUnmount() {
    this.intervals.map(clearInterval);
  }

  setInterval() {
    this.intervals.push(setInterval.apply(null, arguments));
  }

  redirectToNextStep(props) {
    const { task } = props;

    if (
      getUser().id == task.user.id &&
      (task.closed ||
        (task.is_task &&
          (!task.approved ||
            !task.participation ||
            !task.participation.length))) &&
      (!this.props.location.query || !this.props.location.query.nr) &&
      (!props.params || !props.params.eventId)
    ) {
      const { router } = this.context;
      var next = null;
      if (!task.approved) {
        next = `/work/${task.id}/edit/complete-task`;
      } else if (!task.participation || !task.participation.length) {
        next = `/work/${task.id}/applications`;
      } else if (task.paid) {
        next = `/work/${task.id}/rate`;
      } else {
        next = `/work/${task.id}/pay`;
      }

      if (next) {
        router.replace(next);
      }
    }
  }

  getNewActivity() {
    const { Task, TaskActions, search, filters } = this.props;
    let taskId = this.props.params.taskId;
    let task_key = getTaskKey(taskId);

    if (taskId && !Task.detail.activity.isFetching[task_key]) {
      var since = 0;
      const task_activity_items = Task.detail.activity.items[task_key];
      if (task_activity_items.length) {
        since = task_activity_items[task_activity_items.length - 1].id;
        if (since === undefined || since === null) {
          [...task_activity_items].reverse().some(item => {
            if (item.id) {
              since = item.id;
            }
            return item.id;
          });
        }
      }
      TaskActions.listTaskActivity(taskId, { since, ...filters, search });
    }
  }

  handleCloseApplications() {
    const { TaskActions, Task } = this.props;

    confirm("Confirm close applications").then(function() {
      TaskActions.updateTask(Task.detail.task.id, {
        apply: false,
        apply_closed_at: moment.utc().format()
      });
    });
  }

  handleOpenApplications() {
    const { TaskActions, Task } = this.props;
    TaskActions.updateTask(Task.detail.task.id, {
      apply: true,
      apply_closed_at: null
    });
  }

  handleCloseTask() {
    const { TaskActions, Task } = this.props;

    confirm("Confirm close task").then(function() {
      TaskActions.updateTask(Task.detail.task.id, {
        closed: true,
        closed_at: moment.utc().format()
      });
    });
  }

  handleOpenTask() {
    const { TaskActions, Task } = this.props;
    TaskActions.updateTask(Task.detail.task.id, {
      closed: false,
      closed_at: null
    });
  }

  handleMarkPaid() {
    const { TaskActions, Task } = this.props;
    confirm("Confirm mark as paid").then(function() {
      TaskActions.updateTask(Task.detail.task.id, {
        paid: true,
        paid_at: moment.utc().format()
      });
    });
  }

  handleDeleteTask() {
    const { TaskActions, Task } = this.props;
    confirm("Confirm delete Task").then(function() {
      TaskActions.deleteTask(Task.detail.task.id);
    });
  }

  handleAcceptTask() {
    const { TaskActions, Task } = this.props;
    TaskActions.updateTask(Task.detail.task.id, {
      participation: [{ user: getUser().id, status: STATUS_ACCEPTED }]
    });
  }

  handleRejectTask() {
    const { TaskActions, Task } = this.props;
    confirm("Confirm reject task").then(function() {
      TaskActions.updateTask(Task.detail.task.id, {
        participation: [{ user: getUser().id, status: STATUS_REJECTED }]
      });
    });
  }

  onReturnProject() {
    const { TaskActions, task } = this.props;
    confirm("Confirm return project").then(function() {
      TaskActions.returnTask(task.id);
    });
  }

  onUpload(files) {
    const { Task, TaskActions } = this.props;
    const { task } = Task.detail;
    TaskActions.updateTask(task.id, null, files);
  }

  openMilestone(event) {
    if (event) {
      this.setState({ modalEvent: { id: event } });
      this.open();
    }
  }

  onToggleFilter(key, e) {
    e.stopPropagation();
    var new_state = {};
    new_state[key] = !this.state[key];
    this.setState(new_state);
  }

  renderModalContent() {
    return (
      <div>
        <LargeModal
          title={this.state.modalEvent.title || "Task Update"}
          show={this.state.showModal}
          onHide={this.close.bind(this)}
        >
          <MilestoneContainer>
            <Milestone milestone_id={this.state.modalEvent.id} />
          </MilestoneContainer>
        </LargeModal>
      </div>
    );
  }

  getNewApplications() {
    const { task, Task, TaskActions } = this.props;
    var new_applications = [];
    task.details.applications.map(application => {
      if (application.status == STATUS_INITIAL) {
        new_applications.push(application);
      }
    });
    return new_applications.length;
  }

  render() {
    const { task, Task, TaskActions } = this.props;
    const { uploads } = Task.detail;
    var task_status = parse_task_status(task);

    let is_owner = [task.user.id, task.owner].indexOf(getUser().id) > -1;
    let is_admin_or_owner = is_owner || isAdmin();

    let is_pm = task.pm == getUser().id;
    let is_confirmed_assignee =
      task.assignee &&
      task.assignee.status == STATUS_ACCEPTED &&
      task.assignee.user.id == getUser().id;

    let workflow_link = `/work/${task.id}/?nr=true`;
    let can_pay = is_admin_or_owner && task.closed && !task.paid;
    let can_rate = is_admin_or_owner && task.closed && task.paid;
    let can_edit_shares =
      isAdmin() ||
      (is_confirmed_assignee &&
        task.details &&
        task.details.participation_shares.length > 1);
    let work_type = task.is_project ? "project" : "task";
    let new_applications = this.getNewApplications();

    let is_project_task = task && task.parent;

    const pay_popover = (
      <Popover id="popover">
        <div>
          {task.paid
            ? "Payment has been completed"
            : "Close the task to move to this step"}
        </div>
      </Popover>
    );

    const rate_dev_popover = (
      <Popover id="popover">
        <div>Close the task and make the payment to move to this step</div>
      </Popover>
    );

    let steps = [
      ...steps,
      {
        title: "View Applications",
        text: "View Task Applications from developers",
        selector: "#view-applications-btn",
        position: "bottom"
      },
      {
        title: "Project Board",
        text: "View Project Board",
        selector: "#project-board-btn",
        position: "bottom"
      },
      {
        title: "Make Payment",
        text: "Make payments to developers",
        selector: "#make-payment-btn",
        position: "bottom"
      },
      {
        title: "Rate Developers",
        text: "Rate Project Developers",
        selector: "#rate-developers-btn",
        position: "bottom"
      },
      {
        title: "Participation Shares",
        text: "Participation shares",
        selector: "#participation-shares-btn",
        position: "bottom"
      },
      {
        title: "Configure updates",
        text: "Manage updates",
        selector: "#configure-updates-btn",
        position: "bottom"
      },
      {
        title: "Settings",
        text: "Manage Settings",
        selector: "#menu-btn",
        position: "bottom"
      },
      {
        title: "Github Repo",
        text: "View project or task on github",
        selector: "#github-btn",
        position: "left"
      },
      {
        title: "Slack team",
        text: "Go to project or task slack team",
        selector: "#slack-btn",
        position: "left"
      },
      {
        title: "Comment Area",
        text: "View activity about your task or project",
        selector: "#comment-box",
        position: "top"
      },
      {
        title: "Comment Widget",
        text: "Share messages and upload files",
        selector: "#comment-widget",
        position: "top"
      },
      {
        title: "Sidebar Bar",
        text: "View your task or project details",
        selector: "#sidebox",
        position: "left"
      }
    ];

    return (
      <div>
        {this.renderModalContent()}

        <Joyride
          ref="joyride_workflow"
          steps={steps}
          run={!__PRODUCTION__ || __PRERELEASE__}
          debug={!__PRODUCTION__ || __PRERELEASE__}
          autoStart={!__PRODUCTION__ || __PRERELEASE__}
          type="continuous"
          showStepsProgress={true}
          showSkipButton={true}
        />

        <div className="workflow-head clearfix">
          <div className="" style={{ marginBottom: "10px" }}>
            <div className="title">
              {task.parent && task.details
                ? <span>
                    <Link to={`/work/${task.parent}/`} className="small">
                      {render_summary(
                        task.details.parent.title || task.summary,
                        30
                      )}
                    </Link>
                  </span>
                : null}
              <span>
                <Link to={`/work/${task.id}/`}>
                  {task.summary}
                </Link>
              </span>
            </div>
            {task.is_developer_ready
              ? <span className="task-status">
                  <i className={"fa fa-circle " + task_status.css} />{" "}
                  {task_status.message} |{" "}
                </span>
              : null}
            <span className="time">
              Posted{" "}
              <TimeAgo date={moment.utc(task.created_at).local().format()} />
            </span>
          </div>

          {!task.is_developer_ready
            ? <div className="nav-top-filter pull-left">
                {canAddEstimate(task)
                  ? <Link to={`/work/${task.id}/estimate/new`} className="btn">
                      Add Estimate
                    </Link>
                  : canEditEstimate(task)
                    ? <Link
                        to={`/work/${task.id}/estimate/${task.estimate
                          .id}/edit`}
                        className="btn"
                      >
                        Edit Estimate
                      </Link>
                    : canViewEstimate(task)
                      ? <Link
                          to={`/work/${task.id}/estimate/${task.estimate.id}`}
                          className="btn"
                        >
                          View Estimate
                        </Link>
                      : null}

                {canAddQuote(task)
                  ? <Link to={`/work/${task.id}/quote/new`} className="btn">
                      Add Quote
                    </Link>
                  : canEditQuote(task)
                    ? <Link
                        to={`/work/${task.id}/quote/${task.quote.id}/edit`}
                        className="btn"
                      >
                        Edit Quote
                      </Link>
                    : canViewQuote(task)
                      ? <Link
                          to={`/work/${task.id}/quote/${task.quote.id}`}
                          className="btn"
                        >
                          View Quote
                        </Link>
                      : null}

                {task.can_return
                  ? <button
                      className="btn"
                      onClick={this.onReturnProject.bind(this)}
                    >
                      Return {work_type}
                    </button>
                  : null}
              </div>
            : null}

          {/*task.is_developer_ready &&*/ is_admin_or_owner ||
          task.is_admin ||
          task.is_participant
            ? <div className="nav-top-filter">
                {is_admin_or_owner || can_edit_shares
                  ? <div className="pull-left">
                      {task.is_developer_ready && is_admin_or_owner
                        ? <Link
                            to={`/work/${task.id}/applications/`}
                            className="btn"
                            id="view-applications-btn"
                          >
                            View applications{" "}
                            {new_applications
                              ? <span className="badge">
                                  {new_applications}
                                </span>
                              : null}
                          </Link>
                        : null}
                      {task.is_developer_ready &&
                      is_admin_or_owner &&
                      task.is_project
                        ? <Link
                            to={`/work/${task.id}/board/`}
                            className="btn"
                            id="project-board-btn"
                          >
                            Project Board
                          </Link>
                        : null}
                      {can_pay
                        ? <Link
                            to={`/work/${task.id}/pay/`}
                            className="btn"
                            id="make-payment-btn"
                          >
                            {can_pay
                              ? "Make payment"
                              : <OverlayTrigger
                                  placement="top"
                                  overlay={pay_popover}
                                >
                                  <div>Make payment</div>
                                </OverlayTrigger>}
                          </Link>
                        : null}
                      {can_rate
                        ? <Link
                            to={
                              can_rate
                                ? `/work/${task.id}/rate/`
                                : workflow_link
                            }
                            className="btn"
                            id="rate-developers-btn"
                          >
                            {can_rate
                              ? "Rate Developers"
                              : <OverlayTrigger
                                  placement="top"
                                  overlay={rate_dev_popover}
                                >
                                  <div>Rate Developers</div>
                                </OverlayTrigger>}
                          </Link>
                        : null}
                      {task.is_developer_ready &&
                      can_edit_shares &&
                      task.details &&
                      task.details.participation &&
                      task.details.participation.length
                        ? <Link
                            to={`/work/${task.id}/participation/`}
                            className="btn"
                            id="participation-shares-btn"
                          >
                            Participation shares
                          </Link>
                        : null}

                      {task.is_developer_ready &&
                      !is_project_task &&
                      is_admin_or_owner
                        ? <Link
                            to={`/work/${task.id}/edit/updates/`}
                            className="btn"
                            id="configure-updates-btn"
                          >
                            Configure updates
                          </Link>
                        : null}

                      {is_admin_or_owner
                        ? <div
                            className="dropdown"
                            style={{ display: "inline-block" }}
                          >
                            <button
                              className="btn"
                              type="button"
                              id="chat-overflow"
                              data-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="true"
                            >
                              {work_type} actions{" "}
                              <i className="fa fa-ellipsis-v" id="menu-btn" />
                            </button>
                            <ul
                              className="dropdown-menu dropdown-menu-right"
                              aria-labelledby="chat-overflow"
                            >
                              {is_admin_or_owner
                                ? [
                                    <li>
                                      <Link
                                        to={`/work/${task.id}/edit/title`}
                                        className="btn"
                                      >
                                        Edit {work_type} title
                                      </Link>
                                    </li>,
                                    <li>
                                      <Link
                                        to={`/work/${task.id}/edit/description`}
                                        className="btn"
                                      >
                                        Edit {work_type} description
                                      </Link>
                                    </li>,
                                    task.is_developer_ready && task.pay
                                      ? <li>
                                          <Link
                                            to={`/work/${task.id}/edit/fee`}
                                            className="btn"
                                          >
                                            Edit the fee for the {work_type}
                                          </Link>
                                        </li>
                                      : null,
                                    <li>
                                      <Link
                                        to={`/work/${task.id}/edit/skills`}
                                        className="btn"
                                      >
                                        Add skills
                                      </Link>
                                    </li>,
                                    isAdmin() && !task.owner
                                      ? <li>
                                          <Link
                                            to={`/work/${task.id}/edit/owner`}
                                            className="btn"
                                          >
                                            Add Project Owner
                                          </Link>
                                        </li>
                                      : null,
                                    task.is_project && !task.pm
                                      ? <li>
                                          <Link
                                            to={`/work/${task.id}/edit/pm`}
                                            className="btn"
                                          >
                                            Assign a PM to this {work_type}
                                          </Link>
                                        </li>
                                      : null,
                                    task.is_developer_ready
                                      ? <li>
                                          <Link
                                            to={`/work/${task.id}/edit/developers`}
                                            className="btn"
                                          >
                                            Add another developer to this{" "}
                                            {work_type}
                                          </Link>
                                        </li>
                                      : null,
                                    task.is_developer_ready && !task.parent
                                      ? <li>
                                          <Link
                                            to={`/work/${task.id}/edit/milestone`}
                                            className="btn"
                                          >
                                            Add a milestone
                                          </Link>
                                        </li>
                                      : null,
                                    task.is_developer_ready && !task.closed
                                      ? <li>
                                          {task.apply
                                            ? <button
                                                type="button"
                                                className="btn "
                                                onClick={this.handleCloseApplications.bind(
                                                  this
                                                )}
                                              >
                                                Close applications
                                              </button>
                                            : <button
                                                type="button"
                                                className="btn "
                                                onClick={this.handleOpenApplications.bind(
                                                  this
                                                )}
                                              >
                                                Open applications
                                              </button>}
                                        </li>
                                      : null,
                                    task.is_developer_ready
                                      ? <li>
                                          {task.closed
                                            ? task.paid
                                              ? null
                                              : <button
                                                  type="button"
                                                  className="btn"
                                                  onClick={this.handleOpenTask.bind(
                                                    this
                                                  )}
                                                >
                                                  Open {work_type}
                                                </button>
                                            : <button
                                                type="button"
                                                className="btn"
                                                onClick={this.handleCloseTask.bind(
                                                  this
                                                )}
                                              >
                                                Close {work_type}
                                              </button>}
                                        </li>
                                      : null,
                                    task.is_developer_ready &&
                                    task.closed &&
                                    !task.paid &&
                                    isAdmin()
                                      ? <li>
                                          <button
                                            type="button"
                                            className="btn"
                                            onClick={this.handleMarkPaid.bind(
                                              this
                                            )}
                                          >
                                            Mark as paid
                                          </button>
                                        </li>
                                      : null,
                                    <li>
                                      <button
                                        type="button"
                                        className="btn"
                                        onClick={this.handleDeleteTask.bind(
                                          this
                                        )}
                                      >
                                        <i className="fa fa-trash-o" /> Delete{" "}
                                        {work_type}
                                      </button>
                                    </li>
                                  ]
                                : null}
                            </ul>
                          </div>
                        : null}
                    </div>
                  : null}
                {task.is_developer_ready &&
                !task.closed &&
                task.is_participant &&
                task.my_participation &&
                task.my_participation.status == STATUS_INITIAL
                  ? <div className="pull-right">
                      <button
                        type="button"
                        className="btn"
                        onClick={this.handleAcceptTask.bind(this)}
                      >
                        Accept task
                      </button>
                      <button
                        type="button"
                        className="btn"
                        onClick={this.handleRejectTask.bind(this)}
                      >
                        Reject task
                      </button>
                    </div>
                  : null}
              </div>
            : null}

          <div className="pull-right" style={{ width: "30%" }}>
            {task.is_developer_ready && is_admin_or_owner && !task.parent
              ? <ul className="integration-options pull-right">
                  <li id="github-btn">
                    <Link
                      to={`/work/${task.id}/integrations/${SOCIAL_PROVIDERS.github}`}
                      activeClassName="active"
                      title="GitHub"
                    >
                      <i className="fa fa-github" />
                    </Link>
                  </li>
                  <li id="slack-btn">
                    <Link
                      to={`/work/${task.id}/integrations/${SOCIAL_PROVIDERS.slack}`}
                      activeClassName="active"
                      title="Slack"
                    >
                      <i className="fa fa-slack" />
                    </Link>
                  </li>
                  <li id="trello-btn">
                    <Link
                      to={`/work/${task.id}/edit/${SOCIAL_PROVIDERS.trello}`}
                      activeClassName="active"
                      title="Trello"
                    >
                      <i className="fa fa-trello" />
                    </Link>
                  </li>
                  <li id="google-drive-btn">
                    <Link
                      to={`/work/${task.id}/edit/${SOCIAL_PROVIDERS[
                        "google-drive"
                      ]}`}
                      activeClassName="active"
                      title="Google Drive"
                    >
                      <i className="tunga-icon-google-drive" />
                    </Link>
                  </li>
                </ul>
              : <span>&nbsp;</span>}
          </div>

          <div className="pull-right">
            <div
              className={`dropdown activity-filter ${this.state.showFilter
                ? "open"
                : ""}`}
              onClick={() => {
                this.setState({ showFilter: !this.state.showFilter });
              }}
            >
              <button className="btn filter-btn dropdown-toggle">
                <i className="tunga-icon-filter" />
              </button>
              <div className="dropdown-menu">
                <div>
                  Messages{" "}
                  <i
                    className={`switch fa fa-toggle-${this.state.messages
                      ? "on"
                      : "off"}`}
                    onClick={this.onToggleFilter.bind(this, "messages")}
                  />
                </div>
                <div>
                  Notifications{" "}
                  <i
                    className={`switch fa fa-toggle-${this.state.notifications
                      ? "on"
                      : "off"}`}
                    onClick={this.onToggleFilter.bind(this, "notifications")}
                  />
                </div>
                <div>
                  Files{" "}
                  <i
                    className={`switch fa fa-toggle-${this.state.files
                      ? "on"
                      : "off"}`}
                    onClick={this.onToggleFilter.bind(this, "files")}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="workflow-overview overview">
          <div className="mainbox chatbox">
            {task.details
              ? <div className="list-box">
                  <ActivityList
                    activities={
                      Task.detail.activity.items[getTaskKey(task.id)] || []
                    }
                    isLoading={
                      Task.detail.activity.isFetching[getTaskKey(task.id)] ||
                      false
                    }
                    isLoadingMore={
                      Task.detail.activity.isFetchingMore[
                        getTaskKey(task.id)
                      ] || false
                    }
                    loadMoreUrl={
                      Task.detail.activity.next[getTaskKey(task.id)] || null
                    }
                    loadMoreCallback={TaskActions.listMoreTaskActivity}
                    loadMoreText="Show older activity"
                    showMessages={this.state.messages}
                    showNotifications={this.state.notifications}
                    showFiles={this.state.files}
                  />
                </div>
              : null}
            {task.details
              ? <CommentSection className="comment-box" id="comment-box">
                  <CommentForm
                    object_details={{
                      content_type: task.content_type,
                      object_id: task.id
                    }}
                    uploadCallback={this.onUpload.bind(this)}
                    uploadSaved={Task.detail.isSaved}
                    isSaving={Task.detail.isSaving}
                    id="comment-widget"
                  />
                </CommentSection>
              : null}
          </div>

          <div className="sidebox" id="sidebox">
            <div className="overview-details">
              <div className="wrapper">
                <Timeline
                  task={task}
                  start={task.created_at}
                  end={task.deadline}
                  events={task.progress_events}
                  openMilestone={this.openMilestone.bind(this)}
                >
                  <div className="pledge">
                    {task.display_fee}
                  </div>

                  {task.deadline
                    ? <div className="deadline">
                        <i className="fa fa-clock-o fa-2x" />{" "}
                        <span className="bold">
                          {moment
                            .utc(task.deadline)
                            .local()
                            .format("Do MMM 'YY")}
                        </span>
                      </div>
                    : null}
                </Timeline>

                <div className="task-info">
                  {task.description
                    ? <div>
                        <strong>Description</strong>
                        <div className="description">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: nl_to_br(
                                renderToString(
                                  <Linkify properties={{ target: "_blank" }}>
                                    {task.description}
                                  </Linkify>
                                )
                              )
                            }}
                          />
                        </div>
                      </div>
                    : null}

                  {task.owner && task.details && task.details.owner
                    ? <div>
                        <strong>Project Owner</strong>
                        <div>
                          <Avatar src={task.details.owner.avatar_url} />{" "}
                          <Link to={`/people/${task.details.owner.username}/`}>
                            {task.details.owner.display_name}
                          </Link>
                        </div>
                      </div>
                    : null}

                  <strong>Posted by</strong>
                  <div>
                    <Avatar src={task.user.avatar_url} />{" "}
                    <Link to={`/people/${task.user.username}/`}>
                      {task.user.display_name}
                    </Link>
                  </div>

                  {task.pm && task.details && task.details.pm
                    ? <div>
                        <strong>Project Manager</strong>
                        <div>
                          <Avatar src={task.details.pm.avatar_url} />{" "}
                          <Link to={`/people/${task.details.pm.username}/`}>
                            {task.details.pm.display_name}
                          </Link>
                        </div>
                      </div>
                    : null}

                  {task.assignee
                    ? <div>
                        <strong>Assignee</strong>
                        <div className="collaborator">
                          <Avatar src={task.assignee.user.avatar_url} />
                          <Link to={`/people/${task.assignee.user.username}/`}>
                            {task.assignee.user.display_name}
                          </Link>
                          <span className="status">
                            {task.assignee.status == STATUS_ACCEPTED
                              ? <i className="fa fa-check-circle accepted" />
                              : "[Invited]"}
                          </span>
                        </div>
                      </div>
                    : null}

                  {task.details &&
                  task.details.participation &&
                  task.details.participation.length > (task.assignee ? 1 : 0)
                    ? <div>
                        <strong>Developers</strong>
                        {task.details.participation.map(participation => {
                          const participant = participation.user;
                          return (!task.assignee ||
                            participant.id != task.assignee.user.id) &&
                          participation.status != STATUS_REJECTED
                            ? <div
                                className="collaborator"
                                key={participant.id}
                              >
                                <Avatar src={participant.avatar_url} />
                                <Link to={`/people/${participant.username}/`}>
                                  {participant.display_name}
                                </Link>
                                <span className="status">
                                  {participation.status == STATUS_ACCEPTED
                                    ? <i className="fa fa-check-circle accepted" />
                                    : "[Invited]"}
                                </span>
                              </div>
                            : null;
                        })}
                      </div>
                    : null}

                  {task.url
                    ? <div>
                        <strong>
                          <i className="fa fa-globe" /> Code Location
                        </strong>
                        <p>
                          <a href={task.url} target="_blank">
                            {task.url}
                          </a>
                        </p>
                      </div>
                    : null}
                  {task.details && task.details.skills.length
                    ? <div>
                        <strong>Skills/ Products</strong>
                        <TagList
                          tags={task.details.skills}
                          max={3}
                          linkPrefix="/work/skill/"
                          moreLink={`/work/${task.id}/`}
                        />
                      </div>
                    : null}
                  {task.trello_board_url
                    ? <div>
                        <strong>
                          <i className="fa fa-trello trello" /> Trello board
                        </strong>
                        <p>
                          <a href={task.trello_board_url} target="_blank">
                            {task.trello_board_url}
                          </a>
                        </p>
                      </div>
                    : null}
                  {task.google_drive_url
                    ? <div>
                        <strong>
                          <i className="tunga-icon-google-drive google" />{" "}
                          Google Drive
                        </strong>
                        <p>
                          <a href={task.google_drive_url} target="_blank">
                            {task.google_drive_url}
                          </a>
                        </p>
                      </div>
                    : null}
                  {task.milestones.length
                    ? <div>
                        <strong>Milestones</strong>
                        {task.milestones.map(milestone => {
                          return (
                            <div key={milestone.id}>
                              <Link
                                to={`/work/${task.id}/event/${milestone.id}`}
                              >
                                <i
                                  className={
                                    "fa fa-flag" +
                                    (milestone.type == 4 ? "-checkered" : "-o")
                                  }
                                />{" "}
                                {milestone.title}
                                <span style={{ marginLeft: "5px" }}>
                                  {moment
                                    .utc(milestone.due_at)
                                    .local()
                                    .format("Do, MMMM YYYY")}
                                </span>
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                    : null}

                  {[
                    { key: "deliverables", title: "Deliverables" },
                    { key: "stack_description", title: "Technology Stack" }
                  ].map(item => {
                    if (task[item.key]) {
                      return (
                        <div>
                          <strong>
                            {item.title}
                          </strong>
                          <div>
                            <Linkify properties={{ target: "_blank" }}>
                              {task[item.key]}
                            </Linkify>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

TaskWorflow.contextTypes = {
  router: React.PropTypes.object.isRequired
};
