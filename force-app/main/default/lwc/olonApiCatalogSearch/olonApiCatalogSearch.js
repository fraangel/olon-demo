import { LightningElement, track, api } from 'lwc';

// ── Module-level constants ──────────────────────────────────────────────────

const PRODUCTS = [
    {
        id: 'prod-001',
        name: 'Peptide Complex X',
        cas: '12345-67-8',
        category: 'Peptides',
        site: 'Rodano',
        regulatory: ['US DMF', 'CEP'],
        area: 'Oncology',
        greenChemistry: true
    },
    {
        id: 'prod-002',
        name: 'HPAPI Alpha-1',
        cas: '98765-43-2',
        category: 'HPAPI',
        site: 'Rodano',
        regulatory: ['US DMF'],
        area: 'Neurology',
        greenChemistry: false
    },
    {
        id: 'prod-003',
        name: 'Generic API Beta',
        cas: '55555-55-5',
        category: 'Generic',
        site: 'Capua',
        regulatory: ['None'],
        area: 'Cardiology',
        greenChemistry: false
    },
    {
        id: 'prod-004',
        name: 'Historical Peptide Z',
        cas: '11111-22-3',
        category: 'Peptides',
        site: 'Lodi',
        regulatory: ['CEP'],
        area: 'Endocrinology',
        greenChemistry: false
    },
    {
        id: 'prod-005',
        name: 'HPAPI Gamma-2',
        cas: '77777-88-9',
        category: 'HPAPI',
        site: 'Rodano',
        regulatory: ['US DMF', 'CEP', 'JP DMF'],
        area: 'Oncology',
        greenChemistry: true
    },
    {
        id: 'prod-006',
        name: 'Soluble API Delta',
        cas: '33333-44-6',
        category: 'Generic',
        site: 'Capua',
        regulatory: ['US DMF'],
        area: 'Pulmonology',
        greenChemistry: false
    }
];

const CATEGORY_FILTERS = ['HPAPI', 'Peptides', 'Generic'];
const SITE_FILTERS = ['Rodano', 'Lodi', 'Capua'];

const REGULATORY_BADGE_CLASS = {
    'US DMF': 'olon-badge olon-badge_dmf',
    'JP DMF': 'olon-badge olon-badge_dmf',
    'CEP': 'olon-badge olon-badge_cep',
    'None': 'olon-badge olon-badge_none'
};

// ── Component class ─────────────────────────────────────────────────────────

export default class OlonApiCatalogSearch extends LightningElement {

    @api catalogTitle = 'API Product Catalog';
    @api hideSiteFilters = false;

    @track _searchTerm = '';
    @track _selectedCategories = [];
    @track _selectedSites = [];

    // ── Filtered product list ──────────────────────────────────────────────

    get filteredProducts() {
        const term = this._searchTerm.toLowerCase();
        return PRODUCTS
            .filter((p) => {
                const matchesSearch =
                    !term ||
                    p.name.toLowerCase().includes(term) ||
                    p.cas.includes(term) ||
                    p.area.toLowerCase().includes(term);
                const matchesCategory =
                    this._selectedCategories.length === 0 ||
                    this._selectedCategories.includes(p.category);
                const matchesSite =
                    this._selectedSites.length === 0 ||
                    this._selectedSites.includes(p.site);
                return matchesSearch && matchesCategory && matchesSite;
            })
            .map((p) => ({
                ...p,
                isRodano: p.site === 'Rodano',
                siteClass:
                    p.site === 'Rodano'
                        ? 'olon-site-badge olon-site-badge_rodano'
                        : 'olon-site-badge',
                techCallVariant: p.site === 'Rodano' ? 'brand' : 'neutral',
                regulatoryBadges: p.regulatory.map((r) => ({
                    key: r,
                    label: r,
                    badgeClass:
                        REGULATORY_BADGE_CLASS[r] || 'olon-badge olon-badge_none'
                }))
            }));
    }

    // ── Filter button state ────────────────────────────────────────────────

    get categoryFilters() {
        return CATEGORY_FILTERS.map((label) => ({
            label,
            variant: this._selectedCategories.includes(label) ? 'brand' : 'neutral'
        }));
    }

    get siteFilters() {
        return SITE_FILTERS.map((label) => ({
            label,
            variant: this._selectedSites.includes(label) ? 'brand' : 'neutral'
        }));
    }

    // ── Result metadata ────────────────────────────────────────────────────

    get hasResults() {
        return this.filteredProducts.length > 0;
    }

    get resultCount() {
        return this.filteredProducts.length;
    }

    // ── Private helpers ────────────────────────────────────────────────────

    _toggleFilter(currentList, value) {
        return currentList.includes(value)
            ? currentList.filter((v) => v !== value)
            : [...currentList, value];
    }

    // ── Field and filter handlers ──────────────────────────────────────────

    handleSearchChange(event) {
        this._searchTerm = event.detail.value;
    }

    handleCategoryToggle(event) {
        const val = event.currentTarget.dataset.filter;
        this._selectedCategories = this._toggleFilter(this._selectedCategories, val);
    }

    handleSiteToggle(event) {
        const val = event.currentTarget.dataset.filter;
        this._selectedSites = this._toggleFilter(this._selectedSites, val);
    }

    handleClearFilters() {
        this._searchTerm = '';
        this._selectedCategories = [];
        this._selectedSites = [];
    }

    // ── Card interactions ──────────────────────────────────────────────────

    handleDocRequest(event) {
        const { id, name } = event.currentTarget.dataset;
        this.dispatchEvent(
            new CustomEvent('docrequest', {
                detail: { productId: id, productName: name },
                bubbles: true,
                composed: true
            })
        );
    }

    handleSampleRequest(event) {
        const { id, name } = event.currentTarget.dataset;
        this.dispatchEvent(
            new CustomEvent('samplerequest', {
                detail: { productId: id, productName: name },
                bubbles: true,
                composed: true
            })
        );
    }

    handleMeetingRequest(event) {
        const { id, name } = event.currentTarget.dataset;
        this.dispatchEvent(
            new CustomEvent('meetingrequest', {
                detail: { productId: id, productName: name },
                bubbles: true,
                composed: true
            })
        );
    }

    handleEsgRequest(event) {
        const { id, name } = event.currentTarget.dataset;
        this.dispatchEvent(
            new CustomEvent('esgrequest', {
                detail: { productId: id, productName: name },
                bubbles: true,
                composed: true
            })
        );
    }

    handleActionMenuSelect(event) {
        const eventType = event.detail.value;
        const { id, name } = event.currentTarget.dataset;
        this.dispatchEvent(
            new CustomEvent(eventType, {
                detail: { productId: id, productName: name },
                bubbles: true,
                composed: true
            })
        );
    }
}
