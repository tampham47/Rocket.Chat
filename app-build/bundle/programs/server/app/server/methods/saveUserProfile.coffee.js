(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/saveUserProfile.coffee.js                            //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  saveUserProfile: function(settings) {                                // 2
    var checkPassword, profile, user;                                  // 3
    if (!RocketChat.settings.get("Accounts_AllowUserProfileChange")) {
      throw new Meteor.Error('error-not-allowed', 'Not allowed', {     // 4
        method: 'saveUserProfile'                                      // 4
      });                                                              //
    }                                                                  //
    if (!Meteor.userId()) {                                            // 6
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {   // 7
        method: 'saveUserProfile'                                      // 7
      });                                                              //
    }                                                                  //
    user = RocketChat.models.Users.findOneById(Meteor.userId());       // 3
    checkPassword = function(user, currentPassword) {                  // 3
      var passCheck, ref, ref1;                                        // 12
      if (!s.trim(user != null ? (ref = user.services) != null ? (ref1 = ref.password) != null ? ref1.bcrypt : void 0 : void 0 : void 0)) {
        return true;                                                   // 13
      }                                                                //
      if (!currentPassword) {                                          // 15
        return false;                                                  // 16
      }                                                                //
      passCheck = Accounts._checkPassword(user, {                      // 12
        digest: currentPassword,                                       // 18
        algorithm: 'sha-256'                                           // 18
      });                                                              //
      if (passCheck.error) {                                           // 19
        return false;                                                  // 20
      }                                                                //
      return true;                                                     // 21
    };                                                                 //
    if (settings.newPassword != null) {                                // 23
      if (!checkPassword(user, settings.currentPassword)) {            // 24
        throw new Meteor.Error('error-invalid-password', 'Invalid password', {
          method: 'saveUserProfile'                                    // 25
        });                                                            //
      }                                                                //
      Accounts.setPassword(Meteor.userId(), settings.newPassword, {    // 24
        logout: false                                                  // 26
      });                                                              //
    }                                                                  //
    if (settings.realname != null) {                                   // 28
      Meteor.call('setRealName', settings.realname);                   // 29
    }                                                                  //
    if (settings.username != null) {                                   // 31
      Meteor.call('setUsername', settings.username);                   // 32
    }                                                                  //
    if (settings.email != null) {                                      // 34
      if (!checkPassword(user, settings.currentPassword)) {            // 35
        throw new Meteor.Error('error-invalid-password', 'Invalid password', {
          method: 'saveUserProfile'                                    // 36
        });                                                            //
      }                                                                //
      Meteor.call('setEmail', settings.email);                         // 35
    }                                                                  //
    profile = {};                                                      // 3
    RocketChat.models.Users.setProfile(Meteor.userId(), profile);      // 3
    return true;                                                       // 43
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=saveUserProfile.coffee.js.map
