const express = require('express');
const morgan = require('morgan'); // logging middleware
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { check, validationResult } = require('express-validator'); // validation library

//DAO
const userDao = require('./user_dao.js');
const rentalDao = require('./rental_dao');

const jwtSecretContent = require('./secret.js');
const jwtSecret = jwtSecretContent.jwtSecret;

const PORT = 3001;
app = new express();

// Set-up logging
app.use(morgan('tiny'));

// Process body content
app.use(express.json());

// DB error
const dbErrorObj = { errors: [{ param: 'Server', msg: 'Database error' }] };
// Authorization error
const authErrorObj = { errors: [{ param: 'Server', msg: 'Authorization error' }] };

const expireTime = 300; //seconds

// Authentication endpoint
app.post('/api/login', [check('email', 'The email field is not formatted correctly').isEmail()], (req, res) => {
	const email = req.body.email;
	const password = req.body.password;

	//First I check if the email provided by the user exist
	userDao
		.getUser(email)
		.then(user => {
			//This means that we don't have a row with this specif email inside DB
			if (user === undefined) {
				res.status(404).send({
					errors: [{ param: 'Server', msg: `Invalid e-mail: this email is not registered` }],
				});
			} else {
				//Now that we are sure that the email exists, we check the validity of the password
				if (!userDao.checkPassword(user, password)) {
					//The password doesn't match with the hash password inside DB
					res.status(401).send({
						errors: [{ param: 'Server', msg: 'Wrong password' }],
					});
				} else {
					//Email and Password are correct so the user was successfully authenticated
					//We create token to put inside the cookie with id and email inside

					const token = jsonwebtoken.sign({ user: user.id, email: user.email }, jwtSecret, {
						expiresIn: expireTime,
					});

					res.cookie('token', token, { httpOnly: true, sameSite: true, maxAge: 1000 * expireTime });

					//Return the name and the password useful for the application
					res.json({ id: user.id, name: user.name });
				}
			}
		})
		.catch(
			// Delay response when wrong user/pass is sent to avoid fast guessing attempts
			err => {
				new Promise(resolve => {
					setTimeout(resolve, 1000);
				}).then(() => res.status(401).json(authErrorObj));
			}
		);
});

app.use(cookieParser());

//User wants to logout so we eliminate the token
app.post('/api/logout', (req, res) => {
	res.clearCookie('token').end();
});

// REST API endpoints

// Resources: Vehicle, Reservation

// GET /vehicles
// Request body: empty
// Response body: Array of objects, each describing a Vehicle
// Errors: 'db errors'
// This API doesn't require authentication
app.get('/api/vehicles', (req, res) => {
	rentalDao
		.listVehicles()
		.then(vehicles => res.json(vehicles))
		.catch(err => res.status(503).json(dbErrorObj));
});

// For the rest of the code, all APIs require authentication
app.use(
	jwt({
		secret: jwtSecret,
		getToken: req => req.cookies.token,
	})
);

// To return a better object in case of errors
app.use(function (err, req, res, next) {
	if (err.name === 'UnauthorizedError') {
		res.status(401).json(authErrorObj);
	}
});

// GET /freeCar
// Query param: startDay and endDay of the period in which we want extract available car
// Response body: Array of objects, each describing a Vehicle
// Errors: 'db errors'
app.get('/api/freeCar', (req, res) => {
	console.log(req.query.startDay + ' ' + req.query.endDay);
	rentalDao
		.listFreeVehicles(req.query.startDay, req.query.endDay)
		.then(vehicles => res.json(vehicles))
		.catch(err => res.status(503).json(dbErrorObj));
});

// POST /payment
// Request body: useful information to make the payment (FullName, CardNumber, CVV, Price)
// Response body: empty (we need only if the payment is successful or not)
// Errors: if FullName, CardNumber and CVV are empty, if CardNumber is not exact 16 digits, if CVV is not exact 3 digits, if Price is less than 1

app.post(
	'/api/payment',
	[
		check('FullName', `Full Name can't be empty`).not().isEmpty(),
		check('CardNumber', `Card Number can't be empty`).not().isEmpty(),
		check('CardNumber', 'CardNumber must have 16 digits').isLength({ min: 16, max: 16 }),
		check('CVV', `CVV can't be empty`).not().isEmpty(),
		check('CVV', 'CVV must have 3 digits').isLength({ min: 3, max: 3 }),
		check('Price', 'Price must be higher than 0').isNumeric({ min: 1 }),
	],
	(req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		} else {
			res.status(201).json({ msg: 'payment completed' });
		}
	}
);

// POST /rental
// Request body: information about the rentals (carid, userid, startdate, enddate, driverage, extradriver, km, extrainsurance, price)
// Errors: if all the fields are empty and if carid, userid, driverage, km, price are negative numbers
app.post(
	'/api/rentals',
	[
		check('carid', `Car id can't be empty`).not().isEmpty(),
		check('userid', `User id can't be empty`).not().isEmpty(),
		check('startdate', `You must insert a start date`).not().isEmpty(),
		check('enddate', `You must insert an end date`).not().isEmpty(),
		check('driverage', `You must insert a driver age`).not().isEmpty(),
		check('extradrivers', `Car id can't be empty`).not().isEmpty(),
		check('km', `You must insert km per day`).not().isEmpty(),
		check('extrainsurance', `Extra insurance id can't be empty`).not().isEmpty(),
		check('price', `Price can't be empty`).not().isEmpty(),

		check('carid', 'Car id must be higher than 0').isInt({ min: 0 }),
		check('userid', 'User id must be higher than 0').isInt({ min: 0 }),
		check('extradrivers', 'Extra driver must be higher than 0').isInt({ min: 0 }),
		check('extrainsurance', 'Extra insurance must be boolean').isBoolean(),
		check('driverage', 'Driver age must be higher than 18').isInt({ min: 18 }),
		check('km', 'Kilometers must be higher than 0').isInt({ min: 0 }),
		check('price', 'Price must be higher than 0').isNumeric({ min: 0 }),
	],
	(req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		const rental = req.body;

		if (!rental) {
			res.status(400).end();
		} else {
			rentalDao
				.createRental(
					rental.carid,
					rental.userid,
					rental.startdate,
					rental.enddate,
					rental.driverage,
					rental.extradrivers,
					rental.km,
					rental.extrainsurance,
					rental.price
				)
				.then(result => res.status(201).end())
				.catch(err => {
					res.status(500).json({ errors: [{ param: 'Server', msg: err }] });
				});
		}
	}
);

// GET /rentals/
// We don't need to pass the userid because it will be extracted from JWT payload
// Response body: Array of objects, each describing a Rental
app.get('/api/rentals', (req, res) => {
	// Extract userID from JWT payload
	// check if req.user is present, in case the API is used without authentication
	const userId = req.user && req.user.user;
	//console.log(userId);

	rentalDao
		.getRentals(userId)
		.then(rent => {
			if (!rent) {
				res.status(404).send();
			} else {
				res.json(rent);
			}
		})
		.catch(err => {
			res.status(500).json({
				errors: [{ param: 'Server', msg: err }],
			});
		});
});

// DELETE /rentals/:<reservationid>
// Param reservation id
app.delete('/api/rentals/:reservationid', (req, res) => {
	rentalDao
		.deleteReservation(req.params.reservationid)
		.then(result => res.status(204).end())
		.catch(err =>
			res.status(500).json({
				errors: [{ param: 'Server', msg: err }],
			})
		);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));
