const express = require("express");
const router = express.Router();

const playlistsController = require("../controllers/playlistsController.js");
const musicsController = require("../controllers/musicsController.js");
const profilesController = require("../controllers/profilesController.js");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const crypto = require("crypto");
const db = require("../database/config");

const { Profile } = require("../database/models.js");

passport.use(
	new LocalStrategy(function verify(email, password, cb) {
		db.get(
			"SELECT * FROM Profile WHERE email = ?",
			[email],
			function (err, user) {
				if (err) {
					return cb(err);
				}
				if (!user) {
					return cb(null, false, {
						message: "Incorrect email or password.",
					});
				}

				crypto.pbkdf2(
					password,
					row.salt,
					1000,
					64,
					"sha512",
					function (err, hashedPassword) {
						if (err) {
							return cb(err);
						}
						if (
							!crypto.timingSafeEqual(
								user.password,
								hashedPassword
							)
						) {
							return cb(null, false, {
								message: "Incorrect email or password.",
							});
						}
						return cb(null, user);
					}
				);
			}
		);
	})
);

router.get("/login/failed", (req, res) => {
	return res.json("Login falhou");
});

router.post(
	"/login",
	passport.authenticate("local", {
		successRedirect: "/playlists/public",
		failureRedirect: "/login/failed",
	})
);

module.exports = router;

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
