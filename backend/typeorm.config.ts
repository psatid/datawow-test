import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { Concert } from './src/concerts/concert.entity';
import { Reservation } from './src/concerts/reservation.entity';
import { Transaction } from './src/concerts/transaction.entity';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get('DATABASE_HOST'),
  port: configService.get('DATABASE_PORT'),
  username: configService.get('DATABASE_USERNAME'),
  password: configService.get('DATABASE_PASSWORD'),
  database: configService.get('DATABASE_NAME'),
  entities: [Concert, Reservation, Transaction],
  migrations: ['src/migrations/*.ts'],
});
