import { BearerStrategy, IProfile } from 'passport-azure-ad';
import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import AzureADConfig from '@src/config/azureAD.config';
import { ConfigType } from '@nestjs/config';
import { Request } from 'express';
import { AuthService } from '@src/infra/auth/auth.service';
import { UserModel } from '../database/model';

@Injectable()
export class AzureADStrategy extends PassportStrategy(BearerStrategy, 'aad') {
    constructor(
        @Inject(AzureADConfig.KEY)
        private readonly azureADConfig: ConfigType<typeof AzureADConfig>,
        private readonly authService: AuthService,
    ) {
        super({
            identityMetadata: `https://${azureADConfig.tenant_name}.b2clogin.com/${azureADConfig.tenant_name}.onmicrosoft.com/v2.0/.well-known/openid-configuration`,
            clientID: azureADConfig.client_id,
            audience: azureADConfig.client_id,
            policyName: 'B2C_1_signin',
            isB2C: true,
            validateIssuer: false,
            loggingLevel: false,
            passReqToCallback: true,
        });
    }

    async validate(req: Request, b2cUser: IProfile): Promise<UserModel | null> {
        // get corresponding an user from samla db
        const userModel = await this.authService.getUserById(b2cUser.oid);

        if (!userModel) {
            throw new UnauthorizedException();
        }

        return userModel;
    }
}
