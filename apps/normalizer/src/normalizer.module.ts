import { Module } from '@nestjs/common';
import { NormalizerServiceController } from './normalizer.controller';
import { NormalizerServiceService } from './normalizer.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KAFKA_CONST } from '../../../libs/constants/constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.registerAsync([
      {
        name: KAFKA_CONST.name,
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'normailizer-producer-client',
              brokers: [config.get<string>('KAFKA_BROKER') || 'kafka:9092'],
            },
          },
        }),
      },
    ]),
  ],
  controllers: [NormalizerServiceController],
  providers: [NormalizerServiceService],
})
export class NormalizerServiceModule {}
