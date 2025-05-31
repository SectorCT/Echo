FROM node:18-alpine

WORKDIR /app

# Install netcat for wait-for-it script
RUN apk add --no-cache netcat-openbsd

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

# Create startup script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

CMD ["/app/start.sh"] 