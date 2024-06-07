import { DataSource } from 'typeorm';
import { Department, Donation, Employee, Rate, Statement } from './entities';

export const AppDataSource = new DataSource({
  //TODO: add config for env variables
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'postgres',
  password: 'pass',
  database: 'aya_db',
  entities: [Employee, Department, Statement, Donation, Rate],
  synchronize: false,
  logging: true,
});

AppDataSource.initialize()
  .then(() => {
    console.log('DataSource initialized.');
  })
  .catch((err) => {
    console.error('Error during DataSource initialization: ', err);
  });
