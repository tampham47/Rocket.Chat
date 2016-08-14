(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_channel-settings/server/functions/saveRoomType.coffee.js                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.saveRoomType = function(rid, roomType) {                                                                   // 1
  if (!Match.test(rid, String)) {                                                                                     // 2
    throw new Meteor.Error('invalid-room', 'Invalid room', {                                                          // 3
      "function": 'RocketChat.saveRoomType'                                                                           // 3
    });                                                                                                               //
  }                                                                                                                   //
  if (roomType !== 'c' && roomType !== 'p') {                                                                         // 5
    throw new Meteor.Error('error-invalid-room-type', 'error-invalid-room-type', {                                    // 6
      type: roomType                                                                                                  // 6
    });                                                                                                               //
  }                                                                                                                   //
  return RocketChat.models.Rooms.setTypeById(rid, roomType) && RocketChat.models.Subscriptions.updateTypeByRoomId(rid, roomType);
};                                                                                                                    // 1
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_channel-settings/server/functions/saveRoomTopic.coffee.js                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.saveRoomTopic = function(rid, roomTopic, user) {                                                           // 1
  var update;                                                                                                         // 2
  if (!Match.test(rid, String)) {                                                                                     // 2
    throw new Meteor.Error('invalid-room', 'Invalid room', {                                                          // 3
      "function": 'RocketChat.saveRoomTopic'                                                                          // 3
    });                                                                                                               //
  }                                                                                                                   //
  roomTopic = s.escapeHTML(roomTopic);                                                                                // 2
  update = RocketChat.models.Rooms.setTopicById(rid, roomTopic);                                                      // 2
  RocketChat.models.Messages.createRoomSettingsChangedWithTypeRoomIdMessageAndUser('room_changed_topic', rid, roomTopic, user);
  return update;                                                                                                      // 11
};                                                                                                                    // 1
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_channel-settings/server/functions/saveRoomName.coffee.js                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.saveRoomName = function(rid, name) {                                                                       // 1
  var nameValidation, ref, room;                                                                                      // 2
  if (!Meteor.userId()) {                                                                                             // 2
    throw new Meteor.Error('error-invalid-user', "Invalid user", {                                                    // 3
      "function": 'RocketChat.saveRoomName'                                                                           // 3
    });                                                                                                               //
  }                                                                                                                   //
  room = RocketChat.models.Rooms.findOneById(rid);                                                                    // 2
  if ((ref = room.t) !== 'c' && ref !== 'p') {                                                                        // 7
    throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                                      // 8
      "function": 'RocketChat.saveRoomName'                                                                           // 8
    });                                                                                                               //
  }                                                                                                                   //
  if (!RocketChat.authz.hasPermission(Meteor.userId(), 'edit-room', rid)) {                                           // 10
    throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                                      // 11
      "function": 'RocketChat.saveRoomName'                                                                           // 11
    });                                                                                                               //
  }                                                                                                                   //
  try {                                                                                                               // 13
    nameValidation = new RegExp('^' + RocketChat.settings.get('UTF8_Names_Validation') + '$');                        // 14
  } catch (_error) {                                                                                                  //
    nameValidation = new RegExp('^[0-9a-zA-Z-_.]+$');                                                                 // 16
  }                                                                                                                   //
  if (!nameValidation.test(name)) {                                                                                   // 18
    throw new Meteor.Error('error-invalid-room-name', name + ' is not a valid room name. Use only letters, numbers, hyphens and underscores', {
      "function": 'RocketChat.saveRoomName',                                                                          // 19
      room_name: name                                                                                                 // 19
    });                                                                                                               //
  }                                                                                                                   //
  if (name === room.name) {                                                                                           // 24
    return;                                                                                                           // 25
  }                                                                                                                   //
  if (RocketChat.models.Rooms.findOneByName(name)) {                                                                  // 28
    throw new Meteor.Error('error-duplicate-channel-name', 'A channel with name \'' + name + '\' exists', {           // 29
      "function": 'RocketChat.saveRoomName',                                                                          // 29
      channel_name: name                                                                                              // 29
    });                                                                                                               //
  }                                                                                                                   //
  RocketChat.models.Rooms.setNameById(rid, name);                                                                     // 2
  RocketChat.models.Subscriptions.updateNameAndAlertByRoomId(rid, name);                                              // 2
  return name;                                                                                                        // 34
};                                                                                                                    // 1
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_channel-settings/server/functions/saveRoomDescription.coffee.js                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.saveRoomDescription = function(rid, roomDescription, user) {                                               // 1
  var update;                                                                                                         // 2
  if (!Match.test(rid, String)) {                                                                                     // 2
    throw new Meteor.Error('invalid-room', 'Invalid room', {                                                          // 3
      "function": 'RocketChat.saveRoomDescription'                                                                    // 3
    });                                                                                                               //
  }                                                                                                                   //
  roomDescription = s.escapeHTML(roomDescription);                                                                    // 2
  update = RocketChat.models.Rooms.setDescriptionById(rid, roomDescription);                                          // 2
  RocketChat.models.Messages.createRoomSettingsChangedWithTypeRoomIdMessageAndUser('room_changed_description', rid, roomDescription, user);
  return update;                                                                                                      // 11
};                                                                                                                    // 1
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_channel-settings/server/methods/saveRoomSettings.coffee.js                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                      // 1
  saveRoomSettings: function(rid, setting, value) {                                                                   // 2
    var message, name, room;                                                                                          // 3
    if (!Match.test(rid, String)) {                                                                                   // 3
      throw new Meteor.Error('error-invalid-room', 'Invalid room', {                                                  // 4
        method: 'saveRoomSettings'                                                                                    // 4
      });                                                                                                             //
    }                                                                                                                 //
    if (setting !== 'roomName' && setting !== 'roomTopic' && setting !== 'roomDescription' && setting !== 'roomType' && setting !== 'default') {
      throw new Meteor.Error('error-invalid-settings', 'Invalid settings provided', {                                 // 7
        method: 'saveRoomSettings'                                                                                    // 7
      });                                                                                                             //
    }                                                                                                                 //
    if (!RocketChat.authz.hasPermission(Meteor.userId(), 'edit-room', rid)) {                                         // 9
      throw new Meteor.Error('error-action-not-allowed', 'Editing room is not allowed', {                             // 10
        method: 'saveRoomSettings',                                                                                   // 10
        action: 'Editing_room'                                                                                        // 10
      });                                                                                                             //
    }                                                                                                                 //
    if (setting === 'default' && !RocketChat.authz.hasPermission(this.userId, 'view-room-administration')) {          // 12
      throw new Meteor.Error('error-action-not-allowed', 'Viewing room administration is not allowed', {              // 13
        method: 'saveRoomSettings',                                                                                   // 13
        action: 'Viewing_room_administration'                                                                         // 13
      });                                                                                                             //
    }                                                                                                                 //
    room = RocketChat.models.Rooms.findOneById(rid);                                                                  // 3
    if (room != null) {                                                                                               // 16
      switch (setting) {                                                                                              // 17
        case 'roomName':                                                                                              // 17
          name = RocketChat.saveRoomName(rid, value);                                                                 // 19
          RocketChat.models.Messages.createRoomRenamedWithRoomIdRoomNameAndUser(rid, name, Meteor.user());            // 19
          break;                                                                                                      // 18
        case 'roomTopic':                                                                                             // 17
          if (value !== room.topic) {                                                                                 // 22
            RocketChat.saveRoomTopic(rid, value, Meteor.user());                                                      // 23
          }                                                                                                           //
          break;                                                                                                      // 21
        case 'roomDescription':                                                                                       // 17
          if (value !== room.description) {                                                                           // 25
            RocketChat.saveRoomDescription(rid, value, Meteor.user());                                                // 26
          }                                                                                                           //
          break;                                                                                                      // 24
        case 'roomType':                                                                                              // 17
          if (value !== room.t) {                                                                                     // 28
            RocketChat.saveRoomType(rid, value, Meteor.user());                                                       // 29
            if (value === 'c') {                                                                                      // 30
              message = TAPi18n.__('Channel');                                                                        // 31
            } else {                                                                                                  //
              message = TAPi18n.__('Private_Group');                                                                  // 33
            }                                                                                                         //
            RocketChat.models.Messages.createRoomSettingsChangedWithTypeRoomIdMessageAndUser('room_changed_privacy', rid, message, Meteor.user());
          }                                                                                                           //
          break;                                                                                                      // 27
        case 'default':                                                                                               // 17
          RocketChat.models.Rooms.saveDefaultById(rid, value);                                                        // 36
      }                                                                                                               // 17
    }                                                                                                                 //
    return {                                                                                                          // 38
      result: true,                                                                                                   // 38
      rid: room._id                                                                                                   // 38
    };                                                                                                                //
  }                                                                                                                   //
});                                                                                                                   //
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_channel-settings/server/models/Messages.coffee.js                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.models.Messages.createRoomSettingsChangedWithTypeRoomIdMessageAndUser = function(type, roomId, message, user, extraData) {
  return this.createWithTypeRoomIdMessageAndUser(type, roomId, message, user, extraData);                             // 2
};                                                                                                                    // 1
                                                                                                                      //
RocketChat.models.Messages.createRoomRenamedWithRoomIdRoomNameAndUser = function(roomId, roomName, user, extraData) {
  return this.createWithTypeRoomIdMessageAndUser('r', roomId, roomName, user, extraData);                             // 5
};                                                                                                                    // 4
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_channel-settings/server/models/Rooms.coffee.js                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.models.Rooms.setDescriptionById = function(_id, description) {                                             // 1
  var query, update;                                                                                                  // 2
  query = {                                                                                                           // 2
    _id: _id                                                                                                          // 3
  };                                                                                                                  //
  update = {                                                                                                          // 2
    $set: {                                                                                                           // 6
      description: description                                                                                        // 7
    }                                                                                                                 //
  };                                                                                                                  //
  return this.update(query, update);                                                                                  // 9
};                                                                                                                    // 1
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:channel-settings'] = {};

})();

//# sourceMappingURL=rocketchat_channel-settings.js.map
