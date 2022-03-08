import { AutoMapper, ProfileBase, ignore, mapFrom } from '@nartc/automapper';
import {
    AdminEntity,
    AdminFollowers,
    AdminProfile as AdminProfileEntity,
} from '@src/domain/admin';
import {
    UserFollowersModel,
    UserModel,
    UserProfileModel,
} from '@src/infra/database/model';

export class AdminMapperProfile extends ProfileBase {
    constructor(mapper: AutoMapper) {
        super();
        mapper
            .createMap(AdminProfileEntity, UserProfileModel)
            .forMember(dest => dest.name, ignore())
            .forMember(dest => dest.jobTitle, ignore());
        mapper.createMap(UserProfileModel, AdminProfileEntity);

        // map creator orm to creator entity
        mapper.createMap(UserModel, AdminEntity).forMember(
            dest => dest.id,
            mapFrom(src => src._id),
        );

        mapper
            .createMap(AdminFollowers, UserFollowersModel)
            .forMember(dest => dest.consumerIds, ignore())
            .forMember(dest => dest.creatorIds, ignore())
            .forMember(dest => dest.nextOfKinIds, ignore())
            .reverseMap();
    }
}
