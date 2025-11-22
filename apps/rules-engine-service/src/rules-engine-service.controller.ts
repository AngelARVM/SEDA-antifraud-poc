/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller } from '@nestjs/common';
import { RulesEngineService } from './rules-engine-service.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TOPICS } from '../../../libs/constants/topics';

@Controller()
export class RulesEngineServiceController {
  constructor(private readonly rulesEngineService: RulesEngineService) {}

  @EventPattern(TOPICS.normalized)
  rules(@Payload() message: any) {
    const event = message?.event ?? message;
    this.rulesEngineService.evaluateAndForward(event);
  }
}
