import { Injectable, NotFoundException } from '@nestjs/common';
import type { ProfileSelection } from './profile-selection.js';
import { ProfileRepository, ProfileRecord } from './profile.repository.js';

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
