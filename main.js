// External packages
const Traveler = require("ext.Traveler");

// Core modules
global.cmd = require("core.commands");
const colonyHandler = require("core.colonyHandler");

function initialize() {
    if (!Memory._initialized) {
        console.log("Initializing");
        Memory.colonies = {};

        for (let spawn in Game.spawns) {
            let roomID = Game.spawns[spawn].room.name;

            let bunkerAnchor = { x: Game.spawns[spawn].pos.x + 2, y: Game.spawns[spawn].pos.y }

            Memory.colonies[roomID] = { status: 'established', bunkerAnchor: bunkerAnchor };
        }

        Memory._initialized = true;
    }
}

module.exports.loop = function () {
    initialize();

    colonyHandler.tick();
}