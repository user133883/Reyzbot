FROM node:16

RUN npm install

COPY . .

EXPOSE 8080
CMD [ "node", "reyz.js" ]
