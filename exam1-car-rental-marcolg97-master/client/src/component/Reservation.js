import React from 'react';
import { Redirect } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import moment from 'moment';
import { NoResult } from './Loading';

/**
 *  This component represents the container of a list of reservations.
 * @param {*} props
 * 					- isLoggedIn
 * 					- reservation
 * 					- cancelReservation
 */
function Reservation(props) {
	//If the user is not authenticated, he can't visualize this page
	if (!props.isLoggedIn) {
		return <Redirect to='/' />;
	} else
		return (
			<div className={'main_content'}>
				<h4 style={{ textAlign: 'left' }}>Your Reservation</h4>
				<div style={{ margin: '30px' }}>
					<p style={{ textAlign: 'left' }}>
						In this page you can see your future or past reservation and you can cancel the future reservation
					</p>
					<ListGroup as='ul' variant='flush'>
						{props.reservation.length <= 0 && <NoResult msg={'You have no reservation yet'} />}
						{props.reservation.map(elem => {
							return <ListItem key={elem.id} reservation={elem} cancelReservation={props.cancelReservation} />;
						})}
					</ListGroup>
				</div>
			</div>
		);
}

/**
 * This component represents one list item (a reservation) of the list
 * @param {*} props
 * 					- reservation: object that represents the reservation
 * 					- cancelReservation: function that cancel a reservation
 */
function ListItem(props) {
	return (
		<ListGroup.Item id={props.reservation.id}>
			<div className='d-flex w-100'>
				<div className='container'>
					<div className='row'>
						<div className='col-sm-12 col-md-12 mt-2'>
							<h5 className='mb-1'>
								Reservation id: <strong>{props.reservation.id}</strong>
							</h5>
						</div>
						<div className='col-sm-12 col-md-6 mt-2'>
							<span>
								Start date: <strong>{moment(props.reservation.startdate).format('dddd, MMMM Do YYYY')}</strong>
							</span>
						</div>
						<div className='col-sm-12  col-md-6 mt-2'>
							<span>
								End date: <strong>{moment(props.reservation.enddate).format('dddd, MMMM Do YYYY')}</strong>
							</span>
						</div>
						<div className='col-sm-4  col-md-3 mt-2'>
							<span>
								Driver age: <strong>{props.reservation.driverage}</strong>
							</span>
						</div>
						<div className='col-sm-4  col-md-2 mt-2'>
							<span>
								Extra drivers: <strong>{props.reservation.extradrivers}</strong>
							</span>
						</div>
						<div className='col-sm-4  col-md-3 mt-2'>
							<span>
								Extra insurance: <strong>{props.reservation.extrainsurance ? 'Yes' : 'No'}</strong>
							</span>
						</div>
						<div className='col-sm-6  col-md-2 mt-2'>
							<span>
								Km/day: <strong>{props.reservation.km}</strong>
							</span>
						</div>
						<div className='col-sm-6  col-md-2 mt-2'>
							<span>
								Price: <strong>€ {props.reservation.price}</strong>
							</span>
						</div>
					</div>
					<div className='row'>
						<div className='col text-center'>
							{!moment(props.reservation.startdate).isBefore(moment(), 'day') && (
								<button
									style={{ width: '300px' }}
									className='m-4 btn btn-primary'
									onClick={() => props.cancelReservation(props.reservation.id)}>
									Cancel this reservation
								</button>
							)}
						</div>
					</div>
				</div>
			</div>
		</ListGroup.Item>
	);
}

export default Reservation;
