/**
 * kernel/planning/policies/spawnPolicy.js
 *
 * Declarative spawn composition rules indexed by room state.
 * Each rule specifies: role + desired count function.
 *
 * The planner evaluates these rules to generate spawn intents.
 */

const SpawnPolicy = {
    /**
     * ECONOMY: Normal growth mode
     */
    ECONOMY: [
        {
            role: "harvester",
            desired: (room, cache) => {
                return cache.sources.length * 1;
            }
        },
        {
            role: "hauler",
            desired: (room, cache) => {
                return cache.sources.length * 1;
            }
        },
        {
            role: "upgrader",
            desired: (room, cache) => {
                if (!room.controller) return 0;
                return Math.min(3, room.controller.level);
            }
        },
        {
            role: "builder",
            desired: (room, cache) => {
                return cache.constructionSites.length > 0 ? 2 : 0;
            }
        },
        {
            role: "repairer",
            desired: (room, cache) => {
                const damaged = cache.myStructures.filter(s =>
                    s.hits && s.hits < s.hitsMax &&
                    s.structureType !== STRUCTURE_WALL &&
                    s.structureType !== STRUCTURE_RAMPART
                );
                return damaged.length > 5 ? 2 : damaged.length > 0 ? 1 : 0;
            }
        },
        {
            role: "janitor",
            desired: (room, cache) => {
                // Feed towers if they exist
                return cache.towers.length > 0 ? 1 : 0;
            }
        },
        {
            role: "scout",
            desired: (room, cache) => {
                return 0; // TODO: Enable when scouting logic is ready
            }
        }
    ],

    /**
     * ALERT: Hostiles present, maintain stability
     */
    ALERT: [
        {
            role: "harvester",
            desired: (room, cache) => cache.sources.length * 1
        },
        {
            role: "hauler",
            desired: (room, cache) => cache.sources.length * 1
        },
        {
            role: "upgrader",
            desired: (room, cache) => 1 // Reduced from 3
        },
        {
            role: "builder",
            desired: (room, cache) => 0 // Pause building
        },
        {
            role: "repairer",
            desired: (room, cache) => 1 // Keep one repairer
        },
        {
            role: "janitor",
            desired: (room, cache) => cache.towers.length > 0 ? 2 : 0 // Boost tower feeding
        }
    ],

    /**
     * CRISIS: Survival mode (HOME rooms only)
     */
    CRISIS: [
        {
            role: "harvester",
            desired: (room, cache) => cache.sources.length * 1
        },
        {
            role: "hauler",
            desired: (room, cache) => cache.sources.length * 1
        },
        {
            role: "upgrader",
            desired: (room, cache) => 0 // Stop upgrading
        },
        {
            role: "builder",
            desired: (room, cache) => 0
        },
        {
            role: "repairer",
            desired: (room, cache) => 2 // Emergency repairs
        },
        {
            role: "janitor",
            desired: (room, cache) => cache.towers.length > 0 ? 3 : 0 // Max tower feeding
        }
    ],

    /**
     * RECOVERY: Rebuilding after threat cleared
     */
    RECOVERY: [
        {
            role: "harvester",
            desired: (room, cache) => cache.sources.length * 1
        },
        {
            role: "hauler",
            desired: (room, cache) => cache.sources.length * 1
        },
        {
            role: "upgrader",
            desired: (room, cache) => 1
        },
        {
            role: "builder",
            desired: (room, cache) => cache.constructionSites.length > 0 ? 2 : 0
        },
        {
            role: "repairer",
            desired: (room, cache) => 3 // Focus on repairs
        },
        {
            role: "janitor",
            desired: (room, cache) => cache.towers.length > 0 ? 1 : 0
        }
    ]
};

module.exports = SpawnPolicy;