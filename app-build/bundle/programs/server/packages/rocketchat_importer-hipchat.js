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
// packages/rocketchat_importer-hipchat/server.coffee.js                                                            //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },                               // 1
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;                                                                                      //
                                                                                                                    //
Importer.HipChat = Importer.HipChat = (function(superClass) {                                                       // 1
  extend(HipChat, superClass);                                                                                      // 2
                                                                                                                    //
  HipChat.RoomPrefix = 'hipchat_export/rooms/';                                                                     // 2
                                                                                                                    //
  HipChat.UsersPrefix = 'hipchat_export/users/';                                                                    // 2
                                                                                                                    //
  function HipChat(name, descriptionI18N, fileTypeRegex) {                                                          // 5
    this.getSelection = bind(this.getSelection, this);                                                              // 6
    this.convertHipChatMessageToRocketChat = bind(this.convertHipChatMessageToRocketChat, this);                    // 6
    this.getRocketUser = bind(this.getRocketUser, this);                                                            // 6
    this.getHipChatChannelFromName = bind(this.getHipChatChannelFromName, this);                                    // 6
    this.startImport = bind(this.startImport, this);                                                                // 6
    this.prepare = bind(this.prepare, this);                                                                        // 6
    HipChat.__super__.constructor.call(this, name, descriptionI18N, fileTypeRegex);                                 // 6
    this.logger.debug('Constructed a new Slack Importer.');                                                         // 6
    this.userTags = [];                                                                                             // 6
  }                                                                                                                 //
                                                                                                                    //
  HipChat.prototype.prepare = function(dataURI, sentContentType, fileName) {                                        // 2
    var channel, channelsId, contentType, entry, fn, fn1, image, j, len, messagesCount, messagesObj, ref, selectionChannels, selectionUsers, tempMessages, tempRooms, tempUsers, usersId, zip, zipEntries;
    HipChat.__super__.prepare.call(this, dataURI, sentContentType, fileName);                                       // 11
    ref = RocketChatFile.dataURIParse(dataURI), image = ref.image, contentType = ref.contentType;                   // 11
    zip = new this.AdmZip(new Buffer(image, 'base64'));                                                             // 11
    zipEntries = zip.getEntries();                                                                                  // 11
    tempRooms = [];                                                                                                 // 11
    tempUsers = [];                                                                                                 // 11
    tempMessages = {};                                                                                              // 11
    fn = (function(_this) {                                                                                         // 20
      return function(entry) {                                                                                      //
        var item, k, len1, msgGroupData, results, room, roomName, usersName;                                        // 22
        if (entry.entryName.indexOf('__MACOSX') > -1) {                                                             // 22
          _this.logger.debug("Ignoring the file: " + entry.entryName);                                              // 24
        }                                                                                                           //
        if (!entry.isDirectory) {                                                                                   // 25
          if (entry.entryName.indexOf(Importer.HipChat.RoomPrefix) > -1) {                                          // 26
            roomName = entry.entryName.split(Importer.HipChat.RoomPrefix)[1];                                       // 27
            if (roomName === 'list.json') {                                                                         // 28
              _this.updateProgress(Importer.ProgressStep.PREPARING_CHANNELS);                                       // 29
              tempRooms = JSON.parse(entry.getData().toString()).rooms;                                             // 29
              results = [];                                                                                         // 31
              for (k = 0, len1 = tempRooms.length; k < len1; k++) {                                                 //
                room = tempRooms[k];                                                                                //
                results.push(room.name = _.slugify(room.name));                                                     // 32
              }                                                                                                     // 31
              return results;                                                                                       //
            } else if (roomName.indexOf('/') > -1) {                                                                //
              item = roomName.split('/');                                                                           // 34
              roomName = _.slugify(item[0]);                                                                        // 34
              msgGroupData = item[1].split('.')[0];                                                                 // 34
              if (!tempMessages[roomName]) {                                                                        // 37
                tempMessages[roomName] = {};                                                                        // 38
              }                                                                                                     //
              try {                                                                                                 // 41
                return tempMessages[roomName][msgGroupData] = JSON.parse(entry.getData().toString());               //
              } catch (_error) {                                                                                    //
                return _this.logger.warn(entry.entryName + " is not a valid JSON file! Unable to import it.");      //
              }                                                                                                     //
            }                                                                                                       //
          } else if (entry.entryName.indexOf(Importer.HipChat.UsersPrefix) > -1) {                                  //
            usersName = entry.entryName.split(Importer.HipChat.UsersPrefix)[1];                                     // 46
            if (usersName === 'list.json') {                                                                        // 47
              _this.updateProgress(Importer.ProgressStep.PREPARING_USERS);                                          // 48
              return tempUsers = JSON.parse(entry.getData().toString()).users;                                      //
            } else {                                                                                                //
              return _this.logger.warn("Unexpected file in the " + _this.name + " import: " + entry.entryName);     //
            }                                                                                                       //
          }                                                                                                         //
        }                                                                                                           //
      };                                                                                                            //
    })(this);                                                                                                       //
    for (j = 0, len = zipEntries.length; j < len; j++) {                                                            // 20
      entry = zipEntries[j];                                                                                        //
      fn(entry);                                                                                                    // 21
    }                                                                                                               // 20
    usersId = this.collection.insert({                                                                              // 11
      'import': this.importRecord._id,                                                                              // 55
      'importer': this.name,                                                                                        // 55
      'type': 'users',                                                                                              // 55
      'users': tempUsers                                                                                            // 55
    });                                                                                                             //
    this.users = this.collection.findOne(usersId);                                                                  // 11
    this.updateRecord({                                                                                             // 11
      'count.users': tempUsers.length                                                                               // 57
    });                                                                                                             //
    this.addCountToTotal(tempUsers.length);                                                                         // 11
    channelsId = this.collection.insert({                                                                           // 11
      'import': this.importRecord._id,                                                                              // 61
      'importer': this.name,                                                                                        // 61
      'type': 'channels',                                                                                           // 61
      'channels': tempRooms                                                                                         // 61
    });                                                                                                             //
    this.channels = this.collection.findOne(channelsId);                                                            // 11
    this.updateRecord({                                                                                             // 11
      'count.channels': tempRooms.length                                                                            // 63
    });                                                                                                             //
    this.addCountToTotal(tempRooms.length);                                                                         // 11
    this.updateProgress(Importer.ProgressStep.PREPARING_MESSAGES);                                                  // 11
    messagesCount = 0;                                                                                              // 11
    fn1 = (function(_this) {                                                                                        // 69
      return function(channel, messagesObj) {                                                                       //
        var date, i, messagesId, msgs, results, splitMsg;                                                           // 71
        if (!_this.messages[channel]) {                                                                             // 71
          _this.messages[channel] = {};                                                                             // 72
        }                                                                                                           //
        results = [];                                                                                               // 73
        for (date in messagesObj) {                                                                                 //
          msgs = messagesObj[date];                                                                                 //
          messagesCount += msgs.length;                                                                             // 74
          _this.updateRecord({                                                                                      // 74
            'messagesstatus': channel + "/" + date                                                                  // 75
          });                                                                                                       //
          if (Importer.Base.getBSONSize(msgs) > Importer.Base.MaxBSONSize) {                                        // 77
            results.push((function() {                                                                              //
              var k, len1, ref1, results1;                                                                          //
              ref1 = Importer.Base.getBSONSafeArraysFromAnArray(msgs);                                              // 78
              results1 = [];                                                                                        // 78
              for (i = k = 0, len1 = ref1.length; k < len1; i = ++k) {                                              //
                splitMsg = ref1[i];                                                                                 //
                messagesId = this.collection.insert({                                                               // 79
                  'import': this.importRecord._id,                                                                  // 79
                  'importer': this.name,                                                                            // 79
                  'type': 'messages',                                                                               // 79
                  'name': channel + "/" + date + "." + i,                                                           // 79
                  'messages': splitMsg                                                                              // 79
                });                                                                                                 //
                results1.push(this.messages[channel][date + "." + i] = this.collection.findOne(messagesId));        // 79
              }                                                                                                     // 78
              return results1;                                                                                      //
            }).call(_this));                                                                                        //
          } else {                                                                                                  //
            messagesId = _this.collection.insert({                                                                  // 82
              'import': _this.importRecord._id,                                                                     // 82
              'importer': _this.name,                                                                               // 82
              'type': 'messages',                                                                                   // 82
              'name': channel + "/" + date,                                                                         // 82
              'messages': msgs                                                                                      // 82
            });                                                                                                     //
            results.push(_this.messages[channel][date] = _this.collection.findOne(messagesId));                     // 82
          }                                                                                                         //
        }                                                                                                           // 73
        return results;                                                                                             //
      };                                                                                                            //
    })(this);                                                                                                       //
    for (channel in tempMessages) {                                                                                 // 69
      messagesObj = tempMessages[channel];                                                                          //
      fn1(channel, messagesObj);                                                                                    // 70
    }                                                                                                               // 69
    this.updateRecord({                                                                                             // 11
      'count.messages': messagesCount,                                                                              // 85
      'messagesstatus': null                                                                                        // 85
    });                                                                                                             //
    this.addCountToTotal(messagesCount);                                                                            // 11
    if (tempUsers.length === 0 || tempRooms.length === 0 || messagesCount === 0) {                                  // 88
      this.logger.warn("The loaded users count " + tempUsers.length + ", the loaded channels " + tempChannels.length + ", and the loaded messages " + messagesCount);
      this.updateProgress(Importer.ProgressStep.ERROR);                                                             // 89
      return this.getProgress();                                                                                    // 91
    }                                                                                                               //
    selectionUsers = tempUsers.map(function(user) {                                                                 // 11
      return new Importer.SelectionUser(user.user_id, user.name, user.email, user.is_deleted, false, !user.is_bot);
    });                                                                                                             //
    selectionChannels = tempRooms.map(function(room) {                                                              // 11
      return new Importer.SelectionChannel(room.room_id, room.name, room.is_archived, true);                        // 97
    });                                                                                                             //
    this.updateProgress(Importer.ProgressStep.USER_SELECTION);                                                      // 11
    return new Importer.Selection(this.name, selectionUsers, selectionChannels);                                    // 100
  };                                                                                                                //
                                                                                                                    //
  HipChat.prototype.startImport = function(importSelection) {                                                       // 2
    var c, channel, j, k, l, len, len1, len2, len3, m, ref, ref1, ref2, ref3, start, startedByUserId, u, user;      // 103
    HipChat.__super__.startImport.call(this, importSelection);                                                      // 103
    start = Date.now();                                                                                             // 103
    ref = importSelection.users;                                                                                    // 106
    for (j = 0, len = ref.length; j < len; j++) {                                                                   // 106
      user = ref[j];                                                                                                //
      ref1 = this.users.users;                                                                                      // 107
      for (k = 0, len1 = ref1.length; k < len1; k++) {                                                              // 107
        u = ref1[k];                                                                                                //
        if (u.user_id === user.user_id) {                                                                           //
          u.do_import = user.do_import;                                                                             // 108
        }                                                                                                           //
      }                                                                                                             // 107
    }                                                                                                               // 106
    this.collection.update({                                                                                        // 103
      _id: this.users._id                                                                                           // 109
    }, {                                                                                                            //
      $set: {                                                                                                       // 109
        'users': this.users.users                                                                                   // 109
      }                                                                                                             //
    });                                                                                                             //
    ref2 = importSelection.channels;                                                                                // 111
    for (l = 0, len2 = ref2.length; l < len2; l++) {                                                                // 111
      channel = ref2[l];                                                                                            //
      ref3 = this.channels.channels;                                                                                // 112
      for (m = 0, len3 = ref3.length; m < len3; m++) {                                                              // 112
        c = ref3[m];                                                                                                //
        if (c.room_id === channel.channel_id) {                                                                     //
          c.do_import = channel.do_import;                                                                          // 113
        }                                                                                                           //
      }                                                                                                             // 112
    }                                                                                                               // 111
    this.collection.update({                                                                                        // 103
      _id: this.channels._id                                                                                        // 114
    }, {                                                                                                            //
      $set: {                                                                                                       // 114
        'channels': this.channels.channels                                                                          // 114
      }                                                                                                             //
    });                                                                                                             //
    startedByUserId = Meteor.userId();                                                                              // 103
    Meteor.defer((function(_this) {                                                                                 // 103
      return function() {                                                                                           //
        var fn, len4, len5, len6, messagesObj, n, nousers, o, p, ref4, ref5, ref6, ref7, timeTook;                  // 118
        _this.updateProgress(Importer.ProgressStep.IMPORTING_USERS);                                                // 118
        ref4 = _this.users.users;                                                                                   // 119
        for (n = 0, len4 = ref4.length; n < len4; n++) {                                                            // 119
          user = ref4[n];                                                                                           //
          if (user.do_import) {                                                                                     //
            (function(user) {                                                                                       // 120
              return Meteor.runAsUser(startedByUserId, function() {                                                 //
                var existantUser, userId;                                                                           // 122
                existantUser = RocketChat.models.Users.findOneByEmailAddress(user.email);                           // 122
                if (existantUser) {                                                                                 // 123
                  user.rocketId = existantUser._id;                                                                 // 124
                  _this.userTags.push({                                                                             // 124
                    hipchat: "@" + user.mention_name,                                                               // 126
                    rocket: "@" + existantUser.username                                                             // 126
                  });                                                                                               //
                } else {                                                                                            //
                  userId = Accounts.createUser({                                                                    // 129
                    email: user.email,                                                                              // 129
                    password: Date.now() + user.name + user.email.toUpperCase()                                     // 129
                  });                                                                                               //
                  user.rocketId = userId;                                                                           // 129
                  _this.userTags.push({                                                                             // 129
                    hipchat: "@" + user.mention_name,                                                               // 132
                    rocket: "@" + user.mention_name                                                                 // 132
                  });                                                                                               //
                  Meteor.runAsUser(userId, function() {                                                             // 129
                    Meteor.call('setUsername', user.mention_name);                                                  // 135
                    Meteor.call('joinDefaultChannels', true);                                                       // 135
                    Meteor.call('setAvatarFromService', user.photo_url, null, 'url');                               // 135
                    return Meteor.call('updateUserUtcOffset', parseInt(moment().tz(user.timezone).format('Z').toString().split(':')[0]));
                  });                                                                                               //
                  if (user.name != null) {                                                                          // 140
                    RocketChat.models.Users.setName(userId, user.name);                                             // 141
                  }                                                                                                 //
                  if (user.is_deleted) {                                                                            // 144
                    Meteor.call('setUserActiveStatus', userId, false);                                              // 145
                  }                                                                                                 //
                }                                                                                                   //
                return _this.addCountCompleted(1);                                                                  //
              });                                                                                                   //
            })(user);                                                                                               //
          }                                                                                                         //
        }                                                                                                           // 119
        _this.collection.update({                                                                                   // 118
          _id: _this.users._id                                                                                      // 147
        }, {                                                                                                        //
          $set: {                                                                                                   // 147
            'users': _this.users.users                                                                              // 147
          }                                                                                                         //
        });                                                                                                         //
        _this.updateProgress(Importer.ProgressStep.IMPORTING_CHANNELS);                                             // 118
        ref5 = _this.channels.channels;                                                                             // 150
        for (o = 0, len5 = ref5.length; o < len5; o++) {                                                            // 150
          channel = ref5[o];                                                                                        //
          if (channel.do_import) {                                                                                  //
            (function(channel) {                                                                                    // 151
              return Meteor.runAsUser(startedByUserId, function() {                                                 //
                var existantRoom, len6, p, ref6, userId;                                                            // 153
                channel.name = channel.name.replace(/ /g, '');                                                      // 153
                existantRoom = RocketChat.models.Rooms.findOneByName(channel.name);                                 // 153
                if (existantRoom) {                                                                                 // 155
                  channel.rocketId = existantRoom._id;                                                              // 156
                } else {                                                                                            //
                  userId = '';                                                                                      // 158
                  ref6 = _this.users.users;                                                                         // 159
                  for (p = 0, len6 = ref6.length; p < len6; p++) {                                                  // 159
                    user = ref6[p];                                                                                 //
                    if (user.user_id === channel.owner_user_id) {                                                   //
                      userId = user.rocketId;                                                                       // 160
                    }                                                                                               //
                  }                                                                                                 // 159
                  if (userId === '') {                                                                              // 162
                    _this.logger.warn("Failed to find the channel creator for " + channel.name + ", setting it to the current running user.");
                    userId = startedByUserId;                                                                       // 163
                  }                                                                                                 //
                  Meteor.runAsUser(userId, function() {                                                             // 158
                    var returned;                                                                                   // 167
                    returned = Meteor.call('createChannel', channel.name, []);                                      // 167
                    return channel.rocketId = returned.rid;                                                         //
                  });                                                                                               //
                  RocketChat.models.Rooms.update({                                                                  // 158
                    _id: channel.rocketId                                                                           // 169
                  }, {                                                                                              //
                    $set: {                                                                                         // 169
                      'ts': new Date(channel.created * 1000)                                                        // 169
                    }                                                                                               //
                  });                                                                                               //
                }                                                                                                   //
                return _this.addCountCompleted(1);                                                                  //
              });                                                                                                   //
            })(channel);                                                                                            //
          }                                                                                                         //
        }                                                                                                           // 150
        _this.collection.update({                                                                                   // 118
          _id: _this.channels._id                                                                                   // 171
        }, {                                                                                                        //
          $set: {                                                                                                   // 171
            'channels': _this.channels.channels                                                                     // 171
          }                                                                                                         //
        });                                                                                                         //
        _this.updateProgress(Importer.ProgressStep.IMPORTING_MESSAGES);                                             // 118
        nousers = {};                                                                                               // 118
        ref6 = _this.messages;                                                                                      // 175
        fn = function(channel, messagesObj) {                                                                       // 175
          return Meteor.runAsUser(startedByUserId, function() {                                                     //
            var date, hipchatChannel, message, msgObj, msgs, results, room;                                         // 178
            hipchatChannel = _this.getHipChatChannelFromName(channel);                                              // 178
            if (hipchatChannel != null ? hipchatChannel.do_import : void 0) {                                       // 179
              room = RocketChat.models.Rooms.findOneById(hipchatChannel.rocketId, {                                 // 180
                fields: {                                                                                           // 180
                  usernames: 1,                                                                                     // 180
                  t: 1,                                                                                             // 180
                  name: 1                                                                                           // 180
                }                                                                                                   //
              });                                                                                                   //
              results = [];                                                                                         // 181
              for (date in messagesObj) {                                                                           //
                msgs = messagesObj[date];                                                                           //
                _this.updateRecord({                                                                                // 182
                  'messagesstatus': channel + "/" + date + "." + msgs.messages.length                               // 182
                });                                                                                                 //
                results.push((function() {                                                                          // 182
                  var len6, p, ref7, results1;                                                                      //
                  ref7 = msgs.messages;                                                                             // 183
                  results1 = [];                                                                                    // 183
                  for (p = 0, len6 = ref7.length; p < len6; p++) {                                                  //
                    message = ref7[p];                                                                              //
                    if (message.from != null) {                                                                     // 184
                      user = this.getRocketUser(message.from.user_id);                                              // 185
                      if (user != null) {                                                                           // 186
                        msgObj = {                                                                                  // 187
                          msg: this.convertHipChatMessageToRocketChat(message.message),                             // 188
                          ts: new Date(message.date),                                                               // 188
                          u: {                                                                                      // 188
                            _id: user._id,                                                                          // 191
                            username: user.username                                                                 // 191
                          }                                                                                         //
                        };                                                                                          //
                        RocketChat.sendMessage(user, msgObj, room, true);                                           // 187
                      } else {                                                                                      //
                        if (!nousers[message.from.user_id]) {                                                       // 196
                          nousers[message.from.user_id] = message.from;                                             // 197
                        }                                                                                           //
                      }                                                                                             //
                    } else {                                                                                        //
                      if (!_.isArray(message)) {                                                                    // 199
                        console.warn('Please report the following:', message);                                      // 200
                      }                                                                                             //
                    }                                                                                               //
                    results1.push(this.addCountCompleted(1));                                                       // 184
                  }                                                                                                 // 183
                  return results1;                                                                                  //
                }).call(_this));                                                                                    //
              }                                                                                                     // 181
              return results;                                                                                       //
            }                                                                                                       //
          });                                                                                                       //
        };                                                                                                          //
        for (channel in ref6) {                                                                                     // 175
          messagesObj = ref6[channel];                                                                              //
          fn(channel, messagesObj);                                                                                 // 176
        }                                                                                                           // 175
        _this.logger.warn('The following did not have users:', nousers);                                            // 118
        _this.updateProgress(Importer.ProgressStep.FINISHING);                                                      // 118
        ref7 = _this.channels.channels;                                                                             // 205
        for (p = 0, len6 = ref7.length; p < len6; p++) {                                                            // 205
          channel = ref7[p];                                                                                        //
          if (channel.do_import && channel.is_archived) {                                                           //
            (function(channel) {                                                                                    // 206
              return Meteor.runAsUser(startedByUserId, function() {                                                 //
                return Meteor.call('archiveRoom', channel.rocketId);                                                //
              });                                                                                                   //
            })(channel);                                                                                            //
          }                                                                                                         //
        }                                                                                                           // 205
        _this.updateProgress(Importer.ProgressStep.DONE);                                                           // 118
        timeTook = Date.now() - start;                                                                              // 118
        return _this.logger.log("Import took " + timeTook + " milliseconds.");                                      //
      };                                                                                                            //
    })(this));                                                                                                      //
    return this.getProgress();                                                                                      // 214
  };                                                                                                                //
                                                                                                                    //
  HipChat.prototype.getHipChatChannelFromName = function(channelName) {                                             // 2
    var channel, j, len, ref;                                                                                       // 217
    ref = this.channels.channels;                                                                                   // 217
    for (j = 0, len = ref.length; j < len; j++) {                                                                   // 217
      channel = ref[j];                                                                                             //
      if (channel.name === channelName) {                                                                           //
        return channel;                                                                                             // 218
      }                                                                                                             //
    }                                                                                                               // 217
  };                                                                                                                //
                                                                                                                    //
  HipChat.prototype.getRocketUser = function(hipchatId) {                                                           // 2
    var j, len, ref, user;                                                                                          // 221
    ref = this.users.users;                                                                                         // 221
    for (j = 0, len = ref.length; j < len; j++) {                                                                   // 221
      user = ref[j];                                                                                                //
      if (user.user_id === hipchatId) {                                                                             //
        return RocketChat.models.Users.findOneById(user.rocketId, {                                                 // 222
          fields: {                                                                                                 // 222
            username: 1                                                                                             // 222
          }                                                                                                         //
        });                                                                                                         //
      }                                                                                                             //
    }                                                                                                               // 221
  };                                                                                                                //
                                                                                                                    //
  HipChat.prototype.convertHipChatMessageToRocketChat = function(message) {                                         // 2
    var j, len, ref, userReplace;                                                                                   // 225
    if (message != null) {                                                                                          // 225
      ref = this.userTags;                                                                                          // 226
      for (j = 0, len = ref.length; j < len; j++) {                                                                 // 226
        userReplace = ref[j];                                                                                       //
        message = message.replace(userReplace.hipchat, userReplace.rocket);                                         // 227
      }                                                                                                             // 226
    } else {                                                                                                        //
      message = '';                                                                                                 // 229
    }                                                                                                               //
    return message;                                                                                                 // 230
  };                                                                                                                //
                                                                                                                    //
  HipChat.prototype.getSelection = function() {                                                                     // 2
    var selectionChannels, selectionUsers;                                                                          // 233
    selectionUsers = this.users.users.map(function(user) {                                                          // 233
      return new Importer.SelectionUser(user.user_id, user.name, user.email, user.is_deleted, false, !user.is_bot);
    });                                                                                                             //
    selectionChannels = this.channels.channels.map(function(room) {                                                 // 233
      return new Importer.SelectionChannel(room.room_id, room.name, room.is_archived, true);                        // 237
    });                                                                                                             //
    return new Importer.Selection(this.name, selectionUsers, selectionChannels);                                    // 239
  };                                                                                                                //
                                                                                                                    //
  return HipChat;                                                                                                   //
                                                                                                                    //
})(Importer.Base);                                                                                                  //
                                                                                                                    //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/rocketchat_importer-hipchat/main.coffee.js                                                              //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Importer.AddImporter('hipchat', Importer.HipChat, {                                                                 // 1
  name: 'HipChat',                                                                                                  // 2
  description: TAPi18n.__('Importer_From_Description', {                                                            // 2
    from: 'HipChat'                                                                                                 // 3
  }),                                                                                                               //
  fileTypeRegex: new RegExp('application\/.*?zip')                                                                  // 2
});                                                                                                                 //
                                                                                                                    //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:importer-hipchat'] = {};

})();

//# sourceMappingURL=rocketchat_importer-hipchat.js.map
