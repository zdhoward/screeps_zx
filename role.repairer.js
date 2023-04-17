const lib = require("lib.role");

const roleRepairer = {
    /** @param {Creep} creep */
    run: function (creep) {
        if (!creep.memory.repairing || creep.memory.repairing == null) {
            let weakestStructureId = lib.findMyMostDamagedStructure(creep.room.name);
            if (weakestStructureId == null) return;
            creep.memory.repairing = weakestStructureId;
        }

        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) <= 0) {
            if (lib.withdrawResourceFromClosestStructure(creep, RESOURCE_ENERGY, STRUCTURE_CONTAINER)) return;
            if (lib.withdrawResourceFromClosestStructure(creep, RESOURCE_ENERGY, STRUCTURE_STORAGE)) return;
            if (lib.withdrawResourceFromClosestStructure(creep, RESOURCE_ENERGY, STRUCTURE_EXTENSION)) return;
            lib.pickupDroppedResource(creep, RESOURCE_ENERGY);
        } else {
            let structure = Game.getObjectById(creep.memory.repairing);

            if (structure.hits >= structure.hitsMax) {
                creep.memory.repairing = null;
                return;
            }

            if (creep.build(structure) == ERR_NOT_IN_RANGE)
                creep.travelTo(structure);

        }
    }
}

module.exports = roleRepairer;