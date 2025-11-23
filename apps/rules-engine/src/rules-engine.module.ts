import { Module } from '@nestjs/common';
import { RulesEngineServiceController } from './rules-engine.controller';
import { RulesEngineService } from './rules-engine.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KAFKA_CONST } from '../../../libs/constants/constants';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.registerAsync([
      {
        name: KAFKA_CONST.name,
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'rules-engine-producer-client',
              brokers: [config.get('KAFKA_BROKER') || 'kafka:9092'],
            },
          },
        }),
      },
    ]),
  ],
  controllers: [RulesEngineServiceController],
  providers: [RulesEngineService],
})
export class RulesEngineServiceModule {}
