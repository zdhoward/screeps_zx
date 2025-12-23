/**
 * lib/unitFactory.js
 *
 * Spawns creeps with role-specific body templates.
 * Scales body parts based on available energy.
 */

const BODY_TEMPLATES = {
    harvester: {
        prefix: "HRV",
        base: [WORK, WORK, MOVE],
        extent: [WORK],
        maxExtent: 3
    },
    hauler: {
        prefix: "HAL",
        base: [CARRY, MOVE, CARRY, MOVE],
        extent: [CARRY, MOVE],
        maxExtent: 3
    },
    upgrader: {
        prefix: "UPG",
        base: [WORK, CARRY, MOVE],
        extent: [WORK, CARRY, MOVE],
        maxExtent: 3
    },
    builder: {
        prefix: "BLD",
        base: [WORK, CARRY, MOVE],
        extent: [WORK, CARRY, MOVE],
        maxExtent: 2
    },
    repairer: {
        prefix: "REP",
        base: [WORK, CARRY, MOVE],
        extent: [WORK, CARRY, MOVE],
        maxExtent: 2
    },
    janitor: {
        prefix: "JAN",
        base: [CARRY, MOVE, CARRY, MOVE],
        extent: [CARRY, MOVE],
        maxExtent: 2
    },
    scout: {
        prefix: "SCO",
        base: [MOVE, MOVE],
        extent: [MOVE],
        maxExtent: 1
    },
    guard: {
        prefix: "GRD",
        base: [TOUGH, MOVE, ATTACK, MOVE],
        extent: [TOUGH, MOVE, ATTACK, MOVE],
        maxExtent: 3
    },
    mineralHauler: {
        prefix: "MIN",
        base: [CARRY, MOVE, CARRY, MOVE],
        extent: [CARRY, MOVE],
        maxExtent: 2
    }
};

function bodyCost(parts) {
    return parts.reduce((sum, part) => sum + BODYPART_COST[part], 0);
}

function buildBody(role, energyAvailable) {
    const template = BODY_TEMPLATES[role];
    if (!template) return null;

    let body = [...template.base];
    let cost = bodyCost(body);

    // Add extents while we have energy
    let extentsAdded = 0;
    while (extentsAdded < template.maxExtent) {
        const nextCost = cost + bodyCost(template.extent);
        if (nextCost > energyAvailable) break;

        body = body.concat(template.extent);
        cost = nextCost;
        extentsAdded++;
    }

    // Final validation
    if (cost > energyAvailable) return null;

    return body;
}

const UnitFactory = {
    /**
     * Spawn a creep
     * @param {StructureSpawn} spawn
     * @param {string} role
     * @param {object} options - { homeRoom, targetRoom, sourceId, ... }
     * @returns {number} spawn result code
     */
    spawn(spawn, role, options = {}) {
        const template = BODY_TEMPLATES[role];
        if (!template) {
            console.log(`[FACTORY] Unknown role: ${role}`);
            return ERR_INVALID_ARGS;
        }

        const energyAvailable = spawn.room.energyAvailable;
        const body = buildBody(role, energyAvailable);

        if (!body) {
            console.log(`[FACTORY] Cannot afford ${role} (need ${bodyCost(template.base)}, have ${energyAvailable})`);
            return ERR_NOT_ENOUGH_ENERGY;
        }

        const name = `${template.prefix}-${spawn.room.name}-${Game.time}`;

        const memory = {
            role,
            homeRoom: options.homeRoom || spawn.room.name,
            assignment: {}
        };

        // Add assignment fields
        if (options.targetRoom) {
            memory.assignment.targetRoom = options.targetRoom;
        }
        if (options.sourceId) {
            memory.assignment.sourceId = options.sourceId;
        }

        const result = spawn.spawnCreep(body, name, { memory });

        if (result === OK) {
            console.log(`[FACTORY] Spawning ${name} with ${body.length} parts`);
        }

        return result;
    }
};

module.exports = UnitFactory;