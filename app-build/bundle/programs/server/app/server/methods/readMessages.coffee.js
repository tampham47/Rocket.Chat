(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/readMessages.coffee.js                               //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  readMessages: function(rid) {                                        // 2
    if (!Meteor.userId()) {                                            // 3
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {   // 4
        method: 'readMessages'                                         // 4
      });                                                              //
    }                                                                  //
    return RocketChat.models.Subscriptions.setAsReadByRoomIdAndUserId(rid, Meteor.userId());
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=readMessages.coffee.js.map
