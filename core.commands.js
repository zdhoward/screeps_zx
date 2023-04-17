const { tryBuildColony } = require("lib.planning");
const templates = require("role.templates");

function test() {
    console.log("TESTING DIRECT CONSOLE INPUT");
}

function debug() {
    console.log("Debug");

    let roomID = "W8N3";
    let room = Game.rooms[roomID];

    //console.log("Room Energy: " + room.energyAvailable);

    // var pos = getBestBunkerPosition(roomID);

    // room.visual.rect(pos.x, pos.y, 12, 12);

    //tryBuildColony(roomID);

    //tryConstructContainerNearController(roomID);


    //console.log("NULL");

}

module.exports = {
    test, debug,
};