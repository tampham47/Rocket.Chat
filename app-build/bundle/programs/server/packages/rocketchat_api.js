(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var Restivus = Package['nimble:restivus'].Restivus;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/rocketchat_api/server/api.coffee.js                                                                 //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var API,                                                                                                        // 1
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;                                                                                  //
                                                                                                                //
API = (function(superClass) {                                                                                   // 1
  extend(API, superClass);                                                                                      // 2
                                                                                                                //
  function API() {                                                                                              // 2
    this.authMethods = [];                                                                                      // 3
    API.__super__.constructor.apply(this, arguments);                                                           // 3
  }                                                                                                             //
                                                                                                                //
  API.prototype.addAuthMethod = function(method) {                                                              // 2
    return this.authMethods.push(method);                                                                       //
  };                                                                                                            //
                                                                                                                //
  API.prototype.success = function(result) {                                                                    // 2
    if (result == null) {                                                                                       //
      result = {};                                                                                              //
    }                                                                                                           //
    if (_.isObject(result)) {                                                                                   // 10
      result.success = true;                                                                                    // 11
    }                                                                                                           //
    return {                                                                                                    // 13
      statusCode: 200,                                                                                          // 14
      body: result                                                                                              // 14
    };                                                                                                          //
  };                                                                                                            //
                                                                                                                //
  API.prototype.failure = function(result) {                                                                    // 2
    if (_.isObject(result)) {                                                                                   // 18
      result.success = false;                                                                                   // 19
    } else {                                                                                                    //
      result = {                                                                                                // 21
        success: false,                                                                                         // 22
        error: result                                                                                           // 22
      };                                                                                                        //
    }                                                                                                           //
    return {                                                                                                    // 25
      statusCode: 400,                                                                                          // 26
      body: result                                                                                              // 26
    };                                                                                                          //
  };                                                                                                            //
                                                                                                                //
  API.prototype.unauthorized = function(msg) {                                                                  // 2
    return {                                                                                                    // 30
      statusCode: 401,                                                                                          // 31
      body: {                                                                                                   // 31
        success: false,                                                                                         // 33
        error: msg || 'unauthorized'                                                                            // 33
      }                                                                                                         //
    };                                                                                                          //
  };                                                                                                            //
                                                                                                                //
  return API;                                                                                                   //
                                                                                                                //
})(Restivus);                                                                                                   //
                                                                                                                //
RocketChat.API = {};                                                                                            // 1
                                                                                                                //
RocketChat.API.v1 = new API({                                                                                   // 1
  version: 'v1',                                                                                                // 41
  useDefaultAuth: true,                                                                                         // 41
  prettyJson: false,                                                                                            // 41
  enableCors: false,                                                                                            // 41
  auth: {                                                                                                       // 41
    token: 'services.resume.loginTokens.hashedToken',                                                           // 46
    user: function() {                                                                                          // 46
      var i, len, method, ref, ref1, result, token;                                                             // 48
      if (((ref = this.bodyParams) != null ? ref.payload : void 0) != null) {                                   // 48
        this.bodyParams = JSON.parse(this.bodyParams.payload);                                                  // 49
      }                                                                                                         //
      ref1 = RocketChat.API.v1.authMethods;                                                                     // 51
      for (i = 0, len = ref1.length; i < len; i++) {                                                            // 51
        method = ref1[i];                                                                                       //
        result = method.apply(this, arguments);                                                                 // 52
        if (result !== (void 0) && result !== null && result !== false) {                                       // 53
          return result;                                                                                        // 54
        }                                                                                                       //
      }                                                                                                         // 51
      if (this.request.headers['x-auth-token']) {                                                               // 56
        token = Accounts._hashLoginToken(this.request.headers['x-auth-token']);                                 // 57
      }                                                                                                         //
      return {                                                                                                  // 59
        userId: this.request.headers['x-user-id'],                                                              // 60
        token: token                                                                                            // 60
      };                                                                                                        //
    }                                                                                                           //
  }                                                                                                             //
});                                                                                                             //
                                                                                                                //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/rocketchat_api/server/routes.coffee.js                                                              //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.API.v1.addRoute('info', {                                                                            // 1
  authRequired: false                                                                                           // 1
}, {                                                                                                            //
  get: function() {                                                                                             // 2
    return RocketChat.Info;                                                                                     //
  }                                                                                                             //
});                                                                                                             //
                                                                                                                //
