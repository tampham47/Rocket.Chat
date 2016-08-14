(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var colors = Package['nooitaf:colors'].colors;
var _ = Package.underscore._;

/* Package-scope variables */
var UsersSessions, UserPresence, UserPresenceMonitor;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/konecty_user-presence/common/common.js                                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
UsersSessions = new Meteor.Collection('usersSessions');                                                               // 1
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/konecty_user-presence/server/server.js                                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
UsersSessions._ensureIndex({'connections.instanceId': 1}, {sparse: 1, name: 'connections.instanceId'});               // 1
UsersSessions._ensureIndex({'connections.id': 1}, {sparse: 1, name: 'connections.id'});                               // 2
                                                                                                                      // 3
var allowedStatus = ['online', 'away', 'busy', 'offline'];                                                            // 4
                                                                                                                      // 5
var logEnable = false;                                                                                                // 6
                                                                                                                      // 7
var log = function(msg, color) {                                                                                      // 8
	if (logEnable) {                                                                                                     // 9
		if (color) {                                                                                                        // 10
			console.log(msg[color]);                                                                                           // 11
		} else {                                                                                                            // 12
			console.log(msg);                                                                                                  // 13
		}                                                                                                                   // 14
	}                                                                                                                    // 15
};                                                                                                                    // 16
                                                                                                                      // 17
var logRed    = function() {log(Array.prototype.slice.call(arguments).join(' '), 'red');};                            // 18
var logGrey   = function() {log(Array.prototype.slice.call(arguments).join(' '), 'grey');};                           // 19
var logGreen  = function() {log(Array.prototype.slice.call(arguments).join(' '), 'green');};                          // 20
var logYellow = function() {log(Array.prototype.slice.call(arguments).join(' '), 'yellow');};                         // 21
                                                                                                                      // 22
UserPresence = {                                                                                                      // 23
	activeLogs: function() {                                                                                             // 24
		logEnable = true;                                                                                                   // 25
	},                                                                                                                   // 26
                                                                                                                      // 27
	removeLostConnections: function() {                                                                                  // 28
		if (Package['konecty:multiple-instances-status']) {                                                                 // 29
			var ids = InstanceStatus.getCollection().find({}, {fields: {_id: 1}}).fetch();                                     // 30
                                                                                                                      // 31
			ids = ids.map(function(id) {                                                                                       // 32
				return id._id;                                                                                                    // 33
			});                                                                                                                // 34
                                                                                                                      // 35
			var update = {                                                                                                     // 36
				$pull: {                                                                                                          // 37
					connections: {                                                                                                   // 38
						instanceId: {                                                                                                   // 39
							$nin: ids                                                                                                      // 40
						}                                                                                                               // 41
					}                                                                                                                // 42
				}                                                                                                                 // 43
			};                                                                                                                 // 44
                                                                                                                      // 45
			UsersSessions.update({}, update, {multi: true});                                                                   // 46
		} else {                                                                                                            // 47
			UsersSessions.remove({});                                                                                          // 48
		}                                                                                                                   // 49
	},                                                                                                                   // 50
                                                                                                                      // 51
	removeConnectionsByInstanceId: function(instanceId) {                                                                // 52
		logRed('[user-presence] removeConnectionsByInstanceId', instanceId);                                                // 53
		var update = {                                                                                                      // 54
			$pull: {                                                                                                           // 55
				connections: {                                                                                                    // 56
					instanceId: instanceId                                                                                           // 57
				}                                                                                                                 // 58
			}                                                                                                                  // 59
		};                                                                                                                  // 60
                                                                                                                      // 61
		UsersSessions.update({}, update, {multi: true});                                                                    // 62
	},                                                                                                                   // 63
                                                                                                                      // 64
	removeAllConnections: function() {                                                                                   // 65
		logRed('[user-presence] removeAllConnections');                                                                     // 66
		UsersSessions.remove({});                                                                                           // 67
	},                                                                                                                   // 68
                                                                                                                      // 69
	startObserveForDeletedServers: function() {                                                                          // 70
		InstanceStatus.getCollection().find({}, {fields: {_id: 1}}).observeChanges({                                        // 71
			removed: function(id) {                                                                                            // 72
				UserPresence.removeConnectionsByInstanceId(id);                                                                   // 73
			}                                                                                                                  // 74
		});                                                                                                                 // 75
	},                                                                                                                   // 76
                                                                                                                      // 77
	createConnection: function(userId, connection, status, visitor) {                                                    // 78
		if (!userId) {                                                                                                      // 79
			return;                                                                                                            // 80
		};                                                                                                                  // 81
                                                                                                                      // 82
		connection.UserPresenceUserId = userId;                                                                             // 83
                                                                                                                      // 84
		status = status || 'online';                                                                                        // 85
                                                                                                                      // 86
		logGreen('[user-presence] createConnection', userId, connection.id, visitor === true ? 'visitor' : 'user');         // 87
                                                                                                                      // 88
		var query = {                                                                                                       // 89
			_id: userId                                                                                                        // 90
		};                                                                                                                  // 91
                                                                                                                      // 92
		var now = new Date();                                                                                               // 93
                                                                                                                      // 94
		var instanceId = undefined;                                                                                         // 95
		if (Package['konecty:multiple-instances-status']) {                                                                 // 96
			instanceId = InstanceStatus.id();                                                                                  // 97
		};                                                                                                                  // 98
                                                                                                                      // 99
		var update = {                                                                                                      // 100
			$set: {                                                                                                            // 101
				visitor: visitor === true                                                                                         // 102
			},                                                                                                                 // 103
			$push: {                                                                                                           // 104
				connections: {                                                                                                    // 105
					id: connection.id,                                                                                               // 106
					instanceId: instanceId,                                                                                          // 107
					status: status,                                                                                                  // 108
					_createdAt: now,                                                                                                 // 109
					_updatedAt: now                                                                                                  // 110
				}                                                                                                                 // 111
			}                                                                                                                  // 112
		};                                                                                                                  // 113
                                                                                                                      // 114
		UsersSessions.upsert(query, update);                                                                                // 115
	},                                                                                                                   // 116
                                                                                                                      // 117
	setConnection: function(userId, connection, status, visitor) {                                                       // 118
		if (!userId) {                                                                                                      // 119
			return;                                                                                                            // 120
		};                                                                                                                  // 121
                                                                                                                      // 122
		logGrey('[user-presence] setConnection', userId, connection.id, status, visitor === true ? 'visitor' : 'user');     // 123
                                                                                                                      // 124
		var query = {                                                                                                       // 125
			_id: userId,                                                                                                       // 126
			'connections.id': connection.id                                                                                    // 127
		};                                                                                                                  // 128
                                                                                                                      // 129
		var now = new Date();                                                                                               // 130
                                                                                                                      // 131
		var update = {                                                                                                      // 132
			$set: {                                                                                                            // 133
				'connections.$.status': status,                                                                                   // 134
				'connections.$._updatedAt': now                                                                                   // 135
			}                                                                                                                  // 136
		};                                                                                                                  // 137
                                                                                                                      // 138
		var count = UsersSessions.update(query, update);                                                                    // 139
                                                                                                                      // 140
		if (count === 0) {                                                                                                  // 141
			UserPresence.createConnection(userId, connection, status, visitor);                                                // 142
		};                                                                                                                  // 143
                                                                                                                      // 144
		if (visitor !== true) {                                                                                             // 145
			if (status === 'online') {                                                                                         // 146
				Meteor.users.update({_id: userId, statusDefault: 'online', status: {$ne: 'online'}}, {$set: {status: 'online'}});
			} else if (status === 'away') {                                                                                    // 148
				Meteor.users.update({_id: userId, statusDefault: 'online', status: {$ne: 'away'}}, {$set: {status: 'away'}});     // 149
			}                                                                                                                  // 150
		}                                                                                                                   // 151
	},                                                                                                                   // 152
                                                                                                                      // 153
	setDefaultStatus: function(userId, status) {                                                                         // 154
		if (!userId) {                                                                                                      // 155
			return;                                                                                                            // 156
		};                                                                                                                  // 157
                                                                                                                      // 158
		if (allowedStatus.indexOf(status) === -1) {                                                                         // 159
			return;                                                                                                            // 160
		};                                                                                                                  // 161
                                                                                                                      // 162
		logYellow('[user-presence] setDefaultStatus', userId, status);                                                      // 163
                                                                                                                      // 164
		var update = Meteor.users.update({_id: userId, statusDefault: {$ne: status}}, {$set: {statusDefault: status}});     // 165
                                                                                                                      // 166
		if (update > 0) {                                                                                                   // 167
			UserPresenceMonitor.processUser(userId, { statusDefault: status });                                                // 168
		}                                                                                                                   // 169
	},                                                                                                                   // 170
                                                                                                                      // 171
	removeConnection: function(connectionId) {                                                                           // 172
		logRed('[user-presence] removeConnection', connectionId);                                                           // 173
                                                                                                                      // 174
		var query = {                                                                                                       // 175
			'connections.id': connectionId                                                                                     // 176
		};                                                                                                                  // 177
                                                                                                                      // 178
		var update = {                                                                                                      // 179
			$pull: {                                                                                                           // 180
				connections: {                                                                                                    // 181
					id: connectionId                                                                                                 // 182
				}                                                                                                                 // 183
			}                                                                                                                  // 184
		};                                                                                                                  // 185
                                                                                                                      // 186
		UsersSessions.update(query, update);                                                                                // 187
	},                                                                                                                   // 188
                                                                                                                      // 189
	start: function() {                                                                                                  // 190
		Meteor.onConnection(function(connection) {                                                                          // 191
			connection.onClose(function() {                                                                                    // 192
				if (connection.UserPresenceUserId != undefined) {                                                                 // 193
					UserPresence.removeConnection(connection.id);                                                                    // 194
				}                                                                                                                 // 195
			});                                                                                                                // 196
		});                                                                                                                 // 197
                                                                                                                      // 198
		process.on('exit', function() {                                                                                     // 199
			if (Package['konecty:multiple-instances-status']) {                                                                // 200
				UserPresence.removeConnectionsByInstanceId(InstanceStatus.id());                                                  // 201
			} else {                                                                                                           // 202
				UserPresence.removeAllConnections();                                                                              // 203
			}                                                                                                                  // 204
		});                                                                                                                 // 205
                                                                                                                      // 206
		if (Package['accounts-base']) {                                                                                     // 207
			Accounts.onLogin(function(login) {                                                                                 // 208
				UserPresence.createConnection(login.user._id, login.connection);                                                  // 209
			});                                                                                                                // 210
		};                                                                                                                  // 211
                                                                                                                      // 212
		Meteor.publish(null, function() {                                                                                   // 213
			if (this.userId == null && this.connection.UserPresenceUserId != undefined) {                                      // 214
				UserPresence.removeConnection(this.connection.id);                                                                // 215
				delete this.connection.UserPresenceUserId;                                                                        // 216
			}                                                                                                                  // 217
                                                                                                                      // 218
			this.ready();                                                                                                      // 219
		});                                                                                                                 // 220
                                                                                                                      // 221
		if (Package['konecty:multiple-instances-status']) {                                                                 // 222
			UserPresence.startObserveForDeletedServers();                                                                      // 223
		}                                                                                                                   // 224
                                                                                                                      // 225
		UserPresence.removeLostConnections();                                                                               // 226
                                                                                                                      // 227
		Meteor.methods({                                                                                                    // 228
			'UserPresence:connect': function() {                                                                               // 229
				this.unblock();                                                                                                   // 230
				UserPresence.createConnection(this.userId, this.connection);                                                      // 231
			},                                                                                                                 // 232
                                                                                                                      // 233
			'UserPresence:away': function() {                                                                                  // 234
				this.unblock();                                                                                                   // 235
				UserPresence.setConnection(this.userId, this.connection, 'away');                                                 // 236
			},                                                                                                                 // 237
                                                                                                                      // 238
			'UserPresence:online': function() {                                                                                // 239
				this.unblock();                                                                                                   // 240
				UserPresence.setConnection(this.userId, this.connection, 'online');                                               // 241
			},                                                                                                                 // 242
                                                                                                                      // 243
			'UserPresence:setDefaultStatus': function(status) {                                                                // 244
				this.unblock();                                                                                                   // 245
				UserPresence.setDefaultStatus(this.userId, status);                                                               // 246
			},                                                                                                                 // 247
                                                                                                                      // 248
			'UserPresence:visitor:connect': function(id) {                                                                     // 249
				this.unblock();                                                                                                   // 250
				UserPresence.createConnection(id, this.connection, 'online', true);                                               // 251
			}                                                                                                                  // 252
		});                                                                                                                 // 253
	}                                                                                                                    // 254
}                                                                                                                     // 255
                                                                                                                      // 256
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/konecty_user-presence/server/monitor.js                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
UserPresenceMonitor = {                                                                                               // 1
	callbacks: [],                                                                                                       // 2
                                                                                                                      // 3
	/**                                                                                                                  // 4
	 * The callback will receive the following parameters: user, status, statusConnection                                // 5
	 */                                                                                                                  // 6
	onSetUserStatus: function(callback) {                                                                                // 7
		this.callbacks.push(callback);                                                                                      // 8
	},                                                                                                                   // 9
                                                                                                                      // 10
	runCallbacks: function(user, status, statusConnection) {                                                             // 11
		this.callbacks.forEach(function(callback) {                                                                         // 12
			callback.call(null, user, status, statusConnection);                                                               // 13
		})                                                                                                                  // 14
	},                                                                                                                   // 15
                                                                                                                      // 16
	start: function() {                                                                                                  // 17
		UsersSessions.find({}).observe({                                                                                    // 18
			added: function(record) {                                                                                          // 19
				UserPresenceMonitor.processUserSession(record, 'added');                                                          // 20
			},                                                                                                                 // 21
			changed: function(record) {                                                                                        // 22
				UserPresenceMonitor.processUserSession(record, 'changed');                                                        // 23
			},                                                                                                                 // 24
			removed: function(record) {                                                                                        // 25
				UserPresenceMonitor.processUserSession(record, 'removed');                                                        // 26
			}                                                                                                                  // 27
		});                                                                                                                 // 28
	},                                                                                                                   // 29
                                                                                                                      // 30
	processUserSession: function(record, action) {                                                                       // 31
		if (action === 'removed' && (record.connections == null || record.connections.length === 0)) {                      // 32
			return;                                                                                                            // 33
		};                                                                                                                  // 34
                                                                                                                      // 35
		if (record.connections == null || record.connections.length === 0 || action === 'removed') {                        // 36
			if (record.visitor === true) {                                                                                     // 37
				UserPresenceMonitor.setVisitorStatus(record._id, 'offline');                                                      // 38
			} else {                                                                                                           // 39
				UserPresenceMonitor.setUserStatus(record._id, 'offline');                                                         // 40
			}                                                                                                                  // 41
                                                                                                                      // 42
			if (action !== 'removed') {                                                                                        // 43
				UsersSessions.remove({_id: record._id, 'connections.0': {$exists: false} });                                      // 44
			};                                                                                                                 // 45
			return;                                                                                                            // 46
		};                                                                                                                  // 47
                                                                                                                      // 48
		var connectionStatus = 'offline';                                                                                   // 49
		record.connections.forEach(function(connection) {                                                                   // 50
			if (connection.status === 'online') {                                                                              // 51
				connectionStatus = 'online';                                                                                      // 52
			} else if (connection.status === 'away' && connectionStatus === 'offline') {                                       // 53
				connectionStatus = 'away';                                                                                        // 54
			};                                                                                                                 // 55
		});                                                                                                                 // 56
                                                                                                                      // 57
		if (record.visitor === true) {                                                                                      // 58
			UserPresenceMonitor.setVisitorStatus(record._id, connectionStatus);                                                // 59
		} else {                                                                                                            // 60
			UserPresenceMonitor.setUserStatus(record._id, connectionStatus);                                                   // 61
		};                                                                                                                  // 62
	},                                                                                                                   // 63
                                                                                                                      // 64
	processUser: function(id, fields) {                                                                                  // 65
		if (fields.statusDefault == null) {                                                                                 // 66
			return;                                                                                                            // 67
		};                                                                                                                  // 68
                                                                                                                      // 69
		var userSession = UsersSessions.findOne({_id: id});                                                                 // 70
                                                                                                                      // 71
		if (userSession) {                                                                                                  // 72
			UserPresenceMonitor.processUserSession(userSession, 'changed');                                                    // 73
		};                                                                                                                  // 74
	},                                                                                                                   // 75
                                                                                                                      // 76
	setUserStatus: function(userId, status) {                                                                            // 77
		var user = Meteor.users.findOne(userId),                                                                            // 78
			statusConnection = status;                                                                                         // 79
                                                                                                                      // 80
		if (!user) {                                                                                                        // 81
			return;                                                                                                            // 82
		};                                                                                                                  // 83
                                                                                                                      // 84
		if (user.statusDefault != null && status !== 'offline' && user.statusDefault !== 'online') {                        // 85
			status = user.statusDefault;                                                                                       // 86
		};                                                                                                                  // 87
                                                                                                                      // 88
		var query = {                                                                                                       // 89
			_id: userId,                                                                                                       // 90
			$or: [                                                                                                             // 91
				{status: {$ne: status}},                                                                                          // 92
				{statusConnection: {$ne: statusConnection}}                                                                       // 93
			]                                                                                                                  // 94
		};                                                                                                                  // 95
                                                                                                                      // 96
		var update = {                                                                                                      // 97
			$set: {                                                                                                            // 98
				status: status,                                                                                                   // 99
				statusConnection: statusConnection                                                                                // 100
			}                                                                                                                  // 101
		};                                                                                                                  // 102
                                                                                                                      // 103
		Meteor.users.update(query, update);                                                                                 // 104
                                                                                                                      // 105
		this.runCallbacks(user, status, statusConnection);                                                                  // 106
	},                                                                                                                   // 107
                                                                                                                      // 108
	setVisitorStatus: function(id, status) {}                                                                            // 109
}                                                                                                                     // 110
                                                                                                                      // 111
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['konecty:user-presence'] = {
  UserPresence: UserPresence,
  UserPresenceMonitor: UserPresenceMonitor
};

})();

//# sourceMappingURL=konecty_user-presence.js.map
