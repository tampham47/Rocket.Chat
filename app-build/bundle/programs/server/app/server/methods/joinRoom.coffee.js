(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/joinRoom.coffee.js                                   //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  joinRoom: function(rid) {                                            // 2
    var now, room, subscription, user;                                 // 3
    if (!Meteor.userId()) {                                            // 3
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {   // 4
        method: 'joinRoom'                                             // 4
      });                                                              //
    }                                                                  //
    room = RocketChat.models.Rooms.findOneById(rid);                   // 3
    if (room == null) {                                                // 8
      throw new Meteor.Error('error-invalid-room', 'Invalid room', {   // 9
        method: 'joinRoom'                                             // 9
      });                                                              //
    }                                                                  //
    if (room.t !== 'c' || RocketChat.authz.hasPermission(Meteor.userId(), 'view-c-room') !== true) {
      throw new Meteor.Error('error-not-allowed', 'Not allowed', {     // 12
        method: 'joinRoom'                                             // 12
      });                                                              //
    }                                                                  //
    now = new Date();                                                  // 3
    subscription = RocketChat.models.Subscriptions.findOneByRoomIdAndUserId(rid, Meteor.userId());
    if (subscription != null) {                                        // 18
      return;                                                          // 19
    }                                                                  //
    user = RocketChat.models.Users.findOneById(Meteor.userId());       // 3
    RocketChat.callbacks.run('beforeJoinRoom', user, room);            // 3
    RocketChat.models.Rooms.addUsernameById(rid, user.username);       // 3
    RocketChat.models.Subscriptions.createWithRoomAndUser(room, user, {
      ts: now,                                                         // 28
      open: true,                                                      // 28
      alert: true,                                                     // 28
      unread: 1                                                        // 28
    });                                                                //
    RocketChat.models.Messages.createUserJoinWithRoomIdAndUser(rid, user, {
      ts: now                                                          // 34
    });                                                                //
    Meteor.defer(function() {                                          // 3
      return RocketChat.callbacks.run('afterJoinRoom', user, room);    //
    });                                                                //
    return true;                                                       // 39
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=joinRoom.coffee.js.map
