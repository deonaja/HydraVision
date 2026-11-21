FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci \
    && sha256sum package-lock.json | awk '{print $1}' > node_modules/.package-lock.sha256

COPY . .

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN sed -i 's/\r$//' /usr/local/bin/docker-entrypoint.sh \
    && chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 5173

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
