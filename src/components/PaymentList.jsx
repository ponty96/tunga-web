import React from "react";
import { Link, IndexLink } from "react-router";
import { Table } from "react-bootstrap";
import moment from "moment";
import Progress from "./status/Progress";
import LoadMore from "./status/LoadMore";
import GenericListContainer from "../containers/GenericListContainer";
import MultiTaskCheckItem from "./MultiTaskCheckItem";
import { connect } from "react-redux";

import { ENDPOINT_TASK } from "../constants/Api";

import { isAdmin, isDeveloper, isProjectManager } from "../utils/auth";

import * as MultiTasksPaymentActions from "../actions/MultiTasksPaymentActions";

export default class PaymentList extends GenericListContainer {
  componentWillReceiveProps(nextProps) {
    const {
      MultiTasksPayment: { tasks, isFetching, data }
    } = nextProps;
    if(data != null){
      /**
       * redirect here
       */
      console.log("********")
      console.log("redirect to payment page here")
      console.log("*******")
    }
  }
  componentDidUpdate(prevProps, prevState) {
    super.componentDidUpdate(prevProps, prevState);

    if (
      prevProps.location &&
      this.props.location &&
      prevProps.location.pathname != this.props.location.pathname
    ) {
      this.getList();
    }

    if (prevProps.search != this.props.search) {
      this.setState({
        selection_key: this.state.selection_key + (this.props.search || ""),
        prev_key: this.state.selection_key
      });
    }
  }

  getList(filters) {
    var payment_status = this.props.params.filter || null;
    this.props.TaskActions.listTasks(
      { payment_status, filter: "payments" },
      this.state.selection_key,
      this.state.prev_key
    );
  }

  render() {
    const {
      Task,
      TaskActions,
      MultiTasksPaymentActions,
      MultiTasksPayment
    } = this.props;

    const all_tasks = Task.list.ids[this.state.selection_key] || [];

    return (
      <div>
        <h2>Payments</h2>

        <ul className="nav nav-pills nav-top-filter">
          <li role="presentation">
            <IndexLink to="/payments" activeClassName="active">
              All
            </IndexLink>
          </li>
          <li role="presentation">
            <Link to="/payments/pending" activeClassName="active">
              Pending
            </Link>
          </li>
          <li role="presentation">
            <Link to="/payments/processing" activeClassName="active">
              Processing
            </Link>
          </li>
          <li role="presentation">
            <Link to="/payments/paid" activeClassName="active">
              Paid
            </Link>
          </li>
        </ul>
        {(isAdmin() || isProjectManager()) &&
          <ul className="nav nav-pills nav-top-filter navbar-right">
            <li role="presentation">
              <a onClick={this.createMultiTasksPayment}>Pay Selected Tasks</a>
            </li>
          </ul>}
        {Task.list.isFetching
          ? <Progress />
          : <div>
              {all_tasks.length
                ? <table className="table table-striped table-responsive">
                    <thead>
                      <tr>
                        <th>Selected</th>
                        <th>Task</th>
                        <th>Date</th>
                        {isDeveloper()
                          ? [
                              <th>Pledge</th>,
                              <th>Payment fee</th>,
                              <th>Tunga fee</th>,
                              <th>To Receive</th>
                            ]
                          : <th>Pledge</th>}
                        <th>Invoice</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {all_tasks.map(id => {
                        const task = Task.list.tasks[id];
                        const invoice = task.invoice || {
                          amount: task.amount,
                          developer_amount: {},
                          created_at: task.invoice_date
                        };
                        return (
                          <tr key={task.id}>
                            <td>
                              {task.payment_status == "Pending" &&
                                (isDeveloper() || isAdmin()) &&
                                <MultiTaskCheckItem
                                  task={{
                                    id: task.id,
                                    fee: task.amount.pledge
                                  }}
                                  selectedTasks={MultiTasksPayment.tasks}
                                  addTaskToMultiTasksPayment={
                                    MultiTasksPaymentActions.addTaskToMultiTaskPayment
                                  }
                                  removeTaskFromMultiTasksPayment={
                                    MultiTasksPaymentActions.removeTaskFromMultiTaskPayment
                                  }
                                />}
                            </td>
                            <td>
                              <Link to={`/work/${task.id}/`}>
                                {task.summary}
                              </Link>
                            </td>
                            <td>
                              {moment
                                .utc(invoice.created_at || task.closed_at)
                                .local()
                                .format("D/MMM/YYYY")}
                            </td>
                            {isDeveloper() && invoice.amount
                              ? [
                                  <td>
                                    {invoice.amount.currency}
                                    {parseFloat(invoice.amount.pledge).toFixed(
                                      2
                                    )}
                                  </td>,
                                  <td>
                                    {invoice.amount.currency}
                                    {parseFloat(
                                      invoice.developer_amount.processing || 0
                                    ).toFixed(2)}
                                  </td>,
                                  <td>
                                    {invoice.amount.currency}
                                    {parseFloat(
                                      invoice.developer_amount.tunga || 0
                                    ).toFixed(2)}
                                  </td>,
                                  <td>
                                    {invoice.amount.currency}
                                    {parseFloat(
                                      invoice.developer_amount.developer || 0
                                    ).toFixed(2)}
                                  </td>
                                ]
                              : <td>
                                  {task.display_fee}
                                </td>}
                            <td>
                              {task.invoice
                                ? <div>
                                    <a
                                      href={`${ENDPOINT_TASK}${task.id}/download/invoice/?format=pdf&type=client`}
                                      target="_blank"
                                    >
                                      <span>
                                        <i className="fa fa-download" />{" "}
                                        {isDeveloper() ||
                                        isProjectManager() ||
                                        isAdmin()
                                          ? "Client"
                                          : "Download"}{" "}
                                        Invoice(s)
                                      </span>
                                    </a>
                                    <br />
                                    {isDeveloper() || isAdmin()
                                      ? <a
                                          href={`${ENDPOINT_TASK}${task.id}/download/invoice/?format=pdf&type=developer`}
                                          target="_blank"
                                        >
                                          <span>
                                            <i className="fa fa-download" />{" "}
                                            Developer Invoice(s)
                                          </span>
                                        </a>
                                      : null}
                                  </div>
                                : <div>
                                    Contact{" "}
                                    <a href="mailto:hello@tunga.io">
                                      hello@tunga.io
                                    </a>
                                  </div>}
                            </td>
                            <td>
                              {task.payment_status}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                : <div className="alert alert-info">
                    No payments to display
                  </div>}
              {all_tasks.length && Task.list.next
                ? <LoadMore
                    url={Task.list.next}
                    callback={x => {
                      TaskActions.listMoreTasks(x, this.state.selection_key);
                    }}
                    loading={Task.list.isFetchingMore}
                  />
                : null}
            </div>}
      </div>
    );
  }

  createMultiTasksPayment = () => {
    const {
      MultiTasksPaymentActions,
      MultiTasksPayment: { tasks, isFetching }
    } = this.props;

    if (!isFetching) {
      const totalFee = tasks.reduce((sum, task) => {
        return sum + task.fee;
      }, 0);

      MultiTasksPaymentActions.createMultiTasksPayment({
        fee: totalFee,
        tasks: tasks
      });
    }
  };
}
