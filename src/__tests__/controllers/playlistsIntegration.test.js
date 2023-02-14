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

const Playlist = database.define(
	"Playlist",
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		image: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		createdAt: {
			type: DataTypes.DATEONLY,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
		isPrivate: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
	},
	{ updatedAt: false }
);

describe("Criar playlists", () => {
	beforeAll(async () => {
		await initDb();
	});

	test("Deve permitir criar uma playlist", async () => {
		// Arrange

		const playlistsExistentes = await Playlist.findAll({
			include: { all: true, nested: true },
		});

		const novaPlaylist = {
			id: 1,
			name: "Melhores",
			image: "image.png",
			createdAt: new Date(2023, 1, 1),
			isPrivate: true,
		};

		// Act
		await Playlist.create(novaPlaylist);

		// Assert

		const playlistsDepoisDaOperacao = await Playlist.findAll({
			include: { all: true, nested: true },
		});

		expect(playlistsDepoisDaOperacao.length).toBe(
			playlistsExistentes.length + 1
		);
	});

	afterAll(async () => {
		await initDb();
	});
});
