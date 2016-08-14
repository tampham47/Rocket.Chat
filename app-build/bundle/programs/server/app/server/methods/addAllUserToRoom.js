(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/addAllUserToRoom.js                                  //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
Meteor.methods({                                                       // 1
	addAllUserToRoom: function (rid) {                                    // 2
		if (RocketChat.authz.hasRole(this.userId, 'admin') === true) {       // 3
			var now, room, users;                                               // 4
			var userCount = RocketChat.models.Users.find().count();             // 5
			if (userCount > RocketChat.settings.get('API_User_Limit')) {        // 6
				throw new Meteor.Error('error-user-limit-exceeded', 'User Limit Exceeded', {
					method: 'addAllToRoom'                                            // 8
				});                                                                //
			}                                                                   //
			room = RocketChat.models.Rooms.findOneById(rid);                    // 11
			if (room == null) {                                                 // 12
				throw new Meteor.Error('error-invalid-room', 'Invalid room', {     // 13
					method: 'addAllToRoom'                                            // 14
				});                                                                //
			}                                                                   //
			users = RocketChat.models.Users.find().fetch();                     // 17
			now = new Date();                                                   // 18
			users.forEach(function (user) {                                     // 19
				var subscription;                                                  // 20
				subscription = RocketChat.models.Subscriptions.findOneByRoomIdAndUserId(rid, user._id);
				if (subscription != null) {                                        // 22
					return;                                                           // 23
				}                                                                  //
				RocketChat.callbacks.run('beforeJoinRoom', user, room);            // 25
				RocketChat.models.Rooms.addUsernameById(rid, user.username);       // 26
				RocketChat.models.Subscriptions.createWithRoomAndUser(room, user, {
					ts: now,                                                          // 28
					open: true,                                                       // 29
					alert: true,                                                      // 30
					unread: 1                                                         // 31
				});                                                                //
				RocketChat.models.Messages.createUserJoinWithRoomIdAndUser(rid, user, {
					ts: now                                                           // 34
				});                                                                //
				Meteor.defer(function () {});                                      // 36
				return RocketChat.callbacks.run('afterJoinRoom', user, room);      // 37
			});                                                                 //
			return true;                                                        // 39
		} else {                                                             //
			throw new Meteor.Error(403, 'Access to Method Forbidden', {         // 41
				method: 'addAllToRoom'                                             // 42
			});                                                                 //
		}                                                                    //
	}                                                                     //
});                                                                    //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=addAllUserToRoom.js.map
