const { Profile, Playlist } = require("../database/models.js");
const { profileMapper } = require("../mappers/profileMapper.js");
const { playlistMapper } = require("../mappers/playlistMapper.js");

const getProfileById = async (req, res) => {
	const { id } = req.params;

	const profile = await Profile.findByPk(id, {
		include: { all: true, nested: true },
	});

	if (profile === null) {
		return res.status(404).json({ message: "No record with the given id" });
	}

	const mappedProfile = profileMapper(profile);

	return res.json(mappedProfile);
};

const getPlaylistsByProfileId = async (req, res) => {
	const { id } = req.params;

	const allPlaylists = await Playlist.findAll({
		include: { all: true, nested: true },
	});

	const userPlaylists = allPlaylists.filter(
		(playlist) => playlist.profileId === parseInt(id)
	);

	const mappedPlaylists = userPlaylists.map((playlist) =>
		playlistMapper(playlist)
	);

	return res.json(mappedPlaylists);
};

const createProfile = async (req, res) => {
	const { body } = req;

	if (
		body.name === undefined ||
		body.name === "" ||
		body.email === undefined ||
		body.email === "" ||
		body.profilePicture === undefined ||
		body.profilePicture === "" ||
		body.password === undefined ||
		body.password === ""
	) {
		return res.status(400).json({
			message: "Mandatory fields must be informed and cannot be empty",
		});
	}

	const newProfile = await Profile.create(body);
	newProfile.setPassword(body.password);
	await newProfile.save();

	return res.status(201).json(newProfile);
};

const updateProfile = async (req, res) => {
	const { id } = req.params;
	const { body } = req;

	if (body.name === "" || body.email === "" || body.profilePicture === "") {
		return res
			.status(400)
			.json({ message: "Mandatory fields cannot be empty" });
	}

	const profile = await Profile.findByPk(id, {
		include: { all: true, nested: true },
	});

	if (profile === null) {
		return res.status(404).json({ message: "No record with the given id" });
	}

	await profile.update(body);

	const mappedProfile = profileMapper(profile);

	return res.json(mappedProfile);
};

const deleteProfile = async (req, res) => {
	const { id } = req.params;

	const profile = await Profile.findByPk(id, {
		include: { all: true, nested: true },
	});

	if (profile === null) {
		return res.status(404).json({ message: "No record with the given id" });
	}

	await profile.destroy();

	return res.json({ message: "Record successfuly deleted" });
};

module.exports = {
	getProfileById,
	getPlaylistsByProfileId,
	createProfile,
	updateProfile,
	deleteProfile,
};
