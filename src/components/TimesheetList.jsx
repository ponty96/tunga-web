import React, { PropTypes } from 'react';
export default class TimesheetList extends React.Component {
  static propTypes = {
    timesheets: PropTypes.array.isRequired
  }
  render() {
    return (
      <div>
        <div className="container">
          <h4>Timesheets - Total Hours({this.props.count})</h4>
          <table className="table table-striped" style={{width: "80%"}}>
            <thead>
              <tr>
                <th>Spent at</th>
                <th>Hours</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {this.renderBody()}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  renderBody = () => {
    const {timesheets} = this.props
    return timesheets.map((content, index) => (
      <tr key={index}>
        <td>{content.spent_at}</td>
        <td>{content.hours} hours</td>
        <td>{content.description}</td>
        <td>
          <i className="fa fa-edit" onClick={() => this._openEditForm(content.id)}></i>
        </td>
      </tr>
    ))
  }

  _openEditForm(id){
    this.props.openEditForm(id)
  }
}

