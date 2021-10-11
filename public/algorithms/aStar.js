import { findNodeIndex, updateNodesByDistance, getClosestNode, getUnvisitedNeighborNodes, DISTANCE_BETWEEN_NODES } from "./dijkstra.js";

export function aStar(startNode, endNode, backGrid) {
    const transversedPath = [];
    const grid = backGrid;
    const startingNode = grid[findNodeIndex(startNode)];
    startingNode.distance = 0 + manhattanDistance(startNode, endNode);

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
            unvisitedNode.distance = distanceFromStartNode(closestNode, endNode) + DISTANCE_BETWEEN_NODES + manhattanDistance(unvisitedNode, endNode);
            unvisitedNode.previousNode = closestNode;
        }
    }
}

function distanceFromStartNode(node, endNode) {
    return node.distance - manhattanDistance(node, endNode);
}

function manhattanDistance(node, endNode) {
    return Math.abs(node.row - endNode.row) + Math.abs(node.column - endNode.column);
}