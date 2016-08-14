(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/getRoomIdByNameOrId.coffee.js                        //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  getRoomIdByNameOrId: function(rid) {                                 // 2
    var ref, room;                                                     // 3
    if (!Meteor.userId()) {                                            // 3
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {   // 4
        method: 'getRoomIdByNameOrId'                                  // 4
      });                                                              //
    }                                                                  //
    room = RocketChat.models.Rooms.findOneById(rid) || RocketChat.models.Rooms.findOneByName(rid);
    if (room == null) {                                                // 8
      throw new Meteor.Error('error-not-allowed', 'Not allowed', {     // 9
        method: 'getRoomIdByNameOrId'                                  // 9
      });                                                              //
    }                                                                  //
    if (room.usernames.indexOf((ref = Meteor.user()) != null ? ref.username : void 0) !== -1) {
      return room._id;                                                 // 12
    }                                                                  //
    if (room.t !== 'c' || RocketChat.authz.hasPermission(Meteor.userId(), 'view-c-room') !== true) {
      throw new Meteor.Error('error-not-allowed', 'Not allowed', {     // 15
        method: 'getRoomIdByNameOrId'                                  // 15
      });                                                              //
    }                                                                  //
    return room._id;                                                   // 17
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=getRoomIdByNameOrId.coffee.js.map
