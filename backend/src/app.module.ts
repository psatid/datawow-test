import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConcertsModule } from './concerts/concerts.module';
import { UsersModule } from './users/users.module';
import databaseConfig from './config/database.config';
import { Concert } from './concerts/concert.entity';
import { Reservation } from './concerts/reservation.entity';
import { Transaction } from './concerts/transaction.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        entities: [Concert, Reservation, Transaction],
        synchronize: false, // Disabled for safety
        migrations: ['dist/migrations/*.js'],
        migrationsRun: true, // Automatically run migrations on startup
      }),
      inject: [ConfigService],
    }),
    ConcertsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
