(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/roomPublishes.coffee.js                              //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function() {                                            // 1
  RocketChat.roomTypes.setPublish('c', function(identifier) {          // 2
    var options, ref, roomId;                                          // 3
    options = {                                                        // 3
      fields: {                                                        // 4
        name: 1,                                                       // 5
        t: 1,                                                          // 5
        cl: 1,                                                         // 5
        u: 1,                                                          // 5
        usernames: 1,                                                  // 5
        topic: 1,                                                      // 5
        muted: 1,                                                      // 5
        archived: 1,                                                   // 5
        jitsiTimeout: 1,                                               // 5
        description: 1                                                 // 5
      }                                                                //
    };                                                                 //
    if (RocketChat.authz.hasPermission(this.userId, 'view-c-room')) {  // 16
      return RocketChat.models.Rooms.findByTypeAndName('c', identifier, options);
    } else if (RocketChat.authz.hasPermission(this.userId, 'view-joined-room')) {
      roomId = RocketChat.models.Subscriptions.findByTypeNameAndUserId('c', identifier, this.userId).fetch();
      if (roomId.length > 0) {                                         // 20
        return RocketChat.models.Rooms.findById((ref = roomId[0]) != null ? ref.rid : void 0, options);
      }                                                                //
    }                                                                  //
    return this.ready();                                               // 22
  });                                                                  //
  RocketChat.roomTypes.setPublish('p', function(identifier) {          // 2
    var options, user;                                                 // 25
    options = {                                                        // 25
      fields: {                                                        // 26
        name: 1,                                                       // 27
        t: 1,                                                          // 27
        cl: 1,                                                         // 27
        u: 1,                                                          // 27
        usernames: 1,                                                  // 27
        topic: 1,                                                      // 27
        muted: 1,                                                      // 27
        archived: 1,                                                   // 27
        jitsiTimeout: 1,                                               // 27
        description: 1                                                 // 27
      }                                                                //
    };                                                                 //
    user = RocketChat.models.Users.findOneById(this.userId, {          // 25
      fields: {                                                        // 38
        username: 1                                                    // 38
      }                                                                //
    });                                                                //
    return RocketChat.models.Rooms.findByTypeAndNameContainingUsername('p', identifier, user.username, options);
  });                                                                  //
  return RocketChat.roomTypes.setPublish('d', function(identifier) {   //
    var options, user;                                                 // 42
    options = {                                                        // 42
      fields: {                                                        // 43
        name: 1,                                                       // 44
        t: 1,                                                          // 44
        cl: 1,                                                         // 44
        u: 1,                                                          // 44
        usernames: 1,                                                  // 44
        topic: 1,                                                      // 44
        jitsiTimeout: 1                                                // 44
      }                                                                //
    };                                                                 //
    user = RocketChat.models.Users.findOneById(this.userId, {          // 42
      fields: {                                                        // 52
        username: 1                                                    // 52
      }                                                                //
    });                                                                //
    if (RocketChat.authz.hasPermission(this.userId, 'view-d-room')) {  // 53
      return RocketChat.models.Rooms.findByTypeContainigUsernames('d', [user.username, identifier], options);
    }                                                                  //
    return this.ready();                                               // 55
  });                                                                  //
});                                                                    // 1
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=roomPublishes.coffee.js.map
