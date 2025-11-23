/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller } from '@nestjs/common';
import { MlScoringService } from './ml-scoring-service.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TOPICS } from '../../../libs/constants/topics';

@Controller()
export class MlScoringServiceController {
  constructor(private readonly mlScoringServiceService: MlScoringService) {}

  @EventPattern(TOPICS.rulesEvaluated)
  async onRulesEvaluated(@Payload() message: any) {
    const event = message?.event ?? message;
    await this.mlScoringServiceService.scoreAndPublish(event);
  }
}
