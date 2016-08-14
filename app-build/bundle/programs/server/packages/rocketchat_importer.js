(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var ECMAScript = Package.ecmascript.ECMAScript;
var check = Package.check.check;
var Match = Package.check.Match;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var Logger = Package['rocketchat:logger'].Logger;
var babelHelpers = Package['babel-runtime'].babelHelpers;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var Promise = Package.promise.Promise;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

/* Package-scope variables */
var __coffeescriptShare, Importer;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_importer/lib/_importer.coffee.js                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
                                                                                                                      // 1
                                                                                                                      //
Importer = {};                                                                                                        // 1
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_importer/lib/importTool.coffee.js                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Importer.Importers = {};                                                                                              // 1
                                                                                                                      //
Importer.AddImporter = function(name, importer, options) {                                                            // 1
  if (Importer.Importers[name] == null) {                                                                             // 4
    return Importer.Importers[name] = {                                                                               //
      name: options.name,                                                                                             // 6
      importer: importer,                                                                                             // 6
      fileTypeRegex: options.fileTypeRegex,                                                                           // 6
      description: options.description                                                                                // 6
    };                                                                                                                //
  }                                                                                                                   //
};                                                                                                                    // 3
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_importer/server/classes/ImporterBase.coffee.js                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };                                 // 14
                                                                                                                      //
