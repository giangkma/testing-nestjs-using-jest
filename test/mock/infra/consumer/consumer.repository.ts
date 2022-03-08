import {
    ConsumerFilterInfo,
    ConsumerInDB,
    ConsumerUpdateInfo,
    IConsumerRepository
}
from '@src/domain/consumer';

export class MockConsumerRepository implements IConsumerRepository {
    async createAndSave(info) {
        return new ConsumerInDB();
    }

    async update(id : string, consumerInfo : ConsumerUpdateInfo) {
        return;
    }

    async findById(id) {
        return new ConsumerInDB();
    }

    async findByUserName(username) {
        return new ConsumerInDB();
    }

    async list(filter: ConsumerFilterInfo):Promise<[ConsumerInDB[], number] > {
        throw new Error('Method not implemented.');
    }

    async delete (id: string) {
        return;
    }
}
