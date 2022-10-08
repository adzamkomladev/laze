import { Test, TestingModule } from '@nestjs/testing';
import { CurrentUserResolver } from './current-user.resolver';

describe('CurrentUserResolver', () => {
  let resolver: CurrentUserResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CurrentUserResolver],
    }).compile();

    resolver = module.get<CurrentUserResolver>(CurrentUserResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
