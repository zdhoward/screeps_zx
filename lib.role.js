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