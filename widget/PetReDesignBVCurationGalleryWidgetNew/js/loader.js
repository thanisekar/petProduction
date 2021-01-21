/*!
 * Copyright 2016 Bazaarvoice
 * Created: Mon Jan 29 2018 22:53:48 GMT+0000 (UTC)
 * Version: 1.56.0
 * SHA: 1e0952e
 */
define(
    ['jquery'],

function ($) {
!function(e) {
    function t(i) {
        if(o[i])return o[i].exports;
        var n=o[i]= {
            exports: {}
            ,
            id: i, loaded: !1
        }
        ;
        return e[i].call(n.exports, n, n.exports, t),
        n.loaded=!0,
        n.exports
    }
    var o= {}
    ;
    return t.m=e,
    t.c=o,
    t.p="",
    t(0)
}

([function(e, t, o) {
    e.exports=o(1)
}

, function(e, t, o) {
    "use strict";
    var i=o(2);
    try {
        o(5)
    }
    catch(n) {
        console&&console.error?console.error("Failed to load module `loader`", n.message):setTimeout(function() {
            throw n
        }
        , 0)
    }
    e.exports=i
}

, function(e, t, o) {
    "use strict";
    var i=o(3);
    e.exports=i.namespace("APP")
}

, function(e, t, o) {
    function i(e) {
        this.name=e
    }
    var n=o(4);
    i.prototype.registerProperty=function(e, t) {
        if(this.hasOwnProperty(e))throw new Error("Cannot register "+e+" because a property with that name already exists on window."+this.name);
        return this[e]=t, this
    }
    , e.exports= {
        namespace:function(e) {
            if(void 0===n[e])n[e]=new i(e);
            else {
                if("object"!=typeof n[e])throw new Error("Namespace "+e+" cannot be created. A non-object variable is already assigned to window."+e);
                if(!(n[e]instanceof i)) {
                    i.call(n[e], e);
                    for(var t in i.prototype)n[e][t]=i.prototype[t]
                }
            }
            return n[e]
        }
    }
}

, function(e, t) {
    "use strict";
    e.exports=new Function("return this;")()
}

, function(e, t, o) {
    var i, n=o(6), a=o(8), r=o(9), s=n.loadScript, l=n.loadStyleSheet, c=window.BV|| {}
    ;
    window.BV_WIDGET_CONFIG||(window.BVWidgets=function() {
        function e(e) {
            if(t.isLoaded)return t.log("clientAPICallback was called, but Curations is already loaded"), !0;
            var o=e.config, i=e.productId||(o?o.productId: null), n=e.categoryId||(o?o.categoryId: null);
            return i?(t.display( {
                productId: i
            }
            ), t.log("Curations loaded via zero IT with productId", i), !0):n?(t.display( {
                categoryId: n
            }
            ), t.log("Curations loaded via zero IT with categoryId", n), !0):(t.log("clientAPICallback was called, but did not find productID or categoryId"), !1)
        }
        var t= {
            _version: a.version, _sha: a.sha, _buildDate: a.date, _initialCall: Date.now(), isLoaded: !1, activeWidgets: []
        }
        , o=a.baseUrl+"/scripts/main.min.js", n=a.baseUrl+"/styles/main.css";
        if(window.BV_WIDGET_CONFIG=a.configData, window.FM_PROXY_URL=a.proxyUrl, window.BV_UPLOAD_URL="https://submit.curations.bazaarvoice.com/", t._log=[], t.log=function() {
            t._log.push(Array.prototype.slice.call(arguments))
        }
        , t.log("Curations loader version", window.BV_WIDGET_CONFIG.Version), t.display=function(e, i) {
            if(this.log("BVWidgets.display called with config:", e), t._displayConfig=e, e||(e= {}
            ), t.isLoaded)this.log("BVWidgets.display already called, doing nothing.");
            else {
                t.isLoaded=!0;
                for(var a in e)e.hasOwnProperty(a)&&(window.BV_WIDGET_CONFIG.GlobalConfigs[a]=e[a]);
                window.$FM||(l(n, {
                    attributes: {
                        id: "BV-carousel-style"
                    }
                }
                ), s(o))
            }
            "function"==typeof i&&i()
        }
        , c.extensions) {
            for(var r=0;
            r<c.options.externalFeatures.length;
            r++)"curations"===c.options.externalFeatures[r].name&&(i=!0);
            if(!i)return t.log("Curations found Conversations, but will not use its configuration because the customer is not set up for zero IT."), t;
            !function() {
                t.log("Curations is hooking in to Conversations integration.");
                var o=window.BV.extensions.configure.get("global"), i=window.BV.extensions.ui.get("rr_show_reviews"), n=!1, a=o.getEvents("call"), r=i.getEvents("call");
                a.length&&(n=e(a[0])), !n&&r.length&&(n=e(r[0])), n||(o.on("call", e), i.on("call", e))
            }
            ()
        }
        return t
    }
    (), window.BVWidgets._ie=r, window.bvCarousel=BVWidgets)
}

, function(e, t, o) {
    "use strict";
    e.exports=o(7)
}

, function(e, t, o) {
    function i() {
        return l.getElementsByTagName("script")[0]
    }
    function n(e) {
        return!e||"loaded"===e||"complete"===e||"uninitialized"===e
    }
    function a(e, t, o) {
        if(!e||"string"!=typeof e)throw new Error("`url` must be a string");
        if(t.namespaceName&&"string"!=typeof t.namespaceName)throw new Error("`options.namespaceName` must be a string");
        if(t.forceLoad&&"boolean"!=typeof t.forceLoad)throw new Error("`options.forceLoad` must be a boolean");
        if("number"!=typeof t.timeout)throw new Error("`options.timeout` must be a number");
        if(o&&"function"!=typeof o)throw new Error("`callback` must be a function")
    }
    var r=o(4), s=o(3), l=r.document, c=1e4, d= {}
    ;
    e.exports= {
        _clearLoadedUrls:function(e) {
            if(e) {
                var t=s.namespace(e);
                t.loadedUrls= {}
            }
            else d= {}
        }
        , loadScript:function(e, t, o) {
            function r(i) {
                f=!0, clearTimeout(w), h.onload=h.onreadystatechange=h.onerror=null, h.parentNode.removeChild(h), i||(p[e]=!0, t.namespaceName?m.loadedUrls=p: d=p), "function"==typeof o&&o(i)
            }
            var m, p=d;
            if("function"==typeof t&&(o=t, t=null), t=t|| {}
            , t.timeout=t.timeout||c, a(e, t, o), t.namespaceName&&(m=s.namespace(t.namespaceName), p=m.loadedUrls|| {}
            ), !t.forceLoad&&p[e])return void("function"==typeof o&&o());
            var u, h=l.createElement("script"), f=!1;
            if(t.attributes)for(u in t.attributes)h.setAttribute(u, t.attributes[u]);
            h.onreadystatechange=h.onload=function() {
                !f&&n(h.readyState)&&r()
            }
            , h.onerror=function() {
                f||r(new Error("Error: could not load "+e))
            }
            ;
            var w=setTimeout(function() {
                f||r(new Error("Error: script timeout "+e))
            }
            , t.timeout);
            setTimeout(function() {
                h.src=e;
                var t=i();
                t.parentNode.insertBefore(h, t)
            }
            , 0)
        }
        , loadStyleSheet:function(e, t, o) {
            function m(i) {
                w=!0, clearTimeout(g), f.onload=f.onreadystatechange=f.onerror=null, i||(u[e]=!0, t.namespaceName?p.loadedUrls=u: d=u), "function"==typeof o&&o(i)
            }
            var p, u=d;
            if("function"==typeof t&&(o=t, t=null), t=t|| {}
            , t.timeout=t.timeout||c, a(e, t, o), "injectionNode"in t&&!(t.injectionNode instanceof r.Element))throw new Error("`options.injectionNode` must be a DOM node");
            if(t.namespaceName&&(p=s.namespace(t.namespaceName), u=p.loadedUrls|| {}
            ), !t.forceLoad&&u[e])return void("function"==typeof o&&o());
            var h, f=l.createElement("link"), w=!1;
            if(t.attributes)for(h in t.attributes)f.setAttribute(h, t.attributes[h]);
            f.onreadystatechange=f.onload=function() {
                !w&&n(f.readyState)&&m()
            }
            , f.onerror=function() {
                w||m(new Error("Error: could not load "+e))
            }
            ;
            var g=setTimeout(f.onerror, t.timeout);
            setTimeout(function() {
                f.media="only x", f.rel="stylesheet", f.type="text/css", f.href=e, setTimeout(function() {
                    f.media="all"
                }
                , 0);
                var o=t.injectionNode||i().parentNode;
                try {
                    o.appendChild(f)
                }
                catch(n) {
                    m(new Error("Error: could not append LINK element"))
                }
            }
            , 0)
        }
    }
}

, function(e, t, o) {
    "use strict";
    e.exports= {
        baseUrl:"//static.curations.bazaarvoice.com/gallery/petmate/prod/2018-04-04T15.59.47.407Z", proxyUrl:"https://api.bazaarvoice.com/curations/c3/", uploadUrl:"", configData: {
            GlobalConfigs: {
                client:"petmate", host:"c3", apikey:"uvbnwc7w7fjtk5cv6ybrbs58", tpAnalytics: {
                    events: {
                        pageview: 'var $wrapper = $(\'<div class="bv-grid-header-wrapper" />\'); var container = $FM.$(\'#bv-grid-gallery\'); $(\'<span class="bv-grid-title"><span class="bv-grid-title-left">Bark, Meow, or Tweet. #petmate</span><br><span class="bv-grid-title-second-line">Share your proud pet-parent moments.</span></span>\').appendTo($wrapper); container.before($wrapper);\n'
                    }
                }
                , environment:"production", widgetTypes: {
                    lightbox:[ {
                        theme: "minimalist", styles: "minimalist"
                    }
                    , {
                        theme: "minimalist", styles: "minimalist"
                    }
                    , {
                        theme: "minimalist", styles: "minimalist"
                    }
                    , {
                        theme: "minimalist", styles: "minimalist"
                    }
                    ], carousel:[ {
                        theme: "minimalist", styles: "minimalist"
                    }
                    , {
                        theme: "social", styles: "social"
                    }
                    , {
                        theme: "social", styles: "social"
                    }
                    ], grid:[ {
                        theme: "classic", styles: "classic"
                    }
                    ]
                }
            }
            , WidgetConfigs:[ {
                type:"grid", identifier:"MainGrid", container:"#bv-grid-gallery", theme_name:"classic", lightbox_theme_name:"minimalist", padding:0, initial_rows:2, cols:4, min_cols:1, load_more_text:"VIEW MORE", lightbox_settings: {
                    clamp_lines: 10
                }
                , sharing: {
                    description:"Found on petmate.com", source:"petmate Inspiration Gallery", networks:["facebook", "twitter", "pinterest"], facebook_app_id:842379599238520, label:"Share", social_text: {
                        pinterest: "Pin it", tweet: "Tweet", tw_reply: "Reply", tw_retweet: "Retweet", tw_favorite: "Favorite"
                    }
                }
                , shopnow: {
                    shopnow_enabled:!0, shopnow_text: {
                        header: "Shop This Product", lightbox_button: "Shop Now"
                    }
                }
                , direct_upload: {
                    enabled: !0, text: "Upload a photo"
                }
                , sources:[ {
                    type: "feed", featured: 4, display: ["homepage"], loop: !1, has_photo_or_video: !0
                }
                ], internalLightboxThemeNames: {
                    theme: "minimalist", styles: "minimalist"
                }
                , internalThemeNames: {
                    theme: "classic", styles: "classic"
                }
            }
            , {
                type:"carousel", identifier:"MainCarousel", container:"#bv-carousel", header_tagline:"Share Your Pet Moments", col_width:200, min_cols:3, hashtag:"petmate", theme_name:"social", lightbox_theme_name:"minimalist", padding:0, lightbox_settings: {
                    clamp_lines: 10
                }
                , sharing: {
                    description:"Share", source:"http://www.petmate.com", email_subject:"Look what I found on petmate.com", networks:["facebook", "twitter", "pinterest"], facebook_app_id:842379599238520, label:"Share", social_text: {
                        pinterest: "Found on Petmate.com", tweet: "Tweet", tw_reply: "Reply", tw_retweet: "Retweet", tw_favorite: "Favorite"
                    }
                }
                , shopnow: {
                    shopnow_enabled:!0, shopnow_text: {
                        header: "Shop This Product", lightbox_button: "Shop Now"
                    }
                }
                , direct_upload: {
                    enabled: !0, text: "Upload a photo"
                }
                , sources:[ {
                    type: "feed", display: ["homepage"], featured: 4, loop: !1, has_photo_or_video: !0
                }
                ], internalLightboxThemeNames: {
                    theme: "minimalist", styles: "minimalist"
                }
                , internalThemeNames: {
                    theme: "social", styles: "social"
                }
            }
            , {
                type:"carousel", identifier:"HomepageMainCarousel", container:"#bv-homepage-carousel", header_tagline:"Share Your Pet Moments", col_width:200, min_cols:3, hashtag:"petmate", theme_name:"social", lightbox_theme_name:"minimalist", padding:0, lightbox_settings: {
                    clamp_lines: 10
                }
                , sharing: {
                    description:"Share", source:"http://www.petmate.com", email_subject:"Look what I found on petmate.com", networks:["twitter", "pinterest"], label:"Share", social_text: {
                        pinterest: "Found on Petmate.com", tweet: "Tweet", tw_reply: "Reply", tw_retweet: "Retweet", tw_favorite: "Favorite"
                    }
                }
                , shopnow: {
                    shopnow_enabled:!0, shopnow_text: {
                        header: "Shop This Product", lightbox_button: "Shop Now"
                    }
                }
                , direct_upload: {
                    enabled: !0, text: "Upload a photo"
                }
                , sources:[ {
                    type: "feed", display: ["homepage"], featured: 4, loop: !1, has_photo_or_video: !0
                }
                ], internalLightboxThemeNames: {
                    theme: "minimalist", styles: "minimalist"
                }
                , internalThemeNames: {
                    theme: "social", styles: "social"
                }
            }
            , {
                type:"carousel", theme_name:"minimalist", lightbox_theme_name:"minimalist", internalLightboxThemeNames: {
                    theme: "minimalist", styles: "minimalist"
                }
                , internalThemeNames: {
                    theme: "minimalist", styles: "minimalist"
                }
            }
            ], Version:"2018-01-29T22.53.46.927Z"
        }
        , version:"1.56.0", sha:"1e0952e", date:"2018-01-29T22:53:48.140Z"
    }
}

, function(e, t, o) {
    "use strict";
    e.exports=o(10)
}

, function(e, t, o) {
    var i=o(4).document;
    e.exports=function() {
        var e=function(e, t, o) {
            for(var i=t.getElementsByTagName("i");
            t.innerHTML="<!--[if gt IE "+ ++e+"]><i></i><![endif]-->", i[0];
            );
            return e>4?e: o
        }
        (3, i.createElement("div"));
        return e
    }
    ()
}

]);
});