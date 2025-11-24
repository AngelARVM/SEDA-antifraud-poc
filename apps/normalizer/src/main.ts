import { NestFactory } from '@nestjs/core';
import { NormalizerServiceModule } from './normalizer.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { kafkaServerOptions } from '../../../libs/constants';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    NormalizerServiceModule,
    kafkaServerOptions('normalizer'),
  );
  await app.listen().then(() => {
    console.log('[Normalizer]: Kafka microservice listening');
  });
}
bootstrap();
