const { collectEnergy, repair, refuel } = require('role.actions');

function switchState(creep) {
    if (creep.memory.state == null) {
        creep.memory.state = "collecting";
    }
    if (creep.memory.state == "collecting" && creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
        creep.memory.state = "repairing";
    }
    if ((creep.memory.state == "repairing" || creep.memory.state == "refueling") && creep.store[RESOURCE_ENERGY] == 0) {
        creep.memory.state = "collecting";
    }
    var targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_TOWER ||
                structure.structureType == STRUCTURE_LAB) &&
                structure.store[RESOURCE_ENERGY] < structure.store.getCapacity(RESOURCE_ENERGY) * 0.5;
        }
    });
    if (creep.memory.state == "repairing" && targets.length > 0) {
        creep.memory.state = "refueling";
        creep.memory.target = null;
    }
    if (creep.memory.state == "refueling" && targets.length == 0) {
        creep.memory.state = "repairing";
        creep.memory.target = null;
    }
}

var roleRepairer = {
    /** @param {Creep} creep **/
    run: function (creep) {
        switchState(creep);
        switch (creep.memory.state) {
            case "collecting":
                collectEnergy(creep);
                break;
            case "repairing":
                repair(creep);
                break;
            case "refueling":
                refuel(creep);
                break;
        }
    }
}

module.exports = roleRepairer;