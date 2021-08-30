function addToSpawnQueue(spawn, role, targetRoom = null, action = null) {
    Game.spawns[spawn].room.memory.spawnQueue.push({ role: role, targetRoom: targetRoom, action: action });
}
function getClosestRoom(flag, energy = 0) {
    var closest = null;
    var closestDistance = 9999999;
    for (var spawn in Game.spawns) {
        var route = Game.map.findRoute(Game.spawns[spawn].room, Game.flags[flag].pos.roomName);
        if (route.length < closestDistance && Game.spawns[spawn].room.energyCapacityAvailable >= energy) {
            closestDistance = route.length;
            closest = Game.spawns[spawn].room.name;
        }
    }
    //console.log("CLOSEST ROOM: " + closest + " " + closestDistance);
    return closest;
}

function getClosestSpawn(flag) {
    var room = getClosestRoom(flag);
    var spawn = null;
    for (var s in Game.spawns) {
        if (Game.spawns[s].room.name == room) {
            spawn = Game.spawns[s].name;
        }
    }
    return spawn;
}

module.exports = {
    run: function (spawn) {

    },

    spawn: function () {
        //check flags, act accordingly
        for (var flag in Game.flags) {
            var spawn = getClosestSpawn(flag);
            //console.log("ROOM: " + room + ", SPAWNS: " + spawns + ", SPAWN: " + spawn);
            // if room has visibility
            switch (Game.flags[flag].color) {
                // grey on grey flags = reserve
                case COLOR_GREY:
                    //console.log("GREY FLAG FOUND AT: " + flag + " - " + Game.flags[flag].pos.roomName + " - " + Game.flags[flag].pos.x + "," + Game.flags[flag].pos.y);
                    var reserveAmount = null;
                    if (Game.spawns[spawn].controller) {
                        reserveAmount = Game.rooms[Game.flags[flag].room.name].controller.reservation.ticksToEnd;
                    } else {
                        break;
                    }
                    if (reserveAmount == null || reserveAmount < 1000) {
                        var claimers = _.filter(Game.creeps, (creep) => creep.memory.role == 'claimer' && creep.memory.room == Game.spawns[spawn].room.name).length + _.filter(Game.spawns[spawn].room.memory.spawnQueue, (entry) => entry.role == "claimer").length;
                        var energy = Game.spawns[spawn].room.energyAvailable;
                        if (energy >= 650 && claimers < 1) {
                            //console.log("Launching Claimers to reserve: " + Game.flags[flag].room.name);
                            addToSpawnQueue(spawn, "claimer", Game.flags[flag].pos.roomName, "reserve");
                        }
                    }
                    break;

                // purple on purple flags = claim
                case COLOR_PURPLE:
                    var claimers = _.filter(Game.creeps, (creep) => creep.memory.role == 'claimer' && creep.memory.home == Game.spawns[spawn].room.name).length + _.filter(Game.spawns[spawn].room.memory.spawnQueue, (entry) => entry.role == "claimer").length;
                    var energy = Game.spawns[spawn].room.energyAvailable;

                    claimers = _.filter(Game.creeps, (creep) => creep.memory.role == 'claimer' && creep.memory.home == Game.spawns[spawn].room.name).length + _.filter(Game.spawns[spawn].room.memory.spawnQueue, (entry) => entry.role == "claimer").length;
                    if (claimers < 1) {
                        //console.log("Launching Claimers to claim: " + Game.flags[flag].pos.roomName + " from " + Game.spawns[spawn].room.name);
                        addToSpawnQueue(spawn, "claimer", Game.flags[flag].pos.roomName, "claim");
                    }

                    var builder_lds = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder_ld' && creep.memory.home == Game.spawns[spawn].room.name).length + _.filter(Game.spawns[spawn].room.memory.spawnQueue, (entry) => entry.role == "builder_ld").length;
                    var energy = Game.spawns[spawn].room.energyAvailable;
                    if (builder_lds < 3) {
                        addToSpawnQueue(spawn, "builder_ld", Game.flags[flag].pos.roomName);
                    }

                    var upgrader_lds = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader_ld' && creep.memory.home == Game.spawns[spawn].room.name).length + _.filter(Game.spawns[spawn].room.memory.spawnQueue, (entry) => entry.role == "upgrader_ld").length;
                    var energy = Game.spawns[spawn].room.energyAvailable;
                    if (upgrader_lds < 2) {
                        addToSpawnQueue(spawn, "upgrader_ld", Game.flags[flag].pos.roomName);
                    }

                    // place the spawn site at the purple flag
                    try {
                        Game.flags[flag].room.createConstructionSite(Game.flags[flag].pos, STRUCTURE_SPAWN);

                        var spawns = _.filter(Game.spawns, (spawn) => spawn.room.name == Game.flags[flag].room.name).length
                        if (spawns > 0) {
                            Game.flags[flag].remove();
                        }
                    } catch (error) {
                        console.log("core.flags:78: caused by room being null (ie. no sight) " + error);
                    }


                    break;

                // red on red flags = attack
                case COLOR_RED:
                    break;

                // remote building
                case COLOR_BLUE:
                    var builder_lds = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder_ld' && creep.memory.home == Game.spawns[spawn].room.name).length + _.filter(Game.spawns[spawn].room.memory.spawnQueue, (entry) => entry.role == "builder_ld").length;
                    var energy = Game.spawns[spawn].room.energyAvailable;
                    if (builder_lds < 4) {
                        addToSpawnQueue(spawn, "builder_ld", Game.flags[flag].pos.roomName);
                    }

                    // CHECK IF NO CONSTRUCTION SITES
                    // REMOVE FLAG
                    break;

                // orange + sub = a building to build once available
                case COLOR_ORANGE:
                    switch (Game.flags[flag].secondaryColor) {
                        case COLOR_ORANGE:
                            if (Game.flags[flag].room) {
                                if (Game.flags[flag].room.createConstructionSite(Game.flags[flag].pos, STRUCTURE_EXTENSION) == OK) {
                                    Game.flags[flag].remove();
                                };
                            }

                            break;
                        case COLOR_PURPLE:
                            if (Game.flags[flag].room) {
                                if (Game.flags[flag].room.createConstructionSite(Game.flags[flag].pos, STRUCTURE_SPAWN) == OK) {
                                    Game.flags[flag].remove();
                                };
                            }
                            break;
                        case COLOR_RED:
                            if (Game.flags[flag].room) {
                                if (Game.flags[flag].room.createConstructionSite(Game.flags[flag].pos, STRUCTURE_TOWER) == OK) {
                                    Game.flags[flag].remove();
                                };
                            }
                            break;
                        case COLOR_YELLOW:
                            if (Game.flags[flag].room) {
                                if (Game.flags[flag].room.createConstructionSite(Game.flags[flag].pos, STRUCTURE_LINK) == OK) {
                                    Game.flags[flag].remove();
                                };
                            }
                            break;

                        case COLOR_BROWN:
                            if (Game.flags[flag].room) {
                                if (Game.flags[flag].room.createConstructionSite(Game.flags[flag].pos, STRUCTURE_CONTAINER) == OK) {
                                    Game.flags[flag].remove();
                                };
                            }
                            break;
                        case COLOR_WHITE:
                            if (Game.flags[flag].room) {
                                if (Game.flags[flag].room.createConstructionSite(Game.flags[flag].pos, STRUCTURE_STORAGE) == OK) {
                                    Game.flags[flag].remove();
                                };
                            }
                    }
                    break;

                case COLOR_YELLOW:
                    // long distance harvesting, 1 flag per harvester
                    //console.log(spawn);
                    var harvester_lds = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester_ld' && creep.memory.home == Game.spawns[spawn].room.name && creep.memory.targetRoom == Game.flags[flag].pos.roomName).length + _.filter(Game.spawns[spawn].room.memory.spawnQueue, (entry) => entry.role == "harvester_ld").length;
                    var energy = Game.spawns[spawn].room.energyAvailable;
                    if (harvester_lds < 2) {
                        addToSpawnQueue(spawn, "harvester_ld", Game.flags[flag].pos.roomName);
                    }
                    break;
            }
        }
    }
}
/*
COLOR_RED
COLOR_PURPLE
COLOR_BLUE
COLOR_CYAN
COLOR_GREEN
COLOR_YELLOW
COLOR_ORANGE
COLOR_BROWN
COLOR_GREY
COLOR_WHITE
*/