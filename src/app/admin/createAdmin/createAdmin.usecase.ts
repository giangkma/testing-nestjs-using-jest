import { Injectable } from '@nestjs/common';
import {
    InvalidRequestObject,
    ValidRequestObject,
} from '@src/app/shared/requestObject';
import { ResponseFailure } from '@src/app/shared/responseObject';
import { UseCase } from '@src/app/shared/useCase';
import { AdminEntity, CreateAdminPayload } from '@src/domain/admin';
import { CreateUserService } from '@src/domain/user/createUser/createUser.service';
import { UserRepository } from '@src/infra/user/user.repository';

export class CreateAdminRequestObject extends ValidRequestObject {
    constructor(public readonly createAdminPayload: CreateAdminPayload) {
        super();
    }

    static builder(
        createAdminPayload: CreateAdminPayload,
    ): CreateAdminRequestObject | InvalidRequestObject {
        const invalidReq = new InvalidRequestObject();

        if (!createAdminPayload) {
            invalidReq.addError('Admin info', 'invalid');
        }

        if (invalidReq.hasErrors()) return invalidReq;

        return new CreateAdminRequestObject(createAdminPayload);
    }
}

@Injectable()
export class CreateAdminUseCase extends UseCase<AdminEntity> {
    constructor(
        private userRepository: UserRepository,
        private createUserService: CreateUserService,
    ) {
        super();
    }

    async processRequest(
        req_object: CreateAdminRequestObject,
    ): Promise<AdminEntity | ResponseFailure> {
        const { createAdminPayload } = req_object;

        // check if email already exist in db
        const existUser = await this.userRepository.findByEmail(
            createAdminPayload.email,
        );

        if (existUser) {
            return ResponseFailure.buildResourceError('Email already existed');
        }

        const result = await this.createUserService.execute(createAdminPayload);

        return result.user;
    }
}
