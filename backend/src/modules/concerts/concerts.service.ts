import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Concert } from './concert.entity';
import { CreateConcertDto } from './dto/create-concert.dto';
import { ReservationsService } from '../reservations/reservations.service';

@Injectable()
export class ConcertsService {
  constructor(
    @InjectRepository(Concert)
    private concertRepository: Repository<Concert>,
    private reservationsService: ReservationsService,
  ) {}

  async createConcert(createConcertDto: CreateConcertDto): Promise<Concert> {
    const concert = this.concertRepository.create(createConcertDto);
    return await this.concertRepository.save(concert);
  }

  async getAllConcerts(): Promise<Concert[]> {
    return await this.concertRepository.find({
      relations: ['reservations'],
    });
  }

  async getConcert(id: string): Promise<Concert> {
    const concert = await this.concertRepository.findOne({
      where: { id },
      relations: ['reservations'],
    });
    if (!concert) {
      throw new NotFoundException('Concert not found');
    }
    return concert;
  }

  async deleteConcert(id: string): Promise<void> {
    const result = await this.concertRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Concert not found');
    }
  }
}
