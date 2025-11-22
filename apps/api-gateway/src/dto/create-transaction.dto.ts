import {
  IsUUID,
  IsString,
  IsNumber,
  IsOptional,
  IsIn,
  IsISO8601,
} from 'class-validator';

export class CreateTransactionDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  merchantId: string;

  @IsNumber()
  amount: number;

  @IsString()
  @IsIn(['ARS', 'USD', 'EUR', 'BRL'])
  currency: string;

  @IsString()
  country: string;

  @IsString()
  @IsIn(['CREDIT_CARD', 'DEBIT_CARD', 'PIX', 'TRANSFER'])
  paymentMethod: string;

  @IsString()
  @IsIn(['WEB', 'MOBILE', 'POS'])
  channel: string;

  @IsISO8601()
  @IsOptional()
  createdAt?: string;
}