Importer.Base = Importer.Base = (function() {                                                                         // 14
  Base.MaxBSONSize = 8000000;                                                                                         // 15
                                                                                                                      //
  Base.http = Npm.require('http');                                                                                    // 15
                                                                                                                      //
  Base.https = Npm.require('https');                                                                                  // 15
                                                                                                                      //
  Base.getBSONSize = function(object) {                                                                               // 15
    return MongoInternals.NpmModules.mongodb.module.BSON.calculateObjectSize(object);                                 //
  };                                                                                                                  //
                                                                                                                      //
  Base.getBSONSafeArraysFromAnArray = function(theArray) {                                                            // 15
    var BSONSize, i, maxSize, safeArrays;                                                                             // 27
    BSONSize = Importer.Base.getBSONSize(theArray);                                                                   // 27
    maxSize = Math.floor(theArray.length / (Math.ceil(BSONSize / Importer.Base.MaxBSONSize)));                        // 27
    safeArrays = [];                                                                                                  // 27
    i = 0;                                                                                                            // 27
    while (i < theArray.length) {                                                                                     // 31
      safeArrays.push(theArray.slice(i, i += maxSize));                                                               // 32
    }                                                                                                                 //
    return safeArrays;                                                                                                // 33
  };                                                                                                                  //
                                                                                                                      //
  function Base(name, description, fileTypeRegex) {                                                                   // 41
    var importId;                                                                                                     // 42
    this.name = name;                                                                                                 // 42
    this.description = description;                                                                                   // 42
    this.fileTypeRegex = fileTypeRegex;                                                                               // 42
    this.uploadFile = bind(this.uploadFile, this);                                                                    // 42
    this.updateRecord = bind(this.updateRecord, this);                                                                // 42
    this.addCountCompleted = bind(this.addCountCompleted, this);                                                      // 42
    this.addCountToTotal = bind(this.addCountToTotal, this);                                                          // 42
    this.updateProgress = bind(this.updateProgress, this);                                                            // 42
    this.getProgress = bind(this.getProgress, this);                                                                  // 42
    this.getSelection = bind(this.getSelection, this);                                                                // 42
    this.startImport = bind(this.startImport, this);                                                                  // 42
    this.prepare = bind(this.prepare, this);                                                                          // 42
    this.logger = new Logger(this.name + " Importer", {});                                                            // 42
    this.progress = new Importer.Progress(this.name);                                                                 // 42
    this.collection = Importer.RawImports;                                                                            // 42
    this.AdmZip = Npm.require('adm-zip');                                                                             // 42
    importId = Importer.Imports.insert({                                                                              // 42
      'type': this.name,                                                                                              // 46
      'ts': Date.now(),                                                                                               // 46
      'status': this.progress.step,                                                                                   // 46
      'valid': true,                                                                                                  // 46
      'user': Meteor.user()._id                                                                                       // 46
    });                                                                                                               //
    this.importRecord = Importer.Imports.findOne(importId);                                                           // 42
    this.users = {};                                                                                                  // 42
    this.channels = {};                                                                                               // 42
    this.messages = {};                                                                                               // 42
  }                                                                                                                   //
                                                                                                                      //
  Base.prototype.prepare = function(dataURI, sentContentType, fileName) {                                             // 15
    if (!this.fileTypeRegex.test(sentContentType)) {                                                                  // 61
      throw new Error("Invalid file uploaded to import " + this.name + " data from.");                                // 62
    }                                                                                                                 //
    this.updateProgress(Importer.ProgressStep.PREPARING_STARTED);                                                     // 61
    return this.updateRecord({                                                                                        //
      'file': fileName                                                                                                // 65
    });                                                                                                               //
  };                                                                                                                  //
                                                                                                                      //
  Base.prototype.startImport = function(importSelection) {                                                            // 15
    if (importSelection === void 0) {                                                                                 // 75
      throw new Error("No selected users and channel data provided to the " + this.name + " importer.");              // 76
    } else if (importSelection.users === void 0) {                                                                    //
      throw new Error("Users in the selected data wasn't found, it must but at least an empty array for the " + this.name + " importer.");
    } else if (importSelection.channels === void 0) {                                                                 //
      throw new Error("Channels in the selected data wasn't found, it must but at least an empty array for the " + this.name + " importer.");
    }                                                                                                                 //
    return this.updateProgress(Importer.ProgressStep.IMPORTING_STARTED);                                              //
  };                                                                                                                  //
                                                                                                                      //
  Base.prototype.getSelection = function() {                                                                          // 15
    throw new Error("Invalid 'getSelection' called on " + this.name + ", it must be overridden and super can not be called.");
  };                                                                                                                  //
                                                                                                                      //
  Base.prototype.getProgress = function() {                                                                           // 15
    return this.progress;                                                                                             // 95
  };                                                                                                                  //
                                                                                                                      //
  Base.prototype.updateProgress = function(step) {                                                                    // 15
    this.progress.step = step;                                                                                        // 102
    this.logger.debug(this.name + " is now at " + step + ".");                                                        // 102
    this.updateRecord({                                                                                               // 102
      'status': this.progress.step                                                                                    // 105
    });                                                                                                               //
    return this.progress;                                                                                             // 107
  };                                                                                                                  //
                                                                                                                      //
  Base.prototype.addCountToTotal = function(count) {                                                                  // 15
    this.progress.count.total = this.progress.count.total + count;                                                    // 114
    this.updateRecord({                                                                                               // 114
      'count.total': this.progress.count.total                                                                        // 115
    });                                                                                                               //
    return this.progress;                                                                                             // 117
  };                                                                                                                  //
                                                                                                                      //
  Base.prototype.addCountCompleted = function(count) {                                                                // 15
    this.progress.count.completed = this.progress.count.completed + count;                                            // 124
    if ((this.progress.count.completed % 500 === 0) || this.progress.count.completed >= this.progress.count.total) {  // 128
      this.updateRecord({                                                                                             // 129
        'count.completed': this.progress.count.completed                                                              // 129
      });                                                                                                             //
    }                                                                                                                 //
    return this.progress;                                                                                             // 131
  };                                                                                                                  //
                                                                                                                      //
  Base.prototype.updateRecord = function(fields) {                                                                    // 15
    Importer.Imports.update({                                                                                         // 138
      _id: this.importRecord._id                                                                                      // 138
    }, {                                                                                                              //
      $set: fields                                                                                                    // 138
    });                                                                                                               //
    this.importRecord = Importer.Imports.findOne(this.importRecord._id);                                              // 138
    return this.importRecord;                                                                                         // 141
  };                                                                                                                  //
                                                                                                                      //
  Base.prototype.uploadFile = function(details, fileUrl, user, room, timeStamp) {                                     // 15
    var requestModule;                                                                                                // 152
    this.logger.debug("Uploading the file " + details.name + " from " + fileUrl + ".");                               // 152
    requestModule = /https/i.test(fileUrl) ? Importer.Base.https : Importer.Base.http;                                // 152
    return requestModule.get(fileUrl, Meteor.bindEnvironment(function(stream) {                                       //
      var fileId;                                                                                                     // 156
      fileId = Meteor.fileStore.create(details);                                                                      // 156
      if (fileId) {                                                                                                   // 157
        return Meteor.fileStore.write(stream, fileId, function(err, file) {                                           //
          var attachment, msg, ref, url;                                                                              // 159
          if (err) {                                                                                                  // 159
            throw new Error(err);                                                                                     // 160
          } else {                                                                                                    //
            url = file.url.replace(Meteor.absoluteUrl(), '/');                                                        // 162
            attachment = {                                                                                            // 162
              title: "File Uploaded: " + file.name,                                                                   // 165
              title_link: url                                                                                         // 165
            };                                                                                                        //
            if (/^image\/.+/.test(file.type)) {                                                                       // 168
              attachment.image_url = url;                                                                             // 169
              attachment.image_type = file.type;                                                                      // 169
              attachment.image_size = file.size;                                                                      // 169
              attachment.image_dimensions = (ref = file.identify) != null ? ref.size : void 0;                        // 169
            }                                                                                                         //
            if (/^audio\/.+/.test(file.type)) {                                                                       // 174
              attachment.audio_url = url;                                                                             // 175
              attachment.audio_type = file.type;                                                                      // 175
              attachment.audio_size = file.size;                                                                      // 175
            }                                                                                                         //
            if (/^video\/.+/.test(file.type)) {                                                                       // 179
              attachment.video_url = url;                                                                             // 180
              attachment.video_type = file.type;                                                                      // 180
              attachment.video_size = file.size;                                                                      // 180
            }                                                                                                         //
            msg = {                                                                                                   // 162
              rid: details.rid,                                                                                       // 185
              ts: timeStamp,                                                                                          // 185
              msg: '',                                                                                                // 185
              file: {                                                                                                 // 185
                _id: file._id                                                                                         // 189
              },                                                                                                      //
              groupable: false,                                                                                       // 185
              attachments: [attachment]                                                                               // 185
            };                                                                                                        //
            if ((details.message_id != null) && (typeof details.message_id === 'string')) {                           // 193
              msg['_id'] = details.message_id;                                                                        // 194
            }                                                                                                         //
            return RocketChat.sendMessage(user, msg, room, true);                                                     //
          }                                                                                                           //
        });                                                                                                           //
      } else {                                                                                                        //
        return this.logger.error("Failed to create the store for " + fileUrl + "!!!");                                //
      }                                                                                                               //
    }));                                                                                                              //
  };                                                                                                                  //
                                                                                                                      //
  return Base;                                                                                                        //
                                                                                                                      //
})();                                                                                                                 //
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_importer/server/classes/ImporterProgress.coffee.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Importer.Progress = Importer.Progress = (function() {                                                                 // 2
  function Progress(name) {                                                                                           // 7
    this.name = name;                                                                                                 // 8
    this.step = Importer.ProgressStep.NEW;                                                                            // 8
    this.count = {                                                                                                    // 8
      completed: 0,                                                                                                   // 9
      total: 0                                                                                                        // 9
    };                                                                                                                //
  }                                                                                                                   //
                                                                                                                      //
  return Progress;                                                                                                    //
                                                                                                                      //
})();                                                                                                                 //
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_importer/server/classes/ImporterProgressStep.coffee.js                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Importer.ProgressStep = Object.freeze({                                                                               // 2
  NEW: 'importer_new',                                                                                                // 3
  PREPARING_STARTED: 'importer_preparing_started',                                                                    // 3
  PREPARING_USERS: 'importer_preparing_users',                                                                        // 3
  PREPARING_CHANNELS: 'importer_preparing_channels',                                                                  // 3
  PREPARING_MESSAGES: 'importer_preparing_messages',                                                                  // 3
  USER_SELECTION: 'importer_user_selection',                                                                          // 3
  IMPORTING_STARTED: 'importer_importing_started',                                                                    // 3
  IMPORTING_USERS: 'importer_importing_users',                                                                        // 3
  IMPORTING_CHANNELS: 'importer_importing_channels',                                                                  // 3
  IMPORTING_MESSAGES: 'importer_importing_messages',                                                                  // 3
  FINISHING: 'importer_finishing',                                                                                    // 3
  DONE: 'importer_done',                                                                                              // 3
  ERROR: 'importer_import_failed',                                                                                    // 3
  CANCELLED: 'importer_import_cancelled'                                                                              // 3
});                                                                                                                   //
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_importer/server/classes/ImporterSelection.coffee.js                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Importer.Selection = Importer.Selection = (function() {                                                               // 2
  function Selection(name, users, channels) {                                                                         // 9
    this.name = name;                                                                                                 // 9
    this.users = users;                                                                                               // 9
    this.channels = channels;                                                                                         // 9
  }                                                                                                                   //
                                                                                                                      //
  return Selection;                                                                                                   //
                                                                                                                      //
})();                                                                                                                 //
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_importer/server/classes/ImporterSelectionChannel.coffee.js                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Importer.SelectionChannel = Importer.SelectionChannel = (function() {                                                 // 2
  function SelectionChannel(channel_id, name, is_archived, do_import) {                                               // 10
    this.channel_id = channel_id;                                                                                     // 10
    this.name = name;                                                                                                 // 10
    this.is_archived = is_archived;                                                                                   // 10
    this.do_import = do_import;                                                                                       // 10
  }                                                                                                                   //
                                                                                                                      //
  return SelectionChannel;                                                                                            //
                                                                                                                      //
})();                                                                                                                 //
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_importer/server/classes/ImporterSelectionUser.coffee.js                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Importer.SelectionUser = Importer.SelectionUser = (function() {                                                       // 2
  function SelectionUser(user_id, username, email, is_deleted, is_bot, do_import) {                                   // 12
    this.user_id = user_id;                                                                                           // 12
    this.username = username;                                                                                         // 12
    this.email = email;                                                                                               // 12
    this.is_deleted = is_deleted;                                                                                     // 12
    this.is_bot = is_bot;                                                                                             // 12
    this.do_import = do_import;                                                                                       // 12
  }                                                                                                                   //
                                                                                                                      //
  return SelectionUser;                                                                                               //
                                                                                                                      //
})();                                                                                                                 //
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_importer/server/models/Imports.coffee.js                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;                                                                                        //
                                                                                                                      //
