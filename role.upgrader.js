const lib = require("lib.role");

const roleUpgrader = {
    /** @param {Creep} creep */
    run: function (creep) {
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) <= 0) {
            if (lib.withdrawEnergyFromControllerContainer(creep)) return;
            if (lib.withdrawResourceFromClosestStructure(creep, RESOURCE_ENERGY, STRUCTURE_CONTAINER)) return;
            if (lib.withdrawResourceFromClosestStructure(creep, RESOURCE_ENERGY, STRUCTURE_STORAGE)) return;
            if (lib.withdrawResourceFromClosestStructure(creep, RESOURCE_ENERGY, STRUCTURE_EXTENSION)) return;
            lib.pickupDroppedResource(creep, RESOURCE_ENERGY);
        } else {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE)
                creep.travelTo(creep.room.controller);
        }
    }
}

module.exports = roleUpgrader;