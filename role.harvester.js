const { harvest, offload } = require('role.actions');

function switchState(creep) {
    if (creep.memory.state == null) {
        creep.memory.state = "harvesting";
    }
    if (creep.memory.state != 'harvesting' && creep.store[RESOURCE_ENERGY] == 0) {
        creep.memory.state = 'harvesting';
    }
    if (creep.memory.state == 'harvesting' && creep.store.getFreeCapacity() == 0) {
        creep.memory.state = 'offloading';
    }
}

var roleHarvester = {
    /** @param {Creep} creep **/
    run: function (creep) {
        switchState(creep);
        switch (creep.memory.state) {
            case "harvesting":
                harvest(creep);
                break;
            case "offloading":
                offload(creep);
                break;
        }
    }
}

module.exports = roleHarvester;