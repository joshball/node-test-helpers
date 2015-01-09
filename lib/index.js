'use strict';

// Load modules
var Bluebird = require('bluebird');
var Chai = require('chai');
var Contralog = require('contralog');
var Lodash = require('lodash');
var Sinon = require('sinon');
var Stringify = require('json-stringify-safe');
var SinonChai = require("sinon-chai");
var ChaiAsPromised = require("chai-as-promised");

Chai.use(ChaiAsPromised);
Chai.use(SinonChai);


var UtilsHelper = require('./utilsHelper');
var StubsHelper = require('./stubsHelper');
var MongooseHelper = require('./MongooseHelper');

// Declare internals

var internals = {
    returnObject: {
        CL: {},
        DATA: {},
        CMD: {
            register: {}
        },
        STUBS: {},
        UTILS: {},
        MongooseHelper: MongooseHelper
    }
};


internals.dumpHelper = function(){
    var o = Lodash.extend({}, internals.returnObject);
    o.NPM = 'NPM MODULES REMOVED FROM DUMP';
    o.CL = 'CONTRALOG REMOVED FROM DUMP';
    console.log('\n');
    console.log('----------------------------------------------------');
    console.log('node-test-helpers');
    console.log('----------------------------------------------------');
    console.log(Stringify(o, undefined, 4));
    console.log('----------------------------------------------------');
    console.log('\n');
};

internals.registerData = function(data){
    internals.returnObject.DATA = data;
};


// Exports
internals.returnObject.NPM = {
    Bluebird: Bluebird,
    Chai: Chai,
    Contralog: Contralog,
    Lodash: Lodash,
    Sinon: Sinon,
    Stringify: Stringify
};


internals.returnObject.CMD.register.Data = internals.registerData;


module.exports = function(moduleObject, contraLogOptions) {
    contraLogOptions = contraLogOptions || {};
    contraLogOptions.dumpExceptions = false;

    var cl = Contralog(moduleObject, contraLogOptions);
    cl.off();
    internals.returnObject.CL = cl;
    internals.returnObject.STUBS = StubsHelper(cl, Chai.expect);
    internals.returnObject.UTILS = UtilsHelper(cl, Chai.expect);
    return internals.returnObject;
};