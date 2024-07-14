const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { loginUser, logout } = require("../../src/controllers/auth/basicAuth")
const { ValidationException } = require("../../src/exceptions/httpsExceptions")
const { mockRes, mockNext } = require("../commonMocks")
const { mockMappedAdmin, mockMappedJWTAdmin } = require("./auth.mocks")

const UsersQueries = require("../../src/queries/users")
const { userDataMapper, userJWTDataMapper } = require("../../src/helpers/mappers/userMapper")
const { sequelize } = require("../../src/models")

jest.mock("bcrypt", () => ({
  compareSync: jest.fn(),
}))
jest.mock("jsonwebtoken")

jest.mock("../../src/queries/users", () => ({
  getUser: jest.fn(),
  updateUser: jest.fn(),
}))
jest.mock("../../src/helpers/mappers/userMapper", () => ({
  userDataMapper: jest.fn(),
  userJWTDataMapper: jest.fn(),
}))

beforeEach(() => {
  userDataMapper.mockImplementation((userData) => ({
    id: userData?.id,
    first_name: userData?.first_name,
    last_name: userData?.last_name,
    email: userData?.email,
    roles: userData?.roles,
    created_at: userData?.created_at,
  }))

  userJWTDataMapper.mockImplementation((userData) => ({
    id: userData?.id,
    first_name: userData?.first_name,
    last_name: userData?.last_name,
    email: userData?.email,
    roles: userData?.roles,
  }))
  // Clear all instances and calls to all mocks
  jest.clearAllMocks()
})

describe("Auth", () => {
  describe("loginUser", () => {
    it("should login admin successfully", async () => {
      const mockReq = {
        body: {
          email: mockMappedAdmin.email,
          password: "admin",
        },
      }

      let newMockRes = {
        ...mockRes,
      }

      // Create mocks for commit and rollback functions
      const commit = jest.fn()
      const rollback = jest.fn()

      // Mock sequelize.transaction to return an object with commit and rollback functions
      sequelize.transaction.mockResolvedValue({
        commit,
        rollback,
      })

      UsersQueries.getUser.mockResolvedValue(
        mockMappedAdmin.email == mockReq.body.email ? mockMappedAdmin : {}
      )
      bcrypt.compareSync.mockReturnValue(true)
      jwt.sign.mockReturnValue("mock_token")

      await loginUser(mockReq, newMockRes, mockNext)

      // Assertions
      expect(UsersQueries.getUser).toHaveBeenCalledWith({ email: mockReq?.body?.email })

      expect(bcrypt.compareSync).toHaveBeenCalledWith(
        mockReq?.body?.password,
        "$2a$12$rEp6m9wsUklwdoVhrQ7gnOW1RtfbzGj/Eme2XVrfJbiwjFk/H6oMa"
      )

      expect(userJWTDataMapper).toHaveBeenCalledTimes(1)

      expect(jwt.sign).toHaveBeenCalledWith({ ...mockMappedJWTAdmin }, expect.any(String))

      expect(UsersQueries.updateUser).toHaveBeenCalledWith(
        mockMappedJWTAdmin.id,
        { jwt_token: "mock_token" },
        expect.any(Object)
      )

      expect(userDataMapper).toHaveBeenCalledTimes(1)

      // Assert the commit and rollback calls
      expect(commit).toHaveBeenCalledTimes(1)

      expect(mockRes.status).toHaveBeenCalledWith(200)
      delete mockMappedAdmin.password
      expect(mockRes.json).toHaveBeenCalledWith({
        user: { ...mockMappedAdmin },
        token: "mock_token",
      })
    })

    it("should return 422 if data is invalid", async () => {
      const mockReq = {
        body: {
          email: "John@gmail.com",
          // Missing required fields to trigger validation error
        },
      }

      await loginUser(mockReq, mockRes, mockNext)

      // Check that validation error was passed to next()
      expect(mockNext).toHaveBeenCalledWith(expect.any(ValidationException))
    })

    it("should return 422 if user not found", async () => {
      const mockReq = {
        body: {
          email: "admin1@gmail.com",
          password: "admin",
        },
      }

      UsersQueries.getUser.mockResolvedValue(
        mockMappedAdmin.email == mockReq.body.email ? mockMappedAdmin : {}
      )

      await loginUser(mockReq, mockRes, mockNext)

      expect(UsersQueries.getUser).toHaveBeenCalledTimes(1)
      expect(UsersQueries.getUser).toHaveBeenCalledWith({ email: mockReq.body.email })

      // Check that validation error was passed to next()
      expect(mockNext).toHaveBeenCalledWith(new ValidationException(null, "User Not Registered"))
    })
  })

  describe("logout", () => {
    it("should log out the user successfully", async () => {
      const mockReq = {
        user: {
          id: 1,
        },
      }
      UsersQueries.updateUser.mockResolvedValue([1]) // Simulate successful update
      await logout(mockReq, mockRes, mockNext)

      expect(UsersQueries.updateUser).toHaveBeenCalledWith(mockMappedJWTAdmin.id, {
        jwt_token: null,
      })

      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Logged out successfully",
      })
    })
  })
})
