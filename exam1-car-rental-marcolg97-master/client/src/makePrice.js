import moment from 'moment';

/**
 * This function returns the price of that solution based on the parameter
 * @param {*} startDay
 * @param {*} endDay
 * @param {*} category
 * @param {*} driverAge
 * @param {*} extraDriver
 * @param {*} extraInsurance
 * @param {*} kilometer
 * @param {*} nvehicles
 * @param {*} allVehicles
 */
function makePrice(
	startDay,
	endDay,
	category,
	driverAge,
	extraDriver,
	extraInsurance,
	kilometer,
	nvehicles,
	allVehicles,
	frequentCostumer
) {
	let price = 0;

	const b = moment(endDay);
	const a = moment(startDay);
	const days = b.diff(a, 'days');
	console.log(`DEBUG: Start date ${startDay} - End date ${endDay}; number of days: ${days}`);

	switch (category) {
		case 'A':
			price = 80 * days;
			break;
		case 'B':
			price = 70 * days;
			break;
		case 'C':
			price = 60 * days;
			break;
		case 'D':
			price = 50 * days;
			break;
		case 'E':
			price = 40 * days;
			break;
		default:
			price = 0;
			console.log('ERROR: error inside the price switch; category not inside A-E');
	}

	//Apply % based on kilometer per day
	if (kilometer < 50) {
		console.log(`DEBUG: Price before -5% km: ${price}`);
		price = price * (1 - 5 / 100);
		console.log(`DEBUG: Price after -5% km: ${price}`);
	} else if (kilometer > 150) {
		console.log(`DEBUG: Price before +5% km: ${price}`);
		price = price * (1 + 5 / 100);
		console.log(`DEBUG: Price after +5% km: ${price}`);
	}

	//Apply % based on driver age
	if (driverAge < 25) {
		console.log(`DEBUG: Price before +5% drAge: ${price}`);
		price = price * (1 + 5 / 100);
		console.log(`DEBUG: Price after +5% drAge: ${price}`);
	} else if (driverAge > 65) {
		console.log(`DEBUG: Price before +10% drAge: ${price}`);
		price = price * (1 + 10 / 100);
		console.log(`DEBUG: Price after +10% drAge: ${price}`);
	}

	//Apply % based on extra driver
	if (extraDriver > 0) {
		console.log(`DEBUG: Price before +15% ExDri: ${price}`);
		price = price * (1 + 15 / 100);
		console.log(`DEBUG: Price before +15% ExDri: ${price}`);
	}

	//Apply % based on extra insurance
	if (extraInsurance) {
		console.log(`DEBUG: Price before +20% ExIns: ${price}`);
		price = price * (1 + 20 / 100);
		console.log(`DEBUG: Price after +20% ExIns: ${price}`);
	}

	//Apply % based on available vehicles. If are less than 10% available

	//Save the vehicles with that category (all vehicles)
	const totVehPerCat = allVehicles.filter(veh => veh.category === category);

	const nVehAll = totVehPerCat.length;
	const nVehGarage = nvehicles;
	console.log(`DEBUG: Vehicles of this category ${nVehAll}`);
	console.log(`DEBUG: Vehicles in garage of this category ${nVehGarage}`);

	//Because I have to do a division
	if (nVehAll > 0) {
		const percentage = (nVehGarage / nVehAll) * 100;
		console.log(`DEBUG: Percentage ${percentage}`);

		if (percentage < 10) {
			console.log(`DEBUG: Price before +10% Vehicles less thant 10%:  ${price}`);
			price = price * (1 + 10 / 100);
			console.log(`DEBUG: Price after +10% Vehicles less thant 10%:  ${price}`);
		}
	}

	//Apply % based on frequent costumer
	if (frequentCostumer) {
		console.log(`Price before -10% FreqCost ${price}`);
		price = price * (1 - 10 / 100);
		console.log(`Price before +10% FreqCost ${price}`);
	}

	//Round the result
	const priceRound = Math.round(price);
	console.log(`DEBUG: Price rounded ${priceRound}`);

	return priceRound;
}

export default makePrice;
