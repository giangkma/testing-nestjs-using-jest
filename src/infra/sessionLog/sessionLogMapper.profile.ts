import * as _ from 'lodash';

import {
    AutoMapper,
    ProfileBase,
    convertUsing,
    mapFrom,
} from '@nartc/automapper';
import { LogItemModel, LogModel } from '@src/infra/database/model';
import { SessionLogEntity, SessionLogItem } from '@src/domain/sessionLog';

import { ObjectIDStringConverter } from '@src/helpers/class.helper';

export class SessionLogMapperProfile extends ProfileBase {
    constructor(mapper: AutoMapper) {
        super();
        mapper
            .createMap(LogItemModel, SessionLogItem)
            .forMember(
                dest => dest.id,
                convertUsing(new ObjectIDStringConverter(), src => src.id),
            )
            .forMember(
                dest => dest.payload,
                mapFrom(src => _.cloneDeep(src.payload)),
            )
            .forMember(
                dest => dest.error,
                mapFrom(src => _.cloneDeep(src.error)),
            );

        mapper.createMap(SessionLogItem, LogItemModel).forMember(
            dest => dest.payload,
            mapFrom(src => _.cloneDeep(src.payload)),
        );

        // map log orm to log entity
        mapper
            .createMap(LogModel, SessionLogEntity)
            .forMember(
                dest => dest.id,
                convertUsing(new ObjectIDStringConverter(), src => src.id),
            )
            .reverseMap();
    }
}
