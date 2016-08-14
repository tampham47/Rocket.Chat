(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/loadHistory.coffee.js                                //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  loadHistory: function(rid, end, limit, ls) {                         // 2
    var firstMessage, firstUnread, fromId, messages, options, records, unreadMessages, unreadNotLoaded;
    if (limit == null) {                                               //
      limit = 20;                                                      //
    }                                                                  //
    if (!Meteor.userId()) {                                            // 3
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {   // 4
        method: 'loadHistory'                                          // 4
      });                                                              //
    }                                                                  //
    fromId = Meteor.userId();                                          // 3
    if (!Meteor.call('canAccessRoom', rid, fromId)) {                  // 7
      return false;                                                    // 8
    }                                                                  //
    options = {                                                        // 3
      sort: {                                                          // 11
        ts: -1                                                         // 12
      },                                                               //
      limit: limit                                                     // 11
    };                                                                 //
    if (!RocketChat.settings.get('Message_ShowEditedStatus')) {        // 15
      options.fields = {                                               // 16
        'editedAt': 0                                                  // 16
      };                                                               //
    }                                                                  //
    if (end != null) {                                                 // 18
      records = RocketChat.models.Messages.findVisibleByRoomIdBeforeTimestamp(rid, end, options).fetch();
    } else {                                                           //
      records = RocketChat.models.Messages.findVisibleByRoomId(rid, options).fetch();
    }                                                                  //
    messages = _.map(records, function(message) {                      // 3
      message.starred = _.findWhere(message.starred, {                 // 24
        _id: fromId                                                    // 24
      });                                                              //
      return message;                                                  // 25
    });                                                                //
    unreadNotLoaded = 0;                                               // 3
    if (ls != null) {                                                  // 29
      firstMessage = messages[messages.length - 1];                    // 30
      if ((firstMessage != null ? firstMessage.ts : void 0) > ls) {    // 31
        delete options.limit;                                          // 32
        unreadMessages = RocketChat.models.Messages.findVisibleByRoomIdBetweenTimestamps(rid, ls, firstMessage.ts, {
          limit: 1,                                                    // 33
          sort: {                                                      // 33
            ts: 1                                                      // 33
          }                                                            //
        });                                                            //
        firstUnread = unreadMessages.fetch()[0];                       // 32
        unreadNotLoaded = unreadMessages.count();                      // 32
      }                                                                //
    }                                                                  //
    return {                                                           // 37
      messages: messages,                                              // 37
      firstUnread: firstUnread,                                        // 37
      unreadNotLoaded: unreadNotLoaded                                 // 37
    };                                                                 //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=loadHistory.coffee.js.map
