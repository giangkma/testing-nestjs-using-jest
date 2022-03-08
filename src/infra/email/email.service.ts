import { Inject, Injectable } from '@nestjs/common';
import { MailService, MailDataRequired } from '@sendgrid/mail';

export enum EmailTemplateIds {
    newVideoNotification = 'd-1a2e161713bf41f3bf1f88355da3bf5b',
    newImagesNotification = 'd-f0431838faf942799dac4af91270ce56',
    inviteOrganization = 'd-0a9629d918ed42778675dca5c468aee1',
    inviteNextOfKin = 'd-dc4e06eae26f4ce1bbf5153dfcdd9261',
    inviteCreator = 'd-b8cb4d0db7024ac0afc6e2eac3d56cb9',
    contactForm = 'd-30bcbda9130c4e499a752eb7a06ef9b5',
    contactFormAutoReply = 'd-353ac353e73d49ac8f91b5d56af19664',
}

export enum EmailIdentity {
    sender = 'no-reply@mundu.no',
    support = 'support@mundu.no',
    contact = 'hello@mundu.no',
}

@Injectable()
export class EmailService {
    constructor(
        @Inject('sendGrid')
        private emailService: MailService,
    ) {}

    async sendEmail(
        to: string,
        templateId: EmailTemplateIds,
        templateData?: Record<string, any>,
        from?: string,
    ): Promise<void> {
        try {
            const msg: MailDataRequired = {
                to,
                from: from ?? EmailIdentity.sender,
                templateId,
                dynamicTemplateData: {
                    ...templateData,
                    support_identity: EmailIdentity.support,
                },
            };
            await this.emailService.send(msg);
        } catch (error) {
            console.error(error);
            if (error.response) {
                console.error(error.response.body);
            }
        }
    }
}
