/**
 * @fileoverview Checkout Cart Summary Widget. 
 * 
 */
/*global $ */
/*global define */
define(

  //-------------------------------------------------------------------
  // DEPENDENCIES
  //-------------------------------------------------------------------
  ['knockout', 'pubsub', 'ccLogger', 'CCi18n','notifier'], 
  
  //-------------------------------------------------------------------
  // MODULE DEFINITION
  //-------------------------------------------------------------------
  function (ko, pubsub, log, CCi18n, notifier) {
  
    "use strict";
  
    return {
      onLoad: function(widget) {
        widget.noOfItemsToDisplay(parseInt(widget.noOfItemsToDisplay()));
      }
    }; 
  }
);
