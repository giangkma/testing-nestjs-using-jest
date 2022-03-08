import { AuthModule } from '@src/infra/auth/auth.module';
import { DeleteNextOfKinUseCase } from './deleteNextOfKin.usecase';
import { Module } from '@nestjs/common';
import { NextOfKinRepository } from '@src/infra/nextOfKin/nextOfKin.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsumerRepository } from '@src/infra/consumer/consumer.repository';
import { CreatorRepository } from '@src/infra/creator/creator.repository';

@Module({
    imports: [
        AuthModule,
        TypeOrmModule.forFeature([
            NextOfKinRepository,
            ConsumerRepository,
            CreatorRepository,
        ]),
    ],
    providers: [DeleteNextOfKinUseCase],
    exports: [DeleteNextOfKinUseCase],
})
export class DeleteNextOfKinModule {}
