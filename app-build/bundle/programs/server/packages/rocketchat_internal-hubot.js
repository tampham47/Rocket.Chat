(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var s = Package['underscorestring:underscore.string'].s;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

/* Package-scope variables */
var __coffeescriptShare, Hubot, RocketChatAdapter, InternalHubotReceiver, HubotScripts, InternalHubot;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_internal-hubot/hubot.coffee.js                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var CoffeeScript, DEBUG, Robot, bind, fs, init, path, sendHelper,                                                                              
  slice = [].slice,                                                                                                    //
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;                                                                                         //
                                                                                                                       //
CoffeeScript = Npm.require('coffee-script');                                                                           // 1
                                                                                                                       //
CoffeeScript.register();                                                                                               // 1
                                                                                                                       //
Hubot = Npm.require('hubot');                                                                                          // 1
                                                                                                                       //
fs = Npm.require('fs');                                                                                                // 1
                                                                                                                       //
path = Npm.require('path');                                                                                            // 1
                                                                                                                       //
DEBUG = false;                                                                                                         // 1
                                                                                                                       //
Hubot.Response.prototype.priv = function() {                                                                           // 1
  var ref, strings;                                                                                                    // 17
  strings = 1 <= arguments.length ? slice.call(arguments, 0) : [];                                                     // 17
  return (ref = this.robot.adapter).priv.apply(ref, [this.envelope].concat(slice.call(strings)));                      //
};                                                                                                                     // 16
                                                                                                                       //
Hubot.Robot.prototype.loadAdapter = function() {};                                                                     // 1
                                                                                                                       //
bind = function(f) {                                                                                                   // 1
  var g;                                                                                                               // 24
  g = Meteor.bindEnvironment(function() {                                                                              // 24
    var args, self;                                                                                                    // 24
    self = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];                                 // 24
    return f.apply(self, args);                                                                                        //
  });                                                                                                                  //
  return function() {                                                                                                  //
    var args;                                                                                                          // 25
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];                                                      // 25
    return g.apply(null, [this].concat(slice.call(args)));                                                             //
  };                                                                                                                   //
};                                                                                                                     // 23
                                                                                                                       //
Robot = (function(superClass) {                                                                                        // 1
  extend(Robot, superClass);                                                                                           // 28
                                                                                                                       //
  function Robot() {                                                                                                   // 28
    var args;                                                                                                          // 29
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];                                                      // 29
    Robot.__super__.constructor.apply(this, args);                                                                     // 29
    this.hear = bind(this.hear);                                                                                       // 29
    this.respond = bind(this.respond);                                                                                 // 29
    this.enter = bind(this.enter);                                                                                     // 29
    this.leave = bind(this.leave);                                                                                     // 29
    this.topic = bind(this.topic);                                                                                     // 29
    this.error = bind(this.error);                                                                                     // 29
    this.catchAll = bind(this.catchAll);                                                                               // 29
    this.user = Meteor.users.findOne({                                                                                 // 29
      username: this.name                                                                                              // 37
    }, {                                                                                                               //
      fields: {                                                                                                        // 37
        username: 1                                                                                                    // 37
      }                                                                                                                //
    });                                                                                                                //
  }                                                                                                                    //
                                                                                                                       //
  Robot.prototype.loadAdapter = function() {                                                                           // 28
    return false;                                                                                                      //
  };                                                                                                                   //
                                                                                                                       //
  Robot.prototype.hear = function(regex, callback) {                                                                   // 28
    return Robot.__super__.hear.call(this, regex, Meteor.bindEnvironment(callback));                                   //
  };                                                                                                                   //
                                                                                                                       //
  Robot.prototype.respond = function(regex, callback) {                                                                // 28
    return Robot.__super__.respond.call(this, regex, Meteor.bindEnvironment(callback));                                //
  };                                                                                                                   //
                                                                                                                       //
  Robot.prototype.enter = function(callback) {                                                                         // 28
    return Robot.__super__.enter.call(this, Meteor.bindEnvironment(callback));                                         //
  };                                                                                                                   //
                                                                                                                       //
  Robot.prototype.leave = function(callback) {                                                                         // 28
    return Robot.__super__.leave.call(this, Meteor.bindEnvironment(callback));                                         //
  };                                                                                                                   //
                                                                                                                       //
  Robot.prototype.topic = function(callback) {                                                                         // 28
    return Robot.__super__.topic.call(this, Meteor.bindEnvironment(callback));                                         //
  };                                                                                                                   //
                                                                                                                       //
  Robot.prototype.error = function(callback) {                                                                         // 28
    return Robot.__super__.error.call(this, Meteor.bindEnvironment(callback));                                         //
  };                                                                                                                   //
                                                                                                                       //
  Robot.prototype.catchAll = function(callback) {                                                                      // 28
    return Robot.__super__.catchAll.call(this, Meteor.bindEnvironment(callback));                                      //
  };                                                                                                                   //
                                                                                                                       //
  return Robot;                                                                                                        //
                                                                                                                       //
})(Hubot.Robot);                                                                                                       //
                                                                                                                       //
