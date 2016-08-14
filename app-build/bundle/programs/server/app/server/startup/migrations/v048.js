(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/migrations/v048.js                                   //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
RocketChat.Migrations.add({                                            // 1
	version: 48,                                                          // 2
	up: function () {                                                     // 3
		if (RocketChat && RocketChat.models && RocketChat.models.Settings) {
                                                                       //
			var RocketBot_Enabled = RocketChat.models.Settings.findOne({        // 6
				_id: 'RocketBot_Enabled'                                           // 7
			});                                                                 //
			if (RocketBot_Enabled) {                                            // 9
				RocketChat.models.Settings.remove({                                // 10
					_id: 'RocketBot_Enabled'                                          // 11
				});                                                                //
				RocketChat.models.Settings.upsert({                                // 13
					_id: 'InternalHubot_Enabled'                                      // 14
				}, {                                                               //
					$set: {                                                           // 16
						value: RocketBot_Enabled.value                                   // 17
					}                                                                 //
				});                                                                //
			}                                                                   //
                                                                       //
			var RocketBot_Name = RocketChat.models.Settings.findOne({           // 22
				_id: 'RocketBot_Name'                                              // 23
			});                                                                 //
			if (RocketBot_Name) {                                               // 25
				RocketChat.models.Settings.remove({                                // 26
					_id: 'RocketBot_Name'                                             // 27
				});                                                                //
				RocketChat.models.Settings.upsert({                                // 29
					_id: 'InternalHubot_Username'                                     // 30
				}, {                                                               //
					$set: {                                                           // 32
						value: RocketBot_Name.value                                      // 33
					}                                                                 //
				});                                                                //
			}                                                                   //
		}                                                                    //
	}                                                                     //
});                                                                    //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=v048.js.map
