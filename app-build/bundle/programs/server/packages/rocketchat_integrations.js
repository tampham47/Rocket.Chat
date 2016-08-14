(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var ECMAScript = Package.ecmascript.ECMAScript;
var Babel = Package['babel-compiler'].Babel;
var BabelCompiler = Package['babel-compiler'].BabelCompiler;
var hljs = Package['simple:highlight.js'].hljs;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var Logger = Package['rocketchat:logger'].Logger;
var babelHelpers = Package['babel-runtime'].babelHelpers;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var Promise = Package.promise.Promise;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

/* Package-scope variables */
var __coffeescriptShare, logger;

(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/rocketchat_integrations/lib/rocketchat.coffee.js                                                         //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.integrations = {};                                                                                        // 1
                                                                                                                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/rocketchat_integrations/client/stylesheets/load.coffee.js                                                //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.theme.addPackageAsset(function() {                                                                        // 1
  return Assets.getText('client/stylesheets/integrations.less');                                                     // 2
});                                                                                                                  // 1
                                                                                                                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/rocketchat_integrations/server/logger.js                                                                 //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
/* globals logger:true */                                                                                            //
/* exported logger */                                                                                                //
                                                                                                                     //
logger = new Logger('Integrations', {                                                                                // 4
	sections: {                                                                                                         // 5
		incoming: 'Incoming WebHook',                                                                                      // 6
		outgoing: 'Outgoing WebHook'                                                                                       // 7
	}                                                                                                                   //
});                                                                                                                  //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/rocketchat_integrations/server/models/Integrations.coffee.js                                             //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;                                                                                       //
                                                                                                                     //
RocketChat.models.Integrations = new ((function(superClass) {                                                        // 1
  extend(_Class, superClass);                                                                                        // 2
                                                                                                                     //
  function _Class() {                                                                                                // 2
    this._initModel('integrations');                                                                                 // 3
  }                                                                                                                  //
                                                                                                                     //
  return _Class;                                                                                                     //
                                                                                                                     //
})(RocketChat.models._Base));                                                                                        //
                                                                                                                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/rocketchat_integrations/server/publications/integrations.coffee.js                                       //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish('integrations', function() {                                                                          // 1
  if (!this.userId) {                                                                                                // 2
    return this.ready();                                                                                             // 3
  }                                                                                                                  //
  if (RocketChat.authz.hasPermission(this.userId, 'manage-integrations')) {                                          // 5
    return RocketChat.models.Integrations.find();                                                                    // 6
  } else if (RocketChat.authz.hasPermission(this.userId, 'manage-own-integrations')) {                               //
    return RocketChat.models.Integrations.find({                                                                     // 8
      "_createdBy._id": this.userId                                                                                  // 8
    });                                                                                                              //
  } else {                                                                                                           //
    throw new Meteor.Error("not-authorized");                                                                        // 10
  }                                                                                                                  //
});                                                                                                                  // 1
                                                                                                                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/rocketchat_integrations/server/methods/incoming/addIncomingIntegration.coffee.js                         //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
                                                                                                                     //
