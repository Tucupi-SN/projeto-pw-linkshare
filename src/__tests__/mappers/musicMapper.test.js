import { musicMapper } from "../../mappers/musicMapper.js";
import PlaylistMapper from "../../mappers/playlistMapper.js";

jest.mock("../../mappers/playlistMapper.js");

const playlistMock = {
  id: 1,
  name: "Melhores",
  image: "image.png",
  createdAt: new Date(),
  isPrivate: true,
  profile: {
    id: 1,
    name: "Diogo",
    email: "diogo@gmail.com",
    profilePicture: "image.png",
    createdAt: new Date(),
  },
};

describe("musicMapper", () => {
  beforeAll(() => {
    PlaylistMapper.playlistMapper.mockReturnValue(playlistMock);
  });

  test("Deve ser possível mappear um objeto de 'musica' corretamente", () => {
    // Arrange
    const expectedMusic = {
      id: 1,
      title: "R U Mine?",
      artist: "Arctic Monkeys",
      duration: 223,
      musicStyle: "Rock",
      url: "https://www.youtube.com/watch?v=VQH8ZTgna3Q",
      createdAt: new Date(),
      playlist: playlistMock,
    };

    const givenMusic = {
      id: 1,
      title: "R U Mine?",
      artist: "Arctic Monkeys",
      duration: 223,
      musicStyle: "Rock",
      url: "https://www.youtube.com/watch?v=VQH8ZTgna3Q",
      createdAt: new Date(),
      Playlist: {
        ...playlistMock,
        profile: {
          ...playlistMock.profile,
          password: "123456",
        },
      },
    };

    // Act
    const actualMusic = musicMapper(givenMusic);

    // Assert
    expect(actualMusic).toEqual(expectedMusic);
  });
});
