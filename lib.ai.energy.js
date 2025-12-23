/**
 * lib/ai/energy.js
 *
 * Centralized energy acquisition and deposit logic.
 */

const Energy = {
    /**
     * Acquire energy for a creep
     * Priority: dropped > tombstone > ruin > container > storage > source
     */
    acquire(creep) {
        const room = creep.room;
        const cache = room._cache;

        if (!cache) return ERR_BUSY;

        // 1. Dropped energy
        if (cache.droppedResources.length > 0) {
            const target = creep.pos.findClosestByRange(
                cache.droppedResources.filter(r => r.resourceType === RESOURCE_ENERGY && r.amount > 50)
            );
            if (target) {
                if (creep.pickup(target) === ERR_NOT_IN_RANGE) {
                    creep.travelTo(target, { reusePath: 20 });
                }
                return OK;
            }
        }

        // 2. Tombstones
        if (cache.tombstones.length > 0) {
            const target = creep.pos.findClosestByRange(
                cache.tombstones.filter(t => t.store.getUsedCapacity(RESOURCE_ENERGY) > 0)
            );
            if (target) {
                if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.travelTo(target, { reusePath: 20 });
                }
                return OK;
            }
        }

        // 3. Ruins
        if (cache.ruins.length > 0) {
            const target = creep.pos.findClosestByRange(
                cache.ruins.filter(r => r.store.getUsedCapacity(RESOURCE_ENERGY) > 0)
            );
            if (target) {
                if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.travelTo(target, { reusePath: 20 });
                }
                return OK;
            }
        }

        // 4. Storage (if available and has energy)
        if (cache.storage.length > 0) {
            const storage = cache.storage[0];
            if (storage.store.getUsedCapacity(RESOURCE_ENERGY) > 1000) {
                if (creep.withdraw(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.travelTo(storage, { reusePath: 30 });
                }
                return OK;
            }
        }

        // 5. Containers
        if (cache.containers.length > 0) {
            const target = creep.pos.findClosestByRange(
                cache.containers.filter(c => c.store.getUsedCapacity(RESOURCE_ENERGY) > 0)
            );
            if (target) {
                if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.travelTo(target, { reusePath: 30 });
                }
                return OK;
            }
        }

        // 6. Harvest directly from source (fallback)
        if (cache.sources.length > 0) {
            const source = creep.pos.findClosestByRange(cache.sources);
            if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.travelTo(source, { reusePath: 30 });
            }
            return OK;
        }

        return ERR_NOT_FOUND;
    },

    /**
     * Deposit energy to structures
     * Priority: spawn > extension > tower > storage > container
     */
    deposit(creep) {
        const room = creep.room;
        const cache = room._cache;

        if (!cache) return ERR_BUSY;

        // 1. Spawns (if not full)
        if (cache.spawns.length > 0) {
            const spawn = cache.spawns.find(s => s.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
            if (spawn) {
                if (creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.travelTo(spawn, { reusePath: 20 });
                }
                return OK;
            }
        }

        // 2. Extensions
        if (cache.extensions.length > 0) {
            const ext = creep.pos.findClosestByRange(
                cache.extensions.filter(e => e.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
            );
            if (ext) {
                if (creep.transfer(ext, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.travelTo(ext, { reusePath: 20 });
                }
                return OK;
            }
        }

        // 3. Towers (if low)
        if (cache.towers.length > 0) {
            const tower = cache.towers.find(t =>
                t.store.getUsedCapacity(RESOURCE_ENERGY) < t.store.getCapacity(RESOURCE_ENERGY) * 0.80
            );
            if (tower) {
                if (creep.transfer(tower, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.travelTo(tower, { reusePath: 20 });
                }
                return OK;
            }
        }

        // 4. Storage
        if (cache.storage.length > 0) {
            const storage = cache.storage[0];
            if (creep.transfer(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.travelTo(storage, { reusePath: 30 });
            }
            return OK;
        }

        // 5. Controller container (if exists)
        // TODO: Implement controller container targeting

        return ERR_NOT_FOUND;
    }
};

module.exports = Energy;