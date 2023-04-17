const templates = require("role.templates");

const unitFactory = {
    /**
    * @param {STRUCTURE_SPAWN} spawner 
    * @param {string} role 
    * @param {Object} memory 
    */
    spawnUnit: function (spawner, role, memory = {}) {
        let name = templates[role].prefix + "-" + spawner.room.name + "-" + Game.time;
        let baseMemory = { roomID: spawner.room.name, role: role };

        let body = templates[role].bodyBase;

        for (let i = 0; i < templates[role].maxExtent; i++) {
            body = body.concat(templates[role].bodyExtent);
        }

        for (let i = 0; i < templates[role].maxExtent + 1; i++) {
            if (bodyCost(body) <= spawner.room.energyAvailable) break;
            if (i == templates[role].maxExtent) break;
            for (let j = 0; j < templates[role].bodyExtent.length; j++) {
                body.pop();
            }
        }

        spawner.spawnCreep(body, name, { memory: Object.assign({}, baseMemory, memory) });
    }
}

function bodyCost(body) {
    return body.reduce(function (cost, part) {
        return cost + BODYPART_COST[part];
    }, 0);
}

module.exports = unitFactory;