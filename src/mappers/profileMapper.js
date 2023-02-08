function profileMapper({ id, name, email, profilePicture, createdAt }) {
	return {
		id,
		name,
		email,
		profilePicture,
		createdAt,
	};
}

module.exports = { profileMapper };
