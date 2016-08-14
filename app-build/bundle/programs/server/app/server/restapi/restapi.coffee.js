(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/restapi/restapi.coffee.js                                    //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var Api;                                                               // 1
                                                                       //
Api = new Restivus({                                                   // 1
  useDefaultAuth: true,                                                // 2
  prettyJson: true,                                                    // 2
  enableCors: false                                                    // 2
});                                                                    //
                                                                       //
Api.addRoute('info', {                                                 // 1
  authRequired: false                                                  // 7
}, {                                                                   //
  get: function() {                                                    // 8
    return RocketChat.Info;                                            //
  }                                                                    //
});                                                                    //
                                                                       //
Api.addRoute('version', {                                              // 1
  authRequired: false                                                  // 11
}, {                                                                   //
  get: function() {                                                    // 12
    var version;                                                       // 13
    version = {                                                        // 13
      api: '0.1',                                                      // 13
      rocketchat: '0.5'                                                // 13
    };                                                                 //
    return {                                                           //
      status: 'success',                                               // 14
      versions: version                                                // 14
    };                                                                 //
  }                                                                    //
});                                                                    //
                                                                       //
Api.addRoute('publicRooms', {                                          // 1
  authRequired: true                                                   // 16
}, {                                                                   //
  get: function() {                                                    // 17
    var rooms;                                                         // 18
    rooms = RocketChat.models.Rooms.findByType('c', {                  // 18
      sort: {                                                          // 18
        msgs: -1                                                       // 18
      }                                                                //
    }).fetch();                                                        //
    return {                                                           //
      status: 'success',                                               // 19
      rooms: rooms                                                     // 19
    };                                                                 //
  }                                                                    //
});                                                                    //
                                                                       //
                                                                       // 21
/*                                                                     // 21
@api {get} /joinedRooms Get joined rooms.                              //
 */                                                                    //
                                                                       //
Api.addRoute('joinedRooms', {                                          // 1
  authRequired: true                                                   // 24
}, {                                                                   //
  get: function() {                                                    // 25
    var rooms;                                                         // 26
    rooms = RocketChat.models.Rooms.findByContainigUsername(this.user.username).fetch();
    return {                                                           //
      status: 'success',                                               // 27
      rooms: rooms                                                     // 27
    };                                                                 //
  }                                                                    //
});                                                                    //
                                                                       //
Api.addRoute('rooms/:id/join', {                                       // 1
  authRequired: true                                                   // 30
}, {                                                                   //
  post: function() {                                                   // 31
    Meteor.runAsUser(this.userId, (function(_this) {                   // 32
      return function() {                                              //
        return Meteor.call('joinRoom', _this.urlParams.id);            //
      };                                                               //
    })(this));                                                         //
    return {                                                           //
      status: 'success'                                                // 34
    };                                                                 //
  }                                                                    //
});                                                                    //
                                                                       //
Api.addRoute('rooms/:id/leave', {                                      // 1
  authRequired: true                                                   // 37
}, {                                                                   //
  post: function() {                                                   // 38
    Meteor.runAsUser(this.userId, (function(_this) {                   // 39
      return function() {                                              //
        return Meteor.call('leaveRoom', _this.urlParams.id);           //
      };                                                               //
    })(this));                                                         //
    return {                                                           //
      status: 'success'                                                // 41
    };                                                                 //
  }                                                                    //
});                                                                    //
                                                                       //
                                                                       // 44
/*                                                                     // 44
@api {get} /rooms/:id/messages?skip=:skip&limit=:limit Get messages in a room.
@apiParam {Number} id         Room ID                                  //
@apiParam {Number} [skip=0]   Number of results to skip at the beginning
@apiParam {Number} [limit=50] Maximum number of results to return      //
 */                                                                    //
                                                                       //
Api.addRoute('rooms/:id/messages', {                                   // 1
  authRequired: true                                                   // 50
}, {                                                                   //
  get: function() {                                                    // 51
    var e, limit, msgs, rid, skip;                                     // 52
    try {                                                              // 52
      rid = this.urlParams.id;                                         // 53
      skip = this.queryParams.skip | 0 || 0;                           // 53
      limit = this.queryParams.limit | 0 || 50;                        // 53
      if (limit > 50) {                                                // 57
        limit = 50;                                                    // 57
      }                                                                //
      if (Meteor.call('canAccessRoom', rid, this.userId)) {            // 58
        msgs = RocketChat.models.Messages.findVisibleByRoomId(rid, {   // 59
          sort: {                                                      // 60
            ts: -1                                                     // 61
          },                                                           //
          skip: skip,                                                  // 60
          limit: limit                                                 // 60
        }).fetch();                                                    //
        return {                                                       //
          status: 'success',                                           // 65
          messages: msgs                                               // 65
        };                                                             //
      } else {                                                         //
        return {                                                       //
          statusCode: 403,                                             // 67
          body: {                                                      // 67
            status: 'fail',                                            // 68
            message: 'Cannot access room.'                             // 68
          }                                                            //
        };                                                             //
      }                                                                //
    } catch (_error) {                                                 //
      e = _error;                                                      // 70
      return {                                                         //
        statusCode: 400,                                               // 70
        body: {                                                        // 70
          status: 'fail',                                              // 71
          message: e.name + ' :: ' + e.message                         // 71
        }                                                              //
      };                                                               //
    }                                                                  //
  }                                                                    //
});                                                                    //
                                                                       //
Api.addRoute('rooms/:id/send', {                                       // 1
  authRequired: true                                                   // 76
}, {                                                                   //
  post: function() {                                                   // 77
    Meteor.runAsUser(this.userId, (function(_this) {                   // 78
      return function() {                                              //
        console.log(_this.bodyParams.msg);                             // 79
        return Meteor.call('sendMessage', {                            //
          msg: _this.bodyParams.msg,                                   // 80
          rid: _this.urlParams.id                                      // 80
        });                                                            //
      };                                                               //
    })(this));                                                         //
    return {                                                           //
      status: 'success'                                                // 81
    };                                                                 //
  }                                                                    //
});                                                                    //
                                                                       //
Api.addRoute('rooms/:id/online', {                                     // 1
  authRequired: true                                                   // 84
}, {                                                                   //
  get: function() {                                                    // 85
    var i, j, len, online, onlineInRoom, room, user;                   // 86
    room = RocketChat.models.Rooms.findOneById(this.urlParams.id);     // 86
    online = RocketChat.models.Users.findUsersNotOffline({             // 86
      fields: {                                                        // 87
        username: 1,                                                   // 88
        status: 1                                                      // 88
      }                                                                //
    }).fetch();                                                        //
    onlineInRoom = [];                                                 // 86
    for (i = j = 0, len = online.length; j < len; i = ++j) {           // 91
      user = online[i];                                                //
      if (room.usernames.indexOf(user.username) !== -1) {              // 92
        onlineInRoom.push(user.username);                              // 93
      }                                                                //
    }                                                                  // 91
    return {                                                           //
      status: 'success',                                               // 95
      online: onlineInRoom                                             // 95
    };                                                                 //
  }                                                                    //
});                                                                    //
                                                                       //
Api.testapiValidateUsers = function(users) {                           // 1
  var i, j, len, nameValidation, user;                                 // 99
  for (i = j = 0, len = users.length; j < len; i = ++j) {              // 99
    user = users[i];                                                   //
    if (user.name != null) {                                           // 100
      if (user.email != null) {                                        // 101
        if (user.pass != null) {                                       // 102
          try {                                                        // 103
            nameValidation = new RegExp('^' + RocketChat.settings.get('UTF8_Names_Validation') + '$', 'i');
          } catch (_error) {                                           //
            nameValidation = new RegExp('^[0-9a-zA-Z-_.]+$', 'i');     // 106
          }                                                            //
          if (nameValidation.test(user.name)) {                        // 108
            if (/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]+\b/i.test(user.email)) {
              continue;                                                // 110
            }                                                          //
          }                                                            //
        }                                                              //
      }                                                                //
    }                                                                  //
    throw new Meteor.Error('invalid-user-record', "[restapi] bulk/register -> record #" + i + " is invalid");
  }                                                                    // 99
};                                                                     // 98
                                                                       //
                                                                       // 115
