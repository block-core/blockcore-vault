FROM node:14
WORKDIR /home/node/app
COPY package.json ./
COPY ./build ./build
# Is this really needed? Verify!
RUN npm install --only=production
RUN npm install -g pm2
EXPOSE 3000
ENV NODE_ENV=production
CMD ["pm2", "start", "app-prd.json", "--env production"]
# CMD npm start