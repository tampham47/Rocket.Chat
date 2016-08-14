(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var ECMAScript = Package.ecmascript.ECMAScript;
var check = Package.check.check;
var Match = Package.check.Match;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var babelHelpers = Package['babel-runtime'].babelHelpers;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var Promise = Package.promise.Promise;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                         //
// packages/rocketchat_slashcommands-unarchive/messages.js                                 //
//                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////
                                                                                           //
RocketChat.models.Messages.createRoomUnarchivedByRoomIdAndUser = function (roomId, user) {
	return this.createWithTypeRoomIdMessageAndUser('room-unarchived', roomId, '', user);      // 2
};                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                         //
// packages/rocketchat_slashcommands-unarchive/server.js                                   //
//                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////
                                                                                           //
function Unarchive(command, params, item) {                                                // 1
	var channel, room, user;                                                                  // 2
	if (command !== 'unarchive' || !Match.test(params, String)) {                             // 3
		return;                                                                                  // 4
	}                                                                                         //
	channel = params.trim();                                                                  // 6
	if (channel === '') {                                                                     // 7
		room = RocketChat.models.Rooms.findOneById(item.rid);                                    // 8
		channel = room.name;                                                                     // 9
	} else {                                                                                  //
		channel = channel.replace('#', '');                                                      // 11
		room = RocketChat.models.Rooms.findOneByName(channel);                                   // 12
	}                                                                                         //
	user = Meteor.users.findOne(Meteor.userId());                                             // 14
                                                                                           //
	if (!room.archived) {                                                                     // 16
		RocketChat.Notifications.notifyUser(Meteor.userId(), 'message', {                        // 17
			_id: Random.id(),                                                                       // 18
			rid: item.rid,                                                                          // 19
			ts: new Date(),                                                                         // 20
			msg: TAPi18n.__('Channel_already_Unarchived', {                                         // 21
				postProcess: 'sprintf',                                                                // 22
				sprintf: [channel]                                                                     // 23
			}, user.language)                                                                       //
		});                                                                                      //
		return;                                                                                  // 26
	}                                                                                         //
	Meteor.call('unarchiveRoom', room._id);                                                   // 28
	RocketChat.models.Messages.createRoomUnarchivedByRoomIdAndUser(room._id, Meteor.user());  // 29
	RocketChat.Notifications.notifyUser(Meteor.userId(), 'message', {                         // 30
		_id: Random.id(),                                                                        // 31
		rid: item.rid,                                                                           // 32
		ts: new Date(),                                                                          // 33
		msg: TAPi18n.__('Channel_Unarchived', {                                                  // 34
			postProcess: 'sprintf',                                                                 // 35
			sprintf: [channel]                                                                      // 36
		}, user.language)                                                                        //
	});                                                                                       //
	return Unarchive;                                                                         // 39
}                                                                                          //
                                                                                           //
RocketChat.slashCommands.add('unarchive', Unarchive);                                      // 42
/////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:slashcommands-unarchive'] = {};

})();

//# sourceMappingURL=rocketchat_slashcommands-unarchive.js.map
