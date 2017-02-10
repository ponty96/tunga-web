import React from 'react';

export default class TimesheetForm extends React.Component {
  render() {
    const {formData: {spent_at, hours, description}, formState, id} = this.props
    return (
      <div>
        <h4 style={{ paddingLeft: 10 }}>{formState == 0 ? "Create Timesheet" : `Edit Timesheet ${id}`}</h4>
        <form className="timesheet-form">
          <input type="date"
            placeholder="Spent at"
            className="form-control"
            value={spent_at}
            onChange={(e) => this.props.setValue("spent_at", e.target.value)} />
          <div className="form-inline">
            <input type="number"
              placeholder="Hours"
              className="form-control"
              value={hours}
              onChange={(e) => this.props.setValue("hours", parseInt(e.target.value))} />
          </div>
          <textarea placeholder="Description"
            className="form-control"
            value={description}
            onChange={(e) => this.props.setValue("description", e.target.value)}></textarea>

          <span className="input-group-btn" style={{ display: "flex" }}>
            <button type="button" className="btn" onClick={this._onSubmit}>
              <i className="fa fa-paper-plane" /> Save
            </button>
            {formState == 0 ? <div></div> :
              <button type="button" className="btn" onClick={this._onCancel}>
                <i className="fa fa-times-circle" /> Cancel
              </button>
            }
          </span>
        </form>
      </div>
    )
  }

  _onSubmit = () => {
    const {formData: {spent_at, hours, description}} = this.props
    if (spent_at && hours && description) {
      this.props.submitForm({ spent_at, hours, description });
    }
  }
  _onCancel = () => {
    this.props.cancelEdit()
  }
}