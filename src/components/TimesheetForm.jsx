import React from 'react';

export default class TimesheetForm extends React.Component {
	constructor() {
		super()
		this.state = {
			spent_at: "",
			hours: "hours spent",
			description: ""
		}
	}
	render() {
		const {spent_at, hours, description} = this.state
		return (
			<form className="timesheet-form">
					<input type="date"
						placeholder="Spent at"
						className="form-control"
						value={spent_at}
						onChange={(e) => this.setValue("spent_at", e.target.value)} />
				<div className="form-inline">
					<input type="number"
						placeholder="Hours"
						className="form-control"
						value={hours}
						onChange={(e) => this.setValue("hours", parseInt(e.target.value))} />
				</div>
				<textarea placeholder="Description"
					className="form-control"
					value={description}
					onChange={(e) => this.setValue("description", e.target.value)}></textarea>

				<span className="input-group-btn">
					<button type="button" className="btn" onClick={this.onSubmit}>
						<i className="fa fa-paper-plane" /> Save
            </button>
				</span>
			</form>
		)
	}

	onSubmit = () => {
		const formData = this.state
		if(formData['spent_at'] && formData['hours'] && formData['description']){
			this.props.submitForm(formData);
		}
	}

	setValue(key, val) {
		let state = this.state;
		state[key] = val
		this.setState(state)
	}
}