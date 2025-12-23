const CONSTANTS = require("config.constants");

const VERSION = 1;

function initialize() {
    Memory.version = VERSION;

    if (!Memory.colonies) Memory.colonies = {};
    if (!Memory.empire) {
        Memory.empire = {
            rooms: {},
            threats: [],
            anyHomeCrisis: false,
            anyHomeAlert: false
        };
    }

    if (!Memory.creeps) Memory.creeps = {};
    if (!Memory.intents) {
        Memory.intents = {
            spawns: {},
            structures: { towers: {}, links: {} }
        };
    }

    if (!Memory.orders) Memory.orders = {};
}

module.exports = {
    VERSION,
    initialize
};
