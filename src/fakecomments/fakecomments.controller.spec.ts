import { Test, TestingModule } from '@nestjs/testing';
import { FakecommentsController } from './fakecomments.controller';
import { FakecommentsService } from './fakecomments.service';

describe('FakecommentsController', () => {
  let controller: FakecommentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FakecommentsController],
      providers: [FakecommentsService],
    }).compile();

    controller = module.get<FakecommentsController>(FakecommentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
