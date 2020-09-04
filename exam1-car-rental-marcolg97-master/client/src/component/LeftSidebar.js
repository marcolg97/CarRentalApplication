import React, { useRef, useState, useEffect } from 'react';
import Collapse from 'react-bootstrap/Collapse';
import Col from 'react-bootstrap/Col';

import { Loading } from './Loading';
import API from '../api/API';

/**
 * This is the left sidebar component. Contains checkboxes for categories and brands
 * @param {*} props:
 * 						- updateListVehicles : function inside Browsing Component that update the list of vehicles based on filters selected
 *  					- OpenMobileMenu : Left sidebar disappear under a button on small devices
 * 						- isLoading : if is Loading we show a spinner
 * 						- setErrorMsg : function that set an error msg if during API some error occurred
 */

function LeftSidebar(props) {
	const formRef = useRef();

	//Represents the state of the category and brand checkboxes
	const [BrandChecked, setBrandChecked] = useState([]);
	const [CategoryCheck, setCategoryCheck] = useState([]);

	useEffect(() => {
		API.getAllVehicles()
			.then(veh => {
				setBrandChecked(getBrandCheckBox(veh));
			})
			.catch(errorObj => {
				const err0 = errorObj.errors[0];
				props.setErrorMsg(err0.msg);
			});

		API.getCategory()
			.then(cat => {
				setCategoryCheck(getCategoryCheckBox(cat));
			})
			.catch(errorObj => {
				const err0 = errorObj.errors[0];
				props.setErrorMsg(err0.msg);
			});
		// The next comment disables a warning: in this specific case no needed dependencies
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getBrandCheckBox = vehicles => {
		const brands = [...new Set(vehicles.map(vehicle => vehicle.brand))];
		return [
			...brands.map(br => {
				return { name: br, check: false };
			}),
		];
	};

	const getCategoryCheckBox = categories => {
		return [
			...categories.map(cat => {
				return { name: cat.id, check: false };
			}),
		];
	};

	const updateField = (name, checked) => {
		//I update the state by putting true on the clicked checkbox
		const newData = [...BrandChecked];
		const newArray = newData.map(elem => {
			if (elem.name === name) elem.check = checked;
			return elem;
		});

		setBrandChecked(newArray);

		//Call this function that retrieve the selected filter and update the list of vehicles
		selectfilter();
	};

	const updateFieldCat = (name, checked) => {
		//I update the state by putting true on the clicked checkbox
		const newData = [...CategoryCheck];
		const newArray = newData.map(elem => {
			if (elem.name === name) elem.check = checked;
			return elem;
		});

		setCategoryCheck(newArray);

		//Call this function that retrieve the selected filter and update the list of vehicles
		selectfilter();
	};

	//This function retrieve the selected checkbox and it passes them to 'updateListVehicles' function
	const selectfilter = () => {
		const brandfil = [];
		BrandChecked.forEach(elem => {
			if (elem.check) {
				return brandfil.push(elem.name);
			}
		});

		const catfil = [];
		CategoryCheck.forEach(elem => {
			if (elem.check) {
				return catfil.push(elem.name);
			}
		});

		props.updateListVehicles(catfil, brandfil);
	};

	const validateForm = event => {
		event.preventDefault();
	};

	if (props.IsLoading) {
		return <Loading />;
	} else
		return (
			<div className='col-md-2'>
				<Collapse in={props.openMobileMenu}>
					<Col bg='white' id='left-sidebar' className='collapse navbar-expand-md navbar-light d-md-block'>
						<div style={{ textAlign: 'center', marginLeft: '50px', marginTop: '50px' }}>
							<aside>
								<form className='' onSubmit={validateForm} ref={formRef}>
									<h5 className='title_left_sidebar'>Brand</h5>
									{BrandChecked.map(brand => {
										return (
											<CheckBoxItem
												key={brand.name}
												id={brand.name}
												text={brand.name}
												value={brand.check}
												updateField={updateField}
											/>
										);
									})}
									<h5 className='title_left_sidebar'>Category</h5>
									{CategoryCheck.map(category => {
										return (
											<CheckBoxItem
												key={category.name}
												id={category.name}
												text={`Category ${category.name}`}
												value={category.check}
												updateField={updateFieldCat}
											/>
										);
									})}
								</form>
							</aside>
						</div>
					</Col>
				</Collapse>
			</div>
		);
}

//This component represents the single checkbox
function CheckBoxItem(props) {
	return (
		<div className='custom-control custom-checkbox text-left'>
			<input
				className='custom-control-input normal'
				type='checkbox'
				id={props.id}
				name={props.id}
				value={props.value}
				checked={props.value}
				onChange={ev => props.updateField(ev.target.name, ev.target.checked)}
			/>
			<label className='custom-control-label' htmlFor={props.id}>
				{props.text}
			</label>
		</div>
	);
}

export default LeftSidebar;
