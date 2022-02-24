/**
 * @fileoverview Checkout Address Book Widget.
 */
/*global $ */
/*global define */
define(

  //-------------------------------------------------------------------
  // DEPENDENCIES
  //-------------------------------------------------------------------
  ['knockout', 'viewModels/address', 'ccConstants', 'pubsub',
    'koValidate', 'notifier', 'ccKoValidateRules', 'storeKoExtensions',
    'spinner', 'navigation', 'storageApi', 'CCi18n','ccLogger','ccResourceLoader!global/petmateJquery.slimscroll', 'ccResourceLoader!global/PetReDesignValidationWidget'],

  //-------------------------------------------------------------------
  // MODULE DEFINITION
  //-------------------------------------------------------------------

  function(ko, Address, CCConstants, pubsub, koValidate, notifier,
    rules, storeKoExtensions, spinner, navigation, storageApi, CCi18n,ccLogger) {

    "use strict";
      var getWidget = "";

        //Google Address Global variables
        var placeSearch, autocomplete;
        var componentForm = {
            street_number: 'short_name',
            route: 'long_name',
            locality: 'long_name',
            administrative_area_level_1: 'short_name',
            country: 'long_name',
            postal_code: 'short_name'
        };

        var componentMapping = {
            street_number: 'txtAddress31',
            locality: 'txtCity3',
            administrative_area_level_1: 'selectState3',
            postal_code: 'txtZip3'
        };

        var componentMappingBilling = {
            street_number: 'txtAddress1234',
            locality: 'txtCity231',
            administrative_area_level_1: 'selectState231',
            postal_code: 'txtZip231'
        };
        
        
    return {

      useAsBillAddress: ko.observable(true),
      displayUseAsBillAddress: ko.observable(),

      // Switch between view and 'edit' views
      isUsingSavedAddress: ko.observable(false),
      isSelectingAddress: ko.observable(false),
      billingAddressEnabled: ko.observable(),
      addressSetAfterWebCheckout: ko.observable(false),
      addressSetAfterOrderLoad: ko.observable(false),
      showPreviousAddressInvalidError: ko.observable(false),
      previousSelectedCountryValid: ko.observable(false),
      shippingAddressBook: ko.observableArray().extend({ deferred: true }),
      loadPersistedShipping : ko.observable(false),
      IsDefaultShipping:ko.observable(false),
      koSelectedState: ko.observable(),
      koBillingSelectedState: ko.observable(),
      // Spinner resources
      shippingAddressIndicator: '#shippingAddress',
      shippingAddressIndicatorOptions: {
        parent: '#shippingAddress',
        posTop: '50px',
        posLeft: '30%'
      },
    
      maskPhoneNumber: function(getPhone) {
                if (getPhone == 'null' || getPhone == null || getPhone == '') {
                    return '';
                } else {
                    return getPhone.match(new RegExp('.{1,4}$|.{1,3}', 'g')).join("-");
                }
            },

      /**
       * Repopulate this form with up to date info from the User view model.
       */
      reloadAddressInfo: function () {

        var widget = this;

        if (widget.shippingCountriesPriceListGroup().length == 0) {
          widget.destroySpinner();
          $.Topic(pubsub.topicNames.NO_SHIPPING_METHODS).publish();
        }
        //If there are no billing countries disable all the fields of billing address
        if (!widget.billingCountries().length) {
          $('#billingAddress').attr('disabled', 'disabled');
        }

        widget.isUsingSavedAddress(false);

        $('#CC-addressBook-picker').on('shown.bs.modal', function () {
          $('#CC-addressBook-picker :focusable').first().focus();
        });

        $('#CC-addressBook-picker').on('hide.bs.modal', function () {
          $('#cc-checkout-show-address-book').focus();
        });
        
             

        // Should always use registered shopper's saved shipping address book if set
        var eventToFire = pubsub.topicNames.VERIFY_SHIPPING_METHODS;
        if (widget.user().loggedIn() === true && widget.user().updatedShippingAddressBook && widget.user().updatedShippingAddressBook.length > 0) {
          var shippingAddresses = [];
          var shippingAddressesAll = [];
          for (var k = 0; k < widget.user().updatedShippingAddressBook.length; k++) {
            var shippingAddress = new Address('user-saved-shipping-address', widget.ErrorMsg, widget, widget.shippingCountriesPriceListGroup(), widget.defaultShippingCountry());
            shippingAddress.countriesList(widget.shippingCountriesPriceListGroup());
            shippingAddress.copyFrom(widget.user().updatedShippingAddressBook[k], widget.shippingCountriesPriceListGroup());
            // Save shipping address JS object to Address object.
            shippingAddress.resetModified();
            shippingAddress.county(widget.user().updatedShippingAddressBook[k].county);
            shippingAddress.selectedCountry.subscribe(function(newValue) {
              widget.checkIfSelectedShipCountryInBillCountries();
            });
            if (shippingAddress.isValid()) {
              shippingAddresses.push(shippingAddress);
            }
            if (shippingAddress.isDefaultAddress() && !widget.addressSetAfterWebCheckout() && 
                !widget.addressSetAfterOrderLoad() && shippingAddress.isValid()) {
              widget.order().shippingAddress().copyFrom(shippingAddress.toJSON(), widget.shippingCountriesPriceListGroup());
              widget.order().shippingAddress().county(shippingAddress.county());
              widget.notifyListenersOfShippingAddressPhoneNumberUpdate();
            }
            widget.addressSetAfterWebCheckout(false);
            widget.addressSetAfterOrderLoad(false);
            
            //Preserve existing logic to save all the addresses to user().shippingAddressBook, irrespective of their validness
            var shippingAddressValidOrInValid = new Address('user-saved-shipping-address', widget.ErrorMsg, widget, widget.shippingCountries(), widget.defaultShippingCountry());
            shippingAddressValidOrInValid.countriesList(widget.shippingCountries());
            shippingAddressValidOrInValid.copyFrom(widget.user().updatedShippingAddressBook[k], widget.shippingCountries());
            shippingAddressValidOrInValid.county(widget.user().updatedShippingAddressBook[k].county);
            shippingAddressesAll.push(shippingAddressValidOrInValid);
          }
          widget.shippingAddressBook(shippingAddresses);
          widget.user().shippingAddressBook(shippingAddressesAll);
          widget.user().resetShippingAddressBookModified();

          // There shouldn't be a case where no default address was set.
          if (!widget.order().shippingAddress().isValid() && widget.shippingAddressBook()[0]) {
        	widget.order().shippingAddress().copyFrom(widget.shippingAddressBook()[0].toJSON(), widget.shippingCountriesPriceListGroup());
            widget.order().updateShippingAddress.bind(widget.order().shippingAddress())();
            widget.notifyListenersOfShippingAddressPhoneNumberUpdate();
          }

          eventToFire = pubsub.topicNames.POPULATE_SHIPPING_METHODS;
          if (!widget.order().isPaypalVerified() && shippingAddresses.length > 0) {
            widget.isUsingSavedAddress(true);
          }
          //If the user has all invalid addresses then set the cart address if present
          if (!widget.order().shippingAddress().isValid() && widget.cart().shippingAddress()) {
            var shippingAddress = new Address('cart-shipping-address', widget.ErrorMsg, widget, widget.shippingCountriesPriceListGroup(), widget.defaultShippingCountry());
            shippingAddress.countriesList(widget.shippingCountriesPriceListGroup());
            // Save shipping address JS object to Address object.
            shippingAddress.copyFrom(widget.cart().shippingAddress(), widget.shippingCountriesPriceListGroup());
            shippingAddress.resetModified();
            widget.order().shippingAddress().copyFrom(shippingAddress.toJSON(), widget.shippingCountriesPriceListGroup());
            widget.order().shippingAddress().county(shippingAddress.county());
            widget.notifyListenersOfShippingAddressPhoneNumberUpdate();
          }
        }
        // Otherwise If the cart shipping address is already set, then use this
        else if (widget.cart().shippingAddress()) {
          widget.order().shippingAddress().copyFrom(widget.cart().shippingAddress().toJSON(), widget.shippingCountriesPriceListGroup());
          widget.notifyListenersOfShippingAddressPhoneNumberUpdate();
        }
        
        widget.checkIfSelectedShipCountryInBillCountries();
        
        
        if(widget.shippingAddressBook().length>0){

           $.Topic(pubsub.topicNames.PAGE_READY).subscribe(function() {
                    if ($(".shipping-addressBook").is(':visible')) {
						if(widget.shippingAddressBook().length>2){
                              $('.shipping-addressBook').slimScroll({
                                height: '530px',
                                railVisible: true,
                                alwaysVisible: true
                            });
                        }
                        else if(widget.shippingAddressBook().length == 1){
                            $('.slimScrollBar,.slimScrollRail').remove();
                        }
                    }
           });

        }
        
      },

      removeSelectedCountryRegion: function() {
        storageApi.getInstance().removeItem("selectedCountryRegion");
      },

      initResourceDependents: function() {
        var widget = this;
        // Message to be displayed in the Message Panel if an error occurs
        widget.ErrorMsg = widget.translate('checkoutErrorMsg');

        widget.order().billingAddress.extend({
          propertyWatch: widget.order().billingAddress()
        });
        widget.order().shippingAddress.extend({
          propertyWatch: widget.order().shippingAddress()
        });
        widget.order().billingAddress(new Address('checkout-billing-address', widget.ErrorMsg, widget, widget.billingCountries(), widget.defaultBillingCountry()));
        $.Topic(pubsub.topicNames.BILLING_ADDRESS_POPULATED).publishWith([{message: "success"}]);
        widget.order().shippingAddress(new Address('checkout-shipping-address', widget.ErrorMsg, widget, widget.shippingCountriesPriceListGroup(), widget.defaultShippingCountry()));
        $.Topic(pubsub.topicNames.SHIPPING_ADDRESS_POPULATED).publishWith([{message: "success"}]);

        /**
         * @function
         * @name isValid
         * Determine whether or not the current widget object is valid
         * based on the validity of its component parts. This will not
         * cause error messages to be displayed for any observable values
         * that are unchanged and have never received focus on the
         * related form field(s).
         * @return boolean result of validity test
         */
        widget.isValid = ko.computed(function() {
          if (widget.order().isPaypalVerified()) {
            return widget.order().shippingAddress().isValid();
          } else {

            return (widget.order().billingAddress().isValid() && widget.order().shippingAddress().isValid());
          }
        });

        /**
         * @function
         * @name validateNow
         * Force all relevant member observables to perform their
         * validation now & display the errors (if any)
         */
        widget.validateNow = function() {

          // call order methods to generate correct
          // error messages, if required.
          widget.order().validateBillingAddress();
          widget.order().validateShippingAddress();

          return (widget.isValid());
        };

        /**
         * Callback function for use in widget stacks.
         * Triggers internal widget validation.
         * @return true if we think we are OK, false o/w.
         */
        widget.validate = function() {

          // Shipping address is valid and being used as the billing address so copy it.
          if (widget.order().shippingAddress().isValid() && widget.useAsBillAddress() === true) {
            widget.order().shippingAddress().copyTo(widget.order().billingAddress());
          }

          return widget.validateNow();
        };

        widget.showShippingAddressSelection = function () {
          $('#CC-addressBook-picker').modal('show');
        };

        widget.hideShippingAddressSelection = function () {
          $('#CC-addressBook-picker').modal('hide');
        };
        
        

        widget.selectShippingAddress = function (addr) {
            
            for(var i=0; i<widget.shippingAddressBook().length; i++ ){
                if(addr.county() == widget.shippingAddressBook()[i].county()){
                    widget.shippingAddressBook()[i].isDefaultAddress(true);
                }
                else{
                    widget.shippingAddressBook()[i].isDefaultAddress(false);
                }
            }
               
          widget.isUsingSavedAddress(true);  
          widget.order().shippingAddress().isDefaultAddress(true);
           widget.IsDefaultShipping(true);
           
          widget.order().shippingAddress().copyFrom(addr.toJSON(), widget.shippingCountriesPriceListGroup());
          widget.order().shippingAddress().county(addr.county());
         // widget.hideShippingAddressSelection();
          widget.checkIfSelectedShipCountryInBillCountries();
          
         
        };



        widget.useAsBillAddress.subscribe(function(newValue) {
          if (widget.useAsBillAddress() === true) {
            // Need to clear any validation errors specific to the
            // billing address fields, prior to resetting it.
            widget.order().shippingAddress().copyTo(widget.order().billingAddress());

          } else {
            widget.order().billingAddress().reset();
            widget.order().billingAddress().resetModified();

            if (widget.order().shippingAddress().isValid()) {
              // CC requires Phone Number in Billing Address
              // but ATG requires it in the Shipping Address
              widget.order().billingAddress().phoneNumber(widget.order().shippingAddress().phoneNumber());
            }
            
             widget.order().billingAddress().county('');
             widget.order().billingAddress().phoneNumber('');

            // Need to inform interested parties that any previous
            // billing address is no longer current
            $.Topic(pubsub.topicNames.CHECKOUT_BILLING_ADDRESS).publishWith(
              widget.order().billingAddress(), [{
                message: "success"
              }]);
          }
        });

        widget.order().shippingAddress().selectedCountry.subscribe(function(newValue) {
          widget.checkIfSelectedShipCountryInBillCountries();
          if (widget.useAsBillAddress() === true) {
            widget.order().billingAddress().selectedCountry(widget.order().shippingAddress().selectedCountry());
          }
        });

        widget.order().shippingAddress().address1.subscribe(function (hasChanged) {
            widget.shippingMethodCustomCalling(hasChanged);
        });
        
         widget.order().shippingAddress().state.subscribe(function (hasChanged) {
            widget.shippingMethodCustomCalling(hasChanged);
        });
        
         widget.order().shippingAddress().postalCode.subscribe(function (hasChanged) {
            widget.shippingMethodCustomCalling(hasChanged);
        });
        
        widget.notifyListenersOfShippingAddressUpdate = function () {
          if(widget.order().shippingAddress().isValid()) {
            if (widget.useAsBillAddress() === true) {
              // Need to clear any validation errors specific to the
              // billing address fields, prior to resetting it.
              widget.order().shippingAddress().copyTo(widget.order().billingAddress());
            } else {
              // CC requires Phone Number in Billing Address
              // but ATG requires it in the Shipping Address
              widget.order().billingAddress().phoneNumber(widget.order().shippingAddress().phoneNumber());
            }
            
            if (widget.cart().shippingAddress() == "" || widget.cart().shippingMethod() == "" ||
                  (widget.cart().isShippingAddressChanged(widget.order().shippingAddress().toJSON(), widget.cart().shippingAddress().toJSON())
                  && !widget.loadPersistedShipping())){
              widget.order().selectedShippingOption('');
              $.Topic(pubsub.topicNames.CHECKOUT_SHIPPING_ADDRESS_UPDATED).publish();
            } else {
              widget.loadPersistedShipping(false);
              var shippingAddressWithProductIDs = {};
              shippingAddressWithProductIDs[CCConstants.SHIPPING_ADDRESS_FOR_METHODS] = widget.order().shippingAddress();
              shippingAddressWithProductIDs[CCConstants.PRODUCT_IDS_FOR_SHIPPING] = widget.cart().getProductIdsForItemsInCart();
              widget.cart().shippingAddress(widget.cart().shippingAddress().toJSON());
              widget.cart().updateShippingAddress.bind(shippingAddressWithProductIDs)();
            }
            
            // Saving selected country and selected region to localStorage 
            var selectedCountryRegion = new Object();
            selectedCountryRegion.selectedCountry = widget.order().shippingAddress().selectedCountry();
            selectedCountryRegion.selectedState = widget.order().shippingAddress().selectedState();
            try {
              widget.checkPreviousAddressValidity(widget);
              storageApi.getInstance().setItem("selectedCountryRegion", JSON.stringify(selectedCountryRegion));
            } catch(pError) {
            }

          } else if( widget.order().shippingAddress().validateForShippingMethod()) {
            // Handle case where address is sufficiently completed to calculate shipping & tax
            // Ensure that required fields have at least blank values
            if (widget.order().shippingAddress().county() == undefined)		
                widget.order().shippingAddress().county('');
            if (widget.order().shippingAddress().firstName() == undefined)
              widget.order().shippingAddress().firstName('');
            if (widget.order().shippingAddress().lastName() == undefined)
              widget.order().shippingAddress().lastName('');
            if (widget.order().shippingAddress().address1() == undefined)
              widget.order().shippingAddress().address1('');
            if (widget.order().shippingAddress().city() == undefined)
              widget.order().shippingAddress().city('');
            if (widget.order().shippingAddress().phoneNumber() == undefined)
              widget.order().shippingAddress().phoneNumber('');

            if (widget.cart().shippingAddress() == "" || widget.cart().shippingMethod() == "" ||
                    widget.cart().isShippingAddressChanged(widget.order().shippingAddress().toJSON(), widget.cart().shippingAddress().toJSON())) {
              widget.order().selectedShippingOption('');
              $.Topic(pubsub.topicNames.CHECKOUT_SHIPPING_ADDRESS_UPDATED).publish();
            } else {
              var shippingAddressWithProductIDs = {};
              shippingAddressWithProductIDs[CCConstants.SHIPPING_ADDRESS_FOR_METHODS] = widget.order().shippingAddress();
              shippingAddressWithProductIDs[CCConstants.PRODUCT_IDS_FOR_SHIPPING] = widget.cart().getProductIdsForItemsInCart();
              widget.cart().shippingAddress(widget.cart().shippingAddress().toJSON());
              widget.cart().updateShippingAddress.bind(shippingAddressWithProductIDs)();
            }

            // Saving selected country and selected region to localStorage 
            var selectedCountryRegion = new Object();
            selectedCountryRegion.selectedCountry = widget.order().shippingAddress().selectedCountry();
            selectedCountryRegion.selectedState = widget.order().shippingAddress().selectedState();
            try {
              widget.checkPreviousAddressValidity(widget);
              storageApi.getInstance().setItem("selectedCountryRegion", JSON.stringify(selectedCountryRegion));
            } catch(pError) {
            }

          } else if ( !widget.order().shippingAddress().isValid()) {
            if (!widget.cart().shippingMethod() && widget.cart().shipping()) {
              widget.cart().shipping(0);
            }
            $.Topic(pubsub.topicNames.CHECKOUT_SHIPPING_ADDRESS_INVALID).publish();
          }
        };
        
        widget.notifyListenersOfShippingAddressPhoneNumberUpdate = function () {
        	if(widget.order().shippingAddress().phoneNumber.isValid()) {
        		widget.order().billingAddress().phoneNumber(widget.order().shippingAddress().phoneNumber());
            } 
        };
      },

      /**
       * Called before the widget appears every time.
       */
       resetForm: function(){
           //Resetting or clearing form
                        //console.log('form resetting');
                         //$('#checkoutAddressBook').reset();
                         $('#checkoutAddressBook').trigger("reset");
                         //Ends
       },
       
       
      shippingMethodCustomCalling :  function(hasChanged){
             var getWidget = this;
                 getWidget.koSelectedState(getWidget.order().shippingAddress().selectedState());
                    $.Topic('newSelectedState.memory').publish(getWidget.koSelectedState());
                    getWidget.sortingStages();
                    
                    //Disable city for AO,AE,AA
 
                    if((getWidget.koSelectedState() == "AA") || (getWidget.koSelectedState() == "AE") || (getWidget.koSelectedState() == "AP")){ 
                        if($('#checkoutAddressBook').is(':visible')){
                            
                            $('#checkoutAddressBook #txtCity3').attr("placeholder", "APO / FPO / DPO");
                             
                        }
                    }
                    else{
                        $('#checkoutAddressBook #txtCity3').attr("placeholder", "City");
                        
                        
                    }
          
          if (hasChanged && getWidget.order().shippingAddress().validateForShippingMethod()) {
                        /*var shippingAddressWithProductIDs = {};
                        shippingAddressWithProductIDs[CCConstants.SHIPPING_ADDRESS_FOR_METHODS] = widget.order().shippingAddress();
                        shippingAddressWithProductIDs[CCConstants.PRODUCT_IDS_FOR_SHIPPING] = widget.cart().getProductIdsForItemsInCart();
                        $.Topic(pubsub.topicNames.POPULATE_SHIPPING_METHODS).publishWith(
                            shippingAddressWithProductIDs, [{
                                message: "success"
                            }]);*/
                        if (hasChanged && getWidget.order().shippingAddress().isValid()) {

                            // Shipping address has changed and is valid and being used as the billing address so copy it.
                            if (getWidget.useAsBillAddress() === true) {
                                getWidget.order().shippingAddress().copyTo(getWidget.order().billingAddress());
                            }
                            $.Topic(pubsub.topicNames.CHECKOUT_SHIPPING_ADDRESS).publishWith(
                                getWidget.order().shippingAddress(), [{
                                    message: "success"
                                }]);

                        }

                        // widget.notifyListenersOfShippingAddressUpdate();
                    } else if (hasChanged && !getWidget.order().shippingAddress().isValid()) {
                        $.Topic(pubsub.topicNames.CHECKOUT_SHIPPING_ADDRESS_INVALID).publish();
                    }
        
      },
      beforeAppear: function (page) {
        var widget = this;
       $('body').on('focus','#txtAddress31', function() {
                    //console.log("adress field focused")
                
                          widget.initAutocomplete();
              
                     
                });

                $('body').on( 'focus', '#txtAddress1234',function() {
                    //console.log("adress billing field focused")
                    widget.initBillingAutocomplete();
                });
         
        if (widget.cart().shippingMethod()) {
          widget.loadPersistedShipping(true);
        } else {
          widget.loadPersistedShipping(false);
        }
        widget.checkPreviousAddressValidity(widget);
        
        var previousSelectedCountryRegion = null;
        try {
          previousSelectedCountryRegion = storageApi.getInstance().getItem("selectedCountryRegion");
          if (previousSelectedCountryRegion && typeof previousSelectedCountryRegion == 'string') {
            previousSelectedCountryRegion = JSON.parse(previousSelectedCountryRegion);
          }
        } catch(pError) {
        }
        if (previousSelectedCountryRegion && !widget.showPreviousAddressInvalidError() && (!widget.cart().shippingAddress() || !widget.cart().shippingAddress().validateForShippingMethod())) {
          widget.order().shippingAddress().selectedCountry(previousSelectedCountryRegion.selectedCountry);
          widget.order().shippingAddress().selectedState(previousSelectedCountryRegion.selectedState);
          widget.previousSelectedCountryValid(false);
        } else if (previousSelectedCountryRegion && widget.previousSelectedCountryValid() && widget.showPreviousAddressInvalidError()) {
          widget.order().shippingAddress().selectedCountry(previousSelectedCountryRegion.selectedCountry);
          notifier.sendError(widget.typeId(), CCi18n.t('ns.checkoutaddressbook:resources.invalidPreviousAddress'), true);
          widget.showPreviousAddressInvalidError(false);
          widget.previousSelectedCountryValid(false);
        }
        else if (widget.showPreviousAddressInvalidError()) {
          notifier.sendError(widget.typeId(), CCi18n.t('ns.checkoutaddressbook:resources.invalidPreviousAddress'), true);
          widget.showPreviousAddressInvalidError(false);
        }
        widget.removeSelectedCountryRegion();
        
        widget.billingAddressEnabled(widget.order().isPaypalVerified());
        widget.reloadAddressInfo();
        if (widget.order().isPaypalVerified()) {
          // On successful return from paypal site
          widget.createSpinner();
          // Fetches the data to populate the checkout widgets
          widget.order().getOrder();
        }
        widget.sortingStages();
          setTimeout(function(){
                   widget.getStateValueOnload();
               },300);
            },
            getStateValueOnload: function(){
        
                var widget = this;
                    var selectedState2 = $("#selectState3").val();
 
                    widget.koSelectedState(selectedState2);
                    $.Topic('newSelectedState').publish(widget.koSelectedState());
      },
            checkoutAddressBookFormRendered: function() {
                setTimeout(function(){
                    $.Topic('customerCheckoutAddressBookFormValidate.memory').publish('success');
                },50);
            },
            billingAddressBookFormRendered: function() {
                $.Topic('customerBillingAddressBookFormValidate.memory').publish('success');
            },
      
      sortingStages:function(){

                if($('#selectState3 option').length > 0){
                $("#selectState3 option[value='AA']").insertBefore("#selectState3 option[value='AL']");
                $("#selectState3 option[value='AE']").insertAfter("#selectState3 option[value='AA']");
                $("#selectState3 option[value='AP']").insertAfter("#selectState3 option[value='AE']");
            }
            if($('#selectState231 option').length > 0){
                    $("#selectState231 option[value='AA']").insertBefore("#selectState231 option[value='AL']");
                    $("#selectState231 option[value='AE']").insertAfter("#selectState231 option[value='AA']");
                    $("#selectState231 option[value='AP']").insertAfter("#selectState231 option[value='AE']");
                }

      },
    appendScript: function(filepath) {
            if ($('body script[src="' + filepath + '"]').length > 0)
                return;

            var ele = document.createElement('script');
            ele.setAttribute("type", "text/javascript");
            ele.setAttribute("src", filepath);
            $('body').append(ele);
        },

      // end initResourceDependents
      resourcesLoaded: function(widget) {
        widget.initResourceDependents();
      },

      /**
        Checkout Customer Details Widget.
        @private
        @name checkout-customer-details
        @property {observable String} checkoutGuest value for the guest checkout radio button
        @property {observable String} checkoutLogin value for the login radio button
        @property {observable String} checkoutOption currently selected checkout option
        @property {observable String} emailAddress Email address entered by user
        @property {observable String} password Either registered or desired user password
        @property {observable String} confirmPassword confirmation of desired password
        @property {observable Boolean} createAccount current value of create account checkbox
        @property {observable Address} billingAddress object representing the customer's
                                       billing address.
        @property {observable Address} shippingAddress object representing the customer's
                                       shipping address.
        @property {observable Boolean} useAsBillAddress current value of the checkbox
                                       indicating whether to use SHipping Addr as Billing Addr
      */
      
      
      
      
      onLoad: function(widget) {
          
           getWidget = widget;
                
              //   $('body').on( 'focus', '#txtPhoneNumber3',function() {  
              //     //$(this)[0].setSelectionRange(0, 0);
              //       $.Topic("addCheckoutAddressFormValid").publish("success");
              //       /*$('#txtPhoneNumber3').focus();
              //       $('#txtPhoneNumber3').blur();*/
              //   });
              //   $('body').on( 'focus', '#txtPhoneNumber231',function() {
              //    // $(this)[0].setSelectionRange(0, 0);
              //       $.Topic("checkoutAddBillingAddress").publish("success");
              //       /*$('#txtPhoneNumber231').focus();
              //       $('#txtPhoneNumber231').blur();*/
              //   });
                
              //   //PMS 202
              //   $('body').delegate('#txtPhoneNumber3', 'change', function(e) {
              //     if($('#txtPhoneNumber3').val() != ''){
              //         $('#txtPhoneNumber3').removeClass('error');
              //         $('#txtPhoneNumber3-error').css('display','none');
              //     }
              // });
              // $('body').delegate('#txtPhoneNumber231', 'change', function(e) {
              //     if($('#txtPhoneNumber231').val() != ''){
              //         $('#txtPhoneNumber231').removeClass('error');
              //         $('#txtPhoneNumber231-error').css('display','none');
              //     }
              // });
                


                //Ends




                $('body').delegate('#selectState3', 'change', function(e) {
                    widget.sortingStages();
                    var selectedState1 = $(this).val();
                    getWidget.koSelectedState(selectedState1);
                    $.Topic('newSelectedState').publish(getWidget.koSelectedState());  
                    
                });
                

                /* Code For Loading The Google Auto Address Populate Starts*/
                /*var googleJs = document.createElement('script');
                    googleJs.setAttribute('src', '//maps.googleapis.com/maps/api/js?key=AIzaSyCnpjmjDsN8uVULH2jj28KC3B51jPPoVHw&libraries=places');
                    
                    document.body.appendChild(googleJs);*/
                widget.appendScript('//maps.googleapis.com/maps/api/js?key=AIzaSyDvCQ6agetd61iFoh1TvmQfIdm4rVAo0dY&libraries=places');


                /* Code For Loading The Google Auto Address Populate Ends*/

                
                  
                 // shipping address starts 
                  //Business Address
                  $('body').on( 'click', '#business',function(){
                      $('.business-input').toggle();
                  })
                  
                  //Special Instructions
                  
                   $('body').on( 'click', '#specialInstructions',function(){
                      $('.instructions-input').toggle();
                  })
                  
                  // shipping address ends here 
                  
                  
                  
                  // billing addresses strats here 
                    $('body').on( 'click', '#billidngaddr-businessChkbx',function(){
                      $('.billidngaddrbusiness-input').toggle();
                  })
                  
                  //Special Instructions
                  
                   $('body').on( 'click', '#billing_specialInstructions',function(){
                      $('.billing_instructions-input').toggle();
                  })
                  
                  
                  // billing address ends here 
      
        // These are not configuration options
        widget.order().billingAddress.isData = true;
        widget.order().shippingAddress.isData = true;
        widget.useAsBillAddress.isData = true;

        // set form defaults

        widget.resetListener = function(obj) {
          widget.order().billingAddress().reset();
          widget.order().shippingAddress().reset();
          widget.shippingAddressBook([]);
        };

        $.Topic(pubsub.topicNames.ORDER_SUBMISSION_SUCCESS).subscribe(widget.resetListener);
        $.Topic(pubsub.topicNames.LOAD_ORDER_RESET_ADDRESS).subscribe(widget.resetListener);

        // Handle user logging in- reload address details whenever the user profile loads shipping info.
        $.Topic(pubsub.topicNames.USER_LOAD_SHIPPING).subscribe(function(obj) {
          if (navigation.getRelativePath().indexOf(widget.links().profile.route) == -1) {
            widget.reloadAddressInfo();
          }

          if (widget.user().loggedIn() && widget.user().updatedShippingAddress && (widget.cart().items().length > 0)) {
            var shippingAddress = new Address('user-default-shipping-address', widget.ErrorMsg, widget, widget.shippingCountriesPriceListGroup(), widget.defaultShippingCountry());
            shippingAddress.countriesList(widget.shippingCountriesPriceListGroup());
            shippingAddress.copyFrom(widget.user().updatedShippingAddress, widget.shippingCountriesPriceListGroup());
            shippingAddress.resetModified();
            if (shippingAddress.isValid()) {
              widget.order().shippingAddress().copyFrom(widget.user().updatedShippingAddress, widget.shippingCountriesPriceListGroup());
              widget.order().shippingAddress().resetModified();
              widget.notifyListenersOfShippingAddressPhoneNumberUpdate();
            }
          }
        });
        
        
        
        // Handle user logging out and taking their saved addresses with them.
        $.Topic(pubsub.topicNames.USER_LOGOUT_SUCCESSFUL).subscribe(function(obj) {
          widget.resetListener();
          widget.isUsingSavedAddress(false);
          widget.removeSelectedCountryRegion();
        });

        $.Topic(pubsub.topicNames.USER_LOGIN_SUCCESSFUL).subscribe(widget.removeSelectedCountryRegion);

        $.Topic(pubsub.topicNames.ORDER_SUBMISSION_SUCCESS).subscribe(widget.removeSelectedCountryRegion);

        widget.destroySpinner = function() {
          $(widget.shippingAddressIndicator).removeClass('loadingIndicator');
          spinner.destroyWithoutDelay(widget.shippingAddressIndicator);
        };

        widget.shippingAddressDuringPaypalCheckout = function(paypalShippingAddress) {
          var shippingAddress = new Address('user-paypal-shipping-address', widget.ErrorMsg, widget, widget.shippingCountriesPriceListGroup(), widget.defaultShippingCountry());
          if (paypalShippingAddress && (widget.cart().items().length > 0) && widget.order().isPaypalVerified()) {
            // Check if checkout address (without any shipping method) exists in local storage. If exists then ovewrite the PayPal's address with this address
            var checkoutAddressWithoutShippingMethod = storageApi.getInstance().getItem("checkoutAddressWithoutShippingMethod");
            if (checkoutAddressWithoutShippingMethod) {
              paypalShippingAddress = JSON.parse(checkoutAddressWithoutShippingMethod);
              storageApi.getInstance().removeItem("checkoutAddressWithoutShippingMethod");
            }
            // Save shipping address JS object to Address object.
            shippingAddress.copyFrom(paypalShippingAddress, widget.shippingCountriesPriceListGroup());
            shippingAddress.resetModified();
          } else if (widget.user().loggedIn() === true && widget.user().updatedShippingAddress && (widget.cart().items().length > 0)) {
            // Save shipping address JS object to Address object.
            shippingAddress.copyFrom(widget.user().updatedShippingAddress, widget.shippingCountriesPriceListGroup());
            shippingAddress.resetModified();
          }
          widget.order().shippingAddress().copyFrom(shippingAddress.toJSON(), widget.shippingCountriesPriceListGroup());
          widget.order().shippingAddress().county(shippingAddress.county());
          widget.cart().shippingAddress(widget.order().shippingAddress());
          widget.billingAddressEnabled(widget.order().isPaypalVerified());
          $.Topic(pubsub.topicNames.PAYPAL_SHIPPING_ADDRESS_ALTERED).publish();
          widget.destroySpinner();
        };
        
        widget.billingAddressDuringExternalCheckout = function(externalBillingAddress) {
          var billingAddress = new Address('user-billing-address', widget.ErrorMsg, widget, widget.billingCountries(), widget.defaultBillingCountry());
           if (externalBillingAddress && (widget.cart().items().length > 0)) {
            // Save billing address JS object to Address object.
          	widget.useAsBillAddress(false);
            widget.displayUseAsBillAddress(false);
            billingAddress.copyFrom(externalBillingAddress, widget.billingCountries());
            billingAddress.resetModified();
            widget.order().billingAddress().copyFrom(billingAddress.toJSON(), widget.billingCountries());
            widget.order().billingAddress().county('');
            //if billing country returned by paypal is not listed in the commerce's billing countries
            if(!billingAddress.isValid() && billingAddress.country() == '' && billingAddress.state() == ''){
            	widget.order().billingAddress().selectedCountry(externalBillingAddress.country);
            	widget.order().billingAddress().selectedState(externalBillingAddress.state);
            }
           }
          widget.destroySpinner();
        };
        $.Topic(pubsub.topicNames.PAYPAL_CHECKOUT_SHIPPING_ADDRESS).subscribe(widget.shippingAddressDuringPaypalCheckout.bind(this));
        $.Topic(pubsub.topicNames.EXTERNAL_CHECKOUT_BILLING_ADDRESS).subscribe(widget.billingAddressDuringExternalCheckout.bind(this));

        widget.shippingAddressDuringWebCheckout = function(webShippingAddress) {
          var shippingAddress = new Address('user-web-shipping-address', widget.ErrorMsg, widget, widget.shippingCountriesPriceListGroup(), widget.defaultShippingCountry());
          if (webShippingAddress && (widget.cart().items().length > 0)) {
            // Save shipping address JS object to Address object.
            shippingAddress.copyFrom(webShippingAddress, widget.shippingCountriesPriceListGroup());
            shippingAddress.resetModified();
          }
          widget.order().shippingAddress().copyFrom(shippingAddress.toJSON(), widget.shippingCountriesPriceListGroup());
          widget.addressSetAfterWebCheckout(true);
          widget.destroySpinner();
        };

        $.Topic(pubsub.topicNames.WEB_CHECKOUT_SHIPPING_ADDRESS).subscribe(widget.shippingAddressDuringWebCheckout.bind(this));
        
        widget.shippingAddressDuringLoadOrder = function(loadOrderShippingAddress) {
          var shippingAddress = new Address('loaded-order-shipping-address', widget.ErrorMsg, widget, widget.shippingCountriesPriceListGroup(), widget.defaultShippingCountry());
          if (loadOrderShippingAddress && (widget.cart().items().length > 0)) {
            // Save shipping address JS object to Address object.
            shippingAddress.copyFrom(loadOrderShippingAddress, widget.shippingCountriesPriceListGroup());
            shippingAddress.resetModified();
          }
          widget.order().shippingAddress().copyFrom(shippingAddress.toJSON(), widget.shippingCountriesPriceListGroup());
          widget.order().shippingAddress().county(shippingAddress.county());
          widget.addressSetAfterOrderLoad(true);
          widget.destroySpinner();
        };
        
        $.Topic(pubsub.topicNames.LOADED_ORDER_SHIPPING_ADDRESS).subscribe(widget.shippingAddressDuringLoadOrder.bind(this));
        

        $.Topic(pubsub.topicNames.USER_SESSION_EXPIRED).subscribe(function() {
          widget.isUsingSavedAddress(false);
        });

        $.Topic(pubsub.topicNames.GET_INITIAL_ORDER_FAIL).subscribe(function() {
        	widget.billingAddressEnabled(widget.order().isPaypalVerified());
            widget.destroySpinner();
            widget.checkIfSelectedShipCountryInBillCountries();
        });

        widget.createSpinner = function() {
          $(widget.shippingAddressIndicator).css('position','relative');
          $(widget.shippingAddressIndicator).addClass('loadingIndicator');
          spinner.create(widget.shippingAddressIndicatorOptions);
        };

        widget.handleAddNewShippingAddress = function () {
          widget.order().shippingAddress().county('');
          //console.log("inside handleNewShipping")
          widget.order().shippingAddress().reset();
          widget.order().shippingAddress().resetModified();
          widget.isUsingSavedAddress(false);
          $('#CC-checkoutAddressBook-sfirstname').focus();
          widget.checkIfSelectedShipCountryInBillCountries();
          $.Topic(pubsub.topicNames.ADD_NEW_CHECKOUT_SHIPPING_ADDRESS).publish();
           $.Topic("addCheckoutAddressFormValid").publish("success");
        };

        widget.checkIfSelectedShipCountryInBillCountries = function() {
          //If the selected shipping country is not in the billing country list, hide the checkbox,
          //and show the billing address. If the selected country is in the billing country list,
          //then, show the checkbox, and hide the billing address
          if (widget.billingCountries()) {
            var selectedShipCountryInBillCountries = false;
            for (var i=0; i<widget.billingCountries().length; i++) {
              if (widget.order().shippingAddress().selectedCountry() === widget.billingCountries()[i].countryCode) {
                selectedShipCountryInBillCountries = true;
                break;
              }
            }
            if (!selectedShipCountryInBillCountries || widget.order().isPaypalVerified()) {
              widget.useAsBillAddress(false);
              widget.displayUseAsBillAddress(false);
            } else {
                if (widget.order().billingAddress().isEmpty() || widget.order().billingAddress().compare(widget.order().shippingAddress()) )
              	  widget.useAsBillAddress(true);
                else
              	  widget.useAsBillAddress(false);
              widget.displayUseAsBillAddress(true);
            }
          } else {
            widget.useAsBillAddress(true);
            widget.displayUseAsBillAddress(true);
          }
        };
        widget.displayInvalidBillingAddressText = function() {
        	return !widget.billingAddressEnabled() && !widget.displayUseAsBillAddress()
            && ko.isObservable(widget.order) && ko.isObservable(widget.order().shippingAddress) && widget.order().shippingAddress()
            && ko.unwrap(widget.order().shippingAddress().country) !== '';
        };
        getWidget.resetForm();
      },
  
      getBillingStateOnChange : function(data,event){


                    getWidget.koBillingSelectedState(event.target.value);
                    //console.log('selected State',getWidget.koSelectedState());
                    //storageApi.getInstance().setItem('selectedState',getWidget.koSelectedState());
                    
                    getWidget.sortingStages();
                    
                    //Disable city for AO,AE,AA
                    
                    
                    
                    if((getWidget.koBillingSelectedState() == "AA") || (getWidget.koBillingSelectedState() == "AE") || (getWidget.koBillingSelectedState() == "AP")){ 
                       if($('#billingAddress').is(':visible')){
                             
                        $('#billingAddress #txtCity231').attr("placeholder", "APO / FPO / DPO");
                        }
                    }
                    else{
                       
                    $('#billingAddress #txtCity231').attr("placeholder", "City");
                        
                    }
      },
      checkPreviousAddressValidity: function(widget) {
        var previousSelectedCountryRegion = null;
        try {
          previousSelectedCountryRegion = storageApi.getInstance().getItem("selectedCountryRegion");
          if (previousSelectedCountryRegion && typeof previousSelectedCountryRegion == 'string') {
            previousSelectedCountryRegion = JSON.parse(previousSelectedCountryRegion);
          }
        }
        catch(pError) {
        }
        if (previousSelectedCountryRegion) {
          var shippingCountries = widget.shippingCountriesPriceListGroup();
          for (var k = 0; k < shippingCountries.length; k++) {
            if (previousSelectedCountryRegion.selectedCountry === shippingCountries[k].countryCode) {
              widget.previousSelectedCountryValid(true);
              var regions = shippingCountries[k].regions;
              // Its valid for a country to 0 regions.
              if (regions.length === 0 && previousSelectedCountryRegion.selectedState === "") {
                break;
              }
              for (var j = 0; j < regions.length; j++) {
                if (previousSelectedCountryRegion.selectedState === regions[j].abbreviation) {
                  break;
                }
              }
              if (j < regions.length) {
                break;
              }
            }
          }
          if (k === shippingCountries.length) {
            //show error message that previously entered shipping address is now not valid and clear local storage
            notifier.clearError(widget.typeId());
            widget.showPreviousAddressInvalidError(true);
          } else {
            widget.showPreviousAddressInvalidError(false);
          }
        }
      },
      fillInAddress: function() {
                //alert("shipping address");
                // Get the place details from the autocomplete object.
                var place = autocomplete.getPlace();
                //console.log('Place', place);
                // Get each component of the address from the place details
                // and fill the corresponding field on the form.
                for (var i = 0; i < place.address_components.length; i++) {
                    var addressType = place.address_components[i].types[0];
                    //console.log('AddressType', addressType);
                    if (componentForm[addressType]) {
                        var value = place.address_components[i][componentForm[addressType]];
                        if (value == 'United States') {
                            value = "US";
                        }
                        if (addressType == 'street_number') {
                            i++;
                            var addressTypeRoute = 'route';
                            value = value + " " + place.address_components[i][componentForm[addressTypeRoute]];
                        }
                        $("#" + componentMapping[addressType]).val(value).change();
                    }
                    if (addressType == 'postal_code_suffix') {
                       // var temp = $("#txtZip3").val() + "-" + place.address_components[i].long_name;
                         var temp = $("#txtZip3").val();
                        $("#txtZip3").val(temp).change();
                    }
                }
                var shippingAddressWithProductIDs = {};
                shippingAddressWithProductIDs[CCConstants.SHIPPING_ADDRESS_FOR_METHODS] = getWidget.order().shippingAddress();
                shippingAddressWithProductIDs[CCConstants.PRODUCT_IDS_FOR_SHIPPING] = getWidget.cart().getProductIdsForItemsInCart();
                $.Topic(pubsub.topicNames.POPULATE_SHIPPING_METHODS).publishWith(
                    shippingAddressWithProductIDs, [{
                        message: "success"
                }]);
            },
      fillInAddressBilling: function() {
        //alert("billing address");
        //console.log('Billing');
        var place = autocomplete.getPlace();
        //console.log('Place', place);

        // Get each component of the address from the place details
        // and fill the corresponding field on the form.
        for (var i = 0; i < place.address_components.length; i++) {
            var addressType = place.address_components[i].types[0];
            //console.log('AddressType', addressType);
            if (componentForm[addressType]) {
                var value = place.address_components[i][componentForm[addressType]];
                if (value == 'United States') {
                    value = "US";
                }
                if (addressType == 'street_number') {
                    i++;
                    var addressTypeRoute = 'route';
                    value = value + " " + place.address_components[i][componentForm[addressTypeRoute]];
                }
                $("#" + componentMappingBilling[addressType]).val(value).change();
            }
            if (addressType == 'postal_code_suffix') {
               // var temp = $("#txtZip231").val() + "-" + place.address_components[i].long_name;
                 var temp = $("#txtZip231").val();
                $("#txtZip231").val(temp).change();
            }
        }

    },
      initAutocomplete: function() {
        // Create the autocomplete object, restricting the search to geographical
        // location types.  
        var options = {
            types: ['geocode'],
            componentRestrictions: {
                country: "us"
            }
        };
        //autocomplete = new google.maps.places.Autocomplete((document.getElementById('txtAddress31')), options);
        //console.log('AUTOComplete Init', autocomplete);
        //console.log('place before', autocomplete.getPlace());
        // When the user selects an address from the dropdown, populate the address
        // fields in the form.
        //autocomplete.addListener('place_changed', getWidget.fillInAddress);
        /*if($("#txtAddress31").is(":focus")) {
        autocomplete = new google.maps.places.Autocomplete((document.getElementById('txtAddress31')), options);
        
        // When the user selects an address from the dropdown, populate the address
        // fields in the form.
        autocomplete.addListener('place_changed', getWidget.fillInAddress);
        } else if($("#txtAddress1234").is(":focus")) {
            autocomplete = new google.maps.places.Autocomplete((document.getElementById('txtAddress1234')), options);
        
            // When the user selects an address from the dropdown, populate the address
            // fields in the form.
            autocomplete.addListener('place_changed', getWidget.fillInAddressBilling);
        }*/
    },
      initBillingAutocomplete: function() {
        // Create the autocomplete object, restricting the search to geographical
        // location types.  
        var options = {
            types: ['geocode'],
            componentRestrictions: {
                country: "us"
            }
        };
        //autocomplete = new google.maps.places.Autocomplete((document.getElementById('txtAddress1234')), options);
        //console.log('AUTOComplete Init', autocomplete);
        //console.log('place before', autocomplete.getPlace());
        // When the user selects an address from the dropdown, populate the address
        // fields in the form.
        //autocomplete.addListener('place_changed', getWidget.fillInAddressBilling);
    }
      
    };
  }
);
