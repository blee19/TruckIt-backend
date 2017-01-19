module.exports = {
	port: process.env.PORT || 3000,
	dbUrl: 'localhost:5000',
	// dbUrl: "mongodb://dormsupplies:dormsupplies@ds163698.mlab.com:63698/heroku_hzrx3r0z",

	// for signing tokens
	secret: "truckit-secret",

	// for first admin
	superAdminEmail: 'brandonlee@college.harvard.edu',
	superAdminPassword: 'brandon',
	superAdminPhoneProvider: 'AT&T',
	superAdminPhone: '7203831855',
	superAdminVenmo: '@blee19',
	superAdminfirstName: 'Brandon',

	// for sending emails
	// TODO change this email
	twilio_sid: 'AC923bf1467fd06bb3e697565829b25363',
	twilio_token: 'abba490de3f1e6f77854fb2ad7c1f6d8'
};
