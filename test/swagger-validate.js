/* eslint-disable no-console */

/**
 * This script validates the project's swagger.json file.
 * It exits with code 0 iff no errors could be found.
 */

// eslint-disable-next-line import/no-extraneous-dependencies
const SwaggerParser = require('swagger-parser')

console.log('\nValidating swagger.json')

async function mainAsync() {
  try {
    await SwaggerParser.validate('swagger.json', { continueOnError: true })
  } catch ({ errors, message, details }) {
    if (errors) {
      console.error(
        '\nERRORS:\n',
        errors.map(item => ({ message: item.message, path: JSON.stringify(item.path) })),
        '\n'
      )
    } else {
      console.error('\nERROR:\n', message, details, '\n')
    }
    process.exit(1)
  }

  console.log('OK')
}

mainAsync()
