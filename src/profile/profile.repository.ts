import { Injectable } from '@nestjs/common';
import { PROFILE_ID } from './profile.constants.js';
import type { ProfileRecord, ProfileSelection } from './profile.types.js';
import { PrismaService } from '../prisma/prisma.service.js';

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
