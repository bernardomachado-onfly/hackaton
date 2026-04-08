FROM nginx:alpine

COPY index.html /usr/share/nginx/html/index.html

RUN echo 'server { \
  listen 80; \
  location /health { \
    access_log off; \
    return 200 "ok\n"; \
    add_header Content-Type text/plain; \
  } \
  location / { \
    root /usr/share/nginx/html; \
    index index.html; \
  } \
}' > /etc/nginx/conf.d/default.conf
