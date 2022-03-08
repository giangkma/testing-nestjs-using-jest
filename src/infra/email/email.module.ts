import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import sendgridConfig from '@src/config/mail.config';
import { mailProvider } from './email.provider';
import { EmailService } from './email.service';

@Module({
    imports: [ConfigModule.forFeature(sendgridConfig)],
    providers: [mailProvider, EmailService],
    exports: [mailProvider, EmailService],
})
export class EmailModule {}
