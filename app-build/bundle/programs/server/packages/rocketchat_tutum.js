(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/rocketchat_tutum/startup.coffee.js                                                          //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
                                                                                                        // 1
/* Examples                                                                                             // 1
                                                                                                        //
DOCKERCLOUD_REDIS_HOST=redis://:password@host:6379                                                      //
DOCKERCLOUD_CLIENT_NAME=mywebsite                                                                       //
DOCKERCLOUD_CLIENT_HOST=mywebsite.dotcloud.com                                                          //
 */                                                                                                     //
var client, port, redis;                                                                                // 1
                                                                                                        //
if (process.env.DOCKERCLOUD_REDIS_HOST != null) {                                                       // 8
  redis = Npm.require('redis');                                                                         // 9
  client = redis.createClient(process.env.DOCKERCLOUD_REDIS_HOST);                                      // 9
  client.on('error', function(err) {                                                                    // 9
    return console.log('Redis error ->', err);                                                          //
  });                                                                                                   //
  client.del("frontend:" + process.env.DOCKERCLOUD_CLIENT_HOST);                                        // 9
  client.rpush("frontend:" + process.env.DOCKERCLOUD_CLIENT_HOST, process.env.DOCKERCLOUD_CLIENT_NAME);
  port = process.env.PORT || 3000;                                                                      // 9
  client.rpush("frontend:" + process.env.DOCKERCLOUD_CLIENT_HOST, "http://" + (process.env.DOCKERCLOUD_IP_ADDRESS.split('/')[0]) + ":" + port);
  process.on('SIGTERM', function() {                                                                    // 9
    return client.expire("frontend:" + process.env.DOCKERCLOUD_CLIENT_HOST, 90);                        //
  });                                                                                                   //
  process.on('SIGINT', function() {                                                                     // 9
    return client.expire("frontend:" + process.env.DOCKERCLOUD_CLIENT_HOST, 90);                        //
  });                                                                                                   //
}                                                                                                       //
                                                                                                        //
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:tutum'] = {};

})();

//# sourceMappingURL=rocketchat_tutum.js.map
