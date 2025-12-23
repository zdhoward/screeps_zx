/**
 * lib/roles/tower.js
 *
 * Tower AI: attack > heal > repair
 */

const Tower = {
    run(tower) {
        const room = tower.room;
        const cache = room._cache;

        if (!cache) return;

        const energyRatio = tower.store.getUsedCapacity(RESOURCE_ENERGY) /
            tower.store.getCapacity(RESOURCE_ENERGY);

        // 1. Attack hostiles (always priority)
        if (cache.hostiles.length > 0) {
            const target = _.min(cache.hostiles, h => h.hits / h.hitsMax);
            tower.attack(target);
            return;
        }

        // 2. Heal damaged creeps (if energy > 25%)
        if (energyRatio > 0.25) {
            const injured = cache.myCreeps.filter(c => c.hits < c.hitsMax);
            if (injured.length > 0) {
                const target = _.min(injured, c => c.hits / c.hitsMax);
                tower.heal(target);
                return;
            }
        }

        // 3. Repair structures (if energy > 75%)
        if (energyRatio > 0.75) {
            const damaged = cache.myStructures.filter(s =>
                s.hits && s.hits < s.hitsMax &&
                s.structureType !== STRUCTURE_WALL &&
                s.structureType !== STRUCTURE_RAMPART
            );

            if (damaged.length > 0) {
                const target = _.min(damaged, s => s.hits / s.hitsMax);
                tower.repair(target);
                return;
            }

            // Repair walls/ramparts to minimum threshold
            const walls = cache.myStructures.filter(s =>
                (s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART) &&
                s.hits < 10000
            );

            if (walls.length > 0) {
                const target = _.min(walls, s => s.hits);
                tower.repair(target);
            }
        }
    }
};

module.exports = Tower;