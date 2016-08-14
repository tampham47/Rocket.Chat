(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/rocketchat_message-pin/server/settings.coffee.js                                                      //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function() {                                                                                       // 1
  RocketChat.settings.add('Message_AllowPinning', true, {                                                         // 2
    type: 'boolean',                                                                                              // 2
    group: 'Message',                                                                                             // 2
    "public": true                                                                                                // 2
  });                                                                                                             //
  return RocketChat.models.Permissions.upsert('pin-message', {                                                    //
    $setOnInsert: {                                                                                               // 3
      roles: ['owner', 'moderator', 'admin']                                                                      // 3
    }                                                                                                             //
  });                                                                                                             //
});                                                                                                               // 1
                                                                                                                  //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/rocketchat_message-pin/server/pinMessage.coffee.js                                                    //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                  // 1
  pinMessage: function(message) {                                                                                 // 2
    var me, room;                                                                                                 // 3
    if (!Meteor.userId()) {                                                                                       // 3
      throw new Meteor.Error('error-invalid-user', "Invalid user", {                                              // 4
        method: 'pinMessage'                                                                                      // 4
      });                                                                                                         //
    }                                                                                                             //
    if (!RocketChat.settings.get('Message_AllowPinning')) {                                                       // 6
      throw new Meteor.Error('error-action-not-allowed', 'Message pinning not allowed', {                         // 7
        method: 'pinMessage',                                                                                     // 7
        action: 'Message_pinning'                                                                                 // 7
      });                                                                                                         //
    }                                                                                                             //
    room = RocketChat.models.Rooms.findOne({                                                                      // 3
      _id: message.rid                                                                                            // 9
    });                                                                                                           //
    if (Array.isArray(room.usernames) && room.usernames.indexOf(Meteor.user().username) === -1) {                 // 11
      return false;                                                                                               // 12
    }                                                                                                             //
    if (RocketChat.settings.get('Message_KeepHistory')) {                                                         // 15
      RocketChat.models.Messages.cloneAndSaveAsHistoryById(message._id);                                          // 16
    }                                                                                                             //
    me = RocketChat.models.Users.findOneById(Meteor.userId());                                                    // 3
    message.pinned = true;                                                                                        // 3
    message.pinnedAt = Date.now;                                                                                  // 3
    message.pinnedBy = {                                                                                          // 3
      _id: Meteor.userId(),                                                                                       // 23
      username: me.username                                                                                       // 23
    };                                                                                                            //
    message = RocketChat.callbacks.run('beforeSaveMessage', message);                                             // 3
    RocketChat.models.Messages.setPinnedByIdAndUserId(message._id, message.pinnedBy, message.pinned);             // 3
    return RocketChat.models.Messages.createWithTypeRoomIdMessageAndUser('message_pinned', message.rid, '', me, {
      attachments: [                                                                                              // 31
        {                                                                                                         //
          "text": message.msg,                                                                                    // 32
          "author_name": message.u.username,                                                                      // 32
          "author_icon": getAvatarUrlFromUsername(message.u.username),                                            // 32
          "ts": message.ts                                                                                        // 32
        }                                                                                                         //
      ]                                                                                                           //
    });                                                                                                           //
  },                                                                                                              //
  unpinMessage: function(message) {                                                                               // 2
    var me, room;                                                                                                 // 39
    if (!Meteor.userId()) {                                                                                       // 39
      throw new Meteor.Error('error-invalid-user', "Invalid user", {                                              // 40
        method: 'unpinMessage'                                                                                    // 40
      });                                                                                                         //
    }                                                                                                             //
    if (!RocketChat.settings.get('Message_AllowPinning')) {                                                       // 42
      throw new Meteor.Error('error-action-not-allowed', 'Message pinning not allowed', {                         // 43
        method: 'unpinMessage',                                                                                   // 43
        action: 'Message_pinning'                                                                                 // 43
      });                                                                                                         //
    }                                                                                                             //
    room = RocketChat.models.Rooms.findOne({                                                                      // 39
      _id: message.rid                                                                                            // 45
    });                                                                                                           //
    if (Array.isArray(room.usernames) && room.usernames.indexOf(Meteor.user().username) === -1) {                 // 47
      return false;                                                                                               // 48
    }                                                                                                             //
    if (RocketChat.settings.get('Message_KeepHistory')) {                                                         // 51
      RocketChat.models.Messages.cloneAndSaveAsHistoryById(message._id);                                          // 52
    }                                                                                                             //
    me = RocketChat.models.Users.findOneById(Meteor.userId());                                                    // 39
    message.pinned = false;                                                                                       // 39
    message.pinnedBy = {                                                                                          // 39
      _id: Meteor.userId(),                                                                                       // 58
      username: me.username                                                                                       // 58
    };                                                                                                            //
    message = RocketChat.callbacks.run('beforeSaveMessage', message);                                             // 39
    return RocketChat.models.Messages.setPinnedByIdAndUserId(message._id, message.pinnedBy, message.pinned);      //
  }                                                                                                               //
});                                                                                                               //
                                                                                                                  //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/rocketchat_message-pin/server/publications/pinnedMessages.coffee.js                                   //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish('pinnedMessages', function(rid, limit) {                                                           // 1
  var cursorHandle, publication, user;                                                                            // 2
  if (limit == null) {                                                                                            //
    limit = 50;                                                                                                   //
  }                                                                                                               //
  if (!this.userId) {                                                                                             // 2
    return this.ready();                                                                                          // 3
  }                                                                                                               //
  publication = this;                                                                                             // 2
  user = RocketChat.models.Users.findOneById(this.userId);                                                        // 2
  if (!user) {                                                                                                    // 8
    return this.ready();                                                                                          // 9
  }                                                                                                               //
  cursorHandle = RocketChat.models.Messages.findPinnedByRoom(rid, {                                               // 2
    sort: {                                                                                                       // 11
      ts: -1                                                                                                      // 11
    },                                                                                                            //
    limit: limit                                                                                                  // 11
  }).observeChanges({                                                                                             //
    added: function(_id, record) {                                                                                // 12
      return publication.added('rocketchat_pinned_message', _id, record);                                         //
    },                                                                                                            //
    changed: function(_id, record) {                                                                              // 12
      return publication.changed('rocketchat_pinned_message', _id, record);                                       //
    },                                                                                                            //
    removed: function(_id) {                                                                                      // 12
      return publication.removed('rocketchat_pinned_message', _id);                                               //
    }                                                                                                             //
  });                                                                                                             //
  this.ready();                                                                                                   // 2
  return this.onStop(function() {                                                                                 //
    return cursorHandle.stop();                                                                                   //
  });                                                                                                             //
});                                                                                                               // 1
                                                                                                                  //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/rocketchat_message-pin/server/startup/indexes.coffee.js                                               //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function() {                                                                                       // 1
  return Meteor.defer(function() {                                                                                //
    return RocketChat.models.Messages.tryEnsureIndex({                                                            //
      'pinnedBy._id': 1                                                                                           // 3
    }, {                                                                                                          //
      sparse: 1                                                                                                   // 3
    });                                                                                                           //
  });                                                                                                             //
});                                                                                                               // 1
                                                                                                                  //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:message-pin'] = {};

})();

//# sourceMappingURL=rocketchat_message-pin.js.map
