(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/loadNextMessages.coffee.js                           //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  loadNextMessages: function(rid, end, limit) {                        // 2
    var fromId, messages, options, records;                            // 3
    if (limit == null) {                                               //
      limit = 20;                                                      //
    }                                                                  //
    if (!Meteor.userId()) {                                            // 3
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {   // 4
        method: 'loadNextMessages'                                     // 4
      });                                                              //
    }                                                                  //
    fromId = Meteor.userId();                                          // 3
    if (!Meteor.call('canAccessRoom', rid, fromId)) {                  // 8
      return false;                                                    // 9
    }                                                                  //
    options = {                                                        // 3
      sort: {                                                          // 12
        ts: 1                                                          // 13
      },                                                               //
      limit: limit                                                     // 12
    };                                                                 //
    if (!RocketChat.settings.get('Message_ShowEditedStatus')) {        // 16
      options.fields = {                                               // 17
        'editedAt': 0                                                  // 17
      };                                                               //
    }                                                                  //
    if (end != null) {                                                 // 19
      records = RocketChat.models.Messages.findVisibleByRoomIdAfterTimestamp(rid, end, options).fetch();
    } else {                                                           //
      records = RocketChat.models.Messages.findVisibleByRoomId(rid, options).fetch();
    }                                                                  //
    messages = _.map(records, function(message) {                      // 3
      message.starred = _.findWhere(message.starred, {                 // 25
        _id: fromId                                                    // 25
      });                                                              //
      return message;                                                  // 26
    });                                                                //
    return {                                                           // 28
      messages: messages                                               // 28
    };                                                                 //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=loadNextMessages.coffee.js.map
