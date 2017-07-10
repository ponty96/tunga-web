import React from "react";
import moment from "moment";
import { Link } from "react-router";
import TimeAgo from "react-timeago";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { resizeOverviewBox } from "./TaskWorflow";
import Milestone from "./Milestone";

import {
  PROGRESS_EVENT_TYPE_MILESTONE,
  PROGRESS_EVENT_TYPE_SUBMIT,
  PROGRESS_EVENT_TYPE_COMPLETE
} from "../constants/Api";

export default class Timeline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      min: null,
      max: null,
      duration: 0,
      all_events: [],
      next_event: null,
      now: moment.utc().unix()
    };
  }

  componentDidMount() {
    this.parseTimeline();
    $(document).ready(resizeOverviewBox);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.events.length != prevProps.events.length) {
      this.parseTimeline();
      $(document).ready(resizeOverviewBox);
    }
  }

  parseTimeline() {
    const { start, end, events } = this.props;
    var all_events = [];
    if (start) {
      all_events.push({ title: "Task created", due_at: start });
    }
    if (end) {
      all_events.push({ title: "Deadline", due_at: end });
    }
    all_events = [...all_events, ...events];
    var next_event = null;
    const now = this.state.now;
    var timestamps = all_events.map(event => {
      let this_tm = moment.utc(event.due_at).unix();
      if (
        this_tm > now &&
        (!next_event ||
          (next_event && this_tm < moment.utc(next_event.due_at).unix()))
      ) {
        next_event = event;
      }
      return this_tm;
    });
    var min = null,
      max = null,
      duration = 0;
    if (timestamps.length) {
      min = Math.min(...timestamps);
      max = Math.max(...timestamps);
      duration = max - min;
    }
    this.setState({ min, max, duration, all_events, next_event });
  }

  openMilestone(event) {
    if (this.props.openMilestone) {
      this.props.openMilestone(event.id);
    }
  }

  polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  }

  describeArc(x, y, radius, startAngle, endAngle) {
    var start = this.polarToCartesian(x, y, radius, endAngle);
    var end = this.polarToCartesian(x, y, radius, startAngle);

    var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    var d = [
      "M",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y
    ].join(" ");

    return d;
  }

  renderEvent(event) {
    if (!this.state.duration || (event.is_now && !this.state.next_event)) {
      return null;
    }
    const timestamp = moment.utc(event.due_at).unix();
    const length = timestamp - this.state.min;
    const pos = length / this.state.duration * 100;
    const ts_now = this.state.now;
    let is_missed = timestamp + 24 * 60 * 60 < ts_now && event.type; // Developers have 24 hrs before a task update is missed
    var angle = (length / this.state.duration * 360 + 270) % 360;

    const { task } = this.props;

    const popover = (
      <Popover id="popover">
        <div className="title">
          {event.title || "Scheduled Update"}
        </div>
        {event.is_now
          ? <div>
              {this.state.next_event.type
                ? "Next " +
                  ([
                    PROGRESS_EVENT_TYPE_MILESTONE,
                    PROGRESS_EVENT_TYPE_SUBMIT,
                    PROGRESS_EVENT_TYPE_COMPLETE
                  ].indexOf(event.type) > -1
                    ? "Milestone"
                    : "Update")
                : "Deadline"}
              <span> is </span>
              <TimeAgo
                date={moment.utc(this.state.next_event.due_at).local().format()}
              />
            </div>
          : <div>
              {event.due_at
                ? moment.utc(event.due_at).local().format("ddd Do, MMMM YYYY")
                : null}
              {event.report
                ? <div>
                    <strong>Status: </strong>
                    <span>
                      {event.report.status_display}
                    </span>
                    <br />
                    <strong>Completed: </strong>
                    <span>
                      {event.report.percentage}%
                    </span>
                  </div>
                : is_missed
                  ? <div>
                      <strong>
                        {[
                          PROGRESS_EVENT_TYPE_MILESTONE,
                          PROGRESS_EVENT_TYPE_SUBMIT,
                          PROGRESS_EVENT_TYPE_COMPLETE
                        ].indexOf(event.type) > -1
                          ? "Milestone"
                          : "Update"}{" "}
                        missed
                      </strong>
                    </div>
                  : null}
            </div>}
      </Popover>
    );
    return (
      <Link to={`/work/${task.id}/event/${event.id}`}>
        <OverlayTrigger key={event.due_at} placement="top" overlay={popover}>
          <div
            key={event.id}
            className={
              "event" +
              (moment.utc(event.due_at) < moment.utc() && !event.is_now
                ? " past"
                : "")
            }
            style={{ transform: `rotate(${angle}deg) translate(110px)` }}
          >
            <span>
              {event.is_now
                ? <i className="fa fa-square" />
                : <i className="fa fa-circle" />}
            </span>
          </div>
        </OverlayTrigger>
      </Link>
    );
  }

  render() {
    const length = this.state.now - this.state.min;
    var angle = length / this.state.duration * 360;
    if (angle > 360) {
      angle = 360;
    }
    return (
      <div className="timeline">
        <div className={`line ${angle >= 360 ? "closed" : ""}`}>
          <div className="inner-line" />
          <div className="content">
            {this.props.children}
          </div>
        </div>
        <div className="duration">
          {
            <svg>
              <path fill="none" d={this.describeArc(130, 110, 100, 0, angle)} />
            </svg>
          }
          {/*this.state.all_events.map((event) => {
                        return this.renderEvent(event);
                    })*/}

          {/*this.renderEvent({title: 'Reminder', due_at: this.state.now, is_now: true})*/}
        </div>
      </div>
    );
  }
}
