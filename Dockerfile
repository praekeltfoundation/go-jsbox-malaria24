FROM praekeltfoundation/vxsandbox
MAINTAINER Praekelt Foundation <dev@praekeltfoundation.org>

# Install nodejs dependencies
COPY package.json /app/package.json
WORKDIR /app
RUN apt-get-install.sh curl

RUN curl -sL https://deb.nodesource.com/setup_10.x -o nodesource_setup.sh && \
	    bash nodesource_setup.sh && \
	    apt-get-install.sh nodejs

RUN npm install --production && \
	    apt-get-purge.sh npm

# Workaround for sandboxed application losing context - manually install the
# *dependencies* globally.
# See https://github.com/praekelt/vumi-sandbox/issues/15
RUN mv ./node_modules /usr/local/lib/

# Copy in the app Javascript
COPY go-*.js /app/

RUN pip install raven==6.10.0
