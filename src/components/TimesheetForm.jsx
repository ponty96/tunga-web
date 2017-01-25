import React from 'react';

export default class TimesheetForm extends React.Component {
	render(){
		return (
			<form className="timesheet-form">
				<div className="form-inline">
					<input type="datetime" placeholder="spent_at" className="form-control"/>
					<input type="text" placeholder="Hours" className="form-control"/>
				</div>
				<textarea placeholder="Description" className="form-control"></textarea>
				<span className="input-group-btn">
            <button type="button" className="btn" >
               <i className="fa fa-paper-plane"/> Save
            </button>
        </span>
			</form>
			)
	}
}