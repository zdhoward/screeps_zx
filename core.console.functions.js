function test() {
    console.log("TESTING DIRECT CONSOLE INPUT");
}

function commands() {
    console.log("COMMANDS: resetSpawnQueue(room), countCreeps(room)");
}


function resetSpawnQueue(room) {
    Game.rooms[room].memory.spawnQueue = [];
}

function countCreeps(room) {
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' && creep.memory.home == room).length;
    var harvester_lds = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester_ld' && creep.memory.home == room).length;

    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder' && creep.memory.home == room).length;
    var builder_lds = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder_ld' && creep.memory.home == room).length;

    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader' && creep.memory.home == room).length;
    var upgrader_lds = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader_ld' && creep.memory.home == room).length;

    var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer' && creep.memory.home == room).length;

    var defenders = _.filter(Game.creeps, (creep) => creep.memory.role == 'defender' && creep.memory.home == room).length;
    var attackers = _.filter(Game.creeps, (creep) => creep.memory.role == 'attacker' && creep.memory.home == room).length;

    var extractors = _.filter(Game.creeps, (creep) => creep.memory.role == 'extractor' && creep.memory.home == room).length;

    var returnString = "";

    if (harvesters > 0)
        returnString += "HRV: " + harvesters + "|";
    if (harvester_lds > 0)
        returnString += "HLD: " + harvester_lds + "|";
    if (builders > 0)
        returnString += "BUI: " + builders + "|";
    if (builder_lds > 0)
        returnString += "BLD: " + builder_lds + "|";
    if (upgraders > 0)
        returnString += "UPG: " + upgraders + "|";
    if (upgrader_lds > 0)
        returnString += "ULD: " + upgrader_lds + "|";
    if (repairers > 0)
        returnString += "REP: " + repairers + "|";
    if (defenders > 0)
        returnString += "DEF: " + defenders + "|";
    if (attackers > 0)
        returnString += "ATK: " + attackers + "|";
    if (extractors > 0)
        returnString += "EXT: " + extractors + "|";

    console.log(returnString);
}


module.exports = { test, commands, resetSpawnQueue, countCreeps };