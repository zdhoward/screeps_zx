/**
 * kernel/perception/roomState.js
 *
 * Classifies room economy state based on observable conditions.
 * Multi-axis output:
 *   - roomType: HOME | REMOTE
 *   - mode: ECONOMY | ALERT | CRISIS | RECOVERY
 *   - threatLevel: 0-3
 */

const ROOM_TYPE = {
    HOME: "HOME",
    REMOTE: "REMOTE"
};

const MODE = {
    ECONOMY: "ECONOMY",
    ALERT: "ALERT",
    CRISIS: "CRISIS",
    RECOVERY: "RECOVERY"
};

// Thresholds
const DOWNGRADE_THRESHOLD = 5000;
const TOWER_LOW_THRESHOLD = 0.20;

/**
 * Determine if room is a home colony
 */
function getRoomType(room) {
    return (Memory.colonies && Memory.colonies[room.name])
        ? ROOM_TYPE.HOME
        : ROOM_TYPE.REMOTE;
}

/**
 * Check if towers are critically low on energy
 */
function towersLow(cache) {
    if (!cache.towers || cache.towers.length === 0) return false;
    return cache.towers.some(t => {
        const ratio = t.store.getUsedCapacity(RESOURCE_ENERGY) / t.store.getCapacity(RESOURCE_ENERGY);
        return ratio < TOWER_LOW_THRESHOLD;
    });
}

/**
 * Check if critical structures are damaged
 */
function hasCriticalDamage(cache) {
    const spawnDamaged = cache.spawns && cache.spawns.some(s => s.hits < s.hitsMax);
    const storageDamaged = cache.storage && cache.storage.some(s => s.hits < s.hitsMax);
    return !!(spawnDamaged || storageDamaged);
}

/**
 * Check if controller is at risk of downgrade
 */
function downgradeRisk(room) {
    if (!room.controller || !room.controller.my) return false;
    return room.controller.ticksToDowngrade != null &&
        room.controller.ticksToDowngrade < DOWNGRADE_THRESHOLD;
}

/**
 * Check if room has repairable damage (non-critical)
 */
function hasRepairableDamage(cache) {
    return cache.myStructures && cache.myStructures.some(s =>
        s.hits != null &&
        s.hitsMax != null &&
        s.hits < s.hitsMax &&
        s.structureType !== STRUCTURE_WALL &&
        s.structureType !== STRUCTURE_RAMPART
    );
}

/**
 * Classify threat level (0-3)
 */
function classifyThreatLevel(roomType, cache, room) {
    if (!cache.hostiles || cache.hostiles.length === 0) return 0;

    let level = 1; // Base: hostiles present

    if (roomType === ROOM_TYPE.HOME) {
        level = 2; // Home rooms start at level 2

        if (towersLow(cache) || hasCriticalDamage(cache) || downgradeRisk(room)) {
            level = 3; // Critical conditions
        }
    } else {
        // Remote rooms
        if (towersLow(cache)) {
            level = 2;
        }
    }

    return level;
}

const RoomState = {
    ROOM_TYPE,
    MODE,

    /**
     * Classify a room's state
     * @param {Room} room
     * @returns {{roomType: string, mode: string, threatLevel: number}}
     */
    classify(room) {
        const cache = room._cache;
        const roomType = getRoomType(room);

        if (!cache) {
            return { roomType, mode: MODE.ECONOMY, threatLevel: 0 };
        }

        const hostilesPresent = cache.hostiles && cache.hostiles.length > 0;
        const threatLevel = classifyThreatLevel(roomType, cache, room);

        // Determine mode
        let mode = MODE.ECONOMY;

        if (hostilesPresent) {
            if (roomType === ROOM_TYPE.HOME && threatLevel >= 3) {
                mode = MODE.CRISIS;
            } else {
                mode = MODE.ALERT;
            }
        } else if (hasRepairableDamage(cache)) {
            mode = MODE.RECOVERY;
        }

        // Persist to room memory
        room.memory.state = mode;
        room.memory.roomType = roomType;
        room.memory.threatLevel = threatLevel;

        // Also store in empire memory for global awareness
        Memory.empire.rooms = Memory.empire.rooms || {};
        Memory.empire.rooms[room.name] = {
            state: mode,
            roomType: roomType,
            threatLevel: threatLevel,
            lastSeen: Game.time
        };

        return { roomType, mode, threatLevel };
    }
};

module.exports = RoomState;