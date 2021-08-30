// UTILITIES

function moveToRoom(creep, target) { // NEEDS TESTING
    var exit = creep.room.findExitTo(target);
    if (creep.moveTo(creep.pos.findClosestByRange(exit)) == ERR_NO_PATH) {
        if (creep.pos.x <= 1) {
            if (creep.move(RIGHT) == OK) {
                return;
            }
        }
        if (creep.pos.x >= 48) {
            if (creep.move(LEFT) == OK) {
                return;
            }
        }
        if (creep.pos.y <= 1) {
            if (creep.move(BOTTOM) == OK) {
                return;
            }
        }
        if (creep.pos.y >= 48) {
            if (creep.move(TOP) == OK) {
                return;
            }
        }
    }
}

function collectEnergy(creep) { // DONE
    var targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_EXTENSION ||
                structure.structureType == STRUCTURE_CONTAINER ||
                structure.structureType == STRUCTURE_LINK) &&
                structure.store[RESOURCE_ENERGY] > 0;
        }
    });
    if (targets.length == 0) {
        targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_SPAWN && structure.store[RESOURCE_ENERGY] > 205);
            }
        });
    }
    if (targets.length > 0) {
        var closest = creep.pos.findClosestByRange(targets);

        if (creep.withdraw(closest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(closest);
        }
    }

}

function cleanDropped(creep) { // PROBABLY NEEDS TO BE REWORKED
    var workDone = false;
    var dropped = creep.room.find(FIND_DROPPED_RESOURCES);
    if (dropped.length > 0) {
        workDone = True;
        var closest = creep.pos.findClosestByPath(dropped);

    }
    return workDone;
}

// REPAIRING [DONE]

function findRepairTarget(creep) {
    var structures = creep.room.find(FIND_STRUCTURES);
    var mostDamaged = null;
    var mostDamageAmount = 0;

    var leastHits = 99999999;
    var lowestHealth = null;

    for (var structure in structures) {
        if (structures[structure].hits < structures[structure].hitsMax) {
            if ((structures[structure].hits / structures[structure].hitsMax) > mostDamageAmount) {
                mostDamageAmount = structures[structure].hits / structures[structure].hitsMax;
                mostDamaged = structures[structure];
            }
            if (structures[structure].hits < leastHits) {
                leastHits = structures[structure].hits;
                lowestHealth = structures[structure].id;
            }
        }
    }

    if (mostDamaged) {
        creep.memory.target = lowestHealth;
    }
}

function repair(creep) {
    if (!creep.memory.target) {
        findRepairTarget(creep);
    }

    if (creep.memory.target) {
        var target = Game.getObjectById(creep.memory.target);
        if ((target.structureType == STRUCTURE_WALL || target.structureType == STRUCTURE_RAMPART) && target.hits > 5000) {
            creep.memory.target = null;
        } else if (target.hits == target.hitsMax) {
            creep.memory.target = null;
        } else if (creep.repair(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
}

// UPGRADING [DONE]
function upgrade(creep) {
    if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller);
    }
}

// BUILDING [DONE]

function findBuildTarget(creep) {
    var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
    var mostProgress = 0;
    var mostCompleteSite = null;
    for (var target in targets) {
        if (targets[target].progress >= mostProgress) {
            mostProgress = targets[target].progress;
            mostCompleteSite = target;
        }
    }
    if (mostCompleteSite) {
        //console.log(targets[mostCompleteSite]);
        creep.memory.target = targets[mostCompleteSite].id;
    }
}

function build(creep) {
    if (creep.memory.target == null) {
        findBuildTarget(creep);
    }

    if (creep.memory.target) {
        var target = Game.getObjectById(creep.memory.target);
        if (!target) {
            creep.memory.target = null;
        } else if (creep.build(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
}

// REFUELING [DONE? - NEEDS TESTING]

function findRefuelTargets(creep) {
    var target = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_TOWER ||
                structure.structureType == STRUCTURE_LAB) &&
                structure.store[RESOURCE_ENERGY] < structure.store.getCapacity(RESOURCE_ENERGY) * 0.5;
        }
    })[0];
    if (target) {
        creep.memory.target = target.id;
    }
}

function refuel(creep) {
    if (creep.memory.target == null) {
        findRefuelTargets(creep);
    }
    if (creep.memory.target) {
        var target = Game.getObjectById(creep.memory.target);
        if (!target) {
            creep.memory.target == null;
        } else if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
}

// HARVESTING [DONE]

function queueForEnergy(creep) {
    for (var source in creep.room.memory.sources) {
        if (creep.room.memory.sources[source].queue.length < creep.room.memory.sources[source].maxQueue) {
            //console.log("PUSHING " + creep.name + " INTO QUEUE");
            if (!creep.room.memory.sources[source].queue.includes(creep.name)) {
                creep.room.memory.sources[source].queue.push(creep.name);
            } else { return; }
            creep.memory.target = creep.room.memory.sources[source].id;
            return;
        }
    }
}

function offload(creep) {
    var targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_EXTENSION ||
                structure.structureType == STRUCTURE_CONTAINER ||
                structure.structureType == STRUCTURE_SPAWN ||
                structure.structureType == STRUCTURE_LINK ||
                structure.structureType == STRUCTURE_TOWER) &&
                structure.store[RESOURCE_ENERGY] < structure.store.getCapacity(RESOURCE_ENERGY);
        }
    });
    var closest = creep.pos.findClosestByRange(targets);
    if (targets.length > 0) {
        if (creep.transfer(closest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(closest);
        }
    }
}

function harvest(creep) {
    if (!creep.memory.target) {
        queueForEnergy(creep);
    }
    var target = Game.getObjectById(creep.memory.target);
    if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
    }
}

function extract(creep) {
    if (!creep.memory.target) {
        var minerals = creep.room.find(FIND_MINERALS);
        for (var mineral in minerals) {
            creep.memory.target = minerals[mineral].id;
        }
    }
    var target = Game.getObjectById(creep.memory.target);
    if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
    }
}

// CLAIMING

function claim(creep) {
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

// ATTACK/DEFEND [DONE]
function defend(creep) {
    if (!creep.memory.target) {
        //console.log("SETTING DEFENDER MEMORY");
        var hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
        if (hostiles.length > 0) {
            creep.memory.target = creep.pos.findClosestByRange(hostiles).id;
        }
    } else {
        var target = Game.getObjectById(creep.memory.target);
        if (!target) {
            creep.memory.target = null;
        } else if (creep.attack(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
}

function attack(creep) {
    if (!creep.memory.target) {
        //console.log("SETTING DEFENDER MEMORY");
        var hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
        if (hostiles.length > 0) {
            creep.memory.target = creep.pos.findClosestByRange(hostiles).id;
        }
    } else {
        var target = Game.getObjectById(creep.memory.target);
        if (!target) {
            creep.memory.target = null;
        } else if (creep.attack(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
}

// EXPORTS
module.exports = { moveToRoom, collectEnergy, repair, upgrade, build, refuel, defend, harvest, offload, claim, extract, attack };