RocketChatAdapter = (function(superClass) {                                                                            // 1
  extend(RocketChatAdapter, superClass);                                                                               // 54
                                                                                                                       //
  function RocketChatAdapter() {                                                                                       //
    return RocketChatAdapter.__super__.constructor.apply(this, arguments);                                             //
  }                                                                                                                    //
                                                                                                                       //
  RocketChatAdapter.prototype.send = function() {                                                                      // 54
    var envelope, strings;                                                                                             // 55
    envelope = arguments[0], strings = 2 <= arguments.length ? slice.call(arguments, 1) : [];                          // 55
    console.log('ROCKETCHATADAPTER -> send'.blue);                                                                     // 55
    return sendHelper(this.robot, envelope, strings, (function(_this) {                                                //
      return function(string) {                                                                                        //
        if (DEBUG) {                                                                                                   // 58
          console.log("send " + envelope.room + ": " + string + " (" + envelope.user.id + ")");                        // 58
        }                                                                                                              //
        return RocketChat.sendMessage(InternalHubot.user, {                                                            //
          msg: string                                                                                                  // 59
        }, {                                                                                                           //
          _id: envelope.room                                                                                           // 59
        });                                                                                                            //
      };                                                                                                               //
    })(this));                                                                                                         //
  };                                                                                                                   //
                                                                                                                       //
  RocketChatAdapter.prototype.emote = function() {                                                                     // 54
    var envelope, strings;                                                                                             // 68
    envelope = arguments[0], strings = 2 <= arguments.length ? slice.call(arguments, 1) : [];                          // 68
    console.log('ROCKETCHATADAPTER -> emote'.blue);                                                                    // 68
    return sendHelper(this.robot, envelope, strings, (function(_this) {                                                //
      return function(string) {                                                                                        //
        if (DEBUG) {                                                                                                   // 70
          console.log("emote " + envelope.rid + ": " + string + " (" + envelope.u.username + ")");                     // 70
        }                                                                                                              //
        if (envelope.message["private"]) {                                                                             // 71
          return _this.priv(envelope, "*** " + string + " ***");                                                       // 71
        }                                                                                                              //
        return Meteor.call("sendMessage", {                                                                            //
          msg: string,                                                                                                 // 73
          rid: envelope.rid,                                                                                           // 73
          action: true                                                                                                 // 73
        });                                                                                                            //
      };                                                                                                               //
    })(this));                                                                                                         //
  };                                                                                                                   //
                                                                                                                       //
  RocketChatAdapter.prototype.priv = function() {                                                                      // 54
    var envelope, strings;                                                                                             // 79
    envelope = arguments[0], strings = 2 <= arguments.length ? slice.call(arguments, 1) : [];                          // 79
    console.log('ROCKETCHATADAPTER -> priv'.blue);                                                                     // 79
    return sendHelper(this.robot, envelope, strings, function(string) {                                                //
      if (DEBUG) {                                                                                                     // 81
        console.log("priv " + envelope.room + ": " + string + " (" + envelope.user.id + ")");                          // 81
      }                                                                                                                //
      return Meteor.call("sendMessage", {                                                                              //
        u: {                                                                                                           // 83
          username: "rocketbot"                                                                                        // 84
        },                                                                                                             //
        to: "" + envelope.user.id,                                                                                     // 83
        msg: string,                                                                                                   // 83
        rid: envelope.room                                                                                             // 83
      });                                                                                                              //
    });                                                                                                                //
  };                                                                                                                   //
                                                                                                                       //
  RocketChatAdapter.prototype.reply = function() {                                                                     // 54
    var envelope, strings;                                                                                             // 97
    envelope = arguments[0], strings = 2 <= arguments.length ? slice.call(arguments, 1) : [];                          // 97
    console.log('ROCKETCHATADAPTER -> reply'.blue);                                                                    // 97
    if (envelope.message["private"]) {                                                                                 // 98
      return this.priv.apply(this, [envelope].concat(slice.call(strings)));                                            //
    } else {                                                                                                           //
      return this.send.apply(this, [envelope].concat(slice.call(strings.map(function(str) {                            //
        return envelope.user.name + ": " + str;                                                                        //
      }))));                                                                                                           //
    }                                                                                                                  //
  };                                                                                                                   //
                                                                                                                       //
  RocketChatAdapter.prototype.topic = function() {                                                                     // 54
    var envelope, strings;                                                                                             // 110
    envelope = arguments[0], strings = 2 <= arguments.length ? slice.call(arguments, 1) : [];                          // 110
    return console.log('ROCKETCHATADAPTER -> topic'.blue);                                                             //
  };                                                                                                                   //
                                                                                                                       //
  RocketChatAdapter.prototype.play = function() {                                                                      // 54
    var envelope, strings;                                                                                             // 119
    envelope = arguments[0], strings = 2 <= arguments.length ? slice.call(arguments, 1) : [];                          // 119
    return console.log('ROCKETCHATADAPTER -> play'.blue);                                                              //
  };                                                                                                                   //
                                                                                                                       //
  RocketChatAdapter.prototype.run = function() {                                                                       // 54
    console.log('ROCKETCHATADAPTER -> run'.blue);                                                                      // 125
    this.robot.emit('connected');                                                                                      // 125
    return this.robot.brain.mergeData({});                                                                             //
  };                                                                                                                   //
                                                                                                                       //
  RocketChatAdapter.prototype.close = function() {                                                                     // 54
    return console.log('ROCKETCHATADAPTER -> close'.blue);                                                             //
  };                                                                                                                   //
                                                                                                                       //
  return RocketChatAdapter;                                                                                            //
                                                                                                                       //
})(Hubot.Adapter);                                                                                                     //
                                                                                                                       //
