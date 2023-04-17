const profiler = require("ext.profiler");

const unitHandler = require('core.unitHandler');
const structureHandler = require('core.structureHandler');

const { tryBuildColony } = require('lib.planning');

function updateColonyMemory(colony) {
    let currentRCL = Game.rooms[colony].controller.level;
    if (Memory.colonies[colony].rcl != currentRCL) {
        Memory.colonies[colony].rcl = currentRCL
        //attempt to construct bunker
        tryBuildColony(colony);
    }

    // checking containerController, build container if possible, otherwise, build link if possible
    if (Memory.colonies[colony].controllerContainer != null) {
        if (Memory.colonies[colony].controllerContainer.state == "constructing") {
            let posInfo = Game.rooms[colony].lookForAt(LOOK_STRUCTURES, Memory.colonies[colony].controllerContainer.x, Memory.colonies[colony].controllerContainer.y);
            if (posInfo.length > 0) {
                if (posInfo[0].structureType == STRUCTURE_CONTAINER) {
                    Memory.colonies[colony].controllerContainer.state = STRUCTURE_CONTAINER;
                    Memory.colonies[colony].controllerContainer.id = posInfo[0].id;
                } else if (posInfo[0].structureType == STRUCTURE_LINK) {
                    Memory.colonies[colony].controllerContainer.state = STRUCTURE_LINK;
                    Memory.colonies[colony].controllerContainer.id = posInfo[0].id;
                }
            }
        } else if (Memory.colonies[colony].controllerContainer.state == "container" && currentRCL >= 5) {
            let structure = Game.getObjectById(Memory.colonies[colony].controllerContainer.id);
            structure.destroy();
            Memory.colonies[colony].controllerContainer.state = "ruin";
        } else if (Memory.colonies[colony].controllerContainer.state == "ruin") {
            if (Game.rooms[colony].createConstructionSite(Memory.colonies[colony].controllerContainer.x, Memory.colonies[colony].controllerContainer.y, STRUCTURE_LINK) == OK) {
                Memory.colonies[colony].controllerContainer.state = "constructing";
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

profiler.registerObject(colonyHandler, 'colonyHandler');

module.exports = colonyHandler;