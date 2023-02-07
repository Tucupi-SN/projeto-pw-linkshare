const express = require("express");
const router = express.Router();

const playlistsController = require("../controllers/playlistsController.js");
const musicsController = require("../controllers/musicsController.js");
const profilesController = require("../controllers/profilesController.js");

// endpoints de Playlist

router.get("/playlists/public", playlistsController.getPlaylistsFeed);
router.post("/playlists", playlistsController.createPlaylist);
router.get("/playlists/:id", playlistsController.getPlaylistById);
router.get("/playlists/:id/musics", musicsController.getMusicsByPlaylist);
router.patch("/playlists/:id", playlistsController.updatePlaylist);
router.delete("/playlists/:id", playlistsController.deletePlaylist);

// endpoints de Profile

router.get("/profiles/:id", profilesController.getProfileById);
router.post("/profiles", profilesController.createProfile);
router.patch("/profiles/:id", profilesController.updateProfile);
router.delete("/profiles/:id", profilesController.deleteProfile);

// endpoints de Music

router.get("/musics/:id", musicsController.getMusicById);
router.post("/musics", musicsController.createMusic);
router.patch("/musics/:id", musicsController.updateMusic);
router.delete("/musics/:id", musicsController.deleteMusic);

module.exports = router;
