FROM node:slim

USER node

RUN mkdir -p /home/node/app
WORKDIR /home/node/app

COPY --chown=node:node . .

RUN npm install

EXPOSE 3001
EXPOSE 3000
CMD [ "npm", "start" ]