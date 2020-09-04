// All the API calls are defined here

import Vehicle from './vehicle';
import Rental from './rental';

const BASEURL = '/api';

//This is a fake API. I did this because in this way I have this information separated from the application
const category = [
	{ id: 'A', name: 'Category A' },
	{ id: 'B', name: 'Category B' },
	{ id: 'C', name: 'Category C' },
	{ id: 'D', name: 'Category D' },
	{ id: 'E', name: 'Category E' },
];

async function getCategory() {
	return category;
}

/**
 * Function that takes email and password,
 * Call REST API: POST /login
 * Return an object with user information or an error (wrong email or password)
 *
 * @param {string} email (of the user for login)
 * @param {string} password (of the user for login)
 */
async function userLogin(email, password) {
	return new Promise((resolve, reject) => {
		fetch(BASEURL + '/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email: email, password: password }),
		})
			.then(response => {
				if (response.ok) {
					response
						.json()
						.then(obj => {
							resolve(obj);
						})
						.catch(err => {
							reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] });
						}); // something else
				} else {
					// analyze the cause of error
					response
						.json()
						.then(obj => {
							reject(obj);
						}) // error msg in the response body
						.catch(err => {
							reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] });
						}); // something else
				}
			})
			.catch(err => {
				reject({ errors: [{ param: 'Server', msg: 'Cannot communicate' }] });
			}); // connection errors
	});
}

/**
 * Function that logout the user
 * Call REST API: POST /logout (will eliminate the token inside browser)
 */
async function userLogout() {
	return new Promise((resolve, reject) => {
		fetch(BASEURL + '/logout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({}),
		})
			.then(response => {
				if (response.ok) {
					resolve(null);
				} else {
					reject({
						errors: [{ param: 'Server', msg: 'An error occurred, please reload the page' }],
					});
				}
			})
			.catch(err => {
				reject({ errors: [{ param: 'Server', msg: 'Cannot communicate' }] });
			}); // connection errors
	});
}

/**
 * Function that retrieve all the vehicles inside DB
 * Return all the vehicles or an error (with the status)
 * Call REST API: GET /vehicles
 */
async function getAllVehicles() {
	return new Promise((resolve, reject) => {
		fetch(BASEURL + '/vehicles', {
			method: 'GET',
		})
			.then(response => {
				const status = response.status;

				if (response.ok) {
					response
						.json()
						.then(obj => {
							resolve(obj.map(veh => Vehicle.from(veh)));
						})
						.catch(err => {
							reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] });
						}); // something else
				} else {
					// analyze the cause of error
					response
						.json()
						.then(obj => {
							obj.status = status;
							reject(obj);
						}) // error msg in the response body
						.catch(err => {
							reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] });
						}); // something else
				}
			})
			.catch(err => {
				reject({ errors: [{ param: 'Server', msg: 'Cannot communicate' }] });
			}); // connection errors
	});
}

/**
 * Function that retrieve all the free vehicle (i.e. all vehicle that are not booked inside period startDay-endDay)
 * Call REST API: GET /freeCar
 * param: startDay(string) and endDay(string)
 * Return all the free vehicles or an error (with the status)
 *
 * @param {string} startDay: day in format yyyy-mm-dd (2020-06-20)
 * @param {string} endDay: day in format yyyy-mm-dd (2020-06-20)
 */
async function getAllFreeVehicles(startDay, endDay) {
	return new Promise((resolve, reject) => {
		fetch(BASEURL + `/freeCar?startDay=${startDay}&endDay=${endDay}`, {
			method: 'GET',
		})
			.then(response => {
				const status = response.status;

				if (response.ok) {
					response
						.json()
						.then(obj => {
							resolve(obj.map(veh => Vehicle.from(veh)));
						})
						.catch(err => {
							reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] });
						}); // something else
				} else {
					// analyze the cause of error
					response
						.json()
						.then(obj => {
							obj.status = status;
							reject(obj);
						}) // error msg in the response body
						.catch(err => {
							reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] });
						}); // something else
				}
			})
			.catch(err => {
				reject({ errors: [{ param: 'Server', msg: 'Cannot communicate' }] });
			}); // connection errors
	});
}

