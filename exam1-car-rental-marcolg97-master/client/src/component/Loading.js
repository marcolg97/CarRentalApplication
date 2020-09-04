import React from 'react';
import NoResultImg from '../no_results_found.png';
import NoPageImg from '../boat_404.png';
import { Link } from 'react-router-dom';

function Loading(props) {
	return (
		<div className='d-flex mx-auto ' style={{ margin: '30px' }}>
			<div className='spinner-border m-2' role='status' aria-hidden='true'></div>
			<strong style={{ marginTop: '10px' }}>Loading...</strong>
		</div>
	);
}

function OptionalErrorMsg(props) {
	if (props.errorMsg)
		return (
			<div style={{ marginTop: '30px' }} className='alert alert-danger alert-dismissible show' role='alert'>
				<strong>Error:</strong> <span>{props.errorMsg}</span>
				<button type='button' className='close' aria-label='Close' onClick={props.cancelErrorMsg}>
					<span aria-hidden='true'>&times;</span>
				</button>
			</div>
		);
	else return null;
}

function NoResult(props) {
	return (
		<div style={{ marginTop: '30px' }}>
			<h5>{props.msg}</h5>
			<img src={NoResultImg} alt={'NoResult'} />
		</div>
	);
}

/**
 * This components represents the layout of the Page not Found (i.e. when user write a link that doesn't exist)
 * @param {*} props
 */
function NoPageFound(props) {
	return (
		<div style={{ marginTop: '30px' }}>
			<h2>Page not found</h2>
			<Link className={'btn btn-primary'} style={{ marginTop: '30px' }} to={'/'}>
				Go to home
			</Link>
			<div>
				<img src={NoPageImg} alt={'NoResult'} width={900} />
			</div>
		</div>
	);
}

export { Loading, OptionalErrorMsg, NoResult, NoPageFound };
