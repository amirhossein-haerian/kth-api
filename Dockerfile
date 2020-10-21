#
# A daily updated common KTH Alpine based image.
# Versions: https://hub.docker.com/r/kthse/kth-nodejs/tags
#
FROM kthse/kth-nodejs:12.0.0

#
# Put the application into a directory in the root.
# This will prevent file polution and possible overwriting of files.
#
WORKDIR /application
ENV NODE_PATH /application

#
# Copy the files needed to install the production dependencies
# and install them using the script docker.
#
# Remember to only install production dependencies.
#
COPY ["package-lock.json", "package-lock.json"]
COPY ["package.json", "package.json"]
RUN apk stats && \
    apk add --no-cache bash && \
    apk add --no-cache --virtual .gyp-dependencies python make g++ util-linux && \
    npm run docker && \
    apk del .gyp-dependencies && \
    apk stats

#
# Copy the files needed for the application to run.
#
COPY ["config", "config"]
COPY ["app.js", "app.js"]
COPY ["swagger.json", "swagger.json"]
COPY ["server", "server"]

#
# Set timezone
#
ENV TZ Europe/Stockholm

#
# Port that the application will expose.
#
EXPOSE 3001

#
# The command that is executed when an instance of this image is run.
#
CMD ["node", "app.js"]
