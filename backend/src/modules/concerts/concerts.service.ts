import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Concert } from './concert.entity';
import { CreateConcertDto } from './dto/create-concert.dto';

@Injectable()
export class ConcertsService {
  constructor(
    @InjectRepository(Concert)
    private concertRepository: Repository<Concert>,
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

  async deleteConcert(id: string): Promise<void> {
    const concert = await this.concertRepository.findOne({
      where: { id },
      relations: ['reservations'],
    });

    if (!concert) {
      throw new NotFoundException({
        code: 'CONCERT_NOT_FOUND',
        message: 'Concert not found',
      });
    }

    if (concert.reservations && concert.reservations.length > 0) {
      throw new BadRequestException({
        code: 'CONCERT_HAS_RESERVATIONS',
        message: 'Cannot delete concert with existing reservations',
      });
    }

    await this.concertRepository.delete(id);
  }
}
