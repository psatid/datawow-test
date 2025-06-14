import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConcertsController } from './concerts.controller';
import { ConcertsService } from './concerts.service';
import { Concert } from './concert.entity';
import { ReservationsModule } from '../reservations/reservations.module';

@Module({
  imports: [TypeOrmModule.forFeature([Concert]), ReservationsModule],
  controllers: [ConcertsController],
  providers: [ConcertsService],
})
export class ConcertsModule {}
