'use strict'

/**
 * Room API model.
 */

const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  _id: String,
  name: {
    type: String,
    required: [true, 'name is required.'],
    unique: true,
    trim: true,
    minlength: [1, 'name must have at least one character.'],
    maxlength: [20, 'name must have at most 20 characters.'],
    default: '',
  },
  isBooked: { type: Boolean, required: true, default: false },
  relation: [
    {
      person: {
        type: String,
        ref: 'Person',
      },
    },
  ],
})

schema.pre('save', async function (next) {
  // I assume that if a room is booked at least one person should be assigned to the booked room
  try {
    if (this.isBooked && (!this.relation || this.relation.length === 0)) {
      // Prevent saving and return an error if isBooked is true but relation is empty
      next(new Error('A booked room must have at least one associated person.'))
      return
    }

    /**
     * It is better to prevent saving relations to Person model if the id is not exist inside the database
     * related to person.
     
     * here I make sure that the entered id by user is exist inside Person.
     */

    const promises = this.relation.map(rel => mongoose.model('Person').findById(rel.person))
    const results = await Promise.all(promises)

    const allExist = results.every(result => result !== null)
    if (!allExist) {
      next(new Error('One or more associated person IDs do not exist.'))
      return
    }

    next() // Proceed with saving if all validations pass
  } catch (error) {
    next(error) // Forward any errors to the next middleware
  }
})

schema.index({ name: 1 }, { unique: true })

module.exports = mongoose.model('Room', schema)
