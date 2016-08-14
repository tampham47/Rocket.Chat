(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/migrations/v043.js                                   //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
RocketChat.Migrations.add({                                            // 1
	version: 43,                                                          // 2
	up: function () {                                                     // 3
		if (RocketChat && RocketChat.models && RocketChat.models.Permissions) {
			RocketChat.models.Permissions.update({ _id: 'pin-message' }, { $addToSet: { roles: 'admin' } });
		}                                                                    //
	}                                                                     //
});                                                                    //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=v043.js.map
