import { NUMBER_OF_COLS, NUMBER_OF_ROWS } from "../home/script.js";

export const DISTANCE_BETWEEN_NODES = 1;

export function findNodeIndex(node) {
    return node.row * NUMBER_OF_COLS + node.column
}

export function dijkstra(startNode, endNode, backGrid) {
    const transversedPath = [];
    const grid = backGrid;
    const startingNode = grid[findNodeIndex(startNode)];
    startingNode.distance = 0;

    const endingNode = grid[findNodeIndex(endNode)];
    while (grid.length > 0) {
        const nodesByDistance = updateNodesByDistance(grid);
        const closestNode = getClosestNode(nodesByDistance);
        transversedPath.push(closestNode);
        closestNode.isVisited = true;
        if (closestNode.distance === Infinity) {
            return transversedPath;
        }
        if (closestNode === endingNode) {
            return transversedPath;
        }
        const unvisitedNeighborNodes = getUnvisitedNeighborNodes(closestNode, grid);
        for (const unvisitedNode of unvisitedNeighborNodes) {
            if (unvisitedNode.isWall) continue;
            unvisitedNode.distance = closestNode.distance + DISTANCE_BETWEEN_NODES;
            unvisitedNode.previousNode = closestNode;
        }
    }
}

export function updateNodesByDistance(grid) {
    return grid.sort((a, b) => a.distance - b.distance);
}

export function getClosestNode(nodesByDistance) {
    return nodesByDistance.shift();
}

export function getUnvisitedNeighborNodes(closestNode, grid) {
    const neighborNodes = [];
    const nodeAbove = grid.find(node => node.row === closestNode.row - 1 && node.column === closestNode.column);
    const nodeRight = grid.find(node => node.row === closestNode.row && node.column === closestNode.column + 1);
    const nodeBelow = grid.find(node => node.row === closestNode.row + 1 && node.column === closestNode.column);
    const nodeLeft = grid.find(node => node.row === closestNode.row && node.column === closestNode.column - 1);
    if (nodeAbove) neighborNodes.push(nodeAbove); //Up
    if (nodeRight) neighborNodes.push(nodeRight); //Right
    if (nodeBelow) neighborNodes.push(nodeBelow); //Down
    if (nodeLeft) neighborNodes.push(nodeLeft); //Left
    return neighborNodes.filter(node => !node.isVisited); //Return only the unvisited neighbors
}