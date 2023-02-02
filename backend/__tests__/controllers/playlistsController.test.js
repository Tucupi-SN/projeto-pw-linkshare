import playlistsController from "../../controllers/playlistsController.js";
import Models, { Playlist } from "../../database/models.js";

jest.mock("../../database/models.js");

afterEach(() => {
  jest.resetAllMocks();
});

const playlistsMock = [
  {
    id: 1,
    name: "Melhores",
    image: "image.png",
    cratedAt: new Date(2023, 1, 1),
    isPrivate: true,
    Profile: {
      id: 1,
      name: "Diogo",
      email: "diogo@gmail.com",
      profilePicture: "image.png",
      createdAt: new Date(2023, 1, 1),
      password: "123456",
    },
  },
  {
    id: 2,
    name: "Melhores2",
    image: "image2.png",
    cratedAt: new Date(2023, 1, 1),
    isPrivate: false,
    Profile: {
      id: 1,
      name: "Diogo",
      email: "diogo@gmail.com",
      profilePicture: "image.png",
      createdAt: new Date(2023, 1, 1),
      password: "123456",
    },
  },
];

describe("getPlaylistsFeed", () => {
  test("Deve retornar o feed com todas as playlists públicas", async () => {
    // Arrange
    const expectedPlaylists = [
      {
        id: 2,
        name: "Melhores2",
        image: "image2.png",
        cratedAt: new Date(2023, 1, 1),
        isPrivate: false,
        profile: {
          id: 1,
          name: "Diogo",
          email: "diogo@gmail.com",
          profilePicture: "image.png",
          createdAt: new Date(2023, 1, 1),
        },
      },
    ];

    const mockRequest = {};
    const mockResponse = {
      json: jest.fn().mockReturnThis(),
    };

    jest.spyOn(Models.Playlist, "findAll").mockResolvedValue(playlistsMock);

    // Act
    const actualResponse = await playlistsController.getPlaylistsFeed(
      mockRequest,
      mockResponse
    );

    // Assert
    expect(Models.Playlist.findAll).toHaveBeenCalledTimes(1);
    expect(actualResponse.json).toBeCalledWith(expectedPlaylists);
  });

  test("Deve retornar vazio quando não houver playlists públicas", async () => {
    // Arrange
    const playlistsOnlyPrivateMock = [
      { ...playlistsMock[0] },
      { ...playlistsMock[1], isPrivate: true },
    ];

    const expectedPlaylists = [];

    const mockRequest = {};
    const mockResponse = {
      json: jest.fn().mockReturnThis(),
    };

    jest
      .spyOn(Models.Playlist, "findAll")
      .mockResolvedValue(playlistsOnlyPrivateMock);

    // Act
    const actualResponse = await playlistsController.getPlaylistsFeed(
      mockRequest,
      mockResponse
    );

    // Assert
    expect(Models.Playlist.findAll).toHaveBeenCalledTimes(1);
    expect(actualResponse.json).toBeCalledWith(expectedPlaylists);
  });
});

describe("getPlaylistsById", () => {
  test("Deve retornar a playlist quando id informado existir no banco", async () => {
    // Arrange
    const playlistFoundMock = { ...playlistsMock[1] };

    const expectedPlaylist = {
      id: 2,
      name: "Melhores2",
      image: "image2.png",
      cratedAt: new Date(2023, 1, 1),
      isPrivate: false,
      profile: {
        id: 1,
        name: "Diogo",
        email: "diogo@gmail.com",
        profilePicture: "image.png",
        createdAt: new Date(2023, 1, 1),
      },
    };

    const mockRequest = { params: { id: 2 } };
    const mockResponse = {
      json: jest.fn().mockReturnThis(),
    };

    jest
      .spyOn(Models.Playlist, "findByPk")
      .mockResolvedValue(playlistFoundMock);

    // Act
    const actualResponse = await playlistsController.getPlaylistById(
      mockRequest,
      mockResponse
    );

    // Assert
    expect(Models.Playlist.findByPk).toHaveBeenCalledTimes(1);
    expect(actualResponse.json).toBeCalledWith(expectedPlaylist);
  });

  test("Deve retornar status 404 e mensagem de error quando não existir id no banco", async () => {
    // Arrange
    const mockRequest = { params: { id: 3 } };
    const mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };

    jest.spyOn(Models.Playlist, "findByPk").mockResolvedValue(null);

    // Act
    const actualResponse = await playlistsController.getPlaylistById(
      mockRequest,
      mockResponse
    );

    // Assert
    expect(Models.Playlist.findByPk).toHaveBeenCalledTimes(1);
    expect(actualResponse.status).toBeCalledWith(404);
    expect(actualResponse.json).toBeCalledWith({
      message: "No record with the given id",
    });
  });
});

