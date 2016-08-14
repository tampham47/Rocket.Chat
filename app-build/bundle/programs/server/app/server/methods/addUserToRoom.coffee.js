(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/addUserToRoom.coffee.js                              //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  addUserToRoom: function(data) {                                      // 2
    var fromId, fromUser, newUser, now, room;                          // 3
    if (!Meteor.userId()) {                                            // 3
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {   // 4
        method: 'addUserToRoom'                                        // 4
      });                                                              //
    }                                                                  //
    fromId = Meteor.userId();                                          // 3
    if (!Match.test(data != null ? data.rid : void 0, String)) {       // 7
      throw new Meteor.Error('error-invalid-room', 'Invalid room', {   // 8
        method: 'addUserToRoom'                                        // 8
      });                                                              //
    }                                                                  //
    if (!Match.test(data != null ? data.username : void 0, String)) {  // 10
      throw new Meteor.Error('error-invalid-username', 'Invalid username', {
        method: 'addUserToRoom'                                        // 11
      });                                                              //
    }                                                                  //
    room = RocketChat.models.Rooms.findOneById(data.rid);              // 3
    if (room.usernames.indexOf(Meteor.user().username) === -1) {       // 15
      throw new Meteor.Error('error-not-allowed', 'Not allowed', {     // 16
        method: 'addUserToRoom'                                        // 16
      });                                                              //
    }                                                                  //
    if (!RocketChat.authz.hasPermission(fromId, 'add-user-to-room', room._id)) {
      throw new Meteor.Error('error-not-allowed', 'Not allowed', {     // 20
        method: 'addUserToRoom'                                        // 20
      });                                                              //
    }                                                                  //
    if (room.t === 'd') {                                              // 22
      throw new Meteor.Error('error-cant-invite-for-direct-room', 'Can\'t invite user to direct rooms', {
        method: 'addUserToRoom'                                        // 23
      });                                                              //
    }                                                                  //
    if (room.usernames.indexOf(data.username) !== -1) {                // 26
      return;                                                          // 27
    }                                                                  //
    newUser = RocketChat.models.Users.findOneByUsername(data.username);
    RocketChat.models.Rooms.addUsernameById(data.rid, data.username);  // 3
    now = new Date();                                                  // 3
    RocketChat.models.Subscriptions.createWithRoomAndUser(room, newUser, {
      ts: now,                                                         // 36
      open: true,                                                      // 36
      alert: true,                                                     // 36
      unread: 1                                                        // 36
    });                                                                //
    fromUser = RocketChat.models.Users.findOneById(fromId);            // 3
    RocketChat.models.Messages.createUserAddedWithRoomIdAndUser(data.rid, newUser, {
      ts: now,                                                         // 43
      u: {                                                             // 43
        _id: fromUser._id,                                             // 45
        username: fromUser.username                                    // 45
      }                                                                //
    });                                                                //
    return true;                                                       // 48
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=addUserToRoom.coffee.js.map
