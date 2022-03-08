import * as _ from 'lodash';

import {
    AutoMapper,
    ProfileBase,
    convertUsing,
    mapFrom,
} from '@nartc/automapper';
import {
    Media as MediaEntity,
    PersonalMediaEntity,
} from '@src/domain/personalMedia';
import { MediaModel, PersonalMediaModel } from '@src/infra/database/model';

import { ObjectIDStringConverter } from '@src/helpers/class.helper';

export class PersonalMediaMapperProfile extends ProfileBase {
    constructor(mapper: AutoMapper) {
        super();
        mapper.createMap(MediaModel, MediaEntity).forMember(
            dest => dest.metaData,
            mapFrom(src => _.cloneDeep(src.metaData)),
        );

        mapper.createMap(MediaEntity, MediaModel).forMember(
            dest => dest.metaData,
            mapFrom(src => _.cloneDeep(src.metaData)),
        );

        // map personal media orm to personal media entity
        mapper
            .createMap(PersonalMediaModel, PersonalMediaEntity)
            .forMember(
                dest => dest.id,
                convertUsing(new ObjectIDStringConverter(), src => src.id),
            )
            .reverseMap();
    }
}
