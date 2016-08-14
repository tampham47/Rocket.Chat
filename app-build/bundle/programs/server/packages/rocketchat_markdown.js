(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var s = Package['underscorestring:underscore.string'].s;
var hljs = Package['simple:highlight.js'].hljs;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/rocketchat_markdown/settings.coffee.js                                                      //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function() {                                                                             // 1
  RocketChat.settings.add('Markdown_Headers', false, {                                                  // 2
    type: 'boolean',                                                                                    // 2
    group: 'Message',                                                                                   // 2
    section: 'Markdown',                                                                                // 2
    "public": true                                                                                      // 2
  });                                                                                                   //
  return RocketChat.settings.add('Markdown_SupportSchemesForLink', 'http,https', {                      //
    type: 'string',                                                                                     // 3
    group: 'Message',                                                                                   // 3
    section: 'Markdown',                                                                                // 3
    "public": true,                                                                                     // 3
    i18nDescription: 'Markdown_SupportSchemesForLink_Description'                                       // 3
  });                                                                                                   //
});                                                                                                     // 1
                                                                                                        //
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/rocketchat_markdown/markdown.coffee.js                                                      //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
                                                                                                        // 1
/*                                                                                                      // 1
 * Markdown is a named function that will parse markdown syntax                                         //
 * @param {Object} message - The message object                                                         //
 */                                                                                                     //
var Markdown;                                                                                           // 1
                                                                                                        //
