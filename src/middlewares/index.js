const isAuthenticated = (req, res, next) => {
	// if (req.session.userId) {
	// 	next();
	// } else {
	// 	res.status(401).json({ message: "User not autheticated." });
	// }
	next();
};

const isAuthenticatedWeb = (req, res, next) => {
	if (req.session.userId) {
		next();
	} else {
		res.redirect("/login");
	}
};

module.exports = { isAuthenticated, isAuthenticatedWeb };
