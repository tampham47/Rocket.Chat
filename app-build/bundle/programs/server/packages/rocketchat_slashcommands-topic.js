(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var ECMAScript = Package.ecmascript.ECMAScript;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;
var babelHelpers = Package['babel-runtime'].babelHelpers;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var Promise = Package.promise.Promise;

(function(){

/////////////////////////////////////////////////////////////////////////////////////
//                                                                                 //
// packages/rocketchat_slashcommands-topic/topic.js                                //
//                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////
                                                                                   //
/*                                                                                 //
* Join is a named function that will replace /topic commands                       //
* @param {Object} message - The message object                                     //
*/                                                                                 //
                                                                                   //
function Topic(command, params, item) {                                            // 6
	if (command === 'topic') {                                                        // 7
		if (Meteor.isClient && RocketChat.authz.hasAtLeastOnePermission('edit-room', item.rid) || Meteor.isServer && RocketChat.authz.hasPermission(Meteor.userId(), 'edit-room', item.rid)) {
			Meteor.call('saveRoomSettings', item.rid, 'roomTopic', params, function (err) {
				if (err) {                                                                     // 10
					if (Meteor.isClient) {                                                        // 11
						return handleError(err);                                                     // 12
					} else {                                                                      //
						throw err;                                                                   // 14
					}                                                                             //
				}                                                                              //
                                                                                   //
				if (Meteor.isClient) {                                                         // 18
					RocketChat.callbacks.run('roomTopicChanged', ChatRoom.findOne(item.rid));     // 19
				}                                                                              //
			});                                                                             //
		}                                                                                //
	}                                                                                 //
}                                                                                  //
                                                                                   //
RocketChat.slashCommands.add('topic', Topic, {                                     // 26
	description: TAPi18n.__('Slash_Topic_Description'),                               // 27
	params: TAPi18n.__('Slash_Topic_Params')                                          // 28
});                                                                                //
/////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:slashcommands-topic'] = {};

})();

//# sourceMappingURL=rocketchat_slashcommands-topic.js.map
