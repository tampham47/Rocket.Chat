(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/deleteUser.coffee.js                                 //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  deleteUser: function(userId) {                                       // 2
    var user;                                                          // 3
    if (!Meteor.userId()) {                                            // 3
      throw new Meteor.Error('error-invalid-user', "Invalid user", {   // 4
        method: 'deleteUser'                                           // 4
      });                                                              //
    }                                                                  //
    user = RocketChat.models.Users.findOneById(Meteor.userId());       // 3
    if (RocketChat.authz.hasPermission(Meteor.userId(), 'delete-user') !== true) {
      throw new Meteor.Error('error-not-allowed', "Not allowed", {     // 9
        method: 'deleteUser'                                           // 9
      });                                                              //
    }                                                                  //
    user = RocketChat.models.Users.findOneById(userId);                // 3
    if (user == null) {                                                // 12
      throw new Meteor.Error('error-invalid-user', "Invalid user", {   // 13
        method: 'deleteUser'                                           // 13
      });                                                              //
    }                                                                  //
    RocketChat.deleteUser(userId);                                     // 3
    return true;                                                       // 17
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=deleteUser.coffee.js.map
