(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var ECMAScript = Package.ecmascript.ECMAScript;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var babelHelpers = Package['babel-runtime'].babelHelpers;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var Promise = Package.promise.Promise;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/rocketchat_reactions/server/models/Messages.js                                                        //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
RocketChat.models.Messages.setReactions = function (messageId, reactions) {                                       // 1
	return this.update({ _id: messageId }, { $set: { reactions: reactions } });                                      // 2
};                                                                                                                //
                                                                                                                  //
RocketChat.models.Messages.unsetReactions = function (messageId) {                                                // 5
	return this.update({ _id: messageId }, { $unset: { reactions: 1 } });                                            // 6
};                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/rocketchat_reactions/setReaction.js                                                                   //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
/* globals msgStream */                                                                                           //
Meteor.methods({                                                                                                  // 2
	setReaction: function (reaction, messageId) {                                                                    // 3
		if (!Meteor.userId()) {                                                                                         // 4
			throw new Meteor.Error('error-invalid-user', 'Invalid user', { method: 'setReaction' });                       // 5
		}                                                                                                               //
                                                                                                                  //
		var message = RocketChat.models.Messages.findOneById(messageId);                                                // 8
                                                                                                                  //
		var room = Meteor.call('canAccessRoom', message.rid, Meteor.userId());                                          // 10
                                                                                                                  //
		if (!room) {                                                                                                    // 12
			throw new Meteor.Error('error-not-allowed', 'Not allowed', { method: 'setReaction' });                         // 13
		}                                                                                                               //
                                                                                                                  //
		var user = Meteor.user();                                                                                       // 16
                                                                                                                  //
		if (Array.isArray(room.muted) && room.muted.indexOf(user.username) !== -1) {                                    // 18
			RocketChat.Notifications.notifyUser(Meteor.userId(), 'message', {                                              // 19
				_id: Random.id(),                                                                                             // 20
				rid: room._id,                                                                                                // 21
				ts: new Date(),                                                                                               // 22
				msg: TAPi18n.__('You_have_been_muted', {}, user.language)                                                     // 23
			});                                                                                                            //
			return false;                                                                                                  // 25
		} else if (Array.isArray(room.usernames) && room.usernames.indexOf(user.username) === -1) {                     //
			return false;                                                                                                  // 27
		}                                                                                                               //
                                                                                                                  //
		if (message.reactions && message.reactions[reaction] && message.reactions[reaction].usernames.indexOf(user.username) !== -1) {
			message.reactions[reaction].usernames.splice(message.reactions[reaction].usernames.indexOf(user.username), 1);
                                                                                                                  //
			if (message.reactions[reaction].usernames.length === 0) {                                                      // 33
				delete message.reactions[reaction];                                                                           // 34
			}                                                                                                              //
                                                                                                                  //
			if (_.isEmpty(message.reactions)) {                                                                            // 37
				delete message.reactions;                                                                                     // 38
				RocketChat.models.Messages.unsetReactions(messageId);                                                         // 39
			} else {                                                                                                       //
				RocketChat.models.Messages.setReactions(messageId, message.reactions);                                        // 41
			}                                                                                                              //
		} else {                                                                                                        //
			if (!message.reactions) {                                                                                      // 44
				message.reactions = {};                                                                                       // 45
			}                                                                                                              //
			if (!message.reactions[reaction]) {                                                                            // 47
				message.reactions[reaction] = {                                                                               // 48
					usernames: []                                                                                                // 49
				};                                                                                                            //
			}                                                                                                              //
			message.reactions[reaction].usernames.push(user.username);                                                     // 52
                                                                                                                  //
			RocketChat.models.Messages.setReactions(messageId, message.reactions);                                         // 54
		}                                                                                                               //
                                                                                                                  //
		msgStream.emit(message.rid, message);                                                                           // 57
                                                                                                                  //
		return;                                                                                                         // 59
	}                                                                                                                //
});                                                                                                               //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/rocketchat_reactions/loadStylesheets.js                                                               //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
RocketChat.theme.addPackageAsset(function () {                                                                    // 1
	return Assets.getText('client/stylesheets/reaction.less');                                                       // 2
});                                                                                                               //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:reactions'] = {};

})();

//# sourceMappingURL=rocketchat_reactions.js.map
