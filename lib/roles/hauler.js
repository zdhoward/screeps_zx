/**
 * lib/roles/hauler.js
 *
 * Picks up energy from sources/containers and deposits to spawns/extensions.
 */

const Energy = require("lib.ai.energy");

const Hauler = {
    run(creep) {
        const isEmpty = creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0;
        const isFull = creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0;

        // Switch state
        if (isEmpty && creep.memory.hauling) {
            creep.memory.hauling = false;
        } else if (isFull && !creep.memory.hauling) {
            creep.memory.hauling = true;
        }

        if (creep.memory.hauling) {
            Energy.deposit(creep);
        } else {
            Energy.acquire(creep);
        }
    }
};

module.exports = Hauler;