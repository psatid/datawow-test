import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConcertsController } from './concerts.controller';
import { ConcertsService } from './concerts.service';
import { Concert } from './concert.entity';
import { Reservation } from './reservation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Concert, Reservation])],
  controllers: [ConcertsController],
  providers: [ConcertsService],
})
export class ConcertsModule {}
