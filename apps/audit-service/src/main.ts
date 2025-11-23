// apps/audit-service/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AuditServiceModule } from './audit-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AuditServiceModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'audit-service-client',
        brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
      },
      consumer: {
        groupId: 'audit-service-consumer-group',
        sessionTimeout: 30000,
        heartbeatInterval: 3000,
      },
    },
  });

  await app
    .startAllMicroservices()
    .then(() => console.log('[Audit-Service]: Microservice up'));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
