const { playlistMapper } = require("./playlistMapper.js");

function musicMapper({
  id,
  title,
  artist,
  duration,
  musciStyle,
  url,
  createdAt,
  Playlist,
}) {
  return {
    id,
    title,
    artist,
    duration,
    musciStyle,
    url,
    createdAt,
    playlist: playlistMapper(Playlist),
  };
}

module.exports = { musicMapper };
