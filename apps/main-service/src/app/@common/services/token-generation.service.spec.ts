import { Test, TestingModule } from '@nestjs/testing';
import { TokenGenerationService } from './token-generation.service';

describe('TokenGenerationService', () => {
  let service: TokenGenerationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenGenerationService],
    }).compile();

    service = module.get<TokenGenerationService>(TokenGenerationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
