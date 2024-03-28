const log = require('@kth/log')
/**
 * Room API controller.
 
 * Here I used populate whenever I am returning details of an entity in database related to a room
 * due to the fact that I have a relation to Person model and I want to send details of that as well.
 
 */
const { Room } = require('../models')

relationFormatter = relation => {
  // Here this approach has used to not have multiple person with same id inside the room relation
  const uniqueRelationIds = [...new Set(relation)]

  /**
   * it does not matter if API user knows mongodb or not we should enable them to only
   * send an easy array of strings and then make the desired format based on our database architecture.
   */
  return uniqueRelationIds.map(id => ({ person: id }))
}

/**
 * @param {object} req
 * @param {object} res
 * @param {Function} next
 */
async function getRoom(req, res, next) {
  try {
    log.debug({ req, res }, 'Enter getRoom')
    let doc = {}
    doc = await Room.findById(req.params.id).populate('relation.person')

    if (!doc) {
      return res.status(404).json({ message: 'document not found' })
    }
    log.debug({ req, res }, 'Leave getPerson')
    return res.json({ id: doc._id, name: doc.name, isBooked: doc.isBooked, relation: doc.relation })
  } catch (err) {
    return next(err)
  }
}

/**
 * @param {object} req
 * @param {object} res
 * @param {Function} next
 */

async function postRoom(req, res, next) {
  try {
    log.debug({ req, res }, 'PostRoom')
    let { name, isBooked, relation } = req.body

    if (relation && relation.length) relation = relationFormatter(relation)

    let doc = await Room.findById(req.params.id).populate('relation.person')

    if (!doc) {
      doc = new Room({
        _id: req.params.id,
        name: name,
        isBooked: isBooked,
        relation: relation,
      })
    } else {
      doc.name = name
      doc.isBooked = isBooked
      doc.relation = relation
    }

    await doc.save()
    log.debug({ req, res })
    res.json({ id: doc._id, name: doc.name, isBooked: doc.isBooked, relation: doc.relation })
  } catch (err) {
    next(err)
  }
}

/**
 * @param {object} req
 * @param {object} res
 * @param {Function} next
 */
async function putRoom(req, res, next) {
  try {
    log.debug({ req, res }, 'Enter putRoom')
    let { name, isBooked, relation } = req.body

    if (relation && relation.length) relation = relationFormatter(relation)

    let doc = await Room.findByIdAndUpdate(
      req.params.id,
      {
        name: name,
        isBooked: isBooked,
        relation: relation,
      },
      { new: true, runValidators: true }
    ).populate('relation.person')

    if (!doc) {
      return res.status(404).json({ message: 'document not found' })
    }

    await doc.save()
    log.debug({ req, res }, 'Leave putPerson')
    res.json({ id: doc._id, name: doc.name, isBooked: doc.isBooked, relation: doc.relation })
  } catch (err) {
    next(err)
  }
}

/**
 * @param {object} req
 * @param {object} res
 * @param {Function} next
 */
async function deleteRoom(req, res, next) {
  try {
    log.debug({ req, res }, 'Enter deleteRoom')
    let doc = await Room.findByIdAndDelete(req.params.id)

    if (!doc) {
      return res.status(404).json({ message: 'document not found' })
    }

    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getRoom,
  postRoom,
  putRoom,
  deleteRoom,
}
