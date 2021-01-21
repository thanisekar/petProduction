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
    var orderJSON = {};
    var returnRequest = {};
    var requestJSON = {};
    var getWidget = "";
    var len;
    return {
      /*Order Return Variable*/
      orderReturn: ko.observable(),
      /*Order Return Request Variable*/
      returnReq: ko.observable(),
      returnListItems : ko.observableArray(),
      reasonArray: ko.observableArray(),
      returnVisible: ko.observable(false),
      qtyError: ko.observable(false),
      restrictNumber: function() {
           $("[type='number']").keypress(function (evt) {
                    evt.preventDefault();
            });
      },
        onLoad : function(widget) {
            getWidget = widget;
         
            widget.reasonArray(widget.returnReason().split(","));
         
                widget.returnReq(returnRequest);
          
                var tempReasonArray = widget.returnReason().split(",");
                var tempReasonArrayVal = [];
                for(var i=0;i<tempReasonArray.length;i++) {
                    var temp ={}
                    temp.key = camelize(tempReasonArray[i]);
                    temp.value = tempReasonArray[i];
                    tempReasonArrayVal.push(temp);
                }
                function camelize(str) {
                  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
                    return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
                  }).replace(/\s+/g, '');
                }
                widget.reasonArray(tempReasonArrayVal);
            
        },  
     
      beforeAppear: function (page) {
        var widget = this;
        
       
        /*Order Return PubSub*/
      
           
           $('body').delegate('#quantity', 'change', function() {
                var maxQty=$(this).attr('maxQty');
                   if($('#quantity').val()!='0' && $('#quantity').val()<=maxQty){
                        $(this).siblings('.error').html('');
                         $('.error-msg-display').html('');
                   }
                   
            });
       
            $('body').delegate('#quantity', 'keypress', function(e) {     
                   if (e.which !== 8 && e.which !== 0 && (e.which < 48 || e.which > 57)) {
            			//display error message
            			 $(this).siblings('.error').html('');
            			 $('.error-msg-display').html('');
            			 return false;
            		}
            });
         
            
            
            $('body').delegate('#selectmenu1', 'change', function() {
                 $(this).siblings('.error').html('');
                  $('.error-msg-display').html('');
            })
        
        
        
         $.Topic("returnRequest").subscribe(function(data){
                        getWidget.returnReq(data);
                    
                        $('#myaccount-orderDetail').attr("style", "display: none !important");
                        $("#returnRequest").show();
                        $("html, body").animate({ scrollTop: 0 }, "slow");
                        getWidget.returnListItems.push(getWidget.returnReq().shoppingCart.items);
                      
                        len = getWidget.returnListItems()[0].length;
                        $.Topic("returnHeader").publish(data);
                });
      },
      returnRequestForm : function(data) {
         
            var err = $('.product--return').find($('.error'));
                err.remove();
				$('.error-msg-display').html("");
				var errorQuantity = true;
                var errorReason = true;
                var redirectToReturn =false;
          
                $.each($('.order-Items-return'), function(){
                
                    var qty = $(this).find($('.Qty'));
                    var maxQty=$(this).find('.Qty').attr('maxQty');
					var reason = $(this).find($('.selectmenu1'));
					var reason1 = $(this).find('.selectmenu1 option:selected');
					if(reason1.val() !=''){
						errorReason = false;
					
					}
					if(qty.val()!= 0){
						errorQuantity = false;
						
					}
					if((reason1.val() != '') || (qty.val() !=0) || Number(qty.val()) > Number(maxQty)) {
					    
					    if(reason1.val() == '') {
					        $('<p class="error">Please select a reason</p>').insertAfter(reason);
					        redirectToReturn=true;
					    }
					    if(qty.val() <= 0) {
					         $('<p class="error">Please enter quantity</p>').insertAfter(qty);
					       redirectToReturn=true;
					    }
					    if(Number(qty.val()) > Number(maxQty) ){
					        $('<p class="error">Return quantity cannot be greater original order quantity of '+ maxQty +'</p>').insertAfter(qty);
					        redirectToReturn=true;
					    }
					   
					}
					if(typeof $('.error').first().offset() !== 'undefined') {
                                $('html, body').animate({
                                    scrollTop: ($('.error').first().offset().top - 300)
                                }, 1000);
                            }
					
                });
			   	if(errorQuantity && errorReason ) {
        				   $('.error-msg-display').html("Please enter Quantity and reason for any of the order want to retrun");
        				             $('html, body').animate({
                                    scrollTop:0
                                }, 1000);

        	   }
        	   if(redirectToReturn || errorQuantity || errorReason){
        	      
        	         return false;
        	        
        	   }
        	requestJSON.returnRequest = {};
            requestJSON.returnRequest.orderId = getWidget.returnReq().id;
            requestJSON.returnRequest.returnItemsList = [];
            var skuIDs = [];
            var quant = [];
            var reasonss = [];
            var maxQuanty = [];
            $(".selectmenu1").each(function() {
                var reason = $(this).val();
                var item = [];
                item["returnReason"] = reason;
                reasonss.push(item);
            });
            $(".skuID").each(function(){
               var sku = $(this).text();
               //console.log("SKU", sku);
               var item = [];
               item['catRefId'] = sku;
               skuIDs.push(item);
            });
            $(".product-quantity-input--return").each(function(){
               var q = $(this).val();
               //console.log(q + 'quantity')
               var item = [];
               item['quantityToReturn'] = q;
               quant.push(item);
              // //console.log(quant,'........qty........');
             
            });
              
            for(var i = 0; i<len; i++) {
                requestJSON.returnRequest.returnItemsList[i] = $.extend({}, skuIDs[i], quant[i], reasonss[i]);
            }
            //var returnReqURL = getWidget.returnPostURL();
           // //console.log('RequestReturn', requestJSON.returnRequest);
            var itemLength = requestJSON.returnRequest.returnItemsList.length;
            var temp =[];
            for(var i =0; i<itemLength; i++) {
                //console.log(requestJSON.returnRequest.returnItemsList[i].quantityToReturn,'quantity');
                //console.log(requestJSON.returnRequest.returnItemsList[i].maxQuantity,'maxqty');
                if(requestJSON.returnRequest.returnItemsList[i].quantityToReturn !== '0' && requestJSON.returnRequest.returnItemsList[i].returnReason !== '') {
                    temp.push(requestJSON.returnRequest.returnItemsList[i]);
                }
            }
           // //console.log('tempdata', temp);
            //var copyItem = requestJSON.returnRequest.returnItemsList;
            requestJSON.returnRequest.returnItemsList = temp;
         
            var db = {};
            //db = requestJSON; //JSON.parse(unescape(JSON.stringify(requestJSON)));
            db = JSON.stringify(requestJSON);
            //$.extend( db, requestJSON );
           // //console.log('DB 2', db);
            if(requestJSON.returnRequest.returnItemsList.length > 0) {
                var loginUrl = getWidget.loginURL();
                var user =
                    {
                        username: getWidget.userName(),
                        password: getWidget.password()
                    }
                    /*//console.log('loginUrl',loginUrl);
                    //console.log('usr',user);*/
         
                $.ajax({                                          // ç Ajax call to get the token
                    url: loginUrl,
                    type: "POST",
                    data: user,
                    async: false,
                    success: function(data) {
                        //console.log("Received access token :: " + data);
                        $.ajax({
                                url: getWidget.returnPostURL(),
                                method: "POST",
                                contentType: "application/json",
                                dataType:"json",
                                data: db,
                                beforeSend: function(xhr) { xhr.setRequestHeader('Authorization', data.id); },
                                async: false,
                                success: function(data) {
                                    //console.log('Data', data);
                                    $("#returnRequest").hide();
                                    $("#returnHeader").hide();
                                    $("#returnSuccess").show();
                                    $('.error-msg-display').html('');
                                },
                                 error: function (jqXHR, exception) {
                                     //console.log('Data', data);
                                    //console.log(jqXHR);
                                   // //console.log(exception);
                                    getWidget.getErrorMessage(jqXHR, exception);
                                    $('.error-msg-display').html('');
                                }
                            });
                    },
                    error: function(data, status) {
                                //console.log("Login Failed");
                            }
                });
        
                /*$.ajax({
                        url: getWidget.returnPostURL(),
                        method: "POST",
                        contentType: "application/json",
                        dataType:"json",
                        data: db,
                        success: function(data) {
                            $("#returnRequest").hide();
                            $("#returnHeader").hide();
                            $("#returnSuccess").show();
                            $('.error-msg-display').html('');
                        },
                         error: function (jqXHR, exception) {
                            //console.log(jqXHR);
                           // //console.log(exception);
                            getWidget.getErrorMessage(jqXHR, exception);
                            $('.error-msg-display').html('');
                        }
                    });*/
            } 
        	
           // //console.log(requestJSON);
      },
      getErrorMessage : function(jqXHR, exception) {
           var msg = '';
            msg = jqXHR.responseJSON.error.message;
            if (jqXHR.responseJSON.error.message.status == 500) {
                msg = jqXHR.responseJSON.error.message.message;
            }
            else if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                //msg = 'Internal Server Error [500].';
                msg = jqXHR.responseJSON.error.message;
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            $('#returnRequest').html(msg);
            var body = $("html, body");
            body.stop().animate({scrollTop:0}, '500', 'swing', function() { });
      },
      clickCancel : function() {
        $('#myaccount-orderDetail').attr("style", "display: block !important");
        $("#returnRequest").hide();
        $("#returnHeader").hide();
      },
      returnOrder : function() {
          /*window.location = "/orderHistory";*/
         // //console.log("Return User ++++++++++++++++", getWidget.user());
      }
     
    
    }
    
  });	 	