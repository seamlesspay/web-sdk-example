(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.seamlesspay || (g.seamlesspay = {})).checkoutButton = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(_dereq_,module,exports){
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
var Client = _dereq_('../../client/client');
var Bus = _dereq_('../../lib/bus');
var SeamlesspayError = _dereq_('../../lib/seamlesspay-error');
var constants = _dereq_('../shared/constants');
var assembleIFrames = _dereq_('../../lib/assemble-iframes');

var events = constants.events;
var defaultStyle = constants.DEFAULT_STYLE;
var defaultButtonText = constants.BUTTON_TEXT;

function initialize(configuration) {
  var checkoutUrl = configuration.client.gatewayConfiguration.checkoutUrl;
  var formPath = configuration.formPath;
  var styles = configuration.styles;
  var buttonText = configuration.text || defaultButtonText;
  var amount = configuration.amount;
  var meta = configuration.meta;

  var button = document.createElement('button');
  button.innerHTML = '<span>' + buttonText + '</span>';
  button.onclick = function() {
    var width = window.screen.width / 2 - 400;
    var height = window.screen.height / 2 - 400;
    var client = new Client(configuration.client);

    return client.request({
      api: 'seamlesspayApi',
      method: 'post',
      endpoint: 'checkout-sessions',
      publishable: false,
      data: {
        amount: amount,
        meta: meta
      }
    })
    .catch(function (error) {
      throw new SeamlesspayError(error);
    })
    .then(function(session) {
      window.open(
        checkoutUrl + '/' + formPath + '/' + session.id,
        '_blank',
        'toolbar=yes,top=' + height + ',left=' + width + ',screenX=' + width + ',screenY=' + height + ',width=800,height=800'
      );
    });
  };

  Object.keys(Object.assign(defaultStyle, styles))
    .forEach(function(key) {
      button.style[key] = defaultStyle[key];
    });

  document.body.appendChild(button);
}

function create() {
  var componentId = location.hash.slice(1, location.hash.length);

  var bus = new Bus({ channel: componentId });
  bus.emit(events.FRAME_READY, orchestrate);
}

function orchestrate(configuration) {
  var iframes = assembleIFrames.assembleIFrames(window.parent);

  iframes.forEach(function (iframe) {
    iframe.seamlesspay.checkoutButton.initialize(configuration);
  });

}


module.exports = {
  initialize: initialize,
  create: create
};

},{"../../client/client":4,"../../lib/assemble-iframes":15,"../../lib/bus":19,"../../lib/seamlesspay-error":28,"../shared/constants":3}],3:[function(_dereq_,module,exports){
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


},{"../../lib/enumerate":22}],4:[function(_dereq_,module,exports){
'use strict';

var request = _dereq_('./request');
var isWhitelistedDomain = _dereq_('../lib/is-whitelisted-domain');
var SeamlesspayError = _dereq_('../lib/seamlesspay-error');
var convertToSeamlesspayError = _dereq_('../lib/convert-to-seamlesspay-error');
var addMetadata = _dereq_('../lib/add-metadata');
var Promise = _dereq_('../lib/promise');
var assign = _dereq_('../lib/assign').assign;
var constants = _dereq_('./constants');
var errors = _dereq_('./errors');
var sharedErrors = _dereq_('../lib/errors');
var VERSION = _dereq_('../lib/constants').VERSION;

/**
 * This object is returned by {@link Client#getConfiguration|getConfiguration}. This information is used extensively by other Seamlesspay modules to properly configure themselves.
 * @typedef {object} Client~configuration
 * @property {object} client The seamlesspay-web/client parameters.
 * @property {string} client.authorization A tokenizationKey or clientToken.
 * @property {object} gatewayConfiguration Gateway-supplied configuration.
 * @property {object} analyticsMetadata Analytics-specific data.
 * @property {string} analyticsMetadata.sessionId Uniquely identifies a browsing session.
 * @property {string} analyticsMetadata.sdkVersion The seamlesspay.js version.
 * @property {string} analyticsMetadata.merchantAppId Identifies the merchant's web app.
 * @property {string} proxyAccountId Identifies the Sub Merchant Account ID.
 */

/**
 * @class
 * @param {Client~configuration} configuration Options
 * @description <strong>Do not use this constructor directly. Use {@link module:seamlesspay-web/client.create|seamlesspay.client.create} instead.</strong>
 * @classdesc This class is required by many other Seamlesspay components. It serves as the base API layer that communicates with our servers. It is also capable of being used to formulate direct calls to our servers, such as direct credit card tokenization. See {@link Client#request}.
 */
function Client(configuration) {
  var
    configurationJSON,
    gatewayConfiguration,
    seamlesspayApiConfiguration;

  configuration = configuration || {};

  configurationJSON = JSON.stringify(configuration);
  gatewayConfiguration = configuration.gatewayConfiguration;

  if (!gatewayConfiguration) {
    throw new SeamlesspayError(errors.CLIENT_MISSING_GATEWAY_CONFIGURATION);
  }
  [
    'assetsUrl',
    'clientApiUrl',
    'tokenizerApi'
  ].forEach(function (property) {
    var configUrl = (gatewayConfiguration[property] && gatewayConfiguration[property].url) || gatewayConfiguration[property];
    if (property in gatewayConfiguration && !isWhitelistedDomain(configUrl)) {
      throw new SeamlesspayError({
        type: errors.CLIENT_GATEWAY_CONFIGURATION_INVALID_DOMAIN.type,
        code: errors.CLIENT_GATEWAY_CONFIGURATION_INVALID_DOMAIN.code,
        message: property + ' property is on an invalid domain. (' + configUrl + ')'
      });
    }
  });

  /**
   * Returns a copy of the configuration values.
   * @public
   * @returns {Client~configuration} configuration
   */
  this.getConfiguration = function () {
    return JSON.parse(configurationJSON);
  };

  this._request = request;

  this._configuration = this.getConfiguration();

  this._clientApiBaseUrl = gatewayConfiguration.clientApiUrl + '/';
  this._tokenizerApi = gatewayConfiguration.tokenizerApi;

  seamlesspayApiConfiguration = gatewayConfiguration.seamlesspayApi;
  if (seamlesspayApiConfiguration) {
    this._seamlesspayApi = {
      baseUrl: seamlesspayApiConfiguration.url + '/',
      accessToken: seamlesspayApiConfiguration.accessToken,
      publishableToken: seamlesspayApiConfiguration.publishableToken
    };
    if (!isWhitelistedDomain(this._seamlesspayApi.baseUrl)) {
      throw new SeamlesspayError({
        type: errors.CLIENT_GATEWAY_CONFIGURATION_INVALID_DOMAIN.type,
        code: errors.CLIENT_GATEWAY_CONFIGURATION_INVALID_DOMAIN.code,
        message: 'seamlesspayApi URL is on an invalid domain.'
      });
    }
  }
}

/**
 * Used by other modules to formulate all network requests to the Seamlesspay gateway. It is also capable of being used directly from your own form to tokenize credit card information. However, be sure to satisfy PCI compliance if you use direct card tokenization.
 * @public
 * @function
 * @param {object} options Request options:
 * @param {string} options.method HTTP method, e.g. "get" or "post".
 * @param {string} options.endpoint Endpoint path, e.g. "payment_methods".
 * @param {object} options.data Data to send with the request.
 * @param {number} [options.timeout=60000] Set a timeout (in milliseconds) for the request.
 * @param {callback} [callback] The second argument, <code>data</code>, is the returned server data.
 * @example
 * <caption>Direct Credit Card Tokenization</caption>
 * var createClient = require('seamlesspay-web/client').create;
 *
 * createClient({
 *   environment: 'sandbox'
 *   authorization: CLIENT_AUTHORIZATION
 * }, function (createErr, clientInstance) {
 *   var form = document.getElementById('my-form-id');
 *   var data = {
 *     creditCard: {
 *       number: form['cc-number'].value,
 *       cvv: form['cc-cvv'].value,
 *       expDate: form['cc-date'].value,
 *       billingAddress: {
 *         postalCode: form['cc-postal'].value
 *       },
 *       options: {
 *         validate: false
 *       }
 *     }
 *   };
 *
 *   // Warning: For a merchant to be eligible for the easiest level of PCI compliance (SAQ A),
 *   // payment fields cannot be hosted on your checkout page.
 *   // For an alternative to the following, use Hosted Fields.
 *   clientInstance.request({
 *     endpoint: 'payment_methods/credit_cards',
 *     method: 'post',
 *     data: data
 *   }, function (requestErr, response) {
 *     // More detailed example of handling API errors: https://codepen.io/seamlesspay/pen/MbwjdM
 *     if (requestErr) { throw new Error(requestErr); }
 *
 *     console.log('Got nonce:', response.creditCards[0].nonce);
 *   });
 * });
 * @returns {Promise|void} Returns a promise that resolves with the request response if no callback is provided.
 */
Client.prototype.request = function (options, callback) {
  var self = this; // eslint-disable-line no-invalid-this

  var requestPromise = new Promise(function (resolve, reject) {
    var optionName,
      api,
      requestOptions,
      apiConfig,
      proxyAccountId,
      publishable = options.publishable;

    if (!options.method) {
      optionName = 'options.method';
    } else if (!options.endpoint) {
      optionName = 'options.endpoint';
    }

    if (optionName) {
      throw new SeamlesspayError({
        type: errors.CLIENT_OPTION_REQUIRED.type,
        code: errors.CLIENT_OPTION_REQUIRED.code,
        message: optionName + ' is required when making a request.'
      });
    }

    if ('api' in options) {
      api = options.api;
    } else {
      api = 'clientApi';
    }

    requestOptions = {
      method: options.method,
      timeout: options.timeout
    };

    var commonHeader = {
      'API-Version': constants.SEAMLESSPAY_API_VERSION_HEADER,
      'SDK-Version': VERSION
    };

    proxyAccountId = self.getConfiguration().gatewayConfiguration.proxyAccountId;

    if (api === 'tokenizerApi') {
      requestOptions.url = self._tokenizerApi.url + '/' + options.endpoint;
      requestOptions.data = options.data;
      requestOptions.headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + self._tokenizerApi.accessToken
      };
      if (proxyAccountId) {
        requestOptions.headers['SeamlessPay-Account'] = proxyAccountId;
      }
    } else if (api === 'transactionApi') {
      apiConfig = self.getConfiguration().gatewayConfiguration.transactionApi;
      requestOptions.url = apiConfig.isSeamlesspay ? apiConfig.url + '/' + options.endpoint : apiConfig.url;
      requestOptions.data = options.data;
      requestOptions.headers = {};
      if (apiConfig.accessToken) {
        requestOptions.headers['Authorization'] = 'Bearer ' + apiConfig.accessToken;
      }
      if (proxyAccountId) {
        requestOptions.headers['SeamlessPay-Account'] = proxyAccountId;
      }
    } else if (api === 'checkoutApi') {
      apiConfig = self.getConfiguration().gatewayConfiguration.transactionApi;
      requestOptions.url = apiConfig.url + '/' + options.endpoint;
      requestOptions.data = options.data;
      requestOptions.headers = {};
      if (apiConfig.accessToken) {
        requestOptions.headers['Authorization'] = 'Bearer ' + apiConfig.accessToken;
      }
    } else if (api === 'clientApi') {
      requestOptions.url = self._clientApiBaseUrl + options.endpoint;
      requestOptions.data = addMetadata(self._configuration, options.data);
    } else if (api === 'seamlesspayApi') {
      if (!self._seamlesspayApi) {
        throw new SeamlesspayError(sharedErrors.SEAMLESSPAY_API_ACCESS_RESTRICTED);
      }
      requestOptions.url = self._seamlesspayApi.baseUrl + options.endpoint;
      requestOptions.data = options.data;
      requestOptions.headers = {
        Authorization: 'Bearer ' + (publishable ? self._seamlesspayApi.publishableToken : self._seamlesspayApi.accessToken)
      };
    } else if (api === 'digitalWalletApi') {
      if (!self._seamlesspayApi) {
        throw new SeamlesspayError(sharedErrors.SEAMLESSPAY_API_ACCESS_RESTRICTED);
      }
      requestOptions.url = self._seamlesspayApi.baseUrl + options.endpoint;
      requestOptions.data = options.data;
      requestOptions.headers = {
        Authorization: 'Bearer ' + options.data.token
      };
    } else {
      throw new SeamlesspayError({
        type: errors.CLIENT_OPTION_INVALID.type,
        code: errors.CLIENT_OPTION_INVALID.code,
        message: 'options.api is invalid.'
      });
    }

    requestOptions.headers = assign({}, requestOptions.headers, commonHeader);

    self._request(requestOptions, function (err, data, status) {
      var resolvedData;
      var requestError = formatRequestError(status, err);

      if (requestError) {
        reject(requestError);
        return;
      }

      resolvedData = Array.isArray(data) && { data: data, _httpStatus: status } ||
        assign({ _httpStatus: status }, data);

      resolve(resolvedData);
    });
  });

  if (typeof callback === 'function') {
    requestPromise.then(function (response) {
      callback(null, response, response._httpStatus);
    }).catch(function (err) {
      var status = err && err.details && err.details.httpStatus;
      callback(err, null, status);
    });
    return;
  }

  return requestPromise; // eslint-disable-line consistent-return
};

function formatRequestError(status, err) { // eslint-disable-line consistent-return
  var requestError;

  if (status === -1) {
    requestError = new SeamlesspayError(errors.CLIENT_REQUEST_TIMEOUT);
  } else if (status === 403) {
    requestError = new SeamlesspayError(errors.CLIENT_AUTHORIZATION_INSUFFICIENT);
  } else if (status === 429) {
    requestError = new SeamlesspayError(errors.CLIENT_RATE_LIMITED);
  } else if (status >= 500) {
    requestError = new SeamlesspayError(errors.CLIENT_GATEWAY_NETWORK);
  } else if (status < 200 || status >= 400) {
    requestError = convertToSeamlesspayError(err, {
      type: errors.CLIENT_REQUEST_ERROR.type,
      code: errors.CLIENT_REQUEST_ERROR.code,
      message: errors.CLIENT_REQUEST_ERROR.message
    });
  }

  if (requestError) {
    requestError.details = requestError.details || {};
    requestError.details.httpStatus = status;

    return requestError;
  }
}

Client.prototype.toJSON = function () {
  return this.getConfiguration();
};

/**
 * Returns the Client version.
 * @public
 * @returns {String} The created client's version.
 * @example
 * var createClient = require('braintree-web/client').create;
 *
 * createClient({
 *   authorization: CLIENT_AUTHORIZATION
 * }, function (createErr, clientInstance) {
 *   console.log(clientInstance.getVersion()); // Ex: 1.0.0
 * });
 * @returns {void}
 */
Client.prototype.getVersion = function () {
  return VERSION;
};

module.exports = Client;

},{"../lib/add-metadata":14,"../lib/assign":16,"../lib/constants":20,"../lib/convert-to-seamlesspay-error":21,"../lib/errors":23,"../lib/is-whitelisted-domain":24,"../lib/promise":26,"../lib/seamlesspay-error":28,"./constants":5,"./errors":6,"./request":9}],5:[function(_dereq_,module,exports){
'use strict';

module.exports = {
  SEAMLESSPAY_API_VERSION_HEADER: 'v2020'
};

},{}],6:[function(_dereq_,module,exports){
'use strict';

var SeamlesspayError = _dereq_('../lib/seamlesspay-error');

module.exports = {
  CLIENT_GATEWAY_CONFIGURATION_INVALID_DOMAIN: {
    type: SeamlesspayError.types.MERCHANT,
    code: 'CLIENT_GATEWAY_CONFIGURATION_INVALID_DOMAIN'
  },
  CLIENT_OPTION_REQUIRED: {
    type: SeamlesspayError.types.MERCHANT,
    code: 'CLIENT_OPTION_REQUIRED'
  },
  CLIENT_OPTION_INVALID: {
    type: SeamlesspayError.types.MERCHANT,
    code: 'CLIENT_OPTION_INVALID'
  },
  CLIENT_MISSING_GATEWAY_CONFIGURATION: {
    type: SeamlesspayError.types.INTERNAL,
    code: 'CLIENT_MISSING_GATEWAY_CONFIGURATION',
    message: 'Missing gatewayConfiguration.'
  },
  CLIENT_INVALID_AUTHORIZATION: {
    type: SeamlesspayError.types.MERCHANT,
    code: 'CLIENT_INVALID_AUTHORIZATION',
    message: 'Authorization is invalid. Make sure your client token or tokenization key is valid.'
  },
  CLIENT_GATEWAY_NETWORK: {
    type: SeamlesspayError.types.NETWORK,
    code: 'CLIENT_GATEWAY_NETWORK',
    message: 'Cannot contact the gateway at this time.'
  },
  CLIENT_REQUEST_TIMEOUT: {
    type: SeamlesspayError.types.NETWORK,
    code: 'CLIENT_REQUEST_TIMEOUT',
    message: 'Request timed out waiting for a reply.'
  },
  CLIENT_REQUEST_ERROR: {
    type: SeamlesspayError.types.NETWORK,
    code: 'CLIENT_REQUEST_ERROR',
    message: 'There was a problem with your request.'
  },
  CLIENT_RATE_LIMITED: {
    type: SeamlesspayError.types.MERCHANT,
    code: 'CLIENT_RATE_LIMITED',
    message: 'You are being rate-limited; please try again in a few minutes.'
  },
  CLIENT_AUTHORIZATION_INSUFFICIENT: {
    type: SeamlesspayError.types.MERCHANT,
    code: 'CLIENT_AUTHORIZATION_INSUFFICIENT',
    message: 'The authorization used has insufficient privileges.'
  }
};

},{"../lib/seamlesspay-error":28}],7:[function(_dereq_,module,exports){
(function (global){(function (){
'use strict';

var querystring = _dereq_('../../lib/querystring');
var assign = _dereq_('../../lib/assign').assign;
var prepBody = _dereq_('./prep-body');
var parseBody = _dereq_('./parse-body');
var isXHRAvailable = global.XMLHttpRequest && 'withCredentials' in new global.XMLHttpRequest();

function getRequestObject() {
  return isXHRAvailable ? new XMLHttpRequest() : new XDomainRequest();
}

function request(options, cb) {
  var status, resBody;
  var method = options.method;
  var url = options.url;
  var body = options.data;
  var timeout = options.timeout;
  var headers = assign({
    'Content-Type': 'application/json'
  }, options.headers);
  var req = getRequestObject();
  var callback = cb;

  if (method === 'GET') {
    url = querystring.queryify(url, body);
    body = null;
  }

  if (isXHRAvailable) {
    req.onreadystatechange = function () {
      if (req.readyState !== 4) { return; }

      status = req.status;
      resBody = parseBody(req.responseText);

      if (status >= 400 || status < 200) {
        callback(resBody || 'error', null, status || 500);
      } else {
        callback(null, resBody, status);
      }
    };
  } else {
    if (options.headers) {
      url = querystring.queryify(url, headers);
    }

    req.onload = function () {
      callback(null, parseBody(req.responseText), req.status);
    };

    req.onerror = function () {
      // XDomainRequest does not report a body or status for errors, so
      // hardcode to 'error' and 500, respectively
      callback('error', null, 500);
    };

    // This must remain for IE9 to work
    req.onprogress = function () {};

    req.ontimeout = function () {
      callback('timeout', null, -1);
    };
  }

  req.open(method, url, true);
  req.timeout = timeout;

  if (isXHRAvailable) {
    Object.keys(headers).forEach(function (headerKey) {
      req.setRequestHeader(headerKey, headers[headerKey]);
    });
  }

  try {
    req.send(prepBody(method, body));
  } catch (e) { /* ignored */ }
}

module.exports = {
  request: request
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../lib/assign":16,"../../lib/querystring":27,"./parse-body":12,"./prep-body":13}],8:[function(_dereq_,module,exports){
(function (global){(function (){
'use strict';

module.exports = function getUserAgent() {
  return global.navigator.userAgent;
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],9:[function(_dereq_,module,exports){
'use strict';

var ajaxIsAvaliable;
var once = _dereq_('../../lib/once');
var JSONPDriver = _dereq_('./jsonp-driver');
var AJAXDriver = _dereq_('./ajax-driver');
var getUserAgent = _dereq_('./get-user-agent');
var isHTTP = _dereq_('./is-http');

function isAjaxAvailable() {
  if (ajaxIsAvaliable == null) {
    ajaxIsAvaliable = !(isHTTP() && /MSIE\s(8|9)/.test(getUserAgent()));
  }

  return ajaxIsAvaliable;
}

module.exports = function (options, cb) {
  cb = once(cb || Function.prototype);
  options.method = (options.method || 'GET').toUpperCase();
  options.timeout = options.timeout == null ? 60000 : options.timeout;
  options.data = options.data || {};

  if (isAjaxAvailable()) {
    AJAXDriver.request(options, cb);
  } else {
    JSONPDriver.request(options, cb);
  }
};

},{"../../lib/once":25,"./ajax-driver":7,"./get-user-agent":8,"./is-http":10,"./jsonp-driver":11}],10:[function(_dereq_,module,exports){
(function (global){(function (){
'use strict';

module.exports = function () {
  return global.location.protocol === 'http:';
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],11:[function(_dereq_,module,exports){
(function (global){(function (){
'use strict';

var head;
var uuid = _dereq_('../../lib/uuid');
var querystring = _dereq_('../../lib/querystring');
var timeouts = {};

function _removeScript(script) {
  if (script && script.parentNode) {
    script.parentNode.removeChild(script);
  }
}

function _createScriptTag(url, callbackName) {
  var script = document.createElement('script');
  var done = false;

  script.src = url;
  script.async = true;
  script.onerror = function () {
    global[callbackName]({message: 'error', status: 500});
  };

  script.onload = script.onreadystatechange = function () {
    if (done) { return; }

    if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
      done = true;
      script.onload = script.onreadystatechange = null;
    }
  };

  return script;
}

function _cleanupGlobal(callbackName) {
  try {
    delete global[callbackName];
  } catch (_) {
    global[callbackName] = null;
  }
}

function _setupTimeout(timeout, callbackName) {
  timeouts[callbackName] = setTimeout(function () {
    timeouts[callbackName] = null;

    global[callbackName]({
      error: 'timeout',
      status: -1
    });

    global[callbackName] = function () {
      _cleanupGlobal(callbackName);
    };
  }, timeout);
}

function _setupGlobalCallback(script, callback, callbackName) {
  global[callbackName] = function (response) {
    var status = response.status || 500;
    var err = null;
    var data = null;

    delete response.status;

    if (status >= 400 || status < 200) {
      err = response;
    } else {
      data = response;
    }

    _cleanupGlobal(callbackName);
    _removeScript(script);

    clearTimeout(timeouts[callbackName]);
    callback(err, data, status);
  };
}

function request(options, callback) {
  var script;
  var callbackName = 'callback_json_' + uuid().replace(/-/g, '');
  var url = options.url;
  var attrs = options.data;
  var method = options.method;
  var timeout = options.timeout;

  url = querystring.queryify(url, attrs);
  url = querystring.queryify(url, {
    _method: method,
    callback: callbackName
  });

  script = _createScriptTag(url, callbackName);
  _setupGlobalCallback(script, callback, callbackName);
  _setupTimeout(timeout, callbackName);

  if (!head) {
    head = document.getElementsByTagName('head')[0];
  }

  head.appendChild(script);
}

module.exports = {
  request: request
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../lib/querystring":27,"../../lib/uuid":29}],12:[function(_dereq_,module,exports){
'use strict';

module.exports = function (body) {
  try {
    body = JSON.parse(body);
  } catch (e) { /* ignored */ }

  return body;
};

},{}],13:[function(_dereq_,module,exports){
'use strict';

module.exports = function (method, body) {
  if (String(method).toLowerCase() !== 'get' && body != null) {
    body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  return body;
};

},{}],14:[function(_dereq_,module,exports){
'use strict';

function addMetadata(configuration, data) {
  if (configuration.metadata) {
    if (data) {
      data.metadata = configuration.metadata;
    } else {
      data = {
        metadata: configuration.metadata
      }
    }
  }
  return data
}

module.exports = addMetadata;

},{}],15:[function(_dereq_,module,exports){
'use strict';

function assembleIFrames(win) {
  var i, frame;
  var frames = [];

  for (i = 0; i < win.frames.length; i++) {
    frame = win.frames[i];

    try {
      if (frame.location.href === window.location.href) {
        frames.push(frame);
      }
    } catch (e) { /* ignored */ }
  }

  return frames;
}

module.exports = {
  assembleIFrames: assembleIFrames
};

},{}],16:[function(_dereq_,module,exports){
'use strict';

var assignNormalized = typeof Object.assign === 'function' ? Object.assign : assignPolyfill;

function assignPolyfill(destination) {
  var i, source, key;

  for (i = 1; i < arguments.length; i++) {
    source = arguments[i];
    for (key in source) {
      if (source.hasOwnProperty(key)) {
        destination[key] = source[key];
      }
    }
  }

  return destination;
}

module.exports = {
  assign: assignNormalized,
  _assign: assignPolyfill
};

},{}],17:[function(_dereq_,module,exports){
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

},{"../enumerate":22}],19:[function(_dereq_,module,exports){
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

},{"../seamlesspay-error":28,"./check-origin":17,"./events":18,"framebus":1}],20:[function(_dereq_,module,exports){
'use strict';

module.exports = {
  VERSION: "web-sdk",
  ASSETS_HOST: "https://web-sdk-examples.seamlesspay.dev",
  ASSETS_S3_BUCKET: "web-sdk.seamlesspay.com",
  API_URL_PRODUCTION: "https://api.seamlesspay.com",
  API_URL_SANDBOX: "https://api.sandbox.seamlesspay.com",
  API_URL_STAGING: "https://api.seamlesspay.dev",
  PAN_VAULT_URL_PRODUCTION: "https://pan-vault.seamlesspay.com",
  PAN_VAULT_URL_SANDBOX: "https://pan-vault.sandbox.seamlesspay.com",
  PAN_VAULT_URL_STAGING: "https://pan-vault.seamlesspay.dev",
};

},{}],21:[function(_dereq_,module,exports){
'use strict';

var SeamlesspayError = _dereq_('./seamlesspay-error');

function convertToSeamlesspayError(originalErr, otherErrorObject) {
  if (originalErr instanceof SeamlesspayError || (originalErr && originalErr.name === 'SeamlesspayError')) {
    return originalErr;
  }

  return new SeamlesspayError({
    type: otherErrorObject.type,
    code: otherErrorObject.code,
    message: otherErrorObject.message,
    details: {
      originalError: originalErr
    }
  });
}

module.exports = convertToSeamlesspayError;

},{"./seamlesspay-error":28}],22:[function(_dereq_,module,exports){
'use strict';

function enumerate(values, prefix) {
  prefix = prefix == null ? '' : prefix;

  return values.reduce(function (enumeration, value) {
    enumeration[value] = prefix + value;
    return enumeration;
  }, {});
}

module.exports = enumerate;

},{}],23:[function(_dereq_,module,exports){
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

},{"./seamlesspay-error":28}],24:[function(_dereq_,module,exports){
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

},{}],26:[function(_dereq_,module,exports){
(function (global){(function (){
'use strict';

var Promise = global.Promise;

module.exports = Promise;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],27:[function(_dereq_,module,exports){
(function (global){(function (){
'use strict';

function _notEmpty(obj) {
  var key;

  for (key in obj) {
    if (obj.hasOwnProperty(key)) { return true; }
  }

  return false;
}

function _isArray(value) {
  return value && typeof value === 'object' && typeof value.length === 'number' &&
    Object.prototype.toString.call(value) === '[object Array]' || false;
}

function parse(url) {
  var query, params;

  url = url || global.location.href;

  if (!/\?/.test(url)) {
    return {};
  }

  query = url.replace(/#.*$/, '').replace(/^.*\?/, '').split('&');

  params = query.reduce(function (toReturn, keyValue) {
    var parts = keyValue.split('=');
    var key = decodeURIComponent(parts[0]);
    var value = decodeURIComponent(parts[1]);

    toReturn[key] = value;
    return toReturn;
  }, {});

  return params;
}

function stringify(params, namespace) {
  var k, v, p;
  var query = [];

  for (p in params) {
    if (!params.hasOwnProperty(p)) {
      continue;
    }

    v = params[p];

    if (namespace) {
      if (_isArray(params)) {
        k = namespace + '[]';
      } else {
        k = namespace + '[' + p + ']';
      }
    } else {
      k = p;
    }
    if (typeof v === 'object') {
      query.push(stringify(v, k));
    } else {
      query.push(encodeURIComponent(k) + '=' + encodeURIComponent(v));
    }
  }

  return query.join('&');
}

function queryify(url, params) {
  url = url || '';

  if (params != null && typeof params === 'object' && _notEmpty(params)) {
    url += url.indexOf('?') === -1 ? '?' : '';
    url += url.indexOf('=') !== -1 ? '&' : '';
    url += stringify(params);
  }

  return url;
}

module.exports = {
  parse: parse,
  stringify: stringify,
  queryify: queryify
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],28:[function(_dereq_,module,exports){
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

},{"./enumerate":22}],29:[function(_dereq_,module,exports){
'use strict';

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : r & 0x3 | 0x8;

    return v.toString(16);
  });
}

module.exports = uuid;

},{}]},{},[2])(2)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZnJhbWVidXMvbGliL2ZyYW1lYnVzLmpzIiwic3JjL2NoZWNrb3V0LWJ1dHRvbi9pbnRlcm5hbC9pbmRleC5qcyIsInNyYy9jaGVja291dC1idXR0b24vc2hhcmVkL2NvbnN0YW50cy5qcyIsInNyYy9jbGllbnQvY2xpZW50LmpzIiwic3JjL2NsaWVudC9jb25zdGFudHMuanMiLCJzcmMvY2xpZW50L2Vycm9ycy5qcyIsInNyYy9jbGllbnQvcmVxdWVzdC9hamF4LWRyaXZlci5qcyIsInNyYy9jbGllbnQvcmVxdWVzdC9nZXQtdXNlci1hZ2VudC5qcyIsInNyYy9jbGllbnQvcmVxdWVzdC9pbmRleC5qcyIsInNyYy9jbGllbnQvcmVxdWVzdC9pcy1odHRwLmpzIiwic3JjL2NsaWVudC9yZXF1ZXN0L2pzb25wLWRyaXZlci5qcyIsInNyYy9jbGllbnQvcmVxdWVzdC9wYXJzZS1ib2R5LmpzIiwic3JjL2NsaWVudC9yZXF1ZXN0L3ByZXAtYm9keS5qcyIsInNyYy9saWIvYWRkLW1ldGFkYXRhLmpzIiwic3JjL2xpYi9hc3NlbWJsZS1pZnJhbWVzLmpzIiwic3JjL2xpYi9hc3NpZ24uanMiLCJzcmMvbGliL2J1cy9jaGVjay1vcmlnaW4uanMiLCJzcmMvbGliL2J1cy9ldmVudHMuanMiLCJzcmMvbGliL2J1cy9pbmRleC5qcyIsInNyYy9saWIvY29uc3RhbnRzLmpzIiwic3JjL2xpYi9jb252ZXJ0LXRvLXNlYW1sZXNzcGF5LWVycm9yLmpzIiwic3JjL2xpYi9lbnVtZXJhdGUuanMiLCJzcmMvbGliL2Vycm9ycy5qcyIsInNyYy9saWIvaXMtd2hpdGVsaXN0ZWQtZG9tYWluLmpzIiwic3JjL2xpYi9vbmNlLmpzIiwic3JjL2xpYi9wcm9taXNlLmpzIiwic3JjL2xpYi9xdWVyeXN0cmluZy5qcyIsInNyYy9saWIvc2VhbWxlc3NwYXktZXJyb3IuanMiLCJzcmMvbGliL3V1aWQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3RUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdFVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM1R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN2RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgd2luLCBmcmFtZWJ1cztcbnZhciBwb3B1cHMgPSBbXTtcbnZhciBzdWJzY3JpYmVycyA9IHt9O1xudmFyIHByZWZpeCA9ICcvKmZyYW1lYnVzKi8nO1xuXG5mdW5jdGlvbiBpbmNsdWRlKHBvcHVwKSB7XG4gIGlmIChwb3B1cCA9PSBudWxsKSB7IHJldHVybiBmYWxzZTsgfVxuICBpZiAocG9wdXAuV2luZG93ID09IG51bGwpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIGlmIChwb3B1cC5jb25zdHJ1Y3RvciAhPT0gcG9wdXAuV2luZG93KSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIHBvcHVwcy5wdXNoKHBvcHVwKTtcbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIHRhcmdldChvcmlnaW4pIHtcbiAgdmFyIGtleTtcbiAgdmFyIHRhcmdldGVkRnJhbWVidXMgPSB7fTtcblxuICBmb3IgKGtleSBpbiBmcmFtZWJ1cykge1xuICAgIGlmICghZnJhbWVidXMuaGFzT3duUHJvcGVydHkoa2V5KSkgeyBjb250aW51ZTsgfVxuXG4gICAgdGFyZ2V0ZWRGcmFtZWJ1c1trZXldID0gZnJhbWVidXNba2V5XTtcbiAgfVxuXG4gIHRhcmdldGVkRnJhbWVidXMuX29yaWdpbiA9IG9yaWdpbiB8fCAnKic7XG5cbiAgcmV0dXJuIHRhcmdldGVkRnJhbWVidXM7XG59XG5cbmZ1bmN0aW9uIHB1Ymxpc2goZXZlbnQpIHtcbiAgdmFyIHBheWxvYWQsIGFyZ3M7XG4gIHZhciBvcmlnaW4gPSBfZ2V0T3JpZ2luKHRoaXMpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWludmFsaWQtdGhpc1xuXG4gIGlmIChfaXNudFN0cmluZyhldmVudCkpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIGlmIChfaXNudFN0cmluZyhvcmlnaW4pKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG4gIHBheWxvYWQgPSBfcGFja2FnZVBheWxvYWQoZXZlbnQsIGFyZ3MsIG9yaWdpbik7XG4gIGlmIChwYXlsb2FkID09PSBmYWxzZSkgeyByZXR1cm4gZmFsc2U7IH1cblxuICBfYnJvYWRjYXN0KHdpbi50b3AgfHwgd2luLnNlbGYsIHBheWxvYWQsIG9yaWdpbik7XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIHN1YnNjcmliZShldmVudCwgZm4pIHtcbiAgdmFyIG9yaWdpbiA9IF9nZXRPcmlnaW4odGhpcyk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8taW52YWxpZC10aGlzXG5cbiAgaWYgKF9zdWJzY3JpcHRpb25BcmdzSW52YWxpZChldmVudCwgZm4sIG9yaWdpbikpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgc3Vic2NyaWJlcnNbb3JpZ2luXSA9IHN1YnNjcmliZXJzW29yaWdpbl0gfHwge307XG4gIHN1YnNjcmliZXJzW29yaWdpbl1bZXZlbnRdID0gc3Vic2NyaWJlcnNbb3JpZ2luXVtldmVudF0gfHwgW107XG4gIHN1YnNjcmliZXJzW29yaWdpbl1bZXZlbnRdLnB1c2goZm4pO1xuXG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiB1bnN1YnNjcmliZShldmVudCwgZm4pIHtcbiAgdmFyIGksIHN1YnNjcmliZXJMaXN0O1xuICB2YXIgb3JpZ2luID0gX2dldE9yaWdpbih0aGlzKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1pbnZhbGlkLXRoaXNcblxuICBpZiAoX3N1YnNjcmlwdGlvbkFyZ3NJbnZhbGlkKGV2ZW50LCBmbiwgb3JpZ2luKSkgeyByZXR1cm4gZmFsc2U7IH1cblxuICBzdWJzY3JpYmVyTGlzdCA9IHN1YnNjcmliZXJzW29yaWdpbl0gJiYgc3Vic2NyaWJlcnNbb3JpZ2luXVtldmVudF07XG4gIGlmICghc3Vic2NyaWJlckxpc3QpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgZm9yIChpID0gMDsgaSA8IHN1YnNjcmliZXJMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN1YnNjcmliZXJMaXN0W2ldID09PSBmbikge1xuICAgICAgc3Vic2NyaWJlckxpc3Quc3BsaWNlKGksIDEpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBfZ2V0T3JpZ2luKHNjb3BlKSB7XG4gIHJldHVybiBzY29wZSAmJiBzY29wZS5fb3JpZ2luIHx8ICcqJztcbn1cblxuZnVuY3Rpb24gX2lzbnRTdHJpbmcoc3RyaW5nKSB7XG4gIHJldHVybiB0eXBlb2Ygc3RyaW5nICE9PSAnc3RyaW5nJztcbn1cblxuZnVuY3Rpb24gX3BhY2thZ2VQYXlsb2FkKGV2ZW50LCBhcmdzLCBvcmlnaW4pIHtcbiAgdmFyIHBhY2thZ2VkID0gZmFsc2U7XG4gIHZhciBwYXlsb2FkID0ge1xuICAgIGV2ZW50OiBldmVudCxcbiAgICBvcmlnaW46IG9yaWdpblxuICB9O1xuICB2YXIgcmVwbHkgPSBhcmdzW2FyZ3MubGVuZ3RoIC0gMV07XG5cbiAgaWYgKHR5cGVvZiByZXBseSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHBheWxvYWQucmVwbHkgPSBfc3Vic2NyaWJlUmVwbGllcihyZXBseSwgb3JpZ2luKTtcbiAgICBhcmdzID0gYXJncy5zbGljZSgwLCAtMSk7XG4gIH1cblxuICBwYXlsb2FkLmFyZ3MgPSBhcmdzO1xuXG4gIHRyeSB7XG4gICAgcGFja2FnZWQgPSBwcmVmaXggKyBKU09OLnN0cmluZ2lmeShwYXlsb2FkKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignQ291bGQgbm90IHN0cmluZ2lmeSBldmVudDogJyArIGUubWVzc2FnZSk7XG4gIH1cbiAgcmV0dXJuIHBhY2thZ2VkO1xufVxuXG5mdW5jdGlvbiBfdW5wYWNrUGF5bG9hZChlKSB7XG4gIHZhciBwYXlsb2FkLCByZXBseU9yaWdpbiwgcmVwbHlTb3VyY2UsIHJlcGx5RXZlbnQ7XG5cbiAgaWYgKGUuZGF0YS5zbGljZSgwLCBwcmVmaXgubGVuZ3RoKSAhPT0gcHJlZml4KSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIHRyeSB7XG4gICAgcGF5bG9hZCA9IEpTT04ucGFyc2UoZS5kYXRhLnNsaWNlKHByZWZpeC5sZW5ndGgpKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKHBheWxvYWQucmVwbHkgIT0gbnVsbCkge1xuICAgIHJlcGx5T3JpZ2luID0gZS5vcmlnaW47XG4gICAgcmVwbHlTb3VyY2UgPSBlLnNvdXJjZTtcbiAgICByZXBseUV2ZW50ID0gcGF5bG9hZC5yZXBseTtcblxuICAgIHBheWxvYWQucmVwbHkgPSBmdW5jdGlvbiByZXBseShkYXRhKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgY29uc2lzdGVudC1yZXR1cm5cbiAgICAgIHZhciByZXBseVBheWxvYWQ7XG5cbiAgICAgIGlmICghcmVwbHlTb3VyY2UpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgICAgIHJlcGx5UGF5bG9hZCA9IF9wYWNrYWdlUGF5bG9hZChyZXBseUV2ZW50LCBbZGF0YV0sIHJlcGx5T3JpZ2luKTtcblxuICAgICAgaWYgKHJlcGx5UGF5bG9hZCA9PT0gZmFsc2UpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgICAgIHJlcGx5U291cmNlLnBvc3RNZXNzYWdlKHJlcGx5UGF5bG9hZCwgcmVwbHlPcmlnaW4pO1xuICAgIH07XG5cbiAgICBwYXlsb2FkLmFyZ3MucHVzaChwYXlsb2FkLnJlcGx5KTtcbiAgfVxuXG4gIHJldHVybiBwYXlsb2FkO1xufVxuXG5mdW5jdGlvbiBfYXR0YWNoKHcpIHtcbiAgaWYgKHdpbikgeyByZXR1cm47IH1cbiAgd2luID0gdyB8fCBnbG9iYWw7XG5cbiAgaWYgKHdpbi5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgd2luLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBfb25tZXNzYWdlLCBmYWxzZSk7XG4gIH0gZWxzZSBpZiAod2luLmF0dGFjaEV2ZW50KSB7XG4gICAgd2luLmF0dGFjaEV2ZW50KCdvbm1lc3NhZ2UnLCBfb25tZXNzYWdlKTtcbiAgfSBlbHNlIGlmICh3aW4ub25tZXNzYWdlID09PSBudWxsKSB7XG4gICAgd2luLm9ubWVzc2FnZSA9IF9vbm1lc3NhZ2U7XG4gIH0gZWxzZSB7XG4gICAgd2luID0gbnVsbDtcbiAgfVxufVxuXG4vLyByZW1vdmVJZihwcm9kdWN0aW9uKVxuZnVuY3Rpb24gX2RldGFjaCgpIHtcbiAgaWYgKHdpbiA9PSBudWxsKSB7IHJldHVybjsgfVxuXG4gIGlmICh3aW4ucmVtb3ZlRXZlbnRMaXN0ZW5lcikge1xuICAgIHdpbi5yZW1vdmVFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgX29ubWVzc2FnZSwgZmFsc2UpO1xuICB9IGVsc2UgaWYgKHdpbi5kZXRhY2hFdmVudCkge1xuICAgIHdpbi5kZXRhY2hFdmVudCgnb25tZXNzYWdlJywgX29ubWVzc2FnZSk7XG4gIH0gZWxzZSBpZiAod2luLm9ubWVzc2FnZSA9PT0gX29ubWVzc2FnZSkge1xuICAgIHdpbi5vbm1lc3NhZ2UgPSBudWxsO1xuICB9XG5cbiAgd2luID0gbnVsbDtcbiAgcG9wdXBzID0gW107XG4gIHN1YnNjcmliZXJzID0ge307XG59XG4vLyBlbmRSZW1vdmVJZihwcm9kdWN0aW9uKVxuXG5mdW5jdGlvbiBfdXVpZCgpIHtcbiAgcmV0dXJuICd4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHgnLnJlcGxhY2UoL1t4eV0vZywgZnVuY3Rpb24gKGMpIHtcbiAgICB2YXIgciA9IE1hdGgucmFuZG9tKCkgKiAxNiB8IDA7XG4gICAgdmFyIHYgPSBjID09PSAneCcgPyByIDogciAmIDB4MyB8IDB4ODtcblxuICAgIHJldHVybiB2LnRvU3RyaW5nKDE2KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIF9vbm1lc3NhZ2UoZSkge1xuICB2YXIgcGF5bG9hZDtcblxuICBpZiAoX2lzbnRTdHJpbmcoZS5kYXRhKSkgeyByZXR1cm47IH1cblxuICBwYXlsb2FkID0gX3VucGFja1BheWxvYWQoZSk7XG4gIGlmICghcGF5bG9hZCkgeyByZXR1cm47IH1cblxuICBfZGlzcGF0Y2goJyonLCBwYXlsb2FkLmV2ZW50LCBwYXlsb2FkLmFyZ3MsIGUpO1xuICBfZGlzcGF0Y2goZS5vcmlnaW4sIHBheWxvYWQuZXZlbnQsIHBheWxvYWQuYXJncywgZSk7XG4gIF9icm9hZGNhc3RQb3B1cHMoZS5kYXRhLCBwYXlsb2FkLm9yaWdpbiwgZS5zb3VyY2UpO1xufVxuXG5mdW5jdGlvbiBfZGlzcGF0Y2gob3JpZ2luLCBldmVudCwgYXJncywgZSkge1xuICB2YXIgaTtcblxuICBpZiAoIXN1YnNjcmliZXJzW29yaWdpbl0pIHsgcmV0dXJuOyB9XG4gIGlmICghc3Vic2NyaWJlcnNbb3JpZ2luXVtldmVudF0pIHsgcmV0dXJuOyB9XG5cbiAgZm9yIChpID0gMDsgaSA8IHN1YnNjcmliZXJzW29yaWdpbl1bZXZlbnRdLmxlbmd0aDsgaSsrKSB7XG4gICAgc3Vic2NyaWJlcnNbb3JpZ2luXVtldmVudF1baV0uYXBwbHkoZSwgYXJncyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2hhc09wZW5lcihmcmFtZSkge1xuICBpZiAoZnJhbWUudG9wICE9PSBmcmFtZSkgeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYgKGZyYW1lLm9wZW5lciA9PSBudWxsKSB7IHJldHVybiBmYWxzZTsgfVxuICBpZiAoZnJhbWUub3BlbmVyID09PSBmcmFtZSkgeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYgKGZyYW1lLm9wZW5lci5jbG9zZWQgPT09IHRydWUpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIF9icm9hZGNhc3QoZnJhbWUsIHBheWxvYWQsIG9yaWdpbikge1xuICB2YXIgaSA9IDA7XG4gIHZhciBmcmFtZVRvQnJvYWRjYXN0VG87XG5cbiAgdHJ5IHtcbiAgICBmcmFtZS5wb3N0TWVzc2FnZShwYXlsb2FkLCBvcmlnaW4pO1xuXG4gICAgaWYgKF9oYXNPcGVuZXIoZnJhbWUpKSB7XG4gICAgICBfYnJvYWRjYXN0KGZyYW1lLm9wZW5lci50b3AsIHBheWxvYWQsIG9yaWdpbik7XG4gICAgfVxuXG4gICAgLy8gcHJldmlvdXNseSwgb3VyIG1heCB2YWx1ZSB3YXMgZnJhbWUuZnJhbWVzLmxlbmd0aFxuICAgIC8vIGJ1dCBmcmFtZXMubGVuZ3RoIGluaGVyaXRzIGZyb20gd2luZG93Lmxlbmd0aFxuICAgIC8vIHdoaWNoIGNhbiBiZSBvdmVyd3JpdHRlbiBpZiBhIGRldmVsb3BlciBkb2VzXG4gICAgLy8gYHZhciBsZW5ndGggPSB2YWx1ZTtgIG91dHNpZGUgb2YgYSBmdW5jdGlvblxuICAgIC8vIHNjb3BlLCBpdCdsbCBwcmV2ZW50IHVzIGZyb20gbG9vcGluZyB0aHJvdWdoXG4gICAgLy8gYWxsIHRoZSBmcmFtZXMuIFdpdGggdGhpcywgd2UgbG9vcCB0aHJvdWdoXG4gICAgLy8gdW50aWwgdGhlcmUgYXJlIG5vIGxvbmdlciBhbnkgZnJhbWVzXG4gICAgd2hpbGUgKGZyYW1lVG9Ccm9hZGNhc3RUbyA9IGZyYW1lLmZyYW1lc1tpXSkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbmQtYXNzaWduXG4gICAgICBfYnJvYWRjYXN0KGZyYW1lVG9Ccm9hZGNhc3RUbywgcGF5bG9hZCwgb3JpZ2luKTtcbiAgICAgIGkrKztcbiAgICB9XG4gIH0gY2F0Y2ggKF8pIHsgLyogaWdub3JlZCAqLyB9XG59XG5cbmZ1bmN0aW9uIF9icm9hZGNhc3RQb3B1cHMocGF5bG9hZCwgb3JpZ2luLCBzb3VyY2UpIHtcbiAgdmFyIGksIHBvcHVwO1xuXG4gIGZvciAoaSA9IHBvcHVwcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIHBvcHVwID0gcG9wdXBzW2ldO1xuXG4gICAgaWYgKHBvcHVwLmNsb3NlZCA9PT0gdHJ1ZSkge1xuICAgICAgcG9wdXBzID0gcG9wdXBzLnNsaWNlKGksIDEpO1xuICAgIH0gZWxzZSBpZiAoc291cmNlICE9PSBwb3B1cCkge1xuICAgICAgX2Jyb2FkY2FzdChwb3B1cC50b3AsIHBheWxvYWQsIG9yaWdpbik7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIF9zdWJzY3JpYmVSZXBsaWVyKGZuLCBvcmlnaW4pIHtcbiAgdmFyIHV1aWQgPSBfdXVpZCgpO1xuXG4gIGZ1bmN0aW9uIHJlcGxpZXIoZCwgbykge1xuICAgIGZuKGQsIG8pO1xuICAgIGZyYW1lYnVzLnRhcmdldChvcmlnaW4pLnVuc3Vic2NyaWJlKHV1aWQsIHJlcGxpZXIpO1xuICB9XG5cbiAgZnJhbWVidXMudGFyZ2V0KG9yaWdpbikuc3Vic2NyaWJlKHV1aWQsIHJlcGxpZXIpO1xuICByZXR1cm4gdXVpZDtcbn1cblxuZnVuY3Rpb24gX3N1YnNjcmlwdGlvbkFyZ3NJbnZhbGlkKGV2ZW50LCBmbiwgb3JpZ2luKSB7XG4gIGlmIChfaXNudFN0cmluZyhldmVudCkpIHsgcmV0dXJuIHRydWU7IH1cbiAgaWYgKHR5cGVvZiBmbiAhPT0gJ2Z1bmN0aW9uJykgeyByZXR1cm4gdHJ1ZTsgfVxuICBpZiAoX2lzbnRTdHJpbmcob3JpZ2luKSkgeyByZXR1cm4gdHJ1ZTsgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuX2F0dGFjaCgpO1xuXG5mcmFtZWJ1cyA9IHtcbiAgdGFyZ2V0OiB0YXJnZXQsXG4gIC8vIHJlbW92ZUlmKHByb2R1Y3Rpb24pXG4gIF9wYWNrYWdlUGF5bG9hZDogX3BhY2thZ2VQYXlsb2FkLFxuICBfdW5wYWNrUGF5bG9hZDogX3VucGFja1BheWxvYWQsXG4gIF9hdHRhY2g6IF9hdHRhY2gsXG4gIF9kZXRhY2g6IF9kZXRhY2gsXG4gIF9kaXNwYXRjaDogX2Rpc3BhdGNoLFxuICBfYnJvYWRjYXN0OiBfYnJvYWRjYXN0LFxuICBfc3Vic2NyaWJlUmVwbGllcjogX3N1YnNjcmliZVJlcGxpZXIsXG4gIF9zdWJzY3JpcHRpb25BcmdzSW52YWxpZDogX3N1YnNjcmlwdGlvbkFyZ3NJbnZhbGlkLFxuICBfb25tZXNzYWdlOiBfb25tZXNzYWdlLFxuICBfdXVpZDogX3V1aWQsXG4gIF9nZXRTdWJzY3JpYmVyczogZnVuY3Rpb24gKCkgeyByZXR1cm4gc3Vic2NyaWJlcnM7IH0sXG4gIF93aW46IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHdpbjsgfSxcbiAgLy8gZW5kUmVtb3ZlSWYocHJvZHVjdGlvbilcbiAgaW5jbHVkZTogaW5jbHVkZSxcbiAgcHVibGlzaDogcHVibGlzaCxcbiAgcHViOiBwdWJsaXNoLFxuICB0cmlnZ2VyOiBwdWJsaXNoLFxuICBlbWl0OiBwdWJsaXNoLFxuICBzdWJzY3JpYmU6IHN1YnNjcmliZSxcbiAgc3ViOiBzdWJzY3JpYmUsXG4gIG9uOiBzdWJzY3JpYmUsXG4gIHVuc3Vic2NyaWJlOiB1bnN1YnNjcmliZSxcbiAgdW5zdWI6IHVuc3Vic2NyaWJlLFxuICBvZmY6IHVuc3Vic2NyaWJlXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZyYW1lYnVzO1xuIiwidmFyIENsaWVudCA9IHJlcXVpcmUoJy4uLy4uL2NsaWVudC9jbGllbnQnKTtcbnZhciBCdXMgPSByZXF1aXJlKCcuLi8uLi9saWIvYnVzJyk7XG52YXIgU2VhbWxlc3NwYXlFcnJvciA9IHJlcXVpcmUoJy4uLy4uL2xpYi9zZWFtbGVzc3BheS1lcnJvcicpO1xudmFyIGNvbnN0YW50cyA9IHJlcXVpcmUoJy4uL3NoYXJlZC9jb25zdGFudHMnKTtcbnZhciBhc3NlbWJsZUlGcmFtZXMgPSByZXF1aXJlKCcuLi8uLi9saWIvYXNzZW1ibGUtaWZyYW1lcycpO1xuXG52YXIgZXZlbnRzID0gY29uc3RhbnRzLmV2ZW50cztcbnZhciBkZWZhdWx0U3R5bGUgPSBjb25zdGFudHMuREVGQVVMVF9TVFlMRTtcbnZhciBkZWZhdWx0QnV0dG9uVGV4dCA9IGNvbnN0YW50cy5CVVRUT05fVEVYVDtcblxuZnVuY3Rpb24gaW5pdGlhbGl6ZShjb25maWd1cmF0aW9uKSB7XG4gIHZhciBjaGVja291dFVybCA9IGNvbmZpZ3VyYXRpb24uY2xpZW50LmdhdGV3YXlDb25maWd1cmF0aW9uLmNoZWNrb3V0VXJsO1xuICB2YXIgZm9ybVBhdGggPSBjb25maWd1cmF0aW9uLmZvcm1QYXRoO1xuICB2YXIgc3R5bGVzID0gY29uZmlndXJhdGlvbi5zdHlsZXM7XG4gIHZhciBidXR0b25UZXh0ID0gY29uZmlndXJhdGlvbi50ZXh0IHx8IGRlZmF1bHRCdXR0b25UZXh0O1xuICB2YXIgYW1vdW50ID0gY29uZmlndXJhdGlvbi5hbW91bnQ7XG4gIHZhciBtZXRhID0gY29uZmlndXJhdGlvbi5tZXRhO1xuXG4gIHZhciBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgYnV0dG9uLmlubmVySFRNTCA9ICc8c3Bhbj4nICsgYnV0dG9uVGV4dCArICc8L3NwYW4+JztcbiAgYnV0dG9uLm9uY2xpY2sgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgd2lkdGggPSB3aW5kb3cuc2NyZWVuLndpZHRoIC8gMiAtIDQwMDtcbiAgICB2YXIgaGVpZ2h0ID0gd2luZG93LnNjcmVlbi5oZWlnaHQgLyAyIC0gNDAwO1xuICAgIHZhciBjbGllbnQgPSBuZXcgQ2xpZW50KGNvbmZpZ3VyYXRpb24uY2xpZW50KTtcblxuICAgIHJldHVybiBjbGllbnQucmVxdWVzdCh7XG4gICAgICBhcGk6ICdzZWFtbGVzc3BheUFwaScsXG4gICAgICBtZXRob2Q6ICdwb3N0JyxcbiAgICAgIGVuZHBvaW50OiAnY2hlY2tvdXQtc2Vzc2lvbnMnLFxuICAgICAgcHVibGlzaGFibGU6IGZhbHNlLFxuICAgICAgZGF0YToge1xuICAgICAgICBhbW91bnQ6IGFtb3VudCxcbiAgICAgICAgbWV0YTogbWV0YVxuICAgICAgfVxuICAgIH0pXG4gICAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgdGhyb3cgbmV3IFNlYW1sZXNzcGF5RXJyb3IoZXJyb3IpO1xuICAgIH0pXG4gICAgLnRoZW4oZnVuY3Rpb24oc2Vzc2lvbikge1xuICAgICAgd2luZG93Lm9wZW4oXG4gICAgICAgIGNoZWNrb3V0VXJsICsgJy8nICsgZm9ybVBhdGggKyAnLycgKyBzZXNzaW9uLmlkLFxuICAgICAgICAnX2JsYW5rJyxcbiAgICAgICAgJ3Rvb2xiYXI9eWVzLHRvcD0nICsgaGVpZ2h0ICsgJyxsZWZ0PScgKyB3aWR0aCArICcsc2NyZWVuWD0nICsgd2lkdGggKyAnLHNjcmVlblk9JyArIGhlaWdodCArICcsd2lkdGg9ODAwLGhlaWdodD04MDAnXG4gICAgICApO1xuICAgIH0pO1xuICB9O1xuXG4gIE9iamVjdC5rZXlzKE9iamVjdC5hc3NpZ24oZGVmYXVsdFN0eWxlLCBzdHlsZXMpKVxuICAgIC5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgYnV0dG9uLnN0eWxlW2tleV0gPSBkZWZhdWx0U3R5bGVba2V5XTtcbiAgICB9KTtcblxuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGJ1dHRvbik7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZSgpIHtcbiAgdmFyIGNvbXBvbmVudElkID0gbG9jYXRpb24uaGFzaC5zbGljZSgxLCBsb2NhdGlvbi5oYXNoLmxlbmd0aCk7XG5cbiAgdmFyIGJ1cyA9IG5ldyBCdXMoeyBjaGFubmVsOiBjb21wb25lbnRJZCB9KTtcbiAgYnVzLmVtaXQoZXZlbnRzLkZSQU1FX1JFQURZLCBvcmNoZXN0cmF0ZSk7XG59XG5cbmZ1bmN0aW9uIG9yY2hlc3RyYXRlKGNvbmZpZ3VyYXRpb24pIHtcbiAgdmFyIGlmcmFtZXMgPSBhc3NlbWJsZUlGcmFtZXMuYXNzZW1ibGVJRnJhbWVzKHdpbmRvdy5wYXJlbnQpO1xuXG4gIGlmcmFtZXMuZm9yRWFjaChmdW5jdGlvbiAoaWZyYW1lKSB7XG4gICAgaWZyYW1lLnNlYW1sZXNzcGF5LmNoZWNrb3V0QnV0dG9uLmluaXRpYWxpemUoY29uZmlndXJhdGlvbik7XG4gIH0pO1xuXG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGluaXRpYWxpemU6IGluaXRpYWxpemUsXG4gIGNyZWF0ZTogY3JlYXRlXG59O1xuIiwidmFyIGVudW1lcmF0ZSA9IHJlcXVpcmUoJy4uLy4uL2xpYi9lbnVtZXJhdGUnKTtcblxudmFyIFZFUlNJT04gPSBcIndlYi1zZGtcIjtcbnZhciBCVVRUT05fS0VZID0gJ2NoZWNrb3V0LWJ1dHRvbic7XG52YXIgQlVUVE9OX1RFWFQgPSAnUGF5IE5vdyc7XG52YXIgREVGQVVMVF9TVFlMRSA9IHtcbiAgd2Via2l0QXBwZWFyYW5jZTogJ2J1dHRvbicsXG4gIGNvbG9yOiAnI2ZmZicsXG4gIGJhY2tncm91bmRDb2xvcjogJyMxODkwZmYnLFxuICBib3JkZXJDb2xvcjogJyMxODkwZmYnLFxuICB0ZXh0U2hhZG93OiAnMCAtMXB4IDAgcmdiYSgwLCAwLCAwLCAwLjEyKScsXG4gIGJveFNoYWRvdzogJzAgMnB4IDAgcmdiYSgwLCAwLCAwLCAwLjA0NSknLFxuICBsaW5lSGVpZ2h0OiAnMS40OTknLFxuICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG4gIGZvbnRXZWlnaHQ6IDQwMCxcbiAgd2hpdGVTcGFjZTogJ25vd3JhcCcsXG4gIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gIGJhY2tncm91bmRJbWFnZTogJ25vbmUnLFxuICBib3JkZXI6ICcxcHggc29saWQgdHJhbnNwYXJlbnQnLFxuICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgdHJhbnNpdGlvbjogJ2FsbCAwLjNzIGN1YmljLWJlemllcigwLjY0NSwgMC4wNDUsIDAuMzU1LCAxKScsXG4gIGhlaWdodDogJzMycHgnLFxuICBwYWRkaW5nOiAnMCAxNXB4JyxcbiAgZm9udFNpemU6ICcxNHB4JyxcbiAgYm9yZGVyUmFkaXVzOiAnNHB4JyxcbiAgdXNlclNlbGVjdDogJ25vbmUnLFxuICB0b3VjaEFjdGlvbjogJ21hbmlwdWxhdGlvbidcbn07XG5cbnZhciBldmVudHMgPSBlbnVtZXJhdGUoXG4gIFsgJ0ZSQU1FX1JFQURZJ10sXG4gICdjaGVja291dC1idXR0b246J1xuKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIFZFUlNJT046IFZFUlNJT04sXG4gIEJVVFRPTl9LRVk6IEJVVFRPTl9LRVksXG4gIEJVVFRPTl9URVhUOiBCVVRUT05fVEVYVCxcbiAgREVGQVVMVF9TVFlMRTogREVGQVVMVF9TVFlMRSxcbiAgZXZlbnRzOiBldmVudHNcbn07XG5cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHJlcXVlc3QgPSByZXF1aXJlKCcuL3JlcXVlc3QnKTtcbnZhciBpc1doaXRlbGlzdGVkRG9tYWluID0gcmVxdWlyZSgnLi4vbGliL2lzLXdoaXRlbGlzdGVkLWRvbWFpbicpO1xudmFyIFNlYW1sZXNzcGF5RXJyb3IgPSByZXF1aXJlKCcuLi9saWIvc2VhbWxlc3NwYXktZXJyb3InKTtcbnZhciBjb252ZXJ0VG9TZWFtbGVzc3BheUVycm9yID0gcmVxdWlyZSgnLi4vbGliL2NvbnZlcnQtdG8tc2VhbWxlc3NwYXktZXJyb3InKTtcbnZhciBhZGRNZXRhZGF0YSA9IHJlcXVpcmUoJy4uL2xpYi9hZGQtbWV0YWRhdGEnKTtcbnZhciBQcm9taXNlID0gcmVxdWlyZSgnLi4vbGliL3Byb21pc2UnKTtcbnZhciBhc3NpZ24gPSByZXF1aXJlKCcuLi9saWIvYXNzaWduJykuYXNzaWduO1xudmFyIGNvbnN0YW50cyA9IHJlcXVpcmUoJy4vY29uc3RhbnRzJyk7XG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMnKTtcbnZhciBzaGFyZWRFcnJvcnMgPSByZXF1aXJlKCcuLi9saWIvZXJyb3JzJyk7XG52YXIgVkVSU0lPTiA9IHJlcXVpcmUoJy4uL2xpYi9jb25zdGFudHMnKS5WRVJTSU9OO1xuXG4vKipcbiAqIFRoaXMgb2JqZWN0IGlzIHJldHVybmVkIGJ5IHtAbGluayBDbGllbnQjZ2V0Q29uZmlndXJhdGlvbnxnZXRDb25maWd1cmF0aW9ufS4gVGhpcyBpbmZvcm1hdGlvbiBpcyB1c2VkIGV4dGVuc2l2ZWx5IGJ5IG90aGVyIFNlYW1sZXNzcGF5IG1vZHVsZXMgdG8gcHJvcGVybHkgY29uZmlndXJlIHRoZW1zZWx2ZXMuXG4gKiBAdHlwZWRlZiB7b2JqZWN0fSBDbGllbnR+Y29uZmlndXJhdGlvblxuICogQHByb3BlcnR5IHtvYmplY3R9IGNsaWVudCBUaGUgc2VhbWxlc3NwYXktd2ViL2NsaWVudCBwYXJhbWV0ZXJzLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IGNsaWVudC5hdXRob3JpemF0aW9uIEEgdG9rZW5pemF0aW9uS2V5IG9yIGNsaWVudFRva2VuLlxuICogQHByb3BlcnR5IHtvYmplY3R9IGdhdGV3YXlDb25maWd1cmF0aW9uIEdhdGV3YXktc3VwcGxpZWQgY29uZmlndXJhdGlvbi5cbiAqIEBwcm9wZXJ0eSB7b2JqZWN0fSBhbmFseXRpY3NNZXRhZGF0YSBBbmFseXRpY3Mtc3BlY2lmaWMgZGF0YS5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBhbmFseXRpY3NNZXRhZGF0YS5zZXNzaW9uSWQgVW5pcXVlbHkgaWRlbnRpZmllcyBhIGJyb3dzaW5nIHNlc3Npb24uXG4gKiBAcHJvcGVydHkge3N0cmluZ30gYW5hbHl0aWNzTWV0YWRhdGEuc2RrVmVyc2lvbiBUaGUgc2VhbWxlc3NwYXkuanMgdmVyc2lvbi5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBhbmFseXRpY3NNZXRhZGF0YS5tZXJjaGFudEFwcElkIElkZW50aWZpZXMgdGhlIG1lcmNoYW50J3Mgd2ViIGFwcC5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBwcm94eUFjY291bnRJZCBJZGVudGlmaWVzIHRoZSBTdWIgTWVyY2hhbnQgQWNjb3VudCBJRC5cbiAqL1xuXG4vKipcbiAqIEBjbGFzc1xuICogQHBhcmFtIHtDbGllbnR+Y29uZmlndXJhdGlvbn0gY29uZmlndXJhdGlvbiBPcHRpb25zXG4gKiBAZGVzY3JpcHRpb24gPHN0cm9uZz5EbyBub3QgdXNlIHRoaXMgY29uc3RydWN0b3IgZGlyZWN0bHkuIFVzZSB7QGxpbmsgbW9kdWxlOnNlYW1sZXNzcGF5LXdlYi9jbGllbnQuY3JlYXRlfHNlYW1sZXNzcGF5LmNsaWVudC5jcmVhdGV9IGluc3RlYWQuPC9zdHJvbmc+XG4gKiBAY2xhc3NkZXNjIFRoaXMgY2xhc3MgaXMgcmVxdWlyZWQgYnkgbWFueSBvdGhlciBTZWFtbGVzc3BheSBjb21wb25lbnRzLiBJdCBzZXJ2ZXMgYXMgdGhlIGJhc2UgQVBJIGxheWVyIHRoYXQgY29tbXVuaWNhdGVzIHdpdGggb3VyIHNlcnZlcnMuIEl0IGlzIGFsc28gY2FwYWJsZSBvZiBiZWluZyB1c2VkIHRvIGZvcm11bGF0ZSBkaXJlY3QgY2FsbHMgdG8gb3VyIHNlcnZlcnMsIHN1Y2ggYXMgZGlyZWN0IGNyZWRpdCBjYXJkIHRva2VuaXphdGlvbi4gU2VlIHtAbGluayBDbGllbnQjcmVxdWVzdH0uXG4gKi9cbmZ1bmN0aW9uIENsaWVudChjb25maWd1cmF0aW9uKSB7XG4gIHZhclxuICAgIGNvbmZpZ3VyYXRpb25KU09OLFxuICAgIGdhdGV3YXlDb25maWd1cmF0aW9uLFxuICAgIHNlYW1sZXNzcGF5QXBpQ29uZmlndXJhdGlvbjtcblxuICBjb25maWd1cmF0aW9uID0gY29uZmlndXJhdGlvbiB8fCB7fTtcblxuICBjb25maWd1cmF0aW9uSlNPTiA9IEpTT04uc3RyaW5naWZ5KGNvbmZpZ3VyYXRpb24pO1xuICBnYXRld2F5Q29uZmlndXJhdGlvbiA9IGNvbmZpZ3VyYXRpb24uZ2F0ZXdheUNvbmZpZ3VyYXRpb247XG5cbiAgaWYgKCFnYXRld2F5Q29uZmlndXJhdGlvbikge1xuICAgIHRocm93IG5ldyBTZWFtbGVzc3BheUVycm9yKGVycm9ycy5DTElFTlRfTUlTU0lOR19HQVRFV0FZX0NPTkZJR1VSQVRJT04pO1xuICB9XG4gIFtcbiAgICAnYXNzZXRzVXJsJyxcbiAgICAnY2xpZW50QXBpVXJsJyxcbiAgICAndG9rZW5pemVyQXBpJ1xuICBdLmZvckVhY2goZnVuY3Rpb24gKHByb3BlcnR5KSB7XG4gICAgdmFyIGNvbmZpZ1VybCA9IChnYXRld2F5Q29uZmlndXJhdGlvbltwcm9wZXJ0eV0gJiYgZ2F0ZXdheUNvbmZpZ3VyYXRpb25bcHJvcGVydHldLnVybCkgfHwgZ2F0ZXdheUNvbmZpZ3VyYXRpb25bcHJvcGVydHldO1xuICAgIGlmIChwcm9wZXJ0eSBpbiBnYXRld2F5Q29uZmlndXJhdGlvbiAmJiAhaXNXaGl0ZWxpc3RlZERvbWFpbihjb25maWdVcmwpKSB7XG4gICAgICB0aHJvdyBuZXcgU2VhbWxlc3NwYXlFcnJvcih7XG4gICAgICAgIHR5cGU6IGVycm9ycy5DTElFTlRfR0FURVdBWV9DT05GSUdVUkFUSU9OX0lOVkFMSURfRE9NQUlOLnR5cGUsXG4gICAgICAgIGNvZGU6IGVycm9ycy5DTElFTlRfR0FURVdBWV9DT05GSUdVUkFUSU9OX0lOVkFMSURfRE9NQUlOLmNvZGUsXG4gICAgICAgIG1lc3NhZ2U6IHByb3BlcnR5ICsgJyBwcm9wZXJ0eSBpcyBvbiBhbiBpbnZhbGlkIGRvbWFpbi4gKCcgKyBjb25maWdVcmwgKyAnKSdcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBjb3B5IG9mIHRoZSBjb25maWd1cmF0aW9uIHZhbHVlcy5cbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7Q2xpZW50fmNvbmZpZ3VyYXRpb259IGNvbmZpZ3VyYXRpb25cbiAgICovXG4gIHRoaXMuZ2V0Q29uZmlndXJhdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShjb25maWd1cmF0aW9uSlNPTik7XG4gIH07XG5cbiAgdGhpcy5fcmVxdWVzdCA9IHJlcXVlc3Q7XG5cbiAgdGhpcy5fY29uZmlndXJhdGlvbiA9IHRoaXMuZ2V0Q29uZmlndXJhdGlvbigpO1xuXG4gIHRoaXMuX2NsaWVudEFwaUJhc2VVcmwgPSBnYXRld2F5Q29uZmlndXJhdGlvbi5jbGllbnRBcGlVcmwgKyAnLyc7XG4gIHRoaXMuX3Rva2VuaXplckFwaSA9IGdhdGV3YXlDb25maWd1cmF0aW9uLnRva2VuaXplckFwaTtcblxuICBzZWFtbGVzc3BheUFwaUNvbmZpZ3VyYXRpb24gPSBnYXRld2F5Q29uZmlndXJhdGlvbi5zZWFtbGVzc3BheUFwaTtcbiAgaWYgKHNlYW1sZXNzcGF5QXBpQ29uZmlndXJhdGlvbikge1xuICAgIHRoaXMuX3NlYW1sZXNzcGF5QXBpID0ge1xuICAgICAgYmFzZVVybDogc2VhbWxlc3NwYXlBcGlDb25maWd1cmF0aW9uLnVybCArICcvJyxcbiAgICAgIGFjY2Vzc1Rva2VuOiBzZWFtbGVzc3BheUFwaUNvbmZpZ3VyYXRpb24uYWNjZXNzVG9rZW4sXG4gICAgICBwdWJsaXNoYWJsZVRva2VuOiBzZWFtbGVzc3BheUFwaUNvbmZpZ3VyYXRpb24ucHVibGlzaGFibGVUb2tlblxuICAgIH07XG4gICAgaWYgKCFpc1doaXRlbGlzdGVkRG9tYWluKHRoaXMuX3NlYW1sZXNzcGF5QXBpLmJhc2VVcmwpKSB7XG4gICAgICB0aHJvdyBuZXcgU2VhbWxlc3NwYXlFcnJvcih7XG4gICAgICAgIHR5cGU6IGVycm9ycy5DTElFTlRfR0FURVdBWV9DT05GSUdVUkFUSU9OX0lOVkFMSURfRE9NQUlOLnR5cGUsXG4gICAgICAgIGNvZGU6IGVycm9ycy5DTElFTlRfR0FURVdBWV9DT05GSUdVUkFUSU9OX0lOVkFMSURfRE9NQUlOLmNvZGUsXG4gICAgICAgIG1lc3NhZ2U6ICdzZWFtbGVzc3BheUFwaSBVUkwgaXMgb24gYW4gaW52YWxpZCBkb21haW4uJ1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogVXNlZCBieSBvdGhlciBtb2R1bGVzIHRvIGZvcm11bGF0ZSBhbGwgbmV0d29yayByZXF1ZXN0cyB0byB0aGUgU2VhbWxlc3NwYXkgZ2F0ZXdheS4gSXQgaXMgYWxzbyBjYXBhYmxlIG9mIGJlaW5nIHVzZWQgZGlyZWN0bHkgZnJvbSB5b3VyIG93biBmb3JtIHRvIHRva2VuaXplIGNyZWRpdCBjYXJkIGluZm9ybWF0aW9uLiBIb3dldmVyLCBiZSBzdXJlIHRvIHNhdGlzZnkgUENJIGNvbXBsaWFuY2UgaWYgeW91IHVzZSBkaXJlY3QgY2FyZCB0b2tlbml6YXRpb24uXG4gKiBAcHVibGljXG4gKiBAZnVuY3Rpb25cbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIFJlcXVlc3Qgb3B0aW9uczpcbiAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLm1ldGhvZCBIVFRQIG1ldGhvZCwgZS5nLiBcImdldFwiIG9yIFwicG9zdFwiLlxuICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbnMuZW5kcG9pbnQgRW5kcG9pbnQgcGF0aCwgZS5nLiBcInBheW1lbnRfbWV0aG9kc1wiLlxuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMuZGF0YSBEYXRhIHRvIHNlbmQgd2l0aCB0aGUgcmVxdWVzdC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy50aW1lb3V0PTYwMDAwXSBTZXQgYSB0aW1lb3V0IChpbiBtaWxsaXNlY29uZHMpIGZvciB0aGUgcmVxdWVzdC5cbiAqIEBwYXJhbSB7Y2FsbGJhY2t9IFtjYWxsYmFja10gVGhlIHNlY29uZCBhcmd1bWVudCwgPGNvZGU+ZGF0YTwvY29kZT4sIGlzIHRoZSByZXR1cm5lZCBzZXJ2ZXIgZGF0YS5cbiAqIEBleGFtcGxlXG4gKiA8Y2FwdGlvbj5EaXJlY3QgQ3JlZGl0IENhcmQgVG9rZW5pemF0aW9uPC9jYXB0aW9uPlxuICogdmFyIGNyZWF0ZUNsaWVudCA9IHJlcXVpcmUoJ3NlYW1sZXNzcGF5LXdlYi9jbGllbnQnKS5jcmVhdGU7XG4gKlxuICogY3JlYXRlQ2xpZW50KHtcbiAqICAgZW52aXJvbm1lbnQ6ICdzYW5kYm94J1xuICogICBhdXRob3JpemF0aW9uOiBDTElFTlRfQVVUSE9SSVpBVElPTlxuICogfSwgZnVuY3Rpb24gKGNyZWF0ZUVyciwgY2xpZW50SW5zdGFuY2UpIHtcbiAqICAgdmFyIGZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbXktZm9ybS1pZCcpO1xuICogICB2YXIgZGF0YSA9IHtcbiAqICAgICBjcmVkaXRDYXJkOiB7XG4gKiAgICAgICBudW1iZXI6IGZvcm1bJ2NjLW51bWJlciddLnZhbHVlLFxuICogICAgICAgY3Z2OiBmb3JtWydjYy1jdnYnXS52YWx1ZSxcbiAqICAgICAgIGV4cERhdGU6IGZvcm1bJ2NjLWRhdGUnXS52YWx1ZSxcbiAqICAgICAgIGJpbGxpbmdBZGRyZXNzOiB7XG4gKiAgICAgICAgIHBvc3RhbENvZGU6IGZvcm1bJ2NjLXBvc3RhbCddLnZhbHVlXG4gKiAgICAgICB9LFxuICogICAgICAgb3B0aW9uczoge1xuICogICAgICAgICB2YWxpZGF0ZTogZmFsc2VcbiAqICAgICAgIH1cbiAqICAgICB9XG4gKiAgIH07XG4gKlxuICogICAvLyBXYXJuaW5nOiBGb3IgYSBtZXJjaGFudCB0byBiZSBlbGlnaWJsZSBmb3IgdGhlIGVhc2llc3QgbGV2ZWwgb2YgUENJIGNvbXBsaWFuY2UgKFNBUSBBKSxcbiAqICAgLy8gcGF5bWVudCBmaWVsZHMgY2Fubm90IGJlIGhvc3RlZCBvbiB5b3VyIGNoZWNrb3V0IHBhZ2UuXG4gKiAgIC8vIEZvciBhbiBhbHRlcm5hdGl2ZSB0byB0aGUgZm9sbG93aW5nLCB1c2UgSG9zdGVkIEZpZWxkcy5cbiAqICAgY2xpZW50SW5zdGFuY2UucmVxdWVzdCh7XG4gKiAgICAgZW5kcG9pbnQ6ICdwYXltZW50X21ldGhvZHMvY3JlZGl0X2NhcmRzJyxcbiAqICAgICBtZXRob2Q6ICdwb3N0JyxcbiAqICAgICBkYXRhOiBkYXRhXG4gKiAgIH0sIGZ1bmN0aW9uIChyZXF1ZXN0RXJyLCByZXNwb25zZSkge1xuICogICAgIC8vIE1vcmUgZGV0YWlsZWQgZXhhbXBsZSBvZiBoYW5kbGluZyBBUEkgZXJyb3JzOiBodHRwczovL2NvZGVwZW4uaW8vc2VhbWxlc3NwYXkvcGVuL01id2pkTVxuICogICAgIGlmIChyZXF1ZXN0RXJyKSB7IHRocm93IG5ldyBFcnJvcihyZXF1ZXN0RXJyKTsgfVxuICpcbiAqICAgICBjb25zb2xlLmxvZygnR290IG5vbmNlOicsIHJlc3BvbnNlLmNyZWRpdENhcmRzWzBdLm5vbmNlKTtcbiAqICAgfSk7XG4gKiB9KTtcbiAqIEByZXR1cm5zIHtQcm9taXNlfHZvaWR9IFJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2l0aCB0aGUgcmVxdWVzdCByZXNwb25zZSBpZiBubyBjYWxsYmFjayBpcyBwcm92aWRlZC5cbiAqL1xuQ2xpZW50LnByb3RvdHlwZS5yZXF1ZXN0ID0gZnVuY3Rpb24gKG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIHZhciBzZWxmID0gdGhpczsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1pbnZhbGlkLXRoaXNcblxuICB2YXIgcmVxdWVzdFByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdmFyIG9wdGlvbk5hbWUsXG4gICAgICBhcGksXG4gICAgICByZXF1ZXN0T3B0aW9ucyxcbiAgICAgIGFwaUNvbmZpZyxcbiAgICAgIHByb3h5QWNjb3VudElkLFxuICAgICAgcHVibGlzaGFibGUgPSBvcHRpb25zLnB1Ymxpc2hhYmxlO1xuXG4gICAgaWYgKCFvcHRpb25zLm1ldGhvZCkge1xuICAgICAgb3B0aW9uTmFtZSA9ICdvcHRpb25zLm1ldGhvZCc7XG4gICAgfSBlbHNlIGlmICghb3B0aW9ucy5lbmRwb2ludCkge1xuICAgICAgb3B0aW9uTmFtZSA9ICdvcHRpb25zLmVuZHBvaW50JztcbiAgICB9XG5cbiAgICBpZiAob3B0aW9uTmFtZSkge1xuICAgICAgdGhyb3cgbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgICB0eXBlOiBlcnJvcnMuQ0xJRU5UX09QVElPTl9SRVFVSVJFRC50eXBlLFxuICAgICAgICBjb2RlOiBlcnJvcnMuQ0xJRU5UX09QVElPTl9SRVFVSVJFRC5jb2RlLFxuICAgICAgICBtZXNzYWdlOiBvcHRpb25OYW1lICsgJyBpcyByZXF1aXJlZCB3aGVuIG1ha2luZyBhIHJlcXVlc3QuJ1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKCdhcGknIGluIG9wdGlvbnMpIHtcbiAgICAgIGFwaSA9IG9wdGlvbnMuYXBpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkgPSAnY2xpZW50QXBpJztcbiAgICB9XG5cbiAgICByZXF1ZXN0T3B0aW9ucyA9IHtcbiAgICAgIG1ldGhvZDogb3B0aW9ucy5tZXRob2QsXG4gICAgICB0aW1lb3V0OiBvcHRpb25zLnRpbWVvdXRcbiAgICB9O1xuXG4gICAgdmFyIGNvbW1vbkhlYWRlciA9IHtcbiAgICAgICdBUEktVmVyc2lvbic6IGNvbnN0YW50cy5TRUFNTEVTU1BBWV9BUElfVkVSU0lPTl9IRUFERVIsXG4gICAgICAnU0RLLVZlcnNpb24nOiBWRVJTSU9OXG4gICAgfTtcblxuICAgIHByb3h5QWNjb3VudElkID0gc2VsZi5nZXRDb25maWd1cmF0aW9uKCkuZ2F0ZXdheUNvbmZpZ3VyYXRpb24ucHJveHlBY2NvdW50SWQ7XG5cbiAgICBpZiAoYXBpID09PSAndG9rZW5pemVyQXBpJykge1xuICAgICAgcmVxdWVzdE9wdGlvbnMudXJsID0gc2VsZi5fdG9rZW5pemVyQXBpLnVybCArICcvJyArIG9wdGlvbnMuZW5kcG9pbnQ7XG4gICAgICByZXF1ZXN0T3B0aW9ucy5kYXRhID0gb3B0aW9ucy5kYXRhO1xuICAgICAgcmVxdWVzdE9wdGlvbnMuaGVhZGVycyA9IHtcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgQXV0aG9yaXphdGlvbjogJ0JlYXJlciAnICsgc2VsZi5fdG9rZW5pemVyQXBpLmFjY2Vzc1Rva2VuXG4gICAgICB9O1xuICAgICAgaWYgKHByb3h5QWNjb3VudElkKSB7XG4gICAgICAgIHJlcXVlc3RPcHRpb25zLmhlYWRlcnNbJ1NlYW1sZXNzUGF5LUFjY291bnQnXSA9IHByb3h5QWNjb3VudElkO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoYXBpID09PSAndHJhbnNhY3Rpb25BcGknKSB7XG4gICAgICBhcGlDb25maWcgPSBzZWxmLmdldENvbmZpZ3VyYXRpb24oKS5nYXRld2F5Q29uZmlndXJhdGlvbi50cmFuc2FjdGlvbkFwaTtcbiAgICAgIHJlcXVlc3RPcHRpb25zLnVybCA9IGFwaUNvbmZpZy5pc1NlYW1sZXNzcGF5ID8gYXBpQ29uZmlnLnVybCArICcvJyArIG9wdGlvbnMuZW5kcG9pbnQgOiBhcGlDb25maWcudXJsO1xuICAgICAgcmVxdWVzdE9wdGlvbnMuZGF0YSA9IG9wdGlvbnMuZGF0YTtcbiAgICAgIHJlcXVlc3RPcHRpb25zLmhlYWRlcnMgPSB7fTtcbiAgICAgIGlmIChhcGlDb25maWcuYWNjZXNzVG9rZW4pIHtcbiAgICAgICAgcmVxdWVzdE9wdGlvbnMuaGVhZGVyc1snQXV0aG9yaXphdGlvbiddID0gJ0JlYXJlciAnICsgYXBpQ29uZmlnLmFjY2Vzc1Rva2VuO1xuICAgICAgfVxuICAgICAgaWYgKHByb3h5QWNjb3VudElkKSB7XG4gICAgICAgIHJlcXVlc3RPcHRpb25zLmhlYWRlcnNbJ1NlYW1sZXNzUGF5LUFjY291bnQnXSA9IHByb3h5QWNjb3VudElkO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoYXBpID09PSAnY2hlY2tvdXRBcGknKSB7XG4gICAgICBhcGlDb25maWcgPSBzZWxmLmdldENvbmZpZ3VyYXRpb24oKS5nYXRld2F5Q29uZmlndXJhdGlvbi50cmFuc2FjdGlvbkFwaTtcbiAgICAgIHJlcXVlc3RPcHRpb25zLnVybCA9IGFwaUNvbmZpZy51cmwgKyAnLycgKyBvcHRpb25zLmVuZHBvaW50O1xuICAgICAgcmVxdWVzdE9wdGlvbnMuZGF0YSA9IG9wdGlvbnMuZGF0YTtcbiAgICAgIHJlcXVlc3RPcHRpb25zLmhlYWRlcnMgPSB7fTtcbiAgICAgIGlmIChhcGlDb25maWcuYWNjZXNzVG9rZW4pIHtcbiAgICAgICAgcmVxdWVzdE9wdGlvbnMuaGVhZGVyc1snQXV0aG9yaXphdGlvbiddID0gJ0JlYXJlciAnICsgYXBpQ29uZmlnLmFjY2Vzc1Rva2VuO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoYXBpID09PSAnY2xpZW50QXBpJykge1xuICAgICAgcmVxdWVzdE9wdGlvbnMudXJsID0gc2VsZi5fY2xpZW50QXBpQmFzZVVybCArIG9wdGlvbnMuZW5kcG9pbnQ7XG4gICAgICByZXF1ZXN0T3B0aW9ucy5kYXRhID0gYWRkTWV0YWRhdGEoc2VsZi5fY29uZmlndXJhdGlvbiwgb3B0aW9ucy5kYXRhKTtcbiAgICB9IGVsc2UgaWYgKGFwaSA9PT0gJ3NlYW1sZXNzcGF5QXBpJykge1xuICAgICAgaWYgKCFzZWxmLl9zZWFtbGVzc3BheUFwaSkge1xuICAgICAgICB0aHJvdyBuZXcgU2VhbWxlc3NwYXlFcnJvcihzaGFyZWRFcnJvcnMuU0VBTUxFU1NQQVlfQVBJX0FDQ0VTU19SRVNUUklDVEVEKTtcbiAgICAgIH1cbiAgICAgIHJlcXVlc3RPcHRpb25zLnVybCA9IHNlbGYuX3NlYW1sZXNzcGF5QXBpLmJhc2VVcmwgKyBvcHRpb25zLmVuZHBvaW50O1xuICAgICAgcmVxdWVzdE9wdGlvbnMuZGF0YSA9IG9wdGlvbnMuZGF0YTtcbiAgICAgIHJlcXVlc3RPcHRpb25zLmhlYWRlcnMgPSB7XG4gICAgICAgIEF1dGhvcml6YXRpb246ICdCZWFyZXIgJyArIChwdWJsaXNoYWJsZSA/IHNlbGYuX3NlYW1sZXNzcGF5QXBpLnB1Ymxpc2hhYmxlVG9rZW4gOiBzZWxmLl9zZWFtbGVzc3BheUFwaS5hY2Nlc3NUb2tlbilcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChhcGkgPT09ICdkaWdpdGFsV2FsbGV0QXBpJykge1xuICAgICAgaWYgKCFzZWxmLl9zZWFtbGVzc3BheUFwaSkge1xuICAgICAgICB0aHJvdyBuZXcgU2VhbWxlc3NwYXlFcnJvcihzaGFyZWRFcnJvcnMuU0VBTUxFU1NQQVlfQVBJX0FDQ0VTU19SRVNUUklDVEVEKTtcbiAgICAgIH1cbiAgICAgIHJlcXVlc3RPcHRpb25zLnVybCA9IHNlbGYuX3NlYW1sZXNzcGF5QXBpLmJhc2VVcmwgKyBvcHRpb25zLmVuZHBvaW50O1xuICAgICAgcmVxdWVzdE9wdGlvbnMuZGF0YSA9IG9wdGlvbnMuZGF0YTtcbiAgICAgIHJlcXVlc3RPcHRpb25zLmhlYWRlcnMgPSB7XG4gICAgICAgIEF1dGhvcml6YXRpb246ICdCZWFyZXIgJyArIG9wdGlvbnMuZGF0YS50b2tlblxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgICB0eXBlOiBlcnJvcnMuQ0xJRU5UX09QVElPTl9JTlZBTElELnR5cGUsXG4gICAgICAgIGNvZGU6IGVycm9ycy5DTElFTlRfT1BUSU9OX0lOVkFMSUQuY29kZSxcbiAgICAgICAgbWVzc2FnZTogJ29wdGlvbnMuYXBpIGlzIGludmFsaWQuJ1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmVxdWVzdE9wdGlvbnMuaGVhZGVycyA9IGFzc2lnbih7fSwgcmVxdWVzdE9wdGlvbnMuaGVhZGVycywgY29tbW9uSGVhZGVyKTtcblxuICAgIHNlbGYuX3JlcXVlc3QocmVxdWVzdE9wdGlvbnMsIGZ1bmN0aW9uIChlcnIsIGRhdGEsIHN0YXR1cykge1xuICAgICAgdmFyIHJlc29sdmVkRGF0YTtcbiAgICAgIHZhciByZXF1ZXN0RXJyb3IgPSBmb3JtYXRSZXF1ZXN0RXJyb3Ioc3RhdHVzLCBlcnIpO1xuXG4gICAgICBpZiAocmVxdWVzdEVycm9yKSB7XG4gICAgICAgIHJlamVjdChyZXF1ZXN0RXJyb3IpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHJlc29sdmVkRGF0YSA9IEFycmF5LmlzQXJyYXkoZGF0YSkgJiYgeyBkYXRhOiBkYXRhLCBfaHR0cFN0YXR1czogc3RhdHVzIH0gfHxcbiAgICAgICAgYXNzaWduKHsgX2h0dHBTdGF0dXM6IHN0YXR1cyB9LCBkYXRhKTtcblxuICAgICAgcmVzb2x2ZShyZXNvbHZlZERhdGEpO1xuICAgIH0pO1xuICB9KTtcblxuICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmVxdWVzdFByb21pc2UudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3BvbnNlLCByZXNwb25zZS5faHR0cFN0YXR1cyk7XG4gICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgICAgdmFyIHN0YXR1cyA9IGVyciAmJiBlcnIuZGV0YWlscyAmJiBlcnIuZGV0YWlscy5odHRwU3RhdHVzO1xuICAgICAgY2FsbGJhY2soZXJyLCBudWxsLCBzdGF0dXMpO1xuICAgIH0pO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHJldHVybiByZXF1ZXN0UHJvbWlzZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBjb25zaXN0ZW50LXJldHVyblxufTtcblxuZnVuY3Rpb24gZm9ybWF0UmVxdWVzdEVycm9yKHN0YXR1cywgZXJyKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgY29uc2lzdGVudC1yZXR1cm5cbiAgdmFyIHJlcXVlc3RFcnJvcjtcblxuICBpZiAoc3RhdHVzID09PSAtMSkge1xuICAgIHJlcXVlc3RFcnJvciA9IG5ldyBTZWFtbGVzc3BheUVycm9yKGVycm9ycy5DTElFTlRfUkVRVUVTVF9USU1FT1VUKTtcbiAgfSBlbHNlIGlmIChzdGF0dXMgPT09IDQwMykge1xuICAgIHJlcXVlc3RFcnJvciA9IG5ldyBTZWFtbGVzc3BheUVycm9yKGVycm9ycy5DTElFTlRfQVVUSE9SSVpBVElPTl9JTlNVRkZJQ0lFTlQpO1xuICB9IGVsc2UgaWYgKHN0YXR1cyA9PT0gNDI5KSB7XG4gICAgcmVxdWVzdEVycm9yID0gbmV3IFNlYW1sZXNzcGF5RXJyb3IoZXJyb3JzLkNMSUVOVF9SQVRFX0xJTUlURUQpO1xuICB9IGVsc2UgaWYgKHN0YXR1cyA+PSA1MDApIHtcbiAgICByZXF1ZXN0RXJyb3IgPSBuZXcgU2VhbWxlc3NwYXlFcnJvcihlcnJvcnMuQ0xJRU5UX0dBVEVXQVlfTkVUV09SSyk7XG4gIH0gZWxzZSBpZiAoc3RhdHVzIDwgMjAwIHx8IHN0YXR1cyA+PSA0MDApIHtcbiAgICByZXF1ZXN0RXJyb3IgPSBjb252ZXJ0VG9TZWFtbGVzc3BheUVycm9yKGVyciwge1xuICAgICAgdHlwZTogZXJyb3JzLkNMSUVOVF9SRVFVRVNUX0VSUk9SLnR5cGUsXG4gICAgICBjb2RlOiBlcnJvcnMuQ0xJRU5UX1JFUVVFU1RfRVJST1IuY29kZSxcbiAgICAgIG1lc3NhZ2U6IGVycm9ycy5DTElFTlRfUkVRVUVTVF9FUlJPUi5tZXNzYWdlXG4gICAgfSk7XG4gIH1cblxuICBpZiAocmVxdWVzdEVycm9yKSB7XG4gICAgcmVxdWVzdEVycm9yLmRldGFpbHMgPSByZXF1ZXN0RXJyb3IuZGV0YWlscyB8fCB7fTtcbiAgICByZXF1ZXN0RXJyb3IuZGV0YWlscy5odHRwU3RhdHVzID0gc3RhdHVzO1xuXG4gICAgcmV0dXJuIHJlcXVlc3RFcnJvcjtcbiAgfVxufVxuXG5DbGllbnQucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMuZ2V0Q29uZmlndXJhdGlvbigpO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBDbGllbnQgdmVyc2lvbi5cbiAqIEBwdWJsaWNcbiAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBjcmVhdGVkIGNsaWVudCdzIHZlcnNpb24uXG4gKiBAZXhhbXBsZVxuICogdmFyIGNyZWF0ZUNsaWVudCA9IHJlcXVpcmUoJ2JyYWludHJlZS13ZWIvY2xpZW50JykuY3JlYXRlO1xuICpcbiAqIGNyZWF0ZUNsaWVudCh7XG4gKiAgIGF1dGhvcml6YXRpb246IENMSUVOVF9BVVRIT1JJWkFUSU9OXG4gKiB9LCBmdW5jdGlvbiAoY3JlYXRlRXJyLCBjbGllbnRJbnN0YW5jZSkge1xuICogICBjb25zb2xlLmxvZyhjbGllbnRJbnN0YW5jZS5nZXRWZXJzaW9uKCkpOyAvLyBFeDogMS4wLjBcbiAqIH0pO1xuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbkNsaWVudC5wcm90b3R5cGUuZ2V0VmVyc2lvbiA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIFZFUlNJT047XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENsaWVudDtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIFNFQU1MRVNTUEFZX0FQSV9WRVJTSU9OX0hFQURFUjogJ3YyMDIwJ1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFNlYW1sZXNzcGF5RXJyb3IgPSByZXF1aXJlKCcuLi9saWIvc2VhbWxlc3NwYXktZXJyb3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIENMSUVOVF9HQVRFV0FZX0NPTkZJR1VSQVRJT05fSU5WQUxJRF9ET01BSU46IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLk1FUkNIQU5ULFxuICAgIGNvZGU6ICdDTElFTlRfR0FURVdBWV9DT05GSUdVUkFUSU9OX0lOVkFMSURfRE9NQUlOJ1xuICB9LFxuICBDTElFTlRfT1BUSU9OX1JFUVVJUkVEOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnQ0xJRU5UX09QVElPTl9SRVFVSVJFRCdcbiAgfSxcbiAgQ0xJRU5UX09QVElPTl9JTlZBTElEOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnQ0xJRU5UX09QVElPTl9JTlZBTElEJ1xuICB9LFxuICBDTElFTlRfTUlTU0lOR19HQVRFV0FZX0NPTkZJR1VSQVRJT046IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLklOVEVSTkFMLFxuICAgIGNvZGU6ICdDTElFTlRfTUlTU0lOR19HQVRFV0FZX0NPTkZJR1VSQVRJT04nLFxuICAgIG1lc3NhZ2U6ICdNaXNzaW5nIGdhdGV3YXlDb25maWd1cmF0aW9uLidcbiAgfSxcbiAgQ0xJRU5UX0lOVkFMSURfQVVUSE9SSVpBVElPTjoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTUVSQ0hBTlQsXG4gICAgY29kZTogJ0NMSUVOVF9JTlZBTElEX0FVVEhPUklaQVRJT04nLFxuICAgIG1lc3NhZ2U6ICdBdXRob3JpemF0aW9uIGlzIGludmFsaWQuIE1ha2Ugc3VyZSB5b3VyIGNsaWVudCB0b2tlbiBvciB0b2tlbml6YXRpb24ga2V5IGlzIHZhbGlkLidcbiAgfSxcbiAgQ0xJRU5UX0dBVEVXQVlfTkVUV09SSzoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTkVUV09SSyxcbiAgICBjb2RlOiAnQ0xJRU5UX0dBVEVXQVlfTkVUV09SSycsXG4gICAgbWVzc2FnZTogJ0Nhbm5vdCBjb250YWN0IHRoZSBnYXRld2F5IGF0IHRoaXMgdGltZS4nXG4gIH0sXG4gIENMSUVOVF9SRVFVRVNUX1RJTUVPVVQ6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLk5FVFdPUkssXG4gICAgY29kZTogJ0NMSUVOVF9SRVFVRVNUX1RJTUVPVVQnLFxuICAgIG1lc3NhZ2U6ICdSZXF1ZXN0IHRpbWVkIG91dCB3YWl0aW5nIGZvciBhIHJlcGx5LidcbiAgfSxcbiAgQ0xJRU5UX1JFUVVFU1RfRVJST1I6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLk5FVFdPUkssXG4gICAgY29kZTogJ0NMSUVOVF9SRVFVRVNUX0VSUk9SJyxcbiAgICBtZXNzYWdlOiAnVGhlcmUgd2FzIGEgcHJvYmxlbSB3aXRoIHlvdXIgcmVxdWVzdC4nXG4gIH0sXG4gIENMSUVOVF9SQVRFX0xJTUlURUQ6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLk1FUkNIQU5ULFxuICAgIGNvZGU6ICdDTElFTlRfUkFURV9MSU1JVEVEJyxcbiAgICBtZXNzYWdlOiAnWW91IGFyZSBiZWluZyByYXRlLWxpbWl0ZWQ7IHBsZWFzZSB0cnkgYWdhaW4gaW4gYSBmZXcgbWludXRlcy4nXG4gIH0sXG4gIENMSUVOVF9BVVRIT1JJWkFUSU9OX0lOU1VGRklDSUVOVDoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTUVSQ0hBTlQsXG4gICAgY29kZTogJ0NMSUVOVF9BVVRIT1JJWkFUSU9OX0lOU1VGRklDSUVOVCcsXG4gICAgbWVzc2FnZTogJ1RoZSBhdXRob3JpemF0aW9uIHVzZWQgaGFzIGluc3VmZmljaWVudCBwcml2aWxlZ2VzLidcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHF1ZXJ5c3RyaW5nID0gcmVxdWlyZSgnLi4vLi4vbGliL3F1ZXJ5c3RyaW5nJyk7XG52YXIgYXNzaWduID0gcmVxdWlyZSgnLi4vLi4vbGliL2Fzc2lnbicpLmFzc2lnbjtcbnZhciBwcmVwQm9keSA9IHJlcXVpcmUoJy4vcHJlcC1ib2R5Jyk7XG52YXIgcGFyc2VCb2R5ID0gcmVxdWlyZSgnLi9wYXJzZS1ib2R5Jyk7XG52YXIgaXNYSFJBdmFpbGFibGUgPSBnbG9iYWwuWE1MSHR0cFJlcXVlc3QgJiYgJ3dpdGhDcmVkZW50aWFscycgaW4gbmV3IGdsb2JhbC5YTUxIdHRwUmVxdWVzdCgpO1xuXG5mdW5jdGlvbiBnZXRSZXF1ZXN0T2JqZWN0KCkge1xuICByZXR1cm4gaXNYSFJBdmFpbGFibGUgPyBuZXcgWE1MSHR0cFJlcXVlc3QoKSA6IG5ldyBYRG9tYWluUmVxdWVzdCgpO1xufVxuXG5mdW5jdGlvbiByZXF1ZXN0KG9wdGlvbnMsIGNiKSB7XG4gIHZhciBzdGF0dXMsIHJlc0JvZHk7XG4gIHZhciBtZXRob2QgPSBvcHRpb25zLm1ldGhvZDtcbiAgdmFyIHVybCA9IG9wdGlvbnMudXJsO1xuICB2YXIgYm9keSA9IG9wdGlvbnMuZGF0YTtcbiAgdmFyIHRpbWVvdXQgPSBvcHRpb25zLnRpbWVvdXQ7XG4gIHZhciBoZWFkZXJzID0gYXNzaWduKHtcbiAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gIH0sIG9wdGlvbnMuaGVhZGVycyk7XG4gIHZhciByZXEgPSBnZXRSZXF1ZXN0T2JqZWN0KCk7XG4gIHZhciBjYWxsYmFjayA9IGNiO1xuXG4gIGlmIChtZXRob2QgPT09ICdHRVQnKSB7XG4gICAgdXJsID0gcXVlcnlzdHJpbmcucXVlcnlpZnkodXJsLCBib2R5KTtcbiAgICBib2R5ID0gbnVsbDtcbiAgfVxuXG4gIGlmIChpc1hIUkF2YWlsYWJsZSkge1xuICAgIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAocmVxLnJlYWR5U3RhdGUgIT09IDQpIHsgcmV0dXJuOyB9XG5cbiAgICAgIHN0YXR1cyA9IHJlcS5zdGF0dXM7XG4gICAgICByZXNCb2R5ID0gcGFyc2VCb2R5KHJlcS5yZXNwb25zZVRleHQpO1xuXG4gICAgICBpZiAoc3RhdHVzID49IDQwMCB8fCBzdGF0dXMgPCAyMDApIHtcbiAgICAgICAgY2FsbGJhY2socmVzQm9keSB8fCAnZXJyb3InLCBudWxsLCBzdGF0dXMgfHwgNTAwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHJlc0JvZHksIHN0YXR1cyk7XG4gICAgICB9XG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICBpZiAob3B0aW9ucy5oZWFkZXJzKSB7XG4gICAgICB1cmwgPSBxdWVyeXN0cmluZy5xdWVyeWlmeSh1cmwsIGhlYWRlcnMpO1xuICAgIH1cblxuICAgIHJlcS5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBjYWxsYmFjayhudWxsLCBwYXJzZUJvZHkocmVxLnJlc3BvbnNlVGV4dCksIHJlcS5zdGF0dXMpO1xuICAgIH07XG5cbiAgICByZXEub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIFhEb21haW5SZXF1ZXN0IGRvZXMgbm90IHJlcG9ydCBhIGJvZHkgb3Igc3RhdHVzIGZvciBlcnJvcnMsIHNvXG4gICAgICAvLyBoYXJkY29kZSB0byAnZXJyb3InIGFuZCA1MDAsIHJlc3BlY3RpdmVseVxuICAgICAgY2FsbGJhY2soJ2Vycm9yJywgbnVsbCwgNTAwKTtcbiAgICB9O1xuXG4gICAgLy8gVGhpcyBtdXN0IHJlbWFpbiBmb3IgSUU5IHRvIHdvcmtcbiAgICByZXEub25wcm9ncmVzcyA9IGZ1bmN0aW9uICgpIHt9O1xuXG4gICAgcmVxLm9udGltZW91dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGNhbGxiYWNrKCd0aW1lb3V0JywgbnVsbCwgLTEpO1xuICAgIH07XG4gIH1cblxuICByZXEub3BlbihtZXRob2QsIHVybCwgdHJ1ZSk7XG4gIHJlcS50aW1lb3V0ID0gdGltZW91dDtcblxuICBpZiAoaXNYSFJBdmFpbGFibGUpIHtcbiAgICBPYmplY3Qua2V5cyhoZWFkZXJzKS5mb3JFYWNoKGZ1bmN0aW9uIChoZWFkZXJLZXkpIHtcbiAgICAgIHJlcS5zZXRSZXF1ZXN0SGVhZGVyKGhlYWRlcktleSwgaGVhZGVyc1toZWFkZXJLZXldKTtcbiAgICB9KTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgcmVxLnNlbmQocHJlcEJvZHkobWV0aG9kLCBib2R5KSk7XG4gIH0gY2F0Y2ggKGUpIHsgLyogaWdub3JlZCAqLyB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICByZXF1ZXN0OiByZXF1ZXN0XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldFVzZXJBZ2VudCgpIHtcbiAgcmV0dXJuIGdsb2JhbC5uYXZpZ2F0b3IudXNlckFnZW50O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGFqYXhJc0F2YWxpYWJsZTtcbnZhciBvbmNlID0gcmVxdWlyZSgnLi4vLi4vbGliL29uY2UnKTtcbnZhciBKU09OUERyaXZlciA9IHJlcXVpcmUoJy4vanNvbnAtZHJpdmVyJyk7XG52YXIgQUpBWERyaXZlciA9IHJlcXVpcmUoJy4vYWpheC1kcml2ZXInKTtcbnZhciBnZXRVc2VyQWdlbnQgPSByZXF1aXJlKCcuL2dldC11c2VyLWFnZW50Jyk7XG52YXIgaXNIVFRQID0gcmVxdWlyZSgnLi9pcy1odHRwJyk7XG5cbmZ1bmN0aW9uIGlzQWpheEF2YWlsYWJsZSgpIHtcbiAgaWYgKGFqYXhJc0F2YWxpYWJsZSA9PSBudWxsKSB7XG4gICAgYWpheElzQXZhbGlhYmxlID0gIShpc0hUVFAoKSAmJiAvTVNJRVxccyg4fDkpLy50ZXN0KGdldFVzZXJBZ2VudCgpKSk7XG4gIH1cblxuICByZXR1cm4gYWpheElzQXZhbGlhYmxlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvcHRpb25zLCBjYikge1xuICBjYiA9IG9uY2UoY2IgfHwgRnVuY3Rpb24ucHJvdG90eXBlKTtcbiAgb3B0aW9ucy5tZXRob2QgPSAob3B0aW9ucy5tZXRob2QgfHwgJ0dFVCcpLnRvVXBwZXJDYXNlKCk7XG4gIG9wdGlvbnMudGltZW91dCA9IG9wdGlvbnMudGltZW91dCA9PSBudWxsID8gNjAwMDAgOiBvcHRpb25zLnRpbWVvdXQ7XG4gIG9wdGlvbnMuZGF0YSA9IG9wdGlvbnMuZGF0YSB8fCB7fTtcblxuICBpZiAoaXNBamF4QXZhaWxhYmxlKCkpIHtcbiAgICBBSkFYRHJpdmVyLnJlcXVlc3Qob3B0aW9ucywgY2IpO1xuICB9IGVsc2Uge1xuICAgIEpTT05QRHJpdmVyLnJlcXVlc3Qob3B0aW9ucywgY2IpO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIGdsb2JhbC5sb2NhdGlvbi5wcm90b2NvbCA9PT0gJ2h0dHA6Jztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBoZWFkO1xudmFyIHV1aWQgPSByZXF1aXJlKCcuLi8uLi9saWIvdXVpZCcpO1xudmFyIHF1ZXJ5c3RyaW5nID0gcmVxdWlyZSgnLi4vLi4vbGliL3F1ZXJ5c3RyaW5nJyk7XG52YXIgdGltZW91dHMgPSB7fTtcblxuZnVuY3Rpb24gX3JlbW92ZVNjcmlwdChzY3JpcHQpIHtcbiAgaWYgKHNjcmlwdCAmJiBzY3JpcHQucGFyZW50Tm9kZSkge1xuICAgIHNjcmlwdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNjcmlwdCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2NyZWF0ZVNjcmlwdFRhZyh1cmwsIGNhbGxiYWNrTmFtZSkge1xuICB2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gIHZhciBkb25lID0gZmFsc2U7XG5cbiAgc2NyaXB0LnNyYyA9IHVybDtcbiAgc2NyaXB0LmFzeW5jID0gdHJ1ZTtcbiAgc2NyaXB0Lm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgZ2xvYmFsW2NhbGxiYWNrTmFtZV0oe21lc3NhZ2U6ICdlcnJvcicsIHN0YXR1czogNTAwfSk7XG4gIH07XG5cbiAgc2NyaXB0Lm9ubG9hZCA9IHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGRvbmUpIHsgcmV0dXJuOyB9XG5cbiAgICBpZiAoIXRoaXMucmVhZHlTdGF0ZSB8fCB0aGlzLnJlYWR5U3RhdGUgPT09ICdsb2FkZWQnIHx8IHRoaXMucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJykge1xuICAgICAgZG9uZSA9IHRydWU7XG4gICAgICBzY3JpcHQub25sb2FkID0gc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG51bGw7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBzY3JpcHQ7XG59XG5cbmZ1bmN0aW9uIF9jbGVhbnVwR2xvYmFsKGNhbGxiYWNrTmFtZSkge1xuICB0cnkge1xuICAgIGRlbGV0ZSBnbG9iYWxbY2FsbGJhY2tOYW1lXTtcbiAgfSBjYXRjaCAoXykge1xuICAgIGdsb2JhbFtjYWxsYmFja05hbWVdID0gbnVsbDtcbiAgfVxufVxuXG5mdW5jdGlvbiBfc2V0dXBUaW1lb3V0KHRpbWVvdXQsIGNhbGxiYWNrTmFtZSkge1xuICB0aW1lb3V0c1tjYWxsYmFja05hbWVdID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgdGltZW91dHNbY2FsbGJhY2tOYW1lXSA9IG51bGw7XG5cbiAgICBnbG9iYWxbY2FsbGJhY2tOYW1lXSh7XG4gICAgICBlcnJvcjogJ3RpbWVvdXQnLFxuICAgICAgc3RhdHVzOiAtMVxuICAgIH0pO1xuXG4gICAgZ2xvYmFsW2NhbGxiYWNrTmFtZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICBfY2xlYW51cEdsb2JhbChjYWxsYmFja05hbWUpO1xuICAgIH07XG4gIH0sIHRpbWVvdXQpO1xufVxuXG5mdW5jdGlvbiBfc2V0dXBHbG9iYWxDYWxsYmFjayhzY3JpcHQsIGNhbGxiYWNrLCBjYWxsYmFja05hbWUpIHtcbiAgZ2xvYmFsW2NhbGxiYWNrTmFtZV0gPSBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICB2YXIgc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzIHx8IDUwMDtcbiAgICB2YXIgZXJyID0gbnVsbDtcbiAgICB2YXIgZGF0YSA9IG51bGw7XG5cbiAgICBkZWxldGUgcmVzcG9uc2Uuc3RhdHVzO1xuXG4gICAgaWYgKHN0YXR1cyA+PSA0MDAgfHwgc3RhdHVzIDwgMjAwKSB7XG4gICAgICBlcnIgPSByZXNwb25zZTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGF0YSA9IHJlc3BvbnNlO1xuICAgIH1cblxuICAgIF9jbGVhbnVwR2xvYmFsKGNhbGxiYWNrTmFtZSk7XG4gICAgX3JlbW92ZVNjcmlwdChzY3JpcHQpO1xuXG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRzW2NhbGxiYWNrTmFtZV0pO1xuICAgIGNhbGxiYWNrKGVyciwgZGF0YSwgc3RhdHVzKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gcmVxdWVzdChvcHRpb25zLCBjYWxsYmFjaykge1xuICB2YXIgc2NyaXB0O1xuICB2YXIgY2FsbGJhY2tOYW1lID0gJ2NhbGxiYWNrX2pzb25fJyArIHV1aWQoKS5yZXBsYWNlKC8tL2csICcnKTtcbiAgdmFyIHVybCA9IG9wdGlvbnMudXJsO1xuICB2YXIgYXR0cnMgPSBvcHRpb25zLmRhdGE7XG4gIHZhciBtZXRob2QgPSBvcHRpb25zLm1ldGhvZDtcbiAgdmFyIHRpbWVvdXQgPSBvcHRpb25zLnRpbWVvdXQ7XG5cbiAgdXJsID0gcXVlcnlzdHJpbmcucXVlcnlpZnkodXJsLCBhdHRycyk7XG4gIHVybCA9IHF1ZXJ5c3RyaW5nLnF1ZXJ5aWZ5KHVybCwge1xuICAgIF9tZXRob2Q6IG1ldGhvZCxcbiAgICBjYWxsYmFjazogY2FsbGJhY2tOYW1lXG4gIH0pO1xuXG4gIHNjcmlwdCA9IF9jcmVhdGVTY3JpcHRUYWcodXJsLCBjYWxsYmFja05hbWUpO1xuICBfc2V0dXBHbG9iYWxDYWxsYmFjayhzY3JpcHQsIGNhbGxiYWNrLCBjYWxsYmFja05hbWUpO1xuICBfc2V0dXBUaW1lb3V0KHRpbWVvdXQsIGNhbGxiYWNrTmFtZSk7XG5cbiAgaWYgKCFoZWFkKSB7XG4gICAgaGVhZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XG4gIH1cblxuICBoZWFkLmFwcGVuZENoaWxkKHNjcmlwdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICByZXF1ZXN0OiByZXF1ZXN0XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChib2R5KSB7XG4gIHRyeSB7XG4gICAgYm9keSA9IEpTT04ucGFyc2UoYm9keSk7XG4gIH0gY2F0Y2ggKGUpIHsgLyogaWdub3JlZCAqLyB9XG5cbiAgcmV0dXJuIGJvZHk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChtZXRob2QsIGJvZHkpIHtcbiAgaWYgKFN0cmluZyhtZXRob2QpLnRvTG93ZXJDYXNlKCkgIT09ICdnZXQnICYmIGJvZHkgIT0gbnVsbCkge1xuICAgIGJvZHkgPSB0eXBlb2YgYm9keSA9PT0gJ3N0cmluZycgPyBib2R5IDogSlNPTi5zdHJpbmdpZnkoYm9keSk7XG4gIH1cblxuICByZXR1cm4gYm9keTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIGFkZE1ldGFkYXRhKGNvbmZpZ3VyYXRpb24sIGRhdGEpIHtcbiAgaWYgKGNvbmZpZ3VyYXRpb24ubWV0YWRhdGEpIHtcbiAgICBpZiAoZGF0YSkge1xuICAgICAgZGF0YS5tZXRhZGF0YSA9IGNvbmZpZ3VyYXRpb24ubWV0YWRhdGE7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRhdGEgPSB7XG4gICAgICAgIG1ldGFkYXRhOiBjb25maWd1cmF0aW9uLm1ldGFkYXRhXG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBkYXRhXG59XG5cbm1vZHVsZS5leHBvcnRzID0gYWRkTWV0YWRhdGE7XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIGFzc2VtYmxlSUZyYW1lcyh3aW4pIHtcbiAgdmFyIGksIGZyYW1lO1xuICB2YXIgZnJhbWVzID0gW107XG5cbiAgZm9yIChpID0gMDsgaSA8IHdpbi5mcmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICBmcmFtZSA9IHdpbi5mcmFtZXNbaV07XG5cbiAgICB0cnkge1xuICAgICAgaWYgKGZyYW1lLmxvY2F0aW9uLmhyZWYgPT09IHdpbmRvdy5sb2NhdGlvbi5ocmVmKSB7XG4gICAgICAgIGZyYW1lcy5wdXNoKGZyYW1lKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7IC8qIGlnbm9yZWQgKi8gfVxuICB9XG5cbiAgcmV0dXJuIGZyYW1lcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFzc2VtYmxlSUZyYW1lczogYXNzZW1ibGVJRnJhbWVzXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYXNzaWduTm9ybWFsaXplZCA9IHR5cGVvZiBPYmplY3QuYXNzaWduID09PSAnZnVuY3Rpb24nID8gT2JqZWN0LmFzc2lnbiA6IGFzc2lnblBvbHlmaWxsO1xuXG5mdW5jdGlvbiBhc3NpZ25Qb2x5ZmlsbChkZXN0aW5hdGlvbikge1xuICB2YXIgaSwgc291cmNlLCBrZXk7XG5cbiAgZm9yIChpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcbiAgICBmb3IgKGtleSBpbiBzb3VyY2UpIHtcbiAgICAgIGlmIChzb3VyY2UuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICBkZXN0aW5hdGlvbltrZXldID0gc291cmNlW2tleV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGRlc3RpbmF0aW9uO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYXNzaWduOiBhc3NpZ25Ob3JtYWxpemVkLFxuICBfYXNzaWduOiBhc3NpZ25Qb2x5ZmlsbFxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzV2hpdGVsaXN0ZWREb21haW4gPSByZXF1aXJlKCcuLi9pcy13aGl0ZWxpc3RlZC1kb21haW4nKTtcblxuZnVuY3Rpb24gY2hlY2tPcmlnaW4ocG9zdE1lc3NhZ2VPcmlnaW4sIG1lcmNoYW50VXJsKSB7XG4gIHZhciBtZXJjaGFudE9yaWdpbiwgbWVyY2hhbnRIb3N0O1xuICB2YXIgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcblxuICBhLmhyZWYgPSBtZXJjaGFudFVybDtcblxuICBpZiAoYS5wcm90b2NvbCA9PT0gJ2h0dHBzOicpIHtcbiAgICBtZXJjaGFudEhvc3QgPSBhLmhvc3QucmVwbGFjZSgvOjQ0MyQvLCAnJyk7XG4gIH0gZWxzZSBpZiAoYS5wcm90b2NvbCA9PT0gJ2h0dHA6Jykge1xuICAgIG1lcmNoYW50SG9zdCA9IGEuaG9zdC5yZXBsYWNlKC86ODAkLywgJycpO1xuICB9IGVsc2Uge1xuICAgIG1lcmNoYW50SG9zdCA9IGEuaG9zdDtcbiAgfVxuXG4gIG1lcmNoYW50T3JpZ2luID0gYS5wcm90b2NvbCArICcvLycgKyBtZXJjaGFudEhvc3Q7XG5cbiAgaWYgKG1lcmNoYW50T3JpZ2luID09PSBwb3N0TWVzc2FnZU9yaWdpbikgeyByZXR1cm4gdHJ1ZTsgfVxuXG4gIGEuaHJlZiA9IHBvc3RNZXNzYWdlT3JpZ2luO1xuXG4gIHJldHVybiBpc1doaXRlbGlzdGVkRG9tYWluKHBvc3RNZXNzYWdlT3JpZ2luKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNoZWNrT3JpZ2luOiBjaGVja09yaWdpblxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGVudW1lcmF0ZSA9IHJlcXVpcmUoJy4uL2VudW1lcmF0ZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGVudW1lcmF0ZShbXG4gICdDT05GSUdVUkFUSU9OX1JFUVVFU1QnXG5dLCAnYnVzOicpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYnVzID0gcmVxdWlyZSgnZnJhbWVidXMnKTtcbnZhciBldmVudHMgPSByZXF1aXJlKCcuL2V2ZW50cycpO1xudmFyIGNoZWNrT3JpZ2luID0gcmVxdWlyZSgnLi9jaGVjay1vcmlnaW4nKS5jaGVja09yaWdpbjtcbnZhciBTZWFtbGVzc3BheUVycm9yID0gcmVxdWlyZSgnLi4vc2VhbWxlc3NwYXktZXJyb3InKTtcblxuZnVuY3Rpb24gU2VhbWxlc3NwYXlCdXMob3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICB0aGlzLmNoYW5uZWwgPSBvcHRpb25zLmNoYW5uZWw7XG4gIGlmICghdGhpcy5jaGFubmVsKSB7XG4gICAgdGhyb3cgbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5JTlRFUk5BTCxcbiAgICAgIGNvZGU6ICdNSVNTSU5HX0NIQU5ORUxfSUQnLFxuICAgICAgbWVzc2FnZTogJ0NoYW5uZWwgSUQgbXVzdCBiZSBzcGVjaWZpZWQuJ1xuICAgIH0pO1xuICB9XG5cbiAgdGhpcy5tZXJjaGFudFVybCA9IG9wdGlvbnMubWVyY2hhbnRVcmw7XG5cbiAgdGhpcy5faXNEZXN0cm95ZWQgPSBmYWxzZTtcbiAgdGhpcy5faXNWZXJib3NlID0gZmFsc2U7XG5cbiAgdGhpcy5fbGlzdGVuZXJzID0gW107XG5cbiAgdGhpcy5fbG9nKCduZXcgYnVzIG9uIGNoYW5uZWwgJyArIHRoaXMuY2hhbm5lbCwgW2xvY2F0aW9uLmhyZWZdKTtcbn1cblxuU2VhbWxlc3NwYXlCdXMucHJvdG90eXBlLm9uID0gZnVuY3Rpb24gKGV2ZW50TmFtZSwgb3JpZ2luYWxIYW5kbGVyKSB7XG4gIHZhciBuYW1lc3BhY2VkRXZlbnQsIGFyZ3M7XG4gIHZhciBoYW5kbGVyID0gb3JpZ2luYWxIYW5kbGVyO1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgaWYgKHRoaXMuX2lzRGVzdHJveWVkKSB7IHJldHVybjsgfVxuXG4gIGlmICh0aGlzLm1lcmNoYW50VXJsKSB7XG4gICAgaGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLWludmFsaWQtdGhpcyAqL1xuICAgICAgaWYgKGNoZWNrT3JpZ2luKHRoaXMub3JpZ2luLCBzZWxmLm1lcmNoYW50VXJsKSkge1xuICAgICAgICBvcmlnaW5hbEhhbmRsZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICAgIC8qIGVzbGludC1lbmFibGUgbm8taW52YWxpZC10aGlzICovXG4gICAgfTtcbiAgfVxuXG4gIG5hbWVzcGFjZWRFdmVudCA9IHRoaXMuX25hbWVzcGFjZUV2ZW50KGV2ZW50TmFtZSk7XG4gIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICBhcmdzWzBdID0gbmFtZXNwYWNlZEV2ZW50O1xuICBhcmdzWzFdID0gaGFuZGxlcjtcblxuICB0aGlzLl9sb2coJ29uJywgYXJncyk7XG4gIGJ1cy5vbi5hcHBseShidXMsIGFyZ3MpO1xuXG4gIHRoaXMuX2xpc3RlbmVycy5wdXNoKHtcbiAgICBldmVudE5hbWU6IGV2ZW50TmFtZSxcbiAgICBoYW5kbGVyOiBoYW5kbGVyLFxuICAgIG9yaWdpbmFsSGFuZGxlcjogb3JpZ2luYWxIYW5kbGVyXG4gIH0pO1xufTtcblxuU2VhbWxlc3NwYXlCdXMucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbiAoZXZlbnROYW1lKSB7XG4gIHZhciBhcmdzO1xuXG4gIGlmICh0aGlzLl9pc0Rlc3Ryb3llZCkgeyByZXR1cm47IH1cblxuICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgYXJnc1swXSA9IHRoaXMuX25hbWVzcGFjZUV2ZW50KGV2ZW50TmFtZSk7XG5cbiAgdGhpcy5fbG9nKCdlbWl0JywgYXJncyk7XG4gIGJ1cy5lbWl0LmFwcGx5KGJ1cywgYXJncyk7XG59O1xuXG5TZWFtbGVzc3BheUJ1cy5wcm90b3R5cGUuX29mZkRpcmVjdCA9IGZ1bmN0aW9uIChldmVudE5hbWUpIHtcbiAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuXG4gIGlmICh0aGlzLl9pc0Rlc3Ryb3llZCkgeyByZXR1cm47IH1cblxuICBhcmdzWzBdID0gdGhpcy5fbmFtZXNwYWNlRXZlbnQoZXZlbnROYW1lKTtcblxuICB0aGlzLl9sb2coJ29mZicsIGFyZ3MpO1xuICBidXMub2ZmLmFwcGx5KGJ1cywgYXJncyk7XG59O1xuXG5TZWFtbGVzc3BheUJ1cy5wcm90b3R5cGUub2ZmID0gZnVuY3Rpb24gKGV2ZW50TmFtZSwgb3JpZ2luYWxIYW5kbGVyKSB7XG4gIHZhciBpLCBsaXN0ZW5lcjtcbiAgdmFyIGhhbmRsZXIgPSBvcmlnaW5hbEhhbmRsZXI7XG5cbiAgaWYgKHRoaXMuX2lzRGVzdHJveWVkKSB7IHJldHVybjsgfVxuXG4gIGlmICh0aGlzLm1lcmNoYW50VXJsKSB7XG4gICAgZm9yIChpID0gMDsgaSA8IHRoaXMuX2xpc3RlbmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgbGlzdGVuZXIgPSB0aGlzLl9saXN0ZW5lcnNbaV07XG5cbiAgICAgIGlmIChsaXN0ZW5lci5vcmlnaW5hbEhhbmRsZXIgPT09IG9yaWdpbmFsSGFuZGxlcikge1xuICAgICAgICBoYW5kbGVyID0gbGlzdGVuZXIuaGFuZGxlcjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB0aGlzLl9vZmZEaXJlY3QoZXZlbnROYW1lLCBoYW5kbGVyKTtcbn07XG5cblNlYW1sZXNzcGF5QnVzLnByb3RvdHlwZS5fbmFtZXNwYWNlRXZlbnQgPSBmdW5jdGlvbiAoZXZlbnROYW1lKSB7XG4gIHJldHVybiBbJ3NlYW1sZXNzcGF5JywgdGhpcy5jaGFubmVsLCBldmVudE5hbWVdLmpvaW4oJzonKTtcbn07XG5cblNlYW1sZXNzcGF5QnVzLnByb3RvdHlwZS50ZWFyZG93biA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGxpc3RlbmVyLCBpO1xuXG4gIGZvciAoaSA9IDA7IGkgPCB0aGlzLl9saXN0ZW5lcnMubGVuZ3RoOyBpKyspIHtcbiAgICBsaXN0ZW5lciA9IHRoaXMuX2xpc3RlbmVyc1tpXTtcbiAgICB0aGlzLl9vZmZEaXJlY3QobGlzdGVuZXIuZXZlbnROYW1lLCBsaXN0ZW5lci5oYW5kbGVyKTtcbiAgfVxuXG4gIHRoaXMuX2xpc3RlbmVycy5sZW5ndGggPSAwO1xuXG4gIHRoaXMuX2lzRGVzdHJveWVkID0gdHJ1ZTtcbn07XG5cblNlYW1sZXNzcGF5QnVzLnByb3RvdHlwZS5fbG9nID0gZnVuY3Rpb24gKGZ1bmN0aW9uTmFtZSwgYXJncykge1xuICBpZiAodGhpcy5faXNWZXJib3NlKSB7XG4gICAgY29uc29sZS5sb2coZnVuY3Rpb25OYW1lLCBhcmdzKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gIH1cbn07XG5cblNlYW1sZXNzcGF5QnVzLmV2ZW50cyA9IGV2ZW50cztcblxubW9kdWxlLmV4cG9ydHMgPSBTZWFtbGVzc3BheUJ1cztcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIFZFUlNJT046IFwid2ViLXNka1wiLFxuICBBU1NFVFNfSE9TVDogXCJodHRwczovL3dlYi1zZGstZXhhbXBsZXMuc2VhbWxlc3NwYXkuZGV2XCIsXG4gIEFTU0VUU19TM19CVUNLRVQ6IFwid2ViLXNkay5zZWFtbGVzc3BheS5jb21cIixcbiAgQVBJX1VSTF9QUk9EVUNUSU9OOiBcImh0dHBzOi8vYXBpLnNlYW1sZXNzcGF5LmNvbVwiLFxuICBBUElfVVJMX1NBTkRCT1g6IFwiaHR0cHM6Ly9hcGkuc2FuZGJveC5zZWFtbGVzc3BheS5jb21cIixcbiAgQVBJX1VSTF9TVEFHSU5HOiBcImh0dHBzOi8vYXBpLnNlYW1sZXNzcGF5LmRldlwiLFxuICBQQU5fVkFVTFRfVVJMX1BST0RVQ1RJT046IFwiaHR0cHM6Ly9wYW4tdmF1bHQuc2VhbWxlc3NwYXkuY29tXCIsXG4gIFBBTl9WQVVMVF9VUkxfU0FOREJPWDogXCJodHRwczovL3Bhbi12YXVsdC5zYW5kYm94LnNlYW1sZXNzcGF5LmNvbVwiLFxuICBQQU5fVkFVTFRfVVJMX1NUQUdJTkc6IFwiaHR0cHM6Ly9wYW4tdmF1bHQuc2VhbWxlc3NwYXkuZGV2XCIsXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgU2VhbWxlc3NwYXlFcnJvciA9IHJlcXVpcmUoJy4vc2VhbWxlc3NwYXktZXJyb3InKTtcblxuZnVuY3Rpb24gY29udmVydFRvU2VhbWxlc3NwYXlFcnJvcihvcmlnaW5hbEVyciwgb3RoZXJFcnJvck9iamVjdCkge1xuICBpZiAob3JpZ2luYWxFcnIgaW5zdGFuY2VvZiBTZWFtbGVzc3BheUVycm9yIHx8IChvcmlnaW5hbEVyciAmJiBvcmlnaW5hbEVyci5uYW1lID09PSAnU2VhbWxlc3NwYXlFcnJvcicpKSB7XG4gICAgcmV0dXJuIG9yaWdpbmFsRXJyO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBTZWFtbGVzc3BheUVycm9yKHtcbiAgICB0eXBlOiBvdGhlckVycm9yT2JqZWN0LnR5cGUsXG4gICAgY29kZTogb3RoZXJFcnJvck9iamVjdC5jb2RlLFxuICAgIG1lc3NhZ2U6IG90aGVyRXJyb3JPYmplY3QubWVzc2FnZSxcbiAgICBkZXRhaWxzOiB7XG4gICAgICBvcmlnaW5hbEVycm9yOiBvcmlnaW5hbEVyclxuICAgIH1cbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29udmVydFRvU2VhbWxlc3NwYXlFcnJvcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gZW51bWVyYXRlKHZhbHVlcywgcHJlZml4KSB7XG4gIHByZWZpeCA9IHByZWZpeCA9PSBudWxsID8gJycgOiBwcmVmaXg7XG5cbiAgcmV0dXJuIHZhbHVlcy5yZWR1Y2UoZnVuY3Rpb24gKGVudW1lcmF0aW9uLCB2YWx1ZSkge1xuICAgIGVudW1lcmF0aW9uW3ZhbHVlXSA9IHByZWZpeCArIHZhbHVlO1xuICAgIHJldHVybiBlbnVtZXJhdGlvbjtcbiAgfSwge30pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGVudW1lcmF0ZTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFNlYW1sZXNzcGF5RXJyb3IgPSByZXF1aXJlKCcuL3NlYW1sZXNzcGF5LWVycm9yJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBJTlZBTElEX1VTRV9PRl9JTlRFUk5BTF9GVU5DVElPTjoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuSU5URVJOQUwsXG4gICAgY29kZTogJ0lOVkFMSURfVVNFX09GX0lOVEVSTkFMX0ZVTkNUSU9OJ1xuICB9LFxuICBDQUxMQkFDS19SRVFVSVJFRDoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTUVSQ0hBTlQsXG4gICAgY29kZTogJ0NBTExCQUNLX1JFUVVJUkVEJ1xuICB9LFxuICBJTlNUQU5USUFUSU9OX09QVElPTl9SRVFVSVJFRDoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTUVSQ0hBTlQsXG4gICAgY29kZTogJ0lOU1RBTlRJQVRJT05fT1BUSU9OX1JFUVVJUkVEJ1xuICB9LFxuICBJTlZBTElEX09QVElPTjoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTUVSQ0hBTlQsXG4gICAgY29kZTogJ0lOVkFMSURfT1BUSU9OJ1xuICB9LFxuICBJTkNPTVBBVElCTEVfVkVSU0lPTlM6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLk1FUkNIQU5ULFxuICAgIGNvZGU6ICdJTkNPTVBBVElCTEVfVkVSU0lPTlMnXG4gIH0sXG4gIElOQ09NUEFUSUJMRV9GSUVMRFNfU0VUOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnSU5DT01QQVRJQkxFX0ZJRUxEU19TRVQnXG4gIH0sXG4gIE1FVEhPRF9DQUxMRURfQUZURVJfVEVBUkRPV046IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLk1FUkNIQU5ULFxuICAgIGNvZGU6ICdNRVRIT0RfQ0FMTEVEX0FGVEVSX1RFQVJET1dOJ1xuICB9LFxuICBTRUFNTEVTU1BBWV9BUElfQUNDRVNTX1JFU1RSSUNURUQ6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLk1FUkNIQU5ULFxuICAgIGNvZGU6ICdTRUFNTEVTU1BBWV9BUElfQUNDRVNTX1JFU1RSSUNURUQnLFxuICAgIG1lc3NhZ2U6ICdZb3VyIGFjY2VzcyBpcyByZXN0cmljdGVkIGFuZCBjYW5ub3QgdXNlIHRoaXMgcGFydCBvZiB0aGUgU2VhbWxlc3NwYXkgQVBJLidcbiAgfSxcbiAgU0VBTUxFU1NQQVlfUEFZUEFMX05PVF9MT0FERUQ6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLklOVEVSTkFMLFxuICAgIGNvZGU6ICdTRUFNTEVTU1BBWV9QQVlQQUxfTk9UX0xPQURFRCcsXG4gICAgbWVzc2FnZTogJ1BheXBhbCBTREsgY291bGQgbm90IGJlIGxvYWRlZC4nXG4gIH0sXG4gIElOVkFMSURfTEFUSU4xX1NUUklORzoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuSU5URVJOQUwsXG4gICAgY29kZTogJ0lOVkFMSURfTEFUSU4xX1NUUklORydcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIEFQSV9IT1NUID0gdW5kZWZpbmVkO1xudmFyIFBBTlZBVUxUX0hPU1QgPSB1bmRlZmluZWQ7XG52YXIgQVNTRVRTX0hPU1QgPSBcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMS9kZXZcIjtcblxudmFyIGxlZ2FsSG9zdHMgPSBbXG4gICdzZWFtbGVzc3BheS5jb20nLFxuICAnc2VhbWxlc3NwYXkuZGV2JyxcbiAgJ3NlYW1sZXNzcGF5LmlvJyxcbiAgJ3dlYi1zZGsuc2VhbWxlc3NwYXkuY29tJyxcbiAgJ2FwaS5zZWFtbGVzc3BheS5jb20nLFxuICAnYXBpLnNlYW1sZXNzcGF5LmRldicsXG4gICdhcGkuc2VhbWxlc3NwYXkuaW8nLFxuICAncGFuLXZhdWx0LnNlYW1sZXNzcGF5LmNvbScsXG4gICdwYW4tdmF1bHQuc2VhbWxlc3NwYXkuZGV2JyxcbiAgJ3Bhbi12YXVsdC5zZWFtbGVzc3BheS5pbycsXG4gICdhcGkuc2FuZGJveC5zZWFtbGVzc3BheS5jb20nLFxuICAnYXBpLnNhbmRib3guc2VhbWxlc3NwYXkuZGV2JyxcbiAgJ2FwaS5zYW5kYm94LnNlYW1sZXNzcGF5LmlvJyxcbiAgJ3Bhbi12YXVsdC5zYW5kYm94LnNlYW1sZXNzcGF5LmNvbScsXG4gICdwYW4tdmF1bHQuc2FuZGJveC5zZWFtbGVzc3BheS5kZXYnLFxuICAncGFuLXZhdWx0LnNhbmRib3guc2VhbWxlc3NwYXkuaW8nXG5dO1xuXG4vLyByZW1vdmVJZihwcm9kdWN0aW9uKVxubGVnYWxIb3N0cy5wdXNoKCdsb2NhbGhvc3QnKTtcbmlmIChBUElfSE9TVCkge1xuICBsZWdhbEhvc3RzLnB1c2goc3RyaXBTdWJkb21haW5zKEFQSV9IT1NUKSk7XG59XG5pZiAoUEFOVkFVTFRfSE9TVCkge1xuICBsZWdhbEhvc3RzLnB1c2goc3RyaXBTdWJkb21haW5zKFBBTlZBVUxUX0hPU1QpKTtcbn1cbmlmIChBU1NFVFNfSE9TVCkge1xuICBsZWdhbEhvc3RzLnB1c2goc3RyaXBTdWJkb21haW5zKEFTU0VUU19IT1NUKS5yZXBsYWNlKCdodHRwOi8vJywgJycpLnJlcGxhY2UoJ2h0dHBzOi8vJywgJycpKTtcbn1cbi8vIGVuZFJlbW92ZUlmKHByb2R1Y3Rpb24pXG5cbmZ1bmN0aW9uIHN0cmlwU3ViZG9tYWlucyhkb21haW4pIHtcbiAgcmV0dXJuIGRvbWFpbi5zcGxpdCgnLicpLnNsaWNlKC0yKS5qb2luKCcuJyk7XG59XG5cbmZ1bmN0aW9uIGlzV2hpdGVsaXN0ZWREb21haW4odXJsKSB7XG4gIC8vIHZhciBtYWluRG9tYWluO1xuXG4gIC8vIHVybCA9IHVybC50b0xvd2VyQ2FzZSgpO1xuXG4gIC8vIGlmICghKG5ldyBSZWdFeHAoJ15odHRwcz86JykpLnRlc3QodXJsKSkge1xuICAvLyAgIHJldHVybiBmYWxzZTtcbiAgLy8gfVxuXG4gIC8vIHBhcnNlciA9IHBhcnNlciB8fCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gIC8vIHBhcnNlci5ocmVmID0gdXJsO1xuICAvLyBtYWluRG9tYWluID0gc3RyaXBTdWJkb21haW5zKHBhcnNlci5ob3N0bmFtZSk7XG4gIHRyeSB7XG4gICAgdmFyIHBhcnNlZFVybCA9IG5ldyBVUkwodXJsKTtcbiAgICByZXR1cm4gbGVnYWxIb3N0cy5pbmRleE9mKHN0cmlwU3ViZG9tYWlucyhwYXJzZWRVcmwuaG9zdG5hbWUpKSAhPT0gLTE7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc1doaXRlbGlzdGVkRG9tYWluO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBvbmNlKGZuKSB7XG4gIHZhciBjYWxsZWQgPSBmYWxzZTtcblxuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGlmICghY2FsbGVkKSB7XG4gICAgICBjYWxsZWQgPSB0cnVlO1xuICAgICAgZm4uYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICB9XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb25jZTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFByb21pc2UgPSBnbG9iYWwuUHJvbWlzZTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm9taXNlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBfbm90RW1wdHkob2JqKSB7XG4gIHZhciBrZXk7XG5cbiAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7IHJldHVybiB0cnVlOyB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIF9pc0FycmF5KHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHR5cGVvZiB2YWx1ZS5sZW5ndGggPT09ICdudW1iZXInICYmXG4gICAgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgQXJyYXldJyB8fCBmYWxzZTtcbn1cblxuZnVuY3Rpb24gcGFyc2UodXJsKSB7XG4gIHZhciBxdWVyeSwgcGFyYW1zO1xuXG4gIHVybCA9IHVybCB8fCBnbG9iYWwubG9jYXRpb24uaHJlZjtcblxuICBpZiAoIS9cXD8vLnRlc3QodXJsKSkge1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIHF1ZXJ5ID0gdXJsLnJlcGxhY2UoLyMuKiQvLCAnJykucmVwbGFjZSgvXi4qXFw/LywgJycpLnNwbGl0KCcmJyk7XG5cbiAgcGFyYW1zID0gcXVlcnkucmVkdWNlKGZ1bmN0aW9uICh0b1JldHVybiwga2V5VmFsdWUpIHtcbiAgICB2YXIgcGFydHMgPSBrZXlWYWx1ZS5zcGxpdCgnPScpO1xuICAgIHZhciBrZXkgPSBkZWNvZGVVUklDb21wb25lbnQocGFydHNbMF0pO1xuICAgIHZhciB2YWx1ZSA9IGRlY29kZVVSSUNvbXBvbmVudChwYXJ0c1sxXSk7XG5cbiAgICB0b1JldHVybltrZXldID0gdmFsdWU7XG4gICAgcmV0dXJuIHRvUmV0dXJuO1xuICB9LCB7fSk7XG5cbiAgcmV0dXJuIHBhcmFtcztcbn1cblxuZnVuY3Rpb24gc3RyaW5naWZ5KHBhcmFtcywgbmFtZXNwYWNlKSB7XG4gIHZhciBrLCB2LCBwO1xuICB2YXIgcXVlcnkgPSBbXTtcblxuICBmb3IgKHAgaW4gcGFyYW1zKSB7XG4gICAgaWYgKCFwYXJhbXMuaGFzT3duUHJvcGVydHkocCkpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHYgPSBwYXJhbXNbcF07XG5cbiAgICBpZiAobmFtZXNwYWNlKSB7XG4gICAgICBpZiAoX2lzQXJyYXkocGFyYW1zKSkge1xuICAgICAgICBrID0gbmFtZXNwYWNlICsgJ1tdJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGsgPSBuYW1lc3BhY2UgKyAnWycgKyBwICsgJ10nO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBrID0gcDtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB2ID09PSAnb2JqZWN0Jykge1xuICAgICAgcXVlcnkucHVzaChzdHJpbmdpZnkodiwgaykpO1xuICAgIH0gZWxzZSB7XG4gICAgICBxdWVyeS5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChrKSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh2KSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHF1ZXJ5LmpvaW4oJyYnKTtcbn1cblxuZnVuY3Rpb24gcXVlcnlpZnkodXJsLCBwYXJhbXMpIHtcbiAgdXJsID0gdXJsIHx8ICcnO1xuXG4gIGlmIChwYXJhbXMgIT0gbnVsbCAmJiB0eXBlb2YgcGFyYW1zID09PSAnb2JqZWN0JyAmJiBfbm90RW1wdHkocGFyYW1zKSkge1xuICAgIHVybCArPSB1cmwuaW5kZXhPZignPycpID09PSAtMSA/ICc/JyA6ICcnO1xuICAgIHVybCArPSB1cmwuaW5kZXhPZignPScpICE9PSAtMSA/ICcmJyA6ICcnO1xuICAgIHVybCArPSBzdHJpbmdpZnkocGFyYW1zKTtcbiAgfVxuXG4gIHJldHVybiB1cmw7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBwYXJzZTogcGFyc2UsXG4gIHN0cmluZ2lmeTogc3RyaW5naWZ5LFxuICBxdWVyeWlmeTogcXVlcnlpZnlcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBlbnVtZXJhdGUgPSByZXF1aXJlKCcuL2VudW1lcmF0ZScpO1xuXG4vKipcbiAqIEBjbGFzc1xuICogQGdsb2JhbFxuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgQ29uc3RydWN0aW9uIG9wdGlvbnNcbiAqIEBjbGFzc2Rlc2MgVGhpcyBjbGFzcyBpcyB1c2VkIHRvIHJlcG9ydCBlcnJvciBjb25kaXRpb25zLCBmcmVxdWVudGx5IGFzIHRoZSBmaXJzdCBwYXJhbWV0ZXIgdG8gY2FsbGJhY2tzIHRocm91Z2hvdXQgdGhlIFNlYW1sZXNzcGF5IFNESy5cbiAqIEBkZXNjcmlwdGlvbiA8c3Ryb25nPllvdSBjYW5ub3QgdXNlIHRoaXMgY29uc3RydWN0b3IgZGlyZWN0bHkuIEludGVyYWN0IHdpdGggaW5zdGFuY2VzIG9mIHRoaXMgY2xhc3MgdGhyb3VnaCB7QGxpbmsgY2FsbGJhY2sgY2FsbGJhY2tzfS48L3N0cm9uZz5cbiAqL1xuZnVuY3Rpb24gU2VhbWxlc3NwYXlFcnJvcihvcHRpb25zKSB7XG4gIGlmICghU2VhbWxlc3NwYXlFcnJvci50eXBlcy5oYXNPd25Qcm9wZXJ0eShvcHRpb25zLnR5cGUpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKG9wdGlvbnMudHlwZSArICcgaXMgbm90IGEgdmFsaWQgdHlwZS4nKTtcbiAgfVxuXG4gIGlmICghb3B0aW9ucy5jb2RlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdFcnJvciBjb2RlIHJlcXVpcmVkLicpO1xuICB9XG5cbiAgaWYgKCFvcHRpb25zLm1lc3NhZ2UpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yIG1lc3NhZ2UgcmVxdWlyZWQuJyk7XG4gIH1cblxuICB0aGlzLm5hbWUgPSAnU2VhbWxlc3NwYXlFcnJvcic7XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqIEBkZXNjcmlwdGlvbiBBIGNvZGUgdGhhdCBjb3JyZXNwb25kcyB0byBzcGVjaWZpYyBlcnJvcnMuXG4gICAqL1xuICB0aGlzLmNvZGUgPSBvcHRpb25zLmNvZGU7XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqIEBkZXNjcmlwdGlvbiBBIHNob3J0IGRlc2NyaXB0aW9uIG9mIHRoZSBlcnJvci5cbiAgICovXG4gIHRoaXMubWVzc2FnZSA9IG9wdGlvbnMubWVzc2FnZTtcblxuICAvKipcbiAgICogQHR5cGUge1NlYW1sZXNzcGF5RXJyb3IudHlwZXN9XG4gICAqIEBkZXNjcmlwdGlvbiBUaGUgdHlwZSBvZiBlcnJvci5cbiAgICovXG4gIHRoaXMudHlwZSA9IG9wdGlvbnMudHlwZTtcblxuICAvKipcbiAgICogQHR5cGUge29iamVjdD19XG4gICAqIEBkZXNjcmlwdGlvbiBBZGRpdGlvbmFsIGluZm9ybWF0aW9uIGFib3V0IHRoZSBlcnJvciwgc3VjaCBhcyBhbiB1bmRlcmx5aW5nIG5ldHdvcmsgZXJyb3IgcmVzcG9uc2UuXG4gICAqL1xuICB0aGlzLmRldGFpbHMgPSBvcHRpb25zLmRldGFpbHM7XG59XG5cblNlYW1sZXNzcGF5RXJyb3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFcnJvci5wcm90b3R5cGUpO1xuU2VhbWxlc3NwYXlFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBTZWFtbGVzc3BheUVycm9yO1xuXG4vKipcbiAqIEVudW0gZm9yIHtAbGluayBTZWFtbGVzc3BheUVycm9yfSB0eXBlcy5cbiAqIEBuYW1lIFNlYW1sZXNzcGF5RXJyb3IudHlwZXNcbiAqIEBlbnVtXG4gKiBAcmVhZG9ubHlcbiAqIEBtZW1iZXJvZiBTZWFtbGVzc3BheUVycm9yXG4gKiBAcHJvcGVydHkge3N0cmluZ30gQ1VTVE9NRVIgQW4gZXJyb3IgY2F1c2VkIGJ5IHRoZSBjdXN0b21lci5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBNRVJDSEFOVCBBbiBlcnJvciB0aGF0IGlzIGFjdGlvbmFibGUgYnkgdGhlIG1lcmNoYW50LlxuICogQHByb3BlcnR5IHtzdHJpbmd9IE5FVFdPUksgQW4gZXJyb3IgZHVlIHRvIGEgbmV0d29yayBwcm9ibGVtLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IElOVEVSTkFMIEFuIGVycm9yIGNhdXNlZCBieSBTZWFtbGVzc3BheSBjb2RlLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IFVOS05PV04gQW4gZXJyb3Igd2hlcmUgdGhlIG9yaWdpbiBpcyB1bmtub3duLlxuICovXG5TZWFtbGVzc3BheUVycm9yLnR5cGVzID0gZW51bWVyYXRlKFtcbiAgJ0NVU1RPTUVSJyxcbiAgJ01FUkNIQU5UJyxcbiAgJ05FVFdPUksnLFxuICAnSU5URVJOQUwnLFxuICAnVU5LTk9XTidcbl0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNlYW1sZXNzcGF5RXJyb3I7XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIHV1aWQoKSB7XG4gIHJldHVybiAneHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4Jy5yZXBsYWNlKC9beHldL2csIGZ1bmN0aW9uIChjKSB7XG4gICAgdmFyIHIgPSBNYXRoLnJhbmRvbSgpICogMTYgfCAwO1xuICAgIHZhciB2ID0gYyA9PT0gJ3gnID8gciA6IHIgJiAweDMgfCAweDg7XG5cbiAgICByZXR1cm4gdi50b1N0cmluZygxNik7XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHV1aWQ7XG4iXX0=
