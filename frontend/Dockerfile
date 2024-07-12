FROM node:alpine

# Set the working directory.
WORKDIR /next/app

# Copy the package.json and package-lock.json files.
COPY ./package.json ./

# Install dependencies.
RUN npm install

# Copy the rest of the application code.
COPY . .

# Expose the port.
EXPOSE 3000

# Run the application.
CMD [ "npm","run", "dev" ]