const express = require("express");
const router = express.Router();

const { Music, Playlist, Profile } = require("../database/models");

const { isAuthenticatedWeb } = require("../middlewares");

const bcrypt = require("bcrypt");

router.get("/", async (req, res) => {
	const userId = req.session.userId;

	if (!userId) {
		return res.render("home.html");
	}

	const currentUser = await Profile.findByPk(userId);

	currentUser.firstName = currentUser.name.split(" ")[0];

	context = {
		playlists: await fetch(
			"http://localhost:3000/api/playlists/public"
		).then((response) => response.json()),
		currentUser: currentUser,
	};

	context.playlists = context.playlists.filter(
		(playlist) => playlist.profile.id !== parseInt(userId)
	);

	for (let index = 0; index < context.playlists.length; index++) {
		const element = context.playlists[index];
		await fetch(`http://localhost:3000/api/playlists/${element.id}/musics`)
			.then((response) => response.json())
			.then((data) => {
				element.numberOfMusics = data.length;

				element.musicNames = [];

				for (let i = 0; i < data.length; i++) {
					if (i !== data.length - 1) {
						element.musicNames.push({
							id: data[i].id,
							name: `${i + 1} - ${data[i].title}, `,
						});
					} else {
						element.musicNames.push({
							id: data[i].id,
							name: `${i + 1} - ${data[i].title}`,
						});
					}
				}
			});
	}
	res.render("dashboard.html", context);
});

// endpoints de login e cadastro

router.get("/cadastro", (req, res) => {
	res.render("cadastro.html");
});

router.post("/cadastro", async (req, res) => {
	let newProfile = {
		name: req.body.name,
		email: req.body.email,
		profilePicture: req.body.photo,
		password: req.body.password,
	};

	const hash = await bcrypt.hash(newProfile.password, 10);
	newProfile.password = hash;

	try {
		let userCreated = await Profile.create(newProfile);
		await userCreated.save();
	} catch (err) {
		req.session.flash = { error: "User with given email already exists" };
		context = {
			flash: req.session.flash,
		};
		return res.render("cadastro.html", context);
	}
	res.redirect("/login");
});

router.get("/login", (req, res) => {
	res.render("login.html");
});

router.post("/login", async (req, res) => {
	let loginPayload = {
		email: req.body.email,
		password: req.body.password,
	};

	let user = await Profile.findOne(
		{ where: { email: loginPayload.email } },
		{
			include: { all: true, nested: true },
		}
	);

	const match = user
		? await bcrypt.compare(loginPayload.password, user.password)
		: undefined;

	if (user && match) {
		req.session.userId = user.id;
		req.session.flash = {};
		res.redirect("/profile-dashboard");
	} else {
		req.session.flash = { error: "Email or password not valid." };
		context = {
			flash: req.session.flash,
		};
		res.render("login.html", context);
	}
});

router.post("/logout", (req, res) => {
	req.session.destroy();
	res.redirect("/login");
});

router.get("/profile-dashboard", isAuthenticatedWeb, async (req, res) => {
	const userId = req.session.userId;
	const currentUser = await Profile.findByPk(userId);

	currentUser.firstName = currentUser.name.split(" ")[0];

	context = {
		playlists: await fetch(
			`http://localhost:3000/api/profiles/${userId}/playlists`
		).then((response) => response.json()),
		currentUser: currentUser,
	};

	for (let index = 0; index < context.playlists.length; index++) {
		const element = context.playlists[index];
		await fetch(`http://localhost:3000/api/playlists/${element.id}/musics`)
			.then((response) => response.json())
			.then((data) => {
				element.numberOfMusics = data.length;

				element.musicNames = [];

				for (let i = 0; i < data.length; i++) {
					if (i !== data.length - 1) {
						element.musicNames.push({
							id: data[i].id,
							name: `${i + 1} - ${data[i].title}, `,
						});
					} else {
						element.musicNames.push({
							id: data[i].id,
							name: `${i + 1} - ${data[i].title}`,
						});
					}
				}
			});
	}
	res.render("profile_dashboard.html", context);
});

