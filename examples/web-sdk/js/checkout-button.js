(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.seamlesspay || (g.seamlesspay = {})).checkoutButton = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(_dereq_,module,exports){
'use strict';

var setAttributes = _dereq_('./lib/set-attributes');
var defaultAttributes = _dereq_('./lib/default-attributes');
var assign = _dereq_('./lib/assign');

module.exports = function createFrame(options) {
  var iframe = document.createElement('iframe');
  var config = assign({}, defaultAttributes, options);

  if (config.style && typeof config.style !== 'string') {
    assign(iframe.style, config.style);
    delete config.style;
  }

  setAttributes(iframe, config);

  if (!iframe.getAttribute('id')) {
    iframe.id = iframe.name;
  }

  return iframe;
};

},{"./lib/assign":2,"./lib/default-attributes":3,"./lib/set-attributes":4}],2:[function(_dereq_,module,exports){
'use strict';

module.exports = function assign(target) {
  var objs = Array.prototype.slice.call(arguments, 1);

  objs.forEach(function (obj) {
    if (typeof obj !== 'object') { return; }

    Object.keys(obj).forEach(function (key) {
      target[key] = obj[key];
    });
  });

  return target;
}

},{}],3:[function(_dereq_,module,exports){
'use strict';

module.exports = {
  src: 'about:blank',
  frameBorder: 0,
  allowtransparency: true,
  scrolling: 'no'
};

},{}],4:[function(_dereq_,module,exports){
'use strict';

module.exports = function setAttributes(element, attributes) {
  var value;

  for (var key in attributes) {
    if (attributes.hasOwnProperty(key)) {
      value = attributes[key];

      if (value == null) {
        element.removeAttribute(key);
      } else {
        element.setAttribute(key, value);
      }
    }
  }
};

},{}],5:[function(_dereq_,module,exports){
'use strict';

function deferred(fn) {
  return function () {
    // IE9 doesn't support passing arguments to setTimeout so we have to emulate it.
    var args = arguments;

    setTimeout(function () {
      fn.apply(null, args);
    }, 1);
  };
}

module.exports = deferred;

},{}],6:[function(_dereq_,module,exports){
'use strict';

function once(fn) {
  var called = false;

  return function () {
    if (!called) {
      called = true;
      fn.apply(null, arguments);
    }
  };
}

module.exports = once;

},{}],7:[function(_dereq_,module,exports){
'use strict';

function promiseOrCallback(promise, callback) { // eslint-disable-line consistent-return
  if (callback) {
    promise
      .then(function (data) {
        callback(null, data);
      })
      .catch(function (err) {
        callback(err);
      });
  } else {
    return promise;
  }
}

module.exports = promiseOrCallback;

},{}],8:[function(_dereq_,module,exports){
'use strict';

var deferred = _dereq_('./lib/deferred');
var once = _dereq_('./lib/once');
var promiseOrCallback = _dereq_('./lib/promise-or-callback');

function wrapPromise(fn) {
  return function () {
    var callback;
    var args = Array.prototype.slice.call(arguments);
    var lastArg = args[args.length - 1];

    if (typeof lastArg === 'function') {
      callback = args.pop();
      callback = once(deferred(callback));
    }
    return promiseOrCallback(fn.apply(this, args), callback); // eslint-disable-line no-invalid-this
  };
}

wrapPromise.wrapPrototype = function (target, options) {
  var methods, ignoreMethods, includePrivateMethods;

  options = options || {};
  ignoreMethods = options.ignoreMethods || [];
  includePrivateMethods = options.transformPrivateMethods === true;

  methods = Object.getOwnPropertyNames(target.prototype).filter(function (method) {
    var isNotPrivateMethod;
    var isNonConstructorFunction = method !== 'constructor' &&
      typeof target.prototype[method] === 'function';
    var isNotAnIgnoredMethod = ignoreMethods.indexOf(method) === -1;

    if (includePrivateMethods) {
      isNotPrivateMethod = true;
    } else {
      isNotPrivateMethod = method.charAt(0) !== '_';
    }

    return isNonConstructorFunction &&
      isNotPrivateMethod &&
      isNotAnIgnoredMethod;
  });

  methods.forEach(function (method) {
    var original = target.prototype[method];

    target.prototype[method] = wrapPromise(original);
  });

  return target;
};

module.exports = wrapPromise;

},{"./lib/deferred":5,"./lib/once":6,"./lib/promise-or-callback":7}],9:[function(_dereq_,module,exports){
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

},{}],10:[function(_dereq_,module,exports){
'use strict';

var Destructor = _dereq_('../../lib/destructor');
var iFramer = _dereq_('@braintree/iframer');
var Bus = _dereq_('../../lib/bus');
var SeamlesspayError = _dereq_('../../lib/seamlesspay-error');
var composeUrl = _dereq_('./compose-url');
var constants = _dereq_('../shared/constants');
var EventEmitter = _dereq_('../../lib/event-emitter');
var uuid = _dereq_('../../lib/uuid');
var injectFrame = _dereq_('./inject-frame');
var VERSION = "web-sdk";
var sharedErrors = _dereq_('../../lib/errors');
var errors = _dereq_('../shared/errors');

var events = constants.events;

/**
 * @class CheckoutButton
 * @param {object} options The Checkout Button {@link module:seamlesspay-web/checkout-button.create create} options.
 * @description <strong>Do not use this constructor directly. Use {@link module:seamlesspay-web/checkout-button.create|seamlesspay-web.checkout-button.create} instead.</strong>
 * @classdesc This class represents a Checkout Button component produced by {@link module:seamlesspay-web/checkout-button.create|seamlesspay-web/checkout-button.create}. Instances of this class have methods for interacting with the input fields within Checkout Button' iframes.
 */
function CheckoutButton(options) {
  var clientVersion, clientConfig;
  var self = this;
  var componentId = uuid();

  if (!options.client) {
    throw new SeamlesspayError({
      type: sharedErrors.INSTANTIATION_OPTION_REQUIRED.type,
      code: sharedErrors.INSTANTIATION_OPTION_REQUIRED.code,
      message: 'options.client is required when instantiating Checkout Button.'
    });
  }

  clientConfig = options.client.getConfiguration();
  clientVersion = clientConfig.analyticsMetadata.sdkVersion;
  if (clientVersion !== VERSION) {
    throw new SeamlesspayError({
      type: sharedErrors.INCOMPATIBLE_VERSIONS.type,
      code: sharedErrors.INCOMPATIBLE_VERSIONS.code,
      message: 'Client (version ' + clientVersion + ') and Checkout Button (version ' + VERSION + ') components must be from the same SDK version.'
    });
  }

  if (!options.amount) {
    throw new SeamlesspayError({
      type: sharedErrors.INSTANTIATION_OPTION_REQUIRED.type,
      code: sharedErrors.INSTANTIATION_OPTION_REQUIRED.code,
      message: 'options.amount is required when instantiating Checkout Button.'
    });
  }

  if (!options.formPath) {
    throw new SeamlesspayError({
      type: sharedErrors.INSTANTIATION_OPTION_REQUIRED.type,
      code: sharedErrors.INSTANTIATION_OPTION_REQUIRED.code,
      message: 'options.formPath is required when instantiating Checkout Button.'
    });
  }

  if (!options.selector) {
    throw new SeamlesspayError({
      type: sharedErrors.INSTANTIATION_OPTION_REQUIRED.type,
      code: sharedErrors.INSTANTIATION_OPTION_REQUIRED.code,
      message: 'options.selector is required when instantiating Checkout Button.'
    });
  }

  var key = constants.BUTTON_KEY;
  var container = document.querySelector(options.selector);

  if (!container) {
    throw new SeamlesspayError({
      type: errors.CHECKOUT_BUTTON_INVALID_FIELD_SELECTOR.type,
      code: errors.CHECKOUT_BUTTON_INVALID_FIELD_SELECTOR.code,
      message: errors.CHECKOUT_BUTTON_INVALID_FIELD_SELECTOR.message,
      details: {
        fieldSelector: options.selector,
        fieldKey: key
      }
    });
  }

  EventEmitter.call(this);

  this._injectedNodes = [];
  this._destructor = new Destructor();
  this._state = {};

  this._bus = new Bus({
    channel: componentId,
    merchantUrl: location.href
  });

  this._destructor.registerFunctionForTeardown(function () {
    self._bus.teardown();
  });

  this._client = options.client;

  var frame = iFramer({
    type: key,
    name: 'seamlesspay-checkout-button',
    style: {
      border: 'none',
      width: '100%',
      height: '100%',
      'float': 'left'
    }
  });

  this._injectedNodes = this._injectedNodes.concat(injectFrame(frame, container));

  this._state[key] = {
    isEmpty: true,
    isValid: false,
    isPotentiallyValid: true,
    isFocused: false,
    container: container
  };

  setTimeout(function () {
    frame.src = composeUrl(clientConfig, componentId, clientConfig.isDebug);
  }, 0);

  this._bus.on(events.FRAME_READY, function (reply) {
    reply(options);
    self._emit('ready');
  });

  this._destructor.registerFunctionForTeardown(
    function () {
      var j, node, parent;

      for (j = 0; j < self._injectedNodes.length; j++) {
        node = self._injectedNodes[j];
        parent = node.parentNode;

        parent.removeChild(node);
      }
    }
  );

}

CheckoutButton.prototype = Object.create(EventEmitter.prototype, {
  constructor: CheckoutButton
});

module.exports = CheckoutButton;

},{"../../lib/bus":19,"../../lib/destructor":20,"../../lib/errors":22,"../../lib/event-emitter":23,"../../lib/seamlesspay-error":27,"../../lib/uuid":28,"../shared/constants":14,"../shared/errors":15,"./compose-url":11,"./inject-frame":12,"@braintree/iframer":1}],11:[function(_dereq_,module,exports){
'use strict';
var constants = _dereq_('../shared/constants');

module.exports = function composeUrl(config, componentId, isDebug) {
  var assetsUrl = config.gatewayConfiguration.assetsUrl;

  if (isDebug) {
    assetsUrl = assetsUrl.replace('https', 'http');
  }
  var min = isDebug ? '' : '.min';

  return assetsUrl + '/' + constants.VERSION + '/html/checkout-button-frame' + min + '.html#' + componentId;
};

},{"../shared/constants":14}],12:[function(_dereq_,module,exports){
'use strict';

module.exports = function injectFrame(frame, container) {
  var clearboth = document.createElement('div');
  var fragment = document.createDocumentFragment();

  clearboth.style.clear = 'both';

  fragment.appendChild(frame);
  fragment.appendChild(clearboth);

  container.appendChild(fragment);

  return [frame, clearboth];
};

},{}],13:[function(_dereq_,module,exports){
'use strict';
/** @module seamlesspay-web/checkout-button */

var CheckoutButton = _dereq_('./external/checkout-button');
var wrapPromise = _dereq_('@braintree/wrap-promise');
var Promise = _dereq_('../lib/promise');

var VERSION = "web-sdk";

function create(options) {
  var integration;

  return new Promise(function (resolve) {
    integration = new CheckoutButton(options);

    integration.on('ready', function () {
      resolve(integration);
    });
  });
}

module.exports = {
  create: wrapPromise(create),
  /**
   * @description The current version of the SDK, i.e. `{@pkg version}`.
   * @type {string}
   */
  VERSION: VERSION
};

},{"../lib/promise":26,"./external/checkout-button":10,"@braintree/wrap-promise":8}],14:[function(_dereq_,module,exports){
var enumerate = _dereq_('../../lib/enumerate');

var VERSION = "web-sdk";
var BUTTON_KEY = 'checkout-button';
var BUTTON_TEXT = 'Pay Now';
var DEFAULT_STYLE = {
  webkitAppearance: 'button',
  color: '#fff',
  backgroundColor: '#1890ff',
  borderColor: '#1890ff',
  textShadow: '0 -1px 0 rgba(0, 0, 0, 0.12)',
  boxShadow: '0 2px 0 rgba(0, 0, 0, 0.045)',
  lineHeight: '1.499',
  position: 'relative',
  display: 'inline-block',
  fontWeight: 400,
  whiteSpace: 'nowrap',
  textAlign: 'center',
  backgroundImage: 'none',
  border: '1px solid transparent',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)',
  height: '32px',
  padding: '0 15px',
  fontSize: '14px',
  borderRadius: '4px',
  userSelect: 'none',
  touchAction: 'manipulation'
};

var events = enumerate(
  [ 'FRAME_READY'],
  'checkout-button:'
);

module.exports = {
  VERSION: VERSION,
  BUTTON_KEY: BUTTON_KEY,
  BUTTON_TEXT: BUTTON_TEXT,
  DEFAULT_STYLE: DEFAULT_STYLE,
  events: events
};


},{"../../lib/enumerate":21}],15:[function(_dereq_,module,exports){
'use strict';

var SeamlesspayError = _dereq_('../../lib/seamlesspay-error');

module.exports = {
  CHECKOUT_BUTTON_INVALID_FIELD_SELECTOR: {
    type: SeamlesspayError.types.MERCHANT,
    code: 'CHECKOUT_BUTTON_INVALID_FIELD_SELECTOR',
    message: 'Selector does not reference a valid DOM node.'
  }
};

},{"../../lib/seamlesspay-error":27}],16:[function(_dereq_,module,exports){
'use strict';

var once = _dereq_('./once');

function call(fn, callback) {
  var isSync = fn.length === 0;

  if (isSync) {
    fn();
    callback(null);
  } else {
    fn(callback);
  }
}

module.exports = function (functions, cb) {
  var i;
  var length = functions.length;
  var remaining = length;
  var callback = once(cb);

  if (length === 0) {
    callback(null);
    return;
  }

  function finish(err) {
    if (err) {
      callback(err);
      return;
    }

    remaining -= 1;
    if (remaining === 0) {
      callback(null);
    }
  }

  for (i = 0; i < length; i++) {
    call(functions[i], finish);
  }
};

},{"./once":25}],17:[function(_dereq_,module,exports){
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

},{"../is-whitelisted-domain":24}],18:[function(_dereq_,module,exports){
'use strict';

var enumerate = _dereq_('../enumerate');

module.exports = enumerate([
  'CONFIGURATION_REQUEST'
], 'bus:');

},{"../enumerate":21}],19:[function(_dereq_,module,exports){
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

},{"../seamlesspay-error":27,"./check-origin":17,"./events":18,"framebus":9}],20:[function(_dereq_,module,exports){
'use strict';

var batchExecuteFunctions = _dereq_('./batch-execute-functions');

function Destructor() {
  this._teardownRegistry = [];

  this._isTearingDown = false;
}

Destructor.prototype.registerFunctionForTeardown = function (fn) {
  if (typeof fn === 'function') {
    this._teardownRegistry.push(fn);
  }
};

Destructor.prototype.teardown = function (callback) {
  if (this._isTearingDown) {
    callback(new Error('Destructor is already tearing down'));
    return;
  }

  this._isTearingDown = true;

  batchExecuteFunctions(this._teardownRegistry, function (err) {
    this._teardownRegistry = [];
    this._isTearingDown = false;

    if (typeof callback === 'function') {
      callback(err);
    }
  }.bind(this));
};

module.exports = Destructor;

},{"./batch-execute-functions":16}],21:[function(_dereq_,module,exports){
'use strict';

function enumerate(values, prefix) {
  prefix = prefix == null ? '' : prefix;

  return values.reduce(function (enumeration, value) {
    enumeration[value] = prefix + value;
    return enumeration;
  }, {});
}

module.exports = enumerate;

},{}],22:[function(_dereq_,module,exports){
'use strict';

var SeamlesspayError = _dereq_('./seamlesspay-error');

module.exports = {
  INVALID_USE_OF_INTERNAL_FUNCTION: {
    type: SeamlesspayError.types.INTERNAL,
    code: 'INVALID_USE_OF_INTERNAL_FUNCTION'
  },
  CALLBACK_REQUIRED: {
    type: SeamlesspayError.types.MERCHANT,
    code: 'CALLBACK_REQUIRED'
  },
  INSTANTIATION_OPTION_REQUIRED: {
    type: SeamlesspayError.types.MERCHANT,
    code: 'INSTANTIATION_OPTION_REQUIRED'
  },
  INVALID_OPTION: {
    type: SeamlesspayError.types.MERCHANT,
    code: 'INVALID_OPTION'
  },
  INCOMPATIBLE_VERSIONS: {
    type: SeamlesspayError.types.MERCHANT,
    code: 'INCOMPATIBLE_VERSIONS'
  },
  INCOMPATIBLE_FIELDS_SET: {
    type: SeamlesspayError.types.MERCHANT,
    code: 'INCOMPATIBLE_FIELDS_SET'
  },
  METHOD_CALLED_AFTER_TEARDOWN: {
    type: SeamlesspayError.types.MERCHANT,
    code: 'METHOD_CALLED_AFTER_TEARDOWN'
  },
  SEAMLESSPAY_API_ACCESS_RESTRICTED: {
    type: SeamlesspayError.types.MERCHANT,
    code: 'SEAMLESSPAY_API_ACCESS_RESTRICTED',
    message: 'Your access is restricted and cannot use this part of the Seamlesspay API.'
  },
  SEAMLESSPAY_PAYPAL_NOT_LOADED: {
    type: SeamlesspayError.types.INTERNAL,
    code: 'SEAMLESSPAY_PAYPAL_NOT_LOADED',
    message: 'Paypal SDK could not be loaded.'
  },
  INVALID_LATIN1_STRING: {
    type: SeamlesspayError.types.INTERNAL,
    code: 'INVALID_LATIN1_STRING'
  }
};

},{"./seamlesspay-error":27}],23:[function(_dereq_,module,exports){
'use strict';

function EventEmitter() {
  this._events = {};
}

EventEmitter.prototype.on = function (event, callback) {
  if (this._events[event]) {
    this._events[event].push(callback);
  } else {
    this._events[event] = [callback];
  }
};

EventEmitter.prototype._emit = function (event) {
  var i, args;
  var callbacks = this._events[event];

  if (!callbacks) { return; }

  args = Array.prototype.slice.call(arguments, 1);

  for (i = 0; i < callbacks.length; i++) {
    callbacks[i].apply(null, args);
  }
};

module.exports = EventEmitter;

},{}],24:[function(_dereq_,module,exports){
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

},{}],25:[function(_dereq_,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],26:[function(_dereq_,module,exports){
(function (global){(function (){
'use strict';

var Promise = global.Promise;

module.exports = Promise;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],27:[function(_dereq_,module,exports){
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

},{"./enumerate":21}],28:[function(_dereq_,module,exports){
'use strict';

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : r & 0x3 | 0x8;

    return v.toString(16);
  });
}

module.exports = uuid;

},{}]},{},[13])(13)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvQGJyYWludHJlZS9pZnJhbWVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL0BicmFpbnRyZWUvaWZyYW1lci9saWIvYXNzaWduLmpzIiwibm9kZV9tb2R1bGVzL0BicmFpbnRyZWUvaWZyYW1lci9saWIvZGVmYXVsdC1hdHRyaWJ1dGVzLmpzIiwibm9kZV9tb2R1bGVzL0BicmFpbnRyZWUvaWZyYW1lci9saWIvc2V0LWF0dHJpYnV0ZXMuanMiLCJub2RlX21vZHVsZXMvQGJyYWludHJlZS93cmFwLXByb21pc2UvbGliL2RlZmVycmVkLmpzIiwibm9kZV9tb2R1bGVzL0BicmFpbnRyZWUvd3JhcC1wcm9taXNlL2xpYi9vbmNlLmpzIiwibm9kZV9tb2R1bGVzL0BicmFpbnRyZWUvd3JhcC1wcm9taXNlL2xpYi9wcm9taXNlLW9yLWNhbGxiYWNrLmpzIiwibm9kZV9tb2R1bGVzL0BicmFpbnRyZWUvd3JhcC1wcm9taXNlL3dyYXAtcHJvbWlzZS5qcyIsIm5vZGVfbW9kdWxlcy9mcmFtZWJ1cy9saWIvZnJhbWVidXMuanMiLCJzcmMvY2hlY2tvdXQtYnV0dG9uL2V4dGVybmFsL2NoZWNrb3V0LWJ1dHRvbi5qcyIsInNyYy9jaGVja291dC1idXR0b24vZXh0ZXJuYWwvY29tcG9zZS11cmwuanMiLCJzcmMvY2hlY2tvdXQtYnV0dG9uL2V4dGVybmFsL2luamVjdC1mcmFtZS5qcyIsInNyYy9jaGVja291dC1idXR0b24vaW5kZXguanMiLCJzcmMvY2hlY2tvdXQtYnV0dG9uL3NoYXJlZC9jb25zdGFudHMuanMiLCJzcmMvY2hlY2tvdXQtYnV0dG9uL3NoYXJlZC9lcnJvcnMuanMiLCJzcmMvbGliL2JhdGNoLWV4ZWN1dGUtZnVuY3Rpb25zLmpzIiwic3JjL2xpYi9idXMvY2hlY2stb3JpZ2luLmpzIiwic3JjL2xpYi9idXMvZXZlbnRzLmpzIiwic3JjL2xpYi9idXMvaW5kZXguanMiLCJzcmMvbGliL2Rlc3RydWN0b3IuanMiLCJzcmMvbGliL2VudW1lcmF0ZS5qcyIsInNyYy9saWIvZXJyb3JzLmpzIiwic3JjL2xpYi9ldmVudC1lbWl0dGVyLmpzIiwic3JjL2xpYi9pcy13aGl0ZWxpc3RlZC1kb21haW4uanMiLCJzcmMvbGliL3Byb21pc2UuanMiLCJzcmMvbGliL3NlYW1sZXNzcGF5LWVycm9yLmpzIiwic3JjL2xpYi91dWlkLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDdFRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBzZXRBdHRyaWJ1dGVzID0gcmVxdWlyZSgnLi9saWIvc2V0LWF0dHJpYnV0ZXMnKTtcbnZhciBkZWZhdWx0QXR0cmlidXRlcyA9IHJlcXVpcmUoJy4vbGliL2RlZmF1bHQtYXR0cmlidXRlcycpO1xudmFyIGFzc2lnbiA9IHJlcXVpcmUoJy4vbGliL2Fzc2lnbicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUZyYW1lKG9wdGlvbnMpIHtcbiAgdmFyIGlmcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScpO1xuICB2YXIgY29uZmlnID0gYXNzaWduKHt9LCBkZWZhdWx0QXR0cmlidXRlcywgb3B0aW9ucyk7XG5cbiAgaWYgKGNvbmZpZy5zdHlsZSAmJiB0eXBlb2YgY29uZmlnLnN0eWxlICE9PSAnc3RyaW5nJykge1xuICAgIGFzc2lnbihpZnJhbWUuc3R5bGUsIGNvbmZpZy5zdHlsZSk7XG4gICAgZGVsZXRlIGNvbmZpZy5zdHlsZTtcbiAgfVxuXG4gIHNldEF0dHJpYnV0ZXMoaWZyYW1lLCBjb25maWcpO1xuXG4gIGlmICghaWZyYW1lLmdldEF0dHJpYnV0ZSgnaWQnKSkge1xuICAgIGlmcmFtZS5pZCA9IGlmcmFtZS5uYW1lO1xuICB9XG5cbiAgcmV0dXJuIGlmcmFtZTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXNzaWduKHRhcmdldCkge1xuICB2YXIgb2JqcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG5cbiAgb2Jqcy5mb3JFYWNoKGZ1bmN0aW9uIChvYmopIHtcbiAgICBpZiAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHsgcmV0dXJuOyB9XG5cbiAgICBPYmplY3Qua2V5cyhvYmopLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgdGFyZ2V0W2tleV0gPSBvYmpba2V5XTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgcmV0dXJuIHRhcmdldDtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNyYzogJ2Fib3V0OmJsYW5rJyxcbiAgZnJhbWVCb3JkZXI6IDAsXG4gIGFsbG93dHJhbnNwYXJlbmN5OiB0cnVlLFxuICBzY3JvbGxpbmc6ICdubydcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc2V0QXR0cmlidXRlcyhlbGVtZW50LCBhdHRyaWJ1dGVzKSB7XG4gIHZhciB2YWx1ZTtcblxuICBmb3IgKHZhciBrZXkgaW4gYXR0cmlidXRlcykge1xuICAgIGlmIChhdHRyaWJ1dGVzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIHZhbHVlID0gYXR0cmlidXRlc1trZXldO1xuXG4gICAgICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgICAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShrZXkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoa2V5LCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBkZWZlcnJlZChmbikge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIC8vIElFOSBkb2Vzbid0IHN1cHBvcnQgcGFzc2luZyBhcmd1bWVudHMgdG8gc2V0VGltZW91dCBzbyB3ZSBoYXZlIHRvIGVtdWxhdGUgaXQuXG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG5cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGZuLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgIH0sIDEpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlZmVycmVkO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBvbmNlKGZuKSB7XG4gIHZhciBjYWxsZWQgPSBmYWxzZTtcblxuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGlmICghY2FsbGVkKSB7XG4gICAgICBjYWxsZWQgPSB0cnVlO1xuICAgICAgZm4uYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICB9XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb25jZTtcbiIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gcHJvbWlzZU9yQ2FsbGJhY2socHJvbWlzZSwgY2FsbGJhY2spIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBjb25zaXN0ZW50LXJldHVyblxuICBpZiAoY2FsbGJhY2spIHtcbiAgICBwcm9taXNlXG4gICAgICAudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBjYWxsYmFjayhudWxsLCBkYXRhKTtcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwcm9taXNlT3JDYWxsYmFjaztcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGRlZmVycmVkID0gcmVxdWlyZSgnLi9saWIvZGVmZXJyZWQnKTtcbnZhciBvbmNlID0gcmVxdWlyZSgnLi9saWIvb25jZScpO1xudmFyIHByb21pc2VPckNhbGxiYWNrID0gcmVxdWlyZSgnLi9saWIvcHJvbWlzZS1vci1jYWxsYmFjaycpO1xuXG5mdW5jdGlvbiB3cmFwUHJvbWlzZShmbikge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHZhciBjYWxsYmFjaztcbiAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgdmFyIGxhc3RBcmcgPSBhcmdzW2FyZ3MubGVuZ3RoIC0gMV07XG5cbiAgICBpZiAodHlwZW9mIGxhc3RBcmcgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNhbGxiYWNrID0gYXJncy5wb3AoKTtcbiAgICAgIGNhbGxiYWNrID0gb25jZShkZWZlcnJlZChjYWxsYmFjaykpO1xuICAgIH1cbiAgICByZXR1cm4gcHJvbWlzZU9yQ2FsbGJhY2soZm4uYXBwbHkodGhpcywgYXJncyksIGNhbGxiYWNrKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1pbnZhbGlkLXRoaXNcbiAgfTtcbn1cblxud3JhcFByb21pc2Uud3JhcFByb3RvdHlwZSA9IGZ1bmN0aW9uICh0YXJnZXQsIG9wdGlvbnMpIHtcbiAgdmFyIG1ldGhvZHMsIGlnbm9yZU1ldGhvZHMsIGluY2x1ZGVQcml2YXRlTWV0aG9kcztcblxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgaWdub3JlTWV0aG9kcyA9IG9wdGlvbnMuaWdub3JlTWV0aG9kcyB8fCBbXTtcbiAgaW5jbHVkZVByaXZhdGVNZXRob2RzID0gb3B0aW9ucy50cmFuc2Zvcm1Qcml2YXRlTWV0aG9kcyA9PT0gdHJ1ZTtcblxuICBtZXRob2RzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGFyZ2V0LnByb3RvdHlwZSkuZmlsdGVyKGZ1bmN0aW9uIChtZXRob2QpIHtcbiAgICB2YXIgaXNOb3RQcml2YXRlTWV0aG9kO1xuICAgIHZhciBpc05vbkNvbnN0cnVjdG9yRnVuY3Rpb24gPSBtZXRob2QgIT09ICdjb25zdHJ1Y3RvcicgJiZcbiAgICAgIHR5cGVvZiB0YXJnZXQucHJvdG90eXBlW21ldGhvZF0gPT09ICdmdW5jdGlvbic7XG4gICAgdmFyIGlzTm90QW5JZ25vcmVkTWV0aG9kID0gaWdub3JlTWV0aG9kcy5pbmRleE9mKG1ldGhvZCkgPT09IC0xO1xuXG4gICAgaWYgKGluY2x1ZGVQcml2YXRlTWV0aG9kcykge1xuICAgICAgaXNOb3RQcml2YXRlTWV0aG9kID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaXNOb3RQcml2YXRlTWV0aG9kID0gbWV0aG9kLmNoYXJBdCgwKSAhPT0gJ18nO1xuICAgIH1cblxuICAgIHJldHVybiBpc05vbkNvbnN0cnVjdG9yRnVuY3Rpb24gJiZcbiAgICAgIGlzTm90UHJpdmF0ZU1ldGhvZCAmJlxuICAgICAgaXNOb3RBbklnbm9yZWRNZXRob2Q7XG4gIH0pO1xuXG4gIG1ldGhvZHMuZm9yRWFjaChmdW5jdGlvbiAobWV0aG9kKSB7XG4gICAgdmFyIG9yaWdpbmFsID0gdGFyZ2V0LnByb3RvdHlwZVttZXRob2RdO1xuXG4gICAgdGFyZ2V0LnByb3RvdHlwZVttZXRob2RdID0gd3JhcFByb21pc2Uob3JpZ2luYWwpO1xuICB9KTtcblxuICByZXR1cm4gdGFyZ2V0O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB3cmFwUHJvbWlzZTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHdpbiwgZnJhbWVidXM7XG52YXIgcG9wdXBzID0gW107XG52YXIgc3Vic2NyaWJlcnMgPSB7fTtcbnZhciBwcmVmaXggPSAnLypmcmFtZWJ1cyovJztcblxuZnVuY3Rpb24gaW5jbHVkZShwb3B1cCkge1xuICBpZiAocG9wdXAgPT0gbnVsbCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYgKHBvcHVwLldpbmRvdyA9PSBudWxsKSB7IHJldHVybiBmYWxzZTsgfVxuICBpZiAocG9wdXAuY29uc3RydWN0b3IgIT09IHBvcHVwLldpbmRvdykgeyByZXR1cm4gZmFsc2U7IH1cblxuICBwb3B1cHMucHVzaChwb3B1cCk7XG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiB0YXJnZXQob3JpZ2luKSB7XG4gIHZhciBrZXk7XG4gIHZhciB0YXJnZXRlZEZyYW1lYnVzID0ge307XG5cbiAgZm9yIChrZXkgaW4gZnJhbWVidXMpIHtcbiAgICBpZiAoIWZyYW1lYnVzLmhhc093blByb3BlcnR5KGtleSkpIHsgY29udGludWU7IH1cblxuICAgIHRhcmdldGVkRnJhbWVidXNba2V5XSA9IGZyYW1lYnVzW2tleV07XG4gIH1cblxuICB0YXJnZXRlZEZyYW1lYnVzLl9vcmlnaW4gPSBvcmlnaW4gfHwgJyonO1xuXG4gIHJldHVybiB0YXJnZXRlZEZyYW1lYnVzO1xufVxuXG5mdW5jdGlvbiBwdWJsaXNoKGV2ZW50KSB7XG4gIHZhciBwYXlsb2FkLCBhcmdzO1xuICB2YXIgb3JpZ2luID0gX2dldE9yaWdpbih0aGlzKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1pbnZhbGlkLXRoaXNcblxuICBpZiAoX2lzbnRTdHJpbmcoZXZlbnQpKSB7IHJldHVybiBmYWxzZTsgfVxuICBpZiAoX2lzbnRTdHJpbmcob3JpZ2luKSkgeyByZXR1cm4gZmFsc2U7IH1cblxuICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcblxuICBwYXlsb2FkID0gX3BhY2thZ2VQYXlsb2FkKGV2ZW50LCBhcmdzLCBvcmlnaW4pO1xuICBpZiAocGF5bG9hZCA9PT0gZmFsc2UpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgX2Jyb2FkY2FzdCh3aW4udG9wIHx8IHdpbi5zZWxmLCBwYXlsb2FkLCBvcmlnaW4pO1xuXG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBzdWJzY3JpYmUoZXZlbnQsIGZuKSB7XG4gIHZhciBvcmlnaW4gPSBfZ2V0T3JpZ2luKHRoaXMpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWludmFsaWQtdGhpc1xuXG4gIGlmIChfc3Vic2NyaXB0aW9uQXJnc0ludmFsaWQoZXZlbnQsIGZuLCBvcmlnaW4pKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIHN1YnNjcmliZXJzW29yaWdpbl0gPSBzdWJzY3JpYmVyc1tvcmlnaW5dIHx8IHt9O1xuICBzdWJzY3JpYmVyc1tvcmlnaW5dW2V2ZW50XSA9IHN1YnNjcmliZXJzW29yaWdpbl1bZXZlbnRdIHx8IFtdO1xuICBzdWJzY3JpYmVyc1tvcmlnaW5dW2V2ZW50XS5wdXNoKGZuKTtcblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gdW5zdWJzY3JpYmUoZXZlbnQsIGZuKSB7XG4gIHZhciBpLCBzdWJzY3JpYmVyTGlzdDtcbiAgdmFyIG9yaWdpbiA9IF9nZXRPcmlnaW4odGhpcyk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8taW52YWxpZC10aGlzXG5cbiAgaWYgKF9zdWJzY3JpcHRpb25BcmdzSW52YWxpZChldmVudCwgZm4sIG9yaWdpbikpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgc3Vic2NyaWJlckxpc3QgPSBzdWJzY3JpYmVyc1tvcmlnaW5dICYmIHN1YnNjcmliZXJzW29yaWdpbl1bZXZlbnRdO1xuICBpZiAoIXN1YnNjcmliZXJMaXN0KSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIGZvciAoaSA9IDA7IGkgPCBzdWJzY3JpYmVyTGlzdC5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdWJzY3JpYmVyTGlzdFtpXSA9PT0gZm4pIHtcbiAgICAgIHN1YnNjcmliZXJMaXN0LnNwbGljZShpLCAxKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gX2dldE9yaWdpbihzY29wZSkge1xuICByZXR1cm4gc2NvcGUgJiYgc2NvcGUuX29yaWdpbiB8fCAnKic7XG59XG5cbmZ1bmN0aW9uIF9pc250U3RyaW5nKHN0cmluZykge1xuICByZXR1cm4gdHlwZW9mIHN0cmluZyAhPT0gJ3N0cmluZyc7XG59XG5cbmZ1bmN0aW9uIF9wYWNrYWdlUGF5bG9hZChldmVudCwgYXJncywgb3JpZ2luKSB7XG4gIHZhciBwYWNrYWdlZCA9IGZhbHNlO1xuICB2YXIgcGF5bG9hZCA9IHtcbiAgICBldmVudDogZXZlbnQsXG4gICAgb3JpZ2luOiBvcmlnaW5cbiAgfTtcbiAgdmFyIHJlcGx5ID0gYXJnc1thcmdzLmxlbmd0aCAtIDFdO1xuXG4gIGlmICh0eXBlb2YgcmVwbHkgPT09ICdmdW5jdGlvbicpIHtcbiAgICBwYXlsb2FkLnJlcGx5ID0gX3N1YnNjcmliZVJlcGxpZXIocmVwbHksIG9yaWdpbik7XG4gICAgYXJncyA9IGFyZ3Muc2xpY2UoMCwgLTEpO1xuICB9XG5cbiAgcGF5bG9hZC5hcmdzID0gYXJncztcblxuICB0cnkge1xuICAgIHBhY2thZ2VkID0gcHJlZml4ICsgSlNPTi5zdHJpbmdpZnkocGF5bG9hZCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvdWxkIG5vdCBzdHJpbmdpZnkgZXZlbnQ6ICcgKyBlLm1lc3NhZ2UpO1xuICB9XG4gIHJldHVybiBwYWNrYWdlZDtcbn1cblxuZnVuY3Rpb24gX3VucGFja1BheWxvYWQoZSkge1xuICB2YXIgcGF5bG9hZCwgcmVwbHlPcmlnaW4sIHJlcGx5U291cmNlLCByZXBseUV2ZW50O1xuXG4gIGlmIChlLmRhdGEuc2xpY2UoMCwgcHJlZml4Lmxlbmd0aCkgIT09IHByZWZpeCkgeyByZXR1cm4gZmFsc2U7IH1cblxuICB0cnkge1xuICAgIHBheWxvYWQgPSBKU09OLnBhcnNlKGUuZGF0YS5zbGljZShwcmVmaXgubGVuZ3RoKSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChwYXlsb2FkLnJlcGx5ICE9IG51bGwpIHtcbiAgICByZXBseU9yaWdpbiA9IGUub3JpZ2luO1xuICAgIHJlcGx5U291cmNlID0gZS5zb3VyY2U7XG4gICAgcmVwbHlFdmVudCA9IHBheWxvYWQucmVwbHk7XG5cbiAgICBwYXlsb2FkLnJlcGx5ID0gZnVuY3Rpb24gcmVwbHkoZGF0YSkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGNvbnNpc3RlbnQtcmV0dXJuXG4gICAgICB2YXIgcmVwbHlQYXlsb2FkO1xuXG4gICAgICBpZiAoIXJlcGx5U291cmNlKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gICAgICByZXBseVBheWxvYWQgPSBfcGFja2FnZVBheWxvYWQocmVwbHlFdmVudCwgW2RhdGFdLCByZXBseU9yaWdpbik7XG5cbiAgICAgIGlmIChyZXBseVBheWxvYWQgPT09IGZhbHNlKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gICAgICByZXBseVNvdXJjZS5wb3N0TWVzc2FnZShyZXBseVBheWxvYWQsIHJlcGx5T3JpZ2luKTtcbiAgICB9O1xuXG4gICAgcGF5bG9hZC5hcmdzLnB1c2gocGF5bG9hZC5yZXBseSk7XG4gIH1cblxuICByZXR1cm4gcGF5bG9hZDtcbn1cblxuZnVuY3Rpb24gX2F0dGFjaCh3KSB7XG4gIGlmICh3aW4pIHsgcmV0dXJuOyB9XG4gIHdpbiA9IHcgfHwgZ2xvYmFsO1xuXG4gIGlmICh3aW4uYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgIHdpbi5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgX29ubWVzc2FnZSwgZmFsc2UpO1xuICB9IGVsc2UgaWYgKHdpbi5hdHRhY2hFdmVudCkge1xuICAgIHdpbi5hdHRhY2hFdmVudCgnb25tZXNzYWdlJywgX29ubWVzc2FnZSk7XG4gIH0gZWxzZSBpZiAod2luLm9ubWVzc2FnZSA9PT0gbnVsbCkge1xuICAgIHdpbi5vbm1lc3NhZ2UgPSBfb25tZXNzYWdlO1xuICB9IGVsc2Uge1xuICAgIHdpbiA9IG51bGw7XG4gIH1cbn1cblxuLy8gcmVtb3ZlSWYocHJvZHVjdGlvbilcbmZ1bmN0aW9uIF9kZXRhY2goKSB7XG4gIGlmICh3aW4gPT0gbnVsbCkgeyByZXR1cm47IH1cblxuICBpZiAod2luLnJlbW92ZUV2ZW50TGlzdGVuZXIpIHtcbiAgICB3aW4ucmVtb3ZlRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIF9vbm1lc3NhZ2UsIGZhbHNlKTtcbiAgfSBlbHNlIGlmICh3aW4uZGV0YWNoRXZlbnQpIHtcbiAgICB3aW4uZGV0YWNoRXZlbnQoJ29ubWVzc2FnZScsIF9vbm1lc3NhZ2UpO1xuICB9IGVsc2UgaWYgKHdpbi5vbm1lc3NhZ2UgPT09IF9vbm1lc3NhZ2UpIHtcbiAgICB3aW4ub25tZXNzYWdlID0gbnVsbDtcbiAgfVxuXG4gIHdpbiA9IG51bGw7XG4gIHBvcHVwcyA9IFtdO1xuICBzdWJzY3JpYmVycyA9IHt9O1xufVxuLy8gZW5kUmVtb3ZlSWYocHJvZHVjdGlvbilcblxuZnVuY3Rpb24gX3V1aWQoKSB7XG4gIHJldHVybiAneHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4Jy5yZXBsYWNlKC9beHldL2csIGZ1bmN0aW9uIChjKSB7XG4gICAgdmFyIHIgPSBNYXRoLnJhbmRvbSgpICogMTYgfCAwO1xuICAgIHZhciB2ID0gYyA9PT0gJ3gnID8gciA6IHIgJiAweDMgfCAweDg7XG5cbiAgICByZXR1cm4gdi50b1N0cmluZygxNik7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBfb25tZXNzYWdlKGUpIHtcbiAgdmFyIHBheWxvYWQ7XG5cbiAgaWYgKF9pc250U3RyaW5nKGUuZGF0YSkpIHsgcmV0dXJuOyB9XG5cbiAgcGF5bG9hZCA9IF91bnBhY2tQYXlsb2FkKGUpO1xuICBpZiAoIXBheWxvYWQpIHsgcmV0dXJuOyB9XG5cbiAgX2Rpc3BhdGNoKCcqJywgcGF5bG9hZC5ldmVudCwgcGF5bG9hZC5hcmdzLCBlKTtcbiAgX2Rpc3BhdGNoKGUub3JpZ2luLCBwYXlsb2FkLmV2ZW50LCBwYXlsb2FkLmFyZ3MsIGUpO1xuICBfYnJvYWRjYXN0UG9wdXBzKGUuZGF0YSwgcGF5bG9hZC5vcmlnaW4sIGUuc291cmNlKTtcbn1cblxuZnVuY3Rpb24gX2Rpc3BhdGNoKG9yaWdpbiwgZXZlbnQsIGFyZ3MsIGUpIHtcbiAgdmFyIGk7XG5cbiAgaWYgKCFzdWJzY3JpYmVyc1tvcmlnaW5dKSB7IHJldHVybjsgfVxuICBpZiAoIXN1YnNjcmliZXJzW29yaWdpbl1bZXZlbnRdKSB7IHJldHVybjsgfVxuXG4gIGZvciAoaSA9IDA7IGkgPCBzdWJzY3JpYmVyc1tvcmlnaW5dW2V2ZW50XS5sZW5ndGg7IGkrKykge1xuICAgIHN1YnNjcmliZXJzW29yaWdpbl1bZXZlbnRdW2ldLmFwcGx5KGUsIGFyZ3MpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9oYXNPcGVuZXIoZnJhbWUpIHtcbiAgaWYgKGZyYW1lLnRvcCAhPT0gZnJhbWUpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIGlmIChmcmFtZS5vcGVuZXIgPT0gbnVsbCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYgKGZyYW1lLm9wZW5lciA9PT0gZnJhbWUpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIGlmIChmcmFtZS5vcGVuZXIuY2xvc2VkID09PSB0cnVlKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBfYnJvYWRjYXN0KGZyYW1lLCBwYXlsb2FkLCBvcmlnaW4pIHtcbiAgdmFyIGkgPSAwO1xuICB2YXIgZnJhbWVUb0Jyb2FkY2FzdFRvO1xuXG4gIHRyeSB7XG4gICAgZnJhbWUucG9zdE1lc3NhZ2UocGF5bG9hZCwgb3JpZ2luKTtcblxuICAgIGlmIChfaGFzT3BlbmVyKGZyYW1lKSkge1xuICAgICAgX2Jyb2FkY2FzdChmcmFtZS5vcGVuZXIudG9wLCBwYXlsb2FkLCBvcmlnaW4pO1xuICAgIH1cblxuICAgIC8vIHByZXZpb3VzbHksIG91ciBtYXggdmFsdWUgd2FzIGZyYW1lLmZyYW1lcy5sZW5ndGhcbiAgICAvLyBidXQgZnJhbWVzLmxlbmd0aCBpbmhlcml0cyBmcm9tIHdpbmRvdy5sZW5ndGhcbiAgICAvLyB3aGljaCBjYW4gYmUgb3ZlcndyaXR0ZW4gaWYgYSBkZXZlbG9wZXIgZG9lc1xuICAgIC8vIGB2YXIgbGVuZ3RoID0gdmFsdWU7YCBvdXRzaWRlIG9mIGEgZnVuY3Rpb25cbiAgICAvLyBzY29wZSwgaXQnbGwgcHJldmVudCB1cyBmcm9tIGxvb3BpbmcgdGhyb3VnaFxuICAgIC8vIGFsbCB0aGUgZnJhbWVzLiBXaXRoIHRoaXMsIHdlIGxvb3AgdGhyb3VnaFxuICAgIC8vIHVudGlsIHRoZXJlIGFyZSBubyBsb25nZXIgYW55IGZyYW1lc1xuICAgIHdoaWxlIChmcmFtZVRvQnJvYWRjYXN0VG8gPSBmcmFtZS5mcmFtZXNbaV0pIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25kLWFzc2lnblxuICAgICAgX2Jyb2FkY2FzdChmcmFtZVRvQnJvYWRjYXN0VG8sIHBheWxvYWQsIG9yaWdpbik7XG4gICAgICBpKys7XG4gICAgfVxuICB9IGNhdGNoIChfKSB7IC8qIGlnbm9yZWQgKi8gfVxufVxuXG5mdW5jdGlvbiBfYnJvYWRjYXN0UG9wdXBzKHBheWxvYWQsIG9yaWdpbiwgc291cmNlKSB7XG4gIHZhciBpLCBwb3B1cDtcblxuICBmb3IgKGkgPSBwb3B1cHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBwb3B1cCA9IHBvcHVwc1tpXTtcblxuICAgIGlmIChwb3B1cC5jbG9zZWQgPT09IHRydWUpIHtcbiAgICAgIHBvcHVwcyA9IHBvcHVwcy5zbGljZShpLCAxKTtcbiAgICB9IGVsc2UgaWYgKHNvdXJjZSAhPT0gcG9wdXApIHtcbiAgICAgIF9icm9hZGNhc3QocG9wdXAudG9wLCBwYXlsb2FkLCBvcmlnaW4pO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBfc3Vic2NyaWJlUmVwbGllcihmbiwgb3JpZ2luKSB7XG4gIHZhciB1dWlkID0gX3V1aWQoKTtcblxuICBmdW5jdGlvbiByZXBsaWVyKGQsIG8pIHtcbiAgICBmbihkLCBvKTtcbiAgICBmcmFtZWJ1cy50YXJnZXQob3JpZ2luKS51bnN1YnNjcmliZSh1dWlkLCByZXBsaWVyKTtcbiAgfVxuXG4gIGZyYW1lYnVzLnRhcmdldChvcmlnaW4pLnN1YnNjcmliZSh1dWlkLCByZXBsaWVyKTtcbiAgcmV0dXJuIHV1aWQ7XG59XG5cbmZ1bmN0aW9uIF9zdWJzY3JpcHRpb25BcmdzSW52YWxpZChldmVudCwgZm4sIG9yaWdpbikge1xuICBpZiAoX2lzbnRTdHJpbmcoZXZlbnQpKSB7IHJldHVybiB0cnVlOyB9XG4gIGlmICh0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicpIHsgcmV0dXJuIHRydWU7IH1cbiAgaWYgKF9pc250U3RyaW5nKG9yaWdpbikpIHsgcmV0dXJuIHRydWU7IH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbl9hdHRhY2goKTtcblxuZnJhbWVidXMgPSB7XG4gIHRhcmdldDogdGFyZ2V0LFxuICAvLyByZW1vdmVJZihwcm9kdWN0aW9uKVxuICBfcGFja2FnZVBheWxvYWQ6IF9wYWNrYWdlUGF5bG9hZCxcbiAgX3VucGFja1BheWxvYWQ6IF91bnBhY2tQYXlsb2FkLFxuICBfYXR0YWNoOiBfYXR0YWNoLFxuICBfZGV0YWNoOiBfZGV0YWNoLFxuICBfZGlzcGF0Y2g6IF9kaXNwYXRjaCxcbiAgX2Jyb2FkY2FzdDogX2Jyb2FkY2FzdCxcbiAgX3N1YnNjcmliZVJlcGxpZXI6IF9zdWJzY3JpYmVSZXBsaWVyLFxuICBfc3Vic2NyaXB0aW9uQXJnc0ludmFsaWQ6IF9zdWJzY3JpcHRpb25BcmdzSW52YWxpZCxcbiAgX29ubWVzc2FnZTogX29ubWVzc2FnZSxcbiAgX3V1aWQ6IF91dWlkLFxuICBfZ2V0U3Vic2NyaWJlcnM6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHN1YnNjcmliZXJzOyB9LFxuICBfd2luOiBmdW5jdGlvbiAoKSB7IHJldHVybiB3aW47IH0sXG4gIC8vIGVuZFJlbW92ZUlmKHByb2R1Y3Rpb24pXG4gIGluY2x1ZGU6IGluY2x1ZGUsXG4gIHB1Ymxpc2g6IHB1Ymxpc2gsXG4gIHB1YjogcHVibGlzaCxcbiAgdHJpZ2dlcjogcHVibGlzaCxcbiAgZW1pdDogcHVibGlzaCxcbiAgc3Vic2NyaWJlOiBzdWJzY3JpYmUsXG4gIHN1Yjogc3Vic2NyaWJlLFxuICBvbjogc3Vic2NyaWJlLFxuICB1bnN1YnNjcmliZTogdW5zdWJzY3JpYmUsXG4gIHVuc3ViOiB1bnN1YnNjcmliZSxcbiAgb2ZmOiB1bnN1YnNjcmliZVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmcmFtZWJ1cztcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIERlc3RydWN0b3IgPSByZXF1aXJlKCcuLi8uLi9saWIvZGVzdHJ1Y3RvcicpO1xudmFyIGlGcmFtZXIgPSByZXF1aXJlKCdAYnJhaW50cmVlL2lmcmFtZXInKTtcbnZhciBCdXMgPSByZXF1aXJlKCcuLi8uLi9saWIvYnVzJyk7XG52YXIgU2VhbWxlc3NwYXlFcnJvciA9IHJlcXVpcmUoJy4uLy4uL2xpYi9zZWFtbGVzc3BheS1lcnJvcicpO1xudmFyIGNvbXBvc2VVcmwgPSByZXF1aXJlKCcuL2NvbXBvc2UtdXJsJyk7XG52YXIgY29uc3RhbnRzID0gcmVxdWlyZSgnLi4vc2hhcmVkL2NvbnN0YW50cycpO1xudmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJy4uLy4uL2xpYi9ldmVudC1lbWl0dGVyJyk7XG52YXIgdXVpZCA9IHJlcXVpcmUoJy4uLy4uL2xpYi91dWlkJyk7XG52YXIgaW5qZWN0RnJhbWUgPSByZXF1aXJlKCcuL2luamVjdC1mcmFtZScpO1xudmFyIFZFUlNJT04gPSBcIndlYi1zZGtcIjtcbnZhciBzaGFyZWRFcnJvcnMgPSByZXF1aXJlKCcuLi8uLi9saWIvZXJyb3JzJyk7XG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi4vc2hhcmVkL2Vycm9ycycpO1xuXG52YXIgZXZlbnRzID0gY29uc3RhbnRzLmV2ZW50cztcblxuLyoqXG4gKiBAY2xhc3MgQ2hlY2tvdXRCdXR0b25cbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIFRoZSBDaGVja291dCBCdXR0b24ge0BsaW5rIG1vZHVsZTpzZWFtbGVzc3BheS13ZWIvY2hlY2tvdXQtYnV0dG9uLmNyZWF0ZSBjcmVhdGV9IG9wdGlvbnMuXG4gKiBAZGVzY3JpcHRpb24gPHN0cm9uZz5EbyBub3QgdXNlIHRoaXMgY29uc3RydWN0b3IgZGlyZWN0bHkuIFVzZSB7QGxpbmsgbW9kdWxlOnNlYW1sZXNzcGF5LXdlYi9jaGVja291dC1idXR0b24uY3JlYXRlfHNlYW1sZXNzcGF5LXdlYi5jaGVja291dC1idXR0b24uY3JlYXRlfSBpbnN0ZWFkLjwvc3Ryb25nPlxuICogQGNsYXNzZGVzYyBUaGlzIGNsYXNzIHJlcHJlc2VudHMgYSBDaGVja291dCBCdXR0b24gY29tcG9uZW50IHByb2R1Y2VkIGJ5IHtAbGluayBtb2R1bGU6c2VhbWxlc3NwYXktd2ViL2NoZWNrb3V0LWJ1dHRvbi5jcmVhdGV8c2VhbWxlc3NwYXktd2ViL2NoZWNrb3V0LWJ1dHRvbi5jcmVhdGV9LiBJbnN0YW5jZXMgb2YgdGhpcyBjbGFzcyBoYXZlIG1ldGhvZHMgZm9yIGludGVyYWN0aW5nIHdpdGggdGhlIGlucHV0IGZpZWxkcyB3aXRoaW4gQ2hlY2tvdXQgQnV0dG9uJyBpZnJhbWVzLlxuICovXG5mdW5jdGlvbiBDaGVja291dEJ1dHRvbihvcHRpb25zKSB7XG4gIHZhciBjbGllbnRWZXJzaW9uLCBjbGllbnRDb25maWc7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIGNvbXBvbmVudElkID0gdXVpZCgpO1xuXG4gIGlmICghb3B0aW9ucy5jbGllbnQpIHtcbiAgICB0aHJvdyBuZXcgU2VhbWxlc3NwYXlFcnJvcih7XG4gICAgICB0eXBlOiBzaGFyZWRFcnJvcnMuSU5TVEFOVElBVElPTl9PUFRJT05fUkVRVUlSRUQudHlwZSxcbiAgICAgIGNvZGU6IHNoYXJlZEVycm9ycy5JTlNUQU5USUFUSU9OX09QVElPTl9SRVFVSVJFRC5jb2RlLFxuICAgICAgbWVzc2FnZTogJ29wdGlvbnMuY2xpZW50IGlzIHJlcXVpcmVkIHdoZW4gaW5zdGFudGlhdGluZyBDaGVja291dCBCdXR0b24uJ1xuICAgIH0pO1xuICB9XG5cbiAgY2xpZW50Q29uZmlnID0gb3B0aW9ucy5jbGllbnQuZ2V0Q29uZmlndXJhdGlvbigpO1xuICBjbGllbnRWZXJzaW9uID0gY2xpZW50Q29uZmlnLmFuYWx5dGljc01ldGFkYXRhLnNka1ZlcnNpb247XG4gIGlmIChjbGllbnRWZXJzaW9uICE9PSBWRVJTSU9OKSB7XG4gICAgdGhyb3cgbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgdHlwZTogc2hhcmVkRXJyb3JzLklOQ09NUEFUSUJMRV9WRVJTSU9OUy50eXBlLFxuICAgICAgY29kZTogc2hhcmVkRXJyb3JzLklOQ09NUEFUSUJMRV9WRVJTSU9OUy5jb2RlLFxuICAgICAgbWVzc2FnZTogJ0NsaWVudCAodmVyc2lvbiAnICsgY2xpZW50VmVyc2lvbiArICcpIGFuZCBDaGVja291dCBCdXR0b24gKHZlcnNpb24gJyArIFZFUlNJT04gKyAnKSBjb21wb25lbnRzIG11c3QgYmUgZnJvbSB0aGUgc2FtZSBTREsgdmVyc2lvbi4nXG4gICAgfSk7XG4gIH1cblxuICBpZiAoIW9wdGlvbnMuYW1vdW50KSB7XG4gICAgdGhyb3cgbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgdHlwZTogc2hhcmVkRXJyb3JzLklOU1RBTlRJQVRJT05fT1BUSU9OX1JFUVVJUkVELnR5cGUsXG4gICAgICBjb2RlOiBzaGFyZWRFcnJvcnMuSU5TVEFOVElBVElPTl9PUFRJT05fUkVRVUlSRUQuY29kZSxcbiAgICAgIG1lc3NhZ2U6ICdvcHRpb25zLmFtb3VudCBpcyByZXF1aXJlZCB3aGVuIGluc3RhbnRpYXRpbmcgQ2hlY2tvdXQgQnV0dG9uLidcbiAgICB9KTtcbiAgfVxuXG4gIGlmICghb3B0aW9ucy5mb3JtUGF0aCkge1xuICAgIHRocm93IG5ldyBTZWFtbGVzc3BheUVycm9yKHtcbiAgICAgIHR5cGU6IHNoYXJlZEVycm9ycy5JTlNUQU5USUFUSU9OX09QVElPTl9SRVFVSVJFRC50eXBlLFxuICAgICAgY29kZTogc2hhcmVkRXJyb3JzLklOU1RBTlRJQVRJT05fT1BUSU9OX1JFUVVJUkVELmNvZGUsXG4gICAgICBtZXNzYWdlOiAnb3B0aW9ucy5mb3JtUGF0aCBpcyByZXF1aXJlZCB3aGVuIGluc3RhbnRpYXRpbmcgQ2hlY2tvdXQgQnV0dG9uLidcbiAgICB9KTtcbiAgfVxuXG4gIGlmICghb3B0aW9ucy5zZWxlY3Rvcikge1xuICAgIHRocm93IG5ldyBTZWFtbGVzc3BheUVycm9yKHtcbiAgICAgIHR5cGU6IHNoYXJlZEVycm9ycy5JTlNUQU5USUFUSU9OX09QVElPTl9SRVFVSVJFRC50eXBlLFxuICAgICAgY29kZTogc2hhcmVkRXJyb3JzLklOU1RBTlRJQVRJT05fT1BUSU9OX1JFUVVJUkVELmNvZGUsXG4gICAgICBtZXNzYWdlOiAnb3B0aW9ucy5zZWxlY3RvciBpcyByZXF1aXJlZCB3aGVuIGluc3RhbnRpYXRpbmcgQ2hlY2tvdXQgQnV0dG9uLidcbiAgICB9KTtcbiAgfVxuXG4gIHZhciBrZXkgPSBjb25zdGFudHMuQlVUVE9OX0tFWTtcbiAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Iob3B0aW9ucy5zZWxlY3Rvcik7XG5cbiAgaWYgKCFjb250YWluZXIpIHtcbiAgICB0aHJvdyBuZXcgU2VhbWxlc3NwYXlFcnJvcih7XG4gICAgICB0eXBlOiBlcnJvcnMuQ0hFQ0tPVVRfQlVUVE9OX0lOVkFMSURfRklFTERfU0VMRUNUT1IudHlwZSxcbiAgICAgIGNvZGU6IGVycm9ycy5DSEVDS09VVF9CVVRUT05fSU5WQUxJRF9GSUVMRF9TRUxFQ1RPUi5jb2RlLFxuICAgICAgbWVzc2FnZTogZXJyb3JzLkNIRUNLT1VUX0JVVFRPTl9JTlZBTElEX0ZJRUxEX1NFTEVDVE9SLm1lc3NhZ2UsXG4gICAgICBkZXRhaWxzOiB7XG4gICAgICAgIGZpZWxkU2VsZWN0b3I6IG9wdGlvbnMuc2VsZWN0b3IsXG4gICAgICAgIGZpZWxkS2V5OiBrZXlcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIEV2ZW50RW1pdHRlci5jYWxsKHRoaXMpO1xuXG4gIHRoaXMuX2luamVjdGVkTm9kZXMgPSBbXTtcbiAgdGhpcy5fZGVzdHJ1Y3RvciA9IG5ldyBEZXN0cnVjdG9yKCk7XG4gIHRoaXMuX3N0YXRlID0ge307XG5cbiAgdGhpcy5fYnVzID0gbmV3IEJ1cyh7XG4gICAgY2hhbm5lbDogY29tcG9uZW50SWQsXG4gICAgbWVyY2hhbnRVcmw6IGxvY2F0aW9uLmhyZWZcbiAgfSk7XG5cbiAgdGhpcy5fZGVzdHJ1Y3Rvci5yZWdpc3RlckZ1bmN0aW9uRm9yVGVhcmRvd24oZnVuY3Rpb24gKCkge1xuICAgIHNlbGYuX2J1cy50ZWFyZG93bigpO1xuICB9KTtcblxuICB0aGlzLl9jbGllbnQgPSBvcHRpb25zLmNsaWVudDtcblxuICB2YXIgZnJhbWUgPSBpRnJhbWVyKHtcbiAgICB0eXBlOiBrZXksXG4gICAgbmFtZTogJ3NlYW1sZXNzcGF5LWNoZWNrb3V0LWJ1dHRvbicsXG4gICAgc3R5bGU6IHtcbiAgICAgIGJvcmRlcjogJ25vbmUnLFxuICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgJ2Zsb2F0JzogJ2xlZnQnXG4gICAgfVxuICB9KTtcblxuICB0aGlzLl9pbmplY3RlZE5vZGVzID0gdGhpcy5faW5qZWN0ZWROb2Rlcy5jb25jYXQoaW5qZWN0RnJhbWUoZnJhbWUsIGNvbnRhaW5lcikpO1xuXG4gIHRoaXMuX3N0YXRlW2tleV0gPSB7XG4gICAgaXNFbXB0eTogdHJ1ZSxcbiAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICBpc1BvdGVudGlhbGx5VmFsaWQ6IHRydWUsXG4gICAgaXNGb2N1c2VkOiBmYWxzZSxcbiAgICBjb250YWluZXI6IGNvbnRhaW5lclxuICB9O1xuXG4gIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgIGZyYW1lLnNyYyA9IGNvbXBvc2VVcmwoY2xpZW50Q29uZmlnLCBjb21wb25lbnRJZCwgY2xpZW50Q29uZmlnLmlzRGVidWcpO1xuICB9LCAwKTtcblxuICB0aGlzLl9idXMub24oZXZlbnRzLkZSQU1FX1JFQURZLCBmdW5jdGlvbiAocmVwbHkpIHtcbiAgICByZXBseShvcHRpb25zKTtcbiAgICBzZWxmLl9lbWl0KCdyZWFkeScpO1xuICB9KTtcblxuICB0aGlzLl9kZXN0cnVjdG9yLnJlZ2lzdGVyRnVuY3Rpb25Gb3JUZWFyZG93bihcbiAgICBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgaiwgbm9kZSwgcGFyZW50O1xuXG4gICAgICBmb3IgKGogPSAwOyBqIDwgc2VsZi5faW5qZWN0ZWROb2Rlcy5sZW5ndGg7IGorKykge1xuICAgICAgICBub2RlID0gc2VsZi5faW5qZWN0ZWROb2Rlc1tqXTtcbiAgICAgICAgcGFyZW50ID0gbm9kZS5wYXJlbnROb2RlO1xuXG4gICAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChub2RlKTtcbiAgICAgIH1cbiAgICB9XG4gICk7XG5cbn1cblxuQ2hlY2tvdXRCdXR0b24ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFdmVudEVtaXR0ZXIucHJvdG90eXBlLCB7XG4gIGNvbnN0cnVjdG9yOiBDaGVja291dEJ1dHRvblxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ2hlY2tvdXRCdXR0b247XG4iLCIndXNlIHN0cmljdCc7XG52YXIgY29uc3RhbnRzID0gcmVxdWlyZSgnLi4vc2hhcmVkL2NvbnN0YW50cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvbXBvc2VVcmwoY29uZmlnLCBjb21wb25lbnRJZCwgaXNEZWJ1Zykge1xuICB2YXIgYXNzZXRzVXJsID0gY29uZmlnLmdhdGV3YXlDb25maWd1cmF0aW9uLmFzc2V0c1VybDtcblxuICBpZiAoaXNEZWJ1Zykge1xuICAgIGFzc2V0c1VybCA9IGFzc2V0c1VybC5yZXBsYWNlKCdodHRwcycsICdodHRwJyk7XG4gIH1cbiAgdmFyIG1pbiA9IGlzRGVidWcgPyAnJyA6ICcubWluJztcblxuICByZXR1cm4gYXNzZXRzVXJsICsgJy8nICsgY29uc3RhbnRzLlZFUlNJT04gKyAnL2h0bWwvY2hlY2tvdXQtYnV0dG9uLWZyYW1lJyArIG1pbiArICcuaHRtbCMnICsgY29tcG9uZW50SWQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluamVjdEZyYW1lKGZyYW1lLCBjb250YWluZXIpIHtcbiAgdmFyIGNsZWFyYm90aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICB2YXIgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cbiAgY2xlYXJib3RoLnN0eWxlLmNsZWFyID0gJ2JvdGgnO1xuXG4gIGZyYWdtZW50LmFwcGVuZENoaWxkKGZyYW1lKTtcbiAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQoY2xlYXJib3RoKTtcblxuICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZnJhZ21lbnQpO1xuXG4gIHJldHVybiBbZnJhbWUsIGNsZWFyYm90aF07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLyoqIEBtb2R1bGUgc2VhbWxlc3NwYXktd2ViL2NoZWNrb3V0LWJ1dHRvbiAqL1xuXG52YXIgQ2hlY2tvdXRCdXR0b24gPSByZXF1aXJlKCcuL2V4dGVybmFsL2NoZWNrb3V0LWJ1dHRvbicpO1xudmFyIHdyYXBQcm9taXNlID0gcmVxdWlyZSgnQGJyYWludHJlZS93cmFwLXByb21pc2UnKTtcbnZhciBQcm9taXNlID0gcmVxdWlyZSgnLi4vbGliL3Byb21pc2UnKTtcblxudmFyIFZFUlNJT04gPSBcIndlYi1zZGtcIjtcblxuZnVuY3Rpb24gY3JlYXRlKG9wdGlvbnMpIHtcbiAgdmFyIGludGVncmF0aW9uO1xuXG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgIGludGVncmF0aW9uID0gbmV3IENoZWNrb3V0QnV0dG9uKG9wdGlvbnMpO1xuXG4gICAgaW50ZWdyYXRpb24ub24oJ3JlYWR5JywgZnVuY3Rpb24gKCkge1xuICAgICAgcmVzb2x2ZShpbnRlZ3JhdGlvbik7XG4gICAgfSk7XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgY3JlYXRlOiB3cmFwUHJvbWlzZShjcmVhdGUpLFxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uIFRoZSBjdXJyZW50IHZlcnNpb24gb2YgdGhlIFNESywgaS5lLiBge0Bwa2cgdmVyc2lvbn1gLlxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKi9cbiAgVkVSU0lPTjogVkVSU0lPTlxufTtcbiIsInZhciBlbnVtZXJhdGUgPSByZXF1aXJlKCcuLi8uLi9saWIvZW51bWVyYXRlJyk7XG5cbnZhciBWRVJTSU9OID0gXCJ3ZWItc2RrXCI7XG52YXIgQlVUVE9OX0tFWSA9ICdjaGVja291dC1idXR0b24nO1xudmFyIEJVVFRPTl9URVhUID0gJ1BheSBOb3cnO1xudmFyIERFRkFVTFRfU1RZTEUgPSB7XG4gIHdlYmtpdEFwcGVhcmFuY2U6ICdidXR0b24nLFxuICBjb2xvcjogJyNmZmYnLFxuICBiYWNrZ3JvdW5kQ29sb3I6ICcjMTg5MGZmJyxcbiAgYm9yZGVyQ29sb3I6ICcjMTg5MGZmJyxcbiAgdGV4dFNoYWRvdzogJzAgLTFweCAwIHJnYmEoMCwgMCwgMCwgMC4xMiknLFxuICBib3hTaGFkb3c6ICcwIDJweCAwIHJnYmEoMCwgMCwgMCwgMC4wNDUpJyxcbiAgbGluZUhlaWdodDogJzEuNDk5JyxcbiAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuICBmb250V2VpZ2h0OiA0MDAsXG4gIHdoaXRlU3BhY2U6ICdub3dyYXAnLFxuICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICBiYWNrZ3JvdW5kSW1hZ2U6ICdub25lJyxcbiAgYm9yZGVyOiAnMXB4IHNvbGlkIHRyYW5zcGFyZW50JyxcbiAgY3Vyc29yOiAncG9pbnRlcicsXG4gIHRyYW5zaXRpb246ICdhbGwgMC4zcyBjdWJpYy1iZXppZXIoMC42NDUsIDAuMDQ1LCAwLjM1NSwgMSknLFxuICBoZWlnaHQ6ICczMnB4JyxcbiAgcGFkZGluZzogJzAgMTVweCcsXG4gIGZvbnRTaXplOiAnMTRweCcsXG4gIGJvcmRlclJhZGl1czogJzRweCcsXG4gIHVzZXJTZWxlY3Q6ICdub25lJyxcbiAgdG91Y2hBY3Rpb246ICdtYW5pcHVsYXRpb24nXG59O1xuXG52YXIgZXZlbnRzID0gZW51bWVyYXRlKFxuICBbICdGUkFNRV9SRUFEWSddLFxuICAnY2hlY2tvdXQtYnV0dG9uOidcbik7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBWRVJTSU9OOiBWRVJTSU9OLFxuICBCVVRUT05fS0VZOiBCVVRUT05fS0VZLFxuICBCVVRUT05fVEVYVDogQlVUVE9OX1RFWFQsXG4gIERFRkFVTFRfU1RZTEU6IERFRkFVTFRfU1RZTEUsXG4gIGV2ZW50czogZXZlbnRzXG59O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBTZWFtbGVzc3BheUVycm9yID0gcmVxdWlyZSgnLi4vLi4vbGliL3NlYW1sZXNzcGF5LWVycm9yJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBDSEVDS09VVF9CVVRUT05fSU5WQUxJRF9GSUVMRF9TRUxFQ1RPUjoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTUVSQ0hBTlQsXG4gICAgY29kZTogJ0NIRUNLT1VUX0JVVFRPTl9JTlZBTElEX0ZJRUxEX1NFTEVDVE9SJyxcbiAgICBtZXNzYWdlOiAnU2VsZWN0b3IgZG9lcyBub3QgcmVmZXJlbmNlIGEgdmFsaWQgRE9NIG5vZGUuJ1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgb25jZSA9IHJlcXVpcmUoJy4vb25jZScpO1xuXG5mdW5jdGlvbiBjYWxsKGZuLCBjYWxsYmFjaykge1xuICB2YXIgaXNTeW5jID0gZm4ubGVuZ3RoID09PSAwO1xuXG4gIGlmIChpc1N5bmMpIHtcbiAgICBmbigpO1xuICAgIGNhbGxiYWNrKG51bGwpO1xuICB9IGVsc2Uge1xuICAgIGZuKGNhbGxiYWNrKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChmdW5jdGlvbnMsIGNiKSB7XG4gIHZhciBpO1xuICB2YXIgbGVuZ3RoID0gZnVuY3Rpb25zLmxlbmd0aDtcbiAgdmFyIHJlbWFpbmluZyA9IGxlbmd0aDtcbiAgdmFyIGNhbGxiYWNrID0gb25jZShjYik7XG5cbiAgaWYgKGxlbmd0aCA9PT0gMCkge1xuICAgIGNhbGxiYWNrKG51bGwpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZpbmlzaChlcnIpIHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJlbWFpbmluZyAtPSAxO1xuICAgIGlmIChyZW1haW5pbmcgPT09IDApIHtcbiAgICAgIGNhbGxiYWNrKG51bGwpO1xuICAgIH1cbiAgfVxuXG4gIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGNhbGwoZnVuY3Rpb25zW2ldLCBmaW5pc2gpO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNXaGl0ZWxpc3RlZERvbWFpbiA9IHJlcXVpcmUoJy4uL2lzLXdoaXRlbGlzdGVkLWRvbWFpbicpO1xuXG5mdW5jdGlvbiBjaGVja09yaWdpbihwb3N0TWVzc2FnZU9yaWdpbiwgbWVyY2hhbnRVcmwpIHtcbiAgdmFyIG1lcmNoYW50T3JpZ2luLCBtZXJjaGFudEhvc3Q7XG4gIHZhciBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuXG4gIGEuaHJlZiA9IG1lcmNoYW50VXJsO1xuXG4gIGlmIChhLnByb3RvY29sID09PSAnaHR0cHM6Jykge1xuICAgIG1lcmNoYW50SG9zdCA9IGEuaG9zdC5yZXBsYWNlKC86NDQzJC8sICcnKTtcbiAgfSBlbHNlIGlmIChhLnByb3RvY29sID09PSAnaHR0cDonKSB7XG4gICAgbWVyY2hhbnRIb3N0ID0gYS5ob3N0LnJlcGxhY2UoLzo4MCQvLCAnJyk7XG4gIH0gZWxzZSB7XG4gICAgbWVyY2hhbnRIb3N0ID0gYS5ob3N0O1xuICB9XG5cbiAgbWVyY2hhbnRPcmlnaW4gPSBhLnByb3RvY29sICsgJy8vJyArIG1lcmNoYW50SG9zdDtcblxuICBpZiAobWVyY2hhbnRPcmlnaW4gPT09IHBvc3RNZXNzYWdlT3JpZ2luKSB7IHJldHVybiB0cnVlOyB9XG5cbiAgYS5ocmVmID0gcG9zdE1lc3NhZ2VPcmlnaW47XG5cbiAgcmV0dXJuIGlzV2hpdGVsaXN0ZWREb21haW4ocG9zdE1lc3NhZ2VPcmlnaW4pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgY2hlY2tPcmlnaW46IGNoZWNrT3JpZ2luXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZW51bWVyYXRlID0gcmVxdWlyZSgnLi4vZW51bWVyYXRlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZW51bWVyYXRlKFtcbiAgJ0NPTkZJR1VSQVRJT05fUkVRVUVTVCdcbl0sICdidXM6Jyk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBidXMgPSByZXF1aXJlKCdmcmFtZWJ1cycpO1xudmFyIGV2ZW50cyA9IHJlcXVpcmUoJy4vZXZlbnRzJyk7XG52YXIgY2hlY2tPcmlnaW4gPSByZXF1aXJlKCcuL2NoZWNrLW9yaWdpbicpLmNoZWNrT3JpZ2luO1xudmFyIFNlYW1sZXNzcGF5RXJyb3IgPSByZXF1aXJlKCcuLi9zZWFtbGVzc3BheS1lcnJvcicpO1xuXG5mdW5jdGlvbiBTZWFtbGVzc3BheUJ1cyhvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIHRoaXMuY2hhbm5lbCA9IG9wdGlvbnMuY2hhbm5lbDtcbiAgaWYgKCF0aGlzLmNoYW5uZWwpIHtcbiAgICB0aHJvdyBuZXcgU2VhbWxlc3NwYXlFcnJvcih7XG4gICAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLklOVEVSTkFMLFxuICAgICAgY29kZTogJ01JU1NJTkdfQ0hBTk5FTF9JRCcsXG4gICAgICBtZXNzYWdlOiAnQ2hhbm5lbCBJRCBtdXN0IGJlIHNwZWNpZmllZC4nXG4gICAgfSk7XG4gIH1cblxuICB0aGlzLm1lcmNoYW50VXJsID0gb3B0aW9ucy5tZXJjaGFudFVybDtcblxuICB0aGlzLl9pc0Rlc3Ryb3llZCA9IGZhbHNlO1xuICB0aGlzLl9pc1ZlcmJvc2UgPSBmYWxzZTtcblxuICB0aGlzLl9saXN0ZW5lcnMgPSBbXTtcblxuICB0aGlzLl9sb2coJ25ldyBidXMgb24gY2hhbm5lbCAnICsgdGhpcy5jaGFubmVsLCBbbG9jYXRpb24uaHJlZl0pO1xufVxuXG5TZWFtbGVzc3BheUJ1cy5wcm90b3R5cGUub24gPSBmdW5jdGlvbiAoZXZlbnROYW1lLCBvcmlnaW5hbEhhbmRsZXIpIHtcbiAgdmFyIG5hbWVzcGFjZWRFdmVudCwgYXJncztcbiAgdmFyIGhhbmRsZXIgPSBvcmlnaW5hbEhhbmRsZXI7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICBpZiAodGhpcy5faXNEZXN0cm95ZWQpIHsgcmV0dXJuOyB9XG5cbiAgaWYgKHRoaXMubWVyY2hhbnRVcmwpIHtcbiAgICBoYW5kbGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgLyogZXNsaW50LWRpc2FibGUgbm8taW52YWxpZC10aGlzICovXG4gICAgICBpZiAoY2hlY2tPcmlnaW4odGhpcy5vcmlnaW4sIHNlbGYubWVyY2hhbnRVcmwpKSB7XG4gICAgICAgIG9yaWdpbmFsSGFuZGxlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfVxuICAgICAgLyogZXNsaW50LWVuYWJsZSBuby1pbnZhbGlkLXRoaXMgKi9cbiAgICB9O1xuICB9XG5cbiAgbmFtZXNwYWNlZEV2ZW50ID0gdGhpcy5fbmFtZXNwYWNlRXZlbnQoZXZlbnROYW1lKTtcbiAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gIGFyZ3NbMF0gPSBuYW1lc3BhY2VkRXZlbnQ7XG4gIGFyZ3NbMV0gPSBoYW5kbGVyO1xuXG4gIHRoaXMuX2xvZygnb24nLCBhcmdzKTtcbiAgYnVzLm9uLmFwcGx5KGJ1cywgYXJncyk7XG5cbiAgdGhpcy5fbGlzdGVuZXJzLnB1c2goe1xuICAgIGV2ZW50TmFtZTogZXZlbnROYW1lLFxuICAgIGhhbmRsZXI6IGhhbmRsZXIsXG4gICAgb3JpZ2luYWxIYW5kbGVyOiBvcmlnaW5hbEhhbmRsZXJcbiAgfSk7XG59O1xuXG5TZWFtbGVzc3BheUJ1cy5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uIChldmVudE5hbWUpIHtcbiAgdmFyIGFyZ3M7XG5cbiAgaWYgKHRoaXMuX2lzRGVzdHJveWVkKSB7IHJldHVybjsgfVxuXG4gIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICBhcmdzWzBdID0gdGhpcy5fbmFtZXNwYWNlRXZlbnQoZXZlbnROYW1lKTtcblxuICB0aGlzLl9sb2coJ2VtaXQnLCBhcmdzKTtcbiAgYnVzLmVtaXQuYXBwbHkoYnVzLCBhcmdzKTtcbn07XG5cblNlYW1sZXNzcGF5QnVzLnByb3RvdHlwZS5fb2ZmRGlyZWN0ID0gZnVuY3Rpb24gKGV2ZW50TmFtZSkge1xuICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG5cbiAgaWYgKHRoaXMuX2lzRGVzdHJveWVkKSB7IHJldHVybjsgfVxuXG4gIGFyZ3NbMF0gPSB0aGlzLl9uYW1lc3BhY2VFdmVudChldmVudE5hbWUpO1xuXG4gIHRoaXMuX2xvZygnb2ZmJywgYXJncyk7XG4gIGJ1cy5vZmYuYXBwbHkoYnVzLCBhcmdzKTtcbn07XG5cblNlYW1sZXNzcGF5QnVzLnByb3RvdHlwZS5vZmYgPSBmdW5jdGlvbiAoZXZlbnROYW1lLCBvcmlnaW5hbEhhbmRsZXIpIHtcbiAgdmFyIGksIGxpc3RlbmVyO1xuICB2YXIgaGFuZGxlciA9IG9yaWdpbmFsSGFuZGxlcjtcblxuICBpZiAodGhpcy5faXNEZXN0cm95ZWQpIHsgcmV0dXJuOyB9XG5cbiAgaWYgKHRoaXMubWVyY2hhbnRVcmwpIHtcbiAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5fbGlzdGVuZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsaXN0ZW5lciA9IHRoaXMuX2xpc3RlbmVyc1tpXTtcblxuICAgICAgaWYgKGxpc3RlbmVyLm9yaWdpbmFsSGFuZGxlciA9PT0gb3JpZ2luYWxIYW5kbGVyKSB7XG4gICAgICAgIGhhbmRsZXIgPSBsaXN0ZW5lci5oYW5kbGVyO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHRoaXMuX29mZkRpcmVjdChldmVudE5hbWUsIGhhbmRsZXIpO1xufTtcblxuU2VhbWxlc3NwYXlCdXMucHJvdG90eXBlLl9uYW1lc3BhY2VFdmVudCA9IGZ1bmN0aW9uIChldmVudE5hbWUpIHtcbiAgcmV0dXJuIFsnc2VhbWxlc3NwYXknLCB0aGlzLmNoYW5uZWwsIGV2ZW50TmFtZV0uam9pbignOicpO1xufTtcblxuU2VhbWxlc3NwYXlCdXMucHJvdG90eXBlLnRlYXJkb3duID0gZnVuY3Rpb24gKCkge1xuICB2YXIgbGlzdGVuZXIsIGk7XG5cbiAgZm9yIChpID0gMDsgaSA8IHRoaXMuX2xpc3RlbmVycy5sZW5ndGg7IGkrKykge1xuICAgIGxpc3RlbmVyID0gdGhpcy5fbGlzdGVuZXJzW2ldO1xuICAgIHRoaXMuX29mZkRpcmVjdChsaXN0ZW5lci5ldmVudE5hbWUsIGxpc3RlbmVyLmhhbmRsZXIpO1xuICB9XG5cbiAgdGhpcy5fbGlzdGVuZXJzLmxlbmd0aCA9IDA7XG5cbiAgdGhpcy5faXNEZXN0cm95ZWQgPSB0cnVlO1xufTtcblxuU2VhbWxlc3NwYXlCdXMucHJvdG90eXBlLl9sb2cgPSBmdW5jdGlvbiAoZnVuY3Rpb25OYW1lLCBhcmdzKSB7XG4gIGlmICh0aGlzLl9pc1ZlcmJvc2UpIHtcbiAgICBjb25zb2xlLmxvZyhmdW5jdGlvbk5hbWUsIGFyZ3MpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcbiAgfVxufTtcblxuU2VhbWxlc3NwYXlCdXMuZXZlbnRzID0gZXZlbnRzO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNlYW1sZXNzcGF5QnVzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmF0Y2hFeGVjdXRlRnVuY3Rpb25zID0gcmVxdWlyZSgnLi9iYXRjaC1leGVjdXRlLWZ1bmN0aW9ucycpO1xuXG5mdW5jdGlvbiBEZXN0cnVjdG9yKCkge1xuICB0aGlzLl90ZWFyZG93blJlZ2lzdHJ5ID0gW107XG5cbiAgdGhpcy5faXNUZWFyaW5nRG93biA9IGZhbHNlO1xufVxuXG5EZXN0cnVjdG9yLnByb3RvdHlwZS5yZWdpc3RlckZ1bmN0aW9uRm9yVGVhcmRvd24gPSBmdW5jdGlvbiAoZm4pIHtcbiAgaWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHRoaXMuX3RlYXJkb3duUmVnaXN0cnkucHVzaChmbik7XG4gIH1cbn07XG5cbkRlc3RydWN0b3IucHJvdG90eXBlLnRlYXJkb3duID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIGlmICh0aGlzLl9pc1RlYXJpbmdEb3duKSB7XG4gICAgY2FsbGJhY2sobmV3IEVycm9yKCdEZXN0cnVjdG9yIGlzIGFscmVhZHkgdGVhcmluZyBkb3duJykpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRoaXMuX2lzVGVhcmluZ0Rvd24gPSB0cnVlO1xuXG4gIGJhdGNoRXhlY3V0ZUZ1bmN0aW9ucyh0aGlzLl90ZWFyZG93blJlZ2lzdHJ5LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgdGhpcy5fdGVhcmRvd25SZWdpc3RyeSA9IFtdO1xuICAgIHRoaXMuX2lzVGVhcmluZ0Rvd24gPSBmYWxzZTtcblxuICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgfVxuICB9LmJpbmQodGhpcykpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBEZXN0cnVjdG9yO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBlbnVtZXJhdGUodmFsdWVzLCBwcmVmaXgpIHtcbiAgcHJlZml4ID0gcHJlZml4ID09IG51bGwgPyAnJyA6IHByZWZpeDtcblxuICByZXR1cm4gdmFsdWVzLnJlZHVjZShmdW5jdGlvbiAoZW51bWVyYXRpb24sIHZhbHVlKSB7XG4gICAgZW51bWVyYXRpb25bdmFsdWVdID0gcHJlZml4ICsgdmFsdWU7XG4gICAgcmV0dXJuIGVudW1lcmF0aW9uO1xuICB9LCB7fSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZW51bWVyYXRlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgU2VhbWxlc3NwYXlFcnJvciA9IHJlcXVpcmUoJy4vc2VhbWxlc3NwYXktZXJyb3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIElOVkFMSURfVVNFX09GX0lOVEVSTkFMX0ZVTkNUSU9OOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5JTlRFUk5BTCxcbiAgICBjb2RlOiAnSU5WQUxJRF9VU0VfT0ZfSU5URVJOQUxfRlVOQ1RJT04nXG4gIH0sXG4gIENBTExCQUNLX1JFUVVJUkVEOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnQ0FMTEJBQ0tfUkVRVUlSRUQnXG4gIH0sXG4gIElOU1RBTlRJQVRJT05fT1BUSU9OX1JFUVVJUkVEOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnSU5TVEFOVElBVElPTl9PUFRJT05fUkVRVUlSRUQnXG4gIH0sXG4gIElOVkFMSURfT1BUSU9OOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnSU5WQUxJRF9PUFRJT04nXG4gIH0sXG4gIElOQ09NUEFUSUJMRV9WRVJTSU9OUzoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTUVSQ0hBTlQsXG4gICAgY29kZTogJ0lOQ09NUEFUSUJMRV9WRVJTSU9OUydcbiAgfSxcbiAgSU5DT01QQVRJQkxFX0ZJRUxEU19TRVQ6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLk1FUkNIQU5ULFxuICAgIGNvZGU6ICdJTkNPTVBBVElCTEVfRklFTERTX1NFVCdcbiAgfSxcbiAgTUVUSE9EX0NBTExFRF9BRlRFUl9URUFSRE9XTjoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTUVSQ0hBTlQsXG4gICAgY29kZTogJ01FVEhPRF9DQUxMRURfQUZURVJfVEVBUkRPV04nXG4gIH0sXG4gIFNFQU1MRVNTUEFZX0FQSV9BQ0NFU1NfUkVTVFJJQ1RFRDoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTUVSQ0hBTlQsXG4gICAgY29kZTogJ1NFQU1MRVNTUEFZX0FQSV9BQ0NFU1NfUkVTVFJJQ1RFRCcsXG4gICAgbWVzc2FnZTogJ1lvdXIgYWNjZXNzIGlzIHJlc3RyaWN0ZWQgYW5kIGNhbm5vdCB1c2UgdGhpcyBwYXJ0IG9mIHRoZSBTZWFtbGVzc3BheSBBUEkuJ1xuICB9LFxuICBTRUFNTEVTU1BBWV9QQVlQQUxfTk9UX0xPQURFRDoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuSU5URVJOQUwsXG4gICAgY29kZTogJ1NFQU1MRVNTUEFZX1BBWVBBTF9OT1RfTE9BREVEJyxcbiAgICBtZXNzYWdlOiAnUGF5cGFsIFNESyBjb3VsZCBub3QgYmUgbG9hZGVkLidcbiAgfSxcbiAgSU5WQUxJRF9MQVRJTjFfU1RSSU5HOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5JTlRFUk5BTCxcbiAgICBjb2RlOiAnSU5WQUxJRF9MQVRJTjFfU1RSSU5HJ1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIHRoaXMuX2V2ZW50cyA9IHt9O1xufVxuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gZnVuY3Rpb24gKGV2ZW50LCBjYWxsYmFjaykge1xuICBpZiAodGhpcy5fZXZlbnRzW2V2ZW50XSkge1xuICAgIHRoaXMuX2V2ZW50c1tldmVudF0ucHVzaChjYWxsYmFjayk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5fZXZlbnRzW2V2ZW50XSA9IFtjYWxsYmFja107XG4gIH1cbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2VtaXQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgdmFyIGksIGFyZ3M7XG4gIHZhciBjYWxsYmFja3MgPSB0aGlzLl9ldmVudHNbZXZlbnRdO1xuXG4gIGlmICghY2FsbGJhY2tzKSB7IHJldHVybjsgfVxuXG4gIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG4gIGZvciAoaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcbiAgICBjYWxsYmFja3NbaV0uYXBwbHkobnVsbCwgYXJncyk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQVBJX0hPU1QgPSB1bmRlZmluZWQ7XG52YXIgUEFOVkFVTFRfSE9TVCA9IHVuZGVmaW5lZDtcbnZhciBBU1NFVFNfSE9TVCA9IFwiaHR0cDovL2xvY2FsaG9zdDozMDAxL2RldlwiO1xuXG52YXIgbGVnYWxIb3N0cyA9IFtcbiAgJ3NlYW1sZXNzcGF5LmNvbScsXG4gICdzZWFtbGVzc3BheS5kZXYnLFxuICAnc2VhbWxlc3NwYXkuaW8nLFxuICAnd2ViLXNkay5zZWFtbGVzc3BheS5jb20nLFxuICAnYXBpLnNlYW1sZXNzcGF5LmNvbScsXG4gICdhcGkuc2VhbWxlc3NwYXkuZGV2JyxcbiAgJ2FwaS5zZWFtbGVzc3BheS5pbycsXG4gICdwYW4tdmF1bHQuc2VhbWxlc3NwYXkuY29tJyxcbiAgJ3Bhbi12YXVsdC5zZWFtbGVzc3BheS5kZXYnLFxuICAncGFuLXZhdWx0LnNlYW1sZXNzcGF5LmlvJyxcbiAgJ2FwaS5zYW5kYm94LnNlYW1sZXNzcGF5LmNvbScsXG4gICdhcGkuc2FuZGJveC5zZWFtbGVzc3BheS5kZXYnLFxuICAnYXBpLnNhbmRib3guc2VhbWxlc3NwYXkuaW8nLFxuICAncGFuLXZhdWx0LnNhbmRib3guc2VhbWxlc3NwYXkuY29tJyxcbiAgJ3Bhbi12YXVsdC5zYW5kYm94LnNlYW1sZXNzcGF5LmRldicsXG4gICdwYW4tdmF1bHQuc2FuZGJveC5zZWFtbGVzc3BheS5pbydcbl07XG5cbi8vIHJlbW92ZUlmKHByb2R1Y3Rpb24pXG5sZWdhbEhvc3RzLnB1c2goJ2xvY2FsaG9zdCcpO1xuaWYgKEFQSV9IT1NUKSB7XG4gIGxlZ2FsSG9zdHMucHVzaChzdHJpcFN1YmRvbWFpbnMoQVBJX0hPU1QpKTtcbn1cbmlmIChQQU5WQVVMVF9IT1NUKSB7XG4gIGxlZ2FsSG9zdHMucHVzaChzdHJpcFN1YmRvbWFpbnMoUEFOVkFVTFRfSE9TVCkpO1xufVxuaWYgKEFTU0VUU19IT1NUKSB7XG4gIGxlZ2FsSG9zdHMucHVzaChzdHJpcFN1YmRvbWFpbnMoQVNTRVRTX0hPU1QpLnJlcGxhY2UoJ2h0dHA6Ly8nLCAnJykucmVwbGFjZSgnaHR0cHM6Ly8nLCAnJykpO1xufVxuLy8gZW5kUmVtb3ZlSWYocHJvZHVjdGlvbilcblxuZnVuY3Rpb24gc3RyaXBTdWJkb21haW5zKGRvbWFpbikge1xuICByZXR1cm4gZG9tYWluLnNwbGl0KCcuJykuc2xpY2UoLTIpLmpvaW4oJy4nKTtcbn1cblxuZnVuY3Rpb24gaXNXaGl0ZWxpc3RlZERvbWFpbih1cmwpIHtcbiAgLy8gdmFyIG1haW5Eb21haW47XG5cbiAgLy8gdXJsID0gdXJsLnRvTG93ZXJDYXNlKCk7XG5cbiAgLy8gaWYgKCEobmV3IFJlZ0V4cCgnXmh0dHBzPzonKSkudGVzdCh1cmwpKSB7XG4gIC8vICAgcmV0dXJuIGZhbHNlO1xuICAvLyB9XG5cbiAgLy8gcGFyc2VyID0gcGFyc2VyIHx8IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgLy8gcGFyc2VyLmhyZWYgPSB1cmw7XG4gIC8vIG1haW5Eb21haW4gPSBzdHJpcFN1YmRvbWFpbnMocGFyc2VyLmhvc3RuYW1lKTtcbiAgdHJ5IHtcbiAgICB2YXIgcGFyc2VkVXJsID0gbmV3IFVSTCh1cmwpO1xuICAgIHJldHVybiBsZWdhbEhvc3RzLmluZGV4T2Yoc3RyaXBTdWJkb21haW5zKHBhcnNlZFVybC5ob3N0bmFtZSkpICE9PSAtMTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzV2hpdGVsaXN0ZWREb21haW47XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBQcm9taXNlID0gZ2xvYmFsLlByb21pc2U7XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvbWlzZTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGVudW1lcmF0ZSA9IHJlcXVpcmUoJy4vZW51bWVyYXRlJyk7XG5cbi8qKlxuICogQGNsYXNzXG4gKiBAZ2xvYmFsXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyBDb25zdHJ1Y3Rpb24gb3B0aW9uc1xuICogQGNsYXNzZGVzYyBUaGlzIGNsYXNzIGlzIHVzZWQgdG8gcmVwb3J0IGVycm9yIGNvbmRpdGlvbnMsIGZyZXF1ZW50bHkgYXMgdGhlIGZpcnN0IHBhcmFtZXRlciB0byBjYWxsYmFja3MgdGhyb3VnaG91dCB0aGUgU2VhbWxlc3NwYXkgU0RLLlxuICogQGRlc2NyaXB0aW9uIDxzdHJvbmc+WW91IGNhbm5vdCB1c2UgdGhpcyBjb25zdHJ1Y3RvciBkaXJlY3RseS4gSW50ZXJhY3Qgd2l0aCBpbnN0YW5jZXMgb2YgdGhpcyBjbGFzcyB0aHJvdWdoIHtAbGluayBjYWxsYmFjayBjYWxsYmFja3N9Ljwvc3Ryb25nPlxuICovXG5mdW5jdGlvbiBTZWFtbGVzc3BheUVycm9yKG9wdGlvbnMpIHtcbiAgaWYgKCFTZWFtbGVzc3BheUVycm9yLnR5cGVzLmhhc093blByb3BlcnR5KG9wdGlvbnMudHlwZSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3Iob3B0aW9ucy50eXBlICsgJyBpcyBub3QgYSB2YWxpZCB0eXBlLicpO1xuICB9XG5cbiAgaWYgKCFvcHRpb25zLmNvZGUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yIGNvZGUgcmVxdWlyZWQuJyk7XG4gIH1cblxuICBpZiAoIW9wdGlvbnMubWVzc2FnZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignRXJyb3IgbWVzc2FnZSByZXF1aXJlZC4nKTtcbiAgfVxuXG4gIHRoaXMubmFtZSA9ICdTZWFtbGVzc3BheUVycm9yJztcblxuICAvKipcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICogQGRlc2NyaXB0aW9uIEEgY29kZSB0aGF0IGNvcnJlc3BvbmRzIHRvIHNwZWNpZmljIGVycm9ycy5cbiAgICovXG4gIHRoaXMuY29kZSA9IG9wdGlvbnMuY29kZTtcblxuICAvKipcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICogQGRlc2NyaXB0aW9uIEEgc2hvcnQgZGVzY3JpcHRpb24gb2YgdGhlIGVycm9yLlxuICAgKi9cbiAgdGhpcy5tZXNzYWdlID0gb3B0aW9ucy5tZXNzYWdlO1xuXG4gIC8qKlxuICAgKiBAdHlwZSB7U2VhbWxlc3NwYXlFcnJvci50eXBlc31cbiAgICogQGRlc2NyaXB0aW9uIFRoZSB0eXBlIG9mIGVycm9yLlxuICAgKi9cbiAgdGhpcy50eXBlID0gb3B0aW9ucy50eXBlO1xuXG4gIC8qKlxuICAgKiBAdHlwZSB7b2JqZWN0PX1cbiAgICogQGRlc2NyaXB0aW9uIEFkZGl0aW9uYWwgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGVycm9yLCBzdWNoIGFzIGFuIHVuZGVybHlpbmcgbmV0d29yayBlcnJvciByZXNwb25zZS5cbiAgICovXG4gIHRoaXMuZGV0YWlscyA9IG9wdGlvbnMuZGV0YWlscztcbn1cblxuU2VhbWxlc3NwYXlFcnJvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSk7XG5TZWFtbGVzc3BheUVycm9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFNlYW1sZXNzcGF5RXJyb3I7XG5cbi8qKlxuICogRW51bSBmb3Ige0BsaW5rIFNlYW1sZXNzcGF5RXJyb3J9IHR5cGVzLlxuICogQG5hbWUgU2VhbWxlc3NwYXlFcnJvci50eXBlc1xuICogQGVudW1cbiAqIEByZWFkb25seVxuICogQG1lbWJlcm9mIFNlYW1sZXNzcGF5RXJyb3JcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBDVVNUT01FUiBBbiBlcnJvciBjYXVzZWQgYnkgdGhlIGN1c3RvbWVyLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IE1FUkNIQU5UIEFuIGVycm9yIHRoYXQgaXMgYWN0aW9uYWJsZSBieSB0aGUgbWVyY2hhbnQuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gTkVUV09SSyBBbiBlcnJvciBkdWUgdG8gYSBuZXR3b3JrIHByb2JsZW0uXG4gKiBAcHJvcGVydHkge3N0cmluZ30gSU5URVJOQUwgQW4gZXJyb3IgY2F1c2VkIGJ5IFNlYW1sZXNzcGF5IGNvZGUuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gVU5LTk9XTiBBbiBlcnJvciB3aGVyZSB0aGUgb3JpZ2luIGlzIHVua25vd24uXG4gKi9cblNlYW1sZXNzcGF5RXJyb3IudHlwZXMgPSBlbnVtZXJhdGUoW1xuICAnQ1VTVE9NRVInLFxuICAnTUVSQ0hBTlQnLFxuICAnTkVUV09SSycsXG4gICdJTlRFUk5BTCcsXG4gICdVTktOT1dOJ1xuXSk7XG5cbm1vZHVsZS5leHBvcnRzID0gU2VhbWxlc3NwYXlFcnJvcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gdXVpZCgpIHtcbiAgcmV0dXJuICd4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHgnLnJlcGxhY2UoL1t4eV0vZywgZnVuY3Rpb24gKGMpIHtcbiAgICB2YXIgciA9IE1hdGgucmFuZG9tKCkgKiAxNiB8IDA7XG4gICAgdmFyIHYgPSBjID09PSAneCcgPyByIDogciAmIDB4MyB8IDB4ODtcblxuICAgIHJldHVybiB2LnRvU3RyaW5nKDE2KTtcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdXVpZDtcbiJdfQ==
