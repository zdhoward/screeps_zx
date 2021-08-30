const { moveToRoom, harvest, offload } = require('role.actions');

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

var roleHarvester_LD = {
    /** @param {Creep} creep **/
    run: function (creep) {
        switchState(creep);
        switch (creep.memory.state) {
            case "harvesting":
                if (creep.room.name != creep.memory.targetRoom) {
                    moveToRoom(creep, creep.memory.targetRoom);
                } else {
                    harvest(creep);
                }
                break;
            case "offloading":
                if (creep.room.name != creep.memory.home) {
                    moveToRoom(creep, creep.memory.home);
                } else {
                    offload(creep);
                }
                break;
        }
    }
}

module.exports = roleHarvester_LD;