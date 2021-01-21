/**
 * @fileoverview Order History Details.
 * 
 * @author shsatpat
 */
define(
 
  //-------------------------------------------------------------------
  // DEPENDENCIES
  //-------------------------------------------------------------------
  ['knockout', 'spinner', 'pubsub', 'notifier', 'CCi18n', 'ccConstants', 'navigation', 'ccRestClient', 'jquery',  'viewModels/paymentsViewModel'],
    
  //-------------------------------------------------------------------
  // MODULE DEFINITION
  //-------------------------------------------------------------------
  function(ko, spinner, pubsub, notifier, CCi18n, CCConstants, navigation, ccRestClient, $, paymentsContainer) {
  
    "use strict";
    var orderJSON = {};
    var returnRequest = {};
    var getWidget = "";
    var returnSummaryLink;
    var pageDetails;
    return {

      /* Widget Upgrade Code */
      /** Widget root element id */
      WIDGET_ID: 'orderDetailsRegion',
        /** Default options for creating a spinner on price*/
        orderDetailsBodyIndicator: '#CC-orderDetails-body',
        selectedOrder: ko.observable(),
        orderDetailsBodyIndicatorOptions : {
          parent:  '#CC-orderDetails-body',
          posTop: '50%',
          posLeft: '50%'
        },
        display : ko.observable(true),
      /* End Widget Upgrade Code */

      coupons: ko.observableArray(),
      /*Order Return Variable*/
      orderReturn: ko.observable(),
      koShippingType: ko.observable(),
      /*Order Return Request Variable*/
      returnReq: ko.observable(),
      getOrderData: ko.observable(),
      fetchOrderPaymentInfo:ko.observableArray([]),
      returnListItems : ko.observableArray(),
      getPaymentJsonObj: function(data) {
              return JSON.parse(data);  
            },
      returnVisible: ko.observable(false),
        returnHistory : function() {
            returnSummaryLink = getWidget.returnSummaryLink();
            	    $.get(returnSummaryLink + getWidget.orderDetails().id , function(data){
            	     var db;
            	     try {
                            db = JSON.parse(data); 
                        } catch (e) {
                            db = data;
                        }
            	      getWidget.orderReturn(db);
            	    });  
            	    
            	   setTimeout(function(){
                    getWidget.destroySpinner();
                },3000)
            	    
        },
        
            getShippingType: function(data){
                    var newStr;
                    var str = data;
                    if(data!=undefined){
                         if(str.indexOf(':')!='-1'){
                                str = str.split(":");
                                newStr = str[0]+' '+str[1];
                                return newStr;
                         }
                         else{
                                return str;
                         }
                       
                    }
                 
        },
        
        onLoad : function(widget) {
            getWidget = widget;
            getWidget.returnHistory();
            getWidget.fetchPaymentInfo();
            getWidget.createSpinner();

            /* Widget Upgrade Code */
              var isModalVisible = ko.observable(false);
              var isModalNoClicked = ko.observable(false);
              var isModalYesClicked = ko.observable(false);
              
              widget.display(false);
              widget.hideModal = function () {
                    if(isModalVisible()) {
                      $("#CC-orderDetails-modal").modal('hide');
                      $('body').removeClass('modal-open');
                      $('.modal-backdrop').remove();
                    }
                  };
                
                widget.showModal = function () {
                if($("#CC-orderDetails-modal").length){
                    $("#CC-orderDetails-modal").modal('show');
                    $('#CC-orderDetails-modal').on('hidden.bs.modal', function () {
                        if((!isModalYesClicked() && !isModalNoClicked() && isModalVisible())) {
                      $("#CC-orderDetailsContextChangeMsg").show();
                        }
                    });
                    isModalVisible(true);
                }
                else{
                  setTimeout(widget.showModal, 50);
                }
                };
              
                widget.handleModalYes = function () {
                    isModalYesClicked(true);
                    widget.cart().clearCartForProfile();
                    ccRestClient.setStoredValue(
                    CCConstants.LOCAL_STORAGE_ORGANIZATION_ID, ko
                      .toJSON(this.orderDetails().organizationId));
                    widget.hideModal();
                    window.location.assign(window.location.href);
                    widget.cart().loadCartForProfile();
                  };
                  
                widget.handleModalNo = function () {
                  isModalNoClicked(true);
                    $("#CC-orderDetailsContextChangeMsg").show();
                    widget.hideModal();
                    };

                // Define a create spinner function with spinner options
                widget.createSpinner = function(pSpinner, pSpinnerOptions) {
                  $(pSpinner).css('position', 'fixed');
                  $(pSpinner).addClass('loadingIndicator');
                  spinner.create(pSpinnerOptions);
                };

                // Define a destroy spinner function with spinner id
                widget.destroySpinner = function(pSpinnerId) {
                  $(widget.orderDetailsBodyIndicator).css('position', 'relative');
                  $(pSpinnerId).removeClass('loadingIndicator');
                  $('#loadingModal').hide();  
                  spinner.destroyWithoutDelay(pSpinnerId);
                  
                };
            /* End widget upgrade code */

          widget.isGiftCardUsed = ko.computed(
                  function() {
                    if (widget.orderDetails()) {
                      var payments = widget.orderDetails().payments;
                      for ( var i = 0; i < payments.length; i++) {
                        /* Widget Upgrade code change in if added && */
                        if (payments[i].paymentMethod == CCConstants.GIFT_CARD_PAYMENT_TYPE && payments[i].paymentState == CCConstants.PAYMENT_GROUP_STATE_AUTHORIZED) {
                          return true;
                        }
                      }  
                    }
                  }, widget);
          
          /* Widget Upgrade Code */
          widget.isScheduledOrder = ko.computed(
            function() {
              if (widget.orderDetails()) {
                if(widget.orderDetails().scheduledOrderName){
                  return true;
                }
              }
          }, widget);
          /* End widget Upgrade Code */

          widget.totalAmount = ko.computed(
                  function() {
                    if (widget.orderDetails()) {
                      var payments = widget.orderDetails().payments;
                      var remainingTotal = 0;
                      for ( var i = 0; i < payments.length; i++) {
                        if (payments[i].paymentMethod != CCConstants.GIFT_CARD_PAYMENT_TYPE) {
                          remainingTotal += payments[i].amount;
                        }
                      }
                    }
                    return remainingTotal;
                  }, widget);
                  
            /*Order Return History*/
                 widget.returnReq(returnRequest);
            /*End of Order Return Request*/
            
            /*Check for return status*/
            if(widget.orderDetails().orderStatus != "Submitted to fulfillment") {
                widget.returnVisible(true);
            }

            /* Widget Upgrade Code Change */
              widget.approverName = ko.computed(
                function(){
                  if(widget.orderDetails() && widget.orderDetails().approvers){
                    var approver=widget.orderDetails().approvers[0];
                    if(approver.lastName != null){
                      return approver.firstName + " " + approver.lastName;
                    } else{
                      return approver.firstName;
                }
                  }
                  return null;
                },widget);
    
              widget.approverMessage=ko.computed(
                function(){
                  if(widget.orderDetails() && widget.orderDetails().approverMessages && widget.orderDetails().approverMessages.length > 0){
                    return widget.orderDetails().approverMessages[0];
                  }
                  return CCConstants.NO_COMMENTS;
                },widget);
    
              widget.claimedCouponMultiPromotions = ko.pureComputed(
                function() {
                  var coupons = new Array();
                  if (widget.orderDetails()) {
                    if (widget.orderDetails().discountInfo) {
                      for (var prop in widget.orderDetails().discountInfo.claimedCouponMultiPromotions) {
                        var promotions = widget.orderDetails().discountInfo.claimedCouponMultiPromotions[prop];
                        var couponMultiPromotion = [];
                        couponMultiPromotion.code = prop;
                        couponMultiPromotion.promotions = promotions;
                        coupons.push(couponMultiPromotion);
                      }
                    }
                  }
                return coupons;
              }, widget);
    
              /**
               * Function to check if complete Payment button should be displayed.
               */
              widget.isEligibleToCompletePayment = ko.computed(
                function(){
                    //identify pending authorization payment group existence first for payU case
                    var pendingAuthPaymentGroup = false;
                    if(widget.orderDetails() && widget.orderDetails().payments){
                      var payments = widget.orderDetails().payments;
                      for ( var i = 0; i < payments.length; i++) {
                        if(payments[i].paymentState == CCConstants.PENDING_AUTHORIZATION){
                          pendingAuthPaymentGroup = true;
                          break;
                        }
                      }
                    }
                    // If order is pending payment and belongs to current user and does not
                    //have pending authorization Payment Group then allow him to make payments
                    if(widget.orderDetails() && widget.user() && widget.orderDetails().priceInfo &&
                      widget.orderDetails().state == CCConstants.ORDER_STATE_PENDING_PAYMENT &&
                      widget.orderDetails().orderProfileId == widget.user().id() &&
                      !pendingAuthPaymentGroup && widget.orderDetails().priceInfo.total > 0){
                      return true;
                    }
                  return false;
                },widget);
              
              // To append locale for scheduled orders link
              widget.detailsLinkWithLocale = ko.computed(
                function() {
                  return navigation.getPathWithLocale('/scheduledOrders/');
              }, widget);
              
              widget.populatePaymentsViewModel = function() {
                var widget = this;
                var authorizedAmount = 0;
                var completedPayments = [];
                var currency = widget.site().selectedPriceListGroup().currency.symbol;
                  
                for (var i=0; i<widget.orderDetails().payments.length; i++) {
                  if (widget.orderDetails().payments[i].paymentState == CCConstants.PAYMENT_GROUP_STATE_AUTHORIZED ||
                      widget.orderDetails().payments[i].paymentState == CCConstants.PAYMENT_GROUP_STATE_PAYMENT_REQUEST_ACCEPTED ||
                      widget.orderDetails().payments[i].paymentState == CCConstants.PAYMENT_GROUP_PAYMENT_DEFERRED ||
                      widget.orderDetails().payments[i].paymentState == CCConstants.PAYMENT_GROUP_STATE_SETTLED) {
                    authorizedAmount = parseFloat(authorizedAmount) + parseFloat(widget.orderDetails().payments[i].amount);
                    completedPayments.push(widget.generateCompletedPaymentsText(widget.orderDetails().payments[i], currency));
                  }
                }
                var dueAmount = parseFloat(widget.orderDetails().priceInfo.total) - parseFloat(authorizedAmount);
                // Update Payments View Model
                var paymentsViewModel = paymentsContainer.getInstance();
                // Reset the view model before adding the completed payments
                paymentsViewModel.resetPaymentsContainer();
                paymentsViewModel.paymentDue(dueAmount);
                widget.cart().total(dueAmount);
                paymentsViewModel.historicalCompletedPayments(completedPayments);
                widget.user().isHistoricalOrder = true;
              };
                
              widget.generateCompletedPaymentsText = function(pPaymentData, currency) {
                var type;
                var maskedNumber;
                if (pPaymentData.paymentMethod == CCConstants.TOKENIZED_CREDIT_CARD || pPaymentData.paymentMethod == CCConstants.CREDIT_CARD) {
                  if(pPaymentData.cardType) {
                    type = pPaymentData.cardType;
                  } else {
                    type = CCConstants.CREDIT_CARD_TEXT;
                  }
                  maskedNumber = pPaymentData.cardNumber;
                } else if (pPaymentData.paymentMethod == CCConstants.GIFT_CARD_PAYMENT_TYPE) {
                  type = CCConstants.GIFT_CARD_TEXT;
                  maskedNumber = pPaymentData.maskedCardNumber;
                } else if (pPaymentData.paymentMethod == CCConstants.CASH_PAYMENT_TYPE) {
                  type = CCConstants.CASH_PAYMENT_TYPE;
                  maskedNumber = "";
                } else if(pPaymentData.paymentMethod == CCConstants.INVOICE_PAYMENT_METHOD) {
                  type = CCConstants.INVOICE_PAYMENT_TYPE;
                  maskedNumber = pPaymentData.PONumber;
                }
    
                return (currency + pPaymentData.amount + widget.translate("toBeChargedPaymentText", {type: type, number: maskedNumber}));
              };
    
              widget.pendingApprovalReasons = ko.computed(
                function() {
                  if (widget.orderDetails()) {
                    var orderDetails = widget.orderDetails();
                    if(orderDetails.approvalSystemMessages){
                      return orderDetails.approvalSystemMessages;
                    }
                  }
                  return null;
              }, widget);
            /* End of widget Upgrade Code */

        },  
        /* Widget Upgrade Code Change */
        completePayment: function(){
          var widget = this;
          widget.populatePaymentsViewModel();

          this.cart().currentOrderId(this.orderDetails().id);
          this.cart().currentOrderState(this.orderDetails().state);
          this.user().validateAndRedirectPage(this.links().checkout.route+"?orderId="+this.orderDetails().id); 
        },
        /* End widget Upgrade Code Change */
    
        getReturn : function(data) {
             $("#returnRequest").css("display","block");
             $("#myaccount-orderDetail").css("display", "none");
             getWidget.returnListItems(data.items);
        },
        createReturnList : function() {
            this.productDetails = ko.observable('');
            this.quantity = ko.observable('');
            this.returnReason = ko.observable('');
        },
      cancelReturn : function() {
          $("#returnRequest").css("display","none");
          
      },
      beforeAppear: function (page) {
          
           pageDetails = page.pageId;
           
       
     
		
          $("#returnRequest").css("display","none");
          var widget = this;
          /* Widget Upgrade Code Change */
          var items = [];
          if (widget.orderDetails && widget.orderDetails() && widget.orderDetails().order) {
            items = widget.orderDetails().order.items;
          }
          var createExpandFlag = function (item) {
            for (var j = 0; j < item.childItems.length; j++) {
              item.childItems[j].expanded = ko.observable(false);
              if (item.childItems[j].childItems && item.childItems[j].childItems.length > 0) {
                createExpandFlag(item.childItems[j]);
              }
            }
          };
          for (var i = 0; items && i < items.length; i++) {
            var item = items[i];
            if (item.childItems && item.childItems.length > 0) {
              createExpandFlag(item);
            }
          }
          $("body").attr("id" ,"CC-orderDetails-body");
          /* End widget upgrade code change */

        if (!widget.orderDetails() || !widget.user().loggedIn() || widget.user().isUserSessionExpired()) {
          navigation.doLogin(navigation.getPath(), widget.links().home.route);
        }
        widget.coupons([]);

        //console.log("widget.orderDetails() %%%%%%%%%%%%%%%%%%",widget.orderDetails())
        if (widget.orderDetails()) {
            var data = {};
            data[CCConstants.INCLUDE_RESULT] = CCConstants.INCLUDE_RESULT_FULL;
            
            ccRestClient.request(CCConstants.ENDPOINT_GET_ORDER, data,function (orderDatas) {
               // //console.log("found order Details..........................", orderDatas);
                widget.getOrderData(orderDatas);
            }, function(e) {
                //console.log("Could not find any order Details..........................", e);
            },widget.orderDetails().id);

          if (widget.orderDetails().discountInfo) {
            for (var prop in widget.orderDetails().discountInfo.orderCouponsMap) {
              var coupon = widget.orderDetails().discountInfo.orderCouponsMap[prop];
              coupon.code = prop;
              widget.coupons.push(coupon);
            }
          }
          }
          
          /* Widget Upgrade Code Change */
          if(widget.user().currentOrganization()&&this.orderDetails().organizationId!=
            widget.user().currentOrganization().repositoryId){
            widget.display(false);
            widget.showModal();
          }
          else if(widget.orderDetails() && widget.orderDetails().state == CCConstants.PENDING_APPROVAL){
            widget.display(true);
            widget.createSpinner(widget.orderDetailsBodyIndicator,widget.orderDetailsBodyIndicatorOptions);
            var order = {};
            order[CCConstants.ORDER_ID] = widget.orderDetails().id;
            order[CCConstants.REPRICE]=true;
            ccRestClient.request(CCConstants.ENDPOINT_ORDERS_PRICE_ORDER, order,
            function(data) {
              data.order = {};
              data.order = data.shoppingCart;
              widget.orderDetails(data);
              widget.destroySpinner(widget.orderDetailsBodyIndicator);
            }, function (result) {
                widget.destroySpinner(widget.orderDetailsBodyIndicator);
                widget.display(true);
                notifier.sendError(widget.WIDGET_ID, result.message, true);
            }, order)
          }
          else{
            widget.display(true);
          }
        /* End widget upgrade code change */

        widget.resetOrderDetails = function() {
          if (!(arguments[0].data.page.orderDetails && arguments[0].data.page.orderDetails.id)) {
            widget.orderDetails(null);
            $.Topic(pubsub.topicNames.PAGE_LAYOUT_LOADED).unsubscribe(widget.resetOrderDetails);
            $.Topic(pubsub.topicNames.PAGE_METADATA_CHANGED).unsubscribe(widget.resetOrderDetails);
          }
        };
        
        $.Topic(pubsub.topicNames.PAGE_LAYOUT_LOADED).subscribe(widget.resetOrderDetails);
        $.Topic(pubsub.topicNames.PAGE_METADATA_CHANGED).subscribe(widget.resetOrderDetails);

        /* Widget Upgrade Code Change */
        if(widget.orderDetails() && widget.orderDetails().errorMessages != undefined) {
          notifier.clearError(widget.WIDGET_ID);
          notifier.clearSuccess(widget.WIDGET_ID);
          notifier.sendError(widget.WIDGET_ID, widget.orderDetails().errorMessages, true);
        }
        /* End widget upgrade code change */
        
      },
      
     
      /**
       * Function to get the display name of a state 
       * countryCd - Country Code
       * stateCd - State Code
       */
       
      /* 
       handleAddToCartItems: function() {
           $.Topic(pubsub.topicNames.CART_ADD).publishWith(
          data,[{message:"success"}]);
       },*/
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
      },
      
      /**
       * Function to get the display name of a state 
       */
      getStateName: function() {
        if (this.orderDetails && this.orderDetails() && this.orderDetails().shippingAddress && this.orderDetails().shippingAddress.regionName) {
          return this.orderDetails().shippingAddress.regionName;
        }
        return "";
      },
      
      /**
       * Function to get the display name of a Country 
       * countryCd - Country Code
       */
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
      
      /**
       * Function to get the display name of a Country 
       */
      getCountryName: function() {
        if (this.orderDetails && this.orderDetails() && this.orderDetails().shippingAddress && this.orderDetails().shippingAddress.countryName) {
          return this.orderDetails().shippingAddress.countryName;
        }
        return "";
      },

      /* Widget Upgrade Code Change */
          /**
         * Function to check if the order is quoted or not
         */
        isQuoted: function() {
          if (this.orderDetails && this.orderDetails() && (this.orderDetails().state == CCConstants.QUOTED_STATES)) {
            return true;
          }
          return false;
        },

        /**
         * Function to check if the address object contains atleast 1 not null field
         */
        isAddressAvailable: function() {
          if (this.orderDetails && this.orderDetails() && this.orderDetails().shippingAddress) {
            for (var i in this.orderDetails().shippingAddress) {
              if (this.orderDetails().shippingAddress[i]) {
                return true;
              }
            }
            return false;
          }
        },

        /**
         * Function to toggle the expanded flag for a configurable child item.
         */
        toggleExpandedFlag : function(element, data) {
          if (data.expanded()) {
            data.expanded(false);
          } else {
            data.expanded(true);
          }
        },
        
        /**
         * Method to fetch items from the order and send them to cart
         * so that these items can be added to the cart.
         */
        mergeToCart: function (data, event) {
            var widget = this;
            if(data.order){
              widget.selectedOrder(data.order);
            }
            widget.cart().mergeCart(true);
            var state = widget.selectedOrder().state;
            var success = function(){
              widget.user().validateAndRedirectPage("/cart");
            };
            var error = function(errorBlock){
              var errMessages = "";
              var displayName;
              for(var k=0;k<errorBlock.length;k++){
                errMessages = errMessages + "\r\n" + errorBlock[k].errorMessage;
              }
              notifier.sendError("CartViewModel", errMessages, true);
            };
            widget.cart().addItemsToCart(widget.selectedOrder().items, success, error);
          },
          
          setSelectedOrder: function (data, event) {
              this.selectedOrder(data.order);
          },
      /* End widget upgrade code change */
      
      fetchPaymentInfo: function() {
		   //console.log("sssss");
			var localCart = getWidget.cart();
			  var items = localCart.items();
			  for(var k in localCart.dynamicProperties()) {
				  //console.log("....1...." + localCart.dynamicProperties()[k].id());
				  //console.log(localCart.dynamicProperties()[k].value())
				if(localCart.dynamicProperties()[k].id() == "orderPaymentInfo") {
					  //getWidget.fetchOrderPaymentInfo = $.parseJSON(localCart.dynamicProperties()[k].value());
					  getWidget.fetchOrderPaymentInfo($.parseJSON(localCart.dynamicProperties()[k].value()));
					  
					  //console.log(localCart.dynamicProperties()[k].value());
					  break;
				  }
			  }
			 // //console.log("Order Payment ******",getWidget.fetchOrderPaymentInfo(localCart.dynamicProperties()[k].value()));
			  //return getWidget.fetchOrderPaymentInfo;
 },
   reorderAddToCart: function(data ,event){
     //console.log(data , '----data ----');
     //console.log('reorderAddtoCart');
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
                            if (pageDetails === 'guestorderdetails') {
                                window.location = '/cart';
                            }
                        });
                    }, function(output) {
                        output.status == 404 ? i.goTo("404") : u && output && u(output);
                    }, p);

   },
   
      maskPhoneNumber: function(getPhone) {
          if(getPhone == 'null' || getPhone == null || getPhone == '') {
              return '';
          } else {
              return getPhone.match(new RegExp('.{1,4}$|.{1,3}', 'g')).join("-");
          }
      },
       /*reorderAddToCart: function(data , event){
           //console.log(data , 'reorder add To cart trigged ');
           $.Topic('addToCart').publish(data)
      },*/
       /**
       * Destroy the 'loading' spinner.
       * @function  OrderViewModel.destroySpinner
       */
      destroySpinner: function() {
        //  //console.log("destroyed");
          $('#loadingModal').hide();
          spinner.destroy();
      },

      /**
       * Create the 'loading' spinner.
       * @function  OrderViewModel.createSpinner
       */
      createSpinner: function(loadingText) {
          var indicatorOptions = {
              parent: '#loadingModal',
              posTop: '0',
              posLeft: '50%'
          };
          var loadingText = CCi18n.t('ns.common:resources.loadingText');
          $('#loadingModal').removeClass('hide');
          $('#loadingModal').show();
          indicatorOptions.loadingText = loadingText;
          spinner.create(indicatorOptions);
      }
    }
  }
);
