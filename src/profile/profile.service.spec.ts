import { NotFoundException } from '@nestjs/common';
import { ProfileService } from './profile.service.js';
import type { ProfileRepository } from './profile.repository.js';

describe('ProfileService', () => {
  it('fails when the singleton profile is missing', async () => {
    const repository = {
      findProfile: vi.fn().mockResolvedValue(null),
    } as unknown as ProfileRepository;
    const service = new ProfileService(repository);

    await expect(
      service.getProfile({
        links: false,
        skills: false,
        experience: false,
        projects: false,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
