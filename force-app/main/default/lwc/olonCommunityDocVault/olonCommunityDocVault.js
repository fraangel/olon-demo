import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

// ── Mock Data ────────────────────────────────────────────────────────────────
const DOCUMENTS = [
    {
        id: 'DOC-20260115-IBU-DMF',
        title: 'Ibuprofen API',
        docCode: 'DOC-20260115-IBU-DMF',
        category: 'DMF',
        site: 'Rodano',
        date: '2026-01-15',
        size: '2.4 MB'
    },
    {
        id: 'DOC-20260203-CBZ-CEP',
        title: 'Carbamazepine',
        docCode: 'DOC-20260203-CBZ-CEP',
        category: 'CEP',
        site: 'Lodi',
        date: '2026-02-03',
        size: '1.8 MB'
    },
    {
        id: 'DOC-20260110-OMP-CoA',
        title: 'Omeprazole',
        docCode: 'DOC-20260110-OMP-CoA',
        category: 'CoA',
        site: 'Capua',
        date: '2026-01-10',
        size: '540 KB'
    },
    {
        id: 'DOC-20251220-ATV-MSDS',
        title: 'Atorvastatin',
        docCode: 'DOC-20251220-ATV-MSDS',
        category: 'MSDS',
        site: 'Rodano',
        date: '2025-12-20',
        size: '980 KB'
    },
    {
        id: 'DOC-20260201-MET-DMF',
        title: 'Metformin HCl',
        docCode: 'DOC-20260201-MET-DMF',
        category: 'DMF',
        site: 'Lodi',
        date: '2026-02-01',
        size: '3.1 MB'
    },
    {
        id: 'DOC-20260118-PAR-CoA',
        title: 'Paracetamol',
        docCode: 'DOC-20260118-PAR-CoA',
        category: 'CoA',
        site: 'Capua',
        date: '2026-01-18',
        size: '620 KB'
    },
    {
        id: 'DOC-20251105-CLR-CEP',
        title: 'Clarithromycin',
        docCode: 'DOC-20251105-CLR-CEP',
        category: 'CEP',
        site: 'Rodano',
        date: '2025-11-05',
        size: '1.5 MB'
    },
    {
        id: 'DOC-20251215-RAN-TechPkg',
        title: 'Ranitidine HCl',
        docCode: 'DOC-20251215-RAN-TechPkg',
        category: 'Technical Package',
        site: 'Lodi',
        date: '2025-12-15',
        size: '4.2 MB'
    },
    {
        id: 'DOC-20260125-SER-DMF',
        title: 'Sertraline',
        docCode: 'DOC-20260125-SER-DMF',
        category: 'DMF',
        site: 'Capua',
        date: '2026-01-25',
        size: '2.7 MB'
    },
    {
        id: 'DOC-20260205-VEN-TechPkg',
        title: 'Venlafaxine HCl',
        docCode: 'DOC-20260205-VEN-TechPkg',
        category: 'Technical Package',
        site: 'Rodano',
        date: '2026-02-05',
        size: '5.0 MB'
    }
];

// ── Category badge CSS class map ─────────────────────────────────────────────
const BADGE_CLASS = {
    'DMF':               'doc-badge doc-badge_dmf',
    'CEP':               'doc-badge doc-badge_cep',
    'CoA':               'doc-badge doc-badge_coa',
    'MSDS':              'doc-badge doc-badge_msds',
    'Technical Package': 'doc-badge doc-badge_techpkg'
};

const ALL_CATEGORIES = ['DMF', 'CEP', 'CoA', 'MSDS', 'Technical Package'];

// ── Component ────────────────────────────────────────────────────────────────
export default class OlonCommunityDocVault extends LightningElement {
    @track _searchTerm = '';
    @track _selectedCategories = [];

    // ── Derived data ──────────────────────────────────────────────────────────

    get filteredDocuments() {
        const term = this._searchTerm.toLowerCase();
        const cats = this._selectedCategories;

        return DOCUMENTS
            .filter(doc => {
                const matchesSearch = !term ||
                    doc.title.toLowerCase().includes(term) ||
                    doc.docCode.toLowerCase().includes(term);
                const matchesCategory = cats.length === 0 || cats.includes(doc.category);
                return matchesSearch && matchesCategory;
            })
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(doc => ({
                ...doc,
                categoryBadgeClass: BADGE_CLASS[doc.category] || 'doc-badge',
                formattedDate: this._formatDate(doc.date)
            }));
    }

    get hasDocuments() {
        return this.filteredDocuments.length > 0;
    }

    get resultCount() {
        const n = this.filteredDocuments.length;
        return n === 1 ? '1 document' : `${n} documents`;
    }

    get categoryFilters() {
        return ALL_CATEGORIES.map(cat => ({
            value: cat,
            label: cat,
            pillClass: this._selectedCategories.includes(cat)
                ? 'filter-pill filter-pill_active'
                : 'filter-pill'
        }));
    }

    // ── Handlers ──────────────────────────────────────────────────────────────

    handleSearchChange(event) {
        this._searchTerm = event.target.value;
    }

    handleCategoryToggle(event) {
        const value = event.currentTarget.dataset.value;
        this._selectedCategories = this._selectedCategories.includes(value)
            ? this._selectedCategories.filter(c => c !== value)
            : [...this._selectedCategories, value];
    }

    handleClearFilters() {
        this._searchTerm = '';
        this._selectedCategories = [];
    }

    handleDownload(event) {
        const title = event.currentTarget.dataset.title;
        this.dispatchEvent(new ShowToastEvent({
            title: 'Download Started',
            message: `Downloading PDF for ${title}...`,
            variant: 'success'
        }));
    }

    // ── Utilities ─────────────────────────────────────────────────────────────

    _formatDate(dateStr) {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }
}