Markdown = (function() {                                                                                // 1
  function Markdown(message) {                                                                          // 7
    var msg, schemes;                                                                                   // 8
    msg = message;                                                                                      // 8
    if (!_.isString(message)) {                                                                         // 10
      if (_.trim(message != null ? message.html : void 0)) {                                            // 11
        msg = message.html;                                                                             // 12
      } else {                                                                                          //
        return message;                                                                                 // 14
      }                                                                                                 //
    }                                                                                                   //
    schemes = RocketChat.settings.get('Markdown_SupportSchemesForLink').split(',').join('|');           // 8
    msg = msg.replace(new RegExp("!\\[([^\\]]+)\\]\\(((?:" + schemes + "):\\/\\/[^\\)]+)\\)", 'gm'), '<a href="$2" title="$1" class="swipebox" target="_blank"><div class="inline-image" style="background-image: url($2);"></div></a>');
    msg = msg.replace(new RegExp("\\[([^\\]]+)\\]\\(((?:" + schemes + "):\\/\\/[^\\)]+)\\)", 'gm'), '<a href="$2" target="_blank">$1</a>');
    msg = msg.replace(new RegExp("(?:<|&lt;)((?:" + schemes + "):\\/\\/[^\\|]+)\\|(.+?)(?=>|&gt;)(?:>|&gt;)", 'gm'), '<a href="$1" target="_blank">$2</a>');
    if (RocketChat.settings.get('Markdown_Headers')) {                                                  // 27
      msg = msg.replace(/^# (([\S\w\d-_\/\*\.,\\][ \u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]?)+)/gm, '<h1>$1</h1>');
      msg = msg.replace(/^## (([\S\w\d-_\/\*\.,\\][ \u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]?)+)/gm, '<h2>$1</h2>');
      msg = msg.replace(/^### (([\S\w\d-_\/\*\.,\\][ \u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]?)+)/gm, '<h3>$1</h3>');
      msg = msg.replace(/^#### (([\S\w\d-_\/\*\.,\\][ \u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]?)+)/gm, '<h4>$1</h4>');
    }                                                                                                   //
    msg = msg.replace(/(^|&gt;|[ >_~`])\*{1,2}([^\*\r\n]+)\*{1,2}([<_~`]|\B|\b|$)/gm, '$1<span class="copyonly">*</span><strong>$2</strong><span class="copyonly">*</span>$3');
    msg = msg.replace(/(^|&gt;|[ >*~`])\_([^\_\r\n]+)\_([<*~`]|\B|\b|$)/gm, '$1<span class="copyonly">_</span><em>$2</em><span class="copyonly">_</span>$3');
    msg = msg.replace(/(^|&gt;|[ >_*`])\~{1,2}([^~\r\n]+)\~{1,2}([<_*`]|\B|\b|$)/gm, '$1<span class="copyonly">~</span><strike>$2</strike><span class="copyonly">~</span>$3');
    msg = msg.replace(/(?:&gt;){3}\n+([\s\S]*?)\n+(?:&lt;){3}/g, '<blockquote><span class="copyonly">&gt;&gt;&gt;</span>$1<span class="copyonly">&lt;&lt;&lt;</span></blockquote>');
    msg = msg.replace(/^&gt;(.*)$/gm, '<blockquote><span class="copyonly">&gt;</span>$1</blockquote>');
    msg = msg.replace(/\s*<blockquote>/gm, '<blockquote>');                                             // 8
    msg = msg.replace(/<\/blockquote>\s*/gm, '</blockquote>');                                          // 8
    msg = msg.replace(/<\/blockquote>\n<blockquote>/gm, '</blockquote><blockquote>');                   // 8
    if (!_.isString(message)) {                                                                         // 65
      message.html = msg;                                                                               // 66
    } else {                                                                                            //
      message = msg;                                                                                    // 68
    }                                                                                                   //
    if (typeof window !== "undefined" && window !== null ? window.rocketDebug : void 0) {               // 70
      console.log('Markdown', message);                                                                 // 70
    }                                                                                                   //
    return message;                                                                                     // 72
  }                                                                                                     //
                                                                                                        //
  return Markdown;                                                                                      //
                                                                                                        //
})();                                                                                                   //
                                                                                                        //
RocketChat.Markdown = Markdown;                                                                         // 1
                                                                                                        //
RocketChat.callbacks.add('renderMessage', Markdown, RocketChat.callbacks.priority.HIGH);                // 1
                                                                                                        //
if (Meteor.isClient) {                                                                                  // 78
  Blaze.registerHelper('RocketChatMarkdown', function(text) {                                           // 79
    return RocketChat.Markdown(text);                                                                   // 80
  });                                                                                                   //
}                                                                                                       //
                                                                                                        //
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/rocketchat_markdown/markdowncode.coffee.js                                                  //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
                                                                                                        // 1
/*                                                                                                      // 1
 * MarkdownCode is a named function that will parse `inline code` and ```codeblock``` syntaxes          //
 * @param {Object} message - The message object                                                         //
 */                                                                                                     //
var MarkdownCode,                                                                                       // 1
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
                                                                                                        //
MarkdownCode = (function() {                                                                            // 1
  function MarkdownCode(message) {                                                                      // 7
    if (s.trim(message.html)) {                                                                         // 9
      if (message.tokens == null) {                                                                     //
        message.tokens = [];                                                                            //
      }                                                                                                 //
      MarkdownCode.handle_codeblocks(message);                                                          // 10
      MarkdownCode.handle_inlinecode(message);                                                          // 10
      if (typeof window !== "undefined" && window !== null ? window.rocketDebug : void 0) {             // 15
        console.log('Markdown', message);                                                               // 15
      }                                                                                                 //
    }                                                                                                   //
    return message;                                                                                     // 17
  }                                                                                                     //
                                                                                                        //
  MarkdownCode.handle_inlinecode = function(message) {                                                  // 7
    return message.html = message.html.replace(/(^|&gt;|[ >_*~])\`([^`\r\n]+)\`([<_*~]|\B|\b|$)/gm, function(match, p1, p2, p3, offset, text) {
      var token;                                                                                        // 22
      token = "=&=" + (Random.id()) + "=&=";                                                            // 22
      message.tokens.push({                                                                             // 22
        token: token,                                                                                   // 25
        text: p1 + "<span class=\"copyonly\">`</span><span><code class=\"inline\">" + p2 + "</code></span><span class=\"copyonly\">`</span>" + p3
      });                                                                                               //
      return token;                                                                                     // 28
    });                                                                                                 //
  };                                                                                                    //
                                                                                                        //
  MarkdownCode.handle_codeblocks = function(message) {                                                  // 7
    var code, codeMatch, count, i, index, lang, len, msgParts, part, ref, result, singleLine, token;    // 33
    count = (message.html.match(/```/g) || []).length;                                                  // 33
    if (count) {                                                                                        // 35
      if (count % 2 > 0) {                                                                              // 38
        message.html = message.html + "\n```";                                                          // 39
        message.msg = message.msg + "\n```";                                                            // 39
      }                                                                                                 //
      msgParts = message.html.split(/^\s*(```(?:[a-zA-Z]+)?(?:(?:.|\n)*?)```)(?:\n)?$/gm);              // 38
      for (index = i = 0, len = msgParts.length; i < len; index = ++i) {                                // 45
        part = msgParts[index];                                                                         //
        codeMatch = part.match(/^```(\w*[\n\ ]?)([\s\S]*?)```+?$/);                                     // 47
        if (codeMatch != null) {                                                                        // 49
          singleLine = codeMatch[0].indexOf('\n') === -1;                                               // 51
          if (singleLine) {                                                                             // 53
            lang = '';                                                                                  // 54
            code = _.unescapeHTML(codeMatch[1] + codeMatch[2]);                                         // 54
          } else {                                                                                      //
            lang = codeMatch[1];                                                                        // 57
            code = _.unescapeHTML(codeMatch[2]);                                                        // 57
          }                                                                                             //
          if (s.trim(lang) === '') {                                                                    // 60
            lang = '';                                                                                  // 61
          }                                                                                             //
          if (ref = s.trim(lang), indexOf.call(hljs.listLanguages(), ref) < 0) {                        // 63
            result = hljs.highlightAuto(lang + code);                                                   // 64
          } else {                                                                                      //
            result = hljs.highlight(s.trim(lang), code);                                                // 66
          }                                                                                             //
          token = "=&=" + (Random.id()) + "=&=";                                                        // 51
          message.tokens.push({                                                                         // 51
            highlight: true,                                                                            // 71
            token: token,                                                                               // 71
            text: "<pre><code class='hljs " + result.language + "'><span class='copyonly'>```<br></span>" + result.value + "<span class='copyonly'><br>```</span></code></pre>"
          });                                                                                           //
          msgParts[index] = token;                                                                      // 51
        } else {                                                                                        //
          msgParts[index] = part;                                                                       // 77
        }                                                                                               //
      }                                                                                                 // 45
      return message.html = msgParts.join('');                                                          //
    }                                                                                                   //
  };                                                                                                    //
                                                                                                        //
  return MarkdownCode;                                                                                  //
                                                                                                        //
})();                                                                                                   //
                                                                                                        //
RocketChat.MarkdownCode = MarkdownCode;                                                                 // 1
                                                                                                        //
RocketChat.callbacks.add('renderMessage', MarkdownCode, RocketChat.callbacks.priority.HIGH - 2);        // 1
                                                                                                        //
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:markdown'] = {};

})();

//# sourceMappingURL=rocketchat_markdown.js.map
