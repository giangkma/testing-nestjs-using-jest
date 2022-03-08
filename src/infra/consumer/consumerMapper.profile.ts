import { AutoMapper, ProfileBase, ignore, mapFrom } from '@nartc/automapper';
import {
    ConsumerEntity,
    ConsumerFollowers,
    ConsumerProfile as ConsumerProfileEntity,
    SurveyForm as SurveyFormEntity,
} from '@src/domain/consumer';
import {
    UserFollowersModel,
    UserModel,
    UserProfileModel,
} from '@src/infra/database/model';

import { SurveyFormModel } from '../database/model';

export class ConsumerMapperProfile extends ProfileBase {
    constructor(mapper: AutoMapper) {
        super();
        // survey form model, entity mapper
        mapper
            .createMap(ConsumerProfileEntity, UserProfileModel)
            .forMember(dest => dest.name, ignore())
            .forMember(dest => dest.jobTitle, ignore())
            .forMember(dest => dest.phoneNumber, ignore());

        mapper.createMap(UserProfileModel, ConsumerProfileEntity);

        mapper.createMap(SurveyFormModel, SurveyFormEntity).reverseMap();

        mapper
            .createMap(ConsumerFollowers, UserFollowersModel)
            .forMember(
                dest => dest.consumerIds,
                ignore(), // ConsumerFollowers doesn't have the consumerIds field.
            )
            .reverseMap();

        mapper.createMap(UserModel, ConsumerEntity).forMember(
            dest => dest.id,
            mapFrom(src => src._id),
        );
    }
}
