import axios from 'axios';
import { ENPOINT_TIME_ENTRY } from '../constants/Api';


// ACTION TYPES FOR CREATING TIMESHEETS
export const CREATE_TIMESHEETS_START = 'CREATE_TIMESHEETS_START';
export const CREATE_TIMESHEETS_SUCCESS = 'CREATE_TIMESHEETS_SUCCESS';
export const CREATE_TIMESHEETS_FAILED = 'CREATE_TIMESHEETS_FAILED';

// ACTION TYPES FOR FETCHING TIMESHEETS
export const LIST_TIMESHEETS_START = 'LIST_TIMESHEETS_START';
export const LIST_TIMESHEETS_SUCCESS = 'LIST_TIMESHEETS_SUCCESS';
export const LIST_TIMESHEETS_FAILED = 'LIST_TIMESHEETS_FAILED';

export const UPDATE_TIMESHEET_START = 'UPDATE_TIMESHEET_START';
export const UPDATE_TIMESHEET_SUCCESS = 'UPDATE_TIMESHEET_SUCCESS';
export const UPDATE_TIMESHEET_FAILED = 'UPDATE_TIMESHEET_FAILED';

export const LIST_MORE_TIMESHEETS_START = 'LIST_MORE_TIMESHEETS_START';
export const LIST_MORE_TIMESHEETS_SUCCESS = 'LIST_MORE_TIMESHEETS_SUCCESS';
export const LIST_MORE_TIMESHEETS_FAILED = 'LIST_MORE_TIMESHEETS_FAILED';


export function createTimesheet(timesheet) {
    return dispatch => {
        dispatch(createTimesheetStart(timesheet));
        axios.post(`${ENPOINT_TIME_ENTRY}/`, timesheet)
             .then(function(response) {
                dispatch(createTimesheetSuccess(response.data))
              }).catch(function(response) {
                    dispatch(createTimesheetFailed(response.data))
              });
    }
}

export function listTimesheets(taskId) {
    return dispatch => {
        dispatch(listTimesheetsStart());
        axios.get(`${ENPOINT_TIME_ENTRY}?task=${taskId}`)
            .then(function(response) {
                dispatch(listTimesheetsSuccess(response.data))
            }).catch(function(response) {
                dispatch(listTimesheetsFailed(response.data))
            });
    }
}

export function updateTimesheet(timesheet_id, timesheet) {
    return dispatch => {
        dispatch(updateTimesheetStart(timesheet_id));
        axios.patch(`${ENPOINT_TIME_ENTRY}/${timesheet_id}/`, timesheet)
            .then(function(response) {
                dispatch(updateTimesheetSuccess(response.data))
            }).catch(function(response) {
                dispatch(updateTimesheetFailed(response.data))
            });
    }
}

export function createTimesheetStart(timesheet) {
    return {
        type: CREATE_TIMESHEETS_START,
        timesheet
    }
}

export function createTimesheetSuccess(timesheet) {
    return {
        type: CREATE_TIMESHEETS_SUCCESS,
        timesheet
    }
}

export function createTimesheetFailed(error) {
    return {
        type: CREATE_TIMESHEETS_FAILED,
        error
    }
}

export function listTimesheetsStart(filter) {
    return {
        type: LIST_TIMESHEETS_START
    }
}

export function listTimesheetsSuccess(response) {
    return {
        type: LIST_TIMESHEETS_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count
    }
}

export function listTimesheetsFailed(error) {
    return {
        type: LIST_TIMESHEETS_FAILED,
        error
    }
}

export function updateTimesheetStart(id) {
    return {
        type: UPDATE_TIMESHEET_START,
        id
    }
}

export function listMoreTimesheets(url) {
    return dispatch => {
        dispatch(listMoreTimesheetsStart(url));
        axios.get(url)
            .then(function(response) {
                dispatch(listMoreTimesheetsSuccess(response.data))
            }).catch(function(response) {
                dispatch(listMoreTimesheetsFailed(response.data))
            });
    }
}

export function listMoreTimesheetsStart(url) {
    return {
        type: LIST_MORE_TIMESHEETS_START,
        url
    }
}

export function listMoreTimesheetsSuccess(response) {
    return {
        type: LIST_MORE_TIMESHEETS_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count
    }
}

export function listMoreTimesheetsFailed(error) {
    return {
        type: LIST_MORE_TIMESHEETS_FAILED,
        error
    }
}

export function updateTimesheetSuccess(timesheet) {
    return {
        type: UPDATE_TIMESHEET_SUCCESS,
        timesheet
    }
}

export function updateTimesheetFailed(error) {
    return {
        type: UPDATE_TIMESHEET_FAILED,
        error
    }
}

