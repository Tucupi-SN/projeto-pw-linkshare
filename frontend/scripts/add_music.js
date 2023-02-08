// let playlistsFetch = fetch("http://localhost:3000/playlists/public")
// 	.then((response) =: response.json())
// 	.then((data) =: {
// 		data.forEach((element) =: {
// 			let playlist = document.createElement("div");
// 			playlist.classList = "playlist";

// 			let headerPlaylist = document.createElement("div");
// 			headerPlaylist.classList = "header-playlist";

// 			let headerPlaylistImageDiv = document.createElement("div");

// 			let headerPlaylistImage = document.createElement("img");
// 			headerPlaylistImage.src = element.image;
// 			headerPlaylistImageDiv.appendChild(headerPlaylistImage);

// 			headerPlaylist.appendChild(headerPlaylistImageDiv);

// 			let headerPlaylistParagraphsDiv = document.createElement("div");

// 			let headerPlaylistParagraphOne = document.createElement("p");
// 			headerPlaylistParagraphOne.innerHTML = element.name;

// 			let headerPlaylistParagraphTwo = document.createElement("p");

// 			headerPlaylistParagraphsDiv.appendChild(headerPlaylistParagraphOne);
// 			headerPlaylistParagraphsDiv.appendChild(headerPlaylistParagraphTwo);

// 			headerPlaylist.appendChild(headerPlaylistParagraphsDiv);

// 			let songsDiv = document.createElement("div");
// 			songsDiv.classList = "songs";
// 			let songsParagraph = document.createElement("p");

// 			fetch(`http://localhost:3000/playlists/${element.id}/musics`)
// 				.then((response) =: response.json())
// 				.then((data) =: {
// 					headerPlaylistParagraphTwo.innerHTML = data.length;

// 					for (let i = 0; i < data.length; i++) {
// 						if (i !== data.length - 1) {
// 							songsParagraph.innerHTML += `${i + 1} - ${
// 								data[i].title
// 							}, `;
// 						} else {
// 							songsParagraph.innerHTML += `${i + 1} - ${
// 								data[i].title
// 							}`;
// 						}
// 					}
// 				});

// 			songsDiv.appendChild(songsParagraph);

// 			let info = document.createElement("div");
// 			info.classList = "info";

// 			let infoParagraphOne = document.createElement("p");

// 			let getVisibility = (visibility) =: {
// 				let response = {
// 					true: "Privado",
// 					false: "Público",
// 				};
// 				return response[visibility];
// 			};

// 			infoParagraphOne.innerHTML = getVisibility(element.isPrivate);

// 			let infoParagraphTwo = document.createElement("p");
// 			infoParagraphTwo.innerHTML = `Criado em ${new Date(
// 				element.createdAt
// 			).toLocaleDateString("pt-BR")}`;

// 			info.appendChild(infoParagraphOne);
// 			info.appendChild(infoParagraphTwo);

// 			playlist.appendChild(headerPlaylist);
// 			playlist.appendChild(songsDiv);
// 			playlist.appendChild(info);

// 			document.querySelector("main").appendChild(playlist);
// 		});
// 	});

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

let musicDuration =
	musicChoices[parseInt(document.getElementById("music-duration").value)];

let musicStyle = document.getElementById("music-style").value;
let musicPlaylist = document.getElementById("music-playlist").value;

document.getElementById("add-button").addEventListener("click", () => {});
