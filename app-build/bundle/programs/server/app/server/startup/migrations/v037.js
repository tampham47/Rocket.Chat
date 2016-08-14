(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/migrations/v037.js                                   //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
RocketChat.Migrations.add({                                            // 1
	version: 37,                                                          // 2
	up: function () {                                                     // 3
		if (RocketChat && RocketChat.models && RocketChat.models.Permissions) {
                                                                       //
			// Find permission add-user (changed it to create-user)             //
			var addUserPermission = RocketChat.models.Permissions.findOne('add-user');
                                                                       //
			if (addUserPermission) {                                            // 9
				RocketChat.models.Permissions.upsert({ _id: 'create-user' }, { $set: { roles: addUserPermission.roles } });
				RocketChat.models.Permissions.remove({ _id: 'add-user' });         // 11
			}                                                                   //
		}                                                                    //
	}                                                                     //
});                                                                    //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=v037.js.map
