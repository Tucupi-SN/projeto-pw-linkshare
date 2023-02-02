const { profileMapper } = require("./profileMapper.js");

function playlistMapper({ id, name, image, createdAt, isPrivate, Profile }) {
  return {
    id,
    name,
    image,
    createdAt,
    isPrivate,
    profile: profileMapper(Profile),
  };
}

module.exports = { playlistMapper };
