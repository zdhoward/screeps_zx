/**
 * lib/planning.js
 *
 * Room planning and construction logic (bunker placement, containers, etc.)
 * Ported from original system, integrated with vNext architecture.
 */

const { bunkerBP } = require("lib/blueprints");

function getBunkerSize() {
    let minX = 99;
    let minY = 99;
    let maxX = 0;
    let maxY = 0;

    for (let key in bunkerBP['buildings']) {
        for (let building of bunkerBP['buildings'][key]) {
            if (building.x > maxX) maxX = building.x;
            if (building.y > maxY) maxY = building.y;
            if (building.x < minX) minX = building.x;
            if (building.y < minY) minY = building.y;
        }
    }

    let width = maxX - minX;
    let height = maxY - minY;

    return { width, height };
}

function getValidBunkerPositions(roomID, bunkerSize) {
    let room = Game.rooms[roomID];
    let terrain = room.getTerrain();

    let validPositions = [];

    for (let x = 1; x < 49 - bunkerSize.width; x++) {
        for (let y = 1; y < 49 - bunkerSize.height; y++) {
            let result = checkFit(x, y);
            if (result !== false) {
                validPositions.push({ x: result.x, y: result.y });
            }
        }
    }

    return validPositions.length > 0 ? validPositions : false;

    function checkFit(x, y) {
        let area = room.lookForAtArea(LOOK_TERRAIN, y, x, y + bunkerSize.height, x + bunkerSize.width, true);

        for (let pos of area) {
            if (pos.terrain === 'wall') {
                return false;
            }
        }

        return { x, y };
    }
}

function getBestBunkerPosition(roomID) {
    console.log(`[PLANNING] Finding best bunker position for ${roomID}`);

    let bunkerSize = getBunkerSize();
    let validPositions = getValidBunkerPositions(roomID, bunkerSize);

    if (!validPositions || validPositions.length < 1) {
        console.log(`[PLANNING] No valid bunker positions found in ${roomID}`);
        return false;
    }

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

        if (distanceFromBothSources < closestPosition.distance) {
            closestPosition = { x: pos.x, y: pos.y, distance: distanceFromBothSources };
        }
    }

    return closestPosition;
}

function tryConstructBunker(roomID) {
    console.log(`[PLANNING] Constructing bunker structures for ${roomID}`);

    let room = Game.rooms[roomID];
    let rcl = room.controller.level;

    let bunkerSize = getBunkerSize();
    let anchor = Memory.colonies[roomID].bunkerAnchor;

    let widthOffset = bunkerSize.width / 2;
    let heightOffset = bunkerSize.height / 2;

    let originX = anchor.x - widthOffset;
    let originY = anchor.y - heightOffset;

    for (let key in bunkerBP['buildings']) {
        // Skip ramparts before RCL 6
        if (rcl < 6 && key === STRUCTURE_RAMPART) continue;
        // Skip roads before RCL 5
        if (rcl < 5 && key === STRUCTURE_ROAD) continue;

        for (let building of bunkerBP['buildings'][key]) {
            let createX = originX + building.x - 1;
            let createY = originY + building.y - 1;

            room.createConstructionSite(createX, createY, key, key);
        }
    }

    // Build extractor at RCL 6+
    if (rcl >= 6) {
        let minerals = room.find(FIND_MINERALS);
        for (let mineral of minerals) {
            room.createConstructionSite(mineral.pos.x, mineral.pos.y, STRUCTURE_EXTRACTOR);
        }
    }
}

function tryConstructContainerNearController(roomID) {
    if (Memory.colonies[roomID].controllerContainer != null) return;

    let room = Game.rooms[roomID];
    let controller = room.controller;

    if (!controller) return;

    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            if (x === 0 && y === 0) continue;

            let newPos = { x: controller.pos.x + x, y: controller.pos.y + y };
            let terrain = room.getTerrain();

            if (terrain.get(newPos.x, newPos.y) !== TERRAIN_MASK_WALL) {
                let result = room.createConstructionSite(newPos.x, newPos.y, STRUCTURE_CONTAINER);
                if (result === OK) {
                    Memory.colonies[roomID].controllerContainer = {
                        state: "constructing",
                        x: newPos.x,
                        y: newPos.y
                    };
                }
                return;
            }
        }
    }
}

function tryUpdateControllerContainer(roomID) {
    if (!Memory.colonies[roomID].controllerContainer) return;

    let room = Game.rooms[roomID];
    if (!room) return;

    let container = Memory.colonies[roomID].controllerContainer;
    let currentRCL = room.controller ? room.controller.level : 0;

    if (container.state === "constructing") {
        let posInfo = room.lookForAt(LOOK_STRUCTURES, container.x, container.y);
        if (posInfo.length > 0) {
            if (posInfo[0].structureType === STRUCTURE_CONTAINER) {
                container.state = STRUCTURE_CONTAINER;
                container.id = posInfo[0].id;
            } else if (posInfo[0].structureType === STRUCTURE_LINK) {
                container.state = STRUCTURE_LINK;
                container.id = posInfo[0].id;
            }
        }
    } else if (container.state === STRUCTURE_CONTAINER && currentRCL >= 5) {
        // Upgrade container to link at RCL 5
        let structure = Game.getObjectById(container.id);
        if (structure) {
            structure.destroy();
            container.state = "ruin";
        }
    } else if (container.state === "ruin") {
        let result = room.createConstructionSite(container.x, container.y, STRUCTURE_LINK);
        if (result === OK) {
            container.state = "constructing";
        }
    }
}

function tryBuildColony(roomID) {
    tryConstructBunker(roomID);
    tryConstructContainerNearController(roomID);
}

module.exports = {
    tryBuildColony,
    tryUpdateControllerContainer,
    getBestBunkerPosition,
    tryConstructBunker,
    tryConstructContainerNearController
};