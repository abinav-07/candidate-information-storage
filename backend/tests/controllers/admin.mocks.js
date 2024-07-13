const mockCandidates = [
  {
    id: 1,
    first_name: "Test",
    last_name: "Me",
    email: "test@mailinator.com",
    free_text: "He seems good.",
    phone_number: "9863211220",
    linkedin_url: "https://www.linkedin.com/in/abinav-ghimire-89b4571b5/",
    github_url: "https://github.com/abinav-07",
    availability_start_time: "09:00",
    availability_end_time: "17:00",
    created_at: expect.any(Date),
    updated_at: expect.any(Date),
  },
]

const mockMappedCandidates = [
  {
    candidate_id: 1,
    first_name: "Test",
    last_name: "Me",
    email: "test@mailinator.com",
    free_text: "He seems good.",
    phone_number: "9863211220",
    linkedin_url: "https://www.linkedin.com/in/abinav-ghimire-89b4571b5/",
    github_url: "https://github.com/abinav-07",
    availability_start_time: "09:00",
    availability_end_time: "17:00",
    created_at: expect.any(Date),
  },
]

module.exports = {
  mockCandidates,
  mockMappedCandidates,
}
