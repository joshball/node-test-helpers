'use strict';

// Load modules
var Bluebird = require('bluebird');
var mongoose = require('mongoose');
var cl = require('contralog')(module);
var Assert = require('assert');
Bluebird.promisifyAll(mongoose);

// Declare internals

var MongoHelper = function(mongoDbUrl){
    this.mongoDbUrl = mongoDbUrl;
    this.connected = false;
};

MongoHelper.prototype.connectAsync = function(collection){
    var self = this;
    return mongoose.connectAsync(this.mongoDbUrl)
        .then(function(){
            self.connected = true;
        });
};

MongoHelper.prototype.dropCollection = Bluebird.method(function(collection){
    var self = this;
    mongoose.connection.db.dropCollection(collection, function (err) {
        if(err){
            throw err;
        }
        return this;
    });
});

MongoHelper.prototype.dropCollections = Bluebird.method(function(collections){
    var self = this;
    Assert(this.connected);
    cl.trace('Dropping collections [%s] from: %s', collections, this.mongoDbUrl);
    return Bluebird.resolve(collections)
        .each(function(collection){
            return self.dropCollection (collection).bind(self);
        })
        .catch(function(err){
            throw err;
        });
});


module.exports = MongoHelper;
