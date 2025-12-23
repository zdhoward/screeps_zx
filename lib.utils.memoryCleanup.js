/**
 * lib/utils/memoryCleanup.js
 *
 * Removes stale data from Memory each tick:
 * - Dead creeps
 * - Old room cache references
 * - Expired intents
 */

const MemoryCleanup = {
    run() {
        // Clean dead creeps
        for (const creepName in Memory.creeps) {
            if (!Game.creeps[creepName]) {
                delete Memory.creeps[creepName];
            }
        }

        // Clean old room cache from Game.rooms (not Memory)
        for (const roomName in Game.rooms) {
            const room = Game.rooms[roomName];
            if (room._cacheTick && room._cacheTick < Game.time) {
                delete room._cache;
                delete room._cacheTick;
            }
        }

        // TODO: Add cleanup for old empire.rooms entries (unseen for X ticks)
        // TODO: Add cleanup for stale orders if using external control
    }
};

module.exports = MemoryCleanup;