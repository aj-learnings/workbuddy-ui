# Use an official Node.js runtime as a parent image
FROM node:20 AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Angular app
RUN npm run build

# Use an official Nginx image to serve the Angular app
FROM nginx:alpine

# Copy the built Angular app from the previous stage to the Nginx html directory
COPY --from=build /app/dist/workbuddy-ui/browser /usr/share/nginx/html

# Copy the script file
COPY start.sh start.sh

# Set environment variables for MongoDB and Redis
ENV API_URL=http://localhost:9401

# Expose port 80
EXPOSE 80

RUN chmod +x start.sh

ENTRYPOINT ["sh", "./start.sh"]
