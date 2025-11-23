import { NestFactory } from '@nestjs/core';
import { RulesEngineServiceModule } from './rules-engine.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    RulesEngineServiceModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'rules-service-client',
          brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
        },
        consumer: {
          groupId: 'rules-service-group',
          sessionTimeout: 30000,
          heartbeatInterval: 3000,
        },
      },
    },
  );

  await app.listen().then(() => {
    console.log('[Rules]: Kafka microservice listening');
  });
}
bootstrap();
