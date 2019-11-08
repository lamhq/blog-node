# Use an official Node runtime as a parent image
FROM node:13.1.0-alpine

# Environment variables for database
ENV DB_NAME ci_dev
ENV DB_HOST 52.63.193.52
ENV DB_URI mongodb://${DB_HOST}/${DB_NAME}

# Environment variables for email
ENV SMTP_HOST 'smtp.gmail.com'
ENV SMTP_PORT 465
ENV SMTP_USER 'noreply.careinterchange@gmail.com'
ENV SMTP_PWD '47pXMPdxkQ2JfYoo9zWZHv00'

# Other environment variables
ENV NODE_ENV 'production'
ENV PORT 3000
ENV WEB_URL http://localhost:3001
ENV SENTRY_DNS 'https://1f4bf702246d45d28e4f0d24d17832ca:0679e0a6c0804c19924078f98954f638@sentry.io/264486'
ENV MONGODB_DEBUG false
ENV DEBUG '*,-express:*,-morgan,-send,-body-parser:*'

# Make port 3000 available to the world outside this container
EXPOSE ${PORT}

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
ADD . /app

# Install dependencies
RUN npm install

# Launch the container
CMD ["npm", "run", "start-prod"]
