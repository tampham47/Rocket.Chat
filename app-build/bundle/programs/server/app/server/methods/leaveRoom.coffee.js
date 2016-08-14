(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/leaveRoom.coffee.js                                  //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  leaveRoom: function(rid) {                                           // 2
    var fromId, numOwners, removedUser, room, user;                    // 3
    if (!Meteor.userId()) {                                            // 3
      throw new Meteor.Error('error-invalid-user', "Invalid user", {   // 4
        method: 'leaveRoom'                                            // 4
      });                                                              //
    }                                                                  //
    this.unblock();                                                    // 3
    fromId = Meteor.userId();                                          // 3
    room = RocketChat.models.Rooms.findOneById(rid);                   // 3
    user = Meteor.user();                                              // 3
    if (RocketChat.authz.hasRole(user._id, 'owner', room._id)) {       // 13
      numOwners = RocketChat.authz.getUsersInRole('owner', room._id).fetch().length;
      if (numOwners === 1) {                                           // 15
        throw new Meteor.Error('error-you-are-last-owner', 'You are the last owner. Please set new owner before leaving the room.', {
          method: 'leaveRoom'                                          // 16
        });                                                            //
      }                                                                //
    }                                                                  //
    RocketChat.callbacks.run('beforeLeaveRoom', user, room);           // 3
    RocketChat.models.Rooms.removeUsernameById(rid, user.username);    // 3
    if (room.usernames.indexOf(user.username) !== -1) {                // 22
      removedUser = user;                                              // 23
      RocketChat.models.Messages.createUserLeaveWithRoomIdAndUser(rid, removedUser);
    }                                                                  //
    if (room.t === 'l') {                                              // 26
      RocketChat.models.Messages.createCommandWithRoomIdAndUser('survey', rid, user);
    }                                                                  //
    RocketChat.models.Subscriptions.removeByRoomIdAndUserId(rid, Meteor.userId());
    return Meteor.defer(function() {                                   //
      return RocketChat.callbacks.run('afterLeaveRoom', user, room);   //
    });                                                                //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=leaveRoom.coffee.js.map