/**
 * Function that add a new Rental inside the DB.
 * Call API: POST /rental
 *
 * @param {*} carid
 * @param {*} userid
 * @param {*} startdate
 * @param {*} enddate
 * @param {*} driverage
 * @param {*} extradrivers
 * @param {*} km
 * @param {*} extrainsurance
 * @param {*} price
 */
async function addRental(carid, userid, startdate, enddate, driverage, extradrivers, km, extrainsurance, price) {
	return new Promise((resolve, reject) => {
		fetch(BASEURL + '/rentals', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				carid: carid,
				userid: userid,
				startdate: startdate,
				enddate: enddate,
				driverage: driverage,
				extradrivers: extradrivers,
				km: km,
				extrainsurance: extrainsurance,
				price: price,
			}),
		})
			.then(response => {
				const status = response.status;

				if (response.ok) {
					resolve(null);
				} else {
					// analyze the cause of error
					response
						.json()
						.then(obj => {
							obj.status = status;
							reject(obj);
						}) // error msg in the response body
						.catch(err => {
							reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] });
						}); // something else
				}
			})
			.catch(err => {
				reject({ errors: [{ param: 'Server', msg: 'Cannot communicate' }] });
			}); // connection errors
	});
}

/**
 * Function that verify the information about the payment of a rental by the user
 * Call POST /payment
 * Return if the payment was successful or an error (with the status)
 *
 * @param {string} FullName : Name and surname of the card holder
 * @param {int} CardNumber : Number of the card (MUST BE 16 DIGITS; if not payment refused)
 * @param {int} CVV : Number of CVV of the card (MUST BE 3 DIGITS; if not payment refused)
 *
 * i.e. I choose to not validate the form with the Card Number and CVV length to create a situation in which the payment fails
 */
async function doPayment(FullName, CardNumber, CVV, Price) {
	return new Promise((resolve, reject) => {
		fetch(BASEURL + '/payment', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ FullName: FullName, CardNumber: CardNumber, CVV: CVV, Price: Price }),
		})
			.then(response => {
				const status = response.status;

				if (response.ok) {
					response
						.json()
						.then(obj => {
							resolve(obj);
						})
						.catch(err => {
							reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] });
						}); // something else
				} else {
					// analyze the cause of error
					response
						.json()
						.then(obj => {
							obj.status = status;
							reject(obj);
						}) // error msg in the response body
						.catch(err => {
							reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] });
						}); // something else
				}
			})
			.catch(err => {
				reject({ errors: [{ param: 'Server', msg: 'Cannot communicate' }] });
			}); // connection errors
	});
}

/**
 * Function that retrieve all the reservations associated with a user
 * Return all the rentals of the or an error (with the status)
 *
 * @param {String} userId: the id of the user
 */
async function getReservation() {
	let url = '/rentals';

	const response = await fetch(BASEURL + url);
	const reservationsJson = await response.json();

	if (response.ok) {
		return reservationsJson.map(
			t =>
				new Rental(
					t.id,
					t.carid,
					t.userid,
					t.startdate,
					t.enddate,
					t.driverage,
					t.extradrivers,
					t.km,
					t.extrainsurance,
					t.price
				)
		);
	} else {
		let err = { status: response.status, errObj: reservationsJson };
		throw err; // An object with the error coming from the server
	}
}

/**
 * Function that eliminate a reservation based on the id
 * Return nothing if the response is ok or an error (with the status)
 *
 * @param {int} reservationId : this is necessary to query the DB to eliminate the row
 */
async function deleteReservation(reservationId) {
	return new Promise((resolve, reject) => {
		fetch(BASEURL + '/rentals/' + reservationId, {
			method: 'DELETE',
		})
			.then(response => {
				const status = response.status;

				if (response.ok) {
					resolve(null);
				} else {
					// analyze the cause of error
					response
						.json()
						.then(obj => {
							obj.status = status;
							reject(obj);
						}) // error msg in the response body
						.catch(err => {
							reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] });
						}); // something else
				}
			})
			.catch(err => {
				reject({ errors: [{ param: 'Server', msg: 'Cannot communicate' }] });
			}); // connection errors
	});
}

const API = {
	getCategory,
	getAllVehicles,
	userLogin,
	userLogout,
	getAllFreeVehicles,
	addRental,
	doPayment,
	getReservation,
	deleteReservation,
};
export default API;
