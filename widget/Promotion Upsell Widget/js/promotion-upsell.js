/**
 * @fileoverview Promotion Upsell Widget.
 * 
 * @author kukumvin
 */
define(
 
  //-------------------------------------------------------------------
  // DEPENDENCIES
  //-------------------------------------------------------------------
  ['knockout', 'pubsub', 'viewModels/promotionUpsellContainer'],
    
  //-------------------------------------------------------------------
  // MODULE DEFINITION
  //-------------------------------------------------------------------
  function(ko, pubSub, promotionUpsellContainer) {
  
    "use strict";

    return {
      /** Widget root element id */
      WIDGET_ID: 'promotionUpsell',
      onLoad : function(widget) {
        widget.messageLimit = widget.messageLimit && null != widget.messageLimit() && widget.messageLimit != "" ? parseInt(widget.messageLimit()) : parseInt("1");
        widget.promotionUpsellContainer = promotionUpsellContainer.getInstance();
        widget.widgetTags = widget.tags && null != widget.tags() && widget.tags() != "" ? widget.tags().split(","):[];
        widget.promotionUpsellMessages = ko.pureComputed(function() {
          var promoMessages = widget.promotionUpsellContainer.promotionUpsellMessages().filter(function(message, index) {
              var widget = this;
              var displayMessage = false;
              widget.widgetTags.forEach(function(widgetTags) {
                for (var i=0; i<message.tags.length; i++) {
                  if(message.tags[i] == widgetTags) {
                    displayMessage = true;
                    break;
                  }
                }
              });
             return displayMessage;
            }, widget);
             $.Topic("promotionMessage.memory").publish(promoMessages);
           
          return promoMessages.slice(0,widget.messageLimit);
        }).extend({ rateLimit: 500 });
        widget.items = ko.computed(function(){
          return widget.cart().allItems();
        }).extend({ rateLimit: 1000 });

        widget.getNonQualifiedMessages = function () {
          if (widget.cart().items().length == 0) {
            widget.promotionUpsellContainer.getNonQualifiedMessages();
          }
        };

        widget.getNonQualifiedMessagesSubsciption = function () {
          widget.items.subscribe(function(newVal) {
            if (newVal.length == 0) {
              widget.promotionUpsellContainer.getNonQualifiedMessages();
            }
          });
        };

        if(!widget.promotionUpsellContainer.isNonQualifiedMessagesSubscribedToQuantity) {
          widget.promotionUpsellContainer.isNonQualifiedMessagesSubscribedToQuantity = true;
          widget.getNonQualifiedMessages();
          $.Topic(pubSub.topicNames.PAGE_LAYOUT_UPDATED).subscribe(widget.getNonQualifiedMessagesSubsciption);
          $.Topic(pubSub.topicNames.USER_LOGIN_SUCCESSFUL).subscribe(widget.getNonQualifiedMessages);
          $.Topic(pubSub.topicNames.USER_LOGOUT_SUCCESSFUL).subscribe(widget.getNonQualifiedMessages);
          $.Topic(pubSub.topicNames.USER_AUTO_LOGIN_SUCCESSFUL).subscribe(widget.getNonQualifiedMessages);
        }
      }
    }
  }
);
