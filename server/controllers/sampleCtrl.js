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

/**
 * @param {object} req
 * @param {object} res
 * @param {Function} next
 */
async function putData(req, res, next) {
  try {
    log.debug({ req, res }, 'Enter putData')
    /**
     * findByIdAndUpdate has used for atomic operation and performance efficiency,
     * ensuring data integrity by running validators during update; it also automatically return
     * the updated data object.
     */
    let doc = await Sample.findByIdAndUpdate(
      req.params.id,
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      },
      { new: true, runValidators: true }
    )

    if (!doc) {
      return res.status(404).json({ message: 'document not found' })
    }

    await doc.save()
    log.debug({ req, res }, 'Leave putData')
    res.json({ id: doc._id, firstName: doc.firstName, lastName: doc.lastName })
  } catch (err) {
    next(err)
  }
}

/**
 * @param {object} req
 * @param {object} res
 * @param {Function} next
 */
async function deleteData(req, res, next) {
  try {
    log.debug({ req, res }, 'Enter deleteData')
    /**
     * findByIdAndDelete has used to remove a document by its ID efficiently,
     * and reducing the operation to a single step to have an optimized performance.
     */
    let doc = await Sample.findByIdAndDelete(req.params.id)

    if (!doc) {
      return res.status(404).json({ message: 'document not found' })
    }

    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getData,
  postData,
  putData,
  deleteData,
}
