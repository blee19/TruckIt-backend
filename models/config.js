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
	superAdminFirstName: 'Brandon',
	
	// for sending emails
	// TODO change this email
	emailFromName: 'HSA Coupons',
	emailFromAddress: 'hsacoupons@gmail.com',
	emailPassword: 'couponswoo',
	venmoAccount: '@venmoAccountGoesHere'
};
