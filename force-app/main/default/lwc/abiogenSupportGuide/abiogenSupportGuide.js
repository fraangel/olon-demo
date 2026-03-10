import { LightningElement, api, wire, track } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import logoUrl from '@salesforce/resourceUrl/AbiogenLogo';

// ─── Case schema ──────────────────────────────────────────────────────────────
import CASE_TYPE    from '@salesforce/schema/Case.Type';
import CASE_SUBJECT from '@salesforce/schema/Case.Subject';

const CASE_FIELDS = [CASE_TYPE, CASE_SUBJECT];

// ─── Checklist definitions ────────────────────────────────────────────────────
const CHECKLIST_MAP = {
    'Logistica/Spedizioni': [
        { id: 'sage',     label: 'Verifica stato ordine in Sage X3 (tramite integrazione MuleSoft)' },
        { id: 'stock',    label: 'Controlla disponibilità lotti in magazzino' },
        { id: 'credit',   label: 'Verifica presenza di fatture insolute (Blocco Credit Check)' },
        { id: 'delivery', label: 'Invia aggiornamento data consegna al Partner' },
    ],
    'Regolatorio/Documentale': [
        { id: 'listing',    label: 'Identifica il listino terapeutico coinvolto (es. Metabolismo Osseo)' },
        { id: 'coa',        label: 'Recupera Certificato di Analisi (CoA) o Conformità' },
        { id: 'regulatory', label: 'Sottopone bozza al team Regolatorio per approvazione' },
        { id: 'upload',     label: 'Carica documento finale nel tab "Files" del record' },
    ],
};

export default class AbiogenSupportGuide extends LightningElement {

    @api recordId;
    logoUrl = logoUrl;

    @track tasks = [];

    _caseType    = '';
    _caseSubject = '';

    // ─── Wire: Case fields ────────────────────────────────────────────────────

    @wire(getRecord, { recordId: '$recordId', fields: CASE_FIELDS })
    wiredCase({ data, error }) {
        if (data) {
            this._caseType    = getFieldValue(data, CASE_TYPE)    || '';
            this._caseSubject = getFieldValue(data, CASE_SUBJECT) || '';
            this._buildChecklist();
        }
        if (error) {
            console.error('[abiogenSupportGuide] Errore wire Case:', error);
        }
    }

    // ─── Checklist builder ────────────────────────────────────────────────────

    _buildChecklist() {
        const defs = CHECKLIST_MAP[this._caseType] || [];
        // Preserve checked state when the wire fires again (e.g. type change)
        const prevState = Object.fromEntries(this.tasks.map(t => [t.id, t.done]));
        this.tasks = defs.map(def => ({
            ...def,
            done: prevState[def.id] || false,
        }));
        this._refreshClasses();
    }

    _refreshClasses() {
        this.tasks = this.tasks.map(t => ({
            ...t,
            rowClass:   t.done ? 'task-row task-row--done' : 'task-row',
            checkClass: t.done ? 'check-btn check-btn--done' : 'check-btn',
            labelClass: t.done ? 'task-label task-label--done' : 'task-label',
        }));
    }

    // ─── Getters ──────────────────────────────────────────────────────────────

    get caseSubject()    { return this._caseSubject; }
    get caseType()       { return this._caseType; }
    get hasChecklist()   { return this.tasks.length > 0; }
    get completedCount() { return this.tasks.filter(t => t.done).length; }
    get totalCount()     { return this.tasks.length; }
    get progressPct() {
        return this.totalCount === 0 ? 0 : Math.round((this.completedCount / this.totalCount) * 100);
    }
    get progressStyle()  { return `width: ${this.progressPct}%`; }
    get isAllDone()      { return this.totalCount > 0 && this.completedCount === this.totalCount; }

    // ─── Handlers ─────────────────────────────────────────────────────────────

    handleTaskToggle(evt) {
        const id = evt.currentTarget.dataset.id;
        this.tasks = this.tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
        this._refreshClasses();
    }
}
