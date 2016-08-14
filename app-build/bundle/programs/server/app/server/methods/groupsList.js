(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/groupsList.js                                        //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
Meteor.methods({                                                       // 1
	groupsList: function (nameFilter, limit, sort) {                      // 2
		if (!Meteor.userId()) {                                              // 3
			throw new Meteor.Error('error-invalid-user', 'Invalid user', { method: 'groupsList' });
		}                                                                    //
                                                                       //
		var options = {                                                      // 7
			fields: { name: 1 },                                                // 8
			sort: { name: 1 }                                                   // 9
		};                                                                   //
                                                                       //
		//Verify the limit param is a number                                 //
		if (_.isNumber(limit)) {                                             // 13
			options.limit = limit;                                              // 14
		}                                                                    //
                                                                       //
		//Verify there is a sort option and it's a string                    //
		if (_.trim(sort)) {                                                  // 18
			switch (sort) {                                                     // 19
				case 'name':                                                       // 20
					options.sort = { name: 1 };                                       // 21
					break;                                                            // 22
				case 'msgs':                                                       // 22
					options.sort = { msgs: -1 };                                      // 24
					break;                                                            // 25
			}                                                                   // 25
		}                                                                    //
                                                                       //
		//Determine if they are searching or not, base it upon the name field
		if (nameFilter) {                                                    // 30
			return { groups: RocketChat.models.Rooms.findByTypeAndNameContainingUsername('p', new RegExp(s.trim(s.escapeRegExp(nameFilter)), 'i'), Meteor.user().username, options).fetch() };
		} else {                                                             //
			var roomIds = _.pluck(RocketChat.models.Subscriptions.findByTypeAndUserId('p', Meteor.userId()).fetch(), 'rid');
			return { groups: RocketChat.models.Rooms.findByIds(roomIds, options).fetch() };
		}                                                                    //
	}                                                                     //
});                                                                    //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=groupsList.js.map
