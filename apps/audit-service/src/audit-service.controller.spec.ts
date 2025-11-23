import { Test, TestingModule } from '@nestjs/testing';
import { AuditServiceController } from './audit-service.controller';
import { AuditService } from './audit-service.service';

describe('AuditServiceController', () => {
  let auditServiceController: AuditServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuditServiceController],
      providers: [AuditService],
    }).compile();

    auditServiceController = app.get<AuditServiceController>(AuditServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(auditServiceController.getHello()).toBe('Hello World!');
    });
  });
});
