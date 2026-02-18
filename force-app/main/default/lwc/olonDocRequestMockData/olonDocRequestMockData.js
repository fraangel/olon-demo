/**
 * Mock data module for Olon Documentation Request Monitor
 * Contains hardcoded request data and utility functions
 */

// Calculate dates relative to today
const today = new Date();

function getDateDaysAgo(days) {
    const date = new Date(today);
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
}

/**
 * Mock documentation/sample requests data
 */
export const DOC_REQUESTS = [
    {
        id: 'DR-001',
        accountName: 'Novartis - API Purchase',
        docType: 'DMF (Drug Master File)',
        requestDate: getDateDaysAgo(8),
        stage: 'Regulatory Processing',
        owner: 'Regulatory Office',
        age: 8
    },
    {
        id: 'DR-002',
        accountName: 'Merck KGaA',
        docType: 'Certificate of Analysis',
        requestDate: getDateDaysAgo(6),
        stage: 'Commercial Approval',
        owner: 'Sales Director',
        age: 6
    },
    {
        id: 'DR-003',
        accountName: 'Sanofi - R&D',
        docType: 'Sample Request (10g)',
        requestDate: getDateDaysAgo(3),
        stage: 'Dispatched',
        owner: 'QA Manager',
        age: 3
    },
    {
        id: 'DR-004',
        accountName: 'Teva API',
        docType: 'Technical Data Sheet',
        requestDate: getDateDaysAgo(4),
        stage: 'Under QA Review',
        owner: 'QA Manager',
        age: 4
    },
    {
        id: 'DR-005',
        accountName: 'Pfizer',
        docType: 'Certificate of Analysis',
        requestDate: getDateDaysAgo(7),
        stage: 'Commercial Approval',
        owner: 'Sales Director',
        age: 7
    },
    {
        id: 'DR-006',
        accountName: 'Lonza',
        docType: 'DMF Update',
        requestDate: getDateDaysAgo(2),
        stage: 'Regulatory Processing',
        owner: 'Regulatory Office',
        age: 2
    },
    {
        id: 'DR-007',
        accountName: 'Sandoz',
        docType: 'Sample Request (25g)',
        requestDate: getDateDaysAgo(1),
        stage: 'Pending Dispatch',
        owner: 'Logistics',
        age: 1
    },
    {
        id: 'DR-008',
        accountName: 'Biotech Inc',
        docType: 'Technical Data Sheet',
        requestDate: getDateDaysAgo(0),
        stage: 'Completed',
        owner: 'Sales Rep',
        age: 0
    }
];

/**
 * Calculate the age (days since request)
 * @param {string} requestDate - Date in YYYY-MM-DD format
 * @returns {number} Number of days since request
 */
export function calculateAge(requestDate) {
    const request = new Date(requestDate);
    const now = new Date();
    const diffTime = Math.abs(now - request);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

/**
 * Format current time for "Updated" display
 * @returns {string} Formatted time string (e.g., "2:30 PM")
 */
export function formatCurrentTime() {
    return new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

/**
 * Get stage color class based on business rules
 * Uses ONLY standard SLDS utility classes
 * @param {string} stage - The stage of the request
 * @param {number} age - Days since request
 * @returns {string} SLDS class name for styling
 */
export function getStageColorClass(stage, age) {
    // Age > 5 AND Commercial Approval = warning (red)
    if (age > 5 && stage === 'Commercial Approval') {
        return 'slds-text-color_error';
    }
    // All other stages use default text color
    return '';
}
