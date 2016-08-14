(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/publications/channelAutocomplete.coffee.js                   //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish('channelAutocomplete', function(name) {                 // 1
  var cursorHandle, hasPermission, options, pub, roomIds;              // 2
  if (!this.userId) {                                                  // 2
    return this.ready();                                               // 3
  }                                                                    //
  pub = this;                                                          // 2
  options = {                                                          // 2
    fields: {                                                          // 8
      _id: 1,                                                          // 9
      name: 1                                                          // 9
    },                                                                 //
    limit: 5,                                                          // 8
    sort: {                                                            // 8
      name: 1                                                          // 13
    }                                                                  //
  };                                                                   //
  roomIds = [];                                                        // 2
  if (!RocketChat.authz.hasPermission(this.userId, 'view-c-room') && RocketChat.authz.hasPermission(this.userId, 'view-joined-room')) {
    roomIds = _.pluck(RocketChat.models.Subscriptions.findByUserId(this.userId).fetch(), 'rid');
  }                                                                    //
  hasPermission = (function(_this) {                                   // 2
    return function(_id) {                                             //
      return RocketChat.authz.hasPermission(_this.userId, 'view-c-room') || (RocketChat.authz.hasPermission(_this.userId, 'view-joined-room') && roomIds.indexOf(_id) !== -1);
    };                                                                 //
  })(this);                                                            //
  cursorHandle = RocketChat.models.Rooms.findByNameContainingAndTypes(name, ['c'], options).observeChanges({
    added: function(_id, record) {                                     // 23
      if (hasPermission(_id)) {                                        // 24
        return pub.added('channel-autocomplete', _id, record);         //
      }                                                                //
    },                                                                 //
    changed: function(_id, record) {                                   // 23
      if (hasPermission(_id)) {                                        // 27
        return pub.changed('channel-autocomplete', _id, record);       //
      }                                                                //
    },                                                                 //
    removed: function(_id, record) {                                   // 23
      if (hasPermission(_id)) {                                        // 30
        return pub.removed('channel-autocomplete', _id, record);       //
      }                                                                //
    }                                                                  //
  });                                                                  //
  this.ready();                                                        // 2
  this.onStop(function() {                                             // 2
    return cursorHandle.stop();                                        //
  });                                                                  //
});                                                                    // 1
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=channelAutocomplete.coffee.js.map
