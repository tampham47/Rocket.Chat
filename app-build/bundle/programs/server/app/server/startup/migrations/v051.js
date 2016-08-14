(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/migrations/v051.js                                   //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
RocketChat.Migrations.add({                                            // 1
	version: 51,                                                          // 2
	up: function () {                                                     // 3
		RocketChat.models.Rooms.find({ t: 'l', 'v.token': { $exists: true }, label: { $exists: false } }).forEach(function (room) {
			var user = RocketChat.models.Users.findOne({ 'profile.token': room.v.token });
			if (user) {                                                         // 6
				RocketChat.models.Rooms.update({ _id: room._id }, {                // 7
					$set: {                                                           // 8
						label: user.name || user.username,                               // 9
						'v._id': user._id                                                // 10
					}                                                                 //
				});                                                                //
				RocketChat.models.Subscriptions.update({ rid: room._id }, {        // 13
					$set: {                                                           // 14
						name: user.name || user.username                                 // 15
					}                                                                 //
				}, { multi: true });                                               //
			}                                                                   //
		});                                                                  //
	}                                                                     //
});                                                                    //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=v051.js.map
