import { Injectable } from '@nestjs/common';
import type {
  Experience,
  Profile,
  ProfileLink,
  Project,
  Skill,
} from '../generated/prisma/client.js';
import { PROFILE_ID } from './profile.constants.js';
import type { ProfileSelection } from './profile-selection.js';
import { PrismaService } from '../prisma/prisma.service.js';

export type ProfileRecord = Profile & {
  links?: ProfileLink[];
  skills?: Skill[];
  experience?: Experience[];
  projects?: Project[];
};

@Injectable()
export class ProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findProfile(
    selection: ProfileSelection,
  ): Promise<ProfileRecord | null> {
    return this.prisma.profile.findUnique({
      where: { id: PROFILE_ID },
      include: {
        links: selection.links ? { orderBy: { label: 'asc' } } : false,
        skills: selection.skills ? { orderBy: { name: 'asc' } } : false,
        experience: selection.experience
          ? { orderBy: { startedAt: 'desc' } }
          : false,
        projects: selection.projects ? { orderBy: { name: 'asc' } } : false,
      },
    });
  }
}
