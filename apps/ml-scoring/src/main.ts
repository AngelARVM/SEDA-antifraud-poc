import { NestFactory } from '@nestjs/core';
import { MlScoringServiceModule } from './ml-scoring-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MlScoringServiceModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'ml-scoring-client',
          brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
        },
        consumer: {
          groupId: 'ml-scoring-service-group',
          sessionTimeout: 30000,
          heartbeatInterval: 3000,
        },
      },
    },
  );

  await app.listen().then(() => {
    console.log('[ML-Scoring]: Kafka microservice listening');
  });
}
bootstrap();
