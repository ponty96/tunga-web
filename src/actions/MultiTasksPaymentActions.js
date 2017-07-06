import axios from "axios";
import { ENDPOINT_MULTI_TASK_PAYMENT } from "../constants/Api";

export const ADD_TO_MULTI_TASK_PAYMENT = "ADD_TO_MULTI_TASK_PAYMENT";
export const REMOVE_FROM_MULTI_TASK_PAYMENT = "REMOVE_FROM_MULTI_TASK_PAYMENT";
export const CREATE_MULTI_TASK_PAYMENT = "CREATE_MULTI_TASK_PAYMENT";
export const CREATE_MULTI_TASK_PAYMENT_SUCCESS =
  "CREATE_MULTI_TASK_PAYMENT_SUCCESS";
export const CREATE_MULTI_TASK_PAYMENT_FAILED =
  "CREATE_MULTI_TASK_PAYMENT_FAILED";

export function addTaskToMultiTaskPayment(task) {
  return {
    type: ADD_TO_MULTI_TASK_PAYMENT,
    task: task
  };
}

export function removeTaskFromMultiTaskPayment(task) {
  return {
    type: REMOVE_FROM_MULTI_TASK_PAYMENT,
    task: task
  };
}

export function createMultiTasksPaymentStart() {
  return {
    type: CREATE_MULTI_TASK_PAYMENT
  };
}

export function createMultiTasksPaymentSuccess(response) {
  return {
    type: CREATE_MULTI_TASK_PAYMENT_SUCCESS,
    multiTask: response
  };
}

/**
 *
 * formData = {
    fee: 300
    tasks: [1, 3, 4]
  }


 */
export function createMultiTasksPayment(formData) {
  const responseData = {
    id: 1,
    fee: formData.fee,
    tasks: [1, 3, 4],
    btc_address: "1Fo18Egq1vybW9D9rhsXsEMoPYDqNTcGam",
    payment_method: null,
    paid: false,
    paid_at: null,
    withhold_tunga_fee: false,
    created_at: "2017-06-19T18:50:36.320151",
    updated_at: "2017-06-19T18:50:36.320172"
  };
  return dispatch => {
    dispatch(createMultiTasksPaymentStart());
    setTimeout(() => {
      dispatch(createMultiTasksPaymentSuccess(responseData));
    }, 3000);
  };
}
