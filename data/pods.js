export const pods = [
    {
        id: "pod-1",
        name: "nginx-deployment-7bffc778db-8fz5x",
        namespace: "default",
        status: "Running",
        // добавлено поле icon для выбора SVG
        icon: "gear",
        containers: [
            {
                name: "nginx",
                image: "nginx:1.21",
                ports: [{ containerPort: 80 }]
            }
        ],
        node: "minikube",
        ip: "172.17.0.4",
        labels: { app: "nginx", tier: "frontend" },
        created: "2025-01-10T14:23:00Z"
    },
    {
        id: "pod-2",
        name: "redis-master-0",
        namespace: "kube-system",
        status: "Pending",
        icon: "storage",
        containers: [
            {
                name: "redis",
                image: "redis:7.0",
                ports: [{ containerPort: 6379 }]
            }
        ],
        node: "minikube",
        ip: "172.17.0.5",
        labels: { app: "redis", role: "master" },
        created: "2025-01-11T08:12:00Z"
    },
    {
        id: "pod-3",
        name: "coredns-74ff55c5b-4s8j2",
        namespace: "kube-system",
        status: "Running",
        icon: "network",
        containers: [
            {
                name: "coredns",
                image: "coredns/coredns:1.9.3",
                ports: [{ containerPort: 53 }, { containerPort: 53, protocol: "UDP" }]
            }
        ],
        node: "minikube",
        ip: "172.17.0.2",
        labels: { "k8s-app": "kube-dns" },
        created: "2025-01-09T16:30:00Z"
    }
];
