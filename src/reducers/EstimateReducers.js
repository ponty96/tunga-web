import { combineReducers } from "redux";
import * as EstimateActions from "../actions/EstimateActions";
import { PATH_CHANGE } from "../actions/NavActions";

function estimate(state = {}, action) {
  switch (action.type) {
    case EstimateActions.CREATE_ESTIMATE_SUCCESS:
    case EstimateActions.RETRIEVE_ESTIMATE_SUCCESS:
      return action.estimate;
    case EstimateActions.UPDATE_ESTIMATE_SUCCESS:
      return { ...state, ...action.estimate };
    case EstimateActions.DELETE_ESTIMATE_SUCCESS:
    case EstimateActions.CREATE_ESTIMATE_START:
    case EstimateActions.CREATE_ESTIMATE_FAILED:
    case EstimateActions.RETRIEVE_ESTIMATE_START:
    case EstimateActions.RETRIEVE_ESTIMATE_FAILED:
      return {};
    default:
      return state;
  }
}

function estimates(state = {}, action) {
  switch (action.type) {
    case EstimateActions.LIST_ESTIMATES_SUCCESS:
    case EstimateActions.LIST_MORE_ESTIMATES_SUCCESS:
      var all_estimates = {};
      action.items.forEach(estimate => {
        all_estimates[estimate.id] = estimate;
      });
      return { ...state, ...all_estimates };
    case EstimateActions.LIST_ESTIMATES_START:
    case EstimateActions.LIST_ESTIMATES_FAILED:
      return {};
    default:
      return state;
  }
}

function ids(state = [], action) {
  switch (action.type) {
    case EstimateActions.LIST_ESTIMATES_SUCCESS:
      return action.items.map(estimate => {
        return estimate.id;
      });
    case EstimateActions.LIST_MORE_ESTIMATES_SUCCESS:
      var new_estimates = action.items.map(estimate => {
        return estimate.id;
      });
      return [...state, ...new_estimates];
    case EstimateActions.LIST_ESTIMATES_START:
    case EstimateActions.LIST_ESTIMATES_FAILED:
      return [];
    default:
      return state;
  }
}

function next(state = null, action) {
  switch (action.type) {
    case EstimateActions.LIST_ESTIMATES_SUCCESS:
    case EstimateActions.LIST_MORE_ESTIMATES_SUCCESS:
      return action.next;
    default:
      return state;
  }
}

function previous(state = null, action) {
  switch (action.type) {
    case EstimateActions.LIST_ESTIMATES_SUCCESS:
    case EstimateActions.LIST_MORE_ESTIMATES_SUCCESS:
      return action.previous;
    default:
      return state;
  }
}

function isSaving(state = false, action) {
  switch (action.type) {
    case EstimateActions.CREATE_ESTIMATE_START:
    case EstimateActions.UPDATE_ESTIMATE_START:
      return true;
    case EstimateActions.CREATE_ESTIMATE_SUCCESS:
    case EstimateActions.CREATE_ESTIMATE_FAILED:
    case EstimateActions.UPDATE_ESTIMATE_SUCCESS:
    case EstimateActions.UPDATE_ESTIMATE_FAILED:
    case EstimateActions.RETRIEVE_ESTIMATE_START:
      return false;
    default:
      return state;
  }
}

function isSaved(state = false, action) {
  switch (action.type) {
    case EstimateActions.CREATE_ESTIMATE_SUCCESS:
    case EstimateActions.UPDATE_ESTIMATE_SUCCESS:
      return true;
    case EstimateActions.CREATE_ESTIMATE_START:
    case EstimateActions.CREATE_ESTIMATE_FAILED:
    case EstimateActions.UPDATE_ESTIMATE_START:
    case EstimateActions.UPDATE_ESTIMATE_FAILED:
    case PATH_CHANGE:
      return false;
    default:
      return state;
  }
}

function isFetching(state = false, action) {
  switch (action.type) {
    case EstimateActions.LIST_ESTIMATES_START:
      return true;
    case EstimateActions.LIST_ESTIMATES_SUCCESS:
    case EstimateActions.LIST_ESTIMATES_FAILED:
      return false;
    default:
      return state;
  }
}

function isFetchingMore(state = false, action) {
  switch (action.type) {
    case EstimateActions.LIST_MORE_ESTIMATES_START:
      return true;
    case EstimateActions.LIST_MORE_ESTIMATES_SUCCESS:
    case EstimateActions.LIST_MORE_ESTIMATES_FAILED:
      return false;
    default:
      return state;
  }
}

function isRetrieving(state = false, action) {
  switch (action.type) {
    case EstimateActions.RETRIEVE_ESTIMATE_START:
      return true;
    case EstimateActions.RETRIEVE_ESTIMATE_SUCCESS:
    case EstimateActions.RETRIEVE_ESTIMATE_FAILED:
      return false;
    default:
      return state;
  }
}

function isDeleting(state = false, action) {
  switch (action.type) {
    case EstimateActions.DELETE_ESTIMATE_START:
      return true;
    case EstimateActions.DELETE_ESTIMATE_SUCCESS:
    case EstimateActions.DELETE_ESTIMATE_FAILED:
      return false;
    default:
      return false;
  }
}

function error(state = {}, action) {
  switch (action.type) {
    case EstimateActions.CREATE_ESTIMATE_FAILED:
      return { ...state, create: action.error };
    case EstimateActions.CREATE_ESTIMATE_START:
    case EstimateActions.CREATE_ESTIMATE_SUCCESS:
      return { ...state, create: null };
    case EstimateActions.UPDATE_ESTIMATE_FAILED:
      return { ...state, update: action.error };
    case EstimateActions.UPDATE_ESTIMATE_START:
    case EstimateActions.UPDATE_ESTIMATE_SUCCESS:
      return { ...state, update: null };
    default:
      return state;
  }
}

const detail = combineReducers({
  estimate,
  isRetrieving,
  isSaving,
  isSaved,
  isDeleting,
  error
});

const list = combineReducers({
  estimates,
  ids,
  isFetching,
  isFetchingMore,
  next,
  previous
});

const Estimate = combineReducers({
  detail,
  list
});

export default Estimate;
