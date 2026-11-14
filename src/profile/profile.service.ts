import { Injectable, NotFoundException } from '@nestjs/common';
import { ProfileRepository } from './profile.repository.js';
import type { ProfileRecord, ProfileSelection } from './profile.types.js';

@Injectable()
export class ProfileService {
  constructor(private readonly repository: ProfileRepository) {}

  async getProfile(selection: ProfileSelection): Promise<ProfileRecord> {
    const profile = await this.repository.findProfile(selection);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }
}
