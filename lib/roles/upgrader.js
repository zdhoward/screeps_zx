/**
 * lib/roles/upgrader.js
 *
 * Upgrades the controller continuously.
 */

const Energy = require("lib/ai/energy");
const Movement = require("lib/ai/movement");

const Upgrader = {
    run(creep) {
        const isEmpty = creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0;

        if (isEmpty) {
            Energy.acquire(creep);
            return;
        }

        const controller = creep.room.controller;
        if (!controller || !controller.my) return;

        const result = creep.upgradeController(controller);
        if (result === ERR_NOT_IN_RANGE) {
            Movement.moveTo(creep, controller, { reusePath: 50, range: 3 });
        }
    }
};

module.exports = Upgrader;