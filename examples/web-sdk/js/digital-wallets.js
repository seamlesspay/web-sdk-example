(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.seamlesspay || (g.seamlesspay = {})).digitalWallets = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(_dereq_,module,exports){
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

var events = _dereq_('../shared/constants').events;

function EventEmitter() {
	this._events = {};
}

EventEmitter.prototype.on = function (event, callback) {
	this._events[event] = [callback];
  this._bus.emit(events.PAYMENT_REQUEST_CREATE_HANDLER, event);
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

},{"../shared/constants":14}],11:[function(_dereq_,module,exports){
'use strict';

var Bus = _dereq_('../../lib/bus');
var convertMethodsToError = _dereq_('../../lib/convert-methods-to-error');
var iFramer = _dereq_('@braintree/iframer');
var uuid = _dereq_('../../lib/uuid');
var methods = _dereq_('../../lib/methods');
var EventEmitter = _dereq_('./event-emitter');
var Promise = _dereq_('../../lib/promise');
var SeamlesspayError = _dereq_('../../lib/seamlesspay-error');
var VERSION = "web-sdk";
var constants = _dereq_('../shared/constants');
var { formatChargeResponse } = _dereq_('./response-formatters');

var events = constants.events;
var errors = constants.errors;

var APPLE_PAY_API_VERSION = constants.APPLE_PAY_API_VERSION;
var SUPPORTED_NETWORKS_APPLE_PAY = constants.SUPPORTED_NETWORKS_APPLE_PAY;
var MERCHANT_CAPABILITIES_APPLE_PAY = constants.MERCHANT_CAPABILITIES_APPLE_PAY;
var SEAMLESSPAY_PAY_WITH_APPLE_MERCHANT_ID = constants.SEAMLESSPAY_PAY_WITH_APPLE_MERCHANT_ID;
var SEAMLESSPAY_PAY_WITH_GOOGLE_MERCHANT_ID = constants.SEAMLESSPAY_PAY_WITH_GOOGLE_MERCHANT_ID;
var DEFAULT_COUNTRY_CODE = constants.DEFAULT_COUNTRY_CODE;
var PAYMENT_REQUEST_METHOD_APPLE_PAY = constants.PAYMENT_REQUEST_METHOD_APPLE_PAY;
var PAYMENT_REQUEST_METHOD_GOOGLE_PAY = constants.PAYMENT_REQUEST_METHOD_GOOGLE_PAY;
var GOOGLE_PAY_API_VERSION = constants.GOOGLE_PAY_API_VERSION;
var GOOGLE_PAY_API_MINOR_VERSION = constants.GOOGLE_PAY_API_MINOR_VERSION;
var MERCHANT_CAPABILITIES_GOOGLE_PAY = constants.MERCHANT_CAPABILITIES_GOOGLE_PAY;
var SUPPORTED_NETWORKS_GOOGLE_PAY = constants.SUPPORTED_NETWORKS_GOOGLE_PAY;
var GOOGLE_PAY_GATEWAY = constants.GOOGLE_PAY_GATEWAY;
var GOOGLE_PAY_GATEWAY_MERCHANT_ID = constants.GOOGLE_PAY_GATEWAY_MERCHANT_ID;

/**
 * @typedef {object} PaymentRequestComponent~tokenizePayload
 * @property {string} nonce The payment method nonce.
 * @property {object} details Additional account details.
 * @property {string} details.cardType Type of card, ex: Visa, MasterCard.
 * @property {string} details.lastFour Last four digits of card number.
 * @property {string} details.lastTwo Last two digits of card number.
 * @property {object} details.rawPaymentResponse The raw payment response from the payment request, with sensitive card details removed.
 * @property {string} description A human-readable description.
 * @property {string} type The payment method type, `CreditCard` or `AndroidPayCard`.
 * @property {object} binData Information about the card based on the bin.
 * @property {string} binData.commercial Possible values: 'Yes', 'No', 'Unknown'.
 * @property {string} binData.countryOfIssuance The country of issuance.
 * @property {string} binData.debit Possible values: 'Yes', 'No', 'Unknown'.
 * @property {string} binData.durbinRegulated Possible values: 'Yes', 'No', 'Unknown'.
 * @property {string} binData.healthcare Possible values: 'Yes', 'No', 'Unknown'.
 * @property {string} binData.issuingBank The issuing bank.
 * @property {string} binData.payroll Possible values: 'Yes', 'No', 'Unknown'.
 * @property {string} binData.prepaid Possible values: 'Yes', 'No', 'Unknown'.
 * @property {string} binData.productId The product id.
 */

function composeUrl(config, componentId, isDebug) {
  var assetsUrl = config.gatewayConfiguration.assetsUrl;

  if (isDebug) {
    assetsUrl = assetsUrl.replace('https', 'http');
  }
  var min = isDebug ? '' : '.min';

  return assetsUrl + '/' + VERSION + '/html/digital-wallets-frame' + min + '.html#' + componentId;
}

function createInputEventHandler() {
  return function (eventData, reply) {
    var callback = {};
    if (eventData.handlerName) {
      callback[eventData.handlerName] = reply;
    }
    this._emit(eventData.type, Object.assign(eventData.payload, callback));
  };
}

function processError(cbFn) {
  return function (error) {
    var formattedError;

    if (error.name === 'AbortError') {
      formattedError = new SeamlesspayError({
        type: errors.PAYMENT_REQUEST_CANCELED.type,
        code: errors.PAYMENT_REQUEST_CANCELED.code,
        message: errors.PAYMENT_REQUEST_CANCELED.message,
        details: {
          originalError: error,
        },
      });
    } else if (error.name === 'PAYMENT_REQUEST_INITIALIZATION_FAILED') {
      formattedError = new SeamlesspayError({
        type: errors.PAYMENT_REQUEST_INITIALIZATION_MISCONFIGURED.type,
        code: errors.PAYMENT_REQUEST_INITIALIZATION_MISCONFIGURED.code,
        message: errors.PAYMENT_REQUEST_INITIALIZATION_MISCONFIGURED.message,
        details: {
          originalError: error,
        },
      });
    } else if (error.name === 'SEAMLESSPAY_GATEWAY_PAY_WITH_GOOGLE_TOKENIZATION_ERROR') {
      formattedError = new SeamlesspayError({
        type: errors.PAYMENT_REQUEST_PAY_WITH_GOOGLE_FAILED_TO_TOKENIZE.type,
        code: errors.PAYMENT_REQUEST_PAY_WITH_GOOGLE_FAILED_TO_TOKENIZE.code,
        message: errors.PAYMENT_REQUEST_PAY_WITH_GOOGLE_FAILED_TO_TOKENIZE.message,
        details: {
          originalError: error,
        },
      });
    } else if (error.name === 'SEAMLESSPAY_GATEWAY_PAY_WITH_GOOGLE_PARSING_ERROR') {
      formattedError = new SeamlesspayError({
        type: errors.PAYMENT_REQUEST_PAY_WITH_GOOGLE_PARSING_ERROR.type,
        code: errors.PAYMENT_REQUEST_PAY_WITH_GOOGLE_PARSING_ERROR.code,
        message: errors.PAYMENT_REQUEST_PAY_WITH_GOOGLE_PARSING_ERROR.message,
        details: {
          originalError: error,
        },
      });
    } else {
      formattedError = new SeamlesspayError({
        code: errors.PAYMENT_REQUEST_NOT_COMPLETED.code,
        type: error.type || SeamlesspayError.types.CUSTOMER,
        message: errors.PAYMENT_REQUEST_NOT_COMPLETED.message,
        details: {
          originalError: error,
        },
      });
    }
    cbFn(formattedError);
  };
}

/**
 * @class PaymentRequestComponent
 * @param {object} options The Digital Wallets Component {@link module:seamlesspay-web/payment-request.create create} options.
 * @description <strong>Do not use this constructor directly. Use {@link module:seamlesspay-web/payment-request.create|seamlesspay-web.payment-request.create} instead.</strong>
 *
 * @classdesc This class represents a Digital Wallets component produced by {@link module:seamlesspay-web/payment-request.create|seamlesspay-web/payment-request.create}. Instances of this class have methods for initializing a Digital Wallets.
 *
 * **Note:** This component is currently in beta and the API may include breaking changes when upgrading.
 */
function PaymentRequestComponent(options) {
  this._componentId = uuid();
  this._client = options.client;
  this._analyticsName = 'digital-wallets';
  this._paymentButton = null;
  this._paymentData = options.paymentData;
  this._paymentButtonContainerSelector = options.paymentButtonContainer.selector;
  this._enabledPaymentMethods = {
    payWithGoogle: options.supportedWalletTypes.includes('google_pay'),
    payWithApple: options.supportedWalletTypes.includes('apple_pay'),
  };
  this._merchantName = options.options && options.options.merchantName;
  this._supportedPaymentMethods = this._constructDefaultSupportedPaymentMethods();
  this._paymentRequest = {
    supportedPaymentMethods: this._supportedPaymentMethods,
    paymentData: options.paymentData,
  };
  this._bus = new Bus({ channel: this._componentId });

  EventEmitter.call(this);
}

PaymentRequestComponent.prototype = Object.create(EventEmitter.prototype, {
  constructor: PaymentRequestComponent,
});

PaymentRequestComponent.prototype._setupPaymentButton = function (containerSelector) {
  var self = this;
  var container = document.querySelector(containerSelector);

  if (!container) {
    throw new SeamlesspayError({
      type: errors.PAYMENT_REQUEST_INVALID_PAYMENT_BUTTON_CONTAINER_SELECTOR.type,
      code: errors.PAYMENT_REQUEST_INVALID_PAYMENT_BUTTON_CONTAINER_SELECTOR.code,
      message: errors.PAYMENT_REQUEST_INVALID_PAYMENT_BUTTON_CONTAINER_SELECTOR.message,
      details: {
        paymentButtonContainerSelector: containerSelector,
      },
    });
  }

  if (window.ApplePaySession) {
    var style = document.createElement('style');
    style.innerHTML = `
        .apple-pay-button {
            display: inline-block;
            -webkit-appearance: -apple-pay-button;
            -apple-pay-button-type: plain;
        }
        .apple-pay-button-black {
            -apple-pay-button-style: black;
        }
        .apple-pay-button-white {
            -apple-pay-button-style: white;
        }
        .apple-pay-button-white-with-line {
            -apple-pay-button-style: white-outline;
        }
    `;
    document.head.appendChild(style);
    var applePayButton = document.createElement('div');
    applePayButton.classList.add('apple-pay-button', 'apple-pay-button-black');
    container.appendChild(applePayButton);

    applePayButton.addEventListener('click', function () {
      self
        .show()
        .then((paymentResponse) => {
          self._paymentResponseHandler(null, formatChargeResponse(paymentResponse));
        })
        .catch((error) => {
          self._paymentResponseHandler(error, null);
        });
    });
  }
};

PaymentRequestComponent.prototype._constructDefaultSupportedPaymentMethods = function () {
  var configuration = this._client.getConfiguration();
  var isProduction = configuration.gatewayConfiguration.environment === 'production';
  var supportedPaymentMethods = {};

  if (this._enabledPaymentMethods.payWithApple) {
    supportedPaymentMethods.payWithApple = {
      supportedMethods: [PAYMENT_REQUEST_METHOD_APPLE_PAY],
      data: {
        version: APPLE_PAY_API_VERSION,
        supportedNetworks: SUPPORTED_NETWORKS_APPLE_PAY,
        merchantIdentifier: SEAMLESSPAY_PAY_WITH_APPLE_MERCHANT_ID,
        merchantCapabilities: MERCHANT_CAPABILITIES_APPLE_PAY,
        countryCode: DEFAULT_COUNTRY_CODE,
      },
    };
  }

  if (this._enabledPaymentMethods.payWithGoogle) {
    supportedPaymentMethods.payWithGoogle = {
      supportedMethods: [PAYMENT_REQUEST_METHOD_GOOGLE_PAY],
      data: {
        environment: isProduction ? 'PRODUCTION' : 'TEST',
        apiVersion: GOOGLE_PAY_API_VERSION,
        apiVersionMinor: GOOGLE_PAY_API_MINOR_VERSION,
        merchantInfo: {
          merchantId: SEAMLESSPAY_PAY_WITH_GOOGLE_MERCHANT_ID,
          merchantName: this._merchantName,
        },
        allowedPaymentMethods: [
          {
            type: 'CARD',
            parameters: {
              allowedAuthMethods: MERCHANT_CAPABILITIES_GOOGLE_PAY,
              allowedCardNetworks: SUPPORTED_NETWORKS_GOOGLE_PAY,
              billingAddressRequired: true,
            },
            tokenizationSpecification: {
              type: 'PAYMENT_GATEWAY',
              parameters: {
                gateway: GOOGLE_PAY_GATEWAY,
                gatewayMerchantId: GOOGLE_PAY_GATEWAY_MERCHANT_ID,
              },
            },
          },
        ],
      },
    };
  }

  return supportedPaymentMethods;
};

PaymentRequestComponent.prototype.initialize = function () {
  var self = this;
  var clientConfiguration = self._client.getConfiguration();

  self._frame = iFramer({
    allow: 'payment',
    name: 'seamlesspay-digital-wallets-frame',
    class: 'seamlesspay-digital-wallets-frame',
    width: '100%',
    height: '100%',
    style: {
      position: 'absolute',
      left: '-9999px',
    },
  });

  if (Object.keys(self._supportedPaymentMethods).length === 0) {
    return Promise.reject(new SeamlesspayError(errors.PAYMENT_REQUEST_NO_VALID_SUPPORTED_PAYMENT_METHODS));
  }

  return new Promise(function (resolve) {
    self._bus.on(events.FRAME_READY, function (reply) {
      reply({ client: self._client, enabledPaymentMethods: self._enabledPaymentMethods });
      self._emit('ready');
    });
    self._bus.on(events.FRAME_CAN_MAKE_REQUESTS, function () {
      resolve(self);
    });

    self._frame.src = composeUrl(clientConfiguration, self._componentId, clientConfiguration.isDebug);
    document.body.appendChild(self._frame);

    self._bus.on(events.INPUT_EVENT, createInputEventHandler().bind(self));

    self._setupPaymentButton(self._paymentButtonContainerSelector);
  });
};

PaymentRequestComponent.prototype.show = function () {
  var self = this;
  return new Promise(function (resolve, reject) {
    self._bus.emit(
      events.PAYMENT_REQUEST_INVOKED,
      {
        supportedPaymentMethods: self._paymentRequest.supportedPaymentMethods,
        paymentData: self._paymentRequest.paymentData,
        options: self._paymentRequest.options,
      },
      'show'
    );

    self._bus.on(events.PAYMENT_REQUEST_INVOKED_SUCCESSFUL, function (payload) {
      resolve(payload);
    });

    self._bus.on(events.PAYMENT_REQUEST_INVOKED_FAILED, processError.call(self, reject));
  });
};

PaymentRequestComponent.prototype.addPaymentResponseHandler = function (handler) {
  if (typeof handler !== 'function') {
    return;
  }
  this._paymentResponseHandler = handler;
};

/**
 * Cleanly remove anything set up by {@link module:seamlesspay-web/payment-request.create|create}.
 * @public
 * @param {callback} [callback] Called on completion.
 * @example
 * paymentRequestInstance.teardown();
 * @example <caption>With callback</caption>
 * paymentRequestInstance.teardown(function () {
 *   // teardown is complete
 * });
 * @returns {Promise|void} Returns a promise if no callback is provided.
 */
PaymentRequestComponent.prototype.teardown = function () {
  this._bus.teardown();
  this._frame.parentNode.removeChild(this._frame);

  convertMethodsToError(this, methods(PaymentRequestComponent.prototype).concat(methods(EventEmitter.prototype)));

  return Promise.resolve();
};

module.exports = PaymentRequestComponent;

},{"../../lib/bus":18,"../../lib/convert-methods-to-error":19,"../../lib/methods":23,"../../lib/promise":24,"../../lib/seamlesspay-error":25,"../../lib/uuid":26,"../shared/constants":14,"./event-emitter":10,"./response-formatters":12,"@braintree/iframer":1}],12:[function(_dereq_,module,exports){

function formatChargeResponse(payload) {
  if (!(payload instanceof Object)) return payload

  var {
    accountType,
    amount,
    authCode,
    batchId,
    currency,
    expDate,
    id,
    lastFour,
    paymentNetwork,
    status,
    statusCode,
    statusDescription,
    surchargeFeeAmount,
    tip,
    token: paymentToken,
    transactionDate,
  } = payload;

  return {
    paymentToken,
    details: {
      accountType,
      amount,
      authCode,
      batchId,
      currency,
      expDate,
      id,
      lastFour,
      paymentNetwork,
      status,
      statusCode,
      statusDescription,
      surchargeFeeAmount,
      tip,
      transactionDate,
    }
  };
}

module.exports = {
  formatChargeResponse
}

},{}],13:[function(_dereq_,module,exports){
'use strict';
/**
 * @module seamlesspay-web/payment-request
 * @description A component to integrate with the Digital Wallets API.
 *
 * **Note:** This component is currently in beta and the API may include breaking changes when upgrading.
 * */

var PaymentRequestComponent = _dereq_('./external/payment-request');
var basicComponentVerification = _dereq_('../lib/basic-component-verification');
var wrapPromise = _dereq_('@braintree/wrap-promise');
var VERSION = "web-sdk";

/**
 * @static
 * @function create
 * @param {object} options Creation options:
 * @param {Client} options.client A {@link Client} instance.
 * @param {object} [options.enabledPaymentMethods] An object representing which payment methods to display.
 * @param {boolean} [options.enabledPaymentMethods.payWithGoogle=true] Whether or not to display Pay with Google as an option in the Digital Wallets dialog. If left blank or set to true, Pay with Google will be displayed in the dialog if the merchant account is set up to process Pay with Google.
 * @param {callback} [callback] The second argument, `data`, is the {@link PaymentRequestComponent} instance. If no callback is provided, `create` returns a promise that resolves with the {@link PaymentRequestComponent} instance.
 * @returns {Promise|void} Returns a promise if no callback is provided.
 * @example
 * if (window.PaymentRequest) {
 *   seamlesspay.digitalWallets.create({
 *     client: clientInstance
 *   }, cb);
 * } else {
 *   // fall back to Hosted Fields if browser does not support Digital Wallets API
 *   seamlesspay.hostedFields.create(hostedFieldsOptions, cb);
 * }
 * @example <caption>Explicitly turning off credit cards from Digital Wallets API dialog</caption>
 * seamlesspay.digitalWallets.create({
 *   client: clientInstance,
 *   enabledPaymentMethods: {
 *     payWithGoogle: true,
 *   }
 * }, cb);
 */

function create(options) {
  return basicComponentVerification.verify({
    name: 'Digital Wallets',
    client: options.client
  }).then(function () {
    var paymentRequestInstance = new PaymentRequestComponent(options);
    return paymentRequestInstance.initialize();
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

},{"../lib/basic-component-verification":15,"./external/payment-request":11,"@braintree/wrap-promise":8}],14:[function(_dereq_,module,exports){
'use strict';

var SeamlesspayError = _dereq_('../../lib/seamlesspay-error');
var enumerate = _dereq_('../../lib/enumerate');

var paymentTypes = {
  PAYMENT_TYPE_CREDIT: 'credit_card',
  PAYMENT_TYPE_ACH: 'ach'
};

var APPLE_PAY_PAYMENT_TYPES = {
	credit: paymentTypes.PAYMENT_TYPE_CREDIT
};

var PR_HANDLER_SHIPPING_ADDRESS_CHANGE = 'shippingaddresschange';
var PR_HANDLER_SHIPPING_OPTION_CHANGE = 'shippingoptionchange';
var PR_HANDLER_MERCHANT_VALIDATION = 'merchantvalidation';
var PR_HANDLER_PAYMENT_METHOD = 'paymentmethod';
var PR_HANDLER_CANCEL = 'cancel';

var PAYMENT_REQUEST_METHOD_BASIC = 'basic-card';
var	PAYMENT_REQUEST_METHOD_APPLE_PAY = 'https://apple.com/apple-pay';
var	PAYMENT_REQUEST_METHOD_GOOGLE_PAY = 'https://google.com/pay';

var PAYMENT_REQUEST_METHOD_TYPE_APPLE_PAY = 'APPLE_PAY';

var PAYMENT_REQUEST_METHOD_TYPES = {};
PAYMENT_REQUEST_METHOD_TYPES[PAYMENT_REQUEST_METHOD_APPLE_PAY] = PAYMENT_REQUEST_METHOD_TYPE_APPLE_PAY;

var PR_HANDLERS = [
	PR_HANDLER_SHIPPING_ADDRESS_CHANGE,
	PR_HANDLER_SHIPPING_OPTION_CHANGE,
	PR_HANDLER_MERCHANT_VALIDATION,
  PR_HANDLER_PAYMENT_METHOD,
  PR_HANDLER_CANCEL
];

var constants = {
  paymentTypes: paymentTypes,
	APPLE_PAY_API_VERSION: 8,
	GOOGLE_PAY_API_VERSION: 2,
	GOOGLE_PAY_API_MINOR_VERSION: 0,
  GOOGLE_PAY_GATEWAY: 'seamlesspay',
  GOOGLE_PAY_GATEWAY_MERCHANT_ID: 'googletest',
	SUPPORTED_NETWORKS_APPLE_PAY: ['amex', 'chinaUnionPay', 'discover', 'maestro', 'masterCard', 'visa'],
	SUPPORTED_NETWORKS_GOOGLE_PAY: ['AMEX', 'DISCOVER', 'JCB', 'MASTERCARD', 'VISA'],
	MERCHANT_CAPABILITIES_APPLE_PAY: ['supports3DS', 'supportsCredit', 'supportsDebit'],
	// MERCHANT_CAPABILITIES_GOOGLE_PAY: ['CRYPTOGRAM_3DS'],
	MERCHANT_CAPABILITIES_GOOGLE_PAY: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
	SEAMLESSPAY_PAY_WITH_APPLE_MERCHANT_ID: 'merchant.com.seamlesspay.wallet',
	SEAMLESSPAY_PAY_WITH_GOOGLE_MERCHANT_ID: 'seamlesspay',
	DEFAULT_COUNTRY_CODE: 'US',
	PAYMENT_REQUEST_METHOD_BASIC: PAYMENT_REQUEST_METHOD_BASIC,
	PAYMENT_REQUEST_METHOD_APPLE_PAY: PAYMENT_REQUEST_METHOD_APPLE_PAY,
  PAYMENT_REQUEST_METHOD_GOOGLE_PAY: PAYMENT_REQUEST_METHOD_GOOGLE_PAY,
	PR_HANDLER_SHIPPING_ADDRESS_CHANGE: PR_HANDLER_SHIPPING_ADDRESS_CHANGE,
	PR_HANDLER_SHIPPING_OPTION_CHANGE: PR_HANDLER_SHIPPING_OPTION_CHANGE,
	PR_HANDLER_MERCHANT_VALIDATION: PR_HANDLER_MERCHANT_VALIDATION,
  PR_HANDLER_PAYMENT_METHOD: PR_HANDLER_PAYMENT_METHOD,
  PR_HANDLER_CANCEL: PR_HANDLER_CANCEL,
	PR_HANDLERS: PR_HANDLERS,
	APPLE_PAY_PAYMENT_TYPES: APPLE_PAY_PAYMENT_TYPES,
	PAYMENT_REQUEST_SUPPORTED_METHODS: [
		PAYMENT_REQUEST_METHOD_BASIC,
		PAYMENT_REQUEST_METHOD_APPLE_PAY,
    PAYMENT_REQUEST_METHOD_GOOGLE_PAY
	],
	PAYMENT_REQUEST_METHOD_TYPES: PAYMENT_REQUEST_METHOD_TYPES,
	PAYMENT_REQUEST_METHOD_TYPE_APPLE_PAY: PAYMENT_REQUEST_METHOD_TYPE_APPLE_PAY
};

constants.events = enumerate([
  'FRAME_READY',
  'FRAME_CAN_MAKE_REQUESTS',
  'PAYMENT_REQUEST_INITIALIZED',
  'PAYMENT_REQUEST_READY',
  'PAYMENT_REQUEST_FAILED',
  'PAYMENT_REQUEST_SUCCESSFUL',
  'PAYMENT_REQUEST_SHIPPING_ADDRESS_CHANGE',
  'PAYMENT_REQUEST_CREATE_HANDLER',
	'INPUT_EVENT',
  'PAYMENT_REQUEST_INVOKED',
  'PAYMENT_REQUEST_INVOKED_SUCCESSFUL',
  'PAYMENT_REQUEST_INVOKED_FAILED',
], 'payment-request:');

constants.errors = {
  PAYMENT_REQUEST_NO_VALID_SUPPORTED_PAYMENT_METHODS: {
    type: SeamlesspayError.types.MERCHANT,
    code: 'PAYMENT_REQUEST_NO_VALID_SUPPORTED_PAYMENT_METHODS',
    message: 'There are no supported payment methods associated with this account.'
  },
  PAYMENT_REQUEST_CANCELED: {
    type: SeamlesspayError.types.CUSTOMER,
    code: 'PAYMENT_REQUEST_CANCELED',
    message: 'Payment request was canceled.'
  },
  PAYMENT_REQUEST_INITIALIZATION_MISCONFIGURED: {
    type: SeamlesspayError.types.MERCHANT,
    code: 'PAYMENT_REQUEST_INITIALIZATION_MISCONFIGURED',
    message: 'Something went wrong when configuring the payment request.'
  },
  PAYMENT_REQUEST_PAY_WITH_GOOGLE_FAILED_TO_TOKENIZE: {
    type: SeamlesspayError.types.MERCHANT,
    code: 'PAYMENT_REQUEST_PAY_WITH_GOOGLE_FAILED_TO_TOKENIZE',
    message: 'Something went wrong when tokenizing the Pay with Google card.'
  },
  PAYMENT_REQUEST_PAY_WITH_GOOGLE_PARSING_ERROR: {
    type: SeamlesspayError.types.UNKNOWN,
    code: 'PAYMENT_REQUEST_PAY_WITH_GOOGLE_PARSING_ERROR',
    message: 'Something went wrong when tokenizing the Pay with Google card.'
  },
  PAYMENT_REQUEST_NOT_COMPLETED: {
    code: 'PAYMENT_REQUEST_NOT_COMPLETED',
    message: 'Payment request could not be completed.'
  },
  PAYMENT_REQUEST_CREATE_SUPPORTED_PAYMENT_METHODS_CONFIGURATION_MUST_INCLUDE_TYPE: {
    type: SeamlesspayError.types.MERCHANT,
    code: 'PAYMENT_REQUEST_CREATE_SUPPORTED_PAYMENT_METHODS_CONFIGURATION_MUST_INCLUDE_TYPE',
    message: 'createSupportedPaymentMethodsConfiguration must include a type parameter.'
  },
  PAYMENT_REQUEST_CREATE_SUPPORTED_PAYMENT_METHODS_CONFIGURATION_TYPE_NOT_ENABLED: {
    type: SeamlesspayError.types.MERCHANT,
    code: 'PAYMENT_REQUEST_CREATE_SUPPORTED_PAYMENT_METHODS_CONFIGURATION_TYPE_NOT_ENABLED',
    message: 'createSupportedPaymentMethodsConfiguration type parameter must be valid or enabled.'
  },
  PAYMENT_REQUEST_INVALID_PAYMENT_BUTTON_CONTAINER_SELECTOR: {
    type: SeamlesspayError.types.CUSTOMER,
    code: 'PAYMENT_REQUEST_INVALID_PAYMENT_BUTTON_CONTAINER_SELECTOR',
    message: 'Invalid payment button container selector.'
  },
};

module.exports = constants;

},{"../../lib/enumerate":20,"../../lib/seamlesspay-error":25}],15:[function(_dereq_,module,exports){
'use strict';

var SeamlesspayError = _dereq_('./seamlesspay-error');
var Promise = _dereq_('./promise');
var sharedErrors = _dereq_('./errors');
var VERSION = "web-sdk";

function basicComponentVerification(options) {
  var client, clientVersion, name;

  if (!options) {
    return Promise.reject(new SeamlesspayError({
      type: sharedErrors.INVALID_USE_OF_INTERNAL_FUNCTION.type,
      code: sharedErrors.INVALID_USE_OF_INTERNAL_FUNCTION.code,
      message: 'Options must be passed to basicComponentVerification function.'
    }));
  }

  name = options.name;
  client = options.client;

  if (client == null) {
    return Promise.reject(new SeamlesspayError({
      type: sharedErrors.INSTANTIATION_OPTION_REQUIRED.type,
      code: sharedErrors.INSTANTIATION_OPTION_REQUIRED.code,
      message: 'options.client is required when instantiating ' + name + '.'
    }));
  }

  clientVersion = client.getVersion();

  if (clientVersion !== VERSION) {
    return Promise.reject(new SeamlesspayError({
      type: sharedErrors.INCOMPATIBLE_VERSIONS.type,
      code: sharedErrors.INCOMPATIBLE_VERSIONS.code,
      message: 'Client (version ' + clientVersion + ') and ' + name + ' (version ' + VERSION + ') components must be from the same SDK version.'
    }));
  }

  return Promise.resolve();
}

module.exports = {
  verify: basicComponentVerification
};

},{"./errors":21,"./promise":24,"./seamlesspay-error":25}],16:[function(_dereq_,module,exports){
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

},{"../is-whitelisted-domain":22}],17:[function(_dereq_,module,exports){
'use strict';

var enumerate = _dereq_('../enumerate');

module.exports = enumerate([
  'CONFIGURATION_REQUEST'
], 'bus:');

},{"../enumerate":20}],18:[function(_dereq_,module,exports){
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

},{"../seamlesspay-error":25,"./check-origin":16,"./events":17,"framebus":9}],19:[function(_dereq_,module,exports){
'use strict';

var SeamlesspayError = _dereq_('./seamlesspay-error');
var sharedErrors = _dereq_('./errors');

module.exports = function (instance, methodNames) {
  methodNames.forEach(function (methodName) {
    instance[methodName] = function () {
      throw new SeamlesspayError({
        type: sharedErrors.METHOD_CALLED_AFTER_TEARDOWN.type,
        code: sharedErrors.METHOD_CALLED_AFTER_TEARDOWN.code,
        message: methodName + ' cannot be called after teardown.'
      });
    };
  });
};

},{"./errors":21,"./seamlesspay-error":25}],20:[function(_dereq_,module,exports){
'use strict';

function enumerate(values, prefix) {
  prefix = prefix == null ? '' : prefix;

  return values.reduce(function (enumeration, value) {
    enumeration[value] = prefix + value;
    return enumeration;
  }, {});
}

module.exports = enumerate;

},{}],21:[function(_dereq_,module,exports){
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

},{"./seamlesspay-error":25}],22:[function(_dereq_,module,exports){
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

},{}],23:[function(_dereq_,module,exports){
'use strict';

module.exports = function (obj) {
  return Object.keys(obj).filter(function (key) {
    return typeof obj[key] === 'function';
  });
};

},{}],24:[function(_dereq_,module,exports){
(function (global){(function (){
'use strict';

var Promise = global.Promise;

module.exports = Promise;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],25:[function(_dereq_,module,exports){
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

},{"./enumerate":20}],26:[function(_dereq_,module,exports){
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvQGJyYWludHJlZS9pZnJhbWVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL0BicmFpbnRyZWUvaWZyYW1lci9saWIvYXNzaWduLmpzIiwibm9kZV9tb2R1bGVzL0BicmFpbnRyZWUvaWZyYW1lci9saWIvZGVmYXVsdC1hdHRyaWJ1dGVzLmpzIiwibm9kZV9tb2R1bGVzL0BicmFpbnRyZWUvaWZyYW1lci9saWIvc2V0LWF0dHJpYnV0ZXMuanMiLCJub2RlX21vZHVsZXMvQGJyYWludHJlZS93cmFwLXByb21pc2UvbGliL2RlZmVycmVkLmpzIiwibm9kZV9tb2R1bGVzL0BicmFpbnRyZWUvd3JhcC1wcm9taXNlL2xpYi9vbmNlLmpzIiwibm9kZV9tb2R1bGVzL0BicmFpbnRyZWUvd3JhcC1wcm9taXNlL2xpYi9wcm9taXNlLW9yLWNhbGxiYWNrLmpzIiwibm9kZV9tb2R1bGVzL0BicmFpbnRyZWUvd3JhcC1wcm9taXNlL3dyYXAtcHJvbWlzZS5qcyIsIm5vZGVfbW9kdWxlcy9mcmFtZWJ1cy9saWIvZnJhbWVidXMuanMiLCJzcmMvZGlnaXRhbC13YWxsZXRzL2V4dGVybmFsL2V2ZW50LWVtaXR0ZXIuanMiLCJzcmMvZGlnaXRhbC13YWxsZXRzL2V4dGVybmFsL3BheW1lbnQtcmVxdWVzdC5qcyIsInNyYy9kaWdpdGFsLXdhbGxldHMvZXh0ZXJuYWwvcmVzcG9uc2UtZm9ybWF0dGVycy5qcyIsInNyYy9kaWdpdGFsLXdhbGxldHMvaW5kZXguanMiLCJzcmMvZGlnaXRhbC13YWxsZXRzL3NoYXJlZC9jb25zdGFudHMuanMiLCJzcmMvbGliL2Jhc2ljLWNvbXBvbmVudC12ZXJpZmljYXRpb24uanMiLCJzcmMvbGliL2J1cy9jaGVjay1vcmlnaW4uanMiLCJzcmMvbGliL2J1cy9ldmVudHMuanMiLCJzcmMvbGliL2J1cy9pbmRleC5qcyIsInNyYy9saWIvY29udmVydC1tZXRob2RzLXRvLWVycm9yLmpzIiwic3JjL2xpYi9lbnVtZXJhdGUuanMiLCJzcmMvbGliL2Vycm9ycy5qcyIsInNyYy9saWIvaXMtd2hpdGVsaXN0ZWQtZG9tYWluLmpzIiwic3JjL2xpYi9tZXRob2RzLmpzIiwic3JjL2xpYi9wcm9taXNlLmpzIiwic3JjL2xpYi9zZWFtbGVzc3BheS1lcnJvci5qcyIsInNyYy9saWIvdXVpZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3RUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgc2V0QXR0cmlidXRlcyA9IHJlcXVpcmUoJy4vbGliL3NldC1hdHRyaWJ1dGVzJyk7XG52YXIgZGVmYXVsdEF0dHJpYnV0ZXMgPSByZXF1aXJlKCcuL2xpYi9kZWZhdWx0LWF0dHJpYnV0ZXMnKTtcbnZhciBhc3NpZ24gPSByZXF1aXJlKCcuL2xpYi9hc3NpZ24nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVGcmFtZShvcHRpb25zKSB7XG4gIHZhciBpZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtcbiAgdmFyIGNvbmZpZyA9IGFzc2lnbih7fSwgZGVmYXVsdEF0dHJpYnV0ZXMsIG9wdGlvbnMpO1xuXG4gIGlmIChjb25maWcuc3R5bGUgJiYgdHlwZW9mIGNvbmZpZy5zdHlsZSAhPT0gJ3N0cmluZycpIHtcbiAgICBhc3NpZ24oaWZyYW1lLnN0eWxlLCBjb25maWcuc3R5bGUpO1xuICAgIGRlbGV0ZSBjb25maWcuc3R5bGU7XG4gIH1cblxuICBzZXRBdHRyaWJ1dGVzKGlmcmFtZSwgY29uZmlnKTtcblxuICBpZiAoIWlmcmFtZS5nZXRBdHRyaWJ1dGUoJ2lkJykpIHtcbiAgICBpZnJhbWUuaWQgPSBpZnJhbWUubmFtZTtcbiAgfVxuXG4gIHJldHVybiBpZnJhbWU7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGFzc2lnbih0YXJnZXQpIHtcbiAgdmFyIG9ianMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG4gIG9ianMuZm9yRWFjaChmdW5jdGlvbiAob2JqKSB7XG4gICAgaWYgKHR5cGVvZiBvYmogIT09ICdvYmplY3QnKSB7IHJldHVybjsgfVxuXG4gICAgT2JqZWN0LmtleXMob2JqKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHRhcmdldFtrZXldID0gb2JqW2tleV07XG4gICAgfSk7XG4gIH0pO1xuXG4gIHJldHVybiB0YXJnZXQ7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzcmM6ICdhYm91dDpibGFuaycsXG4gIGZyYW1lQm9yZGVyOiAwLFxuICBhbGxvd3RyYW5zcGFyZW5jeTogdHJ1ZSxcbiAgc2Nyb2xsaW5nOiAnbm8nXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNldEF0dHJpYnV0ZXMoZWxlbWVudCwgYXR0cmlidXRlcykge1xuICB2YXIgdmFsdWU7XG5cbiAgZm9yICh2YXIga2V5IGluIGF0dHJpYnV0ZXMpIHtcbiAgICBpZiAoYXR0cmlidXRlcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICB2YWx1ZSA9IGF0dHJpYnV0ZXNba2V5XTtcblxuICAgICAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICAgICAgZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoa2V5KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKGtleSwgdmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gZGVmZXJyZWQoZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAvLyBJRTkgZG9lc24ndCBzdXBwb3J0IHBhc3NpbmcgYXJndW1lbnRzIHRvIHNldFRpbWVvdXQgc28gd2UgaGF2ZSB0byBlbXVsYXRlIGl0LlxuICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBmbi5hcHBseShudWxsLCBhcmdzKTtcbiAgICB9LCAxKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkZWZlcnJlZDtcbiIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gb25jZShmbikge1xuICB2YXIgY2FsbGVkID0gZmFsc2U7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIWNhbGxlZCkge1xuICAgICAgY2FsbGVkID0gdHJ1ZTtcbiAgICAgIGZuLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG9uY2U7XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIHByb21pc2VPckNhbGxiYWNrKHByb21pc2UsIGNhbGxiYWNrKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgY29uc2lzdGVudC1yZXR1cm5cbiAgaWYgKGNhbGxiYWNrKSB7XG4gICAgcHJvbWlzZVxuICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgZGF0YSk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcHJvbWlzZU9yQ2FsbGJhY2s7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBkZWZlcnJlZCA9IHJlcXVpcmUoJy4vbGliL2RlZmVycmVkJyk7XG52YXIgb25jZSA9IHJlcXVpcmUoJy4vbGliL29uY2UnKTtcbnZhciBwcm9taXNlT3JDYWxsYmFjayA9IHJlcXVpcmUoJy4vbGliL3Byb21pc2Utb3ItY2FsbGJhY2snKTtcblxuZnVuY3Rpb24gd3JhcFByb21pc2UoZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2FsbGJhY2s7XG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgIHZhciBsYXN0QXJnID0gYXJnc1thcmdzLmxlbmd0aCAtIDFdO1xuXG4gICAgaWYgKHR5cGVvZiBsYXN0QXJnID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjYWxsYmFjayA9IGFyZ3MucG9wKCk7XG4gICAgICBjYWxsYmFjayA9IG9uY2UoZGVmZXJyZWQoY2FsbGJhY2spKTtcbiAgICB9XG4gICAgcmV0dXJuIHByb21pc2VPckNhbGxiYWNrKGZuLmFwcGx5KHRoaXMsIGFyZ3MpLCBjYWxsYmFjayk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8taW52YWxpZC10aGlzXG4gIH07XG59XG5cbndyYXBQcm9taXNlLndyYXBQcm90b3R5cGUgPSBmdW5jdGlvbiAodGFyZ2V0LCBvcHRpb25zKSB7XG4gIHZhciBtZXRob2RzLCBpZ25vcmVNZXRob2RzLCBpbmNsdWRlUHJpdmF0ZU1ldGhvZHM7XG5cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGlnbm9yZU1ldGhvZHMgPSBvcHRpb25zLmlnbm9yZU1ldGhvZHMgfHwgW107XG4gIGluY2x1ZGVQcml2YXRlTWV0aG9kcyA9IG9wdGlvbnMudHJhbnNmb3JtUHJpdmF0ZU1ldGhvZHMgPT09IHRydWU7XG5cbiAgbWV0aG9kcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRhcmdldC5wcm90b3R5cGUpLmZpbHRlcihmdW5jdGlvbiAobWV0aG9kKSB7XG4gICAgdmFyIGlzTm90UHJpdmF0ZU1ldGhvZDtcbiAgICB2YXIgaXNOb25Db25zdHJ1Y3RvckZ1bmN0aW9uID0gbWV0aG9kICE9PSAnY29uc3RydWN0b3InICYmXG4gICAgICB0eXBlb2YgdGFyZ2V0LnByb3RvdHlwZVttZXRob2RdID09PSAnZnVuY3Rpb24nO1xuICAgIHZhciBpc05vdEFuSWdub3JlZE1ldGhvZCA9IGlnbm9yZU1ldGhvZHMuaW5kZXhPZihtZXRob2QpID09PSAtMTtcblxuICAgIGlmIChpbmNsdWRlUHJpdmF0ZU1ldGhvZHMpIHtcbiAgICAgIGlzTm90UHJpdmF0ZU1ldGhvZCA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlzTm90UHJpdmF0ZU1ldGhvZCA9IG1ldGhvZC5jaGFyQXQoMCkgIT09ICdfJztcbiAgICB9XG5cbiAgICByZXR1cm4gaXNOb25Db25zdHJ1Y3RvckZ1bmN0aW9uICYmXG4gICAgICBpc05vdFByaXZhdGVNZXRob2QgJiZcbiAgICAgIGlzTm90QW5JZ25vcmVkTWV0aG9kO1xuICB9KTtcblxuICBtZXRob2RzLmZvckVhY2goZnVuY3Rpb24gKG1ldGhvZCkge1xuICAgIHZhciBvcmlnaW5hbCA9IHRhcmdldC5wcm90b3R5cGVbbWV0aG9kXTtcblxuICAgIHRhcmdldC5wcm90b3R5cGVbbWV0aG9kXSA9IHdyYXBQcm9taXNlKG9yaWdpbmFsKTtcbiAgfSk7XG5cbiAgcmV0dXJuIHRhcmdldDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gd3JhcFByb21pc2U7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB3aW4sIGZyYW1lYnVzO1xudmFyIHBvcHVwcyA9IFtdO1xudmFyIHN1YnNjcmliZXJzID0ge307XG52YXIgcHJlZml4ID0gJy8qZnJhbWVidXMqLyc7XG5cbmZ1bmN0aW9uIGluY2x1ZGUocG9wdXApIHtcbiAgaWYgKHBvcHVwID09IG51bGwpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIGlmIChwb3B1cC5XaW5kb3cgPT0gbnVsbCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYgKHBvcHVwLmNvbnN0cnVjdG9yICE9PSBwb3B1cC5XaW5kb3cpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgcG9wdXBzLnB1c2gocG9wdXApO1xuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gdGFyZ2V0KG9yaWdpbikge1xuICB2YXIga2V5O1xuICB2YXIgdGFyZ2V0ZWRGcmFtZWJ1cyA9IHt9O1xuXG4gIGZvciAoa2V5IGluIGZyYW1lYnVzKSB7XG4gICAgaWYgKCFmcmFtZWJ1cy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7IGNvbnRpbnVlOyB9XG5cbiAgICB0YXJnZXRlZEZyYW1lYnVzW2tleV0gPSBmcmFtZWJ1c1trZXldO1xuICB9XG5cbiAgdGFyZ2V0ZWRGcmFtZWJ1cy5fb3JpZ2luID0gb3JpZ2luIHx8ICcqJztcblxuICByZXR1cm4gdGFyZ2V0ZWRGcmFtZWJ1cztcbn1cblxuZnVuY3Rpb24gcHVibGlzaChldmVudCkge1xuICB2YXIgcGF5bG9hZCwgYXJncztcbiAgdmFyIG9yaWdpbiA9IF9nZXRPcmlnaW4odGhpcyk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8taW52YWxpZC10aGlzXG5cbiAgaWYgKF9pc250U3RyaW5nKGV2ZW50KSkgeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYgKF9pc250U3RyaW5nKG9yaWdpbikpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG5cbiAgcGF5bG9hZCA9IF9wYWNrYWdlUGF5bG9hZChldmVudCwgYXJncywgb3JpZ2luKTtcbiAgaWYgKHBheWxvYWQgPT09IGZhbHNlKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIF9icm9hZGNhc3Qod2luLnRvcCB8fCB3aW4uc2VsZiwgcGF5bG9hZCwgb3JpZ2luKTtcblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gc3Vic2NyaWJlKGV2ZW50LCBmbikge1xuICB2YXIgb3JpZ2luID0gX2dldE9yaWdpbih0aGlzKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1pbnZhbGlkLXRoaXNcblxuICBpZiAoX3N1YnNjcmlwdGlvbkFyZ3NJbnZhbGlkKGV2ZW50LCBmbiwgb3JpZ2luKSkgeyByZXR1cm4gZmFsc2U7IH1cblxuICBzdWJzY3JpYmVyc1tvcmlnaW5dID0gc3Vic2NyaWJlcnNbb3JpZ2luXSB8fCB7fTtcbiAgc3Vic2NyaWJlcnNbb3JpZ2luXVtldmVudF0gPSBzdWJzY3JpYmVyc1tvcmlnaW5dW2V2ZW50XSB8fCBbXTtcbiAgc3Vic2NyaWJlcnNbb3JpZ2luXVtldmVudF0ucHVzaChmbik7XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIHVuc3Vic2NyaWJlKGV2ZW50LCBmbikge1xuICB2YXIgaSwgc3Vic2NyaWJlckxpc3Q7XG4gIHZhciBvcmlnaW4gPSBfZ2V0T3JpZ2luKHRoaXMpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWludmFsaWQtdGhpc1xuXG4gIGlmIChfc3Vic2NyaXB0aW9uQXJnc0ludmFsaWQoZXZlbnQsIGZuLCBvcmlnaW4pKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIHN1YnNjcmliZXJMaXN0ID0gc3Vic2NyaWJlcnNbb3JpZ2luXSAmJiBzdWJzY3JpYmVyc1tvcmlnaW5dW2V2ZW50XTtcbiAgaWYgKCFzdWJzY3JpYmVyTGlzdCkgeyByZXR1cm4gZmFsc2U7IH1cblxuICBmb3IgKGkgPSAwOyBpIDwgc3Vic2NyaWJlckxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3Vic2NyaWJlckxpc3RbaV0gPT09IGZuKSB7XG4gICAgICBzdWJzY3JpYmVyTGlzdC5zcGxpY2UoaSwgMSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIF9nZXRPcmlnaW4oc2NvcGUpIHtcbiAgcmV0dXJuIHNjb3BlICYmIHNjb3BlLl9vcmlnaW4gfHwgJyonO1xufVxuXG5mdW5jdGlvbiBfaXNudFN0cmluZyhzdHJpbmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBzdHJpbmcgIT09ICdzdHJpbmcnO1xufVxuXG5mdW5jdGlvbiBfcGFja2FnZVBheWxvYWQoZXZlbnQsIGFyZ3MsIG9yaWdpbikge1xuICB2YXIgcGFja2FnZWQgPSBmYWxzZTtcbiAgdmFyIHBheWxvYWQgPSB7XG4gICAgZXZlbnQ6IGV2ZW50LFxuICAgIG9yaWdpbjogb3JpZ2luXG4gIH07XG4gIHZhciByZXBseSA9IGFyZ3NbYXJncy5sZW5ndGggLSAxXTtcblxuICBpZiAodHlwZW9mIHJlcGx5ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcGF5bG9hZC5yZXBseSA9IF9zdWJzY3JpYmVSZXBsaWVyKHJlcGx5LCBvcmlnaW4pO1xuICAgIGFyZ3MgPSBhcmdzLnNsaWNlKDAsIC0xKTtcbiAgfVxuXG4gIHBheWxvYWQuYXJncyA9IGFyZ3M7XG5cbiAgdHJ5IHtcbiAgICBwYWNrYWdlZCA9IHByZWZpeCArIEpTT04uc3RyaW5naWZ5KHBheWxvYWQpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDb3VsZCBub3Qgc3RyaW5naWZ5IGV2ZW50OiAnICsgZS5tZXNzYWdlKTtcbiAgfVxuICByZXR1cm4gcGFja2FnZWQ7XG59XG5cbmZ1bmN0aW9uIF91bnBhY2tQYXlsb2FkKGUpIHtcbiAgdmFyIHBheWxvYWQsIHJlcGx5T3JpZ2luLCByZXBseVNvdXJjZSwgcmVwbHlFdmVudDtcblxuICBpZiAoZS5kYXRhLnNsaWNlKDAsIHByZWZpeC5sZW5ndGgpICE9PSBwcmVmaXgpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgdHJ5IHtcbiAgICBwYXlsb2FkID0gSlNPTi5wYXJzZShlLmRhdGEuc2xpY2UocHJlZml4Lmxlbmd0aCkpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAocGF5bG9hZC5yZXBseSAhPSBudWxsKSB7XG4gICAgcmVwbHlPcmlnaW4gPSBlLm9yaWdpbjtcbiAgICByZXBseVNvdXJjZSA9IGUuc291cmNlO1xuICAgIHJlcGx5RXZlbnQgPSBwYXlsb2FkLnJlcGx5O1xuXG4gICAgcGF5bG9hZC5yZXBseSA9IGZ1bmN0aW9uIHJlcGx5KGRhdGEpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBjb25zaXN0ZW50LXJldHVyblxuICAgICAgdmFyIHJlcGx5UGF5bG9hZDtcblxuICAgICAgaWYgKCFyZXBseVNvdXJjZSkgeyByZXR1cm4gZmFsc2U7IH1cblxuICAgICAgcmVwbHlQYXlsb2FkID0gX3BhY2thZ2VQYXlsb2FkKHJlcGx5RXZlbnQsIFtkYXRhXSwgcmVwbHlPcmlnaW4pO1xuXG4gICAgICBpZiAocmVwbHlQYXlsb2FkID09PSBmYWxzZSkgeyByZXR1cm4gZmFsc2U7IH1cblxuICAgICAgcmVwbHlTb3VyY2UucG9zdE1lc3NhZ2UocmVwbHlQYXlsb2FkLCByZXBseU9yaWdpbik7XG4gICAgfTtcblxuICAgIHBheWxvYWQuYXJncy5wdXNoKHBheWxvYWQucmVwbHkpO1xuICB9XG5cbiAgcmV0dXJuIHBheWxvYWQ7XG59XG5cbmZ1bmN0aW9uIF9hdHRhY2godykge1xuICBpZiAod2luKSB7IHJldHVybjsgfVxuICB3aW4gPSB3IHx8IGdsb2JhbDtcblxuICBpZiAod2luLmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICB3aW4uYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIF9vbm1lc3NhZ2UsIGZhbHNlKTtcbiAgfSBlbHNlIGlmICh3aW4uYXR0YWNoRXZlbnQpIHtcbiAgICB3aW4uYXR0YWNoRXZlbnQoJ29ubWVzc2FnZScsIF9vbm1lc3NhZ2UpO1xuICB9IGVsc2UgaWYgKHdpbi5vbm1lc3NhZ2UgPT09IG51bGwpIHtcbiAgICB3aW4ub25tZXNzYWdlID0gX29ubWVzc2FnZTtcbiAgfSBlbHNlIHtcbiAgICB3aW4gPSBudWxsO1xuICB9XG59XG5cbi8vIHJlbW92ZUlmKHByb2R1Y3Rpb24pXG5mdW5jdGlvbiBfZGV0YWNoKCkge1xuICBpZiAod2luID09IG51bGwpIHsgcmV0dXJuOyB9XG5cbiAgaWYgKHdpbi5yZW1vdmVFdmVudExpc3RlbmVyKSB7XG4gICAgd2luLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBfb25tZXNzYWdlLCBmYWxzZSk7XG4gIH0gZWxzZSBpZiAod2luLmRldGFjaEV2ZW50KSB7XG4gICAgd2luLmRldGFjaEV2ZW50KCdvbm1lc3NhZ2UnLCBfb25tZXNzYWdlKTtcbiAgfSBlbHNlIGlmICh3aW4ub25tZXNzYWdlID09PSBfb25tZXNzYWdlKSB7XG4gICAgd2luLm9ubWVzc2FnZSA9IG51bGw7XG4gIH1cblxuICB3aW4gPSBudWxsO1xuICBwb3B1cHMgPSBbXTtcbiAgc3Vic2NyaWJlcnMgPSB7fTtcbn1cbi8vIGVuZFJlbW92ZUlmKHByb2R1Y3Rpb24pXG5cbmZ1bmN0aW9uIF91dWlkKCkge1xuICByZXR1cm4gJ3h4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eCcucmVwbGFjZSgvW3h5XS9nLCBmdW5jdGlvbiAoYykge1xuICAgIHZhciByID0gTWF0aC5yYW5kb20oKSAqIDE2IHwgMDtcbiAgICB2YXIgdiA9IGMgPT09ICd4JyA/IHIgOiByICYgMHgzIHwgMHg4O1xuXG4gICAgcmV0dXJuIHYudG9TdHJpbmcoMTYpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gX29ubWVzc2FnZShlKSB7XG4gIHZhciBwYXlsb2FkO1xuXG4gIGlmIChfaXNudFN0cmluZyhlLmRhdGEpKSB7IHJldHVybjsgfVxuXG4gIHBheWxvYWQgPSBfdW5wYWNrUGF5bG9hZChlKTtcbiAgaWYgKCFwYXlsb2FkKSB7IHJldHVybjsgfVxuXG4gIF9kaXNwYXRjaCgnKicsIHBheWxvYWQuZXZlbnQsIHBheWxvYWQuYXJncywgZSk7XG4gIF9kaXNwYXRjaChlLm9yaWdpbiwgcGF5bG9hZC5ldmVudCwgcGF5bG9hZC5hcmdzLCBlKTtcbiAgX2Jyb2FkY2FzdFBvcHVwcyhlLmRhdGEsIHBheWxvYWQub3JpZ2luLCBlLnNvdXJjZSk7XG59XG5cbmZ1bmN0aW9uIF9kaXNwYXRjaChvcmlnaW4sIGV2ZW50LCBhcmdzLCBlKSB7XG4gIHZhciBpO1xuXG4gIGlmICghc3Vic2NyaWJlcnNbb3JpZ2luXSkgeyByZXR1cm47IH1cbiAgaWYgKCFzdWJzY3JpYmVyc1tvcmlnaW5dW2V2ZW50XSkgeyByZXR1cm47IH1cblxuICBmb3IgKGkgPSAwOyBpIDwgc3Vic2NyaWJlcnNbb3JpZ2luXVtldmVudF0ubGVuZ3RoOyBpKyspIHtcbiAgICBzdWJzY3JpYmVyc1tvcmlnaW5dW2V2ZW50XVtpXS5hcHBseShlLCBhcmdzKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfaGFzT3BlbmVyKGZyYW1lKSB7XG4gIGlmIChmcmFtZS50b3AgIT09IGZyYW1lKSB7IHJldHVybiBmYWxzZTsgfVxuICBpZiAoZnJhbWUub3BlbmVyID09IG51bGwpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIGlmIChmcmFtZS5vcGVuZXIgPT09IGZyYW1lKSB7IHJldHVybiBmYWxzZTsgfVxuICBpZiAoZnJhbWUub3BlbmVyLmNsb3NlZCA9PT0gdHJ1ZSkgeyByZXR1cm4gZmFsc2U7IH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gX2Jyb2FkY2FzdChmcmFtZSwgcGF5bG9hZCwgb3JpZ2luKSB7XG4gIHZhciBpID0gMDtcbiAgdmFyIGZyYW1lVG9Ccm9hZGNhc3RUbztcblxuICB0cnkge1xuICAgIGZyYW1lLnBvc3RNZXNzYWdlKHBheWxvYWQsIG9yaWdpbik7XG5cbiAgICBpZiAoX2hhc09wZW5lcihmcmFtZSkpIHtcbiAgICAgIF9icm9hZGNhc3QoZnJhbWUub3BlbmVyLnRvcCwgcGF5bG9hZCwgb3JpZ2luKTtcbiAgICB9XG5cbiAgICAvLyBwcmV2aW91c2x5LCBvdXIgbWF4IHZhbHVlIHdhcyBmcmFtZS5mcmFtZXMubGVuZ3RoXG4gICAgLy8gYnV0IGZyYW1lcy5sZW5ndGggaW5oZXJpdHMgZnJvbSB3aW5kb3cubGVuZ3RoXG4gICAgLy8gd2hpY2ggY2FuIGJlIG92ZXJ3cml0dGVuIGlmIGEgZGV2ZWxvcGVyIGRvZXNcbiAgICAvLyBgdmFyIGxlbmd0aCA9IHZhbHVlO2Agb3V0c2lkZSBvZiBhIGZ1bmN0aW9uXG4gICAgLy8gc2NvcGUsIGl0J2xsIHByZXZlbnQgdXMgZnJvbSBsb29waW5nIHRocm91Z2hcbiAgICAvLyBhbGwgdGhlIGZyYW1lcy4gV2l0aCB0aGlzLCB3ZSBsb29wIHRocm91Z2hcbiAgICAvLyB1bnRpbCB0aGVyZSBhcmUgbm8gbG9uZ2VyIGFueSBmcmFtZXNcbiAgICB3aGlsZSAoZnJhbWVUb0Jyb2FkY2FzdFRvID0gZnJhbWUuZnJhbWVzW2ldKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uZC1hc3NpZ25cbiAgICAgIF9icm9hZGNhc3QoZnJhbWVUb0Jyb2FkY2FzdFRvLCBwYXlsb2FkLCBvcmlnaW4pO1xuICAgICAgaSsrO1xuICAgIH1cbiAgfSBjYXRjaCAoXykgeyAvKiBpZ25vcmVkICovIH1cbn1cblxuZnVuY3Rpb24gX2Jyb2FkY2FzdFBvcHVwcyhwYXlsb2FkLCBvcmlnaW4sIHNvdXJjZSkge1xuICB2YXIgaSwgcG9wdXA7XG5cbiAgZm9yIChpID0gcG9wdXBzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgcG9wdXAgPSBwb3B1cHNbaV07XG5cbiAgICBpZiAocG9wdXAuY2xvc2VkID09PSB0cnVlKSB7XG4gICAgICBwb3B1cHMgPSBwb3B1cHMuc2xpY2UoaSwgMSk7XG4gICAgfSBlbHNlIGlmIChzb3VyY2UgIT09IHBvcHVwKSB7XG4gICAgICBfYnJvYWRjYXN0KHBvcHVwLnRvcCwgcGF5bG9hZCwgb3JpZ2luKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gX3N1YnNjcmliZVJlcGxpZXIoZm4sIG9yaWdpbikge1xuICB2YXIgdXVpZCA9IF91dWlkKCk7XG5cbiAgZnVuY3Rpb24gcmVwbGllcihkLCBvKSB7XG4gICAgZm4oZCwgbyk7XG4gICAgZnJhbWVidXMudGFyZ2V0KG9yaWdpbikudW5zdWJzY3JpYmUodXVpZCwgcmVwbGllcik7XG4gIH1cblxuICBmcmFtZWJ1cy50YXJnZXQob3JpZ2luKS5zdWJzY3JpYmUodXVpZCwgcmVwbGllcik7XG4gIHJldHVybiB1dWlkO1xufVxuXG5mdW5jdGlvbiBfc3Vic2NyaXB0aW9uQXJnc0ludmFsaWQoZXZlbnQsIGZuLCBvcmlnaW4pIHtcbiAgaWYgKF9pc250U3RyaW5nKGV2ZW50KSkgeyByZXR1cm4gdHJ1ZTsgfVxuICBpZiAodHlwZW9mIGZuICE9PSAnZnVuY3Rpb24nKSB7IHJldHVybiB0cnVlOyB9XG4gIGlmIChfaXNudFN0cmluZyhvcmlnaW4pKSB7IHJldHVybiB0cnVlOyB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5fYXR0YWNoKCk7XG5cbmZyYW1lYnVzID0ge1xuICB0YXJnZXQ6IHRhcmdldCxcbiAgLy8gcmVtb3ZlSWYocHJvZHVjdGlvbilcbiAgX3BhY2thZ2VQYXlsb2FkOiBfcGFja2FnZVBheWxvYWQsXG4gIF91bnBhY2tQYXlsb2FkOiBfdW5wYWNrUGF5bG9hZCxcbiAgX2F0dGFjaDogX2F0dGFjaCxcbiAgX2RldGFjaDogX2RldGFjaCxcbiAgX2Rpc3BhdGNoOiBfZGlzcGF0Y2gsXG4gIF9icm9hZGNhc3Q6IF9icm9hZGNhc3QsXG4gIF9zdWJzY3JpYmVSZXBsaWVyOiBfc3Vic2NyaWJlUmVwbGllcixcbiAgX3N1YnNjcmlwdGlvbkFyZ3NJbnZhbGlkOiBfc3Vic2NyaXB0aW9uQXJnc0ludmFsaWQsXG4gIF9vbm1lc3NhZ2U6IF9vbm1lc3NhZ2UsXG4gIF91dWlkOiBfdXVpZCxcbiAgX2dldFN1YnNjcmliZXJzOiBmdW5jdGlvbiAoKSB7IHJldHVybiBzdWJzY3JpYmVyczsgfSxcbiAgX3dpbjogZnVuY3Rpb24gKCkgeyByZXR1cm4gd2luOyB9LFxuICAvLyBlbmRSZW1vdmVJZihwcm9kdWN0aW9uKVxuICBpbmNsdWRlOiBpbmNsdWRlLFxuICBwdWJsaXNoOiBwdWJsaXNoLFxuICBwdWI6IHB1Ymxpc2gsXG4gIHRyaWdnZXI6IHB1Ymxpc2gsXG4gIGVtaXQ6IHB1Ymxpc2gsXG4gIHN1YnNjcmliZTogc3Vic2NyaWJlLFxuICBzdWI6IHN1YnNjcmliZSxcbiAgb246IHN1YnNjcmliZSxcbiAgdW5zdWJzY3JpYmU6IHVuc3Vic2NyaWJlLFxuICB1bnN1YjogdW5zdWJzY3JpYmUsXG4gIG9mZjogdW5zdWJzY3JpYmVcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnJhbWVidXM7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBldmVudHMgPSByZXF1aXJlKCcuLi9zaGFyZWQvY29uc3RhbnRzJykuZXZlbnRzO1xuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG5cdHRoaXMuX2V2ZW50cyA9IHt9O1xufVxuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gZnVuY3Rpb24gKGV2ZW50LCBjYWxsYmFjaykge1xuXHR0aGlzLl9ldmVudHNbZXZlbnRdID0gW2NhbGxiYWNrXTtcbiAgdGhpcy5fYnVzLmVtaXQoZXZlbnRzLlBBWU1FTlRfUkVRVUVTVF9DUkVBVEVfSEFORExFUiwgZXZlbnQpO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZW1pdCA9IGZ1bmN0aW9uIChldmVudCkge1xuXHR2YXIgaSwgYXJncztcblx0dmFyIGNhbGxiYWNrcyA9IHRoaXMuX2V2ZW50c1tldmVudF07XG5cblx0aWYgKCFjYWxsYmFja3MpIHsgcmV0dXJuOyB9XG5cblx0YXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG5cblx0Zm9yIChpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xuXHRcdGNhbGxiYWNrc1tpXS5hcHBseShudWxsLCBhcmdzKTtcblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBCdXMgPSByZXF1aXJlKCcuLi8uLi9saWIvYnVzJyk7XG52YXIgY29udmVydE1ldGhvZHNUb0Vycm9yID0gcmVxdWlyZSgnLi4vLi4vbGliL2NvbnZlcnQtbWV0aG9kcy10by1lcnJvcicpO1xudmFyIGlGcmFtZXIgPSByZXF1aXJlKCdAYnJhaW50cmVlL2lmcmFtZXInKTtcbnZhciB1dWlkID0gcmVxdWlyZSgnLi4vLi4vbGliL3V1aWQnKTtcbnZhciBtZXRob2RzID0gcmVxdWlyZSgnLi4vLi4vbGliL21ldGhvZHMnKTtcbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCcuL2V2ZW50LWVtaXR0ZXInKTtcbnZhciBQcm9taXNlID0gcmVxdWlyZSgnLi4vLi4vbGliL3Byb21pc2UnKTtcbnZhciBTZWFtbGVzc3BheUVycm9yID0gcmVxdWlyZSgnLi4vLi4vbGliL3NlYW1sZXNzcGF5LWVycm9yJyk7XG52YXIgVkVSU0lPTiA9IFwid2ViLXNka1wiO1xudmFyIGNvbnN0YW50cyA9IHJlcXVpcmUoJy4uL3NoYXJlZC9jb25zdGFudHMnKTtcbnZhciB7IGZvcm1hdENoYXJnZVJlc3BvbnNlIH0gPSByZXF1aXJlKCcuL3Jlc3BvbnNlLWZvcm1hdHRlcnMnKTtcblxudmFyIGV2ZW50cyA9IGNvbnN0YW50cy5ldmVudHM7XG52YXIgZXJyb3JzID0gY29uc3RhbnRzLmVycm9ycztcblxudmFyIEFQUExFX1BBWV9BUElfVkVSU0lPTiA9IGNvbnN0YW50cy5BUFBMRV9QQVlfQVBJX1ZFUlNJT047XG52YXIgU1VQUE9SVEVEX05FVFdPUktTX0FQUExFX1BBWSA9IGNvbnN0YW50cy5TVVBQT1JURURfTkVUV09SS1NfQVBQTEVfUEFZO1xudmFyIE1FUkNIQU5UX0NBUEFCSUxJVElFU19BUFBMRV9QQVkgPSBjb25zdGFudHMuTUVSQ0hBTlRfQ0FQQUJJTElUSUVTX0FQUExFX1BBWTtcbnZhciBTRUFNTEVTU1BBWV9QQVlfV0lUSF9BUFBMRV9NRVJDSEFOVF9JRCA9IGNvbnN0YW50cy5TRUFNTEVTU1BBWV9QQVlfV0lUSF9BUFBMRV9NRVJDSEFOVF9JRDtcbnZhciBTRUFNTEVTU1BBWV9QQVlfV0lUSF9HT09HTEVfTUVSQ0hBTlRfSUQgPSBjb25zdGFudHMuU0VBTUxFU1NQQVlfUEFZX1dJVEhfR09PR0xFX01FUkNIQU5UX0lEO1xudmFyIERFRkFVTFRfQ09VTlRSWV9DT0RFID0gY29uc3RhbnRzLkRFRkFVTFRfQ09VTlRSWV9DT0RFO1xudmFyIFBBWU1FTlRfUkVRVUVTVF9NRVRIT0RfQVBQTEVfUEFZID0gY29uc3RhbnRzLlBBWU1FTlRfUkVRVUVTVF9NRVRIT0RfQVBQTEVfUEFZO1xudmFyIFBBWU1FTlRfUkVRVUVTVF9NRVRIT0RfR09PR0xFX1BBWSA9IGNvbnN0YW50cy5QQVlNRU5UX1JFUVVFU1RfTUVUSE9EX0dPT0dMRV9QQVk7XG52YXIgR09PR0xFX1BBWV9BUElfVkVSU0lPTiA9IGNvbnN0YW50cy5HT09HTEVfUEFZX0FQSV9WRVJTSU9OO1xudmFyIEdPT0dMRV9QQVlfQVBJX01JTk9SX1ZFUlNJT04gPSBjb25zdGFudHMuR09PR0xFX1BBWV9BUElfTUlOT1JfVkVSU0lPTjtcbnZhciBNRVJDSEFOVF9DQVBBQklMSVRJRVNfR09PR0xFX1BBWSA9IGNvbnN0YW50cy5NRVJDSEFOVF9DQVBBQklMSVRJRVNfR09PR0xFX1BBWTtcbnZhciBTVVBQT1JURURfTkVUV09SS1NfR09PR0xFX1BBWSA9IGNvbnN0YW50cy5TVVBQT1JURURfTkVUV09SS1NfR09PR0xFX1BBWTtcbnZhciBHT09HTEVfUEFZX0dBVEVXQVkgPSBjb25zdGFudHMuR09PR0xFX1BBWV9HQVRFV0FZO1xudmFyIEdPT0dMRV9QQVlfR0FURVdBWV9NRVJDSEFOVF9JRCA9IGNvbnN0YW50cy5HT09HTEVfUEFZX0dBVEVXQVlfTUVSQ0hBTlRfSUQ7XG5cbi8qKlxuICogQHR5cGVkZWYge29iamVjdH0gUGF5bWVudFJlcXVlc3RDb21wb25lbnR+dG9rZW5pemVQYXlsb2FkXG4gKiBAcHJvcGVydHkge3N0cmluZ30gbm9uY2UgVGhlIHBheW1lbnQgbWV0aG9kIG5vbmNlLlxuICogQHByb3BlcnR5IHtvYmplY3R9IGRldGFpbHMgQWRkaXRpb25hbCBhY2NvdW50IGRldGFpbHMuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gZGV0YWlscy5jYXJkVHlwZSBUeXBlIG9mIGNhcmQsIGV4OiBWaXNhLCBNYXN0ZXJDYXJkLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IGRldGFpbHMubGFzdEZvdXIgTGFzdCBmb3VyIGRpZ2l0cyBvZiBjYXJkIG51bWJlci5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBkZXRhaWxzLmxhc3RUd28gTGFzdCB0d28gZGlnaXRzIG9mIGNhcmQgbnVtYmVyLlxuICogQHByb3BlcnR5IHtvYmplY3R9IGRldGFpbHMucmF3UGF5bWVudFJlc3BvbnNlIFRoZSByYXcgcGF5bWVudCByZXNwb25zZSBmcm9tIHRoZSBwYXltZW50IHJlcXVlc3QsIHdpdGggc2Vuc2l0aXZlIGNhcmQgZGV0YWlscyByZW1vdmVkLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IGRlc2NyaXB0aW9uIEEgaHVtYW4tcmVhZGFibGUgZGVzY3JpcHRpb24uXG4gKiBAcHJvcGVydHkge3N0cmluZ30gdHlwZSBUaGUgcGF5bWVudCBtZXRob2QgdHlwZSwgYENyZWRpdENhcmRgIG9yIGBBbmRyb2lkUGF5Q2FyZGAuXG4gKiBAcHJvcGVydHkge29iamVjdH0gYmluRGF0YSBJbmZvcm1hdGlvbiBhYm91dCB0aGUgY2FyZCBiYXNlZCBvbiB0aGUgYmluLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IGJpbkRhdGEuY29tbWVyY2lhbCBQb3NzaWJsZSB2YWx1ZXM6ICdZZXMnLCAnTm8nLCAnVW5rbm93bicuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gYmluRGF0YS5jb3VudHJ5T2ZJc3N1YW5jZSBUaGUgY291bnRyeSBvZiBpc3N1YW5jZS5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBiaW5EYXRhLmRlYml0IFBvc3NpYmxlIHZhbHVlczogJ1llcycsICdObycsICdVbmtub3duJy5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBiaW5EYXRhLmR1cmJpblJlZ3VsYXRlZCBQb3NzaWJsZSB2YWx1ZXM6ICdZZXMnLCAnTm8nLCAnVW5rbm93bicuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gYmluRGF0YS5oZWFsdGhjYXJlIFBvc3NpYmxlIHZhbHVlczogJ1llcycsICdObycsICdVbmtub3duJy5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBiaW5EYXRhLmlzc3VpbmdCYW5rIFRoZSBpc3N1aW5nIGJhbmsuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gYmluRGF0YS5wYXlyb2xsIFBvc3NpYmxlIHZhbHVlczogJ1llcycsICdObycsICdVbmtub3duJy5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBiaW5EYXRhLnByZXBhaWQgUG9zc2libGUgdmFsdWVzOiAnWWVzJywgJ05vJywgJ1Vua25vd24nLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IGJpbkRhdGEucHJvZHVjdElkIFRoZSBwcm9kdWN0IGlkLlxuICovXG5cbmZ1bmN0aW9uIGNvbXBvc2VVcmwoY29uZmlnLCBjb21wb25lbnRJZCwgaXNEZWJ1Zykge1xuICB2YXIgYXNzZXRzVXJsID0gY29uZmlnLmdhdGV3YXlDb25maWd1cmF0aW9uLmFzc2V0c1VybDtcblxuICBpZiAoaXNEZWJ1Zykge1xuICAgIGFzc2V0c1VybCA9IGFzc2V0c1VybC5yZXBsYWNlKCdodHRwcycsICdodHRwJyk7XG4gIH1cbiAgdmFyIG1pbiA9IGlzRGVidWcgPyAnJyA6ICcubWluJztcblxuICByZXR1cm4gYXNzZXRzVXJsICsgJy8nICsgVkVSU0lPTiArICcvaHRtbC9kaWdpdGFsLXdhbGxldHMtZnJhbWUnICsgbWluICsgJy5odG1sIycgKyBjb21wb25lbnRJZDtcbn1cblxuZnVuY3Rpb24gY3JlYXRlSW5wdXRFdmVudEhhbmRsZXIoKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoZXZlbnREYXRhLCByZXBseSkge1xuICAgIHZhciBjYWxsYmFjayA9IHt9O1xuICAgIGlmIChldmVudERhdGEuaGFuZGxlck5hbWUpIHtcbiAgICAgIGNhbGxiYWNrW2V2ZW50RGF0YS5oYW5kbGVyTmFtZV0gPSByZXBseTtcbiAgICB9XG4gICAgdGhpcy5fZW1pdChldmVudERhdGEudHlwZSwgT2JqZWN0LmFzc2lnbihldmVudERhdGEucGF5bG9hZCwgY2FsbGJhY2spKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gcHJvY2Vzc0Vycm9yKGNiRm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChlcnJvcikge1xuICAgIHZhciBmb3JtYXR0ZWRFcnJvcjtcblxuICAgIGlmIChlcnJvci5uYW1lID09PSAnQWJvcnRFcnJvcicpIHtcbiAgICAgIGZvcm1hdHRlZEVycm9yID0gbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgICB0eXBlOiBlcnJvcnMuUEFZTUVOVF9SRVFVRVNUX0NBTkNFTEVELnR5cGUsXG4gICAgICAgIGNvZGU6IGVycm9ycy5QQVlNRU5UX1JFUVVFU1RfQ0FOQ0VMRUQuY29kZSxcbiAgICAgICAgbWVzc2FnZTogZXJyb3JzLlBBWU1FTlRfUkVRVUVTVF9DQU5DRUxFRC5tZXNzYWdlLFxuICAgICAgICBkZXRhaWxzOiB7XG4gICAgICAgICAgb3JpZ2luYWxFcnJvcjogZXJyb3IsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKGVycm9yLm5hbWUgPT09ICdQQVlNRU5UX1JFUVVFU1RfSU5JVElBTElaQVRJT05fRkFJTEVEJykge1xuICAgICAgZm9ybWF0dGVkRXJyb3IgPSBuZXcgU2VhbWxlc3NwYXlFcnJvcih7XG4gICAgICAgIHR5cGU6IGVycm9ycy5QQVlNRU5UX1JFUVVFU1RfSU5JVElBTElaQVRJT05fTUlTQ09ORklHVVJFRC50eXBlLFxuICAgICAgICBjb2RlOiBlcnJvcnMuUEFZTUVOVF9SRVFVRVNUX0lOSVRJQUxJWkFUSU9OX01JU0NPTkZJR1VSRUQuY29kZSxcbiAgICAgICAgbWVzc2FnZTogZXJyb3JzLlBBWU1FTlRfUkVRVUVTVF9JTklUSUFMSVpBVElPTl9NSVNDT05GSUdVUkVELm1lc3NhZ2UsXG4gICAgICAgIGRldGFpbHM6IHtcbiAgICAgICAgICBvcmlnaW5hbEVycm9yOiBlcnJvcixcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoZXJyb3IubmFtZSA9PT0gJ1NFQU1MRVNTUEFZX0dBVEVXQVlfUEFZX1dJVEhfR09PR0xFX1RPS0VOSVpBVElPTl9FUlJPUicpIHtcbiAgICAgIGZvcm1hdHRlZEVycm9yID0gbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgICB0eXBlOiBlcnJvcnMuUEFZTUVOVF9SRVFVRVNUX1BBWV9XSVRIX0dPT0dMRV9GQUlMRURfVE9fVE9LRU5JWkUudHlwZSxcbiAgICAgICAgY29kZTogZXJyb3JzLlBBWU1FTlRfUkVRVUVTVF9QQVlfV0lUSF9HT09HTEVfRkFJTEVEX1RPX1RPS0VOSVpFLmNvZGUsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9ycy5QQVlNRU5UX1JFUVVFU1RfUEFZX1dJVEhfR09PR0xFX0ZBSUxFRF9UT19UT0tFTklaRS5tZXNzYWdlLFxuICAgICAgICBkZXRhaWxzOiB7XG4gICAgICAgICAgb3JpZ2luYWxFcnJvcjogZXJyb3IsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKGVycm9yLm5hbWUgPT09ICdTRUFNTEVTU1BBWV9HQVRFV0FZX1BBWV9XSVRIX0dPT0dMRV9QQVJTSU5HX0VSUk9SJykge1xuICAgICAgZm9ybWF0dGVkRXJyb3IgPSBuZXcgU2VhbWxlc3NwYXlFcnJvcih7XG4gICAgICAgIHR5cGU6IGVycm9ycy5QQVlNRU5UX1JFUVVFU1RfUEFZX1dJVEhfR09PR0xFX1BBUlNJTkdfRVJST1IudHlwZSxcbiAgICAgICAgY29kZTogZXJyb3JzLlBBWU1FTlRfUkVRVUVTVF9QQVlfV0lUSF9HT09HTEVfUEFSU0lOR19FUlJPUi5jb2RlLFxuICAgICAgICBtZXNzYWdlOiBlcnJvcnMuUEFZTUVOVF9SRVFVRVNUX1BBWV9XSVRIX0dPT0dMRV9QQVJTSU5HX0VSUk9SLm1lc3NhZ2UsXG4gICAgICAgIGRldGFpbHM6IHtcbiAgICAgICAgICBvcmlnaW5hbEVycm9yOiBlcnJvcixcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBmb3JtYXR0ZWRFcnJvciA9IG5ldyBTZWFtbGVzc3BheUVycm9yKHtcbiAgICAgICAgY29kZTogZXJyb3JzLlBBWU1FTlRfUkVRVUVTVF9OT1RfQ09NUExFVEVELmNvZGUsXG4gICAgICAgIHR5cGU6IGVycm9yLnR5cGUgfHwgU2VhbWxlc3NwYXlFcnJvci50eXBlcy5DVVNUT01FUixcbiAgICAgICAgbWVzc2FnZTogZXJyb3JzLlBBWU1FTlRfUkVRVUVTVF9OT1RfQ09NUExFVEVELm1lc3NhZ2UsXG4gICAgICAgIGRldGFpbHM6IHtcbiAgICAgICAgICBvcmlnaW5hbEVycm9yOiBlcnJvcixcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH1cbiAgICBjYkZuKGZvcm1hdHRlZEVycm9yKTtcbiAgfTtcbn1cblxuLyoqXG4gKiBAY2xhc3MgUGF5bWVudFJlcXVlc3RDb21wb25lbnRcbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIFRoZSBEaWdpdGFsIFdhbGxldHMgQ29tcG9uZW50IHtAbGluayBtb2R1bGU6c2VhbWxlc3NwYXktd2ViL3BheW1lbnQtcmVxdWVzdC5jcmVhdGUgY3JlYXRlfSBvcHRpb25zLlxuICogQGRlc2NyaXB0aW9uIDxzdHJvbmc+RG8gbm90IHVzZSB0aGlzIGNvbnN0cnVjdG9yIGRpcmVjdGx5LiBVc2Uge0BsaW5rIG1vZHVsZTpzZWFtbGVzc3BheS13ZWIvcGF5bWVudC1yZXF1ZXN0LmNyZWF0ZXxzZWFtbGVzc3BheS13ZWIucGF5bWVudC1yZXF1ZXN0LmNyZWF0ZX0gaW5zdGVhZC48L3N0cm9uZz5cbiAqXG4gKiBAY2xhc3NkZXNjIFRoaXMgY2xhc3MgcmVwcmVzZW50cyBhIERpZ2l0YWwgV2FsbGV0cyBjb21wb25lbnQgcHJvZHVjZWQgYnkge0BsaW5rIG1vZHVsZTpzZWFtbGVzc3BheS13ZWIvcGF5bWVudC1yZXF1ZXN0LmNyZWF0ZXxzZWFtbGVzc3BheS13ZWIvcGF5bWVudC1yZXF1ZXN0LmNyZWF0ZX0uIEluc3RhbmNlcyBvZiB0aGlzIGNsYXNzIGhhdmUgbWV0aG9kcyBmb3IgaW5pdGlhbGl6aW5nIGEgRGlnaXRhbCBXYWxsZXRzLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGNvbXBvbmVudCBpcyBjdXJyZW50bHkgaW4gYmV0YSBhbmQgdGhlIEFQSSBtYXkgaW5jbHVkZSBicmVha2luZyBjaGFuZ2VzIHdoZW4gdXBncmFkaW5nLlxuICovXG5mdW5jdGlvbiBQYXltZW50UmVxdWVzdENvbXBvbmVudChvcHRpb25zKSB7XG4gIHRoaXMuX2NvbXBvbmVudElkID0gdXVpZCgpO1xuICB0aGlzLl9jbGllbnQgPSBvcHRpb25zLmNsaWVudDtcbiAgdGhpcy5fYW5hbHl0aWNzTmFtZSA9ICdkaWdpdGFsLXdhbGxldHMnO1xuICB0aGlzLl9wYXltZW50QnV0dG9uID0gbnVsbDtcbiAgdGhpcy5fcGF5bWVudERhdGEgPSBvcHRpb25zLnBheW1lbnREYXRhO1xuICB0aGlzLl9wYXltZW50QnV0dG9uQ29udGFpbmVyU2VsZWN0b3IgPSBvcHRpb25zLnBheW1lbnRCdXR0b25Db250YWluZXIuc2VsZWN0b3I7XG4gIHRoaXMuX2VuYWJsZWRQYXltZW50TWV0aG9kcyA9IHtcbiAgICBwYXlXaXRoR29vZ2xlOiBvcHRpb25zLnN1cHBvcnRlZFdhbGxldFR5cGVzLmluY2x1ZGVzKCdnb29nbGVfcGF5JyksXG4gICAgcGF5V2l0aEFwcGxlOiBvcHRpb25zLnN1cHBvcnRlZFdhbGxldFR5cGVzLmluY2x1ZGVzKCdhcHBsZV9wYXknKSxcbiAgfTtcbiAgdGhpcy5fbWVyY2hhbnROYW1lID0gb3B0aW9ucy5vcHRpb25zICYmIG9wdGlvbnMub3B0aW9ucy5tZXJjaGFudE5hbWU7XG4gIHRoaXMuX3N1cHBvcnRlZFBheW1lbnRNZXRob2RzID0gdGhpcy5fY29uc3RydWN0RGVmYXVsdFN1cHBvcnRlZFBheW1lbnRNZXRob2RzKCk7XG4gIHRoaXMuX3BheW1lbnRSZXF1ZXN0ID0ge1xuICAgIHN1cHBvcnRlZFBheW1lbnRNZXRob2RzOiB0aGlzLl9zdXBwb3J0ZWRQYXltZW50TWV0aG9kcyxcbiAgICBwYXltZW50RGF0YTogb3B0aW9ucy5wYXltZW50RGF0YSxcbiAgfTtcbiAgdGhpcy5fYnVzID0gbmV3IEJ1cyh7IGNoYW5uZWw6IHRoaXMuX2NvbXBvbmVudElkIH0pO1xuXG4gIEV2ZW50RW1pdHRlci5jYWxsKHRoaXMpO1xufVxuXG5QYXltZW50UmVxdWVzdENvbXBvbmVudC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEV2ZW50RW1pdHRlci5wcm90b3R5cGUsIHtcbiAgY29uc3RydWN0b3I6IFBheW1lbnRSZXF1ZXN0Q29tcG9uZW50LFxufSk7XG5cblBheW1lbnRSZXF1ZXN0Q29tcG9uZW50LnByb3RvdHlwZS5fc2V0dXBQYXltZW50QnV0dG9uID0gZnVuY3Rpb24gKGNvbnRhaW5lclNlbGVjdG9yKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29udGFpbmVyU2VsZWN0b3IpO1xuXG4gIGlmICghY29udGFpbmVyKSB7XG4gICAgdGhyb3cgbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgdHlwZTogZXJyb3JzLlBBWU1FTlRfUkVRVUVTVF9JTlZBTElEX1BBWU1FTlRfQlVUVE9OX0NPTlRBSU5FUl9TRUxFQ1RPUi50eXBlLFxuICAgICAgY29kZTogZXJyb3JzLlBBWU1FTlRfUkVRVUVTVF9JTlZBTElEX1BBWU1FTlRfQlVUVE9OX0NPTlRBSU5FUl9TRUxFQ1RPUi5jb2RlLFxuICAgICAgbWVzc2FnZTogZXJyb3JzLlBBWU1FTlRfUkVRVUVTVF9JTlZBTElEX1BBWU1FTlRfQlVUVE9OX0NPTlRBSU5FUl9TRUxFQ1RPUi5tZXNzYWdlLFxuICAgICAgZGV0YWlsczoge1xuICAgICAgICBwYXltZW50QnV0dG9uQ29udGFpbmVyU2VsZWN0b3I6IGNvbnRhaW5lclNlbGVjdG9yLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIGlmICh3aW5kb3cuQXBwbGVQYXlTZXNzaW9uKSB7XG4gICAgdmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICBzdHlsZS5pbm5lckhUTUwgPSBgXG4gICAgICAgIC5hcHBsZS1wYXktYnV0dG9uIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgICAgICAgIC13ZWJraXQtYXBwZWFyYW5jZTogLWFwcGxlLXBheS1idXR0b247XG4gICAgICAgICAgICAtYXBwbGUtcGF5LWJ1dHRvbi10eXBlOiBwbGFpbjtcbiAgICAgICAgfVxuICAgICAgICAuYXBwbGUtcGF5LWJ1dHRvbi1ibGFjayB7XG4gICAgICAgICAgICAtYXBwbGUtcGF5LWJ1dHRvbi1zdHlsZTogYmxhY2s7XG4gICAgICAgIH1cbiAgICAgICAgLmFwcGxlLXBheS1idXR0b24td2hpdGUge1xuICAgICAgICAgICAgLWFwcGxlLXBheS1idXR0b24tc3R5bGU6IHdoaXRlO1xuICAgICAgICB9XG4gICAgICAgIC5hcHBsZS1wYXktYnV0dG9uLXdoaXRlLXdpdGgtbGluZSB7XG4gICAgICAgICAgICAtYXBwbGUtcGF5LWJ1dHRvbi1zdHlsZTogd2hpdGUtb3V0bGluZTtcbiAgICAgICAgfVxuICAgIGA7XG4gICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gICAgdmFyIGFwcGxlUGF5QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgYXBwbGVQYXlCdXR0b24uY2xhc3NMaXN0LmFkZCgnYXBwbGUtcGF5LWJ1dHRvbicsICdhcHBsZS1wYXktYnV0dG9uLWJsYWNrJyk7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGFwcGxlUGF5QnV0dG9uKTtcblxuICAgIGFwcGxlUGF5QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZlxuICAgICAgICAuc2hvdygpXG4gICAgICAgIC50aGVuKChwYXltZW50UmVzcG9uc2UpID0+IHtcbiAgICAgICAgICBzZWxmLl9wYXltZW50UmVzcG9uc2VIYW5kbGVyKG51bGwsIGZvcm1hdENoYXJnZVJlc3BvbnNlKHBheW1lbnRSZXNwb25zZSkpO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgICAgc2VsZi5fcGF5bWVudFJlc3BvbnNlSGFuZGxlcihlcnJvciwgbnVsbCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59O1xuXG5QYXltZW50UmVxdWVzdENvbXBvbmVudC5wcm90b3R5cGUuX2NvbnN0cnVjdERlZmF1bHRTdXBwb3J0ZWRQYXltZW50TWV0aG9kcyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGNvbmZpZ3VyYXRpb24gPSB0aGlzLl9jbGllbnQuZ2V0Q29uZmlndXJhdGlvbigpO1xuICB2YXIgaXNQcm9kdWN0aW9uID0gY29uZmlndXJhdGlvbi5nYXRld2F5Q29uZmlndXJhdGlvbi5lbnZpcm9ubWVudCA9PT0gJ3Byb2R1Y3Rpb24nO1xuICB2YXIgc3VwcG9ydGVkUGF5bWVudE1ldGhvZHMgPSB7fTtcblxuICBpZiAodGhpcy5fZW5hYmxlZFBheW1lbnRNZXRob2RzLnBheVdpdGhBcHBsZSkge1xuICAgIHN1cHBvcnRlZFBheW1lbnRNZXRob2RzLnBheVdpdGhBcHBsZSA9IHtcbiAgICAgIHN1cHBvcnRlZE1ldGhvZHM6IFtQQVlNRU5UX1JFUVVFU1RfTUVUSE9EX0FQUExFX1BBWV0sXG4gICAgICBkYXRhOiB7XG4gICAgICAgIHZlcnNpb246IEFQUExFX1BBWV9BUElfVkVSU0lPTixcbiAgICAgICAgc3VwcG9ydGVkTmV0d29ya3M6IFNVUFBPUlRFRF9ORVRXT1JLU19BUFBMRV9QQVksXG4gICAgICAgIG1lcmNoYW50SWRlbnRpZmllcjogU0VBTUxFU1NQQVlfUEFZX1dJVEhfQVBQTEVfTUVSQ0hBTlRfSUQsXG4gICAgICAgIG1lcmNoYW50Q2FwYWJpbGl0aWVzOiBNRVJDSEFOVF9DQVBBQklMSVRJRVNfQVBQTEVfUEFZLFxuICAgICAgICBjb3VudHJ5Q29kZTogREVGQVVMVF9DT1VOVFJZX0NPREUsXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICBpZiAodGhpcy5fZW5hYmxlZFBheW1lbnRNZXRob2RzLnBheVdpdGhHb29nbGUpIHtcbiAgICBzdXBwb3J0ZWRQYXltZW50TWV0aG9kcy5wYXlXaXRoR29vZ2xlID0ge1xuICAgICAgc3VwcG9ydGVkTWV0aG9kczogW1BBWU1FTlRfUkVRVUVTVF9NRVRIT0RfR09PR0xFX1BBWV0sXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGVudmlyb25tZW50OiBpc1Byb2R1Y3Rpb24gPyAnUFJPRFVDVElPTicgOiAnVEVTVCcsXG4gICAgICAgIGFwaVZlcnNpb246IEdPT0dMRV9QQVlfQVBJX1ZFUlNJT04sXG4gICAgICAgIGFwaVZlcnNpb25NaW5vcjogR09PR0xFX1BBWV9BUElfTUlOT1JfVkVSU0lPTixcbiAgICAgICAgbWVyY2hhbnRJbmZvOiB7XG4gICAgICAgICAgbWVyY2hhbnRJZDogU0VBTUxFU1NQQVlfUEFZX1dJVEhfR09PR0xFX01FUkNIQU5UX0lELFxuICAgICAgICAgIG1lcmNoYW50TmFtZTogdGhpcy5fbWVyY2hhbnROYW1lLFxuICAgICAgICB9LFxuICAgICAgICBhbGxvd2VkUGF5bWVudE1ldGhvZHM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0eXBlOiAnQ0FSRCcsXG4gICAgICAgICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgICAgIGFsbG93ZWRBdXRoTWV0aG9kczogTUVSQ0hBTlRfQ0FQQUJJTElUSUVTX0dPT0dMRV9QQVksXG4gICAgICAgICAgICAgIGFsbG93ZWRDYXJkTmV0d29ya3M6IFNVUFBPUlRFRF9ORVRXT1JLU19HT09HTEVfUEFZLFxuICAgICAgICAgICAgICBiaWxsaW5nQWRkcmVzc1JlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRva2VuaXphdGlvblNwZWNpZmljYXRpb246IHtcbiAgICAgICAgICAgICAgdHlwZTogJ1BBWU1FTlRfR0FURVdBWScsXG4gICAgICAgICAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgICAgICBnYXRld2F5OiBHT09HTEVfUEFZX0dBVEVXQVksXG4gICAgICAgICAgICAgICAgZ2F0ZXdheU1lcmNoYW50SWQ6IEdPT0dMRV9QQVlfR0FURVdBWV9NRVJDSEFOVF9JRCxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBzdXBwb3J0ZWRQYXltZW50TWV0aG9kcztcbn07XG5cblBheW1lbnRSZXF1ZXN0Q29tcG9uZW50LnByb3RvdHlwZS5pbml0aWFsaXplID0gZnVuY3Rpb24gKCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciBjbGllbnRDb25maWd1cmF0aW9uID0gc2VsZi5fY2xpZW50LmdldENvbmZpZ3VyYXRpb24oKTtcblxuICBzZWxmLl9mcmFtZSA9IGlGcmFtZXIoe1xuICAgIGFsbG93OiAncGF5bWVudCcsXG4gICAgbmFtZTogJ3NlYW1sZXNzcGF5LWRpZ2l0YWwtd2FsbGV0cy1mcmFtZScsXG4gICAgY2xhc3M6ICdzZWFtbGVzc3BheS1kaWdpdGFsLXdhbGxldHMtZnJhbWUnLFxuICAgIHdpZHRoOiAnMTAwJScsXG4gICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgc3R5bGU6IHtcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgbGVmdDogJy05OTk5cHgnLFxuICAgIH0sXG4gIH0pO1xuXG4gIGlmIChPYmplY3Qua2V5cyhzZWxmLl9zdXBwb3J0ZWRQYXltZW50TWV0aG9kcykubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBTZWFtbGVzc3BheUVycm9yKGVycm9ycy5QQVlNRU5UX1JFUVVFU1RfTk9fVkFMSURfU1VQUE9SVEVEX1BBWU1FTlRfTUVUSE9EUykpO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgc2VsZi5fYnVzLm9uKGV2ZW50cy5GUkFNRV9SRUFEWSwgZnVuY3Rpb24gKHJlcGx5KSB7XG4gICAgICByZXBseSh7IGNsaWVudDogc2VsZi5fY2xpZW50LCBlbmFibGVkUGF5bWVudE1ldGhvZHM6IHNlbGYuX2VuYWJsZWRQYXltZW50TWV0aG9kcyB9KTtcbiAgICAgIHNlbGYuX2VtaXQoJ3JlYWR5Jyk7XG4gICAgfSk7XG4gICAgc2VsZi5fYnVzLm9uKGV2ZW50cy5GUkFNRV9DQU5fTUFLRV9SRVFVRVNUUywgZnVuY3Rpb24gKCkge1xuICAgICAgcmVzb2x2ZShzZWxmKTtcbiAgICB9KTtcblxuICAgIHNlbGYuX2ZyYW1lLnNyYyA9IGNvbXBvc2VVcmwoY2xpZW50Q29uZmlndXJhdGlvbiwgc2VsZi5fY29tcG9uZW50SWQsIGNsaWVudENvbmZpZ3VyYXRpb24uaXNEZWJ1Zyk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzZWxmLl9mcmFtZSk7XG5cbiAgICBzZWxmLl9idXMub24oZXZlbnRzLklOUFVUX0VWRU5ULCBjcmVhdGVJbnB1dEV2ZW50SGFuZGxlcigpLmJpbmQoc2VsZikpO1xuXG4gICAgc2VsZi5fc2V0dXBQYXltZW50QnV0dG9uKHNlbGYuX3BheW1lbnRCdXR0b25Db250YWluZXJTZWxlY3Rvcik7XG4gIH0pO1xufTtcblxuUGF5bWVudFJlcXVlc3RDb21wb25lbnQucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICBzZWxmLl9idXMuZW1pdChcbiAgICAgIGV2ZW50cy5QQVlNRU5UX1JFUVVFU1RfSU5WT0tFRCxcbiAgICAgIHtcbiAgICAgICAgc3VwcG9ydGVkUGF5bWVudE1ldGhvZHM6IHNlbGYuX3BheW1lbnRSZXF1ZXN0LnN1cHBvcnRlZFBheW1lbnRNZXRob2RzLFxuICAgICAgICBwYXltZW50RGF0YTogc2VsZi5fcGF5bWVudFJlcXVlc3QucGF5bWVudERhdGEsXG4gICAgICAgIG9wdGlvbnM6IHNlbGYuX3BheW1lbnRSZXF1ZXN0Lm9wdGlvbnMsXG4gICAgICB9LFxuICAgICAgJ3Nob3cnXG4gICAgKTtcblxuICAgIHNlbGYuX2J1cy5vbihldmVudHMuUEFZTUVOVF9SRVFVRVNUX0lOVk9LRURfU1VDQ0VTU0ZVTCwgZnVuY3Rpb24gKHBheWxvYWQpIHtcbiAgICAgIHJlc29sdmUocGF5bG9hZCk7XG4gICAgfSk7XG5cbiAgICBzZWxmLl9idXMub24oZXZlbnRzLlBBWU1FTlRfUkVRVUVTVF9JTlZPS0VEX0ZBSUxFRCwgcHJvY2Vzc0Vycm9yLmNhbGwoc2VsZiwgcmVqZWN0KSk7XG4gIH0pO1xufTtcblxuUGF5bWVudFJlcXVlc3RDb21wb25lbnQucHJvdG90eXBlLmFkZFBheW1lbnRSZXNwb25zZUhhbmRsZXIgPSBmdW5jdGlvbiAoaGFuZGxlcikge1xuICBpZiAodHlwZW9mIGhhbmRsZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdGhpcy5fcGF5bWVudFJlc3BvbnNlSGFuZGxlciA9IGhhbmRsZXI7XG59O1xuXG4vKipcbiAqIENsZWFubHkgcmVtb3ZlIGFueXRoaW5nIHNldCB1cCBieSB7QGxpbmsgbW9kdWxlOnNlYW1sZXNzcGF5LXdlYi9wYXltZW50LXJlcXVlc3QuY3JlYXRlfGNyZWF0ZX0uXG4gKiBAcHVibGljXG4gKiBAcGFyYW0ge2NhbGxiYWNrfSBbY2FsbGJhY2tdIENhbGxlZCBvbiBjb21wbGV0aW9uLlxuICogQGV4YW1wbGVcbiAqIHBheW1lbnRSZXF1ZXN0SW5zdGFuY2UudGVhcmRvd24oKTtcbiAqIEBleGFtcGxlIDxjYXB0aW9uPldpdGggY2FsbGJhY2s8L2NhcHRpb24+XG4gKiBwYXltZW50UmVxdWVzdEluc3RhbmNlLnRlYXJkb3duKGZ1bmN0aW9uICgpIHtcbiAqICAgLy8gdGVhcmRvd24gaXMgY29tcGxldGVcbiAqIH0pO1xuICogQHJldHVybnMge1Byb21pc2V8dm9pZH0gUmV0dXJucyBhIHByb21pc2UgaWYgbm8gY2FsbGJhY2sgaXMgcHJvdmlkZWQuXG4gKi9cblBheW1lbnRSZXF1ZXN0Q29tcG9uZW50LnByb3RvdHlwZS50ZWFyZG93biA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5fYnVzLnRlYXJkb3duKCk7XG4gIHRoaXMuX2ZyYW1lLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5fZnJhbWUpO1xuXG4gIGNvbnZlcnRNZXRob2RzVG9FcnJvcih0aGlzLCBtZXRob2RzKFBheW1lbnRSZXF1ZXN0Q29tcG9uZW50LnByb3RvdHlwZSkuY29uY2F0KG1ldGhvZHMoRXZlbnRFbWl0dGVyLnByb3RvdHlwZSkpKTtcblxuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBheW1lbnRSZXF1ZXN0Q29tcG9uZW50O1xuIiwiXG5mdW5jdGlvbiBmb3JtYXRDaGFyZ2VSZXNwb25zZShwYXlsb2FkKSB7XG4gIGlmICghKHBheWxvYWQgaW5zdGFuY2VvZiBPYmplY3QpKSByZXR1cm4gcGF5bG9hZFxuXG4gIHZhciB7XG4gICAgYWNjb3VudFR5cGUsXG4gICAgYW1vdW50LFxuICAgIGF1dGhDb2RlLFxuICAgIGJhdGNoSWQsXG4gICAgY3VycmVuY3ksXG4gICAgZXhwRGF0ZSxcbiAgICBpZCxcbiAgICBsYXN0Rm91cixcbiAgICBwYXltZW50TmV0d29yayxcbiAgICBzdGF0dXMsXG4gICAgc3RhdHVzQ29kZSxcbiAgICBzdGF0dXNEZXNjcmlwdGlvbixcbiAgICBzdXJjaGFyZ2VGZWVBbW91bnQsXG4gICAgdGlwLFxuICAgIHRva2VuOiBwYXltZW50VG9rZW4sXG4gICAgdHJhbnNhY3Rpb25EYXRlLFxuICB9ID0gcGF5bG9hZDtcblxuICByZXR1cm4ge1xuICAgIHBheW1lbnRUb2tlbixcbiAgICBkZXRhaWxzOiB7XG4gICAgICBhY2NvdW50VHlwZSxcbiAgICAgIGFtb3VudCxcbiAgICAgIGF1dGhDb2RlLFxuICAgICAgYmF0Y2hJZCxcbiAgICAgIGN1cnJlbmN5LFxuICAgICAgZXhwRGF0ZSxcbiAgICAgIGlkLFxuICAgICAgbGFzdEZvdXIsXG4gICAgICBwYXltZW50TmV0d29yayxcbiAgICAgIHN0YXR1cyxcbiAgICAgIHN0YXR1c0NvZGUsXG4gICAgICBzdGF0dXNEZXNjcmlwdGlvbixcbiAgICAgIHN1cmNoYXJnZUZlZUFtb3VudCxcbiAgICAgIHRpcCxcbiAgICAgIHRyYW5zYWN0aW9uRGF0ZSxcbiAgICB9XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBmb3JtYXRDaGFyZ2VSZXNwb25zZVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuLyoqXG4gKiBAbW9kdWxlIHNlYW1sZXNzcGF5LXdlYi9wYXltZW50LXJlcXVlc3RcbiAqIEBkZXNjcmlwdGlvbiBBIGNvbXBvbmVudCB0byBpbnRlZ3JhdGUgd2l0aCB0aGUgRGlnaXRhbCBXYWxsZXRzIEFQSS5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBjb21wb25lbnQgaXMgY3VycmVudGx5IGluIGJldGEgYW5kIHRoZSBBUEkgbWF5IGluY2x1ZGUgYnJlYWtpbmcgY2hhbmdlcyB3aGVuIHVwZ3JhZGluZy5cbiAqICovXG5cbnZhciBQYXltZW50UmVxdWVzdENvbXBvbmVudCA9IHJlcXVpcmUoJy4vZXh0ZXJuYWwvcGF5bWVudC1yZXF1ZXN0Jyk7XG52YXIgYmFzaWNDb21wb25lbnRWZXJpZmljYXRpb24gPSByZXF1aXJlKCcuLi9saWIvYmFzaWMtY29tcG9uZW50LXZlcmlmaWNhdGlvbicpO1xudmFyIHdyYXBQcm9taXNlID0gcmVxdWlyZSgnQGJyYWludHJlZS93cmFwLXByb21pc2UnKTtcbnZhciBWRVJTSU9OID0gXCJ3ZWItc2RrXCI7XG5cbi8qKlxuICogQHN0YXRpY1xuICogQGZ1bmN0aW9uIGNyZWF0ZVxuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgQ3JlYXRpb24gb3B0aW9uczpcbiAqIEBwYXJhbSB7Q2xpZW50fSBvcHRpb25zLmNsaWVudCBBIHtAbGluayBDbGllbnR9IGluc3RhbmNlLlxuICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zLmVuYWJsZWRQYXltZW50TWV0aG9kc10gQW4gb2JqZWN0IHJlcHJlc2VudGluZyB3aGljaCBwYXltZW50IG1ldGhvZHMgdG8gZGlzcGxheS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMuZW5hYmxlZFBheW1lbnRNZXRob2RzLnBheVdpdGhHb29nbGU9dHJ1ZV0gV2hldGhlciBvciBub3QgdG8gZGlzcGxheSBQYXkgd2l0aCBHb29nbGUgYXMgYW4gb3B0aW9uIGluIHRoZSBEaWdpdGFsIFdhbGxldHMgZGlhbG9nLiBJZiBsZWZ0IGJsYW5rIG9yIHNldCB0byB0cnVlLCBQYXkgd2l0aCBHb29nbGUgd2lsbCBiZSBkaXNwbGF5ZWQgaW4gdGhlIGRpYWxvZyBpZiB0aGUgbWVyY2hhbnQgYWNjb3VudCBpcyBzZXQgdXAgdG8gcHJvY2VzcyBQYXkgd2l0aCBHb29nbGUuXG4gKiBAcGFyYW0ge2NhbGxiYWNrfSBbY2FsbGJhY2tdIFRoZSBzZWNvbmQgYXJndW1lbnQsIGBkYXRhYCwgaXMgdGhlIHtAbGluayBQYXltZW50UmVxdWVzdENvbXBvbmVudH0gaW5zdGFuY2UuIElmIG5vIGNhbGxiYWNrIGlzIHByb3ZpZGVkLCBgY3JlYXRlYCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdpdGggdGhlIHtAbGluayBQYXltZW50UmVxdWVzdENvbXBvbmVudH0gaW5zdGFuY2UuXG4gKiBAcmV0dXJucyB7UHJvbWlzZXx2b2lkfSBSZXR1cm5zIGEgcHJvbWlzZSBpZiBubyBjYWxsYmFjayBpcyBwcm92aWRlZC5cbiAqIEBleGFtcGxlXG4gKiBpZiAod2luZG93LlBheW1lbnRSZXF1ZXN0KSB7XG4gKiAgIHNlYW1sZXNzcGF5LmRpZ2l0YWxXYWxsZXRzLmNyZWF0ZSh7XG4gKiAgICAgY2xpZW50OiBjbGllbnRJbnN0YW5jZVxuICogICB9LCBjYik7XG4gKiB9IGVsc2Uge1xuICogICAvLyBmYWxsIGJhY2sgdG8gSG9zdGVkIEZpZWxkcyBpZiBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgRGlnaXRhbCBXYWxsZXRzIEFQSVxuICogICBzZWFtbGVzc3BheS5ob3N0ZWRGaWVsZHMuY3JlYXRlKGhvc3RlZEZpZWxkc09wdGlvbnMsIGNiKTtcbiAqIH1cbiAqIEBleGFtcGxlIDxjYXB0aW9uPkV4cGxpY2l0bHkgdHVybmluZyBvZmYgY3JlZGl0IGNhcmRzIGZyb20gRGlnaXRhbCBXYWxsZXRzIEFQSSBkaWFsb2c8L2NhcHRpb24+XG4gKiBzZWFtbGVzc3BheS5kaWdpdGFsV2FsbGV0cy5jcmVhdGUoe1xuICogICBjbGllbnQ6IGNsaWVudEluc3RhbmNlLFxuICogICBlbmFibGVkUGF5bWVudE1ldGhvZHM6IHtcbiAqICAgICBwYXlXaXRoR29vZ2xlOiB0cnVlLFxuICogICB9XG4gKiB9LCBjYik7XG4gKi9cblxuZnVuY3Rpb24gY3JlYXRlKG9wdGlvbnMpIHtcbiAgcmV0dXJuIGJhc2ljQ29tcG9uZW50VmVyaWZpY2F0aW9uLnZlcmlmeSh7XG4gICAgbmFtZTogJ0RpZ2l0YWwgV2FsbGV0cycsXG4gICAgY2xpZW50OiBvcHRpb25zLmNsaWVudFxuICB9KS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcGF5bWVudFJlcXVlc3RJbnN0YW5jZSA9IG5ldyBQYXltZW50UmVxdWVzdENvbXBvbmVudChvcHRpb25zKTtcbiAgICByZXR1cm4gcGF5bWVudFJlcXVlc3RJbnN0YW5jZS5pbml0aWFsaXplKCk7XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgY3JlYXRlOiB3cmFwUHJvbWlzZShjcmVhdGUpLFxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uIFRoZSBjdXJyZW50IHZlcnNpb24gb2YgdGhlIFNESywgaS5lLiBge0Bwa2cgdmVyc2lvbn1gLlxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKi9cbiAgVkVSU0lPTjogVkVSU0lPTlxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFNlYW1sZXNzcGF5RXJyb3IgPSByZXF1aXJlKCcuLi8uLi9saWIvc2VhbWxlc3NwYXktZXJyb3InKTtcbnZhciBlbnVtZXJhdGUgPSByZXF1aXJlKCcuLi8uLi9saWIvZW51bWVyYXRlJyk7XG5cbnZhciBwYXltZW50VHlwZXMgPSB7XG4gIFBBWU1FTlRfVFlQRV9DUkVESVQ6ICdjcmVkaXRfY2FyZCcsXG4gIFBBWU1FTlRfVFlQRV9BQ0g6ICdhY2gnXG59O1xuXG52YXIgQVBQTEVfUEFZX1BBWU1FTlRfVFlQRVMgPSB7XG5cdGNyZWRpdDogcGF5bWVudFR5cGVzLlBBWU1FTlRfVFlQRV9DUkVESVRcbn07XG5cbnZhciBQUl9IQU5ETEVSX1NISVBQSU5HX0FERFJFU1NfQ0hBTkdFID0gJ3NoaXBwaW5nYWRkcmVzc2NoYW5nZSc7XG52YXIgUFJfSEFORExFUl9TSElQUElOR19PUFRJT05fQ0hBTkdFID0gJ3NoaXBwaW5nb3B0aW9uY2hhbmdlJztcbnZhciBQUl9IQU5ETEVSX01FUkNIQU5UX1ZBTElEQVRJT04gPSAnbWVyY2hhbnR2YWxpZGF0aW9uJztcbnZhciBQUl9IQU5ETEVSX1BBWU1FTlRfTUVUSE9EID0gJ3BheW1lbnRtZXRob2QnO1xudmFyIFBSX0hBTkRMRVJfQ0FOQ0VMID0gJ2NhbmNlbCc7XG5cbnZhciBQQVlNRU5UX1JFUVVFU1RfTUVUSE9EX0JBU0lDID0gJ2Jhc2ljLWNhcmQnO1xudmFyXHRQQVlNRU5UX1JFUVVFU1RfTUVUSE9EX0FQUExFX1BBWSA9ICdodHRwczovL2FwcGxlLmNvbS9hcHBsZS1wYXknO1xudmFyXHRQQVlNRU5UX1JFUVVFU1RfTUVUSE9EX0dPT0dMRV9QQVkgPSAnaHR0cHM6Ly9nb29nbGUuY29tL3BheSc7XG5cbnZhciBQQVlNRU5UX1JFUVVFU1RfTUVUSE9EX1RZUEVfQVBQTEVfUEFZID0gJ0FQUExFX1BBWSc7XG5cbnZhciBQQVlNRU5UX1JFUVVFU1RfTUVUSE9EX1RZUEVTID0ge307XG5QQVlNRU5UX1JFUVVFU1RfTUVUSE9EX1RZUEVTW1BBWU1FTlRfUkVRVUVTVF9NRVRIT0RfQVBQTEVfUEFZXSA9IFBBWU1FTlRfUkVRVUVTVF9NRVRIT0RfVFlQRV9BUFBMRV9QQVk7XG5cbnZhciBQUl9IQU5ETEVSUyA9IFtcblx0UFJfSEFORExFUl9TSElQUElOR19BRERSRVNTX0NIQU5HRSxcblx0UFJfSEFORExFUl9TSElQUElOR19PUFRJT05fQ0hBTkdFLFxuXHRQUl9IQU5ETEVSX01FUkNIQU5UX1ZBTElEQVRJT04sXG4gIFBSX0hBTkRMRVJfUEFZTUVOVF9NRVRIT0QsXG4gIFBSX0hBTkRMRVJfQ0FOQ0VMXG5dO1xuXG52YXIgY29uc3RhbnRzID0ge1xuICBwYXltZW50VHlwZXM6IHBheW1lbnRUeXBlcyxcblx0QVBQTEVfUEFZX0FQSV9WRVJTSU9OOiA4LFxuXHRHT09HTEVfUEFZX0FQSV9WRVJTSU9OOiAyLFxuXHRHT09HTEVfUEFZX0FQSV9NSU5PUl9WRVJTSU9OOiAwLFxuICBHT09HTEVfUEFZX0dBVEVXQVk6ICdzZWFtbGVzc3BheScsXG4gIEdPT0dMRV9QQVlfR0FURVdBWV9NRVJDSEFOVF9JRDogJ2dvb2dsZXRlc3QnLFxuXHRTVVBQT1JURURfTkVUV09SS1NfQVBQTEVfUEFZOiBbJ2FtZXgnLCAnY2hpbmFVbmlvblBheScsICdkaXNjb3ZlcicsICdtYWVzdHJvJywgJ21hc3RlckNhcmQnLCAndmlzYSddLFxuXHRTVVBQT1JURURfTkVUV09SS1NfR09PR0xFX1BBWTogWydBTUVYJywgJ0RJU0NPVkVSJywgJ0pDQicsICdNQVNURVJDQVJEJywgJ1ZJU0EnXSxcblx0TUVSQ0hBTlRfQ0FQQUJJTElUSUVTX0FQUExFX1BBWTogWydzdXBwb3J0czNEUycsICdzdXBwb3J0c0NyZWRpdCcsICdzdXBwb3J0c0RlYml0J10sXG5cdC8vIE1FUkNIQU5UX0NBUEFCSUxJVElFU19HT09HTEVfUEFZOiBbJ0NSWVBUT0dSQU1fM0RTJ10sXG5cdE1FUkNIQU5UX0NBUEFCSUxJVElFU19HT09HTEVfUEFZOiBbJ1BBTl9PTkxZJywgJ0NSWVBUT0dSQU1fM0RTJ10sXG5cdFNFQU1MRVNTUEFZX1BBWV9XSVRIX0FQUExFX01FUkNIQU5UX0lEOiAnbWVyY2hhbnQuY29tLnNlYW1sZXNzcGF5LndhbGxldCcsXG5cdFNFQU1MRVNTUEFZX1BBWV9XSVRIX0dPT0dMRV9NRVJDSEFOVF9JRDogJ3NlYW1sZXNzcGF5Jyxcblx0REVGQVVMVF9DT1VOVFJZX0NPREU6ICdVUycsXG5cdFBBWU1FTlRfUkVRVUVTVF9NRVRIT0RfQkFTSUM6IFBBWU1FTlRfUkVRVUVTVF9NRVRIT0RfQkFTSUMsXG5cdFBBWU1FTlRfUkVRVUVTVF9NRVRIT0RfQVBQTEVfUEFZOiBQQVlNRU5UX1JFUVVFU1RfTUVUSE9EX0FQUExFX1BBWSxcbiAgUEFZTUVOVF9SRVFVRVNUX01FVEhPRF9HT09HTEVfUEFZOiBQQVlNRU5UX1JFUVVFU1RfTUVUSE9EX0dPT0dMRV9QQVksXG5cdFBSX0hBTkRMRVJfU0hJUFBJTkdfQUREUkVTU19DSEFOR0U6IFBSX0hBTkRMRVJfU0hJUFBJTkdfQUREUkVTU19DSEFOR0UsXG5cdFBSX0hBTkRMRVJfU0hJUFBJTkdfT1BUSU9OX0NIQU5HRTogUFJfSEFORExFUl9TSElQUElOR19PUFRJT05fQ0hBTkdFLFxuXHRQUl9IQU5ETEVSX01FUkNIQU5UX1ZBTElEQVRJT046IFBSX0hBTkRMRVJfTUVSQ0hBTlRfVkFMSURBVElPTixcbiAgUFJfSEFORExFUl9QQVlNRU5UX01FVEhPRDogUFJfSEFORExFUl9QQVlNRU5UX01FVEhPRCxcbiAgUFJfSEFORExFUl9DQU5DRUw6IFBSX0hBTkRMRVJfQ0FOQ0VMLFxuXHRQUl9IQU5ETEVSUzogUFJfSEFORExFUlMsXG5cdEFQUExFX1BBWV9QQVlNRU5UX1RZUEVTOiBBUFBMRV9QQVlfUEFZTUVOVF9UWVBFUyxcblx0UEFZTUVOVF9SRVFVRVNUX1NVUFBPUlRFRF9NRVRIT0RTOiBbXG5cdFx0UEFZTUVOVF9SRVFVRVNUX01FVEhPRF9CQVNJQyxcblx0XHRQQVlNRU5UX1JFUVVFU1RfTUVUSE9EX0FQUExFX1BBWSxcbiAgICBQQVlNRU5UX1JFUVVFU1RfTUVUSE9EX0dPT0dMRV9QQVlcblx0XSxcblx0UEFZTUVOVF9SRVFVRVNUX01FVEhPRF9UWVBFUzogUEFZTUVOVF9SRVFVRVNUX01FVEhPRF9UWVBFUyxcblx0UEFZTUVOVF9SRVFVRVNUX01FVEhPRF9UWVBFX0FQUExFX1BBWTogUEFZTUVOVF9SRVFVRVNUX01FVEhPRF9UWVBFX0FQUExFX1BBWVxufTtcblxuY29uc3RhbnRzLmV2ZW50cyA9IGVudW1lcmF0ZShbXG4gICdGUkFNRV9SRUFEWScsXG4gICdGUkFNRV9DQU5fTUFLRV9SRVFVRVNUUycsXG4gICdQQVlNRU5UX1JFUVVFU1RfSU5JVElBTElaRUQnLFxuICAnUEFZTUVOVF9SRVFVRVNUX1JFQURZJyxcbiAgJ1BBWU1FTlRfUkVRVUVTVF9GQUlMRUQnLFxuICAnUEFZTUVOVF9SRVFVRVNUX1NVQ0NFU1NGVUwnLFxuICAnUEFZTUVOVF9SRVFVRVNUX1NISVBQSU5HX0FERFJFU1NfQ0hBTkdFJyxcbiAgJ1BBWU1FTlRfUkVRVUVTVF9DUkVBVEVfSEFORExFUicsXG5cdCdJTlBVVF9FVkVOVCcsXG4gICdQQVlNRU5UX1JFUVVFU1RfSU5WT0tFRCcsXG4gICdQQVlNRU5UX1JFUVVFU1RfSU5WT0tFRF9TVUNDRVNTRlVMJyxcbiAgJ1BBWU1FTlRfUkVRVUVTVF9JTlZPS0VEX0ZBSUxFRCcsXG5dLCAncGF5bWVudC1yZXF1ZXN0OicpO1xuXG5jb25zdGFudHMuZXJyb3JzID0ge1xuICBQQVlNRU5UX1JFUVVFU1RfTk9fVkFMSURfU1VQUE9SVEVEX1BBWU1FTlRfTUVUSE9EUzoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTUVSQ0hBTlQsXG4gICAgY29kZTogJ1BBWU1FTlRfUkVRVUVTVF9OT19WQUxJRF9TVVBQT1JURURfUEFZTUVOVF9NRVRIT0RTJyxcbiAgICBtZXNzYWdlOiAnVGhlcmUgYXJlIG5vIHN1cHBvcnRlZCBwYXltZW50IG1ldGhvZHMgYXNzb2NpYXRlZCB3aXRoIHRoaXMgYWNjb3VudC4nXG4gIH0sXG4gIFBBWU1FTlRfUkVRVUVTVF9DQU5DRUxFRDoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuQ1VTVE9NRVIsXG4gICAgY29kZTogJ1BBWU1FTlRfUkVRVUVTVF9DQU5DRUxFRCcsXG4gICAgbWVzc2FnZTogJ1BheW1lbnQgcmVxdWVzdCB3YXMgY2FuY2VsZWQuJ1xuICB9LFxuICBQQVlNRU5UX1JFUVVFU1RfSU5JVElBTElaQVRJT05fTUlTQ09ORklHVVJFRDoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTUVSQ0hBTlQsXG4gICAgY29kZTogJ1BBWU1FTlRfUkVRVUVTVF9JTklUSUFMSVpBVElPTl9NSVNDT05GSUdVUkVEJyxcbiAgICBtZXNzYWdlOiAnU29tZXRoaW5nIHdlbnQgd3Jvbmcgd2hlbiBjb25maWd1cmluZyB0aGUgcGF5bWVudCByZXF1ZXN0LidcbiAgfSxcbiAgUEFZTUVOVF9SRVFVRVNUX1BBWV9XSVRIX0dPT0dMRV9GQUlMRURfVE9fVE9LRU5JWkU6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLk1FUkNIQU5ULFxuICAgIGNvZGU6ICdQQVlNRU5UX1JFUVVFU1RfUEFZX1dJVEhfR09PR0xFX0ZBSUxFRF9UT19UT0tFTklaRScsXG4gICAgbWVzc2FnZTogJ1NvbWV0aGluZyB3ZW50IHdyb25nIHdoZW4gdG9rZW5pemluZyB0aGUgUGF5IHdpdGggR29vZ2xlIGNhcmQuJ1xuICB9LFxuICBQQVlNRU5UX1JFUVVFU1RfUEFZX1dJVEhfR09PR0xFX1BBUlNJTkdfRVJST1I6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLlVOS05PV04sXG4gICAgY29kZTogJ1BBWU1FTlRfUkVRVUVTVF9QQVlfV0lUSF9HT09HTEVfUEFSU0lOR19FUlJPUicsXG4gICAgbWVzc2FnZTogJ1NvbWV0aGluZyB3ZW50IHdyb25nIHdoZW4gdG9rZW5pemluZyB0aGUgUGF5IHdpdGggR29vZ2xlIGNhcmQuJ1xuICB9LFxuICBQQVlNRU5UX1JFUVVFU1RfTk9UX0NPTVBMRVRFRDoge1xuICAgIGNvZGU6ICdQQVlNRU5UX1JFUVVFU1RfTk9UX0NPTVBMRVRFRCcsXG4gICAgbWVzc2FnZTogJ1BheW1lbnQgcmVxdWVzdCBjb3VsZCBub3QgYmUgY29tcGxldGVkLidcbiAgfSxcbiAgUEFZTUVOVF9SRVFVRVNUX0NSRUFURV9TVVBQT1JURURfUEFZTUVOVF9NRVRIT0RTX0NPTkZJR1VSQVRJT05fTVVTVF9JTkNMVURFX1RZUEU6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLk1FUkNIQU5ULFxuICAgIGNvZGU6ICdQQVlNRU5UX1JFUVVFU1RfQ1JFQVRFX1NVUFBPUlRFRF9QQVlNRU5UX01FVEhPRFNfQ09ORklHVVJBVElPTl9NVVNUX0lOQ0xVREVfVFlQRScsXG4gICAgbWVzc2FnZTogJ2NyZWF0ZVN1cHBvcnRlZFBheW1lbnRNZXRob2RzQ29uZmlndXJhdGlvbiBtdXN0IGluY2x1ZGUgYSB0eXBlIHBhcmFtZXRlci4nXG4gIH0sXG4gIFBBWU1FTlRfUkVRVUVTVF9DUkVBVEVfU1VQUE9SVEVEX1BBWU1FTlRfTUVUSE9EU19DT05GSUdVUkFUSU9OX1RZUEVfTk9UX0VOQUJMRUQ6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLk1FUkNIQU5ULFxuICAgIGNvZGU6ICdQQVlNRU5UX1JFUVVFU1RfQ1JFQVRFX1NVUFBPUlRFRF9QQVlNRU5UX01FVEhPRFNfQ09ORklHVVJBVElPTl9UWVBFX05PVF9FTkFCTEVEJyxcbiAgICBtZXNzYWdlOiAnY3JlYXRlU3VwcG9ydGVkUGF5bWVudE1ldGhvZHNDb25maWd1cmF0aW9uIHR5cGUgcGFyYW1ldGVyIG11c3QgYmUgdmFsaWQgb3IgZW5hYmxlZC4nXG4gIH0sXG4gIFBBWU1FTlRfUkVRVUVTVF9JTlZBTElEX1BBWU1FTlRfQlVUVE9OX0NPTlRBSU5FUl9TRUxFQ1RPUjoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuQ1VTVE9NRVIsXG4gICAgY29kZTogJ1BBWU1FTlRfUkVRVUVTVF9JTlZBTElEX1BBWU1FTlRfQlVUVE9OX0NPTlRBSU5FUl9TRUxFQ1RPUicsXG4gICAgbWVzc2FnZTogJ0ludmFsaWQgcGF5bWVudCBidXR0b24gY29udGFpbmVyIHNlbGVjdG9yLidcbiAgfSxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gY29uc3RhbnRzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgU2VhbWxlc3NwYXlFcnJvciA9IHJlcXVpcmUoJy4vc2VhbWxlc3NwYXktZXJyb3InKTtcbnZhciBQcm9taXNlID0gcmVxdWlyZSgnLi9wcm9taXNlJyk7XG52YXIgc2hhcmVkRXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMnKTtcbnZhciBWRVJTSU9OID0gXCJ3ZWItc2RrXCI7XG5cbmZ1bmN0aW9uIGJhc2ljQ29tcG9uZW50VmVyaWZpY2F0aW9uKG9wdGlvbnMpIHtcbiAgdmFyIGNsaWVudCwgY2xpZW50VmVyc2lvbiwgbmFtZTtcblxuICBpZiAoIW9wdGlvbnMpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgdHlwZTogc2hhcmVkRXJyb3JzLklOVkFMSURfVVNFX09GX0lOVEVSTkFMX0ZVTkNUSU9OLnR5cGUsXG4gICAgICBjb2RlOiBzaGFyZWRFcnJvcnMuSU5WQUxJRF9VU0VfT0ZfSU5URVJOQUxfRlVOQ1RJT04uY29kZSxcbiAgICAgIG1lc3NhZ2U6ICdPcHRpb25zIG11c3QgYmUgcGFzc2VkIHRvIGJhc2ljQ29tcG9uZW50VmVyaWZpY2F0aW9uIGZ1bmN0aW9uLidcbiAgICB9KSk7XG4gIH1cblxuICBuYW1lID0gb3B0aW9ucy5uYW1lO1xuICBjbGllbnQgPSBvcHRpb25zLmNsaWVudDtcblxuICBpZiAoY2xpZW50ID09IG51bGwpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgdHlwZTogc2hhcmVkRXJyb3JzLklOU1RBTlRJQVRJT05fT1BUSU9OX1JFUVVJUkVELnR5cGUsXG4gICAgICBjb2RlOiBzaGFyZWRFcnJvcnMuSU5TVEFOVElBVElPTl9PUFRJT05fUkVRVUlSRUQuY29kZSxcbiAgICAgIG1lc3NhZ2U6ICdvcHRpb25zLmNsaWVudCBpcyByZXF1aXJlZCB3aGVuIGluc3RhbnRpYXRpbmcgJyArIG5hbWUgKyAnLidcbiAgICB9KSk7XG4gIH1cblxuICBjbGllbnRWZXJzaW9uID0gY2xpZW50LmdldFZlcnNpb24oKTtcblxuICBpZiAoY2xpZW50VmVyc2lvbiAhPT0gVkVSU0lPTikge1xuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgU2VhbWxlc3NwYXlFcnJvcih7XG4gICAgICB0eXBlOiBzaGFyZWRFcnJvcnMuSU5DT01QQVRJQkxFX1ZFUlNJT05TLnR5cGUsXG4gICAgICBjb2RlOiBzaGFyZWRFcnJvcnMuSU5DT01QQVRJQkxFX1ZFUlNJT05TLmNvZGUsXG4gICAgICBtZXNzYWdlOiAnQ2xpZW50ICh2ZXJzaW9uICcgKyBjbGllbnRWZXJzaW9uICsgJykgYW5kICcgKyBuYW1lICsgJyAodmVyc2lvbiAnICsgVkVSU0lPTiArICcpIGNvbXBvbmVudHMgbXVzdCBiZSBmcm9tIHRoZSBzYW1lIFNESyB2ZXJzaW9uLidcbiAgICB9KSk7XG4gIH1cblxuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICB2ZXJpZnk6IGJhc2ljQ29tcG9uZW50VmVyaWZpY2F0aW9uXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNXaGl0ZWxpc3RlZERvbWFpbiA9IHJlcXVpcmUoJy4uL2lzLXdoaXRlbGlzdGVkLWRvbWFpbicpO1xuXG5mdW5jdGlvbiBjaGVja09yaWdpbihwb3N0TWVzc2FnZU9yaWdpbiwgbWVyY2hhbnRVcmwpIHtcbiAgdmFyIG1lcmNoYW50T3JpZ2luLCBtZXJjaGFudEhvc3Q7XG4gIHZhciBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuXG4gIGEuaHJlZiA9IG1lcmNoYW50VXJsO1xuXG4gIGlmIChhLnByb3RvY29sID09PSAnaHR0cHM6Jykge1xuICAgIG1lcmNoYW50SG9zdCA9IGEuaG9zdC5yZXBsYWNlKC86NDQzJC8sICcnKTtcbiAgfSBlbHNlIGlmIChhLnByb3RvY29sID09PSAnaHR0cDonKSB7XG4gICAgbWVyY2hhbnRIb3N0ID0gYS5ob3N0LnJlcGxhY2UoLzo4MCQvLCAnJyk7XG4gIH0gZWxzZSB7XG4gICAgbWVyY2hhbnRIb3N0ID0gYS5ob3N0O1xuICB9XG5cbiAgbWVyY2hhbnRPcmlnaW4gPSBhLnByb3RvY29sICsgJy8vJyArIG1lcmNoYW50SG9zdDtcblxuICBpZiAobWVyY2hhbnRPcmlnaW4gPT09IHBvc3RNZXNzYWdlT3JpZ2luKSB7IHJldHVybiB0cnVlOyB9XG5cbiAgYS5ocmVmID0gcG9zdE1lc3NhZ2VPcmlnaW47XG5cbiAgcmV0dXJuIGlzV2hpdGVsaXN0ZWREb21haW4ocG9zdE1lc3NhZ2VPcmlnaW4pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgY2hlY2tPcmlnaW46IGNoZWNrT3JpZ2luXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZW51bWVyYXRlID0gcmVxdWlyZSgnLi4vZW51bWVyYXRlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZW51bWVyYXRlKFtcbiAgJ0NPTkZJR1VSQVRJT05fUkVRVUVTVCdcbl0sICdidXM6Jyk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBidXMgPSByZXF1aXJlKCdmcmFtZWJ1cycpO1xudmFyIGV2ZW50cyA9IHJlcXVpcmUoJy4vZXZlbnRzJyk7XG52YXIgY2hlY2tPcmlnaW4gPSByZXF1aXJlKCcuL2NoZWNrLW9yaWdpbicpLmNoZWNrT3JpZ2luO1xudmFyIFNlYW1sZXNzcGF5RXJyb3IgPSByZXF1aXJlKCcuLi9zZWFtbGVzc3BheS1lcnJvcicpO1xuXG5mdW5jdGlvbiBTZWFtbGVzc3BheUJ1cyhvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIHRoaXMuY2hhbm5lbCA9IG9wdGlvbnMuY2hhbm5lbDtcbiAgaWYgKCF0aGlzLmNoYW5uZWwpIHtcbiAgICB0aHJvdyBuZXcgU2VhbWxlc3NwYXlFcnJvcih7XG4gICAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLklOVEVSTkFMLFxuICAgICAgY29kZTogJ01JU1NJTkdfQ0hBTk5FTF9JRCcsXG4gICAgICBtZXNzYWdlOiAnQ2hhbm5lbCBJRCBtdXN0IGJlIHNwZWNpZmllZC4nXG4gICAgfSk7XG4gIH1cblxuICB0aGlzLm1lcmNoYW50VXJsID0gb3B0aW9ucy5tZXJjaGFudFVybDtcblxuICB0aGlzLl9pc0Rlc3Ryb3llZCA9IGZhbHNlO1xuICB0aGlzLl9pc1ZlcmJvc2UgPSBmYWxzZTtcblxuICB0aGlzLl9saXN0ZW5lcnMgPSBbXTtcblxuICB0aGlzLl9sb2coJ25ldyBidXMgb24gY2hhbm5lbCAnICsgdGhpcy5jaGFubmVsLCBbbG9jYXRpb24uaHJlZl0pO1xufVxuXG5TZWFtbGVzc3BheUJ1cy5wcm90b3R5cGUub24gPSBmdW5jdGlvbiAoZXZlbnROYW1lLCBvcmlnaW5hbEhhbmRsZXIpIHtcbiAgdmFyIG5hbWVzcGFjZWRFdmVudCwgYXJncztcbiAgdmFyIGhhbmRsZXIgPSBvcmlnaW5hbEhhbmRsZXI7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICBpZiAodGhpcy5faXNEZXN0cm95ZWQpIHsgcmV0dXJuOyB9XG5cbiAgaWYgKHRoaXMubWVyY2hhbnRVcmwpIHtcbiAgICBoYW5kbGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgLyogZXNsaW50LWRpc2FibGUgbm8taW52YWxpZC10aGlzICovXG4gICAgICBpZiAoY2hlY2tPcmlnaW4odGhpcy5vcmlnaW4sIHNlbGYubWVyY2hhbnRVcmwpKSB7XG4gICAgICAgIG9yaWdpbmFsSGFuZGxlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfVxuICAgICAgLyogZXNsaW50LWVuYWJsZSBuby1pbnZhbGlkLXRoaXMgKi9cbiAgICB9O1xuICB9XG5cbiAgbmFtZXNwYWNlZEV2ZW50ID0gdGhpcy5fbmFtZXNwYWNlRXZlbnQoZXZlbnROYW1lKTtcbiAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gIGFyZ3NbMF0gPSBuYW1lc3BhY2VkRXZlbnQ7XG4gIGFyZ3NbMV0gPSBoYW5kbGVyO1xuXG4gIHRoaXMuX2xvZygnb24nLCBhcmdzKTtcbiAgYnVzLm9uLmFwcGx5KGJ1cywgYXJncyk7XG5cbiAgdGhpcy5fbGlzdGVuZXJzLnB1c2goe1xuICAgIGV2ZW50TmFtZTogZXZlbnROYW1lLFxuICAgIGhhbmRsZXI6IGhhbmRsZXIsXG4gICAgb3JpZ2luYWxIYW5kbGVyOiBvcmlnaW5hbEhhbmRsZXJcbiAgfSk7XG59O1xuXG5TZWFtbGVzc3BheUJ1cy5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uIChldmVudE5hbWUpIHtcbiAgdmFyIGFyZ3M7XG5cbiAgaWYgKHRoaXMuX2lzRGVzdHJveWVkKSB7IHJldHVybjsgfVxuXG4gIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICBhcmdzWzBdID0gdGhpcy5fbmFtZXNwYWNlRXZlbnQoZXZlbnROYW1lKTtcblxuICB0aGlzLl9sb2coJ2VtaXQnLCBhcmdzKTtcbiAgYnVzLmVtaXQuYXBwbHkoYnVzLCBhcmdzKTtcbn07XG5cblNlYW1sZXNzcGF5QnVzLnByb3RvdHlwZS5fb2ZmRGlyZWN0ID0gZnVuY3Rpb24gKGV2ZW50TmFtZSkge1xuICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG5cbiAgaWYgKHRoaXMuX2lzRGVzdHJveWVkKSB7IHJldHVybjsgfVxuXG4gIGFyZ3NbMF0gPSB0aGlzLl9uYW1lc3BhY2VFdmVudChldmVudE5hbWUpO1xuXG4gIHRoaXMuX2xvZygnb2ZmJywgYXJncyk7XG4gIGJ1cy5vZmYuYXBwbHkoYnVzLCBhcmdzKTtcbn07XG5cblNlYW1sZXNzcGF5QnVzLnByb3RvdHlwZS5vZmYgPSBmdW5jdGlvbiAoZXZlbnROYW1lLCBvcmlnaW5hbEhhbmRsZXIpIHtcbiAgdmFyIGksIGxpc3RlbmVyO1xuICB2YXIgaGFuZGxlciA9IG9yaWdpbmFsSGFuZGxlcjtcblxuICBpZiAodGhpcy5faXNEZXN0cm95ZWQpIHsgcmV0dXJuOyB9XG5cbiAgaWYgKHRoaXMubWVyY2hhbnRVcmwpIHtcbiAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5fbGlzdGVuZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsaXN0ZW5lciA9IHRoaXMuX2xpc3RlbmVyc1tpXTtcblxuICAgICAgaWYgKGxpc3RlbmVyLm9yaWdpbmFsSGFuZGxlciA9PT0gb3JpZ2luYWxIYW5kbGVyKSB7XG4gICAgICAgIGhhbmRsZXIgPSBsaXN0ZW5lci5oYW5kbGVyO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHRoaXMuX29mZkRpcmVjdChldmVudE5hbWUsIGhhbmRsZXIpO1xufTtcblxuU2VhbWxlc3NwYXlCdXMucHJvdG90eXBlLl9uYW1lc3BhY2VFdmVudCA9IGZ1bmN0aW9uIChldmVudE5hbWUpIHtcbiAgcmV0dXJuIFsnc2VhbWxlc3NwYXknLCB0aGlzLmNoYW5uZWwsIGV2ZW50TmFtZV0uam9pbignOicpO1xufTtcblxuU2VhbWxlc3NwYXlCdXMucHJvdG90eXBlLnRlYXJkb3duID0gZnVuY3Rpb24gKCkge1xuICB2YXIgbGlzdGVuZXIsIGk7XG5cbiAgZm9yIChpID0gMDsgaSA8IHRoaXMuX2xpc3RlbmVycy5sZW5ndGg7IGkrKykge1xuICAgIGxpc3RlbmVyID0gdGhpcy5fbGlzdGVuZXJzW2ldO1xuICAgIHRoaXMuX29mZkRpcmVjdChsaXN0ZW5lci5ldmVudE5hbWUsIGxpc3RlbmVyLmhhbmRsZXIpO1xuICB9XG5cbiAgdGhpcy5fbGlzdGVuZXJzLmxlbmd0aCA9IDA7XG5cbiAgdGhpcy5faXNEZXN0cm95ZWQgPSB0cnVlO1xufTtcblxuU2VhbWxlc3NwYXlCdXMucHJvdG90eXBlLl9sb2cgPSBmdW5jdGlvbiAoZnVuY3Rpb25OYW1lLCBhcmdzKSB7XG4gIGlmICh0aGlzLl9pc1ZlcmJvc2UpIHtcbiAgICBjb25zb2xlLmxvZyhmdW5jdGlvbk5hbWUsIGFyZ3MpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcbiAgfVxufTtcblxuU2VhbWxlc3NwYXlCdXMuZXZlbnRzID0gZXZlbnRzO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNlYW1sZXNzcGF5QnVzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgU2VhbWxlc3NwYXlFcnJvciA9IHJlcXVpcmUoJy4vc2VhbWxlc3NwYXktZXJyb3InKTtcbnZhciBzaGFyZWRFcnJvcnMgPSByZXF1aXJlKCcuL2Vycm9ycycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpbnN0YW5jZSwgbWV0aG9kTmFtZXMpIHtcbiAgbWV0aG9kTmFtZXMuZm9yRWFjaChmdW5jdGlvbiAobWV0aG9kTmFtZSkge1xuICAgIGluc3RhbmNlW21ldGhvZE5hbWVdID0gZnVuY3Rpb24gKCkge1xuICAgICAgdGhyb3cgbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgICB0eXBlOiBzaGFyZWRFcnJvcnMuTUVUSE9EX0NBTExFRF9BRlRFUl9URUFSRE9XTi50eXBlLFxuICAgICAgICBjb2RlOiBzaGFyZWRFcnJvcnMuTUVUSE9EX0NBTExFRF9BRlRFUl9URUFSRE9XTi5jb2RlLFxuICAgICAgICBtZXNzYWdlOiBtZXRob2ROYW1lICsgJyBjYW5ub3QgYmUgY2FsbGVkIGFmdGVyIHRlYXJkb3duLidcbiAgICAgIH0pO1xuICAgIH07XG4gIH0pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gZW51bWVyYXRlKHZhbHVlcywgcHJlZml4KSB7XG4gIHByZWZpeCA9IHByZWZpeCA9PSBudWxsID8gJycgOiBwcmVmaXg7XG5cbiAgcmV0dXJuIHZhbHVlcy5yZWR1Y2UoZnVuY3Rpb24gKGVudW1lcmF0aW9uLCB2YWx1ZSkge1xuICAgIGVudW1lcmF0aW9uW3ZhbHVlXSA9IHByZWZpeCArIHZhbHVlO1xuICAgIHJldHVybiBlbnVtZXJhdGlvbjtcbiAgfSwge30pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGVudW1lcmF0ZTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFNlYW1sZXNzcGF5RXJyb3IgPSByZXF1aXJlKCcuL3NlYW1sZXNzcGF5LWVycm9yJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBJTlZBTElEX1VTRV9PRl9JTlRFUk5BTF9GVU5DVElPTjoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuSU5URVJOQUwsXG4gICAgY29kZTogJ0lOVkFMSURfVVNFX09GX0lOVEVSTkFMX0ZVTkNUSU9OJ1xuICB9LFxuICBDQUxMQkFDS19SRVFVSVJFRDoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTUVSQ0hBTlQsXG4gICAgY29kZTogJ0NBTExCQUNLX1JFUVVJUkVEJ1xuICB9LFxuICBJTlNUQU5USUFUSU9OX09QVElPTl9SRVFVSVJFRDoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTUVSQ0hBTlQsXG4gICAgY29kZTogJ0lOU1RBTlRJQVRJT05fT1BUSU9OX1JFUVVJUkVEJ1xuICB9LFxuICBJTlZBTElEX09QVElPTjoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTUVSQ0hBTlQsXG4gICAgY29kZTogJ0lOVkFMSURfT1BUSU9OJ1xuICB9LFxuICBJTkNPTVBBVElCTEVfVkVSU0lPTlM6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLk1FUkNIQU5ULFxuICAgIGNvZGU6ICdJTkNPTVBBVElCTEVfVkVSU0lPTlMnXG4gIH0sXG4gIElOQ09NUEFUSUJMRV9GSUVMRFNfU0VUOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnSU5DT01QQVRJQkxFX0ZJRUxEU19TRVQnXG4gIH0sXG4gIE1FVEhPRF9DQUxMRURfQUZURVJfVEVBUkRPV046IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLk1FUkNIQU5ULFxuICAgIGNvZGU6ICdNRVRIT0RfQ0FMTEVEX0FGVEVSX1RFQVJET1dOJ1xuICB9LFxuICBTRUFNTEVTU1BBWV9BUElfQUNDRVNTX1JFU1RSSUNURUQ6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLk1FUkNIQU5ULFxuICAgIGNvZGU6ICdTRUFNTEVTU1BBWV9BUElfQUNDRVNTX1JFU1RSSUNURUQnLFxuICAgIG1lc3NhZ2U6ICdZb3VyIGFjY2VzcyBpcyByZXN0cmljdGVkIGFuZCBjYW5ub3QgdXNlIHRoaXMgcGFydCBvZiB0aGUgU2VhbWxlc3NwYXkgQVBJLidcbiAgfSxcbiAgU0VBTUxFU1NQQVlfUEFZUEFMX05PVF9MT0FERUQ6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLklOVEVSTkFMLFxuICAgIGNvZGU6ICdTRUFNTEVTU1BBWV9QQVlQQUxfTk9UX0xPQURFRCcsXG4gICAgbWVzc2FnZTogJ1BheXBhbCBTREsgY291bGQgbm90IGJlIGxvYWRlZC4nXG4gIH0sXG4gIElOVkFMSURfTEFUSU4xX1NUUklORzoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuSU5URVJOQUwsXG4gICAgY29kZTogJ0lOVkFMSURfTEFUSU4xX1NUUklORydcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIEFQSV9IT1NUID0gdW5kZWZpbmVkO1xudmFyIFBBTlZBVUxUX0hPU1QgPSB1bmRlZmluZWQ7XG52YXIgQVNTRVRTX0hPU1QgPSBcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMS9kZXZcIjtcblxudmFyIGxlZ2FsSG9zdHMgPSBbXG4gICdzZWFtbGVzc3BheS5jb20nLFxuICAnc2VhbWxlc3NwYXkuZGV2JyxcbiAgJ3NlYW1sZXNzcGF5LmlvJyxcbiAgJ3dlYi1zZGsuc2VhbWxlc3NwYXkuY29tJyxcbiAgJ2FwaS5zZWFtbGVzc3BheS5jb20nLFxuICAnYXBpLnNlYW1sZXNzcGF5LmRldicsXG4gICdhcGkuc2VhbWxlc3NwYXkuaW8nLFxuICAncGFuLXZhdWx0LnNlYW1sZXNzcGF5LmNvbScsXG4gICdwYW4tdmF1bHQuc2VhbWxlc3NwYXkuZGV2JyxcbiAgJ3Bhbi12YXVsdC5zZWFtbGVzc3BheS5pbycsXG4gICdhcGkuc2FuZGJveC5zZWFtbGVzc3BheS5jb20nLFxuICAnYXBpLnNhbmRib3guc2VhbWxlc3NwYXkuZGV2JyxcbiAgJ2FwaS5zYW5kYm94LnNlYW1sZXNzcGF5LmlvJyxcbiAgJ3Bhbi12YXVsdC5zYW5kYm94LnNlYW1sZXNzcGF5LmNvbScsXG4gICdwYW4tdmF1bHQuc2FuZGJveC5zZWFtbGVzc3BheS5kZXYnLFxuICAncGFuLXZhdWx0LnNhbmRib3guc2VhbWxlc3NwYXkuaW8nXG5dO1xuXG4vLyByZW1vdmVJZihwcm9kdWN0aW9uKVxubGVnYWxIb3N0cy5wdXNoKCdsb2NhbGhvc3QnKTtcbmlmIChBUElfSE9TVCkge1xuICBsZWdhbEhvc3RzLnB1c2goc3RyaXBTdWJkb21haW5zKEFQSV9IT1NUKSk7XG59XG5pZiAoUEFOVkFVTFRfSE9TVCkge1xuICBsZWdhbEhvc3RzLnB1c2goc3RyaXBTdWJkb21haW5zKFBBTlZBVUxUX0hPU1QpKTtcbn1cbmlmIChBU1NFVFNfSE9TVCkge1xuICBsZWdhbEhvc3RzLnB1c2goc3RyaXBTdWJkb21haW5zKEFTU0VUU19IT1NUKS5yZXBsYWNlKCdodHRwOi8vJywgJycpLnJlcGxhY2UoJ2h0dHBzOi8vJywgJycpKTtcbn1cbi8vIGVuZFJlbW92ZUlmKHByb2R1Y3Rpb24pXG5cbmZ1bmN0aW9uIHN0cmlwU3ViZG9tYWlucyhkb21haW4pIHtcbiAgcmV0dXJuIGRvbWFpbi5zcGxpdCgnLicpLnNsaWNlKC0yKS5qb2luKCcuJyk7XG59XG5cbmZ1bmN0aW9uIGlzV2hpdGVsaXN0ZWREb21haW4odXJsKSB7XG4gIC8vIHZhciBtYWluRG9tYWluO1xuXG4gIC8vIHVybCA9IHVybC50b0xvd2VyQ2FzZSgpO1xuXG4gIC8vIGlmICghKG5ldyBSZWdFeHAoJ15odHRwcz86JykpLnRlc3QodXJsKSkge1xuICAvLyAgIHJldHVybiBmYWxzZTtcbiAgLy8gfVxuXG4gIC8vIHBhcnNlciA9IHBhcnNlciB8fCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gIC8vIHBhcnNlci5ocmVmID0gdXJsO1xuICAvLyBtYWluRG9tYWluID0gc3RyaXBTdWJkb21haW5zKHBhcnNlci5ob3N0bmFtZSk7XG4gIHRyeSB7XG4gICAgdmFyIHBhcnNlZFVybCA9IG5ldyBVUkwodXJsKTtcbiAgICByZXR1cm4gbGVnYWxIb3N0cy5pbmRleE9mKHN0cmlwU3ViZG9tYWlucyhwYXJzZWRVcmwuaG9zdG5hbWUpKSAhPT0gLTE7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc1doaXRlbGlzdGVkRG9tYWluO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaikuZmlsdGVyKGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4gdHlwZW9mIG9ialtrZXldID09PSAnZnVuY3Rpb24nO1xuICB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBQcm9taXNlID0gZ2xvYmFsLlByb21pc2U7XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvbWlzZTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGVudW1lcmF0ZSA9IHJlcXVpcmUoJy4vZW51bWVyYXRlJyk7XG5cbi8qKlxuICogQGNsYXNzXG4gKiBAZ2xvYmFsXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyBDb25zdHJ1Y3Rpb24gb3B0aW9uc1xuICogQGNsYXNzZGVzYyBUaGlzIGNsYXNzIGlzIHVzZWQgdG8gcmVwb3J0IGVycm9yIGNvbmRpdGlvbnMsIGZyZXF1ZW50bHkgYXMgdGhlIGZpcnN0IHBhcmFtZXRlciB0byBjYWxsYmFja3MgdGhyb3VnaG91dCB0aGUgU2VhbWxlc3NwYXkgU0RLLlxuICogQGRlc2NyaXB0aW9uIDxzdHJvbmc+WW91IGNhbm5vdCB1c2UgdGhpcyBjb25zdHJ1Y3RvciBkaXJlY3RseS4gSW50ZXJhY3Qgd2l0aCBpbnN0YW5jZXMgb2YgdGhpcyBjbGFzcyB0aHJvdWdoIHtAbGluayBjYWxsYmFjayBjYWxsYmFja3N9Ljwvc3Ryb25nPlxuICovXG5mdW5jdGlvbiBTZWFtbGVzc3BheUVycm9yKG9wdGlvbnMpIHtcbiAgaWYgKCFTZWFtbGVzc3BheUVycm9yLnR5cGVzLmhhc093blByb3BlcnR5KG9wdGlvbnMudHlwZSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3Iob3B0aW9ucy50eXBlICsgJyBpcyBub3QgYSB2YWxpZCB0eXBlLicpO1xuICB9XG5cbiAgaWYgKCFvcHRpb25zLmNvZGUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yIGNvZGUgcmVxdWlyZWQuJyk7XG4gIH1cblxuICBpZiAoIW9wdGlvbnMubWVzc2FnZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignRXJyb3IgbWVzc2FnZSByZXF1aXJlZC4nKTtcbiAgfVxuXG4gIHRoaXMubmFtZSA9ICdTZWFtbGVzc3BheUVycm9yJztcblxuICAvKipcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICogQGRlc2NyaXB0aW9uIEEgY29kZSB0aGF0IGNvcnJlc3BvbmRzIHRvIHNwZWNpZmljIGVycm9ycy5cbiAgICovXG4gIHRoaXMuY29kZSA9IG9wdGlvbnMuY29kZTtcblxuICAvKipcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICogQGRlc2NyaXB0aW9uIEEgc2hvcnQgZGVzY3JpcHRpb24gb2YgdGhlIGVycm9yLlxuICAgKi9cbiAgdGhpcy5tZXNzYWdlID0gb3B0aW9ucy5tZXNzYWdlO1xuXG4gIC8qKlxuICAgKiBAdHlwZSB7U2VhbWxlc3NwYXlFcnJvci50eXBlc31cbiAgICogQGRlc2NyaXB0aW9uIFRoZSB0eXBlIG9mIGVycm9yLlxuICAgKi9cbiAgdGhpcy50eXBlID0gb3B0aW9ucy50eXBlO1xuXG4gIC8qKlxuICAgKiBAdHlwZSB7b2JqZWN0PX1cbiAgICogQGRlc2NyaXB0aW9uIEFkZGl0aW9uYWwgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGVycm9yLCBzdWNoIGFzIGFuIHVuZGVybHlpbmcgbmV0d29yayBlcnJvciByZXNwb25zZS5cbiAgICovXG4gIHRoaXMuZGV0YWlscyA9IG9wdGlvbnMuZGV0YWlscztcbn1cblxuU2VhbWxlc3NwYXlFcnJvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSk7XG5TZWFtbGVzc3BheUVycm9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFNlYW1sZXNzcGF5RXJyb3I7XG5cbi8qKlxuICogRW51bSBmb3Ige0BsaW5rIFNlYW1sZXNzcGF5RXJyb3J9IHR5cGVzLlxuICogQG5hbWUgU2VhbWxlc3NwYXlFcnJvci50eXBlc1xuICogQGVudW1cbiAqIEByZWFkb25seVxuICogQG1lbWJlcm9mIFNlYW1sZXNzcGF5RXJyb3JcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBDVVNUT01FUiBBbiBlcnJvciBjYXVzZWQgYnkgdGhlIGN1c3RvbWVyLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IE1FUkNIQU5UIEFuIGVycm9yIHRoYXQgaXMgYWN0aW9uYWJsZSBieSB0aGUgbWVyY2hhbnQuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gTkVUV09SSyBBbiBlcnJvciBkdWUgdG8gYSBuZXR3b3JrIHByb2JsZW0uXG4gKiBAcHJvcGVydHkge3N0cmluZ30gSU5URVJOQUwgQW4gZXJyb3IgY2F1c2VkIGJ5IFNlYW1sZXNzcGF5IGNvZGUuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gVU5LTk9XTiBBbiBlcnJvciB3aGVyZSB0aGUgb3JpZ2luIGlzIHVua25vd24uXG4gKi9cblNlYW1sZXNzcGF5RXJyb3IudHlwZXMgPSBlbnVtZXJhdGUoW1xuICAnQ1VTVE9NRVInLFxuICAnTUVSQ0hBTlQnLFxuICAnTkVUV09SSycsXG4gICdJTlRFUk5BTCcsXG4gICdVTktOT1dOJ1xuXSk7XG5cbm1vZHVsZS5leHBvcnRzID0gU2VhbWxlc3NwYXlFcnJvcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gdXVpZCgpIHtcbiAgcmV0dXJuICd4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHgnLnJlcGxhY2UoL1t4eV0vZywgZnVuY3Rpb24gKGMpIHtcbiAgICB2YXIgciA9IE1hdGgucmFuZG9tKCkgKiAxNiB8IDA7XG4gICAgdmFyIHYgPSBjID09PSAneCcgPyByIDogciAmIDB4MyB8IDB4ODtcblxuICAgIHJldHVybiB2LnRvU3RyaW5nKDE2KTtcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdXVpZDtcbiJdfQ==
