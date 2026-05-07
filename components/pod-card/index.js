export class PodCardComponent {
    constructor(parent) {
        this.parent = parent;
    }

    // SVG‑иконка прямо в компоненте
    getIconSVG(iconType, size = 80) {
        const color = "#326ce5";
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
        const statusClass = `status-${data.status}`;
        const svgIcon = this.getIconSVG(data.icon, 80);
        return `
            <div class="card card-dark" style="width: 18rem;">
                <div class="card-img-top card-img-icon d-flex align-items-center justify-content-center">
                    <div class="icon-wrapper">
                        ${svgIcon}
                    </div>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${data.name}</h5>
                    <p class="card-text">
                        <span class="status-badge ${statusClass}">${data.status}</span>
                        <br>Namespace: ${data.namespace}
                    </p>
                    <button class="btn btn-primary btn-sm" id="click-card-${data.id}" data-id="${data.id}">
                        Details
                    </button>
                </div>
            </div>
        `;
    }

    addListeners(data, listener) {
        document
            .getElementById(`click-card-${data.id}`)
            .addEventListener("click", listener);
    }

    render(data, listener) {
        const html = this.getHTML(data);
        this.parent.insertAdjacentHTML('beforeend', html);
        this.addListeners(data, listener);
    }
}
