import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
	Icon,
} from 'n8n-workflow';

export class FirmLedgerApi implements ICredentialType {
	name = 'firmLedgerApi';
	displayName = 'FirmLedger API';
	icon: Icon = 'file:../icons/firmledger.svg';
	documentationUrl = 'https://firmledger.co.ke/api';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your FirmLedger API key (fl_live_...)',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://firmledger.co.ke/api/v1',
			url: '/health',
		},
	};
}
