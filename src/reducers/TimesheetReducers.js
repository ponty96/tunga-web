import { combineReducers } from 'redux';
import * as TimesheetActions from '../actions/TimesheetActions';
import { PATH_CHANGE } from '../actions/NavActions';

function singleTimesheet(state = {}, action) {
    switch (action.type) {
        case TimesheetActions.CREATE_TIMESHEET_SUCCESS:
        case TimesheetActions.RETRIEVE_TIMESHEET_SUCCESS:
        case TimesheetActions.UPDATE_TIMESHEET_SUCCESS:
            return action.timesheet;
        case TimesheetActions.DELETE_TIMESHEET_SUCCESS:
        case TimesheetActions.CREATE_TIMESHEET_START:
        case TimesheetActions.CREATE_TIMESHEET_FAILED:
            return {};
        default:
            return state;
    }
}

function timesheets(state = [], action) {
    switch (action.type) {
        case TimesheetActions.LIST_TIMESHEETS_SUCCESS:
            return [...action.items].reverse();
        case TimesheetActions.LIST_MORE_TIMESHEETS_SUCCESS:
            var old_timesheets = [...action.items].reverse();
            return [...old_timesheets, ...state];
        case TimesheetActions.CREATE_TIMESHEET_SUCCESS:
            return [...state, action.timesheet];
        case TimesheetActions.LIST_TIMESHEETS_START:
        case TimesheetActions.LIST_TIMESHEETS_FAILED:
            return [];
        default:
            return state;
    }
}

function next(state = null, action) {
    switch (action.type) {
        case TimesheetActions.LIST_TIMESHEETS_SUCCESS:
        case TimesheetActions.LIST_MORE_TIMESHEETS_SUCCESS:
            return action.next;
        default:
            return state;
    }
}

function previous(state = null, action) {
    switch (action.type) {
        case TimesheetActions.LIST_TIMESHEETS_SUCCESS:
        case TimesheetActions.LIST_MORE_TIMESHEETS_SUCCESS:
            return action.previous;
        default:
            return state;
    }
}

function isSaving(state = false, action) {
    switch (action.type) {
        case TimesheetActions.CREATE_TIMESHEET_START:
            return true;
        case TimesheetActions.CREATE_TIMESHEET_SUCCESS:
        case TimesheetActions.CREATE_TIMESHEET_FAILED:
            return false;
        default:
            return state;
    }
}

function isSaved(state = false, action) {
    switch (action.type) {
        case TimesheetActions.CREATE_TIMESHEET_SUCCESS:
            return true;
        case TimesheetActions.CREATE_TIMESHEET_START:
        case TimesheetActions.CREATE_TIMESHEET_FAILED:
        case PATH_CHANGE:
            return false;
        default:
            return state;
    }
}

function isFetching(state = false, action) {
    switch (action.type) {
        case TimesheetActions.LIST_TIMESHEETS_START:
            return true;
        case TimesheetActions.LIST_TIMESHEETS_SUCCESS:
        case TimesheetActions.LIST_TIMESHEETS_FAILED:
            return false;
        default:
            return state;
    }
}

function isFetchingMore(state = false, action) {
    switch (action.type) {
        case TimesheetActions.LIST_MORE_TIMESHEETS_START:
            return true;
        case TimesheetActions.LIST_MORE_TIMESHEETS_SUCCESS:
        case TimesheetActions.LIST_MORE_TIMESHEETS_FAILED:
            return false;
        default:
            return state;
    }
}


function isDeleting(state = false, action) {
    switch (action.type) {
        case TimesheetActions.DELETE_TIMESHEET_START:
            return true;
        case TimesheetActions.DELETE_TIMESHEET_SUCCESS:
        case TimesheetActions.DELETE_TIMESHEET_FAILED:
            return false;
        default:
            return state;
    }
}

function error(state = {}, action) {
    switch (action.type) {
        case TimesheetActions.CREATE_TIMESHEET_FAILED:
            return {...state, create: action.error};
        case TimesheetActions.CREATE_TIMESHEET_START:
        case TimesheetActions.CREATE_TIMESHEET_SUCCESS:
            return {...state, create: null};
        default:
            return state;
    }
}

const timesheet = combineReducers({
    singleTimesheet,
    isSaving,
    isSaved,
    isDeleting,
    error
});

const list = combineReducers({
    timesheets,
    isFetching,
    isFetchingMore,
    next,
    previous
});

const Timesheet = combineReducers({
    singleTimesheet,
    list
});

export default Timesheet;
