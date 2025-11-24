import { NestFactory } from '@nestjs/core';
import { RulesEngineServiceModule } from './rules-engine.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { kafkaServerOptions } from '../../../libs/constants';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    RulesEngineServiceModule,
    kafkaServerOptions('rules'),
  );

  await app.listen().then(() => {
    console.log('[Rules]: Kafka microservice listening');
  });
}
bootstrap();
