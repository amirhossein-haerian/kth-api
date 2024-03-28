const log = require('@kth/log')
/**
 * Person API controller.
 */
const { Person } = require('../models')

/**
 * @param {object} req
 * @param {object} res
 * @param {Function} next
 */
async function getPersons(req, res, next) {
  try {
    log.debug({ req, res }, 'Enter getPerson')
    const persons = await Person.find({})

    log.debug({ req, res }, 'Leave getPerson')
    return res.json(persons)
  } catch (err) {
    return next(err)
  }
}

/**
 * @param {object} req
 * @param {object} res
 * @param {Function} next
 */
async function getPerson(req, res, next) {
  try {
    log.debug({ req, res }, 'Enter getPerson')
    let doc = {}
    doc = await Person.findById(req.params.id)

    if (!doc) {
      return res.status(404).json({ message: 'document not found' })
    }
    log.debug({ req, res }, 'Leave getPerson')
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
async function postPerson(req, res, next) {
  try {
    log.debug({ req, res }, 'PostPerson')
    let doc = await Person.findById(req.params.id)

    if (!doc) {
      doc = new Person({
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
async function putPerson(req, res, next) {
  try {
    log.debug({ req, res }, 'Enter putPerson')
    /**
     * findByIdAndUpdate has used for atomic operation and performance efficiency,
     * ensuring data integrity by running validators during update; it also automatically return
     * the updated data object.
     */
    let doc = await Person.findByIdAndUpdate(
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
    log.debug({ req, res }, 'Leave putPerson')
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
async function deletePerson(req, res, next) {
  try {
    log.debug({ req, res }, 'Enter deletePerson')
    /**
     * findByIdAndDelete has used to remove a document by its ID efficiently,
     * and reducing the operation to a single step to have an optimized performance.
     */
    let doc = await Person.findByIdAndDelete(req.params.id)

    if (!doc) {
      return res.status(404).json({ message: 'document not found' })
    }

    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getPersons,
  getPerson,
  postPerson,
  putPerson,
  deletePerson,
}
