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

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/rocketchat_slashcommands-create/server.js                //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
function Create(command, params, item) {                             // 1
	var channel, room, user;                                            // 2
	if (command !== 'create' || !Match.test(params, String)) {          // 3
		return;                                                            // 4
	}                                                                   //
	channel = params.trim();                                            // 6
	if (channel === '') {                                               // 7
		return;                                                            // 8
	}                                                                   //
                                                                     //
	user = Meteor.users.findOne(Meteor.userId());                       // 11
	room = RocketChat.models.Rooms.findOneByName(channel);              // 12
	if (room != null) {                                                 // 13
		RocketChat.Notifications.notifyUser(Meteor.userId(), 'message', {  // 14
			_id: Random.id(),                                                 // 15
			rid: item.rid,                                                    // 16
			ts: new Date(),                                                   // 17
			msg: TAPi18n.__('Channel_already_exist', {                        // 18
				postProcess: 'sprintf',                                          // 19
				sprintf: [channel]                                               // 20
			}, user.language)                                                 //
		});                                                                //
		return;                                                            // 23
	}                                                                   //
	Meteor.call('createChannel', channel, []);                          // 25
}                                                                    //
                                                                     //
RocketChat.slashCommands.add('create', Create);                      // 28
///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:slashcommands-create'] = {};

})();

//# sourceMappingURL=rocketchat_slashcommands-create.js.map
