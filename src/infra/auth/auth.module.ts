import { HttpModule, Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AzureADStrategy } from './aad.strategy';
import { I7DigitalService } from './7digital.service';
import { MSALService } from './msal.service';
import { PassportModule } from '@nestjs/passport';
import { REQUEST } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '@src/infra/user/user.repository';

@Module({
    imports: [
        HttpModule.registerAsync({
            // Set authorization request header when sends request to proxy server
            useFactory: request => {
                return {
                    headers: {
                        Authorization: request.headers.authorization,
                    },
                };
            },
            inject: [REQUEST],
        }),
        PassportModule,
        TypeOrmModule.forFeature([UserRepository]),
    ],
    providers: [AuthService, MSALService, I7DigitalService, AzureADStrategy],
    exports: [AuthService, MSALService, I7DigitalService],
})
export class AuthModule {}
