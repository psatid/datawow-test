import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { Concert } from './src/modules/concerts/concert.entity';
import { Reservation } from './src/modules/reservations/reservation.entity';
import { Transaction } from './src/modules/transactions/transaction.entity';

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
