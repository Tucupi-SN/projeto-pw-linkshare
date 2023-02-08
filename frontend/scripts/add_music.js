let musicPlaylistChoices = document.getElementById("music-playlist");

// fetch(`http://localhost:3000/playlists/${element.id}/musics`)
// 	.then((response) => response.json())
// 	.then((data) => {
// 		headerPlaylistParagraphTwo.innerHTML = data.length;

// 		for (let i = 0; i < data.length; i++) {
// 			if (i !== data.length - 1) {
// 				songsParagraph.innerHTML += `${i + 1} - ${data[i].title}, `;
// 			} else {
// 				songsParagraph.innerHTML += `${i + 1} - ${data[i].title}`;
// 			}
// 		}
// 	});

fetch("http://localhost:3000/profiles/1/playlists")
	.then((response) => response.json())
	.then((data) => {
		data.forEach((element) => {
			let option = document.createElement("option");
			option.value = element.id;
			option.innerHTML = element.name;
			document.getElementById("music-playlist").appendChild(option);
		});
	}); // TODO: Pegar o id do cara logado dinamicamente dps

let musicChoices = {
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

let musicTitle = document.getElementById("music-title").value;
let musicArtist = document.getElementById("music-artist").value;

let musicDuration = document.getElementById("music-duration").value;

let musicStyle =
	musicChoices[parseInt(document.getElementById("music-style").value)];

let musicPlaylist = document.getElementById("music-playlist").value;

// console.log(musicPlaylist);

document.getElementById("add-button").addEventListener("click", () => {
	let options = {
		method: "POST",
		body: JSON.stringify({
			title: musicTitle,
			artist: musicArtist,
			duration: musicDuration,
			musicStyle: musicStyle,
			url: "teste",
			playlistId: musicPlaylist,
		}),
	};

	console.log(options.body);

	fetch("http://localhost:3000/musics/", options)
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
		});
});
