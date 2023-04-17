const lib = {
    pickupDroppedResource: function (creep, resourceType) {
        const droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES);

        const droppedResourceOfType = _.filter(droppedEnergy, (resource) => resource.resourceType == resourceType);

        const closestDroppedResourceOfType = creep.pos.findClosestByRange(droppedResourceOfType)

        if (creep.pickup(closestDroppedResourceOfType) == ERR_NOT_IN_RANGE) {
            creep.travelTo(closestDroppedResourceOfType);
        }
    },

    transferResourceToClosestStructure: function (creep, resourceType, structureType) {
        const structures = creep.room.find(FIND_MY_STRUCTURES);

        const structuresOfType = _.filter(structures, (structure) => structure.structureType == structureType && structure.store.getFreeCapacity(resourceType) > 0);

        if (structuresOfType.length <= 0) return false;

        const closestStructureOfType = creep.pos.findClosestByRange(structuresOfType)
        if (creep.transfer(closestStructureOfType, resourceType) == ERR_NOT_IN_RANGE) {
            creep.travelTo(closestStructureOfType);
        }

        return true;
    },

    withdrawResourceFromClosestStructure: function (creep, resourceType, structureType) {
        const structures = creep.room.find(FIND_MY_STRUCTURES);

        const structuresOfType = _.filter(structures, (structure) => structure.structureType == structureType && structure.store.getUsedCapacity(resourceType) > 0);

        if (structuresOfType.length <= 0) return false;

        const closestStructureOfType = creep.pos.findClosestByRange(structuresOfType)
        if (creep.withdraw(closestStructureOfType, resourceType) == ERR_NOT_IN_RANGE) {
            creep.travelTo(closestStructureOfType);
        }

        return true;
    },

    withdrawEnergyFromControllerContainer(creep) {
        if (Memory.colonies[creep.room.name].controllerContainer == null) return false;
        if (Memory.colonies[creep.room.name].controllerContainer.state == STRUCTURE_CONTAINER || Memory.colonies[creep.room.name].controllerContainer.state == STRUCTURE_LINK) {
            let structure = Game.getObjectById(Memory.colonies[creep.room.name].controllerContainer.id);
            if (structure == null) return false;
            if (structure.store.getUsedCapacity(RESOURCE_ENERGY) <= 0) return false;
            if (creep.withdraw(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.travelTo(structure);
            }
        } else return false;

        return true;
    },

    findMyMostDamagedStructure: function (roomID) {
        let room = Game.rooms[roomID];
        let structures = room.find(FIND_STRUCTURES);
        let roads = _.filter(structures, (structure) => structure.structureType == STRUCTURE_ROAD);
        let myStructures = room.find(FIND_MY_STRUCTURES);
        myStructures = myStructures.concat(roads);
        let weakestStructures = _.sortBy(myStructures, (structure) => structure.hits / structure.hitsMax);
        let damagedStructures = _.filter(weakestStructures, (structure) => structure.hits < structure.hitsMax);
        if (damagedStructures.length <= 0) return null;
        return weakestStructures[0].id;
    },

    findMostDamagedFriendlyCreep: function (roomID) {
        let room = Game.rooms[roomID];
        let creeps = room.find(FIND_MY_CREEPS);

        let damagedCreeps = _.filter(creeps, (creep) => creep.hits < creep.hitsMax);

        if (damagedCreeps.length <= 0) return null;

        damagedCreeps = _.sortBy(creeps, (creep) => creep.hits / creep.hitsMax);

        return damagedCreeps[0].id;
    },

    findMostDamagedHostileCreep: function (roomID) {
        let room = Game.rooms[roomID];
        let creeps = room.find(FIND_HOSTILE_CREEPS);

        let damagedCreeps = _.sortBy(creeps, (creep) => creep.hits / creep.hitsMax);

        if (damagedCreeps.length <= 0) return null;

        return damagedCreeps[0].id;
    },
}

module.exports = lib;