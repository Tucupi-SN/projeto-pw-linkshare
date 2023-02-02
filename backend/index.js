const express = require("express");
const database = require("./database/config.js");
const { Profile, Music } = require("./database/models.js");
const { musicMapper } = require("./mappers/musicMapper.js");
const { profileMapper } = require("./mappers/profileMapper.js");
const routes = require("./routes");

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
    // await database.sync({ force: true }); usar se alterar models
    await database.sync(); // sem {force: true} pq senao apaga as tabelas e os dados toda vez
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

app.use(routes);

// endpoints de Profile

app.get("/profiles", async (req, res) => {
  let profiles = await Profile.findAll({
    include: { all: true, nested: true },
  });

  const mappedProfiles = profiles.map((profile) => profileMapper(profile));

  return res.json(mappedProfiles);
});

app.get("/profiles/:id", async (req, res) => {
  let id = req.params.id;
  let profile = await Profile.findByPk(id, {
    include: { all: true, nested: true },
  });
  if (profile === null) {
    res.status(404);
    return res.json({ message: "No record with the given id" });
  }

  const mappedProfile = profileMapper(profile);

  return res.json(mappedProfile);
});

app.post("/profiles", async (req, res) => {
  let body = req.body;
  let newProfile = await Profile.create(body);

  const mappedProfile = profileMapper(newProfile);

  res.status(201);
  return res.json(mappedProfile);
});

app.patch("/profiles/:id", async (req, res) => {
  let id = req.params.id;
  let body = req.body;
  let profile = await Profile.findByPk(id, {
    include: { all: true, nested: true },
  });
  if (profile === null) {
    res.status(404);
    return res.json({ message: "No record with the given id" });
  }
  await profile.update(body);

  const mappedProfile = profileMapper(profile);

  return res.json(mappedProfile);
});

app.delete("/profiles/:id", async (req, res) => {
  let id = req.params.id;
  let profile = await Profile.findByPk(id, {
    include: { all: true, nested: true },
  });
  if (profile === null) {
    res.status(404);
    return res.json({ message: "No record with the given id" });
  }
  await profile.destroy();
  return res.json({ message: "Record successfuly deleted" });
});

app.use((req, res, next) => {
  res.status(404).send("Content not found");
});

app.use((err, req, res, next) => {
  res.status(500).send("Internal server error");
});

app.listen(port, () => {
  console.log(`Aplicação rodando na porta ${port}`);
});

// TODO: Tentar quebrar o sistema em cada endpoint pra encontrar bugs e corrigir
// TODO: Criar Model e Endpoint de Music
// TODO: Arrumar uma maneira de calcular atributos nao armazenados
// TODO: Modularizar o projeto
