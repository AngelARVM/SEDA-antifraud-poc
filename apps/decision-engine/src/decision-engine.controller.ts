/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller } from '@nestjs/common';
import { DecisionEngineService } from './decision-engine.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TOPICS } from '../../../libs/constants/topics';

@Controller()
export class DecisionEngineServiceController {
  constructor(
    private readonly decisionEngineServiceService: DecisionEngineService,
  ) {}

  @EventPattern(TOPICS.scored)
  async onScored(@Payload() message: any) {
    const event = message?.event ?? message;

    this.decisionEngineServiceService.decide(event);
  }
}
