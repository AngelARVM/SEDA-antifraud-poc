import { ConfigService } from '@nestjs/config';
import {
  KafkaOptions,
  Transport,
  type MicroserviceOptions,
} from '@nestjs/microservices';

export type Stage =
  | 'gateway'
  | 'normalizer'
  | 'rules'
  | 'ml'
  | 'decision'
  | 'audit';

export type Role = 'producer' | 'server';

export function getKafkaBrokers(config?: ConfigService): string[] {
  const env: string =
    config?.get('KAFKA_BROKER') || process.env.KAFKA_BROKER || 'kafka:9092';
  return env
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function clientId(stage: Stage, role: Role) {
  return `${stage}-${role}-client`;
}
export function groupId(stage: Stage, role: Role) {
  return `${stage}-${role}-group`;
}

export function kafkaClientOptions(
  stage: Stage,
  config?: ConfigService,
): KafkaOptions {
  return {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: clientId(stage, 'producer'),
        brokers: getKafkaBrokers(config),
      },
      consumer: {
        groupId: groupId(stage, 'producer'),
      },
    },
  };
}

export function kafkaServerOptions(
  stage: Stage,
  config?: ConfigService,
): MicroserviceOptions {
  return {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: clientId(stage, 'server'),
        brokers: getKafkaBrokers(config),
      },
      consumer: {
        groupId: groupId(stage, 'server'),
      },
    },
  };
}
