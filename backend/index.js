const express = require("express");

const database = require("./database/config.js");

const playlistsController = require("./controllers/playlistsController.js");
const musicsController = require("./controllers/musicsController.js");
const profilesController = require("./controllers/profilesController.js");

(async () => {
	try {
		await database.authenticate();
		console.log("Conexão estabelecida com sucesso.");
	} catch (error) {
		console.error(
			"Não foi possivel se conectar ao banco de dados: ",
			error
		);
	}
})(); // define e executa na mesma hora

(async () => {
	try {
		// await database.sync({ force: true });
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

// endpoints de Playlist

app.get("/playlists", playlistsController.getAllPlaylists);
app.get("/playlists/feed", playlistsController.getPlaylistsFeed);
app.post("/playlists", playlistsController.createPlaylist);
app.get("/playlists/:id", playlistsController.getPlaylistById);
app.get("/playlists/:id/musics", musicsController.getMusicsByPlaylist);
app.patch("/playlists/:id", playlistsController.updatePlaylist);
app.delete("/playlists/:id", playlistsController.deletePlaylist);

// endpoints de Profile

app.get("/profiles", profilesController.getAllProfiles);
app.get("/profiles/:id", profilesController.getProfileById);
app.post("/profiles", profilesController.createProfile);
app.patch("/profiles/:id", profilesController.updateProfile);
app.delete("/profiles/:id", profilesController.deleteProfile);

// endpoints de Music

app.get("/musics", musicsController.getAllMusics);
app.get("/musics/:id", musicsController.getMusicById);
app.post("/musics", musicsController.createMusic);
app.patch("/musics/:id", musicsController.updateMusic);
app.delete("/musics/:id", musicsController.deleteMusic);

app.listen(port, () => {
	console.log(`Aplicação rodando na porta ${port}`);
});

// TODO: Tentar quebrar o sistema em cada endpoint pra encontrar bugs e corrigir
// TODO: Criar Model e Endpoint de Music
// TODO: Arrumar uma maneira de calcular atributos nao armazenados
// TODO: Modularizar o projeto
