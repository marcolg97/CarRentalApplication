import React from 'react';
import moment from 'moment';

import './App.css';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import API from './api/API';

import BrowsingComponent from './component/BrowsingComponent';
import Reservation from './component/Reservation';
import { LoginComponent } from './component/LoginComponent';
import TopNavbar from './component/TopNavbar';
import { OptionalErrorMsg } from './component/Loading';
import InteractiveConfiguration from './component/InteractiveConfiguration';
import { NoPageFound } from './component/Loading';

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			vehicle: [], // List of all vehicles

			isLoggedIn: false, // Represents if the user isLoggedIn or not

			userId: -1, // Id of the authenticated user
			frequentCostumer: false, // Represents if a customer is frequent or not
			reservation: [], // List of all reservations of the authenticated user

			errorMsg: '', // Represents the error message
			openMobileMenu: false, // The left sidebar disappears under a button if the display is small
			loading: true, // Represents if the components is loading
		};
	}

	componentDidMount() {
		//I retrieve the categories and the vehicles with API call
		//I find the distinct brands among the vehicles and I set loading false in order to show the list

		API.getAllVehicles()
			.then(veh => {
				this.setState({ vehicle: veh, loading: false });
			})
			.catch(errorObj => {
				const err0 = errorObj.errors[0];
				this.setState({ errorMsg: ` ${err0.msg}` });
			});
	}

	// The function will be called when the user is successfully authenticated (inside setLogin)
	loadInitialData() {
		//I need reservations inside App because they are useful to understand if the user is a frequent customer
		API.getReservation()
			.then(reservations => {
				// Understand if the user is a frequent costumer
				// Retrieve the number of past reservations (reservation with end date before than today)
				const end_reservations = reservations.filter(res => moment(res.enddate).isBefore(moment(), 'day'));
				const n_end_reservations = end_reservations.length;

				// If this number is greater than 3, the user is a frequent costumer
				if (n_end_reservations > 3) {
					console.log(`DEBUG: User is a frequent costumer`);
					this.setState({ frequentCostumer: true });
				}

				this.setState({ reservation: reservations });
			})
			.catch(errorObj => {
				const err0 = errorObj.errors[0];
				this.setState({ errorMsg: ` ${err0.msg}` });

				if (errorObj.status && errorObj.status === 401) {
					setTimeout(() => {
						this.setState({ errorMsg: '' });
						this.setLogout();
					}, 2000);
				}
			});
	}

	//I need this to toggle the left sidebar on smaller devices
	showSidebar = () => this.setState(state => ({ openMobileMenu: !state.openMobileMenu }));

	//This function is called when the user becomes authenticated
	setLogin = userObj => {
		//I set that the user isLoggedIn and I memorize the user name and id
		this.setState(state => ({
			isLoggedIn: true,
			userId: userObj.id,
		}));

		//Then I call this function that load user data
		this.loadInitialData();
	};

	//This function is called when the user click on logout button
	//I call the API that eliminate the token and I eliminate the user information from the state
	setLogout = () => {
		API.userLogout()
			.then(() => {
				this.setState(state => ({
					isLoggedIn: false,
					userId: -1,
					frequentCostumer: false,
					reservation: [],
				}));
			})
			.catch(errorObj => {
				const err0 = errorObj.errors[0];
				this.setState({ errorMsg: ` ${err0.msg}` });
			});
	};

	//This function is called when the user cancel a reservation inside 'reservation page'
	//I delete the reservation and then I update reservations inside the state
	cancelReservation = idReservation => {
		API.deleteReservation(idReservation)
			.then(() => {
				API.getReservation()
					.then(reservations => {
						this.setState({ reservation: reservations });
					})
					.catch(errorObj => {
						const err0 = errorObj.errors[0];
						this.setState({ errorMsg: ` ${err0.msg}` });

						if (errorObj.status && errorObj.status === 401) {
							setTimeout(() => {
								this.setState({ errorMsg: '' });
								this.setLogout();
							}, 2000);
						}
					});
			})
			.catch(errorObj => {
				const err0 = errorObj.errors[0];
				this.setState({ errorMsg: ` ${err0.msg}` });

				if (errorObj.status && errorObj.status === 401) {
					setTimeout(() => {
						this.setState({ errorMsg: '' });
						this.setLogout();
					}, 2000);
				}
			});
	};

	//This function is called when the user make a new reservation
	updateReservation = () => {
		API.getReservation()
			.then(reservations => {
				this.setState({ reservation: reservations });
			})
			.catch(errorObj => {
				const err0 = errorObj.errors[0];
				this.setState({ errorMsg: ` ${err0.msg}` });

				if (errorObj.status && errorObj.status === 401) {
					setTimeout(() => {
						this.setState({ errorMsg: '' });
						this.setLogout();
					}, 2000);
				}
			});
	};

	cancelErrorMsg = () => {
		this.setState({ errorMsg: '' });
	};

	setErrorMsg = error => {
		this.setState({ errorMsg: error });
	};

	render() {
		return (
			<Router>
				<div className='App'>
					<TopNavbar showSidebar={this.showSidebar} isLoggedIn={this.state.isLoggedIn} setLogout={this.setLogout} />
					<OptionalErrorMsg errorMsg={this.state.errorMsg} cancelErrorMsg={this.cancelErrorMsg} />
					<Switch>
						<Route exact path='/'>
							<BrowsingComponent
								setErrorMsg={this.setErrorMsg} //need this if some problem during API call occurred
								openMobileMenu={this.state.openMobileMenu} //need this because the left sidebar disappear on small display
								isLoggedIn={this.state.isLoggedIn} //need this because this page is visible only to unauthenticated user
							/>
						</Route>
						<Route exact path='/login'>
							<LoginComponent
								setLogin={this.setLogin} //this function must be called when the user becomes authenticated
								isLoggedIn={this.state.isLoggedIn} //need this because this page is visible only to unauthenticated user
							/>
						</Route>
						<Route exact path='/reservation'>
							<Reservation
								isLoggedIn={this.state.isLoggedIn} //need this because this page is visible only to unauthenticated user
								reservation={this.state.reservation} //need to display the list of reservations
								cancelReservation={this.cancelReservation} //when a user cancel a reservation from this page
							/>
						</Route>
						<Route path='/book'>
							<InteractiveConfiguration
								vehicle={this.state.vehicle} //need this because inside price logic we need the number of all vehicles of a category
								isLoggedIn={this.state.isLoggedIn} //need this to limit the access only to authenticated user
								frequentCostumer={this.state.frequentCostumer} //need this for the price logic
								userId={this.state.userId} //need this to call API for memorize the rental
								setLogout={this.setLogout} // need this to logout the user if it doesn't have the token
								updateReservation={this.updateReservation} //when a user add a new reservation
							/>
						</Route>
						<Route path='/'>
							<NoPageFound />
						</Route>
					</Switch>
				</div>
			</Router>
		);
	}
}

export default App;
