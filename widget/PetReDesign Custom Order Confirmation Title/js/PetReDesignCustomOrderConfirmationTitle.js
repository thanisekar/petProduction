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
                 //New facebook pixel tracking Confirmation from Mathew on 07/28/2020
                 $("script[id='facebookTrackingConfirmation']").remove();
                 if ($("script[id='facebookTrackingConfirmation']").length === 0) {
                     var facebookTrackingConfirmation = 
                     '<script id="facebookTrackingConfirmation">' +
                         '!function(f,b,e,v,n,t,s)' +
                         '{if(f.fbq)return;n=f.fbq=function(){n.callMethod?' +
                         'n.callMethod.apply(n,arguments):n.queue.push(arguments)};' +
                         'if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";' +
                         'n.queue=[];t=b.createElement(e);t.async=!0;' +
                         't.src=v;s=b.getElementsByTagName(e)[0];' +
                         's.parentNode.insertBefore(t,s)}(window, document,"script",' +
                         ' "https://connect.facebook.net/en_US/fbevents.js");' +
                         'fbq("init", "514723996221567");' +
                         'fbq("track", "Purchase");' +
                         '</script>' +
                         '<noscript><img height="1" width="1" style="display:none"' +
                         'src="https://www.facebook.com/tr?id=514723996221567&ev=PageView&noscript=1"' +
                         '/></noscript>';
                         
                         //var linqiaConfirmation = '<img src="https://linqia.ooh.li/c/b556ec287e49d519.png"/> <script src="https://linqia.ooh.li/c/b556ec287e49d519.js"></script>'
                     $("head").append(facebookTrackingConfirmation);
                 }
                 //Ends
            }
            
        };
    }
);