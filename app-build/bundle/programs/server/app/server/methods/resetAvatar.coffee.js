(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/resetAvatar.coffee.js                                //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  resetAvatar: function(image, service) {                              // 2
    var user;                                                          // 3
    if (!Meteor.userId()) {                                            // 3
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {   // 4
        method: 'resetAvatar'                                          // 4
      });                                                              //
    }                                                                  //
    if (!RocketChat.settings.get("Accounts_AllowUserAvatarChange")) {  // 6
      throw new Meteor.Error('error-not-allowed', 'Not allowed', {     // 7
        method: 'resetAvatar'                                          // 7
      });                                                              //
    }                                                                  //
    user = Meteor.user();                                              // 3
    RocketChatFileAvatarInstance.deleteFile(user.username + ".jpg");   // 3
    RocketChat.models.Users.unsetAvatarOrigin(user._id);               // 3
    RocketChat.Notifications.notifyAll('updateAvatar', {               // 3
      username: user.username                                          // 15
    });                                                                //
  }                                                                    //
});                                                                    //
                                                                       //
DDPRateLimiter.addRule({                                               // 1
  type: 'method',                                                      // 20
  name: 'resetAvatar',                                                 // 20
  userId: function() {                                                 // 20
    return true;                                                       // 22
  }                                                                    //
}, 1, 60000);                                                          //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=resetAvatar.coffee.js.map
