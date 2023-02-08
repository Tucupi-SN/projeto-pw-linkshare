const { playlistMapper } = require("./playlistMapper.js");

function musicMapper({
	id,
	title,
	artist,
	duration,
	musicStyle,
	url,
	createdAt,
	Playlist,
}) {
	return {
		id,
		title,
		artist,
		duration,
		musicStyle,
		url,
		createdAt,
		playlist: playlistMapper(Playlist),
	};
}

module.exports = { musicMapper };
