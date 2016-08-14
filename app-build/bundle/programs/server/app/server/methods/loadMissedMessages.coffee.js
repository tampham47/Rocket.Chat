(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/loadMissedMessages.coffee.js                         //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  loadMissedMessages: function(rid, start) {                           // 2
    var fromId, options;                                               // 3
    if (!Meteor.userId()) {                                            // 3
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {   // 4
        method: 'loadMissedMessages'                                   // 4
      });                                                              //
    }                                                                  //
    fromId = Meteor.userId();                                          // 3
    if (!Meteor.call('canAccessRoom', rid, fromId)) {                  // 7
      return false;                                                    // 8
    }                                                                  //
    options = {                                                        // 3
      sort: {                                                          // 11
        ts: -1                                                         // 12
      }                                                                //
    };                                                                 //
    if (!RocketChat.settings.get('Message_ShowEditedStatus')) {        // 14
      options.fields = {                                               // 15
        'editedAt': 0                                                  // 15
      };                                                               //
    }                                                                  //
    return RocketChat.models.Messages.findVisibleByRoomIdAfterTimestamp(rid, start, options).fetch();
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=loadMissedMessages.coffee.js.map
