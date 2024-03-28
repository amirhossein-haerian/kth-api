const { postRoom, putRoom } = require('./roomCtrl')

// Test Room
//

jest.mock('@kth/log', () => ({
  init: jest.fn(() => {}),
  info: jest.fn(() => {}),
  debug: jest.fn(() => {}),
  error: jest.fn(() => {}),
}))

jest.mock('../models', () => ({
  Room: {
    findById: jest.fn().mockImplementation(_id => {
      if (_id === 'fail') {
        return {
          _id,
          name: 'mockName',
          isBooked: false,
          relation: [],
          save: jest.fn().mockImplementation(() => {
            throw new Error('Failed to save')
          }),
          populate: jest.fn().mockReturnThis(),
        }
      }
      return {
        _id,
        name: 'mockName',
        isBooked: false,
        relation: [],
        save: jest.fn().mockImplementation(() => {}),
        populate: jest.fn().mockReturnThis(),
      }
    }),
    findByIdAndUpdate: jest.fn().mockImplementation((_id, update, options) => {
      if (!_id || _id === 'abc') {
        return {
          populate: jest.fn().mockReturnValue(null),
        }
      }

      return {
        _id,
        ...update,
        save: jest.fn().mockImplementation(() => {}),
        populate: jest.fn().mockReturnThis(),
      }
    }),
  },
}))

/*
 * utility functions
 */
function buildReq(overrides) {
  const req = { headers: { accept: 'application/json' }, body: {}, params: {}, ...overrides }
  return req
}

function buildRes(overrides = {}) {
  const res = {
    json: jest.fn(() => res).mockName('json'),
    status: jest.fn(() => res).mockName('status'),
    type: jest.fn(() => res).mockName('type'),
    send: jest.fn(() => res).mockName('send'),
    render: jest.fn(() => res).mockName('render'),

    ...overrides,
  }
  return res
}

function buildNext(impl) {
  return jest.fn(impl).mockName('next')
}

describe(`Room controller`, () => {
  const OLD_ENV = process.env
  const log = require('@kth/log')
  log.init({ name: 'Unit tests', level: 'debug', env: 'production' })

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV }
    jest.clearAllMocks()
  })
  afterEach(() => {
    process.env = OLD_ENV
  })

  test('should postRoom update ok', async () => {
    const req = buildReq({ params: { id: '123' }, body: { name: 'room2' } })
    const res = buildRes()
    const next = buildNext()

    await postRoom(req, res, next)
    expect(res.json).toHaveBeenNthCalledWith(1, expect.objectContaining({ id: '123', name: 'room2' }))
  })
  test('should postRoom create ok', async () => {
    const req = buildReq({ params: { id: '123' }, body: { name: 'room3' } })
    const res = buildRes()
    const next = buildNext()

    await postRoom(req, res, next)
    expect(res.json).toHaveBeenNthCalledWith(1, expect.objectContaining({ id: '123', name: 'room3' }))
  })
  test('should handle postRoom  fail', async () => {
    const req = buildReq({ params: { id: 'fail' }, body: { name: 'room1' } })
    const res = buildRes()
    const next = buildNext()

    await postRoom(req, res, next)
    expect(next).toHaveBeenNthCalledWith(1, new Error('Failed to save'))
  })

  test('should handle putRoom ok', async () => {
    const req = buildReq({ params: { id: '123' }, body: { name: 'room2' } })
    const res = buildRes()
    const next = buildNext()

    await putRoom(req, res, next)
    expect(res.json).toHaveBeenNthCalledWith(1, expect.objectContaining({ id: '123', name: 'room2' }))
  })

  test('should handle putRoom not found', async () => {
    const req = buildReq({})
    const res = buildRes()
    const next = buildNext()

    await putRoom(req, res, next)

    expect(res.json).toHaveBeenNthCalledWith(1, { message: 'document not found' })
  })
})
