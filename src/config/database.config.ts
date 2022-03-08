import { registerAs } from '@nestjs/config';
import { parseEnvBool } from './helper';

export default registerAs('database', () => ({
    driver: 'mongodb' as const,
    type: process.env.DATABASE_TYPE,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || undefined,
    db_name: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    auth_source: process.env.DATABASE_AUTH_SOURCE,
    ssl: parseEnvBool(process.env.DATABASE_SSL),
}));
