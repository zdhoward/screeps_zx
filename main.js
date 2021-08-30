var roleHarvester = require('role.harvester');
var roleHarvester_LD = require('role.harvester_ld');
var roleExtractor = require('role.extractor');
var roleUpgrader = require('role.upgrader');
var roleUpgrader_LD = require('role.upgrader_ld');
var roleBuilder = require('role.builder');
var roleBuilder_LD = require('role.builder_ld');
var roleClaimer = require('role.claimer');
var roleDefender = require('role.defender');
var roleAttacker = require('role.attacker');
var roleRepairer = require('role.repairer');
var roleRunner = require('role.runner');
var roleNew = require('role.new');
var overlord = require('core.overlord');
var flags = require('core.flags');

//function test() {
//    console.log("TESTING DIRECT CALLS");
//}

function T1_Loop() {
    // 5 seconds
    var difference = Game.time - Memory.t1_timestamp;
    if (difference >= 5) {
        Memory.t1_timestamp = Game.time;

        // CLEAN MEMORY
        cleanMemory();
    }
}
function T2_Loop() {
    // 30 seconds
    var difference = Game.time - Memory.t2_timestamp;
    if (difference >= 30) {
        Memory.t2_timestamp = Game.time;
    }

    for (var spawn in Game.spawns) {
        //colonyPlanning.run(spawn);
    }

    flags.run();
}
function T3_Loop() {
    // 600 seconds (10 mins)
    var difference = Game.time - Memory.t3_timestamp;
    if (difference >= 600) {
        Memory.t3_timestamp = Game.time;
    }
}

function drawDisplays() {
    // TODO: need to limit to currently viewed room
    for (var spawn in Game.spawns) {
        if (Game.spawns[spawn].spawning) {
            var spawningCreep = Game.creeps[Game.spawns[spawn].spawning.name];
            Game.spawns[spawn].room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                Game.spawns[spawn].pos.x + 1,
                Game.spawns[spawn].pos.y,
                { align: 'left', opacity: 0.8 });
        } else {
            Game.spawns[spawn].room.visual.text(
                '🔋' + Game.spawns[spawn].room.energyAvailable,
                Game.spawns[spawn].pos.x + 1,
                Game.spawns[spawn].pos.y,
                { align: 'left', opacity: 0.8 });
        }
    }
}

function cleanMemory() {
    //log("Testing");
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
}

module.exports.loop = function () {
    if (Game.cpu.bucket == 10000) {
        //Game.cpu.generatePixel();
    }

    if (Memory.t1_timestamp == null) {
        Memory.t1_timestamp = Game.time;
        Memory.t2_timestamp = Game.time;
        Memory.t3_timestamp = Game.time;
    }

    // add functions to console
    Game.f = require('core.console.functions');

    T1_Loop();
    T2_Loop();
    T3_Loop();

    for (var spawn in Game.spawns) {
        //overlord.run(spawn);
    }

    for (var room in Game.rooms) {
        overlord.run(room);
        //console.log(room);
    }

    // MAIN LOOP
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        switch (creep.memory.role) {
            case "harvester":
                roleHarvester.run(creep);
                break;
            case "harvester_ld":
                roleHarvester_LD.run(creep);
                break;
            case "extractor":
                roleExtractor.run(creep);
                break;
            case "upgrader":
                roleUpgrader.run(creep);
                break;
            case "upgrader_ld":
                roleUpgrader_LD.run(creep);
                break;
            case "builder":
                roleBuilder.run(creep);
                break;
            case "claimer":
                roleClaimer.run(creep);
                break;
            case "defender":
                roleDefender.run(creep);
                break;
            case "attacker":
                roleAttacker.run(creep);
                break;
            case "repairer":
                roleRepairer.run(creep);
                break;
            case "builder_ld":
                roleBuilder_LD.run(creep);
                break;
            case "runner":
                roleRunner.run(creep);
                break;
            case "new":
                roleNew.run(creep);
                break;
        }

    }

    // draw last to be the most up to date
    drawDisplays();
}