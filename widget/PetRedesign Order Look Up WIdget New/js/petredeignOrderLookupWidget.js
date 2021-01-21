define(

    //-------------------------------------------------------------------
    // DEPENDENCIES
    //-------------------------------------------------------------------
    ['jquery', 'knockout', 'pubsub', 'notifier', 'CCi18n', 'ccConstants', 'navigation', 'ccRestClient', 'spinner'],

    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function($, ko, pubsub, notifier, CCi18n, CCConstants, navigation, ccRestClient, spinner) {

        "use strict";
        var getWidget = "";
        var pageDetail = "";
        /*var len;
        var returnRequest = {};
        var requestJSON = {};*/
        return {
            orderDetailsArray:ko.observable(),
            orderId: ko.observable(),
            email: ko.observable(),
            orderDate :  ko.observable(),
            /*returnReq: ko.observable(),
      returnListItems : ko.observableArray(),*/
            onLoad: function(widget) {
                getWidget = widget;
               //console.log('Page in WIdget', widget);
            },
            getPaymentJsonObj: function(data) {
              return JSON.parse(data);  
            },
            
            //Destroy Spinner
            destroySpinner: function() {
                  $('#loadingModal').hide();
                  spinner.destroy();
              },
            
            
            beforeAppear: function(page) {
               // //console.log("beforeAppear activated");
               // //console.log('Page!!!!', page);
                pageDetail = page;
                 var para = pageDetail.contextId;
               // //console.log('Para!!!!!!', para);
                var params = [];
                params = para.split(',');
               // //console.log('Params', params);
                getWidget.orderId(params[0]);
                getWidget.email(params[1]);
                //console.log('Emails & OrderID', getWidget.orderId(), getWidget.email());
                //widget.orderDetailsArray(data);
                //console.log("orderDetailsArray", getWidget.orderDetailsArray());
               // //console.log('Emails & OrderID', getWidget.orderId(), getWidget.email());
                 getWidget.orderLookUp();
            },
            
            
              guestreorderAddToCart: function(data ,event){
                  
                 //console.log(data , '----data ----');
                 //console.log('guest reorderAddtoCart');
                    var quantity = data.quantity;
                    var skuId = data.catRefId;
                    var productId = data.productId;
                    var displayName = data.displayName;
                    var thumbUrl = data.primaryThumbImageURL;
                    var a = CCConstants.ENDPOINT_PRODUCTS_GET_PRODUCT;
                    var l = {};
                    var p = productId;
                    var output = [];
                    ccRestClient.request(a, l, function(output) {
                        var skuItem = {};
                        for (var index in output.childSKUs) {
                            if (skuId == output.childSKUs[index].repositoryId) {
                                skuItem = output.childSKUs[index];
                            }
                        }

                        var t = [];
                        var result = {};
                        for (var variant in output.productVariantOptions) {
                            t.push({
                                optionName: output.productVariantOptions[variant].optionName,
                                optionValue: skuItem[output.productVariantOptions[variant].optionId]
                            });
                        }

                        result = {
                            selectedOptions: t
                        };

                        var s = $.extend(!0, {}, output, result);
                        s.childSKUs = [skuItem], s.orderQuantity = parseInt(quantity, 10);
                        $.when($.Topic(pubsub.topicNames.CART_ADD).publishWith(s, [{
                            message: "success"
                        }])).then(function() {
                            if (pageDetail === 'guestorderdetails') {
                                window.location = '/cart';
                            }
                        });
                    }, function(output) {
                        output.status == 404 ? i.goTo("404") : u && output && u(output);
                    }, p);

         },
              orderLookUp: function(){
                    //console.log('Emails & OrderID Inside Function', getWidget.orderId(), getWidget.email());
                    var loginUrl = getWidget.loginURL();
                    var user =
                        {
                            username: getWidget.userName(),
                            password: getWidget.password()
                        };
                    var getOrderUrl = getWidget.getOrderURL();
                    $.ajax({                                          // ç Ajax call to get the token
                        url: loginUrl,
                        type: "POST",
                        data: user,
                        async: false,
                        success: function(data) {
                            //console.log("Received access token :: " + data.id);
                            $.ajax({                                                      //  ç Ajax call to getorder Api
                                   url: getOrderUrl + '/' + getWidget.orderId() + '?email=' + getWidget.email(),
                                   beforeSend: function(xhr) { xhr.setRequestHeader('Authorization', data.id); },
                                    async: false,
                                    dataType: 'json',
                                    type: 'GET',
                                   success: function(data) {
                                       getWidget.destroySpinner();
                                        getWidget.orderDetailsArray(data);
                                       //console.log('Order Details', getWidget.orderDetailsArray());
                                        var date = new Date(getWidget.orderDetailsArray().submittedDate);
                                        getWidget.orderDate((date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear());
                                   },
                                   error: function (jqXHR, exception) {
                                        //console.log(jqXHR);
                                        //console.log(exception);
                                        getWidget.getErrorMessage(jqXHR, exception);
                                    }
                                   
                                });
                        },
                        error: function(data, status) {
                                    //console.log('Login Failed');
                                }
                    });
                    /*$.ajax({
                       url: "https://b2c-uat.petmate.com/b2c/api/v1/orders/getorder/" + getWidget.orderId() + '?email=' + getWidget.email(),
                        error: function (jqXHR, exception) {
                            //console.log(jqXHR);
                            //console.log(exception);
                            getWidget.getErrorMessage(jqXHR, exception);
                        },
                       dataType: 'json',
                       success: function(data) {
                            getWidget.orderDetailsArray(data);
                           // //console.log('Order Details', getWidget.orderDetailsArray());
                            var date = new Date(getWidget.orderDetailsArray().submittedDate);
                            getWidget.orderDate((date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear());
                       },
                       type: 'GET'
                    });*/
      
            },
              getErrorMessage: function(jqXHR, exception) {
              /*  if (jqXHR.status === 0) {
                    alert('Not connect.\n Verify Network.');
                } else if (jqXHR.status == 404) {
                    alert('Requested page not found. [404]');
                } else if (jqXHR.status == 500) {
                    alert('Internal Server Error [500].');
                } else if (exception === 'parsererror') {
                    alert('Requested JSON parse failed.');
                } else if (exception === 'timeout') {
                    alert('Time out error.');
                } else if (exception === 'abort') {
                    alert('Ajax request aborted.');
                } else {
                    alert('Uncaught Error.\n' + jqXHR.responseText);
                }*/
                //console.log('JqXHR', jqXHR);
                var msg = jqXHR.responseJSON.error.message;
                //console.log('Error Msg', msg);
            },
        }
    }
);