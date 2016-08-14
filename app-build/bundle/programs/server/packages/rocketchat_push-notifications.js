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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_push-notifications/server/methods/saveNotificationSettings.js                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	saveNotificationSettings: function (rid, field, value) {                                                              // 2
		if (!Meteor.userId()) {                                                                                              // 3
			throw new Meteor.Error('error-invalid-user', 'Invalid user', { method: 'saveNotificationSettings' });               // 4
		}                                                                                                                    //
                                                                                                                       //
		check(rid, String);                                                                                                  // 7
		check(field, String);                                                                                                // 8
		check(value, String);                                                                                                // 9
                                                                                                                       //
		if (['desktopNotifications', 'mobilePushNotifications', 'emailNotifications'].indexOf(field) === -1) {               // 11
			throw new Meteor.Error('error-invalid-settings', 'Invalid settings field', { method: 'saveNotificationSettings' });
		}                                                                                                                    //
                                                                                                                       //
		if (['all', 'mentions', 'nothing', 'default'].indexOf(value) === -1) {                                               // 15
			throw new Meteor.Error('error-invalid-settings', 'Invalid settings value', { method: 'saveNotificationSettings' });
		}                                                                                                                    //
                                                                                                                       //
		var subscription = RocketChat.models.Subscriptions.findOneByRoomIdAndUserId(rid, Meteor.userId());                   // 19
		if (!subscription) {                                                                                                 // 20
			throw new Meteor.Error('error-invalid-subscription', 'Invalid subscription', { method: 'saveNotificationSettings' });
		}                                                                                                                    //
                                                                                                                       //
		if (field === 'desktopNotifications') {                                                                              // 24
			RocketChat.models.Subscriptions.updateDesktopNotificationsById(subscription._id, value);                            // 25
		} else if (field === 'mobilePushNotifications') {                                                                    //
			RocketChat.models.Subscriptions.updateMobilePushNotificationsById(subscription._id, value);                         // 27
		} else if (field === 'emailNotifications') {                                                                         //
			RocketChat.models.Subscriptions.updateEmailNotificationsById(subscription._id, value);                              // 29
		}                                                                                                                    //
                                                                                                                       //
		return true;                                                                                                         // 32
	},                                                                                                                    //
                                                                                                                       //
	saveDesktopNotificationDuration: function (rid, value) {                                                              // 35
		var subscription = RocketChat.models.Subscriptions.findOneByRoomIdAndUserId(rid, Meteor.userId());                   // 36
		if (!subscription) {                                                                                                 // 37
			throw new Meteor.Error('error-invalid-subscription', 'Invalid subscription', { method: 'saveDesktopNotificationDuration' });
		}                                                                                                                    //
		RocketChat.models.Subscriptions.updateDesktopNotificationDurationById(subscription._id, value);                      // 40
		return true;                                                                                                         // 41
	}                                                                                                                     //
});                                                                                                                    //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_push-notifications/server/models/Subscriptions.js                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.models.Subscriptions.updateDesktopNotificationsById = function (_id, desktopNotifications) {                // 1
	var query = {                                                                                                         // 2
		_id: _id                                                                                                             // 3
	};                                                                                                                    //
                                                                                                                       //
	var update = {                                                                                                        // 6
		$set: {                                                                                                              // 7
			desktopNotifications: desktopNotifications                                                                          // 8
		}                                                                                                                    //
	};                                                                                                                    //
                                                                                                                       //
	return this.update(query, update);                                                                                    // 12
};                                                                                                                     //
                                                                                                                       //
RocketChat.models.Subscriptions.updateDesktopNotificationDurationById = function (_id, value) {                        // 15
	var query = {                                                                                                         // 16
		_id: _id                                                                                                             // 17
	};                                                                                                                    //
                                                                                                                       //
	var update = {                                                                                                        // 20
		$set: {                                                                                                              // 21
			desktopNotificationDuration: value - 0                                                                              // 22
		}                                                                                                                    //
	};                                                                                                                    //
                                                                                                                       //
	return this.update(query, update);                                                                                    // 26
};                                                                                                                     //
                                                                                                                       //
