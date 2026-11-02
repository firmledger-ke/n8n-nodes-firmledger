import {
	NodeConnectionTypes,
	NodeOperationError,
	type IExecuteFunctions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
	type JsonObject,
} from 'n8n-workflow';

const MCP_ENDPOINT = 'https://mcp.firmledger.co.ke/mcp';

export class FirmLedger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'FirmLedger',
		name: 'firmLedger',
		icon: {
			light: 'file:../../icons/firmledger.svg',
			dark: 'file:../../icons/firmledger.dark.svg',
		},
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Search and verify businesses on FirmLedger',
		defaults: {
			name: 'FirmLedger',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'firmLedgerOAuth2Api',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Execute Tool',
						value: 'executeTool',
						description: 'Execute a specific MCP tool',
						action: 'Execute an MCP tool',
					},
					{
						name: 'List Tools',
						value: 'listTools',
						description: 'List all MCP tools available on FirmLedger',
						action: 'List all MCP tools',
					},
				],
				default: 'listTools',
			},
			{
				displayName: 'Tool Name',
				name: 'toolName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: ['executeTool'],
					},
				},
				description: 'The name of the tool to call (e.g. search_listings)',
			},
			{
				displayName: 'Arguments',
				name: 'arguments',
				type: 'json',
				default: '{}',
				displayOptions: {
					show: {
						operation: ['executeTool'],
					},
				},
				description: 'JSON arguments for the tool',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;

				let body: JsonObject;

				if (operation === 'listTools') {
					body = {
						jsonrpc: '2.0',
						id: 1,
						method: 'tools/list',
						params: {},
					};
				} else {
					const toolName = this.getNodeParameter('toolName', i) as string;
					const argsRaw = this.getNodeParameter('arguments', i);

					let args: JsonObject;
					if (typeof argsRaw === 'string') {
						try {
							args = JSON.parse(argsRaw) as JsonObject;
						} catch {
							throw new NodeOperationError(this.getNode(), 'Arguments is not valid JSON', { itemIndex: i });
						}
					} else {
						args = argsRaw as JsonObject;
					}

					body = {
						jsonrpc: '2.0',
						id: 1,
						method: 'tools/call',
						params: {
							name: toolName,
							arguments: args,
						},
					};
				}

				const response = (await this.helpers.httpRequestWithAuthentication.call(
					this,
					'firmLedgerOAuth2Api',
					{
						method: 'POST',
						url: MCP_ENDPOINT,
						body,
						json: true,
						headers: {
							'Content-Type': 'application/json',
							Accept: 'application/json, text/event-stream',
						},
					},
				)) as JsonObject;

				const err = response?.error as JsonObject | undefined;
				if (err) {
					throw new NodeOperationError(
						this.getNode(),
						`FirmLedger MCP error: ${String(err.message ?? 'unknown')}`,
						{ itemIndex: i },
					);
				}

				const result = response?.result ?? response;
				returnData.push({ json: result as JsonObject, pairedItem: { item: i } });
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
