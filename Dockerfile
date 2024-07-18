FROM node:latest

WORKDIR /usr/app
COPY ./ /usr/app
RUN npm install

CMD ["node", "takes.js"]
CMD ["node", "ads.js"]