InternalHubotReceiver = (function() {                                                                                  // 1
  function InternalHubotReceiver(message) {                                                                            // 137
    var InternalHubotTextMessage, InternalHubotUser, room;                                                             // 139
    if (message.u.username !== InternalHubot.name) {                                                                   // 139
      room = RocketChat.models.Rooms.findOneById(message.rid);                                                         // 140
      if (room.t === 'c') {                                                                                            // 142
        console.log(message);                                                                                          // 143
        InternalHubotUser = new Hubot.User(message.u.username, {                                                       // 143
          room: message.rid                                                                                            // 144
        });                                                                                                            //
        InternalHubotTextMessage = new Hubot.TextMessage(InternalHubotUser, message.msg, message._id);                 // 143
        InternalHubot.adapter.receive(InternalHubotTextMessage);                                                       // 143
      }                                                                                                                //
    }                                                                                                                  //
    return message;                                                                                                    // 147
  }                                                                                                                    //
                                                                                                                       //
  return InternalHubotReceiver;                                                                                        //
                                                                                                                       //
})();                                                                                                                  //
                                                                                                                       //
HubotScripts = (function() {                                                                                           // 1
  function HubotScripts(robot) {                                                                                       // 150
    var e, i, j, len, len1, modulePath, modulesToLoad, scriptFile, scriptsToLoad;                                      // 151
    modulesToLoad = ['hubot-help/src/help.coffee'];                                                                    // 151
    for (i = 0, len = modulesToLoad.length; i < len; i++) {                                                            // 155
      modulePath = modulesToLoad[i];                                                                                   //
      try {                                                                                                            // 156
        Npm.require(modulePath)(robot);                                                                                // 157
        robot.parseHelp(__meteor_bootstrap__.serverDir + '/npm/rocketchat_internal-hubot/node_modules/' + modulePath);
        console.log(("Loaded " + modulePath).green);                                                                   // 157
      } catch (_error) {                                                                                               //
        e = _error;                                                                                                    // 161
        console.log(("can't load " + modulePath).red);                                                                 // 161
        console.log(e);                                                                                                // 161
      }                                                                                                                //
    }                                                                                                                  // 155
    scriptsToLoad = RocketChat.settings.get('InternalHubot_ScriptsToLoad').split(',') || [];                           // 151
    for (j = 0, len1 = scriptsToLoad.length; j < len1; j++) {                                                          // 166
      scriptFile = scriptsToLoad[j];                                                                                   //
      try {                                                                                                            // 167
        scriptFile = s.trim(scriptFile);                                                                               // 168
        Npm.require('hubot-scripts/src/scripts/' + scriptFile)(robot);                                                 // 168
        robot.parseHelp(__meteor_bootstrap__.serverDir + '/npm/rocketchat_internal-hubot/node_modules/hubot-scripts/src/scripts/' + scriptFile);
        console.log(("Loaded " + scriptFile).green);                                                                   // 168
      } catch (_error) {                                                                                               //
        e = _error;                                                                                                    // 175
        console.log(("can't load " + scriptFile).red);                                                                 // 175
        console.log(e);                                                                                                // 175
      }                                                                                                                //
    }                                                                                                                  // 166
  }                                                                                                                    //
                                                                                                                       //
  return HubotScripts;                                                                                                 //
                                                                                                                       //
})();                                                                                                                  //
                                                                                                                       //
