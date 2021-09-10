import React, { useState, useEffect } from 'react';
import MainContent from './MainContent';
import LeftSidebar from './LeftSidebar';
import API from '../api/API';
import { Redirect } from 'react-router-dom';

/**
 * Represent the browsing component that contains LefSidebar and MainContent components
 * User can see the list of cars and filter them by categories and brand
 * @param {*} props: OpenMobileMenu , isLoggedIn and setErrorMsg
 */

function BrowsingComponent(props) {
	//State that represents the vehicles that must displayed inside the list (only a subset of all vehicles)
	const [filterCar, setfilterCar] = useState([]);

	//State that contains all vehicles
	const [AllCar, setAllCar] = useState([]);

	const [IsLoading, setIsLoading] = useState(true);

	//I use useEffect like componentDidMount. I retrieve all vehicles
	useEffect(() => {
		API.getAllVehicles()
			.then(veh => {
				console.log('DEBUG: All vehicles inside DB', veh);

				setfilterCar(veh);
				setAllCar(veh);

				setIsLoading(false);
			})
			.catch(errorObj => {
				if (errorObj) {
					const err0 = errorObj.errors[0];
					props.setErrorMsg(err0.msg);
				}
			});
		// The next comment disables a warning: in this specific case no needed dependencies
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	//This function will select the vehicles to be displayed
	const updateListVehicles = (CategoriesSel, BrandSel) => {
		console.log('DEBUG: Categories and Brands chosen', CategoriesSel, BrandSel);

		if (CategoriesSel || BrandSel) {
			//If no one checkbox is clicked, we show all the vehicles
			if (CategoriesSel.length == 0 && BrandSel.length == 0) {
				//The user deletes all checkbox so the list must contains all vehicles
				setfilterCar(AllCar);
			} else {
				//If the user selects only Brands to filter and no Categories
				if (BrandSel.length > 0 && CategoriesSel.length == 0) {
					//All vehicles that match the selected brands
					let vehicles = [];

					//For each brand selected we extract the vehicles of that brand.
					//Then we push this group inside 'vehicles'
					BrandSel.forEach(brand => {
						const Vehicles_with_brand = AllCar.filter(veh => veh.brand === brand);
						vehicles.push(...Vehicles_with_brand);
					});

					setfilterCar(vehicles);
				}

				//If the user selects only Categories to filter and no Brands
				if (CategoriesSel.length > 0 && BrandSel.length == 0) {
					let vehicles = [];
					CategoriesSel.forEach(category => {
						const Vehicles_with_cat = AllCar.filter(veh => veh.category === category);
						vehicles.push(...Vehicles_with_cat);
					});
					setfilterCar(vehicles);
				}

				//If the user selects both
				if (CategoriesSel.length > 0 && BrandSel.length > 0) {
					let first_filter_vehicles = []; //First array used to store all the vehicles with specific brands
					let second_filter_vehicles = []; //Second array used to store all the vehicles with specific brands AND specific category

					BrandSel.forEach(brand => {
						const with_brand = AllCar.filter(veh => veh.brand === brand);
						first_filter_vehicles.push(...with_brand);
					});

					CategoriesSel.forEach(category => {
						const with_cat = first_filter_vehicles.filter(veh => veh.category === category);
						second_filter_vehicles.push(...with_cat);
					});

					setfilterCar(second_filter_vehicles);
				}
			}
		}
	};

	//If the user is authenticated we don't want to show this page. He will be redirect to '/book'
	if (props.isLoggedIn) {
		return <Redirect to='/book' />;
	} else
		return (
			<div className={'container-fluid'} style={{ marginTop: '10px' }}>
				<div className={'row'}>
					<LeftSidebar
						openMobileMenu={props.openMobileMenu}
						updateListVehicles={updateListVehicles}
						IsLoading={IsLoading}
						setErrorMsg={props.setErrorMsg}
					/>
					<MainContent vehicle={filterCar} IsLoading={IsLoading} />
				</div>
			</div>
		);
}

export default BrowsingComponent;
