const { Playlist } = require("../database/models.js");
const { playlistMapper } = require("../mappers/playlistMapper.js");

const getAllPlaylists = async (req, res) => {
	const allPlaylists = await Playlist.findAll({
		include: { all: true, nested: true },
	});

	const mappedPlaylists = allPlaylists.map((playlist) =>
		playlistMapper(playlist)
	);

	return res.json(mappedPlaylists);
};

const getPlaylistsFeed = async (req, res) => {
	const allPlaylists = await Playlist.findAll({
		include: { all: true, nested: true },
	});

	const publicPlaylists = allPlaylists.filter(
		(playlist) => !playlist.isPrivate
	);

	const mappedPlaylists = publicPlaylists.map((playlist) =>
		playlistMapper(playlist)
	);

	return res.json(mappedPlaylists);
};

const getPlaylistById = async (req, res) => {
	const { id } = req.params;

	const playlist = await Playlist.findByPk(id, {
		include: { all: true, nested: true },
	});

	if (playlist === null) {
		return res.status(404).json({ message: "No record with the given id" });
	}

	const mappedPlaylist = playlistMapper(playlist);

	return res.json(mappedPlaylist);
};

const createPlaylist = async (req, res) => {
	const { body } = req;

	if (
		body.name === undefined ||
		body.name === "" ||
		body.image === undefined ||
		body.image === "" ||
		body.profileId === undefined
	) {
		return res.status(400).json({
			message: "Mandatory fields must be informed and cannot be empty",
		});
	}

	const newPlaylist = await Playlist.create(body);

	return res.status(201).json(newPlaylist);
};

const updatePlaylist = async (req, res) => {
	const { id } = req.params;
	const { body } = req;

	if (body.name === "" || body.image === "") {
		return res
			.status(400)
			.json({ message: "Mandatory fields cannot be empty" });
	}

	const playlist = await Playlist.findByPk(id, {
		include: { all: true, nested: true },
	});

	if (playlist === null) {
		return res.status(404).json({ message: "No record with the given id" });
	}

	const updatedPlaylist = await playlist.update(body);

	const mappedPlaylist = playlistMapper(updatedPlaylist);

	return res.json(mappedPlaylist);
};

const deletePlaylist = async (req, res) => {
	const { id } = req.params;

	const playlist = await Playlist.findByPk(id, {
		include: { all: true, nested: true },
	});

	if (playlist === null) {
		return res.status(404).json({ message: "No record with the given id" });
	}

	await playlist.destroy();

	return res.json({ message: "Record successfuly deleted" });
};

module.exports = {
	getAllPlaylists,
	getPlaylistsFeed,
	getPlaylistById,
	createPlaylist,
	updatePlaylist,
	deletePlaylist,
};
