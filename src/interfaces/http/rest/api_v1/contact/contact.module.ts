import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from '@src/infra/email/email.module';
import { ContactController } from './contact.controller';

@Module({
    imports: [TypeOrmModule.forFeature([]), EmailModule],
    controllers: [ContactController],
})
export class ContactModule {}
