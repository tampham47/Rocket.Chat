(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/createDirectMessage.coffee.js                        //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  createDirectMessage: function(username) {                            // 2
    var me, now, rid, to;                                              // 3
    if (!Meteor.userId()) {                                            // 3
      throw new Meteor.Error('error-invalid-user', "Invalid user", {   // 4
        method: 'createDirectMessage'                                  // 4
      });                                                              //
    }                                                                  //
    me = Meteor.user();                                                // 3
    if (!me.username) {                                                // 8
      throw new Meteor.Error('error-invalid-user', "Invalid user", {   // 9
        method: 'createDirectMessage'                                  // 9
      });                                                              //
    }                                                                  //
    if (me.username === username) {                                    // 11
      throw new Meteor.Error('error-invalid-user', "Invalid user", {   // 12
        method: 'createDirectMessage'                                  // 12
      });                                                              //
    }                                                                  //
    if (!RocketChat.authz.hasPermission(Meteor.userId(), 'create-d')) {
      throw new Meteor.Error('error-not-allowed', 'Not allowed', {     // 15
        method: 'createDirectMessage'                                  // 15
      });                                                              //
    }                                                                  //
    to = RocketChat.models.Users.findOneByUsername(username);          // 3
    if (!to) {                                                         // 19
      throw new Meteor.Error('error-invalid-user', "Invalid user", {   // 20
        method: 'createDirectMessage'                                  // 20
      });                                                              //
    }                                                                  //
    rid = [me._id, to._id].sort().join('');                            // 3
    now = new Date();                                                  // 3
    RocketChat.models.Rooms.upsert({                                   // 3
      _id: rid                                                         // 28
    }, {                                                               //
      $set: {                                                          // 30
        usernames: [me.username, to.username]                          // 31
      },                                                               //
      $setOnInsert: {                                                  // 30
        t: 'd',                                                        // 33
        msgs: 0,                                                       // 33
        ts: now                                                        // 33
      }                                                                //
    });                                                                //
    RocketChat.models.Subscriptions.upsert({                           // 3
      rid: rid,                                                        // 39
      $and: [                                                          // 39
        {                                                              //
          'u._id': me._id                                              // 40
        }                                                              //
      ]                                                                //
    }, {                                                               //
      $set: {                                                          // 42
        ts: now,                                                       // 43
        ls: now,                                                       // 43
        open: true                                                     // 43
      },                                                               //
      $setOnInsert: {                                                  // 42
        name: to.username,                                             // 47
        t: 'd',                                                        // 47
        alert: false,                                                  // 47
        unread: 0,                                                     // 47
        u: {                                                           // 47
          _id: me._id,                                                 // 52
          username: me.username                                        // 52
        }                                                              //
      }                                                                //
    });                                                                //
    RocketChat.models.Subscriptions.upsert({                           // 3
      rid: rid,                                                        // 57
      $and: [                                                          // 57
        {                                                              //
          'u._id': to._id                                              // 58
        }                                                              //
      ]                                                                //
    }, {                                                               //
      $setOnInsert: {                                                  // 60
        name: me.username,                                             // 61
        t: 'd',                                                        // 61
        open: false,                                                   // 61
        alert: false,                                                  // 61
        unread: 0,                                                     // 61
        u: {                                                           // 61
          _id: to._id,                                                 // 67
          username: to.username                                        // 67
        }                                                              //
      }                                                                //
    });                                                                //
    return {                                                           // 70
      rid: rid                                                         // 70
    };                                                                 //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=createDirectMessage.coffee.js.map
