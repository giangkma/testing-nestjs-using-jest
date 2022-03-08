import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateUserModule } from '@src/domain/user/createUser/createUser.module';
import { UserRepository } from '@src/infra/user/user.repository';
import { CreateAdminUseCase } from './createAdmin.usecase';

@Module({
    imports: [CreateUserModule, TypeOrmModule.forFeature([UserRepository])],
    providers: [CreateAdminUseCase],
    exports: [CreateAdminUseCase],
})
export class CreateAdminModule {}
