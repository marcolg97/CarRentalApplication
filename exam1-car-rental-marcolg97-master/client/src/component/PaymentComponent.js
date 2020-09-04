import React, { useState, useRef } from 'react';

function PaymentComponent(props) {
	return (
		<div style={{ marginTop: '50px' }}>
			<h5>Payment</h5>
			<p>Insert your data to pay for this solution</p>
			<PaymentFormComponent PaySolution={props.PaySolution} goBack={props.goBack} price={props.price} />
		</div>
	);
}

/**
 * This component represents the form for the payment
 * @param {*} props
 *                  - PaySolution: if the user want to pay. It will validate the payment
 *                  - goBack: if the user click on 'Go Back' form button
 *                  - Price: price of that solution
 */
function PaymentFormComponent(props) {
	const [Fullname, setFullName] = useState('');
	const [CardNumber, setCardNumber] = useState('');
	const [CVV, setCVV] = useState('');
	const formRef = useRef();

	const updateFullnameField = value => {
		setFullName(value);
	};

	const updateCardNumberField = value => {
		setCardNumber(value);
	};

	const updateCVVField = value => {
		setCVV(value);
	};

	const validateForm = event => {
		event.preventDefault();
	};

	const doPay = event => {
		event.preventDefault();
		if (formRef.current.checkValidity()) {
			props.PaySolution(props.price, Fullname, CardNumber, CVV);
		} else {
			formRef.current.reportValidity();
		}
	};

	//I choose not to put validator of the digits of CardNumber and CVV in the form because in this way I show an error coming from the fake PAYMENT API
	return (
		<form className='form' method={'POST'} onSubmit={validateForm} ref={formRef}>
			<div className='form-group'>
				<div className={'form-group '}>
					<label htmlFor='FullName'>Full Name</label>
					<input
						id='FullName'
						className={'form-control'}
						type='text'
						required={true}
						name='FullName'
						placeholder='John Doe'
						value={Fullname}
						onChange={ev => updateFullnameField(ev.target.value)}
					/>
				</div>
				&nbsp;
				<div className={'form-group'}>
					<label htmlFor='CardNumber'>Card Number (must be exact 16 digits)</label>
					<input
						id='CardNumber'
						className={'form-control'}
						type='number'
						required={true}
						name='CardNumber'
						placeholder='1234567891234567'
						min={0}
						value={CardNumber}
						onChange={ev => updateCardNumberField(ev.target.value)}
					/>
				</div>
				<div className={'form-group'}>
					<label htmlFor='CVV'>CVV Number (must be exact 3 digits)</label>
					<input
						id='CVV'
						className={'form-control'}
						type='number'
						required={true}
						name='CVV'
						min={0}
						placeholder='123'
						value={CVV}
						onChange={ev => updateCVVField(ev.target.value)}
					/>
				</div>
				<div className={'form-row float-right'}>
					<button type='button' className='btn btn-light m-1' onClick={props.goBack}>
						Go Back
					</button>
					<button type='button' className='btn btn-primary m-1' onClick={doPay}>
						Pay
					</button>
				</div>
			</div>
		</form>
	);
}

export default PaymentComponent;
