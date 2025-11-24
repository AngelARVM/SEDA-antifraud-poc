import { NestFactory } from '@nestjs/core';
import { AuditServiceModule } from './audit-service.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { kafkaServerOptions } from '../../../libs/constants';

async function bootstrap() {
  const app = await NestFactory.create(AuditServiceModule);

  app.connectMicroservice<MicroserviceOptions>(kafkaServerOptions('audit'));

  await app
    .startAllMicroservices()
    .then(() => console.log('[Audit-Service]: Microservice up'));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
