import { BaseListFilterInfo } from '../helper/base.dto';
import {
    ImageSelection,
    InCompleteSessionEntity,
    Recipient,
    SessionForm,
    TrackSelection,
} from './inCompleteSession.entity';

export interface CreateInCompleteSessionInfo {
    author: string;
    sessionForm: SessionForm;
    createdDate?: Date;
}

/**
 * Sesison video repository interface for dependency inversion
 *
 * @export {IInCompleteSessionRepository}
 * @interface IInCompleteSessionRepository
 */
export interface IInCompleteSessionRepository {
    createAndSave: (
        createInCompleteSessionInfo: CreateInCompleteSessionInfo,
    ) => Promise<InCompleteSessionEntity>;
    findById: (id: string) => Promise<InCompleteSessionEntity | null>;
    delete: (id: string) => Promise<void>;
}

export interface InCompleteSessionsFilterInfo extends BaseListFilterInfo {
    author?: string;
    name?: string;
    title?: string;
}

export interface UpdateInCompleteSessionInfo {
    name?: string;
    images?: ImageSelection[];
    trackSelection?: TrackSelection[];
    title?: string;
    notes?: string;
    recipient?: Recipient;
    totalDuration?: number;
    step?: number;
}
