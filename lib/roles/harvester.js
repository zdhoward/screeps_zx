/**
 * lib/roles/harvester.js
 *
 * Static harvester: stays at assigned source and mines continuously.
 */

const Movement = require("lib/ai/movement");

const Harvester = {
    run(creep) {
        // Ensure assignment exists
        if (!creep.memory.assignment || !creep.memory.assignment.sourceId) {
            // Try to find a source in home room
            const homeRoom = Game.rooms[creep.memory.homeRoom];
            if (!homeRoom || !homeRoom._cache) return;

            const Targeting = require("lib.ai.targeting");
            const sourceId = Targeting.findHarvestTarget(homeRoom);

            if (!sourceId) return;

            creep.memory.assignment = { sourceId };
        }

        const source = Game.getObjectById(creep.memory.assignment.sourceId);
        if (!source) {
            // Source gone, reset assignment
            delete creep.memory.assignment;
            return;
        }

        // Harvest
        const result = creep.harvest(source);
        if (result === ERR_NOT_IN_RANGE) {
            Movement.moveTo(creep, source, { reusePath: 50 });
        }
    }
};

module.exports = Harvester;