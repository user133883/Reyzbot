FROM node:16

RUN apt install ffmpeg

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8080
CMD [ "node", "reyz.js" ]
