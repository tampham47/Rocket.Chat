(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/migrations/v054.js                                   //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
RocketChat.Migrations.add({                                            // 1
	version: 54,                                                          // 2
	up: function () {                                                     // 3
		if (RocketChat && RocketChat.models && RocketChat.models.Users) {    // 4
			// Set default message viewMode to 'normal' or 'cozy' depending on the users' current settings and remove the field 'compactView'
			RocketChat.models.Users.update({ 'settings.preferences.compactView': true }, { $set: { 'settings.preferences.viewMode': 1 }, $unset: { 'settings.preferences.compactView': 1 } }, { multi: true });
			RocketChat.models.Users.update({ 'settings.preferences.viewMode': { $ne: 1 } }, { $set: { 'settings.preferences.viewMode': 0 } }, { multi: true });
		}                                                                    //
	}                                                                     //
});                                                                    //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=v054.js.map
