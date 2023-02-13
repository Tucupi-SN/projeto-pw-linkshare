import musicsController from "../../controllers/musicsController.js";
import Models from "../../database/models.js";

jest.mock("../../database/models.js");

afterEach(() => {
	jest.resetAllMocks();
});

const musicsMock = [
	{
		id: 1,
		title: "Hey Jude",
		artist: "The Beatles",
		duration: 10,
		musicStyle: "Rock",
		url: "musicurl.com",
		createdAt: new Date(2023, 1, 1),
		Playlist: {
			id: 1,
			name: "Melhores",
			image: "image.png",
			createdAt: new Date(2023, 1, 1),
			isPrivate: true,
			Profile: {
				id: 1,
				name: "Diogo",
				email: "diogo@gmail.com",
				profilePicture: "image.png",
				createdAt: new Date(2023, 1, 1),
			},
		},
	},
];

describe("createMusic", () => {
	test("Deve cadastrar nova musica com sucesso", async () => {
		// Arrange
		const musicMock = { ...musicsMock[0] };
		const musicCreatedMock = {
			id: musicMock.id,
			title: musicMock.title,
			artist: musicMock.artist,
			duration: musicMock.duration,
			musicStyle: musicMock.musicStyle,
			url: musicMock.url,
			createdAt: musicMock.createdAt,
			playlistId: musicMock.Playlist.id,
		};

		const expectedMusic = {
			id: 1,
			title: "Hey Jude",
			artist: "The Beatles",
			duration: 10,
			musicStyle: "Rock",
			url: "musicurl.com",
			createdAt: new Date(2023, 1, 1),
			playlistId: 1,
		};

		const mockBody = { ...musicsMock[0] };
		const mockRequest = {
			body: {
				title: mockBody.title,
				artist: mockBody.artist,
				duration: mockBody.duration,
				musicStyle: mockBody.musicStyle,
				url: mockBody.url,
				createdAt: mockBody.createdAt,
				playlistId: mockBody.Playlist.id,
			},
		};
		const mockResponse = {
			json: jest.fn().mockReturnThis(),
			status: jest.fn().mockReturnThis(),
		};

		jest.spyOn(Models.Music, "create").mockResolvedValue(musicCreatedMock);

		// Act
		const actualResponse = await musicsController.createMusic(
			mockRequest,
			mockResponse
		);

		// Assert
		expect(Models.Music.create).toHaveBeenCalledTimes(1);
		expect(actualResponse.status).toBeCalledWith(201);
		expect(actualResponse.json).toBeCalledWith(expectedMusic);
	});

	test("Não deve cadastrar nova música com informações obrigatórias faltando", async () => {
		// Arrange
		const mockBody = { ...musicsMock[0] };
		const mockRequest = {
			body: {
				title: mockBody.title,
				playlistId: mockBody.Playlist.id,
			},
		};
		const mockResponse = {
			json: jest.fn().mockReturnThis(),
			status: jest.fn().mockReturnThis(),
		};

		// Act
		const actualResponse = await musicsController.createMusic(
			mockRequest,
			mockResponse
		);

		// Assert
		expect(actualResponse.status).toBeCalledWith(400);
		expect(actualResponse.json).toBeCalledWith({
			message: "Mandatory fields must be informed and cannot be empty",
		});
	});
});

describe("getMusicsById", () => {
	test("Deve retornar a musica quando id informado existir no banco", async () => {
		// Arrange
		const musicFoundMock = { ...musicsMock[0] };

		const expectedMusic = {
			id: 1,
			title: "Hey Jude",
			artist: "The Beatles",
			duration: 10,
			musicStyle: "Rock",
			url: "musicurl.com",
			createdAt: new Date(2023, 1, 1),
			playlist: {
				id: 1,
				name: "Melhores",
				image: "image.png",
				createdAt: new Date(2023, 1, 1),
				isPrivate: true,
				profile: {
					id: 1,
					name: "Diogo",
					email: "diogo@gmail.com",
					profilePicture: "image.png",
					createdAt: new Date(2023, 1, 1),
				},
			},
		};

		const mockRequest = { params: { id: 1 } };
		const mockResponse = {
			json: jest.fn().mockReturnThis(),
		};

		jest.spyOn(Models.Music, "findByPk").mockResolvedValue(musicFoundMock);

		// Act
		const actualResponse = await musicsController.getMusicById(
			mockRequest,
			mockResponse
		);

		// Assert
		expect(Models.Music.findByPk).toHaveBeenCalledTimes(1);
		expect(actualResponse.json).toBeCalledWith(expectedMusic);
	});

	test("Deve retornar status 404 e mensagem de error quando não existir id no banco", async () => {
		// Arrange
		const mockRequest = { params: { id: 3 } };
		const mockResponse = {
			json: jest.fn().mockReturnThis(),
			status: jest.fn().mockReturnThis(),
		};

		jest.spyOn(Models.Music, "findByPk").mockResolvedValue(null);

		// Act
		const actualResponse = await musicsController.getMusicById(
			mockRequest,
			mockResponse
		);

		// Assert
		expect(Models.Music.findByPk).toHaveBeenCalledTimes(1);
		expect(actualResponse.status).toBeCalledWith(404);
		expect(actualResponse.json).toBeCalledWith({
			message: "No record with the given id",
		});
	});
});

describe("updateMusic", () => {
	test("Deve alterar dados de uma musica com sucesso", async () => {
		// Arrange
		const musicUpdatedMock = {
			...musicsMock[0],
			name: "Hey Jude Editada",
		};
		const musicFoundMock = {
			...musicsMock[0],
			update: jest.fn().mockResolvedValue(musicUpdatedMock),
		};

		const expectedMusic = {
			id: 1,
			title: "Hey Jude Editada",
			artist: "The Beatles",
			duration: 10,
			musicStyle: "Rock",
			url: "musicurl.com",
			createdAt: new Date(2023, 1, 1),
			playlist: {
				id: 1,
				name: "Melhores",
				image: "image.png",
				createdAt: new Date(2023, 1, 1),
				isPrivate: true,
				profile: {
					id: 1,
					name: "Diogo",
					email: "diogo@gmail.com",
					profilePicture: "image.png",
					createdAt: new Date(2023, 1, 1),
				},
			},
		};

		const mockRequest = {
			params: { id: 1 },
			body: {
				name: "Hey Jude Editada",
			},
		};
		const mockResponse = {
			json: jest.fn().mockReturnThis(),
		};

		jest.spyOn(Models.Music, "findByPk").mockResolvedValue(musicFoundMock);

		// Act
		const actualResponse = await musicsController.updateMusic(
			mockRequest,
			mockResponse
		);

		// Assert
		expect(Models.Music.findByPk).toHaveBeenCalledTimes(1);
		expect(actualResponse.json).toBeCalledWith(expectedMusic);
	});
});
