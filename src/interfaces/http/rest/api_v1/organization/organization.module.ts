import { AssignConsumersModule } from '@src/app/organization/assignConsumers/assignConsumers.module';
import { AssignCreatorsModule } from '@src/app/organization/assignCreators/assignCreators.module';
import { CreateOrganizationModule } from '@src/app/organization/createOrganization/createOrganization.module';
import { DeleteOrganizationModule } from '@src/app/organization/deleteOrganization/deleteOrganization.module';
import { GetSingleOrganizationModule } from '@src/app/organization/getSingleOrganization/getSingleOrganization.module';
import { LicenceController } from './licence.controller';
import { ListOrganizationsModule } from '@src/app/organization/listOrganizations/listOrganization.module';
import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { RemoveConsumersModule } from '@src/app/organization/removeConsumers/removeConsumers.module';
import { RemoveCreatorsModule } from '@src/app/organization/removeCreators/removeCreators.module';
import { UpdateOrganizationModule } from '@src/app/organization/updateOrganization/updateOrganization.module';
import { organizationNameController } from './organizationName.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsumerRepository } from '@src/infra/consumer/consumer.repository';

@Module({
    imports: [
        CreateOrganizationModule,
        DeleteOrganizationModule,
        GetSingleOrganizationModule,
        ListOrganizationsModule,
        UpdateOrganizationModule,
        AssignCreatorsModule,
        RemoveCreatorsModule,
        AssignConsumersModule,
        RemoveConsumersModule,
        TypeOrmModule.forFeature([ConsumerRepository]),
    ],
    controllers: [
        OrganizationController,
        LicenceController,
        organizationNameController,
    ],
})
export class OrganizationModule {}
