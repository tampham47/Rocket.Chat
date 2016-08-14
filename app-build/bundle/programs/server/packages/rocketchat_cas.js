(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var Logger = Package['rocketchat:logger'].Logger;
var ServiceConfiguration = Package['service-configuration'].ServiceConfiguration;
var RoutePolicy = Package.routepolicy.RoutePolicy;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;
var Accounts = Package['accounts-base'].Accounts;
var AccountsServer = Package['accounts-base'].AccountsServer;
var _ = Package.underscore._;
var ECMAScript = Package.ecmascript.ECMAScript;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;
var babelHelpers = Package['babel-runtime'].babelHelpers;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var logger;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/rocketchat_cas/cas_rocketchat.js                                                                    //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
/* globals logger:true */                                                                                       //
                                                                                                                //
logger = new Logger('CAS', {});                                                                                 // 3
                                                                                                                //
Meteor.startup(function () {                                                                                    // 5
	RocketChat.settings.addGroup('CAS', function () {                                                              // 6
		this.add('CAS_enabled', false, { type: 'boolean', group: 'CAS', 'public': true });                            // 7
		this.add('CAS_base_url', '', { type: 'string', group: 'CAS', 'public': true });                               // 8
		this.add('CAS_login_url', '', { type: 'string', group: 'CAS', 'public': true });                              // 9
		this.add('CAS_version', '1.0', { type: 'select', values: [{ key: '1.0', i18nLabel: '1.0' }], group: 'CAS' });
                                                                                                                //
		this.section('CAS Login Layout', function () {                                                                // 12
			this.add('CAS_popup_width', '810', { type: 'string', group: 'CAS', 'public': true });                        // 13
			this.add('CAS_popup_height', '610', { type: 'string', group: 'CAS', 'public': true });                       // 14
			this.add('CAS_button_label_text', 'CAS', { type: 'string', group: 'CAS' });                                  // 15
			this.add('CAS_button_label_color', '#FFFFFF', { type: 'color', group: 'CAS' });                              // 16
			this.add('CAS_button_color', '#13679A', { type: 'color', group: 'CAS' });                                    // 17
			this.add('CAS_autoclose', true, { type: 'boolean', group: 'CAS' });                                          // 18
		});                                                                                                           //
	});                                                                                                            //
});                                                                                                             //
                                                                                                                //
var timer;                                                                                                      // 23
                                                                                                                //
function updateServices() /*record*/{                                                                           // 25
	if (typeof timer !== 'undefined') {                                                                            // 26
		Meteor.clearTimeout(timer);                                                                                   // 27
	}                                                                                                              //
                                                                                                                //
	timer = Meteor.setTimeout(function () {                                                                        // 30
		var data = {                                                                                                  // 31
			// These will pe passed to 'node-cas' as options                                                             //
			enabled: RocketChat.settings.get('CAS_enabled'),                                                             // 33
			base_url: RocketChat.settings.get('CAS_base_url'),                                                           // 34
			login_url: RocketChat.settings.get('CAS_login_url'),                                                         // 35
			// Rocketchat Visuals                                                                                        //
			buttonLabelText: RocketChat.settings.get('CAS_button_label_text'),                                           // 37
			buttonLabelColor: RocketChat.settings.get('CAS_button_label_color'),                                         // 38
			buttonColor: RocketChat.settings.get('CAS_button_color'),                                                    // 39
			width: RocketChat.settings.get('CAS_popup_width'),                                                           // 40
			height: RocketChat.settings.get('CAS_popup_height'),                                                         // 41
			autoclose: RocketChat.settings.get('CAS_autoclose')                                                          // 42
		};                                                                                                            //
                                                                                                                //
		// Either register or deregister the CAS login service based upon its configuration                           //
		if (data.enabled) {                                                                                           // 46
			logger.info('Enabling CAS login service');                                                                   // 47
			ServiceConfiguration.configurations.upsert({ service: 'cas' }, { $set: data });                              // 48
		} else {                                                                                                      //
			logger.info('Disabling CAS login service');                                                                  // 50
			ServiceConfiguration.configurations.remove({ service: 'cas' });                                              // 51
		}                                                                                                             //
	}, 2000);                                                                                                      //
}                                                                                                               //
                                                                                                                //
function check_record(record) {                                                                                 // 56
	if (/^CAS_.+/.test(record._id)) {                                                                              // 57
		updateServices(record);                                                                                       // 58
	}                                                                                                              //
}                                                                                                               //
                                                                                                                //
RocketChat.models.Settings.find().observe({                                                                     // 62
	added: check_record,                                                                                           // 63
	changed: check_record,                                                                                         // 64
	removed: check_record                                                                                          // 65
});                                                                                                             //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/rocketchat_cas/cas_server.js                                                                        //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
/* globals RoutePolicy, logger */                                                                               //
/* jshint newcap: false */                                                                                      //
                                                                                                                //
var fiber = Npm.require('fibers');                                                                              // 4
var url = Npm.require('url');                                                                                   // 5
var CAS = Npm.require('cas');                                                                                   // 6
                                                                                                                //
var _casCredentialTokens = {};                                                                                  // 8
                                                                                                                //
RoutePolicy.declare('/_cas/', 'network');                                                                       // 10
                                                                                                                //
var closePopup = function (res) {                                                                               // 12
	res.writeHead(200, { 'Content-Type': 'text/html' });                                                           // 13
	var content = '<html><head><script>window.close()</script></head></html>';                                     // 14
	res.end(content, 'utf-8');                                                                                     // 15
};                                                                                                              //
                                                                                                                //
var casTicket = function (req, token, callback) {                                                               // 18
                                                                                                                //
	// get configuration                                                                                           //
	if (!RocketChat.settings.get('CAS_enabled')) {                                                                 // 21
		logger.error('Got ticket validation request, but CAS is not enabled');                                        // 22
		callback();                                                                                                   // 23
	}                                                                                                              //
                                                                                                                //
	// get ticket and validate.                                                                                    //
	var parsedUrl = url.parse(req.url, true);                                                                      // 27
	var ticketId = parsedUrl.query.ticket;                                                                         // 28
	var baseUrl = RocketChat.settings.get('CAS_base_url');                                                         // 29
	logger.debug('Using CAS_base_url: ' + baseUrl);                                                                // 30
                                                                                                                //
	var cas = new CAS({                                                                                            // 32
		base_url: baseUrl,                                                                                            // 33
		service: Meteor.absoluteUrl() + '_cas/' + token                                                               // 34
	});                                                                                                            //
                                                                                                                //
	cas.validate(ticketId, function (err, status, username) {                                                      // 37
		if (err) {                                                                                                    // 38
			logger.error('error when trying to validate ' + err.message);                                                // 39
		} else if (status) {                                                                                          //
			logger.info('Validated user: ' + username);                                                                  // 41
			_casCredentialTokens[token] = { id: username };                                                              // 42
		} else {                                                                                                      //
			logger.error('Unable to validate ticket: ' + ticketId);                                                      // 44
		}                                                                                                             //
                                                                                                                //
		callback();                                                                                                   // 47
	});                                                                                                            //
                                                                                                                //
	return;                                                                                                        // 50
};                                                                                                              //
                                                                                                                //
var middleware = function (req, res, next) {                                                                    // 53
	// Make sure to catch any exceptions because otherwise we'd crash                                              //
	// the runner                                                                                                  //
	try {                                                                                                          // 56
		var barePath = req.url.substring(0, req.url.indexOf('?'));                                                    // 57
		var splitPath = barePath.split('/');                                                                          // 58
                                                                                                                //
		// Any non-cas request will continue down the default                                                         //
		// middlewares.                                                                                               //
		if (splitPath[1] !== '_cas') {                                                                                // 62
			next();                                                                                                      // 63
			return;                                                                                                      // 64
		}                                                                                                             //
                                                                                                                //
		// get auth token                                                                                             //
		var credentialToken = splitPath[2];                                                                           // 68
		if (!credentialToken) {                                                                                       // 69
			closePopup(res);                                                                                             // 70
			return;                                                                                                      // 71
		}                                                                                                             //
                                                                                                                //
		// validate ticket                                                                                            //
		casTicket(req, credentialToken, function () {                                                                 // 75
			closePopup(res);                                                                                             // 76
		});                                                                                                           //
	} catch (err) {                                                                                                //
		logger.error('Unexpected error : ' + err.message);                                                            // 80
		closePopup(res);                                                                                              // 81
	}                                                                                                              //
};                                                                                                              //
                                                                                                                //
// Listen to incoming OAuth http requests                                                                       //
WebApp.connectHandlers.use(function (req, res, next) {                                                          // 86
	// Need to create a fiber since we're using synchronous http calls and nothing                                 //
	// else is wrapping this in a fiber automatically                                                              //
	fiber(function () {                                                                                            // 89
		middleware(req, res, next);                                                                                   // 90
	}).run();                                                                                                      //
});                                                                                                             //
                                                                                                                //
var _hasCredential = function (credentialToken) {                                                               // 94
	return _.has(_casCredentialTokens, credentialToken);                                                           // 95
};                                                                                                              //
                                                                                                                //
/*                                                                                                              //
 * Retrieve token and delete it to avoid replaying it.                                                          //
 */                                                                                                             //
var _retrieveCredential = function (credentialToken) {                                                          // 101
	var result = _casCredentialTokens[credentialToken];                                                            // 102
	delete _casCredentialTokens[credentialToken];                                                                  // 103
	return result;                                                                                                 // 104
};                                                                                                              //
                                                                                                                //
/*                                                                                                              //
 * Register a server-side login handle.                                                                         //
 * It is call after Accounts.callLoginMethod() is call from client.                                             //
 *                                                                                                              //
 */                                                                                                             //
Accounts.registerLoginHandler(function (options) {                                                              // 112
                                                                                                                //
	if (!options.cas) {                                                                                            // 114
		return undefined;                                                                                             // 115
	}                                                                                                              //
                                                                                                                //
	if (!_hasCredential(options.cas.credentialToken)) {                                                            // 118
		throw new Meteor.Error(Accounts.LoginCancelledError.numericError, 'no matching login attempt found');         // 119
	}                                                                                                              //
                                                                                                                //
	var result = _retrieveCredential(options.cas.credentialToken);                                                 // 123
	options = { profile: { name: result.id } };                                                                    // 124
                                                                                                                //
	// Search existing user by its external service id                                                             //
	logger.debug('Looking up user with username: ' + result.id);                                                   // 127
	var user = Meteor.users.findOne({ 'services.cas.external_id': result.id });                                    // 128
                                                                                                                //
	if (user) {                                                                                                    // 130
		logger.debug('Using existing user for \'' + result.id + '\' with id: ' + user._id);                           // 131
	} else {                                                                                                       //
                                                                                                                //
		// Define new user                                                                                            //
		var newUser = {                                                                                               // 135
			username: result.id,                                                                                         // 136
			active: true,                                                                                                // 137
			globalRoles: ['user'],                                                                                       // 138
			services: {                                                                                                  // 139
				cas: {                                                                                                      // 140
					external_id: result.id                                                                                     // 141
				}                                                                                                           //
			}                                                                                                            //
		};                                                                                                            //
                                                                                                                //
		// Create the user                                                                                            //
		logger.debug('User \'' + result.id + '\'does not exist yet, creating it');                                    // 147
		var userId = Accounts.insertUserDoc({}, newUser);                                                             // 148
                                                                                                                //
		// Fetch and use it                                                                                           //
		user = Meteor.users.findOne(userId);                                                                          // 151
		logger.debug('Created new user for \'' + result.id + '\' with id: ' + user._id);                              // 152
                                                                                                                //
		logger.debug('Joining user to default channels');                                                             // 154
		Meteor.runAsUser(user._id, function () {                                                                      // 155
			Meteor.call('joinDefaultChannels');                                                                          // 156
		});                                                                                                           //
	}                                                                                                              //
                                                                                                                //
	return { userId: user._id };                                                                                   // 161
});                                                                                                             //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:cas'] = {};

})();

//# sourceMappingURL=rocketchat_cas.js.map
