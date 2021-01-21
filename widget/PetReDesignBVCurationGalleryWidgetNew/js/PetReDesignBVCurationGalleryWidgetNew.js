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
    function($, ko, spinner, CCi18n, t, c, storageApi) {
        "use strict";
        var getWidget = "";
        return {
            koBVGalleryContainer: ko.observable(),
            koBrandPage: ko.observable(),
            
            onLoad: function(widget) {
                getWidget = widget;
                //console.log(ko.toJS(getWidget), 'getWidget-----------');
            },
            beforeAppear: function(page) {
                //console.log(page, 'this.pageIds()');
                if (this.pageIds().indexOf(page.pageRepositoryId) != -1) {
                    var widget = this;
                    if (!$('.BVGalleryWrap').length) {
                        if (page.pageId == 'home') {
                            getWidget.koBVGalleryContainer('bv-homepage-carousel')
                        } else if (page.pageId == 'product') {
                            getWidget.koBVGalleryContainer('bv-carousel')
                        }
                    }
                }
                if (page.pageId == 'home') {
                    $(window).scroll(function() {
                        if ($('#educationArticleSectionWidget').length > 0) {
                            //check if your div is visible to user
                            // CODE ONLY CHECKS VISIBILITY FROM TOP OF THE PAGE
                            if ($(window).scrollTop() + $(window).height() >= $('#educationArticleSectionWidget').offset().top) {
                                if (!$('#bvCurationWrap').attr('loaded')) {
                                    $('#bvCurationWrap').attr('loaded', true);
                                    getWidget.loadBackupScript('home');
                                }
                            }
                        }
                    });
                }
            },
            

            loadBackupScript: function(getPage, getBrand) {
                //console.log('loadBackupScript');
                if (getPage === 'category') {
                    var getBrandValue = getBrand.split(',');
                    // getWidget.koBVGalleryContainer('bv-grid-gallery')

                    //console.log(getWidget.koBVGalleryContainer());
                    if (getBrandValue[0] == "brand-Chuckit") {
                        getWidget.koBrandPage('chuckit');

                    } else if (getBrandValue[1] == "brand-jackson-galaxy") {
                        getWidget.koBrandPage('jacksongalaxy');
                    } else if (getBrandValue[2] == "brand-aspenpet") {
                        getWidget.koBrandPage('aspenpet');
                    } else if (getBrandValue[3] == "brand-jw") {
                        getWidget.koBrandPage('jw');
                    } else if (getBrandValue[4] == "brand-dogzilla") {
                        getWidget.koBrandPage('dogzilla');
                    } else if (getBrandValue[5] == "brand-aspenpet") {
                        getWidget.koBrandPage('aspenpet');
                    } else if (getBrandValue[6] == "brand-muttnation") {
                        getWidget.koBrandPage('muttnation');
                    } else if (getBrandValue[7] == "brand-wwe") {
                        getWidget.koBrandPage('wwe');
                    } else if (getBrandValue[8] == "brand-armandhammer") {
                        getWidget.koBrandPage('armandhammer');
                    } else if (getBrandValue[9] == "brand-booda") {
                        getWidget.koBrandPage('booda');
                    } else if (getBrandValue[10] == "brand-brandonmcMillan") {
                        getWidget.koBrandPage('armandhammer');
                    } else if (getBrandValue[11] == "brand-calmz") {
                        getWidget.koBrandPage('calmz');
                    } else if (getBrandValue[12] == "brand-fatcat") {
                        getWidget.koBrandPage('fatcat');
                    } else if (getBrandValue[13] == "brand-lazboy") {
                        getWidget.koBrandPage('lazboy');
                    } else if (getBrandValue[14] == "brand-petmate") {
                        getWidget.koBrandPage('petmate');
                    } else if (getBrandValue[15] == "brand-precisionpetproducts") {
                        getWidget.koBrandPage('precisionpetproducts');
                    } else if (getBrandValue[16] == "brand-ruffmaxx") {
                        getWidget.koBrandPage('ruffmaxx');
                    } else if (getBrandValue[17] == "brand-wouapy") {
                        getWidget.koBrandPage('wouapy');
                    } else if (getBrandValue[18] == "brand-wetnoz") {
                        getWidget.koBrandPage('wetnoz');
                    }
                    else if (getBrandValue[19] == "brand-vittlesvault") {
                        getWidget.koBrandPage('vittlesvault');
                    }
                    else if (getBrandValue[20] == "brand-gensevenpets") {
                        getWidget.koBrandPage('gensevenpets');
                    }
                    if (getWidget.koBrandPage() != undefined) {
                        //  //console.log('getWidget.koBrandPage()',getWidget.koBrandPage()); 
                        getWidget.koBVGalleryContainer('bv-grid-gallery');
                        if (typeof BVWidgets.reset === 'function') {
                            return BVWidgets.reset({
                                    "display": getWidget.koBrandPage()
                                },
                                function() {} // Optional callback function.
                            );
                            //console.log(getWidget.koBrandPage() , 'brand Pages');
                        }
                        BVWidgets.display({
                                "display": getWidget.koBrandPage()
                            },
                            function() {} // Optional callback function.
                        );
                    }
                }
                //else {
                else if (getPage == 'home') {
                    //console.log('Home page works');
                    getWidget.koBVGalleryContainer('bv-homepage-carousel')
                    if (typeof BVWidgets.reset === 'function') {
                        return BVWidgets.reset({
                                "display": 'homepage',
                                "productId": null
                            },
                            function() {
                                //console.log('...Curations widgets reset.');
                            } // Optional callback function.
                        );
                    }
                    BVWidgets.display({
                            "display": 'homepage'
                        },
                        // Optional callback function.
                        function() {
                            //console.log('Curations widgets displayed.');
                        }
                    );


                } else if (getPage.pageId == 'product') {
                    getWidget.koBVGalleryContainer('bv-carousel')
                    if (typeof BVWidgets.reset === 'function') {
                        return BVWidgets.reset({
                                "display": 'productpage',
                                "productId": page.contextId
                            },
                            function() {} // Optional callback function.
                        );
                    }
                    BVWidgets.display({
                            "display": 'productpage',
                            "productId": getPage.contextId
                        },
                        function() {} // Optional callback function.
                    );
                }
            },
            
            
        };
    }
);
