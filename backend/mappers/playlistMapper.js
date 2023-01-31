const { profileMapper } = require("./profileMapper.js");

function playlistMapper({ id, name, image, cratedAt, isPrivate, Profile }) {
  return {
    id,
    name,
    image,
    cratedAt,
    isPrivate,
    profile: profileMapper(Profile),
  };
}

module.exports = { playlistMapper };
