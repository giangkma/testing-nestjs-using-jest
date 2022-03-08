import { ConsumerMapperProfile } from '@src/infra/consumer/consumerMapper.profile';
import { CreatorMapperProfile } from '@src/infra/creator/creatorMapper.profile';
import { InCompleteSessionMapperProfile } from '@src/infra/inCompleteSession/inCompleteSession.profile';
import { Mapper } from '@nartc/automapper';
import { NextOfKinMapperProfile } from '@src/infra/nextOfKin/nextOfKinMapper.profile';
import { OrganizationMapperProfile } from '@src/infra/organization/organizationMapper.profile';
import { PersonalMediaMapperProfile } from '@src/infra/personalMedia/personalMediaMapper.profile';
import { SessionLogMapperProfile } from '@src/infra/sessionLog/sessionLogMapper.profile';
import { SessionMapperProfile } from '@src/infra/session/sessionMapper.profile';
import { UserMapperProfile } from '@src/infra/user/userMapper.profile';
import { AdminMapperProfile } from '@src/infra/admin/adminMapper.profile';

// global settings
Mapper.withGlobalSettings({
    // use undefined for empty value instead of default null
    useUndefined: true,
});

// init mapper profiles
Mapper.addProfile(CreatorMapperProfile)
    .addProfile(ConsumerMapperProfile)
    .addProfile(NextOfKinMapperProfile)
    .addProfile(SessionMapperProfile)
    .addProfile(OrganizationMapperProfile)
    .addProfile(PersonalMediaMapperProfile)
    .addProfile(UserMapperProfile)
    .addProfile(SessionLogMapperProfile)
    .addProfile(InCompleteSessionMapperProfile)
    .addProfile(AdminMapperProfile);
