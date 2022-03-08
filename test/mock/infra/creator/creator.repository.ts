import { CreatorInDB, ICreatorRepository, UpdateCreatorInfo } from '@src/domain/creator';

export class MockCreatorRepository implements ICreatorRepository {
    async createAndSave(info) {
        return new CreatorInDB();
    }

    async findById(id) {
        return new CreatorInDB();
    }

    async findByUserName(username) {
        return new CreatorInDB();
    }

    async findByEmail(email: string) {
        return new CreatorInDB();
    }

    async update(id: string, creatorInfo: UpdateCreatorInfo, currentCreator: CreatorInDB) {
        return;
    }

    async list(filter) : Promise<[CreatorInDB[], number]> {
        return [[new CreatorInDB()], 1]
    }
}
