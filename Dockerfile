FROM node:16

RUN node reyz.js

COPY . .

EXPOSE 8080
CMD [ "node", "server.js" ]
