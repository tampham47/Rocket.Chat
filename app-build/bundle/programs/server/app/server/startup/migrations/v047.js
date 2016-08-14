(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/migrations/v047.js                                   //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
RocketChat.Migrations.add({                                            // 1
	version: 47,                                                          // 2
	up: function () {                                                     // 3
		if (RocketChat && RocketChat.models && RocketChat.models.Settings) {
			var autolinkerUrls = RocketChat.models.Settings.findOne({ _id: 'AutoLinker_Urls' });
			if (autolinkerUrls) {                                               // 6
				RocketChat.models.Settings.remove({ _id: 'AutoLinker_Urls' });     // 7
				RocketChat.models.Settings.upsert({ _id: 'AutoLinker_Urls_Scheme' }, {
					$set: {                                                           // 9
						value: autolinkerUrls.value ? true : false,                      // 10
						i18nLabel: 'AutoLinker_Urls_Scheme'                              // 11
					}                                                                 //
				});                                                                //
				RocketChat.models.Settings.upsert({ _id: 'AutoLinker_Urls_www' }, {
					$set: {                                                           // 15
						value: autolinkerUrls.value ? true : false,                      // 16
						i18nLabel: 'AutoLinker_Urls_www'                                 // 17
					}                                                                 //
				});                                                                //
				RocketChat.models.Settings.upsert({ _id: 'AutoLinker_Urls_TLD' }, {
					$set: {                                                           // 21
						value: autolinkerUrls.value ? true : false,                      // 22
						i18nLabel: 'AutoLinker_Urls_TLD'                                 // 23
					}                                                                 //
				});                                                                //
			}                                                                   //
		}                                                                    //
	}                                                                     //
});                                                                    //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=v047.js.map
