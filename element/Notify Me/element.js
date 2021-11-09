define(
    //-------------------------------------------------------------------
    // DEPENDENCIES
    //-------------------------------------------------------------------  
    ['jquery', 'knockout', 'navigation', 'ccConstants', 'ccRestClient', 'pubsub', 'notifier'],
    // -------------------------------------------------------------------
    // MODULE DEFINITION
    // -------------------------------------------------------------------
    function($, ko, navigation, CCConstants, CCRestClient, pubsub, notifier) {
        "use strict";
        return {
            elementName: 'product-notify-me',
            showNotifyMe: ko.observable(false),

            onLoad: function(widget) {
                var self = this;

                $.Topic(pubsub.topicNames.PRODUCT_VIEWED).subscribe(function(product) {
                    self.setVisible(widget);
                });
                $.Topic(pubsub.topicNames.SKU_SELECTED).subscribe(function(product, sku, variant) {
                    self.setVisible(widget);
                });

                widget.stockStatus.subscribe(function(newValue) {
                    self.setVisible(widget);
                });

                $("[id^='CC-prodDetails-'").on("change", function(evt, data) {
                    if ($(evt.target).find("option:selected").index() == 0) {
                        //the "Select..." option has been selected, hide the notify-me
                        self.showNotifyMe(false);
                    }
                });

                //Set up subscriptions to user product notification events        $.Topic(pubsub.topicNames.USER_PRODUCT_NOTIFICATION_SUCCESS).subscribe
                (function(data) {
                    notifier.sendSuccess(widget.WIDGET_ID, widget.translate('notifySuccess'));
                });

                $.Topic(pubsub.topicNames.USER_PRODUCT_NOTIFICATION_FAILED).subscribe(function(data) {
                    notifier.sendSuccess(widget.WIDGET_ID, widget.translate('notifyFailed'));
                });

                widget.confirmNotify = function(widget, email) {
                    var inputData = {},
                        skuId = '';

                    inputData.siteId = widget.site().siteInfo.id;
                    inputData.productId = widget.product().id();

                    if (widget.selectedSku()) {
                        skuId = widget.selectedSku().repositoryId;
                    } else {
                        //SKU for top level product
                        skuId = widget.product().stockStatus().catRefId || '';
                    }
                    inputData.skuId = skuId;

                    inputData.profileId = widget.user().repositoryId();
                    inputData.email = email;
                    inputData.locale = widget.locale();
                    inputData.expiryDate = "";

                    widget.user().createProductNotification(inputData);

                    $("#CC-notify-me-dialog").modal("hide");
                }
            },
            confirm: function(widget, event) {
                if (widget.user().emailAddress.isValid()) {
                    var email = $("#CC-notify-email-input").val();
                    widget.confirmNotify(widget, email);
					 $("#CC-notify-email-input").val('');
					 $("#notifyMe .input-group").css('display','none');
                     $(".thanks-message").css('display', 'block');
					var email = "tchandrasekar@petmate.com";
                    widget.confirmNotify(widget, email);
                     $(".thanks-message").fadeOut(4000);
					 setTimeout(function(){
						 $("#notifyMe .input-group").css('display','inline-flex');
					 },4000)
					 //Send a copy of email to B2C server
					 var itemNumber = widget.selectedSku().repositoryId;
					 var emailInput = widget.user().emailAddress().toString();
					  var objNew = {
                        "emailId": emailInput,
						"item": itemNumber,
                      };
					 $.ajax({
                            url: "https://services.petmate.com:9090/backinstock/instock",
                            type: "POST",
                            contentType: "application/json",
                            data: JSON.stringify(objNew),
                            success: function(response) {
                                  console.log(response,'Response Message');                             
                            }
                        });
					 //Send a confirmation email
					 var emailInputConfirmation = widget.user().emailAddress()+",tchandrasekar@petmate.com,haggas@petmate.com,rbenbassett@petmate.com";
					 var itemColor =  widget.selectedSku().color.toString();
					 var itemSize =  widget.selectedSku().size.toString();
					 var itemImage = "https://www.petmate.com/"+widget.product().primaryFullImageURL().toString();
					 var itemName = widget.product().displayName().toString();
						
					var inputData = {
						"messageDetails": {
						"notificationType": "order_rejected_v1",
						"locale": "en-US",
						"toEmail": emailInputConfirmation.toString()
						},
						"organization": {
						"name": ""
						},
						"recipientFullName": "",
						"recipientEmailAddress": emailInputConfirmation.toString(),
						"storefrontUrl": "",
						"sitename": "",
						"isScheduledOrder": false,
						"orderId": "",
						"shippingAddress": {
						"firstName": itemImage,
						"lastName": itemName,
						"prefix": "",
						"suffix": "",
						"address1": itemColor,
						"address2": itemSize,
						"address3 ": itemNumber.toString(),
						"city": "",
						"county": "",
						"state": "",
						"postalCode": "",
						"country": ""
						},
						"isPaymentTypeDeferred": true,
						"paymentMethods": [""],
						"shippingMethods": [""],
						"orderItems": [{
						"addOnItem": false,
						"imageLocation": "",
						"title": "",
						"location": "",
						"productId": "",
						"catRefId": "",
						"quantity": 1,
						"price": "",
						"actionCode": ""
						}],
						"subtotal": "",
						"discount": "",
						"tax": "",
						"shipping": "",
						"total": ""
						} 
						
						
						$.ajax({
                            url: "/ccstorex/custom/petmate/v1/customEmailNotifications",
                            type: "POST",
                            contentType: "application/json",
                            data: JSON.stringify(inputData),
                            success: function(response) {
                                  console.log(response,'Response Message');                             
                            }
                        });
                }
            },
            notifyMe: function(widget) {
                notifier.clearError(widget.WIDGET_ID);
                if (!widget.user().loggedIn()) {
                    widget.user().reset();
                    $("#CC-notify-email-input").val("");
                    $("#CC-notify-me-dialog").modal("show");
                    $('#CC-notify-me-dialog').on('shown.bs.modal', function() {
                        $("#CC-notify-email-input").focus();
                    });
                    $('#CC-notify-me-dialog').on('hidden.bs.modal', function() {
                        $("#CC-notifyMe-link").focus();
                    });
                } else {
                    widget.confirmNotify(widget, widget.user().email());
                }
            },
            cancel: function() {
                $("#CC-notify-me-dialog").modal("hide");
            },
            setVisible: function(widget) {
                var hide = false;

                //if a product has variants, but none are selected, don't show the
                //notify me option
                if (widget.productVariantOptions &&
                    widget.productVariantOptions()) {
                    if (!widget.selectedSku()) {
                        hide = true;
                    }
                    //always allow options to be selected
                    if (widget.disableOptions) {
                        widget.disableOptions(false);
                    }
                }
                this.showNotifyMe(!widget.stockStatus() && !hide);
            },
            /**
             * Ignores the blur function when mouse click is up
             */
            handleMouseUp: function(data) {
                this.ignoreBlur(false);
                data.user().ignoreEmailValidation(false);
                return true;
            },
            /**
             * Ignores the blur function when mouse click is down
             */
            handleMouseDown: function(data) {
                this.ignoreBlur(true);
                data.user().ignoreEmailValidation(true);
                return true;
            }
        };
    }
);