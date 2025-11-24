import { NestFactory } from '@nestjs/core';
import { MlScoringServiceModule } from './ml-scoring-service.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { kafkaServerOptions } from '../../../libs/constants';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MlScoringServiceModule,
    kafkaServerOptions('ml'),
  );

  await app.listen().then(() => {
    console.log('[ML-Scoring]: Kafka microservice listening');
  });
}
bootstrap();
