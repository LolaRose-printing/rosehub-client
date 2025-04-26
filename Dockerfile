# Install the application dependencies in a full UBI Node docker image
FROM registry.access.redhat.com/ubi8/nodejs-22:latest AS base

# Elevate privileges to run npm
# USER root

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm ci

# Copy the dependencies into a minimal Node.js image
FROM registry.access.redhat.com/ubi8/nodejs-22-minimal:latest AS final

# copy the app dependencies
COPY --from=base /opt/app-root/src/node_modules /opt/app-root/src/node_modules
COPY . /opt/app-root/src

# Disable Next telemetry
ENV NEXT_TELEMETRY_DISABLED 1

# Elevate privileges to run npm
USER root

# Build the pacckages in minimal image
RUN npm run build

# Restore default user privileges
USER 1001

# Run application in 'development' mode
ENV NODE_ENV production

# Listen on port 3001
ENV PORT 3001

# Container exposes port 3001
EXPOSE 3001

# Start node process
CMD ["npm", "start"]
