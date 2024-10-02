(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.seamlesspay || (g.seamlesspay = {})).cardElement = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(_dereq_,module,exports){
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

},{"../../lib/seamlesspay-error":116,"../shared/constants":85,"../shared/errors":86}],66:[function(_dereq_,module,exports){
'use strict';

var BaseInput = _dereq_('./base-input').BaseInput;
var makeFakeInput = _dereq_('../helpers').makeFakeInput;

var PATTERN_CACHE = {};

function _generatePattern(card) {
  var i, pattern;
  var gaps = [4, 8, 12];
  var length = 16;
  var type = 'unknown';

  if (card) {
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
  this.placeholder = 'Card number';

  BaseInput.apply(this, arguments);

  var DEFAULT_MAX_LENGTH = this.maxLength;

  this.setPattern(_generatePattern(''));

  this.model.on('change:possibleCardTypes', function (possibleCardTypes) {
    var card;
    var maxLength = DEFAULT_MAX_LENGTH;

    if (possibleCardTypes.length === 1) {
      card = possibleCardTypes[0];
      maxLength = Math.max.apply(null, card.lengths) + card.gaps.length;
    }

    this.setPattern(_generatePattern(card));
    this.updateModel('value', this.formatter.getUnformattedValue());
    this.maxLength = maxLength;

    this.render();
  }.bind(this));

  this.model.on('change:accountNumber.value', function () {
    if (!this.fakeCardNumberElement) return;

    var value = this.element.value;
    var fakeLast4Element = this.fakeCardNumberElement.querySelector('span[class*="-fakeNumber-last4"]');
    var fakeNumberElement = this.fakeCardNumberElement.querySelector('span[class*="-fakeNumber-number"]');
    var last4 = value.split(' ').filter(function(item) { return Boolean(item); }).pop();
    if (last4) {
      fakeLast4Element.innerHTML = last4;
    } else {
      fakeLast4Element.innerHTML = '';
      fakeLast4Element.appendChild(makeFakeInput());
    }
    fakeNumberElement.innerHTML = value || 'Number';
  }.bind(this));
}

AccountNumberInput.prototype = Object.create(BaseInput.prototype);
AccountNumberInput.prototype.constructor = AccountNumberInput;

module.exports = {
  AccountNumberInput: AccountNumberInput
};

},{"../helpers":74,"./base-input":67}],67:[function(_dereq_,module,exports){
(function (global){(function (){
'use strict';

var attributeValidationError = _dereq_('../../external/attribute-validation-error');
var constants = _dereq_('../../shared/constants');
var classlist = _dereq_('../../../lib/classlist');
var createRestrictedInput = _dereq_('../../../lib/create-restricted-input');
var helpers = _dereq_('../helpers');

var adjustTransformation = helpers.adjustTransformation;
var events = constants.events;
var whitelistedFields = constants.whitelistedFields;
var ENTER_KEY_CODE = 13;
var DEFAULT_MASK_CHARACTER = '•';

function BaseInput(options) {
  var shouldFormat;

  this.model = options.model;
  this.type = options.type;
  this.maxLength = !this.maxLength ? this.model.getMaxLength(this.type) : this.maxLength;

  this.element = this.constructElement();

  this.pattern = ' ';
  this.hiddenMaskedValue = '';
  this.shouldMask = false;
  this.maskCharacter = DEFAULT_MASK_CHARACTER;

  shouldFormat = this.element instanceof HTMLInputElement;
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
  var inputType = 'tel';
  var element = document.createElement('input');
  var placeholder = this.placeholder || null;
  var fieldParams = whitelistedFields.find(function (item) {
    return item.field === type;
  });
  var name = fieldParams.name;

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
  this.element.addEventListener('keyup', this.model.onKeyUp(this.type));
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
    this.model.set('focusedField', null);
  }.bind(this), false);

  element.addEventListener('touchstart', function () {
    element.select();
  });

  element.addEventListener('focus', function () {
    this.model.set('focusedField', this.type);
  }.bind(this));
  element.addEventListener('blur', function () {
    var isValid = this.model.get(this.type).isValid;
    classlist.toggle(this.element, 'is-invalid', !isValid);
  }.bind(this));
};

BaseInput.prototype.addModelEventListeners = function () {
  this.modelOnChange('isValid', this.render);
  this.modelOnChange('isPotentiallyValid', this.render);
  this.modelOnChange('value', this.render);
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
  var isEmpty = modelData.value.length === 0;
  var isValid = modelData.isValid;
  var formElement = document.querySelector('form');

  classlist.toggle(this.element, 'is-empty', isEmpty);
  classlist.toggle(this.element, 'Input--empty', isEmpty);
  classlist.toggle(this.element, 'is-complete', isValid && !isEmpty);

  if (formElement) {
    adjustTransformation(this.model, formElement);
  }

  if (this.maxLength) {
    this.element.setAttribute('maxlength', this.maxLength);
  }
};

module.exports = {
  BaseInput: BaseInput
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../../lib/classlist":103,"../../../lib/create-restricted-input":107,"../../external/attribute-validation-error":65,"../../shared/constants":85,"../helpers":74}],68:[function(_dereq_,module,exports){
(function (global){(function (){
'use strict';

var attributeValidationError = _dereq_('../../external/attribute-validation-error');
var constants = _dereq_('../../shared/constants');
var classlist = _dereq_('../../../lib/classlist');

var events = constants.events;
var cardBrandMap = constants.cardBrandMap;

function CardBrandIcon(options) {
  this.model = options.model;
  this.type = options.type;
  this.maxLength = 100;

  this.element = this.constructElement();

  this.addDOMEventListeners();
  this.addModelEventListeners();
  this.addBusEventListeners();
  this.render();

  this.model.setupComponent(this.type, this);
}

CardBrandIcon.prototype.constructElement = function () {
  var brandIconContainerElement = document.createElement('div');
  var brandIconElement = document.createElement('div');
  var brandIconInnerFrontElement = document.createElement('div');
  var brandIconInnerBackElement = document.createElement('div');

  brandIconContainerElement.className = 'CardBrandIcon-container';
  brandIconElement.className = 'Icon CardBrandIcon is-cvc-hidden is-loaded';
  brandIconInnerFrontElement.className = 'CardBrandIcon-inner CardBrandIcon-inner--front';
  brandIconInnerBackElement.className = 'CardBrandIcon-inner CardBrandIcon-inner--back';

  brandIconInnerBackElement.appendChild(renderIcon('cvv'))
  brandIconInnerFrontElement.appendChild(renderIcon('unknown'));
  brandIconElement.appendChild(brandIconInnerFrontElement);
  brandIconElement.appendChild(brandIconInnerBackElement);

  brandIconContainerElement.appendChild(brandIconElement);

  return brandIconContainerElement;
};

CardBrandIcon.prototype.addDOMEventListeners = function () {};

CardBrandIcon.prototype.addModelEventListeners = function () {
  this.model.on('change:possibleCardTypes', function (cardTypes) {
    var cardType;
    var cardBrand;
    var accountNumber = this.model.get('accountNumber.value');
    if (cardTypes.length > 0 && String(accountNumber).length > 0) {
      cardType = [].concat(cardTypes).shift();
      cardBrand = cardBrandMap[cardType.type];
    }
    this.model.set('cardBrand', cardBrand);
    this.renderBrand(cardBrand);
  }.bind(this));

  this.model.on('change:focusedField', function (value) {
    this.flip(value === 'cvv');
    if (value !== 'accountNumber' && this.model.get('accountNumber.value').length > 0 && !this.model.get('accountNumber.isValid')) {
      this.renderBrand(null, { error: true });
    } else if (value === 'accountNumber' && this.model.get('accountNumber.value').length > 0) {
      this.renderBrand(this.model.get('cardBrand'));
    }
  }.bind(this));
};

CardBrandIcon.prototype.setAttribute = function (type, attribute, value) {
  if (type === this.type && !attributeValidationError(attribute, value)) {
    this.element.setAttribute(attribute, value);
  }
};

CardBrandIcon.prototype.removeAttribute = function (type, attribute) {
  if (type === this.type && !attributeValidationError(attribute)) {
    this.element.removeAttribute(attribute);
  }
};

CardBrandIcon.prototype.addBusEventListeners = function () {
  global.bus.on(events.ADD_CLASS, function (type, classname) {
    if (type === this.type) { classlist.add(this.element, classname); }
  }.bind(this));

  global.bus.on(events.REMOVE_CLASS, function (type, classname) {
    if (type === this.type) { classlist.remove(this.element, classname); }
  }.bind(this));
};

CardBrandIcon.prototype.flip = function (back) {
  classlist.toggle(this.element.querySelector('div.CardBrandIcon'), 'is-cvc', back);
  classlist.toggle(this.element.querySelector('div.CardBrandIcon'), 'is-cvc-hidden', !back);
};

CardBrandIcon.prototype.renderBrand = function (cardBrand, options) {
  var error = (options || {}).error;
  var innerFrontElement = this.element.querySelector('div.CardBrandIcon-inner--front');
  innerFrontElement.innerHTML = '';
  if (!error && cardBrand) {
    innerFrontElement.appendChild(createImgElement(cardBrand));
  } else if (!error && !cardBrand) {
    innerFrontElement.appendChild(renderIcon('unknown'));
  } else if (error) {
    innerFrontElement.appendChild(renderIcon('error'));
  }
};

CardBrandIcon.prototype.render = function () {};

function createImgElement(type) {
  var element = document.createElement('img');
  element.setAttribute('role', 'presentation');
  element.setAttribute('src', 'img/' + type + '.svg');
  element.className = 'CardBrandIcon-inner CardBrandIcon-inner--front';

  return element;
}

function createSvgElement(tag, attributes) {
  var children = Array.prototype.slice.call(arguments, 2);
  var element = document.createElementNS('http://www.w3.org/2000/svg', tag);

  Object.keys(attributes || {}).forEach(function (attribute) {
    element.setAttribute(attribute, attributes[attribute]);
  });
  children.forEach(function (child) {
    element.appendChild(child);
  });

  return element;
}

function renderIcon(type) {
  var icons = {
    unknown: function () {
      return createSvgElement('svg', {
        focusable: 'false',
        viewBox: '0 0 32 21'
      }, createSvgElement('g', {
        fill: 'none',
        'fill-rule': 'evenodd'
      }, createSvgElement('g', {
        id: 'unknown',
        class: 'Icon-fill'
      }, createSvgElement('g', {
        id: 'card',
        transform: 'translate(0 2)'
      }, createSvgElement('path', {
        id: 'shape',
        d: 'M26.58 19H2.42A2.4 2.4 0 0 1 0 16.62V2.38A2.4 2.4 0 0 1 2.42 0h24.16A2.4 2.4 0 0 1 29 2.38v14.25A2.4 2.4 0 0 1 26.58 19zM10 5.83c0-.46-.35-.83-.78-.83H3.78c-.43 0-.78.37-.78.83v3.34c0 .46.35.83.78.83h5.44c.43 0 .78-.37.78-.83V5.83z',
        opacity: '.2'
      }), createSvgElement('path', {
        id: 'shape',
        d: 'M25 15h-3c-.65 0-1-.3-1-1s.35-1 1-1h3c.65 0 1 .3 1 1s-.35 1-1 1zm-6 0h-3c-.65 0-1-.3-1-1s.35-1 1-1h3c.65 0 1 .3 1 1s-.35 1-1 1zm-6 0h-3c-.65 0-1-.3-1-1s.35-1 1-1h3c.65 0 1 .3 1 1s-.35 1-1 1zm-6 0H4c-.65 0-1-.3-1-1s.35-1 1-1h3c.65 0 1 .3 1 1s-.35 1-1 1z',
        opacity: '.3'
      })))));
    },
    cvv: function () {
      return createSvgElement('svg', {
        focusable: 'false',
        viewBox: '0 0 32 21'
      }, createSvgElement('g', {
        fill: 'none',
        'fill-rule': 'evenodd'
      }, createSvgElement('g', {
        id: 'cvc',
        class: 'Icon-fill'
      }, createSvgElement('g', {
        id: 'card',
        transform: 'translate(0 2)'
      }, createSvgElement('path', {
        id: 'shape',
        d: 'M21.68 0H2c-.92 0-2 1.06-2 2v15c0 .94 1.08 2 2 2h25c.92 0 2-1.06 2-2V9.47a5.98 5.98 0 0 1-3 1.45V11c0 .66-.36 1-1 1H3c-.64 0-1-.34-1-1v-1c0-.66.36-1 1-1h17.53a5.98 5.98 0 0 1 1.15-9z',
        opacity: '.2'
      }), createSvgElement('path', {
        id: 'shape',
        d: 'M19.34 3H0v3h19.08a6.04 6.04 0 0 1 .26-3z',
        opacity: '.3'
      })), createSvgElement('g', {
        id: 'shape',
        transform: 'translate(18)'
      }, createSvgElement('path', {
        d: 'M7 14A7 7 0 1 1 7 0a7 7 0 0 1 0 14zM4.22 4.1h-.79l-1.93.98v1l1.53-.8V9.9h1.2V4.1zm2.3.8c.57 0 .97.32.97.78 0 .5-.47.85-1.15.85h-.3v.85h.36c.72 0 1.21.36 1.21.88 0 .5-.48.84-1.16.84-.5 0-1-.16-1.52-.47v1c.56.24 1.12.37 1.67.37 1.31 0 2.21-.67 2.21-1.64 0-.68-.42-1.23-1.12-1.45.6-.2.99-.73.99-1.33C8.68 4.64 7.85 4 6.65 4a4 4 0 0 0-1.57.34v.98c.48-.27.97-.42 1.44-.42zm4.32 2.18c.73 0 1.24.43 1.24.99 0 .59-.51 1-1.24 1-.44 0-.9-.14-1.37-.43v1.03c.49.22.99.33 1.48.33.26 0 .5-.04.73-.1.52-.85.82-1.83.82-2.88l-.02-.42a2.3 2.3 0 0 0-1.23-.32c-.18 0-.37.01-.57.04v-1.3h1.44a5.62 5.62 0 0 0-.46-.92H9.64v3.15c.4-.1.8-.17 1.2-.17z'
      })))));
    },
    error: function () {
      return createSvgElement('svg', {
        focusable: 'false',
        viewBox: '0 0 32 21'
      }, createSvgElement('g', {
        fill: 'none',
        fillRule: 'evenodd'
      }, createSvgElement('g', {
        id: 'error',
        class: 'Icon-fill'
      }, createSvgElement('g', {
        id: 'card',
        transform: 'translate(0 2)'
      }, createSvgElement('path', {
        id: 'shape',
        d: 'M21.68 0A6 6 0 1 0 29 9.47v7.15A2.4 2.4 0 0 1 26.58 19H2.42A2.4 2.4 0 0 1 0 16.62V2.38A2.4 2.4 0 0 1 2.42 0h19.26zM10 5.83c0-.46-.35-.83-.78-.83H3.78c-.43 0-.78.37-.78.83v3.34c0 .46.35.83.78.83h5.44c.43 0 .78-.37.78-.83V5.83z',
        opacity: '.2'
      }), createSvgElement('path', {
        id: 'shape',
        d: 'M25 15h-3c-.65 0-1-.3-1-1s.35-1 1-1h3c.65 0 1 .3 1 1s-.35 1-1 1zm-6 0h-3c-.65 0-1-.3-1-1s.35-1 1-1h3c.65 0 1 .3 1 1s-.35 1-1 1zm-6 0h-3c-.65 0-1-.3-1-1s.35-1 1-1h3c.65 0 1 .3 1 1s-.35 1-1 1zm-6 0H4c-.65 0-1-.3-1-1s.35-1 1-1h3c.65 0 1 .3 1 1s-.35 1-1 1z',
        opacity: '.3'
      })), createSvgElement('g', {
        id: 'shape',
        transform: 'translate(18)'
      }, createSvgElement('path', {
        d: 'M7 14A7 7 0 1 1 7 0a7 7 0 0 1 0 14zM6 3v4a1 1 0 0 0 2 0V3a1 1 0 0 0-2 0zm1 8.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5z'
      })))));
    }
  };

  return (icons[type] || icons.unknown)();
}

module.exports = {
  CardBrandIcon: CardBrandIcon
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../../lib/classlist":103,"../../external/attribute-validation-error":65,"../../shared/constants":85}],69:[function(_dereq_,module,exports){
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
  this.placeholder = 'CVV';

  BaseInput.apply(this, arguments);

  var DEFAULT_MAX_LENGTH = this.maxLength;

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

  this.element.setAttribute('maxlength', this.maxLength);
  this.setPattern(_getPattern(this.maxLength));
}

CVVInput.prototype = Object.create(BaseInput.prototype);
CVVInput.prototype.constructor = CVVInput;

module.exports = {
  CVVInput: CVVInput
};

},{"./base-input":67}],70:[function(_dereq_,module,exports){
'use strict';

var BaseInput = _dereq_('./base-input').BaseInput;

var DEFAULT_PATTERN = '{{99}} / {{99}}';
var ZERO_PADDED_PATTERN = '0{{9}} / {{99}}';

function ExpirationDateInput() {
  this.placeholder = 'MM / YY';

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

  return this.formatter.getUnformattedValue();
};

module.exports = {
  ExpirationDateInput: ExpirationDateInput
};

},{"./base-input":67}],71:[function(_dereq_,module,exports){
'use strict';

var InputComponents = _dereq_('./index');

module.exports = {
  FieldComponent: function FieldComponent(options) {
    var type = options.type;
    var cardForm = options.cardForm;

    this.element = document.createDocumentFragment();
    this.input = new InputComponents[type]({
      model: cardForm,
      type: type
    });
    this.input.element.setAttribute('aria-describedby', 'field-description-' + type);
    this.element.appendChild(this.input.element);
  }
};

},{"./index":72}],72:[function(_dereq_,module,exports){
'use strict';

module.exports = {
  cardBrandIcon: _dereq_('./card-brand-icon').CardBrandIcon,
  accountNumber: _dereq_('./account-number-input').AccountNumberInput,
  postalCode: _dereq_('./postal-code-input').PostalCodeInput,
  cvv: _dereq_('./cvv-input').CVVInput,
  expDate: _dereq_('./expiration-date-input').ExpirationDateInput
};

},{"./account-number-input":66,"./card-brand-icon":68,"./cvv-input":69,"./expiration-date-input":70,"./postal-code-input":73}],73:[function(_dereq_,module,exports){
'use strict';

var BaseInput = _dereq_('./base-input').BaseInput;

function PostalCodeInput() {
  this.placeholder = 'ZIP';

  BaseInput.apply(this, arguments);

  this.setPattern('{{*****}}');
  this.element.setAttribute('type', 'text');
}

PostalCodeInput.prototype = Object.create(BaseInput.prototype);
PostalCodeInput.prototype.constructor = PostalCodeInput;

module.exports = {
  PostalCodeInput: PostalCodeInput
};

},{"./base-input":67}],74:[function(_dereq_,module,exports){
var classlist = _dereq_('./../../lib/classlist');

function getState(form, formElement) {
  var iconWidth = formElement.querySelector('div.CardBrandIcon-container').getBoundingClientRect().width;
  var cardNumberWidth = formElement.querySelector('span.CardField-account-number').getBoundingClientRect().width;
  var cardCvcWidth = formElement.querySelector('span.CardField-cvv').getBoundingClientRect().width;
  var postalCodeWidth = formElement.querySelector('span.CardField-postal-code').getBoundingClientRect().width;
  var cardExpiryWidth = formElement.querySelector('span.CardField-exp-date').getBoundingClientRect().width;
  var windowWidth = window.innerWidth;
  var coefficient = 4 * iconWidth / 3;
  var panelWidth = windowWidth - coefficient;
  var otherFieldsWidth = panelWidth - cardNumberWidth;
  var totalWidth = cardExpiryWidth + cardCvcWidth + postalCodeWidth;

  if (form.get('focusedField') === 'accountNumber' || !form.get('focusedField')) {
    return windowWidth > coefficient + cardNumberWidth + totalWidth ? {
      hideIcon: false,
      translation: otherFieldsWidth - totalWidth,
      hideCardNumber: false
    } : windowWidth > coefficient + cardNumberWidth + cardExpiryWidth + cardCvcWidth ? {
      hideIcon: false,
      translation: otherFieldsWidth - cardExpiryWidth - cardCvcWidth,
      hideCardNumber: false
    } : windowWidth > coefficient + cardNumberWidth + cardExpiryWidth ? {
      hideIcon: false,
      translation: otherFieldsWidth - cardExpiryWidth,
      hideCardNumber: false
    } : {
      hideIcon: true,
      translation: windowWidth - cardNumberWidth - cardExpiryWidth,
      hideCardNumber: false
    };
  }
  var translation = otherFieldsWidth - totalWidth;

  return windowWidth > coefficient + cardNumberWidth + totalWidth ? {
    hideIcon: false,
    hideCardNumber: false,
    translation: translation
  } : {
    hideIcon: false,
    hideCardNumber: true,
    translation: translation
  };
}

function setTransformStyle(element, translation, rtl) { // rtl === false
  var num = Math.round(translation);
  var transform = rtl ? 'translateX(' + -num + 'px)' : 'translateX(' + num + 'px)';

  element.style.transform = transform;
  element.style.WebkitTransform = transform;
  element.style.msTransform = transform;

  return element;
}

function calculateNumberTranslation(element) {
  var fakeNumberElement = element.querySelector('span.CardField-account-number-fakeNumber');
  var last4Element = element.querySelector('span.CardField-number-fakeNumber-last4');

  return -(fakeNumberElement.getBoundingClientRect().width - last4Element.getBoundingClientRect().width);
}

var adjustTransformation = function (form, element) {
  var cardBrandIconContainerElement = element.querySelector('div.CardBrandIcon-container');
  var accountNumberElement = element.querySelector('span.CardField-account-number');
  var cvvElement = element.querySelector('span.CardField-cvv');
  var postalCodeElement = element.querySelector('span.CardField-postal-code');
  var expDateElement = element.querySelector('span.CardField-exp-date');
  var state = getState(form, element);

  classlist.toggle(cardBrandIconContainerElement, 'is-hidden', state.hideIcon);
  classlist.toggle(accountNumberElement, 'is-hidden', state.hideCardNumber);
  var accountNumberTranslation = state.hideCardNumber ? calculateNumberTranslation(accountNumberElement) : 0;

  setTransformStyle(accountNumberElement, accountNumberTranslation);
  setTransformStyle(expDateElement, state.translation);
  setTransformStyle(cvvElement, state.translation);
  setTransformStyle(postalCodeElement, state.translation);
};

var makeFakeInput = function () {
  var containerElement = document.createElement('span');
  var inputElement = document.createElement('input');
  containerElement.className = 'InputContainer';
  containerElement.setAttribute('data-max', 'Number');

  inputElement.className = 'InputElement is-empty Input Input--empty';
  inputElement.setAttribute('autocomplete', 'fake');
  inputElement.setAttribute('autocorrect', 'off');
  inputElement.setAttribute('spellcheck', 'false');
  inputElement.setAttribute('disabled', 'disabled');
  inputElement.setAttribute('type', 'text');
  inputElement.setAttribute('placeholder', 'Number');
  inputElement.setAttribute('value', '');

  containerElement.appendChild(inputElement);

  return containerElement;
};

module.exports = {
  adjustTransformation: adjustTransformation,
  makeFakeInput: makeFakeInput
};

},{"./../../lib/classlist":103}],75:[function(_dereq_,module,exports){
(function (global){(function (){
'use strict';

var assign = _dereq_('../../lib/assign').assign;
var Bus = _dereq_('../../lib/bus');
var assembleIFrames = _dereq_('../../lib/assemble-iframes');
var classlist = _dereq_('../../lib/classlist');
var Client = _dereq_('../../client/client');
var injectWithAllowlist = _dereq_('inject-stylesheet').injectWithAllowlist;
var CreditCardForm = _dereq_('./models/credit-card-form').CreditCardForm;
var FieldComponent = _dereq_('./components/field-component').FieldComponent;
var SeamlesspayError = _dereq_('../../lib/seamlesspay-error');
var constants = _dereq_('../shared/constants');
var errors = _dereq_('../shared/errors');
var requestsSequence = _dereq_('../../lib/requests-sequence');
var makeFakeInput = _dereq_('./helpers').makeFakeInput;

var whitelistedFields = constants.whitelistedFields;
var whitelistedStyles = constants.whitelistedStyles;
var events = constants.events;
var requestTypes = constants.requestTypes;
var PAYMENT_TYPE_CREDIT_CARD = constants.PAYMENT_TYPE_CREDIT_CARD;

function initialize(cardForm) {
  var fieldComponent;
  var cardBrandIconComponent;
  var components;
  var rootElement = document.createElement('div');
  var cardField = document.createElement('div');
  var cardFieldInputContainer = document.createElement('div');
  var form = document.createElement('form');

  injectWithAllowlist(
    cardForm.configuration.styles,
    whitelistedStyles
  );

  rootElement.setAttribute('id', 'root');

  cardField.setAttribute('tabindex', '-1');
  cardField.className = 'CardField CardField--ltr';

  cardFieldInputContainer.className = 'CardField-input-wrapper is-ready-to-slide';
  cardFieldInputContainer.setAttribute('dir', 'ltr');

  form.setAttribute('dir', 'ltr');
  form.setAttribute('novalidate', true);
  form.setAttribute('action', '#'); // Forms need an action in order to offer a "go" button on soft keyboard
  form.addEventListener('submit', function (event) {
    event.preventDefault();
  });
  form.className = 'ElementsApp is-empty';

  cardBrandIconComponent = new FieldComponent({
    cardForm: cardForm,
    type: 'cardBrandIcon',
    name: 'card-brand-icon'
  });

  cardField.appendChild(cardBrandIconComponent.element);

  whitelistedFields.forEach(function (item) {
    fieldComponent = new FieldComponent({
      cardForm: cardForm,
      type: item.field,
      name: item.name
    });

    cardFieldInputContainer.appendChild(
      wrapFormElement(fieldComponent, item)
    );
  });

  cardField.appendChild(cardFieldInputContainer);
  form.appendChild(cardField);
  rootElement.appendChild(form);
  document.body.appendChild(rootElement);

  components = cardForm.getComponents();

  Object.keys(components).forEach(function (fieldKey) {
    components[fieldKey].render();

    if (components[fieldKey].input) {
      components[fieldKey].input.render();
    }
  });

  shimPlaceholder();
}

function wrapFormElement(component, params) {
  var element = component.element;
  var cardFieldChildElement = document.createElement('span');
  var spanElement = document.createElement('span');
  var inputContainerElement = document.createElement('span');

  cardFieldChildElement.className = 'CardField-' + params.name + ' CardField-child';
  inputContainerElement.className = 'InputContainer';

  inputContainerElement.setAttribute('data-max', params.wrapper.dataMax);

  assign(cardFieldChildElement.style, params.wrapper.style);

  classlist.add(component.input.element, 'InputElement', 'is-empty', 'Input', 'Input--empty');

  inputContainerElement.appendChild(element);
  spanElement.appendChild(inputContainerElement);
  if (params.name === 'account-number') {
    component.input.fakeCardNumberElement = makeFakeCardNumber();
    cardFieldChildElement.appendChild(component.input.fakeCardNumberElement);
  }
  cardFieldChildElement.appendChild(spanElement);

  return cardFieldChildElement;
}

function makeFakeCardNumber() {
  var fakeNumberElement = document.createElement('span');
  var last4Element = document.createElement('span');
  var numberElement = document.createElement('span');

  fakeNumberElement.className = 'CardField-account-number-fakeNumber';
  last4Element.className = 'CardField-number-fakeNumber-last4 InputElement';
  numberElement.className = 'CardField-number-fakeNumber-number';

  last4Element.appendChild(makeFakeInput());

  fakeNumberElement.setAttribute('aria-hidden', 'true');

  numberElement.innerHTML = 'Number';

  fakeNumberElement.appendChild(last4Element);
  fakeNumberElement.appendChild(numberElement);

  return fakeNumberElement;
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
    tokenizerError = new SeamlesspayError(errors.CARD_ELEMENT_FAILED_TOKENIZATION);
    tokenizerError.details = response.name === 'SeamlesspayError' && response.details ? response.details: { originalError: response };
  } else {
    tokenizerError = new SeamlesspayError(errors.CARD_ELEMENT_TOKENIZATION_NETWORK_ERROR);
    tokenizerError.details = response.name === 'SeamlesspayError' && response.details ? response.details: { originalError: response };
  }

  return tokenizerError;
}

function createTokenizationHandler(client, cardForm) {
  return function (options, reply) {
    options = options || {};
    var TOKENIZATION = requestTypes.REQUEST_TYPE_TOKENIZATION;
    var isEmpty = cardForm.isEmpty();
    var invalidFieldKeys = cardForm.invalidFieldKeys();
    var isValid = invalidFieldKeys.length === 0;

    if (isEmpty) {
      reply([
        new SeamlesspayError(errors.CARD_ELEMENT_FIELDS_EMPTY)
      ]);
      return;
    } else if (!isValid) {
      reply([
        new SeamlesspayError({
          type: errors.CARD_ELEMENT_FIELDS_INVALID.type,
          code: errors.CARD_ELEMENT_FIELDS_INVALID.code,
          message: errors.CARD_ELEMENT_FIELDS_INVALID.message,
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
              paymentType: PAYMENT_TYPE_CREDIT_CARD
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
  var iframe = assembleIFrames.assembleIFrames(window.parent).shift();
  if (iframe) iframe.seamlesspay.cardElement.initialize(cardForm);

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

},{"../../client/client":87,"../../lib/assemble-iframes":98,"../../lib/assign":99,"../../lib/bus":102,"../../lib/classlist":103,"../../lib/requests-sequence":115,"../../lib/seamlesspay-error":116,"../shared/constants":85,"../shared/errors":86,"./components/field-component":71,"./helpers":74,"./models/credit-card-form":76,"inject-stylesheet":60}],76:[function(_dereq_,module,exports){
(function (global){(function (){
'use strict';
var getCardTypes = _dereq_('credit-card-type');
var assign = _dereq_('./../../../lib/assign').assign;
var classlist = _dereq_('./../../../lib/classlist');
var EventedModel = _dereq_('./evented-model');
var comparePossibleCardTypes = _dereq_('../../../lib/compare-possible-card-types');
var validators = _dereq_('../validators');
var constants = _dereq_('../../shared/constants');
var common = _dereq_('../../shared/common');
var helpers = _dereq_('../helpers');

var events = constants.events;
var externalEvents = constants.externalEvents;
var requestTypes = constants.requestTypes;
var whitelistedFields = constants.whitelistedFields;
var tokenizerNonSecureFields = constants.tokenizerNonSecureFields;
var getMaxLength = common.getMaxLength;
var adjustTransformation = helpers.adjustTransformation;

function CreditCardForm(configuration) {
  this._components = {};
  this.configuration = configuration;
  this._fieldKeys = whitelistedFields.map(function (item) {

    return item.field;
  });

  EventedModel.apply(this, arguments);

  this._fieldKeys.forEach(function (field) {
    var onFieldChange = onFieldStateChange(this, field);
    this._validateField(field); // that should set isValid for default values
    this.on('change:' + field + '.value', onFieldValueChange(this, field));
    this.on('change:' + field + '.isFocused', onFieldFocusChange(this, field));
    this.on('change:' + field + '.isEmpty', onEmptyChange(this, field));
    this.on('change:' + field + '.isValid', onFieldChange);
    this.on('change:' + field + '.isPotentiallyValid', onFieldChange);
  }.bind(this));

  this.on('keydown');
  this.on('change:accountNumber.value', this._onNumberChange);
  this.on('change:possibleCardTypes', onCardTypeChange(this, 'accountNumber'));
  this.on('change:focusedField', onFocusedFieldChange(this));
}

CreditCardForm.prototype = Object.create(EventedModel.prototype);
CreditCardForm.prototype.constructor = CreditCardForm;

CreditCardForm.prototype.resetAttributes = function () {
  return this._fieldKeys.reduce(function (result, field) {
    result[field] = {
      value: '',
      isFocused: false,
      isValid: false,
      isPotentiallyValid: true,
      isEmpty: true
    };

    return result;
  }.bind(this), { possibleCardTypes: getCardTypes('') });
};

CreditCardForm.prototype.emitEvent = function (fieldKey, eventType, extra) {
  var cards;
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

  global.bus.emit(events.INPUT_EVENT, {
    merchantPayload: {
      cards: cards,
      emittedBy: fieldKey,
      fields: fields
    },
    extra: extra,
    type: eventType
  });
};

CreditCardForm.prototype.setupComponent = function (fieldKey, component) {
  this._components[fieldKey] = component;
};

CreditCardForm.prototype._onNumberChange = function (number) {
  var pureNumber = number.replace(/[-\s]/g, '');
  var newPossibleCardTypes = getCardTypes(pureNumber);
  var restrictLength = function (possibleCard) {
    var newLength = (possibleCard.lengths || []).filter(function(length) { return length <= 16 })
    return assign(possibleCard, { lengths: newLength })
  }
  newPossibleCardTypes = (newPossibleCardTypes || []).map(restrictLength)

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

CreditCardForm.prototype.getMaxLength = function (fieldName) {
  return getMaxLength(fieldName);
};

CreditCardForm.prototype.getCardData = function (params) {
  var TOKENIZATION = requestTypes.REQUEST_TYPE_TOKENIZATION;
  var extraFields;
  var extraData;
  var result = {};

  params = params || { requestType: TOKENIZATION, extraData: {} };
  extraData = params.extraData || {};
  extraFields = Object.keys(extraData);

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
    fieldData[field] = extraData[field];

    return this._fieldKeys.indexOf(field) !== -1 ? accum : assign(accum, fieldData);
  }.bind(this), result);

  this._fieldKeys.reduce(
    function (reducedResult, name) {
      var value = this.get(name + '.value');
      if (value.trim().length > 0) {
        reducedResult[name] = value.trim();
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

CreditCardForm.prototype.isEmpty = function () {

  return this._fieldKeys
    .every(function (key) {

      return this.get(key).value.length === 0;
    }.bind(this));
};

CreditCardForm.prototype.isValid = function () {

  return this._fieldKeys
    .every(function (key) {
      this._validateField(key);

      return this.get(key).isValid;
    }.bind(this));
};

CreditCardForm.prototype.isFocused = function () {
  return Boolean(this.get('focusedField'));
};

CreditCardForm.prototype.invalidFieldKeys = function () {

  return this._fieldKeys.filter(function (key) {
    this._validateField(key);

    return !this.get(key).isValid;
  }.bind(this));
};

CreditCardForm.prototype.getComponents = function () {
  return this._components;
};

CreditCardForm.prototype.onKeyUp = function (field) {
  var form = this;

  return function (event) {
    var isValid = form.get(field + '.isValid');
    var keyCode = event.keyCode;
    var target = event.target;
    var value = target.value;
    var fieldLength = String(value).length;
    var isEnd = target.selectionEnd === target.maxLength;
    var isStart = target.selectionEnd === 0;

    if ((isValid && isEnd && keyCode !== 39) || (keyCode === 39 && isEnd)) {
      moveFocus(1, field);
    }
    if ((keyCode === 8 && fieldLength === 0) || keyCode === 37 && isStart) {
      moveFocus(-1, field);
    }
  };
};

CreditCardForm.prototype.render = function () {
  var formElement = document.querySelector('form');
  if (!formElement) return;

  adjustTransformation(this, formElement);
  classlist.toggle(formElement, 'is-empty', this.isEmpty());
  classlist.toggle(formElement, 'is-focused', this.isFocused());
  classlist.toggle(formElement, 'is-invalid', !this.isValid() && !this.isEmpty());
  classlist.toggle(formElement, 'is-complete', !this.isEmpty() && this.isValid());
};

function moveFocus(dir, currentField) {
  var nextField;
  var formElement = document.querySelector('form');

  nextField = whitelistedFields.reduce(function (result, item, index) {
    var nextIndex = index + dir;
    if (item.field === currentField && whitelistedFields[nextIndex]) {
      return whitelistedFields[nextIndex].field;
    }

    return result;
  }, null);

  if (nextField) {
    formElement.querySelector('input[data-seamlesspay-name="' + nextField + '"]').focus();
  }
}

function onFieldValueChange(form, fieldKey) {
  return function () {
    form.set(fieldKey + '.isEmpty', form.get(fieldKey + '.value') === '');
    form._validateField(fieldKey);
    form.render();
    form.emitEvent(fieldKey, externalEvents.CHANGE);
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
    var isEmpty = form.get(field + '.isEmpty');
    var event = isEmpty ? externalEvents.EMPTY : externalEvents.NOT_EMPTY;
    form.render();
    form.emitEvent(field, event);
  };
}

function onFieldStateChange(form, field) {
  return function () {
    form.render();
    form.emitEvent(field, externalEvents.VALIDITY_CHANGE);
  };
}

function onFocusedFieldChange(form) {
  return function () {
    form.render();
  }
}

module.exports = {
  CreditCardForm: CreditCardForm
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../../lib/compare-possible-card-types":104,"../../shared/common":84,"../../shared/constants":85,"../helpers":74,"../validators":81,"./../../../lib/assign":99,"./../../../lib/classlist":103,"./evented-model":77,"credit-card-type":52}],77:[function(_dereq_,module,exports){
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

},{}],78:[function(_dereq_,module,exports){
'use strict';

var validator = _dereq_('card-validator');

function accountNumber(value) {

  return validator.number(value);
}

module.exports = accountNumber;

},{"card-validator":40}],79:[function(_dereq_,module,exports){
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

},{"./verification":83,"card-validator":40}],80:[function(_dereq_,module,exports){
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

},{"card-validator":40}],81:[function(_dereq_,module,exports){
'use strict';

var expDate = _dereq_('./expiration-date');
var accountNumber = _dereq_('./account-number');
var postalCode = _dereq_('./postal-code');
var cvv = _dereq_('./cvv');

module.exports = {
  accountNumber: accountNumber,
  postalCode: postalCode,
  cvv: cvv,
  expDate: expDate
};

},{"./account-number":78,"./cvv":79,"./expiration-date":80,"./postal-code":82}],82:[function(_dereq_,module,exports){
'use strict';

var validator = _dereq_('card-validator');
var verification = _dereq_('./verification');

function postalCode (value) {
  return value.trim().length === 0 ? verification(true, false) : validator.postalCode(value);
}

module.exports = postalCode;

},{"./verification":83,"card-validator":40}],83:[function(_dereq_,module,exports){
'use strict';
function verification (isValid, isPotentiallyValid) {
  return { isValid: isValid, isPotentiallyValid: isPotentiallyValid };
}
module.exports = verification;

},{}],84:[function(_dereq_,module,exports){
'use strict';

var constants = _dereq_('./constants');

var whitelistedFields = constants.whitelistedFields;

function getMaxLength(name) {
  var fieldData = whitelistedFields.find(function (item) {
    return item.field === name;
  }) || { defaultMaxLength: null };

  return fieldData.defaultMaxLength;
}

module.exports = {
  getMaxLength: getMaxLength
};

},{"./constants":85}],85:[function(_dereq_,module,exports){
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

},{"../../lib/enumerate":108}],86:[function(_dereq_,module,exports){
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

},{"../../lib/seamlesspay-error":116}],87:[function(_dereq_,module,exports){
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

},{"../lib/add-metadata":97,"../lib/assign":99,"../lib/constants":105,"../lib/convert-to-seamlesspay-error":106,"../lib/errors":109,"../lib/is-whitelisted-domain":111,"../lib/promise":113,"../lib/seamlesspay-error":116,"./constants":88,"./errors":89,"./request":92}],88:[function(_dereq_,module,exports){
'use strict';

module.exports = {
  SEAMLESSPAY_API_VERSION_HEADER: 'v2020'
};

},{}],89:[function(_dereq_,module,exports){
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

},{"../lib/seamlesspay-error":116}],90:[function(_dereq_,module,exports){
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

},{"../../lib/assign":99,"../../lib/querystring":114,"./parse-body":95,"./prep-body":96}],91:[function(_dereq_,module,exports){
(function (global){(function (){
'use strict';

module.exports = function getUserAgent() {
  return global.navigator.userAgent;
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],92:[function(_dereq_,module,exports){
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

},{"../../lib/once":112,"./ajax-driver":90,"./get-user-agent":91,"./is-http":93,"./jsonp-driver":94}],93:[function(_dereq_,module,exports){
(function (global){(function (){
'use strict';

module.exports = function () {
  return global.location.protocol === 'http:';
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],94:[function(_dereq_,module,exports){
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

},{"../../lib/querystring":114,"../../lib/uuid":117}],95:[function(_dereq_,module,exports){
'use strict';

module.exports = function (body) {
  try {
    body = JSON.parse(body);
  } catch (e) { /* ignored */ }

  return body;
};

},{}],96:[function(_dereq_,module,exports){
'use strict';

module.exports = function (method, body) {
  if (String(method).toLowerCase() !== 'get' && body != null) {
    body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  return body;
};

},{}],97:[function(_dereq_,module,exports){
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

},{}],98:[function(_dereq_,module,exports){
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

},{}],99:[function(_dereq_,module,exports){
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

},{}],100:[function(_dereq_,module,exports){
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

},{"../is-whitelisted-domain":111}],101:[function(_dereq_,module,exports){
'use strict';

var enumerate = _dereq_('../enumerate');

module.exports = enumerate([
  'CONFIGURATION_REQUEST'
], 'bus:');

},{"../enumerate":108}],102:[function(_dereq_,module,exports){
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

},{"../seamlesspay-error":116,"./check-origin":100,"./events":101,"framebus":59}],103:[function(_dereq_,module,exports){
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

},{}],104:[function(_dereq_,module,exports){
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

},{}],105:[function(_dereq_,module,exports){
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

},{}],106:[function(_dereq_,module,exports){
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

},{"./seamlesspay-error":116}],107:[function(_dereq_,module,exports){
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

},{"./fake-restricted-input":110,"@seamlesspay/restricted-input":32}],108:[function(_dereq_,module,exports){
'use strict';

function enumerate(values, prefix) {
  prefix = prefix == null ? '' : prefix;

  return values.reduce(function (enumeration, value) {
    enumeration[value] = prefix + value;
    return enumeration;
  }, {});
}

module.exports = enumerate;

},{}],109:[function(_dereq_,module,exports){
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

},{"./seamlesspay-error":116}],110:[function(_dereq_,module,exports){
'use strict';

function FakeRestrictedInput(options) {
  this.inputElement = options.element;
}

FakeRestrictedInput.prototype.getUnformattedValue = function () {
  return this.inputElement.value;
};

FakeRestrictedInput.prototype.setPattern = function () {};

module.exports = FakeRestrictedInput;

},{}],111:[function(_dereq_,module,exports){
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

},{}],112:[function(_dereq_,module,exports){
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

},{}],113:[function(_dereq_,module,exports){
(function (global){(function (){
'use strict';

var Promise = global.Promise;

module.exports = Promise;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],114:[function(_dereq_,module,exports){
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

},{}],115:[function(_dereq_,module,exports){
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

},{"./assign":99,"./promise":113}],116:[function(_dereq_,module,exports){
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

},{"./enumerate":108}],117:[function(_dereq_,module,exports){
'use strict';

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : r & 0x3 | 0x8;

    return v.toString(16);
  });
}

module.exports = uuid;

},{}]},{},[75])(75)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvQGJyYWludHJlZS9icm93c2VyLWRldGVjdGlvbi9kaXN0L2lzLWFuZHJvaWQuanMiLCJub2RlX21vZHVsZXMvQGJyYWludHJlZS9icm93c2VyLWRldGVjdGlvbi9kaXN0L2lzLWNocm9tZS1vcy5qcyIsIm5vZGVfbW9kdWxlcy9AYnJhaW50cmVlL2Jyb3dzZXItZGV0ZWN0aW9uL2Rpc3QvaXMtY2hyb21lLmpzIiwibm9kZV9tb2R1bGVzL0BicmFpbnRyZWUvYnJvd3Nlci1kZXRlY3Rpb24vZGlzdC9pcy1kdWNrZHVja2dvLmpzIiwibm9kZV9tb2R1bGVzL0BicmFpbnRyZWUvYnJvd3Nlci1kZXRlY3Rpb24vZGlzdC9pcy1lZGdlLmpzIiwibm9kZV9tb2R1bGVzL0BicmFpbnRyZWUvYnJvd3Nlci1kZXRlY3Rpb24vZGlzdC9pcy1pZTkuanMiLCJub2RlX21vZHVsZXMvQGJyYWludHJlZS9icm93c2VyLWRldGVjdGlvbi9kaXN0L2lzLWlvcy5qcyIsIm5vZGVfbW9kdWxlcy9AYnJhaW50cmVlL2Jyb3dzZXItZGV0ZWN0aW9uL2Rpc3QvaXMtaXBhZG9zLmpzIiwibm9kZV9tb2R1bGVzL0BicmFpbnRyZWUvYnJvd3Nlci1kZXRlY3Rpb24vZGlzdC9pcy1vcGVyYS5qcyIsIm5vZGVfbW9kdWxlcy9AYnJhaW50cmVlL2Jyb3dzZXItZGV0ZWN0aW9uL2Rpc3QvaXMtc2Ftc3VuZy5qcyIsIm5vZGVfbW9kdWxlcy9AYnJhaW50cmVlL2Jyb3dzZXItZGV0ZWN0aW9uL2Rpc3QvaXMtc2lsay5qcyIsIm5vZGVfbW9kdWxlcy9AYnJhaW50cmVlL2Jyb3dzZXItZGV0ZWN0aW9uL2lzLWFuZHJvaWQuanMiLCJub2RlX21vZHVsZXMvQGJyYWludHJlZS9icm93c2VyLWRldGVjdGlvbi9pcy1jaHJvbWUtb3MuanMiLCJub2RlX21vZHVsZXMvQGJyYWludHJlZS9icm93c2VyLWRldGVjdGlvbi9pcy1jaHJvbWUuanMiLCJub2RlX21vZHVsZXMvQGJyYWludHJlZS9icm93c2VyLWRldGVjdGlvbi9pcy1pZTkuanMiLCJub2RlX21vZHVsZXMvQGJyYWludHJlZS9icm93c2VyLWRldGVjdGlvbi9pcy1pb3MuanMiLCJub2RlX21vZHVsZXMvQHNlYW1sZXNzcGF5L3Jlc3RyaWN0ZWQtaW5wdXQvZGlzdC9saWIvZGV2aWNlLmpzIiwibm9kZV9tb2R1bGVzL0BzZWFtbGVzc3BheS9yZXN0cmljdGVkLWlucHV0L2Rpc3QvbGliL2Zvcm1hdHRlci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9Ac2VhbWxlc3NwYXkvcmVzdHJpY3RlZC1pbnB1dC9kaXN0L2xpYi9mb3JtYXR0ZXIvcGFyc2UtcGF0dGVybi5qcyIsIm5vZGVfbW9kdWxlcy9Ac2VhbWxlc3NwYXkvcmVzdHJpY3RlZC1pbnB1dC9kaXN0L2xpYi9pbnB1dC1zZWxlY3Rpb24uanMiLCJub2RlX21vZHVsZXMvQHNlYW1sZXNzcGF5L3Jlc3RyaWN0ZWQtaW5wdXQvZGlzdC9saWIvaXMtYmFja3NwYWNlLmpzIiwibm9kZV9tb2R1bGVzL0BzZWFtbGVzc3BheS9yZXN0cmljdGVkLWlucHV0L2Rpc3QvbGliL2lzLWRlbGV0ZS5qcyIsIm5vZGVfbW9kdWxlcy9Ac2VhbWxlc3NwYXkvcmVzdHJpY3RlZC1pbnB1dC9kaXN0L2xpYi9rZXktY2Fubm90LW11dGF0ZS12YWx1ZS5qcyIsIm5vZGVfbW9kdWxlcy9Ac2VhbWxlc3NwYXkvcmVzdHJpY3RlZC1pbnB1dC9kaXN0L2xpYi9yZXN0cmljdGVkLWlucHV0LmpzIiwibm9kZV9tb2R1bGVzL0BzZWFtbGVzc3BheS9yZXN0cmljdGVkLWlucHV0L2Rpc3QvbGliL3N0cmF0ZWdpZXMvYW5kcm9pZC1jaHJvbWUuanMiLCJub2RlX21vZHVsZXMvQHNlYW1sZXNzcGF5L3Jlc3RyaWN0ZWQtaW5wdXQvZGlzdC9saWIvc3RyYXRlZ2llcy9iYXNlLmpzIiwibm9kZV9tb2R1bGVzL0BzZWFtbGVzc3BheS9yZXN0cmljdGVkLWlucHV0L2Rpc3QvbGliL3N0cmF0ZWdpZXMvaWU5LmpzIiwibm9kZV9tb2R1bGVzL0BzZWFtbGVzc3BheS9yZXN0cmljdGVkLWlucHV0L2Rpc3QvbGliL3N0cmF0ZWdpZXMvaW9zLmpzIiwibm9kZV9tb2R1bGVzL0BzZWFtbGVzc3BheS9yZXN0cmljdGVkLWlucHV0L2Rpc3QvbGliL3N0cmF0ZWdpZXMva2l0a2F0LWNocm9taXVtLWJhc2VkLXdlYnZpZXcuanMiLCJub2RlX21vZHVsZXMvQHNlYW1sZXNzcGF5L3Jlc3RyaWN0ZWQtaW5wdXQvZGlzdC9saWIvc3RyYXRlZ2llcy9ub29wLmpzIiwibm9kZV9tb2R1bGVzL0BzZWFtbGVzc3BheS9yZXN0cmljdGVkLWlucHV0L2Rpc3QvbGliL3N0cmF0ZWdpZXMvc3RyYXRlZ3ktaW50ZXJmYWNlLmpzIiwibm9kZV9tb2R1bGVzL0BzZWFtbGVzc3BheS9yZXN0cmljdGVkLWlucHV0L2Rpc3QvbWFpbi5qcyIsIm5vZGVfbW9kdWxlcy9Ac2VhbWxlc3NwYXkvcmVzdHJpY3RlZC1pbnB1dC9kaXN0L3N1cHBvcnRzLWlucHV0LWZvcm1hdHRpbmcuanMiLCJub2RlX21vZHVsZXMvY2FyZC12YWxpZGF0b3IvZGlzdC9jYXJkLW51bWJlci5qcyIsIm5vZGVfbW9kdWxlcy9jYXJkLXZhbGlkYXRvci9kaXN0L2NhcmRob2xkZXItbmFtZS5qcyIsIm5vZGVfbW9kdWxlcy9jYXJkLXZhbGlkYXRvci9kaXN0L2N2di5qcyIsIm5vZGVfbW9kdWxlcy9jYXJkLXZhbGlkYXRvci9kaXN0L2V4cGlyYXRpb24tZGF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jYXJkLXZhbGlkYXRvci9kaXN0L2V4cGlyYXRpb24tbW9udGguanMiLCJub2RlX21vZHVsZXMvY2FyZC12YWxpZGF0b3IvZGlzdC9leHBpcmF0aW9uLXllYXIuanMiLCJub2RlX21vZHVsZXMvY2FyZC12YWxpZGF0b3IvZGlzdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jYXJkLXZhbGlkYXRvci9kaXN0L2xpYi9pcy1hcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9jYXJkLXZhbGlkYXRvci9kaXN0L2xpYi9wYXJzZS1kYXRlLmpzIiwibm9kZV9tb2R1bGVzL2NhcmQtdmFsaWRhdG9yL2Rpc3QvbHVobi0xMC5qcyIsIm5vZGVfbW9kdWxlcy9jYXJkLXZhbGlkYXRvci9kaXN0L3Bvc3RhbC1jb2RlLmpzIiwibm9kZV9tb2R1bGVzL2NhcmQtdmFsaWRhdG9yL25vZGVfbW9kdWxlcy9jcmVkaXQtY2FyZC10eXBlL2Rpc3QvaW5kZXguanMiLCJub2RlX21vZHVsZXMvY2FyZC12YWxpZGF0b3Ivbm9kZV9tb2R1bGVzL2NyZWRpdC1jYXJkLXR5cGUvZGlzdC9saWIvYWRkLW1hdGNoaW5nLWNhcmRzLXRvLXJlc3VsdHMuanMiLCJub2RlX21vZHVsZXMvY2FyZC12YWxpZGF0b3Ivbm9kZV9tb2R1bGVzL2NyZWRpdC1jYXJkLXR5cGUvZGlzdC9saWIvY2FyZC10eXBlcy5qcyIsIm5vZGVfbW9kdWxlcy9jYXJkLXZhbGlkYXRvci9ub2RlX21vZHVsZXMvY3JlZGl0LWNhcmQtdHlwZS9kaXN0L2xpYi9jbG9uZS5qcyIsIm5vZGVfbW9kdWxlcy9jYXJkLXZhbGlkYXRvci9ub2RlX21vZHVsZXMvY3JlZGl0LWNhcmQtdHlwZS9kaXN0L2xpYi9maW5kLWJlc3QtbWF0Y2guanMiLCJub2RlX21vZHVsZXMvY2FyZC12YWxpZGF0b3Ivbm9kZV9tb2R1bGVzL2NyZWRpdC1jYXJkLXR5cGUvZGlzdC9saWIvaXMtdmFsaWQtaW5wdXQtdHlwZS5qcyIsIm5vZGVfbW9kdWxlcy9jYXJkLXZhbGlkYXRvci9ub2RlX21vZHVsZXMvY3JlZGl0LWNhcmQtdHlwZS9kaXN0L2xpYi9tYXRjaGVzLmpzIiwibm9kZV9tb2R1bGVzL2NyZWRpdC1jYXJkLXR5cGUvaW5kZXguanMiLCJub2RlX21vZHVsZXMvY3JlZGl0LWNhcmQtdHlwZS9saWIvYWRkLW1hdGNoaW5nLWNhcmRzLXRvLXJlc3VsdHMuanMiLCJub2RlX21vZHVsZXMvY3JlZGl0LWNhcmQtdHlwZS9saWIvY2FyZC10eXBlcy5qcyIsIm5vZGVfbW9kdWxlcy9jcmVkaXQtY2FyZC10eXBlL2xpYi9jbG9uZS5qcyIsIm5vZGVfbW9kdWxlcy9jcmVkaXQtY2FyZC10eXBlL2xpYi9maW5kLWJlc3QtbWF0Y2guanMiLCJub2RlX21vZHVsZXMvY3JlZGl0LWNhcmQtdHlwZS9saWIvaXMtdmFsaWQtaW5wdXQtdHlwZS5qcyIsIm5vZGVfbW9kdWxlcy9jcmVkaXQtY2FyZC10eXBlL2xpYi9tYXRjaGVzLmpzIiwibm9kZV9tb2R1bGVzL2ZyYW1lYnVzL2xpYi9mcmFtZWJ1cy5qcyIsIm5vZGVfbW9kdWxlcy9pbmplY3Qtc3R5bGVzaGVldC9kaXN0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2luamVjdC1zdHlsZXNoZWV0L2Rpc3QvbGliL2ZpbHRlci1zdHlsZS1rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2luamVjdC1zdHlsZXNoZWV0L2Rpc3QvbGliL2ZpbHRlci1zdHlsZS12YWx1ZXMuanMiLCJub2RlX21vZHVsZXMvaW5qZWN0LXN0eWxlc2hlZXQvZGlzdC9saWIvaW5qZWN0LXN0eWxlc2hlZXQuanMiLCJub2RlX21vZHVsZXMvaW5qZWN0LXN0eWxlc2hlZXQvZGlzdC9saWIvdmFsaWRhdGUtc2VsZWN0b3IuanMiLCJzcmMvY2FyZC1lbGVtZW50L2V4dGVybmFsL2F0dHJpYnV0ZS12YWxpZGF0aW9uLWVycm9yLmpzIiwic3JjL2NhcmQtZWxlbWVudC9pbnRlcm5hbC9jb21wb25lbnRzL2FjY291bnQtbnVtYmVyLWlucHV0LmpzIiwic3JjL2NhcmQtZWxlbWVudC9pbnRlcm5hbC9jb21wb25lbnRzL2Jhc2UtaW5wdXQuanMiLCJzcmMvY2FyZC1lbGVtZW50L2ludGVybmFsL2NvbXBvbmVudHMvY2FyZC1icmFuZC1pY29uLmpzIiwic3JjL2NhcmQtZWxlbWVudC9pbnRlcm5hbC9jb21wb25lbnRzL2N2di1pbnB1dC5qcyIsInNyYy9jYXJkLWVsZW1lbnQvaW50ZXJuYWwvY29tcG9uZW50cy9leHBpcmF0aW9uLWRhdGUtaW5wdXQuanMiLCJzcmMvY2FyZC1lbGVtZW50L2ludGVybmFsL2NvbXBvbmVudHMvZmllbGQtY29tcG9uZW50LmpzIiwic3JjL2NhcmQtZWxlbWVudC9pbnRlcm5hbC9jb21wb25lbnRzL2luZGV4LmpzIiwic3JjL2NhcmQtZWxlbWVudC9pbnRlcm5hbC9jb21wb25lbnRzL3Bvc3RhbC1jb2RlLWlucHV0LmpzIiwic3JjL2NhcmQtZWxlbWVudC9pbnRlcm5hbC9oZWxwZXJzLmpzIiwic3JjL2NhcmQtZWxlbWVudC9pbnRlcm5hbC9pbmRleC5qcyIsInNyYy9jYXJkLWVsZW1lbnQvaW50ZXJuYWwvbW9kZWxzL2NyZWRpdC1jYXJkLWZvcm0uanMiLCJzcmMvY2FyZC1lbGVtZW50L2ludGVybmFsL21vZGVscy9ldmVudGVkLW1vZGVsLmpzIiwic3JjL2NhcmQtZWxlbWVudC9pbnRlcm5hbC92YWxpZGF0b3JzL2FjY291bnQtbnVtYmVyLmpzIiwic3JjL2NhcmQtZWxlbWVudC9pbnRlcm5hbC92YWxpZGF0b3JzL2N2di5qcyIsInNyYy9jYXJkLWVsZW1lbnQvaW50ZXJuYWwvdmFsaWRhdG9ycy9leHBpcmF0aW9uLWRhdGUuanMiLCJzcmMvY2FyZC1lbGVtZW50L2ludGVybmFsL3ZhbGlkYXRvcnMvaW5kZXguanMiLCJzcmMvY2FyZC1lbGVtZW50L2ludGVybmFsL3ZhbGlkYXRvcnMvcG9zdGFsLWNvZGUuanMiLCJzcmMvY2FyZC1lbGVtZW50L2ludGVybmFsL3ZhbGlkYXRvcnMvdmVyaWZpY2F0aW9uLmpzIiwic3JjL2NhcmQtZWxlbWVudC9zaGFyZWQvY29tbW9uLmpzIiwic3JjL2NhcmQtZWxlbWVudC9zaGFyZWQvY29uc3RhbnRzLmpzIiwic3JjL2NhcmQtZWxlbWVudC9zaGFyZWQvZXJyb3JzLmpzIiwic3JjL2NsaWVudC9jbGllbnQuanMiLCJzcmMvY2xpZW50L2NvbnN0YW50cy5qcyIsInNyYy9jbGllbnQvZXJyb3JzLmpzIiwic3JjL2NsaWVudC9yZXF1ZXN0L2FqYXgtZHJpdmVyLmpzIiwic3JjL2NsaWVudC9yZXF1ZXN0L2dldC11c2VyLWFnZW50LmpzIiwic3JjL2NsaWVudC9yZXF1ZXN0L2luZGV4LmpzIiwic3JjL2NsaWVudC9yZXF1ZXN0L2lzLWh0dHAuanMiLCJzcmMvY2xpZW50L3JlcXVlc3QvanNvbnAtZHJpdmVyLmpzIiwic3JjL2NsaWVudC9yZXF1ZXN0L3BhcnNlLWJvZHkuanMiLCJzcmMvY2xpZW50L3JlcXVlc3QvcHJlcC1ib2R5LmpzIiwic3JjL2xpYi9hZGQtbWV0YWRhdGEuanMiLCJzcmMvbGliL2Fzc2VtYmxlLWlmcmFtZXMuanMiLCJzcmMvbGliL2Fzc2lnbi5qcyIsInNyYy9saWIvYnVzL2NoZWNrLW9yaWdpbi5qcyIsInNyYy9saWIvYnVzL2V2ZW50cy5qcyIsInNyYy9saWIvYnVzL2luZGV4LmpzIiwic3JjL2xpYi9jbGFzc2xpc3QuanMiLCJzcmMvbGliL2NvbXBhcmUtcG9zc2libGUtY2FyZC10eXBlcy5qcyIsInNyYy9saWIvY29uc3RhbnRzLmpzIiwic3JjL2xpYi9jb252ZXJ0LXRvLXNlYW1sZXNzcGF5LWVycm9yLmpzIiwic3JjL2xpYi9jcmVhdGUtcmVzdHJpY3RlZC1pbnB1dC5qcyIsInNyYy9saWIvZW51bWVyYXRlLmpzIiwic3JjL2xpYi9lcnJvcnMuanMiLCJzcmMvbGliL2Zha2UtcmVzdHJpY3RlZC1pbnB1dC5qcyIsInNyYy9saWIvaXMtd2hpdGVsaXN0ZWQtZG9tYWluLmpzIiwic3JjL2xpYi9vbmNlLmpzIiwic3JjL2xpYi9wcm9taXNlLmpzIiwic3JjL2xpYi9xdWVyeXN0cmluZy5qcyIsInNyYy9saWIvcmVxdWVzdHMtc2VxdWVuY2UuanMiLCJzcmMvbGliL3NlYW1sZXNzcGF5LWVycm9yLmpzIiwic3JjL2xpYi91dWlkLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBOztBQ0RBO0FBQ0E7O0FDREE7QUFDQTs7QUNEQTtBQUNBOztBQ0RBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDek9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN0VEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ3ZQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNoT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUMxR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDdFBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzdUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdFVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM1R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN2RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIlwidXNlIHN0cmljdFwiO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0FuZHJvaWQodWEpIHtcbiAgICB1YSA9IHVhIHx8IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50O1xuICAgIHJldHVybiAvQW5kcm9pZC9pLnRlc3QodWEpO1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0Nocm9tZU9TKHVhKSB7XG4gICAgdWEgPSB1YSB8fCB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudDtcbiAgICByZXR1cm4gL0NyT1MvaS50ZXN0KHVhKTtcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBpc0VkZ2UgPSByZXF1aXJlKFwiLi9pcy1lZGdlXCIpO1xudmFyIGlzU2Ftc3VuZyA9IHJlcXVpcmUoXCIuL2lzLXNhbXN1bmdcIik7XG52YXIgaXNEdWNrRHVja0dvID0gcmVxdWlyZShcIi4vaXMtZHVja2R1Y2tnb1wiKTtcbnZhciBpc09wZXJhID0gcmVxdWlyZShcIi4vaXMtb3BlcmFcIik7XG52YXIgaXNTaWxrID0gcmVxdWlyZShcIi4vaXMtc2lsa1wiKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNDaHJvbWUodWEpIHtcbiAgICB1YSA9IHVhIHx8IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50O1xuICAgIHJldHVybiAoKHVhLmluZGV4T2YoXCJDaHJvbWVcIikgIT09IC0xIHx8IHVhLmluZGV4T2YoXCJDcmlPU1wiKSAhPT0gLTEpICYmXG4gICAgICAgICFpc0VkZ2UodWEpICYmXG4gICAgICAgICFpc1NhbXN1bmcodWEpICYmXG4gICAgICAgICFpc0R1Y2tEdWNrR28odWEpICYmXG4gICAgICAgICFpc09wZXJhKHVhKSAmJlxuICAgICAgICAhaXNTaWxrKHVhKSk7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzRHVja0R1Y2tHbyh1YSkge1xuICAgIHVhID0gdWEgfHwgd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQ7XG4gICAgcmV0dXJuIHVhLmluZGV4T2YoXCJEdWNrRHVja0dvL1wiKSAhPT0gLTE7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzRWRnZSh1YSkge1xuICAgIHVhID0gdWEgfHwgd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQ7XG4gICAgcmV0dXJuIHVhLmluZGV4T2YoXCJFZGdlL1wiKSAhPT0gLTEgfHwgdWEuaW5kZXhPZihcIkVkZy9cIikgIT09IC0xO1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0llOSh1YSkge1xuICAgIHVhID0gdWEgfHwgd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQ7XG4gICAgcmV0dXJuIHVhLmluZGV4T2YoXCJNU0lFIDlcIikgIT09IC0xO1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIGlzSXBhZE9TID0gcmVxdWlyZShcIi4vaXMtaXBhZG9zXCIpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0lvcyh1YSwgY2hlY2tJcGFkT1MsIGRvY3VtZW50KSB7XG4gICAgaWYgKGNoZWNrSXBhZE9TID09PSB2b2lkIDApIHsgY2hlY2tJcGFkT1MgPSB0cnVlOyB9XG4gICAgdWEgPSB1YSB8fCB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudDtcbiAgICB2YXIgaU9zVGVzdCA9IC9pUGhvbmV8aVBvZHxpUGFkL2kudGVzdCh1YSk7XG4gICAgcmV0dXJuIGNoZWNrSXBhZE9TID8gaU9zVGVzdCB8fCBpc0lwYWRPUyh1YSwgZG9jdW1lbnQpIDogaU9zVGVzdDtcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNJcGFkT1ModWEsIGRvY3VtZW50KSB7XG4gICAgdWEgPSB1YSB8fCB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudDtcbiAgICBkb2N1bWVudCA9IGRvY3VtZW50IHx8IHdpbmRvdy5kb2N1bWVudDtcbiAgICAvLyBcIm9udG91Y2hlbmRcIiBpcyB1c2VkIHRvIGRldGVybWluZSBpZiBhIGJyb3dzZXIgaXMgb24gYW4gaVBhZCwgb3RoZXJ3aXNlXG4gICAgLy8gdXNlci1hZ2VudHMgZm9yIGlQYWRPUyBiZWhhdmUvaWRlbnRpZnkgYXMgYSBkZXNrdG9wIGJyb3dzZXJcbiAgICByZXR1cm4gL01hY3xpUGFkL2kudGVzdCh1YSkgJiYgXCJvbnRvdWNoZW5kXCIgaW4gZG9jdW1lbnQ7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzT3BlcmEodWEpIHtcbiAgICB1YSA9IHVhIHx8IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50O1xuICAgIHJldHVybiAodWEuaW5kZXhPZihcIk9QUi9cIikgIT09IC0xIHx8XG4gICAgICAgIHVhLmluZGV4T2YoXCJPcGVyYS9cIikgIT09IC0xIHx8XG4gICAgICAgIHVhLmluZGV4T2YoXCJPUFQvXCIpICE9PSAtMSk7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzU2Ftc3VuZ0Jyb3dzZXIodWEpIHtcbiAgICB1YSA9IHVhIHx8IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50O1xuICAgIHJldHVybiAvU2Ftc3VuZ0Jyb3dzZXIvaS50ZXN0KHVhKTtcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNTaWxrKHVhKSB7XG4gICAgdWEgPSB1YSB8fCB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudDtcbiAgICByZXR1cm4gdWEuaW5kZXhPZihcIlNpbGsvXCIpICE9PSAtMTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuL2Rpc3QvaXMtYW5kcm9pZFwiKTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4vZGlzdC9pcy1jaHJvbWUtb3NcIik7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuL2Rpc3QvaXMtY2hyb21lXCIpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi9kaXN0L2lzLWllOVwiKTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4vZGlzdC9pcy1pb3NcIik7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuaXNJb3MgPSBleHBvcnRzLmlzSUU5ID0gZXhwb3J0cy5pc1NhbXN1bmdCcm93c2VyID0gZXhwb3J0cy5pc0FuZHJvaWRDaHJvbWUgPSBleHBvcnRzLmlzS2l0S2F0V2VidmlldyA9IHZvaWQgMDtcbi8vIHNlcnZlciBzaWRlIHJlbmRlcmluZyBjaGVja1xudmFyIFVBID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiZcbiAgICB3aW5kb3cubmF2aWdhdG9yICYmXG4gICAgd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQpO1xuLy8gVE9ETyByZW1vdmUgdGhpcyB3aGVuIGJyb3dzZXIgZGV0ZWN0aW9uIGlzIGNvbnZlcnRlZCB0byB0eXBlc2NyaXB0XG4vKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvYmFuLXRzLWNvbW1lbnQgKi9cbi8vIEB0cy1pZ25vcmVcbnZhciBpc0FuZHJvaWQgPSByZXF1aXJlKFwiQGJyYWludHJlZS9icm93c2VyLWRldGVjdGlvbi9pcy1hbmRyb2lkXCIpO1xuLy8gQHRzLWlnbm9yZVxudmFyIGlzQ2hyb21lT3MgPSByZXF1aXJlKFwiQGJyYWludHJlZS9icm93c2VyLWRldGVjdGlvbi9pcy1jaHJvbWUtb3NcIik7XG4vLyBAdHMtaWdub3JlXG52YXIgaXNDaHJvbWUgPSByZXF1aXJlKFwiQGJyYWludHJlZS9icm93c2VyLWRldGVjdGlvbi9pcy1jaHJvbWVcIik7XG4vLyBAdHMtaWdub3JlXG52YXIgaXNJb3MgPSByZXF1aXJlKFwiQGJyYWludHJlZS9icm93c2VyLWRldGVjdGlvbi9pcy1pb3NcIik7XG5leHBvcnRzLmlzSW9zID0gaXNJb3M7XG4vLyBAdHMtaWdub3JlXG52YXIgaXNJRTkgPSByZXF1aXJlKFwiQGJyYWludHJlZS9icm93c2VyLWRldGVjdGlvbi9pcy1pZTlcIik7XG5leHBvcnRzLmlzSUU5ID0gaXNJRTk7XG4vKiBlc2xpbnQtZW5hYmxlIEB0eXBlc2NyaXB0LWVzbGludC9iYW4tdHMtY29tbWVudCAqL1xuLy8gT2xkIEFuZHJvaWQgV2Vidmlld3MgdXNlZCBzcGVjaWZpYyB2ZXJzaW9ucyBvZiBDaHJvbWUgd2l0aCAwLjAuMCBhcyB0aGVpciB2ZXJzaW9uIHN1ZmZpeFxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIuY2hyb21lLmNvbS9tdWx0aWRldmljZS91c2VyLWFnZW50I3dlYnZpZXdfdXNlcl9hZ2VudFxudmFyIEtJVEtBVF9XRUJWSUVXX1JFR0VYID0gL1ZlcnNpb25cXC9cXGRcXC5cXGQqIENocm9tZVxcL1xcZCpcXC4wXFwuMFxcLjAvO1xuZnVuY3Rpb24gaXNPbGRTYW1zdW5nQnJvd3Nlck9yU2Ftc3VuZ1dlYnZpZXcodWEpIHtcbiAgICByZXR1cm4gIWlzQ2hyb21lKHVhKSAmJiB1YS5pbmRleE9mKFwiU2Ftc3VuZ1wiKSA+IC0xO1xufVxuZnVuY3Rpb24gaXNLaXRLYXRXZWJ2aWV3KHVhKSB7XG4gICAgaWYgKHVhID09PSB2b2lkIDApIHsgdWEgPSBVQTsgfVxuICAgIHJldHVybiBpc0FuZHJvaWQodWEpICYmIEtJVEtBVF9XRUJWSUVXX1JFR0VYLnRlc3QodWEpO1xufVxuZXhwb3J0cy5pc0tpdEthdFdlYnZpZXcgPSBpc0tpdEthdFdlYnZpZXc7XG5mdW5jdGlvbiBpc0FuZHJvaWRDaHJvbWUodWEpIHtcbiAgICBpZiAodWEgPT09IHZvaWQgMCkgeyB1YSA9IFVBOyB9XG4gICAgcmV0dXJuIChpc0FuZHJvaWQodWEpIHx8IGlzQ2hyb21lT3ModWEpKSAmJiBpc0Nocm9tZSh1YSk7XG59XG5leHBvcnRzLmlzQW5kcm9pZENocm9tZSA9IGlzQW5kcm9pZENocm9tZTtcbmZ1bmN0aW9uIGlzU2Ftc3VuZ0Jyb3dzZXIodWEpIHtcbiAgICBpZiAodWEgPT09IHZvaWQgMCkgeyB1YSA9IFVBOyB9XG4gICAgcmV0dXJuIC9TYW1zdW5nQnJvd3Nlci8udGVzdCh1YSkgfHwgaXNPbGRTYW1zdW5nQnJvd3Nlck9yU2Ftc3VuZ1dlYnZpZXcodWEpO1xufVxuZXhwb3J0cy5pc1NhbXN1bmdCcm93c2VyID0gaXNTYW1zdW5nQnJvd3NlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5QYXR0ZXJuRm9ybWF0dGVyID0gdm9pZCAwO1xudmFyIHBhcnNlX3BhdHRlcm5fMSA9IHJlcXVpcmUoXCIuL3BhcnNlLXBhdHRlcm5cIik7XG52YXIgaXNfYmFja3NwYWNlXzEgPSByZXF1aXJlKFwiLi4vaXMtYmFja3NwYWNlXCIpO1xudmFyIFBhdHRlcm5Gb3JtYXR0ZXIgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gUGF0dGVybkZvcm1hdHRlcihwYXR0ZXJuKSB7XG4gICAgICAgIHRoaXMucGF0dGVybiA9ICgwLCBwYXJzZV9wYXR0ZXJuXzEucGFyc2VQYXR0ZXJuKShwYXR0ZXJuKTtcbiAgICB9XG4gICAgUGF0dGVybkZvcm1hdHRlci5wcm90b3R5cGUuZm9ybWF0ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIG9yaWdpbmFsU3RyaW5nID0gb3B0aW9ucy52YWx1ZTtcbiAgICAgICAgdmFyIG9yaWdpbmFsU3RyaW5nSW5kZXggPSAwO1xuICAgICAgICB2YXIgZm9ybWF0dGVkU3RyaW5nID0gXCJcIjtcbiAgICAgICAgdmFyIHNlbGVjdGlvbiA9IHtcbiAgICAgICAgICAgIHN0YXJ0OiBvcHRpb25zLnNlbGVjdGlvbi5zdGFydCxcbiAgICAgICAgICAgIGVuZDogb3B0aW9ucy5zZWxlY3Rpb24uZW5kLFxuICAgICAgICB9O1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucGF0dGVybi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHBhdHRlcm5DaGFyID0gdGhpcy5wYXR0ZXJuW2ldO1xuICAgICAgICAgICAgdmFyIGlucHV0Q2hhciA9IG9yaWdpbmFsU3RyaW5nW29yaWdpbmFsU3RyaW5nSW5kZXhdO1xuICAgICAgICAgICAgaWYgKG9yaWdpbmFsU3RyaW5nSW5kZXggPiBvcmlnaW5hbFN0cmluZy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlb2YgcGF0dGVybkNoYXIudmFsdWUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoaW5wdXRDaGFyICE9IG51bGwgfHwgZm9ybWF0dGVkU3RyaW5nLmxlbmd0aCA9PT0gcGF0dGVybkNoYXIuaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9ybWF0dGVkU3RyaW5nICs9IHBhdHRlcm5DaGFyLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBpZiAocGF0dGVybkNoYXIuaW5kZXggPD0gc2VsZWN0aW9uLnN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb24uc3RhcnQrKztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAocGF0dGVybkNoYXIuaW5kZXggPD0gc2VsZWN0aW9uLmVuZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0aW9uLmVuZCsrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gVXNlciBpbnB1dCBjaGFyXG4gICAgICAgICAgICAgICAgLy8gcHJldHRpZXItaWdub3JlXG4gICAgICAgICAgICAgICAgZm9yICg7IG9yaWdpbmFsU3RyaW5nSW5kZXggPCBvcmlnaW5hbFN0cmluZy5sZW5ndGg7IG9yaWdpbmFsU3RyaW5nSW5kZXgrKykge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dENoYXIgPSBvcmlnaW5hbFN0cmluZ1tvcmlnaW5hbFN0cmluZ0luZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhdHRlcm5DaGFyLnZhbHVlLnRlc3QoaW5wdXRDaGFyKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybWF0dGVkU3RyaW5nICs9IGlucHV0Q2hhcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsU3RyaW5nSW5kZXgrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhdHRlcm5DaGFyLmluZGV4IDw9IHNlbGVjdGlvbi5zdGFydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvbi5zdGFydC0tO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhdHRlcm5DaGFyLmluZGV4IDw9IHNlbGVjdGlvbi5lbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb24uZW5kLS07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHZhbHVlOiBmb3JtYXR0ZWRTdHJpbmcsXG4gICAgICAgICAgICBzZWxlY3Rpb246IHNlbGVjdGlvbixcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIFBhdHRlcm5Gb3JtYXR0ZXIucHJvdG90eXBlLnVuZm9ybWF0ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIHN0YXJ0ID0gb3B0aW9ucy5zZWxlY3Rpb24uc3RhcnQ7XG4gICAgICAgIHZhciBlbmQgPSBvcHRpb25zLnNlbGVjdGlvbi5lbmQ7XG4gICAgICAgIHZhciB1bmZvcm1hdHRlZFN0cmluZyA9IFwiXCI7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5wYXR0ZXJuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgcGF0dGVybkNoYXIgPSB0aGlzLnBhdHRlcm5baV07XG4gICAgICAgICAgICBpZiAodHlwZW9mIHBhdHRlcm5DaGFyLnZhbHVlICE9PSBcInN0cmluZ1wiICYmXG4gICAgICAgICAgICAgICAgb3B0aW9ucy52YWx1ZVtpXSAhPSBudWxsICYmXG4gICAgICAgICAgICAgICAgcGF0dGVybkNoYXIudmFsdWUudGVzdChvcHRpb25zLnZhbHVlW2ldKSkge1xuICAgICAgICAgICAgICAgIHVuZm9ybWF0dGVkU3RyaW5nICs9IG9wdGlvbnMudmFsdWVbaV07XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocGF0dGVybkNoYXIudmFsdWUgIT09IG9wdGlvbnMudmFsdWVbcGF0dGVybkNoYXIuaW5kZXhdKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocGF0dGVybkNoYXIuaW5kZXggPCBvcHRpb25zLnNlbGVjdGlvbi5zdGFydCkge1xuICAgICAgICAgICAgICAgIHN0YXJ0LS07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocGF0dGVybkNoYXIuaW5kZXggPCBvcHRpb25zLnNlbGVjdGlvbi5lbmQpIHtcbiAgICAgICAgICAgICAgICBlbmQtLTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc2VsZWN0aW9uOiB7XG4gICAgICAgICAgICAgICAgc3RhcnQ6IHN0YXJ0LFxuICAgICAgICAgICAgICAgIGVuZDogZW5kLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHZhbHVlOiB1bmZvcm1hdHRlZFN0cmluZyxcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIFBhdHRlcm5Gb3JtYXR0ZXIucHJvdG90eXBlLnNpbXVsYXRlRGVsZXRpb24gPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICB2YXIgZGVsZXRpb25TdGFydCwgZGVsZXRpb25FbmQ7XG4gICAgICAgIHZhciBzdGF0ZSA9IHRoaXMudW5mb3JtYXQob3B0aW9ucyk7XG4gICAgICAgIHZhciB2YWx1ZSA9IHN0YXRlLnZhbHVlO1xuICAgICAgICB2YXIgc2VsZWN0aW9uID0gc3RhdGUuc2VsZWN0aW9uO1xuICAgICAgICB2YXIgZGVsdGEgPSBNYXRoLmFicyhzdGF0ZS5zZWxlY3Rpb24uZW5kIC0gc3RhdGUuc2VsZWN0aW9uLnN0YXJ0KTtcbiAgICAgICAgaWYgKGRlbHRhKSB7XG4gICAgICAgICAgICBkZWxldGlvblN0YXJ0ID0gc2VsZWN0aW9uLnN0YXJ0O1xuICAgICAgICAgICAgZGVsZXRpb25FbmQgPSBzZWxlY3Rpb24uZW5kO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCgwLCBpc19iYWNrc3BhY2VfMS5pc0JhY2tzcGFjZSkob3B0aW9ucy5ldmVudCkpIHtcbiAgICAgICAgICAgIGRlbGV0aW9uU3RhcnQgPSBNYXRoLm1heCgwLCBzZWxlY3Rpb24uc3RhcnQgLSAxKTtcbiAgICAgICAgICAgIGRlbGV0aW9uRW5kID0gc2VsZWN0aW9uLnN0YXJ0O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gSGFuZGxlIGZvcndhcmQgZGVsZXRlXG4gICAgICAgICAgICBkZWxldGlvblN0YXJ0ID0gc2VsZWN0aW9uLnN0YXJ0O1xuICAgICAgICAgICAgZGVsZXRpb25FbmQgPSBNYXRoLm1pbih2YWx1ZS5sZW5ndGgsIHNlbGVjdGlvbi5zdGFydCArIDEpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzZWxlY3Rpb246IHtcbiAgICAgICAgICAgICAgICBzdGFydDogZGVsZXRpb25TdGFydCxcbiAgICAgICAgICAgICAgICBlbmQ6IGRlbGV0aW9uU3RhcnQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdmFsdWU6IHZhbHVlLnN1YnN0cigwLCBkZWxldGlvblN0YXJ0KSArIHZhbHVlLnN1YnN0cihkZWxldGlvbkVuZCksXG4gICAgICAgIH07XG4gICAgfTtcbiAgICByZXR1cm4gUGF0dGVybkZvcm1hdHRlcjtcbn0oKSk7XG5leHBvcnRzLlBhdHRlcm5Gb3JtYXR0ZXIgPSBQYXR0ZXJuRm9ybWF0dGVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnBhcnNlUGF0dGVybiA9IHZvaWQgMDtcbnZhciBBTFBIQV9SRUdFWCA9IC9bQS1aYS16XS87XG52YXIgRElHSVRfUkVHRVggPSAvXFxkLztcbnZhciBXSUxEX1JFR0VYID0gLy4vO1xudmFyIFBMQUNFSE9MREVSX1JFR0VYID0gL15bQS1aYS16MC05XFwqXSQvO1xudmFyIFBMQUNFSE9MREVSX1BBVFRFUk4gPSBcIih7e1tefV0rfX0pXCI7XG52YXIgUEVSTUFDSEFSX1JFR0VYID0gXCIoXFxcXHN8XFxcXFMpXCI7XG52YXIgUEFUVEVSTl9SRUdFWCA9IG5ldyBSZWdFeHAoUExBQ0VIT0xERVJfUEFUVEVSTiArIFwifFwiICsgUEVSTUFDSEFSX1JFR0VYLCBcImdcIik7XG52YXIgUExBQ0VIT0xERVJfUEFUVEVSTl9SRUdFWCA9IG5ldyBSZWdFeHAoXCJeXCIgKyBQTEFDRUhPTERFUl9QQVRURVJOICsgXCIkXCIpO1xudmFyIHJlcGxhY2VyUmVnZXggPSBuZXcgUmVnRXhwKFwie3x9XCIsIFwiZ1wiKTtcbmZ1bmN0aW9uIGlzRGlnaXQoY2hhcikge1xuICAgIHJldHVybiBESUdJVF9SRUdFWC50ZXN0KGNoYXIpO1xufVxuZnVuY3Rpb24gaXNBbHBoYShjaGFyKSB7XG4gICAgcmV0dXJuIEFMUEhBX1JFR0VYLnRlc3QoY2hhcik7XG59XG5mdW5jdGlvbiBjcmVhdGVSZWdleEZvckNoYXIoY2hhcikge1xuICAgIGlmIChpc0RpZ2l0KGNoYXIpKSB7XG4gICAgICAgIHJldHVybiBESUdJVF9SRUdFWDtcbiAgICB9XG4gICAgZWxzZSBpZiAoaXNBbHBoYShjaGFyKSkge1xuICAgICAgICByZXR1cm4gQUxQSEFfUkVHRVg7XG4gICAgfVxuICAgIHJldHVybiBXSUxEX1JFR0VYO1xufVxuZnVuY3Rpb24gaXNQbGFjZWhvbGRlcihjaGFyKSB7XG4gICAgcmV0dXJuIFBMQUNFSE9MREVSX1JFR0VYLnRlc3QoY2hhcik7XG59XG5mdW5jdGlvbiBpc1BsYWNlaG9sZGVyUGF0dGVybihzdHIpIHtcbiAgICByZXR1cm4gUExBQ0VIT0xERVJfUEFUVEVSTl9SRUdFWC50ZXN0KHN0cik7XG59XG5mdW5jdGlvbiBwYXJzZVBhdHRlcm4ocGF0dGVyblN0cmluZykge1xuICAgIHZhciBwYXR0ZXJuQXJyYXkgPSBbXTtcbiAgICB2YXIgcGF0dGVyblBhcnRzID0gcGF0dGVyblN0cmluZy5tYXRjaChQQVRURVJOX1JFR0VYKTtcbiAgICBpZiAoIXBhdHRlcm5QYXJ0cykge1xuICAgICAgICByZXR1cm4gcGF0dGVybkFycmF5O1xuICAgIH1cbiAgICBmb3IgKHZhciBpbmRleCA9IDAsIGkgPSAwOyBpIDwgcGF0dGVyblBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBwYXR0ZXJuUGFydCA9IHBhdHRlcm5QYXJ0c1tpXTtcbiAgICAgICAgaWYgKGlzUGxhY2Vob2xkZXJQYXR0ZXJuKHBhdHRlcm5QYXJ0KSkge1xuICAgICAgICAgICAgdmFyIHBsYWNlaG9sZGVyQ2hhcnMgPSBwYXR0ZXJuUGFydC5yZXBsYWNlKHJlcGxhY2VyUmVnZXgsIFwiXCIpLnNwbGl0KFwiXCIpO1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBwbGFjZWhvbGRlckNoYXJzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBsYWNlaG9sZGVyQ2hhciA9IHBsYWNlaG9sZGVyQ2hhcnNbal07XG4gICAgICAgICAgICAgICAgaWYgKCFpc1BsYWNlaG9sZGVyKHBsYWNlaG9sZGVyQ2hhcikpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiT25seSBhbHBoYW51bWVyaWMgb3Igd2lsZGNhcmQgcGF0dGVybiBtYXRjaGVycyBhcmUgYWxsb3dlZFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcGF0dGVybkFycmF5LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogY3JlYXRlUmVnZXhGb3JDaGFyKHBsYWNlaG9sZGVyQ2hhciksXG4gICAgICAgICAgICAgICAgICAgIGlzUGVybWFDaGFyOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgaW5kZXg6IGluZGV4KyssXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBwYXR0ZXJuQXJyYXkucHVzaCh7XG4gICAgICAgICAgICAgICAgdmFsdWU6IHBhdHRlcm5QYXJ0LFxuICAgICAgICAgICAgICAgIGlzUGVybWFDaGFyOiB0cnVlLFxuICAgICAgICAgICAgICAgIGluZGV4OiBpbmRleCsrLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHBhdHRlcm5BcnJheTtcbn1cbmV4cG9ydHMucGFyc2VQYXR0ZXJuID0gcGFyc2VQYXR0ZXJuO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnNldCA9IGV4cG9ydHMuZ2V0ID0gdm9pZCAwO1xuZnVuY3Rpb24gZ2V0KGVsZW1lbnQpIHtcbiAgICB2YXIgc3RhcnQgPSBlbGVtZW50LnNlbGVjdGlvblN0YXJ0IHx8IDA7XG4gICAgdmFyIGVuZCA9IGVsZW1lbnQuc2VsZWN0aW9uRW5kIHx8IDA7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgc3RhcnQ6IHN0YXJ0LFxuICAgICAgICBlbmQ6IGVuZCxcbiAgICAgICAgZGVsdGE6IE1hdGguYWJzKGVuZCAtIHN0YXJ0KSxcbiAgICB9O1xufVxuZXhwb3J0cy5nZXQgPSBnZXQ7XG5mdW5jdGlvbiBzZXQoZWxlbWVudCwgc3RhcnQsIGVuZCkge1xuICAgIC8vIFNvbWUgYnJvd3NlcnMgZXhwbG9kZSBpZiB5b3UgdXNlIHNldFNlbGVjdGlvblJhbmdlXG4gICAgLy8gb24gYSBub24tZm9jdXNlZCBlbGVtZW50XG4gICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGVsZW1lbnQgJiYgZWxlbWVudC5zZXRTZWxlY3Rpb25SYW5nZSkge1xuICAgICAgICBlbGVtZW50LnNldFNlbGVjdGlvblJhbmdlKHN0YXJ0LCBlbmQpO1xuICAgIH1cbn1cbmV4cG9ydHMuc2V0ID0gc2V0O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmlzQmFja3NwYWNlID0gdm9pZCAwO1xuZnVuY3Rpb24gaXNCYWNrc3BhY2UoZXZlbnQpIHtcbiAgICByZXR1cm4gZXZlbnQua2V5ID09PSBcIkJhY2tzcGFjZVwiIHx8IGV2ZW50LmtleUNvZGUgPT09IDg7XG59XG5leHBvcnRzLmlzQmFja3NwYWNlID0gaXNCYWNrc3BhY2U7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuaXNEZWxldGUgPSB2b2lkIDA7XG52YXIgREVMRVRFX1JFR0VYID0gL15EZWwoZXRlKT8kLztcbmZ1bmN0aW9uIGlzRGVsZXRlKGV2ZW50KSB7XG4gICAgcmV0dXJuIERFTEVURV9SRUdFWC50ZXN0KGV2ZW50LmtleSkgfHwgZXZlbnQua2V5Q29kZSA9PT0gNDY7XG59XG5leHBvcnRzLmlzRGVsZXRlID0gaXNEZWxldGU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMua2V5Q2Fubm90TXV0YXRlVmFsdWUgPSB2b2lkIDA7XG52YXIgaW5wdXRfc2VsZWN0aW9uXzEgPSByZXF1aXJlKFwiLi9pbnB1dC1zZWxlY3Rpb25cIik7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY29tcGxleGl0eVxuZnVuY3Rpb24ga2V5Q2Fubm90TXV0YXRlVmFsdWUoZXZlbnQpIHtcbiAgICB2YXIgaW5wdXQgPSAoZXZlbnQuY3VycmVudFRhcmdldCB8fCBldmVudC5zcmNFbGVtZW50KTtcbiAgICB2YXIgc2VsZWN0aW9uID0gKDAsIGlucHV0X3NlbGVjdGlvbl8xLmdldCkoaW5wdXQpO1xuICAgIHZhciBpc0F0QmVnaW5uaW5nID0gc2VsZWN0aW9uLnN0YXJ0ID09PSAwO1xuICAgIHZhciBpc0F0RW5kID0gc2VsZWN0aW9uLnN0YXJ0ID09PSBpbnB1dC52YWx1ZS5sZW5ndGg7XG4gICAgdmFyIGlzU2hpZnRlZCA9IGV2ZW50LnNoaWZ0S2V5ID09PSB0cnVlO1xuICAgIC8vIGh0dHBzOi8vd3d3LnczLm9yZy9UUi9ET00tTGV2ZWwtMy1FdmVudHMvI3dpZGwtS2V5Ym9hcmRFdmVudC1rZXlcbiAgICBzd2l0Y2ggKGV2ZW50LmtleSkge1xuICAgICAgICBjYXNlIHVuZGVmaW5lZDogLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgICAgICBjYXNlIFwiVW5pZGVudGlmaWVkXCI6IC8vIENhbm5vdCBiZSBkZXRlcm1pbmVkXG4gICAgICAgIGNhc2UgXCJcIjogLy8gVW5pbml0aWFsaXplZFxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJCYWNrc3BhY2VcIjogLy8gYmFja3NwYWNlIGF0IHRoZSBiZWdpbm5pbmdcbiAgICAgICAgICAgIHJldHVybiBpc0F0QmVnaW5uaW5nO1xuICAgICAgICBjYXNlIFwiRGVsXCI6IC8vIGRlbGV0ZSBhdCB0aGUgZW5kXG4gICAgICAgIGNhc2UgXCJEZWxldGVcIjpcbiAgICAgICAgICAgIHJldHVybiBpc0F0RW5kO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIGV2ZW50LmtleS5sZW5ndGggIT09IDE7XG4gICAgfVxuICAgIC8vIGh0dHA6Ly91bml4cGFwYS5jb20vanMva2V5Lmh0bWxcbiAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcbiAgICAgICAgY2FzZSA5OiAvLyB0YWJcbiAgICAgICAgY2FzZSAxOTogLy8gcGF1c2UvYnJlYWtcbiAgICAgICAgY2FzZSAyMDogLy8gY2FwcyBsb2NrXG4gICAgICAgIGNhc2UgMjc6IC8vIGVzY2FwZVxuICAgICAgICBjYXNlIDM5OiAvLyBhcnJvd3NcbiAgICAgICAgY2FzZSA0NTogLy8gaW5zZXJ0XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgY2FzZSAzMzogLy8gcGFnZSB1cCAoaWYgc2hpZnRlZCwgJyEnKVxuICAgICAgICBjYXNlIDM0OiAvLyBwYWdlIGRvd24gKGlmIHNoaWZ0ZWQsICcnJylcbiAgICAgICAgY2FzZSAzNTogLy8gZW5kIChpZiBzaGlmdGVkLCAnIycpXG4gICAgICAgIGNhc2UgMzY6IC8vIGhvbWUgKGlmIHNoaWZ0ZWQsICckJylcbiAgICAgICAgY2FzZSAzNzogLy8gYXJyb3dzIChpZiBzaGlmdGVkLCAnJScpXG4gICAgICAgIGNhc2UgMzg6IC8vIGFycm93cyAoaWYgc2hpZnRlZCwgJyYnKVxuICAgICAgICBjYXNlIDQwOiAvLyBhcnJvd3MgKGlmIHNoaWZ0ZWQsICcoJylcbiAgICAgICAgICAgIHJldHVybiAhaXNTaGlmdGVkO1xuICAgICAgICBjYXNlIDg6IC8vIGJhY2tzcGFjZSBhdCB0aGUgYmVnaW5uaW5nXG4gICAgICAgICAgICByZXR1cm4gaXNBdEJlZ2lubmluZztcbiAgICAgICAgY2FzZSA0NjogLy8gZGVsZXRlIGF0IHRoZSBlbmRcbiAgICAgICAgICAgIHJldHVybiBpc0F0RW5kO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cbmV4cG9ydHMua2V5Q2Fubm90TXV0YXRlVmFsdWUgPSBrZXlDYW5ub3RNdXRhdGVWYWx1ZTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIGRldmljZV8xID0gcmVxdWlyZShcIi4vZGV2aWNlXCIpO1xudmFyIHN1cHBvcnRzSW5wdXRGb3JtYXR0aW5nID0gcmVxdWlyZShcIi4uL3N1cHBvcnRzLWlucHV0LWZvcm1hdHRpbmdcIik7XG52YXIgaW9zXzEgPSByZXF1aXJlKFwiLi9zdHJhdGVnaWVzL2lvc1wiKTtcbnZhciBhbmRyb2lkX2Nocm9tZV8xID0gcmVxdWlyZShcIi4vc3RyYXRlZ2llcy9hbmRyb2lkLWNocm9tZVwiKTtcbnZhciBraXRrYXRfY2hyb21pdW1fYmFzZWRfd2Vidmlld18xID0gcmVxdWlyZShcIi4vc3RyYXRlZ2llcy9raXRrYXQtY2hyb21pdW0tYmFzZWQtd2Vidmlld1wiKTtcbnZhciBpZTlfMSA9IHJlcXVpcmUoXCIuL3N0cmF0ZWdpZXMvaWU5XCIpO1xudmFyIGJhc2VfMSA9IHJlcXVpcmUoXCIuL3N0cmF0ZWdpZXMvYmFzZVwiKTtcbnZhciBub29wXzEgPSByZXF1aXJlKFwiLi9zdHJhdGVnaWVzL25vb3BcIik7XG4vKipcbiAqIEluc3RhbmNlcyBvZiB0aGlzIGNsYXNzIGNhbiBiZSB1c2VkIHRvIG1vZGlmeSB0aGUgZm9ybWF0dGVyIGZvciBhbiBpbnB1dFxuICogQGNsYXNzXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyBUaGUgaW5pdGlhbGl6YXRpb24gcGFyYW1hdGVycyBmb3IgdGhpcyBjbGFzc1xuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMuZWxlbWVudCAtIEEgSW5wdXQgRE9NIG9iamVjdCB0aGF0IFJlc3RyaWN0ZWRJbnB1dCBvcGVyYXRlcyBvblxuICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbnMucGF0dGVybiAtIFRoZSBwYXR0ZXJuIHRvIGVuZm9yY2Ugb24gdGhpcyBlbGVtZW50XG4gKi9cbnZhciBSZXN0cmljdGVkSW5wdXQgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gUmVzdHJpY3RlZElucHV0KG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKCFSZXN0cmljdGVkSW5wdXQuc3VwcG9ydHNGb3JtYXR0aW5nKCkpIHtcbiAgICAgICAgICAgIHRoaXMuc3RyYXRlZ3kgPSBuZXcgbm9vcF8xLk5vb3BLZXlib2FyZFN0cmF0ZWd5KG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCgwLCBkZXZpY2VfMS5pc0lvcykoKSkge1xuICAgICAgICAgICAgdGhpcy5zdHJhdGVneSA9IG5ldyBpb3NfMS5Jb3NTdHJhdGVneShvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICgoMCwgZGV2aWNlXzEuaXNLaXRLYXRXZWJ2aWV3KSgpKSB7XG4gICAgICAgICAgICB0aGlzLnN0cmF0ZWd5ID0gbmV3IGtpdGthdF9jaHJvbWl1bV9iYXNlZF93ZWJ2aWV3XzEuS2l0S2F0Q2hyb21pdW1CYXNlZFdlYlZpZXdTdHJhdGVneShvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICgoMCwgZGV2aWNlXzEuaXNBbmRyb2lkQ2hyb21lKSgpKSB7XG4gICAgICAgICAgICB0aGlzLnN0cmF0ZWd5ID0gbmV3IGFuZHJvaWRfY2hyb21lXzEuQW5kcm9pZENocm9tZVN0cmF0ZWd5KG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCgwLCBkZXZpY2VfMS5pc0lFOSkoKSkge1xuICAgICAgICAgICAgdGhpcy5zdHJhdGVneSA9IG5ldyBpZTlfMS5JRTlTdHJhdGVneShvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc3RyYXRlZ3kgPSBuZXcgYmFzZV8xLkJhc2VTdHJhdGVneShvcHRpb25zKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcHVibGljXG4gICAgICogQHJldHVybnMge3N0cmluZ30gdGhlIHVuZm9ybWF0dGVkIHZhbHVlIG9mIHRoZSBlbGVtZW50XG4gICAgICovXG4gICAgUmVzdHJpY3RlZElucHV0LnByb3RvdHlwZS5nZXRVbmZvcm1hdHRlZFZhbHVlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdHJhdGVneS5nZXRVbmZvcm1hdHRlZFZhbHVlKCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBAcHVibGljXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHBhdHRlcm4gLSB0aGUgcGF0dGVybiB0byBlbmZvcmNlIG9uIHRoZSBlbGVtZW50XG4gICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgKi9cbiAgICBSZXN0cmljdGVkSW5wdXQucHJvdG90eXBlLnNldFBhdHRlcm4gPSBmdW5jdGlvbiAocGF0dGVybikge1xuICAgICAgICB0aGlzLnN0cmF0ZWd5LnNldFBhdHRlcm4ocGF0dGVybik7XG4gICAgfTtcbiAgICBSZXN0cmljdGVkSW5wdXQuc3VwcG9ydHNGb3JtYXR0aW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gc3VwcG9ydHNJbnB1dEZvcm1hdHRpbmcoKTtcbiAgICB9O1xuICAgIHJldHVybiBSZXN0cmljdGVkSW5wdXQ7XG59KCkpO1xubW9kdWxlLmV4cG9ydHMgPSBSZXN0cmljdGVkSW5wdXQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcbiAgICAgICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBwKSkgZFtwXSA9IGJbcF07IH07XG4gICAgICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYiAhPT0gXCJmdW5jdGlvblwiICYmIGIgIT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2xhc3MgZXh0ZW5kcyB2YWx1ZSBcIiArIFN0cmluZyhiKSArIFwiIGlzIG5vdCBhIGNvbnN0cnVjdG9yIG9yIG51bGxcIik7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG4gICAgfTtcbn0pKCk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkFuZHJvaWRDaHJvbWVTdHJhdGVneSA9IHZvaWQgMDtcbnZhciBrZXlfY2Fubm90X211dGF0ZV92YWx1ZV8xID0gcmVxdWlyZShcIi4uL2tleS1jYW5ub3QtbXV0YXRlLXZhbHVlXCIpO1xudmFyIGJhc2VfMSA9IHJlcXVpcmUoXCIuL2Jhc2VcIik7XG52YXIgaW5wdXRfc2VsZWN0aW9uXzEgPSByZXF1aXJlKFwiLi4vaW5wdXQtc2VsZWN0aW9uXCIpO1xudmFyIEFuZHJvaWRDaHJvbWVTdHJhdGVneSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoQW5kcm9pZENocm9tZVN0cmF0ZWd5LCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIEFuZHJvaWRDaHJvbWVTdHJhdGVneSgpIHtcbiAgICAgICAgcmV0dXJuIF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xuICAgIH1cbiAgICBBbmRyb2lkQ2hyb21lU3RyYXRlZ3kucHJvdG90eXBlLmF0dGFjaExpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5pbnB1dEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoKDAsIGtleV9jYW5ub3RfbXV0YXRlX3ZhbHVlXzEua2V5Q2Fubm90TXV0YXRlVmFsdWUpKGV2ZW50KSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF90aGlzLnVuZm9ybWF0SW5wdXQoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vICdrZXlwcmVzcycgaXMgbm90IGZpcmVkIHdpdGggc29tZSBBbmRyb2lkIGtleWJvYXJkcyAoc2VlICMyMylcbiAgICAgICAgdGhpcy5pbnB1dEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXByZXNzXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgaWYgKCgwLCBrZXlfY2Fubm90X211dGF0ZV92YWx1ZV8xLmtleUNhbm5vdE11dGF0ZVZhbHVlKShldmVudCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfdGhpcy51bmZvcm1hdElucHV0KCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmlucHV0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3RoaXMucmVmb3JtYXRJbnB1dCgpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5pbnB1dEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF90aGlzLnJlZm9ybWF0SW5wdXQoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuaW5wdXRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJwYXN0ZVwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBfdGhpcy5wYXN0ZUV2ZW50SGFuZGxlcihldmVudCk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgQW5kcm9pZENocm9tZVN0cmF0ZWd5LnByb3RvdHlwZS5wcmVQYXN0ZUV2ZW50SGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gdGhlIGRlZmF1bHQgc3RyYXRlZ3kgY2FsbHMgcHJldmVudERlZmF1bHQgaGVyZVxuICAgICAgICAvLyBidXQgdGhhdCByZW1vdmVzIHRoZSBjbGlwYm9hcmQgZGF0YSBpbiBBbmRyb2lkIGNocm9tZVxuICAgICAgICAvLyBzbyB3ZSBub29wIGluc3RlYWRcbiAgICB9O1xuICAgIEFuZHJvaWRDaHJvbWVTdHJhdGVneS5wcm90b3R5cGUucG9zdFBhc3RlRXZlbnRIYW5kbGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAvLyB0aGUgZGVmYXVsdCBzdHJhdGVneSBjYWxscyB0aGlzIHdpdGhvdXQgYSB0aW1lb3V0XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3RoaXMucmVmb3JtYXRBZnRlclBhc3RlKCk7XG4gICAgICAgIH0sIDApO1xuICAgIH07XG4gICAgQW5kcm9pZENocm9tZVN0cmF0ZWd5LnByb3RvdHlwZS5hZnRlclJlZm9ybWF0SW5wdXQgPSBmdW5jdGlvbiAoZm9ybWF0dGVkU3RhdGUpIHtcbiAgICAgICAgdmFyIGlucHV0ID0gdGhpcy5pbnB1dEVsZW1lbnQ7XG4gICAgICAgIC8vIFNvbWUgQW5kcm9pZCBDaHJvbWUga2V5Ym9hcmRzIChub3RhYmx5IFNhbXN1bmcpXG4gICAgICAgIC8vIGNhdXNlIHRoZSBicm93c2VyIHRvIG5vdCBrbm93IHRoYXQgdGhlIHZhbHVlXG4gICAgICAgIC8vIG9mIHRoZSBpbnB1dCBoYXMgY2hhbmdlZCB3aGVuIGFkZGluZ1xuICAgICAgICAvLyBwZXJtYWNoYXJhY3RlcnMuIFRoaXMgcmVzdWx0cyBpbiB0aGUgc2VsZWN0aW9uXG4gICAgICAgIC8vIHB1dHRpbmcgdGhlIGN1cnNvciBiZWZvcmUgdGhlIHBlcm1hY2hhcmFjdGVyLFxuICAgICAgICAvLyBpbnN0ZWFkIG9mIGFmdGVyLlxuICAgICAgICAvL1xuICAgICAgICAvLyBUaGVyZSBpcyBhbHNvIHRoZSBjYXNlIG9mIHNvbWUgQW5kcm9pZCBDaHJvbWVcbiAgICAgICAgLy8ga2V5Ym9hcmRzIHJlcG9ydGluZyBhIHJhbmdlZCBzZWxlY3Rpb24gb24gdGhlXG4gICAgICAgIC8vIGZpcnN0IGNoYXJhY3RlciBpbnB1dC4gUmVzdHJpY3RlZCBJbnB1dCBtYWludGFpbnNcbiAgICAgICAgLy8gdGhhdCByYW5nZSBldmVuIHRob3VnaCBpdCBpcyBpbmNvcnJlY3QgZnJvbSB0aGVcbiAgICAgICAgLy8ga2V5Ym9hcmQuXG4gICAgICAgIC8vXG4gICAgICAgIC8vIFRvIHJlc29sdmUgdGhlc2UgaXNzdWVzIHdlIHNldFRpbWVvdXQgYW5kIHJlc2V0XG4gICAgICAgIC8vIHRoZSBzZWxlY3Rpb24gdG8gdGhlIGZvcm1hdHRlZCBlbmQgcG9zaXRpb24uXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGZvcm1hdHRlZFNlbGVjdGlvbiA9IGZvcm1hdHRlZFN0YXRlLnNlbGVjdGlvbjtcbiAgICAgICAgICAgICgwLCBpbnB1dF9zZWxlY3Rpb25fMS5zZXQpKGlucHV0LCBmb3JtYXR0ZWRTZWxlY3Rpb24uZW5kLCBmb3JtYXR0ZWRTZWxlY3Rpb24uZW5kKTtcbiAgICAgICAgfSwgMCk7XG4gICAgfTtcbiAgICByZXR1cm4gQW5kcm9pZENocm9tZVN0cmF0ZWd5O1xufShiYXNlXzEuQmFzZVN0cmF0ZWd5KSk7XG5leHBvcnRzLkFuZHJvaWRDaHJvbWVTdHJhdGVneSA9IEFuZHJvaWRDaHJvbWVTdHJhdGVneTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxuICAgICAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxuICAgICAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBiICE9PSBcImZ1bmN0aW9uXCIgJiYgYiAhPT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiICsgU3RyaW5nKGIpICsgXCIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbFwiKTtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbiAgICB9O1xufSkoKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuQmFzZVN0cmF0ZWd5ID0gdm9pZCAwO1xudmFyIHN0cmF0ZWd5X2ludGVyZmFjZV8xID0gcmVxdWlyZShcIi4vc3RyYXRlZ3ktaW50ZXJmYWNlXCIpO1xudmFyIGtleV9jYW5ub3RfbXV0YXRlX3ZhbHVlXzEgPSByZXF1aXJlKFwiLi4va2V5LWNhbm5vdC1tdXRhdGUtdmFsdWVcIik7XG52YXIgaW5wdXRfc2VsZWN0aW9uXzEgPSByZXF1aXJlKFwiLi4vaW5wdXQtc2VsZWN0aW9uXCIpO1xudmFyIGlzX2JhY2tzcGFjZV8xID0gcmVxdWlyZShcIi4uL2lzLWJhY2tzcGFjZVwiKTtcbnZhciBpc19kZWxldGVfMSA9IHJlcXVpcmUoXCIuLi9pcy1kZWxldGVcIik7XG52YXIgZm9ybWF0dGVyXzEgPSByZXF1aXJlKFwiLi4vZm9ybWF0dGVyXCIpO1xuZnVuY3Rpb24gaXNTaW11bGF0ZWRFdmVudChldmVudCkge1xuICAgIC8vIDFQYXNzd29yZCBzZXRzIGlucHV0LnZhbHVlIHRoZW4gZmlyZXMga2V5Ym9hcmQgZXZlbnRzLiBEZXBlbmRlbnQgb24gYnJvd3NlclxuICAgIC8vIGhlcmUgbWlnaHQgYmUgZmFsc3kgdmFsdWVzIChrZXkgPSAnJywga2V5Q29kZSA9IDApIG9yIHRoZXNlIGtleXMgbWlnaHQgYmUgb21pdHRlZFxuICAgIC8vIENocm9tZSBhdXRvZmlsbCBpbnNlcnRzIGtleXMgYWxsIGF0IG9uY2UgYW5kIGZpcmVzIGEgc2luZ2xlIGV2ZW50IHdpdGhvdXQga2V5IGluZm9cbiAgICByZXR1cm4gIWV2ZW50LmtleSAmJiAhZXZlbnQua2V5Q29kZTtcbn1cbnZhciBCYXNlU3RyYXRlZ3kgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKEJhc2VTdHJhdGVneSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBCYXNlU3RyYXRlZ3kob3B0aW9ucykge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBvcHRpb25zKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy5mb3JtYXR0ZXIgPSBuZXcgZm9ybWF0dGVyXzEuUGF0dGVybkZvcm1hdHRlcihvcHRpb25zLnBhdHRlcm4pO1xuICAgICAgICBfdGhpcy5vblBhc3RlRXZlbnQgPSBvcHRpb25zLm9uUGFzdGVFdmVudDtcbiAgICAgICAgX3RoaXMuYXR0YWNoTGlzdGVuZXJzKCk7XG4gICAgICAgIF90aGlzLmZvcm1hdElmTm90RW1wdHkoKTtcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICBCYXNlU3RyYXRlZ3kucHJvdG90eXBlLmdldFVuZm9ybWF0dGVkVmFsdWUgPSBmdW5jdGlvbiAoZm9yY2VVbmZvcm1hdCkge1xuICAgICAgICB2YXIgdmFsdWUgPSB0aGlzLmlucHV0RWxlbWVudC52YWx1ZTtcbiAgICAgICAgaWYgKGZvcmNlVW5mb3JtYXQgfHwgdGhpcy5pc0Zvcm1hdHRlZCkge1xuICAgICAgICAgICAgdmFsdWUgPSB0aGlzLmZvcm1hdHRlci51bmZvcm1hdCh7XG4gICAgICAgICAgICAgICAgdmFsdWU6IHRoaXMuaW5wdXRFbGVtZW50LnZhbHVlLFxuICAgICAgICAgICAgICAgIHNlbGVjdGlvbjogeyBzdGFydDogMCwgZW5kOiAwIH0sXG4gICAgICAgICAgICB9KS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfTtcbiAgICBCYXNlU3RyYXRlZ3kucHJvdG90eXBlLmZvcm1hdElmTm90RW1wdHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmlucHV0RWxlbWVudC52YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5yZWZvcm1hdElucHV0KCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEJhc2VTdHJhdGVneS5wcm90b3R5cGUuc2V0UGF0dGVybiA9IGZ1bmN0aW9uIChwYXR0ZXJuKSB7XG4gICAgICAgIHRoaXMudW5mb3JtYXRJbnB1dCgpO1xuICAgICAgICB0aGlzLmZvcm1hdHRlciA9IG5ldyBmb3JtYXR0ZXJfMS5QYXR0ZXJuRm9ybWF0dGVyKHBhdHRlcm4pO1xuICAgICAgICB0aGlzLmZvcm1hdElmTm90RW1wdHkoKTtcbiAgICB9O1xuICAgIEJhc2VTdHJhdGVneS5wcm90b3R5cGUuYXR0YWNoTGlzdGVuZXJzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLmlucHV0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgdmFyIGV2ZW50ID0gZTtcbiAgICAgICAgICAgIGlmIChpc1NpbXVsYXRlZEV2ZW50KGV2ZW50KSkge1xuICAgICAgICAgICAgICAgIF90aGlzLmlzRm9ybWF0dGVkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoKDAsIGtleV9jYW5ub3RfbXV0YXRlX3ZhbHVlXzEua2V5Q2Fubm90TXV0YXRlVmFsdWUpKGV2ZW50KSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChfdGhpcy5pc0RlbGV0aW9uKGV2ZW50KSkge1xuICAgICAgICAgICAgICAgIF90aGlzLnVuZm9ybWF0SW5wdXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuaW5wdXRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlwcmVzc1wiLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgdmFyIGV2ZW50ID0gZTtcbiAgICAgICAgICAgIGlmIChpc1NpbXVsYXRlZEV2ZW50KGV2ZW50KSkge1xuICAgICAgICAgICAgICAgIF90aGlzLmlzRm9ybWF0dGVkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoKDAsIGtleV9jYW5ub3RfbXV0YXRlX3ZhbHVlXzEua2V5Q2Fubm90TXV0YXRlVmFsdWUpKGV2ZW50KSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF90aGlzLnVuZm9ybWF0SW5wdXQoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuaW5wdXRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfdGhpcy5yZWZvcm1hdElucHV0KCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmlucHV0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAvLyBTYWZhcmkgQXV0b0ZpbGwgZmlyZXMgQ3VzdG9tRXZlbnRzXG4gICAgICAgICAgICAvLyBMYXN0UGFzcyBzZW5kcyBhbiBgaXNUcnVzdGVkOiBmYWxzZWAgcHJvcGVydHlcbiAgICAgICAgICAgIC8vIFNpbmNlIHRoZSBpbnB1dCBpcyBjaGFuZ2VkIGFsbCBhdCBvbmNlLCBzZXQgaXNGb3JtYXR0ZWRcbiAgICAgICAgICAgIC8vIHRvIGZhbHNlIHNvIHRoYXQgcmVmb3JtYXR0aW5nIGFjdHVhbGx5IG9jY3Vyc1xuICAgICAgICAgICAgaWYgKGV2ZW50IGluc3RhbmNlb2YgQ3VzdG9tRXZlbnQgfHwgIWV2ZW50LmlzVHJ1c3RlZCkge1xuICAgICAgICAgICAgICAgIF90aGlzLmlzRm9ybWF0dGVkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfdGhpcy5yZWZvcm1hdElucHV0KCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmlucHV0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwicGFzdGVcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICBfdGhpcy5wYXN0ZUV2ZW50SGFuZGxlcihldmVudCk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgQmFzZVN0cmF0ZWd5LnByb3RvdHlwZS5pc0RlbGV0aW9uID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHJldHVybiAoMCwgaXNfZGVsZXRlXzEuaXNEZWxldGUpKGV2ZW50KSB8fCAoMCwgaXNfYmFja3NwYWNlXzEuaXNCYWNrc3BhY2UpKGV2ZW50KTtcbiAgICB9O1xuICAgIEJhc2VTdHJhdGVneS5wcm90b3R5cGUucmVmb3JtYXRJbnB1dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNGb3JtYXR0ZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmlzRm9ybWF0dGVkID0gdHJ1ZTtcbiAgICAgICAgdmFyIGlucHV0ID0gdGhpcy5pbnB1dEVsZW1lbnQ7XG4gICAgICAgIHZhciBmb3JtYXR0ZWRTdGF0ZSA9IHRoaXMuZm9ybWF0dGVyLmZvcm1hdCh7XG4gICAgICAgICAgICBzZWxlY3Rpb246ICgwLCBpbnB1dF9zZWxlY3Rpb25fMS5nZXQpKGlucHV0KSxcbiAgICAgICAgICAgIHZhbHVlOiBpbnB1dC52YWx1ZSxcbiAgICAgICAgfSk7XG4gICAgICAgIGlucHV0LnZhbHVlID0gZm9ybWF0dGVkU3RhdGUudmFsdWU7XG4gICAgICAgICgwLCBpbnB1dF9zZWxlY3Rpb25fMS5zZXQpKGlucHV0LCBmb3JtYXR0ZWRTdGF0ZS5zZWxlY3Rpb24uc3RhcnQsIGZvcm1hdHRlZFN0YXRlLnNlbGVjdGlvbi5lbmQpO1xuICAgICAgICB0aGlzLmFmdGVyUmVmb3JtYXRJbnB1dChmb3JtYXR0ZWRTdGF0ZSk7XG4gICAgfTtcbiAgICAvLyBJZiBhIHN0cmF0ZWd5IG5lZWRzIHRvIGltcGxpbWVudCBzcGVjaWZpYyBiZWhhdmlvclxuICAgIC8vIGFmdGVyIHJlZm9ybWF0dGluZyBoYXMgaGFwcGVuZCwgdGhlIHN0cmF0ZWd5IGp1c3RcbiAgICAvLyBvdmVyd3JpdGVzIHRoaXMgbWV0aG9kIG9uIHRoZWlyIG93biBwcm90b3R5cGVcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVudXNlZC12YXJzXG4gICAgQmFzZVN0cmF0ZWd5LnByb3RvdHlwZS5hZnRlclJlZm9ybWF0SW5wdXQgPSBmdW5jdGlvbiAoZm9ybWF0dGVkU3RhdGUpIHtcbiAgICAgICAgLy8gbm9vcFxuICAgIH07XG4gICAgQmFzZVN0cmF0ZWd5LnByb3RvdHlwZS51bmZvcm1hdElucHV0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNGb3JtYXR0ZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmlzRm9ybWF0dGVkID0gZmFsc2U7XG4gICAgICAgIHZhciBpbnB1dCA9IHRoaXMuaW5wdXRFbGVtZW50O1xuICAgICAgICB2YXIgc2VsZWN0aW9uID0gKDAsIGlucHV0X3NlbGVjdGlvbl8xLmdldCkoaW5wdXQpO1xuICAgICAgICB2YXIgdW5mb3JtYXR0ZWRTdGF0ZSA9IHRoaXMuZm9ybWF0dGVyLnVuZm9ybWF0KHtcbiAgICAgICAgICAgIHNlbGVjdGlvbjogc2VsZWN0aW9uLFxuICAgICAgICAgICAgdmFsdWU6IGlucHV0LnZhbHVlLFxuICAgICAgICB9KTtcbiAgICAgICAgaW5wdXQudmFsdWUgPSB1bmZvcm1hdHRlZFN0YXRlLnZhbHVlO1xuICAgICAgICAoMCwgaW5wdXRfc2VsZWN0aW9uXzEuc2V0KShpbnB1dCwgdW5mb3JtYXR0ZWRTdGF0ZS5zZWxlY3Rpb24uc3RhcnQsIHVuZm9ybWF0dGVkU3RhdGUuc2VsZWN0aW9uLmVuZCk7XG4gICAgfTtcbiAgICBCYXNlU3RyYXRlZ3kucHJvdG90eXBlLnByZVBhc3RlRXZlbnRIYW5kbGVyID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIC8vIHdpdGhvdXQgdGhpcywgdGhlIHBhc3RlIGV2ZW50IGlzIGNhbGxlZCB0d2ljZVxuICAgICAgICAvLyBzbyBpZiB5b3Ugd2VyZSBwYXN0aW5nIGFiYyBpdCB3b3VsZCByZXN1bHQgaW5cbiAgICAgICAgLy8gYWJjYWJjXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfTtcbiAgICBCYXNlU3RyYXRlZ3kucHJvdG90eXBlLnBvc3RQYXN0ZUV2ZW50SGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5yZWZvcm1hdEFmdGVyUGFzdGUoKTtcbiAgICB9O1xuICAgIEJhc2VTdHJhdGVneS5wcm90b3R5cGUucGFzdGVFdmVudEhhbmRsZXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdmFyIHNwbGljZWRFbnRyeTtcbiAgICAgICAgdmFyIGVudHJ5VmFsdWUgPSBcIlwiO1xuICAgICAgICB0aGlzLnByZVBhc3RlRXZlbnRIYW5kbGVyKGV2ZW50KTtcbiAgICAgICAgdGhpcy51bmZvcm1hdElucHV0KCk7XG4gICAgICAgIGlmIChldmVudC5jbGlwYm9hcmREYXRhKSB7XG4gICAgICAgICAgICBlbnRyeVZhbHVlID0gZXZlbnQuY2xpcGJvYXJkRGF0YS5nZXREYXRhKFwiVGV4dFwiKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh3aW5kb3cuY2xpcGJvYXJkRGF0YSkge1xuICAgICAgICAgICAgZW50cnlWYWx1ZSA9IHdpbmRvdy5jbGlwYm9hcmREYXRhLmdldERhdGEoXCJUZXh0XCIpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBzZWxlY3Rpb24gPSAoMCwgaW5wdXRfc2VsZWN0aW9uXzEuZ2V0KSh0aGlzLmlucHV0RWxlbWVudCk7XG4gICAgICAgIHNwbGljZWRFbnRyeSA9IHRoaXMuaW5wdXRFbGVtZW50LnZhbHVlLnNwbGl0KFwiXCIpO1xuICAgICAgICBzcGxpY2VkRW50cnkuc3BsaWNlKHNlbGVjdGlvbi5zdGFydCwgc2VsZWN0aW9uLmVuZCAtIHNlbGVjdGlvbi5zdGFydCwgZW50cnlWYWx1ZSk7XG4gICAgICAgIHNwbGljZWRFbnRyeSA9IHNwbGljZWRFbnRyeS5qb2luKFwiXCIpO1xuICAgICAgICBpZiAodGhpcy5vblBhc3RlRXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMub25QYXN0ZUV2ZW50KHtcbiAgICAgICAgICAgICAgICB1bmZvcm1hdHRlZElucHV0VmFsdWU6IHNwbGljZWRFbnRyeSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW5wdXRFbGVtZW50LnZhbHVlID0gc3BsaWNlZEVudHJ5O1xuICAgICAgICAoMCwgaW5wdXRfc2VsZWN0aW9uXzEuc2V0KSh0aGlzLmlucHV0RWxlbWVudCwgc2VsZWN0aW9uLnN0YXJ0ICsgZW50cnlWYWx1ZS5sZW5ndGgsIHNlbGVjdGlvbi5zdGFydCArIGVudHJ5VmFsdWUubGVuZ3RoKTtcbiAgICAgICAgdGhpcy5wb3N0UGFzdGVFdmVudEhhbmRsZXIoKTtcbiAgICB9O1xuICAgIEJhc2VTdHJhdGVneS5wcm90b3R5cGUucmVmb3JtYXRBZnRlclBhc3RlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudChcIkV2ZW50XCIpO1xuICAgICAgICB0aGlzLnJlZm9ybWF0SW5wdXQoKTtcbiAgICAgICAgZXZlbnQuaW5pdEV2ZW50KFwiaW5wdXRcIiwgdHJ1ZSwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuaW5wdXRFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgIH07XG4gICAgQmFzZVN0cmF0ZWd5LnByb3RvdHlwZS5nZXRTdGF0ZVRvRm9ybWF0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaW5wdXQgPSB0aGlzLmlucHV0RWxlbWVudDtcbiAgICAgICAgdmFyIHNlbGVjdGlvbiA9ICgwLCBpbnB1dF9zZWxlY3Rpb25fMS5nZXQpKGlucHV0KTtcbiAgICAgICAgdmFyIHN0YXRlVG9Gb3JtYXQgPSB7XG4gICAgICAgICAgICBzZWxlY3Rpb246IHNlbGVjdGlvbixcbiAgICAgICAgICAgIHZhbHVlOiBpbnB1dC52YWx1ZSxcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGVUb0Zvcm1hdCkge1xuICAgICAgICAgICAgc3RhdGVUb0Zvcm1hdCA9IHRoaXMuc3RhdGVUb0Zvcm1hdDtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnN0YXRlVG9Gb3JtYXQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc2VsZWN0aW9uLnN0YXJ0ID09PSBpbnB1dC52YWx1ZS5sZW5ndGggJiYgdGhpcy5pc0Zvcm1hdHRlZCkge1xuICAgICAgICAgICAgc3RhdGVUb0Zvcm1hdCA9IHRoaXMuZm9ybWF0dGVyLnVuZm9ybWF0KHN0YXRlVG9Gb3JtYXQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdGF0ZVRvRm9ybWF0O1xuICAgIH07XG4gICAgcmV0dXJuIEJhc2VTdHJhdGVneTtcbn0oc3RyYXRlZ3lfaW50ZXJmYWNlXzEuU3RyYXRlZ3lJbnRlcmZhY2UpKTtcbmV4cG9ydHMuQmFzZVN0cmF0ZWd5ID0gQmFzZVN0cmF0ZWd5O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XG4gICAgICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xuICAgICAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xuICAgIH07XG59KSgpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5JRTlTdHJhdGVneSA9IHZvaWQgMDtcbnZhciBiYXNlXzEgPSByZXF1aXJlKFwiLi9iYXNlXCIpO1xudmFyIGtleV9jYW5ub3RfbXV0YXRlX3ZhbHVlXzEgPSByZXF1aXJlKFwiLi4va2V5LWNhbm5vdC1tdXRhdGUtdmFsdWVcIik7XG52YXIgaW5wdXRfc2VsZWN0aW9uXzEgPSByZXF1aXJlKFwiLi4vaW5wdXQtc2VsZWN0aW9uXCIpO1xuZnVuY3Rpb24gcGFkU2VsZWN0aW9uKHNlbGVjdGlvbiwgcGFkKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgc3RhcnQ6IHNlbGVjdGlvbi5zdGFydCArIHBhZCxcbiAgICAgICAgZW5kOiBzZWxlY3Rpb24uZW5kICsgcGFkLFxuICAgIH07XG59XG52YXIgSUU5U3RyYXRlZ3kgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKElFOVN0cmF0ZWd5LCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIElFOVN0cmF0ZWd5KCkge1xuICAgICAgICByZXR1cm4gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XG4gICAgfVxuICAgIElFOVN0cmF0ZWd5LnByb3RvdHlwZS5nZXRVbmZvcm1hdHRlZFZhbHVlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gYmFzZV8xLkJhc2VTdHJhdGVneS5wcm90b3R5cGUuZ2V0VW5mb3JtYXR0ZWRWYWx1ZS5jYWxsKHRoaXMsIHRydWUpO1xuICAgIH07XG4gICAgSUU5U3RyYXRlZ3kucHJvdG90eXBlLmF0dGFjaExpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5pbnB1dEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICBfdGhpcy5rZXlkb3duTGlzdGVuZXIoZXZlbnQpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5pbnB1dEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImZvY3VzXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF90aGlzLmZvcm1hdCgpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5pbnB1dEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInBhc3RlXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgX3RoaXMucGFzdGVFdmVudEhhbmRsZXIoZXZlbnQpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIElFOVN0cmF0ZWd5LnByb3RvdHlwZS5mb3JtYXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBpbnB1dCA9IHRoaXMuaW5wdXRFbGVtZW50O1xuICAgICAgICB2YXIgc3RhdGVUb0Zvcm1hdCA9IHRoaXMuZ2V0U3RhdGVUb0Zvcm1hdCgpO1xuICAgICAgICB2YXIgZm9ybWF0dGVkU3RhdGUgPSB0aGlzLmZvcm1hdHRlci5mb3JtYXQoc3RhdGVUb0Zvcm1hdCk7XG4gICAgICAgIGlucHV0LnZhbHVlID0gZm9ybWF0dGVkU3RhdGUudmFsdWU7XG4gICAgICAgICgwLCBpbnB1dF9zZWxlY3Rpb25fMS5zZXQpKGlucHV0LCBmb3JtYXR0ZWRTdGF0ZS5zZWxlY3Rpb24uc3RhcnQsIGZvcm1hdHRlZFN0YXRlLnNlbGVjdGlvbi5lbmQpO1xuICAgIH07XG4gICAgSUU5U3RyYXRlZ3kucHJvdG90eXBlLmtleWRvd25MaXN0ZW5lciA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBpZiAoKDAsIGtleV9jYW5ub3RfbXV0YXRlX3ZhbHVlXzEua2V5Q2Fubm90TXV0YXRlVmFsdWUpKGV2ZW50KSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGlmICh0aGlzLmlzRGVsZXRpb24oZXZlbnQpKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXRlVG9Gb3JtYXQgPSB0aGlzLmZvcm1hdHRlci5zaW11bGF0ZURlbGV0aW9uKHtcbiAgICAgICAgICAgICAgICBldmVudDogZXZlbnQsXG4gICAgICAgICAgICAgICAgc2VsZWN0aW9uOiAoMCwgaW5wdXRfc2VsZWN0aW9uXzEuZ2V0KSh0aGlzLmlucHV0RWxlbWVudCksXG4gICAgICAgICAgICAgICAgdmFsdWU6IHRoaXMuaW5wdXRFbGVtZW50LnZhbHVlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBJRTkgZG9lcyBub3QgdXBkYXRlIHRoZSBpbnB1dCdzIHZhbHVlIGF0dHJpYnV0ZVxuICAgICAgICAgICAgLy8gZHVyaW5nIGtleSBldmVudHMsIG9ubHkgYWZ0ZXIgdGhleSBjb21wbGV0ZS5cbiAgICAgICAgICAgIC8vIFdlIG11c3QgcmV0cmlldmUgdGhlIGtleSBmcm9tIGV2ZW50LmtleSBhbmRcbiAgICAgICAgICAgIC8vIGFkZCBpdCB0byB0aGUgaW5wdXQncyB2YWx1ZSBiZWZvcmUgZm9ybWF0dGluZy5cbiAgICAgICAgICAgIHZhciBvbGRWYWx1ZSA9IHRoaXMuaW5wdXRFbGVtZW50LnZhbHVlO1xuICAgICAgICAgICAgdmFyIHNlbGVjdGlvbiA9ICgwLCBpbnB1dF9zZWxlY3Rpb25fMS5nZXQpKHRoaXMuaW5wdXRFbGVtZW50KTtcbiAgICAgICAgICAgIHZhciBuZXdWYWx1ZSA9IG9sZFZhbHVlLnNsaWNlKDAsIHNlbGVjdGlvbi5zdGFydCkgK1xuICAgICAgICAgICAgICAgIGV2ZW50LmtleSArXG4gICAgICAgICAgICAgICAgb2xkVmFsdWUuc2xpY2Uoc2VsZWN0aW9uLnN0YXJ0KTtcbiAgICAgICAgICAgIHNlbGVjdGlvbiA9IHBhZFNlbGVjdGlvbihzZWxlY3Rpb24sIDEpO1xuICAgICAgICAgICAgdGhpcy5zdGF0ZVRvRm9ybWF0ID0ge1xuICAgICAgICAgICAgICAgIHNlbGVjdGlvbjogc2VsZWN0aW9uLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBuZXdWYWx1ZSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAoc2VsZWN0aW9uLnN0YXJ0ID09PSBuZXdWYWx1ZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlVG9Gb3JtYXQgPSB0aGlzLmZvcm1hdHRlci51bmZvcm1hdCh0aGlzLnN0YXRlVG9Gb3JtYXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZm9ybWF0KCk7XG4gICAgfTtcbiAgICBJRTlTdHJhdGVneS5wcm90b3R5cGUucmVmb3JtYXRBZnRlclBhc3RlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaW5wdXQgPSB0aGlzLmlucHV0RWxlbWVudDtcbiAgICAgICAgdmFyIHNlbGVjdGlvbiA9ICgwLCBpbnB1dF9zZWxlY3Rpb25fMS5nZXQpKHRoaXMuaW5wdXRFbGVtZW50KTtcbiAgICAgICAgdmFyIHZhbHVlID0gdGhpcy5mb3JtYXR0ZXIuZm9ybWF0KHtcbiAgICAgICAgICAgIHNlbGVjdGlvbjogc2VsZWN0aW9uLFxuICAgICAgICAgICAgdmFsdWU6IGlucHV0LnZhbHVlLFxuICAgICAgICB9KS52YWx1ZTtcbiAgICAgICAgc2VsZWN0aW9uID0gcGFkU2VsZWN0aW9uKHNlbGVjdGlvbiwgMSk7XG4gICAgICAgIGlucHV0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIC8vIElFOSBzZXRzIHRoZSBzZWxlY3Rpb24gdG8gdGhlIGVuZCBvZiB0aGUgaW5wdXRcbiAgICAgICAgLy8gbWFudWFsbHkgc2V0dGluZyBpdCBpbiBhIHNldFRpbWVvdXQgcHV0cyBpdFxuICAgICAgICAvLyBpbiB0aGUgY29ycmVjdCBwb3NpdGlvbiBhZnRlciBwYXN0aW5nXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgKDAsIGlucHV0X3NlbGVjdGlvbl8xLnNldCkoaW5wdXQsIHNlbGVjdGlvbi5zdGFydCwgc2VsZWN0aW9uLmVuZCk7XG4gICAgICAgIH0sIDApO1xuICAgIH07XG4gICAgcmV0dXJuIElFOVN0cmF0ZWd5O1xufShiYXNlXzEuQmFzZVN0cmF0ZWd5KSk7XG5leHBvcnRzLklFOVN0cmF0ZWd5ID0gSUU5U3RyYXRlZ3k7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcbiAgICAgICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBwKSkgZFtwXSA9IGJbcF07IH07XG4gICAgICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYiAhPT0gXCJmdW5jdGlvblwiICYmIGIgIT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2xhc3MgZXh0ZW5kcyB2YWx1ZSBcIiArIFN0cmluZyhiKSArIFwiIGlzIG5vdCBhIGNvbnN0cnVjdG9yIG9yIG51bGxcIik7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG4gICAgfTtcbn0pKCk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLklvc1N0cmF0ZWd5ID0gdm9pZCAwO1xudmFyIGJhc2VfMSA9IHJlcXVpcmUoXCIuL2Jhc2VcIik7XG52YXIga2V5X2Nhbm5vdF9tdXRhdGVfdmFsdWVfMSA9IHJlcXVpcmUoXCIuLi9rZXktY2Fubm90LW11dGF0ZS12YWx1ZVwiKTtcbnZhciBpbnB1dF9zZWxlY3Rpb25fMSA9IHJlcXVpcmUoXCIuLi9pbnB1dC1zZWxlY3Rpb25cIik7XG52YXIgSW9zU3RyYXRlZ3kgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKElvc1N0cmF0ZWd5LCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIElvc1N0cmF0ZWd5KCkge1xuICAgICAgICByZXR1cm4gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XG4gICAgfVxuICAgIElvc1N0cmF0ZWd5LnByb3RvdHlwZS5nZXRVbmZvcm1hdHRlZFZhbHVlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gX3N1cGVyLnByb3RvdHlwZS5nZXRVbmZvcm1hdHRlZFZhbHVlLmNhbGwodGhpcywgdHJ1ZSk7XG4gICAgfTtcbiAgICBJb3NTdHJhdGVneS5wcm90b3R5cGUuYXR0YWNoTGlzdGVuZXJzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLmlucHV0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBpc0tleWJvYXJkRXZlbnQgPSBldmVudCBpbnN0YW5jZW9mIEtleWJvYXJkRXZlbnQ7XG4gICAgICAgICAgICBpZiAoIWlzS2V5Ym9hcmRFdmVudCAmJiBfdGhpcy5pbnB1dEVsZW1lbnQudmFsdWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIF90aGlzLnN0YXRlVG9Gb3JtYXQgPSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvbjogeyBzdGFydDogMCwgZW5kOiAwIH0sXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBfdGhpcy5pbnB1dEVsZW1lbnQudmFsdWUsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKF90aGlzLnN0YXRlVG9Gb3JtYXQpIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgX3RoaXMuc3RhdGVUb0Zvcm1hdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF90aGlzLmtleWRvd25MaXN0ZW5lcihldmVudCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmlucHV0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgaXNDdXN0b21FdmVudCA9IGV2ZW50IGluc3RhbmNlb2YgQ3VzdG9tRXZlbnQ7XG4gICAgICAgICAgICAvLyBTYWZhcmkgQXV0b0ZpbGwgZmlyZXMgQ3VzdG9tRXZlbnRzXG4gICAgICAgICAgICAvLyBTZXQgc3RhdGUgdG8gZm9ybWF0IGJlZm9yZSBjYWxsaW5nIGZvcm1hdCBsaXN0ZW5lclxuICAgICAgICAgICAgaWYgKGlzQ3VzdG9tRXZlbnQpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5zdGF0ZVRvRm9ybWF0ID0ge1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb246IHsgc3RhcnQ6IDAsIGVuZDogMCB9LFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogX3RoaXMuaW5wdXRFbGVtZW50LnZhbHVlLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfdGhpcy5mb3JtYXRMaXN0ZW5lcigpO1xuICAgICAgICAgICAgaWYgKCFpc0N1c3RvbUV2ZW50KSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuZml4TGVhZGluZ0JsYW5rU3BhY2VPbklvcygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5pbnB1dEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImZvY3VzXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF90aGlzLmZvcm1hdExpc3RlbmVyKCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmlucHV0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwicGFzdGVcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICBfdGhpcy5wYXN0ZUV2ZW50SGFuZGxlcihldmVudCk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgLy8gV2hlbiBkZWxldGluZyB0aGUgbGFzdCBjaGFyYWN0ZXIgb24gaU9TLCB0aGUgY3Vyc29yXG4gICAgLy8gaXMgcG9zaXRpb25lZCBhcyBpZiB0aGVyZSBpcyBhIGJsYW5rIHNwYWNlIHdoZW4gdGhlcmVcbiAgICAvLyBpcyBub3QsIHNldHRpbmcgaXQgdG8gJycgaW4gYSBzZXRUaW1lb3V0IGZpeGVzIGl0IMKvXFxfKOODhClfL8KvXG4gICAgSW9zU3RyYXRlZ3kucHJvdG90eXBlLmZpeExlYWRpbmdCbGFua1NwYWNlT25Jb3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBpbnB1dCA9IHRoaXMuaW5wdXRFbGVtZW50O1xuICAgICAgICBpZiAoaW5wdXQudmFsdWUgPT09IFwiXCIpIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlucHV0LnZhbHVlID0gXCJcIjtcbiAgICAgICAgICAgIH0sIDApO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBJb3NTdHJhdGVneS5wcm90b3R5cGUuZm9ybWF0TGlzdGVuZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzRm9ybWF0dGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGlucHV0ID0gdGhpcy5pbnB1dEVsZW1lbnQ7XG4gICAgICAgIHZhciBzdGF0ZVRvRm9ybWF0ID0gdGhpcy5nZXRTdGF0ZVRvRm9ybWF0KCk7XG4gICAgICAgIHZhciBmb3JtYXR0ZWRTdGF0ZSA9IHRoaXMuZm9ybWF0dGVyLmZvcm1hdChzdGF0ZVRvRm9ybWF0KTtcbiAgICAgICAgdGhpcy5pc0Zvcm1hdHRlZCA9IHRydWU7XG4gICAgICAgIGlucHV0LnZhbHVlID0gZm9ybWF0dGVkU3RhdGUudmFsdWU7XG4gICAgICAgICgwLCBpbnB1dF9zZWxlY3Rpb25fMS5zZXQpKGlucHV0LCBmb3JtYXR0ZWRTdGF0ZS5zZWxlY3Rpb24uc3RhcnQsIGZvcm1hdHRlZFN0YXRlLnNlbGVjdGlvbi5lbmQpO1xuICAgIH07XG4gICAgSW9zU3RyYXRlZ3kucHJvdG90eXBlLmtleWRvd25MaXN0ZW5lciA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBpZiAoKDAsIGtleV9jYW5ub3RfbXV0YXRlX3ZhbHVlXzEua2V5Q2Fubm90TXV0YXRlVmFsdWUpKGV2ZW50KSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmlzRGVsZXRpb24oZXZlbnQpKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXRlVG9Gb3JtYXQgPSB0aGlzLmZvcm1hdHRlci5zaW11bGF0ZURlbGV0aW9uKHtcbiAgICAgICAgICAgICAgICBldmVudDogZXZlbnQsXG4gICAgICAgICAgICAgICAgc2VsZWN0aW9uOiAoMCwgaW5wdXRfc2VsZWN0aW9uXzEuZ2V0KSh0aGlzLmlucHV0RWxlbWVudCksXG4gICAgICAgICAgICAgICAgdmFsdWU6IHRoaXMuaW5wdXRFbGVtZW50LnZhbHVlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51bmZvcm1hdElucHV0KCk7XG4gICAgfTtcbiAgICByZXR1cm4gSW9zU3RyYXRlZ3k7XG59KGJhc2VfMS5CYXNlU3RyYXRlZ3kpKTtcbmV4cG9ydHMuSW9zU3RyYXRlZ3kgPSBJb3NTdHJhdGVneTtcbiIsIlwidXNlIHN0cmljdFwiO1xuLy8gQW5kcm9pZCBEZXZpY2VzIG9uIEtpdEthdCB1c2UgQ2hyb21pdW0gYmFzZWQgd2Vidmlld3MuIEZvciBzb21lIHJlYXNvbixcbi8vIHRoZSB2YWx1ZSBvZiB0aGUgaW5wdXRzIGFyZSBub3QgYWNjZXNzaWJsZSBpbiB0aGUgZXZlbnQgbG9vcCB3aGVyZSB0aGVcbi8vIGtleSBldmVudCBsaXN0ZW5lcnMgYXJlIGNhbGxlZC4gVGhpcyBjYXVzZXMgZm9ybWF0dGluZyB0byBnZXQgc3R1Y2tcbi8vIG9uIHBlcm1hY2hhcmFjdGVycy4gQnkgcHV0dGluZyB0aGVtIGluIHNldFRpbWVvdXRzLCB0aGlzIGZpeGVzIHRoZVxuLy8gcHJvYmxlbS4gVGhpcyBjYXVzZXMgb3RoZXIgcHJvYmxlbXMgaW4gbm9uLXdlYnZpZXdzLCBzbyB3ZSBnaXZlIGl0XG4vLyBpdHMgb3duIHN0cmF0ZWd5LlxudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxuICAgICAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxuICAgICAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBiICE9PSBcImZ1bmN0aW9uXCIgJiYgYiAhPT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiICsgU3RyaW5nKGIpICsgXCIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbFwiKTtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbiAgICB9O1xufSkoKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuS2l0S2F0Q2hyb21pdW1CYXNlZFdlYlZpZXdTdHJhdGVneSA9IHZvaWQgMDtcbnZhciBhbmRyb2lkX2Nocm9tZV8xID0gcmVxdWlyZShcIi4vYW5kcm9pZC1jaHJvbWVcIik7XG52YXIgS2l0S2F0Q2hyb21pdW1CYXNlZFdlYlZpZXdTdHJhdGVneSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoS2l0S2F0Q2hyb21pdW1CYXNlZFdlYlZpZXdTdHJhdGVneSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBLaXRLYXRDaHJvbWl1bUJhc2VkV2ViVmlld1N0cmF0ZWd5KCkge1xuICAgICAgICByZXR1cm4gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XG4gICAgfVxuICAgIEtpdEthdENocm9taXVtQmFzZWRXZWJWaWV3U3RyYXRlZ3kucHJvdG90eXBlLnJlZm9ybWF0SW5wdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3N1cGVyLnByb3RvdHlwZS5yZWZvcm1hdElucHV0LmNhbGwoX3RoaXMpO1xuICAgICAgICB9LCAwKTtcbiAgICB9O1xuICAgIEtpdEthdENocm9taXVtQmFzZWRXZWJWaWV3U3RyYXRlZ3kucHJvdG90eXBlLnVuZm9ybWF0SW5wdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3N1cGVyLnByb3RvdHlwZS51bmZvcm1hdElucHV0LmNhbGwoX3RoaXMpO1xuICAgICAgICB9LCAwKTtcbiAgICB9O1xuICAgIHJldHVybiBLaXRLYXRDaHJvbWl1bUJhc2VkV2ViVmlld1N0cmF0ZWd5O1xufShhbmRyb2lkX2Nocm9tZV8xLkFuZHJvaWRDaHJvbWVTdHJhdGVneSkpO1xuZXhwb3J0cy5LaXRLYXRDaHJvbWl1bUJhc2VkV2ViVmlld1N0cmF0ZWd5ID0gS2l0S2F0Q2hyb21pdW1CYXNlZFdlYlZpZXdTdHJhdGVneTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxuICAgICAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxuICAgICAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBiICE9PSBcImZ1bmN0aW9uXCIgJiYgYiAhPT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiICsgU3RyaW5nKGIpICsgXCIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbFwiKTtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbiAgICB9O1xufSkoKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuTm9vcEtleWJvYXJkU3RyYXRlZ3kgPSB2b2lkIDA7XG52YXIgc3RyYXRlZ3lfaW50ZXJmYWNlXzEgPSByZXF1aXJlKFwiLi9zdHJhdGVneS1pbnRlcmZhY2VcIik7XG52YXIgTm9vcEtleWJvYXJkU3RyYXRlZ3kgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKE5vb3BLZXlib2FyZFN0cmF0ZWd5LCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIE5vb3BLZXlib2FyZFN0cmF0ZWd5KCkge1xuICAgICAgICByZXR1cm4gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XG4gICAgfVxuICAgIE5vb3BLZXlib2FyZFN0cmF0ZWd5LnByb3RvdHlwZS5nZXRVbmZvcm1hdHRlZFZhbHVlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pbnB1dEVsZW1lbnQudmFsdWU7XG4gICAgfTtcbiAgICBOb29wS2V5Ym9hcmRTdHJhdGVneS5wcm90b3R5cGUuc2V0UGF0dGVybiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gbm9vcFxuICAgIH07XG4gICAgcmV0dXJuIE5vb3BLZXlib2FyZFN0cmF0ZWd5O1xufShzdHJhdGVneV9pbnRlcmZhY2VfMS5TdHJhdGVneUludGVyZmFjZSkpO1xuZXhwb3J0cy5Ob29wS2V5Ym9hcmRTdHJhdGVneSA9IE5vb3BLZXlib2FyZFN0cmF0ZWd5O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlN0cmF0ZWd5SW50ZXJmYWNlID0gdm9pZCAwO1xudmFyIFN0cmF0ZWd5SW50ZXJmYWNlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFN0cmF0ZWd5SW50ZXJmYWNlKG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5pbnB1dEVsZW1lbnQgPSBvcHRpb25zLmVsZW1lbnQ7XG4gICAgICAgIHRoaXMuaXNGb3JtYXR0ZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIFN0cmF0ZWd5SW50ZXJmYWNlO1xufSgpKTtcbmV4cG9ydHMuU3RyYXRlZ3lJbnRlcmZhY2UgPSBTdHJhdGVneUludGVyZmFjZTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIFJlc3RyaWN0ZWRJbnB1dCA9IHJlcXVpcmUoXCIuL2xpYi9yZXN0cmljdGVkLWlucHV0XCIpO1xubW9kdWxlLmV4cG9ydHMgPSBSZXN0cmljdGVkSW5wdXQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBkZXZpY2VfMSA9IHJlcXVpcmUoXCIuL2xpYi9kZXZpY2VcIik7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHN1cHBvcnRzSW5wdXRGb3JtYXR0aW5nKCkge1xuICAgIC8vIERpZ2l0cyBnZXQgZHJvcHBlZCBpbiBzYW1zdW5nIGJyb3dzZXJcbiAgICByZXR1cm4gISgwLCBkZXZpY2VfMS5pc1NhbXN1bmdCcm93c2VyKSgpO1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5jYXJkTnVtYmVyID0gdm9pZCAwO1xudmFyIGx1aG4xMCA9IHJlcXVpcmUoXCIuL2x1aG4tMTBcIik7XG52YXIgZ2V0Q2FyZFR5cGVzID0gcmVxdWlyZShcImNyZWRpdC1jYXJkLXR5cGVcIik7XG5mdW5jdGlvbiB2ZXJpZmljYXRpb24oY2FyZCwgaXNQb3RlbnRpYWxseVZhbGlkLCBpc1ZhbGlkKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY2FyZDogY2FyZCxcbiAgICAgICAgaXNQb3RlbnRpYWxseVZhbGlkOiBpc1BvdGVudGlhbGx5VmFsaWQsXG4gICAgICAgIGlzVmFsaWQ6IGlzVmFsaWQsXG4gICAgfTtcbn1cbmZ1bmN0aW9uIGNhcmROdW1iZXIodmFsdWUsIG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7IG9wdGlvbnMgPSB7fTsgfVxuICAgIHZhciBpc1BvdGVudGlhbGx5VmFsaWQsIGlzVmFsaWQsIG1heExlbmd0aDtcbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSBcInN0cmluZ1wiICYmIHR5cGVvZiB2YWx1ZSAhPT0gXCJudW1iZXJcIikge1xuICAgICAgICByZXR1cm4gdmVyaWZpY2F0aW9uKG51bGwsIGZhbHNlLCBmYWxzZSk7XG4gICAgfVxuICAgIHZhciB0ZXN0Q2FyZFZhbHVlID0gU3RyaW5nKHZhbHVlKS5yZXBsYWNlKC8tfFxccy9nLCBcIlwiKTtcbiAgICBpZiAoIS9eXFxkKiQvLnRlc3QodGVzdENhcmRWYWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHZlcmlmaWNhdGlvbihudWxsLCBmYWxzZSwgZmFsc2UpO1xuICAgIH1cbiAgICB2YXIgcG90ZW50aWFsVHlwZXMgPSBnZXRDYXJkVHlwZXModGVzdENhcmRWYWx1ZSk7XG4gICAgaWYgKHBvdGVudGlhbFR5cGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gdmVyaWZpY2F0aW9uKG51bGwsIGZhbHNlLCBmYWxzZSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHBvdGVudGlhbFR5cGVzLmxlbmd0aCAhPT0gMSkge1xuICAgICAgICByZXR1cm4gdmVyaWZpY2F0aW9uKG51bGwsIHRydWUsIGZhbHNlKTtcbiAgICB9XG4gICAgdmFyIGNhcmRUeXBlID0gcG90ZW50aWFsVHlwZXNbMF07XG4gICAgaWYgKG9wdGlvbnMubWF4TGVuZ3RoICYmIHRlc3RDYXJkVmFsdWUubGVuZ3RoID4gb3B0aW9ucy5tYXhMZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIHZlcmlmaWNhdGlvbihjYXJkVHlwZSwgZmFsc2UsIGZhbHNlKTtcbiAgICB9XG4gICAgaWYgKG9wdGlvbnMuc2tpcEx1aG5WYWxpZGF0aW9uID09PSB0cnVlIHx8XG4gICAgICAgIChjYXJkVHlwZS50eXBlID09PSBnZXRDYXJkVHlwZXMudHlwZXMuVU5JT05QQVkgJiZcbiAgICAgICAgICAgIG9wdGlvbnMubHVoblZhbGlkYXRlVW5pb25QYXkgIT09IHRydWUpKSB7XG4gICAgICAgIGlzVmFsaWQgPSB0cnVlO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaXNWYWxpZCA9IGx1aG4xMCh0ZXN0Q2FyZFZhbHVlKTtcbiAgICB9XG4gICAgbWF4TGVuZ3RoID0gTWF0aC5tYXguYXBwbHkobnVsbCwgY2FyZFR5cGUubGVuZ3Rocyk7XG4gICAgaWYgKG9wdGlvbnMubWF4TGVuZ3RoKSB7XG4gICAgICAgIG1heExlbmd0aCA9IE1hdGgubWluKG9wdGlvbnMubWF4TGVuZ3RoLCBtYXhMZW5ndGgpO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhcmRUeXBlLmxlbmd0aHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGNhcmRUeXBlLmxlbmd0aHNbaV0gPT09IHRlc3RDYXJkVmFsdWUubGVuZ3RoKSB7XG4gICAgICAgICAgICBpc1BvdGVudGlhbGx5VmFsaWQgPSB0ZXN0Q2FyZFZhbHVlLmxlbmd0aCA8IG1heExlbmd0aCB8fCBpc1ZhbGlkO1xuICAgICAgICAgICAgcmV0dXJuIHZlcmlmaWNhdGlvbihjYXJkVHlwZSwgaXNQb3RlbnRpYWxseVZhbGlkLCBpc1ZhbGlkKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdmVyaWZpY2F0aW9uKGNhcmRUeXBlLCB0ZXN0Q2FyZFZhbHVlLmxlbmd0aCA8IG1heExlbmd0aCwgZmFsc2UpO1xufVxuZXhwb3J0cy5jYXJkTnVtYmVyID0gY2FyZE51bWJlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5jYXJkaG9sZGVyTmFtZSA9IHZvaWQgMDtcbnZhciBDQVJEX05VTUJFUl9SRUdFWCA9IC9eW1xcZFxccy1dKiQvO1xudmFyIE1BWF9MRU5HVEggPSAyNTU7XG5mdW5jdGlvbiB2ZXJpZmljYXRpb24oaXNWYWxpZCwgaXNQb3RlbnRpYWxseVZhbGlkKSB7XG4gICAgcmV0dXJuIHsgaXNWYWxpZDogaXNWYWxpZCwgaXNQb3RlbnRpYWxseVZhbGlkOiBpc1BvdGVudGlhbGx5VmFsaWQgfTtcbn1cbmZ1bmN0aW9uIGNhcmRob2xkZXJOYW1lKHZhbHVlKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICByZXR1cm4gdmVyaWZpY2F0aW9uKGZhbHNlLCBmYWxzZSk7XG4gICAgfVxuICAgIGlmICh2YWx1ZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHZlcmlmaWNhdGlvbihmYWxzZSwgdHJ1ZSk7XG4gICAgfVxuICAgIGlmICh2YWx1ZS5sZW5ndGggPiBNQVhfTEVOR1RIKSB7XG4gICAgICAgIHJldHVybiB2ZXJpZmljYXRpb24oZmFsc2UsIGZhbHNlKTtcbiAgICB9XG4gICAgaWYgKENBUkRfTlVNQkVSX1JFR0VYLnRlc3QodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB2ZXJpZmljYXRpb24oZmFsc2UsIHRydWUpO1xuICAgIH1cbiAgICByZXR1cm4gdmVyaWZpY2F0aW9uKHRydWUsIHRydWUpO1xufVxuZXhwb3J0cy5jYXJkaG9sZGVyTmFtZSA9IGNhcmRob2xkZXJOYW1lO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmN2diA9IHZvaWQgMDtcbnZhciBERUZBVUxUX0xFTkdUSCA9IDM7XG5mdW5jdGlvbiBpbmNsdWRlcyhhcnJheSwgdGhpbmcpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICh0aGluZyA9PT0gYXJyYXlbaV0pIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cbmZ1bmN0aW9uIG1heChhcnJheSkge1xuICAgIHZhciBtYXhpbXVtID0gREVGQVVMVF9MRU5HVEg7XG4gICAgdmFyIGkgPSAwO1xuICAgIGZvciAoOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbWF4aW11bSA9IGFycmF5W2ldID4gbWF4aW11bSA/IGFycmF5W2ldIDogbWF4aW11bTtcbiAgICB9XG4gICAgcmV0dXJuIG1heGltdW07XG59XG5mdW5jdGlvbiB2ZXJpZmljYXRpb24oaXNWYWxpZCwgaXNQb3RlbnRpYWxseVZhbGlkKSB7XG4gICAgcmV0dXJuIHsgaXNWYWxpZDogaXNWYWxpZCwgaXNQb3RlbnRpYWxseVZhbGlkOiBpc1BvdGVudGlhbGx5VmFsaWQgfTtcbn1cbmZ1bmN0aW9uIGN2dih2YWx1ZSwgbWF4TGVuZ3RoKSB7XG4gICAgaWYgKG1heExlbmd0aCA9PT0gdm9pZCAwKSB7IG1heExlbmd0aCA9IERFRkFVTFRfTEVOR1RIOyB9XG4gICAgbWF4TGVuZ3RoID0gbWF4TGVuZ3RoIGluc3RhbmNlb2YgQXJyYXkgPyBtYXhMZW5ndGggOiBbbWF4TGVuZ3RoXTtcbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHJldHVybiB2ZXJpZmljYXRpb24oZmFsc2UsIGZhbHNlKTtcbiAgICB9XG4gICAgaWYgKCEvXlxcZCokLy50ZXN0KHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gdmVyaWZpY2F0aW9uKGZhbHNlLCBmYWxzZSk7XG4gICAgfVxuICAgIGlmIChpbmNsdWRlcyhtYXhMZW5ndGgsIHZhbHVlLmxlbmd0aCkpIHtcbiAgICAgICAgcmV0dXJuIHZlcmlmaWNhdGlvbih0cnVlLCB0cnVlKTtcbiAgICB9XG4gICAgaWYgKHZhbHVlLmxlbmd0aCA8IE1hdGgubWluLmFwcGx5KG51bGwsIG1heExlbmd0aCkpIHtcbiAgICAgICAgcmV0dXJuIHZlcmlmaWNhdGlvbihmYWxzZSwgdHJ1ZSk7XG4gICAgfVxuICAgIGlmICh2YWx1ZS5sZW5ndGggPiBtYXgobWF4TGVuZ3RoKSkge1xuICAgICAgICByZXR1cm4gdmVyaWZpY2F0aW9uKGZhbHNlLCBmYWxzZSk7XG4gICAgfVxuICAgIHJldHVybiB2ZXJpZmljYXRpb24odHJ1ZSwgdHJ1ZSk7XG59XG5leHBvcnRzLmN2diA9IGN2djtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXNzaWduID0gKHRoaXMgJiYgdGhpcy5fX2Fzc2lnbikgfHwgZnVuY3Rpb24gKCkge1xuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbih0KSB7XG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSlcbiAgICAgICAgICAgICAgICB0W3BdID0gc1twXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdDtcbiAgICB9O1xuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZXhwaXJhdGlvbkRhdGUgPSB2b2lkIDA7XG52YXIgcGFyc2VfZGF0ZV8xID0gcmVxdWlyZShcIi4vbGliL3BhcnNlLWRhdGVcIik7XG52YXIgZXhwaXJhdGlvbl9tb250aF8xID0gcmVxdWlyZShcIi4vZXhwaXJhdGlvbi1tb250aFwiKTtcbnZhciBleHBpcmF0aW9uX3llYXJfMSA9IHJlcXVpcmUoXCIuL2V4cGlyYXRpb24teWVhclwiKTtcbmZ1bmN0aW9uIHZlcmlmaWNhdGlvbihpc1ZhbGlkLCBpc1BvdGVudGlhbGx5VmFsaWQsIG1vbnRoLCB5ZWFyKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgaXNWYWxpZDogaXNWYWxpZCxcbiAgICAgICAgaXNQb3RlbnRpYWxseVZhbGlkOiBpc1BvdGVudGlhbGx5VmFsaWQsXG4gICAgICAgIG1vbnRoOiBtb250aCxcbiAgICAgICAgeWVhcjogeWVhcixcbiAgICB9O1xufVxuZnVuY3Rpb24gZXhwaXJhdGlvbkRhdGUodmFsdWUsIG1heEVsYXBzZWRZZWFyKSB7XG4gICAgdmFyIGRhdGU7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL14oXFxkXFxkKSAoXFxkXFxkKFxcZFxcZCk/KSQvLCBcIiQxLyQyXCIpO1xuICAgICAgICBkYXRlID0gKDAsIHBhcnNlX2RhdGVfMS5wYXJzZURhdGUpKFN0cmluZyh2YWx1ZSkpO1xuICAgIH1cbiAgICBlbHNlIGlmICh2YWx1ZSAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgdmFyIGZ1bGxEYXRlID0gX19hc3NpZ24oe30sIHZhbHVlKTtcbiAgICAgICAgZGF0ZSA9IHtcbiAgICAgICAgICAgIG1vbnRoOiBTdHJpbmcoZnVsbERhdGUubW9udGgpLFxuICAgICAgICAgICAgeWVhcjogU3RyaW5nKGZ1bGxEYXRlLnllYXIpLFxuICAgICAgICB9O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHZlcmlmaWNhdGlvbihmYWxzZSwgZmFsc2UsIG51bGwsIG51bGwpO1xuICAgIH1cbiAgICB2YXIgbW9udGhWYWxpZCA9ICgwLCBleHBpcmF0aW9uX21vbnRoXzEuZXhwaXJhdGlvbk1vbnRoKShkYXRlLm1vbnRoKTtcbiAgICB2YXIgeWVhclZhbGlkID0gKDAsIGV4cGlyYXRpb25feWVhcl8xLmV4cGlyYXRpb25ZZWFyKShkYXRlLnllYXIsIG1heEVsYXBzZWRZZWFyKTtcbiAgICBpZiAobW9udGhWYWxpZC5pc1ZhbGlkKSB7XG4gICAgICAgIGlmICh5ZWFyVmFsaWQuaXNDdXJyZW50WWVhcikge1xuICAgICAgICAgICAgdmFyIGlzVmFsaWRGb3JUaGlzWWVhciA9IG1vbnRoVmFsaWQuaXNWYWxpZEZvclRoaXNZZWFyO1xuICAgICAgICAgICAgcmV0dXJuIHZlcmlmaWNhdGlvbihpc1ZhbGlkRm9yVGhpc1llYXIsIGlzVmFsaWRGb3JUaGlzWWVhciwgZGF0ZS5tb250aCwgZGF0ZS55ZWFyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoeWVhclZhbGlkLmlzVmFsaWQpIHtcbiAgICAgICAgICAgIHJldHVybiB2ZXJpZmljYXRpb24odHJ1ZSwgdHJ1ZSwgZGF0ZS5tb250aCwgZGF0ZS55ZWFyKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAobW9udGhWYWxpZC5pc1BvdGVudGlhbGx5VmFsaWQgJiYgeWVhclZhbGlkLmlzUG90ZW50aWFsbHlWYWxpZCkge1xuICAgICAgICByZXR1cm4gdmVyaWZpY2F0aW9uKGZhbHNlLCB0cnVlLCBudWxsLCBudWxsKTtcbiAgICB9XG4gICAgcmV0dXJuIHZlcmlmaWNhdGlvbihmYWxzZSwgZmFsc2UsIG51bGwsIG51bGwpO1xufVxuZXhwb3J0cy5leHBpcmF0aW9uRGF0ZSA9IGV4cGlyYXRpb25EYXRlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmV4cGlyYXRpb25Nb250aCA9IHZvaWQgMDtcbmZ1bmN0aW9uIHZlcmlmaWNhdGlvbihpc1ZhbGlkLCBpc1BvdGVudGlhbGx5VmFsaWQsIGlzVmFsaWRGb3JUaGlzWWVhcikge1xuICAgIHJldHVybiB7XG4gICAgICAgIGlzVmFsaWQ6IGlzVmFsaWQsXG4gICAgICAgIGlzUG90ZW50aWFsbHlWYWxpZDogaXNQb3RlbnRpYWxseVZhbGlkLFxuICAgICAgICBpc1ZhbGlkRm9yVGhpc1llYXI6IGlzVmFsaWRGb3JUaGlzWWVhciB8fCBmYWxzZSxcbiAgICB9O1xufVxuZnVuY3Rpb24gZXhwaXJhdGlvbk1vbnRoKHZhbHVlKSB7XG4gICAgdmFyIGN1cnJlbnRNb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKSArIDE7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICByZXR1cm4gdmVyaWZpY2F0aW9uKGZhbHNlLCBmYWxzZSk7XG4gICAgfVxuICAgIGlmICh2YWx1ZS5yZXBsYWNlKC9cXHMvZywgXCJcIikgPT09IFwiXCIgfHwgdmFsdWUgPT09IFwiMFwiKSB7XG4gICAgICAgIHJldHVybiB2ZXJpZmljYXRpb24oZmFsc2UsIHRydWUpO1xuICAgIH1cbiAgICBpZiAoIS9eXFxkKiQvLnRlc3QodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB2ZXJpZmljYXRpb24oZmFsc2UsIGZhbHNlKTtcbiAgICB9XG4gICAgdmFyIG1vbnRoID0gcGFyc2VJbnQodmFsdWUsIDEwKTtcbiAgICBpZiAoaXNOYU4oTnVtYmVyKHZhbHVlKSkpIHtcbiAgICAgICAgcmV0dXJuIHZlcmlmaWNhdGlvbihmYWxzZSwgZmFsc2UpO1xuICAgIH1cbiAgICB2YXIgcmVzdWx0ID0gbW9udGggPiAwICYmIG1vbnRoIDwgMTM7XG4gICAgcmV0dXJuIHZlcmlmaWNhdGlvbihyZXN1bHQsIHJlc3VsdCwgcmVzdWx0ICYmIG1vbnRoID49IGN1cnJlbnRNb250aCk7XG59XG5leHBvcnRzLmV4cGlyYXRpb25Nb250aCA9IGV4cGlyYXRpb25Nb250aDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5leHBpcmF0aW9uWWVhciA9IHZvaWQgMDtcbnZhciBERUZBVUxUX1ZBTElEX05VTUJFUl9PRl9ZRUFSU19JTl9USEVfRlVUVVJFID0gMTk7XG5mdW5jdGlvbiB2ZXJpZmljYXRpb24oaXNWYWxpZCwgaXNQb3RlbnRpYWxseVZhbGlkLCBpc0N1cnJlbnRZZWFyKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgaXNWYWxpZDogaXNWYWxpZCxcbiAgICAgICAgaXNQb3RlbnRpYWxseVZhbGlkOiBpc1BvdGVudGlhbGx5VmFsaWQsXG4gICAgICAgIGlzQ3VycmVudFllYXI6IGlzQ3VycmVudFllYXIgfHwgZmFsc2UsXG4gICAgfTtcbn1cbmZ1bmN0aW9uIGV4cGlyYXRpb25ZZWFyKHZhbHVlLCBtYXhFbGFwc2VkWWVhcikge1xuICAgIGlmIChtYXhFbGFwc2VkWWVhciA9PT0gdm9pZCAwKSB7IG1heEVsYXBzZWRZZWFyID0gREVGQVVMVF9WQUxJRF9OVU1CRVJfT0ZfWUVBUlNfSU5fVEhFX0ZVVFVSRTsgfVxuICAgIHZhciBpc0N1cnJlbnRZZWFyO1xuICAgIGlmICh0eXBlb2YgdmFsdWUgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgcmV0dXJuIHZlcmlmaWNhdGlvbihmYWxzZSwgZmFsc2UpO1xuICAgIH1cbiAgICBpZiAodmFsdWUucmVwbGFjZSgvXFxzL2csIFwiXCIpID09PSBcIlwiKSB7XG4gICAgICAgIHJldHVybiB2ZXJpZmljYXRpb24oZmFsc2UsIHRydWUpO1xuICAgIH1cbiAgICBpZiAoIS9eXFxkKiQvLnRlc3QodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB2ZXJpZmljYXRpb24oZmFsc2UsIGZhbHNlKTtcbiAgICB9XG4gICAgdmFyIGxlbiA9IHZhbHVlLmxlbmd0aDtcbiAgICBpZiAobGVuIDwgMikge1xuICAgICAgICByZXR1cm4gdmVyaWZpY2F0aW9uKGZhbHNlLCB0cnVlKTtcbiAgICB9XG4gICAgdmFyIGN1cnJlbnRZZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xuICAgIGlmIChsZW4gPT09IDMpIHtcbiAgICAgICAgLy8gMjB4ID09PSAyMHhcbiAgICAgICAgdmFyIGZpcnN0VHdvID0gdmFsdWUuc2xpY2UoMCwgMik7XG4gICAgICAgIHZhciBjdXJyZW50Rmlyc3RUd28gPSBTdHJpbmcoY3VycmVudFllYXIpLnNsaWNlKDAsIDIpO1xuICAgICAgICByZXR1cm4gdmVyaWZpY2F0aW9uKGZhbHNlLCBmaXJzdFR3byA9PT0gY3VycmVudEZpcnN0VHdvKTtcbiAgICB9XG4gICAgaWYgKGxlbiA+IDQpIHtcbiAgICAgICAgcmV0dXJuIHZlcmlmaWNhdGlvbihmYWxzZSwgZmFsc2UpO1xuICAgIH1cbiAgICB2YXIgbnVtZXJpY1ZhbHVlID0gcGFyc2VJbnQodmFsdWUsIDEwKTtcbiAgICB2YXIgdHdvRGlnaXRZZWFyID0gTnVtYmVyKFN0cmluZyhjdXJyZW50WWVhcikuc3Vic3RyKDIsIDIpKTtcbiAgICB2YXIgdmFsaWQgPSBmYWxzZTtcbiAgICBpZiAobGVuID09PSAyKSB7XG4gICAgICAgIGlmIChTdHJpbmcoY3VycmVudFllYXIpLnN1YnN0cigwLCAyKSA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiB2ZXJpZmljYXRpb24oZmFsc2UsIHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIGlzQ3VycmVudFllYXIgPSB0d29EaWdpdFllYXIgPT09IG51bWVyaWNWYWx1ZTtcbiAgICAgICAgdmFsaWQgPVxuICAgICAgICAgICAgbnVtZXJpY1ZhbHVlID49IHR3b0RpZ2l0WWVhciAmJlxuICAgICAgICAgICAgICAgIG51bWVyaWNWYWx1ZSA8PSB0d29EaWdpdFllYXIgKyBtYXhFbGFwc2VkWWVhcjtcbiAgICB9XG4gICAgZWxzZSBpZiAobGVuID09PSA0KSB7XG4gICAgICAgIGlzQ3VycmVudFllYXIgPSBjdXJyZW50WWVhciA9PT0gbnVtZXJpY1ZhbHVlO1xuICAgICAgICB2YWxpZCA9XG4gICAgICAgICAgICBudW1lcmljVmFsdWUgPj0gY3VycmVudFllYXIgJiZcbiAgICAgICAgICAgICAgICBudW1lcmljVmFsdWUgPD0gY3VycmVudFllYXIgKyBtYXhFbGFwc2VkWWVhcjtcbiAgICB9XG4gICAgcmV0dXJuIHZlcmlmaWNhdGlvbih2YWxpZCwgdmFsaWQsIGlzQ3VycmVudFllYXIpO1xufVxuZXhwb3J0cy5leHBpcmF0aW9uWWVhciA9IGV4cGlyYXRpb25ZZWFyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19jcmVhdGVCaW5kaW5nID0gKHRoaXMgJiYgdGhpcy5fX2NyZWF0ZUJpbmRpbmcpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobSwgayk7XG4gICAgaWYgKCFkZXNjIHx8IChcImdldFwiIGluIGRlc2MgPyAhbS5fX2VzTW9kdWxlIDogZGVzYy53cml0YWJsZSB8fCBkZXNjLmNvbmZpZ3VyYWJsZSkpIHtcbiAgICAgIGRlc2MgPSB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH07XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgZGVzYyk7XG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgb1trMl0gPSBtW2tdO1xufSkpO1xudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19zZXRNb2R1bGVEZWZhdWx0KSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCB2KSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xufSkgOiBmdW5jdGlvbihvLCB2KSB7XG4gICAgb1tcImRlZmF1bHRcIl0gPSB2O1xufSk7XG52YXIgX19pbXBvcnRTdGFyID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydFN0YXIpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoayAhPT0gXCJkZWZhdWx0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwgayk7XG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcbiAgICByZXR1cm4gcmVzdWx0O1xufTtcbnZhciBjcmVkaXRDYXJkVHlwZSA9IF9faW1wb3J0U3RhcihyZXF1aXJlKFwiY3JlZGl0LWNhcmQtdHlwZVwiKSk7XG52YXIgY2FyZGhvbGRlcl9uYW1lXzEgPSByZXF1aXJlKFwiLi9jYXJkaG9sZGVyLW5hbWVcIik7XG52YXIgY2FyZF9udW1iZXJfMSA9IHJlcXVpcmUoXCIuL2NhcmQtbnVtYmVyXCIpO1xudmFyIGV4cGlyYXRpb25fZGF0ZV8xID0gcmVxdWlyZShcIi4vZXhwaXJhdGlvbi1kYXRlXCIpO1xudmFyIGV4cGlyYXRpb25fbW9udGhfMSA9IHJlcXVpcmUoXCIuL2V4cGlyYXRpb24tbW9udGhcIik7XG52YXIgZXhwaXJhdGlvbl95ZWFyXzEgPSByZXF1aXJlKFwiLi9leHBpcmF0aW9uLXllYXJcIik7XG52YXIgY3Z2XzEgPSByZXF1aXJlKFwiLi9jdnZcIik7XG52YXIgcG9zdGFsX2NvZGVfMSA9IHJlcXVpcmUoXCIuL3Bvc3RhbC1jb2RlXCIpO1xudmFyIGNhcmRWYWxpZGF0b3IgPSB7XG4gICAgY3JlZGl0Q2FyZFR5cGU6IGNyZWRpdENhcmRUeXBlLFxuICAgIGNhcmRob2xkZXJOYW1lOiBjYXJkaG9sZGVyX25hbWVfMS5jYXJkaG9sZGVyTmFtZSxcbiAgICBudW1iZXI6IGNhcmRfbnVtYmVyXzEuY2FyZE51bWJlcixcbiAgICBleHBpcmF0aW9uRGF0ZTogZXhwaXJhdGlvbl9kYXRlXzEuZXhwaXJhdGlvbkRhdGUsXG4gICAgZXhwaXJhdGlvbk1vbnRoOiBleHBpcmF0aW9uX21vbnRoXzEuZXhwaXJhdGlvbk1vbnRoLFxuICAgIGV4cGlyYXRpb25ZZWFyOiBleHBpcmF0aW9uX3llYXJfMS5leHBpcmF0aW9uWWVhcixcbiAgICBjdnY6IGN2dl8xLmN2dixcbiAgICBwb3N0YWxDb2RlOiBwb3N0YWxfY29kZV8xLnBvc3RhbENvZGUsXG59O1xubW9kdWxlLmV4cG9ydHMgPSBjYXJkVmFsaWRhdG9yO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vLyBQb2x5ZmlsbCB0YWtlbiBmcm9tIDxodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9pc0FycmF5I1BvbHlmaWxsPi5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuaXNBcnJheSA9IHZvaWQgMDtcbmV4cG9ydHMuaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHxcbiAgICBmdW5jdGlvbiAoYXJnKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJnKSA9PT0gXCJbb2JqZWN0IEFycmF5XVwiO1xuICAgIH07XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMucGFyc2VEYXRlID0gdm9pZCAwO1xudmFyIGV4cGlyYXRpb25feWVhcl8xID0gcmVxdWlyZShcIi4uL2V4cGlyYXRpb24teWVhclwiKTtcbnZhciBpc19hcnJheV8xID0gcmVxdWlyZShcIi4vaXMtYXJyYXlcIik7XG5mdW5jdGlvbiBnZXROdW1iZXJPZk1vbnRoRGlnaXRzSW5EYXRlU3RyaW5nKGRhdGVTdHJpbmcpIHtcbiAgICB2YXIgZmlyc3RDaGFyYWN0ZXIgPSBOdW1iZXIoZGF0ZVN0cmluZ1swXSk7XG4gICAgdmFyIGFzc3VtZWRZZWFyO1xuICAgIC8qXG4gICAgICBpZiB0aGUgZmlyc3QgY2hhcmFjdGVyIGluIHRoZSBzdHJpbmcgc3RhcnRzIHdpdGggYDBgLFxuICAgICAgd2Uga25vdyB0aGF0IHRoZSBtb250aCB3aWxsIGJlIDIgZGlnaXRzLlxuICBcbiAgICAgICcwMTIyJyA9PiB7bW9udGg6ICcwMScsIHllYXI6ICcyMid9XG4gICAgKi9cbiAgICBpZiAoZmlyc3RDaGFyYWN0ZXIgPT09IDApIHtcbiAgICAgICAgcmV0dXJuIDI7XG4gICAgfVxuICAgIC8qXG4gICAgICBpZiB0aGUgZmlyc3QgY2hhcmFjdGVyIGluIHRoZSBzdHJpbmcgc3RhcnRzIHdpdGhcbiAgICAgIG51bWJlciBncmVhdGVyIHRoYW4gMSwgaXQgbXVzdCBiZSBhIDEgZGlnaXQgbW9udGhcbiAgXG4gICAgICAnMzIyJyA9PiB7bW9udGg6ICczJywgeWVhcjogJzIyJ31cbiAgICAqL1xuICAgIGlmIChmaXJzdENoYXJhY3RlciA+IDEpIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgfVxuICAgIC8qXG4gICAgICBpZiB0aGUgZmlyc3QgMiBjaGFyYWN0ZXJzIG1ha2UgdXAgYSBudW1iZXIgYmV0d2VlblxuICAgICAgMTMtMTksIHdlIGtub3cgdGhhdCB0aGUgbW9udGggcG9ydGlvbiBtdXN0IGJlIDFcbiAgXG4gICAgICAnMTM5JyA9PiB7bW9udGg6ICcxJywgeWVhcjogJzM5J31cbiAgICAqL1xuICAgIGlmIChmaXJzdENoYXJhY3RlciA9PT0gMSAmJiBOdW1iZXIoZGF0ZVN0cmluZ1sxXSkgPiAyKSB7XG4gICAgICAgIHJldHVybiAxO1xuICAgIH1cbiAgICAvKlxuICAgICAgaWYgdGhlIGZpcnN0IDIgY2hhcmFjdGVycyBtYWtlIHVwIGEgbnVtYmVyIGJldHdlZW5cbiAgICAgIDEwLTEyLCB3ZSBjaGVjayBpZiB0aGUgeWVhciBwb3J0aW9uIHdvdWxkIGJlIGNvbnNpZGVyZWRcbiAgICAgIHZhbGlkIGlmIHdlIGFzc3VtZWQgdGhhdCB0aGUgbW9udGggd2FzIDEuIElmIGl0IGlzXG4gICAgICBub3QgcG90ZW50aWFsbHkgdmFsaWQsIHdlIGFzc3VtZSB0aGUgbW9udGggbXVzdCBoYXZlXG4gICAgICAyIGRpZ2l0cy5cbiAgXG4gICAgICAnMTA5JyA9PiB7bW9udGg6ICcxMCcsIHllYXI6ICc5J31cbiAgICAgICcxMjAnID0+IHttb250aDogJzEnLCB5ZWFyOiAnMjAnfSAvLyB3aGVuIGNoZWNrZWQgaW4gdGhlIHllYXIgMjAxOVxuICAgICAgJzEyMCcgPT4ge21vbnRoOiAnMTInLCB5ZWFyOiAnMCd9IC8vIHdoZW4gY2hlY2tlZCBpbiB0aGUgeWVhciAyMDIxXG4gICAgKi9cbiAgICBpZiAoZmlyc3RDaGFyYWN0ZXIgPT09IDEpIHtcbiAgICAgICAgYXNzdW1lZFllYXIgPSBkYXRlU3RyaW5nLnN1YnN0cigxKTtcbiAgICAgICAgcmV0dXJuICgwLCBleHBpcmF0aW9uX3llYXJfMS5leHBpcmF0aW9uWWVhcikoYXNzdW1lZFllYXIpLmlzUG90ZW50aWFsbHlWYWxpZCA/IDEgOiAyO1xuICAgIH1cbiAgICAvKlxuICAgICAgSWYgdGhlIGxlbmd0aCBvZiB0aGUgdmFsdWUgaXMgZXhhY3RseSA1IGNoYXJhY3RlcnMsXG4gICAgICB3ZSBhc3N1bWUgYSBmdWxsIHllYXIgd2FzIHBhc3NlZCBpbiwgbWVhbmluZyB0aGUgcmVtYWluaW5nXG4gICAgICBzaW5nbGUgbGVhZGluZyBkaWdpdCBtdXN0IGJlIHRoZSBtb250aCB2YWx1ZS5cbiAgXG4gICAgICAnMTIyMDInID0+IHttb250aDogJzEnLCB5ZWFyOiAnMjIwMid9XG4gICAgKi9cbiAgICBpZiAoZGF0ZVN0cmluZy5sZW5ndGggPT09IDUpIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgfVxuICAgIC8qXG4gICAgICBJZiB0aGUgbGVuZ3RoIG9mIHRoZSB2YWx1ZSBpcyBtb3JlIHRoYW4gZml2ZSBjaGFyYWN0ZXJzLFxuICAgICAgd2UgYXNzdW1lIGEgZnVsbCB5ZWFyIHdhcyBwYXNzZWQgaW4gYWRkaXRpb24gdG8gdGhlIG1vbnRoXG4gICAgICBhbmQgdGhlcmVmb3JlIHRoZSBtb250aCBwb3J0aW9uIG11c3QgYmUgMiBkaWdpdHMuXG4gIFxuICAgICAgJzExMjAyMCcgPT4ge21vbnRoOiAnMTEnLCB5ZWFyOiAnMjAyMCd9XG4gICAgKi9cbiAgICBpZiAoZGF0ZVN0cmluZy5sZW5ndGggPiA1KSB7XG4gICAgICAgIHJldHVybiAyO1xuICAgIH1cbiAgICAvKlxuICAgICAgQnkgZGVmYXVsdCwgdGhlIG1vbnRoIHZhbHVlIGlzIHRoZSBmaXJzdCB2YWx1ZVxuICAgICovXG4gICAgcmV0dXJuIDE7XG59XG5mdW5jdGlvbiBwYXJzZURhdGUoZGF0ZXN0cmluZykge1xuICAgIHZhciBkYXRlO1xuICAgIGlmICgvXlxcZHs0fS1cXGR7MSwyfSQvLnRlc3QoZGF0ZXN0cmluZykpIHtcbiAgICAgICAgZGF0ZSA9IGRhdGVzdHJpbmcuc3BsaXQoXCItXCIpLnJldmVyc2UoKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoL1xcLy8udGVzdChkYXRlc3RyaW5nKSkge1xuICAgICAgICBkYXRlID0gZGF0ZXN0cmluZy5zcGxpdCgvXFxzKlxcL1xccyovZyk7XG4gICAgfVxuICAgIGVsc2UgaWYgKC9cXHMvLnRlc3QoZGF0ZXN0cmluZykpIHtcbiAgICAgICAgZGF0ZSA9IGRhdGVzdHJpbmcuc3BsaXQoLyArL2cpO1xuICAgIH1cbiAgICBpZiAoKDAsIGlzX2FycmF5XzEuaXNBcnJheSkoZGF0ZSkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG1vbnRoOiBkYXRlWzBdIHx8IFwiXCIsXG4gICAgICAgICAgICB5ZWFyOiBkYXRlLnNsaWNlKDEpLmpvaW4oKSxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgdmFyIG51bWJlck9mRGlnaXRzSW5Nb250aCA9IGdldE51bWJlck9mTW9udGhEaWdpdHNJbkRhdGVTdHJpbmcoZGF0ZXN0cmluZyk7XG4gICAgdmFyIG1vbnRoID0gZGF0ZXN0cmluZy5zdWJzdHIoMCwgbnVtYmVyT2ZEaWdpdHNJbk1vbnRoKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBtb250aDogbW9udGgsXG4gICAgICAgIHllYXI6IGRhdGVzdHJpbmcuc3Vic3RyKG1vbnRoLmxlbmd0aCksXG4gICAgfTtcbn1cbmV4cG9ydHMucGFyc2VEYXRlID0gcGFyc2VEYXRlO1xuIiwiLyogZXNsaW50LWRpc2FibGUgKi9cbi8qXG4gKiBMdWhuIGFsZ29yaXRobSBpbXBsZW1lbnRhdGlvbiBpbiBKYXZhU2NyaXB0XG4gKiBDb3B5cmlnaHQgKGMpIDIwMDkgTmljaG9sYXMgQy4gWmFrYXNcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gKiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gKiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiAqIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuICogVEhFIFNPRlRXQVJFLlxuICovXG5cInVzZSBzdHJpY3RcIjtcbmZ1bmN0aW9uIGx1aG4xMChpZGVudGlmaWVyKSB7XG4gICAgdmFyIHN1bSA9IDA7XG4gICAgdmFyIGFsdCA9IGZhbHNlO1xuICAgIHZhciBpID0gaWRlbnRpZmllci5sZW5ndGggLSAxO1xuICAgIHZhciBudW07XG4gICAgd2hpbGUgKGkgPj0gMCkge1xuICAgICAgICBudW0gPSBwYXJzZUludChpZGVudGlmaWVyLmNoYXJBdChpKSwgMTApO1xuICAgICAgICBpZiAoYWx0KSB7XG4gICAgICAgICAgICBudW0gKj0gMjtcbiAgICAgICAgICAgIGlmIChudW0gPiA5KSB7XG4gICAgICAgICAgICAgICAgbnVtID0gKG51bSAlIDEwKSArIDE7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tZXh0cmEtcGFyZW5zXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYWx0ID0gIWFsdDtcbiAgICAgICAgc3VtICs9IG51bTtcbiAgICAgICAgaS0tO1xuICAgIH1cbiAgICByZXR1cm4gc3VtICUgMTAgPT09IDA7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGx1aG4xMDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5wb3N0YWxDb2RlID0gdm9pZCAwO1xudmFyIERFRkFVTFRfTUlOX1BPU1RBTF9DT0RFX0xFTkdUSCA9IDM7XG5mdW5jdGlvbiB2ZXJpZmljYXRpb24oaXNWYWxpZCwgaXNQb3RlbnRpYWxseVZhbGlkKSB7XG4gICAgcmV0dXJuIHsgaXNWYWxpZDogaXNWYWxpZCwgaXNQb3RlbnRpYWxseVZhbGlkOiBpc1BvdGVudGlhbGx5VmFsaWQgfTtcbn1cbmZ1bmN0aW9uIHBvc3RhbENvZGUodmFsdWUsIG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7IG9wdGlvbnMgPSB7fTsgfVxuICAgIHZhciBtaW5MZW5ndGggPSBvcHRpb25zLm1pbkxlbmd0aCB8fCBERUZBVUxUX01JTl9QT1NUQUxfQ09ERV9MRU5HVEg7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICByZXR1cm4gdmVyaWZpY2F0aW9uKGZhbHNlLCBmYWxzZSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHZhbHVlLmxlbmd0aCA8IG1pbkxlbmd0aCkge1xuICAgICAgICByZXR1cm4gdmVyaWZpY2F0aW9uKGZhbHNlLCB0cnVlKTtcbiAgICB9XG4gICAgcmV0dXJuIHZlcmlmaWNhdGlvbih0cnVlLCB0cnVlKTtcbn1cbmV4cG9ydHMucG9zdGFsQ29kZSA9IHBvc3RhbENvZGU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IGZ1bmN0aW9uICgpIHtcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXG4gICAgICAgICAgICAgICAgdFtwXSA9IHNbcF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfTtcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG52YXIgY2FyZFR5cGVzID0gcmVxdWlyZShcIi4vbGliL2NhcmQtdHlwZXNcIik7XG52YXIgYWRkX21hdGNoaW5nX2NhcmRzX3RvX3Jlc3VsdHNfMSA9IHJlcXVpcmUoXCIuL2xpYi9hZGQtbWF0Y2hpbmctY2FyZHMtdG8tcmVzdWx0c1wiKTtcbnZhciBpc192YWxpZF9pbnB1dF90eXBlXzEgPSByZXF1aXJlKFwiLi9saWIvaXMtdmFsaWQtaW5wdXQtdHlwZVwiKTtcbnZhciBmaW5kX2Jlc3RfbWF0Y2hfMSA9IHJlcXVpcmUoXCIuL2xpYi9maW5kLWJlc3QtbWF0Y2hcIik7XG52YXIgY2xvbmVfMSA9IHJlcXVpcmUoXCIuL2xpYi9jbG9uZVwiKTtcbnZhciBjdXN0b21DYXJkcyA9IHt9O1xudmFyIGNhcmROYW1lcyA9IHtcbiAgICBWSVNBOiBcInZpc2FcIixcbiAgICBNQVNURVJDQVJEOiBcIm1hc3RlcmNhcmRcIixcbiAgICBBTUVSSUNBTl9FWFBSRVNTOiBcImFtZXJpY2FuLWV4cHJlc3NcIixcbiAgICBESU5FUlNfQ0xVQjogXCJkaW5lcnMtY2x1YlwiLFxuICAgIERJU0NPVkVSOiBcImRpc2NvdmVyXCIsXG4gICAgSkNCOiBcImpjYlwiLFxuICAgIFVOSU9OUEFZOiBcInVuaW9ucGF5XCIsXG4gICAgTUFFU1RSTzogXCJtYWVzdHJvXCIsXG4gICAgRUxPOiBcImVsb1wiLFxuICAgIE1JUjogXCJtaXJcIixcbiAgICBISVBFUjogXCJoaXBlclwiLFxuICAgIEhJUEVSQ0FSRDogXCJoaXBlcmNhcmRcIixcbn07XG52YXIgT1JJR0lOQUxfVEVTVF9PUkRFUiA9IFtcbiAgICBjYXJkTmFtZXMuVklTQSxcbiAgICBjYXJkTmFtZXMuTUFTVEVSQ0FSRCxcbiAgICBjYXJkTmFtZXMuQU1FUklDQU5fRVhQUkVTUyxcbiAgICBjYXJkTmFtZXMuRElORVJTX0NMVUIsXG4gICAgY2FyZE5hbWVzLkRJU0NPVkVSLFxuICAgIGNhcmROYW1lcy5KQ0IsXG4gICAgY2FyZE5hbWVzLlVOSU9OUEFZLFxuICAgIGNhcmROYW1lcy5NQUVTVFJPLFxuICAgIGNhcmROYW1lcy5FTE8sXG4gICAgY2FyZE5hbWVzLk1JUixcbiAgICBjYXJkTmFtZXMuSElQRVIsXG4gICAgY2FyZE5hbWVzLkhJUEVSQ0FSRCxcbl07XG52YXIgdGVzdE9yZGVyID0gY2xvbmVfMS5jbG9uZShPUklHSU5BTF9URVNUX09SREVSKTtcbmZ1bmN0aW9uIGZpbmRUeXBlKGNhcmRUeXBlKSB7XG4gICAgcmV0dXJuIGN1c3RvbUNhcmRzW2NhcmRUeXBlXSB8fCBjYXJkVHlwZXNbY2FyZFR5cGVdO1xufVxuZnVuY3Rpb24gZ2V0QWxsQ2FyZFR5cGVzKCkge1xuICAgIHJldHVybiB0ZXN0T3JkZXIubWFwKGZ1bmN0aW9uIChjYXJkVHlwZSkgeyByZXR1cm4gY2xvbmVfMS5jbG9uZShmaW5kVHlwZShjYXJkVHlwZSkpOyB9KTtcbn1cbmZ1bmN0aW9uIGdldENhcmRQb3NpdGlvbihuYW1lLCBpZ25vcmVFcnJvckZvck5vdEV4aXN0aW5nKSB7XG4gICAgaWYgKGlnbm9yZUVycm9yRm9yTm90RXhpc3RpbmcgPT09IHZvaWQgMCkgeyBpZ25vcmVFcnJvckZvck5vdEV4aXN0aW5nID0gZmFsc2U7IH1cbiAgICB2YXIgcG9zaXRpb24gPSB0ZXN0T3JkZXIuaW5kZXhPZihuYW1lKTtcbiAgICBpZiAoIWlnbm9yZUVycm9yRm9yTm90RXhpc3RpbmcgJiYgcG9zaXRpb24gPT09IC0xKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignXCInICsgbmFtZSArICdcIiBpcyBub3QgYSBzdXBwb3J0ZWQgY2FyZCB0eXBlLicpO1xuICAgIH1cbiAgICByZXR1cm4gcG9zaXRpb247XG59XG5mdW5jdGlvbiBjcmVkaXRDYXJkVHlwZShjYXJkTnVtYmVyKSB7XG4gICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICBpZiAoIWlzX3ZhbGlkX2lucHV0X3R5cGVfMS5pc1ZhbGlkSW5wdXRUeXBlKGNhcmROdW1iZXIpKSB7XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH1cbiAgICBpZiAoY2FyZE51bWJlci5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIGdldEFsbENhcmRUeXBlcygpO1xuICAgIH1cbiAgICB0ZXN0T3JkZXIuZm9yRWFjaChmdW5jdGlvbiAoY2FyZFR5cGUpIHtcbiAgICAgICAgdmFyIGNhcmRDb25maWd1cmF0aW9uID0gZmluZFR5cGUoY2FyZFR5cGUpO1xuICAgICAgICBhZGRfbWF0Y2hpbmdfY2FyZHNfdG9fcmVzdWx0c18xLmFkZE1hdGNoaW5nQ2FyZHNUb1Jlc3VsdHMoY2FyZE51bWJlciwgY2FyZENvbmZpZ3VyYXRpb24sIHJlc3VsdHMpO1xuICAgIH0pO1xuICAgIHZhciBiZXN0TWF0Y2ggPSBmaW5kX2Jlc3RfbWF0Y2hfMS5maW5kQmVzdE1hdGNoKHJlc3VsdHMpO1xuICAgIGlmIChiZXN0TWF0Y2gpIHtcbiAgICAgICAgcmV0dXJuIFtiZXN0TWF0Y2hdO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbn1cbmNyZWRpdENhcmRUeXBlLmdldFR5cGVJbmZvID0gZnVuY3Rpb24gKGNhcmRUeXBlKSB7XG4gICAgcmV0dXJuIGNsb25lXzEuY2xvbmUoZmluZFR5cGUoY2FyZFR5cGUpKTtcbn07XG5jcmVkaXRDYXJkVHlwZS5yZW1vdmVDYXJkID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB2YXIgcG9zaXRpb24gPSBnZXRDYXJkUG9zaXRpb24obmFtZSk7XG4gICAgdGVzdE9yZGVyLnNwbGljZShwb3NpdGlvbiwgMSk7XG59O1xuY3JlZGl0Q2FyZFR5cGUuYWRkQ2FyZCA9IGZ1bmN0aW9uIChjb25maWcpIHtcbiAgICB2YXIgZXhpc3RpbmdDYXJkUG9zaXRpb24gPSBnZXRDYXJkUG9zaXRpb24oY29uZmlnLnR5cGUsIHRydWUpO1xuICAgIGN1c3RvbUNhcmRzW2NvbmZpZy50eXBlXSA9IGNvbmZpZztcbiAgICBpZiAoZXhpc3RpbmdDYXJkUG9zaXRpb24gPT09IC0xKSB7XG4gICAgICAgIHRlc3RPcmRlci5wdXNoKGNvbmZpZy50eXBlKTtcbiAgICB9XG59O1xuY3JlZGl0Q2FyZFR5cGUudXBkYXRlQ2FyZCA9IGZ1bmN0aW9uIChjYXJkVHlwZSwgdXBkYXRlcykge1xuICAgIHZhciBvcmlnaW5hbE9iamVjdCA9IGN1c3RvbUNhcmRzW2NhcmRUeXBlXSB8fCBjYXJkVHlwZXNbY2FyZFR5cGVdO1xuICAgIGlmICghb3JpZ2luYWxPYmplY3QpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiXFxcIlwiICsgY2FyZFR5cGUgKyBcIlxcXCIgaXMgbm90IGEgcmVjb2duaXplZCB0eXBlLiBVc2UgYGFkZENhcmRgIGluc3RlYWQuJ1wiKTtcbiAgICB9XG4gICAgaWYgKHVwZGF0ZXMudHlwZSAmJiBvcmlnaW5hbE9iamVjdC50eXBlICE9PSB1cGRhdGVzLnR5cGUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IG92ZXJ3cml0ZSB0eXBlIHBhcmFtZXRlci5cIik7XG4gICAgfVxuICAgIHZhciBjbG9uZWRDYXJkID0gY2xvbmVfMS5jbG9uZShvcmlnaW5hbE9iamVjdCk7XG4gICAgY2xvbmVkQ2FyZCA9IF9fYXNzaWduKF9fYXNzaWduKHt9LCBjbG9uZWRDYXJkKSwgdXBkYXRlcyk7XG4gICAgY3VzdG9tQ2FyZHNbY2xvbmVkQ2FyZC50eXBlXSA9IGNsb25lZENhcmQ7XG59O1xuY3JlZGl0Q2FyZFR5cGUuY2hhbmdlT3JkZXIgPSBmdW5jdGlvbiAobmFtZSwgcG9zaXRpb24pIHtcbiAgICB2YXIgY3VycmVudFBvc2l0aW9uID0gZ2V0Q2FyZFBvc2l0aW9uKG5hbWUpO1xuICAgIHRlc3RPcmRlci5zcGxpY2UoY3VycmVudFBvc2l0aW9uLCAxKTtcbiAgICB0ZXN0T3JkZXIuc3BsaWNlKHBvc2l0aW9uLCAwLCBuYW1lKTtcbn07XG5jcmVkaXRDYXJkVHlwZS5yZXNldE1vZGlmaWNhdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGVzdE9yZGVyID0gY2xvbmVfMS5jbG9uZShPUklHSU5BTF9URVNUX09SREVSKTtcbiAgICBjdXN0b21DYXJkcyA9IHt9O1xufTtcbmNyZWRpdENhcmRUeXBlLnR5cGVzID0gY2FyZE5hbWVzO1xubW9kdWxlLmV4cG9ydHMgPSBjcmVkaXRDYXJkVHlwZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5hZGRNYXRjaGluZ0NhcmRzVG9SZXN1bHRzID0gdm9pZCAwO1xudmFyIGNsb25lXzEgPSByZXF1aXJlKFwiLi9jbG9uZVwiKTtcbnZhciBtYXRjaGVzXzEgPSByZXF1aXJlKFwiLi9tYXRjaGVzXCIpO1xuZnVuY3Rpb24gYWRkTWF0Y2hpbmdDYXJkc1RvUmVzdWx0cyhjYXJkTnVtYmVyLCBjYXJkQ29uZmlndXJhdGlvbiwgcmVzdWx0cykge1xuICAgIHZhciBpLCBwYXR0ZXJuTGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBjYXJkQ29uZmlndXJhdGlvbi5wYXR0ZXJucy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgcGF0dGVybiA9IGNhcmRDb25maWd1cmF0aW9uLnBhdHRlcm5zW2ldO1xuICAgICAgICBpZiAoIW1hdGNoZXNfMS5tYXRjaGVzKGNhcmROdW1iZXIsIHBhdHRlcm4pKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgY2xvbmVkQ2FyZENvbmZpZ3VyYXRpb24gPSBjbG9uZV8xLmNsb25lKGNhcmRDb25maWd1cmF0aW9uKTtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocGF0dGVybikpIHtcbiAgICAgICAgICAgIHBhdHRlcm5MZW5ndGggPSBTdHJpbmcocGF0dGVyblswXSkubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcGF0dGVybkxlbmd0aCA9IFN0cmluZyhwYXR0ZXJuKS5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNhcmROdW1iZXIubGVuZ3RoID49IHBhdHRlcm5MZW5ndGgpIHtcbiAgICAgICAgICAgIGNsb25lZENhcmRDb25maWd1cmF0aW9uLm1hdGNoU3RyZW5ndGggPSBwYXR0ZXJuTGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdHMucHVzaChjbG9uZWRDYXJkQ29uZmlndXJhdGlvbik7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbn1cbmV4cG9ydHMuYWRkTWF0Y2hpbmdDYXJkc1RvUmVzdWx0cyA9IGFkZE1hdGNoaW5nQ2FyZHNUb1Jlc3VsdHM7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBjYXJkVHlwZXMgPSB7XG4gICAgdmlzYToge1xuICAgICAgICBuaWNlVHlwZTogXCJWaXNhXCIsXG4gICAgICAgIHR5cGU6IFwidmlzYVwiLFxuICAgICAgICBwYXR0ZXJuczogWzRdLFxuICAgICAgICBnYXBzOiBbNCwgOCwgMTJdLFxuICAgICAgICBsZW5ndGhzOiBbMTYsIDE4LCAxOV0sXG4gICAgICAgIGNvZGU6IHtcbiAgICAgICAgICAgIG5hbWU6IFwiQ1ZWXCIsXG4gICAgICAgICAgICBzaXplOiAzLFxuICAgICAgICB9LFxuICAgIH0sXG4gICAgbWFzdGVyY2FyZDoge1xuICAgICAgICBuaWNlVHlwZTogXCJNYXN0ZXJjYXJkXCIsXG4gICAgICAgIHR5cGU6IFwibWFzdGVyY2FyZFwiLFxuICAgICAgICBwYXR0ZXJuczogW1s1MSwgNTVdLCBbMjIyMSwgMjIyOV0sIFsyMjMsIDIyOV0sIFsyMywgMjZdLCBbMjcwLCAyNzFdLCAyNzIwXSxcbiAgICAgICAgZ2FwczogWzQsIDgsIDEyXSxcbiAgICAgICAgbGVuZ3RoczogWzE2XSxcbiAgICAgICAgY29kZToge1xuICAgICAgICAgICAgbmFtZTogXCJDVkNcIixcbiAgICAgICAgICAgIHNpemU6IDMsXG4gICAgICAgIH0sXG4gICAgfSxcbiAgICBcImFtZXJpY2FuLWV4cHJlc3NcIjoge1xuICAgICAgICBuaWNlVHlwZTogXCJBbWVyaWNhbiBFeHByZXNzXCIsXG4gICAgICAgIHR5cGU6IFwiYW1lcmljYW4tZXhwcmVzc1wiLFxuICAgICAgICBwYXR0ZXJuczogWzM0LCAzN10sXG4gICAgICAgIGdhcHM6IFs0LCAxMF0sXG4gICAgICAgIGxlbmd0aHM6IFsxNV0sXG4gICAgICAgIGNvZGU6IHtcbiAgICAgICAgICAgIG5hbWU6IFwiQ0lEXCIsXG4gICAgICAgICAgICBzaXplOiA0LFxuICAgICAgICB9LFxuICAgIH0sXG4gICAgXCJkaW5lcnMtY2x1YlwiOiB7XG4gICAgICAgIG5pY2VUeXBlOiBcIkRpbmVycyBDbHViXCIsXG4gICAgICAgIHR5cGU6IFwiZGluZXJzLWNsdWJcIixcbiAgICAgICAgcGF0dGVybnM6IFtbMzAwLCAzMDVdLCAzNiwgMzgsIDM5XSxcbiAgICAgICAgZ2FwczogWzQsIDEwXSxcbiAgICAgICAgbGVuZ3RoczogWzE0LCAxNiwgMTldLFxuICAgICAgICBjb2RlOiB7XG4gICAgICAgICAgICBuYW1lOiBcIkNWVlwiLFxuICAgICAgICAgICAgc2l6ZTogMyxcbiAgICAgICAgfSxcbiAgICB9LFxuICAgIGRpc2NvdmVyOiB7XG4gICAgICAgIG5pY2VUeXBlOiBcIkRpc2NvdmVyXCIsXG4gICAgICAgIHR5cGU6IFwiZGlzY292ZXJcIixcbiAgICAgICAgcGF0dGVybnM6IFs2MDExLCBbNjQ0LCA2NDldLCA2NV0sXG4gICAgICAgIGdhcHM6IFs0LCA4LCAxMl0sXG4gICAgICAgIGxlbmd0aHM6IFsxNiwgMTldLFxuICAgICAgICBjb2RlOiB7XG4gICAgICAgICAgICBuYW1lOiBcIkNJRFwiLFxuICAgICAgICAgICAgc2l6ZTogMyxcbiAgICAgICAgfSxcbiAgICB9LFxuICAgIGpjYjoge1xuICAgICAgICBuaWNlVHlwZTogXCJKQ0JcIixcbiAgICAgICAgdHlwZTogXCJqY2JcIixcbiAgICAgICAgcGF0dGVybnM6IFsyMTMxLCAxODAwLCBbMzUyOCwgMzU4OV1dLFxuICAgICAgICBnYXBzOiBbNCwgOCwgMTJdLFxuICAgICAgICBsZW5ndGhzOiBbMTYsIDE3LCAxOCwgMTldLFxuICAgICAgICBjb2RlOiB7XG4gICAgICAgICAgICBuYW1lOiBcIkNWVlwiLFxuICAgICAgICAgICAgc2l6ZTogMyxcbiAgICAgICAgfSxcbiAgICB9LFxuICAgIHVuaW9ucGF5OiB7XG4gICAgICAgIG5pY2VUeXBlOiBcIlVuaW9uUGF5XCIsXG4gICAgICAgIHR5cGU6IFwidW5pb25wYXlcIixcbiAgICAgICAgcGF0dGVybnM6IFtcbiAgICAgICAgICAgIDYyMCxcbiAgICAgICAgICAgIFs2MjQsIDYyNl0sXG4gICAgICAgICAgICBbNjIxMDAsIDYyMTgyXSxcbiAgICAgICAgICAgIFs2MjE4NCwgNjIxODddLFxuICAgICAgICAgICAgWzYyMTg1LCA2MjE5N10sXG4gICAgICAgICAgICBbNjIyMDAsIDYyMjA1XSxcbiAgICAgICAgICAgIFs2MjIwMTAsIDYyMjk5OV0sXG4gICAgICAgICAgICA2MjIwMTgsXG4gICAgICAgICAgICBbNjIyMDE5LCA2MjI5OTldLFxuICAgICAgICAgICAgWzYyMjA3LCA2MjIwOV0sXG4gICAgICAgICAgICBbNjIyMTI2LCA2MjI5MjVdLFxuICAgICAgICAgICAgWzYyMywgNjI2XSxcbiAgICAgICAgICAgIDYyNzAsXG4gICAgICAgICAgICA2MjcyLFxuICAgICAgICAgICAgNjI3NixcbiAgICAgICAgICAgIFs2Mjc3MDAsIDYyNzc3OV0sXG4gICAgICAgICAgICBbNjI3NzgxLCA2Mjc3OTldLFxuICAgICAgICAgICAgWzYyODIsIDYyODldLFxuICAgICAgICAgICAgNjI5MSxcbiAgICAgICAgICAgIDYyOTIsXG4gICAgICAgICAgICA4MTAsXG4gICAgICAgICAgICBbODExMCwgODEzMV0sXG4gICAgICAgICAgICBbODEzMiwgODE1MV0sXG4gICAgICAgICAgICBbODE1MiwgODE2M10sXG4gICAgICAgICAgICBbODE2NCwgODE3MV0sXG4gICAgICAgIF0sXG4gICAgICAgIGdhcHM6IFs0LCA4LCAxMl0sXG4gICAgICAgIGxlbmd0aHM6IFsxNCwgMTUsIDE2LCAxNywgMTgsIDE5XSxcbiAgICAgICAgY29kZToge1xuICAgICAgICAgICAgbmFtZTogXCJDVk5cIixcbiAgICAgICAgICAgIHNpemU6IDMsXG4gICAgICAgIH0sXG4gICAgfSxcbiAgICBtYWVzdHJvOiB7XG4gICAgICAgIG5pY2VUeXBlOiBcIk1hZXN0cm9cIixcbiAgICAgICAgdHlwZTogXCJtYWVzdHJvXCIsXG4gICAgICAgIHBhdHRlcm5zOiBbXG4gICAgICAgICAgICA0OTM2OTgsXG4gICAgICAgICAgICBbNTAwMDAwLCA1MDQxNzRdLFxuICAgICAgICAgICAgWzUwNDE3NiwgNTA2Njk4XSxcbiAgICAgICAgICAgIFs1MDY3NzksIDUwODk5OV0sXG4gICAgICAgICAgICBbNTYsIDU5XSxcbiAgICAgICAgICAgIDYzLFxuICAgICAgICAgICAgNjcsXG4gICAgICAgICAgICA2LFxuICAgICAgICBdLFxuICAgICAgICBnYXBzOiBbNCwgOCwgMTJdLFxuICAgICAgICBsZW5ndGhzOiBbMTIsIDEzLCAxNCwgMTUsIDE2LCAxNywgMTgsIDE5XSxcbiAgICAgICAgY29kZToge1xuICAgICAgICAgICAgbmFtZTogXCJDVkNcIixcbiAgICAgICAgICAgIHNpemU6IDMsXG4gICAgICAgIH0sXG4gICAgfSxcbiAgICBlbG86IHtcbiAgICAgICAgbmljZVR5cGU6IFwiRWxvXCIsXG4gICAgICAgIHR5cGU6IFwiZWxvXCIsXG4gICAgICAgIHBhdHRlcm5zOiBbXG4gICAgICAgICAgICA0MDExNzgsXG4gICAgICAgICAgICA0MDExNzksXG4gICAgICAgICAgICA0Mzg5MzUsXG4gICAgICAgICAgICA0NTc2MzEsXG4gICAgICAgICAgICA0NTc2MzIsXG4gICAgICAgICAgICA0MzEyNzQsXG4gICAgICAgICAgICA0NTE0MTYsXG4gICAgICAgICAgICA0NTczOTMsXG4gICAgICAgICAgICA1MDQxNzUsXG4gICAgICAgICAgICBbNTA2Njk5LCA1MDY3NzhdLFxuICAgICAgICAgICAgWzUwOTAwMCwgNTA5OTk5XSxcbiAgICAgICAgICAgIDYyNzc4MCxcbiAgICAgICAgICAgIDYzNjI5NyxcbiAgICAgICAgICAgIDYzNjM2OCxcbiAgICAgICAgICAgIFs2NTAwMzEsIDY1MDAzM10sXG4gICAgICAgICAgICBbNjUwMDM1LCA2NTAwNTFdLFxuICAgICAgICAgICAgWzY1MDQwNSwgNjUwNDM5XSxcbiAgICAgICAgICAgIFs2NTA0ODUsIDY1MDUzOF0sXG4gICAgICAgICAgICBbNjUwNTQxLCA2NTA1OThdLFxuICAgICAgICAgICAgWzY1MDcwMCwgNjUwNzE4XSxcbiAgICAgICAgICAgIFs2NTA3MjAsIDY1MDcyN10sXG4gICAgICAgICAgICBbNjUwOTAxLCA2NTA5NzhdLFxuICAgICAgICAgICAgWzY1MTY1MiwgNjUxNjc5XSxcbiAgICAgICAgICAgIFs2NTUwMDAsIDY1NTAxOV0sXG4gICAgICAgICAgICBbNjU1MDIxLCA2NTUwNThdLFxuICAgICAgICBdLFxuICAgICAgICBnYXBzOiBbNCwgOCwgMTJdLFxuICAgICAgICBsZW5ndGhzOiBbMTZdLFxuICAgICAgICBjb2RlOiB7XG4gICAgICAgICAgICBuYW1lOiBcIkNWRVwiLFxuICAgICAgICAgICAgc2l6ZTogMyxcbiAgICAgICAgfSxcbiAgICB9LFxuICAgIG1pcjoge1xuICAgICAgICBuaWNlVHlwZTogXCJNaXJcIixcbiAgICAgICAgdHlwZTogXCJtaXJcIixcbiAgICAgICAgcGF0dGVybnM6IFtbMjIwMCwgMjIwNF1dLFxuICAgICAgICBnYXBzOiBbNCwgOCwgMTJdLFxuICAgICAgICBsZW5ndGhzOiBbMTYsIDE3LCAxOCwgMTldLFxuICAgICAgICBjb2RlOiB7XG4gICAgICAgICAgICBuYW1lOiBcIkNWUDJcIixcbiAgICAgICAgICAgIHNpemU6IDMsXG4gICAgICAgIH0sXG4gICAgfSxcbiAgICBoaXBlcjoge1xuICAgICAgICBuaWNlVHlwZTogXCJIaXBlclwiLFxuICAgICAgICB0eXBlOiBcImhpcGVyXCIsXG4gICAgICAgIHBhdHRlcm5zOiBbNjM3MDk1LCA2MzczNzQyMywgNjM3NDMzNTgsIDYzNzU2OCwgNjM3NTk5LCA2Mzc2MDksIDYzNzYxMl0sXG4gICAgICAgIGdhcHM6IFs0LCA4LCAxMl0sXG4gICAgICAgIGxlbmd0aHM6IFsxNl0sXG4gICAgICAgIGNvZGU6IHtcbiAgICAgICAgICAgIG5hbWU6IFwiQ1ZDXCIsXG4gICAgICAgICAgICBzaXplOiAzLFxuICAgICAgICB9LFxuICAgIH0sXG4gICAgaGlwZXJjYXJkOiB7XG4gICAgICAgIG5pY2VUeXBlOiBcIkhpcGVyY2FyZFwiLFxuICAgICAgICB0eXBlOiBcImhpcGVyY2FyZFwiLFxuICAgICAgICBwYXR0ZXJuczogWzYwNjI4Ml0sXG4gICAgICAgIGdhcHM6IFs0LCA4LCAxMl0sXG4gICAgICAgIGxlbmd0aHM6IFsxNl0sXG4gICAgICAgIGNvZGU6IHtcbiAgICAgICAgICAgIG5hbWU6IFwiQ1ZDXCIsXG4gICAgICAgICAgICBzaXplOiAzLFxuICAgICAgICB9LFxuICAgIH0sXG59O1xubW9kdWxlLmV4cG9ydHMgPSBjYXJkVHlwZXM7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuY2xvbmUgPSB2b2lkIDA7XG5mdW5jdGlvbiBjbG9uZShvcmlnaW5hbE9iamVjdCkge1xuICAgIGlmICghb3JpZ2luYWxPYmplY3QpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG9yaWdpbmFsT2JqZWN0KSk7XG59XG5leHBvcnRzLmNsb25lID0gY2xvbmU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZmluZEJlc3RNYXRjaCA9IHZvaWQgMDtcbmZ1bmN0aW9uIGhhc0Vub3VnaFJlc3VsdHNUb0RldGVybWluZUJlc3RNYXRjaChyZXN1bHRzKSB7XG4gICAgdmFyIG51bWJlck9mUmVzdWx0c1dpdGhNYXhTdHJlbmd0aFByb3BlcnR5ID0gcmVzdWx0cy5maWx0ZXIoZnVuY3Rpb24gKHJlc3VsdCkgeyByZXR1cm4gcmVzdWx0Lm1hdGNoU3RyZW5ndGg7IH0pLmxlbmd0aDtcbiAgICAvKlxuICAgICAqIGlmIGFsbCBwb3NzaWJsZSByZXN1bHRzIGhhdmUgYSBtYXhTdHJlbmd0aCBwcm9wZXJ0eSB0aGF0IG1lYW5zIHRoZSBjYXJkXG4gICAgICogbnVtYmVyIGlzIHN1ZmZpY2llbnRseSBsb25nIGVub3VnaCB0byBkZXRlcm1pbmUgY29uY2x1c2l2ZWx5IHdoYXQgdGhlIGNhcmRcbiAgICAgKiB0eXBlIGlzXG4gICAgICogKi9cbiAgICByZXR1cm4gKG51bWJlck9mUmVzdWx0c1dpdGhNYXhTdHJlbmd0aFByb3BlcnR5ID4gMCAmJlxuICAgICAgICBudW1iZXJPZlJlc3VsdHNXaXRoTWF4U3RyZW5ndGhQcm9wZXJ0eSA9PT0gcmVzdWx0cy5sZW5ndGgpO1xufVxuZnVuY3Rpb24gZmluZEJlc3RNYXRjaChyZXN1bHRzKSB7XG4gICAgaWYgKCFoYXNFbm91Z2hSZXN1bHRzVG9EZXRlcm1pbmVCZXN0TWF0Y2gocmVzdWx0cykpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzLnJlZHVjZShmdW5jdGlvbiAoYmVzdE1hdGNoLCByZXN1bHQpIHtcbiAgICAgICAgaWYgKCFiZXN0TWF0Y2gpIHtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgICAgLypcbiAgICAgICAgICogSWYgdGhlIGN1cnJlbnQgYmVzdCBtYXRjaCBwYXR0ZXJuIGlzIGxlc3Mgc3BlY2lmaWMgdGhhbiB0aGlzIHJlc3VsdCwgc2V0XG4gICAgICAgICAqIHRoZSByZXN1bHQgYXMgdGhlIG5ldyBiZXN0IG1hdGNoXG4gICAgICAgICAqICovXG4gICAgICAgIGlmIChOdW1iZXIoYmVzdE1hdGNoLm1hdGNoU3RyZW5ndGgpIDwgTnVtYmVyKHJlc3VsdC5tYXRjaFN0cmVuZ3RoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYmVzdE1hdGNoO1xuICAgIH0pO1xufVxuZXhwb3J0cy5maW5kQmVzdE1hdGNoID0gZmluZEJlc3RNYXRjaDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5pc1ZhbGlkSW5wdXRUeXBlID0gdm9pZCAwO1xuZnVuY3Rpb24gaXNWYWxpZElucHV0VHlwZShjYXJkTnVtYmVyKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBjYXJkTnVtYmVyID09PSBcInN0cmluZ1wiIHx8IGNhcmROdW1iZXIgaW5zdGFuY2VvZiBTdHJpbmc7XG59XG5leHBvcnRzLmlzVmFsaWRJbnB1dFR5cGUgPSBpc1ZhbGlkSW5wdXRUeXBlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vKlxuICogQWRhcHRlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9wb2x2by1sYWJzL2NhcmQtdHlwZS9ibG9iL2FhYWIxMWY4MGZhMTkzOWJjY2M4ZjI0OTA1YTA2YWUzY2Q4NjQzNTYvc3JjL2NhcmRUeXBlLmpzI0wzNy1MNDJcbiAqICovXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLm1hdGNoZXMgPSB2b2lkIDA7XG5mdW5jdGlvbiBtYXRjaGVzUmFuZ2UoY2FyZE51bWJlciwgbWluLCBtYXgpIHtcbiAgICB2YXIgbWF4TGVuZ3RoVG9DaGVjayA9IFN0cmluZyhtaW4pLmxlbmd0aDtcbiAgICB2YXIgc3Vic3RyID0gY2FyZE51bWJlci5zdWJzdHIoMCwgbWF4TGVuZ3RoVG9DaGVjayk7XG4gICAgdmFyIGludGVnZXJSZXByZXNlbnRhdGlvbk9mQ2FyZE51bWJlciA9IHBhcnNlSW50KHN1YnN0ciwgMTApO1xuICAgIG1pbiA9IHBhcnNlSW50KFN0cmluZyhtaW4pLnN1YnN0cigwLCBzdWJzdHIubGVuZ3RoKSwgMTApO1xuICAgIG1heCA9IHBhcnNlSW50KFN0cmluZyhtYXgpLnN1YnN0cigwLCBzdWJzdHIubGVuZ3RoKSwgMTApO1xuICAgIHJldHVybiAoaW50ZWdlclJlcHJlc2VudGF0aW9uT2ZDYXJkTnVtYmVyID49IG1pbiAmJlxuICAgICAgICBpbnRlZ2VyUmVwcmVzZW50YXRpb25PZkNhcmROdW1iZXIgPD0gbWF4KTtcbn1cbmZ1bmN0aW9uIG1hdGNoZXNQYXR0ZXJuKGNhcmROdW1iZXIsIHBhdHRlcm4pIHtcbiAgICBwYXR0ZXJuID0gU3RyaW5nKHBhdHRlcm4pO1xuICAgIHJldHVybiAocGF0dGVybi5zdWJzdHJpbmcoMCwgY2FyZE51bWJlci5sZW5ndGgpID09PVxuICAgICAgICBjYXJkTnVtYmVyLnN1YnN0cmluZygwLCBwYXR0ZXJuLmxlbmd0aCkpO1xufVxuZnVuY3Rpb24gbWF0Y2hlcyhjYXJkTnVtYmVyLCBwYXR0ZXJuKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkocGF0dGVybikpIHtcbiAgICAgICAgcmV0dXJuIG1hdGNoZXNSYW5nZShjYXJkTnVtYmVyLCBwYXR0ZXJuWzBdLCBwYXR0ZXJuWzFdKTtcbiAgICB9XG4gICAgcmV0dXJuIG1hdGNoZXNQYXR0ZXJuKGNhcmROdW1iZXIsIHBhdHRlcm4pO1xufVxuZXhwb3J0cy5tYXRjaGVzID0gbWF0Y2hlcztcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHR5cGVzID0gcmVxdWlyZSgnLi9saWIvY2FyZC10eXBlcycpO1xudmFyIGNsb25lID0gcmVxdWlyZSgnLi9saWIvY2xvbmUnKTtcbnZhciBmaW5kQmVzdE1hdGNoID0gcmVxdWlyZSgnLi9saWIvZmluZC1iZXN0LW1hdGNoJyk7XG52YXIgaXNWYWxpZElucHV0VHlwZSA9IHJlcXVpcmUoJy4vbGliL2lzLXZhbGlkLWlucHV0LXR5cGUnKTtcbnZhciBhZGRNYXRjaGluZ0NhcmRzVG9SZXN1bHRzID0gcmVxdWlyZSgnLi9saWIvYWRkLW1hdGNoaW5nLWNhcmRzLXRvLXJlc3VsdHMnKTtcblxudmFyIHRlc3RPcmRlcjtcbnZhciBjdXN0b21DYXJkcyA9IHt9O1xuXG52YXIgY2FyZE5hbWVzID0ge1xuICBWSVNBOiAndmlzYScsXG4gIE1BU1RFUkNBUkQ6ICdtYXN0ZXJjYXJkJyxcbiAgQU1FUklDQU5fRVhQUkVTUzogJ2FtZXJpY2FuLWV4cHJlc3MnLFxuICBESU5FUlNfQ0xVQjogJ2RpbmVycy1jbHViJyxcbiAgRElTQ09WRVI6ICdkaXNjb3ZlcicsXG4gIEpDQjogJ2pjYicsXG4gIFVOSU9OUEFZOiAndW5pb25wYXknLFxuICBNQUVTVFJPOiAnbWFlc3RybycsXG4gIEVMTzogJ2VsbycsXG4gIE1JUjogJ21pcicsXG4gIEhJUEVSOiAnaGlwZXInLFxuICBISVBFUkNBUkQ6ICdoaXBlcmNhcmQnXG59O1xuXG52YXIgT1JJR0lOQUxfVEVTVF9PUkRFUiA9IFtcbiAgY2FyZE5hbWVzLlZJU0EsXG4gIGNhcmROYW1lcy5NQVNURVJDQVJELFxuICBjYXJkTmFtZXMuQU1FUklDQU5fRVhQUkVTUyxcbiAgY2FyZE5hbWVzLkRJTkVSU19DTFVCLFxuICBjYXJkTmFtZXMuRElTQ09WRVIsXG4gIGNhcmROYW1lcy5KQ0IsXG4gIGNhcmROYW1lcy5VTklPTlBBWSxcbiAgY2FyZE5hbWVzLk1BRVNUUk8sXG4gIGNhcmROYW1lcy5FTE8sXG4gIGNhcmROYW1lcy5NSVIsXG4gIGNhcmROYW1lcy5ISVBFUixcbiAgY2FyZE5hbWVzLkhJUEVSQ0FSRFxuXTtcblxudGVzdE9yZGVyID0gY2xvbmUoT1JJR0lOQUxfVEVTVF9PUkRFUik7XG5cbmZ1bmN0aW9uIGZpbmRUeXBlKHR5cGUpIHtcbiAgcmV0dXJuIGN1c3RvbUNhcmRzW3R5cGVdIHx8IHR5cGVzW3R5cGVdO1xufVxuXG5mdW5jdGlvbiBnZXRBbGxDYXJkVHlwZXMoKSB7XG4gIHJldHVybiB0ZXN0T3JkZXIubWFwKGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgcmV0dXJuIGNsb25lKGZpbmRUeXBlKHR5cGUpKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldENhcmRQb3NpdGlvbihuYW1lLCBpZ25vcmVFcnJvckZvck5vdEV4aXN0aW5nKSB7XG4gIHZhciBwb3NpdGlvbiA9IHRlc3RPcmRlci5pbmRleE9mKG5hbWUpO1xuXG4gIGlmICghaWdub3JlRXJyb3JGb3JOb3RFeGlzdGluZyAmJiBwb3NpdGlvbiA9PT0gLTEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1wiJyArIG5hbWUgKyAnXCIgaXMgbm90IGEgc3VwcG9ydGVkIGNhcmQgdHlwZS4nKTtcbiAgfVxuXG4gIHJldHVybiBwb3NpdGlvbjtcbn1cblxuZnVuY3Rpb24gY3JlZGl0Q2FyZFR5cGUoY2FyZE51bWJlcikge1xuICB2YXIgYmVzdE1hdGNoO1xuICB2YXIgcmVzdWx0cyA9IFtdO1xuXG4gIGlmICghaXNWYWxpZElucHV0VHlwZShjYXJkTnVtYmVyKSkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGlmIChjYXJkTnVtYmVyLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBnZXRBbGxDYXJkVHlwZXModGVzdE9yZGVyKTtcbiAgfVxuXG4gIHRlc3RPcmRlci5mb3JFYWNoKGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgdmFyIGNhcmRDb25maWd1cmF0aW9uID0gZmluZFR5cGUodHlwZSk7XG5cbiAgICBhZGRNYXRjaGluZ0NhcmRzVG9SZXN1bHRzKGNhcmROdW1iZXIsIGNhcmRDb25maWd1cmF0aW9uLCByZXN1bHRzKTtcbiAgfSk7XG5cbiAgYmVzdE1hdGNoID0gZmluZEJlc3RNYXRjaChyZXN1bHRzKTtcblxuICBpZiAoYmVzdE1hdGNoKSB7XG4gICAgcmV0dXJuIFtiZXN0TWF0Y2hdO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdHM7XG59XG5cbmNyZWRpdENhcmRUeXBlLmdldFR5cGVJbmZvID0gZnVuY3Rpb24gKHR5cGUpIHtcbiAgcmV0dXJuIGNsb25lKGZpbmRUeXBlKHR5cGUpKTtcbn07XG5cbmNyZWRpdENhcmRUeXBlLnJlbW92ZUNhcmQgPSBmdW5jdGlvbiAobmFtZSkge1xuICB2YXIgcG9zaXRpb24gPSBnZXRDYXJkUG9zaXRpb24obmFtZSk7XG5cbiAgdGVzdE9yZGVyLnNwbGljZShwb3NpdGlvbiwgMSk7XG59O1xuXG5jcmVkaXRDYXJkVHlwZS5hZGRDYXJkID0gZnVuY3Rpb24gKGNvbmZpZykge1xuICB2YXIgZXhpc3RpbmdDYXJkUG9zaXRpb24gPSBnZXRDYXJkUG9zaXRpb24oY29uZmlnLnR5cGUsIHRydWUpO1xuXG4gIGN1c3RvbUNhcmRzW2NvbmZpZy50eXBlXSA9IGNvbmZpZztcblxuICBpZiAoZXhpc3RpbmdDYXJkUG9zaXRpb24gPT09IC0xKSB7XG4gICAgdGVzdE9yZGVyLnB1c2goY29uZmlnLnR5cGUpO1xuICB9XG59O1xuXG5jcmVkaXRDYXJkVHlwZS51cGRhdGVDYXJkID0gZnVuY3Rpb24gKGNhcmRUeXBlLCB1cGRhdGVzKSB7XG4gIHZhciBjbG9uZWRDYXJkO1xuICB2YXIgb3JpZ2luYWxPYmplY3QgPSBjdXN0b21DYXJkc1tjYXJkVHlwZV0gfHwgdHlwZXNbY2FyZFR5cGVdO1xuXG4gIGlmICghb3JpZ2luYWxPYmplY3QpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1wiJyArIGNhcmRUeXBlICsgJ1wiIGlzIG5vdCBhIHJlY29nbml6ZWQgdHlwZS4gVXNlIGBhZGRDYXJkYCBpbnN0ZWFkLicpO1xuICB9XG5cbiAgaWYgKHVwZGF0ZXMudHlwZSAmJiBvcmlnaW5hbE9iamVjdC50eXBlICE9PSB1cGRhdGVzLnR5cGUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBvdmVyd3JpdGUgdHlwZSBwYXJhbWV0ZXIuJyk7XG4gIH1cblxuICBjbG9uZWRDYXJkID0gY2xvbmUob3JpZ2luYWxPYmplY3QsIHRydWUpO1xuXG4gIE9iamVjdC5rZXlzKGNsb25lZENhcmQpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgIGlmICh1cGRhdGVzW2tleV0pIHtcbiAgICAgIGNsb25lZENhcmRba2V5XSA9IHVwZGF0ZXNba2V5XTtcbiAgICB9XG4gIH0pO1xuXG4gIGN1c3RvbUNhcmRzW2Nsb25lZENhcmQudHlwZV0gPSBjbG9uZWRDYXJkO1xufTtcblxuY3JlZGl0Q2FyZFR5cGUuY2hhbmdlT3JkZXIgPSBmdW5jdGlvbiAobmFtZSwgcG9zaXRpb24pIHtcbiAgdmFyIGN1cnJlbnRQb3NpdGlvbiA9IGdldENhcmRQb3NpdGlvbihuYW1lKTtcblxuICB0ZXN0T3JkZXIuc3BsaWNlKGN1cnJlbnRQb3NpdGlvbiwgMSk7XG4gIHRlc3RPcmRlci5zcGxpY2UocG9zaXRpb24sIDAsIG5hbWUpO1xufTtcblxuY3JlZGl0Q2FyZFR5cGUucmVzZXRNb2RpZmljYXRpb25zID0gZnVuY3Rpb24gKCkge1xuICB0ZXN0T3JkZXIgPSBjbG9uZShPUklHSU5BTF9URVNUX09SREVSKTtcbiAgY3VzdG9tQ2FyZHMgPSB7fTtcbn07XG5cbmNyZWRpdENhcmRUeXBlLnR5cGVzID0gY2FyZE5hbWVzO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWRpdENhcmRUeXBlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2xvbmUgPSByZXF1aXJlKCcuL2Nsb25lJyk7XG52YXIgbWF0Y2hlcyA9IHJlcXVpcmUoJy4vbWF0Y2hlcycpO1xuXG5mdW5jdGlvbiBhZGRNYXRjaGluZ0NhcmRzVG9SZXN1bHRzKGNhcmROdW1iZXIsIGNhcmRDb25maWd1cmF0aW9uLCByZXN1bHRzKSB7XG4gIHZhciBpLCBwYXR0ZXJuLCBwYXR0ZXJuTGVuZ3RoLCBjbG9uZWRDYXJkQ29uZmlndXJhdGlvbjtcblxuICBmb3IgKGkgPSAwOyBpIDwgY2FyZENvbmZpZ3VyYXRpb24ucGF0dGVybnMubGVuZ3RoOyBpKyspIHtcbiAgICBwYXR0ZXJuID0gY2FyZENvbmZpZ3VyYXRpb24ucGF0dGVybnNbaV07XG5cbiAgICBpZiAoIW1hdGNoZXMoY2FyZE51bWJlciwgcGF0dGVybikpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGNsb25lZENhcmRDb25maWd1cmF0aW9uID0gY2xvbmUoY2FyZENvbmZpZ3VyYXRpb24pO1xuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkocGF0dGVybikpIHtcbiAgICAgIHBhdHRlcm5MZW5ndGggPSBTdHJpbmcocGF0dGVyblswXSkubGVuZ3RoO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXR0ZXJuTGVuZ3RoID0gU3RyaW5nKHBhdHRlcm4pLmxlbmd0aDtcbiAgICB9XG5cbiAgICBpZiAoY2FyZE51bWJlci5sZW5ndGggPj0gcGF0dGVybkxlbmd0aCkge1xuICAgICAgY2xvbmVkQ2FyZENvbmZpZ3VyYXRpb24ubWF0Y2hTdHJlbmd0aCA9IHBhdHRlcm5MZW5ndGg7XG4gICAgfVxuXG4gICAgcmVzdWx0cy5wdXNoKGNsb25lZENhcmRDb25maWd1cmF0aW9uKTtcbiAgICBicmVhaztcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFkZE1hdGNoaW5nQ2FyZHNUb1Jlc3VsdHM7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjYXJkVHlwZXMgPSB7XG4gIHZpc2E6IHtcbiAgICBuaWNlVHlwZTogJ1Zpc2EnLFxuICAgIHR5cGU6ICd2aXNhJyxcbiAgICBwYXR0ZXJuczogW1xuICAgICAgNFxuICAgIF0sXG4gICAgZ2FwczogWzQsIDgsIDEyXSxcbiAgICBsZW5ndGhzOiBbMTYsIDE4LCAxOV0sXG4gICAgY29kZToge1xuICAgICAgbmFtZTogJ0NWVicsXG4gICAgICBzaXplOiAzXG4gICAgfVxuICB9LFxuICBtYXN0ZXJjYXJkOiB7XG4gICAgbmljZVR5cGU6ICdNYXN0ZXJjYXJkJyxcbiAgICB0eXBlOiAnbWFzdGVyY2FyZCcsXG4gICAgcGF0dGVybnM6IFtcbiAgICAgIFs1MSwgNTVdLFxuICAgICAgWzIyMjEsIDIyMjldLFxuICAgICAgWzIyMywgMjI5XSxcbiAgICAgIFsyMywgMjZdLFxuICAgICAgWzI3MCwgMjcxXSxcbiAgICAgIDI3MjBcbiAgICBdLFxuICAgIGdhcHM6IFs0LCA4LCAxMl0sXG4gICAgbGVuZ3RoczogWzE2XSxcbiAgICBjb2RlOiB7XG4gICAgICBuYW1lOiAnQ1ZDJyxcbiAgICAgIHNpemU6IDNcbiAgICB9XG4gIH0sXG4gICdhbWVyaWNhbi1leHByZXNzJzoge1xuICAgIG5pY2VUeXBlOiAnQW1lcmljYW4gRXhwcmVzcycsXG4gICAgdHlwZTogJ2FtZXJpY2FuLWV4cHJlc3MnLFxuICAgIHBhdHRlcm5zOiBbXG4gICAgICAzNCxcbiAgICAgIDM3XG4gICAgXSxcbiAgICBnYXBzOiBbNCwgMTBdLFxuICAgIGxlbmd0aHM6IFsxNV0sXG4gICAgY29kZToge1xuICAgICAgbmFtZTogJ0NJRCcsXG4gICAgICBzaXplOiA0XG4gICAgfVxuICB9LFxuICAnZGluZXJzLWNsdWInOiB7XG4gICAgbmljZVR5cGU6ICdEaW5lcnMgQ2x1YicsXG4gICAgdHlwZTogJ2RpbmVycy1jbHViJyxcbiAgICBwYXR0ZXJuczogW1xuICAgICAgWzMwMCwgMzA1XSxcbiAgICAgIDM2LFxuICAgICAgMzgsXG4gICAgICAzOVxuICAgIF0sXG4gICAgZ2FwczogWzQsIDEwXSxcbiAgICBsZW5ndGhzOiBbMTQsIDE2LCAxOV0sXG4gICAgY29kZToge1xuICAgICAgbmFtZTogJ0NWVicsXG4gICAgICBzaXplOiAzXG4gICAgfVxuICB9LFxuICBkaXNjb3Zlcjoge1xuICAgIG5pY2VUeXBlOiAnRGlzY292ZXInLFxuICAgIHR5cGU6ICdkaXNjb3ZlcicsXG4gICAgcGF0dGVybnM6IFtcbiAgICAgIDYwMTEsXG4gICAgICBbNjQ0LCA2NDldLFxuICAgICAgNjVcbiAgICBdLFxuICAgIGdhcHM6IFs0LCA4LCAxMl0sXG4gICAgbGVuZ3RoczogWzE2LCAxOV0sXG4gICAgY29kZToge1xuICAgICAgbmFtZTogJ0NJRCcsXG4gICAgICBzaXplOiAzXG4gICAgfVxuICB9LFxuICBqY2I6IHtcbiAgICBuaWNlVHlwZTogJ0pDQicsXG4gICAgdHlwZTogJ2pjYicsXG4gICAgcGF0dGVybnM6IFtcbiAgICAgIDIxMzEsXG4gICAgICAxODAwLFxuICAgICAgWzM1MjgsIDM1ODldXG4gICAgXSxcbiAgICBnYXBzOiBbNCwgOCwgMTJdLFxuICAgIGxlbmd0aHM6IFsxNiwgMTcsIDE4LCAxOV0sXG4gICAgY29kZToge1xuICAgICAgbmFtZTogJ0NWVicsXG4gICAgICBzaXplOiAzXG4gICAgfVxuICB9LFxuICB1bmlvbnBheToge1xuICAgIG5pY2VUeXBlOiAnVW5pb25QYXknLFxuICAgIHR5cGU6ICd1bmlvbnBheScsXG4gICAgcGF0dGVybnM6IFtcbiAgICAgIDYyMCxcbiAgICAgIFs2MjQsIDYyNl0sXG4gICAgICBbNjIxMDAsIDYyMTgyXSxcbiAgICAgIFs2MjE4NCwgNjIxODddLFxuICAgICAgWzYyMTg1LCA2MjE5N10sXG4gICAgICBbNjIyMDAsIDYyMjA1XSxcbiAgICAgIFs2MjIwMTAsIDYyMjk5OV0sXG4gICAgICA2MjIwMTgsXG4gICAgICBbNjIyMDE5LCA2MjI5OTldLFxuICAgICAgWzYyMjA3LCA2MjIwOV0sXG4gICAgICBbNjIyMTI2LCA2MjI5MjVdLFxuICAgICAgWzYyMywgNjI2XSxcbiAgICAgIDYyNzAsXG4gICAgICA2MjcyLFxuICAgICAgNjI3NixcbiAgICAgIFs2Mjc3MDAsIDYyNzc3OV0sXG4gICAgICBbNjI3NzgxLCA2Mjc3OTldLFxuICAgICAgWzYyODIsIDYyODldLFxuICAgICAgNjI5MSxcbiAgICAgIDYyOTIsXG4gICAgICA4MTAsXG4gICAgICBbODExMCwgODEzMV0sXG4gICAgICBbODEzMiwgODE1MV0sXG4gICAgICBbODE1MiwgODE2M10sXG4gICAgICBbODE2NCwgODE3MV1cbiAgICBdLFxuICAgIGdhcHM6IFs0LCA4LCAxMl0sXG4gICAgbGVuZ3RoczogWzE0LCAxNSwgMTYsIDE3LCAxOCwgMTldLFxuICAgIGNvZGU6IHtcbiAgICAgIG5hbWU6ICdDVk4nLFxuICAgICAgc2l6ZTogM1xuICAgIH1cbiAgfSxcbiAgbWFlc3Rybzoge1xuICAgIG5pY2VUeXBlOiAnTWFlc3RybycsXG4gICAgdHlwZTogJ21hZXN0cm8nLFxuICAgIHBhdHRlcm5zOiBbXG4gICAgICA0OTM2OTgsXG4gICAgICBbNTAwMDAwLCA1MDY2OThdLFxuICAgICAgWzUwNjc3OSwgNTA4OTk5XSxcbiAgICAgIFs1NiwgNTldLFxuICAgICAgNjMsXG4gICAgICA2NyxcbiAgICAgIDZcbiAgICBdLFxuICAgIGdhcHM6IFs0LCA4LCAxMl0sXG4gICAgbGVuZ3RoczogWzEyLCAxMywgMTQsIDE1LCAxNiwgMTcsIDE4LCAxOV0sXG4gICAgY29kZToge1xuICAgICAgbmFtZTogJ0NWQycsXG4gICAgICBzaXplOiAzXG4gICAgfVxuICB9LFxuICBlbG86IHtcbiAgICBuaWNlVHlwZTogJ0VsbycsXG4gICAgdHlwZTogJ2VsbycsXG4gICAgcGF0dGVybnM6IFtcbiAgICAgIDQwMTE3OCxcbiAgICAgIDQwMTE3OSxcbiAgICAgIDQzODkzNSxcbiAgICAgIDQ1NzYzMSxcbiAgICAgIDQ1NzYzMixcbiAgICAgIDQzMTI3NCxcbiAgICAgIDQ1MTQxNixcbiAgICAgIDQ1NzM5MyxcbiAgICAgIDUwNDE3NSxcbiAgICAgIFs1MDY2OTksIDUwNjc3OF0sXG4gICAgICBbNTA5MDAwLCA1MDk5OTldLFxuICAgICAgNjI3NzgwLFxuICAgICAgNjM2Mjk3LFxuICAgICAgNjM2MzY4LFxuICAgICAgWzY1MDAzMSwgNjUwMDMzXSxcbiAgICAgIFs2NTAwMzUsIDY1MDA1MV0sXG4gICAgICBbNjUwNDA1LCA2NTA0MzldLFxuICAgICAgWzY1MDQ4NSwgNjUwNTM4XSxcbiAgICAgIFs2NTA1NDEsIDY1MDU5OF0sXG4gICAgICBbNjUwNzAwLCA2NTA3MThdLFxuICAgICAgWzY1MDcyMCwgNjUwNzI3XSxcbiAgICAgIFs2NTA5MDEsIDY1MDk3OF0sXG4gICAgICBbNjUxNjUyLCA2NTE2NzldLFxuICAgICAgWzY1NTAwMCwgNjU1MDE5XSxcbiAgICAgIFs2NTUwMjEsIDY1NTA1OF1cbiAgICBdLFxuICAgIGdhcHM6IFs0LCA4LCAxMl0sXG4gICAgbGVuZ3RoczogWzE2XSxcbiAgICBjb2RlOiB7XG4gICAgICBuYW1lOiAnQ1ZFJyxcbiAgICAgIHNpemU6IDNcbiAgICB9XG4gIH0sXG4gIG1pcjoge1xuICAgIG5pY2VUeXBlOiAnTWlyJyxcbiAgICB0eXBlOiAnbWlyJyxcbiAgICBwYXR0ZXJuczogW1xuICAgICAgWzIyMDAsIDIyMDRdXG4gICAgXSxcbiAgICBnYXBzOiBbNCwgOCwgMTJdLFxuICAgIGxlbmd0aHM6IFsxNiwgMTcsIDE4LCAxOV0sXG4gICAgY29kZToge1xuICAgICAgbmFtZTogJ0NWUDInLFxuICAgICAgc2l6ZTogM1xuICAgIH1cbiAgfSxcbiAgaGlwZXI6IHtcbiAgICBuaWNlVHlwZTogJ0hpcGVyJyxcbiAgICB0eXBlOiAnaGlwZXInLFxuICAgIHBhdHRlcm5zOiBbXG4gICAgICA2MzcwOTUsXG4gICAgICA2Mzc1NjgsXG4gICAgICA2Mzc1OTksXG4gICAgICA2Mzc2MDksXG4gICAgICA2Mzc2MTJcbiAgICBdLFxuICAgIGdhcHM6IFs0LCA4LCAxMl0sXG4gICAgbGVuZ3RoczogWzE2XSxcbiAgICBjb2RlOiB7XG4gICAgICBuYW1lOiAnQ1ZDJyxcbiAgICAgIHNpemU6IDNcbiAgICB9XG4gIH0sXG4gIGhpcGVyY2FyZDoge1xuICAgIG5pY2VUeXBlOiAnSGlwZXJjYXJkJyxcbiAgICB0eXBlOiAnaGlwZXJjYXJkJyxcbiAgICBwYXR0ZXJuczogW1xuICAgICAgNjA2MjgyXG4gICAgXSxcbiAgICBnYXBzOiBbNCwgOCwgMTJdLFxuICAgIGxlbmd0aHM6IFsxNl0sXG4gICAgY29kZToge1xuICAgICAgbmFtZTogJ0NWQycsXG4gICAgICBzaXplOiAzXG4gICAgfVxuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNhcmRUeXBlcztcbiIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gY2xvbmUob3JpZ2luYWxPYmplY3QpIHtcbiAgdmFyIGR1cGU7XG5cbiAgaWYgKCFvcmlnaW5hbE9iamVjdCkgeyByZXR1cm4gbnVsbDsgfVxuXG4gIGR1cGUgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG9yaWdpbmFsT2JqZWN0KSk7XG5cbiAgcmV0dXJuIGR1cGU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmU7XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIGhhc0Vub3VnaFJlc3VsdHNUb0RldGVybWluZUJlc3RNYXRjaChyZXN1bHRzKSB7XG4gIHZhciBudW1iZXJPZlJlc3VsdHNXaXRoTWF4U3RyZW5ndGhQcm9wZXJ0eSA9IHJlc3VsdHMuZmlsdGVyKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICByZXR1cm4gcmVzdWx0Lm1hdGNoU3RyZW5ndGg7XG4gIH0pLmxlbmd0aDtcblxuICAvLyBpZiBhbGwgcG9zc2libGUgcmVzdWx0cyBoYXZlIGEgbWF4U3RyZW5ndGggcHJvcGVydHlcbiAgLy8gdGhhdCBtZWFucyB0aGUgY2FyZCBudW1iZXIgaXMgc3VmZmljaWVudGx5IGxvbmdcbiAgLy8gZW5vdWdoIHRvIGRldGVybWluZSBjb25jbHVzaXZlbHkgd2hhdCB0aGUgdHlwZSBpc1xuICByZXR1cm4gbnVtYmVyT2ZSZXN1bHRzV2l0aE1heFN0cmVuZ3RoUHJvcGVydHkgPiAwICYmXG4gICAgbnVtYmVyT2ZSZXN1bHRzV2l0aE1heFN0cmVuZ3RoUHJvcGVydHkgPT09IHJlc3VsdHMubGVuZ3RoO1xufVxuXG5mdW5jdGlvbiBmaW5kQmVzdE1hdGNoKHJlc3VsdHMpIHtcbiAgaWYgKCFoYXNFbm91Z2hSZXN1bHRzVG9EZXRlcm1pbmVCZXN0TWF0Y2gocmVzdWx0cykpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICByZXR1cm4gcmVzdWx0cy5yZWR1Y2UoZnVuY3Rpb24gKGJlc3RNYXRjaCwgcmVzdWx0KSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgY29uc2lzdGVudC1yZXR1cm5cbiAgICBpZiAoIWJlc3RNYXRjaCkge1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvLyBpZiB0aGUgY3VycmVudCBiZXN0IG1hdGNoIHBhdHRlcm4gaXMgbGVzcyBzcGVjaWZpY1xuICAgIC8vIHRoYW4gdGhpcyByZXN1bHQsIHNldCB0aGUgcmVzdWx0IGFzIHRoZSBuZXcgYmVzdCBtYXRjaFxuICAgIGlmIChiZXN0TWF0Y2gubWF0Y2hTdHJlbmd0aCA8IHJlc3VsdC5tYXRjaFN0cmVuZ3RoKSB7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHJldHVybiBiZXN0TWF0Y2g7XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZpbmRCZXN0TWF0Y2g7XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIGlzVmFsaWRJbnB1dFR5cGUoY2FyZE51bWJlcikge1xuICByZXR1cm4gdHlwZW9mIGNhcmROdW1iZXIgPT09ICdzdHJpbmcnIHx8IGNhcmROdW1iZXIgaW5zdGFuY2VvZiBTdHJpbmc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNWYWxpZElucHV0VHlwZTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gQWRhcHRlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9wb2x2by1sYWJzL2NhcmQtdHlwZS9ibG9iL2FhYWIxMWY4MGZhMTkzOWJjY2M4ZjI0OTA1YTA2YWUzY2Q4NjQzNTYvc3JjL2NhcmRUeXBlLmpzI0wzNy1MNDJcbmZ1bmN0aW9uIG1hdGNoZXNSYW5nZShjYXJkTnVtYmVyLCBtaW4sIG1heCkge1xuICB2YXIgbWF4TGVuZ3RoVG9DaGVjayA9IFN0cmluZyhtaW4pLmxlbmd0aDtcbiAgdmFyIHN1YnN0ciA9IGNhcmROdW1iZXIuc3Vic3RyKDAsIG1heExlbmd0aFRvQ2hlY2spO1xuICB2YXIgaW50ZWdlclJlcHJlc2VudGF0aW9uT2ZDYXJkTnVtYmVyID0gcGFyc2VJbnQoc3Vic3RyLCAxMCk7XG5cbiAgbWluID0gcGFyc2VJbnQoU3RyaW5nKG1pbikuc3Vic3RyKDAsIHN1YnN0ci5sZW5ndGgpLCAxMCk7XG4gIG1heCA9IHBhcnNlSW50KFN0cmluZyhtYXgpLnN1YnN0cigwLCBzdWJzdHIubGVuZ3RoKSwgMTApO1xuXG4gIHJldHVybiBpbnRlZ2VyUmVwcmVzZW50YXRpb25PZkNhcmROdW1iZXIgPj0gbWluICYmIGludGVnZXJSZXByZXNlbnRhdGlvbk9mQ2FyZE51bWJlciA8PSBtYXg7XG59XG5cbmZ1bmN0aW9uIG1hdGNoZXNQYXR0ZXJuKGNhcmROdW1iZXIsIHBhdHRlcm4pIHtcbiAgcGF0dGVybiA9IFN0cmluZyhwYXR0ZXJuKTtcblxuICByZXR1cm4gcGF0dGVybi5zdWJzdHJpbmcoMCwgY2FyZE51bWJlci5sZW5ndGgpID09PSBjYXJkTnVtYmVyLnN1YnN0cmluZygwLCBwYXR0ZXJuLmxlbmd0aCk7XG59XG5cbmZ1bmN0aW9uIG1hdGNoZXMoY2FyZE51bWJlciwgcGF0dGVybikge1xuICBpZiAoQXJyYXkuaXNBcnJheShwYXR0ZXJuKSkge1xuICAgIHJldHVybiBtYXRjaGVzUmFuZ2UoY2FyZE51bWJlciwgcGF0dGVyblswXSwgcGF0dGVyblsxXSk7XG4gIH1cblxuICByZXR1cm4gbWF0Y2hlc1BhdHRlcm4oY2FyZE51bWJlciwgcGF0dGVybik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWF0Y2hlcztcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHdpbiwgZnJhbWVidXM7XG52YXIgcG9wdXBzID0gW107XG52YXIgc3Vic2NyaWJlcnMgPSB7fTtcbnZhciBwcmVmaXggPSAnLypmcmFtZWJ1cyovJztcblxuZnVuY3Rpb24gaW5jbHVkZShwb3B1cCkge1xuICBpZiAocG9wdXAgPT0gbnVsbCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYgKHBvcHVwLldpbmRvdyA9PSBudWxsKSB7IHJldHVybiBmYWxzZTsgfVxuICBpZiAocG9wdXAuY29uc3RydWN0b3IgIT09IHBvcHVwLldpbmRvdykgeyByZXR1cm4gZmFsc2U7IH1cblxuICBwb3B1cHMucHVzaChwb3B1cCk7XG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiB0YXJnZXQob3JpZ2luKSB7XG4gIHZhciBrZXk7XG4gIHZhciB0YXJnZXRlZEZyYW1lYnVzID0ge307XG5cbiAgZm9yIChrZXkgaW4gZnJhbWVidXMpIHtcbiAgICBpZiAoIWZyYW1lYnVzLmhhc093blByb3BlcnR5KGtleSkpIHsgY29udGludWU7IH1cblxuICAgIHRhcmdldGVkRnJhbWVidXNba2V5XSA9IGZyYW1lYnVzW2tleV07XG4gIH1cblxuICB0YXJnZXRlZEZyYW1lYnVzLl9vcmlnaW4gPSBvcmlnaW4gfHwgJyonO1xuXG4gIHJldHVybiB0YXJnZXRlZEZyYW1lYnVzO1xufVxuXG5mdW5jdGlvbiBwdWJsaXNoKGV2ZW50KSB7XG4gIHZhciBwYXlsb2FkLCBhcmdzO1xuICB2YXIgb3JpZ2luID0gX2dldE9yaWdpbih0aGlzKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1pbnZhbGlkLXRoaXNcblxuICBpZiAoX2lzbnRTdHJpbmcoZXZlbnQpKSB7IHJldHVybiBmYWxzZTsgfVxuICBpZiAoX2lzbnRTdHJpbmcob3JpZ2luKSkgeyByZXR1cm4gZmFsc2U7IH1cblxuICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcblxuICBwYXlsb2FkID0gX3BhY2thZ2VQYXlsb2FkKGV2ZW50LCBhcmdzLCBvcmlnaW4pO1xuICBpZiAocGF5bG9hZCA9PT0gZmFsc2UpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgX2Jyb2FkY2FzdCh3aW4udG9wIHx8IHdpbi5zZWxmLCBwYXlsb2FkLCBvcmlnaW4pO1xuXG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBzdWJzY3JpYmUoZXZlbnQsIGZuKSB7XG4gIHZhciBvcmlnaW4gPSBfZ2V0T3JpZ2luKHRoaXMpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWludmFsaWQtdGhpc1xuXG4gIGlmIChfc3Vic2NyaXB0aW9uQXJnc0ludmFsaWQoZXZlbnQsIGZuLCBvcmlnaW4pKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIHN1YnNjcmliZXJzW29yaWdpbl0gPSBzdWJzY3JpYmVyc1tvcmlnaW5dIHx8IHt9O1xuICBzdWJzY3JpYmVyc1tvcmlnaW5dW2V2ZW50XSA9IHN1YnNjcmliZXJzW29yaWdpbl1bZXZlbnRdIHx8IFtdO1xuICBzdWJzY3JpYmVyc1tvcmlnaW5dW2V2ZW50XS5wdXNoKGZuKTtcblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gdW5zdWJzY3JpYmUoZXZlbnQsIGZuKSB7XG4gIHZhciBpLCBzdWJzY3JpYmVyTGlzdDtcbiAgdmFyIG9yaWdpbiA9IF9nZXRPcmlnaW4odGhpcyk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8taW52YWxpZC10aGlzXG5cbiAgaWYgKF9zdWJzY3JpcHRpb25BcmdzSW52YWxpZChldmVudCwgZm4sIG9yaWdpbikpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgc3Vic2NyaWJlckxpc3QgPSBzdWJzY3JpYmVyc1tvcmlnaW5dICYmIHN1YnNjcmliZXJzW29yaWdpbl1bZXZlbnRdO1xuICBpZiAoIXN1YnNjcmliZXJMaXN0KSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIGZvciAoaSA9IDA7IGkgPCBzdWJzY3JpYmVyTGlzdC5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdWJzY3JpYmVyTGlzdFtpXSA9PT0gZm4pIHtcbiAgICAgIHN1YnNjcmliZXJMaXN0LnNwbGljZShpLCAxKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gX2dldE9yaWdpbihzY29wZSkge1xuICByZXR1cm4gc2NvcGUgJiYgc2NvcGUuX29yaWdpbiB8fCAnKic7XG59XG5cbmZ1bmN0aW9uIF9pc250U3RyaW5nKHN0cmluZykge1xuICByZXR1cm4gdHlwZW9mIHN0cmluZyAhPT0gJ3N0cmluZyc7XG59XG5cbmZ1bmN0aW9uIF9wYWNrYWdlUGF5bG9hZChldmVudCwgYXJncywgb3JpZ2luKSB7XG4gIHZhciBwYWNrYWdlZCA9IGZhbHNlO1xuICB2YXIgcGF5bG9hZCA9IHtcbiAgICBldmVudDogZXZlbnQsXG4gICAgb3JpZ2luOiBvcmlnaW5cbiAgfTtcbiAgdmFyIHJlcGx5ID0gYXJnc1thcmdzLmxlbmd0aCAtIDFdO1xuXG4gIGlmICh0eXBlb2YgcmVwbHkgPT09ICdmdW5jdGlvbicpIHtcbiAgICBwYXlsb2FkLnJlcGx5ID0gX3N1YnNjcmliZVJlcGxpZXIocmVwbHksIG9yaWdpbik7XG4gICAgYXJncyA9IGFyZ3Muc2xpY2UoMCwgLTEpO1xuICB9XG5cbiAgcGF5bG9hZC5hcmdzID0gYXJncztcblxuICB0cnkge1xuICAgIHBhY2thZ2VkID0gcHJlZml4ICsgSlNPTi5zdHJpbmdpZnkocGF5bG9hZCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvdWxkIG5vdCBzdHJpbmdpZnkgZXZlbnQ6ICcgKyBlLm1lc3NhZ2UpO1xuICB9XG4gIHJldHVybiBwYWNrYWdlZDtcbn1cblxuZnVuY3Rpb24gX3VucGFja1BheWxvYWQoZSkge1xuICB2YXIgcGF5bG9hZCwgcmVwbHlPcmlnaW4sIHJlcGx5U291cmNlLCByZXBseUV2ZW50O1xuXG4gIGlmIChlLmRhdGEuc2xpY2UoMCwgcHJlZml4Lmxlbmd0aCkgIT09IHByZWZpeCkgeyByZXR1cm4gZmFsc2U7IH1cblxuICB0cnkge1xuICAgIHBheWxvYWQgPSBKU09OLnBhcnNlKGUuZGF0YS5zbGljZShwcmVmaXgubGVuZ3RoKSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChwYXlsb2FkLnJlcGx5ICE9IG51bGwpIHtcbiAgICByZXBseU9yaWdpbiA9IGUub3JpZ2luO1xuICAgIHJlcGx5U291cmNlID0gZS5zb3VyY2U7XG4gICAgcmVwbHlFdmVudCA9IHBheWxvYWQucmVwbHk7XG5cbiAgICBwYXlsb2FkLnJlcGx5ID0gZnVuY3Rpb24gcmVwbHkoZGF0YSkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGNvbnNpc3RlbnQtcmV0dXJuXG4gICAgICB2YXIgcmVwbHlQYXlsb2FkO1xuXG4gICAgICBpZiAoIXJlcGx5U291cmNlKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gICAgICByZXBseVBheWxvYWQgPSBfcGFja2FnZVBheWxvYWQocmVwbHlFdmVudCwgW2RhdGFdLCByZXBseU9yaWdpbik7XG5cbiAgICAgIGlmIChyZXBseVBheWxvYWQgPT09IGZhbHNlKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gICAgICByZXBseVNvdXJjZS5wb3N0TWVzc2FnZShyZXBseVBheWxvYWQsIHJlcGx5T3JpZ2luKTtcbiAgICB9O1xuXG4gICAgcGF5bG9hZC5hcmdzLnB1c2gocGF5bG9hZC5yZXBseSk7XG4gIH1cblxuICByZXR1cm4gcGF5bG9hZDtcbn1cblxuZnVuY3Rpb24gX2F0dGFjaCh3KSB7XG4gIGlmICh3aW4pIHsgcmV0dXJuOyB9XG4gIHdpbiA9IHcgfHwgZ2xvYmFsO1xuXG4gIGlmICh3aW4uYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgIHdpbi5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgX29ubWVzc2FnZSwgZmFsc2UpO1xuICB9IGVsc2UgaWYgKHdpbi5hdHRhY2hFdmVudCkge1xuICAgIHdpbi5hdHRhY2hFdmVudCgnb25tZXNzYWdlJywgX29ubWVzc2FnZSk7XG4gIH0gZWxzZSBpZiAod2luLm9ubWVzc2FnZSA9PT0gbnVsbCkge1xuICAgIHdpbi5vbm1lc3NhZ2UgPSBfb25tZXNzYWdlO1xuICB9IGVsc2Uge1xuICAgIHdpbiA9IG51bGw7XG4gIH1cbn1cblxuLy8gcmVtb3ZlSWYocHJvZHVjdGlvbilcbmZ1bmN0aW9uIF9kZXRhY2goKSB7XG4gIGlmICh3aW4gPT0gbnVsbCkgeyByZXR1cm47IH1cblxuICBpZiAod2luLnJlbW92ZUV2ZW50TGlzdGVuZXIpIHtcbiAgICB3aW4ucmVtb3ZlRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIF9vbm1lc3NhZ2UsIGZhbHNlKTtcbiAgfSBlbHNlIGlmICh3aW4uZGV0YWNoRXZlbnQpIHtcbiAgICB3aW4uZGV0YWNoRXZlbnQoJ29ubWVzc2FnZScsIF9vbm1lc3NhZ2UpO1xuICB9IGVsc2UgaWYgKHdpbi5vbm1lc3NhZ2UgPT09IF9vbm1lc3NhZ2UpIHtcbiAgICB3aW4ub25tZXNzYWdlID0gbnVsbDtcbiAgfVxuXG4gIHdpbiA9IG51bGw7XG4gIHBvcHVwcyA9IFtdO1xuICBzdWJzY3JpYmVycyA9IHt9O1xufVxuLy8gZW5kUmVtb3ZlSWYocHJvZHVjdGlvbilcblxuZnVuY3Rpb24gX3V1aWQoKSB7XG4gIHJldHVybiAneHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4Jy5yZXBsYWNlKC9beHldL2csIGZ1bmN0aW9uIChjKSB7XG4gICAgdmFyIHIgPSBNYXRoLnJhbmRvbSgpICogMTYgfCAwO1xuICAgIHZhciB2ID0gYyA9PT0gJ3gnID8gciA6IHIgJiAweDMgfCAweDg7XG5cbiAgICByZXR1cm4gdi50b1N0cmluZygxNik7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBfb25tZXNzYWdlKGUpIHtcbiAgdmFyIHBheWxvYWQ7XG5cbiAgaWYgKF9pc250U3RyaW5nKGUuZGF0YSkpIHsgcmV0dXJuOyB9XG5cbiAgcGF5bG9hZCA9IF91bnBhY2tQYXlsb2FkKGUpO1xuICBpZiAoIXBheWxvYWQpIHsgcmV0dXJuOyB9XG5cbiAgX2Rpc3BhdGNoKCcqJywgcGF5bG9hZC5ldmVudCwgcGF5bG9hZC5hcmdzLCBlKTtcbiAgX2Rpc3BhdGNoKGUub3JpZ2luLCBwYXlsb2FkLmV2ZW50LCBwYXlsb2FkLmFyZ3MsIGUpO1xuICBfYnJvYWRjYXN0UG9wdXBzKGUuZGF0YSwgcGF5bG9hZC5vcmlnaW4sIGUuc291cmNlKTtcbn1cblxuZnVuY3Rpb24gX2Rpc3BhdGNoKG9yaWdpbiwgZXZlbnQsIGFyZ3MsIGUpIHtcbiAgdmFyIGk7XG5cbiAgaWYgKCFzdWJzY3JpYmVyc1tvcmlnaW5dKSB7IHJldHVybjsgfVxuICBpZiAoIXN1YnNjcmliZXJzW29yaWdpbl1bZXZlbnRdKSB7IHJldHVybjsgfVxuXG4gIGZvciAoaSA9IDA7IGkgPCBzdWJzY3JpYmVyc1tvcmlnaW5dW2V2ZW50XS5sZW5ndGg7IGkrKykge1xuICAgIHN1YnNjcmliZXJzW29yaWdpbl1bZXZlbnRdW2ldLmFwcGx5KGUsIGFyZ3MpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9oYXNPcGVuZXIoZnJhbWUpIHtcbiAgaWYgKGZyYW1lLnRvcCAhPT0gZnJhbWUpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIGlmIChmcmFtZS5vcGVuZXIgPT0gbnVsbCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYgKGZyYW1lLm9wZW5lciA9PT0gZnJhbWUpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIGlmIChmcmFtZS5vcGVuZXIuY2xvc2VkID09PSB0cnVlKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBfYnJvYWRjYXN0KGZyYW1lLCBwYXlsb2FkLCBvcmlnaW4pIHtcbiAgdmFyIGkgPSAwO1xuICB2YXIgZnJhbWVUb0Jyb2FkY2FzdFRvO1xuXG4gIHRyeSB7XG4gICAgZnJhbWUucG9zdE1lc3NhZ2UocGF5bG9hZCwgb3JpZ2luKTtcblxuICAgIGlmIChfaGFzT3BlbmVyKGZyYW1lKSkge1xuICAgICAgX2Jyb2FkY2FzdChmcmFtZS5vcGVuZXIudG9wLCBwYXlsb2FkLCBvcmlnaW4pO1xuICAgIH1cblxuICAgIC8vIHByZXZpb3VzbHksIG91ciBtYXggdmFsdWUgd2FzIGZyYW1lLmZyYW1lcy5sZW5ndGhcbiAgICAvLyBidXQgZnJhbWVzLmxlbmd0aCBpbmhlcml0cyBmcm9tIHdpbmRvdy5sZW5ndGhcbiAgICAvLyB3aGljaCBjYW4gYmUgb3ZlcndyaXR0ZW4gaWYgYSBkZXZlbG9wZXIgZG9lc1xuICAgIC8vIGB2YXIgbGVuZ3RoID0gdmFsdWU7YCBvdXRzaWRlIG9mIGEgZnVuY3Rpb25cbiAgICAvLyBzY29wZSwgaXQnbGwgcHJldmVudCB1cyBmcm9tIGxvb3BpbmcgdGhyb3VnaFxuICAgIC8vIGFsbCB0aGUgZnJhbWVzLiBXaXRoIHRoaXMsIHdlIGxvb3AgdGhyb3VnaFxuICAgIC8vIHVudGlsIHRoZXJlIGFyZSBubyBsb25nZXIgYW55IGZyYW1lc1xuICAgIHdoaWxlIChmcmFtZVRvQnJvYWRjYXN0VG8gPSBmcmFtZS5mcmFtZXNbaV0pIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25kLWFzc2lnblxuICAgICAgX2Jyb2FkY2FzdChmcmFtZVRvQnJvYWRjYXN0VG8sIHBheWxvYWQsIG9yaWdpbik7XG4gICAgICBpKys7XG4gICAgfVxuICB9IGNhdGNoIChfKSB7IC8qIGlnbm9yZWQgKi8gfVxufVxuXG5mdW5jdGlvbiBfYnJvYWRjYXN0UG9wdXBzKHBheWxvYWQsIG9yaWdpbiwgc291cmNlKSB7XG4gIHZhciBpLCBwb3B1cDtcblxuICBmb3IgKGkgPSBwb3B1cHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBwb3B1cCA9IHBvcHVwc1tpXTtcblxuICAgIGlmIChwb3B1cC5jbG9zZWQgPT09IHRydWUpIHtcbiAgICAgIHBvcHVwcyA9IHBvcHVwcy5zbGljZShpLCAxKTtcbiAgICB9IGVsc2UgaWYgKHNvdXJjZSAhPT0gcG9wdXApIHtcbiAgICAgIF9icm9hZGNhc3QocG9wdXAudG9wLCBwYXlsb2FkLCBvcmlnaW4pO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBfc3Vic2NyaWJlUmVwbGllcihmbiwgb3JpZ2luKSB7XG4gIHZhciB1dWlkID0gX3V1aWQoKTtcblxuICBmdW5jdGlvbiByZXBsaWVyKGQsIG8pIHtcbiAgICBmbihkLCBvKTtcbiAgICBmcmFtZWJ1cy50YXJnZXQob3JpZ2luKS51bnN1YnNjcmliZSh1dWlkLCByZXBsaWVyKTtcbiAgfVxuXG4gIGZyYW1lYnVzLnRhcmdldChvcmlnaW4pLnN1YnNjcmliZSh1dWlkLCByZXBsaWVyKTtcbiAgcmV0dXJuIHV1aWQ7XG59XG5cbmZ1bmN0aW9uIF9zdWJzY3JpcHRpb25BcmdzSW52YWxpZChldmVudCwgZm4sIG9yaWdpbikge1xuICBpZiAoX2lzbnRTdHJpbmcoZXZlbnQpKSB7IHJldHVybiB0cnVlOyB9XG4gIGlmICh0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicpIHsgcmV0dXJuIHRydWU7IH1cbiAgaWYgKF9pc250U3RyaW5nKG9yaWdpbikpIHsgcmV0dXJuIHRydWU7IH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbl9hdHRhY2goKTtcblxuZnJhbWVidXMgPSB7XG4gIHRhcmdldDogdGFyZ2V0LFxuICAvLyByZW1vdmVJZihwcm9kdWN0aW9uKVxuICBfcGFja2FnZVBheWxvYWQ6IF9wYWNrYWdlUGF5bG9hZCxcbiAgX3VucGFja1BheWxvYWQ6IF91bnBhY2tQYXlsb2FkLFxuICBfYXR0YWNoOiBfYXR0YWNoLFxuICBfZGV0YWNoOiBfZGV0YWNoLFxuICBfZGlzcGF0Y2g6IF9kaXNwYXRjaCxcbiAgX2Jyb2FkY2FzdDogX2Jyb2FkY2FzdCxcbiAgX3N1YnNjcmliZVJlcGxpZXI6IF9zdWJzY3JpYmVSZXBsaWVyLFxuICBfc3Vic2NyaXB0aW9uQXJnc0ludmFsaWQ6IF9zdWJzY3JpcHRpb25BcmdzSW52YWxpZCxcbiAgX29ubWVzc2FnZTogX29ubWVzc2FnZSxcbiAgX3V1aWQ6IF91dWlkLFxuICBfZ2V0U3Vic2NyaWJlcnM6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHN1YnNjcmliZXJzOyB9LFxuICBfd2luOiBmdW5jdGlvbiAoKSB7IHJldHVybiB3aW47IH0sXG4gIC8vIGVuZFJlbW92ZUlmKHByb2R1Y3Rpb24pXG4gIGluY2x1ZGU6IGluY2x1ZGUsXG4gIHB1Ymxpc2g6IHB1Ymxpc2gsXG4gIHB1YjogcHVibGlzaCxcbiAgdHJpZ2dlcjogcHVibGlzaCxcbiAgZW1pdDogcHVibGlzaCxcbiAgc3Vic2NyaWJlOiBzdWJzY3JpYmUsXG4gIHN1Yjogc3Vic2NyaWJlLFxuICBvbjogc3Vic2NyaWJlLFxuICB1bnN1YnNjcmliZTogdW5zdWJzY3JpYmUsXG4gIHVuc3ViOiB1bnN1YnNjcmliZSxcbiAgb2ZmOiB1bnN1YnNjcmliZVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmcmFtZWJ1cztcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5pbmplY3RXaXRoQmxvY2tsaXN0ID0gZXhwb3J0cy5pbmplY3RXaXRoQWxsb3dsaXN0ID0gdm9pZCAwO1xudmFyIGluamVjdF9zdHlsZXNoZWV0XzEgPSByZXF1aXJlKFwiLi9saWIvaW5qZWN0LXN0eWxlc2hlZXRcIik7XG5mdW5jdGlvbiBpbmplY3RXaXRoQWxsb3dsaXN0KHN0eWxlcywgbGlzdCkge1xuICAgIHJldHVybiBpbmplY3Rfc3R5bGVzaGVldF8xLmluamVjdFN0eWxlc2hlZXQoc3R5bGVzLCBsaXN0LCB0cnVlKTtcbn1cbmV4cG9ydHMuaW5qZWN0V2l0aEFsbG93bGlzdCA9IGluamVjdFdpdGhBbGxvd2xpc3Q7XG5mdW5jdGlvbiBpbmplY3RXaXRoQmxvY2tsaXN0KHN0eWxlcywgbGlzdCkge1xuICAgIHJldHVybiBpbmplY3Rfc3R5bGVzaGVldF8xLmluamVjdFN0eWxlc2hlZXQoc3R5bGVzLCBsaXN0LCBmYWxzZSk7XG59XG5leHBvcnRzLmluamVjdFdpdGhCbG9ja2xpc3QgPSBpbmplY3RXaXRoQmxvY2tsaXN0O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmZpbHRlclN0eWxlS2V5cyA9IHZvaWQgMDtcbmZ1bmN0aW9uIGZpbHRlclN0eWxlS2V5cyhzdHlsZU9iamVjdCwgcHJvcGVydHlMaXN0LCBpc0FsbG93bGlzdCkge1xuICAgIGlmIChwcm9wZXJ0eUxpc3QgPT09IHZvaWQgMCkgeyBwcm9wZXJ0eUxpc3QgPSBbXTsgfVxuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICBmdW5jdGlvbiBhbGxvd2xpc3RGaWx0ZXIoa2V5KSB7XG4gICAgICAgIGlmIChwcm9wZXJ0eUxpc3QuaW5kZXhPZihrZXkpICE9PSAtMSkge1xuICAgICAgICAgICAgcmVzdWx0W2tleV0gPSBzdHlsZU9iamVjdFtrZXldO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGJsb2NrbGlzdEZpbHRlcihrZXkpIHtcbiAgICAgICAgaWYgKHByb3BlcnR5TGlzdC5pbmRleE9mKGtleSkgPT09IC0xKSB7XG4gICAgICAgICAgICByZXN1bHRba2V5XSA9IHN0eWxlT2JqZWN0W2tleV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGlzQWxsb3dsaXN0KSB7XG4gICAgICAgIE9iamVjdC5rZXlzKHN0eWxlT2JqZWN0KS5mb3JFYWNoKGFsbG93bGlzdEZpbHRlcik7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBPYmplY3Qua2V5cyhzdHlsZU9iamVjdCkuZm9yRWFjaChibG9ja2xpc3RGaWx0ZXIpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuZXhwb3J0cy5maWx0ZXJTdHlsZUtleXMgPSBmaWx0ZXJTdHlsZUtleXM7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZmlsdGVyU3R5bGVWYWx1ZXMgPSB2b2lkIDA7XG52YXIgdmFsdWVGaWx0ZXJzID0gWy87LywgL0BpbXBvcnQvaSwgL2V4cHJlc3Npb24vaSwgL3VybC9pLCAvamF2YXNjcmlwdC9pXTtcbmZ1bmN0aW9uIGh0bWxFc2NhcGUoaHRtbCkge1xuICAgIHJldHVybiBTdHJpbmcoaHRtbClcbiAgICAgICAgLnJlcGxhY2UoLyYvZywgXCImYW1wO1wiKVxuICAgICAgICAucmVwbGFjZSgvPC9nLCBcIiZsdDtcIilcbiAgICAgICAgLnJlcGxhY2UoLz4vZywgXCImZ3Q7XCIpO1xufVxuZnVuY3Rpb24gZmlsdGVyU3R5bGVWYWx1ZXMoZGlydHkpIHtcbiAgICBpZiAoZGlydHkgPT09IHZvaWQgMCkgeyBkaXJ0eSA9IHt9OyB9XG4gICAgdmFyIGNsZWFuID0ge307XG4gICAgT2JqZWN0LmtleXMoZGlydHkpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICB2YXIgdmFsdWUgPSBkaXJ0eVtrZXldO1xuICAgICAgICB2YXIgdW5zYW5pdGFyeSA9IHZhbHVlRmlsdGVycy5zb21lKGZ1bmN0aW9uIChyZWdleCkgeyByZXR1cm4gcmVnZXgudGVzdChTdHJpbmcodmFsdWUpKTsgfSk7XG4gICAgICAgIGlmICh1bnNhbml0YXJ5KVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBjbGVhbltrZXldID0gaHRtbEVzY2FwZShkaXJ0eVtrZXldKTtcbiAgICB9KTtcbiAgICByZXR1cm4gY2xlYW47XG59XG5leHBvcnRzLmZpbHRlclN0eWxlVmFsdWVzID0gZmlsdGVyU3R5bGVWYWx1ZXM7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuaW5qZWN0U3R5bGVzaGVldCA9IHZvaWQgMDtcbnZhciB2YWxpZGF0ZV9zZWxlY3Rvcl8xID0gcmVxdWlyZShcIi4vdmFsaWRhdGUtc2VsZWN0b3JcIik7XG52YXIgZmlsdGVyX3N0eWxlX2tleXNfMSA9IHJlcXVpcmUoXCIuL2ZpbHRlci1zdHlsZS1rZXlzXCIpO1xudmFyIGZpbHRlcl9zdHlsZV92YWx1ZXNfMSA9IHJlcXVpcmUoXCIuL2ZpbHRlci1zdHlsZS12YWx1ZXNcIik7XG5mdW5jdGlvbiBpc1NlbGVjdG9yTWVkaWFRdWVyeShzZWxlY3Rvcikge1xuICAgIHJldHVybiAvXkBtZWRpYVxccysvaS50ZXN0KHNlbGVjdG9yKTtcbn1cbmZ1bmN0aW9uIGJ1aWxkUnVsZShzZWxlY3Rvciwgc3R5bGVzLCBjdXJyaWVkS2V5c0ZpbHRlcikge1xuICAgIGlmIChzdHlsZXMgPT09IHZvaWQgMCkgeyBzdHlsZXMgPSB7fTsgfVxuICAgIHZhciByZXN1bHQ7XG4gICAgdmFyIGNvbnN0cnVjdGVkUnVsZSA9IHNlbGVjdG9yICsgXCJ7XCI7XG4gICAgaWYgKGlzU2VsZWN0b3JNZWRpYVF1ZXJ5KHNlbGVjdG9yKSkge1xuICAgICAgICBPYmplY3Qua2V5cyhzdHlsZXMpLmZvckVhY2goZnVuY3Rpb24gKGlubmVyU2VsZWN0b3IpIHtcbiAgICAgICAgICAgIGlmICghdmFsaWRhdGVfc2VsZWN0b3JfMS52YWxpZGF0ZVNlbGVjdG9yKGlubmVyU2VsZWN0b3IpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3RydWN0ZWRSdWxlICs9IGJ1aWxkUnVsZShpbm5lclNlbGVjdG9yLCBzdHlsZXNbaW5uZXJTZWxlY3Rvcl0sIGN1cnJpZWRLZXlzRmlsdGVyKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXN1bHQgPSBjdXJyaWVkS2V5c0ZpbHRlcihzdHlsZXMpO1xuICAgICAgICB2YXIgc2FuaXRpemVkXzEgPSBmaWx0ZXJfc3R5bGVfdmFsdWVzXzEuZmlsdGVyU3R5bGVWYWx1ZXMocmVzdWx0KTtcbiAgICAgICAgT2JqZWN0LmtleXMoc2FuaXRpemVkXzEpLmZvckVhY2goZnVuY3Rpb24gKHJ1bGUpIHtcbiAgICAgICAgICAgIGNvbnN0cnVjdGVkUnVsZSArPSBydWxlICsgXCI6XCIgKyBzYW5pdGl6ZWRfMVtydWxlXSArIFwiO1wiO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgY29uc3RydWN0ZWRSdWxlICs9IFwifVwiO1xuICAgIHJldHVybiBjb25zdHJ1Y3RlZFJ1bGU7XG59XG5mdW5jdGlvbiBpbmplY3RTdHlsZXNoZWV0KHN0eWxlcywgcHJvcGVydHlMaXN0LCBpc0FsbG93bGlzdCkge1xuICAgIGlmIChzdHlsZXMgPT09IHZvaWQgMCkgeyBzdHlsZXMgPSB7fTsgfVxuICAgIGlmIChwcm9wZXJ0eUxpc3QgPT09IHZvaWQgMCkgeyBwcm9wZXJ0eUxpc3QgPSBbXTsgfVxuICAgIHZhciBwb3NpdGlvbiA9IDA7XG4gICAgdmFyIHN0eWxlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiaGVhZFwiKS5hcHBlbmRDaGlsZChzdHlsZUVsZW1lbnQpO1xuICAgIHZhciBzdHlsZXNoZWV0ID0gc3R5bGVFbGVtZW50LnNoZWV0O1xuICAgIGZ1bmN0aW9uIGN1cnJpZWRLZXlzRmlsdGVyKHN0eWxlT2JqZWN0KSB7XG4gICAgICAgIHJldHVybiBmaWx0ZXJfc3R5bGVfa2V5c18xLmZpbHRlclN0eWxlS2V5cyhzdHlsZU9iamVjdCwgcHJvcGVydHlMaXN0LCBpc0FsbG93bGlzdCk7XG4gICAgfVxuICAgIE9iamVjdC5rZXlzKHN0eWxlcykuZm9yRWFjaChmdW5jdGlvbiAoc2VsZWN0b3IpIHtcbiAgICAgICAgaWYgKCF2YWxpZGF0ZV9zZWxlY3Rvcl8xLnZhbGlkYXRlU2VsZWN0b3Ioc2VsZWN0b3IpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNvbnN0cnVjdGVkUnVsZSA9IGJ1aWxkUnVsZShzZWxlY3Rvciwgc3R5bGVzW3NlbGVjdG9yXSwgY3VycmllZEtleXNGaWx0ZXIpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKHN0eWxlc2hlZXQuaW5zZXJ0UnVsZSkge1xuICAgICAgICAgICAgICAgIHN0eWxlc2hlZXQuaW5zZXJ0UnVsZShjb25zdHJ1Y3RlZFJ1bGUsIHBvc2l0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHN0eWxlc2hlZXQuYWRkUnVsZShzZWxlY3RvciwgY29uc3RydWN0ZWRSdWxlLnJlcGxhY2UoL15bXntdKy8sIFwiXCIpLnJlcGxhY2UoL1t7fV0vZywgXCJcIiksIHBvc2l0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBvc2l0aW9uKys7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgaWYgKCEoZXJyIGluc3RhbmNlb2YgU3ludGF4RXJyb3IgfHwgZXJyIGluc3RhbmNlb2YgRE9NRXhjZXB0aW9uKSkge1xuICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBzdHlsZUVsZW1lbnQ7XG59XG5leHBvcnRzLmluamVjdFN0eWxlc2hlZXQgPSBpbmplY3RTdHlsZXNoZWV0O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnZhbGlkYXRlU2VsZWN0b3IgPSB2b2lkIDA7XG5mdW5jdGlvbiB2YWxpZGF0ZVNlbGVjdG9yKHNlbGVjdG9yKSB7XG4gICAgaWYgKHNlbGVjdG9yLnRyaW0oKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoL3N1cHBvcnRzL2kudGVzdChzZWxlY3RvcikpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoL2ltcG9ydC9pLnRlc3Qoc2VsZWN0b3IpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKC9be31dLy50ZXN0KHNlbGVjdG9yKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiAhLzwvLnRlc3Qoc2VsZWN0b3IpO1xufVxuZXhwb3J0cy52YWxpZGF0ZVNlbGVjdG9yID0gdmFsaWRhdGVTZWxlY3RvcjtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFNlYW1sZXNzcGF5RXJyb3IgPSByZXF1aXJlKCcuLi8uLi9saWIvc2VhbWxlc3NwYXktZXJyb3InKTtcbnZhciBlcnJvcnMgPSByZXF1aXJlKCcuLi9zaGFyZWQvZXJyb3JzJyk7XG52YXIgd2hpdGVsaXN0ID0gcmVxdWlyZSgnLi4vc2hhcmVkL2NvbnN0YW50cycpLndoaXRlbGlzdGVkQXR0cmlidXRlcztcblxuZnVuY3Rpb24gYXR0cmlidXRlVmFsaWRhdGlvbkVycm9yKGF0dHJpYnV0ZSwgdmFsdWUpIHtcbiAgdmFyIGVycjtcblxuICBpZiAoIXdoaXRlbGlzdC5oYXNPd25Qcm9wZXJ0eShhdHRyaWJ1dGUpKSB7XG4gICAgZXJyID0gbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgdHlwZTogZXJyb3JzLkNBUkRfRUxFTUVOVF9BVFRSSUJVVEVfTk9UX1NVUFBPUlRFRC50eXBlLFxuICAgICAgY29kZTogZXJyb3JzLkNBUkRfRUxFTUVOVF9BVFRSSUJVVEVfTk9UX1NVUFBPUlRFRC5jb2RlLFxuICAgICAgbWVzc2FnZTogJ1RoZSBcIicgKyBhdHRyaWJ1dGUgKyAnXCIgYXR0cmlidXRlIGlzIG5vdCBzdXBwb3J0ZWQgaW4gQ2FyZCBFbGVtZW50LidcbiAgICB9KTtcbiAgfSBlbHNlIGlmICh2YWx1ZSAhPSBudWxsICYmICFfaXNWYWxpZChhdHRyaWJ1dGUsIHZhbHVlKSkge1xuICAgIGVyciA9IG5ldyBTZWFtbGVzc3BheUVycm9yKHtcbiAgICAgIHR5cGU6IGVycm9ycy5DQVJEX0VMRU1FTlRfQVRUUklCVVRFX1ZBTFVFX05PVF9BTExPV0VELnR5cGUsXG4gICAgICBjb2RlOiBlcnJvcnMuQ0FSRF9FTEVNRU5UX0FUVFJJQlVURV9WQUxVRV9OT1RfQUxMT1dFRC5jb2RlLFxuICAgICAgbWVzc2FnZTogJ1ZhbHVlIFwiJyArIHZhbHVlICsgJ1wiIGlzIG5vdCBhbGxvd2VkIGZvciBcIicgKyBhdHRyaWJ1dGUgKyAnXCIgYXR0cmlidXRlLidcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBlcnI7XG59XG5cbmZ1bmN0aW9uIF9pc1ZhbGlkKGF0dHJpYnV0ZSwgdmFsdWUpIHtcbiAgaWYgKHdoaXRlbGlzdFthdHRyaWJ1dGVdID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcic7XG4gIH0gZWxzZSBpZiAod2hpdGVsaXN0W2F0dHJpYnV0ZV0gPT09ICdib29sZWFuJykge1xuICAgIHJldHVybiBTdHJpbmcodmFsdWUpID09PSAndHJ1ZScgfHwgU3RyaW5nKHZhbHVlKSA9PT0gJ2ZhbHNlJztcbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhdHRyaWJ1dGVWYWxpZGF0aW9uRXJyb3I7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBCYXNlSW5wdXQgPSByZXF1aXJlKCcuL2Jhc2UtaW5wdXQnKS5CYXNlSW5wdXQ7XG52YXIgbWFrZUZha2VJbnB1dCA9IHJlcXVpcmUoJy4uL2hlbHBlcnMnKS5tYWtlRmFrZUlucHV0O1xuXG52YXIgUEFUVEVSTl9DQUNIRSA9IHt9O1xuXG5mdW5jdGlvbiBfZ2VuZXJhdGVQYXR0ZXJuKGNhcmQpIHtcbiAgdmFyIGksIHBhdHRlcm47XG4gIHZhciBnYXBzID0gWzQsIDgsIDEyXTtcbiAgdmFyIGxlbmd0aCA9IDE2O1xuICB2YXIgdHlwZSA9ICd1bmtub3duJztcblxuICBpZiAoY2FyZCkge1xuICAgIGxlbmd0aCA9IE1hdGgubWF4LmFwcGx5KG51bGwsIGNhcmQubGVuZ3Rocyk7XG4gICAgZ2FwcyA9IGNhcmQuZ2FwcztcbiAgICB0eXBlID0gY2FyZC50eXBlO1xuICB9XG5cbiAgaWYgKHR5cGUgaW4gUEFUVEVSTl9DQUNIRSkge1xuICAgIHJldHVybiBQQVRURVJOX0NBQ0hFW3R5cGVdO1xuICB9XG5cbiAgcGF0dGVybiA9ICd7eyc7XG5cbiAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGdhcHMuaW5kZXhPZihpKSAhPT0gLTEpIHtcbiAgICAgIHBhdHRlcm4gKz0gJ319IHt7JztcbiAgICB9XG5cbiAgICBwYXR0ZXJuICs9ICc5JztcbiAgfVxuXG4gIFBBVFRFUk5fQ0FDSEVbdHlwZV0gPSBwYXR0ZXJuICsgJ319JztcblxuICByZXR1cm4gUEFUVEVSTl9DQUNIRVt0eXBlXTtcbn1cblxuZnVuY3Rpb24gQWNjb3VudE51bWJlcklucHV0KCkge1xuICB0aGlzLnBsYWNlaG9sZGVyID0gJ0NhcmQgbnVtYmVyJztcblxuICBCYXNlSW5wdXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICB2YXIgREVGQVVMVF9NQVhfTEVOR1RIID0gdGhpcy5tYXhMZW5ndGg7XG5cbiAgdGhpcy5zZXRQYXR0ZXJuKF9nZW5lcmF0ZVBhdHRlcm4oJycpKTtcblxuICB0aGlzLm1vZGVsLm9uKCdjaGFuZ2U6cG9zc2libGVDYXJkVHlwZXMnLCBmdW5jdGlvbiAocG9zc2libGVDYXJkVHlwZXMpIHtcbiAgICB2YXIgY2FyZDtcbiAgICB2YXIgbWF4TGVuZ3RoID0gREVGQVVMVF9NQVhfTEVOR1RIO1xuXG4gICAgaWYgKHBvc3NpYmxlQ2FyZFR5cGVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgY2FyZCA9IHBvc3NpYmxlQ2FyZFR5cGVzWzBdO1xuICAgICAgbWF4TGVuZ3RoID0gTWF0aC5tYXguYXBwbHkobnVsbCwgY2FyZC5sZW5ndGhzKSArIGNhcmQuZ2Fwcy5sZW5ndGg7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRQYXR0ZXJuKF9nZW5lcmF0ZVBhdHRlcm4oY2FyZCkpO1xuICAgIHRoaXMudXBkYXRlTW9kZWwoJ3ZhbHVlJywgdGhpcy5mb3JtYXR0ZXIuZ2V0VW5mb3JtYXR0ZWRWYWx1ZSgpKTtcbiAgICB0aGlzLm1heExlbmd0aCA9IG1heExlbmd0aDtcblxuICAgIHRoaXMucmVuZGVyKCk7XG4gIH0uYmluZCh0aGlzKSk7XG5cbiAgdGhpcy5tb2RlbC5vbignY2hhbmdlOmFjY291bnROdW1iZXIudmFsdWUnLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLmZha2VDYXJkTnVtYmVyRWxlbWVudCkgcmV0dXJuO1xuXG4gICAgdmFyIHZhbHVlID0gdGhpcy5lbGVtZW50LnZhbHVlO1xuICAgIHZhciBmYWtlTGFzdDRFbGVtZW50ID0gdGhpcy5mYWtlQ2FyZE51bWJlckVsZW1lbnQucXVlcnlTZWxlY3Rvcignc3BhbltjbGFzcyo9XCItZmFrZU51bWJlci1sYXN0NFwiXScpO1xuICAgIHZhciBmYWtlTnVtYmVyRWxlbWVudCA9IHRoaXMuZmFrZUNhcmROdW1iZXJFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ3NwYW5bY2xhc3MqPVwiLWZha2VOdW1iZXItbnVtYmVyXCJdJyk7XG4gICAgdmFyIGxhc3Q0ID0gdmFsdWUuc3BsaXQoJyAnKS5maWx0ZXIoZnVuY3Rpb24oaXRlbSkgeyByZXR1cm4gQm9vbGVhbihpdGVtKTsgfSkucG9wKCk7XG4gICAgaWYgKGxhc3Q0KSB7XG4gICAgICBmYWtlTGFzdDRFbGVtZW50LmlubmVySFRNTCA9IGxhc3Q0O1xuICAgIH0gZWxzZSB7XG4gICAgICBmYWtlTGFzdDRFbGVtZW50LmlubmVySFRNTCA9ICcnO1xuICAgICAgZmFrZUxhc3Q0RWxlbWVudC5hcHBlbmRDaGlsZChtYWtlRmFrZUlucHV0KCkpO1xuICAgIH1cbiAgICBmYWtlTnVtYmVyRWxlbWVudC5pbm5lckhUTUwgPSB2YWx1ZSB8fCAnTnVtYmVyJztcbiAgfS5iaW5kKHRoaXMpKTtcbn1cblxuQWNjb3VudE51bWJlcklucHV0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQmFzZUlucHV0LnByb3RvdHlwZSk7XG5BY2NvdW50TnVtYmVySW5wdXQucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQWNjb3VudE51bWJlcklucHV0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgQWNjb3VudE51bWJlcklucHV0OiBBY2NvdW50TnVtYmVySW5wdXRcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBhdHRyaWJ1dGVWYWxpZGF0aW9uRXJyb3IgPSByZXF1aXJlKCcuLi8uLi9leHRlcm5hbC9hdHRyaWJ1dGUtdmFsaWRhdGlvbi1lcnJvcicpO1xudmFyIGNvbnN0YW50cyA9IHJlcXVpcmUoJy4uLy4uL3NoYXJlZC9jb25zdGFudHMnKTtcbnZhciBjbGFzc2xpc3QgPSByZXF1aXJlKCcuLi8uLi8uLi9saWIvY2xhc3NsaXN0Jyk7XG52YXIgY3JlYXRlUmVzdHJpY3RlZElucHV0ID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliL2NyZWF0ZS1yZXN0cmljdGVkLWlucHV0Jyk7XG52YXIgaGVscGVycyA9IHJlcXVpcmUoJy4uL2hlbHBlcnMnKTtcblxudmFyIGFkanVzdFRyYW5zZm9ybWF0aW9uID0gaGVscGVycy5hZGp1c3RUcmFuc2Zvcm1hdGlvbjtcbnZhciBldmVudHMgPSBjb25zdGFudHMuZXZlbnRzO1xudmFyIHdoaXRlbGlzdGVkRmllbGRzID0gY29uc3RhbnRzLndoaXRlbGlzdGVkRmllbGRzO1xudmFyIEVOVEVSX0tFWV9DT0RFID0gMTM7XG52YXIgREVGQVVMVF9NQVNLX0NIQVJBQ1RFUiA9ICfigKInO1xuXG5mdW5jdGlvbiBCYXNlSW5wdXQob3B0aW9ucykge1xuICB2YXIgc2hvdWxkRm9ybWF0O1xuXG4gIHRoaXMubW9kZWwgPSBvcHRpb25zLm1vZGVsO1xuICB0aGlzLnR5cGUgPSBvcHRpb25zLnR5cGU7XG4gIHRoaXMubWF4TGVuZ3RoID0gIXRoaXMubWF4TGVuZ3RoID8gdGhpcy5tb2RlbC5nZXRNYXhMZW5ndGgodGhpcy50eXBlKSA6IHRoaXMubWF4TGVuZ3RoO1xuXG4gIHRoaXMuZWxlbWVudCA9IHRoaXMuY29uc3RydWN0RWxlbWVudCgpO1xuXG4gIHRoaXMucGF0dGVybiA9ICcgJztcbiAgdGhpcy5oaWRkZW5NYXNrZWRWYWx1ZSA9ICcnO1xuICB0aGlzLnNob3VsZE1hc2sgPSBmYWxzZTtcbiAgdGhpcy5tYXNrQ2hhcmFjdGVyID0gREVGQVVMVF9NQVNLX0NIQVJBQ1RFUjtcblxuICBzaG91bGRGb3JtYXQgPSB0aGlzLmVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MSW5wdXRFbGVtZW50O1xuICB0aGlzLmZvcm1hdHRlciA9IGNyZWF0ZVJlc3RyaWN0ZWRJbnB1dCh7XG4gICAgc2hvdWxkRm9ybWF0OiBzaG91bGRGb3JtYXQsXG4gICAgZWxlbWVudDogdGhpcy5lbGVtZW50LFxuICAgIHBhdHRlcm46IHRoaXMucGF0dGVyblxuICB9KTtcblxuICB0aGlzLmFkZERPTUV2ZW50TGlzdGVuZXJzKCk7XG4gIHRoaXMuYWRkTW9kZWxFdmVudExpc3RlbmVycygpO1xuICB0aGlzLmFkZEJ1c0V2ZW50TGlzdGVuZXJzKCk7XG4gIHRoaXMucmVuZGVyKCk7XG5cbiAgdGhpcy5tb2RlbC5zZXR1cENvbXBvbmVudCh0aGlzLnR5cGUsIHRoaXMpO1xufVxuXG5CYXNlSW5wdXQucHJvdG90eXBlLnVwZGF0ZU1vZGVsID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgdGhpcy5tb2RlbC5zZXQodGhpcy50eXBlICsgJy4nICsga2V5LCB2YWx1ZSk7XG59O1xuXG5CYXNlSW5wdXQucHJvdG90eXBlLm1vZGVsT25DaGFuZ2UgPSBmdW5jdGlvbiAocHJvcGVydHksIGNhbGxiYWNrKSB7XG4gIHZhciBldmVudFByZWZpeCA9ICdjaGFuZ2U6JyArIHRoaXMudHlwZTtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIHRoaXMubW9kZWwub24oZXZlbnRQcmVmaXggKyAnLicgKyBwcm9wZXJ0eSwgZnVuY3Rpb24gKCkge1xuICAgIGNhbGxiYWNrLmFwcGx5KHNlbGYsIGFyZ3VtZW50cyk7XG4gIH0pO1xufTtcblxuQmFzZUlucHV0LnByb3RvdHlwZS5jb25zdHJ1Y3RFbGVtZW50ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgdHlwZSA9IHRoaXMudHlwZTtcbiAgdmFyIGlucHV0VHlwZSA9ICd0ZWwnO1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gIHZhciBwbGFjZWhvbGRlciA9IHRoaXMucGxhY2Vob2xkZXIgfHwgbnVsbDtcbiAgdmFyIGZpZWxkUGFyYW1zID0gd2hpdGVsaXN0ZWRGaWVsZHMuZmluZChmdW5jdGlvbiAoaXRlbSkge1xuICAgIHJldHVybiBpdGVtLmZpZWxkID09PSB0eXBlO1xuICB9KTtcbiAgdmFyIG5hbWUgPSBmaWVsZFBhcmFtcy5uYW1lO1xuXG4gIHZhciBhdHRyaWJ1dGVzID0ge1xuICAgIHR5cGU6IGlucHV0VHlwZSxcbiAgICBhdXRvY29tcGxldGU6IGNvbnN0YW50cy5hdXRvY29tcGxldGVNYXBwaW5nc1tuYW1lXSB8fCAnb2ZmJyxcbiAgICBhdXRvY29ycmVjdDogJ29mZicsXG4gICAgYXV0b2NhcGl0YWxpemU6ICdub25lJyxcbiAgICBzcGVsbGNoZWNrOiAnZmFsc2UnLFxuICAgICdjbGFzcyc6IHR5cGUsXG4gICAgJ2RhdGEtc2VhbWxlc3NwYXktbmFtZSc6IHR5cGUsXG4gICAgbmFtZTogbmFtZSxcbiAgICBpZDogbmFtZVxuICB9O1xuXG4gIGlmICh0aGlzLm1heExlbmd0aCkge1xuICAgIGF0dHJpYnV0ZXMubWF4bGVuZ3RoID0gdGhpcy5tYXhMZW5ndGg7XG4gIH1cblxuICBpZiAocGxhY2Vob2xkZXIpIHtcbiAgICBhdHRyaWJ1dGVzLnBsYWNlaG9sZGVyID0gcGxhY2Vob2xkZXI7XG4gIH1cblxuICBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChhdHRyKSB7XG4gICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0ciwgYXR0cmlidXRlc1thdHRyXSk7XG4gIH0pO1xuXG4gIHJldHVybiBlbGVtZW50O1xufTtcblxuQmFzZUlucHV0LnByb3RvdHlwZS5nZXRVbmZvcm1hdHRlZFZhbHVlID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5mb3JtYXR0ZXIuZ2V0VW5mb3JtYXR0ZWRWYWx1ZSgpO1xufTtcblxuQmFzZUlucHV0LnByb3RvdHlwZS5hZGRET01FdmVudExpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5fYWRkRE9NRm9jdXNMaXN0ZW5lcnMoKTtcbiAgdGhpcy5fYWRkRE9NSW5wdXRMaXN0ZW5lcnMoKTtcbiAgdGhpcy5fYWRkRE9NS2V5cHJlc3NMaXN0ZW5lcnMoKTtcbn07XG5cbkJhc2VJbnB1dC5wcm90b3R5cGUubWFza1ZhbHVlID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHZhbHVlID0gdmFsdWUgfHwgdGhpcy5lbGVtZW50LnZhbHVlO1xuXG4gIHRoaXMuaGlkZGVuTWFza2VkVmFsdWUgPSB2YWx1ZTtcbiAgdGhpcy5lbGVtZW50LnZhbHVlID0gdmFsdWUucmVwbGFjZSgvW15cXHNcXC9cXC1dL2csIHRoaXMubWFza0NoYXJhY3Rlcik7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdXNlbGVzcy1lc2NhcGVcbn07XG5cbkJhc2VJbnB1dC5wcm90b3R5cGUudW5tYXNrVmFsdWUgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuZWxlbWVudC52YWx1ZSA9IHRoaXMuaGlkZGVuTWFza2VkVmFsdWU7XG59O1xuXG5CYXNlSW5wdXQucHJvdG90eXBlLl9hZGRET01LZXlwcmVzc0xpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXByZXNzJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IEVOVEVSX0tFWV9DT0RFKSB7XG4gICAgICB0aGlzLm1vZGVsLmVtaXRFdmVudCh0aGlzLnR5cGUsICdpbnB1dFN1Ym1pdFJlcXVlc3QnKTtcbiAgICB9XG4gIH0uYmluZCh0aGlzKSwgZmFsc2UpO1xuICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCB0aGlzLm1vZGVsLm9uS2V5VXAodGhpcy50eXBlKSk7XG59O1xuXG5CYXNlSW5wdXQucHJvdG90eXBlLl9hZGRET01JbnB1dExpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZnVuY3Rpb24gKCkge1xuICAgIHRoaXMudXBkYXRlTW9kZWwoJ3ZhbHVlJywgdGhpcy5nZXRVbmZvcm1hdHRlZFZhbHVlKCkpO1xuICB9LmJpbmQodGhpcyksIGZhbHNlKTtcbn07XG5cbkJhc2VJbnB1dC5wcm90b3R5cGUuX2FkZERPTUZvY3VzTGlzdGVuZXJzID0gZnVuY3Rpb24gKCkge1xuICB2YXIgZWxlbWVudCA9IHRoaXMuZWxlbWVudDtcblxuICBpZiAoJ29uZm9jdXNpbicgaW4gZG9jdW1lbnQpIHtcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXNpbicsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgaWYgKGV2ZW50LmZyb21FbGVtZW50ID09PSBlbGVtZW50KSB7IHJldHVybjsgfVxuICAgICAgaWYgKGV2ZW50LnJlbGF0ZWRUYXJnZXQpIHsgcmV0dXJuOyB9XG5cbiAgICAgIGVsZW1lbnQuZm9jdXMoKTtcbiAgICB9LCBmYWxzZSk7XG4gIH0gZWxzZSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBlbGVtZW50LmZvY3VzKCk7XG4gICAgfSwgZmFsc2UpO1xuICB9XG5cbiAgZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnNob3VsZE1hc2spIHtcbiAgICAgIHRoaXMudW5tYXNrVmFsdWUoKTtcbiAgICB9XG4gICAgdGhpcy51cGRhdGVNb2RlbCgnaXNGb2N1c2VkJywgdHJ1ZSk7XG4gIH0uYmluZCh0aGlzKSwgZmFsc2UpO1xuXG4gIGdsb2JhbC5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnNob3VsZE1hc2spIHtcbiAgICAgIHRoaXMubWFza1ZhbHVlKCk7XG4gICAgfVxuICAgIHRoaXMudXBkYXRlTW9kZWwoJ2lzRm9jdXNlZCcsIGZhbHNlKTtcbiAgICB0aGlzLm1vZGVsLnNldCgnZm9jdXNlZEZpZWxkJywgbnVsbCk7XG4gIH0uYmluZCh0aGlzKSwgZmFsc2UpO1xuXG4gIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIGZ1bmN0aW9uICgpIHtcbiAgICBlbGVtZW50LnNlbGVjdCgpO1xuICB9KTtcblxuICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgZnVuY3Rpb24gKCkge1xuICAgIHRoaXMubW9kZWwuc2V0KCdmb2N1c2VkRmllbGQnLCB0aGlzLnR5cGUpO1xuICB9LmJpbmQodGhpcykpO1xuICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGlzVmFsaWQgPSB0aGlzLm1vZGVsLmdldCh0aGlzLnR5cGUpLmlzVmFsaWQ7XG4gICAgY2xhc3NsaXN0LnRvZ2dsZSh0aGlzLmVsZW1lbnQsICdpcy1pbnZhbGlkJywgIWlzVmFsaWQpO1xuICB9LmJpbmQodGhpcykpO1xufTtcblxuQmFzZUlucHV0LnByb3RvdHlwZS5hZGRNb2RlbEV2ZW50TGlzdGVuZXJzID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLm1vZGVsT25DaGFuZ2UoJ2lzVmFsaWQnLCB0aGlzLnJlbmRlcik7XG4gIHRoaXMubW9kZWxPbkNoYW5nZSgnaXNQb3RlbnRpYWxseVZhbGlkJywgdGhpcy5yZW5kZXIpO1xuICB0aGlzLm1vZGVsT25DaGFuZ2UoJ3ZhbHVlJywgdGhpcy5yZW5kZXIpO1xufTtcblxuQmFzZUlucHV0LnByb3RvdHlwZS5zZXRQbGFjZWhvbGRlciA9IGZ1bmN0aW9uICh0eXBlLCBwbGFjZWhvbGRlcikge1xuICB0aGlzLnR5cGUuc2V0QXR0cmlidXRlKHR5cGUsICdwbGFjZWhvbGRlcicsIHBsYWNlaG9sZGVyKTtcbn07XG5cbkJhc2VJbnB1dC5wcm90b3R5cGUuc2V0QXR0cmlidXRlID0gZnVuY3Rpb24gKHR5cGUsIGF0dHJpYnV0ZSwgdmFsdWUpIHtcbiAgaWYgKHR5cGUgPT09IHRoaXMudHlwZSAmJiAhYXR0cmlidXRlVmFsaWRhdGlvbkVycm9yKGF0dHJpYnV0ZSwgdmFsdWUpKSB7XG4gICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyaWJ1dGUsIHZhbHVlKTtcbiAgfVxufTtcblxuQmFzZUlucHV0LnByb3RvdHlwZS5zZXRQYXR0ZXJuID0gZnVuY3Rpb24gKHBhdHRlcm4pIHtcbiAgaWYgKHBhdHRlcm4pIHRoaXMucGF0dGVybiA9IHBhdHRlcm47XG4gIHRoaXMuZm9ybWF0dGVyLnNldFBhdHRlcm4odGhpcy5wYXR0ZXJuKTtcbn07XG5cbkJhc2VJbnB1dC5wcm90b3R5cGUucmVtb3ZlQXR0cmlidXRlID0gZnVuY3Rpb24gKHR5cGUsIGF0dHJpYnV0ZSkge1xuICBpZiAodHlwZSA9PT0gdGhpcy50eXBlICYmICFhdHRyaWJ1dGVWYWxpZGF0aW9uRXJyb3IoYXR0cmlidXRlKSkge1xuICAgIHRoaXMuZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlKTtcbiAgfVxufTtcblxuQmFzZUlucHV0LnByb3RvdHlwZS5hZGRCdXNFdmVudExpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcbiAgZ2xvYmFsLmJ1cy5vbihldmVudHMuVFJJR0dFUl9JTlBVVF9GT0NVUywgZnVuY3Rpb24gKHR5cGUpIHtcbiAgICBpZiAodHlwZSA9PT0gdGhpcy50eXBlKSB7IHRoaXMuZWxlbWVudC5mb2N1cygpOyB9XG4gIH0uYmluZCh0aGlzKSk7XG5cbiAgZ2xvYmFsLmJ1cy5vbihldmVudHMuU0VUX0FUVFJJQlVURSwgdGhpcy5zZXRBdHRyaWJ1dGUuYmluZCh0aGlzKSk7XG4gIGdsb2JhbC5idXMub24oZXZlbnRzLlJFTU9WRV9BVFRSSUJVVEUsIHRoaXMucmVtb3ZlQXR0cmlidXRlLmJpbmQodGhpcykpO1xuXG4gIGdsb2JhbC5idXMub24oZXZlbnRzLkFERF9DTEFTUywgZnVuY3Rpb24gKHR5cGUsIGNsYXNzbmFtZSkge1xuICAgIGlmICh0eXBlID09PSB0aGlzLnR5cGUpIHsgY2xhc3NsaXN0LmFkZCh0aGlzLmVsZW1lbnQsIGNsYXNzbmFtZSk7IH1cbiAgfS5iaW5kKHRoaXMpKTtcblxuICBnbG9iYWwuYnVzLm9uKGV2ZW50cy5SRU1PVkVfQ0xBU1MsIGZ1bmN0aW9uICh0eXBlLCBjbGFzc25hbWUpIHtcbiAgICBpZiAodHlwZSA9PT0gdGhpcy50eXBlKSB7IGNsYXNzbGlzdC5yZW1vdmUodGhpcy5lbGVtZW50LCBjbGFzc25hbWUpOyB9XG4gIH0uYmluZCh0aGlzKSk7XG5cbiAgZ2xvYmFsLmJ1cy5vbihldmVudHMuQ0xFQVJfRklFTEQsIGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgaWYgKHR5cGUgPT09IHRoaXMudHlwZSkge1xuICAgICAgdGhpcy5lbGVtZW50LnZhbHVlID0gJyc7XG4gICAgICB0aGlzLmhpZGRlbk1hc2tlZFZhbHVlID0gJyc7XG4gICAgICB0aGlzLnVwZGF0ZU1vZGVsKCd2YWx1ZScsICcnKTtcbiAgICB9XG4gIH0uYmluZCh0aGlzKSk7XG59O1xuXG5CYXNlSW5wdXQucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIG1vZGVsRGF0YSA9IHRoaXMubW9kZWwuZ2V0KHRoaXMudHlwZSk7XG4gIHZhciBpc0VtcHR5ID0gbW9kZWxEYXRhLnZhbHVlLmxlbmd0aCA9PT0gMDtcbiAgdmFyIGlzVmFsaWQgPSBtb2RlbERhdGEuaXNWYWxpZDtcbiAgdmFyIGZvcm1FbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZm9ybScpO1xuXG4gIGNsYXNzbGlzdC50b2dnbGUodGhpcy5lbGVtZW50LCAnaXMtZW1wdHknLCBpc0VtcHR5KTtcbiAgY2xhc3NsaXN0LnRvZ2dsZSh0aGlzLmVsZW1lbnQsICdJbnB1dC0tZW1wdHknLCBpc0VtcHR5KTtcbiAgY2xhc3NsaXN0LnRvZ2dsZSh0aGlzLmVsZW1lbnQsICdpcy1jb21wbGV0ZScsIGlzVmFsaWQgJiYgIWlzRW1wdHkpO1xuXG4gIGlmIChmb3JtRWxlbWVudCkge1xuICAgIGFkanVzdFRyYW5zZm9ybWF0aW9uKHRoaXMubW9kZWwsIGZvcm1FbGVtZW50KTtcbiAgfVxuXG4gIGlmICh0aGlzLm1heExlbmd0aCkge1xuICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ21heGxlbmd0aCcsIHRoaXMubWF4TGVuZ3RoKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIEJhc2VJbnB1dDogQmFzZUlucHV0XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYXR0cmlidXRlVmFsaWRhdGlvbkVycm9yID0gcmVxdWlyZSgnLi4vLi4vZXh0ZXJuYWwvYXR0cmlidXRlLXZhbGlkYXRpb24tZXJyb3InKTtcbnZhciBjb25zdGFudHMgPSByZXF1aXJlKCcuLi8uLi9zaGFyZWQvY29uc3RhbnRzJyk7XG52YXIgY2xhc3NsaXN0ID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliL2NsYXNzbGlzdCcpO1xuXG52YXIgZXZlbnRzID0gY29uc3RhbnRzLmV2ZW50cztcbnZhciBjYXJkQnJhbmRNYXAgPSBjb25zdGFudHMuY2FyZEJyYW5kTWFwO1xuXG5mdW5jdGlvbiBDYXJkQnJhbmRJY29uKG9wdGlvbnMpIHtcbiAgdGhpcy5tb2RlbCA9IG9wdGlvbnMubW9kZWw7XG4gIHRoaXMudHlwZSA9IG9wdGlvbnMudHlwZTtcbiAgdGhpcy5tYXhMZW5ndGggPSAxMDA7XG5cbiAgdGhpcy5lbGVtZW50ID0gdGhpcy5jb25zdHJ1Y3RFbGVtZW50KCk7XG5cbiAgdGhpcy5hZGRET01FdmVudExpc3RlbmVycygpO1xuICB0aGlzLmFkZE1vZGVsRXZlbnRMaXN0ZW5lcnMoKTtcbiAgdGhpcy5hZGRCdXNFdmVudExpc3RlbmVycygpO1xuICB0aGlzLnJlbmRlcigpO1xuXG4gIHRoaXMubW9kZWwuc2V0dXBDb21wb25lbnQodGhpcy50eXBlLCB0aGlzKTtcbn1cblxuQ2FyZEJyYW5kSWNvbi5wcm90b3R5cGUuY29uc3RydWN0RWxlbWVudCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGJyYW5kSWNvbkNvbnRhaW5lckVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgdmFyIGJyYW5kSWNvbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgdmFyIGJyYW5kSWNvbklubmVyRnJvbnRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIHZhciBicmFuZEljb25Jbm5lckJhY2tFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgYnJhbmRJY29uQ29udGFpbmVyRWxlbWVudC5jbGFzc05hbWUgPSAnQ2FyZEJyYW5kSWNvbi1jb250YWluZXInO1xuICBicmFuZEljb25FbGVtZW50LmNsYXNzTmFtZSA9ICdJY29uIENhcmRCcmFuZEljb24gaXMtY3ZjLWhpZGRlbiBpcy1sb2FkZWQnO1xuICBicmFuZEljb25Jbm5lckZyb250RWxlbWVudC5jbGFzc05hbWUgPSAnQ2FyZEJyYW5kSWNvbi1pbm5lciBDYXJkQnJhbmRJY29uLWlubmVyLS1mcm9udCc7XG4gIGJyYW5kSWNvbklubmVyQmFja0VsZW1lbnQuY2xhc3NOYW1lID0gJ0NhcmRCcmFuZEljb24taW5uZXIgQ2FyZEJyYW5kSWNvbi1pbm5lci0tYmFjayc7XG5cbiAgYnJhbmRJY29uSW5uZXJCYWNrRWxlbWVudC5hcHBlbmRDaGlsZChyZW5kZXJJY29uKCdjdnYnKSlcbiAgYnJhbmRJY29uSW5uZXJGcm9udEVsZW1lbnQuYXBwZW5kQ2hpbGQocmVuZGVySWNvbigndW5rbm93bicpKTtcbiAgYnJhbmRJY29uRWxlbWVudC5hcHBlbmRDaGlsZChicmFuZEljb25Jbm5lckZyb250RWxlbWVudCk7XG4gIGJyYW5kSWNvbkVsZW1lbnQuYXBwZW5kQ2hpbGQoYnJhbmRJY29uSW5uZXJCYWNrRWxlbWVudCk7XG5cbiAgYnJhbmRJY29uQ29udGFpbmVyRWxlbWVudC5hcHBlbmRDaGlsZChicmFuZEljb25FbGVtZW50KTtcblxuICByZXR1cm4gYnJhbmRJY29uQ29udGFpbmVyRWxlbWVudDtcbn07XG5cbkNhcmRCcmFuZEljb24ucHJvdG90eXBlLmFkZERPTUV2ZW50TGlzdGVuZXJzID0gZnVuY3Rpb24gKCkge307XG5cbkNhcmRCcmFuZEljb24ucHJvdG90eXBlLmFkZE1vZGVsRXZlbnRMaXN0ZW5lcnMgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMubW9kZWwub24oJ2NoYW5nZTpwb3NzaWJsZUNhcmRUeXBlcycsIGZ1bmN0aW9uIChjYXJkVHlwZXMpIHtcbiAgICB2YXIgY2FyZFR5cGU7XG4gICAgdmFyIGNhcmRCcmFuZDtcbiAgICB2YXIgYWNjb3VudE51bWJlciA9IHRoaXMubW9kZWwuZ2V0KCdhY2NvdW50TnVtYmVyLnZhbHVlJyk7XG4gICAgaWYgKGNhcmRUeXBlcy5sZW5ndGggPiAwICYmIFN0cmluZyhhY2NvdW50TnVtYmVyKS5sZW5ndGggPiAwKSB7XG4gICAgICBjYXJkVHlwZSA9IFtdLmNvbmNhdChjYXJkVHlwZXMpLnNoaWZ0KCk7XG4gICAgICBjYXJkQnJhbmQgPSBjYXJkQnJhbmRNYXBbY2FyZFR5cGUudHlwZV07XG4gICAgfVxuICAgIHRoaXMubW9kZWwuc2V0KCdjYXJkQnJhbmQnLCBjYXJkQnJhbmQpO1xuICAgIHRoaXMucmVuZGVyQnJhbmQoY2FyZEJyYW5kKTtcbiAgfS5iaW5kKHRoaXMpKTtcblxuICB0aGlzLm1vZGVsLm9uKCdjaGFuZ2U6Zm9jdXNlZEZpZWxkJywgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgdGhpcy5mbGlwKHZhbHVlID09PSAnY3Z2Jyk7XG4gICAgaWYgKHZhbHVlICE9PSAnYWNjb3VudE51bWJlcicgJiYgdGhpcy5tb2RlbC5nZXQoJ2FjY291bnROdW1iZXIudmFsdWUnKS5sZW5ndGggPiAwICYmICF0aGlzLm1vZGVsLmdldCgnYWNjb3VudE51bWJlci5pc1ZhbGlkJykpIHtcbiAgICAgIHRoaXMucmVuZGVyQnJhbmQobnVsbCwgeyBlcnJvcjogdHJ1ZSB9KTtcbiAgICB9IGVsc2UgaWYgKHZhbHVlID09PSAnYWNjb3VudE51bWJlcicgJiYgdGhpcy5tb2RlbC5nZXQoJ2FjY291bnROdW1iZXIudmFsdWUnKS5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLnJlbmRlckJyYW5kKHRoaXMubW9kZWwuZ2V0KCdjYXJkQnJhbmQnKSk7XG4gICAgfVxuICB9LmJpbmQodGhpcykpO1xufTtcblxuQ2FyZEJyYW5kSWNvbi5wcm90b3R5cGUuc2V0QXR0cmlidXRlID0gZnVuY3Rpb24gKHR5cGUsIGF0dHJpYnV0ZSwgdmFsdWUpIHtcbiAgaWYgKHR5cGUgPT09IHRoaXMudHlwZSAmJiAhYXR0cmlidXRlVmFsaWRhdGlvbkVycm9yKGF0dHJpYnV0ZSwgdmFsdWUpKSB7XG4gICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyaWJ1dGUsIHZhbHVlKTtcbiAgfVxufTtcblxuQ2FyZEJyYW5kSWNvbi5wcm90b3R5cGUucmVtb3ZlQXR0cmlidXRlID0gZnVuY3Rpb24gKHR5cGUsIGF0dHJpYnV0ZSkge1xuICBpZiAodHlwZSA9PT0gdGhpcy50eXBlICYmICFhdHRyaWJ1dGVWYWxpZGF0aW9uRXJyb3IoYXR0cmlidXRlKSkge1xuICAgIHRoaXMuZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlKTtcbiAgfVxufTtcblxuQ2FyZEJyYW5kSWNvbi5wcm90b3R5cGUuYWRkQnVzRXZlbnRMaXN0ZW5lcnMgPSBmdW5jdGlvbiAoKSB7XG4gIGdsb2JhbC5idXMub24oZXZlbnRzLkFERF9DTEFTUywgZnVuY3Rpb24gKHR5cGUsIGNsYXNzbmFtZSkge1xuICAgIGlmICh0eXBlID09PSB0aGlzLnR5cGUpIHsgY2xhc3NsaXN0LmFkZCh0aGlzLmVsZW1lbnQsIGNsYXNzbmFtZSk7IH1cbiAgfS5iaW5kKHRoaXMpKTtcblxuICBnbG9iYWwuYnVzLm9uKGV2ZW50cy5SRU1PVkVfQ0xBU1MsIGZ1bmN0aW9uICh0eXBlLCBjbGFzc25hbWUpIHtcbiAgICBpZiAodHlwZSA9PT0gdGhpcy50eXBlKSB7IGNsYXNzbGlzdC5yZW1vdmUodGhpcy5lbGVtZW50LCBjbGFzc25hbWUpOyB9XG4gIH0uYmluZCh0aGlzKSk7XG59O1xuXG5DYXJkQnJhbmRJY29uLnByb3RvdHlwZS5mbGlwID0gZnVuY3Rpb24gKGJhY2spIHtcbiAgY2xhc3NsaXN0LnRvZ2dsZSh0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignZGl2LkNhcmRCcmFuZEljb24nKSwgJ2lzLWN2YycsIGJhY2spO1xuICBjbGFzc2xpc3QudG9nZ2xlKHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdkaXYuQ2FyZEJyYW5kSWNvbicpLCAnaXMtY3ZjLWhpZGRlbicsICFiYWNrKTtcbn07XG5cbkNhcmRCcmFuZEljb24ucHJvdG90eXBlLnJlbmRlckJyYW5kID0gZnVuY3Rpb24gKGNhcmRCcmFuZCwgb3B0aW9ucykge1xuICB2YXIgZXJyb3IgPSAob3B0aW9ucyB8fCB7fSkuZXJyb3I7XG4gIHZhciBpbm5lckZyb250RWxlbWVudCA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdkaXYuQ2FyZEJyYW5kSWNvbi1pbm5lci0tZnJvbnQnKTtcbiAgaW5uZXJGcm9udEVsZW1lbnQuaW5uZXJIVE1MID0gJyc7XG4gIGlmICghZXJyb3IgJiYgY2FyZEJyYW5kKSB7XG4gICAgaW5uZXJGcm9udEVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlSW1nRWxlbWVudChjYXJkQnJhbmQpKTtcbiAgfSBlbHNlIGlmICghZXJyb3IgJiYgIWNhcmRCcmFuZCkge1xuICAgIGlubmVyRnJvbnRFbGVtZW50LmFwcGVuZENoaWxkKHJlbmRlckljb24oJ3Vua25vd24nKSk7XG4gIH0gZWxzZSBpZiAoZXJyb3IpIHtcbiAgICBpbm5lckZyb250RWxlbWVudC5hcHBlbmRDaGlsZChyZW5kZXJJY29uKCdlcnJvcicpKTtcbiAgfVxufTtcblxuQ2FyZEJyYW5kSWNvbi5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKCkge307XG5cbmZ1bmN0aW9uIGNyZWF0ZUltZ0VsZW1lbnQodHlwZSkge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICBlbGVtZW50LnNldEF0dHJpYnV0ZSgncm9sZScsICdwcmVzZW50YXRpb24nKTtcbiAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3NyYycsICdpbWcvJyArIHR5cGUgKyAnLnN2ZycpO1xuICBlbGVtZW50LmNsYXNzTmFtZSA9ICdDYXJkQnJhbmRJY29uLWlubmVyIENhcmRCcmFuZEljb24taW5uZXItLWZyb250JztcblxuICByZXR1cm4gZWxlbWVudDtcbn1cblxuZnVuY3Rpb24gY3JlYXRlU3ZnRWxlbWVudCh0YWcsIGF0dHJpYnV0ZXMpIHtcbiAgdmFyIGNoaWxkcmVuID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgdGFnKTtcblxuICBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzIHx8IHt9KS5mb3JFYWNoKGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcbiAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyaWJ1dGUsIGF0dHJpYnV0ZXNbYXR0cmlidXRlXSk7XG4gIH0pO1xuICBjaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCkge1xuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICB9KTtcblxuICByZXR1cm4gZWxlbWVudDtcbn1cblxuZnVuY3Rpb24gcmVuZGVySWNvbih0eXBlKSB7XG4gIHZhciBpY29ucyA9IHtcbiAgICB1bmtub3duOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gY3JlYXRlU3ZnRWxlbWVudCgnc3ZnJywge1xuICAgICAgICBmb2N1c2FibGU6ICdmYWxzZScsXG4gICAgICAgIHZpZXdCb3g6ICcwIDAgMzIgMjEnXG4gICAgICB9LCBjcmVhdGVTdmdFbGVtZW50KCdnJywge1xuICAgICAgICBmaWxsOiAnbm9uZScsXG4gICAgICAgICdmaWxsLXJ1bGUnOiAnZXZlbm9kZCdcbiAgICAgIH0sIGNyZWF0ZVN2Z0VsZW1lbnQoJ2cnLCB7XG4gICAgICAgIGlkOiAndW5rbm93bicsXG4gICAgICAgIGNsYXNzOiAnSWNvbi1maWxsJ1xuICAgICAgfSwgY3JlYXRlU3ZnRWxlbWVudCgnZycsIHtcbiAgICAgICAgaWQ6ICdjYXJkJyxcbiAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlKDAgMiknXG4gICAgICB9LCBjcmVhdGVTdmdFbGVtZW50KCdwYXRoJywge1xuICAgICAgICBpZDogJ3NoYXBlJyxcbiAgICAgICAgZDogJ00yNi41OCAxOUgyLjQyQTIuNCAyLjQgMCAwIDEgMCAxNi42MlYyLjM4QTIuNCAyLjQgMCAwIDEgMi40MiAwaDI0LjE2QTIuNCAyLjQgMCAwIDEgMjkgMi4zOHYxNC4yNUEyLjQgMi40IDAgMCAxIDI2LjU4IDE5ek0xMCA1LjgzYzAtLjQ2LS4zNS0uODMtLjc4LS44M0gzLjc4Yy0uNDMgMC0uNzguMzctLjc4LjgzdjMuMzRjMCAuNDYuMzUuODMuNzguODNoNS40NGMuNDMgMCAuNzgtLjM3Ljc4LS44M1Y1LjgzeicsXG4gICAgICAgIG9wYWNpdHk6ICcuMidcbiAgICAgIH0pLCBjcmVhdGVTdmdFbGVtZW50KCdwYXRoJywge1xuICAgICAgICBpZDogJ3NoYXBlJyxcbiAgICAgICAgZDogJ00yNSAxNWgtM2MtLjY1IDAtMS0uMy0xLTFzLjM1LTEgMS0xaDNjLjY1IDAgMSAuMyAxIDFzLS4zNSAxLTEgMXptLTYgMGgtM2MtLjY1IDAtMS0uMy0xLTFzLjM1LTEgMS0xaDNjLjY1IDAgMSAuMyAxIDFzLS4zNSAxLTEgMXptLTYgMGgtM2MtLjY1IDAtMS0uMy0xLTFzLjM1LTEgMS0xaDNjLjY1IDAgMSAuMyAxIDFzLS4zNSAxLTEgMXptLTYgMEg0Yy0uNjUgMC0xLS4zLTEtMXMuMzUtMSAxLTFoM2MuNjUgMCAxIC4zIDEgMXMtLjM1IDEtMSAxeicsXG4gICAgICAgIG9wYWNpdHk6ICcuMydcbiAgICAgIH0pKSkpKTtcbiAgICB9LFxuICAgIGN2djogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGNyZWF0ZVN2Z0VsZW1lbnQoJ3N2ZycsIHtcbiAgICAgICAgZm9jdXNhYmxlOiAnZmFsc2UnLFxuICAgICAgICB2aWV3Qm94OiAnMCAwIDMyIDIxJ1xuICAgICAgfSwgY3JlYXRlU3ZnRWxlbWVudCgnZycsIHtcbiAgICAgICAgZmlsbDogJ25vbmUnLFxuICAgICAgICAnZmlsbC1ydWxlJzogJ2V2ZW5vZGQnXG4gICAgICB9LCBjcmVhdGVTdmdFbGVtZW50KCdnJywge1xuICAgICAgICBpZDogJ2N2YycsXG4gICAgICAgIGNsYXNzOiAnSWNvbi1maWxsJ1xuICAgICAgfSwgY3JlYXRlU3ZnRWxlbWVudCgnZycsIHtcbiAgICAgICAgaWQ6ICdjYXJkJyxcbiAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlKDAgMiknXG4gICAgICB9LCBjcmVhdGVTdmdFbGVtZW50KCdwYXRoJywge1xuICAgICAgICBpZDogJ3NoYXBlJyxcbiAgICAgICAgZDogJ00yMS42OCAwSDJjLS45MiAwLTIgMS4wNi0yIDJ2MTVjMCAuOTQgMS4wOCAyIDIgMmgyNWMuOTIgMCAyLTEuMDYgMi0yVjkuNDdhNS45OCA1Ljk4IDAgMCAxLTMgMS40NVYxMWMwIC42Ni0uMzYgMS0xIDFIM2MtLjY0IDAtMS0uMzQtMS0xdi0xYzAtLjY2LjM2LTEgMS0xaDE3LjUzYTUuOTggNS45OCAwIDAgMSAxLjE1LTl6JyxcbiAgICAgICAgb3BhY2l0eTogJy4yJ1xuICAgICAgfSksIGNyZWF0ZVN2Z0VsZW1lbnQoJ3BhdGgnLCB7XG4gICAgICAgIGlkOiAnc2hhcGUnLFxuICAgICAgICBkOiAnTTE5LjM0IDNIMHYzaDE5LjA4YTYuMDQgNi4wNCAwIDAgMSAuMjYtM3onLFxuICAgICAgICBvcGFjaXR5OiAnLjMnXG4gICAgICB9KSksIGNyZWF0ZVN2Z0VsZW1lbnQoJ2cnLCB7XG4gICAgICAgIGlkOiAnc2hhcGUnLFxuICAgICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGUoMTgpJ1xuICAgICAgfSwgY3JlYXRlU3ZnRWxlbWVudCgncGF0aCcsIHtcbiAgICAgICAgZDogJ003IDE0QTcgNyAwIDEgMSA3IDBhNyA3IDAgMCAxIDAgMTR6TTQuMjIgNC4xaC0uNzlsLTEuOTMuOTh2MWwxLjUzLS44VjkuOWgxLjJWNC4xem0yLjMuOGMuNTcgMCAuOTcuMzIuOTcuNzggMCAuNS0uNDcuODUtMS4xNS44NWgtLjN2Ljg1aC4zNmMuNzIgMCAxLjIxLjM2IDEuMjEuODggMCAuNS0uNDguODQtMS4xNi44NC0uNSAwLTEtLjE2LTEuNTItLjQ3djFjLjU2LjI0IDEuMTIuMzcgMS42Ny4zNyAxLjMxIDAgMi4yMS0uNjcgMi4yMS0xLjY0IDAtLjY4LS40Mi0xLjIzLTEuMTItMS40NS42LS4yLjk5LS43My45OS0xLjMzQzguNjggNC42NCA3Ljg1IDQgNi42NSA0YTQgNCAwIDAgMC0xLjU3LjM0di45OGMuNDgtLjI3Ljk3LS40MiAxLjQ0LS40MnptNC4zMiAyLjE4Yy43MyAwIDEuMjQuNDMgMS4yNC45OSAwIC41OS0uNTEgMS0xLjI0IDEtLjQ0IDAtLjktLjE0LTEuMzctLjQzdjEuMDNjLjQ5LjIyLjk5LjMzIDEuNDguMzMuMjYgMCAuNS0uMDQuNzMtLjEuNTItLjg1LjgyLTEuODMuODItMi44OGwtLjAyLS40MmEyLjMgMi4zIDAgMCAwLTEuMjMtLjMyYy0uMTggMC0uMzcuMDEtLjU3LjA0di0xLjNoMS40NGE1LjYyIDUuNjIgMCAwIDAtLjQ2LS45Mkg5LjY0djMuMTVjLjQtLjEuOC0uMTcgMS4yLS4xN3onXG4gICAgICB9KSkpKSk7XG4gICAgfSxcbiAgICBlcnJvcjogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGNyZWF0ZVN2Z0VsZW1lbnQoJ3N2ZycsIHtcbiAgICAgICAgZm9jdXNhYmxlOiAnZmFsc2UnLFxuICAgICAgICB2aWV3Qm94OiAnMCAwIDMyIDIxJ1xuICAgICAgfSwgY3JlYXRlU3ZnRWxlbWVudCgnZycsIHtcbiAgICAgICAgZmlsbDogJ25vbmUnLFxuICAgICAgICBmaWxsUnVsZTogJ2V2ZW5vZGQnXG4gICAgICB9LCBjcmVhdGVTdmdFbGVtZW50KCdnJywge1xuICAgICAgICBpZDogJ2Vycm9yJyxcbiAgICAgICAgY2xhc3M6ICdJY29uLWZpbGwnXG4gICAgICB9LCBjcmVhdGVTdmdFbGVtZW50KCdnJywge1xuICAgICAgICBpZDogJ2NhcmQnLFxuICAgICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGUoMCAyKSdcbiAgICAgIH0sIGNyZWF0ZVN2Z0VsZW1lbnQoJ3BhdGgnLCB7XG4gICAgICAgIGlkOiAnc2hhcGUnLFxuICAgICAgICBkOiAnTTIxLjY4IDBBNiA2IDAgMSAwIDI5IDkuNDd2Ny4xNUEyLjQgMi40IDAgMCAxIDI2LjU4IDE5SDIuNDJBMi40IDIuNCAwIDAgMSAwIDE2LjYyVjIuMzhBMi40IDIuNCAwIDAgMSAyLjQyIDBoMTkuMjZ6TTEwIDUuODNjMC0uNDYtLjM1LS44My0uNzgtLjgzSDMuNzhjLS40MyAwLS43OC4zNy0uNzguODN2My4zNGMwIC40Ni4zNS44My43OC44M2g1LjQ0Yy40MyAwIC43OC0uMzcuNzgtLjgzVjUuODN6JyxcbiAgICAgICAgb3BhY2l0eTogJy4yJ1xuICAgICAgfSksIGNyZWF0ZVN2Z0VsZW1lbnQoJ3BhdGgnLCB7XG4gICAgICAgIGlkOiAnc2hhcGUnLFxuICAgICAgICBkOiAnTTI1IDE1aC0zYy0uNjUgMC0xLS4zLTEtMXMuMzUtMSAxLTFoM2MuNjUgMCAxIC4zIDEgMXMtLjM1IDEtMSAxem0tNiAwaC0zYy0uNjUgMC0xLS4zLTEtMXMuMzUtMSAxLTFoM2MuNjUgMCAxIC4zIDEgMXMtLjM1IDEtMSAxem0tNiAwaC0zYy0uNjUgMC0xLS4zLTEtMXMuMzUtMSAxLTFoM2MuNjUgMCAxIC4zIDEgMXMtLjM1IDEtMSAxem0tNiAwSDRjLS42NSAwLTEtLjMtMS0xcy4zNS0xIDEtMWgzYy42NSAwIDEgLjMgMSAxcy0uMzUgMS0xIDF6JyxcbiAgICAgICAgb3BhY2l0eTogJy4zJ1xuICAgICAgfSkpLCBjcmVhdGVTdmdFbGVtZW50KCdnJywge1xuICAgICAgICBpZDogJ3NoYXBlJyxcbiAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlKDE4KSdcbiAgICAgIH0sIGNyZWF0ZVN2Z0VsZW1lbnQoJ3BhdGgnLCB7XG4gICAgICAgIGQ6ICdNNyAxNEE3IDcgMCAxIDEgNyAwYTcgNyAwIDAgMSAwIDE0ek02IDN2NGExIDEgMCAwIDAgMiAwVjNhMSAxIDAgMCAwLTIgMHptMSA4Ljc1YTEuMjUgMS4yNSAwIDEgMCAwLTIuNSAxLjI1IDEuMjUgMCAwIDAgMCAyLjV6J1xuICAgICAgfSkpKSkpO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gKGljb25zW3R5cGVdIHx8IGljb25zLnVua25vd24pKCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBDYXJkQnJhbmRJY29uOiBDYXJkQnJhbmRJY29uXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQmFzZUlucHV0ID0gcmVxdWlyZSgnLi9iYXNlLWlucHV0JykuQmFzZUlucHV0O1xudmFyIFBBVFRFUk5fQ0FDSEUgPSB7fTtcblxuZnVuY3Rpb24gX2dlbmVyYXRlUGF0dGVybihsZW5ndGgpIHtcbiAgdmFyIGk7XG4gIHZhciBwYXR0ZXJuID0gJ3t7JztcblxuICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBwYXR0ZXJuICs9ICc5JztcbiAgfVxuXG4gIHJldHVybiBwYXR0ZXJuICsgJ319Jztcbn1cblxuZnVuY3Rpb24gX2dldFBhdHRlcm4obGVuZ3RoKSB7XG4gIGlmICghKGxlbmd0aCBpbiBQQVRURVJOX0NBQ0hFKSkge1xuICAgIFBBVFRFUk5fQ0FDSEVbbGVuZ3RoXSA9IF9nZW5lcmF0ZVBhdHRlcm4obGVuZ3RoKTtcbiAgfVxuXG4gIHJldHVybiBQQVRURVJOX0NBQ0hFW2xlbmd0aF07XG59XG5cbmZ1bmN0aW9uIENWVklucHV0KCkge1xuICB0aGlzLnBsYWNlaG9sZGVyID0gJ0NWVic7XG5cbiAgQmFzZUlucHV0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgdmFyIERFRkFVTFRfTUFYX0xFTkdUSCA9IHRoaXMubWF4TGVuZ3RoO1xuXG4gIHRoaXMubW9kZWwub24oJ2NoYW5nZTpwb3NzaWJsZUNhcmRUeXBlcycsIGZ1bmN0aW9uIChwb3NzaWJsZUNhcmRUeXBlcykge1xuICAgIHRoaXMubWF4TGVuZ3RoID0gcG9zc2libGVDYXJkVHlwZXMucmVkdWNlKGZ1bmN0aW9uIChhY2N1bSwgY2FyZFR5cGUpIHtcbiAgICAgIHJldHVybiBNYXRoLm1heChhY2N1bSwgY2FyZFR5cGUuY29kZS5zaXplKTtcbiAgICB9LCAwKSB8fCBERUZBVUxUX01BWF9MRU5HVEg7XG5cbiAgICB0aGlzLm1vZGVsLl92YWxpZGF0ZUZpZWxkKHRoaXMudHlwZSk7XG5cbiAgICBpZiAodGhpcy5zaG91bGRNYXNrKSB7XG4gICAgICB0aGlzLm1hc2tWYWx1ZSh0aGlzLmhpZGRlbk1hc2tlZFZhbHVlLnN1YnN0cmluZygwLCB0aGlzLm1heExlbmd0aCkpO1xuICAgICAgdGhpcy51cGRhdGVNb2RlbCgndmFsdWUnLCB0aGlzLmhpZGRlbk1hc2tlZFZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy51cGRhdGVNb2RlbCgndmFsdWUnLCB0aGlzLmZvcm1hdHRlci5nZXRVbmZvcm1hdHRlZFZhbHVlKCkpO1xuICAgIH1cblxuICAgIHRoaXMucmVuZGVyKCk7XG4gIH0uYmluZCh0aGlzKSk7XG5cbiAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZSgnbWF4bGVuZ3RoJywgdGhpcy5tYXhMZW5ndGgpO1xuICB0aGlzLnNldFBhdHRlcm4oX2dldFBhdHRlcm4odGhpcy5tYXhMZW5ndGgpKTtcbn1cblxuQ1ZWSW5wdXQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShCYXNlSW5wdXQucHJvdG90eXBlKTtcbkNWVklucHV0LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IENWVklucHV0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgQ1ZWSW5wdXQ6IENWVklucHV0XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQmFzZUlucHV0ID0gcmVxdWlyZSgnLi9iYXNlLWlucHV0JykuQmFzZUlucHV0O1xuXG52YXIgREVGQVVMVF9QQVRURVJOID0gJ3t7OTl9fSAvIHt7OTl9fSc7XG52YXIgWkVST19QQURERURfUEFUVEVSTiA9ICcwe3s5fX0gLyB7ezk5fX0nO1xuXG5mdW5jdGlvbiBFeHBpcmF0aW9uRGF0ZUlucHV0KCkge1xuICB0aGlzLnBsYWNlaG9sZGVyID0gJ01NIC8gWVknO1xuXG4gIEJhc2VJbnB1dC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB0aGlzLnNldFBhdHRlcm4oREVGQVVMVF9QQVRURVJOKTtcblxuICB0aGlzLm1vZGVsLm9uKCdjaGFuZ2U6ZXhwRGF0ZS52YWx1ZScsIGZ1bmN0aW9uIChkYXRlKSB7XG4gICAgaWYgKGRhdGUubGVuZ3RoID09PSAwIHx8IGRhdGVbMF0gPT09ICcwJyB8fCBkYXRlWzBdID09PSAnMScpIHtcbiAgICAgIHRoaXMuc2V0UGF0dGVybihERUZBVUxUX1BBVFRFUk4pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldFBhdHRlcm4oWkVST19QQURERURfUEFUVEVSTik7XG4gICAgfVxuICB9LmJpbmQodGhpcykpO1xufVxuXG5FeHBpcmF0aW9uRGF0ZUlucHV0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQmFzZUlucHV0LnByb3RvdHlwZSk7XG5FeHBpcmF0aW9uRGF0ZUlucHV0LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEV4cGlyYXRpb25EYXRlSW5wdXQ7XG5cbkV4cGlyYXRpb25EYXRlSW5wdXQucHJvdG90eXBlLmdldFVuZm9ybWF0dGVkVmFsdWUgPSBmdW5jdGlvbiAoKSB7XG5cbiAgcmV0dXJuIHRoaXMuZm9ybWF0dGVyLmdldFVuZm9ybWF0dGVkVmFsdWUoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBFeHBpcmF0aW9uRGF0ZUlucHV0OiBFeHBpcmF0aW9uRGF0ZUlucHV0XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgSW5wdXRDb21wb25lbnRzID0gcmVxdWlyZSgnLi9pbmRleCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgRmllbGRDb21wb25lbnQ6IGZ1bmN0aW9uIEZpZWxkQ29tcG9uZW50KG9wdGlvbnMpIHtcbiAgICB2YXIgdHlwZSA9IG9wdGlvbnMudHlwZTtcbiAgICB2YXIgY2FyZEZvcm0gPSBvcHRpb25zLmNhcmRGb3JtO1xuXG4gICAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgIHRoaXMuaW5wdXQgPSBuZXcgSW5wdXRDb21wb25lbnRzW3R5cGVdKHtcbiAgICAgIG1vZGVsOiBjYXJkRm9ybSxcbiAgICAgIHR5cGU6IHR5cGVcbiAgICB9KTtcbiAgICB0aGlzLmlucHV0LmVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5JywgJ2ZpZWxkLWRlc2NyaXB0aW9uLScgKyB0eXBlKTtcbiAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5pbnB1dC5lbGVtZW50KTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNhcmRCcmFuZEljb246IHJlcXVpcmUoJy4vY2FyZC1icmFuZC1pY29uJykuQ2FyZEJyYW5kSWNvbixcbiAgYWNjb3VudE51bWJlcjogcmVxdWlyZSgnLi9hY2NvdW50LW51bWJlci1pbnB1dCcpLkFjY291bnROdW1iZXJJbnB1dCxcbiAgcG9zdGFsQ29kZTogcmVxdWlyZSgnLi9wb3N0YWwtY29kZS1pbnB1dCcpLlBvc3RhbENvZGVJbnB1dCxcbiAgY3Z2OiByZXF1aXJlKCcuL2N2di1pbnB1dCcpLkNWVklucHV0LFxuICBleHBEYXRlOiByZXF1aXJlKCcuL2V4cGlyYXRpb24tZGF0ZS1pbnB1dCcpLkV4cGlyYXRpb25EYXRlSW5wdXRcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBCYXNlSW5wdXQgPSByZXF1aXJlKCcuL2Jhc2UtaW5wdXQnKS5CYXNlSW5wdXQ7XG5cbmZ1bmN0aW9uIFBvc3RhbENvZGVJbnB1dCgpIHtcbiAgdGhpcy5wbGFjZWhvbGRlciA9ICdaSVAnO1xuXG4gIEJhc2VJbnB1dC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gIHRoaXMuc2V0UGF0dGVybigne3sqKioqKn19Jyk7XG4gIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dCcpO1xufVxuXG5Qb3N0YWxDb2RlSW5wdXQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShCYXNlSW5wdXQucHJvdG90eXBlKTtcblBvc3RhbENvZGVJbnB1dC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBQb3N0YWxDb2RlSW5wdXQ7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBQb3N0YWxDb2RlSW5wdXQ6IFBvc3RhbENvZGVJbnB1dFxufTtcbiIsInZhciBjbGFzc2xpc3QgPSByZXF1aXJlKCcuLy4uLy4uL2xpYi9jbGFzc2xpc3QnKTtcblxuZnVuY3Rpb24gZ2V0U3RhdGUoZm9ybSwgZm9ybUVsZW1lbnQpIHtcbiAgdmFyIGljb25XaWR0aCA9IGZvcm1FbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi5DYXJkQnJhbmRJY29uLWNvbnRhaW5lcicpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xuICB2YXIgY2FyZE51bWJlcldpZHRoID0gZm9ybUVsZW1lbnQucXVlcnlTZWxlY3Rvcignc3Bhbi5DYXJkRmllbGQtYWNjb3VudC1udW1iZXInKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcbiAgdmFyIGNhcmRDdmNXaWR0aCA9IGZvcm1FbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ3NwYW4uQ2FyZEZpZWxkLWN2dicpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xuICB2YXIgcG9zdGFsQ29kZVdpZHRoID0gZm9ybUVsZW1lbnQucXVlcnlTZWxlY3Rvcignc3Bhbi5DYXJkRmllbGQtcG9zdGFsLWNvZGUnKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcbiAgdmFyIGNhcmRFeHBpcnlXaWR0aCA9IGZvcm1FbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ3NwYW4uQ2FyZEZpZWxkLWV4cC1kYXRlJykuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XG4gIHZhciB3aW5kb3dXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICB2YXIgY29lZmZpY2llbnQgPSA0ICogaWNvbldpZHRoIC8gMztcbiAgdmFyIHBhbmVsV2lkdGggPSB3aW5kb3dXaWR0aCAtIGNvZWZmaWNpZW50O1xuICB2YXIgb3RoZXJGaWVsZHNXaWR0aCA9IHBhbmVsV2lkdGggLSBjYXJkTnVtYmVyV2lkdGg7XG4gIHZhciB0b3RhbFdpZHRoID0gY2FyZEV4cGlyeVdpZHRoICsgY2FyZEN2Y1dpZHRoICsgcG9zdGFsQ29kZVdpZHRoO1xuXG4gIGlmIChmb3JtLmdldCgnZm9jdXNlZEZpZWxkJykgPT09ICdhY2NvdW50TnVtYmVyJyB8fCAhZm9ybS5nZXQoJ2ZvY3VzZWRGaWVsZCcpKSB7XG4gICAgcmV0dXJuIHdpbmRvd1dpZHRoID4gY29lZmZpY2llbnQgKyBjYXJkTnVtYmVyV2lkdGggKyB0b3RhbFdpZHRoID8ge1xuICAgICAgaGlkZUljb246IGZhbHNlLFxuICAgICAgdHJhbnNsYXRpb246IG90aGVyRmllbGRzV2lkdGggLSB0b3RhbFdpZHRoLFxuICAgICAgaGlkZUNhcmROdW1iZXI6IGZhbHNlXG4gICAgfSA6IHdpbmRvd1dpZHRoID4gY29lZmZpY2llbnQgKyBjYXJkTnVtYmVyV2lkdGggKyBjYXJkRXhwaXJ5V2lkdGggKyBjYXJkQ3ZjV2lkdGggPyB7XG4gICAgICBoaWRlSWNvbjogZmFsc2UsXG4gICAgICB0cmFuc2xhdGlvbjogb3RoZXJGaWVsZHNXaWR0aCAtIGNhcmRFeHBpcnlXaWR0aCAtIGNhcmRDdmNXaWR0aCxcbiAgICAgIGhpZGVDYXJkTnVtYmVyOiBmYWxzZVxuICAgIH0gOiB3aW5kb3dXaWR0aCA+IGNvZWZmaWNpZW50ICsgY2FyZE51bWJlcldpZHRoICsgY2FyZEV4cGlyeVdpZHRoID8ge1xuICAgICAgaGlkZUljb246IGZhbHNlLFxuICAgICAgdHJhbnNsYXRpb246IG90aGVyRmllbGRzV2lkdGggLSBjYXJkRXhwaXJ5V2lkdGgsXG4gICAgICBoaWRlQ2FyZE51bWJlcjogZmFsc2VcbiAgICB9IDoge1xuICAgICAgaGlkZUljb246IHRydWUsXG4gICAgICB0cmFuc2xhdGlvbjogd2luZG93V2lkdGggLSBjYXJkTnVtYmVyV2lkdGggLSBjYXJkRXhwaXJ5V2lkdGgsXG4gICAgICBoaWRlQ2FyZE51bWJlcjogZmFsc2VcbiAgICB9O1xuICB9XG4gIHZhciB0cmFuc2xhdGlvbiA9IG90aGVyRmllbGRzV2lkdGggLSB0b3RhbFdpZHRoO1xuXG4gIHJldHVybiB3aW5kb3dXaWR0aCA+IGNvZWZmaWNpZW50ICsgY2FyZE51bWJlcldpZHRoICsgdG90YWxXaWR0aCA/IHtcbiAgICBoaWRlSWNvbjogZmFsc2UsXG4gICAgaGlkZUNhcmROdW1iZXI6IGZhbHNlLFxuICAgIHRyYW5zbGF0aW9uOiB0cmFuc2xhdGlvblxuICB9IDoge1xuICAgIGhpZGVJY29uOiBmYWxzZSxcbiAgICBoaWRlQ2FyZE51bWJlcjogdHJ1ZSxcbiAgICB0cmFuc2xhdGlvbjogdHJhbnNsYXRpb25cbiAgfTtcbn1cblxuZnVuY3Rpb24gc2V0VHJhbnNmb3JtU3R5bGUoZWxlbWVudCwgdHJhbnNsYXRpb24sIHJ0bCkgeyAvLyBydGwgPT09IGZhbHNlXG4gIHZhciBudW0gPSBNYXRoLnJvdW5kKHRyYW5zbGF0aW9uKTtcbiAgdmFyIHRyYW5zZm9ybSA9IHJ0bCA/ICd0cmFuc2xhdGVYKCcgKyAtbnVtICsgJ3B4KScgOiAndHJhbnNsYXRlWCgnICsgbnVtICsgJ3B4KSc7XG5cbiAgZWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSB0cmFuc2Zvcm07XG4gIGVsZW1lbnQuc3R5bGUuV2Via2l0VHJhbnNmb3JtID0gdHJhbnNmb3JtO1xuICBlbGVtZW50LnN0eWxlLm1zVHJhbnNmb3JtID0gdHJhbnNmb3JtO1xuXG4gIHJldHVybiBlbGVtZW50O1xufVxuXG5mdW5jdGlvbiBjYWxjdWxhdGVOdW1iZXJUcmFuc2xhdGlvbihlbGVtZW50KSB7XG4gIHZhciBmYWtlTnVtYmVyRWxlbWVudCA9IGVsZW1lbnQucXVlcnlTZWxlY3Rvcignc3Bhbi5DYXJkRmllbGQtYWNjb3VudC1udW1iZXItZmFrZU51bWJlcicpO1xuICB2YXIgbGFzdDRFbGVtZW50ID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdzcGFuLkNhcmRGaWVsZC1udW1iZXItZmFrZU51bWJlci1sYXN0NCcpO1xuXG4gIHJldHVybiAtKGZha2VOdW1iZXJFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoIC0gbGFzdDRFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoKTtcbn1cblxudmFyIGFkanVzdFRyYW5zZm9ybWF0aW9uID0gZnVuY3Rpb24gKGZvcm0sIGVsZW1lbnQpIHtcbiAgdmFyIGNhcmRCcmFuZEljb25Db250YWluZXJFbGVtZW50ID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdkaXYuQ2FyZEJyYW5kSWNvbi1jb250YWluZXInKTtcbiAgdmFyIGFjY291bnROdW1iZXJFbGVtZW50ID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdzcGFuLkNhcmRGaWVsZC1hY2NvdW50LW51bWJlcicpO1xuICB2YXIgY3Z2RWxlbWVudCA9IGVsZW1lbnQucXVlcnlTZWxlY3Rvcignc3Bhbi5DYXJkRmllbGQtY3Z2Jyk7XG4gIHZhciBwb3N0YWxDb2RlRWxlbWVudCA9IGVsZW1lbnQucXVlcnlTZWxlY3Rvcignc3Bhbi5DYXJkRmllbGQtcG9zdGFsLWNvZGUnKTtcbiAgdmFyIGV4cERhdGVFbGVtZW50ID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdzcGFuLkNhcmRGaWVsZC1leHAtZGF0ZScpO1xuICB2YXIgc3RhdGUgPSBnZXRTdGF0ZShmb3JtLCBlbGVtZW50KTtcblxuICBjbGFzc2xpc3QudG9nZ2xlKGNhcmRCcmFuZEljb25Db250YWluZXJFbGVtZW50LCAnaXMtaGlkZGVuJywgc3RhdGUuaGlkZUljb24pO1xuICBjbGFzc2xpc3QudG9nZ2xlKGFjY291bnROdW1iZXJFbGVtZW50LCAnaXMtaGlkZGVuJywgc3RhdGUuaGlkZUNhcmROdW1iZXIpO1xuICB2YXIgYWNjb3VudE51bWJlclRyYW5zbGF0aW9uID0gc3RhdGUuaGlkZUNhcmROdW1iZXIgPyBjYWxjdWxhdGVOdW1iZXJUcmFuc2xhdGlvbihhY2NvdW50TnVtYmVyRWxlbWVudCkgOiAwO1xuXG4gIHNldFRyYW5zZm9ybVN0eWxlKGFjY291bnROdW1iZXJFbGVtZW50LCBhY2NvdW50TnVtYmVyVHJhbnNsYXRpb24pO1xuICBzZXRUcmFuc2Zvcm1TdHlsZShleHBEYXRlRWxlbWVudCwgc3RhdGUudHJhbnNsYXRpb24pO1xuICBzZXRUcmFuc2Zvcm1TdHlsZShjdnZFbGVtZW50LCBzdGF0ZS50cmFuc2xhdGlvbik7XG4gIHNldFRyYW5zZm9ybVN0eWxlKHBvc3RhbENvZGVFbGVtZW50LCBzdGF0ZS50cmFuc2xhdGlvbik7XG59O1xuXG52YXIgbWFrZUZha2VJbnB1dCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGNvbnRhaW5lckVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gIHZhciBpbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICBjb250YWluZXJFbGVtZW50LmNsYXNzTmFtZSA9ICdJbnB1dENvbnRhaW5lcic7XG4gIGNvbnRhaW5lckVsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLW1heCcsICdOdW1iZXInKTtcblxuICBpbnB1dEVsZW1lbnQuY2xhc3NOYW1lID0gJ0lucHV0RWxlbWVudCBpcy1lbXB0eSBJbnB1dCBJbnB1dC0tZW1wdHknO1xuICBpbnB1dEVsZW1lbnQuc2V0QXR0cmlidXRlKCdhdXRvY29tcGxldGUnLCAnZmFrZScpO1xuICBpbnB1dEVsZW1lbnQuc2V0QXR0cmlidXRlKCdhdXRvY29ycmVjdCcsICdvZmYnKTtcbiAgaW5wdXRFbGVtZW50LnNldEF0dHJpYnV0ZSgnc3BlbGxjaGVjaycsICdmYWxzZScpO1xuICBpbnB1dEVsZW1lbnQuc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICdkaXNhYmxlZCcpO1xuICBpbnB1dEVsZW1lbnQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQnKTtcbiAgaW5wdXRFbGVtZW50LnNldEF0dHJpYnV0ZSgncGxhY2Vob2xkZXInLCAnTnVtYmVyJyk7XG4gIGlucHV0RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgJycpO1xuXG4gIGNvbnRhaW5lckVsZW1lbnQuYXBwZW5kQ2hpbGQoaW5wdXRFbGVtZW50KTtcblxuICByZXR1cm4gY29udGFpbmVyRWxlbWVudDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhZGp1c3RUcmFuc2Zvcm1hdGlvbjogYWRqdXN0VHJhbnNmb3JtYXRpb24sXG4gIG1ha2VGYWtlSW5wdXQ6IG1ha2VGYWtlSW5wdXRcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBhc3NpZ24gPSByZXF1aXJlKCcuLi8uLi9saWIvYXNzaWduJykuYXNzaWduO1xudmFyIEJ1cyA9IHJlcXVpcmUoJy4uLy4uL2xpYi9idXMnKTtcbnZhciBhc3NlbWJsZUlGcmFtZXMgPSByZXF1aXJlKCcuLi8uLi9saWIvYXNzZW1ibGUtaWZyYW1lcycpO1xudmFyIGNsYXNzbGlzdCA9IHJlcXVpcmUoJy4uLy4uL2xpYi9jbGFzc2xpc3QnKTtcbnZhciBDbGllbnQgPSByZXF1aXJlKCcuLi8uLi9jbGllbnQvY2xpZW50Jyk7XG52YXIgaW5qZWN0V2l0aEFsbG93bGlzdCA9IHJlcXVpcmUoJ2luamVjdC1zdHlsZXNoZWV0JykuaW5qZWN0V2l0aEFsbG93bGlzdDtcbnZhciBDcmVkaXRDYXJkRm9ybSA9IHJlcXVpcmUoJy4vbW9kZWxzL2NyZWRpdC1jYXJkLWZvcm0nKS5DcmVkaXRDYXJkRm9ybTtcbnZhciBGaWVsZENvbXBvbmVudCA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9maWVsZC1jb21wb25lbnQnKS5GaWVsZENvbXBvbmVudDtcbnZhciBTZWFtbGVzc3BheUVycm9yID0gcmVxdWlyZSgnLi4vLi4vbGliL3NlYW1sZXNzcGF5LWVycm9yJyk7XG52YXIgY29uc3RhbnRzID0gcmVxdWlyZSgnLi4vc2hhcmVkL2NvbnN0YW50cycpO1xudmFyIGVycm9ycyA9IHJlcXVpcmUoJy4uL3NoYXJlZC9lcnJvcnMnKTtcbnZhciByZXF1ZXN0c1NlcXVlbmNlID0gcmVxdWlyZSgnLi4vLi4vbGliL3JlcXVlc3RzLXNlcXVlbmNlJyk7XG52YXIgbWFrZUZha2VJbnB1dCA9IHJlcXVpcmUoJy4vaGVscGVycycpLm1ha2VGYWtlSW5wdXQ7XG5cbnZhciB3aGl0ZWxpc3RlZEZpZWxkcyA9IGNvbnN0YW50cy53aGl0ZWxpc3RlZEZpZWxkcztcbnZhciB3aGl0ZWxpc3RlZFN0eWxlcyA9IGNvbnN0YW50cy53aGl0ZWxpc3RlZFN0eWxlcztcbnZhciBldmVudHMgPSBjb25zdGFudHMuZXZlbnRzO1xudmFyIHJlcXVlc3RUeXBlcyA9IGNvbnN0YW50cy5yZXF1ZXN0VHlwZXM7XG52YXIgUEFZTUVOVF9UWVBFX0NSRURJVF9DQVJEID0gY29uc3RhbnRzLlBBWU1FTlRfVFlQRV9DUkVESVRfQ0FSRDtcblxuZnVuY3Rpb24gaW5pdGlhbGl6ZShjYXJkRm9ybSkge1xuICB2YXIgZmllbGRDb21wb25lbnQ7XG4gIHZhciBjYXJkQnJhbmRJY29uQ29tcG9uZW50O1xuICB2YXIgY29tcG9uZW50cztcbiAgdmFyIHJvb3RFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIHZhciBjYXJkRmllbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgdmFyIGNhcmRGaWVsZElucHV0Q29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIHZhciBmb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZm9ybScpO1xuXG4gIGluamVjdFdpdGhBbGxvd2xpc3QoXG4gICAgY2FyZEZvcm0uY29uZmlndXJhdGlvbi5zdHlsZXMsXG4gICAgd2hpdGVsaXN0ZWRTdHlsZXNcbiAgKTtcblxuICByb290RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2lkJywgJ3Jvb3QnKTtcblxuICBjYXJkRmllbGQuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICctMScpO1xuICBjYXJkRmllbGQuY2xhc3NOYW1lID0gJ0NhcmRGaWVsZCBDYXJkRmllbGQtLWx0cic7XG5cbiAgY2FyZEZpZWxkSW5wdXRDb250YWluZXIuY2xhc3NOYW1lID0gJ0NhcmRGaWVsZC1pbnB1dC13cmFwcGVyIGlzLXJlYWR5LXRvLXNsaWRlJztcbiAgY2FyZEZpZWxkSW5wdXRDb250YWluZXIuc2V0QXR0cmlidXRlKCdkaXInLCAnbHRyJyk7XG5cbiAgZm9ybS5zZXRBdHRyaWJ1dGUoJ2RpcicsICdsdHInKTtcbiAgZm9ybS5zZXRBdHRyaWJ1dGUoJ25vdmFsaWRhdGUnLCB0cnVlKTtcbiAgZm9ybS5zZXRBdHRyaWJ1dGUoJ2FjdGlvbicsICcjJyk7IC8vIEZvcm1zIG5lZWQgYW4gYWN0aW9uIGluIG9yZGVyIHRvIG9mZmVyIGEgXCJnb1wiIGJ1dHRvbiBvbiBzb2Z0IGtleWJvYXJkXG4gIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgfSk7XG4gIGZvcm0uY2xhc3NOYW1lID0gJ0VsZW1lbnRzQXBwIGlzLWVtcHR5JztcblxuICBjYXJkQnJhbmRJY29uQ29tcG9uZW50ID0gbmV3IEZpZWxkQ29tcG9uZW50KHtcbiAgICBjYXJkRm9ybTogY2FyZEZvcm0sXG4gICAgdHlwZTogJ2NhcmRCcmFuZEljb24nLFxuICAgIG5hbWU6ICdjYXJkLWJyYW5kLWljb24nXG4gIH0pO1xuXG4gIGNhcmRGaWVsZC5hcHBlbmRDaGlsZChjYXJkQnJhbmRJY29uQ29tcG9uZW50LmVsZW1lbnQpO1xuXG4gIHdoaXRlbGlzdGVkRmllbGRzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICBmaWVsZENvbXBvbmVudCA9IG5ldyBGaWVsZENvbXBvbmVudCh7XG4gICAgICBjYXJkRm9ybTogY2FyZEZvcm0sXG4gICAgICB0eXBlOiBpdGVtLmZpZWxkLFxuICAgICAgbmFtZTogaXRlbS5uYW1lXG4gICAgfSk7XG5cbiAgICBjYXJkRmllbGRJbnB1dENvbnRhaW5lci5hcHBlbmRDaGlsZChcbiAgICAgIHdyYXBGb3JtRWxlbWVudChmaWVsZENvbXBvbmVudCwgaXRlbSlcbiAgICApO1xuICB9KTtcblxuICBjYXJkRmllbGQuYXBwZW5kQ2hpbGQoY2FyZEZpZWxkSW5wdXRDb250YWluZXIpO1xuICBmb3JtLmFwcGVuZENoaWxkKGNhcmRGaWVsZCk7XG4gIHJvb3RFbGVtZW50LmFwcGVuZENoaWxkKGZvcm0pO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHJvb3RFbGVtZW50KTtcblxuICBjb21wb25lbnRzID0gY2FyZEZvcm0uZ2V0Q29tcG9uZW50cygpO1xuXG4gIE9iamVjdC5rZXlzKGNvbXBvbmVudHMpLmZvckVhY2goZnVuY3Rpb24gKGZpZWxkS2V5KSB7XG4gICAgY29tcG9uZW50c1tmaWVsZEtleV0ucmVuZGVyKCk7XG5cbiAgICBpZiAoY29tcG9uZW50c1tmaWVsZEtleV0uaW5wdXQpIHtcbiAgICAgIGNvbXBvbmVudHNbZmllbGRLZXldLmlucHV0LnJlbmRlcigpO1xuICAgIH1cbiAgfSk7XG5cbiAgc2hpbVBsYWNlaG9sZGVyKCk7XG59XG5cbmZ1bmN0aW9uIHdyYXBGb3JtRWxlbWVudChjb21wb25lbnQsIHBhcmFtcykge1xuICB2YXIgZWxlbWVudCA9IGNvbXBvbmVudC5lbGVtZW50O1xuICB2YXIgY2FyZEZpZWxkQ2hpbGRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICB2YXIgc3BhbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gIHZhciBpbnB1dENvbnRhaW5lckVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG5cbiAgY2FyZEZpZWxkQ2hpbGRFbGVtZW50LmNsYXNzTmFtZSA9ICdDYXJkRmllbGQtJyArIHBhcmFtcy5uYW1lICsgJyBDYXJkRmllbGQtY2hpbGQnO1xuICBpbnB1dENvbnRhaW5lckVsZW1lbnQuY2xhc3NOYW1lID0gJ0lucHV0Q29udGFpbmVyJztcblxuICBpbnB1dENvbnRhaW5lckVsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLW1heCcsIHBhcmFtcy53cmFwcGVyLmRhdGFNYXgpO1xuXG4gIGFzc2lnbihjYXJkRmllbGRDaGlsZEVsZW1lbnQuc3R5bGUsIHBhcmFtcy53cmFwcGVyLnN0eWxlKTtcblxuICBjbGFzc2xpc3QuYWRkKGNvbXBvbmVudC5pbnB1dC5lbGVtZW50LCAnSW5wdXRFbGVtZW50JywgJ2lzLWVtcHR5JywgJ0lucHV0JywgJ0lucHV0LS1lbXB0eScpO1xuXG4gIGlucHV0Q29udGFpbmVyRWxlbWVudC5hcHBlbmRDaGlsZChlbGVtZW50KTtcbiAgc3BhbkVsZW1lbnQuYXBwZW5kQ2hpbGQoaW5wdXRDb250YWluZXJFbGVtZW50KTtcbiAgaWYgKHBhcmFtcy5uYW1lID09PSAnYWNjb3VudC1udW1iZXInKSB7XG4gICAgY29tcG9uZW50LmlucHV0LmZha2VDYXJkTnVtYmVyRWxlbWVudCA9IG1ha2VGYWtlQ2FyZE51bWJlcigpO1xuICAgIGNhcmRGaWVsZENoaWxkRWxlbWVudC5hcHBlbmRDaGlsZChjb21wb25lbnQuaW5wdXQuZmFrZUNhcmROdW1iZXJFbGVtZW50KTtcbiAgfVxuICBjYXJkRmllbGRDaGlsZEVsZW1lbnQuYXBwZW5kQ2hpbGQoc3BhbkVsZW1lbnQpO1xuXG4gIHJldHVybiBjYXJkRmllbGRDaGlsZEVsZW1lbnQ7XG59XG5cbmZ1bmN0aW9uIG1ha2VGYWtlQ2FyZE51bWJlcigpIHtcbiAgdmFyIGZha2VOdW1iZXJFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICB2YXIgbGFzdDRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICB2YXIgbnVtYmVyRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcblxuICBmYWtlTnVtYmVyRWxlbWVudC5jbGFzc05hbWUgPSAnQ2FyZEZpZWxkLWFjY291bnQtbnVtYmVyLWZha2VOdW1iZXInO1xuICBsYXN0NEVsZW1lbnQuY2xhc3NOYW1lID0gJ0NhcmRGaWVsZC1udW1iZXItZmFrZU51bWJlci1sYXN0NCBJbnB1dEVsZW1lbnQnO1xuICBudW1iZXJFbGVtZW50LmNsYXNzTmFtZSA9ICdDYXJkRmllbGQtbnVtYmVyLWZha2VOdW1iZXItbnVtYmVyJztcblxuICBsYXN0NEVsZW1lbnQuYXBwZW5kQ2hpbGQobWFrZUZha2VJbnB1dCgpKTtcblxuICBmYWtlTnVtYmVyRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcblxuICBudW1iZXJFbGVtZW50LmlubmVySFRNTCA9ICdOdW1iZXInO1xuXG4gIGZha2VOdW1iZXJFbGVtZW50LmFwcGVuZENoaWxkKGxhc3Q0RWxlbWVudCk7XG4gIGZha2VOdW1iZXJFbGVtZW50LmFwcGVuZENoaWxkKG51bWJlckVsZW1lbnQpO1xuXG4gIHJldHVybiBmYWtlTnVtYmVyRWxlbWVudDtcbn1cblxuZnVuY3Rpb24gc2hpbVBsYWNlaG9sZGVyKCkge1xuICB2YXIgaW5wdXQ7XG5cbiAgaWYgKCFnbG9iYWwucGxhY2Vob2xkZXJTaGltKSB7IHJldHVybjsgfVxuXG4gIGlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXQnKTtcbiAgaWYgKCFpbnB1dCkgeyByZXR1cm47IH1cblxuICBnbG9iYWwucGxhY2Vob2xkZXJTaGltKGlucHV0KTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlKCkge1xuICB2YXIgY29tcG9uZW50SWQgPSBsb2NhdGlvbi5oYXNoLnNsaWNlKDEsIGxvY2F0aW9uLmhhc2gubGVuZ3RoKTtcblxuICBnbG9iYWwuYnVzID0gbmV3IEJ1cyh7IGNoYW5uZWw6IGNvbXBvbmVudElkIH0pO1xuICBnbG9iYWwuYnVzLmVtaXQoZXZlbnRzLkZSQU1FX1JFQURZLCBvcmNoZXN0cmF0ZSk7XG59XG5cbmZ1bmN0aW9uIGNvbXBvc2VUb2tlbml6ZXJFcnJvciAocmVzcG9uc2UpIHtcbiAgdmFyIHRva2VuaXplckVycm9yLCBzdGF0dXM7XG5cbiAgc3RhdHVzID0gcmVzcG9uc2UuZGV0YWlscyAmJiByZXNwb25zZS5kZXRhaWxzLmh0dHBTdGF0dXM7XG4gIGlmIChzdGF0dXMgPT09IDQwMykge1xuICAgIHRva2VuaXplckVycm9yID0gcmVzcG9uc2U7XG4gIH0gZWxzZSBpZiAoc3RhdHVzIDwgNTAwKSB7XG4gICAgdG9rZW5pemVyRXJyb3IgPSBuZXcgU2VhbWxlc3NwYXlFcnJvcihlcnJvcnMuQ0FSRF9FTEVNRU5UX0ZBSUxFRF9UT0tFTklaQVRJT04pO1xuICAgIHRva2VuaXplckVycm9yLmRldGFpbHMgPSByZXNwb25zZS5uYW1lID09PSAnU2VhbWxlc3NwYXlFcnJvcicgJiYgcmVzcG9uc2UuZGV0YWlscyA/IHJlc3BvbnNlLmRldGFpbHM6IHsgb3JpZ2luYWxFcnJvcjogcmVzcG9uc2UgfTtcbiAgfSBlbHNlIHtcbiAgICB0b2tlbml6ZXJFcnJvciA9IG5ldyBTZWFtbGVzc3BheUVycm9yKGVycm9ycy5DQVJEX0VMRU1FTlRfVE9LRU5JWkFUSU9OX05FVFdPUktfRVJST1IpO1xuICAgIHRva2VuaXplckVycm9yLmRldGFpbHMgPSByZXNwb25zZS5uYW1lID09PSAnU2VhbWxlc3NwYXlFcnJvcicgJiYgcmVzcG9uc2UuZGV0YWlscyA/IHJlc3BvbnNlLmRldGFpbHM6IHsgb3JpZ2luYWxFcnJvcjogcmVzcG9uc2UgfTtcbiAgfVxuXG4gIHJldHVybiB0b2tlbml6ZXJFcnJvcjtcbn1cblxuZnVuY3Rpb24gY3JlYXRlVG9rZW5pemF0aW9uSGFuZGxlcihjbGllbnQsIGNhcmRGb3JtKSB7XG4gIHJldHVybiBmdW5jdGlvbiAob3B0aW9ucywgcmVwbHkpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICB2YXIgVE9LRU5JWkFUSU9OID0gcmVxdWVzdFR5cGVzLlJFUVVFU1RfVFlQRV9UT0tFTklaQVRJT047XG4gICAgdmFyIGlzRW1wdHkgPSBjYXJkRm9ybS5pc0VtcHR5KCk7XG4gICAgdmFyIGludmFsaWRGaWVsZEtleXMgPSBjYXJkRm9ybS5pbnZhbGlkRmllbGRLZXlzKCk7XG4gICAgdmFyIGlzVmFsaWQgPSBpbnZhbGlkRmllbGRLZXlzLmxlbmd0aCA9PT0gMDtcblxuICAgIGlmIChpc0VtcHR5KSB7XG4gICAgICByZXBseShbXG4gICAgICAgIG5ldyBTZWFtbGVzc3BheUVycm9yKGVycm9ycy5DQVJEX0VMRU1FTlRfRklFTERTX0VNUFRZKVxuICAgICAgXSk7XG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIGlmICghaXNWYWxpZCkge1xuICAgICAgcmVwbHkoW1xuICAgICAgICBuZXcgU2VhbWxlc3NwYXlFcnJvcih7XG4gICAgICAgICAgdHlwZTogZXJyb3JzLkNBUkRfRUxFTUVOVF9GSUVMRFNfSU5WQUxJRC50eXBlLFxuICAgICAgICAgIGNvZGU6IGVycm9ycy5DQVJEX0VMRU1FTlRfRklFTERTX0lOVkFMSUQuY29kZSxcbiAgICAgICAgICBtZXNzYWdlOiBlcnJvcnMuQ0FSRF9FTEVNRU5UX0ZJRUxEU19JTlZBTElELm1lc3NhZ2UsXG4gICAgICAgICAgZGV0YWlsczogeyBpbnZhbGlkRmllbGRLZXlzOiBpbnZhbGlkRmllbGRLZXlzIH1cbiAgICAgICAgfSlcbiAgICAgIF0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJldHVybiByZXF1ZXN0c1NlcXVlbmNlKGNsaWVudCwgW1xuICAgICAge1xuICAgICAgICBhcGk6ICd0b2tlbml6ZXJBcGknLFxuICAgICAgICBtZXRob2Q6ICdwb3N0JyxcbiAgICAgICAgZW5kcG9pbnQ6ICd0b2tlbnMnLFxuICAgICAgICBnZXREYXRhOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIGFzc2lnbihcbiAgICAgICAgICAgIGNhcmRGb3JtLmdldENhcmREYXRhKHsgcmVxdWVzdFR5cGU6IFRPS0VOSVpBVElPTiwgZXh0cmFEYXRhOiBvcHRpb25zIH0pLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBwYXltZW50VHlwZTogUEFZTUVOVF9UWVBFX0NSRURJVF9DQVJEXG4gICAgICAgICAgICB9XG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIF0pLnRoZW4oZnVuY3Rpb24gKHJlc3VsdHMpIHtcbiAgICAgIHZhciByZXNwb25zZSA9IHJlc3VsdHNbMF07XG4gICAgICBpZiAocmVzcG9uc2UgaW5zdGFuY2VvZiBFcnJvciB8fCAocmVzcG9uc2UgJiYgcmVzcG9uc2UubmFtZSA9PT0gJ1NlYW1sZXNzcGF5RXJyb3InKSkge1xuICAgICAgICByZXBseShbXG4gICAgICAgICAgY29tcG9zZVRva2VuaXplckVycm9yKHJlc3BvbnNlKVxuICAgICAgICBdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlcGx5KFtudWxsLCBhc3NpZ24oe30sIHJlc3BvbnNlKV0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xufVxuXG5mdW5jdGlvbiBvcmNoZXN0cmF0ZShjb25maWd1cmF0aW9uKSB7XG4gIHZhciBjbGllbnQgPSBuZXcgQ2xpZW50KGNvbmZpZ3VyYXRpb24uY2xpZW50KTtcbiAgdmFyIGNhcmRGb3JtID0gbmV3IENyZWRpdENhcmRGb3JtKGNvbmZpZ3VyYXRpb24pO1xuICB2YXIgaWZyYW1lID0gYXNzZW1ibGVJRnJhbWVzLmFzc2VtYmxlSUZyYW1lcyh3aW5kb3cucGFyZW50KS5zaGlmdCgpO1xuICBpZiAoaWZyYW1lKSBpZnJhbWUuc2VhbWxlc3NwYXkuY2FyZEVsZW1lbnQuaW5pdGlhbGl6ZShjYXJkRm9ybSk7XG5cbiAgZ2xvYmFsLmJ1cy5vbihldmVudHMuVE9LRU5JWkFUSU9OX1JFUVVFU1QsIGZ1bmN0aW9uIChvcHRpb25zLCByZXBseSkge1xuICAgIHZhciB0b2tlbml6YXRpb25IYW5kbGVyID0gY3JlYXRlVG9rZW5pemF0aW9uSGFuZGxlcihjbGllbnQsIGNhcmRGb3JtKTtcblxuICAgIHRva2VuaXphdGlvbkhhbmRsZXIob3B0aW9ucywgcmVwbHkpO1xuICB9KTtcblxuICAvLyBHbG9iYWxpemUgY2FyZEZvcm0gaXMgZ2xvYmFsIHNvIG90aGVyIGNvbXBvbmVudHMgKFVuaW9uUGF5KSBjYW4gYWNjZXNzIGl0XG4gIGdsb2JhbC5jYXJkRm9ybSA9IGNhcmRGb3JtO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaW5pdGlhbGl6ZTogaW5pdGlhbGl6ZSxcbiAgY3JlYXRlOiBjcmVhdGUsXG4gIG9yY2hlc3RyYXRlOiBvcmNoZXN0cmF0ZSxcbiAgY3JlYXRlVG9rZW5pemF0aW9uSGFuZGxlcjogY3JlYXRlVG9rZW5pemF0aW9uSGFuZGxlclxufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBnZXRDYXJkVHlwZXMgPSByZXF1aXJlKCdjcmVkaXQtY2FyZC10eXBlJyk7XG52YXIgYXNzaWduID0gcmVxdWlyZSgnLi8uLi8uLi8uLi9saWIvYXNzaWduJykuYXNzaWduO1xudmFyIGNsYXNzbGlzdCA9IHJlcXVpcmUoJy4vLi4vLi4vLi4vbGliL2NsYXNzbGlzdCcpO1xudmFyIEV2ZW50ZWRNb2RlbCA9IHJlcXVpcmUoJy4vZXZlbnRlZC1tb2RlbCcpO1xudmFyIGNvbXBhcmVQb3NzaWJsZUNhcmRUeXBlcyA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYi9jb21wYXJlLXBvc3NpYmxlLWNhcmQtdHlwZXMnKTtcbnZhciB2YWxpZGF0b3JzID0gcmVxdWlyZSgnLi4vdmFsaWRhdG9ycycpO1xudmFyIGNvbnN0YW50cyA9IHJlcXVpcmUoJy4uLy4uL3NoYXJlZC9jb25zdGFudHMnKTtcbnZhciBjb21tb24gPSByZXF1aXJlKCcuLi8uLi9zaGFyZWQvY29tbW9uJyk7XG52YXIgaGVscGVycyA9IHJlcXVpcmUoJy4uL2hlbHBlcnMnKTtcblxudmFyIGV2ZW50cyA9IGNvbnN0YW50cy5ldmVudHM7XG52YXIgZXh0ZXJuYWxFdmVudHMgPSBjb25zdGFudHMuZXh0ZXJuYWxFdmVudHM7XG52YXIgcmVxdWVzdFR5cGVzID0gY29uc3RhbnRzLnJlcXVlc3RUeXBlcztcbnZhciB3aGl0ZWxpc3RlZEZpZWxkcyA9IGNvbnN0YW50cy53aGl0ZWxpc3RlZEZpZWxkcztcbnZhciB0b2tlbml6ZXJOb25TZWN1cmVGaWVsZHMgPSBjb25zdGFudHMudG9rZW5pemVyTm9uU2VjdXJlRmllbGRzO1xudmFyIGdldE1heExlbmd0aCA9IGNvbW1vbi5nZXRNYXhMZW5ndGg7XG52YXIgYWRqdXN0VHJhbnNmb3JtYXRpb24gPSBoZWxwZXJzLmFkanVzdFRyYW5zZm9ybWF0aW9uO1xuXG5mdW5jdGlvbiBDcmVkaXRDYXJkRm9ybShjb25maWd1cmF0aW9uKSB7XG4gIHRoaXMuX2NvbXBvbmVudHMgPSB7fTtcbiAgdGhpcy5jb25maWd1cmF0aW9uID0gY29uZmlndXJhdGlvbjtcbiAgdGhpcy5fZmllbGRLZXlzID0gd2hpdGVsaXN0ZWRGaWVsZHMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG5cbiAgICByZXR1cm4gaXRlbS5maWVsZDtcbiAgfSk7XG5cbiAgRXZlbnRlZE1vZGVsLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgdGhpcy5fZmllbGRLZXlzLmZvckVhY2goZnVuY3Rpb24gKGZpZWxkKSB7XG4gICAgdmFyIG9uRmllbGRDaGFuZ2UgPSBvbkZpZWxkU3RhdGVDaGFuZ2UodGhpcywgZmllbGQpO1xuICAgIHRoaXMuX3ZhbGlkYXRlRmllbGQoZmllbGQpOyAvLyB0aGF0IHNob3VsZCBzZXQgaXNWYWxpZCBmb3IgZGVmYXVsdCB2YWx1ZXNcbiAgICB0aGlzLm9uKCdjaGFuZ2U6JyArIGZpZWxkICsgJy52YWx1ZScsIG9uRmllbGRWYWx1ZUNoYW5nZSh0aGlzLCBmaWVsZCkpO1xuICAgIHRoaXMub24oJ2NoYW5nZTonICsgZmllbGQgKyAnLmlzRm9jdXNlZCcsIG9uRmllbGRGb2N1c0NoYW5nZSh0aGlzLCBmaWVsZCkpO1xuICAgIHRoaXMub24oJ2NoYW5nZTonICsgZmllbGQgKyAnLmlzRW1wdHknLCBvbkVtcHR5Q2hhbmdlKHRoaXMsIGZpZWxkKSk7XG4gICAgdGhpcy5vbignY2hhbmdlOicgKyBmaWVsZCArICcuaXNWYWxpZCcsIG9uRmllbGRDaGFuZ2UpO1xuICAgIHRoaXMub24oJ2NoYW5nZTonICsgZmllbGQgKyAnLmlzUG90ZW50aWFsbHlWYWxpZCcsIG9uRmllbGRDaGFuZ2UpO1xuICB9LmJpbmQodGhpcykpO1xuXG4gIHRoaXMub24oJ2tleWRvd24nKTtcbiAgdGhpcy5vbignY2hhbmdlOmFjY291bnROdW1iZXIudmFsdWUnLCB0aGlzLl9vbk51bWJlckNoYW5nZSk7XG4gIHRoaXMub24oJ2NoYW5nZTpwb3NzaWJsZUNhcmRUeXBlcycsIG9uQ2FyZFR5cGVDaGFuZ2UodGhpcywgJ2FjY291bnROdW1iZXInKSk7XG4gIHRoaXMub24oJ2NoYW5nZTpmb2N1c2VkRmllbGQnLCBvbkZvY3VzZWRGaWVsZENoYW5nZSh0aGlzKSk7XG59XG5cbkNyZWRpdENhcmRGb3JtLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXZlbnRlZE1vZGVsLnByb3RvdHlwZSk7XG5DcmVkaXRDYXJkRm9ybS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBDcmVkaXRDYXJkRm9ybTtcblxuQ3JlZGl0Q2FyZEZvcm0ucHJvdG90eXBlLnJlc2V0QXR0cmlidXRlcyA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMuX2ZpZWxkS2V5cy5yZWR1Y2UoZnVuY3Rpb24gKHJlc3VsdCwgZmllbGQpIHtcbiAgICByZXN1bHRbZmllbGRdID0ge1xuICAgICAgdmFsdWU6ICcnLFxuICAgICAgaXNGb2N1c2VkOiBmYWxzZSxcbiAgICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgICAgaXNQb3RlbnRpYWxseVZhbGlkOiB0cnVlLFxuICAgICAgaXNFbXB0eTogdHJ1ZVxuICAgIH07XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LmJpbmQodGhpcyksIHsgcG9zc2libGVDYXJkVHlwZXM6IGdldENhcmRUeXBlcygnJykgfSk7XG59O1xuXG5DcmVkaXRDYXJkRm9ybS5wcm90b3R5cGUuZW1pdEV2ZW50ID0gZnVuY3Rpb24gKGZpZWxkS2V5LCBldmVudFR5cGUsIGV4dHJhKSB7XG4gIHZhciBjYXJkcztcbiAgdmFyIHBvc3NpYmxlQ2FyZFR5cGVzID0gdGhpcy5nZXQoJ3Bvc3NpYmxlQ2FyZFR5cGVzJyk7XG4gIHZhciBmaWVsZHMgPSB0aGlzLl9maWVsZEtleXMucmVkdWNlKGZ1bmN0aW9uIChyZXN1bHQsIGtleSkge1xuICAgIHZhciBmaWVsZERhdGEgPSB0aGlzLmdldChrZXkpO1xuXG4gICAgcmVzdWx0W2tleV0gPSB7XG4gICAgICBpc0VtcHR5OiBmaWVsZERhdGEuaXNFbXB0eSxcbiAgICAgIGlzVmFsaWQ6IGZpZWxkRGF0YS5pc1ZhbGlkLFxuICAgICAgaXNQb3RlbnRpYWxseVZhbGlkOiBmaWVsZERhdGEuaXNQb3RlbnRpYWxseVZhbGlkLFxuICAgICAgaXNGb2N1c2VkOiBmaWVsZERhdGEuaXNGb2N1c2VkXG4gICAgfTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0uYmluZCh0aGlzKSwge30pO1xuICBjYXJkcyA9IHBvc3NpYmxlQ2FyZFR5cGVzLm1hcChmdW5jdGlvbiAoY2FyZFR5cGUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmljZVR5cGU6IGNhcmRUeXBlLm5pY2VUeXBlLFxuICAgICAgdHlwZTogY2FyZFR5cGUudHlwZSxcbiAgICAgIGNvZGU6IGNhcmRUeXBlLmNvZGVcbiAgICB9O1xuICB9KTtcblxuICBnbG9iYWwuYnVzLmVtaXQoZXZlbnRzLklOUFVUX0VWRU5ULCB7XG4gICAgbWVyY2hhbnRQYXlsb2FkOiB7XG4gICAgICBjYXJkczogY2FyZHMsXG4gICAgICBlbWl0dGVkQnk6IGZpZWxkS2V5LFxuICAgICAgZmllbGRzOiBmaWVsZHNcbiAgICB9LFxuICAgIGV4dHJhOiBleHRyYSxcbiAgICB0eXBlOiBldmVudFR5cGVcbiAgfSk7XG59O1xuXG5DcmVkaXRDYXJkRm9ybS5wcm90b3R5cGUuc2V0dXBDb21wb25lbnQgPSBmdW5jdGlvbiAoZmllbGRLZXksIGNvbXBvbmVudCkge1xuICB0aGlzLl9jb21wb25lbnRzW2ZpZWxkS2V5XSA9IGNvbXBvbmVudDtcbn07XG5cbkNyZWRpdENhcmRGb3JtLnByb3RvdHlwZS5fb25OdW1iZXJDaGFuZ2UgPSBmdW5jdGlvbiAobnVtYmVyKSB7XG4gIHZhciBwdXJlTnVtYmVyID0gbnVtYmVyLnJlcGxhY2UoL1stXFxzXS9nLCAnJyk7XG4gIHZhciBuZXdQb3NzaWJsZUNhcmRUeXBlcyA9IGdldENhcmRUeXBlcyhwdXJlTnVtYmVyKTtcbiAgdmFyIHJlc3RyaWN0TGVuZ3RoID0gZnVuY3Rpb24gKHBvc3NpYmxlQ2FyZCkge1xuICAgIHZhciBuZXdMZW5ndGggPSAocG9zc2libGVDYXJkLmxlbmd0aHMgfHwgW10pLmZpbHRlcihmdW5jdGlvbihsZW5ndGgpIHsgcmV0dXJuIGxlbmd0aCA8PSAxNiB9KVxuICAgIHJldHVybiBhc3NpZ24ocG9zc2libGVDYXJkLCB7IGxlbmd0aHM6IG5ld0xlbmd0aCB9KVxuICB9XG4gIG5ld1Bvc3NpYmxlQ2FyZFR5cGVzID0gKG5ld1Bvc3NpYmxlQ2FyZFR5cGVzIHx8IFtdKS5tYXAocmVzdHJpY3RMZW5ndGgpXG5cbiAgdmFyIG9sZFBvc3NpYmxlQ2FyZFR5cGVzID0gdGhpcy5nZXQoJ3Bvc3NpYmxlQ2FyZFR5cGVzJyk7XG4gIGlmICghY29tcGFyZVBvc3NpYmxlQ2FyZFR5cGVzKG5ld1Bvc3NpYmxlQ2FyZFR5cGVzLCBvbGRQb3NzaWJsZUNhcmRUeXBlcykpIHtcbiAgICB0aGlzLnNldCgncG9zc2libGVDYXJkVHlwZXMnLCBuZXdQb3NzaWJsZUNhcmRUeXBlcyk7XG4gIH1cbn07XG5cbkNyZWRpdENhcmRGb3JtLnByb3RvdHlwZS5fdmFsaWRhdGVGaWVsZCA9IGZ1bmN0aW9uIChmaWVsZEtleSkge1xuICB2YXIgdmFsaWRhdGlvblJlc3VsdDtcbiAgdmFyIHZhbHVlID0gdGhpcy5nZXQoZmllbGRLZXkgKyAnLnZhbHVlJyk7XG4gIHZhciB2YWxpZGF0ZSA9IHZhbGlkYXRvcnNbZmllbGRLZXldO1xuXG4gIHZhbGlkYXRpb25SZXN1bHQgPSB2YWxpZGF0ZSh2YWx1ZSwgdGhpcyk7XG5cbiAgdGhpcy5zZXQoZmllbGRLZXkgKyAnLmlzVmFsaWQnLCB2YWxpZGF0aW9uUmVzdWx0LmlzVmFsaWQpO1xuICB0aGlzLnNldChmaWVsZEtleSArICcuaXNQb3RlbnRpYWxseVZhbGlkJywgdmFsaWRhdGlvblJlc3VsdC5pc1BvdGVudGlhbGx5VmFsaWQpO1xuXG4gIHJldHVybiB2YWxpZGF0aW9uUmVzdWx0O1xufTtcblxuQ3JlZGl0Q2FyZEZvcm0ucHJvdG90eXBlLmdldE1heExlbmd0aCA9IGZ1bmN0aW9uIChmaWVsZE5hbWUpIHtcbiAgcmV0dXJuIGdldE1heExlbmd0aChmaWVsZE5hbWUpO1xufTtcblxuQ3JlZGl0Q2FyZEZvcm0ucHJvdG90eXBlLmdldENhcmREYXRhID0gZnVuY3Rpb24gKHBhcmFtcykge1xuICB2YXIgVE9LRU5JWkFUSU9OID0gcmVxdWVzdFR5cGVzLlJFUVVFU1RfVFlQRV9UT0tFTklaQVRJT047XG4gIHZhciBleHRyYUZpZWxkcztcbiAgdmFyIGV4dHJhRGF0YTtcbiAgdmFyIHJlc3VsdCA9IHt9O1xuXG4gIHBhcmFtcyA9IHBhcmFtcyB8fCB7IHJlcXVlc3RUeXBlOiBUT0tFTklaQVRJT04sIGV4dHJhRGF0YToge30gfTtcbiAgZXh0cmFEYXRhID0gcGFyYW1zLmV4dHJhRGF0YSB8fCB7fTtcbiAgZXh0cmFGaWVsZHMgPSBPYmplY3Qua2V5cyhleHRyYURhdGEpO1xuXG4gIGZ1bmN0aW9uIGluamVjdFBvc3RhbENvZGUoZGF0YSwgcG9zdGFsQ29kZSkge1xuICAgIGlmICghcG9zdGFsQ29kZSkgcmV0dXJuIGRhdGE7XG4gICAgdmFyIGJpbGxpbmdBZGRyZXNzID0geyBwb3N0YWxDb2RlOiBwb3N0YWxDb2RlIH07XG4gICAgZGF0YS5iaWxsaW5nQWRkcmVzcyA9IGRhdGEuYmlsbGluZ0FkZHJlc3MgPyBhc3NpZ24oZGF0YS5iaWxsaW5nQWRkcmVzcywgYmlsbGluZ0FkZHJlc3MpIDogYmlsbGluZ0FkZHJlc3NcbiAgICBkZWxldGUgZGF0YS5wb3N0YWxDb2RlO1xuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICAvLyBTZXQgRXh0cmEgRmllbGRzXG4gIHJlc3VsdCA9IGV4dHJhRmllbGRzLnJlZHVjZShmdW5jdGlvbiAoYWNjdW0sIGZpZWxkKSB7XG4gICAgdmFyIGZpZWxkRGF0YSA9IHt9O1xuICAgIGlmIChwYXJhbXMucmVxdWVzdFR5cGUgPT09IFRPS0VOSVpBVElPTiAmJiB0b2tlbml6ZXJOb25TZWN1cmVGaWVsZHMuaW5kZXhPZihmaWVsZCkgPT09IC0xKSB7XG4gICAgICByZXR1cm4gYWNjdW07XG4gICAgfVxuICAgIGZpZWxkRGF0YVtmaWVsZF0gPSBleHRyYURhdGFbZmllbGRdO1xuXG4gICAgcmV0dXJuIHRoaXMuX2ZpZWxkS2V5cy5pbmRleE9mKGZpZWxkKSAhPT0gLTEgPyBhY2N1bSA6IGFzc2lnbihhY2N1bSwgZmllbGREYXRhKTtcbiAgfS5iaW5kKHRoaXMpLCByZXN1bHQpO1xuXG4gIHRoaXMuX2ZpZWxkS2V5cy5yZWR1Y2UoXG4gICAgZnVuY3Rpb24gKHJlZHVjZWRSZXN1bHQsIG5hbWUpIHtcbiAgICAgIHZhciB2YWx1ZSA9IHRoaXMuZ2V0KG5hbWUgKyAnLnZhbHVlJyk7XG4gICAgICBpZiAodmFsdWUudHJpbSgpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmVkdWNlZFJlc3VsdFtuYW1lXSA9IHZhbHVlLnRyaW0oKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5hbWUgPT09ICdwb3N0YWxDb2RlJyA/IGluamVjdFBvc3RhbENvZGUocmVkdWNlZFJlc3VsdCwgcmVkdWNlZFJlc3VsdFtuYW1lXSk6IHJlZHVjZWRSZXN1bHQ7XG4gICAgfS5iaW5kKHRoaXMpLFxuICAgIHJlc3VsdFxuICApO1xuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5DcmVkaXRDYXJkRm9ybS5wcm90b3R5cGUuZ2V0RmllbGRzID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gW10uY29uY2F0KHRoaXMuX2ZpZWxkS2V5cyk7XG59O1xuXG5DcmVkaXRDYXJkRm9ybS5wcm90b3R5cGUuaXNFbXB0eSA9IGZ1bmN0aW9uICgpIHtcblxuICByZXR1cm4gdGhpcy5fZmllbGRLZXlzXG4gICAgLmV2ZXJ5KGZ1bmN0aW9uIChrZXkpIHtcblxuICAgICAgcmV0dXJuIHRoaXMuZ2V0KGtleSkudmFsdWUubGVuZ3RoID09PSAwO1xuICAgIH0uYmluZCh0aGlzKSk7XG59O1xuXG5DcmVkaXRDYXJkRm9ybS5wcm90b3R5cGUuaXNWYWxpZCA9IGZ1bmN0aW9uICgpIHtcblxuICByZXR1cm4gdGhpcy5fZmllbGRLZXlzXG4gICAgLmV2ZXJ5KGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHRoaXMuX3ZhbGlkYXRlRmllbGQoa2V5KTtcblxuICAgICAgcmV0dXJuIHRoaXMuZ2V0KGtleSkuaXNWYWxpZDtcbiAgICB9LmJpbmQodGhpcykpO1xufTtcblxuQ3JlZGl0Q2FyZEZvcm0ucHJvdG90eXBlLmlzRm9jdXNlZCA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIEJvb2xlYW4odGhpcy5nZXQoJ2ZvY3VzZWRGaWVsZCcpKTtcbn07XG5cbkNyZWRpdENhcmRGb3JtLnByb3RvdHlwZS5pbnZhbGlkRmllbGRLZXlzID0gZnVuY3Rpb24gKCkge1xuXG4gIHJldHVybiB0aGlzLl9maWVsZEtleXMuZmlsdGVyKGZ1bmN0aW9uIChrZXkpIHtcbiAgICB0aGlzLl92YWxpZGF0ZUZpZWxkKGtleSk7XG5cbiAgICByZXR1cm4gIXRoaXMuZ2V0KGtleSkuaXNWYWxpZDtcbiAgfS5iaW5kKHRoaXMpKTtcbn07XG5cbkNyZWRpdENhcmRGb3JtLnByb3RvdHlwZS5nZXRDb21wb25lbnRzID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5fY29tcG9uZW50cztcbn07XG5cbkNyZWRpdENhcmRGb3JtLnByb3RvdHlwZS5vbktleVVwID0gZnVuY3Rpb24gKGZpZWxkKSB7XG4gIHZhciBmb3JtID0gdGhpcztcblxuICByZXR1cm4gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgdmFyIGlzVmFsaWQgPSBmb3JtLmdldChmaWVsZCArICcuaXNWYWxpZCcpO1xuICAgIHZhciBrZXlDb2RlID0gZXZlbnQua2V5Q29kZTtcbiAgICB2YXIgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xuICAgIHZhciB2YWx1ZSA9IHRhcmdldC52YWx1ZTtcbiAgICB2YXIgZmllbGRMZW5ndGggPSBTdHJpbmcodmFsdWUpLmxlbmd0aDtcbiAgICB2YXIgaXNFbmQgPSB0YXJnZXQuc2VsZWN0aW9uRW5kID09PSB0YXJnZXQubWF4TGVuZ3RoO1xuICAgIHZhciBpc1N0YXJ0ID0gdGFyZ2V0LnNlbGVjdGlvbkVuZCA9PT0gMDtcblxuICAgIGlmICgoaXNWYWxpZCAmJiBpc0VuZCAmJiBrZXlDb2RlICE9PSAzOSkgfHwgKGtleUNvZGUgPT09IDM5ICYmIGlzRW5kKSkge1xuICAgICAgbW92ZUZvY3VzKDEsIGZpZWxkKTtcbiAgICB9XG4gICAgaWYgKChrZXlDb2RlID09PSA4ICYmIGZpZWxkTGVuZ3RoID09PSAwKSB8fCBrZXlDb2RlID09PSAzNyAmJiBpc1N0YXJ0KSB7XG4gICAgICBtb3ZlRm9jdXMoLTEsIGZpZWxkKTtcbiAgICB9XG4gIH07XG59O1xuXG5DcmVkaXRDYXJkRm9ybS5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKCkge1xuICB2YXIgZm9ybUVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdmb3JtJyk7XG4gIGlmICghZm9ybUVsZW1lbnQpIHJldHVybjtcblxuICBhZGp1c3RUcmFuc2Zvcm1hdGlvbih0aGlzLCBmb3JtRWxlbWVudCk7XG4gIGNsYXNzbGlzdC50b2dnbGUoZm9ybUVsZW1lbnQsICdpcy1lbXB0eScsIHRoaXMuaXNFbXB0eSgpKTtcbiAgY2xhc3NsaXN0LnRvZ2dsZShmb3JtRWxlbWVudCwgJ2lzLWZvY3VzZWQnLCB0aGlzLmlzRm9jdXNlZCgpKTtcbiAgY2xhc3NsaXN0LnRvZ2dsZShmb3JtRWxlbWVudCwgJ2lzLWludmFsaWQnLCAhdGhpcy5pc1ZhbGlkKCkgJiYgIXRoaXMuaXNFbXB0eSgpKTtcbiAgY2xhc3NsaXN0LnRvZ2dsZShmb3JtRWxlbWVudCwgJ2lzLWNvbXBsZXRlJywgIXRoaXMuaXNFbXB0eSgpICYmIHRoaXMuaXNWYWxpZCgpKTtcbn07XG5cbmZ1bmN0aW9uIG1vdmVGb2N1cyhkaXIsIGN1cnJlbnRGaWVsZCkge1xuICB2YXIgbmV4dEZpZWxkO1xuICB2YXIgZm9ybUVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdmb3JtJyk7XG5cbiAgbmV4dEZpZWxkID0gd2hpdGVsaXN0ZWRGaWVsZHMucmVkdWNlKGZ1bmN0aW9uIChyZXN1bHQsIGl0ZW0sIGluZGV4KSB7XG4gICAgdmFyIG5leHRJbmRleCA9IGluZGV4ICsgZGlyO1xuICAgIGlmIChpdGVtLmZpZWxkID09PSBjdXJyZW50RmllbGQgJiYgd2hpdGVsaXN0ZWRGaWVsZHNbbmV4dEluZGV4XSkge1xuICAgICAgcmV0dXJuIHdoaXRlbGlzdGVkRmllbGRzW25leHRJbmRleF0uZmllbGQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSwgbnVsbCk7XG5cbiAgaWYgKG5leHRGaWVsZCkge1xuICAgIGZvcm1FbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W2RhdGEtc2VhbWxlc3NwYXktbmFtZT1cIicgKyBuZXh0RmllbGQgKyAnXCJdJykuZm9jdXMoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBvbkZpZWxkVmFsdWVDaGFuZ2UoZm9ybSwgZmllbGRLZXkpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBmb3JtLnNldChmaWVsZEtleSArICcuaXNFbXB0eScsIGZvcm0uZ2V0KGZpZWxkS2V5ICsgJy52YWx1ZScpID09PSAnJyk7XG4gICAgZm9ybS5fdmFsaWRhdGVGaWVsZChmaWVsZEtleSk7XG4gICAgZm9ybS5yZW5kZXIoKTtcbiAgICBmb3JtLmVtaXRFdmVudChmaWVsZEtleSwgZXh0ZXJuYWxFdmVudHMuQ0hBTkdFKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gb25GaWVsZEZvY3VzQ2hhbmdlKGZvcm0sIGZpZWxkKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoaXNGb2N1c2VkKSB7XG4gICAgZm9ybS5fZmllbGRLZXlzLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgaWYgKGtleSA9PT0gZmllbGQpIHsgcmV0dXJuOyB9XG4gICAgICBmb3JtLnNldChrZXkgKyAnLmlzRm9jdXNlZCcsIGZhbHNlKTtcbiAgICB9KTtcbiAgICBmb3JtLmVtaXRFdmVudChmaWVsZCwgaXNGb2N1c2VkID8gZXh0ZXJuYWxFdmVudHMuRk9DVVMgOiBleHRlcm5hbEV2ZW50cy5CTFVSKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gb25DYXJkVHlwZUNoYW5nZShmb3JtLCBmaWVsZCkge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGZvcm0uZW1pdEV2ZW50KGZpZWxkLCBleHRlcm5hbEV2ZW50cy5DQVJEX1RZUEVfQ0hBTkdFKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gb25FbXB0eUNoYW5nZShmb3JtLCBmaWVsZCkge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHZhciBpc0VtcHR5ID0gZm9ybS5nZXQoZmllbGQgKyAnLmlzRW1wdHknKTtcbiAgICB2YXIgZXZlbnQgPSBpc0VtcHR5ID8gZXh0ZXJuYWxFdmVudHMuRU1QVFkgOiBleHRlcm5hbEV2ZW50cy5OT1RfRU1QVFk7XG4gICAgZm9ybS5yZW5kZXIoKTtcbiAgICBmb3JtLmVtaXRFdmVudChmaWVsZCwgZXZlbnQpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBvbkZpZWxkU3RhdGVDaGFuZ2UoZm9ybSwgZmllbGQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBmb3JtLnJlbmRlcigpO1xuICAgIGZvcm0uZW1pdEV2ZW50KGZpZWxkLCBleHRlcm5hbEV2ZW50cy5WQUxJRElUWV9DSEFOR0UpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBvbkZvY3VzZWRGaWVsZENoYW5nZShmb3JtKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgZm9ybS5yZW5kZXIoKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgQ3JlZGl0Q2FyZEZvcm06IENyZWRpdENhcmRGb3JtXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cbmZ1bmN0aW9uIEV2ZW50ZWRNb2RlbCgpIHtcbiAgdGhpcy5fYXR0cmlidXRlcyA9IHRoaXMucmVzZXRBdHRyaWJ1dGVzKCk7XG4gIHRoaXMuX2xpc3RlbmVycyA9IHt9O1xufVxuXG5FdmVudGVkTW9kZWwucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIGdldChjb21wb3VuZEtleSkge1xuICB2YXIgaSwga2V5LCBrZXlzO1xuICB2YXIgdHJhdmVyc2FsID0gdGhpcy5fYXR0cmlidXRlcztcblxuICBpZiAoY29tcG91bmRLZXkgPT0gbnVsbCkgeyByZXR1cm4gdHJhdmVyc2FsOyB9XG5cbiAga2V5cyA9IGNvbXBvdW5kS2V5LnNwbGl0KCcuJyk7XG5cbiAgZm9yIChpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICBrZXkgPSBrZXlzW2ldO1xuXG4gICAgaWYgKCF0cmF2ZXJzYWwuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgIH1cblxuICAgIHRyYXZlcnNhbCA9IHRyYXZlcnNhbFtrZXldO1xuICB9XG5cbiAgcmV0dXJuIHRyYXZlcnNhbDtcbn07XG5cbkV2ZW50ZWRNb2RlbC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gc2V0KGNvbXBvdW5kS2V5LCB2YWx1ZSwgZm9yY2VDaGFuZ2UpIHtcbiAgdmFyIGksIGtleSwga2V5cztcbiAgdmFyIHRyYXZlcnNhbCA9IHRoaXMuX2F0dHJpYnV0ZXM7XG5cbiAga2V5cyA9IGNvbXBvdW5kS2V5LnNwbGl0KCcuJyk7XG5cbiAgZm9yIChpID0gMDsgaSA8IGtleXMubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAga2V5ID0ga2V5c1tpXTtcblxuICAgIGlmICghdHJhdmVyc2FsLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIHRyYXZlcnNhbFtrZXldID0ge307XG4gICAgfVxuXG4gICAgdHJhdmVyc2FsID0gdHJhdmVyc2FsW2tleV07XG4gIH1cbiAga2V5ID0ga2V5c1tpXTtcblxuICBpZiAodHJhdmVyc2FsW2tleV0gIT09IHZhbHVlIHx8IGZvcmNlQ2hhbmdlKSB7XG4gICAgdHJhdmVyc2FsW2tleV0gPSB2YWx1ZTtcbiAgICB0aGlzLmVtaXQoJ2NoYW5nZScpO1xuICAgIGZvciAoaSA9IDE7IGkgPD0ga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAga2V5ID0ga2V5cy5zbGljZSgwLCBpKS5qb2luKCcuJyk7XG4gICAgICB0aGlzLmVtaXQoJ2NoYW5nZTonICsga2V5LCB0aGlzLmdldChrZXkpKTtcbiAgICB9XG4gIH1cbn07XG5cbkV2ZW50ZWRNb2RlbC5wcm90b3R5cGUub24gPSBmdW5jdGlvbiBvbihldmVudCwgaGFuZGxlcikge1xuICB2YXIgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzW2V2ZW50XTtcblxuICBpZiAoIWxpc3RlbmVycykge1xuICAgIHRoaXMuX2xpc3RlbmVyc1tldmVudF0gPSBbaGFuZGxlcl07XG4gIH0gZWxzZSB7XG4gICAgbGlzdGVuZXJzLnB1c2goaGFuZGxlcik7XG4gIH1cbn07XG5cbkV2ZW50ZWRNb2RlbC5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uIGVtaXQoZXZlbnQpIHtcbiAgdmFyIGk7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gIHZhciBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnNbZXZlbnRdO1xuXG4gIGlmICghbGlzdGVuZXJzKSB7IHJldHVybjsgfVxuXG4gIGZvciAoaSA9IDA7IGkgPCBsaXN0ZW5lcnMubGVuZ3RoOyBpKyspIHtcbiAgICBsaXN0ZW5lcnNbaV0uYXBwbHkoc2VsZiwgc2xpY2UuY2FsbChhcmdzLCAxKSk7XG4gIH1cbn07XG5cbkV2ZW50ZWRNb2RlbC5wcm90b3R5cGUucmVzZXRBdHRyaWJ1dGVzID0gZnVuY3Rpb24gcmVzZXRBdHRyaWJ1dGVzKCkge1xuICByZXR1cm4ge307XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50ZWRNb2RlbDtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHZhbGlkYXRvciA9IHJlcXVpcmUoJ2NhcmQtdmFsaWRhdG9yJyk7XG5cbmZ1bmN0aW9uIGFjY291bnROdW1iZXIodmFsdWUpIHtcblxuICByZXR1cm4gdmFsaWRhdG9yLm51bWJlcih2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYWNjb3VudE51bWJlcjtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciB2ZXJpZmljYXRpb24gPSByZXF1aXJlKCcuL3ZlcmlmaWNhdGlvbicpO1xudmFyIHZhbGlkYXRvciA9IHJlcXVpcmUoJ2NhcmQtdmFsaWRhdG9yJyk7XG5cbmZ1bmN0aW9uIHVuaXEoYXJyYXkpIHtcbiAgcmV0dXJuIGFycmF5LmZpbHRlcihmdW5jdGlvbiAoaXRlbSwgcG9zaXRpb24sIGFycikge1xuICAgIHJldHVybiBhcnIuaW5kZXhPZihpdGVtKSA9PT0gcG9zaXRpb247XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBjdnYgKHZhbHVlLCBjYXJkRm9ybSkge1xuICB2YXIgY3Z2U2l6ZTtcbiAgdmFyIGZpZWxkcyA9IGNhcmRGb3JtLmdldEZpZWxkcygpO1xuICB2YXIgaXNWYWxpZCA9IHRydWU7XG5cbiAgaWYgKCF2YWx1ZSkgcmV0dXJuIHZlcmlmaWNhdGlvbihpc1ZhbGlkLCBpc1ZhbGlkKTtcblxuICBpZiAoZmllbGRzLmluZGV4T2YoJ2FjY291bnROdW1iZXInKSA9PT0gLTEpIHsgLy8gQ1ZWIG9ubHlcbiAgICByZXR1cm4gdmFsaWRhdG9yLmN2dih2YWx1ZSwgWzMsIDRdKTtcbiAgfVxuXG4gIGN2dlNpemUgPSBjYXJkRm9ybS5nZXQoJ3Bvc3NpYmxlQ2FyZFR5cGVzJykubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgcmV0dXJuIGl0ZW0uY29kZS5zaXplO1xuICB9KTtcbiAgY3Z2U2l6ZSA9IHVuaXEoY3Z2U2l6ZSk7XG4gIHJldHVybiB2YWxpZGF0b3IuY3Z2KHZhbHVlLCBjdnZTaXplKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjdnY7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB2YWxpZGF0b3IgPSByZXF1aXJlKCdjYXJkLXZhbGlkYXRvcicpO1xuXG5mdW5jdGlvbiBzcGxpdERhdGUoZGF0ZSkge1xuICB2YXIgbW9udGgsIHllYXIsIGxlYWRpbmdEaWdpdDtcblxuICBkYXRlID0gZGF0ZS5yZXBsYWNlKC9bXFwvXFwtXFxzXS9nLCAnJyk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdXNlbGVzcy1lc2NhcGVcbiAgbGVhZGluZ0RpZ2l0ID0gZGF0ZS5jaGFyQXQoMCk7XG5cbiAgaWYgKGRhdGUubGVuZ3RoID09PSAwKSB7XG4gICAgbW9udGggPSB5ZWFyID0gJyc7XG4gIH0gZWxzZSBpZiAobGVhZGluZ0RpZ2l0ID09PSAnMCcgfHwgbGVhZGluZ0RpZ2l0ID09PSAnMScpIHtcbiAgICBtb250aCA9IGRhdGUuc2xpY2UoMCwgMik7XG4gICAgeWVhciA9IGRhdGUuc2xpY2UoMik7XG4gIH0gZWxzZSB7XG4gICAgbW9udGggPSAnMCcgKyBsZWFkaW5nRGlnaXQ7XG4gICAgeWVhciA9IGRhdGUuc2xpY2UoMSk7XG4gIH1cblxuICByZXR1cm4geyBtb250aDogbW9udGgsIHllYXI6IHllYXIgfTtcbn1cblxuXG5mdW5jdGlvbiBleHBpcmF0aW9uRGF0ZSAodmFsdWUpIHtcbiAgcmV0dXJuIHZhbGlkYXRvci5leHBpcmF0aW9uRGF0ZShzcGxpdERhdGUodmFsdWUpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBpcmF0aW9uRGF0ZTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGV4cERhdGUgPSByZXF1aXJlKCcuL2V4cGlyYXRpb24tZGF0ZScpO1xudmFyIGFjY291bnROdW1iZXIgPSByZXF1aXJlKCcuL2FjY291bnQtbnVtYmVyJyk7XG52YXIgcG9zdGFsQ29kZSA9IHJlcXVpcmUoJy4vcG9zdGFsLWNvZGUnKTtcbnZhciBjdnYgPSByZXF1aXJlKCcuL2N2dicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYWNjb3VudE51bWJlcjogYWNjb3VudE51bWJlcixcbiAgcG9zdGFsQ29kZTogcG9zdGFsQ29kZSxcbiAgY3Z2OiBjdnYsXG4gIGV4cERhdGU6IGV4cERhdGVcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB2YWxpZGF0b3IgPSByZXF1aXJlKCdjYXJkLXZhbGlkYXRvcicpO1xudmFyIHZlcmlmaWNhdGlvbiA9IHJlcXVpcmUoJy4vdmVyaWZpY2F0aW9uJyk7XG5cbmZ1bmN0aW9uIHBvc3RhbENvZGUgKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZS50cmltKCkubGVuZ3RoID09PSAwID8gdmVyaWZpY2F0aW9uKHRydWUsIGZhbHNlKSA6IHZhbGlkYXRvci5wb3N0YWxDb2RlKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwb3N0YWxDb2RlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuZnVuY3Rpb24gdmVyaWZpY2F0aW9uIChpc1ZhbGlkLCBpc1BvdGVudGlhbGx5VmFsaWQpIHtcbiAgcmV0dXJuIHsgaXNWYWxpZDogaXNWYWxpZCwgaXNQb3RlbnRpYWxseVZhbGlkOiBpc1BvdGVudGlhbGx5VmFsaWQgfTtcbn1cbm1vZHVsZS5leHBvcnRzID0gdmVyaWZpY2F0aW9uO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY29uc3RhbnRzID0gcmVxdWlyZSgnLi9jb25zdGFudHMnKTtcblxudmFyIHdoaXRlbGlzdGVkRmllbGRzID0gY29uc3RhbnRzLndoaXRlbGlzdGVkRmllbGRzO1xuXG5mdW5jdGlvbiBnZXRNYXhMZW5ndGgobmFtZSkge1xuICB2YXIgZmllbGREYXRhID0gd2hpdGVsaXN0ZWRGaWVsZHMuZmluZChmdW5jdGlvbiAoaXRlbSkge1xuICAgIHJldHVybiBpdGVtLmZpZWxkID09PSBuYW1lO1xuICB9KSB8fCB7IGRlZmF1bHRNYXhMZW5ndGg6IG51bGwgfTtcblxuICByZXR1cm4gZmllbGREYXRhLmRlZmF1bHRNYXhMZW5ndGg7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBnZXRNYXhMZW5ndGg6IGdldE1heExlbmd0aFxufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8qIGVzbGludC1kaXNhYmxlIG5vLXJlc2VydmVkLWtleXMgKi9cblxudmFyIGVudW1lcmF0ZSA9IHJlcXVpcmUoJy4uLy4uL2xpYi9lbnVtZXJhdGUnKTtcbnZhciBWRVJTSU9OID0gXCJ3ZWItc2RrXCI7XG5cbnZhciByZXF1ZXN0VHlwZXMgPSB7XG4gIFJFUVVFU1RfVFlQRV9UT0tFTklaQVRJT046ICd0b2tlbml6YXRpb24nXG59O1xuXG52YXIgd2hpdGVsaXN0ZWRGaWVsZHMgPSBbXG4gIHtcbiAgICBmaWVsZDogJ2FjY291bnROdW1iZXInLFxuICAgIG5hbWU6ICdhY2NvdW50LW51bWJlcicsXG4gICAgbGFiZWw6ICdDYXJkIE51bWJlcicsXG4gICAgZGVmYXVsdE1heExlbmd0aDogMjIsXG4gICAgd3JhcHBlcjoge1xuICAgICAgZGF0YU1heDogJzQyNDIgNDI0MiA0MjQyIDQyNDIgNDI0MCcsXG4gICAgICBzdHlsZToge1xuICAgICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDBweCknXG4gICAgICB9XG4gICAgfVxuICB9LFxuICB7XG4gICAgZmllbGQ6ICdleHBEYXRlJyxcbiAgICBuYW1lOiAnZXhwLWRhdGUnLFxuICAgIGxhYmVsOiAnRXhwaXJhdGlvbiBEYXRlJyxcbiAgICBkZWZhdWx0TWF4TGVuZ3RoOiA3LFxuICAgIHdyYXBwZXI6IHtcbiAgICAgIGRhdGFNYXg6ICdNTSAvIFlZMCcsXG4gICAgICBzdHlsZToge1xuICAgICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDBweCknXG4gICAgICB9XG4gICAgfVxuICB9LFxuICB7XG4gICAgZmllbGQ6ICdjdnYnLFxuICAgIG5hbWU6ICdjdnYnLFxuICAgIGxhYmVsOiAnQ1ZWJyxcbiAgICBkZWZhdWx0TWF4TGVuZ3RoOiA0LFxuICAgIHdyYXBwZXI6IHtcbiAgICAgIGRhdGFNYXg6ICcwMDAwMCcsXG4gICAgICBzdHlsZToge1xuICAgICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDBweCknXG4gICAgICB9XG4gICAgfVxuICB9LFxuICB7XG4gICAgZmllbGQ6ICdwb3N0YWxDb2RlJyxcbiAgICBuYW1lOiAncG9zdGFsLWNvZGUnLFxuICAgIGxhYmVsOiAnUG9zdGFsIENvZGUnLFxuICAgIGRlZmF1bHRNYXhMZW5ndGg6IDUsXG4gICAgd3JhcHBlcjoge1xuICAgICAgZGF0YU1heDogJzkwMjEwMCcsXG4gICAgICBzdHlsZToge1xuICAgICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDBweCknXG4gICAgICB9XG4gICAgfVxuICB9XG5dO1xuXG52YXIgY2FyZEJyYW5kTWFwID0ge1xuICB2aXNhOiAndmlzYScsXG4gIG1hc3RlcmNhcmQ6ICdtYXN0ZXJjYXJkJyxcbiAgJ2FtZXJpY2FuLWV4cHJlc3MnOiAnYW1leCcsXG4gICdkaW5lcnMtY2x1Yic6ICdkaW5lcnMnLFxuICBkaXNjb3ZlcjogJ2Rpc2NvdmVyJyxcbiAgamNiOiAnamNiJyxcbiAgdW5pb25wYXk6ICd1bmlvbnBheScsXG4gIG1hZXN0cm86ICdtYXN0ZXJjYXJkJyxcbiAgZWxvOiAnZGlzY292ZXInLFxuICBtaXI6ICd1bmtub3duJyxcbiAgaGlwZXI6ICdkaXNjb3ZlcicsXG4gIGhpcGVyY2FyZDogJ2Rpc2NvdmVyJ1xufTtcblxudmFyIHRva2VuaXplck5vblNlY3VyZUZpZWxkcyA9IFtcbiAgJ2JpbGxpbmdBZGRyZXNzJyxcbiAgJ2NvbXBhbnknLFxuICAnZW1haWwnLFxuICAnbmFtZScsXG4gICdwaG9uZU51bWJlcicsXG4gICdjdXN0b21lcicsXG4gICdhY2NvdW50VmFsaWRhdGlvbicsXG4gICdiYW5rQWNjb3VudFR5cGUnLFxuICAncm91dGluZ051bWJlcidcbl07XG5cbnZhciBjb25zdGFudHMgPSB7XG4gIFZFUlNJT046IFZFUlNJT04sXG4gIFBBWU1FTlRfVFlQRV9DUkVESVRfQ0FSRDogJ2NyZWRpdF9jYXJkJyxcbiAgbWF4RXhwaXJhdGlvblllYXJBZ2U6IDMxLFxuICBleHRlcm5hbEV2ZW50czoge1xuICAgIENIQU5HRTogJ2NoYW5nZScsXG4gICAgRk9DVVM6ICdmb2N1cycsXG4gICAgQkxVUjogJ2JsdXInLFxuICAgIEVNUFRZOiAnZW1wdHknLFxuICAgIE5PVF9FTVBUWTogJ25vdEVtcHR5JyxcbiAgICBWQUxJRElUWV9DSEFOR0U6ICd2YWxpZGl0eUNoYW5nZScsXG4gICAgQ0FSRF9UWVBFX0NIQU5HRTogJ2NhcmRUeXBlQ2hhbmdlJ1xuICB9LFxuICBleHRlcm5hbENsYXNzZXM6IHtcbiAgICBGT0NVU0VEOiAnc2VhbWxlc3NwYXktY2FyZC1lbGVtZW50LWZvY3VzZWQnLFxuICAgIElOVkFMSUQ6ICdzZWFtbGVzc3BheS1jYXJkLWVsZW1lbnQtaW52YWxpZCcsXG4gICAgVkFMSUQ6ICdzZWFtbGVzc3BheS1jYXJkLWVsZW1lbnQtdmFsaWQnXG4gIH0sXG4gIGRlZmF1bHRJRnJhbWVTdHlsZToge1xuICAgICdib3JkZXInOiBbJ25vbmUnLCAnaW1wb3J0YW50J10sXG4gICAgJ21hcmdpbic6IFsnMHB4JywgJ2ltcG9ydGFudCddLFxuICAgICdwYWRkaW5nJzogWycwcHgnLCAnaW1wb3J0YW50J10sXG4gICAgJ3dpZHRoJzogWycxcHgnLCAnaW1wb3J0YW50J10sXG4gICAgJ21pbi13aWR0aCc6IFsnMTAwJScsICdpbXBvcnRhbnQnXSxcbiAgICAnb3ZlcmZsb3cnOiBbJ2hpZGRlbicsICdpbXBvcnRhbnQnXSxcbiAgICAnZGlzcGxheSc6IFsnYmxvY2snLCAnaW1wb3J0YW50J10sXG4gICAgJ3VzZXItc2VsZWN0JzogWydub25lJywgJ2ltcG9ydGFudCddLFxuICAgICdoZWlnaHQnOiBbJzE5LjJweCddXG4gIH0sXG4gIHdoaXRlbGlzdGVkU3R5bGVzOiBbXG4gICAgJy1tb3otYXBwZWFyYW5jZScsXG4gICAgJy1tb3otb3N4LWZvbnQtc21vb3RoaW5nJyxcbiAgICAnLW1vei10YXAtaGlnaGxpZ2h0LWNvbG9yJyxcbiAgICAnLW1vei10cmFuc2l0aW9uJyxcbiAgICAnLXdlYmtpdC1hcHBlYXJhbmNlJyxcbiAgICAnLXdlYmtpdC1mb250LXNtb290aGluZycsXG4gICAgJy13ZWJraXQtdGFwLWhpZ2hsaWdodC1jb2xvcicsXG4gICAgJy13ZWJraXQtdHJhbnNpdGlvbicsXG4gICAgJ2FwcGVhcmFuY2UnLFxuICAgICdjb2xvcicsXG4gICAgJ2RpcmVjdGlvbicsXG4gICAgJ2ZvbnQnLFxuICAgICdmb250LWZhbWlseScsXG4gICAgJ2ZvbnQtc2l6ZScsXG4gICAgJ2ZvbnQtc2l6ZS1hZGp1c3QnLFxuICAgICdmb250LXN0cmV0Y2gnLFxuICAgICdmb250LXN0eWxlJyxcbiAgICAnZm9udC12YXJpYW50JyxcbiAgICAnZm9udC12YXJpYW50LWFsdGVybmF0ZXMnLFxuICAgICdmb250LXZhcmlhbnQtY2FwcycsXG4gICAgJ2ZvbnQtdmFyaWFudC1lYXN0LWFzaWFuJyxcbiAgICAnZm9udC12YXJpYW50LWxpZ2F0dXJlcycsXG4gICAgJ2ZvbnQtdmFyaWFudC1udW1lcmljJyxcbiAgICAnZm9udC13ZWlnaHQnLFxuICAgICdsZXR0ZXItc3BhY2luZycsXG4gICAgJ2xpbmUtaGVpZ2h0JyxcbiAgICAnbWFyZ2luJyxcbiAgICAnbWFyZ2luLXRvcCcsXG4gICAgJ21hcmdpbi1yaWdodCcsXG4gICAgJ21hcmdpbi1ib3R0b20nLFxuICAgICdtYXJnaW4tbGVmdCcsXG4gICAgJ29wYWNpdHknLFxuICAgICdvdXRsaW5lJyxcbiAgICAncGFkZGluZycsXG4gICAgJ3BhZGRpbmctdG9wJyxcbiAgICAncGFkZGluZy1yaWdodCcsXG4gICAgJ3BhZGRpbmctYm90dG9tJyxcbiAgICAncGFkZGluZy1sZWZ0JyxcbiAgICAndGV4dC1hbGlnbicsXG4gICAgJ3RleHQtc2hhZG93JyxcbiAgICAndHJhbnNpdGlvbidcbiAgXSxcbiAgd2hpdGVsaXN0ZWRGaWVsZHM6IHdoaXRlbGlzdGVkRmllbGRzLFxuICBjYXJkQnJhbmRNYXA6IGNhcmRCcmFuZE1hcCxcbiAgdG9rZW5pemVyTm9uU2VjdXJlRmllbGRzOiB0b2tlbml6ZXJOb25TZWN1cmVGaWVsZHMsXG4gIHdoaXRlbGlzdGVkQXR0cmlidXRlczoge1xuICAgICdhcmlhLWludmFsaWQnOiAnYm9vbGVhbicsXG4gICAgJ2FyaWEtcmVxdWlyZWQnOiAnYm9vbGVhbicsXG4gICAgZGlzYWJsZWQ6ICdib29sZWFuJyxcbiAgICBwbGFjZWhvbGRlcjogJ3N0cmluZydcbiAgfSxcbiAgYXV0b2NvbXBsZXRlTWFwcGluZ3M6IHtcbiAgICAnYWNjb3VudC1udW1iZXInOiAnY2MtbnVtYmVyJyxcbiAgICAnZXhwLWRhdGUnOiAnY2MtZXhwJyxcbiAgICBjdnY6ICdjYy1jc2MnLFxuICAgICdwb3N0YWwtY29kZSc6ICdiaWxsaW5nIHBvc3RhbC1jb2RlJ1xuICB9LFxuICByZXF1ZXN0VHlwZXM6IHJlcXVlc3RUeXBlc1xufTtcblxuY29uc3RhbnRzLmV2ZW50cyA9IGVudW1lcmF0ZShbXG4gICdBVVRPRklMTF9FWFBJUkFUSU9OX0RBVEUnLFxuICAnRlJBTUVfUkVBRFknLFxuICAnVkFMSURBVEVfU1RSSUNUJyxcbiAgJ0NPTkZJR1VSQVRJT04nLFxuICAnVE9LRU5JWkFUSU9OX1JFUVVFU1QnLFxuICAnSU5QVVRfRVZFTlQnLFxuICAnVFJJR0dFUl9JTlBVVF9GT0NVUycsXG4gICdBRERfQ0xBU1MnLFxuICAnUkVNT1ZFX0NMQVNTJyxcbiAgJ1NFVF9BVFRSSUJVVEUnLFxuICAnUkVNT1ZFX0FUVFJJQlVURScsXG4gICdDTEVBUl9GSUVMRCcsXG5dLCAnY2FyZC1lbGVtZW50OicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbnN0YW50cztcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFNlYW1sZXNzcGF5RXJyb3IgPSByZXF1aXJlKCcuLi8uLi9saWIvc2VhbWxlc3NwYXktZXJyb3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIENBUkRfRUxFTUVOVF9JTlZBTElEX0ZJRUxEX1NFTEVDVE9SOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnQ0FSRF9FTEVNRU5UX0lOVkFMSURfRklFTERfU0VMRUNUT1InLFxuICAgIG1lc3NhZ2U6ICdTZWxlY3RvciBkb2VzIG5vdCByZWZlcmVuY2UgYSB2YWxpZCBET00gbm9kZS4nXG4gIH0sXG4gIENBUkRfRUxFTUVOVF9GSUVMRF9JTlZBTElEOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnQ0FSRF9FTEVNRU5UX0ZJRUxEX0lOVkFMSUQnXG4gIH0sXG4gIENBUkRfRUxFTUVOVF9UT0tFTklaQVRJT05fTkVUV09SS19FUlJPUjoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTkVUV09SSyxcbiAgICBjb2RlOiAnQ0FSRF9FTEVNRU5UX1RPS0VOSVpBVElPTl9ORVRXT1JLX0VSUk9SJyxcbiAgICBtZXNzYWdlOiAnQSB0b2tlbml6YXRpb24gbmV0d29yayBlcnJvciBvY2N1cnJlZC4nXG4gIH0sXG4gIENBUkRfRUxFTUVOVF9GQUlMRURfVE9LRU5JWkFUSU9OOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5DVVNUT01FUixcbiAgICBjb2RlOiAnQ0FSRF9FTEVNRU5UX0ZBSUxFRF9UT0tFTklaQVRJT04nLFxuICAgIG1lc3NhZ2U6ICdUaGUgc3VwcGxpZWQgY2FyZCBkYXRhIGZhaWxlZCB0b2tlbml6YXRpb24uJ1xuICB9LFxuICBDQVJEX0VMRU1FTlRfRklFTERTX0VNUFRZOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5DVVNUT01FUixcbiAgICBjb2RlOiAnQ0FSRF9FTEVNRU5UX0ZJRUxEU19FTVBUWScsXG4gICAgbWVzc2FnZTogJ0FsbCBmaWVsZHMgYXJlIGVtcHR5LiBDYW5ub3QgdG9rZW5pemUgZW1wdHkgY2FyZCBmaWVsZHMuJ1xuICB9LFxuICBDQVJEX0VMRU1FTlRfRklFTERTX0lOVkFMSUQ6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLkNVU1RPTUVSLFxuICAgIGNvZGU6ICdDQVJEX0VMRU1FTlRfRklFTERTX0lOVkFMSUQnLFxuICAgIG1lc3NhZ2U6ICdTb21lIHBheW1lbnQgaW5wdXQgZmllbGRzIGFyZSBpbnZhbGlkLiBDYW5ub3QgdG9rZW5pemUgaW52YWxpZCBjYXJkIGZpZWxkcy4nXG4gIH0sXG4gIENBUkRfRUxFTUVOVF9BVFRSSUJVVEVfTk9UX1NVUFBPUlRFRDoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTUVSQ0hBTlQsXG4gICAgY29kZTogJ0NBUkRfRUxFTUVOVF9BVFRSSUJVVEVfTk9UX1NVUFBPUlRFRCdcbiAgfSxcbiAgQ0FSRF9FTEVNRU5UX0FUVFJJQlVURV9WQUxVRV9OT1RfQUxMT1dFRDoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTUVSQ0hBTlQsXG4gICAgY29kZTogJ0NBUkRfRUxFTUVOVF9BVFRSSUJVVEVfVkFMVUVfTk9UX0FMTE9XRUQnXG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciByZXF1ZXN0ID0gcmVxdWlyZSgnLi9yZXF1ZXN0Jyk7XG52YXIgaXNXaGl0ZWxpc3RlZERvbWFpbiA9IHJlcXVpcmUoJy4uL2xpYi9pcy13aGl0ZWxpc3RlZC1kb21haW4nKTtcbnZhciBTZWFtbGVzc3BheUVycm9yID0gcmVxdWlyZSgnLi4vbGliL3NlYW1sZXNzcGF5LWVycm9yJyk7XG52YXIgY29udmVydFRvU2VhbWxlc3NwYXlFcnJvciA9IHJlcXVpcmUoJy4uL2xpYi9jb252ZXJ0LXRvLXNlYW1sZXNzcGF5LWVycm9yJyk7XG52YXIgYWRkTWV0YWRhdGEgPSByZXF1aXJlKCcuLi9saWIvYWRkLW1ldGFkYXRhJyk7XG52YXIgUHJvbWlzZSA9IHJlcXVpcmUoJy4uL2xpYi9wcm9taXNlJyk7XG52YXIgYXNzaWduID0gcmVxdWlyZSgnLi4vbGliL2Fzc2lnbicpLmFzc2lnbjtcbnZhciBjb25zdGFudHMgPSByZXF1aXJlKCcuL2NvbnN0YW50cycpO1xudmFyIGVycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzJyk7XG52YXIgc2hhcmVkRXJyb3JzID0gcmVxdWlyZSgnLi4vbGliL2Vycm9ycycpO1xudmFyIFZFUlNJT04gPSByZXF1aXJlKCcuLi9saWIvY29uc3RhbnRzJykuVkVSU0lPTjtcblxuLyoqXG4gKiBUaGlzIG9iamVjdCBpcyByZXR1cm5lZCBieSB7QGxpbmsgQ2xpZW50I2dldENvbmZpZ3VyYXRpb258Z2V0Q29uZmlndXJhdGlvbn0uIFRoaXMgaW5mb3JtYXRpb24gaXMgdXNlZCBleHRlbnNpdmVseSBieSBvdGhlciBTZWFtbGVzc3BheSBtb2R1bGVzIHRvIHByb3Blcmx5IGNvbmZpZ3VyZSB0aGVtc2VsdmVzLlxuICogQHR5cGVkZWYge29iamVjdH0gQ2xpZW50fmNvbmZpZ3VyYXRpb25cbiAqIEBwcm9wZXJ0eSB7b2JqZWN0fSBjbGllbnQgVGhlIHNlYW1sZXNzcGF5LXdlYi9jbGllbnQgcGFyYW1ldGVycy5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBjbGllbnQuYXV0aG9yaXphdGlvbiBBIHRva2VuaXphdGlvbktleSBvciBjbGllbnRUb2tlbi5cbiAqIEBwcm9wZXJ0eSB7b2JqZWN0fSBnYXRld2F5Q29uZmlndXJhdGlvbiBHYXRld2F5LXN1cHBsaWVkIGNvbmZpZ3VyYXRpb24uXG4gKiBAcHJvcGVydHkge29iamVjdH0gYW5hbHl0aWNzTWV0YWRhdGEgQW5hbHl0aWNzLXNwZWNpZmljIGRhdGEuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gYW5hbHl0aWNzTWV0YWRhdGEuc2Vzc2lvbklkIFVuaXF1ZWx5IGlkZW50aWZpZXMgYSBicm93c2luZyBzZXNzaW9uLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IGFuYWx5dGljc01ldGFkYXRhLnNka1ZlcnNpb24gVGhlIHNlYW1sZXNzcGF5LmpzIHZlcnNpb24uXG4gKiBAcHJvcGVydHkge3N0cmluZ30gYW5hbHl0aWNzTWV0YWRhdGEubWVyY2hhbnRBcHBJZCBJZGVudGlmaWVzIHRoZSBtZXJjaGFudCdzIHdlYiBhcHAuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gcHJveHlBY2NvdW50SWQgSWRlbnRpZmllcyB0aGUgU3ViIE1lcmNoYW50IEFjY291bnQgSUQuXG4gKi9cblxuLyoqXG4gKiBAY2xhc3NcbiAqIEBwYXJhbSB7Q2xpZW50fmNvbmZpZ3VyYXRpb259IGNvbmZpZ3VyYXRpb24gT3B0aW9uc1xuICogQGRlc2NyaXB0aW9uIDxzdHJvbmc+RG8gbm90IHVzZSB0aGlzIGNvbnN0cnVjdG9yIGRpcmVjdGx5LiBVc2Uge0BsaW5rIG1vZHVsZTpzZWFtbGVzc3BheS13ZWIvY2xpZW50LmNyZWF0ZXxzZWFtbGVzc3BheS5jbGllbnQuY3JlYXRlfSBpbnN0ZWFkLjwvc3Ryb25nPlxuICogQGNsYXNzZGVzYyBUaGlzIGNsYXNzIGlzIHJlcXVpcmVkIGJ5IG1hbnkgb3RoZXIgU2VhbWxlc3NwYXkgY29tcG9uZW50cy4gSXQgc2VydmVzIGFzIHRoZSBiYXNlIEFQSSBsYXllciB0aGF0IGNvbW11bmljYXRlcyB3aXRoIG91ciBzZXJ2ZXJzLiBJdCBpcyBhbHNvIGNhcGFibGUgb2YgYmVpbmcgdXNlZCB0byBmb3JtdWxhdGUgZGlyZWN0IGNhbGxzIHRvIG91ciBzZXJ2ZXJzLCBzdWNoIGFzIGRpcmVjdCBjcmVkaXQgY2FyZCB0b2tlbml6YXRpb24uIFNlZSB7QGxpbmsgQ2xpZW50I3JlcXVlc3R9LlxuICovXG5mdW5jdGlvbiBDbGllbnQoY29uZmlndXJhdGlvbikge1xuICB2YXJcbiAgICBjb25maWd1cmF0aW9uSlNPTixcbiAgICBnYXRld2F5Q29uZmlndXJhdGlvbixcbiAgICBzZWFtbGVzc3BheUFwaUNvbmZpZ3VyYXRpb247XG5cbiAgY29uZmlndXJhdGlvbiA9IGNvbmZpZ3VyYXRpb24gfHwge307XG5cbiAgY29uZmlndXJhdGlvbkpTT04gPSBKU09OLnN0cmluZ2lmeShjb25maWd1cmF0aW9uKTtcbiAgZ2F0ZXdheUNvbmZpZ3VyYXRpb24gPSBjb25maWd1cmF0aW9uLmdhdGV3YXlDb25maWd1cmF0aW9uO1xuXG4gIGlmICghZ2F0ZXdheUNvbmZpZ3VyYXRpb24pIHtcbiAgICB0aHJvdyBuZXcgU2VhbWxlc3NwYXlFcnJvcihlcnJvcnMuQ0xJRU5UX01JU1NJTkdfR0FURVdBWV9DT05GSUdVUkFUSU9OKTtcbiAgfVxuICBbXG4gICAgJ2Fzc2V0c1VybCcsXG4gICAgJ2NsaWVudEFwaVVybCcsXG4gICAgJ3Rva2VuaXplckFwaSdcbiAgXS5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wZXJ0eSkge1xuICAgIHZhciBjb25maWdVcmwgPSAoZ2F0ZXdheUNvbmZpZ3VyYXRpb25bcHJvcGVydHldICYmIGdhdGV3YXlDb25maWd1cmF0aW9uW3Byb3BlcnR5XS51cmwpIHx8IGdhdGV3YXlDb25maWd1cmF0aW9uW3Byb3BlcnR5XTtcbiAgICBpZiAocHJvcGVydHkgaW4gZ2F0ZXdheUNvbmZpZ3VyYXRpb24gJiYgIWlzV2hpdGVsaXN0ZWREb21haW4oY29uZmlnVXJsKSkge1xuICAgICAgdGhyb3cgbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgICB0eXBlOiBlcnJvcnMuQ0xJRU5UX0dBVEVXQVlfQ09ORklHVVJBVElPTl9JTlZBTElEX0RPTUFJTi50eXBlLFxuICAgICAgICBjb2RlOiBlcnJvcnMuQ0xJRU5UX0dBVEVXQVlfQ09ORklHVVJBVElPTl9JTlZBTElEX0RPTUFJTi5jb2RlLFxuICAgICAgICBtZXNzYWdlOiBwcm9wZXJ0eSArICcgcHJvcGVydHkgaXMgb24gYW4gaW52YWxpZCBkb21haW4uICgnICsgY29uZmlnVXJsICsgJyknXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgY29weSBvZiB0aGUgY29uZmlndXJhdGlvbiB2YWx1ZXMuXG4gICAqIEBwdWJsaWNcbiAgICogQHJldHVybnMge0NsaWVudH5jb25maWd1cmF0aW9ufSBjb25maWd1cmF0aW9uXG4gICAqL1xuICB0aGlzLmdldENvbmZpZ3VyYXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UoY29uZmlndXJhdGlvbkpTT04pO1xuICB9O1xuXG4gIHRoaXMuX3JlcXVlc3QgPSByZXF1ZXN0O1xuXG4gIHRoaXMuX2NvbmZpZ3VyYXRpb24gPSB0aGlzLmdldENvbmZpZ3VyYXRpb24oKTtcblxuICB0aGlzLl9jbGllbnRBcGlCYXNlVXJsID0gZ2F0ZXdheUNvbmZpZ3VyYXRpb24uY2xpZW50QXBpVXJsICsgJy8nO1xuICB0aGlzLl90b2tlbml6ZXJBcGkgPSBnYXRld2F5Q29uZmlndXJhdGlvbi50b2tlbml6ZXJBcGk7XG5cbiAgc2VhbWxlc3NwYXlBcGlDb25maWd1cmF0aW9uID0gZ2F0ZXdheUNvbmZpZ3VyYXRpb24uc2VhbWxlc3NwYXlBcGk7XG4gIGlmIChzZWFtbGVzc3BheUFwaUNvbmZpZ3VyYXRpb24pIHtcbiAgICB0aGlzLl9zZWFtbGVzc3BheUFwaSA9IHtcbiAgICAgIGJhc2VVcmw6IHNlYW1sZXNzcGF5QXBpQ29uZmlndXJhdGlvbi51cmwgKyAnLycsXG4gICAgICBhY2Nlc3NUb2tlbjogc2VhbWxlc3NwYXlBcGlDb25maWd1cmF0aW9uLmFjY2Vzc1Rva2VuLFxuICAgICAgcHVibGlzaGFibGVUb2tlbjogc2VhbWxlc3NwYXlBcGlDb25maWd1cmF0aW9uLnB1Ymxpc2hhYmxlVG9rZW5cbiAgICB9O1xuICAgIGlmICghaXNXaGl0ZWxpc3RlZERvbWFpbih0aGlzLl9zZWFtbGVzc3BheUFwaS5iYXNlVXJsKSkge1xuICAgICAgdGhyb3cgbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgICAgICB0eXBlOiBlcnJvcnMuQ0xJRU5UX0dBVEVXQVlfQ09ORklHVVJBVElPTl9JTlZBTElEX0RPTUFJTi50eXBlLFxuICAgICAgICBjb2RlOiBlcnJvcnMuQ0xJRU5UX0dBVEVXQVlfQ09ORklHVVJBVElPTl9JTlZBTElEX0RPTUFJTi5jb2RlLFxuICAgICAgICBtZXNzYWdlOiAnc2VhbWxlc3NwYXlBcGkgVVJMIGlzIG9uIGFuIGludmFsaWQgZG9tYWluLidcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFVzZWQgYnkgb3RoZXIgbW9kdWxlcyB0byBmb3JtdWxhdGUgYWxsIG5ldHdvcmsgcmVxdWVzdHMgdG8gdGhlIFNlYW1sZXNzcGF5IGdhdGV3YXkuIEl0IGlzIGFsc28gY2FwYWJsZSBvZiBiZWluZyB1c2VkIGRpcmVjdGx5IGZyb20geW91ciBvd24gZm9ybSB0byB0b2tlbml6ZSBjcmVkaXQgY2FyZCBpbmZvcm1hdGlvbi4gSG93ZXZlciwgYmUgc3VyZSB0byBzYXRpc2Z5IFBDSSBjb21wbGlhbmNlIGlmIHlvdSB1c2UgZGlyZWN0IGNhcmQgdG9rZW5pemF0aW9uLlxuICogQHB1YmxpY1xuICogQGZ1bmN0aW9uXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyBSZXF1ZXN0IG9wdGlvbnM6XG4gKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9ucy5tZXRob2QgSFRUUCBtZXRob2QsIGUuZy4gXCJnZXRcIiBvciBcInBvc3RcIi5cbiAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLmVuZHBvaW50IEVuZHBvaW50IHBhdGgsIGUuZy4gXCJwYXltZW50X21ldGhvZHNcIi5cbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zLmRhdGEgRGF0YSB0byBzZW5kIHdpdGggdGhlIHJlcXVlc3QuXG4gKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMudGltZW91dD02MDAwMF0gU2V0IGEgdGltZW91dCAoaW4gbWlsbGlzZWNvbmRzKSBmb3IgdGhlIHJlcXVlc3QuXG4gKiBAcGFyYW0ge2NhbGxiYWNrfSBbY2FsbGJhY2tdIFRoZSBzZWNvbmQgYXJndW1lbnQsIDxjb2RlPmRhdGE8L2NvZGU+LCBpcyB0aGUgcmV0dXJuZWQgc2VydmVyIGRhdGEuXG4gKiBAZXhhbXBsZVxuICogPGNhcHRpb24+RGlyZWN0IENyZWRpdCBDYXJkIFRva2VuaXphdGlvbjwvY2FwdGlvbj5cbiAqIHZhciBjcmVhdGVDbGllbnQgPSByZXF1aXJlKCdzZWFtbGVzc3BheS13ZWIvY2xpZW50JykuY3JlYXRlO1xuICpcbiAqIGNyZWF0ZUNsaWVudCh7XG4gKiAgIGVudmlyb25tZW50OiAnc2FuZGJveCdcbiAqICAgYXV0aG9yaXphdGlvbjogQ0xJRU5UX0FVVEhPUklaQVRJT05cbiAqIH0sIGZ1bmN0aW9uIChjcmVhdGVFcnIsIGNsaWVudEluc3RhbmNlKSB7XG4gKiAgIHZhciBmb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ215LWZvcm0taWQnKTtcbiAqICAgdmFyIGRhdGEgPSB7XG4gKiAgICAgY3JlZGl0Q2FyZDoge1xuICogICAgICAgbnVtYmVyOiBmb3JtWydjYy1udW1iZXInXS52YWx1ZSxcbiAqICAgICAgIGN2djogZm9ybVsnY2MtY3Z2J10udmFsdWUsXG4gKiAgICAgICBleHBEYXRlOiBmb3JtWydjYy1kYXRlJ10udmFsdWUsXG4gKiAgICAgICBiaWxsaW5nQWRkcmVzczoge1xuICogICAgICAgICBwb3N0YWxDb2RlOiBmb3JtWydjYy1wb3N0YWwnXS52YWx1ZVxuICogICAgICAgfSxcbiAqICAgICAgIG9wdGlvbnM6IHtcbiAqICAgICAgICAgdmFsaWRhdGU6IGZhbHNlXG4gKiAgICAgICB9XG4gKiAgICAgfVxuICogICB9O1xuICpcbiAqICAgLy8gV2FybmluZzogRm9yIGEgbWVyY2hhbnQgdG8gYmUgZWxpZ2libGUgZm9yIHRoZSBlYXNpZXN0IGxldmVsIG9mIFBDSSBjb21wbGlhbmNlIChTQVEgQSksXG4gKiAgIC8vIHBheW1lbnQgZmllbGRzIGNhbm5vdCBiZSBob3N0ZWQgb24geW91ciBjaGVja291dCBwYWdlLlxuICogICAvLyBGb3IgYW4gYWx0ZXJuYXRpdmUgdG8gdGhlIGZvbGxvd2luZywgdXNlIEhvc3RlZCBGaWVsZHMuXG4gKiAgIGNsaWVudEluc3RhbmNlLnJlcXVlc3Qoe1xuICogICAgIGVuZHBvaW50OiAncGF5bWVudF9tZXRob2RzL2NyZWRpdF9jYXJkcycsXG4gKiAgICAgbWV0aG9kOiAncG9zdCcsXG4gKiAgICAgZGF0YTogZGF0YVxuICogICB9LCBmdW5jdGlvbiAocmVxdWVzdEVyciwgcmVzcG9uc2UpIHtcbiAqICAgICAvLyBNb3JlIGRldGFpbGVkIGV4YW1wbGUgb2YgaGFuZGxpbmcgQVBJIGVycm9yczogaHR0cHM6Ly9jb2RlcGVuLmlvL3NlYW1sZXNzcGF5L3Blbi9NYndqZE1cbiAqICAgICBpZiAocmVxdWVzdEVycikgeyB0aHJvdyBuZXcgRXJyb3IocmVxdWVzdEVycik7IH1cbiAqXG4gKiAgICAgY29uc29sZS5sb2coJ0dvdCBub25jZTonLCByZXNwb25zZS5jcmVkaXRDYXJkc1swXS5ub25jZSk7XG4gKiAgIH0pO1xuICogfSk7XG4gKiBAcmV0dXJucyB7UHJvbWlzZXx2b2lkfSBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdpdGggdGhlIHJlcXVlc3QgcmVzcG9uc2UgaWYgbm8gY2FsbGJhY2sgaXMgcHJvdmlkZWQuXG4gKi9cbkNsaWVudC5wcm90b3R5cGUucmVxdWVzdCA9IGZ1bmN0aW9uIChvcHRpb25zLCBjYWxsYmFjaykge1xuICB2YXIgc2VsZiA9IHRoaXM7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8taW52YWxpZC10aGlzXG5cbiAgdmFyIHJlcXVlc3RQcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHZhciBvcHRpb25OYW1lLFxuICAgICAgYXBpLFxuICAgICAgcmVxdWVzdE9wdGlvbnMsXG4gICAgICBhcGlDb25maWcsXG4gICAgICBwcm94eUFjY291bnRJZCxcbiAgICAgIHB1Ymxpc2hhYmxlID0gb3B0aW9ucy5wdWJsaXNoYWJsZTtcblxuICAgIGlmICghb3B0aW9ucy5tZXRob2QpIHtcbiAgICAgIG9wdGlvbk5hbWUgPSAnb3B0aW9ucy5tZXRob2QnO1xuICAgIH0gZWxzZSBpZiAoIW9wdGlvbnMuZW5kcG9pbnQpIHtcbiAgICAgIG9wdGlvbk5hbWUgPSAnb3B0aW9ucy5lbmRwb2ludCc7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbk5hbWUpIHtcbiAgICAgIHRocm93IG5ldyBTZWFtbGVzc3BheUVycm9yKHtcbiAgICAgICAgdHlwZTogZXJyb3JzLkNMSUVOVF9PUFRJT05fUkVRVUlSRUQudHlwZSxcbiAgICAgICAgY29kZTogZXJyb3JzLkNMSUVOVF9PUFRJT05fUkVRVUlSRUQuY29kZSxcbiAgICAgICAgbWVzc2FnZTogb3B0aW9uTmFtZSArICcgaXMgcmVxdWlyZWQgd2hlbiBtYWtpbmcgYSByZXF1ZXN0LidcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICgnYXBpJyBpbiBvcHRpb25zKSB7XG4gICAgICBhcGkgPSBvcHRpb25zLmFwaTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpID0gJ2NsaWVudEFwaSc7XG4gICAgfVxuXG4gICAgcmVxdWVzdE9wdGlvbnMgPSB7XG4gICAgICBtZXRob2Q6IG9wdGlvbnMubWV0aG9kLFxuICAgICAgdGltZW91dDogb3B0aW9ucy50aW1lb3V0XG4gICAgfTtcblxuICAgIHZhciBjb21tb25IZWFkZXIgPSB7XG4gICAgICAnQVBJLVZlcnNpb24nOiBjb25zdGFudHMuU0VBTUxFU1NQQVlfQVBJX1ZFUlNJT05fSEVBREVSLFxuICAgICAgJ1NESy1WZXJzaW9uJzogVkVSU0lPTlxuICAgIH07XG5cbiAgICBwcm94eUFjY291bnRJZCA9IHNlbGYuZ2V0Q29uZmlndXJhdGlvbigpLmdhdGV3YXlDb25maWd1cmF0aW9uLnByb3h5QWNjb3VudElkO1xuXG4gICAgaWYgKGFwaSA9PT0gJ3Rva2VuaXplckFwaScpIHtcbiAgICAgIHJlcXVlc3RPcHRpb25zLnVybCA9IHNlbGYuX3Rva2VuaXplckFwaS51cmwgKyAnLycgKyBvcHRpb25zLmVuZHBvaW50O1xuICAgICAgcmVxdWVzdE9wdGlvbnMuZGF0YSA9IG9wdGlvbnMuZGF0YTtcbiAgICAgIHJlcXVlc3RPcHRpb25zLmhlYWRlcnMgPSB7XG4gICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgIEF1dGhvcml6YXRpb246ICdCZWFyZXIgJyArIHNlbGYuX3Rva2VuaXplckFwaS5hY2Nlc3NUb2tlblxuICAgICAgfTtcbiAgICAgIGlmIChwcm94eUFjY291bnRJZCkge1xuICAgICAgICByZXF1ZXN0T3B0aW9ucy5oZWFkZXJzWydTZWFtbGVzc1BheS1BY2NvdW50J10gPSBwcm94eUFjY291bnRJZDtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGFwaSA9PT0gJ3RyYW5zYWN0aW9uQXBpJykge1xuICAgICAgYXBpQ29uZmlnID0gc2VsZi5nZXRDb25maWd1cmF0aW9uKCkuZ2F0ZXdheUNvbmZpZ3VyYXRpb24udHJhbnNhY3Rpb25BcGk7XG4gICAgICByZXF1ZXN0T3B0aW9ucy51cmwgPSBhcGlDb25maWcuaXNTZWFtbGVzc3BheSA/IGFwaUNvbmZpZy51cmwgKyAnLycgKyBvcHRpb25zLmVuZHBvaW50IDogYXBpQ29uZmlnLnVybDtcbiAgICAgIHJlcXVlc3RPcHRpb25zLmRhdGEgPSBvcHRpb25zLmRhdGE7XG4gICAgICByZXF1ZXN0T3B0aW9ucy5oZWFkZXJzID0ge307XG4gICAgICBpZiAoYXBpQ29uZmlnLmFjY2Vzc1Rva2VuKSB7XG4gICAgICAgIHJlcXVlc3RPcHRpb25zLmhlYWRlcnNbJ0F1dGhvcml6YXRpb24nXSA9ICdCZWFyZXIgJyArIGFwaUNvbmZpZy5hY2Nlc3NUb2tlbjtcbiAgICAgIH1cbiAgICAgIGlmIChwcm94eUFjY291bnRJZCkge1xuICAgICAgICByZXF1ZXN0T3B0aW9ucy5oZWFkZXJzWydTZWFtbGVzc1BheS1BY2NvdW50J10gPSBwcm94eUFjY291bnRJZDtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGFwaSA9PT0gJ2NoZWNrb3V0QXBpJykge1xuICAgICAgYXBpQ29uZmlnID0gc2VsZi5nZXRDb25maWd1cmF0aW9uKCkuZ2F0ZXdheUNvbmZpZ3VyYXRpb24udHJhbnNhY3Rpb25BcGk7XG4gICAgICByZXF1ZXN0T3B0aW9ucy51cmwgPSBhcGlDb25maWcudXJsICsgJy8nICsgb3B0aW9ucy5lbmRwb2ludDtcbiAgICAgIHJlcXVlc3RPcHRpb25zLmRhdGEgPSBvcHRpb25zLmRhdGE7XG4gICAgICByZXF1ZXN0T3B0aW9ucy5oZWFkZXJzID0ge307XG4gICAgICBpZiAoYXBpQ29uZmlnLmFjY2Vzc1Rva2VuKSB7XG4gICAgICAgIHJlcXVlc3RPcHRpb25zLmhlYWRlcnNbJ0F1dGhvcml6YXRpb24nXSA9ICdCZWFyZXIgJyArIGFwaUNvbmZpZy5hY2Nlc3NUb2tlbjtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGFwaSA9PT0gJ2NsaWVudEFwaScpIHtcbiAgICAgIHJlcXVlc3RPcHRpb25zLnVybCA9IHNlbGYuX2NsaWVudEFwaUJhc2VVcmwgKyBvcHRpb25zLmVuZHBvaW50O1xuICAgICAgcmVxdWVzdE9wdGlvbnMuZGF0YSA9IGFkZE1ldGFkYXRhKHNlbGYuX2NvbmZpZ3VyYXRpb24sIG9wdGlvbnMuZGF0YSk7XG4gICAgfSBlbHNlIGlmIChhcGkgPT09ICdzZWFtbGVzc3BheUFwaScpIHtcbiAgICAgIGlmICghc2VsZi5fc2VhbWxlc3NwYXlBcGkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFNlYW1sZXNzcGF5RXJyb3Ioc2hhcmVkRXJyb3JzLlNFQU1MRVNTUEFZX0FQSV9BQ0NFU1NfUkVTVFJJQ1RFRCk7XG4gICAgICB9XG4gICAgICByZXF1ZXN0T3B0aW9ucy51cmwgPSBzZWxmLl9zZWFtbGVzc3BheUFwaS5iYXNlVXJsICsgb3B0aW9ucy5lbmRwb2ludDtcbiAgICAgIHJlcXVlc3RPcHRpb25zLmRhdGEgPSBvcHRpb25zLmRhdGE7XG4gICAgICByZXF1ZXN0T3B0aW9ucy5oZWFkZXJzID0ge1xuICAgICAgICBBdXRob3JpemF0aW9uOiAnQmVhcmVyICcgKyAocHVibGlzaGFibGUgPyBzZWxmLl9zZWFtbGVzc3BheUFwaS5wdWJsaXNoYWJsZVRva2VuIDogc2VsZi5fc2VhbWxlc3NwYXlBcGkuYWNjZXNzVG9rZW4pXG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAoYXBpID09PSAnZGlnaXRhbFdhbGxldEFwaScpIHtcbiAgICAgIGlmICghc2VsZi5fc2VhbWxlc3NwYXlBcGkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFNlYW1sZXNzcGF5RXJyb3Ioc2hhcmVkRXJyb3JzLlNFQU1MRVNTUEFZX0FQSV9BQ0NFU1NfUkVTVFJJQ1RFRCk7XG4gICAgICB9XG4gICAgICByZXF1ZXN0T3B0aW9ucy51cmwgPSBzZWxmLl9zZWFtbGVzc3BheUFwaS5iYXNlVXJsICsgb3B0aW9ucy5lbmRwb2ludDtcbiAgICAgIHJlcXVlc3RPcHRpb25zLmRhdGEgPSBvcHRpb25zLmRhdGE7XG4gICAgICByZXF1ZXN0T3B0aW9ucy5oZWFkZXJzID0ge1xuICAgICAgICBBdXRob3JpemF0aW9uOiAnQmVhcmVyICcgKyBvcHRpb25zLmRhdGEudG9rZW5cbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBTZWFtbGVzc3BheUVycm9yKHtcbiAgICAgICAgdHlwZTogZXJyb3JzLkNMSUVOVF9PUFRJT05fSU5WQUxJRC50eXBlLFxuICAgICAgICBjb2RlOiBlcnJvcnMuQ0xJRU5UX09QVElPTl9JTlZBTElELmNvZGUsXG4gICAgICAgIG1lc3NhZ2U6ICdvcHRpb25zLmFwaSBpcyBpbnZhbGlkLidcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJlcXVlc3RPcHRpb25zLmhlYWRlcnMgPSBhc3NpZ24oe30sIHJlcXVlc3RPcHRpb25zLmhlYWRlcnMsIGNvbW1vbkhlYWRlcik7XG5cbiAgICBzZWxmLl9yZXF1ZXN0KHJlcXVlc3RPcHRpb25zLCBmdW5jdGlvbiAoZXJyLCBkYXRhLCBzdGF0dXMpIHtcbiAgICAgIHZhciByZXNvbHZlZERhdGE7XG4gICAgICB2YXIgcmVxdWVzdEVycm9yID0gZm9ybWF0UmVxdWVzdEVycm9yKHN0YXR1cywgZXJyKTtcblxuICAgICAgaWYgKHJlcXVlc3RFcnJvcikge1xuICAgICAgICByZWplY3QocmVxdWVzdEVycm9yKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICByZXNvbHZlZERhdGEgPSBBcnJheS5pc0FycmF5KGRhdGEpICYmIHsgZGF0YTogZGF0YSwgX2h0dHBTdGF0dXM6IHN0YXR1cyB9IHx8XG4gICAgICAgIGFzc2lnbih7IF9odHRwU3RhdHVzOiBzdGF0dXMgfSwgZGF0YSk7XG5cbiAgICAgIHJlc29sdmUocmVzb2x2ZWREYXRhKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJlcXVlc3RQcm9taXNlLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICBjYWxsYmFjayhudWxsLCByZXNwb25zZSwgcmVzcG9uc2UuX2h0dHBTdGF0dXMpO1xuICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIHZhciBzdGF0dXMgPSBlcnIgJiYgZXJyLmRldGFpbHMgJiYgZXJyLmRldGFpbHMuaHR0cFN0YXR1cztcbiAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCwgc3RhdHVzKTtcbiAgICB9KTtcbiAgICByZXR1cm47XG4gIH1cblxuICByZXR1cm4gcmVxdWVzdFByb21pc2U7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgY29uc2lzdGVudC1yZXR1cm5cbn07XG5cbmZ1bmN0aW9uIGZvcm1hdFJlcXVlc3RFcnJvcihzdGF0dXMsIGVycikgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGNvbnNpc3RlbnQtcmV0dXJuXG4gIHZhciByZXF1ZXN0RXJyb3I7XG5cbiAgaWYgKHN0YXR1cyA9PT0gLTEpIHtcbiAgICByZXF1ZXN0RXJyb3IgPSBuZXcgU2VhbWxlc3NwYXlFcnJvcihlcnJvcnMuQ0xJRU5UX1JFUVVFU1RfVElNRU9VVCk7XG4gIH0gZWxzZSBpZiAoc3RhdHVzID09PSA0MDMpIHtcbiAgICByZXF1ZXN0RXJyb3IgPSBuZXcgU2VhbWxlc3NwYXlFcnJvcihlcnJvcnMuQ0xJRU5UX0FVVEhPUklaQVRJT05fSU5TVUZGSUNJRU5UKTtcbiAgfSBlbHNlIGlmIChzdGF0dXMgPT09IDQyOSkge1xuICAgIHJlcXVlc3RFcnJvciA9IG5ldyBTZWFtbGVzc3BheUVycm9yKGVycm9ycy5DTElFTlRfUkFURV9MSU1JVEVEKTtcbiAgfSBlbHNlIGlmIChzdGF0dXMgPj0gNTAwKSB7XG4gICAgcmVxdWVzdEVycm9yID0gbmV3IFNlYW1sZXNzcGF5RXJyb3IoZXJyb3JzLkNMSUVOVF9HQVRFV0FZX05FVFdPUkspO1xuICB9IGVsc2UgaWYgKHN0YXR1cyA8IDIwMCB8fCBzdGF0dXMgPj0gNDAwKSB7XG4gICAgcmVxdWVzdEVycm9yID0gY29udmVydFRvU2VhbWxlc3NwYXlFcnJvcihlcnIsIHtcbiAgICAgIHR5cGU6IGVycm9ycy5DTElFTlRfUkVRVUVTVF9FUlJPUi50eXBlLFxuICAgICAgY29kZTogZXJyb3JzLkNMSUVOVF9SRVFVRVNUX0VSUk9SLmNvZGUsXG4gICAgICBtZXNzYWdlOiBlcnJvcnMuQ0xJRU5UX1JFUVVFU1RfRVJST1IubWVzc2FnZVxuICAgIH0pO1xuICB9XG5cbiAgaWYgKHJlcXVlc3RFcnJvcikge1xuICAgIHJlcXVlc3RFcnJvci5kZXRhaWxzID0gcmVxdWVzdEVycm9yLmRldGFpbHMgfHwge307XG4gICAgcmVxdWVzdEVycm9yLmRldGFpbHMuaHR0cFN0YXR1cyA9IHN0YXR1cztcblxuICAgIHJldHVybiByZXF1ZXN0RXJyb3I7XG4gIH1cbn1cblxuQ2xpZW50LnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLmdldENvbmZpZ3VyYXRpb24oKTtcbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgQ2xpZW50IHZlcnNpb24uXG4gKiBAcHVibGljXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgY3JlYXRlZCBjbGllbnQncyB2ZXJzaW9uLlxuICogQGV4YW1wbGVcbiAqIHZhciBjcmVhdGVDbGllbnQgPSByZXF1aXJlKCdicmFpbnRyZWUtd2ViL2NsaWVudCcpLmNyZWF0ZTtcbiAqXG4gKiBjcmVhdGVDbGllbnQoe1xuICogICBhdXRob3JpemF0aW9uOiBDTElFTlRfQVVUSE9SSVpBVElPTlxuICogfSwgZnVuY3Rpb24gKGNyZWF0ZUVyciwgY2xpZW50SW5zdGFuY2UpIHtcbiAqICAgY29uc29sZS5sb2coY2xpZW50SW5zdGFuY2UuZ2V0VmVyc2lvbigpKTsgLy8gRXg6IDEuMC4wXG4gKiB9KTtcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5DbGllbnQucHJvdG90eXBlLmdldFZlcnNpb24gPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBWRVJTSU9OO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDbGllbnQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBTRUFNTEVTU1BBWV9BUElfVkVSU0lPTl9IRUFERVI6ICd2MjAyMCdcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBTZWFtbGVzc3BheUVycm9yID0gcmVxdWlyZSgnLi4vbGliL3NlYW1sZXNzcGF5LWVycm9yJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBDTElFTlRfR0FURVdBWV9DT05GSUdVUkFUSU9OX0lOVkFMSURfRE9NQUlOOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnQ0xJRU5UX0dBVEVXQVlfQ09ORklHVVJBVElPTl9JTlZBTElEX0RPTUFJTidcbiAgfSxcbiAgQ0xJRU5UX09QVElPTl9SRVFVSVJFRDoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTUVSQ0hBTlQsXG4gICAgY29kZTogJ0NMSUVOVF9PUFRJT05fUkVRVUlSRUQnXG4gIH0sXG4gIENMSUVOVF9PUFRJT05fSU5WQUxJRDoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTUVSQ0hBTlQsXG4gICAgY29kZTogJ0NMSUVOVF9PUFRJT05fSU5WQUxJRCdcbiAgfSxcbiAgQ0xJRU5UX01JU1NJTkdfR0FURVdBWV9DT05GSUdVUkFUSU9OOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5JTlRFUk5BTCxcbiAgICBjb2RlOiAnQ0xJRU5UX01JU1NJTkdfR0FURVdBWV9DT05GSUdVUkFUSU9OJyxcbiAgICBtZXNzYWdlOiAnTWlzc2luZyBnYXRld2F5Q29uZmlndXJhdGlvbi4nXG4gIH0sXG4gIENMSUVOVF9JTlZBTElEX0FVVEhPUklaQVRJT046IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLk1FUkNIQU5ULFxuICAgIGNvZGU6ICdDTElFTlRfSU5WQUxJRF9BVVRIT1JJWkFUSU9OJyxcbiAgICBtZXNzYWdlOiAnQXV0aG9yaXphdGlvbiBpcyBpbnZhbGlkLiBNYWtlIHN1cmUgeW91ciBjbGllbnQgdG9rZW4gb3IgdG9rZW5pemF0aW9uIGtleSBpcyB2YWxpZC4nXG4gIH0sXG4gIENMSUVOVF9HQVRFV0FZX05FVFdPUks6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLk5FVFdPUkssXG4gICAgY29kZTogJ0NMSUVOVF9HQVRFV0FZX05FVFdPUksnLFxuICAgIG1lc3NhZ2U6ICdDYW5ub3QgY29udGFjdCB0aGUgZ2F0ZXdheSBhdCB0aGlzIHRpbWUuJ1xuICB9LFxuICBDTElFTlRfUkVRVUVTVF9USU1FT1VUOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5ORVRXT1JLLFxuICAgIGNvZGU6ICdDTElFTlRfUkVRVUVTVF9USU1FT1VUJyxcbiAgICBtZXNzYWdlOiAnUmVxdWVzdCB0aW1lZCBvdXQgd2FpdGluZyBmb3IgYSByZXBseS4nXG4gIH0sXG4gIENMSUVOVF9SRVFVRVNUX0VSUk9SOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5ORVRXT1JLLFxuICAgIGNvZGU6ICdDTElFTlRfUkVRVUVTVF9FUlJPUicsXG4gICAgbWVzc2FnZTogJ1RoZXJlIHdhcyBhIHByb2JsZW0gd2l0aCB5b3VyIHJlcXVlc3QuJ1xuICB9LFxuICBDTElFTlRfUkFURV9MSU1JVEVEOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnQ0xJRU5UX1JBVEVfTElNSVRFRCcsXG4gICAgbWVzc2FnZTogJ1lvdSBhcmUgYmVpbmcgcmF0ZS1saW1pdGVkOyBwbGVhc2UgdHJ5IGFnYWluIGluIGEgZmV3IG1pbnV0ZXMuJ1xuICB9LFxuICBDTElFTlRfQVVUSE9SSVpBVElPTl9JTlNVRkZJQ0lFTlQ6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLk1FUkNIQU5ULFxuICAgIGNvZGU6ICdDTElFTlRfQVVUSE9SSVpBVElPTl9JTlNVRkZJQ0lFTlQnLFxuICAgIG1lc3NhZ2U6ICdUaGUgYXV0aG9yaXphdGlvbiB1c2VkIGhhcyBpbnN1ZmZpY2llbnQgcHJpdmlsZWdlcy4nXG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBxdWVyeXN0cmluZyA9IHJlcXVpcmUoJy4uLy4uL2xpYi9xdWVyeXN0cmluZycpO1xudmFyIGFzc2lnbiA9IHJlcXVpcmUoJy4uLy4uL2xpYi9hc3NpZ24nKS5hc3NpZ247XG52YXIgcHJlcEJvZHkgPSByZXF1aXJlKCcuL3ByZXAtYm9keScpO1xudmFyIHBhcnNlQm9keSA9IHJlcXVpcmUoJy4vcGFyc2UtYm9keScpO1xudmFyIGlzWEhSQXZhaWxhYmxlID0gZ2xvYmFsLlhNTEh0dHBSZXF1ZXN0ICYmICd3aXRoQ3JlZGVudGlhbHMnIGluIG5ldyBnbG9iYWwuWE1MSHR0cFJlcXVlc3QoKTtcblxuZnVuY3Rpb24gZ2V0UmVxdWVzdE9iamVjdCgpIHtcbiAgcmV0dXJuIGlzWEhSQXZhaWxhYmxlID8gbmV3IFhNTEh0dHBSZXF1ZXN0KCkgOiBuZXcgWERvbWFpblJlcXVlc3QoKTtcbn1cblxuZnVuY3Rpb24gcmVxdWVzdChvcHRpb25zLCBjYikge1xuICB2YXIgc3RhdHVzLCByZXNCb2R5O1xuICB2YXIgbWV0aG9kID0gb3B0aW9ucy5tZXRob2Q7XG4gIHZhciB1cmwgPSBvcHRpb25zLnVybDtcbiAgdmFyIGJvZHkgPSBvcHRpb25zLmRhdGE7XG4gIHZhciB0aW1lb3V0ID0gb3B0aW9ucy50aW1lb3V0O1xuICB2YXIgaGVhZGVycyA9IGFzc2lnbih7XG4gICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICB9LCBvcHRpb25zLmhlYWRlcnMpO1xuICB2YXIgcmVxID0gZ2V0UmVxdWVzdE9iamVjdCgpO1xuICB2YXIgY2FsbGJhY2sgPSBjYjtcblxuICBpZiAobWV0aG9kID09PSAnR0VUJykge1xuICAgIHVybCA9IHF1ZXJ5c3RyaW5nLnF1ZXJ5aWZ5KHVybCwgYm9keSk7XG4gICAgYm9keSA9IG51bGw7XG4gIH1cblxuICBpZiAoaXNYSFJBdmFpbGFibGUpIHtcbiAgICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHJlcS5yZWFkeVN0YXRlICE9PSA0KSB7IHJldHVybjsgfVxuXG4gICAgICBzdGF0dXMgPSByZXEuc3RhdHVzO1xuICAgICAgcmVzQm9keSA9IHBhcnNlQm9keShyZXEucmVzcG9uc2VUZXh0KTtcblxuICAgICAgaWYgKHN0YXR1cyA+PSA0MDAgfHwgc3RhdHVzIDwgMjAwKSB7XG4gICAgICAgIGNhbGxiYWNrKHJlc0JvZHkgfHwgJ2Vycm9yJywgbnVsbCwgc3RhdHVzIHx8IDUwMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYWxsYmFjayhudWxsLCByZXNCb2R5LCBzdGF0dXMpO1xuICAgICAgfVxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgaWYgKG9wdGlvbnMuaGVhZGVycykge1xuICAgICAgdXJsID0gcXVlcnlzdHJpbmcucXVlcnlpZnkodXJsLCBoZWFkZXJzKTtcbiAgICB9XG5cbiAgICByZXEub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgY2FsbGJhY2sobnVsbCwgcGFyc2VCb2R5KHJlcS5yZXNwb25zZVRleHQpLCByZXEuc3RhdHVzKTtcbiAgICB9O1xuXG4gICAgcmVxLm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBYRG9tYWluUmVxdWVzdCBkb2VzIG5vdCByZXBvcnQgYSBib2R5IG9yIHN0YXR1cyBmb3IgZXJyb3JzLCBzb1xuICAgICAgLy8gaGFyZGNvZGUgdG8gJ2Vycm9yJyBhbmQgNTAwLCByZXNwZWN0aXZlbHlcbiAgICAgIGNhbGxiYWNrKCdlcnJvcicsIG51bGwsIDUwMCk7XG4gICAgfTtcblxuICAgIC8vIFRoaXMgbXVzdCByZW1haW4gZm9yIElFOSB0byB3b3JrXG4gICAgcmVxLm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbiAoKSB7fTtcblxuICAgIHJlcS5vbnRpbWVvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBjYWxsYmFjaygndGltZW91dCcsIG51bGwsIC0xKTtcbiAgICB9O1xuICB9XG5cbiAgcmVxLm9wZW4obWV0aG9kLCB1cmwsIHRydWUpO1xuICByZXEudGltZW91dCA9IHRpbWVvdXQ7XG5cbiAgaWYgKGlzWEhSQXZhaWxhYmxlKSB7XG4gICAgT2JqZWN0LmtleXMoaGVhZGVycykuZm9yRWFjaChmdW5jdGlvbiAoaGVhZGVyS2V5KSB7XG4gICAgICByZXEuc2V0UmVxdWVzdEhlYWRlcihoZWFkZXJLZXksIGhlYWRlcnNbaGVhZGVyS2V5XSk7XG4gICAgfSk7XG4gIH1cblxuICB0cnkge1xuICAgIHJlcS5zZW5kKHByZXBCb2R5KG1ldGhvZCwgYm9keSkpO1xuICB9IGNhdGNoIChlKSB7IC8qIGlnbm9yZWQgKi8gfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgcmVxdWVzdDogcmVxdWVzdFxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRVc2VyQWdlbnQoKSB7XG4gIHJldHVybiBnbG9iYWwubmF2aWdhdG9yLnVzZXJBZ2VudDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBhamF4SXNBdmFsaWFibGU7XG52YXIgb25jZSA9IHJlcXVpcmUoJy4uLy4uL2xpYi9vbmNlJyk7XG52YXIgSlNPTlBEcml2ZXIgPSByZXF1aXJlKCcuL2pzb25wLWRyaXZlcicpO1xudmFyIEFKQVhEcml2ZXIgPSByZXF1aXJlKCcuL2FqYXgtZHJpdmVyJyk7XG52YXIgZ2V0VXNlckFnZW50ID0gcmVxdWlyZSgnLi9nZXQtdXNlci1hZ2VudCcpO1xudmFyIGlzSFRUUCA9IHJlcXVpcmUoJy4vaXMtaHR0cCcpO1xuXG5mdW5jdGlvbiBpc0FqYXhBdmFpbGFibGUoKSB7XG4gIGlmIChhamF4SXNBdmFsaWFibGUgPT0gbnVsbCkge1xuICAgIGFqYXhJc0F2YWxpYWJsZSA9ICEoaXNIVFRQKCkgJiYgL01TSUVcXHMoOHw5KS8udGVzdChnZXRVc2VyQWdlbnQoKSkpO1xuICB9XG5cbiAgcmV0dXJuIGFqYXhJc0F2YWxpYWJsZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob3B0aW9ucywgY2IpIHtcbiAgY2IgPSBvbmNlKGNiIHx8IEZ1bmN0aW9uLnByb3RvdHlwZSk7XG4gIG9wdGlvbnMubWV0aG9kID0gKG9wdGlvbnMubWV0aG9kIHx8ICdHRVQnKS50b1VwcGVyQ2FzZSgpO1xuICBvcHRpb25zLnRpbWVvdXQgPSBvcHRpb25zLnRpbWVvdXQgPT0gbnVsbCA/IDYwMDAwIDogb3B0aW9ucy50aW1lb3V0O1xuICBvcHRpb25zLmRhdGEgPSBvcHRpb25zLmRhdGEgfHwge307XG5cbiAgaWYgKGlzQWpheEF2YWlsYWJsZSgpKSB7XG4gICAgQUpBWERyaXZlci5yZXF1ZXN0KG9wdGlvbnMsIGNiKTtcbiAgfSBlbHNlIHtcbiAgICBKU09OUERyaXZlci5yZXF1ZXN0KG9wdGlvbnMsIGNiKTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBnbG9iYWwubG9jYXRpb24ucHJvdG9jb2wgPT09ICdodHRwOic7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaGVhZDtcbnZhciB1dWlkID0gcmVxdWlyZSgnLi4vLi4vbGliL3V1aWQnKTtcbnZhciBxdWVyeXN0cmluZyA9IHJlcXVpcmUoJy4uLy4uL2xpYi9xdWVyeXN0cmluZycpO1xudmFyIHRpbWVvdXRzID0ge307XG5cbmZ1bmN0aW9uIF9yZW1vdmVTY3JpcHQoc2NyaXB0KSB7XG4gIGlmIChzY3JpcHQgJiYgc2NyaXB0LnBhcmVudE5vZGUpIHtcbiAgICBzY3JpcHQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzY3JpcHQpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9jcmVhdGVTY3JpcHRUYWcodXJsLCBjYWxsYmFja05hbWUpIHtcbiAgdmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICB2YXIgZG9uZSA9IGZhbHNlO1xuXG4gIHNjcmlwdC5zcmMgPSB1cmw7XG4gIHNjcmlwdC5hc3luYyA9IHRydWU7XG4gIHNjcmlwdC5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgIGdsb2JhbFtjYWxsYmFja05hbWVdKHttZXNzYWdlOiAnZXJyb3InLCBzdGF0dXM6IDUwMH0pO1xuICB9O1xuXG4gIHNjcmlwdC5vbmxvYWQgPSBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChkb25lKSB7IHJldHVybjsgfVxuXG4gICAgaWYgKCF0aGlzLnJlYWR5U3RhdGUgfHwgdGhpcy5yZWFkeVN0YXRlID09PSAnbG9hZGVkJyB8fCB0aGlzLnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZScpIHtcbiAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgc2NyaXB0Lm9ubG9hZCA9IHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBudWxsO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gc2NyaXB0O1xufVxuXG5mdW5jdGlvbiBfY2xlYW51cEdsb2JhbChjYWxsYmFja05hbWUpIHtcbiAgdHJ5IHtcbiAgICBkZWxldGUgZ2xvYmFsW2NhbGxiYWNrTmFtZV07XG4gIH0gY2F0Y2ggKF8pIHtcbiAgICBnbG9iYWxbY2FsbGJhY2tOYW1lXSA9IG51bGw7XG4gIH1cbn1cblxuZnVuY3Rpb24gX3NldHVwVGltZW91dCh0aW1lb3V0LCBjYWxsYmFja05hbWUpIHtcbiAgdGltZW91dHNbY2FsbGJhY2tOYW1lXSA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgIHRpbWVvdXRzW2NhbGxiYWNrTmFtZV0gPSBudWxsO1xuXG4gICAgZ2xvYmFsW2NhbGxiYWNrTmFtZV0oe1xuICAgICAgZXJyb3I6ICd0aW1lb3V0JyxcbiAgICAgIHN0YXR1czogLTFcbiAgICB9KTtcblxuICAgIGdsb2JhbFtjYWxsYmFja05hbWVdID0gZnVuY3Rpb24gKCkge1xuICAgICAgX2NsZWFudXBHbG9iYWwoY2FsbGJhY2tOYW1lKTtcbiAgICB9O1xuICB9LCB0aW1lb3V0KTtcbn1cblxuZnVuY3Rpb24gX3NldHVwR2xvYmFsQ2FsbGJhY2soc2NyaXB0LCBjYWxsYmFjaywgY2FsbGJhY2tOYW1lKSB7XG4gIGdsb2JhbFtjYWxsYmFja05hbWVdID0gZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgdmFyIHN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1cyB8fCA1MDA7XG4gICAgdmFyIGVyciA9IG51bGw7XG4gICAgdmFyIGRhdGEgPSBudWxsO1xuXG4gICAgZGVsZXRlIHJlc3BvbnNlLnN0YXR1cztcblxuICAgIGlmIChzdGF0dXMgPj0gNDAwIHx8IHN0YXR1cyA8IDIwMCkge1xuICAgICAgZXJyID0gcmVzcG9uc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRhdGEgPSByZXNwb25zZTtcbiAgICB9XG5cbiAgICBfY2xlYW51cEdsb2JhbChjYWxsYmFja05hbWUpO1xuICAgIF9yZW1vdmVTY3JpcHQoc2NyaXB0KTtcblxuICAgIGNsZWFyVGltZW91dCh0aW1lb3V0c1tjYWxsYmFja05hbWVdKTtcbiAgICBjYWxsYmFjayhlcnIsIGRhdGEsIHN0YXR1cyk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHJlcXVlc3Qob3B0aW9ucywgY2FsbGJhY2spIHtcbiAgdmFyIHNjcmlwdDtcbiAgdmFyIGNhbGxiYWNrTmFtZSA9ICdjYWxsYmFja19qc29uXycgKyB1dWlkKCkucmVwbGFjZSgvLS9nLCAnJyk7XG4gIHZhciB1cmwgPSBvcHRpb25zLnVybDtcbiAgdmFyIGF0dHJzID0gb3B0aW9ucy5kYXRhO1xuICB2YXIgbWV0aG9kID0gb3B0aW9ucy5tZXRob2Q7XG4gIHZhciB0aW1lb3V0ID0gb3B0aW9ucy50aW1lb3V0O1xuXG4gIHVybCA9IHF1ZXJ5c3RyaW5nLnF1ZXJ5aWZ5KHVybCwgYXR0cnMpO1xuICB1cmwgPSBxdWVyeXN0cmluZy5xdWVyeWlmeSh1cmwsIHtcbiAgICBfbWV0aG9kOiBtZXRob2QsXG4gICAgY2FsbGJhY2s6IGNhbGxiYWNrTmFtZVxuICB9KTtcblxuICBzY3JpcHQgPSBfY3JlYXRlU2NyaXB0VGFnKHVybCwgY2FsbGJhY2tOYW1lKTtcbiAgX3NldHVwR2xvYmFsQ2FsbGJhY2soc2NyaXB0LCBjYWxsYmFjaywgY2FsbGJhY2tOYW1lKTtcbiAgX3NldHVwVGltZW91dCh0aW1lb3V0LCBjYWxsYmFja05hbWUpO1xuXG4gIGlmICghaGVhZCkge1xuICAgIGhlYWQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xuICB9XG5cbiAgaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgcmVxdWVzdDogcmVxdWVzdFxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYm9keSkge1xuICB0cnkge1xuICAgIGJvZHkgPSBKU09OLnBhcnNlKGJvZHkpO1xuICB9IGNhdGNoIChlKSB7IC8qIGlnbm9yZWQgKi8gfVxuXG4gIHJldHVybiBib2R5O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobWV0aG9kLCBib2R5KSB7XG4gIGlmIChTdHJpbmcobWV0aG9kKS50b0xvd2VyQ2FzZSgpICE9PSAnZ2V0JyAmJiBib2R5ICE9IG51bGwpIHtcbiAgICBib2R5ID0gdHlwZW9mIGJvZHkgPT09ICdzdHJpbmcnID8gYm9keSA6IEpTT04uc3RyaW5naWZ5KGJvZHkpO1xuICB9XG5cbiAgcmV0dXJuIGJvZHk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBhZGRNZXRhZGF0YShjb25maWd1cmF0aW9uLCBkYXRhKSB7XG4gIGlmIChjb25maWd1cmF0aW9uLm1ldGFkYXRhKSB7XG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIGRhdGEubWV0YWRhdGEgPSBjb25maWd1cmF0aW9uLm1ldGFkYXRhO1xuICAgIH0gZWxzZSB7XG4gICAgICBkYXRhID0ge1xuICAgICAgICBtZXRhZGF0YTogY29uZmlndXJhdGlvbi5tZXRhZGF0YVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZGF0YVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFkZE1ldGFkYXRhO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBhc3NlbWJsZUlGcmFtZXMod2luKSB7XG4gIHZhciBpLCBmcmFtZTtcbiAgdmFyIGZyYW1lcyA9IFtdO1xuXG4gIGZvciAoaSA9IDA7IGkgPCB3aW4uZnJhbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgZnJhbWUgPSB3aW4uZnJhbWVzW2ldO1xuXG4gICAgdHJ5IHtcbiAgICAgIGlmIChmcmFtZS5sb2NhdGlvbi5ocmVmID09PSB3aW5kb3cubG9jYXRpb24uaHJlZikge1xuICAgICAgICBmcmFtZXMucHVzaChmcmFtZSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkgeyAvKiBpZ25vcmVkICovIH1cbiAgfVxuXG4gIHJldHVybiBmcmFtZXM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhc3NlbWJsZUlGcmFtZXM6IGFzc2VtYmxlSUZyYW1lc1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGFzc2lnbk5vcm1hbGl6ZWQgPSB0eXBlb2YgT2JqZWN0LmFzc2lnbiA9PT0gJ2Z1bmN0aW9uJyA/IE9iamVjdC5hc3NpZ24gOiBhc3NpZ25Qb2x5ZmlsbDtcblxuZnVuY3Rpb24gYXNzaWduUG9seWZpbGwoZGVzdGluYXRpb24pIHtcbiAgdmFyIGksIHNvdXJjZSwga2V5O1xuXG4gIGZvciAoaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICBzb3VyY2UgPSBhcmd1bWVudHNbaV07XG4gICAgZm9yIChrZXkgaW4gc291cmNlKSB7XG4gICAgICBpZiAoc291cmNlLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgZGVzdGluYXRpb25ba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBkZXN0aW5hdGlvbjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFzc2lnbjogYXNzaWduTm9ybWFsaXplZCxcbiAgX2Fzc2lnbjogYXNzaWduUG9seWZpbGxcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc1doaXRlbGlzdGVkRG9tYWluID0gcmVxdWlyZSgnLi4vaXMtd2hpdGVsaXN0ZWQtZG9tYWluJyk7XG5cbmZ1bmN0aW9uIGNoZWNrT3JpZ2luKHBvc3RNZXNzYWdlT3JpZ2luLCBtZXJjaGFudFVybCkge1xuICB2YXIgbWVyY2hhbnRPcmlnaW4sIG1lcmNoYW50SG9zdDtcbiAgdmFyIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG5cbiAgYS5ocmVmID0gbWVyY2hhbnRVcmw7XG5cbiAgaWYgKGEucHJvdG9jb2wgPT09ICdodHRwczonKSB7XG4gICAgbWVyY2hhbnRIb3N0ID0gYS5ob3N0LnJlcGxhY2UoLzo0NDMkLywgJycpO1xuICB9IGVsc2UgaWYgKGEucHJvdG9jb2wgPT09ICdodHRwOicpIHtcbiAgICBtZXJjaGFudEhvc3QgPSBhLmhvc3QucmVwbGFjZSgvOjgwJC8sICcnKTtcbiAgfSBlbHNlIHtcbiAgICBtZXJjaGFudEhvc3QgPSBhLmhvc3Q7XG4gIH1cblxuICBtZXJjaGFudE9yaWdpbiA9IGEucHJvdG9jb2wgKyAnLy8nICsgbWVyY2hhbnRIb3N0O1xuXG4gIGlmIChtZXJjaGFudE9yaWdpbiA9PT0gcG9zdE1lc3NhZ2VPcmlnaW4pIHsgcmV0dXJuIHRydWU7IH1cblxuICBhLmhyZWYgPSBwb3N0TWVzc2FnZU9yaWdpbjtcblxuICByZXR1cm4gaXNXaGl0ZWxpc3RlZERvbWFpbihwb3N0TWVzc2FnZU9yaWdpbik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBjaGVja09yaWdpbjogY2hlY2tPcmlnaW5cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBlbnVtZXJhdGUgPSByZXF1aXJlKCcuLi9lbnVtZXJhdGUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBlbnVtZXJhdGUoW1xuICAnQ09ORklHVVJBVElPTl9SRVFVRVNUJ1xuXSwgJ2J1czonKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJ1cyA9IHJlcXVpcmUoJ2ZyYW1lYnVzJyk7XG52YXIgZXZlbnRzID0gcmVxdWlyZSgnLi9ldmVudHMnKTtcbnZhciBjaGVja09yaWdpbiA9IHJlcXVpcmUoJy4vY2hlY2stb3JpZ2luJykuY2hlY2tPcmlnaW47XG52YXIgU2VhbWxlc3NwYXlFcnJvciA9IHJlcXVpcmUoJy4uL3NlYW1sZXNzcGF5LWVycm9yJyk7XG5cbmZ1bmN0aW9uIFNlYW1sZXNzcGF5QnVzKG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgdGhpcy5jaGFubmVsID0gb3B0aW9ucy5jaGFubmVsO1xuICBpZiAoIXRoaXMuY2hhbm5lbCkge1xuICAgIHRocm93IG5ldyBTZWFtbGVzc3BheUVycm9yKHtcbiAgICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuSU5URVJOQUwsXG4gICAgICBjb2RlOiAnTUlTU0lOR19DSEFOTkVMX0lEJyxcbiAgICAgIG1lc3NhZ2U6ICdDaGFubmVsIElEIG11c3QgYmUgc3BlY2lmaWVkLidcbiAgICB9KTtcbiAgfVxuXG4gIHRoaXMubWVyY2hhbnRVcmwgPSBvcHRpb25zLm1lcmNoYW50VXJsO1xuXG4gIHRoaXMuX2lzRGVzdHJveWVkID0gZmFsc2U7XG4gIHRoaXMuX2lzVmVyYm9zZSA9IGZhbHNlO1xuXG4gIHRoaXMuX2xpc3RlbmVycyA9IFtdO1xuXG4gIHRoaXMuX2xvZygnbmV3IGJ1cyBvbiBjaGFubmVsICcgKyB0aGlzLmNoYW5uZWwsIFtsb2NhdGlvbi5ocmVmXSk7XG59XG5cblNlYW1sZXNzcGF5QnVzLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uIChldmVudE5hbWUsIG9yaWdpbmFsSGFuZGxlcikge1xuICB2YXIgbmFtZXNwYWNlZEV2ZW50LCBhcmdzO1xuICB2YXIgaGFuZGxlciA9IG9yaWdpbmFsSGFuZGxlcjtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIGlmICh0aGlzLl9pc0Rlc3Ryb3llZCkgeyByZXR1cm47IH1cblxuICBpZiAodGhpcy5tZXJjaGFudFVybCkge1xuICAgIGhhbmRsZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby1pbnZhbGlkLXRoaXMgKi9cbiAgICAgIGlmIChjaGVja09yaWdpbih0aGlzLm9yaWdpbiwgc2VsZi5tZXJjaGFudFVybCkpIHtcbiAgICAgICAgb3JpZ2luYWxIYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9XG4gICAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLWludmFsaWQtdGhpcyAqL1xuICAgIH07XG4gIH1cblxuICBuYW1lc3BhY2VkRXZlbnQgPSB0aGlzLl9uYW1lc3BhY2VFdmVudChldmVudE5hbWUpO1xuICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgYXJnc1swXSA9IG5hbWVzcGFjZWRFdmVudDtcbiAgYXJnc1sxXSA9IGhhbmRsZXI7XG5cbiAgdGhpcy5fbG9nKCdvbicsIGFyZ3MpO1xuICBidXMub24uYXBwbHkoYnVzLCBhcmdzKTtcblxuICB0aGlzLl9saXN0ZW5lcnMucHVzaCh7XG4gICAgZXZlbnROYW1lOiBldmVudE5hbWUsXG4gICAgaGFuZGxlcjogaGFuZGxlcixcbiAgICBvcmlnaW5hbEhhbmRsZXI6IG9yaWdpbmFsSGFuZGxlclxuICB9KTtcbn07XG5cblNlYW1sZXNzcGF5QnVzLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24gKGV2ZW50TmFtZSkge1xuICB2YXIgYXJncztcblxuICBpZiAodGhpcy5faXNEZXN0cm95ZWQpIHsgcmV0dXJuOyB9XG5cbiAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gIGFyZ3NbMF0gPSB0aGlzLl9uYW1lc3BhY2VFdmVudChldmVudE5hbWUpO1xuXG4gIHRoaXMuX2xvZygnZW1pdCcsIGFyZ3MpO1xuICBidXMuZW1pdC5hcHBseShidXMsIGFyZ3MpO1xufTtcblxuU2VhbWxlc3NwYXlCdXMucHJvdG90eXBlLl9vZmZEaXJlY3QgPSBmdW5jdGlvbiAoZXZlbnROYW1lKSB7XG4gIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcblxuICBpZiAodGhpcy5faXNEZXN0cm95ZWQpIHsgcmV0dXJuOyB9XG5cbiAgYXJnc1swXSA9IHRoaXMuX25hbWVzcGFjZUV2ZW50KGV2ZW50TmFtZSk7XG5cbiAgdGhpcy5fbG9nKCdvZmYnLCBhcmdzKTtcbiAgYnVzLm9mZi5hcHBseShidXMsIGFyZ3MpO1xufTtcblxuU2VhbWxlc3NwYXlCdXMucHJvdG90eXBlLm9mZiA9IGZ1bmN0aW9uIChldmVudE5hbWUsIG9yaWdpbmFsSGFuZGxlcikge1xuICB2YXIgaSwgbGlzdGVuZXI7XG4gIHZhciBoYW5kbGVyID0gb3JpZ2luYWxIYW5kbGVyO1xuXG4gIGlmICh0aGlzLl9pc0Rlc3Ryb3llZCkgeyByZXR1cm47IH1cblxuICBpZiAodGhpcy5tZXJjaGFudFVybCkge1xuICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLl9saXN0ZW5lcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxpc3RlbmVyID0gdGhpcy5fbGlzdGVuZXJzW2ldO1xuXG4gICAgICBpZiAobGlzdGVuZXIub3JpZ2luYWxIYW5kbGVyID09PSBvcmlnaW5hbEhhbmRsZXIpIHtcbiAgICAgICAgaGFuZGxlciA9IGxpc3RlbmVyLmhhbmRsZXI7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdGhpcy5fb2ZmRGlyZWN0KGV2ZW50TmFtZSwgaGFuZGxlcik7XG59O1xuXG5TZWFtbGVzc3BheUJ1cy5wcm90b3R5cGUuX25hbWVzcGFjZUV2ZW50ID0gZnVuY3Rpb24gKGV2ZW50TmFtZSkge1xuICByZXR1cm4gWydzZWFtbGVzc3BheScsIHRoaXMuY2hhbm5lbCwgZXZlbnROYW1lXS5qb2luKCc6Jyk7XG59O1xuXG5TZWFtbGVzc3BheUJ1cy5wcm90b3R5cGUudGVhcmRvd24gPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBsaXN0ZW5lciwgaTtcblxuICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5fbGlzdGVuZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgbGlzdGVuZXIgPSB0aGlzLl9saXN0ZW5lcnNbaV07XG4gICAgdGhpcy5fb2ZmRGlyZWN0KGxpc3RlbmVyLmV2ZW50TmFtZSwgbGlzdGVuZXIuaGFuZGxlcik7XG4gIH1cblxuICB0aGlzLl9saXN0ZW5lcnMubGVuZ3RoID0gMDtcblxuICB0aGlzLl9pc0Rlc3Ryb3llZCA9IHRydWU7XG59O1xuXG5TZWFtbGVzc3BheUJ1cy5wcm90b3R5cGUuX2xvZyA9IGZ1bmN0aW9uIChmdW5jdGlvbk5hbWUsIGFyZ3MpIHtcbiAgaWYgKHRoaXMuX2lzVmVyYm9zZSkge1xuICAgIGNvbnNvbGUubG9nKGZ1bmN0aW9uTmFtZSwgYXJncyk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICB9XG59O1xuXG5TZWFtbGVzc3BheUJ1cy5ldmVudHMgPSBldmVudHM7XG5cbm1vZHVsZS5leHBvcnRzID0gU2VhbWxlc3NwYXlCdXM7XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIF9jbGFzc2VzT2YoZWxlbWVudCkge1xuICByZXR1cm4gZWxlbWVudC5jbGFzc05hbWUudHJpbSgpLnNwbGl0KC9cXHMrLyk7XG59XG5cbmZ1bmN0aW9uIGFkZChlbGVtZW50KSB7XG4gIHZhciB0b0FkZCA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gIHZhciBjbGFzc05hbWUgPSBfY2xhc3Nlc09mKGVsZW1lbnQpLmZpbHRlcihmdW5jdGlvbiAoY2xhc3NuYW1lKSB7XG4gICAgcmV0dXJuIHRvQWRkLmluZGV4T2YoY2xhc3NuYW1lKSA9PT0gLTE7XG4gIH0pLmNvbmNhdCh0b0FkZCkuam9pbignICcpO1xuXG4gIGVsZW1lbnQuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xufVxuXG5mdW5jdGlvbiByZW1vdmUoZWxlbWVudCkge1xuICB2YXIgdG9SZW1vdmUgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICB2YXIgY2xhc3NOYW1lID0gX2NsYXNzZXNPZihlbGVtZW50KS5maWx0ZXIoZnVuY3Rpb24gKGNsYXNzbmFtZSkge1xuICAgIHJldHVybiB0b1JlbW92ZS5pbmRleE9mKGNsYXNzbmFtZSkgPT09IC0xO1xuICB9KS5qb2luKCcgJyk7XG5cbiAgZWxlbWVudC5jbGFzc05hbWUgPSBjbGFzc05hbWU7XG59XG5cbmZ1bmN0aW9uIHRvZ2dsZShlbGVtZW50LCBjbGFzc25hbWUsIGFkZGluZykge1xuICBpZiAoYWRkaW5nKSB7XG4gICAgYWRkKGVsZW1lbnQsIGNsYXNzbmFtZSk7XG4gIH0gZWxzZSB7XG4gICAgcmVtb3ZlKGVsZW1lbnQsIGNsYXNzbmFtZSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFkZDogYWRkLFxuICByZW1vdmU6IHJlbW92ZSxcbiAgdG9nZ2xlOiB0b2dnbGVcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIGNvbXBhcmVQb3NzaWJsZUNhcmRUeXBlcyhhLCBiKSB7XG4gIHZhciBhSGFzaDtcblxuICBpZiAoYS5sZW5ndGggIT09IGIubGVuZ3RoKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIGFIYXNoID0gYS5yZWR1Y2UoZnVuY3Rpb24gKGFjY3VtLCB0eXBlKSB7XG4gICAgYWNjdW1bdHlwZS50eXBlXSA9IHRydWU7XG4gICAgcmV0dXJuIGFjY3VtO1xuICB9LCB7fSk7XG5cbiAgcmV0dXJuIGIuZXZlcnkoZnVuY3Rpb24gKHR5cGUpIHtcbiAgICByZXR1cm4gYUhhc2guaGFzT3duUHJvcGVydHkodHlwZS50eXBlKTtcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29tcGFyZVBvc3NpYmxlQ2FyZFR5cGVzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgVkVSU0lPTjogXCJ3ZWItc2RrXCIsXG4gIEFTU0VUU19IT1NUOiBcImh0dHBzOi8vd2ViLXNkay1leGFtcGxlcy5zZWFtbGVzc3BheS5kZXZcIixcbiAgQVNTRVRTX1MzX0JVQ0tFVDogXCJ3ZWItc2RrLnNlYW1sZXNzcGF5LmNvbVwiLFxuICBBUElfVVJMX1BST0RVQ1RJT046IFwiaHR0cHM6Ly9hcGkuc2VhbWxlc3NwYXkuY29tXCIsXG4gIEFQSV9VUkxfU0FOREJPWDogXCJodHRwczovL2FwaS5zYW5kYm94LnNlYW1sZXNzcGF5LmNvbVwiLFxuICBBUElfVVJMX1NUQUdJTkc6IFwiaHR0cHM6Ly9hcGkuc2VhbWxlc3NwYXkuZGV2XCIsXG4gIFBBTl9WQVVMVF9VUkxfUFJPRFVDVElPTjogXCJodHRwczovL3Bhbi12YXVsdC5zZWFtbGVzc3BheS5jb21cIixcbiAgUEFOX1ZBVUxUX1VSTF9TQU5EQk9YOiBcImh0dHBzOi8vcGFuLXZhdWx0LnNhbmRib3guc2VhbWxlc3NwYXkuY29tXCIsXG4gIFBBTl9WQVVMVF9VUkxfU1RBR0lORzogXCJodHRwczovL3Bhbi12YXVsdC5zZWFtbGVzc3BheS5kZXZcIixcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBTZWFtbGVzc3BheUVycm9yID0gcmVxdWlyZSgnLi9zZWFtbGVzc3BheS1lcnJvcicpO1xuXG5mdW5jdGlvbiBjb252ZXJ0VG9TZWFtbGVzc3BheUVycm9yKG9yaWdpbmFsRXJyLCBvdGhlckVycm9yT2JqZWN0KSB7XG4gIGlmIChvcmlnaW5hbEVyciBpbnN0YW5jZW9mIFNlYW1sZXNzcGF5RXJyb3IgfHwgKG9yaWdpbmFsRXJyICYmIG9yaWdpbmFsRXJyLm5hbWUgPT09ICdTZWFtbGVzc3BheUVycm9yJykpIHtcbiAgICByZXR1cm4gb3JpZ2luYWxFcnI7XG4gIH1cblxuICByZXR1cm4gbmV3IFNlYW1sZXNzcGF5RXJyb3Ioe1xuICAgIHR5cGU6IG90aGVyRXJyb3JPYmplY3QudHlwZSxcbiAgICBjb2RlOiBvdGhlckVycm9yT2JqZWN0LmNvZGUsXG4gICAgbWVzc2FnZTogb3RoZXJFcnJvck9iamVjdC5tZXNzYWdlLFxuICAgIGRldGFpbHM6IHtcbiAgICAgIG9yaWdpbmFsRXJyb3I6IG9yaWdpbmFsRXJyXG4gICAgfVxuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb252ZXJ0VG9TZWFtbGVzc3BheUVycm9yO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVzdHJpY3RlZElucHV0ID0gcmVxdWlyZSgnQHNlYW1sZXNzcGF5L3Jlc3RyaWN0ZWQtaW5wdXQnKTtcbnZhciBGYWtlUmVzdHJpY3RlZElucHV0ID0gcmVxdWlyZSgnLi9mYWtlLXJlc3RyaWN0ZWQtaW5wdXQnKTtcbnZhciBTVVBQT1JURURfSU5QVVRfVFlQRVMgPSBbJ3RleHQnLCAndGVsJywgJ3VybCcsICdzZWFyY2gnLCAncGFzc3dvcmQnXTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICB2YXIgc2hvdWxkRm9ybWF0ID0gb3B0aW9ucy5zaG91bGRGb3JtYXQ7XG5cbiAgaWYgKFNVUFBPUlRFRF9JTlBVVF9UWVBFUy5pbmRleE9mKG9wdGlvbnMuZWxlbWVudC50eXBlKSA9PT0gLTEpIHtcbiAgICBzaG91bGRGb3JtYXQgPSBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiBzaG91bGRGb3JtYXQgPyBuZXcgUmVzdHJpY3RlZElucHV0KG9wdGlvbnMpIDogbmV3IEZha2VSZXN0cmljdGVkSW5wdXQob3B0aW9ucyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBlbnVtZXJhdGUodmFsdWVzLCBwcmVmaXgpIHtcbiAgcHJlZml4ID0gcHJlZml4ID09IG51bGwgPyAnJyA6IHByZWZpeDtcblxuICByZXR1cm4gdmFsdWVzLnJlZHVjZShmdW5jdGlvbiAoZW51bWVyYXRpb24sIHZhbHVlKSB7XG4gICAgZW51bWVyYXRpb25bdmFsdWVdID0gcHJlZml4ICsgdmFsdWU7XG4gICAgcmV0dXJuIGVudW1lcmF0aW9uO1xuICB9LCB7fSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZW51bWVyYXRlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgU2VhbWxlc3NwYXlFcnJvciA9IHJlcXVpcmUoJy4vc2VhbWxlc3NwYXktZXJyb3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIElOVkFMSURfVVNFX09GX0lOVEVSTkFMX0ZVTkNUSU9OOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5JTlRFUk5BTCxcbiAgICBjb2RlOiAnSU5WQUxJRF9VU0VfT0ZfSU5URVJOQUxfRlVOQ1RJT04nXG4gIH0sXG4gIENBTExCQUNLX1JFUVVJUkVEOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnQ0FMTEJBQ0tfUkVRVUlSRUQnXG4gIH0sXG4gIElOU1RBTlRJQVRJT05fT1BUSU9OX1JFUVVJUkVEOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnSU5TVEFOVElBVElPTl9PUFRJT05fUkVRVUlSRUQnXG4gIH0sXG4gIElOVkFMSURfT1BUSU9OOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5NRVJDSEFOVCxcbiAgICBjb2RlOiAnSU5WQUxJRF9PUFRJT04nXG4gIH0sXG4gIElOQ09NUEFUSUJMRV9WRVJTSU9OUzoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTUVSQ0hBTlQsXG4gICAgY29kZTogJ0lOQ09NUEFUSUJMRV9WRVJTSU9OUydcbiAgfSxcbiAgSU5DT01QQVRJQkxFX0ZJRUxEU19TRVQ6IHtcbiAgICB0eXBlOiBTZWFtbGVzc3BheUVycm9yLnR5cGVzLk1FUkNIQU5ULFxuICAgIGNvZGU6ICdJTkNPTVBBVElCTEVfRklFTERTX1NFVCdcbiAgfSxcbiAgTUVUSE9EX0NBTExFRF9BRlRFUl9URUFSRE9XTjoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTUVSQ0hBTlQsXG4gICAgY29kZTogJ01FVEhPRF9DQUxMRURfQUZURVJfVEVBUkRPV04nXG4gIH0sXG4gIFNFQU1MRVNTUEFZX0FQSV9BQ0NFU1NfUkVTVFJJQ1RFRDoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuTUVSQ0hBTlQsXG4gICAgY29kZTogJ1NFQU1MRVNTUEFZX0FQSV9BQ0NFU1NfUkVTVFJJQ1RFRCcsXG4gICAgbWVzc2FnZTogJ1lvdXIgYWNjZXNzIGlzIHJlc3RyaWN0ZWQgYW5kIGNhbm5vdCB1c2UgdGhpcyBwYXJ0IG9mIHRoZSBTZWFtbGVzc3BheSBBUEkuJ1xuICB9LFxuICBTRUFNTEVTU1BBWV9QQVlQQUxfTk9UX0xPQURFRDoge1xuICAgIHR5cGU6IFNlYW1sZXNzcGF5RXJyb3IudHlwZXMuSU5URVJOQUwsXG4gICAgY29kZTogJ1NFQU1MRVNTUEFZX1BBWVBBTF9OT1RfTE9BREVEJyxcbiAgICBtZXNzYWdlOiAnUGF5cGFsIFNESyBjb3VsZCBub3QgYmUgbG9hZGVkLidcbiAgfSxcbiAgSU5WQUxJRF9MQVRJTjFfU1RSSU5HOiB7XG4gICAgdHlwZTogU2VhbWxlc3NwYXlFcnJvci50eXBlcy5JTlRFUk5BTCxcbiAgICBjb2RlOiAnSU5WQUxJRF9MQVRJTjFfU1RSSU5HJ1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBGYWtlUmVzdHJpY3RlZElucHV0KG9wdGlvbnMpIHtcbiAgdGhpcy5pbnB1dEVsZW1lbnQgPSBvcHRpb25zLmVsZW1lbnQ7XG59XG5cbkZha2VSZXN0cmljdGVkSW5wdXQucHJvdG90eXBlLmdldFVuZm9ybWF0dGVkVmFsdWUgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLmlucHV0RWxlbWVudC52YWx1ZTtcbn07XG5cbkZha2VSZXN0cmljdGVkSW5wdXQucHJvdG90eXBlLnNldFBhdHRlcm4gPSBmdW5jdGlvbiAoKSB7fTtcblxubW9kdWxlLmV4cG9ydHMgPSBGYWtlUmVzdHJpY3RlZElucHV0O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQVBJX0hPU1QgPSB1bmRlZmluZWQ7XG52YXIgUEFOVkFVTFRfSE9TVCA9IHVuZGVmaW5lZDtcbnZhciBBU1NFVFNfSE9TVCA9IFwiaHR0cDovL2xvY2FsaG9zdDozMDAxL2RldlwiO1xuXG52YXIgbGVnYWxIb3N0cyA9IFtcbiAgJ3NlYW1sZXNzcGF5LmNvbScsXG4gICdzZWFtbGVzc3BheS5kZXYnLFxuICAnc2VhbWxlc3NwYXkuaW8nLFxuICAnd2ViLXNkay5zZWFtbGVzc3BheS5jb20nLFxuICAnYXBpLnNlYW1sZXNzcGF5LmNvbScsXG4gICdhcGkuc2VhbWxlc3NwYXkuZGV2JyxcbiAgJ2FwaS5zZWFtbGVzc3BheS5pbycsXG4gICdwYW4tdmF1bHQuc2VhbWxlc3NwYXkuY29tJyxcbiAgJ3Bhbi12YXVsdC5zZWFtbGVzc3BheS5kZXYnLFxuICAncGFuLXZhdWx0LnNlYW1sZXNzcGF5LmlvJyxcbiAgJ2FwaS5zYW5kYm94LnNlYW1sZXNzcGF5LmNvbScsXG4gICdhcGkuc2FuZGJveC5zZWFtbGVzc3BheS5kZXYnLFxuICAnYXBpLnNhbmRib3guc2VhbWxlc3NwYXkuaW8nLFxuICAncGFuLXZhdWx0LnNhbmRib3guc2VhbWxlc3NwYXkuY29tJyxcbiAgJ3Bhbi12YXVsdC5zYW5kYm94LnNlYW1sZXNzcGF5LmRldicsXG4gICdwYW4tdmF1bHQuc2FuZGJveC5zZWFtbGVzc3BheS5pbydcbl07XG5cbi8vIHJlbW92ZUlmKHByb2R1Y3Rpb24pXG5sZWdhbEhvc3RzLnB1c2goJ2xvY2FsaG9zdCcpO1xuaWYgKEFQSV9IT1NUKSB7XG4gIGxlZ2FsSG9zdHMucHVzaChzdHJpcFN1YmRvbWFpbnMoQVBJX0hPU1QpKTtcbn1cbmlmIChQQU5WQVVMVF9IT1NUKSB7XG4gIGxlZ2FsSG9zdHMucHVzaChzdHJpcFN1YmRvbWFpbnMoUEFOVkFVTFRfSE9TVCkpO1xufVxuaWYgKEFTU0VUU19IT1NUKSB7XG4gIGxlZ2FsSG9zdHMucHVzaChzdHJpcFN1YmRvbWFpbnMoQVNTRVRTX0hPU1QpLnJlcGxhY2UoJ2h0dHA6Ly8nLCAnJykucmVwbGFjZSgnaHR0cHM6Ly8nLCAnJykpO1xufVxuLy8gZW5kUmVtb3ZlSWYocHJvZHVjdGlvbilcblxuZnVuY3Rpb24gc3RyaXBTdWJkb21haW5zKGRvbWFpbikge1xuICByZXR1cm4gZG9tYWluLnNwbGl0KCcuJykuc2xpY2UoLTIpLmpvaW4oJy4nKTtcbn1cblxuZnVuY3Rpb24gaXNXaGl0ZWxpc3RlZERvbWFpbih1cmwpIHtcbiAgLy8gdmFyIG1haW5Eb21haW47XG5cbiAgLy8gdXJsID0gdXJsLnRvTG93ZXJDYXNlKCk7XG5cbiAgLy8gaWYgKCEobmV3IFJlZ0V4cCgnXmh0dHBzPzonKSkudGVzdCh1cmwpKSB7XG4gIC8vICAgcmV0dXJuIGZhbHNlO1xuICAvLyB9XG5cbiAgLy8gcGFyc2VyID0gcGFyc2VyIHx8IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgLy8gcGFyc2VyLmhyZWYgPSB1cmw7XG4gIC8vIG1haW5Eb21haW4gPSBzdHJpcFN1YmRvbWFpbnMocGFyc2VyLmhvc3RuYW1lKTtcbiAgdHJ5IHtcbiAgICB2YXIgcGFyc2VkVXJsID0gbmV3IFVSTCh1cmwpO1xuICAgIHJldHVybiBsZWdhbEhvc3RzLmluZGV4T2Yoc3RyaXBTdWJkb21haW5zKHBhcnNlZFVybC5ob3N0bmFtZSkpICE9PSAtMTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzV2hpdGVsaXN0ZWREb21haW47XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIG9uY2UoZm4pIHtcbiAgdmFyIGNhbGxlZCA9IGZhbHNlO1xuXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCFjYWxsZWQpIHtcbiAgICAgIGNhbGxlZCA9IHRydWU7XG4gICAgICBmbi5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBvbmNlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgUHJvbWlzZSA9IGdsb2JhbC5Qcm9taXNlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByb21pc2U7XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIF9ub3RFbXB0eShvYmopIHtcbiAgdmFyIGtleTtcblxuICBmb3IgKGtleSBpbiBvYmopIHtcbiAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkpIHsgcmV0dXJuIHRydWU7IH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gX2lzQXJyYXkodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIHZhbHVlLmxlbmd0aCA9PT0gJ251bWJlcicgJiZcbiAgICBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBBcnJheV0nIHx8IGZhbHNlO1xufVxuXG5mdW5jdGlvbiBwYXJzZSh1cmwpIHtcbiAgdmFyIHF1ZXJ5LCBwYXJhbXM7XG5cbiAgdXJsID0gdXJsIHx8IGdsb2JhbC5sb2NhdGlvbi5ocmVmO1xuXG4gIGlmICghL1xcPy8udGVzdCh1cmwpKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgcXVlcnkgPSB1cmwucmVwbGFjZSgvIy4qJC8sICcnKS5yZXBsYWNlKC9eLipcXD8vLCAnJykuc3BsaXQoJyYnKTtcblxuICBwYXJhbXMgPSBxdWVyeS5yZWR1Y2UoZnVuY3Rpb24gKHRvUmV0dXJuLCBrZXlWYWx1ZSkge1xuICAgIHZhciBwYXJ0cyA9IGtleVZhbHVlLnNwbGl0KCc9Jyk7XG4gICAgdmFyIGtleSA9IGRlY29kZVVSSUNvbXBvbmVudChwYXJ0c1swXSk7XG4gICAgdmFyIHZhbHVlID0gZGVjb2RlVVJJQ29tcG9uZW50KHBhcnRzWzFdKTtcblxuICAgIHRvUmV0dXJuW2tleV0gPSB2YWx1ZTtcbiAgICByZXR1cm4gdG9SZXR1cm47XG4gIH0sIHt9KTtcblxuICByZXR1cm4gcGFyYW1zO1xufVxuXG5mdW5jdGlvbiBzdHJpbmdpZnkocGFyYW1zLCBuYW1lc3BhY2UpIHtcbiAgdmFyIGssIHYsIHA7XG4gIHZhciBxdWVyeSA9IFtdO1xuXG4gIGZvciAocCBpbiBwYXJhbXMpIHtcbiAgICBpZiAoIXBhcmFtcy5oYXNPd25Qcm9wZXJ0eShwKSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgdiA9IHBhcmFtc1twXTtcblxuICAgIGlmIChuYW1lc3BhY2UpIHtcbiAgICAgIGlmIChfaXNBcnJheShwYXJhbXMpKSB7XG4gICAgICAgIGsgPSBuYW1lc3BhY2UgKyAnW10nO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgayA9IG5hbWVzcGFjZSArICdbJyArIHAgKyAnXSc7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGsgPSBwO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHYgPT09ICdvYmplY3QnKSB7XG4gICAgICBxdWVyeS5wdXNoKHN0cmluZ2lmeSh2LCBrKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHF1ZXJ5LnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGspICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHYpKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcXVlcnkuam9pbignJicpO1xufVxuXG5mdW5jdGlvbiBxdWVyeWlmeSh1cmwsIHBhcmFtcykge1xuICB1cmwgPSB1cmwgfHwgJyc7XG5cbiAgaWYgKHBhcmFtcyAhPSBudWxsICYmIHR5cGVvZiBwYXJhbXMgPT09ICdvYmplY3QnICYmIF9ub3RFbXB0eShwYXJhbXMpKSB7XG4gICAgdXJsICs9IHVybC5pbmRleE9mKCc/JykgPT09IC0xID8gJz8nIDogJyc7XG4gICAgdXJsICs9IHVybC5pbmRleE9mKCc9JykgIT09IC0xID8gJyYnIDogJyc7XG4gICAgdXJsICs9IHN0cmluZ2lmeShwYXJhbXMpO1xuICB9XG5cbiAgcmV0dXJuIHVybDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHBhcnNlOiBwYXJzZSxcbiAgc3RyaW5naWZ5OiBzdHJpbmdpZnksXG4gIHF1ZXJ5aWZ5OiBxdWVyeWlmeVxufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhc3NpZ24gPSByZXF1aXJlKCcuL2Fzc2lnbicpLmFzc2lnbjtcbnZhciBQcm9taXNlID0gcmVxdWlyZSgnLi9wcm9taXNlJyk7XG5cbmZ1bmN0aW9uIHJlcXVlc3RzU2VxdWVuY2UoY2xpZW50LCByZXF1ZXN0c0RhdGEpIHtcbiAgdmFyIHJlc3BvbnNlcyA9IFtdO1xuICB2YXIgZGVmYXVsdFBhcmFtcyA9IHtcbiAgICBhcGk6ICd0b2tlbml6ZXJBcGknLFxuICAgIG1ldGhvZDogJ3Bvc3QnLFxuICAgIGVuZHBvaW50OiAndG9rZW5zJyxcbiAgICBnZXREYXRhOiBmdW5jdGlvbiAoKSB7IHJldHVybiB7fTsgfVxuICB9O1xuXG4gIHJlcXVlc3RzRGF0YSA9IHJlcXVlc3RzRGF0YSB8fCBbZGVmYXVsdFBhcmFtc107XG5cbiAgcmV0dXJuIHJlcXVlc3RzRGF0YS5yZWR1Y2UoXG4gICAgZnVuY3Rpb24gKHByb21pc2UsIHBhcmFtcykge1xuICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IGRlZmF1bHRQYXJhbXM7XG5cbiAgICAgIHJldHVybiBwcm9taXNlLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7IC8vIGhlcmUgd2UgZ2V0IHByZXZpb3VzIHJlcXVlc3QgcmVzdWx0XG4gICAgICAgIHZhciBpc1ByZXZpb3VzRmFpbGVkID0gcmVzcG9uc2UgaW5zdGFuY2VvZiBFcnJvciB8fCAocmVzcG9uc2UgJiYgcmVzcG9uc2UubmFtZSA9PT0gJ1NlYW1sZXNzcGF5RXJyb3InKTtcbiAgICAgICAgdmFyIGRhdGEgPSBwYXJhbXMuZ2V0RGF0YShyZXNwb25zZSk7XG4gICAgICAgIHZhciBoYXNGaWVsZHMgPSBPYmplY3Qua2V5cyhkYXRhKS5maWx0ZXIoZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gWydwYXltZW50VHlwZSddLmluZGV4T2Yoa2V5KSA9PT0gLTE7IH0pLmxlbmd0aCA+IDA7XG5cbiAgICAgICAgaWYgKCFoYXNGaWVsZHMpIHtcbiAgICAgICAgICByZXNwb25zZXMucHVzaCh7fSk7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaXNQcmV2aW91c0ZhaWxlZCA/IFByb21pc2UucmVzb2x2ZShyZXNwb25zZSkgOiBjbGllbnRcbiAgICAgICAgICAucmVxdWVzdChhc3NpZ24oe30sIHBhcmFtcywgeyBkYXRhOiBkYXRhIH0pKVxuICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBlcnJvcjtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgIHJlc3BvbnNlcy5wdXNoKHJlc3VsdCk7XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIFByb21pc2UucmVzb2x2ZShmYWxzZSlcbiAgKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gcmVzcG9uc2VzO1xuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSByZXF1ZXN0c1NlcXVlbmNlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZW51bWVyYXRlID0gcmVxdWlyZSgnLi9lbnVtZXJhdGUnKTtcblxuLyoqXG4gKiBAY2xhc3NcbiAqIEBnbG9iYWxcbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIENvbnN0cnVjdGlvbiBvcHRpb25zXG4gKiBAY2xhc3NkZXNjIFRoaXMgY2xhc3MgaXMgdXNlZCB0byByZXBvcnQgZXJyb3IgY29uZGl0aW9ucywgZnJlcXVlbnRseSBhcyB0aGUgZmlyc3QgcGFyYW1ldGVyIHRvIGNhbGxiYWNrcyB0aHJvdWdob3V0IHRoZSBTZWFtbGVzc3BheSBTREsuXG4gKiBAZGVzY3JpcHRpb24gPHN0cm9uZz5Zb3UgY2Fubm90IHVzZSB0aGlzIGNvbnN0cnVjdG9yIGRpcmVjdGx5LiBJbnRlcmFjdCB3aXRoIGluc3RhbmNlcyBvZiB0aGlzIGNsYXNzIHRocm91Z2gge0BsaW5rIGNhbGxiYWNrIGNhbGxiYWNrc30uPC9zdHJvbmc+XG4gKi9cbmZ1bmN0aW9uIFNlYW1sZXNzcGF5RXJyb3Iob3B0aW9ucykge1xuICBpZiAoIVNlYW1sZXNzcGF5RXJyb3IudHlwZXMuaGFzT3duUHJvcGVydHkob3B0aW9ucy50eXBlKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihvcHRpb25zLnR5cGUgKyAnIGlzIG5vdCBhIHZhbGlkIHR5cGUuJyk7XG4gIH1cblxuICBpZiAoIW9wdGlvbnMuY29kZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignRXJyb3IgY29kZSByZXF1aXJlZC4nKTtcbiAgfVxuXG4gIGlmICghb3B0aW9ucy5tZXNzYWdlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdFcnJvciBtZXNzYWdlIHJlcXVpcmVkLicpO1xuICB9XG5cbiAgdGhpcy5uYW1lID0gJ1NlYW1sZXNzcGF5RXJyb3InO1xuXG4gIC8qKlxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKiBAZGVzY3JpcHRpb24gQSBjb2RlIHRoYXQgY29ycmVzcG9uZHMgdG8gc3BlY2lmaWMgZXJyb3JzLlxuICAgKi9cbiAgdGhpcy5jb2RlID0gb3B0aW9ucy5jb2RlO1xuXG4gIC8qKlxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKiBAZGVzY3JpcHRpb24gQSBzaG9ydCBkZXNjcmlwdGlvbiBvZiB0aGUgZXJyb3IuXG4gICAqL1xuICB0aGlzLm1lc3NhZ2UgPSBvcHRpb25zLm1lc3NhZ2U7XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtTZWFtbGVzc3BheUVycm9yLnR5cGVzfVxuICAgKiBAZGVzY3JpcHRpb24gVGhlIHR5cGUgb2YgZXJyb3IuXG4gICAqL1xuICB0aGlzLnR5cGUgPSBvcHRpb25zLnR5cGU7XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtvYmplY3Q9fVxuICAgKiBAZGVzY3JpcHRpb24gQWRkaXRpb25hbCBpbmZvcm1hdGlvbiBhYm91dCB0aGUgZXJyb3IsIHN1Y2ggYXMgYW4gdW5kZXJseWluZyBuZXR3b3JrIGVycm9yIHJlc3BvbnNlLlxuICAgKi9cbiAgdGhpcy5kZXRhaWxzID0gb3B0aW9ucy5kZXRhaWxzO1xufVxuXG5TZWFtbGVzc3BheUVycm9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlKTtcblNlYW1sZXNzcGF5RXJyb3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gU2VhbWxlc3NwYXlFcnJvcjtcblxuLyoqXG4gKiBFbnVtIGZvciB7QGxpbmsgU2VhbWxlc3NwYXlFcnJvcn0gdHlwZXMuXG4gKiBAbmFtZSBTZWFtbGVzc3BheUVycm9yLnR5cGVzXG4gKiBAZW51bVxuICogQHJlYWRvbmx5XG4gKiBAbWVtYmVyb2YgU2VhbWxlc3NwYXlFcnJvclxuICogQHByb3BlcnR5IHtzdHJpbmd9IENVU1RPTUVSIEFuIGVycm9yIGNhdXNlZCBieSB0aGUgY3VzdG9tZXIuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gTUVSQ0hBTlQgQW4gZXJyb3IgdGhhdCBpcyBhY3Rpb25hYmxlIGJ5IHRoZSBtZXJjaGFudC5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBORVRXT1JLIEFuIGVycm9yIGR1ZSB0byBhIG5ldHdvcmsgcHJvYmxlbS5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBJTlRFUk5BTCBBbiBlcnJvciBjYXVzZWQgYnkgU2VhbWxlc3NwYXkgY29kZS5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBVTktOT1dOIEFuIGVycm9yIHdoZXJlIHRoZSBvcmlnaW4gaXMgdW5rbm93bi5cbiAqL1xuU2VhbWxlc3NwYXlFcnJvci50eXBlcyA9IGVudW1lcmF0ZShbXG4gICdDVVNUT01FUicsXG4gICdNRVJDSEFOVCcsXG4gICdORVRXT1JLJyxcbiAgJ0lOVEVSTkFMJyxcbiAgJ1VOS05PV04nXG5dKTtcblxubW9kdWxlLmV4cG9ydHMgPSBTZWFtbGVzc3BheUVycm9yO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiB1dWlkKCkge1xuICByZXR1cm4gJ3h4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eCcucmVwbGFjZSgvW3h5XS9nLCBmdW5jdGlvbiAoYykge1xuICAgIHZhciByID0gTWF0aC5yYW5kb20oKSAqIDE2IHwgMDtcbiAgICB2YXIgdiA9IGMgPT09ICd4JyA/IHIgOiByICYgMHgzIHwgMHg4O1xuXG4gICAgcmV0dXJuIHYudG9TdHJpbmcoMTYpO1xuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB1dWlkO1xuIl19
