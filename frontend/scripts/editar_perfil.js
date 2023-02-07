function editProfile() {
	const id = router.get("/profiles/:id", profilesController.getProfileById);
	const name = document.getElementById("nome").value;
	const email = document.getElementById("email").value;
	const profilePicture = document.getElementById("fotoPerfil").value;
	const password = document.getElementById("senha").value;

	if (!name || !email || !profilePicture) {
		alert("Todos os campos são obrigatórios e não podem estar vazios.");
		return;
	}

	const requestOptions = {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ name, email, profilePicture, password }),
	};

	fetch(`/profiles/${id}`, requestOptions)
		.then((response) => {
			if (response.status === 200) {
				return response.json();
			} else if (response.status === 400) {
				throw new Error("Todos os campos são obrigatórios");
			} else if (response.status === 404) {
				throw new Error(
					"Nenhum registro encontrado com o ID fornecido"
				);
			} else {
				throw new Error("Erro ao atualizar perfil");
			}
		})
		.then((data) => console.log(data))
		.catch((error) => alert(error.message));
}
