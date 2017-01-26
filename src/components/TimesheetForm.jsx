import React from 'react';

export default class TimesheetForm extends React.Component {
	constructor(){
		super()
		this.state = {
			spent_at: "",
			hours: 0,
			description: ""
		}
	}
	render(){
		const {spent_at, hours, description} = this.state
		return (
			<form className="timesheet-form">
				<div className="form-inline">
					<input  type="text" 
									placeholder="spent_at" 
									className="form-control" 
									value={spent_at}
									onChange={(e) => this.setValue("spent_at", e.target.value)} />

					<input  type="number" 
									placeholder="Hours" 
									className="form-control" 
									value={hours}
									onChange={(e) => this.setValue("hours", e.target.value)}/>
				</div>
				<textarea  placeholder="Description" 
									 className="form-control" 
									 value={description}
									 onChange={(e) => this.setValue("description", e.target.value)}></textarea>

				<span className="input-group-btn">
            <button type="button" className="btn" onClick={this.onSubmit}>
               <i className="fa fa-paper-plane"/> Save
            </button>
        </span>
			</form>
			)
	}

	onSubmit = () => {
		this.props.submitForm(this.state)
	}

	setValue(key, val){
		let state =  this.state;
		state[key] = val
		this.setState(state)
	}
}