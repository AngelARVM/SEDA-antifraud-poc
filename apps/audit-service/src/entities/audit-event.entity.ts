import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DecisionEnum } from '../../../decision-engine/src/types/decision.enum';

@Entity({ name: 'audit_event' })
export class AuditEventEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'transaction_id' })
  transactionId: string;

  @Column('uuid', { name: 'correlation_id' })
  correlationId: string;

  @Column({ type: 'enum', enum: DecisionEnum, nullable: true })
  decision: DecisionEnum;

  @Column({ type: 'int', name: 'model_score', nullable: true })
  modelScore: number;

  @Column({ type: 'int', name: 'riskScore', nullable: true })
  riskScore: number;

  @Column({ type: 'jsonb' })
  payload: Record<string, any>;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}
