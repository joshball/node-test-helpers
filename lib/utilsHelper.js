'use strict';

// Load modules
var Stringify = require('json-stringify-safe');


// Declare internals

var internals = {
    UTILS: {
        stringify: Stringify,
        dumpJson: function(){
            var args = Array.prototype.slice.call(arguments);
            if(args.length === 1){
                console.log('\nJSON:\n', Stringify(args[0], undefined, 4));
                return;
            }
            if(args.length === 2){
                console.log('\n%s:\n', args[0], Stringify(args[1], undefined, 4));
                return;
            }
        }
    }
};

// internals.UTILS


// Exports

module.exports = function(cl, expect){
    if(!cl){
        throw new Error('utilsHelper require contralog as first arg');
    }
    if(!expect){
        throw new Error('utilsHelper require expect as second arg');
    }

    internals.cl = cl;
    internals.expect = expect;
    return internals.UTILS;
};
