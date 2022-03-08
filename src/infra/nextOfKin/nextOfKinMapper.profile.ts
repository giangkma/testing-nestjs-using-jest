import { AutoMapper, ProfileBase, ignore, mapFrom } from '@nartc/automapper';
import {
    NextOfKinEntity,
    NextOfKinFollowers,
    NextOfKinProfile as NextOfKinProfileEntity,
} from '@src/domain/nextOfKin';
import {
    UserFollowersModel,
    UserModel,
    UserProfileModel,
} from '@src/infra/database/model';

export class NextOfKinMapperProfile extends ProfileBase {
    constructor(mapper: AutoMapper) {
        super();
        mapper
            .createMap(NextOfKinProfileEntity, UserProfileModel)
            .forMember(dest => dest.name, ignore())
            .forMember(dest => dest.jobTitle, ignore());
        mapper.createMap(UserProfileModel, NextOfKinProfileEntity);

        // map user orm to next-of-kin in db
        mapper.createMap(UserModel, NextOfKinEntity).forMember(
            dest => dest.id,
            mapFrom(src => src._id),
        );

        mapper
            .createMap(NextOfKinFollowers, UserFollowersModel)
            .forMember(
                dest => dest.nextOfKinIds,
                ignore(), // NextOfKinFollowers doesn't have the nextOfKinIds field.
            )
            .reverseMap();
    }
}
