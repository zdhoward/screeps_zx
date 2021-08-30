require('prototype.spawn')();
var flags = require('core.flags');

var maxExtractorQty = 1;

var maxNewQty = 0;

function getRequiredHarvesterLDQty(spawn) {
    return 1;
}

function getRequiredBuilderQty(spawn) {
    var targets = Game.spawns[spawn].room.find(FIND_CONSTRUCTION_SITES);
    if (targets.length > 0) {
        return 3;
    } else {
        return 0;
    }
}

function getRequiredUpgraderQty(spawn) {
    var targets = Game.spawns[spawn].room.find(FIND_CONSTRUCTION_SITES);
    if (targets.length > 2) {
        return 1;
    } else {
        return 3;
    }
}

function getRequiredHarvesterQty(spawn) {
    if (Game.spawns[spawn].room.controller.level == 1) {
        return 2;
    } else {
        return Game.spawns[spawn].room.memory.maxSourceSlots;
    }
}

function getRequiredDefenderQty(spawn) {
    if (Game.spawns[spawn].room.find(FIND_HOSTILE_CREEPS).length > 0) {
        return 3;
    } else {
        return 0;
    }
}

function getRequiredExtractorQty(spawn) {
    var extractors = _.filter(Game.spawns[spawn].room.find(FIND_STRUCTURES), (structure) => structure.structureType == STRUCTURE_EXTRACTOR);
    //console.log("ROOM: " + Game.spawns[spawn].room.name + " | E: " + extractors.length);
    return 0; // extractors.length;

}

function getRequiredRepairerQty(spawn) {
    switch (Game.spawns[spawn].room.controller.level) {
        case 1:
            return 0;
            break;
        case 2:
            return 1;
            break;
        default:
            return 2;
            break;
    }
}

function addToSpawnQueue(spawn, role, targetRoom = null, action = null) {
    if (role == 'harvester') {
        Game.spawns[spawn].room.memory.spawnQueue.unshift({ role: role, targetRoom: targetRoom, action: action });
    } else {
        Game.spawns[spawn].room.memory.spawnQueue.push({ role: role, targetRoom: targetRoom, action: action });
    }
}

function spawnFromQueue(spawn, energy) {
    if (Game.spawns[spawn].room.memory.spawnQueue.length > 0) {
        //console.log("Length: " + Game.spawns[spawn].room.memory.spawnQueue.length);
        var room = Game.spawns[spawn].room.name;
        var nextUnit = Game.spawns[spawn].room.memory.spawnQueue.shift();
        var reqEnergy = 200;
        if (nextUnit.role == "claimer") {
            reqEnergy = 750;
        }
        if (energy >= reqEnergy) {
            switch (nextUnit.role) {
                case "harvester":
                    Game.spawns[spawn].spawnHarvester(room, energy);
                    break;
                case "harvester_ld":
                    Game.spawns[spawn].spawnHarvesterLD(room, energy, nextUnit.targetRoom);
                    break;
                case "extractor":
                    Game.spawns[spawn].spawnExtractor(room, energy);
                    break;
                case "builder":
                    Game.spawns[spawn].spawnBuilder(room, energy);
                    break;
                case "builder_ld":
                    Game.spawns[spawn].spawnBuilderLD(room, energy, nextUnit.targetRoom);
                    break;
                case "upgrader":
                    Game.spawns[spawn].spawnUpgrader(room, energy);
                    break;
                case "upgrader_ld":
                    Game.spawns[spawn].spawnUpgraderLD(room, energy, nextUnit.targetRoom);
                    break;
                case "repairer":
                    Game.spawns[spawn].spawnRepairer(room, energy);
                    break;
                case "defender":
                    Game.spawns[spawn].spawnDefender(room, energy);
                    break;
                case "attacker":
                    Game.spawns[spawn].spawnAttacker(room, energy, nextUnit.targetRoom);
                    break;
                case "claimer":
                    Game.spawns[spawn].spawnClaimer(room, energy, nextUnit.targetRoom, nextUnit.action);
                    break;
                case "new":
                    Game.spawns[spawn].spawnNew(room, energy);
                    break;
            }
        } else {
            Game.spawns[spawn].room.memory.spawnQueue.unshift(nextUnit);
        }
    }
}

module.exports = {
    run: function (spawn) {
        var energy = Game.spawns[spawn].room.energyAvailable;
        var room = Game.spawns[spawn].room.name;



        var scouts = _.filter(Game.creeps, (creep) => creep.memory.role == 'scout' && creep.memory.homeRoom == room).length + _.filter(Game.spawns[spawn].room.memory.spawnQueue, (entry) => entry.role == "scout").length;

        var news = _.filter(Game.creeps, (creep) => creep.memory.role == 'new' && creep.memory.home == room).length + _.filter(Game.spawns[spawn].room.memory.spawnQueue, (entry) => entry.role == "new").length;

        var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer' && creep.memory.home == room).length + _.filter(Game.spawns[spawn].room.memory.spawnQueue, (entry) => entry.role == "repairer").length;
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader' && creep.memory.home == room).length + _.filter(Game.spawns[spawn].room.memory.spawnQueue, (entry) => entry.role == "upgrader").length;
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder' && creep.memory.home == room).length + _.filter(Game.spawns[spawn].room.memory.spawnQueue, (entry) => entry.role == "builder").length;
        var defenders = _.filter(Game.creeps, (creep) => creep.memory.role == 'defender' && creep.memory.home == room).length + _.filter(Game.spawns[spawn].room.memory.spawnQueue, (entry) => entry.role == "defender").length;
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' && creep.memory.home == room).length + _.filter(Game.spawns[spawn].room.memory.spawnQueue, (entry) => entry.role == "harvester").length;
        var harvester_lds = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester_ld' && creep.memory.home == room).length + _.filter(Game.spawns[spawn].room.memory.spawnQueue, (entry) => entry.role == "harvester_ld").length;
        var extractors = _.filter(Game.creeps, (creep) => creep.memory.role == 'extractor' && creep.memory.home == room).length + _.filter(Game.spawns[spawn].room.memory.spawnQueue, (entry) => entry.role == "extractor").length;

        if (news < maxNewQty) {
            addToSpawnQueue(spawn, "new");

        } else if (harvesters < getRequiredHarvesterQty(spawn)) {
            addToSpawnQueue(spawn, "harvester");

        } else if (defenders < getRequiredDefenderQty(spawn)) {
            addToSpawnQueue(spawn, "defender");

        } else if (upgraders < getRequiredUpgraderQty(spawn)) {
            addToSpawnQueue(spawn, "upgrader");

        } else if (builders < getRequiredBuilderQty(spawn)) {
            addToSpawnQueue(spawn, "builder");

        } else if (repairers < getRequiredRepairerQty(spawn)) {
            addToSpawnQueue(spawn, "repairer");

        } else if (harvester_lds < getRequiredHarvesterLDQty(spawn) && energy > 400) {
            // launch this from flags instead
            //Game.spawns[spawn].spawnHarvesterLD(room, energy, 'W2N6');
            //addToSpawnQueue(spawn, "harvester_ld");
        } else if (extractors < getRequiredExtractorQty(spawn)) {
            addToSpawnQueue(spawn, "extractor");
        }

        spawnFromQueue(spawn, energy);


        flags.spawn(spawn);
    }
};