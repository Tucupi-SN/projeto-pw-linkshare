const express = require("express");
const router = express.Router();

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

				element.musicNames = "";

				for (let i = 0; i < data.length; i++) {
					if (i !== data.length - 1) {
						element.musicNames += `${i + 1} - ${data[i].title}, `;
					} else {
						element.musicNames += `${i + 1} - ${data[i].title}`;
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

				element.musicNames = "";

				for (let i = 0; i < data.length; i++) {
					if (i !== data.length - 1) {
						element.musicNames += `${i + 1} - ${data[i].title}, `;
					} else {
						element.musicNames += `${i + 1} - ${data[i].title}`;
					}
				}
			});
	}
	res.render("profile_dashboard.html", context);
});

// router.get();

module.exports = router;
