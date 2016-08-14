(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/migrations/v040.js                                   //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
RocketChat.Migrations.add({                                            // 1
	version: 40,                                                          // 2
	up: function () {                                                     // 3
		RocketChat.models.Settings.find({ _id: /Accounts_OAuth_Custom_/, i18nLabel: 'Accounts_OAuth_Custom_Enable' }).forEach(function (customOauth) {
			var parts = customOauth._id.split('_');                             // 5
			var name = parts[3];                                                // 6
			var id = 'Accounts_OAuth_Custom_' + name + '_token_sent_via';       // 7
			if (!RocketChat.models.Settings.findOne({ _id: id })) {             // 8
				RocketChat.models.Settings.insert({                                // 9
					'_id': id,                                                        // 10
					'type': 'select',                                                 // 11
					'group': 'OAuth',                                                 // 12
					'section': 'Custom OAuth: ' + name,                               // 13
					'i18nLabel': 'Accounts_OAuth_Custom_Token_Sent_Via',              // 14
					'persistent': true,                                               // 15
					'values': [{                                                      // 16
						'key': 'header',                                                 // 18
						'i18nLabel': 'Header'                                            // 19
					}, {                                                              //
						'key': 'payload',                                                // 22
						'i18nLabel': 'Payload'                                           // 23
					}],                                                               //
					'packageValue': 'payload',                                        // 26
					'valueSource': 'packageValue',                                    // 27
					'ts': new Date(),                                                 // 28
					'hidden': false,                                                  // 29
					'blocked': false,                                                 // 30
					'sorter': 255,                                                    // 31
					'i18nDescription': 'Accounts_OAuth_Custom_' + name + '_token_sent_via_Description',
					'createdAt': new Date(),                                          // 33
					'value': 'payload'                                                // 34
				});                                                                //
			}                                                                   //
		});                                                                  //
	}                                                                     //
});                                                                    //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=v040.js.map