router.post("/profile-dashboard", isAuthenticatedWeb, async (req, res) => {
	const userId = req.session.userId;
	const currentUser = await Profile.findByPk(userId);

	currentUser.firstName = currentUser.name.split(" ")[0];

	let queryParams = "";

	let filterOptions = {
		2: "false",
		3: "true",
	};
	let filterOption = req.body["filter-option"];

	if (filterOption !== "1") {
		queryParams = `?private=${filterOptions[parseInt(filterOption)]}`;
	}

	let playlists = await fetch(
		`http://localhost:3000/api/profiles/${userId}/playlists` + queryParams
	).then((response) => response.json());

	context = {
		playlists: playlists,
		currentUser: currentUser,
	};

	for (let index = 0; index < context.playlists.length; index++) {
		const element = context.playlists[index];
		await fetch(`http://localhost:3000/api/playlists/${element.id}/musics`)
			.then((response) => response.json())
			.then((data) => {
				element.numberOfMusics = data.length;

				element.musicNames = [];

				for (let i = 0; i < data.length; i++) {
					if (i !== data.length - 1) {
						element.musicNames.push({
							id: data[i].id,
							name: `${i + 1} - ${data[i].title}, `,
						});
					} else {
						element.musicNames.push({
							id: data[i].id,
							name: `${i + 1} - ${data[i].title}`,
						});
					}
				}
			});
	}
	res.render("profile_dashboard.html", context);
});

router.get("/musics", isAuthenticatedWeb, async (req, res) => {
	const userId = req.session.userId;

	context = {
		playlistChoices: await fetch(
			`http://localhost:3000/api/profiles/${userId}/playlists`
		).then((response) => response.json()),
	};
	res.render("add_music.html", context);
});

router.post("/musics", isAuthenticatedWeb, async (req, res) => {
	const userId = req.session.userId;

	let musicStyles = {
		1: "Rock",
		2: "Blues",
		3: "Jazz",
		4: "Pop",
		5: "Country",
		6: "Reggae",
		7: "Axé",
		8: "Bossa Nova",
		9: "Clássico",
		10: "Folk",
		11: "Música Eletrônica",
		12: "Gospel/Religioso",
		13: "Forró",
		14: "Hip Hop",
		15: "Instrumental",
		16: "MPB",
		17: "Rap",
		18: "Progressivo",
		19: "R&B",
		20: "Samba",
		21: "Trap",
		22: "Soul",
		23: "Pagode",
		24: "Outro",
	};

	let newMusic = {
		title: req.body.title,
		artist: req.body.artist,
		duration: req.body.duration,
		musicStyle: musicStyles[parseInt(req.body["musics-styles"])],
		playlistId: parseInt(req.body.playlistChoice),
		url: req.body.url,
	};

	await Music.create(newMusic);

	context = {
		playlistChoices: await fetch(
			`http://localhost:3000/api/profiles/${userId}/playlists`
		).then((response) => response.json()),
	};

	res.redirect("/profile-dashboard");
});

router.get("/musics/:id/edit", isAuthenticatedWeb, async (req, res) => {
	const userId = req.session.userId;

	currentMusic = await fetch(
		`http://localhost:3000/api/musics/${req.params.id}`
	).then((response) => response.json());

	if (userId !== currentMusic.playlist.profile.id) {
		return res.redirect("/");
	}

	context = {
		playlistChoices: await fetch(
			`http://localhost:3000/api/profiles/${userId}/playlists`
		).then((response) => response.json()),
		currentMusic: currentMusic,
	};
	res.render("editar_musica.html", context);
});

