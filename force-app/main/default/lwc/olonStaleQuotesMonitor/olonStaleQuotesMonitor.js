import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { STALE_QUOTES, calculateDaysOutstanding, formatCurrentTime } from 'c/olonStaleQuotesMockData';

const ACTIONS = [
    { label: 'Follow Up', name: 'follow_up' }
];

export default class OlonStaleQuotesMonitor extends LightningElement {
    @track searchTerm = '';
    @track quotes = [];
    @track lastUpdatedTime = '';

    columns = [
        {
            label: 'Account Name',
            fieldName: 'accountUrl',
            type: 'url',
            sortable: true,
            typeAttributes: {
                label: { fieldName: 'accountName' },
                target: '_self'
            }
        },
        {
            label: 'Quote Number',
            fieldName: 'quoteNumber',
            type: 'text'
        },
        {
            label: 'Type',
            fieldName: 'type',
            type: 'text'
        },
        {
            label: 'Site',
            fieldName: 'manufacturingSite',
            type: 'text'
        },
        {
            label: 'Sent Date',
            fieldName: 'sentDate',
            type: 'date',
            sortable: true,
            typeAttributes: {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }
        },
        {
            label: 'Days Outstanding',
            fieldName: 'daysOutstanding',
            type: 'number',
            sortable: true,
            cellAttributes: {
                alignment: 'center',
                class: { fieldName: 'daysColorClass' }
            }
        },
        {
            label: 'Amount',
            fieldName: 'amount',
            type: 'currency',
            sortable: true,
            typeAttributes: {
                currencyCode: 'EUR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            },
            cellAttributes: {
                alignment: 'right'
            }
        },
        {
            label: 'Status',
            fieldName: 'status',
            type: 'text'
        },
        {
            type: 'action',
            typeAttributes: {
                rowActions: ACTIONS
            }
        }
    ];

    connectedCallback() {
        this.loadQuotes();
    }

    loadQuotes() {
        this.quotes = STALE_QUOTES.map(quote => {
            const daysOutstanding = calculateDaysOutstanding(quote.sentDate);
            return {
                ...quote,
                accountUrl: `javascript:void(0);`,
                daysOutstanding,
                daysColorClass: daysOutstanding > 90 ? 'slds-text-color_error slds-text-title_bold' : ''
            };
        });
        this.lastUpdatedTime = formatCurrentTime();
    }

    get filteredQuotes() {
        if (!this.searchTerm) {
            return this.quotes;
        }
        const searchLower = this.searchTerm.toLowerCase();
        return this.quotes.filter(quote =>
            quote.accountName.toLowerCase().includes(searchLower)
        );
    }

    get hasQuotes() {
        return this.filteredQuotes.length > 0;
    }

    get itemsLabel() {
        const count = this.filteredQuotes.length;
        return count === 1 ? '1 item' : `${count} items`;
    }

    handleSearch(event) {
        this.searchTerm = event.target.value;
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;

        if (actionName === 'follow_up') {
            this.showToast(
                'Follow Up Scheduled',
                `Follow up task created for ${row.accountName} - Quote ${row.quoteNumber}`,
                'success'
            );
        }
    }

    handleRefresh() {
        this.loadQuotes();
        this.showToast(
            'Refreshed',
            'Stale quotes data has been refreshed',
            'success'
        );
    }

    handleViewReport() {
        this.showToast(
            'View Report',
            'Opening Stale Quotes Report...',
            'info'
        );
    }

    handleViewAll() {
        this.showToast(
            'View All',
            'Opening full Stale Quotes list...',
            'info'
        );
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({
            title,
            message,
            variant
        }));
    }
}
