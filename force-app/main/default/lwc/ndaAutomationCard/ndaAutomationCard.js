import { LightningElement, api, wire, track } from 'lwc';
import { getRecord, updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import generateAndSaveNDA from '@salesforce/apex/NDAService.generateAndSaveNDA';

import LEAD_ID_FIELD from '@salesforce/schema/Lead.Id';
import LEAD_STATUS_FIELD from '@salesforce/schema/Lead.Status';
import LEAD_COMPANY_FIELD from '@salesforce/schema/Lead.Company';
import LEAD_FIRSTNAME_FIELD from '@salesforce/schema/Lead.FirstName';
import LEAD_LASTNAME_FIELD from '@salesforce/schema/Lead.LastName';
import LEAD_MOLECULE_FIELD from '@salesforce/schema/Lead.Olon_Molecule_Info__c';

const FIELDS = [
    LEAD_STATUS_FIELD,
    LEAD_COMPANY_FIELD,
    LEAD_FIRSTNAME_FIELD,
    LEAD_LASTNAME_FIELD,
    LEAD_MOLECULE_FIELD
];

export default class NdaAutomationCard extends LightningElement {
    @api recordId;
    @track isLoading = false;

    _leadData;

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    wiredLead({ error, data }) {
        if (data) {
            this._leadData = data.fields;
        } else if (error) {
            console.error('Errore nel recupero del Lead:', error);
            this._leadData = undefined;
        }
    }

    get showComponent() {
        return this._leadData && this._leadData.Status.value === 'NDA';
    }

    get leadCompany() {
        return this._leadData ? this._leadData.Company.value : '';
    }

    get leadName() {
        if (!this._leadData) return '';
        const first = this._leadData.FirstName.value || '';
        const last = this._leadData.LastName.value || '';
        return `${first} ${last}`.trim();
    }

    get leadMolecule() {
        return this._leadData ? (this._leadData.Olon_Molecule_Info__c.value || '—') : '';
    }

    handleGenerateNda() {
        // Validazione campi obbligatori
        if (!this.leadCompany) {
            this._showToast('Campi obbligatori mancanti', 'Il campo Azienda è obbligatorio per generare l\'NDA.', 'error');
            return;
        }
        if (!this.leadName) {
            this._showToast('Campi obbligatori mancanti', 'Il nome del contatto è obbligatorio per generare l\'NDA.', 'error');
            return;
        }

        this.isLoading = true;

        // 1. Genera PDF e salva tra i Files del Lead (Apex)
        generateAndSaveNDA({
            leadId:      this.recordId,
            company:     this.leadCompany,
            contactName: this.leadName,
            molecule:    this.leadMolecule
        })
        // 2. Avanza lo stato del Lead
        .then(() => this._advanceLeadStatus())
        .catch(error => {
            this.isLoading = false;
            const msg = (error.body && error.body.message)
                ? error.body.message
                : 'Errore durante la generazione del PDF. Verifica i permessi e riprova.';
            this._showToast('Errore', msg, 'error', 'sticky');
        });
    }

    _advanceLeadStatus() {
        const fields = {};
        fields[LEAD_ID_FIELD.fieldApiName] = this.recordId;
        fields[LEAD_STATUS_FIELD.fieldApiName] = 'Credit check';

        updateRecord({ fields })
            .then(() => {
                this.isLoading = false;
                this._showToast(
                    'NDA Generato',
                    'NDA Generato e salvato tra i file. Il Lead è pronto per la fase di Credit Check.',
                    'success',
                    'sticky'
                );
            })
            .catch(error => {
                this.isLoading = false;
                let errorMessage = 'Errore durante l\'aggiornamento dello stato del Lead.';
                if (error.body) {
                    if (error.body.message) {
                        errorMessage = error.body.message;
                    } else if (error.body.output && error.body.output.errors && error.body.output.errors.length > 0) {
                        errorMessage = error.body.output.errors.map(e => e.message).join(', ');
                    }
                }
                this._showToast('Errore', errorMessage, 'error', 'sticky');
            });
    }

    _showToast(title, message, variant, mode = 'dismissable') {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant, mode }));
    }
}
