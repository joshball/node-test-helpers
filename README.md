node-test-helpers
=================

My node test helpers

// Usage:
var TH = require('node-test-helpers')(module, [contraLogOptions]);

// You have a contra log object
// But by default, the logger is off (don't want logging in your tests unless you are debugging)
// so if this wont display:
TH.cl.trace('This %s %s console log msg', 'is', 'a');

// Turn it on:
TH.cl.on();
// And now you have logging:
TH.cl.trace('This %s %s console log msg', 'is', 'a');


// Using Lab?
TH.register.Lab();

// Now you have lab versions of describe/it/before*/after*, and chai.expect, chai-promised, sinon, sinon-chai
describe('foo', function(){
    it('is', function(done){
        expect(true).to.be.true;
        done();
    })
});

// Want to add some test data (just a convenience method:
TH.register.data({some:'data'});

// And some utilities for logging and stubs (based on bluebird and sinon);
// Lets say you want to stub fs.readFile:
var BluebirdPromise = require('bluebird');
var Fs = Promise.promisifyAll(require("fs"));
// You now have: Fs.readFileAsync('file.txt', 'utf8');

// You can now stub and trace it with:

var stub = sinon.stub( Fs, 'readFileAsync', TH.UTILS.createAsyncStub('createAsync', 'contents of stubbed file call') );

// Now whenever you call Fs.readFileAsync(any, parameters);
// You will see (assuming contralog is on):
[LOGLOC]   ------------------------------------------------------------------------
[LOGLOC]   *** STUB INTERCEPT: readFileAsync
[LOGLOC]   ***     PARAMETERS:  <description of args>
[LOGLOC]   ***      RETURNING:  <description of return>
[LOGLOC]   ------------------------------------------------------------------------


