var spawning = require('core.spawning');

function cleanMemory(spawn) {
    // check queues and remove workers that do not exist
    for (var source in Game.spawns[spawn].room.memory.sources) {
        //console.log(spawn + ": " + Game.spawns[spawn].room.memory.sources);
        if (Game.spawns[spawn].room.memory.sources[source].queue.length > 0) {
            for (var name in Game.spawns[spawn].room.memory.sources[source].queue) {
                //console.log("NAME: " + Game.spawns[spawn].room.memory.sources[source].queue[name]);
                //console.log("CLEAN MEM: " + Game.creeps[Game.spawns[spawn].room.memory.sources[source].queue[name]] + " is in queue for a source");
                if (!Game.creeps[Game.spawns[spawn].room.memory.sources[source].queue[name]]) {
                    //console.log("REMOVING CREEP FROM QUEUE: " + Game.spawns[spawn].room.memory.sources[source].queue[name]);
                    //delete Game.spawns[spawn].sources[source].queue[name]
                }
            }
        }
    }
}

function defendRoom(room) {
    //console.log(Game.rooms[room]);
    var hostiles = Game.rooms[room].find(FIND_HOSTILE_CREEPS);
    if (hostiles.length > 0) {
        var username = hostiles[0].owner.username;
        console.log(`User ${username} spotted in room ${room}`);
        var towers = Game.rooms[room].find(
            FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
        towers.forEach(tower => tower.attack(hostiles[0]));
    }
}

function T1_Loop(spawn) {
    // 5 seconds
    if (Game.spawns[spawn].room.memory.t1_timestamp != Memory.t1_timestamp) {
        cleanMemory(spawn);

        //handle spawning
        if (!Game.spawns[spawn].spawning) {
            spawning.run(spawn);
        }

        // clean harvesting queues


        // CHECK FOR INVADERS
        //var hostiles = Game.spawns[spawn].room.find(FIND_HOSTILE_CREEPS);
        //if (hostiles.length > 0) {
        //    if (!Game.spawns[spawn].spawning) {
        //        console.log("LAUNCHING DEFENDERS");
        //        Game.spawns[spawn].spawnDefender(Game.spawns[spawn].room.name, Game.spawns[spawn].room.energyAvailable);
        //    }
        //}

        // COORDINATE REPAIRS

        // LINKS
        balanceLinks(spawn);

        Game.spawns[spawn].room.memory.t1_timestamp = Memory.t1_timestamp;
    }
}

function T2_Loop(spawn) {
    // 30 seconds
    if (Game.spawns[spawn].room.memory.t2_timestamp != Memory.t2_timestamp) {
        Game.spawns[spawn].room.memory.t2_timestamp = Memory.t2_timestamp;
    }
}

function T3_Loop(spawn) {
    // 600 seconds (10 mins)
    if (Game.spawns[spawn].room.memory.t3_timestamp != Memory.t3_timestamp) {
        Game.spawns[spawn].room.memory.t3_timestamp = Memory.t3_timestamp;
    }
}

function balanceLinks(spawn) {
    var links = _.filter(Game.spawns[spawn].room.find(FIND_STRUCTURES), (structure) => structure.structureType == STRUCTURE_LINK);
    if (links.length > 1) {
        links.sort(function (a, b) {
            if (a.store[RESOURCE_ENERGY] > b.store[RESOURCE_ENERGY]) {
                a.transferEnergy(b, (a.store[RESOURCE_ENERGY] - b.store[RESOURCE_ENERGY]) / 2);
            } else if (a.store[RESOURCE_ENERGY] < b.store[RESOURCE_ENERGY]) {
                b.transferEnergy(a, (b.store[RESOURCE_ENERGY] - a.store[RESOURCE_ENERGY]) / 2);
            }
            return;
        });
    }
}

function runOnce(room) {
    // INITIALIZERS
    //console.log(room);
    if (!Game.rooms[room].memory.t1_timestamp) {
        Game.rooms[room].memory.t1_timestamp = Memory.t1_timestamp;
        Game.rooms[room].memory.t2_timestamp = Memory.t2_timestamp;
        Game.rooms[room].memory.t3_timestamp = Memory.t3_timestamp;
    }

    if (!Game.rooms[room].memory.maxWallHits) {
        //console.log("SETTING MAXWALLHITS");
        Game.rooms[room].memory.maxWallHits = 2000;
    }

    if (!Game.rooms[room].memory.sources) {
        Game.rooms[room].memory.sources = [];
        var sources = Game.rooms[room].find(FIND_SOURCES);
        for (var source in sources) {
            //calculate how many free tiles per source

            var terrain = Game.rooms[room].getTerrain();
            var harvestableTiles = 0;

            for (let x = 0; x < 3; x++) {
                for (let y = 0; y < 3; y++) {
                    if (!((x - 1) == 0 && (y - 1) == 0)) {
                        if (terrain.get(x - 1 + sources[source].pos.x, y - 1 + sources[source].pos.y) != 1) {
                            harvestableTiles++;
                        }
                    }
                }
            }
            var data = { id: sources[source].id, maxQueue: harvestableTiles, queue: [] };
            Game.rooms[room].memory.sources.push(data);
        }

        // SET THIS UP AS A FUNCTION, REUSED IN ACTIONS
        if (!Game.rooms[room].memory.maxSourceSlots && Game.rooms[room].memory.sources.length > 0) {
            var maxSourceSlots = 0;
            for (var source in Game.rooms[room].memory.sources) {
                maxSourceSlots += Game.rooms[room].memory.sources[source].maxQueue;
            }
            Game.rooms[room].memory.maxSourceSlots = maxSourceSlots;
        }
    }

    //console.log("RUN ONCE");
    if (!Game.rooms[room].memory.spawnQueue) {
        //console.log("SETTING SPAWN QUEUE MEMORY");
        Game.rooms[room].memory.spawnQueue = [];
    }
}

function clearQueues(room) {
    //Game.rooms[room].memory.sources = null;
    var sources = Game.rooms[room].memory.sources;
    if (sources.length > 0) {
        for (var source in sources) {
            for (var unit in sources[source].queue) {
                if (!Game.creeps[sources[source].queue[unit]]) {
                    //console.log("Removing " + unit);
                    Game.rooms[room].memory.sources[source].queue.splice(unit, unit + 1);
                }
            }
        }
    }
}

var overlord = {
    /** @param {String} room **/
    run: function (room) {
        //console.log(room);
        if (Game.rooms[room]) {
            //console.log(room);

            //console.log("R O");
            runOnce(room);

            var spawns = Game.rooms[room].find(FIND_MY_SPAWNS);
            for (var spawn in spawns) {

                T1_Loop(spawns[spawn].name);
                T2_Loop(spawns[spawn].name);
                T3_Loop(spawns[spawn].name);
            }

            clearQueues(room);

            defendRoom(room);
        }
    }
};

module.exports = overlord;