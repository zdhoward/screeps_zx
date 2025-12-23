/**
 * lib/roles/repairer.js
 *
 * Repairs damaged structures.
 */

const Energy = require("lib.ai.energy");
const Targeting = require("lib.ai.targeting");
const Movement = require("lib.ai.movement");

const Repairer = {
    run(creep) {
        const isEmpty = creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0;

        if (isEmpty) {
            delete creep.memory.intent;
            Energy.acquire(creep);
            return;
        }

        // Find target if needed
        if (!creep.memory.intent || !creep.memory.intent.targetId) {
            const targetId = Targeting.findRepairTarget(creep.room);
            if (!targetId) {
                // Nothing to repair, upgrade controller
                const controller = creep.room.controller;
                if (controller && controller.my) {
                    if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
                        Movement.moveTo(creep, controller, { reusePath: 50, range: 3 });
                    }
                }
                return;
            }
            creep.memory.intent = { action: "repair", targetId };
        }

        // Execute repair
        const target = Game.getObjectById(creep.memory.intent.targetId);
        if (!target || target.hits === target.hitsMax) {
            delete creep.memory.intent;
            return;
        }

        const result = creep.repair(target);
        if (result === ERR_NOT_IN_RANGE) {
            Movement.moveTo(creep, target, { reusePath: 30 });
        }

        // Re-evaluate target periodically
        if (Game.time % 10 === 0) {
            delete creep.memory.intent;
        }
    }
};

module.exports = Repairer;