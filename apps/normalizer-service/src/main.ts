import { NestFactory } from '@nestjs/core';
import { NormalizerServiceModule } from './normalizer-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    NormalizerServiceModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'normalizer-service-client',
          brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
        },
        consumer: {
          groupId: 'normalizer-service-group',
          sessionTimeout: 30000, // 30s
          heartbeatInterval: 3000, // 3s
        },
      },
    },
  );
  await app.listen().then(() => {
    console.log('[Normalizer]: Kafka microservice listening');
  });
}
bootstrap();
