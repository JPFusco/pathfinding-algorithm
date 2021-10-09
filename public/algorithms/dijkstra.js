import { NUMBER_OF_COLS, NUMBER_OF_ROWS } from "../home/script.js";

export function findNodeIndex(node) {
    return node.row * NUMBER_OF_COLS + node.column
}

export function dijkstra(startNode, endNode, backGrid) {
    let transversedPath = [];
    const grid = backGrid;
    const startingNode = grid[findNodeIndex(startNode)];
    startingNode.distance = 0;

    const endingNode = grid[findNodeIndex(endNode)];
    let unvisitedNeighborNodes = [];
    while (grid.length > 0) {
        let nodesByDistance = updateNodesByDistance(grid);
        let closestNode = getClosestNode(nodesByDistance);
        transversedPath.push(closestNode);
        closestNode.isVisited = true;
        if (closestNode.distance === Infinity) {
            return transversedPath;
        }
        if (closestNode === endingNode) return transversedPath;
        unvisitedNeighborNodes = getUnvisitedNeighborNodes(closestNode, grid);
        for (let unvisitedNode of unvisitedNeighborNodes) {
            if (unvisitedNode.isWall) continue;
            unvisitedNode.distance = closestNode.distance + 1;
            unvisitedNode.previousNode = closestNode;
        }
    }
}

function updateNodesByDistance(grid) {
    const sortedGrid = grid;
    return sortedGrid.sort((a, b) => a.distance - b.distance);
}

function getClosestNode(nodesByDistance) {
    return nodesByDistance.shift();
}

function getUnvisitedNeighborNodes(closestNode, grid) {
    const unvisitedNeighborNodes = [];
    const closestNodeRow = closestNode.row;
    const closestNodeColumn = closestNode.column;
    const nodeAbove = grid.findIndex(node => node.row === closestNodeRow - 1 && node.column === closestNodeColumn);
    const nodeRight = grid.findIndex(node => node.row === closestNodeRow && node.column === closestNodeColumn + 1);
    const nodeBelow = grid.findIndex(node => node.row === closestNodeRow + 1 && node.column === closestNodeColumn);
    const nodeLeft = grid.findIndex(node => node.row === closestNodeRow && node.column === closestNodeColumn - 1);
    if (closestNodeRow > 0 && nodeAbove >= 0) unvisitedNeighborNodes.push(grid[nodeAbove]); //Up
    if (closestNodeColumn < NUMBER_OF_COLS - 1 && nodeRight >= 0) unvisitedNeighborNodes.push(grid[nodeRight]); //Right
    if (closestNodeRow < NUMBER_OF_ROWS - 1 && nodeBelow >= 0) unvisitedNeighborNodes.push(grid[nodeBelow]); //Down
    if (closestNodeColumn > 0 && nodeLeft >= 0) unvisitedNeighborNodes.push(grid[nodeLeft]); //Left
    return unvisitedNeighborNodes.filter(node => !node.isVisited);
}
