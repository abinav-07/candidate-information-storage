jest.mock("./backend/src/models", () => {
  return {
    sequelize: {
      transaction: jest.fn().mockImplementation(() => ({
        commit: jest.fn(),
        rollback: jest.fn(),
      })),
    },
  }
})
