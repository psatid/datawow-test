import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Concert } from './concert.entity';
import { CreateConcertDto } from './dto/create-concert.dto';

@Injectable()
export class ConcertsService {
  constructor(
    @InjectRepository(Concert)
    private concertsRepository: Repository<Concert>,
  ) {}

  create(createConcertDto: CreateConcertDto): Promise<Concert> {
    const concert = this.concertsRepository.create(createConcertDto);
    return this.concertsRepository.save(concert);
  }
}
