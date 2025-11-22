import { Module } from '@nestjs/common';
import { RulesEngineServiceController } from './rules-engine-service.controller';
import { RulesEngineService } from './rules-engine-service.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_ANTIFRAUD',
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
