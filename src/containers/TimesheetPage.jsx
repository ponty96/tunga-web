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
        const {params: {taskId}} = this.props
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
        const { TimesheetActions, params: {taskId} } = this.props
        form['task'] = taskId
        TimesheetActions.createTimesheet(form)
    }
}

export default connect(TimesheetPage);
