const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    res.locals.userId = req.session.userId;
    res.locals.method = req.method;
    next();
  } else {
    res.status(401).json({ message: "User not autheticated." });
  }
};

module.exports = { isAuthenticated };
