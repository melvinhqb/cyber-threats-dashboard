FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
# --host est nécessaire pour que Vite soit accessible depuis l'extérieur du conteneur
CMD ["npm", "run", "dev", "--", "--host"]