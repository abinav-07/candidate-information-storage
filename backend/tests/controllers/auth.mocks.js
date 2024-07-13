exports.mockMappedAdmin = {
  id: 1,
  first_name: expect.any(String),
  last_name: expect.any(String),
  email: "admin@gmail.com",
  password: "$2a$12$rEp6m9wsUklwdoVhrQ7gnOW1RtfbzGj/Eme2XVrfJbiwjFk/H6oMa",
  roles: expect.any(Array),
  created_at: expect.any(Date),
}

exports.mockMappedJWTAdmin = {
  id: 1,
  first_name: expect.any(String),
  last_name: expect.any(String),
  email: "admin@gmail.com",
  roles: expect.any(Array),
}