/*                                                                     // 115
@api {post} /bulk/register  Register multiple users based on an input array.
@apiName register                                                      //
@apiGroup TestAndAdminAutomation                                       //
@apiVersion 0.0.1                                                      //
@apiDescription  Caller must have 'testagent' or 'adminautomation' role.
NOTE:   remove room is NOT recommended; use Meteor.reset() to clear db and re-seed instead
@apiParam {json} rooms An array of users in the body of the POST.      //
@apiParamExample {json} POST Request Body example:                     //
  {                                                                    //
    'users':[ {'email': 'user1@user1.com',                             //
               'name': 'user1',                                        //
               'pass': 'abc123' },                                     //
              {'email': 'user2@user2.com',                             //
               'name': 'user2',                                        //
               'pass': 'abc123'},                                      //
              ...                                                      //
            ]                                                          //
  }                                                                    //
@apiSuccess {json} ids An array of IDs of the registered users.        //
@apiSuccessExample {json} Success-Response:                            //
  HTTP/1.1 200 OK                                                      //
  {                                                                    //
    'ids':[ {'uid': 'uid_1'},                                          //
            {'uid': 'uid_2'},                                          //
            ...                                                        //
    ]                                                                  //
  }                                                                    //
 */                                                                    //
                                                                       //
Api.addRoute('bulk/register', {                                        // 1
  authRequired: true                                                   // 144
}, {                                                                   //
  post: {                                                              // 145
    action: function() {                                               // 148
      var e, endCount, i, ids, incoming, j, len, ref;                  // 149
      if (RocketChat.authz.hasPermission(this.userId, 'bulk-register-user')) {
        try {                                                          // 150
          Api.testapiValidateUsers(this.bodyParams.users);             // 152
          this.response.setTimeout(500 * this.bodyParams.users.length);
          ids = [];                                                    // 152
          endCount = this.bodyParams.users.length - 1;                 // 152
          ref = this.bodyParams.users;                                 // 156
          for (i = j = 0, len = ref.length; j < len; i = ++j) {        // 156
            incoming = ref[i];                                         //
            ids[i] = {                                                 // 157
              uid: Meteor.call('registerUser', incoming)               // 157
            };                                                         //
            Meteor.runAsUser(ids[i].uid, (function(_this) {            // 157
              return function() {                                      //
                Meteor.call('setUsername', incoming.name);             // 159
                return Meteor.call('joinDefaultChannels');             //
              };                                                       //
            })(this));                                                 //
          }                                                            // 156
          return {                                                     //
            status: 'success',                                         // 162
            ids: ids                                                   // 162
          };                                                           //
        } catch (_error) {                                             //
          e = _error;                                                  // 164
          return {                                                     //
            statusCode: 400,                                           // 164
            body: {                                                    // 164
              status: 'fail',                                          // 165
              message: e.name + ' :: ' + e.message                     // 165
            }                                                          //
          };                                                           //
        }                                                              //
      } else {                                                         //
        console.log('[restapi] bulk/register -> '.red, "User does not have 'bulk-register-user' permission");
        return {                                                       //
          statusCode: 403,                                             // 168
          body: {                                                      // 168
            status: 'error',                                           // 169
            message: 'You do not have permission to do this'           // 169
          }                                                            //
        };                                                             //
      }                                                                //
    }                                                                  //
  }                                                                    //
});                                                                    //
                                                                       //
