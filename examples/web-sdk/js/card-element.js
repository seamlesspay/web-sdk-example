(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.seamlesspay || (g.seamlesspay = {})).cardElement = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(_dereq_,module,exports){
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

},{"../../lib/seamlesspay-error":40,"../shared/constants":20,"../shared/errors":21}],18:[function(_dereq_,module,exports){
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

},{"../../lib/assign":22,"../../lib/bus":26,"../../lib/classlist":27,"../../lib/compose-url":28,"../../lib/convert-methods-to-error":29,"../../lib/deferred":30,"../../lib/destructor":31,"../../lib/errors":33,"../../lib/event-emitter":34,"../../lib/inject-frame":35,"../../lib/methods":37,"../../lib/promise":39,"../../lib/seamlesspay-error":40,"../../lib/uuid":41,"../shared/constants":20,"../shared/errors":21,"./attribute-validation-error":17,"@braintree/iframer":1,"@braintree/wrap-promise":8,"credit-card-type":9}],19:[function(_dereq_,module,exports){
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

},{"../lib/promise":39,"./external/card-element":18,"@braintree/wrap-promise":8}],20:[function(_dereq_,module,exports){
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

},{"../../lib/enumerate":32}],21:[function(_dereq_,module,exports){
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

},{"../../lib/seamlesspay-error":40}],22:[function(_dereq_,module,exports){
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

},{}],23:[function(_dereq_,module,exports){
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

},{"./once":38}],24:[function(_dereq_,module,exports){
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

},{"../is-whitelisted-domain":36}],25:[function(_dereq_,module,exports){
'use strict';

var enumerate = _dereq_('../enumerate');

module.exports = enumerate([
  'CONFIGURATION_REQUEST'
], 'bus:');

},{"../enumerate":32}],26:[function(_dereq_,module,exports){
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

},{"../seamlesspay-error":40,"./check-origin":24,"./events":25,"framebus":16}],27:[function(_dereq_,module,exports){
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

},{}],28:[function(_dereq_,module,exports){
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

},{"../card-element/shared/constants":20}],29:[function(_dereq_,module,exports){
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

},{"./errors":33,"./seamlesspay-error":40}],30:[function(_dereq_,module,exports){
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

},{}],31:[function(_dereq_,module,exports){
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

},{"./batch-execute-functions":23}],32:[function(_dereq_,module,exports){
'use strict';

function enumerate(values, prefix) {
  prefix = prefix == null ? '' : prefix;

  return values.reduce(function (enumeration, value) {
    enumeration[value] = prefix + value;
    return enumeration;
  }, {});
}

module.exports = enumerate;

},{}],33:[function(_dereq_,module,exports){
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

},{"./seamlesspay-error":40}],34:[function(_dereq_,module,exports){
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

},{}],35:[function(_dereq_,module,exports){
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

},{}],36:[function(_dereq_,module,exports){
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

},{}],37:[function(_dereq_,module,exports){
'use strict';

module.exports = function (obj) {
  return Object.keys(obj).filter(function (key) {
    return typeof obj[key] === 'function';
  });
};

},{}],38:[function(_dereq_,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],39:[function(_dereq_,module,exports){
(function (global){(function (){
'use strict';

var Promise = global.Promise;

module.exports = Promise;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],40:[function(_dereq_,module,exports){
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

},{"./enumerate":32}],41:[function(_dereq_,module,exports){
'use strict';

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : r & 0x3 | 0x8;

    return v.toString(16);
  });
}

module.exports = uuid;

},{}]},{},[19])(19)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvQGJyYWludHJlZS9pZnJhbWVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL0BicmFpbnRyZWUvaWZyYW1lci9saWIvYXNzaWduLmpzIiwibm9kZV9tb2R1bGVzL0BicmFpbnRyZWUvaWZyYW1lci9saWIvZGVmYXVsdC1hdHRyaWJ1dGVzLmpzIiwibm9kZV9tb2R1bGVzL0BicmFpbnRyZWUvaWZyYW1lci9saWIvc2V0LWF0dHJpYnV0ZXMuanMiLCJub2RlX21vZHVsZXMvQGJyYWludHJlZS93cmFwLXByb21pc2UvbGliL2RlZmVycmVkLmpzIiwibm9kZV9tb2R1bGVzL0BicmFpbnRyZWUvd3JhcC1wcm9taXNlL2xpYi9vbmNlLmpzIiwibm9kZV9tb2R1bGVzL0BicmFpbnRyZWUvd3JhcC1wcm9taXNlL2xpYi9wcm9taXNlLW9yLWNhbGxiYWNrLmpzIiwibm9kZV9tb2R1bGVzL0BicmFpbnRyZWUvd3JhcC1wcm9taXNlL3dyYXAtcHJvbWlzZS5qcyIsIm5vZGVfbW9kdWxlcy9jcmVkaXQtY2FyZC10eXBlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2NyZWRpdC1jYXJkLXR5cGUvbGliL2FkZC1tYXRjaGluZy1jYXJkcy10by1yZXN1bHRzLmpzIiwibm9kZV9tb2R1bGVzL2NyZWRpdC1jYXJkLXR5cGUvbGliL2NhcmQtdHlwZXMuanMiLCJub2RlX21vZHVsZXMvY3JlZGl0LWNhcmQtdHlwZS9saWIvY2xvbmUuanMiLCJub2RlX21vZHVsZXMvY3JlZGl0LWNhcmQtdHlwZS9saWIvZmluZC1iZXN0LW1hdGNoLmpzIiwibm9kZV9tb2R1bGVzL2NyZWRpdC1jYXJkLXR5cGUvbGliL2lzLXZhbGlkLWlucHV0LXR5cGUuanMiLCJub2RlX21vZHVsZXMvY3JlZGl0LWNhcmQtdHlwZS9saWIvbWF0Y2hlcy5qcyIsIm5vZGVfbW9kdWxlcy9mcmFtZWJ1cy9saWIvZnJhbWVidXMuanMiLCJzcmMvY2FyZC1lbGVtZW50L2V4dGVybmFsL2F0dHJpYnV0ZS12YWxpZGF0aW9uLWVycm9yLmpzIiwic3JjL2NhcmQtZWxlbWVudC9leHRlcm5hbC9jYXJkLWVsZW1lbnQuanMiLCJzcmMvY2FyZC1lbGVtZW50L2luZGV4LmpzIiwic3JjL2NhcmQtZWxlbWVudC9zaGFyZWQvY29uc3RhbnRzLmpzIiwic3JjL2NhcmQtZWxlbWVudC9zaGFyZWQvZXJyb3JzLmpzIiwic3JjL2xpYi9hc3NpZ24uanMiLCJzcmMvbGliL2JhdGNoLWV4ZWN1dGUtZnVuY3Rpb25zLmpzIiwic3JjL2xpYi9idXMvY2hlY2stb3JpZ2luLmpzIiwic3JjL2xpYi9idXMvZXZlbnRzLmpzIiwic3JjL2xpYi9idXMvaW5kZXguanMiLCJzcmMvbGliL2NsYXNzbGlzdC5qcyIsInNyYy9saWIvY29tcG9zZS11cmwuanMiLCJzcmMvbGliL2NvbnZlcnQtbWV0aG9kcy10by1lcnJvci5qcyIsInNyYy9saWIvZGVmZXJyZWQuanMiLCJzcmMvbGliL2Rlc3RydWN0b3IuanMiLCJzcmMvbGliL2VudW1lcmF0ZS5qcyIsInNyYy9saWIvZXJyb3JzLmpzIiwic3JjL2xpYi9ldmVudC1lbWl0dGVyLmpzIiwic3JjL2xpYi9pbmplY3QtZnJhbWUuanMiLCJzcmMvbGliL2lzLXdoaXRlbGlzdGVkLWRvbWFpbi5qcyIsInNyYy9saWIvbWV0aG9kcy5qcyIsInNyYy9saWIvcHJvbWlzZS5qcyIsInNyYy9saWIvc2VhbWxlc3NwYXktZXJyb3IuanMiLCJzcmMvbGliL3V1aWQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3RUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOXFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbE1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIid1c2Ugc3RyaWN0JztcblxudmFyIHNldEF0dHJpYnV0ZXMgPSByZXF1aXJlKCcuL2xpYi9zZXQtYXR0cmlidXRlcycpO1xudmFyIGRlZmF1bHRBdHRyaWJ1dGVzID0gcmVxdWlyZSgnLi9saWIvZGVmYXVsdC1hdHRyaWJ1dGVzJyk7XG52YXIgYXNzaWduID0gcmVxdWlyZSgnLi9saWIvYXNzaWduJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlRnJhbWUob3B0aW9ucykge1xuICB2YXIgaWZyYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaWZyYW1lJyk7XG4gIHZhciBjb25maWcgPSBhc3NpZ24oe30sIGRlZmF1bHRBdHRyaWJ1dGVzLCBvcHRpb25zKTtcblxuICBpZiAoY29uZmlnLnN0eWxlICYmIHR5cGVvZiBjb25maWcuc3R5bGUgIT09ICdzdHJpbmcnKSB7XG4gICAgYXNzaWduKGlmcmFtZS5zdHlsZSwgY29uZmlnLnN0eWxlKTtcbiAgICBkZWxldGUgY29uZmlnLnN0eWxlO1xuICB9XG5cbiAgc2V0QXR0cmlidXRlcyhpZnJhbWUsIGNvbmZpZyk7XG5cbiAgaWYgKCFpZnJhbWUuZ2V0QXR0cmlidXRlKCdpZCcpKSB7XG4gICAgaWZyYW1lLmlkID0gaWZyYW1lLm5hbWU7XG4gIH1cblxuICByZXR1cm4gaWZyYW1lO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhc3NpZ24odGFyZ2V0KSB7XG4gIHZhciBvYmpzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcblxuICBvYmpzLmZvckVhY2goZnVuY3Rpb24gKG9iaikge1xuICAgIGlmICh0eXBlb2Ygb2JqICE9PSAnb2JqZWN0JykgeyByZXR1cm47IH1cblxuICAgIE9iamVjdC5rZXlzKG9iaikuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICB0YXJnZXRba2V5XSA9IG9ialtrZXldO1xuICAgIH0pO1xuICB9KTtcblxuICByZXR1cm4gdGFyZ2V0O1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc3JjOiAnYWJvdXQ6YmxhbmsnLFxuICBmcmFtZUJvcmRlcjogMCxcbiAgYWxsb3d0cmFuc3BhcmVuY3k6IHRydWUsXG4gIHNjcm9sbGluZzogJ25vJ1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIGF0dHJpYnV0ZXMpIHtcbiAgdmFyIHZhbHVlO1xuXG4gIGZvciAodmFyIGtleSBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgaWYgKGF0dHJpYnV0ZXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgdmFsdWUgPSBhdHRyaWJ1dGVzW2tleV07XG5cbiAgICAgIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKGtleSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShrZXksIHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIGRlZmVycmVkKGZuKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgLy8gSUU5IGRvZXNuJ3Qgc3VwcG9ydCBwYXNzaW5nIGFyZ3VtZW50cyB0byBzZXRUaW1lb3V0IHNvIHdlIGhhdmUgdG8gZW11bGF0ZSBpdC5cbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcblxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgZm4uYXBwbHkobnVsbCwgYXJncyk7XG4gICAgfSwgMSk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZGVmZXJyZWQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIG9uY2UoZm4pIHtcbiAgdmFyIGNhbGxlZCA9IGZhbHNlO1xuXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCFjYWxsZWQpIHtcbiAgICAgIGNhbGxlZCA9IHRydWU7XG4gICAgICBmbi5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBvbmNlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBwcm9taXNlT3JDYWxsYmFjayhwcm9taXNlLCBjYWxsYmFjaykgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGNvbnNpc3RlbnQtcmV0dXJuXG4gIGlmIChjYWxsYmFjaykge1xuICAgIHByb21pc2VcbiAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIGNhbGxiYWNrKG51bGwsIGRhdGEpO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHByb21pc2VPckNhbGxiYWNrO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZGVmZXJyZWQgPSByZXF1aXJlKCcuL2xpYi9kZWZlcnJlZCcpO1xudmFyIG9uY2UgPSByZXF1aXJlKCcuL2xpYi9vbmNlJyk7XG52YXIgcHJvbWlzZU9yQ2FsbGJhY2sgPSByZXF1aXJlKCcuL2xpYi9wcm9taXNlLW9yLWNhbGxiYWNrJyk7XG5cbmZ1bmN0aW9uIHdyYXBQcm9taXNlKGZuKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNhbGxiYWNrO1xuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICB2YXIgbGFzdEFyZyA9IGFyZ3NbYXJncy5sZW5ndGggLSAxXTtcblxuICAgIGlmICh0eXBlb2YgbGFzdEFyZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY2FsbGJhY2sgPSBhcmdzLnBvcCgpO1xuICAgICAgY2FsbGJhY2sgPSBvbmNlKGRlZmVycmVkKGNhbGxiYWNrKSk7XG4gICAgfVxuICAgIHJldHVybiBwcm9taXNlT3JDYWxsYmFjayhmbi5hcHBseSh0aGlzLCBhcmdzKSwgY2FsbGJhY2spOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWludmFsaWQtdGhpc1xuICB9O1xufVxuXG53cmFwUHJvbWlzZS53cmFwUHJvdG90eXBlID0gZnVuY3Rpb24gKHRhcmdldCwgb3B0aW9ucykge1xuICB2YXIgbWV0aG9kcywgaWdub3JlTWV0aG9kcywgaW5jbHVkZVByaXZhdGVNZXRob2RzO1xuXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBpZ25vcmVNZXRob2RzID0gb3B0aW9ucy5pZ25vcmVNZXRob2RzIHx8IFtdO1xuICBpbmNsdWRlUHJpdmF0ZU1ldGhvZHMgPSBvcHRpb25zLnRyYW5zZm9ybVByaXZhdGVNZXRob2RzID09PSB0cnVlO1xuXG4gIG1ldGhvZHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0YXJnZXQucHJvdG90eXBlKS5maWx0ZXIoZnVuY3Rpb24gKG1ldGhvZCkge1xuICAgIHZhciBpc05vdFByaXZhdGVNZXRob2Q7XG4gICAgdmFyIGlzTm9uQ29uc3RydWN0b3JGdW5jdGlvbiA9IG1ldGhvZCAhPT0gJ2NvbnN0cnVjdG9yJyAmJlxuICAgICAgdHlwZW9mIHRhcmdldC5wcm90b3R5cGVbbWV0aG9kXSA9PT0gJ2Z1bmN0aW9uJztcbiAgICB2YXIgaXNOb3RBbklnbm9yZWRNZXRob2QgPSBpZ25vcmVNZXRob2RzLmluZGV4T2YobWV0aG9kKSA9PT0gLTE7XG5cbiAgICBpZiAoaW5jbHVkZVByaXZhdGVNZXRob2RzKSB7XG4gICAgICBpc05vdFByaXZhdGVNZXRob2QgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBpc05vdFByaXZhdGVNZXRob2QgPSBtZXRob2QuY2hhckF0KDApICE9PSAnXyc7XG4gICAgfVxuXG4gICAgcmV0dXJuIGlzTm9uQ29uc3RydWN0b3JGdW5jdGlvbiAmJlxuICAgICAgaXNOb3RQcml2YXRlTWV0aG9kICYmXG4gICAgICBpc05vdEFuSWdub3JlZE1ldGhvZDtcbiAgfSk7XG5cbiAgbWV0aG9kcy5mb3JFYWNoKGZ1bmN0aW9uIChtZXRob2QpIHtcbiAgICB2YXIgb3JpZ2luYWwgPSB0YXJnZXQucHJvdG90eXBlW21ldGhvZF07XG5cbiAgICB0YXJnZXQucHJvdG90eXBlW21ldGhvZF0gPSB3cmFwUHJvbWlzZShvcmlnaW5hbCk7XG4gIH0pO1xuXG4gIHJldHVybiB0YXJnZXQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHdyYXBQcm9taXNlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdHlwZXMgPSByZXF1aXJlKCcuL2xpYi9jYXJkLXR5cGVzJyk7XG52YXIgY2xvbmUgPSByZXF1aXJlKCcuL2xpYi9jbG9uZScpO1xudmFyIGZpbmRCZXN0TWF0Y2ggPSByZXF1aXJlKCcuL2xpYi9maW5kLWJlc3QtbWF0Y2gnKTtcbnZhciBpc1ZhbGlkSW5wdXRUeXBlID0gcmVxdWlyZSgnLi9saWIvaXMtdmFsaWQtaW5wdXQtdHlwZScpO1xudmFyIGFkZE1hdGNoaW5nQ2FyZHNUb1Jlc3VsdHMgPSByZXF1aXJlKCcuL2xpYi9hZGQtbWF0Y2hpbmctY2FyZHMtdG8tcmVzdWx0cycpO1xuXG52YXIgdGVzdE9yZGVyO1xudmFyIGN1c3RvbUNhcmRzID0ge307XG5cbnZhciBjYXJkTmFtZXMgPSB7XG4gIFZJU0E6ICd2aXNhJyxcbiAgTUFTVEVSQ0FSRDogJ21hc3RlcmNhcmQnLFxuICBBTUVSSUNBTl9FWFBSRVNTOiAnYW1lcmljYW4tZXhwcmVzcycsXG4gIERJTkVSU19DTFVCOiAnZGluZXJzLWNsdWInLFxuICBESVNDT1ZFUjogJ2Rpc2NvdmVyJyxcbiAgSkNCOiAnamNiJyxcbiAgVU5JT05QQVk6ICd1bmlvbnBheScsXG4gIE1BRVNUUk86ICdtYWVzdHJvJyxcbiAgRUxPOiAnZWxvJyxcbiAgTUlSOiAnbWlyJyxcbiAgSElQRVI6ICdoaXBlcicsXG4gIEhJUEVSQ0FSRDogJ2hpcGVyY2FyZCdcbn07XG5cbnZhciBPUklHSU5BTF9URVNUX09SREVSID0gW1xuICBjYXJkTmFtZXMuVklTQSxcbiAgY2FyZE5hbWVzLk1BU1RFUkNBUkQsXG4gIGNhcmROYW1lcy5BTUVSSUNBTl9FWFBSRVNTLFxuICBjYXJkTmFtZXMuRElORVJTX0NMVUIsXG4gIGNhcmROYW1lcy5ESVNDT1ZFUixcbiAgY2FyZE5hbWVzLkpDQixcbiAgY2FyZE5hbWVzLlVOSU9OUEFZLFxuICBjYXJkTmFtZXMuTUFFU1RSTyxcbiAgY2FyZE5hbWVzLkVMTyxcbiAgY2FyZE5hbWVzLk1JUixcbiAgY2FyZE5hbWVzLkhJUEVSLFxuICBjYXJkTmFtZXMuSElQRVJDQVJEXG5dO1xuXG50ZXN0T3JkZXIgPSBjbG9uZShPUklHSU5BTF9URVNUX09SREVSKTtcblxuZnVuY3Rpb24gZmluZFR5cGUodHlwZSkge1xuICByZXR1cm4gY3VzdG9tQ2FyZHNbdHlwZV0gfHwgdHlwZXNbdHlwZV07XG59XG5cbmZ1bmN0aW9uIGdldEFsbENhcmRUeXBlcygpIHtcbiAgcmV0dXJuIHRlc3RPcmRlci5tYXAoZnVuY3Rpb24gKHR5cGUpIHtcbiAgICByZXR1cm4gY2xvbmUoZmluZFR5cGUodHlwZSkpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0Q2FyZFBvc2l0aW9uKG5hbWUsIGlnbm9yZUVycm9yRm9yTm90RXhpc3RpbmcpIHtcbiAgdmFyIHBvc2l0aW9uID0gdGVzdE9yZGVyLmluZGV4T2YobmFtZSk7XG5cbiAgaWYgKCFpZ25vcmVFcnJvckZvck5vdEV4aXN0aW5nICYmIHBvc2l0aW9uID09PSAtMSkge1xuICAgIHRocm93IG5ldyBFcnJvcignXCInICsgbmFtZSArICdcIiBpcyBub3QgYSBzdXBwb3J0ZWQgY2FyZCB0eXBlLicpO1xuICB9XG5cbiAgcmV0dXJuIHBvc2l0aW9uO1xufVxuXG5mdW5jdGlvbiBjcmVkaXRDYXJkVHlwZShjYXJkTnVtYmVyKSB7XG4gIHZhciBiZXN0TWF0Y2g7XG4gIHZhciByZXN1bHRzID0gW107XG5cbiAgaWYgKCFpc1ZhbGlkSW5wdXRUeXBlKGNhcmROdW1iZXIpKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgaWYgKGNhcmROdW1iZXIubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIGdldEFsbENhcmRUeXBlcyh0ZXN0T3JkZXIpO1xuICB9XG5cbiAgdGVzdE9yZGVyLmZvckVhY2goZnVuY3Rpb24gKHR5cGUpIHtcbiAgICB2YXIgY2FyZENvbmZpZ3VyYXRpb24gPSBmaW5kVHlwZSh0eXBlKTtcblxuICAgIGFkZE1hdGNoaW5nQ2FyZHNUb1Jlc3VsdHMoY2FyZE51bWJlciwgY2FyZENvbmZpZ3VyYXRpb24sIHJlc3VsdHMpO1xuICB9KTtcblxuICBiZXN0TWF0Y2ggPSBmaW5kQmVzdE1hdGNoKHJlc3VsdHMpO1xuXG4gIGlmIChiZXN0TWF0Y2gpIHtcbiAgICByZXR1cm4gW2Jlc3RNYXRjaF07XG4gIH1cblxuICByZXR1cm4gcmVzdWx0cztcbn1cblxuY3JlZGl0Q2FyZFR5cGUuZ2V0VHlwZUluZm8gPSBmdW5jdGlvbiAodHlwZSkge1xuICByZXR1cm4gY2xvbmUoZmluZFR5cGUodHlwZSkpO1xufTtcblxuY3JlZGl0Q2FyZFR5cGUucmVtb3ZlQ2FyZCA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIHZhciBwb3NpdGlvbiA9IGdldENhcmRQb3NpdGlvbihuYW1lKTtcblxuICB0ZXN0T3JkZXIuc3BsaWNlKHBvc2l0aW9uLCAxKTtcbn07XG5cbmNyZWRpdENhcmRUeXBlLmFkZENhcmQgPSBmdW5jdGlvbiAoY29uZmlnKSB7XG4gIHZhciBleGlzdGluZ0NhcmRQb3NpdGlvbiA9IGdldENhcmRQb3NpdGlvbihjb25maWcudHlwZSwgdHJ1ZSk7XG5cbiAgY3VzdG9tQ2FyZHNbY29uZmlnLnR5cGVdID0gY29uZmlnO1xuXG4gIGlmIChleGlzdGluZ0NhcmRQb3NpdGlvbiA9PT0gLTEpIHtcbiAgICB0ZXN0T3JkZXIucHVzaChjb25maWcudHlwZSk7XG4gIH1cbn07XG5cbmNyZWRpdENhcmRUeXBlLnVwZGF0ZUNhcmQgPSBmdW5jdGlvbiAoY2FyZFR5cGUsIHVwZGF0ZXMpIHtcbiAgdmFyIGNsb25lZENhcmQ7XG4gIHZhciBvcmlnaW5hbE9iamVjdCA9IGN1c3RvbUNhcmRzW2NhcmRUeXBlXSB8fCB0eXBlc1tjYXJkVHlwZV07XG5cbiAgaWYgKCFvcmlnaW5hbE9iamVjdCkge1xuICAgIHRocm93IG5ldyBFcnJvcignXCInICsgY2FyZFR5cGUgKyAnXCIgaXMgbm90IGEgcmVjb2duaXplZCB0eXBlLiBVc2UgYGFkZENhcmRgIGluc3RlYWQuJyk7XG4gIH1cblxuICBpZiAodXBkYXRlcy50eXBlICYmIG9yaWdpbmFsT2JqZWN0LnR5cGUgIT09IHVwZGF0ZXMudHlwZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IG92ZXJ3cml0ZSB0eXBlIHBhcmFtZXRlci4nKTtcbiAgfVxuXG4gIGNsb25lZENhcmQgPSBjbG9uZShvcmlnaW5hbE9iamVjdCwgdHJ1ZSk7XG5cbiAgT2JqZWN0LmtleXMoY2xvbmVkQ2FyZCkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgaWYgKHVwZGF0ZXNba2V5XSkge1xuICAgICAgY2xvbmVkQ2FyZFtrZXldID0gdXBkYXRlc1trZXldO1xuICAgIH1cbiAgfSk7XG5cbiAgY3VzdG9tQ2FyZHNbY2xvbmVkQ2FyZC50eXBlXSA9IGNsb25lZENhcmQ7XG59O1xuXG5jcmVkaXRDYXJkVHlwZS5jaGFuZ2VPcmRlciA9IGZ1bmN0aW9uIChuYW1lLCBwb3NpdGlvbikge1xuICB2YXIgY3VycmVudFBvc2l0aW9uID0gZ2V0Q2FyZFBvc2l0aW9uKG5hbWUpO1xuXG4gIHRlc3RPcmRlci5zcGxpY2UoY3VycmVudFBvc2l0aW9uLCAxKTtcbiAgdGVzdE9yZGVyLnNwbGljZShwb3NpdGlvbiwgMCwgbmFtZSk7XG59O1xuXG5jcmVkaXRDYXJkVHlwZS5yZXNldE1vZGlmaWNhdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG4gIHRlc3RPcmRlciA9IGNsb25lKE9SSUdJTkFMX1RFU1RfT1JERVIpO1xuICBjdXN0b21DYXJkcyA9IHt9O1xufTtcblxuY3JlZGl0Q2FyZFR5cGUudHlwZXMgPSBjYXJkTmFtZXM7XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlZGl0Q2FyZFR5cGU7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjbG9uZSA9IHJlcXVpcmUoJy4vY2xvbmUnKTtcbnZhciBtYXRjaGVzID0gcmVxdWlyZSgnLi9tYXRjaGVzJyk7XG5cbmZ1bmN0aW9uIGFkZE1hdGNoaW5nQ2FyZHNUb1Jlc3VsdHMoY2FyZE51bWJlciwgY2FyZENvbmZpZ3VyYXRpb24sIHJlc3VsdHMpIHtcbiAgdmFyIGksIHBhdHRlcm4sIHBhdHRlcm5MZW5ndGgsIGNsb25lZENhcmRDb25maWd1cmF0aW9uO1xuXG4gIGZvciAoaSA9IDA7IGkgPCBjYXJkQ29uZmlndXJhdGlvbi5wYXR0ZXJucy5sZW5ndGg7IGkrKykge1xuICAgIHBhdHRlcm4gPSBjYXJkQ29uZmlndXJhdGlvbi5wYXR0ZXJuc1tpXTtcblxuICAgIGlmICghbWF0Y2hlcyhjYXJkTnVtYmVyLCBwYXR0ZXJuKSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY2xvbmVkQ2FyZENvbmZpZ3VyYXRpb24gPSBjbG9uZShjYXJkQ29uZmlndXJhdGlvbik7XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShwYXR0ZXJuKSkge1xuICAgICAgcGF0dGVybkxlbmd0aCA9IFN0cmluZyhwYXR0ZXJuWzBdKS5sZW5ndGg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhdHRlcm5MZW5ndGggPSBTdHJpbmcocGF0dGVybikubGVuZ3RoO1xuICAgIH1cblxuICAgIGlmIChjYXJkTnVtYmVyLmxlbmd0aCA+PSBwYXR0ZXJuTGVuZ3RoKSB7XG4gICAgICBjbG9uZWRDYXJkQ29uZmlndXJhdGlvbi5tYXRjaFN0cmVuZ3RoID0gcGF0dGVybkxlbmd0aDtcbiAgICB9XG5cbiAgICByZXN1bHRzLnB1c2goY2xvbmVkQ2FyZENvbmZpZ3VyYXRpb24pO1xuICAgIGJyZWFrO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYWRkTWF0Y2hpbmdDYXJkc1RvUmVzdWx0cztcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNhcmRUeXBlcyA9IHtcbiAgdmlzYToge1xuICAgIG5pY2VUeXBlOiAnVmlzYScsXG4gICAgdHlwZTogJ3Zpc2EnLFxuICAgIHBhdHRlcm5zOiBbXG4gICAgICA0XG4gICAgXSxcbiAgICBnYXBzOiBbNCwgOCwgMTJdLFxuICAgIGxlbmd0aHM6IFsxNiwgMTgsIDE5XSxcbiAgICBjb2RlOiB7XG4gICAgICBuYW1lOiAnQ1ZWJyxcbiAgICAgIHNpemU6IDNcbiAgICB9XG4gIH0sXG4gIG1hc3RlcmNhcmQ6IHtcbiAgICBuaWNlVHlwZTogJ01hc3RlcmNhcmQnLFxuICAgIHR5cGU6ICdtYXN0ZXJjYXJkJyxcbiAgICBwYXR0ZXJuczogW1xuICAgICAgWzUxLCA1NV0sXG4gICAgICBbMjIyMSwgMjIyOV0sXG4gICAgICBbMjIzLCAyMjldLFxuICAgICAgWzIzLCAyNl0sXG4gICAgICBbMjcwLCAyNzFdLFxuICAgICAgMjcyMFxuICAgIF0sXG4gICAgZ2FwczogWzQsIDgsIDEyXSxcbiAgICBsZW5ndGhzOiBbMTZdLFxuICAgIGNvZGU6IHtcbiAgICAgIG5hbWU6ICdDVkMnLFxuICAgICAgc2l6ZTogM1xuICAgIH1cbiAgfSxcbiAgJ2FtZXJpY2FuLWV4cHJlc3MnOiB7XG4gICAgbmljZVR5cGU6ICdBbWVyaWNhbiBFeHByZXNzJyxcbiAgICB0eXBlOiAnYW1lcmljYW4tZXhwcmVzcycsXG4gICAgcGF0dGVybnM6IFtcbiAgICAgIDM0LFxuICAgICAgMzdcbiAgICBdLFxuICAgIGdhcHM6IFs0LCAxMF0sXG4gICAgbGVuZ3RoczogWzE1XSxcbiAgICBjb2RlOiB7XG4gICAgICBuYW1lOiAnQ0lEJyxcbiAgICAgIHNpemU6IDRcbiAgICB9XG4gIH0sXG4gICdkaW5lcnMtY2x1Yic6IHtcbiAgICBuaWNlVHlwZTogJ0RpbmVycyBDbHViJyxcbiAgICB0eXBlOiAnZGluZXJzLWNsdWInLFxuICAgIHBhdHRlcm5zOiBbXG4gICAgICBbMzAwLCAzMDVdLFxuICAgICAgMzYsXG4gICAgICAzOCxcbiAgICAgIDM5XG4gICAgXSxcbiAgICBnYXBzOiBbNCwgMTBdLFxuICAgIGxlbmd0aHM6IFsxNCwgMTYsIDE5XSxcbiAgICBjb2RlOiB7XG4gICAgICBuYW1lOiAnQ1ZWJyxcbiAgICAgIHNpemU6IDNcbiAgICB9XG4gIH0sXG4gIGRpc2NvdmVyOiB7XG4gICAgbmljZVR5cGU6ICdEaXNjb3ZlcicsXG4gICAgdHlwZTogJ2Rpc2NvdmVyJyxcbiAgICBwYXR0ZXJuczogW1xuICAgICAgNjAxMSxcbiAgICAgIFs2NDQsIDY0OV0sXG4gICAgICA2NVxuICAgIF0sXG4gICAgZ2FwczogWzQsIDgsIDEyXSxcbiAgICBsZW5ndGhzOiBbMTYsIDE5XSxcbiAgICBjb2RlOiB7XG4gICAgICBuYW1lOiAnQ0lEJyxcbiAgICAgIHNpemU6IDNcbiAgICB9XG4gIH0sXG4gIGpjYjoge1xuICAgIG5pY2VUeXBlOiAnSkNCJyxcbiAgICB0eXBlOiAnamNiJyxcbiAgICBwYXR0ZXJuczogW1xuICAgICAgMjEzMSxcbiAgICAgIDE4MDAsXG4gICAgICBbMzUyOCwgMzU4OV1cbiAgICBdLFxuICAgIGdhcHM6IFs0LCA4LCAxMl0sXG4gICAgbGVuZ3RoczogWzE2LCAxNywgMTgsIDE5XSxcbiAgICBjb2RlOiB7XG4gICAgICBuYW1lOiAnQ1ZWJyxcbiAgICAgIHNpemU6IDNcbiAgICB9XG4gIH0sXG4gIHVuaW9ucGF5OiB7XG4gICAgbmljZVR5cGU6ICdVbmlvblBheScsXG4gICAgdHlwZTogJ3VuaW9ucGF5JyxcbiAgICBwYXR0ZXJuczogW1xuICAgICAgNjIwLFxuICAgICAgWzYyNCwgNjI2XSxcbiAgICAgIFs2MjEwMCwgNjIxODJdLFxuICAgICAgWzYyMTg0LCA2MjE4N10sXG4gICAgICBbNjIxODUsIDYyMTk3XSxcbiAgICAgIFs2MjIwMCwgNjIyMDVdLFxuICAgICAgWzYyMjAxMCwgNjIyOTk5XSxcbiAgICAgIDYyMjAxOCxcbiAgICAgIFs2MjIwMTksIDYyMjk5OV0sXG4gICAgICBbNjIyMDcsIDYyMjA5XSxcbiAgICAgIFs2MjIxMjYsIDYyMjkyNV0sXG4gICAgICBbNjIzLCA2MjZdLFxuICAgICAgNjI3MCxcbiAgICAgIDYyNzIsXG4gICAgICA2Mjc2LFxuICAgICAgWzYyNzcwMCwgNjI3Nzc5XSxcbiAgICAgIFs2Mjc3ODEsIDYyNzc5OV0sXG4gICAgICBbNjI4MiwgNjI4OV0sXG4gICAgICA2MjkxLFxuICAgICAgNjI5MixcbiAgICAgIDgxMCxcbiAgICAgIFs4MTEwLCA4MTMxXSxcbiAgICAgIFs4MTMyLCA4MTUxXSxcbiAgICAgIFs4MTUyLCA4MTYzXSxcbiAgICAgIFs4MTY0LCA4MTcxXVxuICAgIF0sXG4gICAgZ2FwczogWzQsIDgsIDEyXSxcbiAgICBsZW5ndGhzOiBbMTQsIDE1LCAxNiwgMTcsIDE4LCAxOV0sXG4gICAgY29kZToge1xuICAgICAgbmFtZTogJ0NWTicsXG4gICAgICBzaXplOiAzXG4gICAgfVxuICB9LFxuICBtYWVzdHJvOiB7XG4gICAgbmljZVR5cGU6ICdNYWVzdHJvJyxcbiAgICB0eXBlOiAnbWFlc3RybycsXG4gICAgcGF0dGVybnM6IFtcbiAgICAgIDQ5MzY5OCxcbiAgICAgIFs1MDAwMDAsIDUwNjY5OF0sXG4gICAgICBbNTA2Nzc5LCA1MDg5OTldLFxuICAgICAgWzU2LCA1OV0sXG4gICAgICA2MyxcbiAgICAgIDY3LFxuICAgICAgNlxuICAgIF0sXG4gICAgZ2FwczogWzQsIDgsIDEyXSxcbiAgICBsZW5ndGhzOiBbMTIsIDEzLCAxNCwgMTUsIDE2LCAxNywgMTgsIDE5XSxcbiAgICBjb2RlOiB7XG4gICAgICBuYW1lOiAnQ1ZDJyxcbiAgICAgIHNpemU6IDNcbiAgICB9XG4gIH0sXG4gIGVsbzoge1xuICAgIG5pY2VUeXBlOiAnRWxvJyxcbiAgICB0eXBlOiAnZWxvJyxcbiAgICBwYXR0ZXJuczogW1xuICAgICAgNDAxMTc4LFxuICAgICAgNDAxMTc5LFxuICAgICAgNDM4OTM1LFxuICAgICAgNDU3NjMxLFxuICAgICAgNDU3NjMyLFxuICAgICAgNDMxMjc0LFxuICAgICAgNDUxNDE2LFxuICAgICAgNDU3MzkzLFxuICAgICAgNTA0MTc1LFxuICAgICAgWzUwNjY5OSwgNTA2Nzc4XSxcbiAgICAgIFs1MDkwMDAsIDUwOTk5OV0sXG4gICAgICA2Mjc3ODAsXG4gICAgICA2MzYyOTcsXG4gICAgICA2MzYzNjgsXG4gICAgICBbNjUwMDMxLCA2NTAwMzNdLFxuICAgICAgWzY1MDAzNSwgNjUwMDUxXSxcbiAgICAgIFs2NTA0MDUsIDY1MDQzOV0sXG4gICAgICBbNjUwNDg1LCA2NTA1MzhdLFxuICAgICAgWzY1MDU0MSwgNjUwNTk4XSxcbiAgICAgIFs2NTA3MDAsIDY1MDcxOF0sXG4gICAgICBbNjUwNzIwLCA2NTA3MjddLFxuICAgICAgWzY1MDkwMSwgNjUwOTc4XSxcbiAgICAgIFs2NTE2NTIsIDY1MTY3OV0sXG4gICAgICBbNjU1MDAwLCA2NTUwMTldLFxuICAgICAgWzY1NTAyMSwgNjU1MDU4XVxuICAgIF0sXG4gICAgZ2FwczogWzQsIDgsIDEyXSxcbiAgICBsZW5ndGhzOiBbMTZdLFxuICAgIGNvZGU6IHtcbiAgICAgIG5hbWU6ICdDVkUnLFxuICAgICAgc2l6ZTogM1xuICAgIH1cbiAgfSxcbiAgbWlyOiB7XG4gICAgbmljZVR5cGU6ICdNaXInLFxuICAgIHR5cGU6ICdtaXInLFxuICAgIHBhdHRlcm5zOiBbXG4gICAgICBbMjIwMCwgMjIwNF1cbiAgICBdLFxuICAgIGdhcHM6IFs0LCA4LCAxMl0sXG4gICAgbGVuZ3RoczogWzE2LCAxNywgMTgsIDE5XSxcbiAgICBjb2RlOiB7XG4gICAgICBuYW1lOiAnQ1ZQMicsXG4gICAgICBzaXplOiAzXG4gICAgfVxuICB9LFxuICBoaXBlcjoge1xuICAgIG5pY2VUeXBlOiAnSGlwZXInLFxuICAgIHR5cGU6ICdoaXBlcicsXG4gICAgcGF0dGVybnM6IFtcbiAgICAgIDYzNzA5NSxcbiAgICAgIDYzNzU2OCxcbiAgICAgIDYzNzU5OSxcbiAgICAgIDYzNzYwOSxcbiAgICAgIDYzNzYxMlxuICAgIF0sXG4gICAgZ2FwczogWzQsIDgsIDEyXSxcbiAgICBsZW5ndGhzOiBbMTZdLFxuICAgIGNvZGU6IHtcbiAgICAgIG5hbWU6ICdDVkMnLFxuICAgICAgc2l6ZTogM1xuICAgIH1cbiAgfSxcbiAgaGlwZXJjYXJkOiB7XG4gICAgbmljZVR5cGU6ICdIaXBlcmNhcmQnLFxuICAgIHR5cGU6ICdoaXBlcmNhcmQnLFxuICAgIHBhdHRlcm5zOiBbXG4gICAgICA2MDYyODJcbiAgICBdLFxuICAgIGdhcHM6IFs0LCA4LCAxMl0sXG4gICAgbGVuZ3RoczogWzE2XSxcbiAgICBjb2RlOiB7XG4gICAgICBuYW1lOiAnQ1ZDJyxcbiAgICAgIHNpemU6IDNcbiAgICB9XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gY2FyZFR5cGVzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBjbG9uZShvcmlnaW5hbE9iamVjdCkge1xuICB2YXIgZHVwZTtcblxuICBpZiAoIW9yaWdpbmFsT2JqZWN0KSB7IHJldHVybiBudWxsOyB9XG5cbiAgZHVwZSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkob3JpZ2luYWxPYmplY3QpKTtcblxuICByZXR1cm4gZHVwZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbG9uZTtcbiIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gaGFzRW5vdWdoUmVzdWx0c1RvRGV0ZXJtaW5lQmVzdE1hdGNoKHJlc3VsdHMpIHtcbiAgdmFyIG51bWJlck9mUmVzdWx0c1dpdGhNYXhTdHJlbmd0aFByb3BlcnR5ID0gcmVzdWx0cy5maWx0ZXIoZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgIHJldHVybiByZXN1bHQubWF0Y2hTdHJlbmd0aDtcbiAgfSkubGVuZ3RoO1xuXG4gIC8vIGlmIGFsbCBwb3NzaWJsZSByZXN1bHRzIGhhdmUgYSBtYXhTdHJlbmd0aCBwcm9wZXJ0eVxuICAvLyB0aGF0IG1lYW5zIHRoZSBjYXJkIG51bWJlciBpcyBzdWZmaWNpZW50bHkgbG9uZ1xuICAvLyBlbm91Z2ggdG8gZGV0ZXJtaW5lIGNvbmNsdXNpdmVseSB3aGF0IHRoZSB0eXBlIGlzXG4gIHJldHVybiBudW1iZXJPZlJlc3VsdHNXaXRoTWF4U3RyZW5ndGhQcm9wZXJ0eSA+IDAgJiZcbiAgICBudW1iZXJPZlJlc3VsdHNXaXRoTWF4U3RyZW5ndGhQcm9wZXJ0eSA9PT0gcmVzdWx0cy5sZW5ndGg7XG59XG5cbmZ1bmN0aW9uIGZpbmRCZXN0TWF0Y2gocmVzdWx0cykge1xuICBpZiAoIWhhc0Vub3VnaFJlc3VsdHNUb0RldGVybWluZUJlc3RNYXRjaChyZXN1bHRzKSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHJldHVybiByZXN1bHRzLnJlZHVjZShmdW5jdGlvbiAoYmVzdE1hdGNoLCByZXN1bHQpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBjb25zaXN0ZW50LXJldHVyblxuICAgIGlmICghYmVzdE1hdGNoKSB7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8vIGlmIHRoZSBjdXJyZW50IGJlc3QgbWF0Y2ggcGF0dGVybiBpcyBsZXNzIHNwZWNpZmljXG4gICAgLy8gdGhhbiB0aGlzIHJlc3VsdCwgc2V0IHRoZSByZXN1bHQgYXMgdGhlIG5ldyBiZXN0IG1hdGNoXG4gICAgaWYgKGJlc3RNYXRjaC5tYXRjaFN0cmVuZ3RoIDwgcmVzdWx0Lm1hdGNoU3RyZW5ndGgpIHtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJlc3RNYXRjaDtcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZmluZEJlc3RNYXRjaDtcbiIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gaXNWYWxpZElucHV0VHlwZShjYXJkTnVtYmVyKSB7XG4gIHJldHVybiB0eXBlb2YgY2FyZE51bWJlciA9PT0gJ3N0cmluZycgfHwgY2FyZE51bWJlciBpbnN0YW5jZW9mIFN0cmluZztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc1ZhbGlkSW5wdXRUeXBlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyBBZGFwdGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL3BvbHZvLWxhYnMvY2FyZC10eXBlL2Jsb2IvYWFhYjExZjgwZmExOTM5YmNjYzhmMjQ5MDVhMDZhZTNjZDg2NDM1Ni9zcmMvY2FyZFR5cGUuanMjTDM3LUw0MlxuZnVuY3Rpb24gbWF0Y2hlc1JhbmdlKGNhcmROdW1iZXIsIG1pbiwgbWF4KSB7XG4gIHZhciBtYXhMZW5ndGhUb0NoZWNrID0gU3RyaW5nKG1pbikubGVuZ3RoO1xuICB2YXIgc3Vic3RyID0gY2FyZE51bWJlci5zdWJzdHIoMCwgbWF4TGVuZ3RoVG9DaGVjayk7XG4gIHZhciBpbnRlZ2VyUmVwcmVzZW50YXRpb25PZkNhcmROdW1iZXIgPSBwYXJzZUludChzdWJzdHIsIDEwKTtcblxuICBtaW4gPSBwYXJzZUludChTdHJpbmcobWluKS5zdWJzdHIoMCwgc3Vic3RyLmxlbmd0aCksIDEwKTtcbiAgbWF4ID0gcGFyc2VJbnQoU3RyaW5nKG1heCkuc3Vic3RyKDAsIHN1YnN0ci5sZW5ndGgpLCAxMCk7XG5cbiAgcmV0dXJuIGludGVnZXJSZXByZXNlbnRhdGlvbk9mQ2FyZE51bWJlciA+PSBtaW4gJiYgaW50ZWdlclJlcHJlc2VudGF0aW9uT2ZDYXJkTnVtYmVyIDw9IG1heDtcbn1cblxuZnVuY3Rpb24gbWF0Y2hlc1BhdHRlcm4oY2FyZE51bWJlciwgcGF0dGVybikge1xuICBwYXR0ZXJuID0gU3RyaW5nKHBhdHRlcm4pO1xuXG4gIHJldHVybiBwYXR0ZXJuLnN1YnN0cmluZygwLCBjYXJkTnVtYmVyLmxlbmd0aCkgPT09IGNhcmROdW1iZXIuc3Vic3RyaW5nKDAsIHBhdHRlcm4ubGVuZ3RoKTtcbn1cblxuZnVuY3Rpb24gbWF0Y2hlcyhjYXJkTnVtYmVyLCBwYXR0ZXJuKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KHBhdHRlcm4pKSB7XG4gICAgcmV0dXJuIG1hdGNoZXNSYW5nZShjYXJkTnVtYmVyLCBwYXR0ZXJuWzBdLCBwYXR0ZXJuWzFdKTtcbiAgfVxuXG4gIHJldHVybiBtYXRjaGVzUGF0dGVybihjYXJkTnVtYmVyLCBwYXR0ZXJuKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXRjaGVzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgd2luLCBmcmFtZWJ1cztcbnZhciBwb3B1cHMgPSBbXTtcbnZhciBzdWJzY3JpYmVycyA9IHt9O1xudmFyIHByZWZpeCA9ICcvKmZyYW1lYnVzKi8nO1xuXG5mdW5jdGlvbiBpbmNsdWRlKHBvcHVwKSB7XG4gIGlmIChwb3B1cCA9PSBudWxsKSB7IHJldHVybiBmYWxzZTsgfVxuICBpZiAocG9wdXAuV2luZG93ID09IG51bGwpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIGlmIChwb3B1cC5jb25zdHJ1Y3RvciAhPT0gcG9wdXAuV2luZG93KSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIHBvcHVwcy5wdXNoKHBvcHVwKTtcbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIHRhcmdldChvcmlnaW4pIHtcbiAgdmFyIGtleTtcbiAgdmFyIHRhcmdldGVkRnJhbWVidXMgPSB7fTtcblxuICBmb3IgKGtleSBpbiBmcmFtZWJ1cykge1xuICAgIGlmICghZnJhbWVidXMuaGFzT3duUHJvcGVydHkoa2V5KSkgeyBjb250aW51ZTsgfVxuXG4gICAgdGFyZ2V0ZWRGcmFtZWJ1c1trZXldID0gZnJhbWVidXNba2V5XTtcbiAgfVxuXG4gIHRhcmdldGVkRnJhbWVidXMuX29yaWdpbiA9IG9yaWdpbiB8fCAnKic7XG5cbiAgcmV0dXJuIHRhcmdldGVkRnJhbWVidXM7XG59XG5cbmZ1bmN0aW9uIHB1Ymxpc2goZXZlbnQpIHtcbiAgdmFyIHBheWxvYWQsIGFyZ3M7XG4gIHZhciBvcmlnaW4gPSBfZ2V0T3JpZ2luKHRoaXMpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWludmFsaWQtdGhpc1xuXG4gIGlmIChfaXNudFN0cmluZyhldmVudCkpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIGlmIChfaXNudFN0cmluZyhvcmlnaW4pKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG4gIHBheWxvYWQgPSBfcGFja2FnZVBheWxvYWQoZXZlbnQsIGFyZ3MsIG9yaWdpbik7XG4gIGlmIChwYXlsb2FkID09PSBmYWxzZSkgeyByZXR1cm4gZmFsc2U7IH1cblxuICBfYnJvYWRjYXN0KHdpbi50b3AgfHwgd2luLnNlbGYsIHBheWxvYWQsIG9yaWdpbik7XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIHN1YnNjcmliZShldmVudCwgZm4pIHtcbiAgdmFyIG9yaWdpbiA9IF9nZXRPcmlnaW4odGhpcyk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8taW52YWxpZC10aGlzXG5cbiAgaWYgKF9zdWJzY3JpcHRpb25BcmdzSW52YWxpZChldmVudCwgZm4sIG9yaWdpbikpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgc3Vic2NyaWJlcnNbb3JpZ2luXSA9IHN1YnNjcmliZXJzW29yaWdpbl0gfHwge307XG4gIHN1YnNjcmliZXJzW29yaWdpbl1bZXZlbnRdID0gc3Vic2NyaWJlcnNbb3JpZ2luXVtldmVudF0gfHwgW107XG4gIHN1YnNjcmliZXJzW29yaWdpbl1bZXZlbnRdLnB1c2goZm4pO1xuXG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiB1bnN1YnNjcmliZShldmVudCwgZm4pIHtcbiAgdmFyIGksIHN1YnNjcmliZXJMaXN0O1xuICB2YXIgb3JpZ2luID0gX2dldE9yaWdpbih0aGlzKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1pbnZhbGlkLXRoaXNcblxuICBpZiAoX3N1YnNjcmlwdGlvbkFyZ3NJbnZhbGlkKGV2ZW50LCBmbiwgb3JpZ2luKSkgeyByZXR1cm4gZmFsc2U7IH1cblxuICBzdWJzY3JpYmVyTGlzdCA9IHN1YnNjcmliZXJzW29yaWdpbl0gJiYgc3Vic2NyaWJlcnNbb3JpZ2luXVtldmVudF07XG4gIGlmICghc3Vic2NyaWJlckxpc3QpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgZm9yIChpID0gMDsgaSA8IHN1YnNjcmliZXJMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN1YnNjcmliZXJMaXN0W2ldID09PSBmbikge1xuICAgICAgc3Vic2NyaWJlckxpc3Quc3BsaWNlKGksIDEpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBfZ2V0T3JpZ2luKHNjb3BlKSB7XG4gIHJldHVybiBzY29wZSAmJiBzY29wZS5fb3JpZ2luIHx8ICcqJztcbn1cblxuZnVuY3Rpb24gX2lzbnRTdHJpbmcoc3RyaW5nKSB7XG4gIHJldHVybiB0eXBlb2Ygc3RyaW5nICE9PSAnc3RyaW5nJztcbn1cblxuZnVuY3Rpb24gX3BhY2thZ2VQYXlsb2FkKGV2ZW50LCBhcmdzLCBvcmlnaW4pIHtcbiAgdmFyIHBhY2thZ2VkID0gZmFsc2U7XG4gIHZhciBwYXlsb2FkID0ge1xuICAgIGV2ZW50OiBldmVudCxcbiAgICBvcmlnaW46IG9yaWdpblxuICB9O1xuICB2YXIgcmVwbHkgPSBhcmdzW2FyZ3MubGVuZ3RoIC0gMV07XG5cbiAgaWYgKHR5cGVvZiByZXBseSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHBheWxvYWQucmVwbHkgPSBfc3Vic2NyaWJlUmVwbGllcihyZXBseSwgb3JpZ2luKTtcbiAgICBhcmdzID0gYXJncy5zbGljZSgwLCAtMSk7XG4gIH1cblxuICBwYXlsb2FkLmFyZ3MgPSBhcmdzO1xuXG4gIHRyeSB7XG4gICAgcGFja2FnZWQgPSBwcmVmaXggKyBKU09OLnN0cmluZ2lmeShwYXlsb2FkKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignQ291bGQgbm90IHN0cmluZ2lmeSBldmVudDogJyArIGUubWVzc2FnZSk7XG4gIH1cbiAgcmV0dXJuIHBhY2thZ2VkO1xufVxuXG5mdW5jdGlvbiBfdW5wYWNrUGF5bG9hZChlKSB7XG4gIHZhciBwYXlsb2FkLCByZXBseU9yaWdpbiwgcmVwbHlTb3VyY2UsIHJlcGx5RXZlbnQ7XG5cbiAgaWYgKGUuZGF0YS5zbGljZSgwLCBwcmVmaXgubGVuZ3RoKSAhPT0gcHJlZml4KSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIHRyeSB7XG4gICAgcGF5bG9hZCA9IEpTT04ucGFyc2UoZS5kYXRhLnNsaWNlKHByZWZpeC5sZW5ndGgpKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKHBheWxvYWQucmVwbHkgIT0gbnVsbCkge1xuICAgIHJlcGx5T3JpZ2luID0gZS5vcmlnaW47XG4gICAgcmVwbHlTb3VyY2UgPSBlLnNvdXJjZTtcbiAgICByZXBseUV2ZW50ID0gcGF5bG9hZC5yZXBseTtcblxuICAgIHBheWxvYWQucmVwbHkgPSBmdW5jdGlvbiByZXBseShkYXRhKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgY29uc2lzdGVudC1yZXR1cm5cbiAgICAgIHZhciByZXBseVBheWxvYWQ7XG5cbiAgICAgIGlmICghcmVwbHlTb3VyY2UpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgICAgIHJlcGx5UGF5bG9hZCA9IF9wYWNrYWdlUGF5bG9hZChyZXBseUV2ZW50LCBbZGF0YV0sIHJlcGx5T3JpZ2luKTtcblxuICAgICAgaWYgKHJlcGx5UGF5bG9hZCA9PT0gZmFsc2UpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgICAgIHJlcGx5U291cmNlLnBvc3RNZXNzYWdlKHJlcGx5UGF5bG9hZCwgcmVwbHlPcmlnaW4pO1xuICAgIH07XG5cbiAgICBwYXlsb2FkLmFyZ3MucHVzaChwYXlsb2FkLnJlcGx5KTtcbiAgfVxuXG4gIHJldHVybiBwYXlsb2FkO1xufVxuXG5mdW5jdGlvbiBfYXR0YWNoKHcpIHtcbiAgaWYgKHdpbikgeyByZXR1cm47IH1cbiAgd2luID0gdyB8fCBnbG9iYWw7XG5cbiAgaWYgKHdpbi5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgd2luLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBfb25tZXNzYWdlLCBmYWxzZSk7XG4gIH0gZWxzZSBpZiAod2luLmF0dGFjaEV2ZW50KSB7XG4gICAgd2luLmF0dGFjaEV2ZW50KCdvbm1lc3NhZ2UnLCBfb25tZXNzYWdlKTtcbiAgfSBlbHNlIGlmICh3aW4ub25tZXNzYWdlID09PSBudWxsKSB7XG4gICAgd2luLm9ubWVzc2FnZSA9IF9vbm1lc3NhZ2U7XG4gIH0gZWxzZSB7XG4gICAgd2luID0gbnVsbDtcbiAgfVxufVxuXG4vLyByZW1vdmVJZihwcm9kdWN0aW9uKVxuZnVuY3Rpb24gX2RldGFjaCgpIHtcbiAgaWYgKHdpbiA9PSBudWxsKSB7IHJldHVybjsgfVxuXG4gIGlmICh3aW4ucmVtb3ZlRXZlbnRMaXN0ZW5lcikge1xuICAgIHdpbi5yZW1vdmVFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgX29ubWVzc2FnZSwgZmFsc2UpO1xuICB9IGVsc2UgaWYgKHdpbi5kZXRhY2hFdmVudCkge1xuICAgIHdpbi5kZXRhY2hFdmVudCgnb25tZXNzYWdlJywgX29ubWVzc2FnZSk7XG4gIH0gZWxzZSBpZiAod2luLm9ubWVzc2FnZSA9PT0gX29ubWVzc2FnZSkge1xuICAgIHdpbi5vbm1lc3NhZ2UgPSBudWxsO1xuICB9XG5cbiAgd2luID0gbnVsbDtcbiAgcG9wdXBzID0gW107XG4gIHN1YnNjcmliZXJzID0ge307XG59XG4vLyBlbmRSZW1vdmVJZihwcm9kdWN0aW9uKVxuXG5mdW5jdGlvbiBfdXVpZCgpIHtcbiAgcmV0dXJuICd4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHgnLnJlcGxhY2UoL1t4eV0vZywgZnVuY3Rpb24gKGMpIHtcbiAgICB2YXIgciA9IE1hdGgucmFuZG9tKCkgKiAxNiB8IDA7XG4gICAgdmFyIHYgPSBjID09PSAneCcgPyByIDogciAmIDB4MyB8IDB4ODtcblxuICAgIHJldHVybiB2LnRvU3RyaW5nKDE2KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIF9vbm1lc3NhZ2UoZSkge1xuICB2YXIgcGF5bG9hZDtcblxuICBpZiAoX2lzbnRTdHJpbmcoZS5kYXRhKSkgeyByZXR1cm47IH1cblxuICBwYXlsb2FkID0gX3VucGFja1BheWxvYWQoZSk7XG4gIGlmICghcGF5bG9hZCkgeyByZXR1cm47IH1cblxuICBfZGlzcGF0Y2goJyonLCBwYXlsb2FkLmV2ZW50LCBwYXlsb2FkLmFyZ3MsIGUpO1xuICBfZGlzcGF0Y2goZS5vcmlnaW4sIHBheWxvYWQuZXZlbnQsIHBheWxvYWQuYXJncywgZSk7XG4gIF9icm9hZGNhc3RQb3B1cHMoZS5kYXRhLCBwYXlsb2FkLm9yaWdpbiwgZS5zb3VyY2UpO1xufVxuXG5mdW5jdGlvbiBfZGlzcGF0Y2gob3JpZ2luLCBldmVudCwgYXJncywgZSkge1xuICB2YXIgaTtcblxuICBpZiAoIXN1YnNjcmliZXJzW29yaWdpbl0pIHsgcmV0dXJuOyB9XG4gIGlmICghc3Vic2NyaWJlcnNbb3JpZ2luXVtldmVudF0pIHsgcmV0dXJuOyB9XG5cbiAgZm9yIChpID0gMDsgaSA8IHN1YnNjcmliZXJzW29yaWdpbl1bZXZlbnRdLmxlbmd0aDsgaSsrKSB7XG4gICAgc3Vic2NyaWJlcnNbb3JpZ2luXVtldmVudF1baV0uYXBwbHkoZSwgYXJncyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2hhc09wZW5lcihmcmFtZSkge1xuICBpZiAoZnJhbWUudG9wICE9PSBmcmFtZSkgeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYgKGZyYW1lLm9wZW5lciA9PSBudWxsKSB7IHJldHVybiBmYWxzZTsgfVxuICBpZiAoZnJhbWUub3BlbmVyID09PSBmcmFtZSkgeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYgKGZyYW1lLm9wZW5lci5jbG9zZWQgPT09IHRydWUpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIF9icm9hZGNhc3QoZnJhbWUsIHBheWxvYWQsIG9yaWdpbikge1xuICB2YXIgaSA9IDA7XG4gIHZhciBmcmFtZVRvQnJvYWRjYXN0VG87XG5cbiAgdHJ5IHtcbiAgICBmcmFtZS5wb3N0TWVzc2FnZShwYXlsb2FkLCBvcmlnaW4pO1xuXG4gICAgaWYgKF9oYXNPcGVuZXIoZnJhbWUpKSB7XG4gICAgICBfYnJvYWRjYXN0KGZyYW1lLm9wZW5lci50b3AsIHBheWxvYWQsIG9yaWdpbik7XG4gICAgfVxuXG4gICAgLy8gcHJldmlvdXNseSwgb3VyIG1heCB2YWx1ZSB3YXMgZnJhbWUuZnJhbWVzLmxlbmd0aFxuICAgIC8vIGJ1dCBmcmFtZXMubGVuZ3RoIGluaGVyaXRzIGZyb20gd2luZG93Lmxlbmd0aFxuICAgIC8vIHdoaWNoIGNhbiBiZSBvdmVyd3JpdHRlbiBpZiBhIGRldmVsb3BlciBkb2VzXG4gICAgLy8gYHZhciBsZW5ndGggPSB2YWx1ZTtgIG91dHNpZGUgb2YgYSBmdW5jdGlvblxuICAgIC8vIHNjb3BlLCBpdCdsbCBwcmV2ZW50IHVzIGZyb20gbG9vcGluZyB0aHJvdWdoXG4gICAgLy8gYWxsIHRoZSBmcmFtZXMuIFdpdGggdGhpcywgd2UgbG9vcCB0aHJvdWdoXG4gICAgLy8gdW50aWwgdGhlcmUgYXJlIG5vIGxvbmdlciBhbnkgZnJhbWVzXG4gICAgd2hpbGUgKGZyYW1lVG9Ccm9hZGNhc3RUbyA9IGZyYW1lLmZyYW1lc1tpXSkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbmQtYXNzaWduXG4gICAgICBfYnJvYWRjYXN0KGZyYW1lVG9Ccm9hZGNhc3RUbywgcGF5bG9hZCwgb3JpZ2luKTtcbiAgICAgIGkrKztcbiAgICB9XG4gIH0gY2F0Y2ggKF8pIHsgLyogaWdub3JlZCAqLyB9XG59XG5cbmZ1bmN0aW9uIF9icm9hZGNhc3RQb3B1cHMocGF5bG9hZCwgb3JpZ2luLCBzb3VyY2UpIHtcbiAgdmFyIGksIHBvcHVwO1xuXG4gIGZvciAoaSA9IHBvcHVwcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIHBvcHVwID0gcG9wdXBzW2ldO1xuXG4gICAgaWYgKHBvcHVwLmNsb3NlZCA9PT0gdHJ1ZSkge1xuICAgICAgcG9wdXBzID0gcG9wdXBzLnNsaWNlKGksIDEpO1xuICAgIH0gZWxzZSBpZiAoc291cmNlICE9PSBwb3B1cCkge1xuICAgICAgX2Jyb2FkY2FzdChwb3B1cC50b3AsIHBheWxvYWQsIG9yaWdpbik7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIF9zdWJzY3JpYmVSZXBsaWVyKGZuLCBvcmlnaW4pIHtcbiAgdmFyIHV1aWQgPSBfdXVpZCgpO1xuXG4gIGZ1bmN0aW9uIHJlcGxpZXIoZCwgbykge1xuICAgIGZuKGQsIG8pO1xuICAgIGZyYW1lYnVzLnRhcmdldChvcmlnaW4pLnVuc3Vic2NyaWJlKHV1aWQsIHJlcGxpZXIpO1xuICB9XG5cbiAgZnJhbWVidXMudGFyZ2V0KG9yaWdpbikuc3Vic2NyaWJlKHV1aWQsIHJlcGxpZXIpO1xuICByZXR1cm4gdXVpZDtcbn1cblxuZnVuY3Rpb24gX3N1YnNjcmlwdGlvbkFyZ3NJbnZhbGlkKGV2ZW50LCBmbiwgb3JpZ2luKSB7XG4gIGlmIChfaXNudFN0cmluZyhldmVudCkpIHsgcmV0dXJuIHRydWU7IH1cbiAgaWYgKHR5cGVvZiBmbiAhPT0gJ2Z1bmN0aW9uJykgeyByZXR1cm4gdHJ1ZTsgfVxuICBpZiAoX2lzbnRTdHJpbmcob3JpZ2luKSkgeyByZXR1cm4gdHJ1ZTsgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuX2F0dGFjaCgpO1xuXG5mcmFtZWJ1cyA9IHtcbiAgdGFyZ2V0OiB0YXJnZXQsXG4gIC8vIHJlbW92ZUlmKHByb2R1Y3Rpb24pXG4gIF9wYWNrYWdlUGF5bG9hZDogX3BhY2thZ2VQYXlsb2FkLFxuICBfdW5wYWNrUGF5bG9hZDogX3VucGFja1BheWxvYWQsXG4gIF9hdHRhY2g6IF9hdHRhY2gsXG4gIF9kZXRhY2g6IF9kZXRhY2gsXG4gIF9kaXNwYXRjaDogX2Rpc3BhdGNoLFxuICBfYnJvYWRjYXN0OiBfYnJvYWRjYXN0LFxuICBfc3Vic2NyaWJlUmVwbGllcjogX3N1YnNjcmliZVJlcGxpZXIsXG4gIF9zdWJzY3JpcHRpb25BcmdzSW52YWxpZDogX3N1YnNjcmlwdGlvbkFyZ3NJbnZhbGlkLFxuICBfb25tZXNzYWdlOiBfb25tZXNzYWdlLFxuICBfdXVpZDogX3V1aWQsXG4gIF9nZXRTdWJzY3JpYmVyczogZnVuY3Rpb24gKCkgeyByZXR1cm4gc3Vic2NyaWJlcnM7IH0sXG4gIF93aW46IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHdpbjsgfSxcbiAgLy8gZW5kUmVtb3ZlSWYocHJvZHVjdGlvbilcbiAgaW5jbHVkZTogaW5jbHVkZSxcbiAgcHVibGlzaDogcHVibGlzaCxcbiAgcHViOiBwdWJsaXNoLFxuICB0cmlnZ2VyOiBwdWJsaXNoLFxuICBlbWl0OiBwdWJsaXNoLFxuICBzdWJzY3JpYmU6IHN1YnNjcmliZSxcbiAgc3ViOiBzdWJzY3JpYmUsXG4gIG9uOiBzdWJzY3JpYmUsXG4gIHVuc3Vic2NyaWJlOiB1bnN1YnNjcmliZSxcbiAgdW5zdWI6IHVuc3Vic2NyaWJlLFxuICBvZmY6IHVuc3Vic2NyaWJlXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZyYW1lYnVzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgU2VhbWxlc3NwYXlFcnJvciA9IHJlcXVpcmUoJy4uLy4uL2xpYi9zZWFtbGVzc3BheS1lcnJvcicpO1xudmFyIGVycm9ycyA9IHJlcXVpcmUoJy4uL3NoYXJlZC9lcnJvcnMnKTtcbnZhciB3aGl0ZWxpc3QgPSByZXF1aXJlKCcuLi9zaGFyZWQvY29uc3RhbnRzJykud2hpdGVsaXN0ZWRBdHRyaWJ1dGVzO1xuXG5mdW5jdGlvbiBhdHRyaWJ1dGVWYWxpZGF0aW9uRXJyb3IoYXR0cmlidXRlLCB2YWx1ZSkge1xuICB2YXIgZXJyO1xuXG4gIGlmICghd2hpdGVsaXN0Lmhhc093blByb3BlcnR5KGF0dHJpYnV0ZSkpIHtcbiAgICBlcnIgPSBuZXcgU2VhbWxlc3NwYXlFcnJvcih7XG4gICAgICB0eXBlOiBlcnJvcnMuQ0FSRF9FTEVNRU5UX0FUVFJJQlVURV9OT1RfU1VQUE9SVEVELnR5cGUsXG4gICAgICBjb2RlOiBlcnJvcnMuQ0FSRF9FTEVNRU5UX0FUVFJJQlVURV9OT1RfU1VQUE9SVEVELmNvZGUsXG4gICAgICBtZXNzYWdlOiAnVGhlIFwiJyArIGF0dHJpYnV0ZSArICdcIiBhdHRyaWJ1dGUgaXMgbm90IHN1cHBvcnRlZCBpbiBDYXJkIEVsZW1lbnQuJ1xuICAgIH0pO1xuICB9IGVsc2UgaWYgKHZhbHVlICE9IG51bGwgJiYgIV9pc1ZhbGlkKGF0dHJpYnV0ZSwgdmFsdWUpKSB7XG4gICAgZXJyID0gbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgdHlwZTogZXJyb3JzLkNBUkRfRUxFTUVOVF9BVFRSSUJVVEVfVkFMVUVfTk9UX0FMTE9XRUQudHlwZSxcbiAgICAgIGNvZGU6IGVycm9ycy5DQVJEX0VMRU1FTlRfQVRUUklCVVRFX1ZBTFVFX05PVF9BTExPV0VELmNvZGUsXG4gICAgICBtZXNzYWdlOiAnVmFsdWUgXCInICsgdmFsdWUgKyAnXCIgaXMgbm90IGFsbG93ZWQgZm9yIFwiJyArIGF0dHJpYnV0ZSArICdcIiBhdHRyaWJ1dGUuJ1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIGVycjtcbn1cblxuZnVuY3Rpb24gX2lzVmFsaWQoYXR0cmlidXRlLCB2YWx1ZSkge1xuICBpZiAod2hpdGVsaXN0W2F0dHJpYnV0ZV0gPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJztcbiAgfSBlbHNlIGlmICh3aGl0ZWxpc3RbYXR0cmlidXRlXSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgcmV0dXJuIFN0cmluZyh2YWx1ZSkgPT09ICd0cnVlJyB8fCBTdHJpbmcodmFsdWUpID09PSAnZmFsc2UnO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGF0dHJpYnV0ZVZhbGlkYXRpb25FcnJvcjtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIERlc3RydWN0b3IgPSByZXF1aXJlKCcuLi8uLi9saWIvZGVzdHJ1Y3RvcicpO1xudmFyIGNsYXNzbGlzdCA9IHJlcXVpcmUoJy4uLy4uL2xpYi9jbGFzc2xpc3QnKTtcbnZhciBpRnJhbWVyID0gcmVxdWlyZSgnQGJyYWludHJlZS9pZnJhbWVyJyk7XG52YXIgQnVzID0gcmVxdWlyZSgnLi4vLi4vbGliL2J1cycpO1xudmFyIFNlYW1sZXNzcGF5RXJyb3IgPSByZXF1aXJlKCcuLi8uLi9saWIvc2VhbWxlc3NwYXktZXJyb3InKTtcbnZhciBjb21wb3NlVXJsID0gcmVxdWlyZSgnLi4vLi4vbGliL2NvbXBvc2UtdXJsJyk7XG52YXIgY29uc3RhbnRzID0gcmVxdWlyZSgnLi4vc2hhcmVkL2NvbnN0YW50cycpO1xudmFyIGVycm9ycyA9IHJlcXVpcmUoJy4uL3NoYXJlZC9lcnJvcnMnKTtcbnZhciB1dWlkID0gcmVxdWlyZSgnLi4vLi4vbGliL3V1aWQnKTtcbnZhciBldmVudHMgPSBjb25zdGFudHMuZXZlbnRzO1xudmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJy4uLy4uL2xpYi9ldmVudC1lbWl0dGVyJyk7XG52YXIgaW5qZWN0RnJhbWUgPSByZXF1aXJlKCcuLi8uLi9saWIvaW5qZWN0LWZyYW1lJyk7XG52YXIgVkVSU0lPTiA9IFwid2ViLXNka1wiO1xudmFyIG1ldGhvZHMgPSByZXF1aXJlKCcuLi8uLi9saWIvbWV0aG9kcycpO1xudmFyIGNvbnZlcnRNZXRob2RzVG9FcnJvciA9IHJlcXVpcmUoJy4uLy4uL2xpYi9jb252ZXJ0LW1ldGhvZHMtdG8tZXJyb3InKTtcbnZhciBkZWZlcnJlZCA9IHJlcXVpcmUoJy4uLy4uL2xpYi9kZWZlcnJlZCcpO1xudmFyIHNoYXJlZEVycm9ycyA9IHJlcXVpcmUoJy4uLy4uL2xpYi9lcnJvcnMnKTtcbnZhciBnZXRDYXJkVHlwZXMgPSByZXF1aXJlKCdjcmVkaXQtY2FyZC10eXBlJyk7XG52YXIgYXR0cmlidXRlVmFsaWRhdGlvbkVycm9yID0gcmVxdWlyZSgnLi9hdHRyaWJ1dGUtdmFsaWRhdGlvbi1lcnJvcicpO1xudmFyIFByb21pc2UgPSByZXF1aXJlKCcuLi8uLi9saWIvcHJvbWlzZScpO1xudmFyIHdyYXBQcm9taXNlID0gcmVxdWlyZSgnQGJyYWludHJlZS93cmFwLXByb21pc2UnKTtcblxudmFyIGFzc2lnbiA9IHJlcXVpcmUoJy4uLy4uL2xpYi9hc3NpZ24nKS5hc3NpZ247XG5cbnZhciBjYXJkRWxlbWVudEZpZWxkcyA9IFtcbiAgJ2FjY291bnROdW1iZXInLFxuICAnZXhwRGF0ZScsXG4gICdjdnYnLFxuICAncG9zdGFsQ29kZSdcbl07XG5cbi8qKlxuICogQHR5cGVkZWYge29iamVjdH0gQ2FyZEVsZW1lbnR+dG9rZW5pemVQYXlsb2FkXG4gKiBAcHJvcGVydHkge3N0cmluZ30gbm9uY2UgVGhlIHBheW1lbnQgbWV0aG9kIG5vbmNlLlxuICogQHByb3BlcnR5IHtvYmplY3R9IGRldGFpbHMgQWRkaXRpb25hbCBhY2NvdW50IGRldGFpbHMuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gZGV0YWlscy5jYXJkVHlwZSBUeXBlIG9mIGNhcmQsIGV4OiBWaXNhLCBNYXN0ZXJDYXJkLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IGRldGFpbHMubGFzdFR3byBMYXN0IHR3byBkaWdpdHMgb2YgY2FyZCBudW1iZXIuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gZGVzY3JpcHRpb24gQSBodW1hbi1yZWFkYWJsZSBkZXNjcmlwdGlvbi5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB0eXBlIFRoZSBwYXltZW50IG1ldGhvZCB0eXBlLCBhbHdheXMgYENyZWRpdENhcmRgLlxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge29iamVjdH0gQ2FyZEVsZW1lbnR+c3RhdGVPYmplY3RcbiAqIEBkZXNjcmlwdGlvbiBUaGUgZXZlbnQgcGF5bG9hZCBzZW50IGZyb20ge0BsaW5rIENhcmRFbGVtZW50I29ufG9ufSBvciB7QGxpbmsgQ2FyZEVsZW1lbnQjZ2V0U3RhdGV8Z2V0U3RhdGV9LlxuICogQHByb3BlcnR5IHtDYXJkRWxlbWVudH5DYXJkRWxlbWVudENhcmRbXX0gY2FyZHNcbiAqIFRoaXMgd2lsbCByZXR1cm4gYW4gYXJyYXkgb2YgcG90ZW50aWFsIHtAbGluayBDYXJkRWxlbWVudH5DYXJkRWxlbWVudENhcmR8Y2FyZHN9LiBJZiB0aGUgY2FyZCB0eXBlIGhhcyBiZWVuIGRldGVybWluZWQsIHRoZSBhcnJheSB3aWxsIGNvbnRhaW4gb25seSBvbmUgY2FyZC5cbiAqIEludGVybmFsbHksIENhcmQgRWxlbWVudCB1c2VzIDxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vc2VhbWxlc3NwYXkvY3JlZGl0LWNhcmQtdHlwZVwiPmNyZWRpdC1jYXJkLXR5cGU8L2E+LFxuICogYW4gb3Blbi1zb3VyY2UgY2FyZCBkZXRlY3Rpb24gbGlicmFyeS5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBlbWl0dGVkQnlcbiAqIFRoZSBuYW1lIG9mIHRoZSBmaWVsZCBhc3NvY2lhdGVkIHdpdGggYW4gZXZlbnQuIFRoaXMgd2lsbCBub3QgYmUgaW5jbHVkZWQgaWYgcmV0dXJuZWQgYnkge0BsaW5rIENhcmRFbGVtZW50I2dldFN0YXRlfGdldFN0YXRlfS4gSXQgd2lsbCBiZSBvbmUgb2YgdGhlIGZvbGxvd2luZyBzdHJpbmdzOjxicj5cbiAqIC0gYFwibnVtYmVyXCJgXG4gKiAtIGBcImN2dlwiYFxuICogLSBgXCJleHBEYXRlXCJgXG4gKiAtIGBcImV4cGlyYXRpb25Nb250aFwiYFxuICogLSBgXCJleHBpcmF0aW9uWWVhclwiYFxuICogLSBgXCJwb3N0YWxDb2RlXCJgXG4gKiBAcHJvcGVydHkge29iamVjdH0gZmllbGRzXG4gKiBAcHJvcGVydHkgez9DYXJkRWxlbWVudH5DYXJkRWxlbWVudEZpZWxkRGF0YX0gZmllbGRzLm51bWJlciB7QGxpbmsgQ2FyZEVsZW1lbnR+Q2FyZEVsZW1lbnRGaWVsZERhdGF8Q2FyZEVsZW1lbnRGaWVsZERhdGF9IGZvciB0aGUgbnVtYmVyIGZpZWxkLCBpZiBpdCBpcyBwcmVzZW50LlxuICogQHByb3BlcnR5IHs/Q2FyZEVsZW1lbnR+Q2FyZEVsZW1lbnRGaWVsZERhdGF9IGZpZWxkcy5jdnYge0BsaW5rIENhcmRFbGVtZW50fkNhcmRFbGVtZW50RmllbGREYXRhfENhcmRFbGVtZW50RmllbGREYXRhfSBmb3IgdGhlIENWViBmaWVsZCwgaWYgaXQgaXMgcHJlc2VudC5cbiAqIEBwcm9wZXJ0eSB7P0NhcmRFbGVtZW50fkNhcmRFbGVtZW50RmllbGREYXRhfSBmaWVsZHMuZXhwRGF0ZSB7QGxpbmsgQ2FyZEVsZW1lbnR+Q2FyZEVsZW1lbnRGaWVsZERhdGF8Q2FyZEVsZW1lbnRGaWVsZERhdGF9IGZvciB0aGUgZXhwaXJhdGlvbiBkYXRlIGZpZWxkLCBpZiBpdCBpcyBwcmVzZW50LlxuICogQHByb3BlcnR5IHs/Q2FyZEVsZW1lbnR+Q2FyZEVsZW1lbnRGaWVsZERhdGF9IGZpZWxkcy5leHBpcmF0aW9uTW9udGgge0BsaW5rIENhcmRFbGVtZW50fkNhcmRFbGVtZW50RmllbGREYXRhfENhcmRFbGVtZW50RmllbGREYXRhfSBmb3IgdGhlIGV4cGlyYXRpb24gbW9udGggZmllbGQsIGlmIGl0IGlzIHByZXNlbnQuXG4gKiBAcHJvcGVydHkgez9DYXJkRWxlbWVudH5DYXJkRWxlbWVudEZpZWxkRGF0YX0gZmllbGRzLmV4cGlyYXRpb25ZZWFyIHtAbGluayBDYXJkRWxlbWVudH5DYXJkRWxlbWVudEZpZWxkRGF0YXxDYXJkRWxlbWVudEZpZWxkRGF0YX0gZm9yIHRoZSBleHBpcmF0aW9uIHllYXIgZmllbGQsIGlmIGl0IGlzIHByZXNlbnQuXG4gKiBAcHJvcGVydHkgez9DYXJkRWxlbWVudH5DYXJkRWxlbWVudEZpZWxkRGF0YX0gZmllbGRzLnBvc3RhbENvZGUge0BsaW5rIENhcmRFbGVtZW50fkNhcmRFbGVtZW50RmllbGREYXRhfENhcmRFbGVtZW50RmllbGREYXRhfSBmb3IgdGhlIHBvc3RhbCBjb2RlIGZpZWxkLCBpZiBpdCBpcyBwcmVzZW50LlxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge29iamVjdH0gQ2FyZEVsZW1lbnR+Q2FyZEVsZW1lbnRGaWVsZERhdGFcbiAqIEBkZXNjcmlwdGlvbiBEYXRhIGFib3V0IENhcmQgRWxlbWVudCBmaWVsZHMsIHNlbnQgaW4ge0BsaW5rIENhcmRFbGVtZW50fnN0YXRlT2JqZWN0fHN0YXRlT2JqZWN0c30uXG4gKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSBjb250YWluZXIgUmVmZXJlbmNlIHRvIHRoZSBjb250YWluZXIgRE9NIGVsZW1lbnQgb24geW91ciBwYWdlIGFzc29jaWF0ZWQgd2l0aCB0aGUgY3VycmVudCBldmVudC5cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gaXNGb2N1c2VkIFdoZXRoZXIgb3Igbm90IHRoZSBpbnB1dCBpcyBjdXJyZW50bHkgZm9jdXNlZC5cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gaXNFbXB0eSBXaGV0aGVyIG9yIG5vdCB0aGUgdXNlciBoYXMgZW50ZXJlZCBhIHZhbHVlIGluIHRoZSBpbnB1dC5cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gaXNQb3RlbnRpYWxseVZhbGlkXG4gKiBBIGRldGVybWluYXRpb24gYmFzZWQgb24gdGhlIGZ1dHVyZSB2YWxpZGl0eSBvZiB0aGUgaW5wdXQgdmFsdWUuXG4gKiBUaGlzIGlzIGhlbHBmdWwgd2hlbiBhIHVzZXIgaXMgZW50ZXJpbmcgYSBjYXJkIG51bWJlciBhbmQgdHlwZXMgPGNvZGU+XCI0MVwiPC9jb2RlPi5cbiAqIFdoaWxlIHRoYXQgdmFsdWUgaXMgbm90IHZhbGlkIGZvciBzdWJtaXNzaW9uLCBpdCBpcyBzdGlsbCBwb3NzaWJsZSBmb3JcbiAqIGl0IHRvIGJlY29tZSBhIGZ1bGx5IHF1YWxpZmllZCBlbnRyeS4gSG93ZXZlciwgaWYgdGhlIHVzZXIgZW50ZXJzIDxjb2RlPlwiNHhcIjwvY29kZT5cbiAqIGl0IGlzIGNsZWFyIHRoYXQgdGhlIGNhcmQgbnVtYmVyIGNhbiBuZXZlciBiZWNvbWUgdmFsaWQgYW5kIGlzUG90ZW50aWFsbHlWYWxpZCB3aWxsXG4gKiByZXR1cm4gZmFsc2UuXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IGlzVmFsaWQgV2hldGhlciBvciBub3QgdGhlIHZhbHVlIG9mIHRoZSBhc3NvY2lhdGVkIGlucHV0IGlzIDxpPmZ1bGx5PC9pPiBxdWFsaWZpZWQgZm9yIHN1Ym1pc3Npb24uXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7b2JqZWN0fSBDYXJkRWxlbWVudH5DYXJkRWxlbWVudENhcmRcbiAqIEBkZXNjcmlwdGlvbiBJbmZvcm1hdGlvbiBhYm91dCB0aGUgY2FyZCB0eXBlLCBzZW50IGluIHtAbGluayBDYXJkRWxlbWVudH5zdGF0ZU9iamVjdHxzdGF0ZU9iamVjdHN9LlxuICogQHByb3BlcnR5IHtzdHJpbmd9IHR5cGUgVGhlIGNvZGUtZnJpZW5kbHkgcmVwcmVzZW50YXRpb24gb2YgdGhlIGNhcmQgdHlwZS4gSXQgd2lsbCBiZSBvbmUgb2YgdGhlIGZvbGxvd2luZyBzdHJpbmdzOlxuICogLSBgYW1lcmljYW4tZXhwcmVzc2BcbiAqIC0gYGRpbmVycy1jbHViYFxuICogLSBgZGlzY292ZXJgXG4gKiAtIGBqY2JgXG4gKiAtIGBtYWVzdHJvYFxuICogLSBgbWFzdGVyLWNhcmRgXG4gKiAtIGB1bmlvbnBheWBcbiAqIC0gYHZpc2FgXG4gKiBAcHJvcGVydHkge3N0cmluZ30gbmljZVR5cGUgVGhlIHByZXR0eS1wcmludGVkIGNhcmQgdHlwZS4gSXQgd2lsbCBiZSBvbmUgb2YgdGhlIGZvbGxvd2luZyBzdHJpbmdzOlxuICogLSBgQW1lcmljYW4gRXhwcmVzc2BcbiAqIC0gYERpbmVycyBDbHViYFxuICogLSBgRGlzY292ZXJgXG4gKiAtIGBKQ0JgXG4gKiAtIGBNYWVzdHJvYFxuICogLSBgTWFzdGVyQ2FyZGBcbiAqIC0gYFVuaW9uUGF5YFxuICogLSBgVmlzYWBcbiAqIEBwcm9wZXJ0eSB7b2JqZWN0fSBjb2RlXG4gKiBUaGlzIG9iamVjdCBjb250YWlucyBkYXRhIHJlbGV2YW50IHRvIHRoZSBzZWN1cml0eSBjb2RlIHJlcXVpcmVtZW50cyBvZiB0aGUgY2FyZCBicmFuZC5cbiAqIEZvciBleGFtcGxlLCBvbiBhIFZpc2EgY2FyZCB0aGVyZSB3aWxsIGJlIGEgPGNvZGU+Q1ZWPC9jb2RlPiBvZiAzIGRpZ2l0cywgd2hlcmVhcyBhblxuICogQW1lcmljYW4gRXhwcmVzcyBjYXJkIHJlcXVpcmVzIGEgNC1kaWdpdCA8Y29kZT5DSUQ8L2NvZGU+LlxuICogQHByb3BlcnR5IHtzdHJpbmd9IGNvZGUubmFtZSA8Y29kZT5cIkNWVlwiPC9jb2RlPiA8Y29kZT5cIkNJRFwiPC9jb2RlPiA8Y29kZT5cIkNWQ1wiPC9jb2RlPlxuICogQHByb3BlcnR5IHtudW1iZXJ9IGNvZGUuc2l6ZSBUaGUgZXhwZWN0ZWQgbGVuZ3RoIG9mIHRoZSBzZWN1cml0eSBjb2RlLiBUeXBpY2FsbHksIHRoaXMgaXMgMyBvciA0LlxuICovXG5cbi8qKlxuICogQG5hbWUgQ2FyZEVsZW1lbnQjb25cbiAqIEBmdW5jdGlvblxuICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50IFRoZSBuYW1lIG9mIHRoZSBldmVudCB0byB3aGljaCB5b3UgYXJlIHN1YnNjcmliaW5nLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gaGFuZGxlciBBIGNhbGxiYWNrIHRvIGhhbmRsZSB0aGUgZXZlbnQuXG4gKiBAZGVzY3JpcHRpb24gU3Vic2NyaWJlcyBhIGhhbmRsZXIgZnVuY3Rpb24gdG8gYSBuYW1lZCBldmVudC4gYGV2ZW50YCBzaG91bGQgYmUge0BsaW5rIENhcmRFbGVtZW50I2V2ZW50OmJsdXJ8Ymx1cn0sIHtAbGluayBDYXJkRWxlbWVudCNldmVudDpmb2N1c3xmb2N1c30sIHtAbGluayBDYXJkRWxlbWVudCNldmVudDplbXB0eXxlbXB0eX0sIHtAbGluayBDYXJkRWxlbWVudCNldmVudDpub3RFbXB0eXxub3RFbXB0eX0sIHtAbGluayBDYXJkRWxlbWVudCNldmVudDpjYXJkVHlwZUNoYW5nZXxjYXJkVHlwZUNoYW5nZX0sIG9yIHtAbGluayBDYXJkRWxlbWVudCNldmVudDp2YWxpZGl0eUNoYW5nZXx2YWxpZGl0eUNoYW5nZX0uIEV2ZW50cyB3aWxsIGVtaXQgYSB7QGxpbmsgQ2FyZEVsZW1lbnR+c3RhdGVPYmplY3R8c3RhdGVPYmplY3R9LlxuICogQGV4YW1wbGVcbiAqIDxjYXB0aW9uPkxpc3RlbmluZyB0byBhIENhcmQgRWxlbWVudCBldmVudCwgaW4gdGhpcyBjYXNlICdmb2N1cyc8L2NhcHRpb24+XG4gKiBDYXJkRWxlbWVudC5jcmVhdGUoeyAuLi4gfSwgZnVuY3Rpb24gKGNyZWF0ZUVyciwgQ2FyZEVsZW1lbnRJbnN0YW5jZSkge1xuICogICBDYXJkRWxlbWVudEluc3RhbmNlLm9uKCdmb2N1cycsIGZ1bmN0aW9uIChldmVudCkge1xuICogICAgIGNvbnNvbGUubG9nKGV2ZW50LmVtaXR0ZWRCeSwgJ2hhcyBiZWVuIGZvY3VzZWQnKTtcbiAqICAgfSk7XG4gKiB9KTtcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5cbi8qKlxuICogVGhpcyBldmVudCBpcyBlbWl0dGVkIHdoZW4gdGhlIHVzZXIgcmVxdWVzdHMgc3VibWlzc2lvbiBvZiBhbiBpbnB1dCBmaWVsZCwgc3VjaCBhcyBieSBwcmVzc2luZyB0aGUgRW50ZXIgb3IgUmV0dXJuIGtleSBvbiB0aGVpciBrZXlib2FyZCwgb3IgbW9iaWxlIGVxdWl2YWxlbnQuXG4gKiBAZXZlbnQgQ2FyZEVsZW1lbnQjaW5wdXRTdWJtaXRSZXF1ZXN0XG4gKiBAdHlwZSB7Q2FyZEVsZW1lbnR+c3RhdGVPYmplY3R9XG4gKiBAZXhhbXBsZVxuICogPGNhcHRpb24+Q2xpY2tpbmcgYSBzdWJtaXQgYnV0dG9uIHVwb24gaGl0dGluZyBFbnRlciAob3IgZXF1aXZhbGVudCkgd2l0aGluIGEgQ2FyZCBFbGVtZW50PC9jYXB0aW9uPlxuICogdmFyIENhcmRFbGVtZW50ID0gcmVxdWlyZSgnc2VhbWxlc3NwYXktd2ViL2NhcmQtZWxlbWVudCcpO1xuICogdmFyIHN1Ym1pdEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9XCJzdWJtaXRcIl0nKTtcbiAqXG4gKiBDYXJkRWxlbWVudC5jcmVhdGUoeyAuLi4gfSwgZnVuY3Rpb24gKGNyZWF0ZUVyciwgQ2FyZEVsZW1lbnRJbnN0YW5jZSkge1xuICogICBDYXJkRWxlbWVudEluc3RhbmNlLm9uKCdpbnB1dFN1Ym1pdFJlcXVlc3QnLCBmdW5jdGlvbiAoKSB7XG4gKiAgICAgLy8gVXNlciByZXF1ZXN0ZWQgc3VibWlzc2lvbiwgZS5nLiBieSBwcmVzc2luZyBFbnRlciBvciBlcXVpdmFsZW50XG4gKiAgICAgc3VibWl0QnV0dG9uLmNsaWNrKCk7XG4gKiAgIH0pO1xuICogfSk7XG4gKi9cblxuLyoqXG4gKiBUaGlzIGV2ZW50IGlzIGVtaXR0ZWQgd2hlbiBhIGZpZWxkIHRyYW5zaXRpb25zIGZyb20gaGF2aW5nIGRhdGEgdG8gYmVpbmcgZW1wdHkuXG4gKiBAZXZlbnQgQ2FyZEVsZW1lbnQjZW1wdHlcbiAqIEB0eXBlIHtDYXJkRWxlbWVudH5zdGF0ZU9iamVjdH1cbiAqIEBleGFtcGxlXG4gKiA8Y2FwdGlvbj5MaXN0ZW5pbmcgdG8gYW4gZW1wdHkgZXZlbnQ8L2NhcHRpb24+XG4gKiBDYXJkRWxlbWVudC5jcmVhdGUoeyAuLi4gfSwgZnVuY3Rpb24gKGNyZWF0ZUVyciwgQ2FyZEVsZW1lbnRJbnN0YW5jZSkge1xuICogICBDYXJkRWxlbWVudEluc3RhbmNlLm9uKCdlbXB0eScsIGZ1bmN0aW9uIChldmVudCkge1xuICogICAgIGNvbnNvbGUubG9nKGV2ZW50LmVtaXR0ZWRCeSwgJ2lzIG5vdyBlbXB0eScpO1xuICogICB9KTtcbiAqIH0pO1xuICovXG5cbi8qKlxuICogVGhpcyBldmVudCBpcyBlbWl0dGVkIHdoZW4gYSBmaWVsZCB0cmFuc2l0aW9ucyBmcm9tIGJlaW5nIGVtcHR5IHRvIGhhdmluZyBkYXRhLlxuICogQGV2ZW50IENhcmRFbGVtZW50I25vdEVtcHR5XG4gKiBAdHlwZSB7Q2FyZEVsZW1lbnR+c3RhdGVPYmplY3R9XG4gKiBAZXhhbXBsZVxuICogPGNhcHRpb24+TGlzdGVuaW5nIHRvIGFuIG5vdEVtcHR5IGV2ZW50PC9jYXB0aW9uPlxuICogQ2FyZEVsZW1lbnQuY3JlYXRlKHsgLi4uIH0sIGZ1bmN0aW9uIChjcmVhdGVFcnIsIENhcmRFbGVtZW50SW5zdGFuY2UpIHtcbiAqICAgQ2FyZEVsZW1lbnRJbnN0YW5jZS5vbignbm90RW1wdHknLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAqICAgICBjb25zb2xlLmxvZyhldmVudC5lbWl0dGVkQnksICdpcyBub3cgbm90IGVtcHR5Jyk7XG4gKiAgIH0pO1xuICogfSk7XG4gKi9cblxuLyoqXG4gKiBUaGlzIGV2ZW50IGlzIGVtaXR0ZWQgd2hlbiBhIGZpZWxkIGxvc2VzIGZvY3VzLlxuICogQGV2ZW50IENhcmRFbGVtZW50I2JsdXJcbiAqIEB0eXBlIHtDYXJkRWxlbWVudH5zdGF0ZU9iamVjdH1cbiAqIEBleGFtcGxlXG4gKiA8Y2FwdGlvbj5MaXN0ZW5pbmcgdG8gYSBibHVyIGV2ZW50PC9jYXB0aW9uPlxuICogQ2FyZEVsZW1lbnQuY3JlYXRlKHsgLi4uIH0sIGZ1bmN0aW9uIChjcmVhdGVFcnIsIENhcmRFbGVtZW50SW5zdGFuY2UpIHtcbiAqICAgQ2FyZEVsZW1lbnRJbnN0YW5jZS5vbignYmx1cicsIGZ1bmN0aW9uIChldmVudCkge1xuICogICAgIGNvbnNvbGUubG9nKGV2ZW50LmVtaXR0ZWRCeSwgJ2xvc3QgZm9jdXMnKTtcbiAqICAgfSk7XG4gKiB9KTtcbiAqL1xuXG4vKipcbiAqIFRoaXMgZXZlbnQgaXMgZW1pdHRlZCB3aGVuIGEgZmllbGQgZ2FpbnMgZm9jdXMuXG4gKiBAZXZlbnQgQ2FyZEVsZW1lbnQjZm9jdXNcbiAqIEB0eXBlIHtDYXJkRWxlbWVudH5zdGF0ZU9iamVjdH1cbiAqIEBleGFtcGxlXG4gKiA8Y2FwdGlvbj5MaXN0ZW5pbmcgdG8gYSBmb2N1cyBldmVudDwvY2FwdGlvbj5cbiAqIENhcmRFbGVtZW50LmNyZWF0ZSh7IC4uLiB9LCBmdW5jdGlvbiAoY3JlYXRlRXJyLCBDYXJkRWxlbWVudEluc3RhbmNlKSB7XG4gKiAgIENhcmRFbGVtZW50SW5zdGFuY2Uub24oJ2ZvY3VzJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gKiAgICAgY29uc29sZS5sb2coZXZlbnQuZW1pdHRlZEJ5LCAnZ2FpbmVkIGZvY3VzJyk7XG4gKiAgIH0pO1xuICogfSk7XG4gKi9cblxuLyoqXG4gKiBUaGlzIGV2ZW50IGlzIGVtaXR0ZWQgd2hlbiBhY3Rpdml0eSB3aXRoaW4gdGhlIG51bWJlciBmaWVsZCBoYXMgY2hhbmdlZCBzdWNoIHRoYXQgdGhlIHBvc3NpYmxlIGNhcmQgdHlwZSBoYXMgY2hhbmdlZC5cbiAqIEBldmVudCBDYXJkRWxlbWVudCNjYXJkVHlwZUNoYW5nZVxuICogQHR5cGUge0NhcmRFbGVtZW50fnN0YXRlT2JqZWN0fVxuICogQGV4YW1wbGVcbiAqIDxjYXB0aW9uPkxpc3RlbmluZyB0byBhIGNhcmRUeXBlQ2hhbmdlIGV2ZW50PC9jYXB0aW9uPlxuICogQ2FyZEVsZW1lbnQuY3JlYXRlKHsgLi4uIH0sIGZ1bmN0aW9uIChjcmVhdGVFcnIsIENhcmRFbGVtZW50SW5zdGFuY2UpIHtcbiAqICAgQ2FyZEVsZW1lbnRJbnN0YW5jZS5vbignY2FyZFR5cGVDaGFuZ2UnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAqICAgICBpZiAoZXZlbnQuY2FyZHMubGVuZ3RoID09PSAxKSB7XG4gKiAgICAgICBjb25zb2xlLmxvZyhldmVudC5jYXJkc1swXS50eXBlKTtcbiAqICAgICB9IGVsc2Uge1xuICogICAgICAgY29uc29sZS5sb2coJ1R5cGUgb2YgY2FyZCBub3QgeWV0IGtub3duJyk7XG4gKiAgICAgfVxuICogICB9KTtcbiAqIH0pO1xuICovXG5cbi8qKlxuICogVGhpcyBldmVudCBpcyBlbWl0dGVkIHdoZW4gdGhlIHZhbGlkaXR5IG9mIGEgZmllbGQgaGFzIGNoYW5nZWQuIFZhbGlkaXR5IGlzIHJlcHJlc2VudGVkIGluIHRoZSB7QGxpbmsgQ2FyZEVsZW1lbnR+c3RhdGVPYmplY3R8c3RhdGVPYmplY3R9IGFzIHR3byBib29sZWFuczogYGlzVmFsaWRgIGFuZCBgaXNQb3RlbnRpYWxseVZhbGlkYC5cbiAqIEBldmVudCBDYXJkRWxlbWVudCN2YWxpZGl0eUNoYW5nZVxuICogQHR5cGUge0NhcmRFbGVtZW50fnN0YXRlT2JqZWN0fVxuICogQGV4YW1wbGVcbiAqIDxjYXB0aW9uPkxpc3RlbmluZyB0byBhIHZhbGlkaXR5Q2hhbmdlIGV2ZW50PC9jYXB0aW9uPlxuICogQ2FyZEVsZW1lbnQuY3JlYXRlKHsgLi4uIH0sIGZ1bmN0aW9uIChjcmVhdGVFcnIsIENhcmRFbGVtZW50SW5zdGFuY2UpIHtcbiAqICAgQ2FyZEVsZW1lbnRJbnN0YW5jZS5vbigndmFsaWRpdHlDaGFuZ2UnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAqICAgICB2YXIgZmllbGQgPSBldmVudC5maWVsZHNbZXZlbnQuZW1pdHRlZEJ5XTtcbiAqXG4gKiAgICAgaWYgKGZpZWxkLmlzVmFsaWQpIHtcbiAqICAgICAgIGNvbnNvbGUubG9nKGV2ZW50LmVtaXR0ZWRCeSwgJ2lzIGZ1bGx5IHZhbGlkJyk7XG4gKiAgICAgfSBlbHNlIGlmIChmaWVsZC5pc1BvdGVudGlhbGx5VmFsaWQpIHtcbiAqICAgICAgIGNvbnNvbGUubG9nKGV2ZW50LmVtaXR0ZWRCeSwgJ2lzIHBvdGVudGlhbGx5IHZhbGlkJyk7XG4gKiAgICAgfSBlbHNlIHtcbiAqICAgICAgIGNvbnNvbGUubG9nKGV2ZW50LmVtaXR0ZWRCeSwgJ2lzIG5vdCB2YWxpZCcpO1xuICogICAgIH1cbiAqICAgfSk7XG4gKiB9KTtcbiAqL1xuXG5mdW5jdGlvbiBjcmVhdGVJbnB1dEV2ZW50SGFuZGxlcihjYXJkRWxlbWVudENvbnRhaW5lcikge1xuICByZXR1cm4gZnVuY3Rpb24gKGV2ZW50RGF0YSkge1xuICAgIHZhciBmaWVsZDtcbiAgICB2YXIgbWVyY2hhbnRQYXlsb2FkID0gZXZlbnREYXRhLm1lcmNoYW50UGF5bG9hZDtcbiAgICB2YXIgZW1pdHRlZEJ5ID0gbWVyY2hhbnRQYXlsb2FkLmVtaXR0ZWRCeTtcblxuICAgIGZpZWxkID0gbWVyY2hhbnRQYXlsb2FkLmZpZWxkc1tlbWl0dGVkQnldO1xuXG4gICAgY2xhc3NsaXN0LnRvZ2dsZShjYXJkRWxlbWVudENvbnRhaW5lciwgY29uc3RhbnRzLmV4dGVybmFsQ2xhc3Nlcy5WQUxJRCwgZmllbGQuaXNWYWxpZCk7IC8vIEBUT0RPOiBtYWtlIHZhbGlkIGNsYXNzIGlmIGFsbCBmaWVsZHMgYXJlIHZhbGlkXG4gICAgY2xhc3NsaXN0LnRvZ2dsZShjYXJkRWxlbWVudENvbnRhaW5lciwgY29uc3RhbnRzLmV4dGVybmFsQ2xhc3Nlcy5JTlZBTElELCAhZmllbGQuaXNQb3RlbnRpYWxseVZhbGlkKTsgLy8gQFRPRE86IG1ha2UgaW52YWxpZCBjbGFzcyBpZiBzb21lIGZpZWxkIGludmFsaWRcblxuICAgIHRoaXMuX3N0YXRlID0geyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWludmFsaWQtdGhpc1xuICAgICAgY2FyZHM6IG1lcmNoYW50UGF5bG9hZC5jYXJkcyxcbiAgICAgIGZpZWxkczogbWVyY2hhbnRQYXlsb2FkLmZpZWxkc1xuICAgIH07XG5cbiAgICB0aGlzLl9lbWl0KGV2ZW50RGF0YS50eXBlLCBtZXJjaGFudFBheWxvYWQpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWludmFsaWQtdGhpc1xuICB9O1xufVxuXG4vKipcbiAqIEBjbGFzcyBDYXJkRWxlbWVudFxuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgVGhlIENhcmQgRWxlbWVudCB7QGxpbmsgbW9kdWxlOnNlYW1sZXNzcGF5LXdlYi9jYXJkLWVsZW1lbnQuY3JlYXRlIGNyZWF0ZX0gb3B0aW9ucy5cbiAqIEBkZXNjcmlwdGlvbiA8c3Ryb25nPkRvIG5vdCB1c2UgdGhpcyBjb25zdHJ1Y3RvciBkaXJlY3RseS4gVXNlIHtAbGluayBtb2R1bGU6c2VhbWxlc3NwYXktd2ViL2NhcmQtZWxlbWVudC5jcmVhdGV8c2VhbWxlc3NwYXktd2ViLmNhcmQtZWxlbWVudC5jcmVhdGV9IGluc3RlYWQuPC9zdHJvbmc+XG4gKiBAY2xhc3NkZXNjIFRoaXMgY2xhc3MgcmVwcmVzZW50cyBhIENhcmQgRWxlbWVudCBjb21wb25lbnQgcHJvZHVjZWQgYnkge0BsaW5rIG1vZHVsZTpzZWFtbGVzc3BheS13ZWIvY2FyZC1lbGVtZW50LmNyZWF0ZXxzZWFtbGVzc3BheS13ZWIvY2FyZC1lbGVtZW50LmNyZWF0ZX0uIEluc3RhbmNlcyBvZiB0aGlzIGNsYXNzIGhhdmUgbWV0aG9kcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCB0aGUgaW5wdXQgZmllbGRzIHdpdGhpbiBDYXJkIEVsZW1lbnQnIGlmcmFtZXMuXG4gKi9cbmZ1bmN0aW9uIENhcmRFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIGNsaWVudFZlcnNpb24sIGNsaWVudENvbmZpZztcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgY29tcG9uZW50SWQgPSB1dWlkKCk7XG5cbiAgaWYgKCFvcHRpb25zLmNsaWVudCkge1xuICAgIHRocm93IG5ldyBTZWFtbGVzc3BheUVycm9yKHtcbiAgICAgIHR5cGU6IHNoYXJlZEVycm9ycy5JTlNUQU5USUFUSU9OX09QVElPTl9SRVFVSVJFRC50eXBlLFxuICAgICAgY29kZTogc2hhcmVkRXJyb3JzLklOU1RBTlRJQVRJT05fT1BUSU9OX1JFUVVJUkVELmNvZGUsXG4gICAgICBtZXNzYWdlOiAnb3B0aW9ucy5jbGllbnQgaXMgcmVxdWlyZWQgd2hlbiBpbnN0YW50aWF0aW5nIENhcmQgRWxlbWVudC4nXG4gICAgfSk7XG4gIH1cblxuICBjbGllbnRDb25maWcgPSBvcHRpb25zLmNsaWVudC5nZXRDb25maWd1cmF0aW9uKCk7XG4gIGNsaWVudFZlcnNpb24gPSBjbGllbnRDb25maWcuYW5hbHl0aWNzTWV0YWRhdGEuc2RrVmVyc2lvbjtcbiAgaWYgKGNsaWVudFZlcnNpb24gIT09IFZFUlNJT04pIHtcbiAgICB0aHJvdyBuZXcgU2VhbWxlc3NwYXlFcnJvcih7XG4gICAgICB0eXBlOiBzaGFyZWRFcnJvcnMuSU5DT01QQVRJQkxFX1ZFUlNJT05TLnR5cGUsXG4gICAgICBjb2RlOiBzaGFyZWRFcnJvcnMuSU5DT01QQVRJQkxFX1ZFUlNJT05TLmNvZGUsXG4gICAgICBtZXNzYWdlOiAnQ2xpZW50ICh2ZXJzaW9uICcgKyBjbGllbnRWZXJzaW9uICsgJykgYW5kIENhcmQgRWxlbWVudCAodmVyc2lvbiAnICsgVkVSU0lPTiArICcpIGNvbXBvbmVudHMgbXVzdCBiZSBmcm9tIHRoZSBzYW1lIFNESyB2ZXJzaW9uLidcbiAgICB9KTtcbiAgfVxuXG4gIGlmICghb3B0aW9ucy5zZWxlY3Rvcikge1xuICAgIHRocm93IG5ldyBTZWFtbGVzc3BheUVycm9yKHtcbiAgICAgIHR5cGU6IHNoYXJlZEVycm9ycy5JTlNUQU5USUFUSU9OX09QVElPTl9SRVFVSVJFRC50eXBlLFxuICAgICAgY29kZTogc2hhcmVkRXJyb3JzLklOU1RBTlRJQVRJT05fT1BUSU9OX1JFUVVJUkVELmNvZGUsXG4gICAgICBtZXNzYWdlOiAnb3B0aW9ucy5zZWxlY3RvciBpcyByZXF1aXJlZCB3aGVuIGluc3RhbnRpYXRpbmcgQ2FyZCBFbGVtZW50LidcbiAgICB9KTtcbiAgfVxuXG4gIEV2ZW50RW1pdHRlci5jYWxsKHRoaXMpO1xuXG4gIHRoaXMuX2luamVjdGVkTm9kZXMgPSBudWxsO1xuICB0aGlzLl9kZXN0cnVjdG9yID0gbmV3IERlc3RydWN0b3IoKTtcbiAgdGhpcy5fc3RhdGUgPSB7XG4gICAgZmllbGRzOiB7fSxcbiAgICBjYXJkczogZ2V0Q2FyZFR5cGVzKCcnKVxuICB9O1xuXG4gIHRoaXMuX2J1cyA9IG5ldyBCdXMoe1xuICAgIGNoYW5uZWw6IGNvbXBvbmVudElkLFxuICAgIG1lcmNoYW50VXJsOiBsb2NhdGlvbi5ocmVmXG4gIH0pO1xuXG4gIHRoaXMuX2Rlc3RydWN0b3IucmVnaXN0ZXJGdW5jdGlvbkZvclRlYXJkb3duKFxuICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuX2J1cy50ZWFyZG93bigpO1xuICAgIH1cbiAgKTtcblxuICB0aGlzLl9jbGllbnQgPSBvcHRpb25zLmNsaWVudDtcblxuICB2YXIgY29udGFpbmVyLCBmcmFtZTtcblxuICBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKG9wdGlvbnMuc2VsZWN0b3IpO1xuXG4gIGlmICghY29udGFpbmVyKSB7XG4gICAgdGhyb3cgbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgdHlwZTogZXJyb3JzLkNBUkRfRUxFTUVOVF9JTlZBTElEX0ZJRUxEX1NFTEVDVE9SLnR5cGUsXG4gICAgICBjb2RlOiBlcnJvcnMuQ0FSRF9FTEVNRU5UX0lOVkFMSURfRklFTERfU0VMRUNUT1IuY29kZSxcbiAgICAgIG1lc3NhZ2U6IGVycm9ycy5DQVJEX0VMRU1FTlRfSU5WQUxJRF9GSUVMRF9TRUxFQ1RPUi5tZXNzYWdlLFxuICAgICAgZGV0YWlsczogeyBmaWVsZFNlbGVjdG9yOiBvcHRpb25zLnNlbGVjdG9yIH1cbiAgICB9KTtcbiAgfVxuXG4gIGZyYW1lID0gaUZyYW1lcih7XG4gICAgdHlwZTogJ2NhcmQtZWxlbWVudCcsXG4gICAgbmFtZTogJ3NlYW1sZXNzcGF5LWNhcmQtZWxlbWVudCcsXG4gICAgc3R5bGU6IHt9XG4gIH0pO1xuXG4gIE9iamVjdC5rZXlzKGNvbnN0YW50cy5kZWZhdWx0SUZyYW1lU3R5bGUpLmZvckVhY2goZnVuY3Rpb24gKHByb3BlcnR5TmFtZSkge1xuICAgIGZyYW1lLnN0eWxlLnNldFByb3BlcnR5LmFwcGx5KGZyYW1lLnN0eWxlLCBbcHJvcGVydHlOYW1lXS5jb25jYXQoY29uc3RhbnRzLmRlZmF1bHRJRnJhbWVTdHlsZVtwcm9wZXJ0eU5hbWVdKSk7XG4gIH0pO1xuXG4gIHRoaXMuX2luamVjdGVkTm9kZXMgPSBpbmplY3RGcmFtZShmcmFtZSwgY29udGFpbmVyKTtcbiAgdGhpcy5fc3RhdGUuZnJhbWVFbGVtZW50ID0gZnJhbWU7XG4gIHRoaXMuX3N0YXRlLmNvbnRhaW5lckVsZW1lbnQgPSBjb250YWluZXI7XG5cbiAgdGhpcy5fc3RhdGUuZmllbGRzID0gY2FyZEVsZW1lbnRGaWVsZHMucmVkdWNlKGZ1bmN0aW9uIChyZXN1bHQsIGZpZWxkTmFtZSkge1xuICAgIHJlc3VsdFtmaWVsZE5hbWVdID0ge1xuICAgICAgaXNFbXB0eTogdHJ1ZSxcbiAgICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgICAgaXNQb3RlbnRpYWxseVZhbGlkOiB0cnVlLFxuICAgICAgaXNGb2N1c2VkOiBmYWxzZVxuICAgIH07XG5cbiAgICByZXR1cm4gYXNzaWduKHt9LCByZXN1bHQpO1xuICB9LCB7fSk7XG5cbiAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgZnJhbWUuc3JjID0gY29tcG9zZVVybChjbGllbnRDb25maWcsICdjYXJkLWVsZW1lbnQnLCBjb21wb25lbnRJZCwgY2xpZW50Q29uZmlnLmlzRGVidWcpO1xuICB9LCAwKTtcblxuICB0aGlzLl9idXMub24oZXZlbnRzLkZSQU1FX1JFQURZLCBmdW5jdGlvbiAocmVwbHkpIHtcbiAgICByZXBseShvcHRpb25zKTtcbiAgICBzZWxmLl9lbWl0KCdyZWFkeScpO1xuICB9KTtcblxuICB0aGlzLl9idXMub24oXG4gICAgZXZlbnRzLklOUFVUX0VWRU5ULFxuICAgIGNyZWF0ZUlucHV0RXZlbnRIYW5kbGVyKGNvbnRhaW5lcikuYmluZCh0aGlzKVxuICApO1xuXG4gIHRoaXMuX2Rlc3RydWN0b3IucmVnaXN0ZXJGdW5jdGlvbkZvclRlYXJkb3duKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaiwgbm9kZSwgcGFyZW50O1xuXG4gICAgZm9yIChqID0gMDsgaiA8IHNlbGYuX2luamVjdGVkTm9kZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgIG5vZGUgPSBzZWxmLl9pbmplY3RlZE5vZGVzW2pdO1xuICAgICAgcGFyZW50ID0gbm9kZS5wYXJlbnROb2RlO1xuXG4gICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQobm9kZSk7XG5cbiAgICAgIGNsYXNzbGlzdC5yZW1vdmUoXG4gICAgICAgIHBhcmVudCxcbiAgICAgICAgY29uc3RhbnRzLmV4dGVybmFsQ2xhc3Nlcy5GT0NVU0VELFxuICAgICAgICBjb25zdGFudHMuZXh0ZXJuYWxDbGFzc2VzLklOVkFMSUQsXG4gICAgICAgIGNvbnN0YW50cy5leHRlcm5hbENsYXNzZXMuVkFMSURcbiAgICAgICk7XG4gICAgfVxuICB9KTtcblxuICB0aGlzLl9kZXN0cnVjdG9yLnJlZ2lzdGVyRnVuY3Rpb25Gb3JUZWFyZG93bihmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1ldGhvZE5hbWVzID0gbWV0aG9kcyhDYXJkRWxlbWVudC5wcm90b3R5cGUpLmNvbmNhdChtZXRob2RzKEV2ZW50RW1pdHRlci5wcm90b3R5cGUpKTtcblxuICAgIGNvbnZlcnRNZXRob2RzVG9FcnJvcihzZWxmLCBtZXRob2ROYW1lcyk7XG4gIH0pO1xufVxuXG5DYXJkRWxlbWVudC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEV2ZW50RW1pdHRlci5wcm90b3R5cGUsIHtcbiAgY29uc3RydWN0b3I6IENhcmRFbGVtZW50XG59KTtcblxuLyoqXG4gKiBDbGVhbmx5IHJlbW92ZSBhbnl0aGluZyBzZXQgdXAgYnkge0BsaW5rIG1vZHVsZTpzZWFtbGVzc3BheS13ZWIvY2FyZC1lbGVtZW50LmNyZWF0ZXxjcmVhdGV9LlxuICogQHB1YmxpY1xuICogQGZ1bmN0aW9uXG4gKiBAcGFyYW0ge2NhbGxiYWNrfSBbY2FsbGJhY2tdIENhbGxlZCBvbiBjb21wbGV0aW9uLCBjb250YWluaW5nIGFuIGVycm9yIGlmIG9uZSBvY2N1cnJlZC4gTm8gZGF0YSBpcyByZXR1cm5lZCBpZiB0ZWFyZG93biBjb21wbGV0ZXMgc3VjY2Vzc2Z1bGx5LiBJZiBubyBjYWxsYmFjayBpcyBwcm92aWRlZCwgYHRlYXJkb3duYCByZXR1cm5zIGEgcHJvbWlzZS5cbiAqIEBleGFtcGxlXG4gKiBDYXJkRWxlbWVudEluc3RhbmNlLnRlYXJkb3duKGZ1bmN0aW9uICh0ZWFyZG93bkVycikge1xuICogICBpZiAodGVhcmRvd25FcnIpIHtcbiAqICAgICBjb25zb2xlLmVycm9yKCdDb3VsZCBub3QgdGVhciBkb3duIENhcmQgRWxlbWVudCEnKTtcbiAqICAgfSBlbHNlIHtcbiAqICAgICBjb25zb2xlLmluZm8oJ0NhcmQgRWxlbWVudCBoYXMgYmVlbiB0b3JuIGRvd24hJyk7XG4gKiAgIH1cbiAqIH0pO1xuICogQHJldHVybnMge1Byb21pc2V8dm9pZH0gSWYgbm8gY2FsbGJhY2sgaXMgcHJvdmlkZWQsIHJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2hlbiB0aGUgdGVhcmRvd24gaXMgY29tcGxldGUuXG4gKi9cbkNhcmRFbGVtZW50LnByb3RvdHlwZS50ZWFyZG93biA9IHdyYXBQcm9taXNlKFxuICBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWludmFsaWQtdGhpc1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHNlbGYuX2Rlc3RydWN0b3IudGVhcmRvd24oZnVuY3Rpb24gKGVycikge1xuXG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4pO1xuXG4vKipcbiAqIFRva2VuaXplcyBmaWVsZHMgYW5kIHJldHVybnMgYSB0b2tlbiBwYXlsb2FkLlxuICogQHB1YmxpY1xuICogQGZ1bmN0aW9uXG4gKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnNdIEFsbCB0b2tlbml6YXRpb24gb3B0aW9ucyBmb3IgdGhlIENhcmQgRWxlbWVudCBjb21wb25lbnQuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLnZhdWx0PWZhbHNlXSBXaGVuIHRydWUsIHdpbGwgdmF1bHQgdGhlIHRva2VuaXplZCBjYXJkLiBDYXJkcyB3aWxsIG9ubHkgYmUgdmF1bHRlZCB3aGVuIHVzaW5nIGEgY2xpZW50IGNyZWF0ZWQgd2l0aCBhIGNsaWVudCB0b2tlbiB0aGF0IGluY2x1ZGVzIGEgY3VzdG9tZXIgSUQuXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuYmlsbGluZ0FkZHJlc3MucG9zdGFsQ29kZV0gV2hlbiBzdXBwbGllZCwgdGhpcyBwb3N0YWwgY29kZSB3aWxsIGJlIHRva2VuaXplZCBhbG9uZyB3aXRoIHRoZSBjb250ZW50cyBvZiB0aGUgZmllbGRzLiBJZiBhIHBvc3RhbCBjb2RlIGlzIHByb3ZpZGVkIGFzIHBhcnQgb2YgdGhlIENhcmQgRWxlbWVudCBjb25maWd1cmF0aW9uLCB0aGUgdmFsdWUgb2YgdGhlIGZpZWxkIHdpbGwgYmUgdG9rZW5pemVkIGFuZCB0aGlzIHZhbHVlIHdpbGwgYmUgaWdub3JlZC5cbiAqIEBwYXJhbSB7Y2FsbGJhY2t9IFtjYWxsYmFja10gVGhlIHNlY29uZCBhcmd1bWVudCwgPGNvZGU+ZGF0YTwvY29kZT4sIGlzIGEge0BsaW5rIENhcmRFbGVtZW50fnRva2VuaXplUGF5bG9hZHx0b2tlbml6ZVBheWxvYWR9LiBJZiBubyBjYWxsYmFjayBpcyBwcm92aWRlZCwgYHRva2VuaXplYCByZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCByZXNvbHZlcyB3aXRoIGEge0BsaW5rIENhcmRFbGVtZW50fnRva2VuaXplUGF5bG9hZHx0b2tlbml6ZVBheWxvYWR9LlxuICogQGV4YW1wbGUgPGNhcHRpb24+VG9rZW5pemUgYSBjYXJkPC9jYXB0aW9uPlxuICogQ2FyZEVsZW1lbnRJbnN0YW5jZS50b2tlbml6ZShmdW5jdGlvbiAodG9rZW5pemVFcnIsIHBheWxvYWQpIHtcbiAqICAgaWYgKHRva2VuaXplRXJyKSB7XG4gKiAgICAgc3dpdGNoICh0b2tlbml6ZUVyci5jb2RlKSB7XG4gKiAgICAgICBjYXNlICdDQVJEX0VMRU1FTlRfRklFTERTX0VNUFRZJzpcbiAqICAgICAgICAgY29uc29sZS5lcnJvcignQWxsIGZpZWxkcyBhcmUgZW1wdHkhIFBsZWFzZSBmaWxsIG91dCB0aGUgZm9ybS4nKTtcbiAqICAgICAgICAgYnJlYWs7XG4gKiAgICAgICBjYXNlICdDQVJEX0VMRU1FTlRfRklFTERTX0lOVkFMSUQnOlxuICogICAgICAgICBjb25zb2xlLmVycm9yKCdTb21lIGZpZWxkcyBhcmUgaW52YWxpZDonLCB0b2tlbml6ZUVyci5kZXRhaWxzLmludmFsaWRGaWVsZEtleXMpO1xuICogICAgICAgICBicmVhaztcbiAqICAgICAgIGNhc2UgJ0NBUkRfRUxFTUVOVF9GQUlMRURfVE9LRU5JWkFUSU9OJzpcbiAqICAgICAgICAgY29uc29sZS5lcnJvcignVG9rZW5pemF0aW9uIGZhaWxlZCBzZXJ2ZXIgc2lkZS4gSXMgdGhlIGNhcmQgdmFsaWQ/Jyk7XG4gKiAgICAgICAgIGJyZWFrO1xuICogICAgICAgY2FzZSAnQ0FSRF9FTEVNRU5UX1RPS0VOSVpBVElPTl9ORVRXT1JLX0VSUk9SJzpcbiAqICAgICAgICAgY29uc29sZS5lcnJvcignTmV0d29yayBlcnJvciBvY2N1cnJlZCB3aGVuIHRva2VuaXppbmcuJyk7XG4gKiAgICAgICAgIGJyZWFrO1xuICogICAgICAgZGVmYXVsdDpcbiAqICAgICAgICAgY29uc29sZS5lcnJvcignU29tZXRoaW5nIGJhZCBoYXBwZW5lZCEnLCB0b2tlbml6ZUVycik7XG4gKiAgICAgfVxuICogICB9IGVsc2Uge1xuICogICAgIGNvbnNvbGUubG9nKCdHb3Qgbm9uY2U6JywgcGF5bG9hZC5ub25jZSk7XG4gKiAgIH1cbiAqIH0pO1xuICogQGV4YW1wbGUgPGNhcHRpb24+VG9rZW5pemUgYW5kIHZhdWx0IGEgY2FyZDwvY2FwdGlvbj5cbiAqIENhcmRFbGVtZW50SW5zdGFuY2UudG9rZW5pemUoe1xuICogICB2YXVsdDogdHJ1ZVxuICogfSwgZnVuY3Rpb24gKHRva2VuaXplRXJyLCBwYXlsb2FkKSB7XG4gKiAgIGlmICh0b2tlbml6ZUVycikge1xuICogICAgIGNvbnNvbGUuZXJyb3IodG9rZW5pemVFcnIpO1xuICogICB9IGVsc2Uge1xuICogICAgIGNvbnNvbGUubG9nKCdHb3Qgbm9uY2U6JywgcGF5bG9hZC5ub25jZSk7XG4gKiAgIH1cbiAqIH0pO1xuICogQGV4YW1wbGUgPGNhcHRpb24+VG9rZW5pemUgYSBjYXJkIHdpdGggdGhlIHBvc3RhbCBjb2RlIG9wdGlvbjwvY2FwdGlvbj5cbiAqIENhcmRFbGVtZW50SW5zdGFuY2UudG9rZW5pemUoe1xuICogICBiaWxsaW5nQWRkcmVzczoge1xuICogICAgIHBvc3RhbENvZGU6ICcxMTExMSdcbiAqICAgfVxuICogfSwgZnVuY3Rpb24gKHRva2VuaXplRXJyLCBwYXlsb2FkKSB7XG4gKiAgIGlmICh0b2tlbml6ZUVycikge1xuICogICAgIGNvbnNvbGUuZXJyb3IodG9rZW5pemVFcnIpO1xuICogICB9IGVsc2Uge1xuICogICAgIGNvbnNvbGUubG9nKCdHb3Qgbm9uY2U6JywgcGF5bG9hZC5ub25jZSk7XG4gKiAgIH1cbiAqIH0pO1xuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbkNhcmRFbGVtZW50LnByb3RvdHlwZS50b2tlbml6ZSA9IHdyYXBQcm9taXNlKFxuICBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIHZhciBzZWxmID0gdGhpczsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1pbnZhbGlkLXRoaXNcblxuICAgIGlmICghb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IHt9O1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBzZWxmLl9idXMuZW1pdChldmVudHMuVE9LRU5JWkFUSU9OX1JFUVVFU1QsIG9wdGlvbnMsIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICB2YXIgZXJyID0gcmVzcG9uc2VbMF07XG4gICAgICAgIHZhciBwYXlsb2FkID0gcmVzcG9uc2VbMV07XG5cbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc29sdmUocGF5bG9hZCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4pO1xuXG4vKipcbiAqIFNldHMgYW4gYXR0cmlidXRlIG9mIGEge0BsaW5rIG1vZHVsZTpzZWFtbGVzc3BheS13ZWIvY2FyZC1lbGVtZW50fmZpZWxkIGZpZWxkfS5cbiAqIFN1cHBvcnRlZCBhdHRyaWJ1dGVzIGFyZSBgYXJpYS1pbnZhbGlkYCwgYGFyaWEtcmVxdWlyZWRgLCBgZGlzYWJsZWRgLCBhbmQgYHBsYWNlaG9sZGVyYC5cbiAqXG4gKiBAcHVibGljXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyBUaGUgb3B0aW9ucyBmb3IgdGhlIGF0dHJpYnV0ZSB5b3Ugd2lzaCB0byBzZXQuXG4gKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9ucy5maWVsZCBUaGUgZmllbGQgdG8gd2hpY2ggeW91IHdpc2ggdG8gYWRkIGFuIGF0dHJpYnV0ZS4gTXVzdCBiZSBhIHZhbGlkIHtAbGluayBtb2R1bGU6c2VhbWxlc3NwYXktd2ViL2NhcmQtZWxlbWVudH5maWVsZE9wdGlvbnMgZmllbGRPcHRpb259LlxuICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbnMuYXR0cmlidXRlIFRoZSBuYW1lIG9mIHRoZSBhdHRyaWJ1dGUgeW91IHdpc2ggdG8gYWRkIHRvIHRoZSBmaWVsZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLnZhbHVlIFRoZSB2YWx1ZSBmb3IgdGhlIGF0dHJpYnV0ZS5cbiAqIEBwYXJhbSB7Y2FsbGJhY2t9IFtjYWxsYmFja10gQ2FsbGJhY2sgZXhlY3V0ZWQgb24gY29tcGxldGlvbiwgY29udGFpbmluZyBhbiBlcnJvciBpZiBvbmUgb2NjdXJyZWQuIE5vIGRhdGEgaXMgcmV0dXJuZWQgaWYgdGhlIGF0dHJpYnV0ZSBpcyBzZXQgc3VjY2Vzc2Z1bGx5LlxuICpcbiAqIEBleGFtcGxlIDxjYXB0aW9uPlNldCB0aGUgcGxhY2Vob2xkZXIgYXR0cmlidXRlIG9mIGEgZmllbGQ8L2NhcHRpb24+XG4gKiBDYXJkRWxlbWVudEluc3RhbmNlLnNldEF0dHJpYnV0ZSh7XG4gKiAgIGZpZWxkOiAnYWNjb3VudE51bWJlcicsXG4gKiAgIGF0dHJpYnV0ZTogJ3BsYWNlaG9sZGVyJyxcbiAqICAgdmFsdWU6ICcxMTExIDExMTEgMTExMSAxMTExJ1xuICogfSwgZnVuY3Rpb24gKGF0dHJpYnV0ZUVycikge1xuICogICBpZiAoYXR0cmlidXRlRXJyKSB7XG4gKiAgICAgY29uc29sZS5lcnJvcihhdHRyaWJ1dGVFcnIpO1xuICogICB9XG4gKiB9KTtcbiAqXG4gKiBAZXhhbXBsZSA8Y2FwdGlvbj5TZXQgdGhlIGFyaWEtcmVxdWlyZWQgYXR0cmlidXRlIG9mIGEgZmllbGQ8L2NhcHRpb24+XG4gKiBDYXJkRWxlbWVudEluc3RhbmNlLnNldEF0dHJpYnV0ZSh7XG4gKiAgIGZpZWxkOiAnYWNjb3VudE51bWJlcicsXG4gKiAgIGF0dHJpYnV0ZTogJ2FyaWEtcmVxdWlyZWQnLFxuICogICB2YWx1ZTogdHJ1ZVxuICogfSwgZnVuY3Rpb24gKGF0dHJpYnV0ZUVycikge1xuICogICBpZiAoYXR0cmlidXRlRXJyKSB7XG4gKiAgICAgY29uc29sZS5lcnJvcihhdHRyaWJ1dGVFcnIpO1xuICogICB9XG4gKiB9KTtcbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuQ2FyZEVsZW1lbnQucHJvdG90eXBlLnNldEF0dHJpYnV0ZSA9IGZ1bmN0aW9uIChvcHRpb25zLCBjYWxsYmFjaykge1xuICB2YXIgYXR0cmlidXRlRXJyLCBlcnI7XG5cbiAgaWYgKGNhcmRFbGVtZW50RmllbGRzLmluZGV4T2Yob3B0aW9ucy5maWVsZCkgPT09IC0xKSB7XG4gICAgZXJyID0gbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgdHlwZTogZXJyb3JzLkNBUkRfRUxFTUVOVF9GSUVMRF9JTlZBTElELnR5cGUsXG4gICAgICBjb2RlOiBlcnJvcnMuQ0FSRF9FTEVNRU5UX0ZJRUxEX0lOVkFMSUQuY29kZSxcbiAgICAgIG1lc3NhZ2U6ICdcIicgKyBvcHRpb25zLmZpZWxkICsgJ1wiIGlzIG5vdCBhIHZhbGlkIGZpZWxkLiBZb3UgbXVzdCB1c2UgYSB2YWxpZCBmaWVsZCBvcHRpb24gd2hlbiBzZXR0aW5nIGFuIGF0dHJpYnV0ZS4nXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgYXR0cmlidXRlRXJyID0gYXR0cmlidXRlVmFsaWRhdGlvbkVycm9yKG9wdGlvbnMuYXR0cmlidXRlLCBvcHRpb25zLnZhbHVlKTtcblxuICAgIGlmIChhdHRyaWJ1dGVFcnIpIHtcbiAgICAgIGVyciA9IGF0dHJpYnV0ZUVycjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fYnVzLmVtaXQoZXZlbnRzLlNFVF9BVFRSSUJVVEUsIG9wdGlvbnMuZmllbGQsIG9wdGlvbnMuYXR0cmlidXRlLCBvcHRpb25zLnZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY2FsbGJhY2sgPSBkZWZlcnJlZChjYWxsYmFjayk7XG4gICAgY2FsbGJhY2soZXJyKTtcbiAgfVxufTtcblxuLyoqXG4gKiBSZW1vdmVzIGEgc3VwcG9ydGVkIGF0dHJpYnV0ZSBmcm9tIGEge0BsaW5rIG1vZHVsZTpzZWFtbGVzc3BheS13ZWIvY2FyZC1lbGVtZW50fmZpZWxkIGZpZWxkfS5cbiAqXG4gKiBAcHVibGljXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyBUaGUgb3B0aW9ucyBmb3IgdGhlIGF0dHJpYnV0ZSB5b3Ugd2lzaCB0byByZW1vdmUuXG4gKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9ucy5maWVsZCBUaGUgZmllbGQgZnJvbSB3aGljaCB5b3Ugd2lzaCB0byByZW1vdmUgYW4gYXR0cmlidXRlLiBNdXN0IGJlIGEgdmFsaWQge0BsaW5rIG1vZHVsZTpzZWFtbGVzc3BheS13ZWIvY2FyZC1lbGVtZW50fmZpZWxkT3B0aW9ucyBmaWVsZE9wdGlvbn0uXG4gKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9ucy5hdHRyaWJ1dGUgVGhlIG5hbWUgb2YgdGhlIGF0dHJpYnV0ZSB5b3Ugd2lzaCB0byByZW1vdmUgZnJvbSB0aGUgZmllbGQuXG4gKiBAcGFyYW0ge2NhbGxiYWNrfSBbY2FsbGJhY2tdIENhbGxiYWNrIGV4ZWN1dGVkIG9uIGNvbXBsZXRpb24sIGNvbnRhaW5pbmcgYW4gZXJyb3IgaWYgb25lIG9jY3VycmVkLiBObyBkYXRhIGlzIHJldHVybmVkIGlmIHRoZSBhdHRyaWJ1dGUgaXMgcmVtb3ZlZCBzdWNjZXNzZnVsbHkuXG4gKlxuICogQGV4YW1wbGUgPGNhcHRpb24+UmVtb3ZlIHRoZSBwbGFjZWhvbGRlciBhdHRyaWJ1dGUgb2YgYSBmaWVsZDwvY2FwdGlvbj5cbiAqIENhcmRFbGVtZW50SW5zdGFuY2UucmVtb3ZlQXR0cmlidXRlKHtcbiAqICAgZmllbGQ6ICdhY2NvdW50TnVtYmVyJyxcbiAqICAgYXR0cmlidXRlOiAncGxhY2Vob2xkZXInXG4gKiB9LCBmdW5jdGlvbiAoYXR0cmlidXRlRXJyKSB7XG4gKiAgIGlmIChhdHRyaWJ1dGVFcnIpIHtcbiAqICAgICBjb25zb2xlLmVycm9yKGF0dHJpYnV0ZUVycik7XG4gKiAgIH1cbiAqIH0pO1xuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5DYXJkRWxlbWVudC5wcm90b3R5cGUucmVtb3ZlQXR0cmlidXRlID0gZnVuY3Rpb24gKG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIHZhciBhdHRyaWJ1dGVFcnIsIGVycjtcblxuICBpZiAoY2FyZEVsZW1lbnRGaWVsZHMuaW5kZXhPZihvcHRpb25zLmZpZWxkKSA9PT0gLTEpIHtcbiAgICBlcnIgPSBuZXcgU2VhbWxlc3NwYXlFcnJvcih7XG4gICAgICB0eXBlOiBlcnJvcnMuQ0FSRF9FTEVNRU5UX0ZJRUxEX0lOVkFMSUQudHlwZSxcbiAgICAgIGNvZGU6IGVycm9ycy5DQVJEX0VMRU1FTlRfRklFTERfSU5WQUxJRC5jb2RlLFxuICAgICAgbWVzc2FnZTogJ1wiJyArIG9wdGlvbnMuZmllbGQgKyAnXCIgaXMgbm90IGEgdmFsaWQgZmllbGQuIFlvdSBtdXN0IHVzZSBhIHZhbGlkIGZpZWxkIG9wdGlvbiB3aGVuIHJlbW92aW5nIGFuIGF0dHJpYnV0ZS4nXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgYXR0cmlidXRlRXJyID0gYXR0cmlidXRlVmFsaWRhdGlvbkVycm9yKG9wdGlvbnMuYXR0cmlidXRlKTtcblxuICAgIGlmIChhdHRyaWJ1dGVFcnIpIHtcbiAgICAgIGVyciA9IGF0dHJpYnV0ZUVycjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fYnVzLmVtaXQoZXZlbnRzLlJFTU9WRV9BVFRSSUJVVEUsIG9wdGlvbnMuZmllbGQsIG9wdGlvbnMuYXR0cmlidXRlKTtcbiAgICB9XG4gIH1cblxuICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY2FsbGJhY2sgPSBkZWZlcnJlZChjYWxsYmFjayk7XG4gICAgY2FsbGJhY2soZXJyKTtcbiAgfVxufTtcblxuLyoqXG4gKiBDbGVhciB0aGUgdmFsdWUgb2YgYSB7QGxpbmsgbW9kdWxlOnNlYW1sZXNzcGF5LXdlYi9jYXJkLWVsZW1lbnR+ZmllbGQgZmllbGR9LlxuICogQHB1YmxpY1xuICogQHBhcmFtIHtzdHJpbmd9IGZpZWxkIFRoZSBmaWVsZCB3aG9zZSBwbGFjZWhvbGRlciB5b3Ugd2lzaCB0byBjbGVhci4gTXVzdCBiZSBhIHZhbGlkIHtAbGluayBtb2R1bGU6c2VhbWxlc3NwYXktd2ViL2NhcmQtZWxlbWVudH5maWVsZE9wdGlvbnMgZmllbGRPcHRpb259LlxuICogQHBhcmFtIHtjYWxsYmFja30gW2NhbGxiYWNrXSBDYWxsYmFjayBleGVjdXRlZCBvbiBjb21wbGV0aW9uLCBjb250YWluaW5nIGFuIGVycm9yIGlmIG9uZSBvY2N1cnJlZC4gTm8gZGF0YSBpcyByZXR1cm5lZCBpZiB0aGUgZmllbGQgY2xlYXJlZCBzdWNjZXNzZnVsbHkuXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqIEBleGFtcGxlXG4gKiBDYXJkRWxlbWVudEluc3RhbmNlLmNsZWFyKCdudW1iZXInLCBmdW5jdGlvbiAoY2xlYXJFcnIpIHtcbiAqICAgaWYgKGNsZWFyRXJyKSB7XG4gKiAgICAgY29uc29sZS5lcnJvcihjbGVhckVycik7XG4gKiAgIH1cbiAqIH0pO1xuICpcbiAqIEBleGFtcGxlIDxjYXB0aW9uPkNsZWFyIHNldmVyYWwgZmllbGRzPC9jYXB0aW9uPlxuICogQ2FyZEVsZW1lbnRJbnN0YW5jZS5jbGVhckZpZWxkKCdhY2NvdW50TnVtYmVyJyk7XG4gKiBDYXJkRWxlbWVudEluc3RhbmNlLmNsZWFyRmllbGQoJ2N2dicpO1xuICogQ2FyZEVsZW1lbnRJbnN0YW5jZS5jbGVhckZpZWxkKCdleHBEYXRlJyk7XG4gKi9cbkNhcmRFbGVtZW50LnByb3RvdHlwZS5jbGVhckZpZWxkID0gZnVuY3Rpb24gKGZpZWxkLCBjYWxsYmFjaykge1xuICB2YXIgZXJyO1xuXG4gIGlmIChjYXJkRWxlbWVudEZpZWxkcy5pbmRleE9mKGZpZWxkKSA9PT0gLTEpIHtcbiAgICBlcnIgPSBuZXcgU2VhbWxlc3NwYXlFcnJvcih7XG4gICAgICB0eXBlOiBlcnJvcnMuQ0FSRF9FTEVNRU5UX0ZJRUxEX0lOVkFMSUQudHlwZSxcbiAgICAgIGNvZGU6IGVycm9ycy5DQVJEX0VMRU1FTlRfRklFTERfSU5WQUxJRC5jb2RlLFxuICAgICAgbWVzc2FnZTogJ1wiJyArIGZpZWxkICsgJ1wiIGlzIG5vdCBhIHZhbGlkIGZpZWxkLiBZb3UgbXVzdCB1c2UgYSB2YWxpZCBmaWVsZCBvcHRpb24gd2hlbiBjbGVhcmluZyBhIGZpZWxkLidcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLl9idXMuZW1pdChldmVudHMuQ0xFQVJfRklFTEQsIGZpZWxkKTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjYWxsYmFjayA9IGRlZmVycmVkKGNhbGxiYWNrKTtcbiAgICBjYWxsYmFjayhlcnIpO1xuICB9XG59O1xuXG4vKipcbiAqIENsZWFyIHRoZSB2YWx1ZXMgb2YgYSB7QGxpbmsgbW9kdWxlOnNlYW1sZXNzcGF5LXdlYi9jYXJkLWVsZW1lbnQgZm9ybX0uXG4gKiBAcHVibGljXG4gKiBAcGFyYW0ge3N0cmluZ30gZmllbGQgVGhlIGZpZWxkIHdob3NlIHBsYWNlaG9sZGVyIHlvdSB3aXNoIHRvIGNsZWFyLiBNdXN0IGJlIGEgdmFsaWQge0BsaW5rIG1vZHVsZTpzZWFtbGVzc3BheS13ZWIvY2FyZC1lbGVtZW50fmZpZWxkT3B0aW9ucyBmaWVsZE9wdGlvbn0uXG4gKiBAcGFyYW0ge2NhbGxiYWNrfSBbY2FsbGJhY2tdIENhbGxiYWNrIGV4ZWN1dGVkIG9uIGNvbXBsZXRpb24sIGNvbnRhaW5pbmcgYW4gZXJyb3IgaWYgb25lIG9jY3VycmVkLiBObyBkYXRhIGlzIHJldHVybmVkIGlmIHRoZSBmaWVsZCBjbGVhcmVkIHN1Y2Nlc3NmdWxseS5cbiAqIEByZXR1cm5zIHt2b2lkfVxuICogQGV4YW1wbGVcbiAqIENhcmRFbGVtZW50SW5zdGFuY2UuY2xlYXJGb3JtKCk7XG4gKlxuICogQGV4YW1wbGUgPGNhcHRpb24+Q2xlYXIgc2V2ZXJhbCBmaWVsZHM8L2NhcHRpb24+XG4gKiBDYXJkRWxlbWVudEluc3RhbmNlLmNsZWFyRmllbGQoJ2FjY291bnROdW1iZXInKTtcbiAqIENhcmRFbGVtZW50SW5zdGFuY2UuY2xlYXJGaWVsZCgnY3Z2Jyk7XG4gKiBDYXJkRWxlbWVudEluc3RhbmNlLmNsZWFyRmllbGQoJ2V4cERhdGUnKTtcbiAqL1xuQ2FyZEVsZW1lbnQucHJvdG90eXBlLmNsZWFyRm9ybSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGJ1cyA9IHRoaXMuX2J1cztcblxuICBjYXJkRWxlbWVudEZpZWxkcy5mb3JFYWNoKGZ1bmN0aW9uIChmaWVsZCkge1xuICAgIGJ1cy5lbWl0KGV2ZW50cy5DTEVBUl9GSUVMRCwgZmllbGQpO1xuICB9KTtcbn07XG5cbi8qKlxuICogUmV0dXJucyBhbiB7QGxpbmsgQ2FyZEVsZW1lbnR+c3RhdGVPYmplY3R8b2JqZWN0fSB0aGF0IGluY2x1ZGVzIHRoZSBzdGF0ZSBvZiBhbGwgZmllbGRzIGFuZCBwb3NzaWJsZSBjYXJkIHR5cGVzLlxuICogQHB1YmxpY1xuICogQHJldHVybnMge29iamVjdH0ge0BsaW5rIENhcmRFbGVtZW50fnN0YXRlT2JqZWN0fHN0YXRlT2JqZWN0fVxuICogQGV4YW1wbGUgPGNhcHRpb24+Q2hlY2sgaWYgYWxsIGZpZWxkcyBhcmUgdmFsaWQ8L2NhcHRpb24+XG4gKiB2YXIgc3RhdGUgPSBDYXJkRWxlbWVudC5nZXRTdGF0ZSgpO1xuICpcbiAqIHZhciBmb3JtVmFsaWQgPSBPYmplY3Qua2V5cyhzdGF0ZS5maWVsZHMpLmV2ZXJ5KGZ1bmN0aW9uIChrZXkpIHtcbiAqICAgcmV0dXJuIHN0YXRlLmZpZWxkc1trZXldLmlzVmFsaWQ7XG4gKiB9KTtcbiAqL1xuQ2FyZEVsZW1lbnQucHJvdG90eXBlLmdldFN0YXRlID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5fc3RhdGU7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENhcmRFbGVtZW50O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLyoqIEBtb2R1bGUgc2VhbWxlc3NwYXktd2ViL2NhcmQtZWxlbWVudCAqL1xuXG52YXIgQ2FyZEVsZW1lbnQgPSByZXF1aXJlKCcuL2V4dGVybmFsL2NhcmQtZWxlbWVudCcpO1xudmFyIHdyYXBQcm9taXNlID0gcmVxdWlyZSgnQGJyYWludHJlZS93cmFwLXByb21pc2UnKTtcbnZhciBQcm9taXNlID0gcmVxdWlyZSgnLi4vbGliL3Byb21pc2UnKTtcblxudmFyIFZFUlNJT04gPSBcIndlYi1zZGtcIjtcblxuLyoqXG4gKiBGaWVsZHMgdXNlZCBpbiB7QGxpbmsgbW9kdWxlOnNlYW1sZXNzcGF5LXdlYi9jYXJkLWVsZW1lbnR+ZmllbGRPcHRpb25zIGZpZWxkcyBvcHRpb25zfVxuICogQHR5cGVkZWYge29iamVjdH0gZmllbGRcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBzZWxlY3RvciBBIENTUyBzZWxlY3RvciB0byBmaW5kIHRoZSBjb250YWluZXIgd2hlcmUgdGhlIGNhcmQgZWxlbWVudCB3aWxsIGJlIGluc2VydGVkLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtwbGFjZWhvbGRlcl0gV2lsbCBiZSB1c2VkIGFzIHRoZSBgcGxhY2Vob2xkZXJgIGF0dHJpYnV0ZSBvZiB0aGUgaW5wdXQuIElmIGBwbGFjZWhvbGRlcmAgaXMgbm90IG5hdGl2ZWx5IHN1cHBvcnRlZCBieSB0aGUgYnJvd3NlciwgaXQgd2lsbCBiZSBwb2x5ZmlsbGVkLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IFt0eXBlXSBXaWxsIGJlIHVzZWQgYXMgdGhlIGB0eXBlYCBhdHRyaWJ1dGUgb2YgdGhlIGlucHV0LiBUbyBtYXNrIGBjdnZgIGlucHV0LCBmb3IgaW5zdGFuY2UsIGB0eXBlOiBcInBhc3N3b3JkXCJgIGNhbiBiZSB1c2VkLlxuICogQHByb3BlcnR5IHtib29sZWFufSBbZm9ybWF0SW5wdXQ9dHJ1ZV0gRW5hYmxlIG9yIGRpc2FibGUgYXV0b21hdGljIGZvcm1hdHRpbmcgb24gdGhpcyBmaWVsZC5cbiAqIEBwcm9wZXJ0eSB7b2JqZWN0fGJvb2xlYW59IFtzZWxlY3RdIElmIHRydXRoeSwgdGhpcyBmaWVsZCBiZWNvbWVzIGEgYDxzZWxlY3Q+YCBkcm9wZG93biBsaXN0LiBUaGlzIGNhbiBvbmx5IGJlIHVzZWQgZm9yIGBleHBpcmF0aW9uTW9udGhgIGFuZCBgZXhwaXJhdGlvblllYXJgIGZpZWxkcy5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nW119IFtzZWxlY3Qub3B0aW9uc10gQW4gYXJyYXkgb2YgMTIgc3RyaW5ncywgb25lIHBlciBtb250aC4gVGhpcyBjYW4gb25seSBiZSB1c2VkIGZvciB0aGUgYGV4cGlyYXRpb25Nb250aGAgZmllbGQuIEZvciBleGFtcGxlLCB0aGUgYXJyYXkgY2FuIGxvb2sgbGlrZSBgWycwMSAtIEphbnVhcnknLCAnMDIgLSBGZWJydWFyeScsIC4uLl1gLlxuICovXG5cbi8qKlxuICogQW4gb2JqZWN0IHRoYXQgaGFzIHtAbGluayBtb2R1bGU6c2VhbWxlc3NwYXktd2ViL2NhcmQtZWxlbWVudH5maWVsZCBmaWVsZCBvYmplY3RzfSBmb3IgZWFjaCBmaWVsZC4gVXNlZCBpbiB7QGxpbmsgbW9kdWxlOnNlYW1sZXNzcGF5LXdlYi9jYXJkLWVsZW1lbnR+Y3JlYXRlIGNyZWF0ZX0uXG4gKiBAdHlwZWRlZiB7b2JqZWN0fSBmaWVsZE9wdGlvbnNcbiAqIEBwcm9wZXJ0eSB7ZmllbGR9IFtudW1iZXJdIEEgZmllbGQgZm9yIGNhcmQgbnVtYmVyLlxuICogQHByb3BlcnR5IHtmaWVsZH0gW2V4cGlyYXRpb25EYXRlXSBBIGZpZWxkIGZvciBleHBpcmF0aW9uIGRhdGUgaW4gYE1NL1lZWVlgIGZvcm1hdC4gVGhpcyBzaG91bGQgbm90IGJlIHVzZWQgd2l0aCB0aGUgYGV4cGlyYXRpb25Nb250aGAgYW5kIGBleHBpcmF0aW9uWWVhcmAgcHJvcGVydGllcy5cbiAqIEBwcm9wZXJ0eSB7ZmllbGR9IFtleHBpcmF0aW9uTW9udGhdIEEgZmllbGQgZm9yIGV4cGlyYXRpb24gbW9udGggaW4gYE1NYCBmb3JtYXQuIFRoaXMgc2hvdWxkIGJlIHVzZWQgd2l0aCB0aGUgYGV4cGlyYXRpb25ZZWFyYCBwcm9wZXJ0eS5cbiAqIEBwcm9wZXJ0eSB7ZmllbGR9IFtleHBpcmF0aW9uWWVhcl0gQSBmaWVsZCBmb3IgZXhwaXJhdGlvbiB5ZWFyIGluIGBZWVlZYCBmb3JtYXQuIFRoaXMgc2hvdWxkIGJlIHVzZWQgd2l0aCB0aGUgYGV4cGlyYXRpb25Nb250aGAgcHJvcGVydHkuXG4gKiBAcHJvcGVydHkge2ZpZWxkfSBbY3Z2XSBBIGZpZWxkIGZvciAzIG9yIDQgZGlnaXQgQ1ZWIG9yIENJRC5cbiAqIEBwcm9wZXJ0eSB7ZmllbGR9IFtwb3N0YWxDb2RlXSBBIGZpZWxkIGZvciBwb3N0YWwgb3IgcmVnaW9uIGNvZGUuXG4gKi9cblxuLyoqXG4gKiBBbiBvYmplY3QgdGhhdCByZXByZXNlbnRzIENTUyB0aGF0IHdpbGwgYmUgYXBwbGllZCBpbiBjYXJkIGVsZW1lbnQuIFRoaXMgb2JqZWN0IGxvb2tzIHNpbWlsYXIgdG8gQ1NTLiBUeXBpY2FsbHksIHRoZXNlIHN0eWxlcyBpbnZvbHZlIGZvbnRzIChzdWNoIGFzIGBmb250LWZhbWlseWAgb3IgYGNvbG9yYCkuXG4gKlxuICogVGhlc2UgYXJlIHRoZSBDU1MgcHJvcGVydGllcyB0aGF0IENhcmQgRWxlbWVudCBzdXBwb3J0cy4gQW55IG90aGVyIENTUyBzaG91bGQgYmUgc3BlY2lmaWVkIG9uIHlvdXIgcGFnZSBhbmQgb3V0c2lkZSBvZiBhbnkgU2VhbWxlc3NwYXkgY29uZmlndXJhdGlvbi4gVHJ5aW5nIHRvIHNldCB1bnN1cHBvcnRlZCBwcm9wZXJ0aWVzIHdpbGwgZmFpbCBhbmQgcHV0IGEgd2FybmluZyBpbiB0aGUgY29uc29sZS5cbiAqXG4gKiBTdXBwb3J0ZWQgQ1NTIHByb3BlcnRpZXMgYXJlOlxuICogYGNvbG9yYFxuICogYGRpcmVjdGlvbmBcbiAqIGBmb250LWZhbWlseWBcbiAqIGBmb250LXNpemUtYWRqdXN0YFxuICogYGZvbnQtc2l6ZWBcbiAqIGBmb250LXN0cmV0Y2hgXG4gKiBgZm9udC1zdHlsZWBcbiAqIGBmb250LXZhcmlhbnQtYWx0ZXJuYXRlc2BcbiAqIGBmb250LXZhcmlhbnQtY2Fwc2BcbiAqIGBmb250LXZhcmlhbnQtZWFzdC1hc2lhbmBcbiAqIGBmb250LXZhcmlhbnQtbGlnYXR1cmVzYFxuICogYGZvbnQtdmFyaWFudC1udW1lcmljYFxuICogYGZvbnQtdmFyaWFudGBcbiAqIGBmb250LXdlaWdodGBcbiAqIGBmb250YFxuICogYGxldHRlci1zcGFjaW5nYFxuICogYGxpbmUtaGVpZ2h0YFxuICogYG9wYWNpdHlgXG4gKiBgb3V0bGluZWBcbiAqIGB0ZXh0LXNoYWRvd2BcbiAqIGB0cmFuc2l0aW9uYFxuICogYC1tb3otb3N4LWZvbnQtc21vb3RoaW5nYFxuICogYC1tb3otdGFwLWhpZ2hsaWdodC1jb2xvcmBcbiAqIGAtbW96LXRyYW5zaXRpb25gXG4gKiBgLXdlYmtpdC1mb250LXNtb290aGluZ2BcbiAqIGAtd2Via2l0LXRhcC1oaWdobGlnaHQtY29sb3JgXG4gKiBgLXdlYmtpdC10cmFuc2l0aW9uYFxuICogQHR5cGVkZWYge29iamVjdH0gc3R5bGVPcHRpb25zXG4gKi9cblxuLyoqXG4gKiBAc3RhdGljXG4gKiBAZnVuY3Rpb24gY3JlYXRlXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyBDcmVhdGlvbiBvcHRpb25zOlxuICogQHBhcmFtIHtDbGllbnR9IG9wdGlvbnMuY2xpZW50IEEge0BsaW5rIENsaWVudH0gaW5zdGFuY2UuXG4gKiBAcGFyYW0ge2ZpZWxkT3B0aW9uc30gb3B0aW9ucy5maWVsZHMgQSB7QGxpbmsgbW9kdWxlOnNlYW1sZXNzcGF5LXdlYi9jYXJkLWVsZW1lbnR+ZmllbGRPcHRpb25zIHNldCBvZiBvcHRpb25zIGZvciBlYWNoIGZpZWxkfS5cbiAqIEBwYXJhbSB7c3R5bGVPcHRpb25zfSBvcHRpb25zLnN0eWxlcyB7QGxpbmsgbW9kdWxlOnNlYW1sZXNzcGF5LXdlYi9jYXJkLWVsZW1lbnR+c3R5bGVPcHRpb25zIFN0eWxlc30gYXBwbGllZCB0byBlYWNoIGZpZWxkLlxuICogQHBhcmFtIHtjYWxsYmFja30gW2NhbGxiYWNrXSBUaGUgc2Vjb25kIGFyZ3VtZW50LCBgZGF0YWAsIGlzIHRoZSB7QGxpbmsgQ2FyZEVsZW1lbnR9IGluc3RhbmNlLiBJZiBubyBjYWxsYmFjayBpcyBwcm92aWRlZCwgYGNyZWF0ZWAgcmV0dXJucyBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB3aXRoIHRoZSB7QGxpbmsgQ2FyZEVsZW1lbnR9IGluc3RhbmNlLlxuICogQHJldHVybnMge3ZvaWR9XG4gKiBAZXhhbXBsZVxuICogc2VhbWxlc3NwYXkuY2FyZEVsZW1lbnQuY3JlYXRlKHtcbiAqICAgY2xpZW50OiBjbGllbnRJbnN0YW5jZSxcbiAqICAgc3R5bGVzOiB7XG4gKiAgICAgJ2lucHV0Jzoge1xuICogICAgICAgJ2ZvbnQtc2l6ZSc6ICcxNnB0JyxcbiAqICAgICAgICdjb2xvcic6ICcjM0EzQTNBJ1xuICogICAgIH0sXG4gKiAgICAgJy5udW1iZXInOiB7XG4gKiAgICAgICAnZm9udC1mYW1pbHknOiAnbW9ub3NwYWNlJ1xuICogICAgIH0sXG4gKiAgICAgJy52YWxpZCc6IHtcbiAqICAgICAgICdjb2xvcic6ICdncmVlbidcbiAqICAgICB9XG4gKiAgIH0sXG4gKiAgIHNlbGVjdG9yOiAnI2NhcmQtZWxlbWVudCdcbiAqIH0sIGNhbGxiYWNrKTtcbiAqIEBleGFtcGxlIDxjYXB0aW9uPlJpZ2h0IHRvIExlZnQgTGFuZ3VhZ2UgU3VwcG9ydDwvY2FwdGlvbj5cbiAqIHNlYW1sZXNzcGF5LmNhcmRFbGVtZW50LmNyZWF0ZSh7XG4gKiAgIGNsaWVudDogY2xpZW50SW5zdGFuY2UsXG4gKiAgIHN0eWxlczoge1xuICogICAgICdpbnB1dCc6IHtcbiAqICAgICAgIC8vIG90aGVyIHN0eWxlc1xuICogICAgICAgZGlyZWN0aW9uOiAncnRsJ1xuICogICAgIH0sXG4gKiAgIH0sXG4gKiAgIHNlbGVjdG9yOiAnI2NhcmQtZWxlbWVudCdcbiAqIH0sIGNhbGxiYWNrKTtcbiAqL1xuZnVuY3Rpb24gY3JlYXRlKG9wdGlvbnMpIHtcbiAgdmFyIGludGVncmF0aW9uO1xuICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICB0cnkge1xuICAgICAgaW50ZWdyYXRpb24gPSBuZXcgQ2FyZEVsZW1lbnQob3B0aW9ucyk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiByZWplY3QoZXJyb3IpO1xuICAgIH1cblxuICAgIHJldHVybiBpbnRlZ3JhdGlvbi5vbigncmVhZHknLCBmdW5jdGlvbiAoKSB7XG4gICAgICByZXNvbHZlKGludGVncmF0aW9uKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgcmV0dXJuIHByb21pc2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBjcmVhdGU6IHdyYXBQcm9taXNlKGNyZWF0ZSksXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gVGhlIGN1cnJlbnQgdmVyc2lvbiBvZiB0aGUgU0RLLCBpLmUuIGB7QHBrZyB2ZXJzaW9ufWAuXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqL1xuICBWRVJTSU9OOiBWRVJTSU9OXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLyogZXNsaW50LWRpc2FibGUgbm8tcmVzZXJ2ZWQta2V5cyAqL1xuXG52YXIgZW51bWVyYXRlID0gcmVxdWlyZSgnLi4vLi4vbGliL2VudW1lcmF0ZScpO1xudmFyIFZFUlNJT04gPSBcIndlYi1zZGtcIjtcblxudmFyIHJlcXVlc3RUeXBlcyA9IHtcbiAgUkVRVUVTVF9UWVBFX1RPS0VOSVpBVElPTjogJ3Rva2VuaXphdGlvbidcbn07XG5cbnZhciB3aGl0ZWxpc3RlZEZpZWxkcyA9IFtcbiAge1xuICAgIGZpZWxkOiAnYWNjb3VudE51bWJlcicsXG4gICAgbmFtZTogJ2FjY291bnQtbnVtYmVyJyxcbiAgICBsYWJlbDogJ0NhcmQgTnVtYmVyJyxcbiAgICBkZWZhdWx0TWF4TGVuZ3RoOiAyMixcbiAgICB3cmFwcGVyOiB7XG4gICAgICBkYXRhTWF4OiAnNDI0MiA0MjQyIDQyNDIgNDI0MiA0MjQwJyxcbiAgICAgIHN0eWxlOiB7XG4gICAgICAgIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoMHB4KSdcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIHtcbiAgICBmaWVsZDogJ2V4cERhdGUnLFxuICAgIG5hbWU6ICdleHAtZGF0ZScsXG4gICAgbGFiZWw6ICdFeHBpcmF0aW9uIERhdGUnLFxuICAgIGRlZmF1bHRNYXhMZW5ndGg6IDcsXG4gICAgd3JhcHBlcjoge1xuICAgICAgZGF0YU1heDogJ01NIC8gWVkwJyxcbiAgICAgIHN0eWxlOiB7XG4gICAgICAgIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoMHB4KSdcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIHtcbiAgICBmaWVsZDogJ2N2dicsXG4gICAgbmFtZTogJ2N2dicsXG4gICAgbGFiZWw6ICdDVlYnLFxuICAgIGRlZmF1bHRNYXhMZW5ndGg6IDQsXG4gICAgd3JhcHBlcjoge1xuICAgICAgZGF0YU1heDogJzAwMDAwJyxcbiAgICAgIHN0eWxlOiB7XG4gICAgICAgIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoMHB4KSdcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIHtcbiAgICBmaWVsZDogJ3Bvc3RhbENvZGUnLFxuICAgIG5hbWU6ICdwb3N0YWwtY29kZScsXG4gICAgbGFiZWw6ICdQb3N0YWwgQ29kZScsXG4gICAgZGVmYXVsdE1heExlbmd0aDogNSxcbiAgICB3cmFwcGVyOiB7XG4gICAgICBkYXRhTWF4OiAnOTAyMTAwJyxcbiAgICAgIHN0eWxlOiB7XG4gICAgICAgIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoMHB4KSdcbiAgICAgIH1cbiAgICB9XG4gIH1cbl07XG5cbnZhciBjYXJkQnJhbmRNYXAgPSB7XG4gIHZpc2E6ICd2aXNhJyxcbiAgbWFzdGVyY2FyZDogJ21hc3RlcmNhcmQnLFxuICAnYW1lcmljYW4tZXhwcmVzcyc6ICdhbWV4JyxcbiAgJ2RpbmVycy1jbHViJzogJ2RpbmVycycsXG4gIGRpc2NvdmVyOiAnZGlzY292ZXInLFxuICBqY2I6ICdqY2InLFxuICB1bmlvbnBheTogJ3VuaW9ucGF5JyxcbiAgbWFlc3RybzogJ21hc3RlcmNhcmQnLFxuICBlbG86ICdkaXNjb3ZlcicsXG4gIG1pcjogJ3Vua25vd24nLFxuICBoaXBlcjogJ2Rpc2NvdmVyJyxcbiAgaGlwZXJjYXJkOiAnZGlzY292ZXInXG59O1xuXG52YXIgdG9rZW5pemVyTm9uU2VjdXJlRmllbGRzID0gW1xuICAnYmlsbGluZ0FkZHJlc3MnLFxuICAnY29tcGFueScsXG4gICdlbWFpbCcsXG4gICduYW1lJyxcbiAgJ3Bob25lTnVtYmVyJyxcbiAgJ2N1c3RvbWVyJyxcbiAgJ2FjY291bnRWYWxpZGF0aW9uJyxcbiAgJ2JhbmtBY2NvdW50VHlwZScsXG4gICdyb3V0aW5nTnVtYmVyJ1xuXTtcblxudmFyIGNvbnN0YW50cyA9IHtcbiAgVkVSU0lPTjogVkVSU0lPTixcbiAgUEFZTUVOVF9UWVBFX0NSRURJVF9DQVJEOiAnY3JlZGl0X2NhcmQnLFxuICBtYXhFeHBpcmF0aW9uWWVhckFnZTogMzEsXG4gIGV4dGVybmFsRXZlbnRzOiB7XG4gICAgQ0hBTkdFOiAnY2hhbmdlJyxcbiAgICBGT0NVUzogJ2ZvY3VzJyxcbiAgICBCTFVSOiAnYmx1cicsXG4gICAgRU1QVFk6ICdlbXB0eScsXG4gICAgTk9UX0VNUFRZOiAnbm90RW1wdHknLFxuICAgIFZBTElESVRZX0NIQU5HRTogJ3ZhbGlkaXR5Q2hhbmdlJyxcbiAgICBDQVJEX1RZUEVfQ0hBTkdFOiAnY2FyZFR5cGVDaGFuZ2UnXG4gIH0sXG4gIGV4dGVybmFsQ2xhc3Nlczoge1xuICAgIEZPQ1VTRUQ6ICdzZWFtbGVzc3BheS1jYXJkLWVsZW1lbnQtZm9jdXNlZCcsXG4gICAgSU5WQUxJRDogJ3NlYW1sZXNzcGF5LWNhcmQtZWxlbWVudC1pbnZhbGlkJyxcbiAgICBWQUxJRDogJ3NlYW1sZXNzcGF5LWNhcmQtZWxlbWVudC12YWxpZCdcbiAgfSxcbiAgZGVmYXVsdElGcmFtZVN0eWxlOiB7XG4gICAgJ2JvcmRlcic6IFsnbm9uZScsICdpbXBvcnRhbnQnXSxcbiAgICAnbWFyZ2luJzogWycwcHgnLCAnaW1wb3J0YW50J10sXG4gICAgJ3BhZGRpbmcnOiBbJzBweCcsICdpbXBvcnRhbnQnXSxcbiAgICAnd2lkdGgnOiBbJzFweCcsICdpbXBvcnRhbnQnXSxcbiAgICAnbWluLXdpZHRoJzogWycxMDAlJywgJ2ltcG9ydGFudCddLFxuICAgICdvdmVyZmxvdyc6IFsnaGlkZGVuJywgJ2ltcG9ydGFudCddLFxuICAgICdkaXNwbGF5JzogWydibG9jaycsICdpbXBvcnRhbnQnXSxcbiAgICAndXNlci1zZWxlY3QnOiBbJ25vbmUnLCAnaW1wb3J0YW50J10sXG4gICAgJ2hlaWdodCc6IFsnMTkuMnB4J11cbiAgfSxcbiAgd2hpdGVsaXN0ZWRTdHlsZXM6IFtcbiAgICAnLW1vei1hcHBlYXJhbmNlJyxcbiAgICAnLW1vei1vc3gtZm9udC1zbW9vdGhpbmcnLFxuICAgICctbW96LXRhcC1oaWdobGlnaHQtY29sb3InLFxuICAgICctbW96LXRyYW5zaXRpb24nLFxuICAgICctd2Via2l0LWFwcGVhcmFuY2UnLFxuICAgICctd2Via2l0LWZvbnQtc21vb3RoaW5nJyxcbiAgICAnLXdlYmtpdC10YXAtaGlnaGxpZ2h0LWNvbG9yJyxcbiAgICAnLXdlYmtpdC10cmFuc2l0aW9uJyxcbiAgICAnYXBwZWFyYW5jZScsXG4gICAgJ2NvbG9yJyxcbiAgICAnZGlyZWN0aW9uJyxcbiAgICAnZm9udCcsXG4gICAgJ2ZvbnQtZmFtaWx5JyxcbiAgICAnZm9udC1zaXplJyxcbiAgICAnZm9udC1zaXplLWFkanVzdCcsXG4gICAgJ2ZvbnQtc3RyZXRjaCcsXG4gICAgJ2ZvbnQtc3R5bGUnLFxuICAgICdmb250LXZhcmlhbnQnLFxuICAgICdmb250LXZhcmlhbnQtYWx0ZXJuYXRlcycsXG4gICAgJ2ZvbnQtdmFyaWFudC1jYXBzJyxcbiAgICAnZm9udC12YXJpYW50LWVhc3QtYXNpYW4nLFxuICAgICdmb250LXZhcmlhbnQtbGlnYXR1cmVzJyxcbiAgICAnZm9udC12YXJpYW50LW51bWVyaWMnLFxuICAgICdmb250LXdlaWdodCcsXG4gICAgJ2xldHRlci1zcGFjaW5nJyxcbiAgICAnbGluZS1oZWlnaHQnLFxuICAgICdtYXJnaW4nLFxuICAgICdtYXJnaW4tdG9wJyxcbiAgICAnbWFyZ2luLXJpZ2h0JyxcbiAgICAnbWFyZ2luLWJvdHRvbScsXG4gICAgJ21hcmdpbi1sZWZ0JyxcbiAgICAnb3BhY2l0eScsXG4gICAgJ291dGxpbmUnLFxuICAgICdwYWRkaW5nJyxcbiAgICAncGFkZGluZy10b3AnLFxuICAgICdwYWRkaW5nLXJpZ2h0JyxcbiAgICAncGFkZGluZy1ib3R0b20nLFxuICAgICdwYWRkaW5nLWxlZnQnLFxuICAgICd0ZXh0LWFsaWduJyxcbiAgICAndGV4dC1zaGFkb3cnLFxuICAgICd0cmFuc2l0aW9uJ1xuICBdLFxuICB3aGl0ZWxpc3RlZEZpZWxkczogd2hpdGVsaXN0ZWRGaWVsZHMsXG4gIGNhcmRCcmFuZE1hcDogY2FyZEJyYW5kTWFwLFxuICB0b2tlbml6ZXJOb25TZWN1cmVGaWVsZHM6IHRva2VuaXplck5vblNlY3VyZUZpZWxkcyxcbiAgd2hpdGVsaXN0ZWRBdHRyaWJ1dGVzOiB7XG4gICAgJ2FyaWEtaW52YWxpZCc6ICdib29sZWFuJyxcbiAgICAnYXJpYS1yZXF1aXJlZCc6ICdib29sZWFuJyxcbiAgICBkaXNhYmxlZDogJ2Jvb2xlYW4nLFxuICAgIHBsYWNlaG9sZGVyOiAnc3RyaW5nJ1xuICB9LFxuICBhdXRvY29tcGxldGVNYXBwaW5nczoge1xuICAgICdhY2NvdW50LW51bWJlcic6ICdjYy1udW1iZXInLFxuICAgICdleHAtZGF0ZSc6ICdjYy1leHAnLFxuICAgIGN2djogJ2NjLWNzYycsXG4gICAgJ3Bvc3RhbC1jb2RlJzogJ2JpbGxpbmcgcG9zdGFsLWNvZGUnXG4gIH0sXG4gIHJlcXVlc3RUeXBlczogcmVxdWVzdFR5cGVzXG59O1xuXG5jb25zdGFudHMuZXZlbnRzID0gZW51bWVyYXRlKFtcbiAgJ0FVVE9GSUxMX0VYUElSQVRJT05fREFURScsXG4gICdGUkFNRV9SRUFEWScsXG4gICdWQUxJREFURV9TVFJJQ1QnLFxuICAnQ09ORklHVVJBVElPTicsXG4gICdUT0tFTklaQVRJT05fUkVRVUVTVCcsXG4gICdJTlBVVF9FVkVOVCcsXG4gICdUUklHR0VSX0lOUFVUX0ZPQ1VTJyxcbiAgJ0FERF9DTEFTUycsXG4gICdSRU1PVkVfQ0xBU1MnLFxuICAnU0VUX0FUVFJJQlVURScsXG4gICdSRU1PVkVfQVRUUklCVVRFJyxcbiAgJ0NMRUFSX0ZJRUxEJyxcbl0sICdjYXJkLWVsZW1lbnQ6Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gY29uc3RhbnRzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgU2VhbWxlc3NwYXlFcnJvciA9IHJlcXVpcmUoJy4uLy4uL2xpYi9zZWFtbGVzc3BheS1lcnJvcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgQ0FSRF9FTEVNRU5UX0lOVkFMSURfRklFTERfU0VMRUNUT1I6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLk1FUkNIQU5ULFxuICAgIGNvZGU6ICdDQVJEX0VMRU1FTlRfSU5WQUxJRF9GSUVMRF9TRUxFQ1RPUicsXG4gICAgbWVzc2FnZTogJ1NlbGVjdG9yIGRvZXMgbm90IHJlZmVyZW5jZSBhIHZhbGlkIERPTSBub2RlLidcbiAgfSxcbiAgQ0FSRF9FTEVNRU5UX0ZJRUxEX0lOVkFMSUQ6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLk1FUkNIQU5ULFxuICAgIGNvZGU6ICdDQVJEX0VMRU1FTlRfRklFTERfSU5WQUxJRCdcbiAgfSxcbiAgQ0FSRF9FTEVNRU5UX1RPS0VOSVpBVElPTl9ORVRXT1JLX0VSUk9SOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5ORVRXT1JLLFxuICAgIGNvZGU6ICdDQVJEX0VMRU1FTlRfVE9LRU5JWkFUSU9OX05FVFdPUktfRVJST1InLFxuICAgIG1lc3NhZ2U6ICdBIHRva2VuaXphdGlvbiBuZXR3b3JrIGVycm9yIG9jY3VycmVkLidcbiAgfSxcbiAgQ0FSRF9FTEVNRU5UX0ZBSUxFRF9UT0tFTklaQVRJT046IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLkNVU1RPTUVSLFxuICAgIGNvZGU6ICdDQVJEX0VMRU1FTlRfRkFJTEVEX1RPS0VOSVpBVElPTicsXG4gICAgbWVzc2FnZTogJ1RoZSBzdXBwbGllZCBjYXJkIGRhdGEgZmFpbGVkIHRva2VuaXphdGlvbi4nXG4gIH0sXG4gIENBUkRfRUxFTUVOVF9GSUVMRFNfRU1QVFk6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLkNVU1RPTUVSLFxuICAgIGNvZGU6ICdDQVJEX0VMRU1FTlRfRklFTERTX0VNUFRZJyxcbiAgICBtZXNzYWdlOiAnQWxsIGZpZWxkcyBhcmUgZW1wdHkuIENhbm5vdCB0b2tlbml6ZSBlbXB0eSBjYXJkIGZpZWxkcy4nXG4gIH0sXG4gIENBUkRfRUxFTUVOVF9GSUVMRFNfSU5WQUxJRDoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuQ1VTVE9NRVIsXG4gICAgY29kZTogJ0NBUkRfRUxFTUVOVF9GSUVMRFNfSU5WQUxJRCcsXG4gICAgbWVzc2FnZTogJ1NvbWUgcGF5bWVudCBpbnB1dCBmaWVsZHMgYXJlIGludmFsaWQuIENhbm5vdCB0b2tlbml6ZSBpbnZhbGlkIGNhcmQgZmllbGRzLidcbiAgfSxcbiAgQ0FSRF9FTEVNRU5UX0FUVFJJQlVURV9OT1RfU1VQUE9SVEVEOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnQ0FSRF9FTEVNRU5UX0FUVFJJQlVURV9OT1RfU1VQUE9SVEVEJ1xuICB9LFxuICBDQVJEX0VMRU1FTlRfQVRUUklCVVRFX1ZBTFVFX05PVF9BTExPV0VEOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnQ0FSRF9FTEVNRU5UX0FUVFJJQlVURV9WQUxVRV9OT1RfQUxMT1dFRCdcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGFzc2lnbk5vcm1hbGl6ZWQgPSB0eXBlb2YgT2JqZWN0LmFzc2lnbiA9PT0gJ2Z1bmN0aW9uJyA/IE9iamVjdC5hc3NpZ24gOiBhc3NpZ25Qb2x5ZmlsbDtcblxuZnVuY3Rpb24gYXNzaWduUG9seWZpbGwoZGVzdGluYXRpb24pIHtcbiAgdmFyIGksIHNvdXJjZSwga2V5O1xuXG4gIGZvciAoaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICBzb3VyY2UgPSBhcmd1bWVudHNbaV07XG4gICAgZm9yIChrZXkgaW4gc291cmNlKSB7XG4gICAgICBpZiAoc291cmNlLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgZGVzdGluYXRpb25ba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBkZXN0aW5hdGlvbjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFzc2lnbjogYXNzaWduTm9ybWFsaXplZCxcbiAgX2Fzc2lnbjogYXNzaWduUG9seWZpbGxcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBvbmNlID0gcmVxdWlyZSgnLi9vbmNlJyk7XG5cbmZ1bmN0aW9uIGNhbGwoZm4sIGNhbGxiYWNrKSB7XG4gIHZhciBpc1N5bmMgPSBmbi5sZW5ndGggPT09IDA7XG5cbiAgaWYgKGlzU3luYykge1xuICAgIGZuKCk7XG4gICAgY2FsbGJhY2sobnVsbCk7XG4gIH0gZWxzZSB7XG4gICAgZm4oY2FsbGJhY2spO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGZ1bmN0aW9ucywgY2IpIHtcbiAgdmFyIGk7XG4gIHZhciBsZW5ndGggPSBmdW5jdGlvbnMubGVuZ3RoO1xuICB2YXIgcmVtYWluaW5nID0gbGVuZ3RoO1xuICB2YXIgY2FsbGJhY2sgPSBvbmNlKGNiKTtcblxuICBpZiAobGVuZ3RoID09PSAwKSB7XG4gICAgY2FsbGJhY2sobnVsbCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZnVuY3Rpb24gZmluaXNoKGVycikge1xuICAgIGlmIChlcnIpIHtcbiAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcmVtYWluaW5nIC09IDE7XG4gICAgaWYgKHJlbWFpbmluZyA9PT0gMCkge1xuICAgICAgY2FsbGJhY2sobnVsbCk7XG4gICAgfVxuICB9XG5cbiAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgY2FsbChmdW5jdGlvbnNbaV0sIGZpbmlzaCk7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc1doaXRlbGlzdGVkRG9tYWluID0gcmVxdWlyZSgnLi4vaXMtd2hpdGVsaXN0ZWQtZG9tYWluJyk7XG5cbmZ1bmN0aW9uIGNoZWNrT3JpZ2luKHBvc3RNZXNzYWdlT3JpZ2luLCBtZXJjaGFudFVybCkge1xuICB2YXIgbWVyY2hhbnRPcmlnaW4sIG1lcmNoYW50SG9zdDtcbiAgdmFyIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG5cbiAgYS5ocmVmID0gbWVyY2hhbnRVcmw7XG5cbiAgaWYgKGEucHJvdG9jb2wgPT09ICdodHRwczonKSB7XG4gICAgbWVyY2hhbnRIb3N0ID0gYS5ob3N0LnJlcGxhY2UoLzo0NDMkLywgJycpO1xuICB9IGVsc2UgaWYgKGEucHJvdG9jb2wgPT09ICdodHRwOicpIHtcbiAgICBtZXJjaGFudEhvc3QgPSBhLmhvc3QucmVwbGFjZSgvOjgwJC8sICcnKTtcbiAgfSBlbHNlIHtcbiAgICBtZXJjaGFudEhvc3QgPSBhLmhvc3Q7XG4gIH1cblxuICBtZXJjaGFudE9yaWdpbiA9IGEucHJvdG9jb2wgKyAnLy8nICsgbWVyY2hhbnRIb3N0O1xuXG4gIGlmIChtZXJjaGFudE9yaWdpbiA9PT0gcG9zdE1lc3NhZ2VPcmlnaW4pIHsgcmV0dXJuIHRydWU7IH1cblxuICBhLmhyZWYgPSBwb3N0TWVzc2FnZU9yaWdpbjtcblxuICByZXR1cm4gaXNXaGl0ZWxpc3RlZERvbWFpbihwb3N0TWVzc2FnZU9yaWdpbik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBjaGVja09yaWdpbjogY2hlY2tPcmlnaW5cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBlbnVtZXJhdGUgPSByZXF1aXJlKCcuLi9lbnVtZXJhdGUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBlbnVtZXJhdGUoW1xuICAnQ09ORklHVVJBVElPTl9SRVFVRVNUJ1xuXSwgJ2J1czonKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJ1cyA9IHJlcXVpcmUoJ2ZyYW1lYnVzJyk7XG52YXIgZXZlbnRzID0gcmVxdWlyZSgnLi9ldmVudHMnKTtcbnZhciBjaGVja09yaWdpbiA9IHJlcXVpcmUoJy4vY2hlY2stb3JpZ2luJykuY2hlY2tPcmlnaW47XG52YXIgU2VhbWxlc3NwYXlFcnJvciA9IHJlcXVpcmUoJy4uL3NlYW1sZXNzcGF5LWVycm9yJyk7XG5cbmZ1bmN0aW9uIFNlYW1sZXNzcGF5QnVzKG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgdGhpcy5jaGFubmVsID0gb3B0aW9ucy5jaGFubmVsO1xuICBpZiAoIXRoaXMuY2hhbm5lbCkge1xuICAgIHRocm93IG5ldyBTZWFtbGVzc3BheUVycm9yKHtcbiAgICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuSU5URVJOQUwsXG4gICAgICBjb2RlOiAnTUlTU0lOR19DSEFOTkVMX0lEJyxcbiAgICAgIG1lc3NhZ2U6ICdDaGFubmVsIElEIG11c3QgYmUgc3BlY2lmaWVkLidcbiAgICB9KTtcbiAgfVxuXG4gIHRoaXMubWVyY2hhbnRVcmwgPSBvcHRpb25zLm1lcmNoYW50VXJsO1xuXG4gIHRoaXMuX2lzRGVzdHJveWVkID0gZmFsc2U7XG4gIHRoaXMuX2lzVmVyYm9zZSA9IGZhbHNlO1xuXG4gIHRoaXMuX2xpc3RlbmVycyA9IFtdO1xuXG4gIHRoaXMuX2xvZygnbmV3IGJ1cyBvbiBjaGFubmVsICcgKyB0aGlzLmNoYW5uZWwsIFtsb2NhdGlvbi5ocmVmXSk7XG59XG5cblNlYW1sZXNzcGF5QnVzLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uIChldmVudE5hbWUsIG9yaWdpbmFsSGFuZGxlcikge1xuICB2YXIgbmFtZXNwYWNlZEV2ZW50LCBhcmdzO1xuICB2YXIgaGFuZGxlciA9IG9yaWdpbmFsSGFuZGxlcjtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIGlmICh0aGlzLl9pc0Rlc3Ryb3llZCkgeyByZXR1cm47IH1cblxuICBpZiAodGhpcy5tZXJjaGFudFVybCkge1xuICAgIGhhbmRsZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby1pbnZhbGlkLXRoaXMgKi9cbiAgICAgIGlmIChjaGVja09yaWdpbih0aGlzLm9yaWdpbiwgc2VsZi5tZXJjaGFudFVybCkpIHtcbiAgICAgICAgb3JpZ2luYWxIYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9XG4gICAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLWludmFsaWQtdGhpcyAqL1xuICAgIH07XG4gIH1cblxuICBuYW1lc3BhY2VkRXZlbnQgPSB0aGlzLl9uYW1lc3BhY2VFdmVudChldmVudE5hbWUpO1xuICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgYXJnc1swXSA9IG5hbWVzcGFjZWRFdmVudDtcbiAgYXJnc1sxXSA9IGhhbmRsZXI7XG5cbiAgdGhpcy5fbG9nKCdvbicsIGFyZ3MpO1xuICBidXMub24uYXBwbHkoYnVzLCBhcmdzKTtcblxuICB0aGlzLl9saXN0ZW5lcnMucHVzaCh7XG4gICAgZXZlbnROYW1lOiBldmVudE5hbWUsXG4gICAgaGFuZGxlcjogaGFuZGxlcixcbiAgICBvcmlnaW5hbEhhbmRsZXI6IG9yaWdpbmFsSGFuZGxlclxuICB9KTtcbn07XG5cblNlYW1sZXNzcGF5QnVzLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24gKGV2ZW50TmFtZSkge1xuICB2YXIgYXJncztcblxuICBpZiAodGhpcy5faXNEZXN0cm95ZWQpIHsgcmV0dXJuOyB9XG5cbiAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gIGFyZ3NbMF0gPSB0aGlzLl9uYW1lc3BhY2VFdmVudChldmVudE5hbWUpO1xuXG4gIHRoaXMuX2xvZygnZW1pdCcsIGFyZ3MpO1xuICBidXMuZW1pdC5hcHBseShidXMsIGFyZ3MpO1xufTtcblxuU2VhbWxlc3NwYXlCdXMucHJvdG90eXBlLl9vZmZEaXJlY3QgPSBmdW5jdGlvbiAoZXZlbnROYW1lKSB7XG4gIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcblxuICBpZiAodGhpcy5faXNEZXN0cm95ZWQpIHsgcmV0dXJuOyB9XG5cbiAgYXJnc1swXSA9IHRoaXMuX25hbWVzcGFjZUV2ZW50KGV2ZW50TmFtZSk7XG5cbiAgdGhpcy5fbG9nKCdvZmYnLCBhcmdzKTtcbiAgYnVzLm9mZi5hcHBseShidXMsIGFyZ3MpO1xufTtcblxuU2VhbWxlc3NwYXlCdXMucHJvdG90eXBlLm9mZiA9IGZ1bmN0aW9uIChldmVudE5hbWUsIG9yaWdpbmFsSGFuZGxlcikge1xuICB2YXIgaSwgbGlzdGVuZXI7XG4gIHZhciBoYW5kbGVyID0gb3JpZ2luYWxIYW5kbGVyO1xuXG4gIGlmICh0aGlzLl9pc0Rlc3Ryb3llZCkgeyByZXR1cm47IH1cblxuICBpZiAodGhpcy5tZXJjaGFudFVybCkge1xuICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLl9saXN0ZW5lcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxpc3RlbmVyID0gdGhpcy5fbGlzdGVuZXJzW2ldO1xuXG4gICAgICBpZiAobGlzdGVuZXIub3JpZ2luYWxIYW5kbGVyID09PSBvcmlnaW5hbEhhbmRsZXIpIHtcbiAgICAgICAgaGFuZGxlciA9IGxpc3RlbmVyLmhhbmRsZXI7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdGhpcy5fb2ZmRGlyZWN0KGV2ZW50TmFtZSwgaGFuZGxlcik7XG59O1xuXG5TZWFtbGVzc3BheUJ1cy5wcm90b3R5cGUuX25hbWVzcGFjZUV2ZW50ID0gZnVuY3Rpb24gKGV2ZW50TmFtZSkge1xuICByZXR1cm4gWydzZWFtbGVzc3BheScsIHRoaXMuY2hhbm5lbCwgZXZlbnROYW1lXS5qb2luKCc6Jyk7XG59O1xuXG5TZWFtbGVzc3BheUJ1cy5wcm90b3R5cGUudGVhcmRvd24gPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBsaXN0ZW5lciwgaTtcblxuICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5fbGlzdGVuZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgbGlzdGVuZXIgPSB0aGlzLl9saXN0ZW5lcnNbaV07XG4gICAgdGhpcy5fb2ZmRGlyZWN0KGxpc3RlbmVyLmV2ZW50TmFtZSwgbGlzdGVuZXIuaGFuZGxlcik7XG4gIH1cblxuICB0aGlzLl9saXN0ZW5lcnMubGVuZ3RoID0gMDtcblxuICB0aGlzLl9pc0Rlc3Ryb3llZCA9IHRydWU7XG59O1xuXG5TZWFtbGVzc3BheUJ1cy5wcm90b3R5cGUuX2xvZyA9IGZ1bmN0aW9uIChmdW5jdGlvbk5hbWUsIGFyZ3MpIHtcbiAgaWYgKHRoaXMuX2lzVmVyYm9zZSkge1xuICAgIGNvbnNvbGUubG9nKGZ1bmN0aW9uTmFtZSwgYXJncyk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICB9XG59O1xuXG5TZWFtbGVzc3BheUJ1cy5ldmVudHMgPSBldmVudHM7XG5cbm1vZHVsZS5leHBvcnRzID0gU2VhbWxlc3NwYXlCdXM7XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIF9jbGFzc2VzT2YoZWxlbWVudCkge1xuICByZXR1cm4gZWxlbWVudC5jbGFzc05hbWUudHJpbSgpLnNwbGl0KC9cXHMrLyk7XG59XG5cbmZ1bmN0aW9uIGFkZChlbGVtZW50KSB7XG4gIHZhciB0b0FkZCA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gIHZhciBjbGFzc05hbWUgPSBfY2xhc3Nlc09mKGVsZW1lbnQpLmZpbHRlcihmdW5jdGlvbiAoY2xhc3NuYW1lKSB7XG4gICAgcmV0dXJuIHRvQWRkLmluZGV4T2YoY2xhc3NuYW1lKSA9PT0gLTE7XG4gIH0pLmNvbmNhdCh0b0FkZCkuam9pbignICcpO1xuXG4gIGVsZW1lbnQuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xufVxuXG5mdW5jdGlvbiByZW1vdmUoZWxlbWVudCkge1xuICB2YXIgdG9SZW1vdmUgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICB2YXIgY2xhc3NOYW1lID0gX2NsYXNzZXNPZihlbGVtZW50KS5maWx0ZXIoZnVuY3Rpb24gKGNsYXNzbmFtZSkge1xuICAgIHJldHVybiB0b1JlbW92ZS5pbmRleE9mKGNsYXNzbmFtZSkgPT09IC0xO1xuICB9KS5qb2luKCcgJyk7XG5cbiAgZWxlbWVudC5jbGFzc05hbWUgPSBjbGFzc05hbWU7XG59XG5cbmZ1bmN0aW9uIHRvZ2dsZShlbGVtZW50LCBjbGFzc25hbWUsIGFkZGluZykge1xuICBpZiAoYWRkaW5nKSB7XG4gICAgYWRkKGVsZW1lbnQsIGNsYXNzbmFtZSk7XG4gIH0gZWxzZSB7XG4gICAgcmVtb3ZlKGVsZW1lbnQsIGNsYXNzbmFtZSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFkZDogYWRkLFxuICByZW1vdmU6IHJlbW92ZSxcbiAgdG9nZ2xlOiB0b2dnbGVcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgY29uc3RhbnRzID0gcmVxdWlyZSgnLi4vY2FyZC1lbGVtZW50L3NoYXJlZC9jb25zdGFudHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjb21wb3NlVXJsKGNvbmZpZywgdHlwZSwgY29tcG9uZW50SWQsIGlzRGVidWcpIHtcbiAgdmFyIGFzc2V0c1VybCA9IGNvbmZpZy5nYXRld2F5Q29uZmlndXJhdGlvbi5hc3NldHNVcmw7XG5cbiAgaWYgKGlzRGVidWcpIHtcbiAgICBhc3NldHNVcmwgPSBhc3NldHNVcmwucmVwbGFjZSgnaHR0cHMnLCAnaHR0cCcpO1xuICB9XG4gIHZhciBtaW4gPSBpc0RlYnVnID8gJycgOiAnLm1pbic7XG5cbiAgcmV0dXJuIGFzc2V0c1VybCArICcvJyArIGNvbnN0YW50cy5WRVJTSU9OICsgJy9odG1sLycgKyB0eXBlICsgJy1mcmFtZScgKyBtaW4gKyAnLmh0bWwjJyArIGNvbXBvbmVudElkO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFNlYW1sZXNzcGF5RXJyb3IgPSByZXF1aXJlKCcuL3NlYW1sZXNzcGF5LWVycm9yJyk7XG52YXIgc2hhcmVkRXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIG1ldGhvZE5hbWVzKSB7XG4gIG1ldGhvZE5hbWVzLmZvckVhY2goZnVuY3Rpb24gKG1ldGhvZE5hbWUpIHtcbiAgICBpbnN0YW5jZVttZXRob2ROYW1lXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRocm93IG5ldyBTZWFtbGVzc3BheUVycm9yKHtcbiAgICAgICAgdHlwZTogc2hhcmVkRXJyb3JzLk1FVEhPRF9DQUxMRURfQUZURVJfVEVBUkRPV04udHlwZSxcbiAgICAgICAgY29kZTogc2hhcmVkRXJyb3JzLk1FVEhPRF9DQUxMRURfQUZURVJfVEVBUkRPV04uY29kZSxcbiAgICAgICAgbWVzc2FnZTogbWV0aG9kTmFtZSArICcgY2Fubm90IGJlIGNhbGxlZCBhZnRlciB0ZWFyZG93bi4nXG4gICAgICB9KTtcbiAgICB9O1xuICB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGZuKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgLy8gSUU5IGRvZXNuJ3Qgc3VwcG9ydCBwYXNzaW5nIGFyZ3VtZW50cyB0byBzZXRUaW1lb3V0IHNvIHdlIGhhdmUgdG8gZW11bGF0ZSBpdC5cbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcblxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgZm4uYXBwbHkobnVsbCwgYXJncyk7XG4gICAgfSwgMSk7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmF0Y2hFeGVjdXRlRnVuY3Rpb25zID0gcmVxdWlyZSgnLi9iYXRjaC1leGVjdXRlLWZ1bmN0aW9ucycpO1xuXG5mdW5jdGlvbiBEZXN0cnVjdG9yKCkge1xuICB0aGlzLl90ZWFyZG93blJlZ2lzdHJ5ID0gW107XG5cbiAgdGhpcy5faXNUZWFyaW5nRG93biA9IGZhbHNlO1xufVxuXG5EZXN0cnVjdG9yLnByb3RvdHlwZS5yZWdpc3RlckZ1bmN0aW9uRm9yVGVhcmRvd24gPSBmdW5jdGlvbiAoZm4pIHtcbiAgaWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHRoaXMuX3RlYXJkb3duUmVnaXN0cnkucHVzaChmbik7XG4gIH1cbn07XG5cbkRlc3RydWN0b3IucHJvdG90eXBlLnRlYXJkb3duID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIGlmICh0aGlzLl9pc1RlYXJpbmdEb3duKSB7XG4gICAgY2FsbGJhY2sobmV3IEVycm9yKCdEZXN0cnVjdG9yIGlzIGFscmVhZHkgdGVhcmluZyBkb3duJykpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRoaXMuX2lzVGVhcmluZ0Rvd24gPSB0cnVlO1xuXG4gIGJhdGNoRXhlY3V0ZUZ1bmN0aW9ucyh0aGlzLl90ZWFyZG93blJlZ2lzdHJ5LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgdGhpcy5fdGVhcmRvd25SZWdpc3RyeSA9IFtdO1xuICAgIHRoaXMuX2lzVGVhcmluZ0Rvd24gPSBmYWxzZTtcblxuICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgfVxuICB9LmJpbmQodGhpcykpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBEZXN0cnVjdG9yO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBlbnVtZXJhdGUodmFsdWVzLCBwcmVmaXgpIHtcbiAgcHJlZml4ID0gcHJlZml4ID09IG51bGwgPyAnJyA6IHByZWZpeDtcblxuICByZXR1cm4gdmFsdWVzLnJlZHVjZShmdW5jdGlvbiAoZW51bWVyYXRpb24sIHZhbHVlKSB7XG4gICAgZW51bWVyYXRpb25bdmFsdWVdID0gcHJlZml4ICsgdmFsdWU7XG4gICAgcmV0dXJuIGVudW1lcmF0aW9uO1xuICB9LCB7fSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZW51bWVyYXRlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgU2VhbWxlc3NwYXlFcnJvciA9IHJlcXVpcmUoJy4vc2VhbWxlc3NwYXktZXJyb3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIElOVkFMSURfVVNFX09GX0lOVEVSTkFMX0ZVTkNUSU9OOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5JTlRFUk5BTCxcbiAgICBjb2RlOiAnSU5WQUxJRF9VU0VfT0ZfSU5URVJOQUxfRlVOQ1RJT04nXG4gIH0sXG4gIENBTExCQUNLX1JFUVVJUkVEOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnQ0FMTEJBQ0tfUkVRVUlSRUQnXG4gIH0sXG4gIElOU1RBTlRJQVRJT05fT1BUSU9OX1JFUVVJUkVEOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnSU5TVEFOVElBVElPTl9PUFRJT05fUkVRVUlSRUQnXG4gIH0sXG4gIElOVkFMSURfT1BUSU9OOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnSU5WQUxJRF9PUFRJT04nXG4gIH0sXG4gIElOQ09NUEFUSUJMRV9WRVJTSU9OUzoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTUVSQ0hBTlQsXG4gICAgY29kZTogJ0lOQ09NUEFUSUJMRV9WRVJTSU9OUydcbiAgfSxcbiAgSU5DT01QQVRJQkxFX0ZJRUxEU19TRVQ6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLk1FUkNIQU5ULFxuICAgIGNvZGU6ICdJTkNPTVBBVElCTEVfRklFTERTX1NFVCdcbiAgfSxcbiAgTUVUSE9EX0NBTExFRF9BRlRFUl9URUFSRE9XTjoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTUVSQ0hBTlQsXG4gICAgY29kZTogJ01FVEhPRF9DQUxMRURfQUZURVJfVEVBUkRPV04nXG4gIH0sXG4gIFNFQU1MRVNTUEFZX0FQSV9BQ0NFU1NfUkVTVFJJQ1RFRDoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTUVSQ0hBTlQsXG4gICAgY29kZTogJ1NFQU1MRVNTUEFZX0FQSV9BQ0NFU1NfUkVTVFJJQ1RFRCcsXG4gICAgbWVzc2FnZTogJ1lvdXIgYWNjZXNzIGlzIHJlc3RyaWN0ZWQgYW5kIGNhbm5vdCB1c2UgdGhpcyBwYXJ0IG9mIHRoZSBTZWFtbGVzc3BheSBBUEkuJ1xuICB9LFxuICBTRUFNTEVTU1BBWV9QQVlQQUxfTk9UX0xPQURFRDoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuSU5URVJOQUwsXG4gICAgY29kZTogJ1NFQU1MRVNTUEFZX1BBWVBBTF9OT1RfTE9BREVEJyxcbiAgICBtZXNzYWdlOiAnUGF5cGFsIFNESyBjb3VsZCBub3QgYmUgbG9hZGVkLidcbiAgfSxcbiAgSU5WQUxJRF9MQVRJTjFfU1RSSU5HOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5JTlRFUk5BTCxcbiAgICBjb2RlOiAnSU5WQUxJRF9MQVRJTjFfU1RSSU5HJ1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIHRoaXMuX2V2ZW50cyA9IHt9O1xufVxuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gZnVuY3Rpb24gKGV2ZW50LCBjYWxsYmFjaykge1xuICBpZiAodGhpcy5fZXZlbnRzW2V2ZW50XSkge1xuICAgIHRoaXMuX2V2ZW50c1tldmVudF0ucHVzaChjYWxsYmFjayk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5fZXZlbnRzW2V2ZW50XSA9IFtjYWxsYmFja107XG4gIH1cbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2VtaXQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgdmFyIGksIGFyZ3M7XG4gIHZhciBjYWxsYmFja3MgPSB0aGlzLl9ldmVudHNbZXZlbnRdO1xuXG4gIGlmICghY2FsbGJhY2tzKSB7IHJldHVybjsgfVxuXG4gIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG4gIGZvciAoaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcbiAgICBjYWxsYmFja3NbaV0uYXBwbHkobnVsbCwgYXJncyk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluamVjdEZyYW1lKGZyYW1lLCBjb250YWluZXIpIHtcbiAgdmFyIGNsZWFyYm90aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICB2YXIgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cbiAgY2xlYXJib3RoLnN0eWxlLmNsZWFyID0gJ2JvdGgnO1xuXG4gIGZyYWdtZW50LmFwcGVuZENoaWxkKGZyYW1lKTtcbiAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQoY2xlYXJib3RoKTtcblxuICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZnJhZ21lbnQpO1xuXG4gIHJldHVybiBbZnJhbWUsIGNsZWFyYm90aF07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQVBJX0hPU1QgPSB1bmRlZmluZWQ7XG52YXIgUEFOVkFVTFRfSE9TVCA9IHVuZGVmaW5lZDtcbnZhciBBU1NFVFNfSE9TVCA9IFwiaHR0cDovL2xvY2FsaG9zdDozMDAxL2RldlwiO1xuXG52YXIgbGVnYWxIb3N0cyA9IFtcbiAgJ3NlYW1sZXNzcGF5LmNvbScsXG4gICdzZWFtbGVzc3BheS5kZXYnLFxuICAnc2VhbWxlc3NwYXkuaW8nLFxuICAnd2ViLXNkay5zZWFtbGVzc3BheS5jb20nLFxuICAnYXBpLnNlYW1sZXNzcGF5LmNvbScsXG4gICdhcGkuc2VhbWxlc3NwYXkuZGV2JyxcbiAgJ2FwaS5zZWFtbGVzc3BheS5pbycsXG4gICdwYW4tdmF1bHQuc2VhbWxlc3NwYXkuY29tJyxcbiAgJ3Bhbi12YXVsdC5zZWFtbGVzc3BheS5kZXYnLFxuICAncGFuLXZhdWx0LnNlYW1sZXNzcGF5LmlvJyxcbiAgJ2FwaS5zYW5kYm94LnNlYW1sZXNzcGF5LmNvbScsXG4gICdhcGkuc2FuZGJveC5zZWFtbGVzc3BheS5kZXYnLFxuICAnYXBpLnNhbmRib3guc2VhbWxlc3NwYXkuaW8nLFxuICAncGFuLXZhdWx0LnNhbmRib3guc2VhbWxlc3NwYXkuY29tJyxcbiAgJ3Bhbi12YXVsdC5zYW5kYm94LnNlYW1sZXNzcGF5LmRldicsXG4gICdwYW4tdmF1bHQuc2FuZGJveC5zZWFtbGVzc3BheS5pbydcbl07XG5cbi8vIHJlbW92ZUlmKHByb2R1Y3Rpb24pXG5sZWdhbEhvc3RzLnB1c2goJ2xvY2FsaG9zdCcpO1xuaWYgKEFQSV9IT1NUKSB7XG4gIGxlZ2FsSG9zdHMucHVzaChzdHJpcFN1YmRvbWFpbnMoQVBJX0hPU1QpKTtcbn1cbmlmIChQQU5WQVVMVF9IT1NUKSB7XG4gIGxlZ2FsSG9zdHMucHVzaChzdHJpcFN1YmRvbWFpbnMoUEFOVkFVTFRfSE9TVCkpO1xufVxuaWYgKEFTU0VUU19IT1NUKSB7XG4gIGxlZ2FsSG9zdHMucHVzaChzdHJpcFN1YmRvbWFpbnMoQVNTRVRTX0hPU1QpLnJlcGxhY2UoJ2h0dHA6Ly8nLCAnJykucmVwbGFjZSgnaHR0cHM6Ly8nLCAnJykpO1xufVxuLy8gZW5kUmVtb3ZlSWYocHJvZHVjdGlvbilcblxuZnVuY3Rpb24gc3RyaXBTdWJkb21haW5zKGRvbWFpbikge1xuICByZXR1cm4gZG9tYWluLnNwbGl0KCcuJykuc2xpY2UoLTIpLmpvaW4oJy4nKTtcbn1cblxuZnVuY3Rpb24gaXNXaGl0ZWxpc3RlZERvbWFpbih1cmwpIHtcbiAgLy8gdmFyIG1haW5Eb21haW47XG5cbiAgLy8gdXJsID0gdXJsLnRvTG93ZXJDYXNlKCk7XG5cbiAgLy8gaWYgKCEobmV3IFJlZ0V4cCgnXmh0dHBzPzonKSkudGVzdCh1cmwpKSB7XG4gIC8vICAgcmV0dXJuIGZhbHNlO1xuICAvLyB9XG5cbiAgLy8gcGFyc2VyID0gcGFyc2VyIHx8IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgLy8gcGFyc2VyLmhyZWYgPSB1cmw7XG4gIC8vIG1haW5Eb21haW4gPSBzdHJpcFN1YmRvbWFpbnMocGFyc2VyLmhvc3RuYW1lKTtcbiAgdHJ5IHtcbiAgICB2YXIgcGFyc2VkVXJsID0gbmV3IFVSTCh1cmwpO1xuICAgIHJldHVybiBsZWdhbEhvc3RzLmluZGV4T2Yoc3RyaXBTdWJkb21haW5zKHBhcnNlZFVybC5ob3N0bmFtZSkpICE9PSAtMTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzV2hpdGVsaXN0ZWREb21haW47XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5maWx0ZXIoZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiB0eXBlb2Ygb2JqW2tleV0gPT09ICdmdW5jdGlvbic7XG4gIH0pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFByb21pc2UgPSBnbG9iYWwuUHJvbWlzZTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm9taXNlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZW51bWVyYXRlID0gcmVxdWlyZSgnLi9lbnVtZXJhdGUnKTtcblxuLyoqXG4gKiBAY2xhc3NcbiAqIEBnbG9iYWxcbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIENvbnN0cnVjdGlvbiBvcHRpb25zXG4gKiBAY2xhc3NkZXNjIFRoaXMgY2xhc3MgaXMgdXNlZCB0byByZXBvcnQgZXJyb3IgY29uZGl0aW9ucywgZnJlcXVlbnRseSBhcyB0aGUgZmlyc3QgcGFyYW1ldGVyIHRvIGNhbGxiYWNrcyB0aHJvdWdob3V0IHRoZSBTZWFtbGVzc3BheSBTREsuXG4gKiBAZGVzY3JpcHRpb24gPHN0cm9uZz5Zb3UgY2Fubm90IHVzZSB0aGlzIGNvbnN0cnVjdG9yIGRpcmVjdGx5LiBJbnRlcmFjdCB3aXRoIGluc3RhbmNlcyBvZiB0aGlzIGNsYXNzIHRocm91Z2gge0BsaW5rIGNhbGxiYWNrIGNhbGxiYWNrc30uPC9zdHJvbmc+XG4gKi9cbmZ1bmN0aW9uIFNlYW1sZXNzcGF5RXJyb3Iob3B0aW9ucykge1xuICBpZiAoIVNlYW1sZXNzcGF5RXJyb3IudHlwZXMuaGFzT3duUHJvcGVydHkob3B0aW9ucy50eXBlKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihvcHRpb25zLnR5cGUgKyAnIGlzIG5vdCBhIHZhbGlkIHR5cGUuJyk7XG4gIH1cblxuICBpZiAoIW9wdGlvbnMuY29kZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignRXJyb3IgY29kZSByZXF1aXJlZC4nKTtcbiAgfVxuXG4gIGlmICghb3B0aW9ucy5tZXNzYWdlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdFcnJvciBtZXNzYWdlIHJlcXVpcmVkLicpO1xuICB9XG5cbiAgdGhpcy5uYW1lID0gJ1NlYW1sZXNzcGF5RXJyb3InO1xuXG4gIC8qKlxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKiBAZGVzY3JpcHRpb24gQSBjb2RlIHRoYXQgY29ycmVzcG9uZHMgdG8gc3BlY2lmaWMgZXJyb3JzLlxuICAgKi9cbiAgdGhpcy5jb2RlID0gb3B0aW9ucy5jb2RlO1xuXG4gIC8qKlxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKiBAZGVzY3JpcHRpb24gQSBzaG9ydCBkZXNjcmlwdGlvbiBvZiB0aGUgZXJyb3IuXG4gICAqL1xuICB0aGlzLm1lc3NhZ2UgPSBvcHRpb25zLm1lc3NhZ2U7XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtTZWFtbGVzc3BheUVycm9yLnR5cGVzfVxuICAgKiBAZGVzY3JpcHRpb24gVGhlIHR5cGUgb2YgZXJyb3IuXG4gICAqL1xuICB0aGlzLnR5cGUgPSBvcHRpb25zLnR5cGU7XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtvYmplY3Q9fVxuICAgKiBAZGVzY3JpcHRpb24gQWRkaXRpb25hbCBpbmZvcm1hdGlvbiBhYm91dCB0aGUgZXJyb3IsIHN1Y2ggYXMgYW4gdW5kZXJseWluZyBuZXR3b3JrIGVycm9yIHJlc3BvbnNlLlxuICAgKi9cbiAgdGhpcy5kZXRhaWxzID0gb3B0aW9ucy5kZXRhaWxzO1xufVxuXG5TZWFtbGVzc3BheUVycm9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlKTtcblNlYW1sZXNzcGF5RXJyb3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gU2VhbWxlc3NwYXlFcnJvcjtcblxuLyoqXG4gKiBFbnVtIGZvciB7QGxpbmsgU2VhbWxlc3NwYXlFcnJvcn0gdHlwZXMuXG4gKiBAbmFtZSBTZWFtbGVzc3BheUVycm9yLnR5cGVzXG4gKiBAZW51bVxuICogQHJlYWRvbmx5XG4gKiBAbWVtYmVyb2YgU2VhbWxlc3NwYXlFcnJvclxuICogQHByb3BlcnR5IHtzdHJpbmd9IENVU1RPTUVSIEFuIGVycm9yIGNhdXNlZCBieSB0aGUgY3VzdG9tZXIuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gTUVSQ0hBTlQgQW4gZXJyb3IgdGhhdCBpcyBhY3Rpb25hYmxlIGJ5IHRoZSBtZXJjaGFudC5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBORVRXT1JLIEFuIGVycm9yIGR1ZSB0byBhIG5ldHdvcmsgcHJvYmxlbS5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBJTlRFUk5BTCBBbiBlcnJvciBjYXVzZWQgYnkgU2VhbWxlc3NwYXkgY29kZS5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBVTktOT1dOIEFuIGVycm9yIHdoZXJlIHRoZSBvcmlnaW4gaXMgdW5rbm93bi5cbiAqL1xuU2VhbWxlc3NwYXlFcnJvci50eXBlcyA9IGVudW1lcmF0ZShbXG4gICdDVVNUT01FUicsXG4gICdNRVJDSEFOVCcsXG4gICdORVRXT1JLJyxcbiAgJ0lOVEVSTkFMJyxcbiAgJ1VOS05PV04nXG5dKTtcblxubW9kdWxlLmV4cG9ydHMgPSBTZWFtbGVzc3BheUVycm9yO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiB1dWlkKCkge1xuICByZXR1cm4gJ3h4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eCcucmVwbGFjZSgvW3h5XS9nLCBmdW5jdGlvbiAoYykge1xuICAgIHZhciByID0gTWF0aC5yYW5kb20oKSAqIDE2IHwgMDtcbiAgICB2YXIgdiA9IGMgPT09ICd4JyA/IHIgOiByICYgMHgzIHwgMHg4O1xuXG4gICAgcmV0dXJuIHYudG9TdHJpbmcoMTYpO1xuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB1dWlkO1xuIl19
