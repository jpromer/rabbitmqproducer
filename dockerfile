
FROM node:12-alpine3.10

RUN mkdir /app
WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY . /app

ENV NODE_ENV QA
ENV PORT 3004

EXPOSE 3004

CMD [ "npm", "start" ]