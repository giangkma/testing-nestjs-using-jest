import { Module } from '@nestjs/common';
import { CreateAdminModule } from '@src/app/admin/createAdmin/createAdmin.module';
import { DeleteAdminModule } from '@src/app/admin/deleteAdmin/deleteAdmin.module';
import { AdminController } from './admin.controller';

@Module({
    imports: [CreateAdminModule, DeleteAdminModule],
    controllers: [AdminController],
})
export class AdminModule {}
