/**
 * @fileoverview Order History Details.
 * 
 * @author shsatpat
 */
define(
 
  //-------------------------------------------------------------------
  // DEPENDENCIES
  //-------------------------------------------------------------------
  ['knockout', 'pubsub', 'notifier', 'CCi18n', 'ccConstants', 'navigation', 'ccRestClient', 'jquery'],
    
  //-------------------------------------------------------------------
  // MODULE DEFINITION
  //-------------------------------------------------------------------
  function(ko, pubsub, notifier, CCi18n, CCConstants, navigation, ccRestClient, $) {
  
    "use strict";
    var getWidget = "";
    return {
        returnOrderID : ko.observable(),
        returnReq: ko.observable(),
        onLoad : function(widget) {
            getWidget = widget;
        },  
     
      beforeAppear: function (page) {
        var widget = this;
       
        $.Topic("returnHeader").subscribe(function(data){
            getWidget.returnReq(data);
            getWidget.returnOrderID(getWidget.returnReq().id);
            $("#returnHeader").show();
        });
      },
    }
  });
