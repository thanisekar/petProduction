/**
 * @fileoverview Shopping Cart Summary Widget.
 * 
 */
define(
  //-------------------------------------------------------------------
  // DEPENDENCIES
  //-------------------------------------------------------------------
  ['knockout', 'pubsub', 'viewModels/giftProductListingViewModel', 'ccConstants', 'notifier',
      'CCi18n', 'jquery', 'viewModels/integrationViewModel', 'pageLayout/site'],
    
  //-------------------------------------------------------------------
  // MODULE DEFINITION
  //-------------------------------------------------------------------
  function (ko, pubsub, giftProductListingViewModel, CCConstants, notifier, CCi18n, $, integrationViewModel, SiteViewModel) {
   
    "use strict";
    var getWidget = '';
    return {
     // This will hold the data displayed in gift selection modal
      currentGiftChoice: ko.observable(),
      selectedGiftSku: ko.observable(),
      cartItem: {},
     cartItemsUpdate:          ko.observable(),
      koProduct_listArray: ko.observableArray([]),
      // Sends a message to the cart to remove this product
      handleRemoveFromCart: function() {
        $.Topic(pubsub.topicNames.CART_REMOVE).publishWith(
          this.productData(),[{"message":"success", "commerceItemId": this.commerceItemId}]);
      },

      focusOnField : function(data) {
        var field = data.source;
        field.focus();
      },

      
      updateQuantity: function(e, n, r) {
          
            if ("click" === n.type || "keypress" === n.type && n.keyCode === 13) {
                
                if (e.updatableQuantity && e.updatableQuantity.isValid()) {
                    $.Topic(pubsub.topicNames.CART_UPDATE_QUANTITY).publishWith(e.productData(), [{
                        message: "success"
                    }]);
                    var s = $("#" + r);
                    s.focus(), s.fadeOut()
                }
            } else this.quantityFocus(e, n);
            return !0
        },
        quantityFocus: function(e, t) {},
	//Upgrade Changes
	getGiftChoices: function() {
        giftProductListingViewModel.prototype.getGiftProductChoices(this);
      },

      changeGiftChoice: function(widget) {
        widget.cartItem = {
          "catRefId": this.catRefId,
          "productId": this.productId,
          "quantity": this.quantity()
        };

        // This data is needed to add giftWithPurchaseSelections for the new item which is selected.
        var giftData = {};
        giftData.giftWithPurchaseIdentifier = this.giftData[0].giftWithPurchaseIdentifier;
        giftData.promotionId = this.giftData[0].promotionId;
        giftData.giftWithPurchaseQuantity = this.giftData[0].giftWithPurchaseQuantity;
        widget.currentGiftChoice(giftData);

        // While changing the gift, add giftWithPurchaseSelections info to the product being modified
        widget.addGiftWithPurchaseSelectionsToItem(this);

        var getGiftChoiceData = {};
        getGiftChoiceData.giftWithPurchaseType = this.giftData[0].giftWithPurchaseType;
        getGiftChoiceData.giftWithPurchaseDetail = this.giftData[0].giftWithPurchaseDetail;
        getGiftChoiceData.id = null;
        giftProductListingViewModel.prototype.getGiftProductChoices(getGiftChoiceData);
      },

      // Adds giftWithPurchaseSelections information to the cart item
      addGiftWithPurchaseSelectionsToItem: function(item) {
        var giftWithPurchaseSelections = [];
        var data = {};
        data.giftWithPurchaseIdentifier = item.giftData[0].giftWithPurchaseIdentifier;
        data.promotionId = item.giftData[0].promotionId;
        data.giftWithPurchaseQuantity = item.giftData[0].giftWithPurchaseQuantity;
        data.catRefId = item.catRefId;
        data.productId = item.productId;
        giftWithPurchaseSelections.push(data);
        item.giftWithPurchaseSelections = giftWithPurchaseSelections;
      },

      handleGiftAddToCart: function () {
        // 'this' is widget view model

        var variantOptions = this.currentGiftChoice().giftChoice.variantOptionsArray;
        //get the selected options, if all the options are selected.
        var selectedOptions = this.getSelectedSkuOptions(variantOptions);
        var selectedOptionsObj = { 'selectedOptions': selectedOptions };
        var newProduct = $.extend(true, {}, this.currentGiftChoice().giftChoice.product, selectedOptionsObj);
        if (variantOptions.length > 0) {
          //assign only the selected sku as child skus
          newProduct.childSKUs = [this.selectedGiftSku()];
        }

        //If the gift being added is already present in the cart, do not trigger pricing
        if (this.cartItem && this.cartItem.catRefId && this.cartItem.productId) {
          var item = this.cart().getCartItem(this.cartItem.productId, this.cartItem.catRefId);
          if (item != null && item.giftWithPurchaseCommerceItemMarkers.length && newProduct.id == this.cartItem.productId
              && newProduct.childSKUs[0].repositoryId == this.cartItem.catRefId) {
            this.cartItem = {};
            this.hideGiftSelectionModal();
            return;
          }
        }

        // add gwp selections in the request
        newProduct.giftProductData = {
          "giftWithPurchaseIdentifier": this.currentGiftChoice().giftWithPurchaseIdentifier,
          "promotionId": this.currentGiftChoice().promotionId,
          "giftWithPurchaseQuantity" : (this.currentGiftChoice().giftWithPurchaseQuantityAvailableForSelection ?
              this.currentGiftChoice().giftWithPurchaseQuantityAvailableForSelection : this.currentGiftChoice().giftWithPurchaseQuantity)
        };

        newProduct.orderQuantity = newProduct.giftProductData.giftWithPurchaseQuantity;

        // Triggers price call
        this.cart().addItem(newProduct);
        this.cartItem = {};
        this.hideGiftSelectionModal();
      },

      // hide gift selection modal
      hideGiftSelectionModal: function() {
        $('#CC-giftSelectionpane').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
      },

      // this method  returns a map of all the options selected by the user for the product
      getSelectedSkuOptions : function(variantOptions) {
        var selectedOptions = [];
        for (var i = 0; i < variantOptions.length; i++) {
          if (!variantOptions[i].disable()) {
            selectedOptions.push({'optionName': variantOptions[i].optionDisplayName, 'optionValue': variantOptions[i].selectedOption().key, 'optionId': variantOptions[i].actualOptionId, 'optionValueId': variantOptions[i].selectedOption().value});
          }
        }
        return selectedOptions;
      },

      // Checks if all variant values are selected
      allOptionsSelected: function () {
          var allOptionsSelected = true;
          if (!this.currentGiftChoice() || !this.currentGiftChoice().giftChoice) {
            allOptionsSelected = false;
          } else if (this.currentGiftChoice().giftChoice.variantOptionsArray.length > 0) {
            var variantOptions = this.currentGiftChoice().giftChoice.variantOptionsArray;
            for (var i = 0; i < variantOptions.length; i++) {
              if (! variantOptions[i].selectedOption.isValid() && !variantOptions[i].disable()) {
                allOptionsSelected = false;
                this.selectedGiftSku(null);
                break;
              }
            }
            
            if (allOptionsSelected) {
              // get the selected sku based on the options selected by the user
              var selectedSKUObj = this.getSelectedSku(variantOptions);
              if (selectedSKUObj === null) {
                return false;
              }
              this.selectedGiftSku(selectedSKUObj);
            }
            this.refreshSkuStockStatus(this.selectedGiftSku());
          }
          
          return allOptionsSelected;
        },

        //refreshes the stockstatus based on the variant options selected
        refreshSkuStockStatus : function(selectedSKUObj) {
          var key;
          var product = this.currentGiftChoice().giftChoice;
          if (selectedSKUObj === null) {
            key = 'stockStatus';
          } else {
            key = selectedSKUObj.repositoryId;
          }
          var stockStatusMap = product.stockStatus();
          for (var i in stockStatusMap) {
            if (i == key) {
              if (stockStatusMap[key] == CCConstants.IN_STOCK) {
                product.inStock(true); 
              } else {
                product.inStock(false);
              }
              return;
            }
          }
        },

        //this method returns the selected sku in the product, Based on the options selected
        getSelectedSku : function(variantOptions) {
          var childSkus = this.currentGiftChoice().giftChoice.product.childSKUs;
          var selectedSKUObj = {};
          for (var i = 0; i < childSkus.length; i++) {
            selectedSKUObj =  childSkus[i];
            for (var j = 0; j < variantOptions.length; j++) {
              if ( !variantOptions[j].disable() && childSkus[i].dynamicPropertyMapLong[variantOptions[j].optionId] != variantOptions[j].selectedOption().value ) {
                selectedSKUObj = null;
                break;
              }
            }
            if (selectedSKUObj !== null) {
              return selectedSKUObj;
            }
          }
          return null;
        },
        
        setExpandedFlag : function(element, data) {
          if (data.expanded()) {
            data.expanded(false);
          } else {
            data.expanded(true);
          }
        },
	  
	  checkProductWeight: function(catRefId, qty) {
	        //console.log("qty...............", qty);
	        var widget = getWidget;
	        var getItems = widget.cart().allItems();
            var totalProductWeight;
            var finalTotalProductWeight = 0;
            $.each(getItems, function(k, v) {
                var quantity = v.quantity;
                if(v.catRefId === catRefId) {
                    quantity = qty;
                }
                if (v.productData().childSKUs[0].petWeight !== '' && v.productData().childSKUs[0].petWeight !== undefined && v.productData().childSKUs[0].petWeight !== null) {
                    //console.log('Has petweight');
                    var petWeight = v.productData().childSKUs[0].petWeight.split(" ")[0];
                    totalProductWeight = quantity() * petWeight;
                    finalTotalProductWeight += totalProductWeight;
                    return true;
                }
            });
            //console.log('finalTotalProductWeight......', finalTotalProductWeight);
            return finalTotalProductWeight > 150;
	  },
	//Ends
      updateQuantityBlur: function(e, n, r) {
            var s = n.which ? n.which : n.keyCode;
            if (s > 31 && (s < 48 || s > 57)) return n.preventDefault(), !1;
            if (e.updatableQuantity && e.updatableQuantity.isValid()) {
                if(getWidget.cart().shippingMethod() && getWidget.cart().shippingMethod() !== '') {
                    if(getWidget.checkProductWeight(e.catRefId, e.updatableQuantity)) {
                        getWidget.cart().shippingMethod("300004");    
                    }
                }
                $.Topic(pubsub.topicNames.CART_UPDATE_QUANTITY).publishWith(e.productData(), [{
                    message: "success"
                }]);
                var o = $("#" + r);
                o.focus(), o.fadeOut()
            } else {
                
            }
        },
      
      
      onLoad: function(widget) {
          getWidget = widget;
          $('body').on( 'touchstart','#remove-mobile', function(){
                   $('#remove-desktop').trigger('click'); 
      });
          
      },
      beforeAppear: function(page) {
          var widget = this;
          
          
          
          /* CriteoBasketTag*/
          widget.koProduct_listArray([]);
           for(var i=0; i<widget.cart().items().length; i++){
            var productListObj ={
                    'id':widget.cart().items()[i].productId ,
                    'price': widget.cart().items()[i].originalPrice, 
                    'quantity': widget.cart().items()[i].updatableQuantity()
                }
                widget.koProduct_listArray.push(productListObj)
                
           }
          
          //console.log('koProduct_listArray :' + widget.koProduct_listArray());
          
             $("script[id='BasketPage']").remove();
             if ($("script[id='BasketPage']").length === 0) {
                var criteoBasketTag =  
                '<script type="text/javascript" id="BasketPage">'+ 
                'var dataLayer = dataLayer || [];'+
                'dataLayer.push({'+
                '"event":"BasketPage",'+
                '"PageType":"BasketPage",'+
                '"email":"'+ widget.user().emailAddress() + '",'+
                '"ProductBasketProducts" :' + ko.toJSON(widget.koProduct_listArray()) +
                '});'+
                '</script>';
                $("head").append(criteoBasketTag);
            }
            
             /* CriteoBasketTag*/
            
  
      },
      changeQty : function(item, event) {
            var target = $(event.currentTarget);
            var fieldName = target.attr('id');
            var type      = target.attr('data-type');
            var input = $("input[name='"+fieldName+"']");
            var test = $(event.currentTarget.parentNode.parentNode.children);
            var qtyVal = test[1].value
            //console.log('test',qtyVal)
            var currentVal = parseInt(qtyVal);
            //console.log('currentval',currentVal)
            
           
            
            if (!isNaN(currentVal)) {
                if(type == 'minus') {
                    if(currentVal > test[1].min) {
                        input.val(currentVal - 1).change();
                    } 
                  
                } else if(type == 'plus') {
                    if(currentVal < test[1].max) {
                        input.val(currentVal + 1).change();
                    }
                   
                }
                $(test).focus();
                $(test).blur();
              
            } else {
                input.val(0);
            }
      
            
            return false;
      },
      findMinQauntity:function(updatableQuantity){
          if(updatableQuantity=='1'){
              return true;
          } 
          else{
              return false;
          }
      },
      findMaxQauntity: function(updatableQuantity){
          if(updatableQuantity=='99'){
              return true;
          } 
          else{
              return false;
          }
      },
      
    };
    
    
  }
);

