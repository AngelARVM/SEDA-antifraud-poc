import { NestFactory } from '@nestjs/core';
import { DecisionEngineServiceModule } from './decision-engine.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    DecisionEngineServiceModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'decision-engine-client',
          brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
        },
        consumer: {
          groupId: 'decision-engine-consumer-group',
          sessionTimeout: 30000,
          heartbeatInterval: 3000,
        },
      },
    },
  );
  await app.listen().then(() => {
    console.log('[Decision-engine]: Kafka microservice listening');
  });
}
bootstrap();