sendHelper = Meteor.bindEnvironment(function(robot, envelope, strings, map) {                                          // 1
  var err, results, string;                                                                                            // 219
  results = [];                                                                                                        // 219
  while (strings.length > 0) {                                                                                         //
    string = strings.shift();                                                                                          // 220
    if (typeof string === 'function') {                                                                                // 221
      results.push(string());                                                                                          //
    } else {                                                                                                           //
      try {                                                                                                            // 224
        results.push(map(string));                                                                                     // 225
      } catch (_error) {                                                                                               //
        err = _error;                                                                                                  // 227
        if (DEBUG) {                                                                                                   // 227
          console.error("Hubot error: " + err);                                                                        // 227
        }                                                                                                              //
        results.push(robot.logger.error("RocketChat send error: " + err));                                             // 227
      }                                                                                                                //
    }                                                                                                                  //
  }                                                                                                                    //
  return results;                                                                                                      //
});                                                                                                                    // 218
                                                                                                                       //
InternalHubot = {};                                                                                                    // 1
                                                                                                                       //
init = (function(_this) {                                                                                              // 1
  return function() {                                                                                                  //
    InternalHubot = new Robot(null, null, false, RocketChat.settings.get('InternalHubot_Username'));                   // 233
    InternalHubot.alias = 'bot';                                                                                       // 233
    InternalHubot.adapter = new RocketChatAdapter(InternalHubot);                                                      // 233
    HubotScripts(InternalHubot);                                                                                       // 233
    InternalHubot.run();                                                                                               // 233
    if (RocketChat.settings.get('InternalHubot_Enabled')) {                                                            // 242
      return RocketChat.callbacks.add('afterSaveMessage', InternalHubotReceiver, RocketChat.callbacks.priority.LOW, 'InternalHubot');
    } else {                                                                                                           //
      return RocketChat.callbacks.remove('afterSaveMessage', 'InternalHubot');                                         //
    }                                                                                                                  //
  };                                                                                                                   //
})(this);                                                                                                              // 232
                                                                                                                       //
Meteor.startup(function() {                                                                                            // 1
  init();                                                                                                              // 294
  return RocketChat.models.Settings.findByIds(['InternalHubot_Username', 'InternalHubot_Enabled', 'InternalHubot_ScriptsToLoad']).observe({
    changed: function() {                                                                                              // 296
      return init();                                                                                                   //
    }                                                                                                                  //
  });                                                                                                                  //
});                                                                                                                    // 293
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_internal-hubot/settings.coffee.js                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.settings.addGroup('InternalHubot');                                                                         // 1
                                                                                                                       //
RocketChat.settings.add('InternalHubot_Enabled', true, {                                                               // 1
  type: 'boolean',                                                                                                     // 2
  group: 'InternalHubot',                                                                                              // 2
  i18nLabel: 'Enabled'                                                                                                 // 2
});                                                                                                                    //
                                                                                                                       //
RocketChat.settings.add('InternalHubot_Username', 'Rocket.Cat', {                                                      // 1
  type: 'string',                                                                                                      // 3
  group: 'InternalHubot',                                                                                              // 3
  i18nLabel: 'Username',                                                                                               // 3
  i18nDescription: 'InternalHubot_Username_Description'                                                                // 3
});                                                                                                                    //
                                                                                                                       //
RocketChat.settings.add('InternalHubot_ScriptsToLoad', 'hello.coffee,zen.coffee', {                                    // 1
  type: 'string',                                                                                                      // 4
  group: 'InternalHubot'                                                                                               // 4
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:internal-hubot'] = {
  Hubot: Hubot,
  HubotScripts: HubotScripts,
  InternalHubot: InternalHubot,
  InternalHubotReceiver: InternalHubotReceiver,
  RocketChatAdapter: RocketChatAdapter
};

})();

//# sourceMappingURL=rocketchat_internal-hubot.js.map
