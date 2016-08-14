(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/muteUserInRoom.coffee.js                             //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
                                                                       //
Meteor.methods({                                                       // 1
  muteUserInRoom: function(data) {                                     // 2
    var fromId, fromUser, mutedUser, ref, ref1, room;                  // 3
    if (!Meteor.userId()) {                                            // 3
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {   // 4
        method: 'muteUserInRoom'                                       // 4
      });                                                              //
    }                                                                  //
    fromId = Meteor.userId();                                          // 3
    check(data, Match.ObjectIncluding({                                // 3
      rid: String,                                                     // 7
      username: String                                                 // 7
    }));                                                               //
    if (!RocketChat.authz.hasPermission(fromId, 'mute-user', data.rid)) {
      throw new Meteor.Error('error-not-allowed', 'Not allowed', {     // 10
        method: 'muteUserInRoom'                                       // 10
      });                                                              //
    }                                                                  //
    room = RocketChat.models.Rooms.findOneById(data.rid);              // 3
    if (!room) {                                                       // 13
      throw new Meteor.Error('error-invalid-room', 'Invalid room', {   // 14
        method: 'muteUserInRoom'                                       // 14
      });                                                              //
    }                                                                  //
    if ((ref = room.t) !== 'c' && ref !== 'p') {                       // 16
      throw new Meteor.Error('error-invalid-room-type', room.t + ' is not a valid room type', {
        method: 'muteUserInRoom',                                      // 17
        type: room.t                                                   // 17
      });                                                              //
    }                                                                  //
    if (ref1 = data.username, indexOf.call((room != null ? room.usernames : void 0) || [], ref1) < 0) {
      throw new Meteor.Error('error-user-not-in-room', 'User is not in this room', {
        method: 'muteUserInRoom'                                       // 20
      });                                                              //
    }                                                                  //
    mutedUser = RocketChat.models.Users.findOneByUsername(data.username);
    RocketChat.models.Rooms.muteUsernameByRoomId(data.rid, mutedUser.username);
    fromUser = RocketChat.models.Users.findOneById(fromId);            // 3
    RocketChat.models.Messages.createUserMutedWithRoomIdAndUser(data.rid, mutedUser, {
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

//# sourceMappingURL=muteUserInRoom.coffee.js.map
