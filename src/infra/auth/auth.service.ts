import { GenerateOptions, generate } from 'generate-password';

import { Injectable } from '@nestjs/common';
import { UserModel } from '@src/infra/database/model';
import { UserRepository } from '@src/infra/user/user.repository';

@Injectable()
export class AuthService {
    constructor(private readonly userRepository: UserRepository) {}
    /**
     *
     * Generate random password
     *
     * @param {GenerateOptions} options
     * @returns string
     */
    generatePassword(options?: GenerateOptions): string {
        let generateOptions: GenerateOptions = {
            numbers: true,
            strict: true,
        };

        if (options) {
            generateOptions = {
                ...generateOptions,
                ...options,
            };
        }

        return generate(generateOptions);
    }

    /**
     *
     * Get persisted user by id
     *
     * @param {string} id
     * @returns {UserModel}
     * @memberof AuthService
     */
    async getUserById(id: string): Promise<UserModel | null> {
        const userModel = await this.userRepository.findById(id);

        if (!userModel) {
            return null;
        }

        return userModel;
    }
}
