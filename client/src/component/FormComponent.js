import React, { useState, useRef } from 'react';
import moment from 'moment';
import { OptionalErrorMsg } from './Loading';

/**
 * This component is the container of the form
 * @param {*} props
 * 					-setLoading
 * 					-showResults
 */
function FormComponent(props) {
	return (
		<div className='main_content' style={{ textAlign: 'left' }}>
			<h4>Configurator</h4>
			<p>Fill the fields in the form to obtain a result, please</p>
			<Form ShowResults={props.ShowResults} setLoading={props.setLoading} />
		</div>
	);
}

/**
 * This component represents the form where the user can choose the configuration of the solution
 * @param {*} props
 * 					-setLoading: set loading into true; if this way the result of the previous search disappear
 * 					-showResults: function that retrieve the car with this characteristic
 */
function Form(props) {
	//State that represents the values ​​of the form fields
	const [FormData, setFormData] = useState({
		startDay: '',
		endDay: '',
		category: '',
		driverAge: 18,
		extraDriver: 0,
		extraInsurance: false,
		kilometer: 10,
	});

	//State that contains the errors that must be shown on the page
	const [ErrorMsg, setErrorMsg] = useState('');

	const formRef = useRef();

	const cancelErrorMsg = () => {
		setErrorMsg('');
	};

	const updateField = (name, value) => {
		//Change the state with the new field updated
		const newData = { ...FormData, [name]: value };
		setFormData(newData);

		//Check if the user has completed all the necessary fields in the form to obtain a result (i.e. start date, end date, category)
		if (newData.category != '' && moment(newData.startDay).isValid() && moment(newData.endDay).isValid()) {
			//The user set all the necessary fields, so we check the validity.
			//If is valid we call show results that show the information about this configuration
			if (formRef.current.checkValidity()) {
				//Check if the start day is before the end day
				if (moment(newData.startDay).isBefore(newData.endDay)) {
					//Check if the start day is after today
					if (moment(newData.startDay).isAfter()) {
						setErrorMsg('');

						//I pass to showResults newData and not FormData because setState is asynchronous and
						//here the FormData does not have yet the updated data.
						//An alternative was to put this block of code inside a callback function of setState. I decided to do in this way
						//because I don't have to wait for the state update to show the result and because I have the new data inside 'newData' yet.
						props.ShowResults(
							newData.startDay,
							newData.endDay,
							newData.category,
							newData.driverAge,
							newData.extraDriver,
							newData.extraInsurance,
							newData.kilometer
						);
					} else {
						//The form is not correct so we set loading true in order to disappear the previous solution and appear a placeholder image
						props.setLoading();
						setErrorMsg('start date cannot be before today');
					}
				} else {
					//The form is not correct so we set loading true in order to disappear the previous solution
					props.setLoading();
					setErrorMsg('start date cannot be after end day');
				}
			} else {
				//The form is not correct so we set loading true in order to disappear the previous solution
				props.setLoading();
				setErrorMsg('form not correct');
				formRef.current.reportValidity();
			}
		}
		//If the user don't complete this three fields we don't do anything, the form does not yet have enough elements to show a result
	};

	return (
		<form className='form' method={'POST'} ref={formRef}>
			<div className='form-group'>
				<div className='row'>
					<div className='col'>
						<label htmlFor='startDay' className='col-sm-10 col-form-label'>
							Start Date
						</label>
						<div className='col-sm-12'>
							<input
								type='date'
								className='form-control'
								id='startDay'
								placeholder='Start Date'
								required={true}
								name='startDay'
								value={FormData.startDay}
								onChange={ev => updateField(ev.target.name, ev.target.value)}
							/>
						</div>
					</div>
					<div className='col'>
						<label htmlFor='endDay' className='col-sm-10 col-form-label'>
							End Day
						</label>
						<div className='col-sm-12'>
							<input
								type='date'
								className='form-control'
								id='endDay'
								placeholder='End Day'
								required={true}
								name='endDay'
								value={FormData.endDay}
								onChange={ev => updateField(ev.target.name, ev.target.value)}
							/>
						</div>
					</div>
				</div>
				&nbsp;
				<div className='col-sm-12'>
					<h6>Category</h6>
					<div style={{ marginLeft: '10px' }}>
						<CategoryCheckBox id={'categoryA'} value={'A'} categorySel={FormData.category} updateField={updateField} />
						<CategoryCheckBox id={'categoryB'} value={'B'} categorySel={FormData.category} updateField={updateField} />
						<CategoryCheckBox id={'categoryC'} value={'C'} categorySel={FormData.category} updateField={updateField} />
						<CategoryCheckBox id={'categoryD'} value={'D'} categorySel={FormData.category} updateField={updateField} />
						<CategoryCheckBox id={'categoryE'} value={'E'} categorySel={FormData.category} updateField={updateField} />
					</div>
					&nbsp;
					<div className={'form-group'}>
						<label htmlFor='driverAge'>Driver Age</label>
						<input
							id='driverAge'
							className={'form-control'}
							type='number'
							min={18}
							max={110}
							required={true}
							name='driverAge'
							value={FormData.driverAge}
							onChange={ev => updateField(ev.target.name, ev.target.value)}
						/>
					</div>
					<div className={'form-group'}>
						<label htmlFor='extraDriver'>Number of extra driver</label>
						<input
							id='extraDriver'
							className={'form-control'}
							type='number'
							min={0}
							max={100}
							required={true}
							name='extraDriver'
							value={FormData.extraDriver}
							onChange={ev => updateField(ev.target.name, ev.target.value)}
						/>
					</div>
					<div className='form-check'>
						<input
							className='form-check-input'
							type='checkbox'
							id={'extraInsurance'}
							name={'extraInsurance'}
							value={FormData.extraInsurance}
							checked={FormData.extraInsurance}
							onChange={ev => updateField(ev.target.name, ev.target.checked)}
						/>
						<label className='form-check-label text-dark' htmlFor={'extraInsurance'}>
							{'Extra Insurance'}
						</label>
					</div>
					&nbsp;
					<div className={'form-group'}>
						<label htmlFor='kilometers'>Kilometers per day</label>
						<input
							id='kilometers'
							className={'form-control'}
							type='number'
							min={1}
							max={10000}
							required={true}
							name='kilometer'
							value={FormData.kilometer}
							onChange={ev => updateField(ev.target.name, ev.target.value)}
						/>
					</div>
					<OptionalErrorMsg errorMsg={ErrorMsg} cancelErrorMsg={cancelErrorMsg} />
				</div>
			</div>
		</form>
	);
}

/**
 * This function represent a checkbox. It has the caracteristic that only one checkbox in the group
 * must be selected. So they refer all to 'category' inside the 'FormData' state.
 * @param {*} props:
 * 		- props.id: univoc id that represent the checkbox
 * 		- props.value: is the value of the checkbox (ex. 'A')
 * 		- props.categorySel: represent the category that is now selected
 * 		- props.updateField: is the function that update the state of a category
 */
function CategoryCheckBox(props) {
	return (
		<div className='form-check'>
			<input
				className='form-check-input'
				type='checkbox'
				id={props.id}
				name={'category'}
				value={props.value}
				checked={props.value === props.categorySel}
				onChange={ev => props.updateField(ev.target.name, ev.target.value)}
			/>
			<label className='form-check-label text-dark' htmlFor={props.id}>
				{`Category ${props.value}`}
			</label>
		</div>
	);
}

export default FormComponent;
