/**
 * Mock data module for Olon Stale Quotes Monitor
 * Contains hardcoded quote data and utility functions
 */

// Calculate dates relative to today for realistic "days outstanding" values
const today = new Date();

function getDateDaysAgo(days) {
    const date = new Date(today);
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
}

/**
 * Mock stale quotes data (>60 days old)
 * Includes Olon manufacturing sites: Segrate, Rodano, Capua
 */
export const STALE_QUOTES = [
    {
        id: 'Q-001',
        accountName: 'Pfizer',
        quoteNumber: 'OLN-2024-0847',
        type: 'CDMO',
        sentDate: getDateDaysAgo(95),
        amount: 2450000,
        status: 'Pending Review',
        manufacturingSite: 'Segrate'
    },
    {
        id: 'Q-002',
        accountName: 'Ajinomoto',
        quoteNumber: 'OLN-2024-0912',
        type: 'API',
        sentDate: getDateDaysAgo(75),
        amount: 890000,
        status: 'Awaiting Feedback',
        manufacturingSite: 'Rodano'
    },
    {
        id: 'Q-003',
        accountName: 'Biotech Inc',
        quoteNumber: 'OLN-2024-0934',
        type: 'CDMO',
        sentDate: getDateDaysAgo(68),
        amount: 1250000,
        status: 'Under Evaluation',
        manufacturingSite: 'Capua'
    },
    {
        id: 'Q-004',
        accountName: 'Sandoz',
        quoteNumber: 'OLN-2024-0856',
        type: 'API',
        sentDate: getDateDaysAgo(92),
        amount: 3100000,
        status: 'Legal Review',
        manufacturingSite: 'Segrate'
    },
    {
        id: 'Q-005',
        accountName: 'Teva Pharma',
        quoteNumber: 'OLN-2024-0889',
        type: 'API',
        sentDate: getDateDaysAgo(78),
        amount: 1890000,
        status: 'Pricing Discussion',
        manufacturingSite: 'Rodano'
    },
    {
        id: 'Q-006',
        accountName: 'Lonza',
        quoteNumber: 'OLN-2024-0901',
        type: 'CDMO',
        sentDate: getDateDaysAgo(65),
        amount: 4200000,
        status: 'Contract Negotiation',
        manufacturingSite: 'Capua'
    }
];

/**
 * Calculate the number of days since a given date
 * @param {string} sentDate - Date in YYYY-MM-DD format
 * @returns {number} Number of days outstanding
 */
export function calculateDaysOutstanding(sentDate) {
    const sent = new Date(sentDate);
    const now = new Date();
    const diffTime = Math.abs(now - sent);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

/**
 * Format amount as EUR currency
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount) {
    return new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

/**
 * Get status CSS class based on days outstanding
 * @param {number} daysOutstanding - Number of days since quote was sent
 * @returns {string} CSS class name for styling
 */
export function getStatusClass(daysOutstanding) {
    if (daysOutstanding > 90) {
        return 'status-critical';
    } else if (daysOutstanding >= 60) {
        return 'status-warning';
    }
    return '';
}

/**
 * Get badge variant based on days outstanding
 * @param {number} daysOutstanding - Number of days since quote was sent
 * @returns {string} Badge variant ('error', 'warning', or '')
 */
export function getStatusVariant(daysOutstanding) {
    if (daysOutstanding > 90) {
        return 'error';
    } else if (daysOutstanding >= 60) {
        return 'warning';
    }
    return '';
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
