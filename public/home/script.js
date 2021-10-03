import { dijkstra } from "./dijkstra.js";
import { findNodeIndex } from "./dijkstra.js";

const NUMBER_OF_ROWS = 15;
const NUMBER_OF_COLS = 50;

const grid = document.querySelector(".grid");
let nodes = [];
populateFrontGrid();
nodes[360].classList.add("start-node");
nodes[389].classList.add("end-node");
// click and drag to add walls functionality
let mouseIsDown = false;
let draggingEndNode = false;
let draggingStartNode = false;
let canIDraw = true;
let isSolving = false;
nodes.forEach(node => {
    node.addEventListener("mousedown", (event) => {
        event.preventDefault();
        if (!canIDraw) {
            return;
        }
        mouseIsDown = true;
        if (event.target.classList.contains('start-node')) {
            //change start node
            event.target.classList.remove("start-node");
            draggingStartNode = true;
        } else if (event.target.classList.contains('end-node')) {
            //change end node
            event.target.classList.remove("end-node");
            draggingEndNode = true;
        } else {
            turnNodeIntoWall(event);
        }
    });
    node.addEventListener("mouseenter", (event) => {
        if (!mouseIsDown || draggingStartNode || draggingEndNode) return;
        turnNodeIntoWall(event);
    });
    node.addEventListener("mouseup", event => {
        if (draggingStartNode) {
            event.target.classList.add("start-node");
            draggingStartNode = false;
        } else if (draggingEndNode) {
            event.target.classList.add("end-node");
            draggingEndNode = false;
        }
    })
})

window.addEventListener("mouseup", () => {
    mouseIsDown = false;
    if (draggingStartNode) {
        nodes[360].classList.add("start-node");
        draggingStartNode = false;
    }
    else if (draggingEndNode) {
        nodes[389].classList.add("end-node");
        draggingEndNode = false;
    }
})

function turnNodeIntoWall(event) {
    if (event.target.classList.contains("start-node") || event.target.classList.contains("end-node")) return;
    event.target.classList.toggle("wall-node");
}

function populateFrontGrid() {
    for (let i = 0; i < NUMBER_OF_COLS * NUMBER_OF_ROWS; i++) {
        const node = document.createElement("div");
        grid.appendChild(node);
    }
    nodes = document.querySelectorAll(".grid div");
    let idDiv = 0;
    nodes.forEach((node) => {
        node.classList.add("node");
        node.setAttribute("id", `node${idDiv}`)
        idDiv++;
    })
}

function setStartNode() {
    return findNodeCoords(Array.from(nodes).findIndex(node => node.classList.contains("start-node")));
}

function findNodeCoords(nodeId) {
    const row = Math.floor(nodeId / NUMBER_OF_COLS);
    const column = nodeId - row * NUMBER_OF_COLS;
    return { row, column }
}

function setEndNode() {
    return findNodeCoords(Array.from(nodes).findIndex(node => node.classList.contains("end-node")));
}

const startButton = document.querySelector(".button-start");
startButton.addEventListener("click", () => {
    if (isSolving) {
        return;
    }
    canIDraw = false;
    isSolving = true;
    const backGrid = createGrid();
    const animatedPath = dijkstra(setStartNode(), setEndNode(), backGrid);
    let i = 0;
    const intervalId1 = setInterval(() => {
        nodes[findNodeIndex(animatedPath[i])].classList.add("searched-node");
        i++;
        if (i === animatedPath.length - 1) {
            let previousNode = animatedPath[i];
            let nodeToPaint = nodes[findNodeIndex(previousNode)];
            if (previousNode.distance === Infinity) {
                window.alert("There is no valid path!")
            } else {
                const intervalId2 = setInterval(() => {
                    nodeToPaint.classList.add("shortest-path-node");
                    previousNode = previousNode.previousNode;
                    nodeToPaint = nodes[findNodeIndex(previousNode)];
                    if (previousNode.previousNode === null) clearInterval(intervalId2);
                }, 30);
            }
            clearInterval(intervalId1);
            setTimeout(() => isSolving = false, 5000);
        }
    }, 10);
});

function createGrid() {
    const newGrid = [];

    for (let i = 0; i < NUMBER_OF_ROWS; i++) {
        for (let j = 0; j < NUMBER_OF_COLS; j++) {
            newGrid.push(createNode(i, j));
        }
    }
    return newGrid;
}

function createNode(nodeRow, nodeColumn) {
    if (nodes[findIndexFromCoords(nodeRow, nodeColumn)].classList.contains("wall-node")) {
        return {
            row: nodeRow,
            column: nodeColumn,
            distance: Infinity,
            isVisited: false,
            isWall: true,
            previousNode: null
        }
    } else {
        return {
            row: nodeRow,
            column: nodeColumn,
            distance: Infinity,
            isVisited: false,
            isWall: false,
            previousNode: null
        }
    }

};

function findIndexFromCoords(row, column) {
    return row * NUMBER_OF_COLS + column
}

const resetGrid = document.querySelector(".button-reset-grid");
resetGrid.addEventListener("click", () => {
    if (isSolving) {
        return;
    }
    nodes.forEach(node => {
        if (node.classList.contains("searched-node") || node.classList.contains("shortest-path-node")) {
            node.classList.remove("searched-node");
            node.classList.remove("shortest-path-node");
        }
    });
    canIDraw = true;
})

const clearWalls = document.querySelector(".button-clear-walls");
clearWalls.addEventListener("click", () => {
    if (isSolving) {
        return;
    }
    nodes.forEach(node => {
        node.classList.remove("wall-node");
    })
})