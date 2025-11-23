/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { TOPICS } from '../../../libs/constants/topics';
import { KAFKA_CONST } from '../../../libs/constants/constants';

@Injectable()
export class MlScoringService implements OnModuleInit {
  private logger = new Logger(MlScoringService.name);

  constructor(
    @Inject(KAFKA_CONST.name)
    private readonly kafka: ClientKafka,
  ) {}

  async onModuleInit() {
    try {
      await this.kafka.connect();
      this.logger.log('Connected Kafka producer');
    } catch (err) {
      this.logger.error(
        'Could not connect Kafka producer',
        (err as Error).message,
      );
    }
  }

  async scoreAndPublish(evaluated: any) {
    const base = Number(evaluated?.riskScore ?? 0);
    const amount = Number(evaluated?.amount ?? 0);
    const isHighAmount = amount >= 2000000 ? 10 : 0;
    const countryPenalty = [
      'RU',
      'BY',
      'VE',
      'CU',
      'IR',
      'SY',
      'KP',
      'MM',
      'AF',
      'SD',
      'SS',
    ].includes(String(evaluated?.country ?? '').toUpperCase())
      ? 15
      : 0;

    const modelScore = Math.min(100, base + isHighAmount + countryPenalty);

    const out = {
      ...evaluated,
      modelScore,
      modelVersion: 'demo-0.1',
      scoredAt: new Date().toISOString(),
      state: 'ML_SCORED',
    };

    this.logger.log(
      `ML scored tx=${out.transactionId} corrId=${out.correlationId} modelScore=${modelScore}`,
    );

    this.kafka.emit(TOPICS.scored, out);
  }
}
