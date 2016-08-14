(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/messageSearch.coffee.js                              //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  messageSearch: function(text, rid, limit) {                          // 2
    var from, mention, options, query, r, result;                      // 3
    if (!Meteor.userId()) {                                            // 3
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {   // 4
        method: 'messageSearch'                                        // 4
      });                                                              //
    }                                                                  //
                                                                       // 6
    /*                                                                 // 6
    			text = 'from:rodrigo mention:gabriel chat'                      //
     */                                                                //
    result = {                                                         // 3
      messages: [],                                                    // 11
      users: [],                                                       // 11
      channels: []                                                     // 11
    };                                                                 //
    query = {};                                                        // 3
    options = {                                                        // 3
      sort: {                                                          // 17
        ts: -1                                                         // 18
      },                                                               //
      limit: limit || 20                                               // 17
    };                                                                 //
    from = [];                                                         // 3
    text = text.replace(/from:([a-z0-9.-_]+)/ig, function(match, username, index) {
      from.push(username);                                             // 24
      return '';                                                       // 25
    });                                                                //
    if (from.length > 0) {                                             // 27
      query['u.username'] = {                                          // 28
        $regex: from.join('|'),                                        // 29
        $options: 'i'                                                  // 29
      };                                                               //
    }                                                                  //
    mention = [];                                                      // 3
    text = text.replace(/mention:([a-z0-9.-_]+)/ig, function(match, username, index) {
      mention.push(username);                                          // 36
      return '';                                                       // 37
    });                                                                //
    if (mention.length > 0) {                                          // 39
      query['mentions.username'] = {                                   // 40
        $regex: mention.join('|'),                                     // 41
        $options: 'i'                                                  // 41
      };                                                               //
    }                                                                  //
    text = text.trim().replace(/\s\s/g, ' ');                          // 3
    if (text !== '') {                                                 // 47
      if (/^\/.+\/[imxs]*$/.test(text)) {                              // 49
        r = text.split('/');                                           // 50
        query.msg = {                                                  // 50
          $regex: r[1],                                                // 52
          $options: r[2]                                               // 52
        };                                                             //
      } else if (RocketChat.settings.get('Message_AlwaysSearchRegExp')) {
        query.msg = {                                                  // 55
          $regex: text,                                                // 56
          $options: 'i'                                                // 56
        };                                                             //
      } else {                                                         //
        query.$text = {                                                // 59
          $search: text                                                // 60
        };                                                             //
        options.fields = {                                             // 59
          score: {                                                     // 62
            $meta: "textScore"                                         // 63
          }                                                            //
        };                                                             //
      }                                                                //
    }                                                                  //
    if (Object.keys(query).length > 0) {                               // 69
      query.t = {                                                      // 70
        $ne: 'rm'                                                      // 70
      };                                                               //
      query._hidden = {                                                // 70
        $ne: true                                                      // 71
      };                                                               //
      if (rid != null) {                                               // 74
        query.rid = rid;                                               // 75
        try {                                                          // 76
          if (Meteor.call('canAccessRoom', rid, this.userId) !== false) {
            if (!RocketChat.settings.get('Message_ShowEditedStatus')) {
              options.fields = {                                       // 79
                'editedAt': 0                                          // 79
              };                                                       //
            }                                                          //
            result.messages = RocketChat.models.Messages.find(query, options).fetch();
          }                                                            //
        } catch (_error) {}                                            //
      }                                                                //
    }                                                                  //
    return result;                                                     // 130
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=messageSearch.coffee.js.map
