'use strict'

/**
 * Person API model.
 
 * To make it possible to handle values with firstName and lastName this model needed to be changed.
 */

const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  _id: String,
  firstName: {
    type: String,
    required: [true, 'firstName is required.'],
    trim: true,
    minlength: [1, 'firstName must have at least one character.'],
    maxlength: [20, 'firstName must have at most 20 characters.'],
    default: '',
  },
  lastName: {
    type: String,
    required: [true, 'lastName is required.'],
    trim: true,
    minlength: [1, 'lastName must have at least one character.'],
    maxlength: [20, 'lastName must have at most 20 characters.'],
    default: '',
  },
})

module.exports = mongoose.model('Person', schema)
