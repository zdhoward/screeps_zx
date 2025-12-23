/**
 * lib/ai/movement.js
 *
 * Wrapper around Traveler for consistent movement API.
 * Handles path caching and avoidance logic.
 */

const Traveler = require("ext/Traveler");

const Movement = {
    /**
     * Move to a target using Traveler
     * @param {Creep} creep
     * @param {RoomPosition|RoomObject} target
     * @param {object} opts - { reusePath, range, ignoreCreeps, etc. }
     */
    moveTo(creep, target, opts = {}) {
        const defaults = {
            reusePath: 30,
            range: 1,
            ignoreCreeps: false
        };

        const options = { ...defaults, ...opts };
        return creep.travelTo(target, options);
    },

    /**
     * Move to a room (center position)
     */
    moveToRoom(creep, roomName, opts = {}) {
        const target = new RoomPosition(25, 25, roomName);
        return this.moveTo(creep, target, { ...opts, range: 20 });
    },

    /**
     * Flee from a position
     */
    flee(creep, danger, range = 5) {
        const path = PathFinder.search(creep.pos, { pos: danger, range }, {
            flee: true,
            maxRooms: 1
        });

        if (path && path.path.length > 0) {
            creep.moveByPath(path.path);
        }
    }
};

module.exports = Movement;