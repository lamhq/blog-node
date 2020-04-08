# Use an official Node runtime as a parent image
FROM node:12.16.1-alpine

# Make port 3000 available to the world outside this container
EXPOSE ${PORT}

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
ADD . /app

# Install dependencies
RUN yarn

# Launch the container
CMD ["npm", "run", "start-prod"]
