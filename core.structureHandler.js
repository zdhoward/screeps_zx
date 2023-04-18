const profiler = require("ext.profiler");

const roleTower = require('role.tower');

function balanceLinks(roomID) {
    // get all links
    let room = Game.rooms[roomID];
    let structures = room.find(FIND_MY_STRUCTURES);
    let links = _.filter(structures, (structure) => structure.structureType == STRUCTURE_LINK);

    // SHOULD PROBABLY REDO THIS TO PUSH ENERGY FROM BUNKER TO OTHER LINKS

    for (let link of links) {
        if (link.cooldown > 0) continue;
        for (let sublink of links) {
            if (link == sublink) continue;
            let linkEnergy = link.store.getUsedCapacity(RESOURCE_ENERGY);
            let sublinkEnergy = sublink.store.getUsedCapacity(RESOURCE_ENERGY);
            if (linkEnergy > sublinkEnergy)
                link.transferEnergy(sublink, (linkEnergy - sublinkEnergy) / 2);
        }
    }
}

const structureHandler = {
    run: function (colony) {
        let room = Game.rooms[colony];
        let structures = room.find(FIND_MY_STRUCTURES);

        let towers = _.filter(structures, (structure) => structure.structureType == STRUCTURE_TOWER);


        for (let i = 0; i < towers.length; i++) {
            roleTower.run(towers[i]);
        }

        balanceLinks(colony);
    }
}

profiler.registerObject(structureHandler, 'structureHandler');

module.exports = structureHandler;