/**
 * kernel/execution/structureExecutor.js
 *
 * Executes structure intents (towers, links, etc.)
 */

const TowerAI = require("lib/roles/tower");

/**
 * Execute tower intents
 */
function executeTowers(room) {
    const cache = room._cache;
    if (!cache || !cache.towers) return;

    for (const tower of cache.towers) {
        TowerAI.run(tower);
    }
}

/**
 * Execute link transfers
 */
function executeLinks(room) {
    const cache = room._cache;
    if (!cache || !cache.links || cache.links.length <= 1) return;

    // TODO: Implement smart link balancing
    // Basic strategy: find source links (near sources) and push to storage/upgrade links

    for (const link of cache.links) {
        if (link.cooldown > 0) continue;

        const intent = Memory.intents.structures.links[link.id];
        if (!intent || !intent.transferTo) continue;

        const targetLink = Game.getObjectById(intent.transferTo);
        if (!targetLink) continue;

        const amount = Math.min(
            link.store.getUsedCapacity(RESOURCE_ENERGY),
            targetLink.store.getFreeCapacity(RESOURCE_ENERGY)
        );

        if (amount > 0) {
            link.transferEnergy(targetLink, amount);
        }
    }
}

const StructureExecutor = {
    run(room) {
        executeTowers(room);
        executeLinks(room);
    }
};

module.exports = StructureExecutor;