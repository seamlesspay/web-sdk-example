(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.seamlesspay = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(_dereq_,module,exports){
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

var SeamlesspayError = _dereq_('../../lib/seamlesspay-error');
var errors = _dereq_('../shared/errors');
var whitelist = _dereq_('../shared/constants').whitelistedAttributes;

function attributeValidationError(attribute, value) {
  var err;

  if (!whitelist.hasOwnProperty(attribute)) {
    err = new SeamlesspayError({
      type: errors.CARD_ELEMENT_ATTRIBUTE_NOT_SUPPORTED.type,
      code: errors.CARD_ELEMENT_ATTRIBUTE_NOT_SUPPORTED.code,
      message: 'The "' + attribute + '" attribute is not supported in Card Element.'
    });
  } else if (value != null && !_isValid(attribute, value)) {
    err = new SeamlesspayError({
      type: errors.CARD_ELEMENT_ATTRIBUTE_VALUE_NOT_ALLOWED.type,
      code: errors.CARD_ELEMENT_ATTRIBUTE_VALUE_NOT_ALLOWED.code,
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

},{"../../lib/seamlesspay-error":83,"../shared/constants":20,"../shared/errors":21}],18:[function(_dereq_,module,exports){
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

var assign = _dereq_('../../lib/assign').assign;

var cardElementFields = [
  'accountNumber',
  'expDate',
  'cvv',
  'postalCode'
];

/**
 * @typedef {object} CardElement~tokenizePayload
 * @property {string} nonce The payment method nonce.
 * @property {object} details Additional account details.
 * @property {string} details.cardType Type of card, ex: Visa, MasterCard.
 * @property {string} details.lastTwo Last two digits of card number.
 * @property {string} description A human-readable description.
 * @property {string} type The payment method type, always `CreditCard`.
 */

/**
 * @typedef {object} CardElement~stateObject
 * @description The event payload sent from {@link CardElement#on|on} or {@link CardElement#getState|getState}.
 * @property {CardElement~CardElementCard[]} cards
 * This will return an array of potential {@link CardElement~CardElementCard|cards}. If the card type has been determined, the array will contain only one card.
 * Internally, Card Element uses <a href="https://github.com/seamlesspay/credit-card-type">credit-card-type</a>,
 * an open-source card detection library.
 * @property {string} emittedBy
 * The name of the field associated with an event. This will not be included if returned by {@link CardElement#getState|getState}. It will be one of the following strings:<br>
 * - `"number"`
 * - `"cvv"`
 * - `"expDate"`
 * - `"expirationMonth"`
 * - `"expirationYear"`
 * - `"postalCode"`
 * @property {object} fields
 * @property {?CardElement~CardElementFieldData} fields.number {@link CardElement~CardElementFieldData|CardElementFieldData} for the number field, if it is present.
 * @property {?CardElement~CardElementFieldData} fields.cvv {@link CardElement~CardElementFieldData|CardElementFieldData} for the CVV field, if it is present.
 * @property {?CardElement~CardElementFieldData} fields.expDate {@link CardElement~CardElementFieldData|CardElementFieldData} for the expiration date field, if it is present.
 * @property {?CardElement~CardElementFieldData} fields.expirationMonth {@link CardElement~CardElementFieldData|CardElementFieldData} for the expiration month field, if it is present.
 * @property {?CardElement~CardElementFieldData} fields.expirationYear {@link CardElement~CardElementFieldData|CardElementFieldData} for the expiration year field, if it is present.
 * @property {?CardElement~CardElementFieldData} fields.postalCode {@link CardElement~CardElementFieldData|CardElementFieldData} for the postal code field, if it is present.
 */

/**
 * @typedef {object} CardElement~CardElementFieldData
 * @description Data about Card Element fields, sent in {@link CardElement~stateObject|stateObjects}.
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
 * @typedef {object} CardElement~CardElementCard
 * @description Information about the card type, sent in {@link CardElement~stateObject|stateObjects}.
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
 * @name CardElement#on
 * @function
 * @param {string} event The name of the event to which you are subscribing.
 * @param {function} handler A callback to handle the event.
 * @description Subscribes a handler function to a named event. `event` should be {@link CardElement#event:blur|blur}, {@link CardElement#event:focus|focus}, {@link CardElement#event:empty|empty}, {@link CardElement#event:notEmpty|notEmpty}, {@link CardElement#event:cardTypeChange|cardTypeChange}, or {@link CardElement#event:validityChange|validityChange}. Events will emit a {@link CardElement~stateObject|stateObject}.
 * @example
 * <caption>Listening to a Card Element event, in this case 'focus'</caption>
 * CardElement.create({ ... }, function (createErr, CardElementInstance) {
 *   CardElementInstance.on('focus', function (event) {
 *     console.log(event.emittedBy, 'has been focused');
 *   });
 * });
 * @returns {void}
 */

/**
 * This event is emitted when the user requests submission of an input field, such as by pressing the Enter or Return key on their keyboard, or mobile equivalent.
 * @event CardElement#inputSubmitRequest
 * @type {CardElement~stateObject}
 * @example
 * <caption>Clicking a submit button upon hitting Enter (or equivalent) within a Card Element</caption>
 * var CardElement = require('seamlesspay-web/card-element');
 * var submitButton = document.querySelector('input[type="submit"]');
 *
 * CardElement.create({ ... }, function (createErr, CardElementInstance) {
 *   CardElementInstance.on('inputSubmitRequest', function () {
 *     // User requested submission, e.g. by pressing Enter or equivalent
 *     submitButton.click();
 *   });
 * });
 */

/**
 * This event is emitted when a field transitions from having data to being empty.
 * @event CardElement#empty
 * @type {CardElement~stateObject}
 * @example
 * <caption>Listening to an empty event</caption>
 * CardElement.create({ ... }, function (createErr, CardElementInstance) {
 *   CardElementInstance.on('empty', function (event) {
 *     console.log(event.emittedBy, 'is now empty');
 *   });
 * });
 */

/**
 * This event is emitted when a field transitions from being empty to having data.
 * @event CardElement#notEmpty
 * @type {CardElement~stateObject}
 * @example
 * <caption>Listening to an notEmpty event</caption>
 * CardElement.create({ ... }, function (createErr, CardElementInstance) {
 *   CardElementInstance.on('notEmpty', function (event) {
 *     console.log(event.emittedBy, 'is now not empty');
 *   });
 * });
 */

/**
 * This event is emitted when a field loses focus.
 * @event CardElement#blur
 * @type {CardElement~stateObject}
 * @example
 * <caption>Listening to a blur event</caption>
 * CardElement.create({ ... }, function (createErr, CardElementInstance) {
 *   CardElementInstance.on('blur', function (event) {
 *     console.log(event.emittedBy, 'lost focus');
 *   });
 * });
 */

/**
 * This event is emitted when a field gains focus.
 * @event CardElement#focus
 * @type {CardElement~stateObject}
 * @example
 * <caption>Listening to a focus event</caption>
 * CardElement.create({ ... }, function (createErr, CardElementInstance) {
 *   CardElementInstance.on('focus', function (event) {
 *     console.log(event.emittedBy, 'gained focus');
 *   });
 * });
 */

/**
 * This event is emitted when activity within the number field has changed such that the possible card type has changed.
 * @event CardElement#cardTypeChange
 * @type {CardElement~stateObject}
 * @example
 * <caption>Listening to a cardTypeChange event</caption>
 * CardElement.create({ ... }, function (createErr, CardElementInstance) {
 *   CardElementInstance.on('cardTypeChange', function (event) {
 *     if (event.cards.length === 1) {
 *       console.log(event.cards[0].type);
 *     } else {
 *       console.log('Type of card not yet known');
 *     }
 *   });
 * });
 */

/**
 * This event is emitted when the validity of a field has changed. Validity is represented in the {@link CardElement~stateObject|stateObject} as two booleans: `isValid` and `isPotentiallyValid`.
 * @event CardElement#validityChange
 * @type {CardElement~stateObject}
 * @example
 * <caption>Listening to a validityChange event</caption>
 * CardElement.create({ ... }, function (createErr, CardElementInstance) {
 *   CardElementInstance.on('validityChange', function (event) {
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

function createInputEventHandler(cardElementContainer) {
  return function (eventData) {
    var field;
    var merchantPayload = eventData.merchantPayload;
    var emittedBy = merchantPayload.emittedBy;

    field = merchantPayload.fields[emittedBy];

    classlist.toggle(cardElementContainer, constants.externalClasses.VALID, field.isValid); // @TODO: make valid class if all fields are valid
    classlist.toggle(cardElementContainer, constants.externalClasses.INVALID, !field.isPotentiallyValid); // @TODO: make invalid class if some field invalid

    this._state = { // eslint-disable-line no-invalid-this
      cards: merchantPayload.cards,
      fields: merchantPayload.fields
    };

    this._emit(eventData.type, merchantPayload); // eslint-disable-line no-invalid-this
  };
}

/**
 * @class CardElement
 * @param {object} options The Card Element {@link module:seamlesspay-web/card-element.create create} options.
 * @description <strong>Do not use this constructor directly. Use {@link module:seamlesspay-web/card-element.create|seamlesspay-web.card-element.create} instead.</strong>
 * @classdesc This class represents a Card Element component produced by {@link module:seamlesspay-web/card-element.create|seamlesspay-web/card-element.create}. Instances of this class have methods for interacting with the input fields within Card Element' iframes.
 */
function CardElement(options) {
  var clientVersion, clientConfig;
  var self = this;
  var componentId = uuid();

  if (!options.client) {
    throw new SeamlesspayError({
      type: sharedErrors.INSTANTIATION_OPTION_REQUIRED.type,
      code: sharedErrors.INSTANTIATION_OPTION_REQUIRED.code,
      message: 'options.client is required when instantiating Card Element.'
    });
  }

  clientConfig = options.client.getConfiguration();
  clientVersion = clientConfig.analyticsMetadata.sdkVersion;
  if (clientVersion !== VERSION) {
    throw new SeamlesspayError({
      type: sharedErrors.INCOMPATIBLE_VERSIONS.type,
      code: sharedErrors.INCOMPATIBLE_VERSIONS.code,
      message: 'Client (version ' + clientVersion + ') and Card Element (version ' + VERSION + ') components must be from the same SDK version.'
    });
  }

  if (!options.selector) {
    throw new SeamlesspayError({
      type: sharedErrors.INSTANTIATION_OPTION_REQUIRED.type,
      code: sharedErrors.INSTANTIATION_OPTION_REQUIRED.code,
      message: 'options.selector is required when instantiating Card Element.'
    });
  }

  EventEmitter.call(this);

  this._injectedNodes = null;
  this._destructor = new Destructor();
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
    }
  );

  this._client = options.client;

  var container, frame;

  container = document.querySelector(options.selector);

  if (!container) {
    throw new SeamlesspayError({
      type: errors.CARD_ELEMENT_INVALID_FIELD_SELECTOR.type,
      code: errors.CARD_ELEMENT_INVALID_FIELD_SELECTOR.code,
      message: errors.CARD_ELEMENT_INVALID_FIELD_SELECTOR.message,
      details: { fieldSelector: options.selector }
    });
  }

  frame = iFramer({
    type: 'card-element',
    name: 'seamlesspay-card-element',
    style: {}
  });

  Object.keys(constants.defaultIFrameStyle).forEach(function (propertyName) {
    frame.style.setProperty.apply(frame.style, [propertyName].concat(constants.defaultIFrameStyle[propertyName]));
  });

  this._injectedNodes = injectFrame(frame, container);
  this._state.frameElement = frame;
  this._state.containerElement = container;

  this._state.fields = cardElementFields.reduce(function (result, fieldName) {
    result[fieldName] = {
      isEmpty: true,
      isValid: false,
      isPotentiallyValid: true,
      isFocused: false
    };

    return assign({}, result);
  }, {});

  setTimeout(function () {
    frame.src = composeUrl(clientConfig, 'card-element', componentId, clientConfig.isDebug);
  }, 0);

  this._bus.on(events.FRAME_READY, function (reply) {
    reply(options);
    self._emit('ready');
  });

  this._bus.on(
    events.INPUT_EVENT,
    createInputEventHandler(container).bind(this)
  );

  this._destructor.registerFunctionForTeardown(function () {
    var j, node, parent;

    for (j = 0; j < self._injectedNodes.length; j++) {
      node = self._injectedNodes[j];
      parent = node.parentNode;

      parent.removeChild(node);

      classlist.remove(
        parent,
        constants.externalClasses.FOCUSED,
        constants.externalClasses.INVALID,
        constants.externalClasses.VALID
      );
    }
  });

  this._destructor.registerFunctionForTeardown(function () {
    var methodNames = methods(CardElement.prototype).concat(methods(EventEmitter.prototype));

    convertMethodsToError(self, methodNames);
  });
}

CardElement.prototype = Object.create(EventEmitter.prototype, {
  constructor: CardElement
});

/**
 * Cleanly remove anything set up by {@link module:seamlesspay-web/card-element.create|create}.
 * @public
 * @function
 * @param {callback} [callback] Called on completion, containing an error if one occurred. No data is returned if teardown completes successfully. If no callback is provided, `teardown` returns a promise.
 * @example
 * CardElementInstance.teardown(function (teardownErr) {
 *   if (teardownErr) {
 *     console.error('Could not tear down Card Element!');
 *   } else {
 *     console.info('Card Element has been torn down!');
 *   }
 * });
 * @returns {Promise|void} If no callback is provided, returns a promise that resolves when the teardown is complete.
 */
CardElement.prototype.teardown = wrapPromise(
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
 * @param {object} [options] All tokenization options for the Card Element component.
 * @param {boolean} [options.vault=false] When true, will vault the tokenized card. Cards will only be vaulted when using a client created with a client token that includes a customer ID.
 * @param {string} [options.billingAddress.postalCode] When supplied, this postal code will be tokenized along with the contents of the fields. If a postal code is provided as part of the Card Element configuration, the value of the field will be tokenized and this value will be ignored.
 * @param {callback} [callback] The second argument, <code>data</code>, is a {@link CardElement~tokenizePayload|tokenizePayload}. If no callback is provided, `tokenize` returns a function that resolves with a {@link CardElement~tokenizePayload|tokenizePayload}.
 * @example <caption>Tokenize a card</caption>
 * CardElementInstance.tokenize(function (tokenizeErr, payload) {
 *   if (tokenizeErr) {
 *     switch (tokenizeErr.code) {
 *       case 'CARD_ELEMENT_FIELDS_EMPTY':
 *         console.error('All fields are empty! Please fill out the form.');
 *         break;
 *       case 'CARD_ELEMENT_FIELDS_INVALID':
 *         console.error('Some fields are invalid:', tokenizeErr.details.invalidFieldKeys);
 *         break;
 *       case 'CARD_ELEMENT_FAILED_TOKENIZATION':
 *         console.error('Tokenization failed server side. Is the card valid?');
 *         break;
 *       case 'CARD_ELEMENT_TOKENIZATION_NETWORK_ERROR':
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
 * CardElementInstance.tokenize({
 *   vault: true
 * }, function (tokenizeErr, payload) {
 *   if (tokenizeErr) {
 *     console.error(tokenizeErr);
 *   } else {
 *     console.log('Got nonce:', payload.nonce);
 *   }
 * });
 * @example <caption>Tokenize a card with the postal code option</caption>
 * CardElementInstance.tokenize({
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
CardElement.prototype.tokenize = wrapPromise(
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
          resolve(payload);
        }
      });
    });
  }
);

/**
 * Sets an attribute of a {@link module:seamlesspay-web/card-element~field field}.
 * Supported attributes are `aria-invalid`, `aria-required`, `disabled`, and `placeholder`.
 *
 * @public
 * @param {object} options The options for the attribute you wish to set.
 * @param {string} options.field The field to which you wish to add an attribute. Must be a valid {@link module:seamlesspay-web/card-element~fieldOptions fieldOption}.
 * @param {string} options.attribute The name of the attribute you wish to add to the field.
 * @param {string} options.value The value for the attribute.
 * @param {callback} [callback] Callback executed on completion, containing an error if one occurred. No data is returned if the attribute is set successfully.
 *
 * @example <caption>Set the placeholder attribute of a field</caption>
 * CardElementInstance.setAttribute({
 *   field: 'accountNumber',
 *   attribute: 'placeholder',
 *   value: '1111 1111 1111 1111'
 * }, function (attributeErr) {
 *   if (attributeErr) {
 *     console.error(attributeErr);
 *   }
 * });
 *
 * @example <caption>Set the aria-required attribute of a field</caption>
 * CardElementInstance.setAttribute({
 *   field: 'accountNumber',
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
CardElement.prototype.setAttribute = function (options, callback) {
  var attributeErr, err;

  if (cardElementFields.indexOf(options.field) === -1) {
    err = new SeamlesspayError({
      type: errors.CARD_ELEMENT_FIELD_INVALID.type,
      code: errors.CARD_ELEMENT_FIELD_INVALID.code,
      message: '"' + options.field + '" is not a valid field. You must use a valid field option when setting an attribute.'
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
 * Removes a supported attribute from a {@link module:seamlesspay-web/card-element~field field}.
 *
 * @public
 * @param {object} options The options for the attribute you wish to remove.
 * @param {string} options.field The field from which you wish to remove an attribute. Must be a valid {@link module:seamlesspay-web/card-element~fieldOptions fieldOption}.
 * @param {string} options.attribute The name of the attribute you wish to remove from the field.
 * @param {callback} [callback] Callback executed on completion, containing an error if one occurred. No data is returned if the attribute is removed successfully.
 *
 * @example <caption>Remove the placeholder attribute of a field</caption>
 * CardElementInstance.removeAttribute({
 *   field: 'accountNumber',
 *   attribute: 'placeholder'
 * }, function (attributeErr) {
 *   if (attributeErr) {
 *     console.error(attributeErr);
 *   }
 * });
 *
 * @returns {void}
 */
CardElement.prototype.removeAttribute = function (options, callback) {
  var attributeErr, err;

  if (cardElementFields.indexOf(options.field) === -1) {
    err = new SeamlesspayError({
      type: errors.CARD_ELEMENT_FIELD_INVALID.type,
      code: errors.CARD_ELEMENT_FIELD_INVALID.code,
      message: '"' + options.field + '" is not a valid field. You must use a valid field option when removing an attribute.'
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
 * Clear the value of a {@link module:seamlesspay-web/card-element~field field}.
 * @public
 * @param {string} field The field whose placeholder you wish to clear. Must be a valid {@link module:seamlesspay-web/card-element~fieldOptions fieldOption}.
 * @param {callback} [callback] Callback executed on completion, containing an error if one occurred. No data is returned if the field cleared successfully.
 * @returns {void}
 * @example
 * CardElementInstance.clear('number', function (clearErr) {
 *   if (clearErr) {
 *     console.error(clearErr);
 *   }
 * });
 *
 * @example <caption>Clear several fields</caption>
 * CardElementInstance.clearField('accountNumber');
 * CardElementInstance.clearField('cvv');
 * CardElementInstance.clearField('expDate');
 */
CardElement.prototype.clearField = function (field, callback) {
  var err;

  if (cardElementFields.indexOf(field) === -1) {
    err = new SeamlesspayError({
      type: errors.CARD_ELEMENT_FIELD_INVALID.type,
      code: errors.CARD_ELEMENT_FIELD_INVALID.code,
      message: '"' + field + '" is not a valid field. You must use a valid field option when clearing a field.'
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
 * Clear the values of a {@link module:seamlesspay-web/card-element form}.
 * @public
 * @param {string} field The field whose placeholder you wish to clear. Must be a valid {@link module:seamlesspay-web/card-element~fieldOptions fieldOption}.
 * @param {callback} [callback] Callback executed on completion, containing an error if one occurred. No data is returned if the field cleared successfully.
 * @returns {void}
 * @example
 * CardElementInstance.clearForm();
 *
 * @example <caption>Clear several fields</caption>
 * CardElementInstance.clearField('accountNumber');
 * CardElementInstance.clearField('cvv');
 * CardElementInstance.clearField('expDate');
 */
CardElement.prototype.clearForm = function () {
  var bus = this._bus;

  cardElementFields.forEach(function (field) {
    bus.emit(events.CLEAR_FIELD, field);
  });
};

/**
 * Returns an {@link CardElement~stateObject|object} that includes the state of all fields and possible card types.
 * @public
 * @returns {object} {@link CardElement~stateObject|stateObject}
 * @example <caption>Check if all fields are valid</caption>
 * var state = CardElement.getState();
 *
 * var formValid = Object.keys(state.fields).every(function (key) {
 *   return state.fields[key].isValid;
 * });
 */
CardElement.prototype.getState = function () {
  return this._state;
};

module.exports = CardElement;

},{"../../lib/assign":57,"../../lib/bus":62,"../../lib/classlist":63,"../../lib/compose-url":64,"../../lib/convert-methods-to-error":66,"../../lib/deferred":69,"../../lib/destructor":70,"../../lib/errors":73,"../../lib/event-emitter":74,"../../lib/inject-frame":75,"../../lib/methods":78,"../../lib/promise":81,"../../lib/seamlesspay-error":83,"../../lib/uuid":84,"../shared/constants":20,"../shared/errors":21,"./attribute-validation-error":17,"@braintree/iframer":1,"@braintree/wrap-promise":8,"credit-card-type":9}],19:[function(_dereq_,module,exports){
'use strict';
/** @module seamlesspay-web/card-element */

var CardElement = _dereq_('./external/card-element');
var wrapPromise = _dereq_('@braintree/wrap-promise');
var Promise = _dereq_('../lib/promise');

var VERSION = "web-sdk";

/**
 * Fields used in {@link module:seamlesspay-web/card-element~fieldOptions fields options}
 * @typedef {object} field
 * @property {string} selector A CSS selector to find the container where the card element will be inserted.
 * @property {string} [placeholder] Will be used as the `placeholder` attribute of the input. If `placeholder` is not natively supported by the browser, it will be polyfilled.
 * @property {string} [type] Will be used as the `type` attribute of the input. To mask `cvv` input, for instance, `type: "password"` can be used.
 * @property {boolean} [formatInput=true] Enable or disable automatic formatting on this field.
 * @property {object|boolean} [select] If truthy, this field becomes a `<select>` dropdown list. This can only be used for `expirationMonth` and `expirationYear` fields.
 * @property {string[]} [select.options] An array of 12 strings, one per month. This can only be used for the `expirationMonth` field. For example, the array can look like `['01 - January', '02 - February', ...]`.
 */

/**
 * An object that has {@link module:seamlesspay-web/card-element~field field objects} for each field. Used in {@link module:seamlesspay-web/card-element~create create}.
 * @typedef {object} fieldOptions
 * @property {field} [number] A field for card number.
 * @property {field} [expirationDate] A field for expiration date in `MM/YYYY` format. This should not be used with the `expirationMonth` and `expirationYear` properties.
 * @property {field} [expirationMonth] A field for expiration month in `MM` format. This should be used with the `expirationYear` property.
 * @property {field} [expirationYear] A field for expiration year in `YYYY` format. This should be used with the `expirationMonth` property.
 * @property {field} [cvv] A field for 3 or 4 digit CVV or CID.
 * @property {field} [postalCode] A field for postal or region code.
 */

/**
 * An object that represents CSS that will be applied in card element. This object looks similar to CSS. Typically, these styles involve fonts (such as `font-family` or `color`).
 *
 * These are the CSS properties that Card Element supports. Any other CSS should be specified on your page and outside of any Seamlesspay configuration. Trying to set unsupported properties will fail and put a warning in the console.
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
 * @param {fieldOptions} options.fields A {@link module:seamlesspay-web/card-element~fieldOptions set of options for each field}.
 * @param {styleOptions} options.styles {@link module:seamlesspay-web/card-element~styleOptions Styles} applied to each field.
 * @param {callback} [callback] The second argument, `data`, is the {@link CardElement} instance. If no callback is provided, `create` returns a promise that resolves with the {@link CardElement} instance.
 * @returns {void}
 * @example
 * seamlesspay.cardElement.create({
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
 *   selector: '#card-element'
 * }, callback);
 * @example <caption>Right to Left Language Support</caption>
 * seamlesspay.cardElement.create({
 *   client: clientInstance,
 *   styles: {
 *     'input': {
 *       // other styles
 *       direction: 'rtl'
 *     },
 *   },
 *   selector: '#card-element'
 * }, callback);
 */
function create(options) {
  var integration;
  var promise = new Promise(function (resolve, reject) {
    try {
      integration = new CardElement(options);
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

},{"../lib/promise":81,"./external/card-element":18,"@braintree/wrap-promise":8}],20:[function(_dereq_,module,exports){
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

},{"../../lib/enumerate":71}],21:[function(_dereq_,module,exports){
'use strict';

var SeamlesspayError = _dereq_('../../lib/seamlesspay-error');

module.exports = {
  CARD_ELEMENT_INVALID_FIELD_SELECTOR: {
    type: SeamlesspayError.types.MERCHANT,
    code: 'CARD_ELEMENT_INVALID_FIELD_SELECTOR',
    message: 'Selector does not reference a valid DOM node.'
  },
  CARD_ELEMENT_FIELD_INVALID: {
    type: SeamlesspayError.types.MERCHANT,
    code: 'CARD_ELEMENT_FIELD_INVALID'
  },
  CARD_ELEMENT_TOKENIZATION_NETWORK_ERROR: {
    type: SeamlesspayError.types.NETWORK,
    code: 'CARD_ELEMENT_TOKENIZATION_NETWORK_ERROR',
    message: 'A tokenization network error occurred.'
  },
  CARD_ELEMENT_FAILED_TOKENIZATION: {
    type: SeamlesspayError.types.CUSTOMER,
    code: 'CARD_ELEMENT_FAILED_TOKENIZATION',
    message: 'The supplied card data failed tokenization.'
  },
  CARD_ELEMENT_FIELDS_EMPTY: {
    type: SeamlesspayError.types.CUSTOMER,
    code: 'CARD_ELEMENT_FIELDS_EMPTY',
    message: 'All fields are empty. Cannot tokenize empty card fields.'
  },
  CARD_ELEMENT_FIELDS_INVALID: {
    type: SeamlesspayError.types.CUSTOMER,
    code: 'CARD_ELEMENT_FIELDS_INVALID',
    message: 'Some payment input fields are invalid. Cannot tokenize invalid card fields.'
  },
  CARD_ELEMENT_ATTRIBUTE_NOT_SUPPORTED: {
    type: SeamlesspayError.types.MERCHANT,
    code: 'CARD_ELEMENT_ATTRIBUTE_NOT_SUPPORTED'
  },
  CARD_ELEMENT_ATTRIBUTE_VALUE_NOT_ALLOWED: {
    type: SeamlesspayError.types.MERCHANT,
    code: 'CARD_ELEMENT_ATTRIBUTE_VALUE_NOT_ALLOWED'
  }
};

},{"../../lib/seamlesspay-error":83}],22:[function(_dereq_,module,exports){
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

},{"../../lib/bus":62,"../../lib/destructor":70,"../../lib/errors":73,"../../lib/event-emitter":74,"../../lib/seamlesspay-error":83,"../../lib/uuid":84,"../shared/constants":26,"../shared/errors":27,"./compose-url":23,"./inject-frame":24,"@braintree/iframer":1}],23:[function(_dereq_,module,exports){
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

},{"../shared/constants":26}],24:[function(_dereq_,module,exports){
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

},{}],25:[function(_dereq_,module,exports){
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

},{"../lib/promise":81,"./external/checkout-button":22,"@braintree/wrap-promise":8}],26:[function(_dereq_,module,exports){
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


},{"../../lib/enumerate":71}],27:[function(_dereq_,module,exports){
'use strict';

var SeamlesspayError = _dereq_('../../lib/seamlesspay-error');

module.exports = {
  CHECKOUT_BUTTON_INVALID_FIELD_SELECTOR: {
    type: SeamlesspayError.types.MERCHANT,
    code: 'CHECKOUT_BUTTON_INVALID_FIELD_SELECTOR',
    message: 'Selector does not reference a valid DOM node.'
  }
};

},{"../../lib/seamlesspay-error":83}],28:[function(_dereq_,module,exports){
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

},{"../lib/add-metadata":56,"../lib/assign":57,"../lib/constants":65,"../lib/convert-to-seamlesspay-error":67,"../lib/errors":73,"../lib/is-whitelisted-domain":77,"../lib/promise":81,"../lib/seamlesspay-error":83,"./constants":29,"./errors":30,"./request":35}],29:[function(_dereq_,module,exports){
'use strict';

module.exports = {
  SEAMLESSPAY_API_VERSION_HEADER: 'v2020'
};

},{}],30:[function(_dereq_,module,exports){
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

},{"../lib/seamlesspay-error":83}],31:[function(_dereq_,module,exports){
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

},{"../lib/constants":65,"../lib/create-authorization-data":68,"../lib/promise":81,"../lib/seamlesspay-error":83,"../lib/uuid":84,"./errors":30,"@braintree/wrap-promise":8}],32:[function(_dereq_,module,exports){
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

},{"../lib/errors":73,"../lib/promise":81,"../lib/seamlesspay-error":83,"./client":28,"./get-configuration":31,"@braintree/wrap-promise":8}],33:[function(_dereq_,module,exports){
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

},{"../../lib/assign":57,"../../lib/querystring":82,"./parse-body":38,"./prep-body":39}],34:[function(_dereq_,module,exports){
(function (global){(function (){
'use strict';

module.exports = function getUserAgent() {
  return global.navigator.userAgent;
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],35:[function(_dereq_,module,exports){
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

},{"../../lib/once":79,"./ajax-driver":33,"./get-user-agent":34,"./is-http":36,"./jsonp-driver":37}],36:[function(_dereq_,module,exports){
(function (global){(function (){
'use strict';

module.exports = function () {
  return global.location.protocol === 'http:';
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],37:[function(_dereq_,module,exports){
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

},{"../../lib/querystring":82,"../../lib/uuid":84}],38:[function(_dereq_,module,exports){
'use strict';

module.exports = function (body) {
  try {
    body = JSON.parse(body);
  } catch (e) { /* ignored */ }

  return body;
};

},{}],39:[function(_dereq_,module,exports){
'use strict';

module.exports = function (method, body) {
  if (String(method).toLowerCase() !== 'get' && body != null) {
    body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  return body;
};

},{}],40:[function(_dereq_,module,exports){
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

},{"../shared/constants":44}],41:[function(_dereq_,module,exports){
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

},{"../../lib/bus":62,"../../lib/convert-methods-to-error":66,"../../lib/methods":78,"../../lib/promise":81,"../../lib/seamlesspay-error":83,"../../lib/uuid":84,"../shared/constants":44,"./event-emitter":40,"./response-formatters":42,"@braintree/iframer":1}],42:[function(_dereq_,module,exports){

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

},{}],43:[function(_dereq_,module,exports){
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

},{"../lib/basic-component-verification":58,"./external/payment-request":41,"@braintree/wrap-promise":8}],44:[function(_dereq_,module,exports){
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

},{"../../lib/enumerate":71,"../../lib/seamlesspay-error":83}],45:[function(_dereq_,module,exports){
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

},{"../../lib/seamlesspay-error":83,"../shared/constants":51,"../shared/errors":52}],46:[function(_dereq_,module,exports){
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

},{"../../lib/errors":73,"../../lib/seamlesspay-error":83,"../shared/constants":51,"../shared/payment-fields-relations":54}],47:[function(_dereq_,module,exports){
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

},{"../../lib/bus":62,"../../lib/classlist":63,"../../lib/compose-url":64,"../../lib/convert-methods-to-error":66,"../../lib/deferred":69,"../../lib/destructor":70,"../../lib/errors":73,"../../lib/event-emitter":74,"../../lib/inject-frame":75,"../../lib/is-ios":76,"../../lib/methods":78,"../../lib/promise":81,"../../lib/seamlesspay-error":83,"../../lib/uuid":84,"../shared/common":50,"../shared/constants":51,"../shared/errors":52,"../shared/find-parent-tags":53,"./attribute-validation-error":45,"./check-integrity":46,"./response-formatters":48,"@braintree/iframer":1,"@braintree/wrap-promise":8,"credit-card-type":9}],48:[function(_dereq_,module,exports){

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

},{}],49:[function(_dereq_,module,exports){
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

},{"../lib/promise":81,"./external/hosted-fields":47,"@braintree/wrap-promise":8}],50:[function(_dereq_,module,exports){
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

},{"./constants":51}],51:[function(_dereq_,module,exports){
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

},{"../../lib/enumerate":71}],52:[function(_dereq_,module,exports){
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

},{"../../lib/seamlesspay-error":83}],53:[function(_dereq_,module,exports){
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

},{}],54:[function(_dereq_,module,exports){
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

},{"./constants":51}],55:[function(_dereq_,module,exports){
'use strict';
/**
 * @module @seamlesspay/web-sdk
 * @description This is the top-level module exported by the Seamlesspay JavaScript SDK. In a browser environment, this will be the global <code>seamlesspay</code> object. In a CommonJS environment (like Browserify or Webpack), it will be the default export of the <code>seamlesspay-web</code> package. In AMD environments (like RequireJS), it can be `require`d like other modules.
 * @example
 * <caption>CommonJS</caption>
 * var seamlesspay = require('@seamlesspay/web-sdk');
 *
 * seamlesspay.client.create(...);
 * @example
 * <caption>In the browser</caption>
 * <script src="https://js.seamlesspaygateway.com/{@pkg version}/js/client.min.js"></script>
 * <script>
 *   window.seamlesspay.client.create(...);
 * </script>
 * @example
 * <caption>AMD</caption>
 * // main.js
 * require.config({
 *   paths: {
 *     seamlesspayClient: 'https://js.seamlesspaygateway.com/{@pkg version}/js/client.min'
 *   }
 * });
 *
 * require(['seamlesspayClient'], function (seamlesspayClient) {
 *   seamlesspayClient.create(...);
 * });
 */

/**
 * @global
 * @callback callback
 * @param {?SeamlesspayError} [err] `null` or `undefined` if there was no error.
 * @param {?any} [data] The successful result of the asynchronous function call (if data exists).
 * @description The Node.js-style callback pattern used throughout the SDK.
 * @returns {void}
 */

var client = _dereq_('./client');
var cardElement = _dereq_('./card-element');
var hostedFields = _dereq_('./hosted-fields');
var checkoutButton = _dereq_('./checkout-button');
var digitalWallets = _dereq_('./digital-wallets');
var paypalCheckout = _dereq_('./paypal-checkout');

var VERSION = "web-sdk";

module.exports = {
  /** @type {module:seamlesspay-web/client} */
  client: client,

  /** @type {module:seamlesspay-web/card-element} */
  cardElement: cardElement,

  /** @type {module:seamlesspay-web/hosted-fields} */
  hostedFields: hostedFields,

  /** @type {module:seamlesspay-web/digital-wallets} */
  digitalWallets: digitalWallets,

  /** @type {module:seamlesspay-web/checkout-button} */
  checkoutButton: checkoutButton,

  /** @type {module:seamlesspay-web/paypal-checkout} */
  paypalCheckout: paypalCheckout,

  /**
   * @description The current version of the SDK, i.e. `{@pkg version}`.
   * @type {string}
   */
  VERSION: VERSION
};

},{"./card-element":19,"./checkout-button":25,"./client":32,"./digital-wallets":43,"./hosted-fields":49,"./paypal-checkout":85}],56:[function(_dereq_,module,exports){
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

},{}],57:[function(_dereq_,module,exports){
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

},{}],58:[function(_dereq_,module,exports){
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

},{"./errors":73,"./promise":81,"./seamlesspay-error":83}],59:[function(_dereq_,module,exports){
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

},{"./once":79}],60:[function(_dereq_,module,exports){
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

},{"../is-whitelisted-domain":77}],61:[function(_dereq_,module,exports){
'use strict';

var enumerate = _dereq_('../enumerate');

module.exports = enumerate([
  'CONFIGURATION_REQUEST'
], 'bus:');

},{"../enumerate":71}],62:[function(_dereq_,module,exports){
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

},{"../seamlesspay-error":83,"./check-origin":60,"./events":61,"framebus":16}],63:[function(_dereq_,module,exports){
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

},{}],64:[function(_dereq_,module,exports){
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

},{"../card-element/shared/constants":20}],65:[function(_dereq_,module,exports){
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

},{}],66:[function(_dereq_,module,exports){
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

},{"./errors":73,"./seamlesspay-error":83}],67:[function(_dereq_,module,exports){
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

},{"./seamlesspay-error":83}],68:[function(_dereq_,module,exports){
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

},{"../hosted-fields/shared/constants":51,"../lib/polyfill":80}],69:[function(_dereq_,module,exports){
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

},{}],70:[function(_dereq_,module,exports){
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

},{"./batch-execute-functions":59}],71:[function(_dereq_,module,exports){
'use strict';

function enumerate(values, prefix) {
  prefix = prefix == null ? '' : prefix;

  return values.reduce(function (enumeration, value) {
    enumeration[value] = prefix + value;
    return enumeration;
  }, {});
}

module.exports = enumerate;

},{}],72:[function(_dereq_,module,exports){
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

},{"./enumerate":71}],73:[function(_dereq_,module,exports){
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

},{"./seamlesspay-error":83}],74:[function(_dereq_,module,exports){
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

},{}],75:[function(_dereq_,module,exports){
arguments[4][24][0].apply(exports,arguments)
},{"dup":24}],76:[function(_dereq_,module,exports){
'use strict';

module.exports = function isIos(userAgent) {
  userAgent = userAgent || navigator.userAgent;
  return /(iPad|iPhone|iPod)/i.test(userAgent);
};

},{}],77:[function(_dereq_,module,exports){
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

},{}],78:[function(_dereq_,module,exports){
'use strict';

module.exports = function (obj) {
  return Object.keys(obj).filter(function (key) {
    return typeof obj[key] === 'function';
  });
};

},{}],79:[function(_dereq_,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],80:[function(_dereq_,module,exports){
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

},{"./errors":73,"./seamlesspay-error":83}],81:[function(_dereq_,module,exports){
(function (global){(function (){
'use strict';

var Promise = global.Promise;

module.exports = Promise;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],82:[function(_dereq_,module,exports){
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

},{}],83:[function(_dereq_,module,exports){
arguments[4][72][0].apply(exports,arguments)
},{"./enumerate":71,"dup":72}],84:[function(_dereq_,module,exports){
'use strict';

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : r & 0x3 | 0x8;

    return v.toString(16);
  });
}

module.exports = uuid;

},{}],85:[function(_dereq_,module,exports){
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

},{"../lib/basic-component-verification":58,"./paypal-checkout":86,"@braintree/wrap-promise":8}],86:[function(_dereq_,module,exports){
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

},{"../lib/assign":57,"../lib/error":72,"../lib/errors":73,"../lib/promise":81,"@braintree/wrap-promise":8}]},{},[55])(55)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvQGJyYWludHJlZS9pZnJhbWVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL0BicmFpbnRyZWUvaWZyYW1lci9saWIvYXNzaWduLmpzIiwibm9kZV9tb2R1bGVzL0BicmFpbnRyZWUvaWZyYW1lci9saWIvZGVmYXVsdC1hdHRyaWJ1dGVzLmpzIiwibm9kZV9tb2R1bGVzL0BicmFpbnRyZWUvaWZyYW1lci9saWIvc2V0LWF0dHJpYnV0ZXMuanMiLCJub2RlX21vZHVsZXMvQGJyYWludHJlZS93cmFwLXByb21pc2UvbGliL2RlZmVycmVkLmpzIiwibm9kZV9tb2R1bGVzL0BicmFpbnRyZWUvd3JhcC1wcm9taXNlL2xpYi9vbmNlLmpzIiwibm9kZV9tb2R1bGVzL0BicmFpbnRyZWUvd3JhcC1wcm9taXNlL2xpYi9wcm9taXNlLW9yLWNhbGxiYWNrLmpzIiwibm9kZV9tb2R1bGVzL0BicmFpbnRyZWUvd3JhcC1wcm9taXNlL3dyYXAtcHJvbWlzZS5qcyIsIm5vZGVfbW9kdWxlcy9jcmVkaXQtY2FyZC10eXBlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2NyZWRpdC1jYXJkLXR5cGUvbGliL2FkZC1tYXRjaGluZy1jYXJkcy10by1yZXN1bHRzLmpzIiwibm9kZV9tb2R1bGVzL2NyZWRpdC1jYXJkLXR5cGUvbGliL2NhcmQtdHlwZXMuanMiLCJub2RlX21vZHVsZXMvY3JlZGl0LWNhcmQtdHlwZS9saWIvY2xvbmUuanMiLCJub2RlX21vZHVsZXMvY3JlZGl0LWNhcmQtdHlwZS9saWIvZmluZC1iZXN0LW1hdGNoLmpzIiwibm9kZV9tb2R1bGVzL2NyZWRpdC1jYXJkLXR5cGUvbGliL2lzLXZhbGlkLWlucHV0LXR5cGUuanMiLCJub2RlX21vZHVsZXMvY3JlZGl0LWNhcmQtdHlwZS9saWIvbWF0Y2hlcy5qcyIsIm5vZGVfbW9kdWxlcy9mcmFtZWJ1cy9saWIvZnJhbWVidXMuanMiLCJzcmMvY2FyZC1lbGVtZW50L2V4dGVybmFsL2F0dHJpYnV0ZS12YWxpZGF0aW9uLWVycm9yLmpzIiwic3JjL2NhcmQtZWxlbWVudC9leHRlcm5hbC9jYXJkLWVsZW1lbnQuanMiLCJzcmMvY2FyZC1lbGVtZW50L2luZGV4LmpzIiwic3JjL2NhcmQtZWxlbWVudC9zaGFyZWQvY29uc3RhbnRzLmpzIiwic3JjL2NhcmQtZWxlbWVudC9zaGFyZWQvZXJyb3JzLmpzIiwic3JjL2NoZWNrb3V0LWJ1dHRvbi9leHRlcm5hbC9jaGVja291dC1idXR0b24uanMiLCJzcmMvY2hlY2tvdXQtYnV0dG9uL2V4dGVybmFsL2NvbXBvc2UtdXJsLmpzIiwic3JjL2NoZWNrb3V0LWJ1dHRvbi9leHRlcm5hbC9pbmplY3QtZnJhbWUuanMiLCJzcmMvY2hlY2tvdXQtYnV0dG9uL2luZGV4LmpzIiwic3JjL2NoZWNrb3V0LWJ1dHRvbi9zaGFyZWQvY29uc3RhbnRzLmpzIiwic3JjL2NoZWNrb3V0LWJ1dHRvbi9zaGFyZWQvZXJyb3JzLmpzIiwic3JjL2NsaWVudC9jbGllbnQuanMiLCJzcmMvY2xpZW50L2NvbnN0YW50cy5qcyIsInNyYy9jbGllbnQvZXJyb3JzLmpzIiwic3JjL2NsaWVudC9nZXQtY29uZmlndXJhdGlvbi5qcyIsInNyYy9jbGllbnQvaW5kZXguanMiLCJzcmMvY2xpZW50L3JlcXVlc3QvYWpheC1kcml2ZXIuanMiLCJzcmMvY2xpZW50L3JlcXVlc3QvZ2V0LXVzZXItYWdlbnQuanMiLCJzcmMvY2xpZW50L3JlcXVlc3QvaW5kZXguanMiLCJzcmMvY2xpZW50L3JlcXVlc3QvaXMtaHR0cC5qcyIsInNyYy9jbGllbnQvcmVxdWVzdC9qc29ucC1kcml2ZXIuanMiLCJzcmMvY2xpZW50L3JlcXVlc3QvcGFyc2UtYm9keS5qcyIsInNyYy9jbGllbnQvcmVxdWVzdC9wcmVwLWJvZHkuanMiLCJzcmMvZGlnaXRhbC13YWxsZXRzL2V4dGVybmFsL2V2ZW50LWVtaXR0ZXIuanMiLCJzcmMvZGlnaXRhbC13YWxsZXRzL2V4dGVybmFsL3BheW1lbnQtcmVxdWVzdC5qcyIsInNyYy9kaWdpdGFsLXdhbGxldHMvZXh0ZXJuYWwvcmVzcG9uc2UtZm9ybWF0dGVycy5qcyIsInNyYy9kaWdpdGFsLXdhbGxldHMvaW5kZXguanMiLCJzcmMvZGlnaXRhbC13YWxsZXRzL3NoYXJlZC9jb25zdGFudHMuanMiLCJzcmMvaG9zdGVkLWZpZWxkcy9leHRlcm5hbC9hdHRyaWJ1dGUtdmFsaWRhdGlvbi1lcnJvci5qcyIsInNyYy9ob3N0ZWQtZmllbGRzL2V4dGVybmFsL2NoZWNrLWludGVncml0eS5qcyIsInNyYy9ob3N0ZWQtZmllbGRzL2V4dGVybmFsL2hvc3RlZC1maWVsZHMuanMiLCJzcmMvaG9zdGVkLWZpZWxkcy9leHRlcm5hbC9yZXNwb25zZS1mb3JtYXR0ZXJzLmpzIiwic3JjL2hvc3RlZC1maWVsZHMvaW5kZXguanMiLCJzcmMvaG9zdGVkLWZpZWxkcy9zaGFyZWQvY29tbW9uLmpzIiwic3JjL2hvc3RlZC1maWVsZHMvc2hhcmVkL2NvbnN0YW50cy5qcyIsInNyYy9ob3N0ZWQtZmllbGRzL3NoYXJlZC9lcnJvcnMuanMiLCJzcmMvaG9zdGVkLWZpZWxkcy9zaGFyZWQvZmluZC1wYXJlbnQtdGFncy5qcyIsInNyYy9ob3N0ZWQtZmllbGRzL3NoYXJlZC9wYXltZW50LWZpZWxkcy1yZWxhdGlvbnMuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvbGliL2FkZC1tZXRhZGF0YS5qcyIsInNyYy9saWIvYXNzaWduLmpzIiwic3JjL2xpYi9iYXNpYy1jb21wb25lbnQtdmVyaWZpY2F0aW9uLmpzIiwic3JjL2xpYi9iYXRjaC1leGVjdXRlLWZ1bmN0aW9ucy5qcyIsInNyYy9saWIvYnVzL2NoZWNrLW9yaWdpbi5qcyIsInNyYy9saWIvYnVzL2V2ZW50cy5qcyIsInNyYy9saWIvYnVzL2luZGV4LmpzIiwic3JjL2xpYi9jbGFzc2xpc3QuanMiLCJzcmMvbGliL2NvbXBvc2UtdXJsLmpzIiwic3JjL2xpYi9jb25zdGFudHMuanMiLCJzcmMvbGliL2NvbnZlcnQtbWV0aG9kcy10by1lcnJvci5qcyIsInNyYy9saWIvY29udmVydC10by1zZWFtbGVzc3BheS1lcnJvci5qcyIsInNyYy9saWIvY3JlYXRlLWF1dGhvcml6YXRpb24tZGF0YS5qcyIsInNyYy9saWIvZGVmZXJyZWQuanMiLCJzcmMvbGliL2Rlc3RydWN0b3IuanMiLCJzcmMvbGliL2VudW1lcmF0ZS5qcyIsInNyYy9saWIvZXJyb3IuanMiLCJzcmMvbGliL2Vycm9ycy5qcyIsInNyYy9saWIvZXZlbnQtZW1pdHRlci5qcyIsInNyYy9saWIvaXMtaW9zLmpzIiwic3JjL2xpYi9pcy13aGl0ZWxpc3RlZC1kb21haW4uanMiLCJzcmMvbGliL21ldGhvZHMuanMiLCJzcmMvbGliL3BvbHlmaWxsLmpzIiwic3JjL2xpYi9wcm9taXNlLmpzIiwic3JjL2xpYi9xdWVyeXN0cmluZy5qcyIsInNyYy9saWIvdXVpZC5qcyIsInNyYy9wYXlwYWwtY2hlY2tvdXQvaW5kZXguanMiLCJzcmMvcGF5cGFsLWNoZWNrb3V0L3BheXBhbC1jaGVja291dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDdFRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5cUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0VUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM1SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDNUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcFdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM2dDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9KQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDL0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FDdkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBzZXRBdHRyaWJ1dGVzID0gcmVxdWlyZSgnLi9saWIvc2V0LWF0dHJpYnV0ZXMnKTtcbnZhciBkZWZhdWx0QXR0cmlidXRlcyA9IHJlcXVpcmUoJy4vbGliL2RlZmF1bHQtYXR0cmlidXRlcycpO1xudmFyIGFzc2lnbiA9IHJlcXVpcmUoJy4vbGliL2Fzc2lnbicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUZyYW1lKG9wdGlvbnMpIHtcbiAgdmFyIGlmcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScpO1xuICB2YXIgY29uZmlnID0gYXNzaWduKHt9LCBkZWZhdWx0QXR0cmlidXRlcywgb3B0aW9ucyk7XG5cbiAgaWYgKGNvbmZpZy5zdHlsZSAmJiB0eXBlb2YgY29uZmlnLnN0eWxlICE9PSAnc3RyaW5nJykge1xuICAgIGFzc2lnbihpZnJhbWUuc3R5bGUsIGNvbmZpZy5zdHlsZSk7XG4gICAgZGVsZXRlIGNvbmZpZy5zdHlsZTtcbiAgfVxuXG4gIHNldEF0dHJpYnV0ZXMoaWZyYW1lLCBjb25maWcpO1xuXG4gIGlmICghaWZyYW1lLmdldEF0dHJpYnV0ZSgnaWQnKSkge1xuICAgIGlmcmFtZS5pZCA9IGlmcmFtZS5uYW1lO1xuICB9XG5cbiAgcmV0dXJuIGlmcmFtZTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXNzaWduKHRhcmdldCkge1xuICB2YXIgb2JqcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG5cbiAgb2Jqcy5mb3JFYWNoKGZ1bmN0aW9uIChvYmopIHtcbiAgICBpZiAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHsgcmV0dXJuOyB9XG5cbiAgICBPYmplY3Qua2V5cyhvYmopLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgdGFyZ2V0W2tleV0gPSBvYmpba2V5XTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgcmV0dXJuIHRhcmdldDtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNyYzogJ2Fib3V0OmJsYW5rJyxcbiAgZnJhbWVCb3JkZXI6IDAsXG4gIGFsbG93dHJhbnNwYXJlbmN5OiB0cnVlLFxuICBzY3JvbGxpbmc6ICdubydcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc2V0QXR0cmlidXRlcyhlbGVtZW50LCBhdHRyaWJ1dGVzKSB7XG4gIHZhciB2YWx1ZTtcblxuICBmb3IgKHZhciBrZXkgaW4gYXR0cmlidXRlcykge1xuICAgIGlmIChhdHRyaWJ1dGVzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIHZhbHVlID0gYXR0cmlidXRlc1trZXldO1xuXG4gICAgICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgICAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShrZXkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoa2V5LCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBkZWZlcnJlZChmbikge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIC8vIElFOSBkb2Vzbid0IHN1cHBvcnQgcGFzc2luZyBhcmd1bWVudHMgdG8gc2V0VGltZW91dCBzbyB3ZSBoYXZlIHRvIGVtdWxhdGUgaXQuXG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG5cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGZuLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgIH0sIDEpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlZmVycmVkO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBvbmNlKGZuKSB7XG4gIHZhciBjYWxsZWQgPSBmYWxzZTtcblxuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGlmICghY2FsbGVkKSB7XG4gICAgICBjYWxsZWQgPSB0cnVlO1xuICAgICAgZm4uYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICB9XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb25jZTtcbiIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gcHJvbWlzZU9yQ2FsbGJhY2socHJvbWlzZSwgY2FsbGJhY2spIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBjb25zaXN0ZW50LXJldHVyblxuICBpZiAoY2FsbGJhY2spIHtcbiAgICBwcm9taXNlXG4gICAgICAudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBjYWxsYmFjayhudWxsLCBkYXRhKTtcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwcm9taXNlT3JDYWxsYmFjaztcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGRlZmVycmVkID0gcmVxdWlyZSgnLi9saWIvZGVmZXJyZWQnKTtcbnZhciBvbmNlID0gcmVxdWlyZSgnLi9saWIvb25jZScpO1xudmFyIHByb21pc2VPckNhbGxiYWNrID0gcmVxdWlyZSgnLi9saWIvcHJvbWlzZS1vci1jYWxsYmFjaycpO1xuXG5mdW5jdGlvbiB3cmFwUHJvbWlzZShmbikge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHZhciBjYWxsYmFjaztcbiAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgdmFyIGxhc3RBcmcgPSBhcmdzW2FyZ3MubGVuZ3RoIC0gMV07XG5cbiAgICBpZiAodHlwZW9mIGxhc3RBcmcgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNhbGxiYWNrID0gYXJncy5wb3AoKTtcbiAgICAgIGNhbGxiYWNrID0gb25jZShkZWZlcnJlZChjYWxsYmFjaykpO1xuICAgIH1cbiAgICByZXR1cm4gcHJvbWlzZU9yQ2FsbGJhY2soZm4uYXBwbHkodGhpcywgYXJncyksIGNhbGxiYWNrKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1pbnZhbGlkLXRoaXNcbiAgfTtcbn1cblxud3JhcFByb21pc2Uud3JhcFByb3RvdHlwZSA9IGZ1bmN0aW9uICh0YXJnZXQsIG9wdGlvbnMpIHtcbiAgdmFyIG1ldGhvZHMsIGlnbm9yZU1ldGhvZHMsIGluY2x1ZGVQcml2YXRlTWV0aG9kcztcblxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgaWdub3JlTWV0aG9kcyA9IG9wdGlvbnMuaWdub3JlTWV0aG9kcyB8fCBbXTtcbiAgaW5jbHVkZVByaXZhdGVNZXRob2RzID0gb3B0aW9ucy50cmFuc2Zvcm1Qcml2YXRlTWV0aG9kcyA9PT0gdHJ1ZTtcblxuICBtZXRob2RzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGFyZ2V0LnByb3RvdHlwZSkuZmlsdGVyKGZ1bmN0aW9uIChtZXRob2QpIHtcbiAgICB2YXIgaXNOb3RQcml2YXRlTWV0aG9kO1xuICAgIHZhciBpc05vbkNvbnN0cnVjdG9yRnVuY3Rpb24gPSBtZXRob2QgIT09ICdjb25zdHJ1Y3RvcicgJiZcbiAgICAgIHR5cGVvZiB0YXJnZXQucHJvdG90eXBlW21ldGhvZF0gPT09ICdmdW5jdGlvbic7XG4gICAgdmFyIGlzTm90QW5JZ25vcmVkTWV0aG9kID0gaWdub3JlTWV0aG9kcy5pbmRleE9mKG1ldGhvZCkgPT09IC0xO1xuXG4gICAgaWYgKGluY2x1ZGVQcml2YXRlTWV0aG9kcykge1xuICAgICAgaXNOb3RQcml2YXRlTWV0aG9kID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaXNOb3RQcml2YXRlTWV0aG9kID0gbWV0aG9kLmNoYXJBdCgwKSAhPT0gJ18nO1xuICAgIH1cblxuICAgIHJldHVybiBpc05vbkNvbnN0cnVjdG9yRnVuY3Rpb24gJiZcbiAgICAgIGlzTm90UHJpdmF0ZU1ldGhvZCAmJlxuICAgICAgaXNOb3RBbklnbm9yZWRNZXRob2Q7XG4gIH0pO1xuXG4gIG1ldGhvZHMuZm9yRWFjaChmdW5jdGlvbiAobWV0aG9kKSB7XG4gICAgdmFyIG9yaWdpbmFsID0gdGFyZ2V0LnByb3RvdHlwZVttZXRob2RdO1xuXG4gICAgdGFyZ2V0LnByb3RvdHlwZVttZXRob2RdID0gd3JhcFByb21pc2Uob3JpZ2luYWwpO1xuICB9KTtcblxuICByZXR1cm4gdGFyZ2V0O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB3cmFwUHJvbWlzZTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHR5cGVzID0gcmVxdWlyZSgnLi9saWIvY2FyZC10eXBlcycpO1xudmFyIGNsb25lID0gcmVxdWlyZSgnLi9saWIvY2xvbmUnKTtcbnZhciBmaW5kQmVzdE1hdGNoID0gcmVxdWlyZSgnLi9saWIvZmluZC1iZXN0LW1hdGNoJyk7XG52YXIgaXNWYWxpZElucHV0VHlwZSA9IHJlcXVpcmUoJy4vbGliL2lzLXZhbGlkLWlucHV0LXR5cGUnKTtcbnZhciBhZGRNYXRjaGluZ0NhcmRzVG9SZXN1bHRzID0gcmVxdWlyZSgnLi9saWIvYWRkLW1hdGNoaW5nLWNhcmRzLXRvLXJlc3VsdHMnKTtcblxudmFyIHRlc3RPcmRlcjtcbnZhciBjdXN0b21DYXJkcyA9IHt9O1xuXG52YXIgY2FyZE5hbWVzID0ge1xuICBWSVNBOiAndmlzYScsXG4gIE1BU1RFUkNBUkQ6ICdtYXN0ZXJjYXJkJyxcbiAgQU1FUklDQU5fRVhQUkVTUzogJ2FtZXJpY2FuLWV4cHJlc3MnLFxuICBESU5FUlNfQ0xVQjogJ2RpbmVycy1jbHViJyxcbiAgRElTQ09WRVI6ICdkaXNjb3ZlcicsXG4gIEpDQjogJ2pjYicsXG4gIFVOSU9OUEFZOiAndW5pb25wYXknLFxuICBNQUVTVFJPOiAnbWFlc3RybycsXG4gIEVMTzogJ2VsbycsXG4gIE1JUjogJ21pcicsXG4gIEhJUEVSOiAnaGlwZXInLFxuICBISVBFUkNBUkQ6ICdoaXBlcmNhcmQnXG59O1xuXG52YXIgT1JJR0lOQUxfVEVTVF9PUkRFUiA9IFtcbiAgY2FyZE5hbWVzLlZJU0EsXG4gIGNhcmROYW1lcy5NQVNURVJDQVJELFxuICBjYXJkTmFtZXMuQU1FUklDQU5fRVhQUkVTUyxcbiAgY2FyZE5hbWVzLkRJTkVSU19DTFVCLFxuICBjYXJkTmFtZXMuRElTQ09WRVIsXG4gIGNhcmROYW1lcy5KQ0IsXG4gIGNhcmROYW1lcy5VTklPTlBBWSxcbiAgY2FyZE5hbWVzLk1BRVNUUk8sXG4gIGNhcmROYW1lcy5FTE8sXG4gIGNhcmROYW1lcy5NSVIsXG4gIGNhcmROYW1lcy5ISVBFUixcbiAgY2FyZE5hbWVzLkhJUEVSQ0FSRFxuXTtcblxudGVzdE9yZGVyID0gY2xvbmUoT1JJR0lOQUxfVEVTVF9PUkRFUik7XG5cbmZ1bmN0aW9uIGZpbmRUeXBlKHR5cGUpIHtcbiAgcmV0dXJuIGN1c3RvbUNhcmRzW3R5cGVdIHx8IHR5cGVzW3R5cGVdO1xufVxuXG5mdW5jdGlvbiBnZXRBbGxDYXJkVHlwZXMoKSB7XG4gIHJldHVybiB0ZXN0T3JkZXIubWFwKGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgcmV0dXJuIGNsb25lKGZpbmRUeXBlKHR5cGUpKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldENhcmRQb3NpdGlvbihuYW1lLCBpZ25vcmVFcnJvckZvck5vdEV4aXN0aW5nKSB7XG4gIHZhciBwb3NpdGlvbiA9IHRlc3RPcmRlci5pbmRleE9mKG5hbWUpO1xuXG4gIGlmICghaWdub3JlRXJyb3JGb3JOb3RFeGlzdGluZyAmJiBwb3NpdGlvbiA9PT0gLTEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1wiJyArIG5hbWUgKyAnXCIgaXMgbm90IGEgc3VwcG9ydGVkIGNhcmQgdHlwZS4nKTtcbiAgfVxuXG4gIHJldHVybiBwb3NpdGlvbjtcbn1cblxuZnVuY3Rpb24gY3JlZGl0Q2FyZFR5cGUoY2FyZE51bWJlcikge1xuICB2YXIgYmVzdE1hdGNoO1xuICB2YXIgcmVzdWx0cyA9IFtdO1xuXG4gIGlmICghaXNWYWxpZElucHV0VHlwZShjYXJkTnVtYmVyKSkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGlmIChjYXJkTnVtYmVyLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBnZXRBbGxDYXJkVHlwZXModGVzdE9yZGVyKTtcbiAgfVxuXG4gIHRlc3RPcmRlci5mb3JFYWNoKGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgdmFyIGNhcmRDb25maWd1cmF0aW9uID0gZmluZFR5cGUodHlwZSk7XG5cbiAgICBhZGRNYXRjaGluZ0NhcmRzVG9SZXN1bHRzKGNhcmROdW1iZXIsIGNhcmRDb25maWd1cmF0aW9uLCByZXN1bHRzKTtcbiAgfSk7XG5cbiAgYmVzdE1hdGNoID0gZmluZEJlc3RNYXRjaChyZXN1bHRzKTtcblxuICBpZiAoYmVzdE1hdGNoKSB7XG4gICAgcmV0dXJuIFtiZXN0TWF0Y2hdO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdHM7XG59XG5cbmNyZWRpdENhcmRUeXBlLmdldFR5cGVJbmZvID0gZnVuY3Rpb24gKHR5cGUpIHtcbiAgcmV0dXJuIGNsb25lKGZpbmRUeXBlKHR5cGUpKTtcbn07XG5cbmNyZWRpdENhcmRUeXBlLnJlbW92ZUNhcmQgPSBmdW5jdGlvbiAobmFtZSkge1xuICB2YXIgcG9zaXRpb24gPSBnZXRDYXJkUG9zaXRpb24obmFtZSk7XG5cbiAgdGVzdE9yZGVyLnNwbGljZShwb3NpdGlvbiwgMSk7XG59O1xuXG5jcmVkaXRDYXJkVHlwZS5hZGRDYXJkID0gZnVuY3Rpb24gKGNvbmZpZykge1xuICB2YXIgZXhpc3RpbmdDYXJkUG9zaXRpb24gPSBnZXRDYXJkUG9zaXRpb24oY29uZmlnLnR5cGUsIHRydWUpO1xuXG4gIGN1c3RvbUNhcmRzW2NvbmZpZy50eXBlXSA9IGNvbmZpZztcblxuICBpZiAoZXhpc3RpbmdDYXJkUG9zaXRpb24gPT09IC0xKSB7XG4gICAgdGVzdE9yZGVyLnB1c2goY29uZmlnLnR5cGUpO1xuICB9XG59O1xuXG5jcmVkaXRDYXJkVHlwZS51cGRhdGVDYXJkID0gZnVuY3Rpb24gKGNhcmRUeXBlLCB1cGRhdGVzKSB7XG4gIHZhciBjbG9uZWRDYXJkO1xuICB2YXIgb3JpZ2luYWxPYmplY3QgPSBjdXN0b21DYXJkc1tjYXJkVHlwZV0gfHwgdHlwZXNbY2FyZFR5cGVdO1xuXG4gIGlmICghb3JpZ2luYWxPYmplY3QpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1wiJyArIGNhcmRUeXBlICsgJ1wiIGlzIG5vdCBhIHJlY29nbml6ZWQgdHlwZS4gVXNlIGBhZGRDYXJkYCBpbnN0ZWFkLicpO1xuICB9XG5cbiAgaWYgKHVwZGF0ZXMudHlwZSAmJiBvcmlnaW5hbE9iamVjdC50eXBlICE9PSB1cGRhdGVzLnR5cGUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBvdmVyd3JpdGUgdHlwZSBwYXJhbWV0ZXIuJyk7XG4gIH1cblxuICBjbG9uZWRDYXJkID0gY2xvbmUob3JpZ2luYWxPYmplY3QsIHRydWUpO1xuXG4gIE9iamVjdC5rZXlzKGNsb25lZENhcmQpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgIGlmICh1cGRhdGVzW2tleV0pIHtcbiAgICAgIGNsb25lZENhcmRba2V5XSA9IHVwZGF0ZXNba2V5XTtcbiAgICB9XG4gIH0pO1xuXG4gIGN1c3RvbUNhcmRzW2Nsb25lZENhcmQudHlwZV0gPSBjbG9uZWRDYXJkO1xufTtcblxuY3JlZGl0Q2FyZFR5cGUuY2hhbmdlT3JkZXIgPSBmdW5jdGlvbiAobmFtZSwgcG9zaXRpb24pIHtcbiAgdmFyIGN1cnJlbnRQb3NpdGlvbiA9IGdldENhcmRQb3NpdGlvbihuYW1lKTtcblxuICB0ZXN0T3JkZXIuc3BsaWNlKGN1cnJlbnRQb3NpdGlvbiwgMSk7XG4gIHRlc3RPcmRlci5zcGxpY2UocG9zaXRpb24sIDAsIG5hbWUpO1xufTtcblxuY3JlZGl0Q2FyZFR5cGUucmVzZXRNb2RpZmljYXRpb25zID0gZnVuY3Rpb24gKCkge1xuICB0ZXN0T3JkZXIgPSBjbG9uZShPUklHSU5BTF9URVNUX09SREVSKTtcbiAgY3VzdG9tQ2FyZHMgPSB7fTtcbn07XG5cbmNyZWRpdENhcmRUeXBlLnR5cGVzID0gY2FyZE5hbWVzO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWRpdENhcmRUeXBlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2xvbmUgPSByZXF1aXJlKCcuL2Nsb25lJyk7XG52YXIgbWF0Y2hlcyA9IHJlcXVpcmUoJy4vbWF0Y2hlcycpO1xuXG5mdW5jdGlvbiBhZGRNYXRjaGluZ0NhcmRzVG9SZXN1bHRzKGNhcmROdW1iZXIsIGNhcmRDb25maWd1cmF0aW9uLCByZXN1bHRzKSB7XG4gIHZhciBpLCBwYXR0ZXJuLCBwYXR0ZXJuTGVuZ3RoLCBjbG9uZWRDYXJkQ29uZmlndXJhdGlvbjtcblxuICBmb3IgKGkgPSAwOyBpIDwgY2FyZENvbmZpZ3VyYXRpb24ucGF0dGVybnMubGVuZ3RoOyBpKyspIHtcbiAgICBwYXR0ZXJuID0gY2FyZENvbmZpZ3VyYXRpb24ucGF0dGVybnNbaV07XG5cbiAgICBpZiAoIW1hdGNoZXMoY2FyZE51bWJlciwgcGF0dGVybikpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGNsb25lZENhcmRDb25maWd1cmF0aW9uID0gY2xvbmUoY2FyZENvbmZpZ3VyYXRpb24pO1xuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkocGF0dGVybikpIHtcbiAgICAgIHBhdHRlcm5MZW5ndGggPSBTdHJpbmcocGF0dGVyblswXSkubGVuZ3RoO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXR0ZXJuTGVuZ3RoID0gU3RyaW5nKHBhdHRlcm4pLmxlbmd0aDtcbiAgICB9XG5cbiAgICBpZiAoY2FyZE51bWJlci5sZW5ndGggPj0gcGF0dGVybkxlbmd0aCkge1xuICAgICAgY2xvbmVkQ2FyZENvbmZpZ3VyYXRpb24ubWF0Y2hTdHJlbmd0aCA9IHBhdHRlcm5MZW5ndGg7XG4gICAgfVxuXG4gICAgcmVzdWx0cy5wdXNoKGNsb25lZENhcmRDb25maWd1cmF0aW9uKTtcbiAgICBicmVhaztcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFkZE1hdGNoaW5nQ2FyZHNUb1Jlc3VsdHM7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjYXJkVHlwZXMgPSB7XG4gIHZpc2E6IHtcbiAgICBuaWNlVHlwZTogJ1Zpc2EnLFxuICAgIHR5cGU6ICd2aXNhJyxcbiAgICBwYXR0ZXJuczogW1xuICAgICAgNFxuICAgIF0sXG4gICAgZ2FwczogWzQsIDgsIDEyXSxcbiAgICBsZW5ndGhzOiBbMTYsIDE4LCAxOV0sXG4gICAgY29kZToge1xuICAgICAgbmFtZTogJ0NWVicsXG4gICAgICBzaXplOiAzXG4gICAgfVxuICB9LFxuICBtYXN0ZXJjYXJkOiB7XG4gICAgbmljZVR5cGU6ICdNYXN0ZXJjYXJkJyxcbiAgICB0eXBlOiAnbWFzdGVyY2FyZCcsXG4gICAgcGF0dGVybnM6IFtcbiAgICAgIFs1MSwgNTVdLFxuICAgICAgWzIyMjEsIDIyMjldLFxuICAgICAgWzIyMywgMjI5XSxcbiAgICAgIFsyMywgMjZdLFxuICAgICAgWzI3MCwgMjcxXSxcbiAgICAgIDI3MjBcbiAgICBdLFxuICAgIGdhcHM6IFs0LCA4LCAxMl0sXG4gICAgbGVuZ3RoczogWzE2XSxcbiAgICBjb2RlOiB7XG4gICAgICBuYW1lOiAnQ1ZDJyxcbiAgICAgIHNpemU6IDNcbiAgICB9XG4gIH0sXG4gICdhbWVyaWNhbi1leHByZXNzJzoge1xuICAgIG5pY2VUeXBlOiAnQW1lcmljYW4gRXhwcmVzcycsXG4gICAgdHlwZTogJ2FtZXJpY2FuLWV4cHJlc3MnLFxuICAgIHBhdHRlcm5zOiBbXG4gICAgICAzNCxcbiAgICAgIDM3XG4gICAgXSxcbiAgICBnYXBzOiBbNCwgMTBdLFxuICAgIGxlbmd0aHM6IFsxNV0sXG4gICAgY29kZToge1xuICAgICAgbmFtZTogJ0NJRCcsXG4gICAgICBzaXplOiA0XG4gICAgfVxuICB9LFxuICAnZGluZXJzLWNsdWInOiB7XG4gICAgbmljZVR5cGU6ICdEaW5lcnMgQ2x1YicsXG4gICAgdHlwZTogJ2RpbmVycy1jbHViJyxcbiAgICBwYXR0ZXJuczogW1xuICAgICAgWzMwMCwgMzA1XSxcbiAgICAgIDM2LFxuICAgICAgMzgsXG4gICAgICAzOVxuICAgIF0sXG4gICAgZ2FwczogWzQsIDEwXSxcbiAgICBsZW5ndGhzOiBbMTQsIDE2LCAxOV0sXG4gICAgY29kZToge1xuICAgICAgbmFtZTogJ0NWVicsXG4gICAgICBzaXplOiAzXG4gICAgfVxuICB9LFxuICBkaXNjb3Zlcjoge1xuICAgIG5pY2VUeXBlOiAnRGlzY292ZXInLFxuICAgIHR5cGU6ICdkaXNjb3ZlcicsXG4gICAgcGF0dGVybnM6IFtcbiAgICAgIDYwMTEsXG4gICAgICBbNjQ0LCA2NDldLFxuICAgICAgNjVcbiAgICBdLFxuICAgIGdhcHM6IFs0LCA4LCAxMl0sXG4gICAgbGVuZ3RoczogWzE2LCAxOV0sXG4gICAgY29kZToge1xuICAgICAgbmFtZTogJ0NJRCcsXG4gICAgICBzaXplOiAzXG4gICAgfVxuICB9LFxuICBqY2I6IHtcbiAgICBuaWNlVHlwZTogJ0pDQicsXG4gICAgdHlwZTogJ2pjYicsXG4gICAgcGF0dGVybnM6IFtcbiAgICAgIDIxMzEsXG4gICAgICAxODAwLFxuICAgICAgWzM1MjgsIDM1ODldXG4gICAgXSxcbiAgICBnYXBzOiBbNCwgOCwgMTJdLFxuICAgIGxlbmd0aHM6IFsxNiwgMTcsIDE4LCAxOV0sXG4gICAgY29kZToge1xuICAgICAgbmFtZTogJ0NWVicsXG4gICAgICBzaXplOiAzXG4gICAgfVxuICB9LFxuICB1bmlvbnBheToge1xuICAgIG5pY2VUeXBlOiAnVW5pb25QYXknLFxuICAgIHR5cGU6ICd1bmlvbnBheScsXG4gICAgcGF0dGVybnM6IFtcbiAgICAgIDYyMCxcbiAgICAgIFs2MjQsIDYyNl0sXG4gICAgICBbNjIxMDAsIDYyMTgyXSxcbiAgICAgIFs2MjE4NCwgNjIxODddLFxuICAgICAgWzYyMTg1LCA2MjE5N10sXG4gICAgICBbNjIyMDAsIDYyMjA1XSxcbiAgICAgIFs2MjIwMTAsIDYyMjk5OV0sXG4gICAgICA2MjIwMTgsXG4gICAgICBbNjIyMDE5LCA2MjI5OTldLFxuICAgICAgWzYyMjA3LCA2MjIwOV0sXG4gICAgICBbNjIyMTI2LCA2MjI5MjVdLFxuICAgICAgWzYyMywgNjI2XSxcbiAgICAgIDYyNzAsXG4gICAgICA2MjcyLFxuICAgICAgNjI3NixcbiAgICAgIFs2Mjc3MDAsIDYyNzc3OV0sXG4gICAgICBbNjI3NzgxLCA2Mjc3OTldLFxuICAgICAgWzYyODIsIDYyODldLFxuICAgICAgNjI5MSxcbiAgICAgIDYyOTIsXG4gICAgICA4MTAsXG4gICAgICBbODExMCwgODEzMV0sXG4gICAgICBbODEzMiwgODE1MV0sXG4gICAgICBbODE1MiwgODE2M10sXG4gICAgICBbODE2NCwgODE3MV1cbiAgICBdLFxuICAgIGdhcHM6IFs0LCA4LCAxMl0sXG4gICAgbGVuZ3RoczogWzE0LCAxNSwgMTYsIDE3LCAxOCwgMTldLFxuICAgIGNvZGU6IHtcbiAgICAgIG5hbWU6ICdDVk4nLFxuICAgICAgc2l6ZTogM1xuICAgIH1cbiAgfSxcbiAgbWFlc3Rybzoge1xuICAgIG5pY2VUeXBlOiAnTWFlc3RybycsXG4gICAgdHlwZTogJ21hZXN0cm8nLFxuICAgIHBhdHRlcm5zOiBbXG4gICAgICA0OTM2OTgsXG4gICAgICBbNTAwMDAwLCA1MDY2OThdLFxuICAgICAgWzUwNjc3OSwgNTA4OTk5XSxcbiAgICAgIFs1NiwgNTldLFxuICAgICAgNjMsXG4gICAgICA2NyxcbiAgICAgIDZcbiAgICBdLFxuICAgIGdhcHM6IFs0LCA4LCAxMl0sXG4gICAgbGVuZ3RoczogWzEyLCAxMywgMTQsIDE1LCAxNiwgMTcsIDE4LCAxOV0sXG4gICAgY29kZToge1xuICAgICAgbmFtZTogJ0NWQycsXG4gICAgICBzaXplOiAzXG4gICAgfVxuICB9LFxuICBlbG86IHtcbiAgICBuaWNlVHlwZTogJ0VsbycsXG4gICAgdHlwZTogJ2VsbycsXG4gICAgcGF0dGVybnM6IFtcbiAgICAgIDQwMTE3OCxcbiAgICAgIDQwMTE3OSxcbiAgICAgIDQzODkzNSxcbiAgICAgIDQ1NzYzMSxcbiAgICAgIDQ1NzYzMixcbiAgICAgIDQzMTI3NCxcbiAgICAgIDQ1MTQxNixcbiAgICAgIDQ1NzM5MyxcbiAgICAgIDUwNDE3NSxcbiAgICAgIFs1MDY2OTksIDUwNjc3OF0sXG4gICAgICBbNTA5MDAwLCA1MDk5OTldLFxuICAgICAgNjI3NzgwLFxuICAgICAgNjM2Mjk3LFxuICAgICAgNjM2MzY4LFxuICAgICAgWzY1MDAzMSwgNjUwMDMzXSxcbiAgICAgIFs2NTAwMzUsIDY1MDA1MV0sXG4gICAgICBbNjUwNDA1LCA2NTA0MzldLFxuICAgICAgWzY1MDQ4NSwgNjUwNTM4XSxcbiAgICAgIFs2NTA1NDEsIDY1MDU5OF0sXG4gICAgICBbNjUwNzAwLCA2NTA3MThdLFxuICAgICAgWzY1MDcyMCwgNjUwNzI3XSxcbiAgICAgIFs2NTA5MDEsIDY1MDk3OF0sXG4gICAgICBbNjUxNjUyLCA2NTE2NzldLFxuICAgICAgWzY1NTAwMCwgNjU1MDE5XSxcbiAgICAgIFs2NTUwMjEsIDY1NTA1OF1cbiAgICBdLFxuICAgIGdhcHM6IFs0LCA4LCAxMl0sXG4gICAgbGVuZ3RoczogWzE2XSxcbiAgICBjb2RlOiB7XG4gICAgICBuYW1lOiAnQ1ZFJyxcbiAgICAgIHNpemU6IDNcbiAgICB9XG4gIH0sXG4gIG1pcjoge1xuICAgIG5pY2VUeXBlOiAnTWlyJyxcbiAgICB0eXBlOiAnbWlyJyxcbiAgICBwYXR0ZXJuczogW1xuICAgICAgWzIyMDAsIDIyMDRdXG4gICAgXSxcbiAgICBnYXBzOiBbNCwgOCwgMTJdLFxuICAgIGxlbmd0aHM6IFsxNiwgMTcsIDE4LCAxOV0sXG4gICAgY29kZToge1xuICAgICAgbmFtZTogJ0NWUDInLFxuICAgICAgc2l6ZTogM1xuICAgIH1cbiAgfSxcbiAgaGlwZXI6IHtcbiAgICBuaWNlVHlwZTogJ0hpcGVyJyxcbiAgICB0eXBlOiAnaGlwZXInLFxuICAgIHBhdHRlcm5zOiBbXG4gICAgICA2MzcwOTUsXG4gICAgICA2Mzc1NjgsXG4gICAgICA2Mzc1OTksXG4gICAgICA2Mzc2MDksXG4gICAgICA2Mzc2MTJcbiAgICBdLFxuICAgIGdhcHM6IFs0LCA4LCAxMl0sXG4gICAgbGVuZ3RoczogWzE2XSxcbiAgICBjb2RlOiB7XG4gICAgICBuYW1lOiAnQ1ZDJyxcbiAgICAgIHNpemU6IDNcbiAgICB9XG4gIH0sXG4gIGhpcGVyY2FyZDoge1xuICAgIG5pY2VUeXBlOiAnSGlwZXJjYXJkJyxcbiAgICB0eXBlOiAnaGlwZXJjYXJkJyxcbiAgICBwYXR0ZXJuczogW1xuICAgICAgNjA2MjgyXG4gICAgXSxcbiAgICBnYXBzOiBbNCwgOCwgMTJdLFxuICAgIGxlbmd0aHM6IFsxNl0sXG4gICAgY29kZToge1xuICAgICAgbmFtZTogJ0NWQycsXG4gICAgICBzaXplOiAzXG4gICAgfVxuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNhcmRUeXBlcztcbiIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gY2xvbmUob3JpZ2luYWxPYmplY3QpIHtcbiAgdmFyIGR1cGU7XG5cbiAgaWYgKCFvcmlnaW5hbE9iamVjdCkgeyByZXR1cm4gbnVsbDsgfVxuXG4gIGR1cGUgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG9yaWdpbmFsT2JqZWN0KSk7XG5cbiAgcmV0dXJuIGR1cGU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmU7XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIGhhc0Vub3VnaFJlc3VsdHNUb0RldGVybWluZUJlc3RNYXRjaChyZXN1bHRzKSB7XG4gIHZhciBudW1iZXJPZlJlc3VsdHNXaXRoTWF4U3RyZW5ndGhQcm9wZXJ0eSA9IHJlc3VsdHMuZmlsdGVyKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICByZXR1cm4gcmVzdWx0Lm1hdGNoU3RyZW5ndGg7XG4gIH0pLmxlbmd0aDtcblxuICAvLyBpZiBhbGwgcG9zc2libGUgcmVzdWx0cyBoYXZlIGEgbWF4U3RyZW5ndGggcHJvcGVydHlcbiAgLy8gdGhhdCBtZWFucyB0aGUgY2FyZCBudW1iZXIgaXMgc3VmZmljaWVudGx5IGxvbmdcbiAgLy8gZW5vdWdoIHRvIGRldGVybWluZSBjb25jbHVzaXZlbHkgd2hhdCB0aGUgdHlwZSBpc1xuICByZXR1cm4gbnVtYmVyT2ZSZXN1bHRzV2l0aE1heFN0cmVuZ3RoUHJvcGVydHkgPiAwICYmXG4gICAgbnVtYmVyT2ZSZXN1bHRzV2l0aE1heFN0cmVuZ3RoUHJvcGVydHkgPT09IHJlc3VsdHMubGVuZ3RoO1xufVxuXG5mdW5jdGlvbiBmaW5kQmVzdE1hdGNoKHJlc3VsdHMpIHtcbiAgaWYgKCFoYXNFbm91Z2hSZXN1bHRzVG9EZXRlcm1pbmVCZXN0TWF0Y2gocmVzdWx0cykpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICByZXR1cm4gcmVzdWx0cy5yZWR1Y2UoZnVuY3Rpb24gKGJlc3RNYXRjaCwgcmVzdWx0KSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgY29uc2lzdGVudC1yZXR1cm5cbiAgICBpZiAoIWJlc3RNYXRjaCkge1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvLyBpZiB0aGUgY3VycmVudCBiZXN0IG1hdGNoIHBhdHRlcm4gaXMgbGVzcyBzcGVjaWZpY1xuICAgIC8vIHRoYW4gdGhpcyByZXN1bHQsIHNldCB0aGUgcmVzdWx0IGFzIHRoZSBuZXcgYmVzdCBtYXRjaFxuICAgIGlmIChiZXN0TWF0Y2gubWF0Y2hTdHJlbmd0aCA8IHJlc3VsdC5tYXRjaFN0cmVuZ3RoKSB7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHJldHVybiBiZXN0TWF0Y2g7XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZpbmRCZXN0TWF0Y2g7XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIGlzVmFsaWRJbnB1dFR5cGUoY2FyZE51bWJlcikge1xuICByZXR1cm4gdHlwZW9mIGNhcmROdW1iZXIgPT09ICdzdHJpbmcnIHx8IGNhcmROdW1iZXIgaW5zdGFuY2VvZiBTdHJpbmc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNWYWxpZElucHV0VHlwZTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gQWRhcHRlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9wb2x2by1sYWJzL2NhcmQtdHlwZS9ibG9iL2FhYWIxMWY4MGZhMTkzOWJjY2M4ZjI0OTA1YTA2YWUzY2Q4NjQzNTYvc3JjL2NhcmRUeXBlLmpzI0wzNy1MNDJcbmZ1bmN0aW9uIG1hdGNoZXNSYW5nZShjYXJkTnVtYmVyLCBtaW4sIG1heCkge1xuICB2YXIgbWF4TGVuZ3RoVG9DaGVjayA9IFN0cmluZyhtaW4pLmxlbmd0aDtcbiAgdmFyIHN1YnN0ciA9IGNhcmROdW1iZXIuc3Vic3RyKDAsIG1heExlbmd0aFRvQ2hlY2spO1xuICB2YXIgaW50ZWdlclJlcHJlc2VudGF0aW9uT2ZDYXJkTnVtYmVyID0gcGFyc2VJbnQoc3Vic3RyLCAxMCk7XG5cbiAgbWluID0gcGFyc2VJbnQoU3RyaW5nKG1pbikuc3Vic3RyKDAsIHN1YnN0ci5sZW5ndGgpLCAxMCk7XG4gIG1heCA9IHBhcnNlSW50KFN0cmluZyhtYXgpLnN1YnN0cigwLCBzdWJzdHIubGVuZ3RoKSwgMTApO1xuXG4gIHJldHVybiBpbnRlZ2VyUmVwcmVzZW50YXRpb25PZkNhcmROdW1iZXIgPj0gbWluICYmIGludGVnZXJSZXByZXNlbnRhdGlvbk9mQ2FyZE51bWJlciA8PSBtYXg7XG59XG5cbmZ1bmN0aW9uIG1hdGNoZXNQYXR0ZXJuKGNhcmROdW1iZXIsIHBhdHRlcm4pIHtcbiAgcGF0dGVybiA9IFN0cmluZyhwYXR0ZXJuKTtcblxuICByZXR1cm4gcGF0dGVybi5zdWJzdHJpbmcoMCwgY2FyZE51bWJlci5sZW5ndGgpID09PSBjYXJkTnVtYmVyLnN1YnN0cmluZygwLCBwYXR0ZXJuLmxlbmd0aCk7XG59XG5cbmZ1bmN0aW9uIG1hdGNoZXMoY2FyZE51bWJlciwgcGF0dGVybikge1xuICBpZiAoQXJyYXkuaXNBcnJheShwYXR0ZXJuKSkge1xuICAgIHJldHVybiBtYXRjaGVzUmFuZ2UoY2FyZE51bWJlciwgcGF0dGVyblswXSwgcGF0dGVyblsxXSk7XG4gIH1cblxuICByZXR1cm4gbWF0Y2hlc1BhdHRlcm4oY2FyZE51bWJlciwgcGF0dGVybik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWF0Y2hlcztcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHdpbiwgZnJhbWVidXM7XG52YXIgcG9wdXBzID0gW107XG52YXIgc3Vic2NyaWJlcnMgPSB7fTtcbnZhciBwcmVmaXggPSAnLypmcmFtZWJ1cyovJztcblxuZnVuY3Rpb24gaW5jbHVkZShwb3B1cCkge1xuICBpZiAocG9wdXAgPT0gbnVsbCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYgKHBvcHVwLldpbmRvdyA9PSBudWxsKSB7IHJldHVybiBmYWxzZTsgfVxuICBpZiAocG9wdXAuY29uc3RydWN0b3IgIT09IHBvcHVwLldpbmRvdykgeyByZXR1cm4gZmFsc2U7IH1cblxuICBwb3B1cHMucHVzaChwb3B1cCk7XG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiB0YXJnZXQob3JpZ2luKSB7XG4gIHZhciBrZXk7XG4gIHZhciB0YXJnZXRlZEZyYW1lYnVzID0ge307XG5cbiAgZm9yIChrZXkgaW4gZnJhbWVidXMpIHtcbiAgICBpZiAoIWZyYW1lYnVzLmhhc093blByb3BlcnR5KGtleSkpIHsgY29udGludWU7IH1cblxuICAgIHRhcmdldGVkRnJhbWVidXNba2V5XSA9IGZyYW1lYnVzW2tleV07XG4gIH1cblxuICB0YXJnZXRlZEZyYW1lYnVzLl9vcmlnaW4gPSBvcmlnaW4gfHwgJyonO1xuXG4gIHJldHVybiB0YXJnZXRlZEZyYW1lYnVzO1xufVxuXG5mdW5jdGlvbiBwdWJsaXNoKGV2ZW50KSB7XG4gIHZhciBwYXlsb2FkLCBhcmdzO1xuICB2YXIgb3JpZ2luID0gX2dldE9yaWdpbih0aGlzKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1pbnZhbGlkLXRoaXNcblxuICBpZiAoX2lzbnRTdHJpbmcoZXZlbnQpKSB7IHJldHVybiBmYWxzZTsgfVxuICBpZiAoX2lzbnRTdHJpbmcob3JpZ2luKSkgeyByZXR1cm4gZmFsc2U7IH1cblxuICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcblxuICBwYXlsb2FkID0gX3BhY2thZ2VQYXlsb2FkKGV2ZW50LCBhcmdzLCBvcmlnaW4pO1xuICBpZiAocGF5bG9hZCA9PT0gZmFsc2UpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgX2Jyb2FkY2FzdCh3aW4udG9wIHx8IHdpbi5zZWxmLCBwYXlsb2FkLCBvcmlnaW4pO1xuXG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBzdWJzY3JpYmUoZXZlbnQsIGZuKSB7XG4gIHZhciBvcmlnaW4gPSBfZ2V0T3JpZ2luKHRoaXMpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWludmFsaWQtdGhpc1xuXG4gIGlmIChfc3Vic2NyaXB0aW9uQXJnc0ludmFsaWQoZXZlbnQsIGZuLCBvcmlnaW4pKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIHN1YnNjcmliZXJzW29yaWdpbl0gPSBzdWJzY3JpYmVyc1tvcmlnaW5dIHx8IHt9O1xuICBzdWJzY3JpYmVyc1tvcmlnaW5dW2V2ZW50XSA9IHN1YnNjcmliZXJzW29yaWdpbl1bZXZlbnRdIHx8IFtdO1xuICBzdWJzY3JpYmVyc1tvcmlnaW5dW2V2ZW50XS5wdXNoKGZuKTtcblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gdW5zdWJzY3JpYmUoZXZlbnQsIGZuKSB7XG4gIHZhciBpLCBzdWJzY3JpYmVyTGlzdDtcbiAgdmFyIG9yaWdpbiA9IF9nZXRPcmlnaW4odGhpcyk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8taW52YWxpZC10aGlzXG5cbiAgaWYgKF9zdWJzY3JpcHRpb25BcmdzSW52YWxpZChldmVudCwgZm4sIG9yaWdpbikpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgc3Vic2NyaWJlckxpc3QgPSBzdWJzY3JpYmVyc1tvcmlnaW5dICYmIHN1YnNjcmliZXJzW29yaWdpbl1bZXZlbnRdO1xuICBpZiAoIXN1YnNjcmliZXJMaXN0KSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIGZvciAoaSA9IDA7IGkgPCBzdWJzY3JpYmVyTGlzdC5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdWJzY3JpYmVyTGlzdFtpXSA9PT0gZm4pIHtcbiAgICAgIHN1YnNjcmliZXJMaXN0LnNwbGljZShpLCAxKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gX2dldE9yaWdpbihzY29wZSkge1xuICByZXR1cm4gc2NvcGUgJiYgc2NvcGUuX29yaWdpbiB8fCAnKic7XG59XG5cbmZ1bmN0aW9uIF9pc250U3RyaW5nKHN0cmluZykge1xuICByZXR1cm4gdHlwZW9mIHN0cmluZyAhPT0gJ3N0cmluZyc7XG59XG5cbmZ1bmN0aW9uIF9wYWNrYWdlUGF5bG9hZChldmVudCwgYXJncywgb3JpZ2luKSB7XG4gIHZhciBwYWNrYWdlZCA9IGZhbHNlO1xuICB2YXIgcGF5bG9hZCA9IHtcbiAgICBldmVudDogZXZlbnQsXG4gICAgb3JpZ2luOiBvcmlnaW5cbiAgfTtcbiAgdmFyIHJlcGx5ID0gYXJnc1thcmdzLmxlbmd0aCAtIDFdO1xuXG4gIGlmICh0eXBlb2YgcmVwbHkgPT09ICdmdW5jdGlvbicpIHtcbiAgICBwYXlsb2FkLnJlcGx5ID0gX3N1YnNjcmliZVJlcGxpZXIocmVwbHksIG9yaWdpbik7XG4gICAgYXJncyA9IGFyZ3Muc2xpY2UoMCwgLTEpO1xuICB9XG5cbiAgcGF5bG9hZC5hcmdzID0gYXJncztcblxuICB0cnkge1xuICAgIHBhY2thZ2VkID0gcHJlZml4ICsgSlNPTi5zdHJpbmdpZnkocGF5bG9hZCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvdWxkIG5vdCBzdHJpbmdpZnkgZXZlbnQ6ICcgKyBlLm1lc3NhZ2UpO1xuICB9XG4gIHJldHVybiBwYWNrYWdlZDtcbn1cblxuZnVuY3Rpb24gX3VucGFja1BheWxvYWQoZSkge1xuICB2YXIgcGF5bG9hZCwgcmVwbHlPcmlnaW4sIHJlcGx5U291cmNlLCByZXBseUV2ZW50O1xuXG4gIGlmIChlLmRhdGEuc2xpY2UoMCwgcHJlZml4Lmxlbmd0aCkgIT09IHByZWZpeCkgeyByZXR1cm4gZmFsc2U7IH1cblxuICB0cnkge1xuICAgIHBheWxvYWQgPSBKU09OLnBhcnNlKGUuZGF0YS5zbGljZShwcmVmaXgubGVuZ3RoKSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChwYXlsb2FkLnJlcGx5ICE9IG51bGwpIHtcbiAgICByZXBseU9yaWdpbiA9IGUub3JpZ2luO1xuICAgIHJlcGx5U291cmNlID0gZS5zb3VyY2U7XG4gICAgcmVwbHlFdmVudCA9IHBheWxvYWQucmVwbHk7XG5cbiAgICBwYXlsb2FkLnJlcGx5ID0gZnVuY3Rpb24gcmVwbHkoZGF0YSkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGNvbnNpc3RlbnQtcmV0dXJuXG4gICAgICB2YXIgcmVwbHlQYXlsb2FkO1xuXG4gICAgICBpZiAoIXJlcGx5U291cmNlKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gICAgICByZXBseVBheWxvYWQgPSBfcGFja2FnZVBheWxvYWQocmVwbHlFdmVudCwgW2RhdGFdLCByZXBseU9yaWdpbik7XG5cbiAgICAgIGlmIChyZXBseVBheWxvYWQgPT09IGZhbHNlKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gICAgICByZXBseVNvdXJjZS5wb3N0TWVzc2FnZShyZXBseVBheWxvYWQsIHJlcGx5T3JpZ2luKTtcbiAgICB9O1xuXG4gICAgcGF5bG9hZC5hcmdzLnB1c2gocGF5bG9hZC5yZXBseSk7XG4gIH1cblxuICByZXR1cm4gcGF5bG9hZDtcbn1cblxuZnVuY3Rpb24gX2F0dGFjaCh3KSB7XG4gIGlmICh3aW4pIHsgcmV0dXJuOyB9XG4gIHdpbiA9IHcgfHwgZ2xvYmFsO1xuXG4gIGlmICh3aW4uYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgIHdpbi5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgX29ubWVzc2FnZSwgZmFsc2UpO1xuICB9IGVsc2UgaWYgKHdpbi5hdHRhY2hFdmVudCkge1xuICAgIHdpbi5hdHRhY2hFdmVudCgnb25tZXNzYWdlJywgX29ubWVzc2FnZSk7XG4gIH0gZWxzZSBpZiAod2luLm9ubWVzc2FnZSA9PT0gbnVsbCkge1xuICAgIHdpbi5vbm1lc3NhZ2UgPSBfb25tZXNzYWdlO1xuICB9IGVsc2Uge1xuICAgIHdpbiA9IG51bGw7XG4gIH1cbn1cblxuLy8gcmVtb3ZlSWYocHJvZHVjdGlvbilcbmZ1bmN0aW9uIF9kZXRhY2goKSB7XG4gIGlmICh3aW4gPT0gbnVsbCkgeyByZXR1cm47IH1cblxuICBpZiAod2luLnJlbW92ZUV2ZW50TGlzdGVuZXIpIHtcbiAgICB3aW4ucmVtb3ZlRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIF9vbm1lc3NhZ2UsIGZhbHNlKTtcbiAgfSBlbHNlIGlmICh3aW4uZGV0YWNoRXZlbnQpIHtcbiAgICB3aW4uZGV0YWNoRXZlbnQoJ29ubWVzc2FnZScsIF9vbm1lc3NhZ2UpO1xuICB9IGVsc2UgaWYgKHdpbi5vbm1lc3NhZ2UgPT09IF9vbm1lc3NhZ2UpIHtcbiAgICB3aW4ub25tZXNzYWdlID0gbnVsbDtcbiAgfVxuXG4gIHdpbiA9IG51bGw7XG4gIHBvcHVwcyA9IFtdO1xuICBzdWJzY3JpYmVycyA9IHt9O1xufVxuLy8gZW5kUmVtb3ZlSWYocHJvZHVjdGlvbilcblxuZnVuY3Rpb24gX3V1aWQoKSB7XG4gIHJldHVybiAneHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4Jy5yZXBsYWNlKC9beHldL2csIGZ1bmN0aW9uIChjKSB7XG4gICAgdmFyIHIgPSBNYXRoLnJhbmRvbSgpICogMTYgfCAwO1xuICAgIHZhciB2ID0gYyA9PT0gJ3gnID8gciA6IHIgJiAweDMgfCAweDg7XG5cbiAgICByZXR1cm4gdi50b1N0cmluZygxNik7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBfb25tZXNzYWdlKGUpIHtcbiAgdmFyIHBheWxvYWQ7XG5cbiAgaWYgKF9pc250U3RyaW5nKGUuZGF0YSkpIHsgcmV0dXJuOyB9XG5cbiAgcGF5bG9hZCA9IF91bnBhY2tQYXlsb2FkKGUpO1xuICBpZiAoIXBheWxvYWQpIHsgcmV0dXJuOyB9XG5cbiAgX2Rpc3BhdGNoKCcqJywgcGF5bG9hZC5ldmVudCwgcGF5bG9hZC5hcmdzLCBlKTtcbiAgX2Rpc3BhdGNoKGUub3JpZ2luLCBwYXlsb2FkLmV2ZW50LCBwYXlsb2FkLmFyZ3MsIGUpO1xuICBfYnJvYWRjYXN0UG9wdXBzKGUuZGF0YSwgcGF5bG9hZC5vcmlnaW4sIGUuc291cmNlKTtcbn1cblxuZnVuY3Rpb24gX2Rpc3BhdGNoKG9yaWdpbiwgZXZlbnQsIGFyZ3MsIGUpIHtcbiAgdmFyIGk7XG5cbiAgaWYgKCFzdWJzY3JpYmVyc1tvcmlnaW5dKSB7IHJldHVybjsgfVxuICBpZiAoIXN1YnNjcmliZXJzW29yaWdpbl1bZXZlbnRdKSB7IHJldHVybjsgfVxuXG4gIGZvciAoaSA9IDA7IGkgPCBzdWJzY3JpYmVyc1tvcmlnaW5dW2V2ZW50XS5sZW5ndGg7IGkrKykge1xuICAgIHN1YnNjcmliZXJzW29yaWdpbl1bZXZlbnRdW2ldLmFwcGx5KGUsIGFyZ3MpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9oYXNPcGVuZXIoZnJhbWUpIHtcbiAgaWYgKGZyYW1lLnRvcCAhPT0gZnJhbWUpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIGlmIChmcmFtZS5vcGVuZXIgPT0gbnVsbCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYgKGZyYW1lLm9wZW5lciA9PT0gZnJhbWUpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIGlmIChmcmFtZS5vcGVuZXIuY2xvc2VkID09PSB0cnVlKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBfYnJvYWRjYXN0KGZyYW1lLCBwYXlsb2FkLCBvcmlnaW4pIHtcbiAgdmFyIGkgPSAwO1xuICB2YXIgZnJhbWVUb0Jyb2FkY2FzdFRvO1xuXG4gIHRyeSB7XG4gICAgZnJhbWUucG9zdE1lc3NhZ2UocGF5bG9hZCwgb3JpZ2luKTtcblxuICAgIGlmIChfaGFzT3BlbmVyKGZyYW1lKSkge1xuICAgICAgX2Jyb2FkY2FzdChmcmFtZS5vcGVuZXIudG9wLCBwYXlsb2FkLCBvcmlnaW4pO1xuICAgIH1cblxuICAgIC8vIHByZXZpb3VzbHksIG91ciBtYXggdmFsdWUgd2FzIGZyYW1lLmZyYW1lcy5sZW5ndGhcbiAgICAvLyBidXQgZnJhbWVzLmxlbmd0aCBpbmhlcml0cyBmcm9tIHdpbmRvdy5sZW5ndGhcbiAgICAvLyB3aGljaCBjYW4gYmUgb3ZlcndyaXR0ZW4gaWYgYSBkZXZlbG9wZXIgZG9lc1xuICAgIC8vIGB2YXIgbGVuZ3RoID0gdmFsdWU7YCBvdXRzaWRlIG9mIGEgZnVuY3Rpb25cbiAgICAvLyBzY29wZSwgaXQnbGwgcHJldmVudCB1cyBmcm9tIGxvb3BpbmcgdGhyb3VnaFxuICAgIC8vIGFsbCB0aGUgZnJhbWVzLiBXaXRoIHRoaXMsIHdlIGxvb3AgdGhyb3VnaFxuICAgIC8vIHVudGlsIHRoZXJlIGFyZSBubyBsb25nZXIgYW55IGZyYW1lc1xuICAgIHdoaWxlIChmcmFtZVRvQnJvYWRjYXN0VG8gPSBmcmFtZS5mcmFtZXNbaV0pIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25kLWFzc2lnblxuICAgICAgX2Jyb2FkY2FzdChmcmFtZVRvQnJvYWRjYXN0VG8sIHBheWxvYWQsIG9yaWdpbik7XG4gICAgICBpKys7XG4gICAgfVxuICB9IGNhdGNoIChfKSB7IC8qIGlnbm9yZWQgKi8gfVxufVxuXG5mdW5jdGlvbiBfYnJvYWRjYXN0UG9wdXBzKHBheWxvYWQsIG9yaWdpbiwgc291cmNlKSB7XG4gIHZhciBpLCBwb3B1cDtcblxuICBmb3IgKGkgPSBwb3B1cHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBwb3B1cCA9IHBvcHVwc1tpXTtcblxuICAgIGlmIChwb3B1cC5jbG9zZWQgPT09IHRydWUpIHtcbiAgICAgIHBvcHVwcyA9IHBvcHVwcy5zbGljZShpLCAxKTtcbiAgICB9IGVsc2UgaWYgKHNvdXJjZSAhPT0gcG9wdXApIHtcbiAgICAgIF9icm9hZGNhc3QocG9wdXAudG9wLCBwYXlsb2FkLCBvcmlnaW4pO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBfc3Vic2NyaWJlUmVwbGllcihmbiwgb3JpZ2luKSB7XG4gIHZhciB1dWlkID0gX3V1aWQoKTtcblxuICBmdW5jdGlvbiByZXBsaWVyKGQsIG8pIHtcbiAgICBmbihkLCBvKTtcbiAgICBmcmFtZWJ1cy50YXJnZXQob3JpZ2luKS51bnN1YnNjcmliZSh1dWlkLCByZXBsaWVyKTtcbiAgfVxuXG4gIGZyYW1lYnVzLnRhcmdldChvcmlnaW4pLnN1YnNjcmliZSh1dWlkLCByZXBsaWVyKTtcbiAgcmV0dXJuIHV1aWQ7XG59XG5cbmZ1bmN0aW9uIF9zdWJzY3JpcHRpb25BcmdzSW52YWxpZChldmVudCwgZm4sIG9yaWdpbikge1xuICBpZiAoX2lzbnRTdHJpbmcoZXZlbnQpKSB7IHJldHVybiB0cnVlOyB9XG4gIGlmICh0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicpIHsgcmV0dXJuIHRydWU7IH1cbiAgaWYgKF9pc250U3RyaW5nKG9yaWdpbikpIHsgcmV0dXJuIHRydWU7IH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbl9hdHRhY2goKTtcblxuZnJhbWVidXMgPSB7XG4gIHRhcmdldDogdGFyZ2V0LFxuICAvLyByZW1vdmVJZihwcm9kdWN0aW9uKVxuICBfcGFja2FnZVBheWxvYWQ6IF9wYWNrYWdlUGF5bG9hZCxcbiAgX3VucGFja1BheWxvYWQ6IF91bnBhY2tQYXlsb2FkLFxuICBfYXR0YWNoOiBfYXR0YWNoLFxuICBfZGV0YWNoOiBfZGV0YWNoLFxuICBfZGlzcGF0Y2g6IF9kaXNwYXRjaCxcbiAgX2Jyb2FkY2FzdDogX2Jyb2FkY2FzdCxcbiAgX3N1YnNjcmliZVJlcGxpZXI6IF9zdWJzY3JpYmVSZXBsaWVyLFxuICBfc3Vic2NyaXB0aW9uQXJnc0ludmFsaWQ6IF9zdWJzY3JpcHRpb25BcmdzSW52YWxpZCxcbiAgX29ubWVzc2FnZTogX29ubWVzc2FnZSxcbiAgX3V1aWQ6IF91dWlkLFxuICBfZ2V0U3Vic2NyaWJlcnM6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHN1YnNjcmliZXJzOyB9LFxuICBfd2luOiBmdW5jdGlvbiAoKSB7IHJldHVybiB3aW47IH0sXG4gIC8vIGVuZFJlbW92ZUlmKHByb2R1Y3Rpb24pXG4gIGluY2x1ZGU6IGluY2x1ZGUsXG4gIHB1Ymxpc2g6IHB1Ymxpc2gsXG4gIHB1YjogcHVibGlzaCxcbiAgdHJpZ2dlcjogcHVibGlzaCxcbiAgZW1pdDogcHVibGlzaCxcbiAgc3Vic2NyaWJlOiBzdWJzY3JpYmUsXG4gIHN1Yjogc3Vic2NyaWJlLFxuICBvbjogc3Vic2NyaWJlLFxuICB1bnN1YnNjcmliZTogdW5zdWJzY3JpYmUsXG4gIHVuc3ViOiB1bnN1YnNjcmliZSxcbiAgb2ZmOiB1bnN1YnNjcmliZVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmcmFtZWJ1cztcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFNlYW1sZXNzcGF5RXJyb3IgPSByZXF1aXJlKCcuLi8uLi9saWIvc2VhbWxlc3NwYXktZXJyb3InKTtcbnZhciBlcnJvcnMgPSByZXF1aXJlKCcuLi9zaGFyZWQvZXJyb3JzJyk7XG52YXIgd2hpdGVsaXN0ID0gcmVxdWlyZSgnLi4vc2hhcmVkL2NvbnN0YW50cycpLndoaXRlbGlzdGVkQXR0cmlidXRlcztcblxuZnVuY3Rpb24gYXR0cmlidXRlVmFsaWRhdGlvbkVycm9yKGF0dHJpYnV0ZSwgdmFsdWUpIHtcbiAgdmFyIGVycjtcblxuICBpZiAoIXdoaXRlbGlzdC5oYXNPd25Qcm9wZXJ0eShhdHRyaWJ1dGUpKSB7XG4gICAgZXJyID0gbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgdHlwZTogZXJyb3JzLkNBUkRfRUxFTUVOVF9BVFRSSUJVVEVfTk9UX1NVUFBPUlRFRC50eXBlLFxuICAgICAgY29kZTogZXJyb3JzLkNBUkRfRUxFTUVOVF9BVFRSSUJVVEVfTk9UX1NVUFBPUlRFRC5jb2RlLFxuICAgICAgbWVzc2FnZTogJ1RoZSBcIicgKyBhdHRyaWJ1dGUgKyAnXCIgYXR0cmlidXRlIGlzIG5vdCBzdXBwb3J0ZWQgaW4gQ2FyZCBFbGVtZW50LidcbiAgICB9KTtcbiAgfSBlbHNlIGlmICh2YWx1ZSAhPSBudWxsICYmICFfaXNWYWxpZChhdHRyaWJ1dGUsIHZhbHVlKSkge1xuICAgIGVyciA9IG5ldyBTZWFtbGVzc3BheUVycm9yKHtcbiAgICAgIHR5cGU6IGVycm9ycy5DQVJEX0VMRU1FTlRfQVRUUklCVVRFX1ZBTFVFX05PVF9BTExPV0VELnR5cGUsXG4gICAgICBjb2RlOiBlcnJvcnMuQ0FSRF9FTEVNRU5UX0FUVFJJQlVURV9WQUxVRV9OT1RfQUxMT1dFRC5jb2RlLFxuICAgICAgbWVzc2FnZTogJ1ZhbHVlIFwiJyArIHZhbHVlICsgJ1wiIGlzIG5vdCBhbGxvd2VkIGZvciBcIicgKyBhdHRyaWJ1dGUgKyAnXCIgYXR0cmlidXRlLidcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBlcnI7XG59XG5cbmZ1bmN0aW9uIF9pc1ZhbGlkKGF0dHJpYnV0ZSwgdmFsdWUpIHtcbiAgaWYgKHdoaXRlbGlzdFthdHRyaWJ1dGVdID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcic7XG4gIH0gZWxzZSBpZiAod2hpdGVsaXN0W2F0dHJpYnV0ZV0gPT09ICdib29sZWFuJykge1xuICAgIHJldHVybiBTdHJpbmcodmFsdWUpID09PSAndHJ1ZScgfHwgU3RyaW5nKHZhbHVlKSA9PT0gJ2ZhbHNlJztcbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhdHRyaWJ1dGVWYWxpZGF0aW9uRXJyb3I7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBEZXN0cnVjdG9yID0gcmVxdWlyZSgnLi4vLi4vbGliL2Rlc3RydWN0b3InKTtcbnZhciBjbGFzc2xpc3QgPSByZXF1aXJlKCcuLi8uLi9saWIvY2xhc3NsaXN0Jyk7XG52YXIgaUZyYW1lciA9IHJlcXVpcmUoJ0BicmFpbnRyZWUvaWZyYW1lcicpO1xudmFyIEJ1cyA9IHJlcXVpcmUoJy4uLy4uL2xpYi9idXMnKTtcbnZhciBTZWFtbGVzc3BheUVycm9yID0gcmVxdWlyZSgnLi4vLi4vbGliL3NlYW1sZXNzcGF5LWVycm9yJyk7XG52YXIgY29tcG9zZVVybCA9IHJlcXVpcmUoJy4uLy4uL2xpYi9jb21wb3NlLXVybCcpO1xudmFyIGNvbnN0YW50cyA9IHJlcXVpcmUoJy4uL3NoYXJlZC9jb25zdGFudHMnKTtcbnZhciBlcnJvcnMgPSByZXF1aXJlKCcuLi9zaGFyZWQvZXJyb3JzJyk7XG52YXIgdXVpZCA9IHJlcXVpcmUoJy4uLy4uL2xpYi91dWlkJyk7XG52YXIgZXZlbnRzID0gY29uc3RhbnRzLmV2ZW50cztcbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCcuLi8uLi9saWIvZXZlbnQtZW1pdHRlcicpO1xudmFyIGluamVjdEZyYW1lID0gcmVxdWlyZSgnLi4vLi4vbGliL2luamVjdC1mcmFtZScpO1xudmFyIFZFUlNJT04gPSBcIndlYi1zZGtcIjtcbnZhciBtZXRob2RzID0gcmVxdWlyZSgnLi4vLi4vbGliL21ldGhvZHMnKTtcbnZhciBjb252ZXJ0TWV0aG9kc1RvRXJyb3IgPSByZXF1aXJlKCcuLi8uLi9saWIvY29udmVydC1tZXRob2RzLXRvLWVycm9yJyk7XG52YXIgZGVmZXJyZWQgPSByZXF1aXJlKCcuLi8uLi9saWIvZGVmZXJyZWQnKTtcbnZhciBzaGFyZWRFcnJvcnMgPSByZXF1aXJlKCcuLi8uLi9saWIvZXJyb3JzJyk7XG52YXIgZ2V0Q2FyZFR5cGVzID0gcmVxdWlyZSgnY3JlZGl0LWNhcmQtdHlwZScpO1xudmFyIGF0dHJpYnV0ZVZhbGlkYXRpb25FcnJvciA9IHJlcXVpcmUoJy4vYXR0cmlidXRlLXZhbGlkYXRpb24tZXJyb3InKTtcbnZhciBQcm9taXNlID0gcmVxdWlyZSgnLi4vLi4vbGliL3Byb21pc2UnKTtcbnZhciB3cmFwUHJvbWlzZSA9IHJlcXVpcmUoJ0BicmFpbnRyZWUvd3JhcC1wcm9taXNlJyk7XG5cbnZhciBhc3NpZ24gPSByZXF1aXJlKCcuLi8uLi9saWIvYXNzaWduJykuYXNzaWduO1xuXG52YXIgY2FyZEVsZW1lbnRGaWVsZHMgPSBbXG4gICdhY2NvdW50TnVtYmVyJyxcbiAgJ2V4cERhdGUnLFxuICAnY3Z2JyxcbiAgJ3Bvc3RhbENvZGUnXG5dO1xuXG4vKipcbiAqIEB0eXBlZGVmIHtvYmplY3R9IENhcmRFbGVtZW50fnRva2VuaXplUGF5bG9hZFxuICogQHByb3BlcnR5IHtzdHJpbmd9IG5vbmNlIFRoZSBwYXltZW50IG1ldGhvZCBub25jZS5cbiAqIEBwcm9wZXJ0eSB7b2JqZWN0fSBkZXRhaWxzIEFkZGl0aW9uYWwgYWNjb3VudCBkZXRhaWxzLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IGRldGFpbHMuY2FyZFR5cGUgVHlwZSBvZiBjYXJkLCBleDogVmlzYSwgTWFzdGVyQ2FyZC5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBkZXRhaWxzLmxhc3RUd28gTGFzdCB0d28gZGlnaXRzIG9mIGNhcmQgbnVtYmVyLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IGRlc2NyaXB0aW9uIEEgaHVtYW4tcmVhZGFibGUgZGVzY3JpcHRpb24uXG4gKiBAcHJvcGVydHkge3N0cmluZ30gdHlwZSBUaGUgcGF5bWVudCBtZXRob2QgdHlwZSwgYWx3YXlzIGBDcmVkaXRDYXJkYC5cbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtvYmplY3R9IENhcmRFbGVtZW50fnN0YXRlT2JqZWN0XG4gKiBAZGVzY3JpcHRpb24gVGhlIGV2ZW50IHBheWxvYWQgc2VudCBmcm9tIHtAbGluayBDYXJkRWxlbWVudCNvbnxvbn0gb3Ige0BsaW5rIENhcmRFbGVtZW50I2dldFN0YXRlfGdldFN0YXRlfS5cbiAqIEBwcm9wZXJ0eSB7Q2FyZEVsZW1lbnR+Q2FyZEVsZW1lbnRDYXJkW119IGNhcmRzXG4gKiBUaGlzIHdpbGwgcmV0dXJuIGFuIGFycmF5IG9mIHBvdGVudGlhbCB7QGxpbmsgQ2FyZEVsZW1lbnR+Q2FyZEVsZW1lbnRDYXJkfGNhcmRzfS4gSWYgdGhlIGNhcmQgdHlwZSBoYXMgYmVlbiBkZXRlcm1pbmVkLCB0aGUgYXJyYXkgd2lsbCBjb250YWluIG9ubHkgb25lIGNhcmQuXG4gKiBJbnRlcm5hbGx5LCBDYXJkIEVsZW1lbnQgdXNlcyA8YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL3NlYW1sZXNzcGF5L2NyZWRpdC1jYXJkLXR5cGVcIj5jcmVkaXQtY2FyZC10eXBlPC9hPixcbiAqIGFuIG9wZW4tc291cmNlIGNhcmQgZGV0ZWN0aW9uIGxpYnJhcnkuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gZW1pdHRlZEJ5XG4gKiBUaGUgbmFtZSBvZiB0aGUgZmllbGQgYXNzb2NpYXRlZCB3aXRoIGFuIGV2ZW50LiBUaGlzIHdpbGwgbm90IGJlIGluY2x1ZGVkIGlmIHJldHVybmVkIGJ5IHtAbGluayBDYXJkRWxlbWVudCNnZXRTdGF0ZXxnZXRTdGF0ZX0uIEl0IHdpbGwgYmUgb25lIG9mIHRoZSBmb2xsb3dpbmcgc3RyaW5nczo8YnI+XG4gKiAtIGBcIm51bWJlclwiYFxuICogLSBgXCJjdnZcImBcbiAqIC0gYFwiZXhwRGF0ZVwiYFxuICogLSBgXCJleHBpcmF0aW9uTW9udGhcImBcbiAqIC0gYFwiZXhwaXJhdGlvblllYXJcImBcbiAqIC0gYFwicG9zdGFsQ29kZVwiYFxuICogQHByb3BlcnR5IHtvYmplY3R9IGZpZWxkc1xuICogQHByb3BlcnR5IHs/Q2FyZEVsZW1lbnR+Q2FyZEVsZW1lbnRGaWVsZERhdGF9IGZpZWxkcy5udW1iZXIge0BsaW5rIENhcmRFbGVtZW50fkNhcmRFbGVtZW50RmllbGREYXRhfENhcmRFbGVtZW50RmllbGREYXRhfSBmb3IgdGhlIG51bWJlciBmaWVsZCwgaWYgaXQgaXMgcHJlc2VudC5cbiAqIEBwcm9wZXJ0eSB7P0NhcmRFbGVtZW50fkNhcmRFbGVtZW50RmllbGREYXRhfSBmaWVsZHMuY3Z2IHtAbGluayBDYXJkRWxlbWVudH5DYXJkRWxlbWVudEZpZWxkRGF0YXxDYXJkRWxlbWVudEZpZWxkRGF0YX0gZm9yIHRoZSBDVlYgZmllbGQsIGlmIGl0IGlzIHByZXNlbnQuXG4gKiBAcHJvcGVydHkgez9DYXJkRWxlbWVudH5DYXJkRWxlbWVudEZpZWxkRGF0YX0gZmllbGRzLmV4cERhdGUge0BsaW5rIENhcmRFbGVtZW50fkNhcmRFbGVtZW50RmllbGREYXRhfENhcmRFbGVtZW50RmllbGREYXRhfSBmb3IgdGhlIGV4cGlyYXRpb24gZGF0ZSBmaWVsZCwgaWYgaXQgaXMgcHJlc2VudC5cbiAqIEBwcm9wZXJ0eSB7P0NhcmRFbGVtZW50fkNhcmRFbGVtZW50RmllbGREYXRhfSBmaWVsZHMuZXhwaXJhdGlvbk1vbnRoIHtAbGluayBDYXJkRWxlbWVudH5DYXJkRWxlbWVudEZpZWxkRGF0YXxDYXJkRWxlbWVudEZpZWxkRGF0YX0gZm9yIHRoZSBleHBpcmF0aW9uIG1vbnRoIGZpZWxkLCBpZiBpdCBpcyBwcmVzZW50LlxuICogQHByb3BlcnR5IHs/Q2FyZEVsZW1lbnR+Q2FyZEVsZW1lbnRGaWVsZERhdGF9IGZpZWxkcy5leHBpcmF0aW9uWWVhciB7QGxpbmsgQ2FyZEVsZW1lbnR+Q2FyZEVsZW1lbnRGaWVsZERhdGF8Q2FyZEVsZW1lbnRGaWVsZERhdGF9IGZvciB0aGUgZXhwaXJhdGlvbiB5ZWFyIGZpZWxkLCBpZiBpdCBpcyBwcmVzZW50LlxuICogQHByb3BlcnR5IHs/Q2FyZEVsZW1lbnR+Q2FyZEVsZW1lbnRGaWVsZERhdGF9IGZpZWxkcy5wb3N0YWxDb2RlIHtAbGluayBDYXJkRWxlbWVudH5DYXJkRWxlbWVudEZpZWxkRGF0YXxDYXJkRWxlbWVudEZpZWxkRGF0YX0gZm9yIHRoZSBwb3N0YWwgY29kZSBmaWVsZCwgaWYgaXQgaXMgcHJlc2VudC5cbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtvYmplY3R9IENhcmRFbGVtZW50fkNhcmRFbGVtZW50RmllbGREYXRhXG4gKiBAZGVzY3JpcHRpb24gRGF0YSBhYm91dCBDYXJkIEVsZW1lbnQgZmllbGRzLCBzZW50IGluIHtAbGluayBDYXJkRWxlbWVudH5zdGF0ZU9iamVjdHxzdGF0ZU9iamVjdHN9LlxuICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gY29udGFpbmVyIFJlZmVyZW5jZSB0byB0aGUgY29udGFpbmVyIERPTSBlbGVtZW50IG9uIHlvdXIgcGFnZSBhc3NvY2lhdGVkIHdpdGggdGhlIGN1cnJlbnQgZXZlbnQuXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IGlzRm9jdXNlZCBXaGV0aGVyIG9yIG5vdCB0aGUgaW5wdXQgaXMgY3VycmVudGx5IGZvY3VzZWQuXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IGlzRW1wdHkgV2hldGhlciBvciBub3QgdGhlIHVzZXIgaGFzIGVudGVyZWQgYSB2YWx1ZSBpbiB0aGUgaW5wdXQuXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IGlzUG90ZW50aWFsbHlWYWxpZFxuICogQSBkZXRlcm1pbmF0aW9uIGJhc2VkIG9uIHRoZSBmdXR1cmUgdmFsaWRpdHkgb2YgdGhlIGlucHV0IHZhbHVlLlxuICogVGhpcyBpcyBoZWxwZnVsIHdoZW4gYSB1c2VyIGlzIGVudGVyaW5nIGEgY2FyZCBudW1iZXIgYW5kIHR5cGVzIDxjb2RlPlwiNDFcIjwvY29kZT4uXG4gKiBXaGlsZSB0aGF0IHZhbHVlIGlzIG5vdCB2YWxpZCBmb3Igc3VibWlzc2lvbiwgaXQgaXMgc3RpbGwgcG9zc2libGUgZm9yXG4gKiBpdCB0byBiZWNvbWUgYSBmdWxseSBxdWFsaWZpZWQgZW50cnkuIEhvd2V2ZXIsIGlmIHRoZSB1c2VyIGVudGVycyA8Y29kZT5cIjR4XCI8L2NvZGU+XG4gKiBpdCBpcyBjbGVhciB0aGF0IHRoZSBjYXJkIG51bWJlciBjYW4gbmV2ZXIgYmVjb21lIHZhbGlkIGFuZCBpc1BvdGVudGlhbGx5VmFsaWQgd2lsbFxuICogcmV0dXJuIGZhbHNlLlxuICogQHByb3BlcnR5IHtib29sZWFufSBpc1ZhbGlkIFdoZXRoZXIgb3Igbm90IHRoZSB2YWx1ZSBvZiB0aGUgYXNzb2NpYXRlZCBpbnB1dCBpcyA8aT5mdWxseTwvaT4gcXVhbGlmaWVkIGZvciBzdWJtaXNzaW9uLlxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge29iamVjdH0gQ2FyZEVsZW1lbnR+Q2FyZEVsZW1lbnRDYXJkXG4gKiBAZGVzY3JpcHRpb24gSW5mb3JtYXRpb24gYWJvdXQgdGhlIGNhcmQgdHlwZSwgc2VudCBpbiB7QGxpbmsgQ2FyZEVsZW1lbnR+c3RhdGVPYmplY3R8c3RhdGVPYmplY3RzfS5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB0eXBlIFRoZSBjb2RlLWZyaWVuZGx5IHJlcHJlc2VudGF0aW9uIG9mIHRoZSBjYXJkIHR5cGUuIEl0IHdpbGwgYmUgb25lIG9mIHRoZSBmb2xsb3dpbmcgc3RyaW5nczpcbiAqIC0gYGFtZXJpY2FuLWV4cHJlc3NgXG4gKiAtIGBkaW5lcnMtY2x1YmBcbiAqIC0gYGRpc2NvdmVyYFxuICogLSBgamNiYFxuICogLSBgbWFlc3Ryb2BcbiAqIC0gYG1hc3Rlci1jYXJkYFxuICogLSBgdW5pb25wYXlgXG4gKiAtIGB2aXNhYFxuICogQHByb3BlcnR5IHtzdHJpbmd9IG5pY2VUeXBlIFRoZSBwcmV0dHktcHJpbnRlZCBjYXJkIHR5cGUuIEl0IHdpbGwgYmUgb25lIG9mIHRoZSBmb2xsb3dpbmcgc3RyaW5nczpcbiAqIC0gYEFtZXJpY2FuIEV4cHJlc3NgXG4gKiAtIGBEaW5lcnMgQ2x1YmBcbiAqIC0gYERpc2NvdmVyYFxuICogLSBgSkNCYFxuICogLSBgTWFlc3Ryb2BcbiAqIC0gYE1hc3RlckNhcmRgXG4gKiAtIGBVbmlvblBheWBcbiAqIC0gYFZpc2FgXG4gKiBAcHJvcGVydHkge29iamVjdH0gY29kZVxuICogVGhpcyBvYmplY3QgY29udGFpbnMgZGF0YSByZWxldmFudCB0byB0aGUgc2VjdXJpdHkgY29kZSByZXF1aXJlbWVudHMgb2YgdGhlIGNhcmQgYnJhbmQuXG4gKiBGb3IgZXhhbXBsZSwgb24gYSBWaXNhIGNhcmQgdGhlcmUgd2lsbCBiZSBhIDxjb2RlPkNWVjwvY29kZT4gb2YgMyBkaWdpdHMsIHdoZXJlYXMgYW5cbiAqIEFtZXJpY2FuIEV4cHJlc3MgY2FyZCByZXF1aXJlcyBhIDQtZGlnaXQgPGNvZGU+Q0lEPC9jb2RlPi5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBjb2RlLm5hbWUgPGNvZGU+XCJDVlZcIjwvY29kZT4gPGNvZGU+XCJDSURcIjwvY29kZT4gPGNvZGU+XCJDVkNcIjwvY29kZT5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBjb2RlLnNpemUgVGhlIGV4cGVjdGVkIGxlbmd0aCBvZiB0aGUgc2VjdXJpdHkgY29kZS4gVHlwaWNhbGx5LCB0aGlzIGlzIDMgb3IgNC5cbiAqL1xuXG4vKipcbiAqIEBuYW1lIENhcmRFbGVtZW50I29uXG4gKiBAZnVuY3Rpb25cbiAqIEBwYXJhbSB7c3RyaW5nfSBldmVudCBUaGUgbmFtZSBvZiB0aGUgZXZlbnQgdG8gd2hpY2ggeW91IGFyZSBzdWJzY3JpYmluZy5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGhhbmRsZXIgQSBjYWxsYmFjayB0byBoYW5kbGUgdGhlIGV2ZW50LlxuICogQGRlc2NyaXB0aW9uIFN1YnNjcmliZXMgYSBoYW5kbGVyIGZ1bmN0aW9uIHRvIGEgbmFtZWQgZXZlbnQuIGBldmVudGAgc2hvdWxkIGJlIHtAbGluayBDYXJkRWxlbWVudCNldmVudDpibHVyfGJsdXJ9LCB7QGxpbmsgQ2FyZEVsZW1lbnQjZXZlbnQ6Zm9jdXN8Zm9jdXN9LCB7QGxpbmsgQ2FyZEVsZW1lbnQjZXZlbnQ6ZW1wdHl8ZW1wdHl9LCB7QGxpbmsgQ2FyZEVsZW1lbnQjZXZlbnQ6bm90RW1wdHl8bm90RW1wdHl9LCB7QGxpbmsgQ2FyZEVsZW1lbnQjZXZlbnQ6Y2FyZFR5cGVDaGFuZ2V8Y2FyZFR5cGVDaGFuZ2V9LCBvciB7QGxpbmsgQ2FyZEVsZW1lbnQjZXZlbnQ6dmFsaWRpdHlDaGFuZ2V8dmFsaWRpdHlDaGFuZ2V9LiBFdmVudHMgd2lsbCBlbWl0IGEge0BsaW5rIENhcmRFbGVtZW50fnN0YXRlT2JqZWN0fHN0YXRlT2JqZWN0fS5cbiAqIEBleGFtcGxlXG4gKiA8Y2FwdGlvbj5MaXN0ZW5pbmcgdG8gYSBDYXJkIEVsZW1lbnQgZXZlbnQsIGluIHRoaXMgY2FzZSAnZm9jdXMnPC9jYXB0aW9uPlxuICogQ2FyZEVsZW1lbnQuY3JlYXRlKHsgLi4uIH0sIGZ1bmN0aW9uIChjcmVhdGVFcnIsIENhcmRFbGVtZW50SW5zdGFuY2UpIHtcbiAqICAgQ2FyZEVsZW1lbnRJbnN0YW5jZS5vbignZm9jdXMnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAqICAgICBjb25zb2xlLmxvZyhldmVudC5lbWl0dGVkQnksICdoYXMgYmVlbiBmb2N1c2VkJyk7XG4gKiAgIH0pO1xuICogfSk7XG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuXG4vKipcbiAqIFRoaXMgZXZlbnQgaXMgZW1pdHRlZCB3aGVuIHRoZSB1c2VyIHJlcXVlc3RzIHN1Ym1pc3Npb24gb2YgYW4gaW5wdXQgZmllbGQsIHN1Y2ggYXMgYnkgcHJlc3NpbmcgdGhlIEVudGVyIG9yIFJldHVybiBrZXkgb24gdGhlaXIga2V5Ym9hcmQsIG9yIG1vYmlsZSBlcXVpdmFsZW50LlxuICogQGV2ZW50IENhcmRFbGVtZW50I2lucHV0U3VibWl0UmVxdWVzdFxuICogQHR5cGUge0NhcmRFbGVtZW50fnN0YXRlT2JqZWN0fVxuICogQGV4YW1wbGVcbiAqIDxjYXB0aW9uPkNsaWNraW5nIGEgc3VibWl0IGJ1dHRvbiB1cG9uIGhpdHRpbmcgRW50ZXIgKG9yIGVxdWl2YWxlbnQpIHdpdGhpbiBhIENhcmQgRWxlbWVudDwvY2FwdGlvbj5cbiAqIHZhciBDYXJkRWxlbWVudCA9IHJlcXVpcmUoJ3NlYW1sZXNzcGF5LXdlYi9jYXJkLWVsZW1lbnQnKTtcbiAqIHZhciBzdWJtaXRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dFt0eXBlPVwic3VibWl0XCJdJyk7XG4gKlxuICogQ2FyZEVsZW1lbnQuY3JlYXRlKHsgLi4uIH0sIGZ1bmN0aW9uIChjcmVhdGVFcnIsIENhcmRFbGVtZW50SW5zdGFuY2UpIHtcbiAqICAgQ2FyZEVsZW1lbnRJbnN0YW5jZS5vbignaW5wdXRTdWJtaXRSZXF1ZXN0JywgZnVuY3Rpb24gKCkge1xuICogICAgIC8vIFVzZXIgcmVxdWVzdGVkIHN1Ym1pc3Npb24sIGUuZy4gYnkgcHJlc3NpbmcgRW50ZXIgb3IgZXF1aXZhbGVudFxuICogICAgIHN1Ym1pdEJ1dHRvbi5jbGljaygpO1xuICogICB9KTtcbiAqIH0pO1xuICovXG5cbi8qKlxuICogVGhpcyBldmVudCBpcyBlbWl0dGVkIHdoZW4gYSBmaWVsZCB0cmFuc2l0aW9ucyBmcm9tIGhhdmluZyBkYXRhIHRvIGJlaW5nIGVtcHR5LlxuICogQGV2ZW50IENhcmRFbGVtZW50I2VtcHR5XG4gKiBAdHlwZSB7Q2FyZEVsZW1lbnR+c3RhdGVPYmplY3R9XG4gKiBAZXhhbXBsZVxuICogPGNhcHRpb24+TGlzdGVuaW5nIHRvIGFuIGVtcHR5IGV2ZW50PC9jYXB0aW9uPlxuICogQ2FyZEVsZW1lbnQuY3JlYXRlKHsgLi4uIH0sIGZ1bmN0aW9uIChjcmVhdGVFcnIsIENhcmRFbGVtZW50SW5zdGFuY2UpIHtcbiAqICAgQ2FyZEVsZW1lbnRJbnN0YW5jZS5vbignZW1wdHknLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAqICAgICBjb25zb2xlLmxvZyhldmVudC5lbWl0dGVkQnksICdpcyBub3cgZW1wdHknKTtcbiAqICAgfSk7XG4gKiB9KTtcbiAqL1xuXG4vKipcbiAqIFRoaXMgZXZlbnQgaXMgZW1pdHRlZCB3aGVuIGEgZmllbGQgdHJhbnNpdGlvbnMgZnJvbSBiZWluZyBlbXB0eSB0byBoYXZpbmcgZGF0YS5cbiAqIEBldmVudCBDYXJkRWxlbWVudCNub3RFbXB0eVxuICogQHR5cGUge0NhcmRFbGVtZW50fnN0YXRlT2JqZWN0fVxuICogQGV4YW1wbGVcbiAqIDxjYXB0aW9uPkxpc3RlbmluZyB0byBhbiBub3RFbXB0eSBldmVudDwvY2FwdGlvbj5cbiAqIENhcmRFbGVtZW50LmNyZWF0ZSh7IC4uLiB9LCBmdW5jdGlvbiAoY3JlYXRlRXJyLCBDYXJkRWxlbWVudEluc3RhbmNlKSB7XG4gKiAgIENhcmRFbGVtZW50SW5zdGFuY2Uub24oJ25vdEVtcHR5JywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gKiAgICAgY29uc29sZS5sb2coZXZlbnQuZW1pdHRlZEJ5LCAnaXMgbm93IG5vdCBlbXB0eScpO1xuICogICB9KTtcbiAqIH0pO1xuICovXG5cbi8qKlxuICogVGhpcyBldmVudCBpcyBlbWl0dGVkIHdoZW4gYSBmaWVsZCBsb3NlcyBmb2N1cy5cbiAqIEBldmVudCBDYXJkRWxlbWVudCNibHVyXG4gKiBAdHlwZSB7Q2FyZEVsZW1lbnR+c3RhdGVPYmplY3R9XG4gKiBAZXhhbXBsZVxuICogPGNhcHRpb24+TGlzdGVuaW5nIHRvIGEgYmx1ciBldmVudDwvY2FwdGlvbj5cbiAqIENhcmRFbGVtZW50LmNyZWF0ZSh7IC4uLiB9LCBmdW5jdGlvbiAoY3JlYXRlRXJyLCBDYXJkRWxlbWVudEluc3RhbmNlKSB7XG4gKiAgIENhcmRFbGVtZW50SW5zdGFuY2Uub24oJ2JsdXInLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAqICAgICBjb25zb2xlLmxvZyhldmVudC5lbWl0dGVkQnksICdsb3N0IGZvY3VzJyk7XG4gKiAgIH0pO1xuICogfSk7XG4gKi9cblxuLyoqXG4gKiBUaGlzIGV2ZW50IGlzIGVtaXR0ZWQgd2hlbiBhIGZpZWxkIGdhaW5zIGZvY3VzLlxuICogQGV2ZW50IENhcmRFbGVtZW50I2ZvY3VzXG4gKiBAdHlwZSB7Q2FyZEVsZW1lbnR+c3RhdGVPYmplY3R9XG4gKiBAZXhhbXBsZVxuICogPGNhcHRpb24+TGlzdGVuaW5nIHRvIGEgZm9jdXMgZXZlbnQ8L2NhcHRpb24+XG4gKiBDYXJkRWxlbWVudC5jcmVhdGUoeyAuLi4gfSwgZnVuY3Rpb24gKGNyZWF0ZUVyciwgQ2FyZEVsZW1lbnRJbnN0YW5jZSkge1xuICogICBDYXJkRWxlbWVudEluc3RhbmNlLm9uKCdmb2N1cycsIGZ1bmN0aW9uIChldmVudCkge1xuICogICAgIGNvbnNvbGUubG9nKGV2ZW50LmVtaXR0ZWRCeSwgJ2dhaW5lZCBmb2N1cycpO1xuICogICB9KTtcbiAqIH0pO1xuICovXG5cbi8qKlxuICogVGhpcyBldmVudCBpcyBlbWl0dGVkIHdoZW4gYWN0aXZpdHkgd2l0aGluIHRoZSBudW1iZXIgZmllbGQgaGFzIGNoYW5nZWQgc3VjaCB0aGF0IHRoZSBwb3NzaWJsZSBjYXJkIHR5cGUgaGFzIGNoYW5nZWQuXG4gKiBAZXZlbnQgQ2FyZEVsZW1lbnQjY2FyZFR5cGVDaGFuZ2VcbiAqIEB0eXBlIHtDYXJkRWxlbWVudH5zdGF0ZU9iamVjdH1cbiAqIEBleGFtcGxlXG4gKiA8Y2FwdGlvbj5MaXN0ZW5pbmcgdG8gYSBjYXJkVHlwZUNoYW5nZSBldmVudDwvY2FwdGlvbj5cbiAqIENhcmRFbGVtZW50LmNyZWF0ZSh7IC4uLiB9LCBmdW5jdGlvbiAoY3JlYXRlRXJyLCBDYXJkRWxlbWVudEluc3RhbmNlKSB7XG4gKiAgIENhcmRFbGVtZW50SW5zdGFuY2Uub24oJ2NhcmRUeXBlQ2hhbmdlJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gKiAgICAgaWYgKGV2ZW50LmNhcmRzLmxlbmd0aCA9PT0gMSkge1xuICogICAgICAgY29uc29sZS5sb2coZXZlbnQuY2FyZHNbMF0udHlwZSk7XG4gKiAgICAgfSBlbHNlIHtcbiAqICAgICAgIGNvbnNvbGUubG9nKCdUeXBlIG9mIGNhcmQgbm90IHlldCBrbm93bicpO1xuICogICAgIH1cbiAqICAgfSk7XG4gKiB9KTtcbiAqL1xuXG4vKipcbiAqIFRoaXMgZXZlbnQgaXMgZW1pdHRlZCB3aGVuIHRoZSB2YWxpZGl0eSBvZiBhIGZpZWxkIGhhcyBjaGFuZ2VkLiBWYWxpZGl0eSBpcyByZXByZXNlbnRlZCBpbiB0aGUge0BsaW5rIENhcmRFbGVtZW50fnN0YXRlT2JqZWN0fHN0YXRlT2JqZWN0fSBhcyB0d28gYm9vbGVhbnM6IGBpc1ZhbGlkYCBhbmQgYGlzUG90ZW50aWFsbHlWYWxpZGAuXG4gKiBAZXZlbnQgQ2FyZEVsZW1lbnQjdmFsaWRpdHlDaGFuZ2VcbiAqIEB0eXBlIHtDYXJkRWxlbWVudH5zdGF0ZU9iamVjdH1cbiAqIEBleGFtcGxlXG4gKiA8Y2FwdGlvbj5MaXN0ZW5pbmcgdG8gYSB2YWxpZGl0eUNoYW5nZSBldmVudDwvY2FwdGlvbj5cbiAqIENhcmRFbGVtZW50LmNyZWF0ZSh7IC4uLiB9LCBmdW5jdGlvbiAoY3JlYXRlRXJyLCBDYXJkRWxlbWVudEluc3RhbmNlKSB7XG4gKiAgIENhcmRFbGVtZW50SW5zdGFuY2Uub24oJ3ZhbGlkaXR5Q2hhbmdlJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gKiAgICAgdmFyIGZpZWxkID0gZXZlbnQuZmllbGRzW2V2ZW50LmVtaXR0ZWRCeV07XG4gKlxuICogICAgIGlmIChmaWVsZC5pc1ZhbGlkKSB7XG4gKiAgICAgICBjb25zb2xlLmxvZyhldmVudC5lbWl0dGVkQnksICdpcyBmdWxseSB2YWxpZCcpO1xuICogICAgIH0gZWxzZSBpZiAoZmllbGQuaXNQb3RlbnRpYWxseVZhbGlkKSB7XG4gKiAgICAgICBjb25zb2xlLmxvZyhldmVudC5lbWl0dGVkQnksICdpcyBwb3RlbnRpYWxseSB2YWxpZCcpO1xuICogICAgIH0gZWxzZSB7XG4gKiAgICAgICBjb25zb2xlLmxvZyhldmVudC5lbWl0dGVkQnksICdpcyBub3QgdmFsaWQnKTtcbiAqICAgICB9XG4gKiAgIH0pO1xuICogfSk7XG4gKi9cblxuZnVuY3Rpb24gY3JlYXRlSW5wdXRFdmVudEhhbmRsZXIoY2FyZEVsZW1lbnRDb250YWluZXIpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChldmVudERhdGEpIHtcbiAgICB2YXIgZmllbGQ7XG4gICAgdmFyIG1lcmNoYW50UGF5bG9hZCA9IGV2ZW50RGF0YS5tZXJjaGFudFBheWxvYWQ7XG4gICAgdmFyIGVtaXR0ZWRCeSA9IG1lcmNoYW50UGF5bG9hZC5lbWl0dGVkQnk7XG5cbiAgICBmaWVsZCA9IG1lcmNoYW50UGF5bG9hZC5maWVsZHNbZW1pdHRlZEJ5XTtcblxuICAgIGNsYXNzbGlzdC50b2dnbGUoY2FyZEVsZW1lbnRDb250YWluZXIsIGNvbnN0YW50cy5leHRlcm5hbENsYXNzZXMuVkFMSUQsIGZpZWxkLmlzVmFsaWQpOyAvLyBAVE9ETzogbWFrZSB2YWxpZCBjbGFzcyBpZiBhbGwgZmllbGRzIGFyZSB2YWxpZFxuICAgIGNsYXNzbGlzdC50b2dnbGUoY2FyZEVsZW1lbnRDb250YWluZXIsIGNvbnN0YW50cy5leHRlcm5hbENsYXNzZXMuSU5WQUxJRCwgIWZpZWxkLmlzUG90ZW50aWFsbHlWYWxpZCk7IC8vIEBUT0RPOiBtYWtlIGludmFsaWQgY2xhc3MgaWYgc29tZSBmaWVsZCBpbnZhbGlkXG5cbiAgICB0aGlzLl9zdGF0ZSA9IHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1pbnZhbGlkLXRoaXNcbiAgICAgIGNhcmRzOiBtZXJjaGFudFBheWxvYWQuY2FyZHMsXG4gICAgICBmaWVsZHM6IG1lcmNoYW50UGF5bG9hZC5maWVsZHNcbiAgICB9O1xuXG4gICAgdGhpcy5fZW1pdChldmVudERhdGEudHlwZSwgbWVyY2hhbnRQYXlsb2FkKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1pbnZhbGlkLXRoaXNcbiAgfTtcbn1cblxuLyoqXG4gKiBAY2xhc3MgQ2FyZEVsZW1lbnRcbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIFRoZSBDYXJkIEVsZW1lbnQge0BsaW5rIG1vZHVsZTpzZWFtbGVzc3BheS13ZWIvY2FyZC1lbGVtZW50LmNyZWF0ZSBjcmVhdGV9IG9wdGlvbnMuXG4gKiBAZGVzY3JpcHRpb24gPHN0cm9uZz5EbyBub3QgdXNlIHRoaXMgY29uc3RydWN0b3IgZGlyZWN0bHkuIFVzZSB7QGxpbmsgbW9kdWxlOnNlYW1sZXNzcGF5LXdlYi9jYXJkLWVsZW1lbnQuY3JlYXRlfHNlYW1sZXNzcGF5LXdlYi5jYXJkLWVsZW1lbnQuY3JlYXRlfSBpbnN0ZWFkLjwvc3Ryb25nPlxuICogQGNsYXNzZGVzYyBUaGlzIGNsYXNzIHJlcHJlc2VudHMgYSBDYXJkIEVsZW1lbnQgY29tcG9uZW50IHByb2R1Y2VkIGJ5IHtAbGluayBtb2R1bGU6c2VhbWxlc3NwYXktd2ViL2NhcmQtZWxlbWVudC5jcmVhdGV8c2VhbWxlc3NwYXktd2ViL2NhcmQtZWxlbWVudC5jcmVhdGV9LiBJbnN0YW5jZXMgb2YgdGhpcyBjbGFzcyBoYXZlIG1ldGhvZHMgZm9yIGludGVyYWN0aW5nIHdpdGggdGhlIGlucHV0IGZpZWxkcyB3aXRoaW4gQ2FyZCBFbGVtZW50JyBpZnJhbWVzLlxuICovXG5mdW5jdGlvbiBDYXJkRWxlbWVudChvcHRpb25zKSB7XG4gIHZhciBjbGllbnRWZXJzaW9uLCBjbGllbnRDb25maWc7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIGNvbXBvbmVudElkID0gdXVpZCgpO1xuXG4gIGlmICghb3B0aW9ucy5jbGllbnQpIHtcbiAgICB0aHJvdyBuZXcgU2VhbWxlc3NwYXlFcnJvcih7XG4gICAgICB0eXBlOiBzaGFyZWRFcnJvcnMuSU5TVEFOVElBVElPTl9PUFRJT05fUkVRVUlSRUQudHlwZSxcbiAgICAgIGNvZGU6IHNoYXJlZEVycm9ycy5JTlNUQU5USUFUSU9OX09QVElPTl9SRVFVSVJFRC5jb2RlLFxuICAgICAgbWVzc2FnZTogJ29wdGlvbnMuY2xpZW50IGlzIHJlcXVpcmVkIHdoZW4gaW5zdGFudGlhdGluZyBDYXJkIEVsZW1lbnQuJ1xuICAgIH0pO1xuICB9XG5cbiAgY2xpZW50Q29uZmlnID0gb3B0aW9ucy5jbGllbnQuZ2V0Q29uZmlndXJhdGlvbigpO1xuICBjbGllbnRWZXJzaW9uID0gY2xpZW50Q29uZmlnLmFuYWx5dGljc01ldGFkYXRhLnNka1ZlcnNpb247XG4gIGlmIChjbGllbnRWZXJzaW9uICE9PSBWRVJTSU9OKSB7XG4gICAgdGhyb3cgbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgdHlwZTogc2hhcmVkRXJyb3JzLklOQ09NUEFUSUJMRV9WRVJTSU9OUy50eXBlLFxuICAgICAgY29kZTogc2hhcmVkRXJyb3JzLklOQ09NUEFUSUJMRV9WRVJTSU9OUy5jb2RlLFxuICAgICAgbWVzc2FnZTogJ0NsaWVudCAodmVyc2lvbiAnICsgY2xpZW50VmVyc2lvbiArICcpIGFuZCBDYXJkIEVsZW1lbnQgKHZlcnNpb24gJyArIFZFUlNJT04gKyAnKSBjb21wb25lbnRzIG11c3QgYmUgZnJvbSB0aGUgc2FtZSBTREsgdmVyc2lvbi4nXG4gICAgfSk7XG4gIH1cblxuICBpZiAoIW9wdGlvbnMuc2VsZWN0b3IpIHtcbiAgICB0aHJvdyBuZXcgU2VhbWxlc3NwYXlFcnJvcih7XG4gICAgICB0eXBlOiBzaGFyZWRFcnJvcnMuSU5TVEFOVElBVElPTl9PUFRJT05fUkVRVUlSRUQudHlwZSxcbiAgICAgIGNvZGU6IHNoYXJlZEVycm9ycy5JTlNUQU5USUFUSU9OX09QVElPTl9SRVFVSVJFRC5jb2RlLFxuICAgICAgbWVzc2FnZTogJ29wdGlvbnMuc2VsZWN0b3IgaXMgcmVxdWlyZWQgd2hlbiBpbnN0YW50aWF0aW5nIENhcmQgRWxlbWVudC4nXG4gICAgfSk7XG4gIH1cblxuICBFdmVudEVtaXR0ZXIuY2FsbCh0aGlzKTtcblxuICB0aGlzLl9pbmplY3RlZE5vZGVzID0gbnVsbDtcbiAgdGhpcy5fZGVzdHJ1Y3RvciA9IG5ldyBEZXN0cnVjdG9yKCk7XG4gIHRoaXMuX3N0YXRlID0ge1xuICAgIGZpZWxkczoge30sXG4gICAgY2FyZHM6IGdldENhcmRUeXBlcygnJylcbiAgfTtcblxuICB0aGlzLl9idXMgPSBuZXcgQnVzKHtcbiAgICBjaGFubmVsOiBjb21wb25lbnRJZCxcbiAgICBtZXJjaGFudFVybDogbG9jYXRpb24uaHJlZlxuICB9KTtcblxuICB0aGlzLl9kZXN0cnVjdG9yLnJlZ2lzdGVyRnVuY3Rpb25Gb3JUZWFyZG93bihcbiAgICBmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLl9idXMudGVhcmRvd24oKTtcbiAgICB9XG4gICk7XG5cbiAgdGhpcy5fY2xpZW50ID0gb3B0aW9ucy5jbGllbnQ7XG5cbiAgdmFyIGNvbnRhaW5lciwgZnJhbWU7XG5cbiAgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihvcHRpb25zLnNlbGVjdG9yKTtcblxuICBpZiAoIWNvbnRhaW5lcikge1xuICAgIHRocm93IG5ldyBTZWFtbGVzc3BheUVycm9yKHtcbiAgICAgIHR5cGU6IGVycm9ycy5DQVJEX0VMRU1FTlRfSU5WQUxJRF9GSUVMRF9TRUxFQ1RPUi50eXBlLFxuICAgICAgY29kZTogZXJyb3JzLkNBUkRfRUxFTUVOVF9JTlZBTElEX0ZJRUxEX1NFTEVDVE9SLmNvZGUsXG4gICAgICBtZXNzYWdlOiBlcnJvcnMuQ0FSRF9FTEVNRU5UX0lOVkFMSURfRklFTERfU0VMRUNUT1IubWVzc2FnZSxcbiAgICAgIGRldGFpbHM6IHsgZmllbGRTZWxlY3Rvcjogb3B0aW9ucy5zZWxlY3RvciB9XG4gICAgfSk7XG4gIH1cblxuICBmcmFtZSA9IGlGcmFtZXIoe1xuICAgIHR5cGU6ICdjYXJkLWVsZW1lbnQnLFxuICAgIG5hbWU6ICdzZWFtbGVzc3BheS1jYXJkLWVsZW1lbnQnLFxuICAgIHN0eWxlOiB7fVxuICB9KTtcblxuICBPYmplY3Qua2V5cyhjb25zdGFudHMuZGVmYXVsdElGcmFtZVN0eWxlKS5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wZXJ0eU5hbWUpIHtcbiAgICBmcmFtZS5zdHlsZS5zZXRQcm9wZXJ0eS5hcHBseShmcmFtZS5zdHlsZSwgW3Byb3BlcnR5TmFtZV0uY29uY2F0KGNvbnN0YW50cy5kZWZhdWx0SUZyYW1lU3R5bGVbcHJvcGVydHlOYW1lXSkpO1xuICB9KTtcblxuICB0aGlzLl9pbmplY3RlZE5vZGVzID0gaW5qZWN0RnJhbWUoZnJhbWUsIGNvbnRhaW5lcik7XG4gIHRoaXMuX3N0YXRlLmZyYW1lRWxlbWVudCA9IGZyYW1lO1xuICB0aGlzLl9zdGF0ZS5jb250YWluZXJFbGVtZW50ID0gY29udGFpbmVyO1xuXG4gIHRoaXMuX3N0YXRlLmZpZWxkcyA9IGNhcmRFbGVtZW50RmllbGRzLnJlZHVjZShmdW5jdGlvbiAocmVzdWx0LCBmaWVsZE5hbWUpIHtcbiAgICByZXN1bHRbZmllbGROYW1lXSA9IHtcbiAgICAgIGlzRW1wdHk6IHRydWUsXG4gICAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICAgIGlzUG90ZW50aWFsbHlWYWxpZDogdHJ1ZSxcbiAgICAgIGlzRm9jdXNlZDogZmFsc2VcbiAgICB9O1xuXG4gICAgcmV0dXJuIGFzc2lnbih7fSwgcmVzdWx0KTtcbiAgfSwge30pO1xuXG4gIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgIGZyYW1lLnNyYyA9IGNvbXBvc2VVcmwoY2xpZW50Q29uZmlnLCAnY2FyZC1lbGVtZW50JywgY29tcG9uZW50SWQsIGNsaWVudENvbmZpZy5pc0RlYnVnKTtcbiAgfSwgMCk7XG5cbiAgdGhpcy5fYnVzLm9uKGV2ZW50cy5GUkFNRV9SRUFEWSwgZnVuY3Rpb24gKHJlcGx5KSB7XG4gICAgcmVwbHkob3B0aW9ucyk7XG4gICAgc2VsZi5fZW1pdCgncmVhZHknKTtcbiAgfSk7XG5cbiAgdGhpcy5fYnVzLm9uKFxuICAgIGV2ZW50cy5JTlBVVF9FVkVOVCxcbiAgICBjcmVhdGVJbnB1dEV2ZW50SGFuZGxlcihjb250YWluZXIpLmJpbmQodGhpcylcbiAgKTtcblxuICB0aGlzLl9kZXN0cnVjdG9yLnJlZ2lzdGVyRnVuY3Rpb25Gb3JUZWFyZG93bihmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGosIG5vZGUsIHBhcmVudDtcblxuICAgIGZvciAoaiA9IDA7IGogPCBzZWxmLl9pbmplY3RlZE5vZGVzLmxlbmd0aDsgaisrKSB7XG4gICAgICBub2RlID0gc2VsZi5faW5qZWN0ZWROb2Rlc1tqXTtcbiAgICAgIHBhcmVudCA9IG5vZGUucGFyZW50Tm9kZTtcblxuICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKG5vZGUpO1xuXG4gICAgICBjbGFzc2xpc3QucmVtb3ZlKFxuICAgICAgICBwYXJlbnQsXG4gICAgICAgIGNvbnN0YW50cy5leHRlcm5hbENsYXNzZXMuRk9DVVNFRCxcbiAgICAgICAgY29uc3RhbnRzLmV4dGVybmFsQ2xhc3Nlcy5JTlZBTElELFxuICAgICAgICBjb25zdGFudHMuZXh0ZXJuYWxDbGFzc2VzLlZBTElEXG4gICAgICApO1xuICAgIH1cbiAgfSk7XG5cbiAgdGhpcy5fZGVzdHJ1Y3Rvci5yZWdpc3RlckZ1bmN0aW9uRm9yVGVhcmRvd24oZnVuY3Rpb24gKCkge1xuICAgIHZhciBtZXRob2ROYW1lcyA9IG1ldGhvZHMoQ2FyZEVsZW1lbnQucHJvdG90eXBlKS5jb25jYXQobWV0aG9kcyhFdmVudEVtaXR0ZXIucHJvdG90eXBlKSk7XG5cbiAgICBjb252ZXJ0TWV0aG9kc1RvRXJyb3Ioc2VsZiwgbWV0aG9kTmFtZXMpO1xuICB9KTtcbn1cblxuQ2FyZEVsZW1lbnQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFdmVudEVtaXR0ZXIucHJvdG90eXBlLCB7XG4gIGNvbnN0cnVjdG9yOiBDYXJkRWxlbWVudFxufSk7XG5cbi8qKlxuICogQ2xlYW5seSByZW1vdmUgYW55dGhpbmcgc2V0IHVwIGJ5IHtAbGluayBtb2R1bGU6c2VhbWxlc3NwYXktd2ViL2NhcmQtZWxlbWVudC5jcmVhdGV8Y3JlYXRlfS5cbiAqIEBwdWJsaWNcbiAqIEBmdW5jdGlvblxuICogQHBhcmFtIHtjYWxsYmFja30gW2NhbGxiYWNrXSBDYWxsZWQgb24gY29tcGxldGlvbiwgY29udGFpbmluZyBhbiBlcnJvciBpZiBvbmUgb2NjdXJyZWQuIE5vIGRhdGEgaXMgcmV0dXJuZWQgaWYgdGVhcmRvd24gY29tcGxldGVzIHN1Y2Nlc3NmdWxseS4gSWYgbm8gY2FsbGJhY2sgaXMgcHJvdmlkZWQsIGB0ZWFyZG93bmAgcmV0dXJucyBhIHByb21pc2UuXG4gKiBAZXhhbXBsZVxuICogQ2FyZEVsZW1lbnRJbnN0YW5jZS50ZWFyZG93bihmdW5jdGlvbiAodGVhcmRvd25FcnIpIHtcbiAqICAgaWYgKHRlYXJkb3duRXJyKSB7XG4gKiAgICAgY29uc29sZS5lcnJvcignQ291bGQgbm90IHRlYXIgZG93biBDYXJkIEVsZW1lbnQhJyk7XG4gKiAgIH0gZWxzZSB7XG4gKiAgICAgY29uc29sZS5pbmZvKCdDYXJkIEVsZW1lbnQgaGFzIGJlZW4gdG9ybiBkb3duIScpO1xuICogICB9XG4gKiB9KTtcbiAqIEByZXR1cm5zIHtQcm9taXNlfHZvaWR9IElmIG5vIGNhbGxiYWNrIGlzIHByb3ZpZGVkLCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdoZW4gdGhlIHRlYXJkb3duIGlzIGNvbXBsZXRlLlxuICovXG5DYXJkRWxlbWVudC5wcm90b3R5cGUudGVhcmRvd24gPSB3cmFwUHJvbWlzZShcbiAgZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpczsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1pbnZhbGlkLXRoaXNcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBzZWxmLl9kZXN0cnVjdG9yLnRlYXJkb3duKGZ1bmN0aW9uIChlcnIpIHtcblxuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuKTtcblxuLyoqXG4gKiBUb2tlbml6ZXMgZmllbGRzIGFuZCByZXR1cm5zIGEgdG9rZW4gcGF5bG9hZC5cbiAqIEBwdWJsaWNcbiAqIEBmdW5jdGlvblxuICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXSBBbGwgdG9rZW5pemF0aW9uIG9wdGlvbnMgZm9yIHRoZSBDYXJkIEVsZW1lbnQgY29tcG9uZW50LlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy52YXVsdD1mYWxzZV0gV2hlbiB0cnVlLCB3aWxsIHZhdWx0IHRoZSB0b2tlbml6ZWQgY2FyZC4gQ2FyZHMgd2lsbCBvbmx5IGJlIHZhdWx0ZWQgd2hlbiB1c2luZyBhIGNsaWVudCBjcmVhdGVkIHdpdGggYSBjbGllbnQgdG9rZW4gdGhhdCBpbmNsdWRlcyBhIGN1c3RvbWVyIElELlxuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLmJpbGxpbmdBZGRyZXNzLnBvc3RhbENvZGVdIFdoZW4gc3VwcGxpZWQsIHRoaXMgcG9zdGFsIGNvZGUgd2lsbCBiZSB0b2tlbml6ZWQgYWxvbmcgd2l0aCB0aGUgY29udGVudHMgb2YgdGhlIGZpZWxkcy4gSWYgYSBwb3N0YWwgY29kZSBpcyBwcm92aWRlZCBhcyBwYXJ0IG9mIHRoZSBDYXJkIEVsZW1lbnQgY29uZmlndXJhdGlvbiwgdGhlIHZhbHVlIG9mIHRoZSBmaWVsZCB3aWxsIGJlIHRva2VuaXplZCBhbmQgdGhpcyB2YWx1ZSB3aWxsIGJlIGlnbm9yZWQuXG4gKiBAcGFyYW0ge2NhbGxiYWNrfSBbY2FsbGJhY2tdIFRoZSBzZWNvbmQgYXJndW1lbnQsIDxjb2RlPmRhdGE8L2NvZGU+LCBpcyBhIHtAbGluayBDYXJkRWxlbWVudH50b2tlbml6ZVBheWxvYWR8dG9rZW5pemVQYXlsb2FkfS4gSWYgbm8gY2FsbGJhY2sgaXMgcHJvdmlkZWQsIGB0b2tlbml6ZWAgcmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgcmVzb2x2ZXMgd2l0aCBhIHtAbGluayBDYXJkRWxlbWVudH50b2tlbml6ZVBheWxvYWR8dG9rZW5pemVQYXlsb2FkfS5cbiAqIEBleGFtcGxlIDxjYXB0aW9uPlRva2VuaXplIGEgY2FyZDwvY2FwdGlvbj5cbiAqIENhcmRFbGVtZW50SW5zdGFuY2UudG9rZW5pemUoZnVuY3Rpb24gKHRva2VuaXplRXJyLCBwYXlsb2FkKSB7XG4gKiAgIGlmICh0b2tlbml6ZUVycikge1xuICogICAgIHN3aXRjaCAodG9rZW5pemVFcnIuY29kZSkge1xuICogICAgICAgY2FzZSAnQ0FSRF9FTEVNRU5UX0ZJRUxEU19FTVBUWSc6XG4gKiAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0FsbCBmaWVsZHMgYXJlIGVtcHR5ISBQbGVhc2UgZmlsbCBvdXQgdGhlIGZvcm0uJyk7XG4gKiAgICAgICAgIGJyZWFrO1xuICogICAgICAgY2FzZSAnQ0FSRF9FTEVNRU5UX0ZJRUxEU19JTlZBTElEJzpcbiAqICAgICAgICAgY29uc29sZS5lcnJvcignU29tZSBmaWVsZHMgYXJlIGludmFsaWQ6JywgdG9rZW5pemVFcnIuZGV0YWlscy5pbnZhbGlkRmllbGRLZXlzKTtcbiAqICAgICAgICAgYnJlYWs7XG4gKiAgICAgICBjYXNlICdDQVJEX0VMRU1FTlRfRkFJTEVEX1RPS0VOSVpBVElPTic6XG4gKiAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1Rva2VuaXphdGlvbiBmYWlsZWQgc2VydmVyIHNpZGUuIElzIHRoZSBjYXJkIHZhbGlkPycpO1xuICogICAgICAgICBicmVhaztcbiAqICAgICAgIGNhc2UgJ0NBUkRfRUxFTUVOVF9UT0tFTklaQVRJT05fTkVUV09SS19FUlJPUic6XG4gKiAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ05ldHdvcmsgZXJyb3Igb2NjdXJyZWQgd2hlbiB0b2tlbml6aW5nLicpO1xuICogICAgICAgICBicmVhaztcbiAqICAgICAgIGRlZmF1bHQ6XG4gKiAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1NvbWV0aGluZyBiYWQgaGFwcGVuZWQhJywgdG9rZW5pemVFcnIpO1xuICogICAgIH1cbiAqICAgfSBlbHNlIHtcbiAqICAgICBjb25zb2xlLmxvZygnR290IG5vbmNlOicsIHBheWxvYWQubm9uY2UpO1xuICogICB9XG4gKiB9KTtcbiAqIEBleGFtcGxlIDxjYXB0aW9uPlRva2VuaXplIGFuZCB2YXVsdCBhIGNhcmQ8L2NhcHRpb24+XG4gKiBDYXJkRWxlbWVudEluc3RhbmNlLnRva2VuaXplKHtcbiAqICAgdmF1bHQ6IHRydWVcbiAqIH0sIGZ1bmN0aW9uICh0b2tlbml6ZUVyciwgcGF5bG9hZCkge1xuICogICBpZiAodG9rZW5pemVFcnIpIHtcbiAqICAgICBjb25zb2xlLmVycm9yKHRva2VuaXplRXJyKTtcbiAqICAgfSBlbHNlIHtcbiAqICAgICBjb25zb2xlLmxvZygnR290IG5vbmNlOicsIHBheWxvYWQubm9uY2UpO1xuICogICB9XG4gKiB9KTtcbiAqIEBleGFtcGxlIDxjYXB0aW9uPlRva2VuaXplIGEgY2FyZCB3aXRoIHRoZSBwb3N0YWwgY29kZSBvcHRpb248L2NhcHRpb24+XG4gKiBDYXJkRWxlbWVudEluc3RhbmNlLnRva2VuaXplKHtcbiAqICAgYmlsbGluZ0FkZHJlc3M6IHtcbiAqICAgICBwb3N0YWxDb2RlOiAnMTExMTEnXG4gKiAgIH1cbiAqIH0sIGZ1bmN0aW9uICh0b2tlbml6ZUVyciwgcGF5bG9hZCkge1xuICogICBpZiAodG9rZW5pemVFcnIpIHtcbiAqICAgICBjb25zb2xlLmVycm9yKHRva2VuaXplRXJyKTtcbiAqICAgfSBlbHNlIHtcbiAqICAgICBjb25zb2xlLmxvZygnR290IG5vbmNlOicsIHBheWxvYWQubm9uY2UpO1xuICogICB9XG4gKiB9KTtcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5DYXJkRWxlbWVudC5wcm90b3R5cGUudG9rZW5pemUgPSB3cmFwUHJvbWlzZShcbiAgZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8taW52YWxpZC10aGlzXG5cbiAgICBpZiAoIW9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgc2VsZi5fYnVzLmVtaXQoZXZlbnRzLlRPS0VOSVpBVElPTl9SRVFVRVNULCBvcHRpb25zLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgdmFyIGVyciA9IHJlc3BvbnNlWzBdO1xuICAgICAgICB2YXIgcGF5bG9hZCA9IHJlc3BvbnNlWzFdO1xuXG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKHBheWxvYWQpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuKTtcblxuLyoqXG4gKiBTZXRzIGFuIGF0dHJpYnV0ZSBvZiBhIHtAbGluayBtb2R1bGU6c2VhbWxlc3NwYXktd2ViL2NhcmQtZWxlbWVudH5maWVsZCBmaWVsZH0uXG4gKiBTdXBwb3J0ZWQgYXR0cmlidXRlcyBhcmUgYGFyaWEtaW52YWxpZGAsIGBhcmlhLXJlcXVpcmVkYCwgYGRpc2FibGVkYCwgYW5kIGBwbGFjZWhvbGRlcmAuXG4gKlxuICogQHB1YmxpY1xuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgVGhlIG9wdGlvbnMgZm9yIHRoZSBhdHRyaWJ1dGUgeW91IHdpc2ggdG8gc2V0LlxuICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbnMuZmllbGQgVGhlIGZpZWxkIHRvIHdoaWNoIHlvdSB3aXNoIHRvIGFkZCBhbiBhdHRyaWJ1dGUuIE11c3QgYmUgYSB2YWxpZCB7QGxpbmsgbW9kdWxlOnNlYW1sZXNzcGF5LXdlYi9jYXJkLWVsZW1lbnR+ZmllbGRPcHRpb25zIGZpZWxkT3B0aW9ufS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLmF0dHJpYnV0ZSBUaGUgbmFtZSBvZiB0aGUgYXR0cmlidXRlIHlvdSB3aXNoIHRvIGFkZCB0byB0aGUgZmllbGQuXG4gKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9ucy52YWx1ZSBUaGUgdmFsdWUgZm9yIHRoZSBhdHRyaWJ1dGUuXG4gKiBAcGFyYW0ge2NhbGxiYWNrfSBbY2FsbGJhY2tdIENhbGxiYWNrIGV4ZWN1dGVkIG9uIGNvbXBsZXRpb24sIGNvbnRhaW5pbmcgYW4gZXJyb3IgaWYgb25lIG9jY3VycmVkLiBObyBkYXRhIGlzIHJldHVybmVkIGlmIHRoZSBhdHRyaWJ1dGUgaXMgc2V0IHN1Y2Nlc3NmdWxseS5cbiAqXG4gKiBAZXhhbXBsZSA8Y2FwdGlvbj5TZXQgdGhlIHBsYWNlaG9sZGVyIGF0dHJpYnV0ZSBvZiBhIGZpZWxkPC9jYXB0aW9uPlxuICogQ2FyZEVsZW1lbnRJbnN0YW5jZS5zZXRBdHRyaWJ1dGUoe1xuICogICBmaWVsZDogJ2FjY291bnROdW1iZXInLFxuICogICBhdHRyaWJ1dGU6ICdwbGFjZWhvbGRlcicsXG4gKiAgIHZhbHVlOiAnMTExMSAxMTExIDExMTEgMTExMSdcbiAqIH0sIGZ1bmN0aW9uIChhdHRyaWJ1dGVFcnIpIHtcbiAqICAgaWYgKGF0dHJpYnV0ZUVycikge1xuICogICAgIGNvbnNvbGUuZXJyb3IoYXR0cmlidXRlRXJyKTtcbiAqICAgfVxuICogfSk7XG4gKlxuICogQGV4YW1wbGUgPGNhcHRpb24+U2V0IHRoZSBhcmlhLXJlcXVpcmVkIGF0dHJpYnV0ZSBvZiBhIGZpZWxkPC9jYXB0aW9uPlxuICogQ2FyZEVsZW1lbnRJbnN0YW5jZS5zZXRBdHRyaWJ1dGUoe1xuICogICBmaWVsZDogJ2FjY291bnROdW1iZXInLFxuICogICBhdHRyaWJ1dGU6ICdhcmlhLXJlcXVpcmVkJyxcbiAqICAgdmFsdWU6IHRydWVcbiAqIH0sIGZ1bmN0aW9uIChhdHRyaWJ1dGVFcnIpIHtcbiAqICAgaWYgKGF0dHJpYnV0ZUVycikge1xuICogICAgIGNvbnNvbGUuZXJyb3IoYXR0cmlidXRlRXJyKTtcbiAqICAgfVxuICogfSk7XG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbkNhcmRFbGVtZW50LnByb3RvdHlwZS5zZXRBdHRyaWJ1dGUgPSBmdW5jdGlvbiAob3B0aW9ucywgY2FsbGJhY2spIHtcbiAgdmFyIGF0dHJpYnV0ZUVyciwgZXJyO1xuXG4gIGlmIChjYXJkRWxlbWVudEZpZWxkcy5pbmRleE9mKG9wdGlvbnMuZmllbGQpID09PSAtMSkge1xuICAgIGVyciA9IG5ldyBTZWFtbGVzc3BheUVycm9yKHtcbiAgICAgIHR5cGU6IGVycm9ycy5DQVJEX0VMRU1FTlRfRklFTERfSU5WQUxJRC50eXBlLFxuICAgICAgY29kZTogZXJyb3JzLkNBUkRfRUxFTUVOVF9GSUVMRF9JTlZBTElELmNvZGUsXG4gICAgICBtZXNzYWdlOiAnXCInICsgb3B0aW9ucy5maWVsZCArICdcIiBpcyBub3QgYSB2YWxpZCBmaWVsZC4gWW91IG11c3QgdXNlIGEgdmFsaWQgZmllbGQgb3B0aW9uIHdoZW4gc2V0dGluZyBhbiBhdHRyaWJ1dGUuJ1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGF0dHJpYnV0ZUVyciA9IGF0dHJpYnV0ZVZhbGlkYXRpb25FcnJvcihvcHRpb25zLmF0dHJpYnV0ZSwgb3B0aW9ucy52YWx1ZSk7XG5cbiAgICBpZiAoYXR0cmlidXRlRXJyKSB7XG4gICAgICBlcnIgPSBhdHRyaWJ1dGVFcnI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2J1cy5lbWl0KGV2ZW50cy5TRVRfQVRUUklCVVRFLCBvcHRpb25zLmZpZWxkLCBvcHRpb25zLmF0dHJpYnV0ZSwgb3B0aW9ucy52YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNhbGxiYWNrID0gZGVmZXJyZWQoY2FsbGJhY2spO1xuICAgIGNhbGxiYWNrKGVycik7XG4gIH1cbn07XG5cbi8qKlxuICogUmVtb3ZlcyBhIHN1cHBvcnRlZCBhdHRyaWJ1dGUgZnJvbSBhIHtAbGluayBtb2R1bGU6c2VhbWxlc3NwYXktd2ViL2NhcmQtZWxlbWVudH5maWVsZCBmaWVsZH0uXG4gKlxuICogQHB1YmxpY1xuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgVGhlIG9wdGlvbnMgZm9yIHRoZSBhdHRyaWJ1dGUgeW91IHdpc2ggdG8gcmVtb3ZlLlxuICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbnMuZmllbGQgVGhlIGZpZWxkIGZyb20gd2hpY2ggeW91IHdpc2ggdG8gcmVtb3ZlIGFuIGF0dHJpYnV0ZS4gTXVzdCBiZSBhIHZhbGlkIHtAbGluayBtb2R1bGU6c2VhbWxlc3NwYXktd2ViL2NhcmQtZWxlbWVudH5maWVsZE9wdGlvbnMgZmllbGRPcHRpb259LlxuICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbnMuYXR0cmlidXRlIFRoZSBuYW1lIG9mIHRoZSBhdHRyaWJ1dGUgeW91IHdpc2ggdG8gcmVtb3ZlIGZyb20gdGhlIGZpZWxkLlxuICogQHBhcmFtIHtjYWxsYmFja30gW2NhbGxiYWNrXSBDYWxsYmFjayBleGVjdXRlZCBvbiBjb21wbGV0aW9uLCBjb250YWluaW5nIGFuIGVycm9yIGlmIG9uZSBvY2N1cnJlZC4gTm8gZGF0YSBpcyByZXR1cm5lZCBpZiB0aGUgYXR0cmlidXRlIGlzIHJlbW92ZWQgc3VjY2Vzc2Z1bGx5LlxuICpcbiAqIEBleGFtcGxlIDxjYXB0aW9uPlJlbW92ZSB0aGUgcGxhY2Vob2xkZXIgYXR0cmlidXRlIG9mIGEgZmllbGQ8L2NhcHRpb24+XG4gKiBDYXJkRWxlbWVudEluc3RhbmNlLnJlbW92ZUF0dHJpYnV0ZSh7XG4gKiAgIGZpZWxkOiAnYWNjb3VudE51bWJlcicsXG4gKiAgIGF0dHJpYnV0ZTogJ3BsYWNlaG9sZGVyJ1xuICogfSwgZnVuY3Rpb24gKGF0dHJpYnV0ZUVycikge1xuICogICBpZiAoYXR0cmlidXRlRXJyKSB7XG4gKiAgICAgY29uc29sZS5lcnJvcihhdHRyaWJ1dGVFcnIpO1xuICogICB9XG4gKiB9KTtcbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuQ2FyZEVsZW1lbnQucHJvdG90eXBlLnJlbW92ZUF0dHJpYnV0ZSA9IGZ1bmN0aW9uIChvcHRpb25zLCBjYWxsYmFjaykge1xuICB2YXIgYXR0cmlidXRlRXJyLCBlcnI7XG5cbiAgaWYgKGNhcmRFbGVtZW50RmllbGRzLmluZGV4T2Yob3B0aW9ucy5maWVsZCkgPT09IC0xKSB7XG4gICAgZXJyID0gbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgdHlwZTogZXJyb3JzLkNBUkRfRUxFTUVOVF9GSUVMRF9JTlZBTElELnR5cGUsXG4gICAgICBjb2RlOiBlcnJvcnMuQ0FSRF9FTEVNRU5UX0ZJRUxEX0lOVkFMSUQuY29kZSxcbiAgICAgIG1lc3NhZ2U6ICdcIicgKyBvcHRpb25zLmZpZWxkICsgJ1wiIGlzIG5vdCBhIHZhbGlkIGZpZWxkLiBZb3UgbXVzdCB1c2UgYSB2YWxpZCBmaWVsZCBvcHRpb24gd2hlbiByZW1vdmluZyBhbiBhdHRyaWJ1dGUuJ1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGF0dHJpYnV0ZUVyciA9IGF0dHJpYnV0ZVZhbGlkYXRpb25FcnJvcihvcHRpb25zLmF0dHJpYnV0ZSk7XG5cbiAgICBpZiAoYXR0cmlidXRlRXJyKSB7XG4gICAgICBlcnIgPSBhdHRyaWJ1dGVFcnI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2J1cy5lbWl0KGV2ZW50cy5SRU1PVkVfQVRUUklCVVRFLCBvcHRpb25zLmZpZWxkLCBvcHRpb25zLmF0dHJpYnV0ZSk7XG4gICAgfVxuICB9XG5cbiAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNhbGxiYWNrID0gZGVmZXJyZWQoY2FsbGJhY2spO1xuICAgIGNhbGxiYWNrKGVycik7XG4gIH1cbn07XG5cbi8qKlxuICogQ2xlYXIgdGhlIHZhbHVlIG9mIGEge0BsaW5rIG1vZHVsZTpzZWFtbGVzc3BheS13ZWIvY2FyZC1lbGVtZW50fmZpZWxkIGZpZWxkfS5cbiAqIEBwdWJsaWNcbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWVsZCBUaGUgZmllbGQgd2hvc2UgcGxhY2Vob2xkZXIgeW91IHdpc2ggdG8gY2xlYXIuIE11c3QgYmUgYSB2YWxpZCB7QGxpbmsgbW9kdWxlOnNlYW1sZXNzcGF5LXdlYi9jYXJkLWVsZW1lbnR+ZmllbGRPcHRpb25zIGZpZWxkT3B0aW9ufS5cbiAqIEBwYXJhbSB7Y2FsbGJhY2t9IFtjYWxsYmFja10gQ2FsbGJhY2sgZXhlY3V0ZWQgb24gY29tcGxldGlvbiwgY29udGFpbmluZyBhbiBlcnJvciBpZiBvbmUgb2NjdXJyZWQuIE5vIGRhdGEgaXMgcmV0dXJuZWQgaWYgdGhlIGZpZWxkIGNsZWFyZWQgc3VjY2Vzc2Z1bGx5LlxuICogQHJldHVybnMge3ZvaWR9XG4gKiBAZXhhbXBsZVxuICogQ2FyZEVsZW1lbnRJbnN0YW5jZS5jbGVhcignbnVtYmVyJywgZnVuY3Rpb24gKGNsZWFyRXJyKSB7XG4gKiAgIGlmIChjbGVhckVycikge1xuICogICAgIGNvbnNvbGUuZXJyb3IoY2xlYXJFcnIpO1xuICogICB9XG4gKiB9KTtcbiAqXG4gKiBAZXhhbXBsZSA8Y2FwdGlvbj5DbGVhciBzZXZlcmFsIGZpZWxkczwvY2FwdGlvbj5cbiAqIENhcmRFbGVtZW50SW5zdGFuY2UuY2xlYXJGaWVsZCgnYWNjb3VudE51bWJlcicpO1xuICogQ2FyZEVsZW1lbnRJbnN0YW5jZS5jbGVhckZpZWxkKCdjdnYnKTtcbiAqIENhcmRFbGVtZW50SW5zdGFuY2UuY2xlYXJGaWVsZCgnZXhwRGF0ZScpO1xuICovXG5DYXJkRWxlbWVudC5wcm90b3R5cGUuY2xlYXJGaWVsZCA9IGZ1bmN0aW9uIChmaWVsZCwgY2FsbGJhY2spIHtcbiAgdmFyIGVycjtcblxuICBpZiAoY2FyZEVsZW1lbnRGaWVsZHMuaW5kZXhPZihmaWVsZCkgPT09IC0xKSB7XG4gICAgZXJyID0gbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgdHlwZTogZXJyb3JzLkNBUkRfRUxFTUVOVF9GSUVMRF9JTlZBTElELnR5cGUsXG4gICAgICBjb2RlOiBlcnJvcnMuQ0FSRF9FTEVNRU5UX0ZJRUxEX0lOVkFMSUQuY29kZSxcbiAgICAgIG1lc3NhZ2U6ICdcIicgKyBmaWVsZCArICdcIiBpcyBub3QgYSB2YWxpZCBmaWVsZC4gWW91IG11c3QgdXNlIGEgdmFsaWQgZmllbGQgb3B0aW9uIHdoZW4gY2xlYXJpbmcgYSBmaWVsZC4nXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5fYnVzLmVtaXQoZXZlbnRzLkNMRUFSX0ZJRUxELCBmaWVsZCk7XG4gIH1cblxuICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY2FsbGJhY2sgPSBkZWZlcnJlZChjYWxsYmFjayk7XG4gICAgY2FsbGJhY2soZXJyKTtcbiAgfVxufTtcblxuLyoqXG4gKiBDbGVhciB0aGUgdmFsdWVzIG9mIGEge0BsaW5rIG1vZHVsZTpzZWFtbGVzc3BheS13ZWIvY2FyZC1lbGVtZW50IGZvcm19LlxuICogQHB1YmxpY1xuICogQHBhcmFtIHtzdHJpbmd9IGZpZWxkIFRoZSBmaWVsZCB3aG9zZSBwbGFjZWhvbGRlciB5b3Ugd2lzaCB0byBjbGVhci4gTXVzdCBiZSBhIHZhbGlkIHtAbGluayBtb2R1bGU6c2VhbWxlc3NwYXktd2ViL2NhcmQtZWxlbWVudH5maWVsZE9wdGlvbnMgZmllbGRPcHRpb259LlxuICogQHBhcmFtIHtjYWxsYmFja30gW2NhbGxiYWNrXSBDYWxsYmFjayBleGVjdXRlZCBvbiBjb21wbGV0aW9uLCBjb250YWluaW5nIGFuIGVycm9yIGlmIG9uZSBvY2N1cnJlZC4gTm8gZGF0YSBpcyByZXR1cm5lZCBpZiB0aGUgZmllbGQgY2xlYXJlZCBzdWNjZXNzZnVsbHkuXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqIEBleGFtcGxlXG4gKiBDYXJkRWxlbWVudEluc3RhbmNlLmNsZWFyRm9ybSgpO1xuICpcbiAqIEBleGFtcGxlIDxjYXB0aW9uPkNsZWFyIHNldmVyYWwgZmllbGRzPC9jYXB0aW9uPlxuICogQ2FyZEVsZW1lbnRJbnN0YW5jZS5jbGVhckZpZWxkKCdhY2NvdW50TnVtYmVyJyk7XG4gKiBDYXJkRWxlbWVudEluc3RhbmNlLmNsZWFyRmllbGQoJ2N2dicpO1xuICogQ2FyZEVsZW1lbnRJbnN0YW5jZS5jbGVhckZpZWxkKCdleHBEYXRlJyk7XG4gKi9cbkNhcmRFbGVtZW50LnByb3RvdHlwZS5jbGVhckZvcm0gPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBidXMgPSB0aGlzLl9idXM7XG5cbiAgY2FyZEVsZW1lbnRGaWVsZHMuZm9yRWFjaChmdW5jdGlvbiAoZmllbGQpIHtcbiAgICBidXMuZW1pdChldmVudHMuQ0xFQVJfRklFTEQsIGZpZWxkKTtcbiAgfSk7XG59O1xuXG4vKipcbiAqIFJldHVybnMgYW4ge0BsaW5rIENhcmRFbGVtZW50fnN0YXRlT2JqZWN0fG9iamVjdH0gdGhhdCBpbmNsdWRlcyB0aGUgc3RhdGUgb2YgYWxsIGZpZWxkcyBhbmQgcG9zc2libGUgY2FyZCB0eXBlcy5cbiAqIEBwdWJsaWNcbiAqIEByZXR1cm5zIHtvYmplY3R9IHtAbGluayBDYXJkRWxlbWVudH5zdGF0ZU9iamVjdHxzdGF0ZU9iamVjdH1cbiAqIEBleGFtcGxlIDxjYXB0aW9uPkNoZWNrIGlmIGFsbCBmaWVsZHMgYXJlIHZhbGlkPC9jYXB0aW9uPlxuICogdmFyIHN0YXRlID0gQ2FyZEVsZW1lbnQuZ2V0U3RhdGUoKTtcbiAqXG4gKiB2YXIgZm9ybVZhbGlkID0gT2JqZWN0LmtleXMoc3RhdGUuZmllbGRzKS5ldmVyeShmdW5jdGlvbiAoa2V5KSB7XG4gKiAgIHJldHVybiBzdGF0ZS5maWVsZHNba2V5XS5pc1ZhbGlkO1xuICogfSk7XG4gKi9cbkNhcmRFbGVtZW50LnByb3RvdHlwZS5nZXRTdGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMuX3N0YXRlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDYXJkRWxlbWVudDtcbiIsIid1c2Ugc3RyaWN0Jztcbi8qKiBAbW9kdWxlIHNlYW1sZXNzcGF5LXdlYi9jYXJkLWVsZW1lbnQgKi9cblxudmFyIENhcmRFbGVtZW50ID0gcmVxdWlyZSgnLi9leHRlcm5hbC9jYXJkLWVsZW1lbnQnKTtcbnZhciB3cmFwUHJvbWlzZSA9IHJlcXVpcmUoJ0BicmFpbnRyZWUvd3JhcC1wcm9taXNlJyk7XG52YXIgUHJvbWlzZSA9IHJlcXVpcmUoJy4uL2xpYi9wcm9taXNlJyk7XG5cbnZhciBWRVJTSU9OID0gXCJ3ZWItc2RrXCI7XG5cbi8qKlxuICogRmllbGRzIHVzZWQgaW4ge0BsaW5rIG1vZHVsZTpzZWFtbGVzc3BheS13ZWIvY2FyZC1lbGVtZW50fmZpZWxkT3B0aW9ucyBmaWVsZHMgb3B0aW9uc31cbiAqIEB0eXBlZGVmIHtvYmplY3R9IGZpZWxkXG4gKiBAcHJvcGVydHkge3N0cmluZ30gc2VsZWN0b3IgQSBDU1Mgc2VsZWN0b3IgdG8gZmluZCB0aGUgY29udGFpbmVyIHdoZXJlIHRoZSBjYXJkIGVsZW1lbnQgd2lsbCBiZSBpbnNlcnRlZC5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbcGxhY2Vob2xkZXJdIFdpbGwgYmUgdXNlZCBhcyB0aGUgYHBsYWNlaG9sZGVyYCBhdHRyaWJ1dGUgb2YgdGhlIGlucHV0LiBJZiBgcGxhY2Vob2xkZXJgIGlzIG5vdCBuYXRpdmVseSBzdXBwb3J0ZWQgYnkgdGhlIGJyb3dzZXIsIGl0IHdpbGwgYmUgcG9seWZpbGxlZC5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbdHlwZV0gV2lsbCBiZSB1c2VkIGFzIHRoZSBgdHlwZWAgYXR0cmlidXRlIG9mIHRoZSBpbnB1dC4gVG8gbWFzayBgY3Z2YCBpbnB1dCwgZm9yIGluc3RhbmNlLCBgdHlwZTogXCJwYXNzd29yZFwiYCBjYW4gYmUgdXNlZC5cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gW2Zvcm1hdElucHV0PXRydWVdIEVuYWJsZSBvciBkaXNhYmxlIGF1dG9tYXRpYyBmb3JtYXR0aW5nIG9uIHRoaXMgZmllbGQuXG4gKiBAcHJvcGVydHkge29iamVjdHxib29sZWFufSBbc2VsZWN0XSBJZiB0cnV0aHksIHRoaXMgZmllbGQgYmVjb21lcyBhIGA8c2VsZWN0PmAgZHJvcGRvd24gbGlzdC4gVGhpcyBjYW4gb25seSBiZSB1c2VkIGZvciBgZXhwaXJhdGlvbk1vbnRoYCBhbmQgYGV4cGlyYXRpb25ZZWFyYCBmaWVsZHMuXG4gKiBAcHJvcGVydHkge3N0cmluZ1tdfSBbc2VsZWN0Lm9wdGlvbnNdIEFuIGFycmF5IG9mIDEyIHN0cmluZ3MsIG9uZSBwZXIgbW9udGguIFRoaXMgY2FuIG9ubHkgYmUgdXNlZCBmb3IgdGhlIGBleHBpcmF0aW9uTW9udGhgIGZpZWxkLiBGb3IgZXhhbXBsZSwgdGhlIGFycmF5IGNhbiBsb29rIGxpa2UgYFsnMDEgLSBKYW51YXJ5JywgJzAyIC0gRmVicnVhcnknLCAuLi5dYC5cbiAqL1xuXG4vKipcbiAqIEFuIG9iamVjdCB0aGF0IGhhcyB7QGxpbmsgbW9kdWxlOnNlYW1sZXNzcGF5LXdlYi9jYXJkLWVsZW1lbnR+ZmllbGQgZmllbGQgb2JqZWN0c30gZm9yIGVhY2ggZmllbGQuIFVzZWQgaW4ge0BsaW5rIG1vZHVsZTpzZWFtbGVzc3BheS13ZWIvY2FyZC1lbGVtZW50fmNyZWF0ZSBjcmVhdGV9LlxuICogQHR5cGVkZWYge29iamVjdH0gZmllbGRPcHRpb25zXG4gKiBAcHJvcGVydHkge2ZpZWxkfSBbbnVtYmVyXSBBIGZpZWxkIGZvciBjYXJkIG51bWJlci5cbiAqIEBwcm9wZXJ0eSB7ZmllbGR9IFtleHBpcmF0aW9uRGF0ZV0gQSBmaWVsZCBmb3IgZXhwaXJhdGlvbiBkYXRlIGluIGBNTS9ZWVlZYCBmb3JtYXQuIFRoaXMgc2hvdWxkIG5vdCBiZSB1c2VkIHdpdGggdGhlIGBleHBpcmF0aW9uTW9udGhgIGFuZCBgZXhwaXJhdGlvblllYXJgIHByb3BlcnRpZXMuXG4gKiBAcHJvcGVydHkge2ZpZWxkfSBbZXhwaXJhdGlvbk1vbnRoXSBBIGZpZWxkIGZvciBleHBpcmF0aW9uIG1vbnRoIGluIGBNTWAgZm9ybWF0LiBUaGlzIHNob3VsZCBiZSB1c2VkIHdpdGggdGhlIGBleHBpcmF0aW9uWWVhcmAgcHJvcGVydHkuXG4gKiBAcHJvcGVydHkge2ZpZWxkfSBbZXhwaXJhdGlvblllYXJdIEEgZmllbGQgZm9yIGV4cGlyYXRpb24geWVhciBpbiBgWVlZWWAgZm9ybWF0LiBUaGlzIHNob3VsZCBiZSB1c2VkIHdpdGggdGhlIGBleHBpcmF0aW9uTW9udGhgIHByb3BlcnR5LlxuICogQHByb3BlcnR5IHtmaWVsZH0gW2N2dl0gQSBmaWVsZCBmb3IgMyBvciA0IGRpZ2l0IENWViBvciBDSUQuXG4gKiBAcHJvcGVydHkge2ZpZWxkfSBbcG9zdGFsQ29kZV0gQSBmaWVsZCBmb3IgcG9zdGFsIG9yIHJlZ2lvbiBjb2RlLlxuICovXG5cbi8qKlxuICogQW4gb2JqZWN0IHRoYXQgcmVwcmVzZW50cyBDU1MgdGhhdCB3aWxsIGJlIGFwcGxpZWQgaW4gY2FyZCBlbGVtZW50LiBUaGlzIG9iamVjdCBsb29rcyBzaW1pbGFyIHRvIENTUy4gVHlwaWNhbGx5LCB0aGVzZSBzdHlsZXMgaW52b2x2ZSBmb250cyAoc3VjaCBhcyBgZm9udC1mYW1pbHlgIG9yIGBjb2xvcmApLlxuICpcbiAqIFRoZXNlIGFyZSB0aGUgQ1NTIHByb3BlcnRpZXMgdGhhdCBDYXJkIEVsZW1lbnQgc3VwcG9ydHMuIEFueSBvdGhlciBDU1Mgc2hvdWxkIGJlIHNwZWNpZmllZCBvbiB5b3VyIHBhZ2UgYW5kIG91dHNpZGUgb2YgYW55IFNlYW1sZXNzcGF5IGNvbmZpZ3VyYXRpb24uIFRyeWluZyB0byBzZXQgdW5zdXBwb3J0ZWQgcHJvcGVydGllcyB3aWxsIGZhaWwgYW5kIHB1dCBhIHdhcm5pbmcgaW4gdGhlIGNvbnNvbGUuXG4gKlxuICogU3VwcG9ydGVkIENTUyBwcm9wZXJ0aWVzIGFyZTpcbiAqIGBjb2xvcmBcbiAqIGBkaXJlY3Rpb25gXG4gKiBgZm9udC1mYW1pbHlgXG4gKiBgZm9udC1zaXplLWFkanVzdGBcbiAqIGBmb250LXNpemVgXG4gKiBgZm9udC1zdHJldGNoYFxuICogYGZvbnQtc3R5bGVgXG4gKiBgZm9udC12YXJpYW50LWFsdGVybmF0ZXNgXG4gKiBgZm9udC12YXJpYW50LWNhcHNgXG4gKiBgZm9udC12YXJpYW50LWVhc3QtYXNpYW5gXG4gKiBgZm9udC12YXJpYW50LWxpZ2F0dXJlc2BcbiAqIGBmb250LXZhcmlhbnQtbnVtZXJpY2BcbiAqIGBmb250LXZhcmlhbnRgXG4gKiBgZm9udC13ZWlnaHRgXG4gKiBgZm9udGBcbiAqIGBsZXR0ZXItc3BhY2luZ2BcbiAqIGBsaW5lLWhlaWdodGBcbiAqIGBvcGFjaXR5YFxuICogYG91dGxpbmVgXG4gKiBgdGV4dC1zaGFkb3dgXG4gKiBgdHJhbnNpdGlvbmBcbiAqIGAtbW96LW9zeC1mb250LXNtb290aGluZ2BcbiAqIGAtbW96LXRhcC1oaWdobGlnaHQtY29sb3JgXG4gKiBgLW1vei10cmFuc2l0aW9uYFxuICogYC13ZWJraXQtZm9udC1zbW9vdGhpbmdgXG4gKiBgLXdlYmtpdC10YXAtaGlnaGxpZ2h0LWNvbG9yYFxuICogYC13ZWJraXQtdHJhbnNpdGlvbmBcbiAqIEB0eXBlZGVmIHtvYmplY3R9IHN0eWxlT3B0aW9uc1xuICovXG5cbi8qKlxuICogQHN0YXRpY1xuICogQGZ1bmN0aW9uIGNyZWF0ZVxuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgQ3JlYXRpb24gb3B0aW9uczpcbiAqIEBwYXJhbSB7Q2xpZW50fSBvcHRpb25zLmNsaWVudCBBIHtAbGluayBDbGllbnR9IGluc3RhbmNlLlxuICogQHBhcmFtIHtmaWVsZE9wdGlvbnN9IG9wdGlvbnMuZmllbGRzIEEge0BsaW5rIG1vZHVsZTpzZWFtbGVzc3BheS13ZWIvY2FyZC1lbGVtZW50fmZpZWxkT3B0aW9ucyBzZXQgb2Ygb3B0aW9ucyBmb3IgZWFjaCBmaWVsZH0uXG4gKiBAcGFyYW0ge3N0eWxlT3B0aW9uc30gb3B0aW9ucy5zdHlsZXMge0BsaW5rIG1vZHVsZTpzZWFtbGVzc3BheS13ZWIvY2FyZC1lbGVtZW50fnN0eWxlT3B0aW9ucyBTdHlsZXN9IGFwcGxpZWQgdG8gZWFjaCBmaWVsZC5cbiAqIEBwYXJhbSB7Y2FsbGJhY2t9IFtjYWxsYmFja10gVGhlIHNlY29uZCBhcmd1bWVudCwgYGRhdGFgLCBpcyB0aGUge0BsaW5rIENhcmRFbGVtZW50fSBpbnN0YW5jZS4gSWYgbm8gY2FsbGJhY2sgaXMgcHJvdmlkZWQsIGBjcmVhdGVgIHJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2l0aCB0aGUge0BsaW5rIENhcmRFbGVtZW50fSBpbnN0YW5jZS5cbiAqIEByZXR1cm5zIHt2b2lkfVxuICogQGV4YW1wbGVcbiAqIHNlYW1sZXNzcGF5LmNhcmRFbGVtZW50LmNyZWF0ZSh7XG4gKiAgIGNsaWVudDogY2xpZW50SW5zdGFuY2UsXG4gKiAgIHN0eWxlczoge1xuICogICAgICdpbnB1dCc6IHtcbiAqICAgICAgICdmb250LXNpemUnOiAnMTZwdCcsXG4gKiAgICAgICAnY29sb3InOiAnIzNBM0EzQSdcbiAqICAgICB9LFxuICogICAgICcubnVtYmVyJzoge1xuICogICAgICAgJ2ZvbnQtZmFtaWx5JzogJ21vbm9zcGFjZSdcbiAqICAgICB9LFxuICogICAgICcudmFsaWQnOiB7XG4gKiAgICAgICAnY29sb3InOiAnZ3JlZW4nXG4gKiAgICAgfVxuICogICB9LFxuICogICBzZWxlY3RvcjogJyNjYXJkLWVsZW1lbnQnXG4gKiB9LCBjYWxsYmFjayk7XG4gKiBAZXhhbXBsZSA8Y2FwdGlvbj5SaWdodCB0byBMZWZ0IExhbmd1YWdlIFN1cHBvcnQ8L2NhcHRpb24+XG4gKiBzZWFtbGVzc3BheS5jYXJkRWxlbWVudC5jcmVhdGUoe1xuICogICBjbGllbnQ6IGNsaWVudEluc3RhbmNlLFxuICogICBzdHlsZXM6IHtcbiAqICAgICAnaW5wdXQnOiB7XG4gKiAgICAgICAvLyBvdGhlciBzdHlsZXNcbiAqICAgICAgIGRpcmVjdGlvbjogJ3J0bCdcbiAqICAgICB9LFxuICogICB9LFxuICogICBzZWxlY3RvcjogJyNjYXJkLWVsZW1lbnQnXG4gKiB9LCBjYWxsYmFjayk7XG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZShvcHRpb25zKSB7XG4gIHZhciBpbnRlZ3JhdGlvbjtcbiAgdmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdHJ5IHtcbiAgICAgIGludGVncmF0aW9uID0gbmV3IENhcmRFbGVtZW50KG9wdGlvbnMpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4gcmVqZWN0KGVycm9yKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaW50ZWdyYXRpb24ub24oJ3JlYWR5JywgZnVuY3Rpb24gKCkge1xuICAgICAgcmVzb2x2ZShpbnRlZ3JhdGlvbik7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHJldHVybiBwcm9taXNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgY3JlYXRlOiB3cmFwUHJvbWlzZShjcmVhdGUpLFxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uIFRoZSBjdXJyZW50IHZlcnNpb24gb2YgdGhlIFNESywgaS5lLiBge0Bwa2cgdmVyc2lvbn1gLlxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKi9cbiAgVkVSU0lPTjogVkVSU0lPTlxufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8qIGVzbGludC1kaXNhYmxlIG5vLXJlc2VydmVkLWtleXMgKi9cblxudmFyIGVudW1lcmF0ZSA9IHJlcXVpcmUoJy4uLy4uL2xpYi9lbnVtZXJhdGUnKTtcbnZhciBWRVJTSU9OID0gXCJ3ZWItc2RrXCI7XG5cbnZhciByZXF1ZXN0VHlwZXMgPSB7XG4gIFJFUVVFU1RfVFlQRV9UT0tFTklaQVRJT046ICd0b2tlbml6YXRpb24nXG59O1xuXG52YXIgd2hpdGVsaXN0ZWRGaWVsZHMgPSBbXG4gIHtcbiAgICBmaWVsZDogJ2FjY291bnROdW1iZXInLFxuICAgIG5hbWU6ICdhY2NvdW50LW51bWJlcicsXG4gICAgbGFiZWw6ICdDYXJkIE51bWJlcicsXG4gICAgZGVmYXVsdE1heExlbmd0aDogMjIsXG4gICAgd3JhcHBlcjoge1xuICAgICAgZGF0YU1heDogJzQyNDIgNDI0MiA0MjQyIDQyNDIgNDI0MCcsXG4gICAgICBzdHlsZToge1xuICAgICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDBweCknXG4gICAgICB9XG4gICAgfVxuICB9LFxuICB7XG4gICAgZmllbGQ6ICdleHBEYXRlJyxcbiAgICBuYW1lOiAnZXhwLWRhdGUnLFxuICAgIGxhYmVsOiAnRXhwaXJhdGlvbiBEYXRlJyxcbiAgICBkZWZhdWx0TWF4TGVuZ3RoOiA3LFxuICAgIHdyYXBwZXI6IHtcbiAgICAgIGRhdGFNYXg6ICdNTSAvIFlZMCcsXG4gICAgICBzdHlsZToge1xuICAgICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDBweCknXG4gICAgICB9XG4gICAgfVxuICB9LFxuICB7XG4gICAgZmllbGQ6ICdjdnYnLFxuICAgIG5hbWU6ICdjdnYnLFxuICAgIGxhYmVsOiAnQ1ZWJyxcbiAgICBkZWZhdWx0TWF4TGVuZ3RoOiA0LFxuICAgIHdyYXBwZXI6IHtcbiAgICAgIGRhdGFNYXg6ICcwMDAwMCcsXG4gICAgICBzdHlsZToge1xuICAgICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDBweCknXG4gICAgICB9XG4gICAgfVxuICB9LFxuICB7XG4gICAgZmllbGQ6ICdwb3N0YWxDb2RlJyxcbiAgICBuYW1lOiAncG9zdGFsLWNvZGUnLFxuICAgIGxhYmVsOiAnUG9zdGFsIENvZGUnLFxuICAgIGRlZmF1bHRNYXhMZW5ndGg6IDUsXG4gICAgd3JhcHBlcjoge1xuICAgICAgZGF0YU1heDogJzkwMjEwMCcsXG4gICAgICBzdHlsZToge1xuICAgICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDBweCknXG4gICAgICB9XG4gICAgfVxuICB9XG5dO1xuXG52YXIgY2FyZEJyYW5kTWFwID0ge1xuICB2aXNhOiAndmlzYScsXG4gIG1hc3RlcmNhcmQ6ICdtYXN0ZXJjYXJkJyxcbiAgJ2FtZXJpY2FuLWV4cHJlc3MnOiAnYW1leCcsXG4gICdkaW5lcnMtY2x1Yic6ICdkaW5lcnMnLFxuICBkaXNjb3ZlcjogJ2Rpc2NvdmVyJyxcbiAgamNiOiAnamNiJyxcbiAgdW5pb25wYXk6ICd1bmlvbnBheScsXG4gIG1hZXN0cm86ICdtYXN0ZXJjYXJkJyxcbiAgZWxvOiAnZGlzY292ZXInLFxuICBtaXI6ICd1bmtub3duJyxcbiAgaGlwZXI6ICdkaXNjb3ZlcicsXG4gIGhpcGVyY2FyZDogJ2Rpc2NvdmVyJ1xufTtcblxudmFyIHRva2VuaXplck5vblNlY3VyZUZpZWxkcyA9IFtcbiAgJ2JpbGxpbmdBZGRyZXNzJyxcbiAgJ2NvbXBhbnknLFxuICAnZW1haWwnLFxuICAnbmFtZScsXG4gICdwaG9uZU51bWJlcicsXG4gICdjdXN0b21lcicsXG4gICdhY2NvdW50VmFsaWRhdGlvbicsXG4gICdiYW5rQWNjb3VudFR5cGUnLFxuICAncm91dGluZ051bWJlcidcbl07XG5cbnZhciBjb25zdGFudHMgPSB7XG4gIFZFUlNJT046IFZFUlNJT04sXG4gIFBBWU1FTlRfVFlQRV9DUkVESVRfQ0FSRDogJ2NyZWRpdF9jYXJkJyxcbiAgbWF4RXhwaXJhdGlvblllYXJBZ2U6IDMxLFxuICBleHRlcm5hbEV2ZW50czoge1xuICAgIENIQU5HRTogJ2NoYW5nZScsXG4gICAgRk9DVVM6ICdmb2N1cycsXG4gICAgQkxVUjogJ2JsdXInLFxuICAgIEVNUFRZOiAnZW1wdHknLFxuICAgIE5PVF9FTVBUWTogJ25vdEVtcHR5JyxcbiAgICBWQUxJRElUWV9DSEFOR0U6ICd2YWxpZGl0eUNoYW5nZScsXG4gICAgQ0FSRF9UWVBFX0NIQU5HRTogJ2NhcmRUeXBlQ2hhbmdlJ1xuICB9LFxuICBleHRlcm5hbENsYXNzZXM6IHtcbiAgICBGT0NVU0VEOiAnc2VhbWxlc3NwYXktY2FyZC1lbGVtZW50LWZvY3VzZWQnLFxuICAgIElOVkFMSUQ6ICdzZWFtbGVzc3BheS1jYXJkLWVsZW1lbnQtaW52YWxpZCcsXG4gICAgVkFMSUQ6ICdzZWFtbGVzc3BheS1jYXJkLWVsZW1lbnQtdmFsaWQnXG4gIH0sXG4gIGRlZmF1bHRJRnJhbWVTdHlsZToge1xuICAgICdib3JkZXInOiBbJ25vbmUnLCAnaW1wb3J0YW50J10sXG4gICAgJ21hcmdpbic6IFsnMHB4JywgJ2ltcG9ydGFudCddLFxuICAgICdwYWRkaW5nJzogWycwcHgnLCAnaW1wb3J0YW50J10sXG4gICAgJ3dpZHRoJzogWycxcHgnLCAnaW1wb3J0YW50J10sXG4gICAgJ21pbi13aWR0aCc6IFsnMTAwJScsICdpbXBvcnRhbnQnXSxcbiAgICAnb3ZlcmZsb3cnOiBbJ2hpZGRlbicsICdpbXBvcnRhbnQnXSxcbiAgICAnZGlzcGxheSc6IFsnYmxvY2snLCAnaW1wb3J0YW50J10sXG4gICAgJ3VzZXItc2VsZWN0JzogWydub25lJywgJ2ltcG9ydGFudCddLFxuICAgICdoZWlnaHQnOiBbJzE5LjJweCddXG4gIH0sXG4gIHdoaXRlbGlzdGVkU3R5bGVzOiBbXG4gICAgJy1tb3otYXBwZWFyYW5jZScsXG4gICAgJy1tb3otb3N4LWZvbnQtc21vb3RoaW5nJyxcbiAgICAnLW1vei10YXAtaGlnaGxpZ2h0LWNvbG9yJyxcbiAgICAnLW1vei10cmFuc2l0aW9uJyxcbiAgICAnLXdlYmtpdC1hcHBlYXJhbmNlJyxcbiAgICAnLXdlYmtpdC1mb250LXNtb290aGluZycsXG4gICAgJy13ZWJraXQtdGFwLWhpZ2hsaWdodC1jb2xvcicsXG4gICAgJy13ZWJraXQtdHJhbnNpdGlvbicsXG4gICAgJ2FwcGVhcmFuY2UnLFxuICAgICdjb2xvcicsXG4gICAgJ2RpcmVjdGlvbicsXG4gICAgJ2ZvbnQnLFxuICAgICdmb250LWZhbWlseScsXG4gICAgJ2ZvbnQtc2l6ZScsXG4gICAgJ2ZvbnQtc2l6ZS1hZGp1c3QnLFxuICAgICdmb250LXN0cmV0Y2gnLFxuICAgICdmb250LXN0eWxlJyxcbiAgICAnZm9udC12YXJpYW50JyxcbiAgICAnZm9udC12YXJpYW50LWFsdGVybmF0ZXMnLFxuICAgICdmb250LXZhcmlhbnQtY2FwcycsXG4gICAgJ2ZvbnQtdmFyaWFudC1lYXN0LWFzaWFuJyxcbiAgICAnZm9udC12YXJpYW50LWxpZ2F0dXJlcycsXG4gICAgJ2ZvbnQtdmFyaWFudC1udW1lcmljJyxcbiAgICAnZm9udC13ZWlnaHQnLFxuICAgICdsZXR0ZXItc3BhY2luZycsXG4gICAgJ2xpbmUtaGVpZ2h0JyxcbiAgICAnbWFyZ2luJyxcbiAgICAnbWFyZ2luLXRvcCcsXG4gICAgJ21hcmdpbi1yaWdodCcsXG4gICAgJ21hcmdpbi1ib3R0b20nLFxuICAgICdtYXJnaW4tbGVmdCcsXG4gICAgJ29wYWNpdHknLFxuICAgICdvdXRsaW5lJyxcbiAgICAncGFkZGluZycsXG4gICAgJ3BhZGRpbmctdG9wJyxcbiAgICAncGFkZGluZy1yaWdodCcsXG4gICAgJ3BhZGRpbmctYm90dG9tJyxcbiAgICAncGFkZGluZy1sZWZ0JyxcbiAgICAndGV4dC1hbGlnbicsXG4gICAgJ3RleHQtc2hhZG93JyxcbiAgICAndHJhbnNpdGlvbidcbiAgXSxcbiAgd2hpdGVsaXN0ZWRGaWVsZHM6IHdoaXRlbGlzdGVkRmllbGRzLFxuICBjYXJkQnJhbmRNYXA6IGNhcmRCcmFuZE1hcCxcbiAgdG9rZW5pemVyTm9uU2VjdXJlRmllbGRzOiB0b2tlbml6ZXJOb25TZWN1cmVGaWVsZHMsXG4gIHdoaXRlbGlzdGVkQXR0cmlidXRlczoge1xuICAgICdhcmlhLWludmFsaWQnOiAnYm9vbGVhbicsXG4gICAgJ2FyaWEtcmVxdWlyZWQnOiAnYm9vbGVhbicsXG4gICAgZGlzYWJsZWQ6ICdib29sZWFuJyxcbiAgICBwbGFjZWhvbGRlcjogJ3N0cmluZydcbiAgfSxcbiAgYXV0b2NvbXBsZXRlTWFwcGluZ3M6IHtcbiAgICAnYWNjb3VudC1udW1iZXInOiAnY2MtbnVtYmVyJyxcbiAgICAnZXhwLWRhdGUnOiAnY2MtZXhwJyxcbiAgICBjdnY6ICdjYy1jc2MnLFxuICAgICdwb3N0YWwtY29kZSc6ICdiaWxsaW5nIHBvc3RhbC1jb2RlJ1xuICB9LFxuICByZXF1ZXN0VHlwZXM6IHJlcXVlc3RUeXBlc1xufTtcblxuY29uc3RhbnRzLmV2ZW50cyA9IGVudW1lcmF0ZShbXG4gICdBVVRPRklMTF9FWFBJUkFUSU9OX0RBVEUnLFxuICAnRlJBTUVfUkVBRFknLFxuICAnVkFMSURBVEVfU1RSSUNUJyxcbiAgJ0NPTkZJR1VSQVRJT04nLFxuICAnVE9LRU5JWkFUSU9OX1JFUVVFU1QnLFxuICAnSU5QVVRfRVZFTlQnLFxuICAnVFJJR0dFUl9JTlBVVF9GT0NVUycsXG4gICdBRERfQ0xBU1MnLFxuICAnUkVNT1ZFX0NMQVNTJyxcbiAgJ1NFVF9BVFRSSUJVVEUnLFxuICAnUkVNT1ZFX0FUVFJJQlVURScsXG4gICdDTEVBUl9GSUVMRCcsXG5dLCAnY2FyZC1lbGVtZW50OicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbnN0YW50cztcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFNlYW1sZXNzcGF5RXJyb3IgPSByZXF1aXJlKCcuLi8uLi9saWIvc2VhbWxlc3NwYXktZXJyb3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIENBUkRfRUxFTUVOVF9JTlZBTElEX0ZJRUxEX1NFTEVDVE9SOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnQ0FSRF9FTEVNRU5UX0lOVkFMSURfRklFTERfU0VMRUNUT1InLFxuICAgIG1lc3NhZ2U6ICdTZWxlY3RvciBkb2VzIG5vdCByZWZlcmVuY2UgYSB2YWxpZCBET00gbm9kZS4nXG4gIH0sXG4gIENBUkRfRUxFTUVOVF9GSUVMRF9JTlZBTElEOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnQ0FSRF9FTEVNRU5UX0ZJRUxEX0lOVkFMSUQnXG4gIH0sXG4gIENBUkRfRUxFTUVOVF9UT0tFTklaQVRJT05fTkVUV09SS19FUlJPUjoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTkVUV09SSyxcbiAgICBjb2RlOiAnQ0FSRF9FTEVNRU5UX1RPS0VOSVpBVElPTl9ORVRXT1JLX0VSUk9SJyxcbiAgICBtZXNzYWdlOiAnQSB0b2tlbml6YXRpb24gbmV0d29yayBlcnJvciBvY2N1cnJlZC4nXG4gIH0sXG4gIENBUkRfRUxFTUVOVF9GQUlMRURfVE9LRU5JWkFUSU9OOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5DVVNUT01FUixcbiAgICBjb2RlOiAnQ0FSRF9FTEVNRU5UX0ZBSUxFRF9UT0tFTklaQVRJT04nLFxuICAgIG1lc3NhZ2U6ICdUaGUgc3VwcGxpZWQgY2FyZCBkYXRhIGZhaWxlZCB0b2tlbml6YXRpb24uJ1xuICB9LFxuICBDQVJEX0VMRU1FTlRfRklFTERTX0VNUFRZOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5DVVNUT01FUixcbiAgICBjb2RlOiAnQ0FSRF9FTEVNRU5UX0ZJRUxEU19FTVBUWScsXG4gICAgbWVzc2FnZTogJ0FsbCBmaWVsZHMgYXJlIGVtcHR5LiBDYW5ub3QgdG9rZW5pemUgZW1wdHkgY2FyZCBmaWVsZHMuJ1xuICB9LFxuICBDQVJEX0VMRU1FTlRfRklFTERTX0lOVkFMSUQ6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLkNVU1RPTUVSLFxuICAgIGNvZGU6ICdDQVJEX0VMRU1FTlRfRklFTERTX0lOVkFMSUQnLFxuICAgIG1lc3NhZ2U6ICdTb21lIHBheW1lbnQgaW5wdXQgZmllbGRzIGFyZSBpbnZhbGlkLiBDYW5ub3QgdG9rZW5pemUgaW52YWxpZCBjYXJkIGZpZWxkcy4nXG4gIH0sXG4gIENBUkRfRUxFTUVOVF9BVFRSSUJVVEVfTk9UX1NVUFBPUlRFRDoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTUVSQ0hBTlQsXG4gICAgY29kZTogJ0NBUkRfRUxFTUVOVF9BVFRSSUJVVEVfTk9UX1NVUFBPUlRFRCdcbiAgfSxcbiAgQ0FSRF9FTEVNRU5UX0FUVFJJQlVURV9WQUxVRV9OT1RfQUxMT1dFRDoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTUVSQ0hBTlQsXG4gICAgY29kZTogJ0NBUkRfRUxFTUVOVF9BVFRSSUJVVEVfVkFMVUVfTk9UX0FMTE9XRUQnXG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBEZXN0cnVjdG9yID0gcmVxdWlyZSgnLi4vLi4vbGliL2Rlc3RydWN0b3InKTtcbnZhciBpRnJhbWVyID0gcmVxdWlyZSgnQGJyYWludHJlZS9pZnJhbWVyJyk7XG52YXIgQnVzID0gcmVxdWlyZSgnLi4vLi4vbGliL2J1cycpO1xudmFyIFNlYW1sZXNzcGF5RXJyb3IgPSByZXF1aXJlKCcuLi8uLi9saWIvc2VhbWxlc3NwYXktZXJyb3InKTtcbnZhciBjb21wb3NlVXJsID0gcmVxdWlyZSgnLi9jb21wb3NlLXVybCcpO1xudmFyIGNvbnN0YW50cyA9IHJlcXVpcmUoJy4uL3NoYXJlZC9jb25zdGFudHMnKTtcbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCcuLi8uLi9saWIvZXZlbnQtZW1pdHRlcicpO1xudmFyIHV1aWQgPSByZXF1aXJlKCcuLi8uLi9saWIvdXVpZCcpO1xudmFyIGluamVjdEZyYW1lID0gcmVxdWlyZSgnLi9pbmplY3QtZnJhbWUnKTtcbnZhciBWRVJTSU9OID0gXCJ3ZWItc2RrXCI7XG52YXIgc2hhcmVkRXJyb3JzID0gcmVxdWlyZSgnLi4vLi4vbGliL2Vycm9ycycpO1xudmFyIGVycm9ycyA9IHJlcXVpcmUoJy4uL3NoYXJlZC9lcnJvcnMnKTtcblxudmFyIGV2ZW50cyA9IGNvbnN0YW50cy5ldmVudHM7XG5cbi8qKlxuICogQGNsYXNzIENoZWNrb3V0QnV0dG9uXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyBUaGUgQ2hlY2tvdXQgQnV0dG9uIHtAbGluayBtb2R1bGU6c2VhbWxlc3NwYXktd2ViL2NoZWNrb3V0LWJ1dHRvbi5jcmVhdGUgY3JlYXRlfSBvcHRpb25zLlxuICogQGRlc2NyaXB0aW9uIDxzdHJvbmc+RG8gbm90IHVzZSB0aGlzIGNvbnN0cnVjdG9yIGRpcmVjdGx5LiBVc2Uge0BsaW5rIG1vZHVsZTpzZWFtbGVzc3BheS13ZWIvY2hlY2tvdXQtYnV0dG9uLmNyZWF0ZXxzZWFtbGVzc3BheS13ZWIuY2hlY2tvdXQtYnV0dG9uLmNyZWF0ZX0gaW5zdGVhZC48L3N0cm9uZz5cbiAqIEBjbGFzc2Rlc2MgVGhpcyBjbGFzcyByZXByZXNlbnRzIGEgQ2hlY2tvdXQgQnV0dG9uIGNvbXBvbmVudCBwcm9kdWNlZCBieSB7QGxpbmsgbW9kdWxlOnNlYW1sZXNzcGF5LXdlYi9jaGVja291dC1idXR0b24uY3JlYXRlfHNlYW1sZXNzcGF5LXdlYi9jaGVja291dC1idXR0b24uY3JlYXRlfS4gSW5zdGFuY2VzIG9mIHRoaXMgY2xhc3MgaGF2ZSBtZXRob2RzIGZvciBpbnRlcmFjdGluZyB3aXRoIHRoZSBpbnB1dCBmaWVsZHMgd2l0aGluIENoZWNrb3V0IEJ1dHRvbicgaWZyYW1lcy5cbiAqL1xuZnVuY3Rpb24gQ2hlY2tvdXRCdXR0b24ob3B0aW9ucykge1xuICB2YXIgY2xpZW50VmVyc2lvbiwgY2xpZW50Q29uZmlnO1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciBjb21wb25lbnRJZCA9IHV1aWQoKTtcblxuICBpZiAoIW9wdGlvbnMuY2xpZW50KSB7XG4gICAgdGhyb3cgbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgdHlwZTogc2hhcmVkRXJyb3JzLklOU1RBTlRJQVRJT05fT1BUSU9OX1JFUVVJUkVELnR5cGUsXG4gICAgICBjb2RlOiBzaGFyZWRFcnJvcnMuSU5TVEFOVElBVElPTl9PUFRJT05fUkVRVUlSRUQuY29kZSxcbiAgICAgIG1lc3NhZ2U6ICdvcHRpb25zLmNsaWVudCBpcyByZXF1aXJlZCB3aGVuIGluc3RhbnRpYXRpbmcgQ2hlY2tvdXQgQnV0dG9uLidcbiAgICB9KTtcbiAgfVxuXG4gIGNsaWVudENvbmZpZyA9IG9wdGlvbnMuY2xpZW50LmdldENvbmZpZ3VyYXRpb24oKTtcbiAgY2xpZW50VmVyc2lvbiA9IGNsaWVudENvbmZpZy5hbmFseXRpY3NNZXRhZGF0YS5zZGtWZXJzaW9uO1xuICBpZiAoY2xpZW50VmVyc2lvbiAhPT0gVkVSU0lPTikge1xuICAgIHRocm93IG5ldyBTZWFtbGVzc3BheUVycm9yKHtcbiAgICAgIHR5cGU6IHNoYXJlZEVycm9ycy5JTkNPTVBBVElCTEVfVkVSU0lPTlMudHlwZSxcbiAgICAgIGNvZGU6IHNoYXJlZEVycm9ycy5JTkNPTVBBVElCTEVfVkVSU0lPTlMuY29kZSxcbiAgICAgIG1lc3NhZ2U6ICdDbGllbnQgKHZlcnNpb24gJyArIGNsaWVudFZlcnNpb24gKyAnKSBhbmQgQ2hlY2tvdXQgQnV0dG9uICh2ZXJzaW9uICcgKyBWRVJTSU9OICsgJykgY29tcG9uZW50cyBtdXN0IGJlIGZyb20gdGhlIHNhbWUgU0RLIHZlcnNpb24uJ1xuICAgIH0pO1xuICB9XG5cbiAgaWYgKCFvcHRpb25zLmFtb3VudCkge1xuICAgIHRocm93IG5ldyBTZWFtbGVzc3BheUVycm9yKHtcbiAgICAgIHR5cGU6IHNoYXJlZEVycm9ycy5JTlNUQU5USUFUSU9OX09QVElPTl9SRVFVSVJFRC50eXBlLFxuICAgICAgY29kZTogc2hhcmVkRXJyb3JzLklOU1RBTlRJQVRJT05fT1BUSU9OX1JFUVVJUkVELmNvZGUsXG4gICAgICBtZXNzYWdlOiAnb3B0aW9ucy5hbW91bnQgaXMgcmVxdWlyZWQgd2hlbiBpbnN0YW50aWF0aW5nIENoZWNrb3V0IEJ1dHRvbi4nXG4gICAgfSk7XG4gIH1cblxuICBpZiAoIW9wdGlvbnMuZm9ybVBhdGgpIHtcbiAgICB0aHJvdyBuZXcgU2VhbWxlc3NwYXlFcnJvcih7XG4gICAgICB0eXBlOiBzaGFyZWRFcnJvcnMuSU5TVEFOVElBVElPTl9PUFRJT05fUkVRVUlSRUQudHlwZSxcbiAgICAgIGNvZGU6IHNoYXJlZEVycm9ycy5JTlNUQU5USUFUSU9OX09QVElPTl9SRVFVSVJFRC5jb2RlLFxuICAgICAgbWVzc2FnZTogJ29wdGlvbnMuZm9ybVBhdGggaXMgcmVxdWlyZWQgd2hlbiBpbnN0YW50aWF0aW5nIENoZWNrb3V0IEJ1dHRvbi4nXG4gICAgfSk7XG4gIH1cblxuICBpZiAoIW9wdGlvbnMuc2VsZWN0b3IpIHtcbiAgICB0aHJvdyBuZXcgU2VhbWxlc3NwYXlFcnJvcih7XG4gICAgICB0eXBlOiBzaGFyZWRFcnJvcnMuSU5TVEFOVElBVElPTl9PUFRJT05fUkVRVUlSRUQudHlwZSxcbiAgICAgIGNvZGU6IHNoYXJlZEVycm9ycy5JTlNUQU5USUFUSU9OX09QVElPTl9SRVFVSVJFRC5jb2RlLFxuICAgICAgbWVzc2FnZTogJ29wdGlvbnMuc2VsZWN0b3IgaXMgcmVxdWlyZWQgd2hlbiBpbnN0YW50aWF0aW5nIENoZWNrb3V0IEJ1dHRvbi4nXG4gICAgfSk7XG4gIH1cblxuICB2YXIga2V5ID0gY29uc3RhbnRzLkJVVFRPTl9LRVk7XG4gIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKG9wdGlvbnMuc2VsZWN0b3IpO1xuXG4gIGlmICghY29udGFpbmVyKSB7XG4gICAgdGhyb3cgbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgdHlwZTogZXJyb3JzLkNIRUNLT1VUX0JVVFRPTl9JTlZBTElEX0ZJRUxEX1NFTEVDVE9SLnR5cGUsXG4gICAgICBjb2RlOiBlcnJvcnMuQ0hFQ0tPVVRfQlVUVE9OX0lOVkFMSURfRklFTERfU0VMRUNUT1IuY29kZSxcbiAgICAgIG1lc3NhZ2U6IGVycm9ycy5DSEVDS09VVF9CVVRUT05fSU5WQUxJRF9GSUVMRF9TRUxFQ1RPUi5tZXNzYWdlLFxuICAgICAgZGV0YWlsczoge1xuICAgICAgICBmaWVsZFNlbGVjdG9yOiBvcHRpb25zLnNlbGVjdG9yLFxuICAgICAgICBmaWVsZEtleToga2V5XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBFdmVudEVtaXR0ZXIuY2FsbCh0aGlzKTtcblxuICB0aGlzLl9pbmplY3RlZE5vZGVzID0gW107XG4gIHRoaXMuX2Rlc3RydWN0b3IgPSBuZXcgRGVzdHJ1Y3RvcigpO1xuICB0aGlzLl9zdGF0ZSA9IHt9O1xuXG4gIHRoaXMuX2J1cyA9IG5ldyBCdXMoe1xuICAgIGNoYW5uZWw6IGNvbXBvbmVudElkLFxuICAgIG1lcmNoYW50VXJsOiBsb2NhdGlvbi5ocmVmXG4gIH0pO1xuXG4gIHRoaXMuX2Rlc3RydWN0b3IucmVnaXN0ZXJGdW5jdGlvbkZvclRlYXJkb3duKGZ1bmN0aW9uICgpIHtcbiAgICBzZWxmLl9idXMudGVhcmRvd24oKTtcbiAgfSk7XG5cbiAgdGhpcy5fY2xpZW50ID0gb3B0aW9ucy5jbGllbnQ7XG5cbiAgdmFyIGZyYW1lID0gaUZyYW1lcih7XG4gICAgdHlwZToga2V5LFxuICAgIG5hbWU6ICdzZWFtbGVzc3BheS1jaGVja291dC1idXR0b24nLFxuICAgIHN0eWxlOiB7XG4gICAgICBib3JkZXI6ICdub25lJyxcbiAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICdmbG9hdCc6ICdsZWZ0J1xuICAgIH1cbiAgfSk7XG5cbiAgdGhpcy5faW5qZWN0ZWROb2RlcyA9IHRoaXMuX2luamVjdGVkTm9kZXMuY29uY2F0KGluamVjdEZyYW1lKGZyYW1lLCBjb250YWluZXIpKTtcblxuICB0aGlzLl9zdGF0ZVtrZXldID0ge1xuICAgIGlzRW1wdHk6IHRydWUsXG4gICAgaXNWYWxpZDogZmFsc2UsXG4gICAgaXNQb3RlbnRpYWxseVZhbGlkOiB0cnVlLFxuICAgIGlzRm9jdXNlZDogZmFsc2UsXG4gICAgY29udGFpbmVyOiBjb250YWluZXJcbiAgfTtcblxuICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICBmcmFtZS5zcmMgPSBjb21wb3NlVXJsKGNsaWVudENvbmZpZywgY29tcG9uZW50SWQsIGNsaWVudENvbmZpZy5pc0RlYnVnKTtcbiAgfSwgMCk7XG5cbiAgdGhpcy5fYnVzLm9uKGV2ZW50cy5GUkFNRV9SRUFEWSwgZnVuY3Rpb24gKHJlcGx5KSB7XG4gICAgcmVwbHkob3B0aW9ucyk7XG4gICAgc2VsZi5fZW1pdCgncmVhZHknKTtcbiAgfSk7XG5cbiAgdGhpcy5fZGVzdHJ1Y3Rvci5yZWdpc3RlckZ1bmN0aW9uRm9yVGVhcmRvd24oXG4gICAgZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGosIG5vZGUsIHBhcmVudDtcblxuICAgICAgZm9yIChqID0gMDsgaiA8IHNlbGYuX2luamVjdGVkTm9kZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgbm9kZSA9IHNlbGYuX2luamVjdGVkTm9kZXNbal07XG4gICAgICAgIHBhcmVudCA9IG5vZGUucGFyZW50Tm9kZTtcblxuICAgICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQobm9kZSk7XG4gICAgICB9XG4gICAgfVxuICApO1xuXG59XG5cbkNoZWNrb3V0QnV0dG9uLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXZlbnRFbWl0dGVyLnByb3RvdHlwZSwge1xuICBjb25zdHJ1Y3RvcjogQ2hlY2tvdXRCdXR0b25cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENoZWNrb3V0QnV0dG9uO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGNvbnN0YW50cyA9IHJlcXVpcmUoJy4uL3NoYXJlZC9jb25zdGFudHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjb21wb3NlVXJsKGNvbmZpZywgY29tcG9uZW50SWQsIGlzRGVidWcpIHtcbiAgdmFyIGFzc2V0c1VybCA9IGNvbmZpZy5nYXRld2F5Q29uZmlndXJhdGlvbi5hc3NldHNVcmw7XG5cbiAgaWYgKGlzRGVidWcpIHtcbiAgICBhc3NldHNVcmwgPSBhc3NldHNVcmwucmVwbGFjZSgnaHR0cHMnLCAnaHR0cCcpO1xuICB9XG4gIHZhciBtaW4gPSBpc0RlYnVnID8gJycgOiAnLm1pbic7XG5cbiAgcmV0dXJuIGFzc2V0c1VybCArICcvJyArIGNvbnN0YW50cy5WRVJTSU9OICsgJy9odG1sL2NoZWNrb3V0LWJ1dHRvbi1mcmFtZScgKyBtaW4gKyAnLmh0bWwjJyArIGNvbXBvbmVudElkO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmplY3RGcmFtZShmcmFtZSwgY29udGFpbmVyKSB7XG4gIHZhciBjbGVhcmJvdGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgdmFyIGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXG4gIGNsZWFyYm90aC5zdHlsZS5jbGVhciA9ICdib3RoJztcblxuICBmcmFnbWVudC5hcHBlbmRDaGlsZChmcmFtZSk7XG4gIGZyYWdtZW50LmFwcGVuZENoaWxkKGNsZWFyYm90aCk7XG5cbiAgY29udGFpbmVyLmFwcGVuZENoaWxkKGZyYWdtZW50KTtcblxuICByZXR1cm4gW2ZyYW1lLCBjbGVhcmJvdGhdO1xufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8qKiBAbW9kdWxlIHNlYW1sZXNzcGF5LXdlYi9jaGVja291dC1idXR0b24gKi9cblxudmFyIENoZWNrb3V0QnV0dG9uID0gcmVxdWlyZSgnLi9leHRlcm5hbC9jaGVja291dC1idXR0b24nKTtcbnZhciB3cmFwUHJvbWlzZSA9IHJlcXVpcmUoJ0BicmFpbnRyZWUvd3JhcC1wcm9taXNlJyk7XG52YXIgUHJvbWlzZSA9IHJlcXVpcmUoJy4uL2xpYi9wcm9taXNlJyk7XG5cbnZhciBWRVJTSU9OID0gXCJ3ZWItc2RrXCI7XG5cbmZ1bmN0aW9uIGNyZWF0ZShvcHRpb25zKSB7XG4gIHZhciBpbnRlZ3JhdGlvbjtcblxuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcbiAgICBpbnRlZ3JhdGlvbiA9IG5ldyBDaGVja291dEJ1dHRvbihvcHRpb25zKTtcblxuICAgIGludGVncmF0aW9uLm9uKCdyZWFkeScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJlc29sdmUoaW50ZWdyYXRpb24pO1xuICAgIH0pO1xuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNyZWF0ZTogd3JhcFByb21pc2UoY3JlYXRlKSxcbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBUaGUgY3VycmVudCB2ZXJzaW9uIG9mIHRoZSBTREssIGkuZS4gYHtAcGtnIHZlcnNpb259YC5cbiAgICogQHR5cGUge3N0cmluZ31cbiAgICovXG4gIFZFUlNJT046IFZFUlNJT05cbn07XG4iLCJ2YXIgZW51bWVyYXRlID0gcmVxdWlyZSgnLi4vLi4vbGliL2VudW1lcmF0ZScpO1xuXG52YXIgVkVSU0lPTiA9IFwid2ViLXNka1wiO1xudmFyIEJVVFRPTl9LRVkgPSAnY2hlY2tvdXQtYnV0dG9uJztcbnZhciBCVVRUT05fVEVYVCA9ICdQYXkgTm93JztcbnZhciBERUZBVUxUX1NUWUxFID0ge1xuICB3ZWJraXRBcHBlYXJhbmNlOiAnYnV0dG9uJyxcbiAgY29sb3I6ICcjZmZmJyxcbiAgYmFja2dyb3VuZENvbG9yOiAnIzE4OTBmZicsXG4gIGJvcmRlckNvbG9yOiAnIzE4OTBmZicsXG4gIHRleHRTaGFkb3c6ICcwIC0xcHggMCByZ2JhKDAsIDAsIDAsIDAuMTIpJyxcbiAgYm94U2hhZG93OiAnMCAycHggMCByZ2JhKDAsIDAsIDAsIDAuMDQ1KScsXG4gIGxpbmVIZWlnaHQ6ICcxLjQ5OScsXG4gIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyxcbiAgZm9udFdlaWdodDogNDAwLFxuICB3aGl0ZVNwYWNlOiAnbm93cmFwJyxcbiAgdGV4dEFsaWduOiAnY2VudGVyJyxcbiAgYmFja2dyb3VuZEltYWdlOiAnbm9uZScsXG4gIGJvcmRlcjogJzFweCBzb2xpZCB0cmFuc3BhcmVudCcsXG4gIGN1cnNvcjogJ3BvaW50ZXInLFxuICB0cmFuc2l0aW9uOiAnYWxsIDAuM3MgY3ViaWMtYmV6aWVyKDAuNjQ1LCAwLjA0NSwgMC4zNTUsIDEpJyxcbiAgaGVpZ2h0OiAnMzJweCcsXG4gIHBhZGRpbmc6ICcwIDE1cHgnLFxuICBmb250U2l6ZTogJzE0cHgnLFxuICBib3JkZXJSYWRpdXM6ICc0cHgnLFxuICB1c2VyU2VsZWN0OiAnbm9uZScsXG4gIHRvdWNoQWN0aW9uOiAnbWFuaXB1bGF0aW9uJ1xufTtcblxudmFyIGV2ZW50cyA9IGVudW1lcmF0ZShcbiAgWyAnRlJBTUVfUkVBRFknXSxcbiAgJ2NoZWNrb3V0LWJ1dHRvbjonXG4pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgVkVSU0lPTjogVkVSU0lPTixcbiAgQlVUVE9OX0tFWTogQlVUVE9OX0tFWSxcbiAgQlVUVE9OX1RFWFQ6IEJVVFRPTl9URVhULFxuICBERUZBVUxUX1NUWUxFOiBERUZBVUxUX1NUWUxFLFxuICBldmVudHM6IGV2ZW50c1xufTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgU2VhbWxlc3NwYXlFcnJvciA9IHJlcXVpcmUoJy4uLy4uL2xpYi9zZWFtbGVzc3BheS1lcnJvcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgQ0hFQ0tPVVRfQlVUVE9OX0lOVkFMSURfRklFTERfU0VMRUNUT1I6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLk1FUkNIQU5ULFxuICAgIGNvZGU6ICdDSEVDS09VVF9CVVRUT05fSU5WQUxJRF9GSUVMRF9TRUxFQ1RPUicsXG4gICAgbWVzc2FnZTogJ1NlbGVjdG9yIGRvZXMgbm90IHJlZmVyZW5jZSBhIHZhbGlkIERPTSBub2RlLidcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHJlcXVlc3QgPSByZXF1aXJlKCcuL3JlcXVlc3QnKTtcbnZhciBpc1doaXRlbGlzdGVkRG9tYWluID0gcmVxdWlyZSgnLi4vbGliL2lzLXdoaXRlbGlzdGVkLWRvbWFpbicpO1xudmFyIFNlYW1sZXNzcGF5RXJyb3IgPSByZXF1aXJlKCcuLi9saWIvc2VhbWxlc3NwYXktZXJyb3InKTtcbnZhciBjb252ZXJ0VG9TZWFtbGVzc3BheUVycm9yID0gcmVxdWlyZSgnLi4vbGliL2NvbnZlcnQtdG8tc2VhbWxlc3NwYXktZXJyb3InKTtcbnZhciBhZGRNZXRhZGF0YSA9IHJlcXVpcmUoJy4uL2xpYi9hZGQtbWV0YWRhdGEnKTtcbnZhciBQcm9taXNlID0gcmVxdWlyZSgnLi4vbGliL3Byb21pc2UnKTtcbnZhciBhc3NpZ24gPSByZXF1aXJlKCcuLi9saWIvYXNzaWduJykuYXNzaWduO1xudmFyIGNvbnN0YW50cyA9IHJlcXVpcmUoJy4vY29uc3RhbnRzJyk7XG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMnKTtcbnZhciBzaGFyZWRFcnJvcnMgPSByZXF1aXJlKCcuLi9saWIvZXJyb3JzJyk7XG52YXIgVkVSU0lPTiA9IHJlcXVpcmUoJy4uL2xpYi9jb25zdGFudHMnKS5WRVJTSU9OO1xuXG4vKipcbiAqIFRoaXMgb2JqZWN0IGlzIHJldHVybmVkIGJ5IHtAbGluayBDbGllbnQjZ2V0Q29uZmlndXJhdGlvbnxnZXRDb25maWd1cmF0aW9ufS4gVGhpcyBpbmZvcm1hdGlvbiBpcyB1c2VkIGV4dGVuc2l2ZWx5IGJ5IG90aGVyIFNlYW1sZXNzcGF5IG1vZHVsZXMgdG8gcHJvcGVybHkgY29uZmlndXJlIHRoZW1zZWx2ZXMuXG4gKiBAdHlwZWRlZiB7b2JqZWN0fSBDbGllbnR+Y29uZmlndXJhdGlvblxuICogQHByb3BlcnR5IHtvYmplY3R9IGNsaWVudCBUaGUgc2VhbWxlc3NwYXktd2ViL2NsaWVudCBwYXJhbWV0ZXJzLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IGNsaWVudC5hdXRob3JpemF0aW9uIEEgdG9rZW5pemF0aW9uS2V5IG9yIGNsaWVudFRva2VuLlxuICogQHByb3BlcnR5IHtvYmplY3R9IGdhdGV3YXlDb25maWd1cmF0aW9uIEdhdGV3YXktc3VwcGxpZWQgY29uZmlndXJhdGlvbi5cbiAqIEBwcm9wZXJ0eSB7b2JqZWN0fSBhbmFseXRpY3NNZXRhZGF0YSBBbmFseXRpY3Mtc3BlY2lmaWMgZGF0YS5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBhbmFseXRpY3NNZXRhZGF0YS5zZXNzaW9uSWQgVW5pcXVlbHkgaWRlbnRpZmllcyBhIGJyb3dzaW5nIHNlc3Npb24uXG4gKiBAcHJvcGVydHkge3N0cmluZ30gYW5hbHl0aWNzTWV0YWRhdGEuc2RrVmVyc2lvbiBUaGUgc2VhbWxlc3NwYXkuanMgdmVyc2lvbi5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBhbmFseXRpY3NNZXRhZGF0YS5tZXJjaGFudEFwcElkIElkZW50aWZpZXMgdGhlIG1lcmNoYW50J3Mgd2ViIGFwcC5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBwcm94eUFjY291bnRJZCBJZGVudGlmaWVzIHRoZSBTdWIgTWVyY2hhbnQgQWNjb3VudCBJRC5cbiAqL1xuXG4vKipcbiAqIEBjbGFzc1xuICogQHBhcmFtIHtDbGllbnR+Y29uZmlndXJhdGlvbn0gY29uZmlndXJhdGlvbiBPcHRpb25zXG4gKiBAZGVzY3JpcHRpb24gPHN0cm9uZz5EbyBub3QgdXNlIHRoaXMgY29uc3RydWN0b3IgZGlyZWN0bHkuIFVzZSB7QGxpbmsgbW9kdWxlOnNlYW1sZXNzcGF5LXdlYi9jbGllbnQuY3JlYXRlfHNlYW1sZXNzcGF5LmNsaWVudC5jcmVhdGV9IGluc3RlYWQuPC9zdHJvbmc+XG4gKiBAY2xhc3NkZXNjIFRoaXMgY2xhc3MgaXMgcmVxdWlyZWQgYnkgbWFueSBvdGhlciBTZWFtbGVzc3BheSBjb21wb25lbnRzLiBJdCBzZXJ2ZXMgYXMgdGhlIGJhc2UgQVBJIGxheWVyIHRoYXQgY29tbXVuaWNhdGVzIHdpdGggb3VyIHNlcnZlcnMuIEl0IGlzIGFsc28gY2FwYWJsZSBvZiBiZWluZyB1c2VkIHRvIGZvcm11bGF0ZSBkaXJlY3QgY2FsbHMgdG8gb3VyIHNlcnZlcnMsIHN1Y2ggYXMgZGlyZWN0IGNyZWRpdCBjYXJkIHRva2VuaXphdGlvbi4gU2VlIHtAbGluayBDbGllbnQjcmVxdWVzdH0uXG4gKi9cbmZ1bmN0aW9uIENsaWVudChjb25maWd1cmF0aW9uKSB7XG4gIHZhclxuICAgIGNvbmZpZ3VyYXRpb25KU09OLFxuICAgIGdhdGV3YXlDb25maWd1cmF0aW9uLFxuICAgIHNlYW1sZXNzcGF5QXBpQ29uZmlndXJhdGlvbjtcblxuICBjb25maWd1cmF0aW9uID0gY29uZmlndXJhdGlvbiB8fCB7fTtcblxuICBjb25maWd1cmF0aW9uSlNPTiA9IEpTT04uc3RyaW5naWZ5KGNvbmZpZ3VyYXRpb24pO1xuICBnYXRld2F5Q29uZmlndXJhdGlvbiA9IGNvbmZpZ3VyYXRpb24uZ2F0ZXdheUNvbmZpZ3VyYXRpb247XG5cbiAgaWYgKCFnYXRld2F5Q29uZmlndXJhdGlvbikge1xuICAgIHRocm93IG5ldyBTZWFtbGVzc3BheUVycm9yKGVycm9ycy5DTElFTlRfTUlTU0lOR19HQVRFV0FZX0NPTkZJR1VSQVRJT04pO1xuICB9XG4gIFtcbiAgICAnYXNzZXRzVXJsJyxcbiAgICAnY2xpZW50QXBpVXJsJyxcbiAgICAndG9rZW5pemVyQXBpJ1xuICBdLmZvckVhY2goZnVuY3Rpb24gKHByb3BlcnR5KSB7XG4gICAgdmFyIGNvbmZpZ1VybCA9IChnYXRld2F5Q29uZmlndXJhdGlvbltwcm9wZXJ0eV0gJiYgZ2F0ZXdheUNvbmZpZ3VyYXRpb25bcHJvcGVydHldLnVybCkgfHwgZ2F0ZXdheUNvbmZpZ3VyYXRpb25bcHJvcGVydHldO1xuICAgIGlmIChwcm9wZXJ0eSBpbiBnYXRld2F5Q29uZmlndXJhdGlvbiAmJiAhaXNXaGl0ZWxpc3RlZERvbWFpbihjb25maWdVcmwpKSB7XG4gICAgICB0aHJvdyBuZXcgU2VhbWxlc3NwYXlFcnJvcih7XG4gICAgICAgIHR5cGU6IGVycm9ycy5DTElFTlRfR0FURVdBWV9DT05GSUdVUkFUSU9OX0lOVkFMSURfRE9NQUlOLnR5cGUsXG4gICAgICAgIGNvZGU6IGVycm9ycy5DTElFTlRfR0FURVdBWV9DT05GSUdVUkFUSU9OX0lOVkFMSURfRE9NQUlOLmNvZGUsXG4gICAgICAgIG1lc3NhZ2U6IHByb3BlcnR5ICsgJyBwcm9wZXJ0eSBpcyBvbiBhbiBpbnZhbGlkIGRvbWFpbi4gKCcgKyBjb25maWdVcmwgKyAnKSdcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBjb3B5IG9mIHRoZSBjb25maWd1cmF0aW9uIHZhbHVlcy5cbiAgICogQHB1YmxpY1xuICAgKiBAcmV0dXJucyB7Q2xpZW50fmNvbmZpZ3VyYXRpb259IGNvbmZpZ3VyYXRpb25cbiAgICovXG4gIHRoaXMuZ2V0Q29uZmlndXJhdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShjb25maWd1cmF0aW9uSlNPTik7XG4gIH07XG5cbiAgdGhpcy5fcmVxdWVzdCA9IHJlcXVlc3Q7XG5cbiAgdGhpcy5fY29uZmlndXJhdGlvbiA9IHRoaXMuZ2V0Q29uZmlndXJhdGlvbigpO1xuXG4gIHRoaXMuX2NsaWVudEFwaUJhc2VVcmwgPSBnYXRld2F5Q29uZmlndXJhdGlvbi5jbGllbnRBcGlVcmwgKyAnLyc7XG4gIHRoaXMuX3Rva2VuaXplckFwaSA9IGdhdGV3YXlDb25maWd1cmF0aW9uLnRva2VuaXplckFwaTtcblxuICBzZWFtbGVzc3BheUFwaUNvbmZpZ3VyYXRpb24gPSBnYXRld2F5Q29uZmlndXJhdGlvbi5zZWFtbGVzc3BheUFwaTtcbiAgaWYgKHNlYW1sZXNzcGF5QXBpQ29uZmlndXJhdGlvbikge1xuICAgIHRoaXMuX3NlYW1sZXNzcGF5QXBpID0ge1xuICAgICAgYmFzZVVybDogc2VhbWxlc3NwYXlBcGlDb25maWd1cmF0aW9uLnVybCArICcvJyxcbiAgICAgIGFjY2Vzc1Rva2VuOiBzZWFtbGVzc3BheUFwaUNvbmZpZ3VyYXRpb24uYWNjZXNzVG9rZW4sXG4gICAgICBwdWJsaXNoYWJsZVRva2VuOiBzZWFtbGVzc3BheUFwaUNvbmZpZ3VyYXRpb24ucHVibGlzaGFibGVUb2tlblxuICAgIH07XG4gICAgaWYgKCFpc1doaXRlbGlzdGVkRG9tYWluKHRoaXMuX3NlYW1sZXNzcGF5QXBpLmJhc2VVcmwpKSB7XG4gICAgICB0aHJvdyBuZXcgU2VhbWxlc3NwYXlFcnJvcih7XG4gICAgICAgIHR5cGU6IGVycm9ycy5DTElFTlRfR0FURVdBWV9DT05GSUdVUkFUSU9OX0lOVkFMSURfRE9NQUlOLnR5cGUsXG4gICAgICAgIGNvZGU6IGVycm9ycy5DTElFTlRfR0FURVdBWV9DT05GSUdVUkFUSU9OX0lOVkFMSURfRE9NQUlOLmNvZGUsXG4gICAgICAgIG1lc3NhZ2U6ICdzZWFtbGVzc3BheUFwaSBVUkwgaXMgb24gYW4gaW52YWxpZCBkb21haW4uJ1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogVXNlZCBieSBvdGhlciBtb2R1bGVzIHRvIGZvcm11bGF0ZSBhbGwgbmV0d29yayByZXF1ZXN0cyB0byB0aGUgU2VhbWxlc3NwYXkgZ2F0ZXdheS4gSXQgaXMgYWxzbyBjYXBhYmxlIG9mIGJlaW5nIHVzZWQgZGlyZWN0bHkgZnJvbSB5b3VyIG93biBmb3JtIHRvIHRva2VuaXplIGNyZWRpdCBjYXJkIGluZm9ybWF0aW9uLiBIb3dldmVyLCBiZSBzdXJlIHRvIHNhdGlzZnkgUENJIGNvbXBsaWFuY2UgaWYgeW91IHVzZSBkaXJlY3QgY2FyZCB0b2tlbml6YXRpb24uXG4gKiBAcHVibGljXG4gKiBAZnVuY3Rpb25cbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIFJlcXVlc3Qgb3B0aW9uczpcbiAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLm1ldGhvZCBIVFRQIG1ldGhvZCwgZS5nLiBcImdldFwiIG9yIFwicG9zdFwiLlxuICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbnMuZW5kcG9pbnQgRW5kcG9pbnQgcGF0aCwgZS5nLiBcInBheW1lbnRfbWV0aG9kc1wiLlxuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMuZGF0YSBEYXRhIHRvIHNlbmQgd2l0aCB0aGUgcmVxdWVzdC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy50aW1lb3V0PTYwMDAwXSBTZXQgYSB0aW1lb3V0IChpbiBtaWxsaXNlY29uZHMpIGZvciB0aGUgcmVxdWVzdC5cbiAqIEBwYXJhbSB7Y2FsbGJhY2t9IFtjYWxsYmFja10gVGhlIHNlY29uZCBhcmd1bWVudCwgPGNvZGU+ZGF0YTwvY29kZT4sIGlzIHRoZSByZXR1cm5lZCBzZXJ2ZXIgZGF0YS5cbiAqIEBleGFtcGxlXG4gKiA8Y2FwdGlvbj5EaXJlY3QgQ3JlZGl0IENhcmQgVG9rZW5pemF0aW9uPC9jYXB0aW9uPlxuICogdmFyIGNyZWF0ZUNsaWVudCA9IHJlcXVpcmUoJ3NlYW1sZXNzcGF5LXdlYi9jbGllbnQnKS5jcmVhdGU7XG4gKlxuICogY3JlYXRlQ2xpZW50KHtcbiAqICAgZW52aXJvbm1lbnQ6ICdzYW5kYm94J1xuICogICBhdXRob3JpemF0aW9uOiBDTElFTlRfQVVUSE9SSVpBVElPTlxuICogfSwgZnVuY3Rpb24gKGNyZWF0ZUVyciwgY2xpZW50SW5zdGFuY2UpIHtcbiAqICAgdmFyIGZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbXktZm9ybS1pZCcpO1xuICogICB2YXIgZGF0YSA9IHtcbiAqICAgICBjcmVkaXRDYXJkOiB7XG4gKiAgICAgICBudW1iZXI6IGZvcm1bJ2NjLW51bWJlciddLnZhbHVlLFxuICogICAgICAgY3Z2OiBmb3JtWydjYy1jdnYnXS52YWx1ZSxcbiAqICAgICAgIGV4cERhdGU6IGZvcm1bJ2NjLWRhdGUnXS52YWx1ZSxcbiAqICAgICAgIGJpbGxpbmdBZGRyZXNzOiB7XG4gKiAgICAgICAgIHBvc3RhbENvZGU6IGZvcm1bJ2NjLXBvc3RhbCddLnZhbHVlXG4gKiAgICAgICB9LFxuICogICAgICAgb3B0aW9uczoge1xuICogICAgICAgICB2YWxpZGF0ZTogZmFsc2VcbiAqICAgICAgIH1cbiAqICAgICB9XG4gKiAgIH07XG4gKlxuICogICAvLyBXYXJuaW5nOiBGb3IgYSBtZXJjaGFudCB0byBiZSBlbGlnaWJsZSBmb3IgdGhlIGVhc2llc3QgbGV2ZWwgb2YgUENJIGNvbXBsaWFuY2UgKFNBUSBBKSxcbiAqICAgLy8gcGF5bWVudCBmaWVsZHMgY2Fubm90IGJlIGhvc3RlZCBvbiB5b3VyIGNoZWNrb3V0IHBhZ2UuXG4gKiAgIC8vIEZvciBhbiBhbHRlcm5hdGl2ZSB0byB0aGUgZm9sbG93aW5nLCB1c2UgSG9zdGVkIEZpZWxkcy5cbiAqICAgY2xpZW50SW5zdGFuY2UucmVxdWVzdCh7XG4gKiAgICAgZW5kcG9pbnQ6ICdwYXltZW50X21ldGhvZHMvY3JlZGl0X2NhcmRzJyxcbiAqICAgICBtZXRob2Q6ICdwb3N0JyxcbiAqICAgICBkYXRhOiBkYXRhXG4gKiAgIH0sIGZ1bmN0aW9uIChyZXF1ZXN0RXJyLCByZXNwb25zZSkge1xuICogICAgIC8vIE1vcmUgZGV0YWlsZWQgZXhhbXBsZSBvZiBoYW5kbGluZyBBUEkgZXJyb3JzOiBodHRwczovL2NvZGVwZW4uaW8vc2VhbWxlc3NwYXkvcGVuL01id2pkTVxuICogICAgIGlmIChyZXF1ZXN0RXJyKSB7IHRocm93IG5ldyBFcnJvcihyZXF1ZXN0RXJyKTsgfVxuICpcbiAqICAgICBjb25zb2xlLmxvZygnR290IG5vbmNlOicsIHJlc3BvbnNlLmNyZWRpdENhcmRzWzBdLm5vbmNlKTtcbiAqICAgfSk7XG4gKiB9KTtcbiAqIEByZXR1cm5zIHtQcm9taXNlfHZvaWR9IFJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2l0aCB0aGUgcmVxdWVzdCByZXNwb25zZSBpZiBubyBjYWxsYmFjayBpcyBwcm92aWRlZC5cbiAqL1xuQ2xpZW50LnByb3RvdHlwZS5yZXF1ZXN0ID0gZnVuY3Rpb24gKG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIHZhciBzZWxmID0gdGhpczsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1pbnZhbGlkLXRoaXNcblxuICB2YXIgcmVxdWVzdFByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdmFyIG9wdGlvbk5hbWUsXG4gICAgICBhcGksXG4gICAgICByZXF1ZXN0T3B0aW9ucyxcbiAgICAgIGFwaUNvbmZpZyxcbiAgICAgIHByb3h5QWNjb3VudElkLFxuICAgICAgcHVibGlzaGFibGUgPSBvcHRpb25zLnB1Ymxpc2hhYmxlO1xuXG4gICAgaWYgKCFvcHRpb25zLm1ldGhvZCkge1xuICAgICAgb3B0aW9uTmFtZSA9ICdvcHRpb25zLm1ldGhvZCc7XG4gICAgfSBlbHNlIGlmICghb3B0aW9ucy5lbmRwb2ludCkge1xuICAgICAgb3B0aW9uTmFtZSA9ICdvcHRpb25zLmVuZHBvaW50JztcbiAgICB9XG5cbiAgICBpZiAob3B0aW9uTmFtZSkge1xuICAgICAgdGhyb3cgbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgICB0eXBlOiBlcnJvcnMuQ0xJRU5UX09QVElPTl9SRVFVSVJFRC50eXBlLFxuICAgICAgICBjb2RlOiBlcnJvcnMuQ0xJRU5UX09QVElPTl9SRVFVSVJFRC5jb2RlLFxuICAgICAgICBtZXNzYWdlOiBvcHRpb25OYW1lICsgJyBpcyByZXF1aXJlZCB3aGVuIG1ha2luZyBhIHJlcXVlc3QuJ1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKCdhcGknIGluIG9wdGlvbnMpIHtcbiAgICAgIGFwaSA9IG9wdGlvbnMuYXBpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkgPSAnY2xpZW50QXBpJztcbiAgICB9XG5cbiAgICByZXF1ZXN0T3B0aW9ucyA9IHtcbiAgICAgIG1ldGhvZDogb3B0aW9ucy5tZXRob2QsXG4gICAgICB0aW1lb3V0OiBvcHRpb25zLnRpbWVvdXRcbiAgICB9O1xuXG4gICAgdmFyIGNvbW1vbkhlYWRlciA9IHtcbiAgICAgICdBUEktVmVyc2lvbic6IGNvbnN0YW50cy5TRUFNTEVTU1BBWV9BUElfVkVSU0lPTl9IRUFERVIsXG4gICAgICAnU0RLLVZlcnNpb24nOiBWRVJTSU9OXG4gICAgfTtcblxuICAgIHByb3h5QWNjb3VudElkID0gc2VsZi5nZXRDb25maWd1cmF0aW9uKCkuZ2F0ZXdheUNvbmZpZ3VyYXRpb24ucHJveHlBY2NvdW50SWQ7XG5cbiAgICBpZiAoYXBpID09PSAndG9rZW5pemVyQXBpJykge1xuICAgICAgcmVxdWVzdE9wdGlvbnMudXJsID0gc2VsZi5fdG9rZW5pemVyQXBpLnVybCArICcvJyArIG9wdGlvbnMuZW5kcG9pbnQ7XG4gICAgICByZXF1ZXN0T3B0aW9ucy5kYXRhID0gb3B0aW9ucy5kYXRhO1xuICAgICAgcmVxdWVzdE9wdGlvbnMuaGVhZGVycyA9IHtcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgQXV0aG9yaXphdGlvbjogJ0JlYXJlciAnICsgc2VsZi5fdG9rZW5pemVyQXBpLmFjY2Vzc1Rva2VuXG4gICAgICB9O1xuICAgICAgaWYgKHByb3h5QWNjb3VudElkKSB7XG4gICAgICAgIHJlcXVlc3RPcHRpb25zLmhlYWRlcnNbJ1NlYW1sZXNzUGF5LUFjY291bnQnXSA9IHByb3h5QWNjb3VudElkO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoYXBpID09PSAndHJhbnNhY3Rpb25BcGknKSB7XG4gICAgICBhcGlDb25maWcgPSBzZWxmLmdldENvbmZpZ3VyYXRpb24oKS5nYXRld2F5Q29uZmlndXJhdGlvbi50cmFuc2FjdGlvbkFwaTtcbiAgICAgIHJlcXVlc3RPcHRpb25zLnVybCA9IGFwaUNvbmZpZy5pc1NlYW1sZXNzcGF5ID8gYXBpQ29uZmlnLnVybCArICcvJyArIG9wdGlvbnMuZW5kcG9pbnQgOiBhcGlDb25maWcudXJsO1xuICAgICAgcmVxdWVzdE9wdGlvbnMuZGF0YSA9IG9wdGlvbnMuZGF0YTtcbiAgICAgIHJlcXVlc3RPcHRpb25zLmhlYWRlcnMgPSB7fTtcbiAgICAgIGlmIChhcGlDb25maWcuYWNjZXNzVG9rZW4pIHtcbiAgICAgICAgcmVxdWVzdE9wdGlvbnMuaGVhZGVyc1snQXV0aG9yaXphdGlvbiddID0gJ0JlYXJlciAnICsgYXBpQ29uZmlnLmFjY2Vzc1Rva2VuO1xuICAgICAgfVxuICAgICAgaWYgKHByb3h5QWNjb3VudElkKSB7XG4gICAgICAgIHJlcXVlc3RPcHRpb25zLmhlYWRlcnNbJ1NlYW1sZXNzUGF5LUFjY291bnQnXSA9IHByb3h5QWNjb3VudElkO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoYXBpID09PSAnY2hlY2tvdXRBcGknKSB7XG4gICAgICBhcGlDb25maWcgPSBzZWxmLmdldENvbmZpZ3VyYXRpb24oKS5nYXRld2F5Q29uZmlndXJhdGlvbi50cmFuc2FjdGlvbkFwaTtcbiAgICAgIHJlcXVlc3RPcHRpb25zLnVybCA9IGFwaUNvbmZpZy51cmwgKyAnLycgKyBvcHRpb25zLmVuZHBvaW50O1xuICAgICAgcmVxdWVzdE9wdGlvbnMuZGF0YSA9IG9wdGlvbnMuZGF0YTtcbiAgICAgIHJlcXVlc3RPcHRpb25zLmhlYWRlcnMgPSB7fTtcbiAgICAgIGlmIChhcGlDb25maWcuYWNjZXNzVG9rZW4pIHtcbiAgICAgICAgcmVxdWVzdE9wdGlvbnMuaGVhZGVyc1snQXV0aG9yaXphdGlvbiddID0gJ0JlYXJlciAnICsgYXBpQ29uZmlnLmFjY2Vzc1Rva2VuO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoYXBpID09PSAnY2xpZW50QXBpJykge1xuICAgICAgcmVxdWVzdE9wdGlvbnMudXJsID0gc2VsZi5fY2xpZW50QXBpQmFzZVVybCArIG9wdGlvbnMuZW5kcG9pbnQ7XG4gICAgICByZXF1ZXN0T3B0aW9ucy5kYXRhID0gYWRkTWV0YWRhdGEoc2VsZi5fY29uZmlndXJhdGlvbiwgb3B0aW9ucy5kYXRhKTtcbiAgICB9IGVsc2UgaWYgKGFwaSA9PT0gJ3NlYW1sZXNzcGF5QXBpJykge1xuICAgICAgaWYgKCFzZWxmLl9zZWFtbGVzc3BheUFwaSkge1xuICAgICAgICB0aHJvdyBuZXcgU2VhbWxlc3NwYXlFcnJvcihzaGFyZWRFcnJvcnMuU0VBTUxFU1NQQVlfQVBJX0FDQ0VTU19SRVNUUklDVEVEKTtcbiAgICAgIH1cbiAgICAgIHJlcXVlc3RPcHRpb25zLnVybCA9IHNlbGYuX3NlYW1sZXNzcGF5QXBpLmJhc2VVcmwgKyBvcHRpb25zLmVuZHBvaW50O1xuICAgICAgcmVxdWVzdE9wdGlvbnMuZGF0YSA9IG9wdGlvbnMuZGF0YTtcbiAgICAgIHJlcXVlc3RPcHRpb25zLmhlYWRlcnMgPSB7XG4gICAgICAgIEF1dGhvcml6YXRpb246ICdCZWFyZXIgJyArIChwdWJsaXNoYWJsZSA/IHNlbGYuX3NlYW1sZXNzcGF5QXBpLnB1Ymxpc2hhYmxlVG9rZW4gOiBzZWxmLl9zZWFtbGVzc3BheUFwaS5hY2Nlc3NUb2tlbilcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChhcGkgPT09ICdkaWdpdGFsV2FsbGV0QXBpJykge1xuICAgICAgaWYgKCFzZWxmLl9zZWFtbGVzc3BheUFwaSkge1xuICAgICAgICB0aHJvdyBuZXcgU2VhbWxlc3NwYXlFcnJvcihzaGFyZWRFcnJvcnMuU0VBTUxFU1NQQVlfQVBJX0FDQ0VTU19SRVNUUklDVEVEKTtcbiAgICAgIH1cbiAgICAgIHJlcXVlc3RPcHRpb25zLnVybCA9IHNlbGYuX3NlYW1sZXNzcGF5QXBpLmJhc2VVcmwgKyBvcHRpb25zLmVuZHBvaW50O1xuICAgICAgcmVxdWVzdE9wdGlvbnMuZGF0YSA9IG9wdGlvbnMuZGF0YTtcbiAgICAgIHJlcXVlc3RPcHRpb25zLmhlYWRlcnMgPSB7XG4gICAgICAgIEF1dGhvcml6YXRpb246ICdCZWFyZXIgJyArIG9wdGlvbnMuZGF0YS50b2tlblxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgICB0eXBlOiBlcnJvcnMuQ0xJRU5UX09QVElPTl9JTlZBTElELnR5cGUsXG4gICAgICAgIGNvZGU6IGVycm9ycy5DTElFTlRfT1BUSU9OX0lOVkFMSUQuY29kZSxcbiAgICAgICAgbWVzc2FnZTogJ29wdGlvbnMuYXBpIGlzIGludmFsaWQuJ1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmVxdWVzdE9wdGlvbnMuaGVhZGVycyA9IGFzc2lnbih7fSwgcmVxdWVzdE9wdGlvbnMuaGVhZGVycywgY29tbW9uSGVhZGVyKTtcblxuICAgIHNlbGYuX3JlcXVlc3QocmVxdWVzdE9wdGlvbnMsIGZ1bmN0aW9uIChlcnIsIGRhdGEsIHN0YXR1cykge1xuICAgICAgdmFyIHJlc29sdmVkRGF0YTtcbiAgICAgIHZhciByZXF1ZXN0RXJyb3IgPSBmb3JtYXRSZXF1ZXN0RXJyb3Ioc3RhdHVzLCBlcnIpO1xuXG4gICAgICBpZiAocmVxdWVzdEVycm9yKSB7XG4gICAgICAgIHJlamVjdChyZXF1ZXN0RXJyb3IpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHJlc29sdmVkRGF0YSA9IEFycmF5LmlzQXJyYXkoZGF0YSkgJiYgeyBkYXRhOiBkYXRhLCBfaHR0cFN0YXR1czogc3RhdHVzIH0gfHxcbiAgICAgICAgYXNzaWduKHsgX2h0dHBTdGF0dXM6IHN0YXR1cyB9LCBkYXRhKTtcblxuICAgICAgcmVzb2x2ZShyZXNvbHZlZERhdGEpO1xuICAgIH0pO1xuICB9KTtcblxuICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmVxdWVzdFByb21pc2UudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3BvbnNlLCByZXNwb25zZS5faHR0cFN0YXR1cyk7XG4gICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgICAgdmFyIHN0YXR1cyA9IGVyciAmJiBlcnIuZGV0YWlscyAmJiBlcnIuZGV0YWlscy5odHRwU3RhdHVzO1xuICAgICAgY2FsbGJhY2soZXJyLCBudWxsLCBzdGF0dXMpO1xuICAgIH0pO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHJldHVybiByZXF1ZXN0UHJvbWlzZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBjb25zaXN0ZW50LXJldHVyblxufTtcblxuZnVuY3Rpb24gZm9ybWF0UmVxdWVzdEVycm9yKHN0YXR1cywgZXJyKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgY29uc2lzdGVudC1yZXR1cm5cbiAgdmFyIHJlcXVlc3RFcnJvcjtcblxuICBpZiAoc3RhdHVzID09PSAtMSkge1xuICAgIHJlcXVlc3RFcnJvciA9IG5ldyBTZWFtbGVzc3BheUVycm9yKGVycm9ycy5DTElFTlRfUkVRVUVTVF9USU1FT1VUKTtcbiAgfSBlbHNlIGlmIChzdGF0dXMgPT09IDQwMykge1xuICAgIHJlcXVlc3RFcnJvciA9IG5ldyBTZWFtbGVzc3BheUVycm9yKGVycm9ycy5DTElFTlRfQVVUSE9SSVpBVElPTl9JTlNVRkZJQ0lFTlQpO1xuICB9IGVsc2UgaWYgKHN0YXR1cyA9PT0gNDI5KSB7XG4gICAgcmVxdWVzdEVycm9yID0gbmV3IFNlYW1sZXNzcGF5RXJyb3IoZXJyb3JzLkNMSUVOVF9SQVRFX0xJTUlURUQpO1xuICB9IGVsc2UgaWYgKHN0YXR1cyA+PSA1MDApIHtcbiAgICByZXF1ZXN0RXJyb3IgPSBuZXcgU2VhbWxlc3NwYXlFcnJvcihlcnJvcnMuQ0xJRU5UX0dBVEVXQVlfTkVUV09SSyk7XG4gIH0gZWxzZSBpZiAoc3RhdHVzIDwgMjAwIHx8IHN0YXR1cyA+PSA0MDApIHtcbiAgICByZXF1ZXN0RXJyb3IgPSBjb252ZXJ0VG9TZWFtbGVzc3BheUVycm9yKGVyciwge1xuICAgICAgdHlwZTogZXJyb3JzLkNMSUVOVF9SRVFVRVNUX0VSUk9SLnR5cGUsXG4gICAgICBjb2RlOiBlcnJvcnMuQ0xJRU5UX1JFUVVFU1RfRVJST1IuY29kZSxcbiAgICAgIG1lc3NhZ2U6IGVycm9ycy5DTElFTlRfUkVRVUVTVF9FUlJPUi5tZXNzYWdlXG4gICAgfSk7XG4gIH1cblxuICBpZiAocmVxdWVzdEVycm9yKSB7XG4gICAgcmVxdWVzdEVycm9yLmRldGFpbHMgPSByZXF1ZXN0RXJyb3IuZGV0YWlscyB8fCB7fTtcbiAgICByZXF1ZXN0RXJyb3IuZGV0YWlscy5odHRwU3RhdHVzID0gc3RhdHVzO1xuXG4gICAgcmV0dXJuIHJlcXVlc3RFcnJvcjtcbiAgfVxufVxuXG5DbGllbnQucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMuZ2V0Q29uZmlndXJhdGlvbigpO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBDbGllbnQgdmVyc2lvbi5cbiAqIEBwdWJsaWNcbiAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBjcmVhdGVkIGNsaWVudCdzIHZlcnNpb24uXG4gKiBAZXhhbXBsZVxuICogdmFyIGNyZWF0ZUNsaWVudCA9IHJlcXVpcmUoJ2JyYWludHJlZS13ZWIvY2xpZW50JykuY3JlYXRlO1xuICpcbiAqIGNyZWF0ZUNsaWVudCh7XG4gKiAgIGF1dGhvcml6YXRpb246IENMSUVOVF9BVVRIT1JJWkFUSU9OXG4gKiB9LCBmdW5jdGlvbiAoY3JlYXRlRXJyLCBjbGllbnRJbnN0YW5jZSkge1xuICogICBjb25zb2xlLmxvZyhjbGllbnRJbnN0YW5jZS5nZXRWZXJzaW9uKCkpOyAvLyBFeDogMS4wLjBcbiAqIH0pO1xuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbkNsaWVudC5wcm90b3R5cGUuZ2V0VmVyc2lvbiA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIFZFUlNJT047XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENsaWVudDtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIFNFQU1MRVNTUEFZX0FQSV9WRVJTSU9OX0hFQURFUjogJ3YyMDIwJ1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFNlYW1sZXNzcGF5RXJyb3IgPSByZXF1aXJlKCcuLi9saWIvc2VhbWxlc3NwYXktZXJyb3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIENMSUVOVF9HQVRFV0FZX0NPTkZJR1VSQVRJT05fSU5WQUxJRF9ET01BSU46IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLk1FUkNIQU5ULFxuICAgIGNvZGU6ICdDTElFTlRfR0FURVdBWV9DT05GSUdVUkFUSU9OX0lOVkFMSURfRE9NQUlOJ1xuICB9LFxuICBDTElFTlRfT1BUSU9OX1JFUVVJUkVEOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnQ0xJRU5UX09QVElPTl9SRVFVSVJFRCdcbiAgfSxcbiAgQ0xJRU5UX09QVElPTl9JTlZBTElEOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnQ0xJRU5UX09QVElPTl9JTlZBTElEJ1xuICB9LFxuICBDTElFTlRfTUlTU0lOR19HQVRFV0FZX0NPTkZJR1VSQVRJT046IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLklOVEVSTkFMLFxuICAgIGNvZGU6ICdDTElFTlRfTUlTU0lOR19HQVRFV0FZX0NPTkZJR1VSQVRJT04nLFxuICAgIG1lc3NhZ2U6ICdNaXNzaW5nIGdhdGV3YXlDb25maWd1cmF0aW9uLidcbiAgfSxcbiAgQ0xJRU5UX0lOVkFMSURfQVVUSE9SSVpBVElPTjoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTUVSQ0hBTlQsXG4gICAgY29kZTogJ0NMSUVOVF9JTlZBTElEX0FVVEhPUklaQVRJT04nLFxuICAgIG1lc3NhZ2U6ICdBdXRob3JpemF0aW9uIGlzIGludmFsaWQuIE1ha2Ugc3VyZSB5b3VyIGNsaWVudCB0b2tlbiBvciB0b2tlbml6YXRpb24ga2V5IGlzIHZhbGlkLidcbiAgfSxcbiAgQ0xJRU5UX0dBVEVXQVlfTkVUV09SSzoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTkVUV09SSyxcbiAgICBjb2RlOiAnQ0xJRU5UX0dBVEVXQVlfTkVUV09SSycsXG4gICAgbWVzc2FnZTogJ0Nhbm5vdCBjb250YWN0IHRoZSBnYXRld2F5IGF0IHRoaXMgdGltZS4nXG4gIH0sXG4gIENMSUVOVF9SRVFVRVNUX1RJTUVPVVQ6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLk5FVFdPUkssXG4gICAgY29kZTogJ0NMSUVOVF9SRVFVRVNUX1RJTUVPVVQnLFxuICAgIG1lc3NhZ2U6ICdSZXF1ZXN0IHRpbWVkIG91dCB3YWl0aW5nIGZvciBhIHJlcGx5LidcbiAgfSxcbiAgQ0xJRU5UX1JFUVVFU1RfRVJST1I6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLk5FVFdPUkssXG4gICAgY29kZTogJ0NMSUVOVF9SRVFVRVNUX0VSUk9SJyxcbiAgICBtZXNzYWdlOiAnVGhlcmUgd2FzIGEgcHJvYmxlbSB3aXRoIHlvdXIgcmVxdWVzdC4nXG4gIH0sXG4gIENMSUVOVF9SQVRFX0xJTUlURUQ6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLk1FUkNIQU5ULFxuICAgIGNvZGU6ICdDTElFTlRfUkFURV9MSU1JVEVEJyxcbiAgICBtZXNzYWdlOiAnWW91IGFyZSBiZWluZyByYXRlLWxpbWl0ZWQ7IHBsZWFzZSB0cnkgYWdhaW4gaW4gYSBmZXcgbWludXRlcy4nXG4gIH0sXG4gIENMSUVOVF9BVVRIT1JJWkFUSU9OX0lOU1VGRklDSUVOVDoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTUVSQ0hBTlQsXG4gICAgY29kZTogJ0NMSUVOVF9BVVRIT1JJWkFUSU9OX0lOU1VGRklDSUVOVCcsXG4gICAgbWVzc2FnZTogJ1RoZSBhdXRob3JpemF0aW9uIHVzZWQgaGFzIGluc3VmZmljaWVudCBwcml2aWxlZ2VzLidcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFNlYW1sZXNzcGF5RXJyb3IgPSByZXF1aXJlKCcuLi9saWIvc2VhbWxlc3NwYXktZXJyb3InKTtcbnZhciBQcm9taXNlID0gcmVxdWlyZSgnLi4vbGliL3Byb21pc2UnKTtcbnZhciB3cmFwUHJvbWlzZSA9IHJlcXVpcmUoJ0BicmFpbnRyZWUvd3JhcC1wcm9taXNlJyk7XG52YXIgdXVpZCA9IHJlcXVpcmUoJy4uL2xpYi91dWlkJyk7XG52YXIgY29uc3RhbnRzID0gcmVxdWlyZSgnLi4vbGliL2NvbnN0YW50cycpO1xudmFyIGNyZWF0ZUF1dGhvcml6YXRpb25EYXRhID0gcmVxdWlyZSgnLi4vbGliL2NyZWF0ZS1hdXRob3JpemF0aW9uLWRhdGEnKTtcbnZhciBlcnJvcnMgPSByZXF1aXJlKCcuL2Vycm9ycycpO1xuXG52YXIgYXBpVXJscyA9IHtcbiAgcHJvZHVjdGlvbjogY29uc3RhbnRzLkFQSV9VUkxfUFJPRFVDVElPTixcbiAgbGl2ZTogY29uc3RhbnRzLkFQSV9VUkxfUFJPRFVDVElPTixcbiAgc2FuZGJveDogY29uc3RhbnRzLkFQSV9VUkxfU0FOREJPWCxcbiAgc3RhZ2luZzogY29uc3RhbnRzLkFQSV9VUkxfU1RBR0lOR1xufTtcblxudmFyIHRva2VuaXplckFwaVVybHMgPSB7XG4gIHByb2R1Y3Rpb246IGNvbnN0YW50cy5QQU5fVkFVTFRfVVJMX1BST0RVQ1RJT04sXG4gIGxpdmU6IGNvbnN0YW50cy5QQU5fVkFVTFRfVVJMX1BST0RVQ1RJT04sXG4gIHNhbmRib3g6IGNvbnN0YW50cy5QQU5fVkFVTFRfVVJMX1NBTkRCT1gsXG4gIHN0YWdpbmc6IGNvbnN0YW50cy5QQU5fVkFVTFRfVVJMX1NUQUdJTkdcbn07XG5cbmZ1bmN0aW9uIGdldEVudmlyb25tZW50KG9wdGlvbnMpIHtcbiAgdmFyIGRlZmF1bHRFbnZpcm9ubWVudCA9ICdsaXZlJztcbiAgdmFyIGFsbG93ZWRFbnZpcm9ubWVudHMgPSBbJ3Byb2R1Y3Rpb24nLCAnc2FuZGJveCcsICdsaXZlJywgJ3N0YWdpbmcnXTtcbiAgdmFyIGVudmlyb25tZW50ID0gb3B0aW9ucy5lbnZpcm9ubWVudCB8fCBkZWZhdWx0RW52aXJvbm1lbnQ7XG5cbiAgaWYgKCFhbGxvd2VkRW52aXJvbm1lbnRzLmluY2x1ZGVzKGVudmlyb25tZW50KSkge1xuICAgIHRocm93IG5ldyBTZWFtbGVzc3BheUVycm9yKHtcbiAgICAgIHR5cGU6IGVycm9ycy5DTElFTlRfT1BUSU9OX0lOVkFMSUQudHlwZSxcbiAgICAgIGNvZGU6IGVycm9ycy5DTElFTlRfT1BUSU9OX0lOVkFMSUQuY29kZSxcbiAgICAgIG1lc3NhZ2U6ICdVbmtub3duIGVudmlyb25tZW50IGlkZW50aWZpZXIgXCInICsgZW52aXJvbm1lbnQgKyAnXCInLFxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIGVudmlyb25tZW50O1xufVxuXG5mdW5jdGlvbiBnZXRDb25maWd1cmF0aW9uKG9wdGlvbnMpIHtcbiAgdmFyIGVudmlyb25tZW50ID0gZ2V0RW52aXJvbm1lbnQob3B0aW9ucyk7XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICB2YXIgY29uZmlndXJhdGlvbiwgYXV0aERhdGEsIGF0dHJzO1xuICAgIHZhciBzZXNzaW9uSWQgPSB1dWlkKCk7XG4gICAgdmFyIGFuYWx5dGljc01ldGFkYXRhID0ge1xuICAgICAgbWVyY2hhbnRBcHBJZDogZ2xvYmFsLmxvY2F0aW9uLmhvc3QsXG4gICAgICBzZGtWZXJzaW9uOiBjb25zdGFudHMuVkVSU0lPTixcbiAgICAgIHNlc3Npb25JZDogc2Vzc2lvbklkXG4gICAgfTtcbiAgICB2YXIgdG9rZW5pemVyQXBpID0gb3B0aW9ucy50b2tlbml6ZXJBcGkgfHwge307XG4gICAgdmFyIHRyYW5zYWN0aW9uQXBpID0gb3B0aW9ucy50cmFuc2FjdGlvbkFwaSB8fCB7fTtcbiAgICB2YXIgc2VhbWxlc3NwYXlBcGkgPSBvcHRpb25zLnNlYW1sZXNzcGF5QXBpIHx8IHt9O1xuXG4gICAgdHJ5IHtcbiAgICAgIGF1dGhEYXRhID0gY3JlYXRlQXV0aG9yaXphdGlvbkRhdGEob3B0aW9ucy5hdXRob3JpemF0aW9uKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJlamVjdChuZXcgU2VhbWxlc3NwYXlFcnJvcihlcnJvcnMuQ0xJRU5UX0lOVkFMSURfQVVUSE9SSVpBVElPTikpO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGF0dHJzID0gYXV0aERhdGEuYXR0cnM7XG5cbiAgICBjb25maWd1cmF0aW9uID0ge1xuICAgICAgaXNEZWJ1ZzogZmFsc2UsXG4gICAgICBtZXRhZGF0YTogb3B0aW9ucy5tZXRhZGF0YSxcbiAgICAgIGF1dGhvcml6YXRpb25UeXBlOiBhdHRycy50b2tlbml6YXRpb25LZXkgPyAnVE9LRU5JWkFUSU9OX0tFWScgOiAnQ0xJRU5UX1RPS0VOJyxcbiAgICAgIGF1dGhvcml6YXRpb246IG9wdGlvbnMuYXV0aG9yaXphdGlvbixcbiAgICAgIHRva2VuVHlwZTogYXR0cnMudG9rZW5UeXBlLFxuICAgICAgYW5hbHl0aWNzTWV0YWRhdGE6IGFuYWx5dGljc01ldGFkYXRhLFxuICAgICAgZ2F0ZXdheUNvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgcHJveHlBY2NvdW50SWQ6IG9wdGlvbnMucHJveHlBY2NvdW50SWQsXG4gICAgICAgIGFzc2V0c1VybDogY29uc3RhbnRzLkFTU0VUU19IT1NULFxuICAgICAgICBlbnZpcm9ubWVudDogZW52aXJvbm1lbnQsXG4gICAgICAgIGNsaWVudEFwaVVybDogYXBpVXJsc1tlbnZpcm9ubWVudF0sXG4gICAgICAgIGNoZWNrb3V0VXJsOiAnJywgLy9AVE9ETzogVGVtcG9yYXJ5IHVuc3VwcG9ydGVkXG4gICAgICAgIHRva2VuaXplckFwaToge1xuICAgICAgICAgIHVybDogdG9rZW5pemVyQXBpLnVybCB8fCB0b2tlbml6ZXJBcGlVcmxzW2Vudmlyb25tZW50XSxcbiAgICAgICAgICBhY2Nlc3NUb2tlbjogYXV0aERhdGEuYWNjZXNzVG9rZW5cbiAgICAgICAgfSxcbiAgICAgICAgdHJhbnNhY3Rpb25BcGk6IHtcbiAgICAgICAgICB1cmw6IHRyYW5zYWN0aW9uQXBpLnVybCB8fCBhcGlVcmxzW2Vudmlyb25tZW50XSxcbiAgICAgICAgICBhY2Nlc3NUb2tlbjogdHJhbnNhY3Rpb25BcGkuYWNjZXNzVG9rZW4sXG4gICAgICAgICAgcHVibGlzaGFibGVUb2tlbjogYXV0aERhdGEuYWNjZXNzVG9rZW4sXG4gICAgICAgICAgaXNTZWFtbGVzc3BheTogISgndXJsJyBpbiB0cmFuc2FjdGlvbkFwaSksXG4gICAgICAgICAgc291cmNlOiB0cmFuc2FjdGlvbkFwaS5zb3VyY2UgfHwgJydcbiAgICAgICAgfSxcbiAgICAgICAgY3JlZGl0Q2FyZHM6IHtcbiAgICAgICAgICBzdXBwb3J0ZWRHYXRld2F5czogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiAnY2xpZW50QXBpJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIF0sXG4gICAgICAgICAgc3VwcG9ydGVkQ2FyZFR5cGVzOiBbIC8vIEBUT0RPOiB0aGlzIHNob3VsZCBiZSByZXR1cm5lZCBieSBzZWFtbGVzc3BheSBhcGkgKGFjY29yZGluZyB0byBnaXZlbiBhdXRob3JpemF0aW9uIC0gcHVibGlzaGFibGUga2V5KVxuICAgICAgICAgICAgJ1Zpc2EnLFxuICAgICAgICAgICAgJ01hc3RlcmNhcmQnLFxuICAgICAgICAgICAgJ0FtZXJpY2FuIEV4cHJlc3MnLFxuICAgICAgICAgICAgJ0RpbmVycyBDbHViJyxcbiAgICAgICAgICAgICdEaXNjb3ZlcicsXG4gICAgICAgICAgICAnSkNCJyxcbiAgICAgICAgICAgICdVbmlvblBheScsXG4gICAgICAgICAgICAnTWFlc3RybydcbiAgICAgICAgICBdLFxuICAgICAgICAgIGVuZHBvaW50czoge1xuXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBzZWFtbGVzc3BheUFwaToge1xuICAgICAgICAgIGFjY2Vzc1Rva2VuOiBzZWFtbGVzc3BheUFwaS5hY2Nlc3NUb2tlbiB8fCBhdXRoRGF0YS5hY2Nlc3NUb2tlbixcbiAgICAgICAgICBwdWJsaXNoYWJsZVRva2VuOiBhdXRoRGF0YS5hY2Nlc3NUb2tlbixcbiAgICAgICAgICB1cmw6IHNlYW1sZXNzcGF5QXBpLnVybCB8fCBhcGlVcmxzW2Vudmlyb25tZW50XVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJlc29sdmUoY29uZmlndXJhdGlvbik7XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZ2V0Q29uZmlndXJhdGlvbjogd3JhcFByb21pc2UoZ2V0Q29uZmlndXJhdGlvbiksXG4gIGFwaUVudmlyb25tZW50VXJsczogYXBpVXJsc1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFNlYW1sZXNzcGF5RXJyb3IgPSByZXF1aXJlKCcuLi9saWIvc2VhbWxlc3NwYXktZXJyb3InKTtcbnZhciBDbGllbnQgPSByZXF1aXJlKCcuL2NsaWVudCcpO1xudmFyIGdldENvbmZpZ3VyYXRpb25Nb2R1bGUgPSByZXF1aXJlKCcuL2dldC1jb25maWd1cmF0aW9uJyk7XG52YXIgVkVSU0lPTiA9IFwid2ViLXNka1wiO1xudmFyIFByb21pc2UgPSByZXF1aXJlKCcuLi9saWIvcHJvbWlzZScpO1xudmFyIHdyYXBQcm9taXNlID0gcmVxdWlyZSgnQGJyYWludHJlZS93cmFwLXByb21pc2UnKTtcbnZhciBzaGFyZWRFcnJvcnMgPSByZXF1aXJlKCcuLi9saWIvZXJyb3JzJyk7XG5cbnZhciBnZXRDb25maWd1cmF0aW9uID0gZ2V0Q29uZmlndXJhdGlvbk1vZHVsZS5nZXRDb25maWd1cmF0aW9uO1xudmFyIGFwaUVudmlyb25tZW50VXJscyA9IGdldENvbmZpZ3VyYXRpb25Nb2R1bGUuYXBpRW52aXJvbm1lbnRVcmxzO1xuXG4vKiogQG1vZHVsZSBzZWFtbGVzc3BheS13ZWIvY2xpZW50ICovXG5cbi8qKlxuICogQGZ1bmN0aW9uXG4gKiBAZGVzY3JpcHRpb24gVGhpcyBmdW5jdGlvbiBpcyB0aGUgZW50cnkgcG9pbnQgZm9yIHRoZSA8Y29kZT5zZWFtbGVzc3BheS5jbGllbnQ8L2NvZGU+IG1vZHVsZS4gSXQgaXMgdXNlZCBmb3IgY3JlYXRpbmcge0BsaW5rIENsaWVudH0gaW5zdGFuY2VzIHRoYXQgc2VydmljZSBjb21tdW5pY2F0aW9uIHRvIFNlYW1sZXNzcGF5IHNlcnZlcnMuXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyBPYmplY3QgY29udGFpbmluZyBhbGwge0BsaW5rIENsaWVudH0gb3B0aW9uczpcbiAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLmF1dGhvcml6YXRpb24gQSB0b2tlbml6YXRpb25LZXkgb3IgY2xpZW50VG9rZW4uXG4gKiBAcGFyYW0ge2NhbGxiYWNrfSBbY2FsbGJhY2tdIFRoZSBzZWNvbmQgYXJndW1lbnQsIDxjb2RlPmRhdGE8L2NvZGU+LCBpcyB0aGUge0BsaW5rIENsaWVudH0gaW5zdGFuY2UuXG4gKiBAcmV0dXJucyB7UHJvbWlzZXx2b2lkfSBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRoZSBjbGllbnQgaW5zdGFuY2UgaWYgbm8gY2FsbGJhY2sgaXMgcHJvdmlkZWQuXG4gKiBAZXhhbXBsZVxuICogdmFyIGNyZWF0ZUNsaWVudCA9IHJlcXVpcmUoJ3NlYW1sZXNzcGF5LXdlYi9jbGllbnQnKS5jcmVhdGU7XG4gKlxuICogY3JlYXRlQ2xpZW50KHtcbiAqICAgYXV0aG9yaXphdGlvbjogQ0xJRU5UX0FVVEhPUklaQVRJT05cbiAqIH0sIGZ1bmN0aW9uIChjcmVhdGVFcnIsIGNsaWVudEluc3RhbmNlKSB7XG4gKiAgIC8vIC4uLlxuICogfSk7XG4gKiBAc3RhdGljXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZShvcHRpb25zKSB7XG4gIGlmICghb3B0aW9ucy5hdXRob3JpemF0aW9uKSB7XG4gICAgdmFyIGVycm9yID0gbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgdHlwZTogc2hhcmVkRXJyb3JzLklOU1RBTlRJQVRJT05fT1BUSU9OX1JFUVVJUkVELnR5cGUsXG4gICAgICBjb2RlOiBzaGFyZWRFcnJvcnMuSU5TVEFOVElBVElPTl9PUFRJT05fUkVRVUlSRUQuY29kZSxcbiAgICAgIG1lc3NhZ2U6ICdvcHRpb25zLmF1dGhvcml6YXRpb24gaXMgcmVxdWlyZWQgd2hlbiBpbnN0YW50aWF0aW5nIGEgY2xpZW50LidcbiAgICB9KTtcblxuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XG4gIH1cblxuICByZXR1cm4gZ2V0Q29uZmlndXJhdGlvbihvcHRpb25zKVxuICAgIC50aGVuKGZ1bmN0aW9uIChjb25maWd1cmF0aW9uKSB7XG4gICAgICBpZiAob3B0aW9ucy5kZWJ1Zykge1xuICAgICAgICBjb25maWd1cmF0aW9uLmlzRGVidWcgPSB0cnVlO1xuICAgICAgfVxuICAgICAgdmFyIGNsaWVudCA9IG5ldyBDbGllbnQoY29uZmlndXJhdGlvbik7XG5cbiAgICAgIHJldHVybiBjbGllbnQ7XG4gICAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBjcmVhdGU6IHdyYXBQcm9taXNlKGNyZWF0ZSksXG4gIGdldEFwaVVybDogZnVuY3Rpb24gKGVudmlyb25tZW50KSB7XG4gICAgcmV0dXJuIGFwaUVudmlyb25tZW50VXJsc1tlbnZpcm9ubWVudF1cbiAgfSxcbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBUaGUgY3VycmVudCB2ZXJzaW9uIG9mIHRoZSBTREssIGkuZS4gYHtAcGtnIHZlcnNpb259YC5cbiAgICogQHR5cGUge3N0cmluZ31cbiAgICovXG4gIFZFUlNJT046IFZFUlNJT05cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBxdWVyeXN0cmluZyA9IHJlcXVpcmUoJy4uLy4uL2xpYi9xdWVyeXN0cmluZycpO1xudmFyIGFzc2lnbiA9IHJlcXVpcmUoJy4uLy4uL2xpYi9hc3NpZ24nKS5hc3NpZ247XG52YXIgcHJlcEJvZHkgPSByZXF1aXJlKCcuL3ByZXAtYm9keScpO1xudmFyIHBhcnNlQm9keSA9IHJlcXVpcmUoJy4vcGFyc2UtYm9keScpO1xudmFyIGlzWEhSQXZhaWxhYmxlID0gZ2xvYmFsLlhNTEh0dHBSZXF1ZXN0ICYmICd3aXRoQ3JlZGVudGlhbHMnIGluIG5ldyBnbG9iYWwuWE1MSHR0cFJlcXVlc3QoKTtcblxuZnVuY3Rpb24gZ2V0UmVxdWVzdE9iamVjdCgpIHtcbiAgcmV0dXJuIGlzWEhSQXZhaWxhYmxlID8gbmV3IFhNTEh0dHBSZXF1ZXN0KCkgOiBuZXcgWERvbWFpblJlcXVlc3QoKTtcbn1cblxuZnVuY3Rpb24gcmVxdWVzdChvcHRpb25zLCBjYikge1xuICB2YXIgc3RhdHVzLCByZXNCb2R5O1xuICB2YXIgbWV0aG9kID0gb3B0aW9ucy5tZXRob2Q7XG4gIHZhciB1cmwgPSBvcHRpb25zLnVybDtcbiAgdmFyIGJvZHkgPSBvcHRpb25zLmRhdGE7XG4gIHZhciB0aW1lb3V0ID0gb3B0aW9ucy50aW1lb3V0O1xuICB2YXIgaGVhZGVycyA9IGFzc2lnbih7XG4gICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICB9LCBvcHRpb25zLmhlYWRlcnMpO1xuICB2YXIgcmVxID0gZ2V0UmVxdWVzdE9iamVjdCgpO1xuICB2YXIgY2FsbGJhY2sgPSBjYjtcblxuICBpZiAobWV0aG9kID09PSAnR0VUJykge1xuICAgIHVybCA9IHF1ZXJ5c3RyaW5nLnF1ZXJ5aWZ5KHVybCwgYm9keSk7XG4gICAgYm9keSA9IG51bGw7XG4gIH1cblxuICBpZiAoaXNYSFJBdmFpbGFibGUpIHtcbiAgICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHJlcS5yZWFkeVN0YXRlICE9PSA0KSB7IHJldHVybjsgfVxuXG4gICAgICBzdGF0dXMgPSByZXEuc3RhdHVzO1xuICAgICAgcmVzQm9keSA9IHBhcnNlQm9keShyZXEucmVzcG9uc2VUZXh0KTtcblxuICAgICAgaWYgKHN0YXR1cyA+PSA0MDAgfHwgc3RhdHVzIDwgMjAwKSB7XG4gICAgICAgIGNhbGxiYWNrKHJlc0JvZHkgfHwgJ2Vycm9yJywgbnVsbCwgc3RhdHVzIHx8IDUwMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYWxsYmFjayhudWxsLCByZXNCb2R5LCBzdGF0dXMpO1xuICAgICAgfVxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgaWYgKG9wdGlvbnMuaGVhZGVycykge1xuICAgICAgdXJsID0gcXVlcnlzdHJpbmcucXVlcnlpZnkodXJsLCBoZWFkZXJzKTtcbiAgICB9XG5cbiAgICByZXEub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgY2FsbGJhY2sobnVsbCwgcGFyc2VCb2R5KHJlcS5yZXNwb25zZVRleHQpLCByZXEuc3RhdHVzKTtcbiAgICB9O1xuXG4gICAgcmVxLm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBYRG9tYWluUmVxdWVzdCBkb2VzIG5vdCByZXBvcnQgYSBib2R5IG9yIHN0YXR1cyBmb3IgZXJyb3JzLCBzb1xuICAgICAgLy8gaGFyZGNvZGUgdG8gJ2Vycm9yJyBhbmQgNTAwLCByZXNwZWN0aXZlbHlcbiAgICAgIGNhbGxiYWNrKCdlcnJvcicsIG51bGwsIDUwMCk7XG4gICAgfTtcblxuICAgIC8vIFRoaXMgbXVzdCByZW1haW4gZm9yIElFOSB0byB3b3JrXG4gICAgcmVxLm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbiAoKSB7fTtcblxuICAgIHJlcS5vbnRpbWVvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBjYWxsYmFjaygndGltZW91dCcsIG51bGwsIC0xKTtcbiAgICB9O1xuICB9XG5cbiAgcmVxLm9wZW4obWV0aG9kLCB1cmwsIHRydWUpO1xuICByZXEudGltZW91dCA9IHRpbWVvdXQ7XG5cbiAgaWYgKGlzWEhSQXZhaWxhYmxlKSB7XG4gICAgT2JqZWN0LmtleXMoaGVhZGVycykuZm9yRWFjaChmdW5jdGlvbiAoaGVhZGVyS2V5KSB7XG4gICAgICByZXEuc2V0UmVxdWVzdEhlYWRlcihoZWFkZXJLZXksIGhlYWRlcnNbaGVhZGVyS2V5XSk7XG4gICAgfSk7XG4gIH1cblxuICB0cnkge1xuICAgIHJlcS5zZW5kKHByZXBCb2R5KG1ldGhvZCwgYm9keSkpO1xuICB9IGNhdGNoIChlKSB7IC8qIGlnbm9yZWQgKi8gfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgcmVxdWVzdDogcmVxdWVzdFxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRVc2VyQWdlbnQoKSB7XG4gIHJldHVybiBnbG9iYWwubmF2aWdhdG9yLnVzZXJBZ2VudDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBhamF4SXNBdmFsaWFibGU7XG52YXIgb25jZSA9IHJlcXVpcmUoJy4uLy4uL2xpYi9vbmNlJyk7XG52YXIgSlNPTlBEcml2ZXIgPSByZXF1aXJlKCcuL2pzb25wLWRyaXZlcicpO1xudmFyIEFKQVhEcml2ZXIgPSByZXF1aXJlKCcuL2FqYXgtZHJpdmVyJyk7XG52YXIgZ2V0VXNlckFnZW50ID0gcmVxdWlyZSgnLi9nZXQtdXNlci1hZ2VudCcpO1xudmFyIGlzSFRUUCA9IHJlcXVpcmUoJy4vaXMtaHR0cCcpO1xuXG5mdW5jdGlvbiBpc0FqYXhBdmFpbGFibGUoKSB7XG4gIGlmIChhamF4SXNBdmFsaWFibGUgPT0gbnVsbCkge1xuICAgIGFqYXhJc0F2YWxpYWJsZSA9ICEoaXNIVFRQKCkgJiYgL01TSUVcXHMoOHw5KS8udGVzdChnZXRVc2VyQWdlbnQoKSkpO1xuICB9XG5cbiAgcmV0dXJuIGFqYXhJc0F2YWxpYWJsZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob3B0aW9ucywgY2IpIHtcbiAgY2IgPSBvbmNlKGNiIHx8IEZ1bmN0aW9uLnByb3RvdHlwZSk7XG4gIG9wdGlvbnMubWV0aG9kID0gKG9wdGlvbnMubWV0aG9kIHx8ICdHRVQnKS50b1VwcGVyQ2FzZSgpO1xuICBvcHRpb25zLnRpbWVvdXQgPSBvcHRpb25zLnRpbWVvdXQgPT0gbnVsbCA/IDYwMDAwIDogb3B0aW9ucy50aW1lb3V0O1xuICBvcHRpb25zLmRhdGEgPSBvcHRpb25zLmRhdGEgfHwge307XG5cbiAgaWYgKGlzQWpheEF2YWlsYWJsZSgpKSB7XG4gICAgQUpBWERyaXZlci5yZXF1ZXN0KG9wdGlvbnMsIGNiKTtcbiAgfSBlbHNlIHtcbiAgICBKU09OUERyaXZlci5yZXF1ZXN0KG9wdGlvbnMsIGNiKTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBnbG9iYWwubG9jYXRpb24ucHJvdG9jb2wgPT09ICdodHRwOic7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaGVhZDtcbnZhciB1dWlkID0gcmVxdWlyZSgnLi4vLi4vbGliL3V1aWQnKTtcbnZhciBxdWVyeXN0cmluZyA9IHJlcXVpcmUoJy4uLy4uL2xpYi9xdWVyeXN0cmluZycpO1xudmFyIHRpbWVvdXRzID0ge307XG5cbmZ1bmN0aW9uIF9yZW1vdmVTY3JpcHQoc2NyaXB0KSB7XG4gIGlmIChzY3JpcHQgJiYgc2NyaXB0LnBhcmVudE5vZGUpIHtcbiAgICBzY3JpcHQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzY3JpcHQpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9jcmVhdGVTY3JpcHRUYWcodXJsLCBjYWxsYmFja05hbWUpIHtcbiAgdmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICB2YXIgZG9uZSA9IGZhbHNlO1xuXG4gIHNjcmlwdC5zcmMgPSB1cmw7XG4gIHNjcmlwdC5hc3luYyA9IHRydWU7XG4gIHNjcmlwdC5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgIGdsb2JhbFtjYWxsYmFja05hbWVdKHttZXNzYWdlOiAnZXJyb3InLCBzdGF0dXM6IDUwMH0pO1xuICB9O1xuXG4gIHNjcmlwdC5vbmxvYWQgPSBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChkb25lKSB7IHJldHVybjsgfVxuXG4gICAgaWYgKCF0aGlzLnJlYWR5U3RhdGUgfHwgdGhpcy5yZWFkeVN0YXRlID09PSAnbG9hZGVkJyB8fCB0aGlzLnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZScpIHtcbiAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgc2NyaXB0Lm9ubG9hZCA9IHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBudWxsO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gc2NyaXB0O1xufVxuXG5mdW5jdGlvbiBfY2xlYW51cEdsb2JhbChjYWxsYmFja05hbWUpIHtcbiAgdHJ5IHtcbiAgICBkZWxldGUgZ2xvYmFsW2NhbGxiYWNrTmFtZV07XG4gIH0gY2F0Y2ggKF8pIHtcbiAgICBnbG9iYWxbY2FsbGJhY2tOYW1lXSA9IG51bGw7XG4gIH1cbn1cblxuZnVuY3Rpb24gX3NldHVwVGltZW91dCh0aW1lb3V0LCBjYWxsYmFja05hbWUpIHtcbiAgdGltZW91dHNbY2FsbGJhY2tOYW1lXSA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgIHRpbWVvdXRzW2NhbGxiYWNrTmFtZV0gPSBudWxsO1xuXG4gICAgZ2xvYmFsW2NhbGxiYWNrTmFtZV0oe1xuICAgICAgZXJyb3I6ICd0aW1lb3V0JyxcbiAgICAgIHN0YXR1czogLTFcbiAgICB9KTtcblxuICAgIGdsb2JhbFtjYWxsYmFja05hbWVdID0gZnVuY3Rpb24gKCkge1xuICAgICAgX2NsZWFudXBHbG9iYWwoY2FsbGJhY2tOYW1lKTtcbiAgICB9O1xuICB9LCB0aW1lb3V0KTtcbn1cblxuZnVuY3Rpb24gX3NldHVwR2xvYmFsQ2FsbGJhY2soc2NyaXB0LCBjYWxsYmFjaywgY2FsbGJhY2tOYW1lKSB7XG4gIGdsb2JhbFtjYWxsYmFja05hbWVdID0gZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgdmFyIHN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1cyB8fCA1MDA7XG4gICAgdmFyIGVyciA9IG51bGw7XG4gICAgdmFyIGRhdGEgPSBudWxsO1xuXG4gICAgZGVsZXRlIHJlc3BvbnNlLnN0YXR1cztcblxuICAgIGlmIChzdGF0dXMgPj0gNDAwIHx8IHN0YXR1cyA8IDIwMCkge1xuICAgICAgZXJyID0gcmVzcG9uc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRhdGEgPSByZXNwb25zZTtcbiAgICB9XG5cbiAgICBfY2xlYW51cEdsb2JhbChjYWxsYmFja05hbWUpO1xuICAgIF9yZW1vdmVTY3JpcHQoc2NyaXB0KTtcblxuICAgIGNsZWFyVGltZW91dCh0aW1lb3V0c1tjYWxsYmFja05hbWVdKTtcbiAgICBjYWxsYmFjayhlcnIsIGRhdGEsIHN0YXR1cyk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHJlcXVlc3Qob3B0aW9ucywgY2FsbGJhY2spIHtcbiAgdmFyIHNjcmlwdDtcbiAgdmFyIGNhbGxiYWNrTmFtZSA9ICdjYWxsYmFja19qc29uXycgKyB1dWlkKCkucmVwbGFjZSgvLS9nLCAnJyk7XG4gIHZhciB1cmwgPSBvcHRpb25zLnVybDtcbiAgdmFyIGF0dHJzID0gb3B0aW9ucy5kYXRhO1xuICB2YXIgbWV0aG9kID0gb3B0aW9ucy5tZXRob2Q7XG4gIHZhciB0aW1lb3V0ID0gb3B0aW9ucy50aW1lb3V0O1xuXG4gIHVybCA9IHF1ZXJ5c3RyaW5nLnF1ZXJ5aWZ5KHVybCwgYXR0cnMpO1xuICB1cmwgPSBxdWVyeXN0cmluZy5xdWVyeWlmeSh1cmwsIHtcbiAgICBfbWV0aG9kOiBtZXRob2QsXG4gICAgY2FsbGJhY2s6IGNhbGxiYWNrTmFtZVxuICB9KTtcblxuICBzY3JpcHQgPSBfY3JlYXRlU2NyaXB0VGFnKHVybCwgY2FsbGJhY2tOYW1lKTtcbiAgX3NldHVwR2xvYmFsQ2FsbGJhY2soc2NyaXB0LCBjYWxsYmFjaywgY2FsbGJhY2tOYW1lKTtcbiAgX3NldHVwVGltZW91dCh0aW1lb3V0LCBjYWxsYmFja05hbWUpO1xuXG4gIGlmICghaGVhZCkge1xuICAgIGhlYWQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xuICB9XG5cbiAgaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgcmVxdWVzdDogcmVxdWVzdFxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYm9keSkge1xuICB0cnkge1xuICAgIGJvZHkgPSBKU09OLnBhcnNlKGJvZHkpO1xuICB9IGNhdGNoIChlKSB7IC8qIGlnbm9yZWQgKi8gfVxuXG4gIHJldHVybiBib2R5O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobWV0aG9kLCBib2R5KSB7XG4gIGlmIChTdHJpbmcobWV0aG9kKS50b0xvd2VyQ2FzZSgpICE9PSAnZ2V0JyAmJiBib2R5ICE9IG51bGwpIHtcbiAgICBib2R5ID0gdHlwZW9mIGJvZHkgPT09ICdzdHJpbmcnID8gYm9keSA6IEpTT04uc3RyaW5naWZ5KGJvZHkpO1xuICB9XG5cbiAgcmV0dXJuIGJvZHk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZXZlbnRzID0gcmVxdWlyZSgnLi4vc2hhcmVkL2NvbnN0YW50cycpLmV2ZW50cztcblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuXHR0aGlzLl9ldmVudHMgPSB7fTtcbn1cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uIChldmVudCwgY2FsbGJhY2spIHtcblx0dGhpcy5fZXZlbnRzW2V2ZW50XSA9IFtjYWxsYmFja107XG4gIHRoaXMuX2J1cy5lbWl0KGV2ZW50cy5QQVlNRU5UX1JFUVVFU1RfQ1JFQVRFX0hBTkRMRVIsIGV2ZW50KTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2VtaXQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcblx0dmFyIGksIGFyZ3M7XG5cdHZhciBjYWxsYmFja3MgPSB0aGlzLl9ldmVudHNbZXZlbnRdO1xuXG5cdGlmICghY2FsbGJhY2tzKSB7IHJldHVybjsgfVxuXG5cdGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG5cdGZvciAoaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcblx0XHRjYWxsYmFja3NbaV0uYXBwbHkobnVsbCwgYXJncyk7XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQnVzID0gcmVxdWlyZSgnLi4vLi4vbGliL2J1cycpO1xudmFyIGNvbnZlcnRNZXRob2RzVG9FcnJvciA9IHJlcXVpcmUoJy4uLy4uL2xpYi9jb252ZXJ0LW1ldGhvZHMtdG8tZXJyb3InKTtcbnZhciBpRnJhbWVyID0gcmVxdWlyZSgnQGJyYWludHJlZS9pZnJhbWVyJyk7XG52YXIgdXVpZCA9IHJlcXVpcmUoJy4uLy4uL2xpYi91dWlkJyk7XG52YXIgbWV0aG9kcyA9IHJlcXVpcmUoJy4uLy4uL2xpYi9tZXRob2RzJyk7XG52YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnLi9ldmVudC1lbWl0dGVyJyk7XG52YXIgUHJvbWlzZSA9IHJlcXVpcmUoJy4uLy4uL2xpYi9wcm9taXNlJyk7XG52YXIgU2VhbWxlc3NwYXlFcnJvciA9IHJlcXVpcmUoJy4uLy4uL2xpYi9zZWFtbGVzc3BheS1lcnJvcicpO1xudmFyIFZFUlNJT04gPSBcIndlYi1zZGtcIjtcbnZhciBjb25zdGFudHMgPSByZXF1aXJlKCcuLi9zaGFyZWQvY29uc3RhbnRzJyk7XG52YXIgeyBmb3JtYXRDaGFyZ2VSZXNwb25zZSB9ID0gcmVxdWlyZSgnLi9yZXNwb25zZS1mb3JtYXR0ZXJzJyk7XG5cbnZhciBldmVudHMgPSBjb25zdGFudHMuZXZlbnRzO1xudmFyIGVycm9ycyA9IGNvbnN0YW50cy5lcnJvcnM7XG5cbnZhciBBUFBMRV9QQVlfQVBJX1ZFUlNJT04gPSBjb25zdGFudHMuQVBQTEVfUEFZX0FQSV9WRVJTSU9OO1xudmFyIFNVUFBPUlRFRF9ORVRXT1JLU19BUFBMRV9QQVkgPSBjb25zdGFudHMuU1VQUE9SVEVEX05FVFdPUktTX0FQUExFX1BBWTtcbnZhciBNRVJDSEFOVF9DQVBBQklMSVRJRVNfQVBQTEVfUEFZID0gY29uc3RhbnRzLk1FUkNIQU5UX0NBUEFCSUxJVElFU19BUFBMRV9QQVk7XG52YXIgU0VBTUxFU1NQQVlfUEFZX1dJVEhfQVBQTEVfTUVSQ0hBTlRfSUQgPSBjb25zdGFudHMuU0VBTUxFU1NQQVlfUEFZX1dJVEhfQVBQTEVfTUVSQ0hBTlRfSUQ7XG52YXIgU0VBTUxFU1NQQVlfUEFZX1dJVEhfR09PR0xFX01FUkNIQU5UX0lEID0gY29uc3RhbnRzLlNFQU1MRVNTUEFZX1BBWV9XSVRIX0dPT0dMRV9NRVJDSEFOVF9JRDtcbnZhciBERUZBVUxUX0NPVU5UUllfQ09ERSA9IGNvbnN0YW50cy5ERUZBVUxUX0NPVU5UUllfQ09ERTtcbnZhciBQQVlNRU5UX1JFUVVFU1RfTUVUSE9EX0FQUExFX1BBWSA9IGNvbnN0YW50cy5QQVlNRU5UX1JFUVVFU1RfTUVUSE9EX0FQUExFX1BBWTtcbnZhciBQQVlNRU5UX1JFUVVFU1RfTUVUSE9EX0dPT0dMRV9QQVkgPSBjb25zdGFudHMuUEFZTUVOVF9SRVFVRVNUX01FVEhPRF9HT09HTEVfUEFZO1xudmFyIEdPT0dMRV9QQVlfQVBJX1ZFUlNJT04gPSBjb25zdGFudHMuR09PR0xFX1BBWV9BUElfVkVSU0lPTjtcbnZhciBHT09HTEVfUEFZX0FQSV9NSU5PUl9WRVJTSU9OID0gY29uc3RhbnRzLkdPT0dMRV9QQVlfQVBJX01JTk9SX1ZFUlNJT047XG52YXIgTUVSQ0hBTlRfQ0FQQUJJTElUSUVTX0dPT0dMRV9QQVkgPSBjb25zdGFudHMuTUVSQ0hBTlRfQ0FQQUJJTElUSUVTX0dPT0dMRV9QQVk7XG52YXIgU1VQUE9SVEVEX05FVFdPUktTX0dPT0dMRV9QQVkgPSBjb25zdGFudHMuU1VQUE9SVEVEX05FVFdPUktTX0dPT0dMRV9QQVk7XG52YXIgR09PR0xFX1BBWV9HQVRFV0FZID0gY29uc3RhbnRzLkdPT0dMRV9QQVlfR0FURVdBWTtcbnZhciBHT09HTEVfUEFZX0dBVEVXQVlfTUVSQ0hBTlRfSUQgPSBjb25zdGFudHMuR09PR0xFX1BBWV9HQVRFV0FZX01FUkNIQU5UX0lEO1xuXG4vKipcbiAqIEB0eXBlZGVmIHtvYmplY3R9IFBheW1lbnRSZXF1ZXN0Q29tcG9uZW50fnRva2VuaXplUGF5bG9hZFxuICogQHByb3BlcnR5IHtzdHJpbmd9IG5vbmNlIFRoZSBwYXltZW50IG1ldGhvZCBub25jZS5cbiAqIEBwcm9wZXJ0eSB7b2JqZWN0fSBkZXRhaWxzIEFkZGl0aW9uYWwgYWNjb3VudCBkZXRhaWxzLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IGRldGFpbHMuY2FyZFR5cGUgVHlwZSBvZiBjYXJkLCBleDogVmlzYSwgTWFzdGVyQ2FyZC5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBkZXRhaWxzLmxhc3RGb3VyIExhc3QgZm91ciBkaWdpdHMgb2YgY2FyZCBudW1iZXIuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gZGV0YWlscy5sYXN0VHdvIExhc3QgdHdvIGRpZ2l0cyBvZiBjYXJkIG51bWJlci5cbiAqIEBwcm9wZXJ0eSB7b2JqZWN0fSBkZXRhaWxzLnJhd1BheW1lbnRSZXNwb25zZSBUaGUgcmF3IHBheW1lbnQgcmVzcG9uc2UgZnJvbSB0aGUgcGF5bWVudCByZXF1ZXN0LCB3aXRoIHNlbnNpdGl2ZSBjYXJkIGRldGFpbHMgcmVtb3ZlZC5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBkZXNjcmlwdGlvbiBBIGh1bWFuLXJlYWRhYmxlIGRlc2NyaXB0aW9uLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IHR5cGUgVGhlIHBheW1lbnQgbWV0aG9kIHR5cGUsIGBDcmVkaXRDYXJkYCBvciBgQW5kcm9pZFBheUNhcmRgLlxuICogQHByb3BlcnR5IHtvYmplY3R9IGJpbkRhdGEgSW5mb3JtYXRpb24gYWJvdXQgdGhlIGNhcmQgYmFzZWQgb24gdGhlIGJpbi5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBiaW5EYXRhLmNvbW1lcmNpYWwgUG9zc2libGUgdmFsdWVzOiAnWWVzJywgJ05vJywgJ1Vua25vd24nLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IGJpbkRhdGEuY291bnRyeU9mSXNzdWFuY2UgVGhlIGNvdW50cnkgb2YgaXNzdWFuY2UuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gYmluRGF0YS5kZWJpdCBQb3NzaWJsZSB2YWx1ZXM6ICdZZXMnLCAnTm8nLCAnVW5rbm93bicuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gYmluRGF0YS5kdXJiaW5SZWd1bGF0ZWQgUG9zc2libGUgdmFsdWVzOiAnWWVzJywgJ05vJywgJ1Vua25vd24nLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IGJpbkRhdGEuaGVhbHRoY2FyZSBQb3NzaWJsZSB2YWx1ZXM6ICdZZXMnLCAnTm8nLCAnVW5rbm93bicuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gYmluRGF0YS5pc3N1aW5nQmFuayBUaGUgaXNzdWluZyBiYW5rLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IGJpbkRhdGEucGF5cm9sbCBQb3NzaWJsZSB2YWx1ZXM6ICdZZXMnLCAnTm8nLCAnVW5rbm93bicuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gYmluRGF0YS5wcmVwYWlkIFBvc3NpYmxlIHZhbHVlczogJ1llcycsICdObycsICdVbmtub3duJy5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBiaW5EYXRhLnByb2R1Y3RJZCBUaGUgcHJvZHVjdCBpZC5cbiAqL1xuXG5mdW5jdGlvbiBjb21wb3NlVXJsKGNvbmZpZywgY29tcG9uZW50SWQsIGlzRGVidWcpIHtcbiAgdmFyIGFzc2V0c1VybCA9IGNvbmZpZy5nYXRld2F5Q29uZmlndXJhdGlvbi5hc3NldHNVcmw7XG5cbiAgaWYgKGlzRGVidWcpIHtcbiAgICBhc3NldHNVcmwgPSBhc3NldHNVcmwucmVwbGFjZSgnaHR0cHMnLCAnaHR0cCcpO1xuICB9XG4gIHZhciBtaW4gPSBpc0RlYnVnID8gJycgOiAnLm1pbic7XG5cbiAgcmV0dXJuIGFzc2V0c1VybCArICcvJyArIFZFUlNJT04gKyAnL2h0bWwvZGlnaXRhbC13YWxsZXRzLWZyYW1lJyArIG1pbiArICcuaHRtbCMnICsgY29tcG9uZW50SWQ7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUlucHV0RXZlbnRIYW5kbGVyKCkge1xuICByZXR1cm4gZnVuY3Rpb24gKGV2ZW50RGF0YSwgcmVwbHkpIHtcbiAgICB2YXIgY2FsbGJhY2sgPSB7fTtcbiAgICBpZiAoZXZlbnREYXRhLmhhbmRsZXJOYW1lKSB7XG4gICAgICBjYWxsYmFja1tldmVudERhdGEuaGFuZGxlck5hbWVdID0gcmVwbHk7XG4gICAgfVxuICAgIHRoaXMuX2VtaXQoZXZlbnREYXRhLnR5cGUsIE9iamVjdC5hc3NpZ24oZXZlbnREYXRhLnBheWxvYWQsIGNhbGxiYWNrKSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHByb2Nlc3NFcnJvcihjYkZuKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICB2YXIgZm9ybWF0dGVkRXJyb3I7XG5cbiAgICBpZiAoZXJyb3IubmFtZSA9PT0gJ0Fib3J0RXJyb3InKSB7XG4gICAgICBmb3JtYXR0ZWRFcnJvciA9IG5ldyBTZWFtbGVzc3BheUVycm9yKHtcbiAgICAgICAgdHlwZTogZXJyb3JzLlBBWU1FTlRfUkVRVUVTVF9DQU5DRUxFRC50eXBlLFxuICAgICAgICBjb2RlOiBlcnJvcnMuUEFZTUVOVF9SRVFVRVNUX0NBTkNFTEVELmNvZGUsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9ycy5QQVlNRU5UX1JFUVVFU1RfQ0FOQ0VMRUQubWVzc2FnZSxcbiAgICAgICAgZGV0YWlsczoge1xuICAgICAgICAgIG9yaWdpbmFsRXJyb3I6IGVycm9yLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChlcnJvci5uYW1lID09PSAnUEFZTUVOVF9SRVFVRVNUX0lOSVRJQUxJWkFUSU9OX0ZBSUxFRCcpIHtcbiAgICAgIGZvcm1hdHRlZEVycm9yID0gbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgICB0eXBlOiBlcnJvcnMuUEFZTUVOVF9SRVFVRVNUX0lOSVRJQUxJWkFUSU9OX01JU0NPTkZJR1VSRUQudHlwZSxcbiAgICAgICAgY29kZTogZXJyb3JzLlBBWU1FTlRfUkVRVUVTVF9JTklUSUFMSVpBVElPTl9NSVNDT05GSUdVUkVELmNvZGUsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9ycy5QQVlNRU5UX1JFUVVFU1RfSU5JVElBTElaQVRJT05fTUlTQ09ORklHVVJFRC5tZXNzYWdlLFxuICAgICAgICBkZXRhaWxzOiB7XG4gICAgICAgICAgb3JpZ2luYWxFcnJvcjogZXJyb3IsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKGVycm9yLm5hbWUgPT09ICdTRUFNTEVTU1BBWV9HQVRFV0FZX1BBWV9XSVRIX0dPT0dMRV9UT0tFTklaQVRJT05fRVJST1InKSB7XG4gICAgICBmb3JtYXR0ZWRFcnJvciA9IG5ldyBTZWFtbGVzc3BheUVycm9yKHtcbiAgICAgICAgdHlwZTogZXJyb3JzLlBBWU1FTlRfUkVRVUVTVF9QQVlfV0lUSF9HT09HTEVfRkFJTEVEX1RPX1RPS0VOSVpFLnR5cGUsXG4gICAgICAgIGNvZGU6IGVycm9ycy5QQVlNRU5UX1JFUVVFU1RfUEFZX1dJVEhfR09PR0xFX0ZBSUxFRF9UT19UT0tFTklaRS5jb2RlLFxuICAgICAgICBtZXNzYWdlOiBlcnJvcnMuUEFZTUVOVF9SRVFVRVNUX1BBWV9XSVRIX0dPT0dMRV9GQUlMRURfVE9fVE9LRU5JWkUubWVzc2FnZSxcbiAgICAgICAgZGV0YWlsczoge1xuICAgICAgICAgIG9yaWdpbmFsRXJyb3I6IGVycm9yLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChlcnJvci5uYW1lID09PSAnU0VBTUxFU1NQQVlfR0FURVdBWV9QQVlfV0lUSF9HT09HTEVfUEFSU0lOR19FUlJPUicpIHtcbiAgICAgIGZvcm1hdHRlZEVycm9yID0gbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgICB0eXBlOiBlcnJvcnMuUEFZTUVOVF9SRVFVRVNUX1BBWV9XSVRIX0dPT0dMRV9QQVJTSU5HX0VSUk9SLnR5cGUsXG4gICAgICAgIGNvZGU6IGVycm9ycy5QQVlNRU5UX1JFUVVFU1RfUEFZX1dJVEhfR09PR0xFX1BBUlNJTkdfRVJST1IuY29kZSxcbiAgICAgICAgbWVzc2FnZTogZXJyb3JzLlBBWU1FTlRfUkVRVUVTVF9QQVlfV0lUSF9HT09HTEVfUEFSU0lOR19FUlJPUi5tZXNzYWdlLFxuICAgICAgICBkZXRhaWxzOiB7XG4gICAgICAgICAgb3JpZ2luYWxFcnJvcjogZXJyb3IsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9ybWF0dGVkRXJyb3IgPSBuZXcgU2VhbWxlc3NwYXlFcnJvcih7XG4gICAgICAgIGNvZGU6IGVycm9ycy5QQVlNRU5UX1JFUVVFU1RfTk9UX0NPTVBMRVRFRC5jb2RlLFxuICAgICAgICB0eXBlOiBlcnJvci50eXBlIHx8IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuQ1VTVE9NRVIsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9ycy5QQVlNRU5UX1JFUVVFU1RfTk9UX0NPTVBMRVRFRC5tZXNzYWdlLFxuICAgICAgICBkZXRhaWxzOiB7XG4gICAgICAgICAgb3JpZ2luYWxFcnJvcjogZXJyb3IsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9XG4gICAgY2JGbihmb3JtYXR0ZWRFcnJvcik7XG4gIH07XG59XG5cbi8qKlxuICogQGNsYXNzIFBheW1lbnRSZXF1ZXN0Q29tcG9uZW50XG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyBUaGUgRGlnaXRhbCBXYWxsZXRzIENvbXBvbmVudCB7QGxpbmsgbW9kdWxlOnNlYW1sZXNzcGF5LXdlYi9wYXltZW50LXJlcXVlc3QuY3JlYXRlIGNyZWF0ZX0gb3B0aW9ucy5cbiAqIEBkZXNjcmlwdGlvbiA8c3Ryb25nPkRvIG5vdCB1c2UgdGhpcyBjb25zdHJ1Y3RvciBkaXJlY3RseS4gVXNlIHtAbGluayBtb2R1bGU6c2VhbWxlc3NwYXktd2ViL3BheW1lbnQtcmVxdWVzdC5jcmVhdGV8c2VhbWxlc3NwYXktd2ViLnBheW1lbnQtcmVxdWVzdC5jcmVhdGV9IGluc3RlYWQuPC9zdHJvbmc+XG4gKlxuICogQGNsYXNzZGVzYyBUaGlzIGNsYXNzIHJlcHJlc2VudHMgYSBEaWdpdGFsIFdhbGxldHMgY29tcG9uZW50IHByb2R1Y2VkIGJ5IHtAbGluayBtb2R1bGU6c2VhbWxlc3NwYXktd2ViL3BheW1lbnQtcmVxdWVzdC5jcmVhdGV8c2VhbWxlc3NwYXktd2ViL3BheW1lbnQtcmVxdWVzdC5jcmVhdGV9LiBJbnN0YW5jZXMgb2YgdGhpcyBjbGFzcyBoYXZlIG1ldGhvZHMgZm9yIGluaXRpYWxpemluZyBhIERpZ2l0YWwgV2FsbGV0cy5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBjb21wb25lbnQgaXMgY3VycmVudGx5IGluIGJldGEgYW5kIHRoZSBBUEkgbWF5IGluY2x1ZGUgYnJlYWtpbmcgY2hhbmdlcyB3aGVuIHVwZ3JhZGluZy5cbiAqL1xuZnVuY3Rpb24gUGF5bWVudFJlcXVlc3RDb21wb25lbnQob3B0aW9ucykge1xuICB0aGlzLl9jb21wb25lbnRJZCA9IHV1aWQoKTtcbiAgdGhpcy5fY2xpZW50ID0gb3B0aW9ucy5jbGllbnQ7XG4gIHRoaXMuX2FuYWx5dGljc05hbWUgPSAnZGlnaXRhbC13YWxsZXRzJztcbiAgdGhpcy5fcGF5bWVudEJ1dHRvbiA9IG51bGw7XG4gIHRoaXMuX3BheW1lbnREYXRhID0gb3B0aW9ucy5wYXltZW50RGF0YTtcbiAgdGhpcy5fcGF5bWVudEJ1dHRvbkNvbnRhaW5lclNlbGVjdG9yID0gb3B0aW9ucy5wYXltZW50QnV0dG9uQ29udGFpbmVyLnNlbGVjdG9yO1xuICB0aGlzLl9lbmFibGVkUGF5bWVudE1ldGhvZHMgPSB7XG4gICAgcGF5V2l0aEdvb2dsZTogb3B0aW9ucy5zdXBwb3J0ZWRXYWxsZXRUeXBlcy5pbmNsdWRlcygnZ29vZ2xlX3BheScpLFxuICAgIHBheVdpdGhBcHBsZTogb3B0aW9ucy5zdXBwb3J0ZWRXYWxsZXRUeXBlcy5pbmNsdWRlcygnYXBwbGVfcGF5JyksXG4gIH07XG4gIHRoaXMuX21lcmNoYW50TmFtZSA9IG9wdGlvbnMub3B0aW9ucyAmJiBvcHRpb25zLm9wdGlvbnMubWVyY2hhbnROYW1lO1xuICB0aGlzLl9zdXBwb3J0ZWRQYXltZW50TWV0aG9kcyA9IHRoaXMuX2NvbnN0cnVjdERlZmF1bHRTdXBwb3J0ZWRQYXltZW50TWV0aG9kcygpO1xuICB0aGlzLl9wYXltZW50UmVxdWVzdCA9IHtcbiAgICBzdXBwb3J0ZWRQYXltZW50TWV0aG9kczogdGhpcy5fc3VwcG9ydGVkUGF5bWVudE1ldGhvZHMsXG4gICAgcGF5bWVudERhdGE6IG9wdGlvbnMucGF5bWVudERhdGEsXG4gIH07XG4gIHRoaXMuX2J1cyA9IG5ldyBCdXMoeyBjaGFubmVsOiB0aGlzLl9jb21wb25lbnRJZCB9KTtcblxuICBFdmVudEVtaXR0ZXIuY2FsbCh0aGlzKTtcbn1cblxuUGF5bWVudFJlcXVlc3RDb21wb25lbnQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFdmVudEVtaXR0ZXIucHJvdG90eXBlLCB7XG4gIGNvbnN0cnVjdG9yOiBQYXltZW50UmVxdWVzdENvbXBvbmVudCxcbn0pO1xuXG5QYXltZW50UmVxdWVzdENvbXBvbmVudC5wcm90b3R5cGUuX3NldHVwUGF5bWVudEJ1dHRvbiA9IGZ1bmN0aW9uIChjb250YWluZXJTZWxlY3Rvcikge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNvbnRhaW5lclNlbGVjdG9yKTtcblxuICBpZiAoIWNvbnRhaW5lcikge1xuICAgIHRocm93IG5ldyBTZWFtbGVzc3BheUVycm9yKHtcbiAgICAgIHR5cGU6IGVycm9ycy5QQVlNRU5UX1JFUVVFU1RfSU5WQUxJRF9QQVlNRU5UX0JVVFRPTl9DT05UQUlORVJfU0VMRUNUT1IudHlwZSxcbiAgICAgIGNvZGU6IGVycm9ycy5QQVlNRU5UX1JFUVVFU1RfSU5WQUxJRF9QQVlNRU5UX0JVVFRPTl9DT05UQUlORVJfU0VMRUNUT1IuY29kZSxcbiAgICAgIG1lc3NhZ2U6IGVycm9ycy5QQVlNRU5UX1JFUVVFU1RfSU5WQUxJRF9QQVlNRU5UX0JVVFRPTl9DT05UQUlORVJfU0VMRUNUT1IubWVzc2FnZSxcbiAgICAgIGRldGFpbHM6IHtcbiAgICAgICAgcGF5bWVudEJ1dHRvbkNvbnRhaW5lclNlbGVjdG9yOiBjb250YWluZXJTZWxlY3RvcixcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBpZiAod2luZG93LkFwcGxlUGF5U2Vzc2lvbikge1xuICAgIHZhciBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgc3R5bGUuaW5uZXJIVE1MID0gYFxuICAgICAgICAuYXBwbGUtcGF5LWJ1dHRvbiB7XG4gICAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgICAgICAgICAtd2Via2l0LWFwcGVhcmFuY2U6IC1hcHBsZS1wYXktYnV0dG9uO1xuICAgICAgICAgICAgLWFwcGxlLXBheS1idXR0b24tdHlwZTogcGxhaW47XG4gICAgICAgIH1cbiAgICAgICAgLmFwcGxlLXBheS1idXR0b24tYmxhY2sge1xuICAgICAgICAgICAgLWFwcGxlLXBheS1idXR0b24tc3R5bGU6IGJsYWNrO1xuICAgICAgICB9XG4gICAgICAgIC5hcHBsZS1wYXktYnV0dG9uLXdoaXRlIHtcbiAgICAgICAgICAgIC1hcHBsZS1wYXktYnV0dG9uLXN0eWxlOiB3aGl0ZTtcbiAgICAgICAgfVxuICAgICAgICAuYXBwbGUtcGF5LWJ1dHRvbi13aGl0ZS13aXRoLWxpbmUge1xuICAgICAgICAgICAgLWFwcGxlLXBheS1idXR0b24tc3R5bGU6IHdoaXRlLW91dGxpbmU7XG4gICAgICAgIH1cbiAgICBgO1xuICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICAgIHZhciBhcHBsZVBheUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGFwcGxlUGF5QnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2FwcGxlLXBheS1idXR0b24nLCAnYXBwbGUtcGF5LWJ1dHRvbi1ibGFjaycpO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChhcHBsZVBheUJ1dHRvbik7XG5cbiAgICBhcHBsZVBheUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGZcbiAgICAgICAgLnNob3coKVxuICAgICAgICAudGhlbigocGF5bWVudFJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgc2VsZi5fcGF5bWVudFJlc3BvbnNlSGFuZGxlcihudWxsLCBmb3JtYXRDaGFyZ2VSZXNwb25zZShwYXltZW50UmVzcG9uc2UpKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICAgIHNlbGYuX3BheW1lbnRSZXNwb25zZUhhbmRsZXIoZXJyb3IsIG51bGwpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgfVxufTtcblxuUGF5bWVudFJlcXVlc3RDb21wb25lbnQucHJvdG90eXBlLl9jb25zdHJ1Y3REZWZhdWx0U3VwcG9ydGVkUGF5bWVudE1ldGhvZHMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBjb25maWd1cmF0aW9uID0gdGhpcy5fY2xpZW50LmdldENvbmZpZ3VyYXRpb24oKTtcbiAgdmFyIGlzUHJvZHVjdGlvbiA9IGNvbmZpZ3VyYXRpb24uZ2F0ZXdheUNvbmZpZ3VyYXRpb24uZW52aXJvbm1lbnQgPT09ICdwcm9kdWN0aW9uJztcbiAgdmFyIHN1cHBvcnRlZFBheW1lbnRNZXRob2RzID0ge307XG5cbiAgaWYgKHRoaXMuX2VuYWJsZWRQYXltZW50TWV0aG9kcy5wYXlXaXRoQXBwbGUpIHtcbiAgICBzdXBwb3J0ZWRQYXltZW50TWV0aG9kcy5wYXlXaXRoQXBwbGUgPSB7XG4gICAgICBzdXBwb3J0ZWRNZXRob2RzOiBbUEFZTUVOVF9SRVFVRVNUX01FVEhPRF9BUFBMRV9QQVldLFxuICAgICAgZGF0YToge1xuICAgICAgICB2ZXJzaW9uOiBBUFBMRV9QQVlfQVBJX1ZFUlNJT04sXG4gICAgICAgIHN1cHBvcnRlZE5ldHdvcmtzOiBTVVBQT1JURURfTkVUV09SS1NfQVBQTEVfUEFZLFxuICAgICAgICBtZXJjaGFudElkZW50aWZpZXI6IFNFQU1MRVNTUEFZX1BBWV9XSVRIX0FQUExFX01FUkNIQU5UX0lELFxuICAgICAgICBtZXJjaGFudENhcGFiaWxpdGllczogTUVSQ0hBTlRfQ0FQQUJJTElUSUVTX0FQUExFX1BBWSxcbiAgICAgICAgY291bnRyeUNvZGU6IERFRkFVTFRfQ09VTlRSWV9DT0RFLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgaWYgKHRoaXMuX2VuYWJsZWRQYXltZW50TWV0aG9kcy5wYXlXaXRoR29vZ2xlKSB7XG4gICAgc3VwcG9ydGVkUGF5bWVudE1ldGhvZHMucGF5V2l0aEdvb2dsZSA9IHtcbiAgICAgIHN1cHBvcnRlZE1ldGhvZHM6IFtQQVlNRU5UX1JFUVVFU1RfTUVUSE9EX0dPT0dMRV9QQVldLFxuICAgICAgZGF0YToge1xuICAgICAgICBlbnZpcm9ubWVudDogaXNQcm9kdWN0aW9uID8gJ1BST0RVQ1RJT04nIDogJ1RFU1QnLFxuICAgICAgICBhcGlWZXJzaW9uOiBHT09HTEVfUEFZX0FQSV9WRVJTSU9OLFxuICAgICAgICBhcGlWZXJzaW9uTWlub3I6IEdPT0dMRV9QQVlfQVBJX01JTk9SX1ZFUlNJT04sXG4gICAgICAgIG1lcmNoYW50SW5mbzoge1xuICAgICAgICAgIG1lcmNoYW50SWQ6IFNFQU1MRVNTUEFZX1BBWV9XSVRIX0dPT0dMRV9NRVJDSEFOVF9JRCxcbiAgICAgICAgICBtZXJjaGFudE5hbWU6IHRoaXMuX21lcmNoYW50TmFtZSxcbiAgICAgICAgfSxcbiAgICAgICAgYWxsb3dlZFBheW1lbnRNZXRob2RzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdHlwZTogJ0NBUkQnLFxuICAgICAgICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICAgICAgICBhbGxvd2VkQXV0aE1ldGhvZHM6IE1FUkNIQU5UX0NBUEFCSUxJVElFU19HT09HTEVfUEFZLFxuICAgICAgICAgICAgICBhbGxvd2VkQ2FyZE5ldHdvcmtzOiBTVVBQT1JURURfTkVUV09SS1NfR09PR0xFX1BBWSxcbiAgICAgICAgICAgICAgYmlsbGluZ0FkZHJlc3NSZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0b2tlbml6YXRpb25TcGVjaWZpY2F0aW9uOiB7XG4gICAgICAgICAgICAgIHR5cGU6ICdQQVlNRU5UX0dBVEVXQVknLFxuICAgICAgICAgICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgICAgICAgZ2F0ZXdheTogR09PR0xFX1BBWV9HQVRFV0FZLFxuICAgICAgICAgICAgICAgIGdhdGV3YXlNZXJjaGFudElkOiBHT09HTEVfUEFZX0dBVEVXQVlfTUVSQ0hBTlRfSUQsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICByZXR1cm4gc3VwcG9ydGVkUGF5bWVudE1ldGhvZHM7XG59O1xuXG5QYXltZW50UmVxdWVzdENvbXBvbmVudC5wcm90b3R5cGUuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgY2xpZW50Q29uZmlndXJhdGlvbiA9IHNlbGYuX2NsaWVudC5nZXRDb25maWd1cmF0aW9uKCk7XG5cbiAgc2VsZi5fZnJhbWUgPSBpRnJhbWVyKHtcbiAgICBhbGxvdzogJ3BheW1lbnQnLFxuICAgIG5hbWU6ICdzZWFtbGVzc3BheS1kaWdpdGFsLXdhbGxldHMtZnJhbWUnLFxuICAgIGNsYXNzOiAnc2VhbWxlc3NwYXktZGlnaXRhbC13YWxsZXRzLWZyYW1lJyxcbiAgICB3aWR0aDogJzEwMCUnLFxuICAgIGhlaWdodDogJzEwMCUnLFxuICAgIHN0eWxlOiB7XG4gICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgIGxlZnQ6ICctOTk5OXB4JyxcbiAgICB9LFxuICB9KTtcblxuICBpZiAoT2JqZWN0LmtleXMoc2VsZi5fc3VwcG9ydGVkUGF5bWVudE1ldGhvZHMpLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgU2VhbWxlc3NwYXlFcnJvcihlcnJvcnMuUEFZTUVOVF9SRVFVRVNUX05PX1ZBTElEX1NVUFBPUlRFRF9QQVlNRU5UX01FVEhPRFMpKTtcbiAgfVxuXG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgIHNlbGYuX2J1cy5vbihldmVudHMuRlJBTUVfUkVBRFksIGZ1bmN0aW9uIChyZXBseSkge1xuICAgICAgcmVwbHkoeyBjbGllbnQ6IHNlbGYuX2NsaWVudCwgZW5hYmxlZFBheW1lbnRNZXRob2RzOiBzZWxmLl9lbmFibGVkUGF5bWVudE1ldGhvZHMgfSk7XG4gICAgICBzZWxmLl9lbWl0KCdyZWFkeScpO1xuICAgIH0pO1xuICAgIHNlbGYuX2J1cy5vbihldmVudHMuRlJBTUVfQ0FOX01BS0VfUkVRVUVTVFMsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJlc29sdmUoc2VsZik7XG4gICAgfSk7XG5cbiAgICBzZWxmLl9mcmFtZS5zcmMgPSBjb21wb3NlVXJsKGNsaWVudENvbmZpZ3VyYXRpb24sIHNlbGYuX2NvbXBvbmVudElkLCBjbGllbnRDb25maWd1cmF0aW9uLmlzRGVidWcpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2VsZi5fZnJhbWUpO1xuXG4gICAgc2VsZi5fYnVzLm9uKGV2ZW50cy5JTlBVVF9FVkVOVCwgY3JlYXRlSW5wdXRFdmVudEhhbmRsZXIoKS5iaW5kKHNlbGYpKTtcblxuICAgIHNlbGYuX3NldHVwUGF5bWVudEJ1dHRvbihzZWxmLl9wYXltZW50QnV0dG9uQ29udGFpbmVyU2VsZWN0b3IpO1xuICB9KTtcbn07XG5cblBheW1lbnRSZXF1ZXN0Q29tcG9uZW50LnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgc2VsZi5fYnVzLmVtaXQoXG4gICAgICBldmVudHMuUEFZTUVOVF9SRVFVRVNUX0lOVk9LRUQsXG4gICAgICB7XG4gICAgICAgIHN1cHBvcnRlZFBheW1lbnRNZXRob2RzOiBzZWxmLl9wYXltZW50UmVxdWVzdC5zdXBwb3J0ZWRQYXltZW50TWV0aG9kcyxcbiAgICAgICAgcGF5bWVudERhdGE6IHNlbGYuX3BheW1lbnRSZXF1ZXN0LnBheW1lbnREYXRhLFxuICAgICAgICBvcHRpb25zOiBzZWxmLl9wYXltZW50UmVxdWVzdC5vcHRpb25zLFxuICAgICAgfSxcbiAgICAgICdzaG93J1xuICAgICk7XG5cbiAgICBzZWxmLl9idXMub24oZXZlbnRzLlBBWU1FTlRfUkVRVUVTVF9JTlZPS0VEX1NVQ0NFU1NGVUwsIGZ1bmN0aW9uIChwYXlsb2FkKSB7XG4gICAgICByZXNvbHZlKHBheWxvYWQpO1xuICAgIH0pO1xuXG4gICAgc2VsZi5fYnVzLm9uKGV2ZW50cy5QQVlNRU5UX1JFUVVFU1RfSU5WT0tFRF9GQUlMRUQsIHByb2Nlc3NFcnJvci5jYWxsKHNlbGYsIHJlamVjdCkpO1xuICB9KTtcbn07XG5cblBheW1lbnRSZXF1ZXN0Q29tcG9uZW50LnByb3RvdHlwZS5hZGRQYXltZW50UmVzcG9uc2VIYW5kbGVyID0gZnVuY3Rpb24gKGhhbmRsZXIpIHtcbiAgaWYgKHR5cGVvZiBoYW5kbGVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHRoaXMuX3BheW1lbnRSZXNwb25zZUhhbmRsZXIgPSBoYW5kbGVyO1xufTtcblxuLyoqXG4gKiBDbGVhbmx5IHJlbW92ZSBhbnl0aGluZyBzZXQgdXAgYnkge0BsaW5rIG1vZHVsZTpzZWFtbGVzc3BheS13ZWIvcGF5bWVudC1yZXF1ZXN0LmNyZWF0ZXxjcmVhdGV9LlxuICogQHB1YmxpY1xuICogQHBhcmFtIHtjYWxsYmFja30gW2NhbGxiYWNrXSBDYWxsZWQgb24gY29tcGxldGlvbi5cbiAqIEBleGFtcGxlXG4gKiBwYXltZW50UmVxdWVzdEluc3RhbmNlLnRlYXJkb3duKCk7XG4gKiBAZXhhbXBsZSA8Y2FwdGlvbj5XaXRoIGNhbGxiYWNrPC9jYXB0aW9uPlxuICogcGF5bWVudFJlcXVlc3RJbnN0YW5jZS50ZWFyZG93bihmdW5jdGlvbiAoKSB7XG4gKiAgIC8vIHRlYXJkb3duIGlzIGNvbXBsZXRlXG4gKiB9KTtcbiAqIEByZXR1cm5zIHtQcm9taXNlfHZvaWR9IFJldHVybnMgYSBwcm9taXNlIGlmIG5vIGNhbGxiYWNrIGlzIHByb3ZpZGVkLlxuICovXG5QYXltZW50UmVxdWVzdENvbXBvbmVudC5wcm90b3R5cGUudGVhcmRvd24gPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuX2J1cy50ZWFyZG93bigpO1xuICB0aGlzLl9mcmFtZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMuX2ZyYW1lKTtcblxuICBjb252ZXJ0TWV0aG9kc1RvRXJyb3IodGhpcywgbWV0aG9kcyhQYXltZW50UmVxdWVzdENvbXBvbmVudC5wcm90b3R5cGUpLmNvbmNhdChtZXRob2RzKEV2ZW50RW1pdHRlci5wcm90b3R5cGUpKSk7XG5cbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQYXltZW50UmVxdWVzdENvbXBvbmVudDtcbiIsIlxuZnVuY3Rpb24gZm9ybWF0Q2hhcmdlUmVzcG9uc2UocGF5bG9hZCkge1xuICBpZiAoIShwYXlsb2FkIGluc3RhbmNlb2YgT2JqZWN0KSkgcmV0dXJuIHBheWxvYWRcblxuICB2YXIge1xuICAgIGFjY291bnRUeXBlLFxuICAgIGFtb3VudCxcbiAgICBhdXRoQ29kZSxcbiAgICBiYXRjaElkLFxuICAgIGN1cnJlbmN5LFxuICAgIGV4cERhdGUsXG4gICAgaWQsXG4gICAgbGFzdEZvdXIsXG4gICAgcGF5bWVudE5ldHdvcmssXG4gICAgc3RhdHVzLFxuICAgIHN0YXR1c0NvZGUsXG4gICAgc3RhdHVzRGVzY3JpcHRpb24sXG4gICAgc3VyY2hhcmdlRmVlQW1vdW50LFxuICAgIHRpcCxcbiAgICB0b2tlbjogcGF5bWVudFRva2VuLFxuICAgIHRyYW5zYWN0aW9uRGF0ZSxcbiAgfSA9IHBheWxvYWQ7XG5cbiAgcmV0dXJuIHtcbiAgICBwYXltZW50VG9rZW4sXG4gICAgZGV0YWlsczoge1xuICAgICAgYWNjb3VudFR5cGUsXG4gICAgICBhbW91bnQsXG4gICAgICBhdXRoQ29kZSxcbiAgICAgIGJhdGNoSWQsXG4gICAgICBjdXJyZW5jeSxcbiAgICAgIGV4cERhdGUsXG4gICAgICBpZCxcbiAgICAgIGxhc3RGb3VyLFxuICAgICAgcGF5bWVudE5ldHdvcmssXG4gICAgICBzdGF0dXMsXG4gICAgICBzdGF0dXNDb2RlLFxuICAgICAgc3RhdHVzRGVzY3JpcHRpb24sXG4gICAgICBzdXJjaGFyZ2VGZWVBbW91bnQsXG4gICAgICB0aXAsXG4gICAgICB0cmFuc2FjdGlvbkRhdGUsXG4gICAgfVxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZm9ybWF0Q2hhcmdlUmVzcG9uc2Vcbn1cbiIsIid1c2Ugc3RyaWN0Jztcbi8qKlxuICogQG1vZHVsZSBzZWFtbGVzc3BheS13ZWIvcGF5bWVudC1yZXF1ZXN0XG4gKiBAZGVzY3JpcHRpb24gQSBjb21wb25lbnQgdG8gaW50ZWdyYXRlIHdpdGggdGhlIERpZ2l0YWwgV2FsbGV0cyBBUEkuXG4gKlxuICogKipOb3RlOioqIFRoaXMgY29tcG9uZW50IGlzIGN1cnJlbnRseSBpbiBiZXRhIGFuZCB0aGUgQVBJIG1heSBpbmNsdWRlIGJyZWFraW5nIGNoYW5nZXMgd2hlbiB1cGdyYWRpbmcuXG4gKiAqL1xuXG52YXIgUGF5bWVudFJlcXVlc3RDb21wb25lbnQgPSByZXF1aXJlKCcuL2V4dGVybmFsL3BheW1lbnQtcmVxdWVzdCcpO1xudmFyIGJhc2ljQ29tcG9uZW50VmVyaWZpY2F0aW9uID0gcmVxdWlyZSgnLi4vbGliL2Jhc2ljLWNvbXBvbmVudC12ZXJpZmljYXRpb24nKTtcbnZhciB3cmFwUHJvbWlzZSA9IHJlcXVpcmUoJ0BicmFpbnRyZWUvd3JhcC1wcm9taXNlJyk7XG52YXIgVkVSU0lPTiA9IFwid2ViLXNka1wiO1xuXG4vKipcbiAqIEBzdGF0aWNcbiAqIEBmdW5jdGlvbiBjcmVhdGVcbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIENyZWF0aW9uIG9wdGlvbnM6XG4gKiBAcGFyYW0ge0NsaWVudH0gb3B0aW9ucy5jbGllbnQgQSB7QGxpbmsgQ2xpZW50fSBpbnN0YW5jZS5cbiAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9ucy5lbmFibGVkUGF5bWVudE1ldGhvZHNdIEFuIG9iamVjdCByZXByZXNlbnRpbmcgd2hpY2ggcGF5bWVudCBtZXRob2RzIHRvIGRpc3BsYXkuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmVuYWJsZWRQYXltZW50TWV0aG9kcy5wYXlXaXRoR29vZ2xlPXRydWVdIFdoZXRoZXIgb3Igbm90IHRvIGRpc3BsYXkgUGF5IHdpdGggR29vZ2xlIGFzIGFuIG9wdGlvbiBpbiB0aGUgRGlnaXRhbCBXYWxsZXRzIGRpYWxvZy4gSWYgbGVmdCBibGFuayBvciBzZXQgdG8gdHJ1ZSwgUGF5IHdpdGggR29vZ2xlIHdpbGwgYmUgZGlzcGxheWVkIGluIHRoZSBkaWFsb2cgaWYgdGhlIG1lcmNoYW50IGFjY291bnQgaXMgc2V0IHVwIHRvIHByb2Nlc3MgUGF5IHdpdGggR29vZ2xlLlxuICogQHBhcmFtIHtjYWxsYmFja30gW2NhbGxiYWNrXSBUaGUgc2Vjb25kIGFyZ3VtZW50LCBgZGF0YWAsIGlzIHRoZSB7QGxpbmsgUGF5bWVudFJlcXVlc3RDb21wb25lbnR9IGluc3RhbmNlLiBJZiBubyBjYWxsYmFjayBpcyBwcm92aWRlZCwgYGNyZWF0ZWAgcmV0dXJucyBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB3aXRoIHRoZSB7QGxpbmsgUGF5bWVudFJlcXVlc3RDb21wb25lbnR9IGluc3RhbmNlLlxuICogQHJldHVybnMge1Byb21pc2V8dm9pZH0gUmV0dXJucyBhIHByb21pc2UgaWYgbm8gY2FsbGJhY2sgaXMgcHJvdmlkZWQuXG4gKiBAZXhhbXBsZVxuICogaWYgKHdpbmRvdy5QYXltZW50UmVxdWVzdCkge1xuICogICBzZWFtbGVzc3BheS5kaWdpdGFsV2FsbGV0cy5jcmVhdGUoe1xuICogICAgIGNsaWVudDogY2xpZW50SW5zdGFuY2VcbiAqICAgfSwgY2IpO1xuICogfSBlbHNlIHtcbiAqICAgLy8gZmFsbCBiYWNrIHRvIEhvc3RlZCBGaWVsZHMgaWYgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IERpZ2l0YWwgV2FsbGV0cyBBUElcbiAqICAgc2VhbWxlc3NwYXkuaG9zdGVkRmllbGRzLmNyZWF0ZShob3N0ZWRGaWVsZHNPcHRpb25zLCBjYik7XG4gKiB9XG4gKiBAZXhhbXBsZSA8Y2FwdGlvbj5FeHBsaWNpdGx5IHR1cm5pbmcgb2ZmIGNyZWRpdCBjYXJkcyBmcm9tIERpZ2l0YWwgV2FsbGV0cyBBUEkgZGlhbG9nPC9jYXB0aW9uPlxuICogc2VhbWxlc3NwYXkuZGlnaXRhbFdhbGxldHMuY3JlYXRlKHtcbiAqICAgY2xpZW50OiBjbGllbnRJbnN0YW5jZSxcbiAqICAgZW5hYmxlZFBheW1lbnRNZXRob2RzOiB7XG4gKiAgICAgcGF5V2l0aEdvb2dsZTogdHJ1ZSxcbiAqICAgfVxuICogfSwgY2IpO1xuICovXG5cbmZ1bmN0aW9uIGNyZWF0ZShvcHRpb25zKSB7XG4gIHJldHVybiBiYXNpY0NvbXBvbmVudFZlcmlmaWNhdGlvbi52ZXJpZnkoe1xuICAgIG5hbWU6ICdEaWdpdGFsIFdhbGxldHMnLFxuICAgIGNsaWVudDogb3B0aW9ucy5jbGllbnRcbiAgfSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHBheW1lbnRSZXF1ZXN0SW5zdGFuY2UgPSBuZXcgUGF5bWVudFJlcXVlc3RDb21wb25lbnQob3B0aW9ucyk7XG4gICAgcmV0dXJuIHBheW1lbnRSZXF1ZXN0SW5zdGFuY2UuaW5pdGlhbGl6ZSgpO1xuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNyZWF0ZTogd3JhcFByb21pc2UoY3JlYXRlKSxcbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBUaGUgY3VycmVudCB2ZXJzaW9uIG9mIHRoZSBTREssIGkuZS4gYHtAcGtnIHZlcnNpb259YC5cbiAgICogQHR5cGUge3N0cmluZ31cbiAgICovXG4gIFZFUlNJT046IFZFUlNJT05cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBTZWFtbGVzc3BheUVycm9yID0gcmVxdWlyZSgnLi4vLi4vbGliL3NlYW1sZXNzcGF5LWVycm9yJyk7XG52YXIgZW51bWVyYXRlID0gcmVxdWlyZSgnLi4vLi4vbGliL2VudW1lcmF0ZScpO1xuXG52YXIgcGF5bWVudFR5cGVzID0ge1xuICBQQVlNRU5UX1RZUEVfQ1JFRElUOiAnY3JlZGl0X2NhcmQnLFxuICBQQVlNRU5UX1RZUEVfQUNIOiAnYWNoJ1xufTtcblxudmFyIEFQUExFX1BBWV9QQVlNRU5UX1RZUEVTID0ge1xuXHRjcmVkaXQ6IHBheW1lbnRUeXBlcy5QQVlNRU5UX1RZUEVfQ1JFRElUXG59O1xuXG52YXIgUFJfSEFORExFUl9TSElQUElOR19BRERSRVNTX0NIQU5HRSA9ICdzaGlwcGluZ2FkZHJlc3NjaGFuZ2UnO1xudmFyIFBSX0hBTkRMRVJfU0hJUFBJTkdfT1BUSU9OX0NIQU5HRSA9ICdzaGlwcGluZ29wdGlvbmNoYW5nZSc7XG52YXIgUFJfSEFORExFUl9NRVJDSEFOVF9WQUxJREFUSU9OID0gJ21lcmNoYW50dmFsaWRhdGlvbic7XG52YXIgUFJfSEFORExFUl9QQVlNRU5UX01FVEhPRCA9ICdwYXltZW50bWV0aG9kJztcbnZhciBQUl9IQU5ETEVSX0NBTkNFTCA9ICdjYW5jZWwnO1xuXG52YXIgUEFZTUVOVF9SRVFVRVNUX01FVEhPRF9CQVNJQyA9ICdiYXNpYy1jYXJkJztcbnZhclx0UEFZTUVOVF9SRVFVRVNUX01FVEhPRF9BUFBMRV9QQVkgPSAnaHR0cHM6Ly9hcHBsZS5jb20vYXBwbGUtcGF5JztcbnZhclx0UEFZTUVOVF9SRVFVRVNUX01FVEhPRF9HT09HTEVfUEFZID0gJ2h0dHBzOi8vZ29vZ2xlLmNvbS9wYXknO1xuXG52YXIgUEFZTUVOVF9SRVFVRVNUX01FVEhPRF9UWVBFX0FQUExFX1BBWSA9ICdBUFBMRV9QQVknO1xuXG52YXIgUEFZTUVOVF9SRVFVRVNUX01FVEhPRF9UWVBFUyA9IHt9O1xuUEFZTUVOVF9SRVFVRVNUX01FVEhPRF9UWVBFU1tQQVlNRU5UX1JFUVVFU1RfTUVUSE9EX0FQUExFX1BBWV0gPSBQQVlNRU5UX1JFUVVFU1RfTUVUSE9EX1RZUEVfQVBQTEVfUEFZO1xuXG52YXIgUFJfSEFORExFUlMgPSBbXG5cdFBSX0hBTkRMRVJfU0hJUFBJTkdfQUREUkVTU19DSEFOR0UsXG5cdFBSX0hBTkRMRVJfU0hJUFBJTkdfT1BUSU9OX0NIQU5HRSxcblx0UFJfSEFORExFUl9NRVJDSEFOVF9WQUxJREFUSU9OLFxuICBQUl9IQU5ETEVSX1BBWU1FTlRfTUVUSE9ELFxuICBQUl9IQU5ETEVSX0NBTkNFTFxuXTtcblxudmFyIGNvbnN0YW50cyA9IHtcbiAgcGF5bWVudFR5cGVzOiBwYXltZW50VHlwZXMsXG5cdEFQUExFX1BBWV9BUElfVkVSU0lPTjogOCxcblx0R09PR0xFX1BBWV9BUElfVkVSU0lPTjogMixcblx0R09PR0xFX1BBWV9BUElfTUlOT1JfVkVSU0lPTjogMCxcbiAgR09PR0xFX1BBWV9HQVRFV0FZOiAnc2VhbWxlc3NwYXknLFxuICBHT09HTEVfUEFZX0dBVEVXQVlfTUVSQ0hBTlRfSUQ6ICdnb29nbGV0ZXN0Jyxcblx0U1VQUE9SVEVEX05FVFdPUktTX0FQUExFX1BBWTogWydhbWV4JywgJ2NoaW5hVW5pb25QYXknLCAnZGlzY292ZXInLCAnbWFlc3RybycsICdtYXN0ZXJDYXJkJywgJ3Zpc2EnXSxcblx0U1VQUE9SVEVEX05FVFdPUktTX0dPT0dMRV9QQVk6IFsnQU1FWCcsICdESVNDT1ZFUicsICdKQ0InLCAnTUFTVEVSQ0FSRCcsICdWSVNBJ10sXG5cdE1FUkNIQU5UX0NBUEFCSUxJVElFU19BUFBMRV9QQVk6IFsnc3VwcG9ydHMzRFMnLCAnc3VwcG9ydHNDcmVkaXQnLCAnc3VwcG9ydHNEZWJpdCddLFxuXHQvLyBNRVJDSEFOVF9DQVBBQklMSVRJRVNfR09PR0xFX1BBWTogWydDUllQVE9HUkFNXzNEUyddLFxuXHRNRVJDSEFOVF9DQVBBQklMSVRJRVNfR09PR0xFX1BBWTogWydQQU5fT05MWScsICdDUllQVE9HUkFNXzNEUyddLFxuXHRTRUFNTEVTU1BBWV9QQVlfV0lUSF9BUFBMRV9NRVJDSEFOVF9JRDogJ21lcmNoYW50LmNvbS5zZWFtbGVzc3BheS53YWxsZXQnLFxuXHRTRUFNTEVTU1BBWV9QQVlfV0lUSF9HT09HTEVfTUVSQ0hBTlRfSUQ6ICdzZWFtbGVzc3BheScsXG5cdERFRkFVTFRfQ09VTlRSWV9DT0RFOiAnVVMnLFxuXHRQQVlNRU5UX1JFUVVFU1RfTUVUSE9EX0JBU0lDOiBQQVlNRU5UX1JFUVVFU1RfTUVUSE9EX0JBU0lDLFxuXHRQQVlNRU5UX1JFUVVFU1RfTUVUSE9EX0FQUExFX1BBWTogUEFZTUVOVF9SRVFVRVNUX01FVEhPRF9BUFBMRV9QQVksXG4gIFBBWU1FTlRfUkVRVUVTVF9NRVRIT0RfR09PR0xFX1BBWTogUEFZTUVOVF9SRVFVRVNUX01FVEhPRF9HT09HTEVfUEFZLFxuXHRQUl9IQU5ETEVSX1NISVBQSU5HX0FERFJFU1NfQ0hBTkdFOiBQUl9IQU5ETEVSX1NISVBQSU5HX0FERFJFU1NfQ0hBTkdFLFxuXHRQUl9IQU5ETEVSX1NISVBQSU5HX09QVElPTl9DSEFOR0U6IFBSX0hBTkRMRVJfU0hJUFBJTkdfT1BUSU9OX0NIQU5HRSxcblx0UFJfSEFORExFUl9NRVJDSEFOVF9WQUxJREFUSU9OOiBQUl9IQU5ETEVSX01FUkNIQU5UX1ZBTElEQVRJT04sXG4gIFBSX0hBTkRMRVJfUEFZTUVOVF9NRVRIT0Q6IFBSX0hBTkRMRVJfUEFZTUVOVF9NRVRIT0QsXG4gIFBSX0hBTkRMRVJfQ0FOQ0VMOiBQUl9IQU5ETEVSX0NBTkNFTCxcblx0UFJfSEFORExFUlM6IFBSX0hBTkRMRVJTLFxuXHRBUFBMRV9QQVlfUEFZTUVOVF9UWVBFUzogQVBQTEVfUEFZX1BBWU1FTlRfVFlQRVMsXG5cdFBBWU1FTlRfUkVRVUVTVF9TVVBQT1JURURfTUVUSE9EUzogW1xuXHRcdFBBWU1FTlRfUkVRVUVTVF9NRVRIT0RfQkFTSUMsXG5cdFx0UEFZTUVOVF9SRVFVRVNUX01FVEhPRF9BUFBMRV9QQVksXG4gICAgUEFZTUVOVF9SRVFVRVNUX01FVEhPRF9HT09HTEVfUEFZXG5cdF0sXG5cdFBBWU1FTlRfUkVRVUVTVF9NRVRIT0RfVFlQRVM6IFBBWU1FTlRfUkVRVUVTVF9NRVRIT0RfVFlQRVMsXG5cdFBBWU1FTlRfUkVRVUVTVF9NRVRIT0RfVFlQRV9BUFBMRV9QQVk6IFBBWU1FTlRfUkVRVUVTVF9NRVRIT0RfVFlQRV9BUFBMRV9QQVlcbn07XG5cbmNvbnN0YW50cy5ldmVudHMgPSBlbnVtZXJhdGUoW1xuICAnRlJBTUVfUkVBRFknLFxuICAnRlJBTUVfQ0FOX01BS0VfUkVRVUVTVFMnLFxuICAnUEFZTUVOVF9SRVFVRVNUX0lOSVRJQUxJWkVEJyxcbiAgJ1BBWU1FTlRfUkVRVUVTVF9SRUFEWScsXG4gICdQQVlNRU5UX1JFUVVFU1RfRkFJTEVEJyxcbiAgJ1BBWU1FTlRfUkVRVUVTVF9TVUNDRVNTRlVMJyxcbiAgJ1BBWU1FTlRfUkVRVUVTVF9TSElQUElOR19BRERSRVNTX0NIQU5HRScsXG4gICdQQVlNRU5UX1JFUVVFU1RfQ1JFQVRFX0hBTkRMRVInLFxuXHQnSU5QVVRfRVZFTlQnLFxuICAnUEFZTUVOVF9SRVFVRVNUX0lOVk9LRUQnLFxuICAnUEFZTUVOVF9SRVFVRVNUX0lOVk9LRURfU1VDQ0VTU0ZVTCcsXG4gICdQQVlNRU5UX1JFUVVFU1RfSU5WT0tFRF9GQUlMRUQnLFxuXSwgJ3BheW1lbnQtcmVxdWVzdDonKTtcblxuY29uc3RhbnRzLmVycm9ycyA9IHtcbiAgUEFZTUVOVF9SRVFVRVNUX05PX1ZBTElEX1NVUFBPUlRFRF9QQVlNRU5UX01FVEhPRFM6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLk1FUkNIQU5ULFxuICAgIGNvZGU6ICdQQVlNRU5UX1JFUVVFU1RfTk9fVkFMSURfU1VQUE9SVEVEX1BBWU1FTlRfTUVUSE9EUycsXG4gICAgbWVzc2FnZTogJ1RoZXJlIGFyZSBubyBzdXBwb3J0ZWQgcGF5bWVudCBtZXRob2RzIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGFjY291bnQuJ1xuICB9LFxuICBQQVlNRU5UX1JFUVVFU1RfQ0FOQ0VMRUQ6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLkNVU1RPTUVSLFxuICAgIGNvZGU6ICdQQVlNRU5UX1JFUVVFU1RfQ0FOQ0VMRUQnLFxuICAgIG1lc3NhZ2U6ICdQYXltZW50IHJlcXVlc3Qgd2FzIGNhbmNlbGVkLidcbiAgfSxcbiAgUEFZTUVOVF9SRVFVRVNUX0lOSVRJQUxJWkFUSU9OX01JU0NPTkZJR1VSRUQ6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLk1FUkNIQU5ULFxuICAgIGNvZGU6ICdQQVlNRU5UX1JFUVVFU1RfSU5JVElBTElaQVRJT05fTUlTQ09ORklHVVJFRCcsXG4gICAgbWVzc2FnZTogJ1NvbWV0aGluZyB3ZW50IHdyb25nIHdoZW4gY29uZmlndXJpbmcgdGhlIHBheW1lbnQgcmVxdWVzdC4nXG4gIH0sXG4gIFBBWU1FTlRfUkVRVUVTVF9QQVlfV0lUSF9HT09HTEVfRkFJTEVEX1RPX1RPS0VOSVpFOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnUEFZTUVOVF9SRVFVRVNUX1BBWV9XSVRIX0dPT0dMRV9GQUlMRURfVE9fVE9LRU5JWkUnLFxuICAgIG1lc3NhZ2U6ICdTb21ldGhpbmcgd2VudCB3cm9uZyB3aGVuIHRva2VuaXppbmcgdGhlIFBheSB3aXRoIEdvb2dsZSBjYXJkLidcbiAgfSxcbiAgUEFZTUVOVF9SRVFVRVNUX1BBWV9XSVRIX0dPT0dMRV9QQVJTSU5HX0VSUk9SOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5VTktOT1dOLFxuICAgIGNvZGU6ICdQQVlNRU5UX1JFUVVFU1RfUEFZX1dJVEhfR09PR0xFX1BBUlNJTkdfRVJST1InLFxuICAgIG1lc3NhZ2U6ICdTb21ldGhpbmcgd2VudCB3cm9uZyB3aGVuIHRva2VuaXppbmcgdGhlIFBheSB3aXRoIEdvb2dsZSBjYXJkLidcbiAgfSxcbiAgUEFZTUVOVF9SRVFVRVNUX05PVF9DT01QTEVURUQ6IHtcbiAgICBjb2RlOiAnUEFZTUVOVF9SRVFVRVNUX05PVF9DT01QTEVURUQnLFxuICAgIG1lc3NhZ2U6ICdQYXltZW50IHJlcXVlc3QgY291bGQgbm90IGJlIGNvbXBsZXRlZC4nXG4gIH0sXG4gIFBBWU1FTlRfUkVRVUVTVF9DUkVBVEVfU1VQUE9SVEVEX1BBWU1FTlRfTUVUSE9EU19DT05GSUdVUkFUSU9OX01VU1RfSU5DTFVERV9UWVBFOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnUEFZTUVOVF9SRVFVRVNUX0NSRUFURV9TVVBQT1JURURfUEFZTUVOVF9NRVRIT0RTX0NPTkZJR1VSQVRJT05fTVVTVF9JTkNMVURFX1RZUEUnLFxuICAgIG1lc3NhZ2U6ICdjcmVhdGVTdXBwb3J0ZWRQYXltZW50TWV0aG9kc0NvbmZpZ3VyYXRpb24gbXVzdCBpbmNsdWRlIGEgdHlwZSBwYXJhbWV0ZXIuJ1xuICB9LFxuICBQQVlNRU5UX1JFUVVFU1RfQ1JFQVRFX1NVUFBPUlRFRF9QQVlNRU5UX01FVEhPRFNfQ09ORklHVVJBVElPTl9UWVBFX05PVF9FTkFCTEVEOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnUEFZTUVOVF9SRVFVRVNUX0NSRUFURV9TVVBQT1JURURfUEFZTUVOVF9NRVRIT0RTX0NPTkZJR1VSQVRJT05fVFlQRV9OT1RfRU5BQkxFRCcsXG4gICAgbWVzc2FnZTogJ2NyZWF0ZVN1cHBvcnRlZFBheW1lbnRNZXRob2RzQ29uZmlndXJhdGlvbiB0eXBlIHBhcmFtZXRlciBtdXN0IGJlIHZhbGlkIG9yIGVuYWJsZWQuJ1xuICB9LFxuICBQQVlNRU5UX1JFUVVFU1RfSU5WQUxJRF9QQVlNRU5UX0JVVFRPTl9DT05UQUlORVJfU0VMRUNUT1I6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLkNVU1RPTUVSLFxuICAgIGNvZGU6ICdQQVlNRU5UX1JFUVVFU1RfSU5WQUxJRF9QQVlNRU5UX0JVVFRPTl9DT05UQUlORVJfU0VMRUNUT1InLFxuICAgIG1lc3NhZ2U6ICdJbnZhbGlkIHBheW1lbnQgYnV0dG9uIGNvbnRhaW5lciBzZWxlY3Rvci4nXG4gIH0sXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbnN0YW50cztcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFNlYW1sZXNzcGF5RXJyb3IgPSByZXF1aXJlKCcuLi8uLi9saWIvc2VhbWxlc3NwYXktZXJyb3InKTtcbnZhciBlcnJvcnMgPSByZXF1aXJlKCcuLi9zaGFyZWQvZXJyb3JzJyk7XG52YXIgd2hpdGVsaXN0ID0gcmVxdWlyZSgnLi4vc2hhcmVkL2NvbnN0YW50cycpLndoaXRlbGlzdGVkQXR0cmlidXRlcztcblxuZnVuY3Rpb24gYXR0cmlidXRlVmFsaWRhdGlvbkVycm9yKGF0dHJpYnV0ZSwgdmFsdWUpIHtcbiAgdmFyIGVycjtcblxuICBpZiAoIXdoaXRlbGlzdC5oYXNPd25Qcm9wZXJ0eShhdHRyaWJ1dGUpKSB7XG4gICAgZXJyID0gbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgdHlwZTogZXJyb3JzLkhPU1RFRF9GSUVMRFNfQVRUUklCVVRFX05PVF9TVVBQT1JURUQudHlwZSxcbiAgICAgIGNvZGU6IGVycm9ycy5IT1NURURfRklFTERTX0FUVFJJQlVURV9OT1RfU1VQUE9SVEVELmNvZGUsXG4gICAgICBtZXNzYWdlOiAnVGhlIFwiJyArIGF0dHJpYnV0ZSArICdcIiBhdHRyaWJ1dGUgaXMgbm90IHN1cHBvcnRlZCBpbiBIb3N0ZWQgRmllbGRzLidcbiAgICB9KTtcbiAgfSBlbHNlIGlmICh2YWx1ZSAhPSBudWxsICYmICFfaXNWYWxpZChhdHRyaWJ1dGUsIHZhbHVlKSkge1xuICAgIGVyciA9IG5ldyBTZWFtbGVzc3BheUVycm9yKHtcbiAgICAgIHR5cGU6IGVycm9ycy5IT1NURURfRklFTERTX0FUVFJJQlVURV9WQUxVRV9OT1RfQUxMT1dFRC50eXBlLFxuICAgICAgY29kZTogZXJyb3JzLkhPU1RFRF9GSUVMRFNfQVRUUklCVVRFX1ZBTFVFX05PVF9BTExPV0VELmNvZGUsXG4gICAgICBtZXNzYWdlOiAnVmFsdWUgXCInICsgdmFsdWUgKyAnXCIgaXMgbm90IGFsbG93ZWQgZm9yIFwiJyArIGF0dHJpYnV0ZSArICdcIiBhdHRyaWJ1dGUuJ1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIGVycjtcbn1cblxuZnVuY3Rpb24gX2lzVmFsaWQoYXR0cmlidXRlLCB2YWx1ZSkge1xuICBpZiAod2hpdGVsaXN0W2F0dHJpYnV0ZV0gPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJztcbiAgfSBlbHNlIGlmICh3aGl0ZWxpc3RbYXR0cmlidXRlXSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgcmV0dXJuIFN0cmluZyh2YWx1ZSkgPT09ICd0cnVlJyB8fCBTdHJpbmcodmFsdWUpID09PSAnZmFsc2UnO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGF0dHJpYnV0ZVZhbGlkYXRpb25FcnJvcjtcbiIsInZhciBTZWFtbGVzc3BheUVycm9yID0gcmVxdWlyZSgnLi4vLi4vbGliL3NlYW1sZXNzcGF5LWVycm9yJyk7XG52YXIgc2hhcmVkRXJyb3JzID0gcmVxdWlyZSgnLi4vLi4vbGliL2Vycm9ycycpO1xudmFyIHJlcXVlc3RUeXBlcyA9IHJlcXVpcmUoJy4uL3NoYXJlZC9jb25zdGFudHMnKS5yZXF1ZXN0VHlwZXM7XG52YXIgcmVsYXRpb25zID0gcmVxdWlyZSgnLi4vc2hhcmVkL3BheW1lbnQtZmllbGRzLXJlbGF0aW9ucycpO1xuXG52YXIgVE9LRU5JWkFUSU9OID0gcmVxdWVzdFR5cGVzLlJFUVVFU1RfVFlQRV9UT0tFTklaQVRJT047XG5cbnZhciB0eXBlRmllbGRSZWxhdGlvbnMgPSByZWxhdGlvbnNbVE9LRU5JWkFUSU9OXTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodHlwZSwgZmllbGRzKSB7XG4gIHZhciBpc1JlcXVpcmVkRXhjZXNzID0gdHJ1ZTtcbiAgdmFyIGlzUmVxdWlyZWRWYWxpZCA9IGZhbHNlO1xuICB2YXIgcmVxdWlyZWRTZXRzID0ge307XG4gIHZhciB2YWxpZFNldHNDb3VudCA9IHt9O1xuICB2YXIgaXNDb21wbGV0ZSA9IGZpZWxkcy5ldmVyeShmdW5jdGlvbiAoZmllbGQpIHtcbiAgICByZXR1cm4gISF+dHlwZUZpZWxkUmVsYXRpb25zW3R5cGVdLmZpZWxkcy5pbmRleE9mKGZpZWxkKTtcbiAgfSk7XG5cbiAgaWYgKCFpc0NvbXBsZXRlKSB7XG4gICAgdGhyb3cgbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgdHlwZTogc2hhcmVkRXJyb3JzLklOQ09NUEFUSUJMRV9GSUVMRFNfU0VULnR5cGUsXG4gICAgICBjb2RlOiBzaGFyZWRFcnJvcnMuSU5DT01QQVRJQkxFX0ZJRUxEU19TRVQuY29kZSxcbiAgICAgIG1lc3NhZ2U6ICdGaWVsZHMgaW50ZWdyaXR5IGlzIGJyb2tlbiBmb3IgcGF5bWVudCB0eXBlIFwiJ1xuICAgICAgKyB0eXBlICsgJ1wiISBZb3UgY2FuIHVzZSBvbmx5IG5leHQgZmllbGRzOiAnXG4gICAgICArIHR5cGVGaWVsZFJlbGF0aW9uc1t0eXBlXS5maWVsZHMuam9pbignLCAnKVxuICAgIH0pO1xuICB9XG5cbiAgdHlwZUZpZWxkUmVsYXRpb25zW3R5cGVdLm9uZU9mLmZvckVhY2goZnVuY3Rpb24gKHJ1bGUpIHtcbiAgICB2YXIgc2V0S2V5ID0gcnVsZS5yZXF1aXJlZC5zb3J0KCkuam9pbignLCAnKTtcbiAgICByZXF1aXJlZFNldHNbc2V0S2V5XSA9IHJ1bGUucmVxdWlyZWQubGVuZ3RoO1xuICAgIHZhciB2YWxpZENvdW50ID0gcnVsZS5yZXF1aXJlZC5yZWR1Y2UoZnVuY3Rpb24ocmVzdWx0LCByZXF1aXJlZEZpZWxkKSB7XG4gICAgICByZXR1cm4gfmZpZWxkcy5pbmRleE9mKHJlcXVpcmVkRmllbGQpID8gcmVzdWx0ICsgMSA6IHJlc3VsdDtcbiAgICB9LCAwKTtcbiAgICB2YWxpZFNldHNDb3VudFtzZXRLZXldID0gdmFsaWRDb3VudDtcbiAgfSk7XG5cbiAgaXNSZXF1aXJlZFZhbGlkID0gT2JqZWN0LmtleXModmFsaWRTZXRzQ291bnQpLmZpbHRlcihmdW5jdGlvbiAoc2V0S2V5KSB7XG4gICAgcmV0dXJuIHZhbGlkU2V0c0NvdW50W3NldEtleV0gPT09IHJlcXVpcmVkU2V0c1tzZXRLZXldO1xuICB9KS5sZW5ndGggPT09IDE7XG5cbiAgaXNSZXF1aXJlZEV4Y2VzcyA9IE9iamVjdC5rZXlzKHZhbGlkU2V0c0NvdW50KS5maWx0ZXIoZnVuY3Rpb24gKHNldEtleSkge1xuICAgIHJldHVybiB2YWxpZFNldHNDb3VudFtzZXRLZXldID4gMDtcbiAgfSkubGVuZ3RoID4gMTtcblxuICBpZiAoIWlzUmVxdWlyZWRWYWxpZCB8fCBpc1JlcXVpcmVkRXhjZXNzKSB7XG4gICAgdGhyb3cgbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgdHlwZTogc2hhcmVkRXJyb3JzLklOQ09NUEFUSUJMRV9GSUVMRFNfU0VULnR5cGUsXG4gICAgICBjb2RlOiBzaGFyZWRFcnJvcnMuSU5DT01QQVRJQkxFX0ZJRUxEU19TRVQuY29kZSxcbiAgICAgIG1lc3NhZ2U6ICdJbmNvbXBhdGlibGUgcmVxdWlyZWQgZmllbGRzIHNldCEgcGF5bWVudCB0eXBlICdcbiAgICAgICsgdHlwZSArICcgaXMgcmVxdWlyaW5nJ1xuICAgICAgKyAoT2JqZWN0LmtleXMocmVxdWlyZWRTZXRzKS5sZW5ndGggPiAxID8gJyBvbmUgb2YgJyA6ICcgJykgKyAnZmllbGQgc2V0OiAnXG4gICAgICArIE9iamVjdC5rZXlzKHJlcXVpcmVkU2V0cykuam9pbignIG9yICcpXG4gICAgfSk7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBEZXN0cnVjdG9yID0gcmVxdWlyZSgnLi4vLi4vbGliL2Rlc3RydWN0b3InKTtcbnZhciBjbGFzc2xpc3QgPSByZXF1aXJlKCcuLi8uLi9saWIvY2xhc3NsaXN0Jyk7XG52YXIgaUZyYW1lciA9IHJlcXVpcmUoJ0BicmFpbnRyZWUvaWZyYW1lcicpO1xudmFyIEJ1cyA9IHJlcXVpcmUoJy4uLy4uL2xpYi9idXMnKTtcbnZhciBTZWFtbGVzc3BheUVycm9yID0gcmVxdWlyZSgnLi4vLi4vbGliL3NlYW1sZXNzcGF5LWVycm9yJyk7XG52YXIgY29tcG9zZVVybCA9IHJlcXVpcmUoJy4uLy4uL2xpYi9jb21wb3NlLXVybCcpO1xudmFyIGNvbnN0YW50cyA9IHJlcXVpcmUoJy4uL3NoYXJlZC9jb25zdGFudHMnKTtcbnZhciBlcnJvcnMgPSByZXF1aXJlKCcuLi9zaGFyZWQvZXJyb3JzJyk7XG52YXIgdXVpZCA9IHJlcXVpcmUoJy4uLy4uL2xpYi91dWlkJyk7XG52YXIgZmluZFBhcmVudFRhZ3MgPSByZXF1aXJlKCcuLi9zaGFyZWQvZmluZC1wYXJlbnQtdGFncycpO1xudmFyIGdldFdoaXRlbGlzdGVkRmllbGRzID0gcmVxdWlyZSgnLi4vc2hhcmVkL2NvbW1vbicpLmdldFdoaXRlbGlzdGVkRmllbGRzO1xudmFyIGlzSW9zID0gcmVxdWlyZSgnLi4vLi4vbGliL2lzLWlvcycpO1xudmFyIGV2ZW50cyA9IGNvbnN0YW50cy5ldmVudHM7XG52YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnLi4vLi4vbGliL2V2ZW50LWVtaXR0ZXInKTtcbnZhciBpbmplY3RGcmFtZSA9IHJlcXVpcmUoJy4uLy4uL2xpYi9pbmplY3QtZnJhbWUnKTtcbnZhciBWRVJTSU9OID0gXCJ3ZWItc2RrXCI7XG52YXIgbWV0aG9kcyA9IHJlcXVpcmUoJy4uLy4uL2xpYi9tZXRob2RzJyk7XG52YXIgY29udmVydE1ldGhvZHNUb0Vycm9yID0gcmVxdWlyZSgnLi4vLi4vbGliL2NvbnZlcnQtbWV0aG9kcy10by1lcnJvcicpO1xudmFyIGRlZmVycmVkID0gcmVxdWlyZSgnLi4vLi4vbGliL2RlZmVycmVkJyk7XG52YXIgc2hhcmVkRXJyb3JzID0gcmVxdWlyZSgnLi4vLi4vbGliL2Vycm9ycycpO1xudmFyIGdldENhcmRUeXBlcyA9IHJlcXVpcmUoJ2NyZWRpdC1jYXJkLXR5cGUnKTtcbnZhciBhdHRyaWJ1dGVWYWxpZGF0aW9uRXJyb3IgPSByZXF1aXJlKCcuL2F0dHJpYnV0ZS12YWxpZGF0aW9uLWVycm9yJyk7XG52YXIgUHJvbWlzZSA9IHJlcXVpcmUoJy4uLy4uL2xpYi9wcm9taXNlJyk7XG52YXIgd3JhcFByb21pc2UgPSByZXF1aXJlKCdAYnJhaW50cmVlL3dyYXAtcHJvbWlzZScpO1xudmFyIGNoZWNrSW50ZWdyaXR5ID0gcmVxdWlyZSgnLi9jaGVjay1pbnRlZ3JpdHknKTtcbnZhciB7IGZvcm1hdFRva2VuaXplUmVzcG9uc2UgfSA9IHJlcXVpcmUoJy4vcmVzcG9uc2UtZm9ybWF0dGVycycpXG5cbi8qKlxuICogQHR5cGVkZWYge29iamVjdH0gSG9zdGVkRmllbGRzfnRva2VuaXplUGF5bG9hZFxuICogQHByb3BlcnR5IHtzdHJpbmd9IG5vbmNlIFRoZSBwYXltZW50IG1ldGhvZCBub25jZS5cbiAqIEBwcm9wZXJ0eSB7b2JqZWN0fSBkZXRhaWxzIEFkZGl0aW9uYWwgYWNjb3VudCBkZXRhaWxzLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IGRldGFpbHMuY2FyZFR5cGUgVHlwZSBvZiBjYXJkLCBleDogVmlzYSwgTWFzdGVyQ2FyZC5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBkZXRhaWxzLmxhc3RUd28gTGFzdCB0d28gZGlnaXRzIG9mIGNhcmQgbnVtYmVyLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IGRlc2NyaXB0aW9uIEEgaHVtYW4tcmVhZGFibGUgZGVzY3JpcHRpb24uXG4gKiBAcHJvcGVydHkge3N0cmluZ30gdHlwZSBUaGUgcGF5bWVudCBtZXRob2QgdHlwZSwgYWx3YXlzIGBDcmVkaXRDYXJkYC5cbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtvYmplY3R9IEhvc3RlZEZpZWxkc35zdGF0ZU9iamVjdFxuICogQGRlc2NyaXB0aW9uIFRoZSBldmVudCBwYXlsb2FkIHNlbnQgZnJvbSB7QGxpbmsgSG9zdGVkRmllbGRzI29ufG9ufSBvciB7QGxpbmsgSG9zdGVkRmllbGRzI2dldFN0YXRlfGdldFN0YXRlfS5cbiAqIEBwcm9wZXJ0eSB7SG9zdGVkRmllbGRzfmhvc3RlZEZpZWxkc0NhcmRbXX0gY2FyZHNcbiAqIFRoaXMgd2lsbCByZXR1cm4gYW4gYXJyYXkgb2YgcG90ZW50aWFsIHtAbGluayBIb3N0ZWRGaWVsZHN+aG9zdGVkRmllbGRzQ2FyZHxjYXJkc30uIElmIHRoZSBjYXJkIHR5cGUgaGFzIGJlZW4gZGV0ZXJtaW5lZCwgdGhlIGFycmF5IHdpbGwgY29udGFpbiBvbmx5IG9uZSBjYXJkLlxuICogSW50ZXJuYWxseSwgSG9zdGVkIEZpZWxkcyB1c2VzIDxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vc2VhbWxlc3NwYXkvY3JlZGl0LWNhcmQtdHlwZVwiPmNyZWRpdC1jYXJkLXR5cGU8L2E+LFxuICogYW4gb3Blbi1zb3VyY2UgY2FyZCBkZXRlY3Rpb24gbGlicmFyeS5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBlbWl0dGVkQnlcbiAqIFRoZSBuYW1lIG9mIHRoZSBmaWVsZCBhc3NvY2lhdGVkIHdpdGggYW4gZXZlbnQuIFRoaXMgd2lsbCBub3QgYmUgaW5jbHVkZWQgaWYgcmV0dXJuZWQgYnkge0BsaW5rIEhvc3RlZEZpZWxkcyNnZXRTdGF0ZXxnZXRTdGF0ZX0uIEl0IHdpbGwgYmUgb25lIG9mIHRoZSBmb2xsb3dpbmcgc3RyaW5nczo8YnI+XG4gKiAtIGBcIm51bWJlclwiYFxuICogLSBgXCJjdnZcImBcbiAqIC0gYFwiZXhwRGF0ZVwiYFxuICogLSBgXCJleHBpcmF0aW9uTW9udGhcImBcbiAqIC0gYFwiZXhwaXJhdGlvblllYXJcImBcbiAqIC0gYFwicG9zdGFsQ29kZVwiYFxuICogQHByb3BlcnR5IHtvYmplY3R9IGZpZWxkc1xuICogQHByb3BlcnR5IHs/SG9zdGVkRmllbGRzfmhvc3RlZEZpZWxkc0ZpZWxkRGF0YX0gZmllbGRzLm51bWJlciB7QGxpbmsgSG9zdGVkRmllbGRzfmhvc3RlZEZpZWxkc0ZpZWxkRGF0YXxob3N0ZWRGaWVsZHNGaWVsZERhdGF9IGZvciB0aGUgbnVtYmVyIGZpZWxkLCBpZiBpdCBpcyBwcmVzZW50LlxuICogQHByb3BlcnR5IHs/SG9zdGVkRmllbGRzfmhvc3RlZEZpZWxkc0ZpZWxkRGF0YX0gZmllbGRzLmN2diB7QGxpbmsgSG9zdGVkRmllbGRzfmhvc3RlZEZpZWxkc0ZpZWxkRGF0YXxob3N0ZWRGaWVsZHNGaWVsZERhdGF9IGZvciB0aGUgQ1ZWIGZpZWxkLCBpZiBpdCBpcyBwcmVzZW50LlxuICogQHByb3BlcnR5IHs/SG9zdGVkRmllbGRzfmhvc3RlZEZpZWxkc0ZpZWxkRGF0YX0gZmllbGRzLmV4cERhdGUge0BsaW5rIEhvc3RlZEZpZWxkc35ob3N0ZWRGaWVsZHNGaWVsZERhdGF8aG9zdGVkRmllbGRzRmllbGREYXRhfSBmb3IgdGhlIGV4cGlyYXRpb24gZGF0ZSBmaWVsZCwgaWYgaXQgaXMgcHJlc2VudC5cbiAqIEBwcm9wZXJ0eSB7P0hvc3RlZEZpZWxkc35ob3N0ZWRGaWVsZHNGaWVsZERhdGF9IGZpZWxkcy5leHBpcmF0aW9uTW9udGgge0BsaW5rIEhvc3RlZEZpZWxkc35ob3N0ZWRGaWVsZHNGaWVsZERhdGF8aG9zdGVkRmllbGRzRmllbGREYXRhfSBmb3IgdGhlIGV4cGlyYXRpb24gbW9udGggZmllbGQsIGlmIGl0IGlzIHByZXNlbnQuXG4gKiBAcHJvcGVydHkgez9Ib3N0ZWRGaWVsZHN+aG9zdGVkRmllbGRzRmllbGREYXRhfSBmaWVsZHMuZXhwaXJhdGlvblllYXIge0BsaW5rIEhvc3RlZEZpZWxkc35ob3N0ZWRGaWVsZHNGaWVsZERhdGF8aG9zdGVkRmllbGRzRmllbGREYXRhfSBmb3IgdGhlIGV4cGlyYXRpb24geWVhciBmaWVsZCwgaWYgaXQgaXMgcHJlc2VudC5cbiAqIEBwcm9wZXJ0eSB7P0hvc3RlZEZpZWxkc35ob3N0ZWRGaWVsZHNGaWVsZERhdGF9IGZpZWxkcy5wb3N0YWxDb2RlIHtAbGluayBIb3N0ZWRGaWVsZHN+aG9zdGVkRmllbGRzRmllbGREYXRhfGhvc3RlZEZpZWxkc0ZpZWxkRGF0YX0gZm9yIHRoZSBwb3N0YWwgY29kZSBmaWVsZCwgaWYgaXQgaXMgcHJlc2VudC5cbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtvYmplY3R9IEhvc3RlZEZpZWxkc35ob3N0ZWRGaWVsZHNGaWVsZERhdGFcbiAqIEBkZXNjcmlwdGlvbiBEYXRhIGFib3V0IEhvc3RlZCBGaWVsZHMgZmllbGRzLCBzZW50IGluIHtAbGluayBIb3N0ZWRGaWVsZHN+c3RhdGVPYmplY3R8c3RhdGVPYmplY3RzfS5cbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGNvbnRhaW5lciBSZWZlcmVuY2UgdG8gdGhlIGNvbnRhaW5lciBET00gZWxlbWVudCBvbiB5b3VyIHBhZ2UgYXNzb2NpYXRlZCB3aXRoIHRoZSBjdXJyZW50IGV2ZW50LlxuICogQHByb3BlcnR5IHtib29sZWFufSBpc0ZvY3VzZWQgV2hldGhlciBvciBub3QgdGhlIGlucHV0IGlzIGN1cnJlbnRseSBmb2N1c2VkLlxuICogQHByb3BlcnR5IHtib29sZWFufSBpc0VtcHR5IFdoZXRoZXIgb3Igbm90IHRoZSB1c2VyIGhhcyBlbnRlcmVkIGEgdmFsdWUgaW4gdGhlIGlucHV0LlxuICogQHByb3BlcnR5IHtib29sZWFufSBpc1BvdGVudGlhbGx5VmFsaWRcbiAqIEEgZGV0ZXJtaW5hdGlvbiBiYXNlZCBvbiB0aGUgZnV0dXJlIHZhbGlkaXR5IG9mIHRoZSBpbnB1dCB2YWx1ZS5cbiAqIFRoaXMgaXMgaGVscGZ1bCB3aGVuIGEgdXNlciBpcyBlbnRlcmluZyBhIGNhcmQgbnVtYmVyIGFuZCB0eXBlcyA8Y29kZT5cIjQxXCI8L2NvZGU+LlxuICogV2hpbGUgdGhhdCB2YWx1ZSBpcyBub3QgdmFsaWQgZm9yIHN1Ym1pc3Npb24sIGl0IGlzIHN0aWxsIHBvc3NpYmxlIGZvclxuICogaXQgdG8gYmVjb21lIGEgZnVsbHkgcXVhbGlmaWVkIGVudHJ5LiBIb3dldmVyLCBpZiB0aGUgdXNlciBlbnRlcnMgPGNvZGU+XCI0eFwiPC9jb2RlPlxuICogaXQgaXMgY2xlYXIgdGhhdCB0aGUgY2FyZCBudW1iZXIgY2FuIG5ldmVyIGJlY29tZSB2YWxpZCBhbmQgaXNQb3RlbnRpYWxseVZhbGlkIHdpbGxcbiAqIHJldHVybiBmYWxzZS5cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gaXNWYWxpZCBXaGV0aGVyIG9yIG5vdCB0aGUgdmFsdWUgb2YgdGhlIGFzc29jaWF0ZWQgaW5wdXQgaXMgPGk+ZnVsbHk8L2k+IHF1YWxpZmllZCBmb3Igc3VibWlzc2lvbi5cbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtvYmplY3R9IEhvc3RlZEZpZWxkc35ob3N0ZWRGaWVsZHNDYXJkXG4gKiBAZGVzY3JpcHRpb24gSW5mb3JtYXRpb24gYWJvdXQgdGhlIGNhcmQgdHlwZSwgc2VudCBpbiB7QGxpbmsgSG9zdGVkRmllbGRzfnN0YXRlT2JqZWN0fHN0YXRlT2JqZWN0c30uXG4gKiBAcHJvcGVydHkge3N0cmluZ30gdHlwZSBUaGUgY29kZS1mcmllbmRseSByZXByZXNlbnRhdGlvbiBvZiB0aGUgY2FyZCB0eXBlLiBJdCB3aWxsIGJlIG9uZSBvZiB0aGUgZm9sbG93aW5nIHN0cmluZ3M6XG4gKiAtIGBhbWVyaWNhbi1leHByZXNzYFxuICogLSBgZGluZXJzLWNsdWJgXG4gKiAtIGBkaXNjb3ZlcmBcbiAqIC0gYGpjYmBcbiAqIC0gYG1hZXN0cm9gXG4gKiAtIGBtYXN0ZXItY2FyZGBcbiAqIC0gYHVuaW9ucGF5YFxuICogLSBgdmlzYWBcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBuaWNlVHlwZSBUaGUgcHJldHR5LXByaW50ZWQgY2FyZCB0eXBlLiBJdCB3aWxsIGJlIG9uZSBvZiB0aGUgZm9sbG93aW5nIHN0cmluZ3M6XG4gKiAtIGBBbWVyaWNhbiBFeHByZXNzYFxuICogLSBgRGluZXJzIENsdWJgXG4gKiAtIGBEaXNjb3ZlcmBcbiAqIC0gYEpDQmBcbiAqIC0gYE1hZXN0cm9gXG4gKiAtIGBNYXN0ZXJDYXJkYFxuICogLSBgVW5pb25QYXlgXG4gKiAtIGBWaXNhYFxuICogQHByb3BlcnR5IHtvYmplY3R9IGNvZGVcbiAqIFRoaXMgb2JqZWN0IGNvbnRhaW5zIGRhdGEgcmVsZXZhbnQgdG8gdGhlIHNlY3VyaXR5IGNvZGUgcmVxdWlyZW1lbnRzIG9mIHRoZSBjYXJkIGJyYW5kLlxuICogRm9yIGV4YW1wbGUsIG9uIGEgVmlzYSBjYXJkIHRoZXJlIHdpbGwgYmUgYSA8Y29kZT5DVlY8L2NvZGU+IG9mIDMgZGlnaXRzLCB3aGVyZWFzIGFuXG4gKiBBbWVyaWNhbiBFeHByZXNzIGNhcmQgcmVxdWlyZXMgYSA0LWRpZ2l0IDxjb2RlPkNJRDwvY29kZT4uXG4gKiBAcHJvcGVydHkge3N0cmluZ30gY29kZS5uYW1lIDxjb2RlPlwiQ1ZWXCI8L2NvZGU+IDxjb2RlPlwiQ0lEXCI8L2NvZGU+IDxjb2RlPlwiQ1ZDXCI8L2NvZGU+XG4gKiBAcHJvcGVydHkge251bWJlcn0gY29kZS5zaXplIFRoZSBleHBlY3RlZCBsZW5ndGggb2YgdGhlIHNlY3VyaXR5IGNvZGUuIFR5cGljYWxseSwgdGhpcyBpcyAzIG9yIDQuXG4gKi9cblxuLyoqXG4gKiBAbmFtZSBIb3N0ZWRGaWVsZHMjb25cbiAqIEBmdW5jdGlvblxuICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50IFRoZSBuYW1lIG9mIHRoZSBldmVudCB0byB3aGljaCB5b3UgYXJlIHN1YnNjcmliaW5nLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gaGFuZGxlciBBIGNhbGxiYWNrIHRvIGhhbmRsZSB0aGUgZXZlbnQuXG4gKiBAZGVzY3JpcHRpb24gU3Vic2NyaWJlcyBhIGhhbmRsZXIgZnVuY3Rpb24gdG8gYSBuYW1lZCBldmVudC4gYGV2ZW50YCBzaG91bGQgYmUge0BsaW5rIEhvc3RlZEZpZWxkcyNldmVudDpibHVyfGJsdXJ9LCB7QGxpbmsgSG9zdGVkRmllbGRzI2V2ZW50OmZvY3VzfGZvY3VzfSwge0BsaW5rIEhvc3RlZEZpZWxkcyNldmVudDplbXB0eXxlbXB0eX0sIHtAbGluayBIb3N0ZWRGaWVsZHMjZXZlbnQ6bm90RW1wdHl8bm90RW1wdHl9LCB7QGxpbmsgSG9zdGVkRmllbGRzI2V2ZW50OmNhcmRUeXBlQ2hhbmdlfGNhcmRUeXBlQ2hhbmdlfSwgb3Ige0BsaW5rIEhvc3RlZEZpZWxkcyNldmVudDp2YWxpZGl0eUNoYW5nZXx2YWxpZGl0eUNoYW5nZX0uIEV2ZW50cyB3aWxsIGVtaXQgYSB7QGxpbmsgSG9zdGVkRmllbGRzfnN0YXRlT2JqZWN0fHN0YXRlT2JqZWN0fS5cbiAqIEBleGFtcGxlXG4gKiA8Y2FwdGlvbj5MaXN0ZW5pbmcgdG8gYSBIb3N0ZWQgRmllbGQgZXZlbnQsIGluIHRoaXMgY2FzZSAnZm9jdXMnPC9jYXB0aW9uPlxuICogaG9zdGVkRmllbGRzLmNyZWF0ZSh7IC4uLiB9LCBmdW5jdGlvbiAoY3JlYXRlRXJyLCBob3N0ZWRGaWVsZHNJbnN0YW5jZSkge1xuICogICBob3N0ZWRGaWVsZHNJbnN0YW5jZS5vbignZm9jdXMnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAqICAgICBjb25zb2xlLmxvZyhldmVudC5lbWl0dGVkQnksICdoYXMgYmVlbiBmb2N1c2VkJyk7XG4gKiAgIH0pO1xuICogfSk7XG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuXG4vKipcbiAqIFRoaXMgZXZlbnQgaXMgZW1pdHRlZCB3aGVuIHRoZSB1c2VyIHJlcXVlc3RzIHN1Ym1pc3Npb24gb2YgYW4gaW5wdXQgZmllbGQsIHN1Y2ggYXMgYnkgcHJlc3NpbmcgdGhlIEVudGVyIG9yIFJldHVybiBrZXkgb24gdGhlaXIga2V5Ym9hcmQsIG9yIG1vYmlsZSBlcXVpdmFsZW50LlxuICogQGV2ZW50IEhvc3RlZEZpZWxkcyNpbnB1dFN1Ym1pdFJlcXVlc3RcbiAqIEB0eXBlIHtIb3N0ZWRGaWVsZHN+c3RhdGVPYmplY3R9XG4gKiBAZXhhbXBsZVxuICogPGNhcHRpb24+Q2xpY2tpbmcgYSBzdWJtaXQgYnV0dG9uIHVwb24gaGl0dGluZyBFbnRlciAob3IgZXF1aXZhbGVudCkgd2l0aGluIGEgSG9zdGVkIEZpZWxkPC9jYXB0aW9uPlxuICogdmFyIGhvc3RlZEZpZWxkcyA9IHJlcXVpcmUoJ3NlYW1sZXNzcGF5LXdlYi9ob3N0ZWQtZmllbGRzJyk7XG4gKiB2YXIgc3VibWl0QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1cInN1Ym1pdFwiXScpO1xuICpcbiAqIGhvc3RlZEZpZWxkcy5jcmVhdGUoeyAuLi4gfSwgZnVuY3Rpb24gKGNyZWF0ZUVyciwgaG9zdGVkRmllbGRzSW5zdGFuY2UpIHtcbiAqICAgaG9zdGVkRmllbGRzSW5zdGFuY2Uub24oJ2lucHV0U3VibWl0UmVxdWVzdCcsIGZ1bmN0aW9uICgpIHtcbiAqICAgICAvLyBVc2VyIHJlcXVlc3RlZCBzdWJtaXNzaW9uLCBlLmcuIGJ5IHByZXNzaW5nIEVudGVyIG9yIGVxdWl2YWxlbnRcbiAqICAgICBzdWJtaXRCdXR0b24uY2xpY2soKTtcbiAqICAgfSk7XG4gKiB9KTtcbiAqL1xuXG4vKipcbiAqIFRoaXMgZXZlbnQgaXMgZW1pdHRlZCB3aGVuIGEgZmllbGQgdHJhbnNpdGlvbnMgZnJvbSBoYXZpbmcgZGF0YSB0byBiZWluZyBlbXB0eS5cbiAqIEBldmVudCBIb3N0ZWRGaWVsZHMjZW1wdHlcbiAqIEB0eXBlIHtIb3N0ZWRGaWVsZHN+c3RhdGVPYmplY3R9XG4gKiBAZXhhbXBsZVxuICogPGNhcHRpb24+TGlzdGVuaW5nIHRvIGFuIGVtcHR5IGV2ZW50PC9jYXB0aW9uPlxuICogaG9zdGVkRmllbGRzLmNyZWF0ZSh7IC4uLiB9LCBmdW5jdGlvbiAoY3JlYXRlRXJyLCBob3N0ZWRGaWVsZHNJbnN0YW5jZSkge1xuICogICBob3N0ZWRGaWVsZHNJbnN0YW5jZS5vbignZW1wdHknLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAqICAgICBjb25zb2xlLmxvZyhldmVudC5lbWl0dGVkQnksICdpcyBub3cgZW1wdHknKTtcbiAqICAgfSk7XG4gKiB9KTtcbiAqL1xuXG4vKipcbiAqIFRoaXMgZXZlbnQgaXMgZW1pdHRlZCB3aGVuIGEgZmllbGQgdHJhbnNpdGlvbnMgZnJvbSBiZWluZyBlbXB0eSB0byBoYXZpbmcgZGF0YS5cbiAqIEBldmVudCBIb3N0ZWRGaWVsZHMjbm90RW1wdHlcbiAqIEB0eXBlIHtIb3N0ZWRGaWVsZHN+c3RhdGVPYmplY3R9XG4gKiBAZXhhbXBsZVxuICogPGNhcHRpb24+TGlzdGVuaW5nIHRvIGFuIG5vdEVtcHR5IGV2ZW50PC9jYXB0aW9uPlxuICogaG9zdGVkRmllbGRzLmNyZWF0ZSh7IC4uLiB9LCBmdW5jdGlvbiAoY3JlYXRlRXJyLCBob3N0ZWRGaWVsZHNJbnN0YW5jZSkge1xuICogICBob3N0ZWRGaWVsZHNJbnN0YW5jZS5vbignbm90RW1wdHknLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAqICAgICBjb25zb2xlLmxvZyhldmVudC5lbWl0dGVkQnksICdpcyBub3cgbm90IGVtcHR5Jyk7XG4gKiAgIH0pO1xuICogfSk7XG4gKi9cblxuLyoqXG4gKiBUaGlzIGV2ZW50IGlzIGVtaXR0ZWQgd2hlbiBhIGZpZWxkIGxvc2VzIGZvY3VzLlxuICogQGV2ZW50IEhvc3RlZEZpZWxkcyNibHVyXG4gKiBAdHlwZSB7SG9zdGVkRmllbGRzfnN0YXRlT2JqZWN0fVxuICogQGV4YW1wbGVcbiAqIDxjYXB0aW9uPkxpc3RlbmluZyB0byBhIGJsdXIgZXZlbnQ8L2NhcHRpb24+XG4gKiBob3N0ZWRGaWVsZHMuY3JlYXRlKHsgLi4uIH0sIGZ1bmN0aW9uIChjcmVhdGVFcnIsIGhvc3RlZEZpZWxkc0luc3RhbmNlKSB7XG4gKiAgIGhvc3RlZEZpZWxkc0luc3RhbmNlLm9uKCdibHVyJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gKiAgICAgY29uc29sZS5sb2coZXZlbnQuZW1pdHRlZEJ5LCAnbG9zdCBmb2N1cycpO1xuICogICB9KTtcbiAqIH0pO1xuICovXG5cbi8qKlxuICogVGhpcyBldmVudCBpcyBlbWl0dGVkIHdoZW4gYSBmaWVsZCBnYWlucyBmb2N1cy5cbiAqIEBldmVudCBIb3N0ZWRGaWVsZHMjZm9jdXNcbiAqIEB0eXBlIHtIb3N0ZWRGaWVsZHN+c3RhdGVPYmplY3R9XG4gKiBAZXhhbXBsZVxuICogPGNhcHRpb24+TGlzdGVuaW5nIHRvIGEgZm9jdXMgZXZlbnQ8L2NhcHRpb24+XG4gKiBob3N0ZWRGaWVsZHMuY3JlYXRlKHsgLi4uIH0sIGZ1bmN0aW9uIChjcmVhdGVFcnIsIGhvc3RlZEZpZWxkc0luc3RhbmNlKSB7XG4gKiAgIGhvc3RlZEZpZWxkc0luc3RhbmNlLm9uKCdmb2N1cycsIGZ1bmN0aW9uIChldmVudCkge1xuICogICAgIGNvbnNvbGUubG9nKGV2ZW50LmVtaXR0ZWRCeSwgJ2dhaW5lZCBmb2N1cycpO1xuICogICB9KTtcbiAqIH0pO1xuICovXG5cbi8qKlxuICogVGhpcyBldmVudCBpcyBlbWl0dGVkIHdoZW4gYWN0aXZpdHkgd2l0aGluIHRoZSBudW1iZXIgZmllbGQgaGFzIGNoYW5nZWQgc3VjaCB0aGF0IHRoZSBwb3NzaWJsZSBjYXJkIHR5cGUgaGFzIGNoYW5nZWQuXG4gKiBAZXZlbnQgSG9zdGVkRmllbGRzI2NhcmRUeXBlQ2hhbmdlXG4gKiBAdHlwZSB7SG9zdGVkRmllbGRzfnN0YXRlT2JqZWN0fVxuICogQGV4YW1wbGVcbiAqIDxjYXB0aW9uPkxpc3RlbmluZyB0byBhIGNhcmRUeXBlQ2hhbmdlIGV2ZW50PC9jYXB0aW9uPlxuICogaG9zdGVkRmllbGRzLmNyZWF0ZSh7IC4uLiB9LCBmdW5jdGlvbiAoY3JlYXRlRXJyLCBob3N0ZWRGaWVsZHNJbnN0YW5jZSkge1xuICogICBob3N0ZWRGaWVsZHNJbnN0YW5jZS5vbignY2FyZFR5cGVDaGFuZ2UnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAqICAgICBpZiAoZXZlbnQuY2FyZHMubGVuZ3RoID09PSAxKSB7XG4gKiAgICAgICBjb25zb2xlLmxvZyhldmVudC5jYXJkc1swXS50eXBlKTtcbiAqICAgICB9IGVsc2Uge1xuICogICAgICAgY29uc29sZS5sb2coJ1R5cGUgb2YgY2FyZCBub3QgeWV0IGtub3duJyk7XG4gKiAgICAgfVxuICogICB9KTtcbiAqIH0pO1xuICovXG5cbi8qKlxuICogVGhpcyBldmVudCBpcyBlbWl0dGVkIHdoZW4gdGhlIHZhbGlkaXR5IG9mIGEgZmllbGQgaGFzIGNoYW5nZWQuIFZhbGlkaXR5IGlzIHJlcHJlc2VudGVkIGluIHRoZSB7QGxpbmsgSG9zdGVkRmllbGRzfnN0YXRlT2JqZWN0fHN0YXRlT2JqZWN0fSBhcyB0d28gYm9vbGVhbnM6IGBpc1ZhbGlkYCBhbmQgYGlzUG90ZW50aWFsbHlWYWxpZGAuXG4gKiBAZXZlbnQgSG9zdGVkRmllbGRzI3ZhbGlkaXR5Q2hhbmdlXG4gKiBAdHlwZSB7SG9zdGVkRmllbGRzfnN0YXRlT2JqZWN0fVxuICogQGV4YW1wbGVcbiAqIDxjYXB0aW9uPkxpc3RlbmluZyB0byBhIHZhbGlkaXR5Q2hhbmdlIGV2ZW50PC9jYXB0aW9uPlxuICogaG9zdGVkRmllbGRzLmNyZWF0ZSh7IC4uLiB9LCBmdW5jdGlvbiAoY3JlYXRlRXJyLCBob3N0ZWRGaWVsZHNJbnN0YW5jZSkge1xuICogICBob3N0ZWRGaWVsZHNJbnN0YW5jZS5vbigndmFsaWRpdHlDaGFuZ2UnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAqICAgICB2YXIgZmllbGQgPSBldmVudC5maWVsZHNbZXZlbnQuZW1pdHRlZEJ5XTtcbiAqXG4gKiAgICAgaWYgKGZpZWxkLmlzVmFsaWQpIHtcbiAqICAgICAgIGNvbnNvbGUubG9nKGV2ZW50LmVtaXR0ZWRCeSwgJ2lzIGZ1bGx5IHZhbGlkJyk7XG4gKiAgICAgfSBlbHNlIGlmIChmaWVsZC5pc1BvdGVudGlhbGx5VmFsaWQpIHtcbiAqICAgICAgIGNvbnNvbGUubG9nKGV2ZW50LmVtaXR0ZWRCeSwgJ2lzIHBvdGVudGlhbGx5IHZhbGlkJyk7XG4gKiAgICAgfSBlbHNlIHtcbiAqICAgICAgIGNvbnNvbGUubG9nKGV2ZW50LmVtaXR0ZWRCeSwgJ2lzIG5vdCB2YWxpZCcpO1xuICogICAgIH1cbiAqICAgfSk7XG4gKiB9KTtcbiAqL1xuXG5mdW5jdGlvbiBjcmVhdGVJbnB1dEV2ZW50SGFuZGxlcihmaWVsZHMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChldmVudERhdGEpIHtcbiAgICB2YXIgZmllbGQ7XG4gICAgdmFyIG1lcmNoYW50UGF5bG9hZCA9IGV2ZW50RGF0YS5tZXJjaGFudFBheWxvYWQ7XG4gICAgdmFyIGVtaXR0ZWRCeSA9IG1lcmNoYW50UGF5bG9hZC5lbWl0dGVkQnk7XG4gICAgdmFyIGNvbnRhaW5lciA9IGZpZWxkc1tlbWl0dGVkQnldLmNvbnRhaW5lckVsZW1lbnQ7XG5cbiAgICBPYmplY3Qua2V5cyhtZXJjaGFudFBheWxvYWQuZmllbGRzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIG1lcmNoYW50UGF5bG9hZC5maWVsZHNba2V5XS5jb250YWluZXIgPSBmaWVsZHNba2V5XS5jb250YWluZXJFbGVtZW50O1xuICAgIH0pO1xuXG4gICAgZmllbGQgPSBtZXJjaGFudFBheWxvYWQuZmllbGRzW2VtaXR0ZWRCeV07XG5cbiAgICBjbGFzc2xpc3QudG9nZ2xlKGNvbnRhaW5lciwgY29uc3RhbnRzLmV4dGVybmFsQ2xhc3Nlcy5GT0NVU0VELCBmaWVsZC5pc0ZvY3VzZWQpO1xuICAgIGNsYXNzbGlzdC50b2dnbGUoY29udGFpbmVyLCBjb25zdGFudHMuZXh0ZXJuYWxDbGFzc2VzLlZBTElELCBmaWVsZC5pc1ZhbGlkKTtcbiAgICBjbGFzc2xpc3QudG9nZ2xlKGNvbnRhaW5lciwgY29uc3RhbnRzLmV4dGVybmFsQ2xhc3Nlcy5JTlZBTElELCAhZmllbGQuaXNQb3RlbnRpYWxseVZhbGlkKTtcbiAgICBjbGFzc2xpc3QudG9nZ2xlKGNvbnRhaW5lciwgY29uc3RhbnRzLmV4dGVybmFsQ2xhc3Nlcy5QT1RFTlRJQUxMWV9WQUxJRCwgZmllbGQuaXNQb3RlbnRpYWxseVZhbGlkKTtcblxuICAgIHRoaXMuX3N0YXRlID0geyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWludmFsaWQtdGhpc1xuICAgICAgY2FyZHM6IG1lcmNoYW50UGF5bG9hZC5jYXJkcyxcbiAgICAgIGZpZWxkczogbWVyY2hhbnRQYXlsb2FkLmZpZWxkc1xuICAgIH07XG5cbiAgICB0aGlzLl9lbWl0KGV2ZW50RGF0YS50eXBlLCBtZXJjaGFudFBheWxvYWQpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWludmFsaWQtdGhpc1xuICB9O1xufVxuXG4vKipcbiAqIEBjbGFzcyBIb3N0ZWRGaWVsZHNcbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIFRoZSBIb3N0ZWQgRmllbGRzIHtAbGluayBtb2R1bGU6c2VhbWxlc3NwYXktd2ViL2hvc3RlZC1maWVsZHMuY3JlYXRlIGNyZWF0ZX0gb3B0aW9ucy5cbiAqIEBkZXNjcmlwdGlvbiA8c3Ryb25nPkRvIG5vdCB1c2UgdGhpcyBjb25zdHJ1Y3RvciBkaXJlY3RseS4gVXNlIHtAbGluayBtb2R1bGU6c2VhbWxlc3NwYXktd2ViL2hvc3RlZC1maWVsZHMuY3JlYXRlfHNlYW1sZXNzcGF5LXdlYi5ob3N0ZWQtZmllbGRzLmNyZWF0ZX0gaW5zdGVhZC48L3N0cm9uZz5cbiAqIEBjbGFzc2Rlc2MgVGhpcyBjbGFzcyByZXByZXNlbnRzIGEgSG9zdGVkIEZpZWxkcyBjb21wb25lbnQgcHJvZHVjZWQgYnkge0BsaW5rIG1vZHVsZTpzZWFtbGVzc3BheS13ZWIvaG9zdGVkLWZpZWxkcy5jcmVhdGV8c2VhbWxlc3NwYXktd2ViL2hvc3RlZC1maWVsZHMuY3JlYXRlfS4gSW5zdGFuY2VzIG9mIHRoaXMgY2xhc3MgaGF2ZSBtZXRob2RzIGZvciBpbnRlcmFjdGluZyB3aXRoIHRoZSBpbnB1dCBmaWVsZHMgd2l0aGluIEhvc3RlZCBGaWVsZHMnIGlmcmFtZXMuXG4gKi9cbmZ1bmN0aW9uIEhvc3RlZEZpZWxkcyhvcHRpb25zKSB7XG4gIHZhciBjbGllbnRWZXJzaW9uLCBjbGllbnRDb25maWc7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIGZpZWxkcyA9IHt9O1xuICB2YXIgZmllbGRDb3VudCA9IDA7XG4gIHZhciBjb21wb25lbnRJZCA9IHV1aWQoKTtcbiAgdmFyIGF2YWlsYWJsZVR5cGVzID0gT2JqZWN0LmtleXMoY29uc3RhbnRzLnBheW1lbnRUeXBlcykucmVkdWNlKGZ1bmN0aW9uKHJlc3VsdCwgdHlwZUtleSkge1xuICAgIHJlc3VsdC5wdXNoKGNvbnN0YW50cy5wYXltZW50VHlwZXNbdHlwZUtleV0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH0sW10pXG5cbiAgaWYgKCFvcHRpb25zLnBheW1lbnRUeXBlKSB7XG4gICAgdGhyb3cgbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgdHlwZTogc2hhcmVkRXJyb3JzLklOU1RBTlRJQVRJT05fT1BUSU9OX1JFUVVJUkVELnR5cGUsXG4gICAgICBjb2RlOiBzaGFyZWRFcnJvcnMuSU5TVEFOVElBVElPTl9PUFRJT05fUkVRVUlSRUQuY29kZSxcbiAgICAgIG1lc3NhZ2U6ICdvcHRpb25zLnBheW1lbnRUeXBlIGlzIHJlcXVpcmVkIHdoZW4gaW5zdGFudGlhdGluZyBIb3N0ZWQgRmllbGRzLidcbiAgICB9KTtcbiAgfVxuXG4gIGlmICghfmF2YWlsYWJsZVR5cGVzLmluZGV4T2Yob3B0aW9ucy5wYXltZW50VHlwZSkpIHtcbiAgICB0aHJvdyBuZXcgU2VhbWxlc3NwYXlFcnJvcih7XG4gICAgICB0eXBlOiBzaGFyZWRFcnJvcnMuSU5WQUxJRF9PUFRJT04udHlwZSxcbiAgICAgIGNvZGU6IHNoYXJlZEVycm9ycy5JTlZBTElEX09QVElPTi5jb2RlLFxuICAgICAgbWVzc2FnZTogJ29wdGlvbnMucGF5bWVudFR5cGUgaXMgaW52YWxpZCAoYWNjZXB0YWJsZTogJyArIGF2YWlsYWJsZVR5cGVzLmpvaW4oJywgJykgKyAnKS4nXG4gICAgfSk7XG4gIH1cblxuICBpZiAoIW9wdGlvbnMuY2xpZW50KSB7XG4gICAgdGhyb3cgbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgdHlwZTogc2hhcmVkRXJyb3JzLklOU1RBTlRJQVRJT05fT1BUSU9OX1JFUVVJUkVELnR5cGUsXG4gICAgICBjb2RlOiBzaGFyZWRFcnJvcnMuSU5TVEFOVElBVElPTl9PUFRJT05fUkVRVUlSRUQuY29kZSxcbiAgICAgIG1lc3NhZ2U6ICdvcHRpb25zLmNsaWVudCBpcyByZXF1aXJlZCB3aGVuIGluc3RhbnRpYXRpbmcgSG9zdGVkIEZpZWxkcy4nXG4gICAgfSk7XG4gIH1cblxuICBjbGllbnRDb25maWcgPSBvcHRpb25zLmNsaWVudC5nZXRDb25maWd1cmF0aW9uKCk7XG4gIGNsaWVudFZlcnNpb24gPSBjbGllbnRDb25maWcuYW5hbHl0aWNzTWV0YWRhdGEuc2RrVmVyc2lvbjtcbiAgaWYgKGNsaWVudFZlcnNpb24gIT09IFZFUlNJT04pIHtcbiAgICB0aHJvdyBuZXcgU2VhbWxlc3NwYXlFcnJvcih7XG4gICAgICB0eXBlOiBzaGFyZWRFcnJvcnMuSU5DT01QQVRJQkxFX1ZFUlNJT05TLnR5cGUsXG4gICAgICBjb2RlOiBzaGFyZWRFcnJvcnMuSU5DT01QQVRJQkxFX1ZFUlNJT05TLmNvZGUsXG4gICAgICBtZXNzYWdlOiAnQ2xpZW50ICh2ZXJzaW9uICcgKyBjbGllbnRWZXJzaW9uICsgJykgYW5kIEhvc3RlZCBGaWVsZHMgKHZlcnNpb24gJyArIFZFUlNJT04gKyAnKSBjb21wb25lbnRzIG11c3QgYmUgZnJvbSB0aGUgc2FtZSBTREsgdmVyc2lvbi4nXG4gICAgfSk7XG4gIH1cblxuICBpZiAoIW9wdGlvbnMuZmllbGRzKSB7XG4gICAgdGhyb3cgbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgdHlwZTogc2hhcmVkRXJyb3JzLklOU1RBTlRJQVRJT05fT1BUSU9OX1JFUVVJUkVELnR5cGUsXG4gICAgICBjb2RlOiBzaGFyZWRFcnJvcnMuSU5TVEFOVElBVElPTl9PUFRJT05fUkVRVUlSRUQuY29kZSxcbiAgICAgIG1lc3NhZ2U6ICdvcHRpb25zLmZpZWxkcyBpcyByZXF1aXJlZCB3aGVuIGluc3RhbnRpYXRpbmcgSG9zdGVkIEZpZWxkcy4nXG4gICAgfSk7XG4gIH1cblxuICBjaGVja0ludGVncml0eShvcHRpb25zLnBheW1lbnRUeXBlLCBPYmplY3Qua2V5cyhvcHRpb25zLmZpZWxkcykpO1xuXG4gIEV2ZW50RW1pdHRlci5jYWxsKHRoaXMpO1xuXG4gIHRoaXMuX3BheW1lbnRUeXBlID0gb3B0aW9ucy5wYXltZW50VHlwZTtcbiAgdGhpcy5faW5qZWN0ZWROb2RlcyA9IFtdO1xuICB0aGlzLl9kZXN0cnVjdG9yID0gbmV3IERlc3RydWN0b3IoKTtcbiAgdGhpcy5fZmllbGRzID0gZmllbGRzO1xuICB0aGlzLl9zdWJtaXRCdXR0b24gPSBvcHRpb25zLnN1Ym1pdEJ1dHRvbjtcbiAgdGhpcy5fYWRkaXRpb25hbFJlcXVlc3REYXRhID0gbnVsbDtcbiAgdGhpcy5fc3RhdGUgPSB7XG4gICAgZmllbGRzOiB7fSxcbiAgICBjYXJkczogZ2V0Q2FyZFR5cGVzKCcnKVxuICB9O1xuXG4gIHRoaXMuX2J1cyA9IG5ldyBCdXMoe1xuICAgIGNoYW5uZWw6IGNvbXBvbmVudElkLFxuICAgIG1lcmNoYW50VXJsOiBsb2NhdGlvbi5ocmVmXG4gIH0pO1xuXG4gIHRoaXMuX2Rlc3RydWN0b3IucmVnaXN0ZXJGdW5jdGlvbkZvclRlYXJkb3duKFxuICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuX2J1cy50ZWFyZG93bigpO1xuICAgIH0pO1xuXG4gIHRoaXMuX2NsaWVudCA9IG9wdGlvbnMuY2xpZW50O1xuXG4gIGlmIChvcHRpb25zLnN1Ym1pdEJ1dHRvbikge1xuICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKG9wdGlvbnMuc3VibWl0QnV0dG9uLnNlbGVjdG9yKTtcblxuICAgIGlmICghY29udGFpbmVyKSB7XG4gICAgICB0aHJvdyBuZXcgU2VhbWxlc3NwYXlFcnJvcih7XG4gICAgICAgIHR5cGU6IGVycm9ycy5IT1NURURfRklFTERTX0lOVkFMSURfU1VCTUlUX0JVVFRPTl9TRUxFQ1RPUi50eXBlLFxuICAgICAgICBjb2RlOiBlcnJvcnMuSE9TVEVEX0ZJRUxEU19JTlZBTElEX1NVQk1JVF9CVVRUT05fU0VMRUNUT1IuY29kZSxcbiAgICAgICAgbWVzc2FnZTogZXJyb3JzLkhPU1RFRF9GSUVMRFNfSU5WQUxJRF9TVUJNSVRfQlVUVE9OX1NFTEVDVE9SLm1lc3NhZ2UsXG4gICAgICAgIGRldGFpbHM6IHtcbiAgICAgICAgICBmaWVsZFNlbGVjdG9yOiBvcHRpb25zLnN1Ym1pdEJ1dHRvbi5zZWxlY3RvclxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBvcHRpb25zLnN1Ym1pdEJ1dHRvbiA9IHsgY29udGFpbmVyRWxlbWVudDogY29udGFpbmVyIH07XG4gICAgdGhpcy5fc3VibWl0QnV0dG9uID0geyBjb250YWluZXI6IGNvbnRhaW5lciB9O1xuICAgIHRoaXMuX3NldHVwU3VibWl0QnV0dG9uKGNvbnRhaW5lcik7XG4gIH1cblxuICBPYmplY3Qua2V5cyhvcHRpb25zLmZpZWxkcykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgdmFyIGZpZWxkLCBjb250YWluZXIsIGZyYW1lO1xuXG4gICAgaWYgKCFzZWxmLmdldFdoaXRlbGlzdGVkRmllbGRzKCkuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgdGhyb3cgbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgICB0eXBlOiBlcnJvcnMuSE9TVEVEX0ZJRUxEU19JTlZBTElEX0ZJRUxEX0tFWS50eXBlLFxuICAgICAgICBjb2RlOiBlcnJvcnMuSE9TVEVEX0ZJRUxEU19JTlZBTElEX0ZJRUxEX0tFWS5jb2RlLFxuICAgICAgICBtZXNzYWdlOiAnXCInICsga2V5ICsgJ1wiIGlzIG5vdCBhIHZhbGlkIGZpZWxkLidcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZpZWxkID0gb3B0aW9ucy5maWVsZHNba2V5XTtcblxuICAgIGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZmllbGQuc2VsZWN0b3IpO1xuXG4gICAgaWYgKCFjb250YWluZXIpIHtcbiAgICAgIHRocm93IG5ldyBTZWFtbGVzc3BheUVycm9yKHtcbiAgICAgICAgdHlwZTogZXJyb3JzLkhPU1RFRF9GSUVMRFNfSU5WQUxJRF9GSUVMRF9TRUxFQ1RPUi50eXBlLFxuICAgICAgICBjb2RlOiBlcnJvcnMuSE9TVEVEX0ZJRUxEU19JTlZBTElEX0ZJRUxEX1NFTEVDVE9SLmNvZGUsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9ycy5IT1NURURfRklFTERTX0lOVkFMSURfRklFTERfU0VMRUNUT1IubWVzc2FnZSxcbiAgICAgICAgZGV0YWlsczoge1xuICAgICAgICAgIGZpZWxkU2VsZWN0b3I6IGZpZWxkLnNlbGVjdG9yLFxuICAgICAgICAgIGZpZWxkS2V5OiBrZXlcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChjb250YWluZXIucXVlcnlTZWxlY3RvcignaWZyYW1lW25hbWVePVwic2VhbWxlc3NwYXktXCJdJykpIHtcbiAgICAgIHRocm93IG5ldyBTZWFtbGVzc3BheUVycm9yKHtcbiAgICAgICAgdHlwZTogZXJyb3JzLkhPU1RFRF9GSUVMRFNfRklFTERfRFVQTElDQVRFX0lGUkFNRS50eXBlLFxuICAgICAgICBjb2RlOiBlcnJvcnMuSE9TVEVEX0ZJRUxEU19GSUVMRF9EVVBMSUNBVEVfSUZSQU1FLmNvZGUsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9ycy5IT1NURURfRklFTERTX0ZJRUxEX0RVUExJQ0FURV9JRlJBTUUubWVzc2FnZSxcbiAgICAgICAgZGV0YWlsczoge1xuICAgICAgICAgIGZpZWxkU2VsZWN0b3I6IGZpZWxkLnNlbGVjdG9yLFxuICAgICAgICAgIGZpZWxkS2V5OiBrZXlcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnJhbWUgPSBpRnJhbWVyKHtcbiAgICAgIHR5cGU6IGtleSxcbiAgICAgIG5hbWU6ICdzZWFtbGVzc3BheS1ob3N0ZWQtZmllbGQtJyArIGtleSxcbiAgICAgIHN0eWxlOiBjb25zdGFudHMuZGVmYXVsdElGcmFtZVN0eWxlLFxuICAgICAgdGl0bGU6ICdob3N0ZWQtZmllbGQnXG4gICAgfSk7XG5cbiAgICB0aGlzLl9pbmplY3RlZE5vZGVzID0gdGhpcy5faW5qZWN0ZWROb2Rlcy5jb25jYXQoaW5qZWN0RnJhbWUoZnJhbWUsIGNvbnRhaW5lcikpO1xuICAgIHRoaXMuX3NldHVwTGFiZWxGb2N1cyhrZXksIGNvbnRhaW5lcik7XG4gICAgZmllbGRzW2tleV0gPSB7XG4gICAgICBmcmFtZUVsZW1lbnQ6IGZyYW1lLFxuICAgICAgY29udGFpbmVyRWxlbWVudDogY29udGFpbmVyXG4gICAgfTtcbiAgICBmaWVsZENvdW50Kys7XG5cbiAgICB0aGlzLl9zdGF0ZS5maWVsZHNba2V5XSA9IHtcbiAgICAgIGlzRW1wdHk6IHRydWUsXG4gICAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICAgIGlzUG90ZW50aWFsbHlWYWxpZDogdHJ1ZSxcbiAgICAgIGlzRm9jdXNlZDogZmFsc2UsXG4gICAgICBjb250YWluZXI6IGNvbnRhaW5lclxuICAgIH07XG5cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGZyYW1lLnNyYyA9IGNvbXBvc2VVcmwoY2xpZW50Q29uZmlnLCAnaG9zdGVkLWZpZWxkcycsIGNvbXBvbmVudElkLCBjbGllbnRDb25maWcuaXNEZWJ1Zyk7XG4gICAgfSwgMCk7XG4gIH0uYmluZCh0aGlzKSk7XG5cbiAgdGhpcy5fYnVzLm9uKGV2ZW50cy5GUkFNRV9SRUFEWSwgZnVuY3Rpb24gKHJlcGx5KSB7XG4gICAgZmllbGRDb3VudC0tO1xuICAgIGlmIChmaWVsZENvdW50ID09PSAwKSB7XG4gICAgICByZXBseShvcHRpb25zKTtcbiAgICAgIHNlbGYuX2VtaXQoJ3JlYWR5Jyk7XG4gICAgfVxuICB9KTtcblxuICB0aGlzLl9idXMub24oXG4gICAgZXZlbnRzLklOUFVUX0VWRU5ULFxuICAgIGNyZWF0ZUlucHV0RXZlbnRIYW5kbGVyKGZpZWxkcykuYmluZCh0aGlzKVxuICApO1xuXG4gIHRoaXMuX2Rlc3RydWN0b3IucmVnaXN0ZXJGdW5jdGlvbkZvclRlYXJkb3duKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaiwgbm9kZSwgcGFyZW50O1xuXG4gICAgZm9yIChqID0gMDsgaiA8IHNlbGYuX2luamVjdGVkTm9kZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgIG5vZGUgPSBzZWxmLl9pbmplY3RlZE5vZGVzW2pdO1xuICAgICAgcGFyZW50ID0gbm9kZS5wYXJlbnROb2RlO1xuXG4gICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQobm9kZSk7XG5cbiAgICAgIGNsYXNzbGlzdC5yZW1vdmUoXG4gICAgICAgIHBhcmVudCxcbiAgICAgICAgY29uc3RhbnRzLmV4dGVybmFsQ2xhc3Nlcy5QT1RFTlRJQUxMWV9WQUxJRCxcbiAgICAgICAgY29uc3RhbnRzLmV4dGVybmFsQ2xhc3Nlcy5GT0NVU0VELFxuICAgICAgICBjb25zdGFudHMuZXh0ZXJuYWxDbGFzc2VzLklOVkFMSUQsXG4gICAgICAgIGNvbnN0YW50cy5leHRlcm5hbENsYXNzZXMuVkFMSURcbiAgICAgICk7XG4gICAgfVxuICB9KTtcblxuICB0aGlzLl9kZXN0cnVjdG9yLnJlZ2lzdGVyRnVuY3Rpb25Gb3JUZWFyZG93bihmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1ldGhvZE5hbWVzID0gbWV0aG9kcyhIb3N0ZWRGaWVsZHMucHJvdG90eXBlKS5jb25jYXQobWV0aG9kcyhFdmVudEVtaXR0ZXIucHJvdG90eXBlKSk7XG5cbiAgICBjb252ZXJ0TWV0aG9kc1RvRXJyb3Ioc2VsZiwgbWV0aG9kTmFtZXMpO1xuICB9KTtcbn1cblxuSG9zdGVkRmllbGRzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXZlbnRFbWl0dGVyLnByb3RvdHlwZSwge1xuICBjb25zdHJ1Y3RvcjogSG9zdGVkRmllbGRzXG59KTtcblxuSG9zdGVkRmllbGRzLnByb3RvdHlwZS5nZXRXaGl0ZWxpc3RlZEZpZWxkcyA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIGdldFdoaXRlbGlzdGVkRmllbGRzKHRoaXMuX3BheW1lbnRUeXBlKTtcbn07XG5cbkhvc3RlZEZpZWxkcy5wcm90b3R5cGUuX3NldHVwU3VibWl0QnV0dG9uID0gZnVuY3Rpb24gKGNvbnRhaW5lcikge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciBzdWJtaXRCdXR0b24gPSBjb250YWluZXI7XG5cbiAgaWYgKCFzdWJtaXRCdXR0b24pIHsgcmV0dXJuOyB9XG5cbiAgc3VibWl0QnV0dG9uLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCAnZGlzYWJsZWQnKTtcblxuICB0aGlzLl9idXMub24oXG4gICAgZXZlbnRzLklOUFVUX0VWRU5ULFxuICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChzZWxmLmlzRm9ybVZhbGlkKCkpIHtcbiAgICAgICAgc3VibWl0QnV0dG9uLnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN1Ym1pdEJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyk7XG4gICAgICB9XG4gICAgfVxuICApO1xuXG4gIGZ1bmN0aW9uIHRyaWdnZXJTdWJtaXRCdXR0b24oZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHNlbGYuX3RyaWdnZXJIYW5kbGVyRm4oc2VsZi5fdG9rZW5pemVSZXF1ZXN0SGFuZGxlciwgc2VsZik7XG5cbiAgICByZXR1cm4gc2VsZi50b2tlbml6ZS5jYWxsKHNlbGYsIHNlbGYuX2FkZGl0aW9uYWxSZXF1ZXN0RGF0YSlcbiAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgIHJldHVybiBzZWxmLl90cmlnZ2VySGFuZGxlckZuKHNlbGYuX3Rva2VuaXplUmVzcG9uc2VIYW5kbGVyLCBudWxsLCByZXNwb25zZSk7XG4gICAgfSlcbiAgICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICByZXR1cm4gc2VsZi5fdHJpZ2dlckhhbmRsZXJGbihzZWxmLl90b2tlbml6ZVJlc3BvbnNlSGFuZGxlciwgZXJyb3IsIG51bGwpO1xuICAgIH0pO1xuICB9XG5cbiAgc3VibWl0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdHJpZ2dlclN1Ym1pdEJ1dHRvbik7XG5cbiAgdGhpcy5fZGVzdHJ1Y3Rvci5yZWdpc3RlckZ1bmN0aW9uRm9yVGVhcmRvd24oZnVuY3Rpb24gKCkge1xuICAgIHN1Ym1pdEJ1dHRvbi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRyaWdnZXJTdWJtaXRCdXR0b24pO1xuICB9KTtcblxufTtcblxuSG9zdGVkRmllbGRzLnByb3RvdHlwZS5fdHJpZ2dlckhhbmRsZXJGbiA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gIHZhciBmbiA9IGFyZ3Muc2hpZnQoKTtcblxuICBpZiAodHlwZW9mIGZuICE9PSAnZnVuY3Rpb24nKSB7IHJldHVybjsgfVxuXG4gIHRyeSB7XG4gICAgZm4uYXBwbHkoc2VsZiwgYXJncyk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbn07XG5cbi8qKlxuICogU2V0IGFkZGl0aW9uYWwgZGF0YSB0byBiZSBzZW50IHdpdGggdGhlIHRva2VuaXphdGlvbiByZXF1ZXN0LlxuICogQHB1YmxpY1xuICogQGZ1bmN0aW9uXG4gKiBAcGFyYW0ge29iamVjdH0gZGF0YSBBZGRpdGlvbmFsIGRhdGEgdG8gYmUgc2VudCB3aXRoIHRoZSB0b2tlbml6YXRpb24gcmVxdWVzdC5cbiAqIEByZXR1cm5zIHt2b2lkfVxuICpcbiAqIEBleGFtcGxlXG4gKiBob3N0ZWRGaWVsZHNJbnN0YW5jZS5zZXRBZGRpdGlvbmFsUmVxdWVzdERhdGEoe1xuICogICBiaWxsaW5nQWRkcmVzczoge1xuICogICAgcG9zdGFsQ29kZTogJzYwNjU0J1xuICogICB9XG4gKiB9KTtcbiAqXG4gKi9cbkhvc3RlZEZpZWxkcy5wcm90b3R5cGUuc2V0QWRkaXRpb25hbFJlcXVlc3REYXRhID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgdGhpcy5fYWRkaXRpb25hbFJlcXVlc3REYXRhID0gZGF0YTtcbn07XG5cbi8qKlxuICogQWRkIGEgdG9rZW5pemUgcmVxdWVzdCBoYW5kbGVyLiBUaGlzIGhhbmRsZXIgd2lsbCBiZSBjYWxsZWQgYWZ0ZXIgdGhlIEhvc3RlZCBGaWVsZHMgZm9ybSBpcyBzdWJtaXR0ZWQsIGJlZm9yZSB0aGUgdG9rZW5pemUgcmVxdWVzdCBpcyBzZW50LlxuICogQHB1YmxpY1xuICogQGZ1bmN0aW9uXG4gKiBAcGFyYW0ge2NhbGxiYWNrfSBoYW5kbGVyIFRoZSBjYWxsYmFjayB0byBiZSBjYWxsZWQgYmVmb3JlIHNlbmRpbmcgdGhlIHRva2VuaXplIHJlcXVlc3QuXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqIEBleGFtcGxlXG4gKiBob3N0ZWRGaWVsZHNJbnN0YW5jZS5hZGRUb2tlbml6ZVJlcXVlc3RIYW5kbGVyKGZ1bmN0aW9uICgpIHtcbiAqICAvLyBIYW5kbGUgZm9ybSBzdWJtaXNzaW9uXG4gKiB9KTtcbiovXG5Ib3N0ZWRGaWVsZHMucHJvdG90eXBlLmFkZFRva2VuaXplUmVxdWVzdEhhbmRsZXIgPSBmdW5jdGlvbiAoaGFuZGxlcikge1xuICBpZiAodHlwZW9mIGhhbmRsZXIgIT09ICdmdW5jdGlvbicpIHsgcmV0dXJuOyB9XG4gIHRoaXMuX3Rva2VuaXplUmVxdWVzdEhhbmRsZXIgPSBoYW5kbGVyO1xufTtcblxuLyoqXG4gKiBBZGQgYSB0b2tlbml6ZSByZXNwb25zZSBoYW5kbGVyLiBUaGlzIGhhbmRsZXIgd2lsbCBiZSBjYWxsZWQgYWZ0ZXIgdGhlIHRva2VuaXplIHJlc3BvbnNlIGlzIHJlY2VpdmVkLlxuICogQHB1YmxpY1xuICogQGZ1bmN0aW9uXG4gKiBAcGFyYW0ge2NhbGxiYWNrfSBoYW5kbGVyIFRoZSBjYWxsYmFjayB0byBiZSBjYWxsZWQgYWZ0ZXIgdGhlIHRva2VuaXplIHJlc3BvbnNlIGlzIHJlY2VpdmVkLlxuICogQHJldHVybnMge3ZvaWR9XG4gKiBAZXhhbXBsZVxuICogaG9zdGVkRmllbGRzSW5zdGFuY2UuYWRkVG9rZW5pemVSZXNwb25zZUhhbmRsZXIoZnVuY3Rpb24gKGVycm9yLCByZXNwb25zZSkge1xuICogICBpZiAoZXJyb3IpIHtcbiAqICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAqICAgfSBlbHNlIHtcbiAqICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gKiAgIH1cbiAqIH0pO1xuICovXG5Ib3N0ZWRGaWVsZHMucHJvdG90eXBlLmFkZFRva2VuaXplUmVzcG9uc2VIYW5kbGVyID0gZnVuY3Rpb24gKGhhbmRsZXIpIHtcbiAgaWYgKHR5cGVvZiBoYW5kbGVyICE9PSAnZnVuY3Rpb24nKSB7IHJldHVybjsgfVxuICB0aGlzLl90b2tlbml6ZVJlc3BvbnNlSGFuZGxlciA9IGhhbmRsZXI7XG59O1xuXG5Ib3N0ZWRGaWVsZHMucHJvdG90eXBlLl9zZXR1cExhYmVsRm9jdXMgPSBmdW5jdGlvbiAodHlwZSwgY29udGFpbmVyKSB7XG4gIHZhciBsYWJlbHMsIGk7XG4gIHZhciBzaG91bGRTa2lwTGFiZWxGb2N1cyA9IGlzSW9zKCk7XG4gIHZhciBidXMgPSB0aGlzLl9idXM7XG5cbiAgaWYgKHNob3VsZFNraXBMYWJlbEZvY3VzKSB7IHJldHVybjsgfVxuICBpZiAoY29udGFpbmVyLmlkID09IG51bGwpIHsgcmV0dXJuOyB9XG5cbiAgZnVuY3Rpb24gdHJpZ2dlckZvY3VzKCkge1xuICAgIGJ1cy5lbWl0KGV2ZW50cy5UUklHR0VSX0lOUFVUX0ZPQ1VTLCB0eXBlKTtcbiAgfVxuXG4gIGxhYmVscyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xhYmVsW2Zvcj1cIicgKyBjb250YWluZXIuaWQgKyAnXCJdJykpO1xuICBsYWJlbHMgPSBsYWJlbHMuY29uY2F0KGZpbmRQYXJlbnRUYWdzKGNvbnRhaW5lciwgJ2xhYmVsJykpO1xuXG4gIGZvciAoaSA9IDA7IGkgPCBsYWJlbHMubGVuZ3RoOyBpKyspIHtcbiAgICBsYWJlbHNbaV0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0cmlnZ2VyRm9jdXMsIGZhbHNlKTtcbiAgfVxuXG4gIHRoaXMuX2Rlc3RydWN0b3IucmVnaXN0ZXJGdW5jdGlvbkZvclRlYXJkb3duKGZ1bmN0aW9uICgpIHtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGFiZWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsYWJlbHNbaV0ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0cmlnZ2VyRm9jdXMsIGZhbHNlKTtcbiAgICB9XG4gIH0pO1xufTtcblxuLyoqXG4gKiBDbGVhbmx5IHJlbW92ZSBhbnl0aGluZyBzZXQgdXAgYnkge0BsaW5rIG1vZHVsZTpzZWFtbGVzc3BheS13ZWIvaG9zdGVkLWZpZWxkcy5jcmVhdGV8Y3JlYXRlfS5cbiAqIEBwdWJsaWNcbiAqIEBmdW5jdGlvblxuICogQHBhcmFtIHtjYWxsYmFja30gW2NhbGxiYWNrXSBDYWxsZWQgb24gY29tcGxldGlvbiwgY29udGFpbmluZyBhbiBlcnJvciBpZiBvbmUgb2NjdXJyZWQuIE5vIGRhdGEgaXMgcmV0dXJuZWQgaWYgdGVhcmRvd24gY29tcGxldGVzIHN1Y2Nlc3NmdWxseS4gSWYgbm8gY2FsbGJhY2sgaXMgcHJvdmlkZWQsIGB0ZWFyZG93bmAgcmV0dXJucyBhIHByb21pc2UuXG4gKiBAZXhhbXBsZVxuICogaG9zdGVkRmllbGRzSW5zdGFuY2UudGVhcmRvd24oZnVuY3Rpb24gKHRlYXJkb3duRXJyKSB7XG4gKiAgIGlmICh0ZWFyZG93bkVycikge1xuICogICAgIGNvbnNvbGUuZXJyb3IoJ0NvdWxkIG5vdCB0ZWFyIGRvd24gSG9zdGVkIEZpZWxkcyEnKTtcbiAqICAgfSBlbHNlIHtcbiAqICAgICBjb25zb2xlLmluZm8oJ0hvc3RlZCBGaWVsZHMgaGFzIGJlZW4gdG9ybiBkb3duIScpO1xuICogICB9XG4gKiB9KTtcbiAqIEByZXR1cm5zIHtQcm9taXNlfHZvaWR9IElmIG5vIGNhbGxiYWNrIGlzIHByb3ZpZGVkLCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdoZW4gdGhlIHRlYXJkb3duIGlzIGNvbXBsZXRlLlxuICovXG5Ib3N0ZWRGaWVsZHMucHJvdG90eXBlLnRlYXJkb3duID0gd3JhcFByb21pc2UoXG4gIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8taW52YWxpZC10aGlzXG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgc2VsZi5fZGVzdHJ1Y3Rvci50ZWFyZG93bihmdW5jdGlvbiAoZXJyKSB7XG5cbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbik7XG5cbi8qKlxuICogVG9rZW5pemVzIGZpZWxkcyBhbmQgcmV0dXJucyBhIHRva2VuIHBheWxvYWQuXG4gKiBAcHVibGljXG4gKiBAZnVuY3Rpb25cbiAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc10gQWxsIHRva2VuaXphdGlvbiBvcHRpb25zIGZvciB0aGUgSG9zdGVkIEZpZWxkcyBjb21wb25lbnQuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLnZhdWx0PWZhbHNlXSBXaGVuIHRydWUsIHdpbGwgdmF1bHQgdGhlIHRva2VuaXplZCBjYXJkLiBDYXJkcyB3aWxsIG9ubHkgYmUgdmF1bHRlZCB3aGVuIHVzaW5nIGEgY2xpZW50IGNyZWF0ZWQgd2l0aCBhIGNsaWVudCB0b2tlbiB0aGF0IGluY2x1ZGVzIGEgY3VzdG9tZXIgSUQuXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuYmlsbGluZ0FkZHJlc3MucG9zdGFsQ29kZV0gV2hlbiBzdXBwbGllZCwgdGhpcyBwb3N0YWwgY29kZSB3aWxsIGJlIHRva2VuaXplZCBhbG9uZyB3aXRoIHRoZSBjb250ZW50cyBvZiB0aGUgZmllbGRzLiBJZiBhIHBvc3RhbCBjb2RlIGlzIHByb3ZpZGVkIGFzIHBhcnQgb2YgdGhlIEhvc3RlZCBGaWVsZHMgY29uZmlndXJhdGlvbiwgdGhlIHZhbHVlIG9mIHRoZSBmaWVsZCB3aWxsIGJlIHRva2VuaXplZCBhbmQgdGhpcyB2YWx1ZSB3aWxsIGJlIGlnbm9yZWQuXG4gKiBAcGFyYW0ge2NhbGxiYWNrfSBbY2FsbGJhY2tdIFRoZSBzZWNvbmQgYXJndW1lbnQsIDxjb2RlPmRhdGE8L2NvZGU+LCBpcyBhIHtAbGluayBIb3N0ZWRGaWVsZHN+dG9rZW5pemVQYXlsb2FkfHRva2VuaXplUGF5bG9hZH0uIElmIG5vIGNhbGxiYWNrIGlzIHByb3ZpZGVkLCBgdG9rZW5pemVgIHJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHJlc29sdmVzIHdpdGggYSB7QGxpbmsgSG9zdGVkRmllbGRzfnRva2VuaXplUGF5bG9hZHx0b2tlbml6ZVBheWxvYWR9LlxuICogQGV4YW1wbGUgPGNhcHRpb24+VG9rZW5pemUgYSBjYXJkPC9jYXB0aW9uPlxuICogaG9zdGVkRmllbGRzSW5zdGFuY2UudG9rZW5pemUoZnVuY3Rpb24gKHRva2VuaXplRXJyLCBwYXlsb2FkKSB7XG4gKiAgIGlmICh0b2tlbml6ZUVycikge1xuICogICAgIHN3aXRjaCAodG9rZW5pemVFcnIuY29kZSkge1xuICogICAgICAgY2FzZSAnSE9TVEVEX0ZJRUxEU19GSUVMRFNfRU1QVFknOlxuICogICAgICAgICBjb25zb2xlLmVycm9yKCdBbGwgZmllbGRzIGFyZSBlbXB0eSEgUGxlYXNlIGZpbGwgb3V0IHRoZSBmb3JtLicpO1xuICogICAgICAgICBicmVhaztcbiAqICAgICAgIGNhc2UgJ0hPU1RFRF9GSUVMRFNfRklFTERTX0lOVkFMSUQnOlxuICogICAgICAgICBjb25zb2xlLmVycm9yKCdTb21lIGZpZWxkcyBhcmUgaW52YWxpZDonLCB0b2tlbml6ZUVyci5kZXRhaWxzLmludmFsaWRGaWVsZEtleXMpO1xuICogICAgICAgICBicmVhaztcbiAqICAgICAgIGNhc2UgJ0hPU1RFRF9GSUVMRFNfRkFJTEVEX1RPS0VOSVpBVElPTic6XG4gKiAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1Rva2VuaXphdGlvbiBmYWlsZWQgc2VydmVyIHNpZGUuIElzIHRoZSBjYXJkIHZhbGlkPycpO1xuICogICAgICAgICBicmVhaztcbiAqICAgICAgIGNhc2UgJ0hPU1RFRF9GSUVMRFNfVE9LRU5JWkFUSU9OX05FVFdPUktfRVJST1InOlxuICogICAgICAgICBjb25zb2xlLmVycm9yKCdOZXR3b3JrIGVycm9yIG9jY3VycmVkIHdoZW4gdG9rZW5pemluZy4nKTtcbiAqICAgICAgICAgYnJlYWs7XG4gKiAgICAgICBkZWZhdWx0OlxuICogICAgICAgICBjb25zb2xlLmVycm9yKCdTb21ldGhpbmcgYmFkIGhhcHBlbmVkIScsIHRva2VuaXplRXJyKTtcbiAqICAgICB9XG4gKiAgIH0gZWxzZSB7XG4gKiAgICAgY29uc29sZS5sb2coJ0dvdCBub25jZTonLCBwYXlsb2FkLm5vbmNlKTtcbiAqICAgfVxuICogfSk7XG4gKiBAZXhhbXBsZSA8Y2FwdGlvbj5Ub2tlbml6ZSBhbmQgdmF1bHQgYSBjYXJkPC9jYXB0aW9uPlxuICogaG9zdGVkRmllbGRzSW5zdGFuY2UudG9rZW5pemUoe1xuICogICB2YXVsdDogdHJ1ZVxuICogfSwgZnVuY3Rpb24gKHRva2VuaXplRXJyLCBwYXlsb2FkKSB7XG4gKiAgIGlmICh0b2tlbml6ZUVycikge1xuICogICAgIGNvbnNvbGUuZXJyb3IodG9rZW5pemVFcnIpO1xuICogICB9IGVsc2Uge1xuICogICAgIGNvbnNvbGUubG9nKCdHb3Qgbm9uY2U6JywgcGF5bG9hZC5ub25jZSk7XG4gKiAgIH1cbiAqIH0pO1xuICogQGV4YW1wbGUgPGNhcHRpb24+VG9rZW5pemUgYSBjYXJkIHdpdGggdGhlIHBvc3RhbCBjb2RlIG9wdGlvbjwvY2FwdGlvbj5cbiAqIGhvc3RlZEZpZWxkc0luc3RhbmNlLnRva2VuaXplKHtcbiAqICAgYmlsbGluZ0FkZHJlc3M6IHtcbiAqICAgICBwb3N0YWxDb2RlOiAnMTExMTEnXG4gKiAgIH1cbiAqIH0sIGZ1bmN0aW9uICh0b2tlbml6ZUVyciwgcGF5bG9hZCkge1xuICogICBpZiAodG9rZW5pemVFcnIpIHtcbiAqICAgICBjb25zb2xlLmVycm9yKHRva2VuaXplRXJyKTtcbiAqICAgfSBlbHNlIHtcbiAqICAgICBjb25zb2xlLmxvZygnR290IG5vbmNlOicsIHBheWxvYWQubm9uY2UpO1xuICogICB9XG4gKiB9KTtcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5Ib3N0ZWRGaWVsZHMucHJvdG90eXBlLnRva2VuaXplID0gd3JhcFByb21pc2UoXG4gIGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWludmFsaWQtdGhpc1xuXG4gICAgaWYgKCFvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHNlbGYuX2J1cy5lbWl0KGV2ZW50cy5UT0tFTklaQVRJT05fUkVRVUVTVCwgb3B0aW9ucywgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIHZhciBlcnIgPSByZXNwb25zZVswXTtcbiAgICAgICAgdmFyIHBheWxvYWQgPSByZXNwb25zZVsxXTtcblxuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzb2x2ZShmb3JtYXRUb2tlbml6ZVJlc3BvbnNlKHBheWxvYWQpKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbik7XG5cbi8qKlxuICogQWRkIGEgY2xhc3MgdG8gYSB7QGxpbmsgbW9kdWxlOnNlYW1sZXNzcGF5LXdlYi9ob3N0ZWQtZmllbGRzfmZpZWxkIGZpZWxkfS4gVXNlZnVsIGZvciB1cGRhdGluZyBmaWVsZCBzdHlsZXMgd2hlbiBldmVudHMgb2NjdXIgZWxzZXdoZXJlIGluIHlvdXIgY2hlY2tvdXQuXG4gKiBAcHVibGljXG4gKiBAcGFyYW0ge3N0cmluZ30gZmllbGQgVGhlIGZpZWxkIHlvdSB3aXNoIHRvIGFkZCBhIGNsYXNzIHRvLiBNdXN0IGJlIGEgdmFsaWQge0BsaW5rIG1vZHVsZTpzZWFtbGVzc3BheS13ZWIvaG9zdGVkLWZpZWxkc35maWVsZE9wdGlvbnMgZmllbGRPcHRpb259LlxuICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzbmFtZSBUaGUgY2xhc3MgdG8gYmUgYWRkZWQuXG4gKiBAcGFyYW0ge2NhbGxiYWNrfSBbY2FsbGJhY2tdIENhbGxiYWNrIGV4ZWN1dGVkIG9uIGNvbXBsZXRpb24sIGNvbnRhaW5pbmcgYW4gZXJyb3IgaWYgb25lIG9jY3VycmVkLiBObyBkYXRhIGlzIHJldHVybmVkIGlmIHRoZSBjbGFzcyBpcyBhZGRlZCBzdWNjZXNzZnVsbHkuXG4gKlxuICogQGV4YW1wbGVcbiAqIGhvc3RlZEZpZWxkc0luc3RhbmNlLmFkZENsYXNzKCdudW1iZXInLCAnY3VzdG9tLWNsYXNzJywgZnVuY3Rpb24gKGFkZENsYXNzRXJyKSB7XG4gKiAgIGlmIChhZGRDbGFzc0Vycikge1xuICogICAgIGNvbnNvbGUuZXJyb3IoYWRkQ2xhc3NFcnIpO1xuICogICB9XG4gKiB9KTtcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5Ib3N0ZWRGaWVsZHMucHJvdG90eXBlLmFkZENsYXNzID0gZnVuY3Rpb24gKGZpZWxkLCBjbGFzc25hbWUsIGNhbGxiYWNrKSB7XG4gIHZhciBlcnI7XG5cbiAgaWYgKCF0aGlzLmdldFdoaXRlbGlzdGVkRmllbGRzKCkuaGFzT3duUHJvcGVydHkoZmllbGQpKSB7XG4gICAgZXJyID0gbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgdHlwZTogZXJyb3JzLkhPU1RFRF9GSUVMRFNfRklFTERfSU5WQUxJRC50eXBlLFxuICAgICAgY29kZTogZXJyb3JzLkhPU1RFRF9GSUVMRFNfRklFTERfSU5WQUxJRC5jb2RlLFxuICAgICAgbWVzc2FnZTogJ1wiJyArIGZpZWxkICsgJ1wiIGlzIG5vdCBhIHZhbGlkIGZpZWxkLiBZb3UgbXVzdCB1c2UgYSB2YWxpZCBmaWVsZCBvcHRpb24gd2hlbiBhZGRpbmcgYSBjbGFzcy4nXG4gICAgfSk7XG4gIH0gZWxzZSBpZiAoIXRoaXMuX2ZpZWxkcy5oYXNPd25Qcm9wZXJ0eShmaWVsZCkpIHtcbiAgICBlcnIgPSBuZXcgU2VhbWxlc3NwYXlFcnJvcih7XG4gICAgICB0eXBlOiBlcnJvcnMuSE9TVEVEX0ZJRUxEU19GSUVMRF9OT1RfUFJFU0VOVC50eXBlLFxuICAgICAgY29kZTogZXJyb3JzLkhPU1RFRF9GSUVMRFNfRklFTERfTk9UX1BSRVNFTlQuY29kZSxcbiAgICAgIG1lc3NhZ2U6ICdDYW5ub3QgYWRkIGNsYXNzIHRvIFwiJyArIGZpZWxkICsgJ1wiIGZpZWxkIGJlY2F1c2UgaXQgaXMgbm90IHBhcnQgb2YgdGhlIGN1cnJlbnQgSG9zdGVkIEZpZWxkcyBvcHRpb25zLidcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLl9idXMuZW1pdChldmVudHMuQUREX0NMQVNTLCBmaWVsZCwgY2xhc3NuYW1lKTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjYWxsYmFjayA9IGRlZmVycmVkKGNhbGxiYWNrKTtcbiAgICBjYWxsYmFjayhlcnIpO1xuICB9XG59O1xuXG4vKipcbiAqIFJlbW92ZXMgYSBjbGFzcyB0byBhIHtAbGluayBtb2R1bGU6c2VhbWxlc3NwYXktd2ViL2hvc3RlZC1maWVsZHN+ZmllbGQgZmllbGR9LiBVc2VmdWwgZm9yIHVwZGF0aW5nIGZpZWxkIHN0eWxlcyB3aGVuIGV2ZW50cyBvY2N1ciBlbHNld2hlcmUgaW4geW91ciBjaGVja291dC5cbiAqIEBwdWJsaWNcbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWVsZCBUaGUgZmllbGQgeW91IHdpc2ggdG8gcmVtb3ZlIGEgY2xhc3MgZnJvbS4gTXVzdCBiZSBhIHZhbGlkIHtAbGluayBtb2R1bGU6c2VhbWxlc3NwYXktd2ViL2hvc3RlZC1maWVsZHN+ZmllbGRPcHRpb25zIGZpZWxkT3B0aW9ufS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc25hbWUgVGhlIGNsYXNzIHRvIGJlIHJlbW92ZWQuXG4gKiBAcGFyYW0ge2NhbGxiYWNrfSBbY2FsbGJhY2tdIENhbGxiYWNrIGV4ZWN1dGVkIG9uIGNvbXBsZXRpb24sIGNvbnRhaW5pbmcgYW4gZXJyb3IgaWYgb25lIG9jY3VycmVkLiBObyBkYXRhIGlzIHJldHVybmVkIGlmIHRoZSBjbGFzcyBpcyByZW1vdmVkIHN1Y2Nlc3NmdWxseS5cbiAqXG4gKiBAZXhhbXBsZVxuICogaG9zdGVkRmllbGRzSW5zdGFuY2UuYWRkQ2xhc3MoJ251bWJlcicsICdjdXN0b20tY2xhc3MnLCBmdW5jdGlvbiAoYWRkQ2xhc3NFcnIpIHtcbiAqICAgaWYgKGFkZENsYXNzRXJyKSB7XG4gKiAgICAgY29uc29sZS5lcnJvcihhZGRDbGFzc0Vycik7XG4gKiAgICAgcmV0dXJuO1xuICogICB9XG4gKlxuICogICAvLyBzb21lIHRpbWUgbGF0ZXIuLi5cbiAqICAgaG9zdGVkRmllbGRzSW5zdGFuY2UucmVtb3ZlQ2xhc3MoJ251bWJlcicsICdjdXN0b20tY2xhc3MnKTtcbiAqIH0pO1xuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbkhvc3RlZEZpZWxkcy5wcm90b3R5cGUucmVtb3ZlQ2xhc3MgPSBmdW5jdGlvbiAoZmllbGQsIGNsYXNzbmFtZSwgY2FsbGJhY2spIHtcbiAgdmFyIGVycjtcblxuICBpZiAoIXRoaXMuZ2V0V2hpdGVsaXN0ZWRGaWVsZHMoKS5oYXNPd25Qcm9wZXJ0eShmaWVsZCkpIHtcbiAgICBlcnIgPSBuZXcgU2VhbWxlc3NwYXlFcnJvcih7XG4gICAgICB0eXBlOiBlcnJvcnMuSE9TVEVEX0ZJRUxEU19GSUVMRF9JTlZBTElELnR5cGUsXG4gICAgICBjb2RlOiBlcnJvcnMuSE9TVEVEX0ZJRUxEU19GSUVMRF9JTlZBTElELmNvZGUsXG4gICAgICBtZXNzYWdlOiAnXCInICsgZmllbGQgKyAnXCIgaXMgbm90IGEgdmFsaWQgZmllbGQuIFlvdSBtdXN0IHVzZSBhIHZhbGlkIGZpZWxkIG9wdGlvbiB3aGVuIHJlbW92aW5nIGEgY2xhc3MuJ1xuICAgIH0pO1xuICB9IGVsc2UgaWYgKCF0aGlzLl9maWVsZHMuaGFzT3duUHJvcGVydHkoZmllbGQpKSB7XG4gICAgZXJyID0gbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgdHlwZTogZXJyb3JzLkhPU1RFRF9GSUVMRFNfRklFTERfTk9UX1BSRVNFTlQudHlwZSxcbiAgICAgIGNvZGU6IGVycm9ycy5IT1NURURfRklFTERTX0ZJRUxEX05PVF9QUkVTRU5ULmNvZGUsXG4gICAgICBtZXNzYWdlOiAnQ2Fubm90IHJlbW92ZSBjbGFzcyBmcm9tIFwiJyArIGZpZWxkICsgJ1wiIGZpZWxkIGJlY2F1c2UgaXQgaXMgbm90IHBhcnQgb2YgdGhlIGN1cnJlbnQgSG9zdGVkIEZpZWxkcyBvcHRpb25zLidcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLl9idXMuZW1pdChldmVudHMuUkVNT1ZFX0NMQVNTLCBmaWVsZCwgY2xhc3NuYW1lKTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjYWxsYmFjayA9IGRlZmVycmVkKGNhbGxiYWNrKTtcbiAgICBjYWxsYmFjayhlcnIpO1xuICB9XG59O1xuXG4vKipcbiAqIFNldHMgYW4gYXR0cmlidXRlIG9mIGEge0BsaW5rIG1vZHVsZTpzZWFtbGVzc3BheS13ZWIvaG9zdGVkLWZpZWxkc35maWVsZCBmaWVsZH0uXG4gKiBTdXBwb3J0ZWQgYXR0cmlidXRlcyBhcmUgYGFyaWEtaW52YWxpZGAsIGBhcmlhLXJlcXVpcmVkYCwgYGRpc2FibGVkYCwgYW5kIGBwbGFjZWhvbGRlcmAuXG4gKlxuICogQHB1YmxpY1xuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgVGhlIG9wdGlvbnMgZm9yIHRoZSBhdHRyaWJ1dGUgeW91IHdpc2ggdG8gc2V0LlxuICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbnMuZmllbGQgVGhlIGZpZWxkIHRvIHdoaWNoIHlvdSB3aXNoIHRvIGFkZCBhbiBhdHRyaWJ1dGUuIE11c3QgYmUgYSB2YWxpZCB7QGxpbmsgbW9kdWxlOnNlYW1sZXNzcGF5LXdlYi9ob3N0ZWQtZmllbGRzfmZpZWxkT3B0aW9ucyBmaWVsZE9wdGlvbn0uXG4gKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9ucy5hdHRyaWJ1dGUgVGhlIG5hbWUgb2YgdGhlIGF0dHJpYnV0ZSB5b3Ugd2lzaCB0byBhZGQgdG8gdGhlIGZpZWxkLlxuICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbnMudmFsdWUgVGhlIHZhbHVlIGZvciB0aGUgYXR0cmlidXRlLlxuICogQHBhcmFtIHtjYWxsYmFja30gW2NhbGxiYWNrXSBDYWxsYmFjayBleGVjdXRlZCBvbiBjb21wbGV0aW9uLCBjb250YWluaW5nIGFuIGVycm9yIGlmIG9uZSBvY2N1cnJlZC4gTm8gZGF0YSBpcyByZXR1cm5lZCBpZiB0aGUgYXR0cmlidXRlIGlzIHNldCBzdWNjZXNzZnVsbHkuXG4gKlxuICogQGV4YW1wbGUgPGNhcHRpb24+U2V0IHRoZSBwbGFjZWhvbGRlciBhdHRyaWJ1dGUgb2YgYSBmaWVsZDwvY2FwdGlvbj5cbiAqIGhvc3RlZEZpZWxkc0luc3RhbmNlLnNldEF0dHJpYnV0ZSh7XG4gKiAgIGZpZWxkOiAnbnVtYmVyJyxcbiAqICAgYXR0cmlidXRlOiAncGxhY2Vob2xkZXInLFxuICogICB2YWx1ZTogJzExMTEgMTExMSAxMTExIDExMTEnXG4gKiB9LCBmdW5jdGlvbiAoYXR0cmlidXRlRXJyKSB7XG4gKiAgIGlmIChhdHRyaWJ1dGVFcnIpIHtcbiAqICAgICBjb25zb2xlLmVycm9yKGF0dHJpYnV0ZUVycik7XG4gKiAgIH1cbiAqIH0pO1xuICpcbiAqIEBleGFtcGxlIDxjYXB0aW9uPlNldCB0aGUgYXJpYS1yZXF1aXJlZCBhdHRyaWJ1dGUgb2YgYSBmaWVsZDwvY2FwdGlvbj5cbiAqIGhvc3RlZEZpZWxkc0luc3RhbmNlLnNldEF0dHJpYnV0ZSh7XG4gKiAgIGZpZWxkOiAnbnVtYmVyJyxcbiAqICAgYXR0cmlidXRlOiAnYXJpYS1yZXF1aXJlZCcsXG4gKiAgIHZhbHVlOiB0cnVlXG4gKiB9LCBmdW5jdGlvbiAoYXR0cmlidXRlRXJyKSB7XG4gKiAgIGlmIChhdHRyaWJ1dGVFcnIpIHtcbiAqICAgICBjb25zb2xlLmVycm9yKGF0dHJpYnV0ZUVycik7XG4gKiAgIH1cbiAqIH0pO1xuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5Ib3N0ZWRGaWVsZHMucHJvdG90eXBlLnNldEF0dHJpYnV0ZSA9IGZ1bmN0aW9uIChvcHRpb25zLCBjYWxsYmFjaykge1xuICB2YXIgYXR0cmlidXRlRXJyLCBlcnI7XG5cbiAgaWYgKCF0aGlzLmdldFdoaXRlbGlzdGVkRmllbGRzKCkuaGFzT3duUHJvcGVydHkob3B0aW9ucy5maWVsZCkpIHtcbiAgICBlcnIgPSBuZXcgU2VhbWxlc3NwYXlFcnJvcih7XG4gICAgICB0eXBlOiBlcnJvcnMuSE9TVEVEX0ZJRUxEU19GSUVMRF9JTlZBTElELnR5cGUsXG4gICAgICBjb2RlOiBlcnJvcnMuSE9TVEVEX0ZJRUxEU19GSUVMRF9JTlZBTElELmNvZGUsXG4gICAgICBtZXNzYWdlOiAnXCInICsgb3B0aW9ucy5maWVsZCArICdcIiBpcyBub3QgYSB2YWxpZCBmaWVsZC4gWW91IG11c3QgdXNlIGEgdmFsaWQgZmllbGQgb3B0aW9uIHdoZW4gc2V0dGluZyBhbiBhdHRyaWJ1dGUuJ1xuICAgIH0pO1xuICB9IGVsc2UgaWYgKCF0aGlzLl9maWVsZHMuaGFzT3duUHJvcGVydHkob3B0aW9ucy5maWVsZCkpIHtcbiAgICBlcnIgPSBuZXcgU2VhbWxlc3NwYXlFcnJvcih7XG4gICAgICB0eXBlOiBlcnJvcnMuSE9TVEVEX0ZJRUxEU19GSUVMRF9OT1RfUFJFU0VOVC50eXBlLFxuICAgICAgY29kZTogZXJyb3JzLkhPU1RFRF9GSUVMRFNfRklFTERfTk9UX1BSRVNFTlQuY29kZSxcbiAgICAgIG1lc3NhZ2U6ICdDYW5ub3Qgc2V0IGF0dHJpYnV0ZSBmb3IgXCInICsgb3B0aW9ucy5maWVsZCArICdcIiBmaWVsZCBiZWNhdXNlIGl0IGlzIG5vdCBwYXJ0IG9mIHRoZSBjdXJyZW50IEhvc3RlZCBGaWVsZHMgb3B0aW9ucy4nXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgYXR0cmlidXRlRXJyID0gYXR0cmlidXRlVmFsaWRhdGlvbkVycm9yKG9wdGlvbnMuYXR0cmlidXRlLCBvcHRpb25zLnZhbHVlKTtcblxuICAgIGlmIChhdHRyaWJ1dGVFcnIpIHtcbiAgICAgIGVyciA9IGF0dHJpYnV0ZUVycjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fYnVzLmVtaXQoZXZlbnRzLlNFVF9BVFRSSUJVVEUsIG9wdGlvbnMuZmllbGQsIG9wdGlvbnMuYXR0cmlidXRlLCBvcHRpb25zLnZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY2FsbGJhY2sgPSBkZWZlcnJlZChjYWxsYmFjayk7XG4gICAgY2FsbGJhY2soZXJyKTtcbiAgfVxufTtcblxuLyoqXG4gKiBSZW1vdmVzIGEgc3VwcG9ydGVkIGF0dHJpYnV0ZSBmcm9tIGEge0BsaW5rIG1vZHVsZTpzZWFtbGVzc3BheS13ZWIvaG9zdGVkLWZpZWxkc35maWVsZCBmaWVsZH0uXG4gKlxuICogQHB1YmxpY1xuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgVGhlIG9wdGlvbnMgZm9yIHRoZSBhdHRyaWJ1dGUgeW91IHdpc2ggdG8gcmVtb3ZlLlxuICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbnMuZmllbGQgVGhlIGZpZWxkIGZyb20gd2hpY2ggeW91IHdpc2ggdG8gcmVtb3ZlIGFuIGF0dHJpYnV0ZS4gTXVzdCBiZSBhIHZhbGlkIHtAbGluayBtb2R1bGU6c2VhbWxlc3NwYXktd2ViL2hvc3RlZC1maWVsZHN+ZmllbGRPcHRpb25zIGZpZWxkT3B0aW9ufS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLmF0dHJpYnV0ZSBUaGUgbmFtZSBvZiB0aGUgYXR0cmlidXRlIHlvdSB3aXNoIHRvIHJlbW92ZSBmcm9tIHRoZSBmaWVsZC5cbiAqIEBwYXJhbSB7Y2FsbGJhY2t9IFtjYWxsYmFja10gQ2FsbGJhY2sgZXhlY3V0ZWQgb24gY29tcGxldGlvbiwgY29udGFpbmluZyBhbiBlcnJvciBpZiBvbmUgb2NjdXJyZWQuIE5vIGRhdGEgaXMgcmV0dXJuZWQgaWYgdGhlIGF0dHJpYnV0ZSBpcyByZW1vdmVkIHN1Y2Nlc3NmdWxseS5cbiAqXG4gKiBAZXhhbXBsZSA8Y2FwdGlvbj5SZW1vdmUgdGhlIHBsYWNlaG9sZGVyIGF0dHJpYnV0ZSBvZiBhIGZpZWxkPC9jYXB0aW9uPlxuICogaG9zdGVkRmllbGRzSW5zdGFuY2UucmVtb3ZlQXR0cmlidXRlKHtcbiAqICAgZmllbGQ6ICdudW1iZXInLFxuICogICBhdHRyaWJ1dGU6ICdwbGFjZWhvbGRlcidcbiAqIH0sIGZ1bmN0aW9uIChhdHRyaWJ1dGVFcnIpIHtcbiAqICAgaWYgKGF0dHJpYnV0ZUVycikge1xuICogICAgIGNvbnNvbGUuZXJyb3IoYXR0cmlidXRlRXJyKTtcbiAqICAgfVxuICogfSk7XG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbkhvc3RlZEZpZWxkcy5wcm90b3R5cGUucmVtb3ZlQXR0cmlidXRlID0gZnVuY3Rpb24gKG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIHZhciBhdHRyaWJ1dGVFcnIsIGVycjtcblxuICBpZiAoIXRoaXMuZ2V0V2hpdGVsaXN0ZWRGaWVsZHMoKS5oYXNPd25Qcm9wZXJ0eShvcHRpb25zLmZpZWxkKSkge1xuICAgIGVyciA9IG5ldyBTZWFtbGVzc3BheUVycm9yKHtcbiAgICAgIHR5cGU6IGVycm9ycy5IT1NURURfRklFTERTX0ZJRUxEX0lOVkFMSUQudHlwZSxcbiAgICAgIGNvZGU6IGVycm9ycy5IT1NURURfRklFTERTX0ZJRUxEX0lOVkFMSUQuY29kZSxcbiAgICAgIG1lc3NhZ2U6ICdcIicgKyBvcHRpb25zLmZpZWxkICsgJ1wiIGlzIG5vdCBhIHZhbGlkIGZpZWxkLiBZb3UgbXVzdCB1c2UgYSB2YWxpZCBmaWVsZCBvcHRpb24gd2hlbiByZW1vdmluZyBhbiBhdHRyaWJ1dGUuJ1xuICAgIH0pO1xuICB9IGVsc2UgaWYgKCF0aGlzLl9maWVsZHMuaGFzT3duUHJvcGVydHkob3B0aW9ucy5maWVsZCkpIHtcbiAgICBlcnIgPSBuZXcgU2VhbWxlc3NwYXlFcnJvcih7XG4gICAgICB0eXBlOiBlcnJvcnMuSE9TVEVEX0ZJRUxEU19GSUVMRF9OT1RfUFJFU0VOVC50eXBlLFxuICAgICAgY29kZTogZXJyb3JzLkhPU1RFRF9GSUVMRFNfRklFTERfTk9UX1BSRVNFTlQuY29kZSxcbiAgICAgIG1lc3NhZ2U6ICdDYW5ub3QgcmVtb3ZlIGF0dHJpYnV0ZSBmb3IgXCInICsgb3B0aW9ucy5maWVsZCArICdcIiBmaWVsZCBiZWNhdXNlIGl0IGlzIG5vdCBwYXJ0IG9mIHRoZSBjdXJyZW50IEhvc3RlZCBGaWVsZHMgb3B0aW9ucy4nXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgYXR0cmlidXRlRXJyID0gYXR0cmlidXRlVmFsaWRhdGlvbkVycm9yKG9wdGlvbnMuYXR0cmlidXRlKTtcblxuICAgIGlmIChhdHRyaWJ1dGVFcnIpIHtcbiAgICAgIGVyciA9IGF0dHJpYnV0ZUVycjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fYnVzLmVtaXQoZXZlbnRzLlJFTU9WRV9BVFRSSUJVVEUsIG9wdGlvbnMuZmllbGQsIG9wdGlvbnMuYXR0cmlidXRlKTtcbiAgICB9XG4gIH1cblxuICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY2FsbGJhY2sgPSBkZWZlcnJlZChjYWxsYmFjayk7XG4gICAgY2FsbGJhY2soZXJyKTtcbiAgfVxufTtcblxuLyoqXG4gKiBAZGVwcmVjYXRlZCBzaW5jZSB2ZXJzaW9uIDMuOC4wLiBVc2Uge0BsaW5rIEhvc3RlZEZpZWxkcyNzZXRBdHRyaWJ1dGV8c2V0QXR0cmlidXRlfSBpbnN0ZWFkLlxuICpcbiAqIEBwdWJsaWNcbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWVsZCBUaGUgZmllbGQgd2hvc2UgcGxhY2Vob2xkZXIgeW91IHdpc2ggdG8gY2hhbmdlLiBNdXN0IGJlIGEgdmFsaWQge0BsaW5rIG1vZHVsZTpzZWFtbGVzc3BheS13ZWIvaG9zdGVkLWZpZWxkc35maWVsZE9wdGlvbnMgZmllbGRPcHRpb259LlxuICogQHBhcmFtIHtzdHJpbmd9IHBsYWNlaG9sZGVyIFdpbGwgYmUgdXNlZCBhcyB0aGUgYHBsYWNlaG9sZGVyYCBhdHRyaWJ1dGUgb2YgdGhlIGlucHV0LlxuICogQHBhcmFtIHtjYWxsYmFja30gW2NhbGxiYWNrXSBDYWxsYmFjayBleGVjdXRlZCBvbiBjb21wbGV0aW9uLCBjb250YWluaW5nIGFuIGVycm9yIGlmIG9uZSBvY2N1cnJlZC4gTm8gZGF0YSBpcyByZXR1cm5lZCBpZiB0aGUgcGxhY2Vob2xkZXIgdXBkYXRlZCBzdWNjZXNzZnVsbHkuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbkhvc3RlZEZpZWxkcy5wcm90b3R5cGUuc2V0UGxhY2Vob2xkZXIgPSBmdW5jdGlvbiAoZmllbGQsIHBsYWNlaG9sZGVyLCBjYWxsYmFjaykge1xuICB0aGlzLnNldEF0dHJpYnV0ZSh7XG4gICAgZmllbGQ6IGZpZWxkLFxuICAgIGF0dHJpYnV0ZTogJ3BsYWNlaG9sZGVyJyxcbiAgICB2YWx1ZTogcGxhY2Vob2xkZXJcbiAgfSwgY2FsbGJhY2spO1xufTtcblxuLyoqXG4gKiBDbGVhciB0aGUgdmFsdWUgb2YgYSB7QGxpbmsgbW9kdWxlOnNlYW1sZXNzcGF5LXdlYi9ob3N0ZWQtZmllbGRzfmZpZWxkIGZpZWxkfS5cbiAqIEBwdWJsaWNcbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWVsZCBUaGUgZmllbGQgd2hvc2UgcGxhY2Vob2xkZXIgeW91IHdpc2ggdG8gY2xlYXIuIE11c3QgYmUgYSB2YWxpZCB7QGxpbmsgbW9kdWxlOnNlYW1sZXNzcGF5LXdlYi9ob3N0ZWQtZmllbGRzfmZpZWxkT3B0aW9ucyBmaWVsZE9wdGlvbn0uXG4gKiBAcGFyYW0ge2NhbGxiYWNrfSBbY2FsbGJhY2tdIENhbGxiYWNrIGV4ZWN1dGVkIG9uIGNvbXBsZXRpb24sIGNvbnRhaW5pbmcgYW4gZXJyb3IgaWYgb25lIG9jY3VycmVkLiBObyBkYXRhIGlzIHJldHVybmVkIGlmIHRoZSBmaWVsZCBjbGVhcmVkIHN1Y2Nlc3NmdWxseS5cbiAqIEByZXR1cm5zIHt2b2lkfVxuICogQGV4YW1wbGVcbiAqIGhvc3RlZEZpZWxkc0luc3RhbmNlLmNsZWFyKCdudW1iZXInLCBmdW5jdGlvbiAoY2xlYXJFcnIpIHtcbiAqICAgaWYgKGNsZWFyRXJyKSB7XG4gKiAgICAgY29uc29sZS5lcnJvcihjbGVhckVycik7XG4gKiAgIH1cbiAqIH0pO1xuICpcbiAqIEBleGFtcGxlIDxjYXB0aW9uPkNsZWFyIHNldmVyYWwgZmllbGRzPC9jYXB0aW9uPlxuICogaG9zdGVkRmllbGRzSW5zdGFuY2UuY2xlYXIoJ251bWJlcicpO1xuICogaG9zdGVkRmllbGRzSW5zdGFuY2UuY2xlYXIoJ2N2dicpO1xuICogaG9zdGVkRmllbGRzSW5zdGFuY2UuY2xlYXIoJ2V4cGlyYXRpb25EYXRlJyk7XG4gKi9cbkhvc3RlZEZpZWxkcy5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoZmllbGQsIGNhbGxiYWNrKSB7XG4gIHZhciBlcnI7XG5cbiAgaWYgKCF0aGlzLmdldFdoaXRlbGlzdGVkRmllbGRzKCkuaGFzT3duUHJvcGVydHkoZmllbGQpKSB7XG4gICAgZXJyID0gbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgdHlwZTogZXJyb3JzLkhPU1RFRF9GSUVMRFNfRklFTERfSU5WQUxJRC50eXBlLFxuICAgICAgY29kZTogZXJyb3JzLkhPU1RFRF9GSUVMRFNfRklFTERfSU5WQUxJRC5jb2RlLFxuICAgICAgbWVzc2FnZTogJ1wiJyArIGZpZWxkICsgJ1wiIGlzIG5vdCBhIHZhbGlkIGZpZWxkLiBZb3UgbXVzdCB1c2UgYSB2YWxpZCBmaWVsZCBvcHRpb24gd2hlbiBjbGVhcmluZyBhIGZpZWxkLidcbiAgICB9KTtcbiAgfSBlbHNlIGlmICghdGhpcy5fZmllbGRzLmhhc093blByb3BlcnR5KGZpZWxkKSkge1xuICAgIGVyciA9IG5ldyBTZWFtbGVzc3BheUVycm9yKHtcbiAgICAgIHR5cGU6IGVycm9ycy5IT1NURURfRklFTERTX0ZJRUxEX05PVF9QUkVTRU5ULnR5cGUsXG4gICAgICBjb2RlOiBlcnJvcnMuSE9TVEVEX0ZJRUxEU19GSUVMRF9OT1RfUFJFU0VOVC5jb2RlLFxuICAgICAgbWVzc2FnZTogJ0Nhbm5vdCBjbGVhciBcIicgKyBmaWVsZCArICdcIiBmaWVsZCBiZWNhdXNlIGl0IGlzIG5vdCBwYXJ0IG9mIHRoZSBjdXJyZW50IEhvc3RlZCBGaWVsZHMgb3B0aW9ucy4nXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5fYnVzLmVtaXQoZXZlbnRzLkNMRUFSX0ZJRUxELCBmaWVsZCk7XG4gIH1cblxuICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY2FsbGJhY2sgPSBkZWZlcnJlZChjYWxsYmFjayk7XG4gICAgY2FsbGJhY2soZXJyKTtcbiAgfVxufTtcblxuLyoqXG4gKiBGaWxsIGZvcm0gZmllbGRzIHdpdGggdG9rZW4gZGF0YS5cbiAqIEBwdWJsaWNcbiAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc10gT3B0aW9ucyBmb3IgdGhlIEhvc3RlZCBGaWVsZHMgY29tcG9uZW50LlxuICogQHJldHVybnMge1Byb21pc2V9IFJldHVybnMgYSBwcm9taXNlLlxuICogQGV4YW1wbGVcbiAqIGhvc3RlZEZpZWxkc0luc3RhbmNlLnBvcHVsYXRlVG9rZW4oeyB0b2tlbjogJ1RLTl9BQkNERUZHSElKS0xNTk9QMTIzNDU2NycgfSk7XG4gKi9cbkhvc3RlZEZpZWxkcy5wcm90b3R5cGUucG9wdWxhdGVUb2tlbiA9IHdyYXBQcm9taXNlKFxuICBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIHZhciBzZWxmID0gdGhpczsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1pbnZhbGlkLXRoaXNcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgICAgc2VsZi5fYnVzLmVtaXQoZXZlbnRzLlBPUFVMQVRFX1RPS0VOLCBvcHRpb25zLCBmdW5jdGlvbiAocmVzdWx0KSB7IC8vIFRPRE86IGltcGxlbWVudCBpbnRlcm5hbCBwYXJ0XG4gICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4pO1xuXG4vKipcbiAqIFJldHVybnMgYW4ge0BsaW5rIEhvc3RlZEZpZWxkc35zdGF0ZU9iamVjdHxvYmplY3R9IHRoYXQgaW5jbHVkZXMgdGhlIHN0YXRlIG9mIGFsbCBmaWVsZHMgYW5kIHBvc3NpYmxlIGNhcmQgdHlwZXMuXG4gKiBAcHVibGljXG4gKiBAcmV0dXJucyB7b2JqZWN0fSB7QGxpbmsgSG9zdGVkRmllbGRzfnN0YXRlT2JqZWN0fHN0YXRlT2JqZWN0fVxuICogQGV4YW1wbGUgPGNhcHRpb24+Q2hlY2sgaWYgYWxsIGZpZWxkcyBhcmUgdmFsaWQ8L2NhcHRpb24+XG4gKiB2YXIgc3RhdGUgPSBob3N0ZWRGaWVsZHMuZ2V0U3RhdGUoKTtcbiAqXG4gKiB2YXIgZm9ybVZhbGlkID0gT2JqZWN0LmtleXMoc3RhdGUuZmllbGRzKS5ldmVyeShmdW5jdGlvbiAoa2V5KSB7XG4gKiAgIHJldHVybiBzdGF0ZS5maWVsZHNba2V5XS5pc1ZhbGlkO1xuICogfSk7XG4gKi9cbkhvc3RlZEZpZWxkcy5wcm90b3R5cGUuZ2V0U3RhdGUgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLl9zdGF0ZTtcbn07XG5cbi8qKlxuICogUmV0dXJucyBhIGJvb2xlYW4gaW5kaWNhdGluZyB3aGV0aGVyIG9yIG5vdCB0aGUgZm9ybSBpcyB2YWxpZC5cbiAqIEBwdWJsaWNcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIGFsbCBmaWVsZHMgYXJlIHZhbGlkLCBmYWxzZSBvdGhlcndpc2UuXG4gKiBAZXhhbXBsZVxuICogdmFyIGZvcm1WYWxpZCA9IGhvc3RlZEZpZWxkc0luc3RhbmNlLmlzRm9ybVZhbGlkKCk7XG4gKi9cbkhvc3RlZEZpZWxkcy5wcm90b3R5cGUuaXNGb3JtVmFsaWQgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgcmV0dXJuIE9iamVjdC5rZXlzKHNlbGYuX3N0YXRlLmZpZWxkcykuZXZlcnkoZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiBzZWxmLl9zdGF0ZS5maWVsZHNba2V5XS5pc1ZhbGlkO1xuICB9KTtcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IEhvc3RlZEZpZWxkcztcbiIsIlxuZnVuY3Rpb24gZm9ybWF0VG9rZW5pemVSZXNwb25zZShwYXlsb2FkKSB7XG4gIGlmICghKHBheWxvYWQgaW5zdGFuY2VvZiBPYmplY3QpKSByZXR1cm4gcGF5bG9hZFxuXG4gIHZhciB7XG4gICAgZXhwRGF0ZSxcbiAgICBsYXN0Rm91cixcbiAgICBuYW1lLFxuICAgIHBheW1lbnROZXR3b3JrLFxuICAgIHRva2VuOiBwYXltZW50VG9rZW4sXG4gIH0gPSBwYXlsb2FkO1xuXG4gIHJldHVybiB7XG4gICAgcGF5bWVudFRva2VuLFxuICAgIGRldGFpbHM6IHtcbiAgICAgIGV4cERhdGUsXG4gICAgICBsYXN0Rm91cixcbiAgICAgIG5hbWUsXG4gICAgICBwYXltZW50TmV0d29yayxcbiAgICB9XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBmb3JtYXRUb2tlbml6ZVJlc3BvbnNlXG59XG4iLCIndXNlIHN0cmljdCc7XG4vKiogQG1vZHVsZSBzZWFtbGVzc3BheS13ZWIvaG9zdGVkLWZpZWxkcyAqL1xuXG52YXIgSG9zdGVkRmllbGRzID0gcmVxdWlyZSgnLi9leHRlcm5hbC9ob3N0ZWQtZmllbGRzJyk7XG52YXIgd3JhcFByb21pc2UgPSByZXF1aXJlKCdAYnJhaW50cmVlL3dyYXAtcHJvbWlzZScpO1xudmFyIFByb21pc2UgPSByZXF1aXJlKCcuLi9saWIvcHJvbWlzZScpO1xuXG52YXIgVkVSU0lPTiA9IFwid2ViLXNka1wiO1xuXG4vKipcbiAqIEZpZWxkcyB1c2VkIGluIHtAbGluayBtb2R1bGU6c2VhbWxlc3NwYXktd2ViL2hvc3RlZC1maWVsZHN+ZmllbGRPcHRpb25zIGZpZWxkcyBvcHRpb25zfVxuICogQHR5cGVkZWYge29iamVjdH0gZmllbGRcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBzZWxlY3RvciBBIENTUyBzZWxlY3RvciB0byBmaW5kIHRoZSBjb250YWluZXIgd2hlcmUgdGhlIGhvc3RlZCBmaWVsZCB3aWxsIGJlIGluc2VydGVkLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtwbGFjZWhvbGRlcl0gV2lsbCBiZSB1c2VkIGFzIHRoZSBgcGxhY2Vob2xkZXJgIGF0dHJpYnV0ZSBvZiB0aGUgaW5wdXQuIElmIGBwbGFjZWhvbGRlcmAgaXMgbm90IG5hdGl2ZWx5IHN1cHBvcnRlZCBieSB0aGUgYnJvd3NlciwgaXQgd2lsbCBiZSBwb2x5ZmlsbGVkLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IFt0eXBlXSBXaWxsIGJlIHVzZWQgYXMgdGhlIGB0eXBlYCBhdHRyaWJ1dGUgb2YgdGhlIGlucHV0LiBUbyBtYXNrIGBjdnZgIGlucHV0LCBmb3IgaW5zdGFuY2UsIGB0eXBlOiBcInBhc3N3b3JkXCJgIGNhbiBiZSB1c2VkLlxuICogQHByb3BlcnR5IHtib29sZWFufSBbZm9ybWF0SW5wdXQ9dHJ1ZV0gRW5hYmxlIG9yIGRpc2FibGUgYXV0b21hdGljIGZvcm1hdHRpbmcgb24gdGhpcyBmaWVsZC5cbiAqIEBwcm9wZXJ0eSB7b2JqZWN0fGJvb2xlYW59IFtzZWxlY3RdIElmIHRydXRoeSwgdGhpcyBmaWVsZCBiZWNvbWVzIGEgYDxzZWxlY3Q+YCBkcm9wZG93biBsaXN0LiBUaGlzIGNhbiBvbmx5IGJlIHVzZWQgZm9yIGBleHBpcmF0aW9uTW9udGhgIGFuZCBgZXhwaXJhdGlvblllYXJgIGZpZWxkcy5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nW119IFtzZWxlY3Qub3B0aW9uc10gQW4gYXJyYXkgb2YgMTIgc3RyaW5ncywgb25lIHBlciBtb250aC4gVGhpcyBjYW4gb25seSBiZSB1c2VkIGZvciB0aGUgYGV4cGlyYXRpb25Nb250aGAgZmllbGQuIEZvciBleGFtcGxlLCB0aGUgYXJyYXkgY2FuIGxvb2sgbGlrZSBgWycwMSAtIEphbnVhcnknLCAnMDIgLSBGZWJydWFyeScsIC4uLl1gLlxuICovXG5cbi8qKlxuICogQW4gb2JqZWN0IHRoYXQgaGFzIHtAbGluayBtb2R1bGU6c2VhbWxlc3NwYXktd2ViL2hvc3RlZC1maWVsZHN+ZmllbGQgZmllbGQgb2JqZWN0c30gZm9yIGVhY2ggZmllbGQuIFVzZWQgaW4ge0BsaW5rIG1vZHVsZTpzZWFtbGVzc3BheS13ZWIvaG9zdGVkLWZpZWxkc35jcmVhdGUgY3JlYXRlfS5cbiAqIEB0eXBlZGVmIHtvYmplY3R9IGZpZWxkT3B0aW9uc1xuICogQHByb3BlcnR5IHtmaWVsZH0gW251bWJlcl0gQSBmaWVsZCBmb3IgY2FyZCBudW1iZXIuXG4gKiBAcHJvcGVydHkge2ZpZWxkfSBbZXhwaXJhdGlvbkRhdGVdIEEgZmllbGQgZm9yIGV4cGlyYXRpb24gZGF0ZSBpbiBgTU0vWVlZWWAgZm9ybWF0LiBUaGlzIHNob3VsZCBub3QgYmUgdXNlZCB3aXRoIHRoZSBgZXhwaXJhdGlvbk1vbnRoYCBhbmQgYGV4cGlyYXRpb25ZZWFyYCBwcm9wZXJ0aWVzLlxuICogQHByb3BlcnR5IHtmaWVsZH0gW2V4cGlyYXRpb25Nb250aF0gQSBmaWVsZCBmb3IgZXhwaXJhdGlvbiBtb250aCBpbiBgTU1gIGZvcm1hdC4gVGhpcyBzaG91bGQgYmUgdXNlZCB3aXRoIHRoZSBgZXhwaXJhdGlvblllYXJgIHByb3BlcnR5LlxuICogQHByb3BlcnR5IHtmaWVsZH0gW2V4cGlyYXRpb25ZZWFyXSBBIGZpZWxkIGZvciBleHBpcmF0aW9uIHllYXIgaW4gYFlZWVlgIGZvcm1hdC4gVGhpcyBzaG91bGQgYmUgdXNlZCB3aXRoIHRoZSBgZXhwaXJhdGlvbk1vbnRoYCBwcm9wZXJ0eS5cbiAqIEBwcm9wZXJ0eSB7ZmllbGR9IFtjdnZdIEEgZmllbGQgZm9yIDMgb3IgNCBkaWdpdCBDVlYgb3IgQ0lELlxuICogQHByb3BlcnR5IHtmaWVsZH0gW3Bvc3RhbENvZGVdIEEgZmllbGQgZm9yIHBvc3RhbCBvciByZWdpb24gY29kZS5cbiAqL1xuXG4vKipcbiAqIEFuIG9iamVjdCB0aGF0IHJlcHJlc2VudHMgQ1NTIHRoYXQgd2lsbCBiZSBhcHBsaWVkIGluIGVhY2ggaG9zdGVkIGZpZWxkLiBUaGlzIG9iamVjdCBsb29rcyBzaW1pbGFyIHRvIENTUy4gVHlwaWNhbGx5LCB0aGVzZSBzdHlsZXMgaW52b2x2ZSBmb250cyAoc3VjaCBhcyBgZm9udC1mYW1pbHlgIG9yIGBjb2xvcmApLlxuICpcbiAqIFRoZXNlIGFyZSB0aGUgQ1NTIHByb3BlcnRpZXMgdGhhdCBIb3N0ZWQgRmllbGRzIHN1cHBvcnRzLiBBbnkgb3RoZXIgQ1NTIHNob3VsZCBiZSBzcGVjaWZpZWQgb24geW91ciBwYWdlIGFuZCBvdXRzaWRlIG9mIGFueSBTZWFtbGVzc3BheSBjb25maWd1cmF0aW9uLiBUcnlpbmcgdG8gc2V0IHVuc3VwcG9ydGVkIHByb3BlcnRpZXMgd2lsbCBmYWlsIGFuZCBwdXQgYSB3YXJuaW5nIGluIHRoZSBjb25zb2xlLlxuICpcbiAqIFN1cHBvcnRlZCBDU1MgcHJvcGVydGllcyBhcmU6XG4gKiBgY29sb3JgXG4gKiBgZGlyZWN0aW9uYFxuICogYGZvbnQtZmFtaWx5YFxuICogYGZvbnQtc2l6ZS1hZGp1c3RgXG4gKiBgZm9udC1zaXplYFxuICogYGZvbnQtc3RyZXRjaGBcbiAqIGBmb250LXN0eWxlYFxuICogYGZvbnQtdmFyaWFudC1hbHRlcm5hdGVzYFxuICogYGZvbnQtdmFyaWFudC1jYXBzYFxuICogYGZvbnQtdmFyaWFudC1lYXN0LWFzaWFuYFxuICogYGZvbnQtdmFyaWFudC1saWdhdHVyZXNgXG4gKiBgZm9udC12YXJpYW50LW51bWVyaWNgXG4gKiBgZm9udC12YXJpYW50YFxuICogYGZvbnQtd2VpZ2h0YFxuICogYGZvbnRgXG4gKiBgbGV0dGVyLXNwYWNpbmdgXG4gKiBgbGluZS1oZWlnaHRgXG4gKiBgb3BhY2l0eWBcbiAqIGBvdXRsaW5lYFxuICogYHRleHQtc2hhZG93YFxuICogYHRyYW5zaXRpb25gXG4gKiBgLW1vei1vc3gtZm9udC1zbW9vdGhpbmdgXG4gKiBgLW1vei10YXAtaGlnaGxpZ2h0LWNvbG9yYFxuICogYC1tb3otdHJhbnNpdGlvbmBcbiAqIGAtd2Via2l0LWZvbnQtc21vb3RoaW5nYFxuICogYC13ZWJraXQtdGFwLWhpZ2hsaWdodC1jb2xvcmBcbiAqIGAtd2Via2l0LXRyYW5zaXRpb25gXG4gKiBAdHlwZWRlZiB7b2JqZWN0fSBzdHlsZU9wdGlvbnNcbiAqL1xuXG4vKipcbiAqIEBzdGF0aWNcbiAqIEBmdW5jdGlvbiBjcmVhdGVcbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIENyZWF0aW9uIG9wdGlvbnM6XG4gKiBAcGFyYW0ge0NsaWVudH0gb3B0aW9ucy5jbGllbnQgQSB7QGxpbmsgQ2xpZW50fSBpbnN0YW5jZS5cbiAqIEBwYXJhbSB7ZmllbGRPcHRpb25zfSBvcHRpb25zLmZpZWxkcyBBIHtAbGluayBtb2R1bGU6c2VhbWxlc3NwYXktd2ViL2hvc3RlZC1maWVsZHN+ZmllbGRPcHRpb25zIHNldCBvZiBvcHRpb25zIGZvciBlYWNoIGZpZWxkfS5cbiAqIEBwYXJhbSB7c3R5bGVPcHRpb25zfSBvcHRpb25zLnN0eWxlcyB7QGxpbmsgbW9kdWxlOnNlYW1sZXNzcGF5LXdlYi9ob3N0ZWQtZmllbGRzfnN0eWxlT3B0aW9ucyBTdHlsZXN9IGFwcGxpZWQgdG8gZWFjaCBmaWVsZC5cbiAqIEBwYXJhbSB7Y2FsbGJhY2t9IFtjYWxsYmFja10gVGhlIHNlY29uZCBhcmd1bWVudCwgYGRhdGFgLCBpcyB0aGUge0BsaW5rIEhvc3RlZEZpZWxkc30gaW5zdGFuY2UuIElmIG5vIGNhbGxiYWNrIGlzIHByb3ZpZGVkLCBgY3JlYXRlYCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdpdGggdGhlIHtAbGluayBIb3N0ZWRGaWVsZHN9IGluc3RhbmNlLlxuICogQHJldHVybnMge3ZvaWR9XG4gKiBAZXhhbXBsZVxuICogc2VhbWxlc3NwYXkuaG9zdGVkRmllbGRzLmNyZWF0ZSh7XG4gKiAgIHBheW1lbnRUeXBlOiAnQ1JFRElUJyxcbiAqICAgY2xpZW50OiBjbGllbnRJbnN0YW5jZSxcbiAqICAgc3R5bGVzOiB7XG4gKiAgICAgJ2lucHV0Jzoge1xuICogICAgICAgJ2ZvbnQtc2l6ZSc6ICcxNnB0JyxcbiAqICAgICAgICdjb2xvcic6ICcjM0EzQTNBJ1xuICogICAgIH0sXG4gKiAgICAgJy5udW1iZXInOiB7XG4gKiAgICAgICAnZm9udC1mYW1pbHknOiAnbW9ub3NwYWNlJ1xuICogICAgIH0sXG4gKiAgICAgJy52YWxpZCc6IHtcbiAqICAgICAgICdjb2xvcic6ICdncmVlbidcbiAqICAgICB9XG4gKiAgIH0sXG4gKiAgIGZpZWxkczoge1xuICogICAgIGFjY291bnROdW1iZXI6IHtcbiAqICAgICAgIHNlbGVjdG9yOiAnI2FjY291bnQtbnVtYmVyJ1xuICogICAgIH0sXG4gKiAgICAgY3Z2OiB7XG4gKiAgICAgICBzZWxlY3RvcjogJyNjdnYnLFxuICogICAgICAgcGxhY2Vob2xkZXI6ICfigKLigKLigKInXG4gKiAgICAgfSxcbiAqICAgICBleHBEYXRlOiB7XG4gKiAgICAgICBzZWxlY3RvcjogJyNleHAtZGF0ZScsXG4gKiAgICAgICB0eXBlOiAnbW9udGgnXG4gKiAgICAgfVxuICogICB9XG4gKiB9LCBjYWxsYmFjayk7XG4gKiBAZXhhbXBsZSA8Y2FwdGlvbj5SaWdodCB0byBMZWZ0IExhbmd1YWdlIFN1cHBvcnQ8L2NhcHRpb24+XG4gKiBzZWFtbGVzc3BheS5ob3N0ZWRGaWVsZHMuY3JlYXRlKHtcbiAqICAgcGF5bWVudFR5cGU6ICdDUkVESVQnLFxuICogICBjbGllbnQ6IGNsaWVudEluc3RhbmNlLFxuICogICBzdHlsZXM6IHtcbiAqICAgICAnaW5wdXQnOiB7XG4gKiAgICAgICAvLyBvdGhlciBzdHlsZXNcbiAqICAgICAgIGRpcmVjdGlvbjogJ3J0bCdcbiAqICAgICB9LFxuICogICB9LFxuICogICBmaWVsZHM6IHtcbiAqICAgICBhY2NvdW50TnVtYmVyOiB7XG4gKiAgICAgICBzZWxlY3RvcjogJyNhY2NvdW50LW51bWJlcicsXG4gKiAgICAgICAvLyBDcmVkaXQgY2FyZCBmb3JtYXR0aW5nIGlzIG5vdCBjdXJyZW50bHkgc3VwcG9ydGVkXG4gKiAgICAgICAvLyB3aXRoIFJUTCBsYW5ndWFnZXMsIHNvIHdlIG5lZWQgdG8gdHVybiBpdCBvZmYgZm9yIHRoZSBudW1iZXIgaW5wdXRcbiAqICAgICAgIGZvcm1hdElucHV0OiBmYWxzZVxuICogICAgIH0sXG4gKiAgICAgY3Z2OiB7XG4gKiAgICAgICBzZWxlY3RvcjogJyNjdnYnLFxuICogICAgICAgcGxhY2Vob2xkZXI6ICfigKLigKLigKInXG4gKiAgICAgfSxcbiAqICAgICBleHBEYXRlOiB7XG4gKiAgICAgICBzZWxlY3RvcjogJyNleHAtZGF0ZScsXG4gKiAgICAgICB0eXBlOiAnbW9udGgnXG4gKiAgICAgfVxuICogICB9XG4gKiB9LCBjYWxsYmFjayk7XG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZShvcHRpb25zKSB7XG4gIHZhciBpbnRlZ3JhdGlvbjtcbiAgdmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdHJ5IHtcbiAgICAgIGludGVncmF0aW9uID0gbmV3IEhvc3RlZEZpZWxkcyhvcHRpb25zKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIHJlamVjdChlcnJvcik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGludGVncmF0aW9uLm9uKCdyZWFkeScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJlc29sdmUoaW50ZWdyYXRpb24pO1xuICAgIH0pO1xuICB9KTtcblxuICByZXR1cm4gcHJvbWlzZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNyZWF0ZTogd3JhcFByb21pc2UoY3JlYXRlKSxcbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBUaGUgY3VycmVudCB2ZXJzaW9uIG9mIHRoZSBTREssIGkuZS4gYHtAcGtnIHZlcnNpb259YC5cbiAgICogQHR5cGUge3N0cmluZ31cbiAgICovXG4gIFZFUlNJT046IFZFUlNJT05cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjb25zdGFudHMgPSByZXF1aXJlKCcuL2NvbnN0YW50cycpO1xuXG5mdW5jdGlvbiBnZXRNYXhMZW5ndGgocGF5bWVudFR5cGUsIG5hbWUpIHtcbiAgcGF5bWVudFR5cGUgPSBwYXltZW50VHlwZSB8fCBjb25zdGFudHMucGF5bWVudFR5cGVzLlBBWU1FTlRfVFlQRV9DUkVESVQ7XG4gIHJldHVybiAobmFtZSAmJiBjb25zdGFudHMud2hpdGVsaXN0ZWRGaWVsZHNbcGF5bWVudFR5cGVdW25hbWVdLmRlZmF1bHRNYXhMZW5ndGgpIHx8IG51bGw7XG59XG5cbmZ1bmN0aW9uIGdldFdoaXRlbGlzdGVkRmllbGRzKHBheW1lbnRUeXBlKSB7XG4gIHBheW1lbnRUeXBlID0gcGF5bWVudFR5cGUgfHwgY29uc3RhbnRzLnBheW1lbnRUeXBlcy5QQVlNRU5UX1RZUEVfQ1JFRElUO1xuICByZXR1cm4gY29uc3RhbnRzLndoaXRlbGlzdGVkRmllbGRzW3BheW1lbnRUeXBlXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGdldFdoaXRlbGlzdGVkRmllbGRzOiBnZXRXaGl0ZWxpc3RlZEZpZWxkcyxcbiAgZ2V0TWF4TGVuZ3RoOiBnZXRNYXhMZW5ndGhcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vKiBlc2xpbnQtZGlzYWJsZSBuby1yZXNlcnZlZC1rZXlzICovXG5cbnZhciBlbnVtZXJhdGUgPSByZXF1aXJlKCcuLi8uLi9saWIvZW51bWVyYXRlJyk7XG52YXIgVkVSU0lPTiA9IFwid2ViLXNka1wiO1xuXG52YXIgcGF5bWVudFR5cGVzID0ge1xuICBQQVlNRU5UX1RZUEVfQ1JFRElUOiAnY3JlZGl0X2NhcmQnLFxuICBQQVlNRU5UX1RZUEVfQUNIOiAnYWNoJyxcbiAgUEFZTUVOVF9UWVBFX0dJRlRfQ0FSRDogJ2dpZnRfY2FyZCdcbn07XG5cbnZhciBCSU5fTE9PS1VQX01BWF9MRU5HVEggPSA2O1xudmFyIFRPS0VOX1RZUEVfQ0hFQ0tPVVQgPSAnQ0hFQ0tPVVQnO1xudmFyIENSRURJVCA9IHBheW1lbnRUeXBlcy5QQVlNRU5UX1RZUEVfQ1JFRElUO1xudmFyIEFDSCA9IHBheW1lbnRUeXBlcy5QQVlNRU5UX1RZUEVfQUNIO1xudmFyIEdJRlQgPSBwYXltZW50VHlwZXMuUEFZTUVOVF9UWVBFX0dJRlRfQ0FSRDtcblxudmFyIHJlcXVlc3RUeXBlcyA9IHtcbiAgUkVRVUVTVF9UWVBFX1RPS0VOSVpBVElPTjogJ3Rva2VuaXphdGlvbidcbn07XG5cbnZhciB0b2tlbml6ZXJOb25TZWN1cmVGaWVsZHMgPSBbXG4gICdiaWxsaW5nQWRkcmVzcycsXG4gICdjb21wYW55JyxcbiAgJ2VtYWlsJyxcbiAgJ25hbWUnLFxuICAncGhvbmVOdW1iZXInLFxuICAnY3VzdG9tZXInLFxuICAnYWNjb3VudFZhbGlkYXRpb24nLFxuICAnYmFua0FjY291bnRUeXBlJyxcbiAgJ3JvdXRpbmdOdW1iZXInXG5dO1xuXG52YXIgR0lGVF9DQVJEX01JTl9MRU5HVEggPSAxMjtcbnZhciBHSUZUX0NBUkRfTUFYX0xFTkdUSCA9IDIwO1xuXG52YXIgd2hpdGVsaXN0ZWRGaWVsZHMgPSB7fTtcbndoaXRlbGlzdGVkRmllbGRzW0NSRURJVF0gPSB7XG4gIC8vIFBBTi1WQVVMVDpcbiAgYWNjb3VudE51bWJlcjoge1xuICAgIG5hbWU6ICdhY2NvdW50LW51bWJlcicsXG4gICAgbGFiZWw6ICdDYXJkIE51bWJlcicsXG4gICAgZGVmYXVsdE1heExlbmd0aDogMjJcbiAgfSxcbiAgcG9zdGFsQ29kZToge1xuICAgIG5hbWU6ICdwb3N0YWwtY29kZScsXG4gICAgbGFiZWw6ICdDdXN0b21lciBwb3N0YWwgY29kZScsXG4gICAgZGVmYXVsdE1heExlbmd0aDogNVxuICB9LFxuICBleHBEYXRlOiB7XG4gICAgbmFtZTogJ2V4cC1kYXRlJyxcbiAgICBsYWJlbDogJ0V4cGlyYXRpb24gRGF0ZScsXG4gICAgZGVmYXVsdE1heExlbmd0aDogNVxuICB9LFxuICBjdnY6IHtcbiAgICBuYW1lOiAnY3Z2JyxcbiAgICBsYWJlbDogJ0NWVicsXG4gICAgZGVmYXVsdE1heExlbmd0aDogNFxuICB9LFxuICBuYW1lOiB7XG4gICAgbmFtZTogJ25hbWUnLFxuICAgIGxhYmVsOiAnQ2FyZGhvbGRlciBOYW1lJyxcbiAgICBkZWZhdWx0TWF4TGVuZ3RoOiA2NFxuICB9LFxufTtcblxud2hpdGVsaXN0ZWRGaWVsZHNbQUNIXSA9IHtcbiAgLy8gUEFOLVZBVUxUOlxuICBhY2NvdW50TnVtYmVyOiB7IC8vICpcbiAgICBuYW1lOiAnYWNjb3VudC1udW1iZXInLFxuICAgIGxhYmVsOiAnQmFuayBDYXJkIE51bWJlcicsXG4gICAgZGVmYXVsdE1heExlbmd0aDogMTZcbiAgfSxcbiAgdmVyaWZ5QWNjb3VudE51bWJlcjoge1xuICAgIG5hbWU6ICd2ZXJpZnktYWNjb3VudC1udW1iZXInLFxuICAgIGxhYmVsOiAnVmVyaWZ5IENhcmQgTnVtYmVyJyxcbiAgICBkZWZhdWx0TWF4TGVuZ3RoOiAxNlxuICB9LFxuICBwb3N0YWxDb2RlOiB7XG4gICAgbmFtZTogJ3Bvc3RhbC1jb2RlJyxcbiAgICBsYWJlbDogJ0N1c3RvbWVyIHBvc3RhbCBjb2RlJyxcbiAgICBkZWZhdWx0TWF4TGVuZ3RoOiA1XG4gIH1cbn07XG5cbndoaXRlbGlzdGVkRmllbGRzW0dJRlRdID0ge1xuICAvLyBQQU4tVkFVTFQ6XG4gIGFjY291bnROdW1iZXI6IHtcbiAgICBuYW1lOiAnYWNjb3VudC1udW1iZXInLFxuICAgIGxhYmVsOiAnQ2FyZCBOdW1iZXInLFxuICAgIGRlZmF1bHRNYXhMZW5ndGg6IDIyXG4gIH0sXG4gIHBvc3RhbENvZGU6IHtcbiAgICBuYW1lOiAncG9zdGFsLWNvZGUnLFxuICAgIGxhYmVsOiAnQ3VzdG9tZXIgcG9zdGFsIGNvZGUnLFxuICAgIGRlZmF1bHRNYXhMZW5ndGg6IDVcbiAgfVxufTtcblxudmFyIGNvbnN0YW50cyA9IHtcbiAgVkVSU0lPTjogVkVSU0lPTixcbiAgbWF4RXhwaXJhdGlvblllYXJBZ2U6IDMxLFxuICBleHRlcm5hbEV2ZW50czoge1xuICAgIENIQU5HRTogJ2NoYW5nZScsXG4gICAgRk9DVVM6ICdmb2N1cycsXG4gICAgQkxVUjogJ2JsdXInLFxuICAgIEVNUFRZOiAnZW1wdHknLFxuICAgIE5PVF9FTVBUWTogJ25vdEVtcHR5JyxcbiAgICBWQUxJRElUWV9DSEFOR0U6ICd2YWxpZGl0eUNoYW5nZScsXG4gICAgQ0FSRF9UWVBFX0NIQU5HRTogJ2NhcmRUeXBlQ2hhbmdlJyxcbiAgICBDQVJEX0lORk9fTE9BREVEOiAnY2FyZEluZm9Mb2FkZWQnXG4gIH0sXG4gIGV4dGVybmFsQ2xhc3Nlczoge1xuICAgIFBPVEVOVElBTExZX1ZBTElEOiAnc2VhbWxlc3NwYXktaG9zdGVkLWZpZWxkcy1wb3RlbnRpYWxseS12YWxpZCcsXG4gICAgRk9DVVNFRDogJ3NlYW1sZXNzcGF5LWhvc3RlZC1maWVsZHMtZm9jdXNlZCcsXG4gICAgSU5WQUxJRDogJ3NlYW1sZXNzcGF5LWhvc3RlZC1maWVsZHMtaW52YWxpZCcsXG4gICAgVkFMSUQ6ICdzZWFtbGVzc3BheS1ob3N0ZWQtZmllbGRzLXZhbGlkJ1xuICB9LFxuICBkZWZhdWx0SUZyYW1lU3R5bGU6IHtcbiAgICBib3JkZXI6ICdub25lJyxcbiAgICB3aWR0aDogJzEwMCUnLFxuICAgIGhlaWdodDogJzEwMCUnLFxuICAgICdmbG9hdCc6ICdsZWZ0J1xuICB9LFxuICB3aGl0ZWxpc3RlZFN0eWxlczogW1xuICAgICctbW96LWFwcGVhcmFuY2UnLFxuICAgICctbW96LW9zeC1mb250LXNtb290aGluZycsXG4gICAgJy1tb3otdGFwLWhpZ2hsaWdodC1jb2xvcicsXG4gICAgJy1tb3otdHJhbnNpdGlvbicsXG4gICAgJy13ZWJraXQtYXBwZWFyYW5jZScsXG4gICAgJy13ZWJraXQtZm9udC1zbW9vdGhpbmcnLFxuICAgICctd2Via2l0LXRhcC1oaWdobGlnaHQtY29sb3InLFxuICAgICctd2Via2l0LXRyYW5zaXRpb24nLFxuICAgICdhcHBlYXJhbmNlJyxcbiAgICAnYm9yZGVyLXJhZGl1cycsXG4gICAgJ2NvbG9yJyxcbiAgICAnZGlyZWN0aW9uJyxcbiAgICAnZm9udCcsXG4gICAgJ2ZvbnQtZmFtaWx5JyxcbiAgICAnZm9udC1zaXplJyxcbiAgICAnZm9udC1zaXplLWFkanVzdCcsXG4gICAgJ2ZvbnQtc3RyZXRjaCcsXG4gICAgJ2ZvbnQtc3R5bGUnLFxuICAgICdmb250LXZhcmlhbnQnLFxuICAgICdmb250LXZhcmlhbnQtYWx0ZXJuYXRlcycsXG4gICAgJ2ZvbnQtdmFyaWFudC1jYXBzJyxcbiAgICAnZm9udC12YXJpYW50LWVhc3QtYXNpYW4nLFxuICAgICdmb250LXZhcmlhbnQtbGlnYXR1cmVzJyxcbiAgICAnZm9udC12YXJpYW50LW51bWVyaWMnLFxuICAgICdmb250LXdlaWdodCcsXG4gICAgJ2xldHRlci1zcGFjaW5nJyxcbiAgICAnbGluZS1oZWlnaHQnLFxuICAgICdtYXJnaW4nLFxuICAgICdtYXJnaW4tdG9wJyxcbiAgICAnbWFyZ2luLXJpZ2h0JyxcbiAgICAnbWFyZ2luLWJvdHRvbScsXG4gICAgJ21hcmdpbi1sZWZ0JyxcbiAgICAnb3BhY2l0eScsXG4gICAgJ291dGxpbmUnLFxuICAgICdwYWRkaW5nJyxcbiAgICAncGFkZGluZy10b3AnLFxuICAgICdwYWRkaW5nLXJpZ2h0JyxcbiAgICAncGFkZGluZy1ib3R0b20nLFxuICAgICdwYWRkaW5nLWxlZnQnLFxuICAgICd0ZXh0LWFsaWduJyxcbiAgICAndGV4dC1zaGFkb3cnLFxuICAgICd0cmFuc2l0aW9uJ1xuICBdLFxuICB3aGl0ZWxpc3RlZEZpZWxkczogd2hpdGVsaXN0ZWRGaWVsZHMsXG4gIHdoaXRlbGlzdGVkQXR0cmlidXRlczoge1xuICAgICdhcmlhLWludmFsaWQnOiAnYm9vbGVhbicsXG4gICAgJ2FyaWEtcmVxdWlyZWQnOiAnYm9vbGVhbicsXG4gICAgZGlzYWJsZWQ6ICdib29sZWFuJyxcbiAgICBwbGFjZWhvbGRlcjogJ3N0cmluZydcbiAgfSxcbiAgYXV0b2NvbXBsZXRlTWFwcGluZ3M6IHtcbiAgICAnYWNjb3VudC1udW1iZXInOiAnY2MtbnVtYmVyJyxcbiAgICAnZXhwLWRhdGUnOiAnY2MtZXhwJyxcbiAgICBjdnY6ICdjYy1jc2MnLFxuICAgICdwb3N0YWwtY29kZSc6ICdiaWxsaW5nIHBvc3RhbC1jb2RlJyxcbiAgICBuYW1lOiAnY2MtbmFtZScsXG4gIH0sXG4gIHBheW1lbnRUeXBlczogcGF5bWVudFR5cGVzLFxuICByZXF1ZXN0VHlwZXM6IHJlcXVlc3RUeXBlcyxcbiAgR0lGVF9DQVJEX01JTl9MRU5HVEg6IEdJRlRfQ0FSRF9NSU5fTEVOR1RILFxuICBHSUZUX0NBUkRfTUFYX0xFTkdUSDogR0lGVF9DQVJEX01BWF9MRU5HVEgsXG4gIFRPS0VOX1RZUEVfQ0hFQ0tPVVQ6IFRPS0VOX1RZUEVfQ0hFQ0tPVVQsXG4gIEJJTl9MT09LVVBfTUFYX0xFTkdUSDogQklOX0xPT0tVUF9NQVhfTEVOR1RILFxuICB0b2tlbml6ZXJOb25TZWN1cmVGaWVsZHM6IHRva2VuaXplck5vblNlY3VyZUZpZWxkcyxcbiAgY2FyZEJyYW5kTWFwOiB7XG4gICAgdmlzYTogJ3Zpc2EnLFxuICAgIG1hc3RlcmNhcmQ6ICdtYXN0ZXJjYXJkJyxcbiAgICAnYW1lcmljYW4tZXhwcmVzcyc6ICdhbWV4JyxcbiAgICAnZGluZXJzLWNsdWInOiAnZGluZXJzJyxcbiAgICBkaXNjb3ZlcjogJ2Rpc2NvdmVyJyxcbiAgICBqY2I6ICdqY2InLFxuICAgIHVuaW9ucGF5OiAndW5pb25wYXknLFxuICAgIG1hZXN0cm86ICdtYXN0ZXJjYXJkJyxcbiAgICBlbG86ICdkaXNjb3ZlcicsXG4gICAgbWlyOiAndW5rbm93bicsXG4gICAgaGlwZXI6ICdkaXNjb3ZlcicsXG4gICAgaGlwZXJjYXJkOiAnZGlzY292ZXInXG4gIH1cbn07XG5cbmNvbnN0YW50cy5ldmVudHMgPSBlbnVtZXJhdGUoW1xuICAnQVVUT0ZJTExfRVhQSVJBVElPTl9EQVRFJyxcbiAgJ1BPUFVMQVRFX1RPS0VOJyxcbiAgJ0ZSQU1FX1JFQURZJyxcbiAgJ1ZBTElEQVRFX1NUUklDVCcsXG4gICdDT05GSUdVUkFUSU9OJyxcbiAgJ1RPS0VOSVpBVElPTl9SRVFVRVNUJyxcbiAgJ0lOUFVUX0VWRU5UJyxcbiAgJ1RSSUdHRVJfSU5QVVRfRk9DVVMnLFxuICAnQUREX0NMQVNTJyxcbiAgJ1JFTU9WRV9DTEFTUycsXG4gICdTRVRfQVRUUklCVVRFJyxcbiAgJ1JFTU9WRV9BVFRSSUJVVEUnLFxuICAnQ0xFQVJfRklFTEQnXG5dLCAnaG9zdGVkLWZpZWxkczonKTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb25zdGFudHM7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBTZWFtbGVzc3BheUVycm9yID0gcmVxdWlyZSgnLi4vLi4vbGliL3NlYW1sZXNzcGF5LWVycm9yJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBIT1NURURfRklFTERTX0lOVkFMSURfRklFTERfS0VZOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnSE9TVEVEX0ZJRUxEU19JTlZBTElEX0ZJRUxEX0tFWSdcbiAgfSxcbiAgSE9TVEVEX0ZJRUxEU19JTlZBTElEX0ZJRUxEX0RFRkFVTFRfVkFMVUU6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLk1FUkNIQU5ULFxuICAgIGNvZGU6ICdIT1NURURfRklFTERTX0lOVkFMSURfRklFTERfREVGQVVMVF9WQUxVRSdcbiAgfSxcbiAgSE9TVEVEX0ZJRUxEU19JTlZBTElEX0ZJRUxEX1NFTEVDVE9SOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnSE9TVEVEX0ZJRUxEU19JTlZBTElEX0ZJRUxEX1NFTEVDVE9SJyxcbiAgICBtZXNzYWdlOiAnU2VsZWN0b3IgZG9lcyBub3QgcmVmZXJlbmNlIGEgdmFsaWQgRE9NIG5vZGUuJ1xuICB9LFxuICBIT1NURURfRklFTERTX0lOVkFMSURfU1VCTUlUX0JVVFRPTl9TRUxFQ1RPUjoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTUVSQ0hBTlQsXG4gICAgY29kZTogJ0hPU1RFRF9GSUVMRFNfSU5WQUxJRF9TVUJNSVRfQlVUVE9OX1NFTEVDVE9SJyxcbiAgICBtZXNzYWdlOiAnU2VsZWN0b3IgZG9lcyBub3QgcmVmZXJlbmNlIGEgdmFsaWQgRE9NIG5vZGUuJ1xuICB9LFxuICBIT1NURURfRklFTERTX0ZJRUxEX0RVUExJQ0FURV9JRlJBTUU6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLk1FUkNIQU5ULFxuICAgIGNvZGU6ICdIT1NURURfRklFTERTX0ZJRUxEX0RVUExJQ0FURV9JRlJBTUUnLFxuICAgIG1lc3NhZ2U6ICdFbGVtZW50IGFscmVhZHkgY29udGFpbnMgYSBTZWFtbGVzc3BheSBpZnJhbWUuJ1xuICB9LFxuICBIT1NURURfRklFTERTX0ZJRUxEX0lOVkFMSUQ6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLk1FUkNIQU5ULFxuICAgIGNvZGU6ICdIT1NURURfRklFTERTX0ZJRUxEX0lOVkFMSUQnXG4gIH0sXG4gIEhPU1RFRF9GSUVMRFNfRklFTERfTk9UX1BSRVNFTlQ6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLk1FUkNIQU5ULFxuICAgIGNvZGU6ICdIT1NURURfRklFTERTX0ZJRUxEX05PVF9QUkVTRU5UJ1xuICB9LFxuICBIT1NURURfRklFTERTX1RPS0VOSVpBVElPTl9ORVRXT1JLX0VSUk9SOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5ORVRXT1JLLFxuICAgIGNvZGU6ICdIT1NURURfRklFTERTX1RPS0VOSVpBVElPTl9ORVRXT1JLX0VSUk9SJyxcbiAgICBtZXNzYWdlOiAnQSB0b2tlbml6YXRpb24gbmV0d29yayBlcnJvciBvY2N1cnJlZC4nXG4gIH0sXG4gIEhPU1RFRF9GSUVMRFNfRkFJTEVEX1RPS0VOSVpBVElPTjoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuQ1VTVE9NRVIsXG4gICAgY29kZTogJ0hPU1RFRF9GSUVMRFNfRkFJTEVEX1RPS0VOSVpBVElPTicsXG4gICAgbWVzc2FnZTogJ1RoZSBzdXBwbGllZCBjYXJkIGRhdGEgZmFpbGVkIHRva2VuaXphdGlvbi4nXG4gIH0sXG4gIEhPU1RFRF9GSUVMRFNfRklFTERTX0VNUFRZOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5DVVNUT01FUixcbiAgICBjb2RlOiAnSE9TVEVEX0ZJRUxEU19GSUVMRFNfRU1QVFknLFxuICAgIG1lc3NhZ2U6ICdBbGwgZmllbGRzIGFyZSBlbXB0eS4gQ2Fubm90IHRva2VuaXplIGVtcHR5IGNhcmQgZmllbGRzLidcbiAgfSxcbiAgSE9TVEVEX0ZJRUxEU19GSUVMRFNfSU5WQUxJRDoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuQ1VTVE9NRVIsXG4gICAgY29kZTogJ0hPU1RFRF9GSUVMRFNfRklFTERTX0lOVkFMSUQnLFxuICAgIG1lc3NhZ2U6ICdTb21lIHBheW1lbnQgaW5wdXQgZmllbGRzIGFyZSBpbnZhbGlkLiBDYW5ub3QgdG9rZW5pemUgaW52YWxpZCBjYXJkIGZpZWxkcy4nXG4gIH0sXG4gIEhPU1RFRF9GSUVMRFNfQVRUUklCVVRFX05PVF9TVVBQT1JURUQ6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLk1FUkNIQU5ULFxuICAgIGNvZGU6ICdIT1NURURfRklFTERTX0FUVFJJQlVURV9OT1RfU1VQUE9SVEVEJ1xuICB9LFxuICBIT1NURURfRklFTERTX0FUVFJJQlVURV9WQUxVRV9OT1RfQUxMT1dFRDoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTUVSQ0hBTlQsXG4gICAgY29kZTogJ0hPU1RFRF9GSUVMRFNfQVRUUklCVVRFX1ZBTFVFX05PVF9BTExPV0VEJ1xuICB9LFxuICBIT1NURURfRklFTERTX0lOQ09NUEFUSUJMRV9GSUVMRFNfU0VUOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnSE9TVEVEX0ZJRUxEU19JTkNPTVBBVElCTEVfRklFTERTX1NFVCdcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gZmluZFBhcmVudFRhZ3MoZWxlbWVudCwgdGFnKSB7XG4gIHZhciBwYXJlbnQgPSBlbGVtZW50LnBhcmVudE5vZGU7XG4gIHZhciBwYXJlbnRzID0gW107XG5cbiAgd2hpbGUgKHBhcmVudCAhPSBudWxsKSB7XG4gICAgaWYgKHBhcmVudC50YWdOYW1lICE9IG51bGwgJiYgcGFyZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gdGFnKSB7XG4gICAgICBwYXJlbnRzLnB1c2gocGFyZW50KTtcbiAgICB9XG5cbiAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50Tm9kZTtcbiAgfVxuXG4gIHJldHVybiBwYXJlbnRzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZpbmRQYXJlbnRUYWdzO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGNvbnN0YW50cyA9IHJlcXVpcmUoJy4vY29uc3RhbnRzJyk7XG5cbnZhciByZXF1ZXN0VHlwZXMgPSBjb25zdGFudHMucmVxdWVzdFR5cGVzO1xudmFyIHBheW1lbnRUeXBlcyA9IGNvbnN0YW50cy5wYXltZW50VHlwZXM7XG5cbnZhciBUT0tFTklaQVRJT04gPSByZXF1ZXN0VHlwZXMuUkVRVUVTVF9UWVBFX1RPS0VOSVpBVElPTjtcblxudmFyIENSRURJVCA9IHBheW1lbnRUeXBlcy5QQVlNRU5UX1RZUEVfQ1JFRElUO1xudmFyIEFDSCA9IHBheW1lbnRUeXBlcy5QQVlNRU5UX1RZUEVfQUNIO1xudmFyIEdJRlRfQ0FSRCA9IHBheW1lbnRUeXBlcy5QQVlNRU5UX1RZUEVfR0lGVF9DQVJEO1xuXG52YXIgcmVsYXRpb25zID0ge307XG5yZWxhdGlvbnNbVE9LRU5JWkFUSU9OXSA9IHt9O1xuXG5yZWxhdGlvbnNbVE9LRU5JWkFUSU9OXVtDUkVESVRdID0ge1xuICBmaWVsZHM6IFtcbiAgICAnYWNjb3VudE51bWJlcicsXG4gICAgJ3Bvc3RhbENvZGUnLFxuICAgICdleHBEYXRlJyxcbiAgICAnY3Z2J1xuICBdLFxuICBvbmVPZjogW1xuICAgIHtcbiAgICAgIHJlcXVpcmVkOiBbICdhY2NvdW50TnVtYmVyJywgJ2V4cERhdGUnIF1cbiAgICB9XG4gIF1cbn07XG5cblxucmVsYXRpb25zW1RPS0VOSVpBVElPTl1bQUNIXSA9IHtcbiAgZmllbGRzOiBbXG4gICAgJ2FjY291bnROdW1iZXInLFxuICAgICdwb3N0YWxDb2RlJyxcbiAgICAndmVyaWZ5QWNjb3VudE51bWJlcidcbiAgXSxcbiAgZGVmYXVsdFZhbHVlczoge30sXG4gIG9uZU9mOiBbXG4gICAgeyByZXF1aXJlZDogWyAnYWNjb3VudE51bWJlcicgXSB9LFxuICBdLFxuICByZWxhdGVkRmllbGRzUnVsZXM6IFtcbiAgICB7XG4gICAgICBjb25maWc6ICdnYXRld2F5Q29uZmlndXJhdGlvbi5tZXJjaGFudC5wcm9jZXNzb3JBY2gubmFtZScsXG4gICAgICB2YWx1ZTogJ0NIQycsXG4gICAgICBkZXBlbmRlbmNpZXM6IHt9XG4gICAgfVxuICBdLFxufTtcblxucmVsYXRpb25zW1RPS0VOSVpBVElPTl1bR0lGVF9DQVJEXSA9IHtcbiAgZmllbGRzOiBbXG4gICAgJ2FjY291bnROdW1iZXInLFxuICAgICdwb3N0YWxDb2RlJ1xuICBdLFxuICBvbmVPZjogW1xuICAgIHsgcmVxdWlyZWQ6IFsgJ2FjY291bnROdW1iZXInIF0gfVxuICBdXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlbGF0aW9ucztcbiIsIid1c2Ugc3RyaWN0Jztcbi8qKlxuICogQG1vZHVsZSBAc2VhbWxlc3NwYXkvd2ViLXNka1xuICogQGRlc2NyaXB0aW9uIFRoaXMgaXMgdGhlIHRvcC1sZXZlbCBtb2R1bGUgZXhwb3J0ZWQgYnkgdGhlIFNlYW1sZXNzcGF5IEphdmFTY3JpcHQgU0RLLiBJbiBhIGJyb3dzZXIgZW52aXJvbm1lbnQsIHRoaXMgd2lsbCBiZSB0aGUgZ2xvYmFsIDxjb2RlPnNlYW1sZXNzcGF5PC9jb2RlPiBvYmplY3QuIEluIGEgQ29tbW9uSlMgZW52aXJvbm1lbnQgKGxpa2UgQnJvd3NlcmlmeSBvciBXZWJwYWNrKSwgaXQgd2lsbCBiZSB0aGUgZGVmYXVsdCBleHBvcnQgb2YgdGhlIDxjb2RlPnNlYW1sZXNzcGF5LXdlYjwvY29kZT4gcGFja2FnZS4gSW4gQU1EIGVudmlyb25tZW50cyAobGlrZSBSZXF1aXJlSlMpLCBpdCBjYW4gYmUgYHJlcXVpcmVgZCBsaWtlIG90aGVyIG1vZHVsZXMuXG4gKiBAZXhhbXBsZVxuICogPGNhcHRpb24+Q29tbW9uSlM8L2NhcHRpb24+XG4gKiB2YXIgc2VhbWxlc3NwYXkgPSByZXF1aXJlKCdAc2VhbWxlc3NwYXkvd2ViLXNkaycpO1xuICpcbiAqIHNlYW1sZXNzcGF5LmNsaWVudC5jcmVhdGUoLi4uKTtcbiAqIEBleGFtcGxlXG4gKiA8Y2FwdGlvbj5JbiB0aGUgYnJvd3NlcjwvY2FwdGlvbj5cbiAqIDxzY3JpcHQgc3JjPVwiaHR0cHM6Ly9qcy5zZWFtbGVzc3BheWdhdGV3YXkuY29tL3tAcGtnIHZlcnNpb259L2pzL2NsaWVudC5taW4uanNcIj48L3NjcmlwdD5cbiAqIDxzY3JpcHQ+XG4gKiAgIHdpbmRvdy5zZWFtbGVzc3BheS5jbGllbnQuY3JlYXRlKC4uLik7XG4gKiA8L3NjcmlwdD5cbiAqIEBleGFtcGxlXG4gKiA8Y2FwdGlvbj5BTUQ8L2NhcHRpb24+XG4gKiAvLyBtYWluLmpzXG4gKiByZXF1aXJlLmNvbmZpZyh7XG4gKiAgIHBhdGhzOiB7XG4gKiAgICAgc2VhbWxlc3NwYXlDbGllbnQ6ICdodHRwczovL2pzLnNlYW1sZXNzcGF5Z2F0ZXdheS5jb20ve0Bwa2cgdmVyc2lvbn0vanMvY2xpZW50Lm1pbidcbiAqICAgfVxuICogfSk7XG4gKlxuICogcmVxdWlyZShbJ3NlYW1sZXNzcGF5Q2xpZW50J10sIGZ1bmN0aW9uIChzZWFtbGVzc3BheUNsaWVudCkge1xuICogICBzZWFtbGVzc3BheUNsaWVudC5jcmVhdGUoLi4uKTtcbiAqIH0pO1xuICovXG5cbi8qKlxuICogQGdsb2JhbFxuICogQGNhbGxiYWNrIGNhbGxiYWNrXG4gKiBAcGFyYW0gez9TZWFtbGVzc3BheUVycm9yfSBbZXJyXSBgbnVsbGAgb3IgYHVuZGVmaW5lZGAgaWYgdGhlcmUgd2FzIG5vIGVycm9yLlxuICogQHBhcmFtIHs/YW55fSBbZGF0YV0gVGhlIHN1Y2Nlc3NmdWwgcmVzdWx0IG9mIHRoZSBhc3luY2hyb25vdXMgZnVuY3Rpb24gY2FsbCAoaWYgZGF0YSBleGlzdHMpLlxuICogQGRlc2NyaXB0aW9uIFRoZSBOb2RlLmpzLXN0eWxlIGNhbGxiYWNrIHBhdHRlcm4gdXNlZCB0aHJvdWdob3V0IHRoZSBTREsuXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuXG52YXIgY2xpZW50ID0gcmVxdWlyZSgnLi9jbGllbnQnKTtcbnZhciBjYXJkRWxlbWVudCA9IHJlcXVpcmUoJy4vY2FyZC1lbGVtZW50Jyk7XG52YXIgaG9zdGVkRmllbGRzID0gcmVxdWlyZSgnLi9ob3N0ZWQtZmllbGRzJyk7XG52YXIgY2hlY2tvdXRCdXR0b24gPSByZXF1aXJlKCcuL2NoZWNrb3V0LWJ1dHRvbicpO1xudmFyIGRpZ2l0YWxXYWxsZXRzID0gcmVxdWlyZSgnLi9kaWdpdGFsLXdhbGxldHMnKTtcbnZhciBwYXlwYWxDaGVja291dCA9IHJlcXVpcmUoJy4vcGF5cGFsLWNoZWNrb3V0Jyk7XG5cbnZhciBWRVJTSU9OID0gXCJ3ZWItc2RrXCI7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAvKiogQHR5cGUge21vZHVsZTpzZWFtbGVzc3BheS13ZWIvY2xpZW50fSAqL1xuICBjbGllbnQ6IGNsaWVudCxcblxuICAvKiogQHR5cGUge21vZHVsZTpzZWFtbGVzc3BheS13ZWIvY2FyZC1lbGVtZW50fSAqL1xuICBjYXJkRWxlbWVudDogY2FyZEVsZW1lbnQsXG5cbiAgLyoqIEB0eXBlIHttb2R1bGU6c2VhbWxlc3NwYXktd2ViL2hvc3RlZC1maWVsZHN9ICovXG4gIGhvc3RlZEZpZWxkczogaG9zdGVkRmllbGRzLFxuXG4gIC8qKiBAdHlwZSB7bW9kdWxlOnNlYW1sZXNzcGF5LXdlYi9kaWdpdGFsLXdhbGxldHN9ICovXG4gIGRpZ2l0YWxXYWxsZXRzOiBkaWdpdGFsV2FsbGV0cyxcblxuICAvKiogQHR5cGUge21vZHVsZTpzZWFtbGVzc3BheS13ZWIvY2hlY2tvdXQtYnV0dG9ufSAqL1xuICBjaGVja291dEJ1dHRvbjogY2hlY2tvdXRCdXR0b24sXG5cbiAgLyoqIEB0eXBlIHttb2R1bGU6c2VhbWxlc3NwYXktd2ViL3BheXBhbC1jaGVja291dH0gKi9cbiAgcGF5cGFsQ2hlY2tvdXQ6IHBheXBhbENoZWNrb3V0LFxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gVGhlIGN1cnJlbnQgdmVyc2lvbiBvZiB0aGUgU0RLLCBpLmUuIGB7QHBrZyB2ZXJzaW9ufWAuXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqL1xuICBWRVJTSU9OOiBWRVJTSU9OXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBhZGRNZXRhZGF0YShjb25maWd1cmF0aW9uLCBkYXRhKSB7XG4gIGlmIChjb25maWd1cmF0aW9uLm1ldGFkYXRhKSB7XG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIGRhdGEubWV0YWRhdGEgPSBjb25maWd1cmF0aW9uLm1ldGFkYXRhO1xuICAgIH0gZWxzZSB7XG4gICAgICBkYXRhID0ge1xuICAgICAgICBtZXRhZGF0YTogY29uZmlndXJhdGlvbi5tZXRhZGF0YVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZGF0YVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFkZE1ldGFkYXRhO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYXNzaWduTm9ybWFsaXplZCA9IHR5cGVvZiBPYmplY3QuYXNzaWduID09PSAnZnVuY3Rpb24nID8gT2JqZWN0LmFzc2lnbiA6IGFzc2lnblBvbHlmaWxsO1xuXG5mdW5jdGlvbiBhc3NpZ25Qb2x5ZmlsbChkZXN0aW5hdGlvbikge1xuICB2YXIgaSwgc291cmNlLCBrZXk7XG5cbiAgZm9yIChpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcbiAgICBmb3IgKGtleSBpbiBzb3VyY2UpIHtcbiAgICAgIGlmIChzb3VyY2UuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICBkZXN0aW5hdGlvbltrZXldID0gc291cmNlW2tleV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGRlc3RpbmF0aW9uO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYXNzaWduOiBhc3NpZ25Ob3JtYWxpemVkLFxuICBfYXNzaWduOiBhc3NpZ25Qb2x5ZmlsbFxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFNlYW1sZXNzcGF5RXJyb3IgPSByZXF1aXJlKCcuL3NlYW1sZXNzcGF5LWVycm9yJyk7XG52YXIgUHJvbWlzZSA9IHJlcXVpcmUoJy4vcHJvbWlzZScpO1xudmFyIHNoYXJlZEVycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzJyk7XG52YXIgVkVSU0lPTiA9IFwid2ViLXNka1wiO1xuXG5mdW5jdGlvbiBiYXNpY0NvbXBvbmVudFZlcmlmaWNhdGlvbihvcHRpb25zKSB7XG4gIHZhciBjbGllbnQsIGNsaWVudFZlcnNpb24sIG5hbWU7XG5cbiAgaWYgKCFvcHRpb25zKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBTZWFtbGVzc3BheUVycm9yKHtcbiAgICAgIHR5cGU6IHNoYXJlZEVycm9ycy5JTlZBTElEX1VTRV9PRl9JTlRFUk5BTF9GVU5DVElPTi50eXBlLFxuICAgICAgY29kZTogc2hhcmVkRXJyb3JzLklOVkFMSURfVVNFX09GX0lOVEVSTkFMX0ZVTkNUSU9OLmNvZGUsXG4gICAgICBtZXNzYWdlOiAnT3B0aW9ucyBtdXN0IGJlIHBhc3NlZCB0byBiYXNpY0NvbXBvbmVudFZlcmlmaWNhdGlvbiBmdW5jdGlvbi4nXG4gICAgfSkpO1xuICB9XG5cbiAgbmFtZSA9IG9wdGlvbnMubmFtZTtcbiAgY2xpZW50ID0gb3B0aW9ucy5jbGllbnQ7XG5cbiAgaWYgKGNsaWVudCA9PSBudWxsKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBTZWFtbGVzc3BheUVycm9yKHtcbiAgICAgIHR5cGU6IHNoYXJlZEVycm9ycy5JTlNUQU5USUFUSU9OX09QVElPTl9SRVFVSVJFRC50eXBlLFxuICAgICAgY29kZTogc2hhcmVkRXJyb3JzLklOU1RBTlRJQVRJT05fT1BUSU9OX1JFUVVJUkVELmNvZGUsXG4gICAgICBtZXNzYWdlOiAnb3B0aW9ucy5jbGllbnQgaXMgcmVxdWlyZWQgd2hlbiBpbnN0YW50aWF0aW5nICcgKyBuYW1lICsgJy4nXG4gICAgfSkpO1xuICB9XG5cbiAgY2xpZW50VmVyc2lvbiA9IGNsaWVudC5nZXRWZXJzaW9uKCk7XG5cbiAgaWYgKGNsaWVudFZlcnNpb24gIT09IFZFUlNJT04pIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgdHlwZTogc2hhcmVkRXJyb3JzLklOQ09NUEFUSUJMRV9WRVJTSU9OUy50eXBlLFxuICAgICAgY29kZTogc2hhcmVkRXJyb3JzLklOQ09NUEFUSUJMRV9WRVJTSU9OUy5jb2RlLFxuICAgICAgbWVzc2FnZTogJ0NsaWVudCAodmVyc2lvbiAnICsgY2xpZW50VmVyc2lvbiArICcpIGFuZCAnICsgbmFtZSArICcgKHZlcnNpb24gJyArIFZFUlNJT04gKyAnKSBjb21wb25lbnRzIG11c3QgYmUgZnJvbSB0aGUgc2FtZSBTREsgdmVyc2lvbi4nXG4gICAgfSkpO1xuICB9XG5cbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgdmVyaWZ5OiBiYXNpY0NvbXBvbmVudFZlcmlmaWNhdGlvblxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIG9uY2UgPSByZXF1aXJlKCcuL29uY2UnKTtcblxuZnVuY3Rpb24gY2FsbChmbiwgY2FsbGJhY2spIHtcbiAgdmFyIGlzU3luYyA9IGZuLmxlbmd0aCA9PT0gMDtcblxuICBpZiAoaXNTeW5jKSB7XG4gICAgZm4oKTtcbiAgICBjYWxsYmFjayhudWxsKTtcbiAgfSBlbHNlIHtcbiAgICBmbihjYWxsYmFjayk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZnVuY3Rpb25zLCBjYikge1xuICB2YXIgaTtcbiAgdmFyIGxlbmd0aCA9IGZ1bmN0aW9ucy5sZW5ndGg7XG4gIHZhciByZW1haW5pbmcgPSBsZW5ndGg7XG4gIHZhciBjYWxsYmFjayA9IG9uY2UoY2IpO1xuXG4gIGlmIChsZW5ndGggPT09IDApIHtcbiAgICBjYWxsYmFjayhudWxsKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBmdW5jdGlvbiBmaW5pc2goZXJyKSB7XG4gICAgaWYgKGVycikge1xuICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByZW1haW5pbmcgLT0gMTtcbiAgICBpZiAocmVtYWluaW5nID09PSAwKSB7XG4gICAgICBjYWxsYmFjayhudWxsKTtcbiAgICB9XG4gIH1cblxuICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBjYWxsKGZ1bmN0aW9uc1tpXSwgZmluaXNoKTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzV2hpdGVsaXN0ZWREb21haW4gPSByZXF1aXJlKCcuLi9pcy13aGl0ZWxpc3RlZC1kb21haW4nKTtcblxuZnVuY3Rpb24gY2hlY2tPcmlnaW4ocG9zdE1lc3NhZ2VPcmlnaW4sIG1lcmNoYW50VXJsKSB7XG4gIHZhciBtZXJjaGFudE9yaWdpbiwgbWVyY2hhbnRIb3N0O1xuICB2YXIgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcblxuICBhLmhyZWYgPSBtZXJjaGFudFVybDtcblxuICBpZiAoYS5wcm90b2NvbCA9PT0gJ2h0dHBzOicpIHtcbiAgICBtZXJjaGFudEhvc3QgPSBhLmhvc3QucmVwbGFjZSgvOjQ0MyQvLCAnJyk7XG4gIH0gZWxzZSBpZiAoYS5wcm90b2NvbCA9PT0gJ2h0dHA6Jykge1xuICAgIG1lcmNoYW50SG9zdCA9IGEuaG9zdC5yZXBsYWNlKC86ODAkLywgJycpO1xuICB9IGVsc2Uge1xuICAgIG1lcmNoYW50SG9zdCA9IGEuaG9zdDtcbiAgfVxuXG4gIG1lcmNoYW50T3JpZ2luID0gYS5wcm90b2NvbCArICcvLycgKyBtZXJjaGFudEhvc3Q7XG5cbiAgaWYgKG1lcmNoYW50T3JpZ2luID09PSBwb3N0TWVzc2FnZU9yaWdpbikgeyByZXR1cm4gdHJ1ZTsgfVxuXG4gIGEuaHJlZiA9IHBvc3RNZXNzYWdlT3JpZ2luO1xuXG4gIHJldHVybiBpc1doaXRlbGlzdGVkRG9tYWluKHBvc3RNZXNzYWdlT3JpZ2luKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNoZWNrT3JpZ2luOiBjaGVja09yaWdpblxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGVudW1lcmF0ZSA9IHJlcXVpcmUoJy4uL2VudW1lcmF0ZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGVudW1lcmF0ZShbXG4gICdDT05GSUdVUkFUSU9OX1JFUVVFU1QnXG5dLCAnYnVzOicpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYnVzID0gcmVxdWlyZSgnZnJhbWVidXMnKTtcbnZhciBldmVudHMgPSByZXF1aXJlKCcuL2V2ZW50cycpO1xudmFyIGNoZWNrT3JpZ2luID0gcmVxdWlyZSgnLi9jaGVjay1vcmlnaW4nKS5jaGVja09yaWdpbjtcbnZhciBTZWFtbGVzc3BheUVycm9yID0gcmVxdWlyZSgnLi4vc2VhbWxlc3NwYXktZXJyb3InKTtcblxuZnVuY3Rpb24gU2VhbWxlc3NwYXlCdXMob3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICB0aGlzLmNoYW5uZWwgPSBvcHRpb25zLmNoYW5uZWw7XG4gIGlmICghdGhpcy5jaGFubmVsKSB7XG4gICAgdGhyb3cgbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5JTlRFUk5BTCxcbiAgICAgIGNvZGU6ICdNSVNTSU5HX0NIQU5ORUxfSUQnLFxuICAgICAgbWVzc2FnZTogJ0NoYW5uZWwgSUQgbXVzdCBiZSBzcGVjaWZpZWQuJ1xuICAgIH0pO1xuICB9XG5cbiAgdGhpcy5tZXJjaGFudFVybCA9IG9wdGlvbnMubWVyY2hhbnRVcmw7XG5cbiAgdGhpcy5faXNEZXN0cm95ZWQgPSBmYWxzZTtcbiAgdGhpcy5faXNWZXJib3NlID0gZmFsc2U7XG5cbiAgdGhpcy5fbGlzdGVuZXJzID0gW107XG5cbiAgdGhpcy5fbG9nKCduZXcgYnVzIG9uIGNoYW5uZWwgJyArIHRoaXMuY2hhbm5lbCwgW2xvY2F0aW9uLmhyZWZdKTtcbn1cblxuU2VhbWxlc3NwYXlCdXMucHJvdG90eXBlLm9uID0gZnVuY3Rpb24gKGV2ZW50TmFtZSwgb3JpZ2luYWxIYW5kbGVyKSB7XG4gIHZhciBuYW1lc3BhY2VkRXZlbnQsIGFyZ3M7XG4gIHZhciBoYW5kbGVyID0gb3JpZ2luYWxIYW5kbGVyO1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgaWYgKHRoaXMuX2lzRGVzdHJveWVkKSB7IHJldHVybjsgfVxuXG4gIGlmICh0aGlzLm1lcmNoYW50VXJsKSB7XG4gICAgaGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLWludmFsaWQtdGhpcyAqL1xuICAgICAgaWYgKGNoZWNrT3JpZ2luKHRoaXMub3JpZ2luLCBzZWxmLm1lcmNoYW50VXJsKSkge1xuICAgICAgICBvcmlnaW5hbEhhbmRsZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICAgIC8qIGVzbGludC1lbmFibGUgbm8taW52YWxpZC10aGlzICovXG4gICAgfTtcbiAgfVxuXG4gIG5hbWVzcGFjZWRFdmVudCA9IHRoaXMuX25hbWVzcGFjZUV2ZW50KGV2ZW50TmFtZSk7XG4gIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICBhcmdzWzBdID0gbmFtZXNwYWNlZEV2ZW50O1xuICBhcmdzWzFdID0gaGFuZGxlcjtcblxuICB0aGlzLl9sb2coJ29uJywgYXJncyk7XG4gIGJ1cy5vbi5hcHBseShidXMsIGFyZ3MpO1xuXG4gIHRoaXMuX2xpc3RlbmVycy5wdXNoKHtcbiAgICBldmVudE5hbWU6IGV2ZW50TmFtZSxcbiAgICBoYW5kbGVyOiBoYW5kbGVyLFxuICAgIG9yaWdpbmFsSGFuZGxlcjogb3JpZ2luYWxIYW5kbGVyXG4gIH0pO1xufTtcblxuU2VhbWxlc3NwYXlCdXMucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbiAoZXZlbnROYW1lKSB7XG4gIHZhciBhcmdzO1xuXG4gIGlmICh0aGlzLl9pc0Rlc3Ryb3llZCkgeyByZXR1cm47IH1cblxuICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgYXJnc1swXSA9IHRoaXMuX25hbWVzcGFjZUV2ZW50KGV2ZW50TmFtZSk7XG5cbiAgdGhpcy5fbG9nKCdlbWl0JywgYXJncyk7XG4gIGJ1cy5lbWl0LmFwcGx5KGJ1cywgYXJncyk7XG59O1xuXG5TZWFtbGVzc3BheUJ1cy5wcm90b3R5cGUuX29mZkRpcmVjdCA9IGZ1bmN0aW9uIChldmVudE5hbWUpIHtcbiAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuXG4gIGlmICh0aGlzLl9pc0Rlc3Ryb3llZCkgeyByZXR1cm47IH1cblxuICBhcmdzWzBdID0gdGhpcy5fbmFtZXNwYWNlRXZlbnQoZXZlbnROYW1lKTtcblxuICB0aGlzLl9sb2coJ29mZicsIGFyZ3MpO1xuICBidXMub2ZmLmFwcGx5KGJ1cywgYXJncyk7XG59O1xuXG5TZWFtbGVzc3BheUJ1cy5wcm90b3R5cGUub2ZmID0gZnVuY3Rpb24gKGV2ZW50TmFtZSwgb3JpZ2luYWxIYW5kbGVyKSB7XG4gIHZhciBpLCBsaXN0ZW5lcjtcbiAgdmFyIGhhbmRsZXIgPSBvcmlnaW5hbEhhbmRsZXI7XG5cbiAgaWYgKHRoaXMuX2lzRGVzdHJveWVkKSB7IHJldHVybjsgfVxuXG4gIGlmICh0aGlzLm1lcmNoYW50VXJsKSB7XG4gICAgZm9yIChpID0gMDsgaSA8IHRoaXMuX2xpc3RlbmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgbGlzdGVuZXIgPSB0aGlzLl9saXN0ZW5lcnNbaV07XG5cbiAgICAgIGlmIChsaXN0ZW5lci5vcmlnaW5hbEhhbmRsZXIgPT09IG9yaWdpbmFsSGFuZGxlcikge1xuICAgICAgICBoYW5kbGVyID0gbGlzdGVuZXIuaGFuZGxlcjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB0aGlzLl9vZmZEaXJlY3QoZXZlbnROYW1lLCBoYW5kbGVyKTtcbn07XG5cblNlYW1sZXNzcGF5QnVzLnByb3RvdHlwZS5fbmFtZXNwYWNlRXZlbnQgPSBmdW5jdGlvbiAoZXZlbnROYW1lKSB7XG4gIHJldHVybiBbJ3NlYW1sZXNzcGF5JywgdGhpcy5jaGFubmVsLCBldmVudE5hbWVdLmpvaW4oJzonKTtcbn07XG5cblNlYW1sZXNzcGF5QnVzLnByb3RvdHlwZS50ZWFyZG93biA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGxpc3RlbmVyLCBpO1xuXG4gIGZvciAoaSA9IDA7IGkgPCB0aGlzLl9saXN0ZW5lcnMubGVuZ3RoOyBpKyspIHtcbiAgICBsaXN0ZW5lciA9IHRoaXMuX2xpc3RlbmVyc1tpXTtcbiAgICB0aGlzLl9vZmZEaXJlY3QobGlzdGVuZXIuZXZlbnROYW1lLCBsaXN0ZW5lci5oYW5kbGVyKTtcbiAgfVxuXG4gIHRoaXMuX2xpc3RlbmVycy5sZW5ndGggPSAwO1xuXG4gIHRoaXMuX2lzRGVzdHJveWVkID0gdHJ1ZTtcbn07XG5cblNlYW1sZXNzcGF5QnVzLnByb3RvdHlwZS5fbG9nID0gZnVuY3Rpb24gKGZ1bmN0aW9uTmFtZSwgYXJncykge1xuICBpZiAodGhpcy5faXNWZXJib3NlKSB7XG4gICAgY29uc29sZS5sb2coZnVuY3Rpb25OYW1lLCBhcmdzKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gIH1cbn07XG5cblNlYW1sZXNzcGF5QnVzLmV2ZW50cyA9IGV2ZW50cztcblxubW9kdWxlLmV4cG9ydHMgPSBTZWFtbGVzc3BheUJ1cztcbiIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gX2NsYXNzZXNPZihlbGVtZW50KSB7XG4gIHJldHVybiBlbGVtZW50LmNsYXNzTmFtZS50cmltKCkuc3BsaXQoL1xccysvKTtcbn1cblxuZnVuY3Rpb24gYWRkKGVsZW1lbnQpIHtcbiAgdmFyIHRvQWRkID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgdmFyIGNsYXNzTmFtZSA9IF9jbGFzc2VzT2YoZWxlbWVudCkuZmlsdGVyKGZ1bmN0aW9uIChjbGFzc25hbWUpIHtcbiAgICByZXR1cm4gdG9BZGQuaW5kZXhPZihjbGFzc25hbWUpID09PSAtMTtcbiAgfSkuY29uY2F0KHRvQWRkKS5qb2luKCcgJyk7XG5cbiAgZWxlbWVudC5jbGFzc05hbWUgPSBjbGFzc05hbWU7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZShlbGVtZW50KSB7XG4gIHZhciB0b1JlbW92ZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gIHZhciBjbGFzc05hbWUgPSBfY2xhc3Nlc09mKGVsZW1lbnQpLmZpbHRlcihmdW5jdGlvbiAoY2xhc3NuYW1lKSB7XG4gICAgcmV0dXJuIHRvUmVtb3ZlLmluZGV4T2YoY2xhc3NuYW1lKSA9PT0gLTE7XG4gIH0pLmpvaW4oJyAnKTtcblxuICBlbGVtZW50LmNsYXNzTmFtZSA9IGNsYXNzTmFtZTtcbn1cblxuZnVuY3Rpb24gdG9nZ2xlKGVsZW1lbnQsIGNsYXNzbmFtZSwgYWRkaW5nKSB7XG4gIGlmIChhZGRpbmcpIHtcbiAgICBhZGQoZWxlbWVudCwgY2xhc3NuYW1lKTtcbiAgfSBlbHNlIHtcbiAgICByZW1vdmUoZWxlbWVudCwgY2xhc3NuYW1lKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYWRkOiBhZGQsXG4gIHJlbW92ZTogcmVtb3ZlLFxuICB0b2dnbGU6IHRvZ2dsZVxufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBjb25zdGFudHMgPSByZXF1aXJlKCcuLi9jYXJkLWVsZW1lbnQvc2hhcmVkL2NvbnN0YW50cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvbXBvc2VVcmwoY29uZmlnLCB0eXBlLCBjb21wb25lbnRJZCwgaXNEZWJ1Zykge1xuICB2YXIgYXNzZXRzVXJsID0gY29uZmlnLmdhdGV3YXlDb25maWd1cmF0aW9uLmFzc2V0c1VybDtcblxuICBpZiAoaXNEZWJ1Zykge1xuICAgIGFzc2V0c1VybCA9IGFzc2V0c1VybC5yZXBsYWNlKCdodHRwcycsICdodHRwJyk7XG4gIH1cbiAgdmFyIG1pbiA9IGlzRGVidWcgPyAnJyA6ICcubWluJztcblxuICByZXR1cm4gYXNzZXRzVXJsICsgJy8nICsgY29uc3RhbnRzLlZFUlNJT04gKyAnL2h0bWwvJyArIHR5cGUgKyAnLWZyYW1lJyArIG1pbiArICcuaHRtbCMnICsgY29tcG9uZW50SWQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgVkVSU0lPTjogXCJ3ZWItc2RrXCIsXG4gIEFTU0VUU19IT1NUOiBcImh0dHBzOi8vd2ViLXNkay1leGFtcGxlcy5zZWFtbGVzc3BheS5kZXZcIixcbiAgQVNTRVRTX1MzX0JVQ0tFVDogXCJ3ZWItc2RrLnNlYW1sZXNzcGF5LmNvbVwiLFxuICBBUElfVVJMX1BST0RVQ1RJT046IFwiaHR0cHM6Ly9hcGkuc2VhbWxlc3NwYXkuY29tXCIsXG4gIEFQSV9VUkxfU0FOREJPWDogXCJodHRwczovL2FwaS5zYW5kYm94LnNlYW1sZXNzcGF5LmNvbVwiLFxuICBBUElfVVJMX1NUQUdJTkc6IFwiaHR0cHM6Ly9hcGkuc2VhbWxlc3NwYXkuZGV2XCIsXG4gIFBBTl9WQVVMVF9VUkxfUFJPRFVDVElPTjogXCJodHRwczovL3Bhbi12YXVsdC5zZWFtbGVzc3BheS5jb21cIixcbiAgUEFOX1ZBVUxUX1VSTF9TQU5EQk9YOiBcImh0dHBzOi8vcGFuLXZhdWx0LnNhbmRib3guc2VhbWxlc3NwYXkuY29tXCIsXG4gIFBBTl9WQVVMVF9VUkxfU1RBR0lORzogXCJodHRwczovL3Bhbi12YXVsdC5zZWFtbGVzc3BheS5kZXZcIixcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBTZWFtbGVzc3BheUVycm9yID0gcmVxdWlyZSgnLi9zZWFtbGVzc3BheS1lcnJvcicpO1xudmFyIHNoYXJlZEVycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGluc3RhbmNlLCBtZXRob2ROYW1lcykge1xuICBtZXRob2ROYW1lcy5mb3JFYWNoKGZ1bmN0aW9uIChtZXRob2ROYW1lKSB7XG4gICAgaW5zdGFuY2VbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICB0aHJvdyBuZXcgU2VhbWxlc3NwYXlFcnJvcih7XG4gICAgICAgIHR5cGU6IHNoYXJlZEVycm9ycy5NRVRIT0RfQ0FMTEVEX0FGVEVSX1RFQVJET1dOLnR5cGUsXG4gICAgICAgIGNvZGU6IHNoYXJlZEVycm9ycy5NRVRIT0RfQ0FMTEVEX0FGVEVSX1RFQVJET1dOLmNvZGUsXG4gICAgICAgIG1lc3NhZ2U6IG1ldGhvZE5hbWUgKyAnIGNhbm5vdCBiZSBjYWxsZWQgYWZ0ZXIgdGVhcmRvd24uJ1xuICAgICAgfSk7XG4gICAgfTtcbiAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgU2VhbWxlc3NwYXlFcnJvciA9IHJlcXVpcmUoJy4vc2VhbWxlc3NwYXktZXJyb3InKTtcblxuZnVuY3Rpb24gY29udmVydFRvU2VhbWxlc3NwYXlFcnJvcihvcmlnaW5hbEVyciwgb3RoZXJFcnJvck9iamVjdCkge1xuICBpZiAob3JpZ2luYWxFcnIgaW5zdGFuY2VvZiBTZWFtbGVzc3BheUVycm9yIHx8IChvcmlnaW5hbEVyciAmJiBvcmlnaW5hbEVyci5uYW1lID09PSAnU2VhbWxlc3NwYXlFcnJvcicpKSB7XG4gICAgcmV0dXJuIG9yaWdpbmFsRXJyO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBTZWFtbGVzc3BheUVycm9yKHtcbiAgICB0eXBlOiBvdGhlckVycm9yT2JqZWN0LnR5cGUsXG4gICAgY29kZTogb3RoZXJFcnJvck9iamVjdC5jb2RlLFxuICAgIG1lc3NhZ2U6IG90aGVyRXJyb3JPYmplY3QubWVzc2FnZSxcbiAgICBkZXRhaWxzOiB7XG4gICAgICBvcmlnaW5hbEVycm9yOiBvcmlnaW5hbEVyclxuICAgIH1cbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29udmVydFRvU2VhbWxlc3NwYXlFcnJvcjtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJ0b2EgPSByZXF1aXJlKCcuLi9saWIvcG9seWZpbGwnKS5idG9hO1xuXG52YXIgY29uc3RhbnRzID0gcmVxdWlyZSgnLi4vaG9zdGVkLWZpZWxkcy9zaGFyZWQvY29uc3RhbnRzJyk7XG5cbmZ1bmN0aW9uIF9pc0NoZWNrb3V0S2V5KHN0cikge1xuICB0cnkge1xuICAgIHJldHVybiBzdHIuaW5jbHVkZXMoJ0NIUycpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2lzT3RwVG9rZW4oc3RyKSB7XG4gIHZhciBvdHBUb2tlblJFID0gL15PVFBfWzAtOWEtZkEtRl17OH1cXGItWzAtOWEtZkEtRl17NH1cXGItWzAtOWEtZkEtRl17NH1cXGItWzAtOWEtZkEtRl17NH1cXGItWzAtOWEtZkEtRl17MTJ9JC87XG4gIHJldHVybiBvdHBUb2tlblJFLnRlc3Qoc3RyKTtcbn1cblxuZnVuY3Rpb24gX2lzVG9rZW5pemF0aW9uS2V5KHN0cikge1xuICByZXR1cm4gL15bYS16XStfW2EtekEtWjAtOV0rX1thLXpBLVowLTldKyQvLnRlc3Qoc3RyKSB8fCAvXlthLXpdK19bYS16QS1aMC05XSskLy50ZXN0KHN0cik7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUF1dGhvcml6YXRpb25EYXRhKGF1dGhvcml6YXRpb24pIHtcbiAgdmFyIGRhdGEgPSB7XG4gICAgYXR0cnM6IHt9LFxuICB9O1xuXG4gIHZhciBzZWxlY3RlZEF1dGggPSBbXG4gICAge1xuICAgICAgaXNBdXRoOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBfaXNDaGVja291dEtleShhdXRob3JpemF0aW9uKTtcbiAgICAgIH0sXG4gICAgICBzZXREYXRhOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGRhdGEuYXR0cnMudG9rZW5UeXBlID0gY29uc3RhbnRzLlRPS0VOX1RZUEVfQ0hFQ0tPVVQ7XG4gICAgICAgIGRhdGEuYXR0cnMudG9rZW5pemF0aW9uS2V5ID0gYXV0aG9yaXphdGlvbjtcbiAgICAgICAgZGF0YS5hY2Nlc3NUb2tlbiA9IGJ0b2EoYXV0aG9yaXphdGlvbiwgeyBpc1NlbnNpdGl2ZTogdHJ1ZSB9KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgIGlzQXV0aDogZnVuY3Rpb24gKCkgeyByZXR1cm4gX2lzT3RwVG9rZW4oYXV0aG9yaXphdGlvbik7IH0sXG4gICAgICBzZXREYXRhOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGRhdGEuYXR0cnMudG9rZW5pemF0aW9uS2V5ID0gYXV0aG9yaXphdGlvbjtcbiAgICAgICAgZGF0YS5hY2Nlc3NUb2tlbiA9IGF1dGhvcml6YXRpb247XG4gICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICBpc0F1dGg6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIF9pc1Rva2VuaXphdGlvbktleShhdXRob3JpemF0aW9uKTsgfSxcbiAgICAgIHNldERhdGE6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZGF0YS5hdHRycy50b2tlbml6YXRpb25LZXkgPSBhdXRob3JpemF0aW9uO1xuICAgICAgICBkYXRhLmFjY2Vzc1Rva2VuID0gYnRvYShhdXRob3JpemF0aW9uLCB7IGlzU2Vuc2l0aXZlOiB0cnVlIH0pO1xuICAgICAgfVxuICAgIH1cbiAgXS5maWx0ZXIoZnVuY3Rpb24gKGF1dGgpIHtcbiAgICByZXR1cm4gYXV0aC5pc0F1dGgoKVxuICB9KS5zaGlmdCgpO1xuXG4gIHNlbGVjdGVkQXV0aC5zZXREYXRhKClcblxuICByZXR1cm4gZGF0YTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVBdXRob3JpemF0aW9uRGF0YTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAvLyBJRTkgZG9lc24ndCBzdXBwb3J0IHBhc3NpbmcgYXJndW1lbnRzIHRvIHNldFRpbWVvdXQgc28gd2UgaGF2ZSB0byBlbXVsYXRlIGl0LlxuICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBmbi5hcHBseShudWxsLCBhcmdzKTtcbiAgICB9LCAxKTtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBiYXRjaEV4ZWN1dGVGdW5jdGlvbnMgPSByZXF1aXJlKCcuL2JhdGNoLWV4ZWN1dGUtZnVuY3Rpb25zJyk7XG5cbmZ1bmN0aW9uIERlc3RydWN0b3IoKSB7XG4gIHRoaXMuX3RlYXJkb3duUmVnaXN0cnkgPSBbXTtcblxuICB0aGlzLl9pc1RlYXJpbmdEb3duID0gZmFsc2U7XG59XG5cbkRlc3RydWN0b3IucHJvdG90eXBlLnJlZ2lzdGVyRnVuY3Rpb25Gb3JUZWFyZG93biA9IGZ1bmN0aW9uIChmbikge1xuICBpZiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhpcy5fdGVhcmRvd25SZWdpc3RyeS5wdXNoKGZuKTtcbiAgfVxufTtcblxuRGVzdHJ1Y3Rvci5wcm90b3R5cGUudGVhcmRvd24gPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgaWYgKHRoaXMuX2lzVGVhcmluZ0Rvd24pIHtcbiAgICBjYWxsYmFjayhuZXcgRXJyb3IoJ0Rlc3RydWN0b3IgaXMgYWxyZWFkeSB0ZWFyaW5nIGRvd24nKSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdGhpcy5faXNUZWFyaW5nRG93biA9IHRydWU7XG5cbiAgYmF0Y2hFeGVjdXRlRnVuY3Rpb25zKHRoaXMuX3RlYXJkb3duUmVnaXN0cnksIGZ1bmN0aW9uIChlcnIpIHtcbiAgICB0aGlzLl90ZWFyZG93blJlZ2lzdHJ5ID0gW107XG4gICAgdGhpcy5faXNUZWFyaW5nRG93biA9IGZhbHNlO1xuXG4gICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICB9XG4gIH0uYmluZCh0aGlzKSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IERlc3RydWN0b3I7XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIGVudW1lcmF0ZSh2YWx1ZXMsIHByZWZpeCkge1xuICBwcmVmaXggPSBwcmVmaXggPT0gbnVsbCA/ICcnIDogcHJlZml4O1xuXG4gIHJldHVybiB2YWx1ZXMucmVkdWNlKGZ1bmN0aW9uIChlbnVtZXJhdGlvbiwgdmFsdWUpIHtcbiAgICBlbnVtZXJhdGlvblt2YWx1ZV0gPSBwcmVmaXggKyB2YWx1ZTtcbiAgICByZXR1cm4gZW51bWVyYXRpb247XG4gIH0sIHt9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBlbnVtZXJhdGU7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBlbnVtZXJhdGUgPSByZXF1aXJlKCcuL2VudW1lcmF0ZScpO1xuXG4vKipcbiAqIEBjbGFzc1xuICogQGdsb2JhbFxuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgQ29uc3RydWN0aW9uIG9wdGlvbnNcbiAqIEBjbGFzc2Rlc2MgVGhpcyBjbGFzcyBpcyB1c2VkIHRvIHJlcG9ydCBlcnJvciBjb25kaXRpb25zLCBmcmVxdWVudGx5IGFzIHRoZSBmaXJzdCBwYXJhbWV0ZXIgdG8gY2FsbGJhY2tzIHRocm91Z2hvdXQgdGhlIFNlYW1sZXNzcGF5IFNESy5cbiAqIEBkZXNjcmlwdGlvbiA8c3Ryb25nPllvdSBjYW5ub3QgdXNlIHRoaXMgY29uc3RydWN0b3IgZGlyZWN0bHkuIEludGVyYWN0IHdpdGggaW5zdGFuY2VzIG9mIHRoaXMgY2xhc3MgdGhyb3VnaCB7QGxpbmsgY2FsbGJhY2sgY2FsbGJhY2tzfS48L3N0cm9uZz5cbiAqL1xuZnVuY3Rpb24gU2VhbWxlc3NwYXlFcnJvcihvcHRpb25zKSB7XG4gIGlmICghU2VhbWxlc3NwYXlFcnJvci50eXBlcy5oYXNPd25Qcm9wZXJ0eShvcHRpb25zLnR5cGUpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKG9wdGlvbnMudHlwZSArICcgaXMgbm90IGEgdmFsaWQgdHlwZS4nKTtcbiAgfVxuXG4gIGlmICghb3B0aW9ucy5jb2RlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdFcnJvciBjb2RlIHJlcXVpcmVkLicpO1xuICB9XG5cbiAgaWYgKCFvcHRpb25zLm1lc3NhZ2UpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yIG1lc3NhZ2UgcmVxdWlyZWQuJyk7XG4gIH1cblxuICB0aGlzLm5hbWUgPSAnU2VhbWxlc3NwYXlFcnJvcic7XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqIEBkZXNjcmlwdGlvbiBBIGNvZGUgdGhhdCBjb3JyZXNwb25kcyB0byBzcGVjaWZpYyBlcnJvcnMuXG4gICAqL1xuICB0aGlzLmNvZGUgPSBvcHRpb25zLmNvZGU7XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqIEBkZXNjcmlwdGlvbiBBIHNob3J0IGRlc2NyaXB0aW9uIG9mIHRoZSBlcnJvci5cbiAgICovXG4gIHRoaXMubWVzc2FnZSA9IG9wdGlvbnMubWVzc2FnZTtcblxuICAvKipcbiAgICogQHR5cGUge1NlYW1sZXNzcGF5RXJyb3IudHlwZXN9XG4gICAqIEBkZXNjcmlwdGlvbiBUaGUgdHlwZSBvZiBlcnJvci5cbiAgICovXG4gIHRoaXMudHlwZSA9IG9wdGlvbnMudHlwZTtcblxuICAvKipcbiAgICogQHR5cGUge29iamVjdD19XG4gICAqIEBkZXNjcmlwdGlvbiBBZGRpdGlvbmFsIGluZm9ybWF0aW9uIGFib3V0IHRoZSBlcnJvciwgc3VjaCBhcyBhbiB1bmRlcmx5aW5nIG5ldHdvcmsgZXJyb3IgcmVzcG9uc2UuXG4gICAqL1xuICB0aGlzLmRldGFpbHMgPSBvcHRpb25zLmRldGFpbHM7XG59XG5cblNlYW1sZXNzcGF5RXJyb3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFcnJvci5wcm90b3R5cGUpO1xuU2VhbWxlc3NwYXlFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBTZWFtbGVzc3BheUVycm9yO1xuXG4vKipcbiAqIEVudW0gZm9yIHtAbGluayBTZWFtbGVzc3BheUVycm9yfSB0eXBlcy5cbiAqIEBuYW1lIFNlYW1sZXNzcGF5RXJyb3IudHlwZXNcbiAqIEBlbnVtXG4gKiBAcmVhZG9ubHlcbiAqIEBtZW1iZXJvZiBTZWFtbGVzc3BheUVycm9yXG4gKiBAcHJvcGVydHkge3N0cmluZ30gQ1VTVE9NRVIgQW4gZXJyb3IgY2F1c2VkIGJ5IHRoZSBjdXN0b21lci5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBNRVJDSEFOVCBBbiBlcnJvciB0aGF0IGlzIGFjdGlvbmFibGUgYnkgdGhlIG1lcmNoYW50LlxuICogQHByb3BlcnR5IHtzdHJpbmd9IE5FVFdPUksgQW4gZXJyb3IgZHVlIHRvIGEgbmV0d29yayBwcm9ibGVtLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IElOVEVSTkFMIEFuIGVycm9yIGNhdXNlZCBieSBTZWFtbGVzc3BheSBjb2RlLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IFVOS05PV04gQW4gZXJyb3Igd2hlcmUgdGhlIG9yaWdpbiBpcyB1bmtub3duLlxuICovXG5TZWFtbGVzc3BheUVycm9yLnR5cGVzID0gZW51bWVyYXRlKFtcbiAgJ0NVU1RPTUVSJyxcbiAgJ01FUkNIQU5UJyxcbiAgJ05FVFdPUksnLFxuICAnSU5URVJOQUwnLFxuICAnVU5LTk9XTidcbl0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNlYW1sZXNzcGF5RXJyb3I7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBTZWFtbGVzc3BheUVycm9yID0gcmVxdWlyZSgnLi9zZWFtbGVzc3BheS1lcnJvcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgSU5WQUxJRF9VU0VfT0ZfSU5URVJOQUxfRlVOQ1RJT046IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLklOVEVSTkFMLFxuICAgIGNvZGU6ICdJTlZBTElEX1VTRV9PRl9JTlRFUk5BTF9GVU5DVElPTidcbiAgfSxcbiAgQ0FMTEJBQ0tfUkVRVUlSRUQ6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLk1FUkNIQU5ULFxuICAgIGNvZGU6ICdDQUxMQkFDS19SRVFVSVJFRCdcbiAgfSxcbiAgSU5TVEFOVElBVElPTl9PUFRJT05fUkVRVUlSRUQ6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLk1FUkNIQU5ULFxuICAgIGNvZGU6ICdJTlNUQU5USUFUSU9OX09QVElPTl9SRVFVSVJFRCdcbiAgfSxcbiAgSU5WQUxJRF9PUFRJT046IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLk1FUkNIQU5ULFxuICAgIGNvZGU6ICdJTlZBTElEX09QVElPTidcbiAgfSxcbiAgSU5DT01QQVRJQkxFX1ZFUlNJT05TOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnSU5DT01QQVRJQkxFX1ZFUlNJT05TJ1xuICB9LFxuICBJTkNPTVBBVElCTEVfRklFTERTX1NFVDoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTUVSQ0hBTlQsXG4gICAgY29kZTogJ0lOQ09NUEFUSUJMRV9GSUVMRFNfU0VUJ1xuICB9LFxuICBNRVRIT0RfQ0FMTEVEX0FGVEVSX1RFQVJET1dOOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnTUVUSE9EX0NBTExFRF9BRlRFUl9URUFSRE9XTidcbiAgfSxcbiAgU0VBTUxFU1NQQVlfQVBJX0FDQ0VTU19SRVNUUklDVEVEOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnU0VBTUxFU1NQQVlfQVBJX0FDQ0VTU19SRVNUUklDVEVEJyxcbiAgICBtZXNzYWdlOiAnWW91ciBhY2Nlc3MgaXMgcmVzdHJpY3RlZCBhbmQgY2Fubm90IHVzZSB0aGlzIHBhcnQgb2YgdGhlIFNlYW1sZXNzcGF5IEFQSS4nXG4gIH0sXG4gIFNFQU1MRVNTUEFZX1BBWVBBTF9OT1RfTE9BREVEOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5JTlRFUk5BTCxcbiAgICBjb2RlOiAnU0VBTUxFU1NQQVlfUEFZUEFMX05PVF9MT0FERUQnLFxuICAgIG1lc3NhZ2U6ICdQYXlwYWwgU0RLIGNvdWxkIG5vdCBiZSBsb2FkZWQuJ1xuICB9LFxuICBJTlZBTElEX0xBVElOMV9TVFJJTkc6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLklOVEVSTkFMLFxuICAgIGNvZGU6ICdJTlZBTElEX0xBVElOMV9TVFJJTkcnXG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0ge307XG59XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBmdW5jdGlvbiAoZXZlbnQsIGNhbGxiYWNrKSB7XG4gIGlmICh0aGlzLl9ldmVudHNbZXZlbnRdKSB7XG4gICAgdGhpcy5fZXZlbnRzW2V2ZW50XS5wdXNoKGNhbGxiYWNrKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLl9ldmVudHNbZXZlbnRdID0gW2NhbGxiYWNrXTtcbiAgfVxufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZW1pdCA9IGZ1bmN0aW9uIChldmVudCkge1xuICB2YXIgaSwgYXJncztcbiAgdmFyIGNhbGxiYWNrcyA9IHRoaXMuX2V2ZW50c1tldmVudF07XG5cbiAgaWYgKCFjYWxsYmFja3MpIHsgcmV0dXJuOyB9XG5cbiAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG5cbiAgZm9yIChpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xuICAgIGNhbGxiYWNrc1tpXS5hcHBseShudWxsLCBhcmdzKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNJb3ModXNlckFnZW50KSB7XG4gIHVzZXJBZ2VudCA9IHVzZXJBZ2VudCB8fCBuYXZpZ2F0b3IudXNlckFnZW50O1xuICByZXR1cm4gLyhpUGFkfGlQaG9uZXxpUG9kKS9pLnRlc3QodXNlckFnZW50KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBBUElfSE9TVCA9IHVuZGVmaW5lZDtcbnZhciBQQU5WQVVMVF9IT1NUID0gdW5kZWZpbmVkO1xudmFyIEFTU0VUU19IT1NUID0gXCJodHRwOi8vbG9jYWxob3N0OjMwMDEvZGV2XCI7XG5cbnZhciBsZWdhbEhvc3RzID0gW1xuICAnc2VhbWxlc3NwYXkuY29tJyxcbiAgJ3NlYW1sZXNzcGF5LmRldicsXG4gICdzZWFtbGVzc3BheS5pbycsXG4gICd3ZWItc2RrLnNlYW1sZXNzcGF5LmNvbScsXG4gICdhcGkuc2VhbWxlc3NwYXkuY29tJyxcbiAgJ2FwaS5zZWFtbGVzc3BheS5kZXYnLFxuICAnYXBpLnNlYW1sZXNzcGF5LmlvJyxcbiAgJ3Bhbi12YXVsdC5zZWFtbGVzc3BheS5jb20nLFxuICAncGFuLXZhdWx0LnNlYW1sZXNzcGF5LmRldicsXG4gICdwYW4tdmF1bHQuc2VhbWxlc3NwYXkuaW8nLFxuICAnYXBpLnNhbmRib3guc2VhbWxlc3NwYXkuY29tJyxcbiAgJ2FwaS5zYW5kYm94LnNlYW1sZXNzcGF5LmRldicsXG4gICdhcGkuc2FuZGJveC5zZWFtbGVzc3BheS5pbycsXG4gICdwYW4tdmF1bHQuc2FuZGJveC5zZWFtbGVzc3BheS5jb20nLFxuICAncGFuLXZhdWx0LnNhbmRib3guc2VhbWxlc3NwYXkuZGV2JyxcbiAgJ3Bhbi12YXVsdC5zYW5kYm94LnNlYW1sZXNzcGF5LmlvJ1xuXTtcblxuLy8gcmVtb3ZlSWYocHJvZHVjdGlvbilcbmxlZ2FsSG9zdHMucHVzaCgnbG9jYWxob3N0Jyk7XG5pZiAoQVBJX0hPU1QpIHtcbiAgbGVnYWxIb3N0cy5wdXNoKHN0cmlwU3ViZG9tYWlucyhBUElfSE9TVCkpO1xufVxuaWYgKFBBTlZBVUxUX0hPU1QpIHtcbiAgbGVnYWxIb3N0cy5wdXNoKHN0cmlwU3ViZG9tYWlucyhQQU5WQVVMVF9IT1NUKSk7XG59XG5pZiAoQVNTRVRTX0hPU1QpIHtcbiAgbGVnYWxIb3N0cy5wdXNoKHN0cmlwU3ViZG9tYWlucyhBU1NFVFNfSE9TVCkucmVwbGFjZSgnaHR0cDovLycsICcnKS5yZXBsYWNlKCdodHRwczovLycsICcnKSk7XG59XG4vLyBlbmRSZW1vdmVJZihwcm9kdWN0aW9uKVxuXG5mdW5jdGlvbiBzdHJpcFN1YmRvbWFpbnMoZG9tYWluKSB7XG4gIHJldHVybiBkb21haW4uc3BsaXQoJy4nKS5zbGljZSgtMikuam9pbignLicpO1xufVxuXG5mdW5jdGlvbiBpc1doaXRlbGlzdGVkRG9tYWluKHVybCkge1xuICAvLyB2YXIgbWFpbkRvbWFpbjtcblxuICAvLyB1cmwgPSB1cmwudG9Mb3dlckNhc2UoKTtcblxuICAvLyBpZiAoIShuZXcgUmVnRXhwKCdeaHR0cHM/OicpKS50ZXN0KHVybCkpIHtcbiAgLy8gICByZXR1cm4gZmFsc2U7XG4gIC8vIH1cblxuICAvLyBwYXJzZXIgPSBwYXJzZXIgfHwgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAvLyBwYXJzZXIuaHJlZiA9IHVybDtcbiAgLy8gbWFpbkRvbWFpbiA9IHN0cmlwU3ViZG9tYWlucyhwYXJzZXIuaG9zdG5hbWUpO1xuICB0cnkge1xuICAgIHZhciBwYXJzZWRVcmwgPSBuZXcgVVJMKHVybCk7XG4gICAgcmV0dXJuIGxlZ2FsSG9zdHMuaW5kZXhPZihzdHJpcFN1YmRvbWFpbnMocGFyc2VkVXJsLmhvc3RuYW1lKSkgIT09IC0xO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNXaGl0ZWxpc3RlZERvbWFpbjtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhvYmopLmZpbHRlcihmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIHR5cGVvZiBvYmpba2V5XSA9PT0gJ2Z1bmN0aW9uJztcbiAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIFNlYW1sZXNzcGF5RXJyb3IgPSByZXF1aXJlKCcuL3NlYW1sZXNzcGF5LWVycm9yJyk7XG52YXIgc2hhcmVkRXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMnKTtcblxudmFyIGF0b2JOb3JtYWxpemVkID0gdHlwZW9mIGdsb2JhbC5hdG9iID09PSAnZnVuY3Rpb24nID8gZ2xvYmFsLmF0b2IgOiBhdG9iO1xudmFyIGJ0b2FOb3JtYWxpemVkID0gdHlwZW9mIGdsb2JhbC5idG9hID09PSAnZnVuY3Rpb24nID8gZ2xvYmFsLmJ0b2EgOiBidG9hO1xudmFyIGNoYXJhY3RlcnMgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLz0nO1xuXG5mdW5jdGlvbiBhdG9iKGJhc2U2NFN0cmluZykge1xuICB2YXIgYSwgYiwgYywgYjEsIGIyLCBiMywgYjQsIGk7XG4gIHZhciBiYXNlNjRNYXRjaGVyID0gbmV3IFJlZ0V4cCgnXig/OltBLVphLXowLTkrL117NH0pKig/OltBLVphLXowLTkrL117Mn09PXxbQS1aYS16MC05Ky9dezN9PXxbQS1aYS16MC05Ky9dezR9KShbPV17MSwyfSk/JCcpO1xuICB2YXIgcmVzdWx0ID0gJyc7XG4gIGlmICghYmFzZTY0TWF0Y2hlci50ZXN0KGJhc2U2NFN0cmluZykpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vbiBiYXNlNjQgZW5jb2RlZCBpbnB1dCBwYXNzZWQgdG8gd2luZG93LmF0b2IgcG9seWZpbGwnKTtcbiAgfVxuXG4gIGkgPSAwO1xuICBkbyB7XG4gICAgYjEgPSBjaGFyYWN0ZXJzLmluZGV4T2YoYmFzZTY0U3RyaW5nLmNoYXJBdChpKyspKTtcbiAgICBiMiA9IGNoYXJhY3RlcnMuaW5kZXhPZihiYXNlNjRTdHJpbmcuY2hhckF0KGkrKykpO1xuICAgIGIzID0gY2hhcmFjdGVycy5pbmRleE9mKGJhc2U2NFN0cmluZy5jaGFyQXQoaSsrKSk7XG4gICAgYjQgPSBjaGFyYWN0ZXJzLmluZGV4T2YoYmFzZTY0U3RyaW5nLmNoYXJBdChpKyspKTtcblxuICAgIGEgPSAoYjEgJiAweDNGKSA8PCAyIHwgYjIgPj4gNCAmIDB4MztcbiAgICBiID0gKGIyICYgMHhGKSA8PCA0IHwgYjMgPj4gMiAmIDB4RjtcbiAgICBjID0gKGIzICYgMHgzKSA8PCA2IHwgYjQgJiAweDNGO1xuXG4gICAgcmVzdWx0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYSkgKyAoYiA/IFN0cmluZy5mcm9tQ2hhckNvZGUoYikgOiAnJykgKyAoYyA/IFN0cmluZy5mcm9tQ2hhckNvZGUoYykgOiAnJyk7XG4gIH0gd2hpbGUgKGkgPCBiYXNlNjRTdHJpbmcubGVuZ3RoKTtcblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBidG9hKHN0cmluZykge1xuICBzdHJpbmcgPSBTdHJpbmcoc3RyaW5nKTtcbiAgdmFyIGJpdG1hcCwgYSwgYiwgYyxcbiAgICByZXN1bHQgPSBcIlwiLCBpID0gMCxcbiAgICByZXN0ID0gc3RyaW5nLmxlbmd0aCAlIDM7IC8vIFRvIGRldGVybWluZSB0aGUgZmluYWwgcGFkZGluZ1xuXG4gIGZvciAoOyBpIDwgc3RyaW5nLmxlbmd0aDspIHtcbiAgICBpZiAoKGEgPSBzdHJpbmcuY2hhckNvZGVBdChpKyspKSA+IDI1NVxuICAgICAgfHwgKGIgPSBzdHJpbmcuY2hhckNvZGVBdChpKyspKSA+IDI1NVxuICAgICAgfHwgKGMgPSBzdHJpbmcuY2hhckNvZGVBdChpKyspKSA+IDI1NSlcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJGYWlsZWQgdG8gZXhlY3V0ZSAnYnRvYScgb24gJ1dpbmRvdyc6IFRoZSBzdHJpbmcgdG8gYmUgZW5jb2RlZCBjb250YWlucyBjaGFyYWN0ZXJzIG91dHNpZGUgb2YgdGhlIExhdGluMSByYW5nZS5cIik7XG4gICAgYml0bWFwID0gKGEgPDwgMTYpIHwgKGIgPDwgOCkgfCBjO1xuICAgIHJlc3VsdCArPSBjaGFyYWN0ZXJzLmNoYXJBdChiaXRtYXAgPj4gMTggJiA2MykgKyBjaGFyYWN0ZXJzLmNoYXJBdChiaXRtYXAgPj4gMTIgJiA2MylcbiAgICAgICsgY2hhcmFjdGVycy5jaGFyQXQoYml0bWFwID4+IDYgJiA2MykgKyBjaGFyYWN0ZXJzLmNoYXJBdChiaXRtYXAgJiA2Myk7XG4gIH1cbiAgLy8gSWYgdGhlcmUncyBuZWVkIG9mIHBhZGRpbmcsIHJlcGxhY2UgdGhlIGxhc3QgJ0EncyB3aXRoIGVxdWFsIHNpZ25zXG4gIHJldHVybiByZXN0ID8gcmVzdWx0LnNsaWNlKDAsIHJlc3QgLSAzKSArIFwiPT09XCIuc3Vic3RyaW5nKHJlc3QpIDogcmVzdWx0O1xufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZUxhdGluMUNoYXJhY3RlcnNEZWNvcmF0b3IoZnVuYykge1xuICByZXR1cm4gZnVuY3Rpb24gKHN0cmluZywgb3B0aW9ucykge1xuICAgIHZhciBpc1NlbnNpdGl2ZSA9IChvcHRpb25zIHx8IHt9KS5pc1NlbnNpdGl2ZTtcbiAgICB2YXIgaSA9IDA7XG4gICAgc3RyaW5nID0gU3RyaW5nKHN0cmluZyk7XG4gICAgd2hpbGUgKGkgPCBzdHJpbmcubGVuZ3RoKSB7XG4gICAgICBpZiAoc3RyaW5nLmNoYXJDb2RlQXQoaSsrKSA+IDI1NSlcbiAgICAgICAgdGhyb3cgbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgICAgIHR5cGU6IHNoYXJlZEVycm9ycy5JTlZBTElEX0xBVElOMV9TVFJJTkcudHlwZSxcbiAgICAgICAgICBjb2RlOiBzaGFyZWRFcnJvcnMuSU5WQUxJRF9MQVRJTjFfU1RSSU5HLmNvZGUsXG4gICAgICAgICAgbWVzc2FnZTogXCJGYWlsZWQgdG8gZXhlY3V0ZSAnYnRvYScgb24gJ1dpbmRvdyc6IFRoZSBzdHJpbmcgdG8gYmUgZW5jb2RlZCBjb250YWlucyBpbnZhbGlkIGNoYXJhY3RlciAnXCIgK1xuICAgICAgICAgICAgc3RyaW5nW2kgLSAxXSArXG4gICAgICAgICAgICBcIicgYXQgcG9zaXRpb24gXCIgKyAoaSAtIDEpICsgXCIgb2Ygc3RyaW5nXCIgK1xuICAgICAgICAgICAgKCFpc1NlbnNpdGl2ZSA/IFwiICdcIiArIHN0cmluZyArIFwiJ1wiIDogXCJcIikgKyBcIi5cIlxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuYy5hcHBseSh0aGlzLCBbc3RyaW5nXSk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhdG9iOiBhdG9iTm9ybWFsaXplZCxcbiAgYnRvYTogdmFsaWRhdGVMYXRpbjFDaGFyYWN0ZXJzRGVjb3JhdG9yKGJ0b2FOb3JtYWxpemVkKSxcbiAgX2F0b2I6IGF0b2IsXG4gIF9idG9hOiBidG9hXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgUHJvbWlzZSA9IGdsb2JhbC5Qcm9taXNlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByb21pc2U7XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIF9ub3RFbXB0eShvYmopIHtcbiAgdmFyIGtleTtcblxuICBmb3IgKGtleSBpbiBvYmopIHtcbiAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkpIHsgcmV0dXJuIHRydWU7IH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gX2lzQXJyYXkodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIHZhbHVlLmxlbmd0aCA9PT0gJ251bWJlcicgJiZcbiAgICBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBBcnJheV0nIHx8IGZhbHNlO1xufVxuXG5mdW5jdGlvbiBwYXJzZSh1cmwpIHtcbiAgdmFyIHF1ZXJ5LCBwYXJhbXM7XG5cbiAgdXJsID0gdXJsIHx8IGdsb2JhbC5sb2NhdGlvbi5ocmVmO1xuXG4gIGlmICghL1xcPy8udGVzdCh1cmwpKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgcXVlcnkgPSB1cmwucmVwbGFjZSgvIy4qJC8sICcnKS5yZXBsYWNlKC9eLipcXD8vLCAnJykuc3BsaXQoJyYnKTtcblxuICBwYXJhbXMgPSBxdWVyeS5yZWR1Y2UoZnVuY3Rpb24gKHRvUmV0dXJuLCBrZXlWYWx1ZSkge1xuICAgIHZhciBwYXJ0cyA9IGtleVZhbHVlLnNwbGl0KCc9Jyk7XG4gICAgdmFyIGtleSA9IGRlY29kZVVSSUNvbXBvbmVudChwYXJ0c1swXSk7XG4gICAgdmFyIHZhbHVlID0gZGVjb2RlVVJJQ29tcG9uZW50KHBhcnRzWzFdKTtcblxuICAgIHRvUmV0dXJuW2tleV0gPSB2YWx1ZTtcbiAgICByZXR1cm4gdG9SZXR1cm47XG4gIH0sIHt9KTtcblxuICByZXR1cm4gcGFyYW1zO1xufVxuXG5mdW5jdGlvbiBzdHJpbmdpZnkocGFyYW1zLCBuYW1lc3BhY2UpIHtcbiAgdmFyIGssIHYsIHA7XG4gIHZhciBxdWVyeSA9IFtdO1xuXG4gIGZvciAocCBpbiBwYXJhbXMpIHtcbiAgICBpZiAoIXBhcmFtcy5oYXNPd25Qcm9wZXJ0eShwKSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgdiA9IHBhcmFtc1twXTtcblxuICAgIGlmIChuYW1lc3BhY2UpIHtcbiAgICAgIGlmIChfaXNBcnJheShwYXJhbXMpKSB7XG4gICAgICAgIGsgPSBuYW1lc3BhY2UgKyAnW10nO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgayA9IG5hbWVzcGFjZSArICdbJyArIHAgKyAnXSc7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGsgPSBwO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHYgPT09ICdvYmplY3QnKSB7XG4gICAgICBxdWVyeS5wdXNoKHN0cmluZ2lmeSh2LCBrKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHF1ZXJ5LnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGspICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHYpKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcXVlcnkuam9pbignJicpO1xufVxuXG5mdW5jdGlvbiBxdWVyeWlmeSh1cmwsIHBhcmFtcykge1xuICB1cmwgPSB1cmwgfHwgJyc7XG5cbiAgaWYgKHBhcmFtcyAhPSBudWxsICYmIHR5cGVvZiBwYXJhbXMgPT09ICdvYmplY3QnICYmIF9ub3RFbXB0eShwYXJhbXMpKSB7XG4gICAgdXJsICs9IHVybC5pbmRleE9mKCc/JykgPT09IC0xID8gJz8nIDogJyc7XG4gICAgdXJsICs9IHVybC5pbmRleE9mKCc9JykgIT09IC0xID8gJyYnIDogJyc7XG4gICAgdXJsICs9IHN0cmluZ2lmeShwYXJhbXMpO1xuICB9XG5cbiAgcmV0dXJuIHVybDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHBhcnNlOiBwYXJzZSxcbiAgc3RyaW5naWZ5OiBzdHJpbmdpZnksXG4gIHF1ZXJ5aWZ5OiBxdWVyeWlmeVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gdXVpZCgpIHtcbiAgcmV0dXJuICd4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHgnLnJlcGxhY2UoL1t4eV0vZywgZnVuY3Rpb24gKGMpIHtcbiAgICB2YXIgciA9IE1hdGgucmFuZG9tKCkgKiAxNiB8IDA7XG4gICAgdmFyIHYgPSBjID09PSAneCcgPyByIDogciAmIDB4MyB8IDB4ODtcblxuICAgIHJldHVybiB2LnRvU3RyaW5nKDE2KTtcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdXVpZDtcbiIsIid1c2Ugc3RyaWN0Jztcbi8qKlxuICogQG1vZHVsZSBzZWFtbGVzc3BheS13ZWIvcGF5cGFsLWNoZWNrb3V0XG4gKiBAZGVzY3JpcHRpb24gQSBjb21wb25lbnQgdG8gaW50ZWdyYXRlIHdpdGggdGhlIFtQYXlQYWwgQ2hlY2tvdXQuanMgbGlicmFyeV0oaHR0cHM6Ly9naXRodWIuY29tL3BheXBhbC9wYXlwYWwtY2hlY2tvdXQpLlxuICovXG5cbnZhciBiYXNpY0NvbXBvbmVudFZlcmlmaWNhdGlvbiA9IHJlcXVpcmUoJy4uL2xpYi9iYXNpYy1jb21wb25lbnQtdmVyaWZpY2F0aW9uJyk7XG52YXIgd3JhcFByb21pc2UgPSByZXF1aXJlKCdAYnJhaW50cmVlL3dyYXAtcHJvbWlzZScpO1xudmFyIFBheVBhbENoZWNrb3V0ID0gcmVxdWlyZSgnLi9wYXlwYWwtY2hlY2tvdXQnKTtcblxudmFyIFZFUlNJT04gPSBcIndlYi1zZGtcIjtcblxuLyoqXG4gKiBAc3RhdGljXG4gKiBAZnVuY3Rpb24gY3JlYXRlXG4gKiBAZGVzY3JpcHRpb24gVGhlcmUgYXJlIHR3byB3YXlzIHRvIGludGVncmF0ZSB0aGUgUGF5UGFsIENoZWNrb3V0IGNvbXBvbmVudC4gU2VlIHRoZSBbUGF5UGFsIENoZWNrb3V0IGNvbnN0cnVjdG9yIGRvY3VtZW50YXRpb25dKFBheVBhbENoZWNrb3V0Lmh0bWwjUGF5UGFsQ2hlY2tvdXQpIGZvciBtb3JlIGluZm9ybWF0aW9uIGFuZCBleGFtcGxlcy5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyBDcmVhdGlvbiBvcHRpb25zOlxuICogQHBhcmFtIHtDbGllbnR9IFtvcHRpb25zLmNsaWVudF0gQSB7QGxpbmsgQ2xpZW50fSBpbnN0YW5jZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5hdXRob3JpemF0aW9uXSBBIHRva2VuaXphdGlvbktleSBvciBjbGllbnRUb2tlbi4gQ2FuIGJlIHVzZWQgaW4gcGxhY2Ugb2YgYG9wdGlvbnMuY2xpZW50YC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5tZXJjaGFudEFjY291bnRJZF0gQSBub24tZGVmYXVsdCBtZXJjaGFudCBhY2NvdW50IElEIHRvIHVzZSBmb3IgdG9rZW5pemF0aW9uLlxuICogQHBhcmFtIHtjYWxsYmFja30gW2NhbGxiYWNrXSBUaGUgc2Vjb25kIGFyZ3VtZW50LCBgZGF0YWAsIGlzIHRoZSB7QGxpbmsgUGF5UGFsQ2hlY2tvdXR9IGluc3RhbmNlLlxuICogQGV4YW1wbGVcbiAqIHNlYW1sZXNzcGF5LmNsaWVudC5jcmVhdGUoe1xuICogICBhdXRob3JpemF0aW9uOiAnYXV0aG9yaXphdGlvbidcbiAqIH0pLnRoZW4oZnVuY3Rpb24gKGNsaWVudEluc3RhbmNlKSB7XG4gKiAgIHJldHVybiBzZWFtbGVzc3BheS5wYXlwYWxDaGVja291dC5jcmVhdGUoe1xuICogICAgIGNsaWVudDogY2xpZW50SW5zdGFuY2VcbiAqICAgfSk7XG4gKiB9KS50aGVuKGZ1bmN0aW9uIChwYXlwYWxDaGVja291dEluc3RhbmNlKSB7XG4gKiAgIC8vIHNldCB1cCBjaGVja291dC5qc1xuICogfSkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICogICBjb25zb2xlLmVycm9yKCdFcnJvciEnLCBlcnIpO1xuICogfSk7XG4gKiBAcmV0dXJucyB7UHJvbWlzZXx2b2lkfSBSZXR1cm5zIGEgcHJvbWlzZSBpZiBubyBjYWxsYmFjayBpcyBwcm92aWRlZC5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlKG9wdGlvbnMpIHtcblxuICByZXR1cm4gYmFzaWNDb21wb25lbnRWZXJpZmljYXRpb24udmVyaWZ5KHtcbiAgICBuYW1lOiAnUGF5UGFsIENoZWNrb3V0JyxcbiAgICBjbGllbnQ6IG9wdGlvbnMuY2xpZW50LFxuICAgIGF1dGhvcml6YXRpb246IG9wdGlvbnMuYXV0aG9yaXphdGlvblxuICB9KS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcGF5UGFsQ2hlY2tvdXRDb21wb25lbnQgPSBuZXcgUGF5UGFsQ2hlY2tvdXQob3B0aW9ucyk7XG5cbiAgICByZXR1cm4gcGF5UGFsQ2hlY2tvdXRDb21wb25lbnQuaW5pdGlhbGl6ZSgpO1xuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNyZWF0ZTogd3JhcFByb21pc2UoY3JlYXRlKSxcbiAgVkVSU0lPTjogVkVSU0lPTlxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFZFUlNJT04gPSBcIndlYi1zZGtcIjtcbnZhciBzaGFyZWRFcnJvcnMgPSByZXF1aXJlKCcuLi9saWIvZXJyb3JzJyk7XG52YXIgUHJvbWlzZSA9IHJlcXVpcmUoJy4uL2xpYi9wcm9taXNlJyk7XG52YXIgd3JhcFByb21pc2UgPSByZXF1aXJlKCdAYnJhaW50cmVlL3dyYXAtcHJvbWlzZScpO1xudmFyIFNlYW1sZXNzcGF5RXJyb3IgPSByZXF1aXJlKCcuLi9saWIvZXJyb3InKTtcbnZhciBhc3NpZ24gPSByZXF1aXJlKCcuLi9saWIvYXNzaWduJykuYXNzaWduO1xuXG4vKipcbiAqXG4gKiAjIyMjIEludGVncmF0ZSBDaGVja291dCBGbG93IHdpdGggUGF5UGFsIFNES1xuICpcbiAqXG4gKiBgYGBodG1sXG4gKiA8c2NyaXB0IHNyYz1cImh0dHBzOi8vd2ViLXNkay5zZWFtbGVzc3BheS5jb20veC54LngvanMvaW5kZXgubWluLmpzXCI+PC9zY3JpcHQ+XG4gKiA8ZGl2IGlkPVwic2VhbWxlc3NwYXktcGF5cGFsLWJ1dHRvbi1jb250YWluZXJcIj48L2Rpdj5cbiAqIGBgYFxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAgc2VhbWxlc3NwYXkuY2xpZW50LmNyZWF0ZSh7XG4gICAgYXV0aG9yaXphdGlvbjogJ3BrXzAxQ040RTlHMUpERVhYRjNNQ0c0NzFCTUNSJyxcbiAgICB0cmFuc2FjdGlvbkFwaToge1xuICAgICAgYWNjZXNzVG9rZW46IGJ0b2EoJ3NrXzAxQ040OVo3VkQyRVFDVzdCTlpTRllYTVFaJylcbiAgICB9LFxuICAgIGVudmlyb25tZW50OiAnZGV2ZWxvcG1lbnQnXG4gIH0pLnRoZW4oKGNsaWVudCkgPT4ge1xuICAgIHJldHVybiBzZWFtbGVzc3BheS5wYXlwYWxDaGVja291dC5jcmVhdGUoe1xuICAgICAgY2xpZW50XG4gICAgfSlcbiAgfSkudGhlbigocGF5cGFsQ2hlY2tvdXRJbnN0YW5jZSkgPT4ge1xuICAgIHBheXBhbENoZWNrb3V0SW5zdGFuY2UuY3JlYXRlQnV0dG9ucyh7XG4gICAgICBjb250YWluZXI6IFwiI3NlYW1sZXNzcGF5LXBheXBhbC1idXR0b24tY29udGFpbmVyXCIsXG4gICAgICBvcmRlcjoge1xuICAgICAgICBcImNhcHR1cmVcIjogdHJ1ZSxcbiAgICAgICAgXCJhbW91bnRcIjogXCIxMDcuOTVcIixcbiAgICAgICAgXCJzaGlwcGluZ0Ftb3VudFwiOiBcIjkuOTVcIixcbiAgICAgICAgXCJ0eXBlXCI6IFwicGF5cGFsXCIsXG4gICAgICAgIFwiaXRlbXNcIjogW3tcbiAgICAgICAgICBcIm5hbWVcIjogXCJNb25yb3cgR3Jhbml0ZSBMb25nIFNsZWV2ZSBUaGVybWFsXCIsXG4gICAgICAgICAgXCJxdWFudGl0eVwiOiBcIjFcIixcbiAgICAgICAgICBcInVuaXRDb3N0XCI6IFwiOThcIixcbiAgICAgICAgICBcImRlc2NyaXB0aW9uXCI6ICQoJyNjb21tZW50cycpLnZhbCgpXG4gICAgICAgIH1dXG4gICAgICB9LFxuICAgICAgLy8gRmluYWxpemUgdGhlIHRyYW5zYWN0aW9uXG4gICAgICBvblBheW1lbnRDcmVhdGVkOiAodHJhbnNhY3Rpb24pID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ3RyYW5zYWN0aW9uOiAnLCB0cmFuc2FjdGlvbik7XG4gICAgICB9LFxuICAgICAgb25TaGlwcGluZ0NoYW5nZTogKHNoaXBwaW5nRGF0YSkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3NoaXBwaW5nRGF0YTogJywgc2hpcHBpbmdEYXRhKTtcbiAgICAgIH0sXG4gICAgICBvbkVycm9yOiAoZXJyKSA9PiB7XG4gICAgICAgIC8vIFNob3cgYW4gZXJyb3IgcGFnZSBoZXJlLCB3aGVuIGFuIGVycm9yIG9jY3Vyc1xuICAgICAgfSxcbiAgICAgIG9uT3JkZXJFcnJvcjogKGVycikgPT4ge1xuICAgICAgICAvLyBTaG93IGFuIGVycm9yIG9yZGVyIGhlcmUsXG4gICAgICB9LFxuICAgICAgb25QYXltZW50RXJyb3I6IChlcnIpID0+IHtcbiAgICAgICAgLy8gU2hvdyBhbiBlcnJvciBwYXltZW50IGhlcmUsXG4gICAgICB9LFxuICAgIH0pXG4gIH0pXG4gKiBgYGBcbioqL1xuXG52YXIgZGVmYXVsdFN0eWxlID0ge1xuICBsYXlvdXQ6ICAnaG9yaXpvbnRhbCcsXG4gIGZ1bmRpbmdpY29uczogZmFsc2UsXG4gIGNvbG9yOiAgICdibGFjaycsXG4gIHNoYXBlOiAgICdyZWN0JyxcbiAgbGFiZWw6ICAgJ2NoZWNrb3V0JyxcbiAgdGFnbGluZTogZmFsc2UsXG4gIHNpemU6ICdyZXNwb25zaXZlJ1xufTtcblxuZnVuY3Rpb24gY3JlYXRlT3JkZXIoY2xpZW50LCBkYXRhKSB7XG4gIHJldHVybiBjbGllbnQucmVxdWVzdCh7XG4gICAgYXBpOiAnc2VhbWxlc3NwYXlBcGknLFxuICAgIGVuZHBvaW50OiAnb3JkZXJzJyxcbiAgICBtZXRob2Q6ICdwb3N0JyxcbiAgICBkYXRhOiBkYXRhXG4gIH0pLnRoZW4oZnVuY3Rpb24ob3JkZXIpIHtcbiAgICBkYXRhLmlkID0gb3JkZXIuaWQ7XG5cbiAgICByZXR1cm4gb3JkZXIucHJvY2Vzc29yT3JkZXJJZFxuICB9KTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlT3JkZXIoY2xpZW50LCBkYXRhKSB7XG4gIHJldHVybiBjbGllbnQucmVxdWVzdCh7XG4gICAgYXBpOiAnc2VhbWxlc3NwYXlBcGknLFxuICAgIGVuZHBvaW50OiAnb3JkZXJzLycgKyBkYXRhLmlkLFxuICAgIG1ldGhvZDogJ3B1dCcsXG4gICAgZGF0YTogZGF0YVxuICB9KVxufVxuXG5mdW5jdGlvbiBjcmVhdGVQYXltZW50KGNsaWVudCwgZGF0YSkge1xuICByZXR1cm4gY2xpZW50LnJlcXVlc3Qoe1xuICAgIGFwaTogJ3NlYW1sZXNzcGF5QXBpJyxcbiAgICBlbmRwb2ludDogJ3BheXBhbC10cmFuc2FjdGlvbnMvY2hhcmdlJyxcbiAgICBtZXRob2Q6ICdwb3N0JyxcbiAgICBkYXRhOiB7XG4gICAgICBwcm9jZXNzb3JPcmRlcklkOiBkYXRhLm9yZGVySURcbiAgICB9XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBQYXlQYWxDaGVja291dChvcHRpb25zKSB7XG4gIHZhciBjbGllbnRWZXJzaW9uLCBjbGllbnRDb25maWc7XG5cbiAgaWYgKCFvcHRpb25zLmNsaWVudCkge1xuICAgIHRocm93IG5ldyBTZWFtbGVzc3BheUVycm9yKHtcbiAgICAgIHR5cGU6IHNoYXJlZEVycm9ycy5JTlNUQU5USUFUSU9OX09QVElPTl9SRVFVSVJFRC50eXBlLFxuICAgICAgY29kZTogc2hhcmVkRXJyb3JzLklOU1RBTlRJQVRJT05fT1BUSU9OX1JFUVVJUkVELmNvZGUsXG4gICAgICBtZXNzYWdlOiAnb3B0aW9ucy5jbGllbnQgaXMgcmVxdWlyZWQgd2hlbiBpbnN0YW50aWF0aW5nIFBheXBhbCBDaGVja291dC4nXG4gICAgfSk7XG4gIH1cblxuICBjbGllbnRDb25maWcgPSBvcHRpb25zLmNsaWVudC5nZXRDb25maWd1cmF0aW9uKCk7XG4gIGNsaWVudFZlcnNpb24gPSBjbGllbnRDb25maWcuYW5hbHl0aWNzTWV0YWRhdGEuc2RrVmVyc2lvbjtcbiAgaWYgKGNsaWVudFZlcnNpb24gIT09IFZFUlNJT04pIHtcbiAgICB0aHJvdyBuZXcgU2VhbWxlc3NwYXlFcnJvcih7XG4gICAgICB0eXBlOiBzaGFyZWRFcnJvcnMuSU5DT01QQVRJQkxFX1ZFUlNJT05TLnR5cGUsXG4gICAgICBjb2RlOiBzaGFyZWRFcnJvcnMuSU5DT01QQVRJQkxFX1ZFUlNJT05TLmNvZGUsXG4gICAgICBtZXNzYWdlOiAnQ2xpZW50ICh2ZXJzaW9uICcgKyBjbGllbnRWZXJzaW9uICsgJykgYW5kIFBheXBhbCBDaGVja291dCAodmVyc2lvbiAnICsgVkVSU0lPTiArICcpIGNvbXBvbmVudHMgbXVzdCBiZSBmcm9tIHRoZSBzYW1lIFNESyB2ZXJzaW9uLidcbiAgICB9KTtcbiAgfVxuXG4gIHRoaXMuX2NsaWVudCA9IG9wdGlvbnMuY2xpZW50O1xufVxuXG5QYXlQYWxDaGVja291dC5wcm90b3R5cGUuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIFBheVBhbENoZWNrb3V0SW5zYW5jZSA9IHRoaXM7XG4gIHZhciBjbGllbnRDb25maWcgPSBQYXlQYWxDaGVja291dEluc2FuY2UuX2NsaWVudC5nZXRDb25maWd1cmF0aW9uKCk7XG4gIHZhciBtZXJjaGFudElkID0gKChjbGllbnRDb25maWcuZ2F0ZXdheUNvbmZpZ3VyYXRpb24ubWVyY2hhbnQuc2V0dGluZ3MucHJvY2Vzc29ycyB8fCB7fSkuUEFZUEFMIHx8IHt9KS5hY2NvdW50SWQ7XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgdmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gICAgc2NyaXB0LnNyYyA9ICdodHRwczovL3d3dy5wYXlwYWwuY29tL3Nkay9qcz8nICtcbiAgICAgICdjbGllbnQtaWQ9JyArIHVuZGVmaW5lZCArICcmJyArXG4gICAgICAnJm1lcmNoYW50LWlkPScgKyBtZXJjaGFudElkICtcbiAgICAgICcmZGlzYWJsZS1mdW5kaW5nPWNyZWRpdCdcbiAgICA7XG4gICAgc2NyaXB0LnNldEF0dHJpYnV0ZSgnZGF0YS1wYXJ0bmVyLWF0dHJpYnV0aW9uLWlkJywgJ1NlYW1sZXNzcGF5X1NQJyk7XG4gICAgc2NyaXB0LmFzeW5jID0gdHJ1ZTtcblxuICAgIHNjcmlwdC5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aHJvdyBuZXcgU2VhbWxlc3NwYXlFcnJvcih7XG4gICAgICAgIHR5cGU6IHNoYXJlZEVycm9ycy5TRUFNTEVTU1BBWV9QQVlQQUxfTk9UX0xPQURFRC50eXBlLFxuICAgICAgICBjb2RlOiBzaGFyZWRFcnJvcnMuU0VBTUxFU1NQQVlfUEFZUEFMX05PVF9MT0FERUQuY29kZSxcbiAgICAgICAgbWVzc2FnZTogc2hhcmVkRXJyb3JzLlNFQU1MRVNTUEFZX1BBWVBBTF9OT1RfTE9BREVELm1lc3NhZ2VcbiAgICAgIH0pO1xuICAgIH07XG4gICAgc2NyaXB0Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiByZXNvbHZlKFBheVBhbENoZWNrb3V0SW5zYW5jZSk7XG4gICAgfTtcblxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgfSk7XG59O1xuXG5QYXlQYWxDaGVja291dC5wcm90b3R5cGUuY3JlYXRlQnV0dG9ucyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIGlmICghb3B0aW9ucykge1xuICAgIHRocm93IG5ldyBTZWFtbGVzc3BheUVycm9yKHtcbiAgICAgIHR5cGU6IHNoYXJlZEVycm9ycy5JTlNUQU5USUFUSU9OX09QVElPTl9SRVFVSVJFRC50eXBlLFxuICAgICAgY29kZTogc2hhcmVkRXJyb3JzLklOU1RBTlRJQVRJT05fT1BUSU9OX1JFUVVJUkVELmNvZGUsXG4gICAgICBtZXNzYWdlOiAnb3B0aW9ucyBpcyByZXF1aXJlZCB3aGVuIGluc3RhbnRpYXRpbmcgYnV0dG9ucy4nXG4gICAgfSk7XG4gIH1cblxuICBpZiAoIW9wdGlvbnMub3JkZXIpIHtcbiAgICB0aHJvdyBuZXcgU2VhbWxlc3NwYXlFcnJvcih7XG4gICAgICB0eXBlOiBzaGFyZWRFcnJvcnMuSU5TVEFOVElBVElPTl9PUFRJT05fUkVRVUlSRUQudHlwZSxcbiAgICAgIGNvZGU6IHNoYXJlZEVycm9ycy5JTlNUQU5USUFUSU9OX09QVElPTl9SRVFVSVJFRC5jb2RlLFxuICAgICAgbWVzc2FnZTogJ29wdGlvbnMub3JkZXIgaXMgcmVxdWlyZWQgd2hlbiBpbnN0YW50aWF0aW5nIGJ1dHRvbnMuJ1xuICAgIH0pO1xuICB9XG5cbiAgdmFyIGNsaWVudCA9IHRoaXMuX2NsaWVudDtcblxuICB2YXIgY29udGFpbmVyID0gb3B0aW9ucy5jb250YWluZXIgfHwgJyNzZWFtbGVzc3BheS1wYXlwYWwtYnV0dG9uLWNvbnRhaW5lcic7XG4gIHZhciBzdHlsZSA9IG9wdGlvbnMuc3R5bGUgfHwge307XG4gIHZhciBvcmRlciA9IG9wdGlvbnMub3JkZXI7XG4gIHZhciBvblNoaXBwaW5nQ2hhbmdlID0gb3B0aW9ucy5vblNoaXBwaW5nQ2hhbmdlO1xuICB2YXIgb25PcmRlckVycm9yID0gb3B0aW9ucy5vbk9yZGVyRXJyb3I7XG4gIHZhciBvblBheW1lbnRFcnJvciA9IG9wdGlvbnMub25QYXltZW50RXJyb3I7XG4gIHZhciBvblBheW1lbnRDcmVhdGVkID0gb3B0aW9ucy5vblBheW1lbnRDcmVhdGVkO1xuICB2YXIgb25QYXltZW50UHJvY2VzcyA9IG9wdGlvbnMub25QYXltZW50UHJvY2VzcztcbiAgdmFyIG9uRXJyb3IgPSBvcHRpb25zLm9uRXJyb3I7XG5cbiAgd2luZG93LnBheXBhbC5CdXR0b25zKHtcbiAgICBzdHlsZTogYXNzaWduKGRlZmF1bHRTdHlsZSwgc3R5bGUpLFxuICAgIC8vIFNldCB1cCB0aGUgdHJhbnNhY3Rpb25cbiAgICBjcmVhdGVPcmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY3JlYXRlT3JkZXIoY2xpZW50LCBvcmRlcilcbiAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgIGlmICh0eXBlb2Ygb25PcmRlckVycm9yID09PSAnZnVuY3Rpb24nKSBvbk9yZGVyRXJyb3IoZXJyKVxuICAgICAgICB9KTtcbiAgICB9LFxuICAgIC8vIEZpbmFsaXplIHRoZSB0cmFuc2FjdGlvblxuICAgIG9uQXBwcm92ZTogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgaWYgKHR5cGVvZiBvblBheW1lbnRQcm9jZXNzID09PSAnZnVuY3Rpb24nKSBvblBheW1lbnRQcm9jZXNzKCk7XG4gICAgICByZXR1cm4gY3JlYXRlUGF5bWVudChjbGllbnQsIGRhdGEpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKHRyYW5zYWN0aW9uKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBvblBheW1lbnRDcmVhdGVkID09PSAnZnVuY3Rpb24nKSBvblBheW1lbnRDcmVhdGVkKHRyYW5zYWN0aW9uKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgIGlmICh0eXBlb2Ygb25QYXltZW50RXJyb3IgPT09ICdmdW5jdGlvbicpIG9uUGF5bWVudEVycm9yKGVycik7XG4gICAgICAgIH0pXG4gICAgfSxcbiAgICBvblNoaXBwaW5nQ2hhbmdlOiBmdW5jdGlvbihkYXRhLCBhY3Rpb25zKSB7XG4gICAgICB2YXIgc2hpcHBpbmdBZGRyZXNzID0gKGRhdGEgfHwge30pLnNoaXBwaW5nX2FkZHJlc3MgfHwge307XG4gICAgICB2YXIgbWFwcGVkRmllbGRzID0ge1xuICAgICAgICBjb3VudHJ5Q29kZTogJ2NvdW50cnlfY29kZScsXG4gICAgICAgIHN0YXRlOiAnc3RhdGUnLFxuICAgICAgICBjaXR5OiAnY2l0eScsXG4gICAgICAgIHNoaXBUb1ppcDogJ3Bvc3RhbF9jb2RlJ1xuICAgICAgfTtcblxuICAgICAgaWYgKHR5cGVvZiBvblNoaXBwaW5nQ2hhbmdlICE9PSAnZnVuY3Rpb24nKSByZXR1cm4gYWN0aW9ucy5yZXNvbHZlKCk7XG5cbiAgICAgIHZhciBtYXBwZWRWYWx1ZXMgPSBPYmplY3Qua2V5cyhtYXBwZWRGaWVsZHMpXG4gICAgICAgIC5yZWR1Y2UoZnVuY3Rpb24gKHJlc3VsdCwgZmllbGQpIHtcbiAgICAgICAgICB2YXIgbmV4dFZhbHVlID0ge307XG4gICAgICAgICAgbmV4dFZhbHVlW2ZpZWxkXSA9IHNoaXBwaW5nQWRkcmVzc1ttYXBwZWRGaWVsZHNbZmllbGRdXTtcblxuICAgICAgICAgIHJldHVybiBhc3NpZ24ocmVzdWx0LCBuZXh0VmFsdWUpO1xuICAgICAgICB9LCB7fSk7XG4gICAgICB2YXIgcmVzID0gb25TaGlwcGluZ0NoYW5nZShtYXBwZWRWYWx1ZXMpO1xuXG4gICAgICBpZiAodHlwZW9mIHJlcyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIHJlcy50aGVuICE9PSAnZnVuY3Rpb24nIClcbiAgICAgICAgcmV0dXJuIHVwZGF0ZU9yZGVyKGNsaWVudCwgYXNzaWduKG9yZGVyLCByZXMgfHwge30pKVxuICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbnMucmVzb2x2ZSgpO1xuICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbnMucmVqZWN0KCk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgIGlmICh0eXBlb2YgcmVzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgcmVzLnRoZW4gPT09ICdmdW5jdGlvbicgKVxuICAgICAgICByZXR1cm4gcmVzXG4gICAgICAgICAgLnRoZW4oZnVuY3Rpb24obmV4dE9yZGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gdXBkYXRlT3JkZXIoY2xpZW50LCBhc3NpZ24ob3JkZXIsIG5leHRPcmRlciB8fCB7fSkpO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gYWN0aW9ucy5yZXNvbHZlKCk7XG4gICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gYWN0aW9ucy5yZWplY3QoKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgcmV0dXJuIGFjdGlvbnMucmVzb2x2ZSgpO1xuICAgIH0sXG4gICAgb25FcnJvcjogZnVuY3Rpb24gKGVycikge1xuICAgICAgaWYgKHR5cGVvZiBvbkVycm9yID09PSAnZnVuY3Rpb24nKSBvbkVycm9yKGVycik7XG4gICAgfVxuICB9KVxuICAgIC5yZW5kZXIoY29udGFpbmVyKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gd3JhcFByb21pc2Uud3JhcFByb3RvdHlwZShQYXlQYWxDaGVja291dCk7XG4iXX0=
