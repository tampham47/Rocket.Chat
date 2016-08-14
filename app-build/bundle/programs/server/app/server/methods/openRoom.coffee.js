(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/openRoom.coffee.js                                   //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  openRoom: function(rid) {                                            // 2
    if (!Meteor.userId()) {                                            // 3
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {   // 4
        method: 'openRoom'                                             // 4
      });                                                              //
    }                                                                  //
    return RocketChat.models.Subscriptions.openByRoomIdAndUserId(rid, Meteor.userId());
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=openRoom.coffee.js.map
