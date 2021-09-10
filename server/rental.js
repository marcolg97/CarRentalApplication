class Rental {
	constructor(id, carid, userid, startdate, enddate, driverage, extradrivers, km, extrainsurance, price) {
		if (id) this.id = id;

		this.carid = carid;
		this.userid = userid;
		this.startdate = startdate;
		this.enddate = enddate;
		this.driverage = driverage;
		this.extradrivers = extradrivers;
		this.km = km;
		this.extrainsurance = extrainsurance;
		this.price = price;
	}
}

module.exports = Rental;
