const path = require("path");

const { Sequelize, DataTypes } = require("sequelize");

let sqliteDabatasePath = path.join(__dirname, "test_database.sqlite3");

const database = new Sequelize({
	dialect: "sqlite",
	storage: sqliteDabatasePath,
});

const initDb = async () => {
	// authenticating
	try {
		await database.authenticate();
		console.log("Conexão estabelecida com sucesso.");
	} catch (error) {
		console.error(
			"Não foi possivel se conectar ao banco de dados: ",
			error
		);
	}

	// instantiating (by reseting always)
	try {
		await database.sync({ force: true });
		console.log("Models criados com sucesso.");
	} catch (error) {
		console.log(
			"Ocorreu um erro ao sincronizar os models no banco de dados: ",
			error
		);
	}
};

const Music = database.define(
	"Music",
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		artist: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		duration: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		musicStyle: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		url: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{ updatedAt: false }
);

describe("Criar musicas", () => {
	beforeAll(async () => {
		await initDb();
	});

	test("Deve permitir criar uma musica", async () => {
		// Arrange

		const musicasExistentes = await Music.findAll({
			include: { all: true, nested: true },
		});

		const novaMusica = {
			id: 1,
			title: "Hey Jude",
			artist: "The Beatles",
			duration: 10,
			musicStyle: "Rock",
			url: "musicurl.com",
			createdAt: new Date(2023, 1, 1),
		};

		// Act
		await Music.create(novaMusica);

		// Assert

		const musicasDepoisDaOperacao = await Music.findAll({
			include: { all: true, nested: true },
		});

		expect(musicasDepoisDaOperacao.length).toBe(
			musicasExistentes.length + 1
		);
	});

	test("Não deve permitir criar uma musica com informações faltando", async () => {
		// Arrange

		const musicasExistentes = await Music.findAll({
			include: { all: true, nested: true },
		});

		const novaMusica = {
			title: "Hey Jude",
			artist: "The Beatles",
		};

		// Act

		try {
			await Music.create(novaMusica);
		} catch (err) {} // so pra nao levantar exceção, ja sabemos que vai falhar
		// Assert

		const musicasDepoisDaOperacao = await Music.findAll({
			include: { all: true, nested: true },
		});

		expect(musicasDepoisDaOperacao.length).toBe(musicasExistentes.length);
	});

	test("Deve permitir buscar uma musica com id informado", async () => {
		// Arrange

		const musicaEsperada = {
			id: 1,
			title: "Hey Jude",
			artist: "The Beatles",
			duration: 10,
			musicStyle: "Rock",
			url: "musicurl.com",
			createdAt: new Date(2023, 1, 1),
		};

		// Act

		const musicaEncontrada = await Music.findByPk(1);
		const resultadoObtido = {
			id: musicaEncontrada.id,
			title: musicaEncontrada.title,
			artist: musicaEncontrada.artist,
			duration: musicaEncontrada.duration,
			musicStyle: musicaEncontrada.musicStyle,
			url: musicaEncontrada.url,
			createdAt: musicaEncontrada.createdAt,
		};

		// Assert

		expect(musicaEsperada).toStrictEqual(resultadoObtido);
	});

	test("Deve retornar null ao buscar uma musica com id que nao existe", async () => {
		// Arrange

		const musicaEsperada = null;

		// Act

		const musicaEncontrada = await Music.findByPk(100);

		// Assert

		expect(musicaEsperada).toStrictEqual(musicaEncontrada);
	});

	afterAll(async () => {
		await initDb();
	});
});
