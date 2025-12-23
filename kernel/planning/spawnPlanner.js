/**
 * kernel/planning/spawnPlanner.js
 *
 * Evaluates spawn policies and generates spawn intents.
 * Priority:
 *   1. Defense (from ThreatManager + DefensePolicy)
 *   2. Economy (from RoomState + SpawnPolicy)
 */

const SpawnPolicy = require("kernel/planning/policies/spawnPolicy");
const DefensePolicy = require("kernel/planning/policies/defensePolicy");

/**
 * Count creeps by role for a given room
 */
function countCreepsByRole(room) {
    const counts = {};
    const cache = room._cache;

    if (!cache || !cache.myCreeps) return counts;

    for (const creep of cache.myCreeps) {
        if (creep.memory.homeRoom !== room.name) continue;
        const role = creep.memory.role || "unknown";
        counts[role] = (counts[role] || 0) + 1;
    }

    return counts;
}

/**
 * Generate defense spawn intents from empire threats
 */
function planDefenseSpawns(room) {
    const threats = Memory.empire.threats || [];
    const spawns = room._cache.spawns;

    if (!spawns || spawns.length === 0) return;

    for (const threat of threats) {
        const policy = DefensePolicy[threat.roomType];
        if (!policy) continue;

        const rule = policy[threat.threatLevel];
        if (!rule) continue;

        // Count existing guards assigned to this threat
        const existingGuards = room._cache.myCreeps.filter(c =>
            c.memory.role === rule.role &&
            c.memory.assignment &&
            c.memory.assignment.targetRoom === threat.roomName
        ).length;

        if (existingGuards < rule.count) {
            // Find an available spawn
            for (const spawn of spawns) {
                if (Memory.intents.spawns[spawn.id]) continue; // Already has intent

                Memory.intents.spawns[spawn.id] = {
                    role: rule.role,
                    priority: 100, // Defense has highest priority
                    options: {
                        homeRoom: room.name,
                        targetRoom: threat.roomName
                    }
                };

                return; // One spawn intent per room per tick
            }
        }
    }
}

/**
 * Generate economy spawn intents from room state
 */
function planEconomySpawns(room) {
    const state = room.memory.state || "ECONOMY";
    const rules = SpawnPolicy[state] || SpawnPolicy.ECONOMY;
    const counts = countCreepsByRole(room);
    const cache = room._cache;
    const spawns = cache.spawns;

    if (!spawns || spawns.length === 0) return;

    for (const rule of rules) {
        const want = rule.desired(room, cache);
        const have = counts[rule.role] || 0;

        if (have < want) {
            // Find an available spawn
            for (const spawn of spawns) {
                if (Memory.intents.spawns[spawn.id]) continue;

                Memory.intents.spawns[spawn.id] = {
                    role: rule.role,
                    priority: 50, // Economy priority
                    options: {
                        homeRoom: room.name
                    }
                };

                return; // One spawn intent per room per tick
            }
        }
    }
}

const SpawnPlanner = {
    /**
     * Plan spawns for a room
     * @param {Room} room
     */
    plan(room) {
        if (!room || !room._cache) return;

        // Defense first, then economy
        planDefenseSpawns(room);
        planEconomySpawns(room);
    }
};

module.exports = SpawnPlanner;