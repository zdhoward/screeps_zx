/**
 * lib/roles/registry.js
 *
 * Central registry mapping role names to behavior implementations.
 * Eliminates if-chains and makes role dispatch O(1).
 */

const Harvester = require("lib/roles/harvester");
const Hauler = require("lib/roles/hauler");
const Upgrader = require("lib/roles/upgrader");
const Builder = require("lib/roles/builder");
const Repairer = require("lib/roles/repairer");
const Janitor = require("lib/roles/janitor");
const Scout = require("lib/roles/scout");
const Guard = require("lib/roles/guard");
const MineralHauler = require("lib/roles/mineralHauler");

const RoleRegistry = {
    harvester: Harvester,
    hauler: Hauler,
    upgrader: Upgrader,
    builder: Builder,
    repairer: Repairer,
    janitor: Janitor,
    scout: Scout,
    guard: Guard,
    mineralHauler: MineralHauler
};

module.exports = RoleRegistry;