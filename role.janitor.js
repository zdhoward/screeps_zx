const lib = require("lib.role");

const roleJanitor = {
    /** @param {Creep} creep */
    run: function (creep) {
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            if (lib.withdrawResourceFromClosestStructure(creep, RESOURCE_ENERGY, STRUCTURE_STORAGE)) return;
            lib.pickupDroppedResource(creep, RESOURCE_ENERGY);
        } else {
            if (lib.transferResourceToClosestStructure(creep, RESOURCE_ENERGY, STRUCTURE_TOWER)) return;
            //if (lib.transferResourceToClosestStructure(creep, RESOURCE_ENERGY, STRUCTURE_LINK)) return;
        }
    }
}

module.exports = roleJanitor;