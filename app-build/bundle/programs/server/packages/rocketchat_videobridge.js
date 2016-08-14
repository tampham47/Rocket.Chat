(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var ECMAScript = Package.ecmascript.ECMAScript;
var _ = Package.underscore._;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var babelHelpers = Package['babel-runtime'].babelHelpers;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var Promise = Package.promise.Promise;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/rocketchat_videobridge/server/settings.js                                                            //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
Meteor.startup(function () {                                                                                     // 1
	RocketChat.settings.addGroup('Video Conference', function () {                                                  // 2
		this.add('Jitsi_Enabled', false, {                                                                             // 3
			type: 'boolean',                                                                                              // 4
			i18nLabel: 'Enabled',                                                                                         // 5
			alert: 'This Feature is currently in beta! Please report bugs to github.com/RocketChat/Rocket.Chat/issues',   // 6
			'public': true                                                                                                // 7
		});                                                                                                            //
                                                                                                                 //
		this.add('Jitsi_Domain', 'meet.jit.si', {                                                                      // 10
			type: 'string',                                                                                               // 11
			enableQuery: {                                                                                                // 12
				_id: 'Jitsi_Enabled',                                                                                        // 13
				value: true                                                                                                  // 14
			},                                                                                                            //
			i18nLabel: 'Domain',                                                                                          // 16
			'public': true                                                                                                // 17
		});                                                                                                            //
                                                                                                                 //
		this.add('Jitsi_SSL', true, {                                                                                  // 20
			type: 'boolean',                                                                                              // 21
			enableQuery: {                                                                                                // 22
				_id: 'Jitsi_Enabled',                                                                                        // 23
				value: true                                                                                                  // 24
			},                                                                                                            //
			i18nLabel: 'SSL',                                                                                             // 26
			'public': true                                                                                                // 27
		});                                                                                                            //
                                                                                                                 //
		this.add('Jitsi_Enable_Channels', false, {                                                                     // 30
			type: 'boolean',                                                                                              // 31
			enableQuery: {                                                                                                // 32
				_id: 'Jitsi_Enabled',                                                                                        // 33
				value: true                                                                                                  // 34
			},                                                                                                            //
			i18nLabel: 'Jitsi_Enable_Channels',                                                                           // 36
			'public': true                                                                                                // 37
		});                                                                                                            //
                                                                                                                 //
		this.add('Jitsi_Chrome_Extension', 'nocfbnnmjnndkbipkabodnheejiegccf', {                                       // 40
			type: 'string',                                                                                               // 41
			enableQuery: {                                                                                                // 42
				_id: 'Jitsi_Enabled',                                                                                        // 43
				value: true                                                                                                  // 44
			},                                                                                                            //
			i18nLabel: 'Jitsi_Chrome_Extension',                                                                          // 46
			'public': true                                                                                                // 47
		});                                                                                                            //
	});                                                                                                             //
});                                                                                                              //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/rocketchat_videobridge/server/models/Rooms.js                                                        //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
/**                                                                                                              //
 * sets jitsiTimeout to indicate a call is in progress                                                           //
 * @param {string} _id - Room id                                                                                 //
 * @parm {number} time - time to set                                                                             //
 */                                                                                                              //
RocketChat.models.Rooms.setJitsiTimeout = function (_id, time) {                                                 // 6
	var query = {                                                                                                   // 7
		_id: _id                                                                                                       // 8
	};                                                                                                              //
                                                                                                                 //
	var update = {                                                                                                  // 11
		$set: {                                                                                                        // 12
			jitsiTimeout: time                                                                                            // 13
		}                                                                                                              //
	};                                                                                                              //
                                                                                                                 //
	return this.update(query, update);                                                                              // 17
};                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/rocketchat_videobridge/server/methods/jitsiSetTimeout.js                                             //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
                                                                                                                 //
Meteor.methods({                                                                                                 // 2
	'jitsi:updateTimeout': function (rid) {                                                                         // 3
		var room = RocketChat.models.Rooms.findOne({ _id: rid });                                                      // 4
		var currentTime = new Date().getTime();                                                                        // 5
                                                                                                                 //
		var jitsiTimeout = new Date(room.jitsiTimeout || currentTime).getTime();                                       // 7
                                                                                                                 //
		if (jitsiTimeout <= currentTime) {                                                                             // 9
			RocketChat.models.Rooms.setJitsiTimeout(rid, new Date(currentTime + 35 * 1000));                              // 10
			RocketChat.models.Messages.createWithTypeRoomIdMessageAndUser('jitsi_call_started', rid, '', Meteor.user(), {
				actionLinks: [{ icon: 'icon-videocam', label: 'Click To Join!', method_id: 'joinJitsiCall', params: '' }]    // 12
			});                                                                                                           //
		} else if ((jitsiTimeout - currentTime) / 1000 <= 15) {                                                        //
			RocketChat.models.Rooms.setJitsiTimeout(rid, new Date(jitsiTimeout + 25 * 1000));                             // 17
		}                                                                                                              //
	}                                                                                                               //
});                                                                                                              //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/rocketchat_videobridge/server/actionLink.js                                                          //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
RocketChat.actionLinks.register('joinJitsiCall', function () /*message, params*/{});                             // 1
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:videobridge'] = {};

})();

//# sourceMappingURL=rocketchat_videobridge.js.map
