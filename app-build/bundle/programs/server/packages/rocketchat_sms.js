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

//////////////////////////////////////////////////////////////////////////////////////
//                                                                                  //
// packages/rocketchat_sms/settings.js                                              //
//                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////
                                                                                    //
Meteor.startup(function () {                                                        // 1
	RocketChat.settings.addGroup('SMS', function () {                                  // 2
		this.add('SMS_Enabled', false, {                                                  // 3
			type: 'boolean',                                                                 // 4
			i18nLabel: 'Enabled'                                                             // 5
		});                                                                               //
                                                                                    //
		this.add('SMS_Service', 'twilio', {                                               // 8
			type: 'select',                                                                  // 9
			values: [{                                                                       // 10
				key: 'twilio',                                                                  // 11
				i18nLabel: 'Twilio'                                                             // 12
			}],                                                                              //
			i18nLabel: 'Service'                                                             // 14
		});                                                                               //
                                                                                    //
		this.section('Twilio', function () {                                              // 17
			this.add('SMS_Twilio_Account_SID', '', {                                         // 18
				type: 'string',                                                                 // 19
				enableQuery: {                                                                  // 20
					_id: 'SMS_Service',                                                            // 21
					value: 'twilio'                                                                // 22
				},                                                                              //
				i18nLabel: 'Account_SID'                                                        // 24
			});                                                                              //
			this.add('SMS_Twilio_authToken', '', {                                           // 26
				type: 'string',                                                                 // 27
				enableQuery: {                                                                  // 28
					_id: 'SMS_Service',                                                            // 29
					value: 'twilio'                                                                // 30
				},                                                                              //
				i18nLabel: 'Auth_Token'                                                         // 32
			});                                                                              //
		});                                                                               //
	});                                                                                //
});                                                                                 //
//////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////
//                                                                                  //
// packages/rocketchat_sms/SMS.js                                                   //
//                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////
                                                                                    //
/* globals RocketChat */                                                            //
RocketChat.SMS = {                                                                  // 2
	enabled: false,                                                                    // 3
	services: {},                                                                      // 4
	accountSid: null,                                                                  // 5
	authToken: null,                                                                   // 6
	fromNumber: null,                                                                  // 7
                                                                                    //
	registerService: function (name, service) {                                        // 9
		this.services[name] = service;                                                    // 10
	},                                                                                 //
                                                                                    //
	getService: function (name) {                                                      // 13
		if (!this.services[name]) {                                                       // 14
			throw new Meteor.Error('error-sms-service-not-configured');                      // 15
		}                                                                                 //
		return new this.services[name](this.accountSid, this.authToken, this.fromNumber);
	}                                                                                  //
};                                                                                  //
                                                                                    //
RocketChat.settings.get('SMS_Enabled', function (key, value) {                      // 21
	RocketChat.SMS.enabled = value;                                                    // 22
});                                                                                 //
//////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////
//                                                                                  //
// packages/rocketchat_sms/services/twilio.js                                       //
//                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////
                                                                                    //
/* globals RocketChat */                                                            //
                                                                                    //
var Twilio = (function () {                                                         //
	function Twilio() {                                                                // 3
		babelHelpers.classCallCheck(this, Twilio);                                        //
                                                                                    //
		this.accountSid = RocketChat.settings.get('SMS_Twilio_Account_SID');              // 4
		this.authToken = RocketChat.settings.get('SMS_Twilio_authToken');                 // 5
	}                                                                                  //
                                                                                    //
	Twilio.prototype.parse = (function () {                                            // 2
		function parse(data) {                                                            // 7
			return {                                                                         // 8
				from: data.From,                                                                // 9
				to: data.To,                                                                    // 10
				body: data.Body,                                                                // 11
                                                                                    //
				extra: {                                                                        // 13
					toCountry: data.ToCountry,                                                     // 14
					toState: data.ToState,                                                         // 15
					toCity: data.ToCity,                                                           // 16
					toZip: data.ToZip,                                                             // 17
					fromCountry: data.FromCountry,                                                 // 18
					fromState: data.FromState,                                                     // 19
					fromCity: data.FromCity,                                                       // 20
					fromZip: data.FromZip                                                          // 21
				}                                                                               //
			};                                                                               //
		}                                                                                 //
                                                                                    //
		return parse;                                                                     //
	})();                                                                              //
                                                                                    //
	Twilio.prototype.send = (function () {                                             // 2
		function send(fromNumber, toNumber, message) {                                    // 25
			var client = Npm.require('twilio')(this.accountSid, this.authToken);             // 26
                                                                                    //
			client.messages.create({                                                         // 28
				to: toNumber,                                                                   // 29
				from: fromNumber,                                                               // 30
				body: message                                                                   // 31
			});                                                                              //
		}                                                                                 //
                                                                                    //
		return send;                                                                      //
	})();                                                                              //
                                                                                    //
	Twilio.prototype.response = (function () {                                         // 2
		function response() /* message */{                                                // 34
			return {                                                                         // 35
				headers: {                                                                      // 36
					'Content-Type': 'text/xml'                                                     // 37
				},                                                                              //
				body: '<Response></Response>'                                                   // 39
			};                                                                               //
		}                                                                                 //
                                                                                    //
		return response;                                                                  //
	})();                                                                              //
                                                                                    //
	Twilio.prototype.error = (function () {                                            // 2
		function error(_error) {                                                          // 42
			var message = '';                                                                // 43
			if (_error.reason) {                                                             // 44
				message = '<Message>' + _error.reason + '</Message>';                           // 45
			}                                                                                //
			return {                                                                         // 47
				headers: {                                                                      // 48
					'Content-Type': 'text/xml'                                                     // 49
				},                                                                              //
				body: '<Response>' + message + '</Response>'                                    // 51
			};                                                                               //
		}                                                                                 //
                                                                                    //
		return error;                                                                     //
	})();                                                                              //
                                                                                    //
	return Twilio;                                                                     //
})();                                                                               //
                                                                                    //
RocketChat.SMS.registerService('twilio', Twilio);                                   // 56
//////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:sms'] = {};

})();

//# sourceMappingURL=rocketchat_sms.js.map
