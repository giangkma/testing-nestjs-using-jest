import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import APIConfig from '@src/config/api.config';
import AzureADConfig from '@src/config/azureAD.config';
import Configuration, { IS_TEST } from '@src/config/configuration';
import {
    default as DatabaseConfig,
    default as DBConfig,
} from '@src/config/database.config';
import StorageConfig from '@src/config/storage.config';
import { AuthModule } from '@src/infra/auth/auth.module';
// init auto mapper instance
// can't use nest dependency injection since we need to use mapper inside typeorm's custom repositories
import '@src/infra/autoMapper';
import * as DBModels from '@src/infra/database/model';
import {
    AuthenticationModule,
    CommonMediaModule,
    ConsumerModule,
    ContactModule,
    CreatorModule,
    InCompleteSessionModule,
    NextOfKinModule,
    OrganizationModule,
    PersonalMediaModule,
    SessionLogModule,
    SessionModule,
} from '@src/interfaces/http/rest/api_v1/routeModules';
import { ApplicationExceptionFilter } from '@src/interfaces/shared/exceptions/httpException.filter';
import MailConfig from './config/mail.config';
import { EmailModule } from './infra/email/email.module';
import { AdminModule } from './interfaces/http/rest/api_v1/admin/admin.module';

@Module({
    imports: [
        // setup config module
        ConfigModule.forRoot({
            load: [
                Configuration,
                APIConfig,
                DatabaseConfig,
                AzureADConfig,
                MailConfig,
                StorageConfig,
            ],
            isGlobal: true,
            envFilePath: IS_TEST ? '.test.env' : '.env',
        }),
        TypeOrmModule.forRootAsync({
            useFactory: async (dbConfig: ConfigType<typeof DBConfig>) => {
                return {
                    useUnifiedTopology: true,
                    type: dbConfig.driver,
                    // manually construct connection string for now since
                    // typeorm having problem with mongodb connection https://github.com/typeorm/typeorm/issues/7009
                    url: `mongodb+srv://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}/${dbConfig.db_name}`,
                    // host: dbConfig.host,
                    // port: dbConfig.port,
                    // database: dbConfig.db_name,
                    // username: dbConfig.username,
                    // password: dbConfig.password,
                    // auth source admin if using admin authentication
                    authSource: dbConfig.auth_source,
                    // manual add entities since auto load doesn't work with customer repository
                    entities: Object.values(DBModels),
                    ssl: dbConfig.ssl,
                    synchronize: true,
                    useNewUrlParser: true,
                };
            },
            inject: [DBConfig.KEY],
        }),
        // resource modules
        AuthenticationModule,
        AdminModule,
        CreatorModule,
        ConsumerModule,
        NextOfKinModule,
        OrganizationModule,
        SessionModule,
        PersonalMediaModule,
        CommonMediaModule,
        SessionLogModule,
        InCompleteSessionModule,
        ContactModule,
        // infra modules
        AuthModule,
        EmailModule,
    ],
    controllers: [],
    providers: [
        {
            provide: APP_FILTER,
            useClass: ApplicationExceptionFilter,
        },
    ],
})
export class AppModule {}
