var targetRoom = "W1N4";

function collectEnergy(creep) {
    //console.log("Attempting to find Container/Extension");
    var targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_EXTENSION ||
                structure.structureType == STRUCTURE_CONTAINER ||
                structure.structureType == STRUCTURE_LINK) &&
                structure.store[RESOURCE_ENERGY] > 0;
        }
    });
    if (targets.length == 0) {
        //console.log("Attempting to find Spawn");
        targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_SPAWN && structure.store[RESOURCE_ENERGY] > 250);
            }
        });
    }
    //console.log(targets);
    if (targets.length > 0) {
        //console.log("Attempting to withdraw");
        var closest = creep.pos.findClosestByRange(targets);

        if (creep.withdraw(closest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(closest);
        }
    }

}

var roleClaimer = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.memory.state == null) {
            creep.memory.state = "moving";
        }

        if (creep.memory.state != "claiming" && creep.room.name == creep.memory.targetRoom) {
            creep.memory.state = "claiming";
        }

        if (creep.memory.state == "moving" && creep.room.name != creep.memory.targetRoom) {
            var exit = creep.room.findExitTo(creep.memory.targetRoom);
            creep.moveTo(creep.pos.findClosestByRange(exit));
        }
        else if (creep.memory.state == "claiming" && creep.room.name == creep.memory.targetRoom) {
            
            //if (creep.room.controller.my){ /// body parts are wrong to switch :(
            //    creep.memory.role = "builder_ld";
            //    creep.memory.state = "collecting";
            //}

            if (creep.memory.action == "claim") {
                if (creep.claimController(creep.room.controller) != OK) {
                    //console.log("CLAIMING");
                    creep.moveTo(creep.room.controller);
                }
            } else if (creep.memory.action == "reserve") {
                //console.log("RESERVING");
                if (creep.reserveController(creep.room.controller) != OK) {
                    creep.moveTo(creep.room.controller);
                }
            }
        }
    }
}

module.exports = roleClaimer;