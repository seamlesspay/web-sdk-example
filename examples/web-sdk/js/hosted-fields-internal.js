(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.seamlesspay || (g.seamlesspay = {})).hostedFields = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(_dereq_,module,exports){
"use strict";
module.exports = function isAndroid(ua) {
    ua = ua || window.navigator.userAgent;
    return /Android/i.test(ua);
};

},{}],2:[function(_dereq_,module,exports){
"use strict";
module.exports = function isChromeOS(ua) {
    ua = ua || window.navigator.userAgent;
    return /CrOS/i.test(ua);
};

},{}],3:[function(_dereq_,module,exports){
"use strict";
var isEdge = _dereq_("./is-edge");
var isSamsung = _dereq_("./is-samsung");
var isDuckDuckGo = _dereq_("./is-duckduckgo");
var isOpera = _dereq_("./is-opera");
var isSilk = _dereq_("./is-silk");
module.exports = function isChrome(ua) {
    ua = ua || window.navigator.userAgent;
    return ((ua.indexOf("Chrome") !== -1 || ua.indexOf("CriOS") !== -1) &&
        !isEdge(ua) &&
        !isSamsung(ua) &&
        !isDuckDuckGo(ua) &&
        !isOpera(ua) &&
        !isSilk(ua));
};

},{"./is-duckduckgo":4,"./is-edge":5,"./is-opera":9,"./is-samsung":10,"./is-silk":11}],4:[function(_dereq_,module,exports){
"use strict";
module.exports = function isDuckDuckGo(ua) {
    ua = ua || window.navigator.userAgent;
    return ua.indexOf("DuckDuckGo/") !== -1;
};

},{}],5:[function(_dereq_,module,exports){
"use strict";
module.exports = function isEdge(ua) {
    ua = ua || window.navigator.userAgent;
    return ua.indexOf("Edge/") !== -1 || ua.indexOf("Edg/") !== -1;
};

},{}],6:[function(_dereq_,module,exports){
"use strict";
module.exports = function isIe9(ua) {
    ua = ua || window.navigator.userAgent;
    return ua.indexOf("MSIE 9") !== -1;
};

},{}],7:[function(_dereq_,module,exports){
"use strict";
var isIpadOS = _dereq_("./is-ipados");
module.exports = function isIos(ua, checkIpadOS, document) {
    if (checkIpadOS === void 0) { checkIpadOS = true; }
    ua = ua || window.navigator.userAgent;
    var iOsTest = /iPhone|iPod|iPad/i.test(ua);
    return checkIpadOS ? iOsTest || isIpadOS(ua, document) : iOsTest;
};

},{"./is-ipados":8}],8:[function(_dereq_,module,exports){
"use strict";
module.exports = function isIpadOS(ua, document) {
    ua = ua || window.navigator.userAgent;
    document = document || window.document;
    // "ontouchend" is used to determine if a browser is on an iPad, otherwise
    // user-agents for iPadOS behave/identify as a desktop browser
    return /Mac|iPad/i.test(ua) && "ontouchend" in document;
};

},{}],9:[function(_dereq_,module,exports){
"use strict";
module.exports = function isOpera(ua) {
    ua = ua || window.navigator.userAgent;
    return (ua.indexOf("OPR/") !== -1 ||
        ua.indexOf("Opera/") !== -1 ||
        ua.indexOf("OPT/") !== -1);
};

},{}],10:[function(_dereq_,module,exports){
"use strict";
module.exports = function isSamsungBrowser(ua) {
    ua = ua || window.navigator.userAgent;
    return /SamsungBrowser/i.test(ua);
};

},{}],11:[function(_dereq_,module,exports){
"use strict";
module.exports = function isSilk(ua) {
    ua = ua || window.navigator.userAgent;
    return ua.indexOf("Silk/") !== -1;
};

},{}],12:[function(_dereq_,module,exports){
module.exports = _dereq_("./dist/is-android");

},{"./dist/is-android":1}],13:[function(_dereq_,module,exports){
module.exports = _dereq_("./dist/is-chrome-os");

},{"./dist/is-chrome-os":2}],14:[function(_dereq_,module,exports){
module.exports = _dereq_("./dist/is-chrome");

},{"./dist/is-chrome":3}],15:[function(_dereq_,module,exports){
module.exports = _dereq_("./dist/is-ie9");

},{"./dist/is-ie9":6}],16:[function(_dereq_,module,exports){
module.exports = _dereq_("./dist/is-ios");

},{"./dist/is-ios":7}],17:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIos = exports.isIE9 = exports.isSamsungBrowser = exports.isAndroidChrome = exports.isKitKatWebview = void 0;
// server side rendering check
var UA = (typeof window !== "undefined" &&
    window.navigator &&
    window.navigator.userAgent);
// TODO remove this when browser detection is converted to typescript
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
var isAndroid = _dereq_("@braintree/browser-detection/is-android");
// @ts-ignore
var isChromeOs = _dereq_("@braintree/browser-detection/is-chrome-os");
// @ts-ignore
var isChrome = _dereq_("@braintree/browser-detection/is-chrome");
// @ts-ignore
var isIos = _dereq_("@braintree/browser-detection/is-ios");
exports.isIos = isIos;
// @ts-ignore
var isIE9 = _dereq_("@braintree/browser-detection/is-ie9");
exports.isIE9 = isIE9;
/* eslint-enable @typescript-eslint/ban-ts-comment */
// Old Android Webviews used specific versions of Chrome with 0.0.0 as their version suffix
// https://developer.chrome.com/multidevice/user-agent#webview_user_agent
var KITKAT_WEBVIEW_REGEX = /Version\/\d\.\d* Chrome\/\d*\.0\.0\.0/;
function isOldSamsungBrowserOrSamsungWebview(ua) {
    return !isChrome(ua) && ua.indexOf("Samsung") > -1;
}
function isKitKatWebview(ua) {
    if (ua === void 0) { ua = UA; }
    return isAndroid(ua) && KITKAT_WEBVIEW_REGEX.test(ua);
}
exports.isKitKatWebview = isKitKatWebview;
function isAndroidChrome(ua) {
    if (ua === void 0) { ua = UA; }
    return (isAndroid(ua) || isChromeOs(ua)) && isChrome(ua);
}
exports.isAndroidChrome = isAndroidChrome;
function isSamsungBrowser(ua) {
    if (ua === void 0) { ua = UA; }
    return /SamsungBrowser/.test(ua) || isOldSamsungBrowserOrSamsungWebview(ua);
}
exports.isSamsungBrowser = isSamsungBrowser;

},{"@braintree/browser-detection/is-android":12,"@braintree/browser-detection/is-chrome":14,"@braintree/browser-detection/is-chrome-os":13,"@braintree/browser-detection/is-ie9":15,"@braintree/browser-detection/is-ios":16}],18:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatternFormatter = void 0;
var parse_pattern_1 = _dereq_("./parse-pattern");
var is_backspace_1 = _dereq_("../is-backspace");
var PatternFormatter = /** @class */ (function () {
    function PatternFormatter(pattern) {
        this.pattern = (0, parse_pattern_1.parsePattern)(pattern);
    }
    PatternFormatter.prototype.format = function (options) {
        var originalString = options.value;
        var originalStringIndex = 0;
        var formattedString = "";
        var selection = {
            start: options.selection.start,
            end: options.selection.end,
        };
        for (var i = 0; i < this.pattern.length; i++) {
            var patternChar = this.pattern[i];
            var inputChar = originalString[originalStringIndex];
            if (originalStringIndex > originalString.length) {
                break;
            }
            if (typeof patternChar.value === "string") {
                if (inputChar != null || formattedString.length === patternChar.index) {
                    formattedString += patternChar.value;
                    if (patternChar.index <= selection.start) {
                        selection.start++;
                    }
                    if (patternChar.index <= selection.end) {
                        selection.end++;
                    }
                }
            }
            else {
                // User input char
                // prettier-ignore
                for (; originalStringIndex < originalString.length; originalStringIndex++) {
                    inputChar = originalString[originalStringIndex];
                    if (patternChar.value.test(inputChar)) {
                        formattedString += inputChar;
                        originalStringIndex++;
                        break;
                    }
                    else {
                        if (patternChar.index <= selection.start) {
                            selection.start--;
                        }
                        if (patternChar.index <= selection.end) {
                            selection.end--;
                        }
                    }
                }
            }
        }
        return {
            value: formattedString,
            selection: selection,
        };
    };
    PatternFormatter.prototype.unformat = function (options) {
        var start = options.selection.start;
        var end = options.selection.end;
        var unformattedString = "";
        for (var i = 0; i < this.pattern.length; i++) {
            var patternChar = this.pattern[i];
            if (typeof patternChar.value !== "string" &&
                options.value[i] != null &&
                patternChar.value.test(options.value[i])) {
                unformattedString += options.value[i];
                continue;
            }
            if (patternChar.value !== options.value[patternChar.index]) {
                continue;
            }
            if (patternChar.index < options.selection.start) {
                start--;
            }
            if (patternChar.index < options.selection.end) {
                end--;
            }
        }
        return {
            selection: {
                start: start,
                end: end,
            },
            value: unformattedString,
        };
    };
    PatternFormatter.prototype.simulateDeletion = function (options) {
        var deletionStart, deletionEnd;
        var state = this.unformat(options);
        var value = state.value;
        var selection = state.selection;
        var delta = Math.abs(state.selection.end - state.selection.start);
        if (delta) {
            deletionStart = selection.start;
            deletionEnd = selection.end;
        }
        else if ((0, is_backspace_1.isBackspace)(options.event)) {
            deletionStart = Math.max(0, selection.start - 1);
            deletionEnd = selection.start;
        }
        else {
            // Handle forward delete
            deletionStart = selection.start;
            deletionEnd = Math.min(value.length, selection.start + 1);
        }
        return {
            selection: {
                start: deletionStart,
                end: deletionStart,
            },
            value: value.substr(0, deletionStart) + value.substr(deletionEnd),
        };
    };
    return PatternFormatter;
}());
exports.PatternFormatter = PatternFormatter;

},{"../is-backspace":21,"./parse-pattern":19}],19:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePattern = void 0;
var ALPHA_REGEX = /[A-Za-z]/;
var DIGIT_REGEX = /\d/;
var WILD_REGEX = /./;
var PLACEHOLDER_REGEX = /^[A-Za-z0-9\*]$/;
var PLACEHOLDER_PATTERN = "({{[^}]+}})";
var PERMACHAR_REGEX = "(\\s|\\S)";
var PATTERN_REGEX = new RegExp(PLACEHOLDER_PATTERN + "|" + PERMACHAR_REGEX, "g");
var PLACEHOLDER_PATTERN_REGEX = new RegExp("^" + PLACEHOLDER_PATTERN + "$");
var replacerRegex = new RegExp("{|}", "g");
function isDigit(char) {
    return DIGIT_REGEX.test(char);
}
function isAlpha(char) {
    return ALPHA_REGEX.test(char);
}
function createRegexForChar(char) {
    if (isDigit(char)) {
        return DIGIT_REGEX;
    }
    else if (isAlpha(char)) {
        return ALPHA_REGEX;
    }
    return WILD_REGEX;
}
function isPlaceholder(char) {
    return PLACEHOLDER_REGEX.test(char);
}
function isPlaceholderPattern(str) {
    return PLACEHOLDER_PATTERN_REGEX.test(str);
}
function parsePattern(patternString) {
    var patternArray = [];
    var patternParts = patternString.match(PATTERN_REGEX);
    if (!patternParts) {
        return patternArray;
    }
    for (var index = 0, i = 0; i < patternParts.length; i++) {
        var patternPart = patternParts[i];
        if (isPlaceholderPattern(patternPart)) {
            var placeholderChars = patternPart.replace(replacerRegex, "").split("");
            for (var j = 0; j < placeholderChars.length; j++) {
                var placeholderChar = placeholderChars[j];
                if (!isPlaceholder(placeholderChar)) {
                    throw new Error("Only alphanumeric or wildcard pattern matchers are allowed");
                }
                patternArray.push({
                    value: createRegexForChar(placeholderChar),
                    isPermaChar: false,
                    index: index++,
                });
            }
        }
        else {
            patternArray.push({
                value: patternPart,
                isPermaChar: true,
                index: index++,
            });
        }
    }
    return patternArray;
}
exports.parsePattern = parsePattern;

},{}],20:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.set = exports.get = void 0;
function get(element) {
    var start = element.selectionStart || 0;
    var end = element.selectionEnd || 0;
    return {
        start: start,
        end: end,
        delta: Math.abs(end - start),
    };
}
exports.get = get;
function set(element, start, end) {
    // Some browsers explode if you use setSelectionRange
    // on a non-focused element
    if (document.activeElement === element && element.setSelectionRange) {
        element.setSelectionRange(start, end);
    }
}
exports.set = set;

},{}],21:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBackspace = void 0;
function isBackspace(event) {
    return event.key === "Backspace" || event.keyCode === 8;
}
exports.isBackspace = isBackspace;

},{}],22:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDelete = void 0;
var DELETE_REGEX = /^Del(ete)?$/;
function isDelete(event) {
    return DELETE_REGEX.test(event.key) || event.keyCode === 46;
}
exports.isDelete = isDelete;

},{}],23:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keyCannotMutateValue = void 0;
var input_selection_1 = _dereq_("./input-selection");
// eslint-disable-next-line complexity
function keyCannotMutateValue(event) {
    var input = (event.currentTarget || event.srcElement);
    var selection = (0, input_selection_1.get)(input);
    var isAtBeginning = selection.start === 0;
    var isAtEnd = selection.start === input.value.length;
    var isShifted = event.shiftKey === true;
    // https://www.w3.org/TR/DOM-Level-3-Events/#widl-KeyboardEvent-key
    switch (event.key) {
        case undefined: // eslint-disable-line
        case "Unidentified": // Cannot be determined
        case "": // Uninitialized
            break;
        case "Backspace": // backspace at the beginning
            return isAtBeginning;
        case "Del": // delete at the end
        case "Delete":
            return isAtEnd;
        default:
            return event.key.length !== 1;
    }
    // http://unixpapa.com/js/key.html
    switch (event.keyCode) {
        case 9: // tab
        case 19: // pause/break
        case 20: // caps lock
        case 27: // escape
        case 39: // arrows
        case 45: // insert
            return true;
        case 33: // page up (if shifted, '!')
        case 34: // page down (if shifted, ''')
        case 35: // end (if shifted, '#')
        case 36: // home (if shifted, '$')
        case 37: // arrows (if shifted, '%')
        case 38: // arrows (if shifted, '&')
        case 40: // arrows (if shifted, '(')
            return !isShifted;
        case 8: // backspace at the beginning
            return isAtBeginning;
        case 46: // delete at the end
            return isAtEnd;
        default:
            return false;
    }
}
exports.keyCannotMutateValue = keyCannotMutateValue;

},{"./input-selection":20}],24:[function(_dereq_,module,exports){
"use strict";
var device_1 = _dereq_("./device");
var supportsInputFormatting = _dereq_("../supports-input-formatting");
var ios_1 = _dereq_("./strategies/ios");
var android_chrome_1 = _dereq_("./strategies/android-chrome");
var kitkat_chromium_based_webview_1 = _dereq_("./strategies/kitkat-chromium-based-webview");
var ie9_1 = _dereq_("./strategies/ie9");
var base_1 = _dereq_("./strategies/base");
var noop_1 = _dereq_("./strategies/noop");
/**
 * Instances of this class can be used to modify the formatter for an input
 * @class
 * @param {object} options The initialization paramaters for this class
 * @param {object} options.element - A Input DOM object that RestrictedInput operates on
 * @param {string} options.pattern - The pattern to enforce on this element
 */
var RestrictedInput = /** @class */ (function () {
    function RestrictedInput(options) {
        if (!RestrictedInput.supportsFormatting()) {
            this.strategy = new noop_1.NoopKeyboardStrategy(options);
        }
        else if ((0, device_1.isIos)()) {
            this.strategy = new ios_1.IosStrategy(options);
        }
        else if ((0, device_1.isKitKatWebview)()) {
            this.strategy = new kitkat_chromium_based_webview_1.KitKatChromiumBasedWebViewStrategy(options);
        }
        else if ((0, device_1.isAndroidChrome)()) {
            this.strategy = new android_chrome_1.AndroidChromeStrategy(options);
        }
        else if ((0, device_1.isIE9)()) {
            this.strategy = new ie9_1.IE9Strategy(options);
        }
        else {
            this.strategy = new base_1.BaseStrategy(options);
        }
    }
    /**
     * @public
     * @returns {string} the unformatted value of the element
     */
    RestrictedInput.prototype.getUnformattedValue = function () {
        return this.strategy.getUnformattedValue();
    };
    /**
     * @public
     * @param {string} pattern - the pattern to enforce on the element
     * @return {void}
     */
    RestrictedInput.prototype.setPattern = function (pattern) {
        this.strategy.setPattern(pattern);
    };
    RestrictedInput.supportsFormatting = function () {
        return supportsInputFormatting();
    };
    return RestrictedInput;
}());
module.exports = RestrictedInput;

},{"../supports-input-formatting":33,"./device":17,"./strategies/android-chrome":25,"./strategies/base":26,"./strategies/ie9":27,"./strategies/ios":28,"./strategies/kitkat-chromium-based-webview":29,"./strategies/noop":30}],25:[function(_dereq_,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AndroidChromeStrategy = void 0;
var key_cannot_mutate_value_1 = _dereq_("../key-cannot-mutate-value");
var base_1 = _dereq_("./base");
var input_selection_1 = _dereq_("../input-selection");
var AndroidChromeStrategy = /** @class */ (function (_super) {
    __extends(AndroidChromeStrategy, _super);
    function AndroidChromeStrategy() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AndroidChromeStrategy.prototype.attachListeners = function () {
        var _this = this;
        this.inputElement.addEventListener("keydown", function (event) {
            if ((0, key_cannot_mutate_value_1.keyCannotMutateValue)(event)) {
                return;
            }
            _this.unformatInput();
        });
        // 'keypress' is not fired with some Android keyboards (see #23)
        this.inputElement.addEventListener("keypress", function (event) {
            if ((0, key_cannot_mutate_value_1.keyCannotMutateValue)(event)) {
                return;
            }
            _this.unformatInput();
        });
        this.inputElement.addEventListener("keyup", function () {
            _this.reformatInput();
        });
        this.inputElement.addEventListener("input", function () {
            _this.reformatInput();
        });
        this.inputElement.addEventListener("paste", function (event) {
            event.preventDefault();
            _this.pasteEventHandler(event);
        });
    };
    AndroidChromeStrategy.prototype.prePasteEventHandler = function () {
        // the default strategy calls preventDefault here
        // but that removes the clipboard data in Android chrome
        // so we noop instead
    };
    AndroidChromeStrategy.prototype.postPasteEventHandler = function () {
        var _this = this;
        // the default strategy calls this without a timeout
        setTimeout(function () {
            _this.reformatAfterPaste();
        }, 0);
    };
    AndroidChromeStrategy.prototype.afterReformatInput = function (formattedState) {
        var input = this.inputElement;
        // Some Android Chrome keyboards (notably Samsung)
        // cause the browser to not know that the value
        // of the input has changed when adding
        // permacharacters. This results in the selection
        // putting the cursor before the permacharacter,
        // instead of after.
        //
        // There is also the case of some Android Chrome
        // keyboards reporting a ranged selection on the
        // first character input. Restricted Input maintains
        // that range even though it is incorrect from the
        // keyboard.
        //
        // To resolve these issues we setTimeout and reset
        // the selection to the formatted end position.
        setTimeout(function () {
            var formattedSelection = formattedState.selection;
            (0, input_selection_1.set)(input, formattedSelection.end, formattedSelection.end);
        }, 0);
    };
    return AndroidChromeStrategy;
}(base_1.BaseStrategy));
exports.AndroidChromeStrategy = AndroidChromeStrategy;

},{"../input-selection":20,"../key-cannot-mutate-value":23,"./base":26}],26:[function(_dereq_,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseStrategy = void 0;
var strategy_interface_1 = _dereq_("./strategy-interface");
var key_cannot_mutate_value_1 = _dereq_("../key-cannot-mutate-value");
var input_selection_1 = _dereq_("../input-selection");
var is_backspace_1 = _dereq_("../is-backspace");
var is_delete_1 = _dereq_("../is-delete");
var formatter_1 = _dereq_("../formatter");
function isSimulatedEvent(event) {
    // 1Password sets input.value then fires keyboard events. Dependent on browser
    // here might be falsy values (key = '', keyCode = 0) or these keys might be omitted
    // Chrome autofill inserts keys all at once and fires a single event without key info
    return !event.key && !event.keyCode;
}
var BaseStrategy = /** @class */ (function (_super) {
    __extends(BaseStrategy, _super);
    function BaseStrategy(options) {
        var _this = _super.call(this, options) || this;
        _this.formatter = new formatter_1.PatternFormatter(options.pattern);
        _this.onPasteEvent = options.onPasteEvent;
        _this.attachListeners();
        _this.formatIfNotEmpty();
        return _this;
    }
    BaseStrategy.prototype.getUnformattedValue = function (forceUnformat) {
        var value = this.inputElement.value;
        if (forceUnformat || this.isFormatted) {
            value = this.formatter.unformat({
                value: this.inputElement.value,
                selection: { start: 0, end: 0 },
            }).value;
        }
        return value;
    };
    BaseStrategy.prototype.formatIfNotEmpty = function () {
        if (this.inputElement.value) {
            this.reformatInput();
        }
    };
    BaseStrategy.prototype.setPattern = function (pattern) {
        this.unformatInput();
        this.formatter = new formatter_1.PatternFormatter(pattern);
        this.formatIfNotEmpty();
    };
    BaseStrategy.prototype.attachListeners = function () {
        var _this = this;
        this.inputElement.addEventListener("keydown", function (e) {
            var event = e;
            if (isSimulatedEvent(event)) {
                _this.isFormatted = false;
            }
            if ((0, key_cannot_mutate_value_1.keyCannotMutateValue)(event)) {
                return;
            }
            if (_this.isDeletion(event)) {
                _this.unformatInput();
            }
        });
        this.inputElement.addEventListener("keypress", function (e) {
            var event = e;
            if (isSimulatedEvent(event)) {
                _this.isFormatted = false;
            }
            if ((0, key_cannot_mutate_value_1.keyCannotMutateValue)(event)) {
                return;
            }
            _this.unformatInput();
        });
        this.inputElement.addEventListener("keyup", function () {
            _this.reformatInput();
        });
        this.inputElement.addEventListener("input", function (event) {
            // Safari AutoFill fires CustomEvents
            // LastPass sends an `isTrusted: false` property
            // Since the input is changed all at once, set isFormatted
            // to false so that reformatting actually occurs
            if (event instanceof CustomEvent || !event.isTrusted) {
                _this.isFormatted = false;
            }
            _this.reformatInput();
        });
        this.inputElement.addEventListener("paste", function (event) {
            _this.pasteEventHandler(event);
        });
    };
    BaseStrategy.prototype.isDeletion = function (event) {
        return (0, is_delete_1.isDelete)(event) || (0, is_backspace_1.isBackspace)(event);
    };
    BaseStrategy.prototype.reformatInput = function () {
        if (this.isFormatted) {
            return;
        }
        this.isFormatted = true;
        var input = this.inputElement;
        var formattedState = this.formatter.format({
            selection: (0, input_selection_1.get)(input),
            value: input.value,
        });
        input.value = formattedState.value;
        (0, input_selection_1.set)(input, formattedState.selection.start, formattedState.selection.end);
        this.afterReformatInput(formattedState);
    };
    // If a strategy needs to impliment specific behavior
    // after reformatting has happend, the strategy just
    // overwrites this method on their own prototype
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    BaseStrategy.prototype.afterReformatInput = function (formattedState) {
        // noop
    };
    BaseStrategy.prototype.unformatInput = function () {
        if (!this.isFormatted) {
            return;
        }
        this.isFormatted = false;
        var input = this.inputElement;
        var selection = (0, input_selection_1.get)(input);
        var unformattedState = this.formatter.unformat({
            selection: selection,
            value: input.value,
        });
        input.value = unformattedState.value;
        (0, input_selection_1.set)(input, unformattedState.selection.start, unformattedState.selection.end);
    };
    BaseStrategy.prototype.prePasteEventHandler = function (event) {
        // without this, the paste event is called twice
        // so if you were pasting abc it would result in
        // abcabc
        event.preventDefault();
    };
    BaseStrategy.prototype.postPasteEventHandler = function () {
        this.reformatAfterPaste();
    };
    BaseStrategy.prototype.pasteEventHandler = function (event) {
        var splicedEntry;
        var entryValue = "";
        this.prePasteEventHandler(event);
        this.unformatInput();
        if (event.clipboardData) {
            entryValue = event.clipboardData.getData("Text");
        }
        else if (window.clipboardData) {
            entryValue = window.clipboardData.getData("Text");
        }
        var selection = (0, input_selection_1.get)(this.inputElement);
        splicedEntry = this.inputElement.value.split("");
        splicedEntry.splice(selection.start, selection.end - selection.start, entryValue);
        splicedEntry = splicedEntry.join("");
        if (this.onPasteEvent) {
            this.onPasteEvent({
                unformattedInputValue: splicedEntry,
            });
        }
        this.inputElement.value = splicedEntry;
        (0, input_selection_1.set)(this.inputElement, selection.start + entryValue.length, selection.start + entryValue.length);
        this.postPasteEventHandler();
    };
    BaseStrategy.prototype.reformatAfterPaste = function () {
        var event = document.createEvent("Event");
        this.reformatInput();
        event.initEvent("input", true, true);
        this.inputElement.dispatchEvent(event);
    };
    BaseStrategy.prototype.getStateToFormat = function () {
        var input = this.inputElement;
        var selection = (0, input_selection_1.get)(input);
        var stateToFormat = {
            selection: selection,
            value: input.value,
        };
        if (this.stateToFormat) {
            stateToFormat = this.stateToFormat;
            delete this.stateToFormat;
        }
        else if (selection.start === input.value.length && this.isFormatted) {
            stateToFormat = this.formatter.unformat(stateToFormat);
        }
        return stateToFormat;
    };
    return BaseStrategy;
}(strategy_interface_1.StrategyInterface));
exports.BaseStrategy = BaseStrategy;

},{"../formatter":18,"../input-selection":20,"../is-backspace":21,"../is-delete":22,"../key-cannot-mutate-value":23,"./strategy-interface":31}],27:[function(_dereq_,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.IE9Strategy = void 0;
var base_1 = _dereq_("./base");
var key_cannot_mutate_value_1 = _dereq_("../key-cannot-mutate-value");
var input_selection_1 = _dereq_("../input-selection");
function padSelection(selection, pad) {
    return {
        start: selection.start + pad,
        end: selection.end + pad,
    };
}
var IE9Strategy = /** @class */ (function (_super) {
    __extends(IE9Strategy, _super);
    function IE9Strategy() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IE9Strategy.prototype.getUnformattedValue = function () {
        return base_1.BaseStrategy.prototype.getUnformattedValue.call(this, true);
    };
    IE9Strategy.prototype.attachListeners = function () {
        var _this = this;
        this.inputElement.addEventListener("keydown", function (event) {
            _this.keydownListener(event);
        });
        this.inputElement.addEventListener("focus", function () {
            _this.format();
        });
        this.inputElement.addEventListener("paste", function (event) {
            _this.pasteEventHandler(event);
        });
    };
    IE9Strategy.prototype.format = function () {
        var input = this.inputElement;
        var stateToFormat = this.getStateToFormat();
        var formattedState = this.formatter.format(stateToFormat);
        input.value = formattedState.value;
        (0, input_selection_1.set)(input, formattedState.selection.start, formattedState.selection.end);
    };
    IE9Strategy.prototype.keydownListener = function (event) {
        if ((0, key_cannot_mutate_value_1.keyCannotMutateValue)(event)) {
            return;
        }
        event.preventDefault();
        if (this.isDeletion(event)) {
            this.stateToFormat = this.formatter.simulateDeletion({
                event: event,
                selection: (0, input_selection_1.get)(this.inputElement),
                value: this.inputElement.value,
            });
        }
        else {
            // IE9 does not update the input's value attribute
            // during key events, only after they complete.
            // We must retrieve the key from event.key and
            // add it to the input's value before formatting.
            var oldValue = this.inputElement.value;
            var selection = (0, input_selection_1.get)(this.inputElement);
            var newValue = oldValue.slice(0, selection.start) +
                event.key +
                oldValue.slice(selection.start);
            selection = padSelection(selection, 1);
            this.stateToFormat = {
                selection: selection,
                value: newValue,
            };
            if (selection.start === newValue.length) {
                this.stateToFormat = this.formatter.unformat(this.stateToFormat);
            }
        }
        this.format();
    };
    IE9Strategy.prototype.reformatAfterPaste = function () {
        var input = this.inputElement;
        var selection = (0, input_selection_1.get)(this.inputElement);
        var value = this.formatter.format({
            selection: selection,
            value: input.value,
        }).value;
        selection = padSelection(selection, 1);
        input.value = value;
        // IE9 sets the selection to the end of the input
        // manually setting it in a setTimeout puts it
        // in the correct position after pasting
        setTimeout(function () {
            (0, input_selection_1.set)(input, selection.start, selection.end);
        }, 0);
    };
    return IE9Strategy;
}(base_1.BaseStrategy));
exports.IE9Strategy = IE9Strategy;

},{"../input-selection":20,"../key-cannot-mutate-value":23,"./base":26}],28:[function(_dereq_,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.IosStrategy = void 0;
var base_1 = _dereq_("./base");
var key_cannot_mutate_value_1 = _dereq_("../key-cannot-mutate-value");
var input_selection_1 = _dereq_("../input-selection");
var IosStrategy = /** @class */ (function (_super) {
    __extends(IosStrategy, _super);
    function IosStrategy() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IosStrategy.prototype.getUnformattedValue = function () {
        return _super.prototype.getUnformattedValue.call(this, true);
    };
    IosStrategy.prototype.attachListeners = function () {
        var _this = this;
        this.inputElement.addEventListener("keydown", function (event) {
            var isKeyboardEvent = event instanceof KeyboardEvent;
            if (!isKeyboardEvent && _this.inputElement.value.length > 0) {
                _this.stateToFormat = {
                    selection: { start: 0, end: 0 },
                    value: _this.inputElement.value,
                };
            }
            else if (_this.stateToFormat) {
                delete _this.stateToFormat;
            }
            _this.keydownListener(event);
        });
        this.inputElement.addEventListener("input", function (event) {
            var isCustomEvent = event instanceof CustomEvent;
            // Safari AutoFill fires CustomEvents
            // Set state to format before calling format listener
            if (isCustomEvent) {
                _this.stateToFormat = {
                    selection: { start: 0, end: 0 },
                    value: _this.inputElement.value,
                };
            }
            _this.formatListener();
            if (!isCustomEvent) {
                _this.fixLeadingBlankSpaceOnIos();
            }
        });
        this.inputElement.addEventListener("focus", function () {
            _this.formatListener();
        });
        this.inputElement.addEventListener("paste", function (event) {
            _this.pasteEventHandler(event);
        });
    };
    // When deleting the last character on iOS, the cursor
    // is positioned as if there is a blank space when there
    // is not, setting it to '' in a setTimeout fixes it ¯\_(ツ)_/¯
    IosStrategy.prototype.fixLeadingBlankSpaceOnIos = function () {
        var input = this.inputElement;
        if (input.value === "") {
            setTimeout(function () {
                input.value = "";
            }, 0);
        }
    };
    IosStrategy.prototype.formatListener = function () {
        if (this.isFormatted) {
            return;
        }
        var input = this.inputElement;
        var stateToFormat = this.getStateToFormat();
        var formattedState = this.formatter.format(stateToFormat);
        this.isFormatted = true;
        input.value = formattedState.value;
        (0, input_selection_1.set)(input, formattedState.selection.start, formattedState.selection.end);
    };
    IosStrategy.prototype.keydownListener = function (event) {
        if ((0, key_cannot_mutate_value_1.keyCannotMutateValue)(event)) {
            return;
        }
        if (this.isDeletion(event)) {
            this.stateToFormat = this.formatter.simulateDeletion({
                event: event,
                selection: (0, input_selection_1.get)(this.inputElement),
                value: this.inputElement.value,
            });
        }
        this.unformatInput();
    };
    return IosStrategy;
}(base_1.BaseStrategy));
exports.IosStrategy = IosStrategy;

},{"../input-selection":20,"../key-cannot-mutate-value":23,"./base":26}],29:[function(_dereq_,module,exports){
"use strict";
// Android Devices on KitKat use Chromium based webviews. For some reason,
// the value of the inputs are not accessible in the event loop where the
// key event listeners are called. This causes formatting to get stuck
// on permacharacters. By putting them in setTimeouts, this fixes the
// problem. This causes other problems in non-webviews, so we give it
// its own strategy.
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.KitKatChromiumBasedWebViewStrategy = void 0;
var android_chrome_1 = _dereq_("./android-chrome");
var KitKatChromiumBasedWebViewStrategy = /** @class */ (function (_super) {
    __extends(KitKatChromiumBasedWebViewStrategy, _super);
    function KitKatChromiumBasedWebViewStrategy() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    KitKatChromiumBasedWebViewStrategy.prototype.reformatInput = function () {
        var _this = this;
        setTimeout(function () {
            _super.prototype.reformatInput.call(_this);
        }, 0);
    };
    KitKatChromiumBasedWebViewStrategy.prototype.unformatInput = function () {
        var _this = this;
        setTimeout(function () {
            _super.prototype.unformatInput.call(_this);
        }, 0);
    };
    return KitKatChromiumBasedWebViewStrategy;
}(android_chrome_1.AndroidChromeStrategy));
exports.KitKatChromiumBasedWebViewStrategy = KitKatChromiumBasedWebViewStrategy;

},{"./android-chrome":25}],30:[function(_dereq_,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoopKeyboardStrategy = void 0;
var strategy_interface_1 = _dereq_("./strategy-interface");
var NoopKeyboardStrategy = /** @class */ (function (_super) {
    __extends(NoopKeyboardStrategy, _super);
    function NoopKeyboardStrategy() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoopKeyboardStrategy.prototype.getUnformattedValue = function () {
        return this.inputElement.value;
    };
    NoopKeyboardStrategy.prototype.setPattern = function () {
        // noop
    };
    return NoopKeyboardStrategy;
}(strategy_interface_1.StrategyInterface));
exports.NoopKeyboardStrategy = NoopKeyboardStrategy;

},{"./strategy-interface":31}],31:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategyInterface = void 0;
var StrategyInterface = /** @class */ (function () {
    function StrategyInterface(options) {
        this.inputElement = options.element;
        this.isFormatted = false;
    }
    return StrategyInterface;
}());
exports.StrategyInterface = StrategyInterface;

},{}],32:[function(_dereq_,module,exports){
"use strict";
var RestrictedInput = _dereq_("./lib/restricted-input");
module.exports = RestrictedInput;

},{"./lib/restricted-input":24}],33:[function(_dereq_,module,exports){
"use strict";
var device_1 = _dereq_("./lib/device");
module.exports = function supportsInputFormatting() {
    // Digits get dropped in samsung browser
    return !(0, device_1.isSamsungBrowser)();
};

},{"./lib/device":17}],34:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cardNumber = void 0;
var luhn10 = _dereq_("./luhn-10");
var getCardTypes = _dereq_("credit-card-type");
function verification(card, isPotentiallyValid, isValid) {
    return {
        card: card,
        isPotentiallyValid: isPotentiallyValid,
        isValid: isValid,
    };
}
function cardNumber(value, options) {
    if (options === void 0) { options = {}; }
    var isPotentiallyValid, isValid, maxLength;
    if (typeof value !== "string" && typeof value !== "number") {
        return verification(null, false, false);
    }
    var testCardValue = String(value).replace(/-|\s/g, "");
    if (!/^\d*$/.test(testCardValue)) {
        return verification(null, false, false);
    }
    var potentialTypes = getCardTypes(testCardValue);
    if (potentialTypes.length === 0) {
        return verification(null, false, false);
    }
    else if (potentialTypes.length !== 1) {
        return verification(null, true, false);
    }
    var cardType = potentialTypes[0];
    if (options.maxLength && testCardValue.length > options.maxLength) {
        return verification(cardType, false, false);
    }
    if (options.skipLuhnValidation === true ||
        (cardType.type === getCardTypes.types.UNIONPAY &&
            options.luhnValidateUnionPay !== true)) {
        isValid = true;
    }
    else {
        isValid = luhn10(testCardValue);
    }
    maxLength = Math.max.apply(null, cardType.lengths);
    if (options.maxLength) {
        maxLength = Math.min(options.maxLength, maxLength);
    }
    for (var i = 0; i < cardType.lengths.length; i++) {
        if (cardType.lengths[i] === testCardValue.length) {
            isPotentiallyValid = testCardValue.length < maxLength || isValid;
            return verification(cardType, isPotentiallyValid, isValid);
        }
    }
    return verification(cardType, testCardValue.length < maxLength, false);
}
exports.cardNumber = cardNumber;

},{"./luhn-10":43,"credit-card-type":45}],35:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cardholderName = void 0;
var CARD_NUMBER_REGEX = /^[\d\s-]*$/;
var MAX_LENGTH = 255;
function verification(isValid, isPotentiallyValid) {
    return { isValid: isValid, isPotentiallyValid: isPotentiallyValid };
}
function cardholderName(value) {
    if (typeof value !== "string") {
        return verification(false, false);
    }
    if (value.length === 0) {
        return verification(false, true);
    }
    if (value.length > MAX_LENGTH) {
        return verification(false, false);
    }
    if (CARD_NUMBER_REGEX.test(value)) {
        return verification(false, true);
    }
    return verification(true, true);
}
exports.cardholderName = cardholderName;

},{}],36:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cvv = void 0;
var DEFAULT_LENGTH = 3;
function includes(array, thing) {
    for (var i = 0; i < array.length; i++) {
        if (thing === array[i]) {
            return true;
        }
    }
    return false;
}
function max(array) {
    var maximum = DEFAULT_LENGTH;
    var i = 0;
    for (; i < array.length; i++) {
        maximum = array[i] > maximum ? array[i] : maximum;
    }
    return maximum;
}
function verification(isValid, isPotentiallyValid) {
    return { isValid: isValid, isPotentiallyValid: isPotentiallyValid };
}
function cvv(value, maxLength) {
    if (maxLength === void 0) { maxLength = DEFAULT_LENGTH; }
    maxLength = maxLength instanceof Array ? maxLength : [maxLength];
    if (typeof value !== "string") {
        return verification(false, false);
    }
    if (!/^\d*$/.test(value)) {
        return verification(false, false);
    }
    if (includes(maxLength, value.length)) {
        return verification(true, true);
    }
    if (value.length < Math.min.apply(null, maxLength)) {
        return verification(false, true);
    }
    if (value.length > max(maxLength)) {
        return verification(false, false);
    }
    return verification(true, true);
}
exports.cvv = cvv;

},{}],37:[function(_dereq_,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expirationDate = void 0;
var parse_date_1 = _dereq_("./lib/parse-date");
var expiration_month_1 = _dereq_("./expiration-month");
var expiration_year_1 = _dereq_("./expiration-year");
function verification(isValid, isPotentiallyValid, month, year) {
    return {
        isValid: isValid,
        isPotentiallyValid: isPotentiallyValid,
        month: month,
        year: year,
    };
}
function expirationDate(value, maxElapsedYear) {
    var date;
    if (typeof value === "string") {
        value = value.replace(/^(\d\d) (\d\d(\d\d)?)$/, "$1/$2");
        date = (0, parse_date_1.parseDate)(String(value));
    }
    else if (value !== null && typeof value === "object") {
        var fullDate = __assign({}, value);
        date = {
            month: String(fullDate.month),
            year: String(fullDate.year),
        };
    }
    else {
        return verification(false, false, null, null);
    }
    var monthValid = (0, expiration_month_1.expirationMonth)(date.month);
    var yearValid = (0, expiration_year_1.expirationYear)(date.year, maxElapsedYear);
    if (monthValid.isValid) {
        if (yearValid.isCurrentYear) {
            var isValidForThisYear = monthValid.isValidForThisYear;
            return verification(isValidForThisYear, isValidForThisYear, date.month, date.year);
        }
        if (yearValid.isValid) {
            return verification(true, true, date.month, date.year);
        }
    }
    if (monthValid.isPotentiallyValid && yearValid.isPotentiallyValid) {
        return verification(false, true, null, null);
    }
    return verification(false, false, null, null);
}
exports.expirationDate = expirationDate;

},{"./expiration-month":38,"./expiration-year":39,"./lib/parse-date":42}],38:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expirationMonth = void 0;
function verification(isValid, isPotentiallyValid, isValidForThisYear) {
    return {
        isValid: isValid,
        isPotentiallyValid: isPotentiallyValid,
        isValidForThisYear: isValidForThisYear || false,
    };
}
function expirationMonth(value) {
    var currentMonth = new Date().getMonth() + 1;
    if (typeof value !== "string") {
        return verification(false, false);
    }
    if (value.replace(/\s/g, "") === "" || value === "0") {
        return verification(false, true);
    }
    if (!/^\d*$/.test(value)) {
        return verification(false, false);
    }
    var month = parseInt(value, 10);
    if (isNaN(Number(value))) {
        return verification(false, false);
    }
    var result = month > 0 && month < 13;
    return verification(result, result, result && month >= currentMonth);
}
exports.expirationMonth = expirationMonth;

},{}],39:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expirationYear = void 0;
var DEFAULT_VALID_NUMBER_OF_YEARS_IN_THE_FUTURE = 19;
function verification(isValid, isPotentiallyValid, isCurrentYear) {
    return {
        isValid: isValid,
        isPotentiallyValid: isPotentiallyValid,
        isCurrentYear: isCurrentYear || false,
    };
}
function expirationYear(value, maxElapsedYear) {
    if (maxElapsedYear === void 0) { maxElapsedYear = DEFAULT_VALID_NUMBER_OF_YEARS_IN_THE_FUTURE; }
    var isCurrentYear;
    if (typeof value !== "string") {
        return verification(false, false);
    }
    if (value.replace(/\s/g, "") === "") {
        return verification(false, true);
    }
    if (!/^\d*$/.test(value)) {
        return verification(false, false);
    }
    var len = value.length;
    if (len < 2) {
        return verification(false, true);
    }
    var currentYear = new Date().getFullYear();
    if (len === 3) {
        // 20x === 20x
        var firstTwo = value.slice(0, 2);
        var currentFirstTwo = String(currentYear).slice(0, 2);
        return verification(false, firstTwo === currentFirstTwo);
    }
    if (len > 4) {
        return verification(false, false);
    }
    var numericValue = parseInt(value, 10);
    var twoDigitYear = Number(String(currentYear).substr(2, 2));
    var valid = false;
    if (len === 2) {
        if (String(currentYear).substr(0, 2) === value) {
            return verification(false, true);
        }
        isCurrentYear = twoDigitYear === numericValue;
        valid =
            numericValue >= twoDigitYear &&
                numericValue <= twoDigitYear + maxElapsedYear;
    }
    else if (len === 4) {
        isCurrentYear = currentYear === numericValue;
        valid =
            numericValue >= currentYear &&
                numericValue <= currentYear + maxElapsedYear;
    }
    return verification(valid, valid, isCurrentYear);
}
exports.expirationYear = expirationYear;

},{}],40:[function(_dereq_,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var creditCardType = __importStar(_dereq_("credit-card-type"));
var cardholder_name_1 = _dereq_("./cardholder-name");
var card_number_1 = _dereq_("./card-number");
var expiration_date_1 = _dereq_("./expiration-date");
var expiration_month_1 = _dereq_("./expiration-month");
var expiration_year_1 = _dereq_("./expiration-year");
var cvv_1 = _dereq_("./cvv");
var postal_code_1 = _dereq_("./postal-code");
var cardValidator = {
    creditCardType: creditCardType,
    cardholderName: cardholder_name_1.cardholderName,
    number: card_number_1.cardNumber,
    expirationDate: expiration_date_1.expirationDate,
    expirationMonth: expiration_month_1.expirationMonth,
    expirationYear: expiration_year_1.expirationYear,
    cvv: cvv_1.cvv,
    postalCode: postal_code_1.postalCode,
};
module.exports = cardValidator;

},{"./card-number":34,"./cardholder-name":35,"./cvv":36,"./expiration-date":37,"./expiration-month":38,"./expiration-year":39,"./postal-code":44,"credit-card-type":45}],41:[function(_dereq_,module,exports){
"use strict";
// Polyfill taken from <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray#Polyfill>.
Object.defineProperty(exports, "__esModule", { value: true });
exports.isArray = void 0;
exports.isArray = Array.isArray ||
    function (arg) {
        return Object.prototype.toString.call(arg) === "[object Array]";
    };

},{}],42:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDate = void 0;
var expiration_year_1 = _dereq_("../expiration-year");
var is_array_1 = _dereq_("./is-array");
function getNumberOfMonthDigitsInDateString(dateString) {
    var firstCharacter = Number(dateString[0]);
    var assumedYear;
    /*
      if the first character in the string starts with `0`,
      we know that the month will be 2 digits.
  
      '0122' => {month: '01', year: '22'}
    */
    if (firstCharacter === 0) {
        return 2;
    }
    /*
      if the first character in the string starts with
      number greater than 1, it must be a 1 digit month
  
      '322' => {month: '3', year: '22'}
    */
    if (firstCharacter > 1) {
        return 1;
    }
    /*
      if the first 2 characters make up a number between
      13-19, we know that the month portion must be 1
  
      '139' => {month: '1', year: '39'}
    */
    if (firstCharacter === 1 && Number(dateString[1]) > 2) {
        return 1;
    }
    /*
      if the first 2 characters make up a number between
      10-12, we check if the year portion would be considered
      valid if we assumed that the month was 1. If it is
      not potentially valid, we assume the month must have
      2 digits.
  
      '109' => {month: '10', year: '9'}
      '120' => {month: '1', year: '20'} // when checked in the year 2019
      '120' => {month: '12', year: '0'} // when checked in the year 2021
    */
    if (firstCharacter === 1) {
        assumedYear = dateString.substr(1);
        return (0, expiration_year_1.expirationYear)(assumedYear).isPotentiallyValid ? 1 : 2;
    }
    /*
      If the length of the value is exactly 5 characters,
      we assume a full year was passed in, meaning the remaining
      single leading digit must be the month value.
  
      '12202' => {month: '1', year: '2202'}
    */
    if (dateString.length === 5) {
        return 1;
    }
    /*
      If the length of the value is more than five characters,
      we assume a full year was passed in addition to the month
      and therefore the month portion must be 2 digits.
  
      '112020' => {month: '11', year: '2020'}
    */
    if (dateString.length > 5) {
        return 2;
    }
    /*
      By default, the month value is the first value
    */
    return 1;
}
function parseDate(datestring) {
    var date;
    if (/^\d{4}-\d{1,2}$/.test(datestring)) {
        date = datestring.split("-").reverse();
    }
    else if (/\//.test(datestring)) {
        date = datestring.split(/\s*\/\s*/g);
    }
    else if (/\s/.test(datestring)) {
        date = datestring.split(/ +/g);
    }
    if ((0, is_array_1.isArray)(date)) {
        return {
            month: date[0] || "",
            year: date.slice(1).join(),
        };
    }
    var numberOfDigitsInMonth = getNumberOfMonthDigitsInDateString(datestring);
    var month = datestring.substr(0, numberOfDigitsInMonth);
    return {
        month: month,
        year: datestring.substr(month.length),
    };
}
exports.parseDate = parseDate;

},{"../expiration-year":39,"./is-array":41}],43:[function(_dereq_,module,exports){
/* eslint-disable */
/*
 * Luhn algorithm implementation in JavaScript
 * Copyright (c) 2009 Nicholas C. Zakas
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
"use strict";
function luhn10(identifier) {
    var sum = 0;
    var alt = false;
    var i = identifier.length - 1;
    var num;
    while (i >= 0) {
        num = parseInt(identifier.charAt(i), 10);
        if (alt) {
            num *= 2;
            if (num > 9) {
                num = (num % 10) + 1; // eslint-disable-line no-extra-parens
            }
        }
        alt = !alt;
        sum += num;
        i--;
    }
    return sum % 10 === 0;
}
module.exports = luhn10;

},{}],44:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postalCode = void 0;
var DEFAULT_MIN_POSTAL_CODE_LENGTH = 3;
function verification(isValid, isPotentiallyValid) {
    return { isValid: isValid, isPotentiallyValid: isPotentiallyValid };
}
function postalCode(value, options) {
    if (options === void 0) { options = {}; }
    var minLength = options.minLength || DEFAULT_MIN_POSTAL_CODE_LENGTH;
    if (typeof value !== "string") {
        return verification(false, false);
    }
    else if (value.length < minLength) {
        return verification(false, true);
    }
    return verification(true, true);
}
exports.postalCode = postalCode;

},{}],45:[function(_dereq_,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var cardTypes = _dereq_("./lib/card-types");
var add_matching_cards_to_results_1 = _dereq_("./lib/add-matching-cards-to-results");
var is_valid_input_type_1 = _dereq_("./lib/is-valid-input-type");
var find_best_match_1 = _dereq_("./lib/find-best-match");
var clone_1 = _dereq_("./lib/clone");
var customCards = {};
var cardNames = {
    VISA: "visa",
    MASTERCARD: "mastercard",
    AMERICAN_EXPRESS: "american-express",
    DINERS_CLUB: "diners-club",
    DISCOVER: "discover",
    JCB: "jcb",
    UNIONPAY: "unionpay",
    MAESTRO: "maestro",
    ELO: "elo",
    MIR: "mir",
    HIPER: "hiper",
    HIPERCARD: "hipercard",
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
    cardNames.HIPERCARD,
];
var testOrder = clone_1.clone(ORIGINAL_TEST_ORDER);
function findType(cardType) {
    return customCards[cardType] || cardTypes[cardType];
}
function getAllCardTypes() {
    return testOrder.map(function (cardType) { return clone_1.clone(findType(cardType)); });
}
function getCardPosition(name, ignoreErrorForNotExisting) {
    if (ignoreErrorForNotExisting === void 0) { ignoreErrorForNotExisting = false; }
    var position = testOrder.indexOf(name);
    if (!ignoreErrorForNotExisting && position === -1) {
        throw new Error('"' + name + '" is not a supported card type.');
    }
    return position;
}
function creditCardType(cardNumber) {
    var results = [];
    if (!is_valid_input_type_1.isValidInputType(cardNumber)) {
        return results;
    }
    if (cardNumber.length === 0) {
        return getAllCardTypes();
    }
    testOrder.forEach(function (cardType) {
        var cardConfiguration = findType(cardType);
        add_matching_cards_to_results_1.addMatchingCardsToResults(cardNumber, cardConfiguration, results);
    });
    var bestMatch = find_best_match_1.findBestMatch(results);
    if (bestMatch) {
        return [bestMatch];
    }
    return results;
}
creditCardType.getTypeInfo = function (cardType) {
    return clone_1.clone(findType(cardType));
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
    var originalObject = customCards[cardType] || cardTypes[cardType];
    if (!originalObject) {
        throw new Error("\"" + cardType + "\" is not a recognized type. Use `addCard` instead.'");
    }
    if (updates.type && originalObject.type !== updates.type) {
        throw new Error("Cannot overwrite type parameter.");
    }
    var clonedCard = clone_1.clone(originalObject);
    clonedCard = __assign(__assign({}, clonedCard), updates);
    customCards[clonedCard.type] = clonedCard;
};
creditCardType.changeOrder = function (name, position) {
    var currentPosition = getCardPosition(name);
    testOrder.splice(currentPosition, 1);
    testOrder.splice(position, 0, name);
};
creditCardType.resetModifications = function () {
    testOrder = clone_1.clone(ORIGINAL_TEST_ORDER);
    customCards = {};
};
creditCardType.types = cardNames;
module.exports = creditCardType;

},{"./lib/add-matching-cards-to-results":46,"./lib/card-types":47,"./lib/clone":48,"./lib/find-best-match":49,"./lib/is-valid-input-type":50}],46:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMatchingCardsToResults = void 0;
var clone_1 = _dereq_("./clone");
var matches_1 = _dereq_("./matches");
function addMatchingCardsToResults(cardNumber, cardConfiguration, results) {
    var i, patternLength;
    for (i = 0; i < cardConfiguration.patterns.length; i++) {
        var pattern = cardConfiguration.patterns[i];
        if (!matches_1.matches(cardNumber, pattern)) {
            continue;
        }
        var clonedCardConfiguration = clone_1.clone(cardConfiguration);
        if (Array.isArray(pattern)) {
            patternLength = String(pattern[0]).length;
        }
        else {
            patternLength = String(pattern).length;
        }
        if (cardNumber.length >= patternLength) {
            clonedCardConfiguration.matchStrength = patternLength;
        }
        results.push(clonedCardConfiguration);
        break;
    }
}
exports.addMatchingCardsToResults = addMatchingCardsToResults;

},{"./clone":48,"./matches":51}],47:[function(_dereq_,module,exports){
"use strict";
var cardTypes = {
    visa: {
        niceType: "Visa",
        type: "visa",
        patterns: [4],
        gaps: [4, 8, 12],
        lengths: [16, 18, 19],
        code: {
            name: "CVV",
            size: 3,
        },
    },
    mastercard: {
        niceType: "Mastercard",
        type: "mastercard",
        patterns: [[51, 55], [2221, 2229], [223, 229], [23, 26], [270, 271], 2720],
        gaps: [4, 8, 12],
        lengths: [16],
        code: {
            name: "CVC",
            size: 3,
        },
    },
    "american-express": {
        niceType: "American Express",
        type: "american-express",
        patterns: [34, 37],
        gaps: [4, 10],
        lengths: [15],
        code: {
            name: "CID",
            size: 4,
        },
    },
    "diners-club": {
        niceType: "Diners Club",
        type: "diners-club",
        patterns: [[300, 305], 36, 38, 39],
        gaps: [4, 10],
        lengths: [14, 16, 19],
        code: {
            name: "CVV",
            size: 3,
        },
    },
    discover: {
        niceType: "Discover",
        type: "discover",
        patterns: [6011, [644, 649], 65],
        gaps: [4, 8, 12],
        lengths: [16, 19],
        code: {
            name: "CID",
            size: 3,
        },
    },
    jcb: {
        niceType: "JCB",
        type: "jcb",
        patterns: [2131, 1800, [3528, 3589]],
        gaps: [4, 8, 12],
        lengths: [16, 17, 18, 19],
        code: {
            name: "CVV",
            size: 3,
        },
    },
    unionpay: {
        niceType: "UnionPay",
        type: "unionpay",
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
            [8164, 8171],
        ],
        gaps: [4, 8, 12],
        lengths: [14, 15, 16, 17, 18, 19],
        code: {
            name: "CVN",
            size: 3,
        },
    },
    maestro: {
        niceType: "Maestro",
        type: "maestro",
        patterns: [
            493698,
            [500000, 504174],
            [504176, 506698],
            [506779, 508999],
            [56, 59],
            63,
            67,
            6,
        ],
        gaps: [4, 8, 12],
        lengths: [12, 13, 14, 15, 16, 17, 18, 19],
        code: {
            name: "CVC",
            size: 3,
        },
    },
    elo: {
        niceType: "Elo",
        type: "elo",
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
            [655021, 655058],
        ],
        gaps: [4, 8, 12],
        lengths: [16],
        code: {
            name: "CVE",
            size: 3,
        },
    },
    mir: {
        niceType: "Mir",
        type: "mir",
        patterns: [[2200, 2204]],
        gaps: [4, 8, 12],
        lengths: [16, 17, 18, 19],
        code: {
            name: "CVP2",
            size: 3,
        },
    },
    hiper: {
        niceType: "Hiper",
        type: "hiper",
        patterns: [637095, 63737423, 63743358, 637568, 637599, 637609, 637612],
        gaps: [4, 8, 12],
        lengths: [16],
        code: {
            name: "CVC",
            size: 3,
        },
    },
    hipercard: {
        niceType: "Hipercard",
        type: "hipercard",
        patterns: [606282],
        gaps: [4, 8, 12],
        lengths: [16],
        code: {
            name: "CVC",
            size: 3,
        },
    },
};
module.exports = cardTypes;

},{}],48:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clone = void 0;
function clone(originalObject) {
    if (!originalObject) {
        return null;
    }
    return JSON.parse(JSON.stringify(originalObject));
}
exports.clone = clone;

},{}],49:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findBestMatch = void 0;
function hasEnoughResultsToDetermineBestMatch(results) {
    var numberOfResultsWithMaxStrengthProperty = results.filter(function (result) { return result.matchStrength; }).length;
    /*
     * if all possible results have a maxStrength property that means the card
     * number is sufficiently long enough to determine conclusively what the card
     * type is
     * */
    return (numberOfResultsWithMaxStrengthProperty > 0 &&
        numberOfResultsWithMaxStrengthProperty === results.length);
}
function findBestMatch(results) {
    if (!hasEnoughResultsToDetermineBestMatch(results)) {
        return null;
    }
    return results.reduce(function (bestMatch, result) {
        if (!bestMatch) {
            return result;
        }
        /*
         * If the current best match pattern is less specific than this result, set
         * the result as the new best match
         * */
        if (Number(bestMatch.matchStrength) < Number(result.matchStrength)) {
            return result;
        }
        return bestMatch;
    });
}
exports.findBestMatch = findBestMatch;

},{}],50:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidInputType = void 0;
function isValidInputType(cardNumber) {
    return typeof cardNumber === "string" || cardNumber instanceof String;
}
exports.isValidInputType = isValidInputType;

},{}],51:[function(_dereq_,module,exports){
"use strict";
/*
 * Adapted from https://github.com/polvo-labs/card-type/blob/aaab11f80fa1939bccc8f24905a06ae3cd864356/src/cardType.js#L37-L42
 * */
Object.defineProperty(exports, "__esModule", { value: true });
exports.matches = void 0;
function matchesRange(cardNumber, min, max) {
    var maxLengthToCheck = String(min).length;
    var substr = cardNumber.substr(0, maxLengthToCheck);
    var integerRepresentationOfCardNumber = parseInt(substr, 10);
    min = parseInt(String(min).substr(0, substr.length), 10);
    max = parseInt(String(max).substr(0, substr.length), 10);
    return (integerRepresentationOfCardNumber >= min &&
        integerRepresentationOfCardNumber <= max);
}
function matchesPattern(cardNumber, pattern) {
    pattern = String(pattern);
    return (pattern.substring(0, cardNumber.length) ===
        cardNumber.substring(0, pattern.length));
}
function matches(cardNumber, pattern) {
    if (Array.isArray(pattern)) {
        return matchesRange(cardNumber, pattern[0], pattern[1]);
    }
    return matchesPattern(cardNumber, pattern);
}
exports.matches = matches;

},{}],52:[function(_dereq_,module,exports){
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

},{"./lib/add-matching-cards-to-results":53,"./lib/card-types":54,"./lib/clone":55,"./lib/find-best-match":56,"./lib/is-valid-input-type":57}],53:[function(_dereq_,module,exports){
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

},{"./clone":55,"./matches":58}],54:[function(_dereq_,module,exports){
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

},{}],55:[function(_dereq_,module,exports){
'use strict';

function clone(originalObject) {
  var dupe;

  if (!originalObject) { return null; }

  dupe = JSON.parse(JSON.stringify(originalObject));

  return dupe;
}

module.exports = clone;

},{}],56:[function(_dereq_,module,exports){
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

},{}],57:[function(_dereq_,module,exports){
'use strict';

function isValidInputType(cardNumber) {
  return typeof cardNumber === 'string' || cardNumber instanceof String;
}

module.exports = isValidInputType;

},{}],58:[function(_dereq_,module,exports){
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

},{}],59:[function(_dereq_,module,exports){
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

},{}],60:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.injectWithBlocklist = exports.injectWithAllowlist = void 0;
var inject_stylesheet_1 = _dereq_("./lib/inject-stylesheet");
function injectWithAllowlist(styles, list) {
    return inject_stylesheet_1.injectStylesheet(styles, list, true);
}
exports.injectWithAllowlist = injectWithAllowlist;
function injectWithBlocklist(styles, list) {
    return inject_stylesheet_1.injectStylesheet(styles, list, false);
}
exports.injectWithBlocklist = injectWithBlocklist;

},{"./lib/inject-stylesheet":63}],61:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterStyleKeys = void 0;
function filterStyleKeys(styleObject, propertyList, isAllowlist) {
    if (propertyList === void 0) { propertyList = []; }
    var result = {};
    function allowlistFilter(key) {
        if (propertyList.indexOf(key) !== -1) {
            result[key] = styleObject[key];
        }
    }
    function blocklistFilter(key) {
        if (propertyList.indexOf(key) === -1) {
            result[key] = styleObject[key];
        }
    }
    if (isAllowlist) {
        Object.keys(styleObject).forEach(allowlistFilter);
    }
    else {
        Object.keys(styleObject).forEach(blocklistFilter);
    }
    return result;
}
exports.filterStyleKeys = filterStyleKeys;

},{}],62:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterStyleValues = void 0;
var valueFilters = [/;/, /@import/i, /expression/i, /url/i, /javascript/i];
function htmlEscape(html) {
    return String(html)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}
function filterStyleValues(dirty) {
    if (dirty === void 0) { dirty = {}; }
    var clean = {};
    Object.keys(dirty).forEach(function (key) {
        var value = dirty[key];
        var unsanitary = valueFilters.some(function (regex) { return regex.test(String(value)); });
        if (unsanitary)
            return;
        clean[key] = htmlEscape(dirty[key]);
    });
    return clean;
}
exports.filterStyleValues = filterStyleValues;

},{}],63:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.injectStylesheet = void 0;
var validate_selector_1 = _dereq_("./validate-selector");
var filter_style_keys_1 = _dereq_("./filter-style-keys");
var filter_style_values_1 = _dereq_("./filter-style-values");
function isSelectorMediaQuery(selector) {
    return /^@media\s+/i.test(selector);
}
function buildRule(selector, styles, curriedKeysFilter) {
    if (styles === void 0) { styles = {}; }
    var result;
    var constructedRule = selector + "{";
    if (isSelectorMediaQuery(selector)) {
        Object.keys(styles).forEach(function (innerSelector) {
            if (!validate_selector_1.validateSelector(innerSelector)) {
                return;
            }
            constructedRule += buildRule(innerSelector, styles[innerSelector], curriedKeysFilter);
        });
    }
    else {
        result = curriedKeysFilter(styles);
        var sanitized_1 = filter_style_values_1.filterStyleValues(result);
        Object.keys(sanitized_1).forEach(function (rule) {
            constructedRule += rule + ":" + sanitized_1[rule] + ";";
        });
    }
    constructedRule += "}";
    return constructedRule;
}
function injectStylesheet(styles, propertyList, isAllowlist) {
    if (styles === void 0) { styles = {}; }
    if (propertyList === void 0) { propertyList = []; }
    var position = 0;
    var styleElement = document.createElement("style");
    document.querySelector("head").appendChild(styleElement);
    var stylesheet = styleElement.sheet;
    function curriedKeysFilter(styleObject) {
        return filter_style_keys_1.filterStyleKeys(styleObject, propertyList, isAllowlist);
    }
    Object.keys(styles).forEach(function (selector) {
        if (!validate_selector_1.validateSelector(selector)) {
            return;
        }
        var constructedRule = buildRule(selector, styles[selector], curriedKeysFilter);
        try {
            if (stylesheet.insertRule) {
                stylesheet.insertRule(constructedRule, position);
            }
            else {
                stylesheet.addRule(selector, constructedRule.replace(/^[^{]+/, "").replace(/[{}]/g, ""), position);
            }
            position++;
        }
        catch (err) {
            if (!(err instanceof SyntaxError || err instanceof DOMException)) {
                throw err;
            }
        }
    });
    return styleElement;
}
exports.injectStylesheet = injectStylesheet;

},{"./filter-style-keys":61,"./filter-style-values":62,"./validate-selector":64}],64:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSelector = void 0;
function validateSelector(selector) {
    if (selector.trim().length === 0) {
        return false;
    }
    if (/supports/i.test(selector)) {
        return false;
    }
    if (/import/i.test(selector)) {
        return false;
    }
    if (/[{}]/.test(selector)) {
        return false;
    }
    return !/</.test(selector);
}
exports.validateSelector = validateSelector;

},{}],65:[function(_dereq_,module,exports){
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

},{"../lib/add-metadata":101,"../lib/assign":103,"../lib/constants":109,"../lib/convert-to-seamlesspay-error":110,"../lib/errors":113,"../lib/is-whitelisted-domain":117,"../lib/promise":119,"../lib/seamlesspay-error":122,"./constants":66,"./errors":67,"./request":70}],66:[function(_dereq_,module,exports){
'use strict';

module.exports = {
  SEAMLESSPAY_API_VERSION_HEADER: 'v2020'
};

},{}],67:[function(_dereq_,module,exports){
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

},{"../lib/seamlesspay-error":122}],68:[function(_dereq_,module,exports){
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

},{"../../lib/assign":103,"../../lib/querystring":120,"./parse-body":73,"./prep-body":74}],69:[function(_dereq_,module,exports){
(function (global){(function (){
'use strict';

module.exports = function getUserAgent() {
  return global.navigator.userAgent;
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],70:[function(_dereq_,module,exports){
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

},{"../../lib/once":118,"./ajax-driver":68,"./get-user-agent":69,"./is-http":71,"./jsonp-driver":72}],71:[function(_dereq_,module,exports){
(function (global){(function (){
'use strict';

module.exports = function () {
  return global.location.protocol === 'http:';
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],72:[function(_dereq_,module,exports){
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

},{"../../lib/querystring":120,"../../lib/uuid":123}],73:[function(_dereq_,module,exports){
'use strict';

module.exports = function (body) {
  try {
    body = JSON.parse(body);
  } catch (e) { /* ignored */ }

  return body;
};

},{}],74:[function(_dereq_,module,exports){
'use strict';

module.exports = function (method, body) {
  if (String(method).toLowerCase() !== 'get' && body != null) {
    body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  return body;
};

},{}],75:[function(_dereq_,module,exports){
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

},{"../../lib/seamlesspay-error":122,"../shared/constants":98,"../shared/errors":99}],76:[function(_dereq_,module,exports){
'use strict';

var constants = _dereq_('./../../shared/constants');
var BaseInput = _dereq_('./base-input').BaseInput;

var GIFT_CARD = constants.paymentTypes.PAYMENT_TYPE_GIFT_CARD;
var ACH = constants.paymentTypes.PAYMENT_TYPE_ACH;
var GIFT_CARD_MAX_LENGTH = constants.GIFT_CARD_MAX_LENGTH;
var PATTERN_CACHE = {};
var ACH_PATTERN_CACHE = {};

function _generateAchPattern(length) {
  return ['{{', Array(length).fill('9').join(''), '}}'].join('');
}

function _getAchPattern(length) {
  if (!(length in ACH_PATTERN_CACHE)) {
    ACH_PATTERN_CACHE[length] = _generateAchPattern(length);
  }
  return ACH_PATTERN_CACHE[length];
}

function _generatePattern(card, paymentType) {
  var i, pattern;
  var gaps = [4, 8, 12];
  var length = 16;
  var type = 'unknown';

  if (paymentType === GIFT_CARD) {
    gaps.push(16);
    length = GIFT_CARD_MAX_LENGTH;
  } else if (card) {
    length = Math.max.apply(null, card.lengths);
    gaps = card.gaps;
    type = card.type;
  }

  if (type in PATTERN_CACHE) {
    return PATTERN_CACHE[type];
  }

  pattern = '{{';

  for (i = 0; i < length; i++) {
    if (gaps.indexOf(i) !== -1) {
      pattern += '}} {{';
    }

    pattern += '9';
  }

  PATTERN_CACHE[type] = pattern + '}}';
  return PATTERN_CACHE[type];
}

function AccountNumberInput() {

  BaseInput.apply(this, arguments);

  var DEFAULT_MAX_LENGTH = this.maxLength;
  var paymentType = this.model.getPaymentType();

  if (paymentType === ACH) {
    this.setPattern(_getAchPattern(DEFAULT_MAX_LENGTH));

    return;
  }

  this.setPattern(_generatePattern('', paymentType));

  this.model.on('change:possibleCardTypes', function (possibleCardTypes) {
    var card;
    var maxLength = paymentType === GIFT_CARD ? GIFT_CARD_MAX_LENGTH : DEFAULT_MAX_LENGTH;

    if (possibleCardTypes.length === 1) {
      card = possibleCardTypes[0];
      maxLength = Math.max.apply(null, card.lengths) + card.gaps.length;
    }

    this.setPattern(_generatePattern(card, paymentType));
    this.updateModel('value', this.formatter.getUnformattedValue());
    this.maxLength = maxLength;

    this.render();
  }.bind(this));

  this.model.on('change:accountNumber.value', function (value) {
    if (/SamsungBrowser/i.test(navigator.userAgent)) {
      var cardNumberRE = /[^0-9\s]/g;
      this.element.value = this.element.value.replace(cardNumberRE, '');
      this.updateModel('value', value.replace(cardNumberRE, ''));
    }
  }.bind(this));
}

AccountNumberInput.prototype = Object.create(BaseInput.prototype);
AccountNumberInput.prototype.constructor = AccountNumberInput;

module.exports = {
  AccountNumberInput: AccountNumberInput
};

},{"./../../shared/constants":98,"./base-input":77}],77:[function(_dereq_,module,exports){
(function (global){(function (){
'use strict';

var attributeValidationError = _dereq_('../../external/attribute-validation-error');
var constants = _dereq_('../../shared/constants');
var classlist = _dereq_('../../../lib/classlist');
var createRestrictedInput = _dereq_('../../../lib/create-restricted-input');

var events = constants.events;
var ENTER_KEY_CODE = 13;
var DEFAULT_MASK_CHARACTER = '•';

function BaseInput(options) {
  var shouldFormat, config;

  this.model = options.model;
  this.type = options.type;
  this.maxLength = !this.maxLength ? this.model.getMaxLength(this.type) : this.maxLength;

  config = this.getConfiguration();

  this.element = this.constructElement();

  this.pattern = ' ';
  this.hiddenMaskedValue = '';
  this.shouldMask = Boolean(config.maskInput);
  this.maskCharacter = config.maskInput && config.maskInput.character || DEFAULT_MASK_CHARACTER;

  shouldFormat = config.formatInput !== false && this.element instanceof HTMLInputElement;
  this.formatter = createRestrictedInput({
    shouldFormat: shouldFormat,
    element: this.element,
    pattern: this.pattern
  });

  this.addDOMEventListeners();
  this.addModelEventListeners();
  this.addBusEventListeners();
  this.render();

  this.model.setupComponent(this.type, this);
}

BaseInput.prototype.getConfiguration = function () {
  return this.model.configuration.fields[this.type];
};

BaseInput.prototype.updateModel = function (key, value) {
  this.model.set(this.type + '.' + key, value);
};

BaseInput.prototype.modelOnChange = function (property, callback) {
  var eventPrefix = 'change:' + this.type;
  var self = this;

  this.model.on(eventPrefix + '.' + property, function () {
    callback.apply(self, arguments);
  });
};

BaseInput.prototype.constructElement = function () {
  var type = this.type;
  var inputType = this.getConfiguration().type || 'tel';

  var element = document.createElement('input');

  var placeholder = this.getConfiguration().placeholder;
  var whitelistedFields = this.model.getWhitelistedFields();
  var name = whitelistedFields[type] ? whitelistedFields[type].name : null;

  var attributes = {
    type: inputType,
    autocomplete: constants.autocompleteMappings[name] || 'off',
    autocorrect: 'off',
    autocapitalize: 'none',
    spellcheck: 'false',
    'class': type,
    'data-seamlesspay-name': type,
    name: name,
    id: name
  };

  if (this.maxLength) {
    attributes.maxlength = this.maxLength;
  }

  if (placeholder) {
    attributes.placeholder = placeholder;
  }

  Object.keys(attributes).forEach(function (attr) {
    element.setAttribute(attr, attributes[attr]);
  });

  return element;
};

BaseInput.prototype.getUnformattedValue = function () {
  return this.formatter.getUnformattedValue();
};

BaseInput.prototype.addDOMEventListeners = function () {
  this._addDOMFocusListeners();
  this._addDOMInputListeners();
  this._addDOMKeypressListeners();
};

BaseInput.prototype.maskValue = function (value) {
  value = value || this.element.value;

  this.hiddenMaskedValue = value;
  this.element.value = value.replace(/[^\s\/\-]/g, this.maskCharacter); // eslint-disable-line no-useless-escape
};

BaseInput.prototype.unmaskValue = function () {
  this.element.value = this.hiddenMaskedValue;
};

BaseInput.prototype._addDOMKeypressListeners = function () {
  this.element.addEventListener('keypress', function (event) {
    if (event.keyCode === ENTER_KEY_CODE) {
      this.model.emitEvent(this.type, 'inputSubmitRequest');
    }
  }.bind(this), false);
};

BaseInput.prototype._addDOMInputListeners = function () {
  this.element.addEventListener('input', function () {
    this.updateModel('value', this.getUnformattedValue());
  }.bind(this), false);
};

BaseInput.prototype._addDOMFocusListeners = function () {
  var element = this.element;

  if ('onfocusin' in document) {
    document.documentElement.addEventListener('focusin', function (event) {
      if (event.fromElement === element) { return; }
      if (event.relatedTarget) { return; }

      element.focus();
    }, false);
  } else {
    document.addEventListener('focus', function () {
      element.focus();
    }, false);
  }

  global.addEventListener('focus', function () {
    if (this.shouldMask) {
      this.unmaskValue();
    }
    this.updateModel('isFocused', true);
  }.bind(this), false);

  global.addEventListener('blur', function () {
    if (this.shouldMask) {
      this.maskValue();
    }
    this.updateModel('isFocused', false);
  }.bind(this), false);

  element.addEventListener('touchstart', function () {
    element.select();
  });
};

BaseInput.prototype.addModelEventListeners = function () {
  this.modelOnChange('isValid', this.render);
  this.modelOnChange('isPotentiallyValid', this.render);
};

BaseInput.prototype.setPlaceholder = function (type, placeholder) {
  this.type.setAttribute(type, 'placeholder', placeholder);
};

BaseInput.prototype.setAttribute = function (type, attribute, value) {
  if (type === this.type && !attributeValidationError(attribute, value)) {
    this.element.setAttribute(attribute, value);
  }
};

BaseInput.prototype.setPattern = function (pattern) {
  if (pattern) this.pattern = pattern;
  this.formatter.setPattern(this.pattern);
};

BaseInput.prototype.removeAttribute = function (type, attribute) {
  if (type === this.type && !attributeValidationError(attribute)) {
    this.element.removeAttribute(attribute);
  }
};

BaseInput.prototype.addBusEventListeners = function () {
  global.bus.on(events.TRIGGER_INPUT_FOCUS, function (type) {
    if (type === this.type) { this.element.focus(); }
  }.bind(this));

  global.bus.on(events.SET_ATTRIBUTE, this.setAttribute.bind(this));
  global.bus.on(events.REMOVE_ATTRIBUTE, this.removeAttribute.bind(this));

  global.bus.on(events.ADD_CLASS, function (type, classname) {
    if (type === this.type) { classlist.add(this.element, classname); }
  }.bind(this));

  global.bus.on(events.REMOVE_CLASS, function (type, classname) {
    if (type === this.type) { classlist.remove(this.element, classname); }
  }.bind(this));

  global.bus.on(events.CLEAR_FIELD, function (type) {
    if (type === this.type) {
      this.element.value = '';
      this.hiddenMaskedValue = '';
      this.updateModel('value', '');
    }
  }.bind(this));
};

BaseInput.prototype.render = function () {
  var modelData = this.model.get(this.type);
  var isValid = modelData.isValid;
  var isPotentiallyValid = modelData.isPotentiallyValid;

  classlist.toggle(this.element, 'valid', isValid);
  classlist.toggle(this.element, 'invalid', !isPotentiallyValid);

  if (this.maxLength) {
    this.element.setAttribute('maxlength', this.maxLength);
  }
};

module.exports = {
  BaseInput: BaseInput
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../../lib/classlist":107,"../../../lib/create-restricted-input":111,"../../external/attribute-validation-error":75,"../../shared/constants":98}],78:[function(_dereq_,module,exports){
'use strict';
var constants = _dereq_('../../shared/constants');

var UNKNOWN_CARD_BRAND = 'unknown';
var cardBrandMap = constants.cardBrandMap;

function CardBrandIconComponent(options) {
  this.model = options.cardForm;
  this.element = this.constructElement();
  this.cardBrand = UNKNOWN_CARD_BRAND;

  this.addModelEventListeners();
  this.render(this.cardBrand);
}

CardBrandIconComponent.prototype.constructElement = function () {
  var cardBrandIconContainerElement = document.createElement('div');
  cardBrandIconContainerElement.className = 'card-brand-container';
  return cardBrandIconContainerElement;
}

CardBrandIconComponent.prototype.addModelEventListeners = function () {
  this.model.on('change:possibleCardTypes', function (cardTypes) {
    var accountNumber = this.model.get('accountNumber.value');
    if (cardTypes.length > 0 && accountNumber.length > 0) {
      this.cardBrand = cardBrandMap[cardTypes[0].type];
    } else {
      this.cardBrand = UNKNOWN_CARD_BRAND;
    }
    this.render(this.cardBrand);
  }.bind(this));
};

CardBrandIconComponent.prototype.render = function (cardBrand) {
  var cardBrandElement = document.createElement('img');

  cardBrandElement.setAttribute('role', 'presentation');
  cardBrandElement.setAttribute('src', 'img/' + cardBrand + '.svg');

  this.element.innerHTML = '';
  this.element.appendChild(cardBrandElement);
};

module.exports = {
  CardBrandIconComponent: CardBrandIconComponent
};

},{"../../shared/constants":98}],79:[function(_dereq_,module,exports){
'use strict';

var BaseInput = _dereq_('./base-input').BaseInput;
var PATTERN_CACHE = {};

function _generatePattern(length) {
  var i;
  var pattern = '{{';

  for (i = 0; i < length; i++) {
    pattern += '9';
  }

  return pattern + '}}';
}

function _getPattern(length) {
  if (!(length in PATTERN_CACHE)) {
    PATTERN_CACHE[length] = _generatePattern(length);
  }
  return PATTERN_CACHE[length];
}

function CVVInput() {
  var length;

  BaseInput.apply(this, arguments);

  var DEFAULT_MAX_LENGTH = this.maxLength;
  length = this.getConfiguration().maxlength;

  if (length && length < this.maxLength) {
    this.maxLength = length;
  } else {
    this.model.on('change:possibleCardTypes', function (possibleCardTypes) {
      this.maxLength = possibleCardTypes.reduce(function (accum, cardType) {
        return Math.max(accum, cardType.code.size);
      }, 0) || DEFAULT_MAX_LENGTH;

      this.model._validateField(this.type);

      if (this.shouldMask) {
        this.maskValue(this.hiddenMaskedValue.substring(0, this.maxLength));
        this.updateModel('value', this.hiddenMaskedValue);
      } else {
        this.updateModel('value', this.formatter.getUnformattedValue());
      }

      this.render();
    }.bind(this));
  }

  this.element.setAttribute('maxlength', this.maxLength);
  this.setPattern(_getPattern(this.maxLength));
}

CVVInput.prototype = Object.create(BaseInput.prototype);
CVVInput.prototype.constructor = CVVInput;

module.exports = {
  CVVInput: CVVInput
};

},{"./base-input":77}],80:[function(_dereq_,module,exports){
'use strict';

var BaseInput = _dereq_('./base-input').BaseInput;

var DEFAULT_PATTERN = '{{99}} / {{99}}';
var ZERO_PADDED_PATTERN = '0{{9}} / {{99}}';

function ExpirationDateInput() {

  BaseInput.apply(this, arguments);
  this.setPattern(DEFAULT_PATTERN);

  this.model.on('change:expDate.value', function (date) {
    if (date.length === 0 || date[0] === '0' || date[0] === '1') {
      this.setPattern(DEFAULT_PATTERN);
    } else {
      this.setPattern(ZERO_PADDED_PATTERN);
    }
  }.bind(this));
}

ExpirationDateInput.prototype = Object.create(BaseInput.prototype);
ExpirationDateInput.prototype.constructor = ExpirationDateInput;

ExpirationDateInput.prototype.getUnformattedValue = function () {
  var date, month, year;
  var value = this.formatter.getUnformattedValue();

  if (this.element.type === 'month') {
    date = value.split('-');
    month = date[1] || '';
    year = date[0] || '';
    value = month + year;
  }

  return value;
};

module.exports = {
  ExpirationDateInput: ExpirationDateInput
};

},{"./base-input":77}],81:[function(_dereq_,module,exports){
'use strict';

var InputComponents = _dereq_('./index');
var CardBrandIconComponent = _dereq_('./card-brand-icon').CardBrandIconComponent;
var LabelComponent = _dereq_('./label').LabelComponent;

module.exports = {
  FieldComponent: function FieldComponent(options) {
    var content;
    var type = options.type;
    var cardForm = options.cardForm;
    var whitelistedFields = cardForm.getWhitelistedFields();
    var attribution = whitelistedFields[type];

    this.element = document.createDocumentFragment();
    this.label = new LabelComponent(attribution);
    this.element.appendChild(this.label.element);

    this.input = new InputComponents[type]({
      model: cardForm,
      type: type
    });
    this.input.element.setAttribute('aria-describedby', 'field-description-' + type);

    if (type === 'accountNumber') {
      var containerElement = document.createElement('div');
      containerElement.className = 'account-number-container';
      this.cardBrandIcon = new CardBrandIconComponent({ cardForm: cardForm });
      containerElement.appendChild(this.input.element);
      containerElement.appendChild(this.cardBrandIcon.element);
      content = containerElement;
    } else {
      content = this.input.element;
    }

    this.element.appendChild(content);
  }
};

},{"./card-brand-icon":78,"./index":82,"./label":83}],82:[function(_dereq_,module,exports){
'use strict';

module.exports = {
  /*************************/
  /* TOKENIZER (PAN-VAULT) */
  /*************************/
  // Credit Card fields (paymentType=CREDIT):
  expDate: _dereq_('./expiration-date-input').ExpirationDateInput,

  // Common fields:
  accountNumber: _dereq_('./account-number-input').AccountNumberInput,
  verifyAccountNumber: _dereq_('./account-number-input').AccountNumberInput,
  postalCode: _dereq_('./postal-code-input').PostalCodeInput,
  cvv: _dereq_('./cvv-input').CVVInput,
  name: _dereq_('./name-input').NameInput
};

},{"./account-number-input":76,"./cvv-input":79,"./expiration-date-input":80,"./name-input":84,"./postal-code-input":85}],83:[function(_dereq_,module,exports){
'use strict';

function LabelComponent(options) {
  this.element = document.createElement('label');

  this.element.setAttribute('for', options.name);
  this.element.innerHTML = options.label;
}

module.exports = {
  LabelComponent: LabelComponent
};

},{}],84:[function(_dereq_,module,exports){
'use strict';

var BaseInput = _dereq_('./base-input').BaseInput;

function NameInput() {
  BaseInput.apply(this, arguments);
  this.setPattern('{{' + (new Array(this.maxLength + 1).join('*')) + '}}');
  this.element.setAttribute('type', 'text');
}

NameInput.prototype = Object.create(BaseInput.prototype);
NameInput.prototype.constructor = NameInput;

module.exports = {
  NameInput: NameInput
};

},{"./base-input":77}],85:[function(_dereq_,module,exports){
'use strict';

var BaseInput = _dereq_('./base-input').BaseInput;

function PostalCodeInput() {

  BaseInput.apply(this, arguments);

  var defaultValue = this.getConfiguration().defaultValue;
  var type = this.getConfiguration().type || 'text';
  if (defaultValue) {
    this.element.setAttribute('value', defaultValue);
  }

  this.setPattern('{{**********}}');
  this.element.setAttribute('type', type);
  this.element.addEventListener('touchstart', this.getForceNumericKeyboard(type), false);
}

PostalCodeInput.prototype = Object.create(BaseInput.prototype);
PostalCodeInput.prototype.constructor = PostalCodeInput;

PostalCodeInput.prototype.getForceNumericKeyboard = function (type) {
  return function (event) {
    var value = event.target.value;
    event.target.setAttribute('type', 'number');

    setTimeout(function() {
      event.target.setAttribute('type', type);
      event.target.value = value;
    }, 200);
  }
}

module.exports = {
  PostalCodeInput: PostalCodeInput
};

},{"./base-input":77}],86:[function(_dereq_,module,exports){
(function (global){(function (){
'use strict';

var assign = _dereq_('../../lib/assign').assign;
var Bus = _dereq_('../../lib/bus');
var frameName = _dereq_('../../lib/get-frame-name');
var assembleIFrames = _dereq_('../../lib/assemble-iframes');
var Client = _dereq_('../../client/client');
var injectWithAllowlist = _dereq_('inject-stylesheet').injectWithAllowlist;
var CreditCardForm = _dereq_('./models/credit-card-form').CreditCardForm;
var FieldComponent = _dereq_('./components/field-component').FieldComponent;
var SeamlesspayError = _dereq_('../../lib/seamlesspay-error');
var constants = _dereq_('../shared/constants');
var errors = _dereq_('../shared/errors');
var requestsSequence = _dereq_('../../lib/requests-sequence');

var events = constants.events;
var whitelistedStyles = constants.whitelistedStyles;
var requestTypes = constants.requestTypes;

var TIMEOUT_TO_ALLOW_SAFARI_TO_AUTOFILL = 5;

function initialize(cardForm) {
  var fieldComponent;
  var name = frameName.getFrameName('hosted-field');
  var form = document.createElement('form');

  var defaultStyles = {
    '.valid': { color: 'green' },
    '.invalid': { color: 'red' },
    '.potentially-valid': { color: 'black' },
  };

  form.setAttribute('novalidate', true);
  form.setAttribute('action', '#'); // Forms need an action in order to offer a "go" button on soft keyboard
  form.addEventListener('submit', function (event) {
    event.preventDefault();
  });

  injectWithAllowlist(
    Object.assign(defaultStyles, cardForm.configuration.styles),
    whitelistedStyles
  );

  fieldComponent = new FieldComponent({
    cardForm: cardForm,
    type: name
  });

  form.appendChild(fieldComponent.element);
  if (name === 'accountNumber') {
    createInputsForAutofill(form);
  }

  global.bus.on(events.AUTOFILL_EXPIRATION_DATE, autofillHandler(fieldComponent));

  document.body.appendChild(form);
  shimPlaceholder();
}

function makeMockInput(name) {
  var fragment = document.createDocumentFragment();
  var label = document.createElement('label');
  var input = document.createElement('input');

  label.setAttribute('for', name + '-autofill-field');
  label.textContent = name;

  input.id = name + '-autofill-field';
  input.className = 'autofill-field';
  input.type = 'text';
  input.name = name;
  input.setAttribute('tabindex', -1);
  input.setAttribute('autocomplete', constants.autocompleteMappings[name]);

  fragment.appendChild(label);
  fragment.appendChild(input);

  return fragment;
}

function fix1PasswordAdjustment(form) {
  // 1Password autofill throws the form
  // positioning off screen. By toggling
  // the position, we can prevent the number
  // field from dissapearing
  form.style.position = 'relative';
  form.style.position = 'absolute';
}

function createInputsForAutofill(form) {
  var expDate = makeMockInput('exp-date');
  var cvv = makeMockInput('cvv');
  var expDateInput = expDate.querySelector('input');
  var cvvInput = cvv.querySelector('input');

  expDateInput.addEventListener('keydown', function () {
    setTimeout(function () {
      fix1PasswordAdjustment(form);
      global.bus.emit(events.AUTOFILL_EXPIRATION_DATE, {
        expDate: expDateInput.value,
        cvv: cvvInput.value
      });
    }, TIMEOUT_TO_ALLOW_SAFARI_TO_AUTOFILL);
  });

  form.appendChild(expDate);
  form.appendChild(cvv);
}

function autofillHandler(fieldComponent) {
  return function (payload) {
    var name, value, expDate, cvv;

    if (!payload || !payload.expDate) {
      return;
    }

    name = frameName.getFrameName('hosted-field');
    expDate = payload.expDate;
    cvv = payload.cvv;

    if (name === 'expDate') {
      value = expDate;
    } else if (name === 'cvv' && cvv) {
      value = cvv;
    }

    if (value) {
      fieldComponent.input.updateModel('value', value);

      if (fieldComponent.input.shouldMask) {
        fieldComponent.input.maskValue(value);
      } else {
        fieldComponent.input.element.value = value;
      }

      resetPlaceholder(fieldComponent.input.element);
    }
  };
}

function resetPlaceholder(element) {
  // Safari leaves the placholder visible in the iframe, we
  // compensate for this by removing and re-setting the placeholder
  var placeholder = element.getAttribute('placeholder');

  if (placeholder) {
    element.setAttribute('placeholder', '');
    element.setAttribute('placeholder', placeholder);
  }
}

function shimPlaceholder() {
  var input;

  if (!global.placeholderShim) { return; }

  input = document.querySelector('input');
  if (!input) { return; }

  global.placeholderShim(input);
}

function create() {
  var componentId = location.hash.slice(1, location.hash.length);

  global.bus = new Bus({ channel: componentId });
  global.bus.emit(events.FRAME_READY, orchestrate);
}

function composeTokenizerError (response) {
  var tokenizerError, status;

  status = response.details && response.details.httpStatus;
  if (status === 403) {
    tokenizerError = response;
  } else if (status < 500) {
    tokenizerError = new SeamlesspayError(errors.HOSTED_FIELDS_FAILED_TOKENIZATION);
    tokenizerError.details = response.name === 'SeamlesspayError' && response.details ? response.details: { originalError: response };
  } else {
    tokenizerError = new SeamlesspayError(errors.HOSTED_FIELDS_TOKENIZATION_NETWORK_ERROR);
    tokenizerError.details = response.name === 'SeamlesspayError' && response.details ? response.details: { originalError: response };
  }

  return tokenizerError;
}

function createTokenizationHandler(client, cardForm) {
  return function (options, reply) {
    options = options || {};
    var TOKENIZATION = requestTypes.REQUEST_TYPE_TOKENIZATION;
    var isEmpty = cardForm.isEmpty(TOKENIZATION);
    var invalidFieldKeys = cardForm.invalidFieldKeys(TOKENIZATION);
    var isValid = invalidFieldKeys.length === 0;

    if (isEmpty) {
      reply([
        new SeamlesspayError(errors.HOSTED_FIELDS_FIELDS_EMPTY)
      ]);
      return;
    } else if (!isValid) {
      reply([
        new SeamlesspayError({
          type: errors.HOSTED_FIELDS_FIELDS_INVALID.type,
          code: errors.HOSTED_FIELDS_FIELDS_INVALID.code,
          message: errors.HOSTED_FIELDS_FIELDS_INVALID.message,
          details: { invalidFieldKeys: invalidFieldKeys }
        })
      ]);
      return;
    }

    return requestsSequence(client, [
      {
        api: 'tokenizerApi',
        method: 'post',
        endpoint: 'tokens',
        getData: function () {
          return assign(
            cardForm.getCardData({ requestType: TOKENIZATION, extraData: options }),
            {
              paymentType: cardForm.getPaymentType()
            }
          );
        }
      }
    ]).then(function (results) {
      var response = results[0];
      if (response instanceof Error || (response && response.name === 'SeamlesspayError')) {
        reply([
          composeTokenizerError(response)
        ]);
      } else {
        reply([null, assign({}, response)]);
      }
    });
  };
}

function orchestrate(configuration) {
  var client = new Client(configuration.client);
  var cardForm = new CreditCardForm(configuration);
  var iframes = assembleIFrames.assembleIFrames(window.parent);

  iframes.forEach(function (iframe) {
    try {
      iframe.seamlesspay.hostedFields.initialize(cardForm);
    } catch (e) { /* noop */ }
  });

  cardForm.setupRelatedFieldsByConfigValues();

  global.bus.on(events.TOKENIZATION_REQUEST, function (options, reply) {
    var tokenizationHandler = createTokenizationHandler(client, cardForm);

    tokenizationHandler(options, reply);
  });

  // Globalize cardForm is global so other components (UnionPay) can access it
  global.cardForm = cardForm;
}

module.exports = {
  initialize: initialize,
  create: create,
  orchestrate: orchestrate,
  createTokenizationHandler: createTokenizationHandler
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../client/client":65,"../../lib/assemble-iframes":102,"../../lib/assign":103,"../../lib/bus":106,"../../lib/get-frame-name":116,"../../lib/requests-sequence":121,"../../lib/seamlesspay-error":122,"../shared/constants":98,"../shared/errors":99,"./components/field-component":81,"./models/credit-card-form":87,"inject-stylesheet":60}],87:[function(_dereq_,module,exports){
(function (global){(function (){
'use strict';
var getCardTypes = _dereq_('credit-card-type');
var Promise = _dereq_('../../../lib/promise');
var getByDot = _dereq_('./../../../lib/get-by-dot');
var assign = _dereq_('./../../../lib/assign').assign;
var EventedModel = _dereq_('./evented-model');
var comparePossibleCardTypes = _dereq_('../../../lib/compare-possible-card-types');
var validators = _dereq_('../validators');
var Client = _dereq_('../../../client/client');
var constants = _dereq_('../../shared/constants');
var common = _dereq_('../../shared/common');
var paymentFieldsRelations = _dereq_('../../shared/payment-fields-relations');
var events = constants.events;
var externalEvents = constants.externalEvents;
var requestTypes = constants.requestTypes;
var tokenizerNonSecureFields = constants.tokenizerNonSecureFields;
var getMaxLength = common.getMaxLength;
var getWhitelistedFields = common.getWhitelistedFields;

var GIFT_CARD = constants.paymentTypes.PAYMENT_TYPE_GIFT_CARD;

function CreditCardForm(configuration) {
  this._components = {};
  this.configuration = configuration;

  var whitelistedFields = getWhitelistedFields(this.configuration.paymentType);

  this._fieldKeys = Object.keys(configuration.fields).filter(function (key) {
    return whitelistedFields.hasOwnProperty(key);
  });

  EventedModel.apply(this, arguments);

  this.giftCardTypes = [
    {
      niceType: 'SVS',
      type: 'SVS',
      exactPattern: /^6\d*$/,
      gaps: [4, 8, 12, 16],
      lengths: [19],
      code: { name: '', size: 0 }
    },
    {
      niceType: 'TCC',
      type: 'TCC',
      exactPattern: /^2\d*$/,
      gaps: [4, 8, 12],
      lengths: [16],
      code: { name: '', size: 0 }
    }
  ];

  this._fieldKeys.forEach(function (field) {
    var onFieldChange = onFieldStateChange(this, field);
    this._validateField(field); // that should set isValid for default values
    this._handleRelatedFieldsValues(field);
    this.on('change:' + field + '.value', onFieldValueChange(this, field));
    this.on('change:' + field + '.isFocused', onFieldFocusChange(this, field));
    this.on('change:' + field + '.isEmpty', onEmptyChange(this, field));

    this.on('change:' + field + '.isValid', onFieldChange);
    this.on('change:' + field + '.isPotentiallyValid', onFieldChange);
  }.bind(this));
  this.on('change:accountNumber.value', this._onNumberChange);
  this.on('change:possibleCardTypes', onCardTypeChange(this, 'accountNumber'));
}

CreditCardForm.prototype = Object.create(EventedModel.prototype);
CreditCardForm.prototype.constructor = CreditCardForm;

CreditCardForm.prototype.resetAttributes = function () {
  var thisMonth = (new Date().getMonth() + 1).toString();
  var thisYear = (new Date().getFullYear()).toString();

  return this._fieldKeys.reduce(function (result, field) {
    var fieldConfig = this.configuration.fields[field];
    var isSelect = fieldConfig.select != null;
    var hasPlaceholder = fieldConfig.placeholder != null;

    result[field] = {
      value: fieldConfig.defaultValue || '',
      isFocused: false,
      isValid: 'defaultValue' in fieldConfig,
      isPotentiallyValid: true
    };

    if (isSelect && !hasPlaceholder) {
      if (field === 'expirationMonth') {
        result[field].value = thisMonth;
      } else if (field === 'expirationYear') {
        result[field].value = thisYear;
      }

      if (field === 'expirationMonth' || field === 'expirationYear') {
        result[field].isValid = true;
      }
    }

    result[field].isEmpty = result[field].value === '';

    return result;
  }.bind(this), { possibleCardTypes: getCardTypes('') });
};

CreditCardForm.prototype.emitEvent = function (fieldKey, eventType) {
  var cards, cardInfo;
  var possibleCardTypes = this.get('possibleCardTypes');
  var fields = this._fieldKeys.reduce(function (result, key) {
    var fieldData = this.get(key);

    result[key] = {
      isEmpty: fieldData.isEmpty,
      isValid: fieldData.isValid,
      isPotentiallyValid: fieldData.isPotentiallyValid,
      isFocused: fieldData.isFocused
    };

    return result;
  }.bind(this), {});
  cards = possibleCardTypes.map(function (cardType) {
    return {
      niceType: cardType.niceType,
      type: cardType.type,
      code: cardType.code
    };
  });
  cardInfo = this._getCardInfo();

  global.bus.emit(events.INPUT_EVENT, {
    merchantPayload: {
      cards: cards,
      cardInfo: cardInfo,
      emittedBy: fieldKey,
      fields: fields
    },
    type: eventType
  });
};

CreditCardForm.prototype.setupComponent = function (fieldKey, component) {
  this._components[fieldKey] = component;
};

CreditCardForm.prototype._onNumberChange = function (number) {
  var pureNumber = number.replace(/[-\s]/g, '');
  var isGC = GIFT_CARD === this.getPaymentType()
  var newPossibleCardTypes = isGC
    ? this.giftCardTypes.filter(function (giftCardType) {
        return giftCardType.exactPattern.test(pureNumber);
      })
    : getCardTypes(pureNumber);

  if (!isGC) {
    var restrictLength = function (possibleCard) {
      var newLength = (possibleCard.lengths || []).filter(function(length) { return length <= 16 })
      return assign(possibleCard, { lengths: newLength })
    }
    newPossibleCardTypes = (newPossibleCardTypes || []).map(restrictLength)
  }
  var oldPossibleCardTypes = this.get('possibleCardTypes');
  if (!comparePossibleCardTypes(newPossibleCardTypes, oldPossibleCardTypes)) {
    this.set('possibleCardTypes', newPossibleCardTypes);
  }
};

CreditCardForm.prototype._validateField = function (fieldKey) {
  var validationResult;
  var value = this.get(fieldKey + '.value');
  var validate = validators[fieldKey];

  validationResult = validate(value, this);

  this.set(fieldKey + '.isValid', validationResult.isValid);
  this.set(fieldKey + '.isPotentiallyValid', validationResult.isPotentiallyValid);

  return validationResult;
};

CreditCardForm.prototype._getRelatedFieldsRules = function () {
  var paymentType = this.getPaymentType();
  return Object.keys(paymentFieldsRelations).reduce(function (result, requestType) {
    var rules = paymentFieldsRelations[requestType][paymentType].relatedFieldsRules || [];
    rules.forEach(function (rule) {
      result.push(rule);
    });
    return result;
  }, [])
}

CreditCardForm.prototype._updateFieldProperty = function (rule, dependentFieldKey) {
  var renderResult;
  var dependentFieldPart = rule.dependencies[dependentFieldKey];
  var dependentFieldOrigin = this.getWhitelistedFields()[dependentFieldKey];
  var dependentField = assign({}, dependentFieldOrigin, dependentFieldPart);
  var fieldComponent = this._components[dependentFieldKey];

  if (!fieldComponent || !dependentField.enums) return;

  fieldComponent.enums = dependentField.enums;
  renderResult = fieldComponent.renderOptions(dependentField.enums);
  this.set(dependentFieldKey + '.value', renderResult.selectedValue);
}

CreditCardForm.prototype.setupRelatedFieldsByConfigValues = function () {
  var config = this.configuration.client;
  var relatedFieldsRules = this._getRelatedFieldsRules()
    .filter(function (rule) {
      return rule.config && rule.value === getByDot(config, rule.config);
    });

  relatedFieldsRules.forEach(function (rule) {
    Object.keys(rule.dependencies).forEach(function (dependentFieldKey) {
      this._updateFieldProperty(rule, dependentFieldKey)
    }.bind(this))

  }.bind(this));
}

CreditCardForm.prototype._handleRelatedFieldsValues = function (fieldKey) {
  var value = this.get(fieldKey + '.value');
  var relatedFieldsRules = this._getRelatedFieldsRules()
    .filter(function (rule) {
      return rule.field === fieldKey && rule.value === value;
    });
  relatedFieldsRules.forEach(function (rule) {
    Object.keys(rule.dependencies).forEach(function (dependentFieldKey) {
      this._updateFieldProperty(rule, dependentFieldKey)
    }.bind(this))

  }.bind(this));
};

CreditCardForm.prototype.getPaymentType = function () {
  return this.configuration.paymentType;
};

CreditCardForm.prototype.getMaxLength = function (fieldName) {
  return getMaxLength(this.getPaymentType(), fieldName);
};

CreditCardForm.prototype.getWhitelistedFields = function () {
  return getWhitelistedFields(this.getPaymentType());
};

CreditCardForm.prototype.getCardData = function (params) {
  var TOKENIZATION  = requestTypes.REQUEST_TYPE_TOKENIZATION;
  var paymentType = this.getPaymentType();
  var extraFields;
  var extraData;
  var fieldSet;
  var result = {};

  params = params || { requestType: TOKENIZATION, extraData: {} };
  extraData = params.extraData || {};
  extraFields = Object.keys(extraData);

  fieldSet = paymentFieldsRelations[params.requestType];

  if (!fieldSet) {
    return result;
  }

  function injectPostalCode(data, postalCode) {
    if (!postalCode) return data;
    var billingAddress = { postalCode: postalCode };
    data.billingAddress = data.billingAddress ? assign(data.billingAddress, billingAddress) : billingAddress
    delete data.postalCode;

    return data;
  }

  // Set Extra Fields
  result = extraFields.reduce(function (accum, field) {
    var fieldData = {};
    if (params.requestType === TOKENIZATION && tokenizerNonSecureFields.indexOf(field) === -1) {
      return accum;
    }

    fieldData[field] = prepareFieldValue(field, extraData[field]);

    return ~fieldSet[paymentType].fields.indexOf(field) ? accum : assign(accum, fieldData);
  }, result);

  // prepare card data
  fieldSet[paymentType].fields.filter(function(key) {
      return this._fieldKeys.indexOf(key) !== -1;
    }.bind(this))
    .reduce(
      function (reducedResult, name) {
        var value = this.get(name + '.value');
        if (value.trim().length > 0) {
          reducedResult[name] = prepareFieldValue(name, value.trim());
        } else if (fieldSet[paymentType].defaultValues && (name in fieldSet[paymentType].defaultValues)) {
          reducedResult[name] = fieldSet[paymentType].defaultValues[name];
        }

        return name === 'postalCode' ? injectPostalCode(reducedResult, reducedResult[name]): reducedResult;
      }.bind(this),
      result
    );

  return result;
};

CreditCardForm.prototype.getFields = function () {
  return [].concat(this._fieldKeys);
};

CreditCardForm.prototype.isEmpty = function (requestType) {
  var paymentType = this.getPaymentType();
  var fields = getFieldsSet(paymentType, requestType);

  return this._fieldKeys
    .filter(function (key) {

      return fields.indexOf(key) !== -1;
    })
    .every(function (key) {

      return this.get(key).value.length === 0;
    }.bind(this));
};

CreditCardForm.prototype.invalidFieldKeys = function (requestType) {
  var paymentType = this.getPaymentType();
  var fields = getFieldsSet(paymentType, requestType);

  return this._fieldKeys
    .filter(function(key) {
      var isApplicable = fields.indexOf(key) !== -1;

      return isApplicable;
    }.bind(this))
    .filter(function (key) {
      this._validateField(key);

      return !this.get(key).isValid;
    }.bind(this));
};

CreditCardForm.prototype._getCardInfo = function () {
  var _cardInfoResponse = this._cardInfoResponse || {};

  return {
    cardBrand: _cardInfoResponse.paymentNetwork,
    cardType: _cardInfoResponse.accountType,
    prepaidIndicator: _cardInfoResponse.prepaidIndicator,
    thirdParty: _cardInfoResponse.thirdParty
  };
};

CreditCardForm.prototype._requestCardInfo = function (fieldKey) {
  var BIN_LOOKUP_MAX_LENGTH = constants.BIN_LOOKUP_MAX_LENGTH;
  var value = (this.get(fieldKey + '.value') || '').slice(0, BIN_LOOKUP_MAX_LENGTH);

  if (!this._cardInfoClient) {
    this._cardInfoClient = new Client(this.configuration.client);
  }

  return value.length >= BIN_LOOKUP_MAX_LENGTH
    ? this._cardInfoClient.request({
        api: 'seamlesspayApi',
        method: 'get',
        endpoint: 'bin-lookups/' + value,
        publishable: true,
        data: {
          including: 'thirdParty'
        }
      })
      .catch(function (error) {
        return error;
      })
      .then(function(response) {
        this._cardInfoResponse = response;

        return response;
      }.bind(this))
    :  Promise.resolve().then(function () {
        this._cardInfoResponse = {};

        return {};
      }.bind(this))
  ;
};

CreditCardForm.prototype.getComponents = function () {
  return this._components
}

function onFieldValueChange(form, fieldKey) {
  var customReqInfoServiceNames = {
    accountNumber: '_requestCardInfo'
  };
  var eventMap = {
    accountNumber: externalEvents.CARD_INFO_LOADED
  };

  return function () {
    var paymentType = this.getPaymentType();
    form.set(fieldKey + '.isEmpty', form.get(fieldKey + '.value') === '');
    form._validateField(fieldKey);
    form._handleRelatedFieldsValues(fieldKey);
    form.emitEvent(fieldKey, externalEvents.CHANGE);

    if (
      (
        getByDot(this, 'configuration.client.tokenType') === constants.TOKEN_TYPE_CHECKOUT ||
        getByDot(this, 'configuration.client.gatewayConfiguration.transactionApi.source') === 'vTerminal'
      ) &&
      paymentType === constants.paymentTypes.PAYMENT_TYPE_CREDIT &&
      customReqInfoServiceNames[fieldKey]
    ) {
      var nameInfoRequestService = customReqInfoServiceNames[fieldKey];
      var eventInfo = eventMap[fieldKey];
      form[nameInfoRequestService](fieldKey)
        .then(function () {
          form.emitEvent(fieldKey, eventInfo);
        });
    }
  };
}

function onFieldFocusChange(form, field) {
  return function (isFocused) {
    form._fieldKeys.forEach(function (key) {
      if (key === field) { return; }
      form.set(key + '.isFocused', false);
    });

    form.emitEvent(field, isFocused ? externalEvents.FOCUS : externalEvents.BLUR);
  };
}

function onCardTypeChange(form, field) {
  return function () {
    form.emitEvent(field, externalEvents.CARD_TYPE_CHANGE);
  };
}

function onEmptyChange(form, field) {
  return function () {
    var event = form.get(field + '.isEmpty') ? externalEvents.EMPTY : externalEvents.NOT_EMPTY;
    form.emitEvent(field, event);
  };
}

function onFieldStateChange(form, field) {
  return function () {
    form.emitEvent(field, externalEvents.VALIDITY_CHANGE);
  };
}

function prepareFieldValue(field, value) {
  var stringFields = ['amount', 'taxAmount'];

  return stringFields.indexOf(field) !== -1 ? String(value) : value;
}

function getFieldsSet(paymentType, requestType) {

  return Object
    .keys(paymentFieldsRelations)
    .filter(function (currentRequestType) {

      return requestType ? currentRequestType === requestType : true;
    })
    .reduce(function (result, currentRequestType) {
      var paymentTypeRelations = paymentFieldsRelations[currentRequestType];

      return Object
        .keys(paymentTypeRelations)
        .filter(function (currentPaymentType) {

          return paymentType ? currentPaymentType === paymentType : true;
        })
        .reduce(function (nextResult, currentTxnType) {
          paymentTypeRelations[currentTxnType].fields.forEach(function (fieldName) {
            if (nextResult.indexOf(fieldName) === -1) {
              nextResult.push(fieldName);
            }
          });

          return nextResult;
        }, result);

    }, []);
}

module.exports = {
  CreditCardForm: CreditCardForm
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../../client/client":65,"../../../lib/compare-possible-card-types":108,"../../../lib/promise":119,"../../shared/common":97,"../../shared/constants":98,"../../shared/payment-fields-relations":100,"../validators":92,"./../../../lib/assign":103,"./../../../lib/get-by-dot":115,"./evented-model":88,"credit-card-type":52}],88:[function(_dereq_,module,exports){
'use strict';

var slice = Array.prototype.slice;

function EventedModel() {
  this._attributes = this.resetAttributes();
  this._listeners = {};
}

EventedModel.prototype.get = function get(compoundKey) {
  var i, key, keys;
  var traversal = this._attributes;

  if (compoundKey == null) { return traversal; }

  keys = compoundKey.split('.');

  for (i = 0; i < keys.length; i++) {
    key = keys[i];

    if (!traversal.hasOwnProperty(key)) {
      return undefined; // eslint-disable-line
    }

    traversal = traversal[key];
  }

  return traversal;
};

EventedModel.prototype.set = function set(compoundKey, value, forceChange) {
  var i, key, keys;
  var traversal = this._attributes;

  keys = compoundKey.split('.');

  for (i = 0; i < keys.length - 1; i++) {
    key = keys[i];

    if (!traversal.hasOwnProperty(key)) {
      traversal[key] = {};
    }

    traversal = traversal[key];
  }
  key = keys[i];

  if (traversal[key] !== value || forceChange) {
    traversal[key] = value;
    this.emit('change');
    for (i = 1; i <= keys.length; i++) {
      key = keys.slice(0, i).join('.');
      this.emit('change:' + key, this.get(key));
    }
  }
};

EventedModel.prototype.on = function on(event, handler) {
  var listeners = this._listeners[event];

  if (!listeners) {
    this._listeners[event] = [handler];
  } else {
    listeners.push(handler);
  }
};

EventedModel.prototype.emit = function emit(event) {
  var i;
  var self = this;
  var args = arguments;
  var listeners = this._listeners[event];

  if (!listeners) { return; }

  for (i = 0; i < listeners.length; i++) {
    listeners[i].apply(self, slice.call(args, 1));
  }
};

EventedModel.prototype.resetAttributes = function resetAttributes() {
  return {};
};

module.exports = EventedModel;

},{}],89:[function(_dereq_,module,exports){
'use strict';

var validator = _dereq_('card-validator');
var verification = _dereq_('./verification');
var constants = _dereq_('../../shared/constants');

var ACH = constants.paymentTypes.PAYMENT_TYPE_ACH;
var GIFT = constants.paymentTypes.PAYMENT_TYPE_GIFT_CARD;
var GIFT_CARD_MAX_LENGTH = constants.GIFT_CARD_MAX_LENGTH;
var GIFT_CARD_MIN_LENGTH = constants.GIFT_CARD_MIN_LENGTH;

function setCreditCardLength() {
  for (var type in validator.creditCardType.types) {
    var cardType = validator.creditCardType.types[type];
    var cardInfo = validator.creditCardType.getTypeInfo(cardType);
    validator.creditCardType.updateCard(cardType, {
      lengths: cardInfo.lengths.filter(function (length) {
        return length <= 16;
      }),
    });
  }
}

function accountNumber(value, cardForm) {
  var isValid;
  var pureValue = value.replace(/[-\s]/g, '');

  switch (cardForm.getPaymentType()) {
    case GIFT:
      isValid = pureValue.length >= GIFT_CARD_MIN_LENGTH && pureValue.length <= GIFT_CARD_MAX_LENGTH;

      return { isPotentiallyValid: isValid, isValid: isValid };
    case ACH:
      isValid = value.trim().length > 0 && value.trim().length <= cardForm.getMaxLength('accountNumber');

      return verification(isValid, isValid);
    default: // By default credit card will be validated
      setCreditCardLength();
      return validator.number(value);
  }
}

module.exports = accountNumber;

},{"../../shared/constants":98,"./verification":95,"card-validator":40}],90:[function(_dereq_,module,exports){
'use strict';
var verification = _dereq_('./verification');
var validator = _dereq_('card-validator');

function uniq(array) {
  return array.filter(function (item, position, arr) {
    return arr.indexOf(item) === position;
  });
}

function cvv (value, cardForm) {
  var cvvSize;
  var fields = cardForm.getFields();
  var isValid = true;

  if (!value) return verification(isValid, isValid);

  if (fields.indexOf('accountNumber') === -1) { // CVV only
    return validator.cvv(value, [3, 4]);
  }

  cvvSize = cardForm.get('possibleCardTypes').map(function (item) {
    return item.code.size;
  });
  cvvSize = uniq(cvvSize);
  return validator.cvv(value, cvvSize);
}

module.exports = cvv;

},{"./verification":95,"card-validator":40}],91:[function(_dereq_,module,exports){
'use strict';

var validator = _dereq_('card-validator');

function splitDate(date) {
  var month, year, leadingDigit;

  date = date.replace(/[\/\-\s]/g, ''); // eslint-disable-line no-useless-escape
  leadingDigit = date.charAt(0);

  if (date.length === 0) {
    month = year = '';
  } else if (leadingDigit === '0' || leadingDigit === '1') {
    month = date.slice(0, 2);
    year = date.slice(2);
  } else {
    month = '0' + leadingDigit;
    year = date.slice(1);
  }

  return { month: month, year: year };
}


function expirationDate (value) {
  return validator.expirationDate(splitDate(value));
}

module.exports = expirationDate;

},{"card-validator":40}],92:[function(_dereq_,module,exports){
'use strict';

var accountNumber = _dereq_('./account-number');
var verifyAccountNumber = _dereq_('./verify-account-number');
var postalCode = _dereq_('./postal-code');
var cvv = _dereq_('./cvv');
var expDate = _dereq_('./expiration-date');
var name = _dereq_('./name');

module.exports = {
  accountNumber: accountNumber,
  verifyAccountNumber: verifyAccountNumber,
  postalCode: postalCode,
  cvv: cvv,
  expDate: expDate,
  name: name,
};

},{"./account-number":89,"./cvv":90,"./expiration-date":91,"./name":93,"./postal-code":94,"./verify-account-number":96}],93:[function(_dereq_,module,exports){
'use strict';

var verification = _dereq_('./verification');

function name (value, cardForm) {
  var bValid = value.trim().length === 0 || value.trim().length <= cardForm.getMaxLength('name');
  return verification(bValid, false);
}

module.exports = name;

},{"./verification":95}],94:[function(_dereq_,module,exports){
'use strict';

var validator = _dereq_('card-validator');
var verification = _dereq_('./verification');

function postalCode (value) {
  return value.trim().length === 0 ? verification(true, false) : validator.postalCode(value);
}

module.exports = postalCode;

},{"./verification":95,"card-validator":40}],95:[function(_dereq_,module,exports){
'use strict';
function verification (isValid, isPotentiallyValid) {
  return { isValid: isValid, isPotentiallyValid: isPotentiallyValid };
}
module.exports = verification;

},{}],96:[function(_dereq_,module,exports){
'use strict';

var validator = _dereq_('card-validator');
var verification = _dereq_('./verification');
var constants = _dereq_('../../shared/constants');

var ACH = constants.paymentTypes.PAYMENT_TYPE_ACH;
var GIFT = constants.paymentTypes.PAYMENT_TYPE_GIFT_CARD;

function accountNumber(value, cardForm) {
  var pureValue = value.replace(/[-\s]/g, '');
  var accountNumber = cardForm.get('accountNumber.value');

  var isValid = pureValue === accountNumber;

  switch (cardForm.getPaymentType()) {
    case GIFT:
      return { isPotentiallyValid: isValid, isValid: isValid };
    case ACH:
      return verification(isValid, false);
    default: // By default credit card will be validated

      return validator.number(value);
  }
}

module.exports = accountNumber;

},{"../../shared/constants":98,"./verification":95,"card-validator":40}],97:[function(_dereq_,module,exports){
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

},{"./constants":98}],98:[function(_dereq_,module,exports){
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

},{"../../lib/enumerate":112}],99:[function(_dereq_,module,exports){
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

},{"../../lib/seamlesspay-error":122}],100:[function(_dereq_,module,exports){
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

},{"./constants":98}],101:[function(_dereq_,module,exports){
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

},{}],102:[function(_dereq_,module,exports){
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

},{}],103:[function(_dereq_,module,exports){
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

},{}],104:[function(_dereq_,module,exports){
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

},{"../is-whitelisted-domain":117}],105:[function(_dereq_,module,exports){
'use strict';

var enumerate = _dereq_('../enumerate');

module.exports = enumerate([
  'CONFIGURATION_REQUEST'
], 'bus:');

},{"../enumerate":112}],106:[function(_dereq_,module,exports){
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

},{"../seamlesspay-error":122,"./check-origin":104,"./events":105,"framebus":59}],107:[function(_dereq_,module,exports){
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

},{}],108:[function(_dereq_,module,exports){
'use strict';

function comparePossibleCardTypes(a, b) {
  var aHash;

  if (a.length !== b.length) { return false; }

  aHash = a.reduce(function (accum, type) {
    accum[type.type] = true;
    return accum;
  }, {});

  return b.every(function (type) {
    return aHash.hasOwnProperty(type.type);
  });
}

module.exports = comparePossibleCardTypes;

},{}],109:[function(_dereq_,module,exports){
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

},{}],110:[function(_dereq_,module,exports){
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

},{"./seamlesspay-error":122}],111:[function(_dereq_,module,exports){
'use strict';

var RestrictedInput = _dereq_('@seamlesspay/restricted-input');
var FakeRestrictedInput = _dereq_('./fake-restricted-input');
var SUPPORTED_INPUT_TYPES = ['text', 'tel', 'url', 'search', 'password'];

module.exports = function (options) {
  var shouldFormat = options.shouldFormat;

  if (SUPPORTED_INPUT_TYPES.indexOf(options.element.type) === -1) {
    shouldFormat = false;
  }

  return shouldFormat ? new RestrictedInput(options) : new FakeRestrictedInput(options);
};

},{"./fake-restricted-input":114,"@seamlesspay/restricted-input":32}],112:[function(_dereq_,module,exports){
'use strict';

function enumerate(values, prefix) {
  prefix = prefix == null ? '' : prefix;

  return values.reduce(function (enumeration, value) {
    enumeration[value] = prefix + value;
    return enumeration;
  }, {});
}

module.exports = enumerate;

},{}],113:[function(_dereq_,module,exports){
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

},{"./seamlesspay-error":122}],114:[function(_dereq_,module,exports){
'use strict';

function FakeRestrictedInput(options) {
  this.inputElement = options.element;
}

FakeRestrictedInput.prototype.getUnformattedValue = function () {
  return this.inputElement.value;
};

FakeRestrictedInput.prototype.setPattern = function () {};

module.exports = FakeRestrictedInput;

},{}],115:[function(_dereq_,module,exports){
'use strict';

function getByDot(obj, path) {
  if (path.indexOf('.') === -1) {
    return obj[path];
  }
  return path.split('.').reduce(function (result, part) {
    return typeof result === 'object' ? result[part] : undefined;
  }, obj);
}

module.exports = getByDot;

},{}],116:[function(_dereq_,module,exports){
'use strict';

module.exports = {
  getFrameName: function getFrameName(root) {
    return window.name.replace('seamlesspay-' + root + '-', '');
  }
};

},{}],117:[function(_dereq_,module,exports){
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

},{}],118:[function(_dereq_,module,exports){
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

},{}],119:[function(_dereq_,module,exports){
(function (global){(function (){
'use strict';

var Promise = global.Promise;

module.exports = Promise;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],120:[function(_dereq_,module,exports){
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

},{}],121:[function(_dereq_,module,exports){
'use strict';
var assign = _dereq_('./assign').assign;
var Promise = _dereq_('./promise');

function requestsSequence(client, requestsData) {
  var responses = [];
  var defaultParams = {
    api: 'tokenizerApi',
    method: 'post',
    endpoint: 'tokens',
    getData: function () { return {}; }
  };

  requestsData = requestsData || [defaultParams];

  return requestsData.reduce(
    function (promise, params) {
      params = params || defaultParams;

      return promise.then(function (response) { // here we get previous request result
        var isPreviousFailed = response instanceof Error || (response && response.name === 'SeamlesspayError');
        var data = params.getData(response);
        var hasFields = Object.keys(data).filter(function (key) { return ['paymentType'].indexOf(key) === -1; }).length > 0;

        if (!hasFields) {
          responses.push({});
          return Promise.resolve(response);
        }

        return isPreviousFailed ? Promise.resolve(response) : client
          .request(assign({}, params, { data: data }))
          .catch(function (error) {
            return error;
          })
          .then(function (result) {
            responses.push(result);

            return result;
          });
      });
    },
    Promise.resolve(false)
  ).then(function () {
    return responses;
  });
}

module.exports = requestsSequence;

},{"./assign":103,"./promise":119}],122:[function(_dereq_,module,exports){
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

},{"./enumerate":112}],123:[function(_dereq_,module,exports){
'use strict';

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : r & 0x3 | 0x8;

    return v.toString(16);
  });
}

module.exports = uuid;

},{}]},{},[86])(86)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvQGJyYWludHJlZS9icm93c2VyLWRldGVjdGlvbi9kaXN0L2lzLWFuZHJvaWQuanMiLCJub2RlX21vZHVsZXMvQGJyYWludHJlZS9icm93c2VyLWRldGVjdGlvbi9kaXN0L2lzLWNocm9tZS1vcy5qcyIsIm5vZGVfbW9kdWxlcy9AYnJhaW50cmVlL2Jyb3dzZXItZGV0ZWN0aW9uL2Rpc3QvaXMtY2hyb21lLmpzIiwibm9kZV9tb2R1bGVzL0BicmFpbnRyZWUvYnJvd3Nlci1kZXRlY3Rpb24vZGlzdC9pcy1kdWNrZHVja2dvLmpzIiwibm9kZV9tb2R1bGVzL0BicmFpbnRyZWUvYnJvd3Nlci1kZXRlY3Rpb24vZGlzdC9pcy1lZGdlLmpzIiwibm9kZV9tb2R1bGVzL0BicmFpbnRyZWUvYnJvd3Nlci1kZXRlY3Rpb24vZGlzdC9pcy1pZTkuanMiLCJub2RlX21vZHVsZXMvQGJyYWludHJlZS9icm93c2VyLWRldGVjdGlvbi9kaXN0L2lzLWlvcy5qcyIsIm5vZGVfbW9kdWxlcy9AYnJhaW50cmVlL2Jyb3dzZXItZGV0ZWN0aW9uL2Rpc3QvaXMtaXBhZG9zLmpzIiwibm9kZV9tb2R1bGVzL0BicmFpbnRyZWUvYnJvd3Nlci1kZXRlY3Rpb24vZGlzdC9pcy1vcGVyYS5qcyIsIm5vZGVfbW9kdWxlcy9AYnJhaW50cmVlL2Jyb3dzZXItZGV0ZWN0aW9uL2Rpc3QvaXMtc2Ftc3VuZy5qcyIsIm5vZGVfbW9kdWxlcy9AYnJhaW50cmVlL2Jyb3dzZXItZGV0ZWN0aW9uL2Rpc3QvaXMtc2lsay5qcyIsIm5vZGVfbW9kdWxlcy9AYnJhaW50cmVlL2Jyb3dzZXItZGV0ZWN0aW9uL2lzLWFuZHJvaWQuanMiLCJub2RlX21vZHVsZXMvQGJyYWludHJlZS9icm93c2VyLWRldGVjdGlvbi9pcy1jaHJvbWUtb3MuanMiLCJub2RlX21vZHVsZXMvQGJyYWludHJlZS9icm93c2VyLWRldGVjdGlvbi9pcy1jaHJvbWUuanMiLCJub2RlX21vZHVsZXMvQGJyYWludHJlZS9icm93c2VyLWRldGVjdGlvbi9pcy1pZTkuanMiLCJub2RlX21vZHVsZXMvQGJyYWludHJlZS9icm93c2VyLWRldGVjdGlvbi9pcy1pb3MuanMiLCJub2RlX21vZHVsZXMvQHNlYW1sZXNzcGF5L3Jlc3RyaWN0ZWQtaW5wdXQvZGlzdC9saWIvZGV2aWNlLmpzIiwibm9kZV9tb2R1bGVzL0BzZWFtbGVzc3BheS9yZXN0cmljdGVkLWlucHV0L2Rpc3QvbGliL2Zvcm1hdHRlci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9Ac2VhbWxlc3NwYXkvcmVzdHJpY3RlZC1pbnB1dC9kaXN0L2xpYi9mb3JtYXR0ZXIvcGFyc2UtcGF0dGVybi5qcyIsIm5vZGVfbW9kdWxlcy9Ac2VhbWxlc3NwYXkvcmVzdHJpY3RlZC1pbnB1dC9kaXN0L2xpYi9pbnB1dC1zZWxlY3Rpb24uanMiLCJub2RlX21vZHVsZXMvQHNlYW1sZXNzcGF5L3Jlc3RyaWN0ZWQtaW5wdXQvZGlzdC9saWIvaXMtYmFja3NwYWNlLmpzIiwibm9kZV9tb2R1bGVzL0BzZWFtbGVzc3BheS9yZXN0cmljdGVkLWlucHV0L2Rpc3QvbGliL2lzLWRlbGV0ZS5qcyIsIm5vZGVfbW9kdWxlcy9Ac2VhbWxlc3NwYXkvcmVzdHJpY3RlZC1pbnB1dC9kaXN0L2xpYi9rZXktY2Fubm90LW11dGF0ZS12YWx1ZS5qcyIsIm5vZGVfbW9kdWxlcy9Ac2VhbWxlc3NwYXkvcmVzdHJpY3RlZC1pbnB1dC9kaXN0L2xpYi9yZXN0cmljdGVkLWlucHV0LmpzIiwibm9kZV9tb2R1bGVzL0BzZWFtbGVzc3BheS9yZXN0cmljdGVkLWlucHV0L2Rpc3QvbGliL3N0cmF0ZWdpZXMvYW5kcm9pZC1jaHJvbWUuanMiLCJub2RlX21vZHVsZXMvQHNlYW1sZXNzcGF5L3Jlc3RyaWN0ZWQtaW5wdXQvZGlzdC9saWIvc3RyYXRlZ2llcy9iYXNlLmpzIiwibm9kZV9tb2R1bGVzL0BzZWFtbGVzc3BheS9yZXN0cmljdGVkLWlucHV0L2Rpc3QvbGliL3N0cmF0ZWdpZXMvaWU5LmpzIiwibm9kZV9tb2R1bGVzL0BzZWFtbGVzc3BheS9yZXN0cmljdGVkLWlucHV0L2Rpc3QvbGliL3N0cmF0ZWdpZXMvaW9zLmpzIiwibm9kZV9tb2R1bGVzL0BzZWFtbGVzc3BheS9yZXN0cmljdGVkLWlucHV0L2Rpc3QvbGliL3N0cmF0ZWdpZXMva2l0a2F0LWNocm9taXVtLWJhc2VkLXdlYnZpZXcuanMiLCJub2RlX21vZHVsZXMvQHNlYW1sZXNzcGF5L3Jlc3RyaWN0ZWQtaW5wdXQvZGlzdC9saWIvc3RyYXRlZ2llcy9ub29wLmpzIiwibm9kZV9tb2R1bGVzL0BzZWFtbGVzc3BheS9yZXN0cmljdGVkLWlucHV0L2Rpc3QvbGliL3N0cmF0ZWdpZXMvc3RyYXRlZ3ktaW50ZXJmYWNlLmpzIiwibm9kZV9tb2R1bGVzL0BzZWFtbGVzc3BheS9yZXN0cmljdGVkLWlucHV0L2Rpc3QvbWFpbi5qcyIsIm5vZGVfbW9kdWxlcy9Ac2VhbWxlc3NwYXkvcmVzdHJpY3RlZC1pbnB1dC9kaXN0L3N1cHBvcnRzLWlucHV0LWZvcm1hdHRpbmcuanMiLCJub2RlX21vZHVsZXMvY2FyZC12YWxpZGF0b3IvZGlzdC9jYXJkLW51bWJlci5qcyIsIm5vZGVfbW9kdWxlcy9jYXJkLXZhbGlkYXRvci9kaXN0L2NhcmRob2xkZXItbmFtZS5qcyIsIm5vZGVfbW9kdWxlcy9jYXJkLXZhbGlkYXRvci9kaXN0L2N2di5qcyIsIm5vZGVfbW9kdWxlcy9jYXJkLXZhbGlkYXRvci9kaXN0L2V4cGlyYXRpb24tZGF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jYXJkLXZhbGlkYXRvci9kaXN0L2V4cGlyYXRpb24tbW9udGguanMiLCJub2RlX21vZHVsZXMvY2FyZC12YWxpZGF0b3IvZGlzdC9leHBpcmF0aW9uLXllYXIuanMiLCJub2RlX21vZHVsZXMvY2FyZC12YWxpZGF0b3IvZGlzdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jYXJkLXZhbGlkYXRvci9kaXN0L2xpYi9pcy1hcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9jYXJkLXZhbGlkYXRvci9kaXN0L2xpYi9wYXJzZS1kYXRlLmpzIiwibm9kZV9tb2R1bGVzL2NhcmQtdmFsaWRhdG9yL2Rpc3QvbHVobi0xMC5qcyIsIm5vZGVfbW9kdWxlcy9jYXJkLXZhbGlkYXRvci9kaXN0L3Bvc3RhbC1jb2RlLmpzIiwibm9kZV9tb2R1bGVzL2NhcmQtdmFsaWRhdG9yL25vZGVfbW9kdWxlcy9jcmVkaXQtY2FyZC10eXBlL2Rpc3QvaW5kZXguanMiLCJub2RlX21vZHVsZXMvY2FyZC12YWxpZGF0b3Ivbm9kZV9tb2R1bGVzL2NyZWRpdC1jYXJkLXR5cGUvZGlzdC9saWIvYWRkLW1hdGNoaW5nLWNhcmRzLXRvLXJlc3VsdHMuanMiLCJub2RlX21vZHVsZXMvY2FyZC12YWxpZGF0b3Ivbm9kZV9tb2R1bGVzL2NyZWRpdC1jYXJkLXR5cGUvZGlzdC9saWIvY2FyZC10eXBlcy5qcyIsIm5vZGVfbW9kdWxlcy9jYXJkLXZhbGlkYXRvci9ub2RlX21vZHVsZXMvY3JlZGl0LWNhcmQtdHlwZS9kaXN0L2xpYi9jbG9uZS5qcyIsIm5vZGVfbW9kdWxlcy9jYXJkLXZhbGlkYXRvci9ub2RlX21vZHVsZXMvY3JlZGl0LWNhcmQtdHlwZS9kaXN0L2xpYi9maW5kLWJlc3QtbWF0Y2guanMiLCJub2RlX21vZHVsZXMvY2FyZC12YWxpZGF0b3Ivbm9kZV9tb2R1bGVzL2NyZWRpdC1jYXJkLXR5cGUvZGlzdC9saWIvaXMtdmFsaWQtaW5wdXQtdHlwZS5qcyIsIm5vZGVfbW9kdWxlcy9jYXJkLXZhbGlkYXRvci9ub2RlX21vZHVsZXMvY3JlZGl0LWNhcmQtdHlwZS9kaXN0L2xpYi9tYXRjaGVzLmpzIiwibm9kZV9tb2R1bGVzL2NyZWRpdC1jYXJkLXR5cGUvaW5kZXguanMiLCJub2RlX21vZHVsZXMvY3JlZGl0LWNhcmQtdHlwZS9saWIvYWRkLW1hdGNoaW5nLWNhcmRzLXRvLXJlc3VsdHMuanMiLCJub2RlX21vZHVsZXMvY3JlZGl0LWNhcmQtdHlwZS9saWIvY2FyZC10eXBlcy5qcyIsIm5vZGVfbW9kdWxlcy9jcmVkaXQtY2FyZC10eXBlL2xpYi9jbG9uZS5qcyIsIm5vZGVfbW9kdWxlcy9jcmVkaXQtY2FyZC10eXBlL2xpYi9maW5kLWJlc3QtbWF0Y2guanMiLCJub2RlX21vZHVsZXMvY3JlZGl0LWNhcmQtdHlwZS9saWIvaXMtdmFsaWQtaW5wdXQtdHlwZS5qcyIsIm5vZGVfbW9kdWxlcy9jcmVkaXQtY2FyZC10eXBlL2xpYi9tYXRjaGVzLmpzIiwibm9kZV9tb2R1bGVzL2ZyYW1lYnVzL2xpYi9mcmFtZWJ1cy5qcyIsIm5vZGVfbW9kdWxlcy9pbmplY3Qtc3R5bGVzaGVldC9kaXN0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2luamVjdC1zdHlsZXNoZWV0L2Rpc3QvbGliL2ZpbHRlci1zdHlsZS1rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2luamVjdC1zdHlsZXNoZWV0L2Rpc3QvbGliL2ZpbHRlci1zdHlsZS12YWx1ZXMuanMiLCJub2RlX21vZHVsZXMvaW5qZWN0LXN0eWxlc2hlZXQvZGlzdC9saWIvaW5qZWN0LXN0eWxlc2hlZXQuanMiLCJub2RlX21vZHVsZXMvaW5qZWN0LXN0eWxlc2hlZXQvZGlzdC9saWIvdmFsaWRhdGUtc2VsZWN0b3IuanMiLCJzcmMvY2xpZW50L2NsaWVudC5qcyIsInNyYy9jbGllbnQvY29uc3RhbnRzLmpzIiwic3JjL2NsaWVudC9lcnJvcnMuanMiLCJzcmMvY2xpZW50L3JlcXVlc3QvYWpheC1kcml2ZXIuanMiLCJzcmMvY2xpZW50L3JlcXVlc3QvZ2V0LXVzZXItYWdlbnQuanMiLCJzcmMvY2xpZW50L3JlcXVlc3QvaW5kZXguanMiLCJzcmMvY2xpZW50L3JlcXVlc3QvaXMtaHR0cC5qcyIsInNyYy9jbGllbnQvcmVxdWVzdC9qc29ucC1kcml2ZXIuanMiLCJzcmMvY2xpZW50L3JlcXVlc3QvcGFyc2UtYm9keS5qcyIsInNyYy9jbGllbnQvcmVxdWVzdC9wcmVwLWJvZHkuanMiLCJzcmMvaG9zdGVkLWZpZWxkcy9leHRlcm5hbC9hdHRyaWJ1dGUtdmFsaWRhdGlvbi1lcnJvci5qcyIsInNyYy9ob3N0ZWQtZmllbGRzL2ludGVybmFsL2NvbXBvbmVudHMvYWNjb3VudC1udW1iZXItaW5wdXQuanMiLCJzcmMvaG9zdGVkLWZpZWxkcy9pbnRlcm5hbC9jb21wb25lbnRzL2Jhc2UtaW5wdXQuanMiLCJzcmMvaG9zdGVkLWZpZWxkcy9pbnRlcm5hbC9jb21wb25lbnRzL2NhcmQtYnJhbmQtaWNvbi5qcyIsInNyYy9ob3N0ZWQtZmllbGRzL2ludGVybmFsL2NvbXBvbmVudHMvY3Z2LWlucHV0LmpzIiwic3JjL2hvc3RlZC1maWVsZHMvaW50ZXJuYWwvY29tcG9uZW50cy9leHBpcmF0aW9uLWRhdGUtaW5wdXQuanMiLCJzcmMvaG9zdGVkLWZpZWxkcy9pbnRlcm5hbC9jb21wb25lbnRzL2ZpZWxkLWNvbXBvbmVudC5qcyIsInNyYy9ob3N0ZWQtZmllbGRzL2ludGVybmFsL2NvbXBvbmVudHMvaW5kZXguanMiLCJzcmMvaG9zdGVkLWZpZWxkcy9pbnRlcm5hbC9jb21wb25lbnRzL2xhYmVsLmpzIiwic3JjL2hvc3RlZC1maWVsZHMvaW50ZXJuYWwvY29tcG9uZW50cy9uYW1lLWlucHV0LmpzIiwic3JjL2hvc3RlZC1maWVsZHMvaW50ZXJuYWwvY29tcG9uZW50cy9wb3N0YWwtY29kZS1pbnB1dC5qcyIsInNyYy9ob3N0ZWQtZmllbGRzL2ludGVybmFsL2luZGV4LmpzIiwic3JjL2hvc3RlZC1maWVsZHMvaW50ZXJuYWwvbW9kZWxzL2NyZWRpdC1jYXJkLWZvcm0uanMiLCJzcmMvaG9zdGVkLWZpZWxkcy9pbnRlcm5hbC9tb2RlbHMvZXZlbnRlZC1tb2RlbC5qcyIsInNyYy9ob3N0ZWQtZmllbGRzL2ludGVybmFsL3ZhbGlkYXRvcnMvYWNjb3VudC1udW1iZXIuanMiLCJzcmMvaG9zdGVkLWZpZWxkcy9pbnRlcm5hbC92YWxpZGF0b3JzL2N2di5qcyIsInNyYy9ob3N0ZWQtZmllbGRzL2ludGVybmFsL3ZhbGlkYXRvcnMvZXhwaXJhdGlvbi1kYXRlLmpzIiwic3JjL2hvc3RlZC1maWVsZHMvaW50ZXJuYWwvdmFsaWRhdG9ycy9pbmRleC5qcyIsInNyYy9ob3N0ZWQtZmllbGRzL2ludGVybmFsL3ZhbGlkYXRvcnMvbmFtZS5qcyIsInNyYy9ob3N0ZWQtZmllbGRzL2ludGVybmFsL3ZhbGlkYXRvcnMvcG9zdGFsLWNvZGUuanMiLCJzcmMvaG9zdGVkLWZpZWxkcy9pbnRlcm5hbC92YWxpZGF0b3JzL3ZlcmlmaWNhdGlvbi5qcyIsInNyYy9ob3N0ZWQtZmllbGRzL2ludGVybmFsL3ZhbGlkYXRvcnMvdmVyaWZ5LWFjY291bnQtbnVtYmVyLmpzIiwic3JjL2hvc3RlZC1maWVsZHMvc2hhcmVkL2NvbW1vbi5qcyIsInNyYy9ob3N0ZWQtZmllbGRzL3NoYXJlZC9jb25zdGFudHMuanMiLCJzcmMvaG9zdGVkLWZpZWxkcy9zaGFyZWQvZXJyb3JzLmpzIiwic3JjL2hvc3RlZC1maWVsZHMvc2hhcmVkL3BheW1lbnQtZmllbGRzLXJlbGF0aW9ucy5qcyIsInNyYy9saWIvYWRkLW1ldGFkYXRhLmpzIiwic3JjL2xpYi9hc3NlbWJsZS1pZnJhbWVzLmpzIiwic3JjL2xpYi9hc3NpZ24uanMiLCJzcmMvbGliL2J1cy9jaGVjay1vcmlnaW4uanMiLCJzcmMvbGliL2J1cy9ldmVudHMuanMiLCJzcmMvbGliL2J1cy9pbmRleC5qcyIsInNyYy9saWIvY2xhc3NsaXN0LmpzIiwic3JjL2xpYi9jb21wYXJlLXBvc3NpYmxlLWNhcmQtdHlwZXMuanMiLCJzcmMvbGliL2NvbnN0YW50cy5qcyIsInNyYy9saWIvY29udmVydC10by1zZWFtbGVzc3BheS1lcnJvci5qcyIsInNyYy9saWIvY3JlYXRlLXJlc3RyaWN0ZWQtaW5wdXQuanMiLCJzcmMvbGliL2VudW1lcmF0ZS5qcyIsInNyYy9saWIvZXJyb3JzLmpzIiwic3JjL2xpYi9mYWtlLXJlc3RyaWN0ZWQtaW5wdXQuanMiLCJzcmMvbGliL2dldC1ieS1kb3QuanMiLCJzcmMvbGliL2dldC1mcmFtZS1uYW1lLmpzIiwic3JjL2xpYi9pcy13aGl0ZWxpc3RlZC1kb21haW4uanMiLCJzcmMvbGliL29uY2UuanMiLCJzcmMvbGliL3Byb21pc2UuanMiLCJzcmMvbGliL3F1ZXJ5c3RyaW5nLmpzIiwic3JjL2xpYi9yZXF1ZXN0cy1zZXF1ZW5jZS5qcyIsInNyYy9saWIvc2VhbWxlc3NwYXktZXJyb3IuanMiLCJzcmMvbGliL3V1aWQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7O0FDREE7QUFDQTs7QUNEQTtBQUNBOztBQ0RBO0FBQ0E7O0FDREE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDck1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3RUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0VUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzVHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3JHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN6T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDNVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzNlQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDdkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcInVzZSBzdHJpY3RcIjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNBbmRyb2lkKHVhKSB7XG4gICAgdWEgPSB1YSB8fCB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudDtcbiAgICByZXR1cm4gL0FuZHJvaWQvaS50ZXN0KHVhKTtcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNDaHJvbWVPUyh1YSkge1xuICAgIHVhID0gdWEgfHwgd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQ7XG4gICAgcmV0dXJuIC9Dck9TL2kudGVzdCh1YSk7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgaXNFZGdlID0gcmVxdWlyZShcIi4vaXMtZWRnZVwiKTtcbnZhciBpc1NhbXN1bmcgPSByZXF1aXJlKFwiLi9pcy1zYW1zdW5nXCIpO1xudmFyIGlzRHVja0R1Y2tHbyA9IHJlcXVpcmUoXCIuL2lzLWR1Y2tkdWNrZ29cIik7XG52YXIgaXNPcGVyYSA9IHJlcXVpcmUoXCIuL2lzLW9wZXJhXCIpO1xudmFyIGlzU2lsayA9IHJlcXVpcmUoXCIuL2lzLXNpbGtcIik7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQ2hyb21lKHVhKSB7XG4gICAgdWEgPSB1YSB8fCB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudDtcbiAgICByZXR1cm4gKCh1YS5pbmRleE9mKFwiQ2hyb21lXCIpICE9PSAtMSB8fCB1YS5pbmRleE9mKFwiQ3JpT1NcIikgIT09IC0xKSAmJlxuICAgICAgICAhaXNFZGdlKHVhKSAmJlxuICAgICAgICAhaXNTYW1zdW5nKHVhKSAmJlxuICAgICAgICAhaXNEdWNrRHVja0dvKHVhKSAmJlxuICAgICAgICAhaXNPcGVyYSh1YSkgJiZcbiAgICAgICAgIWlzU2lsayh1YSkpO1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0R1Y2tEdWNrR28odWEpIHtcbiAgICB1YSA9IHVhIHx8IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50O1xuICAgIHJldHVybiB1YS5pbmRleE9mKFwiRHVja0R1Y2tHby9cIikgIT09IC0xO1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0VkZ2UodWEpIHtcbiAgICB1YSA9IHVhIHx8IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50O1xuICAgIHJldHVybiB1YS5pbmRleE9mKFwiRWRnZS9cIikgIT09IC0xIHx8IHVhLmluZGV4T2YoXCJFZGcvXCIpICE9PSAtMTtcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNJZTkodWEpIHtcbiAgICB1YSA9IHVhIHx8IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50O1xuICAgIHJldHVybiB1YS5pbmRleE9mKFwiTVNJRSA5XCIpICE9PSAtMTtcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBpc0lwYWRPUyA9IHJlcXVpcmUoXCIuL2lzLWlwYWRvc1wiKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNJb3ModWEsIGNoZWNrSXBhZE9TLCBkb2N1bWVudCkge1xuICAgIGlmIChjaGVja0lwYWRPUyA9PT0gdm9pZCAwKSB7IGNoZWNrSXBhZE9TID0gdHJ1ZTsgfVxuICAgIHVhID0gdWEgfHwgd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQ7XG4gICAgdmFyIGlPc1Rlc3QgPSAvaVBob25lfGlQb2R8aVBhZC9pLnRlc3QodWEpO1xuICAgIHJldHVybiBjaGVja0lwYWRPUyA/IGlPc1Rlc3QgfHwgaXNJcGFkT1ModWEsIGRvY3VtZW50KSA6IGlPc1Rlc3Q7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzSXBhZE9TKHVhLCBkb2N1bWVudCkge1xuICAgIHVhID0gdWEgfHwgd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQ7XG4gICAgZG9jdW1lbnQgPSBkb2N1bWVudCB8fCB3aW5kb3cuZG9jdW1lbnQ7XG4gICAgLy8gXCJvbnRvdWNoZW5kXCIgaXMgdXNlZCB0byBkZXRlcm1pbmUgaWYgYSBicm93c2VyIGlzIG9uIGFuIGlQYWQsIG90aGVyd2lzZVxuICAgIC8vIHVzZXItYWdlbnRzIGZvciBpUGFkT1MgYmVoYXZlL2lkZW50aWZ5IGFzIGEgZGVza3RvcCBicm93c2VyXG4gICAgcmV0dXJuIC9NYWN8aVBhZC9pLnRlc3QodWEpICYmIFwib250b3VjaGVuZFwiIGluIGRvY3VtZW50O1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc09wZXJhKHVhKSB7XG4gICAgdWEgPSB1YSB8fCB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudDtcbiAgICByZXR1cm4gKHVhLmluZGV4T2YoXCJPUFIvXCIpICE9PSAtMSB8fFxuICAgICAgICB1YS5pbmRleE9mKFwiT3BlcmEvXCIpICE9PSAtMSB8fFxuICAgICAgICB1YS5pbmRleE9mKFwiT1BUL1wiKSAhPT0gLTEpO1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc1NhbXN1bmdCcm93c2VyKHVhKSB7XG4gICAgdWEgPSB1YSB8fCB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudDtcbiAgICByZXR1cm4gL1NhbXN1bmdCcm93c2VyL2kudGVzdCh1YSk7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzU2lsayh1YSkge1xuICAgIHVhID0gdWEgfHwgd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQ7XG4gICAgcmV0dXJuIHVhLmluZGV4T2YoXCJTaWxrL1wiKSAhPT0gLTE7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi9kaXN0L2lzLWFuZHJvaWRcIik7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuL2Rpc3QvaXMtY2hyb21lLW9zXCIpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi9kaXN0L2lzLWNocm9tZVwiKTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4vZGlzdC9pcy1pZTlcIik7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuL2Rpc3QvaXMtaW9zXCIpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmlzSW9zID0gZXhwb3J0cy5pc0lFOSA9IGV4cG9ydHMuaXNTYW1zdW5nQnJvd3NlciA9IGV4cG9ydHMuaXNBbmRyb2lkQ2hyb21lID0gZXhwb3J0cy5pc0tpdEthdFdlYnZpZXcgPSB2b2lkIDA7XG4vLyBzZXJ2ZXIgc2lkZSByZW5kZXJpbmcgY2hlY2tcbnZhciBVQSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiICYmXG4gICAgd2luZG93Lm5hdmlnYXRvciAmJlxuICAgIHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KTtcbi8vIFRPRE8gcmVtb3ZlIHRoaXMgd2hlbiBicm93c2VyIGRldGVjdGlvbiBpcyBjb252ZXJ0ZWQgdG8gdHlwZXNjcmlwdFxuLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L2Jhbi10cy1jb21tZW50ICovXG4vLyBAdHMtaWdub3JlXG52YXIgaXNBbmRyb2lkID0gcmVxdWlyZShcIkBicmFpbnRyZWUvYnJvd3Nlci1kZXRlY3Rpb24vaXMtYW5kcm9pZFwiKTtcbi8vIEB0cy1pZ25vcmVcbnZhciBpc0Nocm9tZU9zID0gcmVxdWlyZShcIkBicmFpbnRyZWUvYnJvd3Nlci1kZXRlY3Rpb24vaXMtY2hyb21lLW9zXCIpO1xuLy8gQHRzLWlnbm9yZVxudmFyIGlzQ2hyb21lID0gcmVxdWlyZShcIkBicmFpbnRyZWUvYnJvd3Nlci1kZXRlY3Rpb24vaXMtY2hyb21lXCIpO1xuLy8gQHRzLWlnbm9yZVxudmFyIGlzSW9zID0gcmVxdWlyZShcIkBicmFpbnRyZWUvYnJvd3Nlci1kZXRlY3Rpb24vaXMtaW9zXCIpO1xuZXhwb3J0cy5pc0lvcyA9IGlzSW9zO1xuLy8gQHRzLWlnbm9yZVxudmFyIGlzSUU5ID0gcmVxdWlyZShcIkBicmFpbnRyZWUvYnJvd3Nlci1kZXRlY3Rpb24vaXMtaWU5XCIpO1xuZXhwb3J0cy5pc0lFOSA9IGlzSUU5O1xuLyogZXNsaW50LWVuYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvYmFuLXRzLWNvbW1lbnQgKi9cbi8vIE9sZCBBbmRyb2lkIFdlYnZpZXdzIHVzZWQgc3BlY2lmaWMgdmVyc2lvbnMgb2YgQ2hyb21lIHdpdGggMC4wLjAgYXMgdGhlaXIgdmVyc2lvbiBzdWZmaXhcbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLmNocm9tZS5jb20vbXVsdGlkZXZpY2UvdXNlci1hZ2VudCN3ZWJ2aWV3X3VzZXJfYWdlbnRcbnZhciBLSVRLQVRfV0VCVklFV19SRUdFWCA9IC9WZXJzaW9uXFwvXFxkXFwuXFxkKiBDaHJvbWVcXC9cXGQqXFwuMFxcLjBcXC4wLztcbmZ1bmN0aW9uIGlzT2xkU2Ftc3VuZ0Jyb3dzZXJPclNhbXN1bmdXZWJ2aWV3KHVhKSB7XG4gICAgcmV0dXJuICFpc0Nocm9tZSh1YSkgJiYgdWEuaW5kZXhPZihcIlNhbXN1bmdcIikgPiAtMTtcbn1cbmZ1bmN0aW9uIGlzS2l0S2F0V2Vidmlldyh1YSkge1xuICAgIGlmICh1YSA9PT0gdm9pZCAwKSB7IHVhID0gVUE7IH1cbiAgICByZXR1cm4gaXNBbmRyb2lkKHVhKSAmJiBLSVRLQVRfV0VCVklFV19SRUdFWC50ZXN0KHVhKTtcbn1cbmV4cG9ydHMuaXNLaXRLYXRXZWJ2aWV3ID0gaXNLaXRLYXRXZWJ2aWV3O1xuZnVuY3Rpb24gaXNBbmRyb2lkQ2hyb21lKHVhKSB7XG4gICAgaWYgKHVhID09PSB2b2lkIDApIHsgdWEgPSBVQTsgfVxuICAgIHJldHVybiAoaXNBbmRyb2lkKHVhKSB8fCBpc0Nocm9tZU9zKHVhKSkgJiYgaXNDaHJvbWUodWEpO1xufVxuZXhwb3J0cy5pc0FuZHJvaWRDaHJvbWUgPSBpc0FuZHJvaWRDaHJvbWU7XG5mdW5jdGlvbiBpc1NhbXN1bmdCcm93c2VyKHVhKSB7XG4gICAgaWYgKHVhID09PSB2b2lkIDApIHsgdWEgPSBVQTsgfVxuICAgIHJldHVybiAvU2Ftc3VuZ0Jyb3dzZXIvLnRlc3QodWEpIHx8IGlzT2xkU2Ftc3VuZ0Jyb3dzZXJPclNhbXN1bmdXZWJ2aWV3KHVhKTtcbn1cbmV4cG9ydHMuaXNTYW1zdW5nQnJvd3NlciA9IGlzU2Ftc3VuZ0Jyb3dzZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuUGF0dGVybkZvcm1hdHRlciA9IHZvaWQgMDtcbnZhciBwYXJzZV9wYXR0ZXJuXzEgPSByZXF1aXJlKFwiLi9wYXJzZS1wYXR0ZXJuXCIpO1xudmFyIGlzX2JhY2tzcGFjZV8xID0gcmVxdWlyZShcIi4uL2lzLWJhY2tzcGFjZVwiKTtcbnZhciBQYXR0ZXJuRm9ybWF0dGVyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFBhdHRlcm5Gb3JtYXR0ZXIocGF0dGVybikge1xuICAgICAgICB0aGlzLnBhdHRlcm4gPSAoMCwgcGFyc2VfcGF0dGVybl8xLnBhcnNlUGF0dGVybikocGF0dGVybik7XG4gICAgfVxuICAgIFBhdHRlcm5Gb3JtYXR0ZXIucHJvdG90eXBlLmZvcm1hdCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgIHZhciBvcmlnaW5hbFN0cmluZyA9IG9wdGlvbnMudmFsdWU7XG4gICAgICAgIHZhciBvcmlnaW5hbFN0cmluZ0luZGV4ID0gMDtcbiAgICAgICAgdmFyIGZvcm1hdHRlZFN0cmluZyA9IFwiXCI7XG4gICAgICAgIHZhciBzZWxlY3Rpb24gPSB7XG4gICAgICAgICAgICBzdGFydDogb3B0aW9ucy5zZWxlY3Rpb24uc3RhcnQsXG4gICAgICAgICAgICBlbmQ6IG9wdGlvbnMuc2VsZWN0aW9uLmVuZCxcbiAgICAgICAgfTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnBhdHRlcm4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBwYXR0ZXJuQ2hhciA9IHRoaXMucGF0dGVybltpXTtcbiAgICAgICAgICAgIHZhciBpbnB1dENoYXIgPSBvcmlnaW5hbFN0cmluZ1tvcmlnaW5hbFN0cmluZ0luZGV4XTtcbiAgICAgICAgICAgIGlmIChvcmlnaW5hbFN0cmluZ0luZGV4ID4gb3JpZ2luYWxTdHJpbmcubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIHBhdHRlcm5DaGFyLnZhbHVlID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlucHV0Q2hhciAhPSBudWxsIHx8IGZvcm1hdHRlZFN0cmluZy5sZW5ndGggPT09IHBhdHRlcm5DaGFyLmluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdHRlZFN0cmluZyArPSBwYXR0ZXJuQ2hhci52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhdHRlcm5DaGFyLmluZGV4IDw9IHNlbGVjdGlvbi5zdGFydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0aW9uLnN0YXJ0Kys7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhdHRlcm5DaGFyLmluZGV4IDw9IHNlbGVjdGlvbi5lbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvbi5lbmQrKztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIFVzZXIgaW5wdXQgY2hhclxuICAgICAgICAgICAgICAgIC8vIHByZXR0aWVyLWlnbm9yZVxuICAgICAgICAgICAgICAgIGZvciAoOyBvcmlnaW5hbFN0cmluZ0luZGV4IDwgb3JpZ2luYWxTdHJpbmcubGVuZ3RoOyBvcmlnaW5hbFN0cmluZ0luZGV4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXRDaGFyID0gb3JpZ2luYWxTdHJpbmdbb3JpZ2luYWxTdHJpbmdJbmRleF07XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXR0ZXJuQ2hhci52YWx1ZS50ZXN0KGlucHV0Q2hhcikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1hdHRlZFN0cmluZyArPSBpbnB1dENoYXI7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbFN0cmluZ0luZGV4Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXR0ZXJuQ2hhci5pbmRleCA8PSBzZWxlY3Rpb24uc3RhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb24uc3RhcnQtLTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXR0ZXJuQ2hhci5pbmRleCA8PSBzZWxlY3Rpb24uZW5kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0aW9uLmVuZC0tO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2YWx1ZTogZm9ybWF0dGVkU3RyaW5nLFxuICAgICAgICAgICAgc2VsZWN0aW9uOiBzZWxlY3Rpb24sXG4gICAgICAgIH07XG4gICAgfTtcbiAgICBQYXR0ZXJuRm9ybWF0dGVyLnByb3RvdHlwZS51bmZvcm1hdCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgIHZhciBzdGFydCA9IG9wdGlvbnMuc2VsZWN0aW9uLnN0YXJ0O1xuICAgICAgICB2YXIgZW5kID0gb3B0aW9ucy5zZWxlY3Rpb24uZW5kO1xuICAgICAgICB2YXIgdW5mb3JtYXR0ZWRTdHJpbmcgPSBcIlwiO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucGF0dGVybi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHBhdHRlcm5DaGFyID0gdGhpcy5wYXR0ZXJuW2ldO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBwYXR0ZXJuQ2hhci52YWx1ZSAhPT0gXCJzdHJpbmdcIiAmJlxuICAgICAgICAgICAgICAgIG9wdGlvbnMudmFsdWVbaV0gIT0gbnVsbCAmJlxuICAgICAgICAgICAgICAgIHBhdHRlcm5DaGFyLnZhbHVlLnRlc3Qob3B0aW9ucy52YWx1ZVtpXSkpIHtcbiAgICAgICAgICAgICAgICB1bmZvcm1hdHRlZFN0cmluZyArPSBvcHRpb25zLnZhbHVlW2ldO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBhdHRlcm5DaGFyLnZhbHVlICE9PSBvcHRpb25zLnZhbHVlW3BhdHRlcm5DaGFyLmluZGV4XSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBhdHRlcm5DaGFyLmluZGV4IDwgb3B0aW9ucy5zZWxlY3Rpb24uc3RhcnQpIHtcbiAgICAgICAgICAgICAgICBzdGFydC0tO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBhdHRlcm5DaGFyLmluZGV4IDwgb3B0aW9ucy5zZWxlY3Rpb24uZW5kKSB7XG4gICAgICAgICAgICAgICAgZW5kLS07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHNlbGVjdGlvbjoge1xuICAgICAgICAgICAgICAgIHN0YXJ0OiBzdGFydCxcbiAgICAgICAgICAgICAgICBlbmQ6IGVuZCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB2YWx1ZTogdW5mb3JtYXR0ZWRTdHJpbmcsXG4gICAgICAgIH07XG4gICAgfTtcbiAgICBQYXR0ZXJuRm9ybWF0dGVyLnByb3RvdHlwZS5zaW11bGF0ZURlbGV0aW9uID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIGRlbGV0aW9uU3RhcnQsIGRlbGV0aW9uRW5kO1xuICAgICAgICB2YXIgc3RhdGUgPSB0aGlzLnVuZm9ybWF0KG9wdGlvbnMpO1xuICAgICAgICB2YXIgdmFsdWUgPSBzdGF0ZS52YWx1ZTtcbiAgICAgICAgdmFyIHNlbGVjdGlvbiA9IHN0YXRlLnNlbGVjdGlvbjtcbiAgICAgICAgdmFyIGRlbHRhID0gTWF0aC5hYnMoc3RhdGUuc2VsZWN0aW9uLmVuZCAtIHN0YXRlLnNlbGVjdGlvbi5zdGFydCk7XG4gICAgICAgIGlmIChkZWx0YSkge1xuICAgICAgICAgICAgZGVsZXRpb25TdGFydCA9IHNlbGVjdGlvbi5zdGFydDtcbiAgICAgICAgICAgIGRlbGV0aW9uRW5kID0gc2VsZWN0aW9uLmVuZDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICgoMCwgaXNfYmFja3NwYWNlXzEuaXNCYWNrc3BhY2UpKG9wdGlvbnMuZXZlbnQpKSB7XG4gICAgICAgICAgICBkZWxldGlvblN0YXJ0ID0gTWF0aC5tYXgoMCwgc2VsZWN0aW9uLnN0YXJ0IC0gMSk7XG4gICAgICAgICAgICBkZWxldGlvbkVuZCA9IHNlbGVjdGlvbi5zdGFydDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIEhhbmRsZSBmb3J3YXJkIGRlbGV0ZVxuICAgICAgICAgICAgZGVsZXRpb25TdGFydCA9IHNlbGVjdGlvbi5zdGFydDtcbiAgICAgICAgICAgIGRlbGV0aW9uRW5kID0gTWF0aC5taW4odmFsdWUubGVuZ3RoLCBzZWxlY3Rpb24uc3RhcnQgKyAxKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc2VsZWN0aW9uOiB7XG4gICAgICAgICAgICAgICAgc3RhcnQ6IGRlbGV0aW9uU3RhcnQsXG4gICAgICAgICAgICAgICAgZW5kOiBkZWxldGlvblN0YXJ0LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZS5zdWJzdHIoMCwgZGVsZXRpb25TdGFydCkgKyB2YWx1ZS5zdWJzdHIoZGVsZXRpb25FbmQpLFxuICAgICAgICB9O1xuICAgIH07XG4gICAgcmV0dXJuIFBhdHRlcm5Gb3JtYXR0ZXI7XG59KCkpO1xuZXhwb3J0cy5QYXR0ZXJuRm9ybWF0dGVyID0gUGF0dGVybkZvcm1hdHRlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5wYXJzZVBhdHRlcm4gPSB2b2lkIDA7XG52YXIgQUxQSEFfUkVHRVggPSAvW0EtWmEtel0vO1xudmFyIERJR0lUX1JFR0VYID0gL1xcZC87XG52YXIgV0lMRF9SRUdFWCA9IC8uLztcbnZhciBQTEFDRUhPTERFUl9SRUdFWCA9IC9eW0EtWmEtejAtOVxcKl0kLztcbnZhciBQTEFDRUhPTERFUl9QQVRURVJOID0gXCIoe3tbXn1dK319KVwiO1xudmFyIFBFUk1BQ0hBUl9SRUdFWCA9IFwiKFxcXFxzfFxcXFxTKVwiO1xudmFyIFBBVFRFUk5fUkVHRVggPSBuZXcgUmVnRXhwKFBMQUNFSE9MREVSX1BBVFRFUk4gKyBcInxcIiArIFBFUk1BQ0hBUl9SRUdFWCwgXCJnXCIpO1xudmFyIFBMQUNFSE9MREVSX1BBVFRFUk5fUkVHRVggPSBuZXcgUmVnRXhwKFwiXlwiICsgUExBQ0VIT0xERVJfUEFUVEVSTiArIFwiJFwiKTtcbnZhciByZXBsYWNlclJlZ2V4ID0gbmV3IFJlZ0V4cChcInt8fVwiLCBcImdcIik7XG5mdW5jdGlvbiBpc0RpZ2l0KGNoYXIpIHtcbiAgICByZXR1cm4gRElHSVRfUkVHRVgudGVzdChjaGFyKTtcbn1cbmZ1bmN0aW9uIGlzQWxwaGEoY2hhcikge1xuICAgIHJldHVybiBBTFBIQV9SRUdFWC50ZXN0KGNoYXIpO1xufVxuZnVuY3Rpb24gY3JlYXRlUmVnZXhGb3JDaGFyKGNoYXIpIHtcbiAgICBpZiAoaXNEaWdpdChjaGFyKSkge1xuICAgICAgICByZXR1cm4gRElHSVRfUkVHRVg7XG4gICAgfVxuICAgIGVsc2UgaWYgKGlzQWxwaGEoY2hhcikpIHtcbiAgICAgICAgcmV0dXJuIEFMUEhBX1JFR0VYO1xuICAgIH1cbiAgICByZXR1cm4gV0lMRF9SRUdFWDtcbn1cbmZ1bmN0aW9uIGlzUGxhY2Vob2xkZXIoY2hhcikge1xuICAgIHJldHVybiBQTEFDRUhPTERFUl9SRUdFWC50ZXN0KGNoYXIpO1xufVxuZnVuY3Rpb24gaXNQbGFjZWhvbGRlclBhdHRlcm4oc3RyKSB7XG4gICAgcmV0dXJuIFBMQUNFSE9MREVSX1BBVFRFUk5fUkVHRVgudGVzdChzdHIpO1xufVxuZnVuY3Rpb24gcGFyc2VQYXR0ZXJuKHBhdHRlcm5TdHJpbmcpIHtcbiAgICB2YXIgcGF0dGVybkFycmF5ID0gW107XG4gICAgdmFyIHBhdHRlcm5QYXJ0cyA9IHBhdHRlcm5TdHJpbmcubWF0Y2goUEFUVEVSTl9SRUdFWCk7XG4gICAgaWYgKCFwYXR0ZXJuUGFydHMpIHtcbiAgICAgICAgcmV0dXJuIHBhdHRlcm5BcnJheTtcbiAgICB9XG4gICAgZm9yICh2YXIgaW5kZXggPSAwLCBpID0gMDsgaSA8IHBhdHRlcm5QYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgcGF0dGVyblBhcnQgPSBwYXR0ZXJuUGFydHNbaV07XG4gICAgICAgIGlmIChpc1BsYWNlaG9sZGVyUGF0dGVybihwYXR0ZXJuUGFydCkpIHtcbiAgICAgICAgICAgIHZhciBwbGFjZWhvbGRlckNoYXJzID0gcGF0dGVyblBhcnQucmVwbGFjZShyZXBsYWNlclJlZ2V4LCBcIlwiKS5zcGxpdChcIlwiKTtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgcGxhY2Vob2xkZXJDaGFycy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIHZhciBwbGFjZWhvbGRlckNoYXIgPSBwbGFjZWhvbGRlckNoYXJzW2pdO1xuICAgICAgICAgICAgICAgIGlmICghaXNQbGFjZWhvbGRlcihwbGFjZWhvbGRlckNoYXIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk9ubHkgYWxwaGFudW1lcmljIG9yIHdpbGRjYXJkIHBhdHRlcm4gbWF0Y2hlcnMgYXJlIGFsbG93ZWRcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHBhdHRlcm5BcnJheS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGNyZWF0ZVJlZ2V4Rm9yQ2hhcihwbGFjZWhvbGRlckNoYXIpLFxuICAgICAgICAgICAgICAgICAgICBpc1Blcm1hQ2hhcjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGluZGV4OiBpbmRleCsrLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcGF0dGVybkFycmF5LnB1c2goe1xuICAgICAgICAgICAgICAgIHZhbHVlOiBwYXR0ZXJuUGFydCxcbiAgICAgICAgICAgICAgICBpc1Blcm1hQ2hhcjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBpbmRleDogaW5kZXgrKyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwYXR0ZXJuQXJyYXk7XG59XG5leHBvcnRzLnBhcnNlUGF0dGVybiA9IHBhcnNlUGF0dGVybjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5zZXQgPSBleHBvcnRzLmdldCA9IHZvaWQgMDtcbmZ1bmN0aW9uIGdldChlbGVtZW50KSB7XG4gICAgdmFyIHN0YXJ0ID0gZWxlbWVudC5zZWxlY3Rpb25TdGFydCB8fCAwO1xuICAgIHZhciBlbmQgPSBlbGVtZW50LnNlbGVjdGlvbkVuZCB8fCAwO1xuICAgIHJldHVybiB7XG4gICAgICAgIHN0YXJ0OiBzdGFydCxcbiAgICAgICAgZW5kOiBlbmQsXG4gICAgICAgIGRlbHRhOiBNYXRoLmFicyhlbmQgLSBzdGFydCksXG4gICAgfTtcbn1cbmV4cG9ydHMuZ2V0ID0gZ2V0O1xuZnVuY3Rpb24gc2V0KGVsZW1lbnQsIHN0YXJ0LCBlbmQpIHtcbiAgICAvLyBTb21lIGJyb3dzZXJzIGV4cGxvZGUgaWYgeW91IHVzZSBzZXRTZWxlY3Rpb25SYW5nZVxuICAgIC8vIG9uIGEgbm9uLWZvY3VzZWQgZWxlbWVudFxuICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBlbGVtZW50ICYmIGVsZW1lbnQuc2V0U2VsZWN0aW9uUmFuZ2UpIHtcbiAgICAgICAgZWxlbWVudC5zZXRTZWxlY3Rpb25SYW5nZShzdGFydCwgZW5kKTtcbiAgICB9XG59XG5leHBvcnRzLnNldCA9IHNldDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5pc0JhY2tzcGFjZSA9IHZvaWQgMDtcbmZ1bmN0aW9uIGlzQmFja3NwYWNlKGV2ZW50KSB7XG4gICAgcmV0dXJuIGV2ZW50LmtleSA9PT0gXCJCYWNrc3BhY2VcIiB8fCBldmVudC5rZXlDb2RlID09PSA4O1xufVxuZXhwb3J0cy5pc0JhY2tzcGFjZSA9IGlzQmFja3NwYWNlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmlzRGVsZXRlID0gdm9pZCAwO1xudmFyIERFTEVURV9SRUdFWCA9IC9eRGVsKGV0ZSk/JC87XG5mdW5jdGlvbiBpc0RlbGV0ZShldmVudCkge1xuICAgIHJldHVybiBERUxFVEVfUkVHRVgudGVzdChldmVudC5rZXkpIHx8IGV2ZW50LmtleUNvZGUgPT09IDQ2O1xufVxuZXhwb3J0cy5pc0RlbGV0ZSA9IGlzRGVsZXRlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmtleUNhbm5vdE11dGF0ZVZhbHVlID0gdm9pZCAwO1xudmFyIGlucHV0X3NlbGVjdGlvbl8xID0gcmVxdWlyZShcIi4vaW5wdXQtc2VsZWN0aW9uXCIpO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNvbXBsZXhpdHlcbmZ1bmN0aW9uIGtleUNhbm5vdE11dGF0ZVZhbHVlKGV2ZW50KSB7XG4gICAgdmFyIGlucHV0ID0gKGV2ZW50LmN1cnJlbnRUYXJnZXQgfHwgZXZlbnQuc3JjRWxlbWVudCk7XG4gICAgdmFyIHNlbGVjdGlvbiA9ICgwLCBpbnB1dF9zZWxlY3Rpb25fMS5nZXQpKGlucHV0KTtcbiAgICB2YXIgaXNBdEJlZ2lubmluZyA9IHNlbGVjdGlvbi5zdGFydCA9PT0gMDtcbiAgICB2YXIgaXNBdEVuZCA9IHNlbGVjdGlvbi5zdGFydCA9PT0gaW5wdXQudmFsdWUubGVuZ3RoO1xuICAgIHZhciBpc1NoaWZ0ZWQgPSBldmVudC5zaGlmdEtleSA9PT0gdHJ1ZTtcbiAgICAvLyBodHRwczovL3d3dy53My5vcmcvVFIvRE9NLUxldmVsLTMtRXZlbnRzLyN3aWRsLUtleWJvYXJkRXZlbnQta2V5XG4gICAgc3dpdGNoIChldmVudC5rZXkpIHtcbiAgICAgICAgY2FzZSB1bmRlZmluZWQ6IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICAgICAgY2FzZSBcIlVuaWRlbnRpZmllZFwiOiAvLyBDYW5ub3QgYmUgZGV0ZXJtaW5lZFxuICAgICAgICBjYXNlIFwiXCI6IC8vIFVuaW5pdGlhbGl6ZWRcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiQmFja3NwYWNlXCI6IC8vIGJhY2tzcGFjZSBhdCB0aGUgYmVnaW5uaW5nXG4gICAgICAgICAgICByZXR1cm4gaXNBdEJlZ2lubmluZztcbiAgICAgICAgY2FzZSBcIkRlbFwiOiAvLyBkZWxldGUgYXQgdGhlIGVuZFxuICAgICAgICBjYXNlIFwiRGVsZXRlXCI6XG4gICAgICAgICAgICByZXR1cm4gaXNBdEVuZDtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBldmVudC5rZXkubGVuZ3RoICE9PSAxO1xuICAgIH1cbiAgICAvLyBodHRwOi8vdW5peHBhcGEuY29tL2pzL2tleS5odG1sXG4gICAgc3dpdGNoIChldmVudC5rZXlDb2RlKSB7XG4gICAgICAgIGNhc2UgOTogLy8gdGFiXG4gICAgICAgIGNhc2UgMTk6IC8vIHBhdXNlL2JyZWFrXG4gICAgICAgIGNhc2UgMjA6IC8vIGNhcHMgbG9ja1xuICAgICAgICBjYXNlIDI3OiAvLyBlc2NhcGVcbiAgICAgICAgY2FzZSAzOTogLy8gYXJyb3dzXG4gICAgICAgIGNhc2UgNDU6IC8vIGluc2VydFxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIGNhc2UgMzM6IC8vIHBhZ2UgdXAgKGlmIHNoaWZ0ZWQsICchJylcbiAgICAgICAgY2FzZSAzNDogLy8gcGFnZSBkb3duIChpZiBzaGlmdGVkLCAnJycpXG4gICAgICAgIGNhc2UgMzU6IC8vIGVuZCAoaWYgc2hpZnRlZCwgJyMnKVxuICAgICAgICBjYXNlIDM2OiAvLyBob21lIChpZiBzaGlmdGVkLCAnJCcpXG4gICAgICAgIGNhc2UgMzc6IC8vIGFycm93cyAoaWYgc2hpZnRlZCwgJyUnKVxuICAgICAgICBjYXNlIDM4OiAvLyBhcnJvd3MgKGlmIHNoaWZ0ZWQsICcmJylcbiAgICAgICAgY2FzZSA0MDogLy8gYXJyb3dzIChpZiBzaGlmdGVkLCAnKCcpXG4gICAgICAgICAgICByZXR1cm4gIWlzU2hpZnRlZDtcbiAgICAgICAgY2FzZSA4OiAvLyBiYWNrc3BhY2UgYXQgdGhlIGJlZ2lubmluZ1xuICAgICAgICAgICAgcmV0dXJuIGlzQXRCZWdpbm5pbmc7XG4gICAgICAgIGNhc2UgNDY6IC8vIGRlbGV0ZSBhdCB0aGUgZW5kXG4gICAgICAgICAgICByZXR1cm4gaXNBdEVuZDtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG5leHBvcnRzLmtleUNhbm5vdE11dGF0ZVZhbHVlID0ga2V5Q2Fubm90TXV0YXRlVmFsdWU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBkZXZpY2VfMSA9IHJlcXVpcmUoXCIuL2RldmljZVwiKTtcbnZhciBzdXBwb3J0c0lucHV0Rm9ybWF0dGluZyA9IHJlcXVpcmUoXCIuLi9zdXBwb3J0cy1pbnB1dC1mb3JtYXR0aW5nXCIpO1xudmFyIGlvc18xID0gcmVxdWlyZShcIi4vc3RyYXRlZ2llcy9pb3NcIik7XG52YXIgYW5kcm9pZF9jaHJvbWVfMSA9IHJlcXVpcmUoXCIuL3N0cmF0ZWdpZXMvYW5kcm9pZC1jaHJvbWVcIik7XG52YXIga2l0a2F0X2Nocm9taXVtX2Jhc2VkX3dlYnZpZXdfMSA9IHJlcXVpcmUoXCIuL3N0cmF0ZWdpZXMva2l0a2F0LWNocm9taXVtLWJhc2VkLXdlYnZpZXdcIik7XG52YXIgaWU5XzEgPSByZXF1aXJlKFwiLi9zdHJhdGVnaWVzL2llOVwiKTtcbnZhciBiYXNlXzEgPSByZXF1aXJlKFwiLi9zdHJhdGVnaWVzL2Jhc2VcIik7XG52YXIgbm9vcF8xID0gcmVxdWlyZShcIi4vc3RyYXRlZ2llcy9ub29wXCIpO1xuLyoqXG4gKiBJbnN0YW5jZXMgb2YgdGhpcyBjbGFzcyBjYW4gYmUgdXNlZCB0byBtb2RpZnkgdGhlIGZvcm1hdHRlciBmb3IgYW4gaW5wdXRcbiAqIEBjbGFzc1xuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgVGhlIGluaXRpYWxpemF0aW9uIHBhcmFtYXRlcnMgZm9yIHRoaXMgY2xhc3NcbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zLmVsZW1lbnQgLSBBIElucHV0IERPTSBvYmplY3QgdGhhdCBSZXN0cmljdGVkSW5wdXQgb3BlcmF0ZXMgb25cbiAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLnBhdHRlcm4gLSBUaGUgcGF0dGVybiB0byBlbmZvcmNlIG9uIHRoaXMgZWxlbWVudFxuICovXG52YXIgUmVzdHJpY3RlZElucHV0ID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFJlc3RyaWN0ZWRJbnB1dChvcHRpb25zKSB7XG4gICAgICAgIGlmICghUmVzdHJpY3RlZElucHV0LnN1cHBvcnRzRm9ybWF0dGluZygpKSB7XG4gICAgICAgICAgICB0aGlzLnN0cmF0ZWd5ID0gbmV3IG5vb3BfMS5Ob29wS2V5Ym9hcmRTdHJhdGVneShvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICgoMCwgZGV2aWNlXzEuaXNJb3MpKCkpIHtcbiAgICAgICAgICAgIHRoaXMuc3RyYXRlZ3kgPSBuZXcgaW9zXzEuSW9zU3RyYXRlZ3kob3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoKDAsIGRldmljZV8xLmlzS2l0S2F0V2VidmlldykoKSkge1xuICAgICAgICAgICAgdGhpcy5zdHJhdGVneSA9IG5ldyBraXRrYXRfY2hyb21pdW1fYmFzZWRfd2Vidmlld18xLktpdEthdENocm9taXVtQmFzZWRXZWJWaWV3U3RyYXRlZ3kob3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoKDAsIGRldmljZV8xLmlzQW5kcm9pZENocm9tZSkoKSkge1xuICAgICAgICAgICAgdGhpcy5zdHJhdGVneSA9IG5ldyBhbmRyb2lkX2Nocm9tZV8xLkFuZHJvaWRDaHJvbWVTdHJhdGVneShvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICgoMCwgZGV2aWNlXzEuaXNJRTkpKCkpIHtcbiAgICAgICAgICAgIHRoaXMuc3RyYXRlZ3kgPSBuZXcgaWU5XzEuSUU5U3RyYXRlZ3kob3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnN0cmF0ZWd5ID0gbmV3IGJhc2VfMS5CYXNlU3RyYXRlZ3kob3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogQHB1YmxpY1xuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IHRoZSB1bmZvcm1hdHRlZCB2YWx1ZSBvZiB0aGUgZWxlbWVudFxuICAgICAqL1xuICAgIFJlc3RyaWN0ZWRJbnB1dC5wcm90b3R5cGUuZ2V0VW5mb3JtYXR0ZWRWYWx1ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RyYXRlZ3kuZ2V0VW5mb3JtYXR0ZWRWYWx1ZSgpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQHB1YmxpY1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwYXR0ZXJuIC0gdGhlIHBhdHRlcm4gdG8gZW5mb3JjZSBvbiB0aGUgZWxlbWVudFxuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICovXG4gICAgUmVzdHJpY3RlZElucHV0LnByb3RvdHlwZS5zZXRQYXR0ZXJuID0gZnVuY3Rpb24gKHBhdHRlcm4pIHtcbiAgICAgICAgdGhpcy5zdHJhdGVneS5zZXRQYXR0ZXJuKHBhdHRlcm4pO1xuICAgIH07XG4gICAgUmVzdHJpY3RlZElucHV0LnN1cHBvcnRzRm9ybWF0dGluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHN1cHBvcnRzSW5wdXRGb3JtYXR0aW5nKCk7XG4gICAgfTtcbiAgICByZXR1cm4gUmVzdHJpY3RlZElucHV0O1xufSgpKTtcbm1vZHVsZS5leHBvcnRzID0gUmVzdHJpY3RlZElucHV0O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XG4gICAgICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xuICAgICAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xuICAgIH07XG59KSgpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5BbmRyb2lkQ2hyb21lU3RyYXRlZ3kgPSB2b2lkIDA7XG52YXIga2V5X2Nhbm5vdF9tdXRhdGVfdmFsdWVfMSA9IHJlcXVpcmUoXCIuLi9rZXktY2Fubm90LW11dGF0ZS12YWx1ZVwiKTtcbnZhciBiYXNlXzEgPSByZXF1aXJlKFwiLi9iYXNlXCIpO1xudmFyIGlucHV0X3NlbGVjdGlvbl8xID0gcmVxdWlyZShcIi4uL2lucHV0LXNlbGVjdGlvblwiKTtcbnZhciBBbmRyb2lkQ2hyb21lU3RyYXRlZ3kgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKEFuZHJvaWRDaHJvbWVTdHJhdGVneSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBBbmRyb2lkQ2hyb21lU3RyYXRlZ3koKSB7XG4gICAgICAgIHJldHVybiBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcbiAgICB9XG4gICAgQW5kcm9pZENocm9tZVN0cmF0ZWd5LnByb3RvdHlwZS5hdHRhY2hMaXN0ZW5lcnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuaW5wdXRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgaWYgKCgwLCBrZXlfY2Fubm90X211dGF0ZV92YWx1ZV8xLmtleUNhbm5vdE11dGF0ZVZhbHVlKShldmVudCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfdGhpcy51bmZvcm1hdElucHV0KCk7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyAna2V5cHJlc3MnIGlzIG5vdCBmaXJlZCB3aXRoIHNvbWUgQW5kcm9pZCBrZXlib2FyZHMgKHNlZSAjMjMpXG4gICAgICAgIHRoaXMuaW5wdXRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlwcmVzc1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGlmICgoMCwga2V5X2Nhbm5vdF9tdXRhdGVfdmFsdWVfMS5rZXlDYW5ub3RNdXRhdGVWYWx1ZSkoZXZlbnQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX3RoaXMudW5mb3JtYXRJbnB1dCgpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5pbnB1dEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF90aGlzLnJlZm9ybWF0SW5wdXQoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuaW5wdXRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfdGhpcy5yZWZvcm1hdElucHV0KCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmlucHV0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwicGFzdGVcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgX3RoaXMucGFzdGVFdmVudEhhbmRsZXIoZXZlbnQpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIEFuZHJvaWRDaHJvbWVTdHJhdGVneS5wcm90b3R5cGUucHJlUGFzdGVFdmVudEhhbmRsZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIHRoZSBkZWZhdWx0IHN0cmF0ZWd5IGNhbGxzIHByZXZlbnREZWZhdWx0IGhlcmVcbiAgICAgICAgLy8gYnV0IHRoYXQgcmVtb3ZlcyB0aGUgY2xpcGJvYXJkIGRhdGEgaW4gQW5kcm9pZCBjaHJvbWVcbiAgICAgICAgLy8gc28gd2Ugbm9vcCBpbnN0ZWFkXG4gICAgfTtcbiAgICBBbmRyb2lkQ2hyb21lU3RyYXRlZ3kucHJvdG90eXBlLnBvc3RQYXN0ZUV2ZW50SGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgLy8gdGhlIGRlZmF1bHQgc3RyYXRlZ3kgY2FsbHMgdGhpcyB3aXRob3V0IGEgdGltZW91dFxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF90aGlzLnJlZm9ybWF0QWZ0ZXJQYXN0ZSgpO1xuICAgICAgICB9LCAwKTtcbiAgICB9O1xuICAgIEFuZHJvaWRDaHJvbWVTdHJhdGVneS5wcm90b3R5cGUuYWZ0ZXJSZWZvcm1hdElucHV0ID0gZnVuY3Rpb24gKGZvcm1hdHRlZFN0YXRlKSB7XG4gICAgICAgIHZhciBpbnB1dCA9IHRoaXMuaW5wdXRFbGVtZW50O1xuICAgICAgICAvLyBTb21lIEFuZHJvaWQgQ2hyb21lIGtleWJvYXJkcyAobm90YWJseSBTYW1zdW5nKVxuICAgICAgICAvLyBjYXVzZSB0aGUgYnJvd3NlciB0byBub3Qga25vdyB0aGF0IHRoZSB2YWx1ZVxuICAgICAgICAvLyBvZiB0aGUgaW5wdXQgaGFzIGNoYW5nZWQgd2hlbiBhZGRpbmdcbiAgICAgICAgLy8gcGVybWFjaGFyYWN0ZXJzLiBUaGlzIHJlc3VsdHMgaW4gdGhlIHNlbGVjdGlvblxuICAgICAgICAvLyBwdXR0aW5nIHRoZSBjdXJzb3IgYmVmb3JlIHRoZSBwZXJtYWNoYXJhY3RlcixcbiAgICAgICAgLy8gaW5zdGVhZCBvZiBhZnRlci5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gVGhlcmUgaXMgYWxzbyB0aGUgY2FzZSBvZiBzb21lIEFuZHJvaWQgQ2hyb21lXG4gICAgICAgIC8vIGtleWJvYXJkcyByZXBvcnRpbmcgYSByYW5nZWQgc2VsZWN0aW9uIG9uIHRoZVxuICAgICAgICAvLyBmaXJzdCBjaGFyYWN0ZXIgaW5wdXQuIFJlc3RyaWN0ZWQgSW5wdXQgbWFpbnRhaW5zXG4gICAgICAgIC8vIHRoYXQgcmFuZ2UgZXZlbiB0aG91Z2ggaXQgaXMgaW5jb3JyZWN0IGZyb20gdGhlXG4gICAgICAgIC8vIGtleWJvYXJkLlxuICAgICAgICAvL1xuICAgICAgICAvLyBUbyByZXNvbHZlIHRoZXNlIGlzc3VlcyB3ZSBzZXRUaW1lb3V0IGFuZCByZXNldFxuICAgICAgICAvLyB0aGUgc2VsZWN0aW9uIHRvIHRoZSBmb3JtYXR0ZWQgZW5kIHBvc2l0aW9uLlxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBmb3JtYXR0ZWRTZWxlY3Rpb24gPSBmb3JtYXR0ZWRTdGF0ZS5zZWxlY3Rpb247XG4gICAgICAgICAgICAoMCwgaW5wdXRfc2VsZWN0aW9uXzEuc2V0KShpbnB1dCwgZm9ybWF0dGVkU2VsZWN0aW9uLmVuZCwgZm9ybWF0dGVkU2VsZWN0aW9uLmVuZCk7XG4gICAgICAgIH0sIDApO1xuICAgIH07XG4gICAgcmV0dXJuIEFuZHJvaWRDaHJvbWVTdHJhdGVneTtcbn0oYmFzZV8xLkJhc2VTdHJhdGVneSkpO1xuZXhwb3J0cy5BbmRyb2lkQ2hyb21lU3RyYXRlZ3kgPSBBbmRyb2lkQ2hyb21lU3RyYXRlZ3k7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcbiAgICAgICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBwKSkgZFtwXSA9IGJbcF07IH07XG4gICAgICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYiAhPT0gXCJmdW5jdGlvblwiICYmIGIgIT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2xhc3MgZXh0ZW5kcyB2YWx1ZSBcIiArIFN0cmluZyhiKSArIFwiIGlzIG5vdCBhIGNvbnN0cnVjdG9yIG9yIG51bGxcIik7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG4gICAgfTtcbn0pKCk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkJhc2VTdHJhdGVneSA9IHZvaWQgMDtcbnZhciBzdHJhdGVneV9pbnRlcmZhY2VfMSA9IHJlcXVpcmUoXCIuL3N0cmF0ZWd5LWludGVyZmFjZVwiKTtcbnZhciBrZXlfY2Fubm90X211dGF0ZV92YWx1ZV8xID0gcmVxdWlyZShcIi4uL2tleS1jYW5ub3QtbXV0YXRlLXZhbHVlXCIpO1xudmFyIGlucHV0X3NlbGVjdGlvbl8xID0gcmVxdWlyZShcIi4uL2lucHV0LXNlbGVjdGlvblwiKTtcbnZhciBpc19iYWNrc3BhY2VfMSA9IHJlcXVpcmUoXCIuLi9pcy1iYWNrc3BhY2VcIik7XG52YXIgaXNfZGVsZXRlXzEgPSByZXF1aXJlKFwiLi4vaXMtZGVsZXRlXCIpO1xudmFyIGZvcm1hdHRlcl8xID0gcmVxdWlyZShcIi4uL2Zvcm1hdHRlclwiKTtcbmZ1bmN0aW9uIGlzU2ltdWxhdGVkRXZlbnQoZXZlbnQpIHtcbiAgICAvLyAxUGFzc3dvcmQgc2V0cyBpbnB1dC52YWx1ZSB0aGVuIGZpcmVzIGtleWJvYXJkIGV2ZW50cy4gRGVwZW5kZW50IG9uIGJyb3dzZXJcbiAgICAvLyBoZXJlIG1pZ2h0IGJlIGZhbHN5IHZhbHVlcyAoa2V5ID0gJycsIGtleUNvZGUgPSAwKSBvciB0aGVzZSBrZXlzIG1pZ2h0IGJlIG9taXR0ZWRcbiAgICAvLyBDaHJvbWUgYXV0b2ZpbGwgaW5zZXJ0cyBrZXlzIGFsbCBhdCBvbmNlIGFuZCBmaXJlcyBhIHNpbmdsZSBldmVudCB3aXRob3V0IGtleSBpbmZvXG4gICAgcmV0dXJuICFldmVudC5rZXkgJiYgIWV2ZW50LmtleUNvZGU7XG59XG52YXIgQmFzZVN0cmF0ZWd5ID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhCYXNlU3RyYXRlZ3ksIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gQmFzZVN0cmF0ZWd5KG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgb3B0aW9ucykgfHwgdGhpcztcbiAgICAgICAgX3RoaXMuZm9ybWF0dGVyID0gbmV3IGZvcm1hdHRlcl8xLlBhdHRlcm5Gb3JtYXR0ZXIob3B0aW9ucy5wYXR0ZXJuKTtcbiAgICAgICAgX3RoaXMub25QYXN0ZUV2ZW50ID0gb3B0aW9ucy5vblBhc3RlRXZlbnQ7XG4gICAgICAgIF90aGlzLmF0dGFjaExpc3RlbmVycygpO1xuICAgICAgICBfdGhpcy5mb3JtYXRJZk5vdEVtcHR5KCk7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgQmFzZVN0cmF0ZWd5LnByb3RvdHlwZS5nZXRVbmZvcm1hdHRlZFZhbHVlID0gZnVuY3Rpb24gKGZvcmNlVW5mb3JtYXQpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gdGhpcy5pbnB1dEVsZW1lbnQudmFsdWU7XG4gICAgICAgIGlmIChmb3JjZVVuZm9ybWF0IHx8IHRoaXMuaXNGb3JtYXR0ZWQpIHtcbiAgICAgICAgICAgIHZhbHVlID0gdGhpcy5mb3JtYXR0ZXIudW5mb3JtYXQoe1xuICAgICAgICAgICAgICAgIHZhbHVlOiB0aGlzLmlucHV0RWxlbWVudC52YWx1ZSxcbiAgICAgICAgICAgICAgICBzZWxlY3Rpb246IHsgc3RhcnQ6IDAsIGVuZDogMCB9LFxuICAgICAgICAgICAgfSkudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH07XG4gICAgQmFzZVN0cmF0ZWd5LnByb3RvdHlwZS5mb3JtYXRJZk5vdEVtcHR5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5pbnB1dEVsZW1lbnQudmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMucmVmb3JtYXRJbnB1dCgpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBCYXNlU3RyYXRlZ3kucHJvdG90eXBlLnNldFBhdHRlcm4gPSBmdW5jdGlvbiAocGF0dGVybikge1xuICAgICAgICB0aGlzLnVuZm9ybWF0SW5wdXQoKTtcbiAgICAgICAgdGhpcy5mb3JtYXR0ZXIgPSBuZXcgZm9ybWF0dGVyXzEuUGF0dGVybkZvcm1hdHRlcihwYXR0ZXJuKTtcbiAgICAgICAgdGhpcy5mb3JtYXRJZk5vdEVtcHR5KCk7XG4gICAgfTtcbiAgICBCYXNlU3RyYXRlZ3kucHJvdG90eXBlLmF0dGFjaExpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5pbnB1dEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHZhciBldmVudCA9IGU7XG4gICAgICAgICAgICBpZiAoaXNTaW11bGF0ZWRFdmVudChldmVudCkpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5pc0Zvcm1hdHRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCgwLCBrZXlfY2Fubm90X211dGF0ZV92YWx1ZV8xLmtleUNhbm5vdE11dGF0ZVZhbHVlKShldmVudCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoX3RoaXMuaXNEZWxldGlvbihldmVudCkpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy51bmZvcm1hdElucHV0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmlucHV0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5cHJlc3NcIiwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHZhciBldmVudCA9IGU7XG4gICAgICAgICAgICBpZiAoaXNTaW11bGF0ZWRFdmVudChldmVudCkpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5pc0Zvcm1hdHRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCgwLCBrZXlfY2Fubm90X211dGF0ZV92YWx1ZV8xLmtleUNhbm5vdE11dGF0ZVZhbHVlKShldmVudCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfdGhpcy51bmZvcm1hdElucHV0KCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmlucHV0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3RoaXMucmVmb3JtYXRJbnB1dCgpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5pbnB1dEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgLy8gU2FmYXJpIEF1dG9GaWxsIGZpcmVzIEN1c3RvbUV2ZW50c1xuICAgICAgICAgICAgLy8gTGFzdFBhc3Mgc2VuZHMgYW4gYGlzVHJ1c3RlZDogZmFsc2VgIHByb3BlcnR5XG4gICAgICAgICAgICAvLyBTaW5jZSB0aGUgaW5wdXQgaXMgY2hhbmdlZCBhbGwgYXQgb25jZSwgc2V0IGlzRm9ybWF0dGVkXG4gICAgICAgICAgICAvLyB0byBmYWxzZSBzbyB0aGF0IHJlZm9ybWF0dGluZyBhY3R1YWxseSBvY2N1cnNcbiAgICAgICAgICAgIGlmIChldmVudCBpbnN0YW5jZW9mIEN1c3RvbUV2ZW50IHx8ICFldmVudC5pc1RydXN0ZWQpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5pc0Zvcm1hdHRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX3RoaXMucmVmb3JtYXRJbnB1dCgpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5pbnB1dEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInBhc3RlXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgX3RoaXMucGFzdGVFdmVudEhhbmRsZXIoZXZlbnQpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIEJhc2VTdHJhdGVneS5wcm90b3R5cGUuaXNEZWxldGlvbiA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICByZXR1cm4gKDAsIGlzX2RlbGV0ZV8xLmlzRGVsZXRlKShldmVudCkgfHwgKDAsIGlzX2JhY2tzcGFjZV8xLmlzQmFja3NwYWNlKShldmVudCk7XG4gICAgfTtcbiAgICBCYXNlU3RyYXRlZ3kucHJvdG90eXBlLnJlZm9ybWF0SW5wdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzRm9ybWF0dGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pc0Zvcm1hdHRlZCA9IHRydWU7XG4gICAgICAgIHZhciBpbnB1dCA9IHRoaXMuaW5wdXRFbGVtZW50O1xuICAgICAgICB2YXIgZm9ybWF0dGVkU3RhdGUgPSB0aGlzLmZvcm1hdHRlci5mb3JtYXQoe1xuICAgICAgICAgICAgc2VsZWN0aW9uOiAoMCwgaW5wdXRfc2VsZWN0aW9uXzEuZ2V0KShpbnB1dCksXG4gICAgICAgICAgICB2YWx1ZTogaW5wdXQudmFsdWUsXG4gICAgICAgIH0pO1xuICAgICAgICBpbnB1dC52YWx1ZSA9IGZvcm1hdHRlZFN0YXRlLnZhbHVlO1xuICAgICAgICAoMCwgaW5wdXRfc2VsZWN0aW9uXzEuc2V0KShpbnB1dCwgZm9ybWF0dGVkU3RhdGUuc2VsZWN0aW9uLnN0YXJ0LCBmb3JtYXR0ZWRTdGF0ZS5zZWxlY3Rpb24uZW5kKTtcbiAgICAgICAgdGhpcy5hZnRlclJlZm9ybWF0SW5wdXQoZm9ybWF0dGVkU3RhdGUpO1xuICAgIH07XG4gICAgLy8gSWYgYSBzdHJhdGVneSBuZWVkcyB0byBpbXBsaW1lbnQgc3BlY2lmaWMgYmVoYXZpb3JcbiAgICAvLyBhZnRlciByZWZvcm1hdHRpbmcgaGFzIGhhcHBlbmQsIHRoZSBzdHJhdGVneSBqdXN0XG4gICAgLy8gb3ZlcndyaXRlcyB0aGlzIG1ldGhvZCBvbiB0aGVpciBvd24gcHJvdG90eXBlXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnVzZWQtdmFyc1xuICAgIEJhc2VTdHJhdGVneS5wcm90b3R5cGUuYWZ0ZXJSZWZvcm1hdElucHV0ID0gZnVuY3Rpb24gKGZvcm1hdHRlZFN0YXRlKSB7XG4gICAgICAgIC8vIG5vb3BcbiAgICB9O1xuICAgIEJhc2VTdHJhdGVneS5wcm90b3R5cGUudW5mb3JtYXRJbnB1dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzRm9ybWF0dGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pc0Zvcm1hdHRlZCA9IGZhbHNlO1xuICAgICAgICB2YXIgaW5wdXQgPSB0aGlzLmlucHV0RWxlbWVudDtcbiAgICAgICAgdmFyIHNlbGVjdGlvbiA9ICgwLCBpbnB1dF9zZWxlY3Rpb25fMS5nZXQpKGlucHV0KTtcbiAgICAgICAgdmFyIHVuZm9ybWF0dGVkU3RhdGUgPSB0aGlzLmZvcm1hdHRlci51bmZvcm1hdCh7XG4gICAgICAgICAgICBzZWxlY3Rpb246IHNlbGVjdGlvbixcbiAgICAgICAgICAgIHZhbHVlOiBpbnB1dC52YWx1ZSxcbiAgICAgICAgfSk7XG4gICAgICAgIGlucHV0LnZhbHVlID0gdW5mb3JtYXR0ZWRTdGF0ZS52YWx1ZTtcbiAgICAgICAgKDAsIGlucHV0X3NlbGVjdGlvbl8xLnNldCkoaW5wdXQsIHVuZm9ybWF0dGVkU3RhdGUuc2VsZWN0aW9uLnN0YXJ0LCB1bmZvcm1hdHRlZFN0YXRlLnNlbGVjdGlvbi5lbmQpO1xuICAgIH07XG4gICAgQmFzZVN0cmF0ZWd5LnByb3RvdHlwZS5wcmVQYXN0ZUV2ZW50SGFuZGxlciA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAvLyB3aXRob3V0IHRoaXMsIHRoZSBwYXN0ZSBldmVudCBpcyBjYWxsZWQgdHdpY2VcbiAgICAgICAgLy8gc28gaWYgeW91IHdlcmUgcGFzdGluZyBhYmMgaXQgd291bGQgcmVzdWx0IGluXG4gICAgICAgIC8vIGFiY2FiY1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH07XG4gICAgQmFzZVN0cmF0ZWd5LnByb3RvdHlwZS5wb3N0UGFzdGVFdmVudEhhbmRsZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMucmVmb3JtYXRBZnRlclBhc3RlKCk7XG4gICAgfTtcbiAgICBCYXNlU3RyYXRlZ3kucHJvdG90eXBlLnBhc3RlRXZlbnRIYW5kbGVyID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHZhciBzcGxpY2VkRW50cnk7XG4gICAgICAgIHZhciBlbnRyeVZhbHVlID0gXCJcIjtcbiAgICAgICAgdGhpcy5wcmVQYXN0ZUV2ZW50SGFuZGxlcihldmVudCk7XG4gICAgICAgIHRoaXMudW5mb3JtYXRJbnB1dCgpO1xuICAgICAgICBpZiAoZXZlbnQuY2xpcGJvYXJkRGF0YSkge1xuICAgICAgICAgICAgZW50cnlWYWx1ZSA9IGV2ZW50LmNsaXBib2FyZERhdGEuZ2V0RGF0YShcIlRleHRcIik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAod2luZG93LmNsaXBib2FyZERhdGEpIHtcbiAgICAgICAgICAgIGVudHJ5VmFsdWUgPSB3aW5kb3cuY2xpcGJvYXJkRGF0YS5nZXREYXRhKFwiVGV4dFwiKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgc2VsZWN0aW9uID0gKDAsIGlucHV0X3NlbGVjdGlvbl8xLmdldCkodGhpcy5pbnB1dEVsZW1lbnQpO1xuICAgICAgICBzcGxpY2VkRW50cnkgPSB0aGlzLmlucHV0RWxlbWVudC52YWx1ZS5zcGxpdChcIlwiKTtcbiAgICAgICAgc3BsaWNlZEVudHJ5LnNwbGljZShzZWxlY3Rpb24uc3RhcnQsIHNlbGVjdGlvbi5lbmQgLSBzZWxlY3Rpb24uc3RhcnQsIGVudHJ5VmFsdWUpO1xuICAgICAgICBzcGxpY2VkRW50cnkgPSBzcGxpY2VkRW50cnkuam9pbihcIlwiKTtcbiAgICAgICAgaWYgKHRoaXMub25QYXN0ZUV2ZW50KSB7XG4gICAgICAgICAgICB0aGlzLm9uUGFzdGVFdmVudCh7XG4gICAgICAgICAgICAgICAgdW5mb3JtYXR0ZWRJbnB1dFZhbHVlOiBzcGxpY2VkRW50cnksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmlucHV0RWxlbWVudC52YWx1ZSA9IHNwbGljZWRFbnRyeTtcbiAgICAgICAgKDAsIGlucHV0X3NlbGVjdGlvbl8xLnNldCkodGhpcy5pbnB1dEVsZW1lbnQsIHNlbGVjdGlvbi5zdGFydCArIGVudHJ5VmFsdWUubGVuZ3RoLCBzZWxlY3Rpb24uc3RhcnQgKyBlbnRyeVZhbHVlLmxlbmd0aCk7XG4gICAgICAgIHRoaXMucG9zdFBhc3RlRXZlbnRIYW5kbGVyKCk7XG4gICAgfTtcbiAgICBCYXNlU3RyYXRlZ3kucHJvdG90eXBlLnJlZm9ybWF0QWZ0ZXJQYXN0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoXCJFdmVudFwiKTtcbiAgICAgICAgdGhpcy5yZWZvcm1hdElucHV0KCk7XG4gICAgICAgIGV2ZW50LmluaXRFdmVudChcImlucHV0XCIsIHRydWUsIHRydWUpO1xuICAgICAgICB0aGlzLmlucHV0RWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICB9O1xuICAgIEJhc2VTdHJhdGVneS5wcm90b3R5cGUuZ2V0U3RhdGVUb0Zvcm1hdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGlucHV0ID0gdGhpcy5pbnB1dEVsZW1lbnQ7XG4gICAgICAgIHZhciBzZWxlY3Rpb24gPSAoMCwgaW5wdXRfc2VsZWN0aW9uXzEuZ2V0KShpbnB1dCk7XG4gICAgICAgIHZhciBzdGF0ZVRvRm9ybWF0ID0ge1xuICAgICAgICAgICAgc2VsZWN0aW9uOiBzZWxlY3Rpb24sXG4gICAgICAgICAgICB2YWx1ZTogaW5wdXQudmFsdWUsXG4gICAgICAgIH07XG4gICAgICAgIGlmICh0aGlzLnN0YXRlVG9Gb3JtYXQpIHtcbiAgICAgICAgICAgIHN0YXRlVG9Gb3JtYXQgPSB0aGlzLnN0YXRlVG9Gb3JtYXQ7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5zdGF0ZVRvRm9ybWF0O1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHNlbGVjdGlvbi5zdGFydCA9PT0gaW5wdXQudmFsdWUubGVuZ3RoICYmIHRoaXMuaXNGb3JtYXR0ZWQpIHtcbiAgICAgICAgICAgIHN0YXRlVG9Gb3JtYXQgPSB0aGlzLmZvcm1hdHRlci51bmZvcm1hdChzdGF0ZVRvRm9ybWF0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3RhdGVUb0Zvcm1hdDtcbiAgICB9O1xuICAgIHJldHVybiBCYXNlU3RyYXRlZ3k7XG59KHN0cmF0ZWd5X2ludGVyZmFjZV8xLlN0cmF0ZWd5SW50ZXJmYWNlKSk7XG5leHBvcnRzLkJhc2VTdHJhdGVneSA9IEJhc2VTdHJhdGVneTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxuICAgICAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxuICAgICAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBiICE9PSBcImZ1bmN0aW9uXCIgJiYgYiAhPT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiICsgU3RyaW5nKGIpICsgXCIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbFwiKTtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbiAgICB9O1xufSkoKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuSUU5U3RyYXRlZ3kgPSB2b2lkIDA7XG52YXIgYmFzZV8xID0gcmVxdWlyZShcIi4vYmFzZVwiKTtcbnZhciBrZXlfY2Fubm90X211dGF0ZV92YWx1ZV8xID0gcmVxdWlyZShcIi4uL2tleS1jYW5ub3QtbXV0YXRlLXZhbHVlXCIpO1xudmFyIGlucHV0X3NlbGVjdGlvbl8xID0gcmVxdWlyZShcIi4uL2lucHV0LXNlbGVjdGlvblwiKTtcbmZ1bmN0aW9uIHBhZFNlbGVjdGlvbihzZWxlY3Rpb24sIHBhZCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHN0YXJ0OiBzZWxlY3Rpb24uc3RhcnQgKyBwYWQsXG4gICAgICAgIGVuZDogc2VsZWN0aW9uLmVuZCArIHBhZCxcbiAgICB9O1xufVxudmFyIElFOVN0cmF0ZWd5ID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhJRTlTdHJhdGVneSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBJRTlTdHJhdGVneSgpIHtcbiAgICAgICAgcmV0dXJuIF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xuICAgIH1cbiAgICBJRTlTdHJhdGVneS5wcm90b3R5cGUuZ2V0VW5mb3JtYXR0ZWRWYWx1ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGJhc2VfMS5CYXNlU3RyYXRlZ3kucHJvdG90eXBlLmdldFVuZm9ybWF0dGVkVmFsdWUuY2FsbCh0aGlzLCB0cnVlKTtcbiAgICB9O1xuICAgIElFOVN0cmF0ZWd5LnByb3RvdHlwZS5hdHRhY2hMaXN0ZW5lcnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuaW5wdXRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgX3RoaXMua2V5ZG93bkxpc3RlbmVyKGV2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuaW5wdXRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfdGhpcy5mb3JtYXQoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuaW5wdXRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJwYXN0ZVwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIF90aGlzLnBhc3RlRXZlbnRIYW5kbGVyKGV2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBJRTlTdHJhdGVneS5wcm90b3R5cGUuZm9ybWF0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaW5wdXQgPSB0aGlzLmlucHV0RWxlbWVudDtcbiAgICAgICAgdmFyIHN0YXRlVG9Gb3JtYXQgPSB0aGlzLmdldFN0YXRlVG9Gb3JtYXQoKTtcbiAgICAgICAgdmFyIGZvcm1hdHRlZFN0YXRlID0gdGhpcy5mb3JtYXR0ZXIuZm9ybWF0KHN0YXRlVG9Gb3JtYXQpO1xuICAgICAgICBpbnB1dC52YWx1ZSA9IGZvcm1hdHRlZFN0YXRlLnZhbHVlO1xuICAgICAgICAoMCwgaW5wdXRfc2VsZWN0aW9uXzEuc2V0KShpbnB1dCwgZm9ybWF0dGVkU3RhdGUuc2VsZWN0aW9uLnN0YXJ0LCBmb3JtYXR0ZWRTdGF0ZS5zZWxlY3Rpb24uZW5kKTtcbiAgICB9O1xuICAgIElFOVN0cmF0ZWd5LnByb3RvdHlwZS5rZXlkb3duTGlzdGVuZXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgaWYgKCgwLCBrZXlfY2Fubm90X211dGF0ZV92YWx1ZV8xLmtleUNhbm5vdE11dGF0ZVZhbHVlKShldmVudCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBpZiAodGhpcy5pc0RlbGV0aW9uKGV2ZW50KSkge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZVRvRm9ybWF0ID0gdGhpcy5mb3JtYXR0ZXIuc2ltdWxhdGVEZWxldGlvbih7XG4gICAgICAgICAgICAgICAgZXZlbnQ6IGV2ZW50LFxuICAgICAgICAgICAgICAgIHNlbGVjdGlvbjogKDAsIGlucHV0X3NlbGVjdGlvbl8xLmdldCkodGhpcy5pbnB1dEVsZW1lbnQpLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB0aGlzLmlucHV0RWxlbWVudC52YWx1ZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gSUU5IGRvZXMgbm90IHVwZGF0ZSB0aGUgaW5wdXQncyB2YWx1ZSBhdHRyaWJ1dGVcbiAgICAgICAgICAgIC8vIGR1cmluZyBrZXkgZXZlbnRzLCBvbmx5IGFmdGVyIHRoZXkgY29tcGxldGUuXG4gICAgICAgICAgICAvLyBXZSBtdXN0IHJldHJpZXZlIHRoZSBrZXkgZnJvbSBldmVudC5rZXkgYW5kXG4gICAgICAgICAgICAvLyBhZGQgaXQgdG8gdGhlIGlucHV0J3MgdmFsdWUgYmVmb3JlIGZvcm1hdHRpbmcuXG4gICAgICAgICAgICB2YXIgb2xkVmFsdWUgPSB0aGlzLmlucHV0RWxlbWVudC52YWx1ZTtcbiAgICAgICAgICAgIHZhciBzZWxlY3Rpb24gPSAoMCwgaW5wdXRfc2VsZWN0aW9uXzEuZ2V0KSh0aGlzLmlucHV0RWxlbWVudCk7XG4gICAgICAgICAgICB2YXIgbmV3VmFsdWUgPSBvbGRWYWx1ZS5zbGljZSgwLCBzZWxlY3Rpb24uc3RhcnQpICtcbiAgICAgICAgICAgICAgICBldmVudC5rZXkgK1xuICAgICAgICAgICAgICAgIG9sZFZhbHVlLnNsaWNlKHNlbGVjdGlvbi5zdGFydCk7XG4gICAgICAgICAgICBzZWxlY3Rpb24gPSBwYWRTZWxlY3Rpb24oc2VsZWN0aW9uLCAxKTtcbiAgICAgICAgICAgIHRoaXMuc3RhdGVUb0Zvcm1hdCA9IHtcbiAgICAgICAgICAgICAgICBzZWxlY3Rpb246IHNlbGVjdGlvbixcbiAgICAgICAgICAgICAgICB2YWx1ZTogbmV3VmFsdWUsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKHNlbGVjdGlvbi5zdGFydCA9PT0gbmV3VmFsdWUubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZVRvRm9ybWF0ID0gdGhpcy5mb3JtYXR0ZXIudW5mb3JtYXQodGhpcy5zdGF0ZVRvRm9ybWF0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmZvcm1hdCgpO1xuICAgIH07XG4gICAgSUU5U3RyYXRlZ3kucHJvdG90eXBlLnJlZm9ybWF0QWZ0ZXJQYXN0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGlucHV0ID0gdGhpcy5pbnB1dEVsZW1lbnQ7XG4gICAgICAgIHZhciBzZWxlY3Rpb24gPSAoMCwgaW5wdXRfc2VsZWN0aW9uXzEuZ2V0KSh0aGlzLmlucHV0RWxlbWVudCk7XG4gICAgICAgIHZhciB2YWx1ZSA9IHRoaXMuZm9ybWF0dGVyLmZvcm1hdCh7XG4gICAgICAgICAgICBzZWxlY3Rpb246IHNlbGVjdGlvbixcbiAgICAgICAgICAgIHZhbHVlOiBpbnB1dC52YWx1ZSxcbiAgICAgICAgfSkudmFsdWU7XG4gICAgICAgIHNlbGVjdGlvbiA9IHBhZFNlbGVjdGlvbihzZWxlY3Rpb24sIDEpO1xuICAgICAgICBpbnB1dC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICAvLyBJRTkgc2V0cyB0aGUgc2VsZWN0aW9uIHRvIHRoZSBlbmQgb2YgdGhlIGlucHV0XG4gICAgICAgIC8vIG1hbnVhbGx5IHNldHRpbmcgaXQgaW4gYSBzZXRUaW1lb3V0IHB1dHMgaXRcbiAgICAgICAgLy8gaW4gdGhlIGNvcnJlY3QgcG9zaXRpb24gYWZ0ZXIgcGFzdGluZ1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICgwLCBpbnB1dF9zZWxlY3Rpb25fMS5zZXQpKGlucHV0LCBzZWxlY3Rpb24uc3RhcnQsIHNlbGVjdGlvbi5lbmQpO1xuICAgICAgICB9LCAwKTtcbiAgICB9O1xuICAgIHJldHVybiBJRTlTdHJhdGVneTtcbn0oYmFzZV8xLkJhc2VTdHJhdGVneSkpO1xuZXhwb3J0cy5JRTlTdHJhdGVneSA9IElFOVN0cmF0ZWd5O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XG4gICAgICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xuICAgICAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xuICAgIH07XG59KSgpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5Jb3NTdHJhdGVneSA9IHZvaWQgMDtcbnZhciBiYXNlXzEgPSByZXF1aXJlKFwiLi9iYXNlXCIpO1xudmFyIGtleV9jYW5ub3RfbXV0YXRlX3ZhbHVlXzEgPSByZXF1aXJlKFwiLi4va2V5LWNhbm5vdC1tdXRhdGUtdmFsdWVcIik7XG52YXIgaW5wdXRfc2VsZWN0aW9uXzEgPSByZXF1aXJlKFwiLi4vaW5wdXQtc2VsZWN0aW9uXCIpO1xudmFyIElvc1N0cmF0ZWd5ID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhJb3NTdHJhdGVneSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBJb3NTdHJhdGVneSgpIHtcbiAgICAgICAgcmV0dXJuIF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xuICAgIH1cbiAgICBJb3NTdHJhdGVneS5wcm90b3R5cGUuZ2V0VW5mb3JtYXR0ZWRWYWx1ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIF9zdXBlci5wcm90b3R5cGUuZ2V0VW5mb3JtYXR0ZWRWYWx1ZS5jYWxsKHRoaXMsIHRydWUpO1xuICAgIH07XG4gICAgSW9zU3RyYXRlZ3kucHJvdG90eXBlLmF0dGFjaExpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5pbnB1dEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgaXNLZXlib2FyZEV2ZW50ID0gZXZlbnQgaW5zdGFuY2VvZiBLZXlib2FyZEV2ZW50O1xuICAgICAgICAgICAgaWYgKCFpc0tleWJvYXJkRXZlbnQgJiYgX3RoaXMuaW5wdXRFbGVtZW50LnZhbHVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5zdGF0ZVRvRm9ybWF0ID0ge1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb246IHsgc3RhcnQ6IDAsIGVuZDogMCB9LFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogX3RoaXMuaW5wdXRFbGVtZW50LnZhbHVlLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChfdGhpcy5zdGF0ZVRvRm9ybWF0KSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIF90aGlzLnN0YXRlVG9Gb3JtYXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfdGhpcy5rZXlkb3duTGlzdGVuZXIoZXZlbnQpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5pbnB1dEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdmFyIGlzQ3VzdG9tRXZlbnQgPSBldmVudCBpbnN0YW5jZW9mIEN1c3RvbUV2ZW50O1xuICAgICAgICAgICAgLy8gU2FmYXJpIEF1dG9GaWxsIGZpcmVzIEN1c3RvbUV2ZW50c1xuICAgICAgICAgICAgLy8gU2V0IHN0YXRlIHRvIGZvcm1hdCBiZWZvcmUgY2FsbGluZyBmb3JtYXQgbGlzdGVuZXJcbiAgICAgICAgICAgIGlmIChpc0N1c3RvbUV2ZW50KSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuc3RhdGVUb0Zvcm1hdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0aW9uOiB7IHN0YXJ0OiAwLCBlbmQ6IDAgfSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IF90aGlzLmlucHV0RWxlbWVudC52YWx1ZSxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX3RoaXMuZm9ybWF0TGlzdGVuZXIoKTtcbiAgICAgICAgICAgIGlmICghaXNDdXN0b21FdmVudCkge1xuICAgICAgICAgICAgICAgIF90aGlzLmZpeExlYWRpbmdCbGFua1NwYWNlT25Jb3MoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuaW5wdXRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfdGhpcy5mb3JtYXRMaXN0ZW5lcigpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5pbnB1dEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInBhc3RlXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgX3RoaXMucGFzdGVFdmVudEhhbmRsZXIoZXZlbnQpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8vIFdoZW4gZGVsZXRpbmcgdGhlIGxhc3QgY2hhcmFjdGVyIG9uIGlPUywgdGhlIGN1cnNvclxuICAgIC8vIGlzIHBvc2l0aW9uZWQgYXMgaWYgdGhlcmUgaXMgYSBibGFuayBzcGFjZSB3aGVuIHRoZXJlXG4gICAgLy8gaXMgbm90LCBzZXR0aW5nIGl0IHRvICcnIGluIGEgc2V0VGltZW91dCBmaXhlcyBpdCDCr1xcXyjjg4QpXy/Cr1xuICAgIElvc1N0cmF0ZWd5LnByb3RvdHlwZS5maXhMZWFkaW5nQmxhbmtTcGFjZU9uSW9zID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaW5wdXQgPSB0aGlzLmlucHV0RWxlbWVudDtcbiAgICAgICAgaWYgKGlucHV0LnZhbHVlID09PSBcIlwiKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpbnB1dC52YWx1ZSA9IFwiXCI7XG4gICAgICAgICAgICB9LCAwKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgSW9zU3RyYXRlZ3kucHJvdG90eXBlLmZvcm1hdExpc3RlbmVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5pc0Zvcm1hdHRlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBpbnB1dCA9IHRoaXMuaW5wdXRFbGVtZW50O1xuICAgICAgICB2YXIgc3RhdGVUb0Zvcm1hdCA9IHRoaXMuZ2V0U3RhdGVUb0Zvcm1hdCgpO1xuICAgICAgICB2YXIgZm9ybWF0dGVkU3RhdGUgPSB0aGlzLmZvcm1hdHRlci5mb3JtYXQoc3RhdGVUb0Zvcm1hdCk7XG4gICAgICAgIHRoaXMuaXNGb3JtYXR0ZWQgPSB0cnVlO1xuICAgICAgICBpbnB1dC52YWx1ZSA9IGZvcm1hdHRlZFN0YXRlLnZhbHVlO1xuICAgICAgICAoMCwgaW5wdXRfc2VsZWN0aW9uXzEuc2V0KShpbnB1dCwgZm9ybWF0dGVkU3RhdGUuc2VsZWN0aW9uLnN0YXJ0LCBmb3JtYXR0ZWRTdGF0ZS5zZWxlY3Rpb24uZW5kKTtcbiAgICB9O1xuICAgIElvc1N0cmF0ZWd5LnByb3RvdHlwZS5rZXlkb3duTGlzdGVuZXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgaWYgKCgwLCBrZXlfY2Fubm90X211dGF0ZV92YWx1ZV8xLmtleUNhbm5vdE11dGF0ZVZhbHVlKShldmVudCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5pc0RlbGV0aW9uKGV2ZW50KSkge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZVRvRm9ybWF0ID0gdGhpcy5mb3JtYXR0ZXIuc2ltdWxhdGVEZWxldGlvbih7XG4gICAgICAgICAgICAgICAgZXZlbnQ6IGV2ZW50LFxuICAgICAgICAgICAgICAgIHNlbGVjdGlvbjogKDAsIGlucHV0X3NlbGVjdGlvbl8xLmdldCkodGhpcy5pbnB1dEVsZW1lbnQpLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB0aGlzLmlucHV0RWxlbWVudC52YWx1ZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudW5mb3JtYXRJbnB1dCgpO1xuICAgIH07XG4gICAgcmV0dXJuIElvc1N0cmF0ZWd5O1xufShiYXNlXzEuQmFzZVN0cmF0ZWd5KSk7XG5leHBvcnRzLklvc1N0cmF0ZWd5ID0gSW9zU3RyYXRlZ3k7XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8vIEFuZHJvaWQgRGV2aWNlcyBvbiBLaXRLYXQgdXNlIENocm9taXVtIGJhc2VkIHdlYnZpZXdzLiBGb3Igc29tZSByZWFzb24sXG4vLyB0aGUgdmFsdWUgb2YgdGhlIGlucHV0cyBhcmUgbm90IGFjY2Vzc2libGUgaW4gdGhlIGV2ZW50IGxvb3Agd2hlcmUgdGhlXG4vLyBrZXkgZXZlbnQgbGlzdGVuZXJzIGFyZSBjYWxsZWQuIFRoaXMgY2F1c2VzIGZvcm1hdHRpbmcgdG8gZ2V0IHN0dWNrXG4vLyBvbiBwZXJtYWNoYXJhY3RlcnMuIEJ5IHB1dHRpbmcgdGhlbSBpbiBzZXRUaW1lb3V0cywgdGhpcyBmaXhlcyB0aGVcbi8vIHByb2JsZW0uIFRoaXMgY2F1c2VzIG90aGVyIHByb2JsZW1zIGluIG5vbi13ZWJ2aWV3cywgc28gd2UgZ2l2ZSBpdFxuLy8gaXRzIG93biBzdHJhdGVneS5cbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcbiAgICAgICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBwKSkgZFtwXSA9IGJbcF07IH07XG4gICAgICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYiAhPT0gXCJmdW5jdGlvblwiICYmIGIgIT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2xhc3MgZXh0ZW5kcyB2YWx1ZSBcIiArIFN0cmluZyhiKSArIFwiIGlzIG5vdCBhIGNvbnN0cnVjdG9yIG9yIG51bGxcIik7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG4gICAgfTtcbn0pKCk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLktpdEthdENocm9taXVtQmFzZWRXZWJWaWV3U3RyYXRlZ3kgPSB2b2lkIDA7XG52YXIgYW5kcm9pZF9jaHJvbWVfMSA9IHJlcXVpcmUoXCIuL2FuZHJvaWQtY2hyb21lXCIpO1xudmFyIEtpdEthdENocm9taXVtQmFzZWRXZWJWaWV3U3RyYXRlZ3kgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKEtpdEthdENocm9taXVtQmFzZWRXZWJWaWV3U3RyYXRlZ3ksIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gS2l0S2F0Q2hyb21pdW1CYXNlZFdlYlZpZXdTdHJhdGVneSgpIHtcbiAgICAgICAgcmV0dXJuIF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xuICAgIH1cbiAgICBLaXRLYXRDaHJvbWl1bUJhc2VkV2ViVmlld1N0cmF0ZWd5LnByb3RvdHlwZS5yZWZvcm1hdElucHV0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF9zdXBlci5wcm90b3R5cGUucmVmb3JtYXRJbnB1dC5jYWxsKF90aGlzKTtcbiAgICAgICAgfSwgMCk7XG4gICAgfTtcbiAgICBLaXRLYXRDaHJvbWl1bUJhc2VkV2ViVmlld1N0cmF0ZWd5LnByb3RvdHlwZS51bmZvcm1hdElucHV0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF9zdXBlci5wcm90b3R5cGUudW5mb3JtYXRJbnB1dC5jYWxsKF90aGlzKTtcbiAgICAgICAgfSwgMCk7XG4gICAgfTtcbiAgICByZXR1cm4gS2l0S2F0Q2hyb21pdW1CYXNlZFdlYlZpZXdTdHJhdGVneTtcbn0oYW5kcm9pZF9jaHJvbWVfMS5BbmRyb2lkQ2hyb21lU3RyYXRlZ3kpKTtcbmV4cG9ydHMuS2l0S2F0Q2hyb21pdW1CYXNlZFdlYlZpZXdTdHJhdGVneSA9IEtpdEthdENocm9taXVtQmFzZWRXZWJWaWV3U3RyYXRlZ3k7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcbiAgICAgICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBwKSkgZFtwXSA9IGJbcF07IH07XG4gICAgICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYiAhPT0gXCJmdW5jdGlvblwiICYmIGIgIT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2xhc3MgZXh0ZW5kcyB2YWx1ZSBcIiArIFN0cmluZyhiKSArIFwiIGlzIG5vdCBhIGNvbnN0cnVjdG9yIG9yIG51bGxcIik7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG4gICAgfTtcbn0pKCk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLk5vb3BLZXlib2FyZFN0cmF0ZWd5ID0gdm9pZCAwO1xudmFyIHN0cmF0ZWd5X2ludGVyZmFjZV8xID0gcmVxdWlyZShcIi4vc3RyYXRlZ3ktaW50ZXJmYWNlXCIpO1xudmFyIE5vb3BLZXlib2FyZFN0cmF0ZWd5ID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhOb29wS2V5Ym9hcmRTdHJhdGVneSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBOb29wS2V5Ym9hcmRTdHJhdGVneSgpIHtcbiAgICAgICAgcmV0dXJuIF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xuICAgIH1cbiAgICBOb29wS2V5Ym9hcmRTdHJhdGVneS5wcm90b3R5cGUuZ2V0VW5mb3JtYXR0ZWRWYWx1ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5wdXRFbGVtZW50LnZhbHVlO1xuICAgIH07XG4gICAgTm9vcEtleWJvYXJkU3RyYXRlZ3kucHJvdG90eXBlLnNldFBhdHRlcm4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIG5vb3BcbiAgICB9O1xuICAgIHJldHVybiBOb29wS2V5Ym9hcmRTdHJhdGVneTtcbn0oc3RyYXRlZ3lfaW50ZXJmYWNlXzEuU3RyYXRlZ3lJbnRlcmZhY2UpKTtcbmV4cG9ydHMuTm9vcEtleWJvYXJkU3RyYXRlZ3kgPSBOb29wS2V5Ym9hcmRTdHJhdGVneTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5TdHJhdGVneUludGVyZmFjZSA9IHZvaWQgMDtcbnZhciBTdHJhdGVneUludGVyZmFjZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBTdHJhdGVneUludGVyZmFjZShvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuaW5wdXRFbGVtZW50ID0gb3B0aW9ucy5lbGVtZW50O1xuICAgICAgICB0aGlzLmlzRm9ybWF0dGVkID0gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBTdHJhdGVneUludGVyZmFjZTtcbn0oKSk7XG5leHBvcnRzLlN0cmF0ZWd5SW50ZXJmYWNlID0gU3RyYXRlZ3lJbnRlcmZhY2U7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBSZXN0cmljdGVkSW5wdXQgPSByZXF1aXJlKFwiLi9saWIvcmVzdHJpY3RlZC1pbnB1dFwiKTtcbm1vZHVsZS5leHBvcnRzID0gUmVzdHJpY3RlZElucHV0O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgZGV2aWNlXzEgPSByZXF1aXJlKFwiLi9saWIvZGV2aWNlXCIpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzdXBwb3J0c0lucHV0Rm9ybWF0dGluZygpIHtcbiAgICAvLyBEaWdpdHMgZ2V0IGRyb3BwZWQgaW4gc2Ftc3VuZyBicm93c2VyXG4gICAgcmV0dXJuICEoMCwgZGV2aWNlXzEuaXNTYW1zdW5nQnJvd3NlcikoKTtcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuY2FyZE51bWJlciA9IHZvaWQgMDtcbnZhciBsdWhuMTAgPSByZXF1aXJlKFwiLi9sdWhuLTEwXCIpO1xudmFyIGdldENhcmRUeXBlcyA9IHJlcXVpcmUoXCJjcmVkaXQtY2FyZC10eXBlXCIpO1xuZnVuY3Rpb24gdmVyaWZpY2F0aW9uKGNhcmQsIGlzUG90ZW50aWFsbHlWYWxpZCwgaXNWYWxpZCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGNhcmQ6IGNhcmQsXG4gICAgICAgIGlzUG90ZW50aWFsbHlWYWxpZDogaXNQb3RlbnRpYWxseVZhbGlkLFxuICAgICAgICBpc1ZhbGlkOiBpc1ZhbGlkLFxuICAgIH07XG59XG5mdW5jdGlvbiBjYXJkTnVtYmVyKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkgeyBvcHRpb25zID0ge307IH1cbiAgICB2YXIgaXNQb3RlbnRpYWxseVZhbGlkLCBpc1ZhbGlkLCBtYXhMZW5ndGg7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gXCJzdHJpbmdcIiAmJiB0eXBlb2YgdmFsdWUgIT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgcmV0dXJuIHZlcmlmaWNhdGlvbihudWxsLCBmYWxzZSwgZmFsc2UpO1xuICAgIH1cbiAgICB2YXIgdGVzdENhcmRWYWx1ZSA9IFN0cmluZyh2YWx1ZSkucmVwbGFjZSgvLXxcXHMvZywgXCJcIik7XG4gICAgaWYgKCEvXlxcZCokLy50ZXN0KHRlc3RDYXJkVmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB2ZXJpZmljYXRpb24obnVsbCwgZmFsc2UsIGZhbHNlKTtcbiAgICB9XG4gICAgdmFyIHBvdGVudGlhbFR5cGVzID0gZ2V0Q2FyZFR5cGVzKHRlc3RDYXJkVmFsdWUpO1xuICAgIGlmIChwb3RlbnRpYWxUeXBlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHZlcmlmaWNhdGlvbihudWxsLCBmYWxzZSwgZmFsc2UpO1xuICAgIH1cbiAgICBlbHNlIGlmIChwb3RlbnRpYWxUeXBlcy5sZW5ndGggIT09IDEpIHtcbiAgICAgICAgcmV0dXJuIHZlcmlmaWNhdGlvbihudWxsLCB0cnVlLCBmYWxzZSk7XG4gICAgfVxuICAgIHZhciBjYXJkVHlwZSA9IHBvdGVudGlhbFR5cGVzWzBdO1xuICAgIGlmIChvcHRpb25zLm1heExlbmd0aCAmJiB0ZXN0Q2FyZFZhbHVlLmxlbmd0aCA+IG9wdGlvbnMubWF4TGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiB2ZXJpZmljYXRpb24oY2FyZFR5cGUsIGZhbHNlLCBmYWxzZSk7XG4gICAgfVxuICAgIGlmIChvcHRpb25zLnNraXBMdWhuVmFsaWRhdGlvbiA9PT0gdHJ1ZSB8fFxuICAgICAgICAoY2FyZFR5cGUudHlwZSA9PT0gZ2V0Q2FyZFR5cGVzLnR5cGVzLlVOSU9OUEFZICYmXG4gICAgICAgICAgICBvcHRpb25zLmx1aG5WYWxpZGF0ZVVuaW9uUGF5ICE9PSB0cnVlKSkge1xuICAgICAgICBpc1ZhbGlkID0gdHJ1ZTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlzVmFsaWQgPSBsdWhuMTAodGVzdENhcmRWYWx1ZSk7XG4gICAgfVxuICAgIG1heExlbmd0aCA9IE1hdGgubWF4LmFwcGx5KG51bGwsIGNhcmRUeXBlLmxlbmd0aHMpO1xuICAgIGlmIChvcHRpb25zLm1heExlbmd0aCkge1xuICAgICAgICBtYXhMZW5ndGggPSBNYXRoLm1pbihvcHRpb25zLm1heExlbmd0aCwgbWF4TGVuZ3RoKTtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYXJkVHlwZS5sZW5ndGhzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChjYXJkVHlwZS5sZW5ndGhzW2ldID09PSB0ZXN0Q2FyZFZhbHVlLmxlbmd0aCkge1xuICAgICAgICAgICAgaXNQb3RlbnRpYWxseVZhbGlkID0gdGVzdENhcmRWYWx1ZS5sZW5ndGggPCBtYXhMZW5ndGggfHwgaXNWYWxpZDtcbiAgICAgICAgICAgIHJldHVybiB2ZXJpZmljYXRpb24oY2FyZFR5cGUsIGlzUG90ZW50aWFsbHlWYWxpZCwgaXNWYWxpZCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHZlcmlmaWNhdGlvbihjYXJkVHlwZSwgdGVzdENhcmRWYWx1ZS5sZW5ndGggPCBtYXhMZW5ndGgsIGZhbHNlKTtcbn1cbmV4cG9ydHMuY2FyZE51bWJlciA9IGNhcmROdW1iZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuY2FyZGhvbGRlck5hbWUgPSB2b2lkIDA7XG52YXIgQ0FSRF9OVU1CRVJfUkVHRVggPSAvXltcXGRcXHMtXSokLztcbnZhciBNQVhfTEVOR1RIID0gMjU1O1xuZnVuY3Rpb24gdmVyaWZpY2F0aW9uKGlzVmFsaWQsIGlzUG90ZW50aWFsbHlWYWxpZCkge1xuICAgIHJldHVybiB7IGlzVmFsaWQ6IGlzVmFsaWQsIGlzUG90ZW50aWFsbHlWYWxpZDogaXNQb3RlbnRpYWxseVZhbGlkIH07XG59XG5mdW5jdGlvbiBjYXJkaG9sZGVyTmFtZSh2YWx1ZSkge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgcmV0dXJuIHZlcmlmaWNhdGlvbihmYWxzZSwgZmFsc2UpO1xuICAgIH1cbiAgICBpZiAodmFsdWUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiB2ZXJpZmljYXRpb24oZmFsc2UsIHRydWUpO1xuICAgIH1cbiAgICBpZiAodmFsdWUubGVuZ3RoID4gTUFYX0xFTkdUSCkge1xuICAgICAgICByZXR1cm4gdmVyaWZpY2F0aW9uKGZhbHNlLCBmYWxzZSk7XG4gICAgfVxuICAgIGlmIChDQVJEX05VTUJFUl9SRUdFWC50ZXN0KHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gdmVyaWZpY2F0aW9uKGZhbHNlLCB0cnVlKTtcbiAgICB9XG4gICAgcmV0dXJuIHZlcmlmaWNhdGlvbih0cnVlLCB0cnVlKTtcbn1cbmV4cG9ydHMuY2FyZGhvbGRlck5hbWUgPSBjYXJkaG9sZGVyTmFtZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5jdnYgPSB2b2lkIDA7XG52YXIgREVGQVVMVF9MRU5HVEggPSAzO1xuZnVuY3Rpb24gaW5jbHVkZXMoYXJyYXksIHRoaW5nKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAodGhpbmcgPT09IGFycmF5W2ldKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5mdW5jdGlvbiBtYXgoYXJyYXkpIHtcbiAgICB2YXIgbWF4aW11bSA9IERFRkFVTFRfTEVOR1RIO1xuICAgIHZhciBpID0gMDtcbiAgICBmb3IgKDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIG1heGltdW0gPSBhcnJheVtpXSA+IG1heGltdW0gPyBhcnJheVtpXSA6IG1heGltdW07XG4gICAgfVxuICAgIHJldHVybiBtYXhpbXVtO1xufVxuZnVuY3Rpb24gdmVyaWZpY2F0aW9uKGlzVmFsaWQsIGlzUG90ZW50aWFsbHlWYWxpZCkge1xuICAgIHJldHVybiB7IGlzVmFsaWQ6IGlzVmFsaWQsIGlzUG90ZW50aWFsbHlWYWxpZDogaXNQb3RlbnRpYWxseVZhbGlkIH07XG59XG5mdW5jdGlvbiBjdnYodmFsdWUsIG1heExlbmd0aCkge1xuICAgIGlmIChtYXhMZW5ndGggPT09IHZvaWQgMCkgeyBtYXhMZW5ndGggPSBERUZBVUxUX0xFTkdUSDsgfVxuICAgIG1heExlbmd0aCA9IG1heExlbmd0aCBpbnN0YW5jZW9mIEFycmF5ID8gbWF4TGVuZ3RoIDogW21heExlbmd0aF07XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICByZXR1cm4gdmVyaWZpY2F0aW9uKGZhbHNlLCBmYWxzZSk7XG4gICAgfVxuICAgIGlmICghL15cXGQqJC8udGVzdCh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHZlcmlmaWNhdGlvbihmYWxzZSwgZmFsc2UpO1xuICAgIH1cbiAgICBpZiAoaW5jbHVkZXMobWF4TGVuZ3RoLCB2YWx1ZS5sZW5ndGgpKSB7XG4gICAgICAgIHJldHVybiB2ZXJpZmljYXRpb24odHJ1ZSwgdHJ1ZSk7XG4gICAgfVxuICAgIGlmICh2YWx1ZS5sZW5ndGggPCBNYXRoLm1pbi5hcHBseShudWxsLCBtYXhMZW5ndGgpKSB7XG4gICAgICAgIHJldHVybiB2ZXJpZmljYXRpb24oZmFsc2UsIHRydWUpO1xuICAgIH1cbiAgICBpZiAodmFsdWUubGVuZ3RoID4gbWF4KG1heExlbmd0aCkpIHtcbiAgICAgICAgcmV0dXJuIHZlcmlmaWNhdGlvbihmYWxzZSwgZmFsc2UpO1xuICAgIH1cbiAgICByZXR1cm4gdmVyaWZpY2F0aW9uKHRydWUsIHRydWUpO1xufVxuZXhwb3J0cy5jdnYgPSBjdnY7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IGZ1bmN0aW9uICgpIHtcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXG4gICAgICAgICAgICAgICAgdFtwXSA9IHNbcF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfTtcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmV4cGlyYXRpb25EYXRlID0gdm9pZCAwO1xudmFyIHBhcnNlX2RhdGVfMSA9IHJlcXVpcmUoXCIuL2xpYi9wYXJzZS1kYXRlXCIpO1xudmFyIGV4cGlyYXRpb25fbW9udGhfMSA9IHJlcXVpcmUoXCIuL2V4cGlyYXRpb24tbW9udGhcIik7XG52YXIgZXhwaXJhdGlvbl95ZWFyXzEgPSByZXF1aXJlKFwiLi9leHBpcmF0aW9uLXllYXJcIik7XG5mdW5jdGlvbiB2ZXJpZmljYXRpb24oaXNWYWxpZCwgaXNQb3RlbnRpYWxseVZhbGlkLCBtb250aCwgeWVhcikge1xuICAgIHJldHVybiB7XG4gICAgICAgIGlzVmFsaWQ6IGlzVmFsaWQsXG4gICAgICAgIGlzUG90ZW50aWFsbHlWYWxpZDogaXNQb3RlbnRpYWxseVZhbGlkLFxuICAgICAgICBtb250aDogbW9udGgsXG4gICAgICAgIHllYXI6IHllYXIsXG4gICAgfTtcbn1cbmZ1bmN0aW9uIGV4cGlyYXRpb25EYXRlKHZhbHVlLCBtYXhFbGFwc2VkWWVhcikge1xuICAgIHZhciBkYXRlO1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9eKFxcZFxcZCkgKFxcZFxcZChcXGRcXGQpPykkLywgXCIkMS8kMlwiKTtcbiAgICAgICAgZGF0ZSA9ICgwLCBwYXJzZV9kYXRlXzEucGFyc2VEYXRlKShTdHJpbmcodmFsdWUpKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodmFsdWUgIT09IG51bGwgJiYgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIHZhciBmdWxsRGF0ZSA9IF9fYXNzaWduKHt9LCB2YWx1ZSk7XG4gICAgICAgIGRhdGUgPSB7XG4gICAgICAgICAgICBtb250aDogU3RyaW5nKGZ1bGxEYXRlLm1vbnRoKSxcbiAgICAgICAgICAgIHllYXI6IFN0cmluZyhmdWxsRGF0ZS55ZWFyKSxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiB2ZXJpZmljYXRpb24oZmFsc2UsIGZhbHNlLCBudWxsLCBudWxsKTtcbiAgICB9XG4gICAgdmFyIG1vbnRoVmFsaWQgPSAoMCwgZXhwaXJhdGlvbl9tb250aF8xLmV4cGlyYXRpb25Nb250aCkoZGF0ZS5tb250aCk7XG4gICAgdmFyIHllYXJWYWxpZCA9ICgwLCBleHBpcmF0aW9uX3llYXJfMS5leHBpcmF0aW9uWWVhcikoZGF0ZS55ZWFyLCBtYXhFbGFwc2VkWWVhcik7XG4gICAgaWYgKG1vbnRoVmFsaWQuaXNWYWxpZCkge1xuICAgICAgICBpZiAoeWVhclZhbGlkLmlzQ3VycmVudFllYXIpIHtcbiAgICAgICAgICAgIHZhciBpc1ZhbGlkRm9yVGhpc1llYXIgPSBtb250aFZhbGlkLmlzVmFsaWRGb3JUaGlzWWVhcjtcbiAgICAgICAgICAgIHJldHVybiB2ZXJpZmljYXRpb24oaXNWYWxpZEZvclRoaXNZZWFyLCBpc1ZhbGlkRm9yVGhpc1llYXIsIGRhdGUubW9udGgsIGRhdGUueWVhcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHllYXJWYWxpZC5pc1ZhbGlkKSB7XG4gICAgICAgICAgICByZXR1cm4gdmVyaWZpY2F0aW9uKHRydWUsIHRydWUsIGRhdGUubW9udGgsIGRhdGUueWVhcik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKG1vbnRoVmFsaWQuaXNQb3RlbnRpYWxseVZhbGlkICYmIHllYXJWYWxpZC5pc1BvdGVudGlhbGx5VmFsaWQpIHtcbiAgICAgICAgcmV0dXJuIHZlcmlmaWNhdGlvbihmYWxzZSwgdHJ1ZSwgbnVsbCwgbnVsbCk7XG4gICAgfVxuICAgIHJldHVybiB2ZXJpZmljYXRpb24oZmFsc2UsIGZhbHNlLCBudWxsLCBudWxsKTtcbn1cbmV4cG9ydHMuZXhwaXJhdGlvbkRhdGUgPSBleHBpcmF0aW9uRGF0ZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5leHBpcmF0aW9uTW9udGggPSB2b2lkIDA7XG5mdW5jdGlvbiB2ZXJpZmljYXRpb24oaXNWYWxpZCwgaXNQb3RlbnRpYWxseVZhbGlkLCBpc1ZhbGlkRm9yVGhpc1llYXIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBpc1ZhbGlkOiBpc1ZhbGlkLFxuICAgICAgICBpc1BvdGVudGlhbGx5VmFsaWQ6IGlzUG90ZW50aWFsbHlWYWxpZCxcbiAgICAgICAgaXNWYWxpZEZvclRoaXNZZWFyOiBpc1ZhbGlkRm9yVGhpc1llYXIgfHwgZmFsc2UsXG4gICAgfTtcbn1cbmZ1bmN0aW9uIGV4cGlyYXRpb25Nb250aCh2YWx1ZSkge1xuICAgIHZhciBjdXJyZW50TW9udGggPSBuZXcgRGF0ZSgpLmdldE1vbnRoKCkgKyAxO1xuICAgIGlmICh0eXBlb2YgdmFsdWUgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgcmV0dXJuIHZlcmlmaWNhdGlvbihmYWxzZSwgZmFsc2UpO1xuICAgIH1cbiAgICBpZiAodmFsdWUucmVwbGFjZSgvXFxzL2csIFwiXCIpID09PSBcIlwiIHx8IHZhbHVlID09PSBcIjBcIikge1xuICAgICAgICByZXR1cm4gdmVyaWZpY2F0aW9uKGZhbHNlLCB0cnVlKTtcbiAgICB9XG4gICAgaWYgKCEvXlxcZCokLy50ZXN0KHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gdmVyaWZpY2F0aW9uKGZhbHNlLCBmYWxzZSk7XG4gICAgfVxuICAgIHZhciBtb250aCA9IHBhcnNlSW50KHZhbHVlLCAxMCk7XG4gICAgaWYgKGlzTmFOKE51bWJlcih2YWx1ZSkpKSB7XG4gICAgICAgIHJldHVybiB2ZXJpZmljYXRpb24oZmFsc2UsIGZhbHNlKTtcbiAgICB9XG4gICAgdmFyIHJlc3VsdCA9IG1vbnRoID4gMCAmJiBtb250aCA8IDEzO1xuICAgIHJldHVybiB2ZXJpZmljYXRpb24ocmVzdWx0LCByZXN1bHQsIHJlc3VsdCAmJiBtb250aCA+PSBjdXJyZW50TW9udGgpO1xufVxuZXhwb3J0cy5leHBpcmF0aW9uTW9udGggPSBleHBpcmF0aW9uTW9udGg7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZXhwaXJhdGlvblllYXIgPSB2b2lkIDA7XG52YXIgREVGQVVMVF9WQUxJRF9OVU1CRVJfT0ZfWUVBUlNfSU5fVEhFX0ZVVFVSRSA9IDE5O1xuZnVuY3Rpb24gdmVyaWZpY2F0aW9uKGlzVmFsaWQsIGlzUG90ZW50aWFsbHlWYWxpZCwgaXNDdXJyZW50WWVhcikge1xuICAgIHJldHVybiB7XG4gICAgICAgIGlzVmFsaWQ6IGlzVmFsaWQsXG4gICAgICAgIGlzUG90ZW50aWFsbHlWYWxpZDogaXNQb3RlbnRpYWxseVZhbGlkLFxuICAgICAgICBpc0N1cnJlbnRZZWFyOiBpc0N1cnJlbnRZZWFyIHx8IGZhbHNlLFxuICAgIH07XG59XG5mdW5jdGlvbiBleHBpcmF0aW9uWWVhcih2YWx1ZSwgbWF4RWxhcHNlZFllYXIpIHtcbiAgICBpZiAobWF4RWxhcHNlZFllYXIgPT09IHZvaWQgMCkgeyBtYXhFbGFwc2VkWWVhciA9IERFRkFVTFRfVkFMSURfTlVNQkVSX09GX1lFQVJTX0lOX1RIRV9GVVRVUkU7IH1cbiAgICB2YXIgaXNDdXJyZW50WWVhcjtcbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHJldHVybiB2ZXJpZmljYXRpb24oZmFsc2UsIGZhbHNlKTtcbiAgICB9XG4gICAgaWYgKHZhbHVlLnJlcGxhY2UoL1xccy9nLCBcIlwiKSA9PT0gXCJcIikge1xuICAgICAgICByZXR1cm4gdmVyaWZpY2F0aW9uKGZhbHNlLCB0cnVlKTtcbiAgICB9XG4gICAgaWYgKCEvXlxcZCokLy50ZXN0KHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gdmVyaWZpY2F0aW9uKGZhbHNlLCBmYWxzZSk7XG4gICAgfVxuICAgIHZhciBsZW4gPSB2YWx1ZS5sZW5ndGg7XG4gICAgaWYgKGxlbiA8IDIpIHtcbiAgICAgICAgcmV0dXJuIHZlcmlmaWNhdGlvbihmYWxzZSwgdHJ1ZSk7XG4gICAgfVxuICAgIHZhciBjdXJyZW50WWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKTtcbiAgICBpZiAobGVuID09PSAzKSB7XG4gICAgICAgIC8vIDIweCA9PT0gMjB4XG4gICAgICAgIHZhciBmaXJzdFR3byA9IHZhbHVlLnNsaWNlKDAsIDIpO1xuICAgICAgICB2YXIgY3VycmVudEZpcnN0VHdvID0gU3RyaW5nKGN1cnJlbnRZZWFyKS5zbGljZSgwLCAyKTtcbiAgICAgICAgcmV0dXJuIHZlcmlmaWNhdGlvbihmYWxzZSwgZmlyc3RUd28gPT09IGN1cnJlbnRGaXJzdFR3byk7XG4gICAgfVxuICAgIGlmIChsZW4gPiA0KSB7XG4gICAgICAgIHJldHVybiB2ZXJpZmljYXRpb24oZmFsc2UsIGZhbHNlKTtcbiAgICB9XG4gICAgdmFyIG51bWVyaWNWYWx1ZSA9IHBhcnNlSW50KHZhbHVlLCAxMCk7XG4gICAgdmFyIHR3b0RpZ2l0WWVhciA9IE51bWJlcihTdHJpbmcoY3VycmVudFllYXIpLnN1YnN0cigyLCAyKSk7XG4gICAgdmFyIHZhbGlkID0gZmFsc2U7XG4gICAgaWYgKGxlbiA9PT0gMikge1xuICAgICAgICBpZiAoU3RyaW5nKGN1cnJlbnRZZWFyKS5zdWJzdHIoMCwgMikgPT09IHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gdmVyaWZpY2F0aW9uKGZhbHNlLCB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICBpc0N1cnJlbnRZZWFyID0gdHdvRGlnaXRZZWFyID09PSBudW1lcmljVmFsdWU7XG4gICAgICAgIHZhbGlkID1cbiAgICAgICAgICAgIG51bWVyaWNWYWx1ZSA+PSB0d29EaWdpdFllYXIgJiZcbiAgICAgICAgICAgICAgICBudW1lcmljVmFsdWUgPD0gdHdvRGlnaXRZZWFyICsgbWF4RWxhcHNlZFllYXI7XG4gICAgfVxuICAgIGVsc2UgaWYgKGxlbiA9PT0gNCkge1xuICAgICAgICBpc0N1cnJlbnRZZWFyID0gY3VycmVudFllYXIgPT09IG51bWVyaWNWYWx1ZTtcbiAgICAgICAgdmFsaWQgPVxuICAgICAgICAgICAgbnVtZXJpY1ZhbHVlID49IGN1cnJlbnRZZWFyICYmXG4gICAgICAgICAgICAgICAgbnVtZXJpY1ZhbHVlIDw9IGN1cnJlbnRZZWFyICsgbWF4RWxhcHNlZFllYXI7XG4gICAgfVxuICAgIHJldHVybiB2ZXJpZmljYXRpb24odmFsaWQsIHZhbGlkLCBpc0N1cnJlbnRZZWFyKTtcbn1cbmV4cG9ydHMuZXhwaXJhdGlvblllYXIgPSBleHBpcmF0aW9uWWVhcjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fY3JlYXRlQmluZGluZyA9ICh0aGlzICYmIHRoaXMuX19jcmVhdGVCaW5kaW5nKSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG0sIGspO1xuICAgIGlmICghZGVzYyB8fCAoXCJnZXRcIiBpbiBkZXNjID8gIW0uX19lc01vZHVsZSA6IGRlc2Mud3JpdGFibGUgfHwgZGVzYy5jb25maWd1cmFibGUpKSB7XG4gICAgICBkZXNjID0geyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9O1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIGRlc2MpO1xufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICAgIG9bazJdID0gbVtrXTtcbn0pKTtcbnZhciBfX3NldE1vZHVsZURlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9fc2V0TW9kdWxlRGVmYXVsdCkgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBcImRlZmF1bHRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdiB9KTtcbn0pIDogZnVuY3Rpb24obywgdikge1xuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcbn0pO1xudmFyIF9faW1wb3J0U3RhciA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnRTdGFyKSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xuICAgIF9fc2V0TW9kdWxlRGVmYXVsdChyZXN1bHQsIG1vZCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG52YXIgY3JlZGl0Q2FyZFR5cGUgPSBfX2ltcG9ydFN0YXIocmVxdWlyZShcImNyZWRpdC1jYXJkLXR5cGVcIikpO1xudmFyIGNhcmRob2xkZXJfbmFtZV8xID0gcmVxdWlyZShcIi4vY2FyZGhvbGRlci1uYW1lXCIpO1xudmFyIGNhcmRfbnVtYmVyXzEgPSByZXF1aXJlKFwiLi9jYXJkLW51bWJlclwiKTtcbnZhciBleHBpcmF0aW9uX2RhdGVfMSA9IHJlcXVpcmUoXCIuL2V4cGlyYXRpb24tZGF0ZVwiKTtcbnZhciBleHBpcmF0aW9uX21vbnRoXzEgPSByZXF1aXJlKFwiLi9leHBpcmF0aW9uLW1vbnRoXCIpO1xudmFyIGV4cGlyYXRpb25feWVhcl8xID0gcmVxdWlyZShcIi4vZXhwaXJhdGlvbi15ZWFyXCIpO1xudmFyIGN2dl8xID0gcmVxdWlyZShcIi4vY3Z2XCIpO1xudmFyIHBvc3RhbF9jb2RlXzEgPSByZXF1aXJlKFwiLi9wb3N0YWwtY29kZVwiKTtcbnZhciBjYXJkVmFsaWRhdG9yID0ge1xuICAgIGNyZWRpdENhcmRUeXBlOiBjcmVkaXRDYXJkVHlwZSxcbiAgICBjYXJkaG9sZGVyTmFtZTogY2FyZGhvbGRlcl9uYW1lXzEuY2FyZGhvbGRlck5hbWUsXG4gICAgbnVtYmVyOiBjYXJkX251bWJlcl8xLmNhcmROdW1iZXIsXG4gICAgZXhwaXJhdGlvbkRhdGU6IGV4cGlyYXRpb25fZGF0ZV8xLmV4cGlyYXRpb25EYXRlLFxuICAgIGV4cGlyYXRpb25Nb250aDogZXhwaXJhdGlvbl9tb250aF8xLmV4cGlyYXRpb25Nb250aCxcbiAgICBleHBpcmF0aW9uWWVhcjogZXhwaXJhdGlvbl95ZWFyXzEuZXhwaXJhdGlvblllYXIsXG4gICAgY3Z2OiBjdnZfMS5jdnYsXG4gICAgcG9zdGFsQ29kZTogcG9zdGFsX2NvZGVfMS5wb3N0YWxDb2RlLFxufTtcbm1vZHVsZS5leHBvcnRzID0gY2FyZFZhbGlkYXRvcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuLy8gUG9seWZpbGwgdGFrZW4gZnJvbSA8aHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvaXNBcnJheSNQb2x5ZmlsbD4uXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmlzQXJyYXkgPSB2b2lkIDA7XG5leHBvcnRzLmlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8XG4gICAgZnVuY3Rpb24gKGFyZykge1xuICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGFyZykgPT09IFwiW29iamVjdCBBcnJheV1cIjtcbiAgICB9O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnBhcnNlRGF0ZSA9IHZvaWQgMDtcbnZhciBleHBpcmF0aW9uX3llYXJfMSA9IHJlcXVpcmUoXCIuLi9leHBpcmF0aW9uLXllYXJcIik7XG52YXIgaXNfYXJyYXlfMSA9IHJlcXVpcmUoXCIuL2lzLWFycmF5XCIpO1xuZnVuY3Rpb24gZ2V0TnVtYmVyT2ZNb250aERpZ2l0c0luRGF0ZVN0cmluZyhkYXRlU3RyaW5nKSB7XG4gICAgdmFyIGZpcnN0Q2hhcmFjdGVyID0gTnVtYmVyKGRhdGVTdHJpbmdbMF0pO1xuICAgIHZhciBhc3N1bWVkWWVhcjtcbiAgICAvKlxuICAgICAgaWYgdGhlIGZpcnN0IGNoYXJhY3RlciBpbiB0aGUgc3RyaW5nIHN0YXJ0cyB3aXRoIGAwYCxcbiAgICAgIHdlIGtub3cgdGhhdCB0aGUgbW9udGggd2lsbCBiZSAyIGRpZ2l0cy5cbiAgXG4gICAgICAnMDEyMicgPT4ge21vbnRoOiAnMDEnLCB5ZWFyOiAnMjInfVxuICAgICovXG4gICAgaWYgKGZpcnN0Q2hhcmFjdGVyID09PSAwKSB7XG4gICAgICAgIHJldHVybiAyO1xuICAgIH1cbiAgICAvKlxuICAgICAgaWYgdGhlIGZpcnN0IGNoYXJhY3RlciBpbiB0aGUgc3RyaW5nIHN0YXJ0cyB3aXRoXG4gICAgICBudW1iZXIgZ3JlYXRlciB0aGFuIDEsIGl0IG11c3QgYmUgYSAxIGRpZ2l0IG1vbnRoXG4gIFxuICAgICAgJzMyMicgPT4ge21vbnRoOiAnMycsIHllYXI6ICcyMid9XG4gICAgKi9cbiAgICBpZiAoZmlyc3RDaGFyYWN0ZXIgPiAxKSB7XG4gICAgICAgIHJldHVybiAxO1xuICAgIH1cbiAgICAvKlxuICAgICAgaWYgdGhlIGZpcnN0IDIgY2hhcmFjdGVycyBtYWtlIHVwIGEgbnVtYmVyIGJldHdlZW5cbiAgICAgIDEzLTE5LCB3ZSBrbm93IHRoYXQgdGhlIG1vbnRoIHBvcnRpb24gbXVzdCBiZSAxXG4gIFxuICAgICAgJzEzOScgPT4ge21vbnRoOiAnMScsIHllYXI6ICczOSd9XG4gICAgKi9cbiAgICBpZiAoZmlyc3RDaGFyYWN0ZXIgPT09IDEgJiYgTnVtYmVyKGRhdGVTdHJpbmdbMV0pID4gMikge1xuICAgICAgICByZXR1cm4gMTtcbiAgICB9XG4gICAgLypcbiAgICAgIGlmIHRoZSBmaXJzdCAyIGNoYXJhY3RlcnMgbWFrZSB1cCBhIG51bWJlciBiZXR3ZWVuXG4gICAgICAxMC0xMiwgd2UgY2hlY2sgaWYgdGhlIHllYXIgcG9ydGlvbiB3b3VsZCBiZSBjb25zaWRlcmVkXG4gICAgICB2YWxpZCBpZiB3ZSBhc3N1bWVkIHRoYXQgdGhlIG1vbnRoIHdhcyAxLiBJZiBpdCBpc1xuICAgICAgbm90IHBvdGVudGlhbGx5IHZhbGlkLCB3ZSBhc3N1bWUgdGhlIG1vbnRoIG11c3QgaGF2ZVxuICAgICAgMiBkaWdpdHMuXG4gIFxuICAgICAgJzEwOScgPT4ge21vbnRoOiAnMTAnLCB5ZWFyOiAnOSd9XG4gICAgICAnMTIwJyA9PiB7bW9udGg6ICcxJywgeWVhcjogJzIwJ30gLy8gd2hlbiBjaGVja2VkIGluIHRoZSB5ZWFyIDIwMTlcbiAgICAgICcxMjAnID0+IHttb250aDogJzEyJywgeWVhcjogJzAnfSAvLyB3aGVuIGNoZWNrZWQgaW4gdGhlIHllYXIgMjAyMVxuICAgICovXG4gICAgaWYgKGZpcnN0Q2hhcmFjdGVyID09PSAxKSB7XG4gICAgICAgIGFzc3VtZWRZZWFyID0gZGF0ZVN0cmluZy5zdWJzdHIoMSk7XG4gICAgICAgIHJldHVybiAoMCwgZXhwaXJhdGlvbl95ZWFyXzEuZXhwaXJhdGlvblllYXIpKGFzc3VtZWRZZWFyKS5pc1BvdGVudGlhbGx5VmFsaWQgPyAxIDogMjtcbiAgICB9XG4gICAgLypcbiAgICAgIElmIHRoZSBsZW5ndGggb2YgdGhlIHZhbHVlIGlzIGV4YWN0bHkgNSBjaGFyYWN0ZXJzLFxuICAgICAgd2UgYXNzdW1lIGEgZnVsbCB5ZWFyIHdhcyBwYXNzZWQgaW4sIG1lYW5pbmcgdGhlIHJlbWFpbmluZ1xuICAgICAgc2luZ2xlIGxlYWRpbmcgZGlnaXQgbXVzdCBiZSB0aGUgbW9udGggdmFsdWUuXG4gIFxuICAgICAgJzEyMjAyJyA9PiB7bW9udGg6ICcxJywgeWVhcjogJzIyMDInfVxuICAgICovXG4gICAgaWYgKGRhdGVTdHJpbmcubGVuZ3RoID09PSA1KSB7XG4gICAgICAgIHJldHVybiAxO1xuICAgIH1cbiAgICAvKlxuICAgICAgSWYgdGhlIGxlbmd0aCBvZiB0aGUgdmFsdWUgaXMgbW9yZSB0aGFuIGZpdmUgY2hhcmFjdGVycyxcbiAgICAgIHdlIGFzc3VtZSBhIGZ1bGwgeWVhciB3YXMgcGFzc2VkIGluIGFkZGl0aW9uIHRvIHRoZSBtb250aFxuICAgICAgYW5kIHRoZXJlZm9yZSB0aGUgbW9udGggcG9ydGlvbiBtdXN0IGJlIDIgZGlnaXRzLlxuICBcbiAgICAgICcxMTIwMjAnID0+IHttb250aDogJzExJywgeWVhcjogJzIwMjAnfVxuICAgICovXG4gICAgaWYgKGRhdGVTdHJpbmcubGVuZ3RoID4gNSkge1xuICAgICAgICByZXR1cm4gMjtcbiAgICB9XG4gICAgLypcbiAgICAgIEJ5IGRlZmF1bHQsIHRoZSBtb250aCB2YWx1ZSBpcyB0aGUgZmlyc3QgdmFsdWVcbiAgICAqL1xuICAgIHJldHVybiAxO1xufVxuZnVuY3Rpb24gcGFyc2VEYXRlKGRhdGVzdHJpbmcpIHtcbiAgICB2YXIgZGF0ZTtcbiAgICBpZiAoL15cXGR7NH0tXFxkezEsMn0kLy50ZXN0KGRhdGVzdHJpbmcpKSB7XG4gICAgICAgIGRhdGUgPSBkYXRlc3RyaW5nLnNwbGl0KFwiLVwiKS5yZXZlcnNlKCk7XG4gICAgfVxuICAgIGVsc2UgaWYgKC9cXC8vLnRlc3QoZGF0ZXN0cmluZykpIHtcbiAgICAgICAgZGF0ZSA9IGRhdGVzdHJpbmcuc3BsaXQoL1xccypcXC9cXHMqL2cpO1xuICAgIH1cbiAgICBlbHNlIGlmICgvXFxzLy50ZXN0KGRhdGVzdHJpbmcpKSB7XG4gICAgICAgIGRhdGUgPSBkYXRlc3RyaW5nLnNwbGl0KC8gKy9nKTtcbiAgICB9XG4gICAgaWYgKCgwLCBpc19hcnJheV8xLmlzQXJyYXkpKGRhdGUpKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBtb250aDogZGF0ZVswXSB8fCBcIlwiLFxuICAgICAgICAgICAgeWVhcjogZGF0ZS5zbGljZSgxKS5qb2luKCksXG4gICAgICAgIH07XG4gICAgfVxuICAgIHZhciBudW1iZXJPZkRpZ2l0c0luTW9udGggPSBnZXROdW1iZXJPZk1vbnRoRGlnaXRzSW5EYXRlU3RyaW5nKGRhdGVzdHJpbmcpO1xuICAgIHZhciBtb250aCA9IGRhdGVzdHJpbmcuc3Vic3RyKDAsIG51bWJlck9mRGlnaXRzSW5Nb250aCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgbW9udGg6IG1vbnRoLFxuICAgICAgICB5ZWFyOiBkYXRlc3RyaW5nLnN1YnN0cihtb250aC5sZW5ndGgpLFxuICAgIH07XG59XG5leHBvcnRzLnBhcnNlRGF0ZSA9IHBhcnNlRGF0ZTtcbiIsIi8qIGVzbGludC1kaXNhYmxlICovXG4vKlxuICogTHVobiBhbGdvcml0aG0gaW1wbGVtZW50YXRpb24gaW4gSmF2YVNjcmlwdFxuICogQ29weXJpZ2h0IChjKSAyMDA5IE5pY2hvbGFzIEMuIFpha2FzXG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuICogb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuICogaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuICogdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuICogY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gKiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gKiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gKiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiAqIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuICogQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuICogTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiAqIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiAqIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5mdW5jdGlvbiBsdWhuMTAoaWRlbnRpZmllcikge1xuICAgIHZhciBzdW0gPSAwO1xuICAgIHZhciBhbHQgPSBmYWxzZTtcbiAgICB2YXIgaSA9IGlkZW50aWZpZXIubGVuZ3RoIC0gMTtcbiAgICB2YXIgbnVtO1xuICAgIHdoaWxlIChpID49IDApIHtcbiAgICAgICAgbnVtID0gcGFyc2VJbnQoaWRlbnRpZmllci5jaGFyQXQoaSksIDEwKTtcbiAgICAgICAgaWYgKGFsdCkge1xuICAgICAgICAgICAgbnVtICo9IDI7XG4gICAgICAgICAgICBpZiAobnVtID4gOSkge1xuICAgICAgICAgICAgICAgIG51bSA9IChudW0gJSAxMCkgKyAxOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWV4dHJhLXBhcmVuc1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGFsdCA9ICFhbHQ7XG4gICAgICAgIHN1bSArPSBudW07XG4gICAgICAgIGktLTtcbiAgICB9XG4gICAgcmV0dXJuIHN1bSAlIDEwID09PSAwO1xufVxubW9kdWxlLmV4cG9ydHMgPSBsdWhuMTA7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMucG9zdGFsQ29kZSA9IHZvaWQgMDtcbnZhciBERUZBVUxUX01JTl9QT1NUQUxfQ09ERV9MRU5HVEggPSAzO1xuZnVuY3Rpb24gdmVyaWZpY2F0aW9uKGlzVmFsaWQsIGlzUG90ZW50aWFsbHlWYWxpZCkge1xuICAgIHJldHVybiB7IGlzVmFsaWQ6IGlzVmFsaWQsIGlzUG90ZW50aWFsbHlWYWxpZDogaXNQb3RlbnRpYWxseVZhbGlkIH07XG59XG5mdW5jdGlvbiBwb3N0YWxDb2RlKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkgeyBvcHRpb25zID0ge307IH1cbiAgICB2YXIgbWluTGVuZ3RoID0gb3B0aW9ucy5taW5MZW5ndGggfHwgREVGQVVMVF9NSU5fUE9TVEFMX0NPREVfTEVOR1RIO1xuICAgIGlmICh0eXBlb2YgdmFsdWUgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgcmV0dXJuIHZlcmlmaWNhdGlvbihmYWxzZSwgZmFsc2UpO1xuICAgIH1cbiAgICBlbHNlIGlmICh2YWx1ZS5sZW5ndGggPCBtaW5MZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIHZlcmlmaWNhdGlvbihmYWxzZSwgdHJ1ZSk7XG4gICAgfVxuICAgIHJldHVybiB2ZXJpZmljYXRpb24odHJ1ZSwgdHJ1ZSk7XG59XG5leHBvcnRzLnBvc3RhbENvZGUgPSBwb3N0YWxDb2RlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBmdW5jdGlvbiAoKSB7XG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxuICAgICAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0O1xuICAgIH07XG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xudmFyIGNhcmRUeXBlcyA9IHJlcXVpcmUoXCIuL2xpYi9jYXJkLXR5cGVzXCIpO1xudmFyIGFkZF9tYXRjaGluZ19jYXJkc190b19yZXN1bHRzXzEgPSByZXF1aXJlKFwiLi9saWIvYWRkLW1hdGNoaW5nLWNhcmRzLXRvLXJlc3VsdHNcIik7XG52YXIgaXNfdmFsaWRfaW5wdXRfdHlwZV8xID0gcmVxdWlyZShcIi4vbGliL2lzLXZhbGlkLWlucHV0LXR5cGVcIik7XG52YXIgZmluZF9iZXN0X21hdGNoXzEgPSByZXF1aXJlKFwiLi9saWIvZmluZC1iZXN0LW1hdGNoXCIpO1xudmFyIGNsb25lXzEgPSByZXF1aXJlKFwiLi9saWIvY2xvbmVcIik7XG52YXIgY3VzdG9tQ2FyZHMgPSB7fTtcbnZhciBjYXJkTmFtZXMgPSB7XG4gICAgVklTQTogXCJ2aXNhXCIsXG4gICAgTUFTVEVSQ0FSRDogXCJtYXN0ZXJjYXJkXCIsXG4gICAgQU1FUklDQU5fRVhQUkVTUzogXCJhbWVyaWNhbi1leHByZXNzXCIsXG4gICAgRElORVJTX0NMVUI6IFwiZGluZXJzLWNsdWJcIixcbiAgICBESVNDT1ZFUjogXCJkaXNjb3ZlclwiLFxuICAgIEpDQjogXCJqY2JcIixcbiAgICBVTklPTlBBWTogXCJ1bmlvbnBheVwiLFxuICAgIE1BRVNUUk86IFwibWFlc3Ryb1wiLFxuICAgIEVMTzogXCJlbG9cIixcbiAgICBNSVI6IFwibWlyXCIsXG4gICAgSElQRVI6IFwiaGlwZXJcIixcbiAgICBISVBFUkNBUkQ6IFwiaGlwZXJjYXJkXCIsXG59O1xudmFyIE9SSUdJTkFMX1RFU1RfT1JERVIgPSBbXG4gICAgY2FyZE5hbWVzLlZJU0EsXG4gICAgY2FyZE5hbWVzLk1BU1RFUkNBUkQsXG4gICAgY2FyZE5hbWVzLkFNRVJJQ0FOX0VYUFJFU1MsXG4gICAgY2FyZE5hbWVzLkRJTkVSU19DTFVCLFxuICAgIGNhcmROYW1lcy5ESVNDT1ZFUixcbiAgICBjYXJkTmFtZXMuSkNCLFxuICAgIGNhcmROYW1lcy5VTklPTlBBWSxcbiAgICBjYXJkTmFtZXMuTUFFU1RSTyxcbiAgICBjYXJkTmFtZXMuRUxPLFxuICAgIGNhcmROYW1lcy5NSVIsXG4gICAgY2FyZE5hbWVzLkhJUEVSLFxuICAgIGNhcmROYW1lcy5ISVBFUkNBUkQsXG5dO1xudmFyIHRlc3RPcmRlciA9IGNsb25lXzEuY2xvbmUoT1JJR0lOQUxfVEVTVF9PUkRFUik7XG5mdW5jdGlvbiBmaW5kVHlwZShjYXJkVHlwZSkge1xuICAgIHJldHVybiBjdXN0b21DYXJkc1tjYXJkVHlwZV0gfHwgY2FyZFR5cGVzW2NhcmRUeXBlXTtcbn1cbmZ1bmN0aW9uIGdldEFsbENhcmRUeXBlcygpIHtcbiAgICByZXR1cm4gdGVzdE9yZGVyLm1hcChmdW5jdGlvbiAoY2FyZFR5cGUpIHsgcmV0dXJuIGNsb25lXzEuY2xvbmUoZmluZFR5cGUoY2FyZFR5cGUpKTsgfSk7XG59XG5mdW5jdGlvbiBnZXRDYXJkUG9zaXRpb24obmFtZSwgaWdub3JlRXJyb3JGb3JOb3RFeGlzdGluZykge1xuICAgIGlmIChpZ25vcmVFcnJvckZvck5vdEV4aXN0aW5nID09PSB2b2lkIDApIHsgaWdub3JlRXJyb3JGb3JOb3RFeGlzdGluZyA9IGZhbHNlOyB9XG4gICAgdmFyIHBvc2l0aW9uID0gdGVzdE9yZGVyLmluZGV4T2YobmFtZSk7XG4gICAgaWYgKCFpZ25vcmVFcnJvckZvck5vdEV4aXN0aW5nICYmIHBvc2l0aW9uID09PSAtMSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1wiJyArIG5hbWUgKyAnXCIgaXMgbm90IGEgc3VwcG9ydGVkIGNhcmQgdHlwZS4nKTtcbiAgICB9XG4gICAgcmV0dXJuIHBvc2l0aW9uO1xufVxuZnVuY3Rpb24gY3JlZGl0Q2FyZFR5cGUoY2FyZE51bWJlcikge1xuICAgIHZhciByZXN1bHRzID0gW107XG4gICAgaWYgKCFpc192YWxpZF9pbnB1dF90eXBlXzEuaXNWYWxpZElucHV0VHlwZShjYXJkTnVtYmVyKSkge1xuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG4gICAgaWYgKGNhcmROdW1iZXIubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBnZXRBbGxDYXJkVHlwZXMoKTtcbiAgICB9XG4gICAgdGVzdE9yZGVyLmZvckVhY2goZnVuY3Rpb24gKGNhcmRUeXBlKSB7XG4gICAgICAgIHZhciBjYXJkQ29uZmlndXJhdGlvbiA9IGZpbmRUeXBlKGNhcmRUeXBlKTtcbiAgICAgICAgYWRkX21hdGNoaW5nX2NhcmRzX3RvX3Jlc3VsdHNfMS5hZGRNYXRjaGluZ0NhcmRzVG9SZXN1bHRzKGNhcmROdW1iZXIsIGNhcmRDb25maWd1cmF0aW9uLCByZXN1bHRzKTtcbiAgICB9KTtcbiAgICB2YXIgYmVzdE1hdGNoID0gZmluZF9iZXN0X21hdGNoXzEuZmluZEJlc3RNYXRjaChyZXN1bHRzKTtcbiAgICBpZiAoYmVzdE1hdGNoKSB7XG4gICAgICAgIHJldHVybiBbYmVzdE1hdGNoXTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG59XG5jcmVkaXRDYXJkVHlwZS5nZXRUeXBlSW5mbyA9IGZ1bmN0aW9uIChjYXJkVHlwZSkge1xuICAgIHJldHVybiBjbG9uZV8xLmNsb25lKGZpbmRUeXBlKGNhcmRUeXBlKSk7XG59O1xuY3JlZGl0Q2FyZFR5cGUucmVtb3ZlQ2FyZCA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdmFyIHBvc2l0aW9uID0gZ2V0Q2FyZFBvc2l0aW9uKG5hbWUpO1xuICAgIHRlc3RPcmRlci5zcGxpY2UocG9zaXRpb24sIDEpO1xufTtcbmNyZWRpdENhcmRUeXBlLmFkZENhcmQgPSBmdW5jdGlvbiAoY29uZmlnKSB7XG4gICAgdmFyIGV4aXN0aW5nQ2FyZFBvc2l0aW9uID0gZ2V0Q2FyZFBvc2l0aW9uKGNvbmZpZy50eXBlLCB0cnVlKTtcbiAgICBjdXN0b21DYXJkc1tjb25maWcudHlwZV0gPSBjb25maWc7XG4gICAgaWYgKGV4aXN0aW5nQ2FyZFBvc2l0aW9uID09PSAtMSkge1xuICAgICAgICB0ZXN0T3JkZXIucHVzaChjb25maWcudHlwZSk7XG4gICAgfVxufTtcbmNyZWRpdENhcmRUeXBlLnVwZGF0ZUNhcmQgPSBmdW5jdGlvbiAoY2FyZFR5cGUsIHVwZGF0ZXMpIHtcbiAgICB2YXIgb3JpZ2luYWxPYmplY3QgPSBjdXN0b21DYXJkc1tjYXJkVHlwZV0gfHwgY2FyZFR5cGVzW2NhcmRUeXBlXTtcbiAgICBpZiAoIW9yaWdpbmFsT2JqZWN0KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlxcXCJcIiArIGNhcmRUeXBlICsgXCJcXFwiIGlzIG5vdCBhIHJlY29nbml6ZWQgdHlwZS4gVXNlIGBhZGRDYXJkYCBpbnN0ZWFkLidcIik7XG4gICAgfVxuICAgIGlmICh1cGRhdGVzLnR5cGUgJiYgb3JpZ2luYWxPYmplY3QudHlwZSAhPT0gdXBkYXRlcy50eXBlKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBvdmVyd3JpdGUgdHlwZSBwYXJhbWV0ZXIuXCIpO1xuICAgIH1cbiAgICB2YXIgY2xvbmVkQ2FyZCA9IGNsb25lXzEuY2xvbmUob3JpZ2luYWxPYmplY3QpO1xuICAgIGNsb25lZENhcmQgPSBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgY2xvbmVkQ2FyZCksIHVwZGF0ZXMpO1xuICAgIGN1c3RvbUNhcmRzW2Nsb25lZENhcmQudHlwZV0gPSBjbG9uZWRDYXJkO1xufTtcbmNyZWRpdENhcmRUeXBlLmNoYW5nZU9yZGVyID0gZnVuY3Rpb24gKG5hbWUsIHBvc2l0aW9uKSB7XG4gICAgdmFyIGN1cnJlbnRQb3NpdGlvbiA9IGdldENhcmRQb3NpdGlvbihuYW1lKTtcbiAgICB0ZXN0T3JkZXIuc3BsaWNlKGN1cnJlbnRQb3NpdGlvbiwgMSk7XG4gICAgdGVzdE9yZGVyLnNwbGljZShwb3NpdGlvbiwgMCwgbmFtZSk7XG59O1xuY3JlZGl0Q2FyZFR5cGUucmVzZXRNb2RpZmljYXRpb25zID0gZnVuY3Rpb24gKCkge1xuICAgIHRlc3RPcmRlciA9IGNsb25lXzEuY2xvbmUoT1JJR0lOQUxfVEVTVF9PUkRFUik7XG4gICAgY3VzdG9tQ2FyZHMgPSB7fTtcbn07XG5jcmVkaXRDYXJkVHlwZS50eXBlcyA9IGNhcmROYW1lcztcbm1vZHVsZS5leHBvcnRzID0gY3JlZGl0Q2FyZFR5cGU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuYWRkTWF0Y2hpbmdDYXJkc1RvUmVzdWx0cyA9IHZvaWQgMDtcbnZhciBjbG9uZV8xID0gcmVxdWlyZShcIi4vY2xvbmVcIik7XG52YXIgbWF0Y2hlc18xID0gcmVxdWlyZShcIi4vbWF0Y2hlc1wiKTtcbmZ1bmN0aW9uIGFkZE1hdGNoaW5nQ2FyZHNUb1Jlc3VsdHMoY2FyZE51bWJlciwgY2FyZENvbmZpZ3VyYXRpb24sIHJlc3VsdHMpIHtcbiAgICB2YXIgaSwgcGF0dGVybkxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgY2FyZENvbmZpZ3VyYXRpb24ucGF0dGVybnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHBhdHRlcm4gPSBjYXJkQ29uZmlndXJhdGlvbi5wYXR0ZXJuc1tpXTtcbiAgICAgICAgaWYgKCFtYXRjaGVzXzEubWF0Y2hlcyhjYXJkTnVtYmVyLCBwYXR0ZXJuKSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNsb25lZENhcmRDb25maWd1cmF0aW9uID0gY2xvbmVfMS5jbG9uZShjYXJkQ29uZmlndXJhdGlvbik7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHBhdHRlcm4pKSB7XG4gICAgICAgICAgICBwYXR0ZXJuTGVuZ3RoID0gU3RyaW5nKHBhdHRlcm5bMF0pLmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHBhdHRlcm5MZW5ndGggPSBTdHJpbmcocGF0dGVybikubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjYXJkTnVtYmVyLmxlbmd0aCA+PSBwYXR0ZXJuTGVuZ3RoKSB7XG4gICAgICAgICAgICBjbG9uZWRDYXJkQ29uZmlndXJhdGlvbi5tYXRjaFN0cmVuZ3RoID0gcGF0dGVybkxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHRzLnB1c2goY2xvbmVkQ2FyZENvbmZpZ3VyYXRpb24pO1xuICAgICAgICBicmVhaztcbiAgICB9XG59XG5leHBvcnRzLmFkZE1hdGNoaW5nQ2FyZHNUb1Jlc3VsdHMgPSBhZGRNYXRjaGluZ0NhcmRzVG9SZXN1bHRzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgY2FyZFR5cGVzID0ge1xuICAgIHZpc2E6IHtcbiAgICAgICAgbmljZVR5cGU6IFwiVmlzYVwiLFxuICAgICAgICB0eXBlOiBcInZpc2FcIixcbiAgICAgICAgcGF0dGVybnM6IFs0XSxcbiAgICAgICAgZ2FwczogWzQsIDgsIDEyXSxcbiAgICAgICAgbGVuZ3RoczogWzE2LCAxOCwgMTldLFxuICAgICAgICBjb2RlOiB7XG4gICAgICAgICAgICBuYW1lOiBcIkNWVlwiLFxuICAgICAgICAgICAgc2l6ZTogMyxcbiAgICAgICAgfSxcbiAgICB9LFxuICAgIG1hc3RlcmNhcmQ6IHtcbiAgICAgICAgbmljZVR5cGU6IFwiTWFzdGVyY2FyZFwiLFxuICAgICAgICB0eXBlOiBcIm1hc3RlcmNhcmRcIixcbiAgICAgICAgcGF0dGVybnM6IFtbNTEsIDU1XSwgWzIyMjEsIDIyMjldLCBbMjIzLCAyMjldLCBbMjMsIDI2XSwgWzI3MCwgMjcxXSwgMjcyMF0sXG4gICAgICAgIGdhcHM6IFs0LCA4LCAxMl0sXG4gICAgICAgIGxlbmd0aHM6IFsxNl0sXG4gICAgICAgIGNvZGU6IHtcbiAgICAgICAgICAgIG5hbWU6IFwiQ1ZDXCIsXG4gICAgICAgICAgICBzaXplOiAzLFxuICAgICAgICB9LFxuICAgIH0sXG4gICAgXCJhbWVyaWNhbi1leHByZXNzXCI6IHtcbiAgICAgICAgbmljZVR5cGU6IFwiQW1lcmljYW4gRXhwcmVzc1wiLFxuICAgICAgICB0eXBlOiBcImFtZXJpY2FuLWV4cHJlc3NcIixcbiAgICAgICAgcGF0dGVybnM6IFszNCwgMzddLFxuICAgICAgICBnYXBzOiBbNCwgMTBdLFxuICAgICAgICBsZW5ndGhzOiBbMTVdLFxuICAgICAgICBjb2RlOiB7XG4gICAgICAgICAgICBuYW1lOiBcIkNJRFwiLFxuICAgICAgICAgICAgc2l6ZTogNCxcbiAgICAgICAgfSxcbiAgICB9LFxuICAgIFwiZGluZXJzLWNsdWJcIjoge1xuICAgICAgICBuaWNlVHlwZTogXCJEaW5lcnMgQ2x1YlwiLFxuICAgICAgICB0eXBlOiBcImRpbmVycy1jbHViXCIsXG4gICAgICAgIHBhdHRlcm5zOiBbWzMwMCwgMzA1XSwgMzYsIDM4LCAzOV0sXG4gICAgICAgIGdhcHM6IFs0LCAxMF0sXG4gICAgICAgIGxlbmd0aHM6IFsxNCwgMTYsIDE5XSxcbiAgICAgICAgY29kZToge1xuICAgICAgICAgICAgbmFtZTogXCJDVlZcIixcbiAgICAgICAgICAgIHNpemU6IDMsXG4gICAgICAgIH0sXG4gICAgfSxcbiAgICBkaXNjb3Zlcjoge1xuICAgICAgICBuaWNlVHlwZTogXCJEaXNjb3ZlclwiLFxuICAgICAgICB0eXBlOiBcImRpc2NvdmVyXCIsXG4gICAgICAgIHBhdHRlcm5zOiBbNjAxMSwgWzY0NCwgNjQ5XSwgNjVdLFxuICAgICAgICBnYXBzOiBbNCwgOCwgMTJdLFxuICAgICAgICBsZW5ndGhzOiBbMTYsIDE5XSxcbiAgICAgICAgY29kZToge1xuICAgICAgICAgICAgbmFtZTogXCJDSURcIixcbiAgICAgICAgICAgIHNpemU6IDMsXG4gICAgICAgIH0sXG4gICAgfSxcbiAgICBqY2I6IHtcbiAgICAgICAgbmljZVR5cGU6IFwiSkNCXCIsXG4gICAgICAgIHR5cGU6IFwiamNiXCIsXG4gICAgICAgIHBhdHRlcm5zOiBbMjEzMSwgMTgwMCwgWzM1MjgsIDM1ODldXSxcbiAgICAgICAgZ2FwczogWzQsIDgsIDEyXSxcbiAgICAgICAgbGVuZ3RoczogWzE2LCAxNywgMTgsIDE5XSxcbiAgICAgICAgY29kZToge1xuICAgICAgICAgICAgbmFtZTogXCJDVlZcIixcbiAgICAgICAgICAgIHNpemU6IDMsXG4gICAgICAgIH0sXG4gICAgfSxcbiAgICB1bmlvbnBheToge1xuICAgICAgICBuaWNlVHlwZTogXCJVbmlvblBheVwiLFxuICAgICAgICB0eXBlOiBcInVuaW9ucGF5XCIsXG4gICAgICAgIHBhdHRlcm5zOiBbXG4gICAgICAgICAgICA2MjAsXG4gICAgICAgICAgICBbNjI0LCA2MjZdLFxuICAgICAgICAgICAgWzYyMTAwLCA2MjE4Ml0sXG4gICAgICAgICAgICBbNjIxODQsIDYyMTg3XSxcbiAgICAgICAgICAgIFs2MjE4NSwgNjIxOTddLFxuICAgICAgICAgICAgWzYyMjAwLCA2MjIwNV0sXG4gICAgICAgICAgICBbNjIyMDEwLCA2MjI5OTldLFxuICAgICAgICAgICAgNjIyMDE4LFxuICAgICAgICAgICAgWzYyMjAxOSwgNjIyOTk5XSxcbiAgICAgICAgICAgIFs2MjIwNywgNjIyMDldLFxuICAgICAgICAgICAgWzYyMjEyNiwgNjIyOTI1XSxcbiAgICAgICAgICAgIFs2MjMsIDYyNl0sXG4gICAgICAgICAgICA2MjcwLFxuICAgICAgICAgICAgNjI3MixcbiAgICAgICAgICAgIDYyNzYsXG4gICAgICAgICAgICBbNjI3NzAwLCA2Mjc3NzldLFxuICAgICAgICAgICAgWzYyNzc4MSwgNjI3Nzk5XSxcbiAgICAgICAgICAgIFs2MjgyLCA2Mjg5XSxcbiAgICAgICAgICAgIDYyOTEsXG4gICAgICAgICAgICA2MjkyLFxuICAgICAgICAgICAgODEwLFxuICAgICAgICAgICAgWzgxMTAsIDgxMzFdLFxuICAgICAgICAgICAgWzgxMzIsIDgxNTFdLFxuICAgICAgICAgICAgWzgxNTIsIDgxNjNdLFxuICAgICAgICAgICAgWzgxNjQsIDgxNzFdLFxuICAgICAgICBdLFxuICAgICAgICBnYXBzOiBbNCwgOCwgMTJdLFxuICAgICAgICBsZW5ndGhzOiBbMTQsIDE1LCAxNiwgMTcsIDE4LCAxOV0sXG4gICAgICAgIGNvZGU6IHtcbiAgICAgICAgICAgIG5hbWU6IFwiQ1ZOXCIsXG4gICAgICAgICAgICBzaXplOiAzLFxuICAgICAgICB9LFxuICAgIH0sXG4gICAgbWFlc3Rybzoge1xuICAgICAgICBuaWNlVHlwZTogXCJNYWVzdHJvXCIsXG4gICAgICAgIHR5cGU6IFwibWFlc3Ryb1wiLFxuICAgICAgICBwYXR0ZXJuczogW1xuICAgICAgICAgICAgNDkzNjk4LFxuICAgICAgICAgICAgWzUwMDAwMCwgNTA0MTc0XSxcbiAgICAgICAgICAgIFs1MDQxNzYsIDUwNjY5OF0sXG4gICAgICAgICAgICBbNTA2Nzc5LCA1MDg5OTldLFxuICAgICAgICAgICAgWzU2LCA1OV0sXG4gICAgICAgICAgICA2MyxcbiAgICAgICAgICAgIDY3LFxuICAgICAgICAgICAgNixcbiAgICAgICAgXSxcbiAgICAgICAgZ2FwczogWzQsIDgsIDEyXSxcbiAgICAgICAgbGVuZ3RoczogWzEyLCAxMywgMTQsIDE1LCAxNiwgMTcsIDE4LCAxOV0sXG4gICAgICAgIGNvZGU6IHtcbiAgICAgICAgICAgIG5hbWU6IFwiQ1ZDXCIsXG4gICAgICAgICAgICBzaXplOiAzLFxuICAgICAgICB9LFxuICAgIH0sXG4gICAgZWxvOiB7XG4gICAgICAgIG5pY2VUeXBlOiBcIkVsb1wiLFxuICAgICAgICB0eXBlOiBcImVsb1wiLFxuICAgICAgICBwYXR0ZXJuczogW1xuICAgICAgICAgICAgNDAxMTc4LFxuICAgICAgICAgICAgNDAxMTc5LFxuICAgICAgICAgICAgNDM4OTM1LFxuICAgICAgICAgICAgNDU3NjMxLFxuICAgICAgICAgICAgNDU3NjMyLFxuICAgICAgICAgICAgNDMxMjc0LFxuICAgICAgICAgICAgNDUxNDE2LFxuICAgICAgICAgICAgNDU3MzkzLFxuICAgICAgICAgICAgNTA0MTc1LFxuICAgICAgICAgICAgWzUwNjY5OSwgNTA2Nzc4XSxcbiAgICAgICAgICAgIFs1MDkwMDAsIDUwOTk5OV0sXG4gICAgICAgICAgICA2Mjc3ODAsXG4gICAgICAgICAgICA2MzYyOTcsXG4gICAgICAgICAgICA2MzYzNjgsXG4gICAgICAgICAgICBbNjUwMDMxLCA2NTAwMzNdLFxuICAgICAgICAgICAgWzY1MDAzNSwgNjUwMDUxXSxcbiAgICAgICAgICAgIFs2NTA0MDUsIDY1MDQzOV0sXG4gICAgICAgICAgICBbNjUwNDg1LCA2NTA1MzhdLFxuICAgICAgICAgICAgWzY1MDU0MSwgNjUwNTk4XSxcbiAgICAgICAgICAgIFs2NTA3MDAsIDY1MDcxOF0sXG4gICAgICAgICAgICBbNjUwNzIwLCA2NTA3MjddLFxuICAgICAgICAgICAgWzY1MDkwMSwgNjUwOTc4XSxcbiAgICAgICAgICAgIFs2NTE2NTIsIDY1MTY3OV0sXG4gICAgICAgICAgICBbNjU1MDAwLCA2NTUwMTldLFxuICAgICAgICAgICAgWzY1NTAyMSwgNjU1MDU4XSxcbiAgICAgICAgXSxcbiAgICAgICAgZ2FwczogWzQsIDgsIDEyXSxcbiAgICAgICAgbGVuZ3RoczogWzE2XSxcbiAgICAgICAgY29kZToge1xuICAgICAgICAgICAgbmFtZTogXCJDVkVcIixcbiAgICAgICAgICAgIHNpemU6IDMsXG4gICAgICAgIH0sXG4gICAgfSxcbiAgICBtaXI6IHtcbiAgICAgICAgbmljZVR5cGU6IFwiTWlyXCIsXG4gICAgICAgIHR5cGU6IFwibWlyXCIsXG4gICAgICAgIHBhdHRlcm5zOiBbWzIyMDAsIDIyMDRdXSxcbiAgICAgICAgZ2FwczogWzQsIDgsIDEyXSxcbiAgICAgICAgbGVuZ3RoczogWzE2LCAxNywgMTgsIDE5XSxcbiAgICAgICAgY29kZToge1xuICAgICAgICAgICAgbmFtZTogXCJDVlAyXCIsXG4gICAgICAgICAgICBzaXplOiAzLFxuICAgICAgICB9LFxuICAgIH0sXG4gICAgaGlwZXI6IHtcbiAgICAgICAgbmljZVR5cGU6IFwiSGlwZXJcIixcbiAgICAgICAgdHlwZTogXCJoaXBlclwiLFxuICAgICAgICBwYXR0ZXJuczogWzYzNzA5NSwgNjM3Mzc0MjMsIDYzNzQzMzU4LCA2Mzc1NjgsIDYzNzU5OSwgNjM3NjA5LCA2Mzc2MTJdLFxuICAgICAgICBnYXBzOiBbNCwgOCwgMTJdLFxuICAgICAgICBsZW5ndGhzOiBbMTZdLFxuICAgICAgICBjb2RlOiB7XG4gICAgICAgICAgICBuYW1lOiBcIkNWQ1wiLFxuICAgICAgICAgICAgc2l6ZTogMyxcbiAgICAgICAgfSxcbiAgICB9LFxuICAgIGhpcGVyY2FyZDoge1xuICAgICAgICBuaWNlVHlwZTogXCJIaXBlcmNhcmRcIixcbiAgICAgICAgdHlwZTogXCJoaXBlcmNhcmRcIixcbiAgICAgICAgcGF0dGVybnM6IFs2MDYyODJdLFxuICAgICAgICBnYXBzOiBbNCwgOCwgMTJdLFxuICAgICAgICBsZW5ndGhzOiBbMTZdLFxuICAgICAgICBjb2RlOiB7XG4gICAgICAgICAgICBuYW1lOiBcIkNWQ1wiLFxuICAgICAgICAgICAgc2l6ZTogMyxcbiAgICAgICAgfSxcbiAgICB9LFxufTtcbm1vZHVsZS5leHBvcnRzID0gY2FyZFR5cGVzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmNsb25lID0gdm9pZCAwO1xuZnVuY3Rpb24gY2xvbmUob3JpZ2luYWxPYmplY3QpIHtcbiAgICBpZiAoIW9yaWdpbmFsT2JqZWN0KSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvcmlnaW5hbE9iamVjdCkpO1xufVxuZXhwb3J0cy5jbG9uZSA9IGNsb25lO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmZpbmRCZXN0TWF0Y2ggPSB2b2lkIDA7XG5mdW5jdGlvbiBoYXNFbm91Z2hSZXN1bHRzVG9EZXRlcm1pbmVCZXN0TWF0Y2gocmVzdWx0cykge1xuICAgIHZhciBudW1iZXJPZlJlc3VsdHNXaXRoTWF4U3RyZW5ndGhQcm9wZXJ0eSA9IHJlc3VsdHMuZmlsdGVyKGZ1bmN0aW9uIChyZXN1bHQpIHsgcmV0dXJuIHJlc3VsdC5tYXRjaFN0cmVuZ3RoOyB9KS5sZW5ndGg7XG4gICAgLypcbiAgICAgKiBpZiBhbGwgcG9zc2libGUgcmVzdWx0cyBoYXZlIGEgbWF4U3RyZW5ndGggcHJvcGVydHkgdGhhdCBtZWFucyB0aGUgY2FyZFxuICAgICAqIG51bWJlciBpcyBzdWZmaWNpZW50bHkgbG9uZyBlbm91Z2ggdG8gZGV0ZXJtaW5lIGNvbmNsdXNpdmVseSB3aGF0IHRoZSBjYXJkXG4gICAgICogdHlwZSBpc1xuICAgICAqICovXG4gICAgcmV0dXJuIChudW1iZXJPZlJlc3VsdHNXaXRoTWF4U3RyZW5ndGhQcm9wZXJ0eSA+IDAgJiZcbiAgICAgICAgbnVtYmVyT2ZSZXN1bHRzV2l0aE1heFN0cmVuZ3RoUHJvcGVydHkgPT09IHJlc3VsdHMubGVuZ3RoKTtcbn1cbmZ1bmN0aW9uIGZpbmRCZXN0TWF0Y2gocmVzdWx0cykge1xuICAgIGlmICghaGFzRW5vdWdoUmVzdWx0c1RvRGV0ZXJtaW5lQmVzdE1hdGNoKHJlc3VsdHMpKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cy5yZWR1Y2UoZnVuY3Rpb24gKGJlc3RNYXRjaCwgcmVzdWx0KSB7XG4gICAgICAgIGlmICghYmVzdE1hdGNoKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgICAgIC8qXG4gICAgICAgICAqIElmIHRoZSBjdXJyZW50IGJlc3QgbWF0Y2ggcGF0dGVybiBpcyBsZXNzIHNwZWNpZmljIHRoYW4gdGhpcyByZXN1bHQsIHNldFxuICAgICAgICAgKiB0aGUgcmVzdWx0IGFzIHRoZSBuZXcgYmVzdCBtYXRjaFxuICAgICAgICAgKiAqL1xuICAgICAgICBpZiAoTnVtYmVyKGJlc3RNYXRjaC5tYXRjaFN0cmVuZ3RoKSA8IE51bWJlcihyZXN1bHQubWF0Y2hTdHJlbmd0aCkpIHtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJlc3RNYXRjaDtcbiAgICB9KTtcbn1cbmV4cG9ydHMuZmluZEJlc3RNYXRjaCA9IGZpbmRCZXN0TWF0Y2g7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuaXNWYWxpZElucHV0VHlwZSA9IHZvaWQgMDtcbmZ1bmN0aW9uIGlzVmFsaWRJbnB1dFR5cGUoY2FyZE51bWJlcikge1xuICAgIHJldHVybiB0eXBlb2YgY2FyZE51bWJlciA9PT0gXCJzdHJpbmdcIiB8fCBjYXJkTnVtYmVyIGluc3RhbmNlb2YgU3RyaW5nO1xufVxuZXhwb3J0cy5pc1ZhbGlkSW5wdXRUeXBlID0gaXNWYWxpZElucHV0VHlwZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuLypcbiAqIEFkYXB0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vcG9sdm8tbGFicy9jYXJkLXR5cGUvYmxvYi9hYWFiMTFmODBmYTE5MzliY2NjOGYyNDkwNWEwNmFlM2NkODY0MzU2L3NyYy9jYXJkVHlwZS5qcyNMMzctTDQyXG4gKiAqL1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5tYXRjaGVzID0gdm9pZCAwO1xuZnVuY3Rpb24gbWF0Y2hlc1JhbmdlKGNhcmROdW1iZXIsIG1pbiwgbWF4KSB7XG4gICAgdmFyIG1heExlbmd0aFRvQ2hlY2sgPSBTdHJpbmcobWluKS5sZW5ndGg7XG4gICAgdmFyIHN1YnN0ciA9IGNhcmROdW1iZXIuc3Vic3RyKDAsIG1heExlbmd0aFRvQ2hlY2spO1xuICAgIHZhciBpbnRlZ2VyUmVwcmVzZW50YXRpb25PZkNhcmROdW1iZXIgPSBwYXJzZUludChzdWJzdHIsIDEwKTtcbiAgICBtaW4gPSBwYXJzZUludChTdHJpbmcobWluKS5zdWJzdHIoMCwgc3Vic3RyLmxlbmd0aCksIDEwKTtcbiAgICBtYXggPSBwYXJzZUludChTdHJpbmcobWF4KS5zdWJzdHIoMCwgc3Vic3RyLmxlbmd0aCksIDEwKTtcbiAgICByZXR1cm4gKGludGVnZXJSZXByZXNlbnRhdGlvbk9mQ2FyZE51bWJlciA+PSBtaW4gJiZcbiAgICAgICAgaW50ZWdlclJlcHJlc2VudGF0aW9uT2ZDYXJkTnVtYmVyIDw9IG1heCk7XG59XG5mdW5jdGlvbiBtYXRjaGVzUGF0dGVybihjYXJkTnVtYmVyLCBwYXR0ZXJuKSB7XG4gICAgcGF0dGVybiA9IFN0cmluZyhwYXR0ZXJuKTtcbiAgICByZXR1cm4gKHBhdHRlcm4uc3Vic3RyaW5nKDAsIGNhcmROdW1iZXIubGVuZ3RoKSA9PT1cbiAgICAgICAgY2FyZE51bWJlci5zdWJzdHJpbmcoMCwgcGF0dGVybi5sZW5ndGgpKTtcbn1cbmZ1bmN0aW9uIG1hdGNoZXMoY2FyZE51bWJlciwgcGF0dGVybikge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHBhdHRlcm4pKSB7XG4gICAgICAgIHJldHVybiBtYXRjaGVzUmFuZ2UoY2FyZE51bWJlciwgcGF0dGVyblswXSwgcGF0dGVyblsxXSk7XG4gICAgfVxuICAgIHJldHVybiBtYXRjaGVzUGF0dGVybihjYXJkTnVtYmVyLCBwYXR0ZXJuKTtcbn1cbmV4cG9ydHMubWF0Y2hlcyA9IG1hdGNoZXM7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB0eXBlcyA9IHJlcXVpcmUoJy4vbGliL2NhcmQtdHlwZXMnKTtcbnZhciBjbG9uZSA9IHJlcXVpcmUoJy4vbGliL2Nsb25lJyk7XG52YXIgZmluZEJlc3RNYXRjaCA9IHJlcXVpcmUoJy4vbGliL2ZpbmQtYmVzdC1tYXRjaCcpO1xudmFyIGlzVmFsaWRJbnB1dFR5cGUgPSByZXF1aXJlKCcuL2xpYi9pcy12YWxpZC1pbnB1dC10eXBlJyk7XG52YXIgYWRkTWF0Y2hpbmdDYXJkc1RvUmVzdWx0cyA9IHJlcXVpcmUoJy4vbGliL2FkZC1tYXRjaGluZy1jYXJkcy10by1yZXN1bHRzJyk7XG5cbnZhciB0ZXN0T3JkZXI7XG52YXIgY3VzdG9tQ2FyZHMgPSB7fTtcblxudmFyIGNhcmROYW1lcyA9IHtcbiAgVklTQTogJ3Zpc2EnLFxuICBNQVNURVJDQVJEOiAnbWFzdGVyY2FyZCcsXG4gIEFNRVJJQ0FOX0VYUFJFU1M6ICdhbWVyaWNhbi1leHByZXNzJyxcbiAgRElORVJTX0NMVUI6ICdkaW5lcnMtY2x1YicsXG4gIERJU0NPVkVSOiAnZGlzY292ZXInLFxuICBKQ0I6ICdqY2InLFxuICBVTklPTlBBWTogJ3VuaW9ucGF5JyxcbiAgTUFFU1RSTzogJ21hZXN0cm8nLFxuICBFTE86ICdlbG8nLFxuICBNSVI6ICdtaXInLFxuICBISVBFUjogJ2hpcGVyJyxcbiAgSElQRVJDQVJEOiAnaGlwZXJjYXJkJ1xufTtcblxudmFyIE9SSUdJTkFMX1RFU1RfT1JERVIgPSBbXG4gIGNhcmROYW1lcy5WSVNBLFxuICBjYXJkTmFtZXMuTUFTVEVSQ0FSRCxcbiAgY2FyZE5hbWVzLkFNRVJJQ0FOX0VYUFJFU1MsXG4gIGNhcmROYW1lcy5ESU5FUlNfQ0xVQixcbiAgY2FyZE5hbWVzLkRJU0NPVkVSLFxuICBjYXJkTmFtZXMuSkNCLFxuICBjYXJkTmFtZXMuVU5JT05QQVksXG4gIGNhcmROYW1lcy5NQUVTVFJPLFxuICBjYXJkTmFtZXMuRUxPLFxuICBjYXJkTmFtZXMuTUlSLFxuICBjYXJkTmFtZXMuSElQRVIsXG4gIGNhcmROYW1lcy5ISVBFUkNBUkRcbl07XG5cbnRlc3RPcmRlciA9IGNsb25lKE9SSUdJTkFMX1RFU1RfT1JERVIpO1xuXG5mdW5jdGlvbiBmaW5kVHlwZSh0eXBlKSB7XG4gIHJldHVybiBjdXN0b21DYXJkc1t0eXBlXSB8fCB0eXBlc1t0eXBlXTtcbn1cblxuZnVuY3Rpb24gZ2V0QWxsQ2FyZFR5cGVzKCkge1xuICByZXR1cm4gdGVzdE9yZGVyLm1hcChmdW5jdGlvbiAodHlwZSkge1xuICAgIHJldHVybiBjbG9uZShmaW5kVHlwZSh0eXBlKSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBnZXRDYXJkUG9zaXRpb24obmFtZSwgaWdub3JlRXJyb3JGb3JOb3RFeGlzdGluZykge1xuICB2YXIgcG9zaXRpb24gPSB0ZXN0T3JkZXIuaW5kZXhPZihuYW1lKTtcblxuICBpZiAoIWlnbm9yZUVycm9yRm9yTm90RXhpc3RpbmcgJiYgcG9zaXRpb24gPT09IC0xKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdcIicgKyBuYW1lICsgJ1wiIGlzIG5vdCBhIHN1cHBvcnRlZCBjYXJkIHR5cGUuJyk7XG4gIH1cblxuICByZXR1cm4gcG9zaXRpb247XG59XG5cbmZ1bmN0aW9uIGNyZWRpdENhcmRUeXBlKGNhcmROdW1iZXIpIHtcbiAgdmFyIGJlc3RNYXRjaDtcbiAgdmFyIHJlc3VsdHMgPSBbXTtcblxuICBpZiAoIWlzVmFsaWRJbnB1dFR5cGUoY2FyZE51bWJlcikpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBpZiAoY2FyZE51bWJlci5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gZ2V0QWxsQ2FyZFR5cGVzKHRlc3RPcmRlcik7XG4gIH1cblxuICB0ZXN0T3JkZXIuZm9yRWFjaChmdW5jdGlvbiAodHlwZSkge1xuICAgIHZhciBjYXJkQ29uZmlndXJhdGlvbiA9IGZpbmRUeXBlKHR5cGUpO1xuXG4gICAgYWRkTWF0Y2hpbmdDYXJkc1RvUmVzdWx0cyhjYXJkTnVtYmVyLCBjYXJkQ29uZmlndXJhdGlvbiwgcmVzdWx0cyk7XG4gIH0pO1xuXG4gIGJlc3RNYXRjaCA9IGZpbmRCZXN0TWF0Y2gocmVzdWx0cyk7XG5cbiAgaWYgKGJlc3RNYXRjaCkge1xuICAgIHJldHVybiBbYmVzdE1hdGNoXTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHRzO1xufVxuXG5jcmVkaXRDYXJkVHlwZS5nZXRUeXBlSW5mbyA9IGZ1bmN0aW9uICh0eXBlKSB7XG4gIHJldHVybiBjbG9uZShmaW5kVHlwZSh0eXBlKSk7XG59O1xuXG5jcmVkaXRDYXJkVHlwZS5yZW1vdmVDYXJkID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgdmFyIHBvc2l0aW9uID0gZ2V0Q2FyZFBvc2l0aW9uKG5hbWUpO1xuXG4gIHRlc3RPcmRlci5zcGxpY2UocG9zaXRpb24sIDEpO1xufTtcblxuY3JlZGl0Q2FyZFR5cGUuYWRkQ2FyZCA9IGZ1bmN0aW9uIChjb25maWcpIHtcbiAgdmFyIGV4aXN0aW5nQ2FyZFBvc2l0aW9uID0gZ2V0Q2FyZFBvc2l0aW9uKGNvbmZpZy50eXBlLCB0cnVlKTtcblxuICBjdXN0b21DYXJkc1tjb25maWcudHlwZV0gPSBjb25maWc7XG5cbiAgaWYgKGV4aXN0aW5nQ2FyZFBvc2l0aW9uID09PSAtMSkge1xuICAgIHRlc3RPcmRlci5wdXNoKGNvbmZpZy50eXBlKTtcbiAgfVxufTtcblxuY3JlZGl0Q2FyZFR5cGUudXBkYXRlQ2FyZCA9IGZ1bmN0aW9uIChjYXJkVHlwZSwgdXBkYXRlcykge1xuICB2YXIgY2xvbmVkQ2FyZDtcbiAgdmFyIG9yaWdpbmFsT2JqZWN0ID0gY3VzdG9tQ2FyZHNbY2FyZFR5cGVdIHx8IHR5cGVzW2NhcmRUeXBlXTtcblxuICBpZiAoIW9yaWdpbmFsT2JqZWN0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdcIicgKyBjYXJkVHlwZSArICdcIiBpcyBub3QgYSByZWNvZ25pemVkIHR5cGUuIFVzZSBgYWRkQ2FyZGAgaW5zdGVhZC4nKTtcbiAgfVxuXG4gIGlmICh1cGRhdGVzLnR5cGUgJiYgb3JpZ2luYWxPYmplY3QudHlwZSAhPT0gdXBkYXRlcy50eXBlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3Qgb3ZlcndyaXRlIHR5cGUgcGFyYW1ldGVyLicpO1xuICB9XG5cbiAgY2xvbmVkQ2FyZCA9IGNsb25lKG9yaWdpbmFsT2JqZWN0LCB0cnVlKTtcblxuICBPYmplY3Qua2V5cyhjbG9uZWRDYXJkKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICBpZiAodXBkYXRlc1trZXldKSB7XG4gICAgICBjbG9uZWRDYXJkW2tleV0gPSB1cGRhdGVzW2tleV07XG4gICAgfVxuICB9KTtcblxuICBjdXN0b21DYXJkc1tjbG9uZWRDYXJkLnR5cGVdID0gY2xvbmVkQ2FyZDtcbn07XG5cbmNyZWRpdENhcmRUeXBlLmNoYW5nZU9yZGVyID0gZnVuY3Rpb24gKG5hbWUsIHBvc2l0aW9uKSB7XG4gIHZhciBjdXJyZW50UG9zaXRpb24gPSBnZXRDYXJkUG9zaXRpb24obmFtZSk7XG5cbiAgdGVzdE9yZGVyLnNwbGljZShjdXJyZW50UG9zaXRpb24sIDEpO1xuICB0ZXN0T3JkZXIuc3BsaWNlKHBvc2l0aW9uLCAwLCBuYW1lKTtcbn07XG5cbmNyZWRpdENhcmRUeXBlLnJlc2V0TW9kaWZpY2F0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgdGVzdE9yZGVyID0gY2xvbmUoT1JJR0lOQUxfVEVTVF9PUkRFUik7XG4gIGN1c3RvbUNhcmRzID0ge307XG59O1xuXG5jcmVkaXRDYXJkVHlwZS50eXBlcyA9IGNhcmROYW1lcztcblxubW9kdWxlLmV4cG9ydHMgPSBjcmVkaXRDYXJkVHlwZTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNsb25lID0gcmVxdWlyZSgnLi9jbG9uZScpO1xudmFyIG1hdGNoZXMgPSByZXF1aXJlKCcuL21hdGNoZXMnKTtcblxuZnVuY3Rpb24gYWRkTWF0Y2hpbmdDYXJkc1RvUmVzdWx0cyhjYXJkTnVtYmVyLCBjYXJkQ29uZmlndXJhdGlvbiwgcmVzdWx0cykge1xuICB2YXIgaSwgcGF0dGVybiwgcGF0dGVybkxlbmd0aCwgY2xvbmVkQ2FyZENvbmZpZ3VyYXRpb247XG5cbiAgZm9yIChpID0gMDsgaSA8IGNhcmRDb25maWd1cmF0aW9uLnBhdHRlcm5zLmxlbmd0aDsgaSsrKSB7XG4gICAgcGF0dGVybiA9IGNhcmRDb25maWd1cmF0aW9uLnBhdHRlcm5zW2ldO1xuXG4gICAgaWYgKCFtYXRjaGVzKGNhcmROdW1iZXIsIHBhdHRlcm4pKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBjbG9uZWRDYXJkQ29uZmlndXJhdGlvbiA9IGNsb25lKGNhcmRDb25maWd1cmF0aW9uKTtcblxuICAgIGlmIChBcnJheS5pc0FycmF5KHBhdHRlcm4pKSB7XG4gICAgICBwYXR0ZXJuTGVuZ3RoID0gU3RyaW5nKHBhdHRlcm5bMF0pLmxlbmd0aDtcbiAgICB9IGVsc2Uge1xuICAgICAgcGF0dGVybkxlbmd0aCA9IFN0cmluZyhwYXR0ZXJuKS5sZW5ndGg7XG4gICAgfVxuXG4gICAgaWYgKGNhcmROdW1iZXIubGVuZ3RoID49IHBhdHRlcm5MZW5ndGgpIHtcbiAgICAgIGNsb25lZENhcmRDb25maWd1cmF0aW9uLm1hdGNoU3RyZW5ndGggPSBwYXR0ZXJuTGVuZ3RoO1xuICAgIH1cblxuICAgIHJlc3VsdHMucHVzaChjbG9uZWRDYXJkQ29uZmlndXJhdGlvbik7XG4gICAgYnJlYWs7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhZGRNYXRjaGluZ0NhcmRzVG9SZXN1bHRzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2FyZFR5cGVzID0ge1xuICB2aXNhOiB7XG4gICAgbmljZVR5cGU6ICdWaXNhJyxcbiAgICB0eXBlOiAndmlzYScsXG4gICAgcGF0dGVybnM6IFtcbiAgICAgIDRcbiAgICBdLFxuICAgIGdhcHM6IFs0LCA4LCAxMl0sXG4gICAgbGVuZ3RoczogWzE2LCAxOCwgMTldLFxuICAgIGNvZGU6IHtcbiAgICAgIG5hbWU6ICdDVlYnLFxuICAgICAgc2l6ZTogM1xuICAgIH1cbiAgfSxcbiAgbWFzdGVyY2FyZDoge1xuICAgIG5pY2VUeXBlOiAnTWFzdGVyY2FyZCcsXG4gICAgdHlwZTogJ21hc3RlcmNhcmQnLFxuICAgIHBhdHRlcm5zOiBbXG4gICAgICBbNTEsIDU1XSxcbiAgICAgIFsyMjIxLCAyMjI5XSxcbiAgICAgIFsyMjMsIDIyOV0sXG4gICAgICBbMjMsIDI2XSxcbiAgICAgIFsyNzAsIDI3MV0sXG4gICAgICAyNzIwXG4gICAgXSxcbiAgICBnYXBzOiBbNCwgOCwgMTJdLFxuICAgIGxlbmd0aHM6IFsxNl0sXG4gICAgY29kZToge1xuICAgICAgbmFtZTogJ0NWQycsXG4gICAgICBzaXplOiAzXG4gICAgfVxuICB9LFxuICAnYW1lcmljYW4tZXhwcmVzcyc6IHtcbiAgICBuaWNlVHlwZTogJ0FtZXJpY2FuIEV4cHJlc3MnLFxuICAgIHR5cGU6ICdhbWVyaWNhbi1leHByZXNzJyxcbiAgICBwYXR0ZXJuczogW1xuICAgICAgMzQsXG4gICAgICAzN1xuICAgIF0sXG4gICAgZ2FwczogWzQsIDEwXSxcbiAgICBsZW5ndGhzOiBbMTVdLFxuICAgIGNvZGU6IHtcbiAgICAgIG5hbWU6ICdDSUQnLFxuICAgICAgc2l6ZTogNFxuICAgIH1cbiAgfSxcbiAgJ2RpbmVycy1jbHViJzoge1xuICAgIG5pY2VUeXBlOiAnRGluZXJzIENsdWInLFxuICAgIHR5cGU6ICdkaW5lcnMtY2x1YicsXG4gICAgcGF0dGVybnM6IFtcbiAgICAgIFszMDAsIDMwNV0sXG4gICAgICAzNixcbiAgICAgIDM4LFxuICAgICAgMzlcbiAgICBdLFxuICAgIGdhcHM6IFs0LCAxMF0sXG4gICAgbGVuZ3RoczogWzE0LCAxNiwgMTldLFxuICAgIGNvZGU6IHtcbiAgICAgIG5hbWU6ICdDVlYnLFxuICAgICAgc2l6ZTogM1xuICAgIH1cbiAgfSxcbiAgZGlzY292ZXI6IHtcbiAgICBuaWNlVHlwZTogJ0Rpc2NvdmVyJyxcbiAgICB0eXBlOiAnZGlzY292ZXInLFxuICAgIHBhdHRlcm5zOiBbXG4gICAgICA2MDExLFxuICAgICAgWzY0NCwgNjQ5XSxcbiAgICAgIDY1XG4gICAgXSxcbiAgICBnYXBzOiBbNCwgOCwgMTJdLFxuICAgIGxlbmd0aHM6IFsxNiwgMTldLFxuICAgIGNvZGU6IHtcbiAgICAgIG5hbWU6ICdDSUQnLFxuICAgICAgc2l6ZTogM1xuICAgIH1cbiAgfSxcbiAgamNiOiB7XG4gICAgbmljZVR5cGU6ICdKQ0InLFxuICAgIHR5cGU6ICdqY2InLFxuICAgIHBhdHRlcm5zOiBbXG4gICAgICAyMTMxLFxuICAgICAgMTgwMCxcbiAgICAgIFszNTI4LCAzNTg5XVxuICAgIF0sXG4gICAgZ2FwczogWzQsIDgsIDEyXSxcbiAgICBsZW5ndGhzOiBbMTYsIDE3LCAxOCwgMTldLFxuICAgIGNvZGU6IHtcbiAgICAgIG5hbWU6ICdDVlYnLFxuICAgICAgc2l6ZTogM1xuICAgIH1cbiAgfSxcbiAgdW5pb25wYXk6IHtcbiAgICBuaWNlVHlwZTogJ1VuaW9uUGF5JyxcbiAgICB0eXBlOiAndW5pb25wYXknLFxuICAgIHBhdHRlcm5zOiBbXG4gICAgICA2MjAsXG4gICAgICBbNjI0LCA2MjZdLFxuICAgICAgWzYyMTAwLCA2MjE4Ml0sXG4gICAgICBbNjIxODQsIDYyMTg3XSxcbiAgICAgIFs2MjE4NSwgNjIxOTddLFxuICAgICAgWzYyMjAwLCA2MjIwNV0sXG4gICAgICBbNjIyMDEwLCA2MjI5OTldLFxuICAgICAgNjIyMDE4LFxuICAgICAgWzYyMjAxOSwgNjIyOTk5XSxcbiAgICAgIFs2MjIwNywgNjIyMDldLFxuICAgICAgWzYyMjEyNiwgNjIyOTI1XSxcbiAgICAgIFs2MjMsIDYyNl0sXG4gICAgICA2MjcwLFxuICAgICAgNjI3MixcbiAgICAgIDYyNzYsXG4gICAgICBbNjI3NzAwLCA2Mjc3NzldLFxuICAgICAgWzYyNzc4MSwgNjI3Nzk5XSxcbiAgICAgIFs2MjgyLCA2Mjg5XSxcbiAgICAgIDYyOTEsXG4gICAgICA2MjkyLFxuICAgICAgODEwLFxuICAgICAgWzgxMTAsIDgxMzFdLFxuICAgICAgWzgxMzIsIDgxNTFdLFxuICAgICAgWzgxNTIsIDgxNjNdLFxuICAgICAgWzgxNjQsIDgxNzFdXG4gICAgXSxcbiAgICBnYXBzOiBbNCwgOCwgMTJdLFxuICAgIGxlbmd0aHM6IFsxNCwgMTUsIDE2LCAxNywgMTgsIDE5XSxcbiAgICBjb2RlOiB7XG4gICAgICBuYW1lOiAnQ1ZOJyxcbiAgICAgIHNpemU6IDNcbiAgICB9XG4gIH0sXG4gIG1hZXN0cm86IHtcbiAgICBuaWNlVHlwZTogJ01hZXN0cm8nLFxuICAgIHR5cGU6ICdtYWVzdHJvJyxcbiAgICBwYXR0ZXJuczogW1xuICAgICAgNDkzNjk4LFxuICAgICAgWzUwMDAwMCwgNTA2Njk4XSxcbiAgICAgIFs1MDY3NzksIDUwODk5OV0sXG4gICAgICBbNTYsIDU5XSxcbiAgICAgIDYzLFxuICAgICAgNjcsXG4gICAgICA2XG4gICAgXSxcbiAgICBnYXBzOiBbNCwgOCwgMTJdLFxuICAgIGxlbmd0aHM6IFsxMiwgMTMsIDE0LCAxNSwgMTYsIDE3LCAxOCwgMTldLFxuICAgIGNvZGU6IHtcbiAgICAgIG5hbWU6ICdDVkMnLFxuICAgICAgc2l6ZTogM1xuICAgIH1cbiAgfSxcbiAgZWxvOiB7XG4gICAgbmljZVR5cGU6ICdFbG8nLFxuICAgIHR5cGU6ICdlbG8nLFxuICAgIHBhdHRlcm5zOiBbXG4gICAgICA0MDExNzgsXG4gICAgICA0MDExNzksXG4gICAgICA0Mzg5MzUsXG4gICAgICA0NTc2MzEsXG4gICAgICA0NTc2MzIsXG4gICAgICA0MzEyNzQsXG4gICAgICA0NTE0MTYsXG4gICAgICA0NTczOTMsXG4gICAgICA1MDQxNzUsXG4gICAgICBbNTA2Njk5LCA1MDY3NzhdLFxuICAgICAgWzUwOTAwMCwgNTA5OTk5XSxcbiAgICAgIDYyNzc4MCxcbiAgICAgIDYzNjI5NyxcbiAgICAgIDYzNjM2OCxcbiAgICAgIFs2NTAwMzEsIDY1MDAzM10sXG4gICAgICBbNjUwMDM1LCA2NTAwNTFdLFxuICAgICAgWzY1MDQwNSwgNjUwNDM5XSxcbiAgICAgIFs2NTA0ODUsIDY1MDUzOF0sXG4gICAgICBbNjUwNTQxLCA2NTA1OThdLFxuICAgICAgWzY1MDcwMCwgNjUwNzE4XSxcbiAgICAgIFs2NTA3MjAsIDY1MDcyN10sXG4gICAgICBbNjUwOTAxLCA2NTA5NzhdLFxuICAgICAgWzY1MTY1MiwgNjUxNjc5XSxcbiAgICAgIFs2NTUwMDAsIDY1NTAxOV0sXG4gICAgICBbNjU1MDIxLCA2NTUwNThdXG4gICAgXSxcbiAgICBnYXBzOiBbNCwgOCwgMTJdLFxuICAgIGxlbmd0aHM6IFsxNl0sXG4gICAgY29kZToge1xuICAgICAgbmFtZTogJ0NWRScsXG4gICAgICBzaXplOiAzXG4gICAgfVxuICB9LFxuICBtaXI6IHtcbiAgICBuaWNlVHlwZTogJ01pcicsXG4gICAgdHlwZTogJ21pcicsXG4gICAgcGF0dGVybnM6IFtcbiAgICAgIFsyMjAwLCAyMjA0XVxuICAgIF0sXG4gICAgZ2FwczogWzQsIDgsIDEyXSxcbiAgICBsZW5ndGhzOiBbMTYsIDE3LCAxOCwgMTldLFxuICAgIGNvZGU6IHtcbiAgICAgIG5hbWU6ICdDVlAyJyxcbiAgICAgIHNpemU6IDNcbiAgICB9XG4gIH0sXG4gIGhpcGVyOiB7XG4gICAgbmljZVR5cGU6ICdIaXBlcicsXG4gICAgdHlwZTogJ2hpcGVyJyxcbiAgICBwYXR0ZXJuczogW1xuICAgICAgNjM3MDk1LFxuICAgICAgNjM3NTY4LFxuICAgICAgNjM3NTk5LFxuICAgICAgNjM3NjA5LFxuICAgICAgNjM3NjEyXG4gICAgXSxcbiAgICBnYXBzOiBbNCwgOCwgMTJdLFxuICAgIGxlbmd0aHM6IFsxNl0sXG4gICAgY29kZToge1xuICAgICAgbmFtZTogJ0NWQycsXG4gICAgICBzaXplOiAzXG4gICAgfVxuICB9LFxuICBoaXBlcmNhcmQ6IHtcbiAgICBuaWNlVHlwZTogJ0hpcGVyY2FyZCcsXG4gICAgdHlwZTogJ2hpcGVyY2FyZCcsXG4gICAgcGF0dGVybnM6IFtcbiAgICAgIDYwNjI4MlxuICAgIF0sXG4gICAgZ2FwczogWzQsIDgsIDEyXSxcbiAgICBsZW5ndGhzOiBbMTZdLFxuICAgIGNvZGU6IHtcbiAgICAgIG5hbWU6ICdDVkMnLFxuICAgICAgc2l6ZTogM1xuICAgIH1cbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBjYXJkVHlwZXM7XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIGNsb25lKG9yaWdpbmFsT2JqZWN0KSB7XG4gIHZhciBkdXBlO1xuXG4gIGlmICghb3JpZ2luYWxPYmplY3QpIHsgcmV0dXJuIG51bGw7IH1cblxuICBkdXBlID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvcmlnaW5hbE9iamVjdCkpO1xuXG4gIHJldHVybiBkdXBlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBoYXNFbm91Z2hSZXN1bHRzVG9EZXRlcm1pbmVCZXN0TWF0Y2gocmVzdWx0cykge1xuICB2YXIgbnVtYmVyT2ZSZXN1bHRzV2l0aE1heFN0cmVuZ3RoUHJvcGVydHkgPSByZXN1bHRzLmZpbHRlcihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgcmV0dXJuIHJlc3VsdC5tYXRjaFN0cmVuZ3RoO1xuICB9KS5sZW5ndGg7XG5cbiAgLy8gaWYgYWxsIHBvc3NpYmxlIHJlc3VsdHMgaGF2ZSBhIG1heFN0cmVuZ3RoIHByb3BlcnR5XG4gIC8vIHRoYXQgbWVhbnMgdGhlIGNhcmQgbnVtYmVyIGlzIHN1ZmZpY2llbnRseSBsb25nXG4gIC8vIGVub3VnaCB0byBkZXRlcm1pbmUgY29uY2x1c2l2ZWx5IHdoYXQgdGhlIHR5cGUgaXNcbiAgcmV0dXJuIG51bWJlck9mUmVzdWx0c1dpdGhNYXhTdHJlbmd0aFByb3BlcnR5ID4gMCAmJlxuICAgIG51bWJlck9mUmVzdWx0c1dpdGhNYXhTdHJlbmd0aFByb3BlcnR5ID09PSByZXN1bHRzLmxlbmd0aDtcbn1cblxuZnVuY3Rpb24gZmluZEJlc3RNYXRjaChyZXN1bHRzKSB7XG4gIGlmICghaGFzRW5vdWdoUmVzdWx0c1RvRGV0ZXJtaW5lQmVzdE1hdGNoKHJlc3VsdHMpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdHMucmVkdWNlKGZ1bmN0aW9uIChiZXN0TWF0Y2gsIHJlc3VsdCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGNvbnNpc3RlbnQtcmV0dXJuXG4gICAgaWYgKCFiZXN0TWF0Y2gpIHtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLy8gaWYgdGhlIGN1cnJlbnQgYmVzdCBtYXRjaCBwYXR0ZXJuIGlzIGxlc3Mgc3BlY2lmaWNcbiAgICAvLyB0aGFuIHRoaXMgcmVzdWx0LCBzZXQgdGhlIHJlc3VsdCBhcyB0aGUgbmV3IGJlc3QgbWF0Y2hcbiAgICBpZiAoYmVzdE1hdGNoLm1hdGNoU3RyZW5ndGggPCByZXN1bHQubWF0Y2hTdHJlbmd0aCkge1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICByZXR1cm4gYmVzdE1hdGNoO1xuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmaW5kQmVzdE1hdGNoO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBpc1ZhbGlkSW5wdXRUeXBlKGNhcmROdW1iZXIpIHtcbiAgcmV0dXJuIHR5cGVvZiBjYXJkTnVtYmVyID09PSAnc3RyaW5nJyB8fCBjYXJkTnVtYmVyIGluc3RhbmNlb2YgU3RyaW5nO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzVmFsaWRJbnB1dFR5cGU7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIEFkYXB0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vcG9sdm8tbGFicy9jYXJkLXR5cGUvYmxvYi9hYWFiMTFmODBmYTE5MzliY2NjOGYyNDkwNWEwNmFlM2NkODY0MzU2L3NyYy9jYXJkVHlwZS5qcyNMMzctTDQyXG5mdW5jdGlvbiBtYXRjaGVzUmFuZ2UoY2FyZE51bWJlciwgbWluLCBtYXgpIHtcbiAgdmFyIG1heExlbmd0aFRvQ2hlY2sgPSBTdHJpbmcobWluKS5sZW5ndGg7XG4gIHZhciBzdWJzdHIgPSBjYXJkTnVtYmVyLnN1YnN0cigwLCBtYXhMZW5ndGhUb0NoZWNrKTtcbiAgdmFyIGludGVnZXJSZXByZXNlbnRhdGlvbk9mQ2FyZE51bWJlciA9IHBhcnNlSW50KHN1YnN0ciwgMTApO1xuXG4gIG1pbiA9IHBhcnNlSW50KFN0cmluZyhtaW4pLnN1YnN0cigwLCBzdWJzdHIubGVuZ3RoKSwgMTApO1xuICBtYXggPSBwYXJzZUludChTdHJpbmcobWF4KS5zdWJzdHIoMCwgc3Vic3RyLmxlbmd0aCksIDEwKTtcblxuICByZXR1cm4gaW50ZWdlclJlcHJlc2VudGF0aW9uT2ZDYXJkTnVtYmVyID49IG1pbiAmJiBpbnRlZ2VyUmVwcmVzZW50YXRpb25PZkNhcmROdW1iZXIgPD0gbWF4O1xufVxuXG5mdW5jdGlvbiBtYXRjaGVzUGF0dGVybihjYXJkTnVtYmVyLCBwYXR0ZXJuKSB7XG4gIHBhdHRlcm4gPSBTdHJpbmcocGF0dGVybik7XG5cbiAgcmV0dXJuIHBhdHRlcm4uc3Vic3RyaW5nKDAsIGNhcmROdW1iZXIubGVuZ3RoKSA9PT0gY2FyZE51bWJlci5zdWJzdHJpbmcoMCwgcGF0dGVybi5sZW5ndGgpO1xufVxuXG5mdW5jdGlvbiBtYXRjaGVzKGNhcmROdW1iZXIsIHBhdHRlcm4pIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkocGF0dGVybikpIHtcbiAgICByZXR1cm4gbWF0Y2hlc1JhbmdlKGNhcmROdW1iZXIsIHBhdHRlcm5bMF0sIHBhdHRlcm5bMV0pO1xuICB9XG5cbiAgcmV0dXJuIG1hdGNoZXNQYXR0ZXJuKGNhcmROdW1iZXIsIHBhdHRlcm4pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hdGNoZXM7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB3aW4sIGZyYW1lYnVzO1xudmFyIHBvcHVwcyA9IFtdO1xudmFyIHN1YnNjcmliZXJzID0ge307XG52YXIgcHJlZml4ID0gJy8qZnJhbWVidXMqLyc7XG5cbmZ1bmN0aW9uIGluY2x1ZGUocG9wdXApIHtcbiAgaWYgKHBvcHVwID09IG51bGwpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIGlmIChwb3B1cC5XaW5kb3cgPT0gbnVsbCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYgKHBvcHVwLmNvbnN0cnVjdG9yICE9PSBwb3B1cC5XaW5kb3cpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgcG9wdXBzLnB1c2gocG9wdXApO1xuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gdGFyZ2V0KG9yaWdpbikge1xuICB2YXIga2V5O1xuICB2YXIgdGFyZ2V0ZWRGcmFtZWJ1cyA9IHt9O1xuXG4gIGZvciAoa2V5IGluIGZyYW1lYnVzKSB7XG4gICAgaWYgKCFmcmFtZWJ1cy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7IGNvbnRpbnVlOyB9XG5cbiAgICB0YXJnZXRlZEZyYW1lYnVzW2tleV0gPSBmcmFtZWJ1c1trZXldO1xuICB9XG5cbiAgdGFyZ2V0ZWRGcmFtZWJ1cy5fb3JpZ2luID0gb3JpZ2luIHx8ICcqJztcblxuICByZXR1cm4gdGFyZ2V0ZWRGcmFtZWJ1cztcbn1cblxuZnVuY3Rpb24gcHVibGlzaChldmVudCkge1xuICB2YXIgcGF5bG9hZCwgYXJncztcbiAgdmFyIG9yaWdpbiA9IF9nZXRPcmlnaW4odGhpcyk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8taW52YWxpZC10aGlzXG5cbiAgaWYgKF9pc250U3RyaW5nKGV2ZW50KSkgeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYgKF9pc250U3RyaW5nKG9yaWdpbikpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG5cbiAgcGF5bG9hZCA9IF9wYWNrYWdlUGF5bG9hZChldmVudCwgYXJncywgb3JpZ2luKTtcbiAgaWYgKHBheWxvYWQgPT09IGZhbHNlKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIF9icm9hZGNhc3Qod2luLnRvcCB8fCB3aW4uc2VsZiwgcGF5bG9hZCwgb3JpZ2luKTtcblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gc3Vic2NyaWJlKGV2ZW50LCBmbikge1xuICB2YXIgb3JpZ2luID0gX2dldE9yaWdpbih0aGlzKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1pbnZhbGlkLXRoaXNcblxuICBpZiAoX3N1YnNjcmlwdGlvbkFyZ3NJbnZhbGlkKGV2ZW50LCBmbiwgb3JpZ2luKSkgeyByZXR1cm4gZmFsc2U7IH1cblxuICBzdWJzY3JpYmVyc1tvcmlnaW5dID0gc3Vic2NyaWJlcnNbb3JpZ2luXSB8fCB7fTtcbiAgc3Vic2NyaWJlcnNbb3JpZ2luXVtldmVudF0gPSBzdWJzY3JpYmVyc1tvcmlnaW5dW2V2ZW50XSB8fCBbXTtcbiAgc3Vic2NyaWJlcnNbb3JpZ2luXVtldmVudF0ucHVzaChmbik7XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIHVuc3Vic2NyaWJlKGV2ZW50LCBmbikge1xuICB2YXIgaSwgc3Vic2NyaWJlckxpc3Q7XG4gIHZhciBvcmlnaW4gPSBfZ2V0T3JpZ2luKHRoaXMpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWludmFsaWQtdGhpc1xuXG4gIGlmIChfc3Vic2NyaXB0aW9uQXJnc0ludmFsaWQoZXZlbnQsIGZuLCBvcmlnaW4pKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIHN1YnNjcmliZXJMaXN0ID0gc3Vic2NyaWJlcnNbb3JpZ2luXSAmJiBzdWJzY3JpYmVyc1tvcmlnaW5dW2V2ZW50XTtcbiAgaWYgKCFzdWJzY3JpYmVyTGlzdCkgeyByZXR1cm4gZmFsc2U7IH1cblxuICBmb3IgKGkgPSAwOyBpIDwgc3Vic2NyaWJlckxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3Vic2NyaWJlckxpc3RbaV0gPT09IGZuKSB7XG4gICAgICBzdWJzY3JpYmVyTGlzdC5zcGxpY2UoaSwgMSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIF9nZXRPcmlnaW4oc2NvcGUpIHtcbiAgcmV0dXJuIHNjb3BlICYmIHNjb3BlLl9vcmlnaW4gfHwgJyonO1xufVxuXG5mdW5jdGlvbiBfaXNudFN0cmluZyhzdHJpbmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBzdHJpbmcgIT09ICdzdHJpbmcnO1xufVxuXG5mdW5jdGlvbiBfcGFja2FnZVBheWxvYWQoZXZlbnQsIGFyZ3MsIG9yaWdpbikge1xuICB2YXIgcGFja2FnZWQgPSBmYWxzZTtcbiAgdmFyIHBheWxvYWQgPSB7XG4gICAgZXZlbnQ6IGV2ZW50LFxuICAgIG9yaWdpbjogb3JpZ2luXG4gIH07XG4gIHZhciByZXBseSA9IGFyZ3NbYXJncy5sZW5ndGggLSAxXTtcblxuICBpZiAodHlwZW9mIHJlcGx5ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcGF5bG9hZC5yZXBseSA9IF9zdWJzY3JpYmVSZXBsaWVyKHJlcGx5LCBvcmlnaW4pO1xuICAgIGFyZ3MgPSBhcmdzLnNsaWNlKDAsIC0xKTtcbiAgfVxuXG4gIHBheWxvYWQuYXJncyA9IGFyZ3M7XG5cbiAgdHJ5IHtcbiAgICBwYWNrYWdlZCA9IHByZWZpeCArIEpTT04uc3RyaW5naWZ5KHBheWxvYWQpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDb3VsZCBub3Qgc3RyaW5naWZ5IGV2ZW50OiAnICsgZS5tZXNzYWdlKTtcbiAgfVxuICByZXR1cm4gcGFja2FnZWQ7XG59XG5cbmZ1bmN0aW9uIF91bnBhY2tQYXlsb2FkKGUpIHtcbiAgdmFyIHBheWxvYWQsIHJlcGx5T3JpZ2luLCByZXBseVNvdXJjZSwgcmVwbHlFdmVudDtcblxuICBpZiAoZS5kYXRhLnNsaWNlKDAsIHByZWZpeC5sZW5ndGgpICE9PSBwcmVmaXgpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgdHJ5IHtcbiAgICBwYXlsb2FkID0gSlNPTi5wYXJzZShlLmRhdGEuc2xpY2UocHJlZml4Lmxlbmd0aCkpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAocGF5bG9hZC5yZXBseSAhPSBudWxsKSB7XG4gICAgcmVwbHlPcmlnaW4gPSBlLm9yaWdpbjtcbiAgICByZXBseVNvdXJjZSA9IGUuc291cmNlO1xuICAgIHJlcGx5RXZlbnQgPSBwYXlsb2FkLnJlcGx5O1xuXG4gICAgcGF5bG9hZC5yZXBseSA9IGZ1bmN0aW9uIHJlcGx5KGRhdGEpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBjb25zaXN0ZW50LXJldHVyblxuICAgICAgdmFyIHJlcGx5UGF5bG9hZDtcblxuICAgICAgaWYgKCFyZXBseVNvdXJjZSkgeyByZXR1cm4gZmFsc2U7IH1cblxuICAgICAgcmVwbHlQYXlsb2FkID0gX3BhY2thZ2VQYXlsb2FkKHJlcGx5RXZlbnQsIFtkYXRhXSwgcmVwbHlPcmlnaW4pO1xuXG4gICAgICBpZiAocmVwbHlQYXlsb2FkID09PSBmYWxzZSkgeyByZXR1cm4gZmFsc2U7IH1cblxuICAgICAgcmVwbHlTb3VyY2UucG9zdE1lc3NhZ2UocmVwbHlQYXlsb2FkLCByZXBseU9yaWdpbik7XG4gICAgfTtcblxuICAgIHBheWxvYWQuYXJncy5wdXNoKHBheWxvYWQucmVwbHkpO1xuICB9XG5cbiAgcmV0dXJuIHBheWxvYWQ7XG59XG5cbmZ1bmN0aW9uIF9hdHRhY2godykge1xuICBpZiAod2luKSB7IHJldHVybjsgfVxuICB3aW4gPSB3IHx8IGdsb2JhbDtcblxuICBpZiAod2luLmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICB3aW4uYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIF9vbm1lc3NhZ2UsIGZhbHNlKTtcbiAgfSBlbHNlIGlmICh3aW4uYXR0YWNoRXZlbnQpIHtcbiAgICB3aW4uYXR0YWNoRXZlbnQoJ29ubWVzc2FnZScsIF9vbm1lc3NhZ2UpO1xuICB9IGVsc2UgaWYgKHdpbi5vbm1lc3NhZ2UgPT09IG51bGwpIHtcbiAgICB3aW4ub25tZXNzYWdlID0gX29ubWVzc2FnZTtcbiAgfSBlbHNlIHtcbiAgICB3aW4gPSBudWxsO1xuICB9XG59XG5cbi8vIHJlbW92ZUlmKHByb2R1Y3Rpb24pXG5mdW5jdGlvbiBfZGV0YWNoKCkge1xuICBpZiAod2luID09IG51bGwpIHsgcmV0dXJuOyB9XG5cbiAgaWYgKHdpbi5yZW1vdmVFdmVudExpc3RlbmVyKSB7XG4gICAgd2luLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBfb25tZXNzYWdlLCBmYWxzZSk7XG4gIH0gZWxzZSBpZiAod2luLmRldGFjaEV2ZW50KSB7XG4gICAgd2luLmRldGFjaEV2ZW50KCdvbm1lc3NhZ2UnLCBfb25tZXNzYWdlKTtcbiAgfSBlbHNlIGlmICh3aW4ub25tZXNzYWdlID09PSBfb25tZXNzYWdlKSB7XG4gICAgd2luLm9ubWVzc2FnZSA9IG51bGw7XG4gIH1cblxuICB3aW4gPSBudWxsO1xuICBwb3B1cHMgPSBbXTtcbiAgc3Vic2NyaWJlcnMgPSB7fTtcbn1cbi8vIGVuZFJlbW92ZUlmKHByb2R1Y3Rpb24pXG5cbmZ1bmN0aW9uIF91dWlkKCkge1xuICByZXR1cm4gJ3h4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eCcucmVwbGFjZSgvW3h5XS9nLCBmdW5jdGlvbiAoYykge1xuICAgIHZhciByID0gTWF0aC5yYW5kb20oKSAqIDE2IHwgMDtcbiAgICB2YXIgdiA9IGMgPT09ICd4JyA/IHIgOiByICYgMHgzIHwgMHg4O1xuXG4gICAgcmV0dXJuIHYudG9TdHJpbmcoMTYpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gX29ubWVzc2FnZShlKSB7XG4gIHZhciBwYXlsb2FkO1xuXG4gIGlmIChfaXNudFN0cmluZyhlLmRhdGEpKSB7IHJldHVybjsgfVxuXG4gIHBheWxvYWQgPSBfdW5wYWNrUGF5bG9hZChlKTtcbiAgaWYgKCFwYXlsb2FkKSB7IHJldHVybjsgfVxuXG4gIF9kaXNwYXRjaCgnKicsIHBheWxvYWQuZXZlbnQsIHBheWxvYWQuYXJncywgZSk7XG4gIF9kaXNwYXRjaChlLm9yaWdpbiwgcGF5bG9hZC5ldmVudCwgcGF5bG9hZC5hcmdzLCBlKTtcbiAgX2Jyb2FkY2FzdFBvcHVwcyhlLmRhdGEsIHBheWxvYWQub3JpZ2luLCBlLnNvdXJjZSk7XG59XG5cbmZ1bmN0aW9uIF9kaXNwYXRjaChvcmlnaW4sIGV2ZW50LCBhcmdzLCBlKSB7XG4gIHZhciBpO1xuXG4gIGlmICghc3Vic2NyaWJlcnNbb3JpZ2luXSkgeyByZXR1cm47IH1cbiAgaWYgKCFzdWJzY3JpYmVyc1tvcmlnaW5dW2V2ZW50XSkgeyByZXR1cm47IH1cblxuICBmb3IgKGkgPSAwOyBpIDwgc3Vic2NyaWJlcnNbb3JpZ2luXVtldmVudF0ubGVuZ3RoOyBpKyspIHtcbiAgICBzdWJzY3JpYmVyc1tvcmlnaW5dW2V2ZW50XVtpXS5hcHBseShlLCBhcmdzKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfaGFzT3BlbmVyKGZyYW1lKSB7XG4gIGlmIChmcmFtZS50b3AgIT09IGZyYW1lKSB7IHJldHVybiBmYWxzZTsgfVxuICBpZiAoZnJhbWUub3BlbmVyID09IG51bGwpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIGlmIChmcmFtZS5vcGVuZXIgPT09IGZyYW1lKSB7IHJldHVybiBmYWxzZTsgfVxuICBpZiAoZnJhbWUub3BlbmVyLmNsb3NlZCA9PT0gdHJ1ZSkgeyByZXR1cm4gZmFsc2U7IH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gX2Jyb2FkY2FzdChmcmFtZSwgcGF5bG9hZCwgb3JpZ2luKSB7XG4gIHZhciBpID0gMDtcbiAgdmFyIGZyYW1lVG9Ccm9hZGNhc3RUbztcblxuICB0cnkge1xuICAgIGZyYW1lLnBvc3RNZXNzYWdlKHBheWxvYWQsIG9yaWdpbik7XG5cbiAgICBpZiAoX2hhc09wZW5lcihmcmFtZSkpIHtcbiAgICAgIF9icm9hZGNhc3QoZnJhbWUub3BlbmVyLnRvcCwgcGF5bG9hZCwgb3JpZ2luKTtcbiAgICB9XG5cbiAgICAvLyBwcmV2aW91c2x5LCBvdXIgbWF4IHZhbHVlIHdhcyBmcmFtZS5mcmFtZXMubGVuZ3RoXG4gICAgLy8gYnV0IGZyYW1lcy5sZW5ndGggaW5oZXJpdHMgZnJvbSB3aW5kb3cubGVuZ3RoXG4gICAgLy8gd2hpY2ggY2FuIGJlIG92ZXJ3cml0dGVuIGlmIGEgZGV2ZWxvcGVyIGRvZXNcbiAgICAvLyBgdmFyIGxlbmd0aCA9IHZhbHVlO2Agb3V0c2lkZSBvZiBhIGZ1bmN0aW9uXG4gICAgLy8gc2NvcGUsIGl0J2xsIHByZXZlbnQgdXMgZnJvbSBsb29waW5nIHRocm91Z2hcbiAgICAvLyBhbGwgdGhlIGZyYW1lcy4gV2l0aCB0aGlzLCB3ZSBsb29wIHRocm91Z2hcbiAgICAvLyB1bnRpbCB0aGVyZSBhcmUgbm8gbG9uZ2VyIGFueSBmcmFtZXNcbiAgICB3aGlsZSAoZnJhbWVUb0Jyb2FkY2FzdFRvID0gZnJhbWUuZnJhbWVzW2ldKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uZC1hc3NpZ25cbiAgICAgIF9icm9hZGNhc3QoZnJhbWVUb0Jyb2FkY2FzdFRvLCBwYXlsb2FkLCBvcmlnaW4pO1xuICAgICAgaSsrO1xuICAgIH1cbiAgfSBjYXRjaCAoXykgeyAvKiBpZ25vcmVkICovIH1cbn1cblxuZnVuY3Rpb24gX2Jyb2FkY2FzdFBvcHVwcyhwYXlsb2FkLCBvcmlnaW4sIHNvdXJjZSkge1xuICB2YXIgaSwgcG9wdXA7XG5cbiAgZm9yIChpID0gcG9wdXBzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgcG9wdXAgPSBwb3B1cHNbaV07XG5cbiAgICBpZiAocG9wdXAuY2xvc2VkID09PSB0cnVlKSB7XG4gICAgICBwb3B1cHMgPSBwb3B1cHMuc2xpY2UoaSwgMSk7XG4gICAgfSBlbHNlIGlmIChzb3VyY2UgIT09IHBvcHVwKSB7XG4gICAgICBfYnJvYWRjYXN0KHBvcHVwLnRvcCwgcGF5bG9hZCwgb3JpZ2luKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gX3N1YnNjcmliZVJlcGxpZXIoZm4sIG9yaWdpbikge1xuICB2YXIgdXVpZCA9IF91dWlkKCk7XG5cbiAgZnVuY3Rpb24gcmVwbGllcihkLCBvKSB7XG4gICAgZm4oZCwgbyk7XG4gICAgZnJhbWVidXMudGFyZ2V0KG9yaWdpbikudW5zdWJzY3JpYmUodXVpZCwgcmVwbGllcik7XG4gIH1cblxuICBmcmFtZWJ1cy50YXJnZXQob3JpZ2luKS5zdWJzY3JpYmUodXVpZCwgcmVwbGllcik7XG4gIHJldHVybiB1dWlkO1xufVxuXG5mdW5jdGlvbiBfc3Vic2NyaXB0aW9uQXJnc0ludmFsaWQoZXZlbnQsIGZuLCBvcmlnaW4pIHtcbiAgaWYgKF9pc250U3RyaW5nKGV2ZW50KSkgeyByZXR1cm4gdHJ1ZTsgfVxuICBpZiAodHlwZW9mIGZuICE9PSAnZnVuY3Rpb24nKSB7IHJldHVybiB0cnVlOyB9XG4gIGlmIChfaXNudFN0cmluZyhvcmlnaW4pKSB7IHJldHVybiB0cnVlOyB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5fYXR0YWNoKCk7XG5cbmZyYW1lYnVzID0ge1xuICB0YXJnZXQ6IHRhcmdldCxcbiAgLy8gcmVtb3ZlSWYocHJvZHVjdGlvbilcbiAgX3BhY2thZ2VQYXlsb2FkOiBfcGFja2FnZVBheWxvYWQsXG4gIF91bnBhY2tQYXlsb2FkOiBfdW5wYWNrUGF5bG9hZCxcbiAgX2F0dGFjaDogX2F0dGFjaCxcbiAgX2RldGFjaDogX2RldGFjaCxcbiAgX2Rpc3BhdGNoOiBfZGlzcGF0Y2gsXG4gIF9icm9hZGNhc3Q6IF9icm9hZGNhc3QsXG4gIF9zdWJzY3JpYmVSZXBsaWVyOiBfc3Vic2NyaWJlUmVwbGllcixcbiAgX3N1YnNjcmlwdGlvbkFyZ3NJbnZhbGlkOiBfc3Vic2NyaXB0aW9uQXJnc0ludmFsaWQsXG4gIF9vbm1lc3NhZ2U6IF9vbm1lc3NhZ2UsXG4gIF91dWlkOiBfdXVpZCxcbiAgX2dldFN1YnNjcmliZXJzOiBmdW5jdGlvbiAoKSB7IHJldHVybiBzdWJzY3JpYmVyczsgfSxcbiAgX3dpbjogZnVuY3Rpb24gKCkgeyByZXR1cm4gd2luOyB9LFxuICAvLyBlbmRSZW1vdmVJZihwcm9kdWN0aW9uKVxuICBpbmNsdWRlOiBpbmNsdWRlLFxuICBwdWJsaXNoOiBwdWJsaXNoLFxuICBwdWI6IHB1Ymxpc2gsXG4gIHRyaWdnZXI6IHB1Ymxpc2gsXG4gIGVtaXQ6IHB1Ymxpc2gsXG4gIHN1YnNjcmliZTogc3Vic2NyaWJlLFxuICBzdWI6IHN1YnNjcmliZSxcbiAgb246IHN1YnNjcmliZSxcbiAgdW5zdWJzY3JpYmU6IHVuc3Vic2NyaWJlLFxuICB1bnN1YjogdW5zdWJzY3JpYmUsXG4gIG9mZjogdW5zdWJzY3JpYmVcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnJhbWVidXM7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuaW5qZWN0V2l0aEJsb2NrbGlzdCA9IGV4cG9ydHMuaW5qZWN0V2l0aEFsbG93bGlzdCA9IHZvaWQgMDtcbnZhciBpbmplY3Rfc3R5bGVzaGVldF8xID0gcmVxdWlyZShcIi4vbGliL2luamVjdC1zdHlsZXNoZWV0XCIpO1xuZnVuY3Rpb24gaW5qZWN0V2l0aEFsbG93bGlzdChzdHlsZXMsIGxpc3QpIHtcbiAgICByZXR1cm4gaW5qZWN0X3N0eWxlc2hlZXRfMS5pbmplY3RTdHlsZXNoZWV0KHN0eWxlcywgbGlzdCwgdHJ1ZSk7XG59XG5leHBvcnRzLmluamVjdFdpdGhBbGxvd2xpc3QgPSBpbmplY3RXaXRoQWxsb3dsaXN0O1xuZnVuY3Rpb24gaW5qZWN0V2l0aEJsb2NrbGlzdChzdHlsZXMsIGxpc3QpIHtcbiAgICByZXR1cm4gaW5qZWN0X3N0eWxlc2hlZXRfMS5pbmplY3RTdHlsZXNoZWV0KHN0eWxlcywgbGlzdCwgZmFsc2UpO1xufVxuZXhwb3J0cy5pbmplY3RXaXRoQmxvY2tsaXN0ID0gaW5qZWN0V2l0aEJsb2NrbGlzdDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5maWx0ZXJTdHlsZUtleXMgPSB2b2lkIDA7XG5mdW5jdGlvbiBmaWx0ZXJTdHlsZUtleXMoc3R5bGVPYmplY3QsIHByb3BlcnR5TGlzdCwgaXNBbGxvd2xpc3QpIHtcbiAgICBpZiAocHJvcGVydHlMaXN0ID09PSB2b2lkIDApIHsgcHJvcGVydHlMaXN0ID0gW107IH1cbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgZnVuY3Rpb24gYWxsb3dsaXN0RmlsdGVyKGtleSkge1xuICAgICAgICBpZiAocHJvcGVydHlMaXN0LmluZGV4T2Yoa2V5KSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHJlc3VsdFtrZXldID0gc3R5bGVPYmplY3Rba2V5XTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBibG9ja2xpc3RGaWx0ZXIoa2V5KSB7XG4gICAgICAgIGlmIChwcm9wZXJ0eUxpc3QuaW5kZXhPZihrZXkpID09PSAtMSkge1xuICAgICAgICAgICAgcmVzdWx0W2tleV0gPSBzdHlsZU9iamVjdFtrZXldO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChpc0FsbG93bGlzdCkge1xuICAgICAgICBPYmplY3Qua2V5cyhzdHlsZU9iamVjdCkuZm9yRWFjaChhbGxvd2xpc3RGaWx0ZXIpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgT2JqZWN0LmtleXMoc3R5bGVPYmplY3QpLmZvckVhY2goYmxvY2tsaXN0RmlsdGVyKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbmV4cG9ydHMuZmlsdGVyU3R5bGVLZXlzID0gZmlsdGVyU3R5bGVLZXlzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmZpbHRlclN0eWxlVmFsdWVzID0gdm9pZCAwO1xudmFyIHZhbHVlRmlsdGVycyA9IFsvOy8sIC9AaW1wb3J0L2ksIC9leHByZXNzaW9uL2ksIC91cmwvaSwgL2phdmFzY3JpcHQvaV07XG5mdW5jdGlvbiBodG1sRXNjYXBlKGh0bWwpIHtcbiAgICByZXR1cm4gU3RyaW5nKGh0bWwpXG4gICAgICAgIC5yZXBsYWNlKC8mL2csIFwiJmFtcDtcIilcbiAgICAgICAgLnJlcGxhY2UoLzwvZywgXCImbHQ7XCIpXG4gICAgICAgIC5yZXBsYWNlKC8+L2csIFwiJmd0O1wiKTtcbn1cbmZ1bmN0aW9uIGZpbHRlclN0eWxlVmFsdWVzKGRpcnR5KSB7XG4gICAgaWYgKGRpcnR5ID09PSB2b2lkIDApIHsgZGlydHkgPSB7fTsgfVxuICAgIHZhciBjbGVhbiA9IHt9O1xuICAgIE9iamVjdC5rZXlzKGRpcnR5KS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gZGlydHlba2V5XTtcbiAgICAgICAgdmFyIHVuc2FuaXRhcnkgPSB2YWx1ZUZpbHRlcnMuc29tZShmdW5jdGlvbiAocmVnZXgpIHsgcmV0dXJuIHJlZ2V4LnRlc3QoU3RyaW5nKHZhbHVlKSk7IH0pO1xuICAgICAgICBpZiAodW5zYW5pdGFyeSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgY2xlYW5ba2V5XSA9IGh0bWxFc2NhcGUoZGlydHlba2V5XSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGNsZWFuO1xufVxuZXhwb3J0cy5maWx0ZXJTdHlsZVZhbHVlcyA9IGZpbHRlclN0eWxlVmFsdWVzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmluamVjdFN0eWxlc2hlZXQgPSB2b2lkIDA7XG52YXIgdmFsaWRhdGVfc2VsZWN0b3JfMSA9IHJlcXVpcmUoXCIuL3ZhbGlkYXRlLXNlbGVjdG9yXCIpO1xudmFyIGZpbHRlcl9zdHlsZV9rZXlzXzEgPSByZXF1aXJlKFwiLi9maWx0ZXItc3R5bGUta2V5c1wiKTtcbnZhciBmaWx0ZXJfc3R5bGVfdmFsdWVzXzEgPSByZXF1aXJlKFwiLi9maWx0ZXItc3R5bGUtdmFsdWVzXCIpO1xuZnVuY3Rpb24gaXNTZWxlY3Rvck1lZGlhUXVlcnkoc2VsZWN0b3IpIHtcbiAgICByZXR1cm4gL15AbWVkaWFcXHMrL2kudGVzdChzZWxlY3Rvcik7XG59XG5mdW5jdGlvbiBidWlsZFJ1bGUoc2VsZWN0b3IsIHN0eWxlcywgY3VycmllZEtleXNGaWx0ZXIpIHtcbiAgICBpZiAoc3R5bGVzID09PSB2b2lkIDApIHsgc3R5bGVzID0ge307IH1cbiAgICB2YXIgcmVzdWx0O1xuICAgIHZhciBjb25zdHJ1Y3RlZFJ1bGUgPSBzZWxlY3RvciArIFwie1wiO1xuICAgIGlmIChpc1NlbGVjdG9yTWVkaWFRdWVyeShzZWxlY3RvcikpIHtcbiAgICAgICAgT2JqZWN0LmtleXMoc3R5bGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChpbm5lclNlbGVjdG9yKSB7XG4gICAgICAgICAgICBpZiAoIXZhbGlkYXRlX3NlbGVjdG9yXzEudmFsaWRhdGVTZWxlY3Rvcihpbm5lclNlbGVjdG9yKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0cnVjdGVkUnVsZSArPSBidWlsZFJ1bGUoaW5uZXJTZWxlY3Rvciwgc3R5bGVzW2lubmVyU2VsZWN0b3JdLCBjdXJyaWVkS2V5c0ZpbHRlcik7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmVzdWx0ID0gY3VycmllZEtleXNGaWx0ZXIoc3R5bGVzKTtcbiAgICAgICAgdmFyIHNhbml0aXplZF8xID0gZmlsdGVyX3N0eWxlX3ZhbHVlc18xLmZpbHRlclN0eWxlVmFsdWVzKHJlc3VsdCk7XG4gICAgICAgIE9iamVjdC5rZXlzKHNhbml0aXplZF8xKS5mb3JFYWNoKGZ1bmN0aW9uIChydWxlKSB7XG4gICAgICAgICAgICBjb25zdHJ1Y3RlZFJ1bGUgKz0gcnVsZSArIFwiOlwiICsgc2FuaXRpemVkXzFbcnVsZV0gKyBcIjtcIjtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGNvbnN0cnVjdGVkUnVsZSArPSBcIn1cIjtcbiAgICByZXR1cm4gY29uc3RydWN0ZWRSdWxlO1xufVxuZnVuY3Rpb24gaW5qZWN0U3R5bGVzaGVldChzdHlsZXMsIHByb3BlcnR5TGlzdCwgaXNBbGxvd2xpc3QpIHtcbiAgICBpZiAoc3R5bGVzID09PSB2b2lkIDApIHsgc3R5bGVzID0ge307IH1cbiAgICBpZiAocHJvcGVydHlMaXN0ID09PSB2b2lkIDApIHsgcHJvcGVydHlMaXN0ID0gW107IH1cbiAgICB2YXIgcG9zaXRpb24gPSAwO1xuICAgIHZhciBzdHlsZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImhlYWRcIikuYXBwZW5kQ2hpbGQoc3R5bGVFbGVtZW50KTtcbiAgICB2YXIgc3R5bGVzaGVldCA9IHN0eWxlRWxlbWVudC5zaGVldDtcbiAgICBmdW5jdGlvbiBjdXJyaWVkS2V5c0ZpbHRlcihzdHlsZU9iamVjdCkge1xuICAgICAgICByZXR1cm4gZmlsdGVyX3N0eWxlX2tleXNfMS5maWx0ZXJTdHlsZUtleXMoc3R5bGVPYmplY3QsIHByb3BlcnR5TGlzdCwgaXNBbGxvd2xpc3QpO1xuICAgIH1cbiAgICBPYmplY3Qua2V5cyhzdHlsZXMpLmZvckVhY2goZnVuY3Rpb24gKHNlbGVjdG9yKSB7XG4gICAgICAgIGlmICghdmFsaWRhdGVfc2VsZWN0b3JfMS52YWxpZGF0ZVNlbGVjdG9yKHNlbGVjdG9yKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBjb25zdHJ1Y3RlZFJ1bGUgPSBidWlsZFJ1bGUoc2VsZWN0b3IsIHN0eWxlc1tzZWxlY3Rvcl0sIGN1cnJpZWRLZXlzRmlsdGVyKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmIChzdHlsZXNoZWV0Lmluc2VydFJ1bGUpIHtcbiAgICAgICAgICAgICAgICBzdHlsZXNoZWV0Lmluc2VydFJ1bGUoY29uc3RydWN0ZWRSdWxlLCBwb3NpdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdHlsZXNoZWV0LmFkZFJ1bGUoc2VsZWN0b3IsIGNvbnN0cnVjdGVkUnVsZS5yZXBsYWNlKC9eW157XSsvLCBcIlwiKS5yZXBsYWNlKC9be31dL2csIFwiXCIpLCBwb3NpdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwb3NpdGlvbisrO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGlmICghKGVyciBpbnN0YW5jZW9mIFN5bnRheEVycm9yIHx8IGVyciBpbnN0YW5jZW9mIERPTUV4Y2VwdGlvbikpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gc3R5bGVFbGVtZW50O1xufVxuZXhwb3J0cy5pbmplY3RTdHlsZXNoZWV0ID0gaW5qZWN0U3R5bGVzaGVldDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy52YWxpZGF0ZVNlbGVjdG9yID0gdm9pZCAwO1xuZnVuY3Rpb24gdmFsaWRhdGVTZWxlY3RvcihzZWxlY3Rvcikge1xuICAgIGlmIChzZWxlY3Rvci50cmltKCkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKC9zdXBwb3J0cy9pLnRlc3Qoc2VsZWN0b3IpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKC9pbXBvcnQvaS50ZXN0KHNlbGVjdG9yKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICgvW3t9XS8udGVzdChzZWxlY3RvcikpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gIS88Ly50ZXN0KHNlbGVjdG9yKTtcbn1cbmV4cG9ydHMudmFsaWRhdGVTZWxlY3RvciA9IHZhbGlkYXRlU2VsZWN0b3I7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciByZXF1ZXN0ID0gcmVxdWlyZSgnLi9yZXF1ZXN0Jyk7XG52YXIgaXNXaGl0ZWxpc3RlZERvbWFpbiA9IHJlcXVpcmUoJy4uL2xpYi9pcy13aGl0ZWxpc3RlZC1kb21haW4nKTtcbnZhciBTZWFtbGVzc3BheUVycm9yID0gcmVxdWlyZSgnLi4vbGliL3NlYW1sZXNzcGF5LWVycm9yJyk7XG52YXIgY29udmVydFRvU2VhbWxlc3NwYXlFcnJvciA9IHJlcXVpcmUoJy4uL2xpYi9jb252ZXJ0LXRvLXNlYW1sZXNzcGF5LWVycm9yJyk7XG52YXIgYWRkTWV0YWRhdGEgPSByZXF1aXJlKCcuLi9saWIvYWRkLW1ldGFkYXRhJyk7XG52YXIgUHJvbWlzZSA9IHJlcXVpcmUoJy4uL2xpYi9wcm9taXNlJyk7XG52YXIgYXNzaWduID0gcmVxdWlyZSgnLi4vbGliL2Fzc2lnbicpLmFzc2lnbjtcbnZhciBjb25zdGFudHMgPSByZXF1aXJlKCcuL2NvbnN0YW50cycpO1xudmFyIGVycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzJyk7XG52YXIgc2hhcmVkRXJyb3JzID0gcmVxdWlyZSgnLi4vbGliL2Vycm9ycycpO1xudmFyIFZFUlNJT04gPSByZXF1aXJlKCcuLi9saWIvY29uc3RhbnRzJykuVkVSU0lPTjtcblxuLyoqXG4gKiBUaGlzIG9iamVjdCBpcyByZXR1cm5lZCBieSB7QGxpbmsgQ2xpZW50I2dldENvbmZpZ3VyYXRpb258Z2V0Q29uZmlndXJhdGlvbn0uIFRoaXMgaW5mb3JtYXRpb24gaXMgdXNlZCBleHRlbnNpdmVseSBieSBvdGhlciBTZWFtbGVzc3BheSBtb2R1bGVzIHRvIHByb3Blcmx5IGNvbmZpZ3VyZSB0aGVtc2VsdmVzLlxuICogQHR5cGVkZWYge29iamVjdH0gQ2xpZW50fmNvbmZpZ3VyYXRpb25cbiAqIEBwcm9wZXJ0eSB7b2JqZWN0fSBjbGllbnQgVGhlIHNlYW1sZXNzcGF5LXdlYi9jbGllbnQgcGFyYW1ldGVycy5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBjbGllbnQuYXV0aG9yaXphdGlvbiBBIHRva2VuaXphdGlvbktleSBvciBjbGllbnRUb2tlbi5cbiAqIEBwcm9wZXJ0eSB7b2JqZWN0fSBnYXRld2F5Q29uZmlndXJhdGlvbiBHYXRld2F5LXN1cHBsaWVkIGNvbmZpZ3VyYXRpb24uXG4gKiBAcHJvcGVydHkge29iamVjdH0gYW5hbHl0aWNzTWV0YWRhdGEgQW5hbHl0aWNzLXNwZWNpZmljIGRhdGEuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gYW5hbHl0aWNzTWV0YWRhdGEuc2Vzc2lvbklkIFVuaXF1ZWx5IGlkZW50aWZpZXMgYSBicm93c2luZyBzZXNzaW9uLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IGFuYWx5dGljc01ldGFkYXRhLnNka1ZlcnNpb24gVGhlIHNlYW1sZXNzcGF5LmpzIHZlcnNpb24uXG4gKiBAcHJvcGVydHkge3N0cmluZ30gYW5hbHl0aWNzTWV0YWRhdGEubWVyY2hhbnRBcHBJZCBJZGVudGlmaWVzIHRoZSBtZXJjaGFudCdzIHdlYiBhcHAuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gcHJveHlBY2NvdW50SWQgSWRlbnRpZmllcyB0aGUgU3ViIE1lcmNoYW50IEFjY291bnQgSUQuXG4gKi9cblxuLyoqXG4gKiBAY2xhc3NcbiAqIEBwYXJhbSB7Q2xpZW50fmNvbmZpZ3VyYXRpb259IGNvbmZpZ3VyYXRpb24gT3B0aW9uc1xuICogQGRlc2NyaXB0aW9uIDxzdHJvbmc+RG8gbm90IHVzZSB0aGlzIGNvbnN0cnVjdG9yIGRpcmVjdGx5LiBVc2Uge0BsaW5rIG1vZHVsZTpzZWFtbGVzc3BheS13ZWIvY2xpZW50LmNyZWF0ZXxzZWFtbGVzc3BheS5jbGllbnQuY3JlYXRlfSBpbnN0ZWFkLjwvc3Ryb25nPlxuICogQGNsYXNzZGVzYyBUaGlzIGNsYXNzIGlzIHJlcXVpcmVkIGJ5IG1hbnkgb3RoZXIgU2VhbWxlc3NwYXkgY29tcG9uZW50cy4gSXQgc2VydmVzIGFzIHRoZSBiYXNlIEFQSSBsYXllciB0aGF0IGNvbW11bmljYXRlcyB3aXRoIG91ciBzZXJ2ZXJzLiBJdCBpcyBhbHNvIGNhcGFibGUgb2YgYmVpbmcgdXNlZCB0byBmb3JtdWxhdGUgZGlyZWN0IGNhbGxzIHRvIG91ciBzZXJ2ZXJzLCBzdWNoIGFzIGRpcmVjdCBjcmVkaXQgY2FyZCB0b2tlbml6YXRpb24uIFNlZSB7QGxpbmsgQ2xpZW50I3JlcXVlc3R9LlxuICovXG5mdW5jdGlvbiBDbGllbnQoY29uZmlndXJhdGlvbikge1xuICB2YXJcbiAgICBjb25maWd1cmF0aW9uSlNPTixcbiAgICBnYXRld2F5Q29uZmlndXJhdGlvbixcbiAgICBzZWFtbGVzc3BheUFwaUNvbmZpZ3VyYXRpb247XG5cbiAgY29uZmlndXJhdGlvbiA9IGNvbmZpZ3VyYXRpb24gfHwge307XG5cbiAgY29uZmlndXJhdGlvbkpTT04gPSBKU09OLnN0cmluZ2lmeShjb25maWd1cmF0aW9uKTtcbiAgZ2F0ZXdheUNvbmZpZ3VyYXRpb24gPSBjb25maWd1cmF0aW9uLmdhdGV3YXlDb25maWd1cmF0aW9uO1xuXG4gIGlmICghZ2F0ZXdheUNvbmZpZ3VyYXRpb24pIHtcbiAgICB0aHJvdyBuZXcgU2VhbWxlc3NwYXlFcnJvcihlcnJvcnMuQ0xJRU5UX01JU1NJTkdfR0FURVdBWV9DT05GSUdVUkFUSU9OKTtcbiAgfVxuICBbXG4gICAgJ2Fzc2V0c1VybCcsXG4gICAgJ2NsaWVudEFwaVVybCcsXG4gICAgJ3Rva2VuaXplckFwaSdcbiAgXS5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wZXJ0eSkge1xuICAgIHZhciBjb25maWdVcmwgPSAoZ2F0ZXdheUNvbmZpZ3VyYXRpb25bcHJvcGVydHldICYmIGdhdGV3YXlDb25maWd1cmF0aW9uW3Byb3BlcnR5XS51cmwpIHx8IGdhdGV3YXlDb25maWd1cmF0aW9uW3Byb3BlcnR5XTtcbiAgICBpZiAocHJvcGVydHkgaW4gZ2F0ZXdheUNvbmZpZ3VyYXRpb24gJiYgIWlzV2hpdGVsaXN0ZWREb21haW4oY29uZmlnVXJsKSkge1xuICAgICAgdGhyb3cgbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgICB0eXBlOiBlcnJvcnMuQ0xJRU5UX0dBVEVXQVlfQ09ORklHVVJBVElPTl9JTlZBTElEX0RPTUFJTi50eXBlLFxuICAgICAgICBjb2RlOiBlcnJvcnMuQ0xJRU5UX0dBVEVXQVlfQ09ORklHVVJBVElPTl9JTlZBTElEX0RPTUFJTi5jb2RlLFxuICAgICAgICBtZXNzYWdlOiBwcm9wZXJ0eSArICcgcHJvcGVydHkgaXMgb24gYW4gaW52YWxpZCBkb21haW4uICgnICsgY29uZmlnVXJsICsgJyknXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgY29weSBvZiB0aGUgY29uZmlndXJhdGlvbiB2YWx1ZXMuXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge0NsaWVudH5jb25maWd1cmF0aW9ufSBjb25maWd1cmF0aW9uXG4gICAqL1xuICB0aGlzLmdldENvbmZpZ3VyYXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UoY29uZmlndXJhdGlvbkpTT04pO1xuICB9O1xuXG4gIHRoaXMuX3JlcXVlc3QgPSByZXF1ZXN0O1xuXG4gIHRoaXMuX2NvbmZpZ3VyYXRpb24gPSB0aGlzLmdldENvbmZpZ3VyYXRpb24oKTtcblxuICB0aGlzLl9jbGllbnRBcGlCYXNlVXJsID0gZ2F0ZXdheUNvbmZpZ3VyYXRpb24uY2xpZW50QXBpVXJsICsgJy8nO1xuICB0aGlzLl90b2tlbml6ZXJBcGkgPSBnYXRld2F5Q29uZmlndXJhdGlvbi50b2tlbml6ZXJBcGk7XG5cbiAgc2VhbWxlc3NwYXlBcGlDb25maWd1cmF0aW9uID0gZ2F0ZXdheUNvbmZpZ3VyYXRpb24uc2VhbWxlc3NwYXlBcGk7XG4gIGlmIChzZWFtbGVzc3BheUFwaUNvbmZpZ3VyYXRpb24pIHtcbiAgICB0aGlzLl9zZWFtbGVzc3BheUFwaSA9IHtcbiAgICAgIGJhc2VVcmw6IHNlYW1sZXNzcGF5QXBpQ29uZmlndXJhdGlvbi51cmwgKyAnLycsXG4gICAgICBhY2Nlc3NUb2tlbjogc2VhbWxlc3NwYXlBcGlDb25maWd1cmF0aW9uLmFjY2Vzc1Rva2VuLFxuICAgICAgcHVibGlzaGFibGVUb2tlbjogc2VhbWxlc3NwYXlBcGlDb25maWd1cmF0aW9uLnB1Ymxpc2hhYmxlVG9rZW5cbiAgICB9O1xuICAgIGlmICghaXNXaGl0ZWxpc3RlZERvbWFpbih0aGlzLl9zZWFtbGVzc3BheUFwaS5iYXNlVXJsKSkge1xuICAgICAgdGhyb3cgbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgICB0eXBlOiBlcnJvcnMuQ0xJRU5UX0dBVEVXQVlfQ09ORklHVVJBVElPTl9JTlZBTElEX0RPTUFJTi50eXBlLFxuICAgICAgICBjb2RlOiBlcnJvcnMuQ0xJRU5UX0dBVEVXQVlfQ09ORklHVVJBVElPTl9JTlZBTElEX0RPTUFJTi5jb2RlLFxuICAgICAgICBtZXNzYWdlOiAnc2VhbWxlc3NwYXlBcGkgVVJMIGlzIG9uIGFuIGludmFsaWQgZG9tYWluLidcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFVzZWQgYnkgb3RoZXIgbW9kdWxlcyB0byBmb3JtdWxhdGUgYWxsIG5ldHdvcmsgcmVxdWVzdHMgdG8gdGhlIFNlYW1sZXNzcGF5IGdhdGV3YXkuIEl0IGlzIGFsc28gY2FwYWJsZSBvZiBiZWluZyB1c2VkIGRpcmVjdGx5IGZyb20geW91ciBvd24gZm9ybSB0byB0b2tlbml6ZSBjcmVkaXQgY2FyZCBpbmZvcm1hdGlvbi4gSG93ZXZlciwgYmUgc3VyZSB0byBzYXRpc2Z5IFBDSSBjb21wbGlhbmNlIGlmIHlvdSB1c2UgZGlyZWN0IGNhcmQgdG9rZW5pemF0aW9uLlxuICogQHB1YmxpY1xuICogQGZ1bmN0aW9uXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyBSZXF1ZXN0IG9wdGlvbnM6XG4gKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9ucy5tZXRob2QgSFRUUCBtZXRob2QsIGUuZy4gXCJnZXRcIiBvciBcInBvc3RcIi5cbiAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLmVuZHBvaW50IEVuZHBvaW50IHBhdGgsIGUuZy4gXCJwYXltZW50X21ldGhvZHNcIi5cbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zLmRhdGEgRGF0YSB0byBzZW5kIHdpdGggdGhlIHJlcXVlc3QuXG4gKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMudGltZW91dD02MDAwMF0gU2V0IGEgdGltZW91dCAoaW4gbWlsbGlzZWNvbmRzKSBmb3IgdGhlIHJlcXVlc3QuXG4gKiBAcGFyYW0ge2NhbGxiYWNrfSBbY2FsbGJhY2tdIFRoZSBzZWNvbmQgYXJndW1lbnQsIDxjb2RlPmRhdGE8L2NvZGU+LCBpcyB0aGUgcmV0dXJuZWQgc2VydmVyIGRhdGEuXG4gKiBAZXhhbXBsZVxuICogPGNhcHRpb24+RGlyZWN0IENyZWRpdCBDYXJkIFRva2VuaXphdGlvbjwvY2FwdGlvbj5cbiAqIHZhciBjcmVhdGVDbGllbnQgPSByZXF1aXJlKCdzZWFtbGVzc3BheS13ZWIvY2xpZW50JykuY3JlYXRlO1xuICpcbiAqIGNyZWF0ZUNsaWVudCh7XG4gKiAgIGVudmlyb25tZW50OiAnc2FuZGJveCdcbiAqICAgYXV0aG9yaXphdGlvbjogQ0xJRU5UX0FVVEhPUklaQVRJT05cbiAqIH0sIGZ1bmN0aW9uIChjcmVhdGVFcnIsIGNsaWVudEluc3RhbmNlKSB7XG4gKiAgIHZhciBmb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ215LWZvcm0taWQnKTtcbiAqICAgdmFyIGRhdGEgPSB7XG4gKiAgICAgY3JlZGl0Q2FyZDoge1xuICogICAgICAgbnVtYmVyOiBmb3JtWydjYy1udW1iZXInXS52YWx1ZSxcbiAqICAgICAgIGN2djogZm9ybVsnY2MtY3Z2J10udmFsdWUsXG4gKiAgICAgICBleHBEYXRlOiBmb3JtWydjYy1kYXRlJ10udmFsdWUsXG4gKiAgICAgICBiaWxsaW5nQWRkcmVzczoge1xuICogICAgICAgICBwb3N0YWxDb2RlOiBmb3JtWydjYy1wb3N0YWwnXS52YWx1ZVxuICogICAgICAgfSxcbiAqICAgICAgIG9wdGlvbnM6IHtcbiAqICAgICAgICAgdmFsaWRhdGU6IGZhbHNlXG4gKiAgICAgICB9XG4gKiAgICAgfVxuICogICB9O1xuICpcbiAqICAgLy8gV2FybmluZzogRm9yIGEgbWVyY2hhbnQgdG8gYmUgZWxpZ2libGUgZm9yIHRoZSBlYXNpZXN0IGxldmVsIG9mIFBDSSBjb21wbGlhbmNlIChTQVEgQSksXG4gKiAgIC8vIHBheW1lbnQgZmllbGRzIGNhbm5vdCBiZSBob3N0ZWQgb24geW91ciBjaGVja291dCBwYWdlLlxuICogICAvLyBGb3IgYW4gYWx0ZXJuYXRpdmUgdG8gdGhlIGZvbGxvd2luZywgdXNlIEhvc3RlZCBGaWVsZHMuXG4gKiAgIGNsaWVudEluc3RhbmNlLnJlcXVlc3Qoe1xuICogICAgIGVuZHBvaW50OiAncGF5bWVudF9tZXRob2RzL2NyZWRpdF9jYXJkcycsXG4gKiAgICAgbWV0aG9kOiAncG9zdCcsXG4gKiAgICAgZGF0YTogZGF0YVxuICogICB9LCBmdW5jdGlvbiAocmVxdWVzdEVyciwgcmVzcG9uc2UpIHtcbiAqICAgICAvLyBNb3JlIGRldGFpbGVkIGV4YW1wbGUgb2YgaGFuZGxpbmcgQVBJIGVycm9yczogaHR0cHM6Ly9jb2RlcGVuLmlvL3NlYW1sZXNzcGF5L3Blbi9NYndqZE1cbiAqICAgICBpZiAocmVxdWVzdEVycikgeyB0aHJvdyBuZXcgRXJyb3IocmVxdWVzdEVycik7IH1cbiAqXG4gKiAgICAgY29uc29sZS5sb2coJ0dvdCBub25jZTonLCByZXNwb25zZS5jcmVkaXRDYXJkc1swXS5ub25jZSk7XG4gKiAgIH0pO1xuICogfSk7XG4gKiBAcmV0dXJucyB7UHJvbWlzZXx2b2lkfSBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdpdGggdGhlIHJlcXVlc3QgcmVzcG9uc2UgaWYgbm8gY2FsbGJhY2sgaXMgcHJvdmlkZWQuXG4gKi9cbkNsaWVudC5wcm90b3R5cGUucmVxdWVzdCA9IGZ1bmN0aW9uIChvcHRpb25zLCBjYWxsYmFjaykge1xuICB2YXIgc2VsZiA9IHRoaXM7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8taW52YWxpZC10aGlzXG5cbiAgdmFyIHJlcXVlc3RQcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHZhciBvcHRpb25OYW1lLFxuICAgICAgYXBpLFxuICAgICAgcmVxdWVzdE9wdGlvbnMsXG4gICAgICBhcGlDb25maWcsXG4gICAgICBwcm94eUFjY291bnRJZCxcbiAgICAgIHB1Ymxpc2hhYmxlID0gb3B0aW9ucy5wdWJsaXNoYWJsZTtcblxuICAgIGlmICghb3B0aW9ucy5tZXRob2QpIHtcbiAgICAgIG9wdGlvbk5hbWUgPSAnb3B0aW9ucy5tZXRob2QnO1xuICAgIH0gZWxzZSBpZiAoIW9wdGlvbnMuZW5kcG9pbnQpIHtcbiAgICAgIG9wdGlvbk5hbWUgPSAnb3B0aW9ucy5lbmRwb2ludCc7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbk5hbWUpIHtcbiAgICAgIHRocm93IG5ldyBTZWFtbGVzc3BheUVycm9yKHtcbiAgICAgICAgdHlwZTogZXJyb3JzLkNMSUVOVF9PUFRJT05fUkVRVUlSRUQudHlwZSxcbiAgICAgICAgY29kZTogZXJyb3JzLkNMSUVOVF9PUFRJT05fUkVRVUlSRUQuY29kZSxcbiAgICAgICAgbWVzc2FnZTogb3B0aW9uTmFtZSArICcgaXMgcmVxdWlyZWQgd2hlbiBtYWtpbmcgYSByZXF1ZXN0LidcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICgnYXBpJyBpbiBvcHRpb25zKSB7XG4gICAgICBhcGkgPSBvcHRpb25zLmFwaTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpID0gJ2NsaWVudEFwaSc7XG4gICAgfVxuXG4gICAgcmVxdWVzdE9wdGlvbnMgPSB7XG4gICAgICBtZXRob2Q6IG9wdGlvbnMubWV0aG9kLFxuICAgICAgdGltZW91dDogb3B0aW9ucy50aW1lb3V0XG4gICAgfTtcblxuICAgIHZhciBjb21tb25IZWFkZXIgPSB7XG4gICAgICAnQVBJLVZlcnNpb24nOiBjb25zdGFudHMuU0VBTUxFU1NQQVlfQVBJX1ZFUlNJT05fSEVBREVSLFxuICAgICAgJ1NESy1WZXJzaW9uJzogVkVSU0lPTlxuICAgIH07XG5cbiAgICBwcm94eUFjY291bnRJZCA9IHNlbGYuZ2V0Q29uZmlndXJhdGlvbigpLmdhdGV3YXlDb25maWd1cmF0aW9uLnByb3h5QWNjb3VudElkO1xuXG4gICAgaWYgKGFwaSA9PT0gJ3Rva2VuaXplckFwaScpIHtcbiAgICAgIHJlcXVlc3RPcHRpb25zLnVybCA9IHNlbGYuX3Rva2VuaXplckFwaS51cmwgKyAnLycgKyBvcHRpb25zLmVuZHBvaW50O1xuICAgICAgcmVxdWVzdE9wdGlvbnMuZGF0YSA9IG9wdGlvbnMuZGF0YTtcbiAgICAgIHJlcXVlc3RPcHRpb25zLmhlYWRlcnMgPSB7XG4gICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgIEF1dGhvcml6YXRpb246ICdCZWFyZXIgJyArIHNlbGYuX3Rva2VuaXplckFwaS5hY2Nlc3NUb2tlblxuICAgICAgfTtcbiAgICAgIGlmIChwcm94eUFjY291bnRJZCkge1xuICAgICAgICByZXF1ZXN0T3B0aW9ucy5oZWFkZXJzWydTZWFtbGVzc1BheS1BY2NvdW50J10gPSBwcm94eUFjY291bnRJZDtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGFwaSA9PT0gJ3RyYW5zYWN0aW9uQXBpJykge1xuICAgICAgYXBpQ29uZmlnID0gc2VsZi5nZXRDb25maWd1cmF0aW9uKCkuZ2F0ZXdheUNvbmZpZ3VyYXRpb24udHJhbnNhY3Rpb25BcGk7XG4gICAgICByZXF1ZXN0T3B0aW9ucy51cmwgPSBhcGlDb25maWcuaXNTZWFtbGVzc3BheSA/IGFwaUNvbmZpZy51cmwgKyAnLycgKyBvcHRpb25zLmVuZHBvaW50IDogYXBpQ29uZmlnLnVybDtcbiAgICAgIHJlcXVlc3RPcHRpb25zLmRhdGEgPSBvcHRpb25zLmRhdGE7XG4gICAgICByZXF1ZXN0T3B0aW9ucy5oZWFkZXJzID0ge307XG4gICAgICBpZiAoYXBpQ29uZmlnLmFjY2Vzc1Rva2VuKSB7XG4gICAgICAgIHJlcXVlc3RPcHRpb25zLmhlYWRlcnNbJ0F1dGhvcml6YXRpb24nXSA9ICdCZWFyZXIgJyArIGFwaUNvbmZpZy5hY2Nlc3NUb2tlbjtcbiAgICAgIH1cbiAgICAgIGlmIChwcm94eUFjY291bnRJZCkge1xuICAgICAgICByZXF1ZXN0T3B0aW9ucy5oZWFkZXJzWydTZWFtbGVzc1BheS1BY2NvdW50J10gPSBwcm94eUFjY291bnRJZDtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGFwaSA9PT0gJ2NoZWNrb3V0QXBpJykge1xuICAgICAgYXBpQ29uZmlnID0gc2VsZi5nZXRDb25maWd1cmF0aW9uKCkuZ2F0ZXdheUNvbmZpZ3VyYXRpb24udHJhbnNhY3Rpb25BcGk7XG4gICAgICByZXF1ZXN0T3B0aW9ucy51cmwgPSBhcGlDb25maWcudXJsICsgJy8nICsgb3B0aW9ucy5lbmRwb2ludDtcbiAgICAgIHJlcXVlc3RPcHRpb25zLmRhdGEgPSBvcHRpb25zLmRhdGE7XG4gICAgICByZXF1ZXN0T3B0aW9ucy5oZWFkZXJzID0ge307XG4gICAgICBpZiAoYXBpQ29uZmlnLmFjY2Vzc1Rva2VuKSB7XG4gICAgICAgIHJlcXVlc3RPcHRpb25zLmhlYWRlcnNbJ0F1dGhvcml6YXRpb24nXSA9ICdCZWFyZXIgJyArIGFwaUNvbmZpZy5hY2Nlc3NUb2tlbjtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGFwaSA9PT0gJ2NsaWVudEFwaScpIHtcbiAgICAgIHJlcXVlc3RPcHRpb25zLnVybCA9IHNlbGYuX2NsaWVudEFwaUJhc2VVcmwgKyBvcHRpb25zLmVuZHBvaW50O1xuICAgICAgcmVxdWVzdE9wdGlvbnMuZGF0YSA9IGFkZE1ldGFkYXRhKHNlbGYuX2NvbmZpZ3VyYXRpb24sIG9wdGlvbnMuZGF0YSk7XG4gICAgfSBlbHNlIGlmIChhcGkgPT09ICdzZWFtbGVzc3BheUFwaScpIHtcbiAgICAgIGlmICghc2VsZi5fc2VhbWxlc3NwYXlBcGkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFNlYW1sZXNzcGF5RXJyb3Ioc2hhcmVkRXJyb3JzLlNFQU1MRVNTUEFZX0FQSV9BQ0NFU1NfUkVTVFJJQ1RFRCk7XG4gICAgICB9XG4gICAgICByZXF1ZXN0T3B0aW9ucy51cmwgPSBzZWxmLl9zZWFtbGVzc3BheUFwaS5iYXNlVXJsICsgb3B0aW9ucy5lbmRwb2ludDtcbiAgICAgIHJlcXVlc3RPcHRpb25zLmRhdGEgPSBvcHRpb25zLmRhdGE7XG4gICAgICByZXF1ZXN0T3B0aW9ucy5oZWFkZXJzID0ge1xuICAgICAgICBBdXRob3JpemF0aW9uOiAnQmVhcmVyICcgKyAocHVibGlzaGFibGUgPyBzZWxmLl9zZWFtbGVzc3BheUFwaS5wdWJsaXNoYWJsZVRva2VuIDogc2VsZi5fc2VhbWxlc3NwYXlBcGkuYWNjZXNzVG9rZW4pXG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAoYXBpID09PSAnZGlnaXRhbFdhbGxldEFwaScpIHtcbiAgICAgIGlmICghc2VsZi5fc2VhbWxlc3NwYXlBcGkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFNlYW1sZXNzcGF5RXJyb3Ioc2hhcmVkRXJyb3JzLlNFQU1MRVNTUEFZX0FQSV9BQ0NFU1NfUkVTVFJJQ1RFRCk7XG4gICAgICB9XG4gICAgICByZXF1ZXN0T3B0aW9ucy51cmwgPSBzZWxmLl9zZWFtbGVzc3BheUFwaS5iYXNlVXJsICsgb3B0aW9ucy5lbmRwb2ludDtcbiAgICAgIHJlcXVlc3RPcHRpb25zLmRhdGEgPSBvcHRpb25zLmRhdGE7XG4gICAgICByZXF1ZXN0T3B0aW9ucy5oZWFkZXJzID0ge1xuICAgICAgICBBdXRob3JpemF0aW9uOiAnQmVhcmVyICcgKyBvcHRpb25zLmRhdGEudG9rZW5cbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBTZWFtbGVzc3BheUVycm9yKHtcbiAgICAgICAgdHlwZTogZXJyb3JzLkNMSUVOVF9PUFRJT05fSU5WQUxJRC50eXBlLFxuICAgICAgICBjb2RlOiBlcnJvcnMuQ0xJRU5UX09QVElPTl9JTlZBTElELmNvZGUsXG4gICAgICAgIG1lc3NhZ2U6ICdvcHRpb25zLmFwaSBpcyBpbnZhbGlkLidcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJlcXVlc3RPcHRpb25zLmhlYWRlcnMgPSBhc3NpZ24oe30sIHJlcXVlc3RPcHRpb25zLmhlYWRlcnMsIGNvbW1vbkhlYWRlcik7XG5cbiAgICBzZWxmLl9yZXF1ZXN0KHJlcXVlc3RPcHRpb25zLCBmdW5jdGlvbiAoZXJyLCBkYXRhLCBzdGF0dXMpIHtcbiAgICAgIHZhciByZXNvbHZlZERhdGE7XG4gICAgICB2YXIgcmVxdWVzdEVycm9yID0gZm9ybWF0UmVxdWVzdEVycm9yKHN0YXR1cywgZXJyKTtcblxuICAgICAgaWYgKHJlcXVlc3RFcnJvcikge1xuICAgICAgICByZWplY3QocmVxdWVzdEVycm9yKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICByZXNvbHZlZERhdGEgPSBBcnJheS5pc0FycmF5KGRhdGEpICYmIHsgZGF0YTogZGF0YSwgX2h0dHBTdGF0dXM6IHN0YXR1cyB9IHx8XG4gICAgICAgIGFzc2lnbih7IF9odHRwU3RhdHVzOiBzdGF0dXMgfSwgZGF0YSk7XG5cbiAgICAgIHJlc29sdmUocmVzb2x2ZWREYXRhKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJlcXVlc3RQcm9taXNlLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICBjYWxsYmFjayhudWxsLCByZXNwb25zZSwgcmVzcG9uc2UuX2h0dHBTdGF0dXMpO1xuICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIHZhciBzdGF0dXMgPSBlcnIgJiYgZXJyLmRldGFpbHMgJiYgZXJyLmRldGFpbHMuaHR0cFN0YXR1cztcbiAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCwgc3RhdHVzKTtcbiAgICB9KTtcbiAgICByZXR1cm47XG4gIH1cblxuICByZXR1cm4gcmVxdWVzdFByb21pc2U7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgY29uc2lzdGVudC1yZXR1cm5cbn07XG5cbmZ1bmN0aW9uIGZvcm1hdFJlcXVlc3RFcnJvcihzdGF0dXMsIGVycikgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGNvbnNpc3RlbnQtcmV0dXJuXG4gIHZhciByZXF1ZXN0RXJyb3I7XG5cbiAgaWYgKHN0YXR1cyA9PT0gLTEpIHtcbiAgICByZXF1ZXN0RXJyb3IgPSBuZXcgU2VhbWxlc3NwYXlFcnJvcihlcnJvcnMuQ0xJRU5UX1JFUVVFU1RfVElNRU9VVCk7XG4gIH0gZWxzZSBpZiAoc3RhdHVzID09PSA0MDMpIHtcbiAgICByZXF1ZXN0RXJyb3IgPSBuZXcgU2VhbWxlc3NwYXlFcnJvcihlcnJvcnMuQ0xJRU5UX0FVVEhPUklaQVRJT05fSU5TVUZGSUNJRU5UKTtcbiAgfSBlbHNlIGlmIChzdGF0dXMgPT09IDQyOSkge1xuICAgIHJlcXVlc3RFcnJvciA9IG5ldyBTZWFtbGVzc3BheUVycm9yKGVycm9ycy5DTElFTlRfUkFURV9MSU1JVEVEKTtcbiAgfSBlbHNlIGlmIChzdGF0dXMgPj0gNTAwKSB7XG4gICAgcmVxdWVzdEVycm9yID0gbmV3IFNlYW1sZXNzcGF5RXJyb3IoZXJyb3JzLkNMSUVOVF9HQVRFV0FZX05FVFdPUkspO1xuICB9IGVsc2UgaWYgKHN0YXR1cyA8IDIwMCB8fCBzdGF0dXMgPj0gNDAwKSB7XG4gICAgcmVxdWVzdEVycm9yID0gY29udmVydFRvU2VhbWxlc3NwYXlFcnJvcihlcnIsIHtcbiAgICAgIHR5cGU6IGVycm9ycy5DTElFTlRfUkVRVUVTVF9FUlJPUi50eXBlLFxuICAgICAgY29kZTogZXJyb3JzLkNMSUVOVF9SRVFVRVNUX0VSUk9SLmNvZGUsXG4gICAgICBtZXNzYWdlOiBlcnJvcnMuQ0xJRU5UX1JFUVVFU1RfRVJST1IubWVzc2FnZVxuICAgIH0pO1xuICB9XG5cbiAgaWYgKHJlcXVlc3RFcnJvcikge1xuICAgIHJlcXVlc3RFcnJvci5kZXRhaWxzID0gcmVxdWVzdEVycm9yLmRldGFpbHMgfHwge307XG4gICAgcmVxdWVzdEVycm9yLmRldGFpbHMuaHR0cFN0YXR1cyA9IHN0YXR1cztcblxuICAgIHJldHVybiByZXF1ZXN0RXJyb3I7XG4gIH1cbn1cblxuQ2xpZW50LnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLmdldENvbmZpZ3VyYXRpb24oKTtcbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgQ2xpZW50IHZlcnNpb24uXG4gKiBAcHVibGljXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgY3JlYXRlZCBjbGllbnQncyB2ZXJzaW9uLlxuICogQGV4YW1wbGVcbiAqIHZhciBjcmVhdGVDbGllbnQgPSByZXF1aXJlKCdicmFpbnRyZWUtd2ViL2NsaWVudCcpLmNyZWF0ZTtcbiAqXG4gKiBjcmVhdGVDbGllbnQoe1xuICogICBhdXRob3JpemF0aW9uOiBDTElFTlRfQVVUSE9SSVpBVElPTlxuICogfSwgZnVuY3Rpb24gKGNyZWF0ZUVyciwgY2xpZW50SW5zdGFuY2UpIHtcbiAqICAgY29uc29sZS5sb2coY2xpZW50SW5zdGFuY2UuZ2V0VmVyc2lvbigpKTsgLy8gRXg6IDEuMC4wXG4gKiB9KTtcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5DbGllbnQucHJvdG90eXBlLmdldFZlcnNpb24gPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBWRVJTSU9OO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDbGllbnQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBTRUFNTEVTU1BBWV9BUElfVkVSU0lPTl9IRUFERVI6ICd2MjAyMCdcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBTZWFtbGVzc3BheUVycm9yID0gcmVxdWlyZSgnLi4vbGliL3NlYW1sZXNzcGF5LWVycm9yJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBDTElFTlRfR0FURVdBWV9DT05GSUdVUkFUSU9OX0lOVkFMSURfRE9NQUlOOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnQ0xJRU5UX0dBVEVXQVlfQ09ORklHVVJBVElPTl9JTlZBTElEX0RPTUFJTidcbiAgfSxcbiAgQ0xJRU5UX09QVElPTl9SRVFVSVJFRDoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTUVSQ0hBTlQsXG4gICAgY29kZTogJ0NMSUVOVF9PUFRJT05fUkVRVUlSRUQnXG4gIH0sXG4gIENMSUVOVF9PUFRJT05fSU5WQUxJRDoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTUVSQ0hBTlQsXG4gICAgY29kZTogJ0NMSUVOVF9PUFRJT05fSU5WQUxJRCdcbiAgfSxcbiAgQ0xJRU5UX01JU1NJTkdfR0FURVdBWV9DT05GSUdVUkFUSU9OOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5JTlRFUk5BTCxcbiAgICBjb2RlOiAnQ0xJRU5UX01JU1NJTkdfR0FURVdBWV9DT05GSUdVUkFUSU9OJyxcbiAgICBtZXNzYWdlOiAnTWlzc2luZyBnYXRld2F5Q29uZmlndXJhdGlvbi4nXG4gIH0sXG4gIENMSUVOVF9JTlZBTElEX0FVVEhPUklaQVRJT046IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLk1FUkNIQU5ULFxuICAgIGNvZGU6ICdDTElFTlRfSU5WQUxJRF9BVVRIT1JJWkFUSU9OJyxcbiAgICBtZXNzYWdlOiAnQXV0aG9yaXphdGlvbiBpcyBpbnZhbGlkLiBNYWtlIHN1cmUgeW91ciBjbGllbnQgdG9rZW4gb3IgdG9rZW5pemF0aW9uIGtleSBpcyB2YWxpZC4nXG4gIH0sXG4gIENMSUVOVF9HQVRFV0FZX05FVFdPUks6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLk5FVFdPUkssXG4gICAgY29kZTogJ0NMSUVOVF9HQVRFV0FZX05FVFdPUksnLFxuICAgIG1lc3NhZ2U6ICdDYW5ub3QgY29udGFjdCB0aGUgZ2F0ZXdheSBhdCB0aGlzIHRpbWUuJ1xuICB9LFxuICBDTElFTlRfUkVRVUVTVF9USU1FT1VUOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5ORVRXT1JLLFxuICAgIGNvZGU6ICdDTElFTlRfUkVRVUVTVF9USU1FT1VUJyxcbiAgICBtZXNzYWdlOiAnUmVxdWVzdCB0aW1lZCBvdXQgd2FpdGluZyBmb3IgYSByZXBseS4nXG4gIH0sXG4gIENMSUVOVF9SRVFVRVNUX0VSUk9SOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5ORVRXT1JLLFxuICAgIGNvZGU6ICdDTElFTlRfUkVRVUVTVF9FUlJPUicsXG4gICAgbWVzc2FnZTogJ1RoZXJlIHdhcyBhIHByb2JsZW0gd2l0aCB5b3VyIHJlcXVlc3QuJ1xuICB9LFxuICBDTElFTlRfUkFURV9MSU1JVEVEOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnQ0xJRU5UX1JBVEVfTElNSVRFRCcsXG4gICAgbWVzc2FnZTogJ1lvdSBhcmUgYmVpbmcgcmF0ZS1saW1pdGVkOyBwbGVhc2UgdHJ5IGFnYWluIGluIGEgZmV3IG1pbnV0ZXMuJ1xuICB9LFxuICBDTElFTlRfQVVUSE9SSVpBVElPTl9JTlNVRkZJQ0lFTlQ6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLk1FUkNIQU5ULFxuICAgIGNvZGU6ICdDTElFTlRfQVVUSE9SSVpBVElPTl9JTlNVRkZJQ0lFTlQnLFxuICAgIG1lc3NhZ2U6ICdUaGUgYXV0aG9yaXphdGlvbiB1c2VkIGhhcyBpbnN1ZmZpY2llbnQgcHJpdmlsZWdlcy4nXG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBxdWVyeXN0cmluZyA9IHJlcXVpcmUoJy4uLy4uL2xpYi9xdWVyeXN0cmluZycpO1xudmFyIGFzc2lnbiA9IHJlcXVpcmUoJy4uLy4uL2xpYi9hc3NpZ24nKS5hc3NpZ247XG52YXIgcHJlcEJvZHkgPSByZXF1aXJlKCcuL3ByZXAtYm9keScpO1xudmFyIHBhcnNlQm9keSA9IHJlcXVpcmUoJy4vcGFyc2UtYm9keScpO1xudmFyIGlzWEhSQXZhaWxhYmxlID0gZ2xvYmFsLlhNTEh0dHBSZXF1ZXN0ICYmICd3aXRoQ3JlZGVudGlhbHMnIGluIG5ldyBnbG9iYWwuWE1MSHR0cFJlcXVlc3QoKTtcblxuZnVuY3Rpb24gZ2V0UmVxdWVzdE9iamVjdCgpIHtcbiAgcmV0dXJuIGlzWEhSQXZhaWxhYmxlID8gbmV3IFhNTEh0dHBSZXF1ZXN0KCkgOiBuZXcgWERvbWFpblJlcXVlc3QoKTtcbn1cblxuZnVuY3Rpb24gcmVxdWVzdChvcHRpb25zLCBjYikge1xuICB2YXIgc3RhdHVzLCByZXNCb2R5O1xuICB2YXIgbWV0aG9kID0gb3B0aW9ucy5tZXRob2Q7XG4gIHZhciB1cmwgPSBvcHRpb25zLnVybDtcbiAgdmFyIGJvZHkgPSBvcHRpb25zLmRhdGE7XG4gIHZhciB0aW1lb3V0ID0gb3B0aW9ucy50aW1lb3V0O1xuICB2YXIgaGVhZGVycyA9IGFzc2lnbih7XG4gICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICB9LCBvcHRpb25zLmhlYWRlcnMpO1xuICB2YXIgcmVxID0gZ2V0UmVxdWVzdE9iamVjdCgpO1xuICB2YXIgY2FsbGJhY2sgPSBjYjtcblxuICBpZiAobWV0aG9kID09PSAnR0VUJykge1xuICAgIHVybCA9IHF1ZXJ5c3RyaW5nLnF1ZXJ5aWZ5KHVybCwgYm9keSk7XG4gICAgYm9keSA9IG51bGw7XG4gIH1cblxuICBpZiAoaXNYSFJBdmFpbGFibGUpIHtcbiAgICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHJlcS5yZWFkeVN0YXRlICE9PSA0KSB7IHJldHVybjsgfVxuXG4gICAgICBzdGF0dXMgPSByZXEuc3RhdHVzO1xuICAgICAgcmVzQm9keSA9IHBhcnNlQm9keShyZXEucmVzcG9uc2VUZXh0KTtcblxuICAgICAgaWYgKHN0YXR1cyA+PSA0MDAgfHwgc3RhdHVzIDwgMjAwKSB7XG4gICAgICAgIGNhbGxiYWNrKHJlc0JvZHkgfHwgJ2Vycm9yJywgbnVsbCwgc3RhdHVzIHx8IDUwMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYWxsYmFjayhudWxsLCByZXNCb2R5LCBzdGF0dXMpO1xuICAgICAgfVxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgaWYgKG9wdGlvbnMuaGVhZGVycykge1xuICAgICAgdXJsID0gcXVlcnlzdHJpbmcucXVlcnlpZnkodXJsLCBoZWFkZXJzKTtcbiAgICB9XG5cbiAgICByZXEub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgY2FsbGJhY2sobnVsbCwgcGFyc2VCb2R5KHJlcS5yZXNwb25zZVRleHQpLCByZXEuc3RhdHVzKTtcbiAgICB9O1xuXG4gICAgcmVxLm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBYRG9tYWluUmVxdWVzdCBkb2VzIG5vdCByZXBvcnQgYSBib2R5IG9yIHN0YXR1cyBmb3IgZXJyb3JzLCBzb1xuICAgICAgLy8gaGFyZGNvZGUgdG8gJ2Vycm9yJyBhbmQgNTAwLCByZXNwZWN0aXZlbHlcbiAgICAgIGNhbGxiYWNrKCdlcnJvcicsIG51bGwsIDUwMCk7XG4gICAgfTtcblxuICAgIC8vIFRoaXMgbXVzdCByZW1haW4gZm9yIElFOSB0byB3b3JrXG4gICAgcmVxLm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbiAoKSB7fTtcblxuICAgIHJlcS5vbnRpbWVvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBjYWxsYmFjaygndGltZW91dCcsIG51bGwsIC0xKTtcbiAgICB9O1xuICB9XG5cbiAgcmVxLm9wZW4obWV0aG9kLCB1cmwsIHRydWUpO1xuICByZXEudGltZW91dCA9IHRpbWVvdXQ7XG5cbiAgaWYgKGlzWEhSQXZhaWxhYmxlKSB7XG4gICAgT2JqZWN0LmtleXMoaGVhZGVycykuZm9yRWFjaChmdW5jdGlvbiAoaGVhZGVyS2V5KSB7XG4gICAgICByZXEuc2V0UmVxdWVzdEhlYWRlcihoZWFkZXJLZXksIGhlYWRlcnNbaGVhZGVyS2V5XSk7XG4gICAgfSk7XG4gIH1cblxuICB0cnkge1xuICAgIHJlcS5zZW5kKHByZXBCb2R5KG1ldGhvZCwgYm9keSkpO1xuICB9IGNhdGNoIChlKSB7IC8qIGlnbm9yZWQgKi8gfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgcmVxdWVzdDogcmVxdWVzdFxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRVc2VyQWdlbnQoKSB7XG4gIHJldHVybiBnbG9iYWwubmF2aWdhdG9yLnVzZXJBZ2VudDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBhamF4SXNBdmFsaWFibGU7XG52YXIgb25jZSA9IHJlcXVpcmUoJy4uLy4uL2xpYi9vbmNlJyk7XG52YXIgSlNPTlBEcml2ZXIgPSByZXF1aXJlKCcuL2pzb25wLWRyaXZlcicpO1xudmFyIEFKQVhEcml2ZXIgPSByZXF1aXJlKCcuL2FqYXgtZHJpdmVyJyk7XG52YXIgZ2V0VXNlckFnZW50ID0gcmVxdWlyZSgnLi9nZXQtdXNlci1hZ2VudCcpO1xudmFyIGlzSFRUUCA9IHJlcXVpcmUoJy4vaXMtaHR0cCcpO1xuXG5mdW5jdGlvbiBpc0FqYXhBdmFpbGFibGUoKSB7XG4gIGlmIChhamF4SXNBdmFsaWFibGUgPT0gbnVsbCkge1xuICAgIGFqYXhJc0F2YWxpYWJsZSA9ICEoaXNIVFRQKCkgJiYgL01TSUVcXHMoOHw5KS8udGVzdChnZXRVc2VyQWdlbnQoKSkpO1xuICB9XG5cbiAgcmV0dXJuIGFqYXhJc0F2YWxpYWJsZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob3B0aW9ucywgY2IpIHtcbiAgY2IgPSBvbmNlKGNiIHx8IEZ1bmN0aW9uLnByb3RvdHlwZSk7XG4gIG9wdGlvbnMubWV0aG9kID0gKG9wdGlvbnMubWV0aG9kIHx8ICdHRVQnKS50b1VwcGVyQ2FzZSgpO1xuICBvcHRpb25zLnRpbWVvdXQgPSBvcHRpb25zLnRpbWVvdXQgPT0gbnVsbCA/IDYwMDAwIDogb3B0aW9ucy50aW1lb3V0O1xuICBvcHRpb25zLmRhdGEgPSBvcHRpb25zLmRhdGEgfHwge307XG5cbiAgaWYgKGlzQWpheEF2YWlsYWJsZSgpKSB7XG4gICAgQUpBWERyaXZlci5yZXF1ZXN0KG9wdGlvbnMsIGNiKTtcbiAgfSBlbHNlIHtcbiAgICBKU09OUERyaXZlci5yZXF1ZXN0KG9wdGlvbnMsIGNiKTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBnbG9iYWwubG9jYXRpb24ucHJvdG9jb2wgPT09ICdodHRwOic7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaGVhZDtcbnZhciB1dWlkID0gcmVxdWlyZSgnLi4vLi4vbGliL3V1aWQnKTtcbnZhciBxdWVyeXN0cmluZyA9IHJlcXVpcmUoJy4uLy4uL2xpYi9xdWVyeXN0cmluZycpO1xudmFyIHRpbWVvdXRzID0ge307XG5cbmZ1bmN0aW9uIF9yZW1vdmVTY3JpcHQoc2NyaXB0KSB7XG4gIGlmIChzY3JpcHQgJiYgc2NyaXB0LnBhcmVudE5vZGUpIHtcbiAgICBzY3JpcHQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzY3JpcHQpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9jcmVhdGVTY3JpcHRUYWcodXJsLCBjYWxsYmFja05hbWUpIHtcbiAgdmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICB2YXIgZG9uZSA9IGZhbHNlO1xuXG4gIHNjcmlwdC5zcmMgPSB1cmw7XG4gIHNjcmlwdC5hc3luYyA9IHRydWU7XG4gIHNjcmlwdC5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgIGdsb2JhbFtjYWxsYmFja05hbWVdKHttZXNzYWdlOiAnZXJyb3InLCBzdGF0dXM6IDUwMH0pO1xuICB9O1xuXG4gIHNjcmlwdC5vbmxvYWQgPSBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChkb25lKSB7IHJldHVybjsgfVxuXG4gICAgaWYgKCF0aGlzLnJlYWR5U3RhdGUgfHwgdGhpcy5yZWFkeVN0YXRlID09PSAnbG9hZGVkJyB8fCB0aGlzLnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZScpIHtcbiAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgc2NyaXB0Lm9ubG9hZCA9IHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBudWxsO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gc2NyaXB0O1xufVxuXG5mdW5jdGlvbiBfY2xlYW51cEdsb2JhbChjYWxsYmFja05hbWUpIHtcbiAgdHJ5IHtcbiAgICBkZWxldGUgZ2xvYmFsW2NhbGxiYWNrTmFtZV07XG4gIH0gY2F0Y2ggKF8pIHtcbiAgICBnbG9iYWxbY2FsbGJhY2tOYW1lXSA9IG51bGw7XG4gIH1cbn1cblxuZnVuY3Rpb24gX3NldHVwVGltZW91dCh0aW1lb3V0LCBjYWxsYmFja05hbWUpIHtcbiAgdGltZW91dHNbY2FsbGJhY2tOYW1lXSA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgIHRpbWVvdXRzW2NhbGxiYWNrTmFtZV0gPSBudWxsO1xuXG4gICAgZ2xvYmFsW2NhbGxiYWNrTmFtZV0oe1xuICAgICAgZXJyb3I6ICd0aW1lb3V0JyxcbiAgICAgIHN0YXR1czogLTFcbiAgICB9KTtcblxuICAgIGdsb2JhbFtjYWxsYmFja05hbWVdID0gZnVuY3Rpb24gKCkge1xuICAgICAgX2NsZWFudXBHbG9iYWwoY2FsbGJhY2tOYW1lKTtcbiAgICB9O1xuICB9LCB0aW1lb3V0KTtcbn1cblxuZnVuY3Rpb24gX3NldHVwR2xvYmFsQ2FsbGJhY2soc2NyaXB0LCBjYWxsYmFjaywgY2FsbGJhY2tOYW1lKSB7XG4gIGdsb2JhbFtjYWxsYmFja05hbWVdID0gZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgdmFyIHN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1cyB8fCA1MDA7XG4gICAgdmFyIGVyciA9IG51bGw7XG4gICAgdmFyIGRhdGEgPSBudWxsO1xuXG4gICAgZGVsZXRlIHJlc3BvbnNlLnN0YXR1cztcblxuICAgIGlmIChzdGF0dXMgPj0gNDAwIHx8IHN0YXR1cyA8IDIwMCkge1xuICAgICAgZXJyID0gcmVzcG9uc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRhdGEgPSByZXNwb25zZTtcbiAgICB9XG5cbiAgICBfY2xlYW51cEdsb2JhbChjYWxsYmFja05hbWUpO1xuICAgIF9yZW1vdmVTY3JpcHQoc2NyaXB0KTtcblxuICAgIGNsZWFyVGltZW91dCh0aW1lb3V0c1tjYWxsYmFja05hbWVdKTtcbiAgICBjYWxsYmFjayhlcnIsIGRhdGEsIHN0YXR1cyk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHJlcXVlc3Qob3B0aW9ucywgY2FsbGJhY2spIHtcbiAgdmFyIHNjcmlwdDtcbiAgdmFyIGNhbGxiYWNrTmFtZSA9ICdjYWxsYmFja19qc29uXycgKyB1dWlkKCkucmVwbGFjZSgvLS9nLCAnJyk7XG4gIHZhciB1cmwgPSBvcHRpb25zLnVybDtcbiAgdmFyIGF0dHJzID0gb3B0aW9ucy5kYXRhO1xuICB2YXIgbWV0aG9kID0gb3B0aW9ucy5tZXRob2Q7XG4gIHZhciB0aW1lb3V0ID0gb3B0aW9ucy50aW1lb3V0O1xuXG4gIHVybCA9IHF1ZXJ5c3RyaW5nLnF1ZXJ5aWZ5KHVybCwgYXR0cnMpO1xuICB1cmwgPSBxdWVyeXN0cmluZy5xdWVyeWlmeSh1cmwsIHtcbiAgICBfbWV0aG9kOiBtZXRob2QsXG4gICAgY2FsbGJhY2s6IGNhbGxiYWNrTmFtZVxuICB9KTtcblxuICBzY3JpcHQgPSBfY3JlYXRlU2NyaXB0VGFnKHVybCwgY2FsbGJhY2tOYW1lKTtcbiAgX3NldHVwR2xvYmFsQ2FsbGJhY2soc2NyaXB0LCBjYWxsYmFjaywgY2FsbGJhY2tOYW1lKTtcbiAgX3NldHVwVGltZW91dCh0aW1lb3V0LCBjYWxsYmFja05hbWUpO1xuXG4gIGlmICghaGVhZCkge1xuICAgIGhlYWQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xuICB9XG5cbiAgaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgcmVxdWVzdDogcmVxdWVzdFxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYm9keSkge1xuICB0cnkge1xuICAgIGJvZHkgPSBKU09OLnBhcnNlKGJvZHkpO1xuICB9IGNhdGNoIChlKSB7IC8qIGlnbm9yZWQgKi8gfVxuXG4gIHJldHVybiBib2R5O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobWV0aG9kLCBib2R5KSB7XG4gIGlmIChTdHJpbmcobWV0aG9kKS50b0xvd2VyQ2FzZSgpICE9PSAnZ2V0JyAmJiBib2R5ICE9IG51bGwpIHtcbiAgICBib2R5ID0gdHlwZW9mIGJvZHkgPT09ICdzdHJpbmcnID8gYm9keSA6IEpTT04uc3RyaW5naWZ5KGJvZHkpO1xuICB9XG5cbiAgcmV0dXJuIGJvZHk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgU2VhbWxlc3NwYXlFcnJvciA9IHJlcXVpcmUoJy4uLy4uL2xpYi9zZWFtbGVzc3BheS1lcnJvcicpO1xudmFyIGVycm9ycyA9IHJlcXVpcmUoJy4uL3NoYXJlZC9lcnJvcnMnKTtcbnZhciB3aGl0ZWxpc3QgPSByZXF1aXJlKCcuLi9zaGFyZWQvY29uc3RhbnRzJykud2hpdGVsaXN0ZWRBdHRyaWJ1dGVzO1xuXG5mdW5jdGlvbiBhdHRyaWJ1dGVWYWxpZGF0aW9uRXJyb3IoYXR0cmlidXRlLCB2YWx1ZSkge1xuICB2YXIgZXJyO1xuXG4gIGlmICghd2hpdGVsaXN0Lmhhc093blByb3BlcnR5KGF0dHJpYnV0ZSkpIHtcbiAgICBlcnIgPSBuZXcgU2VhbWxlc3NwYXlFcnJvcih7XG4gICAgICB0eXBlOiBlcnJvcnMuSE9TVEVEX0ZJRUxEU19BVFRSSUJVVEVfTk9UX1NVUFBPUlRFRC50eXBlLFxuICAgICAgY29kZTogZXJyb3JzLkhPU1RFRF9GSUVMRFNfQVRUUklCVVRFX05PVF9TVVBQT1JURUQuY29kZSxcbiAgICAgIG1lc3NhZ2U6ICdUaGUgXCInICsgYXR0cmlidXRlICsgJ1wiIGF0dHJpYnV0ZSBpcyBub3Qgc3VwcG9ydGVkIGluIEhvc3RlZCBGaWVsZHMuJ1xuICAgIH0pO1xuICB9IGVsc2UgaWYgKHZhbHVlICE9IG51bGwgJiYgIV9pc1ZhbGlkKGF0dHJpYnV0ZSwgdmFsdWUpKSB7XG4gICAgZXJyID0gbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgdHlwZTogZXJyb3JzLkhPU1RFRF9GSUVMRFNfQVRUUklCVVRFX1ZBTFVFX05PVF9BTExPV0VELnR5cGUsXG4gICAgICBjb2RlOiBlcnJvcnMuSE9TVEVEX0ZJRUxEU19BVFRSSUJVVEVfVkFMVUVfTk9UX0FMTE9XRUQuY29kZSxcbiAgICAgIG1lc3NhZ2U6ICdWYWx1ZSBcIicgKyB2YWx1ZSArICdcIiBpcyBub3QgYWxsb3dlZCBmb3IgXCInICsgYXR0cmlidXRlICsgJ1wiIGF0dHJpYnV0ZS4nXG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gZXJyO1xufVxuXG5mdW5jdGlvbiBfaXNWYWxpZChhdHRyaWJ1dGUsIHZhbHVlKSB7XG4gIGlmICh3aGl0ZWxpc3RbYXR0cmlidXRlXSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyB8fCB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInO1xuICB9IGVsc2UgaWYgKHdoaXRlbGlzdFthdHRyaWJ1dGVdID09PSAnYm9vbGVhbicpIHtcbiAgICByZXR1cm4gU3RyaW5nKHZhbHVlKSA9PT0gJ3RydWUnIHx8IFN0cmluZyh2YWx1ZSkgPT09ICdmYWxzZSc7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXR0cmlidXRlVmFsaWRhdGlvbkVycm9yO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY29uc3RhbnRzID0gcmVxdWlyZSgnLi8uLi8uLi9zaGFyZWQvY29uc3RhbnRzJyk7XG52YXIgQmFzZUlucHV0ID0gcmVxdWlyZSgnLi9iYXNlLWlucHV0JykuQmFzZUlucHV0O1xuXG52YXIgR0lGVF9DQVJEID0gY29uc3RhbnRzLnBheW1lbnRUeXBlcy5QQVlNRU5UX1RZUEVfR0lGVF9DQVJEO1xudmFyIEFDSCA9IGNvbnN0YW50cy5wYXltZW50VHlwZXMuUEFZTUVOVF9UWVBFX0FDSDtcbnZhciBHSUZUX0NBUkRfTUFYX0xFTkdUSCA9IGNvbnN0YW50cy5HSUZUX0NBUkRfTUFYX0xFTkdUSDtcbnZhciBQQVRURVJOX0NBQ0hFID0ge307XG52YXIgQUNIX1BBVFRFUk5fQ0FDSEUgPSB7fTtcblxuZnVuY3Rpb24gX2dlbmVyYXRlQWNoUGF0dGVybihsZW5ndGgpIHtcbiAgcmV0dXJuIFsne3snLCBBcnJheShsZW5ndGgpLmZpbGwoJzknKS5qb2luKCcnKSwgJ319J10uam9pbignJyk7XG59XG5cbmZ1bmN0aW9uIF9nZXRBY2hQYXR0ZXJuKGxlbmd0aCkge1xuICBpZiAoIShsZW5ndGggaW4gQUNIX1BBVFRFUk5fQ0FDSEUpKSB7XG4gICAgQUNIX1BBVFRFUk5fQ0FDSEVbbGVuZ3RoXSA9IF9nZW5lcmF0ZUFjaFBhdHRlcm4obGVuZ3RoKTtcbiAgfVxuICByZXR1cm4gQUNIX1BBVFRFUk5fQ0FDSEVbbGVuZ3RoXTtcbn1cblxuZnVuY3Rpb24gX2dlbmVyYXRlUGF0dGVybihjYXJkLCBwYXltZW50VHlwZSkge1xuICB2YXIgaSwgcGF0dGVybjtcbiAgdmFyIGdhcHMgPSBbNCwgOCwgMTJdO1xuICB2YXIgbGVuZ3RoID0gMTY7XG4gIHZhciB0eXBlID0gJ3Vua25vd24nO1xuXG4gIGlmIChwYXltZW50VHlwZSA9PT0gR0lGVF9DQVJEKSB7XG4gICAgZ2Fwcy5wdXNoKDE2KTtcbiAgICBsZW5ndGggPSBHSUZUX0NBUkRfTUFYX0xFTkdUSDtcbiAgfSBlbHNlIGlmIChjYXJkKSB7XG4gICAgbGVuZ3RoID0gTWF0aC5tYXguYXBwbHkobnVsbCwgY2FyZC5sZW5ndGhzKTtcbiAgICBnYXBzID0gY2FyZC5nYXBzO1xuICAgIHR5cGUgPSBjYXJkLnR5cGU7XG4gIH1cblxuICBpZiAodHlwZSBpbiBQQVRURVJOX0NBQ0hFKSB7XG4gICAgcmV0dXJuIFBBVFRFUk5fQ0FDSEVbdHlwZV07XG4gIH1cblxuICBwYXR0ZXJuID0gJ3t7JztcblxuICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoZ2Fwcy5pbmRleE9mKGkpICE9PSAtMSkge1xuICAgICAgcGF0dGVybiArPSAnfX0ge3snO1xuICAgIH1cblxuICAgIHBhdHRlcm4gKz0gJzknO1xuICB9XG5cbiAgUEFUVEVSTl9DQUNIRVt0eXBlXSA9IHBhdHRlcm4gKyAnfX0nO1xuICByZXR1cm4gUEFUVEVSTl9DQUNIRVt0eXBlXTtcbn1cblxuZnVuY3Rpb24gQWNjb3VudE51bWJlcklucHV0KCkge1xuXG4gIEJhc2VJbnB1dC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gIHZhciBERUZBVUxUX01BWF9MRU5HVEggPSB0aGlzLm1heExlbmd0aDtcbiAgdmFyIHBheW1lbnRUeXBlID0gdGhpcy5tb2RlbC5nZXRQYXltZW50VHlwZSgpO1xuXG4gIGlmIChwYXltZW50VHlwZSA9PT0gQUNIKSB7XG4gICAgdGhpcy5zZXRQYXR0ZXJuKF9nZXRBY2hQYXR0ZXJuKERFRkFVTFRfTUFYX0xFTkdUSCkpO1xuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdGhpcy5zZXRQYXR0ZXJuKF9nZW5lcmF0ZVBhdHRlcm4oJycsIHBheW1lbnRUeXBlKSk7XG5cbiAgdGhpcy5tb2RlbC5vbignY2hhbmdlOnBvc3NpYmxlQ2FyZFR5cGVzJywgZnVuY3Rpb24gKHBvc3NpYmxlQ2FyZFR5cGVzKSB7XG4gICAgdmFyIGNhcmQ7XG4gICAgdmFyIG1heExlbmd0aCA9IHBheW1lbnRUeXBlID09PSBHSUZUX0NBUkQgPyBHSUZUX0NBUkRfTUFYX0xFTkdUSCA6IERFRkFVTFRfTUFYX0xFTkdUSDtcblxuICAgIGlmIChwb3NzaWJsZUNhcmRUeXBlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIGNhcmQgPSBwb3NzaWJsZUNhcmRUeXBlc1swXTtcbiAgICAgIG1heExlbmd0aCA9IE1hdGgubWF4LmFwcGx5KG51bGwsIGNhcmQubGVuZ3RocykgKyBjYXJkLmdhcHMubGVuZ3RoO1xuICAgIH1cblxuICAgIHRoaXMuc2V0UGF0dGVybihfZ2VuZXJhdGVQYXR0ZXJuKGNhcmQsIHBheW1lbnRUeXBlKSk7XG4gICAgdGhpcy51cGRhdGVNb2RlbCgndmFsdWUnLCB0aGlzLmZvcm1hdHRlci5nZXRVbmZvcm1hdHRlZFZhbHVlKCkpO1xuICAgIHRoaXMubWF4TGVuZ3RoID0gbWF4TGVuZ3RoO1xuXG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfS5iaW5kKHRoaXMpKTtcblxuICB0aGlzLm1vZGVsLm9uKCdjaGFuZ2U6YWNjb3VudE51bWJlci52YWx1ZScsIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIGlmICgvU2Ftc3VuZ0Jyb3dzZXIvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpKSB7XG4gICAgICB2YXIgY2FyZE51bWJlclJFID0gL1teMC05XFxzXS9nO1xuICAgICAgdGhpcy5lbGVtZW50LnZhbHVlID0gdGhpcy5lbGVtZW50LnZhbHVlLnJlcGxhY2UoY2FyZE51bWJlclJFLCAnJyk7XG4gICAgICB0aGlzLnVwZGF0ZU1vZGVsKCd2YWx1ZScsIHZhbHVlLnJlcGxhY2UoY2FyZE51bWJlclJFLCAnJykpO1xuICAgIH1cbiAgfS5iaW5kKHRoaXMpKTtcbn1cblxuQWNjb3VudE51bWJlcklucHV0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQmFzZUlucHV0LnByb3RvdHlwZSk7XG5BY2NvdW50TnVtYmVySW5wdXQucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQWNjb3VudE51bWJlcklucHV0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgQWNjb3VudE51bWJlcklucHV0OiBBY2NvdW50TnVtYmVySW5wdXRcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBhdHRyaWJ1dGVWYWxpZGF0aW9uRXJyb3IgPSByZXF1aXJlKCcuLi8uLi9leHRlcm5hbC9hdHRyaWJ1dGUtdmFsaWRhdGlvbi1lcnJvcicpO1xudmFyIGNvbnN0YW50cyA9IHJlcXVpcmUoJy4uLy4uL3NoYXJlZC9jb25zdGFudHMnKTtcbnZhciBjbGFzc2xpc3QgPSByZXF1aXJlKCcuLi8uLi8uLi9saWIvY2xhc3NsaXN0Jyk7XG52YXIgY3JlYXRlUmVzdHJpY3RlZElucHV0ID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliL2NyZWF0ZS1yZXN0cmljdGVkLWlucHV0Jyk7XG5cbnZhciBldmVudHMgPSBjb25zdGFudHMuZXZlbnRzO1xudmFyIEVOVEVSX0tFWV9DT0RFID0gMTM7XG52YXIgREVGQVVMVF9NQVNLX0NIQVJBQ1RFUiA9ICfigKInO1xuXG5mdW5jdGlvbiBCYXNlSW5wdXQob3B0aW9ucykge1xuICB2YXIgc2hvdWxkRm9ybWF0LCBjb25maWc7XG5cbiAgdGhpcy5tb2RlbCA9IG9wdGlvbnMubW9kZWw7XG4gIHRoaXMudHlwZSA9IG9wdGlvbnMudHlwZTtcbiAgdGhpcy5tYXhMZW5ndGggPSAhdGhpcy5tYXhMZW5ndGggPyB0aGlzLm1vZGVsLmdldE1heExlbmd0aCh0aGlzLnR5cGUpIDogdGhpcy5tYXhMZW5ndGg7XG5cbiAgY29uZmlnID0gdGhpcy5nZXRDb25maWd1cmF0aW9uKCk7XG5cbiAgdGhpcy5lbGVtZW50ID0gdGhpcy5jb25zdHJ1Y3RFbGVtZW50KCk7XG5cbiAgdGhpcy5wYXR0ZXJuID0gJyAnO1xuICB0aGlzLmhpZGRlbk1hc2tlZFZhbHVlID0gJyc7XG4gIHRoaXMuc2hvdWxkTWFzayA9IEJvb2xlYW4oY29uZmlnLm1hc2tJbnB1dCk7XG4gIHRoaXMubWFza0NoYXJhY3RlciA9IGNvbmZpZy5tYXNrSW5wdXQgJiYgY29uZmlnLm1hc2tJbnB1dC5jaGFyYWN0ZXIgfHwgREVGQVVMVF9NQVNLX0NIQVJBQ1RFUjtcblxuICBzaG91bGRGb3JtYXQgPSBjb25maWcuZm9ybWF0SW5wdXQgIT09IGZhbHNlICYmIHRoaXMuZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQ7XG4gIHRoaXMuZm9ybWF0dGVyID0gY3JlYXRlUmVzdHJpY3RlZElucHV0KHtcbiAgICBzaG91bGRGb3JtYXQ6IHNob3VsZEZvcm1hdCxcbiAgICBlbGVtZW50OiB0aGlzLmVsZW1lbnQsXG4gICAgcGF0dGVybjogdGhpcy5wYXR0ZXJuXG4gIH0pO1xuXG4gIHRoaXMuYWRkRE9NRXZlbnRMaXN0ZW5lcnMoKTtcbiAgdGhpcy5hZGRNb2RlbEV2ZW50TGlzdGVuZXJzKCk7XG4gIHRoaXMuYWRkQnVzRXZlbnRMaXN0ZW5lcnMoKTtcbiAgdGhpcy5yZW5kZXIoKTtcblxuICB0aGlzLm1vZGVsLnNldHVwQ29tcG9uZW50KHRoaXMudHlwZSwgdGhpcyk7XG59XG5cbkJhc2VJbnB1dC5wcm90b3R5cGUuZ2V0Q29uZmlndXJhdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMubW9kZWwuY29uZmlndXJhdGlvbi5maWVsZHNbdGhpcy50eXBlXTtcbn07XG5cbkJhc2VJbnB1dC5wcm90b3R5cGUudXBkYXRlTW9kZWwgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICB0aGlzLm1vZGVsLnNldCh0aGlzLnR5cGUgKyAnLicgKyBrZXksIHZhbHVlKTtcbn07XG5cbkJhc2VJbnB1dC5wcm90b3R5cGUubW9kZWxPbkNoYW5nZSA9IGZ1bmN0aW9uIChwcm9wZXJ0eSwgY2FsbGJhY2spIHtcbiAgdmFyIGV2ZW50UHJlZml4ID0gJ2NoYW5nZTonICsgdGhpcy50eXBlO1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgdGhpcy5tb2RlbC5vbihldmVudFByZWZpeCArICcuJyArIHByb3BlcnR5LCBmdW5jdGlvbiAoKSB7XG4gICAgY2FsbGJhY2suYXBwbHkoc2VsZiwgYXJndW1lbnRzKTtcbiAgfSk7XG59O1xuXG5CYXNlSW5wdXQucHJvdG90eXBlLmNvbnN0cnVjdEVsZW1lbnQgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciB0eXBlID0gdGhpcy50eXBlO1xuICB2YXIgaW5wdXRUeXBlID0gdGhpcy5nZXRDb25maWd1cmF0aW9uKCkudHlwZSB8fCAndGVsJztcblxuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG5cbiAgdmFyIHBsYWNlaG9sZGVyID0gdGhpcy5nZXRDb25maWd1cmF0aW9uKCkucGxhY2Vob2xkZXI7XG4gIHZhciB3aGl0ZWxpc3RlZEZpZWxkcyA9IHRoaXMubW9kZWwuZ2V0V2hpdGVsaXN0ZWRGaWVsZHMoKTtcbiAgdmFyIG5hbWUgPSB3aGl0ZWxpc3RlZEZpZWxkc1t0eXBlXSA/IHdoaXRlbGlzdGVkRmllbGRzW3R5cGVdLm5hbWUgOiBudWxsO1xuXG4gIHZhciBhdHRyaWJ1dGVzID0ge1xuICAgIHR5cGU6IGlucHV0VHlwZSxcbiAgICBhdXRvY29tcGxldGU6IGNvbnN0YW50cy5hdXRvY29tcGxldGVNYXBwaW5nc1tuYW1lXSB8fCAnb2ZmJyxcbiAgICBhdXRvY29ycmVjdDogJ29mZicsXG4gICAgYXV0b2NhcGl0YWxpemU6ICdub25lJyxcbiAgICBzcGVsbGNoZWNrOiAnZmFsc2UnLFxuICAgICdjbGFzcyc6IHR5cGUsXG4gICAgJ2RhdGEtc2VhbWxlc3NwYXktbmFtZSc6IHR5cGUsXG4gICAgbmFtZTogbmFtZSxcbiAgICBpZDogbmFtZVxuICB9O1xuXG4gIGlmICh0aGlzLm1heExlbmd0aCkge1xuICAgIGF0dHJpYnV0ZXMubWF4bGVuZ3RoID0gdGhpcy5tYXhMZW5ndGg7XG4gIH1cblxuICBpZiAocGxhY2Vob2xkZXIpIHtcbiAgICBhdHRyaWJ1dGVzLnBsYWNlaG9sZGVyID0gcGxhY2Vob2xkZXI7XG4gIH1cblxuICBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChhdHRyKSB7XG4gICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0ciwgYXR0cmlidXRlc1thdHRyXSk7XG4gIH0pO1xuXG4gIHJldHVybiBlbGVtZW50O1xufTtcblxuQmFzZUlucHV0LnByb3RvdHlwZS5nZXRVbmZvcm1hdHRlZFZhbHVlID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5mb3JtYXR0ZXIuZ2V0VW5mb3JtYXR0ZWRWYWx1ZSgpO1xufTtcblxuQmFzZUlucHV0LnByb3RvdHlwZS5hZGRET01FdmVudExpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5fYWRkRE9NRm9jdXNMaXN0ZW5lcnMoKTtcbiAgdGhpcy5fYWRkRE9NSW5wdXRMaXN0ZW5lcnMoKTtcbiAgdGhpcy5fYWRkRE9NS2V5cHJlc3NMaXN0ZW5lcnMoKTtcbn07XG5cbkJhc2VJbnB1dC5wcm90b3R5cGUubWFza1ZhbHVlID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHZhbHVlID0gdmFsdWUgfHwgdGhpcy5lbGVtZW50LnZhbHVlO1xuXG4gIHRoaXMuaGlkZGVuTWFza2VkVmFsdWUgPSB2YWx1ZTtcbiAgdGhpcy5lbGVtZW50LnZhbHVlID0gdmFsdWUucmVwbGFjZSgvW15cXHNcXC9cXC1dL2csIHRoaXMubWFza0NoYXJhY3Rlcik7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdXNlbGVzcy1lc2NhcGVcbn07XG5cbkJhc2VJbnB1dC5wcm90b3R5cGUudW5tYXNrVmFsdWUgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuZWxlbWVudC52YWx1ZSA9IHRoaXMuaGlkZGVuTWFza2VkVmFsdWU7XG59O1xuXG5CYXNlSW5wdXQucHJvdG90eXBlLl9hZGRET01LZXlwcmVzc0xpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXByZXNzJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IEVOVEVSX0tFWV9DT0RFKSB7XG4gICAgICB0aGlzLm1vZGVsLmVtaXRFdmVudCh0aGlzLnR5cGUsICdpbnB1dFN1Ym1pdFJlcXVlc3QnKTtcbiAgICB9XG4gIH0uYmluZCh0aGlzKSwgZmFsc2UpO1xufTtcblxuQmFzZUlucHV0LnByb3RvdHlwZS5fYWRkRE9NSW5wdXRMaXN0ZW5lcnMgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnVwZGF0ZU1vZGVsKCd2YWx1ZScsIHRoaXMuZ2V0VW5mb3JtYXR0ZWRWYWx1ZSgpKTtcbiAgfS5iaW5kKHRoaXMpLCBmYWxzZSk7XG59O1xuXG5CYXNlSW5wdXQucHJvdG90eXBlLl9hZGRET01Gb2N1c0xpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGVsZW1lbnQgPSB0aGlzLmVsZW1lbnQ7XG5cbiAgaWYgKCdvbmZvY3VzaW4nIGluIGRvY3VtZW50KSB7XG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzaW4nLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGlmIChldmVudC5mcm9tRWxlbWVudCA9PT0gZWxlbWVudCkgeyByZXR1cm47IH1cbiAgICAgIGlmIChldmVudC5yZWxhdGVkVGFyZ2V0KSB7IHJldHVybjsgfVxuXG4gICAgICBlbGVtZW50LmZvY3VzKCk7XG4gICAgfSwgZmFsc2UpO1xuICB9IGVsc2Uge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgZnVuY3Rpb24gKCkge1xuICAgICAgZWxlbWVudC5mb2N1cygpO1xuICAgIH0sIGZhbHNlKTtcbiAgfVxuXG4gIGdsb2JhbC5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5zaG91bGRNYXNrKSB7XG4gICAgICB0aGlzLnVubWFza1ZhbHVlKCk7XG4gICAgfVxuICAgIHRoaXMudXBkYXRlTW9kZWwoJ2lzRm9jdXNlZCcsIHRydWUpO1xuICB9LmJpbmQodGhpcyksIGZhbHNlKTtcblxuICBnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5zaG91bGRNYXNrKSB7XG4gICAgICB0aGlzLm1hc2tWYWx1ZSgpO1xuICAgIH1cbiAgICB0aGlzLnVwZGF0ZU1vZGVsKCdpc0ZvY3VzZWQnLCBmYWxzZSk7XG4gIH0uYmluZCh0aGlzKSwgZmFsc2UpO1xuXG4gIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIGZ1bmN0aW9uICgpIHtcbiAgICBlbGVtZW50LnNlbGVjdCgpO1xuICB9KTtcbn07XG5cbkJhc2VJbnB1dC5wcm90b3R5cGUuYWRkTW9kZWxFdmVudExpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5tb2RlbE9uQ2hhbmdlKCdpc1ZhbGlkJywgdGhpcy5yZW5kZXIpO1xuICB0aGlzLm1vZGVsT25DaGFuZ2UoJ2lzUG90ZW50aWFsbHlWYWxpZCcsIHRoaXMucmVuZGVyKTtcbn07XG5cbkJhc2VJbnB1dC5wcm90b3R5cGUuc2V0UGxhY2Vob2xkZXIgPSBmdW5jdGlvbiAodHlwZSwgcGxhY2Vob2xkZXIpIHtcbiAgdGhpcy50eXBlLnNldEF0dHJpYnV0ZSh0eXBlLCAncGxhY2Vob2xkZXInLCBwbGFjZWhvbGRlcik7XG59O1xuXG5CYXNlSW5wdXQucHJvdG90eXBlLnNldEF0dHJpYnV0ZSA9IGZ1bmN0aW9uICh0eXBlLCBhdHRyaWJ1dGUsIHZhbHVlKSB7XG4gIGlmICh0eXBlID09PSB0aGlzLnR5cGUgJiYgIWF0dHJpYnV0ZVZhbGlkYXRpb25FcnJvcihhdHRyaWJ1dGUsIHZhbHVlKSkge1xuICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlLCB2YWx1ZSk7XG4gIH1cbn07XG5cbkJhc2VJbnB1dC5wcm90b3R5cGUuc2V0UGF0dGVybiA9IGZ1bmN0aW9uIChwYXR0ZXJuKSB7XG4gIGlmIChwYXR0ZXJuKSB0aGlzLnBhdHRlcm4gPSBwYXR0ZXJuO1xuICB0aGlzLmZvcm1hdHRlci5zZXRQYXR0ZXJuKHRoaXMucGF0dGVybik7XG59O1xuXG5CYXNlSW5wdXQucHJvdG90eXBlLnJlbW92ZUF0dHJpYnV0ZSA9IGZ1bmN0aW9uICh0eXBlLCBhdHRyaWJ1dGUpIHtcbiAgaWYgKHR5cGUgPT09IHRoaXMudHlwZSAmJiAhYXR0cmlidXRlVmFsaWRhdGlvbkVycm9yKGF0dHJpYnV0ZSkpIHtcbiAgICB0aGlzLmVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKGF0dHJpYnV0ZSk7XG4gIH1cbn07XG5cbkJhc2VJbnB1dC5wcm90b3R5cGUuYWRkQnVzRXZlbnRMaXN0ZW5lcnMgPSBmdW5jdGlvbiAoKSB7XG4gIGdsb2JhbC5idXMub24oZXZlbnRzLlRSSUdHRVJfSU5QVVRfRk9DVVMsIGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgaWYgKHR5cGUgPT09IHRoaXMudHlwZSkgeyB0aGlzLmVsZW1lbnQuZm9jdXMoKTsgfVxuICB9LmJpbmQodGhpcykpO1xuXG4gIGdsb2JhbC5idXMub24oZXZlbnRzLlNFVF9BVFRSSUJVVEUsIHRoaXMuc2V0QXR0cmlidXRlLmJpbmQodGhpcykpO1xuICBnbG9iYWwuYnVzLm9uKGV2ZW50cy5SRU1PVkVfQVRUUklCVVRFLCB0aGlzLnJlbW92ZUF0dHJpYnV0ZS5iaW5kKHRoaXMpKTtcblxuICBnbG9iYWwuYnVzLm9uKGV2ZW50cy5BRERfQ0xBU1MsIGZ1bmN0aW9uICh0eXBlLCBjbGFzc25hbWUpIHtcbiAgICBpZiAodHlwZSA9PT0gdGhpcy50eXBlKSB7IGNsYXNzbGlzdC5hZGQodGhpcy5lbGVtZW50LCBjbGFzc25hbWUpOyB9XG4gIH0uYmluZCh0aGlzKSk7XG5cbiAgZ2xvYmFsLmJ1cy5vbihldmVudHMuUkVNT1ZFX0NMQVNTLCBmdW5jdGlvbiAodHlwZSwgY2xhc3NuYW1lKSB7XG4gICAgaWYgKHR5cGUgPT09IHRoaXMudHlwZSkgeyBjbGFzc2xpc3QucmVtb3ZlKHRoaXMuZWxlbWVudCwgY2xhc3NuYW1lKTsgfVxuICB9LmJpbmQodGhpcykpO1xuXG4gIGdsb2JhbC5idXMub24oZXZlbnRzLkNMRUFSX0ZJRUxELCBmdW5jdGlvbiAodHlwZSkge1xuICAgIGlmICh0eXBlID09PSB0aGlzLnR5cGUpIHtcbiAgICAgIHRoaXMuZWxlbWVudC52YWx1ZSA9ICcnO1xuICAgICAgdGhpcy5oaWRkZW5NYXNrZWRWYWx1ZSA9ICcnO1xuICAgICAgdGhpcy51cGRhdGVNb2RlbCgndmFsdWUnLCAnJyk7XG4gICAgfVxuICB9LmJpbmQodGhpcykpO1xufTtcblxuQmFzZUlucHV0LnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBtb2RlbERhdGEgPSB0aGlzLm1vZGVsLmdldCh0aGlzLnR5cGUpO1xuICB2YXIgaXNWYWxpZCA9IG1vZGVsRGF0YS5pc1ZhbGlkO1xuICB2YXIgaXNQb3RlbnRpYWxseVZhbGlkID0gbW9kZWxEYXRhLmlzUG90ZW50aWFsbHlWYWxpZDtcblxuICBjbGFzc2xpc3QudG9nZ2xlKHRoaXMuZWxlbWVudCwgJ3ZhbGlkJywgaXNWYWxpZCk7XG4gIGNsYXNzbGlzdC50b2dnbGUodGhpcy5lbGVtZW50LCAnaW52YWxpZCcsICFpc1BvdGVudGlhbGx5VmFsaWQpO1xuXG4gIGlmICh0aGlzLm1heExlbmd0aCkge1xuICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ21heGxlbmd0aCcsIHRoaXMubWF4TGVuZ3RoKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIEJhc2VJbnB1dDogQmFzZUlucHV0XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGNvbnN0YW50cyA9IHJlcXVpcmUoJy4uLy4uL3NoYXJlZC9jb25zdGFudHMnKTtcblxudmFyIFVOS05PV05fQ0FSRF9CUkFORCA9ICd1bmtub3duJztcbnZhciBjYXJkQnJhbmRNYXAgPSBjb25zdGFudHMuY2FyZEJyYW5kTWFwO1xuXG5mdW5jdGlvbiBDYXJkQnJhbmRJY29uQ29tcG9uZW50KG9wdGlvbnMpIHtcbiAgdGhpcy5tb2RlbCA9IG9wdGlvbnMuY2FyZEZvcm07XG4gIHRoaXMuZWxlbWVudCA9IHRoaXMuY29uc3RydWN0RWxlbWVudCgpO1xuICB0aGlzLmNhcmRCcmFuZCA9IFVOS05PV05fQ0FSRF9CUkFORDtcblxuICB0aGlzLmFkZE1vZGVsRXZlbnRMaXN0ZW5lcnMoKTtcbiAgdGhpcy5yZW5kZXIodGhpcy5jYXJkQnJhbmQpO1xufVxuXG5DYXJkQnJhbmRJY29uQ29tcG9uZW50LnByb3RvdHlwZS5jb25zdHJ1Y3RFbGVtZW50ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgY2FyZEJyYW5kSWNvbkNvbnRhaW5lckVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgY2FyZEJyYW5kSWNvbkNvbnRhaW5lckVsZW1lbnQuY2xhc3NOYW1lID0gJ2NhcmQtYnJhbmQtY29udGFpbmVyJztcbiAgcmV0dXJuIGNhcmRCcmFuZEljb25Db250YWluZXJFbGVtZW50O1xufVxuXG5DYXJkQnJhbmRJY29uQ29tcG9uZW50LnByb3RvdHlwZS5hZGRNb2RlbEV2ZW50TGlzdGVuZXJzID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLm1vZGVsLm9uKCdjaGFuZ2U6cG9zc2libGVDYXJkVHlwZXMnLCBmdW5jdGlvbiAoY2FyZFR5cGVzKSB7XG4gICAgdmFyIGFjY291bnROdW1iZXIgPSB0aGlzLm1vZGVsLmdldCgnYWNjb3VudE51bWJlci52YWx1ZScpO1xuICAgIGlmIChjYXJkVHlwZXMubGVuZ3RoID4gMCAmJiBhY2NvdW50TnVtYmVyLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuY2FyZEJyYW5kID0gY2FyZEJyYW5kTWFwW2NhcmRUeXBlc1swXS50eXBlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jYXJkQnJhbmQgPSBVTktOT1dOX0NBUkRfQlJBTkQ7XG4gICAgfVxuICAgIHRoaXMucmVuZGVyKHRoaXMuY2FyZEJyYW5kKTtcbiAgfS5iaW5kKHRoaXMpKTtcbn07XG5cbkNhcmRCcmFuZEljb25Db21wb25lbnQucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uIChjYXJkQnJhbmQpIHtcbiAgdmFyIGNhcmRCcmFuZEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcblxuICBjYXJkQnJhbmRFbGVtZW50LnNldEF0dHJpYnV0ZSgncm9sZScsICdwcmVzZW50YXRpb24nKTtcbiAgY2FyZEJyYW5kRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3NyYycsICdpbWcvJyArIGNhcmRCcmFuZCArICcuc3ZnJyk7XG5cbiAgdGhpcy5lbGVtZW50LmlubmVySFRNTCA9ICcnO1xuICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQoY2FyZEJyYW5kRWxlbWVudCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgQ2FyZEJyYW5kSWNvbkNvbXBvbmVudDogQ2FyZEJyYW5kSWNvbkNvbXBvbmVudFxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIEJhc2VJbnB1dCA9IHJlcXVpcmUoJy4vYmFzZS1pbnB1dCcpLkJhc2VJbnB1dDtcbnZhciBQQVRURVJOX0NBQ0hFID0ge307XG5cbmZ1bmN0aW9uIF9nZW5lcmF0ZVBhdHRlcm4obGVuZ3RoKSB7XG4gIHZhciBpO1xuICB2YXIgcGF0dGVybiA9ICd7eyc7XG5cbiAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgcGF0dGVybiArPSAnOSc7XG4gIH1cblxuICByZXR1cm4gcGF0dGVybiArICd9fSc7XG59XG5cbmZ1bmN0aW9uIF9nZXRQYXR0ZXJuKGxlbmd0aCkge1xuICBpZiAoIShsZW5ndGggaW4gUEFUVEVSTl9DQUNIRSkpIHtcbiAgICBQQVRURVJOX0NBQ0hFW2xlbmd0aF0gPSBfZ2VuZXJhdGVQYXR0ZXJuKGxlbmd0aCk7XG4gIH1cbiAgcmV0dXJuIFBBVFRFUk5fQ0FDSEVbbGVuZ3RoXTtcbn1cblxuZnVuY3Rpb24gQ1ZWSW5wdXQoKSB7XG4gIHZhciBsZW5ndGg7XG5cbiAgQmFzZUlucHV0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgdmFyIERFRkFVTFRfTUFYX0xFTkdUSCA9IHRoaXMubWF4TGVuZ3RoO1xuICBsZW5ndGggPSB0aGlzLmdldENvbmZpZ3VyYXRpb24oKS5tYXhsZW5ndGg7XG5cbiAgaWYgKGxlbmd0aCAmJiBsZW5ndGggPCB0aGlzLm1heExlbmd0aCkge1xuICAgIHRoaXMubWF4TGVuZ3RoID0gbGVuZ3RoO1xuICB9IGVsc2Uge1xuICAgIHRoaXMubW9kZWwub24oJ2NoYW5nZTpwb3NzaWJsZUNhcmRUeXBlcycsIGZ1bmN0aW9uIChwb3NzaWJsZUNhcmRUeXBlcykge1xuICAgICAgdGhpcy5tYXhMZW5ndGggPSBwb3NzaWJsZUNhcmRUeXBlcy5yZWR1Y2UoZnVuY3Rpb24gKGFjY3VtLCBjYXJkVHlwZSkge1xuICAgICAgICByZXR1cm4gTWF0aC5tYXgoYWNjdW0sIGNhcmRUeXBlLmNvZGUuc2l6ZSk7XG4gICAgICB9LCAwKSB8fCBERUZBVUxUX01BWF9MRU5HVEg7XG5cbiAgICAgIHRoaXMubW9kZWwuX3ZhbGlkYXRlRmllbGQodGhpcy50eXBlKTtcblxuICAgICAgaWYgKHRoaXMuc2hvdWxkTWFzaykge1xuICAgICAgICB0aGlzLm1hc2tWYWx1ZSh0aGlzLmhpZGRlbk1hc2tlZFZhbHVlLnN1YnN0cmluZygwLCB0aGlzLm1heExlbmd0aCkpO1xuICAgICAgICB0aGlzLnVwZGF0ZU1vZGVsKCd2YWx1ZScsIHRoaXMuaGlkZGVuTWFza2VkVmFsdWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy51cGRhdGVNb2RlbCgndmFsdWUnLCB0aGlzLmZvcm1hdHRlci5nZXRVbmZvcm1hdHRlZFZhbHVlKCkpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH0uYmluZCh0aGlzKSk7XG4gIH1cblxuICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKCdtYXhsZW5ndGgnLCB0aGlzLm1heExlbmd0aCk7XG4gIHRoaXMuc2V0UGF0dGVybihfZ2V0UGF0dGVybih0aGlzLm1heExlbmd0aCkpO1xufVxuXG5DVlZJbnB1dC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEJhc2VJbnB1dC5wcm90b3R5cGUpO1xuQ1ZWSW5wdXQucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQ1ZWSW5wdXQ7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBDVlZJbnB1dDogQ1ZWSW5wdXRcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBCYXNlSW5wdXQgPSByZXF1aXJlKCcuL2Jhc2UtaW5wdXQnKS5CYXNlSW5wdXQ7XG5cbnZhciBERUZBVUxUX1BBVFRFUk4gPSAne3s5OX19IC8ge3s5OX19JztcbnZhciBaRVJPX1BBRERFRF9QQVRURVJOID0gJzB7ezl9fSAvIHt7OTl9fSc7XG5cbmZ1bmN0aW9uIEV4cGlyYXRpb25EYXRlSW5wdXQoKSB7XG5cbiAgQmFzZUlucHV0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIHRoaXMuc2V0UGF0dGVybihERUZBVUxUX1BBVFRFUk4pO1xuXG4gIHRoaXMubW9kZWwub24oJ2NoYW5nZTpleHBEYXRlLnZhbHVlJywgZnVuY3Rpb24gKGRhdGUpIHtcbiAgICBpZiAoZGF0ZS5sZW5ndGggPT09IDAgfHwgZGF0ZVswXSA9PT0gJzAnIHx8IGRhdGVbMF0gPT09ICcxJykge1xuICAgICAgdGhpcy5zZXRQYXR0ZXJuKERFRkFVTFRfUEFUVEVSTik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0UGF0dGVybihaRVJPX1BBRERFRF9QQVRURVJOKTtcbiAgICB9XG4gIH0uYmluZCh0aGlzKSk7XG59XG5cbkV4cGlyYXRpb25EYXRlSW5wdXQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShCYXNlSW5wdXQucHJvdG90eXBlKTtcbkV4cGlyYXRpb25EYXRlSW5wdXQucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gRXhwaXJhdGlvbkRhdGVJbnB1dDtcblxuRXhwaXJhdGlvbkRhdGVJbnB1dC5wcm90b3R5cGUuZ2V0VW5mb3JtYXR0ZWRWYWx1ZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGRhdGUsIG1vbnRoLCB5ZWFyO1xuICB2YXIgdmFsdWUgPSB0aGlzLmZvcm1hdHRlci5nZXRVbmZvcm1hdHRlZFZhbHVlKCk7XG5cbiAgaWYgKHRoaXMuZWxlbWVudC50eXBlID09PSAnbW9udGgnKSB7XG4gICAgZGF0ZSA9IHZhbHVlLnNwbGl0KCctJyk7XG4gICAgbW9udGggPSBkYXRlWzFdIHx8ICcnO1xuICAgIHllYXIgPSBkYXRlWzBdIHx8ICcnO1xuICAgIHZhbHVlID0gbW9udGggKyB5ZWFyO1xuICB9XG5cbiAgcmV0dXJuIHZhbHVlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIEV4cGlyYXRpb25EYXRlSW5wdXQ6IEV4cGlyYXRpb25EYXRlSW5wdXRcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBJbnB1dENvbXBvbmVudHMgPSByZXF1aXJlKCcuL2luZGV4Jyk7XG52YXIgQ2FyZEJyYW5kSWNvbkNvbXBvbmVudCA9IHJlcXVpcmUoJy4vY2FyZC1icmFuZC1pY29uJykuQ2FyZEJyYW5kSWNvbkNvbXBvbmVudDtcbnZhciBMYWJlbENvbXBvbmVudCA9IHJlcXVpcmUoJy4vbGFiZWwnKS5MYWJlbENvbXBvbmVudDtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIEZpZWxkQ29tcG9uZW50OiBmdW5jdGlvbiBGaWVsZENvbXBvbmVudChvcHRpb25zKSB7XG4gICAgdmFyIGNvbnRlbnQ7XG4gICAgdmFyIHR5cGUgPSBvcHRpb25zLnR5cGU7XG4gICAgdmFyIGNhcmRGb3JtID0gb3B0aW9ucy5jYXJkRm9ybTtcbiAgICB2YXIgd2hpdGVsaXN0ZWRGaWVsZHMgPSBjYXJkRm9ybS5nZXRXaGl0ZWxpc3RlZEZpZWxkcygpO1xuICAgIHZhciBhdHRyaWJ1dGlvbiA9IHdoaXRlbGlzdGVkRmllbGRzW3R5cGVdO1xuXG4gICAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgIHRoaXMubGFiZWwgPSBuZXcgTGFiZWxDb21wb25lbnQoYXR0cmlidXRpb24pO1xuICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmxhYmVsLmVsZW1lbnQpO1xuXG4gICAgdGhpcy5pbnB1dCA9IG5ldyBJbnB1dENvbXBvbmVudHNbdHlwZV0oe1xuICAgICAgbW9kZWw6IGNhcmRGb3JtLFxuICAgICAgdHlwZTogdHlwZVxuICAgIH0pO1xuICAgIHRoaXMuaW5wdXQuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknLCAnZmllbGQtZGVzY3JpcHRpb24tJyArIHR5cGUpO1xuXG4gICAgaWYgKHR5cGUgPT09ICdhY2NvdW50TnVtYmVyJykge1xuICAgICAgdmFyIGNvbnRhaW5lckVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGNvbnRhaW5lckVsZW1lbnQuY2xhc3NOYW1lID0gJ2FjY291bnQtbnVtYmVyLWNvbnRhaW5lcic7XG4gICAgICB0aGlzLmNhcmRCcmFuZEljb24gPSBuZXcgQ2FyZEJyYW5kSWNvbkNvbXBvbmVudCh7IGNhcmRGb3JtOiBjYXJkRm9ybSB9KTtcbiAgICAgIGNvbnRhaW5lckVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5pbnB1dC5lbGVtZW50KTtcbiAgICAgIGNvbnRhaW5lckVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5jYXJkQnJhbmRJY29uLmVsZW1lbnQpO1xuICAgICAgY29udGVudCA9IGNvbnRhaW5lckVsZW1lbnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnRlbnQgPSB0aGlzLmlucHV0LmVsZW1lbnQ7XG4gICAgfVxuXG4gICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKGNvbnRlbnQpO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgLyoqKioqKioqKioqKioqKioqKioqKioqKiovXG4gIC8qIFRPS0VOSVpFUiAoUEFOLVZBVUxUKSAqL1xuICAvKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgLy8gQ3JlZGl0IENhcmQgZmllbGRzIChwYXltZW50VHlwZT1DUkVESVQpOlxuICBleHBEYXRlOiByZXF1aXJlKCcuL2V4cGlyYXRpb24tZGF0ZS1pbnB1dCcpLkV4cGlyYXRpb25EYXRlSW5wdXQsXG5cbiAgLy8gQ29tbW9uIGZpZWxkczpcbiAgYWNjb3VudE51bWJlcjogcmVxdWlyZSgnLi9hY2NvdW50LW51bWJlci1pbnB1dCcpLkFjY291bnROdW1iZXJJbnB1dCxcbiAgdmVyaWZ5QWNjb3VudE51bWJlcjogcmVxdWlyZSgnLi9hY2NvdW50LW51bWJlci1pbnB1dCcpLkFjY291bnROdW1iZXJJbnB1dCxcbiAgcG9zdGFsQ29kZTogcmVxdWlyZSgnLi9wb3N0YWwtY29kZS1pbnB1dCcpLlBvc3RhbENvZGVJbnB1dCxcbiAgY3Z2OiByZXF1aXJlKCcuL2N2di1pbnB1dCcpLkNWVklucHV0LFxuICBuYW1lOiByZXF1aXJlKCcuL25hbWUtaW5wdXQnKS5OYW1lSW5wdXRcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIExhYmVsQ29tcG9uZW50KG9wdGlvbnMpIHtcbiAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcblxuICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKCdmb3InLCBvcHRpb25zLm5hbWUpO1xuICB0aGlzLmVsZW1lbnQuaW5uZXJIVE1MID0gb3B0aW9ucy5sYWJlbDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIExhYmVsQ29tcG9uZW50OiBMYWJlbENvbXBvbmVudFxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIEJhc2VJbnB1dCA9IHJlcXVpcmUoJy4vYmFzZS1pbnB1dCcpLkJhc2VJbnB1dDtcblxuZnVuY3Rpb24gTmFtZUlucHV0KCkge1xuICBCYXNlSW5wdXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgdGhpcy5zZXRQYXR0ZXJuKCd7eycgKyAobmV3IEFycmF5KHRoaXMubWF4TGVuZ3RoICsgMSkuam9pbignKicpKSArICd9fScpO1xuICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQnKTtcbn1cblxuTmFtZUlucHV0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQmFzZUlucHV0LnByb3RvdHlwZSk7XG5OYW1lSW5wdXQucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gTmFtZUlucHV0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgTmFtZUlucHV0OiBOYW1lSW5wdXRcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBCYXNlSW5wdXQgPSByZXF1aXJlKCcuL2Jhc2UtaW5wdXQnKS5CYXNlSW5wdXQ7XG5cbmZ1bmN0aW9uIFBvc3RhbENvZGVJbnB1dCgpIHtcblxuICBCYXNlSW5wdXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICB2YXIgZGVmYXVsdFZhbHVlID0gdGhpcy5nZXRDb25maWd1cmF0aW9uKCkuZGVmYXVsdFZhbHVlO1xuICB2YXIgdHlwZSA9IHRoaXMuZ2V0Q29uZmlndXJhdGlvbigpLnR5cGUgfHwgJ3RleHQnO1xuICBpZiAoZGVmYXVsdFZhbHVlKSB7XG4gICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZSgndmFsdWUnLCBkZWZhdWx0VmFsdWUpO1xuICB9XG5cbiAgdGhpcy5zZXRQYXR0ZXJuKCd7eyoqKioqKioqKip9fScpO1xuICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKCd0eXBlJywgdHlwZSk7XG4gIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5nZXRGb3JjZU51bWVyaWNLZXlib2FyZCh0eXBlKSwgZmFsc2UpO1xufVxuXG5Qb3N0YWxDb2RlSW5wdXQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShCYXNlSW5wdXQucHJvdG90eXBlKTtcblBvc3RhbENvZGVJbnB1dC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBQb3N0YWxDb2RlSW5wdXQ7XG5cblBvc3RhbENvZGVJbnB1dC5wcm90b3R5cGUuZ2V0Rm9yY2VOdW1lcmljS2V5Ym9hcmQgPSBmdW5jdGlvbiAodHlwZSkge1xuICByZXR1cm4gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgdmFyIHZhbHVlID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgIGV2ZW50LnRhcmdldC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnbnVtYmVyJyk7XG5cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgZXZlbnQudGFyZ2V0LnNldEF0dHJpYnV0ZSgndHlwZScsIHR5cGUpO1xuICAgICAgZXZlbnQudGFyZ2V0LnZhbHVlID0gdmFsdWU7XG4gICAgfSwgMjAwKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgUG9zdGFsQ29kZUlucHV0OiBQb3N0YWxDb2RlSW5wdXRcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBhc3NpZ24gPSByZXF1aXJlKCcuLi8uLi9saWIvYXNzaWduJykuYXNzaWduO1xudmFyIEJ1cyA9IHJlcXVpcmUoJy4uLy4uL2xpYi9idXMnKTtcbnZhciBmcmFtZU5hbWUgPSByZXF1aXJlKCcuLi8uLi9saWIvZ2V0LWZyYW1lLW5hbWUnKTtcbnZhciBhc3NlbWJsZUlGcmFtZXMgPSByZXF1aXJlKCcuLi8uLi9saWIvYXNzZW1ibGUtaWZyYW1lcycpO1xudmFyIENsaWVudCA9IHJlcXVpcmUoJy4uLy4uL2NsaWVudC9jbGllbnQnKTtcbnZhciBpbmplY3RXaXRoQWxsb3dsaXN0ID0gcmVxdWlyZSgnaW5qZWN0LXN0eWxlc2hlZXQnKS5pbmplY3RXaXRoQWxsb3dsaXN0O1xudmFyIENyZWRpdENhcmRGb3JtID0gcmVxdWlyZSgnLi9tb2RlbHMvY3JlZGl0LWNhcmQtZm9ybScpLkNyZWRpdENhcmRGb3JtO1xudmFyIEZpZWxkQ29tcG9uZW50ID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2ZpZWxkLWNvbXBvbmVudCcpLkZpZWxkQ29tcG9uZW50O1xudmFyIFNlYW1sZXNzcGF5RXJyb3IgPSByZXF1aXJlKCcuLi8uLi9saWIvc2VhbWxlc3NwYXktZXJyb3InKTtcbnZhciBjb25zdGFudHMgPSByZXF1aXJlKCcuLi9zaGFyZWQvY29uc3RhbnRzJyk7XG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi4vc2hhcmVkL2Vycm9ycycpO1xudmFyIHJlcXVlc3RzU2VxdWVuY2UgPSByZXF1aXJlKCcuLi8uLi9saWIvcmVxdWVzdHMtc2VxdWVuY2UnKTtcblxudmFyIGV2ZW50cyA9IGNvbnN0YW50cy5ldmVudHM7XG52YXIgd2hpdGVsaXN0ZWRTdHlsZXMgPSBjb25zdGFudHMud2hpdGVsaXN0ZWRTdHlsZXM7XG52YXIgcmVxdWVzdFR5cGVzID0gY29uc3RhbnRzLnJlcXVlc3RUeXBlcztcblxudmFyIFRJTUVPVVRfVE9fQUxMT1dfU0FGQVJJX1RPX0FVVE9GSUxMID0gNTtcblxuZnVuY3Rpb24gaW5pdGlhbGl6ZShjYXJkRm9ybSkge1xuICB2YXIgZmllbGRDb21wb25lbnQ7XG4gIHZhciBuYW1lID0gZnJhbWVOYW1lLmdldEZyYW1lTmFtZSgnaG9zdGVkLWZpZWxkJyk7XG4gIHZhciBmb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZm9ybScpO1xuXG4gIHZhciBkZWZhdWx0U3R5bGVzID0ge1xuICAgICcudmFsaWQnOiB7IGNvbG9yOiAnZ3JlZW4nIH0sXG4gICAgJy5pbnZhbGlkJzogeyBjb2xvcjogJ3JlZCcgfSxcbiAgICAnLnBvdGVudGlhbGx5LXZhbGlkJzogeyBjb2xvcjogJ2JsYWNrJyB9LFxuICB9O1xuXG4gIGZvcm0uc2V0QXR0cmlidXRlKCdub3ZhbGlkYXRlJywgdHJ1ZSk7XG4gIGZvcm0uc2V0QXR0cmlidXRlKCdhY3Rpb24nLCAnIycpOyAvLyBGb3JtcyBuZWVkIGFuIGFjdGlvbiBpbiBvcmRlciB0byBvZmZlciBhIFwiZ29cIiBidXR0b24gb24gc29mdCBrZXlib2FyZFxuICBmb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIH0pO1xuXG4gIGluamVjdFdpdGhBbGxvd2xpc3QoXG4gICAgT2JqZWN0LmFzc2lnbihkZWZhdWx0U3R5bGVzLCBjYXJkRm9ybS5jb25maWd1cmF0aW9uLnN0eWxlcyksXG4gICAgd2hpdGVsaXN0ZWRTdHlsZXNcbiAgKTtcblxuICBmaWVsZENvbXBvbmVudCA9IG5ldyBGaWVsZENvbXBvbmVudCh7XG4gICAgY2FyZEZvcm06IGNhcmRGb3JtLFxuICAgIHR5cGU6IG5hbWVcbiAgfSk7XG5cbiAgZm9ybS5hcHBlbmRDaGlsZChmaWVsZENvbXBvbmVudC5lbGVtZW50KTtcbiAgaWYgKG5hbWUgPT09ICdhY2NvdW50TnVtYmVyJykge1xuICAgIGNyZWF0ZUlucHV0c0ZvckF1dG9maWxsKGZvcm0pO1xuICB9XG5cbiAgZ2xvYmFsLmJ1cy5vbihldmVudHMuQVVUT0ZJTExfRVhQSVJBVElPTl9EQVRFLCBhdXRvZmlsbEhhbmRsZXIoZmllbGRDb21wb25lbnQpKTtcblxuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGZvcm0pO1xuICBzaGltUGxhY2Vob2xkZXIoKTtcbn1cblxuZnVuY3Rpb24gbWFrZU1vY2tJbnB1dChuYW1lKSB7XG4gIHZhciBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgdmFyIGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgdmFyIGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcblxuICBsYWJlbC5zZXRBdHRyaWJ1dGUoJ2ZvcicsIG5hbWUgKyAnLWF1dG9maWxsLWZpZWxkJyk7XG4gIGxhYmVsLnRleHRDb250ZW50ID0gbmFtZTtcblxuICBpbnB1dC5pZCA9IG5hbWUgKyAnLWF1dG9maWxsLWZpZWxkJztcbiAgaW5wdXQuY2xhc3NOYW1lID0gJ2F1dG9maWxsLWZpZWxkJztcbiAgaW5wdXQudHlwZSA9ICd0ZXh0JztcbiAgaW5wdXQubmFtZSA9IG5hbWU7XG4gIGlucHV0LnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAtMSk7XG4gIGlucHV0LnNldEF0dHJpYnV0ZSgnYXV0b2NvbXBsZXRlJywgY29uc3RhbnRzLmF1dG9jb21wbGV0ZU1hcHBpbmdzW25hbWVdKTtcblxuICBmcmFnbWVudC5hcHBlbmRDaGlsZChsYWJlbCk7XG4gIGZyYWdtZW50LmFwcGVuZENoaWxkKGlucHV0KTtcblxuICByZXR1cm4gZnJhZ21lbnQ7XG59XG5cbmZ1bmN0aW9uIGZpeDFQYXNzd29yZEFkanVzdG1lbnQoZm9ybSkge1xuICAvLyAxUGFzc3dvcmQgYXV0b2ZpbGwgdGhyb3dzIHRoZSBmb3JtXG4gIC8vIHBvc2l0aW9uaW5nIG9mZiBzY3JlZW4uIEJ5IHRvZ2dsaW5nXG4gIC8vIHRoZSBwb3NpdGlvbiwgd2UgY2FuIHByZXZlbnQgdGhlIG51bWJlclxuICAvLyBmaWVsZCBmcm9tIGRpc3NhcGVhcmluZ1xuICBmb3JtLnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcbiAgZm9ybS5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUlucHV0c0ZvckF1dG9maWxsKGZvcm0pIHtcbiAgdmFyIGV4cERhdGUgPSBtYWtlTW9ja0lucHV0KCdleHAtZGF0ZScpO1xuICB2YXIgY3Z2ID0gbWFrZU1vY2tJbnB1dCgnY3Z2Jyk7XG4gIHZhciBleHBEYXRlSW5wdXQgPSBleHBEYXRlLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0Jyk7XG4gIHZhciBjdnZJbnB1dCA9IGN2di5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpO1xuXG4gIGV4cERhdGVJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZnVuY3Rpb24gKCkge1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgZml4MVBhc3N3b3JkQWRqdXN0bWVudChmb3JtKTtcbiAgICAgIGdsb2JhbC5idXMuZW1pdChldmVudHMuQVVUT0ZJTExfRVhQSVJBVElPTl9EQVRFLCB7XG4gICAgICAgIGV4cERhdGU6IGV4cERhdGVJbnB1dC52YWx1ZSxcbiAgICAgICAgY3Z2OiBjdnZJbnB1dC52YWx1ZVxuICAgICAgfSk7XG4gICAgfSwgVElNRU9VVF9UT19BTExPV19TQUZBUklfVE9fQVVUT0ZJTEwpO1xuICB9KTtcblxuICBmb3JtLmFwcGVuZENoaWxkKGV4cERhdGUpO1xuICBmb3JtLmFwcGVuZENoaWxkKGN2dik7XG59XG5cbmZ1bmN0aW9uIGF1dG9maWxsSGFuZGxlcihmaWVsZENvbXBvbmVudCkge1xuICByZXR1cm4gZnVuY3Rpb24gKHBheWxvYWQpIHtcbiAgICB2YXIgbmFtZSwgdmFsdWUsIGV4cERhdGUsIGN2djtcblxuICAgIGlmICghcGF5bG9hZCB8fCAhcGF5bG9hZC5leHBEYXRlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbmFtZSA9IGZyYW1lTmFtZS5nZXRGcmFtZU5hbWUoJ2hvc3RlZC1maWVsZCcpO1xuICAgIGV4cERhdGUgPSBwYXlsb2FkLmV4cERhdGU7XG4gICAgY3Z2ID0gcGF5bG9hZC5jdnY7XG5cbiAgICBpZiAobmFtZSA9PT0gJ2V4cERhdGUnKSB7XG4gICAgICB2YWx1ZSA9IGV4cERhdGU7XG4gICAgfSBlbHNlIGlmIChuYW1lID09PSAnY3Z2JyAmJiBjdnYpIHtcbiAgICAgIHZhbHVlID0gY3Z2O1xuICAgIH1cblxuICAgIGlmICh2YWx1ZSkge1xuICAgICAgZmllbGRDb21wb25lbnQuaW5wdXQudXBkYXRlTW9kZWwoJ3ZhbHVlJywgdmFsdWUpO1xuXG4gICAgICBpZiAoZmllbGRDb21wb25lbnQuaW5wdXQuc2hvdWxkTWFzaykge1xuICAgICAgICBmaWVsZENvbXBvbmVudC5pbnB1dC5tYXNrVmFsdWUodmFsdWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZmllbGRDb21wb25lbnQuaW5wdXQuZWxlbWVudC52YWx1ZSA9IHZhbHVlO1xuICAgICAgfVxuXG4gICAgICByZXNldFBsYWNlaG9sZGVyKGZpZWxkQ29tcG9uZW50LmlucHV0LmVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gcmVzZXRQbGFjZWhvbGRlcihlbGVtZW50KSB7XG4gIC8vIFNhZmFyaSBsZWF2ZXMgdGhlIHBsYWNob2xkZXIgdmlzaWJsZSBpbiB0aGUgaWZyYW1lLCB3ZVxuICAvLyBjb21wZW5zYXRlIGZvciB0aGlzIGJ5IHJlbW92aW5nIGFuZCByZS1zZXR0aW5nIHRoZSBwbGFjZWhvbGRlclxuICB2YXIgcGxhY2Vob2xkZXIgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgncGxhY2Vob2xkZXInKTtcblxuICBpZiAocGxhY2Vob2xkZXIpIHtcbiAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgncGxhY2Vob2xkZXInLCAnJyk7XG4gICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3BsYWNlaG9sZGVyJywgcGxhY2Vob2xkZXIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNoaW1QbGFjZWhvbGRlcigpIHtcbiAgdmFyIGlucHV0O1xuXG4gIGlmICghZ2xvYmFsLnBsYWNlaG9sZGVyU2hpbSkgeyByZXR1cm47IH1cblxuICBpbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0Jyk7XG4gIGlmICghaW5wdXQpIHsgcmV0dXJuOyB9XG5cbiAgZ2xvYmFsLnBsYWNlaG9sZGVyU2hpbShpbnB1dCk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZSgpIHtcbiAgdmFyIGNvbXBvbmVudElkID0gbG9jYXRpb24uaGFzaC5zbGljZSgxLCBsb2NhdGlvbi5oYXNoLmxlbmd0aCk7XG5cbiAgZ2xvYmFsLmJ1cyA9IG5ldyBCdXMoeyBjaGFubmVsOiBjb21wb25lbnRJZCB9KTtcbiAgZ2xvYmFsLmJ1cy5lbWl0KGV2ZW50cy5GUkFNRV9SRUFEWSwgb3JjaGVzdHJhdGUpO1xufVxuXG5mdW5jdGlvbiBjb21wb3NlVG9rZW5pemVyRXJyb3IgKHJlc3BvbnNlKSB7XG4gIHZhciB0b2tlbml6ZXJFcnJvciwgc3RhdHVzO1xuXG4gIHN0YXR1cyA9IHJlc3BvbnNlLmRldGFpbHMgJiYgcmVzcG9uc2UuZGV0YWlscy5odHRwU3RhdHVzO1xuICBpZiAoc3RhdHVzID09PSA0MDMpIHtcbiAgICB0b2tlbml6ZXJFcnJvciA9IHJlc3BvbnNlO1xuICB9IGVsc2UgaWYgKHN0YXR1cyA8IDUwMCkge1xuICAgIHRva2VuaXplckVycm9yID0gbmV3IFNlYW1sZXNzcGF5RXJyb3IoZXJyb3JzLkhPU1RFRF9GSUVMRFNfRkFJTEVEX1RPS0VOSVpBVElPTik7XG4gICAgdG9rZW5pemVyRXJyb3IuZGV0YWlscyA9IHJlc3BvbnNlLm5hbWUgPT09ICdTZWFtbGVzc3BheUVycm9yJyAmJiByZXNwb25zZS5kZXRhaWxzID8gcmVzcG9uc2UuZGV0YWlsczogeyBvcmlnaW5hbEVycm9yOiByZXNwb25zZSB9O1xuICB9IGVsc2Uge1xuICAgIHRva2VuaXplckVycm9yID0gbmV3IFNlYW1sZXNzcGF5RXJyb3IoZXJyb3JzLkhPU1RFRF9GSUVMRFNfVE9LRU5JWkFUSU9OX05FVFdPUktfRVJST1IpO1xuICAgIHRva2VuaXplckVycm9yLmRldGFpbHMgPSByZXNwb25zZS5uYW1lID09PSAnU2VhbWxlc3NwYXlFcnJvcicgJiYgcmVzcG9uc2UuZGV0YWlscyA/IHJlc3BvbnNlLmRldGFpbHM6IHsgb3JpZ2luYWxFcnJvcjogcmVzcG9uc2UgfTtcbiAgfVxuXG4gIHJldHVybiB0b2tlbml6ZXJFcnJvcjtcbn1cblxuZnVuY3Rpb24gY3JlYXRlVG9rZW5pemF0aW9uSGFuZGxlcihjbGllbnQsIGNhcmRGb3JtKSB7XG4gIHJldHVybiBmdW5jdGlvbiAob3B0aW9ucywgcmVwbHkpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICB2YXIgVE9LRU5JWkFUSU9OID0gcmVxdWVzdFR5cGVzLlJFUVVFU1RfVFlQRV9UT0tFTklaQVRJT047XG4gICAgdmFyIGlzRW1wdHkgPSBjYXJkRm9ybS5pc0VtcHR5KFRPS0VOSVpBVElPTik7XG4gICAgdmFyIGludmFsaWRGaWVsZEtleXMgPSBjYXJkRm9ybS5pbnZhbGlkRmllbGRLZXlzKFRPS0VOSVpBVElPTik7XG4gICAgdmFyIGlzVmFsaWQgPSBpbnZhbGlkRmllbGRLZXlzLmxlbmd0aCA9PT0gMDtcblxuICAgIGlmIChpc0VtcHR5KSB7XG4gICAgICByZXBseShbXG4gICAgICAgIG5ldyBTZWFtbGVzc3BheUVycm9yKGVycm9ycy5IT1NURURfRklFTERTX0ZJRUxEU19FTVBUWSlcbiAgICAgIF0pO1xuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSBpZiAoIWlzVmFsaWQpIHtcbiAgICAgIHJlcGx5KFtcbiAgICAgICAgbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgICAgIHR5cGU6IGVycm9ycy5IT1NURURfRklFTERTX0ZJRUxEU19JTlZBTElELnR5cGUsXG4gICAgICAgICAgY29kZTogZXJyb3JzLkhPU1RFRF9GSUVMRFNfRklFTERTX0lOVkFMSUQuY29kZSxcbiAgICAgICAgICBtZXNzYWdlOiBlcnJvcnMuSE9TVEVEX0ZJRUxEU19GSUVMRFNfSU5WQUxJRC5tZXNzYWdlLFxuICAgICAgICAgIGRldGFpbHM6IHsgaW52YWxpZEZpZWxkS2V5czogaW52YWxpZEZpZWxkS2V5cyB9XG4gICAgICAgIH0pXG4gICAgICBdKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVxdWVzdHNTZXF1ZW5jZShjbGllbnQsIFtcbiAgICAgIHtcbiAgICAgICAgYXBpOiAndG9rZW5pemVyQXBpJyxcbiAgICAgICAgbWV0aG9kOiAncG9zdCcsXG4gICAgICAgIGVuZHBvaW50OiAndG9rZW5zJyxcbiAgICAgICAgZ2V0RGF0YTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBhc3NpZ24oXG4gICAgICAgICAgICBjYXJkRm9ybS5nZXRDYXJkRGF0YSh7IHJlcXVlc3RUeXBlOiBUT0tFTklaQVRJT04sIGV4dHJhRGF0YTogb3B0aW9ucyB9KSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgcGF5bWVudFR5cGU6IGNhcmRGb3JtLmdldFBheW1lbnRUeXBlKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgXSkudGhlbihmdW5jdGlvbiAocmVzdWx0cykge1xuICAgICAgdmFyIHJlc3BvbnNlID0gcmVzdWx0c1swXTtcbiAgICAgIGlmIChyZXNwb25zZSBpbnN0YW5jZW9mIEVycm9yIHx8IChyZXNwb25zZSAmJiByZXNwb25zZS5uYW1lID09PSAnU2VhbWxlc3NwYXlFcnJvcicpKSB7XG4gICAgICAgIHJlcGx5KFtcbiAgICAgICAgICBjb21wb3NlVG9rZW5pemVyRXJyb3IocmVzcG9uc2UpXG4gICAgICAgIF0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVwbHkoW251bGwsIGFzc2lnbih7fSwgcmVzcG9uc2UpXSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIG9yY2hlc3RyYXRlKGNvbmZpZ3VyYXRpb24pIHtcbiAgdmFyIGNsaWVudCA9IG5ldyBDbGllbnQoY29uZmlndXJhdGlvbi5jbGllbnQpO1xuICB2YXIgY2FyZEZvcm0gPSBuZXcgQ3JlZGl0Q2FyZEZvcm0oY29uZmlndXJhdGlvbik7XG4gIHZhciBpZnJhbWVzID0gYXNzZW1ibGVJRnJhbWVzLmFzc2VtYmxlSUZyYW1lcyh3aW5kb3cucGFyZW50KTtcblxuICBpZnJhbWVzLmZvckVhY2goZnVuY3Rpb24gKGlmcmFtZSkge1xuICAgIHRyeSB7XG4gICAgICBpZnJhbWUuc2VhbWxlc3NwYXkuaG9zdGVkRmllbGRzLmluaXRpYWxpemUoY2FyZEZvcm0pO1xuICAgIH0gY2F0Y2ggKGUpIHsgLyogbm9vcCAqLyB9XG4gIH0pO1xuXG4gIGNhcmRGb3JtLnNldHVwUmVsYXRlZEZpZWxkc0J5Q29uZmlnVmFsdWVzKCk7XG5cbiAgZ2xvYmFsLmJ1cy5vbihldmVudHMuVE9LRU5JWkFUSU9OX1JFUVVFU1QsIGZ1bmN0aW9uIChvcHRpb25zLCByZXBseSkge1xuICAgIHZhciB0b2tlbml6YXRpb25IYW5kbGVyID0gY3JlYXRlVG9rZW5pemF0aW9uSGFuZGxlcihjbGllbnQsIGNhcmRGb3JtKTtcblxuICAgIHRva2VuaXphdGlvbkhhbmRsZXIob3B0aW9ucywgcmVwbHkpO1xuICB9KTtcblxuICAvLyBHbG9iYWxpemUgY2FyZEZvcm0gaXMgZ2xvYmFsIHNvIG90aGVyIGNvbXBvbmVudHMgKFVuaW9uUGF5KSBjYW4gYWNjZXNzIGl0XG4gIGdsb2JhbC5jYXJkRm9ybSA9IGNhcmRGb3JtO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaW5pdGlhbGl6ZTogaW5pdGlhbGl6ZSxcbiAgY3JlYXRlOiBjcmVhdGUsXG4gIG9yY2hlc3RyYXRlOiBvcmNoZXN0cmF0ZSxcbiAgY3JlYXRlVG9rZW5pemF0aW9uSGFuZGxlcjogY3JlYXRlVG9rZW5pemF0aW9uSGFuZGxlclxufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBnZXRDYXJkVHlwZXMgPSByZXF1aXJlKCdjcmVkaXQtY2FyZC10eXBlJyk7XG52YXIgUHJvbWlzZSA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYi9wcm9taXNlJyk7XG52YXIgZ2V0QnlEb3QgPSByZXF1aXJlKCcuLy4uLy4uLy4uL2xpYi9nZXQtYnktZG90Jyk7XG52YXIgYXNzaWduID0gcmVxdWlyZSgnLi8uLi8uLi8uLi9saWIvYXNzaWduJykuYXNzaWduO1xudmFyIEV2ZW50ZWRNb2RlbCA9IHJlcXVpcmUoJy4vZXZlbnRlZC1tb2RlbCcpO1xudmFyIGNvbXBhcmVQb3NzaWJsZUNhcmRUeXBlcyA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYi9jb21wYXJlLXBvc3NpYmxlLWNhcmQtdHlwZXMnKTtcbnZhciB2YWxpZGF0b3JzID0gcmVxdWlyZSgnLi4vdmFsaWRhdG9ycycpO1xudmFyIENsaWVudCA9IHJlcXVpcmUoJy4uLy4uLy4uL2NsaWVudC9jbGllbnQnKTtcbnZhciBjb25zdGFudHMgPSByZXF1aXJlKCcuLi8uLi9zaGFyZWQvY29uc3RhbnRzJyk7XG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi4vLi4vc2hhcmVkL2NvbW1vbicpO1xudmFyIHBheW1lbnRGaWVsZHNSZWxhdGlvbnMgPSByZXF1aXJlKCcuLi8uLi9zaGFyZWQvcGF5bWVudC1maWVsZHMtcmVsYXRpb25zJyk7XG52YXIgZXZlbnRzID0gY29uc3RhbnRzLmV2ZW50cztcbnZhciBleHRlcm5hbEV2ZW50cyA9IGNvbnN0YW50cy5leHRlcm5hbEV2ZW50cztcbnZhciByZXF1ZXN0VHlwZXMgPSBjb25zdGFudHMucmVxdWVzdFR5cGVzO1xudmFyIHRva2VuaXplck5vblNlY3VyZUZpZWxkcyA9IGNvbnN0YW50cy50b2tlbml6ZXJOb25TZWN1cmVGaWVsZHM7XG52YXIgZ2V0TWF4TGVuZ3RoID0gY29tbW9uLmdldE1heExlbmd0aDtcbnZhciBnZXRXaGl0ZWxpc3RlZEZpZWxkcyA9IGNvbW1vbi5nZXRXaGl0ZWxpc3RlZEZpZWxkcztcblxudmFyIEdJRlRfQ0FSRCA9IGNvbnN0YW50cy5wYXltZW50VHlwZXMuUEFZTUVOVF9UWVBFX0dJRlRfQ0FSRDtcblxuZnVuY3Rpb24gQ3JlZGl0Q2FyZEZvcm0oY29uZmlndXJhdGlvbikge1xuICB0aGlzLl9jb21wb25lbnRzID0ge307XG4gIHRoaXMuY29uZmlndXJhdGlvbiA9IGNvbmZpZ3VyYXRpb247XG5cbiAgdmFyIHdoaXRlbGlzdGVkRmllbGRzID0gZ2V0V2hpdGVsaXN0ZWRGaWVsZHModGhpcy5jb25maWd1cmF0aW9uLnBheW1lbnRUeXBlKTtcblxuICB0aGlzLl9maWVsZEtleXMgPSBPYmplY3Qua2V5cyhjb25maWd1cmF0aW9uLmZpZWxkcykuZmlsdGVyKGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4gd2hpdGVsaXN0ZWRGaWVsZHMuaGFzT3duUHJvcGVydHkoa2V5KTtcbiAgfSk7XG5cbiAgRXZlbnRlZE1vZGVsLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgdGhpcy5naWZ0Q2FyZFR5cGVzID0gW1xuICAgIHtcbiAgICAgIG5pY2VUeXBlOiAnU1ZTJyxcbiAgICAgIHR5cGU6ICdTVlMnLFxuICAgICAgZXhhY3RQYXR0ZXJuOiAvXjZcXGQqJC8sXG4gICAgICBnYXBzOiBbNCwgOCwgMTIsIDE2XSxcbiAgICAgIGxlbmd0aHM6IFsxOV0sXG4gICAgICBjb2RlOiB7IG5hbWU6ICcnLCBzaXplOiAwIH1cbiAgICB9LFxuICAgIHtcbiAgICAgIG5pY2VUeXBlOiAnVENDJyxcbiAgICAgIHR5cGU6ICdUQ0MnLFxuICAgICAgZXhhY3RQYXR0ZXJuOiAvXjJcXGQqJC8sXG4gICAgICBnYXBzOiBbNCwgOCwgMTJdLFxuICAgICAgbGVuZ3RoczogWzE2XSxcbiAgICAgIGNvZGU6IHsgbmFtZTogJycsIHNpemU6IDAgfVxuICAgIH1cbiAgXTtcblxuICB0aGlzLl9maWVsZEtleXMuZm9yRWFjaChmdW5jdGlvbiAoZmllbGQpIHtcbiAgICB2YXIgb25GaWVsZENoYW5nZSA9IG9uRmllbGRTdGF0ZUNoYW5nZSh0aGlzLCBmaWVsZCk7XG4gICAgdGhpcy5fdmFsaWRhdGVGaWVsZChmaWVsZCk7IC8vIHRoYXQgc2hvdWxkIHNldCBpc1ZhbGlkIGZvciBkZWZhdWx0IHZhbHVlc1xuICAgIHRoaXMuX2hhbmRsZVJlbGF0ZWRGaWVsZHNWYWx1ZXMoZmllbGQpO1xuICAgIHRoaXMub24oJ2NoYW5nZTonICsgZmllbGQgKyAnLnZhbHVlJywgb25GaWVsZFZhbHVlQ2hhbmdlKHRoaXMsIGZpZWxkKSk7XG4gICAgdGhpcy5vbignY2hhbmdlOicgKyBmaWVsZCArICcuaXNGb2N1c2VkJywgb25GaWVsZEZvY3VzQ2hhbmdlKHRoaXMsIGZpZWxkKSk7XG4gICAgdGhpcy5vbignY2hhbmdlOicgKyBmaWVsZCArICcuaXNFbXB0eScsIG9uRW1wdHlDaGFuZ2UodGhpcywgZmllbGQpKTtcblxuICAgIHRoaXMub24oJ2NoYW5nZTonICsgZmllbGQgKyAnLmlzVmFsaWQnLCBvbkZpZWxkQ2hhbmdlKTtcbiAgICB0aGlzLm9uKCdjaGFuZ2U6JyArIGZpZWxkICsgJy5pc1BvdGVudGlhbGx5VmFsaWQnLCBvbkZpZWxkQ2hhbmdlKTtcbiAgfS5iaW5kKHRoaXMpKTtcbiAgdGhpcy5vbignY2hhbmdlOmFjY291bnROdW1iZXIudmFsdWUnLCB0aGlzLl9vbk51bWJlckNoYW5nZSk7XG4gIHRoaXMub24oJ2NoYW5nZTpwb3NzaWJsZUNhcmRUeXBlcycsIG9uQ2FyZFR5cGVDaGFuZ2UodGhpcywgJ2FjY291bnROdW1iZXInKSk7XG59XG5cbkNyZWRpdENhcmRGb3JtLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXZlbnRlZE1vZGVsLnByb3RvdHlwZSk7XG5DcmVkaXRDYXJkRm9ybS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBDcmVkaXRDYXJkRm9ybTtcblxuQ3JlZGl0Q2FyZEZvcm0ucHJvdG90eXBlLnJlc2V0QXR0cmlidXRlcyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHRoaXNNb250aCA9IChuZXcgRGF0ZSgpLmdldE1vbnRoKCkgKyAxKS50b1N0cmluZygpO1xuICB2YXIgdGhpc1llYXIgPSAobmV3IERhdGUoKS5nZXRGdWxsWWVhcigpKS50b1N0cmluZygpO1xuXG4gIHJldHVybiB0aGlzLl9maWVsZEtleXMucmVkdWNlKGZ1bmN0aW9uIChyZXN1bHQsIGZpZWxkKSB7XG4gICAgdmFyIGZpZWxkQ29uZmlnID0gdGhpcy5jb25maWd1cmF0aW9uLmZpZWxkc1tmaWVsZF07XG4gICAgdmFyIGlzU2VsZWN0ID0gZmllbGRDb25maWcuc2VsZWN0ICE9IG51bGw7XG4gICAgdmFyIGhhc1BsYWNlaG9sZGVyID0gZmllbGRDb25maWcucGxhY2Vob2xkZXIgIT0gbnVsbDtcblxuICAgIHJlc3VsdFtmaWVsZF0gPSB7XG4gICAgICB2YWx1ZTogZmllbGRDb25maWcuZGVmYXVsdFZhbHVlIHx8ICcnLFxuICAgICAgaXNGb2N1c2VkOiBmYWxzZSxcbiAgICAgIGlzVmFsaWQ6ICdkZWZhdWx0VmFsdWUnIGluIGZpZWxkQ29uZmlnLFxuICAgICAgaXNQb3RlbnRpYWxseVZhbGlkOiB0cnVlXG4gICAgfTtcblxuICAgIGlmIChpc1NlbGVjdCAmJiAhaGFzUGxhY2Vob2xkZXIpIHtcbiAgICAgIGlmIChmaWVsZCA9PT0gJ2V4cGlyYXRpb25Nb250aCcpIHtcbiAgICAgICAgcmVzdWx0W2ZpZWxkXS52YWx1ZSA9IHRoaXNNb250aDtcbiAgICAgIH0gZWxzZSBpZiAoZmllbGQgPT09ICdleHBpcmF0aW9uWWVhcicpIHtcbiAgICAgICAgcmVzdWx0W2ZpZWxkXS52YWx1ZSA9IHRoaXNZZWFyO1xuICAgICAgfVxuXG4gICAgICBpZiAoZmllbGQgPT09ICdleHBpcmF0aW9uTW9udGgnIHx8IGZpZWxkID09PSAnZXhwaXJhdGlvblllYXInKSB7XG4gICAgICAgIHJlc3VsdFtmaWVsZF0uaXNWYWxpZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmVzdWx0W2ZpZWxkXS5pc0VtcHR5ID0gcmVzdWx0W2ZpZWxkXS52YWx1ZSA9PT0gJyc7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LmJpbmQodGhpcyksIHsgcG9zc2libGVDYXJkVHlwZXM6IGdldENhcmRUeXBlcygnJykgfSk7XG59O1xuXG5DcmVkaXRDYXJkRm9ybS5wcm90b3R5cGUuZW1pdEV2ZW50ID0gZnVuY3Rpb24gKGZpZWxkS2V5LCBldmVudFR5cGUpIHtcbiAgdmFyIGNhcmRzLCBjYXJkSW5mbztcbiAgdmFyIHBvc3NpYmxlQ2FyZFR5cGVzID0gdGhpcy5nZXQoJ3Bvc3NpYmxlQ2FyZFR5cGVzJyk7XG4gIHZhciBmaWVsZHMgPSB0aGlzLl9maWVsZEtleXMucmVkdWNlKGZ1bmN0aW9uIChyZXN1bHQsIGtleSkge1xuICAgIHZhciBmaWVsZERhdGEgPSB0aGlzLmdldChrZXkpO1xuXG4gICAgcmVzdWx0W2tleV0gPSB7XG4gICAgICBpc0VtcHR5OiBmaWVsZERhdGEuaXNFbXB0eSxcbiAgICAgIGlzVmFsaWQ6IGZpZWxkRGF0YS5pc1ZhbGlkLFxuICAgICAgaXNQb3RlbnRpYWxseVZhbGlkOiBmaWVsZERhdGEuaXNQb3RlbnRpYWxseVZhbGlkLFxuICAgICAgaXNGb2N1c2VkOiBmaWVsZERhdGEuaXNGb2N1c2VkXG4gICAgfTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0uYmluZCh0aGlzKSwge30pO1xuICBjYXJkcyA9IHBvc3NpYmxlQ2FyZFR5cGVzLm1hcChmdW5jdGlvbiAoY2FyZFR5cGUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmljZVR5cGU6IGNhcmRUeXBlLm5pY2VUeXBlLFxuICAgICAgdHlwZTogY2FyZFR5cGUudHlwZSxcbiAgICAgIGNvZGU6IGNhcmRUeXBlLmNvZGVcbiAgICB9O1xuICB9KTtcbiAgY2FyZEluZm8gPSB0aGlzLl9nZXRDYXJkSW5mbygpO1xuXG4gIGdsb2JhbC5idXMuZW1pdChldmVudHMuSU5QVVRfRVZFTlQsIHtcbiAgICBtZXJjaGFudFBheWxvYWQ6IHtcbiAgICAgIGNhcmRzOiBjYXJkcyxcbiAgICAgIGNhcmRJbmZvOiBjYXJkSW5mbyxcbiAgICAgIGVtaXR0ZWRCeTogZmllbGRLZXksXG4gICAgICBmaWVsZHM6IGZpZWxkc1xuICAgIH0sXG4gICAgdHlwZTogZXZlbnRUeXBlXG4gIH0pO1xufTtcblxuQ3JlZGl0Q2FyZEZvcm0ucHJvdG90eXBlLnNldHVwQ29tcG9uZW50ID0gZnVuY3Rpb24gKGZpZWxkS2V5LCBjb21wb25lbnQpIHtcbiAgdGhpcy5fY29tcG9uZW50c1tmaWVsZEtleV0gPSBjb21wb25lbnQ7XG59O1xuXG5DcmVkaXRDYXJkRm9ybS5wcm90b3R5cGUuX29uTnVtYmVyQ2hhbmdlID0gZnVuY3Rpb24gKG51bWJlcikge1xuICB2YXIgcHVyZU51bWJlciA9IG51bWJlci5yZXBsYWNlKC9bLVxcc10vZywgJycpO1xuICB2YXIgaXNHQyA9IEdJRlRfQ0FSRCA9PT0gdGhpcy5nZXRQYXltZW50VHlwZSgpXG4gIHZhciBuZXdQb3NzaWJsZUNhcmRUeXBlcyA9IGlzR0NcbiAgICA/IHRoaXMuZ2lmdENhcmRUeXBlcy5maWx0ZXIoZnVuY3Rpb24gKGdpZnRDYXJkVHlwZSkge1xuICAgICAgICByZXR1cm4gZ2lmdENhcmRUeXBlLmV4YWN0UGF0dGVybi50ZXN0KHB1cmVOdW1iZXIpO1xuICAgICAgfSlcbiAgICA6IGdldENhcmRUeXBlcyhwdXJlTnVtYmVyKTtcblxuICBpZiAoIWlzR0MpIHtcbiAgICB2YXIgcmVzdHJpY3RMZW5ndGggPSBmdW5jdGlvbiAocG9zc2libGVDYXJkKSB7XG4gICAgICB2YXIgbmV3TGVuZ3RoID0gKHBvc3NpYmxlQ2FyZC5sZW5ndGhzIHx8IFtdKS5maWx0ZXIoZnVuY3Rpb24obGVuZ3RoKSB7IHJldHVybiBsZW5ndGggPD0gMTYgfSlcbiAgICAgIHJldHVybiBhc3NpZ24ocG9zc2libGVDYXJkLCB7IGxlbmd0aHM6IG5ld0xlbmd0aCB9KVxuICAgIH1cbiAgICBuZXdQb3NzaWJsZUNhcmRUeXBlcyA9IChuZXdQb3NzaWJsZUNhcmRUeXBlcyB8fCBbXSkubWFwKHJlc3RyaWN0TGVuZ3RoKVxuICB9XG4gIHZhciBvbGRQb3NzaWJsZUNhcmRUeXBlcyA9IHRoaXMuZ2V0KCdwb3NzaWJsZUNhcmRUeXBlcycpO1xuICBpZiAoIWNvbXBhcmVQb3NzaWJsZUNhcmRUeXBlcyhuZXdQb3NzaWJsZUNhcmRUeXBlcywgb2xkUG9zc2libGVDYXJkVHlwZXMpKSB7XG4gICAgdGhpcy5zZXQoJ3Bvc3NpYmxlQ2FyZFR5cGVzJywgbmV3UG9zc2libGVDYXJkVHlwZXMpO1xuICB9XG59O1xuXG5DcmVkaXRDYXJkRm9ybS5wcm90b3R5cGUuX3ZhbGlkYXRlRmllbGQgPSBmdW5jdGlvbiAoZmllbGRLZXkpIHtcbiAgdmFyIHZhbGlkYXRpb25SZXN1bHQ7XG4gIHZhciB2YWx1ZSA9IHRoaXMuZ2V0KGZpZWxkS2V5ICsgJy52YWx1ZScpO1xuICB2YXIgdmFsaWRhdGUgPSB2YWxpZGF0b3JzW2ZpZWxkS2V5XTtcblxuICB2YWxpZGF0aW9uUmVzdWx0ID0gdmFsaWRhdGUodmFsdWUsIHRoaXMpO1xuXG4gIHRoaXMuc2V0KGZpZWxkS2V5ICsgJy5pc1ZhbGlkJywgdmFsaWRhdGlvblJlc3VsdC5pc1ZhbGlkKTtcbiAgdGhpcy5zZXQoZmllbGRLZXkgKyAnLmlzUG90ZW50aWFsbHlWYWxpZCcsIHZhbGlkYXRpb25SZXN1bHQuaXNQb3RlbnRpYWxseVZhbGlkKTtcblxuICByZXR1cm4gdmFsaWRhdGlvblJlc3VsdDtcbn07XG5cbkNyZWRpdENhcmRGb3JtLnByb3RvdHlwZS5fZ2V0UmVsYXRlZEZpZWxkc1J1bGVzID0gZnVuY3Rpb24gKCkge1xuICB2YXIgcGF5bWVudFR5cGUgPSB0aGlzLmdldFBheW1lbnRUeXBlKCk7XG4gIHJldHVybiBPYmplY3Qua2V5cyhwYXltZW50RmllbGRzUmVsYXRpb25zKS5yZWR1Y2UoZnVuY3Rpb24gKHJlc3VsdCwgcmVxdWVzdFR5cGUpIHtcbiAgICB2YXIgcnVsZXMgPSBwYXltZW50RmllbGRzUmVsYXRpb25zW3JlcXVlc3RUeXBlXVtwYXltZW50VHlwZV0ucmVsYXRlZEZpZWxkc1J1bGVzIHx8IFtdO1xuICAgIHJ1bGVzLmZvckVhY2goZnVuY3Rpb24gKHJ1bGUpIHtcbiAgICAgIHJlc3VsdC5wdXNoKHJ1bGUpO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH0sIFtdKVxufVxuXG5DcmVkaXRDYXJkRm9ybS5wcm90b3R5cGUuX3VwZGF0ZUZpZWxkUHJvcGVydHkgPSBmdW5jdGlvbiAocnVsZSwgZGVwZW5kZW50RmllbGRLZXkpIHtcbiAgdmFyIHJlbmRlclJlc3VsdDtcbiAgdmFyIGRlcGVuZGVudEZpZWxkUGFydCA9IHJ1bGUuZGVwZW5kZW5jaWVzW2RlcGVuZGVudEZpZWxkS2V5XTtcbiAgdmFyIGRlcGVuZGVudEZpZWxkT3JpZ2luID0gdGhpcy5nZXRXaGl0ZWxpc3RlZEZpZWxkcygpW2RlcGVuZGVudEZpZWxkS2V5XTtcbiAgdmFyIGRlcGVuZGVudEZpZWxkID0gYXNzaWduKHt9LCBkZXBlbmRlbnRGaWVsZE9yaWdpbiwgZGVwZW5kZW50RmllbGRQYXJ0KTtcbiAgdmFyIGZpZWxkQ29tcG9uZW50ID0gdGhpcy5fY29tcG9uZW50c1tkZXBlbmRlbnRGaWVsZEtleV07XG5cbiAgaWYgKCFmaWVsZENvbXBvbmVudCB8fCAhZGVwZW5kZW50RmllbGQuZW51bXMpIHJldHVybjtcblxuICBmaWVsZENvbXBvbmVudC5lbnVtcyA9IGRlcGVuZGVudEZpZWxkLmVudW1zO1xuICByZW5kZXJSZXN1bHQgPSBmaWVsZENvbXBvbmVudC5yZW5kZXJPcHRpb25zKGRlcGVuZGVudEZpZWxkLmVudW1zKTtcbiAgdGhpcy5zZXQoZGVwZW5kZW50RmllbGRLZXkgKyAnLnZhbHVlJywgcmVuZGVyUmVzdWx0LnNlbGVjdGVkVmFsdWUpO1xufVxuXG5DcmVkaXRDYXJkRm9ybS5wcm90b3R5cGUuc2V0dXBSZWxhdGVkRmllbGRzQnlDb25maWdWYWx1ZXMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBjb25maWcgPSB0aGlzLmNvbmZpZ3VyYXRpb24uY2xpZW50O1xuICB2YXIgcmVsYXRlZEZpZWxkc1J1bGVzID0gdGhpcy5fZ2V0UmVsYXRlZEZpZWxkc1J1bGVzKClcbiAgICAuZmlsdGVyKGZ1bmN0aW9uIChydWxlKSB7XG4gICAgICByZXR1cm4gcnVsZS5jb25maWcgJiYgcnVsZS52YWx1ZSA9PT0gZ2V0QnlEb3QoY29uZmlnLCBydWxlLmNvbmZpZyk7XG4gICAgfSk7XG5cbiAgcmVsYXRlZEZpZWxkc1J1bGVzLmZvckVhY2goZnVuY3Rpb24gKHJ1bGUpIHtcbiAgICBPYmplY3Qua2V5cyhydWxlLmRlcGVuZGVuY2llcykuZm9yRWFjaChmdW5jdGlvbiAoZGVwZW5kZW50RmllbGRLZXkpIHtcbiAgICAgIHRoaXMuX3VwZGF0ZUZpZWxkUHJvcGVydHkocnVsZSwgZGVwZW5kZW50RmllbGRLZXkpXG4gICAgfS5iaW5kKHRoaXMpKVxuXG4gIH0uYmluZCh0aGlzKSk7XG59XG5cbkNyZWRpdENhcmRGb3JtLnByb3RvdHlwZS5faGFuZGxlUmVsYXRlZEZpZWxkc1ZhbHVlcyA9IGZ1bmN0aW9uIChmaWVsZEtleSkge1xuICB2YXIgdmFsdWUgPSB0aGlzLmdldChmaWVsZEtleSArICcudmFsdWUnKTtcbiAgdmFyIHJlbGF0ZWRGaWVsZHNSdWxlcyA9IHRoaXMuX2dldFJlbGF0ZWRGaWVsZHNSdWxlcygpXG4gICAgLmZpbHRlcihmdW5jdGlvbiAocnVsZSkge1xuICAgICAgcmV0dXJuIHJ1bGUuZmllbGQgPT09IGZpZWxkS2V5ICYmIHJ1bGUudmFsdWUgPT09IHZhbHVlO1xuICAgIH0pO1xuICByZWxhdGVkRmllbGRzUnVsZXMuZm9yRWFjaChmdW5jdGlvbiAocnVsZSkge1xuICAgIE9iamVjdC5rZXlzKHJ1bGUuZGVwZW5kZW5jaWVzKS5mb3JFYWNoKGZ1bmN0aW9uIChkZXBlbmRlbnRGaWVsZEtleSkge1xuICAgICAgdGhpcy5fdXBkYXRlRmllbGRQcm9wZXJ0eShydWxlLCBkZXBlbmRlbnRGaWVsZEtleSlcbiAgICB9LmJpbmQodGhpcykpXG5cbiAgfS5iaW5kKHRoaXMpKTtcbn07XG5cbkNyZWRpdENhcmRGb3JtLnByb3RvdHlwZS5nZXRQYXltZW50VHlwZSA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMuY29uZmlndXJhdGlvbi5wYXltZW50VHlwZTtcbn07XG5cbkNyZWRpdENhcmRGb3JtLnByb3RvdHlwZS5nZXRNYXhMZW5ndGggPSBmdW5jdGlvbiAoZmllbGROYW1lKSB7XG4gIHJldHVybiBnZXRNYXhMZW5ndGgodGhpcy5nZXRQYXltZW50VHlwZSgpLCBmaWVsZE5hbWUpO1xufTtcblxuQ3JlZGl0Q2FyZEZvcm0ucHJvdG90eXBlLmdldFdoaXRlbGlzdGVkRmllbGRzID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gZ2V0V2hpdGVsaXN0ZWRGaWVsZHModGhpcy5nZXRQYXltZW50VHlwZSgpKTtcbn07XG5cbkNyZWRpdENhcmRGb3JtLnByb3RvdHlwZS5nZXRDYXJkRGF0YSA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgdmFyIFRPS0VOSVpBVElPTiAgPSByZXF1ZXN0VHlwZXMuUkVRVUVTVF9UWVBFX1RPS0VOSVpBVElPTjtcbiAgdmFyIHBheW1lbnRUeXBlID0gdGhpcy5nZXRQYXltZW50VHlwZSgpO1xuICB2YXIgZXh0cmFGaWVsZHM7XG4gIHZhciBleHRyYURhdGE7XG4gIHZhciBmaWVsZFNldDtcbiAgdmFyIHJlc3VsdCA9IHt9O1xuXG4gIHBhcmFtcyA9IHBhcmFtcyB8fCB7IHJlcXVlc3RUeXBlOiBUT0tFTklaQVRJT04sIGV4dHJhRGF0YToge30gfTtcbiAgZXh0cmFEYXRhID0gcGFyYW1zLmV4dHJhRGF0YSB8fCB7fTtcbiAgZXh0cmFGaWVsZHMgPSBPYmplY3Qua2V5cyhleHRyYURhdGEpO1xuXG4gIGZpZWxkU2V0ID0gcGF5bWVudEZpZWxkc1JlbGF0aW9uc1twYXJhbXMucmVxdWVzdFR5cGVdO1xuXG4gIGlmICghZmllbGRTZXQpIHtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gaW5qZWN0UG9zdGFsQ29kZShkYXRhLCBwb3N0YWxDb2RlKSB7XG4gICAgaWYgKCFwb3N0YWxDb2RlKSByZXR1cm4gZGF0YTtcbiAgICB2YXIgYmlsbGluZ0FkZHJlc3MgPSB7IHBvc3RhbENvZGU6IHBvc3RhbENvZGUgfTtcbiAgICBkYXRhLmJpbGxpbmdBZGRyZXNzID0gZGF0YS5iaWxsaW5nQWRkcmVzcyA/IGFzc2lnbihkYXRhLmJpbGxpbmdBZGRyZXNzLCBiaWxsaW5nQWRkcmVzcykgOiBiaWxsaW5nQWRkcmVzc1xuICAgIGRlbGV0ZSBkYXRhLnBvc3RhbENvZGU7XG5cbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIC8vIFNldCBFeHRyYSBGaWVsZHNcbiAgcmVzdWx0ID0gZXh0cmFGaWVsZHMucmVkdWNlKGZ1bmN0aW9uIChhY2N1bSwgZmllbGQpIHtcbiAgICB2YXIgZmllbGREYXRhID0ge307XG4gICAgaWYgKHBhcmFtcy5yZXF1ZXN0VHlwZSA9PT0gVE9LRU5JWkFUSU9OICYmIHRva2VuaXplck5vblNlY3VyZUZpZWxkcy5pbmRleE9mKGZpZWxkKSA9PT0gLTEpIHtcbiAgICAgIHJldHVybiBhY2N1bTtcbiAgICB9XG5cbiAgICBmaWVsZERhdGFbZmllbGRdID0gcHJlcGFyZUZpZWxkVmFsdWUoZmllbGQsIGV4dHJhRGF0YVtmaWVsZF0pO1xuXG4gICAgcmV0dXJuIH5maWVsZFNldFtwYXltZW50VHlwZV0uZmllbGRzLmluZGV4T2YoZmllbGQpID8gYWNjdW0gOiBhc3NpZ24oYWNjdW0sIGZpZWxkRGF0YSk7XG4gIH0sIHJlc3VsdCk7XG5cbiAgLy8gcHJlcGFyZSBjYXJkIGRhdGFcbiAgZmllbGRTZXRbcGF5bWVudFR5cGVdLmZpZWxkcy5maWx0ZXIoZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gdGhpcy5fZmllbGRLZXlzLmluZGV4T2Yoa2V5KSAhPT0gLTE7XG4gICAgfS5iaW5kKHRoaXMpKVxuICAgIC5yZWR1Y2UoXG4gICAgICBmdW5jdGlvbiAocmVkdWNlZFJlc3VsdCwgbmFtZSkge1xuICAgICAgICB2YXIgdmFsdWUgPSB0aGlzLmdldChuYW1lICsgJy52YWx1ZScpO1xuICAgICAgICBpZiAodmFsdWUudHJpbSgpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICByZWR1Y2VkUmVzdWx0W25hbWVdID0gcHJlcGFyZUZpZWxkVmFsdWUobmFtZSwgdmFsdWUudHJpbSgpKTtcbiAgICAgICAgfSBlbHNlIGlmIChmaWVsZFNldFtwYXltZW50VHlwZV0uZGVmYXVsdFZhbHVlcyAmJiAobmFtZSBpbiBmaWVsZFNldFtwYXltZW50VHlwZV0uZGVmYXVsdFZhbHVlcykpIHtcbiAgICAgICAgICByZWR1Y2VkUmVzdWx0W25hbWVdID0gZmllbGRTZXRbcGF5bWVudFR5cGVdLmRlZmF1bHRWYWx1ZXNbbmFtZV07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmFtZSA9PT0gJ3Bvc3RhbENvZGUnID8gaW5qZWN0UG9zdGFsQ29kZShyZWR1Y2VkUmVzdWx0LCByZWR1Y2VkUmVzdWx0W25hbWVdKTogcmVkdWNlZFJlc3VsdDtcbiAgICAgIH0uYmluZCh0aGlzKSxcbiAgICAgIHJlc3VsdFxuICAgICk7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbkNyZWRpdENhcmRGb3JtLnByb3RvdHlwZS5nZXRGaWVsZHMgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBbXS5jb25jYXQodGhpcy5fZmllbGRLZXlzKTtcbn07XG5cbkNyZWRpdENhcmRGb3JtLnByb3RvdHlwZS5pc0VtcHR5ID0gZnVuY3Rpb24gKHJlcXVlc3RUeXBlKSB7XG4gIHZhciBwYXltZW50VHlwZSA9IHRoaXMuZ2V0UGF5bWVudFR5cGUoKTtcbiAgdmFyIGZpZWxkcyA9IGdldEZpZWxkc1NldChwYXltZW50VHlwZSwgcmVxdWVzdFR5cGUpO1xuXG4gIHJldHVybiB0aGlzLl9maWVsZEtleXNcbiAgICAuZmlsdGVyKGZ1bmN0aW9uIChrZXkpIHtcblxuICAgICAgcmV0dXJuIGZpZWxkcy5pbmRleE9mKGtleSkgIT09IC0xO1xuICAgIH0pXG4gICAgLmV2ZXJ5KGZ1bmN0aW9uIChrZXkpIHtcblxuICAgICAgcmV0dXJuIHRoaXMuZ2V0KGtleSkudmFsdWUubGVuZ3RoID09PSAwO1xuICAgIH0uYmluZCh0aGlzKSk7XG59O1xuXG5DcmVkaXRDYXJkRm9ybS5wcm90b3R5cGUuaW52YWxpZEZpZWxkS2V5cyA9IGZ1bmN0aW9uIChyZXF1ZXN0VHlwZSkge1xuICB2YXIgcGF5bWVudFR5cGUgPSB0aGlzLmdldFBheW1lbnRUeXBlKCk7XG4gIHZhciBmaWVsZHMgPSBnZXRGaWVsZHNTZXQocGF5bWVudFR5cGUsIHJlcXVlc3RUeXBlKTtcblxuICByZXR1cm4gdGhpcy5fZmllbGRLZXlzXG4gICAgLmZpbHRlcihmdW5jdGlvbihrZXkpIHtcbiAgICAgIHZhciBpc0FwcGxpY2FibGUgPSBmaWVsZHMuaW5kZXhPZihrZXkpICE9PSAtMTtcblxuICAgICAgcmV0dXJuIGlzQXBwbGljYWJsZTtcbiAgICB9LmJpbmQodGhpcykpXG4gICAgLmZpbHRlcihmdW5jdGlvbiAoa2V5KSB7XG4gICAgICB0aGlzLl92YWxpZGF0ZUZpZWxkKGtleSk7XG5cbiAgICAgIHJldHVybiAhdGhpcy5nZXQoa2V5KS5pc1ZhbGlkO1xuICAgIH0uYmluZCh0aGlzKSk7XG59O1xuXG5DcmVkaXRDYXJkRm9ybS5wcm90b3R5cGUuX2dldENhcmRJbmZvID0gZnVuY3Rpb24gKCkge1xuICB2YXIgX2NhcmRJbmZvUmVzcG9uc2UgPSB0aGlzLl9jYXJkSW5mb1Jlc3BvbnNlIHx8IHt9O1xuXG4gIHJldHVybiB7XG4gICAgY2FyZEJyYW5kOiBfY2FyZEluZm9SZXNwb25zZS5wYXltZW50TmV0d29yayxcbiAgICBjYXJkVHlwZTogX2NhcmRJbmZvUmVzcG9uc2UuYWNjb3VudFR5cGUsXG4gICAgcHJlcGFpZEluZGljYXRvcjogX2NhcmRJbmZvUmVzcG9uc2UucHJlcGFpZEluZGljYXRvcixcbiAgICB0aGlyZFBhcnR5OiBfY2FyZEluZm9SZXNwb25zZS50aGlyZFBhcnR5XG4gIH07XG59O1xuXG5DcmVkaXRDYXJkRm9ybS5wcm90b3R5cGUuX3JlcXVlc3RDYXJkSW5mbyA9IGZ1bmN0aW9uIChmaWVsZEtleSkge1xuICB2YXIgQklOX0xPT0tVUF9NQVhfTEVOR1RIID0gY29uc3RhbnRzLkJJTl9MT09LVVBfTUFYX0xFTkdUSDtcbiAgdmFyIHZhbHVlID0gKHRoaXMuZ2V0KGZpZWxkS2V5ICsgJy52YWx1ZScpIHx8ICcnKS5zbGljZSgwLCBCSU5fTE9PS1VQX01BWF9MRU5HVEgpO1xuXG4gIGlmICghdGhpcy5fY2FyZEluZm9DbGllbnQpIHtcbiAgICB0aGlzLl9jYXJkSW5mb0NsaWVudCA9IG5ldyBDbGllbnQodGhpcy5jb25maWd1cmF0aW9uLmNsaWVudCk7XG4gIH1cblxuICByZXR1cm4gdmFsdWUubGVuZ3RoID49IEJJTl9MT09LVVBfTUFYX0xFTkdUSFxuICAgID8gdGhpcy5fY2FyZEluZm9DbGllbnQucmVxdWVzdCh7XG4gICAgICAgIGFwaTogJ3NlYW1sZXNzcGF5QXBpJyxcbiAgICAgICAgbWV0aG9kOiAnZ2V0JyxcbiAgICAgICAgZW5kcG9pbnQ6ICdiaW4tbG9va3Vwcy8nICsgdmFsdWUsXG4gICAgICAgIHB1Ymxpc2hhYmxlOiB0cnVlLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgaW5jbHVkaW5nOiAndGhpcmRQYXJ0eSdcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgfSlcbiAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgIHRoaXMuX2NhcmRJbmZvUmVzcG9uc2UgPSByZXNwb25zZTtcblxuICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICB9LmJpbmQodGhpcykpXG4gICAgOiAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX2NhcmRJbmZvUmVzcG9uc2UgPSB7fTtcblxuICAgICAgICByZXR1cm4ge307XG4gICAgICB9LmJpbmQodGhpcykpXG4gIDtcbn07XG5cbkNyZWRpdENhcmRGb3JtLnByb3RvdHlwZS5nZXRDb21wb25lbnRzID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5fY29tcG9uZW50c1xufVxuXG5mdW5jdGlvbiBvbkZpZWxkVmFsdWVDaGFuZ2UoZm9ybSwgZmllbGRLZXkpIHtcbiAgdmFyIGN1c3RvbVJlcUluZm9TZXJ2aWNlTmFtZXMgPSB7XG4gICAgYWNjb3VudE51bWJlcjogJ19yZXF1ZXN0Q2FyZEluZm8nXG4gIH07XG4gIHZhciBldmVudE1hcCA9IHtcbiAgICBhY2NvdW50TnVtYmVyOiBleHRlcm5hbEV2ZW50cy5DQVJEX0lORk9fTE9BREVEXG4gIH07XG5cbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcGF5bWVudFR5cGUgPSB0aGlzLmdldFBheW1lbnRUeXBlKCk7XG4gICAgZm9ybS5zZXQoZmllbGRLZXkgKyAnLmlzRW1wdHknLCBmb3JtLmdldChmaWVsZEtleSArICcudmFsdWUnKSA9PT0gJycpO1xuICAgIGZvcm0uX3ZhbGlkYXRlRmllbGQoZmllbGRLZXkpO1xuICAgIGZvcm0uX2hhbmRsZVJlbGF0ZWRGaWVsZHNWYWx1ZXMoZmllbGRLZXkpO1xuICAgIGZvcm0uZW1pdEV2ZW50KGZpZWxkS2V5LCBleHRlcm5hbEV2ZW50cy5DSEFOR0UpO1xuXG4gICAgaWYgKFxuICAgICAgKFxuICAgICAgICBnZXRCeURvdCh0aGlzLCAnY29uZmlndXJhdGlvbi5jbGllbnQudG9rZW5UeXBlJykgPT09IGNvbnN0YW50cy5UT0tFTl9UWVBFX0NIRUNLT1VUIHx8XG4gICAgICAgIGdldEJ5RG90KHRoaXMsICdjb25maWd1cmF0aW9uLmNsaWVudC5nYXRld2F5Q29uZmlndXJhdGlvbi50cmFuc2FjdGlvbkFwaS5zb3VyY2UnKSA9PT0gJ3ZUZXJtaW5hbCdcbiAgICAgICkgJiZcbiAgICAgIHBheW1lbnRUeXBlID09PSBjb25zdGFudHMucGF5bWVudFR5cGVzLlBBWU1FTlRfVFlQRV9DUkVESVQgJiZcbiAgICAgIGN1c3RvbVJlcUluZm9TZXJ2aWNlTmFtZXNbZmllbGRLZXldXG4gICAgKSB7XG4gICAgICB2YXIgbmFtZUluZm9SZXF1ZXN0U2VydmljZSA9IGN1c3RvbVJlcUluZm9TZXJ2aWNlTmFtZXNbZmllbGRLZXldO1xuICAgICAgdmFyIGV2ZW50SW5mbyA9IGV2ZW50TWFwW2ZpZWxkS2V5XTtcbiAgICAgIGZvcm1bbmFtZUluZm9SZXF1ZXN0U2VydmljZV0oZmllbGRLZXkpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBmb3JtLmVtaXRFdmVudChmaWVsZEtleSwgZXZlbnRJbmZvKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBvbkZpZWxkRm9jdXNDaGFuZ2UoZm9ybSwgZmllbGQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChpc0ZvY3VzZWQpIHtcbiAgICBmb3JtLl9maWVsZEtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICBpZiAoa2V5ID09PSBmaWVsZCkgeyByZXR1cm47IH1cbiAgICAgIGZvcm0uc2V0KGtleSArICcuaXNGb2N1c2VkJywgZmFsc2UpO1xuICAgIH0pO1xuXG4gICAgZm9ybS5lbWl0RXZlbnQoZmllbGQsIGlzRm9jdXNlZCA/IGV4dGVybmFsRXZlbnRzLkZPQ1VTIDogZXh0ZXJuYWxFdmVudHMuQkxVUik7XG4gIH07XG59XG5cbmZ1bmN0aW9uIG9uQ2FyZFR5cGVDaGFuZ2UoZm9ybSwgZmllbGQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBmb3JtLmVtaXRFdmVudChmaWVsZCwgZXh0ZXJuYWxFdmVudHMuQ0FSRF9UWVBFX0NIQU5HRSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIG9uRW1wdHlDaGFuZ2UoZm9ybSwgZmllbGQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXZlbnQgPSBmb3JtLmdldChmaWVsZCArICcuaXNFbXB0eScpID8gZXh0ZXJuYWxFdmVudHMuRU1QVFkgOiBleHRlcm5hbEV2ZW50cy5OT1RfRU1QVFk7XG4gICAgZm9ybS5lbWl0RXZlbnQoZmllbGQsIGV2ZW50KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gb25GaWVsZFN0YXRlQ2hhbmdlKGZvcm0sIGZpZWxkKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgZm9ybS5lbWl0RXZlbnQoZmllbGQsIGV4dGVybmFsRXZlbnRzLlZBTElESVRZX0NIQU5HRSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHByZXBhcmVGaWVsZFZhbHVlKGZpZWxkLCB2YWx1ZSkge1xuICB2YXIgc3RyaW5nRmllbGRzID0gWydhbW91bnQnLCAndGF4QW1vdW50J107XG5cbiAgcmV0dXJuIHN0cmluZ0ZpZWxkcy5pbmRleE9mKGZpZWxkKSAhPT0gLTEgPyBTdHJpbmcodmFsdWUpIDogdmFsdWU7XG59XG5cbmZ1bmN0aW9uIGdldEZpZWxkc1NldChwYXltZW50VHlwZSwgcmVxdWVzdFR5cGUpIHtcblxuICByZXR1cm4gT2JqZWN0XG4gICAgLmtleXMocGF5bWVudEZpZWxkc1JlbGF0aW9ucylcbiAgICAuZmlsdGVyKGZ1bmN0aW9uIChjdXJyZW50UmVxdWVzdFR5cGUpIHtcblxuICAgICAgcmV0dXJuIHJlcXVlc3RUeXBlID8gY3VycmVudFJlcXVlc3RUeXBlID09PSByZXF1ZXN0VHlwZSA6IHRydWU7XG4gICAgfSlcbiAgICAucmVkdWNlKGZ1bmN0aW9uIChyZXN1bHQsIGN1cnJlbnRSZXF1ZXN0VHlwZSkge1xuICAgICAgdmFyIHBheW1lbnRUeXBlUmVsYXRpb25zID0gcGF5bWVudEZpZWxkc1JlbGF0aW9uc1tjdXJyZW50UmVxdWVzdFR5cGVdO1xuXG4gICAgICByZXR1cm4gT2JqZWN0XG4gICAgICAgIC5rZXlzKHBheW1lbnRUeXBlUmVsYXRpb25zKVxuICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uIChjdXJyZW50UGF5bWVudFR5cGUpIHtcblxuICAgICAgICAgIHJldHVybiBwYXltZW50VHlwZSA/IGN1cnJlbnRQYXltZW50VHlwZSA9PT0gcGF5bWVudFR5cGUgOiB0cnVlO1xuICAgICAgICB9KVxuICAgICAgICAucmVkdWNlKGZ1bmN0aW9uIChuZXh0UmVzdWx0LCBjdXJyZW50VHhuVHlwZSkge1xuICAgICAgICAgIHBheW1lbnRUeXBlUmVsYXRpb25zW2N1cnJlbnRUeG5UeXBlXS5maWVsZHMuZm9yRWFjaChmdW5jdGlvbiAoZmllbGROYW1lKSB7XG4gICAgICAgICAgICBpZiAobmV4dFJlc3VsdC5pbmRleE9mKGZpZWxkTmFtZSkgPT09IC0xKSB7XG4gICAgICAgICAgICAgIG5leHRSZXN1bHQucHVzaChmaWVsZE5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgcmV0dXJuIG5leHRSZXN1bHQ7XG4gICAgICAgIH0sIHJlc3VsdCk7XG5cbiAgICB9LCBbXSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBDcmVkaXRDYXJkRm9ybTogQ3JlZGl0Q2FyZEZvcm1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblxuZnVuY3Rpb24gRXZlbnRlZE1vZGVsKCkge1xuICB0aGlzLl9hdHRyaWJ1dGVzID0gdGhpcy5yZXNldEF0dHJpYnV0ZXMoKTtcbiAgdGhpcy5fbGlzdGVuZXJzID0ge307XG59XG5cbkV2ZW50ZWRNb2RlbC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gZ2V0KGNvbXBvdW5kS2V5KSB7XG4gIHZhciBpLCBrZXksIGtleXM7XG4gIHZhciB0cmF2ZXJzYWwgPSB0aGlzLl9hdHRyaWJ1dGVzO1xuXG4gIGlmIChjb21wb3VuZEtleSA9PSBudWxsKSB7IHJldHVybiB0cmF2ZXJzYWw7IH1cblxuICBrZXlzID0gY29tcG91bmRLZXkuc3BsaXQoJy4nKTtcblxuICBmb3IgKGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgIGtleSA9IGtleXNbaV07XG5cbiAgICBpZiAoIXRyYXZlcnNhbC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgfVxuXG4gICAgdHJhdmVyc2FsID0gdHJhdmVyc2FsW2tleV07XG4gIH1cblxuICByZXR1cm4gdHJhdmVyc2FsO1xufTtcblxuRXZlbnRlZE1vZGVsLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiBzZXQoY29tcG91bmRLZXksIHZhbHVlLCBmb3JjZUNoYW5nZSkge1xuICB2YXIgaSwga2V5LCBrZXlzO1xuICB2YXIgdHJhdmVyc2FsID0gdGhpcy5fYXR0cmlidXRlcztcblxuICBrZXlzID0gY29tcG91bmRLZXkuc3BsaXQoJy4nKTtcblxuICBmb3IgKGkgPSAwOyBpIDwga2V5cy5sZW5ndGggLSAxOyBpKyspIHtcbiAgICBrZXkgPSBrZXlzW2ldO1xuXG4gICAgaWYgKCF0cmF2ZXJzYWwuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgdHJhdmVyc2FsW2tleV0gPSB7fTtcbiAgICB9XG5cbiAgICB0cmF2ZXJzYWwgPSB0cmF2ZXJzYWxba2V5XTtcbiAgfVxuICBrZXkgPSBrZXlzW2ldO1xuXG4gIGlmICh0cmF2ZXJzYWxba2V5XSAhPT0gdmFsdWUgfHwgZm9yY2VDaGFuZ2UpIHtcbiAgICB0cmF2ZXJzYWxba2V5XSA9IHZhbHVlO1xuICAgIHRoaXMuZW1pdCgnY2hhbmdlJyk7XG4gICAgZm9yIChpID0gMTsgaSA8PSBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBrZXkgPSBrZXlzLnNsaWNlKDAsIGkpLmpvaW4oJy4nKTtcbiAgICAgIHRoaXMuZW1pdCgnY2hhbmdlOicgKyBrZXksIHRoaXMuZ2V0KGtleSkpO1xuICAgIH1cbiAgfVxufTtcblxuRXZlbnRlZE1vZGVsLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uIG9uKGV2ZW50LCBoYW5kbGVyKSB7XG4gIHZhciBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnNbZXZlbnRdO1xuXG4gIGlmICghbGlzdGVuZXJzKSB7XG4gICAgdGhpcy5fbGlzdGVuZXJzW2V2ZW50XSA9IFtoYW5kbGVyXTtcbiAgfSBlbHNlIHtcbiAgICBsaXN0ZW5lcnMucHVzaChoYW5kbGVyKTtcbiAgfVxufTtcblxuRXZlbnRlZE1vZGVsLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24gZW1pdChldmVudCkge1xuICB2YXIgaTtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgdmFyIGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVyc1tldmVudF07XG5cbiAgaWYgKCFsaXN0ZW5lcnMpIHsgcmV0dXJuOyB9XG5cbiAgZm9yIChpID0gMDsgaSA8IGxpc3RlbmVycy5sZW5ndGg7IGkrKykge1xuICAgIGxpc3RlbmVyc1tpXS5hcHBseShzZWxmLCBzbGljZS5jYWxsKGFyZ3MsIDEpKTtcbiAgfVxufTtcblxuRXZlbnRlZE1vZGVsLnByb3RvdHlwZS5yZXNldEF0dHJpYnV0ZXMgPSBmdW5jdGlvbiByZXNldEF0dHJpYnV0ZXMoKSB7XG4gIHJldHVybiB7fTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRlZE1vZGVsO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdmFsaWRhdG9yID0gcmVxdWlyZSgnY2FyZC12YWxpZGF0b3InKTtcbnZhciB2ZXJpZmljYXRpb24gPSByZXF1aXJlKCcuL3ZlcmlmaWNhdGlvbicpO1xudmFyIGNvbnN0YW50cyA9IHJlcXVpcmUoJy4uLy4uL3NoYXJlZC9jb25zdGFudHMnKTtcblxudmFyIEFDSCA9IGNvbnN0YW50cy5wYXltZW50VHlwZXMuUEFZTUVOVF9UWVBFX0FDSDtcbnZhciBHSUZUID0gY29uc3RhbnRzLnBheW1lbnRUeXBlcy5QQVlNRU5UX1RZUEVfR0lGVF9DQVJEO1xudmFyIEdJRlRfQ0FSRF9NQVhfTEVOR1RIID0gY29uc3RhbnRzLkdJRlRfQ0FSRF9NQVhfTEVOR1RIO1xudmFyIEdJRlRfQ0FSRF9NSU5fTEVOR1RIID0gY29uc3RhbnRzLkdJRlRfQ0FSRF9NSU5fTEVOR1RIO1xuXG5mdW5jdGlvbiBzZXRDcmVkaXRDYXJkTGVuZ3RoKCkge1xuICBmb3IgKHZhciB0eXBlIGluIHZhbGlkYXRvci5jcmVkaXRDYXJkVHlwZS50eXBlcykge1xuICAgIHZhciBjYXJkVHlwZSA9IHZhbGlkYXRvci5jcmVkaXRDYXJkVHlwZS50eXBlc1t0eXBlXTtcbiAgICB2YXIgY2FyZEluZm8gPSB2YWxpZGF0b3IuY3JlZGl0Q2FyZFR5cGUuZ2V0VHlwZUluZm8oY2FyZFR5cGUpO1xuICAgIHZhbGlkYXRvci5jcmVkaXRDYXJkVHlwZS51cGRhdGVDYXJkKGNhcmRUeXBlLCB7XG4gICAgICBsZW5ndGhzOiBjYXJkSW5mby5sZW5ndGhzLmZpbHRlcihmdW5jdGlvbiAobGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBsZW5ndGggPD0gMTY7XG4gICAgICB9KSxcbiAgICB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBhY2NvdW50TnVtYmVyKHZhbHVlLCBjYXJkRm9ybSkge1xuICB2YXIgaXNWYWxpZDtcbiAgdmFyIHB1cmVWYWx1ZSA9IHZhbHVlLnJlcGxhY2UoL1stXFxzXS9nLCAnJyk7XG5cbiAgc3dpdGNoIChjYXJkRm9ybS5nZXRQYXltZW50VHlwZSgpKSB7XG4gICAgY2FzZSBHSUZUOlxuICAgICAgaXNWYWxpZCA9IHB1cmVWYWx1ZS5sZW5ndGggPj0gR0lGVF9DQVJEX01JTl9MRU5HVEggJiYgcHVyZVZhbHVlLmxlbmd0aCA8PSBHSUZUX0NBUkRfTUFYX0xFTkdUSDtcblxuICAgICAgcmV0dXJuIHsgaXNQb3RlbnRpYWxseVZhbGlkOiBpc1ZhbGlkLCBpc1ZhbGlkOiBpc1ZhbGlkIH07XG4gICAgY2FzZSBBQ0g6XG4gICAgICBpc1ZhbGlkID0gdmFsdWUudHJpbSgpLmxlbmd0aCA+IDAgJiYgdmFsdWUudHJpbSgpLmxlbmd0aCA8PSBjYXJkRm9ybS5nZXRNYXhMZW5ndGgoJ2FjY291bnROdW1iZXInKTtcblxuICAgICAgcmV0dXJuIHZlcmlmaWNhdGlvbihpc1ZhbGlkLCBpc1ZhbGlkKTtcbiAgICBkZWZhdWx0OiAvLyBCeSBkZWZhdWx0IGNyZWRpdCBjYXJkIHdpbGwgYmUgdmFsaWRhdGVkXG4gICAgICBzZXRDcmVkaXRDYXJkTGVuZ3RoKCk7XG4gICAgICByZXR1cm4gdmFsaWRhdG9yLm51bWJlcih2YWx1ZSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhY2NvdW50TnVtYmVyO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIHZlcmlmaWNhdGlvbiA9IHJlcXVpcmUoJy4vdmVyaWZpY2F0aW9uJyk7XG52YXIgdmFsaWRhdG9yID0gcmVxdWlyZSgnY2FyZC12YWxpZGF0b3InKTtcblxuZnVuY3Rpb24gdW5pcShhcnJheSkge1xuICByZXR1cm4gYXJyYXkuZmlsdGVyKGZ1bmN0aW9uIChpdGVtLCBwb3NpdGlvbiwgYXJyKSB7XG4gICAgcmV0dXJuIGFyci5pbmRleE9mKGl0ZW0pID09PSBwb3NpdGlvbjtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGN2diAodmFsdWUsIGNhcmRGb3JtKSB7XG4gIHZhciBjdnZTaXplO1xuICB2YXIgZmllbGRzID0gY2FyZEZvcm0uZ2V0RmllbGRzKCk7XG4gIHZhciBpc1ZhbGlkID0gdHJ1ZTtcblxuICBpZiAoIXZhbHVlKSByZXR1cm4gdmVyaWZpY2F0aW9uKGlzVmFsaWQsIGlzVmFsaWQpO1xuXG4gIGlmIChmaWVsZHMuaW5kZXhPZignYWNjb3VudE51bWJlcicpID09PSAtMSkgeyAvLyBDVlYgb25seVxuICAgIHJldHVybiB2YWxpZGF0b3IuY3Z2KHZhbHVlLCBbMywgNF0pO1xuICB9XG5cbiAgY3Z2U2l6ZSA9IGNhcmRGb3JtLmdldCgncG9zc2libGVDYXJkVHlwZXMnKS5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICByZXR1cm4gaXRlbS5jb2RlLnNpemU7XG4gIH0pO1xuICBjdnZTaXplID0gdW5pcShjdnZTaXplKTtcbiAgcmV0dXJuIHZhbGlkYXRvci5jdnYodmFsdWUsIGN2dlNpemUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGN2djtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHZhbGlkYXRvciA9IHJlcXVpcmUoJ2NhcmQtdmFsaWRhdG9yJyk7XG5cbmZ1bmN0aW9uIHNwbGl0RGF0ZShkYXRlKSB7XG4gIHZhciBtb250aCwgeWVhciwgbGVhZGluZ0RpZ2l0O1xuXG4gIGRhdGUgPSBkYXRlLnJlcGxhY2UoL1tcXC9cXC1cXHNdL2csICcnKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11c2VsZXNzLWVzY2FwZVxuICBsZWFkaW5nRGlnaXQgPSBkYXRlLmNoYXJBdCgwKTtcblxuICBpZiAoZGF0ZS5sZW5ndGggPT09IDApIHtcbiAgICBtb250aCA9IHllYXIgPSAnJztcbiAgfSBlbHNlIGlmIChsZWFkaW5nRGlnaXQgPT09ICcwJyB8fCBsZWFkaW5nRGlnaXQgPT09ICcxJykge1xuICAgIG1vbnRoID0gZGF0ZS5zbGljZSgwLCAyKTtcbiAgICB5ZWFyID0gZGF0ZS5zbGljZSgyKTtcbiAgfSBlbHNlIHtcbiAgICBtb250aCA9ICcwJyArIGxlYWRpbmdEaWdpdDtcbiAgICB5ZWFyID0gZGF0ZS5zbGljZSgxKTtcbiAgfVxuXG4gIHJldHVybiB7IG1vbnRoOiBtb250aCwgeWVhcjogeWVhciB9O1xufVxuXG5cbmZ1bmN0aW9uIGV4cGlyYXRpb25EYXRlICh2YWx1ZSkge1xuICByZXR1cm4gdmFsaWRhdG9yLmV4cGlyYXRpb25EYXRlKHNwbGl0RGF0ZSh2YWx1ZSkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cGlyYXRpb25EYXRlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYWNjb3VudE51bWJlciA9IHJlcXVpcmUoJy4vYWNjb3VudC1udW1iZXInKTtcbnZhciB2ZXJpZnlBY2NvdW50TnVtYmVyID0gcmVxdWlyZSgnLi92ZXJpZnktYWNjb3VudC1udW1iZXInKTtcbnZhciBwb3N0YWxDb2RlID0gcmVxdWlyZSgnLi9wb3N0YWwtY29kZScpO1xudmFyIGN2diA9IHJlcXVpcmUoJy4vY3Z2Jyk7XG52YXIgZXhwRGF0ZSA9IHJlcXVpcmUoJy4vZXhwaXJhdGlvbi1kYXRlJyk7XG52YXIgbmFtZSA9IHJlcXVpcmUoJy4vbmFtZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYWNjb3VudE51bWJlcjogYWNjb3VudE51bWJlcixcbiAgdmVyaWZ5QWNjb3VudE51bWJlcjogdmVyaWZ5QWNjb3VudE51bWJlcixcbiAgcG9zdGFsQ29kZTogcG9zdGFsQ29kZSxcbiAgY3Z2OiBjdnYsXG4gIGV4cERhdGU6IGV4cERhdGUsXG4gIG5hbWU6IG5hbWUsXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdmVyaWZpY2F0aW9uID0gcmVxdWlyZSgnLi92ZXJpZmljYXRpb24nKTtcblxuZnVuY3Rpb24gbmFtZSAodmFsdWUsIGNhcmRGb3JtKSB7XG4gIHZhciBiVmFsaWQgPSB2YWx1ZS50cmltKCkubGVuZ3RoID09PSAwIHx8IHZhbHVlLnRyaW0oKS5sZW5ndGggPD0gY2FyZEZvcm0uZ2V0TWF4TGVuZ3RoKCduYW1lJyk7XG4gIHJldHVybiB2ZXJpZmljYXRpb24oYlZhbGlkLCBmYWxzZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbmFtZTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHZhbGlkYXRvciA9IHJlcXVpcmUoJ2NhcmQtdmFsaWRhdG9yJyk7XG52YXIgdmVyaWZpY2F0aW9uID0gcmVxdWlyZSgnLi92ZXJpZmljYXRpb24nKTtcblxuZnVuY3Rpb24gcG9zdGFsQ29kZSAodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlLnRyaW0oKS5sZW5ndGggPT09IDAgPyB2ZXJpZmljYXRpb24odHJ1ZSwgZmFsc2UpIDogdmFsaWRhdG9yLnBvc3RhbENvZGUodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHBvc3RhbENvZGU7XG4iLCIndXNlIHN0cmljdCc7XG5mdW5jdGlvbiB2ZXJpZmljYXRpb24gKGlzVmFsaWQsIGlzUG90ZW50aWFsbHlWYWxpZCkge1xuICByZXR1cm4geyBpc1ZhbGlkOiBpc1ZhbGlkLCBpc1BvdGVudGlhbGx5VmFsaWQ6IGlzUG90ZW50aWFsbHlWYWxpZCB9O1xufVxubW9kdWxlLmV4cG9ydHMgPSB2ZXJpZmljYXRpb247XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB2YWxpZGF0b3IgPSByZXF1aXJlKCdjYXJkLXZhbGlkYXRvcicpO1xudmFyIHZlcmlmaWNhdGlvbiA9IHJlcXVpcmUoJy4vdmVyaWZpY2F0aW9uJyk7XG52YXIgY29uc3RhbnRzID0gcmVxdWlyZSgnLi4vLi4vc2hhcmVkL2NvbnN0YW50cycpO1xuXG52YXIgQUNIID0gY29uc3RhbnRzLnBheW1lbnRUeXBlcy5QQVlNRU5UX1RZUEVfQUNIO1xudmFyIEdJRlQgPSBjb25zdGFudHMucGF5bWVudFR5cGVzLlBBWU1FTlRfVFlQRV9HSUZUX0NBUkQ7XG5cbmZ1bmN0aW9uIGFjY291bnROdW1iZXIodmFsdWUsIGNhcmRGb3JtKSB7XG4gIHZhciBwdXJlVmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9bLVxcc10vZywgJycpO1xuICB2YXIgYWNjb3VudE51bWJlciA9IGNhcmRGb3JtLmdldCgnYWNjb3VudE51bWJlci52YWx1ZScpO1xuXG4gIHZhciBpc1ZhbGlkID0gcHVyZVZhbHVlID09PSBhY2NvdW50TnVtYmVyO1xuXG4gIHN3aXRjaCAoY2FyZEZvcm0uZ2V0UGF5bWVudFR5cGUoKSkge1xuICAgIGNhc2UgR0lGVDpcbiAgICAgIHJldHVybiB7IGlzUG90ZW50aWFsbHlWYWxpZDogaXNWYWxpZCwgaXNWYWxpZDogaXNWYWxpZCB9O1xuICAgIGNhc2UgQUNIOlxuICAgICAgcmV0dXJuIHZlcmlmaWNhdGlvbihpc1ZhbGlkLCBmYWxzZSk7XG4gICAgZGVmYXVsdDogLy8gQnkgZGVmYXVsdCBjcmVkaXQgY2FyZCB3aWxsIGJlIHZhbGlkYXRlZFxuXG4gICAgICByZXR1cm4gdmFsaWRhdG9yLm51bWJlcih2YWx1ZSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhY2NvdW50TnVtYmVyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY29uc3RhbnRzID0gcmVxdWlyZSgnLi9jb25zdGFudHMnKTtcblxuZnVuY3Rpb24gZ2V0TWF4TGVuZ3RoKHBheW1lbnRUeXBlLCBuYW1lKSB7XG4gIHBheW1lbnRUeXBlID0gcGF5bWVudFR5cGUgfHwgY29uc3RhbnRzLnBheW1lbnRUeXBlcy5QQVlNRU5UX1RZUEVfQ1JFRElUO1xuICByZXR1cm4gKG5hbWUgJiYgY29uc3RhbnRzLndoaXRlbGlzdGVkRmllbGRzW3BheW1lbnRUeXBlXVtuYW1lXS5kZWZhdWx0TWF4TGVuZ3RoKSB8fCBudWxsO1xufVxuXG5mdW5jdGlvbiBnZXRXaGl0ZWxpc3RlZEZpZWxkcyhwYXltZW50VHlwZSkge1xuICBwYXltZW50VHlwZSA9IHBheW1lbnRUeXBlIHx8IGNvbnN0YW50cy5wYXltZW50VHlwZXMuUEFZTUVOVF9UWVBFX0NSRURJVDtcbiAgcmV0dXJuIGNvbnN0YW50cy53aGl0ZWxpc3RlZEZpZWxkc1twYXltZW50VHlwZV07XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBnZXRXaGl0ZWxpc3RlZEZpZWxkczogZ2V0V2hpdGVsaXN0ZWRGaWVsZHMsXG4gIGdldE1heExlbmd0aDogZ2V0TWF4TGVuZ3RoXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLyogZXNsaW50LWRpc2FibGUgbm8tcmVzZXJ2ZWQta2V5cyAqL1xuXG52YXIgZW51bWVyYXRlID0gcmVxdWlyZSgnLi4vLi4vbGliL2VudW1lcmF0ZScpO1xudmFyIFZFUlNJT04gPSBcIndlYi1zZGtcIjtcblxudmFyIHBheW1lbnRUeXBlcyA9IHtcbiAgUEFZTUVOVF9UWVBFX0NSRURJVDogJ2NyZWRpdF9jYXJkJyxcbiAgUEFZTUVOVF9UWVBFX0FDSDogJ2FjaCcsXG4gIFBBWU1FTlRfVFlQRV9HSUZUX0NBUkQ6ICdnaWZ0X2NhcmQnXG59O1xuXG52YXIgQklOX0xPT0tVUF9NQVhfTEVOR1RIID0gNjtcbnZhciBUT0tFTl9UWVBFX0NIRUNLT1VUID0gJ0NIRUNLT1VUJztcbnZhciBDUkVESVQgPSBwYXltZW50VHlwZXMuUEFZTUVOVF9UWVBFX0NSRURJVDtcbnZhciBBQ0ggPSBwYXltZW50VHlwZXMuUEFZTUVOVF9UWVBFX0FDSDtcbnZhciBHSUZUID0gcGF5bWVudFR5cGVzLlBBWU1FTlRfVFlQRV9HSUZUX0NBUkQ7XG5cbnZhciByZXF1ZXN0VHlwZXMgPSB7XG4gIFJFUVVFU1RfVFlQRV9UT0tFTklaQVRJT046ICd0b2tlbml6YXRpb24nXG59O1xuXG52YXIgdG9rZW5pemVyTm9uU2VjdXJlRmllbGRzID0gW1xuICAnYmlsbGluZ0FkZHJlc3MnLFxuICAnY29tcGFueScsXG4gICdlbWFpbCcsXG4gICduYW1lJyxcbiAgJ3Bob25lTnVtYmVyJyxcbiAgJ2N1c3RvbWVyJyxcbiAgJ2FjY291bnRWYWxpZGF0aW9uJyxcbiAgJ2JhbmtBY2NvdW50VHlwZScsXG4gICdyb3V0aW5nTnVtYmVyJ1xuXTtcblxudmFyIEdJRlRfQ0FSRF9NSU5fTEVOR1RIID0gMTI7XG52YXIgR0lGVF9DQVJEX01BWF9MRU5HVEggPSAyMDtcblxudmFyIHdoaXRlbGlzdGVkRmllbGRzID0ge307XG53aGl0ZWxpc3RlZEZpZWxkc1tDUkVESVRdID0ge1xuICAvLyBQQU4tVkFVTFQ6XG4gIGFjY291bnROdW1iZXI6IHtcbiAgICBuYW1lOiAnYWNjb3VudC1udW1iZXInLFxuICAgIGxhYmVsOiAnQ2FyZCBOdW1iZXInLFxuICAgIGRlZmF1bHRNYXhMZW5ndGg6IDIyXG4gIH0sXG4gIHBvc3RhbENvZGU6IHtcbiAgICBuYW1lOiAncG9zdGFsLWNvZGUnLFxuICAgIGxhYmVsOiAnQ3VzdG9tZXIgcG9zdGFsIGNvZGUnLFxuICAgIGRlZmF1bHRNYXhMZW5ndGg6IDVcbiAgfSxcbiAgZXhwRGF0ZToge1xuICAgIG5hbWU6ICdleHAtZGF0ZScsXG4gICAgbGFiZWw6ICdFeHBpcmF0aW9uIERhdGUnLFxuICAgIGRlZmF1bHRNYXhMZW5ndGg6IDVcbiAgfSxcbiAgY3Z2OiB7XG4gICAgbmFtZTogJ2N2dicsXG4gICAgbGFiZWw6ICdDVlYnLFxuICAgIGRlZmF1bHRNYXhMZW5ndGg6IDRcbiAgfSxcbiAgbmFtZToge1xuICAgIG5hbWU6ICduYW1lJyxcbiAgICBsYWJlbDogJ0NhcmRob2xkZXIgTmFtZScsXG4gICAgZGVmYXVsdE1heExlbmd0aDogNjRcbiAgfSxcbn07XG5cbndoaXRlbGlzdGVkRmllbGRzW0FDSF0gPSB7XG4gIC8vIFBBTi1WQVVMVDpcbiAgYWNjb3VudE51bWJlcjogeyAvLyAqXG4gICAgbmFtZTogJ2FjY291bnQtbnVtYmVyJyxcbiAgICBsYWJlbDogJ0JhbmsgQ2FyZCBOdW1iZXInLFxuICAgIGRlZmF1bHRNYXhMZW5ndGg6IDE2XG4gIH0sXG4gIHZlcmlmeUFjY291bnROdW1iZXI6IHtcbiAgICBuYW1lOiAndmVyaWZ5LWFjY291bnQtbnVtYmVyJyxcbiAgICBsYWJlbDogJ1ZlcmlmeSBDYXJkIE51bWJlcicsXG4gICAgZGVmYXVsdE1heExlbmd0aDogMTZcbiAgfSxcbiAgcG9zdGFsQ29kZToge1xuICAgIG5hbWU6ICdwb3N0YWwtY29kZScsXG4gICAgbGFiZWw6ICdDdXN0b21lciBwb3N0YWwgY29kZScsXG4gICAgZGVmYXVsdE1heExlbmd0aDogNVxuICB9XG59O1xuXG53aGl0ZWxpc3RlZEZpZWxkc1tHSUZUXSA9IHtcbiAgLy8gUEFOLVZBVUxUOlxuICBhY2NvdW50TnVtYmVyOiB7XG4gICAgbmFtZTogJ2FjY291bnQtbnVtYmVyJyxcbiAgICBsYWJlbDogJ0NhcmQgTnVtYmVyJyxcbiAgICBkZWZhdWx0TWF4TGVuZ3RoOiAyMlxuICB9LFxuICBwb3N0YWxDb2RlOiB7XG4gICAgbmFtZTogJ3Bvc3RhbC1jb2RlJyxcbiAgICBsYWJlbDogJ0N1c3RvbWVyIHBvc3RhbCBjb2RlJyxcbiAgICBkZWZhdWx0TWF4TGVuZ3RoOiA1XG4gIH1cbn07XG5cbnZhciBjb25zdGFudHMgPSB7XG4gIFZFUlNJT046IFZFUlNJT04sXG4gIG1heEV4cGlyYXRpb25ZZWFyQWdlOiAzMSxcbiAgZXh0ZXJuYWxFdmVudHM6IHtcbiAgICBDSEFOR0U6ICdjaGFuZ2UnLFxuICAgIEZPQ1VTOiAnZm9jdXMnLFxuICAgIEJMVVI6ICdibHVyJyxcbiAgICBFTVBUWTogJ2VtcHR5JyxcbiAgICBOT1RfRU1QVFk6ICdub3RFbXB0eScsXG4gICAgVkFMSURJVFlfQ0hBTkdFOiAndmFsaWRpdHlDaGFuZ2UnLFxuICAgIENBUkRfVFlQRV9DSEFOR0U6ICdjYXJkVHlwZUNoYW5nZScsXG4gICAgQ0FSRF9JTkZPX0xPQURFRDogJ2NhcmRJbmZvTG9hZGVkJ1xuICB9LFxuICBleHRlcm5hbENsYXNzZXM6IHtcbiAgICBQT1RFTlRJQUxMWV9WQUxJRDogJ3NlYW1sZXNzcGF5LWhvc3RlZC1maWVsZHMtcG90ZW50aWFsbHktdmFsaWQnLFxuICAgIEZPQ1VTRUQ6ICdzZWFtbGVzc3BheS1ob3N0ZWQtZmllbGRzLWZvY3VzZWQnLFxuICAgIElOVkFMSUQ6ICdzZWFtbGVzc3BheS1ob3N0ZWQtZmllbGRzLWludmFsaWQnLFxuICAgIFZBTElEOiAnc2VhbWxlc3NwYXktaG9zdGVkLWZpZWxkcy12YWxpZCdcbiAgfSxcbiAgZGVmYXVsdElGcmFtZVN0eWxlOiB7XG4gICAgYm9yZGVyOiAnbm9uZScsXG4gICAgd2lkdGg6ICcxMDAlJyxcbiAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAnZmxvYXQnOiAnbGVmdCdcbiAgfSxcbiAgd2hpdGVsaXN0ZWRTdHlsZXM6IFtcbiAgICAnLW1vei1hcHBlYXJhbmNlJyxcbiAgICAnLW1vei1vc3gtZm9udC1zbW9vdGhpbmcnLFxuICAgICctbW96LXRhcC1oaWdobGlnaHQtY29sb3InLFxuICAgICctbW96LXRyYW5zaXRpb24nLFxuICAgICctd2Via2l0LWFwcGVhcmFuY2UnLFxuICAgICctd2Via2l0LWZvbnQtc21vb3RoaW5nJyxcbiAgICAnLXdlYmtpdC10YXAtaGlnaGxpZ2h0LWNvbG9yJyxcbiAgICAnLXdlYmtpdC10cmFuc2l0aW9uJyxcbiAgICAnYXBwZWFyYW5jZScsXG4gICAgJ2JvcmRlci1yYWRpdXMnLFxuICAgICdjb2xvcicsXG4gICAgJ2RpcmVjdGlvbicsXG4gICAgJ2ZvbnQnLFxuICAgICdmb250LWZhbWlseScsXG4gICAgJ2ZvbnQtc2l6ZScsXG4gICAgJ2ZvbnQtc2l6ZS1hZGp1c3QnLFxuICAgICdmb250LXN0cmV0Y2gnLFxuICAgICdmb250LXN0eWxlJyxcbiAgICAnZm9udC12YXJpYW50JyxcbiAgICAnZm9udC12YXJpYW50LWFsdGVybmF0ZXMnLFxuICAgICdmb250LXZhcmlhbnQtY2FwcycsXG4gICAgJ2ZvbnQtdmFyaWFudC1lYXN0LWFzaWFuJyxcbiAgICAnZm9udC12YXJpYW50LWxpZ2F0dXJlcycsXG4gICAgJ2ZvbnQtdmFyaWFudC1udW1lcmljJyxcbiAgICAnZm9udC13ZWlnaHQnLFxuICAgICdsZXR0ZXItc3BhY2luZycsXG4gICAgJ2xpbmUtaGVpZ2h0JyxcbiAgICAnbWFyZ2luJyxcbiAgICAnbWFyZ2luLXRvcCcsXG4gICAgJ21hcmdpbi1yaWdodCcsXG4gICAgJ21hcmdpbi1ib3R0b20nLFxuICAgICdtYXJnaW4tbGVmdCcsXG4gICAgJ29wYWNpdHknLFxuICAgICdvdXRsaW5lJyxcbiAgICAncGFkZGluZycsXG4gICAgJ3BhZGRpbmctdG9wJyxcbiAgICAncGFkZGluZy1yaWdodCcsXG4gICAgJ3BhZGRpbmctYm90dG9tJyxcbiAgICAncGFkZGluZy1sZWZ0JyxcbiAgICAndGV4dC1hbGlnbicsXG4gICAgJ3RleHQtc2hhZG93JyxcbiAgICAndHJhbnNpdGlvbidcbiAgXSxcbiAgd2hpdGVsaXN0ZWRGaWVsZHM6IHdoaXRlbGlzdGVkRmllbGRzLFxuICB3aGl0ZWxpc3RlZEF0dHJpYnV0ZXM6IHtcbiAgICAnYXJpYS1pbnZhbGlkJzogJ2Jvb2xlYW4nLFxuICAgICdhcmlhLXJlcXVpcmVkJzogJ2Jvb2xlYW4nLFxuICAgIGRpc2FibGVkOiAnYm9vbGVhbicsXG4gICAgcGxhY2Vob2xkZXI6ICdzdHJpbmcnXG4gIH0sXG4gIGF1dG9jb21wbGV0ZU1hcHBpbmdzOiB7XG4gICAgJ2FjY291bnQtbnVtYmVyJzogJ2NjLW51bWJlcicsXG4gICAgJ2V4cC1kYXRlJzogJ2NjLWV4cCcsXG4gICAgY3Z2OiAnY2MtY3NjJyxcbiAgICAncG9zdGFsLWNvZGUnOiAnYmlsbGluZyBwb3N0YWwtY29kZScsXG4gICAgbmFtZTogJ2NjLW5hbWUnLFxuICB9LFxuICBwYXltZW50VHlwZXM6IHBheW1lbnRUeXBlcyxcbiAgcmVxdWVzdFR5cGVzOiByZXF1ZXN0VHlwZXMsXG4gIEdJRlRfQ0FSRF9NSU5fTEVOR1RIOiBHSUZUX0NBUkRfTUlOX0xFTkdUSCxcbiAgR0lGVF9DQVJEX01BWF9MRU5HVEg6IEdJRlRfQ0FSRF9NQVhfTEVOR1RILFxuICBUT0tFTl9UWVBFX0NIRUNLT1VUOiBUT0tFTl9UWVBFX0NIRUNLT1VULFxuICBCSU5fTE9PS1VQX01BWF9MRU5HVEg6IEJJTl9MT09LVVBfTUFYX0xFTkdUSCxcbiAgdG9rZW5pemVyTm9uU2VjdXJlRmllbGRzOiB0b2tlbml6ZXJOb25TZWN1cmVGaWVsZHMsXG4gIGNhcmRCcmFuZE1hcDoge1xuICAgIHZpc2E6ICd2aXNhJyxcbiAgICBtYXN0ZXJjYXJkOiAnbWFzdGVyY2FyZCcsXG4gICAgJ2FtZXJpY2FuLWV4cHJlc3MnOiAnYW1leCcsXG4gICAgJ2RpbmVycy1jbHViJzogJ2RpbmVycycsXG4gICAgZGlzY292ZXI6ICdkaXNjb3ZlcicsXG4gICAgamNiOiAnamNiJyxcbiAgICB1bmlvbnBheTogJ3VuaW9ucGF5JyxcbiAgICBtYWVzdHJvOiAnbWFzdGVyY2FyZCcsXG4gICAgZWxvOiAnZGlzY292ZXInLFxuICAgIG1pcjogJ3Vua25vd24nLFxuICAgIGhpcGVyOiAnZGlzY292ZXInLFxuICAgIGhpcGVyY2FyZDogJ2Rpc2NvdmVyJ1xuICB9XG59O1xuXG5jb25zdGFudHMuZXZlbnRzID0gZW51bWVyYXRlKFtcbiAgJ0FVVE9GSUxMX0VYUElSQVRJT05fREFURScsXG4gICdQT1BVTEFURV9UT0tFTicsXG4gICdGUkFNRV9SRUFEWScsXG4gICdWQUxJREFURV9TVFJJQ1QnLFxuICAnQ09ORklHVVJBVElPTicsXG4gICdUT0tFTklaQVRJT05fUkVRVUVTVCcsXG4gICdJTlBVVF9FVkVOVCcsXG4gICdUUklHR0VSX0lOUFVUX0ZPQ1VTJyxcbiAgJ0FERF9DTEFTUycsXG4gICdSRU1PVkVfQ0xBU1MnLFxuICAnU0VUX0FUVFJJQlVURScsXG4gICdSRU1PVkVfQVRUUklCVVRFJyxcbiAgJ0NMRUFSX0ZJRUxEJ1xuXSwgJ2hvc3RlZC1maWVsZHM6Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gY29uc3RhbnRzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgU2VhbWxlc3NwYXlFcnJvciA9IHJlcXVpcmUoJy4uLy4uL2xpYi9zZWFtbGVzc3BheS1lcnJvcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgSE9TVEVEX0ZJRUxEU19JTlZBTElEX0ZJRUxEX0tFWToge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTUVSQ0hBTlQsXG4gICAgY29kZTogJ0hPU1RFRF9GSUVMRFNfSU5WQUxJRF9GSUVMRF9LRVknXG4gIH0sXG4gIEhPU1RFRF9GSUVMRFNfSU5WQUxJRF9GSUVMRF9ERUZBVUxUX1ZBTFVFOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnSE9TVEVEX0ZJRUxEU19JTlZBTElEX0ZJRUxEX0RFRkFVTFRfVkFMVUUnXG4gIH0sXG4gIEhPU1RFRF9GSUVMRFNfSU5WQUxJRF9GSUVMRF9TRUxFQ1RPUjoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTUVSQ0hBTlQsXG4gICAgY29kZTogJ0hPU1RFRF9GSUVMRFNfSU5WQUxJRF9GSUVMRF9TRUxFQ1RPUicsXG4gICAgbWVzc2FnZTogJ1NlbGVjdG9yIGRvZXMgbm90IHJlZmVyZW5jZSBhIHZhbGlkIERPTSBub2RlLidcbiAgfSxcbiAgSE9TVEVEX0ZJRUxEU19JTlZBTElEX1NVQk1JVF9CVVRUT05fU0VMRUNUT1I6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLk1FUkNIQU5ULFxuICAgIGNvZGU6ICdIT1NURURfRklFTERTX0lOVkFMSURfU1VCTUlUX0JVVFRPTl9TRUxFQ1RPUicsXG4gICAgbWVzc2FnZTogJ1NlbGVjdG9yIGRvZXMgbm90IHJlZmVyZW5jZSBhIHZhbGlkIERPTSBub2RlLidcbiAgfSxcbiAgSE9TVEVEX0ZJRUxEU19GSUVMRF9EVVBMSUNBVEVfSUZSQU1FOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnSE9TVEVEX0ZJRUxEU19GSUVMRF9EVVBMSUNBVEVfSUZSQU1FJyxcbiAgICBtZXNzYWdlOiAnRWxlbWVudCBhbHJlYWR5IGNvbnRhaW5zIGEgU2VhbWxlc3NwYXkgaWZyYW1lLidcbiAgfSxcbiAgSE9TVEVEX0ZJRUxEU19GSUVMRF9JTlZBTElEOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnSE9TVEVEX0ZJRUxEU19GSUVMRF9JTlZBTElEJ1xuICB9LFxuICBIT1NURURfRklFTERTX0ZJRUxEX05PVF9QUkVTRU5UOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnSE9TVEVEX0ZJRUxEU19GSUVMRF9OT1RfUFJFU0VOVCdcbiAgfSxcbiAgSE9TVEVEX0ZJRUxEU19UT0tFTklaQVRJT05fTkVUV09SS19FUlJPUjoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTkVUV09SSyxcbiAgICBjb2RlOiAnSE9TVEVEX0ZJRUxEU19UT0tFTklaQVRJT05fTkVUV09SS19FUlJPUicsXG4gICAgbWVzc2FnZTogJ0EgdG9rZW5pemF0aW9uIG5ldHdvcmsgZXJyb3Igb2NjdXJyZWQuJ1xuICB9LFxuICBIT1NURURfRklFTERTX0ZBSUxFRF9UT0tFTklaQVRJT046IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLkNVU1RPTUVSLFxuICAgIGNvZGU6ICdIT1NURURfRklFTERTX0ZBSUxFRF9UT0tFTklaQVRJT04nLFxuICAgIG1lc3NhZ2U6ICdUaGUgc3VwcGxpZWQgY2FyZCBkYXRhIGZhaWxlZCB0b2tlbml6YXRpb24uJ1xuICB9LFxuICBIT1NURURfRklFTERTX0ZJRUxEU19FTVBUWToge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuQ1VTVE9NRVIsXG4gICAgY29kZTogJ0hPU1RFRF9GSUVMRFNfRklFTERTX0VNUFRZJyxcbiAgICBtZXNzYWdlOiAnQWxsIGZpZWxkcyBhcmUgZW1wdHkuIENhbm5vdCB0b2tlbml6ZSBlbXB0eSBjYXJkIGZpZWxkcy4nXG4gIH0sXG4gIEhPU1RFRF9GSUVMRFNfRklFTERTX0lOVkFMSUQ6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLkNVU1RPTUVSLFxuICAgIGNvZGU6ICdIT1NURURfRklFTERTX0ZJRUxEU19JTlZBTElEJyxcbiAgICBtZXNzYWdlOiAnU29tZSBwYXltZW50IGlucHV0IGZpZWxkcyBhcmUgaW52YWxpZC4gQ2Fubm90IHRva2VuaXplIGludmFsaWQgY2FyZCBmaWVsZHMuJ1xuICB9LFxuICBIT1NURURfRklFTERTX0FUVFJJQlVURV9OT1RfU1VQUE9SVEVEOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnSE9TVEVEX0ZJRUxEU19BVFRSSUJVVEVfTk9UX1NVUFBPUlRFRCdcbiAgfSxcbiAgSE9TVEVEX0ZJRUxEU19BVFRSSUJVVEVfVkFMVUVfTk9UX0FMTE9XRUQ6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLk1FUkNIQU5ULFxuICAgIGNvZGU6ICdIT1NURURfRklFTERTX0FUVFJJQlVURV9WQUxVRV9OT1RfQUxMT1dFRCdcbiAgfSxcbiAgSE9TVEVEX0ZJRUxEU19JTkNPTVBBVElCTEVfRklFTERTX1NFVDoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTUVSQ0hBTlQsXG4gICAgY29kZTogJ0hPU1RFRF9GSUVMRFNfSU5DT01QQVRJQkxFX0ZJRUxEU19TRVQnXG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgY29uc3RhbnRzID0gcmVxdWlyZSgnLi9jb25zdGFudHMnKTtcblxudmFyIHJlcXVlc3RUeXBlcyA9IGNvbnN0YW50cy5yZXF1ZXN0VHlwZXM7XG52YXIgcGF5bWVudFR5cGVzID0gY29uc3RhbnRzLnBheW1lbnRUeXBlcztcblxudmFyIFRPS0VOSVpBVElPTiA9IHJlcXVlc3RUeXBlcy5SRVFVRVNUX1RZUEVfVE9LRU5JWkFUSU9OO1xuXG52YXIgQ1JFRElUID0gcGF5bWVudFR5cGVzLlBBWU1FTlRfVFlQRV9DUkVESVQ7XG52YXIgQUNIID0gcGF5bWVudFR5cGVzLlBBWU1FTlRfVFlQRV9BQ0g7XG52YXIgR0lGVF9DQVJEID0gcGF5bWVudFR5cGVzLlBBWU1FTlRfVFlQRV9HSUZUX0NBUkQ7XG5cbnZhciByZWxhdGlvbnMgPSB7fTtcbnJlbGF0aW9uc1tUT0tFTklaQVRJT05dID0ge307XG5cbnJlbGF0aW9uc1tUT0tFTklaQVRJT05dW0NSRURJVF0gPSB7XG4gIGZpZWxkczogW1xuICAgICdhY2NvdW50TnVtYmVyJyxcbiAgICAncG9zdGFsQ29kZScsXG4gICAgJ2V4cERhdGUnLFxuICAgICdjdnYnXG4gIF0sXG4gIG9uZU9mOiBbXG4gICAge1xuICAgICAgcmVxdWlyZWQ6IFsgJ2FjY291bnROdW1iZXInLCAnZXhwRGF0ZScgXVxuICAgIH1cbiAgXVxufTtcblxuXG5yZWxhdGlvbnNbVE9LRU5JWkFUSU9OXVtBQ0hdID0ge1xuICBmaWVsZHM6IFtcbiAgICAnYWNjb3VudE51bWJlcicsXG4gICAgJ3Bvc3RhbENvZGUnLFxuICAgICd2ZXJpZnlBY2NvdW50TnVtYmVyJ1xuICBdLFxuICBkZWZhdWx0VmFsdWVzOiB7fSxcbiAgb25lT2Y6IFtcbiAgICB7IHJlcXVpcmVkOiBbICdhY2NvdW50TnVtYmVyJyBdIH0sXG4gIF0sXG4gIHJlbGF0ZWRGaWVsZHNSdWxlczogW1xuICAgIHtcbiAgICAgIGNvbmZpZzogJ2dhdGV3YXlDb25maWd1cmF0aW9uLm1lcmNoYW50LnByb2Nlc3NvckFjaC5uYW1lJyxcbiAgICAgIHZhbHVlOiAnQ0hDJyxcbiAgICAgIGRlcGVuZGVuY2llczoge31cbiAgICB9XG4gIF0sXG59O1xuXG5yZWxhdGlvbnNbVE9LRU5JWkFUSU9OXVtHSUZUX0NBUkRdID0ge1xuICBmaWVsZHM6IFtcbiAgICAnYWNjb3VudE51bWJlcicsXG4gICAgJ3Bvc3RhbENvZGUnXG4gIF0sXG4gIG9uZU9mOiBbXG4gICAgeyByZXF1aXJlZDogWyAnYWNjb3VudE51bWJlcicgXSB9XG4gIF1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gcmVsYXRpb25zO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBhZGRNZXRhZGF0YShjb25maWd1cmF0aW9uLCBkYXRhKSB7XG4gIGlmIChjb25maWd1cmF0aW9uLm1ldGFkYXRhKSB7XG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIGRhdGEubWV0YWRhdGEgPSBjb25maWd1cmF0aW9uLm1ldGFkYXRhO1xuICAgIH0gZWxzZSB7XG4gICAgICBkYXRhID0ge1xuICAgICAgICBtZXRhZGF0YTogY29uZmlndXJhdGlvbi5tZXRhZGF0YVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZGF0YVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFkZE1ldGFkYXRhO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBhc3NlbWJsZUlGcmFtZXMod2luKSB7XG4gIHZhciBpLCBmcmFtZTtcbiAgdmFyIGZyYW1lcyA9IFtdO1xuXG4gIGZvciAoaSA9IDA7IGkgPCB3aW4uZnJhbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgZnJhbWUgPSB3aW4uZnJhbWVzW2ldO1xuXG4gICAgdHJ5IHtcbiAgICAgIGlmIChmcmFtZS5sb2NhdGlvbi5ocmVmID09PSB3aW5kb3cubG9jYXRpb24uaHJlZikge1xuICAgICAgICBmcmFtZXMucHVzaChmcmFtZSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkgeyAvKiBpZ25vcmVkICovIH1cbiAgfVxuXG4gIHJldHVybiBmcmFtZXM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhc3NlbWJsZUlGcmFtZXM6IGFzc2VtYmxlSUZyYW1lc1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGFzc2lnbk5vcm1hbGl6ZWQgPSB0eXBlb2YgT2JqZWN0LmFzc2lnbiA9PT0gJ2Z1bmN0aW9uJyA/IE9iamVjdC5hc3NpZ24gOiBhc3NpZ25Qb2x5ZmlsbDtcblxuZnVuY3Rpb24gYXNzaWduUG9seWZpbGwoZGVzdGluYXRpb24pIHtcbiAgdmFyIGksIHNvdXJjZSwga2V5O1xuXG4gIGZvciAoaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICBzb3VyY2UgPSBhcmd1bWVudHNbaV07XG4gICAgZm9yIChrZXkgaW4gc291cmNlKSB7XG4gICAgICBpZiAoc291cmNlLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgZGVzdGluYXRpb25ba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBkZXN0aW5hdGlvbjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFzc2lnbjogYXNzaWduTm9ybWFsaXplZCxcbiAgX2Fzc2lnbjogYXNzaWduUG9seWZpbGxcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc1doaXRlbGlzdGVkRG9tYWluID0gcmVxdWlyZSgnLi4vaXMtd2hpdGVsaXN0ZWQtZG9tYWluJyk7XG5cbmZ1bmN0aW9uIGNoZWNrT3JpZ2luKHBvc3RNZXNzYWdlT3JpZ2luLCBtZXJjaGFudFVybCkge1xuICB2YXIgbWVyY2hhbnRPcmlnaW4sIG1lcmNoYW50SG9zdDtcbiAgdmFyIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG5cbiAgYS5ocmVmID0gbWVyY2hhbnRVcmw7XG5cbiAgaWYgKGEucHJvdG9jb2wgPT09ICdodHRwczonKSB7XG4gICAgbWVyY2hhbnRIb3N0ID0gYS5ob3N0LnJlcGxhY2UoLzo0NDMkLywgJycpO1xuICB9IGVsc2UgaWYgKGEucHJvdG9jb2wgPT09ICdodHRwOicpIHtcbiAgICBtZXJjaGFudEhvc3QgPSBhLmhvc3QucmVwbGFjZSgvOjgwJC8sICcnKTtcbiAgfSBlbHNlIHtcbiAgICBtZXJjaGFudEhvc3QgPSBhLmhvc3Q7XG4gIH1cblxuICBtZXJjaGFudE9yaWdpbiA9IGEucHJvdG9jb2wgKyAnLy8nICsgbWVyY2hhbnRIb3N0O1xuXG4gIGlmIChtZXJjaGFudE9yaWdpbiA9PT0gcG9zdE1lc3NhZ2VPcmlnaW4pIHsgcmV0dXJuIHRydWU7IH1cblxuICBhLmhyZWYgPSBwb3N0TWVzc2FnZU9yaWdpbjtcblxuICByZXR1cm4gaXNXaGl0ZWxpc3RlZERvbWFpbihwb3N0TWVzc2FnZU9yaWdpbik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBjaGVja09yaWdpbjogY2hlY2tPcmlnaW5cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBlbnVtZXJhdGUgPSByZXF1aXJlKCcuLi9lbnVtZXJhdGUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBlbnVtZXJhdGUoW1xuICAnQ09ORklHVVJBVElPTl9SRVFVRVNUJ1xuXSwgJ2J1czonKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJ1cyA9IHJlcXVpcmUoJ2ZyYW1lYnVzJyk7XG52YXIgZXZlbnRzID0gcmVxdWlyZSgnLi9ldmVudHMnKTtcbnZhciBjaGVja09yaWdpbiA9IHJlcXVpcmUoJy4vY2hlY2stb3JpZ2luJykuY2hlY2tPcmlnaW47XG52YXIgU2VhbWxlc3NwYXlFcnJvciA9IHJlcXVpcmUoJy4uL3NlYW1sZXNzcGF5LWVycm9yJyk7XG5cbmZ1bmN0aW9uIFNlYW1sZXNzcGF5QnVzKG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgdGhpcy5jaGFubmVsID0gb3B0aW9ucy5jaGFubmVsO1xuICBpZiAoIXRoaXMuY2hhbm5lbCkge1xuICAgIHRocm93IG5ldyBTZWFtbGVzc3BheUVycm9yKHtcbiAgICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuSU5URVJOQUwsXG4gICAgICBjb2RlOiAnTUlTU0lOR19DSEFOTkVMX0lEJyxcbiAgICAgIG1lc3NhZ2U6ICdDaGFubmVsIElEIG11c3QgYmUgc3BlY2lmaWVkLidcbiAgICB9KTtcbiAgfVxuXG4gIHRoaXMubWVyY2hhbnRVcmwgPSBvcHRpb25zLm1lcmNoYW50VXJsO1xuXG4gIHRoaXMuX2lzRGVzdHJveWVkID0gZmFsc2U7XG4gIHRoaXMuX2lzVmVyYm9zZSA9IGZhbHNlO1xuXG4gIHRoaXMuX2xpc3RlbmVycyA9IFtdO1xuXG4gIHRoaXMuX2xvZygnbmV3IGJ1cyBvbiBjaGFubmVsICcgKyB0aGlzLmNoYW5uZWwsIFtsb2NhdGlvbi5ocmVmXSk7XG59XG5cblNlYW1sZXNzcGF5QnVzLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uIChldmVudE5hbWUsIG9yaWdpbmFsSGFuZGxlcikge1xuICB2YXIgbmFtZXNwYWNlZEV2ZW50LCBhcmdzO1xuICB2YXIgaGFuZGxlciA9IG9yaWdpbmFsSGFuZGxlcjtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIGlmICh0aGlzLl9pc0Rlc3Ryb3llZCkgeyByZXR1cm47IH1cblxuICBpZiAodGhpcy5tZXJjaGFudFVybCkge1xuICAgIGhhbmRsZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby1pbnZhbGlkLXRoaXMgKi9cbiAgICAgIGlmIChjaGVja09yaWdpbih0aGlzLm9yaWdpbiwgc2VsZi5tZXJjaGFudFVybCkpIHtcbiAgICAgICAgb3JpZ2luYWxIYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9XG4gICAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLWludmFsaWQtdGhpcyAqL1xuICAgIH07XG4gIH1cblxuICBuYW1lc3BhY2VkRXZlbnQgPSB0aGlzLl9uYW1lc3BhY2VFdmVudChldmVudE5hbWUpO1xuICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgYXJnc1swXSA9IG5hbWVzcGFjZWRFdmVudDtcbiAgYXJnc1sxXSA9IGhhbmRsZXI7XG5cbiAgdGhpcy5fbG9nKCdvbicsIGFyZ3MpO1xuICBidXMub24uYXBwbHkoYnVzLCBhcmdzKTtcblxuICB0aGlzLl9saXN0ZW5lcnMucHVzaCh7XG4gICAgZXZlbnROYW1lOiBldmVudE5hbWUsXG4gICAgaGFuZGxlcjogaGFuZGxlcixcbiAgICBvcmlnaW5hbEhhbmRsZXI6IG9yaWdpbmFsSGFuZGxlclxuICB9KTtcbn07XG5cblNlYW1sZXNzcGF5QnVzLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24gKGV2ZW50TmFtZSkge1xuICB2YXIgYXJncztcblxuICBpZiAodGhpcy5faXNEZXN0cm95ZWQpIHsgcmV0dXJuOyB9XG5cbiAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gIGFyZ3NbMF0gPSB0aGlzLl9uYW1lc3BhY2VFdmVudChldmVudE5hbWUpO1xuXG4gIHRoaXMuX2xvZygnZW1pdCcsIGFyZ3MpO1xuICBidXMuZW1pdC5hcHBseShidXMsIGFyZ3MpO1xufTtcblxuU2VhbWxlc3NwYXlCdXMucHJvdG90eXBlLl9vZmZEaXJlY3QgPSBmdW5jdGlvbiAoZXZlbnROYW1lKSB7XG4gIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcblxuICBpZiAodGhpcy5faXNEZXN0cm95ZWQpIHsgcmV0dXJuOyB9XG5cbiAgYXJnc1swXSA9IHRoaXMuX25hbWVzcGFjZUV2ZW50KGV2ZW50TmFtZSk7XG5cbiAgdGhpcy5fbG9nKCdvZmYnLCBhcmdzKTtcbiAgYnVzLm9mZi5hcHBseShidXMsIGFyZ3MpO1xufTtcblxuU2VhbWxlc3NwYXlCdXMucHJvdG90eXBlLm9mZiA9IGZ1bmN0aW9uIChldmVudE5hbWUsIG9yaWdpbmFsSGFuZGxlcikge1xuICB2YXIgaSwgbGlzdGVuZXI7XG4gIHZhciBoYW5kbGVyID0gb3JpZ2luYWxIYW5kbGVyO1xuXG4gIGlmICh0aGlzLl9pc0Rlc3Ryb3llZCkgeyByZXR1cm47IH1cblxuICBpZiAodGhpcy5tZXJjaGFudFVybCkge1xuICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLl9saXN0ZW5lcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxpc3RlbmVyID0gdGhpcy5fbGlzdGVuZXJzW2ldO1xuXG4gICAgICBpZiAobGlzdGVuZXIub3JpZ2luYWxIYW5kbGVyID09PSBvcmlnaW5hbEhhbmRsZXIpIHtcbiAgICAgICAgaGFuZGxlciA9IGxpc3RlbmVyLmhhbmRsZXI7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdGhpcy5fb2ZmRGlyZWN0KGV2ZW50TmFtZSwgaGFuZGxlcik7XG59O1xuXG5TZWFtbGVzc3BheUJ1cy5wcm90b3R5cGUuX25hbWVzcGFjZUV2ZW50ID0gZnVuY3Rpb24gKGV2ZW50TmFtZSkge1xuICByZXR1cm4gWydzZWFtbGVzc3BheScsIHRoaXMuY2hhbm5lbCwgZXZlbnROYW1lXS5qb2luKCc6Jyk7XG59O1xuXG5TZWFtbGVzc3BheUJ1cy5wcm90b3R5cGUudGVhcmRvd24gPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBsaXN0ZW5lciwgaTtcblxuICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5fbGlzdGVuZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgbGlzdGVuZXIgPSB0aGlzLl9saXN0ZW5lcnNbaV07XG4gICAgdGhpcy5fb2ZmRGlyZWN0KGxpc3RlbmVyLmV2ZW50TmFtZSwgbGlzdGVuZXIuaGFuZGxlcik7XG4gIH1cblxuICB0aGlzLl9saXN0ZW5lcnMubGVuZ3RoID0gMDtcblxuICB0aGlzLl9pc0Rlc3Ryb3llZCA9IHRydWU7XG59O1xuXG5TZWFtbGVzc3BheUJ1cy5wcm90b3R5cGUuX2xvZyA9IGZ1bmN0aW9uIChmdW5jdGlvbk5hbWUsIGFyZ3MpIHtcbiAgaWYgKHRoaXMuX2lzVmVyYm9zZSkge1xuICAgIGNvbnNvbGUubG9nKGZ1bmN0aW9uTmFtZSwgYXJncyk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICB9XG59O1xuXG5TZWFtbGVzc3BheUJ1cy5ldmVudHMgPSBldmVudHM7XG5cbm1vZHVsZS5leHBvcnRzID0gU2VhbWxlc3NwYXlCdXM7XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIF9jbGFzc2VzT2YoZWxlbWVudCkge1xuICByZXR1cm4gZWxlbWVudC5jbGFzc05hbWUudHJpbSgpLnNwbGl0KC9cXHMrLyk7XG59XG5cbmZ1bmN0aW9uIGFkZChlbGVtZW50KSB7XG4gIHZhciB0b0FkZCA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gIHZhciBjbGFzc05hbWUgPSBfY2xhc3Nlc09mKGVsZW1lbnQpLmZpbHRlcihmdW5jdGlvbiAoY2xhc3NuYW1lKSB7XG4gICAgcmV0dXJuIHRvQWRkLmluZGV4T2YoY2xhc3NuYW1lKSA9PT0gLTE7XG4gIH0pLmNvbmNhdCh0b0FkZCkuam9pbignICcpO1xuXG4gIGVsZW1lbnQuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xufVxuXG5mdW5jdGlvbiByZW1vdmUoZWxlbWVudCkge1xuICB2YXIgdG9SZW1vdmUgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICB2YXIgY2xhc3NOYW1lID0gX2NsYXNzZXNPZihlbGVtZW50KS5maWx0ZXIoZnVuY3Rpb24gKGNsYXNzbmFtZSkge1xuICAgIHJldHVybiB0b1JlbW92ZS5pbmRleE9mKGNsYXNzbmFtZSkgPT09IC0xO1xuICB9KS5qb2luKCcgJyk7XG5cbiAgZWxlbWVudC5jbGFzc05hbWUgPSBjbGFzc05hbWU7XG59XG5cbmZ1bmN0aW9uIHRvZ2dsZShlbGVtZW50LCBjbGFzc25hbWUsIGFkZGluZykge1xuICBpZiAoYWRkaW5nKSB7XG4gICAgYWRkKGVsZW1lbnQsIGNsYXNzbmFtZSk7XG4gIH0gZWxzZSB7XG4gICAgcmVtb3ZlKGVsZW1lbnQsIGNsYXNzbmFtZSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFkZDogYWRkLFxuICByZW1vdmU6IHJlbW92ZSxcbiAgdG9nZ2xlOiB0b2dnbGVcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIGNvbXBhcmVQb3NzaWJsZUNhcmRUeXBlcyhhLCBiKSB7XG4gIHZhciBhSGFzaDtcblxuICBpZiAoYS5sZW5ndGggIT09IGIubGVuZ3RoKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIGFIYXNoID0gYS5yZWR1Y2UoZnVuY3Rpb24gKGFjY3VtLCB0eXBlKSB7XG4gICAgYWNjdW1bdHlwZS50eXBlXSA9IHRydWU7XG4gICAgcmV0dXJuIGFjY3VtO1xuICB9LCB7fSk7XG5cbiAgcmV0dXJuIGIuZXZlcnkoZnVuY3Rpb24gKHR5cGUpIHtcbiAgICByZXR1cm4gYUhhc2guaGFzT3duUHJvcGVydHkodHlwZS50eXBlKTtcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29tcGFyZVBvc3NpYmxlQ2FyZFR5cGVzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgVkVSU0lPTjogXCJ3ZWItc2RrXCIsXG4gIEFTU0VUU19IT1NUOiBcImh0dHBzOi8vd2ViLXNkay1leGFtcGxlcy5zZWFtbGVzc3BheS5kZXZcIixcbiAgQVNTRVRTX1MzX0JVQ0tFVDogXCJ3ZWItc2RrLnNlYW1sZXNzcGF5LmNvbVwiLFxuICBBUElfVVJMX1BST0RVQ1RJT046IFwiaHR0cHM6Ly9hcGkuc2VhbWxlc3NwYXkuY29tXCIsXG4gIEFQSV9VUkxfU0FOREJPWDogXCJodHRwczovL2FwaS5zYW5kYm94LnNlYW1sZXNzcGF5LmNvbVwiLFxuICBBUElfVVJMX1NUQUdJTkc6IFwiaHR0cHM6Ly9hcGkuc2VhbWxlc3NwYXkuZGV2XCIsXG4gIFBBTl9WQVVMVF9VUkxfUFJPRFVDVElPTjogXCJodHRwczovL3Bhbi12YXVsdC5zZWFtbGVzc3BheS5jb21cIixcbiAgUEFOX1ZBVUxUX1VSTF9TQU5EQk9YOiBcImh0dHBzOi8vcGFuLXZhdWx0LnNhbmRib3guc2VhbWxlc3NwYXkuY29tXCIsXG4gIFBBTl9WQVVMVF9VUkxfU1RBR0lORzogXCJodHRwczovL3Bhbi12YXVsdC5zZWFtbGVzc3BheS5kZXZcIixcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBTZWFtbGVzc3BheUVycm9yID0gcmVxdWlyZSgnLi9zZWFtbGVzc3BheS1lcnJvcicpO1xuXG5mdW5jdGlvbiBjb252ZXJ0VG9TZWFtbGVzc3BheUVycm9yKG9yaWdpbmFsRXJyLCBvdGhlckVycm9yT2JqZWN0KSB7XG4gIGlmIChvcmlnaW5hbEVyciBpbnN0YW5jZW9mIFNlYW1sZXNzcGF5RXJyb3IgfHwgKG9yaWdpbmFsRXJyICYmIG9yaWdpbmFsRXJyLm5hbWUgPT09ICdTZWFtbGVzc3BheUVycm9yJykpIHtcbiAgICByZXR1cm4gb3JpZ2luYWxFcnI7XG4gIH1cblxuICByZXR1cm4gbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgIHR5cGU6IG90aGVyRXJyb3JPYmplY3QudHlwZSxcbiAgICBjb2RlOiBvdGhlckVycm9yT2JqZWN0LmNvZGUsXG4gICAgbWVzc2FnZTogb3RoZXJFcnJvck9iamVjdC5tZXNzYWdlLFxuICAgIGRldGFpbHM6IHtcbiAgICAgIG9yaWdpbmFsRXJyb3I6IG9yaWdpbmFsRXJyXG4gICAgfVxuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb252ZXJ0VG9TZWFtbGVzc3BheUVycm9yO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVzdHJpY3RlZElucHV0ID0gcmVxdWlyZSgnQHNlYW1sZXNzcGF5L3Jlc3RyaWN0ZWQtaW5wdXQnKTtcbnZhciBGYWtlUmVzdHJpY3RlZElucHV0ID0gcmVxdWlyZSgnLi9mYWtlLXJlc3RyaWN0ZWQtaW5wdXQnKTtcbnZhciBTVVBQT1JURURfSU5QVVRfVFlQRVMgPSBbJ3RleHQnLCAndGVsJywgJ3VybCcsICdzZWFyY2gnLCAncGFzc3dvcmQnXTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICB2YXIgc2hvdWxkRm9ybWF0ID0gb3B0aW9ucy5zaG91bGRGb3JtYXQ7XG5cbiAgaWYgKFNVUFBPUlRFRF9JTlBVVF9UWVBFUy5pbmRleE9mKG9wdGlvbnMuZWxlbWVudC50eXBlKSA9PT0gLTEpIHtcbiAgICBzaG91bGRGb3JtYXQgPSBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiBzaG91bGRGb3JtYXQgPyBuZXcgUmVzdHJpY3RlZElucHV0KG9wdGlvbnMpIDogbmV3IEZha2VSZXN0cmljdGVkSW5wdXQob3B0aW9ucyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBlbnVtZXJhdGUodmFsdWVzLCBwcmVmaXgpIHtcbiAgcHJlZml4ID0gcHJlZml4ID09IG51bGwgPyAnJyA6IHByZWZpeDtcblxuICByZXR1cm4gdmFsdWVzLnJlZHVjZShmdW5jdGlvbiAoZW51bWVyYXRpb24sIHZhbHVlKSB7XG4gICAgZW51bWVyYXRpb25bdmFsdWVdID0gcHJlZml4ICsgdmFsdWU7XG4gICAgcmV0dXJuIGVudW1lcmF0aW9uO1xuICB9LCB7fSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZW51bWVyYXRlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgU2VhbWxlc3NwYXlFcnJvciA9IHJlcXVpcmUoJy4vc2VhbWxlc3NwYXktZXJyb3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIElOVkFMSURfVVNFX09GX0lOVEVSTkFMX0ZVTkNUSU9OOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5JTlRFUk5BTCxcbiAgICBjb2RlOiAnSU5WQUxJRF9VU0VfT0ZfSU5URVJOQUxfRlVOQ1RJT04nXG4gIH0sXG4gIENBTExCQUNLX1JFUVVJUkVEOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnQ0FMTEJBQ0tfUkVRVUlSRUQnXG4gIH0sXG4gIElOU1RBTlRJQVRJT05fT1BUSU9OX1JFUVVJUkVEOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnSU5TVEFOVElBVElPTl9PUFRJT05fUkVRVUlSRUQnXG4gIH0sXG4gIElOVkFMSURfT1BUSU9OOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnSU5WQUxJRF9PUFRJT04nXG4gIH0sXG4gIElOQ09NUEFUSUJMRV9WRVJTSU9OUzoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTUVSQ0hBTlQsXG4gICAgY29kZTogJ0lOQ09NUEFUSUJMRV9WRVJTSU9OUydcbiAgfSxcbiAgSU5DT01QQVRJQkxFX0ZJRUxEU19TRVQ6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLk1FUkNIQU5ULFxuICAgIGNvZGU6ICdJTkNPTVBBVElCTEVfRklFTERTX1NFVCdcbiAgfSxcbiAgTUVUSE9EX0NBTExFRF9BRlRFUl9URUFSRE9XTjoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTUVSQ0hBTlQsXG4gICAgY29kZTogJ01FVEhPRF9DQUxMRURfQUZURVJfVEVBUkRPV04nXG4gIH0sXG4gIFNFQU1MRVNTUEFZX0FQSV9BQ0NFU1NfUkVTVFJJQ1RFRDoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTUVSQ0hBTlQsXG4gICAgY29kZTogJ1NFQU1MRVNTUEFZX0FQSV9BQ0NFU1NfUkVTVFJJQ1RFRCcsXG4gICAgbWVzc2FnZTogJ1lvdXIgYWNjZXNzIGlzIHJlc3RyaWN0ZWQgYW5kIGNhbm5vdCB1c2UgdGhpcyBwYXJ0IG9mIHRoZSBTZWFtbGVzc3BheSBBUEkuJ1xuICB9LFxuICBTRUFNTEVTU1BBWV9QQVlQQUxfTk9UX0xPQURFRDoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuSU5URVJOQUwsXG4gICAgY29kZTogJ1NFQU1MRVNTUEFZX1BBWVBBTF9OT1RfTE9BREVEJyxcbiAgICBtZXNzYWdlOiAnUGF5cGFsIFNESyBjb3VsZCBub3QgYmUgbG9hZGVkLidcbiAgfSxcbiAgSU5WQUxJRF9MQVRJTjFfU1RSSU5HOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5JTlRFUk5BTCxcbiAgICBjb2RlOiAnSU5WQUxJRF9MQVRJTjFfU1RSSU5HJ1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBGYWtlUmVzdHJpY3RlZElucHV0KG9wdGlvbnMpIHtcbiAgdGhpcy5pbnB1dEVsZW1lbnQgPSBvcHRpb25zLmVsZW1lbnQ7XG59XG5cbkZha2VSZXN0cmljdGVkSW5wdXQucHJvdG90eXBlLmdldFVuZm9ybWF0dGVkVmFsdWUgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLmlucHV0RWxlbWVudC52YWx1ZTtcbn07XG5cbkZha2VSZXN0cmljdGVkSW5wdXQucHJvdG90eXBlLnNldFBhdHRlcm4gPSBmdW5jdGlvbiAoKSB7fTtcblxubW9kdWxlLmV4cG9ydHMgPSBGYWtlUmVzdHJpY3RlZElucHV0O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBnZXRCeURvdChvYmosIHBhdGgpIHtcbiAgaWYgKHBhdGguaW5kZXhPZignLicpID09PSAtMSkge1xuICAgIHJldHVybiBvYmpbcGF0aF07XG4gIH1cbiAgcmV0dXJuIHBhdGguc3BsaXQoJy4nKS5yZWR1Y2UoZnVuY3Rpb24gKHJlc3VsdCwgcGFydCkge1xuICAgIHJldHVybiB0eXBlb2YgcmVzdWx0ID09PSAnb2JqZWN0JyA/IHJlc3VsdFtwYXJ0XSA6IHVuZGVmaW5lZDtcbiAgfSwgb2JqKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRCeURvdDtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGdldEZyYW1lTmFtZTogZnVuY3Rpb24gZ2V0RnJhbWVOYW1lKHJvb3QpIHtcbiAgICByZXR1cm4gd2luZG93Lm5hbWUucmVwbGFjZSgnc2VhbWxlc3NwYXktJyArIHJvb3QgKyAnLScsICcnKTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIEFQSV9IT1NUID0gdW5kZWZpbmVkO1xudmFyIFBBTlZBVUxUX0hPU1QgPSB1bmRlZmluZWQ7XG52YXIgQVNTRVRTX0hPU1QgPSBcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMS9kZXZcIjtcblxudmFyIGxlZ2FsSG9zdHMgPSBbXG4gICdzZWFtbGVzc3BheS5jb20nLFxuICAnc2VhbWxlc3NwYXkuZGV2JyxcbiAgJ3NlYW1sZXNzcGF5LmlvJyxcbiAgJ3dlYi1zZGsuc2VhbWxlc3NwYXkuY29tJyxcbiAgJ2FwaS5zZWFtbGVzc3BheS5jb20nLFxuICAnYXBpLnNlYW1sZXNzcGF5LmRldicsXG4gICdhcGkuc2VhbWxlc3NwYXkuaW8nLFxuICAncGFuLXZhdWx0LnNlYW1sZXNzcGF5LmNvbScsXG4gICdwYW4tdmF1bHQuc2VhbWxlc3NwYXkuZGV2JyxcbiAgJ3Bhbi12YXVsdC5zZWFtbGVzc3BheS5pbycsXG4gICdhcGkuc2FuZGJveC5zZWFtbGVzc3BheS5jb20nLFxuICAnYXBpLnNhbmRib3guc2VhbWxlc3NwYXkuZGV2JyxcbiAgJ2FwaS5zYW5kYm94LnNlYW1sZXNzcGF5LmlvJyxcbiAgJ3Bhbi12YXVsdC5zYW5kYm94LnNlYW1sZXNzcGF5LmNvbScsXG4gICdwYW4tdmF1bHQuc2FuZGJveC5zZWFtbGVzc3BheS5kZXYnLFxuICAncGFuLXZhdWx0LnNhbmRib3guc2VhbWxlc3NwYXkuaW8nXG5dO1xuXG4vLyByZW1vdmVJZihwcm9kdWN0aW9uKVxubGVnYWxIb3N0cy5wdXNoKCdsb2NhbGhvc3QnKTtcbmlmIChBUElfSE9TVCkge1xuICBsZWdhbEhvc3RzLnB1c2goc3RyaXBTdWJkb21haW5zKEFQSV9IT1NUKSk7XG59XG5pZiAoUEFOVkFVTFRfSE9TVCkge1xuICBsZWdhbEhvc3RzLnB1c2goc3RyaXBTdWJkb21haW5zKFBBTlZBVUxUX0hPU1QpKTtcbn1cbmlmIChBU1NFVFNfSE9TVCkge1xuICBsZWdhbEhvc3RzLnB1c2goc3RyaXBTdWJkb21haW5zKEFTU0VUU19IT1NUKS5yZXBsYWNlKCdodHRwOi8vJywgJycpLnJlcGxhY2UoJ2h0dHBzOi8vJywgJycpKTtcbn1cbi8vIGVuZFJlbW92ZUlmKHByb2R1Y3Rpb24pXG5cbmZ1bmN0aW9uIHN0cmlwU3ViZG9tYWlucyhkb21haW4pIHtcbiAgcmV0dXJuIGRvbWFpbi5zcGxpdCgnLicpLnNsaWNlKC0yKS5qb2luKCcuJyk7XG59XG5cbmZ1bmN0aW9uIGlzV2hpdGVsaXN0ZWREb21haW4odXJsKSB7XG4gIC8vIHZhciBtYWluRG9tYWluO1xuXG4gIC8vIHVybCA9IHVybC50b0xvd2VyQ2FzZSgpO1xuXG4gIC8vIGlmICghKG5ldyBSZWdFeHAoJ15odHRwcz86JykpLnRlc3QodXJsKSkge1xuICAvLyAgIHJldHVybiBmYWxzZTtcbiAgLy8gfVxuXG4gIC8vIHBhcnNlciA9IHBhcnNlciB8fCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gIC8vIHBhcnNlci5ocmVmID0gdXJsO1xuICAvLyBtYWluRG9tYWluID0gc3RyaXBTdWJkb21haW5zKHBhcnNlci5ob3N0bmFtZSk7XG4gIHRyeSB7XG4gICAgdmFyIHBhcnNlZFVybCA9IG5ldyBVUkwodXJsKTtcbiAgICByZXR1cm4gbGVnYWxIb3N0cy5pbmRleE9mKHN0cmlwU3ViZG9tYWlucyhwYXJzZWRVcmwuaG9zdG5hbWUpKSAhPT0gLTE7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc1doaXRlbGlzdGVkRG9tYWluO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBvbmNlKGZuKSB7XG4gIHZhciBjYWxsZWQgPSBmYWxzZTtcblxuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGlmICghY2FsbGVkKSB7XG4gICAgICBjYWxsZWQgPSB0cnVlO1xuICAgICAgZm4uYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICB9XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb25jZTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFByb21pc2UgPSBnbG9iYWwuUHJvbWlzZTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm9taXNlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBfbm90RW1wdHkob2JqKSB7XG4gIHZhciBrZXk7XG5cbiAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7IHJldHVybiB0cnVlOyB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIF9pc0FycmF5KHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHR5cGVvZiB2YWx1ZS5sZW5ndGggPT09ICdudW1iZXInICYmXG4gICAgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgQXJyYXldJyB8fCBmYWxzZTtcbn1cblxuZnVuY3Rpb24gcGFyc2UodXJsKSB7XG4gIHZhciBxdWVyeSwgcGFyYW1zO1xuXG4gIHVybCA9IHVybCB8fCBnbG9iYWwubG9jYXRpb24uaHJlZjtcblxuICBpZiAoIS9cXD8vLnRlc3QodXJsKSkge1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIHF1ZXJ5ID0gdXJsLnJlcGxhY2UoLyMuKiQvLCAnJykucmVwbGFjZSgvXi4qXFw/LywgJycpLnNwbGl0KCcmJyk7XG5cbiAgcGFyYW1zID0gcXVlcnkucmVkdWNlKGZ1bmN0aW9uICh0b1JldHVybiwga2V5VmFsdWUpIHtcbiAgICB2YXIgcGFydHMgPSBrZXlWYWx1ZS5zcGxpdCgnPScpO1xuICAgIHZhciBrZXkgPSBkZWNvZGVVUklDb21wb25lbnQocGFydHNbMF0pO1xuICAgIHZhciB2YWx1ZSA9IGRlY29kZVVSSUNvbXBvbmVudChwYXJ0c1sxXSk7XG5cbiAgICB0b1JldHVybltrZXldID0gdmFsdWU7XG4gICAgcmV0dXJuIHRvUmV0dXJuO1xuICB9LCB7fSk7XG5cbiAgcmV0dXJuIHBhcmFtcztcbn1cblxuZnVuY3Rpb24gc3RyaW5naWZ5KHBhcmFtcywgbmFtZXNwYWNlKSB7XG4gIHZhciBrLCB2LCBwO1xuICB2YXIgcXVlcnkgPSBbXTtcblxuICBmb3IgKHAgaW4gcGFyYW1zKSB7XG4gICAgaWYgKCFwYXJhbXMuaGFzT3duUHJvcGVydHkocCkpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHYgPSBwYXJhbXNbcF07XG5cbiAgICBpZiAobmFtZXNwYWNlKSB7XG4gICAgICBpZiAoX2lzQXJyYXkocGFyYW1zKSkge1xuICAgICAgICBrID0gbmFtZXNwYWNlICsgJ1tdJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGsgPSBuYW1lc3BhY2UgKyAnWycgKyBwICsgJ10nO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBrID0gcDtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB2ID09PSAnb2JqZWN0Jykge1xuICAgICAgcXVlcnkucHVzaChzdHJpbmdpZnkodiwgaykpO1xuICAgIH0gZWxzZSB7XG4gICAgICBxdWVyeS5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChrKSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh2KSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHF1ZXJ5LmpvaW4oJyYnKTtcbn1cblxuZnVuY3Rpb24gcXVlcnlpZnkodXJsLCBwYXJhbXMpIHtcbiAgdXJsID0gdXJsIHx8ICcnO1xuXG4gIGlmIChwYXJhbXMgIT0gbnVsbCAmJiB0eXBlb2YgcGFyYW1zID09PSAnb2JqZWN0JyAmJiBfbm90RW1wdHkocGFyYW1zKSkge1xuICAgIHVybCArPSB1cmwuaW5kZXhPZignPycpID09PSAtMSA/ICc/JyA6ICcnO1xuICAgIHVybCArPSB1cmwuaW5kZXhPZignPScpICE9PSAtMSA/ICcmJyA6ICcnO1xuICAgIHVybCArPSBzdHJpbmdpZnkocGFyYW1zKTtcbiAgfVxuXG4gIHJldHVybiB1cmw7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBwYXJzZTogcGFyc2UsXG4gIHN0cmluZ2lmeTogc3RyaW5naWZ5LFxuICBxdWVyeWlmeTogcXVlcnlpZnlcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXNzaWduID0gcmVxdWlyZSgnLi9hc3NpZ24nKS5hc3NpZ247XG52YXIgUHJvbWlzZSA9IHJlcXVpcmUoJy4vcHJvbWlzZScpO1xuXG5mdW5jdGlvbiByZXF1ZXN0c1NlcXVlbmNlKGNsaWVudCwgcmVxdWVzdHNEYXRhKSB7XG4gIHZhciByZXNwb25zZXMgPSBbXTtcbiAgdmFyIGRlZmF1bHRQYXJhbXMgPSB7XG4gICAgYXBpOiAndG9rZW5pemVyQXBpJyxcbiAgICBtZXRob2Q6ICdwb3N0JyxcbiAgICBlbmRwb2ludDogJ3Rva2VucycsXG4gICAgZ2V0RGF0YTogZnVuY3Rpb24gKCkgeyByZXR1cm4ge307IH1cbiAgfTtcblxuICByZXF1ZXN0c0RhdGEgPSByZXF1ZXN0c0RhdGEgfHwgW2RlZmF1bHRQYXJhbXNdO1xuXG4gIHJldHVybiByZXF1ZXN0c0RhdGEucmVkdWNlKFxuICAgIGZ1bmN0aW9uIChwcm9taXNlLCBwYXJhbXMpIHtcbiAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCBkZWZhdWx0UGFyYW1zO1xuXG4gICAgICByZXR1cm4gcHJvbWlzZS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkgeyAvLyBoZXJlIHdlIGdldCBwcmV2aW91cyByZXF1ZXN0IHJlc3VsdFxuICAgICAgICB2YXIgaXNQcmV2aW91c0ZhaWxlZCA9IHJlc3BvbnNlIGluc3RhbmNlb2YgRXJyb3IgfHwgKHJlc3BvbnNlICYmIHJlc3BvbnNlLm5hbWUgPT09ICdTZWFtbGVzc3BheUVycm9yJyk7XG4gICAgICAgIHZhciBkYXRhID0gcGFyYW1zLmdldERhdGEocmVzcG9uc2UpO1xuICAgICAgICB2YXIgaGFzRmllbGRzID0gT2JqZWN0LmtleXMoZGF0YSkuZmlsdGVyKGZ1bmN0aW9uIChrZXkpIHsgcmV0dXJuIFsncGF5bWVudFR5cGUnXS5pbmRleE9mKGtleSkgPT09IC0xOyB9KS5sZW5ndGggPiAwO1xuXG4gICAgICAgIGlmICghaGFzRmllbGRzKSB7XG4gICAgICAgICAgcmVzcG9uc2VzLnB1c2goe30pO1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGlzUHJldmlvdXNGYWlsZWQgPyBQcm9taXNlLnJlc29sdmUocmVzcG9uc2UpIDogY2xpZW50XG4gICAgICAgICAgLnJlcXVlc3QoYXNzaWduKHt9LCBwYXJhbXMsIHsgZGF0YTogZGF0YSB9KSlcbiAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICByZXNwb25zZXMucHVzaChyZXN1bHQpO1xuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBQcm9taXNlLnJlc29sdmUoZmFsc2UpXG4gICkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHJlc3BvbnNlcztcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWVzdHNTZXF1ZW5jZTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGVudW1lcmF0ZSA9IHJlcXVpcmUoJy4vZW51bWVyYXRlJyk7XG5cbi8qKlxuICogQGNsYXNzXG4gKiBAZ2xvYmFsXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyBDb25zdHJ1Y3Rpb24gb3B0aW9uc1xuICogQGNsYXNzZGVzYyBUaGlzIGNsYXNzIGlzIHVzZWQgdG8gcmVwb3J0IGVycm9yIGNvbmRpdGlvbnMsIGZyZXF1ZW50bHkgYXMgdGhlIGZpcnN0IHBhcmFtZXRlciB0byBjYWxsYmFja3MgdGhyb3VnaG91dCB0aGUgU2VhbWxlc3NwYXkgU0RLLlxuICogQGRlc2NyaXB0aW9uIDxzdHJvbmc+WW91IGNhbm5vdCB1c2UgdGhpcyBjb25zdHJ1Y3RvciBkaXJlY3RseS4gSW50ZXJhY3Qgd2l0aCBpbnN0YW5jZXMgb2YgdGhpcyBjbGFzcyB0aHJvdWdoIHtAbGluayBjYWxsYmFjayBjYWxsYmFja3N9Ljwvc3Ryb25nPlxuICovXG5mdW5jdGlvbiBTZWFtbGVzc3BheUVycm9yKG9wdGlvbnMpIHtcbiAgaWYgKCFTZWFtbGVzc3BheUVycm9yLnR5cGVzLmhhc093blByb3BlcnR5KG9wdGlvbnMudHlwZSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3Iob3B0aW9ucy50eXBlICsgJyBpcyBub3QgYSB2YWxpZCB0eXBlLicpO1xuICB9XG5cbiAgaWYgKCFvcHRpb25zLmNvZGUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yIGNvZGUgcmVxdWlyZWQuJyk7XG4gIH1cblxuICBpZiAoIW9wdGlvbnMubWVzc2FnZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignRXJyb3IgbWVzc2FnZSByZXF1aXJlZC4nKTtcbiAgfVxuXG4gIHRoaXMubmFtZSA9ICdTZWFtbGVzc3BheUVycm9yJztcblxuICAvKipcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICogQGRlc2NyaXB0aW9uIEEgY29kZSB0aGF0IGNvcnJlc3BvbmRzIHRvIHNwZWNpZmljIGVycm9ycy5cbiAgICovXG4gIHRoaXMuY29kZSA9IG9wdGlvbnMuY29kZTtcblxuICAvKipcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICogQGRlc2NyaXB0aW9uIEEgc2hvcnQgZGVzY3JpcHRpb24gb2YgdGhlIGVycm9yLlxuICAgKi9cbiAgdGhpcy5tZXNzYWdlID0gb3B0aW9ucy5tZXNzYWdlO1xuXG4gIC8qKlxuICAgKiBAdHlwZSB7U2VhbWxlc3NwYXlFcnJvci50eXBlc31cbiAgICogQGRlc2NyaXB0aW9uIFRoZSB0eXBlIG9mIGVycm9yLlxuICAgKi9cbiAgdGhpcy50eXBlID0gb3B0aW9ucy50eXBlO1xuXG4gIC8qKlxuICAgKiBAdHlwZSB7b2JqZWN0PX1cbiAgICogQGRlc2NyaXB0aW9uIEFkZGl0aW9uYWwgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGVycm9yLCBzdWNoIGFzIGFuIHVuZGVybHlpbmcgbmV0d29yayBlcnJvciByZXNwb25zZS5cbiAgICovXG4gIHRoaXMuZGV0YWlscyA9IG9wdGlvbnMuZGV0YWlscztcbn1cblxuU2VhbWxlc3NwYXlFcnJvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSk7XG5TZWFtbGVzc3BheUVycm9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFNlYW1sZXNzcGF5RXJyb3I7XG5cbi8qKlxuICogRW51bSBmb3Ige0BsaW5rIFNlYW1sZXNzcGF5RXJyb3J9IHR5cGVzLlxuICogQG5hbWUgU2VhbWxlc3NwYXlFcnJvci50eXBlc1xuICogQGVudW1cbiAqIEByZWFkb25seVxuICogQG1lbWJlcm9mIFNlYW1sZXNzcGF5RXJyb3JcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBDVVNUT01FUiBBbiBlcnJvciBjYXVzZWQgYnkgdGhlIGN1c3RvbWVyLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IE1FUkNIQU5UIEFuIGVycm9yIHRoYXQgaXMgYWN0aW9uYWJsZSBieSB0aGUgbWVyY2hhbnQuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gTkVUV09SSyBBbiBlcnJvciBkdWUgdG8gYSBuZXR3b3JrIHByb2JsZW0uXG4gKiBAcHJvcGVydHkge3N0cmluZ30gSU5URVJOQUwgQW4gZXJyb3IgY2F1c2VkIGJ5IFNlYW1sZXNzcGF5IGNvZGUuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gVU5LTk9XTiBBbiBlcnJvciB3aGVyZSB0aGUgb3JpZ2luIGlzIHVua25vd24uXG4gKi9cblNlYW1sZXNzcGF5RXJyb3IudHlwZXMgPSBlbnVtZXJhdGUoW1xuICAnQ1VTVE9NRVInLFxuICAnTUVSQ0hBTlQnLFxuICAnTkVUV09SSycsXG4gICdJTlRFUk5BTCcsXG4gICdVTktOT1dOJ1xuXSk7XG5cbm1vZHVsZS5leHBvcnRzID0gU2VhbWxlc3NwYXlFcnJvcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gdXVpZCgpIHtcbiAgcmV0dXJuICd4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHgnLnJlcGxhY2UoL1t4eV0vZywgZnVuY3Rpb24gKGMpIHtcbiAgICB2YXIgciA9IE1hdGgucmFuZG9tKCkgKiAxNiB8IDA7XG4gICAgdmFyIHYgPSBjID09PSAneCcgPyByIDogciAmIDB4MyB8IDB4ODtcblxuICAgIHJldHVybiB2LnRvU3RyaW5nKDE2KTtcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdXVpZDtcbiJdfQ==
