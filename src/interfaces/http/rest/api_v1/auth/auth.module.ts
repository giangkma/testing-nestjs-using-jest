import { AuthController } from './auth.controller';
import { Module } from '@nestjs/common';
import { StorageService } from '@src/infra/storage/storage.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '@src/infra/user/user.repository';
import { OrganizationRepository } from '@src/infra/organization/organization.repository';
import { AuthModule } from '@src/infra/auth/auth.module';

@Module({
    imports: [
        AuthModule,
        TypeOrmModule.forFeature([UserRepository, OrganizationRepository]),
    ],
    controllers: [AuthController],
    providers: [StorageService],
    exports: [StorageService],
})
export class AuthenticationModule {}
