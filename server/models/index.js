const { getSample, initSample } = require('./sample')

const initModels = async () => {
  await initSample()
}
module.exports = {
  getSample,
  initModels,
}
