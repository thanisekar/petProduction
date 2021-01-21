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
                    $('body').on( 'mouseover','#precision, #jamproof, #gamma, #engineer', function(){
		           console.log($(this).attr('id'),'hover');
		           var hoverClass = $(this).attr('id');
		            $('.precision, .jamproof, .gamma, .engineer').hide();
		           $('.'+hoverClass).show();
		           
		      
		    });
		    $('body').on( 'mouseover','#jamproof, #gamma, #engineer', function(){

		            $('#precision').css('color','#dedcd7');

		           
		      
		    });
               
            },

           
            beforeAppear: function(page) {
                $('.jamproof, .gamma, .engineer').hide();
                     $('.nano').carousel({
                      interval: 3000
                    })                        
            }
  
           
        };
    }
);