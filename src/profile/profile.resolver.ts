import { Info, Query, Resolver } from '@nestjs/graphql';
import type { GraphQLResolveInfo } from 'graphql';
import { getProfileSelection } from './profile-selection.js';
import { Profile } from './profile.models.js';
import type { ProfileRecord } from './profile.repository.js';
import { ProfileService } from './profile.service.js';

@Resolver(() => Profile)
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @Query(() => Profile)
  async profile(@Info() info: GraphQLResolveInfo): Promise<ProfileRecord> {
    return this.profileService.getProfile(getProfileSelection(info));
  }
}
