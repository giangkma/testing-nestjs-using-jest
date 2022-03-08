import { AutoMapper, ProfileBase, mapFrom } from '@nartc/automapper';
import {
    OrganizationEntity,
    OrganizationProfile as OrganizationProfileEntity,
} from '@src/domain/organization';
import { UserModel, UserProfileModel } from '@src/infra/database/model';

export class OrganizationMapperProfile extends ProfileBase {
    constructor(mapper: AutoMapper) {
        super();
        mapper
            .createMap(OrganizationProfileEntity, UserProfileModel)
            .reverseMap();
        // map organization orm to organization entity
        mapper.createMap(UserModel, OrganizationEntity).forMember(
            dest => dest.id,
            mapFrom(src => src._id),
        );
    }
}
