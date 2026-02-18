import { LightningElement } from 'lwc';

const RELATIONSHIP_DATA = {
    rootAccount: {
        id: 'acc-hq',
        name: 'BioNova Pharmaceuticals',
        location: 'Global HQ - Boston, USA',
        iconName: 'standard:account'
    },
    subsidiaries: [
        {
            id: 'acc-italy',
            name: 'BioNova Italy',
            location: 'Milan Site',
            iconName: 'standard:account',
            contact: {
                id: 'con-elena',
                name: 'Elena Bianchi',
                title: 'Head of Procurement',
                sentiment: 'positive',
                iconName: 'standard:contact'
            }
        },
        {
            id: 'acc-germany',
            name: 'BioNova Germany',
            location: 'Frankfurt R&D',
            iconName: 'standard:account',
            contact: {
                id: 'con-hans',
                name: 'Hans Schmidt',
                title: 'Technical Director',
                sentiment: 'neutral',
                iconName: 'standard:contact'
            }
        },
        {
            id: 'acc-usa',
            name: 'BioNova USA',
            location: 'Boston Ops',
            iconName: 'standard:account',
            contact: {
                id: 'con-marcus',
                name: 'Marcus Thorne',
                title: 'Chief Scientist',
                sentiment: 'negative',
                iconName: 'standard:contact'
            }
        }
    ]
};

export default class OlonBioNovaRelationshipMap extends LightningElement {
    _hasRendered = false;

    get rootAccount() {
        return RELATIONSHIP_DATA.rootAccount;
    }

    get subsidiaries() {
        return RELATIONSHIP_DATA.subsidiaries.map((sub) => ({
            ...sub,
            contact: {
                ...sub.contact,
                sentimentClass: this._getSentimentClass(sub.contact.sentiment),
                sentimentLabel: this._getSentimentLabel(sub.contact.sentiment)
            }
        }));
    }

    renderedCallback() {
        if (this._hasRendered) {
            return;
        }
        this._hasRendered = true;
        // Use requestAnimationFrame to ensure lightning-icon async rendering completes
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        requestAnimationFrame(() => {
            this._calculateLines();
        });
    }

    _getSentimentClass(sentiment) {
        const classMap = {
            positive: 'contact-node sentiment-positive',
            neutral: 'contact-node sentiment-neutral',
            negative: 'contact-node sentiment-negative'
        };
        return classMap[sentiment] || 'contact-node';
    }

    _getSentimentLabel(sentiment) {
        const labelMap = {
            positive: 'Positive',
            neutral: 'Neutral',
            negative: 'Negative'
        };
        return labelMap[sentiment] || 'Unknown';
    }

    _calculateLines() {
        const container = this.template.querySelector('.map-container');
        const svgEl = this.template.querySelector('.svg-overlay');
        if (!container || !svgEl) {
            return;
        }

        // Clear existing lines
        while (svgEl.firstChild) {
            svgEl.removeChild(svgEl.firstChild);
        }

        const containerRect = container.getBoundingClientRect();

        // Set SVG dimensions to match container
        svgEl.setAttribute('width', containerRect.width);
        svgEl.setAttribute('height', containerRect.height);

        const rootNode = this.template.querySelector('[data-id="acc-hq"]');
        if (!rootNode) {
            return;
        }

        const rootRect = rootNode.getBoundingClientRect();
        const rootBottomCenter = {
            x: rootRect.left + rootRect.width / 2 - containerRect.left,
            y: rootRect.top + rootRect.height - containerRect.top
        };

        RELATIONSHIP_DATA.subsidiaries.forEach((sub) => {
            const subNode = this.template.querySelector(
                `[data-id="${sub.id}"]`
            );
            const contactNode = this.template.querySelector(
                `[data-id="${sub.contact.id}"]`
            );

            if (subNode) {
                const subRect = subNode.getBoundingClientRect();
                const subTopCenter = {
                    x:
                        subRect.left +
                        subRect.width / 2 -
                        containerRect.left,
                    y: subRect.top - containerRect.top
                };

                // Line from root to subsidiary
                this._createLine(
                    svgEl,
                    rootBottomCenter.x,
                    rootBottomCenter.y,
                    subTopCenter.x,
                    subTopCenter.y
                );

                if (contactNode) {
                    const contactRect = contactNode.getBoundingClientRect();
                    const subBottomCenter = {
                        x:
                            subRect.left +
                            subRect.width / 2 -
                            containerRect.left,
                        y: subRect.top + subRect.height - containerRect.top
                    };
                    const contactTopCenter = {
                        x:
                            contactRect.left +
                            contactRect.width / 2 -
                            containerRect.left,
                        y: contactRect.top - containerRect.top
                    };

                    // Line from subsidiary to contact
                    this._createLine(
                        svgEl,
                        subBottomCenter.x,
                        subBottomCenter.y,
                        contactTopCenter.x,
                        contactTopCenter.y
                    );
                }
            }
        });
    }

    _createLine(svgEl, x1, y1, x2, y2) {
        const line = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'line'
        );
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', '#c9c9c9');
        line.setAttribute('stroke-width', '2');
        svgEl.appendChild(line);
    }
}
