'use strict'

const log = require('@kth/log')
const importStuff = require('./importStuff')

const importJob = async (job, done) => {
  try {
    await importStuff.start()
    done()
  } catch (e) {
    log.error({ err: e }, 'import failure:', e.message)
    job.fail(new Error(e.message))
    await job.save()
    done(e)
  }
}

module.exports = {
  import: importJob,
}
