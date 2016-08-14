(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var HTTP = Package.http.HTTP;
var HTTPInternals = Package.http.HTTPInternals;
var ECMAScript = Package.ecmascript.ECMAScript;
var _ = Package.underscore._;
var changeCase = Package['konecty:change-case'].changeCase;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var babelHelpers = Package['babel-runtime'].babelHelpers;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var Promise = Package.promise.Promise;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

/* Package-scope variables */
var __coffeescriptShare, OEmbed;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/rocketchat_oembed/server/server.coffee.js                                                             //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var URL, getCharset, getRelevantHeaders, getRelevantMetaTags, getUrlContent, iconv, ipRangeCheck, querystring, request, toUtf8,        
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
                                                                                                                  //
URL = Npm.require('url');                                                                                         // 1
                                                                                                                  //
querystring = Npm.require('querystring');                                                                         // 1
                                                                                                                  //
request = HTTPInternals.NpmModules.request.module;                                                                // 1
                                                                                                                  //
iconv = Npm.require('iconv-lite');                                                                                // 1
                                                                                                                  //
ipRangeCheck = Npm.require('ip-range-check');                                                                     // 1
                                                                                                                  //
OEmbed = {};                                                                                                      // 1
                                                                                                                  //
getCharset = function(body) {                                                                                     // 1
  var binary, matches;                                                                                            // 11
  binary = body.toString('binary');                                                                               // 11
  matches = binary.match(/<meta\b[^>]*charset=["']?([\w\-]+)/i);                                                  // 11
  if (matches) {                                                                                                  // 13
    return matches[1];                                                                                            // 14
  }                                                                                                               //
  return 'utf-8';                                                                                                 // 15
};                                                                                                                // 10
                                                                                                                  //
toUtf8 = function(body) {                                                                                         // 1
  return iconv.decode(body, getCharset(body));                                                                    // 18
};                                                                                                                // 17
                                                                                                                  //
getUrlContent = function(urlObj, redirectCount, callback) {                                                       // 1
  var chunks, chunksTotalLength, data, headers, ignoredHosts, opts, parsedUrl, ref, ref1, safePorts, stream, url;
  if (redirectCount == null) {                                                                                    //
    redirectCount = 5;                                                                                            //
  }                                                                                                               //
  if (_.isString(urlObj)) {                                                                                       // 21
    urlObj = URL.parse(urlObj);                                                                                   // 22
  }                                                                                                               //
  parsedUrl = _.pick(urlObj, ['host', 'hash', 'pathname', 'protocol', 'port', 'query', 'search', 'hostname']);    // 21
  ignoredHosts = RocketChat.settings.get('API_EmbedIgnoredHosts').replace(/\s/g, '').split(',') || [];            // 21
  if ((ref = parsedUrl.hostname, indexOf.call(ignoredHosts, ref) >= 0) || ipRangeCheck(parsedUrl.hostname, ignoredHosts)) {
    return callback();                                                                                            // 28
  }                                                                                                               //
  safePorts = RocketChat.settings.get('API_EmbedSafePorts').replace(/\s/g, '').split(',') || [];                  // 21
  if (parsedUrl.port && safePorts.length > 0 && (ref1 = parsedUrl.port, indexOf.call(safePorts, ref1) < 0)) {     // 31
    return callback();                                                                                            // 32
  }                                                                                                               //
  data = RocketChat.callbacks.run('oembed:beforeGetUrlContent', {                                                 // 21
    urlObj: urlObj,                                                                                               // 35
    parsedUrl: parsedUrl                                                                                          // 35
  });                                                                                                             //
  if (data.attachments != null) {                                                                                 // 38
    return callback(null, data);                                                                                  // 39
  }                                                                                                               //
  url = URL.format(data.urlObj);                                                                                  // 21
  opts = {                                                                                                        // 21
    url: url,                                                                                                     // 43
    strictSSL: !RocketChat.settings.get('Allow_Invalid_SelfSigned_Certs'),                                        // 43
    gzip: true,                                                                                                   // 43
    maxRedirects: redirectCount,                                                                                  // 43
    headers: {                                                                                                    // 43
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.0 Safari/537.36'
    }                                                                                                             //
  };                                                                                                              //
  headers = null;                                                                                                 // 21
  chunks = [];                                                                                                    // 21
  chunksTotalLength = 0;                                                                                          // 21
  stream = request(opts);                                                                                         // 21
  stream.on('response', function(response) {                                                                      // 21
    if (response.statusCode !== 200) {                                                                            // 56
      return stream.abort();                                                                                      // 57
    }                                                                                                             //
    return headers = response.headers;                                                                            //
  });                                                                                                             //
  stream.on('data', function(chunk) {                                                                             // 21
    chunks.push(chunk);                                                                                           // 61
    chunksTotalLength += chunk.length;                                                                            // 61
    if (chunksTotalLength > 250000) {                                                                             // 63
      return stream.abort();                                                                                      //
    }                                                                                                             //
  });                                                                                                             //
  stream.on('end', Meteor.bindEnvironment(function() {                                                            // 21
    var buffer;                                                                                                   // 67
    buffer = Buffer.concat(chunks);                                                                               // 67
    return callback(null, {                                                                                       //
      headers: headers,                                                                                           // 69
      body: toUtf8(buffer),                                                                                       // 69
      parsedUrl: parsedUrl                                                                                        // 69
    });                                                                                                           //
  }));                                                                                                            //
  return stream.on('error', function(error) {                                                                     //
    return callback(null, {                                                                                       //
      error: error,                                                                                               // 76
      parsedUrl: parsedUrl                                                                                        // 76
    });                                                                                                           //
  });                                                                                                             //
};                                                                                                                // 20
                                                                                                                  //
OEmbed.getUrlMeta = function(url, withFragment) {                                                                 // 1
  var content, data, getUrlContentSync, header, headers, metas, path, queryStringObj, ref, urlObj, value;         // 82
  getUrlContentSync = Meteor.wrapAsync(getUrlContent);                                                            // 82
  urlObj = URL.parse(url);                                                                                        // 82
  if (withFragment != null) {                                                                                     // 86
    queryStringObj = querystring.parse(urlObj.query);                                                             // 87
    queryStringObj._escaped_fragment_ = '';                                                                       // 87
    urlObj.query = querystring.stringify(queryStringObj);                                                         // 87
    path = urlObj.pathname;                                                                                       // 87
    if (urlObj.query != null) {                                                                                   // 92
      path += '?' + urlObj.query;                                                                                 // 93
    }                                                                                                             //
    urlObj.path = path;                                                                                           // 87
  }                                                                                                               //
  content = getUrlContentSync(urlObj, 5);                                                                         // 82
  if (!content) {                                                                                                 // 98
    return;                                                                                                       // 99
  }                                                                                                               //
  if (content.attachments != null) {                                                                              // 101
    return content;                                                                                               // 102
  }                                                                                                               //
  metas = void 0;                                                                                                 // 82
  if ((content != null ? content.body : void 0) != null) {                                                        // 106
    metas = {};                                                                                                   // 107
    content.body.replace(/<title>((.|\n)+?)<\/title>/gmi, function(meta, title) {                                 // 107
      return metas.pageTitle = title;                                                                             //
    });                                                                                                           //
    content.body.replace(/<meta[^>]*(?:name|property)=[']([^']*)['][^>]*content=[']([^']*)['][^>]*>/gmi, function(meta, name, value) {
      return metas[changeCase.camelCase(name)] = value;                                                           //
    });                                                                                                           //
    content.body.replace(/<meta[^>]*(?:name|property)=["]([^"]*)["][^>]*content=["]([^"]*)["][^>]*>/gmi, function(meta, name, value) {
      return metas[changeCase.camelCase(name)] = value;                                                           //
    });                                                                                                           //
    content.body.replace(/<meta[^>]*content=[']([^']*)['][^>]*(?:name|property)=[']([^']*)['][^>]*>/gmi, function(meta, value, name) {
      return metas[changeCase.camelCase(name)] = value;                                                           //
    });                                                                                                           //
    content.body.replace(/<meta[^>]*content=["]([^"]*)["][^>]*(?:name|property)=["]([^"]*)["][^>]*>/gmi, function(meta, value, name) {
      return metas[changeCase.camelCase(name)] = value;                                                           //
    });                                                                                                           //
    if (metas.fragment === '!' && (withFragment == null)) {                                                       // 124
      return OEmbed.getUrlMeta(url, true);                                                                        // 125
    }                                                                                                             //
  }                                                                                                               //
  headers = void 0;                                                                                               // 82
  if ((content != null ? content.headers : void 0) != null) {                                                     // 129
    headers = {};                                                                                                 // 130
    ref = content.headers;                                                                                        // 131
    for (header in ref) {                                                                                         // 131
      value = ref[header];                                                                                        //
      headers[changeCase.camelCase(header)] = value;                                                              // 132
    }                                                                                                             // 131
  }                                                                                                               //
  data = RocketChat.callbacks.run('oembed:afterParseContent', {                                                   // 82
    meta: metas,                                                                                                  // 135
    headers: headers,                                                                                             // 135
    parsedUrl: content.parsedUrl,                                                                                 // 135
    content: content                                                                                              // 135
  });                                                                                                             //
  return data;                                                                                                    // 140
};                                                                                                                // 81
                                                                                                                  //
OEmbed.getUrlMetaWithCache = function(url, withFragment) {                                                        // 1
  var cache, data, e;                                                                                             // 143
  cache = RocketChat.models.OEmbedCache.findOneById(url);                                                         // 143
  if (cache != null) {                                                                                            // 144
    return cache.data;                                                                                            // 145
  }                                                                                                               //
  data = OEmbed.getUrlMeta(url, withFragment);                                                                    // 143
  if (data != null) {                                                                                             // 149
    try {                                                                                                         // 150
      RocketChat.models.OEmbedCache.createWithIdAndData(url, data);                                               // 151
    } catch (_error) {                                                                                            //
      e = _error;                                                                                                 // 153
      console.error('OEmbed duplicated record', url);                                                             // 153
    }                                                                                                             //
    return data;                                                                                                  // 155
  }                                                                                                               //
};                                                                                                                // 142
                                                                                                                  //
getRelevantHeaders = function(headersObj) {                                                                       // 1
  var headers, key, ref, value;                                                                                   // 160
  headers = {};                                                                                                   // 160
  for (key in headersObj) {                                                                                       // 161
    value = headersObj[key];                                                                                      //
    if (((ref = key.toLowerCase()) === 'contenttype' || ref === 'contentlength') && (value != null ? value.trim() : void 0) !== '') {
      headers[key] = value;                                                                                       // 163
    }                                                                                                             //
  }                                                                                                               // 161
  if (Object.keys(headers).length > 0) {                                                                          // 165
    return headers;                                                                                               // 166
  }                                                                                                               //
};                                                                                                                // 159
                                                                                                                  //
getRelevantMetaTags = function(metaObj) {                                                                         // 1
  var key, tags, value;                                                                                           // 170
  tags = {};                                                                                                      // 170
  for (key in metaObj) {                                                                                          // 171
    value = metaObj[key];                                                                                         //
    if (/^(og|fb|twitter|oembed).+|description|title|pageTitle$/.test(key.toLowerCase()) && (value != null ? value.trim() : void 0) !== '') {
      tags[key] = value;                                                                                          // 173
    }                                                                                                             //
  }                                                                                                               // 171
  if (Object.keys(tags).length > 0) {                                                                             // 175
    return tags;                                                                                                  // 176
  }                                                                                                               //
};                                                                                                                // 169
                                                                                                                  //
OEmbed.RocketUrlParser = function(message) {                                                                      // 1
  var attachments, changed;                                                                                       // 180
  if (Array.isArray(message.urls)) {                                                                              // 180
    attachments = [];                                                                                             // 181
    changed = false;                                                                                              // 181
    message.urls.forEach(function(item) {                                                                         // 181
      var data;                                                                                                   // 184
      if (item.ignoreParse === true) {                                                                            // 184
        return;                                                                                                   // 184
      }                                                                                                           //
      if (!/^https?:\/\//i.test(item.url)) {                                                                      // 185
        return;                                                                                                   // 185
      }                                                                                                           //
      data = OEmbed.getUrlMetaWithCache(item.url);                                                                // 184
      if (data != null) {                                                                                         // 189
        if (data.attachments) {                                                                                   // 190
          return attachments = _.union(attachments, data.attachments);                                            //
        } else {                                                                                                  //
          if (data.meta != null) {                                                                                // 193
            item.meta = getRelevantMetaTags(data.meta);                                                           // 194
          }                                                                                                       //
          if (data.headers != null) {                                                                             // 196
            item.headers = getRelevantHeaders(data.headers);                                                      // 197
          }                                                                                                       //
          item.parsedUrl = data.parsedUrl;                                                                        // 193
          return changed = true;                                                                                  //
        }                                                                                                         //
      }                                                                                                           //
    });                                                                                                           //
    if (attachments.length) {                                                                                     // 202
      RocketChat.models.Messages.setMessageAttachments(message._id, attachments);                                 // 203
    }                                                                                                             //
    if (changed === true) {                                                                                       // 205
      RocketChat.models.Messages.setUrlsById(message._id, message.urls);                                          // 206
    }                                                                                                             //
  }                                                                                                               //
  return message;                                                                                                 // 208
};                                                                                                                // 179
                                                                                                                  //
RocketChat.settings.get('API_Embed', function(key, value) {                                                       // 1
  if (value) {                                                                                                    // 211
    return RocketChat.callbacks.add('afterSaveMessage', OEmbed.RocketUrlParser, RocketChat.callbacks.priority.LOW, 'API_Embed');
  } else {                                                                                                        //
    return RocketChat.callbacks.remove('afterSaveMessage', 'API_Embed');                                          //
  }                                                                                                               //
});                                                                                                               // 210
                                                                                                                  //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/rocketchat_oembed/server/providers.coffee.js                                                          //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var Providers, QueryString, URL, providers;                                                                       // 1
                                                                                                                  //
URL = Npm.require('url');                                                                                         // 1
                                                                                                                  //
QueryString = Npm.require('querystring');                                                                         // 1
                                                                                                                  //
Providers = (function() {                                                                                         // 1
  function Providers() {}                                                                                         //
                                                                                                                  //
  Providers.prototype.providers = [];                                                                             // 5
                                                                                                                  //
  Providers.getConsumerUrl = function(provider, url) {                                                            // 5
    var urlObj;                                                                                                   // 8
    urlObj = URL.parse(provider.endPoint, true);                                                                  // 8
    urlObj.query['url'] = url;                                                                                    // 8
    delete urlObj.search;                                                                                         // 8
    return URL.format(urlObj);                                                                                    // 11
  };                                                                                                              //
                                                                                                                  //
  Providers.prototype.registerProvider = function(provider) {                                                     // 5
    return this.providers.push(provider);                                                                         //
  };                                                                                                              //
                                                                                                                  //
  Providers.prototype.getProviders = function() {                                                                 // 5
    return this.providers;                                                                                        // 17
  };                                                                                                              //
                                                                                                                  //
  Providers.prototype.getProviderForUrl = function(url) {                                                         // 5
    return _.find(this.providers, function(provider) {                                                            // 20
      var candidate;                                                                                              // 21
      candidate = _.find(provider.urls, function(re) {                                                            // 21
        return re.test(url);                                                                                      // 22
      });                                                                                                         //
      return candidate != null;                                                                                   // 23
    });                                                                                                           //
  };                                                                                                              //
                                                                                                                  //
  return Providers;                                                                                               //
                                                                                                                  //
})();                                                                                                             //
                                                                                                                  //
providers = new Providers();                                                                                      // 1
                                                                                                                  //
providers.registerProvider({                                                                                      // 1
  urls: [new RegExp('https?://soundcloud.com/\\S+')],                                                             // 27
  endPoint: 'https://soundcloud.com/oembed?format=json&maxheight=150'                                             // 27
});                                                                                                               //
                                                                                                                  //
providers.registerProvider({                                                                                      // 1
  urls: [new RegExp('https?://vimeo.com/[^/]+'), new RegExp('https?://vimeo.com/channels/[^/]+/[^/]+'), new RegExp('https://vimeo.com/groups/[^/]+/videos/[^/]+')],
  endPoint: 'https://vimeo.com/api/oembed.json?maxheight=200'                                                     // 30
});                                                                                                               //
                                                                                                                  //
providers.registerProvider({                                                                                      // 1
  urls: [new RegExp('https?://www.youtube.com/\\S+'), new RegExp('https?://youtu.be/\\S+')],                      // 33
  endPoint: 'https://www.youtube.com/oembed?maxheight=200'                                                        // 33
});                                                                                                               //
                                                                                                                  //
providers.registerProvider({                                                                                      // 1
  urls: [new RegExp('https?://www.rdio.com/\\S+'), new RegExp('https?://rd.io/\\S+')],                            // 36
  endPoint: 'https://www.rdio.com/api/oembed/?format=json&maxheight=150'                                          // 36
});                                                                                                               //
                                                                                                                  //
providers.registerProvider({                                                                                      // 1
  urls: [new RegExp('https?://www.slideshare.net/[^/]+/[^/]+')],                                                  // 39
  endPoint: 'https://www.slideshare.net/api/oembed/2?format=json&maxheight=200'                                   // 39
});                                                                                                               //
                                                                                                                  //
providers.registerProvider({                                                                                      // 1
  urls: [new RegExp('https?://www.dailymotion.com/video/\\S+')],                                                  // 42
  endPoint: 'https://www.dailymotion.com/services/oembed?maxheight=200'                                           // 42
});                                                                                                               //
                                                                                                                  //
RocketChat.oembed = {};                                                                                           // 1
                                                                                                                  //
RocketChat.oembed.providers = providers;                                                                          // 1
                                                                                                                  //
RocketChat.callbacks.add('oembed:beforeGetUrlContent', function(data) {                                           // 1
  var consumerUrl, provider, url;                                                                                 // 49
  if (data.parsedUrl != null) {                                                                                   // 49
    url = URL.format(data.parsedUrl);                                                                             // 50
    provider = providers.getProviderForUrl(url);                                                                  // 50
    if (provider != null) {                                                                                       // 52
      consumerUrl = Providers.getConsumerUrl(provider, url);                                                      // 53
      consumerUrl = URL.parse(consumerUrl, true);                                                                 // 53
      _.extend(data.parsedUrl, consumerUrl);                                                                      // 53
      data.urlObj.port = consumerUrl.port;                                                                        // 53
      data.urlObj.hostname = consumerUrl.hostname;                                                                // 53
      data.urlObj.pathname = consumerUrl.pathname;                                                                // 53
      data.urlObj.query = consumerUrl.query;                                                                      // 53
      delete data.urlObj.search;                                                                                  // 53
    }                                                                                                             //
  }                                                                                                               //
  return data;                                                                                                    // 62
});                                                                                                               // 48
                                                                                                                  //
RocketChat.callbacks.add('oembed:afterParseContent', function(data) {                                             // 1
  var metas, provider, queryString, ref, ref1, url;                                                               // 65
  if (((ref = data.parsedUrl) != null ? ref.query : void 0) != null) {                                            // 65
    queryString = data.parsedUrl.query;                                                                           // 66
    if (_.isString(data.parsedUrl.query)) {                                                                       // 67
      queryString = QueryString.parse(data.parsedUrl.query);                                                      // 68
    }                                                                                                             //
    if (queryString.url != null) {                                                                                // 69
      url = queryString.url;                                                                                      // 70
      provider = providers.getProviderForUrl(url);                                                                // 70
      if (provider != null) {                                                                                     // 72
        if (((ref1 = data.content) != null ? ref1.body : void 0) != null) {                                       // 73
          metas = JSON.parse(data.content.body);                                                                  // 74
          _.each(metas, function(value, key) {                                                                    // 74
            if (_.isString(value)) {                                                                              // 76
              return data.meta[changeCase.camelCase('oembed_' + key)] = value;                                    //
            }                                                                                                     //
          });                                                                                                     //
          data.meta['oembedUrl'] = url;                                                                           // 74
        }                                                                                                         //
      }                                                                                                           //
    }                                                                                                             //
  }                                                                                                               //
  return data;                                                                                                    // 80
});                                                                                                               // 64
                                                                                                                  //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/rocketchat_oembed/server/jumpToMessage.js                                                             //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
/* globals getAvatarUrlFromUsername */                                                                            //
                                                                                                                  //
var URL = Npm.require('url');                                                                                     // 3
var QueryString = Npm.require('querystring');                                                                     // 4
                                                                                                                  //
RocketChat.callbacks.add('beforeSaveMessage', function (msg) {                                                    // 6
	if (msg && msg.urls) {                                                                                           // 7
		msg.urls.forEach(function (item) {                                                                              // 8
			if (item.url.indexOf(Meteor.absoluteUrl()) === 0) {                                                            // 9
				var urlObj = URL.parse(item.url);                                                                             // 10
				if (urlObj.query) {                                                                                           // 11
					var queryString = QueryString.parse(urlObj.query);                                                           // 12
					if (_.isString(queryString.msg)) {                                                                           // 13
						// Jump-to query param                                                                                      //
						var jumpToMessage = RocketChat.models.Messages.findOneById(queryString.msg);                                // 14
						if (jumpToMessage) {                                                                                        // 15
							msg.attachments = msg.attachments || [];                                                                   // 16
							msg.attachments.push({                                                                                     // 17
								'text': jumpToMessage.msg,                                                                                // 18
								'author_name': jumpToMessage.u.username,                                                                  // 19
								'author_icon': getAvatarUrlFromUsername(jumpToMessage.u.username),                                        // 20
								'message_link': item.url,                                                                                 // 21
								'ts': jumpToMessage.ts                                                                                    // 22
							});                                                                                                        //
							item.ignoreParse = true;                                                                                   // 24
						}                                                                                                           //
					}                                                                                                            //
				}                                                                                                             //
			}                                                                                                              //
		});                                                                                                             //
	}                                                                                                                //
	return msg;                                                                                                      // 31
}, RocketChat.callbacks.priority.LOW);                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/rocketchat_oembed/server/models/OEmbedCache.coffee.js                                                 //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;                                                                                    //
                                                                                                                  //
RocketChat.models.OEmbedCache = new ((function(superClass) {                                                      // 1
  extend(_Class, superClass);                                                                                     // 2
                                                                                                                  //
  function _Class() {                                                                                             // 2
    this._initModel('oembed_cache');                                                                              // 3
  }                                                                                                               //
                                                                                                                  //
  _Class.prototype.findOneById = function(_id, options) {                                                         // 2
    var query;                                                                                                    // 8
    query = {                                                                                                     // 8
      _id: _id                                                                                                    // 9
    };                                                                                                            //
    return this.findOne(query, options);                                                                          // 11
  };                                                                                                              //
                                                                                                                  //
  _Class.prototype.createWithIdAndData = function(_id, data) {                                                    // 2
    var record;                                                                                                   // 16
    record = {                                                                                                    // 16
      _id: _id,                                                                                                   // 17
      data: data,                                                                                                 // 17
      updatedAt: new Date                                                                                         // 17
    };                                                                                                            //
    record._id = this.insert(record);                                                                             // 16
    return record;                                                                                                // 22
  };                                                                                                              //
                                                                                                                  //
  return _Class;                                                                                                  //
                                                                                                                  //
})(RocketChat.models._Base));                                                                                     //
                                                                                                                  //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:oembed'] = {
  OEmbed: OEmbed
};

})();

//# sourceMappingURL=rocketchat_oembed.js.map
