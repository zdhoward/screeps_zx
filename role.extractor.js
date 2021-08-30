const { extract, offload } = require('role.actions');

function switchState(creep) {
    if (creep.memory.state == null) {
        creep.memory.state = "extracting";
    }
    if (creep.memory.state == 'offloading' && creep.store[RESOURCE_ENERGY] == 0) {
        creep.memory.state = 'extracting';
    }
    if (creep.memory.state == 'extracting' && creep.store.getFreeCapacity() == 0) {
        creep.memory.state = 'offloading';
    }
}

var roleExtractor = {
    /** @param {Creep} creep **/
    run: function (creep) {
        switchState(creep);
        switch (creep.memory.state) {
            case "extracting":
                extract(creep);
                break;
            case "offloading":
                offload(creep);
                break;
        }
    }
}

module.exports = roleExtractor;