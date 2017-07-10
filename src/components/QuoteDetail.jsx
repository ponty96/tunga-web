import React from "react";
import { Link } from "react-router";
import moment from "moment";
import momentLocalizer from "react-widgets/lib/localizers/moment";
import { Table } from "react-bootstrap";

import FormStatus from "./status/FormStatus";

import {
  DEVELOPER_FEE,
  STATUS_SUBMITTED,
  STATUS_APPROVED,
  STATUS_DECLINED,
  STATUS_ACCEPTED,
  STATUS_REJECTED,
  ENDPOINT_TASK
} from "../constants/Api";
import {
  getPayDetails,
  canEditQuote,
  canModerateQuote,
  canReviewQuote
} from "../utils/tasks";
import { getUser, isAdminOrProjectOwner } from "../utils/auth";
import confirm from "../utils/confirm";
import { parseNumber } from "../utils/helpers";

momentLocalizer(moment);

export default class QuoteDetail extends React.Component {
  componentDidUpdate(prevProps, prevState) {
    const { Quote } = this.props;

    const quote = this.props.quote || {};

    if (this.props.Quote.detail.isSaved && !prevProps.Quote.detail.isSaved) {
      if (Quote.detail.quote.status == STATUS_ACCEPTED) {
        const { router } = this.context;
        window.location.href = `/work/${Quote.detail.quote.task}/quote/${Quote
          .detail.quote.id}`;
      }
    }
  }

  getTotalHours() {
    const quote = this.props.quote || {};
    if (!quote.activities || !quote.activities.length) {
      return 0;
    }
    return quote.activities
      .map(function(activity) {
        return activity.hours;
      })
      .reduce((a, b) => {
        return parseInt(a) + parseInt(b);
      });
  }

  onChangeStatus(status) {
    const { QuoteActions } = this.props;
    const quote = this.props.quote || {};

    if ([STATUS_DECLINED, STATUS_REJECTED].indexOf(status) > -1) {
      confirm("Are you sure?", true, { placeholder: "Reason" }).then(function(
        response
      ) {
        var quote_info = { status };
        if (status == STATUS_DECLINED) {
          quote_info.moderator_comment = response;
        } else {
          quote_info.reviewer_comment = response;
        }
        QuoteActions.updateQuote(quote.id, {
          status,
          moderator_comment: response
        });
      });
    } else {
      confirm("Are you sure?").then(function() {
        QuoteActions.updateQuote(quote.id, { status });
      });
    }

    return;
  }

  render() {
    const { Quote } = this.props;
    const task = this.props.task || {};
    const quote = this.props.quote || {};

    let payDetails = getPayDetails(quote.activities);

    return (
      <div className="estimate-presentation">
        <FormStatus
          loading={Quote.detail.isSaving}
          success={Quote.detail.isSaved}
          message={"Quote saved successfully"}
          error={Quote.detail.error.create}
        />

        <div className="pull-right">
          <a
            href={`${ENDPOINT_TASK}${quote.task}/download/estimate?format=pdf`}
            className="btn btn-primary"
            target="_blank"
          >
            <i className="fa fa-file-pdf-o" /> Download Pdf
          </a>
        </div>

        <div className="form-group">
          <h4>Introduction:</h4>
          <div>
            {quote.introduction}
          </div>
        </div>

        <h4>Scope:</h4>
        <div className="form-group">
          <h5>In scope:</h5>
          <div>
            {quote.in_scope}
          </div>
        </div>

        <div className="form-group">
          <h5>Out of scope:</h5>
          <div>
            {quote.out_scope}
          </div>
        </div>

        <div className="form-group">
          <h5>Assumptions:</h5>
          <div>
            {quote.assumptions}
          </div>
        </div>

        <div className="form-group">
          <h5>Deliverables:</h5>
          <div>
            {quote.deliverables}
          </div>
        </div>

        <h4>Solution:</h4>
        <div className="form-group">
          <h5>Architecture:</h5>
          <div>
            {quote.architecture}
          </div>
        </div>

        <div className="form-group">
          <h5>Technology:</h5>
          <div>
            {quote.technology}
          </div>
        </div>

        <h4>Methodology</h4>
        <div className="form-group">
          <h5>Process:</h5>
          <div>
            {quote.process}
          </div>
        </div>

        <div className="form-group">
          <h5>Reporting:</h5>
          <div>
            {quote.reporting}
          </div>
        </div>

        <div className="form-group">
          <h4>Activities:</h4>
          {quote.activities && quote.activities.length
            ? <Table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Hours</th>
                    {isAdminOrProjectOwner() ? <th>Fee</th> : null}
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {quote.activities.map((activity, idx) => {
                    return (
                      <tr>
                        <td>
                          {activity.title}
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
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <th colSpan="4">Sub Totals</th>
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
                  </tr>
                </tfoot>
              </Table>
            : null}
        </div>

        <div className="form-group">
          <h4>Planning:</h4>

          {quote.plan && quote.plan.length
            ? <Table>
                <thead>
                  <tr>
                    <th>Milestone</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {quote.plan.map((milestone, idx) => {
                    return (
                      <tr>
                        <td>
                          {milestone.title}
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
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            : null}
        </div>

        <div className="text-center clearfix">
          {canEditQuote(task)
            ? <div>
                <Link
                  to={`/work/${quote.task}/quote/${quote.id}/edit`}
                  className="btn"
                >
                  Edit Quote
                </Link>
                {quote.user && quote.user.id == getUser().id
                  ? <button
                      type="submit"
                      className="btn"
                      disabled={Quote.detail.isSaving}
                      onClick={this.onChangeStatus.bind(this, STATUS_SUBMITTED)}
                    >
                      Submit for Review
                    </button>
                  : null}
              </div>
            : canModerateQuote(task)
              ? <div>
                  <button
                    type="submit"
                    className="btn"
                    disabled={Quote.detail.isSaving}
                    onClick={this.onChangeStatus.bind(this, STATUS_APPROVED)}
                  >
                    Approve
                  </button>
                  <button
                    type="submit"
                    className="btn"
                    disabled={Quote.detail.isSaving}
                    onClick={this.onChangeStatus.bind(this, STATUS_DECLINED)}
                  >
                    Decline
                  </button>
                </div>
              : canReviewQuote(task)
                ? <div>
                    <button
                      type="submit"
                      className="btn"
                      isabled={Quote.detail.isSaving}
                      onClick={this.onChangeStatus.bind(this, STATUS_ACCEPTED)}
                    >
                      Accept
                    </button>
                    <button
                      type="submit"
                      className="btn"
                      disabled={Quote.detail.isSaving}
                      onClick={this.onChangeStatus.bind(this, STATUS_REJECTED)}
                    >
                      Reject
                    </button>
                  </div>
                : null}
        </div>
      </div>
    );
  }
}
