const {
  getAllCandidates,
  getCandidate,
  createCandidateProfile,
  updateCandidateProfile,
  deleteCandidateProfile,
} = require("../../src/controllers/admins")
const { candidateDataMapper } = require("../../src/helpers/mappers/candidateMapper")
const { mockRes, mockNext } = require("../commonMocks")
const CandidateQueries = require("../../src/queries/candidate")
const { setCachedData } = require("../../src/services/cache")
const { mockMappedCandidates, mockCandidates } = require("./admin.mocks")
const { ValidationException, NotFoundException } = require("../../src/exceptions/httpsExceptions")
const { sequelize } = require("../../src/models")

jest.mock("../../src/queries/candidate", () => ({
  getAll: jest.fn(),
  getOne: jest.fn(),
  upsertCandidate: jest.fn(),
  updateCandidate:jest.fn(),
  deleteCandidate:jest.fn()
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

  
    // Clear all instances and calls to all mocks
    jest.clearAllMocks();
  
})

describe("Admin", () => {
  describe("getAllCandidates", () => {
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

  describe("getCandidate", () => {
    it("should return 422 if id not found in params", async () => {
      const mockReq = {
        params: {},
        path: "/candidate/undefined",
      }
      await getCandidate(mockReq, mockRes, mockNext)

      expect(mockNext).toHaveBeenCalledWith(
        new ValidationException(null, "Candidate Id is required")
      )
    })

    it("should return 404 if candidate not found", async () => {
      const mockReq = {
        params: { id: 2 },
        path: "/candidate/2",
      }
      CandidateQueries.getOne.mockResolvedValue(
        mockCandidates.find((candidate) => candidate.id == mockReq.params.id)
      )

      await getCandidate(mockReq, mockRes, mockNext)

      expect(CandidateQueries.getOne).toHaveBeenCalledTimes(1)
      expect(CandidateQueries.getOne).toHaveBeenCalledWith(mockReq.params.id)

      expect(mockNext).toHaveBeenCalledWith(new NotFoundException(null, "Candidate not found."))
    })

    it("should fetch and return one candidate", async () => {
      const mockReq = {
        params: {
          id: 1,
        },
        path: "/candidate/1",
      }
      CandidateQueries.getOne.mockResolvedValue(
        mockCandidates.find((candidate) => (candidate.id = mockReq.params.id))
      )

      await getCandidate(mockReq, mockRes, mockNext)

      expect(CandidateQueries.getOne).toHaveBeenCalledWith(mockReq.params.id)
      expect(candidateDataMapper).toHaveBeenCalledTimes(1)
      expect(setCachedData).toHaveBeenCalledWith(mockReq.path, mockMappedCandidates[0])
      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith(mockMappedCandidates[0])
    })
  })

  describe("createCandidateProfile", () => {
    it("should return 422 if data is invalid", async () => {
      const mockReq = {
        body: {
          first_name: "John",
          // Missing required fields to trigger validation error
        },
        user: { id: 1 },
      }

      await createCandidateProfile(mockReq, mockRes, mockNext)

      // Check that validation error was passed to next()
      expect(mockNext).toHaveBeenCalledWith(expect.any(ValidationException))
})

    it("should create a candidate profile successfully", async () => {
      const oneCandidate = mockCandidates[0]
      delete oneCandidate.id
      delete oneCandidate.created_at
      delete oneCandidate.updated_at

      const mockReq = {
        body: {
          ...oneCandidate,
        },
        user: { id: 1 },
      }

      // Create mocks for commit and rollback functions
      const commit = jest.fn()
      const rollback = jest.fn()

      // Mock sequelize.transaction to return an object with commit and rollback functions
      sequelize.transaction.mockResolvedValue({
        commit,
        rollback,
      })

      CandidateQueries.upsertCandidate.mockResolvedValue([1])

      await createCandidateProfile(mockReq, mockRes, mockNext)

      expect(CandidateQueries.upsertCandidate).toHaveBeenCalledWith(
        {
          ...mockReq.body,
          added_by: mockReq.user.id,
          deleted_at: null,
        },
        expect.any(Object)
      )

      // Assert the commit and rollback calls
      expect(commit).toHaveBeenCalledTimes(1)
      expect(rollback).not.toHaveBeenCalled() // rollback should not be called in a success scenario

      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Created Successfully.",
      })
    })
  })

  describe("updateCandidateProfile", () => {
   
    it("should return 422 if id not found in params", async () => {
      const mockReq = {
        params: {},
      }
      await updateCandidateProfile(mockReq, mockRes, mockNext)

      expect(mockNext).toHaveBeenCalledWith(
        new ValidationException(null, "Candidate Id is required in params.")
      )
    })

    it("should return 422 if data is invalid", async () => {
      const mockReq = {
        body: {
          first_name: "John",
          // Missing required fields to trigger validation error
        },
        user: { id: 1 },
      }

      await updateCandidateProfile(mockReq, mockRes, mockNext)

      // Check that validation error was passed to next()
      expect(mockNext).toHaveBeenCalledWith(expect.any(ValidationException))
})

    it("should update a candidate profile successfully", async () => {
     
      const oneCandidate = mockCandidates[0]
      delete oneCandidate.id
      delete oneCandidate.created_at
      delete oneCandidate.updated_at
      const mockReq = {
        body: {
          ...oneCandidate,
        },
        params:{
          id:1
        },
        user: { id: 1 },
      }

      // Create mocks for commit and rollback functions
      const commit = jest.fn()
      const rollback = jest.fn()

      // Mock sequelize.transaction to return an object with commit and rollback functions
      sequelize.transaction.mockResolvedValue({
        commit,
        rollback,
      })

      CandidateQueries.updateCandidate.mockResolvedValue([1])

      await updateCandidateProfile(mockReq, mockRes, mockNext)

      expect(CandidateQueries.updateCandidate).toHaveBeenCalledWith(
        mockReq.params.id,
        {
          ...mockReq.body,
          added_by: mockReq.user.id,
        },
        expect.any(Object)
      )

      // Assert the commit and rollback calls
      expect(commit).toHaveBeenCalledTimes(1)
      expect(rollback).not.toHaveBeenCalled() // rollback should not be called in a success scenario

      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Updated Successfully.",
      })
    })

    describe("deleteCandidateProfile", () => {
   
      it("should return 422 if id not found in params", async () => {
        const mockReq = {
          params: {},
        }
        await deleteCandidateProfile(mockReq, mockRes, mockNext)
  
        expect(mockNext).toHaveBeenCalledWith(
          new ValidationException(null, "Candidate Id is required in params.")
        )
      })
  
      it("should delete a candidate profile successfully", async () => {
        const mockReq = {
          params:{
            id:1
          },
        }

  
        CandidateQueries.deleteCandidate.mockResolvedValue([1])
  
        await deleteCandidateProfile(mockReq, mockRes, mockNext)
  
        expect(CandidateQueries.deleteCandidate).toHaveBeenCalledWith(
          mockReq.params.id,
        )
  
     
        expect(mockRes.status).toHaveBeenCalledWith(200)
        expect(mockRes.json).toHaveBeenCalledWith({
          message: "Deleted Successfully.",
        })
      })
    })
  })
})
