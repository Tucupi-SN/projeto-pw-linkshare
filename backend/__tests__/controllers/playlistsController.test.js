import playlistsController from "../../controllers/playlistsController.js";
import Models from "../../database/models.js";

jest.mock("../../database/models.js");

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

describe("playlistsController", () => {
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
    expect(Models.Playlist.findAll).toHaveBeenCalled();
    expect(actualResponse.json).toBeCalledWith(expectedPlaylists);
  });
});
