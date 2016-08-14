(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/migrations/v044.js                                   //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
RocketChat.Migrations.add({                                            // 1
	version: 44,                                                          // 2
	up: function () {                                                     // 3
		if (RocketChat && RocketChat.models && RocketChat.models.Users) {    // 4
			RocketChat.models.Users.find({ $or: [{ 'settings.preferences.disableNewRoomNotification': { $exists: 1 } }, { 'settings.preferences.disableNewMessageNotification': { $exists: 1 } }] }).forEach(function (user) {
				var newRoomNotification = !(user && user.settings && user.settings.preferences && user.settings.preferences.disableNewRoomNotification);
				var newMessageNotification = !(user && user.settings && user.settings.preferences && user.settings.preferences.disableNewMessageNotification);
				RocketChat.models.Users.update({ _id: user._id }, { $unset: { 'settings.preferences.disableNewRoomNotification': 1, 'settings.preferences.disableNewMessageNotification': 1 }, $set: { 'settings.preferences.newRoomNotification': newRoomNotification, 'settings.preferences.newMessageNotification': newMessageNotification } });
			});                                                                 //
		}                                                                    //
                                                                       //
		if (RocketChat && RocketChat.models && RocketChat.models.Settings) {
			var optOut = RocketChat.models.Settings.findOne({ _id: 'Statistics_opt_out' });
			if (optOut) {                                                       // 14
				RocketChat.models.Settings.remove({ _id: 'Statistics_opt_out' });  // 15
				RocketChat.models.Settings.upsert({ _id: 'Statistics_reporting' }, {
					$set: {                                                           // 17
						value: !optOut.value ? true : false,                             // 18
						i18nDescription: 'Statistics_reporting_Description',             // 19
						packageValue: true,                                              // 20
						i18nLabel: 'Statistics_reporting'                                // 21
					}                                                                 //
				});                                                                //
			}                                                                   //
		}                                                                    //
                                                                       //
		if (RocketChat && RocketChat.models && RocketChat.models.Settings) {
			var favoriteRooms = RocketChat.models.Settings.findOne({ _id: 'Disable_Favorite_Rooms' });
			if (favoriteRooms) {                                                // 29
				RocketChat.models.Settings.remove({ _id: 'Disable_Favorite_Rooms' });
				RocketChat.models.Settings.upsert({ _id: 'Favorite_Rooms' }, {     // 31
					$set: {                                                           // 32
						value: !favoriteRooms.value ? true : false,                      // 33
						i18nDescription: 'Favorite_Rooms_Description',                   // 34
						packageValue: true,                                              // 35
						i18nLabel: 'Favorite_Rooms'                                      // 36
					}                                                                 //
				});                                                                //
			}                                                                   //
		}                                                                    //
	}                                                                     //
});                                                                    //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=v044.js.map
