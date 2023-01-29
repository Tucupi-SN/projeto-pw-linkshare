const express = require("express");
const database = require("./database/config.js");
const { Playlist, Profile, Music } = require("./database/models.js");

(async () => {
  try {
    await database.authenticate();
    console.log("Conexão estabelecida com sucesso.");
  } catch (error) {
    console.error("Não foi possivel se conectar ao banco de dados: ", error);
  }
})(); // define e executa na mesma hora

(async () => {
  try {
    await database.sync({ force: true });
    // await database.sync(); // sem {force: true} pq senao apaga as tabelas e os dados toda vez
    console.log("Models criados com sucesso.");
  } catch (error) {
    console.log(
      "Ocorreu um erro ao sincronizar os models no banco de dados: ",
      error
    );
  }
})(); // define e executa na mesma hora

const app = express();
const port = 3000;

app.use(express.json());

// endpoints de Playlist

app.get("/playlists", async (req, res) => {
  let playlists = await Playlist.findAll();
  return res.json(playlists);
});

app.get("/playlists/:id", async (req, res) => {
  let id = req.params.id;
  let playlist = await Playlist.findByPk(id);
  if (playlist === null) {
    res.status(404);
    return res.json({ message: "No record with the given id" });
  }
  return res.json(playlist);
});

app.post("/playlists", async (req, res) => {
  let body = req.body;
  let newPlaylist = await Playlist.create(body);
  // newPlaylist.setProfile(body.profileId);
  res.status(201);
  return res.json(newPlaylist);
});

app.patch("/playlists/:id", async (req, res) => {
  let id = req.params.id;
  let body = req.body;
  let playlist = await Playlist.findByPk(id);
  if (playlist === null) {
    res.status(404);
    return res.json({ message: "No record with the given id" });
  }
  await playlist.update(body);
  return res.json(playlist);
});

app.delete("/playlists/:id", async (req, res) => {
  let id = req.params.id;
  let playlist = await Playlist.findByPk(id);
  if (playlist === null) {
    res.status(404);
    return res.json({ message: "No record with the given id" });
  }
  await playlist.destroy();
  return res.json({ message: "Record successfuly deleted" });
});

// endpoints de Profile

app.get("/profiles", async (req, res) => {
  let profiles = await Profile.findAll();
  return res.json(profiles);
});

app.get("/profiles/:id", async (req, res) => {
  let id = req.params.id;
  let profile = await Profile.findByPk(id);
  if (profile === null) {
    res.status(404);
    return res.json({ message: "No record with the given id" });
  }
  return res.json(profile);
});

app.post("/profiles", async (req, res) => {
  let body = req.body;
  let newProfile = await Profile.create(body);
  res.status(201);
  return res.json(newProfile);
});

app.patch("/profiles/:id", async (req, res) => {
  let id = req.params.id;
  let body = req.body;
  let profile = await Profile.findByPk(id);
  if (profile === null) {
    res.status(404);
    return res.json({ message: "No record with the given id" });
  }
  await profile.update(body);
  return res.json(profile);
});

app.delete("/profiles/:id", async (req, res) => {
  let id = req.params.id;
  let profile = await Profile.findByPk(id);
  if (profile === null) {
    res.status(404);
    return res.json({ message: "No record with the given id" });
  }
  await profile.destroy();
  return res.json({ message: "Record successfuly deleted" });
});

app.get("/musics", async (req, res) => {
  const musics = await Music.findAll({ include: { all: true, nested: true } });

  return res.json(musics);
});

app.get("/musics/:id", async (req, res) => {
  const { id } = req.params;

  const music = await Music.findByPk(id, {
    include: { all: true, nested: true },
  });

  if (music === null) {
    return res.status(404).json({ message: "No record with the given id" });
  }

  return res.json(music);
});

app.post("/musics", async (req, res) => {
  const { body } = req;

  const newMusic = await Music.create(body);

  return res.status(201).json(newMusic);
});

app.patch("/musics/:id", async (req, res) => {
  const { id } = req.params;
  const { body } = req;

  const music = await Music.findByPk(id, {
    include: { all: true, nested: true },
  });

  if (music === null) {
    return res.status(404).json({ message: "No record with the given id" });
  }

  await music.update(body);

  return res.json(music);
});

app.delete("/musics/:id", async (req, res) => {
  const { id } = req.params;

  const music = await Music.findByPk(id, {
    include: { all: true, nested: true },
  });

  if (music === null) {
    return res.status(404).json({ message: "No record with the given id" });
  }

  await music.destroy();

  return res.json({ message: "Record successfuly deleted" });
});

app.listen(port, () => {
  console.log(`Aplicação rodando na porta ${port}`);
});

// TODO: Tentar quebrar o sistema em cada endpoint pra encontrar bugs e corrigir
// TODO: Criar Model e Endpoint de Music
// TODO: Arrumar uma maneira de calcular atributos nao armazenados
// TODO: Modularizar o projeto
