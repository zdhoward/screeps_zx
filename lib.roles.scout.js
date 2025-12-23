/**
 * lib/roles/scout.js
 *
 * Explores adjacent rooms for visibility and intel.
 */

const Movement = require("lib.ai.movement");

const Scout = {
    run(creep) {
        if (!creep.memory.assignment || !creep.memory.assignment.targetRoom) {
            // Pick a random adjacent room
            const exits = Game.map.describeExits(creep.room.name);
            if (!exits) return;

            const rooms = Object.values(exits);
            const targetRoom = rooms[Math.floor(Math.random() * rooms.length)];

            creep.memory.assignment = { targetRoom };
        }

        const targetRoom = creep.memory.assignment.targetRoom;

        if (creep.room.name !== targetRoom) {
            Movement.moveToRoom(creep, targetRoom);
        } else {
            // Reached target, pick new room
            delete creep.memory.assignment;
        }
    }
};

module.exports = Scout;