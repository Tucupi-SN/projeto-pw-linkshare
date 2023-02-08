const express = require("express");
const router = express.Router();

const { Music, Playlist } = require("../database/models");

// endpoints de Music

router.get("/dashboard", async (req, res) => {
	context = {
		playlists: await fetch(
			"http://localhost:3000/api/playlists/public"
		).then((response) => response.json()),
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

	res.render("dashboard.html", context);
});

router.get("/profile-dashboard", async (req, res) => {
	context = {
		playlists: await fetch(
			"http://localhost:3000/api/profiles/1/playlists"
		).then((response) => response.json()),
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

router.get("/musics", async (req, res) => {
	context = {
		playlistChoices: await fetch(
			"http://localhost:3000/api/profiles/1/playlists"
		).then((response) => response.json()),
	};
	res.render("add_music.html", context);
});

router.post("/musics", async (req, res) => {
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
			"http://localhost:3000/api/profiles/1/playlists"
		).then((response) => response.json()),
	};

	res.redirect("/profile-dashboard");
});

router.get("/musics/:id/edit", async (req, res) => {
	context = {
		playlistChoices: await fetch(
			"http://localhost:3000/api/profiles/1/playlists"
		).then((response) => response.json()),
		currentMusic: await fetch(
			`http://localhost:3000/api/musics/${req.params.id}`
		).then((response) => response.json()),
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

	console.log(musicPayload);

	let musicToUpdate = await Music.findByPk(req.params.id);
	musicToUpdate.update(musicPayload);
	await musicToUpdate.save();

	res.redirect("/profile-dashboard");
});

router.get("/playlists", async (req, res) => {
	res.render("create_playlist.html");
});

router.post("/playlists", async (req, res) => {
	let newPlaylist = {
		name: req.body.title,
		image: req.body.image,
		isPrivate: req.body.public,
		profileId: 1, // TODO: Passar dinamicamente pelo usuario logado
	};

	await Playlist.create(newPlaylist);

	res.redirect("/profile-dashboard");
});

module.exports = router;
