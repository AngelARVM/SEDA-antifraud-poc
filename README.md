# Anti-fraud SEDA

## Intention
- Event-driven anti-fraud pipeline built with NestJS microservices and Kafka to validate payment transactions before capture.
- Kafka carries transaction events through Normalizer, Rules Engine, ML Scoring, and Decision services so each stage can evolve independently.
- API Gateway accepts `/transactions`, validates client payloads, and enriches requests with `transactionId` and `correlationId` for observability.
- Postgres is planned for the Audit Service to persist the full decision trail and support compliance or analytics queries.

## Microservices diagram
```mermaid
flowchart LR
  Client[Client / Partner] -->|POST /transactions| APIGW[API Gateway]
  APIGW -->|Kafka: transactions.incoming\ncorrelation + ids| Normalizer[Normalizer Service]
  Normalizer -->|transactions.normalized| Rules[Rules Engine]
  Rules -->|transactions.rule-evaluated| ML[ML Scoring]
  ML -->|transactions.scored| Decision[Decision Engine]
  Decision -->|transactions.decided| Audit[Audit Service]
  Audit -->|events + snapshots| DB[(PostgreSQL)]
  Kafka[(Kafka)] --- APIGW
  Kafka --- Normalizer
  Kafka --- Rules
  Kafka --- ML
  Kafka --- Decision
  Kafka --- Audit
```

## Workflow diagram
```mermaid
sequenceDiagram
  participant Client
  participant Gateway
  participant Kafka
  participant Normalizer
  participant Rules
  participant ML
  participant Decision
  participant Audit
  participant Postgres

  Client->>Gateway: POST /transactions (amount, merchant, channel...)
  Gateway->>Kafka: emit transactions.incoming\n+ transactionId + correlationId
  Kafka-->>Normalizer: consume incoming event
  Normalizer->>Kafka: emit transactions.normalized\n(clean amounts, enrich geo/IP, defaults)
  Kafka-->>Rules: consume normalized
  Rules->>Kafka: emit transactions.rule-evaluated\n(basic policy flags/scores)
  Kafka-->>ML: consume rules output
  ML->>Kafka: emit transactions.scored\n(model score + features)
  Kafka-->>Decision: consume scored event
  Decision->>Kafka: emit transactions.decided\n(APPROVE / REVIEW / DENY)
  Decision-->>Client: expose status lookup (future)
  Kafka-->>Audit: consume decided + snapshots
  Audit->>Postgres: persist audit trail and metrics
```

## Progress list
- [x] API Gateway: HTTP endpoint `/transactions` validates payload and emits `transactions.incoming` with correlation and transaction IDs.
- [ ] Normalizer Service: consume incoming events and standardize/enrich transaction payloads.
- [ ] Rules Engine Service: apply deterministic business rules and flag violations.
- [ ] ML Scoring Service: generate fraud risk score from engineered features.
- [ ] Decision Engine Service: merge rules + ML to produce final decision and expose status queries.
- [ ] Audit Service: persist events/decisions to Postgres and expose an audit/activity feed.
- [ ] Observability & CI: logging/metrics per stage plus automated tests.
- [ ] Local DX: docker-compose wiring, seeded Kafka topics, and sample client scripts.
