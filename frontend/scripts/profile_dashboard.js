const playlistsFetch = fetch("http://localhost:3000/profiles/1/playlists")
	.then((response) => response.json())
	.then((data) => {
		data.forEach((element) => {
			let playlist = document.createElement("div");
			playlist.classList = "playlist";

			let headerPlaylist = document.createElement("div");
			headerPlaylist.classList = "header-playlist";

			let headerPlaylistImageDiv = document.createElement("div");

			let headerPlaylistImage = document.createElement("img");
			headerPlaylistImage.src = element.image;
			headerPlaylistImageDiv.appendChild(headerPlaylistImage);

			headerPlaylist.appendChild(headerPlaylistImageDiv);

			let headerPlaylistParagraphsDiv = document.createElement("div");

			let headerPlaylistParagraphOne = document.createElement("p");
			headerPlaylistParagraphOne.innerHTML = element.name;

			let headerPlaylistParagraphTwo = document.createElement("p");

			headerPlaylistParagraphsDiv.appendChild(headerPlaylistParagraphOne);
			headerPlaylistParagraphsDiv.appendChild(headerPlaylistParagraphTwo);

			headerPlaylist.appendChild(headerPlaylistParagraphsDiv);

			let songsDiv = document.createElement("div");
			songsDiv.classList = "songs";
			let songsParagraph = document.createElement("p");

			fetch(`http://localhost:3000/playlists/${element.id}/musics`)
				.then((response) => response.json())
				.then((data) => {
					headerPlaylistParagraphTwo.innerHTML = data.length;

					for (let i = 0; i < data.length; i++) {
						if (i !== data.length - 1) {
							songsParagraph.innerHTML += `${i + 1} - ${
								data[i].title
							}, `;
						} else {
							songsParagraph.innerHTML += `${i + 1} - ${
								data[i].title
							}`;
						}
					}
				});

			songsDiv.appendChild(songsParagraph);

			let info = document.createElement("div");
			info.classList = "info";

			let infoParagraphOne = document.createElement("p");

			const getVisibility = (visibility) => {
				let response = {
					true: "Privado",
					false: "Público",
				};
				return response[visibility];
			};

			infoParagraphOne.innerHTML = getVisibility(element.isPrivate);

			let infoParagraphTwo = document.createElement("p");
			infoParagraphTwo.innerHTML = `Criado em ${new Date(
				element.createdAt
			).toLocaleDateString("pt-BR")}`;

			info.appendChild(infoParagraphOne);
			info.appendChild(infoParagraphTwo);

			playlist.appendChild(headerPlaylist);
			playlist.appendChild(songsDiv);
			playlist.appendChild(info);

			document.querySelector("main").appendChild(playlist);
		});
	});
