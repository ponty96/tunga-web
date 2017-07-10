import React from "react";
import Progress from "./status/Progress";
import _ from "lodash";
import moment from "moment";

export default class Planning extends React.Component {
  componentWillMount() {
    const { Milestone, MilestoneActions, params: { taskId } } = this.props;
    MilestoneActions.listMilestones({
      type: 3,
      task_id: taskId
    });
  }
  render() {
    const { Milestone: { list: { isFetching, milestones } } } = this.props;
    if (isFetching) return <Progress />;
    return (
      <div>
        <table className="table table-striped table-responsive">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Due At</th>
            </tr>
          </thead>
          <tbody>
            {this.renderMilestones(milestones)}
          </tbody>
        </table>
      </div>
    );
  }

  renderMilestones = milestones => {
    if (milestones) {
      return _.values(milestones).map(content =>
        <tr key={content["id"]}>
          <th>
            {content["title"]}
          </th>
          <th>
            <div dangerouslySetInnerHTML={{ __html: content["description"] }} />
          </th>
          <th>
            {moment.utc(content["due_at"]).local().format("D/MMM/YYYY")}
          </th>
        </tr>
      );
    }
  };
}
