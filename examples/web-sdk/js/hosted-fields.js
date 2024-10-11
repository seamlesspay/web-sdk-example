(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.seamlesspay || (g.seamlesspay = {})).hostedFields = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(_dereq_,module,exports){
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
'use strict';

var types = _dereq_('./lib/card-types');
var clone = _dereq_('./lib/clone');
var findBestMatch = _dereq_('./lib/find-best-match');
var isValidInputType = _dereq_('./lib/is-valid-input-type');
var addMatchingCardsToResults = _dereq_('./lib/add-matching-cards-to-results');

var testOrder;
var customCards = {};

var cardNames = {
  VISA: 'visa',
  MASTERCARD: 'mastercard',
  AMERICAN_EXPRESS: 'american-express',
  DINERS_CLUB: 'diners-club',
  DISCOVER: 'discover',
  JCB: 'jcb',
  UNIONPAY: 'unionpay',
  MAESTRO: 'maestro',
  ELO: 'elo',
  MIR: 'mir',
  HIPER: 'hiper',
  HIPERCARD: 'hipercard'
};

var ORIGINAL_TEST_ORDER = [
  cardNames.VISA,
  cardNames.MASTERCARD,
  cardNames.AMERICAN_EXPRESS,
  cardNames.DINERS_CLUB,
  cardNames.DISCOVER,
  cardNames.JCB,
  cardNames.UNIONPAY,
  cardNames.MAESTRO,
  cardNames.ELO,
  cardNames.MIR,
  cardNames.HIPER,
  cardNames.HIPERCARD
];

testOrder = clone(ORIGINAL_TEST_ORDER);

function findType(type) {
  return customCards[type] || types[type];
}

function getAllCardTypes() {
  return testOrder.map(function (type) {
    return clone(findType(type));
  });
}

function getCardPosition(name, ignoreErrorForNotExisting) {
  var position = testOrder.indexOf(name);

  if (!ignoreErrorForNotExisting && position === -1) {
    throw new Error('"' + name + '" is not a supported card type.');
  }

  return position;
}

function creditCardType(cardNumber) {
  var bestMatch;
  var results = [];

  if (!isValidInputType(cardNumber)) {
    return [];
  }

  if (cardNumber.length === 0) {
    return getAllCardTypes(testOrder);
  }

  testOrder.forEach(function (type) {
    var cardConfiguration = findType(type);

    addMatchingCardsToResults(cardNumber, cardConfiguration, results);
  });

  bestMatch = findBestMatch(results);

  if (bestMatch) {
    return [bestMatch];
  }

  return results;
}

creditCardType.getTypeInfo = function (type) {
  return clone(findType(type));
};

creditCardType.removeCard = function (name) {
  var position = getCardPosition(name);

  testOrder.splice(position, 1);
};

creditCardType.addCard = function (config) {
  var existingCardPosition = getCardPosition(config.type, true);

  customCards[config.type] = config;

  if (existingCardPosition === -1) {
    testOrder.push(config.type);
  }
};

creditCardType.updateCard = function (cardType, updates) {
  var clonedCard;
  var originalObject = customCards[cardType] || types[cardType];

  if (!originalObject) {
    throw new Error('"' + cardType + '" is not a recognized type. Use `addCard` instead.');
  }

  if (updates.type && originalObject.type !== updates.type) {
    throw new Error('Cannot overwrite type parameter.');
  }

  clonedCard = clone(originalObject, true);

  Object.keys(clonedCard).forEach(function (key) {
    if (updates[key]) {
      clonedCard[key] = updates[key];
    }
  });

  customCards[clonedCard.type] = clonedCard;
};

creditCardType.changeOrder = function (name, position) {
  var currentPosition = getCardPosition(name);

  testOrder.splice(currentPosition, 1);
  testOrder.splice(position, 0, name);
};

creditCardType.resetModifications = function () {
  testOrder = clone(ORIGINAL_TEST_ORDER);
  customCards = {};
};

creditCardType.types = cardNames;

module.exports = creditCardType;

},{"./lib/add-matching-cards-to-results":10,"./lib/card-types":11,"./lib/clone":12,"./lib/find-best-match":13,"./lib/is-valid-input-type":14}],10:[function(_dereq_,module,exports){
'use strict';

var clone = _dereq_('./clone');
var matches = _dereq_('./matches');

function addMatchingCardsToResults(cardNumber, cardConfiguration, results) {
  var i, pattern, patternLength, clonedCardConfiguration;

  for (i = 0; i < cardConfiguration.patterns.length; i++) {
    pattern = cardConfiguration.patterns[i];

    if (!matches(cardNumber, pattern)) {
      continue;
    }

    clonedCardConfiguration = clone(cardConfiguration);

    if (Array.isArray(pattern)) {
      patternLength = String(pattern[0]).length;
    } else {
      patternLength = String(pattern).length;
    }

    if (cardNumber.length >= patternLength) {
      clonedCardConfiguration.matchStrength = patternLength;
    }

    results.push(clonedCardConfiguration);
    break;
  }
}

module.exports = addMatchingCardsToResults;

},{"./clone":12,"./matches":15}],11:[function(_dereq_,module,exports){
'use strict';

var cardTypes = {
  visa: {
    niceType: 'Visa',
    type: 'visa',
    patterns: [
      4
    ],
    gaps: [4, 8, 12],
    lengths: [16, 18, 19],
    code: {
      name: 'CVV',
      size: 3
    }
  },
  mastercard: {
    niceType: 'Mastercard',
    type: 'mastercard',
    patterns: [
      [51, 55],
      [2221, 2229],
      [223, 229],
      [23, 26],
      [270, 271],
      2720
    ],
    gaps: [4, 8, 12],
    lengths: [16],
    code: {
      name: 'CVC',
      size: 3
    }
  },
  'american-express': {
    niceType: 'American Express',
    type: 'american-express',
    patterns: [
      34,
      37
    ],
    gaps: [4, 10],
    lengths: [15],
    code: {
      name: 'CID',
      size: 4
    }
  },
  'diners-club': {
    niceType: 'Diners Club',
    type: 'diners-club',
    patterns: [
      [300, 305],
      36,
      38,
      39
    ],
    gaps: [4, 10],
    lengths: [14, 16, 19],
    code: {
      name: 'CVV',
      size: 3
    }
  },
  discover: {
    niceType: 'Discover',
    type: 'discover',
    patterns: [
      6011,
      [644, 649],
      65
    ],
    gaps: [4, 8, 12],
    lengths: [16, 19],
    code: {
      name: 'CID',
      size: 3
    }
  },
  jcb: {
    niceType: 'JCB',
    type: 'jcb',
    patterns: [
      2131,
      1800,
      [3528, 3589]
    ],
    gaps: [4, 8, 12],
    lengths: [16, 17, 18, 19],
    code: {
      name: 'CVV',
      size: 3
    }
  },
  unionpay: {
    niceType: 'UnionPay',
    type: 'unionpay',
    patterns: [
      620,
      [624, 626],
      [62100, 62182],
      [62184, 62187],
      [62185, 62197],
      [62200, 62205],
      [622010, 622999],
      622018,
      [622019, 622999],
      [62207, 62209],
      [622126, 622925],
      [623, 626],
      6270,
      6272,
      6276,
      [627700, 627779],
      [627781, 627799],
      [6282, 6289],
      6291,
      6292,
      810,
      [8110, 8131],
      [8132, 8151],
      [8152, 8163],
      [8164, 8171]
    ],
    gaps: [4, 8, 12],
    lengths: [14, 15, 16, 17, 18, 19],
    code: {
      name: 'CVN',
      size: 3
    }
  },
  maestro: {
    niceType: 'Maestro',
    type: 'maestro',
    patterns: [
      493698,
      [500000, 506698],
      [506779, 508999],
      [56, 59],
      63,
      67,
      6
    ],
    gaps: [4, 8, 12],
    lengths: [12, 13, 14, 15, 16, 17, 18, 19],
    code: {
      name: 'CVC',
      size: 3
    }
  },
  elo: {
    niceType: 'Elo',
    type: 'elo',
    patterns: [
      401178,
      401179,
      438935,
      457631,
      457632,
      431274,
      451416,
      457393,
      504175,
      [506699, 506778],
      [509000, 509999],
      627780,
      636297,
      636368,
      [650031, 650033],
      [650035, 650051],
      [650405, 650439],
      [650485, 650538],
      [650541, 650598],
      [650700, 650718],
      [650720, 650727],
      [650901, 650978],
      [651652, 651679],
      [655000, 655019],
      [655021, 655058]
    ],
    gaps: [4, 8, 12],
    lengths: [16],
    code: {
      name: 'CVE',
      size: 3
    }
  },
  mir: {
    niceType: 'Mir',
    type: 'mir',
    patterns: [
      [2200, 2204]
    ],
    gaps: [4, 8, 12],
    lengths: [16, 17, 18, 19],
    code: {
      name: 'CVP2',
      size: 3
    }
  },
  hiper: {
    niceType: 'Hiper',
    type: 'hiper',
    patterns: [
      637095,
      637568,
      637599,
      637609,
      637612
    ],
    gaps: [4, 8, 12],
    lengths: [16],
    code: {
      name: 'CVC',
      size: 3
    }
  },
  hipercard: {
    niceType: 'Hipercard',
    type: 'hipercard',
    patterns: [
      606282
    ],
    gaps: [4, 8, 12],
    lengths: [16],
    code: {
      name: 'CVC',
      size: 3
    }
  }
};

module.exports = cardTypes;

},{}],12:[function(_dereq_,module,exports){
'use strict';

function clone(originalObject) {
  var dupe;

  if (!originalObject) { return null; }

  dupe = JSON.parse(JSON.stringify(originalObject));

  return dupe;
}

module.exports = clone;

},{}],13:[function(_dereq_,module,exports){
'use strict';

function hasEnoughResultsToDetermineBestMatch(results) {
  var numberOfResultsWithMaxStrengthProperty = results.filter(function (result) {
    return result.matchStrength;
  }).length;

  // if all possible results have a maxStrength property
  // that means the card number is sufficiently long
  // enough to determine conclusively what the type is
  return numberOfResultsWithMaxStrengthProperty > 0 &&
    numberOfResultsWithMaxStrengthProperty === results.length;
}

function findBestMatch(results) {
  if (!hasEnoughResultsToDetermineBestMatch(results)) {
    return;
  }

  return results.reduce(function (bestMatch, result) { // eslint-disable-line consistent-return
    if (!bestMatch) {
      return result;
    }

    // if the current best match pattern is less specific
    // than this result, set the result as the new best match
    if (bestMatch.matchStrength < result.matchStrength) {
      return result;
    }

    return bestMatch;
  });
}

module.exports = findBestMatch;

},{}],14:[function(_dereq_,module,exports){
'use strict';

function isValidInputType(cardNumber) {
  return typeof cardNumber === 'string' || cardNumber instanceof String;
}

module.exports = isValidInputType;

},{}],15:[function(_dereq_,module,exports){
'use strict';

// Adapted from https://github.com/polvo-labs/card-type/blob/aaab11f80fa1939bccc8f24905a06ae3cd864356/src/cardType.js#L37-L42
function matchesRange(cardNumber, min, max) {
  var maxLengthToCheck = String(min).length;
  var substr = cardNumber.substr(0, maxLengthToCheck);
  var integerRepresentationOfCardNumber = parseInt(substr, 10);

  min = parseInt(String(min).substr(0, substr.length), 10);
  max = parseInt(String(max).substr(0, substr.length), 10);

  return integerRepresentationOfCardNumber >= min && integerRepresentationOfCardNumber <= max;
}

function matchesPattern(cardNumber, pattern) {
  pattern = String(pattern);

  return pattern.substring(0, cardNumber.length) === cardNumber.substring(0, pattern.length);
}

function matches(cardNumber, pattern) {
  if (Array.isArray(pattern)) {
    return matchesRange(cardNumber, pattern[0], pattern[1]);
  }

  return matchesPattern(cardNumber, pattern);
}

module.exports = matches;

},{}],16:[function(_dereq_,module,exports){
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

},{}],17:[function(_dereq_,module,exports){
'use strict';
/* eslint-disable no-reserved-keys */

var enumerate = _dereq_('../../lib/enumerate');
var VERSION = "web-sdk";

var requestTypes = {
  REQUEST_TYPE_TOKENIZATION: 'tokenization'
};

var whitelistedFields = [
  {
    field: 'accountNumber',
    name: 'account-number',
    label: 'Card Number',
    defaultMaxLength: 22,
    wrapper: {
      dataMax: '4242 4242 4242 4242 4240',
      style: {
        transform: 'translateX(0px)'
      }
    }
  },
  {
    field: 'expDate',
    name: 'exp-date',
    label: 'Expiration Date',
    defaultMaxLength: 7,
    wrapper: {
      dataMax: 'MM / YY0',
      style: {
        transform: 'translateX(0px)'
      }
    }
  },
  {
    field: 'cvv',
    name: 'cvv',
    label: 'CVV',
    defaultMaxLength: 4,
    wrapper: {
      dataMax: '00000',
      style: {
        transform: 'translateX(0px)'
      }
    }
  },
  {
    field: 'postalCode',
    name: 'postal-code',
    label: 'Postal Code',
    defaultMaxLength: 5,
    wrapper: {
      dataMax: '902100',
      style: {
        transform: 'translateX(0px)'
      }
    }
  }
];

var cardBrandMap = {
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

var constants = {
  VERSION: VERSION,
  PAYMENT_TYPE_CREDIT_CARD: 'credit_card',
  maxExpirationYearAge: 31,
  externalEvents: {
    CHANGE: 'change',
    FOCUS: 'focus',
    BLUR: 'blur',
    EMPTY: 'empty',
    NOT_EMPTY: 'notEmpty',
    VALIDITY_CHANGE: 'validityChange',
    CARD_TYPE_CHANGE: 'cardTypeChange'
  },
  externalClasses: {
    FOCUSED: 'seamlesspay-card-element-focused',
    INVALID: 'seamlesspay-card-element-invalid',
    VALID: 'seamlesspay-card-element-valid'
  },
  defaultIFrameStyle: {
    'border': ['none', 'important'],
    'margin': ['0px', 'important'],
    'padding': ['0px', 'important'],
    'width': ['1px', 'important'],
    'min-width': ['100%', 'important'],
    'overflow': ['hidden', 'important'],
    'display': ['block', 'important'],
    'user-select': ['none', 'important'],
    'height': ['19.2px']
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
  cardBrandMap: cardBrandMap,
  tokenizerNonSecureFields: tokenizerNonSecureFields,
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
    'postal-code': 'billing postal-code'
  },
  requestTypes: requestTypes
};

constants.events = enumerate([
  'AUTOFILL_EXPIRATION_DATE',
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
  'CLEAR_FIELD',
], 'card-element:');

module.exports = constants;

},{"../../lib/enumerate":37}],18:[function(_dereq_,module,exports){
'use strict';

var SeamlesspayError = _dereq_('../../lib/seamlesspay-error');
var errors = _dereq_('../shared/errors');
var whitelist = _dereq_('../shared/constants').whitelistedAttributes;

function attributeValidationError(attribute, value) {
  var err;

  if (!whitelist.hasOwnProperty(attribute)) {
    err = new SeamlesspayError({
      type: errors.HOSTED_FIELDS_ATTRIBUTE_NOT_SUPPORTED.type,
      code: errors.HOSTED_FIELDS_ATTRIBUTE_NOT_SUPPORTED.code,
      message: 'The "' + attribute + '" attribute is not supported in Hosted Fields.'
    });
  } else if (value != null && !_isValid(attribute, value)) {
    err = new SeamlesspayError({
      type: errors.HOSTED_FIELDS_ATTRIBUTE_VALUE_NOT_ALLOWED.type,
      code: errors.HOSTED_FIELDS_ATTRIBUTE_VALUE_NOT_ALLOWED.code,
      message: 'Value "' + value + '" is not allowed for "' + attribute + '" attribute.'
    });
  }

  return err;
}

function _isValid(attribute, value) {
  if (whitelist[attribute] === 'string') {
    return typeof value === 'string' || typeof value === 'number';
  } else if (whitelist[attribute] === 'boolean') {
    return String(value) === 'true' || String(value) === 'false';
  }

  return false;
}

module.exports = attributeValidationError;

},{"../../lib/seamlesspay-error":46,"../shared/constants":24,"../shared/errors":25}],19:[function(_dereq_,module,exports){
var SeamlesspayError = _dereq_('../../lib/seamlesspay-error');
var sharedErrors = _dereq_('../../lib/errors');
var requestTypes = _dereq_('../shared/constants').requestTypes;
var relations = _dereq_('../shared/payment-fields-relations');

var TOKENIZATION = requestTypes.REQUEST_TYPE_TOKENIZATION;

var typeFieldRelations = relations[TOKENIZATION];

module.exports = function (type, fields) {
  var isRequiredExcess = true;
  var isRequiredValid = false;
  var requiredSets = {};
  var validSetsCount = {};
  var isComplete = fields.every(function (field) {
    return !!~typeFieldRelations[type].fields.indexOf(field);
  });

  if (!isComplete) {
    throw new SeamlesspayError({
      type: sharedErrors.INCOMPATIBLE_FIELDS_SET.type,
      code: sharedErrors.INCOMPATIBLE_FIELDS_SET.code,
      message: 'Fields integrity is broken for payment type "'
      + type + '"! You can use only next fields: '
      + typeFieldRelations[type].fields.join(', ')
    });
  }

  typeFieldRelations[type].oneOf.forEach(function (rule) {
    var setKey = rule.required.sort().join(', ');
    requiredSets[setKey] = rule.required.length;
    var validCount = rule.required.reduce(function(result, requiredField) {
      return ~fields.indexOf(requiredField) ? result + 1 : result;
    }, 0);
    validSetsCount[setKey] = validCount;
  });

  isRequiredValid = Object.keys(validSetsCount).filter(function (setKey) {
    return validSetsCount[setKey] === requiredSets[setKey];
  }).length === 1;

  isRequiredExcess = Object.keys(validSetsCount).filter(function (setKey) {
    return validSetsCount[setKey] > 0;
  }).length > 1;

  if (!isRequiredValid || isRequiredExcess) {
    throw new SeamlesspayError({
      type: sharedErrors.INCOMPATIBLE_FIELDS_SET.type,
      code: sharedErrors.INCOMPATIBLE_FIELDS_SET.code,
      message: 'Incompatible required fields set! payment type '
      + type + ' is requiring'
      + (Object.keys(requiredSets).length > 1 ? ' one of ' : ' ') + 'field set: '
      + Object.keys(requiredSets).join(' or ')
    });
  }
};

},{"../../lib/errors":38,"../../lib/seamlesspay-error":46,"../shared/constants":24,"../shared/payment-fields-relations":27}],20:[function(_dereq_,module,exports){
'use strict';

var Destructor = _dereq_('../../lib/destructor');
var classlist = _dereq_('../../lib/classlist');
var iFramer = _dereq_('@braintree/iframer');
var Bus = _dereq_('../../lib/bus');
var SeamlesspayError = _dereq_('../../lib/seamlesspay-error');
var composeUrl = _dereq_('../../lib/compose-url');
var constants = _dereq_('../shared/constants');
var errors = _dereq_('../shared/errors');
var uuid = _dereq_('../../lib/uuid');
var findParentTags = _dereq_('../shared/find-parent-tags');
var getWhitelistedFields = _dereq_('../shared/common').getWhitelistedFields;
var isIos = _dereq_('../../lib/is-ios');
var events = constants.events;
var EventEmitter = _dereq_('../../lib/event-emitter');
var injectFrame = _dereq_('../../lib/inject-frame');
var VERSION = "web-sdk";
var methods = _dereq_('../../lib/methods');
var convertMethodsToError = _dereq_('../../lib/convert-methods-to-error');
var deferred = _dereq_('../../lib/deferred');
var sharedErrors = _dereq_('../../lib/errors');
var getCardTypes = _dereq_('credit-card-type');
var attributeValidationError = _dereq_('./attribute-validation-error');
var Promise = _dereq_('../../lib/promise');
var wrapPromise = _dereq_('@braintree/wrap-promise');
var checkIntegrity = _dereq_('./check-integrity');
var { formatTokenizeResponse } = _dereq_('./response-formatters')

/**
 * @typedef {object} HostedFields~tokenizePayload
 * @property {string} nonce The payment method nonce.
 * @property {object} details Additional account details.
 * @property {string} details.cardType Type of card, ex: Visa, MasterCard.
 * @property {string} details.lastTwo Last two digits of card number.
 * @property {string} description A human-readable description.
 * @property {string} type The payment method type, always `CreditCard`.
 */

/**
 * @typedef {object} HostedFields~stateObject
 * @description The event payload sent from {@link HostedFields#on|on} or {@link HostedFields#getState|getState}.
 * @property {HostedFields~hostedFieldsCard[]} cards
 * This will return an array of potential {@link HostedFields~hostedFieldsCard|cards}. If the card type has been determined, the array will contain only one card.
 * Internally, Hosted Fields uses <a href="https://github.com/seamlesspay/credit-card-type">credit-card-type</a>,
 * an open-source card detection library.
 * @property {string} emittedBy
 * The name of the field associated with an event. This will not be included if returned by {@link HostedFields#getState|getState}. It will be one of the following strings:<br>
 * - `"number"`
 * - `"cvv"`
 * - `"expDate"`
 * - `"expirationMonth"`
 * - `"expirationYear"`
 * - `"postalCode"`
 * @property {object} fields
 * @property {?HostedFields~hostedFieldsFieldData} fields.number {@link HostedFields~hostedFieldsFieldData|hostedFieldsFieldData} for the number field, if it is present.
 * @property {?HostedFields~hostedFieldsFieldData} fields.cvv {@link HostedFields~hostedFieldsFieldData|hostedFieldsFieldData} for the CVV field, if it is present.
 * @property {?HostedFields~hostedFieldsFieldData} fields.expDate {@link HostedFields~hostedFieldsFieldData|hostedFieldsFieldData} for the expiration date field, if it is present.
 * @property {?HostedFields~hostedFieldsFieldData} fields.expirationMonth {@link HostedFields~hostedFieldsFieldData|hostedFieldsFieldData} for the expiration month field, if it is present.
 * @property {?HostedFields~hostedFieldsFieldData} fields.expirationYear {@link HostedFields~hostedFieldsFieldData|hostedFieldsFieldData} for the expiration year field, if it is present.
 * @property {?HostedFields~hostedFieldsFieldData} fields.postalCode {@link HostedFields~hostedFieldsFieldData|hostedFieldsFieldData} for the postal code field, if it is present.
 */

/**
 * @typedef {object} HostedFields~hostedFieldsFieldData
 * @description Data about Hosted Fields fields, sent in {@link HostedFields~stateObject|stateObjects}.
 * @property {HTMLElement} container Reference to the container DOM element on your page associated with the current event.
 * @property {boolean} isFocused Whether or not the input is currently focused.
 * @property {boolean} isEmpty Whether or not the user has entered a value in the input.
 * @property {boolean} isPotentiallyValid
 * A determination based on the future validity of the input value.
 * This is helpful when a user is entering a card number and types <code>"41"</code>.
 * While that value is not valid for submission, it is still possible for
 * it to become a fully qualified entry. However, if the user enters <code>"4x"</code>
 * it is clear that the card number can never become valid and isPotentiallyValid will
 * return false.
 * @property {boolean} isValid Whether or not the value of the associated input is <i>fully</i> qualified for submission.
 */

/**
 * @typedef {object} HostedFields~hostedFieldsCard
 * @description Information about the card type, sent in {@link HostedFields~stateObject|stateObjects}.
 * @property {string} type The code-friendly representation of the card type. It will be one of the following strings:
 * - `american-express`
 * - `diners-club`
 * - `discover`
 * - `jcb`
 * - `maestro`
 * - `master-card`
 * - `unionpay`
 * - `visa`
 * @property {string} niceType The pretty-printed card type. It will be one of the following strings:
 * - `American Express`
 * - `Diners Club`
 * - `Discover`
 * - `JCB`
 * - `Maestro`
 * - `MasterCard`
 * - `UnionPay`
 * - `Visa`
 * @property {object} code
 * This object contains data relevant to the security code requirements of the card brand.
 * For example, on a Visa card there will be a <code>CVV</code> of 3 digits, whereas an
 * American Express card requires a 4-digit <code>CID</code>.
 * @property {string} code.name <code>"CVV"</code> <code>"CID"</code> <code>"CVC"</code>
 * @property {number} code.size The expected length of the security code. Typically, this is 3 or 4.
 */

/**
 * @name HostedFields#on
 * @function
 * @param {string} event The name of the event to which you are subscribing.
 * @param {function} handler A callback to handle the event.
 * @description Subscribes a handler function to a named event. `event` should be {@link HostedFields#event:blur|blur}, {@link HostedFields#event:focus|focus}, {@link HostedFields#event:empty|empty}, {@link HostedFields#event:notEmpty|notEmpty}, {@link HostedFields#event:cardTypeChange|cardTypeChange}, or {@link HostedFields#event:validityChange|validityChange}. Events will emit a {@link HostedFields~stateObject|stateObject}.
 * @example
 * <caption>Listening to a Hosted Field event, in this case 'focus'</caption>
 * hostedFields.create({ ... }, function (createErr, hostedFieldsInstance) {
 *   hostedFieldsInstance.on('focus', function (event) {
 *     console.log(event.emittedBy, 'has been focused');
 *   });
 * });
 * @returns {void}
 */

/**
 * This event is emitted when the user requests submission of an input field, such as by pressing the Enter or Return key on their keyboard, or mobile equivalent.
 * @event HostedFields#inputSubmitRequest
 * @type {HostedFields~stateObject}
 * @example
 * <caption>Clicking a submit button upon hitting Enter (or equivalent) within a Hosted Field</caption>
 * var hostedFields = require('seamlesspay-web/hosted-fields');
 * var submitButton = document.querySelector('input[type="submit"]');
 *
 * hostedFields.create({ ... }, function (createErr, hostedFieldsInstance) {
 *   hostedFieldsInstance.on('inputSubmitRequest', function () {
 *     // User requested submission, e.g. by pressing Enter or equivalent
 *     submitButton.click();
 *   });
 * });
 */

/**
 * This event is emitted when a field transitions from having data to being empty.
 * @event HostedFields#empty
 * @type {HostedFields~stateObject}
 * @example
 * <caption>Listening to an empty event</caption>
 * hostedFields.create({ ... }, function (createErr, hostedFieldsInstance) {
 *   hostedFieldsInstance.on('empty', function (event) {
 *     console.log(event.emittedBy, 'is now empty');
 *   });
 * });
 */

/**
 * This event is emitted when a field transitions from being empty to having data.
 * @event HostedFields#notEmpty
 * @type {HostedFields~stateObject}
 * @example
 * <caption>Listening to an notEmpty event</caption>
 * hostedFields.create({ ... }, function (createErr, hostedFieldsInstance) {
 *   hostedFieldsInstance.on('notEmpty', function (event) {
 *     console.log(event.emittedBy, 'is now not empty');
 *   });
 * });
 */

/**
 * This event is emitted when a field loses focus.
 * @event HostedFields#blur
 * @type {HostedFields~stateObject}
 * @example
 * <caption>Listening to a blur event</caption>
 * hostedFields.create({ ... }, function (createErr, hostedFieldsInstance) {
 *   hostedFieldsInstance.on('blur', function (event) {
 *     console.log(event.emittedBy, 'lost focus');
 *   });
 * });
 */

/**
 * This event is emitted when a field gains focus.
 * @event HostedFields#focus
 * @type {HostedFields~stateObject}
 * @example
 * <caption>Listening to a focus event</caption>
 * hostedFields.create({ ... }, function (createErr, hostedFieldsInstance) {
 *   hostedFieldsInstance.on('focus', function (event) {
 *     console.log(event.emittedBy, 'gained focus');
 *   });
 * });
 */

/**
 * This event is emitted when activity within the number field has changed such that the possible card type has changed.
 * @event HostedFields#cardTypeChange
 * @type {HostedFields~stateObject}
 * @example
 * <caption>Listening to a cardTypeChange event</caption>
 * hostedFields.create({ ... }, function (createErr, hostedFieldsInstance) {
 *   hostedFieldsInstance.on('cardTypeChange', function (event) {
 *     if (event.cards.length === 1) {
 *       console.log(event.cards[0].type);
 *     } else {
 *       console.log('Type of card not yet known');
 *     }
 *   });
 * });
 */

/**
 * This event is emitted when the validity of a field has changed. Validity is represented in the {@link HostedFields~stateObject|stateObject} as two booleans: `isValid` and `isPotentiallyValid`.
 * @event HostedFields#validityChange
 * @type {HostedFields~stateObject}
 * @example
 * <caption>Listening to a validityChange event</caption>
 * hostedFields.create({ ... }, function (createErr, hostedFieldsInstance) {
 *   hostedFieldsInstance.on('validityChange', function (event) {
 *     var field = event.fields[event.emittedBy];
 *
 *     if (field.isValid) {
 *       console.log(event.emittedBy, 'is fully valid');
 *     } else if (field.isPotentiallyValid) {
 *       console.log(event.emittedBy, 'is potentially valid');
 *     } else {
 *       console.log(event.emittedBy, 'is not valid');
 *     }
 *   });
 * });
 */

function createInputEventHandler(fields) {
  return function (eventData) {
    var field;
    var merchantPayload = eventData.merchantPayload;
    var emittedBy = merchantPayload.emittedBy;
    var container = fields[emittedBy].containerElement;

    Object.keys(merchantPayload.fields).forEach(function (key) {
      merchantPayload.fields[key].container = fields[key].containerElement;
    });

    field = merchantPayload.fields[emittedBy];

    classlist.toggle(container, constants.externalClasses.FOCUSED, field.isFocused);
    classlist.toggle(container, constants.externalClasses.VALID, field.isValid);
    classlist.toggle(container, constants.externalClasses.INVALID, !field.isPotentiallyValid);
    classlist.toggle(container, constants.externalClasses.POTENTIALLY_VALID, field.isPotentiallyValid);

    this._state = { // eslint-disable-line no-invalid-this
      cards: merchantPayload.cards,
      fields: merchantPayload.fields
    };

    this._emit(eventData.type, merchantPayload); // eslint-disable-line no-invalid-this
  };
}

/**
 * @class HostedFields
 * @param {object} options The Hosted Fields {@link module:seamlesspay-web/hosted-fields.create create} options.
 * @description <strong>Do not use this constructor directly. Use {@link module:seamlesspay-web/hosted-fields.create|seamlesspay-web.hosted-fields.create} instead.</strong>
 * @classdesc This class represents a Hosted Fields component produced by {@link module:seamlesspay-web/hosted-fields.create|seamlesspay-web/hosted-fields.create}. Instances of this class have methods for interacting with the input fields within Hosted Fields' iframes.
 */
function HostedFields(options) {
  var clientVersion, clientConfig;
  var self = this;
  var fields = {};
  var fieldCount = 0;
  var componentId = uuid();
  var availableTypes = Object.keys(constants.paymentTypes).reduce(function(result, typeKey) {
    result.push(constants.paymentTypes[typeKey]);
    return result;
  },[])

  if (!options.paymentType) {
    throw new SeamlesspayError({
      type: sharedErrors.INSTANTIATION_OPTION_REQUIRED.type,
      code: sharedErrors.INSTANTIATION_OPTION_REQUIRED.code,
      message: 'options.paymentType is required when instantiating Hosted Fields.'
    });
  }

  if (!~availableTypes.indexOf(options.paymentType)) {
    throw new SeamlesspayError({
      type: sharedErrors.INVALID_OPTION.type,
      code: sharedErrors.INVALID_OPTION.code,
      message: 'options.paymentType is invalid (acceptable: ' + availableTypes.join(', ') + ').'
    });
  }

  if (!options.client) {
    throw new SeamlesspayError({
      type: sharedErrors.INSTANTIATION_OPTION_REQUIRED.type,
      code: sharedErrors.INSTANTIATION_OPTION_REQUIRED.code,
      message: 'options.client is required when instantiating Hosted Fields.'
    });
  }

  clientConfig = options.client.getConfiguration();
  clientVersion = clientConfig.analyticsMetadata.sdkVersion;
  if (clientVersion !== VERSION) {
    throw new SeamlesspayError({
      type: sharedErrors.INCOMPATIBLE_VERSIONS.type,
      code: sharedErrors.INCOMPATIBLE_VERSIONS.code,
      message: 'Client (version ' + clientVersion + ') and Hosted Fields (version ' + VERSION + ') components must be from the same SDK version.'
    });
  }

  if (!options.fields) {
    throw new SeamlesspayError({
      type: sharedErrors.INSTANTIATION_OPTION_REQUIRED.type,
      code: sharedErrors.INSTANTIATION_OPTION_REQUIRED.code,
      message: 'options.fields is required when instantiating Hosted Fields.'
    });
  }

  checkIntegrity(options.paymentType, Object.keys(options.fields));

  EventEmitter.call(this);

  this._paymentType = options.paymentType;
  this._injectedNodes = [];
  this._destructor = new Destructor();
  this._fields = fields;
  this._submitButton = options.submitButton;
  this._additionalRequestData = null;
  this._state = {
    fields: {},
    cards: getCardTypes('')
  };

  this._bus = new Bus({
    channel: componentId,
    merchantUrl: location.href
  });

  this._destructor.registerFunctionForTeardown(
    function () {
      self._bus.teardown();
    });

  this._client = options.client;

  if (options.submitButton) {
    var container = document.querySelector(options.submitButton.selector);

    if (!container) {
      throw new SeamlesspayError({
        type: errors.HOSTED_FIELDS_INVALID_SUBMIT_BUTTON_SELECTOR.type,
        code: errors.HOSTED_FIELDS_INVALID_SUBMIT_BUTTON_SELECTOR.code,
        message: errors.HOSTED_FIELDS_INVALID_SUBMIT_BUTTON_SELECTOR.message,
        details: {
          fieldSelector: options.submitButton.selector
        }
      });
    }

    options.submitButton = { containerElement: container };
    this._submitButton = { container: container };
    this._setupSubmitButton(container);
  }

  Object.keys(options.fields).forEach(function (key) {
    var field, container, frame;

    if (!self.getWhitelistedFields().hasOwnProperty(key)) {
      throw new SeamlesspayError({
        type: errors.HOSTED_FIELDS_INVALID_FIELD_KEY.type,
        code: errors.HOSTED_FIELDS_INVALID_FIELD_KEY.code,
        message: '"' + key + '" is not a valid field.'
      });
    }

    field = options.fields[key];

    container = document.querySelector(field.selector);

    if (!container) {
      throw new SeamlesspayError({
        type: errors.HOSTED_FIELDS_INVALID_FIELD_SELECTOR.type,
        code: errors.HOSTED_FIELDS_INVALID_FIELD_SELECTOR.code,
        message: errors.HOSTED_FIELDS_INVALID_FIELD_SELECTOR.message,
        details: {
          fieldSelector: field.selector,
          fieldKey: key
        }
      });
    } else if (container.querySelector('iframe[name^="seamlesspay-"]')) {
      throw new SeamlesspayError({
        type: errors.HOSTED_FIELDS_FIELD_DUPLICATE_IFRAME.type,
        code: errors.HOSTED_FIELDS_FIELD_DUPLICATE_IFRAME.code,
        message: errors.HOSTED_FIELDS_FIELD_DUPLICATE_IFRAME.message,
        details: {
          fieldSelector: field.selector,
          fieldKey: key
        }
      });
    }

    frame = iFramer({
      type: key,
      name: 'seamlesspay-hosted-field-' + key,
      style: constants.defaultIFrameStyle,
      title: 'hosted-field'
    });

    this._injectedNodes = this._injectedNodes.concat(injectFrame(frame, container));
    this._setupLabelFocus(key, container);
    fields[key] = {
      frameElement: frame,
      containerElement: container
    };
    fieldCount++;

    this._state.fields[key] = {
      isEmpty: true,
      isValid: false,
      isPotentiallyValid: true,
      isFocused: false,
      container: container
    };

    setTimeout(function () {
      frame.src = composeUrl(clientConfig, 'hosted-fields', componentId, clientConfig.isDebug);
    }, 0);
  }.bind(this));

  this._bus.on(events.FRAME_READY, function (reply) {
    fieldCount--;
    if (fieldCount === 0) {
      reply(options);
      self._emit('ready');
    }
  });

  this._bus.on(
    events.INPUT_EVENT,
    createInputEventHandler(fields).bind(this)
  );

  this._destructor.registerFunctionForTeardown(function () {
    var j, node, parent;

    for (j = 0; j < self._injectedNodes.length; j++) {
      node = self._injectedNodes[j];
      parent = node.parentNode;

      parent.removeChild(node);

      classlist.remove(
        parent,
        constants.externalClasses.POTENTIALLY_VALID,
        constants.externalClasses.FOCUSED,
        constants.externalClasses.INVALID,
        constants.externalClasses.VALID
      );
    }
  });

  this._destructor.registerFunctionForTeardown(function () {
    var methodNames = methods(HostedFields.prototype).concat(methods(EventEmitter.prototype));

    convertMethodsToError(self, methodNames);
  });
}

HostedFields.prototype = Object.create(EventEmitter.prototype, {
  constructor: HostedFields
});

HostedFields.prototype.getWhitelistedFields = function () {
  return getWhitelistedFields(this._paymentType);
};

HostedFields.prototype._setupSubmitButton = function (container) {
  var self = this;
  var submitButton = container;

  if (!submitButton) { return; }

  submitButton.setAttribute('disabled', 'disabled');

  this._bus.on(
    events.INPUT_EVENT,
    function () {
      if (self.isFormValid()) {
        submitButton.removeAttribute('disabled');
      } else {
        submitButton.setAttribute('disabled', 'disabled');
      }
    }
  );

  function triggerSubmitButton(event) {
    event.preventDefault();
    self._triggerHandlerFn(self._tokenizeRequestHandler, self);

    return self.tokenize.call(self, self._additionalRequestData)
    .then(function (response) {
      return self._triggerHandlerFn(self._tokenizeResponseHandler, null, response);
    })
    .catch(function (error) {
      return self._triggerHandlerFn(self._tokenizeResponseHandler, error, null);
    });
  }

  submitButton.addEventListener('click', triggerSubmitButton);

  this._destructor.registerFunctionForTeardown(function () {
    submitButton.removeEventListener('click', triggerSubmitButton);
  });

};

HostedFields.prototype._triggerHandlerFn = function () {
  var self = this;
  var args = Array.prototype.slice.call(arguments);
  var fn = args.shift();

  if (typeof fn !== 'function') { return; }

  try {
    fn.apply(self, args);
  } catch (error) {
    throw error;
  }
};

/**
 * Set additional data to be sent with the tokenization request.
 * @public
 * @function
 * @param {object} data Additional data to be sent with the tokenization request.
 * @returns {void}
 *
 * @example
 * hostedFieldsInstance.setAdditionalRequestData({
 *   billingAddress: {
 *    postalCode: '60654'
 *   }
 * });
 *
 */
HostedFields.prototype.setAdditionalRequestData = function (data) {
  this._additionalRequestData = data;
};

/**
 * Add a tokenize request handler. This handler will be called after the Hosted Fields form is submitted, before the tokenize request is sent.
 * @public
 * @function
 * @param {callback} handler The callback to be called before sending the tokenize request.
 * @returns {void}
 * @example
 * hostedFieldsInstance.addTokenizeRequestHandler(function () {
 *  // Handle form submission
 * });
*/
HostedFields.prototype.addTokenizeRequestHandler = function (handler) {
  if (typeof handler !== 'function') { return; }
  this._tokenizeRequestHandler = handler;
};

/**
 * Add a tokenize response handler. This handler will be called after the tokenize response is received.
 * @public
 * @function
 * @param {callback} handler The callback to be called after the tokenize response is received.
 * @returns {void}
 * @example
 * hostedFieldsInstance.addTokenizeResponseHandler(function (error, response) {
 *   if (error) {
 *     console.error(error);
 *   } else {
 *     console.log(response);
 *   }
 * });
 */
HostedFields.prototype.addTokenizeResponseHandler = function (handler) {
  if (typeof handler !== 'function') { return; }
  this._tokenizeResponseHandler = handler;
};

HostedFields.prototype._setupLabelFocus = function (type, container) {
  var labels, i;
  var shouldSkipLabelFocus = isIos();
  var bus = this._bus;

  if (shouldSkipLabelFocus) { return; }
  if (container.id == null) { return; }

  function triggerFocus() {
    bus.emit(events.TRIGGER_INPUT_FOCUS, type);
  }

  labels = Array.prototype.slice.call(document.querySelectorAll('label[for="' + container.id + '"]'));
  labels = labels.concat(findParentTags(container, 'label'));

  for (i = 0; i < labels.length; i++) {
    labels[i].addEventListener('click', triggerFocus, false);
  }

  this._destructor.registerFunctionForTeardown(function () {
    for (i = 0; i < labels.length; i++) {
      labels[i].removeEventListener('click', triggerFocus, false);
    }
  });
};

/**
 * Cleanly remove anything set up by {@link module:seamlesspay-web/hosted-fields.create|create}.
 * @public
 * @function
 * @param {callback} [callback] Called on completion, containing an error if one occurred. No data is returned if teardown completes successfully. If no callback is provided, `teardown` returns a promise.
 * @example
 * hostedFieldsInstance.teardown(function (teardownErr) {
 *   if (teardownErr) {
 *     console.error('Could not tear down Hosted Fields!');
 *   } else {
 *     console.info('Hosted Fields has been torn down!');
 *   }
 * });
 * @returns {Promise|void} If no callback is provided, returns a promise that resolves when the teardown is complete.
 */
HostedFields.prototype.teardown = wrapPromise(
  function () {
    var self = this; // eslint-disable-line no-invalid-this

    return new Promise(function (resolve, reject) {
      self._destructor.teardown(function (err) {

        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
);

/**
 * Tokenizes fields and returns a token payload.
 * @public
 * @function
 * @param {object} [options] All tokenization options for the Hosted Fields component.
 * @param {boolean} [options.vault=false] When true, will vault the tokenized card. Cards will only be vaulted when using a client created with a client token that includes a customer ID.
 * @param {string} [options.billingAddress.postalCode] When supplied, this postal code will be tokenized along with the contents of the fields. If a postal code is provided as part of the Hosted Fields configuration, the value of the field will be tokenized and this value will be ignored.
 * @param {callback} [callback] The second argument, <code>data</code>, is a {@link HostedFields~tokenizePayload|tokenizePayload}. If no callback is provided, `tokenize` returns a function that resolves with a {@link HostedFields~tokenizePayload|tokenizePayload}.
 * @example <caption>Tokenize a card</caption>
 * hostedFieldsInstance.tokenize(function (tokenizeErr, payload) {
 *   if (tokenizeErr) {
 *     switch (tokenizeErr.code) {
 *       case 'HOSTED_FIELDS_FIELDS_EMPTY':
 *         console.error('All fields are empty! Please fill out the form.');
 *         break;
 *       case 'HOSTED_FIELDS_FIELDS_INVALID':
 *         console.error('Some fields are invalid:', tokenizeErr.details.invalidFieldKeys);
 *         break;
 *       case 'HOSTED_FIELDS_FAILED_TOKENIZATION':
 *         console.error('Tokenization failed server side. Is the card valid?');
 *         break;
 *       case 'HOSTED_FIELDS_TOKENIZATION_NETWORK_ERROR':
 *         console.error('Network error occurred when tokenizing.');
 *         break;
 *       default:
 *         console.error('Something bad happened!', tokenizeErr);
 *     }
 *   } else {
 *     console.log('Got nonce:', payload.nonce);
 *   }
 * });
 * @example <caption>Tokenize and vault a card</caption>
 * hostedFieldsInstance.tokenize({
 *   vault: true
 * }, function (tokenizeErr, payload) {
 *   if (tokenizeErr) {
 *     console.error(tokenizeErr);
 *   } else {
 *     console.log('Got nonce:', payload.nonce);
 *   }
 * });
 * @example <caption>Tokenize a card with the postal code option</caption>
 * hostedFieldsInstance.tokenize({
 *   billingAddress: {
 *     postalCode: '11111'
 *   }
 * }, function (tokenizeErr, payload) {
 *   if (tokenizeErr) {
 *     console.error(tokenizeErr);
 *   } else {
 *     console.log('Got nonce:', payload.nonce);
 *   }
 * });
 * @returns {void}
 */
HostedFields.prototype.tokenize = wrapPromise(
  function (options) {
    var self = this; // eslint-disable-line no-invalid-this

    if (!options) {
      options = {};
    }

    return new Promise(function (resolve, reject) {
      self._bus.emit(events.TOKENIZATION_REQUEST, options, function (response) {
        var err = response[0];
        var payload = response[1];

        if (err) {
          reject(err);
        } else {
          resolve(formatTokenizeResponse(payload));
        }
      });
    });
  }
);

/**
 * Add a class to a {@link module:seamlesspay-web/hosted-fields~field field}. Useful for updating field styles when events occur elsewhere in your checkout.
 * @public
 * @param {string} field The field you wish to add a class to. Must be a valid {@link module:seamlesspay-web/hosted-fields~fieldOptions fieldOption}.
 * @param {string} classname The class to be added.
 * @param {callback} [callback] Callback executed on completion, containing an error if one occurred. No data is returned if the class is added successfully.
 *
 * @example
 * hostedFieldsInstance.addClass('number', 'custom-class', function (addClassErr) {
 *   if (addClassErr) {
 *     console.error(addClassErr);
 *   }
 * });
 * @returns {void}
 */
HostedFields.prototype.addClass = function (field, classname, callback) {
  var err;

  if (!this.getWhitelistedFields().hasOwnProperty(field)) {
    err = new SeamlesspayError({
      type: errors.HOSTED_FIELDS_FIELD_INVALID.type,
      code: errors.HOSTED_FIELDS_FIELD_INVALID.code,
      message: '"' + field + '" is not a valid field. You must use a valid field option when adding a class.'
    });
  } else if (!this._fields.hasOwnProperty(field)) {
    err = new SeamlesspayError({
      type: errors.HOSTED_FIELDS_FIELD_NOT_PRESENT.type,
      code: errors.HOSTED_FIELDS_FIELD_NOT_PRESENT.code,
      message: 'Cannot add class to "' + field + '" field because it is not part of the current Hosted Fields options.'
    });
  } else {
    this._bus.emit(events.ADD_CLASS, field, classname);
  }

  if (typeof callback === 'function') {
    callback = deferred(callback);
    callback(err);
  }
};

/**
 * Removes a class to a {@link module:seamlesspay-web/hosted-fields~field field}. Useful for updating field styles when events occur elsewhere in your checkout.
 * @public
 * @param {string} field The field you wish to remove a class from. Must be a valid {@link module:seamlesspay-web/hosted-fields~fieldOptions fieldOption}.
 * @param {string} classname The class to be removed.
 * @param {callback} [callback] Callback executed on completion, containing an error if one occurred. No data is returned if the class is removed successfully.
 *
 * @example
 * hostedFieldsInstance.addClass('number', 'custom-class', function (addClassErr) {
 *   if (addClassErr) {
 *     console.error(addClassErr);
 *     return;
 *   }
 *
 *   // some time later...
 *   hostedFieldsInstance.removeClass('number', 'custom-class');
 * });
 * @returns {void}
 */
HostedFields.prototype.removeClass = function (field, classname, callback) {
  var err;

  if (!this.getWhitelistedFields().hasOwnProperty(field)) {
    err = new SeamlesspayError({
      type: errors.HOSTED_FIELDS_FIELD_INVALID.type,
      code: errors.HOSTED_FIELDS_FIELD_INVALID.code,
      message: '"' + field + '" is not a valid field. You must use a valid field option when removing a class.'
    });
  } else if (!this._fields.hasOwnProperty(field)) {
    err = new SeamlesspayError({
      type: errors.HOSTED_FIELDS_FIELD_NOT_PRESENT.type,
      code: errors.HOSTED_FIELDS_FIELD_NOT_PRESENT.code,
      message: 'Cannot remove class from "' + field + '" field because it is not part of the current Hosted Fields options.'
    });
  } else {
    this._bus.emit(events.REMOVE_CLASS, field, classname);
  }

  if (typeof callback === 'function') {
    callback = deferred(callback);
    callback(err);
  }
};

/**
 * Sets an attribute of a {@link module:seamlesspay-web/hosted-fields~field field}.
 * Supported attributes are `aria-invalid`, `aria-required`, `disabled`, and `placeholder`.
 *
 * @public
 * @param {object} options The options for the attribute you wish to set.
 * @param {string} options.field The field to which you wish to add an attribute. Must be a valid {@link module:seamlesspay-web/hosted-fields~fieldOptions fieldOption}.
 * @param {string} options.attribute The name of the attribute you wish to add to the field.
 * @param {string} options.value The value for the attribute.
 * @param {callback} [callback] Callback executed on completion, containing an error if one occurred. No data is returned if the attribute is set successfully.
 *
 * @example <caption>Set the placeholder attribute of a field</caption>
 * hostedFieldsInstance.setAttribute({
 *   field: 'number',
 *   attribute: 'placeholder',
 *   value: '1111 1111 1111 1111'
 * }, function (attributeErr) {
 *   if (attributeErr) {
 *     console.error(attributeErr);
 *   }
 * });
 *
 * @example <caption>Set the aria-required attribute of a field</caption>
 * hostedFieldsInstance.setAttribute({
 *   field: 'number',
 *   attribute: 'aria-required',
 *   value: true
 * }, function (attributeErr) {
 *   if (attributeErr) {
 *     console.error(attributeErr);
 *   }
 * });
 *
 * @returns {void}
 */
HostedFields.prototype.setAttribute = function (options, callback) {
  var attributeErr, err;

  if (!this.getWhitelistedFields().hasOwnProperty(options.field)) {
    err = new SeamlesspayError({
      type: errors.HOSTED_FIELDS_FIELD_INVALID.type,
      code: errors.HOSTED_FIELDS_FIELD_INVALID.code,
      message: '"' + options.field + '" is not a valid field. You must use a valid field option when setting an attribute.'
    });
  } else if (!this._fields.hasOwnProperty(options.field)) {
    err = new SeamlesspayError({
      type: errors.HOSTED_FIELDS_FIELD_NOT_PRESENT.type,
      code: errors.HOSTED_FIELDS_FIELD_NOT_PRESENT.code,
      message: 'Cannot set attribute for "' + options.field + '" field because it is not part of the current Hosted Fields options.'
    });
  } else {
    attributeErr = attributeValidationError(options.attribute, options.value);

    if (attributeErr) {
      err = attributeErr;
    } else {
      this._bus.emit(events.SET_ATTRIBUTE, options.field, options.attribute, options.value);
    }
  }

  if (typeof callback === 'function') {
    callback = deferred(callback);
    callback(err);
  }
};

/**
 * Removes a supported attribute from a {@link module:seamlesspay-web/hosted-fields~field field}.
 *
 * @public
 * @param {object} options The options for the attribute you wish to remove.
 * @param {string} options.field The field from which you wish to remove an attribute. Must be a valid {@link module:seamlesspay-web/hosted-fields~fieldOptions fieldOption}.
 * @param {string} options.attribute The name of the attribute you wish to remove from the field.
 * @param {callback} [callback] Callback executed on completion, containing an error if one occurred. No data is returned if the attribute is removed successfully.
 *
 * @example <caption>Remove the placeholder attribute of a field</caption>
 * hostedFieldsInstance.removeAttribute({
 *   field: 'number',
 *   attribute: 'placeholder'
 * }, function (attributeErr) {
 *   if (attributeErr) {
 *     console.error(attributeErr);
 *   }
 * });
 *
 * @returns {void}
 */
HostedFields.prototype.removeAttribute = function (options, callback) {
  var attributeErr, err;

  if (!this.getWhitelistedFields().hasOwnProperty(options.field)) {
    err = new SeamlesspayError({
      type: errors.HOSTED_FIELDS_FIELD_INVALID.type,
      code: errors.HOSTED_FIELDS_FIELD_INVALID.code,
      message: '"' + options.field + '" is not a valid field. You must use a valid field option when removing an attribute.'
    });
  } else if (!this._fields.hasOwnProperty(options.field)) {
    err = new SeamlesspayError({
      type: errors.HOSTED_FIELDS_FIELD_NOT_PRESENT.type,
      code: errors.HOSTED_FIELDS_FIELD_NOT_PRESENT.code,
      message: 'Cannot remove attribute for "' + options.field + '" field because it is not part of the current Hosted Fields options.'
    });
  } else {
    attributeErr = attributeValidationError(options.attribute);

    if (attributeErr) {
      err = attributeErr;
    } else {
      this._bus.emit(events.REMOVE_ATTRIBUTE, options.field, options.attribute);
    }
  }

  if (typeof callback === 'function') {
    callback = deferred(callback);
    callback(err);
  }
};

/**
 * @deprecated since version 3.8.0. Use {@link HostedFields#setAttribute|setAttribute} instead.
 *
 * @public
 * @param {string} field The field whose placeholder you wish to change. Must be a valid {@link module:seamlesspay-web/hosted-fields~fieldOptions fieldOption}.
 * @param {string} placeholder Will be used as the `placeholder` attribute of the input.
 * @param {callback} [callback] Callback executed on completion, containing an error if one occurred. No data is returned if the placeholder updated successfully.
 *
 * @returns {void}
 */
HostedFields.prototype.setPlaceholder = function (field, placeholder, callback) {
  this.setAttribute({
    field: field,
    attribute: 'placeholder',
    value: placeholder
  }, callback);
};

/**
 * Clear the value of a {@link module:seamlesspay-web/hosted-fields~field field}.
 * @public
 * @param {string} field The field whose placeholder you wish to clear. Must be a valid {@link module:seamlesspay-web/hosted-fields~fieldOptions fieldOption}.
 * @param {callback} [callback] Callback executed on completion, containing an error if one occurred. No data is returned if the field cleared successfully.
 * @returns {void}
 * @example
 * hostedFieldsInstance.clear('number', function (clearErr) {
 *   if (clearErr) {
 *     console.error(clearErr);
 *   }
 * });
 *
 * @example <caption>Clear several fields</caption>
 * hostedFieldsInstance.clear('number');
 * hostedFieldsInstance.clear('cvv');
 * hostedFieldsInstance.clear('expirationDate');
 */
HostedFields.prototype.clear = function (field, callback) {
  var err;

  if (!this.getWhitelistedFields().hasOwnProperty(field)) {
    err = new SeamlesspayError({
      type: errors.HOSTED_FIELDS_FIELD_INVALID.type,
      code: errors.HOSTED_FIELDS_FIELD_INVALID.code,
      message: '"' + field + '" is not a valid field. You must use a valid field option when clearing a field.'
    });
  } else if (!this._fields.hasOwnProperty(field)) {
    err = new SeamlesspayError({
      type: errors.HOSTED_FIELDS_FIELD_NOT_PRESENT.type,
      code: errors.HOSTED_FIELDS_FIELD_NOT_PRESENT.code,
      message: 'Cannot clear "' + field + '" field because it is not part of the current Hosted Fields options.'
    });
  } else {
    this._bus.emit(events.CLEAR_FIELD, field);
  }

  if (typeof callback === 'function') {
    callback = deferred(callback);
    callback(err);
  }
};

/**
 * Fill form fields with token data.
 * @public
 * @param {object} [options] Options for the Hosted Fields component.
 * @returns {Promise} Returns a promise.
 * @example
 * hostedFieldsInstance.populateToken({ token: 'TKN_ABCDEFGHIJKLMNOP1234567' });
 */
HostedFields.prototype.populateToken = wrapPromise(
  function (options) {
    var self = this; // eslint-disable-line no-invalid-this
    options = options || {};

    return new Promise(function (resolve) {
      self._bus.emit(events.POPULATE_TOKEN, options, function (result) { // TODO: implement internal part
        resolve(result);
      });
    });
  }
);

/**
 * Returns an {@link HostedFields~stateObject|object} that includes the state of all fields and possible card types.
 * @public
 * @returns {object} {@link HostedFields~stateObject|stateObject}
 * @example <caption>Check if all fields are valid</caption>
 * var state = hostedFields.getState();
 *
 * var formValid = Object.keys(state.fields).every(function (key) {
 *   return state.fields[key].isValid;
 * });
 */
HostedFields.prototype.getState = function () {
  return this._state;
};

/**
 * Returns a boolean indicating whether or not the form is valid.
 * @public
 * @returns {boolean} True if all fields are valid, false otherwise.
 * @example
 * var formValid = hostedFieldsInstance.isFormValid();
 */
HostedFields.prototype.isFormValid = function () {
  var self = this;
  return Object.keys(self._state.fields).every(function (key) {
    return self._state.fields[key].isValid;
  });
}


module.exports = HostedFields;

},{"../../lib/bus":31,"../../lib/classlist":32,"../../lib/compose-url":33,"../../lib/convert-methods-to-error":34,"../../lib/deferred":35,"../../lib/destructor":36,"../../lib/errors":38,"../../lib/event-emitter":39,"../../lib/inject-frame":40,"../../lib/is-ios":41,"../../lib/methods":43,"../../lib/promise":45,"../../lib/seamlesspay-error":46,"../../lib/uuid":47,"../shared/common":23,"../shared/constants":24,"../shared/errors":25,"../shared/find-parent-tags":26,"./attribute-validation-error":18,"./check-integrity":19,"./response-formatters":21,"@braintree/iframer":1,"@braintree/wrap-promise":8,"credit-card-type":9}],21:[function(_dereq_,module,exports){

function formatTokenizeResponse(payload) {
  if (!(payload instanceof Object)) return payload

  var {
    expDate,
    lastFour,
    name,
    paymentNetwork,
    token: paymentToken,
  } = payload;

  return {
    paymentToken,
    details: {
      expDate,
      lastFour,
      name,
      paymentNetwork,
    }
  };
}

module.exports = {
  formatTokenizeResponse
}

},{}],22:[function(_dereq_,module,exports){
'use strict';
/** @module seamlesspay-web/hosted-fields */

var HostedFields = _dereq_('./external/hosted-fields');
var wrapPromise = _dereq_('@braintree/wrap-promise');
var Promise = _dereq_('../lib/promise');

var VERSION = "web-sdk";

/**
 * Fields used in {@link module:seamlesspay-web/hosted-fields~fieldOptions fields options}
 * @typedef {object} field
 * @property {string} selector A CSS selector to find the container where the hosted field will be inserted.
 * @property {string} [placeholder] Will be used as the `placeholder` attribute of the input. If `placeholder` is not natively supported by the browser, it will be polyfilled.
 * @property {string} [type] Will be used as the `type` attribute of the input. To mask `cvv` input, for instance, `type: "password"` can be used.
 * @property {boolean} [formatInput=true] Enable or disable automatic formatting on this field.
 * @property {object|boolean} [select] If truthy, this field becomes a `<select>` dropdown list. This can only be used for `expirationMonth` and `expirationYear` fields.
 * @property {string[]} [select.options] An array of 12 strings, one per month. This can only be used for the `expirationMonth` field. For example, the array can look like `['01 - January', '02 - February', ...]`.
 */

/**
 * An object that has {@link module:seamlesspay-web/hosted-fields~field field objects} for each field. Used in {@link module:seamlesspay-web/hosted-fields~create create}.
 * @typedef {object} fieldOptions
 * @property {field} [number] A field for card number.
 * @property {field} [expirationDate] A field for expiration date in `MM/YYYY` format. This should not be used with the `expirationMonth` and `expirationYear` properties.
 * @property {field} [expirationMonth] A field for expiration month in `MM` format. This should be used with the `expirationYear` property.
 * @property {field} [expirationYear] A field for expiration year in `YYYY` format. This should be used with the `expirationMonth` property.
 * @property {field} [cvv] A field for 3 or 4 digit CVV or CID.
 * @property {field} [postalCode] A field for postal or region code.
 */

/**
 * An object that represents CSS that will be applied in each hosted field. This object looks similar to CSS. Typically, these styles involve fonts (such as `font-family` or `color`).
 *
 * These are the CSS properties that Hosted Fields supports. Any other CSS should be specified on your page and outside of any Seamlesspay configuration. Trying to set unsupported properties will fail and put a warning in the console.
 *
 * Supported CSS properties are:
 * `color`
 * `direction`
 * `font-family`
 * `font-size-adjust`
 * `font-size`
 * `font-stretch`
 * `font-style`
 * `font-variant-alternates`
 * `font-variant-caps`
 * `font-variant-east-asian`
 * `font-variant-ligatures`
 * `font-variant-numeric`
 * `font-variant`
 * `font-weight`
 * `font`
 * `letter-spacing`
 * `line-height`
 * `opacity`
 * `outline`
 * `text-shadow`
 * `transition`
 * `-moz-osx-font-smoothing`
 * `-moz-tap-highlight-color`
 * `-moz-transition`
 * `-webkit-font-smoothing`
 * `-webkit-tap-highlight-color`
 * `-webkit-transition`
 * @typedef {object} styleOptions
 */

/**
 * @static
 * @function create
 * @param {object} options Creation options:
 * @param {Client} options.client A {@link Client} instance.
 * @param {fieldOptions} options.fields A {@link module:seamlesspay-web/hosted-fields~fieldOptions set of options for each field}.
 * @param {styleOptions} options.styles {@link module:seamlesspay-web/hosted-fields~styleOptions Styles} applied to each field.
 * @param {callback} [callback] The second argument, `data`, is the {@link HostedFields} instance. If no callback is provided, `create` returns a promise that resolves with the {@link HostedFields} instance.
 * @returns {void}
 * @example
 * seamlesspay.hostedFields.create({
 *   paymentType: 'CREDIT',
 *   client: clientInstance,
 *   styles: {
 *     'input': {
 *       'font-size': '16pt',
 *       'color': '#3A3A3A'
 *     },
 *     '.number': {
 *       'font-family': 'monospace'
 *     },
 *     '.valid': {
 *       'color': 'green'
 *     }
 *   },
 *   fields: {
 *     accountNumber: {
 *       selector: '#account-number'
 *     },
 *     cvv: {
 *       selector: '#cvv',
 *       placeholder: '•••'
 *     },
 *     expDate: {
 *       selector: '#exp-date',
 *       type: 'month'
 *     }
 *   }
 * }, callback);
 * @example <caption>Right to Left Language Support</caption>
 * seamlesspay.hostedFields.create({
 *   paymentType: 'CREDIT',
 *   client: clientInstance,
 *   styles: {
 *     'input': {
 *       // other styles
 *       direction: 'rtl'
 *     },
 *   },
 *   fields: {
 *     accountNumber: {
 *       selector: '#account-number',
 *       // Credit card formatting is not currently supported
 *       // with RTL languages, so we need to turn it off for the number input
 *       formatInput: false
 *     },
 *     cvv: {
 *       selector: '#cvv',
 *       placeholder: '•••'
 *     },
 *     expDate: {
 *       selector: '#exp-date',
 *       type: 'month'
 *     }
 *   }
 * }, callback);
 */
function create(options) {
  var integration;
  var promise = new Promise(function (resolve, reject) {
    try {
      integration = new HostedFields(options);
    } catch (error) {
      return reject(error);
    }

    return integration.on('ready', function () {
      resolve(integration);
    });
  });

  return promise;
}

module.exports = {
  create: wrapPromise(create),
  /**
   * @description The current version of the SDK, i.e. `{@pkg version}`.
   * @type {string}
   */
  VERSION: VERSION
};

},{"../lib/promise":45,"./external/hosted-fields":20,"@braintree/wrap-promise":8}],23:[function(_dereq_,module,exports){
'use strict';

var constants = _dereq_('./constants');

function getMaxLength(paymentType, name) {
  paymentType = paymentType || constants.paymentTypes.PAYMENT_TYPE_CREDIT;
  return (name && constants.whitelistedFields[paymentType][name].defaultMaxLength) || null;
}

function getWhitelistedFields(paymentType) {
  paymentType = paymentType || constants.paymentTypes.PAYMENT_TYPE_CREDIT;
  return constants.whitelistedFields[paymentType];
}

module.exports = {
  getWhitelistedFields: getWhitelistedFields,
  getMaxLength: getMaxLength
};

},{"./constants":24}],24:[function(_dereq_,module,exports){
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

},{"../../lib/enumerate":37}],25:[function(_dereq_,module,exports){
'use strict';

var SeamlesspayError = _dereq_('../../lib/seamlesspay-error');

module.exports = {
  HOSTED_FIELDS_INVALID_FIELD_KEY: {
    type: SeamlesspayError.types.MERCHANT,
    code: 'HOSTED_FIELDS_INVALID_FIELD_KEY'
  },
  HOSTED_FIELDS_INVALID_FIELD_DEFAULT_VALUE: {
    type: SeamlesspayError.types.MERCHANT,
    code: 'HOSTED_FIELDS_INVALID_FIELD_DEFAULT_VALUE'
  },
  HOSTED_FIELDS_INVALID_FIELD_SELECTOR: {
    type: SeamlesspayError.types.MERCHANT,
    code: 'HOSTED_FIELDS_INVALID_FIELD_SELECTOR',
    message: 'Selector does not reference a valid DOM node.'
  },
  HOSTED_FIELDS_INVALID_SUBMIT_BUTTON_SELECTOR: {
    type: SeamlesspayError.types.MERCHANT,
    code: 'HOSTED_FIELDS_INVALID_SUBMIT_BUTTON_SELECTOR',
    message: 'Selector does not reference a valid DOM node.'
  },
  HOSTED_FIELDS_FIELD_DUPLICATE_IFRAME: {
    type: SeamlesspayError.types.MERCHANT,
    code: 'HOSTED_FIELDS_FIELD_DUPLICATE_IFRAME',
    message: 'Element already contains a Seamlesspay iframe.'
  },
  HOSTED_FIELDS_FIELD_INVALID: {
    type: SeamlesspayError.types.MERCHANT,
    code: 'HOSTED_FIELDS_FIELD_INVALID'
  },
  HOSTED_FIELDS_FIELD_NOT_PRESENT: {
    type: SeamlesspayError.types.MERCHANT,
    code: 'HOSTED_FIELDS_FIELD_NOT_PRESENT'
  },
  HOSTED_FIELDS_TOKENIZATION_NETWORK_ERROR: {
    type: SeamlesspayError.types.NETWORK,
    code: 'HOSTED_FIELDS_TOKENIZATION_NETWORK_ERROR',
    message: 'A tokenization network error occurred.'
  },
  HOSTED_FIELDS_FAILED_TOKENIZATION: {
    type: SeamlesspayError.types.CUSTOMER,
    code: 'HOSTED_FIELDS_FAILED_TOKENIZATION',
    message: 'The supplied card data failed tokenization.'
  },
  HOSTED_FIELDS_FIELDS_EMPTY: {
    type: SeamlesspayError.types.CUSTOMER,
    code: 'HOSTED_FIELDS_FIELDS_EMPTY',
    message: 'All fields are empty. Cannot tokenize empty card fields.'
  },
  HOSTED_FIELDS_FIELDS_INVALID: {
    type: SeamlesspayError.types.CUSTOMER,
    code: 'HOSTED_FIELDS_FIELDS_INVALID',
    message: 'Some payment input fields are invalid. Cannot tokenize invalid card fields.'
  },
  HOSTED_FIELDS_ATTRIBUTE_NOT_SUPPORTED: {
    type: SeamlesspayError.types.MERCHANT,
    code: 'HOSTED_FIELDS_ATTRIBUTE_NOT_SUPPORTED'
  },
  HOSTED_FIELDS_ATTRIBUTE_VALUE_NOT_ALLOWED: {
    type: SeamlesspayError.types.MERCHANT,
    code: 'HOSTED_FIELDS_ATTRIBUTE_VALUE_NOT_ALLOWED'
  },
  HOSTED_FIELDS_INCOMPATIBLE_FIELDS_SET: {
    type: SeamlesspayError.types.MERCHANT,
    code: 'HOSTED_FIELDS_INCOMPATIBLE_FIELDS_SET'
  }
};

},{"../../lib/seamlesspay-error":46}],26:[function(_dereq_,module,exports){
'use strict';

function findParentTags(element, tag) {
  var parent = element.parentNode;
  var parents = [];

  while (parent != null) {
    if (parent.tagName != null && parent.tagName.toLowerCase() === tag) {
      parents.push(parent);
    }

    parent = parent.parentNode;
  }

  return parents;
}

module.exports = findParentTags;

},{}],27:[function(_dereq_,module,exports){
'use strict';
var constants = _dereq_('./constants');

var requestTypes = constants.requestTypes;
var paymentTypes = constants.paymentTypes;

var TOKENIZATION = requestTypes.REQUEST_TYPE_TOKENIZATION;

var CREDIT = paymentTypes.PAYMENT_TYPE_CREDIT;
var ACH = paymentTypes.PAYMENT_TYPE_ACH;
var GIFT_CARD = paymentTypes.PAYMENT_TYPE_GIFT_CARD;

var relations = {};
relations[TOKENIZATION] = {};

relations[TOKENIZATION][CREDIT] = {
  fields: [
    'accountNumber',
    'postalCode',
    'expDate',
    'cvv'
  ],
  oneOf: [
    {
      required: [ 'accountNumber', 'expDate' ]
    }
  ]
};


relations[TOKENIZATION][ACH] = {
  fields: [
    'accountNumber',
    'postalCode',
    'verifyAccountNumber'
  ],
  defaultValues: {},
  oneOf: [
    { required: [ 'accountNumber' ] },
  ],
  relatedFieldsRules: [
    {
      config: 'gatewayConfiguration.merchant.processorAch.name',
      value: 'CHC',
      dependencies: {}
    }
  ],
};

relations[TOKENIZATION][GIFT_CARD] = {
  fields: [
    'accountNumber',
    'postalCode'
  ],
  oneOf: [
    { required: [ 'accountNumber' ] }
  ]
};

module.exports = relations;

},{"./constants":24}],28:[function(_dereq_,module,exports){
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

},{"./once":44}],29:[function(_dereq_,module,exports){
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

},{"../is-whitelisted-domain":42}],30:[function(_dereq_,module,exports){
'use strict';

var enumerate = _dereq_('../enumerate');

module.exports = enumerate([
  'CONFIGURATION_REQUEST'
], 'bus:');

},{"../enumerate":37}],31:[function(_dereq_,module,exports){
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

},{"../seamlesspay-error":46,"./check-origin":29,"./events":30,"framebus":16}],32:[function(_dereq_,module,exports){
'use strict';

function _classesOf(element) {
  return element.className.trim().split(/\s+/);
}

function add(element) {
  var toAdd = Array.prototype.slice.call(arguments, 1);
  var className = _classesOf(element).filter(function (classname) {
    return toAdd.indexOf(classname) === -1;
  }).concat(toAdd).join(' ');

  element.className = className;
}

function remove(element) {
  var toRemove = Array.prototype.slice.call(arguments, 1);
  var className = _classesOf(element).filter(function (classname) {
    return toRemove.indexOf(classname) === -1;
  }).join(' ');

  element.className = className;
}

function toggle(element, classname, adding) {
  if (adding) {
    add(element, classname);
  } else {
    remove(element, classname);
  }
}

module.exports = {
  add: add,
  remove: remove,
  toggle: toggle
};

},{}],33:[function(_dereq_,module,exports){
'use strict';
var constants = _dereq_('../card-element/shared/constants');

module.exports = function composeUrl(config, type, componentId, isDebug) {
  var assetsUrl = config.gatewayConfiguration.assetsUrl;

  if (isDebug) {
    assetsUrl = assetsUrl.replace('https', 'http');
  }
  var min = isDebug ? '' : '.min';

  return assetsUrl + '/' + constants.VERSION + '/html/' + type + '-frame' + min + '.html#' + componentId;
};

},{"../card-element/shared/constants":17}],34:[function(_dereq_,module,exports){
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

},{"./errors":38,"./seamlesspay-error":46}],35:[function(_dereq_,module,exports){
'use strict';

module.exports = function (fn) {
  return function () {
    // IE9 doesn't support passing arguments to setTimeout so we have to emulate it.
    var args = arguments;

    setTimeout(function () {
      fn.apply(null, args);
    }, 1);
  };
};

},{}],36:[function(_dereq_,module,exports){
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

},{"./batch-execute-functions":28}],37:[function(_dereq_,module,exports){
'use strict';

function enumerate(values, prefix) {
  prefix = prefix == null ? '' : prefix;

  return values.reduce(function (enumeration, value) {
    enumeration[value] = prefix + value;
    return enumeration;
  }, {});
}

module.exports = enumerate;

},{}],38:[function(_dereq_,module,exports){
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

},{"./seamlesspay-error":46}],39:[function(_dereq_,module,exports){
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

},{}],40:[function(_dereq_,module,exports){
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

},{}],41:[function(_dereq_,module,exports){
'use strict';

module.exports = function isIos(userAgent) {
  userAgent = userAgent || navigator.userAgent;
  return /(iPad|iPhone|iPod)/i.test(userAgent);
};

},{}],42:[function(_dereq_,module,exports){
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

},{}],43:[function(_dereq_,module,exports){
'use strict';

module.exports = function (obj) {
  return Object.keys(obj).filter(function (key) {
    return typeof obj[key] === 'function';
  });
};

},{}],44:[function(_dereq_,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],45:[function(_dereq_,module,exports){
(function (global){(function (){
'use strict';

var Promise = global.Promise;

module.exports = Promise;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],46:[function(_dereq_,module,exports){
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

},{"./enumerate":37}],47:[function(_dereq_,module,exports){
'use strict';

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : r & 0x3 | 0x8;

    return v.toString(16);
  });
}

module.exports = uuid;

},{}]},{},[22])(22)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvQGJyYWludHJlZS9pZnJhbWVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL0BicmFpbnRyZWUvaWZyYW1lci9saWIvYXNzaWduLmpzIiwibm9kZV9tb2R1bGVzL0BicmFpbnRyZWUvaWZyYW1lci9saWIvZGVmYXVsdC1hdHRyaWJ1dGVzLmpzIiwibm9kZV9tb2R1bGVzL0BicmFpbnRyZWUvaWZyYW1lci9saWIvc2V0LWF0dHJpYnV0ZXMuanMiLCJub2RlX21vZHVsZXMvQGJyYWludHJlZS93cmFwLXByb21pc2UvbGliL2RlZmVycmVkLmpzIiwibm9kZV9tb2R1bGVzL0BicmFpbnRyZWUvd3JhcC1wcm9taXNlL2xpYi9vbmNlLmpzIiwibm9kZV9tb2R1bGVzL0BicmFpbnRyZWUvd3JhcC1wcm9taXNlL2xpYi9wcm9taXNlLW9yLWNhbGxiYWNrLmpzIiwibm9kZV9tb2R1bGVzL0BicmFpbnRyZWUvd3JhcC1wcm9taXNlL3dyYXAtcHJvbWlzZS5qcyIsIm5vZGVfbW9kdWxlcy9jcmVkaXQtY2FyZC10eXBlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2NyZWRpdC1jYXJkLXR5cGUvbGliL2FkZC1tYXRjaGluZy1jYXJkcy10by1yZXN1bHRzLmpzIiwibm9kZV9tb2R1bGVzL2NyZWRpdC1jYXJkLXR5cGUvbGliL2NhcmQtdHlwZXMuanMiLCJub2RlX21vZHVsZXMvY3JlZGl0LWNhcmQtdHlwZS9saWIvY2xvbmUuanMiLCJub2RlX21vZHVsZXMvY3JlZGl0LWNhcmQtdHlwZS9saWIvZmluZC1iZXN0LW1hdGNoLmpzIiwibm9kZV9tb2R1bGVzL2NyZWRpdC1jYXJkLXR5cGUvbGliL2lzLXZhbGlkLWlucHV0LXR5cGUuanMiLCJub2RlX21vZHVsZXMvY3JlZGl0LWNhcmQtdHlwZS9saWIvbWF0Y2hlcy5qcyIsIm5vZGVfbW9kdWxlcy9mcmFtZWJ1cy9saWIvZnJhbWVidXMuanMiLCJzcmMvY2FyZC1lbGVtZW50L3NoYXJlZC9jb25zdGFudHMuanMiLCJzcmMvaG9zdGVkLWZpZWxkcy9leHRlcm5hbC9hdHRyaWJ1dGUtdmFsaWRhdGlvbi1lcnJvci5qcyIsInNyYy9ob3N0ZWQtZmllbGRzL2V4dGVybmFsL2NoZWNrLWludGVncml0eS5qcyIsInNyYy9ob3N0ZWQtZmllbGRzL2V4dGVybmFsL2hvc3RlZC1maWVsZHMuanMiLCJzcmMvaG9zdGVkLWZpZWxkcy9leHRlcm5hbC9yZXNwb25zZS1mb3JtYXR0ZXJzLmpzIiwic3JjL2hvc3RlZC1maWVsZHMvaW5kZXguanMiLCJzcmMvaG9zdGVkLWZpZWxkcy9zaGFyZWQvY29tbW9uLmpzIiwic3JjL2hvc3RlZC1maWVsZHMvc2hhcmVkL2NvbnN0YW50cy5qcyIsInNyYy9ob3N0ZWQtZmllbGRzL3NoYXJlZC9lcnJvcnMuanMiLCJzcmMvaG9zdGVkLWZpZWxkcy9zaGFyZWQvZmluZC1wYXJlbnQtdGFncy5qcyIsInNyYy9ob3N0ZWQtZmllbGRzL3NoYXJlZC9wYXltZW50LWZpZWxkcy1yZWxhdGlvbnMuanMiLCJzcmMvbGliL2JhdGNoLWV4ZWN1dGUtZnVuY3Rpb25zLmpzIiwic3JjL2xpYi9idXMvY2hlY2stb3JpZ2luLmpzIiwic3JjL2xpYi9idXMvZXZlbnRzLmpzIiwic3JjL2xpYi9idXMvaW5kZXguanMiLCJzcmMvbGliL2NsYXNzbGlzdC5qcyIsInNyYy9saWIvY29tcG9zZS11cmwuanMiLCJzcmMvbGliL2NvbnZlcnQtbWV0aG9kcy10by1lcnJvci5qcyIsInNyYy9saWIvZGVmZXJyZWQuanMiLCJzcmMvbGliL2Rlc3RydWN0b3IuanMiLCJzcmMvbGliL2VudW1lcmF0ZS5qcyIsInNyYy9saWIvZXJyb3JzLmpzIiwic3JjL2xpYi9ldmVudC1lbWl0dGVyLmpzIiwic3JjL2xpYi9pbmplY3QtZnJhbWUuanMiLCJzcmMvbGliL2lzLWlvcy5qcyIsInNyYy9saWIvaXMtd2hpdGVsaXN0ZWQtZG9tYWluLmpzIiwic3JjL2xpYi9tZXRob2RzLmpzIiwic3JjL2xpYi9wcm9taXNlLmpzIiwic3JjL2xpYi9zZWFtbGVzc3BheS1lcnJvci5qcyIsInNyYy9saWIvdXVpZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDdFRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzZ0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9OQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgc2V0QXR0cmlidXRlcyA9IHJlcXVpcmUoJy4vbGliL3NldC1hdHRyaWJ1dGVzJyk7XG52YXIgZGVmYXVsdEF0dHJpYnV0ZXMgPSByZXF1aXJlKCcuL2xpYi9kZWZhdWx0LWF0dHJpYnV0ZXMnKTtcbnZhciBhc3NpZ24gPSByZXF1aXJlKCcuL2xpYi9hc3NpZ24nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVGcmFtZShvcHRpb25zKSB7XG4gIHZhciBpZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtcbiAgdmFyIGNvbmZpZyA9IGFzc2lnbih7fSwgZGVmYXVsdEF0dHJpYnV0ZXMsIG9wdGlvbnMpO1xuXG4gIGlmIChjb25maWcuc3R5bGUgJiYgdHlwZW9mIGNvbmZpZy5zdHlsZSAhPT0gJ3N0cmluZycpIHtcbiAgICBhc3NpZ24oaWZyYW1lLnN0eWxlLCBjb25maWcuc3R5bGUpO1xuICAgIGRlbGV0ZSBjb25maWcuc3R5bGU7XG4gIH1cblxuICBzZXRBdHRyaWJ1dGVzKGlmcmFtZSwgY29uZmlnKTtcblxuICBpZiAoIWlmcmFtZS5nZXRBdHRyaWJ1dGUoJ2lkJykpIHtcbiAgICBpZnJhbWUuaWQgPSBpZnJhbWUubmFtZTtcbiAgfVxuXG4gIHJldHVybiBpZnJhbWU7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGFzc2lnbih0YXJnZXQpIHtcbiAgdmFyIG9ianMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG4gIG9ianMuZm9yRWFjaChmdW5jdGlvbiAob2JqKSB7XG4gICAgaWYgKHR5cGVvZiBvYmogIT09ICdvYmplY3QnKSB7IHJldHVybjsgfVxuXG4gICAgT2JqZWN0LmtleXMob2JqKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHRhcmdldFtrZXldID0gb2JqW2tleV07XG4gICAgfSk7XG4gIH0pO1xuXG4gIHJldHVybiB0YXJnZXQ7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzcmM6ICdhYm91dDpibGFuaycsXG4gIGZyYW1lQm9yZGVyOiAwLFxuICBhbGxvd3RyYW5zcGFyZW5jeTogdHJ1ZSxcbiAgc2Nyb2xsaW5nOiAnbm8nXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNldEF0dHJpYnV0ZXMoZWxlbWVudCwgYXR0cmlidXRlcykge1xuICB2YXIgdmFsdWU7XG5cbiAgZm9yICh2YXIga2V5IGluIGF0dHJpYnV0ZXMpIHtcbiAgICBpZiAoYXR0cmlidXRlcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICB2YWx1ZSA9IGF0dHJpYnV0ZXNba2V5XTtcblxuICAgICAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICAgICAgZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoa2V5KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKGtleSwgdmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gZGVmZXJyZWQoZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAvLyBJRTkgZG9lc24ndCBzdXBwb3J0IHBhc3NpbmcgYXJndW1lbnRzIHRvIHNldFRpbWVvdXQgc28gd2UgaGF2ZSB0byBlbXVsYXRlIGl0LlxuICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBmbi5hcHBseShudWxsLCBhcmdzKTtcbiAgICB9LCAxKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkZWZlcnJlZDtcbiIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gb25jZShmbikge1xuICB2YXIgY2FsbGVkID0gZmFsc2U7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIWNhbGxlZCkge1xuICAgICAgY2FsbGVkID0gdHJ1ZTtcbiAgICAgIGZuLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG9uY2U7XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIHByb21pc2VPckNhbGxiYWNrKHByb21pc2UsIGNhbGxiYWNrKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgY29uc2lzdGVudC1yZXR1cm5cbiAgaWYgKGNhbGxiYWNrKSB7XG4gICAgcHJvbWlzZVxuICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgZGF0YSk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcHJvbWlzZU9yQ2FsbGJhY2s7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBkZWZlcnJlZCA9IHJlcXVpcmUoJy4vbGliL2RlZmVycmVkJyk7XG52YXIgb25jZSA9IHJlcXVpcmUoJy4vbGliL29uY2UnKTtcbnZhciBwcm9taXNlT3JDYWxsYmFjayA9IHJlcXVpcmUoJy4vbGliL3Byb21pc2Utb3ItY2FsbGJhY2snKTtcblxuZnVuY3Rpb24gd3JhcFByb21pc2UoZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2FsbGJhY2s7XG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgIHZhciBsYXN0QXJnID0gYXJnc1thcmdzLmxlbmd0aCAtIDFdO1xuXG4gICAgaWYgKHR5cGVvZiBsYXN0QXJnID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjYWxsYmFjayA9IGFyZ3MucG9wKCk7XG4gICAgICBjYWxsYmFjayA9IG9uY2UoZGVmZXJyZWQoY2FsbGJhY2spKTtcbiAgICB9XG4gICAgcmV0dXJuIHByb21pc2VPckNhbGxiYWNrKGZuLmFwcGx5KHRoaXMsIGFyZ3MpLCBjYWxsYmFjayk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8taW52YWxpZC10aGlzXG4gIH07XG59XG5cbndyYXBQcm9taXNlLndyYXBQcm90b3R5cGUgPSBmdW5jdGlvbiAodGFyZ2V0LCBvcHRpb25zKSB7XG4gIHZhciBtZXRob2RzLCBpZ25vcmVNZXRob2RzLCBpbmNsdWRlUHJpdmF0ZU1ldGhvZHM7XG5cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGlnbm9yZU1ldGhvZHMgPSBvcHRpb25zLmlnbm9yZU1ldGhvZHMgfHwgW107XG4gIGluY2x1ZGVQcml2YXRlTWV0aG9kcyA9IG9wdGlvbnMudHJhbnNmb3JtUHJpdmF0ZU1ldGhvZHMgPT09IHRydWU7XG5cbiAgbWV0aG9kcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRhcmdldC5wcm90b3R5cGUpLmZpbHRlcihmdW5jdGlvbiAobWV0aG9kKSB7XG4gICAgdmFyIGlzTm90UHJpdmF0ZU1ldGhvZDtcbiAgICB2YXIgaXNOb25Db25zdHJ1Y3RvckZ1bmN0aW9uID0gbWV0aG9kICE9PSAnY29uc3RydWN0b3InICYmXG4gICAgICB0eXBlb2YgdGFyZ2V0LnByb3RvdHlwZVttZXRob2RdID09PSAnZnVuY3Rpb24nO1xuICAgIHZhciBpc05vdEFuSWdub3JlZE1ldGhvZCA9IGlnbm9yZU1ldGhvZHMuaW5kZXhPZihtZXRob2QpID09PSAtMTtcblxuICAgIGlmIChpbmNsdWRlUHJpdmF0ZU1ldGhvZHMpIHtcbiAgICAgIGlzTm90UHJpdmF0ZU1ldGhvZCA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlzTm90UHJpdmF0ZU1ldGhvZCA9IG1ldGhvZC5jaGFyQXQoMCkgIT09ICdfJztcbiAgICB9XG5cbiAgICByZXR1cm4gaXNOb25Db25zdHJ1Y3RvckZ1bmN0aW9uICYmXG4gICAgICBpc05vdFByaXZhdGVNZXRob2QgJiZcbiAgICAgIGlzTm90QW5JZ25vcmVkTWV0aG9kO1xuICB9KTtcblxuICBtZXRob2RzLmZvckVhY2goZnVuY3Rpb24gKG1ldGhvZCkge1xuICAgIHZhciBvcmlnaW5hbCA9IHRhcmdldC5wcm90b3R5cGVbbWV0aG9kXTtcblxuICAgIHRhcmdldC5wcm90b3R5cGVbbWV0aG9kXSA9IHdyYXBQcm9taXNlKG9yaWdpbmFsKTtcbiAgfSk7XG5cbiAgcmV0dXJuIHRhcmdldDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gd3JhcFByb21pc2U7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB0eXBlcyA9IHJlcXVpcmUoJy4vbGliL2NhcmQtdHlwZXMnKTtcbnZhciBjbG9uZSA9IHJlcXVpcmUoJy4vbGliL2Nsb25lJyk7XG52YXIgZmluZEJlc3RNYXRjaCA9IHJlcXVpcmUoJy4vbGliL2ZpbmQtYmVzdC1tYXRjaCcpO1xudmFyIGlzVmFsaWRJbnB1dFR5cGUgPSByZXF1aXJlKCcuL2xpYi9pcy12YWxpZC1pbnB1dC10eXBlJyk7XG52YXIgYWRkTWF0Y2hpbmdDYXJkc1RvUmVzdWx0cyA9IHJlcXVpcmUoJy4vbGliL2FkZC1tYXRjaGluZy1jYXJkcy10by1yZXN1bHRzJyk7XG5cbnZhciB0ZXN0T3JkZXI7XG52YXIgY3VzdG9tQ2FyZHMgPSB7fTtcblxudmFyIGNhcmROYW1lcyA9IHtcbiAgVklTQTogJ3Zpc2EnLFxuICBNQVNURVJDQVJEOiAnbWFzdGVyY2FyZCcsXG4gIEFNRVJJQ0FOX0VYUFJFU1M6ICdhbWVyaWNhbi1leHByZXNzJyxcbiAgRElORVJTX0NMVUI6ICdkaW5lcnMtY2x1YicsXG4gIERJU0NPVkVSOiAnZGlzY292ZXInLFxuICBKQ0I6ICdqY2InLFxuICBVTklPTlBBWTogJ3VuaW9ucGF5JyxcbiAgTUFFU1RSTzogJ21hZXN0cm8nLFxuICBFTE86ICdlbG8nLFxuICBNSVI6ICdtaXInLFxuICBISVBFUjogJ2hpcGVyJyxcbiAgSElQRVJDQVJEOiAnaGlwZXJjYXJkJ1xufTtcblxudmFyIE9SSUdJTkFMX1RFU1RfT1JERVIgPSBbXG4gIGNhcmROYW1lcy5WSVNBLFxuICBjYXJkTmFtZXMuTUFTVEVSQ0FSRCxcbiAgY2FyZE5hbWVzLkFNRVJJQ0FOX0VYUFJFU1MsXG4gIGNhcmROYW1lcy5ESU5FUlNfQ0xVQixcbiAgY2FyZE5hbWVzLkRJU0NPVkVSLFxuICBjYXJkTmFtZXMuSkNCLFxuICBjYXJkTmFtZXMuVU5JT05QQVksXG4gIGNhcmROYW1lcy5NQUVTVFJPLFxuICBjYXJkTmFtZXMuRUxPLFxuICBjYXJkTmFtZXMuTUlSLFxuICBjYXJkTmFtZXMuSElQRVIsXG4gIGNhcmROYW1lcy5ISVBFUkNBUkRcbl07XG5cbnRlc3RPcmRlciA9IGNsb25lKE9SSUdJTkFMX1RFU1RfT1JERVIpO1xuXG5mdW5jdGlvbiBmaW5kVHlwZSh0eXBlKSB7XG4gIHJldHVybiBjdXN0b21DYXJkc1t0eXBlXSB8fCB0eXBlc1t0eXBlXTtcbn1cblxuZnVuY3Rpb24gZ2V0QWxsQ2FyZFR5cGVzKCkge1xuICByZXR1cm4gdGVzdE9yZGVyLm1hcChmdW5jdGlvbiAodHlwZSkge1xuICAgIHJldHVybiBjbG9uZShmaW5kVHlwZSh0eXBlKSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBnZXRDYXJkUG9zaXRpb24obmFtZSwgaWdub3JlRXJyb3JGb3JOb3RFeGlzdGluZykge1xuICB2YXIgcG9zaXRpb24gPSB0ZXN0T3JkZXIuaW5kZXhPZihuYW1lKTtcblxuICBpZiAoIWlnbm9yZUVycm9yRm9yTm90RXhpc3RpbmcgJiYgcG9zaXRpb24gPT09IC0xKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdcIicgKyBuYW1lICsgJ1wiIGlzIG5vdCBhIHN1cHBvcnRlZCBjYXJkIHR5cGUuJyk7XG4gIH1cblxuICByZXR1cm4gcG9zaXRpb247XG59XG5cbmZ1bmN0aW9uIGNyZWRpdENhcmRUeXBlKGNhcmROdW1iZXIpIHtcbiAgdmFyIGJlc3RNYXRjaDtcbiAgdmFyIHJlc3VsdHMgPSBbXTtcblxuICBpZiAoIWlzVmFsaWRJbnB1dFR5cGUoY2FyZE51bWJlcikpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBpZiAoY2FyZE51bWJlci5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gZ2V0QWxsQ2FyZFR5cGVzKHRlc3RPcmRlcik7XG4gIH1cblxuICB0ZXN0T3JkZXIuZm9yRWFjaChmdW5jdGlvbiAodHlwZSkge1xuICAgIHZhciBjYXJkQ29uZmlndXJhdGlvbiA9IGZpbmRUeXBlKHR5cGUpO1xuXG4gICAgYWRkTWF0Y2hpbmdDYXJkc1RvUmVzdWx0cyhjYXJkTnVtYmVyLCBjYXJkQ29uZmlndXJhdGlvbiwgcmVzdWx0cyk7XG4gIH0pO1xuXG4gIGJlc3RNYXRjaCA9IGZpbmRCZXN0TWF0Y2gocmVzdWx0cyk7XG5cbiAgaWYgKGJlc3RNYXRjaCkge1xuICAgIHJldHVybiBbYmVzdE1hdGNoXTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHRzO1xufVxuXG5jcmVkaXRDYXJkVHlwZS5nZXRUeXBlSW5mbyA9IGZ1bmN0aW9uICh0eXBlKSB7XG4gIHJldHVybiBjbG9uZShmaW5kVHlwZSh0eXBlKSk7XG59O1xuXG5jcmVkaXRDYXJkVHlwZS5yZW1vdmVDYXJkID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgdmFyIHBvc2l0aW9uID0gZ2V0Q2FyZFBvc2l0aW9uKG5hbWUpO1xuXG4gIHRlc3RPcmRlci5zcGxpY2UocG9zaXRpb24sIDEpO1xufTtcblxuY3JlZGl0Q2FyZFR5cGUuYWRkQ2FyZCA9IGZ1bmN0aW9uIChjb25maWcpIHtcbiAgdmFyIGV4aXN0aW5nQ2FyZFBvc2l0aW9uID0gZ2V0Q2FyZFBvc2l0aW9uKGNvbmZpZy50eXBlLCB0cnVlKTtcblxuICBjdXN0b21DYXJkc1tjb25maWcudHlwZV0gPSBjb25maWc7XG5cbiAgaWYgKGV4aXN0aW5nQ2FyZFBvc2l0aW9uID09PSAtMSkge1xuICAgIHRlc3RPcmRlci5wdXNoKGNvbmZpZy50eXBlKTtcbiAgfVxufTtcblxuY3JlZGl0Q2FyZFR5cGUudXBkYXRlQ2FyZCA9IGZ1bmN0aW9uIChjYXJkVHlwZSwgdXBkYXRlcykge1xuICB2YXIgY2xvbmVkQ2FyZDtcbiAgdmFyIG9yaWdpbmFsT2JqZWN0ID0gY3VzdG9tQ2FyZHNbY2FyZFR5cGVdIHx8IHR5cGVzW2NhcmRUeXBlXTtcblxuICBpZiAoIW9yaWdpbmFsT2JqZWN0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdcIicgKyBjYXJkVHlwZSArICdcIiBpcyBub3QgYSByZWNvZ25pemVkIHR5cGUuIFVzZSBgYWRkQ2FyZGAgaW5zdGVhZC4nKTtcbiAgfVxuXG4gIGlmICh1cGRhdGVzLnR5cGUgJiYgb3JpZ2luYWxPYmplY3QudHlwZSAhPT0gdXBkYXRlcy50eXBlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3Qgb3ZlcndyaXRlIHR5cGUgcGFyYW1ldGVyLicpO1xuICB9XG5cbiAgY2xvbmVkQ2FyZCA9IGNsb25lKG9yaWdpbmFsT2JqZWN0LCB0cnVlKTtcblxuICBPYmplY3Qua2V5cyhjbG9uZWRDYXJkKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICBpZiAodXBkYXRlc1trZXldKSB7XG4gICAgICBjbG9uZWRDYXJkW2tleV0gPSB1cGRhdGVzW2tleV07XG4gICAgfVxuICB9KTtcblxuICBjdXN0b21DYXJkc1tjbG9uZWRDYXJkLnR5cGVdID0gY2xvbmVkQ2FyZDtcbn07XG5cbmNyZWRpdENhcmRUeXBlLmNoYW5nZU9yZGVyID0gZnVuY3Rpb24gKG5hbWUsIHBvc2l0aW9uKSB7XG4gIHZhciBjdXJyZW50UG9zaXRpb24gPSBnZXRDYXJkUG9zaXRpb24obmFtZSk7XG5cbiAgdGVzdE9yZGVyLnNwbGljZShjdXJyZW50UG9zaXRpb24sIDEpO1xuICB0ZXN0T3JkZXIuc3BsaWNlKHBvc2l0aW9uLCAwLCBuYW1lKTtcbn07XG5cbmNyZWRpdENhcmRUeXBlLnJlc2V0TW9kaWZpY2F0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgdGVzdE9yZGVyID0gY2xvbmUoT1JJR0lOQUxfVEVTVF9PUkRFUik7XG4gIGN1c3RvbUNhcmRzID0ge307XG59O1xuXG5jcmVkaXRDYXJkVHlwZS50eXBlcyA9IGNhcmROYW1lcztcblxubW9kdWxlLmV4cG9ydHMgPSBjcmVkaXRDYXJkVHlwZTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNsb25lID0gcmVxdWlyZSgnLi9jbG9uZScpO1xudmFyIG1hdGNoZXMgPSByZXF1aXJlKCcuL21hdGNoZXMnKTtcblxuZnVuY3Rpb24gYWRkTWF0Y2hpbmdDYXJkc1RvUmVzdWx0cyhjYXJkTnVtYmVyLCBjYXJkQ29uZmlndXJhdGlvbiwgcmVzdWx0cykge1xuICB2YXIgaSwgcGF0dGVybiwgcGF0dGVybkxlbmd0aCwgY2xvbmVkQ2FyZENvbmZpZ3VyYXRpb247XG5cbiAgZm9yIChpID0gMDsgaSA8IGNhcmRDb25maWd1cmF0aW9uLnBhdHRlcm5zLmxlbmd0aDsgaSsrKSB7XG4gICAgcGF0dGVybiA9IGNhcmRDb25maWd1cmF0aW9uLnBhdHRlcm5zW2ldO1xuXG4gICAgaWYgKCFtYXRjaGVzKGNhcmROdW1iZXIsIHBhdHRlcm4pKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBjbG9uZWRDYXJkQ29uZmlndXJhdGlvbiA9IGNsb25lKGNhcmRDb25maWd1cmF0aW9uKTtcblxuICAgIGlmIChBcnJheS5pc0FycmF5KHBhdHRlcm4pKSB7XG4gICAgICBwYXR0ZXJuTGVuZ3RoID0gU3RyaW5nKHBhdHRlcm5bMF0pLmxlbmd0aDtcbiAgICB9IGVsc2Uge1xuICAgICAgcGF0dGVybkxlbmd0aCA9IFN0cmluZyhwYXR0ZXJuKS5sZW5ndGg7XG4gICAgfVxuXG4gICAgaWYgKGNhcmROdW1iZXIubGVuZ3RoID49IHBhdHRlcm5MZW5ndGgpIHtcbiAgICAgIGNsb25lZENhcmRDb25maWd1cmF0aW9uLm1hdGNoU3RyZW5ndGggPSBwYXR0ZXJuTGVuZ3RoO1xuICAgIH1cblxuICAgIHJlc3VsdHMucHVzaChjbG9uZWRDYXJkQ29uZmlndXJhdGlvbik7XG4gICAgYnJlYWs7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhZGRNYXRjaGluZ0NhcmRzVG9SZXN1bHRzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2FyZFR5cGVzID0ge1xuICB2aXNhOiB7XG4gICAgbmljZVR5cGU6ICdWaXNhJyxcbiAgICB0eXBlOiAndmlzYScsXG4gICAgcGF0dGVybnM6IFtcbiAgICAgIDRcbiAgICBdLFxuICAgIGdhcHM6IFs0LCA4LCAxMl0sXG4gICAgbGVuZ3RoczogWzE2LCAxOCwgMTldLFxuICAgIGNvZGU6IHtcbiAgICAgIG5hbWU6ICdDVlYnLFxuICAgICAgc2l6ZTogM1xuICAgIH1cbiAgfSxcbiAgbWFzdGVyY2FyZDoge1xuICAgIG5pY2VUeXBlOiAnTWFzdGVyY2FyZCcsXG4gICAgdHlwZTogJ21hc3RlcmNhcmQnLFxuICAgIHBhdHRlcm5zOiBbXG4gICAgICBbNTEsIDU1XSxcbiAgICAgIFsyMjIxLCAyMjI5XSxcbiAgICAgIFsyMjMsIDIyOV0sXG4gICAgICBbMjMsIDI2XSxcbiAgICAgIFsyNzAsIDI3MV0sXG4gICAgICAyNzIwXG4gICAgXSxcbiAgICBnYXBzOiBbNCwgOCwgMTJdLFxuICAgIGxlbmd0aHM6IFsxNl0sXG4gICAgY29kZToge1xuICAgICAgbmFtZTogJ0NWQycsXG4gICAgICBzaXplOiAzXG4gICAgfVxuICB9LFxuICAnYW1lcmljYW4tZXhwcmVzcyc6IHtcbiAgICBuaWNlVHlwZTogJ0FtZXJpY2FuIEV4cHJlc3MnLFxuICAgIHR5cGU6ICdhbWVyaWNhbi1leHByZXNzJyxcbiAgICBwYXR0ZXJuczogW1xuICAgICAgMzQsXG4gICAgICAzN1xuICAgIF0sXG4gICAgZ2FwczogWzQsIDEwXSxcbiAgICBsZW5ndGhzOiBbMTVdLFxuICAgIGNvZGU6IHtcbiAgICAgIG5hbWU6ICdDSUQnLFxuICAgICAgc2l6ZTogNFxuICAgIH1cbiAgfSxcbiAgJ2RpbmVycy1jbHViJzoge1xuICAgIG5pY2VUeXBlOiAnRGluZXJzIENsdWInLFxuICAgIHR5cGU6ICdkaW5lcnMtY2x1YicsXG4gICAgcGF0dGVybnM6IFtcbiAgICAgIFszMDAsIDMwNV0sXG4gICAgICAzNixcbiAgICAgIDM4LFxuICAgICAgMzlcbiAgICBdLFxuICAgIGdhcHM6IFs0LCAxMF0sXG4gICAgbGVuZ3RoczogWzE0LCAxNiwgMTldLFxuICAgIGNvZGU6IHtcbiAgICAgIG5hbWU6ICdDVlYnLFxuICAgICAgc2l6ZTogM1xuICAgIH1cbiAgfSxcbiAgZGlzY292ZXI6IHtcbiAgICBuaWNlVHlwZTogJ0Rpc2NvdmVyJyxcbiAgICB0eXBlOiAnZGlzY292ZXInLFxuICAgIHBhdHRlcm5zOiBbXG4gICAgICA2MDExLFxuICAgICAgWzY0NCwgNjQ5XSxcbiAgICAgIDY1XG4gICAgXSxcbiAgICBnYXBzOiBbNCwgOCwgMTJdLFxuICAgIGxlbmd0aHM6IFsxNiwgMTldLFxuICAgIGNvZGU6IHtcbiAgICAgIG5hbWU6ICdDSUQnLFxuICAgICAgc2l6ZTogM1xuICAgIH1cbiAgfSxcbiAgamNiOiB7XG4gICAgbmljZVR5cGU6ICdKQ0InLFxuICAgIHR5cGU6ICdqY2InLFxuICAgIHBhdHRlcm5zOiBbXG4gICAgICAyMTMxLFxuICAgICAgMTgwMCxcbiAgICAgIFszNTI4LCAzNTg5XVxuICAgIF0sXG4gICAgZ2FwczogWzQsIDgsIDEyXSxcbiAgICBsZW5ndGhzOiBbMTYsIDE3LCAxOCwgMTldLFxuICAgIGNvZGU6IHtcbiAgICAgIG5hbWU6ICdDVlYnLFxuICAgICAgc2l6ZTogM1xuICAgIH1cbiAgfSxcbiAgdW5pb25wYXk6IHtcbiAgICBuaWNlVHlwZTogJ1VuaW9uUGF5JyxcbiAgICB0eXBlOiAndW5pb25wYXknLFxuICAgIHBhdHRlcm5zOiBbXG4gICAgICA2MjAsXG4gICAgICBbNjI0LCA2MjZdLFxuICAgICAgWzYyMTAwLCA2MjE4Ml0sXG4gICAgICBbNjIxODQsIDYyMTg3XSxcbiAgICAgIFs2MjE4NSwgNjIxOTddLFxuICAgICAgWzYyMjAwLCA2MjIwNV0sXG4gICAgICBbNjIyMDEwLCA2MjI5OTldLFxuICAgICAgNjIyMDE4LFxuICAgICAgWzYyMjAxOSwgNjIyOTk5XSxcbiAgICAgIFs2MjIwNywgNjIyMDldLFxuICAgICAgWzYyMjEyNiwgNjIyOTI1XSxcbiAgICAgIFs2MjMsIDYyNl0sXG4gICAgICA2MjcwLFxuICAgICAgNjI3MixcbiAgICAgIDYyNzYsXG4gICAgICBbNjI3NzAwLCA2Mjc3NzldLFxuICAgICAgWzYyNzc4MSwgNjI3Nzk5XSxcbiAgICAgIFs2MjgyLCA2Mjg5XSxcbiAgICAgIDYyOTEsXG4gICAgICA2MjkyLFxuICAgICAgODEwLFxuICAgICAgWzgxMTAsIDgxMzFdLFxuICAgICAgWzgxMzIsIDgxNTFdLFxuICAgICAgWzgxNTIsIDgxNjNdLFxuICAgICAgWzgxNjQsIDgxNzFdXG4gICAgXSxcbiAgICBnYXBzOiBbNCwgOCwgMTJdLFxuICAgIGxlbmd0aHM6IFsxNCwgMTUsIDE2LCAxNywgMTgsIDE5XSxcbiAgICBjb2RlOiB7XG4gICAgICBuYW1lOiAnQ1ZOJyxcbiAgICAgIHNpemU6IDNcbiAgICB9XG4gIH0sXG4gIG1hZXN0cm86IHtcbiAgICBuaWNlVHlwZTogJ01hZXN0cm8nLFxuICAgIHR5cGU6ICdtYWVzdHJvJyxcbiAgICBwYXR0ZXJuczogW1xuICAgICAgNDkzNjk4LFxuICAgICAgWzUwMDAwMCwgNTA2Njk4XSxcbiAgICAgIFs1MDY3NzksIDUwODk5OV0sXG4gICAgICBbNTYsIDU5XSxcbiAgICAgIDYzLFxuICAgICAgNjcsXG4gICAgICA2XG4gICAgXSxcbiAgICBnYXBzOiBbNCwgOCwgMTJdLFxuICAgIGxlbmd0aHM6IFsxMiwgMTMsIDE0LCAxNSwgMTYsIDE3LCAxOCwgMTldLFxuICAgIGNvZGU6IHtcbiAgICAgIG5hbWU6ICdDVkMnLFxuICAgICAgc2l6ZTogM1xuICAgIH1cbiAgfSxcbiAgZWxvOiB7XG4gICAgbmljZVR5cGU6ICdFbG8nLFxuICAgIHR5cGU6ICdlbG8nLFxuICAgIHBhdHRlcm5zOiBbXG4gICAgICA0MDExNzgsXG4gICAgICA0MDExNzksXG4gICAgICA0Mzg5MzUsXG4gICAgICA0NTc2MzEsXG4gICAgICA0NTc2MzIsXG4gICAgICA0MzEyNzQsXG4gICAgICA0NTE0MTYsXG4gICAgICA0NTczOTMsXG4gICAgICA1MDQxNzUsXG4gICAgICBbNTA2Njk5LCA1MDY3NzhdLFxuICAgICAgWzUwOTAwMCwgNTA5OTk5XSxcbiAgICAgIDYyNzc4MCxcbiAgICAgIDYzNjI5NyxcbiAgICAgIDYzNjM2OCxcbiAgICAgIFs2NTAwMzEsIDY1MDAzM10sXG4gICAgICBbNjUwMDM1LCA2NTAwNTFdLFxuICAgICAgWzY1MDQwNSwgNjUwNDM5XSxcbiAgICAgIFs2NTA0ODUsIDY1MDUzOF0sXG4gICAgICBbNjUwNTQxLCA2NTA1OThdLFxuICAgICAgWzY1MDcwMCwgNjUwNzE4XSxcbiAgICAgIFs2NTA3MjAsIDY1MDcyN10sXG4gICAgICBbNjUwOTAxLCA2NTA5NzhdLFxuICAgICAgWzY1MTY1MiwgNjUxNjc5XSxcbiAgICAgIFs2NTUwMDAsIDY1NTAxOV0sXG4gICAgICBbNjU1MDIxLCA2NTUwNThdXG4gICAgXSxcbiAgICBnYXBzOiBbNCwgOCwgMTJdLFxuICAgIGxlbmd0aHM6IFsxNl0sXG4gICAgY29kZToge1xuICAgICAgbmFtZTogJ0NWRScsXG4gICAgICBzaXplOiAzXG4gICAgfVxuICB9LFxuICBtaXI6IHtcbiAgICBuaWNlVHlwZTogJ01pcicsXG4gICAgdHlwZTogJ21pcicsXG4gICAgcGF0dGVybnM6IFtcbiAgICAgIFsyMjAwLCAyMjA0XVxuICAgIF0sXG4gICAgZ2FwczogWzQsIDgsIDEyXSxcbiAgICBsZW5ndGhzOiBbMTYsIDE3LCAxOCwgMTldLFxuICAgIGNvZGU6IHtcbiAgICAgIG5hbWU6ICdDVlAyJyxcbiAgICAgIHNpemU6IDNcbiAgICB9XG4gIH0sXG4gIGhpcGVyOiB7XG4gICAgbmljZVR5cGU6ICdIaXBlcicsXG4gICAgdHlwZTogJ2hpcGVyJyxcbiAgICBwYXR0ZXJuczogW1xuICAgICAgNjM3MDk1LFxuICAgICAgNjM3NTY4LFxuICAgICAgNjM3NTk5LFxuICAgICAgNjM3NjA5LFxuICAgICAgNjM3NjEyXG4gICAgXSxcbiAgICBnYXBzOiBbNCwgOCwgMTJdLFxuICAgIGxlbmd0aHM6IFsxNl0sXG4gICAgY29kZToge1xuICAgICAgbmFtZTogJ0NWQycsXG4gICAgICBzaXplOiAzXG4gICAgfVxuICB9LFxuICBoaXBlcmNhcmQ6IHtcbiAgICBuaWNlVHlwZTogJ0hpcGVyY2FyZCcsXG4gICAgdHlwZTogJ2hpcGVyY2FyZCcsXG4gICAgcGF0dGVybnM6IFtcbiAgICAgIDYwNjI4MlxuICAgIF0sXG4gICAgZ2FwczogWzQsIDgsIDEyXSxcbiAgICBsZW5ndGhzOiBbMTZdLFxuICAgIGNvZGU6IHtcbiAgICAgIG5hbWU6ICdDVkMnLFxuICAgICAgc2l6ZTogM1xuICAgIH1cbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBjYXJkVHlwZXM7XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIGNsb25lKG9yaWdpbmFsT2JqZWN0KSB7XG4gIHZhciBkdXBlO1xuXG4gIGlmICghb3JpZ2luYWxPYmplY3QpIHsgcmV0dXJuIG51bGw7IH1cblxuICBkdXBlID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvcmlnaW5hbE9iamVjdCkpO1xuXG4gIHJldHVybiBkdXBlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBoYXNFbm91Z2hSZXN1bHRzVG9EZXRlcm1pbmVCZXN0TWF0Y2gocmVzdWx0cykge1xuICB2YXIgbnVtYmVyT2ZSZXN1bHRzV2l0aE1heFN0cmVuZ3RoUHJvcGVydHkgPSByZXN1bHRzLmZpbHRlcihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgcmV0dXJuIHJlc3VsdC5tYXRjaFN0cmVuZ3RoO1xuICB9KS5sZW5ndGg7XG5cbiAgLy8gaWYgYWxsIHBvc3NpYmxlIHJlc3VsdHMgaGF2ZSBhIG1heFN0cmVuZ3RoIHByb3BlcnR5XG4gIC8vIHRoYXQgbWVhbnMgdGhlIGNhcmQgbnVtYmVyIGlzIHN1ZmZpY2llbnRseSBsb25nXG4gIC8vIGVub3VnaCB0byBkZXRlcm1pbmUgY29uY2x1c2l2ZWx5IHdoYXQgdGhlIHR5cGUgaXNcbiAgcmV0dXJuIG51bWJlck9mUmVzdWx0c1dpdGhNYXhTdHJlbmd0aFByb3BlcnR5ID4gMCAmJlxuICAgIG51bWJlck9mUmVzdWx0c1dpdGhNYXhTdHJlbmd0aFByb3BlcnR5ID09PSByZXN1bHRzLmxlbmd0aDtcbn1cblxuZnVuY3Rpb24gZmluZEJlc3RNYXRjaChyZXN1bHRzKSB7XG4gIGlmICghaGFzRW5vdWdoUmVzdWx0c1RvRGV0ZXJtaW5lQmVzdE1hdGNoKHJlc3VsdHMpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdHMucmVkdWNlKGZ1bmN0aW9uIChiZXN0TWF0Y2gsIHJlc3VsdCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGNvbnNpc3RlbnQtcmV0dXJuXG4gICAgaWYgKCFiZXN0TWF0Y2gpIHtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLy8gaWYgdGhlIGN1cnJlbnQgYmVzdCBtYXRjaCBwYXR0ZXJuIGlzIGxlc3Mgc3BlY2lmaWNcbiAgICAvLyB0aGFuIHRoaXMgcmVzdWx0LCBzZXQgdGhlIHJlc3VsdCBhcyB0aGUgbmV3IGJlc3QgbWF0Y2hcbiAgICBpZiAoYmVzdE1hdGNoLm1hdGNoU3RyZW5ndGggPCByZXN1bHQubWF0Y2hTdHJlbmd0aCkge1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICByZXR1cm4gYmVzdE1hdGNoO1xuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmaW5kQmVzdE1hdGNoO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBpc1ZhbGlkSW5wdXRUeXBlKGNhcmROdW1iZXIpIHtcbiAgcmV0dXJuIHR5cGVvZiBjYXJkTnVtYmVyID09PSAnc3RyaW5nJyB8fCBjYXJkTnVtYmVyIGluc3RhbmNlb2YgU3RyaW5nO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzVmFsaWRJbnB1dFR5cGU7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIEFkYXB0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vcG9sdm8tbGFicy9jYXJkLXR5cGUvYmxvYi9hYWFiMTFmODBmYTE5MzliY2NjOGYyNDkwNWEwNmFlM2NkODY0MzU2L3NyYy9jYXJkVHlwZS5qcyNMMzctTDQyXG5mdW5jdGlvbiBtYXRjaGVzUmFuZ2UoY2FyZE51bWJlciwgbWluLCBtYXgpIHtcbiAgdmFyIG1heExlbmd0aFRvQ2hlY2sgPSBTdHJpbmcobWluKS5sZW5ndGg7XG4gIHZhciBzdWJzdHIgPSBjYXJkTnVtYmVyLnN1YnN0cigwLCBtYXhMZW5ndGhUb0NoZWNrKTtcbiAgdmFyIGludGVnZXJSZXByZXNlbnRhdGlvbk9mQ2FyZE51bWJlciA9IHBhcnNlSW50KHN1YnN0ciwgMTApO1xuXG4gIG1pbiA9IHBhcnNlSW50KFN0cmluZyhtaW4pLnN1YnN0cigwLCBzdWJzdHIubGVuZ3RoKSwgMTApO1xuICBtYXggPSBwYXJzZUludChTdHJpbmcobWF4KS5zdWJzdHIoMCwgc3Vic3RyLmxlbmd0aCksIDEwKTtcblxuICByZXR1cm4gaW50ZWdlclJlcHJlc2VudGF0aW9uT2ZDYXJkTnVtYmVyID49IG1pbiAmJiBpbnRlZ2VyUmVwcmVzZW50YXRpb25PZkNhcmROdW1iZXIgPD0gbWF4O1xufVxuXG5mdW5jdGlvbiBtYXRjaGVzUGF0dGVybihjYXJkTnVtYmVyLCBwYXR0ZXJuKSB7XG4gIHBhdHRlcm4gPSBTdHJpbmcocGF0dGVybik7XG5cbiAgcmV0dXJuIHBhdHRlcm4uc3Vic3RyaW5nKDAsIGNhcmROdW1iZXIubGVuZ3RoKSA9PT0gY2FyZE51bWJlci5zdWJzdHJpbmcoMCwgcGF0dGVybi5sZW5ndGgpO1xufVxuXG5mdW5jdGlvbiBtYXRjaGVzKGNhcmROdW1iZXIsIHBhdHRlcm4pIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkocGF0dGVybikpIHtcbiAgICByZXR1cm4gbWF0Y2hlc1JhbmdlKGNhcmROdW1iZXIsIHBhdHRlcm5bMF0sIHBhdHRlcm5bMV0pO1xuICB9XG5cbiAgcmV0dXJuIG1hdGNoZXNQYXR0ZXJuKGNhcmROdW1iZXIsIHBhdHRlcm4pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hdGNoZXM7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB3aW4sIGZyYW1lYnVzO1xudmFyIHBvcHVwcyA9IFtdO1xudmFyIHN1YnNjcmliZXJzID0ge307XG52YXIgcHJlZml4ID0gJy8qZnJhbWVidXMqLyc7XG5cbmZ1bmN0aW9uIGluY2x1ZGUocG9wdXApIHtcbiAgaWYgKHBvcHVwID09IG51bGwpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIGlmIChwb3B1cC5XaW5kb3cgPT0gbnVsbCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYgKHBvcHVwLmNvbnN0cnVjdG9yICE9PSBwb3B1cC5XaW5kb3cpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgcG9wdXBzLnB1c2gocG9wdXApO1xuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gdGFyZ2V0KG9yaWdpbikge1xuICB2YXIga2V5O1xuICB2YXIgdGFyZ2V0ZWRGcmFtZWJ1cyA9IHt9O1xuXG4gIGZvciAoa2V5IGluIGZyYW1lYnVzKSB7XG4gICAgaWYgKCFmcmFtZWJ1cy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7IGNvbnRpbnVlOyB9XG5cbiAgICB0YXJnZXRlZEZyYW1lYnVzW2tleV0gPSBmcmFtZWJ1c1trZXldO1xuICB9XG5cbiAgdGFyZ2V0ZWRGcmFtZWJ1cy5fb3JpZ2luID0gb3JpZ2luIHx8ICcqJztcblxuICByZXR1cm4gdGFyZ2V0ZWRGcmFtZWJ1cztcbn1cblxuZnVuY3Rpb24gcHVibGlzaChldmVudCkge1xuICB2YXIgcGF5bG9hZCwgYXJncztcbiAgdmFyIG9yaWdpbiA9IF9nZXRPcmlnaW4odGhpcyk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8taW52YWxpZC10aGlzXG5cbiAgaWYgKF9pc250U3RyaW5nKGV2ZW50KSkgeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYgKF9pc250U3RyaW5nKG9yaWdpbikpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG5cbiAgcGF5bG9hZCA9IF9wYWNrYWdlUGF5bG9hZChldmVudCwgYXJncywgb3JpZ2luKTtcbiAgaWYgKHBheWxvYWQgPT09IGZhbHNlKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIF9icm9hZGNhc3Qod2luLnRvcCB8fCB3aW4uc2VsZiwgcGF5bG9hZCwgb3JpZ2luKTtcblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gc3Vic2NyaWJlKGV2ZW50LCBmbikge1xuICB2YXIgb3JpZ2luID0gX2dldE9yaWdpbih0aGlzKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1pbnZhbGlkLXRoaXNcblxuICBpZiAoX3N1YnNjcmlwdGlvbkFyZ3NJbnZhbGlkKGV2ZW50LCBmbiwgb3JpZ2luKSkgeyByZXR1cm4gZmFsc2U7IH1cblxuICBzdWJzY3JpYmVyc1tvcmlnaW5dID0gc3Vic2NyaWJlcnNbb3JpZ2luXSB8fCB7fTtcbiAgc3Vic2NyaWJlcnNbb3JpZ2luXVtldmVudF0gPSBzdWJzY3JpYmVyc1tvcmlnaW5dW2V2ZW50XSB8fCBbXTtcbiAgc3Vic2NyaWJlcnNbb3JpZ2luXVtldmVudF0ucHVzaChmbik7XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIHVuc3Vic2NyaWJlKGV2ZW50LCBmbikge1xuICB2YXIgaSwgc3Vic2NyaWJlckxpc3Q7XG4gIHZhciBvcmlnaW4gPSBfZ2V0T3JpZ2luKHRoaXMpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWludmFsaWQtdGhpc1xuXG4gIGlmIChfc3Vic2NyaXB0aW9uQXJnc0ludmFsaWQoZXZlbnQsIGZuLCBvcmlnaW4pKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIHN1YnNjcmliZXJMaXN0ID0gc3Vic2NyaWJlcnNbb3JpZ2luXSAmJiBzdWJzY3JpYmVyc1tvcmlnaW5dW2V2ZW50XTtcbiAgaWYgKCFzdWJzY3JpYmVyTGlzdCkgeyByZXR1cm4gZmFsc2U7IH1cblxuICBmb3IgKGkgPSAwOyBpIDwgc3Vic2NyaWJlckxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3Vic2NyaWJlckxpc3RbaV0gPT09IGZuKSB7XG4gICAgICBzdWJzY3JpYmVyTGlzdC5zcGxpY2UoaSwgMSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIF9nZXRPcmlnaW4oc2NvcGUpIHtcbiAgcmV0dXJuIHNjb3BlICYmIHNjb3BlLl9vcmlnaW4gfHwgJyonO1xufVxuXG5mdW5jdGlvbiBfaXNudFN0cmluZyhzdHJpbmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBzdHJpbmcgIT09ICdzdHJpbmcnO1xufVxuXG5mdW5jdGlvbiBfcGFja2FnZVBheWxvYWQoZXZlbnQsIGFyZ3MsIG9yaWdpbikge1xuICB2YXIgcGFja2FnZWQgPSBmYWxzZTtcbiAgdmFyIHBheWxvYWQgPSB7XG4gICAgZXZlbnQ6IGV2ZW50LFxuICAgIG9yaWdpbjogb3JpZ2luXG4gIH07XG4gIHZhciByZXBseSA9IGFyZ3NbYXJncy5sZW5ndGggLSAxXTtcblxuICBpZiAodHlwZW9mIHJlcGx5ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcGF5bG9hZC5yZXBseSA9IF9zdWJzY3JpYmVSZXBsaWVyKHJlcGx5LCBvcmlnaW4pO1xuICAgIGFyZ3MgPSBhcmdzLnNsaWNlKDAsIC0xKTtcbiAgfVxuXG4gIHBheWxvYWQuYXJncyA9IGFyZ3M7XG5cbiAgdHJ5IHtcbiAgICBwYWNrYWdlZCA9IHByZWZpeCArIEpTT04uc3RyaW5naWZ5KHBheWxvYWQpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDb3VsZCBub3Qgc3RyaW5naWZ5IGV2ZW50OiAnICsgZS5tZXNzYWdlKTtcbiAgfVxuICByZXR1cm4gcGFja2FnZWQ7XG59XG5cbmZ1bmN0aW9uIF91bnBhY2tQYXlsb2FkKGUpIHtcbiAgdmFyIHBheWxvYWQsIHJlcGx5T3JpZ2luLCByZXBseVNvdXJjZSwgcmVwbHlFdmVudDtcblxuICBpZiAoZS5kYXRhLnNsaWNlKDAsIHByZWZpeC5sZW5ndGgpICE9PSBwcmVmaXgpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgdHJ5IHtcbiAgICBwYXlsb2FkID0gSlNPTi5wYXJzZShlLmRhdGEuc2xpY2UocHJlZml4Lmxlbmd0aCkpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAocGF5bG9hZC5yZXBseSAhPSBudWxsKSB7XG4gICAgcmVwbHlPcmlnaW4gPSBlLm9yaWdpbjtcbiAgICByZXBseVNvdXJjZSA9IGUuc291cmNlO1xuICAgIHJlcGx5RXZlbnQgPSBwYXlsb2FkLnJlcGx5O1xuXG4gICAgcGF5bG9hZC5yZXBseSA9IGZ1bmN0aW9uIHJlcGx5KGRhdGEpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBjb25zaXN0ZW50LXJldHVyblxuICAgICAgdmFyIHJlcGx5UGF5bG9hZDtcblxuICAgICAgaWYgKCFyZXBseVNvdXJjZSkgeyByZXR1cm4gZmFsc2U7IH1cblxuICAgICAgcmVwbHlQYXlsb2FkID0gX3BhY2thZ2VQYXlsb2FkKHJlcGx5RXZlbnQsIFtkYXRhXSwgcmVwbHlPcmlnaW4pO1xuXG4gICAgICBpZiAocmVwbHlQYXlsb2FkID09PSBmYWxzZSkgeyByZXR1cm4gZmFsc2U7IH1cblxuICAgICAgcmVwbHlTb3VyY2UucG9zdE1lc3NhZ2UocmVwbHlQYXlsb2FkLCByZXBseU9yaWdpbik7XG4gICAgfTtcblxuICAgIHBheWxvYWQuYXJncy5wdXNoKHBheWxvYWQucmVwbHkpO1xuICB9XG5cbiAgcmV0dXJuIHBheWxvYWQ7XG59XG5cbmZ1bmN0aW9uIF9hdHRhY2godykge1xuICBpZiAod2luKSB7IHJldHVybjsgfVxuICB3aW4gPSB3IHx8IGdsb2JhbDtcblxuICBpZiAod2luLmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICB3aW4uYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIF9vbm1lc3NhZ2UsIGZhbHNlKTtcbiAgfSBlbHNlIGlmICh3aW4uYXR0YWNoRXZlbnQpIHtcbiAgICB3aW4uYXR0YWNoRXZlbnQoJ29ubWVzc2FnZScsIF9vbm1lc3NhZ2UpO1xuICB9IGVsc2UgaWYgKHdpbi5vbm1lc3NhZ2UgPT09IG51bGwpIHtcbiAgICB3aW4ub25tZXNzYWdlID0gX29ubWVzc2FnZTtcbiAgfSBlbHNlIHtcbiAgICB3aW4gPSBudWxsO1xuICB9XG59XG5cbi8vIHJlbW92ZUlmKHByb2R1Y3Rpb24pXG5mdW5jdGlvbiBfZGV0YWNoKCkge1xuICBpZiAod2luID09IG51bGwpIHsgcmV0dXJuOyB9XG5cbiAgaWYgKHdpbi5yZW1vdmVFdmVudExpc3RlbmVyKSB7XG4gICAgd2luLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBfb25tZXNzYWdlLCBmYWxzZSk7XG4gIH0gZWxzZSBpZiAod2luLmRldGFjaEV2ZW50KSB7XG4gICAgd2luLmRldGFjaEV2ZW50KCdvbm1lc3NhZ2UnLCBfb25tZXNzYWdlKTtcbiAgfSBlbHNlIGlmICh3aW4ub25tZXNzYWdlID09PSBfb25tZXNzYWdlKSB7XG4gICAgd2luLm9ubWVzc2FnZSA9IG51bGw7XG4gIH1cblxuICB3aW4gPSBudWxsO1xuICBwb3B1cHMgPSBbXTtcbiAgc3Vic2NyaWJlcnMgPSB7fTtcbn1cbi8vIGVuZFJlbW92ZUlmKHByb2R1Y3Rpb24pXG5cbmZ1bmN0aW9uIF91dWlkKCkge1xuICByZXR1cm4gJ3h4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eCcucmVwbGFjZSgvW3h5XS9nLCBmdW5jdGlvbiAoYykge1xuICAgIHZhciByID0gTWF0aC5yYW5kb20oKSAqIDE2IHwgMDtcbiAgICB2YXIgdiA9IGMgPT09ICd4JyA/IHIgOiByICYgMHgzIHwgMHg4O1xuXG4gICAgcmV0dXJuIHYudG9TdHJpbmcoMTYpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gX29ubWVzc2FnZShlKSB7XG4gIHZhciBwYXlsb2FkO1xuXG4gIGlmIChfaXNudFN0cmluZyhlLmRhdGEpKSB7IHJldHVybjsgfVxuXG4gIHBheWxvYWQgPSBfdW5wYWNrUGF5bG9hZChlKTtcbiAgaWYgKCFwYXlsb2FkKSB7IHJldHVybjsgfVxuXG4gIF9kaXNwYXRjaCgnKicsIHBheWxvYWQuZXZlbnQsIHBheWxvYWQuYXJncywgZSk7XG4gIF9kaXNwYXRjaChlLm9yaWdpbiwgcGF5bG9hZC5ldmVudCwgcGF5bG9hZC5hcmdzLCBlKTtcbiAgX2Jyb2FkY2FzdFBvcHVwcyhlLmRhdGEsIHBheWxvYWQub3JpZ2luLCBlLnNvdXJjZSk7XG59XG5cbmZ1bmN0aW9uIF9kaXNwYXRjaChvcmlnaW4sIGV2ZW50LCBhcmdzLCBlKSB7XG4gIHZhciBpO1xuXG4gIGlmICghc3Vic2NyaWJlcnNbb3JpZ2luXSkgeyByZXR1cm47IH1cbiAgaWYgKCFzdWJzY3JpYmVyc1tvcmlnaW5dW2V2ZW50XSkgeyByZXR1cm47IH1cblxuICBmb3IgKGkgPSAwOyBpIDwgc3Vic2NyaWJlcnNbb3JpZ2luXVtldmVudF0ubGVuZ3RoOyBpKyspIHtcbiAgICBzdWJzY3JpYmVyc1tvcmlnaW5dW2V2ZW50XVtpXS5hcHBseShlLCBhcmdzKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfaGFzT3BlbmVyKGZyYW1lKSB7XG4gIGlmIChmcmFtZS50b3AgIT09IGZyYW1lKSB7IHJldHVybiBmYWxzZTsgfVxuICBpZiAoZnJhbWUub3BlbmVyID09IG51bGwpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIGlmIChmcmFtZS5vcGVuZXIgPT09IGZyYW1lKSB7IHJldHVybiBmYWxzZTsgfVxuICBpZiAoZnJhbWUub3BlbmVyLmNsb3NlZCA9PT0gdHJ1ZSkgeyByZXR1cm4gZmFsc2U7IH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gX2Jyb2FkY2FzdChmcmFtZSwgcGF5bG9hZCwgb3JpZ2luKSB7XG4gIHZhciBpID0gMDtcbiAgdmFyIGZyYW1lVG9Ccm9hZGNhc3RUbztcblxuICB0cnkge1xuICAgIGZyYW1lLnBvc3RNZXNzYWdlKHBheWxvYWQsIG9yaWdpbik7XG5cbiAgICBpZiAoX2hhc09wZW5lcihmcmFtZSkpIHtcbiAgICAgIF9icm9hZGNhc3QoZnJhbWUub3BlbmVyLnRvcCwgcGF5bG9hZCwgb3JpZ2luKTtcbiAgICB9XG5cbiAgICAvLyBwcmV2aW91c2x5LCBvdXIgbWF4IHZhbHVlIHdhcyBmcmFtZS5mcmFtZXMubGVuZ3RoXG4gICAgLy8gYnV0IGZyYW1lcy5sZW5ndGggaW5oZXJpdHMgZnJvbSB3aW5kb3cubGVuZ3RoXG4gICAgLy8gd2hpY2ggY2FuIGJlIG92ZXJ3cml0dGVuIGlmIGEgZGV2ZWxvcGVyIGRvZXNcbiAgICAvLyBgdmFyIGxlbmd0aCA9IHZhbHVlO2Agb3V0c2lkZSBvZiBhIGZ1bmN0aW9uXG4gICAgLy8gc2NvcGUsIGl0J2xsIHByZXZlbnQgdXMgZnJvbSBsb29waW5nIHRocm91Z2hcbiAgICAvLyBhbGwgdGhlIGZyYW1lcy4gV2l0aCB0aGlzLCB3ZSBsb29wIHRocm91Z2hcbiAgICAvLyB1bnRpbCB0aGVyZSBhcmUgbm8gbG9uZ2VyIGFueSBmcmFtZXNcbiAgICB3aGlsZSAoZnJhbWVUb0Jyb2FkY2FzdFRvID0gZnJhbWUuZnJhbWVzW2ldKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uZC1hc3NpZ25cbiAgICAgIF9icm9hZGNhc3QoZnJhbWVUb0Jyb2FkY2FzdFRvLCBwYXlsb2FkLCBvcmlnaW4pO1xuICAgICAgaSsrO1xuICAgIH1cbiAgfSBjYXRjaCAoXykgeyAvKiBpZ25vcmVkICovIH1cbn1cblxuZnVuY3Rpb24gX2Jyb2FkY2FzdFBvcHVwcyhwYXlsb2FkLCBvcmlnaW4sIHNvdXJjZSkge1xuICB2YXIgaSwgcG9wdXA7XG5cbiAgZm9yIChpID0gcG9wdXBzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgcG9wdXAgPSBwb3B1cHNbaV07XG5cbiAgICBpZiAocG9wdXAuY2xvc2VkID09PSB0cnVlKSB7XG4gICAgICBwb3B1cHMgPSBwb3B1cHMuc2xpY2UoaSwgMSk7XG4gICAgfSBlbHNlIGlmIChzb3VyY2UgIT09IHBvcHVwKSB7XG4gICAgICBfYnJvYWRjYXN0KHBvcHVwLnRvcCwgcGF5bG9hZCwgb3JpZ2luKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gX3N1YnNjcmliZVJlcGxpZXIoZm4sIG9yaWdpbikge1xuICB2YXIgdXVpZCA9IF91dWlkKCk7XG5cbiAgZnVuY3Rpb24gcmVwbGllcihkLCBvKSB7XG4gICAgZm4oZCwgbyk7XG4gICAgZnJhbWVidXMudGFyZ2V0KG9yaWdpbikudW5zdWJzY3JpYmUodXVpZCwgcmVwbGllcik7XG4gIH1cblxuICBmcmFtZWJ1cy50YXJnZXQob3JpZ2luKS5zdWJzY3JpYmUodXVpZCwgcmVwbGllcik7XG4gIHJldHVybiB1dWlkO1xufVxuXG5mdW5jdGlvbiBfc3Vic2NyaXB0aW9uQXJnc0ludmFsaWQoZXZlbnQsIGZuLCBvcmlnaW4pIHtcbiAgaWYgKF9pc250U3RyaW5nKGV2ZW50KSkgeyByZXR1cm4gdHJ1ZTsgfVxuICBpZiAodHlwZW9mIGZuICE9PSAnZnVuY3Rpb24nKSB7IHJldHVybiB0cnVlOyB9XG4gIGlmIChfaXNudFN0cmluZyhvcmlnaW4pKSB7IHJldHVybiB0cnVlOyB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5fYXR0YWNoKCk7XG5cbmZyYW1lYnVzID0ge1xuICB0YXJnZXQ6IHRhcmdldCxcbiAgLy8gcmVtb3ZlSWYocHJvZHVjdGlvbilcbiAgX3BhY2thZ2VQYXlsb2FkOiBfcGFja2FnZVBheWxvYWQsXG4gIF91bnBhY2tQYXlsb2FkOiBfdW5wYWNrUGF5bG9hZCxcbiAgX2F0dGFjaDogX2F0dGFjaCxcbiAgX2RldGFjaDogX2RldGFjaCxcbiAgX2Rpc3BhdGNoOiBfZGlzcGF0Y2gsXG4gIF9icm9hZGNhc3Q6IF9icm9hZGNhc3QsXG4gIF9zdWJzY3JpYmVSZXBsaWVyOiBfc3Vic2NyaWJlUmVwbGllcixcbiAgX3N1YnNjcmlwdGlvbkFyZ3NJbnZhbGlkOiBfc3Vic2NyaXB0aW9uQXJnc0ludmFsaWQsXG4gIF9vbm1lc3NhZ2U6IF9vbm1lc3NhZ2UsXG4gIF91dWlkOiBfdXVpZCxcbiAgX2dldFN1YnNjcmliZXJzOiBmdW5jdGlvbiAoKSB7IHJldHVybiBzdWJzY3JpYmVyczsgfSxcbiAgX3dpbjogZnVuY3Rpb24gKCkgeyByZXR1cm4gd2luOyB9LFxuICAvLyBlbmRSZW1vdmVJZihwcm9kdWN0aW9uKVxuICBpbmNsdWRlOiBpbmNsdWRlLFxuICBwdWJsaXNoOiBwdWJsaXNoLFxuICBwdWI6IHB1Ymxpc2gsXG4gIHRyaWdnZXI6IHB1Ymxpc2gsXG4gIGVtaXQ6IHB1Ymxpc2gsXG4gIHN1YnNjcmliZTogc3Vic2NyaWJlLFxuICBzdWI6IHN1YnNjcmliZSxcbiAgb246IHN1YnNjcmliZSxcbiAgdW5zdWJzY3JpYmU6IHVuc3Vic2NyaWJlLFxuICB1bnN1YjogdW5zdWJzY3JpYmUsXG4gIG9mZjogdW5zdWJzY3JpYmVcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnJhbWVidXM7XG4iLCIndXNlIHN0cmljdCc7XG4vKiBlc2xpbnQtZGlzYWJsZSBuby1yZXNlcnZlZC1rZXlzICovXG5cbnZhciBlbnVtZXJhdGUgPSByZXF1aXJlKCcuLi8uLi9saWIvZW51bWVyYXRlJyk7XG52YXIgVkVSU0lPTiA9IFwid2ViLXNka1wiO1xuXG52YXIgcmVxdWVzdFR5cGVzID0ge1xuICBSRVFVRVNUX1RZUEVfVE9LRU5JWkFUSU9OOiAndG9rZW5pemF0aW9uJ1xufTtcblxudmFyIHdoaXRlbGlzdGVkRmllbGRzID0gW1xuICB7XG4gICAgZmllbGQ6ICdhY2NvdW50TnVtYmVyJyxcbiAgICBuYW1lOiAnYWNjb3VudC1udW1iZXInLFxuICAgIGxhYmVsOiAnQ2FyZCBOdW1iZXInLFxuICAgIGRlZmF1bHRNYXhMZW5ndGg6IDIyLFxuICAgIHdyYXBwZXI6IHtcbiAgICAgIGRhdGFNYXg6ICc0MjQyIDQyNDIgNDI0MiA0MjQyIDQyNDAnLFxuICAgICAgc3R5bGU6IHtcbiAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCgwcHgpJ1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAge1xuICAgIGZpZWxkOiAnZXhwRGF0ZScsXG4gICAgbmFtZTogJ2V4cC1kYXRlJyxcbiAgICBsYWJlbDogJ0V4cGlyYXRpb24gRGF0ZScsXG4gICAgZGVmYXVsdE1heExlbmd0aDogNyxcbiAgICB3cmFwcGVyOiB7XG4gICAgICBkYXRhTWF4OiAnTU0gLyBZWTAnLFxuICAgICAgc3R5bGU6IHtcbiAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCgwcHgpJ1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAge1xuICAgIGZpZWxkOiAnY3Z2JyxcbiAgICBuYW1lOiAnY3Z2JyxcbiAgICBsYWJlbDogJ0NWVicsXG4gICAgZGVmYXVsdE1heExlbmd0aDogNCxcbiAgICB3cmFwcGVyOiB7XG4gICAgICBkYXRhTWF4OiAnMDAwMDAnLFxuICAgICAgc3R5bGU6IHtcbiAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCgwcHgpJ1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAge1xuICAgIGZpZWxkOiAncG9zdGFsQ29kZScsXG4gICAgbmFtZTogJ3Bvc3RhbC1jb2RlJyxcbiAgICBsYWJlbDogJ1Bvc3RhbCBDb2RlJyxcbiAgICBkZWZhdWx0TWF4TGVuZ3RoOiA1LFxuICAgIHdyYXBwZXI6IHtcbiAgICAgIGRhdGFNYXg6ICc5MDIxMDAnLFxuICAgICAgc3R5bGU6IHtcbiAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCgwcHgpJ1xuICAgICAgfVxuICAgIH1cbiAgfVxuXTtcblxudmFyIGNhcmRCcmFuZE1hcCA9IHtcbiAgdmlzYTogJ3Zpc2EnLFxuICBtYXN0ZXJjYXJkOiAnbWFzdGVyY2FyZCcsXG4gICdhbWVyaWNhbi1leHByZXNzJzogJ2FtZXgnLFxuICAnZGluZXJzLWNsdWInOiAnZGluZXJzJyxcbiAgZGlzY292ZXI6ICdkaXNjb3ZlcicsXG4gIGpjYjogJ2pjYicsXG4gIHVuaW9ucGF5OiAndW5pb25wYXknLFxuICBtYWVzdHJvOiAnbWFzdGVyY2FyZCcsXG4gIGVsbzogJ2Rpc2NvdmVyJyxcbiAgbWlyOiAndW5rbm93bicsXG4gIGhpcGVyOiAnZGlzY292ZXInLFxuICBoaXBlcmNhcmQ6ICdkaXNjb3Zlcidcbn07XG5cbnZhciB0b2tlbml6ZXJOb25TZWN1cmVGaWVsZHMgPSBbXG4gICdiaWxsaW5nQWRkcmVzcycsXG4gICdjb21wYW55JyxcbiAgJ2VtYWlsJyxcbiAgJ25hbWUnLFxuICAncGhvbmVOdW1iZXInLFxuICAnY3VzdG9tZXInLFxuICAnYWNjb3VudFZhbGlkYXRpb24nLFxuICAnYmFua0FjY291bnRUeXBlJyxcbiAgJ3JvdXRpbmdOdW1iZXInXG5dO1xuXG52YXIgY29uc3RhbnRzID0ge1xuICBWRVJTSU9OOiBWRVJTSU9OLFxuICBQQVlNRU5UX1RZUEVfQ1JFRElUX0NBUkQ6ICdjcmVkaXRfY2FyZCcsXG4gIG1heEV4cGlyYXRpb25ZZWFyQWdlOiAzMSxcbiAgZXh0ZXJuYWxFdmVudHM6IHtcbiAgICBDSEFOR0U6ICdjaGFuZ2UnLFxuICAgIEZPQ1VTOiAnZm9jdXMnLFxuICAgIEJMVVI6ICdibHVyJyxcbiAgICBFTVBUWTogJ2VtcHR5JyxcbiAgICBOT1RfRU1QVFk6ICdub3RFbXB0eScsXG4gICAgVkFMSURJVFlfQ0hBTkdFOiAndmFsaWRpdHlDaGFuZ2UnLFxuICAgIENBUkRfVFlQRV9DSEFOR0U6ICdjYXJkVHlwZUNoYW5nZSdcbiAgfSxcbiAgZXh0ZXJuYWxDbGFzc2VzOiB7XG4gICAgRk9DVVNFRDogJ3NlYW1sZXNzcGF5LWNhcmQtZWxlbWVudC1mb2N1c2VkJyxcbiAgICBJTlZBTElEOiAnc2VhbWxlc3NwYXktY2FyZC1lbGVtZW50LWludmFsaWQnLFxuICAgIFZBTElEOiAnc2VhbWxlc3NwYXktY2FyZC1lbGVtZW50LXZhbGlkJ1xuICB9LFxuICBkZWZhdWx0SUZyYW1lU3R5bGU6IHtcbiAgICAnYm9yZGVyJzogWydub25lJywgJ2ltcG9ydGFudCddLFxuICAgICdtYXJnaW4nOiBbJzBweCcsICdpbXBvcnRhbnQnXSxcbiAgICAncGFkZGluZyc6IFsnMHB4JywgJ2ltcG9ydGFudCddLFxuICAgICd3aWR0aCc6IFsnMXB4JywgJ2ltcG9ydGFudCddLFxuICAgICdtaW4td2lkdGgnOiBbJzEwMCUnLCAnaW1wb3J0YW50J10sXG4gICAgJ292ZXJmbG93JzogWydoaWRkZW4nLCAnaW1wb3J0YW50J10sXG4gICAgJ2Rpc3BsYXknOiBbJ2Jsb2NrJywgJ2ltcG9ydGFudCddLFxuICAgICd1c2VyLXNlbGVjdCc6IFsnbm9uZScsICdpbXBvcnRhbnQnXSxcbiAgICAnaGVpZ2h0JzogWycxOS4ycHgnXVxuICB9LFxuICB3aGl0ZWxpc3RlZFN0eWxlczogW1xuICAgICctbW96LWFwcGVhcmFuY2UnLFxuICAgICctbW96LW9zeC1mb250LXNtb290aGluZycsXG4gICAgJy1tb3otdGFwLWhpZ2hsaWdodC1jb2xvcicsXG4gICAgJy1tb3otdHJhbnNpdGlvbicsXG4gICAgJy13ZWJraXQtYXBwZWFyYW5jZScsXG4gICAgJy13ZWJraXQtZm9udC1zbW9vdGhpbmcnLFxuICAgICctd2Via2l0LXRhcC1oaWdobGlnaHQtY29sb3InLFxuICAgICctd2Via2l0LXRyYW5zaXRpb24nLFxuICAgICdhcHBlYXJhbmNlJyxcbiAgICAnY29sb3InLFxuICAgICdkaXJlY3Rpb24nLFxuICAgICdmb250JyxcbiAgICAnZm9udC1mYW1pbHknLFxuICAgICdmb250LXNpemUnLFxuICAgICdmb250LXNpemUtYWRqdXN0JyxcbiAgICAnZm9udC1zdHJldGNoJyxcbiAgICAnZm9udC1zdHlsZScsXG4gICAgJ2ZvbnQtdmFyaWFudCcsXG4gICAgJ2ZvbnQtdmFyaWFudC1hbHRlcm5hdGVzJyxcbiAgICAnZm9udC12YXJpYW50LWNhcHMnLFxuICAgICdmb250LXZhcmlhbnQtZWFzdC1hc2lhbicsXG4gICAgJ2ZvbnQtdmFyaWFudC1saWdhdHVyZXMnLFxuICAgICdmb250LXZhcmlhbnQtbnVtZXJpYycsXG4gICAgJ2ZvbnQtd2VpZ2h0JyxcbiAgICAnbGV0dGVyLXNwYWNpbmcnLFxuICAgICdsaW5lLWhlaWdodCcsXG4gICAgJ21hcmdpbicsXG4gICAgJ21hcmdpbi10b3AnLFxuICAgICdtYXJnaW4tcmlnaHQnLFxuICAgICdtYXJnaW4tYm90dG9tJyxcbiAgICAnbWFyZ2luLWxlZnQnLFxuICAgICdvcGFjaXR5JyxcbiAgICAnb3V0bGluZScsXG4gICAgJ3BhZGRpbmcnLFxuICAgICdwYWRkaW5nLXRvcCcsXG4gICAgJ3BhZGRpbmctcmlnaHQnLFxuICAgICdwYWRkaW5nLWJvdHRvbScsXG4gICAgJ3BhZGRpbmctbGVmdCcsXG4gICAgJ3RleHQtYWxpZ24nLFxuICAgICd0ZXh0LXNoYWRvdycsXG4gICAgJ3RyYW5zaXRpb24nXG4gIF0sXG4gIHdoaXRlbGlzdGVkRmllbGRzOiB3aGl0ZWxpc3RlZEZpZWxkcyxcbiAgY2FyZEJyYW5kTWFwOiBjYXJkQnJhbmRNYXAsXG4gIHRva2VuaXplck5vblNlY3VyZUZpZWxkczogdG9rZW5pemVyTm9uU2VjdXJlRmllbGRzLFxuICB3aGl0ZWxpc3RlZEF0dHJpYnV0ZXM6IHtcbiAgICAnYXJpYS1pbnZhbGlkJzogJ2Jvb2xlYW4nLFxuICAgICdhcmlhLXJlcXVpcmVkJzogJ2Jvb2xlYW4nLFxuICAgIGRpc2FibGVkOiAnYm9vbGVhbicsXG4gICAgcGxhY2Vob2xkZXI6ICdzdHJpbmcnXG4gIH0sXG4gIGF1dG9jb21wbGV0ZU1hcHBpbmdzOiB7XG4gICAgJ2FjY291bnQtbnVtYmVyJzogJ2NjLW51bWJlcicsXG4gICAgJ2V4cC1kYXRlJzogJ2NjLWV4cCcsXG4gICAgY3Z2OiAnY2MtY3NjJyxcbiAgICAncG9zdGFsLWNvZGUnOiAnYmlsbGluZyBwb3N0YWwtY29kZSdcbiAgfSxcbiAgcmVxdWVzdFR5cGVzOiByZXF1ZXN0VHlwZXNcbn07XG5cbmNvbnN0YW50cy5ldmVudHMgPSBlbnVtZXJhdGUoW1xuICAnQVVUT0ZJTExfRVhQSVJBVElPTl9EQVRFJyxcbiAgJ0ZSQU1FX1JFQURZJyxcbiAgJ1ZBTElEQVRFX1NUUklDVCcsXG4gICdDT05GSUdVUkFUSU9OJyxcbiAgJ1RPS0VOSVpBVElPTl9SRVFVRVNUJyxcbiAgJ0lOUFVUX0VWRU5UJyxcbiAgJ1RSSUdHRVJfSU5QVVRfRk9DVVMnLFxuICAnQUREX0NMQVNTJyxcbiAgJ1JFTU9WRV9DTEFTUycsXG4gICdTRVRfQVRUUklCVVRFJyxcbiAgJ1JFTU9WRV9BVFRSSUJVVEUnLFxuICAnQ0xFQVJfRklFTEQnLFxuXSwgJ2NhcmQtZWxlbWVudDonKTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb25zdGFudHM7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBTZWFtbGVzc3BheUVycm9yID0gcmVxdWlyZSgnLi4vLi4vbGliL3NlYW1sZXNzcGF5LWVycm9yJyk7XG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi4vc2hhcmVkL2Vycm9ycycpO1xudmFyIHdoaXRlbGlzdCA9IHJlcXVpcmUoJy4uL3NoYXJlZC9jb25zdGFudHMnKS53aGl0ZWxpc3RlZEF0dHJpYnV0ZXM7XG5cbmZ1bmN0aW9uIGF0dHJpYnV0ZVZhbGlkYXRpb25FcnJvcihhdHRyaWJ1dGUsIHZhbHVlKSB7XG4gIHZhciBlcnI7XG5cbiAgaWYgKCF3aGl0ZWxpc3QuaGFzT3duUHJvcGVydHkoYXR0cmlidXRlKSkge1xuICAgIGVyciA9IG5ldyBTZWFtbGVzc3BheUVycm9yKHtcbiAgICAgIHR5cGU6IGVycm9ycy5IT1NURURfRklFTERTX0FUVFJJQlVURV9OT1RfU1VQUE9SVEVELnR5cGUsXG4gICAgICBjb2RlOiBlcnJvcnMuSE9TVEVEX0ZJRUxEU19BVFRSSUJVVEVfTk9UX1NVUFBPUlRFRC5jb2RlLFxuICAgICAgbWVzc2FnZTogJ1RoZSBcIicgKyBhdHRyaWJ1dGUgKyAnXCIgYXR0cmlidXRlIGlzIG5vdCBzdXBwb3J0ZWQgaW4gSG9zdGVkIEZpZWxkcy4nXG4gICAgfSk7XG4gIH0gZWxzZSBpZiAodmFsdWUgIT0gbnVsbCAmJiAhX2lzVmFsaWQoYXR0cmlidXRlLCB2YWx1ZSkpIHtcbiAgICBlcnIgPSBuZXcgU2VhbWxlc3NwYXlFcnJvcih7XG4gICAgICB0eXBlOiBlcnJvcnMuSE9TVEVEX0ZJRUxEU19BVFRSSUJVVEVfVkFMVUVfTk9UX0FMTE9XRUQudHlwZSxcbiAgICAgIGNvZGU6IGVycm9ycy5IT1NURURfRklFTERTX0FUVFJJQlVURV9WQUxVRV9OT1RfQUxMT1dFRC5jb2RlLFxuICAgICAgbWVzc2FnZTogJ1ZhbHVlIFwiJyArIHZhbHVlICsgJ1wiIGlzIG5vdCBhbGxvd2VkIGZvciBcIicgKyBhdHRyaWJ1dGUgKyAnXCIgYXR0cmlidXRlLidcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBlcnI7XG59XG5cbmZ1bmN0aW9uIF9pc1ZhbGlkKGF0dHJpYnV0ZSwgdmFsdWUpIHtcbiAgaWYgKHdoaXRlbGlzdFthdHRyaWJ1dGVdID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcic7XG4gIH0gZWxzZSBpZiAod2hpdGVsaXN0W2F0dHJpYnV0ZV0gPT09ICdib29sZWFuJykge1xuICAgIHJldHVybiBTdHJpbmcodmFsdWUpID09PSAndHJ1ZScgfHwgU3RyaW5nKHZhbHVlKSA9PT0gJ2ZhbHNlJztcbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhdHRyaWJ1dGVWYWxpZGF0aW9uRXJyb3I7XG4iLCJ2YXIgU2VhbWxlc3NwYXlFcnJvciA9IHJlcXVpcmUoJy4uLy4uL2xpYi9zZWFtbGVzc3BheS1lcnJvcicpO1xudmFyIHNoYXJlZEVycm9ycyA9IHJlcXVpcmUoJy4uLy4uL2xpYi9lcnJvcnMnKTtcbnZhciByZXF1ZXN0VHlwZXMgPSByZXF1aXJlKCcuLi9zaGFyZWQvY29uc3RhbnRzJykucmVxdWVzdFR5cGVzO1xudmFyIHJlbGF0aW9ucyA9IHJlcXVpcmUoJy4uL3NoYXJlZC9wYXltZW50LWZpZWxkcy1yZWxhdGlvbnMnKTtcblxudmFyIFRPS0VOSVpBVElPTiA9IHJlcXVlc3RUeXBlcy5SRVFVRVNUX1RZUEVfVE9LRU5JWkFUSU9OO1xuXG52YXIgdHlwZUZpZWxkUmVsYXRpb25zID0gcmVsYXRpb25zW1RPS0VOSVpBVElPTl07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHR5cGUsIGZpZWxkcykge1xuICB2YXIgaXNSZXF1aXJlZEV4Y2VzcyA9IHRydWU7XG4gIHZhciBpc1JlcXVpcmVkVmFsaWQgPSBmYWxzZTtcbiAgdmFyIHJlcXVpcmVkU2V0cyA9IHt9O1xuICB2YXIgdmFsaWRTZXRzQ291bnQgPSB7fTtcbiAgdmFyIGlzQ29tcGxldGUgPSBmaWVsZHMuZXZlcnkoZnVuY3Rpb24gKGZpZWxkKSB7XG4gICAgcmV0dXJuICEhfnR5cGVGaWVsZFJlbGF0aW9uc1t0eXBlXS5maWVsZHMuaW5kZXhPZihmaWVsZCk7XG4gIH0pO1xuXG4gIGlmICghaXNDb21wbGV0ZSkge1xuICAgIHRocm93IG5ldyBTZWFtbGVzc3BheUVycm9yKHtcbiAgICAgIHR5cGU6IHNoYXJlZEVycm9ycy5JTkNPTVBBVElCTEVfRklFTERTX1NFVC50eXBlLFxuICAgICAgY29kZTogc2hhcmVkRXJyb3JzLklOQ09NUEFUSUJMRV9GSUVMRFNfU0VULmNvZGUsXG4gICAgICBtZXNzYWdlOiAnRmllbGRzIGludGVncml0eSBpcyBicm9rZW4gZm9yIHBheW1lbnQgdHlwZSBcIidcbiAgICAgICsgdHlwZSArICdcIiEgWW91IGNhbiB1c2Ugb25seSBuZXh0IGZpZWxkczogJ1xuICAgICAgKyB0eXBlRmllbGRSZWxhdGlvbnNbdHlwZV0uZmllbGRzLmpvaW4oJywgJylcbiAgICB9KTtcbiAgfVxuXG4gIHR5cGVGaWVsZFJlbGF0aW9uc1t0eXBlXS5vbmVPZi5mb3JFYWNoKGZ1bmN0aW9uIChydWxlKSB7XG4gICAgdmFyIHNldEtleSA9IHJ1bGUucmVxdWlyZWQuc29ydCgpLmpvaW4oJywgJyk7XG4gICAgcmVxdWlyZWRTZXRzW3NldEtleV0gPSBydWxlLnJlcXVpcmVkLmxlbmd0aDtcbiAgICB2YXIgdmFsaWRDb3VudCA9IHJ1bGUucmVxdWlyZWQucmVkdWNlKGZ1bmN0aW9uKHJlc3VsdCwgcmVxdWlyZWRGaWVsZCkge1xuICAgICAgcmV0dXJuIH5maWVsZHMuaW5kZXhPZihyZXF1aXJlZEZpZWxkKSA/IHJlc3VsdCArIDEgOiByZXN1bHQ7XG4gICAgfSwgMCk7XG4gICAgdmFsaWRTZXRzQ291bnRbc2V0S2V5XSA9IHZhbGlkQ291bnQ7XG4gIH0pO1xuXG4gIGlzUmVxdWlyZWRWYWxpZCA9IE9iamVjdC5rZXlzKHZhbGlkU2V0c0NvdW50KS5maWx0ZXIoZnVuY3Rpb24gKHNldEtleSkge1xuICAgIHJldHVybiB2YWxpZFNldHNDb3VudFtzZXRLZXldID09PSByZXF1aXJlZFNldHNbc2V0S2V5XTtcbiAgfSkubGVuZ3RoID09PSAxO1xuXG4gIGlzUmVxdWlyZWRFeGNlc3MgPSBPYmplY3Qua2V5cyh2YWxpZFNldHNDb3VudCkuZmlsdGVyKGZ1bmN0aW9uIChzZXRLZXkpIHtcbiAgICByZXR1cm4gdmFsaWRTZXRzQ291bnRbc2V0S2V5XSA+IDA7XG4gIH0pLmxlbmd0aCA+IDE7XG5cbiAgaWYgKCFpc1JlcXVpcmVkVmFsaWQgfHwgaXNSZXF1aXJlZEV4Y2Vzcykge1xuICAgIHRocm93IG5ldyBTZWFtbGVzc3BheUVycm9yKHtcbiAgICAgIHR5cGU6IHNoYXJlZEVycm9ycy5JTkNPTVBBVElCTEVfRklFTERTX1NFVC50eXBlLFxuICAgICAgY29kZTogc2hhcmVkRXJyb3JzLklOQ09NUEFUSUJMRV9GSUVMRFNfU0VULmNvZGUsXG4gICAgICBtZXNzYWdlOiAnSW5jb21wYXRpYmxlIHJlcXVpcmVkIGZpZWxkcyBzZXQhIHBheW1lbnQgdHlwZSAnXG4gICAgICArIHR5cGUgKyAnIGlzIHJlcXVpcmluZydcbiAgICAgICsgKE9iamVjdC5rZXlzKHJlcXVpcmVkU2V0cykubGVuZ3RoID4gMSA/ICcgb25lIG9mICcgOiAnICcpICsgJ2ZpZWxkIHNldDogJ1xuICAgICAgKyBPYmplY3Qua2V5cyhyZXF1aXJlZFNldHMpLmpvaW4oJyBvciAnKVxuICAgIH0pO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgRGVzdHJ1Y3RvciA9IHJlcXVpcmUoJy4uLy4uL2xpYi9kZXN0cnVjdG9yJyk7XG52YXIgY2xhc3NsaXN0ID0gcmVxdWlyZSgnLi4vLi4vbGliL2NsYXNzbGlzdCcpO1xudmFyIGlGcmFtZXIgPSByZXF1aXJlKCdAYnJhaW50cmVlL2lmcmFtZXInKTtcbnZhciBCdXMgPSByZXF1aXJlKCcuLi8uLi9saWIvYnVzJyk7XG52YXIgU2VhbWxlc3NwYXlFcnJvciA9IHJlcXVpcmUoJy4uLy4uL2xpYi9zZWFtbGVzc3BheS1lcnJvcicpO1xudmFyIGNvbXBvc2VVcmwgPSByZXF1aXJlKCcuLi8uLi9saWIvY29tcG9zZS11cmwnKTtcbnZhciBjb25zdGFudHMgPSByZXF1aXJlKCcuLi9zaGFyZWQvY29uc3RhbnRzJyk7XG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi4vc2hhcmVkL2Vycm9ycycpO1xudmFyIHV1aWQgPSByZXF1aXJlKCcuLi8uLi9saWIvdXVpZCcpO1xudmFyIGZpbmRQYXJlbnRUYWdzID0gcmVxdWlyZSgnLi4vc2hhcmVkL2ZpbmQtcGFyZW50LXRhZ3MnKTtcbnZhciBnZXRXaGl0ZWxpc3RlZEZpZWxkcyA9IHJlcXVpcmUoJy4uL3NoYXJlZC9jb21tb24nKS5nZXRXaGl0ZWxpc3RlZEZpZWxkcztcbnZhciBpc0lvcyA9IHJlcXVpcmUoJy4uLy4uL2xpYi9pcy1pb3MnKTtcbnZhciBldmVudHMgPSBjb25zdGFudHMuZXZlbnRzO1xudmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJy4uLy4uL2xpYi9ldmVudC1lbWl0dGVyJyk7XG52YXIgaW5qZWN0RnJhbWUgPSByZXF1aXJlKCcuLi8uLi9saWIvaW5qZWN0LWZyYW1lJyk7XG52YXIgVkVSU0lPTiA9IFwid2ViLXNka1wiO1xudmFyIG1ldGhvZHMgPSByZXF1aXJlKCcuLi8uLi9saWIvbWV0aG9kcycpO1xudmFyIGNvbnZlcnRNZXRob2RzVG9FcnJvciA9IHJlcXVpcmUoJy4uLy4uL2xpYi9jb252ZXJ0LW1ldGhvZHMtdG8tZXJyb3InKTtcbnZhciBkZWZlcnJlZCA9IHJlcXVpcmUoJy4uLy4uL2xpYi9kZWZlcnJlZCcpO1xudmFyIHNoYXJlZEVycm9ycyA9IHJlcXVpcmUoJy4uLy4uL2xpYi9lcnJvcnMnKTtcbnZhciBnZXRDYXJkVHlwZXMgPSByZXF1aXJlKCdjcmVkaXQtY2FyZC10eXBlJyk7XG52YXIgYXR0cmlidXRlVmFsaWRhdGlvbkVycm9yID0gcmVxdWlyZSgnLi9hdHRyaWJ1dGUtdmFsaWRhdGlvbi1lcnJvcicpO1xudmFyIFByb21pc2UgPSByZXF1aXJlKCcuLi8uLi9saWIvcHJvbWlzZScpO1xudmFyIHdyYXBQcm9taXNlID0gcmVxdWlyZSgnQGJyYWludHJlZS93cmFwLXByb21pc2UnKTtcbnZhciBjaGVja0ludGVncml0eSA9IHJlcXVpcmUoJy4vY2hlY2staW50ZWdyaXR5Jyk7XG52YXIgeyBmb3JtYXRUb2tlbml6ZVJlc3BvbnNlIH0gPSByZXF1aXJlKCcuL3Jlc3BvbnNlLWZvcm1hdHRlcnMnKVxuXG4vKipcbiAqIEB0eXBlZGVmIHtvYmplY3R9IEhvc3RlZEZpZWxkc350b2tlbml6ZVBheWxvYWRcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBub25jZSBUaGUgcGF5bWVudCBtZXRob2Qgbm9uY2UuXG4gKiBAcHJvcGVydHkge29iamVjdH0gZGV0YWlscyBBZGRpdGlvbmFsIGFjY291bnQgZGV0YWlscy5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBkZXRhaWxzLmNhcmRUeXBlIFR5cGUgb2YgY2FyZCwgZXg6IFZpc2EsIE1hc3RlckNhcmQuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gZGV0YWlscy5sYXN0VHdvIExhc3QgdHdvIGRpZ2l0cyBvZiBjYXJkIG51bWJlci5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBkZXNjcmlwdGlvbiBBIGh1bWFuLXJlYWRhYmxlIGRlc2NyaXB0aW9uLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IHR5cGUgVGhlIHBheW1lbnQgbWV0aG9kIHR5cGUsIGFsd2F5cyBgQ3JlZGl0Q2FyZGAuXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7b2JqZWN0fSBIb3N0ZWRGaWVsZHN+c3RhdGVPYmplY3RcbiAqIEBkZXNjcmlwdGlvbiBUaGUgZXZlbnQgcGF5bG9hZCBzZW50IGZyb20ge0BsaW5rIEhvc3RlZEZpZWxkcyNvbnxvbn0gb3Ige0BsaW5rIEhvc3RlZEZpZWxkcyNnZXRTdGF0ZXxnZXRTdGF0ZX0uXG4gKiBAcHJvcGVydHkge0hvc3RlZEZpZWxkc35ob3N0ZWRGaWVsZHNDYXJkW119IGNhcmRzXG4gKiBUaGlzIHdpbGwgcmV0dXJuIGFuIGFycmF5IG9mIHBvdGVudGlhbCB7QGxpbmsgSG9zdGVkRmllbGRzfmhvc3RlZEZpZWxkc0NhcmR8Y2FyZHN9LiBJZiB0aGUgY2FyZCB0eXBlIGhhcyBiZWVuIGRldGVybWluZWQsIHRoZSBhcnJheSB3aWxsIGNvbnRhaW4gb25seSBvbmUgY2FyZC5cbiAqIEludGVybmFsbHksIEhvc3RlZCBGaWVsZHMgdXNlcyA8YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL3NlYW1sZXNzcGF5L2NyZWRpdC1jYXJkLXR5cGVcIj5jcmVkaXQtY2FyZC10eXBlPC9hPixcbiAqIGFuIG9wZW4tc291cmNlIGNhcmQgZGV0ZWN0aW9uIGxpYnJhcnkuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gZW1pdHRlZEJ5XG4gKiBUaGUgbmFtZSBvZiB0aGUgZmllbGQgYXNzb2NpYXRlZCB3aXRoIGFuIGV2ZW50LiBUaGlzIHdpbGwgbm90IGJlIGluY2x1ZGVkIGlmIHJldHVybmVkIGJ5IHtAbGluayBIb3N0ZWRGaWVsZHMjZ2V0U3RhdGV8Z2V0U3RhdGV9LiBJdCB3aWxsIGJlIG9uZSBvZiB0aGUgZm9sbG93aW5nIHN0cmluZ3M6PGJyPlxuICogLSBgXCJudW1iZXJcImBcbiAqIC0gYFwiY3Z2XCJgXG4gKiAtIGBcImV4cERhdGVcImBcbiAqIC0gYFwiZXhwaXJhdGlvbk1vbnRoXCJgXG4gKiAtIGBcImV4cGlyYXRpb25ZZWFyXCJgXG4gKiAtIGBcInBvc3RhbENvZGVcImBcbiAqIEBwcm9wZXJ0eSB7b2JqZWN0fSBmaWVsZHNcbiAqIEBwcm9wZXJ0eSB7P0hvc3RlZEZpZWxkc35ob3N0ZWRGaWVsZHNGaWVsZERhdGF9IGZpZWxkcy5udW1iZXIge0BsaW5rIEhvc3RlZEZpZWxkc35ob3N0ZWRGaWVsZHNGaWVsZERhdGF8aG9zdGVkRmllbGRzRmllbGREYXRhfSBmb3IgdGhlIG51bWJlciBmaWVsZCwgaWYgaXQgaXMgcHJlc2VudC5cbiAqIEBwcm9wZXJ0eSB7P0hvc3RlZEZpZWxkc35ob3N0ZWRGaWVsZHNGaWVsZERhdGF9IGZpZWxkcy5jdnYge0BsaW5rIEhvc3RlZEZpZWxkc35ob3N0ZWRGaWVsZHNGaWVsZERhdGF8aG9zdGVkRmllbGRzRmllbGREYXRhfSBmb3IgdGhlIENWViBmaWVsZCwgaWYgaXQgaXMgcHJlc2VudC5cbiAqIEBwcm9wZXJ0eSB7P0hvc3RlZEZpZWxkc35ob3N0ZWRGaWVsZHNGaWVsZERhdGF9IGZpZWxkcy5leHBEYXRlIHtAbGluayBIb3N0ZWRGaWVsZHN+aG9zdGVkRmllbGRzRmllbGREYXRhfGhvc3RlZEZpZWxkc0ZpZWxkRGF0YX0gZm9yIHRoZSBleHBpcmF0aW9uIGRhdGUgZmllbGQsIGlmIGl0IGlzIHByZXNlbnQuXG4gKiBAcHJvcGVydHkgez9Ib3N0ZWRGaWVsZHN+aG9zdGVkRmllbGRzRmllbGREYXRhfSBmaWVsZHMuZXhwaXJhdGlvbk1vbnRoIHtAbGluayBIb3N0ZWRGaWVsZHN+aG9zdGVkRmllbGRzRmllbGREYXRhfGhvc3RlZEZpZWxkc0ZpZWxkRGF0YX0gZm9yIHRoZSBleHBpcmF0aW9uIG1vbnRoIGZpZWxkLCBpZiBpdCBpcyBwcmVzZW50LlxuICogQHByb3BlcnR5IHs/SG9zdGVkRmllbGRzfmhvc3RlZEZpZWxkc0ZpZWxkRGF0YX0gZmllbGRzLmV4cGlyYXRpb25ZZWFyIHtAbGluayBIb3N0ZWRGaWVsZHN+aG9zdGVkRmllbGRzRmllbGREYXRhfGhvc3RlZEZpZWxkc0ZpZWxkRGF0YX0gZm9yIHRoZSBleHBpcmF0aW9uIHllYXIgZmllbGQsIGlmIGl0IGlzIHByZXNlbnQuXG4gKiBAcHJvcGVydHkgez9Ib3N0ZWRGaWVsZHN+aG9zdGVkRmllbGRzRmllbGREYXRhfSBmaWVsZHMucG9zdGFsQ29kZSB7QGxpbmsgSG9zdGVkRmllbGRzfmhvc3RlZEZpZWxkc0ZpZWxkRGF0YXxob3N0ZWRGaWVsZHNGaWVsZERhdGF9IGZvciB0aGUgcG9zdGFsIGNvZGUgZmllbGQsIGlmIGl0IGlzIHByZXNlbnQuXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7b2JqZWN0fSBIb3N0ZWRGaWVsZHN+aG9zdGVkRmllbGRzRmllbGREYXRhXG4gKiBAZGVzY3JpcHRpb24gRGF0YSBhYm91dCBIb3N0ZWQgRmllbGRzIGZpZWxkcywgc2VudCBpbiB7QGxpbmsgSG9zdGVkRmllbGRzfnN0YXRlT2JqZWN0fHN0YXRlT2JqZWN0c30uXG4gKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSBjb250YWluZXIgUmVmZXJlbmNlIHRvIHRoZSBjb250YWluZXIgRE9NIGVsZW1lbnQgb24geW91ciBwYWdlIGFzc29jaWF0ZWQgd2l0aCB0aGUgY3VycmVudCBldmVudC5cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gaXNGb2N1c2VkIFdoZXRoZXIgb3Igbm90IHRoZSBpbnB1dCBpcyBjdXJyZW50bHkgZm9jdXNlZC5cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gaXNFbXB0eSBXaGV0aGVyIG9yIG5vdCB0aGUgdXNlciBoYXMgZW50ZXJlZCBhIHZhbHVlIGluIHRoZSBpbnB1dC5cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gaXNQb3RlbnRpYWxseVZhbGlkXG4gKiBBIGRldGVybWluYXRpb24gYmFzZWQgb24gdGhlIGZ1dHVyZSB2YWxpZGl0eSBvZiB0aGUgaW5wdXQgdmFsdWUuXG4gKiBUaGlzIGlzIGhlbHBmdWwgd2hlbiBhIHVzZXIgaXMgZW50ZXJpbmcgYSBjYXJkIG51bWJlciBhbmQgdHlwZXMgPGNvZGU+XCI0MVwiPC9jb2RlPi5cbiAqIFdoaWxlIHRoYXQgdmFsdWUgaXMgbm90IHZhbGlkIGZvciBzdWJtaXNzaW9uLCBpdCBpcyBzdGlsbCBwb3NzaWJsZSBmb3JcbiAqIGl0IHRvIGJlY29tZSBhIGZ1bGx5IHF1YWxpZmllZCBlbnRyeS4gSG93ZXZlciwgaWYgdGhlIHVzZXIgZW50ZXJzIDxjb2RlPlwiNHhcIjwvY29kZT5cbiAqIGl0IGlzIGNsZWFyIHRoYXQgdGhlIGNhcmQgbnVtYmVyIGNhbiBuZXZlciBiZWNvbWUgdmFsaWQgYW5kIGlzUG90ZW50aWFsbHlWYWxpZCB3aWxsXG4gKiByZXR1cm4gZmFsc2UuXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IGlzVmFsaWQgV2hldGhlciBvciBub3QgdGhlIHZhbHVlIG9mIHRoZSBhc3NvY2lhdGVkIGlucHV0IGlzIDxpPmZ1bGx5PC9pPiBxdWFsaWZpZWQgZm9yIHN1Ym1pc3Npb24uXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7b2JqZWN0fSBIb3N0ZWRGaWVsZHN+aG9zdGVkRmllbGRzQ2FyZFxuICogQGRlc2NyaXB0aW9uIEluZm9ybWF0aW9uIGFib3V0IHRoZSBjYXJkIHR5cGUsIHNlbnQgaW4ge0BsaW5rIEhvc3RlZEZpZWxkc35zdGF0ZU9iamVjdHxzdGF0ZU9iamVjdHN9LlxuICogQHByb3BlcnR5IHtzdHJpbmd9IHR5cGUgVGhlIGNvZGUtZnJpZW5kbHkgcmVwcmVzZW50YXRpb24gb2YgdGhlIGNhcmQgdHlwZS4gSXQgd2lsbCBiZSBvbmUgb2YgdGhlIGZvbGxvd2luZyBzdHJpbmdzOlxuICogLSBgYW1lcmljYW4tZXhwcmVzc2BcbiAqIC0gYGRpbmVycy1jbHViYFxuICogLSBgZGlzY292ZXJgXG4gKiAtIGBqY2JgXG4gKiAtIGBtYWVzdHJvYFxuICogLSBgbWFzdGVyLWNhcmRgXG4gKiAtIGB1bmlvbnBheWBcbiAqIC0gYHZpc2FgXG4gKiBAcHJvcGVydHkge3N0cmluZ30gbmljZVR5cGUgVGhlIHByZXR0eS1wcmludGVkIGNhcmQgdHlwZS4gSXQgd2lsbCBiZSBvbmUgb2YgdGhlIGZvbGxvd2luZyBzdHJpbmdzOlxuICogLSBgQW1lcmljYW4gRXhwcmVzc2BcbiAqIC0gYERpbmVycyBDbHViYFxuICogLSBgRGlzY292ZXJgXG4gKiAtIGBKQ0JgXG4gKiAtIGBNYWVzdHJvYFxuICogLSBgTWFzdGVyQ2FyZGBcbiAqIC0gYFVuaW9uUGF5YFxuICogLSBgVmlzYWBcbiAqIEBwcm9wZXJ0eSB7b2JqZWN0fSBjb2RlXG4gKiBUaGlzIG9iamVjdCBjb250YWlucyBkYXRhIHJlbGV2YW50IHRvIHRoZSBzZWN1cml0eSBjb2RlIHJlcXVpcmVtZW50cyBvZiB0aGUgY2FyZCBicmFuZC5cbiAqIEZvciBleGFtcGxlLCBvbiBhIFZpc2EgY2FyZCB0aGVyZSB3aWxsIGJlIGEgPGNvZGU+Q1ZWPC9jb2RlPiBvZiAzIGRpZ2l0cywgd2hlcmVhcyBhblxuICogQW1lcmljYW4gRXhwcmVzcyBjYXJkIHJlcXVpcmVzIGEgNC1kaWdpdCA8Y29kZT5DSUQ8L2NvZGU+LlxuICogQHByb3BlcnR5IHtzdHJpbmd9IGNvZGUubmFtZSA8Y29kZT5cIkNWVlwiPC9jb2RlPiA8Y29kZT5cIkNJRFwiPC9jb2RlPiA8Y29kZT5cIkNWQ1wiPC9jb2RlPlxuICogQHByb3BlcnR5IHtudW1iZXJ9IGNvZGUuc2l6ZSBUaGUgZXhwZWN0ZWQgbGVuZ3RoIG9mIHRoZSBzZWN1cml0eSBjb2RlLiBUeXBpY2FsbHksIHRoaXMgaXMgMyBvciA0LlxuICovXG5cbi8qKlxuICogQG5hbWUgSG9zdGVkRmllbGRzI29uXG4gKiBAZnVuY3Rpb25cbiAqIEBwYXJhbSB7c3RyaW5nfSBldmVudCBUaGUgbmFtZSBvZiB0aGUgZXZlbnQgdG8gd2hpY2ggeW91IGFyZSBzdWJzY3JpYmluZy5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGhhbmRsZXIgQSBjYWxsYmFjayB0byBoYW5kbGUgdGhlIGV2ZW50LlxuICogQGRlc2NyaXB0aW9uIFN1YnNjcmliZXMgYSBoYW5kbGVyIGZ1bmN0aW9uIHRvIGEgbmFtZWQgZXZlbnQuIGBldmVudGAgc2hvdWxkIGJlIHtAbGluayBIb3N0ZWRGaWVsZHMjZXZlbnQ6Ymx1cnxibHVyfSwge0BsaW5rIEhvc3RlZEZpZWxkcyNldmVudDpmb2N1c3xmb2N1c30sIHtAbGluayBIb3N0ZWRGaWVsZHMjZXZlbnQ6ZW1wdHl8ZW1wdHl9LCB7QGxpbmsgSG9zdGVkRmllbGRzI2V2ZW50Om5vdEVtcHR5fG5vdEVtcHR5fSwge0BsaW5rIEhvc3RlZEZpZWxkcyNldmVudDpjYXJkVHlwZUNoYW5nZXxjYXJkVHlwZUNoYW5nZX0sIG9yIHtAbGluayBIb3N0ZWRGaWVsZHMjZXZlbnQ6dmFsaWRpdHlDaGFuZ2V8dmFsaWRpdHlDaGFuZ2V9LiBFdmVudHMgd2lsbCBlbWl0IGEge0BsaW5rIEhvc3RlZEZpZWxkc35zdGF0ZU9iamVjdHxzdGF0ZU9iamVjdH0uXG4gKiBAZXhhbXBsZVxuICogPGNhcHRpb24+TGlzdGVuaW5nIHRvIGEgSG9zdGVkIEZpZWxkIGV2ZW50LCBpbiB0aGlzIGNhc2UgJ2ZvY3VzJzwvY2FwdGlvbj5cbiAqIGhvc3RlZEZpZWxkcy5jcmVhdGUoeyAuLi4gfSwgZnVuY3Rpb24gKGNyZWF0ZUVyciwgaG9zdGVkRmllbGRzSW5zdGFuY2UpIHtcbiAqICAgaG9zdGVkRmllbGRzSW5zdGFuY2Uub24oJ2ZvY3VzJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gKiAgICAgY29uc29sZS5sb2coZXZlbnQuZW1pdHRlZEJ5LCAnaGFzIGJlZW4gZm9jdXNlZCcpO1xuICogICB9KTtcbiAqIH0pO1xuICogQHJldHVybnMge3ZvaWR9XG4gKi9cblxuLyoqXG4gKiBUaGlzIGV2ZW50IGlzIGVtaXR0ZWQgd2hlbiB0aGUgdXNlciByZXF1ZXN0cyBzdWJtaXNzaW9uIG9mIGFuIGlucHV0IGZpZWxkLCBzdWNoIGFzIGJ5IHByZXNzaW5nIHRoZSBFbnRlciBvciBSZXR1cm4ga2V5IG9uIHRoZWlyIGtleWJvYXJkLCBvciBtb2JpbGUgZXF1aXZhbGVudC5cbiAqIEBldmVudCBIb3N0ZWRGaWVsZHMjaW5wdXRTdWJtaXRSZXF1ZXN0XG4gKiBAdHlwZSB7SG9zdGVkRmllbGRzfnN0YXRlT2JqZWN0fVxuICogQGV4YW1wbGVcbiAqIDxjYXB0aW9uPkNsaWNraW5nIGEgc3VibWl0IGJ1dHRvbiB1cG9uIGhpdHRpbmcgRW50ZXIgKG9yIGVxdWl2YWxlbnQpIHdpdGhpbiBhIEhvc3RlZCBGaWVsZDwvY2FwdGlvbj5cbiAqIHZhciBob3N0ZWRGaWVsZHMgPSByZXF1aXJlKCdzZWFtbGVzc3BheS13ZWIvaG9zdGVkLWZpZWxkcycpO1xuICogdmFyIHN1Ym1pdEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9XCJzdWJtaXRcIl0nKTtcbiAqXG4gKiBob3N0ZWRGaWVsZHMuY3JlYXRlKHsgLi4uIH0sIGZ1bmN0aW9uIChjcmVhdGVFcnIsIGhvc3RlZEZpZWxkc0luc3RhbmNlKSB7XG4gKiAgIGhvc3RlZEZpZWxkc0luc3RhbmNlLm9uKCdpbnB1dFN1Ym1pdFJlcXVlc3QnLCBmdW5jdGlvbiAoKSB7XG4gKiAgICAgLy8gVXNlciByZXF1ZXN0ZWQgc3VibWlzc2lvbiwgZS5nLiBieSBwcmVzc2luZyBFbnRlciBvciBlcXVpdmFsZW50XG4gKiAgICAgc3VibWl0QnV0dG9uLmNsaWNrKCk7XG4gKiAgIH0pO1xuICogfSk7XG4gKi9cblxuLyoqXG4gKiBUaGlzIGV2ZW50IGlzIGVtaXR0ZWQgd2hlbiBhIGZpZWxkIHRyYW5zaXRpb25zIGZyb20gaGF2aW5nIGRhdGEgdG8gYmVpbmcgZW1wdHkuXG4gKiBAZXZlbnQgSG9zdGVkRmllbGRzI2VtcHR5XG4gKiBAdHlwZSB7SG9zdGVkRmllbGRzfnN0YXRlT2JqZWN0fVxuICogQGV4YW1wbGVcbiAqIDxjYXB0aW9uPkxpc3RlbmluZyB0byBhbiBlbXB0eSBldmVudDwvY2FwdGlvbj5cbiAqIGhvc3RlZEZpZWxkcy5jcmVhdGUoeyAuLi4gfSwgZnVuY3Rpb24gKGNyZWF0ZUVyciwgaG9zdGVkRmllbGRzSW5zdGFuY2UpIHtcbiAqICAgaG9zdGVkRmllbGRzSW5zdGFuY2Uub24oJ2VtcHR5JywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gKiAgICAgY29uc29sZS5sb2coZXZlbnQuZW1pdHRlZEJ5LCAnaXMgbm93IGVtcHR5Jyk7XG4gKiAgIH0pO1xuICogfSk7XG4gKi9cblxuLyoqXG4gKiBUaGlzIGV2ZW50IGlzIGVtaXR0ZWQgd2hlbiBhIGZpZWxkIHRyYW5zaXRpb25zIGZyb20gYmVpbmcgZW1wdHkgdG8gaGF2aW5nIGRhdGEuXG4gKiBAZXZlbnQgSG9zdGVkRmllbGRzI25vdEVtcHR5XG4gKiBAdHlwZSB7SG9zdGVkRmllbGRzfnN0YXRlT2JqZWN0fVxuICogQGV4YW1wbGVcbiAqIDxjYXB0aW9uPkxpc3RlbmluZyB0byBhbiBub3RFbXB0eSBldmVudDwvY2FwdGlvbj5cbiAqIGhvc3RlZEZpZWxkcy5jcmVhdGUoeyAuLi4gfSwgZnVuY3Rpb24gKGNyZWF0ZUVyciwgaG9zdGVkRmllbGRzSW5zdGFuY2UpIHtcbiAqICAgaG9zdGVkRmllbGRzSW5zdGFuY2Uub24oJ25vdEVtcHR5JywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gKiAgICAgY29uc29sZS5sb2coZXZlbnQuZW1pdHRlZEJ5LCAnaXMgbm93IG5vdCBlbXB0eScpO1xuICogICB9KTtcbiAqIH0pO1xuICovXG5cbi8qKlxuICogVGhpcyBldmVudCBpcyBlbWl0dGVkIHdoZW4gYSBmaWVsZCBsb3NlcyBmb2N1cy5cbiAqIEBldmVudCBIb3N0ZWRGaWVsZHMjYmx1clxuICogQHR5cGUge0hvc3RlZEZpZWxkc35zdGF0ZU9iamVjdH1cbiAqIEBleGFtcGxlXG4gKiA8Y2FwdGlvbj5MaXN0ZW5pbmcgdG8gYSBibHVyIGV2ZW50PC9jYXB0aW9uPlxuICogaG9zdGVkRmllbGRzLmNyZWF0ZSh7IC4uLiB9LCBmdW5jdGlvbiAoY3JlYXRlRXJyLCBob3N0ZWRGaWVsZHNJbnN0YW5jZSkge1xuICogICBob3N0ZWRGaWVsZHNJbnN0YW5jZS5vbignYmx1cicsIGZ1bmN0aW9uIChldmVudCkge1xuICogICAgIGNvbnNvbGUubG9nKGV2ZW50LmVtaXR0ZWRCeSwgJ2xvc3QgZm9jdXMnKTtcbiAqICAgfSk7XG4gKiB9KTtcbiAqL1xuXG4vKipcbiAqIFRoaXMgZXZlbnQgaXMgZW1pdHRlZCB3aGVuIGEgZmllbGQgZ2FpbnMgZm9jdXMuXG4gKiBAZXZlbnQgSG9zdGVkRmllbGRzI2ZvY3VzXG4gKiBAdHlwZSB7SG9zdGVkRmllbGRzfnN0YXRlT2JqZWN0fVxuICogQGV4YW1wbGVcbiAqIDxjYXB0aW9uPkxpc3RlbmluZyB0byBhIGZvY3VzIGV2ZW50PC9jYXB0aW9uPlxuICogaG9zdGVkRmllbGRzLmNyZWF0ZSh7IC4uLiB9LCBmdW5jdGlvbiAoY3JlYXRlRXJyLCBob3N0ZWRGaWVsZHNJbnN0YW5jZSkge1xuICogICBob3N0ZWRGaWVsZHNJbnN0YW5jZS5vbignZm9jdXMnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAqICAgICBjb25zb2xlLmxvZyhldmVudC5lbWl0dGVkQnksICdnYWluZWQgZm9jdXMnKTtcbiAqICAgfSk7XG4gKiB9KTtcbiAqL1xuXG4vKipcbiAqIFRoaXMgZXZlbnQgaXMgZW1pdHRlZCB3aGVuIGFjdGl2aXR5IHdpdGhpbiB0aGUgbnVtYmVyIGZpZWxkIGhhcyBjaGFuZ2VkIHN1Y2ggdGhhdCB0aGUgcG9zc2libGUgY2FyZCB0eXBlIGhhcyBjaGFuZ2VkLlxuICogQGV2ZW50IEhvc3RlZEZpZWxkcyNjYXJkVHlwZUNoYW5nZVxuICogQHR5cGUge0hvc3RlZEZpZWxkc35zdGF0ZU9iamVjdH1cbiAqIEBleGFtcGxlXG4gKiA8Y2FwdGlvbj5MaXN0ZW5pbmcgdG8gYSBjYXJkVHlwZUNoYW5nZSBldmVudDwvY2FwdGlvbj5cbiAqIGhvc3RlZEZpZWxkcy5jcmVhdGUoeyAuLi4gfSwgZnVuY3Rpb24gKGNyZWF0ZUVyciwgaG9zdGVkRmllbGRzSW5zdGFuY2UpIHtcbiAqICAgaG9zdGVkRmllbGRzSW5zdGFuY2Uub24oJ2NhcmRUeXBlQ2hhbmdlJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gKiAgICAgaWYgKGV2ZW50LmNhcmRzLmxlbmd0aCA9PT0gMSkge1xuICogICAgICAgY29uc29sZS5sb2coZXZlbnQuY2FyZHNbMF0udHlwZSk7XG4gKiAgICAgfSBlbHNlIHtcbiAqICAgICAgIGNvbnNvbGUubG9nKCdUeXBlIG9mIGNhcmQgbm90IHlldCBrbm93bicpO1xuICogICAgIH1cbiAqICAgfSk7XG4gKiB9KTtcbiAqL1xuXG4vKipcbiAqIFRoaXMgZXZlbnQgaXMgZW1pdHRlZCB3aGVuIHRoZSB2YWxpZGl0eSBvZiBhIGZpZWxkIGhhcyBjaGFuZ2VkLiBWYWxpZGl0eSBpcyByZXByZXNlbnRlZCBpbiB0aGUge0BsaW5rIEhvc3RlZEZpZWxkc35zdGF0ZU9iamVjdHxzdGF0ZU9iamVjdH0gYXMgdHdvIGJvb2xlYW5zOiBgaXNWYWxpZGAgYW5kIGBpc1BvdGVudGlhbGx5VmFsaWRgLlxuICogQGV2ZW50IEhvc3RlZEZpZWxkcyN2YWxpZGl0eUNoYW5nZVxuICogQHR5cGUge0hvc3RlZEZpZWxkc35zdGF0ZU9iamVjdH1cbiAqIEBleGFtcGxlXG4gKiA8Y2FwdGlvbj5MaXN0ZW5pbmcgdG8gYSB2YWxpZGl0eUNoYW5nZSBldmVudDwvY2FwdGlvbj5cbiAqIGhvc3RlZEZpZWxkcy5jcmVhdGUoeyAuLi4gfSwgZnVuY3Rpb24gKGNyZWF0ZUVyciwgaG9zdGVkRmllbGRzSW5zdGFuY2UpIHtcbiAqICAgaG9zdGVkRmllbGRzSW5zdGFuY2Uub24oJ3ZhbGlkaXR5Q2hhbmdlJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gKiAgICAgdmFyIGZpZWxkID0gZXZlbnQuZmllbGRzW2V2ZW50LmVtaXR0ZWRCeV07XG4gKlxuICogICAgIGlmIChmaWVsZC5pc1ZhbGlkKSB7XG4gKiAgICAgICBjb25zb2xlLmxvZyhldmVudC5lbWl0dGVkQnksICdpcyBmdWxseSB2YWxpZCcpO1xuICogICAgIH0gZWxzZSBpZiAoZmllbGQuaXNQb3RlbnRpYWxseVZhbGlkKSB7XG4gKiAgICAgICBjb25zb2xlLmxvZyhldmVudC5lbWl0dGVkQnksICdpcyBwb3RlbnRpYWxseSB2YWxpZCcpO1xuICogICAgIH0gZWxzZSB7XG4gKiAgICAgICBjb25zb2xlLmxvZyhldmVudC5lbWl0dGVkQnksICdpcyBub3QgdmFsaWQnKTtcbiAqICAgICB9XG4gKiAgIH0pO1xuICogfSk7XG4gKi9cblxuZnVuY3Rpb24gY3JlYXRlSW5wdXRFdmVudEhhbmRsZXIoZmllbGRzKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoZXZlbnREYXRhKSB7XG4gICAgdmFyIGZpZWxkO1xuICAgIHZhciBtZXJjaGFudFBheWxvYWQgPSBldmVudERhdGEubWVyY2hhbnRQYXlsb2FkO1xuICAgIHZhciBlbWl0dGVkQnkgPSBtZXJjaGFudFBheWxvYWQuZW1pdHRlZEJ5O1xuICAgIHZhciBjb250YWluZXIgPSBmaWVsZHNbZW1pdHRlZEJ5XS5jb250YWluZXJFbGVtZW50O1xuXG4gICAgT2JqZWN0LmtleXMobWVyY2hhbnRQYXlsb2FkLmZpZWxkcykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICBtZXJjaGFudFBheWxvYWQuZmllbGRzW2tleV0uY29udGFpbmVyID0gZmllbGRzW2tleV0uY29udGFpbmVyRWxlbWVudDtcbiAgICB9KTtcblxuICAgIGZpZWxkID0gbWVyY2hhbnRQYXlsb2FkLmZpZWxkc1tlbWl0dGVkQnldO1xuXG4gICAgY2xhc3NsaXN0LnRvZ2dsZShjb250YWluZXIsIGNvbnN0YW50cy5leHRlcm5hbENsYXNzZXMuRk9DVVNFRCwgZmllbGQuaXNGb2N1c2VkKTtcbiAgICBjbGFzc2xpc3QudG9nZ2xlKGNvbnRhaW5lciwgY29uc3RhbnRzLmV4dGVybmFsQ2xhc3Nlcy5WQUxJRCwgZmllbGQuaXNWYWxpZCk7XG4gICAgY2xhc3NsaXN0LnRvZ2dsZShjb250YWluZXIsIGNvbnN0YW50cy5leHRlcm5hbENsYXNzZXMuSU5WQUxJRCwgIWZpZWxkLmlzUG90ZW50aWFsbHlWYWxpZCk7XG4gICAgY2xhc3NsaXN0LnRvZ2dsZShjb250YWluZXIsIGNvbnN0YW50cy5leHRlcm5hbENsYXNzZXMuUE9URU5USUFMTFlfVkFMSUQsIGZpZWxkLmlzUG90ZW50aWFsbHlWYWxpZCk7XG5cbiAgICB0aGlzLl9zdGF0ZSA9IHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1pbnZhbGlkLXRoaXNcbiAgICAgIGNhcmRzOiBtZXJjaGFudFBheWxvYWQuY2FyZHMsXG4gICAgICBmaWVsZHM6IG1lcmNoYW50UGF5bG9hZC5maWVsZHNcbiAgICB9O1xuXG4gICAgdGhpcy5fZW1pdChldmVudERhdGEudHlwZSwgbWVyY2hhbnRQYXlsb2FkKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1pbnZhbGlkLXRoaXNcbiAgfTtcbn1cblxuLyoqXG4gKiBAY2xhc3MgSG9zdGVkRmllbGRzXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyBUaGUgSG9zdGVkIEZpZWxkcyB7QGxpbmsgbW9kdWxlOnNlYW1sZXNzcGF5LXdlYi9ob3N0ZWQtZmllbGRzLmNyZWF0ZSBjcmVhdGV9IG9wdGlvbnMuXG4gKiBAZGVzY3JpcHRpb24gPHN0cm9uZz5EbyBub3QgdXNlIHRoaXMgY29uc3RydWN0b3IgZGlyZWN0bHkuIFVzZSB7QGxpbmsgbW9kdWxlOnNlYW1sZXNzcGF5LXdlYi9ob3N0ZWQtZmllbGRzLmNyZWF0ZXxzZWFtbGVzc3BheS13ZWIuaG9zdGVkLWZpZWxkcy5jcmVhdGV9IGluc3RlYWQuPC9zdHJvbmc+XG4gKiBAY2xhc3NkZXNjIFRoaXMgY2xhc3MgcmVwcmVzZW50cyBhIEhvc3RlZCBGaWVsZHMgY29tcG9uZW50IHByb2R1Y2VkIGJ5IHtAbGluayBtb2R1bGU6c2VhbWxlc3NwYXktd2ViL2hvc3RlZC1maWVsZHMuY3JlYXRlfHNlYW1sZXNzcGF5LXdlYi9ob3N0ZWQtZmllbGRzLmNyZWF0ZX0uIEluc3RhbmNlcyBvZiB0aGlzIGNsYXNzIGhhdmUgbWV0aG9kcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCB0aGUgaW5wdXQgZmllbGRzIHdpdGhpbiBIb3N0ZWQgRmllbGRzJyBpZnJhbWVzLlxuICovXG5mdW5jdGlvbiBIb3N0ZWRGaWVsZHMob3B0aW9ucykge1xuICB2YXIgY2xpZW50VmVyc2lvbiwgY2xpZW50Q29uZmlnO1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciBmaWVsZHMgPSB7fTtcbiAgdmFyIGZpZWxkQ291bnQgPSAwO1xuICB2YXIgY29tcG9uZW50SWQgPSB1dWlkKCk7XG4gIHZhciBhdmFpbGFibGVUeXBlcyA9IE9iamVjdC5rZXlzKGNvbnN0YW50cy5wYXltZW50VHlwZXMpLnJlZHVjZShmdW5jdGlvbihyZXN1bHQsIHR5cGVLZXkpIHtcbiAgICByZXN1bHQucHVzaChjb25zdGFudHMucGF5bWVudFR5cGVzW3R5cGVLZXldKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LFtdKVxuXG4gIGlmICghb3B0aW9ucy5wYXltZW50VHlwZSkge1xuICAgIHRocm93IG5ldyBTZWFtbGVzc3BheUVycm9yKHtcbiAgICAgIHR5cGU6IHNoYXJlZEVycm9ycy5JTlNUQU5USUFUSU9OX09QVElPTl9SRVFVSVJFRC50eXBlLFxuICAgICAgY29kZTogc2hhcmVkRXJyb3JzLklOU1RBTlRJQVRJT05fT1BUSU9OX1JFUVVJUkVELmNvZGUsXG4gICAgICBtZXNzYWdlOiAnb3B0aW9ucy5wYXltZW50VHlwZSBpcyByZXF1aXJlZCB3aGVuIGluc3RhbnRpYXRpbmcgSG9zdGVkIEZpZWxkcy4nXG4gICAgfSk7XG4gIH1cblxuICBpZiAoIX5hdmFpbGFibGVUeXBlcy5pbmRleE9mKG9wdGlvbnMucGF5bWVudFR5cGUpKSB7XG4gICAgdGhyb3cgbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgdHlwZTogc2hhcmVkRXJyb3JzLklOVkFMSURfT1BUSU9OLnR5cGUsXG4gICAgICBjb2RlOiBzaGFyZWRFcnJvcnMuSU5WQUxJRF9PUFRJT04uY29kZSxcbiAgICAgIG1lc3NhZ2U6ICdvcHRpb25zLnBheW1lbnRUeXBlIGlzIGludmFsaWQgKGFjY2VwdGFibGU6ICcgKyBhdmFpbGFibGVUeXBlcy5qb2luKCcsICcpICsgJykuJ1xuICAgIH0pO1xuICB9XG5cbiAgaWYgKCFvcHRpb25zLmNsaWVudCkge1xuICAgIHRocm93IG5ldyBTZWFtbGVzc3BheUVycm9yKHtcbiAgICAgIHR5cGU6IHNoYXJlZEVycm9ycy5JTlNUQU5USUFUSU9OX09QVElPTl9SRVFVSVJFRC50eXBlLFxuICAgICAgY29kZTogc2hhcmVkRXJyb3JzLklOU1RBTlRJQVRJT05fT1BUSU9OX1JFUVVJUkVELmNvZGUsXG4gICAgICBtZXNzYWdlOiAnb3B0aW9ucy5jbGllbnQgaXMgcmVxdWlyZWQgd2hlbiBpbnN0YW50aWF0aW5nIEhvc3RlZCBGaWVsZHMuJ1xuICAgIH0pO1xuICB9XG5cbiAgY2xpZW50Q29uZmlnID0gb3B0aW9ucy5jbGllbnQuZ2V0Q29uZmlndXJhdGlvbigpO1xuICBjbGllbnRWZXJzaW9uID0gY2xpZW50Q29uZmlnLmFuYWx5dGljc01ldGFkYXRhLnNka1ZlcnNpb247XG4gIGlmIChjbGllbnRWZXJzaW9uICE9PSBWRVJTSU9OKSB7XG4gICAgdGhyb3cgbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgdHlwZTogc2hhcmVkRXJyb3JzLklOQ09NUEFUSUJMRV9WRVJTSU9OUy50eXBlLFxuICAgICAgY29kZTogc2hhcmVkRXJyb3JzLklOQ09NUEFUSUJMRV9WRVJTSU9OUy5jb2RlLFxuICAgICAgbWVzc2FnZTogJ0NsaWVudCAodmVyc2lvbiAnICsgY2xpZW50VmVyc2lvbiArICcpIGFuZCBIb3N0ZWQgRmllbGRzICh2ZXJzaW9uICcgKyBWRVJTSU9OICsgJykgY29tcG9uZW50cyBtdXN0IGJlIGZyb20gdGhlIHNhbWUgU0RLIHZlcnNpb24uJ1xuICAgIH0pO1xuICB9XG5cbiAgaWYgKCFvcHRpb25zLmZpZWxkcykge1xuICAgIHRocm93IG5ldyBTZWFtbGVzc3BheUVycm9yKHtcbiAgICAgIHR5cGU6IHNoYXJlZEVycm9ycy5JTlNUQU5USUFUSU9OX09QVElPTl9SRVFVSVJFRC50eXBlLFxuICAgICAgY29kZTogc2hhcmVkRXJyb3JzLklOU1RBTlRJQVRJT05fT1BUSU9OX1JFUVVJUkVELmNvZGUsXG4gICAgICBtZXNzYWdlOiAnb3B0aW9ucy5maWVsZHMgaXMgcmVxdWlyZWQgd2hlbiBpbnN0YW50aWF0aW5nIEhvc3RlZCBGaWVsZHMuJ1xuICAgIH0pO1xuICB9XG5cbiAgY2hlY2tJbnRlZ3JpdHkob3B0aW9ucy5wYXltZW50VHlwZSwgT2JqZWN0LmtleXMob3B0aW9ucy5maWVsZHMpKTtcblxuICBFdmVudEVtaXR0ZXIuY2FsbCh0aGlzKTtcblxuICB0aGlzLl9wYXltZW50VHlwZSA9IG9wdGlvbnMucGF5bWVudFR5cGU7XG4gIHRoaXMuX2luamVjdGVkTm9kZXMgPSBbXTtcbiAgdGhpcy5fZGVzdHJ1Y3RvciA9IG5ldyBEZXN0cnVjdG9yKCk7XG4gIHRoaXMuX2ZpZWxkcyA9IGZpZWxkcztcbiAgdGhpcy5fc3VibWl0QnV0dG9uID0gb3B0aW9ucy5zdWJtaXRCdXR0b247XG4gIHRoaXMuX2FkZGl0aW9uYWxSZXF1ZXN0RGF0YSA9IG51bGw7XG4gIHRoaXMuX3N0YXRlID0ge1xuICAgIGZpZWxkczoge30sXG4gICAgY2FyZHM6IGdldENhcmRUeXBlcygnJylcbiAgfTtcblxuICB0aGlzLl9idXMgPSBuZXcgQnVzKHtcbiAgICBjaGFubmVsOiBjb21wb25lbnRJZCxcbiAgICBtZXJjaGFudFVybDogbG9jYXRpb24uaHJlZlxuICB9KTtcblxuICB0aGlzLl9kZXN0cnVjdG9yLnJlZ2lzdGVyRnVuY3Rpb25Gb3JUZWFyZG93bihcbiAgICBmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLl9idXMudGVhcmRvd24oKTtcbiAgICB9KTtcblxuICB0aGlzLl9jbGllbnQgPSBvcHRpb25zLmNsaWVudDtcblxuICBpZiAob3B0aW9ucy5zdWJtaXRCdXR0b24pIHtcbiAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihvcHRpb25zLnN1Ym1pdEJ1dHRvbi5zZWxlY3Rvcik7XG5cbiAgICBpZiAoIWNvbnRhaW5lcikge1xuICAgICAgdGhyb3cgbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgICB0eXBlOiBlcnJvcnMuSE9TVEVEX0ZJRUxEU19JTlZBTElEX1NVQk1JVF9CVVRUT05fU0VMRUNUT1IudHlwZSxcbiAgICAgICAgY29kZTogZXJyb3JzLkhPU1RFRF9GSUVMRFNfSU5WQUxJRF9TVUJNSVRfQlVUVE9OX1NFTEVDVE9SLmNvZGUsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9ycy5IT1NURURfRklFTERTX0lOVkFMSURfU1VCTUlUX0JVVFRPTl9TRUxFQ1RPUi5tZXNzYWdlLFxuICAgICAgICBkZXRhaWxzOiB7XG4gICAgICAgICAgZmllbGRTZWxlY3Rvcjogb3B0aW9ucy5zdWJtaXRCdXR0b24uc2VsZWN0b3JcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgb3B0aW9ucy5zdWJtaXRCdXR0b24gPSB7IGNvbnRhaW5lckVsZW1lbnQ6IGNvbnRhaW5lciB9O1xuICAgIHRoaXMuX3N1Ym1pdEJ1dHRvbiA9IHsgY29udGFpbmVyOiBjb250YWluZXIgfTtcbiAgICB0aGlzLl9zZXR1cFN1Ym1pdEJ1dHRvbihjb250YWluZXIpO1xuICB9XG5cbiAgT2JqZWN0LmtleXMob3B0aW9ucy5maWVsZHMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgIHZhciBmaWVsZCwgY29udGFpbmVyLCBmcmFtZTtcblxuICAgIGlmICghc2VsZi5nZXRXaGl0ZWxpc3RlZEZpZWxkcygpLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIHRocm93IG5ldyBTZWFtbGVzc3BheUVycm9yKHtcbiAgICAgICAgdHlwZTogZXJyb3JzLkhPU1RFRF9GSUVMRFNfSU5WQUxJRF9GSUVMRF9LRVkudHlwZSxcbiAgICAgICAgY29kZTogZXJyb3JzLkhPU1RFRF9GSUVMRFNfSU5WQUxJRF9GSUVMRF9LRVkuY29kZSxcbiAgICAgICAgbWVzc2FnZTogJ1wiJyArIGtleSArICdcIiBpcyBub3QgYSB2YWxpZCBmaWVsZC4nXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmaWVsZCA9IG9wdGlvbnMuZmllbGRzW2tleV07XG5cbiAgICBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGZpZWxkLnNlbGVjdG9yKTtcblxuICAgIGlmICghY29udGFpbmVyKSB7XG4gICAgICB0aHJvdyBuZXcgU2VhbWxlc3NwYXlFcnJvcih7XG4gICAgICAgIHR5cGU6IGVycm9ycy5IT1NURURfRklFTERTX0lOVkFMSURfRklFTERfU0VMRUNUT1IudHlwZSxcbiAgICAgICAgY29kZTogZXJyb3JzLkhPU1RFRF9GSUVMRFNfSU5WQUxJRF9GSUVMRF9TRUxFQ1RPUi5jb2RlLFxuICAgICAgICBtZXNzYWdlOiBlcnJvcnMuSE9TVEVEX0ZJRUxEU19JTlZBTElEX0ZJRUxEX1NFTEVDVE9SLm1lc3NhZ2UsXG4gICAgICAgIGRldGFpbHM6IHtcbiAgICAgICAgICBmaWVsZFNlbGVjdG9yOiBmaWVsZC5zZWxlY3RvcixcbiAgICAgICAgICBmaWVsZEtleToga2V5XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2lmcmFtZVtuYW1lXj1cInNlYW1sZXNzcGF5LVwiXScpKSB7XG4gICAgICB0aHJvdyBuZXcgU2VhbWxlc3NwYXlFcnJvcih7XG4gICAgICAgIHR5cGU6IGVycm9ycy5IT1NURURfRklFTERTX0ZJRUxEX0RVUExJQ0FURV9JRlJBTUUudHlwZSxcbiAgICAgICAgY29kZTogZXJyb3JzLkhPU1RFRF9GSUVMRFNfRklFTERfRFVQTElDQVRFX0lGUkFNRS5jb2RlLFxuICAgICAgICBtZXNzYWdlOiBlcnJvcnMuSE9TVEVEX0ZJRUxEU19GSUVMRF9EVVBMSUNBVEVfSUZSQU1FLm1lc3NhZ2UsXG4gICAgICAgIGRldGFpbHM6IHtcbiAgICAgICAgICBmaWVsZFNlbGVjdG9yOiBmaWVsZC5zZWxlY3RvcixcbiAgICAgICAgICBmaWVsZEtleToga2V5XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZyYW1lID0gaUZyYW1lcih7XG4gICAgICB0eXBlOiBrZXksXG4gICAgICBuYW1lOiAnc2VhbWxlc3NwYXktaG9zdGVkLWZpZWxkLScgKyBrZXksXG4gICAgICBzdHlsZTogY29uc3RhbnRzLmRlZmF1bHRJRnJhbWVTdHlsZSxcbiAgICAgIHRpdGxlOiAnaG9zdGVkLWZpZWxkJ1xuICAgIH0pO1xuXG4gICAgdGhpcy5faW5qZWN0ZWROb2RlcyA9IHRoaXMuX2luamVjdGVkTm9kZXMuY29uY2F0KGluamVjdEZyYW1lKGZyYW1lLCBjb250YWluZXIpKTtcbiAgICB0aGlzLl9zZXR1cExhYmVsRm9jdXMoa2V5LCBjb250YWluZXIpO1xuICAgIGZpZWxkc1trZXldID0ge1xuICAgICAgZnJhbWVFbGVtZW50OiBmcmFtZSxcbiAgICAgIGNvbnRhaW5lckVsZW1lbnQ6IGNvbnRhaW5lclxuICAgIH07XG4gICAgZmllbGRDb3VudCsrO1xuXG4gICAgdGhpcy5fc3RhdGUuZmllbGRzW2tleV0gPSB7XG4gICAgICBpc0VtcHR5OiB0cnVlLFxuICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgICBpc1BvdGVudGlhbGx5VmFsaWQ6IHRydWUsXG4gICAgICBpc0ZvY3VzZWQ6IGZhbHNlLFxuICAgICAgY29udGFpbmVyOiBjb250YWluZXJcbiAgICB9O1xuXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBmcmFtZS5zcmMgPSBjb21wb3NlVXJsKGNsaWVudENvbmZpZywgJ2hvc3RlZC1maWVsZHMnLCBjb21wb25lbnRJZCwgY2xpZW50Q29uZmlnLmlzRGVidWcpO1xuICAgIH0sIDApO1xuICB9LmJpbmQodGhpcykpO1xuXG4gIHRoaXMuX2J1cy5vbihldmVudHMuRlJBTUVfUkVBRFksIGZ1bmN0aW9uIChyZXBseSkge1xuICAgIGZpZWxkQ291bnQtLTtcbiAgICBpZiAoZmllbGRDb3VudCA9PT0gMCkge1xuICAgICAgcmVwbHkob3B0aW9ucyk7XG4gICAgICBzZWxmLl9lbWl0KCdyZWFkeScpO1xuICAgIH1cbiAgfSk7XG5cbiAgdGhpcy5fYnVzLm9uKFxuICAgIGV2ZW50cy5JTlBVVF9FVkVOVCxcbiAgICBjcmVhdGVJbnB1dEV2ZW50SGFuZGxlcihmaWVsZHMpLmJpbmQodGhpcylcbiAgKTtcblxuICB0aGlzLl9kZXN0cnVjdG9yLnJlZ2lzdGVyRnVuY3Rpb25Gb3JUZWFyZG93bihmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGosIG5vZGUsIHBhcmVudDtcblxuICAgIGZvciAoaiA9IDA7IGogPCBzZWxmLl9pbmplY3RlZE5vZGVzLmxlbmd0aDsgaisrKSB7XG4gICAgICBub2RlID0gc2VsZi5faW5qZWN0ZWROb2Rlc1tqXTtcbiAgICAgIHBhcmVudCA9IG5vZGUucGFyZW50Tm9kZTtcblxuICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKG5vZGUpO1xuXG4gICAgICBjbGFzc2xpc3QucmVtb3ZlKFxuICAgICAgICBwYXJlbnQsXG4gICAgICAgIGNvbnN0YW50cy5leHRlcm5hbENsYXNzZXMuUE9URU5USUFMTFlfVkFMSUQsXG4gICAgICAgIGNvbnN0YW50cy5leHRlcm5hbENsYXNzZXMuRk9DVVNFRCxcbiAgICAgICAgY29uc3RhbnRzLmV4dGVybmFsQ2xhc3Nlcy5JTlZBTElELFxuICAgICAgICBjb25zdGFudHMuZXh0ZXJuYWxDbGFzc2VzLlZBTElEXG4gICAgICApO1xuICAgIH1cbiAgfSk7XG5cbiAgdGhpcy5fZGVzdHJ1Y3Rvci5yZWdpc3RlckZ1bmN0aW9uRm9yVGVhcmRvd24oZnVuY3Rpb24gKCkge1xuICAgIHZhciBtZXRob2ROYW1lcyA9IG1ldGhvZHMoSG9zdGVkRmllbGRzLnByb3RvdHlwZSkuY29uY2F0KG1ldGhvZHMoRXZlbnRFbWl0dGVyLnByb3RvdHlwZSkpO1xuXG4gICAgY29udmVydE1ldGhvZHNUb0Vycm9yKHNlbGYsIG1ldGhvZE5hbWVzKTtcbiAgfSk7XG59XG5cbkhvc3RlZEZpZWxkcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEV2ZW50RW1pdHRlci5wcm90b3R5cGUsIHtcbiAgY29uc3RydWN0b3I6IEhvc3RlZEZpZWxkc1xufSk7XG5cbkhvc3RlZEZpZWxkcy5wcm90b3R5cGUuZ2V0V2hpdGVsaXN0ZWRGaWVsZHMgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBnZXRXaGl0ZWxpc3RlZEZpZWxkcyh0aGlzLl9wYXltZW50VHlwZSk7XG59O1xuXG5Ib3N0ZWRGaWVsZHMucHJvdG90eXBlLl9zZXR1cFN1Ym1pdEJ1dHRvbiA9IGZ1bmN0aW9uIChjb250YWluZXIpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgc3VibWl0QnV0dG9uID0gY29udGFpbmVyO1xuXG4gIGlmICghc3VibWl0QnV0dG9uKSB7IHJldHVybjsgfVxuXG4gIHN1Ym1pdEJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyk7XG5cbiAgdGhpcy5fYnVzLm9uKFxuICAgIGV2ZW50cy5JTlBVVF9FVkVOVCxcbiAgICBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoc2VsZi5pc0Zvcm1WYWxpZCgpKSB7XG4gICAgICAgIHN1Ym1pdEJ1dHRvbi5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdWJtaXRCdXR0b24uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICdkaXNhYmxlZCcpO1xuICAgICAgfVxuICAgIH1cbiAgKTtcblxuICBmdW5jdGlvbiB0cmlnZ2VyU3VibWl0QnV0dG9uKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBzZWxmLl90cmlnZ2VySGFuZGxlckZuKHNlbGYuX3Rva2VuaXplUmVxdWVzdEhhbmRsZXIsIHNlbGYpO1xuXG4gICAgcmV0dXJuIHNlbGYudG9rZW5pemUuY2FsbChzZWxmLCBzZWxmLl9hZGRpdGlvbmFsUmVxdWVzdERhdGEpXG4gICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICByZXR1cm4gc2VsZi5fdHJpZ2dlckhhbmRsZXJGbihzZWxmLl90b2tlbml6ZVJlc3BvbnNlSGFuZGxlciwgbnVsbCwgcmVzcG9uc2UpO1xuICAgIH0pXG4gICAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgcmV0dXJuIHNlbGYuX3RyaWdnZXJIYW5kbGVyRm4oc2VsZi5fdG9rZW5pemVSZXNwb25zZUhhbmRsZXIsIGVycm9yLCBudWxsKTtcbiAgICB9KTtcbiAgfVxuXG4gIHN1Ym1pdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRyaWdnZXJTdWJtaXRCdXR0b24pO1xuXG4gIHRoaXMuX2Rlc3RydWN0b3IucmVnaXN0ZXJGdW5jdGlvbkZvclRlYXJkb3duKGZ1bmN0aW9uICgpIHtcbiAgICBzdWJtaXRCdXR0b24ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0cmlnZ2VyU3VibWl0QnV0dG9uKTtcbiAgfSk7XG5cbn07XG5cbkhvc3RlZEZpZWxkcy5wcm90b3R5cGUuX3RyaWdnZXJIYW5kbGVyRm4gPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICB2YXIgZm4gPSBhcmdzLnNoaWZ0KCk7XG5cbiAgaWYgKHR5cGVvZiBmbiAhPT0gJ2Z1bmN0aW9uJykgeyByZXR1cm47IH1cblxuICB0cnkge1xuICAgIGZuLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHRocm93IGVycm9yO1xuICB9XG59O1xuXG4vKipcbiAqIFNldCBhZGRpdGlvbmFsIGRhdGEgdG8gYmUgc2VudCB3aXRoIHRoZSB0b2tlbml6YXRpb24gcmVxdWVzdC5cbiAqIEBwdWJsaWNcbiAqIEBmdW5jdGlvblxuICogQHBhcmFtIHtvYmplY3R9IGRhdGEgQWRkaXRpb25hbCBkYXRhIHRvIGJlIHNlbnQgd2l0aCB0aGUgdG9rZW5pemF0aW9uIHJlcXVlc3QuXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqXG4gKiBAZXhhbXBsZVxuICogaG9zdGVkRmllbGRzSW5zdGFuY2Uuc2V0QWRkaXRpb25hbFJlcXVlc3REYXRhKHtcbiAqICAgYmlsbGluZ0FkZHJlc3M6IHtcbiAqICAgIHBvc3RhbENvZGU6ICc2MDY1NCdcbiAqICAgfVxuICogfSk7XG4gKlxuICovXG5Ib3N0ZWRGaWVsZHMucHJvdG90eXBlLnNldEFkZGl0aW9uYWxSZXF1ZXN0RGF0YSA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gIHRoaXMuX2FkZGl0aW9uYWxSZXF1ZXN0RGF0YSA9IGRhdGE7XG59O1xuXG4vKipcbiAqIEFkZCBhIHRva2VuaXplIHJlcXVlc3QgaGFuZGxlci4gVGhpcyBoYW5kbGVyIHdpbGwgYmUgY2FsbGVkIGFmdGVyIHRoZSBIb3N0ZWQgRmllbGRzIGZvcm0gaXMgc3VibWl0dGVkLCBiZWZvcmUgdGhlIHRva2VuaXplIHJlcXVlc3QgaXMgc2VudC5cbiAqIEBwdWJsaWNcbiAqIEBmdW5jdGlvblxuICogQHBhcmFtIHtjYWxsYmFja30gaGFuZGxlciBUaGUgY2FsbGJhY2sgdG8gYmUgY2FsbGVkIGJlZm9yZSBzZW5kaW5nIHRoZSB0b2tlbml6ZSByZXF1ZXN0LlxuICogQHJldHVybnMge3ZvaWR9XG4gKiBAZXhhbXBsZVxuICogaG9zdGVkRmllbGRzSW5zdGFuY2UuYWRkVG9rZW5pemVSZXF1ZXN0SGFuZGxlcihmdW5jdGlvbiAoKSB7XG4gKiAgLy8gSGFuZGxlIGZvcm0gc3VibWlzc2lvblxuICogfSk7XG4qL1xuSG9zdGVkRmllbGRzLnByb3RvdHlwZS5hZGRUb2tlbml6ZVJlcXVlc3RIYW5kbGVyID0gZnVuY3Rpb24gKGhhbmRsZXIpIHtcbiAgaWYgKHR5cGVvZiBoYW5kbGVyICE9PSAnZnVuY3Rpb24nKSB7IHJldHVybjsgfVxuICB0aGlzLl90b2tlbml6ZVJlcXVlc3RIYW5kbGVyID0gaGFuZGxlcjtcbn07XG5cbi8qKlxuICogQWRkIGEgdG9rZW5pemUgcmVzcG9uc2UgaGFuZGxlci4gVGhpcyBoYW5kbGVyIHdpbGwgYmUgY2FsbGVkIGFmdGVyIHRoZSB0b2tlbml6ZSByZXNwb25zZSBpcyByZWNlaXZlZC5cbiAqIEBwdWJsaWNcbiAqIEBmdW5jdGlvblxuICogQHBhcmFtIHtjYWxsYmFja30gaGFuZGxlciBUaGUgY2FsbGJhY2sgdG8gYmUgY2FsbGVkIGFmdGVyIHRoZSB0b2tlbml6ZSByZXNwb25zZSBpcyByZWNlaXZlZC5cbiAqIEByZXR1cm5zIHt2b2lkfVxuICogQGV4YW1wbGVcbiAqIGhvc3RlZEZpZWxkc0luc3RhbmNlLmFkZFRva2VuaXplUmVzcG9uc2VIYW5kbGVyKGZ1bmN0aW9uIChlcnJvciwgcmVzcG9uc2UpIHtcbiAqICAgaWYgKGVycm9yKSB7XG4gKiAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gKiAgIH0gZWxzZSB7XG4gKiAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICogICB9XG4gKiB9KTtcbiAqL1xuSG9zdGVkRmllbGRzLnByb3RvdHlwZS5hZGRUb2tlbml6ZVJlc3BvbnNlSGFuZGxlciA9IGZ1bmN0aW9uIChoYW5kbGVyKSB7XG4gIGlmICh0eXBlb2YgaGFuZGxlciAhPT0gJ2Z1bmN0aW9uJykgeyByZXR1cm47IH1cbiAgdGhpcy5fdG9rZW5pemVSZXNwb25zZUhhbmRsZXIgPSBoYW5kbGVyO1xufTtcblxuSG9zdGVkRmllbGRzLnByb3RvdHlwZS5fc2V0dXBMYWJlbEZvY3VzID0gZnVuY3Rpb24gKHR5cGUsIGNvbnRhaW5lcikge1xuICB2YXIgbGFiZWxzLCBpO1xuICB2YXIgc2hvdWxkU2tpcExhYmVsRm9jdXMgPSBpc0lvcygpO1xuICB2YXIgYnVzID0gdGhpcy5fYnVzO1xuXG4gIGlmIChzaG91bGRTa2lwTGFiZWxGb2N1cykgeyByZXR1cm47IH1cbiAgaWYgKGNvbnRhaW5lci5pZCA9PSBudWxsKSB7IHJldHVybjsgfVxuXG4gIGZ1bmN0aW9uIHRyaWdnZXJGb2N1cygpIHtcbiAgICBidXMuZW1pdChldmVudHMuVFJJR0dFUl9JTlBVVF9GT0NVUywgdHlwZSk7XG4gIH1cblxuICBsYWJlbHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdsYWJlbFtmb3I9XCInICsgY29udGFpbmVyLmlkICsgJ1wiXScpKTtcbiAgbGFiZWxzID0gbGFiZWxzLmNvbmNhdChmaW5kUGFyZW50VGFncyhjb250YWluZXIsICdsYWJlbCcpKTtcblxuICBmb3IgKGkgPSAwOyBpIDwgbGFiZWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgbGFiZWxzW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdHJpZ2dlckZvY3VzLCBmYWxzZSk7XG4gIH1cblxuICB0aGlzLl9kZXN0cnVjdG9yLnJlZ2lzdGVyRnVuY3Rpb25Gb3JUZWFyZG93bihmdW5jdGlvbiAoKSB7XG4gICAgZm9yIChpID0gMDsgaSA8IGxhYmVscy5sZW5ndGg7IGkrKykge1xuICAgICAgbGFiZWxzW2ldLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdHJpZ2dlckZvY3VzLCBmYWxzZSk7XG4gICAgfVxuICB9KTtcbn07XG5cbi8qKlxuICogQ2xlYW5seSByZW1vdmUgYW55dGhpbmcgc2V0IHVwIGJ5IHtAbGluayBtb2R1bGU6c2VhbWxlc3NwYXktd2ViL2hvc3RlZC1maWVsZHMuY3JlYXRlfGNyZWF0ZX0uXG4gKiBAcHVibGljXG4gKiBAZnVuY3Rpb25cbiAqIEBwYXJhbSB7Y2FsbGJhY2t9IFtjYWxsYmFja10gQ2FsbGVkIG9uIGNvbXBsZXRpb24sIGNvbnRhaW5pbmcgYW4gZXJyb3IgaWYgb25lIG9jY3VycmVkLiBObyBkYXRhIGlzIHJldHVybmVkIGlmIHRlYXJkb3duIGNvbXBsZXRlcyBzdWNjZXNzZnVsbHkuIElmIG5vIGNhbGxiYWNrIGlzIHByb3ZpZGVkLCBgdGVhcmRvd25gIHJldHVybnMgYSBwcm9taXNlLlxuICogQGV4YW1wbGVcbiAqIGhvc3RlZEZpZWxkc0luc3RhbmNlLnRlYXJkb3duKGZ1bmN0aW9uICh0ZWFyZG93bkVycikge1xuICogICBpZiAodGVhcmRvd25FcnIpIHtcbiAqICAgICBjb25zb2xlLmVycm9yKCdDb3VsZCBub3QgdGVhciBkb3duIEhvc3RlZCBGaWVsZHMhJyk7XG4gKiAgIH0gZWxzZSB7XG4gKiAgICAgY29uc29sZS5pbmZvKCdIb3N0ZWQgRmllbGRzIGhhcyBiZWVuIHRvcm4gZG93biEnKTtcbiAqICAgfVxuICogfSk7XG4gKiBAcmV0dXJucyB7UHJvbWlzZXx2b2lkfSBJZiBubyBjYWxsYmFjayBpcyBwcm92aWRlZCwgcmV0dXJucyBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB3aGVuIHRoZSB0ZWFyZG93biBpcyBjb21wbGV0ZS5cbiAqL1xuSG9zdGVkRmllbGRzLnByb3RvdHlwZS50ZWFyZG93biA9IHdyYXBQcm9taXNlKFxuICBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWludmFsaWQtdGhpc1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHNlbGYuX2Rlc3RydWN0b3IudGVhcmRvd24oZnVuY3Rpb24gKGVycikge1xuXG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4pO1xuXG4vKipcbiAqIFRva2VuaXplcyBmaWVsZHMgYW5kIHJldHVybnMgYSB0b2tlbiBwYXlsb2FkLlxuICogQHB1YmxpY1xuICogQGZ1bmN0aW9uXG4gKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnNdIEFsbCB0b2tlbml6YXRpb24gb3B0aW9ucyBmb3IgdGhlIEhvc3RlZCBGaWVsZHMgY29tcG9uZW50LlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy52YXVsdD1mYWxzZV0gV2hlbiB0cnVlLCB3aWxsIHZhdWx0IHRoZSB0b2tlbml6ZWQgY2FyZC4gQ2FyZHMgd2lsbCBvbmx5IGJlIHZhdWx0ZWQgd2hlbiB1c2luZyBhIGNsaWVudCBjcmVhdGVkIHdpdGggYSBjbGllbnQgdG9rZW4gdGhhdCBpbmNsdWRlcyBhIGN1c3RvbWVyIElELlxuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLmJpbGxpbmdBZGRyZXNzLnBvc3RhbENvZGVdIFdoZW4gc3VwcGxpZWQsIHRoaXMgcG9zdGFsIGNvZGUgd2lsbCBiZSB0b2tlbml6ZWQgYWxvbmcgd2l0aCB0aGUgY29udGVudHMgb2YgdGhlIGZpZWxkcy4gSWYgYSBwb3N0YWwgY29kZSBpcyBwcm92aWRlZCBhcyBwYXJ0IG9mIHRoZSBIb3N0ZWQgRmllbGRzIGNvbmZpZ3VyYXRpb24sIHRoZSB2YWx1ZSBvZiB0aGUgZmllbGQgd2lsbCBiZSB0b2tlbml6ZWQgYW5kIHRoaXMgdmFsdWUgd2lsbCBiZSBpZ25vcmVkLlxuICogQHBhcmFtIHtjYWxsYmFja30gW2NhbGxiYWNrXSBUaGUgc2Vjb25kIGFyZ3VtZW50LCA8Y29kZT5kYXRhPC9jb2RlPiwgaXMgYSB7QGxpbmsgSG9zdGVkRmllbGRzfnRva2VuaXplUGF5bG9hZHx0b2tlbml6ZVBheWxvYWR9LiBJZiBubyBjYWxsYmFjayBpcyBwcm92aWRlZCwgYHRva2VuaXplYCByZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCByZXNvbHZlcyB3aXRoIGEge0BsaW5rIEhvc3RlZEZpZWxkc350b2tlbml6ZVBheWxvYWR8dG9rZW5pemVQYXlsb2FkfS5cbiAqIEBleGFtcGxlIDxjYXB0aW9uPlRva2VuaXplIGEgY2FyZDwvY2FwdGlvbj5cbiAqIGhvc3RlZEZpZWxkc0luc3RhbmNlLnRva2VuaXplKGZ1bmN0aW9uICh0b2tlbml6ZUVyciwgcGF5bG9hZCkge1xuICogICBpZiAodG9rZW5pemVFcnIpIHtcbiAqICAgICBzd2l0Y2ggKHRva2VuaXplRXJyLmNvZGUpIHtcbiAqICAgICAgIGNhc2UgJ0hPU1RFRF9GSUVMRFNfRklFTERTX0VNUFRZJzpcbiAqICAgICAgICAgY29uc29sZS5lcnJvcignQWxsIGZpZWxkcyBhcmUgZW1wdHkhIFBsZWFzZSBmaWxsIG91dCB0aGUgZm9ybS4nKTtcbiAqICAgICAgICAgYnJlYWs7XG4gKiAgICAgICBjYXNlICdIT1NURURfRklFTERTX0ZJRUxEU19JTlZBTElEJzpcbiAqICAgICAgICAgY29uc29sZS5lcnJvcignU29tZSBmaWVsZHMgYXJlIGludmFsaWQ6JywgdG9rZW5pemVFcnIuZGV0YWlscy5pbnZhbGlkRmllbGRLZXlzKTtcbiAqICAgICAgICAgYnJlYWs7XG4gKiAgICAgICBjYXNlICdIT1NURURfRklFTERTX0ZBSUxFRF9UT0tFTklaQVRJT04nOlxuICogICAgICAgICBjb25zb2xlLmVycm9yKCdUb2tlbml6YXRpb24gZmFpbGVkIHNlcnZlciBzaWRlLiBJcyB0aGUgY2FyZCB2YWxpZD8nKTtcbiAqICAgICAgICAgYnJlYWs7XG4gKiAgICAgICBjYXNlICdIT1NURURfRklFTERTX1RPS0VOSVpBVElPTl9ORVRXT1JLX0VSUk9SJzpcbiAqICAgICAgICAgY29uc29sZS5lcnJvcignTmV0d29yayBlcnJvciBvY2N1cnJlZCB3aGVuIHRva2VuaXppbmcuJyk7XG4gKiAgICAgICAgIGJyZWFrO1xuICogICAgICAgZGVmYXVsdDpcbiAqICAgICAgICAgY29uc29sZS5lcnJvcignU29tZXRoaW5nIGJhZCBoYXBwZW5lZCEnLCB0b2tlbml6ZUVycik7XG4gKiAgICAgfVxuICogICB9IGVsc2Uge1xuICogICAgIGNvbnNvbGUubG9nKCdHb3Qgbm9uY2U6JywgcGF5bG9hZC5ub25jZSk7XG4gKiAgIH1cbiAqIH0pO1xuICogQGV4YW1wbGUgPGNhcHRpb24+VG9rZW5pemUgYW5kIHZhdWx0IGEgY2FyZDwvY2FwdGlvbj5cbiAqIGhvc3RlZEZpZWxkc0luc3RhbmNlLnRva2VuaXplKHtcbiAqICAgdmF1bHQ6IHRydWVcbiAqIH0sIGZ1bmN0aW9uICh0b2tlbml6ZUVyciwgcGF5bG9hZCkge1xuICogICBpZiAodG9rZW5pemVFcnIpIHtcbiAqICAgICBjb25zb2xlLmVycm9yKHRva2VuaXplRXJyKTtcbiAqICAgfSBlbHNlIHtcbiAqICAgICBjb25zb2xlLmxvZygnR290IG5vbmNlOicsIHBheWxvYWQubm9uY2UpO1xuICogICB9XG4gKiB9KTtcbiAqIEBleGFtcGxlIDxjYXB0aW9uPlRva2VuaXplIGEgY2FyZCB3aXRoIHRoZSBwb3N0YWwgY29kZSBvcHRpb248L2NhcHRpb24+XG4gKiBob3N0ZWRGaWVsZHNJbnN0YW5jZS50b2tlbml6ZSh7XG4gKiAgIGJpbGxpbmdBZGRyZXNzOiB7XG4gKiAgICAgcG9zdGFsQ29kZTogJzExMTExJ1xuICogICB9XG4gKiB9LCBmdW5jdGlvbiAodG9rZW5pemVFcnIsIHBheWxvYWQpIHtcbiAqICAgaWYgKHRva2VuaXplRXJyKSB7XG4gKiAgICAgY29uc29sZS5lcnJvcih0b2tlbml6ZUVycik7XG4gKiAgIH0gZWxzZSB7XG4gKiAgICAgY29uc29sZS5sb2coJ0dvdCBub25jZTonLCBwYXlsb2FkLm5vbmNlKTtcbiAqICAgfVxuICogfSk7XG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuSG9zdGVkRmllbGRzLnByb3RvdHlwZS50b2tlbml6ZSA9IHdyYXBQcm9taXNlKFxuICBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIHZhciBzZWxmID0gdGhpczsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1pbnZhbGlkLXRoaXNcblxuICAgIGlmICghb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IHt9O1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBzZWxmLl9idXMuZW1pdChldmVudHMuVE9LRU5JWkFUSU9OX1JFUVVFU1QsIG9wdGlvbnMsIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICB2YXIgZXJyID0gcmVzcG9uc2VbMF07XG4gICAgICAgIHZhciBwYXlsb2FkID0gcmVzcG9uc2VbMV07XG5cbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc29sdmUoZm9ybWF0VG9rZW5pemVSZXNwb25zZShwYXlsb2FkKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4pO1xuXG4vKipcbiAqIEFkZCBhIGNsYXNzIHRvIGEge0BsaW5rIG1vZHVsZTpzZWFtbGVzc3BheS13ZWIvaG9zdGVkLWZpZWxkc35maWVsZCBmaWVsZH0uIFVzZWZ1bCBmb3IgdXBkYXRpbmcgZmllbGQgc3R5bGVzIHdoZW4gZXZlbnRzIG9jY3VyIGVsc2V3aGVyZSBpbiB5b3VyIGNoZWNrb3V0LlxuICogQHB1YmxpY1xuICogQHBhcmFtIHtzdHJpbmd9IGZpZWxkIFRoZSBmaWVsZCB5b3Ugd2lzaCB0byBhZGQgYSBjbGFzcyB0by4gTXVzdCBiZSBhIHZhbGlkIHtAbGluayBtb2R1bGU6c2VhbWxlc3NwYXktd2ViL2hvc3RlZC1maWVsZHN+ZmllbGRPcHRpb25zIGZpZWxkT3B0aW9ufS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc25hbWUgVGhlIGNsYXNzIHRvIGJlIGFkZGVkLlxuICogQHBhcmFtIHtjYWxsYmFja30gW2NhbGxiYWNrXSBDYWxsYmFjayBleGVjdXRlZCBvbiBjb21wbGV0aW9uLCBjb250YWluaW5nIGFuIGVycm9yIGlmIG9uZSBvY2N1cnJlZC4gTm8gZGF0YSBpcyByZXR1cm5lZCBpZiB0aGUgY2xhc3MgaXMgYWRkZWQgc3VjY2Vzc2Z1bGx5LlxuICpcbiAqIEBleGFtcGxlXG4gKiBob3N0ZWRGaWVsZHNJbnN0YW5jZS5hZGRDbGFzcygnbnVtYmVyJywgJ2N1c3RvbS1jbGFzcycsIGZ1bmN0aW9uIChhZGRDbGFzc0Vycikge1xuICogICBpZiAoYWRkQ2xhc3NFcnIpIHtcbiAqICAgICBjb25zb2xlLmVycm9yKGFkZENsYXNzRXJyKTtcbiAqICAgfVxuICogfSk7XG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuSG9zdGVkRmllbGRzLnByb3RvdHlwZS5hZGRDbGFzcyA9IGZ1bmN0aW9uIChmaWVsZCwgY2xhc3NuYW1lLCBjYWxsYmFjaykge1xuICB2YXIgZXJyO1xuXG4gIGlmICghdGhpcy5nZXRXaGl0ZWxpc3RlZEZpZWxkcygpLmhhc093blByb3BlcnR5KGZpZWxkKSkge1xuICAgIGVyciA9IG5ldyBTZWFtbGVzc3BheUVycm9yKHtcbiAgICAgIHR5cGU6IGVycm9ycy5IT1NURURfRklFTERTX0ZJRUxEX0lOVkFMSUQudHlwZSxcbiAgICAgIGNvZGU6IGVycm9ycy5IT1NURURfRklFTERTX0ZJRUxEX0lOVkFMSUQuY29kZSxcbiAgICAgIG1lc3NhZ2U6ICdcIicgKyBmaWVsZCArICdcIiBpcyBub3QgYSB2YWxpZCBmaWVsZC4gWW91IG11c3QgdXNlIGEgdmFsaWQgZmllbGQgb3B0aW9uIHdoZW4gYWRkaW5nIGEgY2xhc3MuJ1xuICAgIH0pO1xuICB9IGVsc2UgaWYgKCF0aGlzLl9maWVsZHMuaGFzT3duUHJvcGVydHkoZmllbGQpKSB7XG4gICAgZXJyID0gbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgdHlwZTogZXJyb3JzLkhPU1RFRF9GSUVMRFNfRklFTERfTk9UX1BSRVNFTlQudHlwZSxcbiAgICAgIGNvZGU6IGVycm9ycy5IT1NURURfRklFTERTX0ZJRUxEX05PVF9QUkVTRU5ULmNvZGUsXG4gICAgICBtZXNzYWdlOiAnQ2Fubm90IGFkZCBjbGFzcyB0byBcIicgKyBmaWVsZCArICdcIiBmaWVsZCBiZWNhdXNlIGl0IGlzIG5vdCBwYXJ0IG9mIHRoZSBjdXJyZW50IEhvc3RlZCBGaWVsZHMgb3B0aW9ucy4nXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5fYnVzLmVtaXQoZXZlbnRzLkFERF9DTEFTUywgZmllbGQsIGNsYXNzbmFtZSk7XG4gIH1cblxuICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY2FsbGJhY2sgPSBkZWZlcnJlZChjYWxsYmFjayk7XG4gICAgY2FsbGJhY2soZXJyKTtcbiAgfVxufTtcblxuLyoqXG4gKiBSZW1vdmVzIGEgY2xhc3MgdG8gYSB7QGxpbmsgbW9kdWxlOnNlYW1sZXNzcGF5LXdlYi9ob3N0ZWQtZmllbGRzfmZpZWxkIGZpZWxkfS4gVXNlZnVsIGZvciB1cGRhdGluZyBmaWVsZCBzdHlsZXMgd2hlbiBldmVudHMgb2NjdXIgZWxzZXdoZXJlIGluIHlvdXIgY2hlY2tvdXQuXG4gKiBAcHVibGljXG4gKiBAcGFyYW0ge3N0cmluZ30gZmllbGQgVGhlIGZpZWxkIHlvdSB3aXNoIHRvIHJlbW92ZSBhIGNsYXNzIGZyb20uIE11c3QgYmUgYSB2YWxpZCB7QGxpbmsgbW9kdWxlOnNlYW1sZXNzcGF5LXdlYi9ob3N0ZWQtZmllbGRzfmZpZWxkT3B0aW9ucyBmaWVsZE9wdGlvbn0uXG4gKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NuYW1lIFRoZSBjbGFzcyB0byBiZSByZW1vdmVkLlxuICogQHBhcmFtIHtjYWxsYmFja30gW2NhbGxiYWNrXSBDYWxsYmFjayBleGVjdXRlZCBvbiBjb21wbGV0aW9uLCBjb250YWluaW5nIGFuIGVycm9yIGlmIG9uZSBvY2N1cnJlZC4gTm8gZGF0YSBpcyByZXR1cm5lZCBpZiB0aGUgY2xhc3MgaXMgcmVtb3ZlZCBzdWNjZXNzZnVsbHkuXG4gKlxuICogQGV4YW1wbGVcbiAqIGhvc3RlZEZpZWxkc0luc3RhbmNlLmFkZENsYXNzKCdudW1iZXInLCAnY3VzdG9tLWNsYXNzJywgZnVuY3Rpb24gKGFkZENsYXNzRXJyKSB7XG4gKiAgIGlmIChhZGRDbGFzc0Vycikge1xuICogICAgIGNvbnNvbGUuZXJyb3IoYWRkQ2xhc3NFcnIpO1xuICogICAgIHJldHVybjtcbiAqICAgfVxuICpcbiAqICAgLy8gc29tZSB0aW1lIGxhdGVyLi4uXG4gKiAgIGhvc3RlZEZpZWxkc0luc3RhbmNlLnJlbW92ZUNsYXNzKCdudW1iZXInLCAnY3VzdG9tLWNsYXNzJyk7XG4gKiB9KTtcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5Ib3N0ZWRGaWVsZHMucHJvdG90eXBlLnJlbW92ZUNsYXNzID0gZnVuY3Rpb24gKGZpZWxkLCBjbGFzc25hbWUsIGNhbGxiYWNrKSB7XG4gIHZhciBlcnI7XG5cbiAgaWYgKCF0aGlzLmdldFdoaXRlbGlzdGVkRmllbGRzKCkuaGFzT3duUHJvcGVydHkoZmllbGQpKSB7XG4gICAgZXJyID0gbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgdHlwZTogZXJyb3JzLkhPU1RFRF9GSUVMRFNfRklFTERfSU5WQUxJRC50eXBlLFxuICAgICAgY29kZTogZXJyb3JzLkhPU1RFRF9GSUVMRFNfRklFTERfSU5WQUxJRC5jb2RlLFxuICAgICAgbWVzc2FnZTogJ1wiJyArIGZpZWxkICsgJ1wiIGlzIG5vdCBhIHZhbGlkIGZpZWxkLiBZb3UgbXVzdCB1c2UgYSB2YWxpZCBmaWVsZCBvcHRpb24gd2hlbiByZW1vdmluZyBhIGNsYXNzLidcbiAgICB9KTtcbiAgfSBlbHNlIGlmICghdGhpcy5fZmllbGRzLmhhc093blByb3BlcnR5KGZpZWxkKSkge1xuICAgIGVyciA9IG5ldyBTZWFtbGVzc3BheUVycm9yKHtcbiAgICAgIHR5cGU6IGVycm9ycy5IT1NURURfRklFTERTX0ZJRUxEX05PVF9QUkVTRU5ULnR5cGUsXG4gICAgICBjb2RlOiBlcnJvcnMuSE9TVEVEX0ZJRUxEU19GSUVMRF9OT1RfUFJFU0VOVC5jb2RlLFxuICAgICAgbWVzc2FnZTogJ0Nhbm5vdCByZW1vdmUgY2xhc3MgZnJvbSBcIicgKyBmaWVsZCArICdcIiBmaWVsZCBiZWNhdXNlIGl0IGlzIG5vdCBwYXJ0IG9mIHRoZSBjdXJyZW50IEhvc3RlZCBGaWVsZHMgb3B0aW9ucy4nXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5fYnVzLmVtaXQoZXZlbnRzLlJFTU9WRV9DTEFTUywgZmllbGQsIGNsYXNzbmFtZSk7XG4gIH1cblxuICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY2FsbGJhY2sgPSBkZWZlcnJlZChjYWxsYmFjayk7XG4gICAgY2FsbGJhY2soZXJyKTtcbiAgfVxufTtcblxuLyoqXG4gKiBTZXRzIGFuIGF0dHJpYnV0ZSBvZiBhIHtAbGluayBtb2R1bGU6c2VhbWxlc3NwYXktd2ViL2hvc3RlZC1maWVsZHN+ZmllbGQgZmllbGR9LlxuICogU3VwcG9ydGVkIGF0dHJpYnV0ZXMgYXJlIGBhcmlhLWludmFsaWRgLCBgYXJpYS1yZXF1aXJlZGAsIGBkaXNhYmxlZGAsIGFuZCBgcGxhY2Vob2xkZXJgLlxuICpcbiAqIEBwdWJsaWNcbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIFRoZSBvcHRpb25zIGZvciB0aGUgYXR0cmlidXRlIHlvdSB3aXNoIHRvIHNldC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLmZpZWxkIFRoZSBmaWVsZCB0byB3aGljaCB5b3Ugd2lzaCB0byBhZGQgYW4gYXR0cmlidXRlLiBNdXN0IGJlIGEgdmFsaWQge0BsaW5rIG1vZHVsZTpzZWFtbGVzc3BheS13ZWIvaG9zdGVkLWZpZWxkc35maWVsZE9wdGlvbnMgZmllbGRPcHRpb259LlxuICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbnMuYXR0cmlidXRlIFRoZSBuYW1lIG9mIHRoZSBhdHRyaWJ1dGUgeW91IHdpc2ggdG8gYWRkIHRvIHRoZSBmaWVsZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLnZhbHVlIFRoZSB2YWx1ZSBmb3IgdGhlIGF0dHJpYnV0ZS5cbiAqIEBwYXJhbSB7Y2FsbGJhY2t9IFtjYWxsYmFja10gQ2FsbGJhY2sgZXhlY3V0ZWQgb24gY29tcGxldGlvbiwgY29udGFpbmluZyBhbiBlcnJvciBpZiBvbmUgb2NjdXJyZWQuIE5vIGRhdGEgaXMgcmV0dXJuZWQgaWYgdGhlIGF0dHJpYnV0ZSBpcyBzZXQgc3VjY2Vzc2Z1bGx5LlxuICpcbiAqIEBleGFtcGxlIDxjYXB0aW9uPlNldCB0aGUgcGxhY2Vob2xkZXIgYXR0cmlidXRlIG9mIGEgZmllbGQ8L2NhcHRpb24+XG4gKiBob3N0ZWRGaWVsZHNJbnN0YW5jZS5zZXRBdHRyaWJ1dGUoe1xuICogICBmaWVsZDogJ251bWJlcicsXG4gKiAgIGF0dHJpYnV0ZTogJ3BsYWNlaG9sZGVyJyxcbiAqICAgdmFsdWU6ICcxMTExIDExMTEgMTExMSAxMTExJ1xuICogfSwgZnVuY3Rpb24gKGF0dHJpYnV0ZUVycikge1xuICogICBpZiAoYXR0cmlidXRlRXJyKSB7XG4gKiAgICAgY29uc29sZS5lcnJvcihhdHRyaWJ1dGVFcnIpO1xuICogICB9XG4gKiB9KTtcbiAqXG4gKiBAZXhhbXBsZSA8Y2FwdGlvbj5TZXQgdGhlIGFyaWEtcmVxdWlyZWQgYXR0cmlidXRlIG9mIGEgZmllbGQ8L2NhcHRpb24+XG4gKiBob3N0ZWRGaWVsZHNJbnN0YW5jZS5zZXRBdHRyaWJ1dGUoe1xuICogICBmaWVsZDogJ251bWJlcicsXG4gKiAgIGF0dHJpYnV0ZTogJ2FyaWEtcmVxdWlyZWQnLFxuICogICB2YWx1ZTogdHJ1ZVxuICogfSwgZnVuY3Rpb24gKGF0dHJpYnV0ZUVycikge1xuICogICBpZiAoYXR0cmlidXRlRXJyKSB7XG4gKiAgICAgY29uc29sZS5lcnJvcihhdHRyaWJ1dGVFcnIpO1xuICogICB9XG4gKiB9KTtcbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuSG9zdGVkRmllbGRzLnByb3RvdHlwZS5zZXRBdHRyaWJ1dGUgPSBmdW5jdGlvbiAob3B0aW9ucywgY2FsbGJhY2spIHtcbiAgdmFyIGF0dHJpYnV0ZUVyciwgZXJyO1xuXG4gIGlmICghdGhpcy5nZXRXaGl0ZWxpc3RlZEZpZWxkcygpLmhhc093blByb3BlcnR5KG9wdGlvbnMuZmllbGQpKSB7XG4gICAgZXJyID0gbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgdHlwZTogZXJyb3JzLkhPU1RFRF9GSUVMRFNfRklFTERfSU5WQUxJRC50eXBlLFxuICAgICAgY29kZTogZXJyb3JzLkhPU1RFRF9GSUVMRFNfRklFTERfSU5WQUxJRC5jb2RlLFxuICAgICAgbWVzc2FnZTogJ1wiJyArIG9wdGlvbnMuZmllbGQgKyAnXCIgaXMgbm90IGEgdmFsaWQgZmllbGQuIFlvdSBtdXN0IHVzZSBhIHZhbGlkIGZpZWxkIG9wdGlvbiB3aGVuIHNldHRpbmcgYW4gYXR0cmlidXRlLidcbiAgICB9KTtcbiAgfSBlbHNlIGlmICghdGhpcy5fZmllbGRzLmhhc093blByb3BlcnR5KG9wdGlvbnMuZmllbGQpKSB7XG4gICAgZXJyID0gbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgdHlwZTogZXJyb3JzLkhPU1RFRF9GSUVMRFNfRklFTERfTk9UX1BSRVNFTlQudHlwZSxcbiAgICAgIGNvZGU6IGVycm9ycy5IT1NURURfRklFTERTX0ZJRUxEX05PVF9QUkVTRU5ULmNvZGUsXG4gICAgICBtZXNzYWdlOiAnQ2Fubm90IHNldCBhdHRyaWJ1dGUgZm9yIFwiJyArIG9wdGlvbnMuZmllbGQgKyAnXCIgZmllbGQgYmVjYXVzZSBpdCBpcyBub3QgcGFydCBvZiB0aGUgY3VycmVudCBIb3N0ZWQgRmllbGRzIG9wdGlvbnMuJ1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGF0dHJpYnV0ZUVyciA9IGF0dHJpYnV0ZVZhbGlkYXRpb25FcnJvcihvcHRpb25zLmF0dHJpYnV0ZSwgb3B0aW9ucy52YWx1ZSk7XG5cbiAgICBpZiAoYXR0cmlidXRlRXJyKSB7XG4gICAgICBlcnIgPSBhdHRyaWJ1dGVFcnI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2J1cy5lbWl0KGV2ZW50cy5TRVRfQVRUUklCVVRFLCBvcHRpb25zLmZpZWxkLCBvcHRpb25zLmF0dHJpYnV0ZSwgb3B0aW9ucy52YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNhbGxiYWNrID0gZGVmZXJyZWQoY2FsbGJhY2spO1xuICAgIGNhbGxiYWNrKGVycik7XG4gIH1cbn07XG5cbi8qKlxuICogUmVtb3ZlcyBhIHN1cHBvcnRlZCBhdHRyaWJ1dGUgZnJvbSBhIHtAbGluayBtb2R1bGU6c2VhbWxlc3NwYXktd2ViL2hvc3RlZC1maWVsZHN+ZmllbGQgZmllbGR9LlxuICpcbiAqIEBwdWJsaWNcbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIFRoZSBvcHRpb25zIGZvciB0aGUgYXR0cmlidXRlIHlvdSB3aXNoIHRvIHJlbW92ZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLmZpZWxkIFRoZSBmaWVsZCBmcm9tIHdoaWNoIHlvdSB3aXNoIHRvIHJlbW92ZSBhbiBhdHRyaWJ1dGUuIE11c3QgYmUgYSB2YWxpZCB7QGxpbmsgbW9kdWxlOnNlYW1sZXNzcGF5LXdlYi9ob3N0ZWQtZmllbGRzfmZpZWxkT3B0aW9ucyBmaWVsZE9wdGlvbn0uXG4gKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9ucy5hdHRyaWJ1dGUgVGhlIG5hbWUgb2YgdGhlIGF0dHJpYnV0ZSB5b3Ugd2lzaCB0byByZW1vdmUgZnJvbSB0aGUgZmllbGQuXG4gKiBAcGFyYW0ge2NhbGxiYWNrfSBbY2FsbGJhY2tdIENhbGxiYWNrIGV4ZWN1dGVkIG9uIGNvbXBsZXRpb24sIGNvbnRhaW5pbmcgYW4gZXJyb3IgaWYgb25lIG9jY3VycmVkLiBObyBkYXRhIGlzIHJldHVybmVkIGlmIHRoZSBhdHRyaWJ1dGUgaXMgcmVtb3ZlZCBzdWNjZXNzZnVsbHkuXG4gKlxuICogQGV4YW1wbGUgPGNhcHRpb24+UmVtb3ZlIHRoZSBwbGFjZWhvbGRlciBhdHRyaWJ1dGUgb2YgYSBmaWVsZDwvY2FwdGlvbj5cbiAqIGhvc3RlZEZpZWxkc0luc3RhbmNlLnJlbW92ZUF0dHJpYnV0ZSh7XG4gKiAgIGZpZWxkOiAnbnVtYmVyJyxcbiAqICAgYXR0cmlidXRlOiAncGxhY2Vob2xkZXInXG4gKiB9LCBmdW5jdGlvbiAoYXR0cmlidXRlRXJyKSB7XG4gKiAgIGlmIChhdHRyaWJ1dGVFcnIpIHtcbiAqICAgICBjb25zb2xlLmVycm9yKGF0dHJpYnV0ZUVycik7XG4gKiAgIH1cbiAqIH0pO1xuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5Ib3N0ZWRGaWVsZHMucHJvdG90eXBlLnJlbW92ZUF0dHJpYnV0ZSA9IGZ1bmN0aW9uIChvcHRpb25zLCBjYWxsYmFjaykge1xuICB2YXIgYXR0cmlidXRlRXJyLCBlcnI7XG5cbiAgaWYgKCF0aGlzLmdldFdoaXRlbGlzdGVkRmllbGRzKCkuaGFzT3duUHJvcGVydHkob3B0aW9ucy5maWVsZCkpIHtcbiAgICBlcnIgPSBuZXcgU2VhbWxlc3NwYXlFcnJvcih7XG4gICAgICB0eXBlOiBlcnJvcnMuSE9TVEVEX0ZJRUxEU19GSUVMRF9JTlZBTElELnR5cGUsXG4gICAgICBjb2RlOiBlcnJvcnMuSE9TVEVEX0ZJRUxEU19GSUVMRF9JTlZBTElELmNvZGUsXG4gICAgICBtZXNzYWdlOiAnXCInICsgb3B0aW9ucy5maWVsZCArICdcIiBpcyBub3QgYSB2YWxpZCBmaWVsZC4gWW91IG11c3QgdXNlIGEgdmFsaWQgZmllbGQgb3B0aW9uIHdoZW4gcmVtb3ZpbmcgYW4gYXR0cmlidXRlLidcbiAgICB9KTtcbiAgfSBlbHNlIGlmICghdGhpcy5fZmllbGRzLmhhc093blByb3BlcnR5KG9wdGlvbnMuZmllbGQpKSB7XG4gICAgZXJyID0gbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgdHlwZTogZXJyb3JzLkhPU1RFRF9GSUVMRFNfRklFTERfTk9UX1BSRVNFTlQudHlwZSxcbiAgICAgIGNvZGU6IGVycm9ycy5IT1NURURfRklFTERTX0ZJRUxEX05PVF9QUkVTRU5ULmNvZGUsXG4gICAgICBtZXNzYWdlOiAnQ2Fubm90IHJlbW92ZSBhdHRyaWJ1dGUgZm9yIFwiJyArIG9wdGlvbnMuZmllbGQgKyAnXCIgZmllbGQgYmVjYXVzZSBpdCBpcyBub3QgcGFydCBvZiB0aGUgY3VycmVudCBIb3N0ZWQgRmllbGRzIG9wdGlvbnMuJ1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGF0dHJpYnV0ZUVyciA9IGF0dHJpYnV0ZVZhbGlkYXRpb25FcnJvcihvcHRpb25zLmF0dHJpYnV0ZSk7XG5cbiAgICBpZiAoYXR0cmlidXRlRXJyKSB7XG4gICAgICBlcnIgPSBhdHRyaWJ1dGVFcnI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2J1cy5lbWl0KGV2ZW50cy5SRU1PVkVfQVRUUklCVVRFLCBvcHRpb25zLmZpZWxkLCBvcHRpb25zLmF0dHJpYnV0ZSk7XG4gICAgfVxuICB9XG5cbiAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNhbGxiYWNrID0gZGVmZXJyZWQoY2FsbGJhY2spO1xuICAgIGNhbGxiYWNrKGVycik7XG4gIH1cbn07XG5cbi8qKlxuICogQGRlcHJlY2F0ZWQgc2luY2UgdmVyc2lvbiAzLjguMC4gVXNlIHtAbGluayBIb3N0ZWRGaWVsZHMjc2V0QXR0cmlidXRlfHNldEF0dHJpYnV0ZX0gaW5zdGVhZC5cbiAqXG4gKiBAcHVibGljXG4gKiBAcGFyYW0ge3N0cmluZ30gZmllbGQgVGhlIGZpZWxkIHdob3NlIHBsYWNlaG9sZGVyIHlvdSB3aXNoIHRvIGNoYW5nZS4gTXVzdCBiZSBhIHZhbGlkIHtAbGluayBtb2R1bGU6c2VhbWxlc3NwYXktd2ViL2hvc3RlZC1maWVsZHN+ZmllbGRPcHRpb25zIGZpZWxkT3B0aW9ufS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBwbGFjZWhvbGRlciBXaWxsIGJlIHVzZWQgYXMgdGhlIGBwbGFjZWhvbGRlcmAgYXR0cmlidXRlIG9mIHRoZSBpbnB1dC5cbiAqIEBwYXJhbSB7Y2FsbGJhY2t9IFtjYWxsYmFja10gQ2FsbGJhY2sgZXhlY3V0ZWQgb24gY29tcGxldGlvbiwgY29udGFpbmluZyBhbiBlcnJvciBpZiBvbmUgb2NjdXJyZWQuIE5vIGRhdGEgaXMgcmV0dXJuZWQgaWYgdGhlIHBsYWNlaG9sZGVyIHVwZGF0ZWQgc3VjY2Vzc2Z1bGx5LlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5Ib3N0ZWRGaWVsZHMucHJvdG90eXBlLnNldFBsYWNlaG9sZGVyID0gZnVuY3Rpb24gKGZpZWxkLCBwbGFjZWhvbGRlciwgY2FsbGJhY2spIHtcbiAgdGhpcy5zZXRBdHRyaWJ1dGUoe1xuICAgIGZpZWxkOiBmaWVsZCxcbiAgICBhdHRyaWJ1dGU6ICdwbGFjZWhvbGRlcicsXG4gICAgdmFsdWU6IHBsYWNlaG9sZGVyXG4gIH0sIGNhbGxiYWNrKTtcbn07XG5cbi8qKlxuICogQ2xlYXIgdGhlIHZhbHVlIG9mIGEge0BsaW5rIG1vZHVsZTpzZWFtbGVzc3BheS13ZWIvaG9zdGVkLWZpZWxkc35maWVsZCBmaWVsZH0uXG4gKiBAcHVibGljXG4gKiBAcGFyYW0ge3N0cmluZ30gZmllbGQgVGhlIGZpZWxkIHdob3NlIHBsYWNlaG9sZGVyIHlvdSB3aXNoIHRvIGNsZWFyLiBNdXN0IGJlIGEgdmFsaWQge0BsaW5rIG1vZHVsZTpzZWFtbGVzc3BheS13ZWIvaG9zdGVkLWZpZWxkc35maWVsZE9wdGlvbnMgZmllbGRPcHRpb259LlxuICogQHBhcmFtIHtjYWxsYmFja30gW2NhbGxiYWNrXSBDYWxsYmFjayBleGVjdXRlZCBvbiBjb21wbGV0aW9uLCBjb250YWluaW5nIGFuIGVycm9yIGlmIG9uZSBvY2N1cnJlZC4gTm8gZGF0YSBpcyByZXR1cm5lZCBpZiB0aGUgZmllbGQgY2xlYXJlZCBzdWNjZXNzZnVsbHkuXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqIEBleGFtcGxlXG4gKiBob3N0ZWRGaWVsZHNJbnN0YW5jZS5jbGVhcignbnVtYmVyJywgZnVuY3Rpb24gKGNsZWFyRXJyKSB7XG4gKiAgIGlmIChjbGVhckVycikge1xuICogICAgIGNvbnNvbGUuZXJyb3IoY2xlYXJFcnIpO1xuICogICB9XG4gKiB9KTtcbiAqXG4gKiBAZXhhbXBsZSA8Y2FwdGlvbj5DbGVhciBzZXZlcmFsIGZpZWxkczwvY2FwdGlvbj5cbiAqIGhvc3RlZEZpZWxkc0luc3RhbmNlLmNsZWFyKCdudW1iZXInKTtcbiAqIGhvc3RlZEZpZWxkc0luc3RhbmNlLmNsZWFyKCdjdnYnKTtcbiAqIGhvc3RlZEZpZWxkc0luc3RhbmNlLmNsZWFyKCdleHBpcmF0aW9uRGF0ZScpO1xuICovXG5Ib3N0ZWRGaWVsZHMucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKGZpZWxkLCBjYWxsYmFjaykge1xuICB2YXIgZXJyO1xuXG4gIGlmICghdGhpcy5nZXRXaGl0ZWxpc3RlZEZpZWxkcygpLmhhc093blByb3BlcnR5KGZpZWxkKSkge1xuICAgIGVyciA9IG5ldyBTZWFtbGVzc3BheUVycm9yKHtcbiAgICAgIHR5cGU6IGVycm9ycy5IT1NURURfRklFTERTX0ZJRUxEX0lOVkFMSUQudHlwZSxcbiAgICAgIGNvZGU6IGVycm9ycy5IT1NURURfRklFTERTX0ZJRUxEX0lOVkFMSUQuY29kZSxcbiAgICAgIG1lc3NhZ2U6ICdcIicgKyBmaWVsZCArICdcIiBpcyBub3QgYSB2YWxpZCBmaWVsZC4gWW91IG11c3QgdXNlIGEgdmFsaWQgZmllbGQgb3B0aW9uIHdoZW4gY2xlYXJpbmcgYSBmaWVsZC4nXG4gICAgfSk7XG4gIH0gZWxzZSBpZiAoIXRoaXMuX2ZpZWxkcy5oYXNPd25Qcm9wZXJ0eShmaWVsZCkpIHtcbiAgICBlcnIgPSBuZXcgU2VhbWxlc3NwYXlFcnJvcih7XG4gICAgICB0eXBlOiBlcnJvcnMuSE9TVEVEX0ZJRUxEU19GSUVMRF9OT1RfUFJFU0VOVC50eXBlLFxuICAgICAgY29kZTogZXJyb3JzLkhPU1RFRF9GSUVMRFNfRklFTERfTk9UX1BSRVNFTlQuY29kZSxcbiAgICAgIG1lc3NhZ2U6ICdDYW5ub3QgY2xlYXIgXCInICsgZmllbGQgKyAnXCIgZmllbGQgYmVjYXVzZSBpdCBpcyBub3QgcGFydCBvZiB0aGUgY3VycmVudCBIb3N0ZWQgRmllbGRzIG9wdGlvbnMuJ1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHRoaXMuX2J1cy5lbWl0KGV2ZW50cy5DTEVBUl9GSUVMRCwgZmllbGQpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNhbGxiYWNrID0gZGVmZXJyZWQoY2FsbGJhY2spO1xuICAgIGNhbGxiYWNrKGVycik7XG4gIH1cbn07XG5cbi8qKlxuICogRmlsbCBmb3JtIGZpZWxkcyB3aXRoIHRva2VuIGRhdGEuXG4gKiBAcHVibGljXG4gKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnNdIE9wdGlvbnMgZm9yIHRoZSBIb3N0ZWQgRmllbGRzIGNvbXBvbmVudC5cbiAqIEByZXR1cm5zIHtQcm9taXNlfSBSZXR1cm5zIGEgcHJvbWlzZS5cbiAqIEBleGFtcGxlXG4gKiBob3N0ZWRGaWVsZHNJbnN0YW5jZS5wb3B1bGF0ZVRva2VuKHsgdG9rZW46ICdUS05fQUJDREVGR0hJSktMTU5PUDEyMzQ1NjcnIH0pO1xuICovXG5Ib3N0ZWRGaWVsZHMucHJvdG90eXBlLnBvcHVsYXRlVG9rZW4gPSB3cmFwUHJvbWlzZShcbiAgZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8taW52YWxpZC10aGlzXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcbiAgICAgIHNlbGYuX2J1cy5lbWl0KGV2ZW50cy5QT1BVTEFURV9UT0tFTiwgb3B0aW9ucywgZnVuY3Rpb24gKHJlc3VsdCkgeyAvLyBUT0RPOiBpbXBsZW1lbnQgaW50ZXJuYWwgcGFydFxuICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuKTtcblxuLyoqXG4gKiBSZXR1cm5zIGFuIHtAbGluayBIb3N0ZWRGaWVsZHN+c3RhdGVPYmplY3R8b2JqZWN0fSB0aGF0IGluY2x1ZGVzIHRoZSBzdGF0ZSBvZiBhbGwgZmllbGRzIGFuZCBwb3NzaWJsZSBjYXJkIHR5cGVzLlxuICogQHB1YmxpY1xuICogQHJldHVybnMge29iamVjdH0ge0BsaW5rIEhvc3RlZEZpZWxkc35zdGF0ZU9iamVjdHxzdGF0ZU9iamVjdH1cbiAqIEBleGFtcGxlIDxjYXB0aW9uPkNoZWNrIGlmIGFsbCBmaWVsZHMgYXJlIHZhbGlkPC9jYXB0aW9uPlxuICogdmFyIHN0YXRlID0gaG9zdGVkRmllbGRzLmdldFN0YXRlKCk7XG4gKlxuICogdmFyIGZvcm1WYWxpZCA9IE9iamVjdC5rZXlzKHN0YXRlLmZpZWxkcykuZXZlcnkoZnVuY3Rpb24gKGtleSkge1xuICogICByZXR1cm4gc3RhdGUuZmllbGRzW2tleV0uaXNWYWxpZDtcbiAqIH0pO1xuICovXG5Ib3N0ZWRGaWVsZHMucHJvdG90eXBlLmdldFN0YXRlID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5fc3RhdGU7XG59O1xuXG4vKipcbiAqIFJldHVybnMgYSBib29sZWFuIGluZGljYXRpbmcgd2hldGhlciBvciBub3QgdGhlIGZvcm0gaXMgdmFsaWQuXG4gKiBAcHVibGljXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiBhbGwgZmllbGRzIGFyZSB2YWxpZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICogQGV4YW1wbGVcbiAqIHZhciBmb3JtVmFsaWQgPSBob3N0ZWRGaWVsZHNJbnN0YW5jZS5pc0Zvcm1WYWxpZCgpO1xuICovXG5Ib3N0ZWRGaWVsZHMucHJvdG90eXBlLmlzRm9ybVZhbGlkID0gZnVuY3Rpb24gKCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHJldHVybiBPYmplY3Qua2V5cyhzZWxmLl9zdGF0ZS5maWVsZHMpLmV2ZXJ5KGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4gc2VsZi5fc3RhdGUuZmllbGRzW2tleV0uaXNWYWxpZDtcbiAgfSk7XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBIb3N0ZWRGaWVsZHM7XG4iLCJcbmZ1bmN0aW9uIGZvcm1hdFRva2VuaXplUmVzcG9uc2UocGF5bG9hZCkge1xuICBpZiAoIShwYXlsb2FkIGluc3RhbmNlb2YgT2JqZWN0KSkgcmV0dXJuIHBheWxvYWRcblxuICB2YXIge1xuICAgIGV4cERhdGUsXG4gICAgbGFzdEZvdXIsXG4gICAgbmFtZSxcbiAgICBwYXltZW50TmV0d29yayxcbiAgICB0b2tlbjogcGF5bWVudFRva2VuLFxuICB9ID0gcGF5bG9hZDtcblxuICByZXR1cm4ge1xuICAgIHBheW1lbnRUb2tlbixcbiAgICBkZXRhaWxzOiB7XG4gICAgICBleHBEYXRlLFxuICAgICAgbGFzdEZvdXIsXG4gICAgICBuYW1lLFxuICAgICAgcGF5bWVudE5ldHdvcmssXG4gICAgfVxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZm9ybWF0VG9rZW5pemVSZXNwb25zZVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuLyoqIEBtb2R1bGUgc2VhbWxlc3NwYXktd2ViL2hvc3RlZC1maWVsZHMgKi9cblxudmFyIEhvc3RlZEZpZWxkcyA9IHJlcXVpcmUoJy4vZXh0ZXJuYWwvaG9zdGVkLWZpZWxkcycpO1xudmFyIHdyYXBQcm9taXNlID0gcmVxdWlyZSgnQGJyYWludHJlZS93cmFwLXByb21pc2UnKTtcbnZhciBQcm9taXNlID0gcmVxdWlyZSgnLi4vbGliL3Byb21pc2UnKTtcblxudmFyIFZFUlNJT04gPSBcIndlYi1zZGtcIjtcblxuLyoqXG4gKiBGaWVsZHMgdXNlZCBpbiB7QGxpbmsgbW9kdWxlOnNlYW1sZXNzcGF5LXdlYi9ob3N0ZWQtZmllbGRzfmZpZWxkT3B0aW9ucyBmaWVsZHMgb3B0aW9uc31cbiAqIEB0eXBlZGVmIHtvYmplY3R9IGZpZWxkXG4gKiBAcHJvcGVydHkge3N0cmluZ30gc2VsZWN0b3IgQSBDU1Mgc2VsZWN0b3IgdG8gZmluZCB0aGUgY29udGFpbmVyIHdoZXJlIHRoZSBob3N0ZWQgZmllbGQgd2lsbCBiZSBpbnNlcnRlZC5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbcGxhY2Vob2xkZXJdIFdpbGwgYmUgdXNlZCBhcyB0aGUgYHBsYWNlaG9sZGVyYCBhdHRyaWJ1dGUgb2YgdGhlIGlucHV0LiBJZiBgcGxhY2Vob2xkZXJgIGlzIG5vdCBuYXRpdmVseSBzdXBwb3J0ZWQgYnkgdGhlIGJyb3dzZXIsIGl0IHdpbGwgYmUgcG9seWZpbGxlZC5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbdHlwZV0gV2lsbCBiZSB1c2VkIGFzIHRoZSBgdHlwZWAgYXR0cmlidXRlIG9mIHRoZSBpbnB1dC4gVG8gbWFzayBgY3Z2YCBpbnB1dCwgZm9yIGluc3RhbmNlLCBgdHlwZTogXCJwYXNzd29yZFwiYCBjYW4gYmUgdXNlZC5cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gW2Zvcm1hdElucHV0PXRydWVdIEVuYWJsZSBvciBkaXNhYmxlIGF1dG9tYXRpYyBmb3JtYXR0aW5nIG9uIHRoaXMgZmllbGQuXG4gKiBAcHJvcGVydHkge29iamVjdHxib29sZWFufSBbc2VsZWN0XSBJZiB0cnV0aHksIHRoaXMgZmllbGQgYmVjb21lcyBhIGA8c2VsZWN0PmAgZHJvcGRvd24gbGlzdC4gVGhpcyBjYW4gb25seSBiZSB1c2VkIGZvciBgZXhwaXJhdGlvbk1vbnRoYCBhbmQgYGV4cGlyYXRpb25ZZWFyYCBmaWVsZHMuXG4gKiBAcHJvcGVydHkge3N0cmluZ1tdfSBbc2VsZWN0Lm9wdGlvbnNdIEFuIGFycmF5IG9mIDEyIHN0cmluZ3MsIG9uZSBwZXIgbW9udGguIFRoaXMgY2FuIG9ubHkgYmUgdXNlZCBmb3IgdGhlIGBleHBpcmF0aW9uTW9udGhgIGZpZWxkLiBGb3IgZXhhbXBsZSwgdGhlIGFycmF5IGNhbiBsb29rIGxpa2UgYFsnMDEgLSBKYW51YXJ5JywgJzAyIC0gRmVicnVhcnknLCAuLi5dYC5cbiAqL1xuXG4vKipcbiAqIEFuIG9iamVjdCB0aGF0IGhhcyB7QGxpbmsgbW9kdWxlOnNlYW1sZXNzcGF5LXdlYi9ob3N0ZWQtZmllbGRzfmZpZWxkIGZpZWxkIG9iamVjdHN9IGZvciBlYWNoIGZpZWxkLiBVc2VkIGluIHtAbGluayBtb2R1bGU6c2VhbWxlc3NwYXktd2ViL2hvc3RlZC1maWVsZHN+Y3JlYXRlIGNyZWF0ZX0uXG4gKiBAdHlwZWRlZiB7b2JqZWN0fSBmaWVsZE9wdGlvbnNcbiAqIEBwcm9wZXJ0eSB7ZmllbGR9IFtudW1iZXJdIEEgZmllbGQgZm9yIGNhcmQgbnVtYmVyLlxuICogQHByb3BlcnR5IHtmaWVsZH0gW2V4cGlyYXRpb25EYXRlXSBBIGZpZWxkIGZvciBleHBpcmF0aW9uIGRhdGUgaW4gYE1NL1lZWVlgIGZvcm1hdC4gVGhpcyBzaG91bGQgbm90IGJlIHVzZWQgd2l0aCB0aGUgYGV4cGlyYXRpb25Nb250aGAgYW5kIGBleHBpcmF0aW9uWWVhcmAgcHJvcGVydGllcy5cbiAqIEBwcm9wZXJ0eSB7ZmllbGR9IFtleHBpcmF0aW9uTW9udGhdIEEgZmllbGQgZm9yIGV4cGlyYXRpb24gbW9udGggaW4gYE1NYCBmb3JtYXQuIFRoaXMgc2hvdWxkIGJlIHVzZWQgd2l0aCB0aGUgYGV4cGlyYXRpb25ZZWFyYCBwcm9wZXJ0eS5cbiAqIEBwcm9wZXJ0eSB7ZmllbGR9IFtleHBpcmF0aW9uWWVhcl0gQSBmaWVsZCBmb3IgZXhwaXJhdGlvbiB5ZWFyIGluIGBZWVlZYCBmb3JtYXQuIFRoaXMgc2hvdWxkIGJlIHVzZWQgd2l0aCB0aGUgYGV4cGlyYXRpb25Nb250aGAgcHJvcGVydHkuXG4gKiBAcHJvcGVydHkge2ZpZWxkfSBbY3Z2XSBBIGZpZWxkIGZvciAzIG9yIDQgZGlnaXQgQ1ZWIG9yIENJRC5cbiAqIEBwcm9wZXJ0eSB7ZmllbGR9IFtwb3N0YWxDb2RlXSBBIGZpZWxkIGZvciBwb3N0YWwgb3IgcmVnaW9uIGNvZGUuXG4gKi9cblxuLyoqXG4gKiBBbiBvYmplY3QgdGhhdCByZXByZXNlbnRzIENTUyB0aGF0IHdpbGwgYmUgYXBwbGllZCBpbiBlYWNoIGhvc3RlZCBmaWVsZC4gVGhpcyBvYmplY3QgbG9va3Mgc2ltaWxhciB0byBDU1MuIFR5cGljYWxseSwgdGhlc2Ugc3R5bGVzIGludm9sdmUgZm9udHMgKHN1Y2ggYXMgYGZvbnQtZmFtaWx5YCBvciBgY29sb3JgKS5cbiAqXG4gKiBUaGVzZSBhcmUgdGhlIENTUyBwcm9wZXJ0aWVzIHRoYXQgSG9zdGVkIEZpZWxkcyBzdXBwb3J0cy4gQW55IG90aGVyIENTUyBzaG91bGQgYmUgc3BlY2lmaWVkIG9uIHlvdXIgcGFnZSBhbmQgb3V0c2lkZSBvZiBhbnkgU2VhbWxlc3NwYXkgY29uZmlndXJhdGlvbi4gVHJ5aW5nIHRvIHNldCB1bnN1cHBvcnRlZCBwcm9wZXJ0aWVzIHdpbGwgZmFpbCBhbmQgcHV0IGEgd2FybmluZyBpbiB0aGUgY29uc29sZS5cbiAqXG4gKiBTdXBwb3J0ZWQgQ1NTIHByb3BlcnRpZXMgYXJlOlxuICogYGNvbG9yYFxuICogYGRpcmVjdGlvbmBcbiAqIGBmb250LWZhbWlseWBcbiAqIGBmb250LXNpemUtYWRqdXN0YFxuICogYGZvbnQtc2l6ZWBcbiAqIGBmb250LXN0cmV0Y2hgXG4gKiBgZm9udC1zdHlsZWBcbiAqIGBmb250LXZhcmlhbnQtYWx0ZXJuYXRlc2BcbiAqIGBmb250LXZhcmlhbnQtY2Fwc2BcbiAqIGBmb250LXZhcmlhbnQtZWFzdC1hc2lhbmBcbiAqIGBmb250LXZhcmlhbnQtbGlnYXR1cmVzYFxuICogYGZvbnQtdmFyaWFudC1udW1lcmljYFxuICogYGZvbnQtdmFyaWFudGBcbiAqIGBmb250LXdlaWdodGBcbiAqIGBmb250YFxuICogYGxldHRlci1zcGFjaW5nYFxuICogYGxpbmUtaGVpZ2h0YFxuICogYG9wYWNpdHlgXG4gKiBgb3V0bGluZWBcbiAqIGB0ZXh0LXNoYWRvd2BcbiAqIGB0cmFuc2l0aW9uYFxuICogYC1tb3otb3N4LWZvbnQtc21vb3RoaW5nYFxuICogYC1tb3otdGFwLWhpZ2hsaWdodC1jb2xvcmBcbiAqIGAtbW96LXRyYW5zaXRpb25gXG4gKiBgLXdlYmtpdC1mb250LXNtb290aGluZ2BcbiAqIGAtd2Via2l0LXRhcC1oaWdobGlnaHQtY29sb3JgXG4gKiBgLXdlYmtpdC10cmFuc2l0aW9uYFxuICogQHR5cGVkZWYge29iamVjdH0gc3R5bGVPcHRpb25zXG4gKi9cblxuLyoqXG4gKiBAc3RhdGljXG4gKiBAZnVuY3Rpb24gY3JlYXRlXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyBDcmVhdGlvbiBvcHRpb25zOlxuICogQHBhcmFtIHtDbGllbnR9IG9wdGlvbnMuY2xpZW50IEEge0BsaW5rIENsaWVudH0gaW5zdGFuY2UuXG4gKiBAcGFyYW0ge2ZpZWxkT3B0aW9uc30gb3B0aW9ucy5maWVsZHMgQSB7QGxpbmsgbW9kdWxlOnNlYW1sZXNzcGF5LXdlYi9ob3N0ZWQtZmllbGRzfmZpZWxkT3B0aW9ucyBzZXQgb2Ygb3B0aW9ucyBmb3IgZWFjaCBmaWVsZH0uXG4gKiBAcGFyYW0ge3N0eWxlT3B0aW9uc30gb3B0aW9ucy5zdHlsZXMge0BsaW5rIG1vZHVsZTpzZWFtbGVzc3BheS13ZWIvaG9zdGVkLWZpZWxkc35zdHlsZU9wdGlvbnMgU3R5bGVzfSBhcHBsaWVkIHRvIGVhY2ggZmllbGQuXG4gKiBAcGFyYW0ge2NhbGxiYWNrfSBbY2FsbGJhY2tdIFRoZSBzZWNvbmQgYXJndW1lbnQsIGBkYXRhYCwgaXMgdGhlIHtAbGluayBIb3N0ZWRGaWVsZHN9IGluc3RhbmNlLiBJZiBubyBjYWxsYmFjayBpcyBwcm92aWRlZCwgYGNyZWF0ZWAgcmV0dXJucyBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB3aXRoIHRoZSB7QGxpbmsgSG9zdGVkRmllbGRzfSBpbnN0YW5jZS5cbiAqIEByZXR1cm5zIHt2b2lkfVxuICogQGV4YW1wbGVcbiAqIHNlYW1sZXNzcGF5Lmhvc3RlZEZpZWxkcy5jcmVhdGUoe1xuICogICBwYXltZW50VHlwZTogJ0NSRURJVCcsXG4gKiAgIGNsaWVudDogY2xpZW50SW5zdGFuY2UsXG4gKiAgIHN0eWxlczoge1xuICogICAgICdpbnB1dCc6IHtcbiAqICAgICAgICdmb250LXNpemUnOiAnMTZwdCcsXG4gKiAgICAgICAnY29sb3InOiAnIzNBM0EzQSdcbiAqICAgICB9LFxuICogICAgICcubnVtYmVyJzoge1xuICogICAgICAgJ2ZvbnQtZmFtaWx5JzogJ21vbm9zcGFjZSdcbiAqICAgICB9LFxuICogICAgICcudmFsaWQnOiB7XG4gKiAgICAgICAnY29sb3InOiAnZ3JlZW4nXG4gKiAgICAgfVxuICogICB9LFxuICogICBmaWVsZHM6IHtcbiAqICAgICBhY2NvdW50TnVtYmVyOiB7XG4gKiAgICAgICBzZWxlY3RvcjogJyNhY2NvdW50LW51bWJlcidcbiAqICAgICB9LFxuICogICAgIGN2djoge1xuICogICAgICAgc2VsZWN0b3I6ICcjY3Z2JyxcbiAqICAgICAgIHBsYWNlaG9sZGVyOiAn4oCi4oCi4oCiJ1xuICogICAgIH0sXG4gKiAgICAgZXhwRGF0ZToge1xuICogICAgICAgc2VsZWN0b3I6ICcjZXhwLWRhdGUnLFxuICogICAgICAgdHlwZTogJ21vbnRoJ1xuICogICAgIH1cbiAqICAgfVxuICogfSwgY2FsbGJhY2spO1xuICogQGV4YW1wbGUgPGNhcHRpb24+UmlnaHQgdG8gTGVmdCBMYW5ndWFnZSBTdXBwb3J0PC9jYXB0aW9uPlxuICogc2VhbWxlc3NwYXkuaG9zdGVkRmllbGRzLmNyZWF0ZSh7XG4gKiAgIHBheW1lbnRUeXBlOiAnQ1JFRElUJyxcbiAqICAgY2xpZW50OiBjbGllbnRJbnN0YW5jZSxcbiAqICAgc3R5bGVzOiB7XG4gKiAgICAgJ2lucHV0Jzoge1xuICogICAgICAgLy8gb3RoZXIgc3R5bGVzXG4gKiAgICAgICBkaXJlY3Rpb246ICdydGwnXG4gKiAgICAgfSxcbiAqICAgfSxcbiAqICAgZmllbGRzOiB7XG4gKiAgICAgYWNjb3VudE51bWJlcjoge1xuICogICAgICAgc2VsZWN0b3I6ICcjYWNjb3VudC1udW1iZXInLFxuICogICAgICAgLy8gQ3JlZGl0IGNhcmQgZm9ybWF0dGluZyBpcyBub3QgY3VycmVudGx5IHN1cHBvcnRlZFxuICogICAgICAgLy8gd2l0aCBSVEwgbGFuZ3VhZ2VzLCBzbyB3ZSBuZWVkIHRvIHR1cm4gaXQgb2ZmIGZvciB0aGUgbnVtYmVyIGlucHV0XG4gKiAgICAgICBmb3JtYXRJbnB1dDogZmFsc2VcbiAqICAgICB9LFxuICogICAgIGN2djoge1xuICogICAgICAgc2VsZWN0b3I6ICcjY3Z2JyxcbiAqICAgICAgIHBsYWNlaG9sZGVyOiAn4oCi4oCi4oCiJ1xuICogICAgIH0sXG4gKiAgICAgZXhwRGF0ZToge1xuICogICAgICAgc2VsZWN0b3I6ICcjZXhwLWRhdGUnLFxuICogICAgICAgdHlwZTogJ21vbnRoJ1xuICogICAgIH1cbiAqICAgfVxuICogfSwgY2FsbGJhY2spO1xuICovXG5mdW5jdGlvbiBjcmVhdGUob3B0aW9ucykge1xuICB2YXIgaW50ZWdyYXRpb247XG4gIHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHRyeSB7XG4gICAgICBpbnRlZ3JhdGlvbiA9IG5ldyBIb3N0ZWRGaWVsZHMob3B0aW9ucyk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiByZWplY3QoZXJyb3IpO1xuICAgIH1cblxuICAgIHJldHVybiBpbnRlZ3JhdGlvbi5vbigncmVhZHknLCBmdW5jdGlvbiAoKSB7XG4gICAgICByZXNvbHZlKGludGVncmF0aW9uKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgcmV0dXJuIHByb21pc2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBjcmVhdGU6IHdyYXBQcm9taXNlKGNyZWF0ZSksXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gVGhlIGN1cnJlbnQgdmVyc2lvbiBvZiB0aGUgU0RLLCBpLmUuIGB7QHBrZyB2ZXJzaW9ufWAuXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqL1xuICBWRVJTSU9OOiBWRVJTSU9OXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY29uc3RhbnRzID0gcmVxdWlyZSgnLi9jb25zdGFudHMnKTtcblxuZnVuY3Rpb24gZ2V0TWF4TGVuZ3RoKHBheW1lbnRUeXBlLCBuYW1lKSB7XG4gIHBheW1lbnRUeXBlID0gcGF5bWVudFR5cGUgfHwgY29uc3RhbnRzLnBheW1lbnRUeXBlcy5QQVlNRU5UX1RZUEVfQ1JFRElUO1xuICByZXR1cm4gKG5hbWUgJiYgY29uc3RhbnRzLndoaXRlbGlzdGVkRmllbGRzW3BheW1lbnRUeXBlXVtuYW1lXS5kZWZhdWx0TWF4TGVuZ3RoKSB8fCBudWxsO1xufVxuXG5mdW5jdGlvbiBnZXRXaGl0ZWxpc3RlZEZpZWxkcyhwYXltZW50VHlwZSkge1xuICBwYXltZW50VHlwZSA9IHBheW1lbnRUeXBlIHx8IGNvbnN0YW50cy5wYXltZW50VHlwZXMuUEFZTUVOVF9UWVBFX0NSRURJVDtcbiAgcmV0dXJuIGNvbnN0YW50cy53aGl0ZWxpc3RlZEZpZWxkc1twYXltZW50VHlwZV07XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBnZXRXaGl0ZWxpc3RlZEZpZWxkczogZ2V0V2hpdGVsaXN0ZWRGaWVsZHMsXG4gIGdldE1heExlbmd0aDogZ2V0TWF4TGVuZ3RoXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLyogZXNsaW50LWRpc2FibGUgbm8tcmVzZXJ2ZWQta2V5cyAqL1xuXG52YXIgZW51bWVyYXRlID0gcmVxdWlyZSgnLi4vLi4vbGliL2VudW1lcmF0ZScpO1xudmFyIFZFUlNJT04gPSBcIndlYi1zZGtcIjtcblxudmFyIHBheW1lbnRUeXBlcyA9IHtcbiAgUEFZTUVOVF9UWVBFX0NSRURJVDogJ2NyZWRpdF9jYXJkJyxcbiAgUEFZTUVOVF9UWVBFX0FDSDogJ2FjaCcsXG4gIFBBWU1FTlRfVFlQRV9HSUZUX0NBUkQ6ICdnaWZ0X2NhcmQnXG59O1xuXG52YXIgQklOX0xPT0tVUF9NQVhfTEVOR1RIID0gNjtcbnZhciBUT0tFTl9UWVBFX0NIRUNLT1VUID0gJ0NIRUNLT1VUJztcbnZhciBDUkVESVQgPSBwYXltZW50VHlwZXMuUEFZTUVOVF9UWVBFX0NSRURJVDtcbnZhciBBQ0ggPSBwYXltZW50VHlwZXMuUEFZTUVOVF9UWVBFX0FDSDtcbnZhciBHSUZUID0gcGF5bWVudFR5cGVzLlBBWU1FTlRfVFlQRV9HSUZUX0NBUkQ7XG5cbnZhciByZXF1ZXN0VHlwZXMgPSB7XG4gIFJFUVVFU1RfVFlQRV9UT0tFTklaQVRJT046ICd0b2tlbml6YXRpb24nXG59O1xuXG52YXIgdG9rZW5pemVyTm9uU2VjdXJlRmllbGRzID0gW1xuICAnYmlsbGluZ0FkZHJlc3MnLFxuICAnY29tcGFueScsXG4gICdlbWFpbCcsXG4gICduYW1lJyxcbiAgJ3Bob25lTnVtYmVyJyxcbiAgJ2N1c3RvbWVyJyxcbiAgJ2FjY291bnRWYWxpZGF0aW9uJyxcbiAgJ2JhbmtBY2NvdW50VHlwZScsXG4gICdyb3V0aW5nTnVtYmVyJ1xuXTtcblxudmFyIEdJRlRfQ0FSRF9NSU5fTEVOR1RIID0gMTI7XG52YXIgR0lGVF9DQVJEX01BWF9MRU5HVEggPSAyMDtcblxudmFyIHdoaXRlbGlzdGVkRmllbGRzID0ge307XG53aGl0ZWxpc3RlZEZpZWxkc1tDUkVESVRdID0ge1xuICAvLyBQQU4tVkFVTFQ6XG4gIGFjY291bnROdW1iZXI6IHtcbiAgICBuYW1lOiAnYWNjb3VudC1udW1iZXInLFxuICAgIGxhYmVsOiAnQ2FyZCBOdW1iZXInLFxuICAgIGRlZmF1bHRNYXhMZW5ndGg6IDIyXG4gIH0sXG4gIHBvc3RhbENvZGU6IHtcbiAgICBuYW1lOiAncG9zdGFsLWNvZGUnLFxuICAgIGxhYmVsOiAnQ3VzdG9tZXIgcG9zdGFsIGNvZGUnLFxuICAgIGRlZmF1bHRNYXhMZW5ndGg6IDVcbiAgfSxcbiAgZXhwRGF0ZToge1xuICAgIG5hbWU6ICdleHAtZGF0ZScsXG4gICAgbGFiZWw6ICdFeHBpcmF0aW9uIERhdGUnLFxuICAgIGRlZmF1bHRNYXhMZW5ndGg6IDVcbiAgfSxcbiAgY3Z2OiB7XG4gICAgbmFtZTogJ2N2dicsXG4gICAgbGFiZWw6ICdDVlYnLFxuICAgIGRlZmF1bHRNYXhMZW5ndGg6IDRcbiAgfSxcbiAgbmFtZToge1xuICAgIG5hbWU6ICduYW1lJyxcbiAgICBsYWJlbDogJ0NhcmRob2xkZXIgTmFtZScsXG4gICAgZGVmYXVsdE1heExlbmd0aDogNjRcbiAgfSxcbn07XG5cbndoaXRlbGlzdGVkRmllbGRzW0FDSF0gPSB7XG4gIC8vIFBBTi1WQVVMVDpcbiAgYWNjb3VudE51bWJlcjogeyAvLyAqXG4gICAgbmFtZTogJ2FjY291bnQtbnVtYmVyJyxcbiAgICBsYWJlbDogJ0JhbmsgQ2FyZCBOdW1iZXInLFxuICAgIGRlZmF1bHRNYXhMZW5ndGg6IDE2XG4gIH0sXG4gIHZlcmlmeUFjY291bnROdW1iZXI6IHtcbiAgICBuYW1lOiAndmVyaWZ5LWFjY291bnQtbnVtYmVyJyxcbiAgICBsYWJlbDogJ1ZlcmlmeSBDYXJkIE51bWJlcicsXG4gICAgZGVmYXVsdE1heExlbmd0aDogMTZcbiAgfSxcbiAgcG9zdGFsQ29kZToge1xuICAgIG5hbWU6ICdwb3N0YWwtY29kZScsXG4gICAgbGFiZWw6ICdDdXN0b21lciBwb3N0YWwgY29kZScsXG4gICAgZGVmYXVsdE1heExlbmd0aDogNVxuICB9XG59O1xuXG53aGl0ZWxpc3RlZEZpZWxkc1tHSUZUXSA9IHtcbiAgLy8gUEFOLVZBVUxUOlxuICBhY2NvdW50TnVtYmVyOiB7XG4gICAgbmFtZTogJ2FjY291bnQtbnVtYmVyJyxcbiAgICBsYWJlbDogJ0NhcmQgTnVtYmVyJyxcbiAgICBkZWZhdWx0TWF4TGVuZ3RoOiAyMlxuICB9LFxuICBwb3N0YWxDb2RlOiB7XG4gICAgbmFtZTogJ3Bvc3RhbC1jb2RlJyxcbiAgICBsYWJlbDogJ0N1c3RvbWVyIHBvc3RhbCBjb2RlJyxcbiAgICBkZWZhdWx0TWF4TGVuZ3RoOiA1XG4gIH1cbn07XG5cbnZhciBjb25zdGFudHMgPSB7XG4gIFZFUlNJT046IFZFUlNJT04sXG4gIG1heEV4cGlyYXRpb25ZZWFyQWdlOiAzMSxcbiAgZXh0ZXJuYWxFdmVudHM6IHtcbiAgICBDSEFOR0U6ICdjaGFuZ2UnLFxuICAgIEZPQ1VTOiAnZm9jdXMnLFxuICAgIEJMVVI6ICdibHVyJyxcbiAgICBFTVBUWTogJ2VtcHR5JyxcbiAgICBOT1RfRU1QVFk6ICdub3RFbXB0eScsXG4gICAgVkFMSURJVFlfQ0hBTkdFOiAndmFsaWRpdHlDaGFuZ2UnLFxuICAgIENBUkRfVFlQRV9DSEFOR0U6ICdjYXJkVHlwZUNoYW5nZScsXG4gICAgQ0FSRF9JTkZPX0xPQURFRDogJ2NhcmRJbmZvTG9hZGVkJ1xuICB9LFxuICBleHRlcm5hbENsYXNzZXM6IHtcbiAgICBQT1RFTlRJQUxMWV9WQUxJRDogJ3NlYW1sZXNzcGF5LWhvc3RlZC1maWVsZHMtcG90ZW50aWFsbHktdmFsaWQnLFxuICAgIEZPQ1VTRUQ6ICdzZWFtbGVzc3BheS1ob3N0ZWQtZmllbGRzLWZvY3VzZWQnLFxuICAgIElOVkFMSUQ6ICdzZWFtbGVzc3BheS1ob3N0ZWQtZmllbGRzLWludmFsaWQnLFxuICAgIFZBTElEOiAnc2VhbWxlc3NwYXktaG9zdGVkLWZpZWxkcy12YWxpZCdcbiAgfSxcbiAgZGVmYXVsdElGcmFtZVN0eWxlOiB7XG4gICAgYm9yZGVyOiAnbm9uZScsXG4gICAgd2lkdGg6ICcxMDAlJyxcbiAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAnZmxvYXQnOiAnbGVmdCdcbiAgfSxcbiAgd2hpdGVsaXN0ZWRTdHlsZXM6IFtcbiAgICAnLW1vei1hcHBlYXJhbmNlJyxcbiAgICAnLW1vei1vc3gtZm9udC1zbW9vdGhpbmcnLFxuICAgICctbW96LXRhcC1oaWdobGlnaHQtY29sb3InLFxuICAgICctbW96LXRyYW5zaXRpb24nLFxuICAgICctd2Via2l0LWFwcGVhcmFuY2UnLFxuICAgICctd2Via2l0LWZvbnQtc21vb3RoaW5nJyxcbiAgICAnLXdlYmtpdC10YXAtaGlnaGxpZ2h0LWNvbG9yJyxcbiAgICAnLXdlYmtpdC10cmFuc2l0aW9uJyxcbiAgICAnYXBwZWFyYW5jZScsXG4gICAgJ2JvcmRlci1yYWRpdXMnLFxuICAgICdjb2xvcicsXG4gICAgJ2RpcmVjdGlvbicsXG4gICAgJ2ZvbnQnLFxuICAgICdmb250LWZhbWlseScsXG4gICAgJ2ZvbnQtc2l6ZScsXG4gICAgJ2ZvbnQtc2l6ZS1hZGp1c3QnLFxuICAgICdmb250LXN0cmV0Y2gnLFxuICAgICdmb250LXN0eWxlJyxcbiAgICAnZm9udC12YXJpYW50JyxcbiAgICAnZm9udC12YXJpYW50LWFsdGVybmF0ZXMnLFxuICAgICdmb250LXZhcmlhbnQtY2FwcycsXG4gICAgJ2ZvbnQtdmFyaWFudC1lYXN0LWFzaWFuJyxcbiAgICAnZm9udC12YXJpYW50LWxpZ2F0dXJlcycsXG4gICAgJ2ZvbnQtdmFyaWFudC1udW1lcmljJyxcbiAgICAnZm9udC13ZWlnaHQnLFxuICAgICdsZXR0ZXItc3BhY2luZycsXG4gICAgJ2xpbmUtaGVpZ2h0JyxcbiAgICAnbWFyZ2luJyxcbiAgICAnbWFyZ2luLXRvcCcsXG4gICAgJ21hcmdpbi1yaWdodCcsXG4gICAgJ21hcmdpbi1ib3R0b20nLFxuICAgICdtYXJnaW4tbGVmdCcsXG4gICAgJ29wYWNpdHknLFxuICAgICdvdXRsaW5lJyxcbiAgICAncGFkZGluZycsXG4gICAgJ3BhZGRpbmctdG9wJyxcbiAgICAncGFkZGluZy1yaWdodCcsXG4gICAgJ3BhZGRpbmctYm90dG9tJyxcbiAgICAncGFkZGluZy1sZWZ0JyxcbiAgICAndGV4dC1hbGlnbicsXG4gICAgJ3RleHQtc2hhZG93JyxcbiAgICAndHJhbnNpdGlvbidcbiAgXSxcbiAgd2hpdGVsaXN0ZWRGaWVsZHM6IHdoaXRlbGlzdGVkRmllbGRzLFxuICB3aGl0ZWxpc3RlZEF0dHJpYnV0ZXM6IHtcbiAgICAnYXJpYS1pbnZhbGlkJzogJ2Jvb2xlYW4nLFxuICAgICdhcmlhLXJlcXVpcmVkJzogJ2Jvb2xlYW4nLFxuICAgIGRpc2FibGVkOiAnYm9vbGVhbicsXG4gICAgcGxhY2Vob2xkZXI6ICdzdHJpbmcnXG4gIH0sXG4gIGF1dG9jb21wbGV0ZU1hcHBpbmdzOiB7XG4gICAgJ2FjY291bnQtbnVtYmVyJzogJ2NjLW51bWJlcicsXG4gICAgJ2V4cC1kYXRlJzogJ2NjLWV4cCcsXG4gICAgY3Z2OiAnY2MtY3NjJyxcbiAgICAncG9zdGFsLWNvZGUnOiAnYmlsbGluZyBwb3N0YWwtY29kZScsXG4gICAgbmFtZTogJ2NjLW5hbWUnLFxuICB9LFxuICBwYXltZW50VHlwZXM6IHBheW1lbnRUeXBlcyxcbiAgcmVxdWVzdFR5cGVzOiByZXF1ZXN0VHlwZXMsXG4gIEdJRlRfQ0FSRF9NSU5fTEVOR1RIOiBHSUZUX0NBUkRfTUlOX0xFTkdUSCxcbiAgR0lGVF9DQVJEX01BWF9MRU5HVEg6IEdJRlRfQ0FSRF9NQVhfTEVOR1RILFxuICBUT0tFTl9UWVBFX0NIRUNLT1VUOiBUT0tFTl9UWVBFX0NIRUNLT1VULFxuICBCSU5fTE9PS1VQX01BWF9MRU5HVEg6IEJJTl9MT09LVVBfTUFYX0xFTkdUSCxcbiAgdG9rZW5pemVyTm9uU2VjdXJlRmllbGRzOiB0b2tlbml6ZXJOb25TZWN1cmVGaWVsZHMsXG4gIGNhcmRCcmFuZE1hcDoge1xuICAgIHZpc2E6ICd2aXNhJyxcbiAgICBtYXN0ZXJjYXJkOiAnbWFzdGVyY2FyZCcsXG4gICAgJ2FtZXJpY2FuLWV4cHJlc3MnOiAnYW1leCcsXG4gICAgJ2RpbmVycy1jbHViJzogJ2RpbmVycycsXG4gICAgZGlzY292ZXI6ICdkaXNjb3ZlcicsXG4gICAgamNiOiAnamNiJyxcbiAgICB1bmlvbnBheTogJ3VuaW9ucGF5JyxcbiAgICBtYWVzdHJvOiAnbWFzdGVyY2FyZCcsXG4gICAgZWxvOiAnZGlzY292ZXInLFxuICAgIG1pcjogJ3Vua25vd24nLFxuICAgIGhpcGVyOiAnZGlzY292ZXInLFxuICAgIGhpcGVyY2FyZDogJ2Rpc2NvdmVyJ1xuICB9XG59O1xuXG5jb25zdGFudHMuZXZlbnRzID0gZW51bWVyYXRlKFtcbiAgJ0FVVE9GSUxMX0VYUElSQVRJT05fREFURScsXG4gICdQT1BVTEFURV9UT0tFTicsXG4gICdGUkFNRV9SRUFEWScsXG4gICdWQUxJREFURV9TVFJJQ1QnLFxuICAnQ09ORklHVVJBVElPTicsXG4gICdUT0tFTklaQVRJT05fUkVRVUVTVCcsXG4gICdJTlBVVF9FVkVOVCcsXG4gICdUUklHR0VSX0lOUFVUX0ZPQ1VTJyxcbiAgJ0FERF9DTEFTUycsXG4gICdSRU1PVkVfQ0xBU1MnLFxuICAnU0VUX0FUVFJJQlVURScsXG4gICdSRU1PVkVfQVRUUklCVVRFJyxcbiAgJ0NMRUFSX0ZJRUxEJ1xuXSwgJ2hvc3RlZC1maWVsZHM6Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gY29uc3RhbnRzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgU2VhbWxlc3NwYXlFcnJvciA9IHJlcXVpcmUoJy4uLy4uL2xpYi9zZWFtbGVzc3BheS1lcnJvcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgSE9TVEVEX0ZJRUxEU19JTlZBTElEX0ZJRUxEX0tFWToge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTUVSQ0hBTlQsXG4gICAgY29kZTogJ0hPU1RFRF9GSUVMRFNfSU5WQUxJRF9GSUVMRF9LRVknXG4gIH0sXG4gIEhPU1RFRF9GSUVMRFNfSU5WQUxJRF9GSUVMRF9ERUZBVUxUX1ZBTFVFOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnSE9TVEVEX0ZJRUxEU19JTlZBTElEX0ZJRUxEX0RFRkFVTFRfVkFMVUUnXG4gIH0sXG4gIEhPU1RFRF9GSUVMRFNfSU5WQUxJRF9GSUVMRF9TRUxFQ1RPUjoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTUVSQ0hBTlQsXG4gICAgY29kZTogJ0hPU1RFRF9GSUVMRFNfSU5WQUxJRF9GSUVMRF9TRUxFQ1RPUicsXG4gICAgbWVzc2FnZTogJ1NlbGVjdG9yIGRvZXMgbm90IHJlZmVyZW5jZSBhIHZhbGlkIERPTSBub2RlLidcbiAgfSxcbiAgSE9TVEVEX0ZJRUxEU19JTlZBTElEX1NVQk1JVF9CVVRUT05fU0VMRUNUT1I6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLk1FUkNIQU5ULFxuICAgIGNvZGU6ICdIT1NURURfRklFTERTX0lOVkFMSURfU1VCTUlUX0JVVFRPTl9TRUxFQ1RPUicsXG4gICAgbWVzc2FnZTogJ1NlbGVjdG9yIGRvZXMgbm90IHJlZmVyZW5jZSBhIHZhbGlkIERPTSBub2RlLidcbiAgfSxcbiAgSE9TVEVEX0ZJRUxEU19GSUVMRF9EVVBMSUNBVEVfSUZSQU1FOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnSE9TVEVEX0ZJRUxEU19GSUVMRF9EVVBMSUNBVEVfSUZSQU1FJyxcbiAgICBtZXNzYWdlOiAnRWxlbWVudCBhbHJlYWR5IGNvbnRhaW5zIGEgU2VhbWxlc3NwYXkgaWZyYW1lLidcbiAgfSxcbiAgSE9TVEVEX0ZJRUxEU19GSUVMRF9JTlZBTElEOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnSE9TVEVEX0ZJRUxEU19GSUVMRF9JTlZBTElEJ1xuICB9LFxuICBIT1NURURfRklFTERTX0ZJRUxEX05PVF9QUkVTRU5UOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnSE9TVEVEX0ZJRUxEU19GSUVMRF9OT1RfUFJFU0VOVCdcbiAgfSxcbiAgSE9TVEVEX0ZJRUxEU19UT0tFTklaQVRJT05fTkVUV09SS19FUlJPUjoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTkVUV09SSyxcbiAgICBjb2RlOiAnSE9TVEVEX0ZJRUxEU19UT0tFTklaQVRJT05fTkVUV09SS19FUlJPUicsXG4gICAgbWVzc2FnZTogJ0EgdG9rZW5pemF0aW9uIG5ldHdvcmsgZXJyb3Igb2NjdXJyZWQuJ1xuICB9LFxuICBIT1NURURfRklFTERTX0ZBSUxFRF9UT0tFTklaQVRJT046IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLkNVU1RPTUVSLFxuICAgIGNvZGU6ICdIT1NURURfRklFTERTX0ZBSUxFRF9UT0tFTklaQVRJT04nLFxuICAgIG1lc3NhZ2U6ICdUaGUgc3VwcGxpZWQgY2FyZCBkYXRhIGZhaWxlZCB0b2tlbml6YXRpb24uJ1xuICB9LFxuICBIT1NURURfRklFTERTX0ZJRUxEU19FTVBUWToge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuQ1VTVE9NRVIsXG4gICAgY29kZTogJ0hPU1RFRF9GSUVMRFNfRklFTERTX0VNUFRZJyxcbiAgICBtZXNzYWdlOiAnQWxsIGZpZWxkcyBhcmUgZW1wdHkuIENhbm5vdCB0b2tlbml6ZSBlbXB0eSBjYXJkIGZpZWxkcy4nXG4gIH0sXG4gIEhPU1RFRF9GSUVMRFNfRklFTERTX0lOVkFMSUQ6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLkNVU1RPTUVSLFxuICAgIGNvZGU6ICdIT1NURURfRklFTERTX0ZJRUxEU19JTlZBTElEJyxcbiAgICBtZXNzYWdlOiAnU29tZSBwYXltZW50IGlucHV0IGZpZWxkcyBhcmUgaW52YWxpZC4gQ2Fubm90IHRva2VuaXplIGludmFsaWQgY2FyZCBmaWVsZHMuJ1xuICB9LFxuICBIT1NURURfRklFTERTX0FUVFJJQlVURV9OT1RfU1VQUE9SVEVEOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnSE9TVEVEX0ZJRUxEU19BVFRSSUJVVEVfTk9UX1NVUFBPUlRFRCdcbiAgfSxcbiAgSE9TVEVEX0ZJRUxEU19BVFRSSUJVVEVfVkFMVUVfTk9UX0FMTE9XRUQ6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLk1FUkNIQU5ULFxuICAgIGNvZGU6ICdIT1NURURfRklFTERTX0FUVFJJQlVURV9WQUxVRV9OT1RfQUxMT1dFRCdcbiAgfSxcbiAgSE9TVEVEX0ZJRUxEU19JTkNPTVBBVElCTEVfRklFTERTX1NFVDoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTUVSQ0hBTlQsXG4gICAgY29kZTogJ0hPU1RFRF9GSUVMRFNfSU5DT01QQVRJQkxFX0ZJRUxEU19TRVQnXG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIGZpbmRQYXJlbnRUYWdzKGVsZW1lbnQsIHRhZykge1xuICB2YXIgcGFyZW50ID0gZWxlbWVudC5wYXJlbnROb2RlO1xuICB2YXIgcGFyZW50cyA9IFtdO1xuXG4gIHdoaWxlIChwYXJlbnQgIT0gbnVsbCkge1xuICAgIGlmIChwYXJlbnQudGFnTmFtZSAhPSBudWxsICYmIHBhcmVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09IHRhZykge1xuICAgICAgcGFyZW50cy5wdXNoKHBhcmVudCk7XG4gICAgfVxuXG4gICAgcGFyZW50ID0gcGFyZW50LnBhcmVudE5vZGU7XG4gIH1cblxuICByZXR1cm4gcGFyZW50cztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmaW5kUGFyZW50VGFncztcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBjb25zdGFudHMgPSByZXF1aXJlKCcuL2NvbnN0YW50cycpO1xuXG52YXIgcmVxdWVzdFR5cGVzID0gY29uc3RhbnRzLnJlcXVlc3RUeXBlcztcbnZhciBwYXltZW50VHlwZXMgPSBjb25zdGFudHMucGF5bWVudFR5cGVzO1xuXG52YXIgVE9LRU5JWkFUSU9OID0gcmVxdWVzdFR5cGVzLlJFUVVFU1RfVFlQRV9UT0tFTklaQVRJT047XG5cbnZhciBDUkVESVQgPSBwYXltZW50VHlwZXMuUEFZTUVOVF9UWVBFX0NSRURJVDtcbnZhciBBQ0ggPSBwYXltZW50VHlwZXMuUEFZTUVOVF9UWVBFX0FDSDtcbnZhciBHSUZUX0NBUkQgPSBwYXltZW50VHlwZXMuUEFZTUVOVF9UWVBFX0dJRlRfQ0FSRDtcblxudmFyIHJlbGF0aW9ucyA9IHt9O1xucmVsYXRpb25zW1RPS0VOSVpBVElPTl0gPSB7fTtcblxucmVsYXRpb25zW1RPS0VOSVpBVElPTl1bQ1JFRElUXSA9IHtcbiAgZmllbGRzOiBbXG4gICAgJ2FjY291bnROdW1iZXInLFxuICAgICdwb3N0YWxDb2RlJyxcbiAgICAnZXhwRGF0ZScsXG4gICAgJ2N2didcbiAgXSxcbiAgb25lT2Y6IFtcbiAgICB7XG4gICAgICByZXF1aXJlZDogWyAnYWNjb3VudE51bWJlcicsICdleHBEYXRlJyBdXG4gICAgfVxuICBdXG59O1xuXG5cbnJlbGF0aW9uc1tUT0tFTklaQVRJT05dW0FDSF0gPSB7XG4gIGZpZWxkczogW1xuICAgICdhY2NvdW50TnVtYmVyJyxcbiAgICAncG9zdGFsQ29kZScsXG4gICAgJ3ZlcmlmeUFjY291bnROdW1iZXInXG4gIF0sXG4gIGRlZmF1bHRWYWx1ZXM6IHt9LFxuICBvbmVPZjogW1xuICAgIHsgcmVxdWlyZWQ6IFsgJ2FjY291bnROdW1iZXInIF0gfSxcbiAgXSxcbiAgcmVsYXRlZEZpZWxkc1J1bGVzOiBbXG4gICAge1xuICAgICAgY29uZmlnOiAnZ2F0ZXdheUNvbmZpZ3VyYXRpb24ubWVyY2hhbnQucHJvY2Vzc29yQWNoLm5hbWUnLFxuICAgICAgdmFsdWU6ICdDSEMnLFxuICAgICAgZGVwZW5kZW5jaWVzOiB7fVxuICAgIH1cbiAgXSxcbn07XG5cbnJlbGF0aW9uc1tUT0tFTklaQVRJT05dW0dJRlRfQ0FSRF0gPSB7XG4gIGZpZWxkczogW1xuICAgICdhY2NvdW50TnVtYmVyJyxcbiAgICAncG9zdGFsQ29kZSdcbiAgXSxcbiAgb25lT2Y6IFtcbiAgICB7IHJlcXVpcmVkOiBbICdhY2NvdW50TnVtYmVyJyBdIH1cbiAgXVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSByZWxhdGlvbnM7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBvbmNlID0gcmVxdWlyZSgnLi9vbmNlJyk7XG5cbmZ1bmN0aW9uIGNhbGwoZm4sIGNhbGxiYWNrKSB7XG4gIHZhciBpc1N5bmMgPSBmbi5sZW5ndGggPT09IDA7XG5cbiAgaWYgKGlzU3luYykge1xuICAgIGZuKCk7XG4gICAgY2FsbGJhY2sobnVsbCk7XG4gIH0gZWxzZSB7XG4gICAgZm4oY2FsbGJhY2spO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGZ1bmN0aW9ucywgY2IpIHtcbiAgdmFyIGk7XG4gIHZhciBsZW5ndGggPSBmdW5jdGlvbnMubGVuZ3RoO1xuICB2YXIgcmVtYWluaW5nID0gbGVuZ3RoO1xuICB2YXIgY2FsbGJhY2sgPSBvbmNlKGNiKTtcblxuICBpZiAobGVuZ3RoID09PSAwKSB7XG4gICAgY2FsbGJhY2sobnVsbCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZnVuY3Rpb24gZmluaXNoKGVycikge1xuICAgIGlmIChlcnIpIHtcbiAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcmVtYWluaW5nIC09IDE7XG4gICAgaWYgKHJlbWFpbmluZyA9PT0gMCkge1xuICAgICAgY2FsbGJhY2sobnVsbCk7XG4gICAgfVxuICB9XG5cbiAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgY2FsbChmdW5jdGlvbnNbaV0sIGZpbmlzaCk7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc1doaXRlbGlzdGVkRG9tYWluID0gcmVxdWlyZSgnLi4vaXMtd2hpdGVsaXN0ZWQtZG9tYWluJyk7XG5cbmZ1bmN0aW9uIGNoZWNrT3JpZ2luKHBvc3RNZXNzYWdlT3JpZ2luLCBtZXJjaGFudFVybCkge1xuICB2YXIgbWVyY2hhbnRPcmlnaW4sIG1lcmNoYW50SG9zdDtcbiAgdmFyIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG5cbiAgYS5ocmVmID0gbWVyY2hhbnRVcmw7XG5cbiAgaWYgKGEucHJvdG9jb2wgPT09ICdodHRwczonKSB7XG4gICAgbWVyY2hhbnRIb3N0ID0gYS5ob3N0LnJlcGxhY2UoLzo0NDMkLywgJycpO1xuICB9IGVsc2UgaWYgKGEucHJvdG9jb2wgPT09ICdodHRwOicpIHtcbiAgICBtZXJjaGFudEhvc3QgPSBhLmhvc3QucmVwbGFjZSgvOjgwJC8sICcnKTtcbiAgfSBlbHNlIHtcbiAgICBtZXJjaGFudEhvc3QgPSBhLmhvc3Q7XG4gIH1cblxuICBtZXJjaGFudE9yaWdpbiA9IGEucHJvdG9jb2wgKyAnLy8nICsgbWVyY2hhbnRIb3N0O1xuXG4gIGlmIChtZXJjaGFudE9yaWdpbiA9PT0gcG9zdE1lc3NhZ2VPcmlnaW4pIHsgcmV0dXJuIHRydWU7IH1cblxuICBhLmhyZWYgPSBwb3N0TWVzc2FnZU9yaWdpbjtcblxuICByZXR1cm4gaXNXaGl0ZWxpc3RlZERvbWFpbihwb3N0TWVzc2FnZU9yaWdpbik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBjaGVja09yaWdpbjogY2hlY2tPcmlnaW5cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBlbnVtZXJhdGUgPSByZXF1aXJlKCcuLi9lbnVtZXJhdGUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBlbnVtZXJhdGUoW1xuICAnQ09ORklHVVJBVElPTl9SRVFVRVNUJ1xuXSwgJ2J1czonKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJ1cyA9IHJlcXVpcmUoJ2ZyYW1lYnVzJyk7XG52YXIgZXZlbnRzID0gcmVxdWlyZSgnLi9ldmVudHMnKTtcbnZhciBjaGVja09yaWdpbiA9IHJlcXVpcmUoJy4vY2hlY2stb3JpZ2luJykuY2hlY2tPcmlnaW47XG52YXIgU2VhbWxlc3NwYXlFcnJvciA9IHJlcXVpcmUoJy4uL3NlYW1sZXNzcGF5LWVycm9yJyk7XG5cbmZ1bmN0aW9uIFNlYW1sZXNzcGF5QnVzKG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgdGhpcy5jaGFubmVsID0gb3B0aW9ucy5jaGFubmVsO1xuICBpZiAoIXRoaXMuY2hhbm5lbCkge1xuICAgIHRocm93IG5ldyBTZWFtbGVzc3BheUVycm9yKHtcbiAgICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuSU5URVJOQUwsXG4gICAgICBjb2RlOiAnTUlTU0lOR19DSEFOTkVMX0lEJyxcbiAgICAgIG1lc3NhZ2U6ICdDaGFubmVsIElEIG11c3QgYmUgc3BlY2lmaWVkLidcbiAgICB9KTtcbiAgfVxuXG4gIHRoaXMubWVyY2hhbnRVcmwgPSBvcHRpb25zLm1lcmNoYW50VXJsO1xuXG4gIHRoaXMuX2lzRGVzdHJveWVkID0gZmFsc2U7XG4gIHRoaXMuX2lzVmVyYm9zZSA9IGZhbHNlO1xuXG4gIHRoaXMuX2xpc3RlbmVycyA9IFtdO1xuXG4gIHRoaXMuX2xvZygnbmV3IGJ1cyBvbiBjaGFubmVsICcgKyB0aGlzLmNoYW5uZWwsIFtsb2NhdGlvbi5ocmVmXSk7XG59XG5cblNlYW1sZXNzcGF5QnVzLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uIChldmVudE5hbWUsIG9yaWdpbmFsSGFuZGxlcikge1xuICB2YXIgbmFtZXNwYWNlZEV2ZW50LCBhcmdzO1xuICB2YXIgaGFuZGxlciA9IG9yaWdpbmFsSGFuZGxlcjtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIGlmICh0aGlzLl9pc0Rlc3Ryb3llZCkgeyByZXR1cm47IH1cblxuICBpZiAodGhpcy5tZXJjaGFudFVybCkge1xuICAgIGhhbmRsZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby1pbnZhbGlkLXRoaXMgKi9cbiAgICAgIGlmIChjaGVja09yaWdpbih0aGlzLm9yaWdpbiwgc2VsZi5tZXJjaGFudFVybCkpIHtcbiAgICAgICAgb3JpZ2luYWxIYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9XG4gICAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLWludmFsaWQtdGhpcyAqL1xuICAgIH07XG4gIH1cblxuICBuYW1lc3BhY2VkRXZlbnQgPSB0aGlzLl9uYW1lc3BhY2VFdmVudChldmVudE5hbWUpO1xuICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgYXJnc1swXSA9IG5hbWVzcGFjZWRFdmVudDtcbiAgYXJnc1sxXSA9IGhhbmRsZXI7XG5cbiAgdGhpcy5fbG9nKCdvbicsIGFyZ3MpO1xuICBidXMub24uYXBwbHkoYnVzLCBhcmdzKTtcblxuICB0aGlzLl9saXN0ZW5lcnMucHVzaCh7XG4gICAgZXZlbnROYW1lOiBldmVudE5hbWUsXG4gICAgaGFuZGxlcjogaGFuZGxlcixcbiAgICBvcmlnaW5hbEhhbmRsZXI6IG9yaWdpbmFsSGFuZGxlclxuICB9KTtcbn07XG5cblNlYW1sZXNzcGF5QnVzLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24gKGV2ZW50TmFtZSkge1xuICB2YXIgYXJncztcblxuICBpZiAodGhpcy5faXNEZXN0cm95ZWQpIHsgcmV0dXJuOyB9XG5cbiAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gIGFyZ3NbMF0gPSB0aGlzLl9uYW1lc3BhY2VFdmVudChldmVudE5hbWUpO1xuXG4gIHRoaXMuX2xvZygnZW1pdCcsIGFyZ3MpO1xuICBidXMuZW1pdC5hcHBseShidXMsIGFyZ3MpO1xufTtcblxuU2VhbWxlc3NwYXlCdXMucHJvdG90eXBlLl9vZmZEaXJlY3QgPSBmdW5jdGlvbiAoZXZlbnROYW1lKSB7XG4gIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcblxuICBpZiAodGhpcy5faXNEZXN0cm95ZWQpIHsgcmV0dXJuOyB9XG5cbiAgYXJnc1swXSA9IHRoaXMuX25hbWVzcGFjZUV2ZW50KGV2ZW50TmFtZSk7XG5cbiAgdGhpcy5fbG9nKCdvZmYnLCBhcmdzKTtcbiAgYnVzLm9mZi5hcHBseShidXMsIGFyZ3MpO1xufTtcblxuU2VhbWxlc3NwYXlCdXMucHJvdG90eXBlLm9mZiA9IGZ1bmN0aW9uIChldmVudE5hbWUsIG9yaWdpbmFsSGFuZGxlcikge1xuICB2YXIgaSwgbGlzdGVuZXI7XG4gIHZhciBoYW5kbGVyID0gb3JpZ2luYWxIYW5kbGVyO1xuXG4gIGlmICh0aGlzLl9pc0Rlc3Ryb3llZCkgeyByZXR1cm47IH1cblxuICBpZiAodGhpcy5tZXJjaGFudFVybCkge1xuICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLl9saXN0ZW5lcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxpc3RlbmVyID0gdGhpcy5fbGlzdGVuZXJzW2ldO1xuXG4gICAgICBpZiAobGlzdGVuZXIub3JpZ2luYWxIYW5kbGVyID09PSBvcmlnaW5hbEhhbmRsZXIpIHtcbiAgICAgICAgaGFuZGxlciA9IGxpc3RlbmVyLmhhbmRsZXI7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdGhpcy5fb2ZmRGlyZWN0KGV2ZW50TmFtZSwgaGFuZGxlcik7XG59O1xuXG5TZWFtbGVzc3BheUJ1cy5wcm90b3R5cGUuX25hbWVzcGFjZUV2ZW50ID0gZnVuY3Rpb24gKGV2ZW50TmFtZSkge1xuICByZXR1cm4gWydzZWFtbGVzc3BheScsIHRoaXMuY2hhbm5lbCwgZXZlbnROYW1lXS5qb2luKCc6Jyk7XG59O1xuXG5TZWFtbGVzc3BheUJ1cy5wcm90b3R5cGUudGVhcmRvd24gPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBsaXN0ZW5lciwgaTtcblxuICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5fbGlzdGVuZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgbGlzdGVuZXIgPSB0aGlzLl9saXN0ZW5lcnNbaV07XG4gICAgdGhpcy5fb2ZmRGlyZWN0KGxpc3RlbmVyLmV2ZW50TmFtZSwgbGlzdGVuZXIuaGFuZGxlcik7XG4gIH1cblxuICB0aGlzLl9saXN0ZW5lcnMubGVuZ3RoID0gMDtcblxuICB0aGlzLl9pc0Rlc3Ryb3llZCA9IHRydWU7XG59O1xuXG5TZWFtbGVzc3BheUJ1cy5wcm90b3R5cGUuX2xvZyA9IGZ1bmN0aW9uIChmdW5jdGlvbk5hbWUsIGFyZ3MpIHtcbiAgaWYgKHRoaXMuX2lzVmVyYm9zZSkge1xuICAgIGNvbnNvbGUubG9nKGZ1bmN0aW9uTmFtZSwgYXJncyk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICB9XG59O1xuXG5TZWFtbGVzc3BheUJ1cy5ldmVudHMgPSBldmVudHM7XG5cbm1vZHVsZS5leHBvcnRzID0gU2VhbWxlc3NwYXlCdXM7XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIF9jbGFzc2VzT2YoZWxlbWVudCkge1xuICByZXR1cm4gZWxlbWVudC5jbGFzc05hbWUudHJpbSgpLnNwbGl0KC9cXHMrLyk7XG59XG5cbmZ1bmN0aW9uIGFkZChlbGVtZW50KSB7XG4gIHZhciB0b0FkZCA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gIHZhciBjbGFzc05hbWUgPSBfY2xhc3Nlc09mKGVsZW1lbnQpLmZpbHRlcihmdW5jdGlvbiAoY2xhc3NuYW1lKSB7XG4gICAgcmV0dXJuIHRvQWRkLmluZGV4T2YoY2xhc3NuYW1lKSA9PT0gLTE7XG4gIH0pLmNvbmNhdCh0b0FkZCkuam9pbignICcpO1xuXG4gIGVsZW1lbnQuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xufVxuXG5mdW5jdGlvbiByZW1vdmUoZWxlbWVudCkge1xuICB2YXIgdG9SZW1vdmUgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICB2YXIgY2xhc3NOYW1lID0gX2NsYXNzZXNPZihlbGVtZW50KS5maWx0ZXIoZnVuY3Rpb24gKGNsYXNzbmFtZSkge1xuICAgIHJldHVybiB0b1JlbW92ZS5pbmRleE9mKGNsYXNzbmFtZSkgPT09IC0xO1xuICB9KS5qb2luKCcgJyk7XG5cbiAgZWxlbWVudC5jbGFzc05hbWUgPSBjbGFzc05hbWU7XG59XG5cbmZ1bmN0aW9uIHRvZ2dsZShlbGVtZW50LCBjbGFzc25hbWUsIGFkZGluZykge1xuICBpZiAoYWRkaW5nKSB7XG4gICAgYWRkKGVsZW1lbnQsIGNsYXNzbmFtZSk7XG4gIH0gZWxzZSB7XG4gICAgcmVtb3ZlKGVsZW1lbnQsIGNsYXNzbmFtZSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFkZDogYWRkLFxuICByZW1vdmU6IHJlbW92ZSxcbiAgdG9nZ2xlOiB0b2dnbGVcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgY29uc3RhbnRzID0gcmVxdWlyZSgnLi4vY2FyZC1lbGVtZW50L3NoYXJlZC9jb25zdGFudHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjb21wb3NlVXJsKGNvbmZpZywgdHlwZSwgY29tcG9uZW50SWQsIGlzRGVidWcpIHtcbiAgdmFyIGFzc2V0c1VybCA9IGNvbmZpZy5nYXRld2F5Q29uZmlndXJhdGlvbi5hc3NldHNVcmw7XG5cbiAgaWYgKGlzRGVidWcpIHtcbiAgICBhc3NldHNVcmwgPSBhc3NldHNVcmwucmVwbGFjZSgnaHR0cHMnLCAnaHR0cCcpO1xuICB9XG4gIHZhciBtaW4gPSBpc0RlYnVnID8gJycgOiAnLm1pbic7XG5cbiAgcmV0dXJuIGFzc2V0c1VybCArICcvJyArIGNvbnN0YW50cy5WRVJTSU9OICsgJy9odG1sLycgKyB0eXBlICsgJy1mcmFtZScgKyBtaW4gKyAnLmh0bWwjJyArIGNvbXBvbmVudElkO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFNlYW1sZXNzcGF5RXJyb3IgPSByZXF1aXJlKCcuL3NlYW1sZXNzcGF5LWVycm9yJyk7XG52YXIgc2hhcmVkRXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIG1ldGhvZE5hbWVzKSB7XG4gIG1ldGhvZE5hbWVzLmZvckVhY2goZnVuY3Rpb24gKG1ldGhvZE5hbWUpIHtcbiAgICBpbnN0YW5jZVttZXRob2ROYW1lXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRocm93IG5ldyBTZWFtbGVzc3BheUVycm9yKHtcbiAgICAgICAgdHlwZTogc2hhcmVkRXJyb3JzLk1FVEhPRF9DQUxMRURfQUZURVJfVEVBUkRPV04udHlwZSxcbiAgICAgICAgY29kZTogc2hhcmVkRXJyb3JzLk1FVEhPRF9DQUxMRURfQUZURVJfVEVBUkRPV04uY29kZSxcbiAgICAgICAgbWVzc2FnZTogbWV0aG9kTmFtZSArICcgY2Fubm90IGJlIGNhbGxlZCBhZnRlciB0ZWFyZG93bi4nXG4gICAgICB9KTtcbiAgICB9O1xuICB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGZuKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgLy8gSUU5IGRvZXNuJ3Qgc3VwcG9ydCBwYXNzaW5nIGFyZ3VtZW50cyB0byBzZXRUaW1lb3V0IHNvIHdlIGhhdmUgdG8gZW11bGF0ZSBpdC5cbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcblxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgZm4uYXBwbHkobnVsbCwgYXJncyk7XG4gICAgfSwgMSk7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmF0Y2hFeGVjdXRlRnVuY3Rpb25zID0gcmVxdWlyZSgnLi9iYXRjaC1leGVjdXRlLWZ1bmN0aW9ucycpO1xuXG5mdW5jdGlvbiBEZXN0cnVjdG9yKCkge1xuICB0aGlzLl90ZWFyZG93blJlZ2lzdHJ5ID0gW107XG5cbiAgdGhpcy5faXNUZWFyaW5nRG93biA9IGZhbHNlO1xufVxuXG5EZXN0cnVjdG9yLnByb3RvdHlwZS5yZWdpc3RlckZ1bmN0aW9uRm9yVGVhcmRvd24gPSBmdW5jdGlvbiAoZm4pIHtcbiAgaWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHRoaXMuX3RlYXJkb3duUmVnaXN0cnkucHVzaChmbik7XG4gIH1cbn07XG5cbkRlc3RydWN0b3IucHJvdG90eXBlLnRlYXJkb3duID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIGlmICh0aGlzLl9pc1RlYXJpbmdEb3duKSB7XG4gICAgY2FsbGJhY2sobmV3IEVycm9yKCdEZXN0cnVjdG9yIGlzIGFscmVhZHkgdGVhcmluZyBkb3duJykpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRoaXMuX2lzVGVhcmluZ0Rvd24gPSB0cnVlO1xuXG4gIGJhdGNoRXhlY3V0ZUZ1bmN0aW9ucyh0aGlzLl90ZWFyZG93blJlZ2lzdHJ5LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgdGhpcy5fdGVhcmRvd25SZWdpc3RyeSA9IFtdO1xuICAgIHRoaXMuX2lzVGVhcmluZ0Rvd24gPSBmYWxzZTtcblxuICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgfVxuICB9LmJpbmQodGhpcykpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBEZXN0cnVjdG9yO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBlbnVtZXJhdGUodmFsdWVzLCBwcmVmaXgpIHtcbiAgcHJlZml4ID0gcHJlZml4ID09IG51bGwgPyAnJyA6IHByZWZpeDtcblxuICByZXR1cm4gdmFsdWVzLnJlZHVjZShmdW5jdGlvbiAoZW51bWVyYXRpb24sIHZhbHVlKSB7XG4gICAgZW51bWVyYXRpb25bdmFsdWVdID0gcHJlZml4ICsgdmFsdWU7XG4gICAgcmV0dXJuIGVudW1lcmF0aW9uO1xuICB9LCB7fSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZW51bWVyYXRlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgU2VhbWxlc3NwYXlFcnJvciA9IHJlcXVpcmUoJy4vc2VhbWxlc3NwYXktZXJyb3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIElOVkFMSURfVVNFX09GX0lOVEVSTkFMX0ZVTkNUSU9OOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5JTlRFUk5BTCxcbiAgICBjb2RlOiAnSU5WQUxJRF9VU0VfT0ZfSU5URVJOQUxfRlVOQ1RJT04nXG4gIH0sXG4gIENBTExCQUNLX1JFUVVJUkVEOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnQ0FMTEJBQ0tfUkVRVUlSRUQnXG4gIH0sXG4gIElOU1RBTlRJQVRJT05fT1BUSU9OX1JFUVVJUkVEOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnSU5TVEFOVElBVElPTl9PUFRJT05fUkVRVUlSRUQnXG4gIH0sXG4gIElOVkFMSURfT1BUSU9OOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnSU5WQUxJRF9PUFRJT04nXG4gIH0sXG4gIElOQ09NUEFUSUJMRV9WRVJTSU9OUzoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTUVSQ0hBTlQsXG4gICAgY29kZTogJ0lOQ09NUEFUSUJMRV9WRVJTSU9OUydcbiAgfSxcbiAgSU5DT01QQVRJQkxFX0ZJRUxEU19TRVQ6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLk1FUkNIQU5ULFxuICAgIGNvZGU6ICdJTkNPTVBBVElCTEVfRklFTERTX1NFVCdcbiAgfSxcbiAgTUVUSE9EX0NBTExFRF9BRlRFUl9URUFSRE9XTjoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTUVSQ0hBTlQsXG4gICAgY29kZTogJ01FVEhPRF9DQUxMRURfQUZURVJfVEVBUkRPV04nXG4gIH0sXG4gIFNFQU1MRVNTUEFZX0FQSV9BQ0NFU1NfUkVTVFJJQ1RFRDoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTUVSQ0hBTlQsXG4gICAgY29kZTogJ1NFQU1MRVNTUEFZX0FQSV9BQ0NFU1NfUkVTVFJJQ1RFRCcsXG4gICAgbWVzc2FnZTogJ1lvdXIgYWNjZXNzIGlzIHJlc3RyaWN0ZWQgYW5kIGNhbm5vdCB1c2UgdGhpcyBwYXJ0IG9mIHRoZSBTZWFtbGVzc3BheSBBUEkuJ1xuICB9LFxuICBTRUFNTEVTU1BBWV9QQVlQQUxfTk9UX0xPQURFRDoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuSU5URVJOQUwsXG4gICAgY29kZTogJ1NFQU1MRVNTUEFZX1BBWVBBTF9OT1RfTE9BREVEJyxcbiAgICBtZXNzYWdlOiAnUGF5cGFsIFNESyBjb3VsZCBub3QgYmUgbG9hZGVkLidcbiAgfSxcbiAgSU5WQUxJRF9MQVRJTjFfU1RSSU5HOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5JTlRFUk5BTCxcbiAgICBjb2RlOiAnSU5WQUxJRF9MQVRJTjFfU1RSSU5HJ1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIHRoaXMuX2V2ZW50cyA9IHt9O1xufVxuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gZnVuY3Rpb24gKGV2ZW50LCBjYWxsYmFjaykge1xuICBpZiAodGhpcy5fZXZlbnRzW2V2ZW50XSkge1xuICAgIHRoaXMuX2V2ZW50c1tldmVudF0ucHVzaChjYWxsYmFjayk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5fZXZlbnRzW2V2ZW50XSA9IFtjYWxsYmFja107XG4gIH1cbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2VtaXQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgdmFyIGksIGFyZ3M7XG4gIHZhciBjYWxsYmFja3MgPSB0aGlzLl9ldmVudHNbZXZlbnRdO1xuXG4gIGlmICghY2FsbGJhY2tzKSB7IHJldHVybjsgfVxuXG4gIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG4gIGZvciAoaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcbiAgICBjYWxsYmFja3NbaV0uYXBwbHkobnVsbCwgYXJncyk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluamVjdEZyYW1lKGZyYW1lLCBjb250YWluZXIpIHtcbiAgdmFyIGNsZWFyYm90aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICB2YXIgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cbiAgY2xlYXJib3RoLnN0eWxlLmNsZWFyID0gJ2JvdGgnO1xuXG4gIGZyYWdtZW50LmFwcGVuZENoaWxkKGZyYW1lKTtcbiAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQoY2xlYXJib3RoKTtcblxuICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZnJhZ21lbnQpO1xuXG4gIHJldHVybiBbZnJhbWUsIGNsZWFyYm90aF07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzSW9zKHVzZXJBZ2VudCkge1xuICB1c2VyQWdlbnQgPSB1c2VyQWdlbnQgfHwgbmF2aWdhdG9yLnVzZXJBZ2VudDtcbiAgcmV0dXJuIC8oaVBhZHxpUGhvbmV8aVBvZCkvaS50ZXN0KHVzZXJBZ2VudCk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQVBJX0hPU1QgPSB1bmRlZmluZWQ7XG52YXIgUEFOVkFVTFRfSE9TVCA9IHVuZGVmaW5lZDtcbnZhciBBU1NFVFNfSE9TVCA9IFwiaHR0cDovL2xvY2FsaG9zdDozMDAxL2RldlwiO1xuXG52YXIgbGVnYWxIb3N0cyA9IFtcbiAgJ3NlYW1sZXNzcGF5LmNvbScsXG4gICdzZWFtbGVzc3BheS5kZXYnLFxuICAnc2VhbWxlc3NwYXkuaW8nLFxuICAnd2ViLXNkay5zZWFtbGVzc3BheS5jb20nLFxuICAnYXBpLnNlYW1sZXNzcGF5LmNvbScsXG4gICdhcGkuc2VhbWxlc3NwYXkuZGV2JyxcbiAgJ2FwaS5zZWFtbGVzc3BheS5pbycsXG4gICdwYW4tdmF1bHQuc2VhbWxlc3NwYXkuY29tJyxcbiAgJ3Bhbi12YXVsdC5zZWFtbGVzc3BheS5kZXYnLFxuICAncGFuLXZhdWx0LnNlYW1sZXNzcGF5LmlvJyxcbiAgJ2FwaS5zYW5kYm94LnNlYW1sZXNzcGF5LmNvbScsXG4gICdhcGkuc2FuZGJveC5zZWFtbGVzc3BheS5kZXYnLFxuICAnYXBpLnNhbmRib3guc2VhbWxlc3NwYXkuaW8nLFxuICAncGFuLXZhdWx0LnNhbmRib3guc2VhbWxlc3NwYXkuY29tJyxcbiAgJ3Bhbi12YXVsdC5zYW5kYm94LnNlYW1sZXNzcGF5LmRldicsXG4gICdwYW4tdmF1bHQuc2FuZGJveC5zZWFtbGVzc3BheS5pbydcbl07XG5cbi8vIHJlbW92ZUlmKHByb2R1Y3Rpb24pXG5sZWdhbEhvc3RzLnB1c2goJ2xvY2FsaG9zdCcpO1xuaWYgKEFQSV9IT1NUKSB7XG4gIGxlZ2FsSG9zdHMucHVzaChzdHJpcFN1YmRvbWFpbnMoQVBJX0hPU1QpKTtcbn1cbmlmIChQQU5WQVVMVF9IT1NUKSB7XG4gIGxlZ2FsSG9zdHMucHVzaChzdHJpcFN1YmRvbWFpbnMoUEFOVkFVTFRfSE9TVCkpO1xufVxuaWYgKEFTU0VUU19IT1NUKSB7XG4gIGxlZ2FsSG9zdHMucHVzaChzdHJpcFN1YmRvbWFpbnMoQVNTRVRTX0hPU1QpLnJlcGxhY2UoJ2h0dHA6Ly8nLCAnJykucmVwbGFjZSgnaHR0cHM6Ly8nLCAnJykpO1xufVxuLy8gZW5kUmVtb3ZlSWYocHJvZHVjdGlvbilcblxuZnVuY3Rpb24gc3RyaXBTdWJkb21haW5zKGRvbWFpbikge1xuICByZXR1cm4gZG9tYWluLnNwbGl0KCcuJykuc2xpY2UoLTIpLmpvaW4oJy4nKTtcbn1cblxuZnVuY3Rpb24gaXNXaGl0ZWxpc3RlZERvbWFpbih1cmwpIHtcbiAgLy8gdmFyIG1haW5Eb21haW47XG5cbiAgLy8gdXJsID0gdXJsLnRvTG93ZXJDYXNlKCk7XG5cbiAgLy8gaWYgKCEobmV3IFJlZ0V4cCgnXmh0dHBzPzonKSkudGVzdCh1cmwpKSB7XG4gIC8vICAgcmV0dXJuIGZhbHNlO1xuICAvLyB9XG5cbiAgLy8gcGFyc2VyID0gcGFyc2VyIHx8IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgLy8gcGFyc2VyLmhyZWYgPSB1cmw7XG4gIC8vIG1haW5Eb21haW4gPSBzdHJpcFN1YmRvbWFpbnMocGFyc2VyLmhvc3RuYW1lKTtcbiAgdHJ5IHtcbiAgICB2YXIgcGFyc2VkVXJsID0gbmV3IFVSTCh1cmwpO1xuICAgIHJldHVybiBsZWdhbEhvc3RzLmluZGV4T2Yoc3RyaXBTdWJkb21haW5zKHBhcnNlZFVybC5ob3N0bmFtZSkpICE9PSAtMTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzV2hpdGVsaXN0ZWREb21haW47XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5maWx0ZXIoZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiB0eXBlb2Ygb2JqW2tleV0gPT09ICdmdW5jdGlvbic7XG4gIH0pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFByb21pc2UgPSBnbG9iYWwuUHJvbWlzZTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm9taXNlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZW51bWVyYXRlID0gcmVxdWlyZSgnLi9lbnVtZXJhdGUnKTtcblxuLyoqXG4gKiBAY2xhc3NcbiAqIEBnbG9iYWxcbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIENvbnN0cnVjdGlvbiBvcHRpb25zXG4gKiBAY2xhc3NkZXNjIFRoaXMgY2xhc3MgaXMgdXNlZCB0byByZXBvcnQgZXJyb3IgY29uZGl0aW9ucywgZnJlcXVlbnRseSBhcyB0aGUgZmlyc3QgcGFyYW1ldGVyIHRvIGNhbGxiYWNrcyB0aHJvdWdob3V0IHRoZSBTZWFtbGVzc3BheSBTREsuXG4gKiBAZGVzY3JpcHRpb24gPHN0cm9uZz5Zb3UgY2Fubm90IHVzZSB0aGlzIGNvbnN0cnVjdG9yIGRpcmVjdGx5LiBJbnRlcmFjdCB3aXRoIGluc3RhbmNlcyBvZiB0aGlzIGNsYXNzIHRocm91Z2gge0BsaW5rIGNhbGxiYWNrIGNhbGxiYWNrc30uPC9zdHJvbmc+XG4gKi9cbmZ1bmN0aW9uIFNlYW1sZXNzcGF5RXJyb3Iob3B0aW9ucykge1xuICBpZiAoIVNlYW1sZXNzcGF5RXJyb3IudHlwZXMuaGFzT3duUHJvcGVydHkob3B0aW9ucy50eXBlKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihvcHRpb25zLnR5cGUgKyAnIGlzIG5vdCBhIHZhbGlkIHR5cGUuJyk7XG4gIH1cblxuICBpZiAoIW9wdGlvbnMuY29kZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignRXJyb3IgY29kZSByZXF1aXJlZC4nKTtcbiAgfVxuXG4gIGlmICghb3B0aW9ucy5tZXNzYWdlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdFcnJvciBtZXNzYWdlIHJlcXVpcmVkLicpO1xuICB9XG5cbiAgdGhpcy5uYW1lID0gJ1NlYW1sZXNzcGF5RXJyb3InO1xuXG4gIC8qKlxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKiBAZGVzY3JpcHRpb24gQSBjb2RlIHRoYXQgY29ycmVzcG9uZHMgdG8gc3BlY2lmaWMgZXJyb3JzLlxuICAgKi9cbiAgdGhpcy5jb2RlID0gb3B0aW9ucy5jb2RlO1xuXG4gIC8qKlxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKiBAZGVzY3JpcHRpb24gQSBzaG9ydCBkZXNjcmlwdGlvbiBvZiB0aGUgZXJyb3IuXG4gICAqL1xuICB0aGlzLm1lc3NhZ2UgPSBvcHRpb25zLm1lc3NhZ2U7XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtTZWFtbGVzc3BheUVycm9yLnR5cGVzfVxuICAgKiBAZGVzY3JpcHRpb24gVGhlIHR5cGUgb2YgZXJyb3IuXG4gICAqL1xuICB0aGlzLnR5cGUgPSBvcHRpb25zLnR5cGU7XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtvYmplY3Q9fVxuICAgKiBAZGVzY3JpcHRpb24gQWRkaXRpb25hbCBpbmZvcm1hdGlvbiBhYm91dCB0aGUgZXJyb3IsIHN1Y2ggYXMgYW4gdW5kZXJseWluZyBuZXR3b3JrIGVycm9yIHJlc3BvbnNlLlxuICAgKi9cbiAgdGhpcy5kZXRhaWxzID0gb3B0aW9ucy5kZXRhaWxzO1xufVxuXG5TZWFtbGVzc3BheUVycm9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlKTtcblNlYW1sZXNzcGF5RXJyb3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gU2VhbWxlc3NwYXlFcnJvcjtcblxuLyoqXG4gKiBFbnVtIGZvciB7QGxpbmsgU2VhbWxlc3NwYXlFcnJvcn0gdHlwZXMuXG4gKiBAbmFtZSBTZWFtbGVzc3BheUVycm9yLnR5cGVzXG4gKiBAZW51bVxuICogQHJlYWRvbmx5XG4gKiBAbWVtYmVyb2YgU2VhbWxlc3NwYXlFcnJvclxuICogQHByb3BlcnR5IHtzdHJpbmd9IENVU1RPTUVSIEFuIGVycm9yIGNhdXNlZCBieSB0aGUgY3VzdG9tZXIuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gTUVSQ0hBTlQgQW4gZXJyb3IgdGhhdCBpcyBhY3Rpb25hYmxlIGJ5IHRoZSBtZXJjaGFudC5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBORVRXT1JLIEFuIGVycm9yIGR1ZSB0byBhIG5ldHdvcmsgcHJvYmxlbS5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBJTlRFUk5BTCBBbiBlcnJvciBjYXVzZWQgYnkgU2VhbWxlc3NwYXkgY29kZS5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBVTktOT1dOIEFuIGVycm9yIHdoZXJlIHRoZSBvcmlnaW4gaXMgdW5rbm93bi5cbiAqL1xuU2VhbWxlc3NwYXlFcnJvci50eXBlcyA9IGVudW1lcmF0ZShbXG4gICdDVVNUT01FUicsXG4gICdNRVJDSEFOVCcsXG4gICdORVRXT1JLJyxcbiAgJ0lOVEVSTkFMJyxcbiAgJ1VOS05PV04nXG5dKTtcblxubW9kdWxlLmV4cG9ydHMgPSBTZWFtbGVzc3BheUVycm9yO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiB1dWlkKCkge1xuICByZXR1cm4gJ3h4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eCcucmVwbGFjZSgvW3h5XS9nLCBmdW5jdGlvbiAoYykge1xuICAgIHZhciByID0gTWF0aC5yYW5kb20oKSAqIDE2IHwgMDtcbiAgICB2YXIgdiA9IGMgPT09ICd4JyA/IHIgOiByICYgMHgzIHwgMHg4O1xuXG4gICAgcmV0dXJuIHYudG9TdHJpbmcoMTYpO1xuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB1dWlkO1xuIl19
