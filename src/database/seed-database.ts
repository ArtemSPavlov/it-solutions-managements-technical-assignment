import type { PrismaClient } from '../generated/prisma/client.js';
import { PROFILE_ID } from '../profile/profile.constants.js';
import { profileSeed } from './seed-data.js';

export async function seedDatabase(prisma: PrismaClient): Promise<void> {
  await prisma.$transaction(async (transaction) => {
    await transaction.profile.upsert({
      where: { id: PROFILE_ID },
      create: {
        id: PROFILE_ID,
        name: profileSeed.name,
        description: profileSeed.description,
      },
      update: {
        name: profileSeed.name,
        description: profileSeed.description,
      },
    });

    await transaction.profileLink.deleteMany({
      where: { profileId: PROFILE_ID },
    });
    await transaction.skill.deleteMany({ where: { profileId: PROFILE_ID } });
    await transaction.experience.deleteMany({
      where: { profileId: PROFILE_ID },
    });
    await transaction.project.deleteMany({ where: { profileId: PROFILE_ID } });

    await transaction.profileLink.createMany({
      data: profileSeed.links.map((link) => ({
        ...link,
        profileId: PROFILE_ID,
      })),
    });
    await transaction.skill.createMany({
      data: profileSeed.skills.map((skill) => ({
        ...skill,
        profileId: PROFILE_ID,
      })),
    });
    await transaction.experience.createMany({
      data: profileSeed.experience.map((experience) => ({
        ...experience,
        profileId: PROFILE_ID,
      })),
    });
    await transaction.project.createMany({
      data: profileSeed.projects.map((project) => ({
        ...project,
        profileId: PROFILE_ID,
      })),
    });
  });
}
