(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.frameService = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(_dereq_,module,exports){
(function (global){(function (){
'use strict';

var win, framebus;
var popups = [];
var subscribers = {};
var prefix = '/*framebus*/';

function include(popup) {
  if (popup == null) { return false; }
  if (popup.Window == null) { return false; }
  if (popup.constructor !== popup.Window) { return false; }

  popups.push(popup);
  return true;
}

function target(origin) {
  var key;
  var targetedFramebus = {};

  for (key in framebus) {
    if (!framebus.hasOwnProperty(key)) { continue; }

    targetedFramebus[key] = framebus[key];
  }

  targetedFramebus._origin = origin || '*';

  return targetedFramebus;
}

function publish(event) {
  var payload, args;
  var origin = _getOrigin(this); // eslint-disable-line no-invalid-this

  if (_isntString(event)) { return false; }
  if (_isntString(origin)) { return false; }

  args = Array.prototype.slice.call(arguments, 1);

  payload = _packagePayload(event, args, origin);
  if (payload === false) { return false; }

  _broadcast(win.top || win.self, payload, origin);

  return true;
}

function subscribe(event, fn) {
  var origin = _getOrigin(this); // eslint-disable-line no-invalid-this

  if (_subscriptionArgsInvalid(event, fn, origin)) { return false; }

  subscribers[origin] = subscribers[origin] || {};
  subscribers[origin][event] = subscribers[origin][event] || [];
  subscribers[origin][event].push(fn);

  return true;
}

function unsubscribe(event, fn) {
  var i, subscriberList;
  var origin = _getOrigin(this); // eslint-disable-line no-invalid-this

  if (_subscriptionArgsInvalid(event, fn, origin)) { return false; }

  subscriberList = subscribers[origin] && subscribers[origin][event];
  if (!subscriberList) { return false; }

  for (i = 0; i < subscriberList.length; i++) {
    if (subscriberList[i] === fn) {
      subscriberList.splice(i, 1);
      return true;
    }
  }

  return false;
}

function _getOrigin(scope) {
  return scope && scope._origin || '*';
}

function _isntString(string) {
  return typeof string !== 'string';
}

function _packagePayload(event, args, origin) {
  var packaged = false;
  var payload = {
    event: event,
    origin: origin
  };
  var reply = args[args.length - 1];

  if (typeof reply === 'function') {
    payload.reply = _subscribeReplier(reply, origin);
    args = args.slice(0, -1);
  }

  payload.args = args;

  try {
    packaged = prefix + JSON.stringify(payload);
  } catch (e) {
    throw new Error('Could not stringify event: ' + e.message);
  }
  return packaged;
}

function _unpackPayload(e) {
  var payload, replyOrigin, replySource, replyEvent;

  if (e.data.slice(0, prefix.length) !== prefix) { return false; }

  try {
    payload = JSON.parse(e.data.slice(prefix.length));
  } catch (err) {
    return false;
  }

  if (payload.reply != null) {
    replyOrigin = e.origin;
    replySource = e.source;
    replyEvent = payload.reply;

    payload.reply = function reply(data) { // eslint-disable-line consistent-return
      var replyPayload;

      if (!replySource) { return false; }

      replyPayload = _packagePayload(replyEvent, [data], replyOrigin);

      if (replyPayload === false) { return false; }

      replySource.postMessage(replyPayload, replyOrigin);
    };

    payload.args.push(payload.reply);
  }

  return payload;
}

function _attach(w) {
  if (win) { return; }
  win = w || global;

  if (win.addEventListener) {
    win.addEventListener('message', _onmessage, false);
  } else if (win.attachEvent) {
    win.attachEvent('onmessage', _onmessage);
  } else if (win.onmessage === null) {
    win.onmessage = _onmessage;
  } else {
    win = null;
  }
}

// removeIf(production)
function _detach() {
  if (win == null) { return; }

  if (win.removeEventListener) {
    win.removeEventListener('message', _onmessage, false);
  } else if (win.detachEvent) {
    win.detachEvent('onmessage', _onmessage);
  } else if (win.onmessage === _onmessage) {
    win.onmessage = null;
  }

  win = null;
  popups = [];
  subscribers = {};
}
// endRemoveIf(production)

function _uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : r & 0x3 | 0x8;

    return v.toString(16);
  });
}

function _onmessage(e) {
  var payload;

  if (_isntString(e.data)) { return; }

  payload = _unpackPayload(e);
  if (!payload) { return; }

  _dispatch('*', payload.event, payload.args, e);
  _dispatch(e.origin, payload.event, payload.args, e);
  _broadcastPopups(e.data, payload.origin, e.source);
}

function _dispatch(origin, event, args, e) {
  var i;

  if (!subscribers[origin]) { return; }
  if (!subscribers[origin][event]) { return; }

  for (i = 0; i < subscribers[origin][event].length; i++) {
    subscribers[origin][event][i].apply(e, args);
  }
}

function _hasOpener(frame) {
  if (frame.top !== frame) { return false; }
  if (frame.opener == null) { return false; }
  if (frame.opener === frame) { return false; }
  if (frame.opener.closed === true) { return false; }

  return true;
}

function _broadcast(frame, payload, origin) {
  var i = 0;
  var frameToBroadcastTo;

  try {
    frame.postMessage(payload, origin);

    if (_hasOpener(frame)) {
      _broadcast(frame.opener.top, payload, origin);
    }

    // previously, our max value was frame.frames.length
    // but frames.length inherits from window.length
    // which can be overwritten if a developer does
    // `var length = value;` outside of a function
    // scope, it'll prevent us from looping through
    // all the frames. With this, we loop through
    // until there are no longer any frames
    while (frameToBroadcastTo = frame.frames[i]) { // eslint-disable-line no-cond-assign
      _broadcast(frameToBroadcastTo, payload, origin);
      i++;
    }
  } catch (_) { /* ignored */ }
}

function _broadcastPopups(payload, origin, source) {
  var i, popup;

  for (i = popups.length - 1; i >= 0; i--) {
    popup = popups[i];

    if (popup.closed === true) {
      popups = popups.slice(i, 1);
    } else if (source !== popup) {
      _broadcast(popup.top, payload, origin);
    }
  }
}

function _subscribeReplier(fn, origin) {
  var uuid = _uuid();

  function replier(d, o) {
    fn(d, o);
    framebus.target(origin).unsubscribe(uuid, replier);
  }

  framebus.target(origin).subscribe(uuid, replier);
  return uuid;
}

function _subscriptionArgsInvalid(event, fn, origin) {
  if (_isntString(event)) { return true; }
  if (typeof fn !== 'function') { return true; }
  if (_isntString(origin)) { return true; }

  return false;
}

_attach();

framebus = {
  target: target,
  // removeIf(production)
  _packagePayload: _packagePayload,
  _unpackPayload: _unpackPayload,
  _attach: _attach,
  _detach: _detach,
  _dispatch: _dispatch,
  _broadcast: _broadcast,
  _subscribeReplier: _subscribeReplier,
  _subscriptionArgsInvalid: _subscriptionArgsInvalid,
  _onmessage: _onmessage,
  _uuid: _uuid,
  _getSubscribers: function () { return subscribers; },
  _win: function () { return win; },
  // endRemoveIf(production)
  include: include,
  publish: publish,
  pub: publish,
  trigger: publish,
  emit: publish,
  subscribe: subscribe,
  sub: subscribe,
  on: subscribe,
  unsubscribe: unsubscribe,
  unsub: unsubscribe,
  off: unsubscribe
};

module.exports = framebus;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],2:[function(_dereq_,module,exports){
'use strict';

var isWhitelistedDomain = _dereq_('../is-whitelisted-domain');

function checkOrigin(postMessageOrigin, merchantUrl) {
  var merchantOrigin, merchantHost;
  var a = document.createElement('a');

  a.href = merchantUrl;

  if (a.protocol === 'https:') {
    merchantHost = a.host.replace(/:443$/, '');
  } else if (a.protocol === 'http:') {
    merchantHost = a.host.replace(/:80$/, '');
  } else {
    merchantHost = a.host;
  }

  merchantOrigin = a.protocol + '//' + merchantHost;

  if (merchantOrigin === postMessageOrigin) { return true; }

  a.href = postMessageOrigin;

  return isWhitelistedDomain(postMessageOrigin);
}

module.exports = {
  checkOrigin: checkOrigin
};

},{"../is-whitelisted-domain":8}],3:[function(_dereq_,module,exports){
'use strict';

var enumerate = _dereq_('../enumerate');

module.exports = enumerate([
  'CONFIGURATION_REQUEST'
], 'bus:');

},{"../enumerate":5}],4:[function(_dereq_,module,exports){
'use strict';

var bus = _dereq_('framebus');
var events = _dereq_('./events');
var checkOrigin = _dereq_('./check-origin').checkOrigin;
var SeamlesspayError = _dereq_('../seamlesspay-error');

function SeamlesspayBus(options) {
  options = options || {};

  this.channel = options.channel;
  if (!this.channel) {
    throw new SeamlesspayError({
      type: SeamlesspayError.types.INTERNAL,
      code: 'MISSING_CHANNEL_ID',
      message: 'Channel ID must be specified.'
    });
  }

  this.merchantUrl = options.merchantUrl;

  this._isDestroyed = false;
  this._isVerbose = false;

  this._listeners = [];

  this._log('new bus on channel ' + this.channel, [location.href]);
}

SeamlesspayBus.prototype.on = function (eventName, originalHandler) {
  var namespacedEvent, args;
  var handler = originalHandler;
  var self = this;

  if (this._isDestroyed) { return; }

  if (this.merchantUrl) {
    handler = function () {
      /* eslint-disable no-invalid-this */
      if (checkOrigin(this.origin, self.merchantUrl)) {
        originalHandler.apply(this, arguments);
      }
      /* eslint-enable no-invalid-this */
    };
  }

  namespacedEvent = this._namespaceEvent(eventName);
  args = Array.prototype.slice.call(arguments);
  args[0] = namespacedEvent;
  args[1] = handler;

  this._log('on', args);
  bus.on.apply(bus, args);

  this._listeners.push({
    eventName: eventName,
    handler: handler,
    originalHandler: originalHandler
  });
};

SeamlesspayBus.prototype.emit = function (eventName) {
  var args;

  if (this._isDestroyed) { return; }

  args = Array.prototype.slice.call(arguments);
  args[0] = this._namespaceEvent(eventName);

  this._log('emit', args);
  bus.emit.apply(bus, args);
};

SeamlesspayBus.prototype._offDirect = function (eventName) {
  var args = Array.prototype.slice.call(arguments);

  if (this._isDestroyed) { return; }

  args[0] = this._namespaceEvent(eventName);

  this._log('off', args);
  bus.off.apply(bus, args);
};

SeamlesspayBus.prototype.off = function (eventName, originalHandler) {
  var i, listener;
  var handler = originalHandler;

  if (this._isDestroyed) { return; }

  if (this.merchantUrl) {
    for (i = 0; i < this._listeners.length; i++) {
      listener = this._listeners[i];

      if (listener.originalHandler === originalHandler) {
        handler = listener.handler;
      }
    }
  }

  this._offDirect(eventName, handler);
};

SeamlesspayBus.prototype._namespaceEvent = function (eventName) {
  return ['seamlesspay', this.channel, eventName].join(':');
};

SeamlesspayBus.prototype.teardown = function () {
  var listener, i;

  for (i = 0; i < this._listeners.length; i++) {
    listener = this._listeners[i];
    this._offDirect(listener.eventName, listener.handler);
  }

  this._listeners.length = 0;

  this._isDestroyed = true;
};

SeamlesspayBus.prototype._log = function (functionName, args) {
  if (this._isVerbose) {
    console.log(functionName, args); // eslint-disable-line no-console
  }
};

SeamlesspayBus.events = events;

module.exports = SeamlesspayBus;

},{"../seamlesspay-error":10,"./check-origin":2,"./events":3,"framebus":1}],5:[function(_dereq_,module,exports){
'use strict';

function enumerate(values, prefix) {
  prefix = prefix == null ? '' : prefix;

  return values.reduce(function (enumeration, value) {
    enumeration[value] = prefix + value;
    return enumeration;
  }, {});
}

module.exports = enumerate;

},{}],6:[function(_dereq_,module,exports){
(function (global){(function (){
'use strict';

var Bus = _dereq_('../../../bus');
var events = _dereq_('../../shared/events');
var clone = _dereq_('../../../json-clone');

function start() {
  var serviceChannel = global.name.split('_')[1];
  var configuration;

  global.bus = new Bus({channel: serviceChannel});
  global.bus.emit(Bus.events.CONFIGURATION_REQUEST, function (localConfiguration) {
    configuration = localConfiguration;
    global.bus.emit(events.DISPATCH_FRAME_READY);
  });
  global.getConfiguration = function () {
    return clone(configuration);
  };
}

module.exports = {
  start: start
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../../bus":4,"../../../json-clone":9,"../../shared/events":7}],7:[function(_dereq_,module,exports){
'use strict';

var enumerate = _dereq_('../../enumerate');

module.exports = enumerate([
  'DISPATCH_FRAME_READY',
  'DISPATCH_FRAME_REPORT'
], 'frameService:');

},{"../../enumerate":5}],8:[function(_dereq_,module,exports){
'use strict';

var API_HOST = undefined;
var PANVAULT_HOST = undefined;
var ASSETS_HOST = "http://localhost:3001/dev";

var legalHosts = [
  'seamlesspay.com',
  'seamlesspay.dev',
  'seamlesspay.io',
  'web-sdk.seamlesspay.com',
  'api.seamlesspay.com',
  'api.seamlesspay.dev',
  'api.seamlesspay.io',
  'pan-vault.seamlesspay.com',
  'pan-vault.seamlesspay.dev',
  'pan-vault.seamlesspay.io',
  'api.sandbox.seamlesspay.com',
  'api.sandbox.seamlesspay.dev',
  'api.sandbox.seamlesspay.io',
  'pan-vault.sandbox.seamlesspay.com',
  'pan-vault.sandbox.seamlesspay.dev',
  'pan-vault.sandbox.seamlesspay.io'
];

// removeIf(production)
legalHosts.push('localhost');
if (API_HOST) {
  legalHosts.push(stripSubdomains(API_HOST));
}
if (PANVAULT_HOST) {
  legalHosts.push(stripSubdomains(PANVAULT_HOST));
}
if (ASSETS_HOST) {
  legalHosts.push(stripSubdomains(ASSETS_HOST).replace('http://', '').replace('https://', ''));
}
// endRemoveIf(production)

function stripSubdomains(domain) {
  return domain.split('.').slice(-2).join('.');
}

function isWhitelistedDomain(url) {
  // var mainDomain;

  // url = url.toLowerCase();

  // if (!(new RegExp('^https?:')).test(url)) {
  //   return false;
  // }

  // parser = parser || document.createElement('a');
  // parser.href = url;
  // mainDomain = stripSubdomains(parser.hostname);
  try {
    var parsedUrl = new URL(url);
    return legalHosts.indexOf(stripSubdomains(parsedUrl.hostname)) !== -1;
  } catch (error) {
    return false
  }
}

module.exports = isWhitelistedDomain;

},{}],9:[function(_dereq_,module,exports){
'use strict';

module.exports = function (value) {
  return JSON.parse(JSON.stringify(value));
};

},{}],10:[function(_dereq_,module,exports){
'use strict';

var enumerate = _dereq_('./enumerate');

/**
 * @class
 * @global
 * @param {object} options Construction options
 * @classdesc This class is used to report error conditions, frequently as the first parameter to callbacks throughout the Seamlesspay SDK.
 * @description <strong>You cannot use this constructor directly. Interact with instances of this class through {@link callback callbacks}.</strong>
 */
function SeamlesspayError(options) {
  if (!SeamlesspayError.types.hasOwnProperty(options.type)) {
    throw new Error(options.type + ' is not a valid type.');
  }

  if (!options.code) {
    throw new Error('Error code required.');
  }

  if (!options.message) {
    throw new Error('Error message required.');
  }

  this.name = 'SeamlesspayError';

  /**
   * @type {string}
   * @description A code that corresponds to specific errors.
   */
  this.code = options.code;

  /**
   * @type {string}
   * @description A short description of the error.
   */
  this.message = options.message;

  /**
   * @type {SeamlesspayError.types}
   * @description The type of error.
   */
  this.type = options.type;

  /**
   * @type {object=}
   * @description Additional information about the error, such as an underlying network error response.
   */
  this.details = options.details;
}

SeamlesspayError.prototype = Object.create(Error.prototype);
SeamlesspayError.prototype.constructor = SeamlesspayError;

/**
 * Enum for {@link SeamlesspayError} types.
 * @name SeamlesspayError.types
 * @enum
 * @readonly
 * @memberof SeamlesspayError
 * @property {string} CUSTOMER An error caused by the customer.
 * @property {string} MERCHANT An error that is actionable by the merchant.
 * @property {string} NETWORK An error due to a network problem.
 * @property {string} INTERNAL An error caused by Seamlesspay code.
 * @property {string} UNKNOWN An error where the origin is unknown.
 */
SeamlesspayError.types = enumerate([
  'CUSTOMER',
  'MERCHANT',
  'NETWORK',
  'INTERNAL',
  'UNKNOWN'
]);

module.exports = SeamlesspayError;

},{"./enumerate":5}]},{},[6])(6)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZnJhbWVidXMvbGliL2ZyYW1lYnVzLmpzIiwic3JjL2xpYi9idXMvY2hlY2stb3JpZ2luLmpzIiwic3JjL2xpYi9idXMvZXZlbnRzLmpzIiwic3JjL2xpYi9idXMvaW5kZXguanMiLCJzcmMvbGliL2VudW1lcmF0ZS5qcyIsInNyYy9saWIvZnJhbWUtc2VydmljZS9pbnRlcm5hbC9kaXNwYXRjaC1mcmFtZS9pbmRleC5qcyIsInNyYy9saWIvZnJhbWUtc2VydmljZS9zaGFyZWQvZXZlbnRzLmpzIiwic3JjL2xpYi9pcy13aGl0ZWxpc3RlZC1kb21haW4uanMiLCJzcmMvbGliL2pzb24tY2xvbmUuanMiLCJzcmMvbGliL3NlYW1sZXNzcGF5LWVycm9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN0VEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIndXNlIHN0cmljdCc7XG5cbnZhciB3aW4sIGZyYW1lYnVzO1xudmFyIHBvcHVwcyA9IFtdO1xudmFyIHN1YnNjcmliZXJzID0ge307XG52YXIgcHJlZml4ID0gJy8qZnJhbWVidXMqLyc7XG5cbmZ1bmN0aW9uIGluY2x1ZGUocG9wdXApIHtcbiAgaWYgKHBvcHVwID09IG51bGwpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIGlmIChwb3B1cC5XaW5kb3cgPT0gbnVsbCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYgKHBvcHVwLmNvbnN0cnVjdG9yICE9PSBwb3B1cC5XaW5kb3cpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgcG9wdXBzLnB1c2gocG9wdXApO1xuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gdGFyZ2V0KG9yaWdpbikge1xuICB2YXIga2V5O1xuICB2YXIgdGFyZ2V0ZWRGcmFtZWJ1cyA9IHt9O1xuXG4gIGZvciAoa2V5IGluIGZyYW1lYnVzKSB7XG4gICAgaWYgKCFmcmFtZWJ1cy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7IGNvbnRpbnVlOyB9XG5cbiAgICB0YXJnZXRlZEZyYW1lYnVzW2tleV0gPSBmcmFtZWJ1c1trZXldO1xuICB9XG5cbiAgdGFyZ2V0ZWRGcmFtZWJ1cy5fb3JpZ2luID0gb3JpZ2luIHx8ICcqJztcblxuICByZXR1cm4gdGFyZ2V0ZWRGcmFtZWJ1cztcbn1cblxuZnVuY3Rpb24gcHVibGlzaChldmVudCkge1xuICB2YXIgcGF5bG9hZCwgYXJncztcbiAgdmFyIG9yaWdpbiA9IF9nZXRPcmlnaW4odGhpcyk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8taW52YWxpZC10aGlzXG5cbiAgaWYgKF9pc250U3RyaW5nKGV2ZW50KSkgeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYgKF9pc250U3RyaW5nKG9yaWdpbikpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG5cbiAgcGF5bG9hZCA9IF9wYWNrYWdlUGF5bG9hZChldmVudCwgYXJncywgb3JpZ2luKTtcbiAgaWYgKHBheWxvYWQgPT09IGZhbHNlKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIF9icm9hZGNhc3Qod2luLnRvcCB8fCB3aW4uc2VsZiwgcGF5bG9hZCwgb3JpZ2luKTtcblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gc3Vic2NyaWJlKGV2ZW50LCBmbikge1xuICB2YXIgb3JpZ2luID0gX2dldE9yaWdpbih0aGlzKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1pbnZhbGlkLXRoaXNcblxuICBpZiAoX3N1YnNjcmlwdGlvbkFyZ3NJbnZhbGlkKGV2ZW50LCBmbiwgb3JpZ2luKSkgeyByZXR1cm4gZmFsc2U7IH1cblxuICBzdWJzY3JpYmVyc1tvcmlnaW5dID0gc3Vic2NyaWJlcnNbb3JpZ2luXSB8fCB7fTtcbiAgc3Vic2NyaWJlcnNbb3JpZ2luXVtldmVudF0gPSBzdWJzY3JpYmVyc1tvcmlnaW5dW2V2ZW50XSB8fCBbXTtcbiAgc3Vic2NyaWJlcnNbb3JpZ2luXVtldmVudF0ucHVzaChmbik7XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIHVuc3Vic2NyaWJlKGV2ZW50LCBmbikge1xuICB2YXIgaSwgc3Vic2NyaWJlckxpc3Q7XG4gIHZhciBvcmlnaW4gPSBfZ2V0T3JpZ2luKHRoaXMpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWludmFsaWQtdGhpc1xuXG4gIGlmIChfc3Vic2NyaXB0aW9uQXJnc0ludmFsaWQoZXZlbnQsIGZuLCBvcmlnaW4pKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIHN1YnNjcmliZXJMaXN0ID0gc3Vic2NyaWJlcnNbb3JpZ2luXSAmJiBzdWJzY3JpYmVyc1tvcmlnaW5dW2V2ZW50XTtcbiAgaWYgKCFzdWJzY3JpYmVyTGlzdCkgeyByZXR1cm4gZmFsc2U7IH1cblxuICBmb3IgKGkgPSAwOyBpIDwgc3Vic2NyaWJlckxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3Vic2NyaWJlckxpc3RbaV0gPT09IGZuKSB7XG4gICAgICBzdWJzY3JpYmVyTGlzdC5zcGxpY2UoaSwgMSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIF9nZXRPcmlnaW4oc2NvcGUpIHtcbiAgcmV0dXJuIHNjb3BlICYmIHNjb3BlLl9vcmlnaW4gfHwgJyonO1xufVxuXG5mdW5jdGlvbiBfaXNudFN0cmluZyhzdHJpbmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBzdHJpbmcgIT09ICdzdHJpbmcnO1xufVxuXG5mdW5jdGlvbiBfcGFja2FnZVBheWxvYWQoZXZlbnQsIGFyZ3MsIG9yaWdpbikge1xuICB2YXIgcGFja2FnZWQgPSBmYWxzZTtcbiAgdmFyIHBheWxvYWQgPSB7XG4gICAgZXZlbnQ6IGV2ZW50LFxuICAgIG9yaWdpbjogb3JpZ2luXG4gIH07XG4gIHZhciByZXBseSA9IGFyZ3NbYXJncy5sZW5ndGggLSAxXTtcblxuICBpZiAodHlwZW9mIHJlcGx5ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcGF5bG9hZC5yZXBseSA9IF9zdWJzY3JpYmVSZXBsaWVyKHJlcGx5LCBvcmlnaW4pO1xuICAgIGFyZ3MgPSBhcmdzLnNsaWNlKDAsIC0xKTtcbiAgfVxuXG4gIHBheWxvYWQuYXJncyA9IGFyZ3M7XG5cbiAgdHJ5IHtcbiAgICBwYWNrYWdlZCA9IHByZWZpeCArIEpTT04uc3RyaW5naWZ5KHBheWxvYWQpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDb3VsZCBub3Qgc3RyaW5naWZ5IGV2ZW50OiAnICsgZS5tZXNzYWdlKTtcbiAgfVxuICByZXR1cm4gcGFja2FnZWQ7XG59XG5cbmZ1bmN0aW9uIF91bnBhY2tQYXlsb2FkKGUpIHtcbiAgdmFyIHBheWxvYWQsIHJlcGx5T3JpZ2luLCByZXBseVNvdXJjZSwgcmVwbHlFdmVudDtcblxuICBpZiAoZS5kYXRhLnNsaWNlKDAsIHByZWZpeC5sZW5ndGgpICE9PSBwcmVmaXgpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgdHJ5IHtcbiAgICBwYXlsb2FkID0gSlNPTi5wYXJzZShlLmRhdGEuc2xpY2UocHJlZml4Lmxlbmd0aCkpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAocGF5bG9hZC5yZXBseSAhPSBudWxsKSB7XG4gICAgcmVwbHlPcmlnaW4gPSBlLm9yaWdpbjtcbiAgICByZXBseVNvdXJjZSA9IGUuc291cmNlO1xuICAgIHJlcGx5RXZlbnQgPSBwYXlsb2FkLnJlcGx5O1xuXG4gICAgcGF5bG9hZC5yZXBseSA9IGZ1bmN0aW9uIHJlcGx5KGRhdGEpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBjb25zaXN0ZW50LXJldHVyblxuICAgICAgdmFyIHJlcGx5UGF5bG9hZDtcblxuICAgICAgaWYgKCFyZXBseVNvdXJjZSkgeyByZXR1cm4gZmFsc2U7IH1cblxuICAgICAgcmVwbHlQYXlsb2FkID0gX3BhY2thZ2VQYXlsb2FkKHJlcGx5RXZlbnQsIFtkYXRhXSwgcmVwbHlPcmlnaW4pO1xuXG4gICAgICBpZiAocmVwbHlQYXlsb2FkID09PSBmYWxzZSkgeyByZXR1cm4gZmFsc2U7IH1cblxuICAgICAgcmVwbHlTb3VyY2UucG9zdE1lc3NhZ2UocmVwbHlQYXlsb2FkLCByZXBseU9yaWdpbik7XG4gICAgfTtcblxuICAgIHBheWxvYWQuYXJncy5wdXNoKHBheWxvYWQucmVwbHkpO1xuICB9XG5cbiAgcmV0dXJuIHBheWxvYWQ7XG59XG5cbmZ1bmN0aW9uIF9hdHRhY2godykge1xuICBpZiAod2luKSB7IHJldHVybjsgfVxuICB3aW4gPSB3IHx8IGdsb2JhbDtcblxuICBpZiAod2luLmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICB3aW4uYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIF9vbm1lc3NhZ2UsIGZhbHNlKTtcbiAgfSBlbHNlIGlmICh3aW4uYXR0YWNoRXZlbnQpIHtcbiAgICB3aW4uYXR0YWNoRXZlbnQoJ29ubWVzc2FnZScsIF9vbm1lc3NhZ2UpO1xuICB9IGVsc2UgaWYgKHdpbi5vbm1lc3NhZ2UgPT09IG51bGwpIHtcbiAgICB3aW4ub25tZXNzYWdlID0gX29ubWVzc2FnZTtcbiAgfSBlbHNlIHtcbiAgICB3aW4gPSBudWxsO1xuICB9XG59XG5cbi8vIHJlbW92ZUlmKHByb2R1Y3Rpb24pXG5mdW5jdGlvbiBfZGV0YWNoKCkge1xuICBpZiAod2luID09IG51bGwpIHsgcmV0dXJuOyB9XG5cbiAgaWYgKHdpbi5yZW1vdmVFdmVudExpc3RlbmVyKSB7XG4gICAgd2luLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBfb25tZXNzYWdlLCBmYWxzZSk7XG4gIH0gZWxzZSBpZiAod2luLmRldGFjaEV2ZW50KSB7XG4gICAgd2luLmRldGFjaEV2ZW50KCdvbm1lc3NhZ2UnLCBfb25tZXNzYWdlKTtcbiAgfSBlbHNlIGlmICh3aW4ub25tZXNzYWdlID09PSBfb25tZXNzYWdlKSB7XG4gICAgd2luLm9ubWVzc2FnZSA9IG51bGw7XG4gIH1cblxuICB3aW4gPSBudWxsO1xuICBwb3B1cHMgPSBbXTtcbiAgc3Vic2NyaWJlcnMgPSB7fTtcbn1cbi8vIGVuZFJlbW92ZUlmKHByb2R1Y3Rpb24pXG5cbmZ1bmN0aW9uIF91dWlkKCkge1xuICByZXR1cm4gJ3h4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eCcucmVwbGFjZSgvW3h5XS9nLCBmdW5jdGlvbiAoYykge1xuICAgIHZhciByID0gTWF0aC5yYW5kb20oKSAqIDE2IHwgMDtcbiAgICB2YXIgdiA9IGMgPT09ICd4JyA/IHIgOiByICYgMHgzIHwgMHg4O1xuXG4gICAgcmV0dXJuIHYudG9TdHJpbmcoMTYpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gX29ubWVzc2FnZShlKSB7XG4gIHZhciBwYXlsb2FkO1xuXG4gIGlmIChfaXNudFN0cmluZyhlLmRhdGEpKSB7IHJldHVybjsgfVxuXG4gIHBheWxvYWQgPSBfdW5wYWNrUGF5bG9hZChlKTtcbiAgaWYgKCFwYXlsb2FkKSB7IHJldHVybjsgfVxuXG4gIF9kaXNwYXRjaCgnKicsIHBheWxvYWQuZXZlbnQsIHBheWxvYWQuYXJncywgZSk7XG4gIF9kaXNwYXRjaChlLm9yaWdpbiwgcGF5bG9hZC5ldmVudCwgcGF5bG9hZC5hcmdzLCBlKTtcbiAgX2Jyb2FkY2FzdFBvcHVwcyhlLmRhdGEsIHBheWxvYWQub3JpZ2luLCBlLnNvdXJjZSk7XG59XG5cbmZ1bmN0aW9uIF9kaXNwYXRjaChvcmlnaW4sIGV2ZW50LCBhcmdzLCBlKSB7XG4gIHZhciBpO1xuXG4gIGlmICghc3Vic2NyaWJlcnNbb3JpZ2luXSkgeyByZXR1cm47IH1cbiAgaWYgKCFzdWJzY3JpYmVyc1tvcmlnaW5dW2V2ZW50XSkgeyByZXR1cm47IH1cblxuICBmb3IgKGkgPSAwOyBpIDwgc3Vic2NyaWJlcnNbb3JpZ2luXVtldmVudF0ubGVuZ3RoOyBpKyspIHtcbiAgICBzdWJzY3JpYmVyc1tvcmlnaW5dW2V2ZW50XVtpXS5hcHBseShlLCBhcmdzKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfaGFzT3BlbmVyKGZyYW1lKSB7XG4gIGlmIChmcmFtZS50b3AgIT09IGZyYW1lKSB7IHJldHVybiBmYWxzZTsgfVxuICBpZiAoZnJhbWUub3BlbmVyID09IG51bGwpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIGlmIChmcmFtZS5vcGVuZXIgPT09IGZyYW1lKSB7IHJldHVybiBmYWxzZTsgfVxuICBpZiAoZnJhbWUub3BlbmVyLmNsb3NlZCA9PT0gdHJ1ZSkgeyByZXR1cm4gZmFsc2U7IH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gX2Jyb2FkY2FzdChmcmFtZSwgcGF5bG9hZCwgb3JpZ2luKSB7XG4gIHZhciBpID0gMDtcbiAgdmFyIGZyYW1lVG9Ccm9hZGNhc3RUbztcblxuICB0cnkge1xuICAgIGZyYW1lLnBvc3RNZXNzYWdlKHBheWxvYWQsIG9yaWdpbik7XG5cbiAgICBpZiAoX2hhc09wZW5lcihmcmFtZSkpIHtcbiAgICAgIF9icm9hZGNhc3QoZnJhbWUub3BlbmVyLnRvcCwgcGF5bG9hZCwgb3JpZ2luKTtcbiAgICB9XG5cbiAgICAvLyBwcmV2aW91c2x5LCBvdXIgbWF4IHZhbHVlIHdhcyBmcmFtZS5mcmFtZXMubGVuZ3RoXG4gICAgLy8gYnV0IGZyYW1lcy5sZW5ndGggaW5oZXJpdHMgZnJvbSB3aW5kb3cubGVuZ3RoXG4gICAgLy8gd2hpY2ggY2FuIGJlIG92ZXJ3cml0dGVuIGlmIGEgZGV2ZWxvcGVyIGRvZXNcbiAgICAvLyBgdmFyIGxlbmd0aCA9IHZhbHVlO2Agb3V0c2lkZSBvZiBhIGZ1bmN0aW9uXG4gICAgLy8gc2NvcGUsIGl0J2xsIHByZXZlbnQgdXMgZnJvbSBsb29waW5nIHRocm91Z2hcbiAgICAvLyBhbGwgdGhlIGZyYW1lcy4gV2l0aCB0aGlzLCB3ZSBsb29wIHRocm91Z2hcbiAgICAvLyB1bnRpbCB0aGVyZSBhcmUgbm8gbG9uZ2VyIGFueSBmcmFtZXNcbiAgICB3aGlsZSAoZnJhbWVUb0Jyb2FkY2FzdFRvID0gZnJhbWUuZnJhbWVzW2ldKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uZC1hc3NpZ25cbiAgICAgIF9icm9hZGNhc3QoZnJhbWVUb0Jyb2FkY2FzdFRvLCBwYXlsb2FkLCBvcmlnaW4pO1xuICAgICAgaSsrO1xuICAgIH1cbiAgfSBjYXRjaCAoXykgeyAvKiBpZ25vcmVkICovIH1cbn1cblxuZnVuY3Rpb24gX2Jyb2FkY2FzdFBvcHVwcyhwYXlsb2FkLCBvcmlnaW4sIHNvdXJjZSkge1xuICB2YXIgaSwgcG9wdXA7XG5cbiAgZm9yIChpID0gcG9wdXBzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgcG9wdXAgPSBwb3B1cHNbaV07XG5cbiAgICBpZiAocG9wdXAuY2xvc2VkID09PSB0cnVlKSB7XG4gICAgICBwb3B1cHMgPSBwb3B1cHMuc2xpY2UoaSwgMSk7XG4gICAgfSBlbHNlIGlmIChzb3VyY2UgIT09IHBvcHVwKSB7XG4gICAgICBfYnJvYWRjYXN0KHBvcHVwLnRvcCwgcGF5bG9hZCwgb3JpZ2luKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gX3N1YnNjcmliZVJlcGxpZXIoZm4sIG9yaWdpbikge1xuICB2YXIgdXVpZCA9IF91dWlkKCk7XG5cbiAgZnVuY3Rpb24gcmVwbGllcihkLCBvKSB7XG4gICAgZm4oZCwgbyk7XG4gICAgZnJhbWVidXMudGFyZ2V0KG9yaWdpbikudW5zdWJzY3JpYmUodXVpZCwgcmVwbGllcik7XG4gIH1cblxuICBmcmFtZWJ1cy50YXJnZXQob3JpZ2luKS5zdWJzY3JpYmUodXVpZCwgcmVwbGllcik7XG4gIHJldHVybiB1dWlkO1xufVxuXG5mdW5jdGlvbiBfc3Vic2NyaXB0aW9uQXJnc0ludmFsaWQoZXZlbnQsIGZuLCBvcmlnaW4pIHtcbiAgaWYgKF9pc250U3RyaW5nKGV2ZW50KSkgeyByZXR1cm4gdHJ1ZTsgfVxuICBpZiAodHlwZW9mIGZuICE9PSAnZnVuY3Rpb24nKSB7IHJldHVybiB0cnVlOyB9XG4gIGlmIChfaXNudFN0cmluZyhvcmlnaW4pKSB7IHJldHVybiB0cnVlOyB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5fYXR0YWNoKCk7XG5cbmZyYW1lYnVzID0ge1xuICB0YXJnZXQ6IHRhcmdldCxcbiAgLy8gcmVtb3ZlSWYocHJvZHVjdGlvbilcbiAgX3BhY2thZ2VQYXlsb2FkOiBfcGFja2FnZVBheWxvYWQsXG4gIF91bnBhY2tQYXlsb2FkOiBfdW5wYWNrUGF5bG9hZCxcbiAgX2F0dGFjaDogX2F0dGFjaCxcbiAgX2RldGFjaDogX2RldGFjaCxcbiAgX2Rpc3BhdGNoOiBfZGlzcGF0Y2gsXG4gIF9icm9hZGNhc3Q6IF9icm9hZGNhc3QsXG4gIF9zdWJzY3JpYmVSZXBsaWVyOiBfc3Vic2NyaWJlUmVwbGllcixcbiAgX3N1YnNjcmlwdGlvbkFyZ3NJbnZhbGlkOiBfc3Vic2NyaXB0aW9uQXJnc0ludmFsaWQsXG4gIF9vbm1lc3NhZ2U6IF9vbm1lc3NhZ2UsXG4gIF91dWlkOiBfdXVpZCxcbiAgX2dldFN1YnNjcmliZXJzOiBmdW5jdGlvbiAoKSB7IHJldHVybiBzdWJzY3JpYmVyczsgfSxcbiAgX3dpbjogZnVuY3Rpb24gKCkgeyByZXR1cm4gd2luOyB9LFxuICAvLyBlbmRSZW1vdmVJZihwcm9kdWN0aW9uKVxuICBpbmNsdWRlOiBpbmNsdWRlLFxuICBwdWJsaXNoOiBwdWJsaXNoLFxuICBwdWI6IHB1Ymxpc2gsXG4gIHRyaWdnZXI6IHB1Ymxpc2gsXG4gIGVtaXQ6IHB1Ymxpc2gsXG4gIHN1YnNjcmliZTogc3Vic2NyaWJlLFxuICBzdWI6IHN1YnNjcmliZSxcbiAgb246IHN1YnNjcmliZSxcbiAgdW5zdWJzY3JpYmU6IHVuc3Vic2NyaWJlLFxuICB1bnN1YjogdW5zdWJzY3JpYmUsXG4gIG9mZjogdW5zdWJzY3JpYmVcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnJhbWVidXM7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc1doaXRlbGlzdGVkRG9tYWluID0gcmVxdWlyZSgnLi4vaXMtd2hpdGVsaXN0ZWQtZG9tYWluJyk7XG5cbmZ1bmN0aW9uIGNoZWNrT3JpZ2luKHBvc3RNZXNzYWdlT3JpZ2luLCBtZXJjaGFudFVybCkge1xuICB2YXIgbWVyY2hhbnRPcmlnaW4sIG1lcmNoYW50SG9zdDtcbiAgdmFyIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG5cbiAgYS5ocmVmID0gbWVyY2hhbnRVcmw7XG5cbiAgaWYgKGEucHJvdG9jb2wgPT09ICdodHRwczonKSB7XG4gICAgbWVyY2hhbnRIb3N0ID0gYS5ob3N0LnJlcGxhY2UoLzo0NDMkLywgJycpO1xuICB9IGVsc2UgaWYgKGEucHJvdG9jb2wgPT09ICdodHRwOicpIHtcbiAgICBtZXJjaGFudEhvc3QgPSBhLmhvc3QucmVwbGFjZSgvOjgwJC8sICcnKTtcbiAgfSBlbHNlIHtcbiAgICBtZXJjaGFudEhvc3QgPSBhLmhvc3Q7XG4gIH1cblxuICBtZXJjaGFudE9yaWdpbiA9IGEucHJvdG9jb2wgKyAnLy8nICsgbWVyY2hhbnRIb3N0O1xuXG4gIGlmIChtZXJjaGFudE9yaWdpbiA9PT0gcG9zdE1lc3NhZ2VPcmlnaW4pIHsgcmV0dXJuIHRydWU7IH1cblxuICBhLmhyZWYgPSBwb3N0TWVzc2FnZU9yaWdpbjtcblxuICByZXR1cm4gaXNXaGl0ZWxpc3RlZERvbWFpbihwb3N0TWVzc2FnZU9yaWdpbik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBjaGVja09yaWdpbjogY2hlY2tPcmlnaW5cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBlbnVtZXJhdGUgPSByZXF1aXJlKCcuLi9lbnVtZXJhdGUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBlbnVtZXJhdGUoW1xuICAnQ09ORklHVVJBVElPTl9SRVFVRVNUJ1xuXSwgJ2J1czonKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJ1cyA9IHJlcXVpcmUoJ2ZyYW1lYnVzJyk7XG52YXIgZXZlbnRzID0gcmVxdWlyZSgnLi9ldmVudHMnKTtcbnZhciBjaGVja09yaWdpbiA9IHJlcXVpcmUoJy4vY2hlY2stb3JpZ2luJykuY2hlY2tPcmlnaW47XG52YXIgU2VhbWxlc3NwYXlFcnJvciA9IHJlcXVpcmUoJy4uL3NlYW1sZXNzcGF5LWVycm9yJyk7XG5cbmZ1bmN0aW9uIFNlYW1sZXNzcGF5QnVzKG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgdGhpcy5jaGFubmVsID0gb3B0aW9ucy5jaGFubmVsO1xuICBpZiAoIXRoaXMuY2hhbm5lbCkge1xuICAgIHRocm93IG5ldyBTZWFtbGVzc3BheUVycm9yKHtcbiAgICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuSU5URVJOQUwsXG4gICAgICBjb2RlOiAnTUlTU0lOR19DSEFOTkVMX0lEJyxcbiAgICAgIG1lc3NhZ2U6ICdDaGFubmVsIElEIG11c3QgYmUgc3BlY2lmaWVkLidcbiAgICB9KTtcbiAgfVxuXG4gIHRoaXMubWVyY2hhbnRVcmwgPSBvcHRpb25zLm1lcmNoYW50VXJsO1xuXG4gIHRoaXMuX2lzRGVzdHJveWVkID0gZmFsc2U7XG4gIHRoaXMuX2lzVmVyYm9zZSA9IGZhbHNlO1xuXG4gIHRoaXMuX2xpc3RlbmVycyA9IFtdO1xuXG4gIHRoaXMuX2xvZygnbmV3IGJ1cyBvbiBjaGFubmVsICcgKyB0aGlzLmNoYW5uZWwsIFtsb2NhdGlvbi5ocmVmXSk7XG59XG5cblNlYW1sZXNzcGF5QnVzLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uIChldmVudE5hbWUsIG9yaWdpbmFsSGFuZGxlcikge1xuICB2YXIgbmFtZXNwYWNlZEV2ZW50LCBhcmdzO1xuICB2YXIgaGFuZGxlciA9IG9yaWdpbmFsSGFuZGxlcjtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIGlmICh0aGlzLl9pc0Rlc3Ryb3llZCkgeyByZXR1cm47IH1cblxuICBpZiAodGhpcy5tZXJjaGFudFVybCkge1xuICAgIGhhbmRsZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby1pbnZhbGlkLXRoaXMgKi9cbiAgICAgIGlmIChjaGVja09yaWdpbih0aGlzLm9yaWdpbiwgc2VsZi5tZXJjaGFudFVybCkpIHtcbiAgICAgICAgb3JpZ2luYWxIYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9XG4gICAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLWludmFsaWQtdGhpcyAqL1xuICAgIH07XG4gIH1cblxuICBuYW1lc3BhY2VkRXZlbnQgPSB0aGlzLl9uYW1lc3BhY2VFdmVudChldmVudE5hbWUpO1xuICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgYXJnc1swXSA9IG5hbWVzcGFjZWRFdmVudDtcbiAgYXJnc1sxXSA9IGhhbmRsZXI7XG5cbiAgdGhpcy5fbG9nKCdvbicsIGFyZ3MpO1xuICBidXMub24uYXBwbHkoYnVzLCBhcmdzKTtcblxuICB0aGlzLl9saXN0ZW5lcnMucHVzaCh7XG4gICAgZXZlbnROYW1lOiBldmVudE5hbWUsXG4gICAgaGFuZGxlcjogaGFuZGxlcixcbiAgICBvcmlnaW5hbEhhbmRsZXI6IG9yaWdpbmFsSGFuZGxlclxuICB9KTtcbn07XG5cblNlYW1sZXNzcGF5QnVzLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24gKGV2ZW50TmFtZSkge1xuICB2YXIgYXJncztcblxuICBpZiAodGhpcy5faXNEZXN0cm95ZWQpIHsgcmV0dXJuOyB9XG5cbiAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gIGFyZ3NbMF0gPSB0aGlzLl9uYW1lc3BhY2VFdmVudChldmVudE5hbWUpO1xuXG4gIHRoaXMuX2xvZygnZW1pdCcsIGFyZ3MpO1xuICBidXMuZW1pdC5hcHBseShidXMsIGFyZ3MpO1xufTtcblxuU2VhbWxlc3NwYXlCdXMucHJvdG90eXBlLl9vZmZEaXJlY3QgPSBmdW5jdGlvbiAoZXZlbnROYW1lKSB7XG4gIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcblxuICBpZiAodGhpcy5faXNEZXN0cm95ZWQpIHsgcmV0dXJuOyB9XG5cbiAgYXJnc1swXSA9IHRoaXMuX25hbWVzcGFjZUV2ZW50KGV2ZW50TmFtZSk7XG5cbiAgdGhpcy5fbG9nKCdvZmYnLCBhcmdzKTtcbiAgYnVzLm9mZi5hcHBseShidXMsIGFyZ3MpO1xufTtcblxuU2VhbWxlc3NwYXlCdXMucHJvdG90eXBlLm9mZiA9IGZ1bmN0aW9uIChldmVudE5hbWUsIG9yaWdpbmFsSGFuZGxlcikge1xuICB2YXIgaSwgbGlzdGVuZXI7XG4gIHZhciBoYW5kbGVyID0gb3JpZ2luYWxIYW5kbGVyO1xuXG4gIGlmICh0aGlzLl9pc0Rlc3Ryb3llZCkgeyByZXR1cm47IH1cblxuICBpZiAodGhpcy5tZXJjaGFudFVybCkge1xuICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLl9saXN0ZW5lcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxpc3RlbmVyID0gdGhpcy5fbGlzdGVuZXJzW2ldO1xuXG4gICAgICBpZiAobGlzdGVuZXIub3JpZ2luYWxIYW5kbGVyID09PSBvcmlnaW5hbEhhbmRsZXIpIHtcbiAgICAgICAgaGFuZGxlciA9IGxpc3RlbmVyLmhhbmRsZXI7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdGhpcy5fb2ZmRGlyZWN0KGV2ZW50TmFtZSwgaGFuZGxlcik7XG59O1xuXG5TZWFtbGVzc3BheUJ1cy5wcm90b3R5cGUuX25hbWVzcGFjZUV2ZW50ID0gZnVuY3Rpb24gKGV2ZW50TmFtZSkge1xuICByZXR1cm4gWydzZWFtbGVzc3BheScsIHRoaXMuY2hhbm5lbCwgZXZlbnROYW1lXS5qb2luKCc6Jyk7XG59O1xuXG5TZWFtbGVzc3BheUJ1cy5wcm90b3R5cGUudGVhcmRvd24gPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBsaXN0ZW5lciwgaTtcblxuICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5fbGlzdGVuZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgbGlzdGVuZXIgPSB0aGlzLl9saXN0ZW5lcnNbaV07XG4gICAgdGhpcy5fb2ZmRGlyZWN0KGxpc3RlbmVyLmV2ZW50TmFtZSwgbGlzdGVuZXIuaGFuZGxlcik7XG4gIH1cblxuICB0aGlzLl9saXN0ZW5lcnMubGVuZ3RoID0gMDtcblxuICB0aGlzLl9pc0Rlc3Ryb3llZCA9IHRydWU7XG59O1xuXG5TZWFtbGVzc3BheUJ1cy5wcm90b3R5cGUuX2xvZyA9IGZ1bmN0aW9uIChmdW5jdGlvbk5hbWUsIGFyZ3MpIHtcbiAgaWYgKHRoaXMuX2lzVmVyYm9zZSkge1xuICAgIGNvbnNvbGUubG9nKGZ1bmN0aW9uTmFtZSwgYXJncyk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICB9XG59O1xuXG5TZWFtbGVzc3BheUJ1cy5ldmVudHMgPSBldmVudHM7XG5cbm1vZHVsZS5leHBvcnRzID0gU2VhbWxlc3NwYXlCdXM7XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIGVudW1lcmF0ZSh2YWx1ZXMsIHByZWZpeCkge1xuICBwcmVmaXggPSBwcmVmaXggPT0gbnVsbCA/ICcnIDogcHJlZml4O1xuXG4gIHJldHVybiB2YWx1ZXMucmVkdWNlKGZ1bmN0aW9uIChlbnVtZXJhdGlvbiwgdmFsdWUpIHtcbiAgICBlbnVtZXJhdGlvblt2YWx1ZV0gPSBwcmVmaXggKyB2YWx1ZTtcbiAgICByZXR1cm4gZW51bWVyYXRpb247XG4gIH0sIHt9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBlbnVtZXJhdGU7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBCdXMgPSByZXF1aXJlKCcuLi8uLi8uLi9idXMnKTtcbnZhciBldmVudHMgPSByZXF1aXJlKCcuLi8uLi9zaGFyZWQvZXZlbnRzJyk7XG52YXIgY2xvbmUgPSByZXF1aXJlKCcuLi8uLi8uLi9qc29uLWNsb25lJyk7XG5cbmZ1bmN0aW9uIHN0YXJ0KCkge1xuICB2YXIgc2VydmljZUNoYW5uZWwgPSBnbG9iYWwubmFtZS5zcGxpdCgnXycpWzFdO1xuICB2YXIgY29uZmlndXJhdGlvbjtcblxuICBnbG9iYWwuYnVzID0gbmV3IEJ1cyh7Y2hhbm5lbDogc2VydmljZUNoYW5uZWx9KTtcbiAgZ2xvYmFsLmJ1cy5lbWl0KEJ1cy5ldmVudHMuQ09ORklHVVJBVElPTl9SRVFVRVNULCBmdW5jdGlvbiAobG9jYWxDb25maWd1cmF0aW9uKSB7XG4gICAgY29uZmlndXJhdGlvbiA9IGxvY2FsQ29uZmlndXJhdGlvbjtcbiAgICBnbG9iYWwuYnVzLmVtaXQoZXZlbnRzLkRJU1BBVENIX0ZSQU1FX1JFQURZKTtcbiAgfSk7XG4gIGdsb2JhbC5nZXRDb25maWd1cmF0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBjbG9uZShjb25maWd1cmF0aW9uKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHN0YXJ0OiBzdGFydFxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGVudW1lcmF0ZSA9IHJlcXVpcmUoJy4uLy4uL2VudW1lcmF0ZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGVudW1lcmF0ZShbXG4gICdESVNQQVRDSF9GUkFNRV9SRUFEWScsXG4gICdESVNQQVRDSF9GUkFNRV9SRVBPUlQnXG5dLCAnZnJhbWVTZXJ2aWNlOicpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQVBJX0hPU1QgPSB1bmRlZmluZWQ7XG52YXIgUEFOVkFVTFRfSE9TVCA9IHVuZGVmaW5lZDtcbnZhciBBU1NFVFNfSE9TVCA9IFwiaHR0cDovL2xvY2FsaG9zdDozMDAxL2RldlwiO1xuXG52YXIgbGVnYWxIb3N0cyA9IFtcbiAgJ3NlYW1sZXNzcGF5LmNvbScsXG4gICdzZWFtbGVzc3BheS5kZXYnLFxuICAnc2VhbWxlc3NwYXkuaW8nLFxuICAnd2ViLXNkay5zZWFtbGVzc3BheS5jb20nLFxuICAnYXBpLnNlYW1sZXNzcGF5LmNvbScsXG4gICdhcGkuc2VhbWxlc3NwYXkuZGV2JyxcbiAgJ2FwaS5zZWFtbGVzc3BheS5pbycsXG4gICdwYW4tdmF1bHQuc2VhbWxlc3NwYXkuY29tJyxcbiAgJ3Bhbi12YXVsdC5zZWFtbGVzc3BheS5kZXYnLFxuICAncGFuLXZhdWx0LnNlYW1sZXNzcGF5LmlvJyxcbiAgJ2FwaS5zYW5kYm94LnNlYW1sZXNzcGF5LmNvbScsXG4gICdhcGkuc2FuZGJveC5zZWFtbGVzc3BheS5kZXYnLFxuICAnYXBpLnNhbmRib3guc2VhbWxlc3NwYXkuaW8nLFxuICAncGFuLXZhdWx0LnNhbmRib3guc2VhbWxlc3NwYXkuY29tJyxcbiAgJ3Bhbi12YXVsdC5zYW5kYm94LnNlYW1sZXNzcGF5LmRldicsXG4gICdwYW4tdmF1bHQuc2FuZGJveC5zZWFtbGVzc3BheS5pbydcbl07XG5cbi8vIHJlbW92ZUlmKHByb2R1Y3Rpb24pXG5sZWdhbEhvc3RzLnB1c2goJ2xvY2FsaG9zdCcpO1xuaWYgKEFQSV9IT1NUKSB7XG4gIGxlZ2FsSG9zdHMucHVzaChzdHJpcFN1YmRvbWFpbnMoQVBJX0hPU1QpKTtcbn1cbmlmIChQQU5WQVVMVF9IT1NUKSB7XG4gIGxlZ2FsSG9zdHMucHVzaChzdHJpcFN1YmRvbWFpbnMoUEFOVkFVTFRfSE9TVCkpO1xufVxuaWYgKEFTU0VUU19IT1NUKSB7XG4gIGxlZ2FsSG9zdHMucHVzaChzdHJpcFN1YmRvbWFpbnMoQVNTRVRTX0hPU1QpLnJlcGxhY2UoJ2h0dHA6Ly8nLCAnJykucmVwbGFjZSgnaHR0cHM6Ly8nLCAnJykpO1xufVxuLy8gZW5kUmVtb3ZlSWYocHJvZHVjdGlvbilcblxuZnVuY3Rpb24gc3RyaXBTdWJkb21haW5zKGRvbWFpbikge1xuICByZXR1cm4gZG9tYWluLnNwbGl0KCcuJykuc2xpY2UoLTIpLmpvaW4oJy4nKTtcbn1cblxuZnVuY3Rpb24gaXNXaGl0ZWxpc3RlZERvbWFpbih1cmwpIHtcbiAgLy8gdmFyIG1haW5Eb21haW47XG5cbiAgLy8gdXJsID0gdXJsLnRvTG93ZXJDYXNlKCk7XG5cbiAgLy8gaWYgKCEobmV3IFJlZ0V4cCgnXmh0dHBzPzonKSkudGVzdCh1cmwpKSB7XG4gIC8vICAgcmV0dXJuIGZhbHNlO1xuICAvLyB9XG5cbiAgLy8gcGFyc2VyID0gcGFyc2VyIHx8IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgLy8gcGFyc2VyLmhyZWYgPSB1cmw7XG4gIC8vIG1haW5Eb21haW4gPSBzdHJpcFN1YmRvbWFpbnMocGFyc2VyLmhvc3RuYW1lKTtcbiAgdHJ5IHtcbiAgICB2YXIgcGFyc2VkVXJsID0gbmV3IFVSTCh1cmwpO1xuICAgIHJldHVybiBsZWdhbEhvc3RzLmluZGV4T2Yoc3RyaXBTdWJkb21haW5zKHBhcnNlZFVybC5ob3N0bmFtZSkpICE9PSAtMTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzV2hpdGVsaXN0ZWREb21haW47XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHZhbHVlKSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZW51bWVyYXRlID0gcmVxdWlyZSgnLi9lbnVtZXJhdGUnKTtcblxuLyoqXG4gKiBAY2xhc3NcbiAqIEBnbG9iYWxcbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIENvbnN0cnVjdGlvbiBvcHRpb25zXG4gKiBAY2xhc3NkZXNjIFRoaXMgY2xhc3MgaXMgdXNlZCB0byByZXBvcnQgZXJyb3IgY29uZGl0aW9ucywgZnJlcXVlbnRseSBhcyB0aGUgZmlyc3QgcGFyYW1ldGVyIHRvIGNhbGxiYWNrcyB0aHJvdWdob3V0IHRoZSBTZWFtbGVzc3BheSBTREsuXG4gKiBAZGVzY3JpcHRpb24gPHN0cm9uZz5Zb3UgY2Fubm90IHVzZSB0aGlzIGNvbnN0cnVjdG9yIGRpcmVjdGx5LiBJbnRlcmFjdCB3aXRoIGluc3RhbmNlcyBvZiB0aGlzIGNsYXNzIHRocm91Z2gge0BsaW5rIGNhbGxiYWNrIGNhbGxiYWNrc30uPC9zdHJvbmc+XG4gKi9cbmZ1bmN0aW9uIFNlYW1sZXNzcGF5RXJyb3Iob3B0aW9ucykge1xuICBpZiAoIVNlYW1sZXNzcGF5RXJyb3IudHlwZXMuaGFzT3duUHJvcGVydHkob3B0aW9ucy50eXBlKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihvcHRpb25zLnR5cGUgKyAnIGlzIG5vdCBhIHZhbGlkIHR5cGUuJyk7XG4gIH1cblxuICBpZiAoIW9wdGlvbnMuY29kZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignRXJyb3IgY29kZSByZXF1aXJlZC4nKTtcbiAgfVxuXG4gIGlmICghb3B0aW9ucy5tZXNzYWdlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdFcnJvciBtZXNzYWdlIHJlcXVpcmVkLicpO1xuICB9XG5cbiAgdGhpcy5uYW1lID0gJ1NlYW1sZXNzcGF5RXJyb3InO1xuXG4gIC8qKlxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKiBAZGVzY3JpcHRpb24gQSBjb2RlIHRoYXQgY29ycmVzcG9uZHMgdG8gc3BlY2lmaWMgZXJyb3JzLlxuICAgKi9cbiAgdGhpcy5jb2RlID0gb3B0aW9ucy5jb2RlO1xuXG4gIC8qKlxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKiBAZGVzY3JpcHRpb24gQSBzaG9ydCBkZXNjcmlwdGlvbiBvZiB0aGUgZXJyb3IuXG4gICAqL1xuICB0aGlzLm1lc3NhZ2UgPSBvcHRpb25zLm1lc3NhZ2U7XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtTZWFtbGVzc3BheUVycm9yLnR5cGVzfVxuICAgKiBAZGVzY3JpcHRpb24gVGhlIHR5cGUgb2YgZXJyb3IuXG4gICAqL1xuICB0aGlzLnR5cGUgPSBvcHRpb25zLnR5cGU7XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtvYmplY3Q9fVxuICAgKiBAZGVzY3JpcHRpb24gQWRkaXRpb25hbCBpbmZvcm1hdGlvbiBhYm91dCB0aGUgZXJyb3IsIHN1Y2ggYXMgYW4gdW5kZXJseWluZyBuZXR3b3JrIGVycm9yIHJlc3BvbnNlLlxuICAgKi9cbiAgdGhpcy5kZXRhaWxzID0gb3B0aW9ucy5kZXRhaWxzO1xufVxuXG5TZWFtbGVzc3BheUVycm9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlKTtcblNlYW1sZXNzcGF5RXJyb3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gU2VhbWxlc3NwYXlFcnJvcjtcblxuLyoqXG4gKiBFbnVtIGZvciB7QGxpbmsgU2VhbWxlc3NwYXlFcnJvcn0gdHlwZXMuXG4gKiBAbmFtZSBTZWFtbGVzc3BheUVycm9yLnR5cGVzXG4gKiBAZW51bVxuICogQHJlYWRvbmx5XG4gKiBAbWVtYmVyb2YgU2VhbWxlc3NwYXlFcnJvclxuICogQHByb3BlcnR5IHtzdHJpbmd9IENVU1RPTUVSIEFuIGVycm9yIGNhdXNlZCBieSB0aGUgY3VzdG9tZXIuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gTUVSQ0hBTlQgQW4gZXJyb3IgdGhhdCBpcyBhY3Rpb25hYmxlIGJ5IHRoZSBtZXJjaGFudC5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBORVRXT1JLIEFuIGVycm9yIGR1ZSB0byBhIG5ldHdvcmsgcHJvYmxlbS5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBJTlRFUk5BTCBBbiBlcnJvciBjYXVzZWQgYnkgU2VhbWxlc3NwYXkgY29kZS5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBVTktOT1dOIEFuIGVycm9yIHdoZXJlIHRoZSBvcmlnaW4gaXMgdW5rbm93bi5cbiAqL1xuU2VhbWxlc3NwYXlFcnJvci50eXBlcyA9IGVudW1lcmF0ZShbXG4gICdDVVNUT01FUicsXG4gICdNRVJDSEFOVCcsXG4gICdORVRXT1JLJyxcbiAgJ0lOVEVSTkFMJyxcbiAgJ1VOS05PV04nXG5dKTtcblxubW9kdWxlLmV4cG9ydHMgPSBTZWFtbGVzc3BheUVycm9yO1xuIl19
