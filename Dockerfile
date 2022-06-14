FROM node:16

RUN apt-get update && \
    apt-get install -y \ 
    ffmpeg \
    chromium

COPY package.json .

RUN npm install && npm install wwebjs-mongo && npm install mongoose && npm i github:jtourisNS/whatsapp-web.js#RemoteAuth && npm install yt-search

COPY . .

EXPOSE 8080
CMD [ "node", "reyz.js" ]
