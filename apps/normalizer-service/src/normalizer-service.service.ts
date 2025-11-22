/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/require-await */
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { TOPICS } from '../../../libs/constants/topics';

@Injectable()
export class NormalizerServiceService implements OnModuleInit {
  private readonly logger = new Logger(NormalizerServiceService.name);

  constructor(
    @Inject('KAFKA_ANTIFRAUD')
    private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    try {
      await this.kafkaClient.connect();
      this.logger.log('Connected Kafka producer');
    } catch (err) {
      this.logger.error(
        'Could not connect Kafka producer',
        (err as Error).message,
      );
    }
  }

  // Negocio: "normalizar" = asegurar tipos/formatos y agregar derivados útiles para antifraude.
  async normalizeAndForward(raw: any) {
    const amountNum = Number(raw?.amount ?? 0);

    const normalized = {
      ...raw,
      amount: amountNum,
      currency: String(raw?.currency ?? '').toUpperCase(),
      country: String(raw?.country ?? '').toUpperCase(),
      channel: String(raw?.channel ?? '').toUpperCase(),
      paymentMethod: String(raw?.paymentMethod ?? '').toUpperCase(),

      // features derivadas rápidas
      isHighAmount: amountNum > 1000,
      amountBucket:
        amountNum < 100 ? 'LOW' : amountNum < 1000 ? 'MEDIUM' : 'HIGH',

      normalizedAt: new Date().toISOString(),
    };

    this.logger.log(
      `Normalized tx=${normalized.transactionId} corrId=${normalized.correlationId}`,
    );

    this.kafkaClient.emit(TOPICS.normalized, normalized);
  }
}
