import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import { Link, NavLink } from 'react-router-dom';

function AppTitle(props) {
	return (
		<>
			{!props.isLoggedIn && (
				<Navbar.Toggle
					onClick={props.showSidebar}
					className='navbar-toggler mr-4'
					aria-controls='left-sidebar'
					aria-expanded='false'
					aria-label='Toggle sidebar'>
					<span className='navbar-toggler-icon'></span>
				</Navbar.Toggle>
			)}

			<BrandName />
		</>
	);
}

function BrandName() {
	return (
		<a className='navbar-brand text-dark' href='#title'>
			<i className='fas fa-car fa-2x'></i> <span style={{ fontSize: '1.5em' }}> Car4You </span>
		</a>
	);
}

function NavbarLink() {
	return (
		<li className='nav nav-pills' style={{ margin: '3px' }}>
			<NavLink key='#home' exact to='/book' className={'nav-link'}>
				Home
			</NavLink>
			<NavLink key='#reservation' exact to='/reservation' className={'nav-link'}>
				Your reservation
			</NavLink>
		</li>
	);
}

function LogIn(props) {
	if (props.isLoggedIn) {
		return (
			<button onClick={props.setLogout} className='btn btn-outline-primary ml-auto'>
				Logout
			</button>
		);
	} else
		return (
			<Link className='btn btn-outline-primary ml-auto' to='/login'>
				Login
			</Link>
		);
}

export { AppTitle, LogIn, BrandName, NavbarLink };
