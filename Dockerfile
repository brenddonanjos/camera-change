# Use a Node.js base image
FROM node:18

# Create and set the working directory
WORKDIR /app

# Copy the rest of the application code to the working directory
COPY ./backend .

# Install dependencies
RUN yarn install

# Expose the application port
EXPOSE 3000