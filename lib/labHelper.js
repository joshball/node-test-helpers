'use strict';

// Load modules
var Lab = require('lab');
var lab = Lab.script();


// Declare internals

var internals = {};

internals.setupContext = function(lab, expect, context){
    context.describe = lab.describe;
    context.it = lab.it;
    context.before = lab.before;
    context.beforeEach = lab.beforeEach;
    context.after = lab.after;
    context.afterEach = lab.afterEach;

    context.expect = expect;

    return context;
};

internals.cleanupContext = function(context){
    delete context.describe;
    delete context.it;
    delete context.before;
    delete context.beforeEach;
    delete context.after;
    delete context.afterEach;

    delete context.expect;

    return context;
};

internals.setupAndTeardown = function(expect){
    if(!expect){
        throw new Error('You must pass expect');
    }
    internals.setupContext(lab, expect, global);
    //lab.after(function(done){
    //    cleanupContext(global);
    //    done();
    //});
    return lab;
};

//var testContext = function(experiements){
//    console.log('testContext.experiements', experiements)
//    setupContext(lab, global);
//    lab.after(function(done){
//        cleanupContext(global);
//        done();
//    });
//    experiements();
//};


// Exports

exports.lab = lab;
exports.setup = internals.setupAndTeardown;