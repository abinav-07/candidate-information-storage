const { userDataMapper, userJWTDataMapper } = require("../../../src/helpers/mappers/userMapper")

describe("userMapper", () => {
  describe("userDataMapper", () => {
    it("should map all properties correctly", () => {
      const userData = {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        roles: ["user"],
        created_at: "2024-07-14T12:00:00Z",
      }

      const expectedMappedData = {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        roles: ["user"],
        created_at: "2024-07-14T12:00:00Z",
      }

      expect(userDataMapper(userData)).toStrictEqual(expectedMappedData)
    })

    it("should handle missing optional properties", () => {
      const userData = {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        roles: ["user"],
      }

      const expectedMappedData = {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        roles: ["user"],
        created_at: undefined,
      }

      expect(userDataMapper(userData)).toStrictEqual(expectedMappedData)
    })

    it("should handle null input", () => {
      const userData = null

      const expectedMappedData = {
        id: undefined,
        first_name: undefined,
        last_name: undefined,
        email: undefined,
        roles: undefined,
        created_at: undefined,
      }

      expect(userDataMapper(userData)).toStrictEqual(expectedMappedData)
    })
  })

  describe("userJWTDataMapper", () => {
    it("should map all properties correctly", () => {
      const userData = {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        roles: ["user"],
      }

      const expectedMappedData = {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        roles: ["user"],
      }

      expect(userJWTDataMapper(userData)).toStrictEqual(expectedMappedData)
    })

    it("should handle missing optional properties", () => {
      const userData = {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
      }

      const expectedMappedData = {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        roles: undefined,
      }

      expect(userJWTDataMapper(userData)).toStrictEqual(expectedMappedData)
    })

    it("should handle null input", () => {
      const userData = null

      const expectedMappedData = {
        id: undefined,
        first_name: undefined,
        last_name: undefined,
        email: undefined,
        roles: undefined,
      }

      expect(userJWTDataMapper(userData)).toStrictEqual(expectedMappedData)
    })
  })
})
