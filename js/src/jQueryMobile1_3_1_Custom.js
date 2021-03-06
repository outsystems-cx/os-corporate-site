﻿/*! jQuery Mobile v1.3.1 | Copyright 2010, 2013 jQuery Foundation, Inc. | jquery.org/license */

(function(e, t, n) {
    typeof define == "function" && define.amd ? define(["jquery"], function(r) {
        return n(r, e, t), r.mobile
    }) : n(e.jQuery, e, t)
})(this, document, function(e, t, n, r) {
    (function(e, t, r) {
        function l(e) {
            return e = e || location.href, "#" + e.replace(/^[^#]*#?(.*)$/, "$1")
        }
        var i = "hashchange",
            s = n,
            o, u = e.event.special,
            a = s.documentMode,
            f = "on" + i in t && (a === r || a > 7);
        e.fn[i] = function(e) {
            return e ? this.bind(i, e) : this.trigger(i)
        }, e.fn[i].delay = 50, u[i] = e.extend(u[i], {
            setup: function() {
                if (f) return !1;
                e(o.start)
            },
            teardown: function() {
                if (f) return !1;
                e(o.stop)
            }
        }), o = function() {
            function p() {
                var n = l(),
                    r = h(u);
                n !== u ? (c(u = n, r), e(t).trigger(i)) : r !== u && (location.href = location.href.replace(/#.*/, "") + r), o = setTimeout(p, e.fn[i].delay)
            }
            var n = {},
                o, u = l(),
                a = function(e) {
                    return e
                },
                c = a,
                h = a;
            return n.start = function() {
                o || p()
            }, n.stop = function() {
                o && clearTimeout(o), o = r
            }, t.attachEvent && !t.addEventListener && !f && function() {
                var t, r;
                n.start = function() {
                    t || (r = e.fn[i].src, r = r && r + l(), t = e('<iframe tabindex="-1" title="empty"/>').hide().one("load", function() {
                        r || c(l()), p()
                    }).attr("src", r || "javascript:0").insertAfter("body")[0].contentWindow, s.onpropertychange = function() {
                        try {
                            event.propertyName === "title" && (t.document.title = s.title)
                        } catch (e) {}
                    })
                }, n.stop = a, h = function() {
                    return l(t.location.href)
                }, c = function(n, r) {
                    var o = t.document,
                        u = e.fn[i].domain;
                    n !== r && (o.title = s.title, o.open(), u && o.write('<script>document.domain="' + u + '"</script>'), o.close(), t.location.hash = n)
                }
            }(), n
        }()
    })(e, this),
    function(e) {
        e.mobile = {}
    }(e),
    function(e, t, r) {
        var i = {};
        e.mobile = e.extend(e.mobile, {
            version: "1.3.1",
            ns: "",
            subPageUrlKey: "ui-page",
            activePageClass: "ui-page-active",
            activeBtnClass: "ui-btn-active",
            focusClass: "ui-focus",
            ajaxEnabled: !0,
            hashListeningEnabled: !0,
            linkBindingEnabled: !0,
            defaultPageTransition: "fade",
            maxTransitionWidth: !1,
            minScrollBack: 250,
            touchOverflowEnabled: !1,
            defaultDialogTransition: "pop",
            pageLoadErrorMessage: "Error Loading Page",
            pageLoadErrorMessageTheme: "e",
            phonegapNavigationEnabled: !1,
            autoInitializePage: !0,
            pushStateEnabled: !0,
            ignoreContentEnabled: !1,
            orientationChangeEnabled: !0,
            buttonMarkup: {
                hoverDelay: 200
            },
            window: e(t),
            document: e(n),
            keyCode: {
                ALT: 18,
                BACKSPACE: 8,
                CAPS_LOCK: 20,
                COMMA: 188,
                COMMAND: 91,
                COMMAND_LEFT: 91,
                COMMAND_RIGHT: 93,
                CONTROL: 17,
                DELETE: 46,
                DOWN: 40,
                END: 35,
                ENTER: 13,
                ESCAPE: 27,
                HOME: 36,
                INSERT: 45,
                LEFT: 37,
                MENU: 93,
                NUMPAD_ADD: 107,
                NUMPAD_DECIMAL: 110,
                NUMPAD_DIVIDE: 111,
                NUMPAD_ENTER: 108,
                NUMPAD_MULTIPLY: 106,
                NUMPAD_SUBTRACT: 109,
                PAGE_DOWN: 34,
                PAGE_UP: 33,
                PERIOD: 190,
                RIGHT: 39,
                SHIFT: 16,
                SPACE: 32,
                TAB: 9,
                UP: 38,
                WINDOWS: 91
            },
            behaviors: {},
            silentScroll: function(n) {
                e.type(n) !== "number" && (n = e.mobile.defaultHomeScroll), e.event.special.scrollstart.enabled = !1, setTimeout(function() {
                    t.scrollTo(0, n), e.mobile.document.trigger("silentscroll", {
                        x: 0,
                        y: n
                    })
                }, 20), setTimeout(function() {
                    e.event.special.scrollstart.enabled = !0
                }, 150)
            },
            nsNormalizeDict: i,
            nsNormalize: function(t) {
                if (!t) return;
                return i[t] || (i[t] = e.camelCase(e.mobile.ns + t))
            },
            getInheritedTheme: function(e, t) {
                var n = e[0],
                    r = "",
                    i = /ui-(bar|body|overlay)-([a-z])\b/,
                    s, o;
                while (n) {
                    s = n.className || "";
                    if (s && (o = i.exec(s)) && (r = o[2])) break;
                    n = n.parentNode
                }
                return r || t || "a"
            },
            closestPageData: function(e) {
                return e.closest(':jqmData(role="page"), :jqmData(role="dialog")').data("mobile-page")
            },
            enhanceable: function(e) {
                return this.haveParents(e, "enhance")
            },
            hijackable: function(e) {
                return this.haveParents(e, "ajax")
            },
            haveParents: function(t, n) {
                if (!e.mobile.ignoreContentEnabled) return t;
                var r = t.length,
                    i = e(),
                    s, o, u;
                for (var a = 0; a < r; a++) {
                    o = t.eq(a), u = !1, s = t[a];
                    while (s) {
                        var f = s.getAttribute ? s.getAttribute("data-" + e.mobile.ns + n) : "";
                        if (f === "false") {
                            u = !0;
                            break
                        }
                        s = s.parentNode
                    }
                    u || (i = i.add(o))
                }
                return i
            },
            getScreenHeight: function() {
                return t.innerHeight || e.mobile.window.height()
            }
        }, e.mobile), e.fn.jqmData = function(t, n) {
            var i;
            return typeof t != "undefined" && (t && (t = e.mobile.nsNormalize(t)), arguments.length < 2 || n === r ? i = this.data(t) : i = this.data(t, n)), i
        }, e.jqmData = function(t, n, r) {
            var i;
            return typeof n != "undefined" && (i = e.data(t, n ? e.mobile.nsNormalize(n) : n, r)), i
        }, e.fn.jqmRemoveData = function(t) {
            return this.removeData(e.mobile.nsNormalize(t))
        }, e.jqmRemoveData = function(t, n) {
            return e.removeData(t, e.mobile.nsNormalize(n))
        }, e.fn.removeWithDependents = function() {
            e.removeWithDependents(this)
        }, e.removeWithDependents = function(t) {
            var n = e(t);
            (n.jqmData("dependents") || e()).remove(), n.remove()
        }, e.fn.addDependents = function(t) {
            e.addDependents(e(this), t)
        }, e.addDependents = function(t, n) {
            var r = e(t).jqmData("dependents") || e();
            e(t).jqmData("dependents", e.merge(r, n))
        }, e.fn.getEncodedText = function() {
            return e("<div/>").text(e(this).text()).html()
        }, e.fn.jqmEnhanceable = function() {
            return e.mobile.enhanceable(this)
        }, e.fn.jqmHijackable = function() {
            return e.mobile.hijackable(this)
        };
        var s = e.find,
            o = /:jqmData\(([^)]*)\)/g;
        e.find = function(t, n, r, i) {
            return t = t.replace(o, "[data-" + (e.mobile.ns || "") + "$1]"), s.call(this, t, n, r, i)
        }, e.extend(e.find, s), e.find.matches = function(t, n) {
            return e.find(t, null, null, n)
        }, e.find.matchesSelector = function(t, n) {
            return e.find(n, null, null, [t]).length > 0
        }
    }(e, this),
    function(e, r) {
        t.matchMedia = t.matchMedia || function(e, t) {
            var n, r = e.documentElement,
                i = r.firstElementChild || r.firstChild,
                s = e.createElement("body"),
                o = e.createElement("div");
            return o.id = "mq-test-1", o.style.cssText = "position:absolute;top:-100em", s.style.background = "none", s.appendChild(o),
                function(e) {
                    return o.innerHTML = '&shy;<style media="' + e + '"> #mq-test-1 { width: 42px; }</style>', r.insertBefore(s, i), n = o.offsetWidth === 42, r.removeChild(s), {
                        matches: n,
                        media: e
                    }
                }
        }(n), e.mobile.media = function(e) {
            return t.matchMedia(e).matches
        }
    }(e),
    function(e, t) {
        var r = {
            touch: "ontouchend" in n
        };
        e.mobile.support = e.mobile.support || {}, e.extend(e.support, r), e.extend(e.mobile.support, r)
    }(e),
    function(e, n) {
        e.extend(e.support, {
            orientation: "orientation" in t && "onorientationchange" in t
        })
    }(e),
    function(e, r) {
        function i(e) {
            var t = e.charAt(0).toUpperCase() + e.substr(1),
                n = (e + " " + u.join(t + " ") + t).split(" ");
            for (var i in n)
                if (o[n[i]] !== r) return !0
        }

        function h(e, t, r) {
            var i = n.createElement("div"),
                s = function(e) {
                    return e.charAt(0).toUpperCase() + e.substr(1)
                },
                o = function(e) {
                    return e === "" ? "" : "-" + e.charAt(0).toLowerCase() + e.substr(1) + "-"
                },
                a = function(n) {
                    var r = o(n) + e + ": " + t + ";",
                        u = s(n),
                        a = u + (u === "" ? e : s(e));
                    i.setAttribute("style", r), !i.style[a] || (l = !0)
                },
                f = r ? r : u,
                l;
            for (var c = 0; c < f.length; c++) a(f[c]);
            return !!l
        }

        function p() {
            var i = "transform-3d",
                o = e.mobile.media("(-" + u.join("-" + i + "),(-") + "-" + i + "),(" + i + ")");
            if (o) return !!o;
            var a = n.createElement("div"),
                f = {
                    MozTransform: "-moz-transform",
                    transform: "transform"
                };
            s.append(a);
            for (var l in f) a.style[l] !== r && (a.style[l] = "translate3d( 100px, 1px, 1px )", o = t.getComputedStyle(a).getPropertyValue(f[l]));
            return !!o && o !== "none"
        }

        function d() {
            var t = location.protocol + "//" + location.host + location.pathname + "ui-dir/",
                n = e("head base"),
                r = null,
                i = "",
                o, u;
            return n.length ? i = n.attr("href") : n = r = e("<base>", {
                href: t
            }).appendTo("head"), o = e("<a href='testurl' />").prependTo(s), u = o[0].href, n[0].href = i || location.pathname, r && r.remove(), u.indexOf(t) === 0
        }

        function v() {
            var e = n.createElement("x"),
                r = n.documentElement,
                i = t.getComputedStyle,
                s;
            return "pointerEvents" in e.style ? (e.style.pointerEvents = "auto", e.style.pointerEvents = "x", r.appendChild(e), s = i && i(e, "").pointerEvents === "auto", r.removeChild(e), !!s) : !1
        }

        function m() {
            var e = n.createElement("div");
            return typeof e.getBoundingClientRect != "undefined"
        }

        function g() {
            var e = t,
                n = navigator.userAgent,
                r = navigator.platform,
                i = n.match(/AppleWebKit\/([0-9]+)/),
                s = !!i && i[1],
                o = n.match(/Fennec\/([0-9]+)/),
                u = !!o && o[1],
                a = n.match(/Opera Mobi\/([0-9]+)/),
                f = !!a && a[1];
            return (r.indexOf("iPhone") > -1 || r.indexOf("iPad") > -1 || r.indexOf("iPod") > -1) && s && s < 534 || e.operamini && {}.toString.call(e.operamini) === "[object OperaMini]" || a && f < 7458 || n.indexOf("Android") > -1 && s && s < 533 || u && u < 6 || "palmGetResource" in t && s && s < 534 || n.indexOf("MeeGo") > -1 && n.indexOf("NokiaBrowser/8.5.0") > -1 ? !1 : !0
        }
        var s = e("<body>").prependTo("html"),
            o = s[0].style,
            u = ["Webkit", "Moz", "O"],
            a = "palmGetResource" in t,
            f = t.opera,
            l = t.operamini && {}.toString.call(t.operamini) === "[object OperaMini]",
            c = t.blackberry && !i("-webkit-transform");
        e.extend(e.mobile, {
            browser: {}
        }), e.mobile.browser.oldIE = function() {
            var e = 3,
                t = n.createElement("div"),
                r = t.all || [];
            do t.innerHTML = "<!--[if gt IE " + ++e + "]><br><![endif]-->"; while (r[0]);
            return e > 4 ? e : !e
        }(), e.extend(e.support, {
            cssTransitions: "WebKitTransitionEvent" in t || h("transition", "height 100ms linear", ["Webkit", "Moz", ""]) && !e.mobile.browser.oldIE && !f,
            pushState: "pushState" in history && "replaceState" in history && !(t.navigator.userAgent.indexOf("Firefox") >= 0 && t.top !== t) && t.navigator.userAgent.search(/CriOS/) === -1,
            mediaquery: e.mobile.media("only all"),
            cssPseudoElement: !!i("content"),
            touchOverflow: !!i("overflowScrolling"),
            cssTransform3d: p(),
            boxShadow: !!i("boxShadow") && !c,
            fixedPosition: g(),
            scrollTop: ("pageXOffset" in t || "scrollTop" in n.documentElement || "scrollTop" in s[0]) && !a && !l,
            dynamicBaseTag: d(),
            cssPointerEvents: v(),
            boundingRect: m()
        }), s.remove();
        var y = function() {
            var e = t.navigator.userAgent;
            return e.indexOf("Nokia") > -1 && (e.indexOf("Symbian/3") > -1 || e.indexOf("Series60/5") > -1) && e.indexOf("AppleWebKit") > -1 && e.match(/(BrowserNG|NokiaBrowser)\/7\.[0-3]/)
        }();
        e.mobile.gradeA = function() {
            return (e.support.mediaquery || e.mobile.browser.oldIE && e.mobile.browser.oldIE >= 7) && (e.support.boundingRect || e.fn.jquery.match(/1\.[0-7+]\.[0-9+]?/) !== null)
        }, e.mobile.ajaxBlacklist = t.blackberry && !t.WebKitPoint || l || y, y && e(function() {
            e("head link[rel='stylesheet']").attr("rel", "alternate stylesheet").attr("rel", "stylesheet")
        }), e.support.boxShadow || e("html").addClass("ui-mobile-nosupport-boxshadow")
    }(e),
    function(e, t) {
        var n = e.mobile.window,
            r, i;
        e.event.special.navigate = r = {
            bound: !1,
            pushStateEnabled: !0,
            originalEventName: t,
            isPushStateEnabled: function() {
                return e.support.pushState && e.mobile.pushStateEnabled === !0 && this.isHashChangeEnabled()
            },
            isHashChangeEnabled: function() {
                return e.mobile.hashListeningEnabled === !0
            },
            popstate: function(t) {
                var r = new e.Event("navigate"),
                    i = new e.Event("beforenavigate"),
                    s = t.originalEvent.state || {},
                    o = location.href;
                n.trigger(i);
                if (i.isDefaultPrevented()) return;
                t.historyState && e.extend(s, t.historyState), r.originalEvent = t, setTimeout(function() {
                    n.trigger(r, {
                        state: s
                    })
                }, 0)
            },
            hashchange: function(t, r) {
                var i = new e.Event("navigate"),
                    s = new e.Event("beforenavigate");
                n.trigger(s);
                if (s.isDefaultPrevented()) return;
                i.originalEvent = t, n.trigger(i, {
                    state: t.hashchangeState || {}
                })
            },
            setup: function(e, t) {
                if (r.bound) return;
                r.bound = !0, r.isPushStateEnabled() ? (r.originalEventName = "popstate", n.bind("popstate.navigate", r.popstate)) : r.isHashChangeEnabled() && (r.originalEventName = "hashchange", n.bind("hashchange.navigate", r.hashchange))
            }
        }
    }(e),
    function(e) {
        e.event.special.throttledresize = {
            setup: function() {
                e(this).bind("resize", n)
            },
            teardown: function() {
                e(this).unbind("resize", n)
            }
        };
        var t = 250,
            n = function() {
                s = (new Date).getTime(), o = s - r, o >= t ? (r = s, e(this).trigger("throttledresize")) : (i && clearTimeout(i), i = setTimeout(n, t - o))
            },
            r = 0,
            i, s, o
    }(e),
    function(e, t) {
        function d() {
            var e = o();
            e !== u && (u = e, r.trigger(i))
        }
        var r = e(t),
            i = "orientationchange",
            s, o, u, a, f, l = {
                0: !0,
                180: !0
            };
        if (e.support.orientation) {
            var c = t.innerWidth || r.width(),
                h = t.innerHeight || r.height(),
                p = 50;
            a = c > h && c - h > p, f = l[t.orientation];
            if (a && f || !a && !f) l = {
                "-90": !0,
                90: !0
            }
        }
        e.event.special.orientationchange = e.extend({}, e.event.special.orientationchange, {
            setup: function() {
                if (e.support.orientation && !e.event.special.orientationchange.disabled) return !1;
                u = o(), r.bind("throttledresize", d)
            },
            teardown: function() {
                if (e.support.orientation && !e.event.special.orientationchange.disabled) return !1;
                r.unbind("throttledresize", d)
            },
            add: function(e) {
                var t = e.handler;
                e.handler = function(e) {
                    return e.orientation = o(), t.apply(this, arguments)
                }
            }
        }), e.event.special.orientationchange.orientation = o = function() {
            var r = !0,
                i = n.documentElement;
            return e.support.orientation ? r = l[t.orientation] : r = i && i.clientWidth / i.clientHeight < 1.1, r ? "portrait" : "landscape"
        }, e.fn[i] = function(e) {
            return e ? this.bind(i, e) : this.trigger(i)
        }, e.attrFn && (e.attrFn[i] = !0)
    }(e, this),
    function(e, t, n, r) {
        function x(e) {
            while (e && typeof e.originalEvent != "undefined") e = e.originalEvent;
            return e
        }

        function T(t, n) {
            var i = t.type,
                s, o, a, l, c, h, p, d, v;
            t = e.Event(t), t.type = n, s = t.originalEvent, o = e.event.props, i.search(/^(mouse|click)/) > -1 && (o = f);
            if (s)
                for (p = o.length, l; p;) l = o[--p], t[l] = s[l];
            i.search(/mouse(down|up)|click/) > -1 && !t.which && (t.which = 1);
            if (i.search(/^touch/) !== -1) {
                a = x(s), i = a.touches, c = a.changedTouches, h = i && i.length ? i[0] : c && c.length ? c[0] : r;
                if (h)
                    for (d = 0, v = u.length; d < v; d++) l = u[d], t[l] = h[l]
            }
            return t
        }

        function N(t) {
            var n = {},
                r, s;
            while (t) {
                r = e.data(t, i);
                for (s in r) r[s] && (n[s] = n.hasVirtualBinding = !0);
                t = t.parentNode
            }
            return n
        }

        function C(t, n) {
            var r;
            while (t) {
                r = e.data(t, i);
                if (r && (!n || r[n])) return t;
                t = t.parentNode
            }
            return null
        }

        function k() {
            g = !1
        }

        function L() {
            g = !0
        }

        function A() {
            E = 0, v.length = 0, m = !1, L()
        }

        function O() {
            k()
        }

        function M() {
            _(), c = setTimeout(function() {
                c = 0, A()
            }, e.vmouse.resetTimerDuration)
        }

        function _() {
            c && (clearTimeout(c), c = 0)
        }

        function D(t, n, r) {
            var i;
            if (r && r[t] || !r && C(n.target, t)) i = T(n, t), e(n.target).trigger(i);
            return i
        }

        function P(t) {
            var n = e.data(t.target, s);
            if (!m && (!E || E !== n)) {
                var r = D("v" + t.type, t);
                r && (r.isDefaultPrevented() && t.preventDefault(), r.isPropagationStopped() && t.stopPropagation(), r.isImmediatePropagationStopped() && t.stopImmediatePropagation())
            }
        }

        function H(t) {
            var n = x(t).touches,
                r, i;
            if (n && n.length === 1) {
                r = t.target, i = N(r);
                if (i.hasVirtualBinding) {
                    E = w++, e.data(r, s, E), _(), O(), d = !1;
                    var o = x(t).touches[0];
                    h = o.pageX, p = o.pageY, D("vmouseover", t, i), D("vmousedown", t, i)
                }
            }
        }

        function B(e) {
            if (g) return;
            d || D("vmousecancel", e, N(e.target)), d = !0, M()
        }

        function j(t) {
            if (g) return;
            var n = x(t).touches[0],
                r = d,
                i = e.vmouse.moveDistanceThreshold,
                s = N(t.target);
            d = d || Math.abs(n.pageX - h) > i || Math.abs(n.pageY - p) > i, d && !r && D("vmousecancel", t, s), D("vmousemove", t, s), M()
        }

        function F(e) {
            if (g) return;
            L();
            var t = N(e.target),
                n;
            D("vmouseup", e, t);
            if (!d) {
                var r = D("vclick", e, t);
                r && r.isDefaultPrevented() && (n = x(e).changedTouches[0], v.push({
                    touchID: E,
                    x: n.clientX,
                    y: n.clientY
                }), m = !0)
            }
            D("vmouseout", e, t), d = !1, M()
        }

        function I(t) {
            var n = e.data(t, i),
                r;
            if (n)
                for (r in n)
                    if (n[r]) return !0;
            return !1
        }

        function q() {}

        function R(t) {
            var n = t.substr(1);
            return {
                setup: function(r, s) {
                    I(this) || e.data(this, i, {});
                    var o = e.data(this, i);
                    o[t] = !0, l[t] = (l[t] || 0) + 1, l[t] === 1 && b.bind(n, P), e(this).bind(n, q), y && (l.touchstart = (l.touchstart || 0) + 1, l.touchstart === 1 && b.bind("touchstart", H).bind("touchend", F).bind("touchmove", j).bind("scroll", B))
                },
                teardown: function(r, s) {
                    --l[t], l[t] || b.unbind(n, P), y && (--l.touchstart, l.touchstart || b.unbind("touchstart", H).unbind("touchmove", j).unbind("touchend", F).unbind("scroll", B));
                    var o = e(this),
                        u = e.data(this, i);
                    u && (u[t] = !1), o.unbind(n, q), I(this) || o.removeData(i)
                }
            }
        }
        var i = "virtualMouseBindings",
            s = "virtualTouchID",
            o = "vmouseover vmousedown vmousemove vmouseup vclick vmouseout vmousecancel".split(" "),
            u = "clientX clientY pageX pageY screenX screenY".split(" "),
            a = e.event.mouseHooks ? e.event.mouseHooks.props : [],
            f = e.event.props.concat(a),
            l = {},
            c = 0,
            h = 0,
            p = 0,
            d = !1,
            v = [],
            m = !1,
            g = !1,
            y = "addEventListener" in n,
            b = e(n),
            w = 1,
            E = 0,
            S;
        e.vmouse = {
            moveDistanceThreshold: 10,
            clickDistanceThreshold: 10,
            resetTimerDuration: 1500
        };
        for (var U = 0; U < o.length; U++) e.event.special[o[U]] = R(o[U]);
        y && n.addEventListener("click", function(t) {
            var n = v.length,
                r = t.target,
                i, o, u, a, f, l;
            if (n) {
                i = t.clientX, o = t.clientY, S = e.vmouse.clickDistanceThreshold, u = r;
                while (u) {
                    for (a = 0; a < n; a++) {
                        f = v[a], l = 0;
                        if (u === r && Math.abs(f.x - i) < S && Math.abs(f.y - o) < S || e.data(u, s) === f.touchID) {
                            t.preventDefault(), t.stopPropagation();
                            return
                        }
                    }
                    u = u.parentNode
                }
            }
        }, !0)
    }(e, t, n),
    function(e, t, r) {
        function l(t, n, r) {
            var i = r.type;
            r.type = n, e.event.dispatch.call(t, r), r.type = i
        }
        var i = e(n);
        e.each("touchstart touchmove touchend tap taphold swipe swipeleft swiperight scrollstart scrollstop".split(" "), function(t, n) {
            e.fn[n] = function(e) {
                return e ? this.bind(n, e) : this.trigger(n)
            }, e.attrFn && (e.attrFn[n] = !0)
        });
        var s = e.mobile.support.touch,
            o = "touchmove scroll",
            u = s ? "touchstart" : "mousedown",
            a = s ? "touchend" : "mouseup",
            f = s ? "touchmove" : "mousemove";
        e.event.special.scrollstart = {
            enabled: !0,
            setup: function() {
                function s(e, n) {
                    r = n, l(t, r ? "scrollstart" : "scrollstop", e)
                }
                var t = this,
                    n = e(t),
                    r, i;
                n.bind(o, function(t) {
                    if (!e.event.special.scrollstart.enabled) return;
                    r || s(t, !0), clearTimeout(i), i = setTimeout(function() {
                        s(t, !1)
                    }, 50)
                })
            }
        }, e.event.special.tap = {
            tapholdThreshold: 750,
            setup: function() {
                var t = this,
                    n = e(t);
                n.bind("vmousedown", function(r) {
                    function a() {
                        clearTimeout(u)
                    }

                    function f() {
                        a(), n.unbind("vclick", c).unbind("vmouseup", a), i.unbind("vmousecancel", f)
                    }

                    function c(e) {
                        f(), s === e.target && l(t, "tap", e)
                    }
                    if (r.which && r.which !== 1) return !1;
                    var s = r.target,
                        o = r.originalEvent,
                        u;
                    n.bind("vmouseup", a).bind("vclick", c), i.bind("vmousecancel", f), u = setTimeout(function() {
                        l(t, "taphold", e.Event("taphold", {
                            target: s
                        }))
                    }, e.event.special.tap.tapholdThreshold)
                })
            }
        }, e.event.special.swipe = {
            scrollSupressionThreshold: 30,
            durationThreshold: 1e3,
            horizontalDistanceThreshold: 30,
            verticalDistanceThreshold: 75,
            start: function(t) {
                var n = t.originalEvent.touches ? t.originalEvent.touches[0] : t;
                return {
                    time: (new Date).getTime(),
                    coords: [n.pageX, n.pageY],
                    origin: e(t.target)
                }
            },
            stop: function(e) {
                var t = e.originalEvent.touches ? e.originalEvent.touches[0] : e;
                return {
                    time: (new Date).getTime(),
                    coords: [t.pageX, t.pageY]
                }
            },
            handleSwipe: function(t, n) {
                n.time - t.time < e.event.special.swipe.durationThreshold && Math.abs(t.coords[0] - n.coords[0]) > e.event.special.swipe.horizontalDistanceThreshold && Math.abs(t.coords[1] - n.coords[1]) < e.event.special.swipe.verticalDistanceThreshold && t.origin.trigger("swipe").trigger(t.coords[0] > n.coords[0] ? "swipeleft" : "swiperight")
            },
            setup: function() {
                var t = this,
                    n = e(t);
                n.bind(u, function(t) {
                    function o(t) {
                        if (!i) return;
                        s = e.event.special.swipe.stop(t), Math.abs(i.coords[0] - s.coords[0]) > e.event.special.swipe.scrollSupressionThreshold && t.preventDefault()
                    }
                    var i = e.event.special.swipe.start(t),
                        s;
                    n.bind(f, o).one(a, function() {
                        n.unbind(f, o), i && s && e.event.special.swipe.handleSwipe(i, s), i = s = r
                    })
                })
            }
        }, e.each({
            scrollstop: "scrollstart",
            taphold: "tap",
            swipeleft: "swipe",
            swiperight: "swipe"
        }, function(t, n) {
            e.event.special[t] = {
                setup: function() {
                    e(this).bind(n, e.noop)
                }
            }
        })
    }(e, this),
    function(e, t) {
        var n = 0,
            r = Array.prototype.slice,
            i = e.cleanData;
        e.cleanData = function(t) {
            for (var n = 0, r;
                (r = t[n]) != null; n++) try {
                e(r).triggerHandler("remove")
            } catch (s) {}
            i(t)
        }, e.widget = function(t, n, r) {
            var i, s, o, u, a = t.split(".")[0];
            t = t.split(".")[1], i = a + "-" + t, r || (r = n, n = e.Widget), e.expr[":"][i.toLowerCase()] = function(t) {
                return !!e.data(t, i)
            }, e[a] = e[a] || {}, s = e[a][t], o = e[a][t] = function(e, t) {
                if (!this._createWidget) return new o(e, t);
                arguments.length && this._createWidget(e, t)
            }, e.extend(o, s, {
                version: r.version,
                _proto: e.extend({}, r),
                _childConstructors: []
            }), u = new n, u.options = e.widget.extend({}, u.options), e.each(r, function(t, i) {
                e.isFunction(i) && (r[t] = function() {
                    var e = function() {
                            return n.prototype[t].apply(this, arguments)
                        },
                        r = function(e) {
                            return n.prototype[t].apply(this, e)
                        };
                    return function() {
                        var t = this._super,
                            n = this._superApply,
                            s;
                        return this._super = e, this._superApply = r, s = i.apply(this, arguments), this._super = t, this._superApply = n, s
                    }
                }())
            }), o.prototype = e.widget.extend(u, {
                widgetEventPrefix: s ? u.widgetEventPrefix : t
            }, r, {
                constructor: o,
                namespace: a,
                widgetName: t,
                widgetFullName: i
            }), s ? (e.each(s._childConstructors, function(t, n) {
                var r = n.prototype;
                e.widget(r.namespace + "." + r.widgetName, o, n._proto)
            }), delete s._childConstructors) : n._childConstructors.push(o), e.widget.bridge(t, o)
        }, e.widget.extend = function(n) {
            var i = r.call(arguments, 1),
                s = 0,
                o = i.length,
                u, a;
            for (; s < o; s++)
                for (u in i[s]) a = i[s][u], i[s].hasOwnProperty(u) && a !== t && (e.isPlainObject(a) ? n[u] = e.isPlainObject(n[u]) ? e.widget.extend({}, n[u], a) : e.widget.extend({}, a) : n[u] = a);
            return n
        }, e.widget.bridge = function(n, i) {
            var s = i.prototype.widgetFullName || n;
            e.fn[n] = function(o) {
                var u = typeof o == "string",
                    a = r.call(arguments, 1),
                    f = this;
                return o = !u && a.length ? e.widget.extend.apply(null, [o].concat(a)) : o, u ? this.each(function() {
                    var r, i = e.data(this, s);
                    if (!i) return e.error("cannot call methods on " + n + " prior to initialization; " + "attempted to call method '" + o + "'");
                    if (!e.isFunction(i[o]) || o.charAt(0) === "_") return e.error("no such method '" + o + "' for " + n + " widget instance");
                    r = i[o].apply(i, a);
                    if (r !== i && r !== t) return f = r && r.jquery ? f.pushStack(r.get()) : r, !1
                }) : this.each(function() {
                    var t = e.data(this, s);
                    t ? t.option(o || {})._init() : e.data(this, s, new i(o, this))
                }), f
            }
        }, e.Widget = function() {}, e.Widget._childConstructors = [], e.Widget.prototype = {
            widgetName: "widget",
            widgetEventPrefix: "",
            defaultElement: "<div>",
            options: {
                disabled: !1,
                create: null
            },
            _createWidget: function(t, r) {
                r = e(r || this.defaultElement || this)[0], this.element = e(r), this.uuid = n++, this.eventNamespace = "." + this.widgetName + this.uuid, this.options = e.widget.extend({}, this.options, this._getCreateOptions(), t), this.bindings = e(), this.hoverable = e(), this.focusable = e(), r !== this && (e.data(r, this.widgetFullName, this), this._on(!0, this.element, {
                    remove: function(e) {
                        e.target === r && this.destroy()
                    }
                }), this.document = e(r.style ? r.ownerDocument : r.document || r), this.window = e(this.document[0].defaultView || this.document[0].parentWindow)), this._create(), this._trigger("create", null, this._getCreateEventData()), this._init()
            },
            _getCreateOptions: e.noop,
            _getCreateEventData: e.noop,
            _create: e.noop,
            _init: e.noop,
            destroy: function() {
                this._destroy(), this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData(e.camelCase(this.widgetFullName)), this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName + "-disabled " + "ui-state-disabled"), this.bindings.unbind(this.eventNamespace), this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus")
            },
            _destroy: e.noop,
            widget: function() {
                return this.element
            },
            option: function(n, r) {
                var i = n,
                    s, o, u;
                if (arguments.length === 0) return e.widget.extend({}, this.options);
                if (typeof n == "string") {
                    i = {}, s = n.split("."), n = s.shift();
                    if (s.length) {
                        o = i[n] = e.widget.extend({}, this.options[n]);
                        for (u = 0; u < s.length - 1; u++) o[s[u]] = o[s[u]] || {}, o = o[s[u]];
                        n = s.pop();
                        if (r === t) return o[n] === t ? null : o[n];
                        o[n] = r
                    } else {
                        if (r === t) return this.options[n] === t ? null : this.options[n];
                        i[n] = r
                    }
                }
                return this._setOptions(i), this
            },
            _setOptions: function(e) {
                var t;
                for (t in e) this._setOption(t, e[t]);
                return this
            },
            _setOption: function(e, t) {
                return this.options[e] = t, e === "disabled" && (this.widget().toggleClass(this.widgetFullName + "-disabled ui-state-disabled", !!t).attr("aria-disabled", t), this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus")), this
            },
            enable: function() {
                return this._setOption("disabled", !1)
            },
            disable: function() {
                return this._setOption("disabled", !0)
            },
            _on: function(t, n, r) {
                var i, s = this;
                typeof t != "boolean" && (r = n, n = t, t = !1), r ? (n = i = e(n), this.bindings = this.bindings.add(n)) : (r = n, n = this.element, i = this.widget()), e.each(r, function(r, o) {
                    function u() {
                        if (!t && (s.options.disabled === !0 || e(this).hasClass("ui-state-disabled"))) return;
                        return (typeof o == "string" ? s[o] : o).apply(s, arguments)
                    }
                    typeof o != "string" && (u.guid = o.guid = o.guid || u.guid || e.guid++);
                    var a = r.match(/^(\w+)\s*(.*)$/),
                        f = a[1] + s.eventNamespace,
                        l = a[2];
                    l ? i.delegate(l, f, u) : n.bind(f, u)
                })
            },
            _off: function(e, t) {
                t = (t || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace, e.unbind(t).undelegate(t)
            },
            _delay: function(e, t) {
                function n() {
                    return (typeof e == "string" ? r[e] : e).apply(r, arguments)
                }
                var r = this;
                return setTimeout(n, t || 0)
            },
            _hoverable: function(t) {
                this.hoverable = this.hoverable.add(t), this._on(t, {
                    mouseenter: function(t) {
                        e(t.currentTarget).addClass("ui-state-hover")
                    },
                    mouseleave: function(t) {
                        e(t.currentTarget).removeClass("ui-state-hover")
                    }
                })
            },
            _focusable: function(t) {
                this.focusable = this.focusable.add(t), this._on(t, {
                    focusin: function(t) {
                        e(t.currentTarget).addClass("ui-state-focus")
                    },
                    focusout: function(t) {
                        e(t.currentTarget).removeClass("ui-state-focus")
                    }
                })
            },
            _trigger: function(t, n, r) {
                var i, s, o = this.options[t];
                r = r || {}, n = e.Event(n), n.type = (t === this.widgetEventPrefix ? t : this.widgetEventPrefix + t).toLowerCase(), n.target = this.element[0], s = n.originalEvent;
                if (s)
                    for (i in s) i in n || (n[i] = s[i]);
                return this.element.trigger(n, r), !(e.isFunction(o) && o.apply(this.element[0], [n].concat(r)) === !1 || n.isDefaultPrevented())
            }
        }, e.each({
            show: "fadeIn",
            hide: "fadeOut"
        }, function(t, n) {
            e.Widget.prototype["_" + t] = function(r, i, s) {
                typeof i == "string" && (i = {
                    effect: i
                });
                var o, u = i ? i === !0 || typeof i == "number" ? n : i.effect || n : t;
                i = i || {}, typeof i == "number" && (i = {
                    duration: i
                }), o = !e.isEmptyObject(i), i.complete = s, i.delay && r.delay(i.delay), o && e.effects && e.effects.effect[u] ? r[t](i) : u !== t && r[u] ? r[u](i.duration, i.easing, s) : r.queue(function(n) {
                    e(this)[t](), s && s.call(r[0]), n()
                })
            }
        })
    }(e),
    function(e, t) {
        e.widget("mobile.widget", {
            _createWidget: function() {
                e.Widget.prototype._createWidget.apply(this, arguments), this._trigger("init")
            },
            _getCreateOptions: function() {
                var n = this.element,
                    r = {};
                return e.each(this.options, function(e) {
                    var i = n.jqmData(e.replace(/[A-Z]/g, function(e) {
                        return "-" + e.toLowerCase()
                    }));
                    i !== t && (r[e] = i)
                }), r
            },
            enhanceWithin: function(t, n) {
                this.enhance(e(this.options.initSelector, e(t)), n)
            },
            enhance: function(t, n) {
                var r, i, s = e(t),
                    o = this;
                s = e.mobile.enhanceable(s), n && s.length && (r = e.mobile.closestPageData(s), i = r && r.keepNativeSelector() || "", s = s.not(i)), s[this.widgetName]()
            },
            raise: function(e) {
                throw "Widget [" + this.widgetName + "]: " + e
            }
        })
    }(e),
    function(e, t) {
        e.widget("mobile.page", e.mobile.widget, {
            options: {
                theme: "c",
                domCache: !1,
                keepNativeDefault: ":jqmData(role='none'), :jqmData(role='nojs')"
            },
            _create: function() {
                if (this._trigger("beforecreate") === !1) return !1;
                this.element.attr("tabindex", "0").addClass("ui-page ui-body-" + this.options.theme), this._on(this.element, {
                    pagebeforehide: "removeContainerBackground",
                    pagebeforeshow: "_handlePageBeforeShow"
                })
            },
            _handlePageBeforeShow: function(e) {
                this.setContainerBackground()
            },
            removeContainerBackground: function() {
                e.mobile.pageContainer.removeClass("ui-overlay-" + e.mobile.getInheritedTheme(this.element.parent()))
            },
            setContainerBackground: function(t) {
                this.options.theme && e.mobile.pageContainer.addClass("ui-overlay-" + (t || this.options.theme))
            },
            keepNativeSelector: function() {
                var t = this.options,
                    n = t.keepNative && e.trim(t.keepNative);
                return n && t.keepNative !== t.keepNativeDefault ? [t.keepNative, t.keepNativeDefault].join(", ") : t.keepNativeDefault
            }
        })
    }(e),
    function(e, t) {
        e.mobile.page.prototype.options.backBtnText = "Back", e.mobile.page.prototype.options.addBackBtn = !1, e.mobile.page.prototype.options.backBtnTheme = null, e.mobile.page.prototype.options.headerTheme = "a", e.mobile.page.prototype.options.footerTheme = "a", e.mobile.page.prototype.options.contentTheme = null, e.mobile.document.bind("pagecreate", function(t) {
            var n = e(t.target),
                r = n.data("mobile-page").options,
                i = n.jqmData("role"),
                s = r.theme;
            e(":jqmData(role='header'), :jqmData(role='footer'), :jqmData(role='content')", n).jqmEnhanceable().each(function() {
                var t = e(this),
                    u = t.jqmData("role"),
                    a = t.jqmData("theme"),
                    f = a || r.contentTheme || i === "dialog" && s,
                    l, c, h, p;
                t.addClass("ui-" + u);
                if (u === "header" || u === "footer") {
                    var d = a || (u === "header" ? r.headerTheme : r.footerTheme) || s;
                    t.addClass("ui-bar-" + d).attr("role", u === "header" ? "banner" : "contentinfo"), u === "header" && (l = t.children("a, button"), c = l.hasClass("ui-btn-left"), h = l.hasClass("ui-btn-right"), c = c || l.eq(0).not(".ui-btn-right").addClass("ui-btn-left").length, h = h || l.eq(1).addClass("ui-btn-right").length), r.addBackBtn && u === "header" && e(".ui-page").length > 1 && n.jqmData("url") !== e.mobile.path.stripHash(location.hash) && !c && (p = e("<a href='javascript:void(0);' class='ui-btn-left' data-" + e.mobile.ns + "rel='back' data-" + e.mobile.ns + "icon='arrow-l'>" + r.backBtnText + "</a>").attr("data-" + e.mobile.ns + "theme", r.backBtnTheme || d).prependTo(t)), t.children("h1, h2, h3, h4, h5, h6").addClass("ui-title").attr({
                        role: "heading",
                        "aria-level": "1"
                    })
                } else u === "content" && (f && t.addClass("ui-body-" + f), t.attr("role", "main"))
            })
        })
    }(e)
});