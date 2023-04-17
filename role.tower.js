const lib = require("lib.role");

const roleTower = {
    run: function (tower) {
        let energyRatio = tower.store.getUsedCapacity(RESOURCE_ENERGY) / tower.store.getCapacity(RESOURCE_ENERGY);
        // if enemies present, attack them
        let hostile_creepId = lib.findMostDamagedHostileCreep(tower.room.name);
        if (hostile_creepId != null) {
            let hostile_creep = Game.getObjectById(hostile_creepId);
            tower.attack(hostile_creep);
            return;
        }

        // if energy > .25 and if any friendly unit is hurt, heal them
        if (energyRatio > 0.25) {
            let friendly_creepId = lib.findMostDamagedFriendlyCreep(tower.room.name);
            if (friendly_creepId != null) {
                let friendly_creep = Game.getObjectById(friendly_creepId);
                tower.heal(friendly_creep);
                return;
            }
        }

        // if energy > .75 then repair
        if (energyRatio > 0.75) {
            //find weakest structure
            let structureId = lib.findMyMostDamagedStructure(tower.room.name);
            if (structureId == null) return;
            let structure = Game.getObjectById(structureId);
            tower.repair(structure);
            return;
        }
    }
}

module.exports = roleTower;