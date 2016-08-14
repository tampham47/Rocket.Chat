(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/addRoomModerator.coffee.js                           //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  addRoomModerator: function(rid, userId) {                            // 2
    var fromUser, subscription, user;                                  // 3
    if (!Meteor.userId()) {                                            // 3
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {   // 4
        method: 'addRoomModerator'                                     // 4
      });                                                              //
    }                                                                  //
    check(rid, String);                                                // 3
    check(userId, String);                                             // 3
    if (!RocketChat.authz.hasPermission(Meteor.userId(), 'set-moderator', rid)) {
      throw new Meteor.Error('error-not-allowed', 'Not allowed', {     // 10
        method: 'addRoomModerator'                                     // 10
      });                                                              //
    }                                                                  //
    subscription = RocketChat.models.Subscriptions.findOneByRoomIdAndUserId(rid, userId);
    if (subscription == null) {                                        // 13
      throw new Meteor.Error('error-invalid-room', 'Invalid room', {   // 14
        method: 'addRoomModerator'                                     // 14
      });                                                              //
    }                                                                  //
    RocketChat.models.Subscriptions.addRoleById(subscription._id, 'moderator');
    user = RocketChat.models.Users.findOneById(userId);                // 3
    fromUser = RocketChat.models.Users.findOneById(Meteor.userId());   // 3
    RocketChat.models.Messages.createSubscriptionRoleAddedWithRoomIdAndUser(rid, user, {
      u: {                                                             // 21
        _id: fromUser._id,                                             // 22
        username: fromUser.username                                    // 22
      },                                                               //
      role: 'moderator'                                                // 21
    });                                                                //
    if (RocketChat.settings.get('UI_DisplayRoles')) {                  // 26
      RocketChat.Notifications.notifyAll('roles-change', {             // 27
        type: 'added',                                                 // 27
        _id: 'moderator',                                              // 27
        u: {                                                           // 27
          _id: user._id,                                               // 27
          username: user.username                                      // 27
        },                                                             //
        scope: rid                                                     // 27
      });                                                              //
    }                                                                  //
    return true;                                                       // 29
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=addRoomModerator.coffee.js.map
