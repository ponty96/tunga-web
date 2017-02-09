import React from 'react';
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
        const {Timesheet} = this.props
        // return Timesheet.list.timesheets.reduce((accumulator,currentVal) => {
        //     return accumulator + currentVal.hours
        // })
        return 0
    }

    submitForm = (form) => {
        const task_id = 2; // get task id
        const { TimesheetActions } = this.props
        TimesheetActions.createTimesheet(task_id, form)
    }
}

export default connect(TimesheetPage);
