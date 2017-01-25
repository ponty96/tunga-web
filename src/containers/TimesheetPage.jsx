import React from 'react';
import { SingleDatePicker } from 'react-dates';
import TimesheetForm from './../components/TimesheetForm'
import connect from '../utils/connectors/TimesheetConnector';

class TimesheetPage extends React.Component {
	render(){
		return (
			<div>
					<h3 styles={{paddingLeft: 10}}>Time sheets</h3>
				 <TimesheetForm />
			</div>
			)
	}
}

export default connect(TimesheetPage);