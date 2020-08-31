# trace-app

### Dependencies 
Docker [Install docker](https://docs.docker.com/get-docker/) 

Docker compose [Install docker compose](https://docs.docker.com/compose/install/)

### Installation

Clone this project. Then, duplicate .env files in api and front directory. Finally, start docker container.

You can run this commands to install the project : 

```
git clone git@github.com:Anthony-Lardy/trace-app.git TraceApp
cd TraceApp
cp ./api/.env.example ./api/.env
docker volume create --name=mongodata
docker-compose build
docker-compose run api npm install
docker-compose run front npm install
docker-compose up -d
```

### Access app
Start docker: `docker-compose start`

To access at this app, open your brownser and open this url : `http://localhost:4200`

### Postman
A postman collection is available in this directory : ./postman.collection.json

### Mongodb
User : root

Password: rootpwd

url: http://localhost:27017

### Links
Api documentation: `http://localhost:4400/docs/`
