# ---------- Build Stage ----------
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ---------- Runtime Stage ----------
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Optional: custom nginx config later
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]