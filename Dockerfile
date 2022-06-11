FROM node:16

RUN apt-get update && apt-get install -y \ ffmpeg

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8080
CMD [ "node", "reyz.js" ]
