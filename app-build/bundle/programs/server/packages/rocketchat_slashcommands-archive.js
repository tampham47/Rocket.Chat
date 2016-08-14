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

///////////////////////////////////////////////////////////////////////////////////////////
//                                                                                       //
// packages/rocketchat_slashcommands-archive/messages.js                                 //
//                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////
                                                                                         //
RocketChat.models.Messages.createRoomArchivedByRoomIdAndUser = function (roomId, user) {
	return this.createWithTypeRoomIdMessageAndUser('room-archived', roomId, '', user);      // 2
};                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////
//                                                                                       //
// packages/rocketchat_slashcommands-archive/server.js                                   //
//                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////
                                                                                         //
function Archive(command, params, item) {                                                // 1
	var channel, room, user;                                                                // 2
	if (command !== 'archive' || !Match.test(params, String)) {                             // 3
		return;                                                                                // 4
	}                                                                                       //
	channel = params.trim();                                                                // 6
	if (channel === '') {                                                                   // 7
		room = RocketChat.models.Rooms.findOneById(item.rid);                                  // 8
		channel = room.name;                                                                   // 9
	} else {                                                                                //
		channel = channel.replace('#', '');                                                    // 11
		room = RocketChat.models.Rooms.findOneByName(channel);                                 // 12
	}                                                                                       //
	user = Meteor.users.findOne(Meteor.userId());                                           // 14
                                                                                         //
	if (room.archived) {                                                                    // 16
		RocketChat.Notifications.notifyUser(Meteor.userId(), 'message', {                      // 17
			_id: Random.id(),                                                                     // 18
			rid: item.rid,                                                                        // 19
			ts: new Date(),                                                                       // 20
			msg: TAPi18n.__('Duplicate_archived_channel_name', {                                  // 21
				postProcess: 'sprintf',                                                              // 22
				sprintf: [channel]                                                                   // 23
			}, user.language)                                                                     //
		});                                                                                    //
		return;                                                                                // 26
	}                                                                                       //
	Meteor.call('archiveRoom', room._id);                                                   // 28
                                                                                         //
	RocketChat.models.Messages.createRoomArchivedByRoomIdAndUser(room._id, Meteor.user());  // 30
	RocketChat.Notifications.notifyUser(Meteor.userId(), 'message', {                       // 31
		_id: Random.id(),                                                                      // 32
		rid: item.rid,                                                                         // 33
		ts: new Date(),                                                                        // 34
		msg: TAPi18n.__('Channel_Archived', {                                                  // 35
			postProcess: 'sprintf',                                                               // 36
			sprintf: [channel]                                                                    // 37
		}, user.language)                                                                      //
	});                                                                                     //
                                                                                         //
	return Archive;                                                                         // 41
}                                                                                        //
                                                                                         //
RocketChat.slashCommands.add('archive', Archive);                                        // 44
///////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:slashcommands-archive'] = {};

})();

//# sourceMappingURL=rocketchat_slashcommands-archive.js.map
