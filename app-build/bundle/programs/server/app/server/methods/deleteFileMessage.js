(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/deleteFileMessage.js                                 //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
Meteor.methods({                                                       // 1
	deleteFileMessage: function (fileID) {                                // 2
		return Meteor.call('deleteMessage', RocketChat.models.Messages.getMessageByFileId(fileID));
	}                                                                     //
});                                                                    //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=deleteFileMessage.js.map
