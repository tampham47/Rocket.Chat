(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/migrations/v038.js                                   //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
RocketChat.Migrations.add({                                            // 1
	version: 38,                                                          // 2
	up: function () {                                                     // 3
		if (RocketChat && RocketChat.settings && RocketChat.settings.get) {  // 4
			var allowPinning = RocketChat.settings.get('Message_AllowPinningByAnyone');
                                                                       //
			// If public pinning was allowed, add pinning permissions to 'users', else leave it to 'owners' and 'moderators'
			if (allowPinning) {                                                 // 8
				if (RocketChat.models && RocketChat.models.Permissions) {          // 9
					RocketChat.models.Permissions.update({ _id: 'pin-message' }, { $addToSet: { roles: 'user' } });
				}                                                                  //
			}                                                                   //
		}                                                                    //
	}                                                                     //
});                                                                    //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=v038.js.map
