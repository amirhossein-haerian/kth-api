#
# A daily updated common KTH Alpine based image.
# Versions: https://hub.docker.com/r/kthse/kth-nodejs/tags
#
FROM kthse/kth-nodejs:16.0.0
LABEL maintainer="KTH Webb <web-developers@kth.se>"

#
# During integration-tests running with docker-compose in the pipeline
# this application might have to wait for other services to be ready
# before it is started itself. This can be done with the following
# script and its environment variables WAIT_HOSTS and WAIT_HOSTS_TIMEOUT.
#
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.3/wait /wait
RUN chmod +x /wait

#
# Put the application into a directory in the root.
# This will prevent file polution and possible overwriting of files.
#
WORKDIR /application
ENV NODE_PATH /application

#
# Set timezone
#
ENV TZ Europe/Stockholm

#
# Copy the files needed to install the production dependencies
# and install them using npm.
#
# Remember to only install production dependencies.
#
COPY ["package.json", "package.json"]
COPY ["package-lock.json", "package-lock.json"]

RUN chown -R node:node /application

USER node

RUN npm pkg delete scripts.prepare && \
    npm ci --production --no-optional --unsafe-perm && \
    npm audit fix --only=prod

#
# Copy the files needed for the application to run.
#
COPY ["config", "config"]
COPY ["server", "server"]
#
COPY ["app.js", "app.js"]
COPY ["swagger.json", "swagger.json"]
COPY [".env.ini", ".env.ini"]

#
# Port that the application will expose.
#
EXPOSE 3001

#
# The command that is executed when an instance of this image is run.
#
CMD ["npm", "start"]
