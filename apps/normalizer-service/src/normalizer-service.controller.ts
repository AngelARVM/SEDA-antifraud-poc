/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller } from '@nestjs/common';
import { NormalizerServiceService } from './normalizer-service.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TOPICS } from '../../../libs/constants/topics';

@Controller()
export class NormalizerServiceController {
  constructor(private readonly normalizerService: NormalizerServiceService) {}

  @EventPattern(TOPICS.incoming)
  async handleIncomming(@Payload() message: any) {
    console.log({ message });
    const event = message?.value ?? message;

    await this.normalizerService.normalizeAndForward(event);
  }
}
