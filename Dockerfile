FROM praekeltfoundation/vxsandbox:node_4.x
MAINTAINER Praekelt Foundation <dev@praekeltfoundation.org>

# Install nodejs dependencies
COPY package.json /app/package.json
WORKDIR /app
RUN npm install --production

# Workaround for sandboxed application losing context - manually install the
# *dependencies* globally.
# See https://github.com/praekelt/vumi-sandbox/issues/15
RUN mv ./node_modules /usr/local/lib/

# Copy in the app Javascript
COPY go-*.js /app/

RUN pip install raven==3.5.2
