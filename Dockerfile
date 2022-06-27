FROM  node:18-alpine3.14
MAINTAINER Mahmoud Rabie <mrabee63@gmail.com>

RUN mkdir /home/app
COPY . /home/app
WORKDIR /home/app
RUN npm install

EXPOSE 9000
# CMD python3 server.py
CMD npm run start
