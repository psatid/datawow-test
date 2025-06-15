import { TransactionType } from './transaction.entity';

export class TransactionRespones {
  id: string;
  date: string;
  userEmail: string;
  type: TransactionType;
  concertName: string;
}
