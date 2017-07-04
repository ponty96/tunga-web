import React from "react";
import { connect } from "react-redux";
import * as MultiTaskPaymentActions from "../actions/MultiTaskPaymentActions";

class MultiTaskCheckItem extends React.Component {
  static propTypes = {
    task: React.PropTypes.shape({
      id: React.PropTypes.number.isRequired,
      fee: React.PropTypes.string.isRequired
    }),
    selectedTasks: React.PropTypes.array.isRequired
  };
  render() {
    console.log(this.props.selectedTasks);
    return (
      <input
        type="checkbox"
        className="tasks_to_pay"
        checked={this.isChecked()}
        onChange={this.handleChange}
      />
    );
  }

  isChecked = () => {
    const { task, selectedTasks } = this.props;
    const selectedTask = selectedTasks.find(content => content.id === task.id);
    console.log(selectedTask, "selectedTask")
    if (typeof selectedTask == "object" && selectedTask != null) {
      return true;
    } else return false;
  };

  handleChange = () => {
    const { task, dispatch } = this.props;
    if (this.isChecked()) {
      dispatch(MultiTaskPaymentActions.removeTaskFromMultiTaskPayment(task));
    } else {
      dispatch(MultiTaskPaymentActions.addTaskToMultiTaskPayment(task));
    }
  };
}

export default connect(state => ({
  selectedTasks: state.MultiTasksPayment.tasks
}))(MultiTaskCheckItem);
