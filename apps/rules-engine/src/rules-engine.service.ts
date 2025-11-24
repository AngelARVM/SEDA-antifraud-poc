import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { TOPICS } from '../../../libs/constants/topics';
import { KAFKA_NAME } from '../../../libs/constants';

export const HIGH_RISK_COUNTRIES = [
  'KP', // North Korea (FATF Blacklist)
  'IR', // Iran (FATF Blacklist)
  'MM', // Myanmar (FATF Blacklist)
  'CU', // Cuba (OFAC Sanctioned)
  'SY', // Syria (OFAC Sanctioned)
  'RU', // Russia (High Risk / Sanctions)
  'BY', // Belarus (High Risk / Sanctions)
  'VE', // Venezuela (OFAC Sanctioned)
  'AF', // Afghanistan (High Risk / Taliban Sanctions)
  'SD', // Sudan (Historical high risk / often blocked)
  'SS', // South Sudan (FATF Grey / High Instability)
];

const userWindow: Map<string, { count: number; ts: number }> = new Map();
const WINDOW_MS = 60_000;
const MAX_TX_PER_MINUTE = 5;

@Injectable()
export class RulesEngineService implements OnModuleInit {
  private readonly logger = new Logger(RulesEngineService.name);

  constructor(
    @Inject(KAFKA_NAME)
    private readonly kafka: ClientKafka,
  ) {}

  evaluateAndForward(normalized: any) {
    const now = Date.now();
    const { amount, createdAt, normalizedAt, country, merchantId, userId } =
      normalized;

    const r1 = this.ruleHighAmount(Number(amount));
    const r2 = this.ruleNightActivity(createdAt || normalizedAt);
    const r3 = this.ruleCountryRisk(country);
    const r4 = this.ruleMerchantBlacklist(merchantId);
    const r5 = this.ruleVelicityByUser(userId, now);

    const rules = [r1, r2, r3, r4, r5];
    const riskScore = this.computeRiskScore(rules);
    const recommendation = this.recommendationFrom(riskScore);

    const evaluated = {
      ...normalized,
      rules,
      riskScore,
      recommendation,
      rulesEvaluatedAt: new Date(now).toISOString(),
      state: 'RULES_ENGINE',
    };

    this.logger.log(
      `Rules evaluated tx=${evaluated.transactionId} corrId=${evaluated.correlationId} score=${riskScore} -> ${recommendation}`,
    );

    this.kafka.emit(TOPICS.rulesEvaluated, evaluated);
  }

  async onModuleInit() {
    try {
      await this.kafka.connect();
      this.logger.log('Connected Kafka producer');
    } catch (err) {
      this.logger.error(
        'Could not connect Kafka producer',
        (err as Error).message,
      );
    }
  }

  private ruleHighAmount(amount: number) {
    const THRESHOLD = 2000000;
    const passed = amount < THRESHOLD;

    return {
      code: 'HIGH_AMOUNT',
      passed,
      details: { amount, threshold: THRESHOLD },
      weight: 30,
    };
  }

  private ruleNightActivity(isoDate: string) {
    const h = new Date(isoDate).getUTCHours();
    const isNight = h >= 0 && h <= 5;
    const passed = !isNight;

    return {
      code: 'NIGHT_ACTIVITY',
      passed,
      details: { hourUTC: h },
      weight: 10,
    };
  }

  private ruleCountryRisk(country: string) {
    const HIGH_RISK = new Set(HIGH_RISK_COUNTRIES);
    const isRisk = HIGH_RISK.has((country || '').toUpperCase());
    const passed = !isRisk;
    return {
      code: 'COUNTRY_RISK',
      passed,
      details: { country, highRisk: isRisk },
      weight: 20,
    };
  }

  private ruleMerchantBlacklist(merchantId: string) {
    const BLACKLIST = new Set<string>();
    const isBlacklisted = BLACKLIST.has(merchantId);
    const passed = !isBlacklisted;
    return {
      code: 'MERCHANT_BLACKLIST',
      passed,
      details: { merchantId, blacklisted: !isBlacklisted },
      weight: 40,
    };
  }

  private ruleVelicityByUser(userId: string, now: number) {
    const entry = userWindow.get(userId);
    if (!entry || now - entry.ts > WINDOW_MS) {
      userWindow.set(userId, { count: 1, ts: now });
    } else {
      entry.count += 1;
    }

    const { count } = userWindow.get(userId);
    const passed = count <= MAX_TX_PER_MINUTE;
    return {
      code: 'VELOCITY_USER',
      passed,
      details: { count, windowMs: WINDOW_MS, maxPerWindow: MAX_TX_PER_MINUTE },
      weight: 25,
    };
  }

  private computeRiskScore(rules: Array<{ passed: boolean; weight: number }>) {
    return rules.reduce((acc, r) => (r.passed ? acc : acc + r.weight), 0);
  }

  private recommendationFrom(score: number) {
    if (score >= 60) return 'REJECT';
    if (score >= 25) return 'REVIEW';
    return 'APPROVE';
  }
}
