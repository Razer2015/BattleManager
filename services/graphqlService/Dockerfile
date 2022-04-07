FROM node:lts-alpine3.15
WORKDIR /app

# COPY package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm ci --only=production

# generated prisma files
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# COPY
COPY . .

# Run and expose the server on port 4000
EXPOSE 4000

# A command to start the server
CMD npm run start-prod
