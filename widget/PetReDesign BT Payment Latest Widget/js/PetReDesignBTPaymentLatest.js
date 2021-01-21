define(
    // Dependencies
    ['ccResourceLoader!global/braintree-2.32.0','pubsub', 'ccConstants', 'spinner', 'knockout', 'CCi18n','ccResourceLoader!global/PetReDesignValidationWidget'],

    function(braintree, pubsub, ccConstants, spinner, ko, CCi18n) {
var deviceData  = null;
        "use strict";
        var getWidget = "";
        //var getCardTypes = ["visa","master-card","american-express","discover"]

        return {
            koNameOnCard: ko.observable(),
            koSelectedCardType: ko.observable(),
            koPaypalMethodNonceValue: ko.observable(),
            koEmailSignupValue:  ko.observable(),
            isPaypal:ko.observable(false),
           
            //koEvent: ko.observableArray(),
            koCardTypeImages: ko.observableArray(["visa", "master-card", "american-express", "discover"]),
            
            // Spinner resources
      BTFormIndicator:           '#brain-tree-integration',
      /*DEFAULT_SHIPPING_ERROR: "No Shipping Method Selected",
      DEFAULT_LOADING_TEXT:   "Loading...'",*/
      BTFormFieldIndicator: {
        parent: '#brain-tree-integration',
        posTop: '100px',
        posLeft: '30%'
      },
      
            onLoad: function(widget) {

                getWidget = widget;
                widget.koCardTypeImages();

                //Logged in user added spinner while placing order 
                $.Topic(pubsub.topicNames.USER_PROFILE_UPDATE_SUCCESSFUL).subscribe(function() {
                    widget.createSpinner();
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
                    options.content = widget.translate('Your Order Exceeds 150 lbs. Please contact our Consumer Services Team For Shipping Carrier Arrangements 1-877-738-6283');
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
        widget.creditCardDestroySpinner = function() {
          //$(widget.pricingIndicator).removeClass('loadingIndicator');
          spinner.selector= '#brain-tree-integration';
          $('#cc-spinner').hide();
          spinner.destroy();
        };
        widget.creditCardCreateSpinner = function() {
          $(widget.BTFormIndicator).css('position','relative');
          $('#cc-spinner').show();
          //widget.pricingIndicatorOptions.loadingText = widget.translate('rePricingText', {defaultValue: this.DEFAULT_LOADING_TEXT});
          spinner.create(widget.BTFormFieldIndicator);
        };
        
                //getWidget.createSpinner();
               
                var clientString = null;

                

                widget.cvvMouseOver = function(widget, event) {
                    // Popover was not being persisted between
                    // different loads of the same 'page', so
                    // popoverInitialised flag has been removed

                    // remove any previous handlers
                    $('.cvvPopover').off('click');
                    $('.cvvPopover').off('keydown');

                    var options = new Object();
                    options.trigger = 'manual';
                    options.html = true;

                    // the button is just a visual aid as clicking anywhere will close popover
                    options.title = widget.translate('cardCVVPopupTitle') +
                        "<button id='cardCVVPopupCloseBtn' class='close btn pull-right'>" +
                        widget.translate('escapeKeyText') +
                        " &times;</button>";

                    options.content = widget.translate('cardCVVPopupText');

                    $('.cvvPopover').popover(options);
                    $('.cvvPopover').on('click', widget.cvvShowPopover);
                    $('.cvvPopover').on('keydown', widget.cvvShowPopover);
                };

                widget.cvvShowPopover = function(e) {
                    // if keydown, rather than click, check its the enter key
                    if (e.type === 'keydown' && e.which !== ccConstants.KEY_CODE_ENTER) {
                        return;
                    }

                    // stop event from bubbling to top, i.e. html
                    e.stopPropagation();
                    $(this).popover('show');

                    // toggle the html click handler
                    $('html').on('click', widget.cvvHidePopover);
                    $('html').on('keydown', widget.cvvHidePopover);

                    $('.cvvPopover').off('click');
                    $('.cvvPopover').off('keydown');
                };

                widget.cvvHidePopover = function(e) {
                    // if keydown, rather than click, check its the escape key
                    if (e.type === 'keydown' && e.which !== ccConstants.KEY_CODE_ESCAPE) {
                        return;
                    }

                    $('.cvvPopover').popover('hide');

                    $('.cvvPopover').on('click', widget.cvvShowPopover);
                    $('.cvvPopover').on('keydown', widget.cvvShowPopover);

                    $('html').off('click');
                    $('html').off('keydown');

                    $('.cvvPopover').focus();
                };


                // alert('outside'+this.clientString) 

            },
      
 getCustomerCheckoutForm: function() {
                if(getWidget.isPaypal()){
                        if (checkoutCreateAccountForm.form() &&  checkoutLoginForm.form() && CustomerCheckoutAddressBookForm.form() && CustomerBillingAddressBookForm.form()) {
                            getWidget.triggerPlaceOrder()
                            }
                }else{
                    if (checkoutCreateAccountForm.form() &&  checkoutLoginForm.form() && CustomerCheckoutAddressBookForm.form() && CustomerBillingAddressBookForm.form() && checkoutBTPaymentFormValidate.form()) {
                    getWidget.triggerPlaceOrder()
                     }
                }
            },
            getGuestUserCheckoutForm: function() {
              
                 if(getWidget.isPaypal()){
                    if (checkoutCreateAccountForm.form() &&  checkoutLoginForm.form() && CustomerCheckoutAddressBookForm.form() && CustomerBillingAddressBookForm.form()) {
                    getWidget.triggerPlaceOrder()
                    }
                }else{

                    if (checkoutCreateAccountForm.form() && customGuestUserForm.form() &&  checkoutLoginForm.form() && CustomerCheckoutAddressBookForm.form() && CustomerBillingAddressBookForm.form() && checkoutBTPaymentFormValidate.form()) {
                    getWidget.triggerPlaceOrder()
                     }
                }
            },

            
                  triggerPlaceOrder : function(data, event, page){
                var widget = this;
                    $("#CC-Checkout-Placeorder").attr('disabled',true);
                   $('#CC-Checkout-Placeorder-Mobile').trigger('click'); 
                   
                         
                    //Bronto
                   // setTimeout(function(){
                       var emailFlagCheckout = widget.user().emailMarketingMails();
                    if(emailFlagCheckout){
                        //var optInMail = widget.user().email();
                        var optInMail = $('#CC-checkoutRegistration-email').val();
                        widget.koEmailSignupValue(optInMail);
                        $('#brontoEmailId').remove();
                        var brontoEmail = '<img id="brontoEmailId" src="https://app.bronto.com/public/?q=direct_add&fn=Public_DirectAddForm&id=bjoxunlmlfrmycqpxmpztvpnnlwkbof&email=' + getWidget.koEmailSignupValue() + '&&list1=0bcd03ec000000000000000000000019c915" width="0" height="0" border="0" alt=""/>'
                        $('body').append(brontoEmail);
                    } 
                   // },1000);
                    
             //Ends
          
                
            },
            btPaymentForm: function(){
                    $.Topic("checkoutBTPaymentDetails.memory").publish("success");
            },
                  
            beforeAppear: function (page) {
            var widget = this;
            //commenting for global spinner
                //widget.creditCardCreateSpinner();
             //Ends   
                //Failure call
                
                $.Topic(pubsub.topicNames.ORDER_SUBMISSION_FAIL).subscribe(function(){
                     $("#CC-Checkout-Placeorder").attr('disabled',false);
                    $("#CC-Checkout-Placeorder-Mobile").attr('disabled',false);
                });

                
                // Bt Payment code
                var testGetTokenURL = 'https://b2c-uat.petmate.com/b2c/api/v1/bts/getToken';
                var prdGetTokenURL = 'https://services.petmate.com/b2c/api/v1/bts/getToken';
                var tokenURL = null;
                if (widget.isPreview()) {
                    tokenURL = testGetTokenURL;
                }else{
                    tokenURL = prdGetTokenURL;
                }
                //console.log('tokenURL',tokenURL);
            $.ajax(tokenURL, {
                    data: {
                        id: 123456
                    }
                }).then(
                    function success(name) {
                        this.clientString = name.clientToken;
                       // //console.log("BT Client Token",name.clientToken);
                        //getWidget.destroySpinner();
                        setTimeout(function(){
                           // //console.log('BT destroy spinner')
                           getWidget.creditCardDestroySpinner()
                            //$.Topic('checkoutBTPaymentDetails.memory').publish('success');
                        }, 1000);
                        

                
                if (widget.isPreview()) {
                    var prdEnv='sandbox';
                    var merchantID = 171330;
                }else{
                    var prdEnv='production';
                    var merchantID = 171330;
                }
                //console.log(prdEnv,'prdEnv')
                        braintree.setup(
                            this.clientString,
                            'custom', {
                                dataCollector: {
                                    kount: {
                                      environment: prdEnv,
                                      merchantId: merchantID,
                                      paypal: true
                                    }
                                  },
                                  onReady: function (braintreeInstance) {
                                    var form = document.getElementById('bt-payment-form');
                                    var deviceDataInput = null;
                                    if (deviceDataInput === null) {
                                      deviceDataInput = document.createElement('input');
                                      deviceDataInput.name = 'device_data';
                                      deviceDataInput.type = 'hidden';
                                      form.appendChild(deviceDataInput);
                                    }
                                  //  //console.log("deviceData from braintreeInstance");
                                   // //console.log(braintreeInstance.deviceData);
                                    deviceDataInput.value = braintreeInstance.deviceData;
                                   // //console.log("deviceData from deviceDataInput.value");
                                  //  //console.log(deviceDataInput.value);
                                    deviceData=deviceDataInput.value;
                                  },
                                id: 'bt-payment-form',
                                hostedFields: {
                                    styles: {
                                        // Style all elements
                                        "input, select": {
                                            "font-size": "13.3333px",
                                            "color": "#555",
                                            "padding": "15px",
                                            "border": "1px solid #f4f3f2",
                                            "background-color": "#fff",
                                            "resize": "none",
                                            "outline": "none",
                                            "text-transform": "none",
                                            "height": "51px",
                                            "font-weight": "normal",
                                            "border-radius": "0",
                                            "font-family": 'arial',
                                            "line-height": "19.0476px"
                                        },

                                        // Styling a specific field
                                        ".number": {
                                            "background-color": "#ffffff",
                                            "width": "50%",
                                            "border-width": "1px",
                                            "border-style": "inset",
                                            "border-color": "initial",
                                            "border-image": "initial",
                                            "font-size": "13.3333px",
                                            "color": "#555"
                                        },

                                        ".cvv": {
                                            "background-color": "#ffffff",
                                            "width": "20%",
                                            "border-width": "1px",
                                            "border-style": "inset",
                                            "border-color": "initial",
                                            "border-image": "initial",
                                            "font-size": "13.3333px",
                                            "color": "#555"
                                        },

                                        ".expirationDate": {
                                            "background-color": "#ffffff",
                                            "width": "20%",
                                            "border-width": "1px",
                                            "border-style": "inset",
                                            "border-color": "initial",
                                            "border-image": "initial",
                                            "font-size": "13.3333px",
                                            "color": "#555"
                                        },

                                        // Styling element state
                                        ":focus": {
                                            "color": "blue"
                                        },
                                        ".valid": {
                                            "color": "green"
                                        },
                                        ".invalid": {
                                            "color": "red"
                                        },

                                        // Media queries
                                        // Note that these apply to the iframe, not the root window.
                                        "@media screen and (max-width: 700px)": {
                                            "input": {
                                                "font-size": "14pt"
                                            }
                                        }
                                    },
                                    /*name:{
                                        selector: '#bt-cardholder-name'
                                    },*/
                                    number: {
                                        selector: "#bt-card-number",
                                        placeholder: 'valid card number'
                                    },
                                    expirationDate: {
                                        selector: "#bt-expiration-date",
                                        placeholder: 'mmyyyy'
                                    },
                                    cvv: {
                                        selector: "#bt-cvv",
                                        placeholder: 'cvv'
                                    },
                                   /* expirationMonth: {
                                    selector: '#expiration-month',
                                    placeholder: 'Month',
                                    select: {
                                      options: [
                                        '01 - January',
                                        '02 - February',
                                        '03 - March',
                                        '04 - April',
                                        '05 - May',
                                        '06 - June',
                                        '07 - July',
                                        '08 - August',
                                        '09 - September',
                                        '10 - October',
                                        '11 - November',
                                        '12 - December'
                                      ]
                                    }
                                  },
                                  expirationYear: {
                                    selector: '#expiration-year',
                                    placeholder: 'Year',
                                    select: true
                                  },*/
                                    onFieldEvent: function(event) {
                                        //getWidget.koEvent([]);
                                        
                                        if (event.type === 'focus') {
                                            // Handle focus
                                            $('#error-msg').text('');

                                        } else if (event.type === 'blur') {
                                            // Handle blur
                                        } else if (event.type === 'fieldStateChange') {
                                            // Handle a change in validation or card type
                                            
                                            if (event.isEmpty && !event.isValid) {
                                                if ($('#CC-checkoutPaymentDetails-nameOnCard').val() != '') {
                                                    if (event.target.container.className == 'braintree-hosted-fields-invalid') {
                                                        if (event.target.container.nextElementSibling.id == "cardNumber-error") {
                                                            $('#' + event.target.container.nextElementSibling.id).addClass('error');
                                                            $('#' + event.target.container.nextElementSibling.id).text('Card Number is required.')
                                                        }
                                                        if (event.target.container.nextElementSibling.id == "cvv-error") {
                                                            $('#' + event.target.container.nextElementSibling.id).addClass('error');
                                                            $('#' + event.target.container.nextElementSibling.id).text('CVV is required.')
                                                        }
                                                        if (event.target.container.nextElementSibling.id == "expireDate-error") {
                                                            $('#' + event.target.container.nextElementSibling.id).addClass('error');
                                                            $('#' + event.target.container.nextElementSibling.id).text('Expiration Date is required.')
                                                        }
                                                        //$(".braintree-hosted-fields-invalid input.invalid").first().focus();
                                                        $('html, body').animate({
                                                            scrollTop: $(".braintree-hosted-fields-invalid").first().offset().top-150
                                                        }, 2000)
                                                    }
                                                }



                                            }
                                            if (!event.isEmpty ) {
                                                $('#' + event.target.container.nextElementSibling.id).removeClass('error');
                                                widget.validatePaymentForm(event);
                                            }
                                            if(event.isValid){
                                                $('#' + event.target.container.nextElementSibling.id).removeClass('error');
                                            }

                                            if (event.card) {
                                                var cardType = event.card.type;
                                                //cardType = cardType.replace("-", "").replace(" ", "");

                                                var cardImg = $('.cardTypeImage').find('img');
                                                for (var i = 0; i < cardImg.length; i++) {
                                                    if (cardImg[i].id == cardType) {
                                                        $('.cardTypeImage').find('img').removeClass('selected');
                                                        $('#' + cardType).addClass('selected');
                                                        break;
                                                    } else {
                                                        $('.cardTypeImage').find('img').removeClass('selected');
                                                    }
                                                }
                                                // visa|master-card|american-express|diners-club|discover|jcb|unionpay|maestro
                                            }
                                        }

                                    }

                                },
                                onError: function(error) {
                                    widget.showFormErrors(error);
                                    widget.order().destroySpinner();
                                },
                                paypal: {
                                    //container:'bt-payment-form',
                                    container: 'CC-checkoutOrderSummary-paypal',
                                    singleUse: false,
                                    billingAgreementDescription: 'Your agreement description',
                                    currency: 'USD',
                                    locale: 'en_us',
                                    enableShippingAddress: true,
                                    enableBillingAddress: true,
                                    button: {
                                        type: 'checkout'
                                    },
                                    onSuccess: function (nonce, email) {
                                       
                                      // This will be called as soon as the user completes the PayPal flow
                                      // nonce:String
                                      // email: String
                                        widget.isPaypal(true);
                                         widget.PaypalVerified(); 
                                        checkoutBTPaymentFormValidate.destroy();
                                    },
                                    onCancelled: function(obj){
                                        
                                          widget.isPaypal(false);
                                            $.Topic("checkoutBTPaymentDetails.memory").publish('success');
                                    }
                                },
                                

                                onPaymentMethodReceived: function(obj) {
                                 //   //console.log("Obj from onPaymentMethodReceived");
                                  //  //console.log(JSON.stringify(obj));
                                  window.scrollTo(0, 0);
                                    if (obj.type != 'PayPalAccount') {
                                        

                                            getWidget.koNameOnCard($('#CC-checkoutPaymentDetails-nameOnCard').val());
                                            getWidget.order().paymentDetails().nameOnCard(getWidget.koNameOnCard());

                                            var nonce = JSON.stringify(obj);

                                            obj.deviceData = deviceData;
                                            //   //console.log("Obj with deviceData");
                                            //  //console.log(JSON.stringify(obj));
                                            var payment = {
                                                type: "generic",
                                                id: widget.id(),
                                                nameOnCard: widget.koNameOnCard(),
                                                customProperties: obj
                                            }
                                            var payments = [payment];

                                            //console.log("widget order before update payments");
                                            //  //console.log(widget.order());
                                            widget.order().updatePayments(payments);
                                           
                                            
                                            //  //console.log("widget order after update payments");
                                            //console.log(widget.order());
                                            //widget.order().id(null);
                                            //widget.order().op(ccConstants.ORDER_OP_COMPLETE);
                                            //widget.createSpinner();

                                            widget.order().handlePlaceOrder();
                                            //console.log('BT JS Handle Place Order');

                                            //console.log(widget.order().billingAddress(),'Billing check');
                                            //console.log(ko.toJS(widget.order()),'widget.order()');
                                            //console.log(ko.toJS(widget.order().shippingAddress()),'widget.order().shippingAddress()');
                                            //console.log(ko.toJS(widget.order().billingAddress()),'widget.order().billingAddress()');

                                            //console.log(valuen,'valuen');*/
                                        
    
                                    
                                    }else if(obj.type== 'PayPalAccount'){
                                       
                                        getWidget.createSpinner();
                                        var nonce = JSON.stringify(obj);
                                        obj.deviceData=deviceData;
                                        var payment = {
                                            type: "generic",
                                            id: widget.id(),
                                            nameOnCard: getWidget.koNameOnCard(),
                                            customProperties: obj
                                        }
                                        var payments = [payment];
                                        //console.log("widget order before update payments");
                                      //  //console.log(widget.order());
                                          widget.order().updatePayments(payments);
                                        //console.log("widget order after update payments");
                                      //  //console.log(widget.order());
                                        /*widget.order().id(null);
                                        widget.order().op(ccConstants.ORDER_OP_COMPLETE);
                                        widget.order().createOrder();*/
                                        widget.order().handlePlaceOrder();
    
                                    }
                                    
                                }
                            }) // invoking braintree.setup call
                            /*document.querySelector('#CC-checkoutOrderSummary-paypal').addEventListener('click', function (event) {
                                  event.preventDefault();
                                }, false);*/

                    }, // On successfully receiving the client token
                    function fail(data, status) {
                        $("#error-msg").html(data.message);
                    }
                );
                
                
            },
            
            PaypalVerified: function(){   
                $('#CC-checkoutOrderSummary-placeOrder button').trigger('click');
            },
            validatePaymentForm: function(event) {
                if (!event.isValid) {
                    
                   if($( ".bt-popup" ).hasClass( "popupCheck" )){
                       //console.log('class present one');
                             $("#CC-Checkout-Placeorder").attr('disabled',true);
                             $("#CC-Checkout-Placeorder-Mobile").attr('disabled',true);
                        }
                    $('#' + event.target.container.nextElementSibling.id).text('');
                   
                     if(event.target.container.className == 'braintree-hosted-fields-focused braintree-hosted-fields-invalid'){
                        if (event.target.container.nextElementSibling.id == "cardNumber-error") {
                            $('#' + event.target.container.nextElementSibling.id).addClass('error');
                            $('#' + event.target.container.nextElementSibling.id).text('Please enter a valid credit card number')
                        }
                        if (event.target.container.nextElementSibling.id == "cvv-error") {
                            $('#' + event.target.container.nextElementSibling.id).addClass('error');
                            $('#' + event.target.container.nextElementSibling.id).text('Please enter a valid CVV number.')
                        }
                        if (event.target.container.nextElementSibling.id == "expireDate-error") {
                            $('#' + event.target.container.nextElementSibling.id).addClass('error');
                            $('#' + event.target.container.nextElementSibling.id).text('Please enter a valid expiration date')
                        }
                    }
                    else if(event.target.container.className == 'braintree-hosted-fields-focused'){
                        $('#' + event.target.container.nextElementSibling.id).text('')
                    }
                } else if (event.isValid) {
                    $("#CC-Checkout-Placeorder").attr('disabled',false);
                    $("#CC-Checkout-Placeorder-Mobile").attr('disabled',false);
                    if($( ".bt-popup" ).hasClass( "popupCheck" )){
                             $("#CC-Checkout-Placeorder").attr('disabled',true);
                             $("#CC-Checkout-Placeorder-Mobile").attr('disabled',true);
                        }
                 
                    $('#' + event.target.container.nextElementSibling.id).text('')
                    if (event.target.container.nextElementSibling.id == "cardNumber-error") {
                        $('#' + event.target.container.nextElementSibling.id).removeClass('error');
                        $('#' + event.target.container.nextElementSibling.id).text('')
                    }
                    if (event.target.container.nextElementSibling.id == "cvv-error") {
                        $('#' + event.target.container.nextElementSibling.id).removeClass('error');
                        $('#' + event.target.container.nextElementSibling.id).text('')
                    }
                    if (event.target.container.nextElementSibling.id == "expireDate-error") {
                        $('#' + event.target.container.nextElementSibling.id).removeClass('error');
                        $('#' + event.target.container.nextElementSibling.id).text('')
                    }
                }
                else if(event.isValid){
                        $('#' + event.target.container.nextElementSibling.id).removeClass('error');
                }
            },
            
            showFormErrors: function(error) {
                getWidget.destroySpinner();
                $("#error-msg").text(error.message);

                if (error.message == 'Some payment method input fields are invalid.') {
                    $.each(error.details.invalidFieldKeys, function(key, val) {
                        if (val == 'number') {
                            $('#cardNumber-error').text('Card Number is required');
                            $('#cardNumber-error').addClass('error');
                        }
                        if (val == 'expirationDate') {
                            $('#expireDate-error').text('Expiration Date is required.');
                            $('#expireDate-error').addClass('error');
                        }
                        if (val == 'cvv') {
                            $('#cvv-error').text('CVV is required.');
                            $('#cvv-error').addClass('error');
                        }
                    });
                }

            },
            /**
             * Destroy the 'loading' spinner.
             * @function  OrderViewModel.destroySpinner
             */
            destroySpinner: function() {
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
            },
        };
    }
);
