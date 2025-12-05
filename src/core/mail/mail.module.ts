import { Module } from '@nestjs/common';

import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';
import { Client } from '@microsoft/microsoft-graph-client';
import { ClientSecretCredential } from '@azure/identity';
import 'isomorphic-fetch';

import { MailController } from './mail.controller';

@Module({
    controllers: [MailController],
    providers: [
        MailService,
        {
            provide: 'GRAPH_CLIENT',
            useFactory: async (configService: ConfigService) => {
                const tenantId = configService.get<string>('AZURE_TENANT_ID');
                const clientId = configService.get<string>('AZURE_CLIENT_ID');
                const clientSecret = configService.get<string>('AZURE_CLIENT_SECRET');

                if (!tenantId || !clientId || !clientSecret) {
                    console.error('Azure credentials are missing in .env');
                    return null;
                }

                const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);

                return Client.initWithMiddleware({
                    authProvider: {
                        getAccessToken: async () => {
                            const token = await credential.getToken('https://graph.microsoft.com/.default');
                            return token.token;
                        },
                    },
                });
            },
            inject: [ConfigService],
        },
    ],
    exports: [MailService],
})
export class MailModule { }
