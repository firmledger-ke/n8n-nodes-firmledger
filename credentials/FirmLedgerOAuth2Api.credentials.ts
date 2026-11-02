import type { Icon, ICredentialType, INodeProperties } from 'n8n-workflow';

export class FirmLedgerOAuth2Api implements ICredentialType {
	name = 'firmLedgerOAuth2Api';
	extends = ['oAuth2Api'];
	displayName = 'FirmLedger OAuth2 API';
	icon: Icon = { light: 'file:../icons/firmledger.svg', dark: 'file:../icons/firmledger.dark.svg' };
	documentationUrl = 'https://firmledger.co.ke/docs/mcp';

	properties: INodeProperties[] = [
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'hidden',
			default: 'authorizationCode',
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'hidden',
			default: 'https://firmledger.co.ke/oauth/authorize',
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
			default: 'https://mcp.firmledger.co.ke/oauth/token',
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			default: 'mcp read:account write:account',
		},
		{
			displayName: 'Auth URI Query Parameters',
			name: 'authQueryParameters',
			type: 'hidden',
			default: 'response_type=code',
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'hidden',
			default: 'header',
		},
	];
}
