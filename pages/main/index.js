import { PodCardComponent } from "../../components/pod-card/index.js";
import { PodDetailPage } from "../pod-detail/index.js";
import { pods } from "../../data/pods.js";

export class MainPage {
    constructor(parent) {
        this.parent = parent;
    }

    getData() {
        return pods;
    }

    get pageRoot() {
        return document.getElementById('main-page');
    }

    getHTML() {
        return '<div id="main-page" class="d-flex flex-wrap gap-3"></div>';
    }

    clickCard(e) {
        const podId = e.target.dataset.id;
        const podDetailPage = new PodDetailPage(this.parent, podId);
        podDetailPage.render();
    }

    render() {
        this.parent.innerHTML = '';
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);

        const data = this.getData();
        data.forEach(item => {
            const podCard = new PodCardComponent(this.pageRoot);
            podCard.render(item, this.clickCard.bind(this));
        });
    }
}
