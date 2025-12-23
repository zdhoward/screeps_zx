/**
 * main.js - ZXBot vNext Orchestrator
 *
 * Tick flow:
 * 1. Cleanup (dead creeps, stale data)
 * 2. Perception (cache + state + threats)
 * 3. Planning (generate intents)
 * 4. Execution (fulfill intents)
 * 5. Telemetry (stats, visuals)
 */

const profiler = require("ext.profiler");

// Config & Schema
const SCHEMA = require("config.schema");

// Cleanup
const MemoryCleanup = require("lib.utils.memoryCleanup");

// Perception
const RoomCache = require("kernel.perception.roomCache");
const RoomState = require("kernel.perception.roomState");
const ThreatScan = require("kernel.perception.threatScan");

// Planning
const SpawnPlanner = require("kernel.planning.spawnPlanner");
const StructurePlanner = require("kernel.planning.structurePlanner");
const Planning = require("lib.planning");

// Execution
const UnitExecutor = require("kernel.execution.unitExecutor");
const StructureExecutor = require("kernel.execution.structureExecutor");


/**
 * Initialize Memory schema if needed
 */
function bootstrap() {
    if (!Memory.version || Memory.version < SCHEMA.VERSION) {
        console.log(`[BOOTSTRAP] Initializing schema v${SCHEMA.VERSION}`);
        SCHEMA.initialize();
    }
}

/**
 * Update colony planning when RCL changes
 */
function updateColonyPlanning(room) {
    const colonyName = room.name;
    const colony = Memory.colonies[colonyName];

    if (!colony || !room.controller) return;

    const currentRCL = room.controller.level;
    if (colony.rcl !== currentRCL) {
        console.log(`[PLANNING] ${colonyName} RCL changed: ${colony.rcl} → ${currentRCL}`);
        colony.rcl = currentRCL;
        Planning.tryBuildColony(colonyName);
    }

    // Update controller container state
    Planning.tryUpdateControllerContainer(colonyName);
}

if (typeof Memory === "object" && !Memory.__zx_init) {
    Memory.__zx_init = {
        created: Game.time || 0
    };
}

/**
 * Main game loop
 */
module.exports.loop = function() {
    profiler.wrap(function() {
        // ===== PHASE 0: Bootstrap =====
        bootstrap();

        // ===== PHASE 1: Cleanup =====
        MemoryCleanup.run();

        // ===== PHASE 2: Perception =====
        // Build cache for all visible rooms
        for (const roomName in Game.rooms) {
            const room = Game.rooms[roomName];
            RoomCache.build(room);
            RoomState.classify(room);
        }

        // Empire-wide threat scan
        const threatReport = ThreatScan.run();
        Memory.empire.threats = threatReport.threats;
        Memory.empire.anyHomeCrisis = threatReport.anyHomeCrisis;
        Memory.empire.anyHomeAlert = threatReport.anyHomeAlert;

        // ===== PHASE 3: Planning =====
        // Clear old intents
        Memory.intents = { spawns: {}, structures: { towers: {}, links: {} } };

        // Generate new intents
        for (const colonyName in Memory.colonies) {
            const room = Game.rooms[colonyName];
            if (!room) continue;

            // Update colony planning (RCL changes trigger construction)
            updateColonyPlanning(room);

            SpawnPlanner.plan(room);
            StructurePlanner.plan(room);
        }

        // ===== PHASE 4: Execution =====
        // Execute spawns and structures for each colony
        for (const colonyName in Memory.colonies) {
            const room = Game.rooms[colonyName];
            if (!room) continue;

            UnitExecutor.executeSpawns(room);
            StructureExecutor.run(room);
        }

        // Execute all creep behaviors
        UnitExecutor.executeCreeps();

        // ===== PHASE 5: Telemetry (optional) =====
        // TODO: Add stats collection, visual overlays
    });
};

// Global console commands
global.cmd = {
    test: () => console.log("ZXBot vNext running"),
    debug: () => {
        console.log("Empire State:", JSON.stringify(Memory.empire, null, 2));
    }
};