RocketChat.models.Subscriptions.updateMobilePushNotificationsById = function (_id, mobilePushNotifications) {          // 29
	var query = {                                                                                                         // 30
		_id: _id                                                                                                             // 31
	};                                                                                                                    //
                                                                                                                       //
	var update = {                                                                                                        // 34
		$set: {                                                                                                              // 35
			mobilePushNotifications: mobilePushNotifications                                                                    // 36
		}                                                                                                                    //
	};                                                                                                                    //
                                                                                                                       //
	return this.update(query, update);                                                                                    // 40
};                                                                                                                     //
                                                                                                                       //
RocketChat.models.Subscriptions.updateEmailNotificationsById = function (_id, emailNotifications) {                    // 43
	var query = {                                                                                                         // 44
		_id: _id                                                                                                             // 45
	};                                                                                                                    //
                                                                                                                       //
	var update = {                                                                                                        // 48
		$set: {                                                                                                              // 49
			emailNotifications: emailNotifications                                                                              // 50
		}                                                                                                                    //
	};                                                                                                                    //
                                                                                                                       //
	return this.update(query, update);                                                                                    // 54
};                                                                                                                     //
                                                                                                                       //
RocketChat.models.Subscriptions.findAlwaysNotifyDesktopUsersByRoomId = function (roomId) {                             // 57
	var query = {                                                                                                         // 58
		rid: roomId,                                                                                                         // 59
		desktopNotifications: 'all'                                                                                          // 60
	};                                                                                                                    //
                                                                                                                       //
	return this.find(query);                                                                                              // 63
};                                                                                                                     //
                                                                                                                       //
RocketChat.models.Subscriptions.findDontNotifyDesktopUsersByRoomId = function (roomId) {                               // 66
	var query = {                                                                                                         // 67
		rid: roomId,                                                                                                         // 68
		desktopNotifications: 'nothing'                                                                                      // 69
	};                                                                                                                    //
                                                                                                                       //
	return this.find(query);                                                                                              // 72
};                                                                                                                     //
                                                                                                                       //
RocketChat.models.Subscriptions.findAlwaysNotifyMobileUsersByRoomId = function (roomId) {                              // 75
	var query = {                                                                                                         // 76
		rid: roomId,                                                                                                         // 77
		mobilePushNotifications: 'all'                                                                                       // 78
	};                                                                                                                    //
                                                                                                                       //
	return this.find(query);                                                                                              // 81
};                                                                                                                     //
                                                                                                                       //
RocketChat.models.Subscriptions.findDontNotifyMobileUsersByRoomId = function (roomId) {                                // 84
	var query = {                                                                                                         // 85
		rid: roomId,                                                                                                         // 86
		mobilePushNotifications: 'nothing'                                                                                   // 87
	};                                                                                                                    //
                                                                                                                       //
	return this.find(query);                                                                                              // 90
};                                                                                                                     //
                                                                                                                       //
RocketChat.models.Subscriptions.findNotificationPreferencesByRoom = function (roomId) {                                // 93
	var query = {                                                                                                         // 94
		rid: roomId,                                                                                                         // 95
		'u._id': { $exists: true },                                                                                          // 96
		$or: [{ desktopNotifications: { $exists: true } }, { desktopNotificationDuration: { $exists: true } }, { mobilePushNotifications: { $exists: true } }]
	};                                                                                                                    //
                                                                                                                       //
	return this.find(query);                                                                                              // 104
};                                                                                                                     //
                                                                                                                       //
RocketChat.models.Subscriptions.findWithSendEmailByRoomId = function (roomId) {                                        // 107
	var query = {                                                                                                         // 108
		rid: roomId,                                                                                                         // 109
		emailNotifications: {                                                                                                // 110
			$exists: true                                                                                                       // 111
		}                                                                                                                    //
	};                                                                                                                    //
                                                                                                                       //
	return this.find(query, { fields: { emailNotifications: 1, u: 1 } });                                                 // 115
};                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:push-notifications'] = {};

})();

//# sourceMappingURL=rocketchat_push-notifications.js.map
