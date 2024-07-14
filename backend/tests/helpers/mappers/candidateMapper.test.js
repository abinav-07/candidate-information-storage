const { candidateDataMapper } = require("../../../src/helpers/mappers/candidateMapper")

describe("candidateDataMapper", () => {
  it("should map all properties correctly when all data is provided", () => {
    const candidateData = {
      id: 1,
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      free_text: "Sample text",
      phone_number: "123-456-7890",
      linkedin_url: "https://linkedin.com/in/johndoe",
      github_url: "https://github.com/johndoe",
      availability_start_time: "09:00",
      availability_end_time: "17:00",
      created_at: "2024-07-14T12:00:00Z",
    }

    const expectedMappedData = {
      candidate_id: 1,
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      free_text: "Sample text",
      phone_number: "123-456-7890",
      linkedin_url: "https://linkedin.com/in/johndoe",
      github_url: "https://github.com/johndoe",
      availability_start_time: "09:00",
      availability_end_time: "17:00",
      created_at: "2024-07-14T12:00:00Z",
    }

    expect(candidateDataMapper(candidateData)).toStrictEqual(expectedMappedData)
  })

  it("should handle missing optional properties", () => {
    const candidateData = {
      id: 1,
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      free_text: "Sample text",
      created_at: "2024-07-14T12:00:00Z",
    }

    const expectedMappedData = {
      candidate_id: 1,
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      free_text: "Sample text",
      phone_number: undefined,
      linkedin_url: undefined,
      github_url: undefined,
      availability_start_time: undefined,
      availability_end_time: undefined,
      created_at: "2024-07-14T12:00:00Z",
    }

    expect(candidateDataMapper(candidateData)).toStrictEqual(expectedMappedData)
  })

  it("should handle missing required properties", () => {
    const candidateData = {}

    const expectedMappedData = {
      candidate_id: undefined,
      first_name: undefined,
      last_name: undefined,
      email: undefined,
      free_text: undefined,
      phone_number: undefined,
      linkedin_url: undefined,
      github_url: undefined,
      availability_start_time: undefined,
      availability_end_time: undefined,
      created_at: undefined,
    }

    expect(candidateDataMapper(candidateData)).toStrictEqual(expectedMappedData)
  })

  it("should handle null input", () => {
    const candidateData = null

    const expectedMappedData = {
      candidate_id: undefined,
      first_name: undefined,
      last_name: undefined,
      email: undefined,
      free_text: undefined,
      phone_number: undefined,
      linkedin_url: undefined,
      github_url: undefined,
      availability_start_time: undefined,
      availability_end_time: undefined,
      created_at: undefined,
    }

    expect(candidateDataMapper(candidateData)).toStrictEqual(expectedMappedData)
  })
})
