/**
 * lib/ai/targeting.js
 *
 * Centralized target selection for economy actions.
 * Returns object IDs, not references (for memory storage).
 */

const Targeting = {
    /**
     * Find a construction site to build
     * Priority: spawn > extension > tower > other
     */
    findBuildTarget(room) {
        const cache = room._cache;
        if (!cache || !cache.constructionSites || cache.constructionSites.length === 0) {
            return null;
        }

        const priorities = [
            STRUCTURE_SPAWN,
            STRUCTURE_EXTENSION,
            STRUCTURE_TOWER,
            STRUCTURE_STORAGE,
            STRUCTURE_CONTAINER,
            STRUCTURE_ROAD,
            STRUCTURE_RAMPART,
            STRUCTURE_WALL
        ];

        for (const type of priorities) {
            const site = cache.constructionSites.find(s => s.structureType === type);
            if (site) return site.id;
        }

        return cache.constructionSites[0].id;
    },

    /**
     * Find a structure to repair
     * Priority: critical structures > infrastructure > walls/ramparts (limited)
     */
    findRepairTarget(room) {
        const cache = room._cache;
        if (!cache || !cache.myStructures) return null;

        // Critical structures (spawns, towers, storage)
        const critical = cache.myStructures.filter(s =>
            s.hits < s.hitsMax &&
            (s.structureType === STRUCTURE_SPAWN ||
                s.structureType === STRUCTURE_TOWER ||
                s.structureType === STRUCTURE_STORAGE)
        );
        if (critical.length > 0) {
            return _.min(critical, s => s.hits / s.hitsMax).id;
        }

        // Other structures (exclude walls/ramparts)
        const damaged = cache.myStructures.filter(s =>
            s.hits < s.hitsMax &&
            s.structureType !== STRUCTURE_WALL &&
            s.structureType !== STRUCTURE_RAMPART
        );
        if (damaged.length > 0) {
            return _.min(damaged, s => s.hits / s.hitsMax).id;
        }

        // Walls/ramparts (limited to 10k hits)
        const walls = cache.myStructures.filter(s =>
            (s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART) &&
            s.hits < Math.min(s.hitsMax, 10000)
        );
        if (walls.length > 0) {
            return _.min(walls, s => s.hits).id;
        }

        return null;
    },

    /**
     * Find the room controller to upgrade
     */
    findUpgradeTarget(room) {
        return room.controller && room.controller.my ? room.controller.id : null;
    },

    /**
     * Find an energy source to harvest
     */
    findHarvestTarget(room) {
        const cache = room._cache;
        if (!cache || !cache.sources || cache.sources.length === 0) return null;

        // Find source with fewest assigned harvesters
        const sources = cache.sources.map(source => {
            const assigned = cache.myCreeps.filter(c =>
                c.memory.role === "harvester" &&
                c.memory.assignment &&
                c.memory.assignment.sourceId === source.id
            ).length;
            return { source, assigned };
        });

        const best = _.min(sources, s => s.assigned);
        return best.source.id;
    }
};

module.exports = Targeting;