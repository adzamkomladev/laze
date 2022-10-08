import { Test, TestingModule } from '@nestjs/testing';
import { VerificationResolver } from './verification.resolver';
import { VerificationService } from './verification.service';

describe('VerificationResolver', () => {
  let resolver: VerificationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VerificationResolver, VerificationService],
    }).compile();

    resolver = module.get<VerificationResolver>(VerificationResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
