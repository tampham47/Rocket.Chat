(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/stream/streamBroadcast.coffee.js                             //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var authorizeConnection, logger;                                       // 1
                                                                       //
logger = new Logger('StreamBroadcast', {                               // 1
  sections: {                                                          // 2
    connection: 'Connection',                                          // 3
    auth: 'Auth',                                                      // 3
    stream: 'Stream'                                                   // 3
  }                                                                    //
});                                                                    //
                                                                       //
authorizeConnection = function(instance) {                             // 1
  logger.auth.info("Authorizing with " + instance);                    // 8
  return connections[instance].call('broadcastAuth', connections[instance].instanceRecord._id, InstanceStatus.id(), function(err, ok) {
    connections[instance].broadcastAuth = ok;                          // 10
    return logger.auth.info("broadcastAuth with " + instance, ok);     //
  });                                                                  //
};                                                                     // 7
                                                                       //
this.connections = {};                                                 // 1
                                                                       //
this.startStreamBroadcast = function() {                               // 1
  var broadcast;                                                       // 15
  logger.info('startStreamBroadcast');                                 // 15
  InstanceStatus.getCollection().find({                                // 15
    'extraInformation.port': {                                         // 17
      $exists: true                                                    // 17
    }                                                                  //
  }, {                                                                 //
    sort: {                                                            // 17
      _createdAt: -1                                                   // 17
    }                                                                  //
  }).observe({                                                         //
    added: function(record) {                                          // 18
      var instance, ref;                                               // 19
      if (record.extraInformation.port === process.env.PORT && (record.extraInformation.host === 'localhost' || record.extraInformation.host === process.env.INSTANCE_IP)) {
        return;                                                        // 20
      }                                                                //
      instance = record.extraInformation.host + ':' + record.extraInformation.port;
      if (((ref = connections[instance]) != null ? ref.instanceRecord : void 0) != null) {
        if (connections[instance].instanceRecord._createdAt < record._createdAt) {
          connections[instance].disconnect();                          // 26
          delete connections[instance];                                // 26
        } else {                                                       //
          return;                                                      // 29
        }                                                              //
      }                                                                //
      logger.connection.info('connecting in', instance);               // 19
      connections[instance] = DDP.connect(instance, {                  // 19
        _dontPrintErrors: true                                         // 32
      });                                                              //
      connections[instance].instanceRecord = record;                   // 19
      authorizeConnection(instance);                                   // 19
      return connections[instance].onReconnect = function() {          //
        return authorizeConnection(instance);                          //
      };                                                               //
    },                                                                 //
    removed: function(record) {                                        // 18
      var instance;                                                    // 39
      instance = record.extraInformation.host + ':' + record.extraInformation.port;
      if ((connections[instance] != null) && (InstanceStatus.getCollection().findOne({
        'extraInformation.host': record.extraInformation.host,         //
        'extraInformation.port': record.extraInformation.port          //
      }) == null)) {                                                   //
        logger.connection.info('disconnecting from', instance);        // 41
        connections[instance].disconnect();                            // 41
        return delete connections[instance];                           //
      }                                                                //
    }                                                                  //
  });                                                                  //
  broadcast = function(streamName, eventName, args, userId) {          // 15
    var connection, fromInstance, instance, results;                   // 46
    fromInstance = (process.env.INSTANCE_IP || 'localhost') + ':' + process.env.PORT;
    results = [];                                                      // 47
    for (instance in connections) {                                    //
      connection = connections[instance];                              //
      results.push((function(instance, connection) {                   // 48
        if (connection.status().connected === true) {                  // 49
          return connection.call('stream', streamName, eventName, args, function(error, response) {
            if (error != null) {                                       // 51
              logger.error("Stream broadcast error", error);           // 52
            }                                                          //
            switch (response) {                                        // 54
              case 'self-not-authorized':                              // 54
                logger.stream.error(("Stream broadcast from '" + fromInstance + "' to '" + connection._stream.endpoint + "' with name " + streamName + " to self is not authorized").red);
                logger.stream.debug("    -> connection authorized".red, connection.broadcastAuth);
                logger.stream.debug("    -> connection status".red, connection.status());
                return logger.stream.debug("    -> arguments".red, eventName, args);
              case 'not-authorized':                                   // 54
                logger.stream.error(("Stream broadcast from '" + fromInstance + "' to '" + connection._stream.endpoint + "' with name " + streamName + " not authorized").red);
                logger.stream.debug("    -> connection authorized".red, connection.broadcastAuth);
                logger.stream.debug("    -> connection status".red, connection.status());
                logger.stream.debug("    -> arguments".red, eventName, args);
                return authorizeConnection(instance);                  //
              case 'stream-not-exists':                                // 54
                logger.stream.error(("Stream broadcast from '" + fromInstance + "' to '" + connection._stream.endpoint + "' with name " + streamName + " does not exist").red);
                logger.stream.debug("    -> connection authorized".red, connection.broadcastAuth);
                logger.stream.debug("    -> connection status".red, connection.status());
                return logger.stream.debug("    -> arguments".red, eventName, args);
            }                                                          // 54
          });                                                          //
        }                                                              //
      })(instance, connection));                                       //
    }                                                                  // 47
    return results;                                                    //
  };                                                                   //
  Meteor.StreamerCentral.on('broadcast', function(streamName, eventName, args) {
    return broadcast(streamName, eventName, args);                     //
  });                                                                  //
  return Meteor.methods({                                              //
    broadcastAuth: function(selfId, remoteId) {                        // 78
      check(selfId, String);                                           // 79
      check(remoteId, String);                                         // 79
      this.unblock();                                                  // 79
      if (selfId === InstanceStatus.id() && remoteId !== InstanceStatus.id() && (InstanceStatus.getCollection().findOne({
        _id: remoteId                                                  //
      }) != null)) {                                                   //
        this.connection.broadcastAuth = true;                          // 84
      }                                                                //
      return this.connection.broadcastAuth === true;                   // 86
    },                                                                 //
    stream: function(streamName, eventName, args) {                    // 78
      if (this.connection == null) {                                   // 90
        return 'self-not-authorized';                                  // 91
      }                                                                //
      if (this.connection.broadcastAuth !== true) {                    // 94
        return 'not-authorized';                                       // 95
      }                                                                //
      if (Meteor.StreamerCentral.instances[streamName] == null) {      // 97
        return 'stream-not-exists';                                    // 98
      }                                                                //
      Meteor.StreamerCentral.instances[streamName]._emit(eventName, args);
      return void 0;                                                   // 102
    }                                                                  //
  });                                                                  //
};                                                                     // 14
                                                                       //
Meteor.startup(function() {                                            // 1
  return startStreamBroadcast();                                       //
});                                                                    // 104
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=streamBroadcast.coffee.js.map
