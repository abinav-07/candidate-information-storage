const jwt = require("jsonwebtoken")
const UserQueries = require("../../src/queries/users")
const { USER_ROLES } = require("../../src/enums")
const { userDataMapper } = require("../../src/helpers/mappers/userMapper")

const { mockRes, mockNext } = require("../commonMocks")
const { UnauthorizedException } = require("../../src/exceptions/httpsExceptions")
const { checkVerifiedJWTToken, checkAdmin } = require("../../src/middlewares/checkJWT")
const { mockMappedUser, mockMappedVerifiedUser } = require("./checkJWT.mocks")

jest.mock("jsonwebtoken")
jest.mock("../../src/queries/users", () => ({
  getUser: jest.fn(),
}))
jest.mock("../../src/helpers/mappers/userMapper", () => ({
  userDataMapper: jest.fn(),
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

  // Clear all instances and calls to all mocks
  jest.clearAllMocks()
})

describe("checkJWT Middleware", () => {
  const jwtSecretKey = `${process.env.JWT_SECRET_KEY}`

  describe("checkVerifiedJWTToken", () => {
    const mockReq = {
      cookies: {},
      headers: {},
    }
    it("should call next with UnauthorizedException if no token is provided", async () => {
      await checkVerifiedJWTToken(mockReq, mockRes, mockNext)
      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedException))
    })

    it("should call next with UnauthorizedException if token is invalid", async () => {
      mockReq.cookies["candidate-portal-token"] = "invalidToken"
      jwt.verify.mockImplementation(() => {
        throw new Error("Invalid Token")
      })

      await checkVerifiedJWTToken(mockReq, mockRes, mockNext)

      expect(jwt.verify).toHaveBeenCalledWith("invalidToken", jwtSecretKey)
      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedException))
    })

    it("should call next with UnauthorizedException if user is not found", async () => {
      const mockDecodedToken = mockMappedUser
      mockReq.cookies["candidate-portal-token"] = "validToken"
      jwt.verify.mockReturnValue(mockDecodedToken)
      UserQueries.getUser.mockResolvedValue(null)

      await checkVerifiedJWTToken(mockReq, mockRes, mockNext)

      expect(jwt.verify).toHaveBeenCalledWith("validToken", jwtSecretKey)
      expect(UserQueries.getUser).toHaveBeenCalledWith({ id: 1, jwt_token: "validToken" })
      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedException))
    })

    it("should set user for valid jwt", async () => {
      const mockDecodedToken = { id: 1, jwt_token: "validToken" }
      const mockUser = mockMappedUser
      const mockVerifiedPayloads = mockMappedVerifiedUser

      mockReq.cookies["candidate-portal-token"] = "validToken"
      jwt.verify.mockReturnValue(mockDecodedToken)
      UserQueries.getUser.mockResolvedValue(mockUser)

      await checkVerifiedJWTToken(mockReq, mockRes, mockNext)

      expect(jwt.verify).toHaveBeenCalledWith("validToken", jwtSecretKey)
      expect(UserQueries.getUser).toHaveBeenCalledWith({
        id: mockDecodedToken.id,
        jwt_token: "validToken",
      })
      expect(userDataMapper).toHaveBeenCalledTimes(1)
      expect(userDataMapper).toHaveBeenCalledWith(mockUser)
      expect(mockReq.user).toStrictEqual(mockVerifiedPayloads)
      expect(mockNext).toHaveBeenCalled()
    })
  })

  describe("checkAdmin", () => {
    const mockReq = {
      user: {},
    }

    it("should throw error if user is not found", () => {
      checkAdmin(mockReq, mockRes, mockNext)

      expect(mockNext).toHaveBeenCalledWith(new UnauthorizedException(null, "Unauthorized Admin"))
    })

    it("should throw error if user is not admin", () => {
      mockReq.user.roles = [{ id: 1, name: USER_ROLES.USER }]

      checkAdmin(mockReq, mockRes, mockNext)

      expect(mockNext).toHaveBeenCalledWith(new UnauthorizedException(null, "Unauthorized Admin"))
    })

    it("should call next if user is admin", () => {
      mockReq.user.roles = [{ id: 1, name: USER_ROLES.ADMIN }]

      checkAdmin(mockReq, mockRes, mockNext)

      expect(mockNext).toHaveBeenCalled()

      expect(mockNext).not.toHaveBeenCalledWith(expect.any(UnauthorizedException))
    })
  })
})
