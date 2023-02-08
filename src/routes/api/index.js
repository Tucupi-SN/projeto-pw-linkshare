const express = require("express");
const router = express.Router();

const playlistsController = require("../../controllers/playlistsController.js");
const musicsController = require("../../controllers/musicsController.js");
const profilesController = require("../../controllers/profilesController.js");
const { isAuthenticated } = require("../../middlewares");

router.post("/login", profilesController.login);
router.get("/logout", isAuthenticated, profilesController.logout);

// endpoints de Playlist

router.get(
	"/playlists/public",
	isAuthenticated,
	playlistsController.getPlaylistsFeed
);
router.post("/playlists", isAuthenticated, playlistsController.createPlaylist);
router.get(
	"/playlists/:id",
	isAuthenticated,
	playlistsController.getPlaylistById
);
router.get(
	"/playlists/:id/musics",
	isAuthenticated,
	musicsController.getMusicsByPlaylist
);
router.patch(
	"/playlists/:id",
	isAuthenticated,
	playlistsController.updatePlaylist
);
router.delete(
	"/playlists/:id",
	isAuthenticated,
	playlistsController.deletePlaylist
);

// endpoints de Profile

// router.get("/profiles", isAuthenticated, profilesController.getAllProfiles);
router.get("/profiles/:id", isAuthenticated, profilesController.getProfileById);
router.get(
	"/profiles/:id/playlists",
	profilesController.getPlaylistsByProfileId
);
router.post("/profiles", profilesController.createProfile);
router.patch(
	"/profiles/:id",
	isAuthenticated,
	profilesController.updateProfile
);
router.delete(
	"/profiles/:id",
	isAuthenticated,
	profilesController.deleteProfile
);

// endpoints de Music

router.get("/musics/:id", isAuthenticated, musicsController.getMusicById);
router.post("/musics", isAuthenticated, musicsController.createMusic);
router.patch("/musics/:id", isAuthenticated, musicsController.updateMusic);
router.delete("/musics/:id", isAuthenticated, musicsController.deleteMusic);

module.exports = router;
