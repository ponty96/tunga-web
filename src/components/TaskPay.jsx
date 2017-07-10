import React from "react";
import { Link } from "react-router";
import StripeCheckout from "react-stripe-checkout";

import Progress from "./status/Progress";
import FormStatus from "./status/FormStatus";
import FieldError from "./status/FieldError";
import Error from "./status/Error";

import {
  TASK_PAYMENT_METHOD_CHOICES,
  TASK_PAYMENT_METHOD_BITONIC,
  TASK_PAYMENT_METHOD_BITCOIN,
  TASK_PAYMENT_METHOD_BANK,
  TASK_PAYMENT_METHOD_STRIPE,
  ENDPOINT_TASK
} from "../constants/Api";
import { objectToQueryString } from "../utils/html";
import { getUser, isAdmin } from "../utils/auth";
import { parseNumber } from "../utils/helpers";

export default class TaskPay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pay_method: null,
      pay_details: null,
      showForm: true,
      withhold_tunga_fee: false
    };
  }

  componentDidMount() {
    const { task, Task, TaskActions } = this.props;
    if (task.id) {
      if (getUser().id == task.user.id && task.closed && task.paid) {
        const { router } = this.context;
        router.replace(`/work/${Task.detail.task.id}/rate`);
      }

      if (task.payment_method) {
        TaskActions.retrieveTaskInvoice(task.id);
        this.setState({ showForm: false });
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.Task.detail.Invoice.isSaved &&
      !prevProps.Task.detail.Invoice.isSaved
    ) {
      const { Task } = this.props;
      const { task, Invoice } = Task.detail;

      this.setState({ showForm: false });

      if (Invoice.invoice.payment_method == TASK_PAYMENT_METHOD_STRIPE) {
        let tp = this;
        setTimeout(function() {
          if (tp.refs.pay_stripe) {
            tp.refs.pay_stripe.click();
          }
        }, 500);
      }

      if (Invoice.invoice.payment_method == TASK_PAYMENT_METHOD_BITONIC) {
        window.location.href = `${ENDPOINT_TASK}${task.id}/pay/bitonic/`;
      }
    }
  }

  changePayMethod() {
    this.setState({ showForm: true });
  }

  onChangePayMethod(pay_method) {
    this.setState({
      pay_method: pay_method.id,
      pay_details: pay_method.details
    });
  }

  onStripeToken(token) {
    const { task, Task, TaskActions } = this.props;
    const { invoice } = Task.detail.Invoice;

    let stripe_options = {
      token: token.id,
      email: token.email,
      amount: parseInt(this.getActualAmount() * 100),
      description: task.summary,
      task_id: task.id,
      invoice_id: invoice.id,
      currency: "EUR"
    };
    TaskActions.makeTaskPayment(task.id, "stripe", stripe_options);
  }

  onWithHoldFeeChange() {
    this.setState({ withhold_tunga_fee: !this.state.withhold_tunga_fee });
  }

  handleSubmit(e) {
    e.preventDefault();
    var fee = this.refs.fee.value.trim();
    var payment_method = this.state.pay_method;
    var withhold_tunga_fee = this.state.withhold_tunga_fee;

    const { Task, TaskActions } = this.props;
    const { task } = Task.detail;
    TaskActions.createTaskInvoice(task.id, {
      fee,
      payment_method,
      withhold_tunga_fee
    });
  }

  getBitonicPaymentUrl() {
    const { task } = this.props;

    return (
      "https://bitonic.nl/partner/263?" +
      objectToQueryString({
        bitcoinaddress: encodeURIComponent(task.btc_address),
        ext_data: encodeURIComponent(task.summary),
        ordertype: "buy",
        euros: encodeURIComponent(task.pay)
      })
    );
  }

  getTotalAmount() {
    const { task, Task, TaskActions } = this.props;
    const { invoice } = Task.detail.Invoice;

    switch (invoice.payment_method) {
      case TASK_PAYMENT_METHOD_STRIPE:
        return invoice.fee * 1.029 + 0.25; // 2.9% + 25c charge
      case TASK_PAYMENT_METHOD_BITONIC:
        return invoice.fee * 1.03; // 3%
      case TASK_PAYMENT_METHOD_BANK:
        return invoice.fee * 1.055; // 5.5%
      default:
        return invoice.fee;
    }
  }

  getActualAmount() {
    const { task, Task, TaskActions } = this.props;
    const { invoice } = Task.detail.Invoice;

    let amount = this.getTotalAmount();

    if (task.withhold_tunga_fee) {
      return amount * (1 - task.tunga_ratio_dev);
    }
    return amount;
  }

  render() {
    const { task, Task } = this.props;
    const { invoice } = Task.detail.Invoice;

    var btc_amount = null;
    var btc_address = null;
    if (invoice) {
      btc_amount = parseFloat(
        this.getActualAmount() / invoice.btc_price
      ).toFixed(6);
      btc_address = `bitcoin:${invoice.btc_address}?amount=${btc_amount}&message=${encodeURIComponent(
        task.summary
      )}`;
    }

    return (
      <div className="form-wrapper">
        {Task.detail.isRetrieving ||
        Task.detail.Invoice.isRetrieving ||
        Task.detail.isPaying
          ? <Progress
              message={
                Task.detail.isPaying ? "Processing payment ..." : "Loading ..."
              }
            />
          : <div>
              {this.state.showForm || !invoice.id
                ? <form
                    onSubmit={this.handleSubmit.bind(this)}
                    name="invoice"
                    role="form"
                    ref="invoice_form"
                  >
                    <h4 className="title">Make Payment</h4>

                    <FormStatus
                      loading={Task.detail.Invoice.isSaving}
                      success={Task.detail.Invoice.isSaved}
                      message={"Invoice saved successfully"}
                      error={Task.detail.Invoice.error.create}
                    />

                    {Task.detail.Invoice.error.create &&
                    Task.detail.Invoice.error.create.fee
                      ? <FieldError
                          message={Task.detail.Invoice.error.create.fee}
                        />
                      : null}
                    <div className="form-group">
                      <label className="control-label">Fee (in Euro) *</label>
                      <div>
                        <input
                          type="text"
                          className="form-control"
                          ref="fee"
                          required
                          placeholder="Fee in €"
                          defaultValue={parseNumber(task.pay, false)}
                        />
                      </div>
                    </div>

                    {Task.detail.Invoice.error.create &&
                    Task.detail.Invoice.error.create.withhold_tunga_fee
                      ? <FieldError
                          message={
                            Task.detail.Invoice.error.create.withhold_tunga_fee
                          }
                        />
                      : null}

                    {isAdmin()
                      ? <div className="form-group">
                          <div className="checkbox">
                            <label className="control-label">
                              <input
                                type="checkbox"
                                ref="withhold_tunga_fee"
                                checked={this.state.withhold_tunga_fee}
                                onChange={this.onWithHoldFeeChange.bind(this)}
                              />
                              Withhold Tunga fee/ Only pay participant fees.
                            </label>
                          </div>
                          <div className="alert alert-info">
                            Use the full {task.is_task ? "task" : "project"} fee
                            even when this option is enabled.
                          </div>
                        </div>
                      : null}

                    {Task.detail.Invoice.error.create &&
                    Task.detail.Invoice.error.create.payment_method
                      ? <FieldError
                          message={
                            Task.detail.Invoice.error.create.payment_method
                          }
                        />
                      : null}
                    <div className="form-group">
                      <label className="control-label">Payment method</label>
                      <hr style={{ marginTop: "0" }} />
                      <div className="pay-choices">
                        {TASK_PAYMENT_METHOD_CHOICES.map(payment_method => {
                          return (
                            <div key={payment_method.id} className="row">
                              <div className="col-md-6">
                                <button
                                  type="button"
                                  className={
                                    "btn btn-block " +
                                    (this.state.pay_method == payment_method.id
                                      ? "active"
                                      : "")
                                  }
                                  onClick={this.onChangePayMethod.bind(
                                    this,
                                    payment_method
                                  )}
                                >
                                  <i
                                    className={
                                      payment_method.icon_class +
                                      " fa-lg pull-left"
                                    }
                                  />
                                  {payment_method.name}
                                </button>
                              </div>
                              <div
                                className="col-md-6"
                                dangerouslySetInnerHTML={{
                                  __html: payment_method.meta
                                }}
                                style={{ paddingTop: "10px" }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {this.state.pay_details
                      ? <div className="card">
                          {this.state.pay_details}
                        </div>
                      : null}

                    <div className="text-center">
                      <button
                        type="submit"
                        className="btn"
                        disabled={Task.detail.Invoice.isSaving}
                      >
                        Continue
                      </button>
                    </div>
                  </form>
                : <div>
                    {task.paid
                      ? <div>
                          <div className="thank-you">
                            We received your payment. Thank you!<br />
                            <i className="fa fa-check-circle" />
                            <div className="next-action">
                              <Link
                                to={`/work/${task.id}/rate`}
                                className="btn"
                              >
                                Rate Developers
                              </Link>
                            </div>
                          </div>
                        </div>
                      : <div>
                          {Task.detail.error.pay &&
                          Task.detail.error.pay.message
                            ? <Error message={Task.detail.error.pay.message} />
                            : null}

                          <table className="table table-striped">
                            <thead>
                              <tr>
                                <th colSpan="2">Payment Details</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>Task fee:</td>
                                <td>
                                  &euro; {parseNumber(invoice.fee)}
                                </td>
                              </tr>
                              <tr>
                                <td>Payment costs:</td>
                                <td>
                                  &euro;{" "}
                                  {parseNumber(
                                    this.getTotalAmount() - invoice.fee
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <th>Subtotal:</th>
                                <th>
                                  &euro; {parseNumber(this.getTotalAmount())}
                                </th>
                              </tr>
                              <tr>
                                <td>VAT 0%:</td>
                                <td>&euro; 0</td>
                              </tr>
                              <tr>
                                <th>Total: </th>
                                <th>
                                  &euro; {parseNumber(this.getTotalAmount())}
                                </th>
                              </tr>
                              {task.withhold_tunga_fee && isAdmin()
                                ? <tr>
                                    <th>Actual Payment (Minus Tunga Fee): </th>
                                    <th>
                                      &euro;{" "}
                                      {parseNumber(this.getActualAmount())}
                                    </th>
                                  </tr>
                                : null}
                            </tbody>
                          </table>

                          {invoice.payment_method == TASK_PAYMENT_METHOD_BITCOIN
                            ? <div>
                                <h4>
                                  Bitcoin: <i className="fa fa-btc" />{" "}
                                  {btc_amount}
                                </h4>
                                Send exactly BTC <strong>{btc_amount}</strong>{" "}
                                to{" "}
                                <a href={btc_address}>
                                  <strong>
                                    {invoice.btc_address}
                                  </strong>
                                </a>
                                <div>
                                  <img
                                    src={`https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${btc_address}`}
                                  />
                                </div>
                              </div>
                            : null}

                          {invoice.payment_method == TASK_PAYMENT_METHOD_BANK
                            ? <div>
                                <a
                                  href={`${ENDPOINT_TASK}${task.id}/download/invoice/?format=pdf`}
                                  target="_blank"
                                  className="btn "
                                >
                                  <i className="fa fa-download" /> Download
                                  Invoice
                                </a>
                              </div>
                            : null}

                          {invoice.payment_method == TASK_PAYMENT_METHOD_BITONIC
                            ? <div>
                                <div>
                                  {/*<iframe src={this.getBitonicPaymentUrl()}
                                                     style={{border: "none"}}
                                                     width="400px" height="413px" sandbox/>*/}
                                </div>
                                <a
                                  href={`${ENDPOINT_TASK}${task.id}/pay/bitonic/`}
                                  className="btn "
                                >
                                  <i className="fa fa-money" /> Pay with iDeal
                                </a>
                              </div>
                            : null}

                          {invoice.payment_method == TASK_PAYMENT_METHOD_STRIPE
                            ? <StripeCheckout
                                name="Tunga"
                                description={task.summary}
                                image="https://tunga.io/icons/tunga_square.png"
                                ComponentClass="span"
                                panelLabel="Make Payment"
                                amount={this.getActualAmount() * 100}
                                currency="EUR"
                                stripeKey={__STRIPE_KEY__}
                                locale="en"
                                //bitcoin={true}
                                email={getUser().email}
                                token={this.onStripeToken.bind(this)}
                                reconfigureOnUpdate={false}
                                triggerEvent="onClick"
                              >
                                <button
                                  type="button"
                                  className="btn btn-success"
                                  ref="pay_stripe"
                                >
                                  Pay with Card
                                </button>
                              </StripeCheckout>
                            : null}

                          <div style={{ marginTop: "20px" }}>
                            <button
                              className="btn btn-alt"
                              onClick={this.changePayMethod.bind(this)}
                            >
                              <i className="fa fa-pencil" /> Change Payment
                              Method
                            </button>
                          </div>
                        </div>}
                  </div>}
            </div>}
      </div>
    );
  }
}

TaskPay.propTypes = {
  task: React.PropTypes.object.isRequired
};

TaskPay.defaultProps = {
  task: {}
};

TaskPay.contextTypes = {
  router: React.PropTypes.object.isRequired
};
