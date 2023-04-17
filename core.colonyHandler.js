const unitHandler = require('core.unitHandler');
const structureHandler = require('core.structureHandler');

const { tryBuildColony } = require('lib.planning');

function updateRCL(colony) {
    let currentRCL = Game.rooms[colony].controller.level;
    if (Memory.colonies[colony].rcl != currentRCL) {
        Memory.colonies[colony].rcl = currentRCL
        //attempt to construct bunker
        tryBuildColony(colony);
    }
}

const colonyHandler = {
    tick: function () {
        unitHandler.cleanMemory();

        for (let colony in Memory.colonies) {
            switch (Memory.colonies[colony].status) {
                case "reserved":
                    break;
                case "established":
                    updateRCL(colony);
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

// if colony status == planning
//// then analyze room to anchor a bunker

// if colony status == established
//// then record current RCL and try to build bunker on every level up

module.exports = colonyHandler;