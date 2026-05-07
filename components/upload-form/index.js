import { addModel } from '../../idb.js';
import { ModelCardComponent } from '../model-card/index.js';

export class UploadFormComponent {
    constructor(parent) {
        this.parent = parent;
    }

    render() {
        const input = document.getElementById('fileInput');
        input.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = async (ev) => {
                const arrayBuffer = ev.target.result;
                const id = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                const modelData = {
                    id,
                    name: file.name.replace('.glb', ''),
                    data: arrayBuffer,
                    type: 'single'
                };
                await addModel(modelData);
                const gallery = document.getElementById('gallery');
                const card = new ModelCardComponent(gallery, modelData);
                await card.renderUserPreview();
                input.value = '';
            };
            reader.readAsArrayBuffer(file);
        });
    }
}