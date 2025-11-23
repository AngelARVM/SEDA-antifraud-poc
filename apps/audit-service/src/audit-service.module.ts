import { Module } from '@nestjs/common';
import { AuditServiceController } from './audit-service.controller';
import { AuditService } from './audit-service.service';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditEventEntity } from './entities/audit-event.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.POSTGRES_HOST || 'localhost',
        port: Number(process.env.POSTGRES_PORT || 5432),
        username: process.env.POSTGRES_USER || 'antifraud',
        password: process.env.POSTGRES_PASSWORD || 'antifraud',
        database: process.env.POSTGRES_DB || 'antifraud_db',
        entities: [AuditEventEntity],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([AuditEventEntity]),
    ClientsModule.register([
      {
        name: 'KAFKA_ANTIFRAUD',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'audit-service-producer-client',
            brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
          },
        },
      },
    ]),
  ],
  controllers: [AuditServiceController],
  providers: [AuditService],
})
export class AuditServiceModule {}
