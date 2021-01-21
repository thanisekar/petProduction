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
            koProductProperty:ko.observable(''),
            onLoad: function(widget) {
         
               
            },


            beforeAppear: function(page) {
              
                 var widget = this;
                 
                 
                    if(page.pageId == 'category'){
                         var brandProperty = page.contextId.replace('brand-','');
                                widget.koDisplayProperty(brandProperty);
                                widget.koProductProperty('');
                    }else if(page.pageId == 'home' || page.pageId == 'Gallery'){
                         widget.koDisplayProperty('homepage');
                         widget.koProductProperty('');
                    }else if(page.pageId == 'product'){
                        widget.koDisplayProperty('');
                        widget.koProductProperty(widget.product().id());
                    }else if(page.pageId == 'NationalFetchDay'){
                        widget.koDisplayProperty('chuckit');
                        widget.koProductProperty('');
                    }else if(page.pageId == 'keriskorner'){
                        widget.koDisplayProperty('jw');
                        widget.koProductProperty('');
                    }else if(page.pageId == 'healthychews'){
                        widget.koDisplayProperty('healthychews');
                        widget.koProductProperty('');
                    }
                     var BvCallBack = setInterval(function() {
                            if(typeof window.BVWidgets.reset !== 'undefined'){ 
                               BVWidgets.reset(
                                  {
                                    
                                    "display":widget.koDisplayProperty(),
                                    "productId": widget.koProductProperty()
                                  }, function() { } // Optional callback function.
                                );
                                 window.clearInterval(BvCallBack);
                               }
                        }, 500)
                                                
            },
  
           
        };
    }
);