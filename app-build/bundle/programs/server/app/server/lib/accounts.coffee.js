(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/lib/accounts.coffee.js                                       //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var accountsConfig, resetPasswordHtml, verifyEmailHtml,                // 2
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
                                                                       //
accountsConfig = {                                                     // 2
  forbidClientAccountCreation: true,                                   // 2
  loginExpirationInDays: RocketChat.settings.get('Accounts_LoginExpiration')
};                                                                     //
                                                                       //
Accounts.config(accountsConfig);                                       // 2
                                                                       //
Accounts.emailTemplates.siteName = RocketChat.settings.get('Site_Name');
                                                                       //
Accounts.emailTemplates.from = (RocketChat.settings.get('Site_Name')) + " <" + (RocketChat.settings.get('From_Email')) + ">";
                                                                       //
verifyEmailHtml = Accounts.emailTemplates.verifyEmail.text;            // 2
                                                                       //
Accounts.emailTemplates.verifyEmail.html = function(user, url) {       // 2
  url = url.replace(Meteor.absoluteUrl(), Meteor.absoluteUrl() + 'login/');
  return verifyEmailHtml(user, url);                                   //
};                                                                     // 9
                                                                       //
resetPasswordHtml = Accounts.emailTemplates.resetPassword.text;        // 2
                                                                       //
Accounts.emailTemplates.resetPassword.html = function(user, url) {     // 2
  url = url.replace(/\/#\//, '/');                                     // 15
  return resetPasswordHtml(user, url);                                 //
};                                                                     // 14
                                                                       //
Accounts.emailTemplates.enrollAccount.subject = function(user) {       // 2
  var subject;                                                         // 19
  if (RocketChat.settings.get('Accounts_Enrollment_Customized')) {     // 19
    subject = RocketChat.settings.get('Accounts_Enrollment_Email_Subject');
  } else {                                                             //
    subject = TAPi18n.__('Accounts_Enrollment_Email_Subject_Default', {
      lng: (user != null ? user.language : void 0) || RocketChat.settings.get('language') || 'en'
    });                                                                //
  }                                                                    //
  return RocketChat.placeholders.replace(subject);                     // 24
};                                                                     // 18
                                                                       //
Accounts.emailTemplates.enrollAccount.html = function(user, url) {     // 2
  var footer, header, html, ref, ref1;                                 // 28
  if (RocketChat.settings.get('Accounts_Enrollment_Customized')) {     // 28
    html = RocketChat.settings.get('Accounts_Enrollment_Email');       // 29
  } else {                                                             //
    html = TAPi18n.__('Accounts_Enrollment_Email_Default', {           // 31
      lng: (user != null ? user.language : void 0) || RocketChat.settings.get('language') || 'en'
    });                                                                //
  }                                                                    //
  header = RocketChat.placeholders.replace(RocketChat.settings.get('Email_Header') || "");
  footer = RocketChat.placeholders.replace(RocketChat.settings.get('Email_Footer') || "");
  html = RocketChat.placeholders.replace(html, {                       // 28
    name: user.name,                                                   // 35
    email: (ref = user.emails) != null ? (ref1 = ref[0]) != null ? ref1.address : void 0 : void 0
  });                                                                  //
  return header + html + footer;                                       // 40
};                                                                     // 26
                                                                       //
Accounts.onCreateUser(function(options, user) {                        // 2
  var ref, ref1, ref2, service, serviceName;                           // 47
  RocketChat.callbacks.run('beforeCreateUser', options, user);         // 47
  user.status = 'offline';                                             // 47
  user.active = !RocketChat.settings.get('Accounts_ManuallyApproveNewUsers');
  if (((user != null ? user.name : void 0) == null) || user.name === '') {
    if (((ref = options.profile) != null ? ref.name : void 0) != null) {
      user.name = (ref1 = options.profile) != null ? ref1.name : void 0;
    }                                                                  //
  }                                                                    //
  if (user.services != null) {                                         // 56
    ref2 = user.services;                                              // 57
    for (serviceName in ref2) {                                        // 57
      service = ref2[serviceName];                                     //
      if (((user != null ? user.name : void 0) == null) || user.name === '') {
        if (service.name != null) {                                    // 59
          user.name = service.name;                                    // 60
        } else if (service.username != null) {                         //
          user.name = service.username;                                // 62
        }                                                              //
      }                                                                //
      if ((user.emails == null) && (service.email != null)) {          // 64
        user.emails = [                                                // 65
          {                                                            //
            address: service.email,                                    // 66
            verified: true                                             // 66
          }                                                            //
        ];                                                             //
      }                                                                //
    }                                                                  // 57
  }                                                                    //
  return user;                                                         // 70
});                                                                    // 42
                                                                       //
Accounts.insertUserDoc = _.wrap(Accounts.insertUserDoc, function(insertUserDoc, options, user) {
  var _id, hasAdmin, roles;                                            // 74
  roles = [];                                                          // 74
  if (Match.test(user.globalRoles, [String]) && user.globalRoles.length > 0) {
    roles = roles.concat(user.globalRoles);                            // 76
  }                                                                    //
  delete user.globalRoles;                                             // 74
  if (user.type == null) {                                             //
    user.type = 'user';                                                //
  }                                                                    //
  _id = insertUserDoc.call(Accounts, options, user);                   // 74
  if (roles.length === 0) {                                            // 84
    hasAdmin = RocketChat.models.Users.findOne({                       // 86
      roles: 'admin'                                                   // 86
    }, {                                                               //
      fields: {                                                        // 86
        _id: 1                                                         // 86
      }                                                                //
    });                                                                //
    if (hasAdmin != null) {                                            // 87
      roles.push('user');                                              // 88
    } else {                                                           //
      roles.push('admin');                                             // 90
    }                                                                  //
  }                                                                    //
  RocketChat.authz.addUserRoles(_id, roles);                           // 74
  Meteor.defer(function() {                                            // 74
    return RocketChat.callbacks.run('afterCreateUser', options, user);
  });                                                                  //
  return _id;                                                          // 97
});                                                                    // 73
                                                                       //
Accounts.validateLoginAttempt(function(login) {                        // 2
  var ref, ref1, validEmail;                                           // 100
  login = RocketChat.callbacks.run('beforeValidateLogin', login);      // 100
  if (login.allowed !== true) {                                        // 102
    return login.allowed;                                              // 103
  }                                                                    //
  if (login.user.type === 'visitor') {                                 // 106
    return true;                                                       // 107
  }                                                                    //
  if (!!((ref = login.user) != null ? ref.active : void 0) !== true) {
    throw new Meteor.Error('error-user-is-not-activated', 'User is not activated', {
      "function": 'Accounts.validateLoginAttempt'                      // 110
    });                                                                //
    return false;                                                      // 111
  }                                                                    //
  if (indexOf.call((ref1 = login.user) != null ? ref1.roles : void 0, 'admin') < 0 && login.type === 'password' && RocketChat.settings.get('Accounts_EmailVerification') === true) {
    validEmail = login.user.emails.filter(function(email) {            // 115
      return email.verified === true;                                  // 116
    });                                                                //
    if (validEmail.length === 0) {                                     // 118
      throw new Meteor.Error('error-invalid-email', 'Invalid email __email__');
      return false;                                                    // 120
    }                                                                  //
  }                                                                    //
  RocketChat.models.Users.updateLastLoginById(login.user._id);         // 100
  Meteor.defer(function() {                                            // 100
    return RocketChat.callbacks.run('afterValidateLogin', login);      //
  });                                                                  //
  return true;                                                         // 127
});                                                                    // 99
                                                                       //
Accounts.validateNewUser(function(user) {                              // 2
  var ref;                                                             // 131
  if (user.type === 'visitor') {                                       // 131
    return true;                                                       // 132
  }                                                                    //
  if (RocketChat.settings.get('Accounts_Registration_AuthenticationServices_Enabled') === false && RocketChat.settings.get('LDAP_Enable') === false && (((ref = user.services) != null ? ref.password : void 0) == null)) {
    throw new Meteor.Error('registration-disabled-authentication-services', 'User registration is disabled for authentication services');
  }                                                                    //
  return true;                                                         // 136
});                                                                    // 129
                                                                       //
Accounts.validateNewUser(function(user) {                              // 2
  var domain, domainWhiteList, email, i, len, ref, ret;                // 141
  if (user.type === 'visitor') {                                       // 141
    return true;                                                       // 142
  }                                                                    //
  domainWhiteList = RocketChat.settings.get('Accounts_AllowedDomainsList');
  if (_.isEmpty(s.trim(domainWhiteList))) {                            // 146
    return true;                                                       // 147
  }                                                                    //
  domainWhiteList = _.map(domainWhiteList.split(','), function(domain) {
    return domain.trim();                                              //
  });                                                                  //
  if (((ref = user.emails) != null ? ref.length : void 0) > 0) {       // 151
    ret = false;                                                       // 152
    email = user.emails[0].address;                                    // 152
    for (i = 0, len = domainWhiteList.length; i < len; i++) {          // 154
      domain = domainWhiteList[i];                                     //
      if (email.match('@' + RegExp.escape(domain) + '$')) {            // 155
        ret = true;                                                    // 156
        break;                                                         // 157
      }                                                                //
    }                                                                  // 154
    return ret;                                                        // 159
  }                                                                    //
  return true;                                                         // 161
});                                                                    // 139
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=accounts.coffee.js.map
