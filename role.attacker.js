const { moveToRoom, attack } = require('role.actions');

var roleAttacker = {
    /** @param {Creep} creep **/
    run: function (creep) {
        //console.log(creep.name);
        if (creep.room.name != creep.memory.targetRoom) {
            moveToRoom(creep, creep.memory.targetRoom);
        } else {
            attack(creep);
        }
    }
}
module.exports = roleAttacker;