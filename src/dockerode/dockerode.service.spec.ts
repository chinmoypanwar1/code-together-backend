import { Test, TestingModule } from '@nestjs/testing';
import { DockerodeService } from './dockerode.service';

describe('DockerodeService', () => {
  let service: DockerodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DockerodeService],
    }).compile();

    service = module.get<DockerodeService>(DockerodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
