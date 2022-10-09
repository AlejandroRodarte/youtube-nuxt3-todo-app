# stage 1: base image
FROM node:18 as base

# general labels (author email, image title/docker-hub-repo/github-repo and license)
LABEL org.opencontainers.image.authors alejandrorodarte1@gmail.com
LABEL org.opencontainers.image.title "Base image for a simple todo application made with Nuxt 3 as part of a YouTube course"
LABEL org.opencontainers.image.url https://hub.docker.com/repository/docker/rodarte/yc-nuxt3-todo-app-prod
LABEL org.opencontainers.image.source https://github.com/AlejandroRodarte/youtube-nuxt3-todo-app/tree/master/todo-nuxt3
LABEL org.opencontainers.image.licenses MIT

# project labels (node version and stage)
LABEL com.rodarte.yc.nuxt3.todoapp.nodeversion $NODE_VERSION
LABEL com.rodarte.yc.nuxt3.todoapp.stage base

# set image creation date and source commit build arguments
ARG CREATED_DATE=not-set
ARG SOURCE_COMMIT=not-set

# environment variables: node environment and nuxt port/host
ENV NODE_ENV production
ENV HOST 0.0.0.0
ENV PORT 3000

# install tini
RUN apt-get update \
    && apt-get install tini

# add node_modules binaries to PATH environment variable
ENV PATH /node/node_modules/.bin:$PATH

# mkdir node && cd node
WORKDIR /node

# /node owned by node user
RUN chown -R node:node .

# copy package-related files to /node (owned by node user)
COPY --chown=node:node package.json package-lock.json ./

# install prod dependencies
RUN npm config list \
    && npm ci --omit=dev \
    && npm cache clean --force

# document exposed port
EXPOSE 3000

ENTRYPOINT [ "/usr/bin/tini", "--" ]


# stage 2: base-dev image
FROM base as base-dev

# title label for this image
LABEL org.opencontainers.image.title "Base development image for a simple todo application made with Nuxt 3 as part of a YouTube course"

# stage label for this image
LABEL com.rodarte.yc.nuxt3.todoapp.stage base-dev

# install development dependencies
RUN npm config list \
    && npm ci --include=dev \
    && nuxt prepare \
    && npm cache clean --force


# stage 3: dev image
FROM base-dev as dev

# title label for this image
LABEL org.opencontainers.image.title "Development image for a simple todo application made with Nuxt 3 as part of a YouTube course"

# stage label for this image
LABEL com.rodarte.yc.nuxt3.todoapp.stage dev

# override node environment to development and set hmr port
ENV NODE_ENV development
ENV HMR_PORT 3001

# mkdir /node/app & workdir /node/app
WORKDIR /node/app

# /node/app/.nuxt and /node/node_module/.vite owned by node user (required by nuxt and vite)
RUN mkdir /node/app/.nuxt \
    && mkdir /node/node_modules/.vite \
    && chown -R node:node /node/app/.nuxt \
    && chown -R node:node /node/node_modules/.vite

# change to node user
USER node

# document hmr port
EXPOSE 3001

# run the nuxt development server
CMD [ "nuxt", "dev" ]


# stage 4: source image
FROM base-dev as source

# title label for this image
LABEL org.opencontainers.image.title "Source image for a simple todo application made with Nuxt 3 as part of a YouTube course"

# stage label for this image
LABEL com.rodarte.yc.nuxt3.todoapp.stage source

# copy source code
COPY --chown=node:node . .


# stage 6: build image
FROM source as build

# title label for this image
LABEL org.opencontainers.image.title "Build image for a simple todo application made with Nuxt 3 as part of a YouTube course"

# stage label for this image
LABEL com.rodarte.yc.nuxt3.todoapp.stage build

# run nuxt build to generate production-ready server at .output/ dir
RUN nuxt build


# stage 7: prod image
FROM base as prod

# set labels for image creation date, commit hash, and image title
LABEL org.opencontainers.image.created $CREATED_DATE
LABEL org.opencontainers.image.revision $SOURCE_COMMIT
LABEL org.opencontainers.image.title "Production image for a simple todo application made with Nuxt 3 as part of a YouTube course"

# stage label for this image
LABEL com.rodarte.yc.nuxt3.todoapp.stage prod

# from build stage, copy /node/.output files (nuxt production-ready server code) to /node/.output in prod stage
COPY --chown=node:node --from=build /node/.output ./.output

# change to node user
USER node

# run server
CMD [ "node", "/node/.output/server/index.mjs" ]
