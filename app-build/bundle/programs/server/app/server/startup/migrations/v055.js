(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/migrations/v055.js                                   //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
RocketChat.Migrations.add({                                            // 1
	version: 55,                                                          // 2
	up: function () {                                                     // 3
		RocketChat.models.Rooms.find({ 'topic': { $exists: 1, $ne: '' } }, { topic: 1 }).forEach(function (room) {
			var topic = s.escapeHTML(room.topic);                               // 5
			RocketChat.models.Rooms.update({ _id: room._id }, { $set: { topic: topic } });
			RocketChat.models.Messages.update({ t: 'room_changed_topic', rid: room._id }, { $set: { msg: topic } });
		});                                                                  //
	}                                                                     //
});                                                                    //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=v055.js.map
