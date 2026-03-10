import { LightningElement, api, wire, track } from 'lwc';
import { getRecord, createRecord } from 'lightning/uiRecordApi';
import userId from '@salesforce/user/Id';
import isGuest from '@salesforce/user/isGuest';
import logoUrl from '@salesforce/resourceUrl/AbiogenLogo';

// User schema
import USER_NAME_FIELD    from '@salesforce/schema/User.Name';
import USER_EMAIL_FIELD   from '@salesforce/schema/User.Email';
import USER_PHONE_FIELD   from '@salesforce/schema/User.Phone';
import USER_CONTACT_FIELD from '@salesforce/schema/User.ContactId';

const USER_FIELDS = [USER_NAME_FIELD, USER_EMAIL_FIELD, USER_PHONE_FIELD, USER_CONTACT_FIELD];

// Case schema
import CASE_OBJECT          from '@salesforce/schema/Case';
import CASE_SUBJECT         from '@salesforce/schema/Case.Subject';
import CASE_DESCRIPTION     from '@salesforce/schema/Case.Description';
import CASE_ORIGIN          from '@salesforce/schema/Case.Origin';
import CASE_STATUS          from '@salesforce/schema/Case.Status';
import CASE_CONTACT_ID      from '@salesforce/schema/Case.ContactId';
import CASE_SUPPLIED_NAME   from '@salesforce/schema/Case.SuppliedName';
import CASE_SUPPLIED_EMAIL  from '@salesforce/schema/Case.SuppliedEmail';
import CASE_SUPPLIED_PHONE  from '@salesforce/schema/Case.SuppliedPhone';

export default class AbiogenCommunitySupportForm extends LightningElement {
    /** Titolo configurabile dall'Experience Builder */
    @api formTitle = 'Apri un Ticket di Supporto';

    logoUrl = logoUrl;

    @track subject     = '';
    @track description = '';
    @track name        = '';
    @track email       = '';
    @track phone       = '';
    @track isLoading   = false;
    @track isSuccess   = false;
    @track errorMessage = '';

    _contactId;

    // Wire: recupera dati utente se autenticato (non guest)
    @wire(getRecord, { recordId: '$_userId', fields: USER_FIELDS })
    wiredUser({ data, error }) {
        if (data && !isGuest) {
            this.name       = data.fields.Name.value       || '';
            this.email      = data.fields.Email.value      || '';
            this.phone      = data.fields.Phone.value      || '';
            this._contactId = data.fields.ContactId.value  || null;
        }
        if (error) {
            console.error('Errore recupero dati utente:', error);
        }
    }

    // Expose userId come proprietà reattiva per il wire
    get _userId() {
        return isGuest ? null : userId;
    }

    get isLoggedIn() {
        return !isGuest;
    }

    // ─── Event handlers ──────────────────────────────────────────────────────

    handleSubjectChange(evt)     { this.subject     = evt.target.value; }
    handleDescriptionChange(evt) { this.description = evt.target.value; }
    handleNameChange(evt)        { this.name        = evt.target.value; }
    handleEmailChange(evt)       { this.email       = evt.target.value; }
    handlePhoneChange(evt)       { this.phone       = evt.target.value; }

    // ─── Submit ──────────────────────────────────────────────────────────────

    handleSubmit() {
        this.errorMessage = '';

        // Validazione campi obbligatori
        if (!this.subject.trim()) {
            this.errorMessage = 'Il campo Oggetto è obbligatorio.';
            return;
        }
        if (!this.description.trim()) {
            this.errorMessage = 'Il campo Descrizione è obbligatorio.';
            return;
        }
        if (!this.email.trim()) {
            this.errorMessage = 'Il campo Email è obbligatorio.';
            return;
        }

        this.isLoading = true;

        // Costruisci i campi del Case
        const fields = {};
        fields[CASE_SUBJECT.fieldApiName]     = this.subject.trim();
        fields[CASE_DESCRIPTION.fieldApiName] = this.description.trim();
        fields[CASE_ORIGIN.fieldApiName]      = 'Web';
        fields[CASE_STATUS.fieldApiName]      = 'New';

        if (!isGuest && this._contactId) {
            // Utente loggato → associa al Contact (Salesforce risolve AccountId automaticamente)
            fields[CASE_CONTACT_ID.fieldApiName] = this._contactId;
        } else {
            // Utente guest → usa campi Supplied
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
                    } else if (error.body.output && error.body.output.errors && error.body.output.errors.length > 0) {
                        this.errorMessage = error.body.output.errors.map(e => e.message).join(' | ');
                    } else {
                        this.errorMessage = 'Errore durante l\'invio. Riprova più tardi.';
                    }
                } else {
                    this.errorMessage = 'Errore durante l\'invio. Riprova più tardi.';
                }
            });
    }

    // ─── Reset ───────────────────────────────────────────────────────────────

    handleReset() {
        this.subject      = '';
        this.description  = '';
        this.errorMessage = '';
        this.isSuccess    = false;

        // Resetta contatti solo per utenti guest
        if (isGuest) {
            this.name  = '';
            this.email = '';
            this.phone = '';
        }
    }
}
