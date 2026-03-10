import { LightningElement, api, track } from 'lwc';
import logoUrl from '@salesforce/resourceUrl/AbiogenLogo';

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

const TAB_IDS = Object.keys(CHECKLIST_MAP);

export default class AbiogenSupportGuide extends LightningElement {

    @api recordId;
    logoUrl = logoUrl;

    @track tasks      = [];
    @track activeType = TAB_IDS[0];

    connectedCallback() {
        this._buildChecklist();
    }

    // ─── Mock data ────────────────────────────────────────────────────────────

    get caseSubject() {
        return 'Richiesta documentazione — Ticket #00247';
    }

    // ─── Tab selector ─────────────────────────────────────────────────────────

    get tabs() {
        return TAB_IDS.map(id => ({
            id,
            label: id,
            btnClass: id === this.activeType ? 'tab-btn tab-btn--active' : 'tab-btn',
        }));
    }

    handleTabSelect(evt) {
        this.activeType = evt.currentTarget.dataset.id;
        this._buildChecklist();
    }

    // ─── Checklist builder ────────────────────────────────────────────────────

    _buildChecklist() {
        const defs = CHECKLIST_MAP[this.activeType] || [];
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
