/*
BODYPART_COST: {
        "move": 50,
        "work": 100,
        "attack": 80,
        "carry": 50,
        "heal": 250,
        "ranged_attack": 150,
        "tough": 10,
        "claim": 600
    },
*/

module.exports = function () {
    StructureSpawn.prototype.spawnHarvester =
        function (room, energy) {
            var name = "HRV-" + Game.time;
            var maxCost = 600;
            if (energy > maxCost) {
                energy = maxCost;
            }
            var body = [];
            energy -= 50; // reserve energy for the MOVE at the end
            var numberOfParts = Math.floor(energy / 150);
            for (let i = 0; i < numberOfParts; i++) {
                body.push(WORK);
            }
            for (let i = 0; i < numberOfParts; i++) {
                body.push(CARRY);
            }

            body.push(MOVE);

            return this.spawnCreep(body, name, { memory: { role: 'harvester', home: room, state: null, target: null } });
        }

    StructureSpawn.prototype.spawnExtractor =
        function (room, energy) {
            var name = "EXT-" + Game.time;
            var maxCost = 600;
            if (energy > maxCost) {
                energy = maxCost;
            }
            var body = [];
            energy -= 50; // reserve energy for the MOVE at the end
            var numberOfParts = Math.floor(energy / 150);
            for (let i = 0; i < numberOfParts; i++) {
                body.push(WORK);
            }
            for (let i = 0; i < numberOfParts; i++) {
                body.push(CARRY);
            }

            body.push(MOVE);

            return this.spawnCreep(body, name, { memory: { role: 'extractor', home: room, state: null, target: null } });
        }

    StructureSpawn.prototype.spawnHarvesterLD =
        function (home, energy, targetRoom) {
            var name = "HLD-" + Game.time;
            var maxCost = 600;
            if (energy > maxCost) {
                energy = maxCost;
            }
            var body = [WORK];
            energy -= 100;
            var numberOfParts = Math.floor(energy / 100);
            for (let i = 0; i < numberOfParts; i++) {
                body.push(CARRY);
            }
            for (let i = 0; i < numberOfParts; i++) {
                body.push(MOVE);
            }

            return this.spawnCreep(body, name, { memory: { role: 'harvester_ld', state: null, home: home, targetRoom: targetRoom } });
        }

    StructureSpawn.prototype.spawnUpgrader =
        function (home, energy) {
            var name = "UPG-" + Game.time;
            var maxCost = 600;
            if (energy > maxCost) {
                energy = maxCost;
            }
            var body = [WORK];
            energy -= 100;
            var numberOfParts = Math.floor(energy / 100);
            for (let i = 0; i < numberOfParts; i++) {
                body.push(CARRY);
            }
            for (let i = 0; i < numberOfParts; i++) {
                body.push(MOVE);
            }

            return this.spawnCreep(body, name, { memory: { role: 'upgrader', home: home, state: null, target: null } });

        }

    StructureSpawn.prototype.spawnUpgraderLD =
        function (home, energy, targetRoom) {
            var name = "ULD-" + Game.time;
            var maxCost = 600;
            if (energy > maxCost) {
                energy = maxCost;
            }
            var body = [WORK];
            energy -= 100;
            var numberOfParts = Math.floor(energy / 100);
            for (let i = 0; i < numberOfParts; i++) {
                body.push(CARRY);
            }
            for (let i = 0; i < numberOfParts; i++) {
                body.push(MOVE);
            }

            return this.spawnCreep(body, name, { memory: { role: 'upgrader_ld', home: home, state: null, target: targetRoom } });

        }

    StructureSpawn.prototype.spawnClaimer =
        function (home, energy, targetRoom, action) {
            var name = "CLA-" + Game.time;
            var body = [];

            body.push(CLAIM)

            body.push(MOVE);
            //body.push(MOVE);

            return this.spawnCreep(body, name, { memory: { role: 'claimer', home: home, state: null, targetRoom: targetRoom, action: action } });
        }

    StructureSpawn.prototype.spawnDefender =
        function (room, energy) {
            //console.log("MAKING DEFENDER with energy: " + energy);
            var name = "DEF-" + Game.time;
            var body = [];
            for (let i = 0; i < 12; i++) {
                body.push(TOUGH);
            }
            body.push(ATTACK);
            body.push(MOVE);
            body.push(MOVE);
            // cost = 300

            return this.spawnCreep(body, name, { memory: { role: "defender", room: room, state: null, target: null } });
        }

    StructureSpawn.prototype.spawnAttacker =
        function (room, energy, targetRoom) {
            //console.log("MAKING DEFENDER with energy: " + energy);
            var name = "ATK-" + Game.time;
            var body = [];
            for (let i = 0; i < 3; i++) {
                body.push(TOUGH); //20
                body.push(ATTACK); // 80
            }
            body.push(MOVE); // 50
            body.push(MOVE); // 50
            // cost = 400

            return this.spawnCreep(body, name, { memory: { role: "attacker", room: room, state: null, target: null, targetRoom: targetRoom } });
        }

    StructureSpawn.prototype.spawnRepairer =
        function (home, energy) {
            var name = "REP-" + Game.time;
            var maxCost = 600;
            if (energy > maxCost) {
                energy = maxCost;
            }
            var body = [WORK];
            energy -= 100;
            var numberOfParts = Math.floor(energy / 100);
            for (let i = 0; i < numberOfParts; i++) {
                body.push(CARRY);
            }
            for (let i = 0; i < numberOfParts; i++) {
                body.push(MOVE);
            }

            return this.spawnCreep(body, name, { memory: { role: 'repairer', home: home, state: null, target: null } });
        }

    StructureSpawn.prototype.spawnBuilderLD =
        function (home, energy, targetRoom) {
            var name = "BLD-" + Game.time;
            var maxCost = 600;
            if (energy > maxCost) {
                energy = maxCost;
            }
            var body = [WORK];
            energy -= 100;
            var numberOfParts = Math.floor(energy / 100);
            for (let i = 0; i < numberOfParts; i++) {
                body.push(CARRY);
            }
            for (let i = 0; i < numberOfParts; i++) {
                body.push(MOVE);
            }

            return this.spawnCreep(body, name, { memory: { role: 'builder_ld', state: null, home: home, targetRoom: targetRoom } });
        }

    StructureSpawn.prototype.spawnBuilder =
        function (home, energy) {
            var name = "BUI-" + Game.time;
            var maxCost = 600;
            if (energy > maxCost) {
                energy = maxCost;
            }
            var body = [WORK];
            energy -= 100;
            var numberOfParts = Math.floor(energy / 100);
            for (let i = 0; i < numberOfParts; i++) {
                body.push(CARRY);
            }
            for (let i = 0; i < numberOfParts; i++) {
                body.push(MOVE);
            }

            return this.spawnCreep(body, name, { memory: { role: 'builder', home: home, state: null, target: null } });
        }

    StructureSpawn.prototype.spawnNew =
        function (home, energy) {
            var name = "NEW-" + Game.time;
            var maxCost = 600;
            if (energy > maxCost) {
                energy = maxCost;
            }
            var body = [];
            energy -= 50; //reserve 150 energy

            body.push(MOVE);

            return this.spawnCreep(body, name, { memory: { role: 'new', state: null, home: home, targetRoom: null, action: null } });
        }
};