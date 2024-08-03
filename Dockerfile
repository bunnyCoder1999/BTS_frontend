ARG NODE_VERSION=20.16.0
FROM node:${NODE_VERSION}-alpine
# Use production node environment by default.
WORKDIR /frontend
# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
COPY ./package*.json .
RUN npm install
COPY . .
EXPOSE 5173
CMD npm run dev
