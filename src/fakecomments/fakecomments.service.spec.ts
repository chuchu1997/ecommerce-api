import { Test, TestingModule } from '@nestjs/testing';
import { FakecommentsService } from './fakecomments.service';

describe('FakecommentsService', () => {
  let service: FakecommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FakecommentsService],
    }).compile();

    service = module.get<FakecommentsService>(FakecommentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
