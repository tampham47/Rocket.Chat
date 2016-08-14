(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var s = Package['underscorestring:underscore.string'].s;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                          //
// packages/rocketchat_katex/settings.coffee.js                                             //
//                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////
                                                                                            //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function() {                                                                 // 1
  var enableQuery;                                                                          // 2
  enableQuery = {                                                                           // 2
    _id: 'Katex_Enabled',                                                                   // 2
    value: true                                                                             // 2
  };                                                                                        //
  RocketChat.settings.add('Katex_Enabled', true, {                                          // 2
    type: 'boolean',                                                                        // 3
    group: 'Message',                                                                       // 3
    section: 'Katex',                                                                       // 3
    "public": true,                                                                         // 3
    i18n: 'Katex_Enabled_Description'                                                       // 3
  });                                                                                       //
  RocketChat.settings.add('Katex_Parenthesis_Syntax', true, {                               // 2
    type: 'boolean',                                                                        // 5
    group: 'Message',                                                                       // 5
    section: 'Katex',                                                                       // 5
    "public": true,                                                                         // 5
    enableQuery: enableQuery,                                                               // 5
    i18nDescription: 'Katex_Parenthesis_Syntax_Description'                                 // 5
  });                                                                                       //
  return RocketChat.settings.add('Katex_Dollar_Syntax', false, {                            //
    type: 'boolean',                                                                        // 6
    group: 'Message',                                                                       // 6
    section: 'Katex',                                                                       // 6
    "public": true,                                                                         // 6
    enableQuery: enableQuery,                                                               // 6
    i18nDescription: 'Katex_Dollar_Syntax_Description'                                      // 6
  });                                                                                       //
});                                                                                         // 1
                                                                                            //
//////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                          //
// packages/rocketchat_katex/katex.coffee.js                                                //
//                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////
                                                                                            //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
                                                                                            // 1
/*                                                                                          // 1
 * KaTeX is a fast, easy-to-use JavaScript library for TeX math rendering on the web.       //
 * https://github.com/Khan/KaTeX                                                            //
 */                                                                                         //
var Katex, cb;                                                                              // 1
                                                                                            //
