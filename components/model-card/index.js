import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class ModelCardComponent {
    constructor(parent, modelData) {
        this.parent = parent;
        this.modelData = modelData;
        this.element = document.createElement('div');
        this.element.className = 'card';
        this.element.innerHTML = `
            <canvas class="preview-canvas"></canvas>
            <div class="card-info">${modelData.name || '(без названия)'}</div>
        `;
        this.element.addEventListener('click', () => this.openDetail());
        parent.appendChild(this.element);
    }

    openDetail() {
        let url = `detail.html?id=${encodeURIComponent(this.modelData.id)}`;
        if (this.modelData.files) {
            url += '&files=' + encodeURIComponent(JSON.stringify(this.modelData.files));
            url += '&type=' + (this.modelData.type || 'single');
            if (this.modelData.offset) url += '&offset=' + this.modelData.offset;
        }
        window.location.href = url;
    }

    async renderPreview() {
        const canvas = this.element.querySelector('canvas');
        if (!this.modelData.files) return;
        try {
            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0x1e1e2e);
            const ambient = new THREE.AmbientLight(0x404060);
            scene.add(ambient);
            const dir = new THREE.DirectionalLight(0xffffff, 1.2);
            dir.position.set(1, 2, 1);
            scene.add(dir);

            const loader = new GLTFLoader();
            const models = [];
            for (const file of this.modelData.files) {
                const gltf = await loader.loadAsync(file);
                models.push(gltf.scene);
            }

            if (this.modelData.type === 'pair' && models.length >= 2) {
                const group = new THREE.Group();
                const left = models[0];
                const right = models[1];
                this._center(left);
                this._center(right);
                left.position.x = -this.modelData.offset;
                right.position.x = this.modelData.offset;
                group.add(left);
                group.add(right);
                scene.add(group);
                this._frame(canvas, scene, group);
            } else {
                const model = models[0];
                this._center(model);
                scene.add(model);
                this._frame(canvas, scene, model);
            }
        } catch (e) {
            this._showError(canvas);
        }
    }

    async renderUserPreview() {
        const canvas = this.element.querySelector('canvas');
        try {
            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0x1e1e2e);
            const ambient = new THREE.AmbientLight(0x404060);
            scene.add(ambient);
            const dir = new THREE.DirectionalLight(0xffffff, 1.2);
            dir.position.set(1, 2, 1);
            scene.add(dir);

            const loader = new GLTFLoader();
            const blob = new Blob([this.modelData.data], { type: 'model/gltf-binary' });
            const url = URL.createObjectURL(blob);
            const gltf = await loader.loadAsync(url);
            URL.revokeObjectURL(url);
            const model = gltf.scene;
            this._center(model);
            scene.add(model);
            this._frame(canvas, scene, model);
        } catch (e) {
            this._showError(canvas);
        }
    }

    _center(model) {
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        model.position.set(-center.x, -center.y + size.y/2, -center.z);
    }

    _frame(canvas, scene, target) {
        const box = new THREE.Box3().setFromObject(target);
        const size = box.getSize(new THREE.Vector3()).length();
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
        camera.position.set(size*0.8, size*0.6, size*0.8);
        camera.lookAt(0, 0, 0);
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        renderer.setSize(canvas.parentElement.clientWidth, 200, false);
        renderer.render(scene, camera);
        renderer.dispose();
    }

    _showError(canvas) {
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Ошибка загрузки', canvas.width/2, canvas.height/2);
    }
}