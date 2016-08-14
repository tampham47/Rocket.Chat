(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var Logger = Package['rocketchat:logger'].Logger;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

/* Package-scope variables */
var logger, __coffeescriptShare;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/rocketchat_message-mark-as-unread/server/logger.js                                                    //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
/* globals logger:true */                                                                                         // 1
/* exported logger */                                                                                             // 2
                                                                                                                  // 3
logger = new Logger('MessageMarkAsUnread', {                                                                      // 4
	sections: {                                                                                                      // 5
		connection: 'Connection',                                                                                       // 6
		events: 'Events'                                                                                                // 7
	}                                                                                                                // 8
});                                                                                                               // 9
                                                                                                                  // 10
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/rocketchat_message-mark-as-unread/server/unreadMessages.coffee.js                                     //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                  // 1
  unreadMessages: function(firstUnreadMessage) {                                                                  // 2
    var lastSeen, originalMessage;                                                                                // 3
    if (!Meteor.userId()) {                                                                                       // 3
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                              // 4
        method: 'unreadMessages'                                                                                  // 4
      });                                                                                                         //
    }                                                                                                             //
    originalMessage = RocketChat.models.Messages.findOneById(firstUnreadMessage._id, {                            // 3
      fields: {                                                                                                   // 6
        u: 1,                                                                                                     // 6
        rid: 1,                                                                                                   // 6
        file: 1,                                                                                                  // 6
        ts: 1                                                                                                     // 6
      }                                                                                                           //
    });                                                                                                           //
    if (originalMessage == null) {                                                                                // 7
      throw new Meteor.Error('error-action-not-allowed', 'Not allowed', {                                         // 8
        method: 'unreadMessages',                                                                                 // 8
        action: 'Unread_messages'                                                                                 // 8
      });                                                                                                         //
    }                                                                                                             //
    if (Meteor.userId() === originalMessage.u._id) {                                                              // 10
      throw new Meteor.Error('error-action-not-allowed', 'Not allowed', {                                         // 11
        method: 'unreadMessages',                                                                                 // 11
        action: 'Unread_messages'                                                                                 // 11
      });                                                                                                         //
    }                                                                                                             //
    lastSeen = RocketChat.models.Subscriptions.findOneByRoomIdAndUserId(originalMessage.rid, Meteor.userId()).ls;
    if (firstUnreadMessage.ts >= lastSeen) {                                                                      // 14
      logger.connection.debug('Provided message is already marked as unread');                                    // 15
      return;                                                                                                     // 16
    }                                                                                                             //
    logger.connection.debug('Updating unread  message of ' + originalMessage.ts + ' as the first unread');        // 3
    return RocketChat.models.Subscriptions.setAsUnreadByRoomIdAndUserId(originalMessage.rid, Meteor.userId(), originalMessage.ts);
  }                                                                                                               //
});                                                                                                               //
                                                                                                                  //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:message-mark-as-unread'] = {};

})();

//# sourceMappingURL=rocketchat_message-mark-as-unread.js.map
