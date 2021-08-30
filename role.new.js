const { moveToRoom } = require('role.actions');

var roleNew = {
    /** @param {Creep} creep **/
    run: function (creep) {
        creep.say("NEW");

        //console.log("SEEKING FLAG");
        var flag = Game.flags['W2N6'];
        //console.log("Seeking Flag: " + flag);
        //creep.moveTo(flag.pos);
    }
}

module.exports = roleNew;