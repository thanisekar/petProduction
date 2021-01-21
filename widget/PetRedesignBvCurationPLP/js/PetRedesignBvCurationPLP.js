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
    ['jquery', 'knockout', 'spinner', 'CCi18n', 'pubsub', 'storageApi','ccResourceLoader!global/loader'],
    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function($, ko, spinner, CCi18n, t, c, storageApi,bazzarVoice) {c
        "use strict";
        var getWidget = "";
        var getPath = "";
        window.BvGalleryWidget;
        return {
            koBVGalleryContainer: ko.observable(),
            koCategoryID: ko.observable(),
            koBrandPage: ko.observable(),
            koGetPage: ko.observable(),
            koBVCuration: ko.observable(false),
            onLoad: function(widget) {
                getWidget = widget;
                //console.log('Curation 1-------getWidget------------', getWidget)
            },
            beforeAppear: function(page) {   
                if (this.pageIds().indexOf(page.pageRepositoryId) != -1) {
                var widget = this;
                
                
                
                if (!$('.BVGalleryWrap').length) {
                    if (page.pageId == 'home') {
                        getWidget.koBVGalleryContainer('bv-homepage-carousel')
                    }
                    else if (page.pageId == 'product') {
                        getWidget.koBVGalleryContainer('bv-carousel')
                    }
                    /*else if(page.pageId == 'brandLanding'){
                        if (page.contextId == "brand-muttnation") {
                        getWidget.koBVGalleryContainer('bv-grid-gallery')
                        }
                    }*/
                    else if(page.pageId == 'category'){
                         getWidget.koBVGalleryContainer('bv-grid-gallery')
                    }
                }
                
                //  $.Topic(pubsub.topicNames.PAGE_READY).subscribe(function() {  
               // setTimeout(function() {
                    //console.log('loadscript');
                    getWidget.loadBackupScript(function() {
                        //console.log('loaded');
                       
                        if (page.pageId == 'category') {
                            getWidget.koBVGalleryContainer('bv-grid-gallery')
                            //console.log("--------Brand page-------------")
                            //console.log(getWidget.koBVGalleryContainer());
                            if (page.contextId == "brand-Chuckit") {
                                getWidget.koBrandPage('chuckit');
                                
                            } else if (page.contextId == "brand-jackson-galaxy") {
                                getWidget.koBrandPage('jacksongalaxy');
                            }
                            else if (page.contextId == "brand-aspenpet") {
                                getWidget.koBrandPage('aspenpet');
                            } 
                            else if (page.contextId == "brand-jw") {
                                getWidget.koBrandPage('jw');
                            } else if (page.contextId == "brand-dogzilla") {
                                getWidget.koBrandPage('dogzilla');
                            } else if (page.contextId == "brand-muttnation") {
                                getWidget.koBrandPage('muttnation');
                            } else if (page.contextId == "brand-wwe") {
                                getWidget.koBrandPage('wwe');
                            }  else if (page.contextId == "brand-armandhammer") {
                                 getWidget.koBrandPage('armandhammer');
                            }  
                            else if (page.contextId == "brand-booda") {
                                 getWidget.koBrandPage('booda');
                            }    
                            else if (page.contextId == "brand-brandonmcMillan") {
                                 getWidget.koBrandPage('armandhammer');
                            }    
                            else if (page.contextId == "brand-calmz") {
                                 getWidget.koBrandPage('calmz');
                            }    
                            else if (page.contextId == "brand-fatcat") {
                                 getWidget.koBrandPage('fatcat');
                            }    else if (page.contextId == "brand-lazboy") {
                                 getWidget.koBrandPage('lazboy');
                            }    
                            else if (page.contextId == "brand-petmate") {
                                 getWidget.koBrandPage('petmate');
                            }    
                            else if (page.contextId == "brand-precisionpetproducts") {
                                 getWidget.koBrandPage('precisionpetproducts');
                            }    
                              else if (page.contextId == "brand-ruffmaxx") {
                                 getWidget.koBrandPage('ruffmaxx');
                            }    
                            else if (page.contextId == "brand-wouapy") {
                                 getWidget.koBrandPage('wouapy');
                            } 
                             else if (page.contextId == "brand-wetnoz") {
                                 getWidget.koBrandPage('wetnoz');
                            } 
                            else if (page.contextId == "brand-vittlesvault") {
                                getWidget.koBrandPage('vittlesvault');
                           } 
                           else if (page.contextId == "brand-gensevenpets") {
                            getWidget.koBrandPage('gensevenpets');
                            } 
                             
                             if(getWidget.koBrandPage()!=undefined){
                                      
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
                        else if (page.pageId == 'home') {
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
                        } else if (page.pageId == 'product') {
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
                                    "productId": page.contextId
                                },
                                function() {} // Optional callback function.
                            );
                        }
                  
                    });
                
            }
            },
            
            loadBackupScript: function(callback) {
               
                    callback();
             
            }
        };
    }
);