RocketChat.API.v1.addRoute('me', {                                                                              // 1
  authRequired: true                                                                                            // 5
}, {                                                                                                            //
  get: function() {                                                                                             // 6
    return _.pick(this.user, ['_id', 'name', 'emails', 'status', 'statusConnection', 'username', 'utcOffset', 'active', 'language']);
  }                                                                                                             //
});                                                                                                             //
                                                                                                                //
RocketChat.API.v1.addRoute('chat.messageExamples', {                                                            // 1
  authRequired: true                                                                                            // 21
}, {                                                                                                            //
  get: function() {                                                                                             // 22
    return RocketChat.API.v1.success({                                                                          // 23
      body: [                                                                                                   // 24
        {                                                                                                       //
          token: Random.id(24),                                                                                 // 25
          channel_id: Random.id(),                                                                              // 25
          channel_name: 'general',                                                                              // 25
          timestamp: new Date,                                                                                  // 25
          user_id: Random.id(),                                                                                 // 25
          user_name: 'rocket.cat',                                                                              // 25
          text: 'Sample text 1',                                                                                // 25
          trigger_word: 'Sample'                                                                                // 25
        }, {                                                                                                    //
          token: Random.id(24),                                                                                 // 34
          channel_id: Random.id(),                                                                              // 34
          channel_name: 'general',                                                                              // 34
          timestamp: new Date,                                                                                  // 34
          user_id: Random.id(),                                                                                 // 34
          user_name: 'rocket.cat',                                                                              // 34
          text: 'Sample text 2',                                                                                // 34
          trigger_word: 'Sample'                                                                                // 34
        }, {                                                                                                    //
          token: Random.id(24),                                                                                 // 43
          channel_id: Random.id(),                                                                              // 43
          channel_name: 'general',                                                                              // 43
          timestamp: new Date,                                                                                  // 43
          user_id: Random.id(),                                                                                 // 43
          user_name: 'rocket.cat',                                                                              // 43
          text: 'Sample text 3',                                                                                // 43
          trigger_word: 'Sample'                                                                                // 43
        }                                                                                                       //
      ]                                                                                                         //
    });                                                                                                         //
  }                                                                                                             //
});                                                                                                             //
                                                                                                                //
RocketChat.API.v1.addRoute('chat.postMessage', {                                                                // 1
  authRequired: true                                                                                            // 55
}, {                                                                                                            //
  post: function() {                                                                                            // 56
    var e, messageReturn;                                                                                       // 57
    try {                                                                                                       // 57
      messageReturn = processWebhookMessage(this.bodyParams, this.user);                                        // 58
      if (messageReturn == null) {                                                                              // 60
        return RocketChat.API.v1.failure('unknown-error');                                                      // 61
      }                                                                                                         //
      return RocketChat.API.v1.success({                                                                        // 63
        ts: Date.now(),                                                                                         // 64
        channel: messageReturn.channel,                                                                         // 64
        message: messageReturn.message                                                                          // 64
      });                                                                                                       //
    } catch (_error) {                                                                                          //
      e = _error;                                                                                               // 68
      return RocketChat.API.v1.failure(e.error);                                                                // 68
    }                                                                                                           //
  }                                                                                                             //
});                                                                                                             //
                                                                                                                //
RocketChat.API.v1.addRoute('channels.setTopic', {                                                               // 1
  authRequired: true                                                                                            // 71
}, {                                                                                                            //
  post: function() {                                                                                            // 72
    if (this.bodyParams.channel == null) {                                                                      // 73
      return RocketChat.API.v1.failure('Body param "channel" is required');                                     // 74
    }                                                                                                           //
    if (this.bodyParams.topic == null) {                                                                        // 76
      return RocketChat.API.v1.failure('Body param "topic" is required');                                       // 77
    }                                                                                                           //
    if (!RocketChat.authz.hasPermission(this.userId, 'edit-room', this.bodyParams.channel)) {                   // 79
      return RocketChat.API.v1.unauthorized();                                                                  // 80
    }                                                                                                           //
    if (!RocketChat.saveRoomTopic(this.bodyParams.channel, this.bodyParams.topic, this.user)) {                 // 82
      return RocketChat.API.v1.failure('invalid_channel');                                                      // 83
    }                                                                                                           //
    return RocketChat.API.v1.success({                                                                          // 85
      topic: this.bodyParams.topic                                                                              // 86
    });                                                                                                         //
  }                                                                                                             //
});                                                                                                             //
                                                                                                                //
