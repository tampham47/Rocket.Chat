(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var DDPCommon = Package['ddp-common'].DDPCommon;
var ECMAScript = Package.ecmascript.ECMAScript;
var check = Package.check.check;
var Match = Package.check.Match;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var babelHelpers = Package['babel-runtime'].babelHelpers;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var EV, self, Streamer;

(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/rocketchat_streamer/lib/ev.js                                                                            //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
/* globals EV:true */                                                                                                //
/* exported EV */                                                                                                    //
                                                                                                                     //
EV = (function () {                                                                                                  // 4
	function EV() {                                                                                                     // 5
		babelHelpers.classCallCheck(this, EV);                                                                             //
                                                                                                                     //
		this.handlers = {};                                                                                                // 6
	}                                                                                                                   //
                                                                                                                     //
	EV.prototype.emit = (function () {                                                                                  // 4
		function emit(event) {                                                                                             // 9
			var _this = this;                                                                                                 //
                                                                                                                     //
			for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {         //
				args[_key - 1] = arguments[_key];                                                                                // 9
			}                                                                                                                 //
                                                                                                                     //
			if (this.handlers[event]) {                                                                                       // 10
				this.handlers[event].forEach(function (handler) {                                                                // 11
					return handler.apply(_this, args);                                                                              //
				});                                                                                                              //
			}                                                                                                                 //
		}                                                                                                                  //
                                                                                                                     //
		return emit;                                                                                                       //
	})();                                                                                                               //
                                                                                                                     //
	EV.prototype.emitWithScope = (function () {                                                                         // 4
		function emitWithScope(event, scope) {                                                                             // 15
			for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {  //
				args[_key2 - 2] = arguments[_key2];                                                                              // 15
			}                                                                                                                 //
                                                                                                                     //
			if (this.handlers[event]) {                                                                                       // 16
				this.handlers[event].forEach(function (handler) {                                                                // 17
					return handler.apply(scope, args);                                                                              //
				});                                                                                                              //
			}                                                                                                                 //
		}                                                                                                                  //
                                                                                                                     //
		return emitWithScope;                                                                                              //
	})();                                                                                                               //
                                                                                                                     //
	EV.prototype.on = (function () {                                                                                    // 4
		function on(event, callback) {                                                                                     // 21
			if (!this.handlers[event]) {                                                                                      // 22
				this.handlers[event] = [];                                                                                       // 23
			}                                                                                                                 //
			this.handlers[event].push(callback);                                                                              // 25
		}                                                                                                                  //
                                                                                                                     //
		return on;                                                                                                         //
	})();                                                                                                               //
                                                                                                                     //
	EV.prototype.once = (function () {                                                                                  // 4
		function once(event, callback) {                                                                                   // 28
			self = this;                                                                                                      // 29
			self.on(event, (function () {                                                                                     // 30
				function onetimeCallback() {                                                                                     // 30
					callback.apply(this, arguments);                                                                                // 31
					self.removeListener(event, onetimeCallback);                                                                    // 32
				}                                                                                                                //
                                                                                                                     //
				return onetimeCallback;                                                                                          //
			})());                                                                                                            //
		}                                                                                                                  //
                                                                                                                     //
		return once;                                                                                                       //
	})();                                                                                                               //
                                                                                                                     //
	EV.prototype.removeListener = (function () {                                                                        // 4
		function removeListener(event, callback) {                                                                         // 36
			if (this.handlers[event]) {                                                                                       // 37
				var index = this.handlers[event].indexOf(callback);                                                              // 38
				if (index > -1) {                                                                                                // 39
					this.handlers[event].splice(index, 1);                                                                          // 40
				}                                                                                                                //
			}                                                                                                                 //
		}                                                                                                                  //
                                                                                                                     //
		return removeListener;                                                                                             //
	})();                                                                                                               //
                                                                                                                     //
	EV.prototype.removeAllListeners = (function () {                                                                    // 4
		function removeAllListeners(event) {                                                                               // 45
			this.handlers[event] = undefined;                                                                                 // 46
		}                                                                                                                  //
                                                                                                                     //
		return removeAllListeners;                                                                                         //
	})();                                                                                                               //
                                                                                                                     //
	return EV;                                                                                                          //
})();                                                                                                                //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/rocketchat_streamer/server/server.js                                                                     //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
/* globals EV */                                                                                                     //
/* eslint new-cap: false */                                                                                          //
                                                                                                                     //
var StreamerCentral = (function (_EV) {                                                                              //
	babelHelpers.inherits(StreamerCentral, _EV);                                                                        //
                                                                                                                     //
	function StreamerCentral() {                                                                                        // 5
		babelHelpers.classCallCheck(this, StreamerCentral);                                                                //
                                                                                                                     //
		_EV.call(this);                                                                                                    // 6
                                                                                                                     //
		this.instances = {};                                                                                               // 8
	}                                                                                                                   //
                                                                                                                     //
	return StreamerCentral;                                                                                             //
})(EV);                                                                                                              //
                                                                                                                     //
Meteor.StreamerCentral = new StreamerCentral();                                                                      // 12
                                                                                                                     //
Meteor.Streamer = (function (_EV2) {                                                                                 // 15
	babelHelpers.inherits(Streamer, _EV2);                                                                              //
                                                                                                                     //
	function Streamer(name) {                                                                                           // 16
		var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];                                //
                                                                                                                     //
		var _ref$retransmit = _ref.retransmit;                                                                             //
		var retransmit = _ref$retransmit === undefined ? true : _ref$retransmit;                                           //
		var _ref$retransmitToSelf = _ref.retransmitToSelf;                                                                 //
		var retransmitToSelf = _ref$retransmitToSelf === undefined ? false : _ref$retransmitToSelf;                        //
		babelHelpers.classCallCheck(this, Streamer);                                                                       //
                                                                                                                     //
		if (Meteor.StreamerCentral.instances[name]) {                                                                      // 17
			console.warn('Streamer instance already exists:', name);                                                          // 18
			return Meteor.StreamerCentral.instances[name];                                                                    // 19
		}                                                                                                                  //
                                                                                                                     //
		_EV2.call(this);                                                                                                   // 22
                                                                                                                     //
		Meteor.StreamerCentral.instances[name] = this;                                                                     // 24
                                                                                                                     //
		this.name = name;                                                                                                  // 26
		this.retransmit = retransmit;                                                                                      // 27
		this.retransmitToSelf = retransmitToSelf;                                                                          // 28
                                                                                                                     //
		this.subscriptions = [];                                                                                           // 30
		this.subscriptionsByEventName = {};                                                                                // 31
		this.transformers = {};                                                                                            // 32
                                                                                                                     //
		this.iniPublication();                                                                                             // 34
		this.initMethod();                                                                                                 // 35
                                                                                                                     //
		this._allowRead = {};                                                                                              // 37
		this._allowEmit = {};                                                                                              // 38
		this._allowWrite = {};                                                                                             // 39
                                                                                                                     //
		this.allowRead('none');                                                                                            // 41
		this.allowEmit('all');                                                                                             // 42
		this.allowWrite('none');                                                                                           // 43
	}                                                                                                                   //
                                                                                                                     //
	Streamer.prototype.allowRead = (function () {                                                                       // 15
		function allowRead(eventName, fn) {                                                                                // 77
			if (fn === undefined) {                                                                                           // 78
				fn = eventName;                                                                                                  // 79
				eventName = '__all__';                                                                                           // 80
			}                                                                                                                 //
                                                                                                                     //
			if (typeof fn === 'function') {                                                                                   // 83
				return this._allowRead[eventName] = fn;                                                                          // 84
			}                                                                                                                 //
                                                                                                                     //
			if (typeof fn === 'string' && ['all', 'none', 'logged'].indexOf(fn) === -1) {                                     // 87
				console.error('allowRead shortcut \'' + fn + '\' is invalid');                                                   // 88
			}                                                                                                                 //
                                                                                                                     //
			if (fn === 'all' || fn === true) {                                                                                // 91
				return this._allowRead[eventName] = function () {                                                                // 92
					return true;                                                                                                    // 93
				};                                                                                                               //
			}                                                                                                                 //
                                                                                                                     //
			if (fn === 'none' || fn === false) {                                                                              // 97
				return this._allowRead[eventName] = function () {                                                                // 98
					return false;                                                                                                   // 99
				};                                                                                                               //
			}                                                                                                                 //
                                                                                                                     //
			if (fn === 'logged') {                                                                                            // 103
				return this._allowRead[eventName] = function () {                                                                // 104
					return Boolean(this.userId);                                                                                    // 105
				};                                                                                                               //
			}                                                                                                                 //
		}                                                                                                                  //
                                                                                                                     //
		return allowRead;                                                                                                  //
	})();                                                                                                               //
                                                                                                                     //
	Streamer.prototype.allowEmit = (function () {                                                                       // 15
		function allowEmit(eventName, fn) {                                                                                // 110
			if (fn === undefined) {                                                                                           // 111
				fn = eventName;                                                                                                  // 112
				eventName = '__all__';                                                                                           // 113
			}                                                                                                                 //
                                                                                                                     //
			if (typeof fn === 'function') {                                                                                   // 116
				return this._allowEmit[eventName] = fn;                                                                          // 117
			}                                                                                                                 //
                                                                                                                     //
			if (typeof fn === 'string' && ['all', 'none', 'logged'].indexOf(fn) === -1) {                                     // 120
				console.error('allowRead shortcut \'' + fn + '\' is invalid');                                                   // 121
			}                                                                                                                 //
                                                                                                                     //
			if (fn === 'all' || fn === true) {                                                                                // 124
				return this._allowEmit[eventName] = function () {                                                                // 125
					return true;                                                                                                    // 126
				};                                                                                                               //
			}                                                                                                                 //
                                                                                                                     //
			if (fn === 'none' || fn === false) {                                                                              // 130
				return this._allowEmit[eventName] = function () {                                                                // 131
					return false;                                                                                                   // 132
				};                                                                                                               //
			}                                                                                                                 //
                                                                                                                     //
			if (fn === 'logged') {                                                                                            // 136
				return this._allowEmit[eventName] = function () {                                                                // 137
					return Boolean(this.userId);                                                                                    // 138
				};                                                                                                               //
			}                                                                                                                 //
		}                                                                                                                  //
                                                                                                                     //
		return allowEmit;                                                                                                  //
	})();                                                                                                               //
                                                                                                                     //
	Streamer.prototype.allowWrite = (function () {                                                                      // 15
		function allowWrite(eventName, fn) {                                                                               // 143
			if (fn === undefined) {                                                                                           // 144
				fn = eventName;                                                                                                  // 145
				eventName = '__all__';                                                                                           // 146
			}                                                                                                                 //
                                                                                                                     //
			if (typeof fn === 'function') {                                                                                   // 149
				return this._allowWrite[eventName] = fn;                                                                         // 150
			}                                                                                                                 //
                                                                                                                     //
			if (typeof fn === 'string' && ['all', 'none', 'logged'].indexOf(fn) === -1) {                                     // 153
				console.error('allowWrite shortcut \'' + fn + '\' is invalid');                                                  // 154
			}                                                                                                                 //
                                                                                                                     //
			if (fn === 'all' || fn === true) {                                                                                // 157
				return this._allowWrite[eventName] = function () {                                                               // 158
					return true;                                                                                                    // 159
				};                                                                                                               //
			}                                                                                                                 //
                                                                                                                     //
			if (fn === 'none' || fn === false) {                                                                              // 163
				return this._allowWrite[eventName] = function () {                                                               // 164
					return false;                                                                                                   // 165
				};                                                                                                               //
			}                                                                                                                 //
                                                                                                                     //
			if (fn === 'logged') {                                                                                            // 169
				return this._allowWrite[eventName] = function () {                                                               // 170
					return Boolean(this.userId);                                                                                    // 171
				};                                                                                                               //
			}                                                                                                                 //
		}                                                                                                                  //
                                                                                                                     //
		return allowWrite;                                                                                                 //
	})();                                                                                                               //
                                                                                                                     //
	Streamer.prototype.isReadAllowed = (function () {                                                                   // 15
		function isReadAllowed(scope, eventName) {                                                                         // 176
			if (this._allowRead[eventName]) {                                                                                 // 177
				return this._allowRead[eventName].call(scope, eventName);                                                        // 178
			}                                                                                                                 //
                                                                                                                     //
			return this._allowRead['__all__'].call(scope, eventName);                                                         // 181
		}                                                                                                                  //
                                                                                                                     //
		return isReadAllowed;                                                                                              //
	})();                                                                                                               //
                                                                                                                     //
	Streamer.prototype.isEmitAllowed = (function () {                                                                   // 15
		function isEmitAllowed(scope, eventName) {                                                                         // 184
			var _allowEmit$__all__;                                                                                           //
                                                                                                                     //
			for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {         //
				args[_key - 2] = arguments[_key];                                                                                // 184
			}                                                                                                                 //
                                                                                                                     //
			if (this._allowEmit[eventName]) {                                                                                 // 185
				var _allowEmit$eventName;                                                                                        //
                                                                                                                     //
				return (_allowEmit$eventName = this._allowEmit[eventName]).call.apply(_allowEmit$eventName, [scope, eventName].concat(args));
			}                                                                                                                 //
                                                                                                                     //
			return (_allowEmit$__all__ = this._allowEmit['__all__']).call.apply(_allowEmit$__all__, [scope, eventName].concat(args));
		}                                                                                                                  //
                                                                                                                     //
		return isEmitAllowed;                                                                                              //
	})();                                                                                                               //
                                                                                                                     //
	Streamer.prototype.isWriteAllowed = (function () {                                                                  // 15
		function isWriteAllowed(scope, eventName, args) {                                                                  // 192
			var _allowWrite$__all__;                                                                                          //
                                                                                                                     //
			if (this._allowWrite[eventName]) {                                                                                // 193
				var _allowWrite$eventName;                                                                                       //
                                                                                                                     //
				return (_allowWrite$eventName = this._allowWrite[eventName]).call.apply(_allowWrite$eventName, [scope, eventName].concat(args));
			}                                                                                                                 //
                                                                                                                     //
			return (_allowWrite$__all__ = this._allowWrite['__all__']).call.apply(_allowWrite$__all__, [scope, eventName].concat(args));
		}                                                                                                                  //
                                                                                                                     //
		return isWriteAllowed;                                                                                             //
	})();                                                                                                               //
                                                                                                                     //
	Streamer.prototype.addSubscription = (function () {                                                                 // 15
		function addSubscription(subscription, eventName) {                                                                // 200
			this.subscriptions.push(subscription);                                                                            // 201
                                                                                                                     //
			if (!this.subscriptionsByEventName[eventName]) {                                                                  // 203
				this.subscriptionsByEventName[eventName] = [];                                                                   // 204
			}                                                                                                                 //
                                                                                                                     //
			this.subscriptionsByEventName[eventName].push(subscription);                                                      // 207
		}                                                                                                                  //
                                                                                                                     //
		return addSubscription;                                                                                            //
	})();                                                                                                               //
                                                                                                                     //
	Streamer.prototype.removeSubscription = (function () {                                                              // 15
		function removeSubscription(subscription, eventName) {                                                             // 210
			var index = this.subscriptions.indexOf(subscription);                                                             // 211
			if (index > -1) {                                                                                                 // 212
				this.subscriptions.splice(index, 1);                                                                             // 213
			}                                                                                                                 //
                                                                                                                     //
			if (this.subscriptionsByEventName[eventName]) {                                                                   // 216
				var _index = this.subscriptionsByEventName[eventName].indexOf(subscription);                                     // 217
				if (_index > -1) {                                                                                               // 218
					this.subscriptionsByEventName[eventName].splice(_index, 1);                                                     // 219
				}                                                                                                                //
			}                                                                                                                 //
		}                                                                                                                  //
                                                                                                                     //
		return removeSubscription;                                                                                         //
	})();                                                                                                               //
                                                                                                                     //
	Streamer.prototype.transform = (function () {                                                                       // 15
		function transform(eventName, fn) {                                                                                // 224
			if (typeof eventName === 'function') {                                                                            // 225
				fn = eventName;                                                                                                  // 226
				eventName = '__all__';                                                                                           // 227
			}                                                                                                                 //
                                                                                                                     //
			if (!this.transformers[eventName]) {                                                                              // 230
				this.transformers[eventName] = [];                                                                               // 231
			}                                                                                                                 //
                                                                                                                     //
			this.transformers[eventName].push(fn);                                                                            // 234
		}                                                                                                                  //
                                                                                                                     //
		return transform;                                                                                                  //
	})();                                                                                                               //
                                                                                                                     //
	Streamer.prototype.applyTransformers = (function () {                                                               // 15
		function applyTransformers(methodScope, eventName, args) {                                                         // 237
			if (this.transformers['__all__']) {                                                                               // 238
				this.transformers['__all__'].forEach(function (transform) {                                                      // 239
					args = transform.call(methodScope, eventName, args);                                                            // 240
					methodScope.tranformed = true;                                                                                  // 241
					if (!Array.isArray(args)) {                                                                                     // 242
						args = [args];                                                                                                 // 243
					}                                                                                                               //
				});                                                                                                              //
			}                                                                                                                 //
                                                                                                                     //
			if (this.transformers[eventName]) {                                                                               // 248
				this.transformers[eventName].forEach(function (transform) {                                                      // 249
					args = transform.call.apply(transform, [methodScope].concat(args));                                             // 250
					methodScope.tranformed = true;                                                                                  // 251
					if (!Array.isArray(args)) {                                                                                     // 252
						args = [args];                                                                                                 // 253
					}                                                                                                               //
				});                                                                                                              //
			}                                                                                                                 //
                                                                                                                     //
			return args;                                                                                                      // 258
		}                                                                                                                  //
                                                                                                                     //
		return applyTransformers;                                                                                          //
	})();                                                                                                               //
                                                                                                                     //
	Streamer.prototype.iniPublication = (function () {                                                                  // 15
		function iniPublication() {                                                                                        // 261
			var stream = this;                                                                                                // 262
			Meteor.publish(this.subscriptionName, function (eventName, useCollection) {                                       // 263
				check(eventName, String);                                                                                        // 264
				check(useCollection, Match.Optional(Boolean));                                                                   // 265
                                                                                                                     //
				if (eventName.length === 0) {                                                                                    // 267
					this.stop();                                                                                                    // 268
					return;                                                                                                         // 269
				}                                                                                                                //
                                                                                                                     //
				if (stream.isReadAllowed(this, eventName) !== true) {                                                            // 272
					this.stop();                                                                                                    // 273
					return;                                                                                                         // 274
				}                                                                                                                //
                                                                                                                     //
				var subscription = {                                                                                             // 277
					subscription: this,                                                                                             // 278
					eventName: eventName                                                                                            // 279
				};                                                                                                               //
                                                                                                                     //
				stream.addSubscription(subscription, eventName);                                                                 // 282
                                                                                                                     //
				this.onStop(function () {                                                                                        // 284
					stream.removeSubscription(subscription, eventName);                                                             // 285
				});                                                                                                              //
                                                                                                                     //
				if (useCollection === true) {                                                                                    // 288
					// Collection compatibility                                                                                     //
					this._session.sendAdded(stream.subscriptionName, 'id', {                                                        // 290
						eventName: eventName                                                                                           // 291
					});                                                                                                             //
				}                                                                                                                //
                                                                                                                     //
				this.ready();                                                                                                    // 295
			});                                                                                                               //
		}                                                                                                                  //
                                                                                                                     //
		return iniPublication;                                                                                             //
	})();                                                                                                               //
                                                                                                                     //
	Streamer.prototype.initMethod = (function () {                                                                      // 15
		function initMethod() {                                                                                            // 299
			var stream = this;                                                                                                // 300
			var method = {};                                                                                                  // 301
                                                                                                                     //
			method[this.subscriptionName] = function (eventName) {                                                            // 303
				for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
					args[_key2 - 1] = arguments[_key2];                                                                             // 303
				}                                                                                                                //
                                                                                                                     //
				check(eventName, String);                                                                                        // 304
				check(args, Array);                                                                                              // 305
                                                                                                                     //
				this.unblock();                                                                                                  // 307
                                                                                                                     //
				if (stream.isWriteAllowed(this, eventName, args) !== true) {                                                     // 309
					return;                                                                                                         // 310
				}                                                                                                                //
                                                                                                                     //
				var methodScope = {                                                                                              // 313
					userId: this.userId,                                                                                            // 314
					connection: this.connection,                                                                                    // 315
					originalParams: args,                                                                                           // 316
					tranformed: false                                                                                               // 317
				};                                                                                                               //
                                                                                                                     //
				args = stream.applyTransformers(methodScope, eventName, args);                                                   // 320
                                                                                                                     //
				stream.emitWithScope.apply(stream, [eventName, methodScope].concat(args));                                       // 322
                                                                                                                     //
				if (stream.retransmit === true) {                                                                                // 324
					stream._emit(eventName, args, this.connection, true);                                                           // 325
				}                                                                                                                //
			};                                                                                                                //
                                                                                                                     //
			try {                                                                                                             // 329
				Meteor.methods(method);                                                                                          // 330
			} catch (e) {                                                                                                     //
				console.error(e);                                                                                                // 332
			}                                                                                                                 //
		}                                                                                                                  //
                                                                                                                     //
		return initMethod;                                                                                                 //
	})();                                                                                                               //
                                                                                                                     //
	Streamer.prototype._emit = (function () {                                                                           // 15
		function _emit(eventName, args, origin, broadcast) {                                                               // 336
			var _this = this;                                                                                                 //
                                                                                                                     //
			if (broadcast === true) {                                                                                         // 337
				Meteor.StreamerCentral.emit('broadcast', this.name, eventName, args);                                            // 338
			}                                                                                                                 //
                                                                                                                     //
			var subscriptions = this.subscriptionsByEventName[eventName];                                                     // 341
			if (!Array.isArray(subscriptions)) {                                                                              // 342
				return;                                                                                                          // 343
			}                                                                                                                 //
                                                                                                                     //
			subscriptions.forEach(function (subscription) {                                                                   // 346
				if (_this.retransmitToSelf === false && origin && origin === subscription.subscription.connection) {             // 347
					return;                                                                                                         // 348
				}                                                                                                                //
                                                                                                                     //
				if (_this.isEmitAllowed.apply(_this, [subscription.subscription, eventName].concat(args))) {                     // 351
					subscription.subscription._session.sendChanged(_this.subscriptionName, 'id', {                                  // 352
						eventName: eventName,                                                                                          // 353
						args: args                                                                                                     // 354
					});                                                                                                             //
				}                                                                                                                //
			});                                                                                                               //
		}                                                                                                                  //
                                                                                                                     //
		return _emit;                                                                                                      //
	})();                                                                                                               //
                                                                                                                     //
	Streamer.prototype.emit = (function () {                                                                            // 15
		function emit(eventName) {                                                                                         // 360
			for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {  //
				args[_key3 - 1] = arguments[_key3];                                                                              // 360
			}                                                                                                                 //
                                                                                                                     //
			this._emit(eventName, args, undefined, true);                                                                     // 361
		}                                                                                                                  //
                                                                                                                     //
		return emit;                                                                                                       //
	})();                                                                                                               //
                                                                                                                     //
	Streamer.prototype.emitWithoutBroadcast = (function () {                                                            // 15
		function emitWithoutBroadcast(eventName) {                                                                         // 364
			for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {  //
				args[_key4 - 1] = arguments[_key4];                                                                              // 364
			}                                                                                                                 //
                                                                                                                     //
			this._emit(eventName, args, undefined, false);                                                                    // 365
		}                                                                                                                  //
                                                                                                                     //
		return emitWithoutBroadcast;                                                                                       //
	})();                                                                                                               //
                                                                                                                     //
	babelHelpers.createClass(Streamer, [{                                                                               //
		key: 'name',                                                                                                       //
		get: function () {                                                                                                 //
			return this._name;                                                                                                // 47
		},                                                                                                                 //
		set: function (name) {                                                                                             //
			check(name, String);                                                                                              // 51
			this._name = name;                                                                                                // 52
		}                                                                                                                  //
	}, {                                                                                                                //
		key: 'subscriptionName',                                                                                           //
		get: function () {                                                                                                 //
			return 'stream-' + this.name;                                                                                     // 56
		}                                                                                                                  //
	}, {                                                                                                                //
		key: 'retransmit',                                                                                                 //
		get: function () {                                                                                                 //
			return this._retransmit;                                                                                          // 60
		},                                                                                                                 //
		set: function (retransmit) {                                                                                       //
			check(retransmit, Boolean);                                                                                       // 64
			this._retransmit = retransmit;                                                                                    // 65
		}                                                                                                                  //
	}, {                                                                                                                //
		key: 'retransmitToSelf',                                                                                           //
		get: function () {                                                                                                 //
			return this._retransmitToSelf;                                                                                    // 69
		},                                                                                                                 //
		set: function (retransmitToSelf) {                                                                                 //
			check(retransmitToSelf, Boolean);                                                                                 // 73
			this._retransmitToSelf = retransmitToSelf;                                                                        // 74
		}                                                                                                                  //
	}]);                                                                                                                //
	return Streamer;                                                                                                    //
})(EV);                                                                                                              //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:streamer'] = {
  Streamer: Streamer
};

})();

//# sourceMappingURL=rocketchat_streamer.js.map
