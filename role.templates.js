const templates = {
    "harvester": { prefix: "HRV", bodyBase: [WORK, WORK, MOVE], bodyExtent: [WORK], maxExtent: 3 },
    "hauler": { prefix: "HAL", bodyBase: [CARRY, MOVE, CARRY, MOVE], bodyExtent: [CARRY, MOVE], maxExtent: 1 },
    "upgrader": { prefix: "UPG", bodyBase: [WORK, MOVE, CARRY, MOVE], bodyExtent: [WORK, CARRY], maxExtent: 1 },
    "builder": { prefix: "BLD", bodyBase: [WORK, MOVE, CARRY, MOVE], bodyExtent: [WORK, CARRY], maxExtent: 1 },
    "repairer": { prefix: "REP", bodyBase: [WORK, MOVE, CARRY, MOVE], bodyExtent: [WORK, CARRY], maxExtent: 1 },
    "janitor": { prefix: "JAN", bodyBase: [WORK, MOVE, CARRY, MOVE], bodyExtent: [WORK, CARRY], maxExtent: 1 },
    "scout": { prefix: "SCO", bodyBase: [MOVE, MOVE, TOUGH], bodyExtent: [MOVE, TOUGH], maxExtent: 1 },
}

module.exports = templates;