ARG NODE_VERSION=10
FROM node:$NODE_VERSION

# External user id
ARG uid

ENV GOSU_VERSION 1.10

# Install system packages
RUN apt-get update \
 && apt-get -y -qq --no-install-recommends install \
        mc

RUN npm i npm@latest -g
RUN npm install --global @angular/cli forever

RUN dpkgArch="$(dpkg --print-architecture | awk -F- '{ print $NF }')"; \
    wget -O /usr/local/bin/gosu "https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-$dpkgArch"; \
    wget -O /usr/local/bin/gosu.asc "https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-$dpkgArch.asc"; \
    \
# verify the signature
    export GNUPGHOME="$(mktemp -d)"; \
    gpg --keyserver ha.pool.sks-keyservers.net --recv-keys B42F6819007F00F88E364FD4036A9C25BF357DD4; \
    gpg --batch --verify /usr/local/bin/gosu.asc /usr/local/bin/gosu; \
    rm -r "$GNUPGHOME" /usr/local/bin/gosu.asc; \
    \
    chmod +sx /usr/local/bin/gosu; \
# verify that the binary works
    gosu nobody true;

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +sx /usr/local/bin/entrypoint.sh
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

RUN userdel node
RUN useradd -u ${uid} -m user
RUN echo "root:root" | chpasswd
USER user