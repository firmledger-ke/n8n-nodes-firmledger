# n8n-nodes-firmledger

This is an n8n community node for [FirmLedger](https://firmledger.co.ke), the business record layer for modern discovery.

It allows you to search, retrieve, and manage verified business listings directly from your n8n workflows.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

- **Account**
  - Get Me
  - Get Usage
- **API**
  - Discovery
  - Health
- **Category**
  - Get Many
- **Country**
  - Get Many
- **Export**
  - Listings CSV
- **Listing**
  - Get
  - Get Many
- **My Listing**
  - Create
  - Delete
  - Get
  - Get Many
  - Update
- **Suggest**
  - Get Suggestions
- **Verify Domain**
  - Verify
- **Webhook**
  - Create
  - Delete
  - Get Many
  - Update

## Credentials

To use this node, you need a FirmLedger API key.

1. Sign in to your FirmLedger account.
2. Navigate to **Dashboard → Developer API**.
3. Generate a new API key.
4. Paste the key into the **API Key** credential field in n8n.

## Usage Example

Here is a simple workflow to find verified fintech companies in Kenya.

1. Add the **FirmLedger** node to your workflow.
2. Select **Resource**: `Listing`.
3. Select **Operation**: `Get Many`.
4. Under **Filters**, add:
   - **Query**: `fintech`
   - **Country**: `Kenya`
5. Execute the node.

**Sample Output:**

```json
[
  {
    "id": "452",
    "name": "Safiri Fintech",
    "slug": "safiri-fintech",
    "category": "Fintech",
    "country": "Kenya",
    "confidence": 72,
    "status": "approved",
    "url": "https://firmledger.co.ke/listing/safiri-fintech"
  }
]
```

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [FirmLedger API documentation](https://firmledger.co.ke/docs/api)
