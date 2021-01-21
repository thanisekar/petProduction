/**
 * 
 *
 * @author Taistech
 */
define(
    //-------------------------------------------------------------------
    // DEPENDENCIES
    // Adding knockout
    //-------------------------------------------------------------------
    ['knockout'],   

    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function(ko) {

        "use strict";

        function DataLayer() {


        }


        return {
            isPending: ko.observable(false),

            onLoad: function(widget) {
                var sampleobj = widget.confirmation();
                //var productsGTM = [];
                var products = [];
                var commerceItems = "";

                for (var i = 0; i < sampleobj.shoppingCart.items.length; i++) {
                    products.push({
                        'sku': sampleobj.shoppingCart.items[i].productId,
                        'name': sampleobj.shoppingCart.items[i].displayName, // product name 
                        'category': sampleobj.shoppingCart.items[i].catRefId, // category or variation 
                        'price': sampleobj.shoppingCart.items[i].listPrice, // unit price - required 
                        'quantity': sampleobj.shoppingCart.items[i].quantity, // quantity - required
                        'coupon': '' // coupon
                    })

                }


                dataLayer.push({
                    'event': "ecomEvent",
                    'transactionId': sampleobj.id,
                    'transactionTotal': sampleobj.priceInfo.total, // total - required     
                    'transactionTax': sampleobj.priceInfo.amount, // tax 
                    'transactionShipping': sampleobj.shippingMethod.cost, // shipping
                    'transactionCity': sampleobj.shippingAddress.city, // city 
                    'transactionState': sampleobj.shippingAddress.state, // state or province  
                    'transactionCountry': sampleobj.shippingAddress.country, // country  
                    'transactionProducts': products
                });

            },

            beforeAppear: function(page) {



            }
        };
    }
);