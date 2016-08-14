(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/presence.coffee.js                                   //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function() {                                            // 1
  var instance;                                                        // 2
  instance = {                                                         // 2
    host: 'localhost',                                                 // 3
    port: process.env.PORT                                             // 3
  };                                                                   //
  if (process.env.INSTANCE_IP) {                                       // 6
    instance.host = process.env.INSTANCE_IP;                           // 7
  }                                                                    //
  InstanceStatus.registerInstance('rocket.chat', instance);            // 2
  UserPresence.start();                                                // 2
  return UserPresenceMonitor.start();                                  //
});                                                                    // 1
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=presence.coffee.js.map
