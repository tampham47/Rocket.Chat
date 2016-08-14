(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/migrations/v049.js                                   //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
RocketChat.Migrations.add({                                            // 1
	version: 49,                                                          // 2
	up: function () {                                                     // 3
                                                                       //
		var count = 1;                                                       // 5
                                                                       //
		RocketChat.models.Rooms.find({ t: 'l' }, { sort: { ts: 1 }, fields: { _id: 1 } }).forEach(function (room) {
			RocketChat.models.Rooms.update({ _id: room._id }, { $set: { code: count } });
			RocketChat.models.Subscriptions.update({ rid: room._id }, { $set: { code: count } }, { multi: true });
			count++;                                                            // 10
		});                                                                  //
                                                                       //
		RocketChat.models.Settings.upsert({ _id: 'Livechat_Room_Count' }, {  // 13
			$set: {                                                             // 14
				value: count,                                                      // 15
				type: 'int',                                                       // 16
				group: 'Livechat'                                                  // 17
			}                                                                   //
		});                                                                  //
	}                                                                     //
});                                                                    //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=v049.js.map
