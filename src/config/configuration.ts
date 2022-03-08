import { registerAs } from '@nestjs/config';

export const IS_TEST = process.env.NODE_ENV === 'test';

export default registerAs('configuration', () => ({
    app_name: process.env.APP_NAME || 'Alight Server',
    app_proxy: process.env.APP_PROXY || 'https://samla-proxy.azurewebsites.net',
    port: parseInt(process.env.PORT, 10) || 3000,
}));
