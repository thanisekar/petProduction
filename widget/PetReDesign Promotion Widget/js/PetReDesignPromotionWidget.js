/**
 * @fileoverview Promotion Widget. 
 * 
 * @author 
 * 
 * This widget is useful for handling promotion/coupon related functionality.
 *  
 */
define(
  
  //-------------------------------------------------------------------
  // DEPENDENCIES
  //-------------------------------------------------------------------
    ['knockout', 'pubsub', 'notifier', 'ccConstants', 'koValidate', 'ccKoValidateRules', 'CCi18n'],

  //-------------------------------------------------------------------
  // MODULE DEFINITION
  //-------------------------------------------------------------------
    function(ko, pubsub, notifier, CCConstants, koValidate, rules, CCi18n) {

    "use strict";
    var couponSuccess = false;
     var couponSMsgIndic = false;
     window.removeCoup = function(){
         couponSMsgIndic = false;
        $("#successMsg").remove();
        $("#removeMsg").remove();
        $("#successMsg1").remove();
        $(".checkout-stepper .promoMessage").prepend('<div class="successMessage" id="successMsg">Promo Code Successfully Removed From Order</div>');
    }
    return {
      promoCode: ko.observable(),
      isApplyCodeClicked: ko.observable(false),


      /**
       * beforeAppear function
       */
      beforeAppear: function (page) {
        var widget = this;
         $("#successMsg").remove();
        $("#removeMsg").remove();
        widget.promoCode('');

        widget.promoCode.isModified(false);
        widget.cart().couponErrorMessage('');
        
        
      },
      
      /**
       * onLoad function
       */
      onLoad: function(widget) {
          $("#successMsg").remove();
          $("#removeMsg").remove();
          $(".successMessage").remove();
        // Clear the coupon input field when successfully applied.
        
              //Address 1 employee validation check
               
               $('body').delegate('#txtAddress31', 'focusout', function() {
                   widget.removeEmployeeCoupon();
               });
               
               
               //Remove Employe coupon if another address
                $.Topic(pubsub.topicNames.SHIPPING_METHODS_LOADED).subscribe(function() {
                     widget.removeEmployeeCoupon();
                });
                
                
                //Employee Check after coupon removed
                
                $.Topic(pubsub.topicNames.COUPON_DELETE_SUCCESSFUL).subscribe(function() {
                    $.Topic('employeeCheck.memory').publish(true);
                });
        // Clears coupon input field and error message after logout
        $.Topic(pubsub.topicNames.USER_LOGOUT_SUBMIT).subscribe(function() {
          widget.promoCode('');
          widget.cart().couponErrorMessage('');
        });
        
        //PRomo Code error validation
        
        widget.promoCode.extend({
        required: {
          params: true,
          message: widget.translate('promoCodeRequired')
        }
      });    
       widget.validationModel = ko.validatedObservable({
        promoCode: widget.promoCode
      });
      
            },
            
            
            
            removeEmployeeCoupon: function(){
                var widget = this;
                    var couponCheck = widget.cart().coupons().length;
                    if(couponCheck > 0){
                    for (var i = 0; i < couponCheck; i++) {
                        if (widget.cart().coupons()[i].code() == "PETMATE") {
                            if (widget.employeeCheck(widget.cart().coupons()[i].code())) {
                                 $.Topic('employeeCheck.memory').publish(true);
                               // $('#appliedCoupon').click();
                                    widget.cart().removeCouponFromCart(widget.cart().coupons()[i]);
                                    $( "#employee-error" ).show();
                            }

                        }
                    }
                    }
                    //widget.removeCouponFromCart(data);
      },
      
      /**
       * This function handles functionality of applying a coupon
       */
      handleApplyCoupon: function() {
          var widget = this;
          couponSuccess = false;
          //Temporary Until Black Friday
          setTimeout(function(){
            //console.log(widget.cart().coupons(),'widget.cart().coupons()');
            var saleItems = [];
            var cartData =  widget.cart().allItems();
            //console.log(cartData,'cartData');
            if(cartData && cartData.length > 0){
                for (var i = 0; i < cartData.length; i++) {
                  //console.log(cartData[i].productData(),'cartData[i].discountInfo.length');
                  
                  if(cartData[i].productData().salePrice){
                     saleItems.push(cartData[i].productData().displayName);
                  }
              }
            }
            var cartCoupons = widget.cart().coupons();
            if (cartCoupons && cartCoupons.length > 0) {
              var couponCount = cartCoupons.length;
              //console.log(saleItems,'saleItems');
              for (var i = 0; i < couponCount; i++) {
                  console.log(cartCoupons[i].code(),'cartCoupons[i].code()');
                  console.log(cartCoupons[i],'cartCoupons[i].status');
                  if((cartCoupons[i].code() == "DEALS2021") && (cartCoupons[i].status() == "unclaimed") && (saleItems.length > 0)){
                      notifier.sendError(widget.WIDGET_ID, "Promocode DEALS2021 not applicable for sale items", true);
                  }else if((cartCoupons[i].code() == "DEALS2021") && (cartCoupons[i].status() == "claimed") && (saleItems.length > 0)){
                      notifier.sendError(widget.WIDGET_ID, "Promocode DEALS2021 not applicable for sale items "+ saleItems, true);
                  }else if((cartCoupons[i].code() == "DEALS2021") && (cartCoupons[i].status() == "unclaimed")){
                       notifier.sendError(widget.WIDGET_ID, "Minimum threshold not met", true);
                  }
              }
          }
        },500)
        
        //Ends
         
                if (widget.employeeCheck(widget.promoCode())) {
                    return;
                }
                $("#successMsg").remove();
                $("#removeMsg").remove();
                $('#successMsg').hide();
                $('#CC-promotionDetails-promoCodeApply-error-xs').text("");
                $('#CC-promotionDetails-promoCodeApply-error').text("");
               
           if(widget.cart().couponErrorMessage()) {
                 widget.cart().couponErrorMessage('');
            } 
            if(widget.promoCode() == '') {
               
                  widget.validationModel.errors.showAllMessages();
                  $("#successMsg").remove();
                  $("#removeMsg").remove();
                  $(".successMessage").remove();
                  $(".checkout-stepper .promoMessage").prepend('<div class="successMessage" id="removeMsg" style="color: #f15d22; padding: 10px 0; text-align: left;">Invalid promo code</div>');
                  $('#CC-promotionDetails-promoCodeApply-error-xs').text("Please enter a valid promo code");
            } 
               
        	  
        if (widget.promoCode() && widget.promoCode().trim() !== '') {
                 // check if the coupon has already been applied.
          if (widget.couponAlreadyApplied(widget.promoCode().trim())) {
            widget.cart().couponErrorMessage(widget.translate(CCConstants.COUPON_APPLY_ERROR_DUPLICATE_CODE));
                    $("#successMsg").remove();
                    $(".successMessage").remove();
                    $("#successMsg1").remove();
                    $("#removeMsg").remove();
                    $(".checkout-stepper .promoMessage").prepend('<div class="successMessage" id="removeMsg" style="color: #f15d22; padding: 10px 0; text-align: left;">Your order already contains this promotion</div>');
                    $('#CC-promotionDetails-promoCodeApply-error').text("Code Expired");
                    $("#orderSummary").css("margin-top", "20px");
                    widget.promoCode('');
          } else {
            widget.cart().addCoupon(widget.promoCode().trim());
                            $("#successMsg").remove();
                             $("#successMsg1").remove();
                            $("#removeMsg").remove();
                            couponSMsgIndic = true;
                            widget.promoCode('');
                      
          }
          
          $.Topic(pubsub.topicNames.COUPON_ADD_CLEAR_INPUT).subscribe(function() {
          var errorMessage = widget.cart().couponErrorMessage();
          $('#CC-promotionDetails-promoCodeApply-error-xs').text(" ");
          if(errorMessage == 'Code not found.' ) {
                    $("#successMsg").remove();
                    $("#removeMsg").remove();
                    $(".successMessage").remove();
                    if(!$("#removeMsg").is(':visible')) {
                        $(".checkout-stepper .promoMessage").prepend('<div class="successMessage" id="removeMsg" style="color: #f15d22; padding: 10px 0; text-align: left;">Invalid promo code</div>');
                        $('#CC-promotionDetails-promoCodeApply-error-xs').text("Invalid promo code");
                    }
                    widget.promoCode('');
                    return couponSuccess = false;
              }
              else if(errorMessage == 'Code expired.' ) {
                  $('#CC-promotionDetails-promoCodeApply-error-xs').text(" ");
                    $("#successMsg").remove();
                    $("#removeMsg").remove();
                    $(".successMessage").remove();
                    if(!$("#removeMsg").is(':visible')) {
                        $(".checkout-stepper .promoMessage").prepend('<div class="successMessage" id="removeMsg" style="color: #f15d22; padding: 10px 0; text-align: left;">Promo code expired</div>');
                        $('#CC-promotionDetails-promoCodeApply-error-xs').text("Promo code expired");
                    }
                    widget.promoCode('');
                    return couponSuccess = false;
              }else {
                   
                  if(couponSMsgIndic) {
                      
                     $("#successMsg").remove();
                     $("#removeMsg").remove();
                     $(".successMessage").remove();
                     if(!$("#successMsg").is(':visible')) {
                      $(".checkout-stepper .promoMessage").prepend('<div class="successMessage" id="successMsg">Promo Code Successfully Applied To Order</div>');
                      }
                  }
                  //return couponSuccess = true;
              }
              
          // do not clear the input promotion code when there is some coupon error.
                  if (!errorMessage || errorMessage == '') {
                    widget.promoCode('');
                  }
          });
          // disable Apply Code button for a specific time when clicked.
          widget.handleEnableApplyCodeButton();
        }
      },

      /**
       * This function returns true if the couponCode is already applied.
       * 
       */
      couponAlreadyApplied: function(couponCode) {
        var widget = this;
        var alreadyApplied = false;
        if (widget.cart().coupons() && widget.cart().coupons().length > 0) {
          var couponCount = widget.cart().coupons().length;
          for (var i = 0; i < couponCount; i++) {
            if (widget.cart().coupons()[i].code() == couponCode) {
              alreadyApplied = true;
             // //console.log("yyyyyyyyyyyyyy");
              break;
            }
          }
        }
           //console.log("zzzzzzzzzzzzzz");
        return alreadyApplied;
      },
      
      /**
       * This function is used to handle disable Apply Code button for 
       *     a specific time when it is clicked and enable again.
       */
      handleEnableApplyCodeButton: function() {
        var widget = this;
        widget.isApplyCodeClicked(true);
        setTimeout(enableApplyCodeButton, 2000);          
        function enableApplyCodeButton() {
          widget.isApplyCodeClicked(false);
        };
            },
            employeeCheck: function(promoCode) {
                var widget = this;
                if (promoCode && promoCode == "PETMATE") {
                    if (widget.cart().shippingAddress().address1) {
                        var petAddress1 = ['RANDOL MILL', 'HOUSTON SCHOOL', 'WEST STEPHENS', '800', 'W STEPHENS', 'JUSTICE LANE', 'JUSTICE LN', 'TECH DR', 'TECH DRIVE'];
                     var petCity = ['ARLINGTON','MANSFIELD','SWEETWATER','LANCASTER'];
                        //var shippingAddress = widget.cart().shippingAddress().address1.toUpperCase();
                        //var shippingCity = widget.cart().shippingAddress().city.toUpperCase();
                        var shippingAddress = $('#txtAddress31').val().toUpperCase();
                        var shippingCity = $('#txtCity3').val().toUpperCase();
                       var addressResult = false;
                       var cityResult = false;
                      for(var i=0; i < petAddress1.length; i++){
                          addressResult = shippingAddress.includes(petAddress1[i]);
                          if(addressResult){
                              break;
                          }
                      }
                      for(var i=0; i < petCity.length; i++){
                          cityResult = shippingCity.includes(petCity[i]);
                          if(cityResult){
                              break;
                          }
                      }
                        if (!addressResult || !cityResult) {
                            notifier.sendError(widget.WIDGET_ID, "Promo Code PETMATE Valid only on order shipping to a Petmate Facility. Enter a Petmate facility address or remove promo code", true);
                             $.Topic('employeeCheck.memory').publish(true);
                              $( "#employee-error" ).show();
                            return true;
                        } else {
                        notifier.clearError(widget.WIDGET_ID);
                         $.Topic('employeeCheck.memory').publish(false);
                          $( "#employee-error" ).hide();
                        return false;
                       }
                    }
                }else{
                 $.Topic('employeeCheck.memory').publish(true);
                 $( "#employee-error" ).hide();
                return false;
                }

            }
    };
  }
);
