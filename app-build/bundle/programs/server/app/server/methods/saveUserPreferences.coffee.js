(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/saveUserPreferences.coffee.js                        //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  saveUserPreferences: function(settings) {                            // 2
    var preferences;                                                   // 3
    if (Meteor.userId()) {                                             // 3
      preferences = {};                                                // 4
      if (settings.language != null) {                                 // 6
        RocketChat.models.Users.setLanguage(Meteor.userId(), settings.language);
      }                                                                //
      if (settings.newRoomNotification != null) {                      // 9
        preferences.newRoomNotification = settings.newRoomNotification === "1" ? true : false;
      }                                                                //
      if (settings.newMessageNotification != null) {                   // 12
        preferences.newMessageNotification = settings.newMessageNotification === "1" ? true : false;
      }                                                                //
      if (settings.useEmojis != null) {                                // 15
        preferences.useEmojis = settings.useEmojis === "1" ? true : false;
      }                                                                //
      if (settings.convertAsciiEmoji != null) {                        // 18
        preferences.convertAsciiEmoji = settings.convertAsciiEmoji === "1" ? true : false;
      }                                                                //
      if (settings.saveMobileBandwidth != null) {                      // 21
        preferences.saveMobileBandwidth = settings.saveMobileBandwidth === "1" ? true : false;
      }                                                                //
      if (settings.collapseMediaByDefault != null) {                   // 24
        preferences.collapseMediaByDefault = settings.collapseMediaByDefault === "1" ? true : false;
      }                                                                //
      if (settings.unreadRoomsMode != null) {                          // 27
        preferences.unreadRoomsMode = settings.unreadRoomsMode === "1" ? true : false;
      }                                                                //
      if (settings.autoImageLoad != null) {                            // 30
        preferences.autoImageLoad = settings.autoImageLoad === "1" ? true : false;
      }                                                                //
      if (settings.emailNotificationMode != null) {                    // 33
        preferences.emailNotificationMode = settings.emailNotificationMode;
      }                                                                //
      if (settings.mergeChannels !== "-1") {                           // 36
        preferences.mergeChannels = settings.mergeChannels === "1";    // 37
      } else {                                                         //
        delete preferences.mergeChannels;                              // 39
      }                                                                //
      preferences.desktopNotificationDuration = settings.desktopNotificationDuration - 0;
      preferences.viewMode = settings.viewMode || 0;                   // 4
      preferences.hideUsernames = settings.hideUsernames === "1";      // 4
      preferences.hideAvatars = settings.hideAvatars === "1";          // 4
      preferences.hideFlexTab = settings.hideFlexTab === "1";          // 4
      preferences.highlights = settings.highlights;                    // 4
      RocketChat.models.Users.setPreferences(Meteor.userId(), preferences);
      return true;                                                     // 50
    }                                                                  //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=saveUserPreferences.coffee.js.map
