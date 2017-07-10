import React from "react";

export default class MultiTaskCheckItem extends React.Component {
  static propTypes = {
    task: React.PropTypes.shape({
      id: React.PropTypes.number.isRequired,
      fee: React.PropTypes.number.isRequired
    }),
    selectedTasks: React.PropTypes.array.isRequired,
    removeTaskFromMultiTasksPayment: React.PropTypes.func.isRequired,
    addTaskToMultiTasksPayment: React.PropTypes.func.isRequired
  };
  render() {
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
    if (typeof selectedTask == "object" && selectedTask != null) {
      return true;
    } else return false;
  };

  handleChange = () => {
    const { task, dispatch } = this.props;
    if (this.isChecked()) {
      this.props.removeTaskFromMultiTasksPayment(task);
    } else {
      this.props.addTaskToMultiTasksPayment(task);
    }
  };
}
