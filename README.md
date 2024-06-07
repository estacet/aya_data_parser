## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation and running the app

Go to root folder of the app.
1) Install all required packages
```
npm install
```
2) Run docker container:
```
docker-compose up
```
5) Start nodejs app:
```
npm run start
```
The data from ./init_db/data.txt will be parsed to object and insert to database on application init.


## QUESTIONS

1. **How to change the code to support different file versions?**

We can create separate parsers for different file versions and implement a strategy pattern to choose the right parser.

2. **How the import system will change if data on exchange rates disappears from the file, and it will need to be received asynchronously (via API)?**

We will have to check if rates list is available after dividing data from the file into employees and rates text parts
(I divide the data in *splitArrayByInstances()* method in ParserService). If rates array remains empty we can make an API call 
to fetch the exchange rates before processing the donations.

3. **In the future the client may want to import files via the web interface, how can the system be modified to allow this?**

We can create an endpoint to handle file uploads. 
This endpoint will receive the file from the client and save it to file storage (cloud, server file system, etc.).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License

Nest is [MIT licensed](LICENSE).