export class PodDetailComponent {
    constructor(parent) {
        this.parent = parent;
    }

    // Та же самая функция, что и в pod‑card, но с большим размером по умолчанию
    getIconSVG(iconType, size = 120) {
        const color = "#ffffff";
        const base = `width="${size}" height="${size}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`;
        const icons = {
            gear: `<svg ${base} viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>`,
            storage: `<svg ${base} viewBox="0 0 24 24">
                <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
            </svg>`,
            network: `<svg ${base} viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 0 20 15.3 15.3 0 0 1 0-20"/>
            </svg>`
        };
        return icons[iconType] || icons.gear;
    }

    getHTML(data) {
        const labels = Object.entries(data.labels || {})
            .map(([k, v]) => `<span class="badge bg-secondary me-1">${k}: ${v}</span>`)
            .join('');
        const containers = data.containers
            .map(c => `<li>${c.name} (${c.image})</li>`)
            .join('');

        const largeIcon = this.getIconSVG(data.icon, 120);

        return `
            <div class="card card-dark">
                <div class="detail-icon-wrapper d-flex align-items-center justify-content-center">
                    <div class="detail-icon-circle">
                        ${largeIcon}
                    </div>
                </div>
                <div class="card-body">
                    <h3 class="card-title">${data.name}</h3>
                    <hr style="border-color:#555">
                    <p><strong>Namespace:</strong> ${data.namespace}</p>
                    <p><strong>Status:</strong> <span class="status-badge status-${data.status}">${data.status}</span></p>
                    <p><strong>Node:</strong> ${data.node}</p>
                    <p><strong>Pod IP:</strong> ${data.ip}</p>
                    <p><strong>Created:</strong> ${new Date(data.created).toLocaleString()}</p>
                    <p><strong>Labels:</strong> ${labels || '—'}</p>
                    <p><strong>Containers:</strong></p>
                    <ul>${containers}</ul>
                </div>
            </div>
        `;
    }

    render(data) {
        const html = this.getHTML(data);
        this.parent.insertAdjacentHTML('beforeend', html);
    }
}
