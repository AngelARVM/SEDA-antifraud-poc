import { Module } from '@nestjs/common';
import { RulesEngineServiceController } from './rules-engine.controller';
import { RulesEngineService } from './rules-engine.service';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { KAFKA_NAME, kafkaClientOptions } from '../../../libs/constants';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.registerAsync([
      {
        name: KAFKA_NAME,
        useFactory: () => kafkaClientOptions('rules'),
      },
    ]),
  ],
  controllers: [RulesEngineServiceController],
  providers: [RulesEngineService],
})
export class RulesEngineServiceModule {}
