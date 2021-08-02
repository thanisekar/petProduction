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
    ['knockout', 'pubsub', 'ccLogger', 'CCi18n', 'notifier'],

    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function(ko, pubsub, log, CCi18n, notifier) {

        "use strict";

        return {
            onLoad: function(widget) {
                widget.noOfItemsToDisplay(parseInt(widget.noOfItemsToDisplay()));
                $.Topic("klaviyoStartedCheckout.memory").subscribe(function(data) {
                    //Klaviyo Started Checkout
                    setTimeout(function() {
                        if (data.email && data.firstName && data.lastName) {
                            $("script[id='klaviyoIdentify']").remove();
                            if ($("script[id='klaviyoIdentify']").length === 0) {
                                var klaviyoIdentify = '<script>var _learnq = _learnq || [];' +
                                    '_learnq.push(["identify", {' +
                                    '"$email":"' + data.email + '",' +
                                    '"$first_name":"' + data.firstName + '",' +
                                    '"$last_name": "' + data.lastName + '"' +
                                    '}]);' +
                                    '</script>'
                                $("head").append(klaviyoIdentify);
                            }
                        }
                    }, 500)
                    setTimeout(function() {
                        $("script[id='klaviyoCheckout']").remove();
                        if ($("script[id='klaviyoCheckout']").length === 0) {
                            //console.log(this,'this');
                            //  setTimeout(function() {
                            //var getWidget = widget;
                            var klaviyoLineItems = [];
                            var klaviyoItemName = [];
                            var klaviyoCategoryName = [];
                            var shoppingCartItems = [];
                            var eventId;
                            eventId = data.address1.replace(/[^A-Z0-9]/ig, "_");
                            eventId += Math.round(widget.cart().subTotal());
                            console.log(eventId, 'eventId');
                            console.log(widget, 'widget.cart');
                            shoppingCartItems = widget.cart().items();
                            $.each(shoppingCartItems, function(k, v) {
                                var values = v;
                                // console.log(values.displayName(),'values.displayName()');
                                var displayName = values.productData().displayName.replace(/"/g, "");
                                var lineItemsObj = {};
                                lineItemsObj.ProductCategories = [];
                                lineItemsObj.ProductID = values.productId;
                                lineItemsObj.SKU = values.productId;
                                lineItemsObj.ProductName = displayName;
                                lineItemsObj.Quantity = values.quantity();
                                lineItemsObj.ItemPrice = values.itemTotal();
                                lineItemsObj.RowTotal = values.itemTotal();
                                lineItemsObj.ProductURL = 'https://www.petmate.com' + values.productData().route;
                                lineItemsObj.ImageURL = 'https://www.petmate.com' + values.productData().primaryFullImageURL;
                                lineItemsObj.ProductCategories.push(values.product_productURL());
                                klaviyoItemName.push(JSON.stringify(values.productId));
                                klaviyoCategoryName.push(JSON.stringify(values.product_productURL()));
                                klaviyoLineItems.push(JSON.stringify(lineItemsObj));

                            })

                            var klaviyoCheckout = '<script id="klaviyoCheckout" type="text/javascript">' +
                                '_learnq.push(["track", "Started Checkout", {' +
                                '"$event_id":"' + eventId + '",' +
                                //'"$event_id":"ABCWS",' +
                                '"$value":' + widget.cart().subTotal() + ',' +
                                '"ItemNames": [' + klaviyoItemName + ']' + ',' +
                                '"CheckoutURL": "https://www.petmate.com/checkout",' +
                                '"Categories": [' + klaviyoCategoryName + ']' + ',' +
                                '"Items": [' + klaviyoLineItems + ']' +
                                
                                '}]);' +
                                '</script>'
                            $("head").append(klaviyoCheckout);
                            //console.log(klaviyoCheckout,'klaviyoCheckout');
                            //  }, 500)

                        }

                    }, 2000)



                    /*Ends*/
                });
            },
            beforeAppear: function(page) {
                var widget = this;

            }
        };
    }
);