Meteor.methods({                                                                                                     // 1
  addIncomingIntegration: function(integration) {                                                                    // 2
    var babelOptions, channel, channelType, channels, e, i, j, len, len1, record, ref, ref1, ref2, token, user;      // 3
    if ((!RocketChat.authz.hasPermission(this.userId, 'manage-integrations')) && (!RocketChat.authz.hasPermission(this.userId, 'manage-own-integrations'))) {
      throw new Meteor.Error('not_authorized');                                                                      // 4
    }                                                                                                                //
    if (!_.isString(integration.channel)) {                                                                          // 6
      throw new Meteor.Error('error-invalid-channel', 'Invalid channel', {                                           // 7
        method: 'addIncomingIntegration'                                                                             // 7
      });                                                                                                            //
    }                                                                                                                //
    if (integration.channel.trim() === '') {                                                                         // 9
      throw new Meteor.Error('error-invalid-channel', 'Invalid channel', {                                           // 10
        method: 'addIncomingIntegration'                                                                             // 10
      });                                                                                                            //
    }                                                                                                                //
    channels = _.map(integration.channel.split(','), function(channel) {                                             // 3
      return s.trim(channel);                                                                                        //
    });                                                                                                              //
    for (i = 0, len = channels.length; i < len; i++) {                                                               // 14
      channel = channels[i];                                                                                         //
      if ((ref = channel[0]) !== '@' && ref !== '#') {                                                               // 15
        throw new Meteor.Error('error-invalid-channel-start-with-chars', 'Invalid channel. Start with @ or #', {     // 16
          method: 'updateIncomingIntegration'                                                                        // 16
        });                                                                                                          //
      }                                                                                                              //
    }                                                                                                                // 14
    if (!_.isString(integration.username)) {                                                                         // 18
      throw new Meteor.Error('error-invalid-username', 'Invalid username', {                                         // 19
        method: 'addIncomingIntegration'                                                                             // 19
      });                                                                                                            //
    }                                                                                                                //
    if (integration.username.trim() === '') {                                                                        // 21
      throw new Meteor.Error('error-invalid-username', 'Invalid username', {                                         // 22
        method: 'addIncomingIntegration'                                                                             // 22
      });                                                                                                            //
    }                                                                                                                //
    if (integration.scriptEnabled === true && (integration.script != null) && integration.script.trim() !== '') {    // 24
      try {                                                                                                          // 25
        babelOptions = Babel.getDefaultOptions();                                                                    // 26
        babelOptions.externalHelpers = false;                                                                        // 26
        integration.scriptCompiled = Babel.compile(integration.script, babelOptions).code;                           // 26
        integration.scriptError = void 0;                                                                            // 26
      } catch (_error) {                                                                                             //
        e = _error;                                                                                                  // 32
        integration.scriptCompiled = void 0;                                                                         // 32
        integration.scriptError = _.pick(e, 'name', 'message', 'pos', 'loc', 'codeFrame');                           // 32
      }                                                                                                              //
    }                                                                                                                //
    for (j = 0, len1 = channels.length; j < len1; j++) {                                                             // 35
      channel = channels[j];                                                                                         //
      record = void 0;                                                                                               // 36
      channelType = channel[0];                                                                                      // 36
      channel = channel.substr(1);                                                                                   // 36
      switch (channelType) {                                                                                         // 40
        case '#':                                                                                                    // 40
          record = RocketChat.models.Rooms.findOne({                                                                 // 42
            $or: [                                                                                                   // 43
              {                                                                                                      //
                _id: channel                                                                                         // 44
              }, {                                                                                                   //
                name: channel                                                                                        // 45
              }                                                                                                      //
            ]                                                                                                        //
          });                                                                                                        //
          break;                                                                                                     // 41
        case '@':                                                                                                    // 40
          record = RocketChat.models.Users.findOne({                                                                 // 48
            $or: [                                                                                                   // 49
              {                                                                                                      //
                _id: channel                                                                                         // 50
              }, {                                                                                                   //
                username: channel                                                                                    // 51
              }                                                                                                      //
            ]                                                                                                        //
          });                                                                                                        //
      }                                                                                                              // 40
      if (record === void 0) {                                                                                       // 54
        throw new Meteor.Error('error-invalid-room', 'Invalid room', {                                               // 55
          method: 'addIncomingIntegration'                                                                           // 55
        });                                                                                                          //
      }                                                                                                              //
      if ((record.usernames != null) && (!RocketChat.authz.hasPermission(this.userId, 'manage-integrations')) && (RocketChat.authz.hasPermission(this.userId, 'manage-own-integrations')) && (ref1 = (ref2 = Meteor.user()) != null ? ref2.username : void 0, indexOf.call(record.usernames, ref1) < 0)) {
        throw new Meteor.Error('error-invalid-channel', 'Invalid Channel', {                                         // 61
          method: 'addIncomingIntegration'                                                                           // 61
        });                                                                                                          //
      }                                                                                                              //
    }                                                                                                                // 35
    user = RocketChat.models.Users.findOne({                                                                         // 3
      username: integration.username                                                                                 // 63
    });                                                                                                              //
    if (user == null) {                                                                                              // 65
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                 // 66
        method: 'addIncomingIntegration'                                                                             // 66
      });                                                                                                            //
    }                                                                                                                //
    token = Random.id(48);                                                                                           // 3
    integration.type = 'webhook-incoming';                                                                           // 3
    integration.token = token;                                                                                       // 3
    integration.userId = user._id;                                                                                   // 3
    integration._createdAt = new Date;                                                                               // 3
    integration._createdBy = RocketChat.models.Users.findOne(this.userId, {                                          // 3
      fields: {                                                                                                      // 74
        username: 1                                                                                                  // 74
      }                                                                                                              //
    });                                                                                                              //
    RocketChat.models.Roles.addUserRoles(user._id, 'bot');                                                           // 3
    integration._id = RocketChat.models.Integrations.insert(integration);                                            // 3
    return integration;                                                                                              // 80
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/rocketchat_integrations/server/methods/incoming/updateIncomingIntegration.coffee.js                      //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
                                                                                                                     //
Meteor.methods({                                                                                                     // 1
  updateIncomingIntegration: function(integrationId, integration) {                                                  // 2
    var babelOptions, channel, channelType, channels, currentIntegration, e, i, j, len, len1, record, ref, ref1, ref2, user;
    if (!_.isString(integration.channel)) {                                                                          // 3
      throw new Meteor.Error('error-invalid-channel', 'Invalid channel', {                                           // 4
        method: 'updateIncomingIntegration'                                                                          // 4
      });                                                                                                            //
    }                                                                                                                //
    if (integration.channel.trim() === '') {                                                                         // 6
      throw new Meteor.Error('error-invalid-channel', 'Invalid channel', {                                           // 7
        method: 'updateIncomingIntegration'                                                                          // 7
      });                                                                                                            //
    }                                                                                                                //
    channels = _.map(integration.channel.split(','), function(channel) {                                             // 3
      return s.trim(channel);                                                                                        //
    });                                                                                                              //
    for (i = 0, len = channels.length; i < len; i++) {                                                               // 11
      channel = channels[i];                                                                                         //
      if ((ref = channel[0]) !== '@' && ref !== '#') {                                                               // 12
        throw new Meteor.Error('error-invalid-channel-start-with-chars', 'Invalid channel. Start with @ or #', {     // 13
          method: 'updateIncomingIntegration'                                                                        // 13
        });                                                                                                          //
      }                                                                                                              //
    }                                                                                                                // 11
    currentIntegration = null;                                                                                       // 3
    if (RocketChat.authz.hasPermission(this.userId, 'manage-integrations')) {                                        // 17
      currentIntegration = RocketChat.models.Integrations.findOne(integrationId);                                    // 18
    } else if (RocketChat.authz.hasPermission(this.userId, 'manage-own-integrations')) {                             //
      currentIntegration = RocketChat.models.Integrations.findOne({                                                  // 20
        "_id": integrationId,                                                                                        // 20
        "_createdBy._id": this.userId                                                                                // 20
      });                                                                                                            //
    } else {                                                                                                         //
      throw new Meteor.Error('not_authorized');                                                                      // 22
    }                                                                                                                //
    if (currentIntegration == null) {                                                                                // 24
      throw new Meteor.Error('error-invalid-integration', 'Invalid integration', {                                   // 25
        method: 'updateIncomingIntegration'                                                                          // 25
      });                                                                                                            //
    }                                                                                                                //
    if (integration.scriptEnabled === true && (integration.script != null) && integration.script.trim() !== '') {    // 27
      try {                                                                                                          // 28
        babelOptions = Babel.getDefaultOptions();                                                                    // 29
        babelOptions.externalHelpers = false;                                                                        // 29
        integration.scriptCompiled = Babel.compile(integration.script, babelOptions).code;                           // 29
        integration.scriptError = void 0;                                                                            // 29
      } catch (_error) {                                                                                             //
        e = _error;                                                                                                  // 35
        integration.scriptCompiled = void 0;                                                                         // 35
        integration.scriptError = _.pick(e, 'name', 'message', 'pos', 'loc', 'codeFrame');                           // 35
      }                                                                                                              //
    }                                                                                                                //
    for (j = 0, len1 = channels.length; j < len1; j++) {                                                             // 38
      channel = channels[j];                                                                                         //
      record = void 0;                                                                                               // 39
      channelType = channel[0];                                                                                      // 39
      channel = channel.substr(1);                                                                                   // 39
      switch (channelType) {                                                                                         // 43
        case '#':                                                                                                    // 43
          record = RocketChat.models.Rooms.findOne({                                                                 // 45
            $or: [                                                                                                   // 46
              {                                                                                                      //
                _id: channel                                                                                         // 47
              }, {                                                                                                   //
                name: channel                                                                                        // 48
              }                                                                                                      //
            ]                                                                                                        //
          });                                                                                                        //
          break;                                                                                                     // 44
        case '@':                                                                                                    // 43
          record = RocketChat.models.Users.findOne({                                                                 // 51
            $or: [                                                                                                   // 52
              {                                                                                                      //
                _id: channel                                                                                         // 53
              }, {                                                                                                   //
                username: channel                                                                                    // 54
              }                                                                                                      //
            ]                                                                                                        //
          });                                                                                                        //
      }                                                                                                              // 43
      if (record === void 0) {                                                                                       // 57
        throw new Meteor.Error('error-invalid-room', 'Invalid room', {                                               // 58
          method: 'updateIncomingIntegration'                                                                        // 58
        });                                                                                                          //
      }                                                                                                              //
      if ((record.usernames != null) && (!RocketChat.authz.hasPermission(this.userId, 'manage-integrations')) && (RocketChat.authz.hasPermission(this.userId, 'manage-own-integrations')) && (ref1 = (ref2 = Meteor.user()) != null ? ref2.username : void 0, indexOf.call(record.usernames, ref1) < 0)) {
        throw new Meteor.Error('error-invalid-channel', 'Invalid Channel', {                                         // 64
          method: 'updateIncomingIntegration'                                                                        // 64
        });                                                                                                          //
      }                                                                                                              //
    }                                                                                                                // 38
    user = RocketChat.models.Users.findOne({                                                                         // 3
      username: currentIntegration.username                                                                          // 66
    });                                                                                                              //
    RocketChat.models.Roles.addUserRoles(user._id, 'bot');                                                           // 3
    RocketChat.models.Integrations.update(integrationId, {                                                           // 3
      $set: {                                                                                                        // 70
        enabled: integration.enabled,                                                                                // 71
        name: integration.name,                                                                                      // 71
        avatar: integration.avatar,                                                                                  // 71
        emoji: integration.emoji,                                                                                    // 71
        alias: integration.alias,                                                                                    // 71
        channel: channels,                                                                                           // 71
        script: integration.script,                                                                                  // 71
        scriptEnabled: integration.scriptEnabled,                                                                    // 71
        scriptCompiled: integration.scriptCompiled,                                                                  // 71
        scriptError: integration.scriptError,                                                                        // 71
        _updatedAt: new Date,                                                                                        // 71
        _updatedBy: RocketChat.models.Users.findOne(this.userId, {                                                   // 71
          fields: {                                                                                                  // 82
            username: 1                                                                                              // 82
          }                                                                                                          //
        })                                                                                                           //
      }                                                                                                              //
    });                                                                                                              //
    return RocketChat.models.Integrations.findOne(integrationId);                                                    // 84
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/rocketchat_integrations/server/methods/incoming/deleteIncomingIntegration.coffee.js                      //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                     // 1
  deleteIncomingIntegration: function(integrationId) {                                                               // 2
    var integration;                                                                                                 // 3
    integration = null;                                                                                              // 3
    if (RocketChat.authz.hasPermission(this.userId, 'manage-integrations')) {                                        // 5
      integration = RocketChat.models.Integrations.findOne(integrationId);                                           // 6
    } else if (RocketChat.authz.hasPermission(this.userId, 'manage-own-integrations')) {                             //
      integration = RocketChat.models.Integrations.findOne(integrationId, {                                          // 8
        fields: {                                                                                                    // 8
          "_createdBy._id": this.userId                                                                              // 8
        }                                                                                                            //
      });                                                                                                            //
    } else {                                                                                                         //
      throw new Meteor.Error('not_authorized');                                                                      // 10
    }                                                                                                                //
    if (integration == null) {                                                                                       // 12
      throw new Meteor.Error('error-invalid-integration', 'Invalid integration', {                                   // 13
        method: 'deleteIncomingIntegration'                                                                          // 13
      });                                                                                                            //
    }                                                                                                                //
    RocketChat.models.Integrations.remove({                                                                          // 3
      _id: integrationId                                                                                             // 15
    });                                                                                                              //
    return true;                                                                                                     // 17
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/rocketchat_integrations/server/methods/outgoing/addOutgoingIntegration.coffee.js                         //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
                                                                                                                     //
Meteor.methods({                                                                                                     // 1
  addOutgoingIntegration: function(integration) {                                                                    // 2
    var babelOptions, channel, channelType, channels, e, i, index, j, k, l, len, len1, len2, len3, record, ref, ref1, ref2, ref3, ref4, ref5, triggerWord, url, user;
    if ((((ref = integration.channel) != null ? ref.trim : void 0) != null) && integration.channel.trim() === '') {  // 3
      delete integration.channel;                                                                                    // 4
    }                                                                                                                //
    if ((!RocketChat.authz.hasPermission(this.userId, 'manage-integrations')) && !(RocketChat.authz.hasPermission(this.userId, 'manage-own-integrations')) && !(RocketChat.authz.hasPermission(this.userId, 'manage-integrations', 'bot')) && !(RocketChat.authz.hasPermission(this.userId, 'manage-own-integrations', 'bot'))) {
      throw new Meteor.Error('not_authorized');                                                                      // 10
    }                                                                                                                //
    if (integration.username.trim() === '') {                                                                        // 12
      throw new Meteor.Error('error-invalid-username', 'Invalid username', {                                         // 13
        method: 'addOutgoingIntegration'                                                                             // 13
      });                                                                                                            //
    }                                                                                                                //
    if (!Match.test(integration.urls, [String])) {                                                                   // 15
      throw new Meteor.Error('error-invalid-urls', 'Invalid URLs', {                                                 // 16
        method: 'addOutgoingIntegration'                                                                             // 16
      });                                                                                                            //
    }                                                                                                                //
    ref1 = integration.urls;                                                                                         // 18
    for (index = i = 0, len = ref1.length; i < len; index = ++i) {                                                   // 18
      url = ref1[index];                                                                                             //
      if (url.trim() === '') {                                                                                       // 19
        delete integration.urls[index];                                                                              // 19
      }                                                                                                              //
    }                                                                                                                // 18
    integration.urls = _.without(integration.urls, [void 0]);                                                        // 3
    if (integration.urls.length === 0) {                                                                             // 23
      throw new Meteor.Error('error-invalid-urls', 'Invalid URLs', {                                                 // 24
        method: 'addOutgoingIntegration'                                                                             // 24
      });                                                                                                            //
    }                                                                                                                //
    channels = integration.channel ? _.map(integration.channel.split(','), function(channel) {                       // 3
      return s.trim(channel);                                                                                        //
    }) : [];                                                                                                         //
    for (j = 0, len1 = channels.length; j < len1; j++) {                                                             // 28
      channel = channels[j];                                                                                         //
      if ((ref2 = channel[0]) !== '@' && ref2 !== '#') {                                                             // 29
        throw new Meteor.Error('error-invalid-channel-start-with-chars', 'Invalid channel. Start with @ or #', {     // 30
          method: 'updateIncomingIntegration'                                                                        // 30
        });                                                                                                          //
      }                                                                                                              //
    }                                                                                                                // 28
    if (integration.triggerWords != null) {                                                                          // 32
      if (!Match.test(integration.triggerWords, [String])) {                                                         // 33
        throw new Meteor.Error('error-invalid-triggerWords', 'Invalid triggerWords', {                               // 34
          method: 'addOutgoingIntegration'                                                                           // 34
        });                                                                                                          //
      }                                                                                                              //
      ref3 = integration.triggerWords;                                                                               // 36
      for (index = k = 0, len2 = ref3.length; k < len2; index = ++k) {                                               // 36
        triggerWord = ref3[index];                                                                                   //
        if (triggerWord.trim() === '') {                                                                             // 37
          delete integration.triggerWords[index];                                                                    // 37
        }                                                                                                            //
      }                                                                                                              // 36
      integration.triggerWords = _.without(integration.triggerWords, [void 0]);                                      // 33
    }                                                                                                                //
    if (integration.scriptEnabled === true && (integration.script != null) && integration.script.trim() !== '') {    // 41
      try {                                                                                                          // 42
        babelOptions = Babel.getDefaultOptions();                                                                    // 43
        babelOptions.externalHelpers = false;                                                                        // 43
        integration.scriptCompiled = Babel.compile(integration.script, babelOptions).code;                           // 43
        integration.scriptError = void 0;                                                                            // 43
      } catch (_error) {                                                                                             //
        e = _error;                                                                                                  // 49
        integration.scriptCompiled = void 0;                                                                         // 49
        integration.scriptError = _.pick(e, 'name', 'message', 'pos', 'loc', 'codeFrame');                           // 49
      }                                                                                                              //
    }                                                                                                                //
    for (l = 0, len3 = channels.length; l < len3; l++) {                                                             // 53
      channel = channels[l];                                                                                         //
      record = void 0;                                                                                               // 54
      channelType = channel[0];                                                                                      // 54
      channel = channel.substr(1);                                                                                   // 54
      switch (channelType) {                                                                                         // 58
        case '#':                                                                                                    // 58
          record = RocketChat.models.Rooms.findOne({                                                                 // 60
            $or: [                                                                                                   // 61
              {                                                                                                      //
                _id: channel                                                                                         // 62
              }, {                                                                                                   //
                name: channel                                                                                        // 63
              }                                                                                                      //
            ]                                                                                                        //
          });                                                                                                        //
          break;                                                                                                     // 59
        case '@':                                                                                                    // 58
          record = RocketChat.models.Users.findOne({                                                                 // 66
            $or: [                                                                                                   // 67
              {                                                                                                      //
                _id: channel                                                                                         // 68
              }, {                                                                                                   //
                username: channel                                                                                    // 69
              }                                                                                                      //
            ]                                                                                                        //
          });                                                                                                        //
      }                                                                                                              // 58
      if (record === void 0) {                                                                                       // 72
        throw new Meteor.Error('error-invalid-room', 'Invalid room', {                                               // 73
          method: 'addOutgoingIntegration'                                                                           // 73
        });                                                                                                          //
      }                                                                                                              //
      if ((record.usernames != null) && (!RocketChat.authz.hasPermission(this.userId, 'manage-integrations')) && (RocketChat.authz.hasPermission(this.userId, 'manage-own-integrations')) && (ref4 = (ref5 = Meteor.user()) != null ? ref5.username : void 0, indexOf.call(record.usernames, ref4) < 0)) {
        throw new Meteor.Error('error-invalid-channel', 'Invalid Channel', {                                         // 79
          method: 'addOutgoingIntegration'                                                                           // 79
        });                                                                                                          //
      }                                                                                                              //
    }                                                                                                                // 53
    user = RocketChat.models.Users.findOne({                                                                         // 3
      username: integration.username                                                                                 // 81
    });                                                                                                              //
    if (user == null) {                                                                                              // 83
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                 // 84
        method: 'addOutgoingIntegration'                                                                             // 84
      });                                                                                                            //
    }                                                                                                                //
    integration.type = 'webhook-outgoing';                                                                           // 3
    integration.userId = user._id;                                                                                   // 3
    integration._createdAt = new Date;                                                                               // 3
    integration._createdBy = RocketChat.models.Users.findOne(this.userId, {                                          // 3
      fields: {                                                                                                      // 89
        username: 1                                                                                                  // 89
      }                                                                                                              //
    });                                                                                                              //
    integration._id = RocketChat.models.Integrations.insert(integration);                                            // 3
    return integration;                                                                                              // 93
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/rocketchat_integrations/server/methods/outgoing/updateOutgoingIntegration.coffee.js                      //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
                                                                                                                     //
Meteor.methods({                                                                                                     // 1
  updateOutgoingIntegration: function(integrationId, integration) {                                                  // 2
    var babelOptions, channel, channelType, channels, currentIntegration, e, i, index, j, k, l, len, len1, len2, len3, record, ref, ref1, ref2, ref3, ref4, ref5, triggerWord, url, user;
    if (integration.username.trim() === '') {                                                                        // 4
      throw new Meteor.Error('error-invalid-username', 'Invalid username', {                                         // 5
        method: 'updateOutgoingIntegration'                                                                          // 5
      });                                                                                                            //
    }                                                                                                                //
    if (!Match.test(integration.urls, [String])) {                                                                   // 7
      throw new Meteor.Error('error-invalid-urls', 'Invalid URLs', {                                                 // 8
        method: 'updateOutgoingIntegration'                                                                          // 8
      });                                                                                                            //
    }                                                                                                                //
    ref = integration.urls;                                                                                          // 10
    for (index = i = 0, len = ref.length; i < len; index = ++i) {                                                    // 10
      url = ref[index];                                                                                              //
      if (url.trim() === '') {                                                                                       // 11
        delete integration.urls[index];                                                                              // 11
      }                                                                                                              //
    }                                                                                                                // 10
    integration.urls = _.without(integration.urls, [void 0]);                                                        // 4
    if (integration.urls.length === 0) {                                                                             // 15
      throw new Meteor.Error('error-invalid-urls', 'Invalid URLs', {                                                 // 16
        method: 'updateOutgoingIntegration'                                                                          // 16
      });                                                                                                            //
    }                                                                                                                //
    if (_.isString(integration.channel)) {                                                                           // 18
      integration.channel = integration.channel.trim();                                                              // 19
    } else {                                                                                                         //
      integration.channel = void 0;                                                                                  // 21
    }                                                                                                                //
    channels = integration.channel ? _.map(integration.channel.split(','), function(channel) {                       // 4
      return s.trim(channel);                                                                                        //
    }) : [];                                                                                                         //
    for (j = 0, len1 = channels.length; j < len1; j++) {                                                             // 25
      channel = channels[j];                                                                                         //
      if ((ref1 = channel[0]) !== '@' && ref1 !== '#') {                                                             // 26
        throw new Meteor.Error('error-invalid-channel-start-with-chars', 'Invalid channel. Start with @ or #', {     // 27
          method: 'updateIncomingIntegration'                                                                        // 27
        });                                                                                                          //
      }                                                                                                              //
    }                                                                                                                // 25
    if ((integration.token == null) || ((ref2 = integration.token) != null ? ref2.trim() : void 0) === '') {         // 29
      throw new Meteor.Error('error-invalid-token', 'Invalid token', {                                               // 30
        method: 'updateOutgoingIntegration'                                                                          // 30
      });                                                                                                            //
    }                                                                                                                //
    if (integration.triggerWords != null) {                                                                          // 32
      if (!Match.test(integration.triggerWords, [String])) {                                                         // 33
        throw new Meteor.Error('error-invalid-triggerWords', 'Invalid triggerWords', {                               // 34
          method: 'updateOutgoingIntegration'                                                                        // 34
        });                                                                                                          //
      }                                                                                                              //
      ref3 = integration.triggerWords;                                                                               // 36
      for (index = k = 0, len2 = ref3.length; k < len2; index = ++k) {                                               // 36
        triggerWord = ref3[index];                                                                                   //
        if (triggerWord.trim() === '') {                                                                             // 37
          delete integration.triggerWords[index];                                                                    // 37
        }                                                                                                            //
      }                                                                                                              // 36
      integration.triggerWords = _.without(integration.triggerWords, [void 0]);                                      // 33
    }                                                                                                                //
    currentIntegration = null;                                                                                       // 4
    if (RocketChat.authz.hasPermission(this.userId, 'manage-integrations')) {                                        // 43
      currentIntegration = RocketChat.models.Integrations.findOne(integrationId);                                    // 44
    } else if (RocketChat.authz.hasPermission(this.userId, 'manage-own-integrations')) {                             //
      currentIntegration = RocketChat.models.Integrations.findOne({                                                  // 46
        "_id": integrationId,                                                                                        // 46
        "_createdBy._id": this.userId                                                                                // 46
      });                                                                                                            //
    } else {                                                                                                         //
      throw new Meteor.Error('not_authorized');                                                                      // 48
    }                                                                                                                //
    if (currentIntegration == null) {                                                                                // 50
      throw new Meteor.Error('invalid_integration', '[methods] updateOutgoingIntegration -> integration not found');
    }                                                                                                                //
    if (integration.scriptEnabled === true && (integration.script != null) && integration.script.trim() !== '') {    // 53
      try {                                                                                                          // 54
        babelOptions = Babel.getDefaultOptions();                                                                    // 55
        babelOptions.externalHelpers = false;                                                                        // 55
        integration.scriptCompiled = Babel.compile(integration.script, babelOptions).code;                           // 55
        integration.scriptError = void 0;                                                                            // 55
      } catch (_error) {                                                                                             //
        e = _error;                                                                                                  // 61
        integration.scriptCompiled = void 0;                                                                         // 61
        integration.scriptError = _.pick(e, 'name', 'message', 'pos', 'loc', 'codeFrame');                           // 61
      }                                                                                                              //
    }                                                                                                                //
    for (l = 0, len3 = channels.length; l < len3; l++) {                                                             // 65
      channel = channels[l];                                                                                         //
      record = void 0;                                                                                               // 66
      channelType = channel[0];                                                                                      // 66
      channel = channel.substr(1);                                                                                   // 66
      switch (channelType) {                                                                                         // 70
        case '#':                                                                                                    // 70
          record = RocketChat.models.Rooms.findOne({                                                                 // 72
            $or: [                                                                                                   // 73
              {                                                                                                      //
                _id: channel                                                                                         // 74
              }, {                                                                                                   //
                name: channel                                                                                        // 75
              }                                                                                                      //
            ]                                                                                                        //
          });                                                                                                        //
          break;                                                                                                     // 71
        case '@':                                                                                                    // 70
          record = RocketChat.models.Users.findOne({                                                                 // 78
            $or: [                                                                                                   // 79
              {                                                                                                      //
                _id: channel                                                                                         // 80
              }, {                                                                                                   //
                username: channel                                                                                    // 81
              }                                                                                                      //
            ]                                                                                                        //
          });                                                                                                        //
      }                                                                                                              // 70
      if (record === void 0) {                                                                                       // 84
        throw new Meteor.Error('error-invalid-room', 'Invalid room', {                                               // 85
          method: 'updateOutgoingIntegration'                                                                        // 85
        });                                                                                                          //
      }                                                                                                              //
      if ((record.usernames != null) && (!RocketChat.authz.hasPermission(this.userId, 'manage-integrations')) && (RocketChat.authz.hasPermission(this.userId, 'manage-own-integrations')) && (ref4 = (ref5 = Meteor.user()) != null ? ref5.username : void 0, indexOf.call(record.usernames, ref4) < 0)) {
        throw new Meteor.Error('error-invalid-channel', 'Invalid Channel', {                                         // 91
          method: 'updateOutgoingIntegration'                                                                        // 91
        });                                                                                                          //
      }                                                                                                              //
    }                                                                                                                // 65
    user = RocketChat.models.Users.findOne({                                                                         // 4
      username: integration.username                                                                                 // 93
    });                                                                                                              //
    if (user == null) {                                                                                              // 95
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                 // 96
        method: 'updateOutgoingIntegration'                                                                          // 96
      });                                                                                                            //
    }                                                                                                                //
    RocketChat.models.Integrations.update(integrationId, {                                                           // 4
      $set: {                                                                                                        // 99
        enabled: integration.enabled,                                                                                // 100
        name: integration.name,                                                                                      // 100
        avatar: integration.avatar,                                                                                  // 100
        emoji: integration.emoji,                                                                                    // 100
        alias: integration.alias,                                                                                    // 100
        channel: channels,                                                                                           // 100
        username: integration.username,                                                                              // 100
        userId: user._id,                                                                                            // 100
        urls: integration.urls,                                                                                      // 100
        token: integration.token,                                                                                    // 100
        script: integration.script,                                                                                  // 100
        scriptEnabled: integration.scriptEnabled,                                                                    // 100
        scriptCompiled: integration.scriptCompiled,                                                                  // 100
        scriptError: integration.scriptError,                                                                        // 100
        triggerWords: integration.triggerWords,                                                                      // 100
        _updatedAt: new Date,                                                                                        // 100
        _updatedBy: RocketChat.models.Users.findOne(this.userId, {                                                   // 100
          fields: {                                                                                                  // 116
            username: 1                                                                                              // 116
          }                                                                                                          //
        })                                                                                                           //
      }                                                                                                              //
    });                                                                                                              //
    return RocketChat.models.Integrations.findOne(integrationId);                                                    // 118
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/rocketchat_integrations/server/methods/outgoing/deleteOutgoingIntegration.coffee.js                      //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                     // 1
  deleteOutgoingIntegration: function(integrationId) {                                                               // 2
    var integration;                                                                                                 // 3
    integration = null;                                                                                              // 3
    if (RocketChat.authz.hasPermission(this.userId, 'manage-integrations') || RocketChat.authz.hasPermission(this.userId, 'manage-integrations', 'bot')) {
      integration = RocketChat.models.Integrations.findOne(integrationId);                                           // 6
    } else if (RocketChat.authz.hasPermission(this.userId, 'manage-own-integrations') || RocketChat.authz.hasPermission(this.userId, 'manage-own-integrations', 'bot')) {
      integration = RocketChat.models.Integrations.findOne(integrationId, {                                          // 8
        fields: {                                                                                                    // 8
          "_createdBy._id": this.userId                                                                              // 8
        }                                                                                                            //
      });                                                                                                            //
    } else {                                                                                                         //
      throw new Meteor.Error('not_authorized');                                                                      // 10
    }                                                                                                                //
    if (integration == null) {                                                                                       // 12
      throw new Meteor.Error('error-invalid-integration', 'Invalid integration', {                                   // 13
        method: 'deleteOutgoingIntegration'                                                                          // 13
      });                                                                                                            //
    }                                                                                                                //
    RocketChat.models.Integrations.remove({                                                                          // 3
      _id: integrationId                                                                                             // 15
    });                                                                                                              //
    return true;                                                                                                     // 17
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/rocketchat_integrations/server/api/api.coffee.js                                                         //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var Api, addIntegrationRest, compiledScripts, createIntegration, executeIntegrationRest, getIntegrationScript, integrationInfoRest, integrationSampleRest, removeIntegration, removeIntegrationRest, vm;
                                                                                                                     //
vm = Npm.require('vm');                                                                                              // 1
                                                                                                                     //
compiledScripts = {};                                                                                                // 1
                                                                                                                     //
getIntegrationScript = function(integration) {                                                                       // 1
  var compiledScript, e, sandbox, script, vmScript;                                                                  // 6
  compiledScript = compiledScripts[integration._id];                                                                 // 6
  if ((compiledScript != null) && +compiledScript._updatedAt === +integration._updatedAt) {                          // 7
    return compiledScript.script;                                                                                    // 8
  }                                                                                                                  //
  script = integration.scriptCompiled;                                                                               // 6
  vmScript = void 0;                                                                                                 // 6
  sandbox = {                                                                                                        // 6
    _: _,                                                                                                            // 13
    s: s,                                                                                                            // 13
    console: console,                                                                                                // 13
    Store: {                                                                                                         // 13
      set: function(key, val) {                                                                                      // 17
        return store[key] = val;                                                                                     // 18
      },                                                                                                             //
      get: function(key) {                                                                                           // 17
        return store[key];                                                                                           // 20
      }                                                                                                              //
    }                                                                                                                //
  };                                                                                                                 //
  try {                                                                                                              // 22
    logger.incoming.info('will evaluate script');                                                                    // 23
    logger.incoming.debug(script);                                                                                   // 23
    vmScript = vm.createScript(script, 'script.js');                                                                 // 23
    vmScript.runInNewContext(sandbox);                                                                               // 23
    if (sandbox.Script != null) {                                                                                    // 30
      compiledScripts[integration._id] = {                                                                           // 31
        script: new sandbox.Script(),                                                                                // 32
        _updatedAt: integration._updatedAt                                                                           // 32
      };                                                                                                             //
      return compiledScripts[integration._id].script;                                                                // 35
    }                                                                                                                //
  } catch (_error) {                                                                                                 //
    e = _error;                                                                                                      // 37
    logger.incoming.error("[Error evaluating Script:]");                                                             // 37
    logger.incoming.error(script.replace(/^/gm, '  '));                                                              // 37
    logger.incoming.error("[Stack:]");                                                                               // 37
    logger.incoming.error(e.stack.replace(/^/gm, '  '));                                                             // 37
    throw RocketChat.API.v1.failure('error-evaluating-script');                                                      // 41
  }                                                                                                                  //
  if (sandbox.Script == null) {                                                                                      // 43
    throw RocketChat.API.v1.failure('class-script-not-found');                                                       // 44
  }                                                                                                                  //
};                                                                                                                   // 5
                                                                                                                     //
Api = new Restivus({                                                                                                 // 1
  enableCors: true,                                                                                                  // 48
  apiPath: 'hooks/',                                                                                                 // 48
  auth: {                                                                                                            // 48
    user: function() {                                                                                               // 51
      var ref, user;                                                                                                 // 52
      if (((ref = this.bodyParams) != null ? ref.payload : void 0) != null) {                                        // 52
        this.bodyParams = JSON.parse(this.bodyParams.payload);                                                       // 53
      }                                                                                                              //
      this.integration = RocketChat.models.Integrations.findOne({                                                    // 52
        _id: this.request.params.integrationId,                                                                      // 56
        token: decodeURIComponent(this.request.params.token)                                                         // 56
      });                                                                                                            //
      if (this.integration == null) {                                                                                // 59
        logger.incoming.info("Invalid integration id", this.request.params.integrationId, "or token", this.request.params.token);
        return;                                                                                                      // 61
      }                                                                                                              //
      user = RocketChat.models.Users.findOne({                                                                       // 52
        _id: this.integration.userId                                                                                 // 64
      });                                                                                                            //
      return {                                                                                                       // 66
        user: user                                                                                                   // 66
      };                                                                                                             //
    }                                                                                                                //
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
createIntegration = function(options, user) {                                                                        // 1
  logger.incoming.info('Add integration');                                                                           // 70
  logger.incoming.debug(options);                                                                                    // 70
  Meteor.runAsUser(user._id, (function(_this) {                                                                      // 70
    return function() {                                                                                              //
      switch (options['event']) {                                                                                    // 74
        case 'newMessageOnChannel':                                                                                  // 74
          if (options.data == null) {                                                                                //
            options.data = {};                                                                                       //
          }                                                                                                          //
          if ((options.data.channel_name != null) && options.data.channel_name.indexOf('#') === -1) {                // 78
            options.data.channel_name = '#' + options.data.channel_name;                                             // 79
          }                                                                                                          //
          return Meteor.call('addOutgoingIntegration', {                                                             //
            username: 'rocket.cat',                                                                                  // 82
            urls: [options.target_url],                                                                              // 82
            name: options.name,                                                                                      // 82
            channel: options.data.channel_name,                                                                      // 82
            triggerWords: options.data.trigger_words                                                                 // 82
          });                                                                                                        //
        case 'newMessageToUser':                                                                                     // 74
          if (options.data.username.indexOf('@') === -1) {                                                           // 89
            options.data.username = '@' + options.data.username;                                                     // 90
          }                                                                                                          //
          return Meteor.call('addOutgoingIntegration', {                                                             //
            username: 'rocket.cat',                                                                                  // 93
            urls: [options.target_url],                                                                              // 93
            name: options.name,                                                                                      // 93
            channel: options.data.username,                                                                          // 93
            triggerWords: options.data.trigger_words                                                                 // 93
          });                                                                                                        //
      }                                                                                                              // 74
    };                                                                                                               //
  })(this));                                                                                                         //
  return RocketChat.API.v1.success();                                                                                // 99
};                                                                                                                   // 69
                                                                                                                     //
removeIntegration = function(options, user) {                                                                        // 1
  var integrationToRemove;                                                                                           // 103
  logger.incoming.info('Remove integration');                                                                        // 103
  logger.incoming.debug(options);                                                                                    // 103
  integrationToRemove = RocketChat.models.Integrations.findOne({                                                     // 103
    urls: options.target_url                                                                                         // 106
  });                                                                                                                //
  Meteor.runAsUser(user._id, (function(_this) {                                                                      // 103
    return function() {                                                                                              //
      return Meteor.call('deleteOutgoingIntegration', integrationToRemove._id);                                      //
    };                                                                                                               //
  })(this));                                                                                                         //
  return RocketChat.API.v1.success();                                                                                // 110
};                                                                                                                   // 102
                                                                                                                     //
executeIntegrationRest = function() {                                                                                // 1
  var defaultValues, e, message, ref, ref1, request, result, script;                                                 // 114
  logger.incoming.info('Post integration');                                                                          // 114
  logger.incoming.debug('@urlParams', this.urlParams);                                                               // 114
  logger.incoming.debug('@bodyParams', this.bodyParams);                                                             // 114
  if (this.integration.enabled !== true) {                                                                           // 118
    return {                                                                                                         // 119
      statusCode: 503,                                                                                               // 120
      body: 'Service Unavailable'                                                                                    // 120
    };                                                                                                               //
  }                                                                                                                  //
  defaultValues = {                                                                                                  // 114
    channel: this.integration.channel,                                                                               // 124
    alias: this.integration.alias,                                                                                   // 124
    avatar: this.integration.avatar,                                                                                 // 124
    emoji: this.integration.emoji                                                                                    // 124
  };                                                                                                                 //
  if (this.integration.scriptEnabled === true && (this.integration.scriptCompiled != null) && this.integration.scriptCompiled.trim() !== '') {
    script = void 0;                                                                                                 // 131
    try {                                                                                                            // 132
      script = getIntegrationScript(this.integration);                                                               // 133
    } catch (_error) {                                                                                               //
      e = _error;                                                                                                    // 135
      return e;                                                                                                      // 135
    }                                                                                                                //
    request = {                                                                                                      // 131
      url: {                                                                                                         // 138
        hash: this.request._parsedUrl.hash,                                                                          // 139
        search: this.request._parsedUrl.search,                                                                      // 139
        query: this.queryParams,                                                                                     // 139
        pathname: this.request._parsedUrl.pathname,                                                                  // 139
        path: this.request._parsedUrl.path                                                                           // 139
      },                                                                                                             //
      url_raw: this.request.url,                                                                                     // 138
      url_params: this.urlParams,                                                                                    // 138
      content: this.bodyParams,                                                                                      // 138
      content_raw: (ref = this.request._readableState) != null ? (ref1 = ref.buffer) != null ? ref1.toString() : void 0 : void 0,
      headers: this.request.headers,                                                                                 // 138
      user: {                                                                                                        // 138
        _id: this.user._id,                                                                                          // 150
        name: this.user.name,                                                                                        // 150
        username: this.user.username                                                                                 // 150
      }                                                                                                              //
    };                                                                                                               //
    try {                                                                                                            // 154
      result = script.process_incoming_request({                                                                     // 155
        request: request                                                                                             // 155
      });                                                                                                            //
      if ((result != null ? result.error : void 0) != null) {                                                        // 157
        return RocketChat.API.v1.failure(result.error);                                                              // 158
      }                                                                                                              //
      this.bodyParams = result != null ? result.content : void 0;                                                    // 155
      logger.incoming.debug('result', this.bodyParams);                                                              // 155
    } catch (_error) {                                                                                               //
      e = _error;                                                                                                    // 164
      logger.incoming.error("[Error running Script:]");                                                              // 164
      logger.incoming.error(this.integration.scriptCompiled.replace(/^/gm, '  '));                                   // 164
      logger.incoming.error("[Stack:]");                                                                             // 164
      logger.incoming.error(e.stack.replace(/^/gm, '  '));                                                           // 164
      return RocketChat.API.v1.failure('error-running-script');                                                      // 168
    }                                                                                                                //
  }                                                                                                                  //
  if (this.bodyParams == null) {                                                                                     // 170
    return RocketChat.API.v1.failure('body-empty');                                                                  // 171
  }                                                                                                                  //
  this.bodyParams.bot = {                                                                                            // 114
    i: this.integration._id                                                                                          // 174
  };                                                                                                                 //
  try {                                                                                                              // 176
    message = processWebhookMessage(this.bodyParams, this.user, defaultValues);                                      // 177
    if (_.isEmpty(message)) {                                                                                        // 179
      return RocketChat.API.v1.failure('unknown-error');                                                             // 180
    }                                                                                                                //
    return RocketChat.API.v1.success();                                                                              // 182
  } catch (_error) {                                                                                                 //
    e = _error;                                                                                                      // 184
    return RocketChat.API.v1.failure(e.error);                                                                       // 184
  }                                                                                                                  //
};                                                                                                                   // 113
                                                                                                                     //
addIntegrationRest = function() {                                                                                    // 1
  return createIntegration(this.bodyParams, this.user);                                                              // 188
};                                                                                                                   // 187
                                                                                                                     //
removeIntegrationRest = function() {                                                                                 // 1
  return removeIntegration(this.bodyParams, this.user);                                                              // 192
};                                                                                                                   // 191
                                                                                                                     //
integrationSampleRest = function() {                                                                                 // 1
  logger.incoming.info('Sample Integration');                                                                        // 196
  return {                                                                                                           // 198
    statusCode: 200,                                                                                                 // 199
    body: [                                                                                                          // 199
      {                                                                                                              //
        token: Random.id(24),                                                                                        // 201
        channel_id: Random.id(),                                                                                     // 201
        channel_name: 'general',                                                                                     // 201
        timestamp: new Date,                                                                                         // 201
        user_id: Random.id(),                                                                                        // 201
        user_name: 'rocket.cat',                                                                                     // 201
        text: 'Sample text 1',                                                                                       // 201
        trigger_word: 'Sample'                                                                                       // 201
      }, {                                                                                                           //
        token: Random.id(24),                                                                                        // 210
        channel_id: Random.id(),                                                                                     // 210
        channel_name: 'general',                                                                                     // 210
        timestamp: new Date,                                                                                         // 210
        user_id: Random.id(),                                                                                        // 210
        user_name: 'rocket.cat',                                                                                     // 210
        text: 'Sample text 2',                                                                                       // 210
        trigger_word: 'Sample'                                                                                       // 210
      }, {                                                                                                           //
        token: Random.id(24),                                                                                        // 219
        channel_id: Random.id(),                                                                                     // 219
        channel_name: 'general',                                                                                     // 219
        timestamp: new Date,                                                                                         // 219
        user_id: Random.id(),                                                                                        // 219
        user_name: 'rocket.cat',                                                                                     // 219
        text: 'Sample text 3',                                                                                       // 219
        trigger_word: 'Sample'                                                                                       // 219
      }                                                                                                              //
    ]                                                                                                                //
  };                                                                                                                 //
};                                                                                                                   // 195
                                                                                                                     //
integrationInfoRest = function() {                                                                                   // 1
  logger.incoming.info('Info integration');                                                                          // 231
  return {                                                                                                           // 233
    statusCode: 200,                                                                                                 // 234
    body: {                                                                                                          // 234
      success: true                                                                                                  // 236
    }                                                                                                                //
  };                                                                                                                 //
};                                                                                                                   // 230
                                                                                                                     //
RocketChat.API.v1.addRoute('integrations.create', {                                                                  // 1
  authRequired: true                                                                                                 // 239
}, {                                                                                                                 //
  post: function() {                                                                                                 // 240
    return createIntegration(this.bodyParams, this.user);                                                            // 241
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
RocketChat.API.v1.addRoute('integrations.remove', {                                                                  // 1
  authRequired: true                                                                                                 // 244
}, {                                                                                                                 //
  post: function() {                                                                                                 // 245
    return removeIntegration(this.bodyParams, this.user);                                                            // 246
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
Api.addRoute(':integrationId/:userId/:token', {                                                                      // 1
  authRequired: true                                                                                                 // 249
}, {                                                                                                                 //
  post: executeIntegrationRest,                                                                                      // 249
  get: executeIntegrationRest                                                                                        // 249
});                                                                                                                  //
                                                                                                                     //
Api.addRoute(':integrationId/:token', {                                                                              // 1
  authRequired: true                                                                                                 // 250
}, {                                                                                                                 //
  post: executeIntegrationRest,                                                                                      // 250
  get: executeIntegrationRest                                                                                        // 250
});                                                                                                                  //
                                                                                                                     //
Api.addRoute('sample/:integrationId/:userId/:token', {                                                               // 1
  authRequired: true                                                                                                 // 252
}, {                                                                                                                 //
  get: integrationSampleRest                                                                                         // 252
});                                                                                                                  //
                                                                                                                     //
Api.addRoute('sample/:integrationId/:token', {                                                                       // 1
  authRequired: true                                                                                                 // 253
}, {                                                                                                                 //
  get: integrationSampleRest                                                                                         // 253
});                                                                                                                  //
                                                                                                                     //
Api.addRoute('info/:integrationId/:userId/:token', {                                                                 // 1
  authRequired: true                                                                                                 // 255
}, {                                                                                                                 //
  get: integrationInfoRest                                                                                           // 255
});                                                                                                                  //
                                                                                                                     //
Api.addRoute('info/:integrationId/:token', {                                                                         // 1
  authRequired: true                                                                                                 // 256
}, {                                                                                                                 //
  get: integrationInfoRest                                                                                           // 256
});                                                                                                                  //
                                                                                                                     //
Api.addRoute('add/:integrationId/:userId/:token', {                                                                  // 1
  authRequired: true                                                                                                 // 258
}, {                                                                                                                 //
  post: addIntegrationRest                                                                                           // 258
});                                                                                                                  //
                                                                                                                     //
Api.addRoute('add/:integrationId/:token', {                                                                          // 1
  authRequired: true                                                                                                 // 259
}, {                                                                                                                 //
  post: addIntegrationRest                                                                                           // 259
});                                                                                                                  //
                                                                                                                     //
Api.addRoute('remove/:integrationId/:userId/:token', {                                                               // 1
  authRequired: true                                                                                                 // 261
}, {                                                                                                                 //
  post: removeIntegrationRest                                                                                        // 261
});                                                                                                                  //
                                                                                                                     //
Api.addRoute('remove/:integrationId/:token', {                                                                       // 1
  authRequired: true                                                                                                 // 262
}, {                                                                                                                 //
  post: removeIntegrationRest                                                                                        // 262
});                                                                                                                  //
                                                                                                                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/rocketchat_integrations/server/triggers.coffee.js                                                        //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var ExecuteTrigger, ExecuteTriggerUrl, ExecuteTriggers, compiledScripts, executeScript, getIntegrationScript, hasScriptAndMethod, triggers, vm;
                                                                                                                     //
vm = Npm.require('vm');                                                                                              // 1
                                                                                                                     //
compiledScripts = {};                                                                                                // 1
                                                                                                                     //
getIntegrationScript = function(integration) {                                                                       // 1
  var compiledScript, e, sandbox, script, store, vmScript;                                                           // 6
  compiledScript = compiledScripts[integration._id];                                                                 // 6
  if ((compiledScript != null) && +compiledScript._updatedAt === +integration._updatedAt) {                          // 7
    return compiledScript.script;                                                                                    // 8
  }                                                                                                                  //
  script = integration.scriptCompiled;                                                                               // 6
  vmScript = void 0;                                                                                                 // 6
  store = {};                                                                                                        // 6
  sandbox = {                                                                                                        // 6
    _: _,                                                                                                            // 14
    s: s,                                                                                                            // 14
    console: console,                                                                                                // 14
    Store: {                                                                                                         // 14
      set: function(key, val) {                                                                                      // 18
        return store[key] = val;                                                                                     // 19
      },                                                                                                             //
      get: function(key) {                                                                                           // 18
        return store[key];                                                                                           // 21
      }                                                                                                              //
    },                                                                                                               //
    HTTP: function(method, url, options) {                                                                           // 14
      var e;                                                                                                         // 23
      try {                                                                                                          // 23
        return {                                                                                                     // 24
          result: HTTP.call(method, url, options)                                                                    // 25
        };                                                                                                           //
      } catch (_error) {                                                                                             //
        e = _error;                                                                                                  // 27
        return {                                                                                                     // 27
          error: e                                                                                                   // 28
        };                                                                                                           //
      }                                                                                                              //
    }                                                                                                                //
  };                                                                                                                 //
  try {                                                                                                              // 30
    logger.outgoing.info('will evaluate script');                                                                    // 31
    logger.outgoing.debug(script);                                                                                   // 31
    vmScript = vm.createScript(script, 'script.js');                                                                 // 31
    vmScript.runInNewContext(sandbox);                                                                               // 31
    if (sandbox.Script != null) {                                                                                    // 38
      compiledScripts[integration._id] = {                                                                           // 39
        script: new sandbox.Script(),                                                                                // 40
        _updatedAt: integration._updatedAt                                                                           // 40
      };                                                                                                             //
      return compiledScripts[integration._id].script;                                                                // 43
    }                                                                                                                //
  } catch (_error) {                                                                                                 //
    e = _error;                                                                                                      // 45
    logger.outgoing.error("[Error evaluating Script:]");                                                             // 45
    logger.outgoing.error(script.replace(/^/gm, '  '));                                                              // 45
    logger.outgoing.error("[Stack:]");                                                                               // 45
    logger.outgoing.error(e.stack.replace(/^/gm, '  '));                                                             // 45
    throw new Meteor.Error('error-evaluating-script');                                                               // 49
  }                                                                                                                  //
  if (sandbox.Script == null) {                                                                                      // 51
    logger.outgoing.error("[Class 'Script' not found]");                                                             // 52
    throw new Meteor.Error('class-script-not-found');                                                                // 53
  }                                                                                                                  //
};                                                                                                                   // 5
                                                                                                                     //
triggers = {};                                                                                                       // 1
                                                                                                                     //
hasScriptAndMethod = function(integration, method) {                                                                 // 1
  var e, script;                                                                                                     // 59
  if (integration.scriptEnabled !== true || (integration.scriptCompiled == null) || integration.scriptCompiled.trim() === '') {
    return false;                                                                                                    // 60
  }                                                                                                                  //
  script = void 0;                                                                                                   // 59
  try {                                                                                                              // 63
    script = getIntegrationScript(integration);                                                                      // 64
  } catch (_error) {                                                                                                 //
    e = _error;                                                                                                      // 66
    return;                                                                                                          // 66
  }                                                                                                                  //
  return script[method] != null;                                                                                     // 68
};                                                                                                                   // 58
                                                                                                                     //
executeScript = function(integration, method, params) {                                                              // 1
  var e, result, script;                                                                                             // 71
  script = void 0;                                                                                                   // 71
  try {                                                                                                              // 72
    script = getIntegrationScript(integration);                                                                      // 73
  } catch (_error) {                                                                                                 //
    e = _error;                                                                                                      // 75
    return;                                                                                                          // 75
  }                                                                                                                  //
  if (script[method] == null) {                                                                                      // 77
    logger.outgoing.error("[Method '" + method + "' not found]");                                                    // 78
    return;                                                                                                          // 79
  }                                                                                                                  //
  try {                                                                                                              // 81
    result = script[method](params);                                                                                 // 82
    logger.outgoing.debug('result', result);                                                                         // 82
    return result;                                                                                                   // 86
  } catch (_error) {                                                                                                 //
    e = _error;                                                                                                      // 88
    logger.incoming.error("[Error running Script:]");                                                                // 88
    logger.incoming.error(integration.scriptCompiled.replace(/^/gm, '  '));                                          // 88
    logger.incoming.error("[Stack:]");                                                                               // 88
    logger.incoming.error(e.stack.replace(/^/gm, '  '));                                                             // 88
  }                                                                                                                  //
};                                                                                                                   // 70
                                                                                                                     //
RocketChat.models.Integrations.find({                                                                                // 1
  type: 'webhook-outgoing'                                                                                           // 95
}).observe({                                                                                                         //
  added: function(record) {                                                                                          // 96
    var channel, channels, i, len, results;                                                                          // 97
    if (_.isEmpty(record.channel)) {                                                                                 // 97
      channels = ['__any'];                                                                                          // 98
    } else {                                                                                                         //
      channels = [].concat(record.channel);                                                                          // 100
    }                                                                                                                //
    results = [];                                                                                                    // 102
    for (i = 0, len = channels.length; i < len; i++) {                                                               //
      channel = channels[i];                                                                                         //
      if (triggers[channel] == null) {                                                                               //
        triggers[channel] = {};                                                                                      //
      }                                                                                                              //
      results.push(triggers[channel][record._id] = record);                                                          // 103
    }                                                                                                                // 102
    return results;                                                                                                  //
  },                                                                                                                 //
  changed: function(record) {                                                                                        // 96
    var channel, channels, i, len, results;                                                                          // 107
    if (_.isEmpty(record.channel)) {                                                                                 // 107
      channels = ['__any'];                                                                                          // 108
    } else {                                                                                                         //
      channels = [].concat(record.channel);                                                                          // 110
    }                                                                                                                //
    results = [];                                                                                                    // 112
    for (i = 0, len = channels.length; i < len; i++) {                                                               //
      channel = channels[i];                                                                                         //
      if (triggers[channel] == null) {                                                                               //
        triggers[channel] = {};                                                                                      //
      }                                                                                                              //
      results.push(triggers[channel][record._id] = record);                                                          // 113
    }                                                                                                                // 112
    return results;                                                                                                  //
  },                                                                                                                 //
  removed: function(record) {                                                                                        // 96
    var channel, channels, i, len, results;                                                                          // 117
    if (_.isEmpty(record.channel)) {                                                                                 // 117
      channels = ['__any'];                                                                                          // 118
    } else {                                                                                                         //
      channels = [].concat(record.channel);                                                                          // 120
    }                                                                                                                //
    results = [];                                                                                                    // 122
    for (i = 0, len = channels.length; i < len; i++) {                                                               //
      channel = channels[i];                                                                                         //
      results.push(delete triggers[channel][record._id]);                                                            // 123
    }                                                                                                                // 122
    return results;                                                                                                  //
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
ExecuteTriggerUrl = function(url, trigger, message, room, tries) {                                                   // 1
  var data, i, len, opts, ref, ref1, sandbox, sendMessage, triggerWord, word;                                        // 127
  if (tries == null) {                                                                                               //
    tries = 0;                                                                                                       //
  }                                                                                                                  //
  word = void 0;                                                                                                     // 127
  if (((ref = trigger.triggerWords) != null ? ref.length : void 0) > 0) {                                            // 128
    ref1 = trigger.triggerWords;                                                                                     // 129
    for (i = 0, len = ref1.length; i < len; i++) {                                                                   // 129
      triggerWord = ref1[i];                                                                                         //
      if (message.msg.indexOf(triggerWord) === 0) {                                                                  // 130
        word = triggerWord;                                                                                          // 131
        break;                                                                                                       // 132
      }                                                                                                              //
    }                                                                                                                // 129
    if (word == null) {                                                                                              // 135
      return;                                                                                                        // 136
    }                                                                                                                //
  }                                                                                                                  //
  data = {                                                                                                           // 127
    token: trigger.token,                                                                                            // 139
    channel_id: room._id,                                                                                            // 139
    channel_name: room.name,                                                                                         // 139
    timestamp: message.ts,                                                                                           // 139
    user_id: message.u._id,                                                                                          // 139
    user_name: message.u.username,                                                                                   // 139
    text: message.msg                                                                                                // 139
  };                                                                                                                 //
  if (message.alias != null) {                                                                                       // 147
    data.alias = message.alias;                                                                                      // 148
  }                                                                                                                  //
  if (message.bot != null) {                                                                                         // 150
    data.bot = message.bot;                                                                                          // 151
  } else {                                                                                                           //
    data.bot = false;                                                                                                // 153
  }                                                                                                                  //
  if (word != null) {                                                                                                // 155
    data.trigger_word = word;                                                                                        // 156
  }                                                                                                                  //
  sendMessage = function(message) {                                                                                  // 127
    var defaultValues, user;                                                                                         // 159
    user = RocketChat.models.Users.findOneByUsername(trigger.username);                                              // 159
    message.bot = {                                                                                                  // 159
      i: trigger._id                                                                                                 // 162
    };                                                                                                               //
    defaultValues = {                                                                                                // 159
      alias: trigger.alias,                                                                                          // 165
      avatar: trigger.avatar,                                                                                        // 165
      emoji: trigger.emoji                                                                                           // 165
    };                                                                                                               //
    if (room.t === 'd') {                                                                                            // 169
      message.channel = '@' + room._id;                                                                              // 170
    } else {                                                                                                         //
      message.channel = '#' + room._id;                                                                              // 172
    }                                                                                                                //
    return message = processWebhookMessage(message, user, defaultValues);                                            //
  };                                                                                                                 //
  opts = {                                                                                                           // 127
    params: {},                                                                                                      // 178
    method: 'POST',                                                                                                  // 178
    url: url,                                                                                                        // 178
    data: data,                                                                                                      // 178
    auth: void 0,                                                                                                    // 178
    npmRequestOptions: {                                                                                             // 178
      rejectUnauthorized: !RocketChat.settings.get('Allow_Invalid_SelfSigned_Certs'),                                // 184
      strictSSL: !RocketChat.settings.get('Allow_Invalid_SelfSigned_Certs')                                          // 184
    },                                                                                                               //
    headers: {                                                                                                       // 178
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.0 Safari/537.36'
    }                                                                                                                //
  };                                                                                                                 //
  if (hasScriptAndMethod(trigger, 'prepare_outgoing_request')) {                                                     // 189
    sandbox = {                                                                                                      // 190
      request: opts                                                                                                  // 191
    };                                                                                                               //
    opts = executeScript(trigger, 'prepare_outgoing_request', sandbox);                                              // 190
  }                                                                                                                  //
  if (opts == null) {                                                                                                // 195
    return;                                                                                                          // 196
  }                                                                                                                  //
  if (opts.message != null) {                                                                                        // 198
    sendMessage(opts.message);                                                                                       // 199
  }                                                                                                                  //
  if ((opts.url == null) || (opts.method == null)) {                                                                 // 201
    return;                                                                                                          // 202
  }                                                                                                                  //
  return HTTP.call(opts.method, opts.url, opts, function(error, result) {                                            //
    var ref2, ref3, ref4, ref5, scriptResult;                                                                        // 205
    scriptResult = void 0;                                                                                           // 205
    if (hasScriptAndMethod(trigger, 'process_outgoing_response')) {                                                  // 206
      sandbox = {                                                                                                    // 207
        request: opts,                                                                                               // 208
        response: {                                                                                                  // 208
          error: error,                                                                                              // 210
          status_code: result.statusCode,                                                                            // 210
          content: result.data,                                                                                      // 210
          content_raw: result.content,                                                                               // 210
          headers: result.headers                                                                                    // 210
        }                                                                                                            //
      };                                                                                                             //
      scriptResult = executeScript(trigger, 'process_outgoing_response', sandbox);                                   // 207
      if (scriptResult != null ? scriptResult.content : void 0) {                                                    // 218
        sendMessage(scriptResult.content);                                                                           // 219
        return;                                                                                                      // 220
      }                                                                                                              //
      if (scriptResult === false) {                                                                                  // 222
        return;                                                                                                      // 223
      }                                                                                                              //
    }                                                                                                                //
    if ((result == null) || ((ref2 = result.statusCode) !== 200 && ref2 !== 201 && ref2 !== 202)) {                  // 225
      if (error != null) {                                                                                           // 226
        logger.outgoing.error(error);                                                                                // 227
      }                                                                                                              //
      if (result != null) {                                                                                          // 228
        logger.outgoing.error(result);                                                                               // 229
      }                                                                                                              //
      if (result.statusCode === 410) {                                                                               // 231
        RocketChat.models.Integrations.remove({                                                                      // 232
          _id: trigger._id                                                                                           // 232
        });                                                                                                          //
        return;                                                                                                      // 233
      }                                                                                                              //
      if (result.statusCode === 500) {                                                                               // 235
        logger.outgoing.error('Request Error [500]', url);                                                           // 236
        logger.outgoing.error(result.content);                                                                       // 236
        return;                                                                                                      // 238
      }                                                                                                              //
      if (tries <= 6) {                                                                                              // 240
        Meteor.setTimeout(function() {                                                                               // 242
          return ExecuteTriggerUrl(url, trigger, message, room, tries + 1);                                          //
        }, Math.pow(10, tries + 2));                                                                                 //
      }                                                                                                              //
      return;                                                                                                        // 246
    }                                                                                                                //
    if ((ref3 = result != null ? result.statusCode : void 0) === 200 || ref3 === 201 || ref3 === 202) {              // 249
      if (((result != null ? (ref4 = result.data) != null ? ref4.text : void 0 : void 0) != null) || ((result != null ? (ref5 = result.data) != null ? ref5.attachments : void 0 : void 0) != null)) {
        return sendMessage(result.data);                                                                             //
      }                                                                                                              //
    }                                                                                                                //
  });                                                                                                                //
};                                                                                                                   // 126
                                                                                                                     //
ExecuteTrigger = function(trigger, message, room) {                                                                  // 1
  var i, len, ref, results, url;                                                                                     // 255
  ref = trigger.urls;                                                                                                // 255
  results = [];                                                                                                      // 255
  for (i = 0, len = ref.length; i < len; i++) {                                                                      //
    url = ref[i];                                                                                                    //
    results.push(ExecuteTriggerUrl(url, trigger, message, room));                                                    // 256
  }                                                                                                                  // 255
  return results;                                                                                                    //
};                                                                                                                   // 254
                                                                                                                     //
ExecuteTriggers = function(message, room) {                                                                          // 1
  var i, id, key, len, ref, ref1, ref2, ref3, ref4, ref5, ref6, trigger, triggerToExecute, triggersToExecute, username;
  if (room == null) {                                                                                                // 260
    return;                                                                                                          // 261
  }                                                                                                                  //
  triggersToExecute = [];                                                                                            // 260
  switch (room.t) {                                                                                                  // 265
    case 'd':                                                                                                        // 265
      id = room._id.replace(message.u._id, '');                                                                      // 267
      username = _.without(room.usernames, message.u.username);                                                      // 267
      username = username[0];                                                                                        // 267
      if (triggers['@' + id] != null) {                                                                              // 272
        ref = triggers['@' + id];                                                                                    // 273
        for (key in ref) {                                                                                           // 273
          trigger = ref[key];                                                                                        //
          triggersToExecute.push(trigger);                                                                           // 273
        }                                                                                                            // 273
      }                                                                                                              //
      if (id !== username && (triggers['@' + username] != null)) {                                                   // 275
        ref1 = triggers['@' + username];                                                                             // 276
        for (key in ref1) {                                                                                          // 276
          trigger = ref1[key];                                                                                       //
          triggersToExecute.push(trigger);                                                                           // 276
        }                                                                                                            // 276
      }                                                                                                              //
      break;                                                                                                         // 266
    case 'c':                                                                                                        // 265
      if (triggers.__any != null) {                                                                                  // 279
        ref2 = triggers.__any;                                                                                       // 280
        for (key in ref2) {                                                                                          // 280
          trigger = ref2[key];                                                                                       //
          triggersToExecute.push(trigger);                                                                           // 280
        }                                                                                                            // 280
      }                                                                                                              //
      if (triggers['#' + room._id] != null) {                                                                        // 282
        ref3 = triggers['#' + room._id];                                                                             // 283
        for (key in ref3) {                                                                                          // 283
          trigger = ref3[key];                                                                                       //
          triggersToExecute.push(trigger);                                                                           // 283
        }                                                                                                            // 283
      }                                                                                                              //
      if (room._id !== room.name && (triggers['#' + room.name] != null)) {                                           // 285
        ref4 = triggers['#' + room.name];                                                                            // 286
        for (key in ref4) {                                                                                          // 286
          trigger = ref4[key];                                                                                       //
          triggersToExecute.push(trigger);                                                                           // 286
        }                                                                                                            // 286
      }                                                                                                              //
      break;                                                                                                         // 278
    default:                                                                                                         // 265
      if (triggers['#' + room._id] != null) {                                                                        // 289
        ref5 = triggers['#' + room._id];                                                                             // 290
        for (key in ref5) {                                                                                          // 290
          trigger = ref5[key];                                                                                       //
          triggersToExecute.push(trigger);                                                                           // 290
        }                                                                                                            // 290
      }                                                                                                              //
      if (room._id !== room.name && (triggers['#' + room.name] != null)) {                                           // 292
        ref6 = triggers['#' + room.name];                                                                            // 293
        for (key in ref6) {                                                                                          // 293
          trigger = ref6[key];                                                                                       //
          triggersToExecute.push(trigger);                                                                           // 293
        }                                                                                                            // 293
      }                                                                                                              //
  }                                                                                                                  // 265
  for (i = 0, len = triggersToExecute.length; i < len; i++) {                                                        // 296
    triggerToExecute = triggersToExecute[i];                                                                         //
    if (triggerToExecute.enabled === true) {                                                                         // 297
      ExecuteTrigger(triggerToExecute, message, room);                                                               // 298
    }                                                                                                                //
  }                                                                                                                  // 296
  return message;                                                                                                    // 300
};                                                                                                                   // 259
                                                                                                                     //
RocketChat.callbacks.add('afterSaveMessage', ExecuteTriggers, RocketChat.callbacks.priority.LOW, 'ExecuteTriggers');
                                                                                                                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/rocketchat_integrations/server/processWebhookMessage.js                                                  //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
this.processWebhookMessage = function (messageObj, user, defaultValues) {                                            // 1
	var attachment, channel, channels, channelType, i, len, message, ref, rid, room, roomUser, ret;                     // 2
	ret = [];                                                                                                           // 3
                                                                                                                     //
	if (!defaultValues) {                                                                                               // 5
		defaultValues = {                                                                                                  // 6
			channel: '',                                                                                                      // 7
			alias: '',                                                                                                        // 8
			avatar: '',                                                                                                       // 9
			emoji: ''                                                                                                         // 10
		};                                                                                                                 //
	}                                                                                                                   //
                                                                                                                     //
	channel = messageObj.channel || defaultValues.channel;                                                              // 14
                                                                                                                     //
	channels = [].concat(channel);                                                                                      // 16
                                                                                                                     //
	for (var _iterator = channels, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
		if (_isArray) {                                                                                                    //
			if (_i >= _iterator.length) break;                                                                                //
			channel = _iterator[_i++];                                                                                        // 18
		} else {                                                                                                           //
			_i = _iterator.next();                                                                                            //
			if (_i.done) break;                                                                                               //
			channel = _i.value;                                                                                               // 18
		}                                                                                                                  //
                                                                                                                     //
		channelType = channel[0];                                                                                          // 19
                                                                                                                     //
		channel = channel.substr(1);                                                                                       // 21
                                                                                                                     //
		switch (channelType) {                                                                                             // 23
			case '#':                                                                                                         // 24
				room = RocketChat.models.Rooms.findOne({                                                                         // 25
					$or: [{                                                                                                         // 26
						_id: channel                                                                                                   // 28
					}, {                                                                                                            //
						name: channel                                                                                                  // 30
					}]                                                                                                              //
				});                                                                                                              //
				if (!_.isObject(room)) {                                                                                         // 34
					throw new Meteor.Error('invalid-channel');                                                                      // 35
				}                                                                                                                //
				rid = room._id;                                                                                                  // 37
				if (room.t === 'c') {                                                                                            // 38
					Meteor.runAsUser(user._id, function () {                                                                        // 39
						return Meteor.call('joinRoom', room._id);                                                                      // 40
					});                                                                                                             //
				}                                                                                                                //
				break;                                                                                                           // 43
			case '@':                                                                                                         // 44
				roomUser = RocketChat.models.Users.findOne({                                                                     // 45
					$or: [{                                                                                                         // 46
						_id: channel                                                                                                   // 48
					}, {                                                                                                            //
						username: channel                                                                                              // 50
					}]                                                                                                              //
				}) || {};                                                                                                        //
				rid = [user._id, roomUser._id].sort().join('');                                                                  // 54
				room = RocketChat.models.Rooms.findOne({                                                                         // 55
					_id: {                                                                                                          // 56
						$in: [rid, channel]                                                                                            // 57
					}                                                                                                               //
				});                                                                                                              //
				if (!_.isObject(roomUser) && !_.isObject(room)) {                                                                // 60
					throw new Meteor.Error('invalid-channel');                                                                      // 61
				}                                                                                                                //
				if (!room) {                                                                                                     // 63
					Meteor.runAsUser(user._id, function () {                                                                        // 64
						Meteor.call('createDirectMessage', roomUser.username);                                                         // 65
						room = RocketChat.models.Rooms.findOne(rid);                                                                   // 66
					});                                                                                                             //
				}                                                                                                                //
				break;                                                                                                           // 69
			default:                                                                                                          // 70
				throw new Meteor.Error('invalid-channel-type');                                                                  // 71
		}                                                                                                                  // 71
                                                                                                                     //
		if (messageObj.attachments && !_.isArray(messageObj.attachments)) {                                                // 74
			console.log('Attachments should be Array, ignoring value'.red, messageObj.attachments);                           // 75
			messageObj.attachments = undefined;                                                                               // 76
		}                                                                                                                  //
                                                                                                                     //
		message = {                                                                                                        // 79
			alias: messageObj.username || messageObj.alias || defaultValues.alias,                                            // 80
			msg: _.trim(messageObj.text || messageObj.msg || ''),                                                             // 81
			attachments: messageObj.attachments,                                                                              // 82
			parseUrls: messageObj.parseUrls !== undefined ? messageObj.parseUrls : !messageObj.attachments,                   // 83
			bot: messageObj.bot,                                                                                              // 84
			groupable: false                                                                                                  // 85
		};                                                                                                                 //
                                                                                                                     //
		if (!_.isEmpty(messageObj.icon_url) || !_.isEmpty(messageObj.avatar)) {                                            // 88
			message.avatar = messageObj.icon_url || messageObj.avatar;                                                        // 89
		} else if (!_.isEmpty(messageObj.icon_emoji) || !_.isEmpty(messageObj.emoji)) {                                    //
			message.emoji = messageObj.icon_emoji || messageObj.emoji;                                                        // 91
		} else if (!_.isEmpty(defaultValues.avatar)) {                                                                     //
			message.avatar = defaultValues.avatar;                                                                            // 93
		} else if (!_.isEmpty(defaultValues.emoji)) {                                                                      //
			message.emoji = defaultValues.emoji;                                                                              // 95
		}                                                                                                                  //
                                                                                                                     //
		if (_.isArray(message.attachments)) {                                                                              // 98
			ref = message.attachments;                                                                                        // 99
			for (i = 0, len = ref.length; i < len; i++) {                                                                     // 100
				attachment = ref[i];                                                                                             // 101
				if (attachment.msg) {                                                                                            // 102
					attachment.text = _.trim(attachment.msg);                                                                       // 103
					delete attachment.msg;                                                                                          // 104
				}                                                                                                                //
			}                                                                                                                 //
		}                                                                                                                  //
                                                                                                                     //
		var messageReturn = RocketChat.sendMessage(user, message, room);                                                   // 109
		ret.push({ channel: channel, message: messageReturn });                                                            // 110
	}                                                                                                                   //
	return ret;                                                                                                         // 112
};                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:integrations'] = {};

})();

//# sourceMappingURL=rocketchat_integrations.js.map
