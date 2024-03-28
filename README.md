# Node-api

_This is specifically written for the `coding-interview` branch. See the `master` branch for a general introduction of the repository._

## Instructions

Make sure that the [Prerequisites](#prerequisites) are met, follow the steps in [Setup](#setup), and try out the application in [Getting started](#getting-started). Finally, try to solve the assignments in [Assignments](#assignments).

- Spend 1–2 hours on the assigments. You don’t need to finish all of them.
- Please use at least one commit per assigment.
- Add comments where needed.
- Update tests if necessary, and feel free to add addtional tests.
- Share the repository with the KTH representative.

If you run into problems, see [Troubleshooting](#troubleshooting). Contact the KTH representative if you have any questions.

## Prerequisites

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) and [npm](https://docs.npmjs.com/cli/v9/commands/npm)
- [Docker](https://www.docker.com/)
- [GitHub account](https://github.com/join)

## Setup

- Create a new repository with this repository ([KTH/node-api](https://github.com/KTH/node-api)) as a template.
- Switch to branch `coding-interview`.
- Install the dependencies with `npm i`.
- Start a MongoDB server instance with `npm run mongo:start`. (You can stop it with `npm run mongo:stop`.)
- rename the file [.env-coding-interview](.env-coding-interview) to `.env`
- Start the application with `npm run start-dev`. (The terminal should display something similar to [Example of log output on start](#example-of-log-output-on-start).)
- Verify that the Swagger UI is available on http://localhost:3001/api/node/swagger/.

## Getting started

- Authorization is managed with an `apiKey`. The default value is set to `1234` in [.env](.env). Press the _Authorize 🔓_ button in the Swagger UI, enter _1234_, press _Authorize_, and close the modal. Now, you can try the _GET /\_checkAPIkey_ endpoint. It will return response code `200` if you are authorized.
- Try to save data to the database with the _POST /v1/data/{id}_ endpoint.
- Then, try to retrieve the same data with the _GET /v1/data/{id}_ endpoint.

## Assignments

The assigments aim to add endpoints for full CRUD functionality, and then to further enhance the API.

1. Change the data endpoints to handle values with `firstName` and `lastName`, instead of just `name`. Example: `{ "name": "John Doe" }` to `{ "firstName": "John", "lastName": "Doe"}`.
2. Add `PUT` and `DELETE` data endpoints.
3. Refactor data endpoints to person endpoints. Example: _GET /v1/data/{id}_ to _GET /v1/person/{id}_.
4. Add endpoints for CRUD operations on rooms. Example: _GET /v1/room/{id}_. Rooms should have appropriate properties.

### Extra credit

- Make a rudimentary React app that uses the `node-api` as backend.

## References

### Troubleshooting

- If you have problems pushing, try `git push --no-verify`.

### Example of log output on start

```
$ npm run start-dev

> node-api@2.0.0 start-dev
> bash -c 'NODE_ENV=development nodemon app.js'

[nodemon] 2.0.20
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.* swagger.json
[nodemon] watching extensions: js,handlebars,scss,svg,png
[nodemon] starting `node app.js`
00:00:00.840Z  INFO node-api: Authentication initialized
00:00:00.931Z  INFO node-api: DATABASE: Connecting database... (package=@kth/mongo)
00:00:01.052Z  INFO node-api: Checking environment variables from .env.ini file.
00:00:01.053Z DEBUG node-api:    Environment variable 'API_KEYS_0' is missing, most likely there is a default value.
00:00:01.053Z DEBUG node-api:    Environment variable 'MONGODB_URI' is missing, most likely there is a default value.
00:00:01.053Z  INFO node-api: Checking environment variables completed.
(node:69329) [MONGOOSE] DeprecationWarning: Mongoose: the `strictQuery` option will be switched back to `false` by default in Mongoose 7. Use `mongoose.set('strictQuery', false);` if you want to prepare for this change. Or use `mongoose.set('strictQuery', true);` to suppress this warning.
(Use `node --trace-deprecation ...` to show where the warning was created)
00:00:01.054Z  INFO node-api: *** *************************
00:00:01.054Z  INFO node-api: *** SERVER STARTED
00:00:01.054Z  INFO node-api: *** using unsecure HTTP server
00:00:01.054Z  INFO node-api: *** Listening on port: 3001
00:00:01.055Z  INFO node-api: *** *************************
00:00:01.062Z  INFO node-api: DATABASE: Default connection established (package=@kth/mongo)
00:00:01.062Z  INFO node-api: AGENDA: Trigger Agenda initialization on mongoDb connection event
00:00:01.062Z  INFO node-api: AGENDA: Agenda is not yet initialized, continuing.
00:00:01.062Z  INFO node-api: AGENDA: Initializing a new Agenda instance.
00:00:01.064Z DEBUG node-api: DATABASE connected: localhost@node (package=@kth/mongo)
00:00:01.064Z DEBUG node-api: DATABASE driver version: 6.8.1 (package=@kth/mongo)
00:00:01.064Z  INFO node-api: MongoDB: connected
00:00:01.108Z  INFO node-api: AGENDA: Canceled 0 jobs
00:00:01.111Z  INFO node-api: AGENDA: Purged 0 jobs
00:00:01.111Z  INFO node-api: AGENDA: ready, configuring jobs...
00:00:01.128Z  INFO node-api: AGENDA: Agenda instance configured and running
00:00:01.130Z  INFO node-api: AGENDA: import: scheduled at Tue Jan 03 2023 06:20:00 GMT+0100 (Central European Standard Time)

```

## This part has been wrote by Amir:

to run the project after following the installation steps outlined above, ensure you rename `.env-keep` to `.env` for proper configuration.

### Models inside the project:

- `Room`: id, firstName, lastName
- `Person`: id, name, isBooked, relation

### some facts regarding models:

- You cannot add multiple rooms with same name.
- You cannot add a room that isBooked with an empty list of persons (relation).
- With The database architecture that I used; Room and Person are connected together and each room can have multiple persons. This means that you can put a list of person IDs inside rooms as the relation.

### things to mention:

- Two extra endpoints (getRooms & getPersons) have been added because I needed them to implement my idea in UI.
- I installed the cors package and used it inside the server.js because it was not possible to call API from UI due to CORS policy issues (I could change my browser settings but I decided to make the UI and API usable in different browser settings).
- Based on the suggested time frame, I tried my best first to understand the structure of the code, organize my mind, and finally implement the required assignments completely.
- I have added some unit tests required for API calls but if I had more time I would like to add more.
- If I had more time I was thinking of dockerizing UI and Backend inside a project file and using docker-compose to run them as two microservices (it is fun to do 🤓). This needed more than two hours time, so I decided to stick to the current version and focus on main functionalities.
- All the comments related to my ideas be found within the code.
- I was implementing the project with passion and I loved every parts of it 👨🏻‍💻.

Thanks for this exciting adventure; looking forward to contribute more in such projects 🚀
