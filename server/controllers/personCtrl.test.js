const { getPerson, postPerson, putPerson, deletePerson } = require('./personCtrl')

// Test person
//

jest.mock('@kth/log', () => ({
  init: jest.fn(() => {}),
  info: jest.fn(() => {}),
  debug: jest.fn(() => {}),
  error: jest.fn(() => {}),
}))

jest.mock('../models', () => ({
  Person: {
    findById: jest.fn().mockImplementation(_id => {
      if (!_id || _id === 'abc') {
        return null
      }
      if (_id === 'fail') {
        return {
          _id,
          firstName: 'mockFirstName',
          lastName: 'mockLastName',
          save: jest.fn().mockImplementation(() => {
            throw new Error('Failed to save')
          }),
        }
      }
      return {
        _id,
        firstName: 'mockFirstName',
        lastName: 'mockLastName',
        save: jest.fn().mockImplementation(() => {}),
      }
    }),
    findByIdAndUpdate: jest.fn().mockImplementation((_id, update, options) => {
      if (!_id || _id === 'abc') {
        return null
      }

      return {
        _id,
        ...update,
        save: jest.fn().mockImplementation(() => {}),
      }
    }),
    findByIdAndDelete: jest.fn().mockImplementation(_id => {
      if (!_id || _id === 'abc') {
        return null
      }
      return {}
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

describe(`Person controller`, () => {
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

  test('should getPerson ok', async () => {
    const req = buildReq({ params: { id: '123' } })
    const res = buildRes()
    const next = buildNext()

    await getPerson(req, res, next)

    expect(res.json).toHaveBeenNthCalledWith(1, { id: '123', firstName: 'mockFirstName', lastName: 'mockLastName' })
  })

  test('should handle getPerson not found', async () => {
    const req = buildReq({})
    const res = buildRes()
    const next = buildNext()

    await getPerson(req, res, next)

    expect(res.json).toHaveBeenNthCalledWith(1, { message: 'document not found' })
  })

  test('should postPerson update ok', async () => {
    const req = buildReq({ params: { id: '123' }, body: { firstName: 'John', lastName: 'Doe' } })
    const res = buildRes()
    const next = buildNext()

    await postPerson(req, res, next)
    expect(res.json).toHaveBeenNthCalledWith(1, { id: '123', firstName: 'John', lastName: 'Doe' })
  })
  test('should postPerson create ok', async () => {
    const req = buildReq({ params: { id: '123' }, body: { firstName: 'John', lastName: 'Doe' } })
    const res = buildRes()
    const next = buildNext()

    await postPerson(req, res, next)
    expect(res.json).toHaveBeenNthCalledWith(1, { id: '123', firstName: 'John', lastName: 'Doe' })
  })
  test('should handle postPerson  fail', async () => {
    const req = buildReq({ params: { id: 'fail' }, body: { firstName: 'John', lastName: 'Doe' } })
    const res = buildRes()
    const next = buildNext()

    await postPerson(req, res, next)
    expect(next).toHaveBeenNthCalledWith(1, new Error('Failed to save'))
  })

  test('should handle putPerson ok', async () => {
    const req = buildReq({ params: { id: '123' }, body: { firstName: 'John', lastName: 'Doe' } })
    const res = buildRes()
    const next = buildNext()

    await putPerson(req, res, next)
    expect(res.json).toHaveBeenNthCalledWith(1, { id: '123', firstName: 'John', lastName: 'Doe' })
  })

  test('should handle putPerson not found', async () => {
    const req = buildReq({})
    const res = buildRes()
    const next = buildNext()

    await putPerson(req, res, next)

    expect(res.json).toHaveBeenNthCalledWith(1, { message: 'document not found' })
  })

  test('should handle deletePerson ok', async () => {
    const req = buildReq({ params: { id: '123' } })
    const res = buildRes()
    const next = buildNext()

    await deletePerson(req, res, next)
    expect(res.status).toHaveBeenCalledWith(204)
    expect(res.send).toHaveBeenCalled()
  })

  test('should handle delete not found', async () => {
    const req = buildReq({})
    const res = buildRes()
    const next = buildNext()

    await deletePerson(req, res, next)

    expect(res.json).toHaveBeenNthCalledWith(1, { message: 'document not found' })
  })
})
