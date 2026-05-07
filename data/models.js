export const presetModels = [
    {
        id: 'car',
        name: 'Спорткар',
        files: ['models/car.glb'],
        type: 'single'
    },
    {
        id: 'tree1',
        name: 'Дерево 1',
        files: ['models/tree.glb'],
        type: 'single'
    },
    {
        id: 'tree2',
        name: 'Дерево 2',
        files: ['models/tree1.glb'],
        type: 'single'
    },
    {
        id: 'tree3',
        name: 'Дерево 3',
        files: ['models/tree2.glb'],
        type: 'single'
    },
    {
        id: 'car-tree',
        name: 'Машина + Дерево',
        files: ['models/car.glb', 'models/tree.glb'],
        type: 'pair',
        offset: 3
    }
];