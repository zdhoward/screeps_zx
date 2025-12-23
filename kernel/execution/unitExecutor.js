/**
 * kernel/execution/unitExecutor.js
 *
 * Executes spawn intents and creep behaviors.
 */

const RoleRegistry = require("lib/roles/registry");
const UnitFactory = require("lib/unitFactory");

/**
 * Execute spawn intents for a room
 */
function executeSpawns(room) {
    const cache = room._cache;
    if (!cache || !cache.spawns) return;

    for (const spawn of cache.spawns) {
        if (spawn.spawning) {
            // Show spawning label
            const spawningCreep = Game.creeps[spawn.spawning.name];
            if (spawningCreep) {
                spawn.room.visual.text(
                    '🛠️' + spawningCreep.memory.role,
                    spawn.pos.x + 1,
                    spawn.pos.y,
                    { align: 'left', opacity: 0.8 }
                );
            }
            continue;
        }

        const intent = Memory.intents.spawns[spawn.id];
        if (!intent) continue;

        // Execute spawn
        const result = UnitFactory.spawn(spawn, intent.role, intent.options);

        if (result === OK) {
            console.log(`[SPAWN] ${spawn.name} spawning ${intent.role}`);
            delete Memory.intents.spawns[spawn.id];
        }
    }
}

/**
 * Execute all creep behaviors
 */
function executeCreeps() {
    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName];
        const role = creep.memory.role;

        if (!role) {
            console.log(`[WARN] Creep ${creep.name} has no role`);
            continue;
        }

        const behavior = RoleRegistry[role];
        if (!behavior) {
            console.log(`[WARN] Unknown role: ${role}`);
            continue;
        }

        try {
            behavior.run(creep);
        } catch (err) {
            console.log(`[ERROR] Role ${role} crashed for ${creep.name}: ${err.stack || err}`);
        }
    }
}

const UnitExecutor = {
    executeSpawns,
    executeCreeps
};

module.exports = UnitExecutor;