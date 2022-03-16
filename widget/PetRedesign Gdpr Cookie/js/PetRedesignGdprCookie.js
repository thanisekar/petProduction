define(

    //-------------------------------------------------------------------
    // DEPENDENCIES
    //-------------------------------------------------------------------
    ['knockout', 'pubsub', 'CCi18n', 'ccConstants',
        'https://cc.cdn.civiccomputing.com/9/cookieControl-9.x.min.js',
        'storageApi'
    ],

    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function(ko, pubsub, CCi18n, CCConstants, CC, storageApi) {
        "use strict";
        var necessaryCookies = [];
        return {
            widgetInitialised: ko.observable(false),
            onLoad: function(widget) {
                var apiKey = '9ae595277b923094bb73c2a7d64f9944d6431654';

                if (apiKey !== null) {
                    
                    // Main call to invoke Cookie Control, passing the configuration object we have
                    // set up. cookieControl object is established by the cookieControl-6.2.min.js
                    // file loaded in dependencies. Also subscribe to PAGE_CHANGED so we can manage
                    // the use of cookies if user has disallowed their use.
                    if (widget.site().requireGDPRCookieConsent) {
                        var config = {
                            apiKey: '9ae595277b923094bb73c2a7d64f9944d6431654',
                            product: 'PRO',
                            optionalCookies: [{
                                name: 'analytics',
                                label: 'Analytics',
                                description: 'Analytical cookies help  us to improve our website by collecting and reporting information on its usage.',
                                onAccept: this.onConsentAccept,
                                onRevoke: this.onConsentRevoke
                            }, {
                                name: 'marketing',
                                label: 'Marketing',
                                description: 'Marketing cookies help  us to improve our website by collecting and reporting information on its usage.',
                                onAccept: this.onConsentAccept,
                                onRevoke: this.onConsentRevoke
                            }],
                            necessaryCookies: ["JSESSIONID", "atgRecVisitorId", "oauth_token_secret-storefrontUI", "xdVisitorID"],
                            layout: 'slideout',
                            toggleType: 'slider',
                            position: 'RIGHT',
                            theme: 'LIGHT',
                            initialState: 'notify',
                            branding: {
                                //notifyBackgroundColor : "#2654bf",
                                //acceptBackground : "#2654bf",
                                fontColor: "#333",
                                backgroundColor: "#fff",
                                fontSizeTitle: "1.3em",
                                fontSizeIntro: "1.1em",
                                fontSizeHeaders: "1.1em",
                                fontSize: "0.9em",
                                toggleText: "#fff",
                                toggleColor: "#fff",
                                toggleBackground: "#2654bf",
                                buttonIcon: null,
                                buttonIconWidth: "640px",
                                buttonIconHeight: "64px",
                                removeIcon: false,
                                removeAbout: false
                            }
                        };


                        if (config) {
                            CookieControl.load(config);
                            $.Topic(pubsub.topicNames.PAGE_CHANGED).subscribe(this.pageChanged.bind(this));
                            //this.widgetInitialised(tre);
                        }
                    } else {
                        storageApi.getInstance().saveToCookies("GDPRCookieP13nConsentNotRequired", true, 365);
                        if (storageApi.getInstance().readFromCookies("GDPRCookieP13nConsentGranted") !== null) {
                            storageApi.getInstance().removeItem("GDPRCookieP13nConsentGranted");
                        }
                    }
                }
            },

            pageChanged: function(page) {
                if (this.widgetInitialised() && storageApi.getInstance().readFromCookies("GDPRCookieP13nConsentGranted") === null) {
                    CookieControl.deleteAll();
                }
            },
            onConsentAccept: function() {
                storageApi.getInstance().saveToCookies("GDPRCookieP13nConsentGranted", true, 365);
            },

            onConsentRevoke: function() {
                CookieControl.deleteAll();
            }
        };
    }
);