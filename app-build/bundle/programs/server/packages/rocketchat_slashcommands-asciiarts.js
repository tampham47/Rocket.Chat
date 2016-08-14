(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var ECMAScript = Package.ecmascript.ECMAScript;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;
var babelHelpers = Package['babel-runtime'].babelHelpers;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var Promise = Package.promise.Promise;

(function(){

////////////////////////////////////////////////////////////////////////
//                                                                    //
// packages/rocketchat_slashcommands-asciiarts/gimme.js               //
//                                                                    //
////////////////////////////////////////////////////////////////////////
                                                                      //
/*                                                                    //
* Gimme is a named function that will replace /gimme commands         //
* @param {Object} message - The message object                        //
*/                                                                    //
                                                                      //
function Gimme(command, params, item) {                               // 7
	if (command === 'gimme') {                                           // 8
		var msg;                                                            // 9
                                                                      //
		msg = item;                                                         // 11
		msg.msg = '༼ つ ◕_◕ ༽つ ' + params;                                   // 12
		Meteor.call('sendMessage', msg);                                    // 13
	}                                                                    //
}                                                                     //
                                                                      //
RocketChat.slashCommands.add('gimme', Gimme, {                        // 17
	description: 'Slash_Gimme_Description',                              // 18
	params: 'your message (optional)'                                    // 19
});                                                                   //
////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////
//                                                                    //
// packages/rocketchat_slashcommands-asciiarts/lenny.js               //
//                                                                    //
////////////////////////////////////////////////////////////////////////
                                                                      //
/*                                                                    //
* Lenny is a named function that will replace /lenny commands         //
* @param {Object} message - The message object                        //
*/                                                                    //
                                                                      //
function LennyFace(command, params, item) {                           // 7
	if (command === 'lennyface') {                                       // 8
		var msg;                                                            // 9
                                                                      //
		msg = item;                                                         // 11
		msg.msg = params + ' ( ͡° ͜ʖ ͡°)';                                  // 12
		Meteor.call('sendMessage', msg);                                    // 13
	}                                                                    //
}                                                                     //
                                                                      //
RocketChat.slashCommands.add('lennyface', LennyFace, {                // 17
	description: 'Slash_LennyFace_Description',                          // 18
	params: 'your message (optional)'                                    // 19
});                                                                   //
////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////
//                                                                    //
// packages/rocketchat_slashcommands-asciiarts/shrug.js               //
//                                                                    //
////////////////////////////////////////////////////////////////////////
                                                                      //
/*                                                                    //
* Shrug is a named function that will replace /shrug commands         //
* @param {Object} message - The message object                        //
*/                                                                    //
                                                                      //
function Shrug(command, params, item) {                               // 7
	if (command === 'shrug') {                                           // 8
		var msg;                                                            // 9
                                                                      //
		msg = item;                                                         // 11
		msg.msg = params + ' ¯\\_(ツ)_/¯';                                   // 12
		Meteor.call('sendMessage', msg);                                    // 13
	}                                                                    //
}                                                                     //
                                                                      //
RocketChat.slashCommands.add('shrug', Shrug, {                        // 17
	description: 'Slash_Shrug_Description',                              // 18
	params: 'your message (optional)'                                    // 19
});                                                                   //
////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////
//                                                                    //
// packages/rocketchat_slashcommands-asciiarts/tableflip.js           //
//                                                                    //
////////////////////////////////////////////////////////////////////////
                                                                      //
/*                                                                    //
* Tableflip is a named function that will replace /Tableflip commands
* @param {Object} message - The message object                        //
*/                                                                    //
                                                                      //
function Tableflip(command, params, item) {                           // 7
	if (command === 'tableflip') {                                       // 8
		var msg;                                                            // 9
                                                                      //
		msg = item;                                                         // 11
		msg.msg = params + ' (╯°□°）╯︵ ┻━┻';                                 // 12
		Meteor.call('sendMessage', msg);                                    // 13
	}                                                                    //
}                                                                     //
                                                                      //
RocketChat.slashCommands.add('tableflip', Tableflip, {                // 17
	description: 'Slash_Tableflip_Description',                          // 18
	params: 'your message (optional)'                                    // 19
});                                                                   //
////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////
//                                                                    //
// packages/rocketchat_slashcommands-asciiarts/unflip.js              //
//                                                                    //
////////////////////////////////////////////////////////////////////////
                                                                      //
/*                                                                    //
* Unflip is a named function that will replace /unflip commands       //
* @param {Object} message - The message object                        //
*/                                                                    //
                                                                      //
function Unflip(command, params, item) {                              // 7
	if (command === 'unflip') {                                          // 8
		var msg;                                                            // 9
                                                                      //
		msg = item;                                                         // 11
		msg.msg = params + ' ┬─┬﻿ ノ( ゜-゜ノ)';                                // 12
		Meteor.call('sendMessage', msg);                                    // 13
	}                                                                    //
}                                                                     //
                                                                      //
RocketChat.slashCommands.add('unflip', Unflip, {                      // 17
	description: 'Slash_TableUnflip_Description',                        // 18
	params: 'your message (optional)'                                    // 19
});                                                                   //
////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:slashcommands-asciiarts'] = {};

})();

//# sourceMappingURL=rocketchat_slashcommands-asciiarts.js.map
