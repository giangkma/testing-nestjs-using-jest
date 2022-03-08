import { AutoMapper, ProfileBase, convertUsing } from '@nartc/automapper';
import {
    ImageSelection,
    InCompleteSessionEntity,
    Recipient,
    RecipientProfile,
    SessionForm,
    TrackSelection,
} from '@src/domain/inCompleteSession';
import {
    ImageSelectionModel,
    InCompleteSessionModel,
    RecipientModel,
    RecipientProfileModel,
    SessionFormModel,
    TrackSelectionModel,
} from '@src/infra/database/model';

import { ObjectIDStringConverter } from '@src/helpers/class.helper';

export class InCompleteSessionMapperProfile extends ProfileBase {
    constructor(mapper: AutoMapper) {
        super();
        mapper.createMap(ImageSelectionModel, ImageSelection).reverseMap();
        mapper.createMap(TrackSelectionModel, TrackSelection).reverseMap();
        mapper.createMap(RecipientProfileModel, RecipientProfile).reverseMap();
        mapper.createMap(RecipientModel, Recipient).reverseMap();

        mapper.createMap(ImageSelection, ImageSelection);
        mapper.createMap(TrackSelection, TrackSelection);
        mapper.createMap(RecipientProfile, RecipientProfile);
        mapper.createMap(Recipient, Recipient);

        mapper.createMap(SessionFormModel, SessionForm).reverseMap();
        mapper.createMap(SessionForm, SessionForm);

        mapper
            .createMap(InCompleteSessionModel, InCompleteSessionEntity)
            .forMember(
                dest => dest.id,
                convertUsing(new ObjectIDStringConverter(), src => src.id),
            )
            .reverseMap();
    }
}
