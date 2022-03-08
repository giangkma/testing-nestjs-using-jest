import { ConfidentialClientApplication, LogLevel } from '@azure/msal-node';

import { Injectable, Inject, HttpService, HttpException } from '@nestjs/common';
import AzureADConfig from '@src/config/azureAD.config';
import { ConfigType } from '@nestjs/config';
import { AxiosResponse, AxiosRequestConfig } from 'axios';
import { map } from 'rxjs/operators';

export enum B2CSignInType {
    userName = 'userName',
    emailAddress = 'emailAddress',
    federated = 'federated',
}

export interface CreateB2CUserPayload {
    firstName: string;
    lastName: string;
    username: string;
    signInType: B2CSignInType;
    initialPassword: string;
    forceChangePasswordNextSignIn?: boolean;
}

export interface B2CUserInfo {
    id: string;
    businessPhones: string[];
    displayName: string;
    givenName: string;
    jobTitle: string;
    mail: string;
    mobilePhone: string;
    officeLocation: string;
    preferredLanguage: string;
    surname: string;
    userPrincipalName: string;
}

@Injectable()
export class MSALService {
    constructor(
        @Inject(AzureADConfig.KEY)
        private readonly azureADConfig: ConfigType<typeof AzureADConfig>,
        private httpService: HttpService,
    ) {}

    /**
     * Acquire token by client credential
     * @return {string}
     * @memberof MSALService
     */
    async acquireTokenByClientCredential(): Promise<string> {
        // setup client credentials
        const config = {
            auth: {
                clientId: this.azureADConfig.client_id,
                authority: `${this.azureADConfig.authority_domain}/${this.azureADConfig.tenant}`,
                clientSecret: this.azureADConfig.client_secret,
            },
            system: {
                loggerOptions: {
                    loggerCallback(loglevel, message) {
                        console.log(message);
                    },
                    piiLoggingEnabled: false,
                    logLevel: LogLevel.Verbose,
                },
            },
        };

        // Initialize the app object
        const cca = new ConfidentialClientApplication(config);

        // Configure sign in request
        const clientCredentialRequest = {
            scopes: [`${this.azureADConfig.scopes}`],
        };

        const res = await cca.acquireTokenByClientCredential(
            clientCredentialRequest,
        );

        return res.accessToken;
    }

    /**
     * Get all B2C users
     */
    async getB2CUsers(): Promise<any> {
        try {
            const config = await this.getHeaderRequest();

            return await this.httpService
                .get(`${this.azureADConfig.ms_graph_rest_api}/users`, config)
                .pipe(map(this.serializeHttpResponse))
                .toPromise();
        } catch (e) {
            throw new HttpException(
                e.response.data.error.message,
                e.response.status,
            );
        }
    }

    /**
     * Create B2C user
     *
     * @param {CreateB2CUserPayload} payload
     * @memberof MSALService
     */
    async createB2CUser(payload: CreateB2CUserPayload): Promise<any> {
        try {
            const config = await this.getHeaderRequest({
                'Content-Type': 'application/json',
            });

            const newB2CUser = {
                accountEnabled: true,
                displayName: `${payload.firstName} ${payload.lastName}`,
                givenName: payload.firstName,
                surname: payload.lastName,
                identities: [
                    {
                        signInType: payload.signInType,
                        issuer: 'samlaB2C.onmicrosoft.com',
                        issuerAssignedId: payload.username,
                    },
                ],
                passwordProfile: {
                    forceChangePasswordNextSignIn:
                        payload.forceChangePasswordNextSignIn,
                    password: payload.initialPassword,
                },
                passwordPolicies: 'DisablePasswordExpiration',
            };

            return await this.httpService
                .post(
                    `${this.azureADConfig.ms_graph_rest_api}/users`,
                    newB2CUser,
                    config,
                )
                .pipe(map(this.serializeHttpResponse))
                .toPromise();
        } catch (e) {
            throw new HttpException(
                e.response.data.error.message,
                e.response.status,
            );
        }
    }

    /**
     * Delete B2C user
     */
    async deleteB2CUser(id: string): Promise<any> {
        try {
            const config = await this.getHeaderRequest();

            return await this.httpService
                .delete(
                    `${this.azureADConfig.ms_graph_rest_api}/users/${id}`,
                    config,
                )
                .pipe(map(this.serializeHttpResponse))
                .toPromise();
        } catch (e) {
            throw new HttpException(
                e.response.data.error.message,
                e.response.status,
            );
        }
    }

    private serializeHttpResponse(res: AxiosResponse) {
        return {
            headers: res.headers,
            data: res.data,
        };
    }

    /**
     * Set authorization to header request
     *
     * @param {Record<string, string>} contentType
     * @returns {Promise<AxiosRequestConfig>}
     * @memberof MSALService
     */
    async getHeaderRequest(
        contentType?: Record<string, string>,
    ): Promise<AxiosRequestConfig> {
        const accessToken = await this.acquireTokenByClientCredential();

        let headers = {
            Authorization: `Bearer ${accessToken}`,
        };

        if (contentType) {
            headers = { ...headers, ...contentType };
        }

        return {
            headers,
        };
    }
}
