FROM node

RUN apt-get update && apt-get install -y python3 python3-pip

RUN pip3 install awscli --break-system-packages

WORKDIR /backend

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

CMD [ "npm", "run", "dev" ]