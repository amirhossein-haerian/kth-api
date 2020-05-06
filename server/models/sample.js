'use strict'

/**
 * Sample API model. Can safely be removed.
 */

const mongoose = require('mongoose')
const { getClient } = require('@kth/kth-node-cosmos-db')

const schema = new mongoose.Schema({
  _id: String,
  name: {
    type: String,
    required: [true, 'Name is required.'],
    trim: true,
    minlength: [1, 'Name must have at least one character.'],
    maxlength: [20, 'Name must have at most 20 characters.'],
    default: '',
  },
})

let client
let model

const initSample = async () => {
  try {
    client = await getClient()
    model = await client.createMongooseModel('Sample', schema, mongoose)
    return model
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      model = mongoose.model('Sample', schema)
      return model
    }
    return null
  }
}
const getSample = () => {
  if (model) return model
  if (process.env.NODE_ENV === 'development') {
    model = mongoose.model('Sample', schema)
    return model
  }
  return null
}

module.exports = { getSample, initSample }
