import React from "react";
import moment from "moment";
import _ from "lodash";
import momentLocalizer from "react-widgets/lib/localizers/moment";
import { Table } from "react-bootstrap";

import FormStatus from "./status/FormStatus";
import FieldError from "./status/FieldError";
import ComponentWithModal from "./ComponentWithModal";
import LargeModal from "./LargeModal";
import ActivityForm from "./ActivityForm";
import PlanForm from "./PlanForm";

import {
  DEVELOPER_FEE,
  STATUS_SUBMITTED,
  STATUS_ACCEPTED
} from "../constants/Api";
import { getPayDetails, canAddQuote, canEditQuote } from "../utils/tasks";
import { getUser, isAdminOrProjectOwner } from "../utils/auth";
import { parseNumber } from "../utils/helpers";

momentLocalizer(moment);

export default class QuoteForm extends ComponentWithModal {
  constructor(props) {
    super(props);
    this.state = {
      introduction: "",
      activities: [],
      plan: [],
      modalActivity: null,
      modalContent: null,
      modalTitle: "",
      submitted: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const quote = this.props.quote || {};
    var estimate = {};
    if (!quote.id) {
      const task = this.props.task || {};
      estimate = task.estimate;
    }
    this.setState({ ...estimate, ...quote });
  }

  componentDidUpdate(prevProps, prevState) {
    const { Quote } = this.props;

    const quote = this.props.quote || {};

    if (this.props.Quote.detail.isSaved && !prevProps.Quote.detail.isSaved) {
      if (!this.props.quote) {
        const { router } = this.context;
        router.replace(
          `/work/${Quote.detail.quote.task}/quote/${Quote.detail.quote.id}`
        );
      }

      if (
        this.props.quote.id != Quote.detail.quote.id ||
        Quote.detail.quote.status == STATUS_ACCEPTED
      ) {
        const { router } = this.context;
        window.location.href = `/work/${Quote.detail.quote.task}/quote/${Quote
          .detail.quote.id}`;
      }

      this.setState({ ...Quote.detail.quote, submitted: false });
    }

    if (this.props.Quote.detail.quote.id && !prevProps.Quote.detail.quote.id) {
      this.setState({ ...this.props.Quote.detail.quote });
    }
  }

  onInputChange(key, e) {
    var new_state = {};
    new_state[key] = e.target.value;
    this.setState(new_state);
  }

  onStateValueChange(key, value) {
    var new_state = {};
    new_state[key] = value;
    this.setState(new_state);
  }

  onComposeActivity(activity) {
    this.setState({
      modalActivity: activity,
      modalContent: "activity",
      modalTitle: "Add activity"
    });
    this.open();
  }

  onComposePlan(milestone) {
    this.setState({
      modalActivity: milestone,
      modalContent: "plan",
      modalTitle: "Add milestone"
    });
    this.open();
  }

  onAddActivity(activity) {
    var new_activities = this.state.activities;
    if (activity.idx > -1) {
      new_activities[activity.idx] = activity;
    } else {
      new_activities = [...new_activities, activity];
    }
    this.setState({ activities: new_activities });
  }

  onAddMilestone(milestone) {
    var new_plans = this.state.plan;
    if (milestone.idx > -1) {
      new_plans[milestone.idx] = milestone;
    } else {
      new_plans = [...new_plans, milestone];
    }
    this.setState({ plan: new_plans });
  }

  onDelete(idx) {
    if (idx > -1) {
      let activities = Array.from(
        new Set([
          ...this.state.activities.slice(0, idx),
          ...this.state.activities.slice(idx + 1)
        ])
      );
      this.setState({ activities });
    }
  }

  onDeletePlan(idx) {
    if (idx > -1) {
      let plan = Array.from(
        new Set([
          ...this.state.plan.slice(0, idx),
          ...this.state.plan.slice(idx + 1)
        ])
      );
      this.setState({ plan });
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    var introduction = this.state.introduction;
    var in_scope = this.state.in_scope;
    var out_scope = this.state.out_scope;
    var assumptions = this.state.assumptions;
    var deliverables = this.state.deliverables;
    var architecture = this.state.architecture;
    var technology = this.state.technology;
    var process = this.state.process;
    var reporting = this.state.reporting;
    var activities = this.state.activities;
    var plan = this.state.plan;

    const { QuoteActions } = this.props;
    const quote = this.props.quote || {};
    const task = this.props.task || {};

    let quote_info = {
      introduction,
      activities,
      in_scope,
      out_scope,
      assumptions,
      deliverables,
      architecture,
      technology,
      process,
      reporting,
      plan
    };

    if (!quote.id) {
      quote_info.task = task.id;
    }

    if (this.state.submitted) {
      quote_info.status = STATUS_SUBMITTED;
    }

    if (quote.id) {
      QuoteActions.updateQuote(quote.id, quote_info);
    } else {
      QuoteActions.createQuote(quote_info);
    }
    return;
  }

  renderModalContent() {
    return (
      <div>
        <LargeModal
          title={this.state.modalTitle}
          show={this.state.showModal}
          onHide={this.close.bind(this)}
        >
          {this.state.modalContent == "activity"
            ? <ActivityForm
                activity={this.state.modalActivity}
                onSave={this.onAddActivity.bind(this)}
                close={this.close.bind(this)}
              />
            : null}
          {this.state.modalContent == "plan"
            ? <PlanForm
                activity={this.state.modalActivity}
                onSave={this.onAddMilestone.bind(this)}
                close={this.close.bind(this)}
              />
            : null}
        </LargeModal>
      </div>
    );
  }

  render() {
    const { Quote } = this.props;
    const task = this.props.task || {};
    const quote = this.props.quote || {};

    let payDetails = getPayDetails(this.state.activities);

    return (
      <div className="form-wrapper">
        {this.renderModalContent()}
        <form
          onSubmit={this.handleSubmit}
          name="quote-form"
          role="form"
          ref="quote_form"
        >
          <FormStatus
            loading={Quote.detail.isSaving}
            success={Quote.detail.isSaved}
            message={`Quote ${quote.status == STATUS_SUBMITTED
              ? "submitted"
              : "saved"} successfully`}
            error={Quote.detail.error.create}
          />

          {Quote.detail.error.create && Quote.detail.error.create.message
            ? <FieldError message={Quote.detail.error.create.message} />
            : null}
          {Quote.detail.error.update && Quote.detail.error.update.message
            ? <FieldError message={Quote.detail.error.update.message} />
            : null}

          {Quote.detail.error.create && Quote.detail.error.create.introduction
            ? <FieldError message={Quote.detail.error.create.introduction} />
            : null}
          {Quote.detail.error.update && Quote.detail.error.update.introduction
            ? <FieldError message={Quote.detail.error.update.introduction} />
            : null}
          <div className="form-group">
            <label className="control-label">Introduction *</label>
            <textarea
              className="form-control"
              onChange={this.onInputChange.bind(this, "introduction")}
              value={this.state.introduction}
              ref="introduction"
              placeholder="Introduction"
            />
          </div>

          <h4>Scope</h4>

          {Quote.detail.error.create && Quote.detail.error.create.in_scope
            ? <FieldError message={Quote.detail.error.create.in_scope} />
            : null}
          {Quote.detail.error.update && Quote.detail.error.update.in_scope
            ? <FieldError message={Quote.detail.error.update.in_scope} />
            : null}
          <div className="form-group">
            <label className="control-label">In scope *</label>
            <textarea
              className="form-control"
              onChange={this.onInputChange.bind(this, "in_scope")}
              value={this.state.in_scope}
              ref="introduction"
              placeholder="In scope"
            />
          </div>

          {Quote.detail.error.create && Quote.detail.error.create.out_scope
            ? <FieldError message={Quote.detail.error.create.out_scope} />
            : null}
          {Quote.detail.error.update && Quote.detail.error.update.out_scope
            ? <FieldError message={Quote.detail.error.update.out_scope} />
            : null}
          <div className="form-group">
            <label className="control-label">Out of scope *</label>
            <textarea
              className="form-control"
              onChange={this.onInputChange.bind(this, "out_scope")}
              value={this.state.out_scope}
              ref="out_scope"
              placeholder="Out of scope"
            />
          </div>

          {Quote.detail.error.create && Quote.detail.error.create.assumptions
            ? <FieldError message={Quote.detail.error.create.assumptions} />
            : null}
          {Quote.detail.error.update && Quote.detail.error.update.assumptions
            ? <FieldError message={Quote.detail.error.update.assumptions} />
            : null}
          <div className="form-group">
            <label className="control-label">Assumptions *</label>
            <textarea
              className="form-control"
              onChange={this.onInputChange.bind(this, "assumptions")}
              value={this.state.assumptions}
              ref="out_scope"
              placeholder="Assumptions"
            />
          </div>

          {Quote.detail.error.create && Quote.detail.error.create.deliverables
            ? <FieldError message={Quote.detail.error.create.deliverables} />
            : null}
          {Quote.detail.error.update && Quote.detail.error.update.deliverables
            ? <FieldError message={Quote.detail.error.update.deliverables} />
            : null}
          <div className="form-group">
            <label className="control-label">Deliverables *</label>
            <textarea
              className="form-control"
              onChange={this.onInputChange.bind(this, "deliverables")}
              value={this.state.deliverables}
              ref="out_scope"
              placeholder="Deliverables"
            />
          </div>

          <h4>Solution</h4>

          {Quote.detail.error.create && Quote.detail.error.create.architecture
            ? <FieldError message={Quote.detail.error.create.architecture} />
            : null}
          {Quote.detail.error.update && Quote.detail.error.update.architecture
            ? <FieldError message={Quote.detail.error.update.architecture} />
            : null}
          <div className="form-group">
            <label className="control-label">Architecture *</label>
            <textarea
              className="form-control"
              onChange={this.onInputChange.bind(this, "architecture")}
              value={this.state.architecture}
              ref="out_scope"
              placeholder="Architecture"
            />
          </div>

          {Quote.detail.error.create && Quote.detail.error.create.technology
            ? <FieldError message={Quote.detail.error.create.technology} />
            : null}
          {Quote.detail.error.update && Quote.detail.error.update.technology
            ? <FieldError message={Quote.detail.error.update.technology} />
            : null}
          <div className="form-group">
            <label className="control-label">Technologies *</label>
            <textarea
              className="form-control"
              onChange={this.onInputChange.bind(this, "technology")}
              value={this.state.technology}
              ref="out_scope"
              placeholder="Technologies"
            />
          </div>

          <h4>Methodology</h4>

          {Quote.detail.error.create && Quote.detail.error.create.process
            ? <FieldError message={Quote.detail.error.create.process} />
            : null}
          {Quote.detail.error.update && Quote.detail.error.update.process
            ? <FieldError message={Quote.detail.error.update.process} />
            : null}
          <div className="form-group">
            <label className="control-label">Process *</label>
            <textarea
              className="form-control"
              onChange={this.onInputChange.bind(this, "process")}
              value={this.state.process}
              ref="out_scope"
              placeholder="Process"
            />
          </div>

          {Quote.detail.error.create && Quote.detail.error.create.reporting
            ? <FieldError message={Quote.detail.error.create.reporting} />
            : null}
          {Quote.detail.error.update && Quote.detail.error.update.reporting
            ? <FieldError message={Quote.detail.error.update.reporting} />
            : null}
          <div className="form-group">
            <label className="control-label">Reporting *</label>
            <textarea
              className="form-control"
              onChange={this.onInputChange.bind(this, "reporting")}
              value={this.state.reporting}
              ref="out_scope"
              placeholder="Reporting"
            />
          </div>

          {Quote.detail.error.create && Quote.detail.error.create.activities
            ? <FieldError message={Quote.detail.error.create.activities} />
            : null}
          {Quote.detail.error.update && Quote.detail.error.update.activities
            ? <FieldError message={Quote.detail.error.update.activities} />
            : null}
          <div className="form-group">
            <label className="control-label">Activities *</label>

            <button
              type="button"
              className="btn"
              onClick={this.onComposeActivity.bind(this, null)}
            >
              Add
            </button>

            {this.state.activities && this.state.activities.length
              ? <Table>
                  <thead>
                    <tr>
                      <th>Activity</th>
                      <th>Hours</th>
                      {isAdminOrProjectOwner() ? <th>Fee</th> : null}
                      <th>Description</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.activities.map((activity, idx) => {
                      return (
                        <tr>
                          <td>
                            <a
                              href="#"
                              onClick={this.onComposeActivity.bind(this, {
                                ...activity,
                                idx
                              })}
                            >
                              {_.truncate(activity.title, { length: 25 })}
                            </a>
                          </td>
                          <td>
                            {activity.hours} hrs
                          </td>
                          {isAdminOrProjectOwner()
                            ? <td>
                                €{parseNumber(DEVELOPER_FEE * activity.hours)}
                              </td>
                            : null}
                          <td>
                            {activity.description}
                          </td>
                          <td>
                            <button
                              className="btn"
                              onClick={this.onDelete.bind(this, idx)}
                            >
                              <i className="fa fa-trash-o" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th colSpan="5">Sub Totals</th>
                    </tr>
                    <tr>
                      <th>Development</th>
                      <th>
                        {payDetails.dev.hours} hrs
                      </th>
                      {isAdminOrProjectOwner()
                        ? <th>
                            €{payDetails.dev.fee}
                          </th>
                        : null}
                      <th />
                      <th />
                    </tr>
                    <tr>
                      <th>Project Management</th>
                      <th>
                        {payDetails.pm.hours} hrs
                      </th>
                      {isAdminOrProjectOwner()
                        ? <th>
                            €{payDetails.pm.fee}
                          </th>
                        : null}
                      <th />
                      <th />
                    </tr>
                    <tr>
                      <th>Total</th>
                      <th>
                        {payDetails.total.hours} hrs
                      </th>
                      {isAdminOrProjectOwner()
                        ? <th>
                            €{payDetails.total.fee}
                          </th>
                        : null}
                      <th />
                      <th />
                    </tr>
                  </tfoot>
                </Table>
              : null}
          </div>

          {Quote.detail.error.create && Quote.detail.error.create.plan
            ? <FieldError message={Quote.detail.error.create.plan} />
            : null}
          {Quote.detail.error.update && Quote.detail.error.update.plan
            ? <FieldError message={Quote.detail.error.update.plan} />
            : null}
          <div className="form-group">
            <label className="control-label">Planning *</label>

            <button
              type="button"
              className="btn"
              onClick={this.onComposePlan.bind(this, null)}
            >
              Add
            </button>

            {this.state.plan && this.state.plan.length
              ? <Table>
                  <thead>
                    <tr>
                      <th>Milestone</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Description</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.plan.map((milestone, idx) => {
                      return (
                        <tr>
                          <td>
                            <a
                              href="#"
                              onClick={this.onComposePlan.bind(this, {
                                ...milestone,
                                idx
                              })}
                            >
                              {_.truncate(milestone.title, { length: 25 })}
                            </a>
                          </td>
                          <td>
                            {moment
                              .utc(milestone.start_date)
                              .local()
                              .format("Do, MMMM YYYY")}
                          </td>
                          <td>
                            {moment
                              .utc(milestone.end_date)
                              .local()
                              .format("Do, MMMM YYYY")}
                          </td>
                          <td>
                            {milestone.description}
                          </td>
                          <td>
                            <button
                              className="btn"
                              onClick={this.onDeletePlan.bind(this, idx)}
                            >
                              <i className="fa fa-trash-o" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              : null}
          </div>

          {(!quote.id && canAddQuote(task)) || (quote.id && canEditQuote(task))
            ? <div className="text-center clearfix">
                <button
                  type="submit"
                  className="btn"
                  disabled={Quote.detail.isSaving}
                >
                  Save
                </button>
                {!quote.user || quote.user.id == getUser().id
                  ? <button
                      type="submit"
                      value={STATUS_SUBMITTED}
                      className="btn"
                      onClick={e => {
                        this.setState({ submitted: true });
                        return true;
                      }}
                      disabled={Quote.detail.isSaving}
                    >
                      Submit for Review
                    </button>
                  : null}
              </div>
            : null}
        </form>
      </div>
    );
  }
}

QuoteForm.propTypes = {
  quote: React.PropTypes.object,
  task: React.PropTypes.object
};

QuoteForm.defaultProps = {
  quote: null,
  task: null
};

QuoteForm.contextTypes = {
  router: React.PropTypes.object.isRequired
};
