'use strict';

// Load modules
var Bluebird = require('bluebird');
var mongoose = require('mongoose');
var cl = require('contralog')(module);
Bluebird.promisifyAll(mongoose);

// Declare internals

var MongoHelper = function(mongoDbUrl){
    this.mongoDbUrl = mongoDbUrl;
};

MongoHelper.prototype._dropCollection = Bluebird.method(function(collection){


    mongoose.connection.db.dropCollection(collection, function (err) {
        if(err){
            throw err;
        }
        return this;
    });
});

MongoHelper.prototype.dropCollections = Bluebird.method(function(collections){
    var self = this;

    cl.trace('Dropping collections [%s] from: %s', collections, this.mongoDbUrl);
    return mongoose.connectAsync(this.mongoDbUrl)
        .then(function(){
            return Bluebird.resolve(collections)
        })
        .each(function(collection){
            return self._dropCollection (collection).bind(self);
        })
        .catch(function(err){
            throw err;
        });
});


module.exports = MongoHelper;
