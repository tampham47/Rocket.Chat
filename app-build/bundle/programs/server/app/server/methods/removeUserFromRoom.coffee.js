(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/removeUserFromRoom.coffee.js                         //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
                                                                       //
Meteor.methods({                                                       // 1
  removeUserFromRoom: function(data) {                                 // 2
    var fromId, fromUser, ref, ref1, removedUser, room;                // 3
    if (!Meteor.userId()) {                                            // 3
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {   // 4
        method: 'removeUserFromRoom'                                   // 4
      });                                                              //
    }                                                                  //
    fromId = Meteor.userId();                                          // 3
    check(data, Match.ObjectIncluding({                                // 3
      rid: String,                                                     // 7
      username: String                                                 // 7
    }));                                                               //
    if (!RocketChat.authz.hasPermission(fromId, 'remove-user', data.rid)) {
      throw new Meteor.Error('error-not-allowed', 'Not allowed', {     // 10
        method: 'removeUserFromRoom'                                   // 10
      });                                                              //
    }                                                                  //
    room = RocketChat.models.Rooms.findOneById(data.rid);              // 3
    if (ref = data.username, indexOf.call((room != null ? room.usernames : void 0) || [], ref) < 0) {
      throw new Meteor.Error('error-user-not-in-room', 'User is not in this room', {
        method: 'removeUserFromRoom'                                   // 15
      });                                                              //
    }                                                                  //
    removedUser = RocketChat.models.Users.findOneByUsername(data.username);
    RocketChat.models.Rooms.removeUsernameById(data.rid, data.username);
    RocketChat.models.Subscriptions.removeByRoomIdAndUserId(data.rid, removedUser._id);
    if ((ref1 = room.t) === 'c' || ref1 === 'p') {                     // 23
      RocketChat.authz.removeUserFromRoles(removedUser._id, ['moderator', 'owner'], data.rid);
    }                                                                  //
    fromUser = RocketChat.models.Users.findOneById(fromId);            // 3
    RocketChat.models.Messages.createUserRemovedWithRoomIdAndUser(data.rid, removedUser, {
      u: {                                                             // 28
        _id: fromUser._id,                                             // 29
        username: fromUser.username                                    // 29
      }                                                                //
    });                                                                //
    return true;                                                       // 32
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=removeUserFromRoom.coffee.js.map
