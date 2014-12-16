'use strict';

// Load modules
var BluebirdPromise = require('bluebird');
var _ = require('lodash');


// Declare internals

var internals = {
    cl: undefined,
    returnObject: {}
};

// internals.UTILS
internals.createNewSinonStubLogger = function (sandbox) {
    return {
        trace: sandbox.stub(),
        debug: sandbox.stub(),
        info: sandbox.stub(),
        warn: sandbox.stub(),
        error: sandbox.stub(),
        exception: sandbox.stub(),
        fatal: sandbox.stub()
    };
};


internals.dumpStubArgDiff = function (expectedObj, stub, callNumber, argNumber) {
    callNumber = callNumber || 0;
    argNumber = argNumber || 0;

    if(stub.args && stub.args.length > 0){
        var stubArg = stub.args[callNumber][argNumber];

        internals.cl.dumpWithHeader('STUB[0][0] first call, first arg', stubArg);
        internals.cl.dumpWithHeader('expected call', expectedObj);

        internals.expect(stubArg).to.be.eql(expectedObj);
    }
    else {
        console.error('The stub was never called!');
        var s = new Error().stack;
        var split = s.split('\n');
        console.log(split[2]);
        console.log(split[3]);
        console.log(split[4]);
        internals.expect(true).to.be.false;
    }
};

internals.createLoggedAsyncStub = function (stubName, retValue) {
    return function () {
        internals.dumpStubIntercept(stubName, arguments, retValue);
        if (retValue instanceof Error){
            return BluebirdPromise.reject(retValue);
        }
        return BluebirdPromise.resolve(retValue);
    };
};

internals.createAsyncStub = function(sandbox, theObject, theMethod, theReturn){
    return sandbox.stub(theObject, theMethod,
        internals.createLoggedAsyncStub(theMethod, theReturn));
};

internals.dumpStubIntercept = function (method, parameters, retVal) {
    internals.cl.trace('\n');
    internals.cl.trace('\t ------------------------------------------------------------------------');
    internals.cl.trace('\t *** STUB INTERCEPT: %s', method);
    var parametersString = _.isObject(parameters) ? ('Obj with len: ' + JSON.stringify(parameters).length) : parameters;
    internals.cl.trace('\t ***     PARAMETERS: ', parametersString);
    var retValString = _.isObject(retVal) ? ('Obj with len: ' + JSON.stringify(retVal).length) : retVal;
    internals.cl.trace('\t ***      RETURNING: ', retValString);
    internals.cl.trace('\t ------------------------------------------------------------------------');
    internals.cl.trace('\n');
};



// Exports
// Declare externals

internals.returnObject = {
    dumpStubArgDiff: internals.dumpStubArgDiff,
    createStubLogger: internals.createNewSinonStubLogger,
    createLoggedAsyncStub: internals.createLoggedAsyncStub,
    createAsyncStub: internals.createAsyncStub
};

module.exports = function (cl, expect) {
    if (!cl || !cl.dumpWithHeader) {
        throw new Error('utilsHelper require contralog as first arg');
    }
    if (!expect) {
        throw new Error('utilsHelper require expect as second arg');
    }

    internals.cl = cl;
    internals.expect = expect;
    return internals.returnObject;
};
