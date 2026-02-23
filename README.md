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

### 4. Documentation Request Wizard
**`olonDocRequestWizard`**

A guided 4-step wizard for submitting regulated technical documentation requests (DMF, CoA, CEP) on API products, designed for the Chemical-Pharmaceutical Community portal. 100% SLDS-compliant — no custom CSS, native Salesforce white-label look and feel.

- **Step 1 — Molecule Selection**: Combobox to select the active pharmaceutical ingredient (API): Peptide Complex X, HPAPI Alpha-1, Historical Peptide Z
- **Step 2 — Document Dossier**: Checkbox selection for Drug Master File (DMF), Certificate of Analysis (CoA), and Certificate of Suitability (CEP), each with regulatory icons
- **Step 3 — Regulatory Details**: Picklist for target market (USA-FDA, EU-EMA, China-NMPA) and a free-text Project Scope field
- **Step 4 — Review**: Read-only summary of all selections before submission
- **Submit Flow**: 2-second loading spinner simulating server-side save, followed by a success screen displaying the generated request ID (`REQ-2026-084`)
- **CDA Disclaimer**: Persistent footer on all steps reminding users of mandatory Confidentiality Agreement terms

## Project Structure

```
force-app/
  main/
    default/
      lwc/
        olonBioNovaRelationshipMap/    # Buyer Relationship Map
        olonDocRequestMockData/        # Mock data for Document Request Monitor
        olonDocRequestMonitor/         # Document Request Monitor
        olonDocRequestWizard/          # Documentation Request Wizard (4-step)
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
