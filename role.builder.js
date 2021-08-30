const { collectEnergy, build } = require('role.actions');

function switchState(creep) {
    if (creep.room.find(FIND_CONSTRUCTION_SITES) == 0) {
        creep.memory.state = null;
        creep.memory.role = "repairer";
    }

    if (creep.memory.state == null) {
        creep.memory.state = "collecting";
    }
    if (creep.memory.state == "collecting" && creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
        creep.memory.state = "building";
    }
    if (creep.memory.state == "building" && creep.store[RESOURCE_ENERGY] == 0) {
        creep.memory.state = "collecting";
    }
}

var roleBuilder = {
    /** @param {Creep} creep **/
    run: function (creep) {
        switchState(creep);
        switch (creep.memory.state) {
            case "collecting":
                collectEnergy(creep);
                break;
            case "building":
                build(creep);
                break;
        }
    }
}

module.exports = roleBuilder;