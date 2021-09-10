import React, { useState } from 'react';
import FormComponent from './FormComponent';
import { Loading, NoResult, OptionalErrorMsg } from './Loading';
import { Redirect } from 'react-router-dom';
import API from '../api/API';

import makePrice from '../makePrice';
import PaymentComponent from './PaymentComponent';

/**
 * This component represents the 'configurator'; It has a form on the left (configurator form)
 * and on the right it has the result of the query and the payment form
 * @param {*} props
 * 					- vehicle need this because inside price logic we need the number of all vehicles of a category
					- isLoggedIn need this to limit the access only to authenticated user
					- frequentCostumer need this for the price logic
					- userId need this to call API for memorize the rental
					- setLogout need this to logout the user if it doesn't have the token
					- updateReservation when a user add a new reservation
 */
function InteractiveConfiguration(props) {
	//If the user doesn't complete the form or the form is not correct we set this to true.
	//In this way we show a placeholder image instead of the section with the result of the proposal
	const [IsLoading, setIsLoading] = useState(true);

	//This state contains all the vehicles that matches the current solution
	const [FilterCar, setFilterCar] = useState([]);

	//State that represents the intention of a user to book this solution.
	//If the user clicks on 'book' button is set to true; the 'Book' button disappear and the payment form appears
	const [WantBook, setWantBook] = useState(false);

	//Information about the booking
	const [BookInformation, setBookInformation] = useState({
		startDay: '',
		endDay: '',
		driverAge: '',
		extraDriver: false,
		extraInsurance: false,
		kilometer: '',
		category: '',
		nvehicles: 0,
	});

	//Price of the current solution
	const [PriceSolution, setPriceSolution] = useState(0);

	//State that show an error message in the page if the form is not correct
	const [ErrorMsg, setErrorMsg] = useState('');

	//State that represents if a reservation was successful or not.
	//If is true we will redirect to 'reservation' page
	const [ReservationSuccess, setReservationSuccess] = useState(false);

	const BookCar = () => {
		setWantBook(true);
	};

	const CancelErrorMsg = () => {
		setErrorMsg('');
	};

	const setLoading = () => {
		setIsLoading(true);
	};

	//This function is called by Form component.
	//This function takes care of showing the information of the proposal
	const ShowResults = (startDay, endDay, category, driverAge, extraDriver, extraInsurance, kilometer) => {
		//If we have the form open it closes it
		setWantBook(false);

		//Takes only the vehicles that are free inside the range startDay-endDay
		API.getAllFreeVehicles(startDay, endDay)
			.then(result => {
				//Filter the vehicle based on the category
				const vehicles = result.filter(veh => veh.category === category);

				//Save the filtered vehicles inside the state
				setFilterCar(vehicles);

				//Save book information
				setBookInformation({
					startDay: startDay,
					endDay: endDay,
					driverAge: driverAge,
					extraDriver: extraDriver,
					extraInsurance: extraInsurance,
					kilometer: kilometer,
					category: category,
					nvehicles: vehicles.length, //number of vehicles that match the solution proposed by the user
				});

				//This function will calculate the price
				const price = makePrice(
					startDay,
					endDay,
					category,
					driverAge,
					extraDriver,
					extraInsurance,
					kilometer,
					vehicles.length,
					props.vehicle,
					props.frequentCostumer
				);

				setPriceSolution(price);

				setIsLoading(false);
			})
			.catch(errorObj => {
				const err0 = errorObj.errors[0];
				setErrorMsg(` ${err0.msg}`);

				if (errorObj.status && errorObj.status === 401) {
					setTimeout(() => {
						props.setLogout();
						setErrorMsg('');
					}, 2000);
				}
			});
	};

	//This function is called by PaymentFormComponent when the user want to pay for the proposed solution
	const PaySolution = (Price, FullName, CardNumber, CVV) => {
		console.log(`DEBUG: Price: ${Price}, userId: ${props.userId}, vehicle id: ${FilterCar[0].id}`);

		//We select the id of the first car that matches the solution proposed by the user.
		const carid = FilterCar[0].id;
		const userid = props.userId;
		const startdate = BookInformation.startDay;
		const enddate = BookInformation.endDay;
		const driverage = BookInformation.driverAge;
		const extradrivers = BookInformation.extraDriver;
		const km = BookInformation.kilometer;
		const extrainsurance = BookInformation.extraInsurance;
		const price = Price;

		//Fake api that verify the payment. If you put a Card number that doesn't exactly have 16 digits or a CVV with 3 digits, returns an error
		API.doPayment(FullName, CardNumber, CVV, Price)
			.then(result => {
				//Now that the payment is ok we can register into the DB the rental
				API.addRental(carid, userid, startdate, enddate, driverage, extradrivers, km, extrainsurance, price)
					.then(res => {
						//Call this function in App that update the reservation state to include the new one
						props.updateReservation();

						//This will cause a re-render of the page and the user will redirect to reservation page
						setReservationSuccess(true);
					})
					.catch(errorObj => {
						const err0 = errorObj.errors[0];
						setErrorMsg(` ${err0.msg}`);

						if (errorObj.status && errorObj.status === 401) {
							setTimeout(() => {
								props.setLogout();
								setErrorMsg('');
							}, 2000);
						}
					});
			})
			.catch(errorObj => {
				//Express validator return meaningful information. It will display in the page
				const err0 = errorObj.errors[0];
				setErrorMsg(` ${err0.msg}`);

				if (errorObj.status && errorObj.status === 401) {
					setTimeout(() => {
						props.setLogout();
						setErrorMsg('');
					}, 2000);
				}
			});
	};

	const goBack = () => {
		setWantBook(false);
	};

	//If the use is NOT authenticated we redirect to '/' where can filter the list of vehicles.
	if (!props.isLoggedIn) {
		return <Redirect to='/' />;
	}
	//if the user successfully completes the booking, we send it to 'Reservation' page
	else if (ReservationSuccess) {
		return <Redirect to='/reservation' />;
	} //If the user is authenticated we show the 'configurator'
	else
		return (
			<div className={'container-fluid'}>
				<OptionalErrorMsg errorMsg={ErrorMsg} cancelErrorMsg={CancelErrorMsg} />
				<div className={'row'}>
					<div className={'col-md-6'}>
						<div className={'border border-dark rounded'} style={{ margin: '30px' }}>
							<FormComponent setLoading={setLoading} Loading={Loading} ShowResults={ShowResults} />
						</div>
					</div>
					<div className='col-md-6 main_content'>
						{IsLoading && <CarImageComponent />}
						{!IsLoading && (
							<BookVehicle
								BookCar={BookCar}
								WantBook={WantBook}
								BookInformation={BookInformation}
								goBack={goBack}
								price={PriceSolution}
								PaySolution={PaySolution}
							/>
						)}
					</div>
				</div>
			</div>
		);
}

