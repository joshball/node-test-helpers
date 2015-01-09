'use strict';

// Load modules
var Bluebird = require('bluebird');
var cl = require('contralog')(module);
var Assert = require('assert');

// Declare internals

var MongooseHelper = function(mongoose, mongoDbUrl){
    if(!mongoose){
        console.error('MONGOOSE is required parameter');
        process.exit(-1);
    }
    if(!mongoose.connectAsyc){
        Bluebird.promisifyAll(mongoose);
    }
    this.mongoose = mongoose;
    this.mongoDbUrl = mongoDbUrl;
    this.connected = false;
};

MongooseHelper.prototype.connectAsync = function(collection){
    var self = this;
    return this.mongoose.connectAsync(this.mongoDbUrl)
        .then(function(){
            self.connected = true;
        });
};

MongooseHelper.prototype.dropCollection = Bluebird.method(function(collection){
    var self = this;
    this.mongoose.connection.db.dropCollection(collection, function (err) {
        if(err){
            if(err.name === 'MongoError' && err.errmsg == 'ns not found'){
                // ignore this error
                return this;
            }
            console.log('*** CB DROP ERROR:\n', JSON.stringify(err, undefined, 4));
            throw err;
        }
        return this;
    });
});

MongooseHelper.prototype.dropCollections = Bluebird.method(function(collections){
    var self = this;
    Assert(this.connected == true);
    cl.trace('Dropping collections [%s] from: %s', collections, this.mongoDbUrl);
    return Bluebird.resolve(collections)
        .each(function(collection){
            return self.dropCollection (collection).bind(self);
        });
});


module.exports = MongooseHelper;
