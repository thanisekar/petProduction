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
  ['knockout', 'pubsub', 'ccConstants', 'koValidate', 'ccKoValidateRules', 'CCi18n'], 

  //-------------------------------------------------------------------
  // MODULE DEFINITION
  //-------------------------------------------------------------------
  function(ko, pubsub, CCConstants, koValidate, rules, CCi18n) {

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
      
      /**
       * This function handles functionality of applying a coupon
       */
      handleApplyCoupon: function() {
          var widget = this;
         couponSuccess = false;
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
      }
    };
  }
);
