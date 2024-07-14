const { checkCache } = require("../../src/middlewares/checkCache")
const { getCachedData } = require("../../src/services/cache")
const { mockRes, mockNext } = require("../commonMocks")

jest.mock("../../src/services/cache") // Mock the cache service

describe("checkCache Middleware", () => {
  it("should return cached data if it exists", () => {
    const mockReq = {
      path: "/test-path",
    }

    const mockData = { message: "This is cached data" }
    getCachedData.mockReturnValue(mockData)

    checkCache(mockReq, mockRes, mockNext)

    expect(getCachedData).toHaveBeenCalledWith(mockReq.path)
    expect(mockRes.status).toHaveBeenCalledWith(200)
    expect(mockRes.json).toHaveBeenCalledWith(mockData)
    expect(mockNext).not.toHaveBeenCalled()
  })

  it("should call next if there is no cached data", () => {
    const mockReq = {
      path: "/test-path",
    }
    getCachedData.mockReturnValue(null)

    checkCache(mockReq, mockRes, mockNext)

    expect(getCachedData).toHaveBeenCalledWith(mockReq.path)
    expect(mockNext).toHaveBeenCalled()
    expect(mockRes.status).not.toHaveBeenCalled()
    expect(mockRes.json).not.toHaveBeenCalled()
  })

  it("should call next with an error if there is an exception", () => {
    const mockReq = {
      path: "/test-path",
    }
    const mockError = new Error("Something went wrong")
    getCachedData.mockImplementation(() => {
      throw mockError
    })

    checkCache(mockReq, mockRes, mockNext)

    expect(getCachedData).toHaveBeenCalledWith(mockReq.path)
    expect(mockNext).toHaveBeenCalledWith(mockError)
    expect(mockRes.status).not.toHaveBeenCalled()
    expect(mockRes.json).not.toHaveBeenCalled()
  })
})
