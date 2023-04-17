const lib = require("lib.role");

const roleBuilder = {
    /** @param {Creep} creep */
    run: function (creep) {
        //creep.memory.building = null;
        if (!creep.memory.building || creep.memory.building == null) {
            let constructionSites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
            let mostCompleteSites = _.sortBy(constructionSites, (site) => site.progress / site.progressTotal).reverse();

            if (mostCompleteSites.length <= 0) return;

            let mostCompleteSite = mostCompleteSites[0];
            creep.memory.building = mostCompleteSite.id;
        }

        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) <= 0) {
            if (lib.withdrawResourceFromClosestStructure(creep, RESOURCE_ENERGY, STRUCTURE_CONTAINER)) return;
            if (lib.withdrawResourceFromClosestStructure(creep, RESOURCE_ENERGY, STRUCTURE_STORAGE)) return;
            if (lib.withdrawResourceFromClosestStructure(creep, RESOURCE_ENERGY, STRUCTURE_EXTENSION)) return;
            lib.pickupDroppedResource(creep, RESOURCE_ENERGY);
        } else {
            //console.log(creep.build(creep.memory.building));
            let structure = Game.getObjectById(creep.memory.building);

            if (structure == null) creep.memory.building = null;

            if (creep.build(structure) == ERR_NOT_IN_RANGE)
                creep.travelTo(structure);
        }
    }
}

module.exports = roleBuilder;