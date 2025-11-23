import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { randomUUID } from 'crypto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TOPICS } from '../../../libs/constants/topics';
import { KAFKA_CONST } from '../../../libs/constants/constants';

@Injectable()
export class ApiGatewayService implements OnModuleInit {
  constructor(
    @Inject(KAFKA_CONST.name)
    private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  createTransaction(dto: CreateTransactionDto) {
    const transactionId = randomUUID();
    const correlationId = randomUUID();

    const payload = {
      transactionId,
      correlationId,
      ...dto,
      createdAt: dto.createdAt ?? new Date().toISOString(),
    };

    this.kafkaClient.emit(TOPICS.incoming, payload);

    return {
      transactionId,
      correlationId,
      status: 'RECEIVED',
      message: 'Transaction received and sent to antifraud pipeline',
    };
  }
}
