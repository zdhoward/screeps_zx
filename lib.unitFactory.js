/**
 * lib.unitFactory.js
 *
 * Spawns creeps using role templates and writes correct creep.memory.
 * This is the only place creeps should ever be created.
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

    let body = template.base.slice();
    let cost = bodyCost(body);

    let extents = 0;
    while (extents < template.maxExtent) {
        const extCost = bodyCost(template.extent);
        if (cost + extCost > energyAvailable) break;

        body = body.concat(template.extent);
        cost += extCost;
        extents++;
    }

    return body;
}

const UnitFactory = {

    /**
     * Spawn a creep with full role memory
     */
    spawn(spawn, role, options = {}) {
        const template = BODY_TEMPLATES[role];
        if (!template) {
            console.log(`[FACTORY] Unknown role '${role}'`);
            return ERR_INVALID_ARGS;
        }

        if (spawn.spawning) return ERR_BUSY;

        const energy = spawn.room.energyAvailable;
        const body = buildBody(role, energy);

        if (!body || body.length === 0) {
            const minCost = bodyCost(template.base);
            console.log(`[FACTORY] Cannot afford ${role} (need ${minCost}, have ${energy})`);
            return ERR_NOT_ENOUGH_ENERGY;
        }

        const name = `${template.prefix}_${spawn.room.name}_${Game.time}`;

        const memory = {
            role,
            homeRoom: options.homeRoom || spawn.room.name,
            assignment: {
                sourceId: options.sourceId || null,
                targetRoom: options.targetRoom || null
            }
        };

        const result = spawn.spawnCreep(body, name, { memory });

        if (result === OK) {
            console.log(`[FACTORY] Spawning ${name} as ${role} (${body.length} parts)`);
        }

        return result;
    }
};

module.exports = UnitFactory;
