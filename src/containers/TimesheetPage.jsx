import React from 'react';
import TimesheetForm from './../components/TimesheetForm'
import TimesheetList from './../components/TimesheetList'
import connect from '../utils/connectors/TimesheetConnector';

const loadState = {
  formState: 0,
  spent_at: "",
  hours: "hours spent",
  description: "",
  id: 0
}
class TimesheetPage extends React.Component {
  constructor() {
    super()
    this.state = loadState
  }
  render() {
    const {Timesheet} = this.props
    const {spent_at, hours, description, formState} = this.state
    return (
      <div>
        <TimesheetForm
          submitForm={this.submitForm}
          formState={formState}
          formData={{ spent_at, hours, description }}
          cancelEdit={this._cancelEdit}
          setValue={this._setValue} />
        <TimesheetList
          timesheets={Timesheet.list.timesheets}
          count={this.getTotalHours()}
          openEditForm={this._openEditForm} />
      </div>
    )
  }

  componentDidMount() {
    const {params: {taskId}} = this.props
    this.props.TimesheetActions.listTimesheets(taskId)
  }

  getTotalHours = () => {
    const {Timesheet} = this.props
    if (Timesheet.list && Timesheet.list.timesheets) {
      const hours = Timesheet.list.timesheets.map((content) => (content.hours))
      const totalHours = hours.reduce((a, b) => (a + b), 0);
      return totalHours
    }
    return 0
  }

  submitForm = (form) => {
    const { TimesheetActions, params: {taskId} } = this.props
    const {id, formState} = this.state
    form['task'] = taskId
    if (formState == 0) {
      TimesheetActions.createTimesheet(form)
    } else {
      TimesheetActions.updateTimesheet(id, form)
    }
  }

  _openEditForm = (id) => {
    const { TimesheetActions, params: {taskId}, Timesheet} = this.props
    const timesheet = Timesheet.list.timesheets.find(timesheet => {
      return timesheet.id == id
    })
    this.setState({
      spent_at: timesheet.spent_at,
      hours: timesheet.hours,
      description: timesheet.description,
      formState: 1,
      id: timesheet.id
    })
  }

  _cancelEdit = () => {
    this.setState(loadState)
  }

  _setValue = (key, val) => {
    let state = this.state;
    state[key] = val
    this.setState(state)
  }
}

export default connect(TimesheetPage);