Api.testapiValidateRooms = function(rooms) {                           // 1
  var i, j, len, nameValidation, room;                                 // 176
  for (i = j = 0, len = rooms.length; j < len; i = ++j) {              // 176
    room = rooms[i];                                                   //
    if (room.name != null) {                                           // 177
      if (room.members != null) {                                      // 178
        if (room.members.length > 1) {                                 // 179
          try {                                                        // 180
            nameValidation = new RegExp('^' + RocketChat.settings.get('UTF8_Names_Validation') + '$', 'i');
          } catch (_error) {                                           //
            nameValidation = new RegExp('^[0-9a-zA-Z-_.]+$', 'i');     // 183
          }                                                            //
          if (nameValidation.test(room.name)) {                        // 185
            continue;                                                  // 186
          }                                                            //
        }                                                              //
      }                                                                //
    }                                                                  //
    throw new Meteor.Error('invalid-room-record', "[restapi] bulk/createRoom -> record #" + i + " is invalid");
  }                                                                    // 176
};                                                                     // 175
                                                                       //
                                                                       // 191
/*                                                                     // 191
@api {post} /bulk/createRoom Create multiple rooms based on an input array.
@apiName createRoom                                                    //
@apiGroup TestAndAdminAutomation                                       //
@apiVersion 0.0.1                                                      //
@apiParam {json} rooms An array of rooms in the body of the POST. 'name' is room name, 'members' is array of usernames
@apiParamExample {json} POST Request Body example:                     //
  {                                                                    //
    'rooms':[ {'name': 'room1',                                        //
               'members': ['user1', 'user2']                           //
              },                                                       //
              {'name': 'room2',                                        //
               'members': ['user1', 'user2', 'user3']                  //
              }                                                        //
              ...                                                      //
            ]                                                          //
  }                                                                    //
@apiDescription  Caller must have 'testagent' or 'adminautomation' role.
NOTE:   remove room is NOT recommended; use Meteor.reset() to clear db and re-seed instead
                                                                       //
@apiSuccess {json} ids An array of ids of the rooms created.           //
@apiSuccessExample {json} Success-Response:                            //
  HTTP/1.1 200 OK                                                      //
  {                                                                    //
    'ids':[ {'rid': 'rid_1'},                                          //
            {'rid': 'rid_2'},                                          //
            ...                                                        //
    ]                                                                  //
  }                                                                    //
 */                                                                    //
                                                                       //
