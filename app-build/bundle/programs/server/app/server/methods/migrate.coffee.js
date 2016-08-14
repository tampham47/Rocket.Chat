(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/migrate.coffee.js                                    //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  migrateTo: function(version) {                                       // 2
    var user;                                                          // 3
    if (!Meteor.userId()) {                                            // 3
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {   // 4
        method: 'migrateTo'                                            // 4
      });                                                              //
    }                                                                  //
    user = Meteor.user();                                              // 3
    if ((user == null) || RocketChat.authz.hasPermission(user._id, 'run-migration') !== true) {
      throw new Meteor.Error('error-not-allowed', 'Not allowed', {     // 9
        method: 'migrateTo'                                            // 9
      });                                                              //
    }                                                                  //
    this.unblock();                                                    // 3
    RocketChat.Migrations.migrateTo(version);                          // 3
    return version;                                                    // 13
  },                                                                   //
  getMigrationVersion: function() {                                    // 2
    if (!Meteor.userId()) {                                            // 16
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {   // 17
        method: 'getMigrationVersion'                                  // 17
      });                                                              //
    }                                                                  //
    return RocketChat.Migrations.getVersion();                         // 19
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=migrate.coffee.js.map
