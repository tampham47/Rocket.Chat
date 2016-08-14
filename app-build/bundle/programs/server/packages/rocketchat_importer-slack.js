(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var Importer = Package['rocketchat:importer'].Importer;
var Logger = Package['rocketchat:logger'].Logger;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;
var moment = Package['mrt:moment'].moment;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/rocketchat_importer-slack/server.coffee.js                                                              //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },                               // 1
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;                                                                                      //
                                                                                                                    //
Importer.Slack = Importer.Slack = (function(superClass) {                                                           // 1
  extend(Slack, superClass);                                                                                        // 2
                                                                                                                    //
  function Slack(name, descriptionI18N, fileTypeRegex) {                                                            // 2
    this.getSelection = bind(this.getSelection, this);                                                              // 3
    this.convertSlackMessageToRocketChat = bind(this.convertSlackMessageToRocketChat, this);                        // 3
    this.getRocketUser = bind(this.getRocketUser, this);                                                            // 3
    this.getSlackChannelFromName = bind(this.getSlackChannelFromName, this);                                        // 3
    this.startImport = bind(this.startImport, this);                                                                // 3
    this.prepare = bind(this.prepare, this);                                                                        // 3
    Slack.__super__.constructor.call(this, name, descriptionI18N, fileTypeRegex);                                   // 3
    this.userTags = [];                                                                                             // 3
    this.bots = {};                                                                                                 // 3
    this.logger.debug('Constructed a new Slack Importer.');                                                         // 3
  }                                                                                                                 //
                                                                                                                    //
  Slack.prototype.prepare = function(dataURI, sentContentType, fileName) {                                          // 2
    var channel, channelsId, contentType, entry, fn, fn1, image, j, len, messagesCount, messagesObj, ref, selectionChannels, selectionUsers, tempChannels, tempMessages, tempUsers, usersId, zip, zipEntries;
    Slack.__super__.prepare.call(this, dataURI, sentContentType, fileName);                                         // 9
    ref = RocketChatFile.dataURIParse(dataURI), image = ref.image, contentType = ref.contentType;                   // 9
    zip = new this.AdmZip(new Buffer(image, 'base64'));                                                             // 9
    zipEntries = zip.getEntries();                                                                                  // 9
    tempChannels = [];                                                                                              // 9
    tempUsers = [];                                                                                                 // 9
    tempMessages = {};                                                                                              // 9
    fn = (function(_this) {                                                                                         // 18
      return function(entry) {                                                                                      //
        var channelName, item, k, len1, msgGroupData, results, user;                                                // 20
        if (entry.entryName.indexOf('__MACOSX') > -1) {                                                             // 20
          return _this.logger.debug("Ignoring the file: " + entry.entryName);                                       //
        } else if (entry.entryName === 'channels.json') {                                                           //
          _this.updateProgress(Importer.ProgressStep.PREPARING_CHANNELS);                                           // 24
          tempChannels = JSON.parse(entry.getData().toString());                                                    // 24
          return tempChannels = tempChannels.filter(function(channel) {                                             //
            return channel.creator != null;                                                                         //
          });                                                                                                       //
        } else if (entry.entryName === 'users.json') {                                                              //
          _this.updateProgress(Importer.ProgressStep.PREPARING_USERS);                                              // 28
          tempUsers = JSON.parse(entry.getData().toString());                                                       // 28
          results = [];                                                                                             // 31
          for (k = 0, len1 = tempUsers.length; k < len1; k++) {                                                     //
            user = tempUsers[k];                                                                                    //
            if (user.is_bot) {                                                                                      //
              results.push(_this.bots[user.profile.bot_id] = user);                                                 // 32
            }                                                                                                       //
          }                                                                                                         // 31
          return results;                                                                                           //
        } else if (!entry.isDirectory && entry.entryName.indexOf('/') > -1) {                                       //
          item = entry.entryName.split('/');                                                                        // 35
          channelName = item[0];                                                                                    // 35
          msgGroupData = item[1].split('.')[0];                                                                     // 35
          if (!tempMessages[channelName]) {                                                                         // 38
            tempMessages[channelName] = {};                                                                         // 39
          }                                                                                                         //
          try {                                                                                                     // 41
            return tempMessages[channelName][msgGroupData] = JSON.parse(entry.getData().toString());                //
          } catch (_error) {                                                                                        //
            return _this.logger.warn(entry.entryName + " is not a valid JSON file! Unable to import it.");          //
          }                                                                                                         //
        }                                                                                                           //
      };                                                                                                            //
    })(this);                                                                                                       //
    for (j = 0, len = zipEntries.length; j < len; j++) {                                                            // 18
      entry = zipEntries[j];                                                                                        //
      fn(entry);                                                                                                    // 19
    }                                                                                                               // 18
    usersId = this.collection.insert({                                                                              // 9
      'import': this.importRecord._id,                                                                              // 48
      'importer': this.name,                                                                                        // 48
      'type': 'users',                                                                                              // 48
      'users': tempUsers                                                                                            // 48
    });                                                                                                             //
    this.users = this.collection.findOne(usersId);                                                                  // 9
    this.updateRecord({                                                                                             // 9
      'count.users': tempUsers.length                                                                               // 50
    });                                                                                                             //
    this.addCountToTotal(tempUsers.length);                                                                         // 9
    channelsId = this.collection.insert({                                                                           // 9
      'import': this.importRecord._id,                                                                              // 54
      'importer': this.name,                                                                                        // 54
      'type': 'channels',                                                                                           // 54
      'channels': tempChannels                                                                                      // 54
    });                                                                                                             //
    this.channels = this.collection.findOne(channelsId);                                                            // 9
    this.updateRecord({                                                                                             // 9
      'count.channels': tempChannels.length                                                                         // 56
    });                                                                                                             //
    this.addCountToTotal(tempChannels.length);                                                                      // 9
    this.updateProgress(Importer.ProgressStep.PREPARING_MESSAGES);                                                  // 9
    messagesCount = 0;                                                                                              // 9
    fn1 = (function(_this) {                                                                                        // 62
      return function(channel, messagesObj) {                                                                       //
        var date, i, messagesId, msgs, results, splitMsg;                                                           // 64
        if (!_this.messages[channel]) {                                                                             // 64
          _this.messages[channel] = {};                                                                             // 65
        }                                                                                                           //
        results = [];                                                                                               // 66
        for (date in messagesObj) {                                                                                 //
          msgs = messagesObj[date];                                                                                 //
          messagesCount += msgs.length;                                                                             // 67
          _this.updateRecord({                                                                                      // 67
            'messagesstatus': channel + "/" + date                                                                  // 68
          });                                                                                                       //
          if (Importer.Base.getBSONSize(msgs) > Importer.Base.MaxBSONSize) {                                        // 70
            results.push((function() {                                                                              //
              var k, len1, ref1, results1;                                                                          //
              ref1 = Importer.Base.getBSONSafeArraysFromAnArray(msgs);                                              // 71
              results1 = [];                                                                                        // 71
              for (i = k = 0, len1 = ref1.length; k < len1; i = ++k) {                                              //
                splitMsg = ref1[i];                                                                                 //
                messagesId = this.collection.insert({                                                               // 72
                  'import': this.importRecord._id,                                                                  // 72
                  'importer': this.name,                                                                            // 72
                  'type': 'messages',                                                                               // 72
                  'name': channel + "/" + date + "." + i,                                                           // 72
                  'messages': splitMsg                                                                              // 72
                });                                                                                                 //
                results1.push(this.messages[channel][date + "." + i] = this.collection.findOne(messagesId));        // 72
              }                                                                                                     // 71
              return results1;                                                                                      //
            }).call(_this));                                                                                        //
          } else {                                                                                                  //
            messagesId = _this.collection.insert({                                                                  // 75
              'import': _this.importRecord._id,                                                                     // 75
              'importer': _this.name,                                                                               // 75
              'type': 'messages',                                                                                   // 75
              'name': channel + "/" + date,                                                                         // 75
              'messages': msgs                                                                                      // 75
            });                                                                                                     //
            results.push(_this.messages[channel][date] = _this.collection.findOne(messagesId));                     // 75
          }                                                                                                         //
        }                                                                                                           // 66
        return results;                                                                                             //
      };                                                                                                            //
    })(this);                                                                                                       //
    for (channel in tempMessages) {                                                                                 // 62
      messagesObj = tempMessages[channel];                                                                          //
      fn1(channel, messagesObj);                                                                                    // 63
    }                                                                                                               // 62
    this.updateRecord({                                                                                             // 9
      'count.messages': messagesCount,                                                                              // 78
      'messagesstatus': null                                                                                        // 78
    });                                                                                                             //
    this.addCountToTotal(messagesCount);                                                                            // 9
    if (tempUsers.length === 0 || tempChannels.length === 0 || messagesCount === 0) {                               // 81
      this.logger.warn("The loaded users count " + tempUsers.length + ", the loaded channels " + tempChannels.length + ", and the loaded messages " + messagesCount);
      this.updateProgress(Importer.ProgressStep.ERROR);                                                             // 82
      return this.getProgress();                                                                                    // 84
    }                                                                                                               //
    selectionUsers = tempUsers.map(function(user) {                                                                 // 9
      return new Importer.SelectionUser(user.id, user.name, user.profile.email, user.deleted, user.is_bot, !user.is_bot);
    });                                                                                                             //
    selectionChannels = tempChannels.map(function(channel) {                                                        // 9
      return new Importer.SelectionChannel(channel.id, channel.name, channel.is_archived, true);                    // 89
    });                                                                                                             //
    this.updateProgress(Importer.ProgressStep.USER_SELECTION);                                                      // 9
    return new Importer.Selection(this.name, selectionUsers, selectionChannels);                                    // 92
  };                                                                                                                //
                                                                                                                    //
  Slack.prototype.startImport = function(importSelection) {                                                         // 2
    var c, channel, j, k, l, len, len1, len2, len3, m, ref, ref1, ref2, ref3, start, startedByUserId, u, user;      // 95
    Slack.__super__.startImport.call(this, importSelection);                                                        // 95
    start = Date.now();                                                                                             // 95
    ref = importSelection.users;                                                                                    // 98
    for (j = 0, len = ref.length; j < len; j++) {                                                                   // 98
      user = ref[j];                                                                                                //
      ref1 = this.users.users;                                                                                      // 99
      for (k = 0, len1 = ref1.length; k < len1; k++) {                                                              // 99
        u = ref1[k];                                                                                                //
        if (u.id === user.user_id) {                                                                                //
          u.do_import = user.do_import;                                                                             // 100
        }                                                                                                           //
      }                                                                                                             // 99
    }                                                                                                               // 98
    this.collection.update({                                                                                        // 95
      _id: this.users._id                                                                                           // 101
    }, {                                                                                                            //
      $set: {                                                                                                       // 101
        'users': this.users.users                                                                                   // 101
      }                                                                                                             //
    });                                                                                                             //
    ref2 = importSelection.channels;                                                                                // 103
    for (l = 0, len2 = ref2.length; l < len2; l++) {                                                                // 103
      channel = ref2[l];                                                                                            //
      ref3 = this.channels.channels;                                                                                // 104
      for (m = 0, len3 = ref3.length; m < len3; m++) {                                                              // 104
        c = ref3[m];                                                                                                //
        if (c.id === channel.channel_id) {                                                                          //
          c.do_import = channel.do_import;                                                                          // 105
        }                                                                                                           //
      }                                                                                                             // 104
    }                                                                                                               // 103
    this.collection.update({                                                                                        // 95
      _id: this.channels._id                                                                                        // 106
    }, {                                                                                                            //
      $set: {                                                                                                       // 106
        'channels': this.channels.channels                                                                          // 106
      }                                                                                                             //
    });                                                                                                             //
    startedByUserId = Meteor.userId();                                                                              // 95
    Meteor.defer((function(_this) {                                                                                 // 95
      return function() {                                                                                           //
        var fn, ignoreTypes, len4, len5, len6, messagesObj, missedTypes, n, o, p, ref4, ref5, ref6, ref7, timeTook;
        _this.updateProgress(Importer.ProgressStep.IMPORTING_USERS);                                                // 110
        ref4 = _this.users.users;                                                                                   // 111
        for (n = 0, len4 = ref4.length; n < len4; n++) {                                                            // 111
          user = ref4[n];                                                                                           //
          if (user.do_import) {                                                                                     //
            (function(user) {                                                                                       // 112
              return Meteor.runAsUser(startedByUserId, function() {                                                 //
                var existantUser, userId;                                                                           // 114
                existantUser = RocketChat.models.Users.findOneByEmailAddress(user.profile.email);                   // 114
                if (!existantUser) {                                                                                // 115
                  existantUser = RocketChat.models.Users.findOneByUsername(user.name);                              // 116
                }                                                                                                   //
                if (existantUser) {                                                                                 // 118
                  user.rocketId = existantUser._id;                                                                 // 119
                  RocketChat.models.Users.update({                                                                  // 119
                    _id: user.rocketId                                                                              // 120
                  }, {                                                                                              //
                    $addToSet: {                                                                                    // 120
                      importIds: user.id                                                                            // 120
                    }                                                                                               //
                  });                                                                                               //
                  _this.userTags.push({                                                                             // 119
                    slack: "<@" + user.id + ">",                                                                    // 122
                    slackLong: "<@" + user.id + "|" + user.name + ">",                                              // 122
                    rocket: "@" + existantUser.username                                                             // 122
                  });                                                                                               //
                } else {                                                                                            //
                  userId = Accounts.createUser({                                                                    // 126
                    email: user.profile.email,                                                                      // 126
                    password: Date.now() + user.name + user.profile.email.toUpperCase()                             // 126
                  });                                                                                               //
                  Meteor.runAsUser(userId, function() {                                                             // 126
                    var url;                                                                                        // 128
                    Meteor.call('setUsername', user.name);                                                          // 128
                    Meteor.call('joinDefaultChannels', true);                                                       // 128
                    url = null;                                                                                     // 128
                    if (user.profile.image_original) {                                                              // 131
                      url = user.profile.image_original;                                                            // 132
                    } else if (user.profile.image_512) {                                                            //
                      url = user.profile.image_512;                                                                 // 134
                    }                                                                                               //
                    Meteor.call('setAvatarFromService', url, null, 'url');                                          // 128
                    if (user.tz_offset) {                                                                           // 137
                      return Meteor.call('updateUserUtcOffset', user.tz_offset / 3600);                             //
                    }                                                                                               //
                  });                                                                                               //
                  RocketChat.models.Users.update({                                                                  // 126
                    _id: userId                                                                                     // 140
                  }, {                                                                                              //
                    $addToSet: {                                                                                    // 140
                      importIds: user.id                                                                            // 140
                    }                                                                                               //
                  });                                                                                               //
                  if (user.profile.real_name) {                                                                     // 142
                    RocketChat.models.Users.setName(userId, user.profile.real_name);                                // 143
                  }                                                                                                 //
                  if (user.deleted) {                                                                               // 145
                    Meteor.call('setUserActiveStatus', userId, false);                                              // 146
                  }                                                                                                 //
                  user.rocketId = userId;                                                                           // 126
                  _this.userTags.push({                                                                             // 126
                    slack: "<@" + user.id + ">",                                                                    // 150
                    slackLong: "<@" + user.id + "|" + user.name + ">",                                              // 150
                    rocket: "@" + user.name                                                                         // 150
                  });                                                                                               //
                }                                                                                                   //
                return _this.addCountCompleted(1);                                                                  //
              });                                                                                                   //
            })(user);                                                                                               //
          }                                                                                                         //
        }                                                                                                           // 111
        _this.collection.update({                                                                                   // 110
          _id: _this.users._id                                                                                      // 154
        }, {                                                                                                        //
          $set: {                                                                                                   // 154
            'users': _this.users.users                                                                              // 154
          }                                                                                                         //
        });                                                                                                         //
        _this.updateProgress(Importer.ProgressStep.IMPORTING_CHANNELS);                                             // 110
        ref5 = _this.channels.channels;                                                                             // 157
        for (o = 0, len5 = ref5.length; o < len5; o++) {                                                            // 157
          channel = ref5[o];                                                                                        //
          if (channel.do_import) {                                                                                  //
            (function(channel) {                                                                                    // 158
              return Meteor.runAsUser(startedByUserId, function() {                                                 //
                var existantRoom, lastSetTopic, len6, len7, member, p, q, ref6, ref7, ref8, ref9, roomUpdate, userId, users;
                existantRoom = RocketChat.models.Rooms.findOneByName(channel.name);                                 // 160
                if (existantRoom || channel.is_general) {                                                           // 161
                  if (channel.is_general && channel.name !== (existantRoom != null ? existantRoom.name : void 0)) {
                    Meteor.call('saveRoomSettings', 'GENERAL', 'roomName', channel.name);                           // 163
                  }                                                                                                 //
                  channel.rocketId = channel.is_general ? 'GENERAL' : existantRoom._id;                             // 162
                  RocketChat.models.Rooms.update({                                                                  // 162
                    _id: channel.rocketId                                                                           // 165
                  }, {                                                                                              //
                    $addToSet: {                                                                                    // 165
                      importIds: channel.id                                                                         // 165
                    }                                                                                               //
                  });                                                                                               //
                } else {                                                                                            //
                  users = [];                                                                                       // 167
                  ref6 = channel.members;                                                                           // 168
                  for (p = 0, len6 = ref6.length; p < len6; p++) {                                                  // 168
                    member = ref6[p];                                                                               //
                    if (!(member !== channel.creator)) {                                                            //
                      continue;                                                                                     //
                    }                                                                                               //
                    user = _this.getRocketUser(member);                                                             // 169
                    if (user != null) {                                                                             // 170
                      users.push(user.username);                                                                    // 171
                    }                                                                                               //
                  }                                                                                                 // 168
                  userId = '';                                                                                      // 167
                  ref7 = _this.users.users;                                                                         // 174
                  for (q = 0, len7 = ref7.length; q < len7; q++) {                                                  // 174
                    user = ref7[q];                                                                                 //
                    if (user.id === channel.creator) {                                                              //
                      userId = user.rocketId;                                                                       // 175
                    }                                                                                               //
                  }                                                                                                 // 174
                  if (userId === '') {                                                                              // 177
                    _this.logger.warn("Failed to find the channel creator for " + channel.name + ", setting it to the current running user.");
                    userId = startedByUserId;                                                                       // 178
                  }                                                                                                 //
                  Meteor.runAsUser(userId, function() {                                                             // 167
                    var returned;                                                                                   // 182
                    returned = Meteor.call('createChannel', channel.name, users);                                   // 182
                    return channel.rocketId = returned.rid;                                                         //
                  });                                                                                               //
                  roomUpdate = {                                                                                    // 167
                    ts: new Date(channel.created * 1000)                                                            // 187
                  };                                                                                                //
                  if (!_.isEmpty((ref8 = channel.topic) != null ? ref8.value : void 0)) {                           // 189
                    roomUpdate.topic = channel.topic.value;                                                         // 190
                    lastSetTopic = channel.topic.last_set;                                                          // 190
                  }                                                                                                 //
                  if (!_.isEmpty((ref9 = channel.purpose) != null ? ref9.value : void 0) && channel.purpose.last_set > lastSetTopic) {
                    roomUpdate.topic = channel.purpose.value;                                                       // 194
                  }                                                                                                 //
                  RocketChat.models.Rooms.update({                                                                  // 167
                    _id: channel.rocketId                                                                           // 196
                  }, {                                                                                              //
                    $set: roomUpdate,                                                                               // 196
                    $addToSet: {                                                                                    // 196
                      importIds: channel.id                                                                         // 196
                    }                                                                                               //
                  });                                                                                               //
                }                                                                                                   //
                return _this.addCountCompleted(1);                                                                  //
              });                                                                                                   //
            })(channel);                                                                                            //
          }                                                                                                         //
        }                                                                                                           // 157
        _this.collection.update({                                                                                   // 110
          _id: _this.channels._id                                                                                   // 199
        }, {                                                                                                        //
          $set: {                                                                                                   // 199
            'channels': _this.channels.channels                                                                     // 199
          }                                                                                                         //
        });                                                                                                         //
        missedTypes = {};                                                                                           // 110
        ignoreTypes = {                                                                                             // 110
          'bot_add': true,                                                                                          // 202
          'file_comment': true,                                                                                     // 202
          'file_mention': true,                                                                                     // 202
          'channel_name': true                                                                                      // 202
        };                                                                                                          //
        _this.updateProgress(Importer.ProgressStep.IMPORTING_MESSAGES);                                             // 110
        ref6 = _this.messages;                                                                                      // 204
        fn = function(channel, messagesObj) {                                                                       // 204
          return Meteor.runAsUser(startedByUserId, function() {                                                     //
            var botUser, botUsername, date, details, message, msgDataDefaults, msgObj, msgs, results, room, slackChannel;
            slackChannel = _this.getSlackChannelFromName(channel);                                                  // 207
            if (slackChannel != null ? slackChannel.do_import : void 0) {                                           // 208
              room = RocketChat.models.Rooms.findOneById(slackChannel.rocketId, {                                   // 209
                fields: {                                                                                           // 209
                  usernames: 1,                                                                                     // 209
                  t: 1,                                                                                             // 209
                  name: 1                                                                                           // 209
                }                                                                                                   //
              });                                                                                                   //
              results = [];                                                                                         // 210
              for (date in messagesObj) {                                                                           //
                msgs = messagesObj[date];                                                                           //
                _this.updateRecord({                                                                                // 211
                  'messagesstatus': channel + "/" + date + "." + msgs.messages.length                               // 211
                });                                                                                                 //
                results.push((function() {                                                                          // 211
                  var len6, p, ref7, ref8, ref9, results1;                                                          //
                  ref7 = msgs.messages;                                                                             // 212
                  results1 = [];                                                                                    // 212
                  for (p = 0, len6 = ref7.length; p < len6; p++) {                                                  //
                    message = ref7[p];                                                                              //
                    msgDataDefaults = {                                                                             // 213
                      _id: slackChannel.id + ".S" + message.ts,                                                     // 214
                      ts: new Date(parseInt(message.ts.split('.')[0]) * 1000)                                       // 214
                    };                                                                                              //
                    if (message.type === 'message') {                                                               // 217
                      if (message.subtype != null) {                                                                // 218
                        if (message.subtype === 'channel_join') {                                                   // 219
                          if (this.getRocketUser(message.user) != null) {                                           // 220
                            RocketChat.models.Messages.createUserJoinWithRoomIdAndUser(room._id, this.getRocketUser(message.user), msgDataDefaults);
                          }                                                                                         //
                        } else if (message.subtype === 'channel_leave') {                                           //
                          if (this.getRocketUser(message.user) != null) {                                           // 223
                            RocketChat.models.Messages.createUserLeaveWithRoomIdAndUser(room._id, this.getRocketUser(message.user), msgDataDefaults);
                          }                                                                                         //
                        } else if (message.subtype === 'me_message') {                                              //
                          msgObj = {                                                                                // 226
                            msg: "_" + (this.convertSlackMessageToRocketChat(message.text)) + "_"                   // 227
                          };                                                                                        //
                          _.extend(msgObj, msgDataDefaults);                                                        // 226
                          RocketChat.sendMessage(this.getRocketUser(message.user), msgObj, room, true);             // 226
                        } else if (message.subtype === 'bot_message') {                                             //
                          botUser = RocketChat.models.Users.findOneById('rocket.cat', {                             // 231
                            fields: {                                                                               // 231
                              username: 1                                                                           // 231
                            }                                                                                       //
                          });                                                                                       //
                          botUsername = this.bots[message.bot_id] ? (ref8 = this.bots[message.bot_id]) != null ? ref8.name : void 0 : message.username;
                          msgObj = {                                                                                // 231
                            msg: this.convertSlackMessageToRocketChat(message.text),                                // 234
                            rid: room._id,                                                                          // 234
                            bot: true,                                                                              // 234
                            attachments: message.attachments,                                                       // 234
                            username: botUsername ? botUsername : void 0                                            // 234
                          };                                                                                        //
                          _.extend(msgObj, msgDataDefaults);                                                        // 231
                          if (message.edited != null) {                                                             // 242
                            msgObj.ets = new Date(parseInt(message.edited.ts.split('.')[0]) * 1000);                // 243
                          }                                                                                         //
                          if (message.icons != null) {                                                              // 245
                            msgObj.emoji = message.icons.emoji;                                                     // 246
                          }                                                                                         //
                          RocketChat.sendMessage(botUser, msgObj, room, true);                                      // 231
                        } else if (message.subtype === 'channel_purpose') {                                         //
                          RocketChat.models.Messages.createRoomSettingsChangedWithTypeRoomIdMessageAndUser('room_changed_topic', room._id, message.purpose, this.getRocketUser(message.user), msgDataDefaults);
                        } else if (message.subtype === 'channel_topic') {                                           //
                          RocketChat.models.Messages.createRoomSettingsChangedWithTypeRoomIdMessageAndUser('room_changed_topic', room._id, message.topic, this.getRocketUser(message.user), msgDataDefaults);
                        } else if (message.subtype === 'pinned_item') {                                             //
                          if (message.attachments) {                                                                // 254
                            msgObj = {                                                                              // 255
                              attachments: [                                                                        // 256
                                {                                                                                   //
                                  "text": this.convertSlackMessageToRocketChat(message.attachments[0].text),        // 257
                                  "author_name": message.attachments[0].author_subname,                             // 257
                                  "author_icon": getAvatarUrlFromUsername(message.attachments[0].author_subname)    // 257
                                }                                                                                   //
                              ]                                                                                     //
                            };                                                                                      //
                            _.extend(msgObj, msgDataDefaults);                                                      // 255
                            RocketChat.models.Messages.createWithTypeRoomIdMessageAndUser('message_pinned', room._id, '', this.getRocketUser(message.user), msgObj);
                          } else {                                                                                  //
                            this.logger.debug('Pinned item with no attachment, needs work.');                       // 265
                          }                                                                                         //
                        } else if (message.subtype === 'file_share') {                                              //
                          if (((ref9 = message.file) != null ? ref9.url_private_download : void 0) !== void 0) {    // 268
                            details = {                                                                             // 269
                              message_id: "S" + message.ts,                                                         // 270
                              name: message.file.name,                                                              // 270
                              size: message.file.size,                                                              // 270
                              type: message.file.mimetype,                                                          // 270
                              rid: room._id                                                                         // 270
                            };                                                                                      //
                            this.uploadFile(details, message.file.url_private_download, this.getRocketUser(message.user), room, new Date(parseInt(message.ts.split('.')[0]) * 1000));
                          }                                                                                         //
                        } else {                                                                                    //
                          if (!missedTypes[message.subtype] && !ignoreTypes[message.subtype]) {                     // 277
                            missedTypes[message.subtype] = message;                                                 // 278
                          }                                                                                         //
                        }                                                                                           //
                      } else {                                                                                      //
                        user = this.getRocketUser(message.user);                                                    // 280
                        if (user != null) {                                                                         // 281
                          msgObj = {                                                                                // 282
                            msg: this.convertSlackMessageToRocketChat(message.text),                                // 283
                            rid: room._id,                                                                          // 283
                            u: {                                                                                    // 283
                              _id: user._id,                                                                        // 286
                              username: user.username                                                               // 286
                            }                                                                                       //
                          };                                                                                        //
                          _.extend(msgObj, msgDataDefaults);                                                        // 282
                          if (message.edited != null) {                                                             // 291
                            msgObj.ets = new Date(parseInt(message.edited.ts.split('.')[0]) * 1000);                // 292
                          }                                                                                         //
                          RocketChat.sendMessage(this.getRocketUser(message.user), msgObj, room, true);             // 282
                        }                                                                                           //
                      }                                                                                             //
                    }                                                                                               //
                    results1.push(this.addCountCompleted(1));                                                       // 213
                  }                                                                                                 // 212
                  return results1;                                                                                  //
                }).call(_this));                                                                                    //
              }                                                                                                     // 210
              return results;                                                                                       //
            }                                                                                                       //
          });                                                                                                       //
        };                                                                                                          //
        for (channel in ref6) {                                                                                     // 204
          messagesObj = ref6[channel];                                                                              //
          fn(channel, messagesObj);                                                                                 // 205
        }                                                                                                           // 204
        console.log(missedTypes);                                                                                   // 110
        _this.updateProgress(Importer.ProgressStep.FINISHING);                                                      // 110
        ref7 = _this.channels.channels;                                                                             // 298
        for (p = 0, len6 = ref7.length; p < len6; p++) {                                                            // 298
          channel = ref7[p];                                                                                        //
          if (channel.do_import && channel.is_archived) {                                                           //
            (function(channel) {                                                                                    // 299
              return Meteor.runAsUser(startedByUserId, function() {                                                 //
                return Meteor.call('archiveRoom', channel.rocketId);                                                //
              });                                                                                                   //
            })(channel);                                                                                            //
          }                                                                                                         //
        }                                                                                                           // 298
        _this.updateProgress(Importer.ProgressStep.DONE);                                                           // 110
        timeTook = Date.now() - start;                                                                              // 110
        return _this.logger.log("Import took " + timeTook + " milliseconds.");                                      //
      };                                                                                                            //
    })(this));                                                                                                      //
    return this.getProgress();                                                                                      // 307
  };                                                                                                                //
                                                                                                                    //
  Slack.prototype.getSlackChannelFromName = function(channelName) {                                                 // 2
    var channel, j, len, ref;                                                                                       // 310
    ref = this.channels.channels;                                                                                   // 310
    for (j = 0, len = ref.length; j < len; j++) {                                                                   // 310
      channel = ref[j];                                                                                             //
      if (channel.name === channelName) {                                                                           //
        return channel;                                                                                             // 311
      }                                                                                                             //
    }                                                                                                               // 310
  };                                                                                                                //
                                                                                                                    //
  Slack.prototype.getRocketUser = function(slackId) {                                                               // 2
    var j, len, ref, user;                                                                                          // 314
    ref = this.users.users;                                                                                         // 314
    for (j = 0, len = ref.length; j < len; j++) {                                                                   // 314
      user = ref[j];                                                                                                //
      if (user.id === slackId) {                                                                                    //
        return RocketChat.models.Users.findOneById(user.rocketId, {                                                 // 315
          fields: {                                                                                                 // 315
            username: 1                                                                                             // 315
          }                                                                                                         //
        });                                                                                                         //
      }                                                                                                             //
    }                                                                                                               // 314
  };                                                                                                                //
                                                                                                                    //
  Slack.prototype.convertSlackMessageToRocketChat = function(message) {                                             // 2
    var j, len, ref, userReplace;                                                                                   // 318
    if (message != null) {                                                                                          // 318
      message = message.replace(/<!everyone>/g, '@all');                                                            // 319
      message = message.replace(/<!channel>/g, '@all');                                                             // 319
      message = message.replace(/&gt;/g, '<');                                                                      // 319
      message = message.replace(/&lt;/g, '>');                                                                      // 319
      message = message.replace(/&amp;/g, '&');                                                                     // 319
      message = message.replace(/:simple_smile:/g, ':smile:');                                                      // 319
      message = message.replace(/:memo:/g, ':pencil:');                                                             // 319
      message = message.replace(/:piggy:/g, ':pig:');                                                               // 319
      message = message.replace(/:uk:/g, ':gb:');                                                                   // 319
      message = message.replace(/<(http[s]?:[^>]*)>/g, '$1');                                                       // 319
      ref = this.userTags;                                                                                          // 329
      for (j = 0, len = ref.length; j < len; j++) {                                                                 // 329
        userReplace = ref[j];                                                                                       //
        message = message.replace(userReplace.slack, userReplace.rocket);                                           // 330
        message = message.replace(userReplace.slackLong, userReplace.rocket);                                       // 330
      }                                                                                                             // 329
    } else {                                                                                                        //
      message = '';                                                                                                 // 333
    }                                                                                                               //
    return message;                                                                                                 // 334
  };                                                                                                                //
                                                                                                                    //
  Slack.prototype.getSelection = function() {                                                                       // 2
    var selectionChannels, selectionUsers;                                                                          // 337
    selectionUsers = this.users.users.map(function(user) {                                                          // 337
      return new Importer.SelectionUser(user.id, user.name, user.profile.email, user.deleted, user.is_bot, !user.is_bot);
    });                                                                                                             //
    selectionChannels = this.channels.channels.map(function(channel) {                                              // 337
      return new Importer.SelectionChannel(channel.id, channel.name, channel.is_archived, true);                    // 340
    });                                                                                                             //
    return new Importer.Selection(this.name, selectionUsers, selectionChannels);                                    // 342
  };                                                                                                                //
                                                                                                                    //
  return Slack;                                                                                                     //
                                                                                                                    //
})(Importer.Base);                                                                                                  //
                                                                                                                    //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/rocketchat_importer-slack/main.coffee.js                                                                //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Importer.AddImporter('slack', Importer.Slack, {                                                                     // 1
  name: 'Slack',                                                                                                    // 2
  description: TAPi18n.__('Importer_From_Description', {                                                            // 2
    from: 'Slack'                                                                                                   // 3
  }),                                                                                                               //
  fileTypeRegex: new RegExp('application\/.*?zip')                                                                  // 2
});                                                                                                                 //
                                                                                                                    //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:importer-slack'] = {};

})();

//# sourceMappingURL=rocketchat_importer-slack.js.map
