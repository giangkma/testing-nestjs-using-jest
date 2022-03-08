import { AutoMapper, ProfileBase, convertUsing } from '@nartc/automapper';
import {
    SessionMedia as MediaEntity,
    SessionConsumerEntity,
    SessionEntity,
    SessionImage,
    SessionAudio,
} from '@src/domain/session';
import {
    SessionConsumerModel,
    SessionMediaModel,
    SessionModel,
    SessionImageModel,
    SessionAudioModel,
} from '@src/infra/database/model';

import { ObjectIDStringConverter } from '@src/helpers/class.helper';

export class SessionMapperProfile extends ProfileBase {
    constructor(mapper: AutoMapper) {
        super();
        // media model, entity mapper
        mapper.createMap(MediaEntity, SessionMediaModel).reverseMap();

        // map session image
        mapper.createMap(SessionImageModel, SessionImage).reverseMap();

        mapper.createMap(SessionImage, SessionImage);

        //map session audio
        mapper.createMap(SessionAudioModel, SessionAudio).reverseMap();

        mapper.createMap(SessionAudio, SessionAudio);

        // map session orm to consumer in db
        mapper
            .createMap(SessionModel, SessionEntity)
            // object id instance to string id
            .forMember(
                dest => dest.id,
                convertUsing(new ObjectIDStringConverter(), src => src.id),
            );

        // map sesssion consumer in db to domain entity
        mapper
            .createMap(SessionConsumerModel, SessionConsumerEntity)
            .forMember(
                dest => dest.id,
                convertUsing(new ObjectIDStringConverter(), src => src.id),
            )
            .forMember(
                dest => dest.sessionId,
                convertUsing(
                    new ObjectIDStringConverter(),
                    src => src.sessionId,
                ),
            );
    }
}
