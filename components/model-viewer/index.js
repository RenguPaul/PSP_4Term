import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class ModelViewerComponent {
    constructor(canvas, modelData) {
        this.canvas = canvas;
        this.modelData = modelData;
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1e1e2e);
        this.camera = new THREE.PerspectiveCamera(50, canvas.clientWidth/canvas.clientHeight, 0.1, 100);
        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        this.controls = new OrbitControls(this.camera, canvas);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
    }

    async init() {
        const ambient = new THREE.AmbientLight(0x404060);
        this.scene.add(ambient);
        const dir1 = new THREE.DirectionalLight(0xffffff, 1);
        dir1.position.set(1, 2, 1);
        this.scene.add(dir1);
        const dir2 = new THREE.DirectionalLight(0x8080ff, 0.6);
        dir2.position.set(-1, 0.5, -0.5);
        this.scene.add(dir2);

        const loader = new GLTFLoader();
        if (this.modelData.data) {
            const blob = new Blob([this.modelData.data], { type: 'model/gltf-binary' });
            const url = URL.createObjectURL(blob);
            const gltf = await loader.loadAsync(url);
            URL.revokeObjectURL(url);
            const model = gltf.scene;
            this._center(model);
            this.scene.add(model);
        } else if (this.modelData.files) {
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
                this.scene.add(group);
            } else {
                const model = models[0];
                this._center(model);
                this.scene.add(model);
            }
        }
        const box = new THREE.Box3().setFromObject(this.scene);
        const center = box.getCenter(new THREE.Vector3());
        this.controls.target.copy(center);
        this.controls.update();
        this.camera.position.set(4, 3, 5);
        this.camera.lookAt(center);
    }

    _center(model) {
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        model.position.set(-center.x, -center.y + size.y/2, -center.z);
    }

    animate() {
        const loop = () => {
            requestAnimationFrame(loop);
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
        };
        loop();
    }

    setView(position) {
        this.camera.position.copy(position);
        this.controls.target.set(0, 1, 0);
        this.controls.update();
    }

    zoom(factor) {
        const dist = this.camera.position.distanceTo(this.controls.target);
        const dir = this.camera.position.clone().sub(this.controls.target).normalize();
        this.camera.position.copy(this.controls.target.clone().add(dir.multiplyScalar(dist * factor)));
        this.controls.update();
    }

    handleResize() {
        this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight, false);
    }
}