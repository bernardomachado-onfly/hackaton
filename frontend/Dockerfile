FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_API_URL=http://localhost:3001
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ─── Runtime (nginx) ─────────────────────────────────────────────────────────

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Redireciona todas as rotas para index.html (SPA)
RUN echo 'server { \
  listen 80; \
  location /health { \
    access_log off; \
    return 200 "ok\n"; \
    add_header Content-Type text/plain; \
  } \
  location / { \
    root /usr/share/nginx/html; \
    try_files $uri $uri/ /index.html; \
  } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
