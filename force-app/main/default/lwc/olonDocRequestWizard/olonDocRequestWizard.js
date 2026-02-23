import { LightningElement, track } from 'lwc';

// ── Module-level constants ──────────────────────────────────────────────────

const MOLECULE_OPTIONS = [
    { label: 'Peptide Complex X', value: 'peptide_complex_x' },
    { label: 'HPAPI Alpha-1', value: 'hpapi_alpha_1' },
    { label: 'Historical Peptide Z', value: 'historical_peptide_z' }
];

const DOCUMENT_OPTIONS_META = [
    {
        id: 'dmf',
        label: 'Drug Master File (DMF)',
        description: 'Comprehensive technical dossier submitted to health authorities.',
        icon: 'utility:pdf_ext'
    },
    {
        id: 'coa',
        label: 'Certificate of Analysis (CoA)',
        description: 'Batch-specific analytical results confirming quality compliance.',
        icon: 'utility:approval'
    },
    {
        id: 'cep',
        label: 'Certificate of Suitability (CEP)',
        description: 'EDQM-issued certificate confirming European Pharmacopoeia compliance.',
        icon: 'utility:outcome'
    }
];

const REGULATORY_MARKET_OPTIONS = [
    { label: 'USA - FDA', value: 'usa_fda' },
    { label: 'EU - EMA', value: 'eu_ema' },
    { label: 'China - NMPA', value: 'china_nmpa' }
];

const SUCCESS_REQUEST_ID = 'REQ-2026-084';
const SUBMIT_DELAY_MS = 2000;

const INITIAL_FORM_DATA = {
    molecule: '',
    documents: { dmf: false, coa: false, cep: false },
    regulatoryMarket: '',
    projectScope: ''
};

// ── Component class ─────────────────────────────────────────────────────────

export default class OlonDocRequestWizard extends LightningElement {

    @track _currentStep = 1;
    @track _isSubmitting = false;
    @track _isSuccess = false;
    @track _formData = {
        ...INITIAL_FORM_DATA,
        documents: { ...INITIAL_FORM_DATA.documents }
    };

    // ── Step visibility ────────────────────────────────────────────────────

    get isStep1() {
        return this._currentStep === 1 && !this._isSubmitting && !this._isSuccess;
    }

    get isStep2() {
        return this._currentStep === 2 && !this._isSubmitting && !this._isSuccess;
    }

    get isStep3() {
        return this._currentStep === 3 && !this._isSubmitting && !this._isSuccess;
    }

    get isStep4() {
        return this._currentStep === 4 && !this._isSubmitting && !this._isSuccess;
    }

    get isWizardVisible() {
        return !this._isSubmitting && !this._isSuccess;
    }

    get isSubmitting() {
        return this._isSubmitting;
    }

    get isSuccess() {
        return this._isSuccess;
    }

    // ── Progress indicator ─────────────────────────────────────────────────

    get currentStepValue() {
        return `step${this._currentStep}`;
    }

    // ── Navigation state ───────────────────────────────────────────────────

    get showPreviousButton() {
        return this._currentStep > 1;
    }

    get isNextDisabled() {
        if (this._currentStep === 1) {
            return !this._formData.molecule;
        }
        if (this._currentStep === 2) {
            return !this._hasAnyDocumentSelected;
        }
        if (this._currentStep === 3) {
            return !this._formData.regulatoryMarket || !this._formData.projectScope.trim();
        }
        return false;
    }

    // ── Static option arrays ───────────────────────────────────────────────

    get moleculeOptions() {
        return MOLECULE_OPTIONS;
    }

    get regulatoryMarketOptions() {
        return REGULATORY_MARKET_OPTIONS;
    }

    // ── Document options with reactive checked state ───────────────────────

    get documentOptions() {
        return DOCUMENT_OPTIONS_META.map((doc) => ({
            ...doc,
            checked: this._formData.documents[doc.id] === true
        }));
    }

    // ── Review screen computed values ──────────────────────────────────────

    get reviewMoleculeLabel() {
        const found = MOLECULE_OPTIONS.find((o) => o.value === this._formData.molecule);
        return found ? found.label : '—';
    }

    get reviewDocumentsList() {
        const selected = DOCUMENT_OPTIONS_META
            .filter((d) => this._formData.documents[d.id])
            .map((d) => d.label);
        return selected.length ? selected.join(', ') : 'None selected';
    }

    get reviewMarketLabel() {
        const found = REGULATORY_MARKET_OPTIONS.find((o) => o.value === this._formData.regulatoryMarket);
        return found ? found.label : '—';
    }

    get successMessage() {
        return `Request ${SUCCESS_REQUEST_ID} has been successfully created.`;
    }

    // ── Private helpers ────────────────────────────────────────────────────

    get _hasAnyDocumentSelected() {
        return Object.values(this._formData.documents).some((v) => v === true);
    }

    // ── Field handlers (immutable _formData updates) ───────────────────────

    handleMoleculeChange(event) {
        this._formData = { ...this._formData, molecule: event.detail.value };
    }

    handleDocumentChange(event) {
        const docId = event.target.dataset.id;
        const checked = event.target.checked;
        this._formData = {
            ...this._formData,
            documents: { ...this._formData.documents, [docId]: checked }
        };
    }

    handleRegulatoryMarketChange(event) {
        this._formData = { ...this._formData, regulatoryMarket: event.detail.value };
    }

    handleProjectScopeChange(event) {
        this._formData = { ...this._formData, projectScope: event.detail.value };
    }

    // ── Navigation handlers ────────────────────────────────────────────────

    handleNext() {
        if (this._currentStep < 4) {
            this._currentStep += 1;
        }
    }

    handlePrevious() {
        if (this._currentStep > 1) {
            this._currentStep -= 1;
        }
    }

    handleSubmit() {
        this._isSubmitting = true;
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(() => {
            this._isSubmitting = false;
            this._isSuccess = true;
        }, SUBMIT_DELAY_MS);
    }

    handleReset() {
        this._currentStep = 1;
        this._isSubmitting = false;
        this._isSuccess = false;
        this._formData = {
            ...INITIAL_FORM_DATA,
            documents: { ...INITIAL_FORM_DATA.documents }
        };
    }
}
