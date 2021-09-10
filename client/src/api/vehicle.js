/**
 * Information about an vehicle being passed
 */
class Vehicle {
	/**
	 * Constructs a new Vehicle object
	 * @param {Integer} id unique code for the vehicle
	 * @param {String} category of the vehicle (A,B,C,D,E)
	 * @param {String} brand of the vehicle
	 * @param {String} model of the vehicle
	 */
	constructor(id, category, brand, model) {
		this.id = id;
		this.category = category;
		this.brand = brand;
		this.model = model;
	}

	/**
	 * Construct an Vehicle from a plain object
	 * @param {{}} json
	 * @return {Vehicle} the newly created Vehicle object
	 */
	static from(json) {
		return Object.assign(new Vehicle(), json);
	}
}

export default Vehicle;
