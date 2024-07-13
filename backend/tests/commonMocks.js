const mockRes = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
}
const mockNext = jest.fn()

module.exports = {
  mockRes,
  mockNext,
}
