(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/loadSurroundingMessages.coffee.js                    //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  loadSurroundingMessages: function(message, limit) {                  // 2
    var afterMessages, fromId, messages, moreAfter, moreBefore, options, records;
    if (limit == null) {                                               //
      limit = 50;                                                      //
    }                                                                  //
    if (!Meteor.userId()) {                                            // 3
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {   // 4
        method: 'loadSurroundingMessages'                              // 4
      });                                                              //
    }                                                                  //
    fromId = Meteor.userId();                                          // 3
    if (!message._id) {                                                // 8
      return false;                                                    // 9
    }                                                                  //
    message = RocketChat.models.Messages.findOneById(message._id);     // 3
    if (!(message != null ? message.rid : void 0)) {                   // 13
      return false;                                                    // 14
    }                                                                  //
    if (!Meteor.call('canAccessRoom', message.rid, fromId)) {          // 16
      return false;                                                    // 17
    }                                                                  //
    limit = limit - 1;                                                 // 3
    options = {                                                        // 3
      sort: {                                                          // 22
        ts: -1                                                         // 23
      },                                                               //
      limit: Math.ceil(limit / 2)                                      // 22
    };                                                                 //
    if (!RocketChat.settings.get('Message_ShowEditedStatus')) {        // 26
      options.fields = {                                               // 27
        'editedAt': 0                                                  // 27
      };                                                               //
    }                                                                  //
    records = RocketChat.models.Messages.findVisibleByRoomIdBeforeTimestamp(message.rid, message.ts, options).fetch();
    messages = _.map(records, function(message) {                      // 3
      message.starred = _.findWhere(message.starred, {                 // 31
        _id: fromId                                                    // 31
      });                                                              //
      return message;                                                  // 32
    });                                                                //
    moreBefore = messages.length === options.limit;                    // 3
    messages.push(message);                                            // 3
    options.sort = {                                                   // 3
      ts: 1                                                            // 38
    };                                                                 //
    options.limit = Math.floor(limit / 2);                             // 3
    records = RocketChat.models.Messages.findVisibleByRoomIdAfterTimestamp(message.rid, message.ts, options).fetch();
    afterMessages = _.map(records, function(message) {                 // 3
      message.starred = _.findWhere(message.starred, {                 // 43
        _id: fromId                                                    // 43
      });                                                              //
      return message;                                                  // 44
    });                                                                //
    moreAfter = afterMessages.length === options.limit;                // 3
    messages = messages.concat(afterMessages);                         // 3
    return {                                                           // 50
      messages: messages,                                              // 50
      moreBefore: moreBefore,                                          // 50
      moreAfter: moreAfter                                             // 50
    };                                                                 //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=loadSurroundingMessages.coffee.js.map
