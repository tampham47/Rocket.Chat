(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/migrations/v041.js                                   //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
RocketChat.Migrations.add({                                            // 1
	version: 41,                                                          // 2
	up: function () {                                                     // 3
		if (RocketChat && RocketChat.models && RocketChat.models.Users) {    // 4
			RocketChat.models.Users.update({ bot: true }, { $set: { type: 'bot' } }, { multi: true });
			RocketChat.models.Users.update({ 'profile.guest': true }, { $set: { type: 'visitor' } }, { multi: true });
			RocketChat.models.Users.update({ type: { $exists: false } }, { $set: { type: 'user' } }, { multi: true });
		}                                                                    //
	}                                                                     //
});                                                                    //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=v041.js.map
