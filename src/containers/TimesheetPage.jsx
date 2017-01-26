import React from 'react';
import { SingleDatePicker } from 'react-dates';
import TimesheetForm from './../components/TimesheetForm'
import TimesheetList from './../components/TimesheetList'
import connect from '../utils/connectors/TimesheetConnector';

class TimesheetPage extends React.Component {
    render() {
        const {Timesheet} = this.props
        return (
            <div>
                <h4 style={{ paddingLeft: 10 }}>Timesheets - Total Hours({this.getTotalHours()})</h4>
                <TimesheetForm submitForm={this.submitForm}/>
                <TimesheetList timesheets={Timesheet.list.timesheets} />
            </div>
        )
    }

    componentDidMount() {
        const taskId = 12 // GET TASK ID FROM PARAMS
        this.props.TimesheetActions.listTimesheets(taskId)
    }

    getTotalHours = () => {
        return Timesheet.list.timesheets.reduce((accumulator,currentVal) => {
            return accumulator + currentVal.hours
        })
    }

    submitForm = (form) => {
        const task_id = 2; // get task id
        const { TimesheetActions } = this.props
        TimesheetActions.createTimesheet(task_id, form)
    }
}

export default connect(TimesheetPage);
