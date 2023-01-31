import { profileMapper } from "../profileMapper.js";

describe("profileMapper", () => {
  test("Deve ser possível mappear um objeto de 'perfil' corretamente", () => {
    // Arrange
    const expectedProfile = {
      id: 1,
      name: "Diogo",
      email: "diogo@gmail.com",
      profilePicture: "image.png",
      createdAt: new Date(),
    };

    const givenProfile = {
      ...expectedProfile,
      password: "123456",
    };

    // Act
    const actualProfile = profileMapper(givenProfile);

    // Assert
    expect(actualProfile).toEqual(expectedProfile);
  });
});
