const lib = require("lib.role");

function getMineralTypeOfExtractor(creep) {
    let extractor = Game.getObjectById(creep.memory.source);

    let posInfo = creep.room.lookAt(extractor.pos.x, extractor.pos.y);
    for (let info of posInfo) {
        if (info.type == "mineral") {
            return info.mineral.mineralType;
        }
    }
}

const roleMineralHauler = {
    /** @param {Creep} creep */
    run: function (creep) {
        //var extractor = Game.getObjectById(creep.memory.source);
        var mineralType = getMineralTypeOfExtractor(creep);
        //var resourceType = creep.room.
        if (creep.store.getFreeCapacity(mineralType) > 0) {
            lib.pickupDroppedResource(creep, mineralType);
        } else {
            if (lib.transferResourceToClosestStructure(creep, mineralType, STRUCTURE_LAB)) return;
        }
    }
}

module.exports = roleMineralHauler;