# Olon Demo - Lightning Web Components

Salesforce LWC components built for the Olon demo org using vibe coding with Claude Code.

## Components

### 1. Buyer Relationship Map
**`olonBioNovaRelationshipMap`**

Visual relationship map that displays the BioNova Pharmaceuticals account hierarchy with contact sentiment indicators. Shows a tree/graph structure with SVG connection lines, where each contact node has a colored border representing sentiment (green = positive, yellow = neutral, red = negative).

- **Root**: BioNova Pharmaceuticals (Global HQ - Boston, USA)
- **Subsidiaries**: BioNova Italy, BioNova Germany, BioNova USA
- **Contacts**: Elena Bianchi, Hans Schmidt, Marcus Thorne

### 2. Stale Quotes Monitor
**`olonStaleQuotesMonitor`** + **`olonStaleQuotesMockData`**

Dashboard component that monitors outstanding quotes that haven't received a customer response. Features a searchable data table with columns for account, quote number, type, manufacturing site, sent date, days outstanding, amount (EUR), and status. Quotes outstanding for more than 90 days are highlighted in red. Includes follow-up actions and refresh capabilities.

### 3. Document Request Monitor
**`olonDocRequestMonitor`** + **`olonDocRequestMockData`**

Dashboard component that tracks documentation requests across accounts. Displays a searchable data table with columns for account, document type, request date, stage, assigned owner, and age in days. Stage colors indicate urgency based on request age. Supports view details actions, refresh, and new request creation.

## Project Structure

```
force-app/
  main/
    default/
      lwc/
        olonBioNovaRelationshipMap/    # Buyer Relationship Map
        olonDocRequestMockData/        # Mock data for Document Request Monitor
        olonDocRequestMonitor/         # Document Request Monitor
        olonStaleQuotesMockData/       # Mock data for Stale Quotes Monitor
        olonStaleQuotesMonitor/        # Stale Quotes Monitor
```

## Tech Stack

- **Salesforce Lightning Web Components (LWC)**
- **SLDS** (Salesforce Lightning Design System)
- **API Version**: 62.0
- **Data**: Static mock data (no Apex/wire calls)

## Deploy

```bash
sf project deploy start --target-org <your-org-alias>
```

## Target Org

- **Alias**: deploy
- **Username**: fra@olon.com
