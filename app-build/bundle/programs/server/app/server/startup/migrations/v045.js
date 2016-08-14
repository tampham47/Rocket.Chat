(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/migrations/v045.js                                   //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
RocketChat.Migrations.add({                                            // 1
	version: 45,                                                          // 2
	up: function () {                                                     // 3
                                                                       //
		// finds the latest created visitor                                  //
		var lastVisitor = RocketChat.models.Users.find({ type: 'visitor' }, { fields: { username: 1 }, sort: { createdAt: -1 }, limit: 1 }).fetch();
                                                                       //
		if (lastVisitor && lastVisitor.length > 0) {                         // 8
			var lastNumber = lastVisitor[0].username.replace(/^guest\-/, '');   // 9
                                                                       //
			RocketChat.settings.add('Livechat_guest_count', parseInt(lastNumber) + 1, { type: 'int', group: 'Livechat' });
		}                                                                    //
	}                                                                     //
});                                                                    //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=v045.js.map
