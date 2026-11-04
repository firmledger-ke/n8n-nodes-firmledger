# n8n-nodes-firmledger

This is an n8n community node for [FirmLedger](https://firmledger.co.ke), the business record layer for modern discovery.

It allows you to search, retrieve, and manage verified business listings directly from your n8n workflows.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

- **Listing**
  - Search
  - Get
  - Create
  - Update
  - Delete
- **Domain**
  - Verify
- **Autocomplete**
  - Get Suggestions

## Credentials

To use this node, you need a FirmLedger API key.
1. Sign in to your FirmLedger account.
2. Navigate to **Dashboard → Developer API**.
3. Generate a new API key.
4. Paste the key into the **API Key** credential field in n8n.

## Usage

1. Add the FirmLedger node to your workflow.
2. Select the **Resource** you want to interact with (e.g., `Listing`).
3. Select the **Operation** (e.g., `Search`).
4. Enter your search parameters (e.g., "Safaricom").
5. Execute the node to see the results.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [FirmLedger API documentation](https://firmledger.co.ke/docs/api)
