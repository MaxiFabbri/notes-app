FROM node:22.13.0-bookworm-slim

WORKDIR /app

# Install the locked production dependencies before copying application code.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY src ./src
COPY migrations ./migrations

USER node
EXPOSE 8080

# Compose provides environment variables, so no .env file is copied into the image.
# Apply pending migrations, then replace the shell with the API process.
CMD ["sh", "-c", "node src/utils/migrate.util.js && exec node src/server.js"]
