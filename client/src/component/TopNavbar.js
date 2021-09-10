import React from 'react';
import { AppTitle, LogIn, NavbarLink } from './NavbarComponents';

/**
 * Component that represents the application Navbar. It has a title, a link to reservation page and a login button
 * @param {*} props
 * 					- isLoggedIn
 * 					- showSidebar
 * 					- setLogout
 */
function TopNavbar(props) {
	return (
		<nav className='navbar navbar-expand-md navbar-light bg-light'>
			<AppTitle isLoggedIn={props.isLoggedIn} showSidebar={props.showSidebar} />
			{props.isLoggedIn && <NavbarLink />}
			<LogIn isLoggedIn={props.isLoggedIn} setLogout={props.setLogout} />
		</nav>
	);
}

export default TopNavbar;
