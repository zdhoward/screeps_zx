// https://screepers.github.io/screeps-tools/#/building-planner

const { bunkerBP } = require("lib.blueprints");

function getBunkerSize() {
    let minX = 99;
    let minY = 99;
    let maxX = 0;
    let maxY = 0;

    for (let key in bunkerBP['buildings']) {
        for (let building of bunkerBP['buildings'][key]) {
            if (building.x > maxX)
                maxX = building.x;

            if (building.y > maxY)
                maxY = building.y;

            if (building.x < minX)
                minX = building.x;

            if (building.y < minY)
                minY = building.y;
        }
    }

    let width = maxX - minX;
    let height = maxY - minY;

    return { width: width, height: height };
}

function getValidBunkerPositions(roomID, bunkerSize) {
    let room = Game.rooms[roomID];
    let terrain = room.getTerrain();

    let validPositions = [];

    for (let x = 1; x < 49 - bunkerSize.width; x++) {
        for (let y = 1; y < 49 - bunkerSize.height; y++) {
            let result = checkFit(x, y);
            if (result != false)
                validPositions.push({ x: result.x, y: result.y });
        }
    }

    if (validPositions.length < 1)
        return false;
    else
        return validPositions;

    function checkFit(x, y) {
        let area = room.lookForAtArea(LOOK_TERRAIN, y, x, y + bunkerSize.height, x + bunkerSize.width, true);

        for (let pos of area) {
            if (pos.terrain == 'wall') {
                return false;
            }
        }

        return { x: x, y: y };
    }
}

function getBestBunkerPosition(roomID) {
    console.log("getBestBunkerPosition()");

    let bunkerSize = getBunkerSize();

    let validPositions = getValidBunkerPositions(roomID, bunkerSize);

    if (validPositions.length < 1)
        return false;

    let room = Game.rooms[roomID];
    let sources = room.find(FIND_SOURCES);

    let closestPosition = { x: -1, y: -1, distance: 999 };
    for (let pos of validPositions) {
        let distanceFromBothSources = 0;
        for (let source of sources) {
            let widthOffset = bunkerSize.width / 2;
            let heightOffset = bunkerSize.height / 2;

            let anchorX = pos.x + widthOffset;
            let anchorY = pos.y + heightOffset;

            let distance = Math.sqrt((source.pos.x - anchorX) ** 2 + (source.pos.y - anchorY) ** 2);

            distanceFromBothSources += distance;
        }

        if (distanceFromBothSources < closestPosition.distance)
            closestPosition = { x: pos.x, y: pos.y, distance: distanceFromBothSources };
    }

    return closestPosition;
}

function tryConstructBunker(roomID) {
    console.log("tryConstructBunker()");

    let room = Game.rooms[roomID];
    let rcl = room.controller.level;

    let bunkerSize = getBunkerSize();

    let anchor = Memory.colonies[roomID].bunkerAnchor;

    let widthOffset = bunkerSize.width / 2;
    let heightOffset = bunkerSize.height / 2;

    let originX = anchor.x - widthOffset;
    let originY = anchor.y - heightOffset;

    // console.log("RCL: " + room.controller.level);
    // console.log("Anchor: " + anchor.x + " " + anchor.y);
    // console.log("Origin: " + originX + " " + originY);

    for (let key in bunkerBP['buildings']) {
        if (rcl < 6 && key == STRUCTURE_RAMPART) continue;
        if (rcl < 5 && key == STRUCTURE_ROAD) continue;

        for (let building of bunkerBP['buildings'][key]) {
            let createX = originX + building.x - 1;
            let createY = originY + building.y - 1;

            room.createConstructionSite(createX, createY, key, key);

        }
    }
}

function tryConstructContainerNearController(roomID) {

}

function tryBuildColony(roomID) {
    tryConstructBunker(roomID);
    tryConstructContainerNearController(roomID);
}

module.exports = {
    tryBuildColony,
};