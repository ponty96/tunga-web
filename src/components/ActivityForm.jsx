import React from "react";
import moment from "moment";
import momentLocalizer from "react-widgets/lib/localizers/moment";
import FieldError from "./status/FieldError";

momentLocalizer(moment);

export default class ActivityForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { description: "" };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const activity = this.props.activity;
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

  handleSubmit(e) {
    e.preventDefault();
    var title = this.refs.title.value.trim();
    var hours = this.refs.hours.value.trim();
    var description = this.refs.description.value.trim();

    if (this.props.onSave) {
      this.props.onSave({ ...this.props.activity, title, hours, description });
    }
    if (this.props.close) {
      this.props.close();
    }
  }

  render() {
    const activity = this.props.activity || {};

    return (
      <div>
        <form
          onSubmit={this.handleSubmit}
          name="activity"
          role="form"
          ref="activity_form"
        >
          {this.state.error && this.state.error.title
            ? <FieldError message={this.state.error.title} />
            : null}
          <div className="form-group">
            <label className="control-label">Title *</label>
            <div>
              <input
                type="text"
                className="form-control"
                ref="title"
                required
                placeholder="Title"
                defaultValue={activity.title}
              />
            </div>
          </div>

          {this.state.error && this.state.error.hours
            ? <FieldError message={this.state.error.hours} />
            : null}
          <div className="form-group">
            <label className="control-label">Estimated hours *</label>
            <div>
              <input
                type="number"
                step="0.01"
                className="form-control"
                ref="hours"
                required
                placeholder="Hours"
                defaultValue={activity.hours}
              />
            </div>
          </div>

          {this.state.error && this.state.error.description
            ? <FieldError message={this.state.error.description} />
            : null}
          <div className="form-group">
            <label className="control-label">Description</label>
            <textarea
              className="form-control"
              onChange={this.onInputChange.bind(this, "description")}
              defaultValue={activity.description}
              ref="description"
              placeholder="Introduction"
            />
          </div>

          <div className="text-center">
            <button type="submit" className="btn  ">
              {activity.idx > -1 ? "Update" : "Add"} activity
            </button>
          </div>
        </form>
      </div>
    );
  }
}
