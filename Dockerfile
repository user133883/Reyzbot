FROM node:16

COPY . .

EXPOSE 8080
CMD [ "node", "reyz.js" ]
