const { collectEnergy, upgrade } = require('role.actions');

function switchState(creep) {
    if (creep.memory.state == null) {
        creep.memory.state = "collecting";
    }
    if (creep.memory.state == "collecting" && creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
        creep.memory.state = "upgrading";
    }
    if (creep.memory.state == "upgrading" && creep.store[RESOURCE_ENERGY] == 0) {
        creep.memory.state = "collecting";
    }
}

var roleUpgrader = {
    /** @param {Creep} creep **/
    run: function (creep) {
        switchState(creep);
        switch (creep.memory.state) {
            case "collecting":
                collectEnergy(creep);
                break;
            case "upgrading":
                upgrade(creep);
                break;
        }
    }
}

module.exports = roleUpgrader;