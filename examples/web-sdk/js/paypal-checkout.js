(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.seamlesspay || (g.seamlesspay = {})).paypalCheckout = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(_dereq_,module,exports){
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

},{}],6:[function(_dereq_,module,exports){
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

},{"./errors":9,"./promise":10,"./seamlesspay-error":11}],7:[function(_dereq_,module,exports){
'use strict';

function enumerate(values, prefix) {
  prefix = prefix == null ? '' : prefix;

  return values.reduce(function (enumeration, value) {
    enumeration[value] = prefix + value;
    return enumeration;
  }, {});
}

module.exports = enumerate;

},{}],8:[function(_dereq_,module,exports){
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

},{"./enumerate":7}],9:[function(_dereq_,module,exports){
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

},{"./seamlesspay-error":11}],10:[function(_dereq_,module,exports){
(function (global){(function (){
'use strict';

var Promise = global.Promise;

module.exports = Promise;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],11:[function(_dereq_,module,exports){
arguments[4][8][0].apply(exports,arguments)
},{"./enumerate":7,"dup":8}],12:[function(_dereq_,module,exports){
'use strict';
/**
 * @module seamlesspay-web/paypal-checkout
 * @description A component to integrate with the [PayPal Checkout.js library](https://github.com/paypal/paypal-checkout).
 */

var basicComponentVerification = _dereq_('../lib/basic-component-verification');
var wrapPromise = _dereq_('@braintree/wrap-promise');
var PayPalCheckout = _dereq_('./paypal-checkout');

var VERSION = "web-sdk";

/**
 * @static
 * @function create
 * @description There are two ways to integrate the PayPal Checkout component. See the [PayPal Checkout constructor documentation](PayPalCheckout.html#PayPalCheckout) for more information and examples.
 *
 * @param {object} options Creation options:
 * @param {Client} [options.client] A {@link Client} instance.
 * @param {string} [options.authorization] A tokenizationKey or clientToken. Can be used in place of `options.client`.
 * @param {string} [options.merchantAccountId] A non-default merchant account ID to use for tokenization.
 * @param {callback} [callback] The second argument, `data`, is the {@link PayPalCheckout} instance.
 * @example
 * seamlesspay.client.create({
 *   authorization: 'authorization'
 * }).then(function (clientInstance) {
 *   return seamlesspay.paypalCheckout.create({
 *     client: clientInstance
 *   });
 * }).then(function (paypalCheckoutInstance) {
 *   // set up checkout.js
 * }).catch(function (err) {
 *   console.error('Error!', err);
 * });
 * @returns {Promise|void} Returns a promise if no callback is provided.
 */
function create(options) {

  return basicComponentVerification.verify({
    name: 'PayPal Checkout',
    client: options.client,
    authorization: options.authorization
  }).then(function () {
    var payPalCheckoutComponent = new PayPalCheckout(options);

    return payPalCheckoutComponent.initialize();
  });
}

module.exports = {
  create: wrapPromise(create),
  VERSION: VERSION
};

},{"../lib/basic-component-verification":6,"./paypal-checkout":13,"@braintree/wrap-promise":4}],13:[function(_dereq_,module,exports){
'use strict';

var VERSION = "web-sdk";
var sharedErrors = _dereq_('../lib/errors');
var Promise = _dereq_('../lib/promise');
var wrapPromise = _dereq_('@braintree/wrap-promise');
var SeamlesspayError = _dereq_('../lib/error');
var assign = _dereq_('../lib/assign').assign;

/**
 *
 * #### Integrate Checkout Flow with PayPal SDK
 *
 *
 * ```html
 * <script src="https://web-sdk.seamlesspay.com/x.x.x/js/index.min.js"></script>
 * <div id="seamlesspay-paypal-button-container"></div>
 * ```
 *
 * ```javascript
  seamlesspay.client.create({
    authorization: 'pk_01CN4E9G1JDEXXF3MCG471BMCR',
    transactionApi: {
      accessToken: btoa('sk_01CN49Z7VD2EQCW7BNZSFYXMQZ')
    },
    environment: 'development'
  }).then((client) => {
    return seamlesspay.paypalCheckout.create({
      client
    })
  }).then((paypalCheckoutInstance) => {
    paypalCheckoutInstance.createButtons({
      container: "#seamlesspay-paypal-button-container",
      order: {
        "capture": true,
        "amount": "107.95",
        "shippingAmount": "9.95",
        "type": "paypal",
        "items": [{
          "name": "Monrow Granite Long Sleeve Thermal",
          "quantity": "1",
          "unitCost": "98",
          "description": $('#comments').val()
        }]
      },
      // Finalize the transaction
      onPaymentCreated: (transaction) => {
        console.log('transaction: ', transaction);
      },
      onShippingChange: (shippingData) => {
            console.log('shippingData: ', shippingData);
      },
      onError: (err) => {
        // Show an error page here, when an error occurs
      },
      onOrderError: (err) => {
        // Show an error order here,
      },
      onPaymentError: (err) => {
        // Show an error payment here,
      },
    })
  })
 * ```
**/

var defaultStyle = {
  layout:  'horizontal',
  fundingicons: false,
  color:   'black',
  shape:   'rect',
  label:   'checkout',
  tagline: false,
  size: 'responsive'
};

function createOrder(client, data) {
  return client.request({
    api: 'seamlesspayApi',
    endpoint: 'orders',
    method: 'post',
    data: data
  }).then(function(order) {
    data.id = order.id;

    return order.processorOrderId
  });
}

function updateOrder(client, data) {
  return client.request({
    api: 'seamlesspayApi',
    endpoint: 'orders/' + data.id,
    method: 'put',
    data: data
  })
}

function createPayment(client, data) {
  return client.request({
    api: 'seamlesspayApi',
    endpoint: 'paypal-transactions/charge',
    method: 'post',
    data: {
      processorOrderId: data.orderID
    }
  });
}

function PayPalCheckout(options) {
  var clientVersion, clientConfig;

  if (!options.client) {
    throw new SeamlesspayError({
      type: sharedErrors.INSTANTIATION_OPTION_REQUIRED.type,
      code: sharedErrors.INSTANTIATION_OPTION_REQUIRED.code,
      message: 'options.client is required when instantiating Paypal Checkout.'
    });
  }

  clientConfig = options.client.getConfiguration();
  clientVersion = clientConfig.analyticsMetadata.sdkVersion;
  if (clientVersion !== VERSION) {
    throw new SeamlesspayError({
      type: sharedErrors.INCOMPATIBLE_VERSIONS.type,
      code: sharedErrors.INCOMPATIBLE_VERSIONS.code,
      message: 'Client (version ' + clientVersion + ') and Paypal Checkout (version ' + VERSION + ') components must be from the same SDK version.'
    });
  }

  this._client = options.client;
}

PayPalCheckout.prototype.initialize = function () {
  var PayPalCheckoutInsance = this;
  var clientConfig = PayPalCheckoutInsance._client.getConfiguration();
  var merchantId = ((clientConfig.gatewayConfiguration.merchant.settings.processors || {}).PAYPAL || {}).accountId;

  return new Promise(function (resolve) {
    var script = document.createElement("script");
    script.src = 'https://www.paypal.com/sdk/js?' +
      'client-id=' + undefined + '&' +
      '&merchant-id=' + merchantId +
      '&disable-funding=credit'
    ;
    script.setAttribute('data-partner-attribution-id', 'Seamlesspay_SP');
    script.async = true;

    script.onerror = function() {
      throw new SeamlesspayError({
        type: sharedErrors.SEAMLESSPAY_PAYPAL_NOT_LOADED.type,
        code: sharedErrors.SEAMLESSPAY_PAYPAL_NOT_LOADED.code,
        message: sharedErrors.SEAMLESSPAY_PAYPAL_NOT_LOADED.message
      });
    };
    script.onload = function () {
      return resolve(PayPalCheckoutInsance);
    };

    document.body.appendChild(script);
  });
};

PayPalCheckout.prototype.createButtons = function (options) {
  if (!options) {
    throw new SeamlesspayError({
      type: sharedErrors.INSTANTIATION_OPTION_REQUIRED.type,
      code: sharedErrors.INSTANTIATION_OPTION_REQUIRED.code,
      message: 'options is required when instantiating buttons.'
    });
  }

  if (!options.order) {
    throw new SeamlesspayError({
      type: sharedErrors.INSTANTIATION_OPTION_REQUIRED.type,
      code: sharedErrors.INSTANTIATION_OPTION_REQUIRED.code,
      message: 'options.order is required when instantiating buttons.'
    });
  }

  var client = this._client;

  var container = options.container || '#seamlesspay-paypal-button-container';
  var style = options.style || {};
  var order = options.order;
  var onShippingChange = options.onShippingChange;
  var onOrderError = options.onOrderError;
  var onPaymentError = options.onPaymentError;
  var onPaymentCreated = options.onPaymentCreated;
  var onPaymentProcess = options.onPaymentProcess;
  var onError = options.onError;

  window.paypal.Buttons({
    style: assign(defaultStyle, style),
    // Set up the transaction
    createOrder: function() {
      return createOrder(client, order)
        .catch(function(err) {
          if (typeof onOrderError === 'function') onOrderError(err)
        });
    },
    // Finalize the transaction
    onApprove: function(data) {
      if (typeof onPaymentProcess === 'function') onPaymentProcess();
      return createPayment(client, data)
        .then(function(transaction) {
          if (typeof onPaymentCreated === 'function') onPaymentCreated(transaction);
        })
        .catch(function(err) {
          if (typeof onPaymentError === 'function') onPaymentError(err);
        })
    },
    onShippingChange: function(data, actions) {
      var shippingAddress = (data || {}).shipping_address || {};
      var mappedFields = {
        countryCode: 'country_code',
        state: 'state',
        city: 'city',
        shipToZip: 'postal_code'
      };

      if (typeof onShippingChange !== 'function') return actions.resolve();

      var mappedValues = Object.keys(mappedFields)
        .reduce(function (result, field) {
          var nextValue = {};
          nextValue[field] = shippingAddress[mappedFields[field]];

          return assign(result, nextValue);
        }, {});
      var res = onShippingChange(mappedValues);

      if (typeof res === 'object' && typeof res.then !== 'function' )
        return updateOrder(client, assign(order, res || {}))
          .then(function() {
            return actions.resolve();
          }).catch(function() {
            return actions.reject();
          });

      if (typeof res === 'object' && typeof res.then === 'function' )
        return res
          .then(function(nextOrder) {
            return updateOrder(client, assign(order, nextOrder || {}));
          })
          .then(function() {
            return actions.resolve();
          }).catch(function() {
            return actions.reject();
          });

      return actions.resolve();
    },
    onError: function (err) {
      if (typeof onError === 'function') onError(err);
    }
  })
    .render(container);
};

module.exports = wrapPromise.wrapPrototype(PayPalCheckout);

},{"../lib/assign":5,"../lib/error":8,"../lib/errors":9,"../lib/promise":10,"@braintree/wrap-promise":4}]},{},[12])(12)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvQGJyYWludHJlZS93cmFwLXByb21pc2UvbGliL2RlZmVycmVkLmpzIiwibm9kZV9tb2R1bGVzL0BicmFpbnRyZWUvd3JhcC1wcm9taXNlL2xpYi9vbmNlLmpzIiwibm9kZV9tb2R1bGVzL0BicmFpbnRyZWUvd3JhcC1wcm9taXNlL2xpYi9wcm9taXNlLW9yLWNhbGxiYWNrLmpzIiwibm9kZV9tb2R1bGVzL0BicmFpbnRyZWUvd3JhcC1wcm9taXNlL3dyYXAtcHJvbWlzZS5qcyIsInNyYy9saWIvYXNzaWduLmpzIiwic3JjL2xpYi9iYXNpYy1jb21wb25lbnQtdmVyaWZpY2F0aW9uLmpzIiwic3JjL2xpYi9lbnVtZXJhdGUuanMiLCJzcmMvbGliL2Vycm9yLmpzIiwic3JjL2xpYi9lcnJvcnMuanMiLCJzcmMvbGliL3Byb21pc2UuanMiLCJzcmMvcGF5cGFsLWNoZWNrb3V0L2luZGV4LmpzIiwic3JjL3BheXBhbC1jaGVja291dC9wYXlwYWwtY2hlY2tvdXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gZGVmZXJyZWQoZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAvLyBJRTkgZG9lc24ndCBzdXBwb3J0IHBhc3NpbmcgYXJndW1lbnRzIHRvIHNldFRpbWVvdXQgc28gd2UgaGF2ZSB0byBlbXVsYXRlIGl0LlxuICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBmbi5hcHBseShudWxsLCBhcmdzKTtcbiAgICB9LCAxKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkZWZlcnJlZDtcbiIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gb25jZShmbikge1xuICB2YXIgY2FsbGVkID0gZmFsc2U7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIWNhbGxlZCkge1xuICAgICAgY2FsbGVkID0gdHJ1ZTtcbiAgICAgIGZuLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG9uY2U7XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIHByb21pc2VPckNhbGxiYWNrKHByb21pc2UsIGNhbGxiYWNrKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgY29uc2lzdGVudC1yZXR1cm5cbiAgaWYgKGNhbGxiYWNrKSB7XG4gICAgcHJvbWlzZVxuICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgZGF0YSk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcHJvbWlzZU9yQ2FsbGJhY2s7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBkZWZlcnJlZCA9IHJlcXVpcmUoJy4vbGliL2RlZmVycmVkJyk7XG52YXIgb25jZSA9IHJlcXVpcmUoJy4vbGliL29uY2UnKTtcbnZhciBwcm9taXNlT3JDYWxsYmFjayA9IHJlcXVpcmUoJy4vbGliL3Byb21pc2Utb3ItY2FsbGJhY2snKTtcblxuZnVuY3Rpb24gd3JhcFByb21pc2UoZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2FsbGJhY2s7XG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgIHZhciBsYXN0QXJnID0gYXJnc1thcmdzLmxlbmd0aCAtIDFdO1xuXG4gICAgaWYgKHR5cGVvZiBsYXN0QXJnID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjYWxsYmFjayA9IGFyZ3MucG9wKCk7XG4gICAgICBjYWxsYmFjayA9IG9uY2UoZGVmZXJyZWQoY2FsbGJhY2spKTtcbiAgICB9XG4gICAgcmV0dXJuIHByb21pc2VPckNhbGxiYWNrKGZuLmFwcGx5KHRoaXMsIGFyZ3MpLCBjYWxsYmFjayk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8taW52YWxpZC10aGlzXG4gIH07XG59XG5cbndyYXBQcm9taXNlLndyYXBQcm90b3R5cGUgPSBmdW5jdGlvbiAodGFyZ2V0LCBvcHRpb25zKSB7XG4gIHZhciBtZXRob2RzLCBpZ25vcmVNZXRob2RzLCBpbmNsdWRlUHJpdmF0ZU1ldGhvZHM7XG5cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGlnbm9yZU1ldGhvZHMgPSBvcHRpb25zLmlnbm9yZU1ldGhvZHMgfHwgW107XG4gIGluY2x1ZGVQcml2YXRlTWV0aG9kcyA9IG9wdGlvbnMudHJhbnNmb3JtUHJpdmF0ZU1ldGhvZHMgPT09IHRydWU7XG5cbiAgbWV0aG9kcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRhcmdldC5wcm90b3R5cGUpLmZpbHRlcihmdW5jdGlvbiAobWV0aG9kKSB7XG4gICAgdmFyIGlzTm90UHJpdmF0ZU1ldGhvZDtcbiAgICB2YXIgaXNOb25Db25zdHJ1Y3RvckZ1bmN0aW9uID0gbWV0aG9kICE9PSAnY29uc3RydWN0b3InICYmXG4gICAgICB0eXBlb2YgdGFyZ2V0LnByb3RvdHlwZVttZXRob2RdID09PSAnZnVuY3Rpb24nO1xuICAgIHZhciBpc05vdEFuSWdub3JlZE1ldGhvZCA9IGlnbm9yZU1ldGhvZHMuaW5kZXhPZihtZXRob2QpID09PSAtMTtcblxuICAgIGlmIChpbmNsdWRlUHJpdmF0ZU1ldGhvZHMpIHtcbiAgICAgIGlzTm90UHJpdmF0ZU1ldGhvZCA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlzTm90UHJpdmF0ZU1ldGhvZCA9IG1ldGhvZC5jaGFyQXQoMCkgIT09ICdfJztcbiAgICB9XG5cbiAgICByZXR1cm4gaXNOb25Db25zdHJ1Y3RvckZ1bmN0aW9uICYmXG4gICAgICBpc05vdFByaXZhdGVNZXRob2QgJiZcbiAgICAgIGlzTm90QW5JZ25vcmVkTWV0aG9kO1xuICB9KTtcblxuICBtZXRob2RzLmZvckVhY2goZnVuY3Rpb24gKG1ldGhvZCkge1xuICAgIHZhciBvcmlnaW5hbCA9IHRhcmdldC5wcm90b3R5cGVbbWV0aG9kXTtcblxuICAgIHRhcmdldC5wcm90b3R5cGVbbWV0aG9kXSA9IHdyYXBQcm9taXNlKG9yaWdpbmFsKTtcbiAgfSk7XG5cbiAgcmV0dXJuIHRhcmdldDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gd3JhcFByb21pc2U7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBhc3NpZ25Ob3JtYWxpemVkID0gdHlwZW9mIE9iamVjdC5hc3NpZ24gPT09ICdmdW5jdGlvbicgPyBPYmplY3QuYXNzaWduIDogYXNzaWduUG9seWZpbGw7XG5cbmZ1bmN0aW9uIGFzc2lnblBvbHlmaWxsKGRlc3RpbmF0aW9uKSB7XG4gIHZhciBpLCBzb3VyY2UsIGtleTtcblxuICBmb3IgKGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgc291cmNlID0gYXJndW1lbnRzW2ldO1xuICAgIGZvciAoa2V5IGluIHNvdXJjZSkge1xuICAgICAgaWYgKHNvdXJjZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIGRlc3RpbmF0aW9uW2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZGVzdGluYXRpb247XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhc3NpZ246IGFzc2lnbk5vcm1hbGl6ZWQsXG4gIF9hc3NpZ246IGFzc2lnblBvbHlmaWxsXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgU2VhbWxlc3NwYXlFcnJvciA9IHJlcXVpcmUoJy4vc2VhbWxlc3NwYXktZXJyb3InKTtcbnZhciBQcm9taXNlID0gcmVxdWlyZSgnLi9wcm9taXNlJyk7XG52YXIgc2hhcmVkRXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMnKTtcbnZhciBWRVJTSU9OID0gXCJ3ZWItc2RrXCI7XG5cbmZ1bmN0aW9uIGJhc2ljQ29tcG9uZW50VmVyaWZpY2F0aW9uKG9wdGlvbnMpIHtcbiAgdmFyIGNsaWVudCwgY2xpZW50VmVyc2lvbiwgbmFtZTtcblxuICBpZiAoIW9wdGlvbnMpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgdHlwZTogc2hhcmVkRXJyb3JzLklOVkFMSURfVVNFX09GX0lOVEVSTkFMX0ZVTkNUSU9OLnR5cGUsXG4gICAgICBjb2RlOiBzaGFyZWRFcnJvcnMuSU5WQUxJRF9VU0VfT0ZfSU5URVJOQUxfRlVOQ1RJT04uY29kZSxcbiAgICAgIG1lc3NhZ2U6ICdPcHRpb25zIG11c3QgYmUgcGFzc2VkIHRvIGJhc2ljQ29tcG9uZW50VmVyaWZpY2F0aW9uIGZ1bmN0aW9uLidcbiAgICB9KSk7XG4gIH1cblxuICBuYW1lID0gb3B0aW9ucy5uYW1lO1xuICBjbGllbnQgPSBvcHRpb25zLmNsaWVudDtcblxuICBpZiAoY2xpZW50ID09IG51bGwpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgdHlwZTogc2hhcmVkRXJyb3JzLklOU1RBTlRJQVRJT05fT1BUSU9OX1JFUVVJUkVELnR5cGUsXG4gICAgICBjb2RlOiBzaGFyZWRFcnJvcnMuSU5TVEFOVElBVElPTl9PUFRJT05fUkVRVUlSRUQuY29kZSxcbiAgICAgIG1lc3NhZ2U6ICdvcHRpb25zLmNsaWVudCBpcyByZXF1aXJlZCB3aGVuIGluc3RhbnRpYXRpbmcgJyArIG5hbWUgKyAnLidcbiAgICB9KSk7XG4gIH1cblxuICBjbGllbnRWZXJzaW9uID0gY2xpZW50LmdldFZlcnNpb24oKTtcblxuICBpZiAoY2xpZW50VmVyc2lvbiAhPT0gVkVSU0lPTikge1xuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgU2VhbWxlc3NwYXlFcnJvcih7XG4gICAgICB0eXBlOiBzaGFyZWRFcnJvcnMuSU5DT01QQVRJQkxFX1ZFUlNJT05TLnR5cGUsXG4gICAgICBjb2RlOiBzaGFyZWRFcnJvcnMuSU5DT01QQVRJQkxFX1ZFUlNJT05TLmNvZGUsXG4gICAgICBtZXNzYWdlOiAnQ2xpZW50ICh2ZXJzaW9uICcgKyBjbGllbnRWZXJzaW9uICsgJykgYW5kICcgKyBuYW1lICsgJyAodmVyc2lvbiAnICsgVkVSU0lPTiArICcpIGNvbXBvbmVudHMgbXVzdCBiZSBmcm9tIHRoZSBzYW1lIFNESyB2ZXJzaW9uLidcbiAgICB9KSk7XG4gIH1cblxuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICB2ZXJpZnk6IGJhc2ljQ29tcG9uZW50VmVyaWZpY2F0aW9uXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBlbnVtZXJhdGUodmFsdWVzLCBwcmVmaXgpIHtcbiAgcHJlZml4ID0gcHJlZml4ID09IG51bGwgPyAnJyA6IHByZWZpeDtcblxuICByZXR1cm4gdmFsdWVzLnJlZHVjZShmdW5jdGlvbiAoZW51bWVyYXRpb24sIHZhbHVlKSB7XG4gICAgZW51bWVyYXRpb25bdmFsdWVdID0gcHJlZml4ICsgdmFsdWU7XG4gICAgcmV0dXJuIGVudW1lcmF0aW9uO1xuICB9LCB7fSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZW51bWVyYXRlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZW51bWVyYXRlID0gcmVxdWlyZSgnLi9lbnVtZXJhdGUnKTtcblxuLyoqXG4gKiBAY2xhc3NcbiAqIEBnbG9iYWxcbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIENvbnN0cnVjdGlvbiBvcHRpb25zXG4gKiBAY2xhc3NkZXNjIFRoaXMgY2xhc3MgaXMgdXNlZCB0byByZXBvcnQgZXJyb3IgY29uZGl0aW9ucywgZnJlcXVlbnRseSBhcyB0aGUgZmlyc3QgcGFyYW1ldGVyIHRvIGNhbGxiYWNrcyB0aHJvdWdob3V0IHRoZSBTZWFtbGVzc3BheSBTREsuXG4gKiBAZGVzY3JpcHRpb24gPHN0cm9uZz5Zb3UgY2Fubm90IHVzZSB0aGlzIGNvbnN0cnVjdG9yIGRpcmVjdGx5LiBJbnRlcmFjdCB3aXRoIGluc3RhbmNlcyBvZiB0aGlzIGNsYXNzIHRocm91Z2gge0BsaW5rIGNhbGxiYWNrIGNhbGxiYWNrc30uPC9zdHJvbmc+XG4gKi9cbmZ1bmN0aW9uIFNlYW1sZXNzcGF5RXJyb3Iob3B0aW9ucykge1xuICBpZiAoIVNlYW1sZXNzcGF5RXJyb3IudHlwZXMuaGFzT3duUHJvcGVydHkob3B0aW9ucy50eXBlKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihvcHRpb25zLnR5cGUgKyAnIGlzIG5vdCBhIHZhbGlkIHR5cGUuJyk7XG4gIH1cblxuICBpZiAoIW9wdGlvbnMuY29kZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignRXJyb3IgY29kZSByZXF1aXJlZC4nKTtcbiAgfVxuXG4gIGlmICghb3B0aW9ucy5tZXNzYWdlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdFcnJvciBtZXNzYWdlIHJlcXVpcmVkLicpO1xuICB9XG5cbiAgdGhpcy5uYW1lID0gJ1NlYW1sZXNzcGF5RXJyb3InO1xuXG4gIC8qKlxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKiBAZGVzY3JpcHRpb24gQSBjb2RlIHRoYXQgY29ycmVzcG9uZHMgdG8gc3BlY2lmaWMgZXJyb3JzLlxuICAgKi9cbiAgdGhpcy5jb2RlID0gb3B0aW9ucy5jb2RlO1xuXG4gIC8qKlxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKiBAZGVzY3JpcHRpb24gQSBzaG9ydCBkZXNjcmlwdGlvbiBvZiB0aGUgZXJyb3IuXG4gICAqL1xuICB0aGlzLm1lc3NhZ2UgPSBvcHRpb25zLm1lc3NhZ2U7XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtTZWFtbGVzc3BheUVycm9yLnR5cGVzfVxuICAgKiBAZGVzY3JpcHRpb24gVGhlIHR5cGUgb2YgZXJyb3IuXG4gICAqL1xuICB0aGlzLnR5cGUgPSBvcHRpb25zLnR5cGU7XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtvYmplY3Q9fVxuICAgKiBAZGVzY3JpcHRpb24gQWRkaXRpb25hbCBpbmZvcm1hdGlvbiBhYm91dCB0aGUgZXJyb3IsIHN1Y2ggYXMgYW4gdW5kZXJseWluZyBuZXR3b3JrIGVycm9yIHJlc3BvbnNlLlxuICAgKi9cbiAgdGhpcy5kZXRhaWxzID0gb3B0aW9ucy5kZXRhaWxzO1xufVxuXG5TZWFtbGVzc3BheUVycm9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlKTtcblNlYW1sZXNzcGF5RXJyb3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gU2VhbWxlc3NwYXlFcnJvcjtcblxuLyoqXG4gKiBFbnVtIGZvciB7QGxpbmsgU2VhbWxlc3NwYXlFcnJvcn0gdHlwZXMuXG4gKiBAbmFtZSBTZWFtbGVzc3BheUVycm9yLnR5cGVzXG4gKiBAZW51bVxuICogQHJlYWRvbmx5XG4gKiBAbWVtYmVyb2YgU2VhbWxlc3NwYXlFcnJvclxuICogQHByb3BlcnR5IHtzdHJpbmd9IENVU1RPTUVSIEFuIGVycm9yIGNhdXNlZCBieSB0aGUgY3VzdG9tZXIuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gTUVSQ0hBTlQgQW4gZXJyb3IgdGhhdCBpcyBhY3Rpb25hYmxlIGJ5IHRoZSBtZXJjaGFudC5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBORVRXT1JLIEFuIGVycm9yIGR1ZSB0byBhIG5ldHdvcmsgcHJvYmxlbS5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBJTlRFUk5BTCBBbiBlcnJvciBjYXVzZWQgYnkgU2VhbWxlc3NwYXkgY29kZS5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBVTktOT1dOIEFuIGVycm9yIHdoZXJlIHRoZSBvcmlnaW4gaXMgdW5rbm93bi5cbiAqL1xuU2VhbWxlc3NwYXlFcnJvci50eXBlcyA9IGVudW1lcmF0ZShbXG4gICdDVVNUT01FUicsXG4gICdNRVJDSEFOVCcsXG4gICdORVRXT1JLJyxcbiAgJ0lOVEVSTkFMJyxcbiAgJ1VOS05PV04nXG5dKTtcblxubW9kdWxlLmV4cG9ydHMgPSBTZWFtbGVzc3BheUVycm9yO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgU2VhbWxlc3NwYXlFcnJvciA9IHJlcXVpcmUoJy4vc2VhbWxlc3NwYXktZXJyb3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIElOVkFMSURfVVNFX09GX0lOVEVSTkFMX0ZVTkNUSU9OOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5JTlRFUk5BTCxcbiAgICBjb2RlOiAnSU5WQUxJRF9VU0VfT0ZfSU5URVJOQUxfRlVOQ1RJT04nXG4gIH0sXG4gIENBTExCQUNLX1JFUVVJUkVEOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnQ0FMTEJBQ0tfUkVRVUlSRUQnXG4gIH0sXG4gIElOU1RBTlRJQVRJT05fT1BUSU9OX1JFUVVJUkVEOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnSU5TVEFOVElBVElPTl9PUFRJT05fUkVRVUlSRUQnXG4gIH0sXG4gIElOVkFMSURfT1BUSU9OOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnSU5WQUxJRF9PUFRJT04nXG4gIH0sXG4gIElOQ09NUEFUSUJMRV9WRVJTSU9OUzoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTUVSQ0hBTlQsXG4gICAgY29kZTogJ0lOQ09NUEFUSUJMRV9WRVJTSU9OUydcbiAgfSxcbiAgSU5DT01QQVRJQkxFX0ZJRUxEU19TRVQ6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLk1FUkNIQU5ULFxuICAgIGNvZGU6ICdJTkNPTVBBVElCTEVfRklFTERTX1NFVCdcbiAgfSxcbiAgTUVUSE9EX0NBTExFRF9BRlRFUl9URUFSRE9XTjoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTUVSQ0hBTlQsXG4gICAgY29kZTogJ01FVEhPRF9DQUxMRURfQUZURVJfVEVBUkRPV04nXG4gIH0sXG4gIFNFQU1MRVNTUEFZX0FQSV9BQ0NFU1NfUkVTVFJJQ1RFRDoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTUVSQ0hBTlQsXG4gICAgY29kZTogJ1NFQU1MRVNTUEFZX0FQSV9BQ0NFU1NfUkVTVFJJQ1RFRCcsXG4gICAgbWVzc2FnZTogJ1lvdXIgYWNjZXNzIGlzIHJlc3RyaWN0ZWQgYW5kIGNhbm5vdCB1c2UgdGhpcyBwYXJ0IG9mIHRoZSBTZWFtbGVzc3BheSBBUEkuJ1xuICB9LFxuICBTRUFNTEVTU1BBWV9QQVlQQUxfTk9UX0xPQURFRDoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuSU5URVJOQUwsXG4gICAgY29kZTogJ1NFQU1MRVNTUEFZX1BBWVBBTF9OT1RfTE9BREVEJyxcbiAgICBtZXNzYWdlOiAnUGF5cGFsIFNESyBjb3VsZCBub3QgYmUgbG9hZGVkLidcbiAgfSxcbiAgSU5WQUxJRF9MQVRJTjFfU1RSSU5HOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5JTlRFUk5BTCxcbiAgICBjb2RlOiAnSU5WQUxJRF9MQVRJTjFfU1RSSU5HJ1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgUHJvbWlzZSA9IGdsb2JhbC5Qcm9taXNlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByb21pc2U7XG4iLCIndXNlIHN0cmljdCc7XG4vKipcbiAqIEBtb2R1bGUgc2VhbWxlc3NwYXktd2ViL3BheXBhbC1jaGVja291dFxuICogQGRlc2NyaXB0aW9uIEEgY29tcG9uZW50IHRvIGludGVncmF0ZSB3aXRoIHRoZSBbUGF5UGFsIENoZWNrb3V0LmpzIGxpYnJhcnldKGh0dHBzOi8vZ2l0aHViLmNvbS9wYXlwYWwvcGF5cGFsLWNoZWNrb3V0KS5cbiAqL1xuXG52YXIgYmFzaWNDb21wb25lbnRWZXJpZmljYXRpb24gPSByZXF1aXJlKCcuLi9saWIvYmFzaWMtY29tcG9uZW50LXZlcmlmaWNhdGlvbicpO1xudmFyIHdyYXBQcm9taXNlID0gcmVxdWlyZSgnQGJyYWludHJlZS93cmFwLXByb21pc2UnKTtcbnZhciBQYXlQYWxDaGVja291dCA9IHJlcXVpcmUoJy4vcGF5cGFsLWNoZWNrb3V0Jyk7XG5cbnZhciBWRVJTSU9OID0gXCJ3ZWItc2RrXCI7XG5cbi8qKlxuICogQHN0YXRpY1xuICogQGZ1bmN0aW9uIGNyZWF0ZVxuICogQGRlc2NyaXB0aW9uIFRoZXJlIGFyZSB0d28gd2F5cyB0byBpbnRlZ3JhdGUgdGhlIFBheVBhbCBDaGVja291dCBjb21wb25lbnQuIFNlZSB0aGUgW1BheVBhbCBDaGVja291dCBjb25zdHJ1Y3RvciBkb2N1bWVudGF0aW9uXShQYXlQYWxDaGVja291dC5odG1sI1BheVBhbENoZWNrb3V0KSBmb3IgbW9yZSBpbmZvcm1hdGlvbiBhbmQgZXhhbXBsZXMuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgQ3JlYXRpb24gb3B0aW9uczpcbiAqIEBwYXJhbSB7Q2xpZW50fSBbb3B0aW9ucy5jbGllbnRdIEEge0BsaW5rIENsaWVudH0gaW5zdGFuY2UuXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuYXV0aG9yaXphdGlvbl0gQSB0b2tlbml6YXRpb25LZXkgb3IgY2xpZW50VG9rZW4uIENhbiBiZSB1c2VkIGluIHBsYWNlIG9mIGBvcHRpb25zLmNsaWVudGAuXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMubWVyY2hhbnRBY2NvdW50SWRdIEEgbm9uLWRlZmF1bHQgbWVyY2hhbnQgYWNjb3VudCBJRCB0byB1c2UgZm9yIHRva2VuaXphdGlvbi5cbiAqIEBwYXJhbSB7Y2FsbGJhY2t9IFtjYWxsYmFja10gVGhlIHNlY29uZCBhcmd1bWVudCwgYGRhdGFgLCBpcyB0aGUge0BsaW5rIFBheVBhbENoZWNrb3V0fSBpbnN0YW5jZS5cbiAqIEBleGFtcGxlXG4gKiBzZWFtbGVzc3BheS5jbGllbnQuY3JlYXRlKHtcbiAqICAgYXV0aG9yaXphdGlvbjogJ2F1dGhvcml6YXRpb24nXG4gKiB9KS50aGVuKGZ1bmN0aW9uIChjbGllbnRJbnN0YW5jZSkge1xuICogICByZXR1cm4gc2VhbWxlc3NwYXkucGF5cGFsQ2hlY2tvdXQuY3JlYXRlKHtcbiAqICAgICBjbGllbnQ6IGNsaWVudEluc3RhbmNlXG4gKiAgIH0pO1xuICogfSkudGhlbihmdW5jdGlvbiAocGF5cGFsQ2hlY2tvdXRJbnN0YW5jZSkge1xuICogICAvLyBzZXQgdXAgY2hlY2tvdXQuanNcbiAqIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAqICAgY29uc29sZS5lcnJvcignRXJyb3IhJywgZXJyKTtcbiAqIH0pO1xuICogQHJldHVybnMge1Byb21pc2V8dm9pZH0gUmV0dXJucyBhIHByb21pc2UgaWYgbm8gY2FsbGJhY2sgaXMgcHJvdmlkZWQuXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZShvcHRpb25zKSB7XG5cbiAgcmV0dXJuIGJhc2ljQ29tcG9uZW50VmVyaWZpY2F0aW9uLnZlcmlmeSh7XG4gICAgbmFtZTogJ1BheVBhbCBDaGVja291dCcsXG4gICAgY2xpZW50OiBvcHRpb25zLmNsaWVudCxcbiAgICBhdXRob3JpemF0aW9uOiBvcHRpb25zLmF1dGhvcml6YXRpb25cbiAgfSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHBheVBhbENoZWNrb3V0Q29tcG9uZW50ID0gbmV3IFBheVBhbENoZWNrb3V0KG9wdGlvbnMpO1xuXG4gICAgcmV0dXJuIHBheVBhbENoZWNrb3V0Q29tcG9uZW50LmluaXRpYWxpemUoKTtcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBjcmVhdGU6IHdyYXBQcm9taXNlKGNyZWF0ZSksXG4gIFZFUlNJT046IFZFUlNJT05cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBWRVJTSU9OID0gXCJ3ZWItc2RrXCI7XG52YXIgc2hhcmVkRXJyb3JzID0gcmVxdWlyZSgnLi4vbGliL2Vycm9ycycpO1xudmFyIFByb21pc2UgPSByZXF1aXJlKCcuLi9saWIvcHJvbWlzZScpO1xudmFyIHdyYXBQcm9taXNlID0gcmVxdWlyZSgnQGJyYWludHJlZS93cmFwLXByb21pc2UnKTtcbnZhciBTZWFtbGVzc3BheUVycm9yID0gcmVxdWlyZSgnLi4vbGliL2Vycm9yJyk7XG52YXIgYXNzaWduID0gcmVxdWlyZSgnLi4vbGliL2Fzc2lnbicpLmFzc2lnbjtcblxuLyoqXG4gKlxuICogIyMjIyBJbnRlZ3JhdGUgQ2hlY2tvdXQgRmxvdyB3aXRoIFBheVBhbCBTREtcbiAqXG4gKlxuICogYGBgaHRtbFxuICogPHNjcmlwdCBzcmM9XCJodHRwczovL3dlYi1zZGsuc2VhbWxlc3NwYXkuY29tL3gueC54L2pzL2luZGV4Lm1pbi5qc1wiPjwvc2NyaXB0PlxuICogPGRpdiBpZD1cInNlYW1sZXNzcGF5LXBheXBhbC1idXR0b24tY29udGFpbmVyXCI+PC9kaXY+XG4gKiBgYGBcbiAqXG4gKiBgYGBqYXZhc2NyaXB0XG4gIHNlYW1sZXNzcGF5LmNsaWVudC5jcmVhdGUoe1xuICAgIGF1dGhvcml6YXRpb246ICdwa18wMUNONEU5RzFKREVYWEYzTUNHNDcxQk1DUicsXG4gICAgdHJhbnNhY3Rpb25BcGk6IHtcbiAgICAgIGFjY2Vzc1Rva2VuOiBidG9hKCdza18wMUNONDlaN1ZEMkVRQ1c3Qk5aU0ZZWE1RWicpXG4gICAgfSxcbiAgICBlbnZpcm9ubWVudDogJ2RldmVsb3BtZW50J1xuICB9KS50aGVuKChjbGllbnQpID0+IHtcbiAgICByZXR1cm4gc2VhbWxlc3NwYXkucGF5cGFsQ2hlY2tvdXQuY3JlYXRlKHtcbiAgICAgIGNsaWVudFxuICAgIH0pXG4gIH0pLnRoZW4oKHBheXBhbENoZWNrb3V0SW5zdGFuY2UpID0+IHtcbiAgICBwYXlwYWxDaGVja291dEluc3RhbmNlLmNyZWF0ZUJ1dHRvbnMoe1xuICAgICAgY29udGFpbmVyOiBcIiNzZWFtbGVzc3BheS1wYXlwYWwtYnV0dG9uLWNvbnRhaW5lclwiLFxuICAgICAgb3JkZXI6IHtcbiAgICAgICAgXCJjYXB0dXJlXCI6IHRydWUsXG4gICAgICAgIFwiYW1vdW50XCI6IFwiMTA3Ljk1XCIsXG4gICAgICAgIFwic2hpcHBpbmdBbW91bnRcIjogXCI5Ljk1XCIsXG4gICAgICAgIFwidHlwZVwiOiBcInBheXBhbFwiLFxuICAgICAgICBcIml0ZW1zXCI6IFt7XG4gICAgICAgICAgXCJuYW1lXCI6IFwiTW9ucm93IEdyYW5pdGUgTG9uZyBTbGVldmUgVGhlcm1hbFwiLFxuICAgICAgICAgIFwicXVhbnRpdHlcIjogXCIxXCIsXG4gICAgICAgICAgXCJ1bml0Q29zdFwiOiBcIjk4XCIsXG4gICAgICAgICAgXCJkZXNjcmlwdGlvblwiOiAkKCcjY29tbWVudHMnKS52YWwoKVxuICAgICAgICB9XVxuICAgICAgfSxcbiAgICAgIC8vIEZpbmFsaXplIHRoZSB0cmFuc2FjdGlvblxuICAgICAgb25QYXltZW50Q3JlYXRlZDogKHRyYW5zYWN0aW9uKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCd0cmFuc2FjdGlvbjogJywgdHJhbnNhY3Rpb24pO1xuICAgICAgfSxcbiAgICAgIG9uU2hpcHBpbmdDaGFuZ2U6IChzaGlwcGluZ0RhdGEpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzaGlwcGluZ0RhdGE6ICcsIHNoaXBwaW5nRGF0YSk7XG4gICAgICB9LFxuICAgICAgb25FcnJvcjogKGVycikgPT4ge1xuICAgICAgICAvLyBTaG93IGFuIGVycm9yIHBhZ2UgaGVyZSwgd2hlbiBhbiBlcnJvciBvY2N1cnNcbiAgICAgIH0sXG4gICAgICBvbk9yZGVyRXJyb3I6IChlcnIpID0+IHtcbiAgICAgICAgLy8gU2hvdyBhbiBlcnJvciBvcmRlciBoZXJlLFxuICAgICAgfSxcbiAgICAgIG9uUGF5bWVudEVycm9yOiAoZXJyKSA9PiB7XG4gICAgICAgIC8vIFNob3cgYW4gZXJyb3IgcGF5bWVudCBoZXJlLFxuICAgICAgfSxcbiAgICB9KVxuICB9KVxuICogYGBgXG4qKi9cblxudmFyIGRlZmF1bHRTdHlsZSA9IHtcbiAgbGF5b3V0OiAgJ2hvcml6b250YWwnLFxuICBmdW5kaW5naWNvbnM6IGZhbHNlLFxuICBjb2xvcjogICAnYmxhY2snLFxuICBzaGFwZTogICAncmVjdCcsXG4gIGxhYmVsOiAgICdjaGVja291dCcsXG4gIHRhZ2xpbmU6IGZhbHNlLFxuICBzaXplOiAncmVzcG9uc2l2ZSdcbn07XG5cbmZ1bmN0aW9uIGNyZWF0ZU9yZGVyKGNsaWVudCwgZGF0YSkge1xuICByZXR1cm4gY2xpZW50LnJlcXVlc3Qoe1xuICAgIGFwaTogJ3NlYW1sZXNzcGF5QXBpJyxcbiAgICBlbmRwb2ludDogJ29yZGVycycsXG4gICAgbWV0aG9kOiAncG9zdCcsXG4gICAgZGF0YTogZGF0YVxuICB9KS50aGVuKGZ1bmN0aW9uKG9yZGVyKSB7XG4gICAgZGF0YS5pZCA9IG9yZGVyLmlkO1xuXG4gICAgcmV0dXJuIG9yZGVyLnByb2Nlc3Nvck9yZGVySWRcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZU9yZGVyKGNsaWVudCwgZGF0YSkge1xuICByZXR1cm4gY2xpZW50LnJlcXVlc3Qoe1xuICAgIGFwaTogJ3NlYW1sZXNzcGF5QXBpJyxcbiAgICBlbmRwb2ludDogJ29yZGVycy8nICsgZGF0YS5pZCxcbiAgICBtZXRob2Q6ICdwdXQnLFxuICAgIGRhdGE6IGRhdGFcbiAgfSlcbn1cblxuZnVuY3Rpb24gY3JlYXRlUGF5bWVudChjbGllbnQsIGRhdGEpIHtcbiAgcmV0dXJuIGNsaWVudC5yZXF1ZXN0KHtcbiAgICBhcGk6ICdzZWFtbGVzc3BheUFwaScsXG4gICAgZW5kcG9pbnQ6ICdwYXlwYWwtdHJhbnNhY3Rpb25zL2NoYXJnZScsXG4gICAgbWV0aG9kOiAncG9zdCcsXG4gICAgZGF0YToge1xuICAgICAgcHJvY2Vzc29yT3JkZXJJZDogZGF0YS5vcmRlcklEXG4gICAgfVxuICB9KTtcbn1cblxuZnVuY3Rpb24gUGF5UGFsQ2hlY2tvdXQob3B0aW9ucykge1xuICB2YXIgY2xpZW50VmVyc2lvbiwgY2xpZW50Q29uZmlnO1xuXG4gIGlmICghb3B0aW9ucy5jbGllbnQpIHtcbiAgICB0aHJvdyBuZXcgU2VhbWxlc3NwYXlFcnJvcih7XG4gICAgICB0eXBlOiBzaGFyZWRFcnJvcnMuSU5TVEFOVElBVElPTl9PUFRJT05fUkVRVUlSRUQudHlwZSxcbiAgICAgIGNvZGU6IHNoYXJlZEVycm9ycy5JTlNUQU5USUFUSU9OX09QVElPTl9SRVFVSVJFRC5jb2RlLFxuICAgICAgbWVzc2FnZTogJ29wdGlvbnMuY2xpZW50IGlzIHJlcXVpcmVkIHdoZW4gaW5zdGFudGlhdGluZyBQYXlwYWwgQ2hlY2tvdXQuJ1xuICAgIH0pO1xuICB9XG5cbiAgY2xpZW50Q29uZmlnID0gb3B0aW9ucy5jbGllbnQuZ2V0Q29uZmlndXJhdGlvbigpO1xuICBjbGllbnRWZXJzaW9uID0gY2xpZW50Q29uZmlnLmFuYWx5dGljc01ldGFkYXRhLnNka1ZlcnNpb247XG4gIGlmIChjbGllbnRWZXJzaW9uICE9PSBWRVJTSU9OKSB7XG4gICAgdGhyb3cgbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgdHlwZTogc2hhcmVkRXJyb3JzLklOQ09NUEFUSUJMRV9WRVJTSU9OUy50eXBlLFxuICAgICAgY29kZTogc2hhcmVkRXJyb3JzLklOQ09NUEFUSUJMRV9WRVJTSU9OUy5jb2RlLFxuICAgICAgbWVzc2FnZTogJ0NsaWVudCAodmVyc2lvbiAnICsgY2xpZW50VmVyc2lvbiArICcpIGFuZCBQYXlwYWwgQ2hlY2tvdXQgKHZlcnNpb24gJyArIFZFUlNJT04gKyAnKSBjb21wb25lbnRzIG11c3QgYmUgZnJvbSB0aGUgc2FtZSBTREsgdmVyc2lvbi4nXG4gICAgfSk7XG4gIH1cblxuICB0aGlzLl9jbGllbnQgPSBvcHRpb25zLmNsaWVudDtcbn1cblxuUGF5UGFsQ2hlY2tvdXQucHJvdG90eXBlLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBQYXlQYWxDaGVja291dEluc2FuY2UgPSB0aGlzO1xuICB2YXIgY2xpZW50Q29uZmlnID0gUGF5UGFsQ2hlY2tvdXRJbnNhbmNlLl9jbGllbnQuZ2V0Q29uZmlndXJhdGlvbigpO1xuICB2YXIgbWVyY2hhbnRJZCA9ICgoY2xpZW50Q29uZmlnLmdhdGV3YXlDb25maWd1cmF0aW9uLm1lcmNoYW50LnNldHRpbmdzLnByb2Nlc3NvcnMgfHwge30pLlBBWVBBTCB8fCB7fSkuYWNjb3VudElkO1xuXG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgIHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xuICAgIHNjcmlwdC5zcmMgPSAnaHR0cHM6Ly93d3cucGF5cGFsLmNvbS9zZGsvanM/JyArXG4gICAgICAnY2xpZW50LWlkPScgKyB1bmRlZmluZWQgKyAnJicgK1xuICAgICAgJyZtZXJjaGFudC1pZD0nICsgbWVyY2hhbnRJZCArXG4gICAgICAnJmRpc2FibGUtZnVuZGluZz1jcmVkaXQnXG4gICAgO1xuICAgIHNjcmlwdC5zZXRBdHRyaWJ1dGUoJ2RhdGEtcGFydG5lci1hdHRyaWJ1dGlvbi1pZCcsICdTZWFtbGVzc3BheV9TUCcpO1xuICAgIHNjcmlwdC5hc3luYyA9IHRydWU7XG5cbiAgICBzY3JpcHQub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhyb3cgbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgICB0eXBlOiBzaGFyZWRFcnJvcnMuU0VBTUxFU1NQQVlfUEFZUEFMX05PVF9MT0FERUQudHlwZSxcbiAgICAgICAgY29kZTogc2hhcmVkRXJyb3JzLlNFQU1MRVNTUEFZX1BBWVBBTF9OT1RfTE9BREVELmNvZGUsXG4gICAgICAgIG1lc3NhZ2U6IHNoYXJlZEVycm9ycy5TRUFNTEVTU1BBWV9QQVlQQUxfTk9UX0xPQURFRC5tZXNzYWdlXG4gICAgICB9KTtcbiAgICB9O1xuICAgIHNjcmlwdC5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gcmVzb2x2ZShQYXlQYWxDaGVja291dEluc2FuY2UpO1xuICAgIH07XG5cbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdCk7XG4gIH0pO1xufTtcblxuUGF5UGFsQ2hlY2tvdXQucHJvdG90eXBlLmNyZWF0ZUJ1dHRvbnMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICBpZiAoIW9wdGlvbnMpIHtcbiAgICB0aHJvdyBuZXcgU2VhbWxlc3NwYXlFcnJvcih7XG4gICAgICB0eXBlOiBzaGFyZWRFcnJvcnMuSU5TVEFOVElBVElPTl9PUFRJT05fUkVRVUlSRUQudHlwZSxcbiAgICAgIGNvZGU6IHNoYXJlZEVycm9ycy5JTlNUQU5USUFUSU9OX09QVElPTl9SRVFVSVJFRC5jb2RlLFxuICAgICAgbWVzc2FnZTogJ29wdGlvbnMgaXMgcmVxdWlyZWQgd2hlbiBpbnN0YW50aWF0aW5nIGJ1dHRvbnMuJ1xuICAgIH0pO1xuICB9XG5cbiAgaWYgKCFvcHRpb25zLm9yZGVyKSB7XG4gICAgdGhyb3cgbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgdHlwZTogc2hhcmVkRXJyb3JzLklOU1RBTlRJQVRJT05fT1BUSU9OX1JFUVVJUkVELnR5cGUsXG4gICAgICBjb2RlOiBzaGFyZWRFcnJvcnMuSU5TVEFOVElBVElPTl9PUFRJT05fUkVRVUlSRUQuY29kZSxcbiAgICAgIG1lc3NhZ2U6ICdvcHRpb25zLm9yZGVyIGlzIHJlcXVpcmVkIHdoZW4gaW5zdGFudGlhdGluZyBidXR0b25zLidcbiAgICB9KTtcbiAgfVxuXG4gIHZhciBjbGllbnQgPSB0aGlzLl9jbGllbnQ7XG5cbiAgdmFyIGNvbnRhaW5lciA9IG9wdGlvbnMuY29udGFpbmVyIHx8ICcjc2VhbWxlc3NwYXktcGF5cGFsLWJ1dHRvbi1jb250YWluZXInO1xuICB2YXIgc3R5bGUgPSBvcHRpb25zLnN0eWxlIHx8IHt9O1xuICB2YXIgb3JkZXIgPSBvcHRpb25zLm9yZGVyO1xuICB2YXIgb25TaGlwcGluZ0NoYW5nZSA9IG9wdGlvbnMub25TaGlwcGluZ0NoYW5nZTtcbiAgdmFyIG9uT3JkZXJFcnJvciA9IG9wdGlvbnMub25PcmRlckVycm9yO1xuICB2YXIgb25QYXltZW50RXJyb3IgPSBvcHRpb25zLm9uUGF5bWVudEVycm9yO1xuICB2YXIgb25QYXltZW50Q3JlYXRlZCA9IG9wdGlvbnMub25QYXltZW50Q3JlYXRlZDtcbiAgdmFyIG9uUGF5bWVudFByb2Nlc3MgPSBvcHRpb25zLm9uUGF5bWVudFByb2Nlc3M7XG4gIHZhciBvbkVycm9yID0gb3B0aW9ucy5vbkVycm9yO1xuXG4gIHdpbmRvdy5wYXlwYWwuQnV0dG9ucyh7XG4gICAgc3R5bGU6IGFzc2lnbihkZWZhdWx0U3R5bGUsIHN0eWxlKSxcbiAgICAvLyBTZXQgdXAgdGhlIHRyYW5zYWN0aW9uXG4gICAgY3JlYXRlT3JkZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNyZWF0ZU9yZGVyKGNsaWVudCwgb3JkZXIpXG4gICAgICAgIC5jYXRjaChmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICBpZiAodHlwZW9mIG9uT3JkZXJFcnJvciA9PT0gJ2Z1bmN0aW9uJykgb25PcmRlckVycm9yKGVycilcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICAvLyBGaW5hbGl6ZSB0aGUgdHJhbnNhY3Rpb25cbiAgICBvbkFwcHJvdmU6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIGlmICh0eXBlb2Ygb25QYXltZW50UHJvY2VzcyA9PT0gJ2Z1bmN0aW9uJykgb25QYXltZW50UHJvY2VzcygpO1xuICAgICAgcmV0dXJuIGNyZWF0ZVBheW1lbnQoY2xpZW50LCBkYXRhKVxuICAgICAgICAudGhlbihmdW5jdGlvbih0cmFuc2FjdGlvbikge1xuICAgICAgICAgIGlmICh0eXBlb2Ygb25QYXltZW50Q3JlYXRlZCA9PT0gJ2Z1bmN0aW9uJykgb25QYXltZW50Q3JlYXRlZCh0cmFuc2FjdGlvbik7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICBpZiAodHlwZW9mIG9uUGF5bWVudEVycm9yID09PSAnZnVuY3Rpb24nKSBvblBheW1lbnRFcnJvcihlcnIpO1xuICAgICAgICB9KVxuICAgIH0sXG4gICAgb25TaGlwcGluZ0NoYW5nZTogZnVuY3Rpb24oZGF0YSwgYWN0aW9ucykge1xuICAgICAgdmFyIHNoaXBwaW5nQWRkcmVzcyA9IChkYXRhIHx8IHt9KS5zaGlwcGluZ19hZGRyZXNzIHx8IHt9O1xuICAgICAgdmFyIG1hcHBlZEZpZWxkcyA9IHtcbiAgICAgICAgY291bnRyeUNvZGU6ICdjb3VudHJ5X2NvZGUnLFxuICAgICAgICBzdGF0ZTogJ3N0YXRlJyxcbiAgICAgICAgY2l0eTogJ2NpdHknLFxuICAgICAgICBzaGlwVG9aaXA6ICdwb3N0YWxfY29kZSdcbiAgICAgIH07XG5cbiAgICAgIGlmICh0eXBlb2Ygb25TaGlwcGluZ0NoYW5nZSAhPT0gJ2Z1bmN0aW9uJykgcmV0dXJuIGFjdGlvbnMucmVzb2x2ZSgpO1xuXG4gICAgICB2YXIgbWFwcGVkVmFsdWVzID0gT2JqZWN0LmtleXMobWFwcGVkRmllbGRzKVxuICAgICAgICAucmVkdWNlKGZ1bmN0aW9uIChyZXN1bHQsIGZpZWxkKSB7XG4gICAgICAgICAgdmFyIG5leHRWYWx1ZSA9IHt9O1xuICAgICAgICAgIG5leHRWYWx1ZVtmaWVsZF0gPSBzaGlwcGluZ0FkZHJlc3NbbWFwcGVkRmllbGRzW2ZpZWxkXV07XG5cbiAgICAgICAgICByZXR1cm4gYXNzaWduKHJlc3VsdCwgbmV4dFZhbHVlKTtcbiAgICAgICAgfSwge30pO1xuICAgICAgdmFyIHJlcyA9IG9uU2hpcHBpbmdDaGFuZ2UobWFwcGVkVmFsdWVzKTtcblxuICAgICAgaWYgKHR5cGVvZiByZXMgPT09ICdvYmplY3QnICYmIHR5cGVvZiByZXMudGhlbiAhPT0gJ2Z1bmN0aW9uJyApXG4gICAgICAgIHJldHVybiB1cGRhdGVPcmRlcihjbGllbnQsIGFzc2lnbihvcmRlciwgcmVzIHx8IHt9KSlcbiAgICAgICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb25zLnJlc29sdmUoKTtcbiAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb25zLnJlamVjdCgpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICBpZiAodHlwZW9mIHJlcyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIHJlcy50aGVuID09PSAnZnVuY3Rpb24nIClcbiAgICAgICAgcmV0dXJuIHJlc1xuICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKG5leHRPcmRlcikge1xuICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZU9yZGVyKGNsaWVudCwgYXNzaWduKG9yZGVyLCBuZXh0T3JkZXIgfHwge30pKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbnMucmVzb2x2ZSgpO1xuICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbnMucmVqZWN0KCk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBhY3Rpb25zLnJlc29sdmUoKTtcbiAgICB9LFxuICAgIG9uRXJyb3I6IGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIGlmICh0eXBlb2Ygb25FcnJvciA9PT0gJ2Z1bmN0aW9uJykgb25FcnJvcihlcnIpO1xuICAgIH1cbiAgfSlcbiAgICAucmVuZGVyKGNvbnRhaW5lcik7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHdyYXBQcm9taXNlLndyYXBQcm90b3R5cGUoUGF5UGFsQ2hlY2tvdXQpO1xuIl19