describe("createPlaylist", () => {
  test("Deve cadastrar nova playlist pública com sucesso", async () => {
    // Arrange
    const playlistCreatedMock = { ...playlistsMock[1] };

    const expectedPlaylist = {
      id: 2,
      name: "Melhores2",
      image: "image2.png",
      cratedAt: new Date(2023, 1, 1),
      isPrivate: false,
      profile: {
        id: 1,
        name: "Diogo",
        email: "diogo@gmail.com",
        profilePicture: "image.png",
        createdAt: new Date(2023, 1, 1),
      },
    };

    const mockBody = { ...playlistsMock[1] };
    const mockRequest = {
      body: {
        name: mockBody.name,
        image: mockBody.image,
        profileId: mockBody.Profile.id,
        isPrivate: mockBody.isPrivate,
      },
    };
    const mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };

    jest
      .spyOn(Models.Playlist, "create")
      .mockResolvedValue(playlistCreatedMock);

    // Act
    const actualResponse = await playlistsController.createPlaylist(
      mockRequest,
      mockResponse
    );

    // Assert
    expect(Models.Playlist.create).toHaveBeenCalledTimes(1);
    expect(actualResponse.status).toBeCalledWith(201);
    expect(actualResponse.json).toBeCalledWith(expectedPlaylist);
  });

  test("Deve cadastrar nova playlist privada com sucesso", async () => {
    // Arrange
    const playlistCreatedMock = { ...playlistsMock[0] };

    const expectedPlaylist = {
      id: 1,
      name: "Melhores",
      image: "image.png",
      cratedAt: new Date(2023, 1, 1),
      isPrivate: true,
      profile: {
        id: 1,
        name: "Diogo",
        email: "diogo@gmail.com",
        profilePicture: "image.png",
        createdAt: new Date(2023, 1, 1),
      },
    };

    const mockBody = { ...playlistsMock[0] };
    const mockRequest = {
      body: {
        name: mockBody.name,
        image: mockBody.image,
        profileId: mockBody.Profile.id,
      },
    };
    const mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };

    jest
      .spyOn(Models.Playlist, "create")
      .mockResolvedValue(playlistCreatedMock);

    // Act
    const actualResponse = await playlistsController.createPlaylist(
      mockRequest,
      mockResponse
    );

    // Assert
    expect(Models.Playlist.create).toHaveBeenCalledTimes(1);
    expect(actualResponse.status).toBeCalledWith(201);
    expect(actualResponse.json).toBeCalledWith(expectedPlaylist);
  });

  test("Não deve cadastrar nova playlist com informações obrigatórias faltando", async () => {
    // Arrange
    const mockBody = { ...playlistsMock[0] };
    const mockRequest = {
      body: {
        image: mockBody.image,
        profileId: mockBody.Profile.id,
      },
    };
    const mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };

    // Act
    const actualResponse = await playlistsController.createPlaylist(
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

describe("updatePlaylist", () => {
  test("Deve alterar dados de uma playlist com sucesso", async () => {
    // Arrange
    const playlistUpdatedMock = {
      ...playlistsMock[1],
      name: "Melhores2 Mudada",
    };
    const playlistFoundMock = {
      ...playlistsMock[1],
      update: jest.fn().mockResolvedValue(playlistUpdatedMock),
    };

    const expectedPlaylist = {
      id: 2,
      name: "Melhores2 Mudada",
      image: "image2.png",
      cratedAt: new Date(2023, 1, 1),
      isPrivate: false,
      profile: {
        id: 1,
        name: "Diogo",
        email: "diogo@gmail.com",
        profilePicture: "image.png",
        createdAt: new Date(2023, 1, 1),
      },
    };

    const mockRequest = {
      params: { id: 2 },
      body: {
        name: "Melhores2 Mudada",
      },
    };
    const mockResponse = {
      json: jest.fn().mockReturnThis(),
    };

    jest
      .spyOn(Models.Playlist, "findByPk")
      .mockResolvedValue(playlistFoundMock);

    // Act
    const actualResponse = await playlistsController.updatePlaylist(
      mockRequest,
      mockResponse
    );

    // Assert
    expect(Models.Playlist.findByPk).toHaveBeenCalledTimes(1);
    expect(actualResponse.json).toBeCalledWith(expectedPlaylist);
  });

  test("Não deve alterar dados de uma playlist com informações obrigatórias vazias", async () => {
    // Arrange
    const mockRequest = {
      params: { id: 2 },
      body: {
        name: "",
      },
    };
    const mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };

    // Act
    const actualResponse = await playlistsController.updatePlaylist(
      mockRequest,
      mockResponse
    );

    // Assert
    expect(actualResponse.status).toBeCalledWith(400);
    expect(actualResponse.json).toBeCalledWith({
      message: "Mandatory fields cannot be empty",
    });
  });

  test("Não deve alterar dados de uma playlist quando id informado não existir no banco", async () => {
    // Arrange
    const mockRequest = {
      params: { id: 3 },
      body: {
        name: "Melhores2 Mudada",
      },
    };
    const mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };

    jest.spyOn(Models.Playlist, "findByPk").mockResolvedValue(null);

    // Act
    const actualResponse = await playlistsController.updatePlaylist(
      mockRequest,
      mockResponse
    );

    // Assert
    expect(Models.Playlist.findByPk).toHaveBeenCalledTimes(1);
    expect(actualResponse.status).toBeCalledWith(404);
    expect(actualResponse.json).toBeCalledWith({
      message: "No record with the given id",
    });
  });
});

