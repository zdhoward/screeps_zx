const lib = require("lib.role");

const roleHauler = {
    /** @param {Creep} creep */
    run: function (creep) {
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            lib.pickupDroppedResource(creep, RESOURCE_ENERGY);
        } else {
            if (lib.transferResourceToClosestStructure(creep, RESOURCE_ENERGY, STRUCTURE_SPAWN)) return;
            if (lib.transferResourceToClosestStructure(creep, RESOURCE_ENERGY, STRUCTURE_EXTENSION)) return;
            if (lib.transferResourceToClosestStructure(creep, RESOURCE_ENERGY, STRUCTURE_LINK)) return;
            if (lib.transferResourceToClosestStructure(creep, RESOURCE_ENERGY, STRUCTURE_STORAGE)) return;
            if (lib.transferResourceToClosestStructure(creep, RESOURCE_ENERGY, STRUCTURE_CONTAINER)) return;
            if (lib.transferResourceToClosestStructure(creep, RESOURCE_ENERGY, STRUCTURE_TOWER)) return;
        }
    }
}

module.exports = roleHauler;