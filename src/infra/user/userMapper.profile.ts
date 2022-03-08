import { AutoMapper, ProfileBase, mapFrom } from '@nartc/automapper';

import { UserEntity } from '@src/domain/user';
import { UserModel } from '@src/infra/database/model';

export class UserMapperProfile extends ProfileBase {
    constructor(mapper: AutoMapper) {
        super();
        // map user orm to user entity
        mapper.createMap(UserModel, UserEntity).forMember(
            dest => dest.id,
            mapFrom(src => src._id),
        );
    }
}