describe("deletePlaylist", () => {
  test("Deve deletar a playlist quando id existir no banco", async () => {
    // Arrange
    const playlistFoundMock = {
      ...playlistsMock[1],
      destroy: jest.fn(),
    };

    const mockRequest = {
      params: { id: 2 },
    };
    const mockResponse = {
      json: jest.fn().mockReturnThis(),
    };

    jest
      .spyOn(Models.Playlist, "findByPk")
      .mockResolvedValue(playlistFoundMock);

    // Act
    const actualResponse = await playlistsController.deletePlaylist(
      mockRequest,
      mockResponse
    );

    // Assert
    expect(Models.Playlist.findByPk).toHaveBeenCalledTimes(1);
    expect(actualResponse.json).toBeCalledWith({
      message: "Record successfuly deleted",
    });
  });

  test("Não deve deletar uma playlist quando id não existir no banco", async () => {
    // Arrange
    const mockRequest = {
      params: { id: 3 },
    };
    const mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };

    jest.spyOn(Models.Playlist, "findByPk").mockResolvedValue(null);

    // Act
    const actualResponse = await playlistsController.deletePlaylist(
      mockRequest,
      mockResponse
    );

    // Assert
    expect(Models.Playlist.findByPk).toHaveBeenCalledTimes(1);
    expect(actualResponse.status).toBeCalledWith(404);
    expect(actualResponse.json).toBeCalledWith({
      message: "No record with the given id",
    });
  });
});
