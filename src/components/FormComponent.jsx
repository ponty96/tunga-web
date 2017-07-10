import React from "react";
import { clearValidations } from "../actions/UtilityActions";
import store from "../store";

export default class FormComponent extends React.Component {
  componentWillUnmount() {
    store.dispatch(clearValidations());
  }
}
