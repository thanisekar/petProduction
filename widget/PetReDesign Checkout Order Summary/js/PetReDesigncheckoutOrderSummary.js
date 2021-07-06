/**
 * @fileoverview Checkout Order Summary Widget.
 *
 */
/*global $ */
/*global define */
define(

    //-------------------------------------------------------------------
    // DEPENDENCIES
    //-------------------------------------------------------------------
    ['knockout', 'pubsub', 'ccLogger', 'notifier', 'spinner', 'ccConstants', 'jquery', 'ccRestClient', 'CCi18n', 'pageLayout/shippingmethods'],
    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function(ko, pubsub, log, notifier, spinner, CCConstants, $, CCRestClient, CCi18n, shippingmethods) {
        "use strict";
        var getWidget = "";
        var productDataArray = [];

        return {

            selectedShippingValue: ko.observable(),
            selectedShippingOption: ko.observable(),
            selectedShippingCost: ko.observable(0),
            selectedShippingName: ko.observable(),
            displayShippingOptions: ko.observable(false),
            totalCost: ko.observable(0),
            salesTax: ko.observable(0),
            noShippingMethods: ko.observable(false),
            shippingMethodsNewlyLoaded: ko.observable(true),
            shippingOptions: ko.observableArray(),
            errorMsg: ko.observable(),
            invalidShippingRegion: ko.observable(false),
            invalidShippingMethod: ko.observable(false),
            reloadShippingMethods: ko.observable(false),
            skipShipMethodNotification: ko.observable(false),
            persistedLocaleName: ko.observable(),
            isCartPriceUpdated: ko.observable(false),
            removeAdjacentShippingAmount: ko.observable(false),
            shippingMethodsLoaded: ko.observable(false),
            paypalAddressAltered: ko.observable(false),

            koProductDataArray: ko.observableArray([]),
            koOverSizedArray: ko.observableArray([]),
      		skipSpinner                  : ko.observable(false),
			isOverSized: ko.observable(false),
			isAPOCheck: ko.observable(false),
            airCheck: ko.observable(false),
			getSelectedState: ko.observable(),
            isOverWeight: ko.observable(false),
            koIsFreeShipping: ko.observable(false),
            overRideWeight: ko.observable(false),
            koOrderExceptionSku: ko.observable(),
            employeeCheck: ko.observable(true),
            koPromoUpsell: ko.observable(),
            paypalImageSrc: ko.observable("https://fpdbs.paypal.com/dynamicimageweb?cmd=_dynamic-image"),
            // Spinner resources
            pricingIndicator: '#CC-orderSummaryLoadingModal',
            DEFAULT_SHIPPING_ERROR: "No Shipping Method Selected",
            DEFAULT_LOADING_TEXT: "Loading...'",
            pricingIndicatorOptions: {
                parent: '#CC-orderSummaryLoadingModal',
                posTop: '40px',
                posLeft: '30%'
            },

            resourcesLoaded: function(widget) {
                widget.errorMsg(widget.translate('checkoutErrorMsg'));
            },
            initBTCall: function() {
                var widget = this;
                // //console.log('order details',ko.toJS(widget.order()))
                // //console.log('order id',ko.toJS(widget.user().orderId()))
                ////console.log("checout page BT initilize");
                /** Call To BT Initialize Starts **/
                var btPaymentObj = {};
                //btPaymentObj['paymentType'] = 'cash';
                //Working//var payment = {type: "generic",id: widget.id()}
                var payment = {
                    type: "generic",
                    id: widget.id(),
                    customProperties: {
                        device_data: {
                            "device_session_id": "39e3daea7e8ae6bb3d83369401e87592",
                            "fraud_merchant_id": "171330"
                        }
                    }
                };
                var payments = [payment];

                ////console.log("payment - ", payment);

                widget.order().updatePayments(payments);
                //widget.order().id(null);
                widget.order().op(CCConstants.ORDER_OP_INITIATE);
                widget.order().createOrder();
                /** Call To BT Initialize Ends **/
            },

            onLoad: function(widget) {
                getWidget = widget;
               $.Topic("employeeCheck.memory").subscribe(function(data) {
                    getWidget.employeeCheck(data);
                });
                
                widget.shippingmethods().defaultShipping("300010");
                shippingmethods.getInstance().defaultShipping("300010");
                // //console.log(ko.toJS(widget.cart()) , '------ Cart---');
                $.Topic(pubsub.topicNames.SHIPPING_METHODS_LOADED).subscribe(function() {
                    ////console.log('Subscribe works')
                    getWidget.shippingMethodLoaded();
                    getWidget.commonShippingLogic();
                    //Reordering and changing names for shipping methods
                    setTimeout(function(){
                        $(".CC-checkoutOrderSummary-shippingOption-300008").insertAfter(".CC-checkoutOrderSummary-shippingOption-300009");
                        $("#CC-checkoutOrderSummary-shippingOptionPrice-300010").text("Ground (Standard Shipping: 3 - 5 Business Days)");
                        $("#CC-checkoutOrderSummary-shippingOptionPrice-300009").text("Two Day Shipping: Expect Within 2 Business Days");
                        //$( "#CC-checkoutOrderSummary-discounts span:contains('FREE Ground Shipping All Orders')" ).css( "display", "none" );
                        },3500)
                });
                //Popup
                widget.shippingSurchargeMouseOver = function(widget, event) {
                    // Popover was not being persisted between
                    // different loads of the same 'page', so
                    // popoverInitialised flag has been removed
                    // remove any previous handlers
                    $('.shippingSurchargePopover').off('click');
                    $('.shippingSurchargePopover').off('keydown');
                    var options = new Object();
                    options.trigger = 'manual';
                    options.html = true;
                    // the button is just a visual aid as clicking anywhere will close popover
                    options.title = widget.translate('Single Order Shipping Limit') +
                        "<button id='shippingSurchargePopupCloseBtn' class='close btn pull-right'>" +
                        widget.translate('escapeKeyText') +
                        " &times;</button>";
                    options.content = widget.translate('Your Order Exceeds 150 lbs. Please contact our Consumer Services Team For Shipping Carrier Arrangements and For Ordering Information 1-877-738-6283');
                    $('.shippingSurchargePopover').popover(options);
                    $('.shippingSurchargePopover').on('click', widget.shippingSurchargeShowPopover);
                    $('.shippingSurchargePopover').on('keydown', widget.shippingSurchargeShowPopover);
                };
                widget.shippingSurchargeShowPopover = function(e) {
                    // if keydown, rather than click, check its the enter key
                    if (e.type === 'keydown' && e.which !== CCConstants.KEY_CODE_ENTER) {
                        return;
                    }
                    // stop event from bubbling to top, i.e. html
                    e.stopPropagation();
                    $(this).popover('show');
                    // toggle the html click handler
                    $('html').on('click', widget.shippingSurchargeHidePopover);
                    $('html').on('keydown', widget.shippingSurchargeHidePopover);
                    $('.shippingSurchargePopover').off('click');
                    $('.shippingSurchargePopover').off('keydown');
                };
                widget.shippingSurchargeHidePopover = function(e) {
                    // if keydown, rather than click, check its the escape key
                    if (e.type === 'keydown' && e.which !== CCConstants.KEY_CODE_ESCAPE) {
                        return;
                    }
                    $('.shippingSurchargePopover').popover('hide');
                    $('.shippingSurchargePopover').on('click', widget.shippingSurchargeShowPopover);
                    $('.shippingSurchargePopover').on('keydown', widget.shippingSurchargeShowPopover);
                    $('html').off('click');
                    $('html').off('keydown');
                    $('.shippingSurchargePopover').focus();
                };
                //Ends
                widget.cart().usingImprovedShippingWidgets(true);
                widget.selectedShippingValue.isData = true;
                widget.order().enableOrderButton.isData = true;
                widget.selectedShippingOption.isData = true;
                widget.errorFlag = false;
                widget.shippingMethodsNewlyLoaded.isData = true;
                widget.totalCost(widget.cart().amount());

                widget.amountToPay = ko.computed(function() {
                    if (widget.order().amountRemaining() != null) {
                        return widget.order().amountRemaining();
                    } else {
                        return widget.totalCost();
                    }
                }, widget);

                widget.clearInvalidShippingMethodError = true;

                widget.setupShippingOptions = function(obj) {
                    ////console.log('setupShippingOptions')
                    widget.destroySpinner();
                    notifier.clearError(widget.typeId() + '-shippingAddress');
                    notifier.clearError(widget.typeId() + '-shippingMethods');
                    notifier.clearError(widget.typeId() + '-selectedShippingMethod');
                    notifier.clearError(widget.typeId() + '-pricingError');

                    if (widget.selectedShippingOption() != undefined) {
                        widget.displayShippingOptions(true);
                        widget.selectedShippingCost(widget.selectedShippingOption().estimatedCostText());
                        widget.selectedShippingName(widget.translate('shippingText', {
                            displayName: ''
                        }));
                        widget.totalCost(widget.cart().total());
                        widget.salesTax(widget.cart().tax());
                        if (widget.shippingMethodsNewlyLoaded()) {
                            widget.shippingMethodsNewlyLoaded(false);
                            widget.noShippingMethods(false);
                        }
                    } else {
                        widget.displayShippingOptions(false);
                        widget.selectedShippingCost(0);
                        widget.selectedShippingName(widget.translate('shippingText', {
                            displayName: ''
                        }));
                        widget.totalCost(widget.cart().total());
                        widget.salesTax(widget.cart().tax());
                    }
                    getWidget.shippingMethodLoaded();
                };

                /**
                 * Handles a change in the cart
                 */
                widget.handleUpdatedCart = function(obj) {
                        widget.isCartPriceUpdated(true);
                    },

                    widget.customKeyDownPressHandler = function(obj, data, event) {
                        if ((data == widget.shippingOptions()[widget.shippingOptions().length - 1]) && event.keyCode == 40) {
                            var idLastShippingMethod = obj + widget.shippingOptions()[0].repositoryId;
                            $(idLastShippingMethod).attr('checked');
                            $(idLastShippingMethod).focus();
                            $(idLastShippingMethod).prop('checked', true);
                            widget.selectedShippingValue(widget.shippingOptions()[0].repositoryId);
                        } else if ((data == widget.shippingOptions()[0]) && event.keyCode == 38) {
                            var idLastShippingMethod = obj + widget.shippingOptions()[widget.shippingOptions().length - 1].repositoryId;
                            $(idLastShippingMethod).attr('checked');
                            $(idLastShippingMethod).focus();
                            $(idLastShippingMethod).prop('checked', true);
                            widget.selectedShippingValue(widget.shippingOptions()[widget.shippingOptions().length - 1].repositoryId);
                        } else {
                            return true;
                        }
                    };

                widget.customKeyUpPressHandler = function(data) {
                    widget.selectedShippingValue(data.repositoryId);
                };

                widget.checkIfShippingMethodExists = function(selectedShippingMethod, shippingOptions) {
                    return ko.utils.arrayFirst(shippingOptions(), function(shippingOption) {
                        return selectedShippingMethod === shippingOption.repositoryId;
                    });
                };

                widget.resetShippingOptions = function(obj) {
                    if (widget.order().shippingAddress() && widget.order().shippingAddress().validateForShippingMethod() && !widget.noShippingMethods()) {
                        widget.displayShippingOptions(true);
                    } else {
                        widget.displayShippingOptions(false);
                    }
                    widget.totalCost(widget.cart().total());
                    widget.selectedShippingCost(0);
                    widget.salesTax(0);
                    widget.selectedShippingName(widget.translate('shippingText', {
                        displayName: ''
                    }));
                    widget.selectedShippingOption(null);
                    widget.selectedShippingValue(null);
                    widget.shippingmethods().shippingOptions.removeAll();
                    widget.invalidShippingRegion(false);
                    widget.invalidShippingMethod(false);
                    widget.skipShipMethodNotification(false);
                    $.Topic(pubsub.topicNames.CHECKOUT_SHIPPING_METHOD).publishWith(widget.selectedShippingOption(), [{
                        message: "success"
                    }]);
                };

                // handles when no shipping methods are available.
                widget.handleNoShippingMethods = function(obj) {
                    widget.noShippingMethods(true);
                    widget.resetShippingOptions();
                    widget.destroySpinner();
                };

                // check the current cart to see if there is a shipping method
                // if not it sets the default shipping method
                widget.shippingMethodsLoadedListener = function(obj) {
                    if(getWidget.isOverWeight()) {
                        shippingmethods.getInstance().defaultShipping("300004");
                    } else {
                        shippingmethods.getInstance().defaultShipping("300010");
                    }
                    notifier.clearError(widget.typeId() + '-shippingMethods');
                    if (widget.shippingmethods().shippingOptions().length === 0) {
                        widget.handleNoShippingMethods();
                    } else {
                        widget.shippingOptions(widget.shippingmethods().shippingOptions());
                        widget.shippingMethodsNewlyLoaded(true);
                        widget.skipShipMethodNotification(true);

                        // Set selected shipping option when shipping methods reload to ensure pricing call that can verify
                        // if shipping address is valid
                        widget.selectedShippingValue(null);
                        widget.removeAdjacentShippingAmount(false);
                        widget.shippingMethodsLoaded(false);
                        widget.isCartPriceUpdated(false);
                        // Check the current cart shipping option to see if it been set
                        if ((widget.cart) && (widget.cart().shippingMethod() != undefined) && (widget.cart().shippingMethod() !== '') &&
                            (widget.checkIfShippingMethodExists(widget.cart().shippingMethod(), widget.shippingOptions))) {
                            if (getWidget.isOverWeight()) {
                                widget.selectedShippingValue("300004");
                            } else {
                                if(widget.cart().shippingMethod() === "300004") {
                                    widget.selectedShippingValue("300004");
                                } else {
                                    widget.selectedShippingValue(widget.cart().shippingMethod());
                                }
                            }
                        }
                        //for web checkout error case, use the shipping method selected before going for web checkout
                        else if (widget.order().webCheckoutShippingMethodValue) {
                            //dont clear the notifier error message
                            widget.clearInvalidShippingMethodError = false;
                            widget.selectedShippingValue(widget.order().webCheckoutShippingMethodValue);
                            widget.order().webCheckoutShippingMethodValue = null;
                        }
                        // TODO - should we reset the cart shipping method
                        // Use the default shipping method from the list
                        else if (widget.shippingmethods().defaultShipping() != undefined) {
                            // the cart doesn't have a shipping method so set the default shipping method and
                            // send a message to say the selected shipping option has been updated.
                            //widget.selectedShippingValue(widget.shippingmethods().defaultShipping());
                            if (!getWidget.isOverWeight()) {
                                widget.selectedShippingValue("300010");
                            } else {
                                 widget.selectedShippingValue("300004")
                            }
                        }
                    }
                };

                $.Topic(pubsub.topicNames.CHECKOUT_SHIPPING_ADDRESS_UPDATED).subscribe(function(obj) {
                    if (!widget.order().isPaypalVerified() || widget.paypalAddressAltered()) {
                        widget.selectedShippingValue(null);
                        widget.cart().shippingMethod('');
                        widget.shippingmethods().shippingOptions.removeAll();
                        widget.displayShippingOptions(true);
                        $('#CC-checkoutOrderSummary-selectedShippingValue').hide();
                    }
                });

                $.Topic(pubsub.topicNames.PAYPAL_SHIPPING_ADDRESS_ALTERED).subscribe(function(obj) {
                    widget.paypalAddressAltered(true);
                    // //console.log('ispaypalVerifed in shipping address altered',widget.order().isPaypalVerified())
                });

                $.Topic(pubsub.topicNames.PAYPAL_CHECKOUT_NO_SHIPPING_METHOD).subscribe(function() {
                    widget.selectedShippingValue(null);
                    widget.cart().shippingMethod('');
                    widget.shippingmethods().shippingOptions.removeAll();
                    widget.displayShippingOptions(true);
                });

                $.Topic(pubsub.topicNames.ADD_NEW_CHECKOUT_SHIPPING_ADDRESS).subscribe(function(obj) {
                    widget.shippingMethodsLoaded(false);
                });

                $.Topic(pubsub.topicNames.ORDER_PRICING_SUCCESS).subscribe(widget.setupShippingOptions);

                $.Topic(pubsub.topicNames.ORDER_PRICING_FAILED).subscribe(function(obj) {
                    widget.destroySpinner();
                    widget.invalidShippingRegion(false);
                    widget.invalidShippingMethod(false);
                    widget.shippingMethodsLoaded(false);

                    // Handle case where selected shipping region is invalid
                    if (this && this.errorCode == CCConstants.INVALID_SHIPPING_COUNTRY_STATE) {
                        widget.invalidShippingRegion(true);
                        notifier.sendError(widget.typeId() + '-shippingAddress', this.message, true);
                    }
                    // Handle case where selected shipping method is invalid
                    else if (this && this.errorCode == CCConstants.INVALID_SHIPPING_METHOD) {
                        widget.invalidShippingMethod(true);
                        notifier.sendError(widget.typeId() + '-selectedShippingMethod', this.message, true);
                    }
                    // Handle case where tax could not be calculated
                    else if (this && this.errorCode == CCConstants.PRICING_TAX_REQUEST_ERROR) {
                        widget.resetShippingOptions();
                        notifier.sendError(widget.typeId() + '-pricingError', this.message, true);
                    }
                    // Handle other pricing errors
                    else {
                        if (this && this.message) {
                            notifier.sendError(widget.typeId() + '-pricingError', this.message, true);
                        }
                        if (this && this.errorCode == CCConstants.PRICING_USER_AUTHENTICATION_ERROR &&
                            widget.order().shippingAddress() && widget.order().shippingAddress().validateForShippingMethod()) {
                            widget.shippingMethodsLoaded(true);
                        }
                        widget.resetShippingOptions();
                    }
                });
                // Detect cart changes
                $.Topic(pubsub.topicNames.CART_ADD).subscribe(
                    widget.handleUpdatedCart);
                $.Topic(pubsub.topicNames.CART_REMOVE).subscribe(
                    widget.handleUpdatedCart);
                $.Topic(pubsub.topicNames.CART_UPDATE_QUANTITY).subscribe(
                    widget.handleUpdatedCart);

                $.Topic(pubsub.topicNames.DESTROY_SHIPPING_METHODS_SPINNER).subscribe(function(obj) {
                    widget.destroySpinner();
                });

                $.Topic(pubsub.topicNames.VERIFY_SHIPPING_METHODS).subscribe(function(data) {
                    if (!(widget.selectedShippingValue() && widget.selectedShippingOption())) {
                        var shippingAddressWithProductIDs = {};
                        shippingAddressWithProductIDs[CCConstants.SHIPPING_ADDRESS_FOR_METHODS] = this[CCConstants.SHIPPING_ADDRESS_FOR_METHODS];
                        shippingAddressWithProductIDs[CCConstants.PRODUCT_IDS_FOR_SHIPPING] = widget.cart().getProductIdsForItemsInCart();
                        $.Topic(pubsub.topicNames.RELOAD_SHIPPING_METHODS).publishWith(
                            shippingAddressWithProductIDs, [{
                                message: "success"
                            }]);
                        //$.Topic(pubsub.topicNames.RELOAD_SHIPPING_METHODS).publishWith( this, [{ message: "success"  }]);
                    }
                });

                $.Topic(pubsub.topicNames.CHECKOUT_RESET_SHIPPING_METHOD).subscribe(function(obj) {
                    widget.selectedShippingCost(0);
                    widget.salesTax(0);
                    widget.totalCost(widget.cart().total());
                    widget.selectedShippingName(widget.translate('shippingText', {
                        displayName: ''
                    }));
                    widget.selectedShippingOption(null);
                    widget.selectedShippingValue(null);
                });

                /*$.Topic(pubsub.topicNames.CHECKOUT_RESET_SHIPPING_METHOD).subscribe(function(obj) {
            alert("checkout page reset shipping method");
        });*/

                widget.order().isPaypalVerified.subscribe(function(newValue) {
                    alert("is paypal verified" + newValue);
                });

                widget.cart().amount.subscribe(function(newValue) {
                    widget.totalCost(widget.cart().total());
                });

                //This subscribe is used when order total is changed when cart is updated
                widget.cart().total.subscribe(function(newValue) {
                    widget.totalCost(widget.cart().total());
          if (widget.order().shippingAddress() && widget.order().shippingAddress().validateForShippingMethod()) {
                    widget.salesTax(widget.cart().tax());
          }
                });

                widget.destroySpinner = function() {
                    $(widget.pricingIndicator).removeClass('loadingIndicator');
                    spinner.selector = '#CC-orderSummaryLoadingModal';
                    spinner.destroy(1);
                };
                widget.createSpinner = function() {
                    $(widget.pricingIndicator).css('position', 'relative');
                    widget.pricingIndicatorOptions.loadingText = widget.translate('rePricingText', {
                        defaultValue: this.DEFAULT_LOADING_TEXT
                    });
                    spinner.create(widget.pricingIndicatorOptions);
                };


                // Handle changes to Selected Shipping option
                widget.selectedShippingValue.subscribe(function(newValue) {
          if(widget.cart().items().length <= 0) {
            widget.displayShippingOptions(false);
            return;
          }
                    if (newValue) {
            if (widget.skipSpinner()) {
              widget.skipSpinner(false);
            } else if(widget.shippingmethods().shippingOptions().length > 0){
              widget.createSpinner();
            }
            // clears invalid shipping method error only if user selects any shipping option
            // but not if default shipping method is selected after shipping options reload.
            if (widget.clearInvalidShippingMethodError) {
              notifier.clearError("OrderViewModel");
              widget.clearInvalidShippingMethodError = false;
            }
            
            // Check to see if selected shipping option is in the list of valid shipping options
            for (var i = 0; i < widget.shippingOptions().length; i++) {
              if (widget.shippingOptions()[i].repositoryId === widget.selectedShippingValue()) {
                widget.selectedShippingOption(null);
                widget.selectedShippingOption(widget.shippingOptions()[i]);
                // Request checkout re-pricing as shipping method has changed
                widget.sendShippingNotification();
                if (widget.shippingMethodsLoaded()) {
                  widget.removeAdjacentShippingAmount(true);
                } else {
                  widget.shippingMethodsLoaded(true);
                  widget.removeAdjacentShippingAmount(false);
                }
                
                // Housekeeping: reset flags/errors
                if (widget.reloadShippingMethods()) {
                  widget.reloadShippingMethods(false);
                } else {
                  notifier.clearError(widget.typeId()+'-shippingMethods');
                }
                break;
              }
            }
            if( widget.cart().currentOrderState()== CCConstants.PENDING_PAYMENT ||  widget.cart().currentOrderState()== CCConstants.PENDING_PAYMENT_TEMPLATE){
              widget.setupShippingOptions();
            }
          }
        });

                // Sends shipping notification details to the subscribers along with shipping address and shipping options
                widget.sendShippingNotification = function() {
                    notifier.clearError(widget.typeId() + '-pricingError');
                    if (widget.selectedShippingOption() != undefined &&
                        widget.selectedShippingOption() !== '' &&
                        !widget.skipShipMethodNotification()) {
                        $.Topic(pubsub.topicNames.CHECKOUT_SHIPPING_METHOD).publishWith(widget.selectedShippingOption(), [{
                            message: "success"
                        }]);
                    }
                    widget.skipShipMethodNotification(false);
                };

                widget.optionsCaption = ko.computed(function() {
                    return CCi18n.t('ns.ordersummary:resources.selectShippingMethodText');
                });

                widget.optionsTextForShippingMethod = function(data) {
                    if (data) {
                        if (widget.removeAdjacentShippingAmount()) {
                            return data.displayName;
                        }
                        if (data.isDummy) {
                            return "";
                        }
                        return data.displayName + " (" + widget.cart().currency.symbol + data.estimatedCostText() + ")";
                    } else {
                        return "";
                    }
                };
        widget.shippingMethodSelected = function(data) {
          widget.selectedShippingValue(data.repositoryId);
        };
        widget.getDropdownCaption = ko.computed(function() {
          if (widget.selectedShippingValue()) {
            for (var i = 0; i < widget.shippingOptions().length; i++) {
              if (widget.shippingOptions()[i].repositoryId === widget
                  .selectedShippingValue()) {
                return widget.shippingOptions()[i].displayName; 
              }
            }
          } else {
            return CCi18n.t('ns.common:resources.selectShippingMethodText');
          }
        });
                widget.displayShippingMethodsDropdown = function(data, event) {
                    var self = this;
                    self.removeAdjacentShippingAmount(false);
                    $('#CC-checkoutOrderSummary-selectedShippingValue').hide();
                    if (self.isCartPriceUpdated() || self.shippingmethods().shippingOptions().length == 0) {
                        for (var i = 0; i < 6 && !self.shippingMethodsLoaded(); i++) {
                            self.shippingOptions.push({
                                displayName: "",
                                repositoryId: "dummy" + i,
                                isDummy: true
                            });
                        }
                        self.isCartPriceUpdated(false);
            if (self.order().shippingAddress() && self.order().shippingAddress().validateForShippingMethod()) {
                        self.createSpinner();
              // Skip the pricing spinner when the drop down is getting clicked for the first time after address change
              self.skipSpinner(true);
              var shippingAddressWithProductIDs = {};
              shippingAddressWithProductIDs[CCConstants.SHIPPING_ADDRESS_FOR_METHODS] = self.order().shippingAddress();
              shippingAddressWithProductIDs[CCConstants.PRODUCT_IDS_FOR_SHIPPING] = self.cart().getProductIdsForItemsInCart();
              self.cart().updateShippingAddress.bind(shippingAddressWithProductIDs)();
            }
          }
          return true;
          };

                widget.shippingOptionBlured = function(data, event) {
                    var self = this;
                    self.removeAdjacentShippingAmount(true);
                    return true;
                };

                $.Topic(pubsub.topicNames.NO_SHIPPING_METHODS).subscribe(widget.handleNoShippingMethods);
                $.Topic(pubsub.topicNames.CHECKOUT_SHIPPING_ADDRESS_INVALID).subscribe(function(obj) {
                    widget.resetShippingOptions();
          widget.destroySpinner();
          widget.shippingMethodsLoaded(false);
                });

                // Handle server responses when data is missing or invalid
                $.Topic(pubsub.topicNames.ORDER_SUBMISSION_FAIL).subscribe(function(obj) {
                    if (this.errorCode == CCConstants.INVENTORY_CONFIGURABLE_ITEM_CHECK_ERROR) {
                        if (this.errors instanceof Array) {
                            var errorCodes = [];
                            this.errors.forEach(function(error) {
                                errorCodes.push(error.errorCode);
                            });
                            if (errorCodes.indexOf(CCConstants.CREATE_ORDER_SKU_NOT_FOUND) > -1 ||
                                errorCodes.indexOf(CCConstants.CREATE_ORDER_PRODUCT_NOT_FOUND) > -1) {
                                widget.cart().loadCart();
                            }
                        }
                    } else if (this.errors instanceof Array) {
                        var errorCodes = [];
                        this.errors.forEach(function(error) {
                            var info = error.moreInfo ? JSON.parse(error.moreInfo) : "";
                            if (error.errorCode == CCConstants.EXTERNAL_PRICE_CHANGED) {
                                widget.cart().setExternalPricesForItems(info);
                                errorCodes.push(error.errorCode);
                            } else if (error.errorCode == CCConstants.EXTERNAL_PRICE_PARTIAL_FAILURE_ERROR) {
                                widget.cart().setUnpricedErrorAndSaveCart(info.commerceItemId, info.message);
                            }
                        });
                        if (errorCodes.indexOf(CCConstants.EXTERNAL_PRICE_CHANGED) > -1) {
                            widget.cart().priceCartForCheckout();
                        }
                    }
                    // Enable button again
                    else if (this.errorCode == CCConstants.INVALID_SHIPPING_METHOD) {
                        widget.invalidShippingMethod(true);
            widget.selectedShippingValue(null);
            widget.cart().shippingMethod('');
                        // Notification sent by OrderViewModel to be cleared when valid shipping method is selected
                        widget.clearInvalidShippingMethodError = true;

                        // Reload shipping methods
                        setTimeout(function() {
                            widget.reloadShippingMethods(true);
                            widget.createSpinner();
                            var shipAddress =
                                (widget.cart().shippingAddress() != undefined &&
                                    widget.cart().shippingAddress() !== '') ?
                                widget.cart().shippingAddress() :
                                widget.user().shippingAddressBook()[0];
                            var shippingAddressWithProductIDs = {};
                            shippingAddressWithProductIDs[CCConstants.SHIPPING_ADDRESS_FOR_METHODS] = shipAddress;
                            shippingAddressWithProductIDs[CCConstants.PRODUCT_IDS_FOR_SHIPPING] = widget.cart().getProductIdsForItemsInCart();
                            $.Topic(pubsub.topicNames.RELOAD_SHIPPING_METHODS)
                                .publishWith(
                                    shippingAddressWithProductIDs, [{
                                        message: "success"
                                    }]);
                        }, 3000);
                    } else if (this.errors instanceof Array) {
                        var errorCodes = [];
                        this.errors.forEach(function(error) {
                            var info = error.moreInfo ? JSON.parse(error.moreInfo) : "";
                            if (error.errorCode == CCConstants.EXTERNAL_PRICE_CHANGED) {
                                widget.cart().setExternalPricesForItems(info);
                                errorCodes.push(error.errorCode);
                            } else if (error.errorCode == CCConstants.EXTERNAL_PRICE_PARTIAL_FAILURE_ERROR) {
                                widget.cart().setUnpricedErrorAndSaveCart(info.commerceItemId, info.message);
                            }
                        });
                        if (errorCodes.indexOf(CCConstants.EXTERNAL_PRICE_CHANGED) > -1) {
                            widget.cart().priceCartForCheckout();
                        }
                    }
                    // Enable button again
                    else if (this.errorCode == CCConstants.INVALID_SHIPPING_METHOD) {
                        widget.resetShippingOptions();
                        widget.noShippingMethods(true);
                        widget.invalidShippingRegion(true);
                    } else if (this.errorCode == CCConstants.COUPON_APPLY_ERROR) {
                        widget.cart().handleCouponPricingError(this);
                    } else if (this.errorCode == CCConstants.ORDER_PRICE_CHANGED) {
                        widget.cart().priceCartForCheckout();
                    }
                });

                // Function called once the shipping methods have been loaded
                $.Topic(pubsub.topicNames.SHIPPING_METHODS_LOADED).subscribe(widget.shippingMethodsLoadedListener);

                //This is invoked if the load shipping methods fails, to reset the shipping options 
                //and to set the text in the place of shipping methods UI
                $.Topic(pubsub.topicNames.LOAD_SHIPPING_METHODS_FAILED).subscribe(function(data) {
                    notifier.sendError(widget.typeId() + '-shippingMethods', this.message, true);
                    widget.resetShippingOptions();
                    widget.noShippingMethods(true);
                    widget.invalidShippingRegion(true);
                });

                // If selected shipping method changed elsewhere, refresh it here
                $.Topic(pubsub.topicNames.CHECKOUT_SHIPPING_METHOD).subscribe(function(obj) {
                    // If shipping option different from the one here, refresh the local copy
                    if (this && this.repositoryId &&
                        widget.shippingOptions() != undefined &&
                        widget.shippingOptions().length > 0 &&
                        widget.checkIfShippingMethodExists(this.repositoryId, widget.shippingOptions) &&
                        (widget.selectedShippingValue() == undefined ||
                            widget.selectedShippingValue() !== this.repositoryId)) {
                        widget.skipShipMethodNotification(true);
                        widget.selectedShippingValue(this.repositoryId);
                    }
                });

                // To ensure the shipping method chosen during checkout with paypal is set when shopper
                // returns to place order on store
                $.Topic(pubsub.topicNames.PAYPAL_CHECKOUT_SHIPPING_METHOD_VALUE).subscribe(function() {
                    //Setting the shipping method in cart which gets updated on the shipping methods loaded listener.
                    widget.cart().shippingMethod(this);
                    widget.cart().populateShipppingMethods();
                    widget.selectedShippingValue(this);
                });

                // Listen for notifications being cleared
                $.Topic(pubsub.topicNames.NOTIFICATION_DELETE).subscribe(function() {
                    // Watch for the invalid shipping method notification being cleared
                    if (widget.invalidShippingMethod() && this.id() === widget.typeId() + '-selectedShippingMethod') {
                        // Reload shipping methods
                        widget.invalidShippingMethod(false);
                        widget.reloadShippingMethods(true);
                        widget.createSpinner();
                        var shipAddress =
                            (widget.cart().shippingAddress() != undefined &&
                                widget.cart().shippingAddress() !== '') ?
                            widget.cart().shippingAddress() :
                            widget.user().shippingAddressBook()[0];
                        var shippingAddressWithProductIDs = {};
                        shippingAddressWithProductIDs[CCConstants.SHIPPING_ADDRESS_FOR_METHODS] = shipAddress;
                        shippingAddressWithProductIDs[CCConstants.PRODUCT_IDS_FOR_SHIPPING] =
                            widget.cart().getProductIdsForItemsInCart();
                        $.Topic(pubsub.topicNames.RELOAD_SHIPPING_METHODS).publishWith(
                            shippingAddressWithProductIDs, [{
                                message: "success"
                            }]);
                    }
                });

                widget.setupShippingOptions();


                widget.persistedLocaleName(JSON.parse(CCRestClient.getStoredValue(CCConstants.LOCAL_STORAGE_USER_CONTENT_LOCALE)));
                // If locale name is present in local storage, append it to the paypal image url
                if (widget.persistedLocaleName() && widget.persistedLocaleName()[0]) {
                    widget.paypalImageSrc(widget.paypalImageSrc() + "&locale=" + widget.persistedLocaleName()[0].name);
                }
                $.Topic(pubsub.topicNames.CART_REMOVE_SUCCESS).subscribe(function() {
                    if(!getWidget.overWeight()) {
                        //getWidget.invokeExternalShippingMethodsCall();

                    }
                    if(getWidget.order().shippingAddress() && getWidget.order().shippingAddress().postalCode() !== '') {
                        var shippingAddressWithProductIDs = {};
                        shippingAddressWithProductIDs[CCConstants.SHIPPING_ADDRESS_FOR_METHODS] = getWidget.order().shippingAddress();
                        shippingAddressWithProductIDs[CCConstants.PRODUCT_IDS_FOR_SHIPPING] = getWidget.cart().getProductIdsForItemsInCart();
                        $.Topic(pubsub.topicNames.RELOAD_SHIPPING_METHODS).publishWith(
                            shippingAddressWithProductIDs, [{
                                message: "success"
                        }]);
                    }
                    
                    getWidget.displayOverWeightSection();
                    getWidget.displayFreeShippingSection();
                    getWidget.displayOverSizeSection();
                    getWidget.displayOverRideWeightSection();
                    getWidget.commonShippingLogic();
                });
                
                //Promo Upsell Message capture
                $.Topic("promotionMessage.memory").subscribe(function(data) {
                   if(data.length != 0){
                   getWidget.koPromoUpsell(data[0].text)
                   }
                });
                
                
                //Sticky Checkout Order Summary
                
                
                 $.Topic(pubsub.topicNames.PAGE_READY).subscribe(function() {
                            if ($('#CC-checkoutOrderSummary').is(':visible')) {
                                var fixmeTop = $('#CC-checkoutOrderSummary').offset().top;
                                $(window).scroll(function() {
                                    var currentScroll = $(window).scrollTop();
                                    var parentwidth = $("#CC-checkoutOrderSummary").parent().width();    
                                    var parentHeight = $("#CC-checkoutOrderSummary").height();   

                                    if (currentScroll >= fixmeTop) {
                                        $('#CC-checkoutOrderSummary').css({
                                            'position' : 'fixed',
                                             'width' : parentwidth + 'px',
                                             'top' : '0'
                                        });
                                        $('#CC-promotionDetails').css({
                                            'position' : 'fixed',
                                             'width' : parentwidth + 'px',
                                             'top' : parentHeight + 'px'
                                        });
                                    } else {
                                        $('#CC-checkoutOrderSummary').css({
                                            'position' : 'relative',
                                             'width' : 'auto',
                                             'top' : 'auto'
                                        });
                                        $('#CC-promotionDetails').css({
                                            'position' : 'relative',
                                             'width' : 'auto',
                                             'top' : 'auto'
                                        });
                                    } 
                                    if ($('#brain-tree-integration').is(':visible')) {
                                        var braintreeOffset = $('#brain-tree-integration').offset();
                                          var braintreeTop = $('#brain-tree-integration').offset().top;
                                    if(currentScroll >= braintreeTop){
                                             $('#checkoutCartSummary').css({
                                            'height':'500px',
                                            'overflow':'scroll'
                                        });
                                        $('#CC-checkoutOrderSummary').css({
                                            'position' : 'relative',
                                             'width' : 'auto'
                                        });
                                       $('#CC-promotionDetails').css({
                                            'position' : 'relative',
                                             'width' : 'auto'
                                        });
                                        $("#CC-checkoutOrderSummary").offset({ top: braintreeOffset.top});
                                        $("#CC-promotionDetails").offset({ top: braintreeOffset.top + parentHeight});
                                         
                                    }else{
                                        $('#checkoutCartSummary').css({
                                            'height':'auto',
                                            'overflow':'initial'
                                        });
                                    }
                                    
                                    }
                                });
                            }
                    })
                    
                    
                    
             
            },

            /**
             * Callback function for use in widget stacks.
             * Triggers internal widget validation.
             * @return true if we think we are OK, false o/w.
             */
            validate: function() {
                this.order().validateCheckoutOrderSummary();
                return !this.order().errorFlag;
            },
 invokeExternalShippingMethodsCall: function() {
                if($("[class^=CC-checkoutOrderSummary-shippingOption]").length === 4) {
                    getWidget.selectedShippingValue("300010");
                    getWidget.cart().shippingMethod("300010");
                    getWidget.shippingMethodLoaded(); 
                    getWidget.commonShippingLogic();
                } else {
                    if(getWidget.order().shippingAddress() && getWidget.order().shippingAddress().postalCode() !== '') {
                        var shippingAddressWithProductIDs = {};
                        shippingAddressWithProductIDs[CCConstants.SHIPPING_ADDRESS_FOR_METHODS] = getWidget.order().shippingAddress();
                        shippingAddressWithProductIDs[CCConstants.PRODUCT_IDS_FOR_SHIPPING] = getWidget.cart().getProductIdsForItemsInCart();
                        $.Topic(pubsub.topicNames.RELOAD_SHIPPING_METHODS).publishWith(
                            shippingAddressWithProductIDs, [{
                                message: "success"
                        }]);
                    }
                }
            },
            
            getShippingMethods: function() {
               $.Topic("selectedState").subscribe(function(data) {
                    getWidget.getSelectedState(data);
                    getWidget.propertyCheck();
                    getWidget.displayOverSizeSection();
                });
                $.Topic("newSelectedState").subscribe(function(data) {
                    getWidget.getSelectedState(data);
                    getWidget.propertyCheck();
                    getWidget.displayOverSizeSection();
                });
},
            freeShipping: function(){
                
            },
 
            overWeight: function() {

                var widget = this;
                
                getWidget.isOverWeight(false);

                var getItems = widget.cart().allItems();
                var totalProductWeight;
                var finalTotalProductWeight = 0;
                $.each(getItems, function(k, v) {
                    var quantity = v.quantity();
                    if (v.productData().childSKUs[0].petWeight != '' && v.productData().childSKUs[0].petWeight != undefined && v.productData().childSKUs[0].petWeight !== null) {
                        //console.log('Has petweight');
                        var petWeight = 0;
                        if(v.productData().childSKUs[0].petWeight) {
                            petWeight = v.productData().childSKUs[0].petWeight.split(" ")[0];
                        }
                        totalProductWeight = quantity * petWeight;
                        finalTotalProductWeight += totalProductWeight;
                    }
                });
                //console.log('finalTotalProductWeight......', finalTotalProductWeight);
                if(finalTotalProductWeight > 150) {
                    getWidget.isOverWeight(true);
                    return true;
                }
                return  false;
            },
            propertyCheck: function(){
                 getWidget.isOverSized(false);
                 getWidget.koIsFreeShipping(false);
                 getWidget.overRideWeight(false);
                $.each(getWidget.cart().allItems(), function(index, value) {
                    if (value.productData() != undefined) {
                        if (value.productData().childSKUs !== null) {
                            if (value.productData().childSKUs != undefined || value.productData().childSKUs.length > 0) {
                                if (value.productData().childSKUs[0] != undefined) {
                                   
                                    if (value.productData().childSKUs[0].overSizedSku) {
                                        getWidget.isOverSized(true);
                                        getWidget.koOrderExceptionSku(value.productData().childSKUs[0].repositoryId);
                                    }
                                    if (value.productData().childSKUs[0].isFreeShipping) {
                                        getWidget.koIsFreeShipping(true);
                                    }
                                    if (value.productData().childSKUs[0].x_overRideWeight) {
                                        getWidget.overRideWeight(true);
                                    }
                                }
                            }
                        }
                    }
                });
                
                getWidget.commonShippingLogic();
            },
    
            
            
            displayFreeShippingSection: function(){
                
                getWidget.propertyCheck();
                //console.log(getWidget.koIsFreeShipping(),'getWidget.koIsFreeShipping()');
    
                
            },
            
            displayOverWeightSection: function() {
                getWidget.overWeight();
                //console.log(getWidget.isOverWeight(),'getWidget.isOverWeight()');
            },
            
            displayOverSizeSection: function(){
                getWidget.propertyCheck();
                //console.log(getWidget.isOverSized(),'getWidget.isOverSized()');
                 if (getWidget.getSelectedState() == 'AA' || getWidget.getSelectedState() == 'AE' || getWidget.getSelectedState() == 'AP') {
                    getWidget.isAPOCheck(true);
                } else {
                    getWidget.isAPOCheck(false);
                }
		
		
		if (getWidget.getSelectedState() == 'AK' || getWidget.getSelectedState() == 'HI') {
		                   
		                    getWidget.airCheck(true);
		                } else {
		                    getWidget.airCheck(false);
		                }
            	},
            
           
            
            displayOverRideWeightSection: function(){
                getWidget.propertyCheck();

                //getWidget.overRideWeight();
                //console.log(getWidget.overRideWeight(),'getWidget.overRideWeight()');
            },
            
            
           
                commonShippingLogic: function() {
                    
                    //console.log('commonShippingLogic');
                    //Default options     
                
                    $(".CC-checkoutOrderSummary-shippingOption-300010").show();
                    $(".CC-checkoutOrderSummary-shippingOption-300009").show();
                    $(".CC-checkoutOrderSummary-shippingOption-300008").show();
                    getWidget.shippingmethods().defaultShipping("300010");
                    shippingmethods.getInstance().defaultShipping("300010");
                    $('.overSized').hide();
                    $(".shippingOptions").show();
                    $('.orderPopup').hide();
                    $('#CC-Checkout-Placeorder').attr('disabled', false);
                    $('.bt-popup').hide();
                //Case 1 : Free Shipping
                
                if(getWidget.koIsFreeShipping()){
                    $('.overSized').hide();
                    $(".shippingOptions").show();
                    $('.orderPopup').hide();
                    $('#CC-Checkout-Placeorder').attr('disabled', false);
                    $('.bt-popup').hide();
                    $( ".bt-popup" ).removeClass( "popupCheck" );
                }
                
                
                //Case 2 : oversized
                
                if(getWidget.isOverSized()){
                    //console.log('oversized');
                    $(".CC-checkoutOrderSummary-shippingOption-300009").hide();
                    $(".CC-checkoutOrderSummary-shippingOption-300008").hide();
                    $('.overSized').show();
                    $(".shippingOptions").show();
                    $('.orderPopup').hide();
                    $('#CC-Checkout-Placeorder').attr('disabled', false);
                    $('.bt-popup').hide();
                    $( ".bt-popup" ).removeClass( "popupCheck" );
                }
                
                //Case 3: OverWeight
                
                if(getWidget.isOverWeight()){
                    //console.log('over weight');
                    $(".CC-checkoutOrderSummary-shippingOption-300009").hide();
                    $(".CC-checkoutOrderSummary-shippingOption-300008").hide();
                    $('.overSized').hide();
                    $(".shippingOptions").hide();
                    $('.orderPopup').show();
                    $('#CC-Checkout-Placeorder').attr('disabled', true);
                    $('.bt-popup').show();
                    $( ".bt-popup" ).addClass( "popupCheck" );
                }
                
                //Case 4: Over Ride Shipping
                
                if(getWidget.overRideWeight()){
                    $(".CC-checkoutOrderSummary-shippingOption-300009").show();
                    $(".CC-checkoutOrderSummary-shippingOption-300008").show();
                    $('.overSized').hide();
                    $(".shippingOptions").show();
                    $('.orderPopup').hide();
                    $('#CC-Checkout-Placeorder').attr('disabled', false);
                    $('.bt-popup').hide();
                    $( ".bt-popup" ).removeClass( "popupCheck" );
                }
                
                //Case 5: Free Shipping and Over Size
                
                if(getWidget.koIsFreeShipping() && getWidget.isOverSized()){
                    //console.log('Free shipping and Oversized');
                    $(".CC-checkoutOrderSummary-shippingOption-300009").hide();
                    $(".CC-checkoutOrderSummary-shippingOption-300008").hide();
                    $('.overSized').show();
                    $(".shippingOptions").show();
                    $('.orderPopup').hide();
                    $('#CC-Checkout-Placeorder').attr('disabled', false);
                    $('.bt-popup').hide();
                    $( ".bt-popup" ).removeClass( "popupCheck" );
                }
                
                
                //Case 6: Free Shipping and Over Weight
                
                if(getWidget.koIsFreeShipping() && getWidget.isOverWeight()){
                     //console.log('Free shipping and Over weight');
                     getWidget.selectedShippingValue("300010");
                     getWidget.shippingmethods().defaultShipping("300010");
                     shippingmethods.getInstance().defaultShipping("300010");
                    $(".CC-checkoutOrderSummary-shippingOption-300009").hide();
                    $(".CC-checkoutOrderSummary-shippingOption-300008").hide();
                    $('.overSized').show();
                    $(".shippingOptions").show();
                    $('.orderPopup').hide();
                    $('#CC-Checkout-Placeorder').attr('disabled', false);
                    $('.bt-popup').hide();
                    $( ".bt-popup" ).removeClass( "popupCheck" );
                }
                
                //Case 7: Over Sized and Over Weight
                
                if(getWidget.isOverSized() && getWidget.isOverWeight()){
                    //console.log('over sized and Over weight');
                    $(".CC-checkoutOrderSummary-shippingOption-300009").hide();
                    $(".CC-checkoutOrderSummary-shippingOption-300008").hide();
                    $('.overSized').hide();
                    $(".shippingOptions").hide();
                    $('.orderPopup').show();
                    $('#CC-Checkout-Placeorder').attr('disabled', true);
                    $('.bt-popup').show();
                    $( ".bt-popup" ).addClass( "popupCheck" );
                }
                
                //Case 8: Over Sized and Over ride weight
                
                if(getWidget.isOverSized() && getWidget.overRideWeight()){
                    //console.log('over sized and Over ride weight');
                    $(".CC-checkoutOrderSummary-shippingOption-300009").hide();
                    $(".CC-checkoutOrderSummary-shippingOption-300008").hide();
                    $('.overSized').show();
                    $(".shippingOptions").show();
                    $('.orderPopup').hide();
                    $('#CC-Checkout-Placeorder').attr('disabled', false);
                    $('.bt-popup').hide();
                    $( ".bt-popup" ).removeClass( "popupCheck" );
                }
                
                
                //Case 9: Over ride and over weight
                if(getWidget.isOverWeight() && getWidget.overRideWeight()){
                    //console.log('over weight and Over ride weight');
                    $(".CC-checkoutOrderSummary-shippingOption-300010").show();
                    $(".CC-checkoutOrderSummary-shippingOption-300009").hide();
                    $(".CC-checkoutOrderSummary-shippingOption-300008").hide();
                    getWidget.shippingmethods().defaultShipping("300010");
                    getWidget.selectedShippingValue("300010");
                    $('.overSized').hide();
                    $(".shippingOptions").show();
                    $('.orderPopup').hide();
                    $('#CC-Checkout-Placeorder').attr('disabled', false);
                    $('.bt-popup').hide();
                    $( ".bt-popup" ).removeClass( "popupCheck" );
                }
                
                // Case 10 : Free shipping and Over Sized and Over Weight
                
                if(getWidget.koIsFreeShipping() && getWidget.isOverSized() && getWidget.isOverWeight()){
                    //console.log('Free shipping and over size and over weight');
                    $(".CC-checkoutOrderSummary-shippingOption-300010").show();
                    $(".CC-checkoutOrderSummary-shippingOption-300009").hide();
                    $(".CC-checkoutOrderSummary-shippingOption-300008").hide();
                    getWidget.shippingmethods().defaultShipping("300010");
                    $('.overSized').show();
                    $(".shippingOptions").show();
                    $('.orderPopup').hide();
                    $('#CC-Checkout-Placeorder').attr('disabled', false);
                    $('.bt-popup').hide();
                    $( ".bt-popup" ).removeClass( "popupCheck" );
                }
                
                // Case 11 : Free shipping and Over Sized and Over Weight and Over ride weight
                
                if(getWidget.koIsFreeShipping() && getWidget.isOverSized() && getWidget.isOverWeight() && getWidget.overRideWeight()){
                    //console.log('Free shipping and over size and over weight and over ride weight');
                    $(".CC-checkoutOrderSummary-shippingOption-300010").show();
                    $(".CC-checkoutOrderSummary-shippingOption-300009").hide();
                    $(".CC-checkoutOrderSummary-shippingOption-300008").hide();
                    getWidget.shippingmethods().defaultShipping("300010");
                    $('.overSized').show();
                    $(".shippingOptions").show();
                    $('.orderPopup').hide();
                    $('#CC-Checkout-Placeorder').attr('disabled', false);
                    $('.bt-popup').hide();
                    $( ".bt-popup" ).removeClass( "popupCheck" );
                }
                



                setTimeout(function() {
                 //$.Topic("shippingLoaded.memory").subscribe(function(e){
                    //})
                    //Alaska Hawaii
                    if((getWidget.airCheck() && getWidget.isOverSized()) || (getWidget.isAPOCheck() && getWidget.isOverSized()) ){
                        $("#CC-orderSummaryLoadingModal").hide();
                        $('.state-alert').css('display','block'); 
                        $('.overSized').hide();
                        $('#CC-Checkout-Placeorder').attr('disabled', true);
                    }
                    else if (getWidget.airCheck()) {
                        
                  
                        $('.overSized').hide();
                        $("#CC-orderSummaryLoadingModal").show();
                        $('.state-alert').css('display','none'); 
                        $('#CC-Checkout-Placeorder').attr('disabled', false);
                        $('.bt-popup').hide();
                       $('#CC-checkoutOrderSummary-shippingOption-300009').prop("checked", true).trigger("click");
                       $(".CC-checkoutOrderSummary-shippingOption-300010").hide();
                       
                    }else{
                       
                        $("#CC-orderSummaryLoadingModal").show();
                         $('.state-alert').css('display','none'); 
                         $('#CC-Checkout-Placeorder').attr('disabled', false);
                        getWidget.shippingmethods().defaultShipping("300010");
                        getWidget.selectedShippingValue("300010");
                    }
              
                 
                 //APO Check
                 
                  if(getWidget.isAPOCheck()){
                    //console.log('APO True');
                    $(".CC-checkoutOrderSummary-shippingOption-300009").hide();
                    $(".CC-checkoutOrderSummary-shippingOption-300008").hide();
                    $('.overSized').show();
                    $(".shippingOptions").show();
                    $('.orderPopup').hide();
                    $('#CC-Checkout-Placeorder').attr('disabled', false);
                    $('.bt-popup').hide();
                    $( ".bt-popup" ).removeClass( "popupCheck" );
                }
                
                }, 2000);
                },

                beforeAppear: function(page) {

                    var widget = this;
                // code for triggering shipping options on page load
                if(!getWidget.overWeight()) {
                    widget.shippingmethods().defaultShipping("300010");
                    shippingmethods.getInstance().defaultShipping("300010");
                    if(widget.cart().shippingMethod() !== '' && widget.cart().shippingMethod() === "300004") {
                        widget.cart().shippingMethod("300010");
                    }
                    getWidget.invokeExternalShippingMethodsCall();
                } else {
                    if(widget.cart().shippingMethod() != "300004" && widget.cart().shippingMethod() !== "") {
                        widget.shippingmethods().defaultShipping("300004");
                        shippingmethods.getInstance().defaultShipping("300004");
                        widget.cart().shippingMethod("300004");
                    }
                }
                
                // ends
                    ////console.log(ko.toJS(widget.order().cart().items()))
                    if (widget.order().cart().items().length > 0) {
                        //widget.initBTCall();
                    }
    
                    if (!widget.user().loggedIn()) {
                        ////console.log('loggedin user',widget.user().loggedIn())
                    }
    
                    if (widget.shippingmethods().shippingOptions().length > 0) {
                        //console.log("shipping methods")
                        widget.skipShipMethodNotification(true);
                        widget.shippingMethodsLoadedListener();
                        widget.setupShippingOptions();
    
                    }
    
                    widget.getShippingMethods();
                   
                widget.shippingMethodsLoaded(false);
                //Display shipping options in dropdown only if shipping address is valid
                if(widget.order().shippingAddress() 
                    && widget.order().shippingAddress().validateForShippingMethod()) {
                  widget.displayShippingOptions(true);
                }
        

    
    
    
    
                    widget.shippingMethodsLoaded(false);
                    widget.removeAdjacentShippingAmount(true);
                    $('#CC-checkoutOrderSummary-selectedShippingValue').hide();
                    widget.paypalAddressAltered(false);
                getWidget.displayOverWeightSection();
                getWidget.displayFreeShippingSection();
                getWidget.displayOverSizeSection();
                getWidget.displayOverRideWeightSection();
                 getWidget.invokeExternalShippingMethodsCall();
                //getWidget.commonShippingLogic();
                //Recaptcha Code begins
                $("script[id='googleRecaptcha']").remove();
                $("script[id='recaptchaCallback']").remove();
                var recaptchaScript = '<script id="googleRecaptcha" src="https://www.google.com/recaptcha/api.js?render=6LcE1OEZAAAAACWi7zHYjM7B4PjZUqniRlDBZHDi"></script>'
                
                var recaptchaMainScript = "<script id='recaptchaCallback' type='text/javascript'>" +
                                          "function onSubmit(token) {" +
                                             "document.getElementById('CC-Checkout-Placeorder').submit();" +
                                             "document.getElementById('CC-Checkout-Placeorder-Mobile').submit();" +
                                           "}" +
                                        "</script>"

                if ($("script[id='googleRecaptcha']").length === 0 && $("script[id='recaptchaCallback']").length === 0) {
                     $("head").append(recaptchaScript);
                     $("head").append(recaptchaMainScript);
                }
                //Recaptcha Code Ends
                },
                
            shippingMethodLoaded: function() {
                if(getWidget.koIsFreeShipping()){
                    getWidget.displayFreeShippingSection();
                    //getWidget.selectedShippingValue("300010");
                }
                if(getWidget.isOverWeight()) {
                    getWidget.displayOverWeightSection();
                }
               if(getWidget.isOverSized()){
                   getWidget.displayOverSizeSection();
               }
               if(getWidget.overRideWeight()){
                   getWidget.displayOverRideWeightSection();
               }
               // getWidget.commonShippingLogic();
            },
            // Click handler for the place order button
            handleCreateOrder: function(viewModel, event) {
                //   //console.log('Test Trigger');
                //$.Topic("checkoutBTPaymentDetails").publish("success");
                
                var widget = this;
               
                grecaptcha.ready(function() {
                  grecaptcha.execute('6LcE1OEZAAAAACWi7zHYjM7B4PjZUqniRlDBZHDi', {action: 'submit'}).then(function(token) {
                    //console.log(token,'Recaptcha Token');
                     var objNew = {
                                "token": token
                            }
                     $.ajax({
                                url: "/ccstorex/custom/petmate/v1/googleRecaptcha", //external URL
                                type: 'POST',
                                contentType: 'application/json',
                                data: JSON.stringify(objNew), //data needs to be passed
                                async: false,
                                dataType: 'json',
                                success: function(data) {
                     
                                    //console.log("----------googleRecaptcha success data-------------", data.response.score);
                                    
                                    if(data.response.score > 0.2 && data.response.success){
                                        //After checking it is a valid score from google the place order function triggers
                                        widget.placeOrderComplete();
                                    }else{
                                        notifier.sendError(getWidget.WIDGET_ID, "We found suspicious activity. Please contact our Consumer Services Team at 1-877-738-6283 to complete the order", true);
                                    }
                                },
                                error: function(data) {
                                     widget.placeOrderComplete();
                                    console.log(".......Recaptcha Error hosting.........", data);
                                }
                            });
                   
                  });
                });
                
            },
            
            placeOrderComplete: function(){
                var widget = this;
                $("#CC-Checkout-Placeorder-Mobile").attr('disabled',true);
                                        
                                        //console.log(widget,'widget');
                                        if (widget.user().loggedIn() === true && !widget.user().loggedinAtCheckout()) {
                                            widget.order().id(widget.user().orderId());
                                            widget.order().op("complete");
                                        }
                        
                        
                                        $("#cartType-error").removeClass('error');
                        
                                        if (this.displayShippingOptions() && !this.cart().isSplitShipping() && !this.selectedShippingValue()) {
                                            this.order().errorFlag = true;
                                            $('#CC-checkoutOrderSummary-selectedShippingValue').show();
                                            notifier.sendError("checkoutOrderSummary", CCi18n.t('ns.ordersummary:resources.checkoutErrorMsg'), true);
                                            widget.destroySpinner();
                                            // //console.log('Error Occured');
                                            return;
                                        }
                                        //this.cart().clearAllUnpricedErrorsAndSaveCart();
                                        $("#bt-submit-pay").trigger('click');
                                        //this.order().handlePlaceOrder();
            },
        };
    });