const isAuthenticated = (req, res, next) => {
	// if (req.session.userId) {
	//   next();
	// } else {
	//   res.status(401).json({ message: "User not autheticated." });
	// }
	next();
};

module.exports = { isAuthenticated };
