(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Random = Package.random.Random;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;
var check = Package.check.check;
var Match = Package.check.Match;
var DDPServer = Package['ddp-server'].DDPServer;
var DDP = Package['ddp-client'].DDP;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// packages/kenton_accounts-sandstorm/server.js                                                           //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
// Copyright (c) 2014 Sandstorm Development Group, Inc. and contributors                                  // 1
// Licensed under the MIT License:                                                                        // 2
//                                                                                                        // 3
// Permission is hereby granted, free of charge, to any person obtaining a copy                           // 4
// of this software and associated documentation files (the "Software"), to deal                          // 5
// in the Software without restriction, including without limitation the rights                           // 6
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell                              // 7
// copies of the Software, and to permit persons to whom the Software is                                  // 8
// furnished to do so, subject to the following conditions:                                               // 9
//                                                                                                        // 10
// The above copyright notice and this permission notice shall be included in                             // 11
// all copies or substantial portions of the Software.                                                    // 12
//                                                                                                        // 13
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR                             // 14
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,                               // 15
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE                            // 16
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER                                 // 17
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,                          // 18
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN                              // 19
// THE SOFTWARE.                                                                                          // 20
                                                                                                          // 21
if (process.env.SANDSTORM) {                                                                              // 22
  __meteor_runtime_config__.SANDSTORM = true;                                                             // 23
}                                                                                                         // 24
                                                                                                          // 25
if (__meteor_runtime_config__.SANDSTORM) {                                                                // 26
  if (Package["accounts-base"]) {                                                                         // 27
    // Highlander Mode: Disable all non-Sandstorm login mechanisms.                                       // 28
    Package["accounts-base"].Accounts.validateLoginAttempt(function (attempt) {                           // 29
      if (!attempt.allowed) {                                                                             // 30
        return false;                                                                                     // 31
      }                                                                                                   // 32
      if (attempt.type !== "sandstorm") {                                                                 // 33
        throw new Meteor.Error(403, "Non-Sandstorm login mechanisms disabled on Sandstorm.");             // 34
      }                                                                                                   // 35
      return true;                                                                                        // 36
    });                                                                                                   // 37
    Package["accounts-base"].Accounts.validateNewUser(function (user) {                                   // 38
      if (!user.services.sandstorm) {                                                                     // 39
        throw new Meteor.Error(403, "Non-Sandstorm login mechanisms disabled on Sandstorm.");             // 40
      }                                                                                                   // 41
      return true;                                                                                        // 42
    });                                                                                                   // 43
  }                                                                                                       // 44
                                                                                                          // 45
  var Future = Npm.require("fibers/future");                                                              // 46
                                                                                                          // 47
  var inMeteor = Meteor.bindEnvironment(function (callback) {                                             // 48
    callback();                                                                                           // 49
  });                                                                                                     // 50
                                                                                                          // 51
  var logins = {};                                                                                        // 52
  // Maps tokens to currently-waiting login method calls.                                                 // 53
                                                                                                          // 54
  if (Package["accounts-base"]) {                                                                         // 55
    Meteor.users._ensureIndex("services.sandstorm.id", {unique: 1, sparse: 1});                           // 56
  }                                                                                                       // 57
                                                                                                          // 58
  Meteor.onConnection(function (connection) {                                                             // 59
    connection._sandstormUser = null;                                                                     // 60
    connection.sandstormUser = function () {                                                              // 61
      if (!connection._sandstormUser) {                                                                   // 62
        throw new Meteor.Error(400, "Client did not complete authentication handshake.");                 // 63
      }                                                                                                   // 64
      return this._sandstormUser;                                                                         // 65
    };                                                                                                    // 66
  });                                                                                                     // 67
                                                                                                          // 68
  Meteor.methods({                                                                                        // 69
    loginWithSandstorm: function (token) {                                                                // 70
      check(token, String);                                                                               // 71
                                                                                                          // 72
      var future = new Future();                                                                          // 73
                                                                                                          // 74
      logins[token] = future;                                                                             // 75
                                                                                                          // 76
      var timeout = setTimeout(function () {                                                              // 77
        future.throw(new Meteor.Error("timeout", "Gave up waiting for login rendezvous XHR."));           // 78
      }, 10000);                                                                                          // 79
                                                                                                          // 80
      var info;                                                                                           // 81
      try {                                                                                               // 82
        info = future.wait();                                                                             // 83
      } finally {                                                                                         // 84
        clearTimeout(timeout);                                                                            // 85
        delete logins[token];                                                                             // 86
      }                                                                                                   // 87
                                                                                                          // 88
      // Set connection info. The call to setUserId() resets all publishes. We update the                 // 89
      // connection's sandstorm info first so that when the publishes are re-run they'll see the          // 90
      // new info. In theory we really want to update it exactly when this.userId is updated, but         // 91
      // we'd have to dig into Meteor internals to pull that off. Probably updating it a little           // 92
      // early is fine?                                                                                   // 93
      //                                                                                                  // 94
      // Note that calling setUserId() with the same ID a second time still goes through the motions      // 95
      // of restarting all subscriptions, which is important if the permissions changed. Hopefully        // 96
      // Meteor won't decide to "optimize" this by returning early if the user ID hasn't changed.         // 97
      this.connection._sandstormUser = info.sandstorm;                                                    // 98
      this.setUserId(info.userId);                                                                        // 99
                                                                                                          // 100
      return info;                                                                                        // 101
    }                                                                                                     // 102
  });                                                                                                     // 103
                                                                                                          // 104
  WebApp.rawConnectHandlers.use(function (req, res, next) {                                               // 105
    if (req.url === "/.sandstorm-login") {                                                                // 106
      handlePostToken(req, res);                                                                          // 107
      return;                                                                                             // 108
    }                                                                                                     // 109
    return next();                                                                                        // 110
  });                                                                                                     // 111
                                                                                                          // 112
  function readAll(stream) {                                                                              // 113
    var future = new Future();                                                                            // 114
                                                                                                          // 115
    var chunks = [];                                                                                      // 116
    stream.on("data", function (chunk) {                                                                  // 117
      chunks.push(chunk.toString());                                                                      // 118
    });                                                                                                   // 119
    stream.on("error", function (err) {                                                                   // 120
      future.throw(err);                                                                                  // 121
    });                                                                                                   // 122
    stream.on("end", function () {                                                                        // 123
      future.return();                                                                                    // 124
    });                                                                                                   // 125
                                                                                                          // 126
    future.wait();                                                                                        // 127
                                                                                                          // 128
    return chunks.join("");                                                                               // 129
  }                                                                                                       // 130
                                                                                                          // 131
  var handlePostToken = Meteor.bindEnvironment(function (req, res) {                                      // 132
    inMeteor(function () {                                                                                // 133
      try {                                                                                               // 134
        // Note that cross-origin POSTs cannot set arbitrary Content-Types without explicit CORS          // 135
        // permission, so this effectively prevents XSRF.                                                 // 136
        if (req.headers["content-type"].split(";")[0].trim() !== "application/x-sandstorm-login-token") {
          throw new Error("wrong Content-Type for .sandstorm-login: " + req.headers["content-type"]);     // 138
        }                                                                                                 // 139
                                                                                                          // 140
        var token = readAll(req);                                                                         // 141
                                                                                                          // 142
        var future = logins[token];                                                                       // 143
        if (!future) {                                                                                    // 144
          throw new Error("no current login request matching token");                                     // 145
        }                                                                                                 // 146
                                                                                                          // 147
        var permissions = req.headers["x-sandstorm-permissions"];                                         // 148
        if (permissions && permissions !== "") {                                                          // 149
          permissions = permissions.split(",");                                                           // 150
        } else {                                                                                          // 151
          permissions = [];                                                                               // 152
        }                                                                                                 // 153
                                                                                                          // 154
        var sandstormInfo = {                                                                             // 155
          id: req.headers["x-sandstorm-user-id"] || null,                                                 // 156
          name: decodeURI(req.headers["x-sandstorm-username"]),                                           // 157
          permissions: permissions,                                                                       // 158
          picture: req.headers["x-sandstorm-user-picture"] || null,                                       // 159
          preferredHandle: req.headers["x-sandstorm-preferred-handle"] || null,                           // 160
          pronouns: req.headers["x-sandstorm-user-pronouns"] || null                                      // 161
        };                                                                                                // 162
                                                                                                          // 163
        var userInfo = {sandstorm: sandstormInfo};                                                        // 164
        if (Package["accounts-base"]) {                                                                   // 165
          if (sandstormInfo.id) {                                                                         // 166
            // The user is logged into Sansdtorm. Create a Meteor account for them, or find the           // 167
            // existing one, and record the user ID.                                                      // 168
            var login = Package["accounts-base"].Accounts.updateOrCreateUserFromExternalService(          // 169
              "sandstorm", sandstormInfo, {profile: {name: sandstormInfo.name}});                         // 170
            userInfo.userId = login.userId;                                                               // 171
          } else {                                                                                        // 172
            userInfo.userId = null;                                                                       // 173
          }                                                                                               // 174
        } else {                                                                                          // 175
          // Since the app isn't using regular Meteor accounts, we can define Meteor.userId()             // 176
          // however we want.                                                                             // 177
          userInfo.userId = sandstormInfo.id;                                                             // 178
        }                                                                                                 // 179
                                                                                                          // 180
        future.return(userInfo);                                                                          // 181
        res.writeHead(204, {});                                                                           // 182
        res.end();                                                                                        // 183
      } catch (err) {                                                                                     // 184
        res.writeHead(500, {                                                                              // 185
          "Content-Type": "text/plain"                                                                    // 186
        });                                                                                               // 187
        res.end(err.stack);                                                                               // 188
      }                                                                                                   // 189
    });                                                                                                   // 190
  });                                                                                                     // 191
}                                                                                                         // 192
                                                                                                          // 193
////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['kenton:accounts-sandstorm'] = {};

})();

//# sourceMappingURL=kenton_accounts-sandstorm.js.map
