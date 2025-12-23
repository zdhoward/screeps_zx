// ext.bootstrap.js
const Traveler = require("ext.Traveler");

if (!global.__travelerInstalled) {
    Traveler.install();
    global.__travelerInstalled = true;
    console.log("[BOOT] Traveler installed");
}
