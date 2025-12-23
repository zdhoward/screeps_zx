/**
 * kernel/planning/structurePlanner.js
 *
 * Generates intents for structures (towers, links, etc.)
 */

const StructurePlanner = {
    /**
     * Plan structure actions for a room
     * @param {Room} room
     */
    plan(room) {
        if (!room || !room._cache) return;

        const cache = room._cache;

        // Plan tower actions
        for (const tower of cache.towers) {
            // Towers act immediately on hostiles
            if (cache.hostiles.length > 0) {
                Memory.intents.structures.towers[tower.id] = "attack";
            } else if (tower.store.getUsedCapacity(RESOURCE_ENERGY) > tower.store.getCapacity(RESOURCE_ENERGY) * 0.25) {
                Memory.intents.structures.towers[tower.id] = "heal";
            } else if (tower.store.getUsedCapacity(RESOURCE_ENERGY) > tower.store.getCapacity(RESOURCE_ENERGY) * 0.75) {
                Memory.intents.structures.towers[tower.id] = "repair";
            }
        }

        // Plan link transfers
        // TODO: Implement link balancing logic
        // Basic strategy: push energy from source links to upgrader/storage links
    }
};

module.exports = StructurePlanner;