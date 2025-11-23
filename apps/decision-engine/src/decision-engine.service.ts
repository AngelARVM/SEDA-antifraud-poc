/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { DecisionEnum } from './types/decision.enum';
import { TOPICS } from '../../../libs/constants/topics';
import { KAFKA_CONST } from '../../../libs/constants/constants';

@Injectable()
export class DecisionEngineService implements OnModuleInit {
  private readonly logger = new Logger(DecisionEngineService.name);
  constructor(
    @Inject(KAFKA_CONST.name)
    private readonly kafka: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafka
      .connect()
      .catch((err) => this.logger.error('Kafka connect error', err?.message));
  }

  decide(scored: any) {
    const score = Number(scored?.modelScore ?? 0);

    let decision: DecisionEnum;
    if (score >= 70) decision = DecisionEnum.REJECT;
    else if (score >= 40) decision = DecisionEnum.REVIEW;
    else decision = DecisionEnum.APPROVE;

    const result = {
      ...scored,
      decision,
      decidedAt: new Date().toISOString(),
      state: 'DECIDED',
    };

    this.logger.log(
      `Decision tx=${result.transactionId} corrId=${result.correlationId} score=${score} => ${decision}`,
    );

    this.kafka.emit(TOPICS.decided, result);
  }
}
