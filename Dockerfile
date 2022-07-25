# stage 1 build the vuejs application
FROM node:lts-alpine as build-stage
# set the working directory
WORKDIR /usr/src/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY [ "package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./" ]
# Install all the dependecies
RUN npm install
# Copy all the dependencies
COPY . .

# ARGUMENTS FOR ENVIRONMENT VARIABLE
ARG VITE_ACCOUNT_URL
ARG VITE_PROJECT_APP_URL

# ENVIRONMENT VARIABLE
ENV VITE_ACCOUNT_URL $VITE_ACCOUNT_URL
ENV VITE_PROJECT_APP_URL $VITE_PROJECT_APP_URL

# Build the files
RUN npm run build

# stage 2 production stage
FROM nginx:stable-alpine as production
# Copy the dist file from the working directory
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html
# Copy the configuration file and set it to nginx
COPY ./nginx.conf /etc/nginx/nginx.conf
# Expose the port 8084
EXPOSE 8084 84
# Run the nginx server
CMD ["nginx", "-g", "daemon off;"]