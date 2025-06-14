import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Concert } from '../concerts/concert.entity';
import { TransactionsModule } from '../transactions/transactions.module';
import { Reservation } from './reservation.entity';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, Concert]),
    TransactionsModule,
  ],
  providers: [ReservationsService],
  controllers: [ReservationsController],
  exports: [ReservationsService],
})
export class ReservationsModule {}
