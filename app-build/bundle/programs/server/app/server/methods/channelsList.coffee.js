(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/channelsList.coffee.js                               //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  channelsList: function(filter, channelType, limit, sort) {           // 2
    var globalPref, mergeChannels, options, ref, ref1, ref2, roomIds, roomTypes, userPref;
    if (!Meteor.userId()) {                                            // 3
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {   // 4
        method: 'channelsList'                                         // 4
      });                                                              //
    }                                                                  //
    options = {                                                        // 3
      fields: {                                                        // 6
        name: 1,                                                       // 6
        t: 1                                                           // 6
      },                                                               //
      sort: {                                                          // 6
        msgs: -1                                                       // 6
      }                                                                //
    };                                                                 //
    if (_.isNumber(limit)) {                                           // 7
      options.limit = limit;                                           // 8
    }                                                                  //
    if (_.trim(sort)) {                                                // 9
      switch (sort) {                                                  // 10
        case 'name':                                                   // 10
          options.sort = {                                             // 12
            name: 1                                                    // 12
          };                                                           //
          break;                                                       // 11
        case 'msgs':                                                   // 10
          options.sort = {                                             // 14
            msgs: -1                                                   // 14
          };                                                           //
      }                                                                // 10
    }                                                                  //
    roomTypes = [];                                                    // 3
    if (channelType !== 'private') {                                   // 17
      if (RocketChat.authz.hasPermission(Meteor.userId(), 'view-c-room')) {
        roomTypes.push({                                               // 19
          type: 'c'                                                    // 19
        });                                                            //
      } else if (RocketChat.authz.hasPermission(Meteor.userId(), 'view-joined-room')) {
        roomIds = _.pluck(RocketChat.models.Subscriptions.findByTypeAndUserId('c', Meteor.userId()).fetch(), 'rid');
        roomTypes.push({                                               // 21
          type: 'c',                                                   // 22
          ids: roomIds                                                 // 22
        });                                                            //
      }                                                                //
    }                                                                  //
    if (channelType !== 'public' && RocketChat.authz.hasPermission(Meteor.userId(), 'view-p-room')) {
      userPref = (ref = Meteor.user()) != null ? (ref1 = ref.settings) != null ? (ref2 = ref1.preferences) != null ? ref2.mergeChannels : void 0 : void 0 : void 0;
      globalPref = RocketChat.settings.get('UI_Merge_Channels_Groups');
      mergeChannels = userPref != null ? userPref : globalPref;        // 25
      if (mergeChannels) {                                             // 28
        roomTypes.push({                                               // 29
          type: 'p',                                                   // 29
          username: Meteor.user().username                             // 29
        });                                                            //
      }                                                                //
    }                                                                  //
    if (roomTypes.length) {                                            // 31
      if (filter) {                                                    // 32
        return {                                                       // 33
          channels: RocketChat.models.Rooms.findByNameContainingTypesWithUsername(filter, roomTypes, options).fetch()
        };                                                             //
      } else {                                                         //
        return {                                                       // 35
          channels: RocketChat.models.Rooms.findContainingTypesWithUsername(roomTypes, options).fetch()
        };                                                             //
      }                                                                //
    } else {                                                           //
      return {                                                         // 37
        channels: []                                                   // 37
      };                                                               //
    }                                                                  //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=channelsList.coffee.js.map
