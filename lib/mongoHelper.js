'use strict';

// Load modules
var Bluebird = require('bluebird');
var mongoose = require('mongoose');
var cl = require('contralog')(module);
Bluebird.promisifyAll(mongoose);

// Declare internals

var MongoHelper = function(mongoDbUrl){
    console.log('NEW MONGO HELPER', mongoDbUrl)
    this.mongoDbUrl = mongoDbUrl;
};

MongoHelper.prototype.dropCollection = Bluebird.method(function(collection){

    console.log('Dropping collections from: %s', collection);
    console.log('THIS.dropCollection_', this);
    cl.trace('Dropping collections from: %s', this.mongoDbUrl);

    mongoose.connection.db.dropCollection(collection, function (err) {
        if(err){
            cl.warn('mongo had an error dropping collection: %s', collection);
            cl.warn('Throwing: ', err);
            throw err;
        }
        cl.trace('collection: %s dropped', collection);
        return this;
    });
});

MongoHelper.prototype.dropCollections = Bluebird.method(function(collections){
    console.log('dropCollections ', collections)
    console.log('THIS.dropCollection_S', this);
    var self = this;

    return mongoose.connectAsync(this.mongoDbUrl)
        .then(function(){
            console.log('\nCONNECTION OPENED')
            return Bluebird.resolve(collections)
        })
        .each(function(collection){
            console.log('\nDROPPING ', collection)
            return self.dropCollection(collection).bind(self);
        })
        .catch(function(err){
            cl.error('DROP COLLECTION_S FAILED!', err);
            throw err;
        });
});


module.exports = MongoHelper;
