"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirmLedgerApi = void 0;
class FirmLedgerApi {
    constructor() {
        this.name = 'firmLedgerApi';
        this.displayName = 'FirmLedger API';
        this.icon = 'file:../icons/firmledger.svg';
        this.documentationUrl = 'https://firmledger.co.ke/api';
        this.properties = [
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
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    Authorization: '=Bearer {{$credentials.apiKey}}',
                },
            },
        };
        this.test = {
            request: {
                baseURL: 'https://firmledger.co.ke/api/v1',
                url: '/health',
            },
        };
    }
}
exports.FirmLedgerApi = FirmLedgerApi;
//# sourceMappingURL=FirmLedgerApi.credentials.js.map