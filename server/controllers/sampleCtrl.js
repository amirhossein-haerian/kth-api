const log = require('@kth/log')
/**
 * Sample API controller. Can safely be removed.
 */
const { Sample } = require('../models')

/**
 * @param {object} req
 * @param {object} res
 * @param {Function} next
 */
async function getData(req, res, next) {
  try {
    log.debug({ req, res }, 'Enter getData')
    let doc = {}
    doc = await Sample.findById(req.params.id)

    if (!doc) {
      return res.status(404).json({ message: 'document not found' })
    }
    log.debug({ req, res }, 'Leave getData')
    return res.json({ id: doc._id, firstName: doc.firstName, lastName: doc.lastName })
  } catch (err) {
    return next(err)
  }
}

/**
 * @param {object} req
 * @param {object} res
 * @param {Function} next
 */
async function postData(req, res, next) {
  try {
    log.debug({ req, res }, 'PostData')
    let doc = await Sample.findById(req.params.id)

    if (!doc) {
      doc = new Sample({
        _id: req.params.id,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      })
    } else {
      ;(doc.firstName = req.body.firstName), (doc.lastName = req.body.lastName)
    }

    await doc.save()
    log.debug({ req, res })
    res.json({ id: doc._id, firstName: doc.firstName, lastName: doc.lastName })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getData,
  postData,
}
