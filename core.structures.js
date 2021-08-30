var coreStructures = {
    /** @param {Spawn} structure **/
    run: function (spawn) {
        var towers = _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_TOWER && structure.room.name == spawn.room.name);
        var links = _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_LINK && structure.room.name == spawn.room.name);
        var terminals = _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_TERMINAL && structure.room.name == spawn.room.name);
        var factories = _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_FACTORY && structure.room.name == spawn.room.name);
        var labs = _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_LAB && structure.room.name == spawn.room.name);
        var nukers = _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_NUKER && structure.room.name == spawn.room.name);
        var observers = _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_OBSERVER && structure.room.name == spawn.room.name);
    }
}

module.exports = coreStructures;