# Use the official Node.js image
FROM node:20

# Set the working directory in the container
WORKDIR /src

# Copy package.json and package-lock.json
COPY package*.json ./

# Install the dependencies
COPY package*.json ./
RUN npm install
COPY . .

# Expose the port your app will run on (5000 in this case)
EXPOSE 5000

# Set environment variables (if any)
ENV PORT=5000
ENV MONGO_URI=mongodb+srv://sanketrathod7420:XDeQeFXCtJivkq0O@backendsystemqqueue.jhxkh.mongodb.net/?retryWrites=true&w=majority&appName=backendSystemqQueue
ENV JWT_SECRET=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
ENV RABBITMQ_URI=amqp://localhost

# Command to run your app
CMD ["node", "src/server.js"]
