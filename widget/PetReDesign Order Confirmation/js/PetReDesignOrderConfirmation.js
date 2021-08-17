/**
 * @fileoverview Order Confirmation Widget. 
 * Displays a confirmation of the order placed by the user.
 */
 define(

    //-------------------------------------------------------------------
    // DEPENDENCIES
    //-------------------------------------------------------------------
    ['knockout', 'CCi18n', 'pubsub', 'notifier', 'ccConstants', 'jquery', 'spinner', 'ccRestClient', 'moment'],

    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function(ko, CCi18n, pubsub, notifier, CCConstants, $, spinner, ccRestClient, moment) {

        "use strict";
        var getWidget = "";
        var getPage = "";
        var getPath = "";
        var dataLayer = [];
        return {
            WIDGET_ID: "checkoutConfirmation",
            isPending: ko.observable(false),
            koOrderDetails: ko.observable(),
            koProductId: ko.observable(),
            koProductName: ko.observable(),
            koProductQty: ko.observable(),
            koProductPrice: ko.observable(),
            koOrderID: ko.observable(),
            koTotal: ko.observable(),
            koSubTotal: ko.observable(),
            koTax: ko.observable(),
            koUnitPrice: ko.observable(),
            koQuantity: ko.observable(),
            koShipping: ko.observable(),
            koCity: ko.observable(),
            koState: ko.observable(),
            koCountry: ko.observable(),
            koEmail: ko.observable(),
            koZipcode: ko.observable(),
            koNickName: ko.observable(),
            koCategory: ko.observable(),
            koLocale: ko.observable(),
            koshoppingCarItem: ko.observableArray([]),
            koImageURL: ko.observable(),
            koTrackingProductIDs: ko.observableArray([]),
            koTrackingproductQuanties: ko.observableArray([]),
            koTrackingproductUnitPrices: ko.observableArray([]),
            koProductPromoCode: ko.observableArray([]),
            koCouponCode: ko.observableArray([]),
            koDiscount: ko.observable(),
            kototalWithDisount: ko.observable(),
            koProduct_listArray: ko.observableArray([]),
            koPIETrackingProductPrice: ko.observable(),
            koProductListPrice: ko.observableArray([]),
            koReviewProductID: ko.observableArray([]),
            koOrderSubmittedTime: ko.observable(''),
            koNewCustomer: ko.observable(''),
            koSscid: ko.observable(''),


            resourcesLoaded: function(widget) {
                // Create observable to mark the resources loaded, if it's not already there
                if (typeof widget.checkoutResourcesLoaded == 'undefined') {
                    widget.checkoutResourcesLoaded = ko.observable(false);
                }
                // Notify the computeds relying on resources
                widget.checkoutResourcesLoaded(true);
            },

            onLoad: function(widget) {


                getWidget = widget;

                getWidget.appendScript('//nsg.symantec.com/Web/Seal/gjs.aspx?SN=965624406');

                //For Add Shopper Only
                getWidget.koOrderID(getWidget.confirmation().id),
                    getWidget.koTotal(getWidget.confirmation().priceInfo.total)

                //Ends

                var OrderDetails = ko.toJS(getWidget.confirmation().priceInfo.total);
                getWidget.koDiscount(getWidget.confirmation().discountInfo.orderDiscount)
                var OrderDetailsArray = [];
                if (parseInt(OrderDetails) == OrderDetails) {
                    var finalOrderDetails = parseInt(OrderDetails + '00');
                    getWidget.koOrderDetails(finalOrderDetails);
                } else if (parseFloat(OrderDetails) == OrderDetails) {
                    OrderDetailsArray = parseFloat(OrderDetails).toString().split(".");
                    var finalOrderDetails = parseInt(OrderDetailsArray[0] + OrderDetailsArray[1]);
                    getWidget.koOrderDetails(finalOrderDetails);

                }
                //Share a sale

                //Coupon Code 
                if (getWidget.confirmation().discountInfo.orderDiscountDescList.length > 0) {
                    $.each(getWidget.confirmation().discountInfo.orderDiscountDescList, function(key, value) {
                        var couponText = getWidget.confirmation().discountInfo.orderDiscountDescList[key].coupon;
                        getWidget.koCouponCode.push(couponText);

                    });
                }
                //Ends

                $.each(getWidget.confirmation().shoppingCart.items, function(key, value) {
                    // console.log("getWidget.confirmation.shoppingCart.items........", ko.toJS(getWidget.confirmation().shoppingCart.items));
                    // console.log(value, '-----value----');
                    var productId = getWidget.confirmation().shoppingCart.items[key].catRefId;
                    var productName = getWidget.confirmation().shoppingCart.items[key].displayName;
                    var productQty = getWidget.confirmation().shoppingCart.items[key].quantity;
                    var productPrice = getWidget.confirmation().shoppingCart.items[key].unitPrice;
                    var productListPrice = getWidget.confirmation().shoppingCart.items[key].listPrice;
                    var productPriceArray = [];
                    getWidget.koTrackingProductIDs.push(productId);
                    getWidget.koTrackingproductQuanties.push(productQty);
                    getWidget.koTrackingproductUnitPrices.push(productPrice);
                    getWidget.koProductListPrice.push(productListPrice);
                    var bvCategory = getWidget.confirmation().shoppingCart.items[key].dynamicProperties[0].value;
                    if (bvCategory != undefined) {
                        var bvCategorySplit = bvCategory.split(">");
                        var bvCategoryFinal = bvCategorySplit.pop();
                        getWidget.koCategory(bvCategoryFinal);
                    }


                    //Get UPC code

                    for (var i = 0; i < getWidget.confirmation().shoppingCart.items[key].skuProperties.length; i++) {
                        if (getWidget.confirmation().shoppingCart.items[key].skuProperties[i].id == "upc") {
                            var upcVal = getWidget.confirmation().shoppingCart.items[key].skuProperties[i].value;

                        }
                    }
                    //google customer review ratings 
                    var reviewProdID = {
                        "gtin": upcVal
                    }
                    //console.log(reviewProdID,'reviewProdID')
                    getWidget.koReviewProductID.push(reviewProdID);
                    // console.log(getWidget.koReviewProductID(),'koReviewProductID')


                    // console.log("productPrice",productPrice)
                    /* Pie tracking Product price starts*/
                    if (parseInt(productPrice) == productPrice) {
                        var PIEFinalProductPrice = productPrice + '.00';

                        getWidget.koPIETrackingProductPrice(PIEFinalProductPrice);
                        //  console.log('koPIETrackingProductPrice',getWidget.koPIETrackingProductPrice());
                    } else if (parseFloat(productPrice) == productPrice) {
                        productPriceArray = parseFloat(productPrice);
                        var PIEFinalProductPrice = productPriceArray;
                        getWidget.koPIETrackingProductPrice(PIEFinalProductPrice);
                        //  console.log('koPIETrackingProductPrice',getWidget.koPIETrackingProductPrice());

                    }
                    /* Pie tracking Product price ends*/


                    if (parseInt(productPrice) == productPrice) {
                        var finalProductPrice = parseInt(productPrice + '00');

                        getWidget.koProductPrice(finalProductPrice);
                    } else if (parseFloat(productPrice) == productPrice) {
                        productPriceArray = parseFloat(productPrice).toString().split(".");
                        var finalProductPrice = parseInt(productPriceArray[0] + productPriceArray[1]);
                        getWidget.koProductPrice(finalProductPrice);

                    }
                    getWidget.koProductId(productId);
                    getWidget.koProductName(productName)
                    getWidget.koProductQty(productQty)


                    value.customItemImage = ko.observable("");
                    value.customProductRoute = ko.observable("");
                    var a = CCConstants.ENDPOINT_PRODUCTS_GET_PRODUCT;
                    var l = {};
                    l['fields'] = 'primaryThumbImageURL,route'
                    var p = value.productId;
                    var r = value.route;
                    ccRestClient.request(a, l, function(prodDetail) {
                        //console.log(prodDetail, 'prodDetail')
                        value.customItemImage(prodDetail.primaryThumbImageURL);
                        value.customProductRoute(prodDetail.route);

                        //Bronto Tracker

                        $('script[id="brontoTag"]').remove();
                        // setTimeout(function(){
                        if ($('script[id="brontoTag"]').length === 0) {
                            var brontoCart = {};
                            var brontoLineItems = [];
                            var shoppingCartItems = []
                            shoppingCartItems = getWidget.confirmation().shoppingCart.items;

                            $.each(shoppingCartItems, function(k, v) {

                                var lineItemsObj = {};
                                lineItemsObj.sku = v.productId;
                                lineItemsObj.name = v.displayName;
                                lineItemsObj.category = v.dynamicProperties[0].value;
                                lineItemsObj.unitPrice = v.unitPrice;
                                lineItemsObj.salePrice = v.salePrice;
                                lineItemsObj.quantity = v.quantity;
                                lineItemsObj.totalPrice = v.rawTotalPrice;
                                if (v.customItemImage() != undefined) {
                                    lineItemsObj.imageUrl = "https://www.petmate.com" + v.customItemImage();
                                }
                                lineItemsObj.productUrl = "https://www.petmate.com" + v.customProductRoute();
                                brontoLineItems.push(lineItemsObj);
                            })

                            var brontoObject = '<script id="brontoTag" type="text/javascript">' +
                                'brontoCart ={' +
                                '"cartPhase": "ORDER_COMPLETE",' +
                                '"currency": "USD",' +
                                '"subtotal": ' + getWidget.koSubTotal() + ',' +
                                '"discountAmount": ' + getWidget.koDiscount() + ',' +
                                '"taxAmount": ' + getWidget.koTax() + ',' +
                                '"grandTotal": ' + getWidget.koTotal() + ',' +
                                '"orderId": " ' + getWidget.koOrderID() + ' ", ' +
                                '"emailAddress": " ' + getWidget.koEmail() + ' ", ' + //omit line if value not available
                                '"cartUrl":"https://www.petmate.com/cart ", ' +
                                '"lineItems":  ' + JSON.stringify(brontoLineItems) +
                                '}' +
                                '</script>'
                            if (shoppingCartItems.length > 0) {
                                $("footer .footer").append(brontoObject);
                            }
                        }
                        //},1000); 
                        //  console.log(value.customItemImage(), '-----value.customItemImage----');
                    }, function(prodDetail) {}, p, r);




                    getPath = window.location.host;
                    // console.log('getPath', getPath);


                    $.each(getWidget.confirmation().shippingGroups[0].items, function(key, value) {

                        var productImage = getWidget.confirmation().shippingGroups[0].items[key].primaryThumbImageURL;
                        var absoluteImgUrl = encodeURI('https://' + getPath + productImage);
                        getWidget.koImageURL(absoluteImgUrl)
                        // console.log("getWidget.koImageURL()",getWidget.koImageURL());

                    })

                    getWidget.koshoppingCarItem.push({
                        'name': getWidget.koProductName(),
                        "price": getWidget.koPIETrackingProductPrice(),
                        "quantity": getWidget.koProductQty(),
                        "sku": getWidget.koProductId(),
                        "imageURL": getWidget.koImageURL()
                    });

                    var productListObj = {
                        'id': productId,
                        'price': productListPrice,
                        'quantity': productQty
                    }
                    getWidget.koProduct_listArray.push(productListObj)


                });

                //Bing Conversion Goal

                var bingConversion = "<script > (function(w, d, t, r, u) {" +
                    "var f, n, i;" +
                    "w[u] = w[u] || [], f = function() {" +
                    "var o = {" +
                    "ti: '134203866'" +
                    "};" +
                    "o.q = w[u], w[u] = new UET(o), w[u].push('pageLoad')" +
                    "}, n = d.createElement(t), n.src = r, n.async = 1, n.onload = n.onreadystatechange = function() {" +
                    "var s = this.readyState;" +
                    "s && s !== 'loaded' && s !== 'complete' || (f(), n.onload = n.onreadystatechange = null)" +
                    "}, i = d.getElementsByTagName(t)[0], i.parentNode.insertBefore(n, i)" +
                    "})(window, document, 'script', '//bat.bing.com/bat.js', 'uetq');" +
                    "window.uetq = window.uetq || [];" +
                    "window.uetq.push('event', '', {" +
                    "'revenue_value': " + getWidget.koTotal() + "," +
                    "'currency': 'USD'" +
                    "}); < /script>"
                $("head").append(bingConversion);



                //Klaviyo Order Placed
                if (getWidget.confirmation()) {
                    var confirmation = getWidget.confirmation();
                    var klaviyoOrderJson = {};


                    var klaviyoLineItems = [];
                    var klaviyoItemName = [];
                    var klaviyoCategoryName = [];
                    var shoppingCartItems = []
                    var shoppingCart = getWidget.confirmation().shoppingCart;
                    shoppingCartItems = getWidget.confirmation().shoppingCart.items;
                    var eventId;
                    eventId = confirmation.shippingAddress.address1.replace(/[^A-Z0-9]/ig, "_");
                    eventId += Math.round(confirmation.priceInfo.subTotal);
                    $.each(shoppingCartItems, function(k, v) {
                        var values = v;
                        //console.log(values.dynamicProperties[0].value, 'values.dynamicProperties[0]');
                        var displayName;
                        var brandValue;
                        if(values.displayName){
                             displayName = values.displayName.replace(/"/g, "");
                        }else{
                             displayName = "";
                        }
                        if(values.dynamicProperties[0].value){
                             brandValue = values.dynamicProperties[0].value.replace(/[^\w\s]/gi, ',');
                        }else{
                             brandValue = "";
                        }
                        
                        var lineItemsObj = {};
                        lineItemsObj.Categories = [];
                        lineItemsObj.ProductID = values.productId;
                        lineItemsObj.SKU = displayName;
                        lineItemsObj.ProductName = displayName;
                        lineItemsObj.Quantity = values.quantity;
                        lineItemsObj.ItemPrice = values.listPrice;
                        lineItemsObj.RowTotal = values.listPrice;
                        lineItemsObj.ProductURL = 'https://www.petmate.com/' + values.route;
                        lineItemsObj.ImageURL = 'https://www.petmate.com/' + values.primaryThumbImageURL;
                        lineItemsObj.Categories.push(brandValue);
                        lineItemsObj.Brand = brandValue;
                        klaviyoItemName.push(displayName);
                        klaviyoCategoryName.push(brandValue);
                        klaviyoLineItems.push(lineItemsObj);

                    })



                    klaviyoOrderJson = {
                        "token": "S3dfRa",
                        "event": "Placed Order",
                        "customer_properties": {
                            "$email": confirmation.shippingAddress.email,
                            "$first_name": confirmation.shippingAddress.firstName,
                            "$last_name": confirmation.shippingAddress.lastName,
                            "$phone_number": confirmation.shippingAddress.phoneNumber,
                            "$address1": confirmation.shippingAddress.address1,
                            "$address2": confirmation.shippingAddress.address2,
                            "$city": confirmation.shippingAddress.city,
                            "$zip": confirmation.shippingAddress.postalCode,
                            "$region": confirmation.shippingAddress.state,
                            "$country": "USA"
                        },
                        "properties": {
                            "$event_id": eventId,
                            //"$event_id": "ABCWS",
                            "$value": confirmation.priceInfo.total,
                            "OrderId": confirmation.id,
                            "Categories": klaviyoCategoryName,
                            "ItemNames": klaviyoItemName,
                            "Brands": klaviyoCategoryName,
                            "DiscountCode": "",
                            "DiscountValue": confirmation.discountInfo.orderDiscount,
                            "Items": klaviyoLineItems,
                            "BillingAddress": {
                                "FirstName": confirmation.billingAddress.firstName,
                                "LastName": confirmation.billingAddress.lastName,
                                "Company": "",
                                "Address1": confirmation.billingAddress.address1,
                                "Address2": confirmation.billingAddress.address2,
                                "City": confirmation.billingAddress.city,
                                "Region": confirmation.billingAddress.state,
                                "RegionCode": confirmation.billingAddress.state,
                                "Country": "United States",
                                "CountryCode": "US",
                                "Zip": confirmation.billingAddress.postalCode,
                                "Phone": confirmation.billingAddress.phoneNumber
                            },
                            "ShippingAddress": {
                                "FirstName": confirmation.shippingAddress.firstName,
                                "LastName": confirmation.shippingAddress.lastName,
                                "Company": "",
                                "Address1": confirmation.shippingAddress.address1,
                                "Address2": confirmation.shippingAddress.address2,
                                "City": confirmation.shippingAddress.city,
                                "Region": confirmation.shippingAddress.state,
                                "RegionCode": confirmation.shippingAddress.state,
                                "Country": "United States",
                                "CountryCode": "US",
                                "Zip": confirmation.shippingAddress.postalCode,
                                "Phone": confirmation.shippingAddress.phoneNumber
                            }
                        },
                        "time": Date.now() / 1000
                    }


                    var encodedString = btoa(JSON.stringify(klaviyoOrderJson));
                    //console.log(encodedString,'encodedString');
                    //var decodedString = atob(encodedString);


                    var objNew = {
                        "encoded": encodedString
                    }

                    $.ajax({
                        url: "/ccstorex/custom/petmate/v1/klaviyoPlacedOrder", //external URL
                        type: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify(objNew), //data needs to be passed
                        async: false,
                        dataType: 'json',
                        success: function(data) {
                            console.log('Order details sent to Klaviyo');
                        },
                        error: function(data) {
                            console.log(data, 'Error in sending Order details sent to Klaviyo');
                        }
                    });
                }




                //Ends

                getWidget.koProductPromoCode([])
                if (getWidget.confirmation().discountInfo.orderDiscountDescList.length > 0) {
                    $.each(getWidget.confirmation().discountInfo.orderDiscountDescList, function(key, value) {

                        var productPromoCode = getWidget.confirmation().discountInfo.orderDiscountDescList[key].coupon;
                        getWidget.koProductPromoCode.push(productPromoCode)
                    })

                }

                dataLayer.push({
                    'event': 'virtualPageView',
                    'page': {
                        'url': '/confirmation'
                    }
                });


                //   console.log(submitedDate , 'submitedDate');

                var totalWithDisount = getWidget.koSubTotal() - getWidget.koDiscount();
                getWidget.kototalWithDisount(totalWithDisount);


                /* steel house tracking pixel script starts*/
                var steelHouseConversionPixel =
                    '<script type="text/javascript">' +
                    '(function(){var x=null,p,q,m,' +
                    'o="31153",' +
                    'l="' + getWidget.koOrderID() + '",' +
                    'i="' + getWidget.koTotal() + '",' +
                    'c="",' +
                    'k="' + getWidget.koTrackingProductIDs() + '",' +
                    'g="' + getWidget.koTrackingproductQuanties() + '",' +
                    'j="' + getWidget.koTrackingproductUnitPrices() + '",' +
                    'u="",' +
                    'shadditional="";' +
                    'try{p=top.document.referer!==""?encodeURIComponent(top.document.referrer.substring(0,512)):""}catch(n){p=document.referrer!==null?document.referrer.toString().substring(0,512):""}try{q=window&&window.top&&document.location&&window.top.location===document.location?document.location:window&&window.top&&window.top.location&&""!==window.top.location?window.top.location:document.location}catch(b){q=document.location}try{m=parent.location.href!==""?encodeURIComponent(parent.location.href.toString().substring(0,512)):""}catch(z){try{m=q!==null?encodeURIComponent(q.toString().substring(0,512)):""}catch(h){m=""}}var A,y=document.createElement("script"),w=null,v=document.getElementsByTagName("script"),t=Number(v.length)-1,r=document.getElementsByTagName("script")[t];if(typeof A==="undefined"){A=Math.floor(Math.random()*100000000000000000)}w="dx.steelhousemedia.com/spx?conv=1&shaid="+o+"&tdr="+p+"&plh="+m+"&cb="+A+"&shoid="+l+"&shoamt="+i+"&shocur="+c+"&shopid="+k+"&shoq="+g+"&shoup="+j+"&shpil="+u+shadditional;y.type="text/javascript";y.src=("https:"===document.location.protocol?"https://":"http://")+w;r.parentNode.insertBefore(y,r)}());' +
                    '</script>';
                $("body").append(steelHouseConversionPixel);
                /* steel house tracking pixel script ends*/




                /*google customer review implementation starts*/

                var googleCusomerReviewScript = '<script src="https://apis.google.com/js/platform.js?onload=renderOptIn" async defer></script>';
                $("body").append(googleCusomerReviewScript);

                var googleCusomerReview = '<script>' +
                    'window.renderOptIn = function() {' +
                    'window.gapi.load("surveyoptin", function(){' +
                    'window.gapi.surveyoptin.render({' +
                    '"merchant_id": 120624534,' +
                    '"order_id": "' + getWidget.koOrderID() + '",' +
                    '"email": "' + getWidget.koEmail() + '",' +
                    '"delivery_country": "' + getWidget.koCountry() + '",' +
                    '"estimated_delivery_date": "' + getWidget.koOrderSubmittedTime() + '"' +
                    '});' +
                    '});' +
                    '}' +
                    '</script>';
                //console.log(googleCusomerReview , 'googleCusomerReview');
                $("body").append(googleCusomerReview);

                /* BEGIN GCR Language Code */
                var gcrLanguageCode = '<script>' +
                    'window.___gcfg = {' +
                    'lang: "en_US"' +
                    '};' +
                    '</script>';
                $("body").append(gcrLanguageCode);
                /* End GCR Language Code */


                /*google customer review implementation ends*/

                //ends

                if (widget.confirmation()) {

                    // Create observable to mark the resources loaded, if it's not already there
                    if (typeof widget.checkoutResourcesLoaded == 'undefined') {
                        widget.checkoutResourcesLoaded = ko.observable(false);
                    }

                    // i18n strings required for table summary attributes
                    widget.yourOrderText = ko.computed(function() {
                        if (widget.checkoutResourcesLoaded()) {
                            var messageText = CCi18n.t(
                                'ns.checkoutconfirmation:resources.yourOrderText', {}
                            );
                            return messageText;
                        } else {
                            return '';
                        }

                    }, widget);

                    widget.shipToText = ko.computed(function() {
                        if (widget.checkoutResourcesLoaded()) {
                            var messageText = CCi18n.t(
                                'ns.checkoutconfirmation:resources.shipToText', {}
                            );
                            return messageText;
                        } else {
                            return '';
                        }

                    }, widget);

                    widget.shippingMethodText = ko.computed(function() {
                        if (widget.checkoutResourcesLoaded()) {
                            var messageText = CCi18n.t(
                                'ns.checkoutconfirmation:resources.shippingMethodText', {}
                            );
                            return messageText;
                        } else {
                            return '';
                        }

                    }, widget);

                    // Parameterized i18n strings
                    widget.orderDate = ko.computed(function() {
                        var submissionDate = widget.confirmation().submittedDate ? widget.confirmation().submittedDate : widget.confirmation().creationDate;
                        var orderDateString = widget.ccDate(widget.confirmation().creationDate, submissionDate, null, null, CCConstants.MEDIUM);
                        return orderDateString;

                    }, widget);

                    widget.orderTime = ko.computed(function() {
                        var submissionDate = widget.confirmation().submittedDate ? widget.confirmation().submittedDate : widget.confirmation().creationDate;
                        var orderTimeString = widget.ccDate(widget.confirmation().creationDate, submissionDate, null, null, CCConstants.TIME);
                        return orderTimeString;

                    }, widget);

                    widget.thankyouMsg = ko.computed(function() {
                        if (widget.checkoutResourcesLoaded()) {
                            var linkText = CCi18n.t(
                                'ns.checkoutconfirmation:resources.thankyouMsg', {
                                    orderDate: widget.orderDate(),
                                    orderTime: widget.orderTime()
                                }
                            );
                            return linkText;
                        } else {
                            return '';
                        }

                    }, widget);

                    widget.orderNumberMsg = ko.computed(function() {
                        if (widget.checkoutResourcesLoaded()) {
                            var linkText = CCi18n.t(
                                'ns.checkoutconfirmation:resources.orderNumberMsg', {
                                    orderNumber: widget.confirmation().id
                                }
                            );
                            return linkText;
                        } else {
                            return '';
                        }

                    }, widget);
                }
                widget.handleInventorySurcharge();
            },
            appendScript: function(filepath) {
                if ($('head script[src="' + filepath + '"]').length > 0) {
                    return;
                }
                var ele = document.createElement('script');
                ele.setAttribute("type", "text/javascript");
                ele.setAttribute("src", filepath);
                ele.async = true;
                $('head').append(ele);
            },
            calculateNewCustomer: function(widget) {
                //console.log('calculateNewCustomer working');
                widget = getWidget;
                var firstVisitDate = widget.user().firstVisitDate();

                if (firstVisitDate != null) {

                    var today = new Date();
                    var dd = today.getDate();
                    var mm = today.getMonth() + 1; //January is 0!
                    var yyyy = today.getFullYear();
                    var newFlag = false;

                    if (dd < 10) {
                        dd = '0' + dd
                    }

                    if (mm < 10) {
                        mm = '0' + mm
                    }


                    today = yyyy + '-' + mm + '-' + dd;

                    var todaysDate = new Date(today);
                    var CurrentDate = new Date(firstVisitDate);
                    var diffDays = parseInt((todaysDate - CurrentDate) / (1000 * 60 * 60 * 24));
                    //console.log(diffDays,'diffDays');
                    if ((diffDays >= 0) && (diffDays <= 90)) {
                        widget.koNewCustomer('1');

                    } else {
                        widget.koNewCustomer('0');
                    }
                }


            },
            beforeAppear: function(page) {

                getWidget.koOrderID(getWidget.confirmation().id),
                    getWidget.koTotal(getWidget.confirmation().priceInfo.total),
                    getWidget.koSubTotal(getWidget.confirmation().priceInfo.subTotal),
                    getWidget.koZipcode(getWidget.confirmation().shippingAddress.postalCode),
                    getWidget.koTax(getWidget.confirmation().priceInfo.tax),
                    getWidget.koShipping(getWidget.confirmation().priceInfo.shipping),
                    getWidget.koCity(getWidget.confirmation().shippingAddress.city),
                    getWidget.koState(getWidget.confirmation().shippingAddress.state),
                    getWidget.koCountry(getWidget.confirmation().shippingAddress.country),
                    getWidget.koEmail(getWidget.confirmation().shippingAddress.email),
                    getWidget.koNickName(getWidget.confirmation().shippingAddress.firstName),
                    getWidget.koLocale(getWidget.confirmation().orderLocale)
                var submitedDate = moment(getWidget.confirmation().submittedDate).format("YYYY-MM-DD");
                getWidget.koOrderSubmittedTime(submitedDate);

                var totalWithDisount = getWidget.koSubTotal() - getWidget.koDiscount();
                getWidget.kototalWithDisount(totalWithDisount);




                /*Add Shopper Starts*/
                window.AddShoppersConversion = {
                    order_id: getWidget.koOrderID(),
                    value: getWidget.koTotal()
                }
                window.AddShoppersWidget.track_conv();

                $.Topic(pubsub.topicNames.PAGE_READY).subscribe(function() {
                    //$("script[id='AddShoppers']").remove();
                    var n = document.getElementById("AddShoppers");
                    if (n !== null) {
                        AddShoppersWidget.API.reload();
                    } else {
                        var js = document.createElement("script");
                        js.type = "text/javascript";
                        js.async = true;
                        js.id = "AddShoppers"
                        js.src = ("https:" == document.location.protocol ? "https://shop.pe/widget/" : "http://cdn.shop.pe/widget/") + "widget_async.js#5a036113d559300b568becb7";
                        document.getElementsByTagName("head")[0].appendChild(js);
                    }
                });
                /*Add Shopper Ends*/




                //Attentive Tag Order confirmation
                var attentiveData = {};
                var attentiveItems = [];
                var attentiveCartItems = getWidget.confirmation().shoppingCart.items;


                for (var i = 0; i < attentiveCartItems.length; i++) {

                    var itemsobj = {};
                    var priceObj = {};
                    itemsobj.productId = attentiveCartItems[i].productId;
                    itemsobj.productVariantId = attentiveCartItems[i].catRefId;
                    itemsobj.name = attentiveCartItems[i].displayName;
                    itemsobj.productImage = 'https://www.petmate.com' + attentiveCartItems[i].primaryThumbImageURL;
                    itemsobj.quantity = attentiveCartItems[i].quantity;
                    itemsobj.category = getWidget.koCategory();
                    priceObj.value = attentiveCartItems[i].unitPrice;
                    priceObj.currency = 'USD';
                    itemsobj.price = priceObj;
                    attentiveItems.push(itemsobj);
                }
                attentiveData.items = attentiveItems;

                var orderObj = {};

                orderObj.orderId = getWidget.koOrderID();

                attentiveData.order = orderObj;

                window.attentive.analytics.purchase(attentiveData)

                /*Ends*/
                /*Side Car Implementation*/
                var sidecarData = {};
                sidecarData.add = true;

                var dataobj = {};
                dataobj.order_id = getWidget.koOrderID();
                dataobj.subtotal = getWidget.koSubTotal();
                dataobj.tax = getWidget.koTax();
                dataobj.shipping = getWidget.koShipping();
                dataobj.discounts = getWidget.koDiscount();
                dataobj.total = getWidget.koTotal();
                dataobj.zipcode = getWidget.koZipcode();
                sidecarData.data = dataobj;



                //Items

                var sidecarItems = [];
                var shoppingcartItems = getWidget.confirmation().shoppingCart.items;

                for (var i = 0; i < shoppingcartItems.length; i++) {
                    //console.log(shoppingcartItems[i],'shoppingcartItems.length');
                    var itemsobj = {};
                    itemsobj.product_id = shoppingcartItems[i].productId;
                    itemsobj.unit_price = shoppingcartItems[i].unitPrice;
                    itemsobj.quantity = shoppingcartItems[i].quantity;
                    sidecarItems.push(itemsobj);
                }
                sidecarData.items = sidecarItems;

                //Discounts

                var sidecarDiscounts = [];
                var shoppingcartDiscounts = getWidget.confirmation().discountInfo.orderDiscountDescList;

                for (var i = 0; i < shoppingcartDiscounts.length; i++) {
                    //console.log(shoppingcartDiscounts[i],'shoppingcartItems.length');
                    var discountsobj = {};
                    discountsobj.name = shoppingcartDiscounts[i].promotionName;
                    discountsobj.amount = shoppingcartDiscounts[i].totalAdjustment;
                    sidecarDiscounts.push(discountsobj);
                }
                sidecarData.discounts = sidecarDiscounts;



                //console.log('sidecarItems---------',sidecarItems);
                //console.log('dataobj-------',dataobj);
                var convertData = sidecarData; //JSON.stringify(sidecarData);
                window.sidecar = {};
                window.sidecar.transactions = convertData;

                /* $("script[id='sideCarOrder']").remove();
                  if ($("script[id='sideCarOrder']").length === 0) {
                    var sideCarOrder =  
                     '<script id="sideCarOrder"  type="text/javascript">' +
            		'var sidecar = sidecar || {};' +
            		'sidecar.transactions = ' + JSON.stringify(sidecarData) + '</script>'
    
                       $('head').append(sideCarOrder);
                
                  }*/

                /*Ends*/




                var widget = this;
                var items = [];
                if (widget.confirmation && widget.confirmation() && widget.confirmation().shoppingCart) {
                    items = widget.confirmation().shoppingCart.items;
                }

                //Commenting Share a sale old pixel
                /*getPage = page;
                var imgurl = "https://shareasale.com/sale.cfm?amount=" + getWidget.kototalWithDisount() + "&tracking=" + getWidget.koOrderID() + "&transtype=sale&merchantID=74750&couponcode=" + getWidget.koProductPromoCode().toString();
                var img = $('<img id="shareaSaleTag" width="1" height="1">');
                img.attr('src', imgurl);
                img.appendTo('#petmate-order-confirmation');*/
                //Ends
                //getWidget.appendScript('https://apps.bazaarvoice.com/deployments/Petmate/main_site/production/en_US/bv.js');



                /*window.bvCallback = function(BV) {
                    BV.pixel.trackTransaction({
                        "orderId": getWidget.koOrderID(),
                        "total": getWidget.koTotal(), //(sum of all products' items * price with discounts applied, without the $ sign)
                        "currency": "USD",
                        "tax": getWidget.koTax(), //(tax amount without the $ sign)
                        "shipping": getWidget.koShipping(), //(shipping amount without the $ sign)
                        "city": getWidget.koCity(),
                        "state": getWidget.koState(),
                        "country": getWidget.koCountry(),
                        "items": getWidget.koshoppingCarItem(),
                        "userId": getWidget.user().id(),
                        "email": getWidget.user().email(),
                        "nickname": getWidget.user().firstName(),
                        "gender": getWidget.user().gender()
                    });
                };*/
                /*Pie Conversion*/


                if (getWidget.user().loggedIn()) {
                    window.bvCallback = function(BV) {
                        BV.pixel.trackTransaction({
                            "orderId": getWidget.koOrderID(),
                            "total": getWidget.koSubTotal(), //(sum of all products' items * price with discounts applied, without the $ sign)
                            "currency": "USD",
                            "tax": getWidget.koTax(), //(tax amount without the $ sign)
                            "shipping": getWidget.koShipping(), //(shipping amount without the $ sign)
                            "city": getWidget.koCity(),
                            "state": getWidget.koState(),
                            "country": getWidget.koCountry(),
                            "items": getWidget.koshoppingCarItem(),
                            "userId": getWidget.user().id(),
                            "email": getWidget.user().email(),
                            "nickname": getWidget.user().firstName(),
                            "gender": getWidget.user().gender()
                        });
                    };
                } else {
                    window.bvCallback = function(BV) {
                        BV.pixel.trackTransaction({
                            "orderId": getWidget.koOrderID(),
                            "total": getWidget.koSubTotal(), //(sum of all products' items * price with discounts applied, without the $ sign)
                            "currency": "USD",
                            "tax": getWidget.koTax(), //(tax amount without the $ sign)
                            "shipping": getWidget.koShipping(), //(shipping amount without the $ sign)
                            "city": getWidget.koCity(),
                            "state": getWidget.koState(),
                            "country": getWidget.koCountry(),
                            "items": getWidget.koshoppingCarItem(),
                            "email": getWidget.koEmail(),
                            "nickname": getWidget.koNickName()
                        });
                    };
                }


                /*Norton*/

                var norton =
                    '<script type="text/javascript">' +
                    'if (window._GUARANTEE && _GUARANTEE.Loaded) {' +
                    '_GUARANTEE.Guarantee.order ="' + getWidget.koOrderID() + '",' +
                    '_GUARANTEE.Guarantee.subtotal ="' + getWidget.koSubTotal() + '",' +
                    '_GUARANTEE.Guarantee.currency = "USD" ,' +
                    '_GUARANTEE.Guarantee.email    ="' + getWidget.koEmail() + '",' +
                    '_GUARANTEE.WriteGuarantee();' +
                    '}' +
                    '</script>';

                $("head").append(norton);

                /*Ends*/

                /*Ends*/

                if (widget.confirmation().state === CCConstants.PENDING_PAYMENT) {
                    widget.isPending(true);
                } else {
                    widget.isPending(false);
                }

                //remove the spinner
                $('#loadingModal').hide();
                spinner.destroy(0);
                if (widget.user().errorMessageKey() != '') {
                    notifier.sendError(widget.WIDGET_ID, widget.translate(widget.user().errorMessageKey()), true);
                } else if (widget.user().successMessageKey() != '') {
                    notifier.sendSuccess(widget.WIDGET_ID, widget.translate(widget.user().successMessageKey()));
                } else if (ccRestClient.getStoredValue(CCConstants.PAYULATAM_CHECKOUT_REGISTRATION) != null) {
                    var regStatus = ccRestClient.getStoredValue(CCConstants.PAYULATAM_CHECKOUT_REGISTRATION);
                    if (regStatus == CCConstants.PAYULATAM_CHECKOUT_REGISTRATION_SUCCESS) {
                        notifier.sendSuccess(widget.WIDGET_ID, widget.translate('loginSuccessText'));
                    } else if (regStatus == CCConstants.PAYULATAM_CHECKOUT_REGISTRATION_FAILURE) {
                        notifier.sendError(widget.WIDGET_ID, widget.translate('loginFailureText'), true);
                    }
                    ccRestClient.clearStoredValue(CCConstants.PAYULATAM_CHECKOUT_REGISTRATION);
                }
                widget.user().errorMessageKey('');
                widget.user().successMessageKey('');

                $.Topic("SIDECAR_RELOAD.memory").publish();

                //Share a sale get cookie
                $(document).ready(function() {
                    function readCookie(name) {
                        var nameEQ = name + "=";
                        var ca = document.cookie.split(';');
                        for (var i = 0; i < ca.length; i++) {
                            var c = ca[i];
                            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
                        }
                        return null;
                    }

                    readCookie('shareasaleSSCID');
                    var shareCookie = readCookie('shareasaleSSCID');
                    widget.koSscid(shareCookie);

                });

                //Ends

                //Append Share a sale
                widget.calculateNewCustomer();
                var shareImg = '<img id="_SHRSL_img_1" src="https://www.shareasale.com/sale.cfm?tracking=' + getWidget.koOrderID() + '&amount=' + getWidget.kototalWithDisount() + '&merchantID=74750&transtype=sale&couponcode=' + getWidget.koCouponCode() + '&skulist=' + getWidget.koTrackingProductIDs() + '&quantitylist=' + getWidget.koTrackingproductQuanties() + '&pricelist=' + getWidget.koTrackingproductUnitPrices() + '&newcustomer=' + getWidget.koNewCustomer() + '&currency=USD&sscid=' + getWidget.koSscid() + '&sscidmode=6&v=2.0" width="1" height="1">'

                var shareAnalytics = '<script defer async type="text/javascript" src="https://www.dwin1.com/19038.js"></script>'

                $('body').append(shareImg, shareAnalytics);

                //Upsellit Converison Tracking code

                getWidget.appendScript('https://www.upsellit.com/active/petmate_pixel.jsp?orderID=' + getWidget.koOrderID() + '&' + getWidget.koTotal() + '=' + getWidget.koSubTotal() + '');
            },

            handleInventorySurcharge: function() {
                var widget = this;
                var cartItems = widget.confirmation().shoppingCart.items;
                for (var i = 0; i < cartItems.length; i++) {
                    var catRefId = cartItems[i].catRefId;
                    var qty = cartItems[i].quantity;

                    var objNew = {
                        "id": widget.koOrderID(),
                        "items": [{
                            "catalogRefId": catRefId,
                            "quantity": qty
                        }]
                    }

                    $.ajax({
                        url: "/ccstorex/custom/petmate/v1/updateInventory", //external URL
                        type: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify(objNew), //data needs to be passed
                        async: false,
                        dataType: 'json',
                        success: function(data) {
                            //console.log("----------success data-------------", data);
                        },
                        error: function(data) {
                            //console.log(".......Error hosting.........", data);
                        }
                    });

                }
            },
            appendScript: function(filepath) {
                if ($('body script[src="' + filepath + '"]').length > 0) {
                    return;
                }
                var ele = document.createElement('script');
                ele.setAttribute("type", "text/javascript");
                ele.setAttribute("src", filepath);
                ele.setAttribute('async', '');
                $('body').append(ele);
            },
            getPaymentJsonObj: function(data) {
                return JSON.parse(data);
            },

            getCountryDisplayName: function(countryCd) {
                if (this.shippingCountries()) {
                    for (var i in this.shippingCountries()) {
                        var countryObj = this.shippingCountries()[i];
                        if (countryObj.countryCode === countryCd) {
                            return countryObj.displayName;
                        }
                    }
                }
                return "";
            },

            getStateDisplayName: function(countryCd, stateCd) {
                if (this.shippingCountries()) {
                    for (var i in this.shippingCountries()) {
                        var countryObj = this.shippingCountries()[i];
                        if (countryObj.countryCode === countryCd) {
                            for (var j in countryObj.regions) {
                                var stateObj = countryObj.regions[j];
                                if (stateObj.abbreviation === stateCd) {
                                    return stateObj.displayName;
                                }
                            }
                        }
                    }
                }
                return "";
            }
        };
    });