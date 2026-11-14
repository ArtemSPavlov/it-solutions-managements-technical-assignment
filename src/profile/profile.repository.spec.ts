import { PROFILE_ID } from './profile.constants.js';
import { ProfileRepository } from './profile.repository.js';
import type { PrismaService } from '../prisma/prisma.service.js';

describe('ProfileRepository', () => {
  it('includes only selected relations with deterministic ordering', async () => {
    const findUnique = vi.fn().mockResolvedValue(null);
    const prisma = { profile: { findUnique } } as unknown as PrismaService;
    const repository = new ProfileRepository(prisma);

    await repository.findProfile({
      links: false,
      skills: true,
      experience: true,
      projects: false,
    });

    expect(findUnique).toHaveBeenCalledWith({
      where: { id: PROFILE_ID },
      include: {
        links: false,
        skills: { orderBy: { name: 'asc' } },
        experience: { orderBy: { startedAt: 'desc' } },
        projects: false,
      },
    });
  });
});
