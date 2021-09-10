'use strict';

const db = require('./db');
const moment = require('moment');

const Vehicle = require('./vehicle');
const Rental = require('./rental');

// DAO module for accessing 'Vehicles' table and 'Rentals' table
// Data Access Object

// VEHICLES

/**
 * Function that create a Vehicle object from a row of the vehicles table
 * @param {*} row : a row of the rentals table
 */
const createVehicleObj = function (row) {
	const id = row.id;
	const category = row.category;
	const brand = row.brand;
	const model = row.model;

	return new Vehicle(id, category, brand, model);
};

/**
 * Get all the vehicles from vehicles table
 * return all the fields inside vehicles table (id, category, brand, model)
 *
 */
exports.listVehicles = function () {
	return new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM vehicles';
		db.all(sql, [], (err, rows) => {
			if (err) {
				reject(err);
				return;
			}
			const vehicles = rows.map(row => createVehicleObj(row));
			resolve(vehicles);
		});
	});
};

/**
 * Get vehicles that are available on the date startDate-endDate given by the user during 'configurator form'
 * Query: we select first all the vehicles and then we remove the vehicles that are booked in that period (take this
 * information from 'rentals' table and the JOIN)
 *
 * @param {string} startDay : beginning of the period in which the user wants the machine
 * @param {string} endDay : end of the period in which the user wants the machine
 */
exports.listFreeVehicles = function (startDay, endDay) {
	return new Promise((resolve, reject) => {
		const sql =
			'SELECT * FROM vehicles WHERE vehicles.id not in ( SELECT rentals.carid FROM rentals WHERE (rentals.enddate > ? AND rentals.startdate < ?) )';
		db.all(sql, [startDay, endDay], (err, rows) => {
			if (err) {
				reject(err);
			} else {
				const vehicles = rows.map(row => createVehicleObj(row));
				resolve(vehicles);
			}
		});
	});
};

// RENTALS

/**
 * Function that create a Rental object from a row of the 'rentals table'
 * @param {*} row : a row of the rentals table
 */
const createRentalObj = function (row) {
	const id = row.id;
	const carid = row.carid;
	const userid = row.userid;
	const startdate = row.startdate;
	const enddate = row.enddate;
	const driverage = row.driverage;
	const extradrivers = row.extradrivers;
	const km = row.km;
	const extrainsurance = row.extrainsurance;
	const price = row.price;

	return new Rental(id, carid, userid, startdate, enddate, driverage, extradrivers, km, extrainsurance, price);
};

/**
 * Insert a rental into 'rental table' and returns the id of the inserted rental.
 * To get the id, this.lastID is used. To use the "this", db.run uses "function (err)" instead of an arrow function.
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
exports.createRental = function (
	carid,
	userid,
	startdate,
	enddate,
	driverage,
	extradrivers,
	km,
	extrainsurance,
	price
) {
	//With moment I set the dates in this specific format (es. 2020-06-20)
	startdate = moment(startdate).format('YYYY-MM-DD');
	enddate = moment(enddate).format('YYYY-MM-DD');

	return new Promise((resolve, reject) => {
		const sql =
			'INSERT INTO rentals(carid, userid, startdate, enddate, driverage, extradrivers, km, extrainsurance, price) VALUES(?,?,?,?,?,?,?,?,?)';
		db.run(sql, [carid, userid, startdate, enddate, driverage, extradrivers, km, extrainsurance, price], function (
			err
		) {
			if (err) {
				console.log(err);
				reject(err);
			} else {
				console.log(this.lastID);
				resolve(this.lastID);
			}
		});
	});
};

/**
 * Get rentals associated with that userid
 * @param {int} userId : id of the user
 */
exports.getRentals = function (userId) {
	return new Promise((resolve, reject) => {
		const sql =
			'SELECT id, carid, userid, startdate, enddate, driverage, extradrivers, km, extrainsurance, price FROM rentals WHERE userid = ?';
		db.all(sql, [userId], (err, rows) => {
			if (err) {
				reject(err);
			} else {
				const rentals = rows.map(row => createRentalObj(row));
				resolve(rentals);
			}
		});
	});
};

/**
 * Delete a Rental with a given id
 * @param {int} id: id of the rental to be deleted
 */
exports.deleteReservation = function (id) {
	return new Promise((resolve, reject) => {
		const sql = 'DELETE FROM rentals WHERE id = ?';
		db.run(sql, [id], err => {
			if (err) reject(err);
			else resolve(null);
		});
	});
};
