const { moveToRoom, collectEnergy, upgrade } = require('role.actions');

function switchState(creep) {
    if (creep.memory.state == null) {
        creep.memory.state = "collecting";
    }
    if (creep.memory.state == 'upgrading' && creep.store[RESOURCE_ENERGY] == 0) {
        creep.memory.state = 'collecting';
    }
    if (creep.memory.state == 'collecting' && creep.store.getFreeCapacity() == 0) {
        creep.memory.state = 'upgrading';
    }
}

var roleUpgrader_LD = {
    /** @param {Creep} creep **/
    run: function (creep) {

        switchState(creep);
        switch (creep.memory.state) {
            case "building":
                if (creep.room.name != creep.memory.targetRoom) {
                    //creep.say("ON MY WAY");
                    moveToRoom(creep, creep.memory.targetRoom);
                } else {
                    //creep.say("BUILDING");
                    upgrade(creep);
                }
                break;
            case "collecting":
                if (creep.room.name != creep.memory.home) {
                    //creep.say("ON MY WAY");
                    moveToRoom(creep, creep.memory.home);
                } else {
                    //creep.say("COLLECTING");
                    collectEnergy(creep);
                }
                break;
        }
    }
}

module.exports = roleUpgrader_LD;