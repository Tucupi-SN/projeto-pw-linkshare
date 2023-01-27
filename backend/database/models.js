const { DataTypes } = require("sequelize");
const database = require("./config.js");

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
		private: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
	},
	{ updatedAt: false }
);

const Profile = database.define(
	"Profile",
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
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		profilePicture: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{ updatedAt: false }
);

module.exports = { Playlist, Profile };

// Música: título, artista, duração, estilo musical;

// TODO: Pesquisar como fazer CHOICES do Django em Sequelize
// Pra poder fazer o "estilo musical" de Musica
