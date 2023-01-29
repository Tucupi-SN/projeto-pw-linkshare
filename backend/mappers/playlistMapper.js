const { profileMapper } = require("./profileMapper.js");

function playlistMapper({ id, name, image, cratedAt, private, Profile }) {
  return {
    id,
    name,
    image,
    cratedAt,
    private,
    profile: profileMapper(Profile),
  };
}

module.exports = { playlistMapper };
