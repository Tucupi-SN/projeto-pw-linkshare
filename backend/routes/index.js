const express = require("express");
const router = express.Router();
const playlistsController = require("../controllers/playlistsController.js");

//TODO adicionar endpoint para pegar TODAS playlists do usuario, o filtro será realizado no front
router.get("/playlists/public", playlistsController.getPlaylistsFeed);
router.get("/playlists/:id", playlistsController.getPlaylistById);
router.post("/playlists", playlistsController.createPlaylist);
router.patch("/playlists/:id", playlistsController.updatePlaylist);
router.delete("/playlists/:id", playlistsController.deletePlaylist);

module.exports = router;
