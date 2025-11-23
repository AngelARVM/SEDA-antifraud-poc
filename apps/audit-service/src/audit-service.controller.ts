/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// apps/audit-service/src/audit-service.controller.ts
import { Controller, Logger } from '@nestjs/common';
import { AuditService } from './audit-service.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TOPICS } from '../../../libs/constants/topics';

@Controller()
export class AuditServiceController {
  private readonly logger = new Logger(AuditServiceController.name);

  constructor(private readonly auditService: AuditService) {}

  @EventPattern(TOPICS.decided)
  async handleDecide(@Payload() message: any) {
    const event = message?.value ?? message?.event ?? message;
    this.logger.log(
      `Consuming ${TOPICS.decided} tx=${event?.transactionId} corrId=${event?.correlationId}`,
    );
    await this.auditService.storeEvent(event);
  }
}
