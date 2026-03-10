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

### 7. Community Support Form (Abiogen Demo)
**`abiogenCommunitySupportForm`**

Experience Cloud support ticket form for the Abiogen Pharma demo. Creates a Salesforce Case directly via `createRecord` with smart pre-fill for authenticated Community users and full guest support.

- **Layout**: Two-column CSS grid — left blue brand panel (`#003399`) with Abiogen logo + "Supporto Tecnico & Logistico" headline; right white form panel with Quicksand font
- **Fields**: Oggetto (Subject), Descrizione (Description), Nome, Email, Telefono
- **Smart pre-fill**: `@wire(getRecord)` on User fields (Name, Email, Phone, ContactId) — pre-fills and disables contact fields when user is logged in (`@salesforce/user/isGuest`)
- **Case creation**: `createRecord` on `Case` object — authenticated users: sets `ContactId` (AccountId resolved automatically); guest users: sets `SuppliedName`, `SuppliedEmail`, `SuppliedPhone`; always sets `Origin='Web'`, `Status='New'`
- **Validation**: inline error messages (no toast — compatible with LWR sites)
- **Success state**: hides form, shows confirmation message + "Apri un altro ticket" reset button
- **Experience Builder**: `formTitle` property configurable by admin; targets `lightningCommunity__Page` + `lightningCommunity__Default`
- **Responsive**: single-column layout on mobile (`max-width: 640px`)

### 8. NDA Automation Card (Abiogen Demo)
**`ndaAutomationCard`** + **`NDAService`** + **`NDADocumentPage`**

Lead Record Page component for the Abiogen Pharma demo. Automates the generation and delivery of a Non-Disclosure Agreement PDF directly from a Salesforce Lead record, then advances the Lead through the sales path.

- **Display logic**: visible only when Lead `Status = 'NDA'`; disappears automatically after advancing
- **Preview section**: shows Company, Contact Name, and Molecule (`Olon_Molecule_Info__c`) that will appear in the document
- **Agentforce Insight box**: styled AI analysis panel simulating Agentforce regulatory intelligence (FDA/EMA target identification)
- **PDF generation**: Apex (`NDAService`) renders a Visualforce page (`NDADocumentPage`) with `renderAs="pdf"`, inserts the result as a `ContentVersion`, and links it to the Lead via `ContentDocumentLink` — file appears in the Lead's **Files** tab
- **Auto-advance**: after successful PDF save, `updateRecord` moves `Status` to `'Credit check'` with no extra Apex
- **Abiogen branding**: logo static resource (`AbiogenLogo`), red `#e30613` color scheme, legal header with Pisa address
- **Error handling**: toast errors for missing required fields, `AuraHandledException` propagation from Apex

### 8. Community Document Vault
**`olonCommunityDocVault`**

Regulatory document library for the Olon Customer Community. Displays API/molecule regulatory documents with real-time search and multi-select category filtering. Themed entirely in Olon Blue (`#0d4b74`).

- **10 mock documents** across molecules: Ibuprofen, Carbamazepine, Omeprazole, Atorvastatin, Metformin HCl, Paracetamol, Clarithromycin, Ranitidine HCl, Sertraline, Venlafaxine HCl
- **DocCode format**: `DOC-YYYYMMDD-Molecule-Type` (e.g., `DOC-20260115-IBU-DMF`)
- **Manufacturing sites**: Rodano, Lodi, Capua
- **Category types**: DMF, CEP, CoA, MSDS, Technical Package — each with a distinct shade of Olon Blue as badge color
- **Multi-select filter pills**: toggle one or more categories; active pills highlight in solid Olon Blue
- **Real-time search**: filters on molecule name and document code simultaneously
- **3-column responsive grid**: SLDS breakpoints (1-of-3 desktop / 1-of-2 tablet / full-width mobile)
- **Card design**: left-border accent, hover lift with shadow (adapted from HLS-KOL-Collaboration pattern)
- **Download PDF button**: Olon Blue fill, fires `ShowToastEvent` confirmation on click
- **Community target**: exposed to `lightningCommunity__Page`, `lightning__AppPage`, `lightning__HomePage`

## Project Structure

```
force-app/
  main/
    default/
      lwc/
        abiogenCommunitySupportForm/   # Community Support Form (Abiogen Demo)
        ndaAutomationCard/             # NDA Automation Card (Abiogen Demo)
        olonApiCatalogSearch/          # API Product Catalog Search
        olonBioNovaRelationshipMap/    # Buyer Relationship Map
        olonCommunityDocVault/         # Community Document Vault
        olonDocRequestMockData/        # Mock data for Document Request Monitor
        olonDocRequestMonitor/         # Document Request Monitor
        olonDocRequestWizard/          # Documentation Request Wizard (4-step)
        olonPartnerMarketingHub/       # Partner Marketing Hub Dashboard
        olonStaleQuotesMockData/       # Mock data for Stale Quotes Monitor
        olonStaleQuotesMonitor/        # Stale Quotes Monitor
      classes/
        NDAService.cls                 # Apex: PDF generation + ContentVersion + ContentDocumentLink
      pages/
        NDADocumentPage.page           # Visualforce PDF template (renderAs="pdf")
      staticresources/
        AbiogenLogo.resource           # Abiogen Pharma PNG logo
```

## Tech Stack

- **Salesforce Lightning Web Components (LWC)**
- **Apex** (NDAService — `@AuraEnabled`, ContentVersion/ContentDocumentLink)
- **Visualforce** (NDADocumentPage — PDF rendering)
- **SLDS** (Salesforce Lightning Design System)
- **API Version**: 65.0
- **Data**: Mix of static mock data and live `uiRecordApi` wire calls

## Deploy

```bash
sf project deploy start --target-org <your-org-alias>
```

## Target Org

- **Alias**: deploy
- **Username**: fra@olon.com
