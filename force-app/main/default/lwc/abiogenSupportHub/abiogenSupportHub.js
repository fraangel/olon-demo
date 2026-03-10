import { LightningElement, api, wire, track } from 'lwc';
import { getRecord, createRecord } from 'lightning/uiRecordApi';
import userId from '@salesforce/user/Id';
import isGuest from '@salesforce/user/isGuest';
import logoUrl from '@salesforce/resourceUrl/AbiogenLogo';

// ─── User schema ──────────────────────────────────────────────────────────────
import USER_NAME_FIELD    from '@salesforce/schema/User.Name';
import USER_EMAIL_FIELD   from '@salesforce/schema/User.Email';
import USER_PHONE_FIELD   from '@salesforce/schema/User.Phone';
import USER_CONTACT_FIELD from '@salesforce/schema/User.ContactId';
import USER_ACCOUNT_FIELD from '@salesforce/schema/User.AccountId';

const USER_FIELDS = [
    USER_NAME_FIELD,
    USER_EMAIL_FIELD,
    USER_PHONE_FIELD,
    USER_CONTACT_FIELD,
    USER_ACCOUNT_FIELD
];

// ─── Case schema ──────────────────────────────────────────────────────────────
import CASE_OBJECT          from '@salesforce/schema/Case';
import CASE_SUBJECT         from '@salesforce/schema/Case.Subject';
import CASE_DESCRIPTION     from '@salesforce/schema/Case.Description';
import CASE_ORIGIN          from '@salesforce/schema/Case.Origin';
import CASE_STATUS          from '@salesforce/schema/Case.Status';
import CASE_TYPE            from '@salesforce/schema/Case.Type';
import CASE_CONTACT_ID      from '@salesforce/schema/Case.ContactId';
import CASE_ACCOUNT_ID      from '@salesforce/schema/Case.AccountId';
import CASE_SUPPLIED_NAME   from '@salesforce/schema/Case.SuppliedName';
import CASE_SUPPLIED_EMAIL  from '@salesforce/schema/Case.SuppliedEmail';
import CASE_SUPPLIED_PHONE  from '@salesforce/schema/Case.SuppliedPhone';

export default class AbiogenSupportHub extends LightningElement {

    @api formTitle = 'Partner Support Center';
    logoUrl = logoUrl;

    @track subject      = '';
    @track description  = '';
    @track name         = '';
    @track email        = '';
    @track phone        = '';
    @track isLoading    = false;
    @track isSuccess    = false;
    @track errorMessage = '';

    _contactId  = null;
    _accountId  = null;

    // ─── Wire: dati utente ────────────────────────────────────────────────────

    @wire(getRecord, { recordId: '$_currentUserId', fields: USER_FIELDS })
    wiredUser({ data, error }) {
        if (data && !isGuest) {
            this.name       = data.fields.Name.value       || '';
            this.email      = data.fields.Email.value      || '';
            this.phone      = data.fields.Phone.value      || '';
            this._contactId = data.fields.ContactId.value  || null;
            this._accountId = data.fields.AccountId.value  || null;
        }
        if (error) {
            console.error('[abiogenSupportHub] Errore recupero utente:', error);
        }
    }

    // Proprietà reattiva per il wire (null per guest evita la query)
    get _currentUserId() {
        return isGuest ? null : userId;
    }

    // ─── Getters ──────────────────────────────────────────────────────────────

    get isLoggedIn() {
        return !isGuest;
    }

    /** Primo nome per il welcome banner */
    get firstName() {
        if (!this.name) return 'Partner';
        return this.name.split(' ')[0];
    }

    /** Pulsante rosso e attivo solo se Subject + Email compilati */
    get isFormReady() {
        return this.subject.trim().length > 0 && this.email.trim().length > 0;
    }

    get submitBtnClass() {
        return this.isFormReady
            ? 'btn-submit btn-submit--ready'
            : 'btn-submit';
    }

    // Classe per input disabilitati (aspetto visivo leggermente diverso)
    get nameInputClass()  { return this._disabledInputClass(this.isLoggedIn); }
    get emailInputClass() { return this._disabledInputClass(this.isLoggedIn); }
    get phoneInputClass() { return this._disabledInputClass(this.isLoggedIn); }

    _disabledInputClass(disabled) {
        return disabled ? 'float-input float-input--prefilled' : 'float-input';
    }

    // ─── Event handlers ───────────────────────────────────────────────────────

    handleSubjectInput(evt)     { this.subject     = evt.target.value; this.errorMessage = ''; }
    handleDescriptionInput(evt) { this.description = evt.target.value; }
    handleNameInput(evt)        { this.name        = evt.target.value; }
    handleEmailInput(evt)       { this.email       = evt.target.value; this.errorMessage = ''; }
    handlePhoneInput(evt)       { this.phone       = evt.target.value; }

    // ─── Submit ───────────────────────────────────────────────────────────────

    handleSubmit() {
        this.errorMessage = '';

        if (!this.subject.trim()) {
            this.errorMessage = 'Il campo Oggetto è obbligatorio.';
            return;
        }
        if (!this.email.trim()) {
            this.errorMessage = 'Il campo Email è obbligatorio.';
            return;
        }

        this.isLoading = true;

        const fields = {};
        fields[CASE_SUBJECT.fieldApiName]     = this.subject.trim();
        fields[CASE_DESCRIPTION.fieldApiName] = this.description.trim();
        fields[CASE_ORIGIN.fieldApiName]      = 'Web';
        fields[CASE_STATUS.fieldApiName]      = 'New';
        fields[CASE_TYPE.fieldApiName]        = 'Other';

        if (!isGuest && this._contactId) {
            // Utente loggato → associa al Contact + Account
            fields[CASE_CONTACT_ID.fieldApiName] = this._contactId;
            if (this._accountId) {
                fields[CASE_ACCOUNT_ID.fieldApiName] = this._accountId;
            }
        } else {
            // Guest → campi Supplied
            fields[CASE_SUPPLIED_NAME.fieldApiName]  = this.name.trim();
            fields[CASE_SUPPLIED_EMAIL.fieldApiName] = this.email.trim();
            if (this.phone.trim()) {
                fields[CASE_SUPPLIED_PHONE.fieldApiName] = this.phone.trim();
            }
        }

        createRecord({ apiName: CASE_OBJECT.objectApiName, fields })
            .then(() => {
                this.isLoading = false;
                this.isSuccess = true;
            })
            .catch(error => {
                this.isLoading = false;
                if (error.body) {
                    if (error.body.message) {
                        this.errorMessage = error.body.message;
                    } else if (
                        error.body.output &&
                        error.body.output.errors &&
                        error.body.output.errors.length > 0
                    ) {
                        this.errorMessage = error.body.output.errors
                            .map(e => e.message).join(' — ');
                    } else {
                        this.errorMessage = 'Errore durante l\'invio. Riprova più tardi.';
                    }
                } else {
                    this.errorMessage = 'Errore durante l\'invio. Riprova più tardi.';
                }
            });
    }

    // ─── Reset ────────────────────────────────────────────────────────────────

    handleReset() {
        this.subject      = '';
        this.description  = '';
        this.errorMessage = '';
        this.isSuccess    = false;

        if (isGuest) {
            this.name  = '';
            this.email = '';
            this.phone = '';
        }

        // Svuota anche i campi DOM nativi (non controllati da value binding)
        // eslint-disable-next-line @lwc/lwc/no-template-children
        const inputs = this.template.querySelectorAll('.float-input');
        inputs.forEach(el => {
            if (!el.disabled) el.value = '';
        });
    }
}
