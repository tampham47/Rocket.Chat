(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var moment = Package['momentjs:moment'].moment;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// packages/rocketchat_channel-settings-mail-messages/server/lib/startup.coffee.js                    //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function() {                                                                           // 1
  var permission;                                                                                     // 2
  permission = {                                                                                      // 2
    _id: 'mail-messages',                                                                             // 2
    roles: ['admin']                                                                                  // 2
  };                                                                                                  //
  return RocketChat.models.Permissions.upsert(permission._id, {                                       //
    $setOnInsert: permission                                                                          // 3
  });                                                                                                 //
});                                                                                                   // 1
                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// packages/rocketchat_channel-settings-mail-messages/server/methods/mailMessages.coffee.js           //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                      // 1
  'mailMessages': function(data) {                                                                    // 2
    var email, emails, footer, header, html, i, j, len, len1, localeFn, missing, name, ref, ref1, ref2, ref3, ref4, rfcMailPatternWithName, room, user, username;
    if (!Meteor.userId()) {                                                                           // 3
      throw new Meteor.Error('error-invalid-user', "Invalid user", {                                  // 4
        method: 'mailMessages'                                                                        // 4
      });                                                                                             //
    }                                                                                                 //
    check(data, Match.ObjectIncluding({                                                               // 3
      rid: String,                                                                                    // 6
      to_users: [String],                                                                             // 6
      to_emails: String,                                                                              // 6
      subject: String,                                                                                // 6
      messages: [String],                                                                             // 6
      language: String                                                                                // 6
    }));                                                                                              //
    room = Meteor.call('canAccessRoom', data.rid, Meteor.userId());                                   // 3
    if (!room) {                                                                                      // 9
      throw new Meteor.Error('error-invalid-room', "Invalid room", {                                  // 10
        method: 'mailMessages'                                                                        // 10
      });                                                                                             //
    }                                                                                                 //
    if (!RocketChat.authz.hasPermission(Meteor.userId(), 'mail-messages')) {                          // 12
      throw new Meteor.Error('error-action-not-allowed', 'Mailing is not allowed', {                  // 13
        method: 'mailMessages',                                                                       // 13
        action: 'Mailing'                                                                             // 13
      });                                                                                             //
    }                                                                                                 //
    rfcMailPatternWithName = /^(?:.*<)?([a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)(?:>?)$/;
    emails = _.compact(data.to_emails.trim().split(','));                                             // 3
    missing = [];                                                                                     // 3
    if (data.to_users.length > 0) {                                                                   // 19
      ref = data.to_users;                                                                            // 20
      for (i = 0, len = ref.length; i < len; i++) {                                                   // 20
        username = ref[i];                                                                            //
        user = RocketChat.models.Users.findOneByUsername(username);                                   // 21
        if (user != null ? (ref1 = user.emails) != null ? (ref2 = ref1[0]) != null ? ref2.address : void 0 : void 0 : void 0) {
          emails.push(user.emails[0].address);                                                        // 23
        } else {                                                                                      //
          missing.push(username);                                                                     // 25
        }                                                                                             //
      }                                                                                               // 20
    }                                                                                                 //
    console.log(emails);                                                                              // 3
    for (j = 0, len1 = emails.length; j < len1; j++) {                                                // 27
      email = emails[j];                                                                              //
      if (!rfcMailPatternWithName.test(email.trim())) {                                               // 28
        throw new Meteor.Error('error-invalid-email', "Invalid email " + email, {                     // 29
          method: 'mailMessages',                                                                     // 29
          email: email                                                                                // 29
        });                                                                                           //
      }                                                                                               //
    }                                                                                                 // 27
    user = Meteor.user();                                                                             // 3
    name = user.name;                                                                                 // 3
    email = (ref3 = user.emails) != null ? (ref4 = ref3[0]) != null ? ref4.address : void 0 : void 0;
    data.language = data.language.split('-').shift().toLowerCase();                                   // 3
    if (data.language !== 'en') {                                                                     // 37
      localeFn = Meteor.call('loadLocale', data.language);                                            // 38
      if (localeFn) {                                                                                 // 39
        Function(localeFn)();                                                                         // 40
      }                                                                                               //
    }                                                                                                 //
    html = "";                                                                                        // 3
    header = RocketChat.placeholders.replace(RocketChat.settings.get('Email_Header') || "");          // 3
    footer = RocketChat.placeholders.replace(RocketChat.settings.get('Email_Footer') || "");          // 3
    RocketChat.models.Messages.findByRoomIdAndMessageIds(data.rid, data.messages, {                   // 3
      sort: {                                                                                         // 47
        ts: 1                                                                                         // 47
      }                                                                                               //
    }).forEach(function(message) {                                                                    //
      var dateTime;                                                                                   // 48
      dateTime = moment(message.ts).locale(data.language).format('L LT');                             // 48
      return html += ("<p style='margin-bottom: 5px'><b>" + message.u.username + "</b> <span style='color: #aaa; font-size: 12px'>" + dateTime + "</span><br />") + RocketChat.Message.parse(message, data.language) + "</p>";
    });                                                                                               //
    Meteor.defer(function() {                                                                         // 3
      Email.send({                                                                                    // 52
        to: emails,                                                                                   // 53
        from: RocketChat.settings.get('From_Email'),                                                  // 53
        replyTo: email,                                                                               // 53
        subject: data.subject,                                                                        // 53
        html: header + html + footer                                                                  // 53
      });                                                                                             //
      return console.log('Sending email to ' + emails.join(', '));                                    //
    });                                                                                               //
    return {                                                                                          // 61
      success: true,                                                                                  // 61
      missing: missing                                                                                // 61
    };                                                                                                //
  }                                                                                                   //
});                                                                                                   //
                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:channel-settings-mail-messages'] = {};

})();

//# sourceMappingURL=rocketchat_channel-settings-mail-messages.js.map
