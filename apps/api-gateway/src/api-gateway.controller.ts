import { Body, Controller, Post } from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller()
export class ApiGatewayController {
  constructor(private readonly apiGatewayService: ApiGatewayService) {}

  @Post('transactions')
  createTransaction(@Body() dto: CreateTransactionDto) {
    return this.apiGatewayService.createTransaction(dto);
  }
}
