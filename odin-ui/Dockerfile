
FROM node:14.19.1
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
RUN npm i -g serve
CMD ["serve","-s","build"]
EXPOSE 3000
