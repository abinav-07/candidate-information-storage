const { getAllCandidates } = require("../../src/controllers/admins")
const { candidateDataMapper } = require("../../src/helpers/mappers/candidateMapper")
const { mockRes, mockNext } = require("../commonMocks")
const CandidateQueries = require("../../src/queries/candidate")
const { setCachedData } = require("../../src/services/cache")
const { mockMappedCandidates, mockCandidates } = require("./admin.mocks")

jest.mock("../../src/queries/candidate", () => ({
  getAll: jest.fn(),
}))
jest.mock("../../src/helpers/mappers/candidateMapper", () => ({
  candidateDataMapper: jest.fn(),
}))
jest.mock("../../src/services/cache", () => ({
  setCachedData: jest.fn(),
}))

beforeEach(() => {
  candidateDataMapper.mockImplementation((candidate) => ({
    candidate_id: candidate?.id,
    first_name: candidate?.first_name,
    last_name: candidate?.last_name,
    email: candidate?.email,
    free_text: candidate?.free_text,

    //   Optional Data
    phone_number: candidate?.phone_number,

    linkedin_url: candidate?.linkedin_url,

    github_url: candidate?.github_url,

    availability_start_time: candidate?.availability_start_time,

    availability_end_time: candidate?.availability_end_time,

    created_at: candidate?.created_at,
  }))
  setCachedData.mockImplementation()
})

describe("Admin", () => {
  describe("Get all candidates", () => {
    it("should fetch and return candidates", async () => {
      CandidateQueries.getAll.mockResolvedValue(mockCandidates)

      const mockReq = {
        user: { id: 1 },
        path: "/candidate",
      }

      await getAllCandidates(mockReq, mockRes, mockNext)

      expect(CandidateQueries.getAll).toHaveBeenCalledWith({
        where: {
          added_by: 1,
        },
      })
      expect(candidateDataMapper).toHaveBeenCalledTimes(mockCandidates.length)
      expect(setCachedData).toHaveBeenCalledWith(mockReq.path, mockMappedCandidates)
      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith(mockMappedCandidates)
    })
  })
})
