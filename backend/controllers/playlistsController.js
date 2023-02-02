const { Playlist } = require("../database/models.js");
const { playlistMapper } = require("../mappers/playlistMapper.js");

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

module.exports = { getPlaylistsFeed };
