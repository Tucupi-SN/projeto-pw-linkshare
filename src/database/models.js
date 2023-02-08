const { DataTypes } = require("sequelize");
const database = require("./config.js");
const crypto = require("crypto");

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
			unique: true,
		},
		profilePicture: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{ updatedAt: false }
);

Profile.prototype.setPassword = function (password) {
	this.salt = crypto.randomBytes(16);
	this.password = crypto
		.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
		.toString(`hex`);
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

Playlist.hasMany(Music, {
	foreignKey: { name: "playlistId", allowNull: false },
});
Music.belongsTo(Playlist, {
	foreignKey: { name: "playlistId", allowNull: false },
});
Profile.hasMany(Playlist, {
	foreignKey: { name: "profileId", allowNull: false },
});
Playlist.belongsTo(Profile, {
	foreignKey: { name: "profileId", allowNull: false },
});

module.exports = { Playlist, Profile, Music };