router.post("/musics/:id/edit", async (req, res) => {
	let musicStyles = {
		1: "Rock",
		2: "Blues",
		3: "Jazz",
		4: "Pop",
		5: "Country",
		6: "Reggae",
		7: "Axé",
		8: "Bossa Nova",
		9: "Clássico",
		10: "Folk",
		11: "Música Eletrônica",
		12: "Gospel/Religioso",
		13: "Forró",
		14: "Hip Hop",
		15: "Instrumental",
		16: "MPB",
		17: "Rap",
		18: "Progressivo",
		19: "R&B",
		20: "Samba",
		21: "Trap",
		22: "Soul",
		23: "Pagode",
		24: "Outro",
	};

	let currentMusic = await fetch(
		`http://localhost:3000/api/musics/${req.params.id}`
	).then((response) => response.json());

	let musicPayload = {
		title: req.body.title,
		artist: req.body.artist,
		duration: req.body.duration,
		musicStyle: req.body["musics-styles"]
			? musicStyles[parseInt(req.body["musics-styles"])]
			: currentMusic.musicStyle,
		playlistId: req.body.playlistChoice
			? parseInt(req.body.playlistChoice)
			: currentMusic.playlist.id,
		url: req.body.url,
	};

	let musicToUpdate = await Music.findByPk(req.params.id);
	musicToUpdate.update(musicPayload);
	await musicToUpdate.save();

	res.redirect("/profile-dashboard");
});

router.get("/musics/:id/delete", async (req, res) => {
	const userId = req.session.userId;

	let musicToDelete = await Music.findByPk(req.params.id);

	if (userId !== musicToDelete.playlist.profile.id) {
		return res.redirect("/profile-dashboard");
	}
	await musicToDelete.destroy();
	return res.redirect("/profile-dashboard");
});

router.get("/playlists", async (req, res) => {
	res.render("create_playlist.html");
});

router.post("/playlists", isAuthenticatedWeb, async (req, res) => {
	const userId = req.session.userId;

	let newPlaylist = {
		name: req.body.title,
		image: req.body.image,
		isPrivate: req.body.public !== undefined ? true : false,
		profileId: userId,
	};

	await Playlist.create(newPlaylist);

	res.redirect("/profile-dashboard");
});

router.get("/playlists/:id/edit", isAuthenticatedWeb, async (req, res) => {
	const userId = req.session.userId;

	currentPlaylist = await fetch(
		`http://localhost:3000/api/playlists/${req.params.id}`
	).then((response) => response.json());

	if (userId !== currentPlaylist.profile.id) {
		return res.redirect("/");
	}

	context = {
		currentPlaylist: currentPlaylist,
	};
	res.render("editar_playlist.html", context);
});

router.post("/playlists/:id/edit", isAuthenticatedWeb, async (req, res) => {
	let currentPlaylist = await fetch(
		`http://localhost:3000/api/playlists/${req.params.id}`
	).then((response) => response.json());

	let playlistPayload = {
		name: req.body.title,
		image: req.body.image,
		isPrivate: req.body.public !== undefined ? true : false,
		profileId: currentPlaylist.profile.id,
	};

	let playlistToUpdate = await Playlist.findByPk(req.params.id);
	playlistToUpdate.update(playlistPayload);
	await playlistToUpdate.save();

	res.redirect("/profile-dashboard");
});

router.get("/playlists/:id/delete", isAuthenticatedWeb, async (req, res) => {
	const userId = req.session.userId;

	let playlistToDelete = await Playlist.findByPk(req.params.id);

	if (userId !== playlistToDelete.profile.id) {
		return res.redirect("/profile-dashboard");
	}

	await playlistToDelete.destroy();
	return res.redirect("/profile-dashboard");
});

router.get("/profile/edit", isAuthenticatedWeb, async (req, res) => {
	const userId = req.session.userId;

	let currentProfile = await fetch(
		`http://localhost:3000/api/profiles/${userId}`
	).then((response) => response.json());

	if (userId !== currentProfile.id) {
		return res.redirect("/");
	}

	context = {
		currentProfile: currentProfile,
	};

	res.render("editar_perfil.html", context);
});

router.post("/profile/edit", isAuthenticatedWeb, async (req, res) => {
	const userId = req.session.userId;

	let currentProfile = await fetch(
		`http://localhost:3000/api/profiles/${userId}`
	).then((response) => response.json());

	let profilePayload = {
		name: req.body.name,
		email: req.body.email,
		profilePicture: req.body.photo,
		password: currentProfile.password,
	};

	let profileToUpdate = await Profile.findByPk(userId);
	profileToUpdate.update(profilePayload);
	await profileToUpdate.save();

	res.redirect("/profile-dashboard");
});

module.exports = router;
