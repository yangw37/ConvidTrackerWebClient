(function() {
    var $D = Date;
    var lang = Date.CultureStrings ? Date.CultureStrings.lang : null;
    var loggedKeys = {};
    var getText = {
        getFromKey: function(key, countryCode) {
            var output;
            if (Date.CultureStrings && Date.CultureStrings[countryCode] && Date.CultureStrings[countryCode][key]) {
                output = Date.CultureStrings[countryCode][key];
            } else {
                output = getText.buildFromDefault(key);
            }
            if (key.charAt(0) === "/") {
                output = getText.buildFromRegex(key, countryCode);
            }
            return output;
        },
        getFromObjectValues: function(obj, countryCode) {
            var key, output = {};
            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    output[key] = getText.getFromKey(obj[key], countryCode);
                }
            }
            return output;
        },
        getFromObjectKeys: function(obj, countryCode) {
            var key, output = {};
            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    output[getText.getFromKey(key, countryCode)] = obj[key];
                }
            }
            return output;
        },
        getFromArray: function(arr, countryCode) {
            var output = [];
            for (var i = 0; i < arr.length; i++) {
                if (i in arr) {
                    output[i] = getText.getFromKey(arr[i], countryCode);
                }
            }
            return output;
        },
        buildFromDefault: function(key) {
            var output, length, split, last;
            switch (key) {
                case "name":
                    output = "en-US";
                    break;
                case "englishName":
                    output = "English (United States)";
                    break;
                case "nativeName":
                    output = "English (United States)";
                    break;
                case "twoDigitYearMax":
                    output = 2049;
                    break;
                case "firstDayOfWeek":
                    output = 0;
                    break;
                default:
                    output = key;
                    split = key.split("_");
                    length = split.length;
                    if (length > 1 && key.charAt(0) !== "/") {
                        last = split[(length - 1)].toLowerCase();
                        if (last === "initial" || last === "abbr") {
                            output = split[0];
                        }
                    }
                    break;
            }
            return output;
        },
        buildFromRegex: function(key, countryCode) {
            var output;
            if (Date.CultureStrings && Date.CultureStrings[countryCode] && Date.CultureStrings[countryCode][key]) {
                output = new RegExp(Date.CultureStrings[countryCode][key], "i");
            } else {
                output = new RegExp(key.replace(new RegExp("/", "g"), ""), "i");
            }
            return output;
        }
    };
    var shallowMerge = function(obj1, obj2) {
        for (var attrname in obj2) {
            if (obj2.hasOwnProperty(attrname)) {
                obj1[attrname] = obj2[attrname];
            }
        }
    };
    var __ = function(key, language) {
        var countryCode = (language) ? language : lang;
        loggedKeys[key] = key;
        if (typeof key === "object") {
            if (key instanceof Array) {
                return getText.getFromArray(key, countryCode);
            } else {
                return getText.getFromObjectKeys(key, countryCode);
            }
        } else {
            return getText.getFromKey(key, countryCode);
        }
    };
    var loadI18nScript = function(code) {
        var url = Date.Config.i18n + code + ".js";
        var head = document.getElementsByTagName("head")[0] || document.documentElement;
        var script = document.createElement("script");
        script.src = url;
        var completed = false;
        var events = {
            done: function() {}
        };
        script.onload = script.onreadystatechange = function() {
            if (!completed && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
                events.done();
                head.removeChild(script);
            }
        };
        setTimeout(function() {
            head.insertBefore(script, head.firstChild);
        }, 0);
        return {
            done: function(cb) {
                events.done = function() {
                    if (cb) {
                        setTimeout(cb, 0);
                    }
                };
            }
        };
    };
    var buildInfo = {
        buildFromMethodHash: function(obj) {
            var key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    obj[key] = buildInfo[obj[key]]();
                }
            }
            return obj;
        },
        timeZoneDST: function() {
            var DST = {
                "CHADT": "+1345",
                "NZDT": "+1300",
                "AEDT": "+1100",
                "ACDT": "+1030",
                "AZST": "+0500",
                "IRDT": "+0430",
                "EEST": "+0300",
                "CEST": "+0200",
                "BST": "+0100",
                "PMDT": "-0200",
                "ADT": "-0300",
                "NDT": "-0230",
                "EDT": "-0400",
                "CDT": "-0500",
                "MDT": "-0600",
                "PDT": "-0700",
                "AKDT": "-0800",
                "HADT": "-0900"
            };
            return __(DST);
        },
        timeZoneStandard: function() {
            var standard = {
                "LINT": "+1400",
                "TOT": "+1300",
                "CHAST": "+1245",
                "NZST": "+1200",
                "NFT": "+1130",
                "SBT": "+1100",
                "AEST": "+1000",
                "ACST": "+0930",
                "JST": "+0900",
                "CWST": "+0845",
                "CT": "+0800",
                "ICT": "+0700",
                "MMT": "+0630",
                "BST": "+0600",
                "NPT": "+0545",
                "IST": "+0530",
                "PKT": "+0500",
                "AFT": "+0430",
                "MSK": "+0400",
                "IRST": "+0330",
                "FET": "+0300",
                "EET": "+0200",
                "CET": "+0100",
                "GMT": "+0000",
                "UTC": "+0000",
                "CVT": "-0100",
                "GST": "-0200",
                "BRT": "-0300",
                "NST": "-0330",
                "AST": "-0400",
                "EST": "-0500",
                "CST": "-0600",
                "MST": "-0700",
                "PST": "-0800",
                "AKST": "-0900",
                "MIT": "-0930",
                "HST": "-1000",
                "SST": "-1100",
                "BIT": "-1200"
            };
            return __(standard);
        },
        timeZones: function(data) {
            var zone;
            data.timezones = [];
            for (zone in data.abbreviatedTimeZoneStandard) {
                if (data.abbreviatedTimeZoneStandard.hasOwnProperty(zone)) {
                    data.timezones.push({
                        name: zone,
                        offset: data.abbreviatedTimeZoneStandard[zone]
                    });
                }
            }
            for (zone in data.abbreviatedTimeZoneDST) {
                if (data.abbreviatedTimeZoneDST.hasOwnProperty(zone)) {
                    data.timezones.push({
                        name: zone,
                        offset: data.abbreviatedTimeZoneDST[zone],
                        dst: true
                    });
                }
            }
            return data.timezones;
        },
        days: function() {
            return __(["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]);
        },
        dayAbbr: function() {
            return __(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
        },
        dayShortNames: function() {
            return __(["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]);
        },
        dayFirstLetters: function() {
            return __(["S_Sun_Initial", "M_Mon_Initial", "T_Tues_Initial", "W_Wed_Initial", "T_Thu_Initial", "F_Fri_Initial", "S_Sat_Initial"]);
        },
        months: function() {
            return __(["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]);
        },
        monthAbbr: function() {
            return __(["Jan_Abbr", "Feb_Abbr", "Mar_Abbr", "Apr_Abbr", "May_Abbr", "Jun_Abbr", "Jul_Abbr", "Aug_Abbr", "Sep_Abbr", "Oct_Abbr", "Nov_Abbr", "Dec_Abbr"]);
        },
        formatPatterns: function() {
            return getText.getFromObjectValues({
                shortDate: "M/d/yyyy",
                longDate: "dddd, MMMM dd, yyyy",
                shortTime: "h:mm tt",
                longTime: "h:mm:ss tt",
                fullDateTime: "dddd, MMMM dd, yyyy h:mm:ss tt",
                sortableDateTime: "yyyy-MM-ddTHH:mm:ss",
                universalSortableDateTime: "yyyy-MM-dd HH:mm:ssZ",
                rfc1123: "ddd, dd MMM yyyy HH:mm:ss",
                monthDay: "MMMM dd",
                yearMonth: "MMMM, yyyy"
            }, Date.i18n.currentLanguage());
        },
        regex: function() {
            return getText.getFromObjectValues({
                inTheMorning: "/( in the )(morn(ing)?)\\b/",
                thisMorning: "/(this )(morn(ing)?)\\b/",
                amThisMorning: "/(\b\\d(am)? )(this )(morn(ing)?)/",
                inTheEvening: "/( in the )(even(ing)?)\\b/",
                thisEvening: "/(this )(even(ing)?)\\b/",
                pmThisEvening: "/(\b\\d(pm)? )(this )(even(ing)?)/",
                jan: "/jan(uary)?/",
                feb: "/feb(ruary)?/",
                mar: "/mar(ch)?/",
                apr: "/apr(il)?/",
                may: "/may/",
                jun: "/jun(e)?/",
                jul: "/jul(y)?/",
                aug: "/aug(ust)?/",
                sep: "/sep(t(ember)?)?/",
                oct: "/oct(ober)?/",
                nov: "/nov(ember)?/",
                dec: "/dec(ember)?/",
                sun: "/^su(n(day)?)?/",
                mon: "/^mo(n(day)?)?/",
                tue: "/^tu(e(s(day)?)?)?/",
                wed: "/^we(d(nesday)?)?/",
                thu: "/^th(u(r(s(day)?)?)?)?/",
                fri: "/fr(i(day)?)?/",
                sat: "/^sa(t(urday)?)?/",
                future: "/^next/",
                past: "/^last|past|prev(ious)?/",
                add: "/^(\\+|aft(er)?|from|hence)/",
                subtract: "/^(\\-|bef(ore)?|ago)/",
                yesterday: "/^yes(terday)?/",
                today: "/^t(od(ay)?)?/",
                tomorrow: "/^tom(orrow)?/",
                now: "/^n(ow)?/",
                millisecond: "/^ms|milli(second)?s?/",
                second: "/^sec(ond)?s?/",
                minute: "/^mn|min(ute)?s?/",
                hour: "/^h(our)?s?/",
                week: "/^w(eek)?s?/",
                month: "/^m(onth)?s?/",
                day: "/^d(ay)?s?/",
                year: "/^y(ear)?s?/",
                shortMeridian: "/^(a|p)/",
                longMeridian: "/^(a\\.?m?\\.?|p\\.?m?\\.?)/",
                timezone: "/^((e(s|d)t|c(s|d)t|m(s|d)t|p(s|d)t)|((gmt)?\\s*(\\+|\\-)\\s*\\d\\d\\d\\d?)|gmt|utc)/",
                ordinalSuffix: "/^\\s*(st|nd|rd|th)/",
                timeContext: "/^\\s*(\\:|a(?!u|p)|p)/"
            }, Date.i18n.currentLanguage());
        }
    };
    var CultureInfo = function() {
        var info = getText.getFromObjectValues({
            name: "name",
            englishName: "englishName",
            nativeName: "nativeName",
            amDesignator: "AM",
            pmDesignator: "PM",
            firstDayOfWeek: "firstDayOfWeek",
            twoDigitYearMax: "twoDigitYearMax",
            dateElementOrder: "mdy"
        }, Date.i18n.currentLanguage());
        var constructedInfo = buildInfo.buildFromMethodHash({
            dayNames: "days",
            abbreviatedDayNames: "dayAbbr",
            shortestDayNames: "dayShortNames",
            firstLetterDayNames: "dayFirstLetters",
            monthNames: "months",
            abbreviatedMonthNames: "monthAbbr",
            formatPatterns: "formatPatterns",
            regexPatterns: "regex",
            abbreviatedTimeZoneDST: "timeZoneDST",
            abbreviatedTimeZoneStandard: "timeZoneStandard"
        });
        shallowMerge(info, constructedInfo);
        buildInfo.timeZones(info);
        return info;
    };
    $D.i18n = {
        __: function(key, lang) {
            return __(key, lang);
        },
        currentLanguage: function() {
            return lang || "en-US";
        },
        setLanguage: function(code, force, cb) {
            var async = false;
            if (force || code === "en-US" || (!!Date.CultureStrings && !!Date.CultureStrings[code])) {
                lang = code;
                Date.CultureStrings = Date.CultureStrings || {};
                Date.CultureStrings.lang = code;
                Date.CultureInfo = new CultureInfo();
            } else {
                if (!(!!Date.CultureStrings && !!Date.CultureStrings[code])) {
                    if (typeof exports !== "undefined" && this.exports !== exports) {
                        try {
                            require("../i18n/" + code + ".js");
                            lang = code;
                            Date.CultureStrings.lang = code;
                            Date.CultureInfo = new CultureInfo();
                        } catch (e) {
                            throw new Error("The DateJS IETF language tag '" + code + "' could not be loaded by Node. It likely does not exist.");
                        }
                    } else if (Date.Config && Date.Config.i18n) {
                        async = true;
                        loadI18nScript(code).done(function() {
                            lang = code;
                            Date.CultureStrings = Date.CultureStrings || {};
                            Date.CultureStrings.lang = code;
                            Date.CultureInfo = new CultureInfo();
                            $D.Parsing.Normalizer.buildReplaceData();
                            if ($D.Grammar) {
                                $D.Grammar.buildGrammarFormats();
                            }
                            if (cb) {
                                setTimeout(cb, 0);
                            }
                        });
                    } else {
                        Date.console.error("The DateJS IETF language tag '" + code + "' is not available and has not been loaded.");
                        return false;
                    }
                }
            }
            $D.Parsing.Normalizer.buildReplaceData();
            if ($D.Grammar) {
                $D.Grammar.buildGrammarFormats();
            }
            if (!async && cb) {
                setTimeout(cb, 0);
            }
        },
        getLoggedKeys: function() {
            return loggedKeys;
        },
        updateCultureInfo: function() {
            Date.CultureInfo = new CultureInfo();
        }
    };
    $D.i18n.updateCultureInfo();
}());
(function() {
    var $D = Date,
        $P = $D.prototype,
        p = function(s, l) {
            if (!l) {
                l = 2;
            }
            return ("000" + s).slice(l * -1);
        };
    if (typeof window !== "undefined" && typeof window.console !== "undefined" && typeof window.console.log !== "undefined") {
        $D.console = console;
    } else {
        $D.console = {
            log: function() {},
            error: function() {}
        };
    }
    $D.Config = $D.Config || {};
    $D.initOverloads = function() {
        if (!$D.now) {
            $D._now = function now() {
                return new Date().getTime();
            };
        } else if (!$D._now) {
            $D._now = $D.now;
        }
        $D.now = function(returnObj) {
            if (returnObj) {
                return $D.present();
            } else {
                return $D._now();
            }
        };
        if (!$P.toISOString) {
            $P.toISOString = function() {
                return this.getUTCFullYear() +
                    "-" + p(this.getUTCMonth() + 1) +
                    "-" + p(this.getUTCDate()) +
                    "T" + p(this.getUTCHours()) +
                    ":" + p(this.getUTCMinutes()) +
                    ":" + p(this.getUTCSeconds()) +
                    "." + String((this.getUTCMilliseconds() / 1000).toFixed(3)).slice(2, 5) +
                    "Z";
            };
        }
        if ($P._toString === undefined) {
            $P._toString = $P.toString;
        }
    };
    $D.initOverloads();
    $D.today = function() {
        return new Date().clearTime();
    };
    $D.present = function() {
        return new Date();
    };
    $D.compare = function(date1, date2) {
        if (isNaN(date1) || isNaN(date2)) {
            throw new Error(date1 + " - " + date2);
        } else if (date1 instanceof Date && date2 instanceof Date) {
            return (date1 < date2) ? -1 : (date1 > date2) ? 1 : 0;
        } else {
            throw new TypeError(date1 + " - " + date2);
        }
    };
    $D.equals = function(date1, date2) {
        return (date1.compareTo(date2) === 0);
    };
    $D.getDayName = function(n) {
        return Date.CultureInfo.dayNames[n];
    };
    $D.getDayNumberFromName = function(name) {
        var n = Date.CultureInfo.dayNames,
            m = Date.CultureInfo.abbreviatedDayNames,
            o = Date.CultureInfo.shortestDayNames,
            s = name.toLowerCase();
        for (var i = 0; i < n.length; i++) {
            if (n[i].toLowerCase() === s || m[i].toLowerCase() === s || o[i].toLowerCase() === s) {
                return i;
            }
        }
        return -1;
    };
    $D.getMonthNumberFromName = function(name) {
        var n = Date.CultureInfo.monthNames,
            m = Date.CultureInfo.abbreviatedMonthNames,
            s = name.toLowerCase();
        for (var i = 0; i < n.length; i++) {
            if (n[i].toLowerCase() === s || m[i].toLowerCase() === s) {
                return i;
            }
        }
        return -1;
    };
    $D.getMonthName = function(n) {
        return Date.CultureInfo.monthNames[n];
    };
    $D.isLeapYear = function(year) {
        return ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0);
    };
    $D.getDaysInMonth = function(year, month) {
        if (!month && $D.validateMonth(year)) {
            month = year;
            year = Date.today().getFullYear();
        }
        return [31, ($D.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    };
    $P.getDaysInMonth = function() {
        return $D.getDaysInMonth(this.getFullYear(), this.getMonth());
    };
    $D.getTimezoneAbbreviation = function(offset, dst) {
        var p, n = (dst || false) ? Date.CultureInfo.abbreviatedTimeZoneDST : Date.CultureInfo.abbreviatedTimeZoneStandard;
        for (p in n) {
            if (n.hasOwnProperty(p)) {
                if (n[p] === offset) {
                    return p;
                }
            }
        }
        return null;
    };
    $D.getTimezoneOffset = function(name, dst) {
        var i, a = [],
            z = Date.CultureInfo.timezones;
        if (!name) {
            name = (new Date()).getTimezone();
        }
        for (i = 0; i < z.length; i++) {
            if (z[i].name === name.toUpperCase()) {
                a.push(i);
            }
        }
        if (!z[a[0]]) {
            return null;
        }
        if (a.length === 1 || !dst) {
            return z[a[0]].offset;
        } else {
            for (i = 0; i < a.length; i++) {
                if (z[a[i]].dst) {
                    return z[a[i]].offset;
                }
            }
        }
    };
    $D.getQuarter = function(d) {
        d = d || new Date();
        var q = [1, 2, 3, 4];
        return q[Math.floor(d.getMonth() / 3)];
    };
    $D.getDaysLeftInQuarter = function(d) {
        d = d || new Date();
        var qEnd = new Date(d);
        qEnd.setMonth(qEnd.getMonth() + 3 - qEnd.getMonth() % 3, 0);
        return Math.floor((qEnd - d) / 8.64e7);
    };
    var validate = function(n, min, max, name) {
        name = name ? name : "Object";
        if (typeof n === "undefined") {
            return false;
        } else if (typeof n !== "number") {
            throw new TypeError(n + " is not a Number.");
        } else if (n < min || n > max) {
            return false;
        }
        return true;
    };
    $D.validateMillisecond = function(value) {
        return validate(value, 0, 999, "millisecond");
    };
    $D.validateSecond = function(value) {
        return validate(value, 0, 59, "second");
    };
    $D.validateMinute = function(value) {
        return validate(value, 0, 59, "minute");
    };
    $D.validateHour = function(value) {
        return validate(value, 0, 23, "hour");
    };
    $D.validateDay = function(value, year, month) {
        if (year === undefined || year === null || month === undefined || month === null) {
            return false;
        }
        return validate(value, 1, $D.getDaysInMonth(year, month), "day");
    };
    $D.validateWeek = function(value) {
        return validate(value, 0, 53, "week");
    };
    $D.validateMonth = function(value) {
        return validate(value, 0, 11, "month");
    };
    $D.validateYear = function(value) {
        return validate(value, -271822, 275760, "year");
    };
    $D.validateTimezone = function(value) {
        var timezones = {
            "ACDT": 1,
            "ACST": 1,
            "ACT": 1,
            "ADT": 1,
            "AEDT": 1,
            "AEST": 1,
            "AFT": 1,
            "AKDT": 1,
            "AKST": 1,
            "AMST": 1,
            "AMT": 1,
            "ART": 1,
            "AST": 1,
            "AWDT": 1,
            "AWST": 1,
            "AZOST": 1,
            "AZT": 1,
            "BDT": 1,
            "BIOT": 1,
            "BIT": 1,
            "BOT": 1,
            "BRT": 1,
            "BST": 1,
            "BTT": 1,
            "CAT": 1,
            "CCT": 1,
            "CDT": 1,
            "CEDT": 1,
            "CEST": 1,
            "CET": 1,
            "CHADT": 1,
            "CHAST": 1,
            "CHOT": 1,
            "ChST": 1,
            "CHUT": 1,
            "CIST": 1,
            "CIT": 1,
            "CKT": 1,
            "CLST": 1,
            "CLT": 1,
            "COST": 1,
            "COT": 1,
            "CST": 1,
            "CT": 1,
            "CVT": 1,
            "CWST": 1,
            "CXT": 1,
            "DAVT": 1,
            "DDUT": 1,
            "DFT": 1,
            "EASST": 1,
            "EAST": 1,
            "EAT": 1,
            "ECT": 1,
            "EDT": 1,
            "EEDT": 1,
            "EEST": 1,
            "EET": 1,
            "EGST": 1,
            "EGT": 1,
            "EIT": 1,
            "EST": 1,
            "FET": 1,
            "FJT": 1,
            "FKST": 1,
            "FKT": 1,
            "FNT": 1,
            "GALT": 1,
            "GAMT": 1,
            "GET": 1,
            "GFT": 1,
            "GILT": 1,
            "GIT": 1,
            "GMT": 1,
            "GST": 1,
            "GYT": 1,
            "HADT": 1,
            "HAEC": 1,
            "HAST": 1,
            "HKT": 1,
            "HMT": 1,
            "HOVT": 1,
            "HST": 1,
            "ICT": 1,
            "IDT": 1,
            "IOT": 1,
            "IRDT": 1,
            "IRKT": 1,
            "IRST": 1,
            "IST": 1,
            "JST": 1,
            "KGT": 1,
            "KOST": 1,
            "KRAT": 1,
            "KST": 1,
            "LHST": 1,
            "LINT": 1,
            "MAGT": 1,
            "MART": 1,
            "MAWT": 1,
            "MDT": 1,
            "MET": 1,
            "MEST": 1,
            "MHT": 1,
            "MIST": 1,
            "MIT": 1,
            "MMT": 1,
            "MSK": 1,
            "MST": 1,
            "MUT": 1,
            "MVT": 1,
            "MYT": 1,
            "NCT": 1,
            "NDT": 1,
            "NFT": 1,
            "NPT": 1,
            "NST": 1,
            "NT": 1,
            "NUT": 1,
            "NZDT": 1,
            "NZST": 1,
            "OMST": 1,
            "ORAT": 1,
            "PDT": 1,
            "PET": 1,
            "PETT": 1,
            "PGT": 1,
            "PHOT": 1,
            "PHT": 1,
            "PKT": 1,
            "PMDT": 1,
            "PMST": 1,
            "PONT": 1,
            "PST": 1,
            "PYST": 1,
            "PYT": 1,
            "RET": 1,
            "ROTT": 1,
            "SAKT": 1,
            "SAMT": 1,
            "SAST": 1,
            "SBT": 1,
            "SCT": 1,
            "SGT": 1,
            "SLST": 1,
            "SRT": 1,
            "SST": 1,
            "SYOT": 1,
            "TAHT": 1,
            "THA": 1,
            "TFT": 1,
            "TJT": 1,
            "TKT": 1,
            "TLT": 1,
            "TMT": 1,
            "TOT": 1,
            "TVT": 1,
            "UCT": 1,
            "ULAT": 1,
            "UTC": 1,
            "UYST": 1,
            "UYT": 1,
            "UZT": 1,
            "VET": 1,
            "VLAT": 1,
            "VOLT": 1,
            "VOST": 1,
            "VUT": 1,
            "WAKT": 1,
            "WAST": 1,
            "WAT": 1,
            "WEDT": 1,
            "WEST": 1,
            "WET": 1,
            "WST": 1,
            "YAKT": 1,
            "YEKT": 1,
            "Z": 1
        };
        return (timezones[value] === 1);
    };
    $D.validateTimezoneOffset = function(value) {
        return (value > -841 && value < 721);
    };
}());
(function() {
    var $D = Date,
        $P = $D.prototype,
        p = function(s, l) {
            if (!l) {
                l = 2;
            }
            return ("000" + s).slice(l * -1);
        };
    var validateConfigObject = function(obj) {
        var result = {},
            self = this,
            prop, testFunc;
        testFunc = function(prop, func, value) {
            if (prop === "day") {
                var month = (obj.month !== undefined) ? obj.month : self.getMonth();
                var year = (obj.year !== undefined) ? obj.year : self.getFullYear();
                return $D[func](value, year, month);
            } else {
                return $D[func](value);
            }
        };
        for (prop in obj) {
            if (hasOwnProperty.call(obj, prop)) {
                var func = "validate" + prop.charAt(0).toUpperCase() + prop.slice(1);
                if ($D[func] && obj[prop] !== null && testFunc(prop, func, obj[prop])) {
                    result[prop] = obj[prop];
                }
            }
        }
        return result;
    };
    $P.clearTime = function() {
        this.setHours(0);
        this.setMinutes(0);
        this.setSeconds(0);
        this.setMilliseconds(0);
        return this;
    };
    $P.setTimeToNow = function() {
        var n = new Date();
        this.setHours(n.getHours());
        this.setMinutes(n.getMinutes());
        this.setSeconds(n.getSeconds());
        this.setMilliseconds(n.getMilliseconds());
        return this;
    };
    $P.clone = function() {
        return new Date(this.getTime());
    };
    $P.compareTo = function(date) {
        return Date.compare(this, date);
    };
    $P.equals = function(date) {
        return Date.equals(this, (date !== undefined ? date : new Date()));
    };
    $P.between = function(start, end) {
        return this.getTime() >= start.getTime() && this.getTime() <= end.getTime();
    };
    $P.isAfter = function(date) {
        return this.compareTo(date || new Date()) === 1;
    };
    $P.isBefore = function(date) {
        return (this.compareTo(date || new Date()) === -1);
    };
    $P.isToday = $P.isSameDay = function(date) {
        return this.clone().clearTime().equals((date || new Date()).clone().clearTime());
    };
    $P.addMilliseconds = function(value) {
        if (!value) {
            return this;
        }
        this.setTime(this.getTime() + value * 1);
        return this;
    };
    $P.addSeconds = function(value) {
        if (!value) {
            return this;
        }
        return this.addMilliseconds(value * 1000);
    };
    $P.addMinutes = function(value) {
        if (!value) {
            return this;
        }
        return this.addMilliseconds(value * 60000);
    };
    $P.addHours = function(value) {
        if (!value) {
            return this;
        }
        return this.addMilliseconds(value * 3600000);
    };
    $P.addDays = function(value) {
        if (!value) {
            return this;
        }
        this.setDate(this.getDate() + value * 1);
        return this;
    };
    $P.addWeekdays = function(value) {
        if (!value) {
            return this;
        }
        var day = this.getDay();
        var weeks = (Math.ceil(Math.abs(value) / 7));
        if (day === 0 || day === 6) {
            if (value > 0) {
                this.next().monday();
                this.addDays(-1);
                day = this.getDay();
            }
        }
        if (value < 0) {
            while (value < 0) {
                this.addDays(-1);
                day = this.getDay();
                if (day !== 0 && day !== 6) {
                    value++;
                }
            }
            return this;
        } else if (value > 5 || (6 - day) <= value) {
            value = value + (weeks * 2);
        }
        return this.addDays(value);
    };
    $P.addWeeks = function(value) {
        if (!value) {
            return this;
        }
        return this.addDays(value * 7);
    };
    $P.addMonths = function(value) {
        if (!value) {
            return this;
        }
        var n = this.getDate();
        this.setDate(1);
        this.setMonth(this.getMonth() + value * 1);
        this.setDate(Math.min(n, $D.getDaysInMonth(this.getFullYear(), this.getMonth())));
        return this;
    };
    $P.addQuarters = function(value) {
        if (!value) {
            return this;
        }
        return this.addMonths(value * 3);
    };
    $P.addYears = function(value) {
        if (!value) {
            return this;
        }
        return this.addMonths(value * 12);
    };
    $P.add = function(config) {
        if (typeof config === "number") {
            this._orient = config;
            return this;
        }
        var x = config;
        if (x.day) {
            if ((x.day - this.getDate()) !== 0) {
                this.setDate(x.day);
            }
        }
        if (x.milliseconds) {
            this.addMilliseconds(x.milliseconds);
        }
        if (x.seconds) {
            this.addSeconds(x.seconds);
        }
        if (x.minutes) {
            this.addMinutes(x.minutes);
        }
        if (x.hours) {
            this.addHours(x.hours);
        }
        if (x.weeks) {
            this.addWeeks(x.weeks);
        }
        if (x.months) {
            this.addMonths(x.months);
        }
        if (x.years) {
            this.addYears(x.years);
        }
        if (x.days) {
            this.addDays(x.days);
        }
        return this;
    };
    $P.getWeek = function(utc) {
        var self, target = new Date(this.valueOf());
        if (utc) {
            target.addMinutes(target.getTimezoneOffset());
            self = target.clone();
        } else {
            self = this;
        }
        var dayNr = (self.getDay() + 6) % 7;
        target.setDate(target.getDate() - dayNr + 3);
        var firstThursday = target.valueOf();
        target.setMonth(0, 1);
        if (target.getDay() !== 4) {
            target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
        }
        return 1 + Math.ceil((firstThursday - target) / 604800000);
    };
    $P.getISOWeek = function() {
        return p(this.getWeek(true));
    };
    $P.setWeek = function(n) {
        if ((n - this.getWeek()) === 0) {
            if (this.getDay() !== 1) {
                return this.moveToDayOfWeek(1, (this.getDay() > 1 ? -1 : 1));
            } else {
                return this;
            }
        } else {
            return this.moveToDayOfWeek(1, (this.getDay() > 1 ? -1 : 1)).addWeeks(n - this.getWeek());
        }
    };
    $P.setQuarter = function(qtr) {
        var month = Math.abs(((qtr - 1) * 3) + 1);
        return this.setMonth(month, 1);
    };
    $P.getQuarter = function() {
        return Date.getQuarter(this);
    };
    $P.getDaysLeftInQuarter = function() {
        return Date.getDaysLeftInQuarter(this);
    };
    $P.moveToNthOccurrence = function(dayOfWeek, occurrence) {
        if (dayOfWeek === "Weekday") {
            if (occurrence > 0) {
                this.moveToFirstDayOfMonth();
                if (this.is().weekday()) {
                    occurrence -= 1;
                }
            } else if (occurrence < 0) {
                this.moveToLastDayOfMonth();
                if (this.is().weekday()) {
                    occurrence += 1;
                }
            } else {
                return this;
            }
            return this.addWeekdays(occurrence);
        }
        var shift = 0;
        if (occurrence > 0) {
            shift = occurrence - 1;
        } else if (occurrence === -1) {
            this.moveToLastDayOfMonth();
            if (this.getDay() !== dayOfWeek) {
                this.moveToDayOfWeek(dayOfWeek, -1);
            }
            return this;
        }
        return this.moveToFirstDayOfMonth().addDays(-1).moveToDayOfWeek(dayOfWeek, +1).addWeeks(shift);
    };
    var moveToN = function(getFunc, addFunc, nVal) {
        return function(value, orient) {
            var diff = (value - this[getFunc]() + nVal * (orient || +1)) % nVal;
            return this[addFunc]((diff === 0) ? diff += nVal * (orient || +1) : diff);
        };
    };
    $P.moveToDayOfWeek = moveToN("getDay", "addDays", 7);
    $P.moveToMonth = moveToN("getMonth", "addMonths", 12);
    $P.getOrdinate = function() {
        var num = this.getDate();
        return ord(num);
    };
    $P.getOrdinalNumber = function() {
        return Math.ceil((this.clone().clearTime() - new Date(this.getFullYear(), 0, 1)) / 86400000) + 1;
    };
    $P.getTimezone = function() {
        return $D.getTimezoneAbbreviation(this.getUTCOffset(), this.isDaylightSavingTime());
    };
    $P.setTimezoneOffset = function(offset) {
        var here = this.getTimezoneOffset(),
            there = Number(offset) * -6 / 10;
        return (there || there === 0) ? this.addMinutes(there - here) : this;
    };
    $P.setTimezone = function(offset) {
        return this.setTimezoneOffset($D.getTimezoneOffset(offset));
    };
    $P.hasDaylightSavingTime = function() {
        return (Date.today().set({
            month: 0,
            day: 1
        }).getTimezoneOffset() !== Date.today().set({
            month: 6,
            day: 1
        }).getTimezoneOffset());
    };
    $P.isDaylightSavingTime = function() {
        return Date.today().set({
            month: 0,
            day: 1
        }).getTimezoneOffset() !== this.getTimezoneOffset();
    };
    $P.getUTCOffset = function(offset) {
        var n = (offset || this.getTimezoneOffset()) * -10 / 6,
            r;
        if (n < 0) {
            r = (n - 10000).toString();
            return r.charAt(0) + r.substr(2);
        } else {
            r = (n + 10000).toString();
            return "+" + r.substr(1);
        }
    };
    $P.getElapsed = function(date) {
        return (date || new Date()) - this;
    };
    $P.set = function(config) {
        config = validateConfigObject.call(this, config);
        var key;
        for (key in config) {
            if (hasOwnProperty.call(config, key)) {
                var name = key.charAt(0).toUpperCase() + key.slice(1);
                var addFunc, getFunc;
                if (key !== "week" && key !== "month" && key !== "timezone" && key !== "timezoneOffset") {
                    name += "s";
                }
                addFunc = "add" + name;
                getFunc = "get" + name;
                if (key === "month") {
                    addFunc = addFunc + "s";
                } else if (key === "year") {
                    getFunc = "getFullYear";
                }
                if (key !== "day" && key !== "timezone" && key !== "timezoneOffset" && key !== "week" && key !== "hour") {
                    this[addFunc](config[key] - this[getFunc]());
                } else if (key === "timezone" || key === "timezoneOffset" || key === "week" || key === "hour") {
                    this["set" + name](config[key]);
                }
            }
        }
        if (config.day) {
            this.addDays(config.day - this.getDate());
        }
        return this;
    };
    $P.moveToFirstDayOfMonth = function() {
        return this.set({
            day: 1
        });
    };
    $P.moveToLastDayOfMonth = function() {
        return this.set({
            day: $D.getDaysInMonth(this.getFullYear(), this.getMonth())
        });
    };
    var ord = function(n) {
        switch (n * 1) {
            case 1:
            case 21:
            case 31:
                return "st";
            case 2:
            case 22:
                return "nd";
            case 3:
            case 23:
                return "rd";
            default:
                return "th";
        }
    };
    var parseStandardFormats = function(format) {
        var y, c = Date.CultureInfo.formatPatterns;
        switch (format) {
            case "d":
                return this.toString(c.shortDate);
            case "D":
                return this.toString(c.longDate);
            case "F":
                return this.toString(c.fullDateTime);
            case "m":
                return this.toString(c.monthDay);
            case "r":
            case "R":
                y = this.clone().addMinutes(this.getTimezoneOffset());
                return y.toString(c.rfc1123) + " GMT";
            case "s":
                return this.toString(c.sortableDateTime);
            case "t":
                return this.toString(c.shortTime);
            case "T":
                return this.toString(c.longTime);
            case "u":
                y = this.clone().addMinutes(this.getTimezoneOffset());
                return y.toString(c.universalSortableDateTime);
            case "y":
                return this.toString(c.yearMonth);
            default:
                return false;
        }
    };
    var parseFormatStringsClosure = function(context) {
        return function(m) {
            if (m.charAt(0) === "\\") {
                return m.replace("\\", "");
            }
            switch (m) {
                case "hh":
                    return p(context.getHours() < 13 ? (context.getHours() === 0 ? 12 : context.getHours()) : (context.getHours() - 12));
                case "h":
                    return context.getHours() < 13 ? (context.getHours() === 0 ? 12 : context.getHours()) : (context.getHours() - 12);
                case "HH":
                    return p(context.getHours());
                case "H":
                    return context.getHours();
                case "mm":
                    return p(context.getMinutes());
                case "m":
                    return context.getMinutes();
                case "ss":
                    return p(context.getSeconds());
                case "s":
                    return context.getSeconds();
                case "yyyy":
                    return p(context.getFullYear(), 4);
                case "yy":
                    return p(context.getFullYear());
                case "y":
                    return context.getFullYear();
                case "E":
                case "dddd":
                    return Date.CultureInfo.dayNames[context.getDay()];
                case "ddd":
                    return Date.CultureInfo.abbreviatedDayNames[context.getDay()];
                case "dd":
                    return p(context.getDate());
                case "d":
                    return context.getDate();
                case "MMMM":
                    return Date.CultureInfo.monthNames[context.getMonth()];
                case "MMM":
                    return Date.CultureInfo.abbreviatedMonthNames[context.getMonth()];
                case "MM":
                    return p((context.getMonth() + 1));
                case "M":
                    return context.getMonth() + 1;
                case "t":
                    return context.getHours() < 12 ? Date.CultureInfo.amDesignator.substring(0, 1) : Date.CultureInfo.pmDesignator.substring(0, 1);
                case "tt":
                    return context.getHours() < 12 ? Date.CultureInfo.amDesignator : Date.CultureInfo.pmDesignator;
                case "S":
                    return ord(context.getDate());
                case "W":
                    return context.getWeek();
                case "WW":
                    return context.getISOWeek();
                case "Q":
                    return "Q" + context.getQuarter();
                case "q":
                    return String(context.getQuarter());
                case "z":
                    return context.getTimezone();
                case "Z":
                case "X":
                    return Date.getTimezoneOffset(context.getTimezone());
                case "ZZ":
                    return context.getTimezoneOffset() * -60;
                case "u":
                    return context.getDay();
                case "L":
                    return ($D.isLeapYear(context.getFullYear())) ? 1 : 0;
                case "B":
                    return "@" + ((context.getUTCSeconds() + (context.getUTCMinutes() * 60) + ((context.getUTCHours() + 1) * 3600)) / 86.4);
                default:
                    return m;
            }
        };
    };
    $P.toString = function(format, ignoreStandards) {
        if (!ignoreStandards && format && format.length === 1) {
            output = parseStandardFormats.call(this, format);
            if (output) {
                return output;
            }
        }
        var parseFormatStrings = parseFormatStringsClosure(this);
        return format ? format.replace(/((\\)?(dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|S|q|Q|WW?W?W?)(?![^\[]*\]))/g, parseFormatStrings).replace(/\[|\]/g, "") : this._toString();
    };
}());
(function() {
    var $D = Date,
        $P = $D.prototype,
        $N = Number.prototype;
    $P._orient = +1;
    $P._nth = null;
    $P._is = false;
    $P._same = false;
    $P._isSecond = false;
    $N._dateElement = "days";
    $P.next = function() {
        this._move = true;
        this._orient = +1;
        return this;
    };
    $D.next = function() {
        return $D.today().next();
    };
    $P.last = $P.prev = $P.previous = function() {
        this._move = true;
        this._orient = -1;
        return this;
    };
    $D.last = $D.prev = $D.previous = function() {
        return $D.today().last();
    };
    $P.is = function() {
        this._is = true;
        return this;
    };
    $P.same = function() {
        this._same = true;
        this._isSecond = false;
        return this;
    };
    $P.today = function() {
        return this.same().day();
    };
    $P.weekday = function() {
        if (this._nth) {
            return df("Weekday").call(this);
        }
        if (this._move) {
            return this.addWeekdays(this._orient);
        }
        if (this._is) {
            this._is = false;
            return (!this.is().sat() && !this.is().sun());
        }
        return false;
    };
    $P.weekend = function() {
        if (this._is) {
            this._is = false;
            return (this.is().sat() || this.is().sun());
        }
        return false;
    };
    $P.at = function(time) {
        return (typeof time === "string") ? $D.parse(this.toString("d") + " " + time) : this.set(time);
    };
    $N.fromNow = $N.after = function(date) {
        var c = {};
        c[this._dateElement] = this;
        return ((!date) ? new Date() : date.clone()).add(c);
    };
    $N.ago = $N.before = function(date) {
        var c = {},
            s = (this._dateElement[this._dateElement.length - 1] !== "s") ? this._dateElement + "s" : this._dateElement;
        c[s] = this * -1;
        return ((!date) ? new Date() : date.clone()).add(c);
    };
    var dx = ("sunday monday tuesday wednesday thursday friday saturday").split(/\s/),
        mx = ("january february march april may june july august september october november december").split(/\s/),
        px = ("Millisecond Second Minute Hour Day Week Month Year Quarter Weekday").split(/\s/),
        pxf = ("Milliseconds Seconds Minutes Hours Date Week Month FullYear Quarter").split(/\s/),
        nth = ("final first second third fourth fifth").split(/\s/),
        de;
    $P.toObject = function() {
        var o = {};
        for (var i = 0; i < px.length; i++) {
            if (this["get" + pxf[i]]) {
                o[px[i].toLowerCase()] = this["get" + pxf[i]]();
            }
        }
        return o;
    };
    $D.fromObject = function(config) {
        config.week = null;
        return Date.today().set(config);
    };
    var df = function(n) {
        return function() {
            if (this._is) {
                this._is = false;
                return this.getDay() === n;
            }
            if (this._move) {
                this._move = null;
            }
            if (this._nth !== null) {
                if (this._isSecond) {
                    this.addSeconds(this._orient * -1);
                }
                this._isSecond = false;
                var ntemp = this._nth;
                this._nth = null;
                var temp = this.clone().moveToLastDayOfMonth();
                this.moveToNthOccurrence(n, ntemp);
                if (this > temp) {
                    throw new RangeError($D.getDayName(n) + " does not occur " + ntemp + " times in the month of " + $D.getMonthName(temp.getMonth()) + " " + temp.getFullYear() + ".");
                }
                return this;
            }
            return this.moveToDayOfWeek(n, this._orient);
        };
    };
    var sdf = function(n) {
        return function() {
            var t = $D.today(),
                shift = n - t.getDay();
            if (n === 0 && Date.CultureInfo.firstDayOfWeek === 1 && t.getDay() !== 0) {
                shift = shift + 7;
            }
            return t.addDays(shift);
        };
    };
    var month_instance_functions = function(n) {
        return function() {
            if (this._is) {
                this._is = false;
                return this.getMonth() === n;
            }
            return this.moveToMonth(n, this._orient);
        };
    };
    var month_static_functions = function(n) {
        return function() {
            return $D.today().set({
                month: n,
                day: 1
            });
        };
    };
    var processTerms = function(names, staticFunc, instanceFunc) {
        for (var i = 0; i < names.length; i++) {
            $D[names[i].toUpperCase()] = $D[names[i].toUpperCase().substring(0, 3)] = i;
            $D[names[i]] = $D[names[i].substring(0, 3)] = staticFunc(i);
            $P[names[i]] = $P[names[i].substring(0, 3)] = instanceFunc(i);
        }
    };
    processTerms(dx, sdf, df);
    processTerms(mx, month_static_functions, month_instance_functions);
    var ef = function(j) {
        return function() {
            if (this._isSecond) {
                this._isSecond = false;
                return this;
            }
            if (this._same) {
                this._same = this._is = false;
                var o1 = this.toObject(),
                    o2 = (arguments[0] || new Date()).toObject(),
                    v = "",
                    k = j.toLowerCase();
                k = (k[k.length - 1] === "s") ? k.substring(0, k.length - 1) : k;
                for (var m = (px.length - 1); m > -1; m--) {
                    v = px[m].toLowerCase();
                    if (o1[v] !== o2[v]) {
                        return false;
                    }
                    if (k === v) {
                        break;
                    }
                }
                return true;
            }
            if (j.substring(j.length - 1) !== "s") {
                j += "s";
            }
            if (this._move) {
                this._move = null;
            }
            return this["add" + j](this._orient);
        };
    };
    var nf = function(n) {
        return function() {
            this._dateElement = n;
            return this;
        };
    };
    for (var k = 0; k < px.length; k++) {
        de = px[k].toLowerCase();
        if (de !== "weekday") {
            $P[de] = $P[de + "s"] = ef(px[k]);
            $N[de] = $N[de + "s"] = nf(de + "s");
        }
    }
    $P._ss = ef("Second");
    var nthfn = function(n) {
        return function(dayOfWeek) {
            if (this._same) {
                return this._ss(arguments[0]);
            }
            if (dayOfWeek || dayOfWeek === 0) {
                return this.moveToNthOccurrence(dayOfWeek, n);
            }
            this._nth = n;
            if (n === 2 && (dayOfWeek === undefined || dayOfWeek === null)) {
                this._isSecond = true;
                return this.addSeconds(this._orient);
            }
            return this;
        };
    };
    for (var l = 0; l < nth.length; l++) {
        $P[nth[l]] = (l === 0) ? nthfn(-1) : nthfn(l);
    }
}());
(function() {
    "use strict";
    Date.Parsing = {
        Exception: function(s) {
            this.message = "Parse error at '" + s.substring(0, 10) + " ...'";
        }
    };
    var $P = Date.Parsing;
    var dayOffsets = {
        standard: [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334],
        leap: [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335]
    };
    $P.isLeapYear = function(year) {
        return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
    };
    var utils = {
        multiReplace: function(str, hash) {
            var key;
            for (key in hash) {
                if (Object.prototype.hasOwnProperty.call(hash, key)) {
                    var regex;
                    if (typeof hash[key] === "function") {} else {
                        regex = (hash[key] instanceof RegExp) ? hash[key] : new RegExp(hash[key], "g");
                    }
                    str = str.replace(regex, key);
                }
            }
            return str;
        },
        getDayOfYearFromWeek: function(obj) {
            var d, jan4, offset;
            obj.weekDay = (!obj.weekDay && obj.weekDay !== 0) ? 1 : obj.weekDay;
            d = new Date(obj.year, 0, 4);
            jan4 = d.getDay() === 0 ? 7 : d.getDay();
            offset = jan4 + 3;
            obj.dayOfYear = ((obj.week * 7) + (obj.weekDay === 0 ? 7 : obj.weekDay)) - offset;
            return obj;
        },
        getDayOfYear: function(obj, dayOffset) {
            if (!obj.dayOfYear) {
                obj = utils.getDayOfYearFromWeek(obj);
            }
            for (var i = 0; i <= dayOffset.length; i++) {
                if (obj.dayOfYear < dayOffset[i] || i === dayOffset.length) {
                    obj.day = obj.day ? obj.day : (obj.dayOfYear - dayOffset[i - 1]);
                    break;
                } else {
                    obj.month = i;
                }
            }
            return obj;
        },
        adjustForTimeZone: function(obj, date) {
            var offset;
            if (obj.zone.toUpperCase() === "Z" || (obj.zone_hours === 0 && obj.zone_minutes === 0)) {
                offset = -date.getTimezoneOffset();
            } else {
                offset = (obj.zone_hours * 60) + (obj.zone_minutes || 0);
                if (obj.zone_sign === "+") {
                    offset *= -1;
                }
                offset -= date.getTimezoneOffset();
            }
            date.setMinutes(date.getMinutes() + offset);
            return date;
        },
        setDefaults: function(obj) {
            obj.year = obj.year || Date.today().getFullYear();
            obj.hours = obj.hours || 0;
            obj.minutes = obj.minutes || 0;
            obj.seconds = obj.seconds || 0;
            obj.milliseconds = obj.milliseconds || 0;
            if (!(!obj.month && (obj.week || obj.dayOfYear))) {
                obj.month = obj.month || 0;
                obj.day = obj.day || 1;
            }
            return obj;
        },
        dataNum: function(data, mod, explict, postProcess) {
            var dataNum = data * 1;
            if (mod) {
                if (postProcess) {
                    return data ? mod(data) * 1 : data;
                } else {
                    return data ? mod(dataNum) : data;
                }
            } else if (!explict) {
                return data ? dataNum : data;
            } else {
                return (data && typeof data !== "undefined") ? dataNum : data;
            }
        },
        timeDataProcess: function(obj) {
            var timeObj = {};
            for (var x in obj.data) {
                if (obj.data.hasOwnProperty(x)) {
                    timeObj[x] = obj.ignore[x] ? obj.data[x] : utils.dataNum(obj.data[x], obj.mods[x], obj.explict[x], obj.postProcess[x]);
                }
            }
            if (obj.data.secmins) {
                obj.data.secmins = obj.data.secmins.replace(",", ".") * 60;
                if (!timeObj.minutes) {
                    timeObj.minutes = obj.data.secmins;
                } else if (!timeObj.seconds) {
                    timeObj.seconds = obj.data.secmins;
                }
                delete obj.secmins;
            }
            return timeObj;
        },
        buildTimeObjectFromData: function(data) {
            var time = utils.timeDataProcess({
                data: {
                    year: data[1],
                    month: data[5],
                    day: data[7],
                    week: data[8],
                    dayOfYear: data[10],
                    hours: data[15],
                    zone_hours: data[23],
                    zone_minutes: data[24],
                    zone: data[21],
                    zone_sign: data[22],
                    weekDay: data[9],
                    minutes: data[16],
                    seconds: data[19],
                    milliseconds: data[20],
                    secmins: data[18]
                },
                mods: {
                    month: function(data) {
                        return data - 1;
                    },
                    weekDay: function(data) {
                        data = Math.abs(data);
                        return (data === 7 ? 0 : data);
                    },
                    minutes: function(data) {
                        return data.replace(":", "");
                    },
                    seconds: function(data) {
                        return Math.floor((data.replace(":", "").replace(",", ".")) * 1);
                    },
                    milliseconds: function(data) {
                        return (data.replace(",", ".") * 1000);
                    }
                },
                postProcess: {
                    minutes: true,
                    seconds: true,
                    milliseconds: true
                },
                explict: {
                    zone_hours: true,
                    zone_minutes: true
                },
                ignore: {
                    zone: true,
                    zone_sign: true,
                    secmins: true
                }
            });
            return time;
        },
        addToHash: function(hash, keys, data) {
            keys = keys;
            data = data;
            var len = keys.length;
            for (var i = 0; i < len; i++) {
                hash[keys[i]] = data[i];
            }
            return hash;
        },
        combineRegex: function(r1, r2) {
            return new RegExp("((" + r1.source + ")\\s(" + r2.source + "))");
        },
        getDateNthString: function(add, last, inc) {
            if (add) {
                return Date.today().addDays(inc).toString("d");
            } else if (last) {
                return Date.today().last()[inc]().toString("d");
            }
        },
        buildRegexData: function(array) {
            var arr = [];
            var len = array.length;
            for (var i = 0; i < len; i++) {
                if (Object.prototype.toString.call(array[i]) === '[object Array]') {
                    arr.push(this.combineRegex(array[i][0], array[i][1]));
                } else {
                    arr.push(array[i]);
                }
            }
            return arr;
        }
    };
    $P.processTimeObject = function(obj) {
        var date, dayOffset;
        utils.setDefaults(obj);
        dayOffset = ($P.isLeapYear(obj.year)) ? dayOffsets.leap : dayOffsets.standard;
        if (!obj.month && (obj.week || obj.dayOfYear)) {
            utils.getDayOfYear(obj, dayOffset);
        } else {
            obj.dayOfYear = dayOffset[obj.month] + obj.day;
        }
        date = new Date(obj.year, obj.month, obj.day, obj.hours, obj.minutes, obj.seconds, obj.milliseconds);
        if (obj.zone) {
            utils.adjustForTimeZone(obj, date);
        }
        return date;
    };
    $P.ISO = {
        regex: /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-3])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-4])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?\s?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/,
        parse: function(s) {
            var time, data = s.match(this.regex);
            if (!data || !data.length) {
                return null;
            }
            time = utils.buildTimeObjectFromData(data);
            if (!time.year || (!time.year && (!time.month && !time.day) && (!time.week && !time.dayOfYear))) {
                return null;
            }
            return $P.processTimeObject(time);
        }
    };
    $P.Numeric = {
        isNumeric: function(e) {
            return !isNaN(parseFloat(e)) && isFinite(e);
        },
        regex: /\b([0-1]?[0-9])([0-3]?[0-9])([0-2]?[0-9]?[0-9][0-9])\b/i,
        parse: function(s) {
            var data, i, time = {},
                order = Date.CultureInfo.dateElementOrder.split("");
            if (!(this.isNumeric(s)) || (s[0] === "+" && s[0] === "-")) {
                return null;
            }
            if (s.length < 5 && s.indexOf(".") < 0 && s.indexOf("/") < 0) {
                time.year = s;
                return $P.processTimeObject(time);
            }
            data = s.match(this.regex);
            if (!data || !data.length) {
                return null;
            }
            for (i = 0; i < order.length; i++) {
                switch (order[i]) {
                    case "d":
                        time.day = data[i + 1];
                        break;
                    case "m":
                        time.month = (data[i + 1] - 1);
                        break;
                    case "y":
                        time.year = data[i + 1];
                        break;
                }
            }
            return $P.processTimeObject(time);
        }
    };
    $P.Normalizer = {
        regexData: function() {
            var $R = Date.CultureInfo.regexPatterns;
            return utils.buildRegexData([$R.tomorrow, $R.yesterday, [$R.past, $R.mon],
                [$R.past, $R.tue],
                [$R.past, $R.wed],
                [$R.past, $R.thu],
                [$R.past, $R.fri],
                [$R.past, $R.sat],
                [$R.past, $R.sun]
            ]);
        },
        basicReplaceHash: function() {
            var $R = Date.CultureInfo.regexPatterns;
            return {
                "January": $R.jan.source,
                "February": $R.feb,
                "March": $R.mar,
                "April": $R.apr,
                "May": $R.may,
                "June": $R.jun,
                "July": $R.jul,
                "August": $R.aug,
                "September": $R.sep,
                "October": $R.oct,
                "November": $R.nov,
                "December": $R.dec,
                "": /\bat\b/gi,
                " ": /\s{2,}/,
                "am": $R.inTheMorning,
                "9am": $R.thisMorning,
                "pm": $R.inTheEvening,
                "7pm": $R.thisEvening
            };
        },
        keys: function() {
            return [utils.getDateNthString(true, false, 1), utils.getDateNthString(true, false, -1), utils.getDateNthString(false, true, "monday"), utils.getDateNthString(false, true, "tuesday"), utils.getDateNthString(false, true, "wednesday"), utils.getDateNthString(false, true, "thursday"), utils.getDateNthString(false, true, "friday"), utils.getDateNthString(false, true, "saturday"), utils.getDateNthString(false, true, "sunday")];
        },
        buildRegexFunctions: function() {
            var $R = Date.CultureInfo.regexPatterns;
            var __ = Date.i18n.__;
            var tomorrowRE = new RegExp("(\\b\\d\\d?(" + __("AM") + "|" + __("PM") + ")? )(" + $R.tomorrow.source.slice(1) + ")", "i");
            var todayRE = new RegExp($R.today.source + "(?!\\s*([+-]))\\b");
            this.replaceFuncs = [
                [todayRE, function(full) {
                    return (full.length > 1) ? Date.today().toString("d") : full;
                }],
                [tomorrowRE, function(full, m1) {
                    var t = Date.today().addDays(1).toString("d");
                    return (t + " " + m1);
                }],
                [$R.amThisMorning, function(str, am) {
                    return am;
                }],
                [$R.pmThisEvening, function(str, pm) {
                    return pm;
                }]
            ];
        },
        buildReplaceData: function() {
            this.buildRegexFunctions();
            this.replaceHash = utils.addToHash(this.basicReplaceHash(), this.keys(), this.regexData());
        },
        stringReplaceFuncs: function(s) {
            for (var i = 0; i < this.replaceFuncs.length; i++) {
                s = s.replace(this.replaceFuncs[i][0], this.replaceFuncs[i][1]);
            }
            return s;
        },
        parse: function(s) {
            s = this.stringReplaceFuncs(s);
            s = utils.multiReplace(s, this.replaceHash);
            try {
                var n = s.split(/([\s\-\.\,\/\x27]+)/);
                if (n.length === 3 && $P.Numeric.isNumeric(n[0]) && $P.Numeric.isNumeric(n[2]) && (n[2].length >= 4)) {
                    if (Date.CultureInfo.dateElementOrder[0] === "d") {
                        s = "1/" + n[0] + "/" + n[2];
                    }
                }
            } catch (e) {}
            return s;
        }
    };
    $P.Normalizer.buildReplaceData();
}());
(function() {
    var $P = Date.Parsing;
    var _ = $P.Operators = {
        rtoken: function(r) {
            return function(s) {
                var mx = s.match(r);
                if (mx) {
                    return ([mx[0], s.substring(mx[0].length)]);
                } else {
                    throw new $P.Exception(s);
                }
            };
        },
        token: function() {
            return function(s) {
                return _.rtoken(new RegExp("^\\s*" + s + "\\s*"))(s);
            };
        },
        stoken: function(s) {
            return _.rtoken(new RegExp("^" + s));
        },
        until: function(p) {
            return function(s) {
                var qx = [],
                    rx = null;
                while (s.length) {
                    try {
                        rx = p.call(this, s);
                    } catch (e) {
                        qx.push(rx[0]);
                        s = rx[1];
                        continue;
                    }
                    break;
                }
                return [qx, s];
            };
        },
        many: function(p) {
            return function(s) {
                var rx = [],
                    r = null;
                while (s.length) {
                    try {
                        r = p.call(this, s);
                    } catch (e) {
                        return [rx, s];
                    }
                    rx.push(r[0]);
                    s = r[1];
                }
                return [rx, s];
            };
        },
        optional: function(p) {
            return function(s) {
                var r = null;
                try {
                    r = p.call(this, s);
                } catch (e) {
                    return [null, s];
                }
                return [r[0], r[1]];
            };
        },
        not: function(p) {
            return function(s) {
                try {
                    p.call(this, s);
                } catch (e) {
                    return [null, s];
                }
                throw new $P.Exception(s);
            };
        },
        ignore: function(p) {
            return p ? function(s) {
                var r = null;
                r = p.call(this, s);
                return [null, r[1]];
            } : null;
        },
        product: function() {
            var px = arguments[0],
                qx = Array.prototype.slice.call(arguments, 1),
                rx = [];
            for (var i = 0; i < px.length; i++) {
                rx.push(_.each(px[i], qx));
            }
            return rx;
        },
        cache: function(rule) {
            var cache = {},
                cache_length = 0,
                cache_keys = [],
                CACHE_MAX = Date.Config.CACHE_MAX || 100000,
                r = null;
            var cacheCheck = function() {
                if (cache_length === CACHE_MAX) {
                    for (var i = 0; i < 10; i++) {
                        var key = cache_keys.shift();
                        if (key) {
                            delete cache[key];
                            cache_length--;
                        }
                    }
                }
            };
            return function(s) {
                cacheCheck();
                try {
                    r = cache[s] = (cache[s] || rule.call(this, s));
                } catch (e) {
                    r = cache[s] = e;
                }
                cache_length++;
                cache_keys.push(s);
                if (r instanceof $P.Exception) {
                    throw r;
                } else {
                    return r;
                }
            };
        },
        any: function() {
            var px = arguments;
            return function(s) {
                var r = null;
                for (var i = 0; i < px.length; i++) {
                    if (px[i] == null) {
                        continue;
                    }
                    try {
                        r = (px[i].call(this, s));
                    } catch (e) {
                        r = null;
                    }
                    if (r) {
                        return r;
                    }
                }
                throw new $P.Exception(s);
            };
        },
        each: function() {
            var px = arguments;
            return function(s) {
                var rx = [],
                    r = null;
                for (var i = 0; i < px.length; i++) {
                    if (px[i] == null) {
                        continue;
                    }
                    try {
                        r = (px[i].call(this, s));
                    } catch (e) {
                        throw new $P.Exception(s);
                    }
                    rx.push(r[0]);
                    s = r[1];
                }
                return [rx, s];
            };
        },
        all: function() {
            var px = arguments,
                _ = _;
            return _.each(_.optional(px));
        },
        sequence: function(px, d, c) {
            d = d || _.rtoken(/^\s*/);
            c = c || null;
            if (px.length === 1) {
                return px[0];
            }
            return function(s) {
                var r = null,
                    q = null;
                var rx = [];
                for (var i = 0; i < px.length; i++) {
                    try {
                        r = px[i].call(this, s);
                    } catch (e) {
                        break;
                    }
                    rx.push(r[0]);
                    try {
                        q = d.call(this, r[1]);
                    } catch (ex) {
                        q = null;
                        break;
                    }
                    s = q[1];
                }
                if (!r) {
                    throw new $P.Exception(s);
                }
                if (q) {
                    throw new $P.Exception(q[1]);
                }
                if (c) {
                    try {
                        r = c.call(this, r[1]);
                    } catch (ey) {
                        throw new $P.Exception(r[1]);
                    }
                }
                return [rx, (r ? r[1] : s)];
            };
        },
        between: function(d1, p, d2) {
            d2 = d2 || d1;
            var _fn = _.each(_.ignore(d1), p, _.ignore(d2));
            return function(s) {
                var rx = _fn.call(this, s);
                return [
                    [rx[0][0], r[0][2]], rx[1]
                ];
            };
        },
        list: function(p, d, c) {
            d = d || _.rtoken(/^\s*/);
            c = c || null;
            return (p instanceof Array ? _.each(_.product(p.slice(0, -1), _.ignore(d)), p.slice(-1), _.ignore(c)) : _.each(_.many(_.each(p, _.ignore(d))), px, _.ignore(c)));
        },
        set: function(px, d, c) {
            d = d || _.rtoken(/^\s*/);
            c = c || null;
            return function(s) {
                var r = null,
                    p = null,
                    q = null,
                    rx = null,
                    best = [
                        [], s
                    ],
                    last = false;
                for (var i = 0; i < px.length; i++) {
                    q = null;
                    p = null;
                    r = null;
                    last = (px.length === 1);
                    try {
                        r = px[i].call(this, s);
                    } catch (e) {
                        continue;
                    }
                    rx = [
                        [r[0]], r[1]
                    ];
                    if (r[1].length > 0 && !last) {
                        try {
                            q = d.call(this, r[1]);
                        } catch (ex) {
                            last = true;
                        }
                    } else {
                        last = true;
                    }
                    if (!last && q[1].length === 0) {
                        last = true;
                    }
                    if (!last) {
                        var qx = [];
                        for (var j = 0; j < px.length; j++) {
                            if (i !== j) {
                                qx.push(px[j]);
                            }
                        }
                        p = _.set(qx, d).call(this, q[1]);
                        if (p[0].length > 0) {
                            rx[0] = rx[0].concat(p[0]);
                            rx[1] = p[1];
                        }
                    }
                    if (rx[1].length < best[1].length) {
                        best = rx;
                    }
                    if (best[1].length === 0) {
                        break;
                    }
                }
                if (best[0].length === 0) {
                    return best;
                }
                if (c) {
                    try {
                        q = c.call(this, best[1]);
                    } catch (ey) {
                        throw new $P.Exception(best[1]);
                    }
                    best[1] = q[1];
                }
                return best;
            };
        },
        forward: function(gr, fname) {
            return function(s) {
                return gr[fname].call(this, s);
            };
        },
        replace: function(rule, repl) {
            return function(s) {
                var r = rule.call(this, s);
                return [repl, r[1]];
            };
        },
        process: function(rule, fn) {
            return function(s) {
                var r = rule.call(this, s);
                return [fn.call(this, r[0]), r[1]];
            };
        },
        min: function(min, rule) {
            return function(s) {
                var rx = rule.call(this, s);
                if (rx[0].length < min) {
                    throw new $P.Exception(s);
                }
                return rx;
            };
        }
    };
    var _generator = function(op) {
        function gen() {
            var args = null,
                rx = [],
                px, i;
            if (arguments.length > 1) {
                args = Array.prototype.slice.call(arguments);
            } else if (arguments[0] instanceof Array) {
                args = arguments[0];
            }
            if (args) {
                px = args.shift();
                if (px.length > 0) {
                    args.unshift(px[i]);
                    rx.push(op.apply(null, args));
                    args.shift();
                    return rx;
                }
            } else {
                return op.apply(null, arguments);
            }
        }
        return gen;
    };
    var gx = "optional not ignore cache".split(/\s/);
    for (var i = 0; i < gx.length; i++) {
        _[gx[i]] = _generator(_[gx[i]]);
    }
    var _vector = function(op) {
        return function() {
            if (arguments[0] instanceof Array) {
                return op.apply(null, arguments[0]);
            } else {
                return op.apply(null, arguments);
            }
        };
    };
    var vx = "each any all".split(/\s/);
    for (var j = 0; j < vx.length; j++) {
        _[vx[j]] = _vector(_[vx[j]]);
    }
}());
(function() {
    var $D = Date;
    var flattenAndCompact = function(ax) {
        var rx = [];
        for (var i = 0; i < ax.length; i++) {
            if (ax[i] instanceof Array) {
                rx = rx.concat(flattenAndCompact(ax[i]));
            } else {
                if (ax[i]) {
                    rx.push(ax[i]);
                }
            }
        }
        return rx;
    };
    var parseMeridian = function() {
        if (this.meridian && (this.hour || this.hour === 0)) {
            if (this.meridian === "a" && this.hour > 11 && Date.Config.strict24hr) {
                throw "Invalid hour and meridian combination";
            } else if (this.meridian === "p" && this.hour < 12 && Date.Config.strict24hr) {
                throw "Invalid hour and meridian combination";
            } else if (this.meridian === "p" && this.hour < 12) {
                this.hour = this.hour + 12;
            } else if (this.meridian === "a" && this.hour === 12) {
                this.hour = 0;
            }
        }
    };
    var setDefaults = function() {
        var now = new Date();
        if ((this.hour || this.minute) && (!this.month && !this.year && !this.day)) {
            this.day = now.getDate();
        }
        if (!this.year) {
            this.year = now.getFullYear();
        }
        if (!this.month && this.month !== 0) {
            this.month = now.getMonth();
        }
        if (!this.day) {
            this.day = 1;
        }
        if (!this.hour) {
            this.hour = 0;
        }
        if (!this.minute) {
            this.minute = 0;
        }
        if (!this.second) {
            this.second = 0;
        }
        if (!this.millisecond) {
            this.millisecond = 0;
        }
    };
    var finishUtils = {
        getToday: function() {
            if (this.now || "hour minute second".indexOf(this.unit) !== -1) {
                return new Date();
            } else {
                return $D.today();
            }
        },
        setDaysFromWeekday: function(today, orient) {
            var gap;
            orient = orient || 1;
            this.unit = "day";
            gap = ($D.getDayNumberFromName(this.weekday) - today.getDay());
            this.days = gap ? ((gap + (orient * 7)) % 7) : (orient * 7);
            return this;
        },
        setMonthsFromMonth: function(today, orient) {
            var gap;
            orient = orient || 1;
            this.unit = "month";
            gap = (this.month - today.getMonth());
            this.months = gap ? ((gap + (orient * 12)) % 12) : (orient * 12);
            this.month = null;
            return this;
        },
        setDMYFromWeekday: function() {
            var d = Date[this.weekday]();
            this.day = d.getDate();
            if (!this.month) {
                this.month = d.getMonth();
            }
            this.year = d.getFullYear();
            return this;
        },
        setUnitValue: function(orient) {
            if (!this.value && this.operator && this.operator !== null && this[this.unit + "s"] && this[this.unit + "s"] !== null) {
                this[this.unit + "s"] = this[this.unit + "s"] + ((this.operator === "add") ? 1 : -1) + (this.value || 0) * orient;
            } else if (this[this.unit + "s"] == null || this.operator != null) {
                if (!this.value) {
                    this.value = 1;
                }
                this[this.unit + "s"] = this.value * orient;
            }
        },
        generateDateFromWeeks: function() {
            var weekday = (this.weekday !== undefined) ? this.weekday : "today";
            var d = Date[weekday]().addWeeks(this.weeks);
            if (this.now) {
                d.setTimeToNow();
            }
            return d;
        }
    };
    $D.Translator = {
        hour: function(s) {
            return function() {
                this.hour = Number(s);
            };
        },
        minute: function(s) {
            return function() {
                this.minute = Number(s);
            };
        },
        second: function(s) {
            return function() {
                this.second = Number(s);
            };
        },
        secondAndMillisecond: function(s) {
            return function() {
                var mx = s.match(/^([0-5][0-9])\.([0-9]{1,3})/);
                this.second = Number(mx[1]);
                this.millisecond = Number(mx[2]);
            };
        },
        meridian: function(s) {
            return function() {
                this.meridian = s.slice(0, 1).toLowerCase();
            };
        },
        timezone: function(s) {
            return function() {
                var n = s.replace(/[^\d\+\-]/g, "");
                if (n.length) {
                    this.timezoneOffset = Number(n);
                } else {
                    this.timezone = s.toLowerCase();
                }
            };
        },
        day: function(x) {
            var s = x[0];
            return function() {
                this.day = Number(s.match(/\d+/)[0]);
                if (this.day < 1) {
                    throw "invalid day";
                }
            };
        },
        month: function(s) {
            return function() {
                this.month = (s.length === 3) ? "jan feb mar apr may jun jul aug sep oct nov dec".indexOf(s) / 4 : Number(s) - 1;
                if (this.month < 0) {
                    throw "invalid month";
                }
            };
        },
        year: function(s) {
            return function() {
                var n = Number(s);
                this.year = ((s.length > 2) ? n : (n + (((n + 2000) < Date.CultureInfo.twoDigitYearMax) ? 2000 : 1900)));
            };
        },
        rday: function(s) {
            return function() {
                switch (s) {
                    case "yesterday":
                        this.days = -1;
                        break;
                    case "tomorrow":
                        this.days = 1;
                        break;
                    case "today":
                        this.days = 0;
                        break;
                    case "now":
                        this.days = 0;
                        this.now = true;
                        break;
                }
            };
        },
        finishExact: function(x) {
            var d;
            x = (x instanceof Array) ? x : [x];
            for (var i = 0; i < x.length; i++) {
                if (x[i]) {
                    x[i].call(this);
                }
            }
            setDefaults.call(this);
            parseMeridian.call(this);
            if (this.day > $D.getDaysInMonth(this.year, this.month)) {
                throw new RangeError(this.day + " is not a valid value for days.");
            }
            d = new Date(this.year, this.month, this.day, this.hour, this.minute, this.second, this.millisecond);
            if (this.year < 100) {
                d.setFullYear(this.year);
            }
            if (this.timezone) {
                d.set({
                    timezone: this.timezone
                });
            } else if (this.timezoneOffset) {
                d.set({
                    timezoneOffset: this.timezoneOffset
                });
            }
            return d;
        },
        finish: function(x) {
            var today, expression, orient, temp;
            x = (x instanceof Array) ? flattenAndCompact(x) : [x];
            if (x.length === 0) {
                return null;
            }
            for (var i = 0; i < x.length; i++) {
                if (typeof x[i] === "function") {
                    x[i].call(this);
                }
            }
            if (this.now && !this.unit && !this.operator) {
                return new Date();
            } else {
                today = finishUtils.getToday.call(this);
            }
            expression = !!(this.days && this.days !== null || this.orient || this.operator);
            orient = ((this.orient === "past" || this.operator === "subtract") ? -1 : 1);
            if (this.month && this.unit === "week") {
                this.value = this.month + 1;
                delete this.month;
                delete this.day;
            }
            if ((this.month || this.month === 0) && "year day hour minute second".indexOf(this.unit) !== -1) {
                if (!this.value) {
                    this.value = this.month + 1;
                }
                this.month = null;
                expression = true;
            }
            if (!expression && this.weekday && !this.day && !this.days) {
                finishUtils.setDMYFromWeekday.call(this);
            }
            if (expression && this.weekday && this.unit !== "month" && this.unit !== "week") {
                finishUtils.setDaysFromWeekday.call(this, today, orient);
            }
            if (this.weekday && this.unit !== "week" && !this.day && !this.days) {
                temp = Date[this.weekday]();
                this.day = temp.getDate();
                if (temp.getMonth() !== today.getMonth()) {
                    this.month = temp.getMonth();
                }
            }
            if (this.month && this.unit === "day" && this.operator) {
                if (!this.value) {
                    this.value = (this.month + 1);
                }
                this.month = null;
            }
            if (this.value != null && this.month != null && this.year != null) {
                this.day = this.value * 1;
            }
            if (this.month && !this.day && this.value) {
                today.set({
                    day: this.value * 1
                });
                if (!expression) {
                    this.day = this.value * 1;
                }
            }
            if (!this.month && this.value && this.unit === "month" && !this.now) {
                this.month = this.value;
                expression = true;
            }
            if (expression && (this.month || this.month === 0) && this.unit !== "year") {
                finishUtils.setMonthsFromMonth.call(this, today, orient);
            }
            if (!this.unit) {
                this.unit = "day";
            }
            finishUtils.setUnitValue.call(this, orient);
            parseMeridian.call(this);
            if ((this.month || this.month === 0) && !this.day) {
                this.day = 1;
            }
            if (!this.orient && !this.operator && this.unit === "week" && this.value && !this.day && !this.month) {
                return Date.today().setWeek(this.value);
            }
            if (this.unit === "week" && this.weeks && !this.day && !this.month) {
                return finishUtils.generateDateFromWeeks.call(this);
            }
            if (expression && this.timezone && this.day && this.days) {
                this.day = this.days;
            }
            if (expression) {
                today.add(this);
            } else {
                today.set(this);
            }
            if (this.timezone) {
                this.timezone = this.timezone.toUpperCase();
                var offset = $D.getTimezoneOffset(this.timezone);
                var timezone;
                if (today.hasDaylightSavingTime()) {
                    timezone = $D.getTimezoneAbbreviation(offset, today.isDaylightSavingTime());
                    if (timezone !== this.timezone) {
                        if (today.isDaylightSavingTime()) {
                            today.addHours(-1);
                        } else {
                            today.addHours(1);
                        }
                    }
                }
                today.setTimezoneOffset(offset);
            }
            return today;
        }
    };
}());
(function() {
    var $D = Date;
    $D.Grammar = {};
    var _ = $D.Parsing.Operators,
        g = $D.Grammar,
        t = $D.Translator,
        _fn;
    _fn = function() {
        return _.each(_.any.apply(null, arguments), _.not(g.ctoken2("timeContext")));
    };
    g.datePartDelimiter = _.rtoken(/^([\s\-\.\,\/\x27]+)/);
    g.timePartDelimiter = _.stoken(":");
    g.whiteSpace = _.rtoken(/^\s*/);
    g.generalDelimiter = _.rtoken(/^(([\s\,]|at|@|on)+)/);
    var _C = {};
    g.ctoken = function(keys) {
        var fn = _C[keys];
        if (!fn) {
            var c = Date.CultureInfo.regexPatterns;
            var kx = keys.split(/\s+/),
                px = [];
            for (var i = 0; i < kx.length; i++) {
                px.push(_.replace(_.rtoken(c[kx[i]]), kx[i]));
            }
            fn = _C[keys] = _.any.apply(null, px);
        }
        return fn;
    };
    g.ctoken2 = function(key) {
        return _.rtoken(Date.CultureInfo.regexPatterns[key]);
    };
    var cacheProcessRtoken = function(key, token, type, eachToken) {
        if (eachToken) {
            g[key] = _.cache(_.process(_.each(_.rtoken(token), _.optional(g.ctoken2(eachToken))), type));
        } else {
            g[key] = _.cache(_.process(_.rtoken(token), type));
        }
    };
    var cacheProcessCtoken = function(token, type) {
        return _.cache(_.process(g.ctoken2(token), type));
    };
    var _F = {};
    var _get = function(f) {
        _F[f] = (_F[f] || g.format(f)[0]);
        return _F[f];
    };
    g.allformats = function(fx) {
        var rx = [];
        if (fx instanceof Array) {
            for (var i = 0; i < fx.length; i++) {
                rx.push(_get(fx[i]));
            }
        } else {
            rx.push(_get(fx));
        }
        return rx;
    };
    g.formats = function(fx) {
        if (fx instanceof Array) {
            var rx = [];
            for (var i = 0; i < fx.length; i++) {
                rx.push(_get(fx[i]));
            }
            return _.any.apply(null, rx);
        } else {
            return _get(fx);
        }
    };
    var grammarFormats = {
        timeFormats: function() {
            var i, RTokenKeys = ["h", "hh", "H", "HH", "m", "mm", "s", "ss", "ss.s", "z", "zz"],
                RToken = [/^(0[0-9]|1[0-2]|[1-9])/, /^(0[0-9]|1[0-2])/, /^([0-1][0-9]|2[0-3]|[0-9])/, /^([0-1][0-9]|2[0-3])/, /^([0-5][0-9]|[0-9])/, /^[0-5][0-9]/, /^([0-5][0-9]|[0-9])/, /^[0-5][0-9]/, /^[0-5][0-9]\.[0-9]{1,3}/, /^((\+|\-)\s*\d\d\d\d)|((\+|\-)\d\d\:?\d\d)/, /^((\+|\-)\s*\d\d\d\d)|((\+|\-)\d\d\:?\d\d)/],
                tokens = [t.hour, t.hour, t.hour, t.minute, t.minute, t.second, t.second, t.secondAndMillisecond, t.timezone, t.timezone, t.timezone];
            for (i = 0; i < RTokenKeys.length; i++) {
                cacheProcessRtoken(RTokenKeys[i], RToken[i], tokens[i]);
            }
            g.hms = _.cache(_.sequence([g.H, g.m, g.s], g.timePartDelimiter));
            g.t = cacheProcessCtoken("shortMeridian", t.meridian);
            g.tt = cacheProcessCtoken("longMeridian", t.meridian);
            g.zzz = cacheProcessCtoken("timezone", t.timezone);
            g.timeSuffix = _.each(_.ignore(g.whiteSpace), _.set([g.tt, g.zzz]));
            g.time = _.each(_.optional(_.ignore(_.stoken("T"))), g.hms, g.timeSuffix);
        },
        dateFormats: function() {
            var _setfn = function() {
                return _.set(arguments, g.datePartDelimiter);
            };
            var i, RTokenKeys = ["d", "dd", "M", "MM", "y", "yy", "yyy", "yyyy"],
                RToken = [/^([0-2]\d|3[0-1]|\d)/, /^([0-2]\d|3[0-1])/, /^(1[0-2]|0\d|\d)/, /^(1[0-2]|0\d)/, /^(\d+)/, /^(\d\d)/, /^(\d\d?\d?\d?)/, /^(\d\d\d\d)/],
                tokens = [t.day, t.day, t.month, t.month, t.year, t.year, t.year, t.year],
                eachToken = ["ordinalSuffix", "ordinalSuffix"];
            for (i = 0; i < RTokenKeys.length; i++) {
                cacheProcessRtoken(RTokenKeys[i], RToken[i], tokens[i], eachToken[i]);
            }
            g.MMM = g.MMMM = _.cache(_.process(g.ctoken("jan feb mar apr may jun jul aug sep oct nov dec"), t.month));
            g.ddd = g.dddd = _.cache(_.process(g.ctoken("sun mon tue wed thu fri sat"), function(s) {
                return function() {
                    this.weekday = s;
                };
            }));
            g.day = _fn(g.d, g.dd);
            g.month = _fn(g.M, g.MMM);
            g.year = _fn(g.yyyy, g.yy);
            g.mdy = _setfn(g.ddd, g.month, g.day, g.year);
            g.ymd = _setfn(g.ddd, g.year, g.month, g.day);
            g.dmy = _setfn(g.ddd, g.day, g.month, g.year);
            g.date = function(s) {
                return ((g[Date.CultureInfo.dateElementOrder] || g.mdy).call(this, s));
            };
        },
        relative: function() {
            g.orientation = _.process(g.ctoken("past future"), function(s) {
                return function() {
                    this.orient = s;
                };
            });
            g.operator = _.process(g.ctoken("add subtract"), function(s) {
                return function() {
                    this.operator = s;
                };
            });
            g.rday = _.process(g.ctoken("yesterday tomorrow today now"), t.rday);
            g.unit = _.process(g.ctoken("second minute hour day week month year"), function(s) {
                return function() {
                    this.unit = s;
                };
            });
        }
    };
    g.buildGrammarFormats = function() {
        _C = {};
        grammarFormats.timeFormats();
        grammarFormats.dateFormats();
        grammarFormats.relative();
        g.value = _.process(_.rtoken(/^([-+]?\d+)?(st|nd|rd|th)?/), function(s) {
            return function() {
                this.value = s.replace(/\D/g, "");
            };
        });
        g.expression = _.set([g.rday, g.operator, g.value, g.unit, g.orientation, g.ddd, g.MMM]);
        g.format = _.process(_.many(_.any(_.process(_.rtoken(/^(dd?d?d?(?!e)|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|zz?z?)/), function(fmt) {
            if (g[fmt]) {
                return g[fmt];
            } else {
                throw $D.Parsing.Exception(fmt);
            }
        }), _.process(_.rtoken(/^[^dMyhHmstz]+/), function(s) {
            return _.ignore(_.stoken(s));
        }))), function(rules) {
            return _.process(_.each.apply(null, rules), t.finishExact);
        });
        g._start = _.process(_.set([g.date, g.time, g.expression], g.generalDelimiter, g.whiteSpace), t.finish);
    };
    g.buildGrammarFormats();
    g._formats = g.formats(["\"yyyy-MM-ddTHH:mm:ssZ\"", "yyyy-MM-ddTHH:mm:ss.sz", "yyyy-MM-ddTHH:mm:ssZ", "yyyy-MM-ddTHH:mm:ssz", "yyyy-MM-ddTHH:mm:ss", "yyyy-MM-ddTHH:mmZ", "yyyy-MM-ddTHH:mmz", "yyyy-MM-ddTHH:mm", "ddd, MMM dd, yyyy H:mm:ss tt", "ddd MMM d yyyy HH:mm:ss zzz", "MMddyyyy", "ddMMyyyy", "Mddyyyy", "ddMyyyy", "Mdyyyy", "dMyyyy", "yyyy", "Mdyy", "dMyy", "d"]);
    g.start = function(s) {
        try {
            var r = g._formats.call({}, s);
            if (r[1].length === 0) {
                return r;
            }
        } catch (e) {}
        return g._start.call({}, s);
    };
}());
(function() {
    var $D = Date;
    var parseUtils = {
        removeOrds: function(s) {
            ords = s.match(/\b(\d+)(?:st|nd|rd|th)\b/);
            s = ((ords && ords.length === 2) ? s.replace(ords[0], ords[1]) : s);
            return s;
        },
        grammarParser: function(s) {
            var r = null;
            try {
                r = $D.Grammar.start.call({}, s.replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1"));
            } catch (e) {
                return null;
            }
            return ((r[1].length === 0) ? r[0] : null);
        },
        nativeFallback: function(s) {
            var t;
            try {
                t = Date._parse(s);
                return (t || t === 0) ? new Date(t) : null;
            } catch (e) {
                return null;
            }
        }
    };

    function parse(s) {
        var d;
        if (!s) {
            return null;
        }
        if (s instanceof Date) {
            return s.clone();
        }
        if (s.length >= 4 && s.charAt(0) !== "0" && s.charAt(0) !== "+" && s.charAt(0) !== "-") {
            d = $D.Parsing.ISO.parse(s) || $D.Parsing.Numeric.parse(s);
        }
        if (d instanceof Date && !isNaN(d.getTime())) {
            return d;
        } else {
            s = $D.Parsing.Normalizer.parse(parseUtils.removeOrds(s));
            d = parseUtils.grammarParser(s);
            if (d !== null) {
                return d;
            } else {
                return parseUtils.nativeFallback(s);
            }
        }
    }
    if (!$D._parse) {
        $D._parse = $D.parse;
    }
    $D.parse = parse;
    Date.getParseFunction = function(fx) {
        var fns = Date.Grammar.allformats(fx);
        return function(s) {
            var r = null;
            for (var i = 0; i < fns.length; i++) {
                try {
                    r = fns[i].call({}, s);
                } catch (e) {
                    continue;
                }
                if (r[1].length === 0) {
                    return r[0];
                }
            }
            return null;
        };
    };
    $D.parseExact = function(s, fx) {
        return $D.getParseFunction(fx)(s);
    };
}());
(function() {
    var $D = Date,
        $P = $D.prototype,
        p = function(s, l) {
            if (!l) {
                l = 2;
            }
            return ("000" + s).slice(l * -1);
        };
    var normalizerSubstitutions = {
        "d": "dd",
        "%d": "dd",
        "D": "ddd",
        "%a": "ddd",
        "j": "dddd",
        "l": "dddd",
        "%A": "dddd",
        "S": "S",
        "F": "MMMM",
        "%B": "MMMM",
        "m": "MM",
        "%m": "MM",
        "M": "MMM",
        "%b": "MMM",
        "%h": "MMM",
        "n": "M",
        "Y": "yyyy",
        "%Y": "yyyy",
        "y": "yy",
        "%y": "yy",
        "g": "h",
        "%I": "h",
        "G": "H",
        "h": "hh",
        "H": "HH",
        "%H": "HH",
        "i": "mm",
        "%M": "mm",
        "s": "ss",
        "%S": "ss",
        "%r": "hh:mm tt",
        "%R": "H:mm",
        "%T": "H:mm:ss",
        "%X": "t",
        "%x": "d",
        "%e": "d",
        "%D": "MM/dd/yy",
        "%n": "\\n",
        "%t": "\\t",
        "e": "z",
        "T": "z",
        "%z": "z",
        "%Z": "z",
        "Z": "ZZ",
        "N": "u",
        "w": "u",
        "%w": "u",
        "W": "W",
        "%V": "W"
    };
    var normalizer = {
        substitutes: function(m) {
            return normalizerSubstitutions[m];
        },
        interpreted: function(m, x) {
            var y;
            switch (m) {
                case "%u":
                    return x.getDay() + 1;
                case "z":
                    return x.getOrdinalNumber();
                case "%j":
                    return p(x.getOrdinalNumber(), 3);
                case "%U":
                    var d1 = x.clone().set({
                            month: 0,
                            day: 1
                        }).addDays(-1).moveToDayOfWeek(0),
                        d2 = x.clone().addDays(1).moveToDayOfWeek(0, -1);
                    return (d2 < d1) ? "00" : p((d2.getOrdinalNumber() - d1.getOrdinalNumber()) / 7 + 1);
                case "%W":
                    return p(x.getWeek());
                case "t":
                    return $D.getDaysInMonth(x.getFullYear(), x.getMonth());
                case "o":
                case "%G":
                    return x.setWeek(x.getISOWeek()).toString("yyyy");
                case "%g":
                    return x._format("%G").slice(-2);
                case "a":
                case "%p":
                    return t("tt").toLowerCase();
                case "A":
                    return t("tt").toUpperCase();
                case "u":
                    return p(x.getMilliseconds(), 3);
                case "I":
                    return (x.isDaylightSavingTime()) ? 1 : 0;
                case "O":
                    return x.getUTCOffset();
                case "P":
                    y = x.getUTCOffset();
                    return y.substring(0, y.length - 2) + ":" + y.substring(y.length - 2);
                case "B":
                    var now = new Date();
                    return Math.floor(((now.getHours() * 3600) + (now.getMinutes() * 60) + now.getSeconds() + (now.getTimezoneOffset() + 60) * 60) / 86.4);
                case "c":
                    return x.toISOString().replace(/\"/g, "");
                case "U":
                    return $D.strtotime("now");
                case "%c":
                    return t("d") + " " + t("t");
                case "%C":
                    return Math.floor(x.getFullYear() / 100 + 1);
            }
        },
        shouldOverrideDefaults: function(m) {
            switch (m) {
                case "%e":
                    return true;
                default:
                    return false;
            }
        },
        parse: function(m, context) {
            var formatString, c = context || new Date();
            formatString = normalizer.substitutes(m);
            if (formatString) {
                return formatString;
            }
            formatString = normalizer.interpreted(m, c);
            if (formatString) {
                return formatString;
            } else {
                return m;
            }
        }
    };
    $D.normalizeFormat = function(format, context) {
        return format.replace(/(%|\\)?.|%%/g, function(t) {
            return normalizer.parse(t, context);
        });
    };
    $D.strftime = function(format, time) {
        var d = Date.parse(time);
        return d._format(format);
    };
    $D.strtotime = function(time) {
        var d = $D.parse(time);
        return Math.round($D.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds()) / 1000);
    };
    var formatReplace = function(context) {
        return function(m) {
            var formatString, override = false;
            if (m.charAt(0) === "\\" || m.substring(0, 2) === "%%") {
                return m.replace("\\", "").replace("%%", "%");
            }
            override = normalizer.shouldOverrideDefaults(m);
            formatString = $D.normalizeFormat(m, context);
            if (formatString) {
                return context.toString(formatString, override);
            }
        };
    };
    $P._format = function(format) {
        var formatter = formatReplace(this);
        if (!format) {
            return this._toString();
        } else {
            return format.replace(/(%|\\)?.|%%/g, formatter);
        }
    };
    if (!$P.format) {
        $P.format = $P._format;
    }
}());
(function() {
    "use strict";
    var gFn = function(attr) {
        return function() {
            return this[attr];
        };
    };
    var sFn = function(attr) {
        return function(val) {
            this[attr] = val;
            return this;
        };
    };
    var attrs = ["years", "months", "days", "hours", "minutes", "seconds", "milliseconds"];
    var addSetFuncs = function(context, attrs) {
        for (var i = 0; i < attrs.length; i++) {
            var $a = attrs[i],
                $b = $a.slice(0, 1).toUpperCase() + $a.slice(1);
            context.prototype[$a] = 0;
            context.prototype["get" + $b] = gFn($a);
            context.prototype["set" + $b] = sFn($a);
        }
    };
    var TimeSpan = function(days, hours, minutes, seconds, milliseconds) {
        if (arguments.length === 1 && typeof days === "number") {
            var orient = (days < 0) ? -1 : +1;
            var millsLeft = Math.abs(days);
            this.setDays(Math.floor(millsLeft / 86400000) * orient);
            millsLeft = millsLeft % 86400000;
            this.setHours(Math.floor(millsLeft / 3600000) * orient);
            millsLeft = millsLeft % 3600000;
            this.setMinutes(Math.floor(millsLeft / 60000) * orient);
            millsLeft = millsLeft % 60000;
            this.setSeconds(Math.floor(millsLeft / 1000) * orient);
            millsLeft = millsLeft % 1000;
            this.setMilliseconds(millsLeft * orient);
        } else {
            this.set(days, hours, minutes, seconds, milliseconds);
        }
        this.getTotalMilliseconds = function() {
            return (this.getDays() * 86400000) +
                (this.getHours() * 3600000) +
                (this.getMinutes() * 60000) +
                (this.getSeconds() * 1000);
        };
        this.compareTo = function(time) {
            var t1 = new Date(1970, 1, 1, this.getHours(), this.getMinutes(), this.getSeconds()),
                t2;
            if (time === null) {
                t2 = new Date(1970, 1, 1, 0, 0, 0);
            } else {
                t2 = new Date(1970, 1, 1, time.getHours(), time.getMinutes(), time.getSeconds());
            }
            return (t1 < t2) ? -1 : (t1 > t2) ? 1 : 0;
        };
        this.equals = function(time) {
            return (this.compareTo(time) === 0);
        };
        this.add = function(time) {
            return (time === null) ? this : this.addSeconds(time.getTotalMilliseconds() / 1000);
        };
        this.subtract = function(time) {
            return (time === null) ? this : this.addSeconds(-time.getTotalMilliseconds() / 1000);
        };
        this.addDays = function(n) {
            return new TimeSpan(this.getTotalMilliseconds() + (n * 86400000));
        };
        this.addHours = function(n) {
            return new TimeSpan(this.getTotalMilliseconds() + (n * 3600000));
        };
        this.addMinutes = function(n) {
            return new TimeSpan(this.getTotalMilliseconds() + (n * 60000));
        };
        this.addSeconds = function(n) {
            return new TimeSpan(this.getTotalMilliseconds() + (n * 1000));
        };
        this.addMilliseconds = function(n) {
            return new TimeSpan(this.getTotalMilliseconds() + n);
        };
        this.get12HourHour = function() {
            return (this.getHours() > 12) ? this.getHours() - 12 : (this.getHours() === 0) ? 12 : this.getHours();
        };
        this.getDesignator = function() {
            return (this.getHours() < 12) ? Date.CultureInfo.amDesignator : Date.CultureInfo.pmDesignator;
        };
        this.toString = function(format) {
            this._toString = function() {
                if (this.getDays() !== null && this.getDays() > 0) {
                    return this.getDays() + "." + this.getHours() + ":" + this.p(this.getMinutes()) + ":" + this.p(this.getSeconds());
                } else {
                    return this.getHours() + ":" + this.p(this.getMinutes()) + ":" + this.p(this.getSeconds());
                }
            };
            this.p = function(s) {
                return (s.toString().length < 2) ? "0" + s : s;
            };
            var me = this;
            return format ? format.replace(/dd?|HH?|hh?|mm?|ss?|tt?/g, function(format) {
                switch (format) {
                    case "d":
                        return me.getDays();
                    case "dd":
                        return me.p(me.getDays());
                    case "H":
                        return me.getHours();
                    case "HH":
                        return me.p(me.getHours());
                    case "h":
                        return me.get12HourHour();
                    case "hh":
                        return me.p(me.get12HourHour());
                    case "m":
                        return me.getMinutes();
                    case "mm":
                        return me.p(me.getMinutes());
                    case "s":
                        return me.getSeconds();
                    case "ss":
                        return me.p(me.getSeconds());
                    case "t":
                        return ((me.getHours() < 12) ? Date.CultureInfo.amDesignator : Date.CultureInfo.pmDesignator).substring(0, 1);
                    case "tt":
                        return (me.getHours() < 12) ? Date.CultureInfo.amDesignator : Date.CultureInfo.pmDesignator;
                }
            }) : this._toString();
        };
        return this;
    };
    addSetFuncs(TimeSpan, attrs.slice(2));
    TimeSpan.prototype.set = function(days, hours, minutes, seconds, milliseconds) {
        this.setDays(days || this.getDays());
        this.setHours(hours || this.getHours());
        this.setMinutes(minutes || this.getMinutes());
        this.setSeconds(seconds || this.getSeconds());
        this.setMilliseconds(milliseconds || this.getMilliseconds());
    };
    Date.prototype.getTimeOfDay = function() {
        return new TimeSpan(0, this.getHours(), this.getMinutes(), this.getSeconds(), this.getMilliseconds());
    };
    Date.TimeSpan = TimeSpan;
    if (typeof window !== "undefined") {
        window.TimeSpan = TimeSpan;
    }
}());
(function() {
    "use strict";
    var attrs = ["years", "months", "days", "hours", "minutes", "seconds", "milliseconds"];
    var gFn = function(attr) {
        return function() {
            return this[attr];
        };
    };
    var sFn = function(attr) {
        return function(val) {
            this[attr] = val;
            return this;
        };
    };
    var addSetFuncs = function(context, attrs) {
        for (var i = 0; i < attrs.length; i++) {
            var $a = attrs[i],
                $b = $a.slice(0, 1).toUpperCase() + $a.slice(1);
            context.prototype[$a] = 0;
            context.prototype["get" + $b] = gFn($a);
            context.prototype["set" + $b] = sFn($a);
        }
    };
    var setMonthsAndYears = function(orient, d1, d2, context) {
        function inc() {
            d1.addMonths(-orient);
            context.months++;
            if (context.months === 12) {
                context.years++;
                context.months = 0;
            }
        }
        if (orient === +1) {
            while (d1 > d2) {
                inc();
            }
        } else {
            while (d1 < d2) {
                inc();
            }
        }
        context.months--;
        context.months *= orient;
        context.years *= orient;
    };
    var adjustForDST = function(orient, startDate, endDate) {
        var hasDSTMismatch = (false === (startDate.isDaylightSavingTime() === endDate.isDaylightSavingTime()));
        if (hasDSTMismatch && orient === 1) {
            startDate.addHours(-1);
        } else if (hasDSTMismatch) {
            startDate.addHours(1);
        }
    };
    var TimePeriod = function(years, months, days, hours, minutes, seconds, milliseconds) {
        if (arguments.length === 7) {
            this.set(years, months, days, hours, minutes, seconds, milliseconds);
        } else if (arguments.length === 2 && arguments[0] instanceof Date && arguments[1] instanceof Date) {
            var startDate = arguments[0].clone();
            var endDate = arguments[1].clone();
            var orient = (startDate > endDate) ? +1 : -1;
            this.dates = {
                start: arguments[0].clone(),
                end: arguments[1].clone()
            };
            setMonthsAndYears(orient, startDate, endDate, this);
            adjustForDST(orient, startDate, endDate);
            var diff = endDate - startDate;
            if (diff !== 0) {
                var ts = new TimeSpan(diff);
                this.set(this.years, this.months, ts.getDays(), ts.getHours(), ts.getMinutes(), ts.getSeconds(), ts.getMilliseconds());
            }
        }
        return this;
    };
    addSetFuncs(TimePeriod, attrs);
    TimePeriod.prototype.set = function(years, months, days, hours, minutes, seconds, milliseconds) {
        this.setYears(years || this.getYears());
        this.setMonths(months || this.getMonths());
        this.setDays(days || this.getDays());
        this.setHours(hours || this.getHours());
        this.setMinutes(minutes || this.getMinutes());
        this.setSeconds(seconds || this.getSeconds());
        this.setMilliseconds(milliseconds || this.getMilliseconds());
    };
    Date.TimePeriod = TimePeriod;
    if (typeof window !== "undefined") {
        window.TimePeriod = TimePeriod;
    }
}());