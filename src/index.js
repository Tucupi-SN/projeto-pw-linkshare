const express = require("express");

const database = require("./database/config.js");
const router = require("./routes/index.js");
const apiRouter = require("./routes/api/index.js");

const cookieParser = require("cookie-parser");
const session = require("express-session");

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
		// await database.sync({ force: true });
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
const cors = require("cors");
const port = 3000;

const nunjucks = require("nunjucks");
const path = require("path");

nunjucks.configure("frontend", {
	autoescape: true,
	express: app,
});

app.use(express.static(path.join(__dirname + "/frontend")));

app.use(cors());

app.use(express.json());
app.use(express.urlencoded());

app.use(cookieParser());

app.use(
	session({
		secret: "dale",
		name: "sessionId",
		resave: false,
		saveUninitialized: false,
		cookie: { maxAge: 30 * 60 * 1000 },
	})
);

app.use(router);
app.use("/api", apiRouter);

app.listen(port, () => {
	console.log(`Aplicação rodando na porta ${port}`);
});
