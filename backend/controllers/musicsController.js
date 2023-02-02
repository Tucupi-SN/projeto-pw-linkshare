const { Music } = require("../database/models.js");
const { musicMapper } = require("../mappers/musicMapper.js");

const getMusicsByPlaylist = async (req, res) => {
  const { id } = req.params;

  const allMusics = await Music.findAll({
    include: { all: true, nested: true },
  });

  const musicsByPlaylist = allMusics.filter(
    (music) => music.playlistId === parseInt(id)
  );

  const mappedMusics = musicsByPlaylist.map((music) => musicMapper(music));

  return res.json(mappedMusics);
};

const getMusicById = async (req, res) => {
  const { id } = req.params;

  const music = await Music.findByPk(id, {
    include: { all: true, nested: true },
  });

  if (music === null) {
    return res.status(404).json({ message: "No record with the given id" });
  }

  const mappedMusic = musicMapper(music);

  return res.json(mappedMusic);
};

const createMusic = async (req, res) => {
  const { body } = req;

  if (
    body.title === undefined ||
    body.title === "" ||
    body.artist === undefined ||
    body.artist === "" ||
    body.duration === undefined ||
    body.duration === "" ||
    body.musicStyle === undefined ||
    body.musicStyle === "" ||
    body.url === undefined ||
    body.url === "" ||
    body.playlistId === undefined
  ) {
    return res.status(400).json({
      message: "Mandatory fields must be informed and cannot be empty",
    });
  }

  const newMusic = await Music.create(body);

  return res.status(201).json(newMusic);
};

const updateMusic = async (req, res) => {
  const { id } = req.params;
  const { body } = req;

  if (
    body.title === "" ||
    body.artist === "" ||
    body.duration === "" ||
    body.musicStyle === "" ||
    body.url === ""
  ) {
    return res
      .status(400)
      .json({ message: "Mandatory fields cannot be empty" });
  }

  const music = await Music.findByPk(id, {
    include: { all: true, nested: true },
  });

  if (music === null) {
    return res.status(404).json({ message: "No record with the given id" });
  }

  await music.update(body);

  const mappedMusic = musicMapper(music);

  return res.json(mappedMusic);
};

const deleteMusic = async (req, res) => {
  const { id } = req.params;

  const music = await Music.findByPk(id, {
    include: { all: true, nested: true },
  });

  if (music === null) {
    return res.status(404).json({ message: "No record with the given id" });
  }

  await music.destroy();

  return res.json({ message: "Record successfuly deleted" });
};

module.exports = {
  getMusicsByPlaylist,
  getMusicById,
  createMusic,
  updateMusic,
  deleteMusic,
};
