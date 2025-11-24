import { Module } from '@nestjs/common';
import { MlScoringServiceController } from './ml-scoring-service.controller';
import { MlScoringService } from './ml-scoring-service.service';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { KAFKA_NAME, kafkaClientOptions } from '../../../libs/constants';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.registerAsync([
      {
        name: KAFKA_NAME,
        useFactory: () => kafkaClientOptions('ml'),
      },
    ]),
  ],
  controllers: [MlScoringServiceController],
  providers: [MlScoringService],
})
export class MlScoringServiceModule {}
