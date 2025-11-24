import { Module } from '@nestjs/common';
import { NormalizerServiceController } from './normalizer.controller';
import { NormalizerServiceService } from './normalizer.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { KAFKA_NAME, kafkaClientOptions } from '../../../libs/constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.registerAsync([
      {
        name: KAFKA_NAME,
        inject: [ConfigService],
        useFactory: (config: ConfigService) =>
          kafkaClientOptions('normalizer', config),
      },
    ]),
  ],
  controllers: [NormalizerServiceController],
  providers: [NormalizerServiceService],
})
export class NormalizerServiceModule {}