RocketChat.API.v1.addRoute('channels.create', {                                                                 // 1
  authRequired: true                                                                                            // 90
}, {                                                                                                            //
  post: function() {                                                                                            // 91
    var e, id;                                                                                                  // 92
    if (this.bodyParams.name == null) {                                                                         // 92
      return RocketChat.API.v1.failure('Body param "name" is required');                                        // 93
    }                                                                                                           //
    if (!RocketChat.authz.hasPermission(this.userId, 'create-c')) {                                             // 95
      return RocketChat.API.v1.unauthorized();                                                                  // 96
    }                                                                                                           //
    id = void 0;                                                                                                // 92
    try {                                                                                                       // 99
      Meteor.runAsUser(this.userId, (function(_this) {                                                          // 100
        return function() {                                                                                     //
          return id = Meteor.call('createChannel', _this.bodyParams.name, []);                                  //
        };                                                                                                      //
      })(this));                                                                                                //
    } catch (_error) {                                                                                          //
      e = _error;                                                                                               // 103
      return RocketChat.API.v1.failure(e.name + ': ' + e.message);                                              // 103
    }                                                                                                           //
    return RocketChat.API.v1.success({                                                                          // 105
      channel: RocketChat.models.Rooms.findOne({                                                                // 106
        _id: id.rid                                                                                             // 106
      })                                                                                                        //
    });                                                                                                         //
  }                                                                                                             //
});                                                                                                             //
                                                                                                                //
RocketChat.API.v1.addRoute('groups.list', {                                                                     // 1
  authRequired: true                                                                                            // 109
}, {                                                                                                            //
  get: function() {                                                                                             // 110
    var roomIds;                                                                                                // 111
    roomIds = _.pluck(RocketChat.models.Subscriptions.findByTypeAndUserId('p', this.userId).fetch(), 'rid');    // 111
    return {                                                                                                    // 112
      groups: RocketChat.models.Rooms.findByIds(roomIds).fetch()                                                // 112
    };                                                                                                          //
  }                                                                                                             //
});                                                                                                             //
                                                                                                                //
RocketChat.API.v1.addRoute('channel.addall', {                                                                  // 1
  authRequired: true                                                                                            // 115
}, {                                                                                                            //
  post: function() {                                                                                            // 116
    var e, id;                                                                                                  // 118
    id = void 0;                                                                                                // 118
    try {                                                                                                       // 119
      Meteor.runAsUser(this.userId, (function(_this) {                                                          // 120
        return function() {                                                                                     //
          return id = Meteor.call('addAllUserToRoom', _this.bodyParams.roomId, []);                             //
        };                                                                                                      //
      })(this));                                                                                                //
    } catch (_error) {                                                                                          //
      e = _error;                                                                                               // 123
      return RocketChat.API.v1.failure(e.name + ': ' + e.message);                                              // 123
    }                                                                                                           //
    return RocketChat.API.v1.success({                                                                          // 125
      channel: RocketChat.models.Rooms.findOne({                                                                // 126
        _id: this.bodyParams.roomId                                                                             // 126
      })                                                                                                        //
    });                                                                                                         //
  }                                                                                                             //
});                                                                                                             //
                                                                                                                //
RocketChat.API.v1.addRoute('users.list', {                                                                      // 1
  authRequired: true                                                                                            // 129
}, {                                                                                                            //
  get: function() {                                                                                             // 130
    if (RocketChat.authz.hasRole(this.userId, 'admin') === false) {                                             // 131
      return RocketChat.API.v1.unauthorized();                                                                  // 132
    }                                                                                                           //
    return {                                                                                                    // 134
      users: RocketChat.models.Users.find().fetch()                                                             // 134
    };                                                                                                          //
  }                                                                                                             //
});                                                                                                             //
                                                                                                                //
