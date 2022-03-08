import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
    ContactFormAutoReplyPayload,
    ContactFormPayload,
    getContactFormPayload,
} from '@src/domain/contact';
import {
    EmailIdentity,
    EmailService,
    EmailTemplateIds,
} from '@src/infra/email/email.service';

@ApiTags('contact')
@Controller('contact')
export class ContactController {
    constructor(private emailService: EmailService) {}

    @Post()
    async sendContact(
        @Body()
        contactFormPayload: ContactFormPayload,
    ): Promise<ContactFormPayload> {
        // send mail to Mundu
        const emailData = getContactFormPayload(contactFormPayload);
        await this.emailService.sendEmail(
            EmailIdentity.contact,
            EmailTemplateIds.contactForm,
            emailData,
        );

        // send an auto-response email from Mundu
        const emailDataReply: ContactFormAutoReplyPayload = {
            name: contactFormPayload.name,
        };

        await this.emailService.sendEmail(
            contactFormPayload.email,
            EmailTemplateIds.contactFormAutoReply,
            emailDataReply,
            EmailIdentity.contact,
        );

        return contactFormPayload;
    }
}
