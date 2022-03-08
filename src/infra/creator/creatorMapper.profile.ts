import { AutoMapper, ProfileBase, ignore, mapFrom } from '@nartc/automapper';
import {
    CreatorEntity,
    CreatorFollowers,
    CreatorProfile as CreatorProfileEntity,
} from '@src/domain/creator';
import {
    UserFollowersModel,
    UserModel,
    UserProfileModel,
} from '@src/infra/database/model';

export class CreatorMapperProfile extends ProfileBase {
    constructor(mapper: AutoMapper) {
        super();
        mapper.createMap(CreatorProfileEntity, UserProfileModel).reverseMap();
        // map creator orm to creator entity
        mapper.createMap(UserModel, CreatorEntity).forMember(
            dest => dest.id,
            mapFrom(src => src._id),
        );

        mapper
            .createMap(CreatorFollowers, UserFollowersModel)
            .forMember(dest => dest.creatorIds, ignore())
            .reverseMap();
    }
}
