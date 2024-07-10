FROM node:20.13.1-alpine
# Setting new folder in docker container where our files will be copied
# Setting user and group to node 
RUN mkdir -p /node/app/node_modules && chown -R node:node /node/app
#Switching to work dir
WORKDIR /node/app
#Copy just package jsons first to ensure correct dependency installations
COPY ./package.json ./

# Install dependencies in the runtime image
RUN npm install

#Copy all other files from our local machine into the new folder in docker
COPY . .

# Create Documentations
RUN npm run doc

#Set User privileage using the application 
USER node

#Expose port that we can listen to
EXPOSE ${NODE_PORT}
#RUN
CMD [ "npm","run", "server" ]