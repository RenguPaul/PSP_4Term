import { PodDetailComponent } from "../../components/pod-detail/index.js";
import { BackButtonComponent } from "../../components/back-button/index.js";
import { MainPage } from "../main/index.js";
import { pods } from "../../data/pods.js";

export class PodDetailPage {
    constructor(parent, podId) {
        this.parent = parent;
        this.podId = podId;
    }

    getData() {
        return pods.find(p => p.id === this.podId) || {
            id: this.podId,
            name: "Unknown",
            namespace: "—",
            status: "Unknown",
            containers: [],
            node: "—",
            ip: "—",
            labels: {},
            created: ""
        };
    }

    get pageRoot() {
        return document.getElementById('pod-detail-page');
    }

    getHTML() {
        return '<div id="pod-detail-page"></div>';
    }

    clickBack() {
        const mainPage = new MainPage(this.parent);
        mainPage.render();
    }

    render() {
        this.parent.innerHTML = '';
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);

        const backButton = new BackButtonComponent(this.pageRoot);
        backButton.render(this.clickBack.bind(this));

        const data = this.getData();
        const detail = new PodDetailComponent(this.pageRoot);
        detail.render(data);
    }
}
