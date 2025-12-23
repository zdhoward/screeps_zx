/**
 * lib/roles/janitor.js
 *
 * Picks up dropped resources and feeds towers.
 */

const Energy = require("lib/ai/energy");
const Movement = require("lib/ai/movement");

const Janitor = {
    run(creep) {
        const isEmpty = creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0;
        const isFull = creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0;

        if (isEmpty && creep.memory.delivering) {
            creep.memory.delivering = false;
        } else if (isFull && !creep.memory.delivering) {
            creep.memory.delivering = true;
        }

        if (creep.memory.delivering) {
            // Priority: feed towers
            const cache = creep.room._cache;
            if (cache && cache.towers.length > 0) {
                const tower = creep.pos.findClosestByRange(
                    cache.towers.filter(t =>
                        t.store.getUsedCapacity(RESOURCE_ENERGY) < t.store.getCapacity(RESOURCE_ENERGY) * 0.90
                    )
                );
                if (tower) {
                    if (creep.transfer(tower, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        Movement.moveTo(creep, tower, { reusePath: 20 });
                    }
                    return;
                }
            }

            // Fallback: deposit normally
            Energy.deposit(creep);
        } else {
            Energy.acquire(creep);
        }
    }
};

module.exports = Janitor;