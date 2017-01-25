import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as TimesheetActions from '../../actions/TimesheetActions';

function mapStateToProps(state) {
    return {Auth: state.Auth, Timesheet: state.Timesheet};
}

function mapDispatchToProps(dispatch) {
    return {
        TimesheetActions: bindActionCreators(TimesheetActions, dispatch)
    }
}

export default function connectToTimesheets(component) {
    return connect(mapStateToProps, mapDispatchToProps)(component);
};


