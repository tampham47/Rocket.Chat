(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;
var _ = Package.underscore._;
var EJSON = Package.ejson.EJSON;

/* Package-scope variables */
var HTTP, _methodHTTP, Fiber, runServerMethod;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cfs_http-methods/http.methods.server.api.js                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/*                                                                                                                    // 1
                                                                                                                      // 2
GET /note                                                                                                             // 3
GET /note/:id                                                                                                         // 4
POST /note                                                                                                            // 5
PUT /note/:id                                                                                                         // 6
DELETE /note/:id                                                                                                      // 7
                                                                                                                      // 8
*/                                                                                                                    // 9
HTTP = Package.http && Package.http.HTTP || {};                                                                       // 10
                                                                                                                      // 11
// Primary local test scope                                                                                           // 12
_methodHTTP = {};                                                                                                     // 13
                                                                                                                      // 14
                                                                                                                      // 15
_methodHTTP.methodHandlers = {};                                                                                      // 16
_methodHTTP.methodTree = {};                                                                                          // 17
                                                                                                                      // 18
// This could be changed eg. could allow larger data chunks than 1.000.000                                            // 19
// 5mb = 5 * 1024 * 1024 = 5242880;                                                                                   // 20
HTTP.methodsMaxDataLength = 5242880; //1e6;                                                                           // 21
                                                                                                                      // 22
_methodHTTP.nameFollowsConventions = function(name) {                                                                 // 23
  // Check that name is string, not a falsy or empty                                                                  // 24
  return name && name === '' + name && name !== '';                                                                   // 25
};                                                                                                                    // 26
                                                                                                                      // 27
                                                                                                                      // 28
_methodHTTP.getNameList = function(name) {                                                                            // 29
  // Remove leading and trailing slashes and make command array                                                       // 30
  name = name && name.replace(/^\//g, '') || ''; // /^\/|\/$/g                                                        // 31
  // TODO: Get the format from the url - eg.: "/list/45.json" format should be                                        // 32
  // set in this function by splitting the last list item by . and have format                                        // 33
  // as the last item. How should we toggle:                                                                          // 34
  // "/list/45/item.name.json" and "/list/45/item.name"?                                                              // 35
  // We would either have to check all known formats or allways determin the "."                                      // 36
  // as an extension. Resolving in "json" and "name" as handed format - the user                                      // 37
  // Could simply just add the format as a parametre? or be explicit about                                            // 38
  // naming                                                                                                           // 39
  return name && name.split('/') || [];                                                                               // 40
};                                                                                                                    // 41
                                                                                                                      // 42
// Merge two arrays one containing keys and one values                                                                // 43
_methodHTTP.createObject = function(keys, values) {                                                                   // 44
  var result = {};                                                                                                    // 45
  if (keys && values) {                                                                                               // 46
    for (var i = 0; i < keys.length; i++) {                                                                           // 47
      result[keys[i]] = values[i] && decodeURIComponent(values[i]) || '';                                             // 48
    }                                                                                                                 // 49
  }                                                                                                                   // 50
  return result;                                                                                                      // 51
};                                                                                                                    // 52
                                                                                                                      // 53
_methodHTTP.addToMethodTree = function(methodName) {                                                                  // 54
  var list = _methodHTTP.getNameList(methodName);                                                                     // 55
  var name = '/';                                                                                                     // 56
  // Contains the list of params names                                                                                // 57
  var params = [];                                                                                                    // 58
  var currentMethodTree = _methodHTTP.methodTree;                                                                     // 59
                                                                                                                      // 60
  for (var i = 0; i < list.length; i++) {                                                                             // 61
                                                                                                                      // 62
    // get the key name                                                                                               // 63
    var key = list[i];                                                                                                // 64
    // Check if it expects a value                                                                                    // 65
    if (key[0] === ':') {                                                                                             // 66
      // This is a value                                                                                              // 67
      params.push(key.slice(1));                                                                                      // 68
      key = ':value';                                                                                                 // 69
    }                                                                                                                 // 70
    name += key + '/';                                                                                                // 71
                                                                                                                      // 72
    // Set the key into the method tree                                                                               // 73
    if (typeof currentMethodTree[key] === 'undefined') {                                                              // 74
      currentMethodTree[key] = {};                                                                                    // 75
    }                                                                                                                 // 76
                                                                                                                      // 77
    // Dig deeper                                                                                                     // 78
    currentMethodTree = currentMethodTree[key];                                                                       // 79
                                                                                                                      // 80
  }                                                                                                                   // 81
                                                                                                                      // 82
  if (_.isEmpty(currentMethodTree[':ref'])) {                                                                         // 83
    currentMethodTree[':ref'] = {                                                                                     // 84
      name: name,                                                                                                     // 85
      params: params                                                                                                  // 86
    };                                                                                                                // 87
  }                                                                                                                   // 88
                                                                                                                      // 89
  return currentMethodTree[':ref'];                                                                                   // 90
};                                                                                                                    // 91
                                                                                                                      // 92
// This method should be optimized for speed since its called on allmost every                                        // 93
// http call to the server so we return null as soon as we know its not a method                                      // 94
_methodHTTP.getMethod = function(name) {                                                                              // 95
  // Check if the                                                                                                     // 96
  if (!_methodHTTP.nameFollowsConventions(name)) {                                                                    // 97
    return null;                                                                                                      // 98
  }                                                                                                                   // 99
  var list = _methodHTTP.getNameList(name);                                                                           // 100
  // Check if we got a correct list                                                                                   // 101
  if (!list || !list.length) {                                                                                        // 102
    return null;                                                                                                      // 103
  }                                                                                                                   // 104
  // Set current refernce in the _methodHTTP.methodTree                                                               // 105
  var currentMethodTree = _methodHTTP.methodTree;                                                                     // 106
  // Buffer for values to hand on later                                                                               // 107
  var values = [];                                                                                                    // 108
  // Iterate over the method name and check if its found in the method tree                                           // 109
  for (var i = 0; i < list.length; i++) {                                                                             // 110
    // get the key name                                                                                               // 111
    var key = list[i];                                                                                                // 112
    // We expect to find the key or :value if not we break                                                            // 113
    if (typeof currentMethodTree[key] !== 'undefined' ||                                                              // 114
            typeof currentMethodTree[':value'] !== 'undefined') {                                                     // 115
      // We got a result now check if its a value                                                                     // 116
      if (typeof currentMethodTree[key] === 'undefined') {                                                            // 117
        // Push the value                                                                                             // 118
        values.push(key);                                                                                             // 119
        // Set the key to :value to dig deeper                                                                        // 120
        key = ':value';                                                                                               // 121
      }                                                                                                               // 122
                                                                                                                      // 123
    } else {                                                                                                          // 124
      // Break - method call not found                                                                                // 125
      return null;                                                                                                    // 126
    }                                                                                                                 // 127
                                                                                                                      // 128
    // Dig deeper                                                                                                     // 129
    currentMethodTree = currentMethodTree[key];                                                                       // 130
  }                                                                                                                   // 131
                                                                                                                      // 132
  // Extract reference pointer                                                                                        // 133
  var reference = currentMethodTree && currentMethodTree[':ref'];                                                     // 134
  if (typeof reference !== 'undefined') {                                                                             // 135
    return {                                                                                                          // 136
      name: reference.name,                                                                                           // 137
      params: _methodHTTP.createObject(reference.params, values),                                                     // 138
      handle: _methodHTTP.methodHandlers[reference.name]                                                              // 139
    };                                                                                                                // 140
  } else {                                                                                                            // 141
    // Did not get any reference to the method                                                                        // 142
    return null;                                                                                                      // 143
  }                                                                                                                   // 144
};                                                                                                                    // 145
                                                                                                                      // 146
// This method retrieves the userId from the token and makes sure that the token                                      // 147
// is valid and not expired                                                                                           // 148
_methodHTTP.getUserId = function() {                                                                                  // 149
  var self = this;                                                                                                    // 150
                                                                                                                      // 151
  // // Get ip, x-forwarded-for can be comma seperated ips where the first is the                                     // 152
  // // client ip                                                                                                     // 153
  // var ip = self.req.headers['x-forwarded-for'] &&                                                                  // 154
  //         // Return the first item in ip list                                                                      // 155
  //         self.req.headers['x-forwarded-for'].split(',')[0] ||                                                     // 156
  //         // or return the remoteAddress                                                                           // 157
  //         self.req.connection.remoteAddress;                                                                       // 158
                                                                                                                      // 159
  // Check authentication                                                                                             // 160
  var userToken = self.query.token;                                                                                   // 161
                                                                                                                      // 162
  // Check if we are handed strings                                                                                   // 163
  try {                                                                                                               // 164
    userToken && check(userToken, String);                                                                            // 165
  } catch(err) {                                                                                                      // 166
    throw new Meteor.Error(404, 'Error user token and id not of type strings, Error: ' + (err.stack || err.message));
  }                                                                                                                   // 168
                                                                                                                      // 169
  // Set the this.userId                                                                                              // 170
  if (userToken) {                                                                                                    // 171
    // Look up user to check if user exists and is loggedin via token                                                 // 172
    var user = Meteor.users.findOne({                                                                                 // 173
        $or: [                                                                                                        // 174
          {'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(userToken)},                           // 175
          {'services.resume.loginTokens.token': userToken}                                                            // 176
        ]                                                                                                             // 177
      });                                                                                                             // 178
    // TODO: check 'services.resume.loginTokens.when' to have the token expire                                        // 179
                                                                                                                      // 180
    // Set the userId in the scope                                                                                    // 181
    return user && user._id;                                                                                          // 182
  }                                                                                                                   // 183
                                                                                                                      // 184
  return null;                                                                                                        // 185
};                                                                                                                    // 186
                                                                                                                      // 187
// Expose the default auth for calling from custom authentication handlers.                                           // 188
HTTP.defaultAuth = _methodHTTP.getUserId;                                                                             // 189
                                                                                                                      // 190
/*                                                                                                                    // 191
                                                                                                                      // 192
Add default support for options                                                                                       // 193
                                                                                                                      // 194
*/                                                                                                                    // 195
_methodHTTP.defaultOptionsHandler = function(methodObject) {                                                          // 196
  // List of supported methods                                                                                        // 197
  var allowMethods = [];                                                                                              // 198
  // The final result object                                                                                          // 199
  var result = {};                                                                                                    // 200
                                                                                                                      // 201
  // Iterate over the methods                                                                                         // 202
  // XXX: We should have a way to extend this - We should have some schema model                                      // 203
  // for our methods...                                                                                               // 204
  _.each(methodObject, function(f, methodName) {                                                                      // 205
    // Skip the stream and auth functions - they are not public / accessible                                          // 206
    if (methodName !== 'stream' && methodName !== 'auth') {                                                           // 207
                                                                                                                      // 208
      // Create an empty description                                                                                  // 209
      result[methodName] = { description: '', parameters: {} };                                                       // 210
      // Add method name to headers                                                                                   // 211
      allowMethods.push(methodName);                                                                                  // 212
                                                                                                                      // 213
    }                                                                                                                 // 214
  });                                                                                                                 // 215
                                                                                                                      // 216
  // Lets play nice                                                                                                   // 217
  this.setStatusCode(200);                                                                                            // 218
                                                                                                                      // 219
  // We have to set some allow headers here                                                                           // 220
  this.addHeader('Allow', allowMethods.join(','));                                                                    // 221
                                                                                                                      // 222
  // Return json result - Pretty print                                                                                // 223
  return JSON.stringify(result, null, '\t');                                                                          // 224
};                                                                                                                    // 225
                                                                                                                      // 226
// Public interface for adding server-side http methods - if setting a method to                                      // 227
// 'false' it would actually remove the method (can be used to unpublish a method)                                    // 228
HTTP.methods = function(newMethods) {                                                                                 // 229
  _.each(newMethods, function(func, name) {                                                                           // 230
    if (_methodHTTP.nameFollowsConventions(name)) {                                                                   // 231
      // Check if we got a function                                                                                   // 232
      //if (typeof func === 'function') {                                                                             // 233
        var method = _methodHTTP.addToMethodTree(name);                                                               // 234
        // The func is good                                                                                           // 235
        if (typeof _methodHTTP.methodHandlers[method.name] !== 'undefined') {                                         // 236
          if (func === false) {                                                                                       // 237
            // If the method is set to false then unpublish                                                           // 238
            delete _methodHTTP.methodHandlers[method.name];                                                           // 239
            // Delete the reference in the _methodHTTP.methodTree                                                     // 240
            delete method.name;                                                                                       // 241
            delete method.params;                                                                                     // 242
          } else {                                                                                                    // 243
            // We should not allow overwriting - following Meteor.methods                                             // 244
            throw new Error('HTTP method "' + name + '" is already registered');                                      // 245
          }                                                                                                           // 246
        } else {                                                                                                      // 247
          // We could have a function or a object                                                                     // 248
          // The object could have:                                                                                   // 249
          // '/test/': {                                                                                              // 250
          //   auth: function() ... returning the userId using over default                                           // 251
          //                                                                                                          // 252
          //   method: function() ...                                                                                 // 253
          //   or                                                                                                     // 254
          //   post: function() ...                                                                                   // 255
          //   put:                                                                                                   // 256
          //   get:                                                                                                   // 257
          //   delete:                                                                                                // 258
          //   head:                                                                                                  // 259
          // }                                                                                                        // 260
                                                                                                                      // 261
          /*                                                                                                          // 262
          We conform to the object format:                                                                            // 263
          {                                                                                                           // 264
            auth:                                                                                                     // 265
            post:                                                                                                     // 266
            put:                                                                                                      // 267
            get:                                                                                                      // 268
            delete:                                                                                                   // 269
            head:                                                                                                     // 270
          }                                                                                                           // 271
          This way we have a uniform reference                                                                        // 272
          */                                                                                                          // 273
                                                                                                                      // 274
          var uniObj = {};                                                                                            // 275
          if (typeof func === 'function') {                                                                           // 276
            uniObj = {                                                                                                // 277
              'auth': _methodHTTP.getUserId,                                                                          // 278
              'stream': false,                                                                                        // 279
              'POST': func,                                                                                           // 280
              'PUT': func,                                                                                            // 281
              'GET': func,                                                                                            // 282
              'DELETE': func,                                                                                         // 283
              'HEAD': func,                                                                                           // 284
              'OPTIONS': _methodHTTP.defaultOptionsHandler                                                            // 285
            };                                                                                                        // 286
          } else {                                                                                                    // 287
            uniObj = {                                                                                                // 288
              'stream': func.stream || false,                                                                         // 289
              'auth': func.auth || _methodHTTP.getUserId,                                                             // 290
              'POST': func.post || func.method,                                                                       // 291
              'PUT': func.put || func.method,                                                                         // 292
              'GET': func.get || func.method,                                                                         // 293
              'DELETE': func.delete || func.method,                                                                   // 294
              'HEAD': func.head || func.get || func.method,                                                           // 295
              'OPTIONS': func.options || _methodHTTP.defaultOptionsHandler                                            // 296
            };                                                                                                        // 297
          }                                                                                                           // 298
                                                                                                                      // 299
          // Registre the method                                                                                      // 300
          _methodHTTP.methodHandlers[method.name] = uniObj; // func;                                                  // 301
                                                                                                                      // 302
        }                                                                                                             // 303
      // } else {                                                                                                     // 304
      //   // We do require a function as a function to execute later                                                 // 305
      //   throw new Error('HTTP.methods failed: ' + name + ' is not a function');                                    // 306
      // }                                                                                                            // 307
    } else {                                                                                                          // 308
      // We have to follow the naming spec defined in nameFollowsConventions                                          // 309
      throw new Error('HTTP.method "' + name + '" invalid naming of method');                                         // 310
    }                                                                                                                 // 311
  });                                                                                                                 // 312
};                                                                                                                    // 313
                                                                                                                      // 314
var sendError = function(res, code, message) {                                                                        // 315
  if (code) {                                                                                                         // 316
    res.writeHead(code);                                                                                              // 317
  } else {                                                                                                            // 318
    res.writeHead(500);                                                                                               // 319
  }                                                                                                                   // 320
  res.end(message);                                                                                                   // 321
};                                                                                                                    // 322
                                                                                                                      // 323
// This handler collects the header data into either an object (if json) or the                                       // 324
// raw data. The data is passed to the callback                                                                       // 325
var requestHandler = function(req, res, callback) {                                                                   // 326
  if (typeof callback !== 'function') {                                                                               // 327
    return null;                                                                                                      // 328
  }                                                                                                                   // 329
                                                                                                                      // 330
  // Container for buffers and a sum of the length                                                                    // 331
  var bufferData = [], dataLen = 0;                                                                                   // 332
                                                                                                                      // 333
  // Extract the body                                                                                                 // 334
  req.on('data', function(data) {                                                                                     // 335
    bufferData.push(data);                                                                                            // 336
    dataLen += data.length;                                                                                           // 337
                                                                                                                      // 338
    // We have to check the data length in order to spare the server                                                  // 339
    if (dataLen > HTTP.methodsMaxDataLength) {                                                                        // 340
      dataLen = 0;                                                                                                    // 341
      bufferData = [];                                                                                                // 342
      // Flood attack or faulty client                                                                                // 343
      sendError(res, 413, 'Flood attack or faulty client');                                                           // 344
      req.connection.destroy();                                                                                       // 345
    }                                                                                                                 // 346
  });                                                                                                                 // 347
                                                                                                                      // 348
  // When message is ready to be passed on                                                                            // 349
  req.on('end', function() {                                                                                          // 350
    if (res.finished) {                                                                                               // 351
      return;                                                                                                         // 352
    }                                                                                                                 // 353
                                                                                                                      // 354
    // Allow the result to be undefined if so                                                                         // 355
    var result;                                                                                                       // 356
                                                                                                                      // 357
    // If data found the work it - either buffer or json                                                              // 358
    if (dataLen > 0) {                                                                                                // 359
      result = new Buffer(dataLen);                                                                                   // 360
      // Merge the chunks into one buffer                                                                             // 361
      for (var i = 0, ln = bufferData.length, pos = 0; i < ln; i++) {                                                 // 362
        bufferData[i].copy(result, pos);                                                                              // 363
        pos += bufferData[i].length;                                                                                  // 364
        delete bufferData[i];                                                                                         // 365
      }                                                                                                               // 366
      // Check if we could be dealing with json                                                                       // 367
      if (result[0] == 0x7b && result[1] === 0x22) {                                                                  // 368
        try {                                                                                                         // 369
          // Convert the body into json and extract the data object                                                   // 370
          result = EJSON.parse(result.toString());                                                                    // 371
        } catch(err) {                                                                                                // 372
          // Could not parse so we return the raw data                                                                // 373
        }                                                                                                             // 374
      }                                                                                                               // 375
    } // Else result will be undefined                                                                                // 376
                                                                                                                      // 377
    try {                                                                                                             // 378
      callback(result);                                                                                               // 379
    } catch(err) {                                                                                                    // 380
      sendError(res, 500, 'Error in requestHandler callback, Error: ' + (err.stack || err.message) );                 // 381
    }                                                                                                                 // 382
  });                                                                                                                 // 383
                                                                                                                      // 384
};                                                                                                                    // 385
                                                                                                                      // 386
// This is the simplest handler - it simply passes req stream as data to the                                          // 387
// method                                                                                                             // 388
var streamHandler = function(req, res, callback) {                                                                    // 389
  try {                                                                                                               // 390
    callback();                                                                                                       // 391
  } catch(err) {                                                                                                      // 392
    sendError(res, 500, 'Error in requestHandler callback, Error: ' + (err.stack || err.message) );                   // 393
  }                                                                                                                   // 394
};                                                                                                                    // 395
                                                                                                                      // 396
/*                                                                                                                    // 397
  Allow file uploads in cordova cfs                                                                                   // 398
*/                                                                                                                    // 399
var setCordovaHeaders = function(request, response) {                                                                 // 400
  var origin = request.headers.origin;                                                                                // 401
  // Match http://localhost:<port> for Cordova clients in Meteor 1.3                                                  // 402
  // and http://meteor.local for earlier versions                                                                     // 403
  if (origin && (origin === 'http://meteor.local' || /^http:\/\/localhost/.test(origin))) {                           // 404
    // We need to echo the origin provided in the request                                                             // 405
    response.setHeader("Access-Control-Allow-Origin", origin);                                                        // 406
                                                                                                                      // 407
    response.setHeader("Access-Control-Allow-Methods", "PUT");                                                        // 408
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");                                               // 409
  }                                                                                                                   // 410
};                                                                                                                    // 411
                                                                                                                      // 412
// Handle the actual connection                                                                                       // 413
WebApp.connectHandlers.use(function(req, res, next) {                                                                 // 414
                                                                                                                      // 415
  // Check to se if this is a http method call                                                                        // 416
  var method = _methodHTTP.getMethod(req._parsedUrl.pathname);                                                        // 417
                                                                                                                      // 418
  // If method is null then it wasn't and we pass the request along                                                   // 419
  if (method === null) {                                                                                              // 420
    return next();                                                                                                    // 421
  }                                                                                                                   // 422
                                                                                                                      // 423
  var dataHandle = (method.handle && method.handle.stream)?streamHandler:requestHandler;                              // 424
                                                                                                                      // 425
  dataHandle(req, res, function(data) {                                                                               // 426
    // If methodsHandler not found or somehow the methodshandler is not a                                             // 427
    // function then return a 404                                                                                     // 428
    if (typeof method.handle === 'undefined') {                                                                       // 429
      sendError(res, 404, 'Error HTTP method handler "' + method.name + '" is not found');                            // 430
      return;                                                                                                         // 431
    }                                                                                                                 // 432
                                                                                                                      // 433
    // Set CORS headers for Meteor Cordova clients                                                                    // 434
    setCordovaHeaders(req, res);                                                                                      // 435
                                                                                                                      // 436
    // Set fiber scope                                                                                                // 437
    var fiberScope = {                                                                                                // 438
      // Pointers to Request / Response                                                                               // 439
      req: req,                                                                                                       // 440
      res: res,                                                                                                       // 441
      // Request / Response helpers                                                                                   // 442
      statusCode: 200,                                                                                                // 443
      method: req.method,                                                                                             // 444
      // Headers for response                                                                                         // 445
      headers: {                                                                                                      // 446
        'Content-Type': 'text/html'  // Set default type                                                              // 447
      },                                                                                                              // 448
      // Arguments                                                                                                    // 449
      data: data,                                                                                                     // 450
      query: req.query,                                                                                               // 451
      params: method.params,                                                                                          // 452
      // Method reference                                                                                             // 453
      reference: method.name,                                                                                         // 454
      methodObject: method.handle,                                                                                    // 455
      _streamsWaiting: 0                                                                                              // 456
    };                                                                                                                // 457
                                                                                                                      // 458
    // Helper functions this scope                                                                                    // 459
    Fiber = Npm.require('fibers');                                                                                    // 460
    runServerMethod = Fiber(function(self) {                                                                          // 461
      var result, resultBuffer;                                                                                       // 462
                                                                                                                      // 463
      // We fetch methods data from methodsHandler, the handler uses the this.addItem()                               // 464
      // function to populate the methods, this way we have better check control and                                  // 465
      // better error handling + messages                                                                             // 466
                                                                                                                      // 467
      // The scope for the user methodObject callbacks                                                                // 468
      var thisScope = {                                                                                               // 469
        // The user whos id and token was used to run this method, if set/found                                       // 470
        userId: null,                                                                                                 // 471
        // The id of the data                                                                                         // 472
        _id: null,                                                                                                    // 473
        // Set the query params ?token=1&id=2 -> { token: 1, id: 2 }                                                  // 474
        query: self.query,                                                                                            // 475
        // Set params /foo/:name/test/:id -> { name: '', id: '' }                                                     // 476
        params: self.params,                                                                                          // 477
        // Method GET, PUT, POST, DELETE, HEAD                                                                        // 478
        method: self.method,                                                                                          // 479
        // User agent                                                                                                 // 480
        userAgent: req.headers['user-agent'],                                                                         // 481
        // All request headers                                                                                        // 482
        requestHeaders: req.headers,                                                                                  // 483
        // Add the request object it self                                                                             // 484
        request: req,                                                                                                 // 485
        // Set the userId                                                                                             // 486
        setUserId: function(id) {                                                                                     // 487
          this.userId = id;                                                                                           // 488
        },                                                                                                            // 489
        // We dont simulate / run this on the client at the moment                                                    // 490
        isSimulation: false,                                                                                          // 491
        // Run the next method in a new fiber - This is default at the moment                                         // 492
        unblock: function() {},                                                                                       // 493
        // Set the content type in header, defaults to text/html?                                                     // 494
        setContentType: function(type) {                                                                              // 495
          self.headers['Content-Type'] = type;                                                                        // 496
        },                                                                                                            // 497
        setStatusCode: function(code) {                                                                               // 498
          self.statusCode = code;                                                                                     // 499
        },                                                                                                            // 500
        addHeader: function(key, value) {                                                                             // 501
          self.headers[key] = value;                                                                                  // 502
        },                                                                                                            // 503
        createReadStream: function() {                                                                                // 504
          self._streamsWaiting++;                                                                                     // 505
          return req;                                                                                                 // 506
        },                                                                                                            // 507
        createWriteStream: function() {                                                                               // 508
          self._streamsWaiting++;                                                                                     // 509
          return res;                                                                                                 // 510
        },                                                                                                            // 511
        Error: function(err) {                                                                                        // 512
                                                                                                                      // 513
          if (err instanceof Meteor.Error) {                                                                          // 514
            // Return controlled error                                                                                // 515
            sendError(res, err.error, err.message);                                                                   // 516
          } else if (err instanceof Error) {                                                                          // 517
            // Return error trace - this is not intented                                                              // 518
            sendError(res, 503, 'Error in method "' + self.reference + '", Error: ' + (err.stack || err.message) );   // 519
          } else {                                                                                                    // 520
            sendError(res, 503, 'Error in method "' + self.reference + '"' );                                         // 521
          }                                                                                                           // 522
                                                                                                                      // 523
        },                                                                                                            // 524
        // getData: function() {                                                                                      // 525
        //   // XXX: TODO if we could run the request handler stuff eg.                                               // 526
        //   // in here in a fiber sync it could be cool - and the user did                                           // 527
        //   // not have to specify the stream=true flag?                                                             // 528
        // }                                                                                                          // 529
      };                                                                                                              // 530
                                                                                                                      // 531
      // This function sends the final response. Depending on the                                                     // 532
      // timing of the streaming, we might have to wait for all                                                       // 533
      // streaming to end, or we might have to wait for this function                                                 // 534
      // to finish after streaming ends. The checks in this function                                                  // 535
      // and the fact that we call it twice ensure that we will always                                                // 536
      // send the response if we haven't sent an error response, but                                                  // 537
      // we will not send it too early.                                                                               // 538
      function sendResponseIfDone() {                                                                                 // 539
        res.statusCode = self.statusCode;                                                                             // 540
        // If no streams are waiting                                                                                  // 541
        if (self._streamsWaiting === 0 &&                                                                             // 542
            (self.statusCode === 200 || self.statusCode === 206) &&                                                   // 543
            self.done &&                                                                                              // 544
            !self._responseSent &&                                                                                    // 545
            !res.finished) {                                                                                          // 546
          self._responseSent = true;                                                                                  // 547
          res.end(resultBuffer);                                                                                      // 548
        }                                                                                                             // 549
      }                                                                                                               // 550
                                                                                                                      // 551
      var methodCall = self.methodObject[self.method];                                                                // 552
                                                                                                                      // 553
      // If the method call is set for the POST/PUT/GET or DELETE then run the                                        // 554
      // respective methodCall if its a function                                                                      // 555
      if (typeof methodCall === 'function') {                                                                         // 556
                                                                                                                      // 557
        // Get the userId - This is either set as a method specific handler and                                       // 558
        // will allways default back to the builtin getUserId handler                                                 // 559
        try {                                                                                                         // 560
          // Try to set the userId                                                                                    // 561
          thisScope.userId = self.methodObject.auth.apply(self);                                                      // 562
        } catch(err) {                                                                                                // 563
          sendError(res, err.error, (err.message || err.stack));                                                      // 564
          return;                                                                                                     // 565
        }                                                                                                             // 566
                                                                                                                      // 567
        // This must be attached before there's any chance of `createReadStream`                                      // 568
        // or `createWriteStream` being called, which means before we do                                              // 569
        // `methodCall.apply` below.                                                                                  // 570
        req.on('end', function() {                                                                                    // 571
          self._streamsWaiting--;                                                                                     // 572
          sendResponseIfDone();                                                                                       // 573
        });                                                                                                           // 574
                                                                                                                      // 575
        // Get the result of the methodCall                                                                           // 576
        try {                                                                                                         // 577
          if (self.method === 'OPTIONS') {                                                                            // 578
            result = methodCall.apply(thisScope, [self.methodObject]) || '';                                          // 579
          } else {                                                                                                    // 580
            result = methodCall.apply(thisScope, [self.data]) || '';                                                  // 581
          }                                                                                                           // 582
        } catch(err) {                                                                                                // 583
          if (err instanceof Meteor.Error) {                                                                          // 584
            // Return controlled error                                                                                // 585
            sendError(res, err.error, err.message);                                                                   // 586
          } else {                                                                                                    // 587
            // Return error trace - this is not intented                                                              // 588
            sendError(res, 503, 'Error in method "' + self.reference + '", Error: ' + (err.stack || err.message) );   // 589
          }                                                                                                           // 590
          return;                                                                                                     // 591
        }                                                                                                             // 592
                                                                                                                      // 593
        // Set headers                                                                                                // 594
        _.each(self.headers, function(value, key) {                                                                   // 595
          // If value is defined then set the header, this allows for unsetting                                       // 596
          // the default content-type                                                                                 // 597
          if (typeof value !== 'undefined')                                                                           // 598
            res.setHeader(key, value);                                                                                // 599
        });                                                                                                           // 600
                                                                                                                      // 601
        // If OK / 200 then Return the result                                                                         // 602
        if (self.statusCode === 200 || self.statusCode === 206) {                                                     // 603
                                                                                                                      // 604
          if (self.method !== "HEAD") {                                                                               // 605
            // Return result                                                                                          // 606
            if (typeof result === 'string') {                                                                         // 607
              resultBuffer = new Buffer(result);                                                                      // 608
            } else {                                                                                                  // 609
              resultBuffer = new Buffer(JSON.stringify(result));                                                      // 610
            }                                                                                                         // 611
                                                                                                                      // 612
            // Check if user wants to overwrite content length for some reason?                                       // 613
            if (typeof self.headers['Content-Length'] === 'undefined') {                                              // 614
              self.headers['Content-Length'] = resultBuffer.length;                                                   // 615
            }                                                                                                         // 616
                                                                                                                      // 617
          }                                                                                                           // 618
                                                                                                                      // 619
          self.done = true;                                                                                           // 620
          sendResponseIfDone();                                                                                       // 621
                                                                                                                      // 622
        } else {                                                                                                      // 623
          // Allow user to alter the status code and send a message                                                   // 624
          sendError(res, self.statusCode, result);                                                                    // 625
        }                                                                                                             // 626
                                                                                                                      // 627
      } else {                                                                                                        // 628
        sendError(res, 404, 'Service not found');                                                                     // 629
      }                                                                                                               // 630
                                                                                                                      // 631
                                                                                                                      // 632
    });                                                                                                               // 633
    // Run http methods handler                                                                                       // 634
    try {                                                                                                             // 635
      runServerMethod.run(fiberScope);                                                                                // 636
    } catch(err) {                                                                                                    // 637
      sendError(res, 500, 'Error running the server http method handler, Error: ' + (err.stack || err.message));      // 638
    }                                                                                                                 // 639
                                                                                                                      // 640
  }); // EO Request handler                                                                                           // 641
                                                                                                                      // 642
                                                                                                                      // 643
});                                                                                                                   // 644
                                                                                                                      // 645
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['cfs:http-methods'] = {
  HTTP: HTTP,
  _methodHTTP: _methodHTTP
};

})();

//# sourceMappingURL=cfs_http-methods.js.map
