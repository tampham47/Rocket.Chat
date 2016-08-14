(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/stream/messages.coffee.js                                    //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var slice = [].slice;                                                  // 1
                                                                       //
this.msgStream = new Meteor.Streamer('room-messages');                 // 1
                                                                       //
msgStream.allowWrite('none');                                          // 1
                                                                       //
msgStream.allowRead(function(eventName) {                              // 1
  var e;                                                               // 6
  try {                                                                // 6
    if (!Meteor.call('canAccessRoom', eventName, this.userId)) {       // 7
      return false;                                                    // 7
    }                                                                  //
    return true;                                                       // 9
  } catch (_error) {                                                   //
    e = _error;                                                        // 11
    return false;                                                      // 11
  }                                                                    //
});                                                                    // 5
                                                                       //
msgStream.allowRead('__my_messages__', 'all');                         // 1
                                                                       //
msgStream.allowEmit('__my_messages__', function(eventName, msg, options) {
  var e, room;                                                         // 16
  try {                                                                // 16
    room = Meteor.call('canAccessRoom', msg.rid, this.userId);         // 17
    if (!room) {                                                       // 18
      return false;                                                    // 19
    }                                                                  //
    options.roomParticipant = room.usernames.indexOf(room.username) > -1;
    options.roomType = room.t;                                         // 17
    return true;                                                       // 24
  } catch (_error) {                                                   //
    e = _error;                                                        // 26
    return false;                                                      // 26
  }                                                                    //
});                                                                    // 15
                                                                       //
Meteor.startup(function() {                                            // 1
  var fields;                                                          // 30
  fields = void 0;                                                     // 30
  if (!RocketChat.settings.get('Message_ShowEditedStatus')) {          // 32
    fields = {                                                         // 33
      'editedAt': 0                                                    // 33
    };                                                                 //
  }                                                                    //
  return RocketChat.models.Messages.on('change', function() {          //
    var args, i, len, record, records, results, type;                  // 36
    type = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    records = RocketChat.models.Messages.getChangedRecords(type, args[0], fields);
    results = [];                                                      // 38
    for (i = 0, len = records.length; i < len; i++) {                  //
      record = records[i];                                             //
      if (record._hidden !== true) {                                   // 39
        msgStream.emit('__my_messages__', record, {});                 // 40
        results.push(msgStream.emit(record.rid, record));              // 40
      } else {                                                         //
        results.push(void 0);                                          //
      }                                                                //
    }                                                                  // 38
    return results;                                                    //
  });                                                                  //
});                                                                    // 29
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=messages.coffee.js.map
