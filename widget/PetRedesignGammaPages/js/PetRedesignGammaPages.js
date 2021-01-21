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
    ['jquery', 'knockout', 'spinner', 'CCi18n', 'pubsub', 'storageApi'],
    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function($, ko, spinner, CCi18n, t, c, storageApi) {
        "use strict";
        var getWidget = "";
        
        

        return {

            koBrandPage: ko.observable(),
            onLoad: function(widget) {
         
               
            },

           
            beforeAppear: function(page) {
                                
                   	$('.gamma').carousel({
                      interval: 3000
                    })                             
                            
            }
  
           
        };
    }
);