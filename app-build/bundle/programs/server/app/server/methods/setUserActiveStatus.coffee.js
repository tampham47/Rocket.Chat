(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/setUserActiveStatus.coffee.js                        //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  setUserActiveStatus: function(userId, active) {                      // 2
    if (!Meteor.userId()) {                                            // 3
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {   // 4
        method: 'setUserActiveStatus'                                  // 4
      });                                                              //
    }                                                                  //
    if (RocketChat.authz.hasPermission(Meteor.userId(), 'edit-other-user-active-status') !== true) {
      throw new Meteor.Error('error-not-allowed', 'Not allowed', {     // 7
        method: 'setUserActiveStatus'                                  // 7
      });                                                              //
    }                                                                  //
    RocketChat.models.Users.setUserActive(userId, active);             // 3
    if (active === false) {                                            // 11
      RocketChat.models.Users.unsetLoginTokens(userId);                // 12
    }                                                                  //
    return true;                                                       // 14
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=setUserActiveStatus.coffee.js.map
