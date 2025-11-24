import { NestFactory } from '@nestjs/core';
import { DecisionEngineServiceModule } from './decision-engine.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { kafkaServerOptions } from '../../../libs/constants';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    DecisionEngineServiceModule,
    kafkaServerOptions('decision'),
  );
  await app.listen().then(() => {
    console.log('[Decision-engine]: Kafka microservice listening');
  });
}
bootstrap();
