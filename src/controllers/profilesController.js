const { Profile, Playlist } = require("../database/models.js");
const { profileMapper } = require("../mappers/profileMapper.js");
const { playlistMapper } = require("../mappers/playlistMapper.js");
const bcrypt = require("bcrypt");

const login = async (req, res) => {
	const { email, password } = req.body;

	const user = await Profile.findOne(
		{ where: { email: email } },
		{
			include: { all: true, nested: true },
		}
	);

	const match = user
		? await bcrypt.compare(password, user.password)
		: undefined;

	if (user && match) {
		req.session.userId = user.id;
		req.session.flash = {};
		res.json({ message: "User authenticated with success." });
	} else {
		req.session.flash = { error: "Email or password not valid." };
		res.status(400).json({ message: "Email or password not valid." });
	}
};

const logout = (req, res) => {
	req.session.destroy();
	res.json({ message: "Logged out with success." });
};

// const getAllProfiles = async (req, res) => {
// 	return res.json(await Profile.findAll());
// };

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

	let allPlaylists = await Playlist.findAll({
		include: { all: true, nested: true },
	});

	const private = req.query.private;

	const privateChoices = {
		true: true,
		false: false,
	};

	if (private) {
		allPlaylists = allPlaylists.filter(
			(playlist) => playlist.isPrivate === privateChoices[private]
		);
	}

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

	const hasUserWithThisEmail = await Profile.findOne({
		where: { email: body.email },
	});

	if (hasUserWithThisEmail) {
		return res.status(400).json({
			message: "Email already registered",
		});
	}

	const hash = await bcrypt.hash(body.password, 10);
	body.password = hash;

	const newProfile = await Profile.create(body);

	await newProfile.save();

	const mappedProfile = profileMapper(newProfile);

	return res.status(201).json(mappedProfile);
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
	login,
	logout,
	// getAllProfiles,
	getPlaylistsByProfileId,
	getProfileById,
	createProfile,
	updateProfile,
	deleteProfile,
};
