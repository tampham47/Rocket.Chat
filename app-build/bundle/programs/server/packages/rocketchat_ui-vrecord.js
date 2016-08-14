(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var ECMAScript = Package.ecmascript.ECMAScript;
var _ = Package.underscore._;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var babelHelpers = Package['babel-runtime'].babelHelpers;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var Promise = Package.promise.Promise;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/rocketchat_ui-vrecord/server/settings.coffee.js          //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.settings.addGroup('Message', function() {                 // 1
  return this.add('Message_VideoRecorderEnabled', true, {            //
    type: 'boolean',                                                 // 2
    "public": true,                                                  // 2
    i18nDescription: 'Message_VideoRecorderEnabledDescription'       // 2
  });                                                                //
});                                                                  // 1
                                                                     //
///////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/rocketchat_ui-vrecord/loadStylesheet.coffee.js           //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.theme.addPackageAsset(function() {                        // 1
  return Assets.getText('client/vrecord.less');                      // 2
});                                                                  // 1
                                                                     //
///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:ui-vrecord'] = {};

})();

//# sourceMappingURL=rocketchat_ui-vrecord.js.map
