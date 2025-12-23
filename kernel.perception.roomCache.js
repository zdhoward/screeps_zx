/**
 * kernel/perception/roomCache.js
 *
 * Per-room, per-tick snapshot cache.
 * Eliminates redundant room.find() calls.
 * Stored on room object (not Memory) for performance.
 */

const RoomCache = {
    /**
     * Build cache for a room (idempotent per tick)
     * @param {Room} room
     * @returns {object} cache
     */
    build(room) {
        if (!room) return null;

        // Return existing cache if already built this tick
        if (room._cacheTick === Game.time && room._cache) {
            return room._cache;
        }

        // Find all entities once
        const sources = room.find(FIND_SOURCES);
        const minerals = room.find(FIND_MINERALS);
        const myCreeps = room.find(FIND_MY_CREEPS);
        const hostiles = room.find(FIND_HOSTILE_CREEPS);
        const constructionSites = room.find(FIND_CONSTRUCTION_SITES);
        const structures = room.find(FIND_STRUCTURES);
        const myStructures = room.find(FIND_MY_STRUCTURES);
        const droppedResources = room.find(FIND_DROPPED_RESOURCES);
        const tombstones = room.find(FIND_TOMBSTONES);
        const ruins = room.find(FIND_RUINS);

        // Partition structures by type for fast access
        const spawns = [];
        const towers = [];
        const extensions = [];
        const links = [];
        const containers = [];
        const storage = [];
        const terminals = [];
        const labs = [];

        for (const s of myStructures) {
            switch (s.structureType) {
                case STRUCTURE_SPAWN: spawns.push(s); break;
                case STRUCTURE_TOWER: towers.push(s); break;
                case STRUCTURE_EXTENSION: extensions.push(s); break;
                case STRUCTURE_LINK: links.push(s); break;
                case STRUCTURE_CONTAINER: containers.push(s); break;
                case STRUCTURE_STORAGE: storage.push(s); break;
                case STRUCTURE_TERMINAL: terminals.push(s); break;
                case STRUCTURE_LAB: labs.push(s); break;
            }
        }

        // Build cache object
        const cache = {
            roomName: room.name,

            sources,
            minerals,

            myCreeps,
            hostiles,

            constructionSites,

            structures,
            myStructures,

            droppedResources,
            tombstones,
            ruins,

            spawns,
            towers,
            extensions,
            links,
            containers,
            storage,
            terminals,
            labs,

            energyAvailable: room.energyAvailable,
            energyCapacityAvailable: room.energyCapacityAvailable,

            controller: room.controller || null
        };

        // Attach to room object (not Memory)
        room._cache = cache;
        room._cacheTick = Game.time;

        return cache;
    },

    /**
     * Get existing cache (assumes build() was called)
     * @param {Room} room
     * @returns {object|null}
     */
    get(room) {
        return room && room._cache ? room._cache : null;
    }
};

module.exports = RoomCache;