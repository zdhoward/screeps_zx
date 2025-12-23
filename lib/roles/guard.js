/**
 * lib/roles/guard.js
 *
 * Moves to threatened room and attacks hostiles.
 */

const Movement = require("lib/ai/movement");

const Guard = {
    run(creep) {
        const targetRoom = creep.memory.assignment && creep.memory.assignment.targetRoom;
        if (!targetRoom) return;

        // Move to target room
        if (creep.room.name !== targetRoom) {
            Movement.moveToRoom(creep, targetRoom);
            return;
        }

        // In target room: attack hostiles
        const cache = creep.room._cache;
        if (!cache || !cache.hostiles || cache.hostiles.length === 0) {
            // No hostiles, patrol or return home
            // TODO: Add patrol or return logic
            return;
        }

        const target = creep.pos.findClosestByRange(cache.hostiles);
        if (!target) return;

        const result = creep.attack(target);
        if (result === ERR_NOT_IN_RANGE) {
            Movement.moveTo(creep, target, { reusePath: 5 });
        }
    }
};

module.exports = Guard;