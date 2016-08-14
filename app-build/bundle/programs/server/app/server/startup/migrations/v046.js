(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/migrations/v046.js                                   //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
RocketChat.Migrations.add({                                            // 1
	version: 46,                                                          // 2
	up: function () {                                                     // 3
		if (RocketChat && RocketChat.models && RocketChat.models.Users) {    // 4
			RocketChat.models.Users.update({ type: { $exists: false } }, { $set: { type: 'user' } }, { multi: true });
		}                                                                    //
	}                                                                     //
});                                                                    //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=v046.js.map
