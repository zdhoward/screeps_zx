const { defend } = require('role.actions');

var roleDefender = {
    /** @param {Creep} creep **/
    run: function (creep) {
        //console.log(creep.name);
        defend(creep);
    }
}
module.exports = roleDefender;