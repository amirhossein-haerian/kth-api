'use strict'

const os = require('os')
const fs = require('fs')

const registry = require('component-registry').globalRegistry
const db = require('kth-node-mongo')
const { getPaths } = require('kth-node-express-routing')
const { IHealthCheck } = require('kth-node-monitor').interfaces

const configServer = require('../configuration').server
const version = require('../../config/version')
const packageFile = require('../../package.json')

/**
 * Adds a zero (0) to numbers less then ten (10)
 */
function zeroPad(value) {
  return value < 10 ? '0' + value : value
}

/**
 * Takes a Date object and returns a simple date string.
 */
function _simpleDate(date) {
  const year = date.getFullYear()
  const month = zeroPad(date.getMonth() + 1)
  const day = zeroPad(date.getDate())
  const hours = zeroPad(date.getHours())
  const minutes = zeroPad(date.getMinutes())
  const seconds = zeroPad(date.getSeconds())
  const hoursBeforeGMT = date.getTimezoneOffset() / -60
  const timezone = [' GMT', ' CET', ' CEST'][hoursBeforeGMT] || ''
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}${timezone}`
}

const started = _simpleDate(new Date())

/**
 * GET /swagger.json
 * Swagger config
 */
function getSwagger(req, res) {
  res.json(require('../../swagger.json'))
}

/**
 * GET /swagger
 * Swagger
 */
function getSwaggerUI(req, res) {
  if (req.url === configServer.proxyPrefixPath.uri + '/swagger') {
    // This redirect is needed since swagger js & css files to get right paths
    return res.redirect(configServer.proxyPrefixPath.uri + '/swagger/')
  }

  const pathToSwaggerUi = require('swagger-ui-dist').absolutePath()
  const swaggerUrl = configServer.proxyPrefixPath.uri + '/swagger.json'
  const petstoreUrl = 'https://petstore.swagger.io/v2/swagger.json'

  const indexContent = fs.readFileSync(`${pathToSwaggerUi}/index.html`).toString().replace(petstoreUrl, swaggerUrl)

  return res.type('text/html').send(indexContent)
}

/**
 * GET /_about
 * About page
 */
async function getAbout(req, res) {
  const paths = getPaths()

  res.render('system/about', {
    layout: '',
    appName: packageFile.name,
    appVersion: packageFile.version,
    appDescription: packageFile.description,
    monitorUri: paths.system.monitor.uri,
    robotsUri: paths.system.robots.uri,
    gitBranch: JSON.stringify(version.gitBranch),
    gitCommit: JSON.stringify(version.gitCommit),
    jenkinsBuild: JSON.stringify(version.jenkinsBuild),
    jenkinsBuildDate: version.jenkinsBuild
      ? _simpleDate(new Date(parseInt(version.jenkinsBuild, 10) * 1000))
      : JSON.stringify(version.jenkinsBuildDate),
    dockerName: JSON.stringify(version.dockerName),
    dockerVersion: JSON.stringify(version.dockerVersion),
    hostname: os.hostname(),
    started,
    env: process.env.NODE_ENV,
  })
}

/**
 * GET /_monitor
 * Monitor page
 */
async function getMonitor(req, res) {
  // Check MongoDB
  const mongodbHealthUtil = registry.getUtility(IHealthCheck, 'kth-node-mongodb')
  const subSystems = [mongodbHealthUtil.status(db, { required: true })]

  // If we need local system checks, such as memory or disk, we would add it here.
  // Make sure it returns a promise which resolves with an object containing:
  // {statusCode: ###, message: '...'}
  // The property statusCode should be standard HTTP status codes.
  const localSystems = Promise.resolve({ statusCode: 200, message: 'OK' })

  /* -- You will normally not change anything below this line -- */

  // Determine system health based on the results of the checks above. Expects
  // arrays of promises as input. This returns a promise
  const systemHealthUtil = registry.getUtility(IHealthCheck, 'kth-node-system-check')
  try {
    const systemStatus = await systemHealthUtil.status(localSystems, subSystems)

    if (systemStatus) {
      if (req.headers.accept === 'application/json') {
        const outp = systemHealthUtil.renderJSON(systemStatus)
        return res.status(systemStatus.statusCode).json(outp)
      }
      const outp = systemHealthUtil.renderText(systemStatus)
      return res.type('text').status(systemStatus.statusCode).send(outp)
    }
    throw new Error('no systemStatus')
  } catch (err) {
    return res.type('text').status(500).send(err)
  }
}

/**
 * GET /robots.txt
 * Robots.txt page
 */
function getRobotsTxt(req, res) {
  res.type('text').render('system/robots', {
    layout: '',
  })
}

/**
 * GET /_paths
 * Return all paths for the system
 */
function getPathsHandler(req, res) {
  res.json(getPaths())
}

function getCheckAPIKey(req, res) {
  res.end()
}

/**
 * System controller for functions such as about and monitor.
 * Avoid making changes here in sub-projects.
 */
module.exports = {
  monitor: getMonitor,
  about: getAbout,
  robotsTxt: getRobotsTxt,
  paths: getPathsHandler,
  checkAPIKey: getCheckAPIKey,
  swagger: getSwagger,
  swaggerUI: getSwaggerUI,
}
