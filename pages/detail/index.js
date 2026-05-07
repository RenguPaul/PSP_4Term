import * as THREE from 'three';
import { ModelViewerComponent } from '../../components/model-viewer/index.js';
import { getAllModels } from '../../idb.js';

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const filesParam = urlParams.get('files');
    const type = urlParams.get('type') || 'single';
    const offset = parseFloat(urlParams.get('offset')) || 0;

    let modelData = null;
    let userModel = null;

    if (filesParam) {
        const files = JSON.parse(filesParam);
        modelData = { id, files, type, offset };
    } else {
        const userModels = await getAllModels();
        userModel = userModels.find(m => m.id === id);
        if (!userModel) {
            alert('Модель не найдена');
            return;
        }
        modelData = { id, data: userModel.data, type: 'single' };
    }

    const canvas = document.getElementById('detailCanvas');
    const viewer = new ModelViewerComponent(canvas, modelData);
    await viewer.init();
    viewer.animate();

    // Привязка кнопок (THREE теперь доступен)
    document.getElementById('view-front').addEventListener('click', () => {
        viewer.setView(new THREE.Vector3(0, 2, 5));
    });
    document.getElementById('view-back').addEventListener('click', () => {
        viewer.setView(new THREE.Vector3(0, 2, -5));
    });
    document.getElementById('view-left').addEventListener('click', () => {
        viewer.setView(new THREE.Vector3(-5, 2, 0));
    });
    document.getElementById('view-right').addEventListener('click', () => {
        viewer.setView(new THREE.Vector3(5, 2, 0));
    });
    document.getElementById('zoom-in').addEventListener('click', () => {
        viewer.zoom(0.8); // приблизить
    });
    document.getElementById('zoom-out').addEventListener('click', () => {
        viewer.zoom(1.2); // отдалить
    });

    window.addEventListener('resize', () => viewer.handleResize());
});