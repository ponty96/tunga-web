import * as MultiTasksPaymentActions from "../actions/MultiTasksPaymentActions";
import _ from "lodash";

const initialState = {
  isFetching: false,
  tasks: [],
  data: null
};

const onTaskRemove = (state, { task }) => {
  let tasks = state.tasks;
  _.remove(state.tasks, content => task.id == content.id);
  return { ...state, tasks: tasks };
};
export default function(state = initialState, action) {
  switch (action.type) {
    case MultiTasksPaymentActions.ADD_TO_MULTI_TASK_PAYMENT:
      return { ...state, tasks: [...state.tasks, action.task] };
    case MultiTasksPaymentActions.REMOVE_FROM_MULTI_TASK_PAYMENT:
      return onTaskRemove(state, action);
    case MultiTasksPaymentActions.CREATE_MULTI_TASK_PAYMENT:
      return {...state, isFetching: true}
    case MultiTasksPaymentActions.CREATE_MULTI_TASK_PAYMENT_SUCCESS:
      return {...state, data: action.multiTask, isFetching: false}
    default:
      return state;
  }
}
