const unitHandler = require('core.unitHandler');
const structureHandler = require('core.structureHandler');

const { tryBuildColony } = require('lib.planning');

// rename to something like updateMemory
// if Memory.colonies[colony].controllerContainer.state == "constructing";
// then check to see if container exists at Memory.colonies[colony].controllerContainer.x, Memory.colonies[colony].controllerContainer.y
function updateColonyMemory(colony) {
    let currentRCL = Game.rooms[colony].controller.level;
    if (Memory.colonies[colony].rcl != currentRCL) {
        Memory.colonies[colony].rcl = currentRCL
        //attempt to construct bunker
        tryBuildColony(colony);
    }

    if (Memory.colonies[colony].controllerContainer != null) {
        if (Memory.colonies[colony].controllerContainer.state == "constructing") {
            let posInfo = Game.rooms[colony].lookForAt(LOOK_STRUCTURES, Memory.colonies[colony].controllerContainer.x, Memory.colonies[colony].controllerContainer.y);
            if (posInfo.length > 0) {
                if (posInfo[0].structureType == STRUCTURE_CONTAINER) {
                    console.log(JSON.stringify(posInfo[0].structureType));
                    Memory.colonies[colony].controllerContainer.state = "container";
                    Memory.colonies[colony].controllerContainer.id = posInfo[0].id;
                }
            }
        }
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

module.exports = colonyHandler;