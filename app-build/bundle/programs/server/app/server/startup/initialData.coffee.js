(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/initialData.coffee.js                                //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function() {                                            // 1
  return Meteor.defer(function() {                                     //
    var adminUser, id, nameValidation, oldestUser, re, rs, ws;         // 4
    if (RocketChat.models.Rooms.findOneById('GENERAL') == null) {      // 4
      RocketChat.models.Rooms.createWithIdTypeAndName('GENERAL', 'c', 'general', {
        "default": true                                                // 6
      });                                                              //
    }                                                                  //
    if (RocketChat.models.Users.findOneById('rocket.cat') == null) {   // 8
      RocketChat.models.Users.create({                                 // 9
        _id: 'rocket.cat',                                             // 10
        name: "Rocket.Cat",                                            // 10
        username: 'rocket.cat',                                        // 10
        status: "online",                                              // 10
        statusDefault: "online",                                       // 10
        utcOffset: 0,                                                  // 10
        active: true,                                                  // 10
        type: 'bot'                                                    // 10
      });                                                              //
      RocketChat.authz.addUserRoles('rocket.cat', 'bot');              // 9
      rs = RocketChatFile.bufferToStream(new Buffer(Assets.getBinary('avatars/rocketcat.png'), 'utf8'));
      RocketChatFileAvatarInstance.deleteFile("rocket.cat.jpg");       // 9
      ws = RocketChatFileAvatarInstance.createWriteStream("rocket.cat.jpg", 'image/png');
      ws.on('end', Meteor.bindEnvironment(function() {                 // 9
        return RocketChat.models.Users.setAvatarOrigin('rocket.cat', 'local');
      }));                                                             //
      rs.pipe(ws);                                                     // 9
    }                                                                  //
    if (process.env.ADMIN_PASS != null) {                              // 30
      if (_.isEmpty(RocketChat.authz.getUsersInRole('admin').fetch())) {
        console.log('Inserting admin user:'.green);                    // 32
        adminUser = {                                                  // 32
          name: "Administrator",                                       // 35
          username: "admin",                                           // 35
          status: "offline",                                           // 35
          statusDefault: "online",                                     // 35
          utcOffset: 0,                                                // 35
          active: true                                                 // 35
        };                                                             //
        if (process.env.ADMIN_NAME != null) {                          // 42
          adminUser.name = process.env.ADMIN_NAME;                     // 43
        }                                                              //
        console.log(("Name: " + adminUser.name).green);                // 32
        if (process.env.ADMIN_EMAIL != null) {                         // 46
          re = /^[^@].*@[^@]+$/i;                                      // 47
          if (re.test(process.env.ADMIN_EMAIL)) {                      // 48
            if (!RocketChat.models.Users.findOneByEmailAddress(process.env.ADMIN_EMAIL)) {
              adminUser.emails = [                                     // 50
                {                                                      //
                  address: process.env.ADMIN_EMAIL,                    // 51
                  verified: true                                       // 51
                }                                                      //
              ];                                                       //
              console.log(("Email: " + process.env.ADMIN_EMAIL).green);
            } else {                                                   //
              console.log('Email provided already exists; Ignoring environment variables ADMIN_EMAIL'.red);
            }                                                          //
          } else {                                                     //
            console.log('Email provided is invalid; Ignoring environment variables ADMIN_EMAIL'.red);
          }                                                            //
        }                                                              //
        if (process.env.ADMIN_USERNAME != null) {                      // 60
          try {                                                        // 61
            nameValidation = new RegExp('^' + RocketChat.settings.get('UTF8_Names_Validation') + '$');
          } catch (_error) {                                           //
            nameValidation = new RegExp('^[0-9a-zA-Z-_.]+$');          // 64
          }                                                            //
          if (nameValidation.test(process.env.ADMIN_USERNAME)) {       // 65
            if (RocketChat.checkUsernameAvailability(process.env.ADMIN_USERNAME)) {
              adminUser.username = process.env.ADMIN_USERNAME;         // 67
            } else {                                                   //
              console.log('Username provided already exists; Ignoring environment variables ADMIN_USERNAME'.red);
            }                                                          //
          } else {                                                     //
            console.log('Username provided is invalid; Ignoring environment variables ADMIN_USERNAME'.red);
          }                                                            //
        }                                                              //
        console.log(("Username: " + adminUser.username).green);        // 32
        adminUser.type = 'user';                                       // 32
        id = RocketChat.models.Users.create(adminUser);                // 32
        Accounts.setPassword(id, process.env.ADMIN_PASS);              // 32
        console.log(("Password: " + process.env.ADMIN_PASS).green);    // 32
        RocketChat.authz.addUserRoles(id, 'admin');                    // 32
      } else {                                                         //
        console.log('Users with admin role already exist; Ignoring environment variables ADMIN_PASS'.red);
      }                                                                //
    }                                                                  //
    if (_.isEmpty(RocketChat.authz.getUsersInRole('admin').fetch())) {
      oldestUser = RocketChat.models.Users.findOne({                   // 88
        _id: {                                                         // 88
          $ne: 'rocket.cat'                                            // 88
        }                                                              //
      }, {                                                             //
        fields: {                                                      // 88
          username: 1                                                  // 88
        },                                                             //
        sort: {                                                        // 88
          createdAt: 1                                                 // 88
        }                                                              //
      });                                                              //
      if (oldestUser) {                                                // 89
        RocketChat.authz.addUserRoles(oldestUser._id, 'admin');        // 90
        return console.log("No admins are found. Set " + oldestUser.username + " as admin for being the oldest user");
      }                                                                //
    }                                                                  //
  });                                                                  //
});                                                                    // 1
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=initialData.coffee.js.map
