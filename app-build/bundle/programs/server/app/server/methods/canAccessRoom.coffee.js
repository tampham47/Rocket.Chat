(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/canAccessRoom.coffee.js                              //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  canAccessRoom: function(rid, userId) {                               // 2
    var room, user;                                                    // 3
    user = RocketChat.models.Users.findOneById(userId, {               // 3
      fields: {                                                        // 3
        username: 1                                                    // 3
      }                                                                //
    });                                                                //
    if (!(user != null ? user.username : void 0)) {                    // 5
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {   // 6
        method: 'canAccessRoom'                                        // 6
      });                                                              //
    }                                                                  //
    if (!rid) {                                                        // 8
      throw new Meteor.Error('error-invalid-room', 'Invalid room', {   // 9
        method: 'canAccessRoom'                                        // 9
      });                                                              //
    }                                                                  //
    room = RocketChat.models.Rooms.findOneById(rid);                   // 3
    if (room) {                                                        // 13
      if (RocketChat.authz.canAccessRoom.call(this, room, user)) {     // 14
        room.username = user.username;                                 // 15
        return room;                                                   // 16
      } else {                                                         //
        return false;                                                  // 18
      }                                                                //
    } else {                                                           //
      throw new Meteor.Error('error-invalid-room', 'Invalid room', {   // 20
        method: 'canAccessRoom'                                        // 20
      });                                                              //
    }                                                                  //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=canAccessRoom.coffee.js.map
