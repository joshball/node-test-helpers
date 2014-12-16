'use strict';

// Load modules
var TH = require('./../lib/index')(module);

// Declare internals
console.log('TH.UTILS', TH.UTILS);

TH.CMD.register.Data({my:'data','num':4});
exports.lab = TH.CMD.register.Lab();


console.log('TH.STUBS', TH.STUBS);
console.log('TH.DATA', TH.DATA);
TH.STUBS.createStubLogger();

