import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { Loading, NoResult } from './Loading';

/**
 * This component represents the container of a list of vehicles.
 * If the list is empty (this means that we don't have cars with that combination) we show a no Result image.
 * props:
 * 		 - isLoading
 *       - filterCar ad Vehicle
 *       - isLoggedIn
 */

class MainContent extends React.Component {
	render() {
		if (this.props.IsLoading) {
			return <Loading />;
		} else
			return (
				<div className={'col-md-10 main_content'}>
					<h4 style={{ textAlign: 'left' }}>Our Vehicle</h4>
					{this.props.vehicle.length == 0 && (
						<NoResult msg={'Sorry, we have no car with this specification. Try another request'} />
					)}

					{!this.props.vehicle.length == 0 && (
						<ListGroup as='ul' variant='flush'>
							<ListHeader />
							{this.props.vehicle.map(veh => (
								<ListItem key={veh.id} vehicleItem={veh} />
							))}
						</ListGroup>
					)}
				</div>
			);
	}
}

//Component that represents one list item of the list
function ListItem(props) {
	return (
		<ListGroup.Item id={props.vehicleItem.id}>
			<div className='d-flex w-100'>
				<div className='container'>
					<div className='row'>
						<div className='col-sm-4'>
							<h5 className='mb-1'> {props.vehicleItem.model} </h5>
						</div>
						<div className='col-sm-4'>
							<span>{props.vehicleItem.brand}</span>
						</div>
						<div className='col-sm-4'>
							<span>{props.vehicleItem.category}</span>
						</div>
					</div>
				</div>
			</div>
		</ListGroup.Item>
	);
}

//Component that represents the header of the list
function ListHeader(props) {
	return (
		<ListGroup.Item id={0}>
			<div className='d-flex w-100'>
				<div className='container'>
					<div className='row'>
						<div className='col-sm-4'>
							<span className='mb-1 font-weight-bold'> MODEL </span>
						</div>
						<div className='col-sm-4'>
							<span className='font-weight-bold'>BRAND</span>
						</div>
						<div className='col-sm-4'>
							<span className='font-weight-bold'>CATEGORY</span>
						</div>
					</div>
				</div>
			</div>
		</ListGroup.Item>
	);
}

export default MainContent;
