(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/migrations/v052.js                                   //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
RocketChat.Migrations.add({                                            // 1
	version: 52,                                                          // 2
	up: function () {                                                     // 3
		RocketChat.models.Users.update({ _id: 'rocket.cat' }, { $addToSet: { roles: 'bot' } });
	}                                                                     //
});                                                                    //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=v052.js.map
