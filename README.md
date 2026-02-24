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

### 5. API Product Catalog Search
**`olonApiCatalogSearch`**

Advanced pharmaceutical product catalog for Olon's Customer Community. Enables technical buyers to search and filter API/CDMO molecules with real-time filtering and regulatory status visualization.

- **Real-time search**: Full-text search across molecule name, CAS number, and therapeutic area
- **Category filters**: Toggle buttons for HPAPI, Peptides, and Generic categories (multi-select)
- **Site filters**: Toggle buttons for manufacturing sites — Rodano (highlighted in orange as key HPAPI/Peptides site), Lodi, Capua
- **Product cards**: Responsive grid (1 col mobile / 2 col tablet / 3 col desktop) with regulatory status badges
- **Regulatory badges**: Color-coded — green for US/JP DMF Active, blue for CEP Available, gray for no filing
- **Request Documents**: Each card fires a `docrequest` custom event with `productId` and `productName`
- **Configurable**: `catalogTitle` and `hideSiteFilters` properties editable in Lightning App Builder
- **Empty state**: Friendly no-results panel when search/filters return zero products
- **CDA footer**: Confidentiality reminder on all views

### 6. Partner Marketing Hub
**`olonPartnerMarketingHub`**

Marketing dashboard for Olon partners and dealers to align on communication strategy and joint customer reach. 2-column responsive layout with 4 interactive sections.

- **Communication Preferences**: 4 live toggles (Regulatory Updates, Product Tech Sheets, Site Availability Rodano, Sustainability Reports) that instantly update the engagement score
- **Latest Brand Interactions**: Scrollable list of recent emails with status icons — blue for Opened (`utility:email`), green for Clicked (`utility:touch_action`), default for Sent (`utility:check`)
- **Unreached Joint Customers**: Alert panel with red count badge listing end-customers (BioPharma Ltd, MedSynth AG, EuroChem Pharma, Aleph Biotech) who have not received the latest Regulatory Change journey
- **Partner Engagement Score**: Live `lightning-progress-ring` (0–100) computed from active preferences (×10 each) + interaction history weights (Clicked=15, Opened=10, Sent=5). Variant switches to `base-autocomplete` (green) at score ≥75

## Project Structure

```
force-app/
  main/
    default/
      lwc/
        olonApiCatalogSearch/          # API Product Catalog Search
        olonBioNovaRelationshipMap/    # Buyer Relationship Map
        olonDocRequestMockData/        # Mock data for Document Request Monitor
        olonDocRequestMonitor/         # Document Request Monitor
        olonDocRequestWizard/          # Documentation Request Wizard (4-step)
        olonPartnerMarketingHub/       # Partner Marketing Hub Dashboard
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
