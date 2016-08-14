(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/publications/subscription.coffee.js                          //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var fields,                                                            // 1
  slice = [].slice;                                                    //
                                                                       //
fields = {                                                             // 1
  t: 1,                                                                // 2
  ts: 1,                                                               // 2
  ls: 1,                                                               // 2
  name: 1,                                                             // 2
  rid: 1,                                                              // 2
  code: 1,                                                             // 2
  f: 1,                                                                // 2
  u: 1,                                                                // 2
  open: 1,                                                             // 2
  alert: 1,                                                            // 2
  roles: 1,                                                            // 2
  unread: 1,                                                           // 2
  archived: 1,                                                         // 2
  desktopNotifications: 1,                                             // 2
  desktopNotificationDuration: 1,                                      // 2
  mobilePushNotifications: 1,                                          // 2
  emailNotifications: 1,                                               // 2
  _updatedAt: 1                                                        // 2
};                                                                     //
                                                                       //
Meteor.methods({                                                       // 1
  'subscriptions/get': function() {                                    // 23
    var options;                                                       // 24
    if (!Meteor.userId()) {                                            // 24
      return [];                                                       // 25
    }                                                                  //
    this.unblock();                                                    // 24
    options = {                                                        // 24
      fields: fields                                                   // 30
    };                                                                 //
    return RocketChat.models.Subscriptions.findByUserId(Meteor.userId(), options).fetch();
  },                                                                   //
  'subscriptions/sync': function(updatedAt) {                          // 23
    var options;                                                       // 35
    if (!Meteor.userId()) {                                            // 35
      return {};                                                       // 36
    }                                                                  //
    this.unblock();                                                    // 35
    options = {                                                        // 35
      fields: fields                                                   // 41
    };                                                                 //
    return RocketChat.models.Subscriptions.dinamicFindChangesAfter('findByUserId', updatedAt, Meteor.userId(), options);
  }                                                                    //
});                                                                    //
                                                                       //
RocketChat.models.Subscriptions.on('change', function() {              // 1
  var args, i, len, record, records, results, type;                    // 47
  type = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
  records = RocketChat.models.Subscriptions.getChangedRecords(type, args[0], fields);
  results = [];                                                        // 49
  for (i = 0, len = records.length; i < len; i++) {                    //
    record = records[i];                                               //
    results.push(RocketChat.Notifications.notifyUser(record.u._id, 'subscriptions-changed', type, record));
  }                                                                    // 49
  return results;                                                      //
});                                                                    // 46
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=subscription.coffee.js.map
