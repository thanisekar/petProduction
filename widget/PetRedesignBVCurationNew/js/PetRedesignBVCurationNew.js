/**
 * @fileoverview Petmate Bazaar Voice Curation.
 *
 * @author Taistech
 */
define(
    //-------------------------------------------------------------------
    // DEPENDENCIES
    // Adding knockout
    //-------------------------------------------------------------------
    ['jquery', 'knockout', 'spinner', 'CCi18n', 'pubsub', 'storageApi', 'ccResourceLoader!global/loader'],
    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function($, ko, spinner, CCi18n, t, c, storageApi, bazzarVoice) {
        "use strict";
        var getWidget = "";



        return {

            koBrandPage: ko.observable(),
            koDisplayProperty: ko.observable(''),
            koProductProperty: ko.observable(''),
            onLoad: function(widget) {


            },


            beforeAppear: function(page) {

                var widget = this;

                widget.koProductProperty('');

                //widget.koDisplayProperty('');
                var BvCallBackDestroy = setInterval(function() {
                    if (window.crl8 && window.crl8.ready) {
                        // window.crl8.ready fires the callback once the crl8 api is available for use on the page
                        if (widget.koDisplayProperty()) {
                                window.crl8.destroyExperience(widget.koDisplayProperty());
                        }
                        console.log('Check Leak');
                        window.clearInterval(BvCallBackDestroy);

                    }
                }, 100)

                
                setTimeout(function() {
                    var BvCallBack = setInterval(function() {
                        if (window.crl8 && window.crl8.ready) {
                            if (page.pageId == 'category') {
                                var brandProperty = page.contextId.replace('brand-', '');
                                if (brandProperty == 'aspenpet') {
                                    widget.koDisplayProperty('gallery-o7r1KTct');
                                } else if (brandProperty == 'gensevenpets') {
                                    widget.koDisplayProperty('gallery-z3J4n56Q');
                                } else if (brandProperty == 'lazboy') {
                                    widget.koDisplayProperty('gallery-pCJdqPcf');
                                } else if (brandProperty == 'Chuckit') {
                                    widget.koDisplayProperty('gallery-fVAlBEWK');
                                } else if (brandProperty == 'dogzilla') {
                                    widget.koDisplayProperty('gallery-Amr36pRH');
                                } else if (brandProperty == 'fatcat') {
                                    widget.koDisplayProperty('gallery-TuWColLk');
                                } else if (brandProperty == 'jackson-galaxy') {
                                    widget.koDisplayProperty('gallery-mAdqUQSV');
                                } else if (brandProperty == 'jw') {
                                    widget.koDisplayProperty('gallery-rqLWarqM');
                                } else if (brandProperty == 'muttnation') {
                                    widget.koDisplayProperty('gallery-NWMm2Srt');
                                } else if (brandProperty == 'petmate') {
                                    widget.koDisplayProperty('gallery-7z5cZ9CC');
                                } else if (brandProperty == 'vittlesvault') {
                                    widget.koDisplayProperty('gallery-792i6Kwk');
                                } else if (brandProperty == 'wondersnaxx') {
                                    widget.koDisplayProperty('gallery-DEotgVu9');
                                } else if (brandProperty == 'wwe') {
                                    widget.koDisplayProperty('gallery-sZtAqYT4');
                                } else if (brandProperty == 'zoobilee') {
                                    widget.koDisplayProperty('gallery-YI5lJBWG');
                                }else if (brandProperty == 'petqwerks') {
                                    widget.koDisplayProperty('gallery-cQYfVhYy');
                                }
                            } else if (page.pageId == 'home') {
                                widget.koDisplayProperty('homepage');
                            } else if (page.pageId == 'Gallery') {
                                widget.koDisplayProperty('gallery-vDMbKsJq');
                            } else if (page.pageId == 'product') {
                                widget.koDisplayProperty('product');
                                widget.koProductProperty(widget.product().id());
                            } else if (page.pageId == 'NationalFetchDay') {
                                widget.koDisplayProperty('gallery-fVAlBEWK');
                            } else if (page.pageId == 'keriskorner') {
                                widget.koDisplayProperty('gallery-rqLWarqM');
                            } else if (page.pageId == 'healthychews') {
                                widget.koDisplayProperty('gallery-3I6G91Ed');
                            }
                            // window.crl8.ready fires the callback once the crl8 api is available for use on the page
                                window.crl8.createExperience(widget.koDisplayProperty());
                                console.log('Check Leak 2');
                            window.clearInterval(BvCallBack);
                        }
                    }, 100)
                }, 500);



            },


        };
    }
);