/**
 * This component contains the information about the proposal solution and the form for the payment
 * @param {*} props
 * 					- BookInformation: object that contains all the information about the proposal
 * 					- Price: price of that proposal
 * 					- WantBook: if the user click on the button 'Book' we set true and the payment form appear
 * 					- BookCar
 * 					- PaySolution
 * 					- goBack: function that set 'WantBook' to false (i.e. the user don't want book the proposal anymore)
 */
function BookVehicle(props) {
	if (props.BookInformation.nvehicles <= 0) {
		return <NoResult msg={'Sorry, we have no car with this specification. Try another request'} />;
	} else {
		return (
			<div className={'w-50 p-3'} style={{ margin: '30px' }}>
				<h4>{`We find ${props.BookInformation.nvehicles} solutions that matches your needs`}</h4>
				<div style={{ marginTop: '50px' }}>
					<h5>{`Price of this solution is: € ${props.price}`}</h5>
					{!props.WantBook && (
						<button onClick={props.BookCar} className={'btn btn-primary'}>
							Book a car with this solution
						</button>
					)}
					{props.WantBook && (
						<PaymentComponent PaySolution={props.PaySolution} goBack={props.goBack} price={props.price} />
					)}
				</div>
			</div>
		);
	}
}

function CarImageComponent() {
	return (
		<div style={{ marginTop: '50px' }}>
			<div>
				<h5 style={{ margin: '30px', fontWeight: 'bold' }}>Fill the parameters in the form to make a reservation</h5>
				<img src={require('../cars.jpg')} width='500' height='500' alt='cam' />
			</div>
		</div>
	);
}

export default InteractiveConfiguration;
