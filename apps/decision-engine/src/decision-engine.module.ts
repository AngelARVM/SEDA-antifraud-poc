import { Module } from '@nestjs/common';
import { DecisionEngineServiceController } from './decision-engine.controller';
import { DecisionEngineService } from './decision-engine.service';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { KAFKA_NAME, kafkaClientOptions } from '../../../libs/constants';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.registerAsync([
      {
        name: KAFKA_NAME,
        useFactory: () => kafkaClientOptions('decision'),
      },
    ]),
  ],
  controllers: [DecisionEngineServiceController],
  providers: [DecisionEngineService],
})
export class DecisionEngineServiceModule {}
