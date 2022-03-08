import { registerAs } from '@nestjs/config';

export default registerAs('azureAD', () => ({
    client_id: process.env.AZURE_AD_CLIENT_ID,
    client_secret: process.env.AZURE_AD_CLIENT_SECRET,
    tenant: process.env.AZURE_AD_TENANT,
    tenant_name: process.env.AZURE_AD_TENANT_NAME,
    authority_domain: process.env.AZURE_AD_AUTHORITY_DOMAIN,
    policy_name: process.env.AZURE_AD_POLICY_NAME,
    scopes: process.env.AZURE_AD_SCOPES,
    ms_graph_rest_api: process.env.MS_GRAPH_REST_API_URL,
}));
