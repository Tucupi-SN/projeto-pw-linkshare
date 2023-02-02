import { playlistMapper } from "../../mappers/playlistMapper.js";
import ProfileMapper from "../../mappers/profileMapper.js";

jest.mock("../../mappers/profileMapper.js");

const profileMock = {
  id: 1,
  name: "Diogo",
  email: "diogo@gmail.com",
  profilePicture: "image.png",
  createdAt: new Date(),
};

describe("playlistMapper", () => {
  beforeAll(() => {
    ProfileMapper.profileMapper.mockReturnValue(profileMock);
  });

  test("Deve ser possível mappear um objeto de 'playlist' corretamente", () => {
    // Arrange
    const expectedPlaylist = {
      id: 1,
      name: "Melhores",
      image: "image.png",
      createdAt: new Date(),
      isPrivate: true,
      profile: profileMock,
    };

    const givenPlaylist = {
      id: 1,
      name: "Melhores",
      image: "image.png",
      createdAt: new Date(),
      isPrivate: true,
      Profile: {
        ...profileMock,
        password: "123456",
      },
    };

    // Act
    const actualPlaylist = playlistMapper(givenPlaylist);

    // Assert
    expect(actualPlaylist).toEqual(expectedPlaylist);
  });
});
