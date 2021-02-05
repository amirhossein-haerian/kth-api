// @ts-check

const mocks = {
  getPaths: jest.fn().mockImplementation(() => ({
    system: {
      monitor: {
        uri: '/_monitor',
      },
      robots: {
        uri: '/robots.txt',
      },
    },
  })),
}

module.exports = mocks
