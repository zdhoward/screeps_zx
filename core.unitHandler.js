// Import creep roles
const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleHauler = require('role.hauler');
const roleBuilder = require('role.builder');
const roleRepairer = require('role.repairer');
const roleJanitor = require('role.janitor');

const unitFactory = require('lib.unitFactory');

function removeDeadCreepsFromMemory() {
    // Loop through each creep's name in Memory.creeps
    for (let creepName in Memory.creeps) {

        // If the creep's name isn't in Game.creeps
        if (!Game.creeps[creepName]) {

            // Remove it from the memory and log that it did so
            delete Memory.creeps[creepName];
            //console.log('Clearing non-existing creep memory:', creepName);
        }
    }
}

/** @param {StructureSpawn} spawner **/
function updateSpawningLabels(spawner) {
    // If the spawn is spawning a creep
    if (spawner.spawning) {

        // Get the creep being spawned
        let spawningCreep = Game.creeps[spawner.spawning.name]

        // Visualize the role of the spawning creep above the spawn
        spawner.room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            spawner.pos.x + 1,
            spawner.pos.y, { align: 'left', opacity: 0.8 });
    }
}

function processCreepsBehaviour() {
    for (let creepName in Game.creeps) {

        let creep = Game.creeps[creepName]

        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
            continue
        }

        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
            continue
        }

        if (creep.memory.role == 'hauler') {
            roleHauler.run(creep);
            continue
        }

        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
            continue
        }

        if (creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
            continue
        }

        if (creep.memory.role == 'janitor') {
            roleJanitor.run(creep);
            continue
        }
    }
}

const unitHandler = {
    cleanMemory: function () {
        removeDeadCreepsFromMemory();
    },

    /** @param {string} colony */
    spawn: function (colony) {
        let room = Game.rooms[colony];
        let spawns = room.find(FIND_MY_SPAWNS);

        for (let spawner of spawns) {
            if (spawner.spawning) continue;

            let creeps = _.filter(Game.creeps, (creep) => creep.memory.roomID == spawner.room.name);

            // Get counts for creeps of each role
            let harvesters = _.filter(creeps, (creep) => creep.memory.role == 'harvester');
            let upgraders = _.filter(creeps, (creep) => creep.memory.role == 'upgrader');
            let haulers = _.filter(creeps, (creep) => creep.memory.role == 'hauler');
            let builders = _.filter(creeps, (creep) => creep.memory.role == 'builder');
            let repairers = _.filter(creeps, (creep) => creep.memory.role == 'repairer');
            let janitors = _.filter(creeps, (creep) => creep.memory.role == 'janitor');

            // If there aren't enough harvesters
            let sources = spawner.room.find(FIND_SOURCES);
            let sourceID = null;
            if (harvesters.length < sources.length) {

                // Find a free source
                for (let i = 0; i < sources.length; i++) {
                    let source = _.filter(harvesters, (creep) => creep.memory.source == sources[i].id);
                    if (source.length == 0) {
                        sourceID = sources[i].id;
                        break;
                    }
                }

                unitFactory.spawnUnit(spawner, 'harvester', { source: sourceID });
            }

            else if (haulers.length < 2) {
                unitFactory.spawnUnit(spawner, 'hauler');
            }

            else if (upgraders.length < 4) {
                unitFactory.spawnUnit(spawner, 'upgrader', { upgrading: false });
            }

            else if (repairers.length < 0) {
                unitFactory.spawnUnit(spawner, 'repairer', { repairing: false });
            }

            else if (builders.length < 2) {
                if (spawner.room.find(FIND_CONSTRUCTION_SITES).length > 0) {
                    unitFactory.spawnUnit(spawner, 'builder', { building: false });
                }
            }

            else if (janitors.length < 1) {
                unitFactory.spawnUnit(spawner, 'janitor', { working: false });
            }

            updateSpawningLabels(spawner);
        }
    },

    run: function () {
        processCreepsBehaviour();
    }
}

module.exports = unitHandler;