(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/setAvatarFromService.coffee.js                       //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  setAvatarFromService: function(dataURI, contentType, service) {      // 2
    var ars, aws, e, image, ref, result, rs, user, ws;                 // 3
    if (!Meteor.userId()) {                                            // 3
      throw new Meteor.Error('error-invalid-user', "Invalid user", {   // 4
        method: 'setAvatarFromService'                                 // 4
      });                                                              //
    }                                                                  //
    if (!RocketChat.settings.get("Accounts_AllowUserAvatarChange")) {  // 6
      throw new Meteor.Error('error-not-allowed', 'Not allowed', {     // 7
        method: 'setAvatarFromService'                                 // 7
      });                                                              //
    }                                                                  //
    user = Meteor.user();                                              // 3
    if (service === 'initials') {                                      // 11
      RocketChat.models.Users.setAvatarOrigin(user._id, service);      // 12
      return;                                                          // 13
    }                                                                  //
    if (service === 'url') {                                           // 15
      result = null;                                                   // 16
      try {                                                            // 18
        result = HTTP.get(dataURI, {                                   // 19
          npmRequestOptions: {                                         // 19
            encoding: 'binary'                                         // 19
          }                                                            //
        });                                                            //
      } catch (_error) {                                               //
        e = _error;                                                    // 21
        console.log("Error while handling the setting of the avatar from a url (" + dataURI + ") for " + user.username + ":", e);
        throw new Meteor.Error('error-avatar-url-handling', 'Error while handling avatar setting from a URL (' + dataURI(+') for ' + user.username, {
          method: 'setAvatarFromService',                              // 22
          url: dataURI,                                                // 22
          username: user.username                                      // 22
        }));                                                           //
      }                                                                //
      if (result.statusCode !== 200) {                                 // 24
        console.log("Not a valid response, " + result.statusCode + ", from the avatar url: " + dataURI);
        throw new Meteor.Error('error-avatar-invalid-url', 'Invalid avatar URL: ' + dataURI, {
          method: 'setAvatarFromService',                              // 26
          url: dataURI                                                 // 26
        });                                                            //
      }                                                                //
      if (!/image\/.+/.test(result.headers['content-type'])) {         // 28
        console.log("Not a valid content-type from the provided url, " + result.headers['content-type'] + ", from the avatar url: " + dataURI);
        throw new Meteor.Error('error-avatar-invalid-url', 'Invalid avatar URL: ' + dataURI, {
          method: 'setAvatarFromService',                              // 30
          url: dataURI                                                 // 30
        });                                                            //
      }                                                                //
      ars = RocketChatFile.bufferToStream(new Buffer(result.content, 'binary'));
      RocketChatFileAvatarInstance.deleteFile(encodeURIComponent(user.username + ".jpg"));
      aws = RocketChatFileAvatarInstance.createWriteStream(encodeURIComponent(user.username + ".jpg"), result.headers['content-type']);
      aws.on('end', Meteor.bindEnvironment(function() {                // 16
        return Meteor.setTimeout(function() {                          //
          console.log("Set " + user.username + "'s avatar from the url: " + dataURI);
          RocketChat.models.Users.setAvatarOrigin(user._id, service);  // 37
          return RocketChat.Notifications.notifyAll('updateAvatar', {  //
            username: user.username                                    // 39
          });                                                          //
        }, 500);                                                       //
      }));                                                             //
      ars.pipe(aws);                                                   // 16
      return;                                                          // 43
    }                                                                  //
    ref = RocketChatFile.dataURIParse(dataURI), image = ref.image, contentType = ref.contentType;
    rs = RocketChatFile.bufferToStream(new Buffer(image, 'base64'));   // 3
    RocketChatFileAvatarInstance.deleteFile(encodeURIComponent(user.username + ".jpg"));
    ws = RocketChatFileAvatarInstance.createWriteStream(encodeURIComponent(user.username + ".jpg"), contentType);
    ws.on('end', Meteor.bindEnvironment(function() {                   // 3
      return Meteor.setTimeout(function() {                            //
        RocketChat.models.Users.setAvatarOrigin(user._id, service);    // 52
        return RocketChat.Notifications.notifyAll('updateAvatar', {    //
          username: user.username                                      // 53
        });                                                            //
      }, 500);                                                         //
    }));                                                               //
    rs.pipe(ws);                                                       // 3
  }                                                                    //
});                                                                    //
                                                                       //
DDPRateLimiter.addRule({                                               // 1
  type: 'method',                                                      // 60
  name: 'setAvatarFromService',                                        // 60
  userId: function() {                                                 // 60
    return true;                                                       // 62
  }                                                                    //
}, 1, 5000);                                                           //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=setAvatarFromService.coffee.js.map
