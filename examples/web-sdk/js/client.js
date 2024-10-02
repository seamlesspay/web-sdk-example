(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.seamlesspay || (g.seamlesspay = {})).client = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(_dereq_,module,exports){
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

},{}],2:[function(_dereq_,module,exports){
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

},{}],3:[function(_dereq_,module,exports){
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

},{}],4:[function(_dereq_,module,exports){
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

},{"./lib/deferred":1,"./lib/once":2,"./lib/promise-or-callback":3}],5:[function(_dereq_,module,exports){
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

},{"../lib/add-metadata":18,"../lib/assign":19,"../lib/constants":20,"../lib/convert-to-seamlesspay-error":21,"../lib/errors":24,"../lib/is-whitelisted-domain":25,"../lib/promise":28,"../lib/seamlesspay-error":30,"./constants":6,"./errors":7,"./request":12}],6:[function(_dereq_,module,exports){
'use strict';

module.exports = {
  SEAMLESSPAY_API_VERSION_HEADER: 'v2020'
};

},{}],7:[function(_dereq_,module,exports){
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

},{"../lib/seamlesspay-error":30}],8:[function(_dereq_,module,exports){
(function (global){(function (){
'use strict';

var SeamlesspayError = _dereq_('../lib/seamlesspay-error');
var Promise = _dereq_('../lib/promise');
var wrapPromise = _dereq_('@braintree/wrap-promise');
var uuid = _dereq_('../lib/uuid');
var constants = _dereq_('../lib/constants');
var createAuthorizationData = _dereq_('../lib/create-authorization-data');
var errors = _dereq_('./errors');

var apiUrls = {
  production: constants.API_URL_PRODUCTION,
  live: constants.API_URL_PRODUCTION,
  sandbox: constants.API_URL_SANDBOX,
  staging: constants.API_URL_STAGING
};

var tokenizerApiUrls = {
  production: constants.PAN_VAULT_URL_PRODUCTION,
  live: constants.PAN_VAULT_URL_PRODUCTION,
  sandbox: constants.PAN_VAULT_URL_SANDBOX,
  staging: constants.PAN_VAULT_URL_STAGING
};

function getEnvironment(options) {
  var defaultEnvironment = 'live';
  var allowedEnvironments = ['production', 'sandbox', 'live', 'staging'];
  var environment = options.environment || defaultEnvironment;

  if (!allowedEnvironments.includes(environment)) {
    throw new SeamlesspayError({
      type: errors.CLIENT_OPTION_INVALID.type,
      code: errors.CLIENT_OPTION_INVALID.code,
      message: 'Unknown environment identifier "' + environment + '"',
    });
  }

  return environment;
}

function getConfiguration(options) {
  var environment = getEnvironment(options);

  return new Promise(function (resolve, reject) {
    var configuration, authData, attrs;
    var sessionId = uuid();
    var analyticsMetadata = {
      merchantAppId: global.location.host,
      sdkVersion: constants.VERSION,
      sessionId: sessionId
    };
    var tokenizerApi = options.tokenizerApi || {};
    var transactionApi = options.transactionApi || {};
    var seamlesspayApi = options.seamlesspayApi || {};

    try {
      authData = createAuthorizationData(options.authorization);
    } catch (err) {
      reject(new SeamlesspayError(errors.CLIENT_INVALID_AUTHORIZATION));

      return;
    }
    attrs = authData.attrs;

    configuration = {
      isDebug: false,
      metadata: options.metadata,
      authorizationType: attrs.tokenizationKey ? 'TOKENIZATION_KEY' : 'CLIENT_TOKEN',
      authorization: options.authorization,
      tokenType: attrs.tokenType,
      analyticsMetadata: analyticsMetadata,
      gatewayConfiguration: {
        proxyAccountId: options.proxyAccountId,
        assetsUrl: constants.ASSETS_HOST,
        environment: environment,
        clientApiUrl: apiUrls[environment],
        checkoutUrl: '', //@TODO: Temporary unsupported
        tokenizerApi: {
          url: tokenizerApi.url || tokenizerApiUrls[environment],
          accessToken: authData.accessToken
        },
        transactionApi: {
          url: transactionApi.url || apiUrls[environment],
          accessToken: transactionApi.accessToken,
          publishableToken: authData.accessToken,
          isSeamlesspay: !('url' in transactionApi),
          source: transactionApi.source || ''
        },
        creditCards: {
          supportedGateways: [
            {
              name: 'clientApi'
            }
          ],
          supportedCardTypes: [ // @TODO: this should be returned by seamlesspay api (according to given authorization - publishable key)
            'Visa',
            'Mastercard',
            'American Express',
            'Diners Club',
            'Discover',
            'JCB',
            'UnionPay',
            'Maestro'
          ],
          endpoints: {

          }
        },
        seamlesspayApi: {
          accessToken: seamlesspayApi.accessToken || authData.accessToken,
          publishableToken: authData.accessToken,
          url: seamlesspayApi.url || apiUrls[environment]
        }
      }
    };

    resolve(configuration);
  });
}

module.exports = {
  getConfiguration: wrapPromise(getConfiguration),
  apiEnvironmentUrls: apiUrls
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../lib/constants":20,"../lib/create-authorization-data":22,"../lib/promise":28,"../lib/seamlesspay-error":30,"../lib/uuid":31,"./errors":7,"@braintree/wrap-promise":4}],9:[function(_dereq_,module,exports){
'use strict';

var SeamlesspayError = _dereq_('../lib/seamlesspay-error');
var Client = _dereq_('./client');
var getConfigurationModule = _dereq_('./get-configuration');
var VERSION = "web-sdk";
var Promise = _dereq_('../lib/promise');
var wrapPromise = _dereq_('@braintree/wrap-promise');
var sharedErrors = _dereq_('../lib/errors');

var getConfiguration = getConfigurationModule.getConfiguration;
var apiEnvironmentUrls = getConfigurationModule.apiEnvironmentUrls;

/** @module seamlesspay-web/client */

/**
 * @function
 * @description This function is the entry point for the <code>seamlesspay.client</code> module. It is used for creating {@link Client} instances that service communication to Seamlesspay servers.
 * @param {object} options Object containing all {@link Client} options:
 * @param {string} options.authorization A tokenizationKey or clientToken.
 * @param {callback} [callback] The second argument, <code>data</code>, is the {@link Client} instance.
 * @returns {Promise|void} Returns a promise that resolves the client instance if no callback is provided.
 * @example
 * var createClient = require('seamlesspay-web/client').create;
 *
 * createClient({
 *   authorization: CLIENT_AUTHORIZATION
 * }, function (createErr, clientInstance) {
 *   // ...
 * });
 * @static
 */
function create(options) {
  if (!options.authorization) {
    var error = new SeamlesspayError({
      type: sharedErrors.INSTANTIATION_OPTION_REQUIRED.type,
      code: sharedErrors.INSTANTIATION_OPTION_REQUIRED.code,
      message: 'options.authorization is required when instantiating a client.'
    });

    return Promise.reject(error);
  }

  return getConfiguration(options)
    .then(function (configuration) {
      if (options.debug) {
        configuration.isDebug = true;
      }
      var client = new Client(configuration);

      return client;
    });
}

module.exports = {
  create: wrapPromise(create),
  getApiUrl: function (environment) {
    return apiEnvironmentUrls[environment]
  },
  /**
   * @description The current version of the SDK, i.e. `{@pkg version}`.
   * @type {string}
   */
  VERSION: VERSION
};

},{"../lib/errors":24,"../lib/promise":28,"../lib/seamlesspay-error":30,"./client":5,"./get-configuration":8,"@braintree/wrap-promise":4}],10:[function(_dereq_,module,exports){
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

},{"../../lib/assign":19,"../../lib/querystring":29,"./parse-body":15,"./prep-body":16}],11:[function(_dereq_,module,exports){
(function (global){(function (){
'use strict';

module.exports = function getUserAgent() {
  return global.navigator.userAgent;
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],12:[function(_dereq_,module,exports){
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

},{"../../lib/once":26,"./ajax-driver":10,"./get-user-agent":11,"./is-http":13,"./jsonp-driver":14}],13:[function(_dereq_,module,exports){
(function (global){(function (){
'use strict';

module.exports = function () {
  return global.location.protocol === 'http:';
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],14:[function(_dereq_,module,exports){
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

},{"../../lib/querystring":29,"../../lib/uuid":31}],15:[function(_dereq_,module,exports){
'use strict';

module.exports = function (body) {
  try {
    body = JSON.parse(body);
  } catch (e) { /* ignored */ }

  return body;
};

},{}],16:[function(_dereq_,module,exports){
'use strict';

module.exports = function (method, body) {
  if (String(method).toLowerCase() !== 'get' && body != null) {
    body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  return body;
};

},{}],17:[function(_dereq_,module,exports){
'use strict';
/* eslint-disable no-reserved-keys */

var enumerate = _dereq_('../../lib/enumerate');
var VERSION = "web-sdk";

var paymentTypes = {
  PAYMENT_TYPE_CREDIT: 'credit_card',
  PAYMENT_TYPE_ACH: 'ach',
  PAYMENT_TYPE_GIFT_CARD: 'gift_card'
};

var BIN_LOOKUP_MAX_LENGTH = 6;
var TOKEN_TYPE_CHECKOUT = 'CHECKOUT';
var CREDIT = paymentTypes.PAYMENT_TYPE_CREDIT;
var ACH = paymentTypes.PAYMENT_TYPE_ACH;
var GIFT = paymentTypes.PAYMENT_TYPE_GIFT_CARD;

var requestTypes = {
  REQUEST_TYPE_TOKENIZATION: 'tokenization'
};

var tokenizerNonSecureFields = [
  'billingAddress',
  'company',
  'email',
  'name',
  'phoneNumber',
  'customer',
  'accountValidation',
  'bankAccountType',
  'routingNumber'
];

var GIFT_CARD_MIN_LENGTH = 12;
var GIFT_CARD_MAX_LENGTH = 20;

var whitelistedFields = {};
whitelistedFields[CREDIT] = {
  // PAN-VAULT:
  accountNumber: {
    name: 'account-number',
    label: 'Card Number',
    defaultMaxLength: 22
  },
  postalCode: {
    name: 'postal-code',
    label: 'Customer postal code',
    defaultMaxLength: 5
  },
  expDate: {
    name: 'exp-date',
    label: 'Expiration Date',
    defaultMaxLength: 5
  },
  cvv: {
    name: 'cvv',
    label: 'CVV',
    defaultMaxLength: 4
  },
  name: {
    name: 'name',
    label: 'Cardholder Name',
    defaultMaxLength: 64
  },
};

whitelistedFields[ACH] = {
  // PAN-VAULT:
  accountNumber: { // *
    name: 'account-number',
    label: 'Bank Card Number',
    defaultMaxLength: 16
  },
  verifyAccountNumber: {
    name: 'verify-account-number',
    label: 'Verify Card Number',
    defaultMaxLength: 16
  },
  postalCode: {
    name: 'postal-code',
    label: 'Customer postal code',
    defaultMaxLength: 5
  }
};

whitelistedFields[GIFT] = {
  // PAN-VAULT:
  accountNumber: {
    name: 'account-number',
    label: 'Card Number',
    defaultMaxLength: 22
  },
  postalCode: {
    name: 'postal-code',
    label: 'Customer postal code',
    defaultMaxLength: 5
  }
};

var constants = {
  VERSION: VERSION,
  maxExpirationYearAge: 31,
  externalEvents: {
    CHANGE: 'change',
    FOCUS: 'focus',
    BLUR: 'blur',
    EMPTY: 'empty',
    NOT_EMPTY: 'notEmpty',
    VALIDITY_CHANGE: 'validityChange',
    CARD_TYPE_CHANGE: 'cardTypeChange',
    CARD_INFO_LOADED: 'cardInfoLoaded'
  },
  externalClasses: {
    POTENTIALLY_VALID: 'seamlesspay-hosted-fields-potentially-valid',
    FOCUSED: 'seamlesspay-hosted-fields-focused',
    INVALID: 'seamlesspay-hosted-fields-invalid',
    VALID: 'seamlesspay-hosted-fields-valid'
  },
  defaultIFrameStyle: {
    border: 'none',
    width: '100%',
    height: '100%',
    'float': 'left'
  },
  whitelistedStyles: [
    '-moz-appearance',
    '-moz-osx-font-smoothing',
    '-moz-tap-highlight-color',
    '-moz-transition',
    '-webkit-appearance',
    '-webkit-font-smoothing',
    '-webkit-tap-highlight-color',
    '-webkit-transition',
    'appearance',
    'border-radius',
    'color',
    'direction',
    'font',
    'font-family',
    'font-size',
    'font-size-adjust',
    'font-stretch',
    'font-style',
    'font-variant',
    'font-variant-alternates',
    'font-variant-caps',
    'font-variant-east-asian',
    'font-variant-ligatures',
    'font-variant-numeric',
    'font-weight',
    'letter-spacing',
    'line-height',
    'margin',
    'margin-top',
    'margin-right',
    'margin-bottom',
    'margin-left',
    'opacity',
    'outline',
    'padding',
    'padding-top',
    'padding-right',
    'padding-bottom',
    'padding-left',
    'text-align',
    'text-shadow',
    'transition'
  ],
  whitelistedFields: whitelistedFields,
  whitelistedAttributes: {
    'aria-invalid': 'boolean',
    'aria-required': 'boolean',
    disabled: 'boolean',
    placeholder: 'string'
  },
  autocompleteMappings: {
    'account-number': 'cc-number',
    'exp-date': 'cc-exp',
    cvv: 'cc-csc',
    'postal-code': 'billing postal-code',
    name: 'cc-name',
  },
  paymentTypes: paymentTypes,
  requestTypes: requestTypes,
  GIFT_CARD_MIN_LENGTH: GIFT_CARD_MIN_LENGTH,
  GIFT_CARD_MAX_LENGTH: GIFT_CARD_MAX_LENGTH,
  TOKEN_TYPE_CHECKOUT: TOKEN_TYPE_CHECKOUT,
  BIN_LOOKUP_MAX_LENGTH: BIN_LOOKUP_MAX_LENGTH,
  tokenizerNonSecureFields: tokenizerNonSecureFields,
  cardBrandMap: {
    visa: 'visa',
    mastercard: 'mastercard',
    'american-express': 'amex',
    'diners-club': 'diners',
    discover: 'discover',
    jcb: 'jcb',
    unionpay: 'unionpay',
    maestro: 'mastercard',
    elo: 'discover',
    mir: 'unknown',
    hiper: 'discover',
    hipercard: 'discover'
  }
};

constants.events = enumerate([
  'AUTOFILL_EXPIRATION_DATE',
  'POPULATE_TOKEN',
  'FRAME_READY',
  'VALIDATE_STRICT',
  'CONFIGURATION',
  'TOKENIZATION_REQUEST',
  'INPUT_EVENT',
  'TRIGGER_INPUT_FOCUS',
  'ADD_CLASS',
  'REMOVE_CLASS',
  'SET_ATTRIBUTE',
  'REMOVE_ATTRIBUTE',
  'CLEAR_FIELD'
], 'hosted-fields:');

module.exports = constants;

},{"../../lib/enumerate":23}],18:[function(_dereq_,module,exports){
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

},{}],19:[function(_dereq_,module,exports){
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

},{}],20:[function(_dereq_,module,exports){
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

},{"./seamlesspay-error":30}],22:[function(_dereq_,module,exports){
'use strict';

var btoa = _dereq_('../lib/polyfill').btoa;

var constants = _dereq_('../hosted-fields/shared/constants');

function _isCheckoutKey(str) {
  try {
    return str.includes('CHS');
  } catch (err) {
    return false;
  }
}

function _isOtpToken(str) {
  var otpTokenRE = /^OTP_[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;
  return otpTokenRE.test(str);
}

function _isTokenizationKey(str) {
  return /^[a-z]+_[a-zA-Z0-9]+_[a-zA-Z0-9]+$/.test(str) || /^[a-z]+_[a-zA-Z0-9]+$/.test(str);
}

function createAuthorizationData(authorization) {
  var data = {
    attrs: {},
  };

  var selectedAuth = [
    {
      isAuth: function () {
        return _isCheckoutKey(authorization);
      },
      setData: function () {
        data.attrs.tokenType = constants.TOKEN_TYPE_CHECKOUT;
        data.attrs.tokenizationKey = authorization;
        data.accessToken = btoa(authorization, { isSensitive: true });
      }
    },
    {
      isAuth: function () { return _isOtpToken(authorization); },
      setData: function () {
        data.attrs.tokenizationKey = authorization;
        data.accessToken = authorization;
      }
    },
    {
      isAuth: function () { return _isTokenizationKey(authorization); },
      setData: function () {
        data.attrs.tokenizationKey = authorization;
        data.accessToken = btoa(authorization, { isSensitive: true });
      }
    }
  ].filter(function (auth) {
    return auth.isAuth()
  }).shift();

  selectedAuth.setData()

  return data;
}

module.exports = createAuthorizationData;

},{"../hosted-fields/shared/constants":17,"../lib/polyfill":27}],23:[function(_dereq_,module,exports){
'use strict';

function enumerate(values, prefix) {
  prefix = prefix == null ? '' : prefix;

  return values.reduce(function (enumeration, value) {
    enumeration[value] = prefix + value;
    return enumeration;
  }, {});
}

module.exports = enumerate;

},{}],24:[function(_dereq_,module,exports){
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

},{"./seamlesspay-error":30}],25:[function(_dereq_,module,exports){
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

},{}],26:[function(_dereq_,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"dup":2}],27:[function(_dereq_,module,exports){
(function (global){(function (){
'use strict';
var SeamlesspayError = _dereq_('./seamlesspay-error');
var sharedErrors = _dereq_('./errors');

var atobNormalized = typeof global.atob === 'function' ? global.atob : atob;
var btoaNormalized = typeof global.btoa === 'function' ? global.btoa : btoa;
var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function atob(base64String) {
  var a, b, c, b1, b2, b3, b4, i;
  var base64Matcher = new RegExp('^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})([=]{1,2})?$');
  var result = '';
  if (!base64Matcher.test(base64String)) {
    throw new Error('Non base64 encoded input passed to window.atob polyfill');
  }

  i = 0;
  do {
    b1 = characters.indexOf(base64String.charAt(i++));
    b2 = characters.indexOf(base64String.charAt(i++));
    b3 = characters.indexOf(base64String.charAt(i++));
    b4 = characters.indexOf(base64String.charAt(i++));

    a = (b1 & 0x3F) << 2 | b2 >> 4 & 0x3;
    b = (b2 & 0xF) << 4 | b3 >> 2 & 0xF;
    c = (b3 & 0x3) << 6 | b4 & 0x3F;

    result += String.fromCharCode(a) + (b ? String.fromCharCode(b) : '') + (c ? String.fromCharCode(c) : '');
  } while (i < base64String.length);

  return result;
}

function btoa(string) {
  string = String(string);
  var bitmap, a, b, c,
    result = "", i = 0,
    rest = string.length % 3; // To determine the final padding

  for (; i < string.length;) {
    if ((a = string.charCodeAt(i++)) > 255
      || (b = string.charCodeAt(i++)) > 255
      || (c = string.charCodeAt(i++)) > 255)
      throw new TypeError("Failed to execute 'btoa' on 'Window': The string to be encoded contains characters outside of the Latin1 range.");
    bitmap = (a << 16) | (b << 8) | c;
    result += characters.charAt(bitmap >> 18 & 63) + characters.charAt(bitmap >> 12 & 63)
      + characters.charAt(bitmap >> 6 & 63) + characters.charAt(bitmap & 63);
  }
  // If there's need of padding, replace the last 'A's with equal signs
  return rest ? result.slice(0, rest - 3) + "===".substring(rest) : result;
}

function validateLatin1CharactersDecorator(func) {
  return function (string, options) {
    var isSensitive = (options || {}).isSensitive;
    var i = 0;
    string = String(string);
    while (i < string.length) {
      if (string.charCodeAt(i++) > 255)
        throw new SeamlesspayError({
          type: sharedErrors.INVALID_LATIN1_STRING.type,
          code: sharedErrors.INVALID_LATIN1_STRING.code,
          message: "Failed to execute 'btoa' on 'Window': The string to be encoded contains invalid character '" +
            string[i - 1] +
            "' at position " + (i - 1) + " of string" +
            (!isSensitive ? " '" + string + "'" : "") + "."
        });
    }

    return func.apply(this, [string]);
  };
}

module.exports = {
  atob: atobNormalized,
  btoa: validateLatin1CharactersDecorator(btoaNormalized),
  _atob: atob,
  _btoa: btoa
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./errors":24,"./seamlesspay-error":30}],28:[function(_dereq_,module,exports){
(function (global){(function (){
'use strict';

var Promise = global.Promise;

module.exports = Promise;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],29:[function(_dereq_,module,exports){
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

},{}],30:[function(_dereq_,module,exports){
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

},{"./enumerate":23}],31:[function(_dereq_,module,exports){
'use strict';

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : r & 0x3 | 0x8;

    return v.toString(16);
  });
}

module.exports = uuid;

},{}]},{},[9])(9)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvQGJyYWludHJlZS93cmFwLXByb21pc2UvbGliL2RlZmVycmVkLmpzIiwibm9kZV9tb2R1bGVzL0BicmFpbnRyZWUvd3JhcC1wcm9taXNlL2xpYi9vbmNlLmpzIiwibm9kZV9tb2R1bGVzL0BicmFpbnRyZWUvd3JhcC1wcm9taXNlL2xpYi9wcm9taXNlLW9yLWNhbGxiYWNrLmpzIiwibm9kZV9tb2R1bGVzL0BicmFpbnRyZWUvd3JhcC1wcm9taXNlL3dyYXAtcHJvbWlzZS5qcyIsInNyYy9jbGllbnQvY2xpZW50LmpzIiwic3JjL2NsaWVudC9jb25zdGFudHMuanMiLCJzcmMvY2xpZW50L2Vycm9ycy5qcyIsInNyYy9jbGllbnQvZ2V0LWNvbmZpZ3VyYXRpb24uanMiLCJzcmMvY2xpZW50L2luZGV4LmpzIiwic3JjL2NsaWVudC9yZXF1ZXN0L2FqYXgtZHJpdmVyLmpzIiwic3JjL2NsaWVudC9yZXF1ZXN0L2dldC11c2VyLWFnZW50LmpzIiwic3JjL2NsaWVudC9yZXF1ZXN0L2luZGV4LmpzIiwic3JjL2NsaWVudC9yZXF1ZXN0L2lzLWh0dHAuanMiLCJzcmMvY2xpZW50L3JlcXVlc3QvanNvbnAtZHJpdmVyLmpzIiwic3JjL2NsaWVudC9yZXF1ZXN0L3BhcnNlLWJvZHkuanMiLCJzcmMvY2xpZW50L3JlcXVlc3QvcHJlcC1ib2R5LmpzIiwic3JjL2hvc3RlZC1maWVsZHMvc2hhcmVkL2NvbnN0YW50cy5qcyIsInNyYy9saWIvYWRkLW1ldGFkYXRhLmpzIiwic3JjL2xpYi9hc3NpZ24uanMiLCJzcmMvbGliL2NvbnN0YW50cy5qcyIsInNyYy9saWIvY29udmVydC10by1zZWFtbGVzc3BheS1lcnJvci5qcyIsInNyYy9saWIvY3JlYXRlLWF1dGhvcml6YXRpb24tZGF0YS5qcyIsInNyYy9saWIvZW51bWVyYXRlLmpzIiwic3JjL2xpYi9lcnJvcnMuanMiLCJzcmMvbGliL2lzLXdoaXRlbGlzdGVkLWRvbWFpbi5qcyIsInNyYy9saWIvcG9seWZpbGwuanMiLCJzcmMvbGliL3Byb21pc2UuanMiLCJzcmMvbGliL3F1ZXJ5c3RyaW5nLmpzIiwic3JjL2xpYi9zZWFtbGVzc3BheS1lcnJvci5qcyIsInNyYy9saWIvdXVpZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzVIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM1R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDdkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gZGVmZXJyZWQoZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAvLyBJRTkgZG9lc24ndCBzdXBwb3J0IHBhc3NpbmcgYXJndW1lbnRzIHRvIHNldFRpbWVvdXQgc28gd2UgaGF2ZSB0byBlbXVsYXRlIGl0LlxuICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBmbi5hcHBseShudWxsLCBhcmdzKTtcbiAgICB9LCAxKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkZWZlcnJlZDtcbiIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gb25jZShmbikge1xuICB2YXIgY2FsbGVkID0gZmFsc2U7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIWNhbGxlZCkge1xuICAgICAgY2FsbGVkID0gdHJ1ZTtcbiAgICAgIGZuLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG9uY2U7XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIHByb21pc2VPckNhbGxiYWNrKHByb21pc2UsIGNhbGxiYWNrKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgY29uc2lzdGVudC1yZXR1cm5cbiAgaWYgKGNhbGxiYWNrKSB7XG4gICAgcHJvbWlzZVxuICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgZGF0YSk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcHJvbWlzZU9yQ2FsbGJhY2s7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBkZWZlcnJlZCA9IHJlcXVpcmUoJy4vbGliL2RlZmVycmVkJyk7XG52YXIgb25jZSA9IHJlcXVpcmUoJy4vbGliL29uY2UnKTtcbnZhciBwcm9taXNlT3JDYWxsYmFjayA9IHJlcXVpcmUoJy4vbGliL3Byb21pc2Utb3ItY2FsbGJhY2snKTtcblxuZnVuY3Rpb24gd3JhcFByb21pc2UoZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2FsbGJhY2s7XG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgIHZhciBsYXN0QXJnID0gYXJnc1thcmdzLmxlbmd0aCAtIDFdO1xuXG4gICAgaWYgKHR5cGVvZiBsYXN0QXJnID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjYWxsYmFjayA9IGFyZ3MucG9wKCk7XG4gICAgICBjYWxsYmFjayA9IG9uY2UoZGVmZXJyZWQoY2FsbGJhY2spKTtcbiAgICB9XG4gICAgcmV0dXJuIHByb21pc2VPckNhbGxiYWNrKGZuLmFwcGx5KHRoaXMsIGFyZ3MpLCBjYWxsYmFjayk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8taW52YWxpZC10aGlzXG4gIH07XG59XG5cbndyYXBQcm9taXNlLndyYXBQcm90b3R5cGUgPSBmdW5jdGlvbiAodGFyZ2V0LCBvcHRpb25zKSB7XG4gIHZhciBtZXRob2RzLCBpZ25vcmVNZXRob2RzLCBpbmNsdWRlUHJpdmF0ZU1ldGhvZHM7XG5cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGlnbm9yZU1ldGhvZHMgPSBvcHRpb25zLmlnbm9yZU1ldGhvZHMgfHwgW107XG4gIGluY2x1ZGVQcml2YXRlTWV0aG9kcyA9IG9wdGlvbnMudHJhbnNmb3JtUHJpdmF0ZU1ldGhvZHMgPT09IHRydWU7XG5cbiAgbWV0aG9kcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRhcmdldC5wcm90b3R5cGUpLmZpbHRlcihmdW5jdGlvbiAobWV0aG9kKSB7XG4gICAgdmFyIGlzTm90UHJpdmF0ZU1ldGhvZDtcbiAgICB2YXIgaXNOb25Db25zdHJ1Y3RvckZ1bmN0aW9uID0gbWV0aG9kICE9PSAnY29uc3RydWN0b3InICYmXG4gICAgICB0eXBlb2YgdGFyZ2V0LnByb3RvdHlwZVttZXRob2RdID09PSAnZnVuY3Rpb24nO1xuICAgIHZhciBpc05vdEFuSWdub3JlZE1ldGhvZCA9IGlnbm9yZU1ldGhvZHMuaW5kZXhPZihtZXRob2QpID09PSAtMTtcblxuICAgIGlmIChpbmNsdWRlUHJpdmF0ZU1ldGhvZHMpIHtcbiAgICAgIGlzTm90UHJpdmF0ZU1ldGhvZCA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlzTm90UHJpdmF0ZU1ldGhvZCA9IG1ldGhvZC5jaGFyQXQoMCkgIT09ICdfJztcbiAgICB9XG5cbiAgICByZXR1cm4gaXNOb25Db25zdHJ1Y3RvckZ1bmN0aW9uICYmXG4gICAgICBpc05vdFByaXZhdGVNZXRob2QgJiZcbiAgICAgIGlzTm90QW5JZ25vcmVkTWV0aG9kO1xuICB9KTtcblxuICBtZXRob2RzLmZvckVhY2goZnVuY3Rpb24gKG1ldGhvZCkge1xuICAgIHZhciBvcmlnaW5hbCA9IHRhcmdldC5wcm90b3R5cGVbbWV0aG9kXTtcblxuICAgIHRhcmdldC5wcm90b3R5cGVbbWV0aG9kXSA9IHdyYXBQcm9taXNlKG9yaWdpbmFsKTtcbiAgfSk7XG5cbiAgcmV0dXJuIHRhcmdldDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gd3JhcFByb21pc2U7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciByZXF1ZXN0ID0gcmVxdWlyZSgnLi9yZXF1ZXN0Jyk7XG52YXIgaXNXaGl0ZWxpc3RlZERvbWFpbiA9IHJlcXVpcmUoJy4uL2xpYi9pcy13aGl0ZWxpc3RlZC1kb21haW4nKTtcbnZhciBTZWFtbGVzc3BheUVycm9yID0gcmVxdWlyZSgnLi4vbGliL3NlYW1sZXNzcGF5LWVycm9yJyk7XG52YXIgY29udmVydFRvU2VhbWxlc3NwYXlFcnJvciA9IHJlcXVpcmUoJy4uL2xpYi9jb252ZXJ0LXRvLXNlYW1sZXNzcGF5LWVycm9yJyk7XG52YXIgYWRkTWV0YWRhdGEgPSByZXF1aXJlKCcuLi9saWIvYWRkLW1ldGFkYXRhJyk7XG52YXIgUHJvbWlzZSA9IHJlcXVpcmUoJy4uL2xpYi9wcm9taXNlJyk7XG52YXIgYXNzaWduID0gcmVxdWlyZSgnLi4vbGliL2Fzc2lnbicpLmFzc2lnbjtcbnZhciBjb25zdGFudHMgPSByZXF1aXJlKCcuL2NvbnN0YW50cycpO1xudmFyIGVycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzJyk7XG52YXIgc2hhcmVkRXJyb3JzID0gcmVxdWlyZSgnLi4vbGliL2Vycm9ycycpO1xudmFyIFZFUlNJT04gPSByZXF1aXJlKCcuLi9saWIvY29uc3RhbnRzJykuVkVSU0lPTjtcblxuLyoqXG4gKiBUaGlzIG9iamVjdCBpcyByZXR1cm5lZCBieSB7QGxpbmsgQ2xpZW50I2dldENvbmZpZ3VyYXRpb258Z2V0Q29uZmlndXJhdGlvbn0uIFRoaXMgaW5mb3JtYXRpb24gaXMgdXNlZCBleHRlbnNpdmVseSBieSBvdGhlciBTZWFtbGVzc3BheSBtb2R1bGVzIHRvIHByb3Blcmx5IGNvbmZpZ3VyZSB0aGVtc2VsdmVzLlxuICogQHR5cGVkZWYge29iamVjdH0gQ2xpZW50fmNvbmZpZ3VyYXRpb25cbiAqIEBwcm9wZXJ0eSB7b2JqZWN0fSBjbGllbnQgVGhlIHNlYW1sZXNzcGF5LXdlYi9jbGllbnQgcGFyYW1ldGVycy5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBjbGllbnQuYXV0aG9yaXphdGlvbiBBIHRva2VuaXphdGlvbktleSBvciBjbGllbnRUb2tlbi5cbiAqIEBwcm9wZXJ0eSB7b2JqZWN0fSBnYXRld2F5Q29uZmlndXJhdGlvbiBHYXRld2F5LXN1cHBsaWVkIGNvbmZpZ3VyYXRpb24uXG4gKiBAcHJvcGVydHkge29iamVjdH0gYW5hbHl0aWNzTWV0YWRhdGEgQW5hbHl0aWNzLXNwZWNpZmljIGRhdGEuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gYW5hbHl0aWNzTWV0YWRhdGEuc2Vzc2lvbklkIFVuaXF1ZWx5IGlkZW50aWZpZXMgYSBicm93c2luZyBzZXNzaW9uLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IGFuYWx5dGljc01ldGFkYXRhLnNka1ZlcnNpb24gVGhlIHNlYW1sZXNzcGF5LmpzIHZlcnNpb24uXG4gKiBAcHJvcGVydHkge3N0cmluZ30gYW5hbHl0aWNzTWV0YWRhdGEubWVyY2hhbnRBcHBJZCBJZGVudGlmaWVzIHRoZSBtZXJjaGFudCdzIHdlYiBhcHAuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gcHJveHlBY2NvdW50SWQgSWRlbnRpZmllcyB0aGUgU3ViIE1lcmNoYW50IEFjY291bnQgSUQuXG4gKi9cblxuLyoqXG4gKiBAY2xhc3NcbiAqIEBwYXJhbSB7Q2xpZW50fmNvbmZpZ3VyYXRpb259IGNvbmZpZ3VyYXRpb24gT3B0aW9uc1xuICogQGRlc2NyaXB0aW9uIDxzdHJvbmc+RG8gbm90IHVzZSB0aGlzIGNvbnN0cnVjdG9yIGRpcmVjdGx5LiBVc2Uge0BsaW5rIG1vZHVsZTpzZWFtbGVzc3BheS13ZWIvY2xpZW50LmNyZWF0ZXxzZWFtbGVzc3BheS5jbGllbnQuY3JlYXRlfSBpbnN0ZWFkLjwvc3Ryb25nPlxuICogQGNsYXNzZGVzYyBUaGlzIGNsYXNzIGlzIHJlcXVpcmVkIGJ5IG1hbnkgb3RoZXIgU2VhbWxlc3NwYXkgY29tcG9uZW50cy4gSXQgc2VydmVzIGFzIHRoZSBiYXNlIEFQSSBsYXllciB0aGF0IGNvbW11bmljYXRlcyB3aXRoIG91ciBzZXJ2ZXJzLiBJdCBpcyBhbHNvIGNhcGFibGUgb2YgYmVpbmcgdXNlZCB0byBmb3JtdWxhdGUgZGlyZWN0IGNhbGxzIHRvIG91ciBzZXJ2ZXJzLCBzdWNoIGFzIGRpcmVjdCBjcmVkaXQgY2FyZCB0b2tlbml6YXRpb24uIFNlZSB7QGxpbmsgQ2xpZW50I3JlcXVlc3R9LlxuICovXG5mdW5jdGlvbiBDbGllbnQoY29uZmlndXJhdGlvbikge1xuICB2YXJcbiAgICBjb25maWd1cmF0aW9uSlNPTixcbiAgICBnYXRld2F5Q29uZmlndXJhdGlvbixcbiAgICBzZWFtbGVzc3BheUFwaUNvbmZpZ3VyYXRpb247XG5cbiAgY29uZmlndXJhdGlvbiA9IGNvbmZpZ3VyYXRpb24gfHwge307XG5cbiAgY29uZmlndXJhdGlvbkpTT04gPSBKU09OLnN0cmluZ2lmeShjb25maWd1cmF0aW9uKTtcbiAgZ2F0ZXdheUNvbmZpZ3VyYXRpb24gPSBjb25maWd1cmF0aW9uLmdhdGV3YXlDb25maWd1cmF0aW9uO1xuXG4gIGlmICghZ2F0ZXdheUNvbmZpZ3VyYXRpb24pIHtcbiAgICB0aHJvdyBuZXcgU2VhbWxlc3NwYXlFcnJvcihlcnJvcnMuQ0xJRU5UX01JU1NJTkdfR0FURVdBWV9DT05GSUdVUkFUSU9OKTtcbiAgfVxuICBbXG4gICAgJ2Fzc2V0c1VybCcsXG4gICAgJ2NsaWVudEFwaVVybCcsXG4gICAgJ3Rva2VuaXplckFwaSdcbiAgXS5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wZXJ0eSkge1xuICAgIHZhciBjb25maWdVcmwgPSAoZ2F0ZXdheUNvbmZpZ3VyYXRpb25bcHJvcGVydHldICYmIGdhdGV3YXlDb25maWd1cmF0aW9uW3Byb3BlcnR5XS51cmwpIHx8IGdhdGV3YXlDb25maWd1cmF0aW9uW3Byb3BlcnR5XTtcbiAgICBpZiAocHJvcGVydHkgaW4gZ2F0ZXdheUNvbmZpZ3VyYXRpb24gJiYgIWlzV2hpdGVsaXN0ZWREb21haW4oY29uZmlnVXJsKSkge1xuICAgICAgdGhyb3cgbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgICB0eXBlOiBlcnJvcnMuQ0xJRU5UX0dBVEVXQVlfQ09ORklHVVJBVElPTl9JTlZBTElEX0RPTUFJTi50eXBlLFxuICAgICAgICBjb2RlOiBlcnJvcnMuQ0xJRU5UX0dBVEVXQVlfQ09ORklHVVJBVElPTl9JTlZBTElEX0RPTUFJTi5jb2RlLFxuICAgICAgICBtZXNzYWdlOiBwcm9wZXJ0eSArICcgcHJvcGVydHkgaXMgb24gYW4gaW52YWxpZCBkb21haW4uICgnICsgY29uZmlnVXJsICsgJyknXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgY29weSBvZiB0aGUgY29uZmlndXJhdGlvbiB2YWx1ZXMuXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge0NsaWVudH5jb25maWd1cmF0aW9ufSBjb25maWd1cmF0aW9uXG4gICAqL1xuICB0aGlzLmdldENvbmZpZ3VyYXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UoY29uZmlndXJhdGlvbkpTT04pO1xuICB9O1xuXG4gIHRoaXMuX3JlcXVlc3QgPSByZXF1ZXN0O1xuXG4gIHRoaXMuX2NvbmZpZ3VyYXRpb24gPSB0aGlzLmdldENvbmZpZ3VyYXRpb24oKTtcblxuICB0aGlzLl9jbGllbnRBcGlCYXNlVXJsID0gZ2F0ZXdheUNvbmZpZ3VyYXRpb24uY2xpZW50QXBpVXJsICsgJy8nO1xuICB0aGlzLl90b2tlbml6ZXJBcGkgPSBnYXRld2F5Q29uZmlndXJhdGlvbi50b2tlbml6ZXJBcGk7XG5cbiAgc2VhbWxlc3NwYXlBcGlDb25maWd1cmF0aW9uID0gZ2F0ZXdheUNvbmZpZ3VyYXRpb24uc2VhbWxlc3NwYXlBcGk7XG4gIGlmIChzZWFtbGVzc3BheUFwaUNvbmZpZ3VyYXRpb24pIHtcbiAgICB0aGlzLl9zZWFtbGVzc3BheUFwaSA9IHtcbiAgICAgIGJhc2VVcmw6IHNlYW1sZXNzcGF5QXBpQ29uZmlndXJhdGlvbi51cmwgKyAnLycsXG4gICAgICBhY2Nlc3NUb2tlbjogc2VhbWxlc3NwYXlBcGlDb25maWd1cmF0aW9uLmFjY2Vzc1Rva2VuLFxuICAgICAgcHVibGlzaGFibGVUb2tlbjogc2VhbWxlc3NwYXlBcGlDb25maWd1cmF0aW9uLnB1Ymxpc2hhYmxlVG9rZW5cbiAgICB9O1xuICAgIGlmICghaXNXaGl0ZWxpc3RlZERvbWFpbih0aGlzLl9zZWFtbGVzc3BheUFwaS5iYXNlVXJsKSkge1xuICAgICAgdGhyb3cgbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgICB0eXBlOiBlcnJvcnMuQ0xJRU5UX0dBVEVXQVlfQ09ORklHVVJBVElPTl9JTlZBTElEX0RPTUFJTi50eXBlLFxuICAgICAgICBjb2RlOiBlcnJvcnMuQ0xJRU5UX0dBVEVXQVlfQ09ORklHVVJBVElPTl9JTlZBTElEX0RPTUFJTi5jb2RlLFxuICAgICAgICBtZXNzYWdlOiAnc2VhbWxlc3NwYXlBcGkgVVJMIGlzIG9uIGFuIGludmFsaWQgZG9tYWluLidcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFVzZWQgYnkgb3RoZXIgbW9kdWxlcyB0byBmb3JtdWxhdGUgYWxsIG5ldHdvcmsgcmVxdWVzdHMgdG8gdGhlIFNlYW1sZXNzcGF5IGdhdGV3YXkuIEl0IGlzIGFsc28gY2FwYWJsZSBvZiBiZWluZyB1c2VkIGRpcmVjdGx5IGZyb20geW91ciBvd24gZm9ybSB0byB0b2tlbml6ZSBjcmVkaXQgY2FyZCBpbmZvcm1hdGlvbi4gSG93ZXZlciwgYmUgc3VyZSB0byBzYXRpc2Z5IFBDSSBjb21wbGlhbmNlIGlmIHlvdSB1c2UgZGlyZWN0IGNhcmQgdG9rZW5pemF0aW9uLlxuICogQHB1YmxpY1xuICogQGZ1bmN0aW9uXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyBSZXF1ZXN0IG9wdGlvbnM6XG4gKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9ucy5tZXRob2QgSFRUUCBtZXRob2QsIGUuZy4gXCJnZXRcIiBvciBcInBvc3RcIi5cbiAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLmVuZHBvaW50IEVuZHBvaW50IHBhdGgsIGUuZy4gXCJwYXltZW50X21ldGhvZHNcIi5cbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zLmRhdGEgRGF0YSB0byBzZW5kIHdpdGggdGhlIHJlcXVlc3QuXG4gKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMudGltZW91dD02MDAwMF0gU2V0IGEgdGltZW91dCAoaW4gbWlsbGlzZWNvbmRzKSBmb3IgdGhlIHJlcXVlc3QuXG4gKiBAcGFyYW0ge2NhbGxiYWNrfSBbY2FsbGJhY2tdIFRoZSBzZWNvbmQgYXJndW1lbnQsIDxjb2RlPmRhdGE8L2NvZGU+LCBpcyB0aGUgcmV0dXJuZWQgc2VydmVyIGRhdGEuXG4gKiBAZXhhbXBsZVxuICogPGNhcHRpb24+RGlyZWN0IENyZWRpdCBDYXJkIFRva2VuaXphdGlvbjwvY2FwdGlvbj5cbiAqIHZhciBjcmVhdGVDbGllbnQgPSByZXF1aXJlKCdzZWFtbGVzc3BheS13ZWIvY2xpZW50JykuY3JlYXRlO1xuICpcbiAqIGNyZWF0ZUNsaWVudCh7XG4gKiAgIGVudmlyb25tZW50OiAnc2FuZGJveCdcbiAqICAgYXV0aG9yaXphdGlvbjogQ0xJRU5UX0FVVEhPUklaQVRJT05cbiAqIH0sIGZ1bmN0aW9uIChjcmVhdGVFcnIsIGNsaWVudEluc3RhbmNlKSB7XG4gKiAgIHZhciBmb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ215LWZvcm0taWQnKTtcbiAqICAgdmFyIGRhdGEgPSB7XG4gKiAgICAgY3JlZGl0Q2FyZDoge1xuICogICAgICAgbnVtYmVyOiBmb3JtWydjYy1udW1iZXInXS52YWx1ZSxcbiAqICAgICAgIGN2djogZm9ybVsnY2MtY3Z2J10udmFsdWUsXG4gKiAgICAgICBleHBEYXRlOiBmb3JtWydjYy1kYXRlJ10udmFsdWUsXG4gKiAgICAgICBiaWxsaW5nQWRkcmVzczoge1xuICogICAgICAgICBwb3N0YWxDb2RlOiBmb3JtWydjYy1wb3N0YWwnXS52YWx1ZVxuICogICAgICAgfSxcbiAqICAgICAgIG9wdGlvbnM6IHtcbiAqICAgICAgICAgdmFsaWRhdGU6IGZhbHNlXG4gKiAgICAgICB9XG4gKiAgICAgfVxuICogICB9O1xuICpcbiAqICAgLy8gV2FybmluZzogRm9yIGEgbWVyY2hhbnQgdG8gYmUgZWxpZ2libGUgZm9yIHRoZSBlYXNpZXN0IGxldmVsIG9mIFBDSSBjb21wbGlhbmNlIChTQVEgQSksXG4gKiAgIC8vIHBheW1lbnQgZmllbGRzIGNhbm5vdCBiZSBob3N0ZWQgb24geW91ciBjaGVja291dCBwYWdlLlxuICogICAvLyBGb3IgYW4gYWx0ZXJuYXRpdmUgdG8gdGhlIGZvbGxvd2luZywgdXNlIEhvc3RlZCBGaWVsZHMuXG4gKiAgIGNsaWVudEluc3RhbmNlLnJlcXVlc3Qoe1xuICogICAgIGVuZHBvaW50OiAncGF5bWVudF9tZXRob2RzL2NyZWRpdF9jYXJkcycsXG4gKiAgICAgbWV0aG9kOiAncG9zdCcsXG4gKiAgICAgZGF0YTogZGF0YVxuICogICB9LCBmdW5jdGlvbiAocmVxdWVzdEVyciwgcmVzcG9uc2UpIHtcbiAqICAgICAvLyBNb3JlIGRldGFpbGVkIGV4YW1wbGUgb2YgaGFuZGxpbmcgQVBJIGVycm9yczogaHR0cHM6Ly9jb2RlcGVuLmlvL3NlYW1sZXNzcGF5L3Blbi9NYndqZE1cbiAqICAgICBpZiAocmVxdWVzdEVycikgeyB0aHJvdyBuZXcgRXJyb3IocmVxdWVzdEVycik7IH1cbiAqXG4gKiAgICAgY29uc29sZS5sb2coJ0dvdCBub25jZTonLCByZXNwb25zZS5jcmVkaXRDYXJkc1swXS5ub25jZSk7XG4gKiAgIH0pO1xuICogfSk7XG4gKiBAcmV0dXJucyB7UHJvbWlzZXx2b2lkfSBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdpdGggdGhlIHJlcXVlc3QgcmVzcG9uc2UgaWYgbm8gY2FsbGJhY2sgaXMgcHJvdmlkZWQuXG4gKi9cbkNsaWVudC5wcm90b3R5cGUucmVxdWVzdCA9IGZ1bmN0aW9uIChvcHRpb25zLCBjYWxsYmFjaykge1xuICB2YXIgc2VsZiA9IHRoaXM7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8taW52YWxpZC10aGlzXG5cbiAgdmFyIHJlcXVlc3RQcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHZhciBvcHRpb25OYW1lLFxuICAgICAgYXBpLFxuICAgICAgcmVxdWVzdE9wdGlvbnMsXG4gICAgICBhcGlDb25maWcsXG4gICAgICBwcm94eUFjY291bnRJZCxcbiAgICAgIHB1Ymxpc2hhYmxlID0gb3B0aW9ucy5wdWJsaXNoYWJsZTtcblxuICAgIGlmICghb3B0aW9ucy5tZXRob2QpIHtcbiAgICAgIG9wdGlvbk5hbWUgPSAnb3B0aW9ucy5tZXRob2QnO1xuICAgIH0gZWxzZSBpZiAoIW9wdGlvbnMuZW5kcG9pbnQpIHtcbiAgICAgIG9wdGlvbk5hbWUgPSAnb3B0aW9ucy5lbmRwb2ludCc7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbk5hbWUpIHtcbiAgICAgIHRocm93IG5ldyBTZWFtbGVzc3BheUVycm9yKHtcbiAgICAgICAgdHlwZTogZXJyb3JzLkNMSUVOVF9PUFRJT05fUkVRVUlSRUQudHlwZSxcbiAgICAgICAgY29kZTogZXJyb3JzLkNMSUVOVF9PUFRJT05fUkVRVUlSRUQuY29kZSxcbiAgICAgICAgbWVzc2FnZTogb3B0aW9uTmFtZSArICcgaXMgcmVxdWlyZWQgd2hlbiBtYWtpbmcgYSByZXF1ZXN0LidcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICgnYXBpJyBpbiBvcHRpb25zKSB7XG4gICAgICBhcGkgPSBvcHRpb25zLmFwaTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpID0gJ2NsaWVudEFwaSc7XG4gICAgfVxuXG4gICAgcmVxdWVzdE9wdGlvbnMgPSB7XG4gICAgICBtZXRob2Q6IG9wdGlvbnMubWV0aG9kLFxuICAgICAgdGltZW91dDogb3B0aW9ucy50aW1lb3V0XG4gICAgfTtcblxuICAgIHZhciBjb21tb25IZWFkZXIgPSB7XG4gICAgICAnQVBJLVZlcnNpb24nOiBjb25zdGFudHMuU0VBTUxFU1NQQVlfQVBJX1ZFUlNJT05fSEVBREVSLFxuICAgICAgJ1NESy1WZXJzaW9uJzogVkVSU0lPTlxuICAgIH07XG5cbiAgICBwcm94eUFjY291bnRJZCA9IHNlbGYuZ2V0Q29uZmlndXJhdGlvbigpLmdhdGV3YXlDb25maWd1cmF0aW9uLnByb3h5QWNjb3VudElkO1xuXG4gICAgaWYgKGFwaSA9PT0gJ3Rva2VuaXplckFwaScpIHtcbiAgICAgIHJlcXVlc3RPcHRpb25zLnVybCA9IHNlbGYuX3Rva2VuaXplckFwaS51cmwgKyAnLycgKyBvcHRpb25zLmVuZHBvaW50O1xuICAgICAgcmVxdWVzdE9wdGlvbnMuZGF0YSA9IG9wdGlvbnMuZGF0YTtcbiAgICAgIHJlcXVlc3RPcHRpb25zLmhlYWRlcnMgPSB7XG4gICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgIEF1dGhvcml6YXRpb246ICdCZWFyZXIgJyArIHNlbGYuX3Rva2VuaXplckFwaS5hY2Nlc3NUb2tlblxuICAgICAgfTtcbiAgICAgIGlmIChwcm94eUFjY291bnRJZCkge1xuICAgICAgICByZXF1ZXN0T3B0aW9ucy5oZWFkZXJzWydTZWFtbGVzc1BheS1BY2NvdW50J10gPSBwcm94eUFjY291bnRJZDtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGFwaSA9PT0gJ3RyYW5zYWN0aW9uQXBpJykge1xuICAgICAgYXBpQ29uZmlnID0gc2VsZi5nZXRDb25maWd1cmF0aW9uKCkuZ2F0ZXdheUNvbmZpZ3VyYXRpb24udHJhbnNhY3Rpb25BcGk7XG4gICAgICByZXF1ZXN0T3B0aW9ucy51cmwgPSBhcGlDb25maWcuaXNTZWFtbGVzc3BheSA/IGFwaUNvbmZpZy51cmwgKyAnLycgKyBvcHRpb25zLmVuZHBvaW50IDogYXBpQ29uZmlnLnVybDtcbiAgICAgIHJlcXVlc3RPcHRpb25zLmRhdGEgPSBvcHRpb25zLmRhdGE7XG4gICAgICByZXF1ZXN0T3B0aW9ucy5oZWFkZXJzID0ge307XG4gICAgICBpZiAoYXBpQ29uZmlnLmFjY2Vzc1Rva2VuKSB7XG4gICAgICAgIHJlcXVlc3RPcHRpb25zLmhlYWRlcnNbJ0F1dGhvcml6YXRpb24nXSA9ICdCZWFyZXIgJyArIGFwaUNvbmZpZy5hY2Nlc3NUb2tlbjtcbiAgICAgIH1cbiAgICAgIGlmIChwcm94eUFjY291bnRJZCkge1xuICAgICAgICByZXF1ZXN0T3B0aW9ucy5oZWFkZXJzWydTZWFtbGVzc1BheS1BY2NvdW50J10gPSBwcm94eUFjY291bnRJZDtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGFwaSA9PT0gJ2NoZWNrb3V0QXBpJykge1xuICAgICAgYXBpQ29uZmlnID0gc2VsZi5nZXRDb25maWd1cmF0aW9uKCkuZ2F0ZXdheUNvbmZpZ3VyYXRpb24udHJhbnNhY3Rpb25BcGk7XG4gICAgICByZXF1ZXN0T3B0aW9ucy51cmwgPSBhcGlDb25maWcudXJsICsgJy8nICsgb3B0aW9ucy5lbmRwb2ludDtcbiAgICAgIHJlcXVlc3RPcHRpb25zLmRhdGEgPSBvcHRpb25zLmRhdGE7XG4gICAgICByZXF1ZXN0T3B0aW9ucy5oZWFkZXJzID0ge307XG4gICAgICBpZiAoYXBpQ29uZmlnLmFjY2Vzc1Rva2VuKSB7XG4gICAgICAgIHJlcXVlc3RPcHRpb25zLmhlYWRlcnNbJ0F1dGhvcml6YXRpb24nXSA9ICdCZWFyZXIgJyArIGFwaUNvbmZpZy5hY2Nlc3NUb2tlbjtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGFwaSA9PT0gJ2NsaWVudEFwaScpIHtcbiAgICAgIHJlcXVlc3RPcHRpb25zLnVybCA9IHNlbGYuX2NsaWVudEFwaUJhc2VVcmwgKyBvcHRpb25zLmVuZHBvaW50O1xuICAgICAgcmVxdWVzdE9wdGlvbnMuZGF0YSA9IGFkZE1ldGFkYXRhKHNlbGYuX2NvbmZpZ3VyYXRpb24sIG9wdGlvbnMuZGF0YSk7XG4gICAgfSBlbHNlIGlmIChhcGkgPT09ICdzZWFtbGVzc3BheUFwaScpIHtcbiAgICAgIGlmICghc2VsZi5fc2VhbWxlc3NwYXlBcGkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFNlYW1sZXNzcGF5RXJyb3Ioc2hhcmVkRXJyb3JzLlNFQU1MRVNTUEFZX0FQSV9BQ0NFU1NfUkVTVFJJQ1RFRCk7XG4gICAgICB9XG4gICAgICByZXF1ZXN0T3B0aW9ucy51cmwgPSBzZWxmLl9zZWFtbGVzc3BheUFwaS5iYXNlVXJsICsgb3B0aW9ucy5lbmRwb2ludDtcbiAgICAgIHJlcXVlc3RPcHRpb25zLmRhdGEgPSBvcHRpb25zLmRhdGE7XG4gICAgICByZXF1ZXN0T3B0aW9ucy5oZWFkZXJzID0ge1xuICAgICAgICBBdXRob3JpemF0aW9uOiAnQmVhcmVyICcgKyAocHVibGlzaGFibGUgPyBzZWxmLl9zZWFtbGVzc3BheUFwaS5wdWJsaXNoYWJsZVRva2VuIDogc2VsZi5fc2VhbWxlc3NwYXlBcGkuYWNjZXNzVG9rZW4pXG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAoYXBpID09PSAnZGlnaXRhbFdhbGxldEFwaScpIHtcbiAgICAgIGlmICghc2VsZi5fc2VhbWxlc3NwYXlBcGkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFNlYW1sZXNzcGF5RXJyb3Ioc2hhcmVkRXJyb3JzLlNFQU1MRVNTUEFZX0FQSV9BQ0NFU1NfUkVTVFJJQ1RFRCk7XG4gICAgICB9XG4gICAgICByZXF1ZXN0T3B0aW9ucy51cmwgPSBzZWxmLl9zZWFtbGVzc3BheUFwaS5iYXNlVXJsICsgb3B0aW9ucy5lbmRwb2ludDtcbiAgICAgIHJlcXVlc3RPcHRpb25zLmRhdGEgPSBvcHRpb25zLmRhdGE7XG4gICAgICByZXF1ZXN0T3B0aW9ucy5oZWFkZXJzID0ge1xuICAgICAgICBBdXRob3JpemF0aW9uOiAnQmVhcmVyICcgKyBvcHRpb25zLmRhdGEudG9rZW5cbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBTZWFtbGVzc3BheUVycm9yKHtcbiAgICAgICAgdHlwZTogZXJyb3JzLkNMSUVOVF9PUFRJT05fSU5WQUxJRC50eXBlLFxuICAgICAgICBjb2RlOiBlcnJvcnMuQ0xJRU5UX09QVElPTl9JTlZBTElELmNvZGUsXG4gICAgICAgIG1lc3NhZ2U6ICdvcHRpb25zLmFwaSBpcyBpbnZhbGlkLidcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJlcXVlc3RPcHRpb25zLmhlYWRlcnMgPSBhc3NpZ24oe30sIHJlcXVlc3RPcHRpb25zLmhlYWRlcnMsIGNvbW1vbkhlYWRlcik7XG5cbiAgICBzZWxmLl9yZXF1ZXN0KHJlcXVlc3RPcHRpb25zLCBmdW5jdGlvbiAoZXJyLCBkYXRhLCBzdGF0dXMpIHtcbiAgICAgIHZhciByZXNvbHZlZERhdGE7XG4gICAgICB2YXIgcmVxdWVzdEVycm9yID0gZm9ybWF0UmVxdWVzdEVycm9yKHN0YXR1cywgZXJyKTtcblxuICAgICAgaWYgKHJlcXVlc3RFcnJvcikge1xuICAgICAgICByZWplY3QocmVxdWVzdEVycm9yKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICByZXNvbHZlZERhdGEgPSBBcnJheS5pc0FycmF5KGRhdGEpICYmIHsgZGF0YTogZGF0YSwgX2h0dHBTdGF0dXM6IHN0YXR1cyB9IHx8XG4gICAgICAgIGFzc2lnbih7IF9odHRwU3RhdHVzOiBzdGF0dXMgfSwgZGF0YSk7XG5cbiAgICAgIHJlc29sdmUocmVzb2x2ZWREYXRhKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJlcXVlc3RQcm9taXNlLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICBjYWxsYmFjayhudWxsLCByZXNwb25zZSwgcmVzcG9uc2UuX2h0dHBTdGF0dXMpO1xuICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIHZhciBzdGF0dXMgPSBlcnIgJiYgZXJyLmRldGFpbHMgJiYgZXJyLmRldGFpbHMuaHR0cFN0YXR1cztcbiAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCwgc3RhdHVzKTtcbiAgICB9KTtcbiAgICByZXR1cm47XG4gIH1cblxuICByZXR1cm4gcmVxdWVzdFByb21pc2U7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgY29uc2lzdGVudC1yZXR1cm5cbn07XG5cbmZ1bmN0aW9uIGZvcm1hdFJlcXVlc3RFcnJvcihzdGF0dXMsIGVycikgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGNvbnNpc3RlbnQtcmV0dXJuXG4gIHZhciByZXF1ZXN0RXJyb3I7XG5cbiAgaWYgKHN0YXR1cyA9PT0gLTEpIHtcbiAgICByZXF1ZXN0RXJyb3IgPSBuZXcgU2VhbWxlc3NwYXlFcnJvcihlcnJvcnMuQ0xJRU5UX1JFUVVFU1RfVElNRU9VVCk7XG4gIH0gZWxzZSBpZiAoc3RhdHVzID09PSA0MDMpIHtcbiAgICByZXF1ZXN0RXJyb3IgPSBuZXcgU2VhbWxlc3NwYXlFcnJvcihlcnJvcnMuQ0xJRU5UX0FVVEhPUklaQVRJT05fSU5TVUZGSUNJRU5UKTtcbiAgfSBlbHNlIGlmIChzdGF0dXMgPT09IDQyOSkge1xuICAgIHJlcXVlc3RFcnJvciA9IG5ldyBTZWFtbGVzc3BheUVycm9yKGVycm9ycy5DTElFTlRfUkFURV9MSU1JVEVEKTtcbiAgfSBlbHNlIGlmIChzdGF0dXMgPj0gNTAwKSB7XG4gICAgcmVxdWVzdEVycm9yID0gbmV3IFNlYW1sZXNzcGF5RXJyb3IoZXJyb3JzLkNMSUVOVF9HQVRFV0FZX05FVFdPUkspO1xuICB9IGVsc2UgaWYgKHN0YXR1cyA8IDIwMCB8fCBzdGF0dXMgPj0gNDAwKSB7XG4gICAgcmVxdWVzdEVycm9yID0gY29udmVydFRvU2VhbWxlc3NwYXlFcnJvcihlcnIsIHtcbiAgICAgIHR5cGU6IGVycm9ycy5DTElFTlRfUkVRVUVTVF9FUlJPUi50eXBlLFxuICAgICAgY29kZTogZXJyb3JzLkNMSUVOVF9SRVFVRVNUX0VSUk9SLmNvZGUsXG4gICAgICBtZXNzYWdlOiBlcnJvcnMuQ0xJRU5UX1JFUVVFU1RfRVJST1IubWVzc2FnZVxuICAgIH0pO1xuICB9XG5cbiAgaWYgKHJlcXVlc3RFcnJvcikge1xuICAgIHJlcXVlc3RFcnJvci5kZXRhaWxzID0gcmVxdWVzdEVycm9yLmRldGFpbHMgfHwge307XG4gICAgcmVxdWVzdEVycm9yLmRldGFpbHMuaHR0cFN0YXR1cyA9IHN0YXR1cztcblxuICAgIHJldHVybiByZXF1ZXN0RXJyb3I7XG4gIH1cbn1cblxuQ2xpZW50LnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLmdldENvbmZpZ3VyYXRpb24oKTtcbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgQ2xpZW50IHZlcnNpb24uXG4gKiBAcHVibGljXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgY3JlYXRlZCBjbGllbnQncyB2ZXJzaW9uLlxuICogQGV4YW1wbGVcbiAqIHZhciBjcmVhdGVDbGllbnQgPSByZXF1aXJlKCdicmFpbnRyZWUtd2ViL2NsaWVudCcpLmNyZWF0ZTtcbiAqXG4gKiBjcmVhdGVDbGllbnQoe1xuICogICBhdXRob3JpemF0aW9uOiBDTElFTlRfQVVUSE9SSVpBVElPTlxuICogfSwgZnVuY3Rpb24gKGNyZWF0ZUVyciwgY2xpZW50SW5zdGFuY2UpIHtcbiAqICAgY29uc29sZS5sb2coY2xpZW50SW5zdGFuY2UuZ2V0VmVyc2lvbigpKTsgLy8gRXg6IDEuMC4wXG4gKiB9KTtcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5DbGllbnQucHJvdG90eXBlLmdldFZlcnNpb24gPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBWRVJTSU9OO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDbGllbnQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBTRUFNTEVTU1BBWV9BUElfVkVSU0lPTl9IRUFERVI6ICd2MjAyMCdcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBTZWFtbGVzc3BheUVycm9yID0gcmVxdWlyZSgnLi4vbGliL3NlYW1sZXNzcGF5LWVycm9yJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBDTElFTlRfR0FURVdBWV9DT05GSUdVUkFUSU9OX0lOVkFMSURfRE9NQUlOOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnQ0xJRU5UX0dBVEVXQVlfQ09ORklHVVJBVElPTl9JTlZBTElEX0RPTUFJTidcbiAgfSxcbiAgQ0xJRU5UX09QVElPTl9SRVFVSVJFRDoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTUVSQ0hBTlQsXG4gICAgY29kZTogJ0NMSUVOVF9PUFRJT05fUkVRVUlSRUQnXG4gIH0sXG4gIENMSUVOVF9PUFRJT05fSU5WQUxJRDoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTUVSQ0hBTlQsXG4gICAgY29kZTogJ0NMSUVOVF9PUFRJT05fSU5WQUxJRCdcbiAgfSxcbiAgQ0xJRU5UX01JU1NJTkdfR0FURVdBWV9DT05GSUdVUkFUSU9OOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5JTlRFUk5BTCxcbiAgICBjb2RlOiAnQ0xJRU5UX01JU1NJTkdfR0FURVdBWV9DT05GSUdVUkFUSU9OJyxcbiAgICBtZXNzYWdlOiAnTWlzc2luZyBnYXRld2F5Q29uZmlndXJhdGlvbi4nXG4gIH0sXG4gIENMSUVOVF9JTlZBTElEX0FVVEhPUklaQVRJT046IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLk1FUkNIQU5ULFxuICAgIGNvZGU6ICdDTElFTlRfSU5WQUxJRF9BVVRIT1JJWkFUSU9OJyxcbiAgICBtZXNzYWdlOiAnQXV0aG9yaXphdGlvbiBpcyBpbnZhbGlkLiBNYWtlIHN1cmUgeW91ciBjbGllbnQgdG9rZW4gb3IgdG9rZW5pemF0aW9uIGtleSBpcyB2YWxpZC4nXG4gIH0sXG4gIENMSUVOVF9HQVRFV0FZX05FVFdPUks6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLk5FVFdPUkssXG4gICAgY29kZTogJ0NMSUVOVF9HQVRFV0FZX05FVFdPUksnLFxuICAgIG1lc3NhZ2U6ICdDYW5ub3QgY29udGFjdCB0aGUgZ2F0ZXdheSBhdCB0aGlzIHRpbWUuJ1xuICB9LFxuICBDTElFTlRfUkVRVUVTVF9USU1FT1VUOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5ORVRXT1JLLFxuICAgIGNvZGU6ICdDTElFTlRfUkVRVUVTVF9USU1FT1VUJyxcbiAgICBtZXNzYWdlOiAnUmVxdWVzdCB0aW1lZCBvdXQgd2FpdGluZyBmb3IgYSByZXBseS4nXG4gIH0sXG4gIENMSUVOVF9SRVFVRVNUX0VSUk9SOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5ORVRXT1JLLFxuICAgIGNvZGU6ICdDTElFTlRfUkVRVUVTVF9FUlJPUicsXG4gICAgbWVzc2FnZTogJ1RoZXJlIHdhcyBhIHByb2JsZW0gd2l0aCB5b3VyIHJlcXVlc3QuJ1xuICB9LFxuICBDTElFTlRfUkFURV9MSU1JVEVEOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnQ0xJRU5UX1JBVEVfTElNSVRFRCcsXG4gICAgbWVzc2FnZTogJ1lvdSBhcmUgYmVpbmcgcmF0ZS1saW1pdGVkOyBwbGVhc2UgdHJ5IGFnYWluIGluIGEgZmV3IG1pbnV0ZXMuJ1xuICB9LFxuICBDTElFTlRfQVVUSE9SSVpBVElPTl9JTlNVRkZJQ0lFTlQ6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLk1FUkNIQU5ULFxuICAgIGNvZGU6ICdDTElFTlRfQVVUSE9SSVpBVElPTl9JTlNVRkZJQ0lFTlQnLFxuICAgIG1lc3NhZ2U6ICdUaGUgYXV0aG9yaXphdGlvbiB1c2VkIGhhcyBpbnN1ZmZpY2llbnQgcHJpdmlsZWdlcy4nXG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBTZWFtbGVzc3BheUVycm9yID0gcmVxdWlyZSgnLi4vbGliL3NlYW1sZXNzcGF5LWVycm9yJyk7XG52YXIgUHJvbWlzZSA9IHJlcXVpcmUoJy4uL2xpYi9wcm9taXNlJyk7XG52YXIgd3JhcFByb21pc2UgPSByZXF1aXJlKCdAYnJhaW50cmVlL3dyYXAtcHJvbWlzZScpO1xudmFyIHV1aWQgPSByZXF1aXJlKCcuLi9saWIvdXVpZCcpO1xudmFyIGNvbnN0YW50cyA9IHJlcXVpcmUoJy4uL2xpYi9jb25zdGFudHMnKTtcbnZhciBjcmVhdGVBdXRob3JpemF0aW9uRGF0YSA9IHJlcXVpcmUoJy4uL2xpYi9jcmVhdGUtYXV0aG9yaXphdGlvbi1kYXRhJyk7XG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMnKTtcblxudmFyIGFwaVVybHMgPSB7XG4gIHByb2R1Y3Rpb246IGNvbnN0YW50cy5BUElfVVJMX1BST0RVQ1RJT04sXG4gIGxpdmU6IGNvbnN0YW50cy5BUElfVVJMX1BST0RVQ1RJT04sXG4gIHNhbmRib3g6IGNvbnN0YW50cy5BUElfVVJMX1NBTkRCT1gsXG4gIHN0YWdpbmc6IGNvbnN0YW50cy5BUElfVVJMX1NUQUdJTkdcbn07XG5cbnZhciB0b2tlbml6ZXJBcGlVcmxzID0ge1xuICBwcm9kdWN0aW9uOiBjb25zdGFudHMuUEFOX1ZBVUxUX1VSTF9QUk9EVUNUSU9OLFxuICBsaXZlOiBjb25zdGFudHMuUEFOX1ZBVUxUX1VSTF9QUk9EVUNUSU9OLFxuICBzYW5kYm94OiBjb25zdGFudHMuUEFOX1ZBVUxUX1VSTF9TQU5EQk9YLFxuICBzdGFnaW5nOiBjb25zdGFudHMuUEFOX1ZBVUxUX1VSTF9TVEFHSU5HXG59O1xuXG5mdW5jdGlvbiBnZXRFbnZpcm9ubWVudChvcHRpb25zKSB7XG4gIHZhciBkZWZhdWx0RW52aXJvbm1lbnQgPSAnbGl2ZSc7XG4gIHZhciBhbGxvd2VkRW52aXJvbm1lbnRzID0gWydwcm9kdWN0aW9uJywgJ3NhbmRib3gnLCAnbGl2ZScsICdzdGFnaW5nJ107XG4gIHZhciBlbnZpcm9ubWVudCA9IG9wdGlvbnMuZW52aXJvbm1lbnQgfHwgZGVmYXVsdEVudmlyb25tZW50O1xuXG4gIGlmICghYWxsb3dlZEVudmlyb25tZW50cy5pbmNsdWRlcyhlbnZpcm9ubWVudCkpIHtcbiAgICB0aHJvdyBuZXcgU2VhbWxlc3NwYXlFcnJvcih7XG4gICAgICB0eXBlOiBlcnJvcnMuQ0xJRU5UX09QVElPTl9JTlZBTElELnR5cGUsXG4gICAgICBjb2RlOiBlcnJvcnMuQ0xJRU5UX09QVElPTl9JTlZBTElELmNvZGUsXG4gICAgICBtZXNzYWdlOiAnVW5rbm93biBlbnZpcm9ubWVudCBpZGVudGlmaWVyIFwiJyArIGVudmlyb25tZW50ICsgJ1wiJyxcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBlbnZpcm9ubWVudDtcbn1cblxuZnVuY3Rpb24gZ2V0Q29uZmlndXJhdGlvbihvcHRpb25zKSB7XG4gIHZhciBlbnZpcm9ubWVudCA9IGdldEVudmlyb25tZW50KG9wdGlvbnMpO1xuXG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdmFyIGNvbmZpZ3VyYXRpb24sIGF1dGhEYXRhLCBhdHRycztcbiAgICB2YXIgc2Vzc2lvbklkID0gdXVpZCgpO1xuICAgIHZhciBhbmFseXRpY3NNZXRhZGF0YSA9IHtcbiAgICAgIG1lcmNoYW50QXBwSWQ6IGdsb2JhbC5sb2NhdGlvbi5ob3N0LFxuICAgICAgc2RrVmVyc2lvbjogY29uc3RhbnRzLlZFUlNJT04sXG4gICAgICBzZXNzaW9uSWQ6IHNlc3Npb25JZFxuICAgIH07XG4gICAgdmFyIHRva2VuaXplckFwaSA9IG9wdGlvbnMudG9rZW5pemVyQXBpIHx8IHt9O1xuICAgIHZhciB0cmFuc2FjdGlvbkFwaSA9IG9wdGlvbnMudHJhbnNhY3Rpb25BcGkgfHwge307XG4gICAgdmFyIHNlYW1sZXNzcGF5QXBpID0gb3B0aW9ucy5zZWFtbGVzc3BheUFwaSB8fCB7fTtcblxuICAgIHRyeSB7XG4gICAgICBhdXRoRGF0YSA9IGNyZWF0ZUF1dGhvcml6YXRpb25EYXRhKG9wdGlvbnMuYXV0aG9yaXphdGlvbik7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZWplY3QobmV3IFNlYW1sZXNzcGF5RXJyb3IoZXJyb3JzLkNMSUVOVF9JTlZBTElEX0FVVEhPUklaQVRJT04pKTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBhdHRycyA9IGF1dGhEYXRhLmF0dHJzO1xuXG4gICAgY29uZmlndXJhdGlvbiA9IHtcbiAgICAgIGlzRGVidWc6IGZhbHNlLFxuICAgICAgbWV0YWRhdGE6IG9wdGlvbnMubWV0YWRhdGEsXG4gICAgICBhdXRob3JpemF0aW9uVHlwZTogYXR0cnMudG9rZW5pemF0aW9uS2V5ID8gJ1RPS0VOSVpBVElPTl9LRVknIDogJ0NMSUVOVF9UT0tFTicsXG4gICAgICBhdXRob3JpemF0aW9uOiBvcHRpb25zLmF1dGhvcml6YXRpb24sXG4gICAgICB0b2tlblR5cGU6IGF0dHJzLnRva2VuVHlwZSxcbiAgICAgIGFuYWx5dGljc01ldGFkYXRhOiBhbmFseXRpY3NNZXRhZGF0YSxcbiAgICAgIGdhdGV3YXlDb25maWd1cmF0aW9uOiB7XG4gICAgICAgIHByb3h5QWNjb3VudElkOiBvcHRpb25zLnByb3h5QWNjb3VudElkLFxuICAgICAgICBhc3NldHNVcmw6IGNvbnN0YW50cy5BU1NFVFNfSE9TVCxcbiAgICAgICAgZW52aXJvbm1lbnQ6IGVudmlyb25tZW50LFxuICAgICAgICBjbGllbnRBcGlVcmw6IGFwaVVybHNbZW52aXJvbm1lbnRdLFxuICAgICAgICBjaGVja291dFVybDogJycsIC8vQFRPRE86IFRlbXBvcmFyeSB1bnN1cHBvcnRlZFxuICAgICAgICB0b2tlbml6ZXJBcGk6IHtcbiAgICAgICAgICB1cmw6IHRva2VuaXplckFwaS51cmwgfHwgdG9rZW5pemVyQXBpVXJsc1tlbnZpcm9ubWVudF0sXG4gICAgICAgICAgYWNjZXNzVG9rZW46IGF1dGhEYXRhLmFjY2Vzc1Rva2VuXG4gICAgICAgIH0sXG4gICAgICAgIHRyYW5zYWN0aW9uQXBpOiB7XG4gICAgICAgICAgdXJsOiB0cmFuc2FjdGlvbkFwaS51cmwgfHwgYXBpVXJsc1tlbnZpcm9ubWVudF0sXG4gICAgICAgICAgYWNjZXNzVG9rZW46IHRyYW5zYWN0aW9uQXBpLmFjY2Vzc1Rva2VuLFxuICAgICAgICAgIHB1Ymxpc2hhYmxlVG9rZW46IGF1dGhEYXRhLmFjY2Vzc1Rva2VuLFxuICAgICAgICAgIGlzU2VhbWxlc3NwYXk6ICEoJ3VybCcgaW4gdHJhbnNhY3Rpb25BcGkpLFxuICAgICAgICAgIHNvdXJjZTogdHJhbnNhY3Rpb25BcGkuc291cmNlIHx8ICcnXG4gICAgICAgIH0sXG4gICAgICAgIGNyZWRpdENhcmRzOiB7XG4gICAgICAgICAgc3VwcG9ydGVkR2F0ZXdheXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogJ2NsaWVudEFwaSdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdLFxuICAgICAgICAgIHN1cHBvcnRlZENhcmRUeXBlczogWyAvLyBAVE9ETzogdGhpcyBzaG91bGQgYmUgcmV0dXJuZWQgYnkgc2VhbWxlc3NwYXkgYXBpIChhY2NvcmRpbmcgdG8gZ2l2ZW4gYXV0aG9yaXphdGlvbiAtIHB1Ymxpc2hhYmxlIGtleSlcbiAgICAgICAgICAgICdWaXNhJyxcbiAgICAgICAgICAgICdNYXN0ZXJjYXJkJyxcbiAgICAgICAgICAgICdBbWVyaWNhbiBFeHByZXNzJyxcbiAgICAgICAgICAgICdEaW5lcnMgQ2x1YicsXG4gICAgICAgICAgICAnRGlzY292ZXInLFxuICAgICAgICAgICAgJ0pDQicsXG4gICAgICAgICAgICAnVW5pb25QYXknLFxuICAgICAgICAgICAgJ01hZXN0cm8nXG4gICAgICAgICAgXSxcbiAgICAgICAgICBlbmRwb2ludHM6IHtcblxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgc2VhbWxlc3NwYXlBcGk6IHtcbiAgICAgICAgICBhY2Nlc3NUb2tlbjogc2VhbWxlc3NwYXlBcGkuYWNjZXNzVG9rZW4gfHwgYXV0aERhdGEuYWNjZXNzVG9rZW4sXG4gICAgICAgICAgcHVibGlzaGFibGVUb2tlbjogYXV0aERhdGEuYWNjZXNzVG9rZW4sXG4gICAgICAgICAgdXJsOiBzZWFtbGVzc3BheUFwaS51cmwgfHwgYXBpVXJsc1tlbnZpcm9ubWVudF1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICByZXNvbHZlKGNvbmZpZ3VyYXRpb24pO1xuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGdldENvbmZpZ3VyYXRpb246IHdyYXBQcm9taXNlKGdldENvbmZpZ3VyYXRpb24pLFxuICBhcGlFbnZpcm9ubWVudFVybHM6IGFwaVVybHNcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBTZWFtbGVzc3BheUVycm9yID0gcmVxdWlyZSgnLi4vbGliL3NlYW1sZXNzcGF5LWVycm9yJyk7XG52YXIgQ2xpZW50ID0gcmVxdWlyZSgnLi9jbGllbnQnKTtcbnZhciBnZXRDb25maWd1cmF0aW9uTW9kdWxlID0gcmVxdWlyZSgnLi9nZXQtY29uZmlndXJhdGlvbicpO1xudmFyIFZFUlNJT04gPSBcIndlYi1zZGtcIjtcbnZhciBQcm9taXNlID0gcmVxdWlyZSgnLi4vbGliL3Byb21pc2UnKTtcbnZhciB3cmFwUHJvbWlzZSA9IHJlcXVpcmUoJ0BicmFpbnRyZWUvd3JhcC1wcm9taXNlJyk7XG52YXIgc2hhcmVkRXJyb3JzID0gcmVxdWlyZSgnLi4vbGliL2Vycm9ycycpO1xuXG52YXIgZ2V0Q29uZmlndXJhdGlvbiA9IGdldENvbmZpZ3VyYXRpb25Nb2R1bGUuZ2V0Q29uZmlndXJhdGlvbjtcbnZhciBhcGlFbnZpcm9ubWVudFVybHMgPSBnZXRDb25maWd1cmF0aW9uTW9kdWxlLmFwaUVudmlyb25tZW50VXJscztcblxuLyoqIEBtb2R1bGUgc2VhbWxlc3NwYXktd2ViL2NsaWVudCAqL1xuXG4vKipcbiAqIEBmdW5jdGlvblxuICogQGRlc2NyaXB0aW9uIFRoaXMgZnVuY3Rpb24gaXMgdGhlIGVudHJ5IHBvaW50IGZvciB0aGUgPGNvZGU+c2VhbWxlc3NwYXkuY2xpZW50PC9jb2RlPiBtb2R1bGUuIEl0IGlzIHVzZWQgZm9yIGNyZWF0aW5nIHtAbGluayBDbGllbnR9IGluc3RhbmNlcyB0aGF0IHNlcnZpY2UgY29tbXVuaWNhdGlvbiB0byBTZWFtbGVzc3BheSBzZXJ2ZXJzLlxuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgT2JqZWN0IGNvbnRhaW5pbmcgYWxsIHtAbGluayBDbGllbnR9IG9wdGlvbnM6XG4gKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9ucy5hdXRob3JpemF0aW9uIEEgdG9rZW5pemF0aW9uS2V5IG9yIGNsaWVudFRva2VuLlxuICogQHBhcmFtIHtjYWxsYmFja30gW2NhbGxiYWNrXSBUaGUgc2Vjb25kIGFyZ3VtZW50LCA8Y29kZT5kYXRhPC9jb2RlPiwgaXMgdGhlIHtAbGluayBDbGllbnR9IGluc3RhbmNlLlxuICogQHJldHVybnMge1Byb21pc2V8dm9pZH0gUmV0dXJucyBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB0aGUgY2xpZW50IGluc3RhbmNlIGlmIG5vIGNhbGxiYWNrIGlzIHByb3ZpZGVkLlxuICogQGV4YW1wbGVcbiAqIHZhciBjcmVhdGVDbGllbnQgPSByZXF1aXJlKCdzZWFtbGVzc3BheS13ZWIvY2xpZW50JykuY3JlYXRlO1xuICpcbiAqIGNyZWF0ZUNsaWVudCh7XG4gKiAgIGF1dGhvcml6YXRpb246IENMSUVOVF9BVVRIT1JJWkFUSU9OXG4gKiB9LCBmdW5jdGlvbiAoY3JlYXRlRXJyLCBjbGllbnRJbnN0YW5jZSkge1xuICogICAvLyAuLi5cbiAqIH0pO1xuICogQHN0YXRpY1xuICovXG5mdW5jdGlvbiBjcmVhdGUob3B0aW9ucykge1xuICBpZiAoIW9wdGlvbnMuYXV0aG9yaXphdGlvbikge1xuICAgIHZhciBlcnJvciA9IG5ldyBTZWFtbGVzc3BheUVycm9yKHtcbiAgICAgIHR5cGU6IHNoYXJlZEVycm9ycy5JTlNUQU5USUFUSU9OX09QVElPTl9SRVFVSVJFRC50eXBlLFxuICAgICAgY29kZTogc2hhcmVkRXJyb3JzLklOU1RBTlRJQVRJT05fT1BUSU9OX1JFUVVJUkVELmNvZGUsXG4gICAgICBtZXNzYWdlOiAnb3B0aW9ucy5hdXRob3JpemF0aW9uIGlzIHJlcXVpcmVkIHdoZW4gaW5zdGFudGlhdGluZyBhIGNsaWVudC4nXG4gICAgfSk7XG5cbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xuICB9XG5cbiAgcmV0dXJuIGdldENvbmZpZ3VyYXRpb24ob3B0aW9ucylcbiAgICAudGhlbihmdW5jdGlvbiAoY29uZmlndXJhdGlvbikge1xuICAgICAgaWYgKG9wdGlvbnMuZGVidWcpIHtcbiAgICAgICAgY29uZmlndXJhdGlvbi5pc0RlYnVnID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHZhciBjbGllbnQgPSBuZXcgQ2xpZW50KGNvbmZpZ3VyYXRpb24pO1xuXG4gICAgICByZXR1cm4gY2xpZW50O1xuICAgIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgY3JlYXRlOiB3cmFwUHJvbWlzZShjcmVhdGUpLFxuICBnZXRBcGlVcmw6IGZ1bmN0aW9uIChlbnZpcm9ubWVudCkge1xuICAgIHJldHVybiBhcGlFbnZpcm9ubWVudFVybHNbZW52aXJvbm1lbnRdXG4gIH0sXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gVGhlIGN1cnJlbnQgdmVyc2lvbiBvZiB0aGUgU0RLLCBpLmUuIGB7QHBrZyB2ZXJzaW9ufWAuXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqL1xuICBWRVJTSU9OOiBWRVJTSU9OXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcXVlcnlzdHJpbmcgPSByZXF1aXJlKCcuLi8uLi9saWIvcXVlcnlzdHJpbmcnKTtcbnZhciBhc3NpZ24gPSByZXF1aXJlKCcuLi8uLi9saWIvYXNzaWduJykuYXNzaWduO1xudmFyIHByZXBCb2R5ID0gcmVxdWlyZSgnLi9wcmVwLWJvZHknKTtcbnZhciBwYXJzZUJvZHkgPSByZXF1aXJlKCcuL3BhcnNlLWJvZHknKTtcbnZhciBpc1hIUkF2YWlsYWJsZSA9IGdsb2JhbC5YTUxIdHRwUmVxdWVzdCAmJiAnd2l0aENyZWRlbnRpYWxzJyBpbiBuZXcgZ2xvYmFsLlhNTEh0dHBSZXF1ZXN0KCk7XG5cbmZ1bmN0aW9uIGdldFJlcXVlc3RPYmplY3QoKSB7XG4gIHJldHVybiBpc1hIUkF2YWlsYWJsZSA/IG5ldyBYTUxIdHRwUmVxdWVzdCgpIDogbmV3IFhEb21haW5SZXF1ZXN0KCk7XG59XG5cbmZ1bmN0aW9uIHJlcXVlc3Qob3B0aW9ucywgY2IpIHtcbiAgdmFyIHN0YXR1cywgcmVzQm9keTtcbiAgdmFyIG1ldGhvZCA9IG9wdGlvbnMubWV0aG9kO1xuICB2YXIgdXJsID0gb3B0aW9ucy51cmw7XG4gIHZhciBib2R5ID0gb3B0aW9ucy5kYXRhO1xuICB2YXIgdGltZW91dCA9IG9wdGlvbnMudGltZW91dDtcbiAgdmFyIGhlYWRlcnMgPSBhc3NpZ24oe1xuICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgfSwgb3B0aW9ucy5oZWFkZXJzKTtcbiAgdmFyIHJlcSA9IGdldFJlcXVlc3RPYmplY3QoKTtcbiAgdmFyIGNhbGxiYWNrID0gY2I7XG5cbiAgaWYgKG1ldGhvZCA9PT0gJ0dFVCcpIHtcbiAgICB1cmwgPSBxdWVyeXN0cmluZy5xdWVyeWlmeSh1cmwsIGJvZHkpO1xuICAgIGJvZHkgPSBudWxsO1xuICB9XG5cbiAgaWYgKGlzWEhSQXZhaWxhYmxlKSB7XG4gICAgcmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChyZXEucmVhZHlTdGF0ZSAhPT0gNCkgeyByZXR1cm47IH1cblxuICAgICAgc3RhdHVzID0gcmVxLnN0YXR1cztcbiAgICAgIHJlc0JvZHkgPSBwYXJzZUJvZHkocmVxLnJlc3BvbnNlVGV4dCk7XG5cbiAgICAgIGlmIChzdGF0dXMgPj0gNDAwIHx8IHN0YXR1cyA8IDIwMCkge1xuICAgICAgICBjYWxsYmFjayhyZXNCb2R5IHx8ICdlcnJvcicsIG51bGwsIHN0YXR1cyB8fCA1MDApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzQm9keSwgc3RhdHVzKTtcbiAgICAgIH1cbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIGlmIChvcHRpb25zLmhlYWRlcnMpIHtcbiAgICAgIHVybCA9IHF1ZXJ5c3RyaW5nLnF1ZXJ5aWZ5KHVybCwgaGVhZGVycyk7XG4gICAgfVxuXG4gICAgcmVxLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGNhbGxiYWNrKG51bGwsIHBhcnNlQm9keShyZXEucmVzcG9uc2VUZXh0KSwgcmVxLnN0YXR1cyk7XG4gICAgfTtcblxuICAgIHJlcS5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gWERvbWFpblJlcXVlc3QgZG9lcyBub3QgcmVwb3J0IGEgYm9keSBvciBzdGF0dXMgZm9yIGVycm9ycywgc29cbiAgICAgIC8vIGhhcmRjb2RlIHRvICdlcnJvcicgYW5kIDUwMCwgcmVzcGVjdGl2ZWx5XG4gICAgICBjYWxsYmFjaygnZXJyb3InLCBudWxsLCA1MDApO1xuICAgIH07XG5cbiAgICAvLyBUaGlzIG11c3QgcmVtYWluIGZvciBJRTkgdG8gd29ya1xuICAgIHJlcS5vbnByb2dyZXNzID0gZnVuY3Rpb24gKCkge307XG5cbiAgICByZXEub250aW1lb3V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgY2FsbGJhY2soJ3RpbWVvdXQnLCBudWxsLCAtMSk7XG4gICAgfTtcbiAgfVxuXG4gIHJlcS5vcGVuKG1ldGhvZCwgdXJsLCB0cnVlKTtcbiAgcmVxLnRpbWVvdXQgPSB0aW1lb3V0O1xuXG4gIGlmIChpc1hIUkF2YWlsYWJsZSkge1xuICAgIE9iamVjdC5rZXlzKGhlYWRlcnMpLmZvckVhY2goZnVuY3Rpb24gKGhlYWRlcktleSkge1xuICAgICAgcmVxLnNldFJlcXVlc3RIZWFkZXIoaGVhZGVyS2V5LCBoZWFkZXJzW2hlYWRlcktleV0pO1xuICAgIH0pO1xuICB9XG5cbiAgdHJ5IHtcbiAgICByZXEuc2VuZChwcmVwQm9keShtZXRob2QsIGJvZHkpKTtcbiAgfSBjYXRjaCAoZSkgeyAvKiBpZ25vcmVkICovIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHJlcXVlc3Q6IHJlcXVlc3Rcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0VXNlckFnZW50KCkge1xuICByZXR1cm4gZ2xvYmFsLm5hdmlnYXRvci51c2VyQWdlbnQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYWpheElzQXZhbGlhYmxlO1xudmFyIG9uY2UgPSByZXF1aXJlKCcuLi8uLi9saWIvb25jZScpO1xudmFyIEpTT05QRHJpdmVyID0gcmVxdWlyZSgnLi9qc29ucC1kcml2ZXInKTtcbnZhciBBSkFYRHJpdmVyID0gcmVxdWlyZSgnLi9hamF4LWRyaXZlcicpO1xudmFyIGdldFVzZXJBZ2VudCA9IHJlcXVpcmUoJy4vZ2V0LXVzZXItYWdlbnQnKTtcbnZhciBpc0hUVFAgPSByZXF1aXJlKCcuL2lzLWh0dHAnKTtcblxuZnVuY3Rpb24gaXNBamF4QXZhaWxhYmxlKCkge1xuICBpZiAoYWpheElzQXZhbGlhYmxlID09IG51bGwpIHtcbiAgICBhamF4SXNBdmFsaWFibGUgPSAhKGlzSFRUUCgpICYmIC9NU0lFXFxzKDh8OSkvLnRlc3QoZ2V0VXNlckFnZW50KCkpKTtcbiAgfVxuXG4gIHJldHVybiBhamF4SXNBdmFsaWFibGU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9wdGlvbnMsIGNiKSB7XG4gIGNiID0gb25jZShjYiB8fCBGdW5jdGlvbi5wcm90b3R5cGUpO1xuICBvcHRpb25zLm1ldGhvZCA9IChvcHRpb25zLm1ldGhvZCB8fCAnR0VUJykudG9VcHBlckNhc2UoKTtcbiAgb3B0aW9ucy50aW1lb3V0ID0gb3B0aW9ucy50aW1lb3V0ID09IG51bGwgPyA2MDAwMCA6IG9wdGlvbnMudGltZW91dDtcbiAgb3B0aW9ucy5kYXRhID0gb3B0aW9ucy5kYXRhIHx8IHt9O1xuXG4gIGlmIChpc0FqYXhBdmFpbGFibGUoKSkge1xuICAgIEFKQVhEcml2ZXIucmVxdWVzdChvcHRpb25zLCBjYik7XG4gIH0gZWxzZSB7XG4gICAgSlNPTlBEcml2ZXIucmVxdWVzdChvcHRpb25zLCBjYik7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gZ2xvYmFsLmxvY2F0aW9uLnByb3RvY29sID09PSAnaHR0cDonO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGhlYWQ7XG52YXIgdXVpZCA9IHJlcXVpcmUoJy4uLy4uL2xpYi91dWlkJyk7XG52YXIgcXVlcnlzdHJpbmcgPSByZXF1aXJlKCcuLi8uLi9saWIvcXVlcnlzdHJpbmcnKTtcbnZhciB0aW1lb3V0cyA9IHt9O1xuXG5mdW5jdGlvbiBfcmVtb3ZlU2NyaXB0KHNjcmlwdCkge1xuICBpZiAoc2NyaXB0ICYmIHNjcmlwdC5wYXJlbnROb2RlKSB7XG4gICAgc2NyaXB0LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc2NyaXB0KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfY3JlYXRlU2NyaXB0VGFnKHVybCwgY2FsbGJhY2tOYW1lKSB7XG4gIHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgdmFyIGRvbmUgPSBmYWxzZTtcblxuICBzY3JpcHQuc3JjID0gdXJsO1xuICBzY3JpcHQuYXN5bmMgPSB0cnVlO1xuICBzY3JpcHQub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcbiAgICBnbG9iYWxbY2FsbGJhY2tOYW1lXSh7bWVzc2FnZTogJ2Vycm9yJywgc3RhdHVzOiA1MDB9KTtcbiAgfTtcblxuICBzY3JpcHQub25sb2FkID0gc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoZG9uZSkgeyByZXR1cm47IH1cblxuICAgIGlmICghdGhpcy5yZWFkeVN0YXRlIHx8IHRoaXMucmVhZHlTdGF0ZSA9PT0gJ2xvYWRlZCcgfHwgdGhpcy5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnKSB7XG4gICAgICBkb25lID0gdHJ1ZTtcbiAgICAgIHNjcmlwdC5vbmxvYWQgPSBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gbnVsbDtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIHNjcmlwdDtcbn1cblxuZnVuY3Rpb24gX2NsZWFudXBHbG9iYWwoY2FsbGJhY2tOYW1lKSB7XG4gIHRyeSB7XG4gICAgZGVsZXRlIGdsb2JhbFtjYWxsYmFja05hbWVdO1xuICB9IGNhdGNoIChfKSB7XG4gICAgZ2xvYmFsW2NhbGxiYWNrTmFtZV0gPSBudWxsO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9zZXR1cFRpbWVvdXQodGltZW91dCwgY2FsbGJhY2tOYW1lKSB7XG4gIHRpbWVvdXRzW2NhbGxiYWNrTmFtZV0gPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICB0aW1lb3V0c1tjYWxsYmFja05hbWVdID0gbnVsbDtcblxuICAgIGdsb2JhbFtjYWxsYmFja05hbWVdKHtcbiAgICAgIGVycm9yOiAndGltZW91dCcsXG4gICAgICBzdGF0dXM6IC0xXG4gICAgfSk7XG5cbiAgICBnbG9iYWxbY2FsbGJhY2tOYW1lXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIF9jbGVhbnVwR2xvYmFsKGNhbGxiYWNrTmFtZSk7XG4gICAgfTtcbiAgfSwgdGltZW91dCk7XG59XG5cbmZ1bmN0aW9uIF9zZXR1cEdsb2JhbENhbGxiYWNrKHNjcmlwdCwgY2FsbGJhY2ssIGNhbGxiYWNrTmFtZSkge1xuICBnbG9iYWxbY2FsbGJhY2tOYW1lXSA9IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgIHZhciBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXMgfHwgNTAwO1xuICAgIHZhciBlcnIgPSBudWxsO1xuICAgIHZhciBkYXRhID0gbnVsbDtcblxuICAgIGRlbGV0ZSByZXNwb25zZS5zdGF0dXM7XG5cbiAgICBpZiAoc3RhdHVzID49IDQwMCB8fCBzdGF0dXMgPCAyMDApIHtcbiAgICAgIGVyciA9IHJlc3BvbnNlO1xuICAgIH0gZWxzZSB7XG4gICAgICBkYXRhID0gcmVzcG9uc2U7XG4gICAgfVxuXG4gICAgX2NsZWFudXBHbG9iYWwoY2FsbGJhY2tOYW1lKTtcbiAgICBfcmVtb3ZlU2NyaXB0KHNjcmlwdCk7XG5cbiAgICBjbGVhclRpbWVvdXQodGltZW91dHNbY2FsbGJhY2tOYW1lXSk7XG4gICAgY2FsbGJhY2soZXJyLCBkYXRhLCBzdGF0dXMpO1xuICB9O1xufVxuXG5mdW5jdGlvbiByZXF1ZXN0KG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIHZhciBzY3JpcHQ7XG4gIHZhciBjYWxsYmFja05hbWUgPSAnY2FsbGJhY2tfanNvbl8nICsgdXVpZCgpLnJlcGxhY2UoLy0vZywgJycpO1xuICB2YXIgdXJsID0gb3B0aW9ucy51cmw7XG4gIHZhciBhdHRycyA9IG9wdGlvbnMuZGF0YTtcbiAgdmFyIG1ldGhvZCA9IG9wdGlvbnMubWV0aG9kO1xuICB2YXIgdGltZW91dCA9IG9wdGlvbnMudGltZW91dDtcblxuICB1cmwgPSBxdWVyeXN0cmluZy5xdWVyeWlmeSh1cmwsIGF0dHJzKTtcbiAgdXJsID0gcXVlcnlzdHJpbmcucXVlcnlpZnkodXJsLCB7XG4gICAgX21ldGhvZDogbWV0aG9kLFxuICAgIGNhbGxiYWNrOiBjYWxsYmFja05hbWVcbiAgfSk7XG5cbiAgc2NyaXB0ID0gX2NyZWF0ZVNjcmlwdFRhZyh1cmwsIGNhbGxiYWNrTmFtZSk7XG4gIF9zZXR1cEdsb2JhbENhbGxiYWNrKHNjcmlwdCwgY2FsbGJhY2ssIGNhbGxiYWNrTmFtZSk7XG4gIF9zZXR1cFRpbWVvdXQodGltZW91dCwgY2FsbGJhY2tOYW1lKTtcblxuICBpZiAoIWhlYWQpIHtcbiAgICBoZWFkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgfVxuXG4gIGhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHJlcXVlc3Q6IHJlcXVlc3Rcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGJvZHkpIHtcbiAgdHJ5IHtcbiAgICBib2R5ID0gSlNPTi5wYXJzZShib2R5KTtcbiAgfSBjYXRjaCAoZSkgeyAvKiBpZ25vcmVkICovIH1cblxuICByZXR1cm4gYm9keTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG1ldGhvZCwgYm9keSkge1xuICBpZiAoU3RyaW5nKG1ldGhvZCkudG9Mb3dlckNhc2UoKSAhPT0gJ2dldCcgJiYgYm9keSAhPSBudWxsKSB7XG4gICAgYm9keSA9IHR5cGVvZiBib2R5ID09PSAnc3RyaW5nJyA/IGJvZHkgOiBKU09OLnN0cmluZ2lmeShib2R5KTtcbiAgfVxuXG4gIHJldHVybiBib2R5O1xufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8qIGVzbGludC1kaXNhYmxlIG5vLXJlc2VydmVkLWtleXMgKi9cblxudmFyIGVudW1lcmF0ZSA9IHJlcXVpcmUoJy4uLy4uL2xpYi9lbnVtZXJhdGUnKTtcbnZhciBWRVJTSU9OID0gXCJ3ZWItc2RrXCI7XG5cbnZhciBwYXltZW50VHlwZXMgPSB7XG4gIFBBWU1FTlRfVFlQRV9DUkVESVQ6ICdjcmVkaXRfY2FyZCcsXG4gIFBBWU1FTlRfVFlQRV9BQ0g6ICdhY2gnLFxuICBQQVlNRU5UX1RZUEVfR0lGVF9DQVJEOiAnZ2lmdF9jYXJkJ1xufTtcblxudmFyIEJJTl9MT09LVVBfTUFYX0xFTkdUSCA9IDY7XG52YXIgVE9LRU5fVFlQRV9DSEVDS09VVCA9ICdDSEVDS09VVCc7XG52YXIgQ1JFRElUID0gcGF5bWVudFR5cGVzLlBBWU1FTlRfVFlQRV9DUkVESVQ7XG52YXIgQUNIID0gcGF5bWVudFR5cGVzLlBBWU1FTlRfVFlQRV9BQ0g7XG52YXIgR0lGVCA9IHBheW1lbnRUeXBlcy5QQVlNRU5UX1RZUEVfR0lGVF9DQVJEO1xuXG52YXIgcmVxdWVzdFR5cGVzID0ge1xuICBSRVFVRVNUX1RZUEVfVE9LRU5JWkFUSU9OOiAndG9rZW5pemF0aW9uJ1xufTtcblxudmFyIHRva2VuaXplck5vblNlY3VyZUZpZWxkcyA9IFtcbiAgJ2JpbGxpbmdBZGRyZXNzJyxcbiAgJ2NvbXBhbnknLFxuICAnZW1haWwnLFxuICAnbmFtZScsXG4gICdwaG9uZU51bWJlcicsXG4gICdjdXN0b21lcicsXG4gICdhY2NvdW50VmFsaWRhdGlvbicsXG4gICdiYW5rQWNjb3VudFR5cGUnLFxuICAncm91dGluZ051bWJlcidcbl07XG5cbnZhciBHSUZUX0NBUkRfTUlOX0xFTkdUSCA9IDEyO1xudmFyIEdJRlRfQ0FSRF9NQVhfTEVOR1RIID0gMjA7XG5cbnZhciB3aGl0ZWxpc3RlZEZpZWxkcyA9IHt9O1xud2hpdGVsaXN0ZWRGaWVsZHNbQ1JFRElUXSA9IHtcbiAgLy8gUEFOLVZBVUxUOlxuICBhY2NvdW50TnVtYmVyOiB7XG4gICAgbmFtZTogJ2FjY291bnQtbnVtYmVyJyxcbiAgICBsYWJlbDogJ0NhcmQgTnVtYmVyJyxcbiAgICBkZWZhdWx0TWF4TGVuZ3RoOiAyMlxuICB9LFxuICBwb3N0YWxDb2RlOiB7XG4gICAgbmFtZTogJ3Bvc3RhbC1jb2RlJyxcbiAgICBsYWJlbDogJ0N1c3RvbWVyIHBvc3RhbCBjb2RlJyxcbiAgICBkZWZhdWx0TWF4TGVuZ3RoOiA1XG4gIH0sXG4gIGV4cERhdGU6IHtcbiAgICBuYW1lOiAnZXhwLWRhdGUnLFxuICAgIGxhYmVsOiAnRXhwaXJhdGlvbiBEYXRlJyxcbiAgICBkZWZhdWx0TWF4TGVuZ3RoOiA1XG4gIH0sXG4gIGN2djoge1xuICAgIG5hbWU6ICdjdnYnLFxuICAgIGxhYmVsOiAnQ1ZWJyxcbiAgICBkZWZhdWx0TWF4TGVuZ3RoOiA0XG4gIH0sXG4gIG5hbWU6IHtcbiAgICBuYW1lOiAnbmFtZScsXG4gICAgbGFiZWw6ICdDYXJkaG9sZGVyIE5hbWUnLFxuICAgIGRlZmF1bHRNYXhMZW5ndGg6IDY0XG4gIH0sXG59O1xuXG53aGl0ZWxpc3RlZEZpZWxkc1tBQ0hdID0ge1xuICAvLyBQQU4tVkFVTFQ6XG4gIGFjY291bnROdW1iZXI6IHsgLy8gKlxuICAgIG5hbWU6ICdhY2NvdW50LW51bWJlcicsXG4gICAgbGFiZWw6ICdCYW5rIENhcmQgTnVtYmVyJyxcbiAgICBkZWZhdWx0TWF4TGVuZ3RoOiAxNlxuICB9LFxuICB2ZXJpZnlBY2NvdW50TnVtYmVyOiB7XG4gICAgbmFtZTogJ3ZlcmlmeS1hY2NvdW50LW51bWJlcicsXG4gICAgbGFiZWw6ICdWZXJpZnkgQ2FyZCBOdW1iZXInLFxuICAgIGRlZmF1bHRNYXhMZW5ndGg6IDE2XG4gIH0sXG4gIHBvc3RhbENvZGU6IHtcbiAgICBuYW1lOiAncG9zdGFsLWNvZGUnLFxuICAgIGxhYmVsOiAnQ3VzdG9tZXIgcG9zdGFsIGNvZGUnLFxuICAgIGRlZmF1bHRNYXhMZW5ndGg6IDVcbiAgfVxufTtcblxud2hpdGVsaXN0ZWRGaWVsZHNbR0lGVF0gPSB7XG4gIC8vIFBBTi1WQVVMVDpcbiAgYWNjb3VudE51bWJlcjoge1xuICAgIG5hbWU6ICdhY2NvdW50LW51bWJlcicsXG4gICAgbGFiZWw6ICdDYXJkIE51bWJlcicsXG4gICAgZGVmYXVsdE1heExlbmd0aDogMjJcbiAgfSxcbiAgcG9zdGFsQ29kZToge1xuICAgIG5hbWU6ICdwb3N0YWwtY29kZScsXG4gICAgbGFiZWw6ICdDdXN0b21lciBwb3N0YWwgY29kZScsXG4gICAgZGVmYXVsdE1heExlbmd0aDogNVxuICB9XG59O1xuXG52YXIgY29uc3RhbnRzID0ge1xuICBWRVJTSU9OOiBWRVJTSU9OLFxuICBtYXhFeHBpcmF0aW9uWWVhckFnZTogMzEsXG4gIGV4dGVybmFsRXZlbnRzOiB7XG4gICAgQ0hBTkdFOiAnY2hhbmdlJyxcbiAgICBGT0NVUzogJ2ZvY3VzJyxcbiAgICBCTFVSOiAnYmx1cicsXG4gICAgRU1QVFk6ICdlbXB0eScsXG4gICAgTk9UX0VNUFRZOiAnbm90RW1wdHknLFxuICAgIFZBTElESVRZX0NIQU5HRTogJ3ZhbGlkaXR5Q2hhbmdlJyxcbiAgICBDQVJEX1RZUEVfQ0hBTkdFOiAnY2FyZFR5cGVDaGFuZ2UnLFxuICAgIENBUkRfSU5GT19MT0FERUQ6ICdjYXJkSW5mb0xvYWRlZCdcbiAgfSxcbiAgZXh0ZXJuYWxDbGFzc2VzOiB7XG4gICAgUE9URU5USUFMTFlfVkFMSUQ6ICdzZWFtbGVzc3BheS1ob3N0ZWQtZmllbGRzLXBvdGVudGlhbGx5LXZhbGlkJyxcbiAgICBGT0NVU0VEOiAnc2VhbWxlc3NwYXktaG9zdGVkLWZpZWxkcy1mb2N1c2VkJyxcbiAgICBJTlZBTElEOiAnc2VhbWxlc3NwYXktaG9zdGVkLWZpZWxkcy1pbnZhbGlkJyxcbiAgICBWQUxJRDogJ3NlYW1sZXNzcGF5LWhvc3RlZC1maWVsZHMtdmFsaWQnXG4gIH0sXG4gIGRlZmF1bHRJRnJhbWVTdHlsZToge1xuICAgIGJvcmRlcjogJ25vbmUnLFxuICAgIHdpZHRoOiAnMTAwJScsXG4gICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgJ2Zsb2F0JzogJ2xlZnQnXG4gIH0sXG4gIHdoaXRlbGlzdGVkU3R5bGVzOiBbXG4gICAgJy1tb3otYXBwZWFyYW5jZScsXG4gICAgJy1tb3otb3N4LWZvbnQtc21vb3RoaW5nJyxcbiAgICAnLW1vei10YXAtaGlnaGxpZ2h0LWNvbG9yJyxcbiAgICAnLW1vei10cmFuc2l0aW9uJyxcbiAgICAnLXdlYmtpdC1hcHBlYXJhbmNlJyxcbiAgICAnLXdlYmtpdC1mb250LXNtb290aGluZycsXG4gICAgJy13ZWJraXQtdGFwLWhpZ2hsaWdodC1jb2xvcicsXG4gICAgJy13ZWJraXQtdHJhbnNpdGlvbicsXG4gICAgJ2FwcGVhcmFuY2UnLFxuICAgICdib3JkZXItcmFkaXVzJyxcbiAgICAnY29sb3InLFxuICAgICdkaXJlY3Rpb24nLFxuICAgICdmb250JyxcbiAgICAnZm9udC1mYW1pbHknLFxuICAgICdmb250LXNpemUnLFxuICAgICdmb250LXNpemUtYWRqdXN0JyxcbiAgICAnZm9udC1zdHJldGNoJyxcbiAgICAnZm9udC1zdHlsZScsXG4gICAgJ2ZvbnQtdmFyaWFudCcsXG4gICAgJ2ZvbnQtdmFyaWFudC1hbHRlcm5hdGVzJyxcbiAgICAnZm9udC12YXJpYW50LWNhcHMnLFxuICAgICdmb250LXZhcmlhbnQtZWFzdC1hc2lhbicsXG4gICAgJ2ZvbnQtdmFyaWFudC1saWdhdHVyZXMnLFxuICAgICdmb250LXZhcmlhbnQtbnVtZXJpYycsXG4gICAgJ2ZvbnQtd2VpZ2h0JyxcbiAgICAnbGV0dGVyLXNwYWNpbmcnLFxuICAgICdsaW5lLWhlaWdodCcsXG4gICAgJ21hcmdpbicsXG4gICAgJ21hcmdpbi10b3AnLFxuICAgICdtYXJnaW4tcmlnaHQnLFxuICAgICdtYXJnaW4tYm90dG9tJyxcbiAgICAnbWFyZ2luLWxlZnQnLFxuICAgICdvcGFjaXR5JyxcbiAgICAnb3V0bGluZScsXG4gICAgJ3BhZGRpbmcnLFxuICAgICdwYWRkaW5nLXRvcCcsXG4gICAgJ3BhZGRpbmctcmlnaHQnLFxuICAgICdwYWRkaW5nLWJvdHRvbScsXG4gICAgJ3BhZGRpbmctbGVmdCcsXG4gICAgJ3RleHQtYWxpZ24nLFxuICAgICd0ZXh0LXNoYWRvdycsXG4gICAgJ3RyYW5zaXRpb24nXG4gIF0sXG4gIHdoaXRlbGlzdGVkRmllbGRzOiB3aGl0ZWxpc3RlZEZpZWxkcyxcbiAgd2hpdGVsaXN0ZWRBdHRyaWJ1dGVzOiB7XG4gICAgJ2FyaWEtaW52YWxpZCc6ICdib29sZWFuJyxcbiAgICAnYXJpYS1yZXF1aXJlZCc6ICdib29sZWFuJyxcbiAgICBkaXNhYmxlZDogJ2Jvb2xlYW4nLFxuICAgIHBsYWNlaG9sZGVyOiAnc3RyaW5nJ1xuICB9LFxuICBhdXRvY29tcGxldGVNYXBwaW5nczoge1xuICAgICdhY2NvdW50LW51bWJlcic6ICdjYy1udW1iZXInLFxuICAgICdleHAtZGF0ZSc6ICdjYy1leHAnLFxuICAgIGN2djogJ2NjLWNzYycsXG4gICAgJ3Bvc3RhbC1jb2RlJzogJ2JpbGxpbmcgcG9zdGFsLWNvZGUnLFxuICAgIG5hbWU6ICdjYy1uYW1lJyxcbiAgfSxcbiAgcGF5bWVudFR5cGVzOiBwYXltZW50VHlwZXMsXG4gIHJlcXVlc3RUeXBlczogcmVxdWVzdFR5cGVzLFxuICBHSUZUX0NBUkRfTUlOX0xFTkdUSDogR0lGVF9DQVJEX01JTl9MRU5HVEgsXG4gIEdJRlRfQ0FSRF9NQVhfTEVOR1RIOiBHSUZUX0NBUkRfTUFYX0xFTkdUSCxcbiAgVE9LRU5fVFlQRV9DSEVDS09VVDogVE9LRU5fVFlQRV9DSEVDS09VVCxcbiAgQklOX0xPT0tVUF9NQVhfTEVOR1RIOiBCSU5fTE9PS1VQX01BWF9MRU5HVEgsXG4gIHRva2VuaXplck5vblNlY3VyZUZpZWxkczogdG9rZW5pemVyTm9uU2VjdXJlRmllbGRzLFxuICBjYXJkQnJhbmRNYXA6IHtcbiAgICB2aXNhOiAndmlzYScsXG4gICAgbWFzdGVyY2FyZDogJ21hc3RlcmNhcmQnLFxuICAgICdhbWVyaWNhbi1leHByZXNzJzogJ2FtZXgnLFxuICAgICdkaW5lcnMtY2x1Yic6ICdkaW5lcnMnLFxuICAgIGRpc2NvdmVyOiAnZGlzY292ZXInLFxuICAgIGpjYjogJ2pjYicsXG4gICAgdW5pb25wYXk6ICd1bmlvbnBheScsXG4gICAgbWFlc3RybzogJ21hc3RlcmNhcmQnLFxuICAgIGVsbzogJ2Rpc2NvdmVyJyxcbiAgICBtaXI6ICd1bmtub3duJyxcbiAgICBoaXBlcjogJ2Rpc2NvdmVyJyxcbiAgICBoaXBlcmNhcmQ6ICdkaXNjb3ZlcidcbiAgfVxufTtcblxuY29uc3RhbnRzLmV2ZW50cyA9IGVudW1lcmF0ZShbXG4gICdBVVRPRklMTF9FWFBJUkFUSU9OX0RBVEUnLFxuICAnUE9QVUxBVEVfVE9LRU4nLFxuICAnRlJBTUVfUkVBRFknLFxuICAnVkFMSURBVEVfU1RSSUNUJyxcbiAgJ0NPTkZJR1VSQVRJT04nLFxuICAnVE9LRU5JWkFUSU9OX1JFUVVFU1QnLFxuICAnSU5QVVRfRVZFTlQnLFxuICAnVFJJR0dFUl9JTlBVVF9GT0NVUycsXG4gICdBRERfQ0xBU1MnLFxuICAnUkVNT1ZFX0NMQVNTJyxcbiAgJ1NFVF9BVFRSSUJVVEUnLFxuICAnUkVNT1ZFX0FUVFJJQlVURScsXG4gICdDTEVBUl9GSUVMRCdcbl0sICdob3N0ZWQtZmllbGRzOicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbnN0YW50cztcbiIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gYWRkTWV0YWRhdGEoY29uZmlndXJhdGlvbiwgZGF0YSkge1xuICBpZiAoY29uZmlndXJhdGlvbi5tZXRhZGF0YSkge1xuICAgIGlmIChkYXRhKSB7XG4gICAgICBkYXRhLm1ldGFkYXRhID0gY29uZmlndXJhdGlvbi5tZXRhZGF0YTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGF0YSA9IHtcbiAgICAgICAgbWV0YWRhdGE6IGNvbmZpZ3VyYXRpb24ubWV0YWRhdGFcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRhdGFcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhZGRNZXRhZGF0YTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGFzc2lnbk5vcm1hbGl6ZWQgPSB0eXBlb2YgT2JqZWN0LmFzc2lnbiA9PT0gJ2Z1bmN0aW9uJyA/IE9iamVjdC5hc3NpZ24gOiBhc3NpZ25Qb2x5ZmlsbDtcblxuZnVuY3Rpb24gYXNzaWduUG9seWZpbGwoZGVzdGluYXRpb24pIHtcbiAgdmFyIGksIHNvdXJjZSwga2V5O1xuXG4gIGZvciAoaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICBzb3VyY2UgPSBhcmd1bWVudHNbaV07XG4gICAgZm9yIChrZXkgaW4gc291cmNlKSB7XG4gICAgICBpZiAoc291cmNlLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgZGVzdGluYXRpb25ba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBkZXN0aW5hdGlvbjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFzc2lnbjogYXNzaWduTm9ybWFsaXplZCxcbiAgX2Fzc2lnbjogYXNzaWduUG9seWZpbGxcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBWRVJTSU9OOiBcIndlYi1zZGtcIixcbiAgQVNTRVRTX0hPU1Q6IFwiaHR0cHM6Ly93ZWItc2RrLWV4YW1wbGVzLnNlYW1sZXNzcGF5LmRldlwiLFxuICBBU1NFVFNfUzNfQlVDS0VUOiBcIndlYi1zZGsuc2VhbWxlc3NwYXkuY29tXCIsXG4gIEFQSV9VUkxfUFJPRFVDVElPTjogXCJodHRwczovL2FwaS5zZWFtbGVzc3BheS5jb21cIixcbiAgQVBJX1VSTF9TQU5EQk9YOiBcImh0dHBzOi8vYXBpLnNhbmRib3guc2VhbWxlc3NwYXkuY29tXCIsXG4gIEFQSV9VUkxfU1RBR0lORzogXCJodHRwczovL2FwaS5zZWFtbGVzc3BheS5kZXZcIixcbiAgUEFOX1ZBVUxUX1VSTF9QUk9EVUNUSU9OOiBcImh0dHBzOi8vcGFuLXZhdWx0LnNlYW1sZXNzcGF5LmNvbVwiLFxuICBQQU5fVkFVTFRfVVJMX1NBTkRCT1g6IFwiaHR0cHM6Ly9wYW4tdmF1bHQuc2FuZGJveC5zZWFtbGVzc3BheS5jb21cIixcbiAgUEFOX1ZBVUxUX1VSTF9TVEFHSU5HOiBcImh0dHBzOi8vcGFuLXZhdWx0LnNlYW1sZXNzcGF5LmRldlwiLFxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFNlYW1sZXNzcGF5RXJyb3IgPSByZXF1aXJlKCcuL3NlYW1sZXNzcGF5LWVycm9yJyk7XG5cbmZ1bmN0aW9uIGNvbnZlcnRUb1NlYW1sZXNzcGF5RXJyb3Iob3JpZ2luYWxFcnIsIG90aGVyRXJyb3JPYmplY3QpIHtcbiAgaWYgKG9yaWdpbmFsRXJyIGluc3RhbmNlb2YgU2VhbWxlc3NwYXlFcnJvciB8fCAob3JpZ2luYWxFcnIgJiYgb3JpZ2luYWxFcnIubmFtZSA9PT0gJ1NlYW1sZXNzcGF5RXJyb3InKSkge1xuICAgIHJldHVybiBvcmlnaW5hbEVycjtcbiAgfVxuXG4gIHJldHVybiBuZXcgU2VhbWxlc3NwYXlFcnJvcih7XG4gICAgdHlwZTogb3RoZXJFcnJvck9iamVjdC50eXBlLFxuICAgIGNvZGU6IG90aGVyRXJyb3JPYmplY3QuY29kZSxcbiAgICBtZXNzYWdlOiBvdGhlckVycm9yT2JqZWN0Lm1lc3NhZ2UsXG4gICAgZGV0YWlsczoge1xuICAgICAgb3JpZ2luYWxFcnJvcjogb3JpZ2luYWxFcnJcbiAgICB9XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbnZlcnRUb1NlYW1sZXNzcGF5RXJyb3I7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBidG9hID0gcmVxdWlyZSgnLi4vbGliL3BvbHlmaWxsJykuYnRvYTtcblxudmFyIGNvbnN0YW50cyA9IHJlcXVpcmUoJy4uL2hvc3RlZC1maWVsZHMvc2hhcmVkL2NvbnN0YW50cycpO1xuXG5mdW5jdGlvbiBfaXNDaGVja291dEtleShzdHIpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gc3RyLmluY2x1ZGVzKCdDSFMnKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9pc090cFRva2VuKHN0cikge1xuICB2YXIgb3RwVG9rZW5SRSA9IC9eT1RQX1swLTlhLWZBLUZdezh9XFxiLVswLTlhLWZBLUZdezR9XFxiLVswLTlhLWZBLUZdezR9XFxiLVswLTlhLWZBLUZdezR9XFxiLVswLTlhLWZBLUZdezEyfSQvO1xuICByZXR1cm4gb3RwVG9rZW5SRS50ZXN0KHN0cik7XG59XG5cbmZ1bmN0aW9uIF9pc1Rva2VuaXphdGlvbktleShzdHIpIHtcbiAgcmV0dXJuIC9eW2Etel0rX1thLXpBLVowLTldK19bYS16QS1aMC05XSskLy50ZXN0KHN0cikgfHwgL15bYS16XStfW2EtekEtWjAtOV0rJC8udGVzdChzdHIpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVBdXRob3JpemF0aW9uRGF0YShhdXRob3JpemF0aW9uKSB7XG4gIHZhciBkYXRhID0ge1xuICAgIGF0dHJzOiB7fSxcbiAgfTtcblxuICB2YXIgc2VsZWN0ZWRBdXRoID0gW1xuICAgIHtcbiAgICAgIGlzQXV0aDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gX2lzQ2hlY2tvdXRLZXkoYXV0aG9yaXphdGlvbik7XG4gICAgICB9LFxuICAgICAgc2V0RGF0YTogZnVuY3Rpb24gKCkge1xuICAgICAgICBkYXRhLmF0dHJzLnRva2VuVHlwZSA9IGNvbnN0YW50cy5UT0tFTl9UWVBFX0NIRUNLT1VUO1xuICAgICAgICBkYXRhLmF0dHJzLnRva2VuaXphdGlvbktleSA9IGF1dGhvcml6YXRpb247XG4gICAgICAgIGRhdGEuYWNjZXNzVG9rZW4gPSBidG9hKGF1dGhvcml6YXRpb24sIHsgaXNTZW5zaXRpdmU6IHRydWUgfSk7XG4gICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICBpc0F1dGg6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIF9pc090cFRva2VuKGF1dGhvcml6YXRpb24pOyB9LFxuICAgICAgc2V0RGF0YTogZnVuY3Rpb24gKCkge1xuICAgICAgICBkYXRhLmF0dHJzLnRva2VuaXphdGlvbktleSA9IGF1dGhvcml6YXRpb247XG4gICAgICAgIGRhdGEuYWNjZXNzVG9rZW4gPSBhdXRob3JpemF0aW9uO1xuICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgaXNBdXRoOiBmdW5jdGlvbiAoKSB7IHJldHVybiBfaXNUb2tlbml6YXRpb25LZXkoYXV0aG9yaXphdGlvbik7IH0sXG4gICAgICBzZXREYXRhOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGRhdGEuYXR0cnMudG9rZW5pemF0aW9uS2V5ID0gYXV0aG9yaXphdGlvbjtcbiAgICAgICAgZGF0YS5hY2Nlc3NUb2tlbiA9IGJ0b2EoYXV0aG9yaXphdGlvbiwgeyBpc1NlbnNpdGl2ZTogdHJ1ZSB9KTtcbiAgICAgIH1cbiAgICB9XG4gIF0uZmlsdGVyKGZ1bmN0aW9uIChhdXRoKSB7XG4gICAgcmV0dXJuIGF1dGguaXNBdXRoKClcbiAgfSkuc2hpZnQoKTtcblxuICBzZWxlY3RlZEF1dGguc2V0RGF0YSgpXG5cbiAgcmV0dXJuIGRhdGE7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQXV0aG9yaXphdGlvbkRhdGE7XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIGVudW1lcmF0ZSh2YWx1ZXMsIHByZWZpeCkge1xuICBwcmVmaXggPSBwcmVmaXggPT0gbnVsbCA/ICcnIDogcHJlZml4O1xuXG4gIHJldHVybiB2YWx1ZXMucmVkdWNlKGZ1bmN0aW9uIChlbnVtZXJhdGlvbiwgdmFsdWUpIHtcbiAgICBlbnVtZXJhdGlvblt2YWx1ZV0gPSBwcmVmaXggKyB2YWx1ZTtcbiAgICByZXR1cm4gZW51bWVyYXRpb247XG4gIH0sIHt9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBlbnVtZXJhdGU7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBTZWFtbGVzc3BheUVycm9yID0gcmVxdWlyZSgnLi9zZWFtbGVzc3BheS1lcnJvcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgSU5WQUxJRF9VU0VfT0ZfSU5URVJOQUxfRlVOQ1RJT046IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLklOVEVSTkFMLFxuICAgIGNvZGU6ICdJTlZBTElEX1VTRV9PRl9JTlRFUk5BTF9GVU5DVElPTidcbiAgfSxcbiAgQ0FMTEJBQ0tfUkVRVUlSRUQ6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLk1FUkNIQU5ULFxuICAgIGNvZGU6ICdDQUxMQkFDS19SRVFVSVJFRCdcbiAgfSxcbiAgSU5TVEFOVElBVElPTl9PUFRJT05fUkVRVUlSRUQ6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLk1FUkNIQU5ULFxuICAgIGNvZGU6ICdJTlNUQU5USUFUSU9OX09QVElPTl9SRVFVSVJFRCdcbiAgfSxcbiAgSU5WQUxJRF9PUFRJT046IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLk1FUkNIQU5ULFxuICAgIGNvZGU6ICdJTlZBTElEX09QVElPTidcbiAgfSxcbiAgSU5DT01QQVRJQkxFX1ZFUlNJT05TOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnSU5DT01QQVRJQkxFX1ZFUlNJT05TJ1xuICB9LFxuICBJTkNPTVBBVElCTEVfRklFTERTX1NFVDoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTUVSQ0hBTlQsXG4gICAgY29kZTogJ0lOQ09NUEFUSUJMRV9GSUVMRFNfU0VUJ1xuICB9LFxuICBNRVRIT0RfQ0FMTEVEX0FGVEVSX1RFQVJET1dOOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnTUVUSE9EX0NBTExFRF9BRlRFUl9URUFSRE9XTidcbiAgfSxcbiAgU0VBTUxFU1NQQVlfQVBJX0FDQ0VTU19SRVNUUklDVEVEOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnU0VBTUxFU1NQQVlfQVBJX0FDQ0VTU19SRVNUUklDVEVEJyxcbiAgICBtZXNzYWdlOiAnWW91ciBhY2Nlc3MgaXMgcmVzdHJpY3RlZCBhbmQgY2Fubm90IHVzZSB0aGlzIHBhcnQgb2YgdGhlIFNlYW1sZXNzcGF5IEFQSS4nXG4gIH0sXG4gIFNFQU1MRVNTUEFZX1BBWVBBTF9OT1RfTE9BREVEOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5JTlRFUk5BTCxcbiAgICBjb2RlOiAnU0VBTUxFU1NQQVlfUEFZUEFMX05PVF9MT0FERUQnLFxuICAgIG1lc3NhZ2U6ICdQYXlwYWwgU0RLIGNvdWxkIG5vdCBiZSBsb2FkZWQuJ1xuICB9LFxuICBJTlZBTElEX0xBVElOMV9TVFJJTkc6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLklOVEVSTkFMLFxuICAgIGNvZGU6ICdJTlZBTElEX0xBVElOMV9TVFJJTkcnXG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBBUElfSE9TVCA9IHVuZGVmaW5lZDtcbnZhciBQQU5WQVVMVF9IT1NUID0gdW5kZWZpbmVkO1xudmFyIEFTU0VUU19IT1NUID0gXCJodHRwOi8vbG9jYWxob3N0OjMwMDEvZGV2XCI7XG5cbnZhciBsZWdhbEhvc3RzID0gW1xuICAnc2VhbWxlc3NwYXkuY29tJyxcbiAgJ3NlYW1sZXNzcGF5LmRldicsXG4gICdzZWFtbGVzc3BheS5pbycsXG4gICd3ZWItc2RrLnNlYW1sZXNzcGF5LmNvbScsXG4gICdhcGkuc2VhbWxlc3NwYXkuY29tJyxcbiAgJ2FwaS5zZWFtbGVzc3BheS5kZXYnLFxuICAnYXBpLnNlYW1sZXNzcGF5LmlvJyxcbiAgJ3Bhbi12YXVsdC5zZWFtbGVzc3BheS5jb20nLFxuICAncGFuLXZhdWx0LnNlYW1sZXNzcGF5LmRldicsXG4gICdwYW4tdmF1bHQuc2VhbWxlc3NwYXkuaW8nLFxuICAnYXBpLnNhbmRib3guc2VhbWxlc3NwYXkuY29tJyxcbiAgJ2FwaS5zYW5kYm94LnNlYW1sZXNzcGF5LmRldicsXG4gICdhcGkuc2FuZGJveC5zZWFtbGVzc3BheS5pbycsXG4gICdwYW4tdmF1bHQuc2FuZGJveC5zZWFtbGVzc3BheS5jb20nLFxuICAncGFuLXZhdWx0LnNhbmRib3guc2VhbWxlc3NwYXkuZGV2JyxcbiAgJ3Bhbi12YXVsdC5zYW5kYm94LnNlYW1sZXNzcGF5LmlvJ1xuXTtcblxuLy8gcmVtb3ZlSWYocHJvZHVjdGlvbilcbmxlZ2FsSG9zdHMucHVzaCgnbG9jYWxob3N0Jyk7XG5pZiAoQVBJX0hPU1QpIHtcbiAgbGVnYWxIb3N0cy5wdXNoKHN0cmlwU3ViZG9tYWlucyhBUElfSE9TVCkpO1xufVxuaWYgKFBBTlZBVUxUX0hPU1QpIHtcbiAgbGVnYWxIb3N0cy5wdXNoKHN0cmlwU3ViZG9tYWlucyhQQU5WQVVMVF9IT1NUKSk7XG59XG5pZiAoQVNTRVRTX0hPU1QpIHtcbiAgbGVnYWxIb3N0cy5wdXNoKHN0cmlwU3ViZG9tYWlucyhBU1NFVFNfSE9TVCkucmVwbGFjZSgnaHR0cDovLycsICcnKS5yZXBsYWNlKCdodHRwczovLycsICcnKSk7XG59XG4vLyBlbmRSZW1vdmVJZihwcm9kdWN0aW9uKVxuXG5mdW5jdGlvbiBzdHJpcFN1YmRvbWFpbnMoZG9tYWluKSB7XG4gIHJldHVybiBkb21haW4uc3BsaXQoJy4nKS5zbGljZSgtMikuam9pbignLicpO1xufVxuXG5mdW5jdGlvbiBpc1doaXRlbGlzdGVkRG9tYWluKHVybCkge1xuICAvLyB2YXIgbWFpbkRvbWFpbjtcblxuICAvLyB1cmwgPSB1cmwudG9Mb3dlckNhc2UoKTtcblxuICAvLyBpZiAoIShuZXcgUmVnRXhwKCdeaHR0cHM/OicpKS50ZXN0KHVybCkpIHtcbiAgLy8gICByZXR1cm4gZmFsc2U7XG4gIC8vIH1cblxuICAvLyBwYXJzZXIgPSBwYXJzZXIgfHwgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAvLyBwYXJzZXIuaHJlZiA9IHVybDtcbiAgLy8gbWFpbkRvbWFpbiA9IHN0cmlwU3ViZG9tYWlucyhwYXJzZXIuaG9zdG5hbWUpO1xuICB0cnkge1xuICAgIHZhciBwYXJzZWRVcmwgPSBuZXcgVVJMKHVybCk7XG4gICAgcmV0dXJuIGxlZ2FsSG9zdHMuaW5kZXhPZihzdHJpcFN1YmRvbWFpbnMocGFyc2VkVXJsLmhvc3RuYW1lKSkgIT09IC0xO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNXaGl0ZWxpc3RlZERvbWFpbjtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBTZWFtbGVzc3BheUVycm9yID0gcmVxdWlyZSgnLi9zZWFtbGVzc3BheS1lcnJvcicpO1xudmFyIHNoYXJlZEVycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzJyk7XG5cbnZhciBhdG9iTm9ybWFsaXplZCA9IHR5cGVvZiBnbG9iYWwuYXRvYiA9PT0gJ2Z1bmN0aW9uJyA/IGdsb2JhbC5hdG9iIDogYXRvYjtcbnZhciBidG9hTm9ybWFsaXplZCA9IHR5cGVvZiBnbG9iYWwuYnRvYSA9PT0gJ2Z1bmN0aW9uJyA/IGdsb2JhbC5idG9hIDogYnRvYTtcbnZhciBjaGFyYWN0ZXJzID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky89JztcblxuZnVuY3Rpb24gYXRvYihiYXNlNjRTdHJpbmcpIHtcbiAgdmFyIGEsIGIsIGMsIGIxLCBiMiwgYjMsIGI0LCBpO1xuICB2YXIgYmFzZTY0TWF0Y2hlciA9IG5ldyBSZWdFeHAoJ14oPzpbQS1aYS16MC05Ky9dezR9KSooPzpbQS1aYS16MC05Ky9dezJ9PT18W0EtWmEtejAtOSsvXXszfT18W0EtWmEtejAtOSsvXXs0fSkoWz1dezEsMn0pPyQnKTtcbiAgdmFyIHJlc3VsdCA9ICcnO1xuICBpZiAoIWJhc2U2NE1hdGNoZXIudGVzdChiYXNlNjRTdHJpbmcpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdOb24gYmFzZTY0IGVuY29kZWQgaW5wdXQgcGFzc2VkIHRvIHdpbmRvdy5hdG9iIHBvbHlmaWxsJyk7XG4gIH1cblxuICBpID0gMDtcbiAgZG8ge1xuICAgIGIxID0gY2hhcmFjdGVycy5pbmRleE9mKGJhc2U2NFN0cmluZy5jaGFyQXQoaSsrKSk7XG4gICAgYjIgPSBjaGFyYWN0ZXJzLmluZGV4T2YoYmFzZTY0U3RyaW5nLmNoYXJBdChpKyspKTtcbiAgICBiMyA9IGNoYXJhY3RlcnMuaW5kZXhPZihiYXNlNjRTdHJpbmcuY2hhckF0KGkrKykpO1xuICAgIGI0ID0gY2hhcmFjdGVycy5pbmRleE9mKGJhc2U2NFN0cmluZy5jaGFyQXQoaSsrKSk7XG5cbiAgICBhID0gKGIxICYgMHgzRikgPDwgMiB8IGIyID4+IDQgJiAweDM7XG4gICAgYiA9IChiMiAmIDB4RikgPDwgNCB8IGIzID4+IDIgJiAweEY7XG4gICAgYyA9IChiMyAmIDB4MykgPDwgNiB8IGI0ICYgMHgzRjtcblxuICAgIHJlc3VsdCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGEpICsgKGIgPyBTdHJpbmcuZnJvbUNoYXJDb2RlKGIpIDogJycpICsgKGMgPyBTdHJpbmcuZnJvbUNoYXJDb2RlKGMpIDogJycpO1xuICB9IHdoaWxlIChpIDwgYmFzZTY0U3RyaW5nLmxlbmd0aCk7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gYnRvYShzdHJpbmcpIHtcbiAgc3RyaW5nID0gU3RyaW5nKHN0cmluZyk7XG4gIHZhciBiaXRtYXAsIGEsIGIsIGMsXG4gICAgcmVzdWx0ID0gXCJcIiwgaSA9IDAsXG4gICAgcmVzdCA9IHN0cmluZy5sZW5ndGggJSAzOyAvLyBUbyBkZXRlcm1pbmUgdGhlIGZpbmFsIHBhZGRpbmdcblxuICBmb3IgKDsgaSA8IHN0cmluZy5sZW5ndGg7KSB7XG4gICAgaWYgKChhID0gc3RyaW5nLmNoYXJDb2RlQXQoaSsrKSkgPiAyNTVcbiAgICAgIHx8IChiID0gc3RyaW5nLmNoYXJDb2RlQXQoaSsrKSkgPiAyNTVcbiAgICAgIHx8IChjID0gc3RyaW5nLmNoYXJDb2RlQXQoaSsrKSkgPiAyNTUpXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiRmFpbGVkIHRvIGV4ZWN1dGUgJ2J0b2EnIG9uICdXaW5kb3cnOiBUaGUgc3RyaW5nIHRvIGJlIGVuY29kZWQgY29udGFpbnMgY2hhcmFjdGVycyBvdXRzaWRlIG9mIHRoZSBMYXRpbjEgcmFuZ2UuXCIpO1xuICAgIGJpdG1hcCA9IChhIDw8IDE2KSB8IChiIDw8IDgpIHwgYztcbiAgICByZXN1bHQgKz0gY2hhcmFjdGVycy5jaGFyQXQoYml0bWFwID4+IDE4ICYgNjMpICsgY2hhcmFjdGVycy5jaGFyQXQoYml0bWFwID4+IDEyICYgNjMpXG4gICAgICArIGNoYXJhY3RlcnMuY2hhckF0KGJpdG1hcCA+PiA2ICYgNjMpICsgY2hhcmFjdGVycy5jaGFyQXQoYml0bWFwICYgNjMpO1xuICB9XG4gIC8vIElmIHRoZXJlJ3MgbmVlZCBvZiBwYWRkaW5nLCByZXBsYWNlIHRoZSBsYXN0ICdBJ3Mgd2l0aCBlcXVhbCBzaWduc1xuICByZXR1cm4gcmVzdCA/IHJlc3VsdC5zbGljZSgwLCByZXN0IC0gMykgKyBcIj09PVwiLnN1YnN0cmluZyhyZXN0KSA6IHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gdmFsaWRhdGVMYXRpbjFDaGFyYWN0ZXJzRGVjb3JhdG9yKGZ1bmMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChzdHJpbmcsIG9wdGlvbnMpIHtcbiAgICB2YXIgaXNTZW5zaXRpdmUgPSAob3B0aW9ucyB8fCB7fSkuaXNTZW5zaXRpdmU7XG4gICAgdmFyIGkgPSAwO1xuICAgIHN0cmluZyA9IFN0cmluZyhzdHJpbmcpO1xuICAgIHdoaWxlIChpIDwgc3RyaW5nLmxlbmd0aCkge1xuICAgICAgaWYgKHN0cmluZy5jaGFyQ29kZUF0KGkrKykgPiAyNTUpXG4gICAgICAgIHRocm93IG5ldyBTZWFtbGVzc3BheUVycm9yKHtcbiAgICAgICAgICB0eXBlOiBzaGFyZWRFcnJvcnMuSU5WQUxJRF9MQVRJTjFfU1RSSU5HLnR5cGUsXG4gICAgICAgICAgY29kZTogc2hhcmVkRXJyb3JzLklOVkFMSURfTEFUSU4xX1NUUklORy5jb2RlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiRmFpbGVkIHRvIGV4ZWN1dGUgJ2J0b2EnIG9uICdXaW5kb3cnOiBUaGUgc3RyaW5nIHRvIGJlIGVuY29kZWQgY29udGFpbnMgaW52YWxpZCBjaGFyYWN0ZXIgJ1wiICtcbiAgICAgICAgICAgIHN0cmluZ1tpIC0gMV0gK1xuICAgICAgICAgICAgXCInIGF0IHBvc2l0aW9uIFwiICsgKGkgLSAxKSArIFwiIG9mIHN0cmluZ1wiICtcbiAgICAgICAgICAgICghaXNTZW5zaXRpdmUgPyBcIiAnXCIgKyBzdHJpbmcgKyBcIidcIiA6IFwiXCIpICsgXCIuXCJcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpcywgW3N0cmluZ10pO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYXRvYjogYXRvYk5vcm1hbGl6ZWQsXG4gIGJ0b2E6IHZhbGlkYXRlTGF0aW4xQ2hhcmFjdGVyc0RlY29yYXRvcihidG9hTm9ybWFsaXplZCksXG4gIF9hdG9iOiBhdG9iLFxuICBfYnRvYTogYnRvYVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFByb21pc2UgPSBnbG9iYWwuUHJvbWlzZTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm9taXNlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBfbm90RW1wdHkob2JqKSB7XG4gIHZhciBrZXk7XG5cbiAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7IHJldHVybiB0cnVlOyB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIF9pc0FycmF5KHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHR5cGVvZiB2YWx1ZS5sZW5ndGggPT09ICdudW1iZXInICYmXG4gICAgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgQXJyYXldJyB8fCBmYWxzZTtcbn1cblxuZnVuY3Rpb24gcGFyc2UodXJsKSB7XG4gIHZhciBxdWVyeSwgcGFyYW1zO1xuXG4gIHVybCA9IHVybCB8fCBnbG9iYWwubG9jYXRpb24uaHJlZjtcblxuICBpZiAoIS9cXD8vLnRlc3QodXJsKSkge1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIHF1ZXJ5ID0gdXJsLnJlcGxhY2UoLyMuKiQvLCAnJykucmVwbGFjZSgvXi4qXFw/LywgJycpLnNwbGl0KCcmJyk7XG5cbiAgcGFyYW1zID0gcXVlcnkucmVkdWNlKGZ1bmN0aW9uICh0b1JldHVybiwga2V5VmFsdWUpIHtcbiAgICB2YXIgcGFydHMgPSBrZXlWYWx1ZS5zcGxpdCgnPScpO1xuICAgIHZhciBrZXkgPSBkZWNvZGVVUklDb21wb25lbnQocGFydHNbMF0pO1xuICAgIHZhciB2YWx1ZSA9IGRlY29kZVVSSUNvbXBvbmVudChwYXJ0c1sxXSk7XG5cbiAgICB0b1JldHVybltrZXldID0gdmFsdWU7XG4gICAgcmV0dXJuIHRvUmV0dXJuO1xuICB9LCB7fSk7XG5cbiAgcmV0dXJuIHBhcmFtcztcbn1cblxuZnVuY3Rpb24gc3RyaW5naWZ5KHBhcmFtcywgbmFtZXNwYWNlKSB7XG4gIHZhciBrLCB2LCBwO1xuICB2YXIgcXVlcnkgPSBbXTtcblxuICBmb3IgKHAgaW4gcGFyYW1zKSB7XG4gICAgaWYgKCFwYXJhbXMuaGFzT3duUHJvcGVydHkocCkpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHYgPSBwYXJhbXNbcF07XG5cbiAgICBpZiAobmFtZXNwYWNlKSB7XG4gICAgICBpZiAoX2lzQXJyYXkocGFyYW1zKSkge1xuICAgICAgICBrID0gbmFtZXNwYWNlICsgJ1tdJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGsgPSBuYW1lc3BhY2UgKyAnWycgKyBwICsgJ10nO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBrID0gcDtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB2ID09PSAnb2JqZWN0Jykge1xuICAgICAgcXVlcnkucHVzaChzdHJpbmdpZnkodiwgaykpO1xuICAgIH0gZWxzZSB7XG4gICAgICBxdWVyeS5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChrKSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh2KSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHF1ZXJ5LmpvaW4oJyYnKTtcbn1cblxuZnVuY3Rpb24gcXVlcnlpZnkodXJsLCBwYXJhbXMpIHtcbiAgdXJsID0gdXJsIHx8ICcnO1xuXG4gIGlmIChwYXJhbXMgIT0gbnVsbCAmJiB0eXBlb2YgcGFyYW1zID09PSAnb2JqZWN0JyAmJiBfbm90RW1wdHkocGFyYW1zKSkge1xuICAgIHVybCArPSB1cmwuaW5kZXhPZignPycpID09PSAtMSA/ICc/JyA6ICcnO1xuICAgIHVybCArPSB1cmwuaW5kZXhPZignPScpICE9PSAtMSA/ICcmJyA6ICcnO1xuICAgIHVybCArPSBzdHJpbmdpZnkocGFyYW1zKTtcbiAgfVxuXG4gIHJldHVybiB1cmw7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBwYXJzZTogcGFyc2UsXG4gIHN0cmluZ2lmeTogc3RyaW5naWZ5LFxuICBxdWVyeWlmeTogcXVlcnlpZnlcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBlbnVtZXJhdGUgPSByZXF1aXJlKCcuL2VudW1lcmF0ZScpO1xuXG4vKipcbiAqIEBjbGFzc1xuICogQGdsb2JhbFxuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgQ29uc3RydWN0aW9uIG9wdGlvbnNcbiAqIEBjbGFzc2Rlc2MgVGhpcyBjbGFzcyBpcyB1c2VkIHRvIHJlcG9ydCBlcnJvciBjb25kaXRpb25zLCBmcmVxdWVudGx5IGFzIHRoZSBmaXJzdCBwYXJhbWV0ZXIgdG8gY2FsbGJhY2tzIHRocm91Z2hvdXQgdGhlIFNlYW1sZXNzcGF5IFNESy5cbiAqIEBkZXNjcmlwdGlvbiA8c3Ryb25nPllvdSBjYW5ub3QgdXNlIHRoaXMgY29uc3RydWN0b3IgZGlyZWN0bHkuIEludGVyYWN0IHdpdGggaW5zdGFuY2VzIG9mIHRoaXMgY2xhc3MgdGhyb3VnaCB7QGxpbmsgY2FsbGJhY2sgY2FsbGJhY2tzfS48L3N0cm9uZz5cbiAqL1xuZnVuY3Rpb24gU2VhbWxlc3NwYXlFcnJvcihvcHRpb25zKSB7XG4gIGlmICghU2VhbWxlc3NwYXlFcnJvci50eXBlcy5oYXNPd25Qcm9wZXJ0eShvcHRpb25zLnR5cGUpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKG9wdGlvbnMudHlwZSArICcgaXMgbm90IGEgdmFsaWQgdHlwZS4nKTtcbiAgfVxuXG4gIGlmICghb3B0aW9ucy5jb2RlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdFcnJvciBjb2RlIHJlcXVpcmVkLicpO1xuICB9XG5cbiAgaWYgKCFvcHRpb25zLm1lc3NhZ2UpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yIG1lc3NhZ2UgcmVxdWlyZWQuJyk7XG4gIH1cblxuICB0aGlzLm5hbWUgPSAnU2VhbWxlc3NwYXlFcnJvcic7XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqIEBkZXNjcmlwdGlvbiBBIGNvZGUgdGhhdCBjb3JyZXNwb25kcyB0byBzcGVjaWZpYyBlcnJvcnMuXG4gICAqL1xuICB0aGlzLmNvZGUgPSBvcHRpb25zLmNvZGU7XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqIEBkZXNjcmlwdGlvbiBBIHNob3J0IGRlc2NyaXB0aW9uIG9mIHRoZSBlcnJvci5cbiAgICovXG4gIHRoaXMubWVzc2FnZSA9IG9wdGlvbnMubWVzc2FnZTtcblxuICAvKipcbiAgICogQHR5cGUge1NlYW1sZXNzcGF5RXJyb3IudHlwZXN9XG4gICAqIEBkZXNjcmlwdGlvbiBUaGUgdHlwZSBvZiBlcnJvci5cbiAgICovXG4gIHRoaXMudHlwZSA9IG9wdGlvbnMudHlwZTtcblxuICAvKipcbiAgICogQHR5cGUge29iamVjdD19XG4gICAqIEBkZXNjcmlwdGlvbiBBZGRpdGlvbmFsIGluZm9ybWF0aW9uIGFib3V0IHRoZSBlcnJvciwgc3VjaCBhcyBhbiB1bmRlcmx5aW5nIG5ldHdvcmsgZXJyb3IgcmVzcG9uc2UuXG4gICAqL1xuICB0aGlzLmRldGFpbHMgPSBvcHRpb25zLmRldGFpbHM7XG59XG5cblNlYW1sZXNzcGF5RXJyb3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFcnJvci5wcm90b3R5cGUpO1xuU2VhbWxlc3NwYXlFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBTZWFtbGVzc3BheUVycm9yO1xuXG4vKipcbiAqIEVudW0gZm9yIHtAbGluayBTZWFtbGVzc3BheUVycm9yfSB0eXBlcy5cbiAqIEBuYW1lIFNlYW1sZXNzcGF5RXJyb3IudHlwZXNcbiAqIEBlbnVtXG4gKiBAcmVhZG9ubHlcbiAqIEBtZW1iZXJvZiBTZWFtbGVzc3BheUVycm9yXG4gKiBAcHJvcGVydHkge3N0cmluZ30gQ1VTVE9NRVIgQW4gZXJyb3IgY2F1c2VkIGJ5IHRoZSBjdXN0b21lci5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBNRVJDSEFOVCBBbiBlcnJvciB0aGF0IGlzIGFjdGlvbmFibGUgYnkgdGhlIG1lcmNoYW50LlxuICogQHByb3BlcnR5IHtzdHJpbmd9IE5FVFdPUksgQW4gZXJyb3IgZHVlIHRvIGEgbmV0d29yayBwcm9ibGVtLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IElOVEVSTkFMIEFuIGVycm9yIGNhdXNlZCBieSBTZWFtbGVzc3BheSBjb2RlLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IFVOS05PV04gQW4gZXJyb3Igd2hlcmUgdGhlIG9yaWdpbiBpcyB1bmtub3duLlxuICovXG5TZWFtbGVzc3BheUVycm9yLnR5cGVzID0gZW51bWVyYXRlKFtcbiAgJ0NVU1RPTUVSJyxcbiAgJ01FUkNIQU5UJyxcbiAgJ05FVFdPUksnLFxuICAnSU5URVJOQUwnLFxuICAnVU5LTk9XTidcbl0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNlYW1sZXNzcGF5RXJyb3I7XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIHV1aWQoKSB7XG4gIHJldHVybiAneHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4Jy5yZXBsYWNlKC9beHldL2csIGZ1bmN0aW9uIChjKSB7XG4gICAgdmFyIHIgPSBNYXRoLnJhbmRvbSgpICogMTYgfCAwO1xuICAgIHZhciB2ID0gYyA9PT0gJ3gnID8gciA6IHIgJiAweDMgfCAweDg7XG5cbiAgICByZXR1cm4gdi50b1N0cmluZygxNik7XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHV1aWQ7XG4iXX0=
