FROM node:14
WORKDIR /home/node/app
COPY package.json ./
COPY ./build ./build
# Is this really needed? Verify!
RUN npm install --only=production
EXPOSE 3000
ENV NODE_ENV=production
CMD ["npm", "start", "--env production"]
# CMD npm start