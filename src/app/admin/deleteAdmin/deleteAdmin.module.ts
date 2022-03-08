import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminRepository } from '@src/infra/Admin/Admin.repository';
import { AuthModule } from '@src/infra/auth/auth.module';
import { DeleteAdminUseCase } from './deleteAdmin.usecase';
@Module({
    imports: [AuthModule, TypeOrmModule.forFeature([AdminRepository])],
    providers: [DeleteAdminUseCase],
    exports: [DeleteAdminUseCase],
})
export class DeleteAdminModule {}