RocketChat.API.v1.addRoute('user.info', {                                                                       // 1
  authRequired: true                                                                                            // 137
}, {                                                                                                            //
  post: function() {                                                                                            // 138
    if (RocketChat.authz.hasRole(this.userId, 'admin') === false) {                                             // 139
      return RocketChat.API.v1.unauthorized();                                                                  // 140
    }                                                                                                           //
    return {                                                                                                    // 142
      user: RocketChat.models.Users.findOneByUsername(this.bodyParams.name)                                     // 142
    };                                                                                                          //
  }                                                                                                             //
});                                                                                                             //
                                                                                                                //
RocketChat.API.v1.addRoute('user.getpresence', {                                                                // 1
  authRequired: true                                                                                            // 145
}, {                                                                                                            //
  post: function() {                                                                                            // 146
    return {                                                                                                    // 147
      user: RocketChat.models.Users.findOne({                                                                   // 147
        username: this.bodyParams.name                                                                          // 147
      }, {                                                                                                      //
        fields: {                                                                                               // 147
          status: 1                                                                                             // 147
        }                                                                                                       //
      })                                                                                                        //
    };                                                                                                          //
  }                                                                                                             //
});                                                                                                             //
                                                                                                                //
RocketChat.API.v1.addRoute('users.delete', {                                                                    // 1
  authRequired: true                                                                                            // 150
}, {                                                                                                            //
  post: function() {                                                                                            // 151
    var e, id;                                                                                                  // 152
    if (this.bodyParams.userId == null) {                                                                       // 152
      return RocketChat.API.v1.failure('Body param "userId" is required');                                      // 153
    }                                                                                                           //
    if (!RocketChat.authz.hasPermission(this.userId, 'delete-user')) {                                          // 155
      return RocketChat.API.v1.unauthorized();                                                                  // 156
    }                                                                                                           //
    id = void 0;                                                                                                // 152
    try {                                                                                                       // 159
      Meteor.runAsUser(this.userId, (function(_this) {                                                          // 160
        return function() {                                                                                     //
          return id = Meteor.call('deleteUser', _this.bodyParams.userId, []);                                   //
        };                                                                                                      //
      })(this));                                                                                                //
    } catch (_error) {                                                                                          //
      e = _error;                                                                                               // 163
      return RocketChat.API.v1.failure(e.name + ': ' + e.message);                                              // 163
    }                                                                                                           //
    return RocketChat.API.v1.success;                                                                           // 165
  }                                                                                                             //
});                                                                                                             //
                                                                                                                //
RocketChat.API.v1.addRoute('groups.create', {                                                                   // 1
  authRequired: true                                                                                            // 168
}, {                                                                                                            //
  post: function() {                                                                                            // 169
    var e, id;                                                                                                  // 170
    if (this.bodyParams.name == null) {                                                                         // 170
      return RocketChat.API.v1.failure('Body param "name" is required');                                        // 171
    }                                                                                                           //
    if (!RocketChat.authz.hasPermission(this.userId, 'create-p')) {                                             // 173
      return RocketChat.API.v1.unauthorized();                                                                  // 174
    }                                                                                                           //
    id = void 0;                                                                                                // 170
    try {                                                                                                       // 177
      if (this.bodyParams.members == null) {                                                                    // 178
        Meteor.runAsUser(this.userId, (function(_this) {                                                        // 179
          return function() {                                                                                   //
            return id = Meteor.call('createPrivateGroup', _this.bodyParams.name, []);                           //
          };                                                                                                    //
        })(this));                                                                                              //
      } else {                                                                                                  //
        Meteor.runAsUser(this.userId, (function(_this) {                                                        // 182
          return function() {                                                                                   //
            return id = Meteor.call('createPrivateGroup', _this.bodyParams.name, _this.bodyParams.members, []);
          };                                                                                                    //
        })(this));                                                                                              //
      }                                                                                                         //
    } catch (_error) {                                                                                          //
      e = _error;                                                                                               // 185
      return RocketChat.API.v1.failure(e.name + ': ' + e.message);                                              // 185
    }                                                                                                           //
    return RocketChat.API.v1.success({                                                                          // 187
      group: RocketChat.models.Rooms.findOne({                                                                  // 188
        _id: id.rid                                                                                             // 188
      })                                                                                                        //
    });                                                                                                         //
  }                                                                                                             //
});                                                                                                             //
                                                                                                                //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:api'] = {};

})();

//# sourceMappingURL=rocketchat_api.js.map
