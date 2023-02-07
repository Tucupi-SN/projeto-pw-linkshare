const express = require("express");

const database = require("./database/config.js");
const router = require("./routes/index.js");

(async () => {
	try {
		await database.authenticate();
		console.log("Conexão estabelecida com sucesso.");
	} catch (error) {
		console.error(
			"Não foi possivel se conectar ao banco de dados: ",
			error
		);
	}
})();

(async () => {
	try {
		await database.sync();
		console.log("Models criados com sucesso.");
	} catch (error) {
		console.log(
			"Ocorreu um erro ao sincronizar os models no banco de dados: ",
			error
		);
	}
})();

const app = express();
const port = 3000;

app.use(express.json());
app.use(router);

app.listen(port, () => {
	console.log(`Aplicação rodando na porta ${port}`);
});

// TODO: Tentar quebrar o sistema em cada endpoint pra encontrar bugs e corrigir
// TODO: Criar Model e Endpoint de Music
// TODO: Arrumar uma maneira de calcular atributos nao armazenados
// TODO: Modularizar o projeto
