/**
 * @fileoverview Petmate Custom Order Confirmation Title.
 *
 * @author Taistech
 */
define(
    //-------------------------------------------------------------------
    // DEPENDENCIES
    // Adding knockout
    //-------------------------------------------------------------------
    ['jquery', 'knockout', 'pubsub', 'ccConstants',"ccRestClient"],

    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function($, ko, t, CCConstants, restClient) {

        "use strict";
        var getWidget = "";
        var getPage = "" ;
        return {
            onLoad: function(widget) {
                getWidget = widget;
                
                
            },

            beforeAppear: function(page) {
                getPage = page;
            }
            
        };
    }
);