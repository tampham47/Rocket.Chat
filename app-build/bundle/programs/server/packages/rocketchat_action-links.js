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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// packages/rocketchat_action-links/loadStylesheets.js                                                         //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
RocketChat.theme.addPackageAsset(function () {                                                                 // 1
	return Assets.getText('client/stylesheets/actionLinks.less');                                                 // 2
});                                                                                                            //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// packages/rocketchat_action-links/server/registerActionLinkFuncts.js                                         //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
//Action Links namespace creation.                                                                             //
                                                                                                               //
RocketChat.actionLinks = {                                                                                     // 3
	register: function (name, funct) {                                                                            // 4
		RocketChat.actionLinks[name] = funct;                                                                        // 5
	}                                                                                                             //
};                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// packages/rocketchat_action-links/server/actionLinkHandler.js                                                //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
//Action Links Handler. This method will be called off the client.                                             //
                                                                                                               //
Meteor.methods({                                                                                               // 3
	actionLinkHandler: function (name, messageId) {                                                               // 4
		if (!Meteor.userId()) {                                                                                      // 5
			throw new Meteor.Error('error-invalid-user', 'Invalid user', { method: 'actionLinkHandler' });              // 6
		}                                                                                                            //
                                                                                                               //
		var message = RocketChat.models.Messages.findOne({ _id: messageId });                                        // 9
		if (!message) {                                                                                              // 10
			throw new Meteor.Error('error-invalid-message', 'Invalid message', { method: 'actionLinkHandler' });        // 11
		}                                                                                                            //
                                                                                                               //
		var actionLink = message.actionLinks[name];                                                                  // 14
		if (!message.actionLinks || !actionLink || !RocketChat.actionLinks || !RocketChat.actionLinks[actionLink.method_id]) {
			throw new Meteor.Error('error-invalid-actionlink', 'Invalid action link', { method: 'actionLinkHandler' });
		}                                                                                                            //
                                                                                                               //
		var room = RocketChat.models.Rooms.findOne({ _id: message.rid });                                            // 19
		if (Array.isArray(room.usernames) && room.usernames.indexOf(Meteor.user().username) === -1) {                // 20
			throw new Meteor.Error('error-not-allowed', 'Not allowed', { method: 'actionLinkHandler' });                // 21
		}                                                                                                            //
                                                                                                               //
		RocketChat.actionLinks[actionLink.method_id](message, actionLink.params);                                    // 24
	}                                                                                                             //
});                                                                                                            //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:action-links'] = {};

})();

//# sourceMappingURL=rocketchat_action-links.js.map
