import { CreateCreatorUseCase } from './createCreator.usecase';
import { CreateUserModule } from '@src/domain/user/createUser/createUser.module';
import { EmailModule } from '@src/infra/email/email.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '@src/infra/user/user.repository';

@Module({
    imports: [
        CreateUserModule,
        TypeOrmModule.forFeature([UserRepository]),
        EmailModule,
    ],
    providers: [CreateCreatorUseCase],
    exports: [CreateCreatorUseCase],
})
export class CreateCreatorModule {}