Api.addRoute('bulk/createRoom', {                                      // 1
  authRequired: true                                                   // 221
}, {                                                                   //
  post: {                                                              // 222
    action: function() {                                               // 225
      var e, ids;                                                      // 228
      if (RocketChat.authz.hasPermission(this.userId, 'bulk-create-c')) {
        try {                                                          // 229
          this.response.setTimeout(1000 * this.bodyParams.rooms.length);
          Api.testapiValidateRooms(this.bodyParams.rooms);             // 230
          ids = [];                                                    // 230
          Meteor.runAsUser(this.userId, (function(_this) {             // 230
            return function() {                                        //
              var i, incoming, j, len, ref, results;                   // 234
              ref = _this.bodyParams.rooms;                            // 234
              results = [];                                            // 234
              for (i = j = 0, len = ref.length; j < len; i = ++j) {    //
                incoming = ref[i];                                     //
                results.push(ids[i] = Meteor.call('createChannel', incoming.name, incoming.members));
              }                                                        // 234
              return results;                                          //
            };                                                         //
          })(this));                                                   //
          return {                                                     //
            status: 'success',                                         // 235
            ids: ids                                                   // 235
          };                                                           //
        } catch (_error) {                                             //
          e = _error;                                                  // 237
          return {                                                     //
            statusCode: 400,                                           // 237
            body: {                                                    // 237
              status: 'fail',                                          // 238
              message: e.name + ' :: ' + e.message                     // 238
            }                                                          //
          };                                                           //
        }                                                              //
      } else {                                                         //
        console.log('[restapi] bulk/createRoom -> '.red, "User does not have 'bulk-create-c' permission");
        return {                                                       //
          statusCode: 403,                                             // 241
          body: {                                                      // 241
            status: 'error',                                           // 242
            message: 'You do not have permission to do this'           // 242
          }                                                            //
        };                                                             //
      }                                                                //
    }                                                                  //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=restapi.coffee.js.map
