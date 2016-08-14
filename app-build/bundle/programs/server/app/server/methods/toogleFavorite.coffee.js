(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/toogleFavorite.coffee.js                             //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  toggleFavorite: function(rid, f) {                                   // 2
    if (!Meteor.userId()) {                                            // 3
      throw new Meteor.Error('error-invalid-user', "Invalid user", {   // 4
        method: 'toggleFavorite'                                       // 4
      });                                                              //
    }                                                                  //
    return RocketChat.models.Subscriptions.setFavoriteByRoomIdAndUserId(rid, Meteor.userId(), f);
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=toogleFavorite.coffee.js.map
