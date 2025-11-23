/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuditEventEntity } from './entities/audit-event.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);
  constructor(
    @InjectRepository(AuditEventEntity)
    private readonly auditEventRepo: Repository<AuditEventEntity>,
  ) {}

  async storeEvent(event: any) {
    const { transactionId, correlationId, decision, modelScore, riskScore } =
      event;
    const entity = this.auditEventRepo.create({
      transactionId,
      correlationId,
      decision,
      modelScore,
      riskScore,
      payload: event,
    });

    const auditEvent = await this.auditEventRepo.save(entity);

    return {
      id: auditEvent.id,
      transactionId: auditEvent.transactionId,
      correlationId: auditEvent.correlationId,
    };
  }

  findByTransactionId(transactionId: string) {
    return this.auditEventRepo.find({
      where: { transactionId },
      order: {
        createdAt: 'ASC',
      },
    });
  }

  list(limit = 50, offset = 0) {
    return this.auditEventRepo.find({
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });
  }
}
