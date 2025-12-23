/**
 * kernel/planning/policies/defensePolicy.js
 *
 * Declarative defense response rules indexed by roomType and threatLevel.
 * Specifies: role + count for each threat scenario.
 */

const DefensePolicy = {
    /**
     * HOME room defense (owned colonies)
     */
    HOME: {
        1: { role: "guard", count: 1 },  // Minor threat
        2: { role: "guard", count: 2 },  // Meaningful threat
        3: { role: "guard", count: 3 }   // Critical threat
    },

    /**
     * REMOTE room defense (outposts, routes, etc.)
     */
    REMOTE: {
        1: { role: "guard", count: 1 },
        2: { role: "guard", count: 1 },
        3: { role: "guard", count: 2 }
    }
};

module.exports = DefensePolicy;