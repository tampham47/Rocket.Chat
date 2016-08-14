(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var DDPRateLimiter = Package['ddp-rate-limiter'].DDPRateLimiter;
var FlowRouter = Package['kadira:flow-router'].FlowRouter;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

/* Package-scope variables */
var __coffeescriptShare, Mailer;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/rocketchat_mailer/lib/Mailer.coffee.js                                                         //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
                                                                                                           // 1
                                                                                                           //
Mailer = {};                                                                                               // 1
                                                                                                           //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/rocketchat_mailer/server/startup.coffee.js                                                     //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function() {                                                                                // 1
  return RocketChat.models.Permissions.upsert('access-mailer', {                                           //
    $setOnInsert: {                                                                                        // 2
      _id: 'access-mailer',                                                                                // 2
      roles: ['admin']                                                                                     // 2
    }                                                                                                      //
  });                                                                                                      //
});                                                                                                        // 1
                                                                                                           //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/rocketchat_mailer/server/models/Users.coffee.js                                                //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.models.Users.RocketMailUnsubscribe = function(_id, createdAt) {                                 // 3
  var affectedRows, query, update;                                                                         // 5
  query = {                                                                                                // 5
    _id: _id,                                                                                              // 6
    createdAt: new Date(parseInt(createdAt))                                                               // 6
  };                                                                                                       //
  update = {                                                                                               // 5
    $set: {                                                                                                // 10
      "mailer.unsubscribed": true                                                                          // 11
    }                                                                                                      //
  };                                                                                                       //
  affectedRows = this.update(query, update);                                                               // 5
  console.log('[Mailer:Unsubscribe]', _id, createdAt, new Date(parseInt(createdAt)), affectedRows);        // 5
  return affectedRows;                                                                                     // 17
};                                                                                                         // 3
                                                                                                           //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/rocketchat_mailer/server/functions/sendMail.coffee.js                                          //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Mailer.sendMail = function(from, subject, body, dryrun, query) {                                           // 1
  var footer, header, rfcMailPatternWithName, userQuery;                                                   // 3
  rfcMailPatternWithName = /^(?:.*<)?([a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)(?:>?)$/;
  if (!rfcMailPatternWithName.test(from)) {                                                                // 6
    throw new Meteor.Error('error-invalid-from-address', 'Invalid from address', {                         // 7
      "function": 'Mailer.sendMail'                                                                        // 7
    });                                                                                                    //
  }                                                                                                        //
  if (body.indexOf('[unsubscribe]') === -1) {                                                              // 9
    throw new Meteor.Error('error-missing-unsubscribe-link', 'You must provide the [unsubscribe] link.', {
      "function": 'Mailer.sendMail'                                                                        // 10
    });                                                                                                    //
  }                                                                                                        //
  header = RocketChat.placeholders.replace(RocketChat.settings.get('Email_Header') || '');                 // 3
  footer = RocketChat.placeholders.replace(RocketChat.settings.get('Email_Footer') || '');                 // 3
  userQuery = {                                                                                            // 3
    "mailer.unsubscribed": {                                                                               // 15
      $exists: 0                                                                                           // 15
    }                                                                                                      //
  };                                                                                                       //
  if (query) {                                                                                             // 16
    userQuery = {                                                                                          // 17
      $and: [userQuery, EJSON.parse(query)]                                                                // 17
    };                                                                                                     //
  }                                                                                                        //
  if (dryrun) {                                                                                            // 19
    return Meteor.users.find({                                                                             //
      "emails.address": from                                                                               // 20
    }).forEach(function(user) {                                                                            //
      var email, html, ref, ref1;                                                                          // 22
      email = (ref = user.emails) != null ? (ref1 = ref[0]) != null ? ref1.address : void 0 : void 0;      // 22
      html = RocketChat.placeholders.replace(body, {                                                       // 22
        unsubscribe: Meteor.absoluteUrl(FlowRouter.path('mailer/unsubscribe/:_id/:createdAt', {            // 24
          _id: user._id,                                                                                   // 25
          createdAt: user.createdAt.getTime()                                                              // 25
        })),                                                                                               //
        name: user.name,                                                                                   // 24
        email: email                                                                                       // 24
      });                                                                                                  //
      email = user.name + " <" + email + ">";                                                              // 22
      if (rfcMailPatternWithName.test(email)) {                                                            // 32
        Meteor.defer(function() {                                                                          // 33
          return Email.send({                                                                              //
            to: email,                                                                                     // 35
            from: from,                                                                                    // 35
            subject: subject,                                                                              // 35
            html: header + html + footer                                                                   // 35
          });                                                                                              //
        });                                                                                                //
        return console.log('Sending email to ' + email);                                                   //
      }                                                                                                    //
    });                                                                                                    //
  } else {                                                                                                 //
    return Meteor.users.find({                                                                             //
      "mailer.unsubscribed": {                                                                             // 43
        $exists: 0                                                                                         // 43
      }                                                                                                    //
    }).forEach(function(user) {                                                                            //
      var email, html, ref, ref1;                                                                          // 45
      email = (ref = user.emails) != null ? (ref1 = ref[0]) != null ? ref1.address : void 0 : void 0;      // 45
      html = RocketChat.placeholders.replace(body, {                                                       // 45
        unsubscribe: Meteor.absoluteUrl(FlowRouter.path('mailer/unsubscribe/:_id/:createdAt', {            // 47
          _id: user._id,                                                                                   // 48
          createdAt: user.createdAt.getTime()                                                              // 48
        })),                                                                                               //
        name: user.name,                                                                                   // 47
        email: email                                                                                       // 47
      });                                                                                                  //
      email = user.name + " <" + email + ">";                                                              // 45
      if (rfcMailPatternWithName.test(email)) {                                                            // 55
        Meteor.defer(function() {                                                                          // 56
          return Email.send({                                                                              //
            to: email,                                                                                     // 58
            from: from,                                                                                    // 58
            subject: subject,                                                                              // 58
            html: header + html + footer                                                                   // 58
          });                                                                                              //
        });                                                                                                //
        return console.log('Sending email to ' + email);                                                   //
      }                                                                                                    //
    });                                                                                                    //
  }                                                                                                        //
};                                                                                                         // 1
                                                                                                           //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/rocketchat_mailer/server/functions/unsubscribe.coffee.js                                       //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Mailer.unsubscribe = function(_id, createdAt) {                                                            // 1
  if (_id && createdAt) {                                                                                  // 2
    return RocketChat.models.Users.RocketMailUnsubscribe(_id, createdAt) === 1;                            // 3
  }                                                                                                        //
  return false;                                                                                            // 4
};                                                                                                         // 1
                                                                                                           //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/rocketchat_mailer/server/methods/sendMail.coffee.js                                            //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                           // 1
  'Mailer.sendMail': function(from, subject, body, dryrun, query) {                                        // 2
    if (!Meteor.userId()) {                                                                                // 3
      throw new Meteor.Error('error-invalid-user', "Invalid user", {                                       // 4
        method: 'Mailer.sendMail'                                                                          // 4
      });                                                                                                  //
    }                                                                                                      //
    if (RocketChat.authz.hasRole(Meteor.userId(), 'admin') !== true) {                                     // 6
      throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                         // 7
        method: 'Mailer.sendMail'                                                                          // 7
      });                                                                                                  //
    }                                                                                                      //
    return Mailer.sendMail(from, subject, body, dryrun, query);                                            // 9
  }                                                                                                        //
});                                                                                                        //
                                                                                                           //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/rocketchat_mailer/server/methods/unsubscribe.coffee.js                                         //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                           // 1
  'Mailer:unsubscribe': function(_id, createdAt) {                                                         // 2
    return Mailer.unsubscribe(_id, createdAt);                                                             // 3
  }                                                                                                        //
});                                                                                                        //
                                                                                                           //
DDPRateLimiter.addRule({                                                                                   // 1
  type: 'method',                                                                                          // 7
  name: 'Mailer:unsubscribe',                                                                              // 7
  connectionId: function() {                                                                               // 7
    return true;                                                                                           // 9
  }                                                                                                        //
}, 1, 60000);                                                                                              //
                                                                                                           //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:mailer'] = {
  Mailer: Mailer
};

})();

//# sourceMappingURL=rocketchat_mailer.js.map
