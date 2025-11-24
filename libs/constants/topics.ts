export const TOPICS = {
  incoming: 'transactions.incoming',
  normalized: 'transactions.normalized',
  rulesEvaluated: 'transactions.rule-evaluated',
  mlScored: 'transactions.ml-scored',
  decided: 'transactions.decided',
  dlq: {
    normalizer: 'transactions.normalizer.dlq',
    rules: 'transactions.rules.dlq',
    ml: 'transactions.ml.dlq',
    decision: 'transactions.decision.dlq',
  },
} as const;

export type Topic =
  | (typeof TOPICS)[keyof typeof TOPICS]
  | (typeof TOPICS)['dlq'][keyof (typeof TOPICS)['dlq']];
