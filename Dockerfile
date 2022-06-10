FROM node:16

COPY . .

EXPOSE 8080
CMD [ "node", "server.js" ]
