import React, { useState, useRef } from 'react';
import { Redirect } from 'react-router-dom';
import API from '../api/API';
import { OptionalErrorMsg } from './Loading';

/**
 * Component that represents login. With this component the user can login or can goBack to BrowsingComponent
 * @param {*} props
 */

function LoginComponent(props) {
	//This state represents if the login was successful. When is true it will redirect to '/book'
	const [loginSuccess, setLoginSuccess] = useState(false);

	//This state represents if the user want to goBack (i.e. no longer wants to login). When is true it will redirect to '/'
	const [loginCancel, setLoginCancel] = useState(false);

	//This state represents if the user is waiting for the login verification. When is true the login button is deactivated
	const [waitingLogin, setWaitingLogin] = useState(false);

	//This state contains an error occurred during the login and shows it inside the page
	const [LoginErrorMsg, setLoginErrorMsg] = useState('');

	//When the user click on 'Go Back' button
	const goBack = () => {
		setLoginCancel(true);
	};

	//This function is called by 'DoLogin' inside 'LoginForm' and it checks if the email and password is correct
	const doLoginCall = (user, pass) => {
		setWaitingLogin(true);
		API.userLogin(user, pass)
			.then(userObj => {
				//Call this function inside App.js and pass the information about the user (name, id)
				//This function will change the state to reflect to successful authentication
				props.setLogin(userObj);

				setWaitingLogin(false);
				setLoginErrorMsg('');
				setLoginSuccess(true);
			})
			.catch(errorObj => {
				const err0 = errorObj.errors[0];
				setLoginErrorMsg(` ${err0.msg}`);
				setWaitingLogin(false);
			});
	};

	//When the user click on the X inside the page, we cancel the error
	const cancelLoginErrorMsg = () => {
		setLoginErrorMsg('');
	};

	if (loginSuccess) {
		return <Redirect to='/book' />;
	} else if (loginCancel) {
		return <Redirect to='/' />;
	} else
		return (
			<div className={'container h-100'}>
				<div className='row h-100 justify-content-center align-items-center' style={{ marginTop: '5%' }}>
					<div>
						<h1>Login</h1>
						<p>Please login to book a car on our site</p>
						<OptionalErrorMsg errorMsg={LoginErrorMsg} cancelErrorMsg={cancelLoginErrorMsg} />
						<LoginForm goBack={goBack} doLoginCall={doLoginCall} waitingLogin={waitingLogin} />
					</div>
				</div>
			</div>
		);
}

/**
 * This component represents the login form. Has two field 'email' and 'password'.
 * When the user click on login, first we validate the form and than we call 'doLoginCall'
 * @param {*} props
 * 					- goBack: when the user click on the 'GoBack' button
 * 					- waitingLogin: when true the 'Login' button is disabled
 * 					- doLoginCall: check if username and password are correct
 */
function LoginForm(props) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const formRef = useRef();

	const updateUsernameField = value => {
		setEmail(value);
	};

	const updatePasswordField = value => {
		setPassword(value);
	};

	const doLogin = event => {
		event.preventDefault();
		if (formRef.current.checkValidity()) {
			props.doLoginCall(email, password);
		} else {
			formRef.current.reportValidity();
		}
	};

	const validateForm = event => {
		event.preventDefault();
	};

	return (
		<div className='col-12'>
			<form className='form' method={'POST'} onSubmit={validateForm} ref={formRef}>
				<div className={'form'}>
					<div className={'form-group'}>
						<label htmlFor='email'>Email</label>
						<input
							id='email'
							className={'form-control'}
							type='email'
							required={true}
							name='email'
							value={email}
							onChange={ev => updateUsernameField(ev.target.value)}
						/>
					</div>

					<div className={'form-group'}>
						<label htmlFor='password'>Password</label>
						<input
							id='password'
							className={'form-control'}
							type='password'
							required={true}
							name='password'
							value={password}
							onChange={ev => updatePasswordField(ev.target.value)}
						/>
					</div>
				</div>

				<div className={'form-row float-right'}>
					<button type='button' className='btn btn btn-light m-1' onClick={props.goBack}>
						Go Back
					</button>
					<button type='button' className='btn btn-primary m-1' disabled={props.waitingLogin} onClick={doLogin}>
						Login
					</button>
				</div>
			</form>
		</div>
	);
}

export { LoginComponent };
