'use strict';

const bcrypt = require('bcrypt');

// DAO module for accessing 'Users' table
// Data Access Object

const User = require('./user');
const db = require('./db');

/**
 * Function that create a User object from a row of the users table
 * @param {*} row : a row of the users table
 */
const createUser = function (row) {
	const id = row.id;
	const name = row.name;
	const email = row.email;
	const hash = row.password;

	return new User(id, name, email, hash);
};

/**
 * Get user information with a specific email
 * return all the fields inside 'users table' (id, name, email, hash password)
 *
 * @param {string} email : unique field inside 'users' table (we are not using 'username' but 'email' to identify users during the login)
 */
exports.getUser = function (email) {
	return new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM users WHERE email = ?';
		db.all(sql, [email], (err, rows) => {
			if (err) reject(err);

			//If we don't find any user with that email
			if (rows.length === 0) resolve(undefined);
			else {
				const user = createUser(rows[0]);
				console.log(`DEBUG: user_dao.js getUser function ${user}`);
				resolve(user);
			}
		});
	});
};

/**
 * Get user information giving his id
 * return all the fields inside 'users table' (id, name, email, hash password)
 *
 * @param {int} id : id of the user
 */
exports.getUserById = function (id) {
	return new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM users WHERE id = ?';
		db.all(sql, [id], (err, rows) => {
			if (err) reject(err);
			//If we don't find any user with that email
			else if (rows.length === 0) resolve(undefined);
			else {
				const user = createUser(rows[0]);
				console.log(`DEBUG: user_dao.js getUserById function ${user}`);
				resolve(user);
			}
		});
	});
};

/**
 * Check if a 'password' provided by a given 'user' is correct using 'bcrypt library'
 * return true if the password provided by the user is the same as the hash password inside DB
 *
 * @param {string} user object with his information (we need the hash password inside the DB)
 * @param {string} password provided by the user during the login
 *
 * This is used by POST /api/login/ inside server.js
 */
exports.checkPassword = function (user, password) {
	console.log(`DEBUG: user_dao.js checkPassword Password: ${password}`);
	let hash = bcrypt.hashSync(password, 10);
	console.log(`DEBUG: user_dao.js checkPassword hash of the password: ${hash}`);

	return bcrypt.compareSync(password, user.hash);
};
