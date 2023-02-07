function registerProfile() {
	const name = document.getElementById("nome").value;
	const email = document.getElementById("email").value;
	const profilePicture = document.getElementById("fotoPerfil").value;
	const password = document.getElementById("senha").value;

	if (!name || !email || !profilePicture || !password) {
		alert("Todos os campos são obrigatórios e não podem estar vazios.");
		return;
	}

	const requestOptions = {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ name, email, profilePicture, password }),
	};

	fetch("/profiles", requestOptions)
		.then((response) => {
			if (response.status === 201) {
				return response.json();
			} else {
				throw new Error("Falha ao criar perfil");
			}
		})
		.then((data) => console.log(data))
		.catch((error) => alert(error.message));
}
