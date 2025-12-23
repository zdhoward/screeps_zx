/**
 * lib/roles/builder.js
 *
 * Builds construction sites.
 */

const Energy = require("lib.ai.energy");
const Targeting = require("lib.ai.targeting");
const Movement = require("lib.ai.movement");

const Builder = {
    run(creep) {
        const isEmpty = creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0;

        if (isEmpty) {
            delete creep.memory.intent;
            Energy.acquire(creep);
            return;
        }

        // Find target if needed
        if (!creep.memory.intent || !creep.memory.intent.targetId) {
            const targetId = Targeting.findBuildTarget(creep.room);
            if (!targetId) {
                // No construction sites, idle or upgrade
                const controller = creep.room.controller;
                if (controller && controller.my) {
                    creep.upgradeController(controller);
                }
                return;
            }
            creep.memory.intent = { action: "build", targetId };
        }

        // Execute build
        const target = Game.getObjectById(creep.memory.intent.targetId);
        if (!target) {
            delete creep.memory.intent;
            return;
        }

        const result = creep.build(target);
        if (result === ERR_NOT_IN_RANGE) {
            Movement.moveTo(creep, target, { reusePath: 30 });
        } else if (result === OK && target.progress === target.progressTotal) {
            delete creep.memory.intent;
        }
    }
};

module.exports = Builder;