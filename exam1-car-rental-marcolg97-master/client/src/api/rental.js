/**
 * Information about a rental
 */
class Rental {
	/**
	 *
	 * @param {*} id
	 * @param {*} carid
	 * @param {*} userid
	 * @param {*} startdate
	 * @param {*} enddate
	 * @param {*} driverage
	 * @param {*} extradriver
	 * @param {*} km
	 * @param {*} extrainsurance
	 * @param {*} price
	 */
	constructor(
		id,
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
		this.id = id;
		this.carid = carid;
		this.userid = userid;
		this.startdate = startdate;
		this.enddate = enddate;
		this.enddate = enddate;
		this.driverage = driverage;
		this.extradrivers = extradrivers;
		this.km = km;
		this.extrainsurance = extrainsurance;
		this.price = price;
	}

	/**
	 * Construct an Rental from a plain object
	 * @param {{}} json
	 * @return {Rental} the newly created Rental object
	 */
	static from(json) {
		return Object.assign(new Rental(), json);
	}
}

export default Rental;
