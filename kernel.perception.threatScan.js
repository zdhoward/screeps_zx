/**
 * kernel/perception/threatScan.js
 *
 * Empire-wide threat coordinator.
 * Produces structured threat objects for all rooms with hostiles.
 *
 * Output:
 *   threats: [{ roomName, roomType, threatLevel, mode, hostileCount, hasTowers, towersLow }]
 *   anyHomeCrisis: boolean
 *   anyHomeAlert: boolean
 */

const RoomState = require("kernel.perception.roomState");

function energyRatio(structure) {
    const cap = structure.store.getCapacity(RESOURCE_ENERGY);
    if (!cap) return 0;
    return structure.store.getUsedCapacity(RESOURCE_ENERGY) / cap;
}

const ThreatScan = {
    /**
     * Scan all visible rooms for threats
     * @returns {{threats: Array, anyHomeCrisis: boolean, anyHomeAlert: boolean}}
     */
    run() {
        const threats = [];

        for (const roomName in Game.rooms) {
            const room = Game.rooms[roomName];
            const cache = room._cache;

            if (!cache) continue;

            // Get room state (should already be classified)
            const state = {
                roomType: room.memory.roomType,
                mode: room.memory.state,
                threatLevel: room.memory.threatLevel
            };

            // Skip rooms with no threats
            if (state.threatLevel <= 0) continue;

            const hasTowers = cache.towers && cache.towers.length > 0;
            const towersLow = hasTowers
                ? cache.towers.some(t => energyRatio(t) < 0.20)
                : false;

            threats.push({
                roomName,
                roomType: state.roomType,
                threatLevel: state.threatLevel,
                mode: state.mode,
                hostileCount: cache.hostiles ? cache.hostiles.length : 0,
                hasTowers,
                towersLow
            });
        }

        // Aggregate flags
        const anyHomeCrisis = threats.some(t =>
            t.roomType === RoomState.ROOM_TYPE.HOME &&
            t.mode === RoomState.MODE.CRISIS
        );

        const anyHomeAlert = threats.some(t =>
            t.roomType === RoomState.ROOM_TYPE.HOME &&
            t.mode === RoomState.MODE.ALERT
        );

        return { threats, anyHomeCrisis, anyHomeAlert };
    }
};

module.exports = ThreatScan;