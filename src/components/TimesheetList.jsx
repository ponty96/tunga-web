import React, { PropTypes } from 'react';
export default class TimesheetList extends React.Component {
    static propTypes = {
        timesheets: PropTypes.array.isRequired
    }
    render() {
        return (
            <div>
               {this.renderList()}
            </div>
        )
    }

    renderList = () => {
        const {timesheets} = this.props
        return timesheets.map((content, index) => (
                <div className="timesheet-box" key={index}>
                    <div className="inline-flex">
                        <h5>Spent at: </h5> <h5>{content.spent_at}</h5>
                    </div>
                    <div className="inline-flex">
                        <h5>Hours:</h5> <h5> {content.hours} hours</h5>
                    </div>
                    <div className="timesheet desc">
                        <h5>Description</h5>
                        <p>{content.description}</p>
                    </div>
                </div>
            ))
    }
}

