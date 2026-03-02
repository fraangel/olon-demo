import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { DOC_REQUESTS, formatCurrentTime, getStageColorClass } from 'c/olonDocRequestMockData';

const ACTIONS = [
    { label: 'View Details', name: 'view_details' }
];

export default class OlonDocRequestMonitor extends LightningElement {
    @track searchTerm = '';
    @track requests = [];
    @track lastUpdatedTime = '';

    columns = [
        {
            label: 'Account',
            fieldName: 'accountUrl',
            type: 'url',
            sortable: true,
            typeAttributes: {
                label: { fieldName: 'accountName' },
                target: '_self'
            }
        },
        {
            label: 'Type',
            fieldName: 'docType',
            type: 'text'
        },
        {
            label: 'Date',
            fieldName: 'requestDate',
            type: 'date',
            sortable: true,
            typeAttributes: {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }
        },
        {
            label: 'Stage',
            fieldName: 'stage',
            type: 'text',
            cellAttributes: {
                class: { fieldName: 'stageClass' }
            }
        },
        {
            label: 'Assigned To',
            fieldName: 'owner',
            type: 'text'
        },
        {
            label: 'Age (d)',
            fieldName: 'age',
            type: 'number',
            cellAttributes: {
                alignment: 'center'
            }
        },
        {
            type: 'action',
            typeAttributes: {
                rowActions: ACTIONS
            }
        }
    ];

    connectedCallback() {
        this.loadRequests();
    }

    loadRequests() {
        this.requests = DOC_REQUESTS.map(request => {
            return {
                ...request,
                accountUrl: `javascript:void(0);`,
                stageClass: getStageColorClass(request.stage, request.age)
            };
        });
        this.lastUpdatedTime = formatCurrentTime();
    }

    get filteredRequests() {
        if (!this.searchTerm) {
            return this.requests;
        }
        const searchLower = this.searchTerm.toLowerCase();
        return this.requests.filter(request =>
            request.accountName.toLowerCase().includes(searchLower) ||
            request.docType.toLowerCase().includes(searchLower)
        );
    }

    get hasRequests() {
        return this.filteredRequests.length > 0;
    }

    get totalRequests() {
        const count = this.filteredRequests.length;
        return count === 1 ? '1 item' : `${count} items`;
    }

    handleSearch(event) {
        this.searchTerm = event.target.value;
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;

        if (actionName === 'view_details') {
            this.showToast(
                'View Details',
                `Opening details for ${row.accountName} - ${row.docType}`,
                'info'
            );
        }
    }

    handleRefresh() {
        this.loadRequests();
        this.showToast(
            'Refreshed',
            'Documentation requests have been refreshed',
            'success'
        );
    }

    handleNewRequest() {
        this.showToast(
            'New Request',
            'Opening new documentation request form...',
            'info'
        );
    }

    handleViewAll() {
        this.showToast(
            'View All',
            'Opening full documentation requests list...',
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
