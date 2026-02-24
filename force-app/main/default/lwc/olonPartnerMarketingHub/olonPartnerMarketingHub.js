import { LightningElement, track } from 'lwc';

// ── Module-level constants ──────────────────────────────────────────────────

const BRAND_INTERACTIONS = [
    {
        id: 'int-001',
        subject: 'Update on DMF Peptide X',
        date: 'Feb 20, 2026',
        status: 'Opened',
        icon: 'utility:email',
        iconVariant: 'brand'
    },
    {
        id: 'int-002',
        subject: 'Q1 API Catalog 2026',
        date: 'Feb 18, 2026',
        status: 'Clicked',
        icon: 'utility:touch_action',
        iconVariant: 'success'
    },
    {
        id: 'int-003',
        subject: 'CEP Renewal - HPAPI Alpha-1',
        date: 'Feb 15, 2026',
        status: 'Sent',
        icon: 'utility:check',
        iconVariant: ''
    },
    {
        id: 'int-004',
        subject: 'Sustainability Report Q4 2025',
        date: 'Feb 10, 2026',
        status: 'Opened',
        icon: 'utility:email',
        iconVariant: 'brand'
    },
    {
        id: 'int-005',
        subject: 'Rodano Site Capacity Update',
        date: 'Feb 05, 2026',
        status: 'Clicked',
        icon: 'utility:touch_action',
        iconVariant: 'success'
    }
];

const UNREACHED_CUSTOMERS = [
    {
        id: 'cust-001',
        name: 'BioPharma Ltd',
        pendingJourney: 'Regulatory Change',
        area: 'Oncology'
    },
    {
        id: 'cust-002',
        name: 'MedSynth AG',
        pendingJourney: 'Regulatory Change',
        area: 'Neurology'
    },
    {
        id: 'cust-003',
        name: 'EuroChem Pharma',
        pendingJourney: 'CEP Expiry Alert',
        area: 'Cardiology'
    },
    {
        id: 'cust-004',
        name: 'Aleph Biotech',
        pendingJourney: 'Q1 API Catalog',
        area: 'Endocrinology'
    }
];

// Interaction engagement score weights
const SCORE_MAP = { Clicked: 15, Opened: 10, Sent: 5 };

// Initial toggle states — @track can default to true (restriction applies only to @api)
const INITIAL_PREFERENCES = {
    regulatoryUpdates: true,
    productTechSheets: true,
    siteAvailability: false,
    sustainabilityReports: false
};

// ── Component class ─────────────────────────────────────────────────────────

export default class OlonPartnerMarketingHub extends LightningElement {

    @track _preferences = { ...INITIAL_PREFERENCES };

    // ── Static data getters ────────────────────────────────────────────────

    get brandInteractions() {
        return BRAND_INTERACTIONS;
    }

    get unreachedCustomers() {
        return UNREACHED_CUSTOMERS;
    }

    get unreachedCount() {
        return UNREACHED_CUSTOMERS.length;
    }

    // ── Engagement score ───────────────────────────────────────────────────

    get engagementScore() {
        const prefScore =
            Object.values(this._preferences).filter((v) => v).length * 10;
        const interactionScore = Math.min(
            BRAND_INTERACTIONS.reduce(
                (acc, item) => acc + (SCORE_MAP[item.status] || 0),
                0
            ),
            60
        );
        return Math.min(prefScore + interactionScore, 100);
    }

    get engagementScoreLabel() {
        const score = this.engagementScore;
        if (score >= 75) return 'Excellent';
        if (score >= 50) return 'Good';
        if (score >= 25) return 'Fair';
        return 'Low';
    }

    get engagementRingVariant() {
        return this.engagementScore >= 75 ? 'base-autocomplete' : '';
    }

    // ── Toggle handler ─────────────────────────────────────────────────────

    handlePreferenceChange(event) {
        const key = event.target.dataset.key;
        this._preferences = {
            ...this._preferences,
            [key]: event.target.checked
        };
    }
}