Importer.Imports = new (Importer.Imports = (function(superClass) {                                                    // 1
  extend(Imports, superClass);                                                                                        // 2
                                                                                                                      //
  function Imports() {                                                                                                // 2
    this._initModel('import');                                                                                        // 3
  }                                                                                                                   //
                                                                                                                      //
  return Imports;                                                                                                     //
                                                                                                                      //
})(RocketChat.models._Base));                                                                                         //
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_importer/server/models/RawImports.coffee.js                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;                                                                                        //
                                                                                                                      //
Importer.RawImports = new (Importer.RawImports = (function(superClass) {                                              // 1
  extend(RawImports, superClass);                                                                                     // 2
                                                                                                                      //
  function RawImports() {                                                                                             // 2
    this._initModel('raw_imports');                                                                                   // 3
  }                                                                                                                   //
                                                                                                                      //
  return RawImports;                                                                                                  //
                                                                                                                      //
})(RocketChat.models._Base));                                                                                         //
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_importer/server/methods/getImportProgress.coffee.js                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                      // 1
  getImportProgress: function(name) {                                                                                 // 2
    var ref;                                                                                                          // 3
    if (!Meteor.userId()) {                                                                                           // 3
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                  // 4
        method: 'getImportProgress'                                                                                   // 4
      });                                                                                                             //
    }                                                                                                                 //
    if (Importer.Importers[name] != null) {                                                                           // 6
      return (ref = Importer.Importers[name].importerInstance) != null ? ref.getProgress() : void 0;                  // 7
    } else {                                                                                                          //
      throw new Meteor.Error('error-importer-not-defined', 'The importer was not defined correctly, it is missing the Import class.', {
        method: 'getImportProgress'                                                                                   // 9
      });                                                                                                             //
    }                                                                                                                 //
  }                                                                                                                   //
});                                                                                                                   //
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_importer/server/methods/getSelectionData.coffee.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                      // 1
  getSelectionData: function(name) {                                                                                  // 2
    var progress, ref;                                                                                                // 3
    if (!Meteor.userId()) {                                                                                           // 3
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                  // 4
        method: 'getSelectionData'                                                                                    // 4
      });                                                                                                             //
    }                                                                                                                 //
    if (((ref = Importer.Importers[name]) != null ? ref.importerInstance : void 0) != null) {                         // 6
      progress = Importer.Importers[name].importerInstance.getProgress();                                             // 7
      switch (progress.step) {                                                                                        // 8
        case Importer.ProgressStep.USER_SELECTION:                                                                    // 8
          return Importer.Importers[name].importerInstance.getSelection();                                            // 10
        default:                                                                                                      // 8
          return false;                                                                                               // 12
      }                                                                                                               // 8
    } else {                                                                                                          //
      throw new Meteor.Error('error-importer-not-defined', 'The importer was not defined correctly, it is missing the Import class.', {
        method: 'getSelectionData'                                                                                    // 14
      });                                                                                                             //
    }                                                                                                                 //
  }                                                                                                                   //
});                                                                                                                   //
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_importer/server/methods/prepareImport.coffee.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                      // 1
  prepareImport: function(name, dataURI, contentType, fileName) {                                                     // 2
    var ref;                                                                                                          // 3
    if (!Meteor.userId()) {                                                                                           // 3
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                  // 4
        method: 'prepareImport'                                                                                       // 4
      });                                                                                                             //
    }                                                                                                                 //
    if (((ref = Importer.Importers[name]) != null ? ref.importerInstance : void 0) != null) {                         // 6
      return Importer.Importers[name].importerInstance.prepare(dataURI, contentType, fileName);                       //
    } else {                                                                                                          //
      throw new Meteor.Error('error-importer-not-defined', 'The importer was not defined correctly, it is missing the Import class.', {
        method: 'prepareImport'                                                                                       // 9
      });                                                                                                             //
    }                                                                                                                 //
  }                                                                                                                   //
});                                                                                                                   //
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_importer/server/methods/restartImport.coffee.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                      // 1
  restartImport: function(name) {                                                                                     // 2
    var importer;                                                                                                     // 3
    if (!Meteor.userId()) {                                                                                           // 3
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                  // 4
        method: 'restartImport'                                                                                       // 4
      });                                                                                                             //
    }                                                                                                                 //
    if (Importer.Importers[name] != null) {                                                                           // 6
      importer = Importer.Importers[name];                                                                            // 7
      importer.importerInstance.updateProgress(Importer.ProgressStep.CANCELLED);                                      // 7
      importer.importerInstance.updateRecord({                                                                        // 7
        valid: false                                                                                                  // 9
      });                                                                                                             //
      importer.importerInstance = void 0;                                                                             // 7
      importer.importerInstance = new importer.importer(importer.name, importer.description, importer.fileTypeRegex);
      return importer.importerInstance.getProgress();                                                                 // 12
    } else {                                                                                                          //
      throw new Meteor.Error('error-importer-not-defined', 'The importer was not defined correctly, it is missing the Import class.', {
        method: 'restartImport'                                                                                       // 14
      });                                                                                                             //
    }                                                                                                                 //
  }                                                                                                                   //
});                                                                                                                   //
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_importer/server/methods/setupImporter.coffee.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                      // 1
  setupImporter: function(name) {                                                                                     // 2
    var importer, ref;                                                                                                // 3
    if (!Meteor.userId()) {                                                                                           // 3
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                  // 4
        method: 'setupImporter'                                                                                       // 4
      });                                                                                                             //
    }                                                                                                                 //
    if (((ref = Importer.Importers[name]) != null ? ref.importer : void 0) != null) {                                 // 6
      importer = Importer.Importers[name];                                                                            // 7
      if (importer.importerInstance) {                                                                                // 9
        return importer.importerInstance.getProgress();                                                               // 10
      } else {                                                                                                        //
        importer.importerInstance = new importer.importer(importer.name, importer.description, importer.fileTypeRegex);
        return importer.importerInstance.getProgress();                                                               // 13
      }                                                                                                               //
    } else {                                                                                                          //
      console.warn("Tried to setup " + name + " as an importer.");                                                    // 15
      throw new Meteor.Error('error-importer-not-defined', 'The importer was not defined correctly, it is missing the Import class.', {
        method: 'setupImporter'                                                                                       // 16
      });                                                                                                             //
    }                                                                                                                 //
  }                                                                                                                   //
});                                                                                                                   //
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_importer/server/methods/startImport.coffee.js                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                      // 1
  startImport: function(name, input) {                                                                                // 2
    var channelsSelection, ref, selection, usersSelection;                                                            // 4
    if (!Meteor.userId()) {                                                                                           // 4
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                  // 5
        method: 'startImport'                                                                                         // 5
      });                                                                                                             //
    }                                                                                                                 //
    if (((ref = Importer.Importers[name]) != null ? ref.importerInstance : void 0) != null) {                         // 7
      usersSelection = input.users.map(function(user) {                                                               // 8
        return new Importer.SelectionUser(user.user_id, user.username, user.email, user.is_deleted, user.is_bot, user.do_import);
      });                                                                                                             //
      channelsSelection = input.channels.map(function(channel) {                                                      // 8
        return new Importer.SelectionChannel(channel.channel_id, channel.name, channel.is_archived, channel.do_import);
      });                                                                                                             //
      selection = new Importer.Selection(name, usersSelection, channelsSelection);                                    // 8
      return Importer.Importers[name].importerInstance.startImport(selection);                                        //
    } else {                                                                                                          //
      throw new Meteor.Error('error-importer-not-defined', 'The importer was not defined correctly, it is missing the Import class.', {
        method: 'startImport'                                                                                         // 16
      });                                                                                                             //
    }                                                                                                                 //
  }                                                                                                                   //
});                                                                                                                   //
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_importer/server/startup/setImportsToInvalid.coffee.js                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function() {                                                                                           // 1
  Importer.Imports.update({}, {                                                                                       // 4
    $set: {                                                                                                           // 4
      valid: false                                                                                                    // 4
    }                                                                                                                 //
  }, {                                                                                                                //
    multi: true                                                                                                       // 4
  });                                                                                                                 //
  return Importer.Imports.find({                                                                                      //
    valid: {                                                                                                          // 7
      $ne: true                                                                                                       // 7
    }                                                                                                                 //
  }).forEach(function(item) {                                                                                         //
    return Importer.RawImports.remove({                                                                               //
      'import': item._id,                                                                                             // 8
      'importer': item.type                                                                                           // 8
    });                                                                                                               //
  });                                                                                                                 //
});                                                                                                                   // 1
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:importer'] = {
  Importer: Importer
};

})();

//# sourceMappingURL=rocketchat_importer.js.map
