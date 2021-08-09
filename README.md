# Node-api

## Template project for RESTful API:s

In an attempt to simplify the process of starting up new Node.js based projects, there exists two template projects to use as a foundation.

The two projects are [node-web][web], a web server with express, and [node-api][api], a RESTful API.
The node-web project CAS as a mechanism for authorisation and authentication.

### Where can I find the template projects?

- [https://github.com/KTH/node-api.git][api]
- [https://github.com/KTH/node-web.git][web]

It's important that we try to make changes that affect the template projects in the template projects themselves to make sure that all other projects based on the templates get the good stuff.

### How do I use this template project for a project of my own?

1. Create a new repository on Gita or Github.
2. Clone the node-api repository by using:

   ```sh
   git clone git@github.com:KTH/node-api.git NEW_REPOSITORY_NAME
   ```

3. Navigate to the cloned project directory

4. Change remote repo

   ```sh
   git remote add origin https://github.com/KTH/<NEW_REPOSITORY_NAME>.git
   ```

## How to configure the applications

Make sure you have a MongoDb connected. An easy way to add a MongoDb is to clone and start the following database repo on your local machine: https://gita.sys.kth.se/infosys/kth-node-backend

```sh
# Logging
LOGGING_ACCESS_LOG=/{YOUR LOCAL PATH}/node-api/logs
```

Set your basePath property in `swagger.json`:

```json
{
  "swagger": "2.0",
  "info": {
  "title": "Node API",
    "description": "Template API project for Node.js",
    "version": "1.0.0"
  },
  "basePath": "/api/node/v1",
```

Please, remember to set path to match your application.

### What is `swagger-ui`?

The `swagger-ui` package is simply used to provide a basic UI for testing the API. It is not directly required in the code, which means running checks like `npm-check` will claim it is unused. It cannot be stressed enough, **do not remove this package**!

### What can I customize?

Follow the instructions for the files and folders below. For any files and folders not listed, avoid editing them in your custom project.

- `/config`

  Any and all configuration goes here. In particular you must edit the `serverSettings.js` file to match your project's proxy prefix path (e.g. `/api/node`). Other things you may want to edit are the environment specific files for the database connection config.

  > **Important:**
  > Remember not to put any sensible data into serverSettings.js. Secrets should be always be read from environment variables or the file "/.env".

- `/server/models`

  Anything in this folder can be edited to fit your project. You can safely remove the `sample.js` file and add your own mongoose-based schemas and models.

- `/server.js`

  Along with many other things, this file contains the routing config for the sample controller. Most of the content should only be edited in the template project. The paths for the routes come from the `swagger.json` file.

- `/server/controllers/sampleCtrl.js`

  This file contains the sample controller. You can either rename or remove this file. You can add your own controllers to this folder. Remember to add your custom controllers to the `index.js` file.

- `/swagger.json`

  This file contains the API configuration and documentation. You should add your own paths to this file. See the [Swagger website](https://swagger.io/) for documentation on the `swagger.json` format.

- `/package.json`

  Update the project name and add any dependencies you need. Excluding the testing scripts, avoid editing the scripts.

## Common errors

### useSsl

When trying to run node-api as a standalone you might encounter the following error:

```
return binding.open(pathModule._makeLong(path), stringToFlags(flags), mode);
```

This is because the SSL information is incorrect in "/config/serverSettings.js". Set `useSsl: false` to avoid this.

## Testing

You find some useful hints for developers in the file "[TESTING.md](TESTING.md)".

> **Please note:**
> You might decide to remove all unit-tests from your application. Keep in mind that you still need to provide a working npm script for `npm test` for the build server. If you don't want or need tests, a simple `echo "ok"` will suffice.

## Linting

_From Wikipedia: lint, or a linter, is a static code analysis tool used to flag programming errors, bugs, stylistic errors, and suspicious constructs._

We use ESLint for our linting and our default config comes from the module [@kth/eslint-config-kth](https://github.com/KTH/eslint-config-kth)

See .eslintrc file

[api]: https://github.com/KTH/node-api
[web]: https://github.com/KTH/node-web
[swagger]: http://swagger.io/

