const profiler = require("ext.profiler");

const unitHandler = require('core.unitHandler');
const structureHandler = require('core.structureHandler');

const { tryBuildColony, tryUpdateControllerContainer } = require('lib.planning');

function updateColonyMemory(colony) {
    let currentRCL = Game.rooms[colony].controller.level;
    if (Memory.colonies[colony].rcl != currentRCL) {
        Memory.colonies[colony].rcl = currentRCL
        //attempt to construct bunker
        tryBuildColony(colony);
    }

    tryUpdateControllerContainer(colony);
}

const colonyHandler = {
    tick: function () {
        unitHandler.cleanMemory();

        for (let colony in Memory.colonies) {
            switch (Memory.colonies[colony].status) {
                case "reserved":
                    break;
                case "established":
                    updateColonyMemory(colony);
                    //console.log("Colony: " + colony);
                    unitHandler.spawn(colony);
                    structureHandler.run(colony);
                    break;
                default:
                    Memory.colonies[colony].status = "reserved";
                    break;
            }
        }

        unitHandler.run();
    }
}

profiler.registerObject(colonyHandler, 'colonyHandler');

module.exports = colonyHandler;