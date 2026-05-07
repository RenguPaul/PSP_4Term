import { ModelCardComponent } from '../../components/model-card/index.js';
import { UploadFormComponent } from '../../components/upload-form/index.js';
import { presetModels } from '../../data/models.js';
import { getAllModels } from '../../idb.js';

export class MainPage {
    constructor() {
        this.galleryElement = document.getElementById('gallery');
    }

    async render() {
        // Рендерим форму загрузки
        const uploadForm = new UploadFormComponent(document.querySelector('.upload-area'));
        uploadForm.render();

        // Предустановленные модели
        for (const preset of presetModels) {
            const card = new ModelCardComponent(this.galleryElement, preset);
            await card.renderPreview();
        }

        // Пользовательские модели из IndexedDB
        const userModels = await getAllModels();
        for (const model of userModels) {
            const card = new ModelCardComponent(this.galleryElement, model);
            await card.renderUserPreview();
        }
    }
}