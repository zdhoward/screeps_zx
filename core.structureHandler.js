const roleTower = require('role.tower');

const structureHandler = {
    run: function (colony) {
        let room = Game.rooms[colony];
        let structures = room.find(FIND_MY_STRUCTURES);

        let towers = _.filter(structures, (structure) => structure.structureType == STRUCTURE_TOWER);

        for (let i = 0; i < towers.length; i++) {
            roleTower.run(towers[i]);
        }
    }
}

module.exports = structureHandler;