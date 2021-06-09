FROM node:14
WORKDIR /home/node/app
COPY package.json ./
COPY ./build ./build
RUN npm install --only=production
EXPOSE 3000

ENV NODE_ENV=production
CMD ["node", "./build"]
# CMD npm start