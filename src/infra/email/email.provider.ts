import { ConfigType } from '@nestjs/config';
import { MailService } from '@sendgrid/mail';
import MailConfig from '@src/config/mail.config';

export const mailProvider = {
    provide: 'sendGrid',
    useFactory: (config: ConfigType<typeof MailConfig>): MailService => {
        const mail = new MailService();
        mail.setApiKey(config.SENDGRID_API_KEY);
        mail.setTimeout(5000);
        return mail;
    },
    inject: [MailConfig.KEY],
};
