FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy TypeScript configuration and source code
COPY tsconfig.json ./
COPY src ./src

# Build TypeScript
RUN npm run build

# Create uploads directory
RUN mkdir -p uploads

# Remove development dependencies
RUN npm prune --production

EXPOSE 3000

# Add wait-for-it script to wait for database
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

CMD ["/wait-for-it.sh", "postgres:5432", "--", "npm", "start"] 