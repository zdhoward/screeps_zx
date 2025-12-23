/**
 * config/constants.js
 *
 * Global constants and thresholds for the bot.
 */

module.exports = {
    // Room state thresholds
    DOWNGRADE_THRESHOLD: 5000,
    TOWER_LOW_THRESHOLD: 0.20,
    TOWER_HEAL_THRESHOLD: 0.25,
    TOWER_REPAIR_THRESHOLD: 0.75,

    // Repair limits
    WALL_REPAIR_MAX: 10000,
    RAMPART_REPAIR_MAX: 10000,

    // Movement defaults
    DEFAULT_REUSE_PATH: 30,
    SOURCE_REUSE_PATH: 50,
    COMBAT_REUSE_PATH: 5,

    // Energy thresholds
    MIN_STORAGE_ENERGY: 1000,
    MIN_DROPPED_ENERGY: 50,

    // Spawn priorities
    PRIORITY_DEFENSE: 100,
    PRIORITY_ECONOMY: 50,
    PRIORITY_MAINTENANCE: 25
};