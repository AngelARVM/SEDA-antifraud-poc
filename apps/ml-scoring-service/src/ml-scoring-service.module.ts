import { Module } from '@nestjs/common';
import { MlScoringServiceController } from './ml-scoring-service.controller';
import { MlScoringService } from './ml-scoring-service.service';
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
              clientId: 'cl-scoring-producer-client',
              brokers: [config.get<string>('KAFKA_BROKER') || 'kafka:9092'],
            },
          },
        }),
      },
    ]),
  ],
  controllers: [MlScoringServiceController],
  providers: [MlScoringService],
})
export class MlScoringServiceModule {}
