import { jest } from "@jest/globals";
import AuthService from "./auth.v1.service.js";
import bcrypt from "bcryptjs";

describe("AuthService class", () => {
  let authService;
  let mockUserRepository;
  let mockCreateAccessToken;
  let mockVerifyToken;

  beforeEach(() => {
    mockUserRepository = {
      getUserByEmail: jest.fn(),
      getUserByNickname: jest.fn(),
      createUserWithDetails: jest.fn(),
    };

    mockCreateAccessToken = jest.fn();
    mockVerifyToken = jest.fn();

    authService = new AuthService({
      userRepository: mockUserRepository,
      createAccessToken: mockCreateAccessToken,
      verifyToken: mockVerifyToken,
    });
  });

  describe("AuthService - register", () => {
    beforeEach(() => {
      bcrypt.hash = jest.fn(() => Promise.resolve("hashedPassword"));
    });

    const validUserData = {
      fullName: "Test User",
      nickname: "testuser",
      email: "test@test.com",
      password: "unHashedPassword",
      country: "ES",
    };

    const expectedCreatedUser = {
      id: 1,
      ...validUserData,
      registerDate: new Date(),
      profileImgPath: "../storage/usersProfilePic/default.webp",
      isActive: true,
      isAdmin: false,
    };

    delete expectedCreatedUser.password;

    it("Success: Should register a new user with token", async () => {
      // Arrange
      mockUserRepository.getUserByEmail.mockResolvedValue(null);
      mockUserRepository.getUserByNickname.mockResolvedValue(null);
      mockUserRepository.createUserWithDetails.mockResolvedValue(
        expectedCreatedUser
      );
      mockCreateAccessToken.mockReturnValue("mock-jwt-token");

      // Act
      const result = await authService.register(validUserData);

      // Assert
      expect(result).toEqual({
        newUser: expectedCreatedUser,
        token: "mock-jwt-token",
      });

      expect(mockUserRepository.getUserByEmail).toHaveBeenCalledWith(
        validUserData.email
      );
      expect(mockUserRepository.getUserByNickname).toHaveBeenCalledWith(
        validUserData.nickname
      );
      //expect(bcrypt.hash).toHaveBeenCalledWith(validUserData.password, 10);
      expect(mockUserRepository.createUserWithDetails).toHaveBeenCalledWith({
        ...validUserData,
        password: "hashedPassword",
      });
      expect(mockCreateAccessToken).toHaveBeenCalledWith(expectedCreatedUser);
    });

    it("Error: Should throw error if email already exists", async () => {
      // Arrange
      mockUserRepository.getUserByEmail.mockResolvedValue({ id: 1 });

      // Act & Assert
      await expect(authService.register(validUserData)).rejects.toThrow(
        "User already exists"
      );

      // Verify only email check was performed
      expect(mockUserRepository.getUserByEmail).toHaveBeenCalledWith(
        validUserData.email
      );
      expect(mockUserRepository.getUserByNickname).not.toHaveBeenCalled();
      expect(mockUserRepository.createUserWithDetails).not.toHaveBeenCalled();
    });

    it("Error: Should throw error if nickname already exists", async () => {
      // Arrange
      mockUserRepository.getUserByEmail.mockResolvedValue(null);
      mockUserRepository.getUserByNickname.mockResolvedValue({ id: 1 });

      // Act & Assert
      await expect(authService.register(validUserData)).rejects.toThrow(
        "User already exists"
      );

      // Verify both checks were performed but nothing else
      expect(mockUserRepository.getUserByEmail).toHaveBeenCalledWith(
        validUserData.email
      );
      expect(mockUserRepository.getUserByNickname).toHaveBeenCalledWith(
        validUserData.nickname
      );
      expect(mockUserRepository.createUserWithDetails).not.toHaveBeenCalled();
    });
  });
});
