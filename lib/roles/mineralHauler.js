/**
 * lib/roles/mineralHauler.js
 *
 * Picks up minerals from extractors and deposits to labs/storage.
 */

const Movement = require("lib/ai/movement");

function getMineralType(creep) {
    if (!creep.memory.assignment || !creep.memory.assignment.mineralId) return null;

    const mineral = Game.getObjectById(creep.memory.assignment.mineralId);
    return mineral ? mineral.mineralType : null;
}

const MineralHauler = {
    run(creep) {
        const mineralType = getMineralType(creep);
        if (!mineralType) {
            // Try to find mineral in home room
            const homeRoom = Game.rooms[creep.memory.homeRoom];
            if (!homeRoom || !homeRoom._cache) return;

            const minerals = homeRoom._cache.minerals;
            if (!minerals || minerals.length === 0) return;

            creep.memory.assignment = { mineralId: minerals[0].id };
            return;
        }

        const isEmpty = creep.store.getUsedCapacity(mineralType) === 0;
        const isFull = creep.store.getFreeCapacity(mineralType) === 0;

        if (isEmpty && creep.memory.hauling) {
            creep.memory.hauling = false;
        } else if (isFull && !creep.memory.hauling) {
            creep.memory.hauling = true;
        }

        if (creep.memory.hauling) {
            // Deposit to labs or storage
            const cache = creep.room._cache;
            if (!cache) return;

            // Priority: labs
            if (cache.labs && cache.labs.length > 0) {
                const lab = creep.pos.findClosestByRange(
                    cache.labs.filter(l => l.store.getFreeCapacity(mineralType) > 0)
                );
                if (lab) {
                    if (creep.transfer(lab, mineralType) === ERR_NOT_IN_RANGE) {
                        Movement.moveTo(creep, lab, { reusePath: 30 });
                    }
                    return;
                }
            }

            // Fallback: storage
            if (cache.storage && cache.storage.length > 0) {
                const storage = cache.storage[0];
                if (creep.transfer(storage, mineralType) === ERR_NOT_IN_RANGE) {
                    Movement.moveTo(creep, storage, { reusePath: 30 });
                }
            }
        } else {
            // Pickup minerals from dropped resources or container
            const cache = creep.room._cache;
            if (!cache) return;

            // Check for dropped minerals
            if (cache.droppedResources.length > 0) {
                const dropped = creep.pos.findClosestByRange(
                    cache.droppedResources.filter(r => r.resourceType === mineralType)
                );
                if (dropped) {
                    if (creep.pickup(dropped) === ERR_NOT_IN_RANGE) {
                        Movement.moveTo(creep, dropped, { reusePath: 20 });
                    }
                    return;
                }
            }

            // Check containers near mineral
            const mineral = Game.getObjectById(creep.memory.assignment.mineralId);
            if (mineral) {
                const containers = mineral.pos.findInRange(FIND_STRUCTURES, 2, {
                    filter: s => s.structureType === STRUCTURE_CONTAINER &&
                        s.store.getUsedCapacity(mineralType) > 0
                });
                if (containers.length > 0) {
                    if (creep.withdraw(containers[0], mineralType) === ERR_NOT_IN_RANGE) {
                        Movement.moveTo(creep, containers[0], { reusePath: 30 });
                    }
                }
            }
        }
    }
};

module.exports = MineralHauler;