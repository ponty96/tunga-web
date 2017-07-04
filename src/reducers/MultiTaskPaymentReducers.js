import * as MultiTaskPaymentActions from "../actions/MultiTaskPaymentActions";
import _ from "lodash";

const initialState = {
  isFetching: false,
  tasks: [],
  data: {}
};

const onTaskRemove = (state, { task }) => {
  let tasks = state.tasks;
  _.remove(state.tasks, content => task.id == content.id);
  return { ...state, tasks: tasks };
};
export default function(state = initialState, action) {
  switch (action.type) {
    case MultiTaskPaymentActions.ADD_TO_MULTI_TASK_PAYMENT:
      return { ...state, tasks: [...state.tasks, action.task] };
    case MultiTaskPaymentActions.REMOVE_FROM_MULTI_TASK_PAYMENT:
      return onTaskRemove(state, action);
    default:
      return state;
  }
}
