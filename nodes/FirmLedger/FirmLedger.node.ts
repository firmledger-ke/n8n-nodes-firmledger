import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeApiError,
	NodeConnectionTypes,
	JsonObject,
} from 'n8n-workflow';

export class FirmLedger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'FirmLedger',
		name: 'firmLedger',
		icon: 'file:../../icons/firmledger.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Search and verify businesses on FirmLedger',
		defaults: { name: 'FirmLedger' },
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'firmLedgerApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Account', value: 'account' },
					{ name: 'API', value: 'api' },
					{ name: 'Category', value: 'category' },
					{ name: 'Country', value: 'country' },
					{ name: 'Export', value: 'export' },
					{ name: 'Listing', value: 'listing' },
					{ name: 'My Listing', value: 'myListing' },
					{ name: 'Suggest', value: 'suggest' },
					{ name: 'Verify Domain', value: 'verifyDomain' },
					{ name: 'Webhook', value: 'webhook' },
				],
				default: 'listing',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['api'] } },
				options: [
					{ name: 'Discovery', value: 'discovery', action: 'Get API discovery' },
					{ name: 'Health', value: 'health', action: 'Check API health' },
				],
				default: 'discovery',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['account'] } },
				options: [
					{ name: 'Get Me', value: 'getMe', action: 'Get my account' },
					{ name: 'Get Usage', value: 'getUsage', action: 'Get my usage' },
				],
				default: 'getMe',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['category'] } },
				options: [{ name: 'Get Many', value: 'getMany', action: 'Get many categories' }],
				default: 'getMany',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['country'] } },
				options: [{ name: 'Get Many', value: 'getMany', action: 'Get many countries' }],
				default: 'getMany',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['export'] } },
				options: [{ name: 'Listings CSV', value: 'listingsCsv', action: 'Export listings as CSV' }],
				default: 'listingsCsv',
			},
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				displayOptions: { show: { resource: ['export'], operation: ['listingsCsv'] } },
				default: {},
				options: [
					{ displayName: 'Category', name: 'category', type: 'string', default: '' },
					{ displayName: 'Country', name: 'country', type: 'string', default: '' },
					{ displayName: 'Type', name: 'type', type: 'string', default: '' },
				],
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['listing'] } },
				options: [
					{ name: 'Get', value: 'get', action: 'Get a listing' },
					{ name: 'Get Many', value: 'getMany', action: 'Get many listings' },
				],
				default: 'getMany',
			},
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				displayOptions: { show: { resource: ['listing'], operation: ['getMany'] } },
				default: {},
				options: [
					{ displayName: 'Query', name: 'query', type: 'string', default: '' },
					{ displayName: 'Category', name: 'category', type: 'string', default: '' },
					{ displayName: 'Country', name: 'country', type: 'string', default: '' },
					{ displayName: 'City', name: 'city', type: 'string', default: '' },
				],
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: { show: { resource: ['listing'], operation: ['getMany'] } },
				default: false,
				description: 'Whether to return all results or only up to a given limit',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: { show: { resource: ['listing'], operation: ['getMany'], returnAll: [false] } },
				typeOptions: { minValue: 1 },
				default: 50,
				description: 'Max number of results to return',
			},
			{
				displayName: 'Listing Slug',
				name: 'slug',
				type: 'string',
				displayOptions: { show: { resource: ['listing'], operation: ['get'] } },
				default: '',
				required: true,
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['myListing'] } },
				options: [
					{ name: 'Create', value: 'create', action: 'Create a listing' },
					{ name: 'Delete', value: 'delete', action: 'Delete a listing' },
					{ name: 'Get', value: 'get', action: 'Get a listing I own' },
					{ name: 'Get Many', value: 'getMany', action: 'Get many listings I own' },
					{ name: 'Update', value: 'update', action: 'Update a listing' },
				],
				default: 'getMany',
			},
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				displayOptions: { show: { resource: ['myListing'], operation: ['getMany'] } },
				default: {},
				options: [
					{ displayName: 'Status', name: 'status', type: 'options', default: '', options: [
						{ name: 'Any', value: '' }, { name: 'Approved', value: 'approved' }, { name: 'Pending', value: 'pending' }, { name: 'Rejected', value: 'rejected' }
					]},
				],
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: { show: { resource: ['myListing'], operation: ['getMany'] } },
				default: false,
				description: 'Whether to return all results or only up to a given limit',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: { show: { resource: ['myListing'], operation: ['getMany'], returnAll: [false] } },
				typeOptions: { minValue: 1 },
				default: 50,
				description: 'Max number of results to return',
			},
			{
				displayName: 'Listing ID',
				name: 'myListingId',
				type: 'string',
				displayOptions: { show: { resource: ['myListing'], operation: ['get', 'update', 'delete'] } },
				default: '',
				required: true,
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				displayOptions: { show: { resource: ['myListing'], operation: ['create'] } },
				default: '',
				required: true,
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				displayOptions: { show: { resource: ['myListing'], operation: ['create'] } },
				default: {},
				options: [
					{ displayName: 'Tagline', name: 'tagline', type: 'string', default: '' },
					{ displayName: 'Description', name: 'description', type: 'string', default: '' },
					{ displayName: 'Website', name: 'website', type: 'string', default: '' },
					{ displayName: 'Country', name: 'country', type: 'string', default: '' },
				],
			},
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				displayOptions: { show: { resource: ['myListing'], operation: ['update'] } },
				default: {},
				options: [
					{ displayName: 'Tagline', name: 'tagline', type: 'string', default: '' },
					{ displayName: 'Description', name: 'description', type: 'string', default: '' },
					{ displayName: 'Website', name: 'website', type: 'string', default: '' },
					{ displayName: 'Country', name: 'country', type: 'string', default: '' },
				],
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['suggest'] } },
				options: [{ name: 'Get Suggestions', value: 'getSuggestions', action: 'Get suggestions' }],
				default: 'getSuggestions',
			},
			{
				displayName: 'Query',
				name: 'suggestQuery',
				type: 'string',
				displayOptions: { show: { resource: ['suggest'], operation: ['getSuggestions'] } },
				default: '',
				required: true,
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['verifyDomain'] } },
				options: [{ name: 'Verify', value: 'verify', action: 'Verify a domain' }],
				default: 'verify',
			},
			{
				displayName: 'Domain',
				name: 'domain',
				type: 'string',
				displayOptions: { show: { resource: ['verifyDomain'], operation: ['verify'] } },
				default: '',
				required: true,
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['webhook'] } },
				options: [
					{ name: 'Create', value: 'create', action: 'Create a webhook' },
					{ name: 'Delete', value: 'delete', action: 'Delete a webhook' },
					{ name: 'Get Many', value: 'getMany', action: 'List webhooks' },
					{ name: 'Update', value: 'update', action: 'Update a webhook' },
				],
				default: 'getMany',
			},
			{
				displayName: 'Webhook ID',
				name: 'webhookId',
				type: 'string',
				displayOptions: { show: { resource: ['webhook'], operation: ['update', 'delete'] } },
				default: '',
				required: true,
			},
			{
				displayName: 'Update Fields',
				name: 'webhookUpdateFields',
				type: 'collection',
				placeholder: 'Add Field',
				displayOptions: { show: { resource: ['webhook'], operation: ['update'] } },
				default: {},
				options: [
					{ displayName: 'Label', name: 'label', type: 'string', default: '' },
					{ displayName: 'URL', name: 'url', type: 'string', default: '' },
					{ displayName: 'Events', name: 'events', type: 'string', default: '' },
					{ displayName: 'Categories', name: 'categories', type: 'string', default: '' },
				],
			},
			{
				displayName: 'URL',
				name: 'webhookUrl',
				type: 'string',
				displayOptions: { show: { resource: ['webhook'], operation: ['create'] } },
				default: '',
				required: true,
			},
			{
				displayName: 'Events',
				name: 'webhookEvents',
				type: 'string',
				displayOptions: { show: { resource: ['webhook'], operation: ['create'] } },
				default: '',
				required: true,
				description: 'Comma-separated events (e.g., listing.approved, listing.updated)',
			},
			{
				displayName: 'Additional Fields',
				name: 'webhookAdditionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				displayOptions: { show: { resource: ['webhook'], operation: ['create'] } },
				default: {},
				options: [
					{ displayName: 'Label', name: 'label', type: 'string', default: '' },
					{ displayName: 'Categories', name: 'categories', type: 'string', default: '' },
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		const baseURL = 'https://firmledger.co.ke/api/v1';

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: JsonObject;

				if (resource === 'api' && operation === 'discovery') {
					responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'firmLedgerApi', {
						method: 'GET', url: `${baseURL}`, json: true,
					}) as JsonObject;
				}
				else if (resource === 'api' && operation === 'health') {
					responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'firmLedgerApi', {
						method: 'GET', url: `${baseURL}/health`, json: true,
					}) as JsonObject;
				}
				else if (resource === 'account' && operation === 'getMe') {
					responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'firmLedgerApi', {
						method: 'GET', url: `${baseURL}/me`, json: true,
					}) as JsonObject;
				}
				else if (resource === 'account' && operation === 'getUsage') {
					responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'firmLedgerApi', {
						method: 'GET', url: `${baseURL}/usage`, json: true,
					}) as JsonObject;
				}
				else if (resource === 'category' && operation === 'getMany') {
					responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'firmLedgerApi', {
						method: 'GET', url: `${baseURL}/categories`, json: true,
					}) as JsonObject;
				}
				else if (resource === 'country' && operation === 'getMany') {
					responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'firmLedgerApi', {
						method: 'GET', url: `${baseURL}/countries`, json: true,
					}) as JsonObject;
				}
				else if (resource === 'export' && operation === 'listingsCsv') {
					const filters = this.getNodeParameter('filters', i, {}) as JsonObject;
					const qs: Record<string, string> = {};
					if (filters.category) qs.category = filters.category as string;
					if (filters.country) qs.country = filters.country as string;
					if (filters.type) qs.type = filters.type as string;
					
					const csv = await this.helpers.httpRequestWithAuthentication.call(this, 'firmLedgerApi', {
						method: 'GET', url: `${baseURL}/export/listings.csv`, qs, encoding: 'text',
						headers: { Accept: 'text/csv' },
					}) as string;

					const parseCSV = (text: string) => {
						const rows = []; let currentRow = []; let currentCell = ''; let inQuotes = false;
						for (let c = 0; c < text.length; c++) {
							const char = text[c]; const next = text[c + 1];
							if (char === '"') { if (inQuotes && next === '"') { currentCell += '"'; c++; } else { inQuotes = !inQuotes; } }
							else if (char === ',' && !inQuotes) { currentRow.push(currentCell); currentCell = ''; }
							else if ((char === '\n' || char === '\r') && !inQuotes) {
								if (currentCell !== '' || currentRow.length > 0) { currentRow.push(currentCell); rows.push(currentRow); currentRow = []; currentCell = ''; }
								if (char === '\r' && next === '\n') c++;
							} else { currentCell += char; }
						}
						if (currentCell !== '' || currentRow.length > 0) { currentRow.push(currentCell); rows.push(currentRow); }
						return rows;
					};

					const parsedRows = parseCSV(csv);
					if (parsedRows.length > 1) {
						const headers = parsedRows[0].map((h: string) => h.trim());
						for (let j = 1; j < parsedRows.length; j++) {
							const row = parsedRows[j];
							const item: JsonObject = {};
							headers.forEach((header: string, index: number) => { item[header] = row[index] ? row[index].trim() : ''; });
							returnData.push({ json: item, pairedItem: { item: i } });
						}
					} else {
						returnData.push({ json: { csv: csv }, pairedItem: { item: i } });
					}
					continue;
				}
				else if (resource === 'listing' && operation === 'getMany') {
					const returnAll = this.getNodeParameter('returnAll', i) as boolean;
					const limit = this.getNodeParameter('limit', i, 50) as number;
					const filters = this.getNodeParameter('filters', i, {}) as JsonObject;
					
					const qs: Record<string, string | number> = {
						per_page: returnAll ? 50 : limit,
					};
					if (filters.query) qs.q = filters.query as string;
					if (filters.category) qs.category = filters.category as string;
					if (filters.country) qs.country = filters.country as string;
					if (filters.city) qs.city = filters.city as string;

					let page = 1;
					let totalFetched = 0;
					const allResults: JsonObject[] = [];
					let keepFetching = true;

					while (keepFetching) {
						qs.page = page;
						const response = await this.helpers.httpRequestWithAuthentication.call(this, 'firmLedgerApi', {
							method: 'GET', url: `${baseURL}/listings`, qs, json: true,
						}) as JsonObject;

						const data = (response.data as JsonObject[]) || [];
						for (const item of data) {
							allResults.push(item);
							totalFetched++;
							if (!returnAll && totalFetched >= limit) break;
						}

						if (!returnAll && totalFetched >= limit) keepFetching = false;
						else if (data.length < 50) keepFetching = false;
						else page++;
					}

					for (const item of allResults) {
						returnData.push({ json: item, pairedItem: { item: i } });
					}
					continue;
				} 
				else if (resource === 'listing' && operation === 'get') {
					const slug = this.getNodeParameter('slug', i) as string;
					responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'firmLedgerApi', {
						method: 'GET', url: `${baseURL}/listings/${slug}`, json: true,
					}) as JsonObject;
				}
				else if (resource === 'myListing' && operation === 'getMany') {
					const returnAll = this.getNodeParameter('returnAll', i) as boolean;
					const limit = this.getNodeParameter('limit', i, 50) as number;
					const filters = this.getNodeParameter('filters', i, {}) as JsonObject;
					
					const qs: Record<string, string | number> = {
						per_page: returnAll ? 50 : limit,
					};
					if (filters.status) qs.status = filters.status as string;

					let page = 1;
					let totalFetched = 0;
					const allResults: JsonObject[] = [];
					let keepFetching = true;

					while (keepFetching) {
						qs.page = page;
						const response = await this.helpers.httpRequestWithAuthentication.call(this, 'firmLedgerApi', {
							method: 'GET', url: `${baseURL}/my/listings`, qs, json: true,
						}) as JsonObject;

						const data = (response.data as JsonObject[]) || [];
						for (const item of data) {
							allResults.push(item);
							totalFetched++;
							if (!returnAll && totalFetched >= limit) break;
						}

						if (!returnAll && totalFetched >= limit) keepFetching = false;
						else if (data.length < 50) keepFetching = false;
						else page++;
					}

					for (const item of allResults) {
						returnData.push({ json: item, pairedItem: { item: i } });
					}
					continue;
				}
				else if (resource === 'myListing' && operation === 'get') {
					const id = this.getNodeParameter('myListingId', i) as string;
					responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'firmLedgerApi', {
						method: 'GET', url: `${baseURL}/my/listings/${id}`, json: true,
					}) as JsonObject;
				}
				else if (resource === 'myListing' && operation === 'create') {
					const name = this.getNodeParameter('name', i) as string;
					const additionalFields = this.getNodeParameter('additionalFields', i, {}) as JsonObject;
					
					const body: Record<string, unknown> = { name };
					if (additionalFields.tagline) body.tagline = additionalFields.tagline;
					if (additionalFields.description) body.description = additionalFields.description;
					if (additionalFields.website) body.website = additionalFields.website;
					if (additionalFields.country) body.country = additionalFields.country;

					responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'firmLedgerApi', {
						method: 'POST', url: `${baseURL}/my/listings`, json: true,
						body,
					}) as JsonObject;
				}
				else if (resource === 'myListing' && operation === 'update') {
					const id = this.getNodeParameter('myListingId', i) as string;
					const updateFields = this.getNodeParameter('updateFields', i, {}) as JsonObject;
					const body: Record<string, unknown> = {};
					if (updateFields.tagline) body.tagline = updateFields.tagline;
					if (updateFields.description) body.description = updateFields.description;
					if (updateFields.website) body.website = updateFields.website;
					if (updateFields.country) body.country = updateFields.country;

					responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'firmLedgerApi', {
						method: 'PUT', url: `${baseURL}/my/listings/${id}`, body, json: true,
					}) as JsonObject;
				}
				else if (resource === 'myListing' && operation === 'delete') {
					const id = this.getNodeParameter('myListingId', i) as string;
					responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'firmLedgerApi', {
						method: 'DELETE', url: `${baseURL}/my/listings/${id}`, json: true,
					}) as JsonObject;
				}
				else if (resource === 'suggest' && operation === 'getSuggestions') {
					const q = this.getNodeParameter('suggestQuery', i) as string;
					responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'firmLedgerApi', {
						method: 'GET', url: `${baseURL}/suggest`, qs: { q }, json: true,
					}) as JsonObject;
				}
				else if (resource === 'verifyDomain' && operation === 'verify') {
					const domain = this.getNodeParameter('domain', i) as string;
					responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'firmLedgerApi', {
						method: 'GET', url: `${baseURL}/verify/domain/${domain}`, json: true,
					}) as JsonObject;
				}
				else if (resource === 'webhook' && operation === 'getMany') {
					responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'firmLedgerApi', {
						method: 'GET', url: `${baseURL}/webhooks`, json: true,
					}) as JsonObject;
				}
				else if (resource === 'webhook' && operation === 'create') {
					const url = this.getNodeParameter('webhookUrl', i) as string;
					const eventsRaw = this.getNodeParameter('webhookEvents', i) as string;
					const additionalFields = this.getNodeParameter('webhookAdditionalFields', i, {}) as JsonObject;
					
					const events = eventsRaw ? eventsRaw.split(',').map((e: string) => e.trim()) : [];
					const body: Record<string, unknown> = { url, events };
					
					if (additionalFields.label) body.label = additionalFields.label;
					if (additionalFields.categories) {
						body.categories = (additionalFields.categories as string).split(',').map((c: string) => c.trim());
					}

					responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'firmLedgerApi', {
						method: 'POST', url: `${baseURL}/webhooks`, json: true,
						body,
					}) as JsonObject;
				}
				else if (resource === 'webhook' && operation === 'update') {
					const id = this.getNodeParameter('webhookId', i) as string;
					const updateFields = this.getNodeParameter('webhookUpdateFields', i, {}) as JsonObject;
					const body: Record<string, unknown> = {};
					if (updateFields.label) body.label = updateFields.label;
					if (updateFields.url) body.url = updateFields.url;
					if (updateFields.events) body.events = (updateFields.events as string).split(',').map((e: string) => e.trim());
					if (updateFields.categories) body.categories = (updateFields.categories as string).split(',').map((c: string) => c.trim());

					responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'firmLedgerApi', {
						method: 'PATCH', url: `${baseURL}/webhooks/${id}`, body, json: true,
					}) as JsonObject;
				}
				else if (resource === 'webhook' && operation === 'delete') {
					const id = this.getNodeParameter('webhookId', i) as string;
					responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'firmLedgerApi', {
						method: 'DELETE', url: `${baseURL}/webhooks/${id}`, json: true,
					}) as JsonObject;
				}
				else {
					throw new NodeApiError(this.getNode(), { message: 'Invalid operation' }, { itemIndex: i });
				}

				if (Array.isArray(responseData?.data)) {
					for (const item of responseData.data) {
						returnData.push({ json: item as JsonObject, pairedItem: { item: i } });
					}
				} else if (responseData?.data) {
					returnData.push({ json: responseData.data as JsonObject, pairedItem: { item: i } });
				} else {
					returnData.push({ json: responseData, pairedItem: { item: i } });
				}

			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
					continue;
				}
				throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex: i });
			}
		}
		return [returnData];
	}
}
