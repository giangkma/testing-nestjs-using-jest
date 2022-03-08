import { CreateNextOfKinModule } from '@src/app/nextOfKin/createNextOfKin/createNextOfKin.module';
import { DeleteNextOfKinModule } from '@src/app/nextOfKin/deleteNextOfKin/deleteNextOfKin.module';
import { GetSingleNextOfKinModule } from '@src/app/nextOfKin/getSingleNextOfKin/getSingleNextOfKin.module';
import { ListNextOfKinsModule } from '@src/app/nextOfKin/listNextOfKins/listNextOfKins.module';
import { Module } from '@nestjs/common';
import { NextOfKinController } from './nextOfKin.controller';
import { UpdateConsumerModule } from '@src/app/nextOfKin/updateNextOfKin/updateNextOfKin.module';

@Module({
    imports: [
        CreateNextOfKinModule,
        DeleteNextOfKinModule,
        GetSingleNextOfKinModule,
        ListNextOfKinsModule,
        UpdateConsumerModule,
    ],
    controllers: [NextOfKinController],
})
export class NextOfKinModule {}
