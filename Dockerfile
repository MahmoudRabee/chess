FROM  node:18-alpine3.14

RUN mkdir /home/app
COPY . /home/app
WORKDIR /home/app
RUN npm install

EXPOSE 9000
CMD npm run start
