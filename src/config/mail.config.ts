import { registerAs } from '@nestjs/config';

export default registerAs('sendGrid', () => ({
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
}));
