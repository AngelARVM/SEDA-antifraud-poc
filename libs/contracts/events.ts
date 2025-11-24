export interface IncomingTx {
  transactionId: string;
  correlationId: string;
  userId: string;
  merchantId: string;
  amount: number;
  currency: 'ARS' | 'USD' | 'EUR' | 'BRL';
  country: string;
  paymentMethod: 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX' | 'TRANSFER';
  channel: 'WEB' | 'MOBILE' | 'POS';
  createdAt: string;
}

export interface NormalizedTx extends IncomingTx {
  normalized: true;
}

export interface RulesEvaluatedTx extends NormalizedTx {
  ruleScore: number;
  ruleFlags: string[];
}

export interface MlScoredTx extends RulesEvaluatedTx {
  modelScore: number;
}

export type Decision = 'APPROVE' | 'REVIEW' | 'REJECT';

export interface DecidedTx extends MlScoredTx {
  decision: Decision;
  riskScore: number;
}
