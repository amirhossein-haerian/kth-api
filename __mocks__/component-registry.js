// @ts-check

const mocks = {
  globalRegistry: {
    getUtility: jest.fn().mockImplementation(() => ({
      status: jest.fn(() => ({ statusCode: 200 })),
      renderJSON: jest.fn(() => '{status:200}'),
    })),
  },
}

module.exports = mocks
