(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/migrations/v050.js                                   //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
RocketChat.Migrations.add({                                            // 1
	version: 50,                                                          // 2
	up: function () {                                                     // 3
		RocketChat.models.Subscriptions.tryDropIndex('u._id_1_name_1_t_1');  // 4
		RocketChat.models.Subscriptions.tryEnsureIndex({ 'u._id': 1, 'name': 1, 't': 1 });
	}                                                                     //
});                                                                    //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=v050.js.map
