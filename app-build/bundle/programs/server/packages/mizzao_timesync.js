(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;

(function(){

//////////////////////////////////////////////////////////////////////////////////
//                                                                              //
// packages/mizzao_timesync/timesync-server.js                                  //
//                                                                              //
//////////////////////////////////////////////////////////////////////////////////
                                                                                //
/* eslint-disable */                                                            // 1
// Use rawConnectHandlers so we get a response as quickly as possible           // 2
// https://github.com/meteor/meteor/blob/devel/packages/webapp/webapp_server.js
                                                                                // 4
var syncUrl = "/_timesync";                                                     // 5
if (__meteor_runtime_config__.ROOT_URL_PATH_PREFIX) {                           // 6
	syncUrl = __meteor_runtime_config__.ROOT_URL_PATH_PREFIX + syncUrl;            // 7
}                                                                               // 8
                                                                                // 9
WebApp.rawConnectHandlers.use(syncUrl,                                          // 10
  function(req, res, next) {                                                    // 11
    // Never ever cache this, otherwise weird times are shown on reload         // 12
    // http://stackoverflow.com/q/18811286/586086                               // 13
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");      // 14
    res.setHeader("Pragma", "no-cache");                                        // 15
    res.setHeader("Expires", 0);                                                // 16
                                                                                // 17
    // Avoid MIME type warnings in browsers                                     // 18
    res.setHeader("Content-Type", "text/plain");                                // 19
                                                                                // 20
    // Cordova lives in meteor.local, so it does CORS                           // 21
    if (req.headers && req.headers.origin === 'http://meteor.local') {          // 22
      res.setHeader('Access-Control-Allow-Origin', 'http://meteor.local');      // 23
    }                                                                           // 24
                                                                                // 25
    res.end(Date.now().toString());                                             // 26
  }                                                                             // 27
);                                                                              // 28
                                                                                // 29
//////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['mizzao:timesync'] = {};

})();

//# sourceMappingURL=mizzao_timesync.js.map
