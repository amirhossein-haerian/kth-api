# How to do testing with `node-api`

This file contains some hints for developers related to testing:

- [Unit-tests](#unit-tests)
- [Integration-tests](#integration-tests)
- [Swagger validation](#swagger-validation)

# Unit-tests

## Framework

The unit-tests are run with [Jest](https://jestjs.io/).

## Directories

Other testing frameworks often put all unit-tests into a separate directory, e.g. `/test`.

With Jest in contrary, the unit-tests are usually put directly beside the tested source-code, e.g. as `/server/controllers/systemCtrl.test.js`.

You'll find some examples with the extension `.test.js` in the directory `/server`. You might want to use them as a inspiration to get started with your own unit-tests.

### `/test`

- In case you have some general test-utilities, the directory "/test" might still be a good place to use for those.

### `__mocks__`

- When testing one file you might need to mock some other parts of the application. With Jest, these mockups can be defined directly inside the test-file or put into special directories named `__mocks__`.

  > **Please note:**
  > The directory `/__mocks__` in the project's root is a good place for your mockups of external packages, e.g. "kth-node-log".

### `__snapshots__`

- Some unit-test might contain Jest's `expect(data).toMatchSnapshot()`. Directories with the name `__snapshots__` are then created and used by Jest to store information about the related test-data.

  > Those snapshots are an important part of the unit-tests and should always be commited to the Git repository.

## Usage

Several ways are pre-configured for running the unit-tests.

### Run all unit-tests once

- ```sh
  npm test
  # or: npm run test
  ```

  > **Please note:**
  > The same command is used to check all changes before you can push a Git-commit into your project's central repository. This is done with [Husky](https://www.npmjs.com/package/husky) and a "pre-commit" hook.

### Run unit-tests of changed files as soon as something changes

- ```sh
  npm run test:watch
  ```

### Run all unit-tests in a local Docker container

- ```sh
  npm run test:unit-in-docker
  ```

  Before the unit-tests are run, a Docker image of the whole application is build. This image is then used, to start the unit-tests in a fresh Docker container.

  > **Hint:**
  > This might also be an easy and good way to ensure that the Docker image of your application can be build without problems in the CI/CD pipeline.

### Automatic unit-tests as a hook before pushing to GitHub

- Before you can push local commits to your repository at GitHub, the unit-tests will always be run as a "pre-push" hook in order to avoid the publication of defective application states.

  > **We strongly advise you against** taking away "husky" or the "pre-push" hook in `package.json`.

### Automatic unit-tests as part of the CI/CD pipeline

- **By default, this function is deactivated.** No unit-tests are run in the pipeline.

  > This is done by having the file `/docker-compose-unit-tests` with the extension `.yml.in`.

- If you rename the file to `/docker-compose-unit-tests.yml`, the build-pipeline at KTH will automatically run the unit-tests with Docker right after any new application image was successfully created.

  > **Please note:**<br>This might significantly slow down the build-process. Before the unit-tests are run in the pipeline, the Docker container must install your application's full development environment with `npm install`.

  > You find more information in the Git repository of KTH's package "Evolene": https://github.com/KTH/evolene/blob/master/README.md#testing

  > Check the output in Jenkins in case of problems!

# Integration-tests

The integration-tests are based on scripts for Bash and Node.js. They can be run locally and/or automatically as part of the CI/CD pipeline.

## Directories and files

### `/docker-compose-integration-tests.yml`

- You'll find this YAML-file in the project's root. It is used to run the integration-tests with docker-compose locally as well as in the CI/CD pipeline.

  > Change the file's extension (e.g. to `.yml.in`) if you don't want the integration-tests to become active in the CI/CD pipeline.

### `/test/integration`

- Everything else needed for the integration-tests can be found in this directory, e.g.

  ```
  .dockerignore
  all-tests.sh
  basic.sh
  check-_paths.js
  check-_paths.json
  Dockerfile
  ```

- **`all-tests.sh`**

  This Bash-script invokes all integration-tests. If one of the test fails, the whole script must fail with a non-zero exit-code.

  Example:

  ```sh
  #!/bin/bash
  bash ./basic.sh || exit $?
  node check-_paths.js || exit $?
  exit 0
  ```

- **`basic.sh`**

  This script uses cURL to access the monitor-page of your application, e.g. at http://localhost:3001/api/node/\_monitor. It expects the output to contain "APPLICATION_STATUS: OK". Otherwise the integration-test will fail.

  > Feel free to add some more simple integration-tests in this file.

- **`check-_paths.js`**

  The script `check-_paths.js` is used to fetch the list of endpoints from `_paths`, to ignore some special endpoints and to send a request to all other URIs of the application. It expects the response code of every request to be **HTTP 401 (Unauthorized)** as long as no exceptions are defined in `check-_paths.json`. Otherwise the integration-test will fail.

  > Normally, you should use the file "swagger.json" to define all endpoints which the REST API should provide. The code in `/server/server.js` will parse this information to configure the Express.js server. At the same time, a special endpoint-list will be created which is made accessible via `getPaths()` in the code and `_paths` in the REST_API.
  >
  > Example: http://localhost:3001/api/node/\_paths

  > There are some special endpoints which are not defined in "swagger.json" and are usually accessible without authentication, e.g. "\_about", "\_monitor", "\_paths" and "swagger".

  > As a general rule, those real data-endpoints defined in "swagger.json" should be protected by some kind of authentication mechanism, e.g. "api_key". Exactly this shall be assured by `check-_paths.js`.

- **`check-_paths.json`**

  The JSON-configuration inside `check-_paths.json` can be changed to fit the structure of your REST API:

  ```json
  {
    "expectedDefaultResponseCodes": [401],
    "expectedSingleResponses": []
  }
  ```

  > **"expectedDefaultResponseCodes"** states any response code of an endpoint's test-request which should be accepted by default, e.g. **[401, 403]**.

  > **"expectedSingleResponses"** is a list of objects in the shape `{ method, uri, statusCode }`.
  >
  > - **"method"** should be one of **"GET"**, **"POST"**, **"PUT"** or **"DELETE"**,
  > - **"uri"** states an endpoint from "\_paths", e.g. **"v1/data/:id"**,
  > - **"statusCode"** is the divergent response code of the given endpoint, e.g. **200**, **404**, **500** or even **"timeout"**.

  Example:

  ```json
  {
    "expectedDefaultResponseCodes": [401, 403],
    "expectedSingleResponses": [
      {
        "method": "GET",
        "uri": "v1/data/:id",
        "statusCode": 404
      },
      {
        "method": "POST",
        "uri": "v1/data/:id",
        "statusCode": "timeout"
      }
    ]
  }
  ```

## Usage

### Run all integration-tests once

- Ensure that the application is running and available locally, e.g. at http://localhost:3001/api/node

  ```sh
  npm run start-dev
  # or using a debugger with "node app.js"
  ```

- If you made changes to the port or the prefix-path of your application, ensure that the correct information is given as **INTEGRATION_TEST_BASEURL** at "script - test:integration" inside `/package.json`.

  Example:

  ```json
  {
    ...
    "scripts": {
      ...
      "test:integration": "cd test/integration && bash -c 'INTEGRATION_TEST_BASEURL=http://localhost:3001/api/node ./all-tests.sh'",
    },
    ...
  }
  ```

- Init the test-run:

  ```sh
  npm run test:integration
  ```

### Run all integration-tests in a local Docker container

- Ensure that all needed environment variables are correctly set in the file `/docker-compose-integration-tests.yml`, especially **SERVICE_PUBLISH** and **INTEGRATION_TEST_BASEURL**.

- Init the test-run:

  ```sh
  npm run test:integration-in-docker
  ```

  > Docker Compose takes care of building a Docker image of your application and setup a container with MongoDB and a container with the integration-tests before all three parts are run together as Docker services.

  > **Hint:**
  > This might also be an easy and good way to ensure that your application can be run without problems after a new Docker image was build in the CI/CD pipeline.

### Automatic integration-tests as part of the CI/CD pipeline

- As long as you keep the filename `/docker-compose-integration-tests.yml`, the build-pipeline at KTH will run the integration-tests with Docker right after any new Docker image was successfully created.

  > You find more information in the Git repository of KTH's package "Evolene": https://github.com/KTH/evolene/blob/master/README.md#testing

  > Check the output in Jenkins in case of problems!

# Swagger validation

[Swagger](https://swagger.io/) and the file "swagger.json" are used to define, access and describe the endpoints of the application's REST API. The structure of "swagger.json" must follow the OPEN API specifications in version 2.0: https://swagger.io/specification/v2/

> **Please note:**
> There is also a version 3.0 of the [OPEN API specification](https://en.wikipedia.org/wiki/OpenAPI_Specification) available. This version is compatible with Swagger. It might still cause problems in your application because of some other code which relies on OPEN API 2.0, e.g. in the package "[kth-node-api-common](https://github.com/KTH/kth-node-api-common)".

## Usage

> The validation is run with help of [swagger-parser](https://www.npmjs.com/package/swagger-parser).

### Find syntax errors in "swagger.json" once

- Init the test-run:

  ```sh
  npm run validate:swagger
  ```

### Find syntax errors in "swagger.json" as soon as file is changed

- ```sh
  npm run validate:swagger-watch
  ```