Katex = (function() {                                                                       // 1
  var Boundary;                                                                             // 6
                                                                                            //
  function Katex() {                                                                        // 6
    this.delimiters_map = [                                                                 // 7
      {                                                                                     //
        opener: '\\[',                                                                      // 8
        closer: '\\]',                                                                      // 8
        displayMode: true,                                                                  // 8
        enabled: (function(_this) {                                                         // 8
          return function() {                                                               //
            return _this.parenthesis_syntax_enabled();                                      //
          };                                                                                //
        })(this)                                                                            //
      }, {                                                                                  //
        opener: '\\(',                                                                      // 9
        closer: '\\)',                                                                      // 9
        displayMode: false,                                                                 // 9
        enabled: (function(_this) {                                                         // 9
          return function() {                                                               //
            return _this.parenthesis_syntax_enabled();                                      //
          };                                                                                //
        })(this)                                                                            //
      }, {                                                                                  //
        opener: '$$',                                                                       // 10
        closer: '$$',                                                                       // 10
        displayMode: true,                                                                  // 10
        enabled: (function(_this) {                                                         // 10
          return function() {                                                               //
            return _this.dollar_syntax_enabled();                                           //
          };                                                                                //
        })(this)                                                                            //
      }, {                                                                                  //
        opener: '$',                                                                        // 11
        closer: '$',                                                                        // 11
        displayMode: false,                                                                 // 11
        enabled: (function(_this) {                                                         // 11
          return function() {                                                               //
            return _this.dollar_syntax_enabled();                                           //
          };                                                                                //
        })(this)                                                                            //
      }                                                                                     //
    ];                                                                                      //
  }                                                                                         //
                                                                                            //
  Katex.prototype.find_opening_delimiter = function(str, start) {                           // 6
    var m, match, match_index, matches, o, pos, positions;                                  // 16
    matches = (function() {                                                                 // 16
      var i, len, ref, results;                                                             //
      ref = this.delimiters_map;                                                            // 16
      results = [];                                                                         // 16
      for (i = 0, len = ref.length; i < len; i++) {                                         //
        o = ref[i];                                                                         //
        if (o.enabled()) {                                                                  //
          results.push({                                                                    // 16
            options: o,                                                                     // 16
            pos: str.indexOf(o.opener, start)                                               // 16
          });                                                                               //
        }                                                                                   //
      }                                                                                     // 16
      return results;                                                                       //
    }).call(this);                                                                          //
    positions = (function() {                                                               // 16
      var i, len, results;                                                                  //
      results = [];                                                                         // 17
      for (i = 0, len = matches.length; i < len; i++) {                                     //
        m = matches[i];                                                                     //
        if (m.pos >= 0) {                                                                   //
          results.push(m.pos);                                                              // 17
        }                                                                                   //
      }                                                                                     // 17
      return results;                                                                       //
    })();                                                                                   //
    if (positions.length === 0) {                                                           // 20
      return null;                                                                          // 21
    }                                                                                       //
    pos = Math.min.apply(Math, positions);                                                  // 16
    match_index = ((function() {                                                            // 16
      var i, len, results;                                                                  //
      results = [];                                                                         // 26
      for (i = 0, len = matches.length; i < len; i++) {                                     //
        m = matches[i];                                                                     //
        results.push(m.pos);                                                                // 26
      }                                                                                     // 26
      return results;                                                                       //
    })()).indexOf(pos);                                                                     //
    match = matches[match_index];                                                           // 16
    return match;                                                                           // 29
  };                                                                                        //
                                                                                            //
  Boundary = (function() {                                                                  // 6
    function Boundary() {}                                                                  //
                                                                                            //
    Boundary.prototype.length = function() {                                                // 32
      return this.end - this.start;                                                         // 33
    };                                                                                      //
                                                                                            //
    Boundary.prototype.extract = function(str) {                                            // 32
      return str.substr(this.start, this.length());                                         // 36
    };                                                                                      //
                                                                                            //
    return Boundary;                                                                        //
                                                                                            //
  })();                                                                                     //
                                                                                            //
  Katex.prototype.get_latex_boundaries = function(str, opening_delimiter_match) {           // 6
    var closer, closer_index, inner, outer;                                                 // 41
    inner = new Boundary;                                                                   // 41
    outer = new Boundary;                                                                   // 41
    closer = opening_delimiter_match.options.closer;                                        // 41
    outer.start = opening_delimiter_match.pos;                                              // 41
    inner.start = opening_delimiter_match.pos + closer.length;                              // 41
    closer_index = str.substr(inner.start).indexOf(closer);                                 // 41
    if (closer_index < 0) {                                                                 // 52
      return null;                                                                          // 53
    }                                                                                       //
    inner.end = inner.start + closer_index;                                                 // 41
    outer.end = inner.end + closer.length;                                                  // 41
    return {                                                                                // 58
      outer: outer,                                                                         // 58
      inner: inner                                                                          // 58
    };                                                                                      //
  };                                                                                        //
                                                                                            //
  Katex.prototype.find_latex = function(str) {                                              // 6
    var match, opening_delimiter_match, start;                                              // 65
    start = 0;                                                                              // 65
    while ((opening_delimiter_match = this.find_opening_delimiter(str, start++)) != null) {
      match = this.get_latex_boundaries(str, opening_delimiter_match);                      // 68
      if (match != null ? match.inner.extract(str).trim().length : void 0) {                // 70
        match.options = opening_delimiter_match.options;                                    // 71
        return match;                                                                       // 72
      }                                                                                     //
    }                                                                                       //
    return null;                                                                            // 74
  };                                                                                        //
                                                                                            //
  Katex.prototype.extract_latex = function(str, match) {                                    // 6
    var after, before, latex;                                                               // 79
    before = str.substr(0, match.outer.start);                                              // 79
    after = str.substr(match.outer.end);                                                    // 79
    latex = match.inner.extract(str);                                                       // 79
    latex = s.unescapeHTML(latex);                                                          // 79
    return {                                                                                // 85
      before: before,                                                                       // 85
      latex: latex,                                                                         // 85
      after: after                                                                          // 85
    };                                                                                      //
  };                                                                                        //
                                                                                            //
  Katex.prototype.render_latex = function(latex, displayMode) {                             // 6
    var display_mode, e, rendered;                                                          // 90
    try {                                                                                   // 90
      rendered = katex.renderToString(latex, {                                              // 91
        displayMode: displayMode                                                            // 91
      });                                                                                   //
    } catch (_error) {                                                                      //
      e = _error;                                                                           // 93
      display_mode = displayMode ? "block" : "inline";                                      // 93
      rendered = "<div class=\"katex-error katex-" + display_mode + "-error\">";            // 93
      rendered += "" + (s.escapeHTML(e.message));                                           // 93
      rendered += "</div>";                                                                 // 93
    }                                                                                       //
    return rendered;                                                                        // 98
  };                                                                                        //
                                                                                            //
  Katex.prototype.render = function(str, render_func) {                                     // 6
    var match, parts, rendered, result;                                                     // 102
    result = '';                                                                            // 102
    while (true) {                                                                          // 104
      match = this.find_latex(str);                                                         // 107
      if (match == null) {                                                                  // 109
        result += str;                                                                      // 110
        break;                                                                              // 111
      }                                                                                     //
      parts = this.extract_latex(str, match);                                               // 107
      rendered = render_func(parts.latex, match.options.displayMode);                       // 107
      result += parts.before + rendered;                                                    // 107
      str = parts.after;                                                                    // 107
    }                                                                                       //
    return result;                                                                          // 123
  };                                                                                        //
                                                                                            //
  Katex.prototype.render_message = function(message) {                                      // 6
    var msg, render_func;                                                                   // 128
    if (this.katex_enabled()) {                                                             // 128
      msg = message;                                                                        // 129
      if (!_.isString(message)) {                                                           // 131
        if (_.trim(message.html)) {                                                         // 132
          msg = message.html;                                                               // 133
        } else {                                                                            //
          return message;                                                                   // 135
        }                                                                                   //
      }                                                                                     //
      if (_.isString(message)) {                                                            // 137
        render_func = (function(_this) {                                                    // 138
          return function(latex, displayMode) {                                             //
            return _this.render_latex(latex, displayMode);                                  // 139
          };                                                                                //
        })(this);                                                                           //
      } else {                                                                              //
        if (message.tokens == null) {                                                       //
          message.tokens = [];                                                              //
        }                                                                                   //
        render_func = (function(_this) {                                                    // 141
          return function(latex, displayMode) {                                             //
            var token;                                                                      // 144
            token = "=&=" + (Random.id()) + "=&=";                                          // 144
            message.tokens.push({                                                           // 144
              token: token,                                                                 // 147
              text: _this.render_latex(latex, displayMode)                                  // 147
            });                                                                             //
            return token;                                                                   // 150
          };                                                                                //
        })(this);                                                                           //
      }                                                                                     //
      msg = this.render(msg, render_func);                                                  // 129
      if (!_.isString(message)) {                                                           // 154
        message.html = msg;                                                                 // 155
      } else {                                                                              //
        message = msg;                                                                      // 157
      }                                                                                     //
    }                                                                                       //
    return message;                                                                         // 159
  };                                                                                        //
                                                                                            //
  Katex.prototype.katex_enabled = function() {                                              // 6
    return RocketChat.settings.get('Katex_Enabled');                                        // 162
  };                                                                                        //
                                                                                            //
  Katex.prototype.dollar_syntax_enabled = function() {                                      // 6
    return RocketChat.settings.get('Katex_Dollar_Syntax');                                  // 165
  };                                                                                        //
                                                                                            //
  Katex.prototype.parenthesis_syntax_enabled = function() {                                 // 6
    return RocketChat.settings.get('Katex_Parenthesis_Syntax');                             // 168
  };                                                                                        //
                                                                                            //
  return Katex;                                                                             //
                                                                                            //
})();                                                                                       //
                                                                                            //
RocketChat.katex = new Katex;                                                               // 1
                                                                                            //
cb = RocketChat.katex.render_message.bind(RocketChat.katex);                                // 1
                                                                                            //
RocketChat.callbacks.add('renderMessage', cb, RocketChat.callbacks.priority.HIGH - 1);      // 1
                                                                                            //
if (Meteor.isClient) {                                                                      // 176
  Blaze.registerHelper('RocketChatKatex', function(text) {                                  // 177
    return RocketChat.katex.render_message(text);                                           // 178
  });                                                                                       //
}                                                                                           //
                                                                                            //
//////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:katex'] = {};

})();

//# sourceMappingURL=rocketchat_katex.js.map
